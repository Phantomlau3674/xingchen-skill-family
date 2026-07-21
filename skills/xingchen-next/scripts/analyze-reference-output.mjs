import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.error) throw result.error;
  return result;
}

function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function parseRate(value) {
  if (typeof value !== "string") return null;
  const [numerator, denominator = "1"] = value.split("/").map(Number);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  return round(numerator / denominator);
}

function parseVolume(stderr, label) {
  const match = stderr.match(new RegExp(`${label}:\\s*(-?\\d+(?:\\.\\d+)?) dB`));
  return match ? Number(match[1]) : null;
}

export function analyzeReferenceOutput(filePath, {sceneThreshold = 0.25} = {}) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) throw new Error(`File not found: ${resolvedPath}`);
  if (!Number.isFinite(sceneThreshold) || sceneThreshold <= 0 || sceneThreshold >= 1) {
    throw new Error("sceneThreshold must be a number between 0 and 1");
  }

  const probe = run("ffprobe", [
    "-v",
    "error",
    "-show_streams",
    "-show_format",
    "-of",
    "json",
    resolvedPath,
  ]);
  if (probe.status !== 0) throw new Error(probe.stderr.trim() || "ffprobe failed");

  const metadata = JSON.parse(probe.stdout);
  const streams = Array.isArray(metadata.streams) ? metadata.streams : [];
  const video = streams.find((stream) => stream?.codec_type === "video");
  const audio = streams.find((stream) => stream?.codec_type === "audio");
  const duration = Number(metadata.format?.duration ?? video?.duration);
  if (!video || !Number.isFinite(duration) || duration <= 0) {
    throw new Error("Expected a decodable video with positive duration");
  }

  const sceneFilter = `select='gt(scene,${sceneThreshold})',showinfo`;
  const sceneScan = run("ffmpeg", [
    "-v",
    "info",
    "-nostdin",
    "-i",
    resolvedPath,
    "-vf",
    sceneFilter,
    "-an",
    "-f",
    "null",
    "-",
  ]);
  if (sceneScan.status !== 0) throw new Error(sceneScan.stderr.trim() || "scene scan failed");

  const cutTimes = [];
  for (const match of sceneScan.stderr.matchAll(/pts_time:(\d+(?:\.\d+)?)/g)) {
    const value = Number(match[1]);
    if (value > 0 && value < duration && !cutTimes.some((item) => Math.abs(item - value) < 0.01)) {
      cutTimes.push(round(value));
    }
  }
  cutTimes.sort((a, b) => a - b);

  const boundaries = [0, ...cutTimes, round(duration)];
  const shots = boundaries.slice(0, -1).map((start, index) => ({
    index: index + 1,
    start_sec: round(start),
    end_sec: round(boundaries[index + 1]),
    duration_sec: round(boundaries[index + 1] - start),
  }));

  let audioLevels = null;
  if (audio) {
    const volume = run("ffmpeg", [
      "-v",
      "info",
      "-nostdin",
      "-i",
      resolvedPath,
      "-vn",
      "-af",
      "volumedetect",
      "-f",
      "null",
      "-",
    ]);
    if (volume.status === 0) {
      audioLevels = {
        mean_volume_db: parseVolume(volume.stderr, "mean_volume"),
        max_volume_db: parseVolume(volume.stderr, "max_volume"),
      };
    }
  }

  const notes = [];
  if (!audio) notes.push("no audio stream");
  if (cutTimes.length === 0) notes.push("no hard cuts detected at this threshold");
  if (audioLevels?.max_volume_db != null && audioLevels.max_volume_db >= -0.5) {
    notes.push("audio peaks near the digital ceiling");
  }

  return {
    path: resolvedPath,
    duration_sec: round(duration),
    canvas: {width: video.width ?? null, height: video.height ?? null},
    fps: parseRate(video.avg_frame_rate || video.r_frame_rate),
    video_codec: video.codec_name ?? null,
    has_audio: Boolean(audio),
    audio: audio
      ? {
          codec: audio.codec_name ?? null,
          sample_rate: Number(audio.sample_rate) || null,
          channels: audio.channels ?? null,
          ...audioLevels,
        }
      : null,
    scene_threshold: sceneThreshold,
    hard_cut_times_sec: cutTimes,
    shot_count: shots.length,
    mean_shot_duration_sec: round(duration / shots.length),
    shots,
    notes,
  };
}

function readThreshold(argv) {
  const equals = argv.find((token) => token.startsWith("--threshold="));
  if (equals) return Number(equals.slice("--threshold=".length));
  const index = argv.indexOf("--threshold");
  return index >= 0 ? Number(argv[index + 1]) : 0.25;
}

function main() {
  const args = process.argv.slice(2);
  const filePath = args.find((token, index) =>
    !token.startsWith("--") && args[index - 1] !== "--threshold",
  );
  if (!filePath) {
    console.error("Usage: node analyze-reference-output.mjs <video> [--threshold 0.25]");
    process.exit(1);
  }
  try {
    console.log(JSON.stringify(analyzeReferenceOutput(filePath, {
      sceneThreshold: readThreshold(args),
    }), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (path.resolve(process.argv[1] ?? "") === path.join(here, "analyze-reference-output.mjs")) {
  main();
}
