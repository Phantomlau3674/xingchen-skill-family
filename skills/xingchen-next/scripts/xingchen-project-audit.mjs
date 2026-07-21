import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const skillsRoot = path.resolve(
  process.env.AGENT_SKILLS_HOME || path.dirname(skillRoot),
);
const routerRoot = path.join(skillsRoot, "xingchen-next");
const extendedValidatorPath = path.join(routerRoot, "schema", "validate-project-state.mjs");
const leanValidatorPath = path.join(routerRoot, "schema", "validate-lean-project-state.mjs");
const runtimeDoctorRoot = path.join(
  skillsRoot,
  "remotion-render-adapter",
  "templates",
  "director-motion-kernel",
);

const parseArgs = (argv) => {
  const args = {
    projectRoot: process.cwd(),
    runtimeDoctor: false,
    state: "project-state.json",
    renderPlan: "render-plan.json",
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--project-root") {
      args.projectRoot = argv[++index];
    } else if (token === "--state") {
      args.state = argv[++index];
    } else if (token === "--render-plan") {
      args.renderPlan = argv[++index];
    } else if (token === "--runtime-doctor") {
      args.runtimeDoctor = true;
    } else if (token === "--json") {
      args.json = true;
    }
  }

  return args;
};

const args = parseArgs(process.argv.slice(2));
const projectRoot = path.resolve(process.cwd(), args.projectRoot);
const checks = [];

const add = (status, check, detail = "") => checks.push({status, check, detail});

const exists = (filePath) => fs.existsSync(filePath);
const readJson = (filePath, label, required = false) => {
  if (!exists(filePath)) {
    add(required ? "fail" : "warn", `${label} exists`, filePath);
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    add("pass", `${label} parses`, filePath);
    return parsed;
  } catch (error) {
    add("fail", `${label} parses`, `${filePath}; ${error.message}`);
    return null;
  }
};

if (!exists(projectRoot)) {
  add("fail", "project root exists", projectRoot);
} else {
  add("pass", "project root exists", projectRoot);
}

const statePath = path.resolve(projectRoot, args.state);
const renderPlanPath = path.resolve(projectRoot, args.renderPlan);
const videoProjectPath = path.resolve(projectRoot, "video-project.json");
const boardJsonPath = path.resolve(projectRoot, "visual-director-board.json");
const boardMdPath = path.resolve(projectRoot, "visual-director-board.md");
const artDirectionPath = path.resolve(projectRoot, "art-direction.md");
const lookdevGatePath = path.resolve(projectRoot, "lookdev-gate.yaml");

const state = readJson(statePath, "project-state.json", true);
const isLean = state?.mode === "lean" || state?.kind === "XingchenNextLeanProjectState";
const validatorPath = isLean ? leanValidatorPath : extendedValidatorPath;
const renderPlan = isLean ? null : readJson(renderPlanPath, "render-plan.json", false);

if (!isLean) {
  readJson(videoProjectPath, "video-project.json", false);
  readJson(boardJsonPath, "visual-director-board.json", false);

  for (const [label, filePath] of [
    ["visual-director-board.md", boardMdPath],
    ["art-direction.md", artDirectionPath],
    ["lookdev-gate.yaml", lookdevGatePath],
  ]) {
    add(exists(filePath) ? "pass" : "warn", `${label} exists`, filePath);
  }
}

if (state && exists(validatorPath)) {
  const result = spawnSync(process.execPath, [validatorPath, statePath], {
    cwd: skillRoot,
    shell: false,
    encoding: "utf8",
  });
  if (result.status === 0) {
    add("pass", "project-state validator", "passed");
  } else {
    add("fail", "project-state validator", `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim());
  }
}

if (state) {
  const stage = state.metadata?.active_stage;
  add(stage ? "pass" : "warn", "metadata.active_stage", stage ?? "missing");

  if (isLean) {
    const scenes = Array.isArray(state.scenes) ? state.scenes : [];
    add(scenes.length > 0 || stage === "brief-evidence" || stage === "script-beats" ? "pass" : "warn", "Lean scenes", `${scenes.length} scene(s)`);
  } else {
    const sceneIds = state.mother?.story_mother?.scene_order;
    const sceneSpecs = state.render?.scene_motion_specs;
    if (Array.isArray(sceneIds) && sceneIds.length > 0) {
      add("pass", "story_mother.scene_order", `${sceneIds.length} scene(s)`);
      if (Array.isArray(sceneSpecs)) {
        const specIds = new Set(sceneSpecs.map((item) => item?.scene_id).filter(Boolean));
        const missing = sceneIds.filter((sceneId) => !specIds.has(sceneId));
        add(missing.length === 0 ? "pass" : "fail", "scene_motion_specs cover story scenes", missing.length ? missing.join(", ") : "covered");
      } else {
        add("warn", "render.scene_motion_specs", "missing or not an array");
      }
    } else {
      add("warn", "story_mother.scene_order", "missing or empty");
    }

    const pluginRuns = state.render?.plugin_adapter_runs;
    if (Array.isArray(pluginRuns) && pluginRuns.length > 0) {
      add("pass", "render.plugin_adapter_runs", `${pluginRuns.length} run(s)`);
    } else {
      add("warn", "render.plugin_adapter_runs", "empty; adapter-created evidence needs trace");
    }
  }
}

if (renderPlan) {
  const scenes = Array.isArray(renderPlan.scenes) ? renderPlan.scenes : [];
  add(scenes.length > 0 ? "pass" : "fail", "render-plan scenes", `${scenes.length} scene(s)`);

  const localAssets = [];
  for (const scene of scenes) {
    for (const layer of Array.isArray(scene.layers) ? scene.layers : []) {
      const source = layer?.asset?.source;
      if (source && !/^https?:\/\//i.test(source)) {
        localAssets.push(String(source).replace(/^\/+/, ""));
      }
    }
  }

  for (const source of [...new Set(localAssets)]) {
    const candidates = [
      path.resolve(projectRoot, "public", source),
      path.resolve(projectRoot, source),
    ];
    add(candidates.some(exists) ? "pass" : "fail", `render-plan asset ${source}`, candidates.join(" | "));
  }

  const isVertical = String(renderPlan.meta?.aspect ?? "").includes("9:16") || Number(renderPlan.meta?.height) > Number(renderPlan.meta?.width);
  if (isVertical) {
    add(renderPlan.globals?.safe_areas ? "pass" : "fail", "vertical safe areas", renderPlan.globals?.safe_areas ? "present" : "missing");
  }
}

if (args.runtimeDoctor) {
  if (!exists(runtimeDoctorRoot)) {
    add("fail", "Remotion runtime doctor root exists", runtimeDoctorRoot);
  } else {
    const command = process.platform === "win32" ? "cmd.exe" : "npm";
    const commandArgs = process.platform === "win32"
      ? ["/d", "/s", "/c", "npm", "run", "doctor:static", "--", "--project-root", projectRoot, "--render-plan", args.renderPlan]
      : ["run", "doctor:static", "--", "--project-root", projectRoot, "--render-plan", args.renderPlan];
    const result = spawnSync(command, commandArgs, {
      cwd: runtimeDoctorRoot,
      shell: false,
      encoding: "utf8",
    });
    add(result.status === 0 ? "pass" : "fail", "Remotion runtime doctor static", `${result.error?.message ?? ""}\n${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim());
  }
}

const counts = checks.reduce(
  (acc, item) => {
    acc[item.status] += 1;
    return acc;
  },
  {pass: 0, warn: 0, fail: 0},
);

if (args.json) {
  console.log(JSON.stringify({projectRoot, counts, checks}, null, 2));
} else {
  for (const status of ["pass", "warn", "fail"]) {
    const items = checks.filter((item) => item.status === status);
    if (!items.length) continue;
    console.log(`\n${status.toUpperCase()}`);
    for (const item of items) {
      console.log(`- ${item.check}: ${item.detail}`);
    }
  }
  console.log(`\nSUMMARY pass=${counts.pass} warn=${counts.warn} fail=${counts.fail}`);
}

if (counts.fail > 0) {
  process.exit(1);
}
