import assert from "node:assert/strict";
import {validateAgentHarness} from "./validate-agent-harness.mjs";

function makeHarness() {
  return {
    version: "1.0.0",
    run_id: "run-test",
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
      design_style: "original-project-style",
      design_style_source: "accepted-example",
      design_style_spec_ref: "style/original-project-v1",
      visual_format: "film",
      output_grammar: "source reveal to spatial transformation to causal resolution",
      artifact_ladder: ["beat map", "scene mechanism plan", "rendered preview"],
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
        duration_sec: 4,
        static_hold_sec: 1,
        operators: ["source_reveal", "camera_reveal"],
        before_state: "The viewer sees an unexplained result.",
        after_state: "The viewer locates the missing context inside the source.",
        causal_force: "The camera isolates the omitted source region.",
        continuity_anchor: "The real source screenshot remains on screen.",
        motion_carries_meaning: true,
        proof_frames: [
          {role: "before", ref: "frames/scene-01-before.png"},
          {role: "after", ref: "frames/scene-01-after.png"},
        ],
      },
      {
        scene_id: "scene-02",
        topology: "spatial-world",
        layout_signature: "causal-depth-line",
        duration_sec: 4,
        static_hold_sec: 1,
        operators: ["object_transform", "spatial_relation"],
        before_state: "Speed and context appear to be one variable.",
        after_state: "Speed and context are visibly independent variables.",
        causal_force: "One object splits into two independently moving axes.",
        continuity_anchor: "The same task token persists through the split.",
        motion_carries_meaning: true,
        proof_frames: [
          {role: "before", ref: "frames/scene-02-before.png"},
          {role: "after", ref: "frames/scene-02-after.png"},
        ],
      },
    ],
    anti_ppt: {
      max_card_scene_ratio: 0.35,
      max_repeated_layout_ratio: 0.5,
      max_static_hold_ratio: 0.6,
      card_scene_ratio: 0,
      repeated_layout_ratio: 0.5,
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
      ...(stage === "authorize" ? {approval_ref: "approval-1"} : {}),
    })),
    receipts: {
      asset_authoring_ref: "receipts/asset.json",
      timeline_placement_ref: "receipts/timeline.json",
      composed_frame_verification_ref: "receipts/frame-grid.jpg",
    },
    jobs: [
      {
        job_id: "render-1",
        capability: "local_render",
        idempotency_key: "render-scene-pair-v1",
        intent_fingerprint: "sha256:render-scene-pair-v1",
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

{
  const result = validateAgentHarness(makeHarness(), {
    phase: "commit",
    expectedSceneIds: ["scene-01", "scene-02"],
  });
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.deepEqual(result.metrics, {
    card_scene_ratio: 0,
    repeated_layout_ratio: 0.5,
    static_hold_ratio: 0.25,
  });
}

{
  const harness = makeHarness();
  for (const scene of harness.scene_strategies) {
    scene.topology = "card";
    scene.layout_signature = "centered-card";
    scene.operators = ["editorial_layout"];
  }
  harness.anti_ppt.card_scene_ratio = 1;
  harness.anti_ppt.repeated_layout_ratio = 1;
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /card_scene_ratio 1 exceeds 0.35/);
  assert.match(result.errors.join("\n"), /requires 2 distinct non-editorial/);
}

{
  const harness = makeHarness();
  harness.scene_strategies[0].motion_carries_meaning = false;
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /motion_carries_meaning must be true/);
}

{
  const harness = makeHarness();
  harness.runtime_policy.capability_permissions.motion_graphics = "ask";
  harness.trace.find((event) => event.stage === "authorize").approval_ref = "";
  harness.jobs.push({
    job_id: "mg-1",
    capability: "motion_graphics",
    idempotency_key: "mg-scene-1-v1",
    intent_fingerprint: "sha256:mg-scene-1-v1",
    server_idempotent: true,
    attempt: 1,
    status: "running",
    progress: 50,
    resume_cursor: "cursor-1",
    last_checked_at: "2026-07-13T12:02:00+08:00",
    charge_status: "estimated",
  });
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /requires authorize trace with approval_ref/);
}

{
  const harness = makeHarness();
  harness.trace = harness.trace.slice(0, 3);
  harness.status = "planned";
  harness.scene_strategies = [];
  harness.anti_ppt.card_scene_ratio = 0;
  harness.anti_ppt.repeated_layout_ratio = 0;
  harness.anti_ppt.static_hold_ratio = 0;
  harness.anti_ppt.decision = "block";
  harness.anti_ppt.blocking_reasons = ["Scene strategies pending."];
  const result = validateAgentHarness(harness, {phase: "plan"});
  assert.equal(result.ok, true, result.errors.join("\n"));
}

{
  const harness = makeHarness();
  harness.route.design_style_source = "none";
  harness.route.design_style_spec_ref = "";
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /design_style must be empty when design_style_source=none/);
}

{
  const harness = makeHarness();
  harness.route.medium_strategy = {
    mode: "motion-graphic-only",
    choice_source: "agent",
    modalities: ["motion-graphic"],
    exception_reason: "The agent preferred the cheapest path.",
  };
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /motion-graphic-only cannot be selected as an agent fallback/);
}

{
  const harness = makeHarness();
  harness.route.batch_policy = {
    planned_visual_assets: 4,
    style_basis: "user-named",
    representative_status: "previewed",
    expansion_allowed: false,
  };
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /commit phase requires approved representative before batch expansion/);
}

{
  const harness = makeHarness();
  harness.jobs[0].capability = "project_mutation";
  harness.jobs[0].attempt = 2;
  harness.jobs[0].server_idempotent = false;
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /reconciliation_ref is required before retrying a non-idempotent mutation/);
}

{
  const harness = makeHarness();
  harness.receipts.composed_frame_verification_ref = "";
  const result = validateAgentHarness(harness, {phase: "commit"});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /requires receipts.composed_frame_verification_ref/);
}

console.log("validate-agent-harness tests passed");
