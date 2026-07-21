import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {fileURLToPath, pathToFileURL} from "node:url";


const testsDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(testsDir, "..");
const kernel = path.join(skillRoot, "templates", "director-motion-kernel");
const compilerPath = path.join(kernel, "scripts", "compile-board-motion.mjs");
const {loadDirectorPropsWithBoardMotion} = await import(pathToFileURL(compilerPath).href);


test("compiler preserves props when no board blueprint exists", async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "remotion-adapter-"));
  try {
    const props = {
      meta: {project_id: "fixture", scene_count: 1},
      scenes: [{scene_id: "s01", scene_kind: "statement", duration_s: 2}],
    };
    const propsPath = path.join(temp, "props.json");
    fs.writeFileSync(propsPath, JSON.stringify(props));

    const result = await loadDirectorPropsWithBoardMotion({
      cwd: temp,
      propsPath,
      blueprintPath: path.join(temp, "missing-blueprint.json"),
    });
    assert.deepEqual(result, props);
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});


test("compiler CLI supports compact stdout without writing a file", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "remotion-adapter-cli-"));
  try {
    const props = {meta: {project_id: "stdout-fixture"}, scenes: []};
    const propsPath = path.join(temp, "props.json");
    fs.writeFileSync(propsPath, JSON.stringify(props));

    const result = spawnSync(
      process.execPath,
      [
        compilerPath,
        "--props", propsPath,
        "--blueprint", path.join(temp, "missing.json"),
        "--stdout",
        "--compact",
      ],
      {cwd: temp, encoding: "utf8"},
    );
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), props);
    assert.deepEqual(fs.readdirSync(temp).sort(), ["props.json"]);
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});


test("render-plan fixture declares consistent scene metadata", () => {
  const plan = JSON.parse(fs.readFileSync(path.join(kernel, "render-plan.json"), "utf8"));
  assert.equal(plan.meta.scene_count, plan.scenes.length);
  assert.equal(new Set(plan.scenes.map((scene) => scene.scene_id)).size, plan.scenes.length);
  const totalDuration = plan.scenes.reduce((sum, scene) => sum + Number(scene.duration_s ?? 0), 0);
  assert.ok(Math.abs(totalDuration - Number(plan.meta.duration_s)) < 0.001);
  for (const scene of plan.scenes) {
    assert.ok(scene.scene_id);
    assert.ok(Number(scene.duration_s) > 0);
    assert.ok(["locked", "approved", "review", "pending"].includes(scene.review_state));
  }
});


test("Remotion packages stay on one exact version", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(kernel, "package.json"), "utf8"));
  const versions = Object.entries(pkg.dependencies)
    .filter(([name]) => name === "remotion" || name.startsWith("@remotion/"))
    .map(([, version]) => version);
  assert.ok(versions.length > 1);
  assert.equal(new Set(versions).size, 1);
  assert.doesNotMatch(versions[0], /^[~^]/);
});


test("adapter scripts contain no user-specific paths or shell execution", () => {
  const scriptDir = path.join(kernel, "scripts");
  for (const name of fs.readdirSync(scriptDir).filter((entry) => entry.endsWith(".mjs"))) {
    const source = fs.readFileSync(path.join(scriptDir, name), "utf8");
    assert.doesNotMatch(source, /[A-Za-z]:\\Users\\/i, name);
    assert.doesNotMatch(source, /\/Users\//, name);
    assert.doesNotMatch(source, /\/home\/[^/]+\//, name);
    assert.doesNotMatch(source, /shell\s*:\s*true/, name);
  }
});
