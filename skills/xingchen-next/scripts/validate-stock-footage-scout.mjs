import fs from "node:fs";
import path from "node:path";

const scoutPath = process.argv[2];

if (!scoutPath) {
  console.error("Usage: node validate-stock-footage-scout.mjs path/to/stock-footage-scout.json");
  process.exit(2);
}

if (!fs.existsSync(scoutPath)) {
  console.error(`Scout file not found: ${scoutPath}`);
  process.exit(2);
}

const scout = JSON.parse(fs.readFileSync(scoutPath, "utf8").replace(/^\uFEFF/, ""));
const errors = [];
const allowedCommercial = new Set(["allowed", "allowed_with_attribution", "blocked", "manual_review_required"]);
const allowedRisks = new Set(["none", "low", "manual_review_required"]);
const allowedNeedTypes = new Set([
  "code_native",
  "stock_footage",
  "stock_footage_or_imagegen_fallback",
  "imagegen_plate",
  "veo_video_plate",
]);
const allowedVeoProviders = new Set(["veo_video_generation"]);
const allowedAIVideoRoutes = new Set(["text_to_video", "image_to_video", "video_to_video", "reference_guided_video"]);

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function fail(message) {
  errors.push(message);
}

if (!Array.isArray(scout.scene_needs) || scout.scene_needs.length === 0) {
  fail("scene_needs must be a non-empty array");
}
if (!Array.isArray(scout.fallback_chain) || scout.fallback_chain.length === 0) {
  fail("fallback_chain must be a non-empty array");
}
if (!Array.isArray(scout.query_plan) || scout.query_plan.length === 0) {
  fail("query_plan must be a non-empty array");
}
if (!scout.global_asset_library || typeof scout.global_asset_library !== "object") {
  fail("global_asset_library check result is required");
} else if (scout.global_asset_library.checked !== true) {
  fail("global_asset_library.checked must be true after the scout inspects the registry path");
}

for (const [index, need] of (scout.scene_needs ?? []).entries()) {
  const tag = `scene_needs[${index}]`;
  for (const key of ["scene_id", "need_type", "visual_job", "fallback_if_rejected"]) {
    if (!hasText(need[key])) fail(`${tag}.${key} is required`);
  }
  if (hasText(need.need_type) && !allowedNeedTypes.has(need.need_type)) {
    fail(`${tag}.need_type must be one of ${Array.from(allowedNeedTypes).join(", ")}`);
  }
  if (need.remotion_precision_layer_required !== true) {
    fail(`${tag}.remotion_precision_layer_required must be true`);
  }
}

for (const [index, chain] of (scout.fallback_chain ?? []).entries()) {
  const tag = `fallback_chain[${index}]`;
  if (!hasText(chain.scene_id)) fail(`${tag}.scene_id is required`);
  const routes = (chain.ordered_routes ?? []).map((route) => route.route);
  for (const requiredRoute of [
    "global_asset_library",
    "stock_footage",
    "imagegen_plate",
    "veo_video_generation",
    "remotion_precision_layer",
  ]) {
    if (!routes.includes(requiredRoute)) fail(`${tag}.ordered_routes must include ${requiredRoute}`);
  }
}

for (const [index, plan] of (scout.query_plan ?? []).entries()) {
  const tag = `query_plan[${index}]`;
  if (!hasText(plan.scene_id)) fail(`${tag}.scene_id is required`);
  if (!Array.isArray(plan.queries)) fail(`${tag}.queries must be an array`);
  if (!hasText(plan.desired_aspect)) fail(`${tag}.desired_aspect is required`);
}

for (const [index, candidate] of (scout.candidates ?? []).entries()) {
  const tag = `candidates[${index}]`;
  for (const key of ["asset_id", "source_name", "source_url", "license_url", "commercial_use_status", "role", "decision"]) {
    if (!hasText(candidate[key])) fail(`${tag}.${key} is required`);
  }
  if (!allowedCommercial.has(candidate.commercial_use_status)) {
    fail(`${tag}.commercial_use_status must be one of ${Array.from(allowedCommercial).join(", ")}`);
  }
  if (candidate.decision === "selected" && candidate.commercial_use_status === "blocked") {
    fail(`${tag} is blocked and cannot be selected for project use`);
  }
  if (candidate.decision === "selected" && (candidate.commercial_use_status === "allowed_with_attribution" || candidate.attribution_required === true)) {
    if (!hasText(candidate.attribution_text)) fail(`${tag}.attribution_text is required when attribution is required`);
  }
  if (candidate.decision === "selected") {
    if (!Array.isArray(candidate.intended_scene_ids) || candidate.intended_scene_ids.length === 0) {
      fail(`${tag}.intended_scene_ids must be non-empty when selected`);
    }
    for (const key of ["people_or_model_release_risk", "trademark_or_brand_risk", "property_or_landmark_risk"]) {
      if (!allowedRisks.has(candidate[key])) {
        fail(`${tag}.${key} must be one of ${Array.from(allowedRisks).join(", ")}`);
      }
      if (candidate[key] === "manual_review_required") {
        fail(`${tag}.${key} must be resolved before selected use or Visual Lock`);
      }
    }
    for (const key of ["local_path", "checksum_sha256"]) {
      if (!hasText(candidate[key])) fail(`${tag}.${key} is required for selected downloaded clips`);
    }
  } else {
    for (const key of ["people_or_model_release_risk", "trademark_or_brand_risk", "property_or_landmark_risk"]) {
      if (candidate[key] !== undefined && !allowedRisks.has(candidate[key])) {
        fail(`${tag}.${key} must be one of ${Array.from(allowedRisks).join(", ")}`);
      }
    }
  }
}

for (const [index, request] of (scout.imagegen_requests ?? []).entries()) {
  const tag = `imagegen_requests[${index}]`;
  for (const key of ["request_id", "scene_id", "visual_job", "proof_role", "prompt", "negative_prompt", "overlay_plan"]) {
    if (!hasText(request[key])) fail(`${tag}.${key} is required`);
  }
  if (!request.safe_zones || typeof request.safe_zones !== "object") {
    fail(`${tag}.safe_zones is required`);
  }
  if (!Array.isArray(request.expected_output_paths)) {
    fail(`${tag}.expected_output_paths must be an array`);
  }
  if (!/text|subtitle|ui|chart|logo|proof/i.test(request.negative_prompt ?? "")) {
    fail(`${tag}.negative_prompt must exclude text, subtitles, UI/charts/logos, and proof`);
  }
}

for (const [index, request] of (scout.veo_video_requests ?? []).entries()) {
  const tag = `veo_video_requests[${index}]`;
  for (const key of [
    "request_id",
    "provider",
    "provider_model_hint",
    "technical_route",
    "prompt_pack_path",
    "prompt_path",
    "prompt_text",
    "negative_prompt",
    "output_expectation",
    "proof_exclusion_policy",
    "remotion_integration_plan",
    "handoff_instructions",
  ]) {
    if (!hasText(request[key])) fail(`${tag}.${key} is required`);
  }
  if (!allowedVeoProviders.has(request.provider)) {
    fail(`${tag}.provider must be veo_video_generation`);
  }
  if (!allowedAIVideoRoutes.has(request.technical_route)) {
    fail(`${tag}.technical_route must be one of ${Array.from(allowedAIVideoRoutes).join(", ")}`);
  }
  if (!Array.isArray(request.scene_ids) || request.scene_ids.length === 0) {
    fail(`${tag}.scene_ids must be non-empty`);
  }
  if (!/claim|text|logo|face|ui|proof|subtitle|caption/i.test(request.negative_prompt ?? "")) {
    fail(`${tag}.negative_prompt must exclude readable claims/text, proof, logos, faces, UI, and subtitles`);
  }
  if (!/remotion|video_plate|plate|subtitle|proof|overlay/i.test(request.remotion_integration_plan ?? "")) {
    fail(`${tag}.remotion_integration_plan must keep Remotion in control of the video_plate`);
  }
}

if (scout.remotion_integration?.captions_and_proof_owned_by_remotion !== true) {
  fail("remotion_integration.captions_and_proof_owned_by_remotion must be true");
}

if (errors.length) {
  console.error(`Stock footage scout validation failed: ${errors.length} error(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Stock footage scout validation passed: ${path.resolve(scoutPath)}`);
