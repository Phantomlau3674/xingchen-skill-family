import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath, pathToFileURL} from "node:url";

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value ?? 0)));
const clampPositive = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : fallback;
};

const normalizeRect = (rect) => ({
  x: clamp01(rect?.x),
  y: clamp01(rect?.y),
  w: clamp01(rect?.w),
  h: clamp01(rect?.h),
});

const readJsonIfExists = (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const resolveBlueprintPath = (cwd, explicitPath) => {
  if (explicitPath) {
    return path.resolve(cwd, explicitPath);
  }
  const local = path.resolve(cwd, "motion-blueprint.json");
  if (fs.existsSync(local)) {
    return local;
  }
  const parent = path.resolve(cwd, "..", "motion-blueprint.json");
  if (fs.existsSync(parent)) {
    return parent;
  }
  return null;
};

const resolvePropsPath = (cwd, explicitPath) => path.resolve(cwd, explicitPath ?? "director-script.render.json");

const parseArgs = (argv) => {
  const args = {stdout: false, pretty: true};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--stdout") {
      args.stdout = true;
      continue;
    }
    if (token === "--compact") {
      args.pretty = false;
      continue;
    }
    if (token === "--out") {
      args.out = argv[index + 1];
      index += 1;
      continue;
    }
    if (token === "--props") {
      args.props = argv[index + 1];
      index += 1;
      continue;
    }
    if (token === "--blueprint") {
      args.blueprint = argv[index + 1];
      index += 1;
    }
  }
  return args;
};

const deriveAnchor = (module, side = "center") => {
  const {x, y, w, h} = normalizeRect(module.region);
  if (side === "left") {
    return {x, y: y + h / 2};
  }
  if (side === "right") {
    return {x: x + w, y: y + h / 2};
  }
  if (side === "top") {
    return {x: x + w / 2, y};
  }
  if (side === "bottom") {
    return {x: x + w / 2, y: y + h};
  }
  return {x: x + w / 2, y: y + h / 2};
};

const inferRevealFrom = (module) => {
  const {x, y, w, h} = normalizeRect(module.region);
  const cx = x + w / 2;
  const cy = y + h / 2;
  if (cy < 0.28) {
    return "down";
  }
  if (cy > 0.72) {
    return "up";
  }
  if (cx < 0.34) {
    return "right";
  }
  if (cx > 0.66) {
    return "left";
  }
  return "scale";
};

const activationWindowFor = (scene, track, targetKind, targetId) => {
  const matches = track
    .filter((item) => item.target_kind === targetKind && item.target_id === targetId)
    .sort((left, right) => left.start_s - right.start_s);
  if (!matches.length) {
    return {start_s: 0, end_s: Math.max(0.01, Number(scene.duration_s ?? 0))};
  }
  return {
    start_s: clampPositive(matches[0].start_s),
    end_s: clampPositive(matches[matches.length - 1].end_s, scene.duration_s ?? 0),
  };
};

const connectorPointsFromModules = (connector, moduleMap) => {
  if (Array.isArray(connector.points) && connector.points.length >= 2) {
    return connector.points.map((point) => ({x: clamp01(point.x), y: clamp01(point.y)}));
  }

  const source = moduleMap.get(connector.from_module_id);
  const target = moduleMap.get(connector.to_module_id);
  if (!source || !target) {
    return [];
  }

  const sourceRect = normalizeRect(source.region);
  const targetRect = normalizeRect(target.region);
  const horizontal = sourceRect.x <= targetRect.x;
  const start = deriveAnchor(source, horizontal ? "right" : "left");
  const end = deriveAnchor(target, horizontal ? "left" : "right");
  const middleX = (start.x + end.x) / 2;

  return [
    start,
    {x: middleX, y: start.y},
    {x: middleX, y: end.y},
    end,
  ];
};

const normalizeFocusRegions = (focusRegions, modules) => {
  if (Array.isArray(focusRegions) && focusRegions.length) {
    return focusRegions.map((item, index) => ({
      region_id: item.region_id ?? `focus-${index + 1}`,
      label: item.label,
      region: normalizeRect(item.region ?? item),
      emphasis: item.emphasis ?? "primary",
    }));
  }

  return modules.slice(0, 3).map((module, index) => ({
    region_id: `focus-${module.module_id}`,
    label: module.label,
    region: normalizeRect(module.region),
    emphasis: index === 0 ? "primary" : "secondary",
  }));
};

const normalizeModules = (modules) =>
  (modules ?? []).map((module, index) => ({
    module_id: module.module_id ?? `module-${index + 1}`,
    label: module.label ?? `Module ${index + 1}`,
    kind: module.kind ?? "panel",
    region: normalizeRect(module.region),
    color_role: module.color_role ?? "accent",
    reveal_from: module.reveal_from ?? inferRevealFrom(module),
    glow_strength: clampPositive(module.glow_strength, 0.9),
    lift_px: clampPositive(module.lift_px, 18),
    parallax_px: clampPositive(module.parallax_px, 8),
    border_radius: clampPositive(module.border_radius, 20),
  }));

const normalizeGlyphGroups = (glyphGroups) =>
  (glyphGroups ?? []).map((group, groupIndex) => ({
    group_id: group.group_id ?? `glyph-group-${groupIndex + 1}`,
    behavior: group.behavior ?? "stagger",
    glyphs: (group.glyphs ?? []).map((glyph, glyphIndex) => ({
      glyph_id: glyph.glyph_id ?? `glyph-${groupIndex + 1}-${glyphIndex + 1}`,
      type: glyph.type ?? "badge",
      x: clamp01(glyph.x),
      y: clamp01(glyph.y),
      label: glyph.label,
      icon: glyph.icon,
      accent: glyph.accent,
      size: glyph.size ?? "md",
    })),
  }));

const normalizeActivationTrack = (scene, activationTrack, modules, connectors, glyphGroups, focusRegions) => {
  if (Array.isArray(activationTrack) && activationTrack.length) {
    return activationTrack
      .map((item) => ({
        target_id: item.target_id,
        target_kind: item.target_kind,
        start_s: clampPositive(item.start_s),
        end_s: clampPositive(item.end_s, scene.duration_s ?? 0),
        emphasis: item.emphasis ?? "primary",
      }))
      .sort((left, right) => left.start_s - right.start_s);
  }

  const generated = [];
  const moduleStep = Math.max(0.6, Number(scene.duration_s ?? 1) / Math.max(modules.length + 1, 1));
  modules.forEach((module, index) => {
    const start = Math.min(Number(scene.duration_s ?? 1), index * moduleStep);
    generated.push({
      target_id: module.module_id,
      target_kind: "module",
      start_s: start,
      end_s: Math.min(Number(scene.duration_s ?? 1), start + moduleStep * 1.1),
      emphasis: index === 0 ? "primary" : "secondary",
    });
  });
  connectors.forEach((connector, index) => {
    const start = Math.min(Number(scene.duration_s ?? 1), (index + 0.4) * moduleStep);
    generated.push({
      target_id: connector.connector_id,
      target_kind: "connector",
      start_s: start,
      end_s: Math.min(Number(scene.duration_s ?? 1), start + moduleStep * 0.9),
      emphasis: "secondary",
    });
  });
  glyphGroups.forEach((group, index) => {
    const start = Math.min(Number(scene.duration_s ?? 1), (index + 0.2) * moduleStep);
    generated.push({
      target_id: group.group_id,
      target_kind: "glyph-group",
      start_s: start,
      end_s: Math.min(Number(scene.duration_s ?? 1), start + moduleStep),
      emphasis: "ambient",
    });
  });
  focusRegions.forEach((region, index) => {
    const start = Math.min(Number(scene.duration_s ?? 1), index * moduleStep);
    generated.push({
      target_id: region.region_id,
      target_kind: "focus-region",
      start_s: start,
      end_s: Math.min(Number(scene.duration_s ?? 1), start + moduleStep * 1.2),
      emphasis: index === 0 ? "primary" : "secondary",
    });
  });
  return generated.sort((left, right) => left.start_s - right.start_s);
};

const compileSceneBoardMotion = ({scene, blueprintScene, x6Meta, compiledAt}) => {
  const modules = normalizeModules(blueprintScene.modules);
  const moduleMap = new Map(modules.map((module) => [module.module_id, module]));
  const connectors = (blueprintScene.connectors ?? []).map((connector, index) => ({
    connector_id: connector.connector_id ?? `connector-${index + 1}`,
    from_module_id: connector.from_module_id,
    to_module_id: connector.to_module_id,
    points: connectorPointsFromModules(connector, moduleMap),
    style: connector.style ?? "line",
    animated: connector.animated ?? "draw",
    color_role: connector.color_role ?? "accent",
  }));
  const glyphGroups = normalizeGlyphGroups(blueprintScene.glyph_groups);
  const focusRegions = normalizeFocusRegions(blueprintScene.focus_regions, modules);
  const activationTrack = normalizeActivationTrack(scene, blueprintScene.activation_track, modules, connectors, glyphGroups, focusRegions);
  const revealQueue = new x6Meta.PriorityQueue();
  modules.forEach((module, index) => {
    const window = activationWindowFor(scene, activationTrack, "module", module.module_id);
    revealQueue.insert(window.start_s + index * 0.0001, module.module_id, module.module_id);
  });
  const revealOrder = [];
  while (!revealQueue.isEmpty()) {
    revealOrder.push(revealQueue.remove());
  }

  return {
    motion_blueprint_id: blueprintScene.motion_blueprint_id ?? `motion-${scene.scene_id}`,
    plate_mode: blueprintScene.plate_mode ?? "board-first",
    subtitle_treatment: {
      mode: blueprintScene.subtitle_treatment?.mode ?? "avoid-board",
      placement: blueprintScene.subtitle_treatment?.placement ?? "bottom-center",
      max_width_pct: blueprintScene.subtitle_treatment?.max_width_pct ?? 0.76,
      margin_px: clampPositive(blueprintScene.subtitle_treatment?.margin_px, 52),
      exclusion_zones: (blueprintScene.subtitle_treatment?.exclusion_zones ?? []).map(normalizeRect),
    },
    focus_regions: focusRegions,
    modules,
    connectors,
    glyph_groups: glyphGroups,
    activation_track: activationTrack,
    reveal_order: revealOrder,
    camera_beats: (blueprintScene.camera_beats ?? []).map((beat, index) => ({
      beat_id: beat.beat_id ?? `camera-beat-${index + 1}`,
      start_s: clampPositive(beat.start_s),
      end_s: clampPositive(beat.end_s, scene.duration_s ?? 0),
      move: beat.move ?? "hold",
      focus_region_id: beat.focus_region_id,
      intensity: clampPositive(beat.intensity, 0.6),
    })),
    exclusion_zones: (blueprintScene.manual_overrides?.subtitle_safe_area ?? []).map(normalizeRect),
    manual_overrides: {
      dim_strength: clampPositive(blueprintScene.manual_overrides?.dim_strength, 0.28),
      overlay_opacity: clampPositive(blueprintScene.manual_overrides?.overlay_opacity, 0.88),
      connector_flow_speed: clampPositive(blueprintScene.manual_overrides?.connector_flow_speed, 1),
      subtitle_safe_area: (blueprintScene.manual_overrides?.subtitle_safe_area ?? []).map(normalizeRect),
    },
    compiler: {
      engine: "antv-x6",
      version: x6Meta.version,
      compiled_at: compiledAt,
      source_scene_id: scene.scene_id,
    },
  };
};

const loadX6Meta = async (cwd) => {
  const packageJsonPath = path.resolve(cwd, "node_modules", "@antv", "x6", "package.json");
  const priorityQueuePath = path.resolve(cwd, "node_modules", "@antv", "x6", "es", "common", "algorithm", "priorityqueue.js");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("Missing @antv/x6. Run `npm install` before compiling board motion.");
  }
  if (!fs.existsSync(priorityQueuePath)) {
    throw new Error(`Missing @antv/x6 algorithm entry: ${priorityQueuePath}`);
  }
  const {PriorityQueue} = await import(pathToFileURL(priorityQueuePath).href);
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  return {version: pkg.version ?? "unknown", PriorityQueue};
};

export const loadDirectorPropsWithBoardMotion = async ({cwd = process.cwd(), propsPath, blueprintPath} = {}) => {
  const resolvedPropsPath = resolvePropsPath(cwd, propsPath);
  const props = JSON.parse(fs.readFileSync(resolvedPropsPath, "utf8"));
  const resolvedBlueprintPath = resolveBlueprintPath(cwd, blueprintPath);
  const blueprint = readJsonIfExists(resolvedBlueprintPath);
  if (!blueprint?.scenes?.length) {
    return props;
  }

  const x6Meta = await loadX6Meta(cwd);
  const blueprintSceneMap = new Map(blueprint.scenes.map((scene) => [scene.scene_id, scene]));
  const compiledAt = blueprint.meta?.generated_at ?? "motion-blueprint-static";

  return {
    ...props,
    scenes: (props.scenes ?? []).map((scene) => {
      const blueprintScene = blueprintSceneMap.get(scene.scene_id);
      if (!blueprintScene || scene.scene_kind !== "immersive-bg") {
        return scene;
      }
      return {
        ...scene,
        motion_blueprint_id: blueprintScene.motion_blueprint_id ?? `motion-${scene.scene_id}`,
        board_motion: compileSceneBoardMotion({scene, blueprintScene, x6Meta, compiledAt}),
      };
    }),
  };
};

const maybeRunCli = async () => {
  const currentScriptPath = path.resolve(process.argv[1] ?? "");
  const moduleScriptPath = path.resolve(fileURLToPath(import.meta.url));
  if (!currentScriptPath || currentScriptPath !== moduleScriptPath) {
    return;
  }
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const props = await loadDirectorPropsWithBoardMotion({cwd, propsPath: args.props, blueprintPath: args.blueprint});
  const output = JSON.stringify(props, null, args.pretty ? 2 : 0);
  if (args.stdout) {
    process.stdout.write(output);
    return;
  }
  const target = path.resolve(cwd, args.out ?? "director-script.compiled.preview.json");
  fs.writeFileSync(target, output);
  process.stdout.write(`Compiled board motion preview written to ${target}\n`);
};

await maybeRunCli();
