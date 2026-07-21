import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");

const parseArgs = (argv) => {
  const args = {
    root: process.env.DOUYIN_SAMPLE_ROOT || "C:\\Users\\liuzh\\Videos\\douyin",
    outDir: path.join(skillRoot, "eval", "skillopt-xingchen", "douyin-split"),
    includeCourse: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--root") {
      args.root = argv[++index];
    } else if (token === "--out-dir") {
      args.outDir = argv[++index];
    } else if (token === "--include-course") {
      args.includeCourse = true;
    }
  }

  return args;
};

const skippedDirs = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "node_modules",
  "dist",
  "build",
  "cache",
  ".cache",
]);

const defaultExcludedTopLevel = new Set([
  "visual-assets",
  "visual-starters",
]);

const processNames = new Set([
  "project-state.json",
  "render-plan.json",
  "video-project.json",
  "visual-director-board.json",
  "visual-director-board.md",
  "art-direction.md",
  "lookdev-gate.yaml",
]);

const remotionMarkerNames = new Set([
  "remotion.config.ts",
  "remotion.config.mts",
  "remotion.config.js",
  "package.json",
]);

const mediaExts = new Set([".mp4", ".mov", ".m4v", ".webm"]);

const toPosix = (value) => value.split(path.sep).join("/");
const rel = (root, value) => toPosix(path.relative(root, value));

const safeId = (name) => name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const walkFiles = (root, limit = 12000) => {
  const files = [];
  const stack = [root];

  while (stack.length > 0 && files.length < limit) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, {withFileTypes: true});
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!skippedDirs.has(entry.name.toLowerCase())) {
          stack.push(fullPath);
        }
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  return files;
};

const summarizeProject = (root, dirent) => {
  const projectRoot = path.join(root, dirent.name);
  const files = walkFiles(projectRoot);
  const processFiles = files.filter((file) => processNames.has(path.basename(file).toLowerCase()));
  const mediaFiles = files.filter((file) => mediaExts.has(path.extname(file).toLowerCase()));
  const remotionMarkers = files.filter((file) => remotionMarkerNames.has(path.basename(file).toLowerCase()));

  const hasProjectSignal = processFiles.length > 0 || mediaFiles.length > 0 || remotionMarkers.length > 0;
  if (!hasProjectSignal) return null;

  return {
    name: dirent.name,
    projectRoot,
    fileCountScanned: files.length,
    processFiles: processFiles.map((file) => rel(projectRoot, file)).sort(),
    mediaFiles: mediaFiles.map((file) => rel(projectRoot, file)).sort(),
    remotionMarkers: remotionMarkers.map((file) => rel(projectRoot, file)).sort(),
  };
};

const writeJson = (filePath, value) => {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const sampleRoot = path.resolve(args.root);
  if (!fs.existsSync(sampleRoot)) {
    throw new Error(`Douyin sample root not found: ${sampleRoot}`);
  }

  const excludedTopLevel = new Set(defaultExcludedTopLevel);
  if (!args.includeCourse) excludedTopLevel.add("course");

  const dirs = fs.readdirSync(sampleRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !excludedTopLevel.has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const samples = dirs
    .map((dirent) => summarizeProject(sampleRoot, dirent))
    .filter(Boolean);

  if (samples.length === 0) {
    throw new Error(`No usable Douyin project samples found under ${sampleRoot}`);
  }

  const splits = {train: [], val: [], test: []};
  for (const [index, sample] of samples.entries()) {
    const bucket = index % 5;
    const split = bucket < 2 ? "train" : bucket === 2 ? "val" : "test";
    splits[split].push({
      id: `douyin-${safeId(sample.name)}-sample-audit`,
      type: "project_sample_audit",
      category: "douyin-real-sample",
      gate: "observe",
      description: `Real Douyin sample ${sample.name}; process=${sample.processFiles.length}, media=${sample.mediaFiles.length}, remotion_markers=${sample.remotionMarkers.length}`,
      project_root: sample.projectRoot,
      max_state_files: 2,
      max_render_plan_files: 3,
    });
  }

  const outDir = path.resolve(args.outDir);
  writeJson(path.join(outDir, "train", "items.json"), splits.train);
  writeJson(path.join(outDir, "val", "items.json"), splits.val);
  writeJson(path.join(outDir, "test", "items.json"), splits.test);
  writeJson(path.join(outDir, "manifest.json"), {
    generated_at: new Date().toISOString(),
    sample_root: sampleRoot,
    excluded_top_level: [...excludedTopLevel].sort(),
    sample_count: samples.length,
    split_counts: Object.fromEntries(Object.entries(splits).map(([key, value]) => [key, value.length])),
    samples,
  });

  console.log(`Douyin sample eval split written: ${outDir}`);
  console.log(`samples=${samples.length} train=${splits.train.length} val=${splits.val.length} test=${splits.test.length}`);
};

main();
