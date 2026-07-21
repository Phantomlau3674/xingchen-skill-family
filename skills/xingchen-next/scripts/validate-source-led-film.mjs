import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const SOURCE_KINDS = new Set([
  "screen-recording",
  "footage",
  "screenshot",
  "document",
  "still",
]);
const STILL_KINDS = new Set(["screenshot", "document", "still"]);
const DUTIES = new Set([
  "setup",
  "proof",
  "process",
  "comparison",
  "boundary",
  "payoff",
  "texture",
]);
const OWNERS = new Set([
  "source-event",
  "designed-bridge",
  "audio-led",
  "generated-plate",
]);
const SOUND_ROLES = new Set([
  "narration",
  "diegetic",
  "designed",
  "music",
  "silence",
]);
const REPRESENTATION_LAYERS = new Set([
  "source",
  "schematic",
  "physical",
  "stylized",
  "typography",
]);
const TRANSITIONS = new Set([
  "continue",
  "match-cut",
  "cut",
  "deliberate-break",
]);

const asArray = (value) => (Array.isArray(value) ? value : []);
const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const closeEnough = (a, b, tolerance = 0.005) =>
  Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance;
const ratio = (part, total) => (total > 0 ? Number((part / total).toFixed(4)) : 0);

export function validateSourceLedFilm(contract, options = {}) {
  const phase = options.phase ?? "commit";
  const routeMode = options.routeMode ?? "source-led";
  const scenes = asArray(options.scenes);
  const briefSources = asArray(options.briefSources);
  const timelineRevision = options.timelineRevision;
  const errors = [];
  const warnings = [];
  const fail = (message) => errors.push(message);
  const requireValue = (condition, message) => {
    if (!condition) fail(message);
  };

  requireValue(isObject(contract), "source_led_film must be an object");
  if (!isObject(contract)) return {ok: false, errors, warnings, metrics: null};

  requireValue(hasText(contract.version), "source_led_film.version is required");
  requireValue(
    ["planned", "mapped", "assembled", "verified"].includes(contract.status),
    "source_led_film.status is invalid",
  );
  requireValue(
    Number.isInteger(contract.timeline_revision) && contract.timeline_revision >= 0,
    "source_led_film.timeline_revision must be a non-negative integer",
  );
  if (Number.isInteger(timelineRevision)) {
    requireValue(
      contract.timeline_revision === timelineRevision,
      "source_led_film.timeline_revision must match script.timeline_revision",
    );
  }
  if (phase === "plan") {
    requireValue(
      ["mapped", "assembled", "verified"].includes(contract.status),
      "plan phase requires source_led_film.status=mapped or later",
    );
  } else if (phase === "commit") {
    requireValue(contract.status === "verified", "commit phase requires source_led_film.status=verified");
  }

  const briefSourceIds = new Set(briefSources.map((item) => item?.source_id).filter(hasText));
  const inspections = asArray(contract.source_inspections);
  const inspectionByRef = new Map();
  for (const inspection of inspections) {
    const tag = `source inspection ${inspection?.source_ref || "<unknown>"}`;
    requireValue(hasText(inspection?.source_ref), `${tag}.source_ref is required`);
    requireValue(!inspectionByRef.has(inspection?.source_ref), `duplicate source inspection ${inspection?.source_ref}`);
    inspectionByRef.set(inspection?.source_ref, inspection);
    if (briefSourceIds.size > 0) {
      requireValue(briefSourceIds.has(inspection?.source_ref), `${tag} references unknown brief source`);
    }
    requireValue(SOURCE_KINDS.has(inspection?.kind), `${tag}.kind is invalid`);
    requireValue(
      ["planned", "analyzed", "inspected", "rejected"].includes(inspection?.status),
      `${tag}.status is invalid`,
    );
    if (["analyzed", "inspected", "rejected"].includes(inspection?.status)) {
      requireValue(hasText(inspection?.analysis_ref), `${tag}.analysis_ref is required after inspection`);
    }
    if (["screen-recording", "footage"].includes(inspection?.kind)) {
      requireValue(
        Number.isFinite(inspection?.duration_sec) && inspection.duration_sec > 0,
        `${tag}.duration_sec must be positive for video sources`,
      );
    }
  }
  requireValue(inspections.length > 0, "source_led_film.source_inspections must not be empty");

  const events = asArray(contract.events);
  const eventIds = new Set();
  const eventById = new Map();
  for (const event of events) {
    const tag = `source event ${event?.event_id || "<unknown>"}`;
    requireValue(hasText(event?.event_id), `${tag}.event_id is required`);
    requireValue(!eventIds.has(event?.event_id), `duplicate source event ${event?.event_id}`);
    eventIds.add(event?.event_id);
    eventById.set(event?.event_id, event);
    const inspection = inspectionByRef.get(event?.source_ref);
    requireValue(Boolean(inspection), `${tag} references missing source inspection ${event?.source_ref}`);
    requireValue(hasText(event?.visible_change), `${tag}.visible_change is required`);
    requireValue(hasText(event?.inspectable_region), `${tag}.inspectable_region is required`);
    requireValue(DUTIES.has(event?.narrative_duty), `${tag}.narrative_duty is invalid`);
    requireValue(["use", "hold", "reject"].includes(event?.selection), `${tag}.selection is invalid`);
    if (event?.selection === "reject") {
      requireValue(hasText(event?.rejection_reason), `${tag}.rejection_reason is required when rejected`);
    }

    if (inspection && STILL_KINDS.has(inspection.kind)) {
      for (const field of ["source_in_sec", "source_out_sec", "action_peak_sec"]) {
        requireValue(event?.[field] === 0, `${tag}.${field} must be 0 for still sources`);
      }
    } else {
      requireValue(Number.isFinite(event?.source_in_sec) && event.source_in_sec >= 0, `${tag}.source_in_sec is invalid`);
      requireValue(
        Number.isFinite(event?.source_out_sec) && event.source_out_sec > event.source_in_sec,
        `${tag}.source_out_sec must be greater than source_in_sec`,
      );
      requireValue(
        Number.isFinite(event?.action_peak_sec) &&
          event.action_peak_sec >= event.source_in_sec &&
          event.action_peak_sec <= event.source_out_sec,
        `${tag}.action_peak_sec must fall inside the source event`,
      );
      if (Number.isFinite(inspection?.duration_sec)) {
        requireValue(event.source_out_sec <= inspection.duration_sec + 0.01, `${tag} exceeds inspected source duration`);
      }
    }
  }
  requireValue(events.some((event) => event?.selection === "use"), "source_led_film requires at least one selected source event");

  const sceneById = new Map(scenes.map((scene) => [scene?.scene_id, scene]));
  const shots = asArray(contract.shots);
  const shotIds = new Set();
  const coveredSceneIds = new Set();
  let totalDuration = 0;
  let sourceOwnedDuration = 0;
  let soundSyncedShots = 0;

  for (const shot of shots) {
    const tag = `shot ${shot?.shot_id || "<unknown>"}`;
    requireValue(hasText(shot?.shot_id), `${tag}.shot_id is required`);
    requireValue(!shotIds.has(shot?.shot_id), `duplicate shot ${shot?.shot_id}`);
    shotIds.add(shot?.shot_id);
    requireValue(hasText(shot?.scene_id), `${tag}.scene_id is required`);
    requireValue(sceneById.has(shot?.scene_id), `${tag} references unknown scene ${shot?.scene_id}`);
    if (sceneById.has(shot?.scene_id)) coveredSceneIds.add(shot.scene_id);
    requireValue(OWNERS.has(shot?.complexity_owner), `${tag}.complexity_owner is invalid`);
    requireValue(hasText(shot?.viewer_question), `${tag}.viewer_question is required`);
    requireValue(hasText(shot?.viewer_answer), `${tag}.viewer_answer is required`);

    const start = shot?.timeline?.start_sec;
    const end = shot?.timeline?.end_sec;
    requireValue(Number.isFinite(start) && start >= 0, `${tag}.timeline.start_sec is invalid`);
    requireValue(Number.isFinite(end) && end > start, `${tag}.timeline.end_sec must be greater than start_sec`);
    const scene = sceneById.get(shot?.scene_id);
    if (scene && Number.isFinite(start) && Number.isFinite(end)) {
      requireValue(
        start >= scene.timing?.start_sec - 0.01 && end <= scene.timing?.end_sec + 0.01,
        `${tag} must stay inside its owning scene timing`,
      );
      totalDuration += end - start;
      if (shot?.complexity_owner === "source-event") sourceOwnedDuration += end - start;
    }

    const sourceEventRefs = asArray(shot?.source_event_refs);
    if (shot?.complexity_owner === "source-event") {
      requireValue(sourceEventRefs.length > 0, `${tag} source-event owner requires source_event_refs`);
    }
    for (const eventRef of sourceEventRefs) {
      const event = eventById.get(eventRef);
      requireValue(Boolean(event), `${tag} references missing source event ${eventRef}`);
      requireValue(event?.selection === "use", `${tag} can only use selected source events`);
    }
    if (shot?.complexity_owner === "generated-plate") {
      requireValue(hasText(shot?.exception_reason), `${tag} generated-plate requires exception_reason`);
    }

    requireValue(hasText(shot?.camera?.motivation), `${tag}.camera.motivation is required`);
    requireValue(hasText(shot?.camera?.movement), `${tag}.camera.movement is required`);
    requireValue(hasText(shot?.camera?.landing_region), `${tag}.camera.landing_region is required`);

    requireValue(SOUND_ROLES.has(shot?.sound?.dominant_role), `${tag}.sound.dominant_role is invalid`);
    requireValue(hasText(shot?.sound?.sync_anchor), `${tag}.sound.sync_anchor is required`);
    requireValue(
      Number.isFinite(shot?.sound?.sync_time_sec) &&
        shot.sound.sync_time_sec >= start &&
        shot.sound.sync_time_sec <= end,
      `${tag}.sound.sync_time_sec must fall inside the shot timeline`,
    );
    requireValue(hasText(shot?.sound?.visual_response), `${tag}.sound.visual_response is required`);
    if (
      hasText(shot?.sound?.sync_anchor) &&
      Number.isFinite(shot?.sound?.sync_time_sec) &&
      shot.sound.sync_time_sec >= start &&
      shot.sound.sync_time_sec <= end
    ) {
      soundSyncedShots += 1;
    }

    requireValue(hasText(shot?.continuity?.incoming_anchor), `${tag}.continuity.incoming_anchor is required`);
    requireValue(hasText(shot?.continuity?.outgoing_anchor), `${tag}.continuity.outgoing_anchor is required`);
    requireValue(
      REPRESENTATION_LAYERS.has(shot?.continuity?.representation_layer),
      `${tag}.continuity.representation_layer is invalid`,
    );
    requireValue(TRANSITIONS.has(shot?.continuity?.transition), `${tag}.continuity.transition is invalid`);
    if (shot?.continuity?.transition === "deliberate-break") {
      requireValue(hasText(shot?.continuity?.break_reason), `${tag} deliberate-break requires break_reason`);
    }
  }
  requireValue(shots.length > 0, "source_led_film.shots must not be empty");

  const orderedShots = [...shots].sort((a, b) => (a?.timeline?.start_sec ?? 0) - (b?.timeline?.start_sec ?? 0));
  for (let index = 1; index < orderedShots.length; index += 1) {
    const previous = orderedShots[index - 1];
    const current = orderedShots[index];
    const gap = current.timeline.start_sec - previous.timeline.end_sec;
    requireValue(Math.abs(gap) <= 0.05, `shots ${previous.shot_id} and ${current.shot_id} have an unexplained gap or overlap of ${gap.toFixed(3)}s`);

    const transition = current?.continuity?.transition;
    if (["continue", "match-cut"].includes(transition)) {
      requireValue(
        previous?.continuity?.outgoing_anchor === current?.continuity?.incoming_anchor,
        `shots ${previous.shot_id} -> ${current.shot_id} must preserve the named continuity anchor`,
      );
    }
    if (
      previous?.continuity?.representation_layer !== current?.continuity?.representation_layer
    ) {
      requireValue(
        ["match-cut", "deliberate-break"].includes(transition),
        `shots ${previous.shot_id} -> ${current.shot_id} change representation layer without a handoff contract`,
      );
    }
  }

  if (scenes.length > 0 && orderedShots.length > 0) {
    const sceneStart = Math.min(...scenes.map((scene) => scene?.timing?.start_sec).filter(Number.isFinite));
    const sceneEnd = Math.max(...scenes.map((scene) => scene?.timing?.end_sec).filter(Number.isFinite));
    requireValue(closeEnough(orderedShots[0].timeline.start_sec, sceneStart, 0.05), "shot plan must begin at the first scene boundary");
    requireValue(closeEnough(orderedShots.at(-1).timeline.end_sec, sceneEnd, 0.05), "shot plan must end at the last scene boundary");
  }

  const metrics = {
    source_owned_duration_ratio: ratio(sourceOwnedDuration, totalDuration),
    sound_sync_coverage_ratio: ratio(soundSyncedShots, shots.length),
    scene_coverage_ratio: ratio(coveredSceneIds.size, scenes.length),
  };
  for (const [name, value] of Object.entries(metrics)) {
    requireValue(closeEnough(contract.coverage?.[name], value), `source_led_film.coverage.${name} must equal derived value ${value}`);
  }
  if (routeMode === "source-led") {
    requireValue(
      metrics.source_owned_duration_ratio >= 0.5,
      `source-led route requires source_owned_duration_ratio >= 0.5, found ${metrics.source_owned_duration_ratio}`,
    );
  }
  requireValue(metrics.sound_sync_coverage_ratio === 1, "every shot requires a sound sync anchor");
  requireValue(metrics.scene_coverage_ratio === 1, "every scene requires at least one shot contract");

  return {ok: errors.length === 0, errors, warnings, metrics};
}

function runCli() {
  const inputPath = path.resolve(process.argv[2] ?? "source-led-film.json");
  if (!fs.existsSync(inputPath)) {
    console.error(`Source-led film file not found: ${inputPath}`);
    process.exit(1);
  }
  let contract;
  try {
    contract = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (error) {
    console.error(`Invalid JSON: ${error.message}`);
    process.exit(1);
  }
  const result = validateSourceLedFilm(contract, {phase: "commit"});
  if (!result.ok) {
    console.error(`Source-led film validation failed: ${result.errors.length} error(s)`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Source-led film validation passed: events=${contract.events.length}, shots=${contract.shots.length}`);
  console.log(JSON.stringify(result.metrics));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runCli();
}
