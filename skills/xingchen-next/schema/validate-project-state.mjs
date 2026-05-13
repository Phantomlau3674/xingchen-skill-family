import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const statePath = process.argv[2] ?? path.resolve(process.cwd(), "project-state.json");

if (!fs.existsSync(statePath)) {
  console.error(`State file not found: ${statePath}`);
  process.exit(1);
}

const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
const schema = JSON.parse(fs.readFileSync(path.join(here, "project-state.schema.json"), "utf8"));

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function checkEnum(label, value, allowed) {
  if (value === undefined || value === null) return;
  assert(allowed.includes(value), `${label} value "${value}" is not in [${allowed.join(", ")}]`);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function hasNonEmptyTextArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}

function hasMinTextArray(value, minLength) {
  return Array.isArray(value) && value.length >= minLength && value.every(hasText);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function hasNonEmptyObject(value) {
  return hasObject(value) && Object.keys(value).length > 0;
}

function textIncludesAny(value, needles) {
  if (!hasText(value)) return false;
  const text = value.toLowerCase();
  return needles.some((needle) => text.includes(needle.toLowerCase()));
}

function joinedText(...values) {
  return values
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter((value) => value !== undefined && value !== null)
    .join(" ");
}

function isGenericRouteReason(value) {
  if (!hasText(value)) return true;
  const text = value.trim().toLowerCase();
  const genericWords = ["更高级", "高级", "好看", "炫酷", "大片感", "cinematic", "premium", "looks cool", "cool", "fancier"];
  const concreteWords = [
    "camera",
    "depth",
    "proof",
    "evidence",
    "subtitle",
    "spatial",
    "world",
    "source",
    "timing",
    "narration",
    "route",
    "preview",
    "镜头",
    "纵深",
    "景深",
    "证据",
    "字幕",
    "空间",
    "世界",
    "素材",
    "录音",
    "节奏",
    "预览",
  ];
  return genericWords.some((word) => text.includes(word)) && !concreteWords.some((word) => text.includes(word));
}

function assertSchemaRequiredFields(schemaNode, value, label) {
  if (!schemaNode || value === undefined || value === null) return;

  if ((schemaNode.required || schemaNode.properties) && hasObject(value)) {
    for (const key of asArray(schemaNode.required)) {
      assert(
        Object.hasOwn(value, key),
        `schema.required: ${label}.${key} is required`
      );
    }

    for (const [key, childSchema] of Object.entries(schemaNode.properties ?? {})) {
      if (Object.hasOwn(value, key)) {
        assertSchemaRequiredFields(childSchema, value[key], `${label}.${key}`);
      }
    }
  }

  if (schemaNode.items && Array.isArray(value)) {
    value.forEach((item, index) => {
      assertSchemaRequiredFields(schemaNode.items, item, `${label}[${index}]`);
    });
  }
}

// ---- top-level shape ----

for (const key of schema.required) {
  assert(Object.hasOwn(state, key), `top-level field missing: ${key}`);
}

assertSchemaRequiredFields(schema, state, "state");

assert(state.kind === "XingchenNextProjectState", `kind must be "XingchenNextProjectState", got "${state.kind}"`);
assert(typeof state.version === "string" && state.version.length > 0, "version must be a non-empty string");

// ---- metadata ----

const metadata = state.metadata ?? {};
const allowedStages = [
  "ingest",
  "research/proof",
  "script",
  "story-mother",
  "visual-direction",
  "platform-adapt",
  "lookdev",
  "render",
  "publish",
  "review",
];
const stageRank = Object.fromEntries(allowedStages.map((s, idx) => [s, idx]));
assert(metadata.project_id, "metadata.project_id is required");
assert(metadata.title, "metadata.title is required");
assert(metadata.created_at, "metadata.created_at is required");
assert(metadata.updated_at, "metadata.updated_at is required");
checkEnum("metadata.active_stage", metadata.active_stage, allowedStages);
const stage = metadata.active_stage;
const stageIdx = (stage && stageRank[stage] !== undefined) ? stageRank[stage] : -1;

// ---- workflow.approvals ----

const allowedCheckpoints = ["Topic Lock", "Script Lock", "StoryMother Lock", "Visual Lock", "Lookdev Approval"];
const allowedApprovalStatus = ["pending", "approved", "rejected", "superseded", "manual_review_required"];
const allowedRecordingCorrectionStatus = ["pending", "completed", "manual_review_required", "blocked"];
const approvals = state.workflow?.approvals ?? [];
assert(Array.isArray(approvals), "workflow.approvals must be an array");

const approvalByCheckpoint = {};
for (const [i, approval] of approvals.entries()) {
  assert(approval.checkpoint, `workflow.approvals[${i}].checkpoint is required`);
  assert(approval.status, `workflow.approvals[${i}].status is required`);
  checkEnum(`workflow.approvals[${i}].checkpoint`, approval.checkpoint, allowedCheckpoints);
  checkEnum(`workflow.approvals[${i}].status`, approval.status, allowedApprovalStatus);
  if (approval.checkpoint) approvalByCheckpoint[approval.checkpoint] = approval;
}

for (const checkpoint of allowedCheckpoints) {
  assert(approvalByCheckpoint[checkpoint], `workflow.approvals missing required checkpoint: ${checkpoint}`);
}

// ---- sources: input truth for screenshots, recordings, screen recordings, notes, links ----

const sourcePack = state.sources?.source_pack ?? {};
const transcriptSegments = asArray(state.sources?.transcript?.segments);
const recordingCorrection = state.sources?.recording_correction ?? {};
const assetManifest = asArray(state.sources?.asset_manifest);

const sourceLinks = asArray(sourcePack.links);
const sourceScreenshots = asArray(sourcePack.screenshots);
const sourceScreenRecordings = asArray(sourcePack.screen_recordings);
const sourceNotes = asArray(sourcePack.notes);
const sourceDraftRecordings = asArray(sourcePack.draft_recordings);
const sourceExistingAssets = asArray(sourcePack.existing_assets);

const hasSourceMaterials =
  sourceLinks.length > 0 ||
  sourceScreenshots.length > 0 ||
  sourceScreenRecordings.length > 0 ||
  sourceNotes.length > 0 ||
  sourceDraftRecordings.length > 0 ||
  sourceExistingAssets.length > 0 ||
  transcriptSegments.length > 0;

const hasMediaSourceMaterials =
  sourceScreenshots.length > 0 ||
  sourceScreenRecordings.length > 0 ||
  sourceDraftRecordings.length > 0 ||
  sourceExistingAssets.length > 0;

const hasScreenRecordingInput = sourceScreenRecordings.length > 0;

assert(assetManifest.every((item) => item && typeof item === "object"), "sources.asset_manifest items must be objects");

const assetIds = new Set();
for (const [i, asset] of assetManifest.entries()) {
  const tag = `sources.asset_manifest[${i}]`;
  assert(asset.asset_id, `${tag}.asset_id is required`);
  assert(asset.file_path, `${tag}.file_path is required`);
  assert(asset.asset_type, `${tag}.asset_type is required`);
  assert(asset.review_status, `${tag}.review_status is required`);
  if (asset.asset_id) assetIds.add(asset.asset_id);
}

if (hasObject(recordingCorrection)) {
  checkEnum("sources.recording_correction.status", recordingCorrection.status, allowedRecordingCorrectionStatus);
  assert(Array.isArray(recordingCorrection.source_audio_refs), "sources.recording_correction.source_audio_refs must be an array");
  assert(Array.isArray(recordingCorrection.cleaned_audio_paths), "sources.recording_correction.cleaned_audio_paths must be an array");
  assert(Array.isArray(recordingCorrection.correction_actions), "sources.recording_correction.correction_actions must be an array");
  assert(Array.isArray(recordingCorrection.quality_checks), "sources.recording_correction.quality_checks must be an array");
  assert(
    typeof recordingCorrection.manual_review_notes === "string",
    "sources.recording_correction.manual_review_notes must be a string"
  );
}

const claims = asArray(state.proof?.claims);
const evidenceItems = asArray(state.proof?.evidence_items);

for (const [i, evidence] of evidenceItems.entries()) {
  const tag = `proof.evidence_items[${i}]`;
  assert(evidence.claim_id, `${tag}.claim_id is required`);
  assert(evidence.asset_id, `${tag}.asset_id is required`);
  assert(evidence.evidence_type, `${tag}.evidence_type is required`);
  assert(evidence.visibility_requirement, `${tag}.visibility_requirement is required`);
  assert(evidence.allowed_usage, `${tag}.allowed_usage is required`);
  if (evidence.asset_id && assetIds.size > 0) {
    assert(assetIds.has(evidence.asset_id), `${tag}.asset_id references unknown sources.asset_manifest asset_id "${evidence.asset_id}"`);
  }
}

const spokenBlocks = asArray(state.script?.spoken_script?.blocks);
const beatScenes = asArray(state.script?.beat_map?.scenes);
const storyMother = state.mother?.story_mother ?? {};
const storySceneOrder = asArray(storyMother.scene_order);
const storySceneCards = asArray(storyMother.scene_cards);
const storySceneIds = new Set([
  ...storySceneOrder.filter((sceneId) => typeof sceneId === "string"),
  ...storySceneCards.map((card) => card?.scene_id).filter((sceneId) => typeof sceneId === "string"),
]);

for (const [i, card] of storySceneCards.entries()) {
  const tag = `mother.story_mother.scene_cards[${i}]`;
  assert(card.scene_id, `${tag}.scene_id is required`);
  assert(card.scene_job || card.job, `${tag}.scene_job or job is required`);
  assert(card.intent, `${tag}.intent is required`);
  assert(card.dominant_anchor, `${tag}.dominant_anchor is required`);
}

const sourceMaterialPlan = asArray(state.visual?.source_material_plan);
for (const [i, plan] of sourceMaterialPlan.entries()) {
  const tag = `visual.source_material_plan[${i}]`;
  assert(plan.scene_id, `${tag}.scene_id is required`);
  assert(plan.usage_role, `${tag}.usage_role is required`);
  assert(plan.treatment, `${tag}.treatment is required`);
  if (plan.scene_id && storySceneIds.size > 0) {
    assert(storySceneIds.has(plan.scene_id), `${tag}.scene_id references unknown story mother scene "${plan.scene_id}"`);
  }
  for (const assetId of asArray(plan.asset_ids)) {
    assert(assetIds.has(assetId), `${tag}.asset_ids references unknown sources.asset_manifest asset_id "${assetId}"`);
  }
}

// ---- render.route ----

const allowedRenderModes = ["code_primary", "gen_insert", "mixed_scene"];
const route = state.render?.route ?? {};
checkEnum("render.route.default_mode", route.default_mode, allowedRenderModes);
checkEnum("render.route.hero_shot_mode", route.hero_shot_mode, allowedRenderModes);

// ---- render.scene_motion_specs ----

const allowedRendererFamilies = [
  "remotion_component",
  "html_scene",
  "canvas_scene",
  "vibemotion_candidate",
  "spark_3dgs",
];
const allowedFinalRendererFamilies = [
  "remotion_component",
  "html_scene",
  "canvas_scene",
  "spark_3dgs",
];
const allowedActualRendererFamilies = [
  "remotion_component",
  "html_scene",
  "canvas_scene",
  "vibemotion_candidate",
  "spark_3dgs",
  "spark_procedural_splat",
  "spark_hybrid_three",
  "html_canvas_world_plate_fallback",
];
const allowedRouteStatus = [
  "true_3dgs_asset",
  "streaming_rad_world",
  "procedural_splat_world",
  "hybrid_spark_three",
  "fallback_preview",
  "blocked_missing_asset",
  "approved_fallback_final",
];
const allowedExecutionRuntimes = [
  "remotion",
  "spark_browser_canvas",
  "html_browser_capture",
  "source_media",
];
const allowedMotionSources = [
  "native_remotion",
  "vibemotion_skill",
  "hyperframes_runtime",
  "ai_video_generation",
  "spark_runtime",
  "bespoke_code",
  "existing_media",
];
const allowedIntegrationModes = [
  "live_component",
  "copied_component",
  "rewritten_component",
  "captured_html_plate",
  "transparent_asset_layer",
  "video_plate",
  "browser_canvas_plate",
];
const allowedDirectorStacks = ["remotion", "html_3d", "source_media", "hyperframes", "vibemotion", "spark", "gen_insert"];
const allowedSceneJobs = ["hook", "context", "proof", "build", "peak", "rest", "payoff", "close"];
const allowedEvidenceRoles = ["hero", "supporting", "background", "none"];
const allowedDensities = ["minimal", "moderate", "dense"];
const allowedSubtitleModes = ["bottom_bar", "floating_caption", "keyword_only", "none"];
const allowedSourceUseDecisions = [
  "hero_proof",
  "supporting_proof",
  "context",
  "texture",
  "reference_only",
  "unused",
];
const allowedScreenRecordingRouteTypes = ["evidence_clip", "source_media_plate"];
const allowedScreenRecordingProofRoles = ["hero", "supporting", "context", "none"];
const allowedScreenRecordingPrivacyReview = ["not_needed", "passed", "needs_redaction", "blocked"];
const allowedScreenRecordingLegibility = ["passed", "needs_zoom", "needs_rebuild", "blocked"];
const allowedKnowledgeActions = ["define", "compare", "decompose", "prove", "invert", "compress", "expand", "summarize", "bridge", "hook"];
const allowedContinuityHandleOrigins = ["source_material", "designed_graphic", "concept", "subtitle", "data", "voice_beat"];
const allowedContinuityHandleKinds = ["keyword", "number", "shape", "line", "frame", "arrow", "color", "motion", "layout", "proof_region"];
const allowedEdgeHandleKinds = [...allowedContinuityHandleKinds, "question_answer", "scale_shift"];
const allowedTransitionMethods = [
  "keyword_relay",
  "proof_region_relay",
  "diagram_morph",
  "scale_shift",
  "axis_handoff",
  "question_answer_cut",
  "color_logic_cut",
  "subtitle_to_visual",
  "hard_cut",
  "breath_cut",
];

// ---- visual.screen_recording_brief ----

const screenRecordingBrief = state.visual?.screen_recording_brief ?? {};
const screenRecordingClips = screenRecordingBrief.clips ?? [];
assert(Array.isArray(screenRecordingClips), "visual.screen_recording_brief.clips must be an array");

const screenRecordingClipIds = new Set();

for (const [i, clip] of screenRecordingClips.entries()) {
  const tag = `visual.screen_recording_brief.clips[${i}]`;
  assert(clip.clip_id, `${tag}.clip_id is required`);
  assert(clip.media_path, `${tag}.media_path is required`);
  assert(clip.time_range, `${tag}.time_range is required`);
  assert(clip.route_type, `${tag}.route_type is required`);
  assert(clip.visual_job, `${tag}.visual_job is required`);
  assert(clip.proof_role, `${tag}.proof_role is required`);
  assert(clip.privacy_review, `${tag}.privacy_review is required`);
  assert(clip.legibility_check, `${tag}.legibility_check is required`);
  assert(clip.crop_strategy, `${tag}.crop_strategy is required`);
  assert(clip.remotion_treatment, `${tag}.remotion_treatment is required`);
  assert(clip.execution_runtime, `${tag}.execution_runtime is required`);
  assert(clip.motion_source, `${tag}.motion_source is required`);
  assert(clip.integration_mode, `${tag}.integration_mode is required`);
  assert(clip.promotion_target_renderer_family, `${tag}.promotion_target_renderer_family is required`);
  assert(clip.reason, `${tag}.reason is required`);
  checkEnum(`${tag}.route_type`, clip.route_type, allowedScreenRecordingRouteTypes);
  checkEnum(`${tag}.proof_role`, clip.proof_role, allowedScreenRecordingProofRoles);
  checkEnum(`${tag}.privacy_review`, clip.privacy_review, allowedScreenRecordingPrivacyReview);
  checkEnum(`${tag}.legibility_check`, clip.legibility_check, allowedScreenRecordingLegibility);
  checkEnum(`${tag}.execution_runtime`, clip.execution_runtime, allowedExecutionRuntimes);
  checkEnum(`${tag}.motion_source`, clip.motion_source, allowedMotionSources);
  checkEnum(`${tag}.integration_mode`, clip.integration_mode, allowedIntegrationModes);
  checkEnum(`${tag}.promotion_target_renderer_family`, clip.promotion_target_renderer_family, allowedFinalRendererFamilies);

  if (clip.clip_id) screenRecordingClipIds.add(clip.clip_id);

  assert(
    clip.motion_source === "existing_media",
    `INV-SCREEN-RECORDING-ROUTE: ${tag}.motion_source must be "existing_media"`
  );
  assert(
    ["remotion", "source_media"].includes(clip.execution_runtime),
    `INV-SCREEN-RECORDING-ROUTE: ${tag}.execution_runtime must be "remotion" or "source_media"`
  );
  assert(
    clip.integration_mode === "video_plate",
    `INV-SCREEN-RECORDING-ROUTE: ${tag}.integration_mode must be "video_plate"`
  );
  assert(
    clip.promotion_target_renderer_family === "remotion_component",
    `INV-SCREEN-RECORDING-ROUTE: ${tag}.promotion_target_renderer_family must be "remotion_component"`
  );
  assert(
    clip.privacy_review !== "blocked",
    `INV-SCREEN-RECORDING-ROUTE: ${tag}.privacy_review cannot be "blocked"`
  );
  assert(
    clip.legibility_check !== "blocked",
    `INV-SCREEN-RECORDING-ROUTE: ${tag}.legibility_check cannot be "blocked"`
  );

  const timeRange = clip.time_range ?? {};
  if (timeRange.start !== undefined && timeRange.end !== undefined) {
    assert(
      typeof timeRange.start === "number" && typeof timeRange.end === "number" && timeRange.end > timeRange.start,
      `${tag}.time_range.end must be greater than time_range.start`
    );
  }
}

for (const [i, plan] of sourceMaterialPlan.entries()) {
  const tag = `visual.source_material_plan[${i}]`;
  for (const clipId of asArray(plan.screen_recording_clip_ids)) {
    assert(
      screenRecordingClipIds.has(clipId),
      `${tag}.screen_recording_clip_ids references unknown visual.screen_recording_brief clip_id "${clipId}"`
    );
  }
}

const scenes = state.render?.scene_motion_specs ?? [];
assert(Array.isArray(scenes), "render.scene_motion_specs must be an array");

let sparkSceneCount = 0;

for (const [i, scene] of scenes.entries()) {
  const tag = `render.scene_motion_specs[${i}]`;
  assert(scene.scene_id, `${tag}.scene_id is required`);
  assert(scene.render_mode, `${tag}.render_mode is required`);
  assert(scene.renderer_family, `${tag}.renderer_family is required`);
  assert(scene.dominant_anchor, `${tag}.dominant_anchor is required`);
  checkEnum(`${tag}.render_mode`, scene.render_mode, allowedRenderModes);
  checkEnum(`${tag}.renderer_family`, scene.renderer_family, allowedRendererFamilies);
  checkEnum(`${tag}.actual_renderer_family`, scene.actual_renderer_family, allowedActualRendererFamilies);
  checkEnum(`${tag}.route_status`, scene.route_status, allowedRouteStatus);
  checkEnum(`${tag}.execution_runtime`, scene.execution_runtime, allowedExecutionRuntimes);
  checkEnum(`${tag}.motion_source`, scene.motion_source, allowedMotionSources);
  checkEnum(`${tag}.integration_mode`, scene.integration_mode, allowedIntegrationModes);
  checkEnum(`${tag}.promotion_target_renderer_family`, scene.promotion_target_renderer_family, allowedFinalRendererFamilies);

  const sceneScreenRecordingIds = scene.screen_recording_clip_ids ?? [];
  assert(Array.isArray(sceneScreenRecordingIds), `${tag}.screen_recording_clip_ids must be an array when present`);

  if (sceneScreenRecordingIds.length > 0) {
    assert(
      scene.renderer_family === "remotion_component",
      `INV-SCREEN-RECORDING-ROUTE: ${tag}.renderer_family must be "remotion_component" for screen recording scenes`
    );
    assert(
      scene.motion_source === "existing_media",
      `INV-SCREEN-RECORDING-ROUTE: ${tag}.motion_source must be "existing_media" for screen recording scenes`
    );
    assert(
      ["remotion", "source_media"].includes(scene.execution_runtime),
      `INV-SCREEN-RECORDING-ROUTE: ${tag}.execution_runtime must be "remotion" or "source_media" for screen recording scenes`
    );
    assert(
      scene.integration_mode === "video_plate",
      `INV-SCREEN-RECORDING-ROUTE: ${tag}.integration_mode must be "video_plate" for screen recording scenes`
    );
    assert(
      scene.promotion_target_renderer_family === "remotion_component",
      `INV-SCREEN-RECORDING-ROUTE: ${tag}.promotion_target_renderer_family must be "remotion_component" for screen recording scenes`
    );

    for (const clipId of sceneScreenRecordingIds) {
      assert(
        screenRecordingClipIds.has(clipId),
        `INV-SCREEN-RECORDING-ROUTE: ${tag}.screen_recording_clip_ids references unknown clip_id "${clipId}"`
      );
    }
  }

  if (scene.motion_source === "ai_video_generation") {
    const hasCandidateRefs = hasNonEmptyTextArray(scene.ai_video_candidate_ids);
    const hasPromptRequestRefs = hasNonEmptyTextArray(scene.ai_video_prompt_request_ids);
    assert(
      ["gen_insert", "mixed_scene"].includes(scene.render_mode),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.render_mode must be "gen_insert" or "mixed_scene" for AI video plates`
    );
    assert(
      scene.renderer_family === "remotion_component",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.renderer_family must remain "remotion_component" for AI video plates`
    );
    assert(
      scene.execution_runtime === "remotion",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.execution_runtime must be "remotion" for AI video plates`
    );
    assert(
      scene.integration_mode === "video_plate",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.integration_mode must be "video_plate" for AI video plates`
    );
    assert(
      scene.promotion_target_renderer_family === "remotion_component",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.promotion_target_renderer_family must be "remotion_component" for AI video plates`
    );
    assert(
      hasCandidateRefs || hasPromptRequestRefs,
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.ai_video_candidate_ids or ai_video_prompt_request_ids must link the generated-video lane`
    );
    if (stageIdx >= stageRank["render"]) {
      assert(
        hasCandidateRefs,
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.ai_video_candidate_ids must link generated video files before render`
      );
    }
  }

  if (stageIdx >= stageRank["render"]) {
    assert(
      scene.renderer_family !== "vibemotion_candidate",
      `INV-NO-VIBEMOTION-FINAL: ${tag}.renderer_family cannot remain "vibemotion_candidate" at active_stage "${stage}"`
    );

    if (scene.motion_source === "vibemotion_skill") {
      assert(scene.integration_mode, `${tag}.integration_mode is required for VibeMotion-sourced render scenes`);
      assert(
        scene.promotion_target_renderer_family,
        `${tag}.promotion_target_renderer_family is required for VibeMotion-sourced render scenes`
      );
      assert(
        scene.promotion_target_renderer_family === scene.renderer_family,
        `${tag}.promotion_target_renderer_family must match final renderer_family "${scene.renderer_family}" for VibeMotion-sourced render scenes`
      );
      assert(
        hasText(scene.candidate_skill) || hasNonEmptyArray(scene.vibemotion_candidate_ids),
        `${tag}.candidate_skill or vibemotion_candidate_ids is required for VibeMotion-sourced render scenes`
      );
    }

    if (scene.motion_source === "hyperframes_runtime") {
      assert(scene.integration_mode, `${tag}.integration_mode is required for Hyperframes-sourced render scenes`);
      assert(
        scene.promotion_target_renderer_family,
        `${tag}.promotion_target_renderer_family is required for Hyperframes-sourced render scenes`
      );
      assert(
        scene.promotion_target_renderer_family === scene.renderer_family,
        `${tag}.promotion_target_renderer_family must match final renderer_family "${scene.renderer_family}" for Hyperframes-sourced render scenes`
      );
      if (["html_scene", "canvas_scene"].includes(scene.renderer_family)) {
        assert(
          scene.execution_runtime === "html_browser_capture",
          `${tag}.execution_runtime must be "html_browser_capture" for Hyperframes html_scene/canvas_scene render scenes`
        );
      }
      assert(
        hasText(scene.source_html_path) || hasNonEmptyArray(scene.hyperframes_candidate_ids),
        `${tag}.source_html_path or hyperframes_candidate_ids is required for Hyperframes-sourced render scenes`
      );
    }
  }

  // Spark cross-field rules (lifted from validate-spark-routes.mjs)
  if (scene.renderer_family === "spark_3dgs") {
    sparkSceneCount += 1;
    assert(
      scene.execution_runtime === "spark_browser_canvas",
      `${tag}.execution_runtime must be "spark_browser_canvas" for spark_3dgs scenes`
    );
    assert(scene.actual_renderer_family, `${tag}.actual_renderer_family is required when renderer_family is spark_3dgs`);
    assert(scene.spark_asset_route, `${tag}.spark_asset_route is required for spark_3dgs scenes`);
    assert(scene.spark_runtime_profile, `${tag}.spark_runtime_profile is required for spark_3dgs scenes`);
    assert(scene.route_status, `${tag}.route_status is required for spark_3dgs scenes`);

    const worldAsset = scene.world_asset ?? {};
    assert(worldAsset.asset_kind, `${tag}.world_asset.asset_kind is required`);
    assert(worldAsset.format, `${tag}.world_asset.format is required`);

    if (worldAsset.format === "procedural_packed_splats" || worldAsset.asset_kind === "procedural_splat") {
      assert(
        scene.route_status === "procedural_splat_world",
        `${tag}: procedural assets must use route_status "procedural_splat_world" (got "${scene.route_status}")`
      );
      assert(
        scene.actual_renderer_family === "spark_procedural_splat",
        `${tag}: procedural assets must use actual_renderer_family "spark_procedural_splat" (got "${scene.actual_renderer_family}")`
      );
    }

    if (scene.route_status === "true_3dgs_asset") {
      assert(worldAsset.path_or_url, `${tag}: true_3dgs_asset requires world_asset.path_or_url`);
      assert(
        worldAsset.format !== "procedural_packed_splats",
        `${tag}: true_3dgs_asset cannot use format "procedural_packed_splats"`
      );
    }

    if (scene.route_status === "streaming_rad_world") {
      assert(worldAsset.format === "rad", `${tag}: streaming_rad_world requires world_asset.format "rad"`);
      assert(
        scene.spark_runtime_profile?.paged === true,
        `${tag}: streaming_rad_world requires spark_runtime_profile.paged === true`
      );
    }

    if (scene.route_status === "hybrid_spark_three") {
      assert(
        scene.actual_renderer_family === "spark_hybrid_three",
        `${tag}: route_status "hybrid_spark_three" requires actual_renderer_family "spark_hybrid_three" (got "${scene.actual_renderer_family}")`
      );
    }
  }
}

// ---- render.vibemotion_candidates ----

const allowedOptionTypes = ["recommended", "bold", "safe"];
const allowedTechnicalRoutes = ["vibemotion_video", "vibemotion_html", "remotion_component", "spark_plate_plus_remotion"];
const allowedOutputKinds = ["mp4", "mov", "html", "component", "transparent_asset"];
const allowedCandidateReviewStatus = ["pending", "approved", "rejected", "needs_revision"];
const allowedCandidateOrigins = ["generated_from_current_state", "primitive_reference_adapted_to_current_state"];
const allowedAIVideoProviders = ["seedance", "runway", "pika", "kling", "luma", "other_ai_video"];
const allowedAIVideoTechnicalRoutes = ["text_to_video", "image_to_video", "video_to_video", "reference_guided_video"];
const allowedAIVideoOutputKinds = ["mp4", "mov", "webm", "image_sequence"];
const allowedAIVideoCandidateOrigins = ["generated_from_current_state", "reference_guided_from_current_state"];
const allowedAIVideoPromptStatuses = ["drafted", "handed_to_user", "generated", "cancelled", "blocked"];
const allowedPluginIds = ["hyperframes@openai-curated", "remotion@openai-curated"];
const allowedAdapterKinds = ["codex_plugin", "local_cli", "local_skill", "manual_implementation", "external_api"];
const allowedPluginSkills = [
  "HyperFrames by HeyGen:hyperframes",
  "HyperFrames by HeyGen:hyperframes-cli",
  "HyperFrames by HeyGen:hyperframes-registry",
  "HyperFrames by HeyGen:gsap",
  "HyperFrames by HeyGen:website-to-hyperframes",
  "Remotion:remotion",
  "hyperframes-cli",
  "hyperframes-local-skill",
  "remotion-render-adapter",
  "manual-hyperframes-implementation",
  "manual-remotion-implementation",
  "seedance-api",
  "manual-ai-video-api",
];
const allowedPluginRunStatuses = ["planned", "generated", "previewed", "promoted", "rejected", "blocked"];
const pluginRunStatusesWithOutputs = ["generated", "previewed", "promoted", "rejected"];

const candidates = state.render?.vibemotion_candidates ?? [];
assert(Array.isArray(candidates), "render.vibemotion_candidates must be an array");

for (const [i, candidate] of candidates.entries()) {
  const tag = `render.vibemotion_candidates[${i}]`;
  assert(candidate.candidate_id, `${tag}.candidate_id is required`);
  assert(Array.isArray(candidate.scene_ids) && candidate.scene_ids.length > 0, `${tag}.scene_ids must be a non-empty array`);
  assert(candidate.option_type, `${tag}.option_type is required`);
  assert(candidate.generator_skill, `${tag}.generator_skill is required`);
  assert(candidate.technical_route, `${tag}.technical_route is required`);
  assert(candidate.output_path, `${tag}.output_path is required`);
  assert(candidate.output_kind, `${tag}.output_kind is required`);
  assert(candidate.review_status, `${tag}.review_status is required`);
  assert(candidate.motion_source, `${tag}.motion_source is required`);
  assert(candidate.candidate_origin, `${tag}.candidate_origin is required`);
  assert(hasNonEmptyTextArray(candidate.state_trace_refs), `${tag}.state_trace_refs must be a non-empty string array`);
  checkEnum(`${tag}.option_type`, candidate.option_type, allowedOptionTypes);
  checkEnum(`${tag}.technical_route`, candidate.technical_route, allowedTechnicalRoutes);
  checkEnum(`${tag}.output_kind`, candidate.output_kind, allowedOutputKinds);
  checkEnum(`${tag}.review_status`, candidate.review_status, allowedCandidateReviewStatus);
  checkEnum(`${tag}.motion_source`, candidate.motion_source, allowedMotionSources);
  checkEnum(`${tag}.integration_mode`, candidate.integration_mode, allowedIntegrationModes);
  checkEnum(`${tag}.promotion_target_renderer_family`, candidate.promotion_target_renderer_family, allowedFinalRendererFamilies);
  checkEnum(`${tag}.candidate_origin`, candidate.candidate_origin, allowedCandidateOrigins);

  assert(
    candidate.motion_source === "vibemotion_skill",
    `${tag}.motion_source must be "vibemotion_skill" for VibeMotion candidates`
  );

  if (stageIdx >= stageRank["render"] && candidate.review_status === "approved") {
    assert(
      candidate.integration_mode,
      `INV-NO-VIBEMOTION-FINAL: ${tag}.integration_mode is required for approved VibeMotion candidates before render`
    );
    assert(
      candidate.promotion_target_renderer_family,
      `INV-NO-VIBEMOTION-FINAL: ${tag}.promotion_target_renderer_family is required for approved VibeMotion candidates before render`
    );
  }
}

// ---- render.hyperframes_candidates ----

const allowedHyperframesTechnicalRoutes = [
  "hyperframes_html",
  "hyperframes_canvas",
  "hyperframes_lottie",
  "hyperframes_three",
  "hyperframes_asset",
];

const hyperframesCandidates = state.render?.hyperframes_candidates ?? [];
assert(Array.isArray(hyperframesCandidates), "render.hyperframes_candidates must be an array");

for (const [i, candidate] of hyperframesCandidates.entries()) {
  const tag = `render.hyperframes_candidates[${i}]`;
  assert(candidate.candidate_id, `${tag}.candidate_id is required`);
  assert(Array.isArray(candidate.scene_ids) && candidate.scene_ids.length > 0, `${tag}.scene_ids must be a non-empty array`);
  assert(candidate.option_type, `${tag}.option_type is required`);
  assert(candidate.generator, `${tag}.generator is required`);
  assert(candidate.technical_route, `${tag}.technical_route is required`);
  assert(candidate.source_path, `${tag}.source_path is required`);
  assert(candidate.output_path, `${tag}.output_path is required`);
  assert(candidate.output_kind, `${tag}.output_kind is required`);
  assert(candidate.review_status, `${tag}.review_status is required`);
  assert(candidate.motion_source, `${tag}.motion_source is required`);
  assert(candidate.candidate_origin, `${tag}.candidate_origin is required`);
  assert(hasNonEmptyTextArray(candidate.state_trace_refs), `${tag}.state_trace_refs must be a non-empty string array`);
  checkEnum(`${tag}.option_type`, candidate.option_type, allowedOptionTypes);
  checkEnum(`${tag}.technical_route`, candidate.technical_route, allowedHyperframesTechnicalRoutes);
  checkEnum(`${tag}.output_kind`, candidate.output_kind, allowedOutputKinds);
  checkEnum(`${tag}.review_status`, candidate.review_status, allowedCandidateReviewStatus);
  checkEnum(`${tag}.motion_source`, candidate.motion_source, allowedMotionSources);
  checkEnum(`${tag}.integration_mode`, candidate.integration_mode, allowedIntegrationModes);
  checkEnum(`${tag}.promotion_target_renderer_family`, candidate.promotion_target_renderer_family, allowedFinalRendererFamilies);
  checkEnum(`${tag}.candidate_origin`, candidate.candidate_origin, allowedCandidateOrigins);

  if (candidate.motion_source !== undefined) {
    assert(
      candidate.motion_source === "hyperframes_runtime",
      `${tag}.motion_source must be "hyperframes_runtime" for Hyperframes candidates`
    );
  }

  if (stageIdx >= stageRank["render"] && candidate.review_status === "approved") {
    assert(
      candidate.integration_mode,
      `INV-NO-HYPERFRAMES-UNPROMOTED-FINAL: ${tag}.integration_mode is required for approved Hyperframes candidates before render`
    );
    assert(
      candidate.promotion_target_renderer_family,
      `INV-NO-HYPERFRAMES-UNPROMOTED-FINAL: ${tag}.promotion_target_renderer_family is required for approved Hyperframes candidates before render`
    );
  }
}

// ---- render.ai_video_prompt_requests ----

const aiVideoPromptRequests = state.render?.ai_video_prompt_requests ?? [];
assert(Array.isArray(aiVideoPromptRequests), "render.ai_video_prompt_requests must be an array");

const aiVideoPromptRequestIds = new Set();
for (const [i, request] of aiVideoPromptRequests.entries()) {
  const tag = `render.ai_video_prompt_requests[${i}]`;
  assert(request.request_id, `${tag}.request_id is required`);
  assert(Array.isArray(request.scene_ids) && request.scene_ids.length > 0, `${tag}.scene_ids must be a non-empty array`);
  assert(request.option_type, `${tag}.option_type is required`);
  assert(request.provider, `${tag}.provider is required`);
  assert(request.provider_model_hint, `${tag}.provider_model_hint is required`);
  assert(request.technical_route, `${tag}.technical_route is required`);
  assert(request.prompt_pack_path, `${tag}.prompt_pack_path is required`);
  assert(request.prompt_path, `${tag}.prompt_path is required`);
  assert(request.prompt_text, `${tag}.prompt_text is required`);
  assert(request.negative_prompt, `${tag}.negative_prompt is required`);
  assert(request.output_expectation, `${tag}.output_expectation is required`);
  assert(request.status, `${tag}.status is required`);
  assert(hasNonEmptyTextArray(request.state_trace_refs), `${tag}.state_trace_refs must be a non-empty string array`);
  assert(request.proof_exclusion_policy, `${tag}.proof_exclusion_policy is required`);
  assert(request.remotion_integration_plan, `${tag}.remotion_integration_plan is required`);
  assert(request.handoff_instructions, `${tag}.handoff_instructions is required`);
  checkEnum(`${tag}.option_type`, request.option_type, allowedOptionTypes);
  checkEnum(`${tag}.provider`, request.provider, allowedAIVideoProviders);
  checkEnum(`${tag}.technical_route`, request.technical_route, allowedAIVideoTechnicalRoutes);
  checkEnum(`${tag}.status`, request.status, allowedAIVideoPromptStatuses);

  if (request.request_id) {
    assert(
      !aiVideoPromptRequestIds.has(request.request_id),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.request_id "${request.request_id}" is duplicated`
    );
    aiVideoPromptRequestIds.add(request.request_id);
  }

  for (const sceneId of asArray(request.scene_ids)) {
    if (storySceneIds.size > 0) {
      assert(
        storySceneIds.has(sceneId),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.scene_ids references unknown story mother scene "${sceneId}"`
      );
    }
  }

  assert(
    hasText(request.negative_prompt) &&
      textIncludesAny(request.negative_prompt, ["claim", "text", "logo", "face", "ui", "proof", "subtitle", "caption", "文字", "字幕", "证据"]),
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.negative_prompt must exclude readable claims/text, proof, logos, faces, and UI-like evidence`
  );
  assert(
    hasText(request.proof_exclusion_policy) &&
      textIncludesAny(request.proof_exclusion_policy, ["no proof", "no evidence", "not evidence", "not proof", "remotion", "caption", "subtitle", "证据", "字幕"]),
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.proof_exclusion_policy must state that generated video cannot carry proof or subtitles`
  );
  assert(
    hasText(request.remotion_integration_plan) &&
      textIncludesAny(request.remotion_integration_plan, ["remotion", "video_plate", "plate", "subtitle", "proof", "overlay"]),
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.remotion_integration_plan must explain Remotion-controlled video_plate integration`
  );
  assert(
    hasText(request.handoff_instructions) &&
      textIncludesAny(request.handoff_instructions, ["user", "manual", "platform", "download", "return", "place", "回填", "生成", "下载"]),
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.handoff_instructions must explain the manual user generation and return path`
  );
}

// ---- render.ai_video_candidates ----

const aiVideoCandidates = state.render?.ai_video_candidates ?? [];
assert(Array.isArray(aiVideoCandidates), "render.ai_video_candidates must be an array");

const aiVideoCandidateIds = new Set();
for (const [i, candidate] of aiVideoCandidates.entries()) {
  const tag = `render.ai_video_candidates[${i}]`;
  assert(candidate.candidate_id, `${tag}.candidate_id is required`);
  assert(Array.isArray(candidate.scene_ids) && candidate.scene_ids.length > 0, `${tag}.scene_ids must be a non-empty array`);
  assert(candidate.option_type, `${tag}.option_type is required`);
  assert(candidate.provider, `${tag}.provider is required`);
  assert(candidate.provider_model, `${tag}.provider_model is required`);
  assert(candidate.technical_route, `${tag}.technical_route is required`);
  assert(candidate.prompt_path, `${tag}.prompt_path is required`);
  assert(candidate.prompt_text, `${tag}.prompt_text is required`);
  assert(candidate.negative_prompt, `${tag}.negative_prompt is required`);
  assert(candidate.output_path, `${tag}.output_path is required`);
  assert(candidate.output_kind, `${tag}.output_kind is required`);
  assert(candidate.review_status, `${tag}.review_status is required`);
  assert(candidate.motion_source, `${tag}.motion_source is required`);
  assert(candidate.candidate_origin, `${tag}.candidate_origin is required`);
  assert(hasNonEmptyTextArray(candidate.state_trace_refs), `${tag}.state_trace_refs must be a non-empty string array`);
  assert(candidate.proof_exclusion_policy, `${tag}.proof_exclusion_policy is required`);
  assert(candidate.remotion_integration_plan, `${tag}.remotion_integration_plan is required`);
  assert(hasObject(candidate.safety_review), `${tag}.safety_review is required`);
  checkEnum(`${tag}.option_type`, candidate.option_type, allowedOptionTypes);
  checkEnum(`${tag}.provider`, candidate.provider, allowedAIVideoProviders);
  checkEnum(`${tag}.technical_route`, candidate.technical_route, allowedAIVideoTechnicalRoutes);
  checkEnum(`${tag}.output_kind`, candidate.output_kind, allowedAIVideoOutputKinds);
  checkEnum(`${tag}.review_status`, candidate.review_status, allowedCandidateReviewStatus);
  checkEnum(`${tag}.motion_source`, candidate.motion_source, allowedMotionSources);
  checkEnum(`${tag}.candidate_origin`, candidate.candidate_origin, allowedAIVideoCandidateOrigins);
  checkEnum(`${tag}.integration_mode`, candidate.integration_mode, allowedIntegrationModes);
  checkEnum(`${tag}.promotion_target_renderer_family`, candidate.promotion_target_renderer_family, allowedFinalRendererFamilies);

  if (candidate.candidate_id) {
    assert(
      !aiVideoCandidateIds.has(candidate.candidate_id),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.candidate_id "${candidate.candidate_id}" is duplicated`
    );
    aiVideoCandidateIds.add(candidate.candidate_id);
  }

  for (const sceneId of asArray(candidate.scene_ids)) {
    if (storySceneIds.size > 0) {
      assert(
        storySceneIds.has(sceneId),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.scene_ids references unknown story mother scene "${sceneId}"`
      );
    }
  }
  if (hasText(candidate.prompt_request_id)) {
    assert(
      aiVideoPromptRequestIds.has(candidate.prompt_request_id),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.prompt_request_id references missing render.ai_video_prompt_requests request_id "${candidate.prompt_request_id}"`
    );
  }

  assert(
    candidate.motion_source === "ai_video_generation",
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.motion_source must be "ai_video_generation"`
  );
  assert(
    hasText(candidate.negative_prompt) &&
      textIncludesAny(candidate.negative_prompt, ["claim", "text", "logo", "face", "ui", "proof", "字幕", "文字", "证据"]),
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.negative_prompt must exclude readable claims/text, proof, logos, faces, and UI-like evidence`
  );
  assert(
    hasText(candidate.proof_exclusion_policy) &&
      textIncludesAny(candidate.proof_exclusion_policy, ["no proof", "no evidence", "not evidence", "not proof", "Remotion", "caption", "subtitle", "证据", "字幕"]),
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.proof_exclusion_policy must state that generated video cannot carry proof or subtitles`
  );
  assert(
    hasText(candidate.remotion_integration_plan) &&
      textIncludesAny(candidate.remotion_integration_plan, ["remotion", "video_plate", "plate", "subtitle", "proof", "overlay"]),
    `INV-AI-VIDEO-GEN-INSERT: ${tag}.remotion_integration_plan must explain Remotion-controlled video_plate integration`
  );

  const safety = candidate.safety_review ?? {};
  for (const safetyKey of ["no_false_evidence", "no_readable_claim_text", "no_brand_or_ip_issue", "no_face_or_identity_risk"]) {
    assert(
      safety[safetyKey] === true,
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.safety_review.${safetyKey} must be true before the candidate can enter Xingchen state`
    );
  }
  assert(typeof safety.notes === "string", `INV-AI-VIDEO-GEN-INSERT: ${tag}.safety_review.notes must be a string`);

  if (stageIdx >= stageRank["render"] && candidate.review_status === "approved") {
    assert(
      candidate.integration_mode === "video_plate",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.integration_mode must be "video_plate" for approved AI video candidates before render`
    );
    assert(
      candidate.promotion_target_renderer_family === "remotion_component",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.promotion_target_renderer_family must be "remotion_component" for approved AI video candidates before render`
    );
  }
}

for (const [i, scene] of scenes.entries()) {
  if (scene.motion_source !== "ai_video_generation") continue;
  const tag = `render.scene_motion_specs[${i}]`;
  for (const requestId of asArray(scene.ai_video_prompt_request_ids)) {
    assert(
      aiVideoPromptRequestIds.has(requestId),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.ai_video_prompt_request_ids references missing render.ai_video_prompt_requests request_id "${requestId}"`
    );
    const request = aiVideoPromptRequests.find((item) => item?.request_id === requestId);
    assert(
      asArray(request?.scene_ids).includes(scene.scene_id),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.ai_video_prompt_request_ids request "${requestId}" must list scene "${scene.scene_id}"`
    );
  }
  for (const candidateId of asArray(scene.ai_video_candidate_ids)) {
    assert(
      aiVideoCandidateIds.has(candidateId),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.ai_video_candidate_ids references missing render.ai_video_candidates candidate_id "${candidateId}"`
    );
    const candidate = aiVideoCandidates.find((item) => item?.candidate_id === candidateId);
    assert(
      asArray(candidate?.scene_ids).includes(scene.scene_id),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.ai_video_candidate_ids candidate "${candidateId}" must list scene "${scene.scene_id}"`
    );
  }
}

// ---- render.plugin_adapter_runs ----

const pluginAdapterRuns = state.render?.plugin_adapter_runs ?? [];
assert(Array.isArray(pluginAdapterRuns), "render.plugin_adapter_runs must be an array");

const hyperframesCandidateIds = new Set(
  hyperframesCandidates.map((candidate) => candidate?.candidate_id).filter(Boolean)
);
const hyperframesCandidateIdsWithPluginRun = new Set();
const aiVideoCandidateIdsWithAdapterRun = new Set();
const directorBoardSceneIdsForPlugins = new Set(
  asArray(state.visual?.director_board?.scene_boards).map((board) => board?.scene_id).filter(Boolean)
);

for (const [i, run] of pluginAdapterRuns.entries()) {
  const tag = `render.plugin_adapter_runs[${i}]`;
  const adapterId = run.adapter_id ?? run.plugin_id;
  const isHyperframesAdapter =
    adapterId === "hyperframes@openai-curated" ||
    adapterId === "hyperframes-cli" ||
    adapterId === "hyperframes-local-skill" ||
    adapterId === "manual-hyperframes-implementation" ||
    (hasText(run.skill_name) && run.skill_name.startsWith("HyperFrames by HeyGen:")) ||
    run.skill_name === "hyperframes-cli" ||
    run.skill_name === "hyperframes-local-skill" ||
    run.skill_name === "manual-hyperframes-implementation";
  const isRemotionAdapter =
    adapterId === "remotion@openai-curated" ||
    adapterId === "remotion-render-adapter" ||
    adapterId === "manual-remotion-implementation" ||
    run.skill_name === "Remotion:remotion" ||
    run.skill_name === "remotion-render-adapter" ||
    run.skill_name === "manual-remotion-implementation";
  const isAIVideoAdapter =
    run.adapter_kind === "external_api" ||
    adapterId === "seedance-api" ||
    adapterId === "manual-ai-video-api" ||
    run.skill_name === "seedance-api" ||
    run.skill_name === "manual-ai-video-api";
  assert(run.run_id, `${tag}.run_id is required`);
  assert(run.adapter_kind, `${tag}.adapter_kind is required`);
  assert(adapterId, `${tag}.adapter_id is required`);
  assert(run.skill_name, `${tag}.skill_name is required`);
  assert(run.status, `${tag}.status is required`);
  assert(typeof run.lookdev_evidence_required === "boolean", `${tag}.lookdev_evidence_required must be boolean`);
  assert(typeof run.notes === "string", `${tag}.notes must be a string`);
  assert(hasNonEmptyTextArray(run.scene_ids), `${tag}.scene_ids must be a non-empty string array`);
  assert(hasNonEmptyTextArray(run.input_state_refs), `${tag}.input_state_refs must be a non-empty string array`);
  assert(Array.isArray(run.output_paths), `${tag}.output_paths must be an array`);
  assert(Array.isArray(run.state_writebacks), `${tag}.state_writebacks must be an array`);
  assert(Array.isArray(run.candidate_ids), `${tag}.candidate_ids must be an array`);
  checkEnum(`${tag}.adapter_kind`, run.adapter_kind, allowedAdapterKinds);
  if (run.adapter_kind === "codex_plugin") {
    checkEnum(`${tag}.adapter_id`, adapterId, allowedPluginIds);
  }
  checkEnum(`${tag}.skill_name`, run.skill_name, allowedPluginSkills);
  checkEnum(`${tag}.status`, run.status, allowedPluginRunStatuses);
  checkEnum(`${tag}.promotion_target_renderer_family`, run.promotion_target_renderer_family, allowedFinalRendererFamilies);

  if (pluginRunStatusesWithOutputs.includes(run.status)) {
    assert(
      hasNonEmptyTextArray(run.output_paths),
      `INV-PLUGIN-ADAPTER-TRACE: ${tag}.output_paths must be non-empty when status is "${run.status}"`
    );
    assert(
      hasNonEmptyTextArray(run.state_writebacks),
      `INV-PLUGIN-ADAPTER-TRACE: ${tag}.state_writebacks must be non-empty when status is "${run.status}"`
    );
  }

  if (run.adapter_kind === "codex_plugin" && adapterId === "hyperframes@openai-curated") {
    assert(
      hasText(run.skill_name) && run.skill_name.startsWith("HyperFrames by HeyGen:"),
      `INV-PLUGIN-ADAPTER-TRACE: ${tag}.skill_name must be a HyperFrames plugin skill when adapter_id is hyperframes@openai-curated`
    );
  }

  if (isHyperframesAdapter) {
    if (run.status !== "planned" && run.status !== "blocked") {
      assert(
        asArray(run.state_writebacks).some((ref) => ref.includes("render.hyperframes_candidates")),
        `INV-PLUGIN-ADAPTER-TRACE: ${tag}.state_writebacks must include render.hyperframes_candidates for HyperFrames generated artifacts`
      );
    }
  }

  if (run.adapter_kind === "codex_plugin" && adapterId === "remotion@openai-curated") {
    assert(
      run.skill_name === "Remotion:remotion",
      `INV-PLUGIN-ADAPTER-TRACE: ${tag}.skill_name must be "Remotion:remotion" when adapter_id is remotion@openai-curated`
    );
  }

  if (isRemotionAdapter) {
    if (run.status !== "planned" && run.status !== "blocked") {
      assert(
        asArray(run.state_writebacks).some((ref) => ref.startsWith("render.")),
        `INV-PLUGIN-ADAPTER-TRACE: ${tag}.state_writebacks must include a render.* state path for Remotion adapter work`
      );
    }
  }

  if (isAIVideoAdapter) {
    assert(
      run.adapter_kind === "external_api" || run.adapter_kind === "manual_implementation",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.adapter_kind must be "external_api" or "manual_implementation" for AI video generation`
    );
    assert(
      adapterId === "seedance-api" || adapterId === "manual-ai-video-api",
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.adapter_id must be "seedance-api" or "manual-ai-video-api" for AI video generation`
    );
    assert(
      hasNonEmptyTextArray(run.candidate_ids),
      `INV-AI-VIDEO-GEN-INSERT: ${tag}.candidate_ids must link render.ai_video_candidates[]`
    );
    if (run.status !== "planned" && run.status !== "blocked") {
      assert(
        asArray(run.state_writebacks).some((ref) => ref.includes("render.ai_video_candidates")),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.state_writebacks must include render.ai_video_candidates for AI video generation`
      );
      assert(
        asArray(run.input_state_refs).some((ref) => ref.includes("visual.director_board.scene_boards")),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.input_state_refs must include visual.director_board.scene_boards for AI video generation`
      );
    }
  }

  for (const sceneId of asArray(run.scene_ids)) {
    if (storySceneIds.size > 0) {
      assert(
        storySceneIds.has(sceneId),
        `INV-PLUGIN-ADAPTER-TRACE: ${tag}.scene_ids references unknown story mother scene "${sceneId}"`
      );
    }
    if (
      stageIdx >= stageRank["visual-direction"] &&
      run.status !== "planned" &&
      run.status !== "blocked" &&
      directorBoardSceneIdsForPlugins.size > 0
    ) {
      assert(
        directorBoardSceneIdsForPlugins.has(sceneId),
        `INV-PLUGIN-ADAPTER-TRACE: ${tag}.scene_ids references scene "${sceneId}" without a director board scene`
      );
    }
  }

  for (const candidateId of asArray(run.candidate_ids)) {
    if (isHyperframesAdapter) {
      assert(
        hyperframesCandidateIds.has(candidateId),
        `INV-PLUGIN-ADAPTER-TRACE: ${tag}.candidate_ids references missing render.hyperframes_candidates candidate_id "${candidateId}"`
      );
      hyperframesCandidateIdsWithPluginRun.add(candidateId);
    }
    if (isAIVideoAdapter) {
      assert(
        aiVideoCandidateIds.has(candidateId),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.candidate_ids references missing render.ai_video_candidates candidate_id "${candidateId}"`
      );
      aiVideoCandidateIdsWithAdapterRun.add(candidateId);
    }
  }
}

for (const candidateId of hyperframesCandidateIds) {
  assert(
    hyperframesCandidateIdsWithPluginRun.has(candidateId),
    `INV-PLUGIN-ADAPTER-TRACE: render.hyperframes_candidates candidate_id "${candidateId}" must be linked from render.plugin_adapter_runs[].candidate_ids`
  );
}

for (const candidateId of aiVideoCandidateIds) {
  assert(
    aiVideoCandidateIdsWithAdapterRun.has(candidateId),
    `INV-AI-VIDEO-GEN-INSERT: render.ai_video_candidates candidate_id "${candidateId}" must be linked from render.plugin_adapter_runs[].candidate_ids`
  );
}

// ---- visual.recording_visual_brief ----

const recordingBrief = state.visual?.recording_visual_brief ?? {};
const routeHints = recordingBrief.route_hints ?? [];
assert(Array.isArray(routeHints), "visual.recording_visual_brief.route_hints must be an array");

for (const [i, hint] of routeHints.entries()) {
  const tag = `visual.recording_visual_brief.route_hints[${i}]`;
  assert(hint.scene_id, `${tag}.scene_id is required`);
  assert(hint.voice_signal, `${tag}.voice_signal is required`);
  assert(hint.visual_job, `${tag}.visual_job is required`);
  assert(hint.execution_runtime, `${tag}.execution_runtime is required`);
  assert(hint.motion_source, `${tag}.motion_source is required`);
  assert(hint.integration_mode, `${tag}.integration_mode is required`);
  assert(hint.promotion_target_renderer_family, `${tag}.promotion_target_renderer_family is required`);
  assert(hint.reason, `${tag}.reason is required`);
  checkEnum(`${tag}.execution_runtime`, hint.execution_runtime, allowedExecutionRuntimes);
  checkEnum(`${tag}.motion_source`, hint.motion_source, allowedMotionSources);
  checkEnum(`${tag}.integration_mode`, hint.integration_mode, allowedIntegrationModes);
  checkEnum(`${tag}.promotion_target_renderer_family`, hint.promotion_target_renderer_family, allowedFinalRendererFamilies);
}

// ---- gate-by-stage rules (INV-LOOKDEV-BEFORE-RENDER, INV-MOTHER-LOCK-BEFORE-VARIANT, etc.) ----

// Content locks (Topic / Script / StoryMother / Visual) require status "approved".
// Lookdev Approval may also accept "manual_review_required" with explicit human override.
function approvalReady(checkpoint, allowManualReview = false) {
  const a = approvalByCheckpoint[checkpoint];
  if (!a) return false;
  if (a.status === "approved") return true;
  return allowManualReview && a.status === "manual_review_required";
}

function assertVisualQualityReady() {
  const visual = state.visual ?? {};
  const hook = visual.hook_design ?? {};
  assert(
    hasText(hook.hook_pattern) &&
      hasText(hook.hook_promise) &&
      typeof hook.hook_energy_level === "number" &&
      hook.hook_energy_level >= 1 &&
      hook.hook_thumbnail_viable === true,
    "INV-HOOK-DESIGN-REQUIRED: visual.hook_design must record pattern, promise, energy, and thumbnail viability before Visual Lock"
  );

  const energy = visual.energy_map ?? {};
  assert(
    hasText(energy.shape) &&
      hasNonEmptyArray(energy.peak_scenes) &&
      hasNonEmptyArray(energy.rest_scenes) &&
      (hasNonEmptyArray(energy.rewatch_candidate_scenes) || hasNonEmptyArray(energy.screenshot_candidate_scenes)),
    "INV-ENERGY-CURVE-REQUIRED: visual.energy_map must record three-act shape, peak/rest scenes, and a rewatch or screenshot candidate before Visual Lock"
  );

  const contrast = visual.contrast_map ?? {};
  assert(
    hasText(contrast.monotony_test_result) &&
      typeof contrast.variety_checkpoint_score === "number" &&
      contrast.variety_checkpoint_score >= 4,
    "INV-MONOTONY-CHECK: visual.contrast_map must record monotony result and variety_checkpoint_score >= 4 before Visual Lock"
  );

  assert(hasText(visual.hero_frame_scene_id), "INV-HERO-FRAME-REQUIRED: visual.hero_frame_scene_id is required before Visual Lock");
  assert(
    hasNonEmptyArray(visual.scene_decisions),
    "INV-SCENE-DECISION-CARD: visual.scene_decisions must contain at least one scene decision before Visual Lock"
  );
}

function recordingFirstInputExists() {
  return (
    transcriptSegments.length > 0 ||
    sourceDraftRecordings.length > 0 ||
    assetManifest.some((asset) => asset?.asset_type === "audio_recording")
  );
}

function assertRecordingCorrectionReadyForVisual() {
  assert(
    ["completed", "manual_review_required"].includes(recordingCorrection.status),
    "INV-RECORDING-CORRECTION-BEFORE-VISUAL: sources.recording_correction.status must be completed or manual_review_required before visual-direction"
  );
  assert(
    hasNonEmptyTextArray(recordingCorrection.source_audio_refs),
    "INV-RECORDING-CORRECTION-BEFORE-VISUAL: sources.recording_correction.source_audio_refs must list the narration audio used"
  );
  assert(
    hasNonEmptyTextArray(recordingCorrection.cleaned_audio_paths),
    "INV-RECORDING-CORRECTION-BEFORE-VISUAL: sources.recording_correction.cleaned_audio_paths must list cleaned or accepted audio paths"
  );
  assert(
    hasText(recordingCorrection.transcript_path),
    "INV-RECORDING-CORRECTION-BEFORE-VISUAL: sources.recording_correction.transcript_path is required before visual-direction"
  );
  assert(
    hasText(recordingCorrection.cleanup_report_path),
    "INV-RECORDING-CORRECTION-BEFORE-VISUAL: sources.recording_correction.cleanup_report_path is required before visual-direction"
  );
  assert(
    hasNonEmptyTextArray(recordingCorrection.correction_actions),
    "INV-RECORDING-CORRECTION-BEFORE-VISUAL: sources.recording_correction.correction_actions must record what was corrected or accepted"
  );
  assert(
    hasNonEmptyTextArray(recordingCorrection.quality_checks),
    "INV-RECORDING-CORRECTION-BEFORE-VISUAL: sources.recording_correction.quality_checks must record transcript/audio quality checks"
  );
}

function assertMaterialDirectorPassReady() {
  const materialPass = state.visual?.material_director_pass ?? {};
  assert(
    materialPass.status === "completed" || materialPass.status === "manual_review_required",
    "INV-MATERIAL-DIRECTOR-PASS: visual.material_director_pass.status must be completed or manual_review_required before Visual Lock"
  );
  assert(
    hasText(materialPass.director_summary),
    "INV-MATERIAL-DIRECTOR-PASS: visual.material_director_pass.director_summary is required before Visual Lock"
  );

  const sourceReadings = asArray(materialPass.source_unit_readings);
  assert(
    hasNonEmptyArray(sourceReadings),
    "INV-MATERIAL-DIRECTOR-PASS: visual.material_director_pass.source_unit_readings must read the user's material unit by unit before Visual Lock"
  );

  const sourceUnitIds = new Set();
  for (const [i, reading] of sourceReadings.entries()) {
    const tag = `visual.material_director_pass.source_unit_readings[${i}]`;
    assert(reading.unit_id, `${tag}.unit_id is required`);
    assert(reading.source_ref, `${tag}.source_ref is required`);
    assert(reading.source_kind, `${tag}.source_kind is required`);
    assert(hasText(reading.expressed_meaning), `${tag}.expressed_meaning is required`);
    assert(hasText(reading.visual_potential), `${tag}.visual_potential is required`);
    assert(hasText(reading.must_preserve), `${tag}.must_preserve is required`);
    assert(reading.use_decision, `${tag}.use_decision is required`);
    checkEnum(`${tag}.use_decision`, reading.use_decision, allowedSourceUseDecisions);
    if (reading.unit_id) sourceUnitIds.add(reading.unit_id);
  }

  if (recordingFirstInputExists()) {
    const rhythmSegments = asArray(materialPass.recording_rhythm_reading?.segments);
    assert(
      hasNonEmptyArray(rhythmSegments),
      "INV-MATERIAL-DIRECTOR-PASS: recording-first projects must record material_director_pass.recording_rhythm_reading.segments before Visual Lock"
    );
    for (const [i, segment] of rhythmSegments.entries()) {
      const tag = `visual.material_director_pass.recording_rhythm_reading.segments[${i}]`;
      assert(segment.segment_ref, `${tag}.segment_ref is required`);
      assert(hasText(segment.spoken_intent), `${tag}.spoken_intent is required`);
      assert(hasText(segment.visual_response), `${tag}.visual_response is required`);
    }
  }

  const sceneBindings = asArray(materialPass.scene_binding_plan);
  assert(
    hasNonEmptyArray(sceneBindings),
    "INV-MATERIAL-DIRECTOR-PASS: visual.material_director_pass.scene_binding_plan must bind source material and rhythm to scenes before Visual Lock"
  );

  const bindingSceneIds = new Set();
  for (const [i, binding] of sceneBindings.entries()) {
    const tag = `visual.material_director_pass.scene_binding_plan[${i}]`;
    assert(binding.scene_id, `${tag}.scene_id is required`);
    assert(hasNonEmptyArray(binding.source_unit_ids), `${tag}.source_unit_ids must be non-empty`);
    assert(hasText(binding.material_role), `${tag}.material_role is required`);
    assert(hasText(binding.picture_design), `${tag}.picture_design is required`);
    assert(hasText(binding.timing_design), `${tag}.timing_design is required`);
    assert(hasText(binding.source_treatment), `${tag}.source_treatment is required`);
    for (const unitId of asArray(binding.source_unit_ids)) {
      assert(sourceUnitIds.has(unitId), `${tag}.source_unit_ids references unknown source unit "${unitId}"`);
    }
    if (binding.scene_id) bindingSceneIds.add(binding.scene_id);
  }

  const techStackPlan = asArray(materialPass.tech_stack_plan);
  assert(
    hasNonEmptyArray(techStackPlan),
    "INV-MATERIAL-DIRECTOR-PASS: visual.material_director_pass.tech_stack_plan must route each scene through a justified technical stack before Visual Lock"
  );

  const techSceneIds = new Set();
  for (const [i, plan] of techStackPlan.entries()) {
    const tag = `visual.material_director_pass.tech_stack_plan[${i}]`;
    assert(plan.scene_id, `${tag}.scene_id is required`);
    assert(plan.primary_stack, `${tag}.primary_stack is required`);
    assert(hasText(plan.why_this_stack), `${tag}.why_this_stack is required`);
    checkEnum(`${tag}.primary_stack`, plan.primary_stack, allowedDirectorStacks);
    for (const stack of asArray(plan.supporting_stacks)) {
      checkEnum(`${tag}.supporting_stacks[]`, stack, allowedDirectorStacks);
    }
    for (const stack of asArray(plan.rejected_stacks)) {
      checkEnum(`${tag}.rejected_stacks[]`, stack, allowedDirectorStacks);
    }
    if (plan.scene_id) techSceneIds.add(plan.scene_id);
  }

  for (const sceneId of storySceneOrder) {
    assert(
      bindingSceneIds.has(sceneId),
      `INV-MATERIAL-DIRECTOR-PASS: material_director_pass.scene_binding_plan must include story scene "${sceneId}"`
    );
    assert(
      techSceneIds.has(sceneId),
      `INV-MATERIAL-DIRECTOR-PASS: material_director_pass.tech_stack_plan must include story scene "${sceneId}"`
    );
  }
}

function assertDirectorBoardReady() {
  const board = state.visual?.director_board ?? {};
  assert(
    board.status === "completed" || board.status === "manual_review_required",
    "INV-DIRECTOR-BOARD: visual.director_board.status must be completed or manual_review_required before Visual Lock"
  );
  assert(hasText(board.board_md_path), "INV-DIRECTOR-BOARD: visual.director_board.board_md_path is required before Visual Lock");
  assert(hasText(board.board_json_path), "INV-DIRECTOR-BOARD: visual.director_board.board_json_path is required before Visual Lock");
  assert(
    hasText(board.global_director_thesis),
    "INV-DIRECTOR-BOARD: visual.director_board.global_director_thesis is required before Visual Lock"
  );
  assert(
    hasNonEmptyObject(board.aesthetic_system),
    "INV-DIRECTOR-BOARD: visual.director_board.aesthetic_system must be non-empty before Visual Lock"
  );
  const brainstormingContract = board.brainstorming_contract ?? {};
  assert(
    hasText(brainstormingContract.skill_ref) && textIncludesAny(brainstormingContract.skill_ref, ["brainstorming"]),
    "INV-BRAINSTORMING-BEFORE-PICTURE: visual.director_board.brainstorming_contract.skill_ref must reference brainstorming"
  );
  assert(
    hasNonEmptyTextArray(brainstormingContract.required_for),
    "INV-BRAINSTORMING-BEFORE-PICTURE: visual.director_board.brainstorming_contract.required_for must be non-empty"
  );
  assert(
    hasText(brainstormingContract.output_rule),
    "INV-BRAINSTORMING-BEFORE-PICTURE: visual.director_board.brainstorming_contract.output_rule is required"
  );
  assert(
    hasNonEmptyArray(board.component_registry_plan),
    "INV-DIRECTOR-BOARD: visual.director_board.component_registry_plan must be non-empty before Visual Lock"
  );
  assert(
    hasNonEmptyObject(board.subtitle_system),
    "INV-DIRECTOR-BOARD: visual.director_board.subtitle_system must be non-empty before Visual Lock"
  );
  assert(
    hasNonEmptyObject(board.tech_stack_policy),
    "INV-DIRECTOR-BOARD: visual.director_board.tech_stack_policy must be non-empty before Visual Lock"
  );
  assert(
    hasNonEmptyArray(board.lookdev_acceptance),
    "INV-DIRECTOR-BOARD: visual.director_board.lookdev_acceptance must be non-empty before Visual Lock"
  );
  assert(
    Array.isArray(board.unresolved_questions),
    "INV-DIRECTOR-BOARD: visual.director_board.unresolved_questions must be an array before Visual Lock"
  );

  const sceneBoards = asArray(board.scene_boards);
  assert(
    hasNonEmptyArray(sceneBoards),
    "INV-DIRECTOR-BOARD: visual.director_board.scene_boards must contain one board per StoryMother scene before Visual Lock"
  );

  const boardSceneIds = new Set();
  const handleIdsBySceneId = new Map();
  for (const [i, sceneBoard] of sceneBoards.entries()) {
    const tag = `visual.director_board.scene_boards[${i}]`;
    assert(sceneBoard.scene_id, `${tag}.scene_id is required`);
    assert(sceneBoard.scene_job, `${tag}.scene_job is required`);
    checkEnum(`${tag}.scene_job`, sceneBoard.scene_job, allowedSceneJobs);
    if (sceneBoard.scene_id) boardSceneIds.add(sceneBoard.scene_id);

    const source = sceneBoard.source_layer ?? {};
    assert(hasNonEmptyTextArray(source.source_unit_ids), `${tag}.source_layer.source_unit_ids must be a non-empty string array`);
    assert(hasText(source.what_material_says), `${tag}.source_layer.what_material_says is required`);
    assert(hasText(source.must_preserve), `${tag}.source_layer.must_preserve is required`);
    assert(hasText(source.can_transform), `${tag}.source_layer.can_transform is required`);
    assert(source.evidence_role, `${tag}.source_layer.evidence_role is required`);
    checkEnum(`${tag}.source_layer.evidence_role`, source.evidence_role, allowedEvidenceRoles);

    const arrangement = sceneBoard.arrangement_layer ?? {};
    assert(hasNonEmptyTextArray(arrangement.narration_refs), `${tag}.arrangement_layer.narration_refs must be a non-empty string array`);
    assert(hasText(arrangement.voice_timing), `${tag}.arrangement_layer.voice_timing is required`);
    assert(hasText(arrangement.beat_before_keyword), `${tag}.arrangement_layer.beat_before_keyword is required`);
    assert(
      typeof arrangement.scene_duration_sec === "number" && arrangement.scene_duration_sec > 0,
      `${tag}.arrangement_layer.scene_duration_sec must be greater than 0`
    );
    assert(hasText(arrangement.transition_in), `${tag}.arrangement_layer.transition_in is required`);
    assert(hasText(arrangement.transition_out), `${tag}.arrangement_layer.transition_out is required`);

    const brainstorming = sceneBoard.brainstorming_layer ?? {};
    assert(
      hasText(brainstorming.skill_ref) && textIncludesAny(brainstorming.skill_ref, ["brainstorming"]),
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.skill_ref must reference brainstorming`
    );
    assert(
      hasText(brainstorming.scene_question),
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.scene_question is required`
    );
    assert(
      brainstorming.knowledge_action,
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.knowledge_action is required`
    );
    checkEnum(`${tag}.brainstorming_layer.knowledge_action`, brainstorming.knowledge_action, allowedKnowledgeActions);
    assert(
      hasMinTextArray(brainstorming.options_considered, 2),
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.options_considered must contain at least two concrete options`
    );
    assert(
      hasText(brainstorming.selected_direction),
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.selected_direction is required`
    );
    assert(
      hasText(brainstorming.why_selected),
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.why_selected is required`
    );
    assert(
      hasNonEmptyArray(brainstorming.continuity_handles),
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.continuity_handles must be non-empty`
    );
    assert(
      hasText(brainstorming.anti_ppt_decision),
      `INV-BRAINSTORMING-BEFORE-PICTURE: ${tag}.brainstorming_layer.anti_ppt_decision is required`
    );
    const sceneHandleIds = new Set();
    for (const [handleIndex, handle] of asArray(brainstorming.continuity_handles).entries()) {
      const handleTag = `${tag}.brainstorming_layer.continuity_handles[${handleIndex}]`;
      assert(hasText(handle?.handle_id), `INV-BRAINSTORMING-BEFORE-PICTURE: ${handleTag}.handle_id is required`);
      assert(hasText(handle?.handle_origin), `INV-BRAINSTORMING-BEFORE-PICTURE: ${handleTag}.handle_origin is required`);
      checkEnum(`${handleTag}.handle_origin`, handle?.handle_origin, allowedContinuityHandleOrigins);
      assert(hasText(handle?.handle_kind), `INV-BRAINSTORMING-BEFORE-PICTURE: ${handleTag}.handle_kind is required`);
      checkEnum(`${handleTag}.handle_kind`, handle?.handle_kind, allowedContinuityHandleKinds);
      assert(hasText(handle?.meaning), `INV-BRAINSTORMING-BEFORE-PICTURE: ${handleTag}.meaning is required`);
      assert(hasText(handle?.visual_form), `INV-BRAINSTORMING-BEFORE-PICTURE: ${handleTag}.visual_form is required`);
      assert(hasNonEmptyTextArray(handle?.usable_as), `INV-BRAINSTORMING-BEFORE-PICTURE: ${handleTag}.usable_as must be non-empty`);
      assert(
        hasText(handle?.must_remain_recognizable),
        `INV-BRAINSTORMING-BEFORE-PICTURE: ${handleTag}.must_remain_recognizable is required`
      );
      if (hasText(handle?.handle_id)) sceneHandleIds.add(handle.handle_id);
    }
    if (sceneBoard.scene_id) handleIdsBySceneId.set(sceneBoard.scene_id, sceneHandleIds);

    const aesthetic = sceneBoard.aesthetic_layer ?? {};
    assert(hasText(aesthetic.aesthetic_role), `${tag}.aesthetic_layer.aesthetic_role is required`);
    assert(hasText(aesthetic.color_temperature), `${tag}.aesthetic_layer.color_temperature is required`);
    assert(aesthetic.density, `${tag}.aesthetic_layer.density is required`);
    checkEnum(`${tag}.aesthetic_layer.density`, aesthetic.density, allowedDensities);
    assert(
      typeof aesthetic.energy_level === "number" && aesthetic.energy_level >= 1 && aesthetic.energy_level <= 10,
      `${tag}.aesthetic_layer.energy_level must be between 1 and 10`
    );
    assert(hasText(aesthetic.contrast_to_prev_scene), `${tag}.aesthetic_layer.contrast_to_prev_scene is required`);
    assert(hasNonEmptyTextArray(aesthetic.cheapness_to_avoid), `${tag}.aesthetic_layer.cheapness_to_avoid must be non-empty`);

    const frame = sceneBoard.frame_layer ?? {};
    assert(hasText(frame.main_frame_design), `${tag}.frame_layer.main_frame_design is required`);
    assert(hasText(frame.dominant_anchor), `${tag}.frame_layer.dominant_anchor is required`);
    assert(hasText(frame.layout_pattern), `${tag}.frame_layer.layout_pattern is required`);
    assert(hasText(frame.camera_path), `${tag}.frame_layer.camera_path is required`);
    assert(hasText(frame.depth_plan), `${tag}.frame_layer.depth_plan is required`);
    assert(hasNonEmptyTextArray(frame.proof_regions), `${tag}.frame_layer.proof_regions must be non-empty`);
    assert(hasText(frame.subtitle_safe_region), `${tag}.frame_layer.subtitle_safe_region is required`);

    const detail = sceneBoard.detail_layer ?? {};
    assert(hasText(detail.lighting), `${tag}.detail_layer.lighting is required`);
    assert(hasText(detail.material_surface), `${tag}.detail_layer.material_surface is required`);
    assert(hasText(detail.typography_role), `${tag}.detail_layer.typography_role is required`);
    assert(hasNonEmptyTextArray(detail.motion_verbs), `${tag}.detail_layer.motion_verbs must be non-empty`);
    assert(hasNonEmptyTextArray(detail.micro_interactions), `${tag}.detail_layer.micro_interactions must be non-empty`);
    assert(hasNonEmptyTextArray(detail.failure_risks), `${tag}.detail_layer.failure_risks must be non-empty`);

    const component = sceneBoard.component_layer ?? {};
    assert(hasText(component.primary_component), `${tag}.component_layer.primary_component is required`);
    assert(hasNonEmptyTextArray(component.supporting_components), `${tag}.component_layer.supporting_components must be non-empty`);
    assert(hasText(component.component_props_brief), `${tag}.component_layer.component_props_brief is required`);
    assert(hasText(component.fallback_component), `${tag}.component_layer.fallback_component is required`);
    assert(typeof component.kit_extension_needed === "boolean", `${tag}.component_layer.kit_extension_needed must be boolean`);

    const subtitle = sceneBoard.subtitle_layer ?? {};
    assert(subtitle.subtitle_mode, `${tag}.subtitle_layer.subtitle_mode is required`);
    checkEnum(`${tag}.subtitle_layer.subtitle_mode`, subtitle.subtitle_mode, allowedSubtitleModes);
    assert(hasText(subtitle.subtitle_position), `${tag}.subtitle_layer.subtitle_position is required`);
    assert(Array.isArray(subtitle.keyword_highlights), `${tag}.subtitle_layer.keyword_highlights must be an array`);
    if (subtitle.subtitle_mode !== "none") {
      assert(hasNonEmptyTextArray(subtitle.keyword_highlights), `${tag}.subtitle_layer.keyword_highlights must be non-empty unless subtitle_mode is none`);
    }
    assert(hasNonEmptyTextArray(subtitle.must_not_cover), `${tag}.subtitle_layer.must_not_cover must be non-empty`);
    assert(hasText(subtitle.relationship_to_voice), `${tag}.subtitle_layer.relationship_to_voice is required`);

    const tech = sceneBoard.tech_stack_layer ?? {};
    assert(tech.primary_stack, `${tag}.tech_stack_layer.primary_stack is required`);
    checkEnum(`${tag}.tech_stack_layer.primary_stack`, tech.primary_stack, allowedDirectorStacks);
    assert(hasText(tech.integration_mode), `${tag}.tech_stack_layer.integration_mode is required`);
    assert(hasText(tech.why_this_stack), `${tag}.tech_stack_layer.why_this_stack is required`);
    assert(hasNonEmptyTextArray(tech.rejected_stacks), `${tag}.tech_stack_layer.rejected_stacks must be non-empty`);
    for (const stack of asArray(tech.rejected_stacks)) {
      checkEnum(`${tag}.tech_stack_layer.rejected_stacks[]`, stack, allowedDirectorStacks);
    }
    assert(hasText(tech.preview_required), `${tag}.tech_stack_layer.preview_required is required`);
    assert(
      !isGenericRouteReason(tech.why_this_stack),
      `${tag}.tech_stack_layer.why_this_stack must explain the scene-specific reason, not generic polish`
    );

    if (tech.primary_stack === "html_3d") {
      const htmlRouteText = joinedText(frame.camera_path, frame.depth_plan, tech.why_this_stack);
      assert(
        textIncludesAny(htmlRouteText, ["camera", "depth", "3d", "plane", "room", "reveal", "perspective", "镜头", "纵深", "景深", "空间", "揭示"]),
        `${tag}.tech_stack_layer.primary_stack html_3d requires camera/depth purpose`
      );
    }

    if (tech.primary_stack === "spark") {
      const sparkRouteText = joinedText(frame.camera_path, frame.depth_plan, tech.integration_mode, tech.why_this_stack, tech.preview_required);
      assert(
        textIncludesAny(sparkRouteText, ["spatial", "world", "3dgs", "splat", "sparkroutepreview", "procedural_splat_world", "hybrid_spark_three", "true_3dgs_asset", "streaming_rad_world", "空间", "世界", "穿行", "地图"]),
        `${tag}.tech_stack_layer.primary_stack spark requires a spatial/world reason and route status`
      );
      assert(
        textIncludesAny(tech.preview_required, ["preview", "sparkroutepreview", "browser", "canvas", "预览"]),
        `${tag}.tech_stack_layer.primary_stack spark requires preview_required`
      );
    }

    if (tech.primary_stack === "vibemotion") {
      const vibeRouteText = joinedText(tech.integration_mode, tech.why_this_stack);
      assert(
        textIncludesAny(vibeRouteText, ["supporting", "candidate", "transparent", "layer", "辅助", "候选", "透明层"]),
        `${tag}.tech_stack_layer.primary_stack vibemotion must be supporting motion or candidate output`
      );
      assert(
        !textIncludesAny(vibeRouteText, ["final controller", "full video controller", "final renderer", "最终主控", "全片主控"]),
        `${tag}.tech_stack_layer.primary_stack vibemotion cannot be the final controller`
      );
    }

    if (tech.primary_stack === "gen_insert") {
      const genRouteText = joinedText(
        source.evidence_role,
        frame.main_frame_design,
        frame.camera_path,
        frame.depth_plan,
        tech.integration_mode,
        tech.why_this_stack,
        tech.preview_required
      );
      assert(
        source.evidence_role !== "hero",
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.tech_stack_layer.primary_stack gen_insert cannot carry hero proof/evidence`
      );
      assert(
        textIncludesAny(genRouteText, ["visual gap", "realism gap", "ai video", "seedance", "generated insert", "video_plate", "video plate", "concept", "候选", "生成视频", "视觉缺口", "真实感缺口"]),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.tech_stack_layer.primary_stack gen_insert requires a bounded generated-video visual-gap reason`
      );
      assert(
        textIncludesAny(tech.integration_mode, ["video_plate", "video plate", "remotion", "candidate", "候选"]),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.tech_stack_layer.primary_stack gen_insert must integrate as a Remotion-controlled video_plate candidate`
      );
      assert(
        textIncludesAny(tech.preview_required, ["preview", "lookdev", "motion", "video", "预览"]),
        `INV-AI-VIDEO-GEN-INSERT: ${tag}.tech_stack_layer.primary_stack gen_insert requires motion/video preview before promotion`
      );
    }

    const lookdev = sceneBoard.lookdev_acceptance ?? {};
    assert(hasText(lookdev.still_frame_check), `${tag}.lookdev_acceptance.still_frame_check is required`);
    assert(hasText(lookdev.motion_check), `${tag}.lookdev_acceptance.motion_check is required`);
    assert(hasText(lookdev.proof_readability_check), `${tag}.lookdev_acceptance.proof_readability_check is required`);
    assert(hasText(lookdev.aesthetic_check), `${tag}.lookdev_acceptance.aesthetic_check is required`);
  }

  for (const sceneId of storySceneOrder) {
    assert(
      boardSceneIds.has(sceneId),
      `INV-DIRECTOR-BOARD: visual.director_board.scene_boards must include story scene "${sceneId}"`
    );
  }

  const edgeBoards = asArray(board.scene_edge_boards);
  assert(
    Array.isArray(board.scene_edge_boards),
    "INV-SCENE-EDGE-FLOW: visual.director_board.scene_edge_boards must be an array before Visual Lock"
  );
  if (storySceneOrder.length > 1) {
    assert(
      edgeBoards.length >= storySceneOrder.length - 1,
      "INV-SCENE-EDGE-FLOW: visual.director_board.scene_edge_boards must include one board for every adjacent StoryMother scene pair"
    );
  }

  const edgeByPair = new Set();
  for (const [i, edge] of edgeBoards.entries()) {
    const tag = `visual.director_board.scene_edge_boards[${i}]`;
    assert(hasText(edge.edge_id), `INV-SCENE-EDGE-FLOW: ${tag}.edge_id is required`);
    assert(hasText(edge.from_scene_id), `INV-SCENE-EDGE-FLOW: ${tag}.from_scene_id is required`);
    assert(hasText(edge.to_scene_id), `INV-SCENE-EDGE-FLOW: ${tag}.to_scene_id is required`);
    assert(
      storySceneIds.has(edge.from_scene_id),
      `INV-SCENE-EDGE-FLOW: ${tag}.from_scene_id references unknown story scene "${edge.from_scene_id}"`
    );
    assert(
      storySceneIds.has(edge.to_scene_id),
      `INV-SCENE-EDGE-FLOW: ${tag}.to_scene_id references unknown story scene "${edge.to_scene_id}"`
    );
    if (edge.from_scene_id && edge.to_scene_id) edgeByPair.add(`${edge.from_scene_id}->${edge.to_scene_id}`);
    assert(
      hasText(edge.skill_ref) && textIncludesAny(edge.skill_ref, ["brainstorming"]),
      `INV-SCENE-EDGE-FLOW: ${tag}.skill_ref must reference brainstorming`
    );
    assert(hasText(edge.bridge_question), `INV-SCENE-EDGE-FLOW: ${tag}.bridge_question is required`);
    assert(
      hasMinTextArray(edge.options_considered, 2),
      `INV-SCENE-EDGE-FLOW: ${tag}.options_considered must contain at least two bridge options`
    );
    assert(hasText(edge.selected_bridge), `INV-SCENE-EDGE-FLOW: ${tag}.selected_bridge is required`);
    assert(hasText(edge.narrative_bridge), `INV-SCENE-EDGE-FLOW: ${tag}.narrative_bridge is required`);
    assert(hasText(edge.continuity_handle_kind), `INV-SCENE-EDGE-FLOW: ${tag}.continuity_handle_kind is required`);
    checkEnum(`${tag}.continuity_handle_kind`, edge.continuity_handle_kind, allowedEdgeHandleKinds);
    assert(hasText(edge.out_handle), `INV-SCENE-EDGE-FLOW: ${tag}.out_handle is required`);
    assert(hasText(edge.in_handle), `INV-SCENE-EDGE-FLOW: ${tag}.in_handle is required`);
    assert(
      hasText(edge.out_handle) && handleIdsBySceneId.get(edge.from_scene_id)?.has(edge.out_handle),
      `INV-SCENE-EDGE-FLOW: ${tag}.out_handle must reference a continuity handle on ${edge.from_scene_id}`
    );
    assert(
      hasText(edge.in_handle) && handleIdsBySceneId.get(edge.to_scene_id)?.has(edge.in_handle),
      `INV-SCENE-EDGE-FLOW: ${tag}.in_handle must reference a continuity handle on ${edge.to_scene_id}`
    );
    assert(hasText(edge.transition_method), `INV-SCENE-EDGE-FLOW: ${tag}.transition_method is required`);
    checkEnum(`${tag}.transition_method`, edge.transition_method, allowedTransitionMethods);
    assert(hasText(edge.cut_moment), `INV-SCENE-EDGE-FLOW: ${tag}.cut_moment is required`);
    assert(
      typeof edge.duration_frames === "number" && edge.duration_frames > 0,
      `INV-SCENE-EDGE-FLOW: ${tag}.duration_frames must be greater than 0`
    );
    assert(hasText(edge.anti_ppt_risk), `INV-SCENE-EDGE-FLOW: ${tag}.anti_ppt_risk is required`);
    assert(hasText(edge.lookdev_acceptance), `INV-SCENE-EDGE-FLOW: ${tag}.lookdev_acceptance is required`);
  }

  for (let i = 0; i < storySceneOrder.length - 1; i += 1) {
    const fromSceneId = storySceneOrder[i];
    const toSceneId = storySceneOrder[i + 1];
    assert(
      edgeByPair.has(`${fromSceneId}->${toSceneId}`),
      `INV-SCENE-EDGE-FLOW: scene_edge_boards must include adjacent pair ${fromSceneId}->${toSceneId}`
    );
  }
}

function assertSourcePackReadyForPlanning() {
  assert(hasText(sourcePack.core_thesis), "INV-SOURCE-PACK-TRACE: sources.source_pack.core_thesis is required after ingest");
  assert(hasText(sourcePack.audience), "INV-SOURCE-PACK-TRACE: sources.source_pack.audience is required after ingest");
  assert(hasText(sourcePack.goal), "INV-SOURCE-PACK-TRACE: sources.source_pack.goal is required after ingest");
  assert(
    hasSourceMaterials,
    "INV-SOURCE-PACK-TRACE: source_pack must include at least one link, screenshot, screen recording, note, draft recording, existing asset, or transcript segment"
  );
  if (hasMediaSourceMaterials) {
    assert(
      assetManifest.length > 0,
      "INV-SOURCE-PACK-TRACE: media inputs require sources.asset_manifest entries before research/proof"
    );
  }
}

function assertProofReadyForScript() {
  assert(hasNonEmptyArray(claims), "INV-PROOF-FRAME-STRATEGY: proof.claims must be non-empty before script");
  assert(hasNonEmptyArray(evidenceItems), "INV-PROOF-FRAME-STRATEGY: proof.evidence_items must be non-empty before script");
}

function assertScriptReadyForMother() {
  assert(hasNonEmptyArray(spokenBlocks), "INV-SCRIPT-LOCK-BEFORE-MOTHER: script.spoken_script.blocks must be non-empty before story-mother");
  assert(hasNonEmptyArray(beatScenes), "INV-SCRIPT-LOCK-BEFORE-MOTHER: script.beat_map.scenes must be non-empty before story-mother");
}

function assertStoryMotherReadyForVisualDirection() {
  assert(hasText(storyMother.thesis), "INV-DIRECTOR-PLAN-BEFORE-RENDER: mother.story_mother.thesis is required before visual-direction");
  assert(hasText(storyMother.audience_promise), "INV-DIRECTOR-PLAN-BEFORE-RENDER: mother.story_mother.audience_promise is required before visual-direction");
  assert(hasNonEmptyArray(storySceneOrder), "INV-DIRECTOR-PLAN-BEFORE-RENDER: mother.story_mother.scene_order must be non-empty before visual-direction");
  assert(hasNonEmptyArray(storySceneCards), "INV-DIRECTOR-PLAN-BEFORE-RENDER: mother.story_mother.scene_cards must be non-empty before visual-direction");
  assert(hasNonEmptyArray(storyMother.proof_binding), "INV-DIRECTOR-PLAN-BEFORE-RENDER: mother.story_mother.proof_binding must be non-empty before visual-direction");
  assert(hasNonEmptyArray(storyMother.narration_spine), "INV-DIRECTOR-PLAN-BEFORE-RENDER: mother.story_mother.narration_spine must be non-empty before visual-direction");
}

function assertDirectorScenePlanReady() {
  const sceneDecisionIds = new Set(asArray(state.visual?.scene_decisions).map((decision) => decision?.scene_id).filter(Boolean));
  const directorBoardScenes = asArray(state.visual?.director_board?.scene_boards);
  const directorBoardEdges = asArray(state.visual?.director_board?.scene_edge_boards);
  const directorBoardSceneIds = new Set(directorBoardScenes.map((board) => board?.scene_id).filter(Boolean));
  const directorBoardBySceneId = Object.fromEntries(
    directorBoardScenes
      .filter((board) => board?.scene_id)
      .map((board) => [board.scene_id, board])
  );
  const directorHandleIdsBySceneId = new Map(
    directorBoardScenes
      .filter((board) => board?.scene_id)
      .map((board) => [
        board.scene_id,
        new Set(asArray(board?.brainstorming_layer?.continuity_handles).map((handle) => handle?.handle_id).filter(Boolean)),
      ])
  );
  const edgeByFromSceneId = new Map();
  const edgeByToSceneId = new Map();
  for (const edge of directorBoardEdges) {
    if (edge?.from_scene_id) edgeByFromSceneId.set(edge.from_scene_id, edge);
    if (edge?.to_scene_id) edgeByToSceneId.set(edge.to_scene_id, edge);
  }

  function assertCompiledEdgeTrace(scene, tag, traceName, edge, handleKey) {
    const trace = scene[traceName] ?? {};
    assert(
      hasNonEmptyObject(trace),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.${traceName} must compile director_board.scene_edge_boards[${edge.edge_id}]`
    );
    assert(
      trace.edge_id === edge.edge_id,
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.${traceName}.edge_id must be "${edge.edge_id}"`
    );
    assert(
      trace.selected_bridge === edge.selected_bridge,
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.${traceName}.selected_bridge must match director board edge "${edge.edge_id}"`
    );
    assert(
      trace.transition_method === edge.transition_method,
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.${traceName}.transition_method must be "${edge.transition_method}"`
    );
    assert(
      trace[handleKey] === edge[handleKey],
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.${traceName}.${handleKey} must be "${edge[handleKey]}"`
    );

    const primitives = asArray(scene.transition_primitives);
    assert(
      primitives.some((primitive) =>
        primitive?.edge_id === edge.edge_id &&
        primitive?.method === edge.transition_method &&
        hasText(primitive?.primitive)
      ),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.transition_primitives must include edge "${edge.edge_id}" with method "${edge.transition_method}"`
    );
  }

  for (const sceneId of storySceneOrder) {
    assert(
      sceneDecisionIds.has(sceneId),
      `INV-SCENE-DECISION-CARD: visual.scene_decisions must include story scene "${sceneId}" before Visual Lock`
    );
  }

  assert(
    hasNonEmptyArray(scenes),
    "INV-DIRECTOR-PLAN-BEFORE-RENDER: render.scene_motion_specs must be non-empty before platform-adapt/lookdev"
  );

  const motionSceneIds = new Set(scenes.map((scene) => scene.scene_id).filter(Boolean));
  for (const sceneId of storySceneOrder) {
    assert(
      motionSceneIds.has(sceneId),
      `INV-DIRECTOR-PLAN-BEFORE-RENDER: render.scene_motion_specs must include story scene "${sceneId}"`
    );
  }

  for (const [i, scene] of scenes.entries()) {
    const tag = `render.scene_motion_specs[${i}]`;
    assert(
      hasText(scene.director_board_scene_id),
      `INV-DIRECTOR-BOARD: ${tag}.director_board_scene_id must back-reference visual.director_board.scene_boards[scene_id]`
    );
    assert(
      scene.director_board_scene_id === scene.scene_id,
      `INV-DIRECTOR-BOARD: ${tag}.director_board_scene_id must match scene_id "${scene.scene_id}"`
    );
    assert(
      directorBoardSceneIds.has(scene.director_board_scene_id),
      `INV-DIRECTOR-BOARD: ${tag}.director_board_scene_id references missing director board scene "${scene.director_board_scene_id}"`
    );

    const sceneBoard = directorBoardBySceneId[scene.scene_id];
    const brainstorming = sceneBoard?.brainstorming_layer ?? {};
    const brainstormingTrace = scene.brainstorming_trace ?? {};
    assert(
      hasNonEmptyObject(brainstormingTrace),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.brainstorming_trace must compile director_board.scene_boards[${scene.scene_id}].brainstorming_layer`
    );
    assert(
      hasText(brainstormingTrace.skill_ref) && textIncludesAny(brainstormingTrace.skill_ref, ["brainstorming"]),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.brainstorming_trace.skill_ref must reference brainstorming`
    );
    assert(
      hasText(brainstormingTrace.scene_question),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.brainstorming_trace.scene_question is required`
    );
    assert(
      hasText(brainstormingTrace.selected_direction),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.brainstorming_trace.selected_direction is required`
    );
    assert(
      hasText(brainstormingTrace.why_selected),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.brainstorming_trace.why_selected is required`
    );
    if (hasText(brainstorming.selected_direction)) {
      assert(
        brainstormingTrace.selected_direction === brainstorming.selected_direction,
        `INV-COMPILED-DIRECTOR-TRACE: ${tag}.brainstorming_trace.selected_direction must match director board`
      );
    }
    assert(
      hasNonEmptyTextArray(scene.continuity_handles_used),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.continuity_handles_used must list director-board continuity handles used by the scene`
    );
    const sceneHandleIds = directorHandleIdsBySceneId.get(scene.scene_id) ?? new Set();
    for (const handleId of asArray(scene.continuity_handles_used)) {
      assert(
        sceneHandleIds.has(handleId),
        `INV-COMPILED-DIRECTOR-TRACE: ${tag}.continuity_handles_used references unknown handle "${handleId}"`
      );
    }
    assert(
      hasText(scene.anti_ppt_decision),
      `INV-COMPILED-DIRECTOR-TRACE: ${tag}.anti_ppt_decision must compile director board anti-PPT decision`
    );
    if (hasText(brainstorming.anti_ppt_decision)) {
      assert(
        scene.anti_ppt_decision === brainstorming.anti_ppt_decision,
        `INV-COMPILED-DIRECTOR-TRACE: ${tag}.anti_ppt_decision must match director board`
      );
    }

    const incomingEdge = edgeByToSceneId.get(scene.scene_id);
    const outgoingEdge = edgeByFromSceneId.get(scene.scene_id);
    if (incomingEdge || outgoingEdge) {
      assert(
        hasNonEmptyArray(scene.transition_primitives),
        `INV-COMPILED-DIRECTOR-TRACE: ${tag}.transition_primitives must compile adjacent director-board edge transitions`
      );
    }
    if (incomingEdge) {
      assertCompiledEdgeTrace(scene, tag, "edge_in_trace", incomingEdge, "in_handle");
    }
    if (outgoingEdge) {
      assertCompiledEdgeTrace(scene, tag, "edge_out_trace", outgoingEdge, "out_handle");
    }

    const stack = sceneBoard?.tech_stack_layer?.primary_stack;
    if (["html_3d", "spark", "source_media"].includes(stack)) {
      assert(
        hasNonEmptyTextArray(scene.proof_regions),
        `INV-DIRECTOR-BOARD: ${tag}.proof_regions must inherit director_board.frame_layer.proof_regions for ${stack} scenes`
      );
      assert(
        hasText(scene.subtitle_safe_region),
        `INV-DIRECTOR-BOARD: ${tag}.subtitle_safe_region must inherit director_board.frame_layer.subtitle_safe_region for ${stack} scenes`
      );
      assert(
        hasText(scene.camera_path),
        `INV-DIRECTOR-BOARD: ${tag}.camera_path must inherit director_board.frame_layer.camera_path for ${stack} scenes`
      );
    }
  }

  if (hasMediaSourceMaterials || hasScreenRecordingInput) {
    assert(
      hasNonEmptyArray(sourceMaterialPlan),
      "INV-SOURCE-MATERIAL-DIRECTOR-PLAN: media inputs require visual.source_material_plan before Visual Lock"
    );
  }

  if (hasScreenRecordingInput) {
    assert(
      hasNonEmptyArray(screenRecordingClips),
      "INV-SCREEN-RECORDING-ROUTE: source_pack.screen_recordings require visual.screen_recording_brief.clips before Visual Lock"
    );
  }
}

const renderJobs = asArray(state.render?.jobs);
for (const [i, job] of renderJobs.entries()) {
  const tag = `render.jobs[${i}]`;
  assert(job.job_id, `${tag}.job_id is required`);
  assert(job.variant_id, `${tag}.variant_id is required`);
  assert(job.status, `${tag}.status is required`);
  assert(job.lookdev_evaluation_id, `${tag}.lookdev_evaluation_id is required`);
  assert(job.lookdev_status, `${tag}.lookdev_status is required`);
  assert(job.state_path, `${tag}.state_path is required`);
  assert(job.video_project_path, `${tag}.video_project_path is required`);
  assert(job.render_plan_path, `${tag}.render_plan_path is required`);
  assert(job.output_path, `${tag}.output_path is required`);
}

function assertRenderJobsReady() {
  assert(hasNonEmptyArray(renderJobs), "INV-FINAL-RENDER-JOB-TRACE: render.jobs must be non-empty before active_stage render");
}

if (stageIdx >= stageRank["research/proof"]) {
  assertSourcePackReadyForPlanning();
}

if (stageIdx >= stageRank["script"]) {
  assert(approvalReady("Topic Lock"), `INV-TOPIC-LOCK-FIRST: Topic Lock must be approved before active_stage "${stage}"`);
  assertProofReadyForScript();
}

if (stageIdx >= stageRank["story-mother"]) {
  assert(approvalReady("Script Lock"), `INV-SCRIPT-LOCK-BEFORE-MOTHER: Script Lock must be approved before active_stage "${stage}"`);
  assertScriptReadyForMother();
}

if (stageIdx >= stageRank["visual-direction"]) {
  assert(approvalReady("StoryMother Lock"), `INV-MOTHER-LOCK-BEFORE-VARIANT: StoryMother Lock must be approved before active_stage "${stage}"`);
  assertStoryMotherReadyForVisualDirection();
  if (recordingFirstInputExists()) {
    assertRecordingCorrectionReadyForVisual();
  }
}

if (stageIdx >= stageRank["platform-adapt"] || approvalReady("Visual Lock")) {
  if (stageIdx >= stageRank["platform-adapt"]) {
    assert(approvalReady("Visual Lock"), `INV-VISUAL-LOCK-BEFORE-RENDER: Visual Lock must be approved before active_stage "${stage}"`);
  }
  assertDirectorScenePlanReady();
  assertDirectorBoardReady();
  const materialPassStatus = state.visual?.material_director_pass?.status;
  if (materialPassStatus === "completed" || materialPassStatus === "manual_review_required") {
    assertMaterialDirectorPassReady();
  }
  assertVisualQualityReady();
}

if (stageIdx >= stageRank["render"]) {
  assert(
    approvalReady("Lookdev Approval", true),
    `INV-LOOKDEV-BEFORE-RENDER: Lookdev Approval must be approved (or manual_review_required with human override) before active_stage "${stage}"`
  );
  assertRenderJobsReady();
}

if (stageIdx >= stageRank["visual-direction"] && recordingFirstInputExists()) {
  const brief = state.visual?.recording_visual_brief ?? {};
  assert(
    hasNonEmptyArray(brief.route_hints) || hasNonEmptyArray(brief.visual_opportunity_beats),
    `INV-RECORDING-MOTION-ROUTING: recording-first projects must record visual.recording_visual_brief.route_hints or visual_opportunity_beats before active_stage "${stage}"`
  );
}

// ---- variants must trace to a real mother_id ----

const motherId = state.mother?.story_mother?.mother_id;
const variants = Array.isArray(state.variants) ? state.variants : [];
for (const [i, variant] of variants.entries()) {
  if (motherId) {
    assert(
      typeof variant.mother_id === "string" && variant.mother_id.length > 0 && variant.mother_id === motherId,
      `variants[${i}].mother_id must be non-empty and match mother.story_mother.mother_id "${motherId}" (got "${variant.mother_id ?? ""}")`
    );
  }
}

// ---- summary + exit ----

if (errors.length) {
  console.error(`Project state validation failed: ${errors.length} error(s)`);
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

const sceneCount = scenes.length;
const candidateCount = candidates.length;
const hyperframesCandidateCount = hyperframesCandidates.length;
const aiVideoPromptRequestCount = aiVideoPromptRequests.length;
const aiVideoCandidateCount = aiVideoCandidates.length;
const pluginAdapterRunCount = pluginAdapterRuns.length;
const approvalSummary = allowedCheckpoints
  .map((c) => `${c}=${approvalByCheckpoint[c]?.status ?? "missing"}`)
  .join(", ");

console.log(
  `Project state validation passed. ` +
    `active_stage=${metadata.active_stage}, ` +
    `scene_motion_specs=${sceneCount} (spark=${sparkSceneCount}), ` +
    `vibemotion_candidates=${candidateCount}, ` +
    `hyperframes_candidates=${hyperframesCandidateCount}, ` +
    `ai_video_prompt_requests=${aiVideoPromptRequestCount}, ` +
    `ai_video_candidates=${aiVideoCandidateCount}, ` +
    `plugin_adapter_runs=${pluginAdapterRunCount}, ` +
    `approvals=[${approvalSummary}]`
);
