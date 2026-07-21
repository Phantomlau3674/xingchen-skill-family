import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {spawnSync} from "node:child_process";
import {loadDirectorPropsWithBoardMotion} from "./compile-board-motion.mjs";

const aspect = process.argv[2] === "horizontal" ? "horizontal" : "vertical";
const cwd = process.cwd();
const compositionId = aspect === "horizontal" ? "DirectorHorizontal" : "DirectorVertical";
const outputName = aspect === "horizontal" ? "director-16x9.mp4" : "director-9x16.mp4";
const outputPath = path.resolve(cwd, "..", "out", outputName);
const propsPath = path.resolve(cwd, "director-script.render.json");
const compiledPropsPath = path.resolve(cwd, "director-script.compiled.runtime.json");
const cliPath = path.resolve(cwd, "node_modules", "@remotion", "cli", "remotion-cli.js");
const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  process.env.HYPERFRAMES_BROWSER_PATH ??
  null;

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
  [
    cliPath,
    "render",
    "src/index.ts",
    compositionId,
    outputPath,
    `--props=${compiledPropsPath}`,
    ...(browserExecutable ? [`--browser-executable=${browserExecutable}`] : []),
  ],
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
