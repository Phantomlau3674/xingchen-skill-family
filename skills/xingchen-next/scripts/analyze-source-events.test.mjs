import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {analyzeSourceEvents} from "./analyze-source-events.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-source-events-"));
const changingVideo = path.join(dir, "changing.mp4");
const stillVideo = path.join(dir, "still.mp4");

process.on("exit", () => {
  fs.rmSync(dir, {recursive: true, force: true});
});

function runFfmpeg(args) {
  const result = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], {
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
}

runFfmpeg([
  "-f", "lavfi", "-i", "color=c=black:s=160x90:r=20:d=1",
  "-f", "lavfi", "-i", "color=c=white:s=160x90:r=20:d=1",
  "-f", "lavfi", "-i", "color=c=gray:s=160x90:r=20:d=1",
  "-filter_complex", "[0:v][1:v][2:v]concat=n=3:v=1:a=0,format=yuv420p",
  changingVideo,
]);

runFfmpeg([
  "-f", "lavfi", "-i", "color=c=black:s=160x90:r=20:d=3",
  "-pix_fmt", "yuv420p",
  stillVideo,
]);

{
  const result = analyzeSourceEvents(changingVideo, {
    sampleFps: 5,
    threshold: 0.2,
    clusterGapSec: 0.3,
  });
  assert.equal(result.media.width, 160);
  assert.equal(result.media.height, 90);
  assert.ok(result.analysis.sampled_frames >= 14);
  assert.ok(result.analysis.activity_candidates.length >= 2);
  assert.ok(result.analysis.activity_candidates.some((event) => Math.abs(event.peak_sec - 1) <= 0.25));
  assert.ok(result.analysis.activity_candidates.some((event) => Math.abs(event.peak_sec - 2) <= 0.25));
}

{
  const result = analyzeSourceEvents(stillVideo, {sampleFps: 5, threshold: 0.05});
  assert.equal(result.analysis.activity_candidates.length, 0);
  assert.equal(result.analysis.still_intervals.length, 1);
  assert.ok(result.analysis.still_intervals[0].end_sec >= 2.9);
}

console.log("analyze-source-events tests passed");
