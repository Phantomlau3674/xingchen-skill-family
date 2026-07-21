import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

const asArray = (value) => (Array.isArray(value) ? value : []);
const hasText = (value) => typeof value === "string" && value.trim().length > 0;

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error,
  };
}

export function inspectMedia(
  filePath,
  {expectedKind = "any", requireAudio = false, deep = false} = {},
) {
  const errors = [];
  if (!hasText(filePath)) {
    return {ok: false, errors: ["path is empty"], metadata: null};
  }
  if (!fs.existsSync(filePath)) {
    return {ok: false, errors: [`file does not exist: ${filePath}`], metadata: null};
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size === 0) {
    return {ok: false, errors: [`file is not a non-empty regular file: ${filePath}`], metadata: null};
  }

  const probe = run("ffprobe", [
    "-v",
    "error",
    "-show_streams",
    "-show_format",
    "-of",
    "json",
    filePath,
  ]);
  if (probe.error) {
    errors.push(`ffprobe is unavailable: ${probe.error.message}`);
    return {ok: false, errors, metadata: null};
  }
  if (probe.status !== 0) {
    errors.push(`ffprobe could not decode ${filePath}: ${probe.stderr.trim()}`);
    return {ok: false, errors, metadata: null};
  }

  let metadata;
  try {
    metadata = JSON.parse(probe.stdout);
  } catch (error) {
    return {
      ok: false,
      errors: [`ffprobe returned invalid JSON for ${filePath}: ${error.message}`],
      metadata: null,
    };
  }

  const streams = asArray(metadata.streams);
  const videoStreams = streams.filter((stream) => stream?.codec_type === "video");
  const audioStreams = streams.filter((stream) => stream?.codec_type === "audio");
  const durations = [
    Number(metadata.format?.duration),
    ...streams.map((stream) => Number(stream?.duration)),
  ].filter((value) => Number.isFinite(value) && value > 0);

  if (expectedKind === "video") {
    if (videoStreams.length === 0) errors.push("expected a video stream");
    if (durations.length === 0) errors.push("expected positive media duration");
  } else if (expectedKind === "audio") {
    if (audioStreams.length === 0) errors.push("expected an audio stream");
    if (durations.length === 0) errors.push("expected positive audio duration");
  } else if (expectedKind === "image") {
    if (videoStreams.length === 0) errors.push("expected a decodable image stream");
    if (!videoStreams.some((stream) => stream.width > 0 && stream.height > 0)) {
      errors.push("expected positive image dimensions");
    }
  } else if (videoStreams.length === 0 && audioStreams.length === 0) {
    errors.push("expected at least one audio or video stream");
  }

  if (requireAudio && audioStreams.length === 0) {
    errors.push("expected an audio stream matching the accepted narration");
  }

  if (deep && errors.length === 0) {
    const decode = run("ffmpeg", [
      "-v",
      "error",
      "-nostdin",
      "-i",
      filePath,
      "-map",
      "0",
      "-f",
      "null",
      "-",
    ]);
    if (decode.error) {
      errors.push(`ffmpeg is unavailable: ${decode.error.message}`);
    } else if (decode.status !== 0) {
      errors.push(`full decode failed: ${decode.stderr.trim()}`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    metadata: {
      duration_sec: durations.length ? Math.max(...durations) : null,
      video_streams: videoStreams.length,
      audio_streams: audioStreams.length,
      width: videoStreams[0]?.width ?? null,
      height: videoStreams[0]?.height ?? null,
      deep_checked: deep,
    },
  };
}

export function collectMediaEvidence(state, stateDir) {
  const evidence = [];
  const add = (ref, label, expectedKind, requireAudio = false) => {
    if (!hasText(ref)) return;
    evidence.push({
      path: path.isAbsolute(ref) ? ref : path.resolve(stateDir, ref),
      label,
      expectedKind,
      requireAudio,
    });
  };

  add(state.script?.audio_ref, "script.audio_ref", "audio");

  for (const scene of asArray(state.scenes)) {
    for (const frame of asArray(scene?.implementation?.verification?.frames)) {
      add(
        frame?.path,
        `scene ${scene?.scene_id ?? "<unknown>"} frame ${frame?.role ?? "<unknown>"}`,
        "image",
      );
    }
  }

  for (const preview of asArray(state.delivery?.critical_previews)) {
    for (const candidate of asArray(preview?.candidates)) {
      add(
        candidate?.path,
        `critical ${preview?.role ?? "<unknown>"} candidate ${candidate?.candidate_id ?? "<unknown>"}`,
        "video",
        true,
      );
    }
  }

  add(state.delivery?.full_preview?.path, "delivery.full_preview.path", "video", true);

  for (const revision of asArray(state.delivery?.preview_review?.revision_log)) {
    add(revision?.before_path, `revision ${revision?.revision_id} before`, "any");
    add(revision?.after_path, `revision ${revision?.revision_id} after`, "any");
  }

  add(state.delivery?.final_path, "delivery.final_path", "video", true);
  add(state.delivery?.cover_path, "delivery.cover_path", "image");

  const unique = new Map();
  for (const item of evidence) {
    const key = `${item.path}|${item.expectedKind}|${item.requireAudio}`;
    if (!unique.has(key)) unique.set(key, item);
  }
  return [...unique.values()];
}

export function verifyMediaEvidence(state, stateDir, {deep = true} = {}) {
  return collectMediaEvidence(state, stateDir).map((item) => ({
    ...item,
    result: inspectMedia(item.path, {
      expectedKind: item.expectedKind,
      requireAudio: item.requireAudio,
      deep,
    }),
  }));
}

function main() {
  const statePath = path.resolve(
    process.argv.find((token, index) => index > 1 && !token.startsWith("--")) ??
      path.resolve(process.cwd(), "project-state.json"),
  );
  const deep = !process.argv.includes("--probe-only");
  if (!fs.existsSync(statePath)) {
    console.error(`State file not found: ${statePath}`);
    process.exit(1);
  }

  let state;
  try {
    state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch (error) {
    console.error(`Invalid state JSON: ${error.message}`);
    process.exit(1);
  }

  const results = verifyMediaEvidence(state, path.dirname(statePath), {deep});
  const failures = results.filter((item) => !item.result.ok);
  for (const item of results) {
    const status = item.result.ok ? "OK" : "FAIL";
    console.log(`${status} ${item.label}: ${item.path}`);
    for (const error of item.result.errors) console.error(`- ${error}`);
  }
  console.log(
    `Media evidence verification: files=${results.length}, failures=${failures.length}, deep=${deep}`,
  );
  if (failures.length) process.exit(1);
}

if (path.resolve(process.argv[1] ?? "") === path.join(here, "verify-media-evidence.mjs")) {
  main();
}
