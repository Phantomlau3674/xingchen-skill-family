import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const TRACE_ORDER = [
  "route",
  "preflight",
  "plan",
  "authorize",
  "execute",
  "track",
  "verify",
  "commit",
];
const CARD_TOPOLOGIES = new Set(["card", "panel", "slide", "deck"]);
const NON_EDITORIAL_OPERATORS = new Set([
  "source_reveal",
  "object_transform",
  "spatial_relation",
  "camera_reveal",
  "data_behavior",
  "character_action",
  "kinetic_type",
  "compositing",
]);
const GENERATION_CAPABILITIES = new Set([
  "motion_graphics",
  "video_generation",
  "image_generation",
]);
const MEDIA_MODALITIES = new Set([
  "real-footage",
  "source-proof",
  "screen-capture",
  "motion-graphic",
  "generated-plate",
  "still-image",
  "3d-world",
  "avatar",
  "typography",
  "data-viz",
]);

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const asArray = (value) => (Array.isArray(value) ? value : []);
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const closeEnough = (a, b) => Number.isFinite(a) && Math.abs(a - b) <= 0.005;
const ratio = (part, total) => (total > 0 ? Number((part / total).toFixed(4)) : 0);

export function validateAgentHarness(harness, options = {}) {
  const phase = options.phase ?? "commit";
  const expectedSceneIds = asArray(options.expectedSceneIds);
  const errors = [];
  const warnings = [];
  const fail = (message) => errors.push(message);
  const requireValue = (condition, message) => {
    if (!condition) fail(message);
  };

  requireValue(isObject(harness), "agent_harness must be an object");
  if (!isObject(harness)) return {ok: false, errors, warnings, metrics: null};

  requireValue(hasText(harness.version), "agent_harness.version is required");
  requireValue(hasText(harness.run_id), "agent_harness.run_id is required");
  requireValue(
    ["planned", "authorized", "executing", "verifying", "committed", "failed"].includes(harness.status),
    "agent_harness.status is invalid",
  );

  const policy = harness.runtime_policy ?? {};
  requireValue(
    ["fast", "standard", "deep"].includes(policy.thinking_mode),
    "runtime_policy.thinking_mode must be fast, standard, or deep",
  );
  requireValue(
    ["speed", "balance", "quality"].includes(policy.quality_mode),
    "runtime_policy.quality_mode must be speed, balance, or quality",
  );
  requireValue(
    ["project", "global"].includes(policy.permission_scope),
    "runtime_policy.permission_scope must be project or global",
  );
  for (const capability of GENERATION_CAPABILITIES) {
    requireValue(
      ["allow", "ask", "deny"].includes(policy.capability_permissions?.[capability]),
      `runtime_policy.capability_permissions.${capability} must be allow, ask, or deny`,
    );
  }

  const route = harness.route ?? {};
  requireValue(hasText(route.workflow_skill), "route.workflow_skill is required");
  requireValue(
    ["none", "user-named", "active-spec", "catalog-preset", "accepted-example"].includes(route.design_style_source),
    "route.design_style_source is invalid",
  );
  if (route.design_style_source === "none") {
    requireValue(!hasText(route.design_style), "route.design_style must be empty when design_style_source=none");
    requireValue(!hasText(route.design_style_spec_ref), "route.design_style_spec_ref must be empty when design_style_source=none");
  } else {
    requireValue(hasText(route.design_style), "route.design_style is required when a style source is selected");
    if (["active-spec", "catalog-preset", "accepted-example"].includes(route.design_style_source)) {
      requireValue(hasText(route.design_style_spec_ref), `route.design_style_spec_ref is required for ${route.design_style_source}`);
    }
  }
  requireValue(
    ["film", "motion-graphic", "editorial-card"].includes(route.visual_format),
    "route.visual_format must be film, motion-graphic, or editorial-card",
  );
  requireValue(hasText(route.output_grammar), "route.output_grammar is required");
  requireValue(
    asArray(route.artifact_ladder).length >= 2 && asArray(route.artifact_ladder).every(hasText),
    "route.artifact_ladder requires at least two named artifacts",
  );
  requireValue(hasText(route.next_artifact), "route.next_artifact is required");

  const medium = route.medium_strategy ?? {};
  requireValue(
    ["narration-led", "source-led", "mixed-media", "motion-graphic-only", "generated-cinematic", "talking-head"].includes(medium.mode),
    "route.medium_strategy.mode is invalid",
  );
  requireValue(
    ["user", "brief", "agent"].includes(medium.choice_source),
    "route.medium_strategy.choice_source is invalid",
  );
  const modalities = asArray(medium.modalities);
  requireValue(modalities.length > 0, "route.medium_strategy.modalities must not be empty");
  requireValue(new Set(modalities).size === modalities.length, "route.medium_strategy.modalities must be unique");
  for (const modality of modalities) {
    requireValue(MEDIA_MODALITIES.has(modality), `route.medium_strategy modality ${modality} is invalid`);
  }
  if (medium.mode === "motion-graphic-only") {
    requireValue(modalities.includes("motion-graphic"), "motion-graphic-only mode requires the motion-graphic modality");
    requireValue(
      ["user", "brief"].includes(medium.choice_source),
      "motion-graphic-only cannot be selected as an agent fallback",
    );
    if (route.visual_format === "film") {
      requireValue(hasText(medium.exception_reason), "film routed as motion-graphic-only requires exception_reason");
    }
  }
  if (medium.mode === "source-led") {
    requireValue(
      modalities.some((item) => ["real-footage", "source-proof", "screen-capture"].includes(item)),
      "source-led mode requires real-footage, source-proof, or screen-capture",
    );
  }
  if (medium.mode === "narration-led") {
    requireValue(route.visual_format === "film", "narration-led mode requires route.visual_format=film");
  }
  if (medium.mode === "mixed-media") {
    requireValue(modalities.length >= 2, "mixed-media mode requires at least two modalities");
  }

  const batch = route.batch_policy ?? {};
  requireValue(
    Number.isInteger(batch.planned_visual_assets) && batch.planned_visual_assets >= 1,
    "route.batch_policy.planned_visual_assets must be a positive integer",
  );
  requireValue(
    ["none", "active-spec", "catalog-preset", "accepted-example", "user-named"].includes(batch.style_basis),
    "route.batch_policy.style_basis is invalid",
  );
  requireValue(
    ["not-needed", "planned", "previewed", "approved"].includes(batch.representative_status),
    "route.batch_policy.representative_status is invalid",
  );
  requireValue(typeof batch.expansion_allowed === "boolean", "route.batch_policy.expansion_allowed must be boolean");
  if (batch.planned_visual_assets > 1 && ["none", "user-named"].includes(batch.style_basis)) {
    requireValue(
      batch.expansion_allowed === (batch.representative_status === "approved"),
      "batch expansion requires an approved representative when style basis is none or user-named",
    );
    if (phase === "commit") {
      requireValue(batch.representative_status === "approved", "commit phase requires approved representative before batch expansion");
    }
  }

  const strategies = asArray(harness.scene_strategies);
  const sceneIds = new Set();
  let totalDuration = 0;
  let cardDuration = 0;
  let staticDuration = 0;
  const layoutDurations = new Map();
  const operatorSet = new Set();

  for (const strategy of strategies) {
    const tag = `scene_strategy ${strategy?.scene_id || "<unknown>"}`;
    requireValue(hasText(strategy?.scene_id), `${tag}.scene_id is required`);
    requireValue(!sceneIds.has(strategy?.scene_id), `duplicate scene_strategy ${strategy?.scene_id}`);
    sceneIds.add(strategy?.scene_id);
    requireValue(
      [
        "card",
        "panel",
        "slide",
        "deck",
        "source-evidence",
        "spatial-world",
        "diagram",
        "footage",
        "character",
        "mixed",
        "full-frame-typography",
      ].includes(strategy?.topology),
      `${tag}.topology is invalid`,
    );
    requireValue(hasText(strategy?.layout_signature), `${tag}.layout_signature is required`);
    requireValue(
      Number.isFinite(strategy?.duration_sec) && strategy.duration_sec > 0,
      `${tag}.duration_sec must be positive`,
    );
    requireValue(
      Number.isFinite(strategy?.static_hold_sec) &&
        strategy.static_hold_sec >= 0 &&
        strategy.static_hold_sec <= strategy.duration_sec,
      `${tag}.static_hold_sec must be between zero and duration_sec`,
    );
    requireValue(hasText(strategy?.before_state), `${tag}.before_state is required`);
    requireValue(hasText(strategy?.after_state), `${tag}.after_state is required`);
    requireValue(
      strategy?.before_state !== strategy?.after_state,
      `${tag} must change semantic state`,
    );
    requireValue(hasText(strategy?.causal_force), `${tag}.causal_force is required`);
    requireValue(hasText(strategy?.continuity_anchor), `${tag}.continuity_anchor is required`);
    requireValue(
      strategy?.motion_carries_meaning === true,
      `${tag}.motion_carries_meaning must be true`,
    );

    const operators = asArray(strategy?.operators);
    requireValue(operators.length > 0 && operators.every(hasText), `${tag}.operators must not be empty`);
    for (const operator of operators) operatorSet.add(operator);

    const proofFrames = asArray(strategy?.proof_frames);
    const proofRoles = new Set(proofFrames.map((item) => item?.role));
    requireValue(proofRoles.has("before"), `${tag}.proof_frames requires before evidence`);
    requireValue(proofRoles.has("after"), `${tag}.proof_frames requires after evidence`);
    for (const frame of proofFrames) {
      requireValue(hasText(frame?.ref), `${tag}.proof_frames[].ref is required`);
    }

    if (Number.isFinite(strategy?.duration_sec) && strategy.duration_sec > 0) {
      totalDuration += strategy.duration_sec;
      if (CARD_TOPOLOGIES.has(strategy.topology)) cardDuration += strategy.duration_sec;
      staticDuration += Number.isFinite(strategy.static_hold_sec) ? strategy.static_hold_sec : 0;
      if (hasText(strategy.layout_signature)) {
        layoutDurations.set(
          strategy.layout_signature,
          (layoutDurations.get(strategy.layout_signature) ?? 0) + strategy.duration_sec,
        );
      }
    }
  }

  for (const expectedSceneId of expectedSceneIds) {
    requireValue(sceneIds.has(expectedSceneId), `agent_harness is missing scene_strategy ${expectedSceneId}`);
  }
  for (const sceneId of sceneIds) {
    if (expectedSceneIds.length > 0) {
      requireValue(expectedSceneIds.includes(sceneId), `agent_harness has unknown scene_strategy ${sceneId}`);
    }
  }
  if (phase === "commit") {
    requireValue(strategies.length > 0, "commit phase requires scene_strategies");
  }

  const largestLayoutDuration = Math.max(0, ...layoutDurations.values());
  const metrics = {
    card_scene_ratio: ratio(cardDuration, totalDuration),
    repeated_layout_ratio:
      strategies.length <= 1 ? 0 : ratio(largestLayoutDuration, totalDuration),
    static_hold_ratio: ratio(staticDuration, totalDuration),
  };
  const antiPpt = harness.anti_ppt ?? {};
  const thresholds = {
    max_card_scene_ratio: antiPpt.max_card_scene_ratio,
    max_repeated_layout_ratio: antiPpt.max_repeated_layout_ratio,
    max_static_hold_ratio: antiPpt.max_static_hold_ratio,
  };
  for (const [name, value] of Object.entries(thresholds)) {
    requireValue(Number.isFinite(value) && value >= 0 && value <= 1, `anti_ppt.${name} must be between 0 and 1`);
  }
  for (const [name, value] of Object.entries(metrics)) {
    requireValue(closeEnough(antiPpt[name], value), `anti_ppt.${name} must equal derived value ${value}`);
  }

  const editorialException = antiPpt.editorial_card_exception === true;
  if (editorialException) {
    requireValue(
      route.visual_format === "editorial-card",
      "editorial_card_exception requires route.visual_format=editorial-card",
    );
    requireValue(hasText(antiPpt.exception_reason), "editorial_card_exception requires exception_reason");
  } else if (totalDuration > 0) {
    requireValue(
      metrics.card_scene_ratio <= thresholds.max_card_scene_ratio,
      `INV-ANTI-PPT-SEMANTIC-MOTION: card_scene_ratio ${metrics.card_scene_ratio} exceeds ${thresholds.max_card_scene_ratio}`,
    );
    requireValue(
      metrics.repeated_layout_ratio <= thresholds.max_repeated_layout_ratio,
      `INV-ANTI-PPT-SEMANTIC-MOTION: repeated_layout_ratio ${metrics.repeated_layout_ratio} exceeds ${thresholds.max_repeated_layout_ratio}`,
    );
    requireValue(
      metrics.static_hold_ratio <= thresholds.max_static_hold_ratio,
      `INV-ANTI-PPT-SEMANTIC-MOTION: static_hold_ratio ${metrics.static_hold_ratio} exceeds ${thresholds.max_static_hold_ratio}`,
    );
  }

  if (strategies.length > 0 && !editorialException) {
    const nonEditorialCount = [...operatorSet].filter((item) => NON_EDITORIAL_OPERATORS.has(item)).length;
    const requiredCount = strategies.length > 1 ? 2 : 1;
    requireValue(
      nonEditorialCount >= requiredCount,
      `INV-ANTI-PPT-SEMANTIC-MOTION: requires ${requiredCount} distinct non-editorial operator(s), found ${nonEditorialCount}`,
    );
  }

  const trace = asArray(harness.trace);
  const traceStages = trace.map((event) => event?.stage);
  let lastIndex = -1;
  for (const event of trace) {
    const index = TRACE_ORDER.indexOf(event?.stage);
    requireValue(index >= 0, `trace stage ${event?.stage ?? "<unknown>"} is invalid`);
    requireValue(index > lastIndex, `trace stages must be unique and ordered at ${event?.stage}`);
    lastIndex = Math.max(lastIndex, index);
    requireValue(
      ["success", "pending", "failed"].includes(event?.status),
      `trace ${event?.stage ?? "<unknown>"}.status is invalid`,
    );
    requireValue(hasText(event?.at), `trace ${event?.stage ?? "<unknown>"}.at is required`);
    requireValue(hasText(event?.evidence_ref), `trace ${event?.stage ?? "<unknown>"}.evidence_ref is required`);
  }
  const requiredTrace = phase === "commit" ? TRACE_ORDER : TRACE_ORDER.slice(0, 3);
  for (const requiredStage of requiredTrace) {
    const event = trace.find((item) => item?.stage === requiredStage);
    requireValue(event?.status === "success", `${phase} phase requires successful trace stage ${requiredStage}`);
  }

  const receipts = harness.receipts ?? {};
  if (phase === "commit") {
    requireValue(hasText(receipts.asset_authoring_ref), "commit phase requires receipts.asset_authoring_ref");
    requireValue(hasText(receipts.timeline_placement_ref), "commit phase requires receipts.timeline_placement_ref");
    requireValue(
      hasText(receipts.composed_frame_verification_ref),
      "commit phase requires receipts.composed_frame_verification_ref",
    );
    requireValue(
      new Set([
        receipts.asset_authoring_ref,
        receipts.timeline_placement_ref,
        receipts.composed_frame_verification_ref,
      ]).size === 3,
      "commit receipts must separately prove asset authoring, timeline placement, and composed frames",
    );
  }

  const jobs = asArray(harness.jobs);
  const jobIds = new Set();
  const idempotencyKeys = new Set();
  for (const job of jobs) {
    const tag = `job ${job?.job_id || "<unknown>"}`;
    requireValue(hasText(job?.job_id), `${tag}.job_id is required`);
    requireValue(!jobIds.has(job?.job_id), `duplicate job_id ${job?.job_id}`);
    jobIds.add(job?.job_id);
    requireValue(
      [
        "local_render",
        "motion_graphics",
        "video_generation",
        "image_generation",
        "media_analysis",
        "export",
        "project_mutation",
      ].includes(job?.capability),
      `${tag}.capability is invalid`,
    );
    requireValue(hasText(job?.idempotency_key), `${tag}.idempotency_key is required`);
    requireValue(!idempotencyKeys.has(job?.idempotency_key), `duplicate idempotency_key ${job?.idempotency_key}`);
    idempotencyKeys.add(job?.idempotency_key);
    requireValue(hasText(job?.intent_fingerprint), `${tag}.intent_fingerprint is required`);
    requireValue(typeof job?.server_idempotent === "boolean", `${tag}.server_idempotent must be boolean`);
    requireValue(Number.isInteger(job?.attempt) && job.attempt >= 1, `${tag}.attempt must be a positive integer`);
    requireValue(
      ["planned", "authorized", "submitted", "running", "reconciling", "ambiguous", "succeeded", "failed", "cancelled"].includes(job?.status),
      `${tag}.status is invalid`,
    );
    requireValue(
      Number.isFinite(job?.progress) && job.progress >= 0 && job.progress <= 100,
      `${tag}.progress must be between 0 and 100`,
    );
    requireValue(
      ["unknown", "not_charged", "estimated", "charged"].includes(job?.charge_status),
      `${tag}.charge_status is invalid`,
    );
    if (["submitted", "running", "reconciling", "ambiguous", "succeeded", "failed"].includes(job?.status)) {
      requireValue(hasText(job?.last_checked_at), `${tag}.last_checked_at is required after submission`);
    }
    if (job?.attempt > 1 && job?.server_idempotent === false) {
      requireValue(
        hasText(job?.reconciliation_ref),
        `${tag}.reconciliation_ref is required before retrying a non-idempotent mutation`,
      );
    }
    if (GENERATION_CAPABILITIES.has(job?.capability) && ["submitted", "running"].includes(job?.status)) {
      requireValue(hasText(job?.resume_cursor), `${tag}.resume_cursor is required for resumable remote work`);
    }
    if (job?.status === "succeeded") {
      requireValue(hasText(job?.output_ref), `${tag}.output_ref is required when succeeded`);
      requireValue(job?.progress === 100, `${tag}.progress must be 100 when succeeded`);
    }

    if (GENERATION_CAPABILITIES.has(job?.capability)) {
      const permission = policy.capability_permissions?.[job.capability];
      requireValue(permission !== "deny", `${tag} uses denied capability ${job.capability}`);
      if (permission === "ask" && ["authorized", "submitted", "running", "succeeded"].includes(job?.status)) {
        const authorizeEvent = trace.find((event) => event?.stage === "authorize");
        requireValue(
          authorizeEvent?.status === "success" && hasText(authorizeEvent?.approval_ref),
          `${tag} requires authorize trace with approval_ref`,
        );
      }
    }
  }

  if (phase === "commit") {
    requireValue(harness.status === "committed", "commit phase requires agent_harness.status=committed");
    requireValue(antiPpt.decision === "pass", "commit phase requires anti_ppt.decision=pass");
    requireValue(asArray(antiPpt.blocking_reasons).length === 0, "commit phase requires no anti_ppt.blocking_reasons");
  }

  return {ok: errors.length === 0, errors, warnings, metrics};
}

function runCli() {
  const inputPath = path.resolve(process.argv[2] ?? "agent-harness.json");
  if (!fs.existsSync(inputPath)) {
    console.error(`Agent harness file not found: ${inputPath}`);
    process.exit(1);
  }
  let harness;
  try {
    harness = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (error) {
    console.error(`Invalid JSON: ${error.message}`);
    process.exit(1);
  }
  const result = validateAgentHarness(harness, {phase: "commit"});
  if (!result.ok) {
    console.error(`Agent harness validation failed: ${result.errors.length} error(s)`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Agent harness validation passed: scenes=${harness.scene_strategies.length}, jobs=${harness.jobs.length}`);
  console.log(JSON.stringify(result.metrics));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runCli();
}
