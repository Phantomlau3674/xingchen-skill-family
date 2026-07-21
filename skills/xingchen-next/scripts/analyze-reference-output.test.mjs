import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {analyzeReferenceOutput} from "./analyze-reference-output.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-reference-test-"));
const here = path.dirname(fileURLToPath(import.meta.url));
const cutVideo = path.join(dir, "three-shots.mp4");
const silentVideo = path.join(dir, "silent.mp4");

function ffmpeg(args) {
  const result = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], {
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
}

try {
  ffmpeg([
    "-f", "lavfi", "-i", "color=c=red:s=96x64:r=12:d=1",
    "-f", "lavfi", "-i", "color=c=blue:s=96x64:r=12:d=1",
    "-f", "lavfi", "-i", "color=c=green:s=96x64:r=12:d=1",
    "-f", "lavfi", "-i", "sine=frequency=440:duration=3",
    "-filter_complex", "[0:v][1:v][2:v]concat=n=3:v=1:a=0[v]",
    "-map", "[v]",
    "-map", "3:a",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-shortest",
    cutVideo,
  ]);
  ffmpeg([
    "-f", "lavfi", "-i", "color=c=black:s=96x64:r=12:d=1",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    silentVideo,
  ]);

  const cutAnalysis = analyzeReferenceOutput(cutVideo, {sceneThreshold: 0.2});
  assert.equal(cutAnalysis.has_audio, true);
  assert.equal(cutAnalysis.canvas.width, 96);
  assert.equal(cutAnalysis.canvas.height, 64);
  assert.equal(cutAnalysis.shot_count, 3);
  assert.ok(Math.abs(cutAnalysis.hard_cut_times_sec[0] - 1) < 0.1);
  assert.ok(Math.abs(cutAnalysis.hard_cut_times_sec[1] - 2) < 0.1);
  assert.equal(cutAnalysis.notes.includes("no audio stream"), false);

  const silentAnalysis = analyzeReferenceOutput(silentVideo);
  assert.equal(silentAnalysis.has_audio, false);
  assert.equal(silentAnalysis.shot_count, 1);
  assert.ok(silentAnalysis.notes.includes("no audio stream"));

  const cli = spawnSync(
    process.execPath,
    [path.join(here, "analyze-reference-output.mjs"), cutVideo, "--threshold", "0.2"],
    {encoding: "utf8", windowsHide: true},
  );
  assert.equal(cli.status, 0, cli.stderr);
  const cliOutput = JSON.parse(cli.stdout);
  assert.equal(cliOutput.shot_count, 3);

  console.log("analyze-reference-output tests passed");
} finally {
  fs.rmSync(dir, {recursive: true, force: true});
}
