import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {inspectMedia} from "./verify-media-evidence.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-media-test-"));
const here = path.dirname(fileURLToPath(import.meta.url));
const videoWithAudio = path.join(dir, "with-audio.mp4");
const silentVideo = path.join(dir, "silent.mp4");
const fakeVideo = path.join(dir, "fake.mp4");

function ffmpeg(args) {
  const result = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], {
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
}

try {
  ffmpeg([
    "-f",
    "lavfi",
    "-i",
    "color=c=black:s=64x64:r=10:d=0.5",
    "-f",
    "lavfi",
    "-i",
    "sine=frequency=440:duration=0.5",
    "-shortest",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    videoWithAudio,
  ]);
  ffmpeg([
    "-f",
    "lavfi",
    "-i",
    "color=c=black:s=64x64:r=10:d=0.5",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    silentVideo,
  ]);
  fs.writeFileSync(fakeVideo, "not a video");

  const real = inspectMedia(videoWithAudio, {
    expectedKind: "video",
    requireAudio: true,
    deep: true,
  });
  assert.equal(real.ok, true, real.errors.join("\n"));
  assert.equal(real.metadata.video_streams, 1);
  assert.equal(real.metadata.audio_streams, 1);
  assert.equal(real.metadata.deep_checked, true);

  const missingAudio = inspectMedia(silentVideo, {
    expectedKind: "video",
    requireAudio: true,
  });
  assert.equal(missingAudio.ok, false);
  assert.match(missingAudio.errors.join("\n"), /expected an audio stream/);

  const fake = inspectMedia(fakeVideo, {expectedKind: "video"});
  assert.equal(fake.ok, false);
  assert.match(fake.errors.join("\n"), /ffprobe could not decode/);

  const statePath = path.join(dir, "project-state.json");
  fs.writeFileSync(
    statePath,
    JSON.stringify({
      script: {audio_ref: videoWithAudio},
      scenes: [],
      delivery: {
        critical_previews: [
          {
            role: "hook",
            candidates: [
              {candidate_id: "hook-a", path: videoWithAudio},
              {candidate_id: "hook-b", path: videoWithAudio},
            ],
          },
        ],
        full_preview: {path: videoWithAudio},
        preview_review: {revision_log: []},
        final_path: "",
        cover_path: "",
      },
    }),
  );
  const cli = spawnSync(
    process.execPath,
    [path.join(here, "verify-media-evidence.mjs"), statePath],
    {encoding: "utf8", windowsHide: true},
  );
  assert.equal(cli.status, 0, cli.stderr);
  assert.match(cli.stdout, /failures=0, deep=true/);

  console.log("verify-media-evidence tests passed");
} finally {
  fs.rmSync(dir, {recursive: true, force: true});
}
