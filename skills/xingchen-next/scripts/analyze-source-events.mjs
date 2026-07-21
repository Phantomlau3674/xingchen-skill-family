import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 36;
const FRAME_BYTES = FRAME_WIDTH * FRAME_HEIGHT;

function parseRate(value) {
  if (typeof value !== "string") return null;
  const [numerator, denominator] = value.split("/").map(Number);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    windowsHide: true,
    maxBuffer: 256 * 1024 * 1024,
    ...options,
  });
}

function probeMedia(inputPath) {
  const result = run("ffprobe", [
    "-v",
    "error",
    "-show_streams",
    "-show_format",
    "-of",
    "json",
    inputPath,
  ], {encoding: "utf8"});
  if (result.error) throw new Error(`ffprobe is unavailable: ${result.error.message}`);
  if (result.status !== 0) throw new Error(result.stderr.trim() || "ffprobe failed");
  const probe = JSON.parse(result.stdout);
  const video = (probe.streams ?? []).find((stream) => stream.codec_type === "video");
  if (!video) throw new Error("source event analysis requires a video stream");
  const duration = Math.max(
    0,
    ...[probe.format?.duration, video.duration]
      .map(Number)
      .filter((value) => Number.isFinite(value) && value > 0),
  );
  if (duration <= 0) throw new Error("source video has no positive duration");
  return {
    duration_sec: duration,
    width: video.width,
    height: video.height,
    source_fps: parseRate(video.avg_frame_rate) ?? parseRate(video.r_frame_rate),
    has_audio: (probe.streams ?? []).some((stream) => stream.codec_type === "audio"),
  };
}

function meanAbsoluteDifference(previous, current) {
  let total = 0;
  for (let index = 0; index < FRAME_BYTES; index += 1) {
    total += Math.abs(current[index] - previous[index]);
  }
  return total / FRAME_BYTES / 255;
}

function buildIntervals(events, duration, minimumStillSec) {
  const intervals = [];
  let cursor = 0;
  for (const event of events) {
    if (event.start_sec - cursor >= minimumStillSec) {
      intervals.push({start_sec: Number(cursor.toFixed(3)), end_sec: Number(event.start_sec.toFixed(3))});
    }
    cursor = Math.max(cursor, event.end_sec);
  }
  if (duration - cursor >= minimumStillSec) {
    intervals.push({start_sec: Number(cursor.toFixed(3)), end_sec: Number(duration.toFixed(3))});
  }
  return intervals;
}

export function analyzeSourceEvents(
  inputPath,
  {sampleFps = 5, threshold = 0.025, clusterGapSec = 0.6, minimumStillSec = 0.8} = {},
) {
  if (!fs.existsSync(inputPath)) throw new Error(`source video not found: ${inputPath}`);
  const media = probeMedia(inputPath);
  const decode = run("ffmpeg", [
    "-v",
    "error",
    "-nostdin",
    "-i",
    inputPath,
    "-vf",
    `fps=${sampleFps},scale=${FRAME_WIDTH}:${FRAME_HEIGHT}:flags=area,format=gray`,
    "-f",
    "rawvideo",
    "-pix_fmt",
    "gray",
    "pipe:1",
  ]);
  if (decode.error) throw new Error(`ffmpeg is unavailable: ${decode.error.message}`);
  if (decode.status !== 0) throw new Error(decode.stderr.toString("utf8").trim() || "ffmpeg decode failed");

  const raw = decode.stdout;
  const frameCount = Math.floor(raw.length / FRAME_BYTES);
  const samples = [];
  let previous = null;
  for (let index = 0; index < frameCount; index += 1) {
    const frame = raw.subarray(index * FRAME_BYTES, (index + 1) * FRAME_BYTES);
    const score = previous ? meanAbsoluteDifference(previous, frame) : 0;
    samples.push({
      time_sec: Number((index / sampleFps).toFixed(3)),
      change_score: Number(score.toFixed(5)),
    });
    previous = frame;
  }

  const active = samples.filter((sample) => sample.change_score >= threshold);
  const events = [];
  for (const sample of active) {
    const current = events.at(-1);
    if (!current || sample.time_sec - current.last_active_sec > clusterGapSec) {
      events.push({
        start_sec: Math.max(0, sample.time_sec - 1 / sampleFps),
        end_sec: Math.min(media.duration_sec, sample.time_sec + 1 / sampleFps),
        peak_sec: sample.time_sec,
        peak_change_score: sample.change_score,
        last_active_sec: sample.time_sec,
      });
    } else {
      current.end_sec = Math.min(media.duration_sec, sample.time_sec + 1 / sampleFps);
      current.last_active_sec = sample.time_sec;
      if (sample.change_score > current.peak_change_score) {
        current.peak_sec = sample.time_sec;
        current.peak_change_score = sample.change_score;
      }
    }
  }
  const normalizedEvents = events.map(({last_active_sec, ...event}, index) => ({
    candidate_id: `activity-${String(index + 1).padStart(3, "0")}`,
    start_sec: Number(event.start_sec.toFixed(3)),
    end_sec: Number(event.end_sec.toFixed(3)),
    peak_sec: Number(event.peak_sec.toFixed(3)),
    peak_change_score: Number(event.peak_change_score.toFixed(5)),
  }));

  return {
    schema_version: "1.0.0",
    media: {
      path: path.resolve(inputPath),
      ...media,
    },
    analysis: {
      sample_fps: sampleFps,
      threshold,
      cluster_gap_sec: clusterGapSec,
      sampled_frames: frameCount,
      activity_candidates: normalizedEvents,
      still_intervals: buildIntervals(normalizedEvents, media.duration_sec, minimumStillSec),
    },
  };
}

function parseArgs(argv) {
  const options = {};
  let inputPath = null;
  let outputPath = null;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--output") outputPath = argv[++index];
    else if (token === "--sample-fps") options.sampleFps = Number(argv[++index]);
    else if (token === "--threshold") options.threshold = Number(argv[++index]);
    else if (token === "--cluster-gap-sec") options.clusterGapSec = Number(argv[++index]);
    else if (token === "--minimum-still-sec") options.minimumStillSec = Number(argv[++index]);
    else if (!token.startsWith("-") && !inputPath) inputPath = token;
  }
  return {inputPath, outputPath, options};
}

function runCli() {
  const {inputPath, outputPath, options} = parseArgs(process.argv.slice(2));
  if (!inputPath) {
    console.error("Usage: node analyze-source-events.mjs <video> [--output analysis.json]");
    process.exit(1);
  }
  let result;
  try {
    result = analyzeSourceEvents(path.resolve(inputPath), options);
  } catch (error) {
    console.error(`Source event analysis failed: ${error.message}`);
    process.exit(1);
  }
  const json = `${JSON.stringify(result, null, 2)}\n`;
  if (outputPath) {
    fs.writeFileSync(path.resolve(outputPath), json);
    console.log(`Source event analysis written: ${path.resolve(outputPath)}`);
  } else {
    process.stdout.write(json);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runCli();
}
