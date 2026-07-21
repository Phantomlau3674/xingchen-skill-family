import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const FUNCTIONS = new Set(["hook", "claim", "explain", "proof", "turn", "payoff", "cta", "breath"]);
const EMPHASIS = new Set(["low", "medium", "high"]);
const VISUAL_ROLES = new Set(["evidence", "diagram", "metaphor", "b-roll", "kinetic-type", "process", "atmosphere", "breath"]);
const VISUAL_SOURCES = new Set(["local-design", "reusable-primitive", "real-proof", "stock", "generated-still", "generated-video", "source-capture"]);
const ANIMATED_A_ROLL_ROLES = new Set(["diagram", "kinetic-type", "process", "metaphor"]);
const TRANSFORMS = new Set(["scatter", "group", "split", "compare", "trace", "count", "reveal", "collapse", "resolve", "build", "transform", "hold"]);

const asArray = (value) => (Array.isArray(value) ? value : []);
const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const ratio = (part, total) => (total > 0 ? Number((part / total).toFixed(4)) : 0);
const closeEnough = (a, b, tolerance = 0.005) => Number.isFinite(a) && Math.abs(a - b) <= tolerance;

export function validateVoiceLedFilm(contract, options = {}) {
  const phase = options.phase ?? "commit";
  const scenes = asArray(options.scenes);
  const scriptBeats = asArray(options.scriptBeats);
  const timelineRevision = options.timelineRevision;
  const errors = [];
  const warnings = [];
  const fail = (message) => errors.push(message);
  const requireValue = (condition, message) => { if (!condition) fail(message); };

  requireValue(isObject(contract), "voice_led_film must be an object");
  if (!isObject(contract)) return {ok: false, errors, warnings, metrics: null};
  requireValue(hasText(contract.version), "voice_led_film.version is required");
  requireValue(["planned", "mapped", "assembled", "verified"].includes(contract.status), "voice_led_film.status is invalid");
  requireValue(contract.visibility_policy === "faceless", "voice_led_film.visibility_policy must be faceless");
  requireValue(Number.isInteger(contract.timeline_revision) && contract.timeline_revision >= 0, "voice_led_film.timeline_revision must be a non-negative integer");
  const animatedARoll = contract.animated_a_roll;
  requireValue(isObject(animatedARoll), "voice_led_film.animated_a_roll is required");
  if (isObject(animatedARoll)) {
    requireValue(animatedARoll.enabled === true, "voice_led_film.animated_a_roll.enabled must be true for faceless narration");
    requireValue(hasText(animatedARoll.continuity_model), "voice_led_film.animated_a_roll.continuity_model is required");
  }
  if (Number.isInteger(timelineRevision)) {
    requireValue(contract.timeline_revision === timelineRevision, "voice_led_film.timeline_revision must match script.timeline_revision");
  }
  if (phase === "plan") requireValue(["mapped", "assembled", "verified"].includes(contract.status), "plan phase requires voice_led_film.status=mapped or later");
  if (phase === "commit") requireValue(contract.status === "verified", "commit phase requires voice_led_film.status=verified");

  const scriptBeatById = new Map(scriptBeats.map((beat) => [beat?.beat_id, beat]));
  const voiceBeats = asArray(contract.voice_beats);
  const voiceBeatById = new Map();
  const coveredScriptBeats = new Set();
  for (const beat of voiceBeats) {
    const tag = `voice beat ${beat?.voice_beat_id || "<unknown>"}`;
    requireValue(hasText(beat?.voice_beat_id), `${tag}.voice_beat_id is required`);
    requireValue(!voiceBeatById.has(beat?.voice_beat_id), `duplicate voice beat ${beat?.voice_beat_id}`);
    voiceBeatById.set(beat?.voice_beat_id, beat);
    requireValue(scriptBeatById.has(beat?.beat_id), `${tag} references unknown script beat ${beat?.beat_id}`);
    if (scriptBeatById.has(beat?.beat_id)) coveredScriptBeats.add(beat.beat_id);
    requireValue(Number.isFinite(beat?.start_sec) && beat.start_sec >= 0, `${tag}.start_sec is invalid`);
    requireValue(Number.isFinite(beat?.end_sec) && beat.end_sec > beat.start_sec, `${tag}.end_sec must be greater than start_sec`);
    const scriptBeat = scriptBeatById.get(beat?.beat_id);
    if (scriptBeat) {
      requireValue(beat.start_sec >= scriptBeat.start_sec - 0.01 && beat.end_sec <= scriptBeat.end_sec + 0.01, `${tag} must stay inside its script beat timing`);
    }
    requireValue(FUNCTIONS.has(beat?.spoken_function), `${tag}.spoken_function is invalid`);
    requireValue(EMPHASIS.has(beat?.emphasis), `${tag}.emphasis is invalid`);
    requireValue(hasText(beat?.visual_job), `${tag}.visual_job is required`);
  }
  requireValue(voiceBeats.length > 0, "voice_led_film.voice_beats must not be empty");

  const sceneById = new Map(scenes.map((scene) => [scene?.scene_id, scene]));
  const shotIds = new Set();
  const usedVoiceBeats = new Set();
  const coveredScenes = new Set();
  let soundSyncedShots = 0;
  const shots = asArray(contract.shots);
  for (const shot of shots) {
    const tag = `voice-led shot ${shot?.shot_id || "<unknown>"}`;
    requireValue(hasText(shot?.shot_id), `${tag}.shot_id is required`);
    requireValue(!shotIds.has(shot?.shot_id), `duplicate voice-led shot ${shot?.shot_id}`);
    shotIds.add(shot?.shot_id);
    requireValue(sceneById.has(shot?.scene_id), `${tag} references unknown scene ${shot?.scene_id}`);
    if (sceneById.has(shot?.scene_id)) coveredScenes.add(shot.scene_id);
    const refs = asArray(shot?.voice_beat_refs);
    requireValue(refs.length > 0, `${tag}.voice_beat_refs must not be empty`);
    for (const ref of refs) {
      requireValue(voiceBeatById.has(ref), `${tag} references unknown voice beat ${ref}`);
      if (voiceBeatById.has(ref)) usedVoiceBeats.add(ref);
    }
    const start = shot?.timeline?.start_sec;
    const end = shot?.timeline?.end_sec;
    requireValue(Number.isFinite(start) && start >= 0, `${tag}.timeline.start_sec is invalid`);
    requireValue(Number.isFinite(end) && end > start, `${tag}.timeline.end_sec must be greater than start_sec`);
    const scene = sceneById.get(shot?.scene_id);
    if (scene && Number.isFinite(start) && Number.isFinite(end)) {
      requireValue(start >= scene.timing?.start_sec - 0.01 && end <= scene.timing?.end_sec + 0.01, `${tag} must stay inside its scene timing`);
    }
    requireValue(VISUAL_ROLES.has(shot?.visual_role), `${tag}.visual_role is invalid`);
    requireValue(VISUAL_SOURCES.has(shot?.visual_source), `${tag}.visual_source is invalid`);
    requireValue(hasText(shot?.viewer_job), `${tag}.viewer_job is required`);
    requireValue(hasText(shot?.screen_action), `${tag}.screen_action is required`);
    const proofRefs = asArray(shot?.proof_refs);
    if (shot?.visual_source === "real-proof") {
      requireValue(proofRefs.length > 0, `${tag} real-proof requires proof_refs`);
      for (const ref of proofRefs) {
        requireValue(asArray(scene?.proof_ref).includes(ref), `${tag} proof ref ${ref} is not registered on its scene`);
      }
    }
    if (["generated-still", "generated-video"].includes(shot?.visual_source)) {
      requireValue(proofRefs.length === 0, `${tag} generated material cannot carry proof_refs`);
    }
    requireValue(hasText(shot?.sound?.sync_anchor), `${tag}.sound.sync_anchor is required`);
    requireValue(Number.isFinite(shot?.sound?.sync_time_sec) && shot.sound.sync_time_sec >= start && shot.sound.sync_time_sec <= end, `${tag}.sound.sync_time_sec must fall inside the shot`);
    requireValue(hasText(shot?.sound?.visual_response), `${tag}.sound.visual_response is required`);
    if (hasText(shot?.sound?.sync_anchor) && Number.isFinite(shot?.sound?.sync_time_sec) && shot.sound.sync_time_sec >= start && shot.sound.sync_time_sec <= end) soundSyncedShots += 1;
    requireValue(hasText(shot?.continuity?.incoming_anchor), `${tag}.continuity.incoming_anchor is required`);
    requireValue(hasText(shot?.continuity?.outgoing_anchor), `${tag}.continuity.outgoing_anchor is required`);
    if (ANIMATED_A_ROLL_ROLES.has(shot?.visual_role)) {
      requireValue(isObject(shot?.a_roll_state), `${tag}.a_roll_state is required for animated A-roll roles`);
      if (isObject(shot?.a_roll_state)) {
        requireValue(hasText(shot.a_roll_state.opening_state), `${tag}.a_roll_state.opening_state is required`);
        requireValue(TRANSFORMS.has(shot.a_roll_state.transform), `${tag}.a_roll_state.transform is invalid`);
        requireValue(hasText(shot.a_roll_state.settled_state), `${tag}.a_roll_state.settled_state is required`);
        requireValue(hasText(shot.a_roll_state.handoff), `${tag}.a_roll_state.handoff is required`);
        requireValue(hasText(shot.a_roll_state.continuity_anchor), `${tag}.a_roll_state.continuity_anchor is required`);
      }
    }
  }
  requireValue(shots.length > 0, "voice_led_film.shots must not be empty");

  const ordered = [...shots].sort((a, b) => (a?.timeline?.start_sec ?? 0) - (b?.timeline?.start_sec ?? 0));
  for (let index = 1; index < ordered.length; index += 1) {
    const gap = ordered[index].timeline.start_sec - ordered[index - 1].timeline.end_sec;
    requireValue(Math.abs(gap) <= 0.05, `voice-led shots ${ordered[index - 1].shot_id} and ${ordered[index].shot_id} have an unexplained gap or overlap`);
  }
  if (scenes.length > 0 && ordered.length > 0) {
    const sceneStart = Math.min(...scenes.map((scene) => scene?.timing?.start_sec).filter(Number.isFinite));
    const sceneEnd = Math.max(...scenes.map((scene) => scene?.timing?.end_sec).filter(Number.isFinite));
    requireValue(closeEnough(ordered[0].timeline.start_sec, sceneStart, 0.05), "voice-led shot plan must begin at the first scene boundary");
    requireValue(closeEnough(ordered.at(-1).timeline.end_sec, sceneEnd, 0.05), "voice-led shot plan must end at the last scene boundary");
  }

  const metrics = {
    voice_beat_coverage_ratio: ratio(usedVoiceBeats.size, voiceBeats.length),
    script_beat_coverage_ratio: ratio(coveredScriptBeats.size, scriptBeats.length),
    scene_coverage_ratio: ratio(coveredScenes.size, scenes.length),
    sound_sync_coverage_ratio: ratio(soundSyncedShots, shots.length),
  };
  for (const [name, value] of Object.entries(metrics)) {
    requireValue(closeEnough(contract.coverage?.[name], value), `voice_led_film.coverage.${name} must equal derived value ${value}`);
    requireValue(value === 1, `voice_led_film requires complete ${name}, found ${value}`);
  }
  return {ok: errors.length === 0, errors, warnings, metrics};
}

function runCli() {
  const inputPath = path.resolve(process.argv[2] ?? "voice-led-film.json");
  if (!fs.existsSync(inputPath)) { console.error(`Voice-led film file not found: ${inputPath}`); process.exit(1); }
  const contract = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const result = validateVoiceLedFilm(contract, {phase: "commit"});
  if (!result.ok) { for (const error of result.errors) console.error(`- ${error}`); process.exit(1); }
  console.log(JSON.stringify(result.metrics));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) runCli();
