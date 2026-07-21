import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {spawnSync} from "node:child_process";
import {loadDirectorPropsWithBoardMotion} from "./compile-board-motion.mjs";

const aspect = process.argv[2] === "horizontal" ? "horizontal" : "vertical";
const frameArg = Number(process.argv[3] ?? "0");
const outputArg = process.argv[4] ?? `director-frame-${String(Math.max(0, frameArg)).padStart(5, "0")}.png`;
const frame = Number.isFinite(frameArg) ? Math.max(0, Math.round(frameArg)) : 0;
const cwd = process.cwd();
const compositionId = aspect === "horizontal" ? "DirectorHorizontal" : "DirectorVertical";
const outputPath = path.resolve(cwd, "..", "out", outputArg);
const propsPath = path.resolve(cwd, "director-script.render.json");
const compiledPropsPath = path.resolve(cwd, "director-script.compiled.runtime.json");
const cliPath = path.resolve(cwd, "node_modules", "@remotion", "cli", "remotion-cli.js");

if (!fs.existsSync(propsPath)) {
  throw new Error(`Missing props file: ${propsPath}`);
}

if (!fs.existsSync(cliPath)) {
  throw new Error(`Missing Remotion CLI entry: ${cliPath}`);
}

const props = await loadDirectorPropsWithBoardMotion({cwd, propsPath});
fs.writeFileSync(compiledPropsPath, JSON.stringify(props, null, 2));

fs.mkdirSync(path.dirname(outputPath), {recursive: true});

const result = spawnSync(
  process.execPath,
  [cliPath, "still", "src/index.ts", compositionId, outputPath, "--frame", String(frame), `--props=${compiledPropsPath}`],
  {
    cwd,
    stdio: "inherit",
    env: process.env,
  },
);

if (typeof result.status === "number" && result.status !== 0) {
  process.exit(result.status);
}

if (result.error) {
  throw result.error;
}
