import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const validatorPath = path.join(here, "validate-lean-project-state.mjs");
const invariantManifestPath = path.join(
  skillRoot,
  "references",
  "invariants.lean.json",
);
const templatePath = path.join(
  skillRoot,
  "templates",
  "project-state.lean.template.json",
);
const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-media-fixtures-"));

function runFfmpeg(args) {
  const result = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], {
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
}

const fixturePaths = {
  audio: path.join(fixtureRoot, "audio.wav"),
  redVideo: path.join(fixtureRoot, "red.mp4"),
  blueVideo: path.join(fixtureRoot, "blue.mp4"),
  image: path.join(fixtureRoot, "frame.png"),
};

runFfmpeg([
  "-f",
  "lavfi",
  "-i",
  "sine=frequency=440:duration=1",
  "-c:a",
  "pcm_s16le",
  fixturePaths.audio,
]);

for (const [color, output] of [
  ["red", fixturePaths.redVideo],
  ["blue", fixturePaths.blueVideo],
]) {
  runFfmpeg([
    "-f",
    "lavfi",
    "-i",
    `color=c=${color}:s=64x64:r=10:d=1`,
    "-f",
    "lavfi",
    "-i",
    "sine=frequency=440:duration=1",
    "-shortest",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    output,
  ]);
}

runFfmpeg([
  "-f",
  "lavfi",
  "-i",
  "color=c=white:s=64x64",
  "-frames:v",
  "1",
  fixturePaths.image,
]);

process.on("exit", () => {
  fs.rmSync(fixtureRoot, {recursive: true, force: true});
});

{
  const manifest = JSON.parse(fs.readFileSync(invariantManifestPath, "utf8"));
  const validatorSource = fs.readFileSync(validatorPath, "utf8");
  assert.equal(manifest.mode, "lean");
  assert.equal(manifest.blocking_ids.length, 15);
  assert.equal(new Set(manifest.blocking_ids).size, manifest.blocking_ids.length);
  assert.doesNotMatch(
    validatorSource,
    /invariants\.extended|cross-skill-invariants/,
  );
}

function cloneTemplate() {
  return JSON.parse(fs.readFileSync(templatePath, "utf8"));
}

function validate(state, files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-lean-"));
  const statePath = path.join(dir, "project-state.json");

  const sourceInspectionFiles = state.extensions?.source_led_film
    ? {"analysis/source-pr.json": JSON.stringify({source_ref: "source-pr"})}
    : {};
  for (const [relativePath, content] of Object.entries({...sourceInspectionFiles, ...files})) {
    const filePath = path.join(dir, relativePath);
    fs.mkdirSync(path.dirname(filePath), {recursive: true});
    if (content && typeof content === "object" && content.fixture) {
      fs.copyFileSync(fixturePaths[content.fixture], filePath);
    } else {
      fs.writeFileSync(filePath, content);
    }
  }

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  const result = spawnSync(process.execPath, [validatorPath, statePath], {
    encoding: "utf8",
  });
  fs.rmSync(dir, {recursive: true, force: true});
  return result;
}

function setApproval(state, checkpoint, status) {
  const decision = state.workflow.approvals.find(
    (item) => item.checkpoint === checkpoint,
  );
  assert.ok(decision, `missing approval ${checkpoint}`);
  decision.status = status;
}

function makeCommittedHarness() {
  return {
    version: "1.0.0",
    run_id: "run-production-test",
    status: "committed",
    runtime_policy: {
      thinking_mode: "deep",
      quality_mode: "quality",
      permission_scope: "project",
      capability_permissions: {
        motion_graphics: "ask",
        video_generation: "deny",
        image_generation: "ask",
      },
    },
    route: {
      workflow_skill: "Explainer Video",
      design_style: "project-original",
      design_style_source: "accepted-example",
      design_style_spec_ref: "style/project-original-v1",
      visual_format: "film",
      output_grammar: "source context reveals a causal split and then resolves it",
      artifact_ladder: ["beat map", "scene mechanism", "rendered preview"],
      next_artifact: "rendered preview",
      medium_strategy: {
        mode: "source-led",
        choice_source: "brief",
        modalities: ["source-proof", "motion-graphic"],
        exception_reason: "",
      },
      batch_policy: {
        planned_visual_assets: 1,
        style_basis: "accepted-example",
        representative_status: "not-needed",
        expansion_allowed: false,
      },
    },
    scene_strategies: [
      {
        scene_id: "scene-01",
        topology: "source-evidence",
        layout_signature: "full-proof-split",
        duration_sec: 8,
        static_hold_sec: 2,
        operators: ["source_reveal", "camera_reveal"],
        before_state: "The viewer sees a fast first pass.",
        after_state: "The viewer sees why missing context forced rework.",
        causal_force: "The proof region splits first pass from correction.",
        continuity_anchor: "The pull request screenshot persists.",
        motion_carries_meaning: true,
        proof_frames: [
          {role: "before", ref: "frames/scene-01-before.png"},
          {role: "after", ref: "frames/scene-01-after.png"},
        ],
      },
    ],
    anti_ppt: {
      max_card_scene_ratio: 0.35,
      max_repeated_layout_ratio: 0.5,
      max_static_hold_ratio: 0.6,
      card_scene_ratio: 0,
      repeated_layout_ratio: 0,
      static_hold_ratio: 0.25,
      editorial_card_exception: false,
      exception_reason: "",
      decision: "pass",
      blocking_reasons: [],
    },
    trace: [
      "route",
      "preflight",
      "plan",
      "authorize",
      "execute",
      "track",
      "verify",
      "commit",
    ].map((stage) => ({
      stage,
      status: "success",
      at: "2026-07-13T12:00:00+08:00",
      evidence_ref: `trace/${stage}.json`,
    })),
    receipts: {
      asset_authoring_ref: "receipts/asset.json",
      timeline_placement_ref: "receipts/timeline.json",
      composed_frame_verification_ref: "receipts/frame-grid.jpg",
    },
    jobs: [
      {
        job_id: "local-render-1",
        capability: "local_render",
        idempotency_key: "local-render-scene-01-v1",
        intent_fingerprint: "sha256:local-render-scene-01-v1",
        server_idempotent: true,
        attempt: 1,
        status: "succeeded",
        progress: 100,
        last_checked_at: "2026-07-13T12:01:00+08:00",
        output_ref: "previews/full.mp4",
        charge_status: "not_charged",
      },
    ],
  };
}

function makeSourceLedFilm() {
  return {
    version: "1.0.0",
    status: "verified",
    timeline_revision: 1,
    source_inspections: [
      {
        source_ref: "source-pr",
        kind: "screenshot",
        status: "inspected",
        analysis_ref: "analysis/source-pr.json",
      },
    ],
    events: [
      {
        event_id: "event-pr-proof",
        source_ref: "source-pr",
        source_in_sec: 0,
        source_out_sec: 0,
        action_peak_sec: 0,
        visible_change: "The missing context line becomes the dominant proof region.",
        inspectable_region: "error line and pull request title",
        narrative_duty: "proof",
        selection: "use",
        rejection_reason: "",
      },
    ],
    shots: [
      {
        shot_id: "shot-scene-01",
        scene_id: "scene-01",
        complexity_owner: "source-event",
        source_event_refs: ["event-pr-proof"],
        viewer_question: "Why did the fast first pass require correction?",
        viewer_answer: "The real pull request reveals the missing context.",
        timeline: {start_sec: 0, end_sec: 8},
        camera: {
          motivation: "Begin with source context, then isolate the decisive line.",
          movement: "restrained push from full pull request to the error line",
          landing_region: "error line and changed file count",
        },
        sound: {
          dominant_role: "narration",
          sync_anchor: "spoken phrase: missing context",
          sync_time_sec: 4,
          visual_response: "The source crop lands on the omitted context line.",
        },
        continuity: {
          incoming_anchor: "pull request window",
          outgoing_anchor: "error line highlight",
          representation_layer: "source",
          transition: "continue",
          break_reason: "",
        },
        exception_reason: "",
      },
    ],
    coverage: {
      source_owned_duration_ratio: 1,
      sound_sync_coverage_ratio: 1,
      scene_coverage_ratio: 1,
    },
  };
}

function makeVoiceLedFilm() {
  return {
    version: "1.0.0",
    status: "verified",
    timeline_revision: 1,
    visibility_policy: "faceless",
    animated_a_roll: {
      enabled: true,
      continuity_model: "voice-owned animated primary picture",
      primary_tracks: ["V1"],
      state_machine_required_for_roles: ["diagram", "kinetic-type", "process", "metaphor"],
    },
    voice_beats: [
      {
        voice_beat_id: "voice-01",
        beat_id: "beat-01",
        start_sec: 0,
        end_sec: 8,
        spoken_function: "explain",
        emphasis: "high",
        visual_job: "Make the difference between speed and missing context visible.",
      },
    ],
    shots: [
      {
        shot_id: "shot-scene-01",
        scene_id: "scene-01",
        voice_beat_refs: ["voice-01"],
        timeline: {start_sec: 0, end_sec: 8},
        visual_role: "diagram",
        visual_source: "local-design",
        viewer_job: "Understand why a fast first pass still creates rework.",
        screen_action: "Speed and context separate, then the missing-context path expands.",
        proof_refs: [],
        sound: {
          sync_anchor: "spoken phrase: missing context",
          sync_time_sec: 4,
          visual_response: "The missing-context path opens at the stressed phrase.",
        },
        continuity: {
          incoming_anchor: "speed line",
          outgoing_anchor: "rework loop",
        },
        a_roll_state: {
          opening_state: "A speed line moves cleanly toward the result.",
          transform: "split",
          settled_state: "The speed line and missing-context path are separated and readable.",
          handoff: "The missing-context path bends into the rework loop.",
          continuity_anchor: "speed line",
        },
      },
    ],
    coverage: {
      voice_beat_coverage_ratio: 1,
      script_beat_coverage_ratio: 1,
      scene_coverage_ratio: 1,
      sound_sync_coverage_ratio: 1,
    },
  };
}

function makeProductionState() {
  const state = cloneTemplate();
  state.brief = {
    thesis: "A faster model can still create more rework when context is missing.",
    audience: "Curious non-specialists watching on Douyin.",
    goal: "Make the causal chain visible in under one minute.",
    sources: [
      {
        source_id: "source-pr",
        kind: "screenshot",
        ref: "assets/pr.png",
        proof_eligible: true,
        notes: "Real pull request screenshot.",
      },
    ],
    claims: [
      {
        claim_id: "claim-rework",
        text: "The sample pull request required a second correction.",
        factual: true,
        source_refs: ["source-pr"],
      },
    ],
  };
  state.script = {
    spoken_text: "The model was fast. The missing context made the second pass necessary.",
    audio_ref: "audio/final.wav",
    timing_basis: "actual-audio",
    timeline_revision: 1,
    beats: [
      {
        beat_id: "beat-01",
        text: "Show the first pass and reveal the missing context.",
        start_sec: 0,
        end_sec: 8,
      },
    ],
    content_approved: true,
  };
  state.scenes = [
    {
      scene_id: "scene-01",
      beat_id: "beat-01",
      knowledge_change: "The viewer sees that speed and context are separate variables.",
      dominant_visual: "The real PR screenshot splits into first pass and correction.",
      motion_action: "compare",
      proof_ref: ["source-pr"],
      safe_region: {
        subtitle: "bottom 18%",
        must_not_cover: ["error line", "changed file count"],
        source_must_preserve: ["error text", "pull request title"],
      },
      timing: {start_sec: 0, end_sec: 8},
      implementation: {
        route: "remotion",
        visual_kind: "source-proof",
        status: "implemented",
        component_path: "src/scenes/Scene01.tsx",
        timeline_revision: 1,
      },
      semantic_relation: null,
    },
  ];
  state.extensions.agent_harness = makeCommittedHarness();
  state.extensions.source_led_film = makeSourceLedFilm();
  setApproval(state, "Content Lock", "approved");
  return state;
}

function makeCriticalPreview(role, reviewedAt) {
  const aPath = `previews/${role}-a.mp4`;
  const bPath = `previews/${role}-b.mp4`;
  return {
    role,
    path: aPath,
    audio_ref: "audio/final.wav",
    duration_sec: 1,
    viewport: "phone-downsample",
    reviewed_at: reviewedAt,
    timeline_revision: 1,
    candidates: [
      {
        candidate_id: `${role}-a`,
        hypothesis: "Lead with source context, then isolate the decisive detail.",
        path: aPath,
        audio_ref: "audio/final.wav",
        duration_sec: 1,
        viewport: "phone-downsample",
      },
      {
        candidate_id: `${role}-b`,
        hypothesis: "Lead with the decisive detail, then reveal its source context.",
        path: bPath,
        audio_ref: "audio/final.wav",
        duration_sec: 1,
        viewport: "phone-downsample",
      },
    ],
    selected_candidate_id: `${role}-a`,
    selection_reason: "The selected cut preserved proof trust while keeping the speech beat clear.",
  };
}

function makeFinalEntryState() {
  const state = makeProductionState();
  state.metadata.active_stage = "final-delivery";
  state.metadata.stage_status = "active";
  state.scenes[0].implementation.status = "previewed";
  setApproval(state, "Preview Lock", "approved");
  state.delivery = {
    status: "approved-to-render",
    critical_previews: [
      makeCriticalPreview("hook", "2026-07-10T12:00:00+08:00"),
      makeCriticalPreview("hardest-proof", "2026-07-10T12:01:00+08:00"),
      makeCriticalPreview("payoff", "2026-07-10T12:02:00+08:00"),
    ],
    full_preview: {
      path: "previews/full.mp4",
      audio_ref: "audio/final.wav",
      duration_sec: 1,
      viewport: "phone-downsample",
      reviewed_at: "2026-07-10T12:05:00+08:00",
      timeline_revision: 1,
    },
    preview_review: {
      completed: true,
      blind_review_completed: true,
      blocking_issues: [],
      revision_log: [],
      notes: "The reviewer restated the thesis without reading the plan.",
    },
    platform_draft: {
      checked: true,
      device: "test-phone",
      checked_at: "2026-07-10T12:10:00+08:00",
    },
    final_path: "",
    cover_path: "",
    learning: {
      observation: "",
      evidence: "",
      likely_cause: "",
      next_change: "",
      comparison_metric: "",
    },
  };
  return state;
}

const previewFiles = {
  "audio/final.wav": {fixture: "audio"},
  "previews/hook-a.mp4": {fixture: "redVideo"},
  "previews/hook-b.mp4": {fixture: "blueVideo"},
  "previews/hardest-proof-a.mp4": {fixture: "redVideo"},
  "previews/hardest-proof-b.mp4": {fixture: "blueVideo"},
  "previews/payoff-a.mp4": {fixture: "redVideo"},
  "previews/payoff-b.mp4": {fixture: "blueVideo"},
  "previews/full.mp4": {fixture: "redVideo"},
};

{
  const result = validate(cloneTemplate());
  assert.equal(result.status, 0, result.stderr);
}

{
  const state = makeProductionState();
  state.metadata.active_stage = "scene-production";
  setApproval(state, "Content Lock", "pending");
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Content Lock must be approved/);
}

{
  const state = cloneTemplate();
  state.workflow.approvals = [
    state.workflow.approvals[0],
    {...state.workflow.approvals[0]},
  ];
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /exactly one Preview Lock/);
}

{
  const state = cloneTemplate();
  state.visual_policy.reference_style = {
    selected: true,
    source: "reference-video",
    selection_reason: "",
    selected_traits: [],
    avoid_copying: [],
  };
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /selected style needs selection_reason/);
}

{
  const state = makeProductionState();
  state.metadata.active_stage = "scene-production";
  delete state.extensions.source_led_film;
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /extensions.source_led_film is required for source-led production/);
}

{
  const state = makeProductionState();
  state.metadata.active_stage = "scene-production";
  state.extensions.agent_harness.route.medium_strategy.mode = "narration-led";
  state.extensions.agent_harness.route.medium_strategy.modalities = [
    "motion-graphic",
    "typography",
  ];
  delete state.extensions.voice_led_film;
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /extensions.voice_led_film is required for narration-led faceless production/);
}

{
  const state = makeProductionState();
  state.metadata.active_stage = "scene-production";
  state.extensions.agent_harness.route.medium_strategy.mode = "narration-led";
  state.extensions.agent_harness.route.medium_strategy.modalities = [
    "motion-graphic",
    "typography",
  ];
  state.extensions.voice_led_film = makeVoiceLedFilm();
  const result = validate(state);
  assert.equal(result.status, 0, result.stderr);
}

{
  const state = makeProductionState();
  state.metadata.active_stage = "scene-production";
  state.extensions.source_led_film.source_inspections[0].analysis_ref = "analysis/missing.json";
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /analysis_ref does not exist/);
}

{
  const state = makeProductionState();
  state.scenes[0].implementation.visual_kind = "diagram";
  state.scenes[0].semantic_relation = null;
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /diagram must name big_question/);
}

{
  const state = makeFinalEntryState();
  const result = validate(state, previewFiles);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(state.delivery.final_path, "");
}

{
  const state = makeFinalEntryState();
  const result = validate(state, {"audio/final.wav": {fixture: "audio"}});
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not exist/);
}

{
  const state = makeFinalEntryState();
  state.delivery.critical_previews[2].path = "previews/hook-a.mp4";
  const result = validate(state, previewFiles);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /paths must be unique/);
}

{
  const state = makeFinalEntryState();
  state.delivery.preview_review.score_85 = 0;
  const result = validate(state, previewFiles);
  assert.equal(result.status, 0, result.stderr);
}

{
  const state = makeFinalEntryState();
  state.scenes[0].implementation.timeline_revision = 0;
  const result = validate(state, previewFiles);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /implementation.timeline_revision must match/);
}

{
  const state = makeFinalEntryState();
  const files = {
    ...previewFiles,
    "previews/hook-b.mp4": "not a video",
  };
  const result = validate(state, files);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not valid video evidence/);
}

{
  const state = makeFinalEntryState();
  state.scenes[0].implementation.verification = {
    profile: "source-proof",
    structural_checked: true,
    visual_checked: true,
    frames: [
      {role: "entry", frame: 0, path: "frames/a.png"},
      {role: "settled", frame: 10, path: "frames/b.png"},
      {role: "exit", frame: 20, path: "frames/c.png"},
    ],
    checked_at: "2026-07-10T11:55:00+08:00",
    notes: "Wrong checkpoint vocabulary for a source-proof scene.",
  };
  const result = validate(state, previewFiles);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /source-proof checkpoint context/);
}

{
  const state = makeFinalEntryState();
  state.delivery.critical_previews[0].selected_candidate_id = "missing";
  const result = validate(state, previewFiles);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /selected_candidate_id must reference a candidate/);
}

{
  const state = makeFinalEntryState();
  state.metadata.stage_status = "completed";
  state.delivery.status = "delivered";
  const result = validate(state, previewFiles);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /delivery.final_path is required/);
}

{
  const state = makeFinalEntryState();
  state.metadata.stage_status = "completed";
  state.delivery.status = "delivered";
  state.delivery.final_path = "output/final.mp4";
  state.delivery.cover_path = "output/cover.png";
  const result = validate(state, {
    ...previewFiles,
    "output/final.mp4": {fixture: "redVideo"},
    "output/cover.png": {fixture: "image"},
  });
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(JSON.stringify(state), /L2|L3|spring|particle|camera_scale/);
}

{
  const state = makeProductionState();
  state.metadata.active_stage = "script-beats";
  state.brief.sources[0].kind = "generated-image";
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /generated source source-pr cannot be proof eligible/);
}

{
  const state = cloneTemplate();
  state.unexpected = true;
  const result = validate(state);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /state.unexpected is not allowed/);
}

console.log("validate-lean-project-state tests passed");
