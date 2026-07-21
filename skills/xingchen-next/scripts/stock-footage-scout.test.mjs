import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const scoutScript = path.join(here, "stock-footage-scout.mjs");
const scoutValidator = path.join(here, "validate-stock-footage-scout.mjs");

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function makeState() {
  return {
    kind: "XingchenNextProjectState",
    version: "1.1.0",
    metadata: {
      project_id: "material-scout-test",
      title: "Material scout test",
      active_stage: "visual-direction",
      updated_at: "2026-05-30T00:00:00+08:00",
    },
    workflow: {approvals: [], stage_history: []},
    sources: {source_pack: {existing_assets: []}, asset_manifest: []},
    proof: {},
    script: {beat_map: {scenes: []}},
    mother: {
      story_mother: {
        scene_order: ["scene-proof", "scene-metaphor"],
        scene_cards: [
          {
            scene_id: "scene-proof",
            scene_job: "proof",
            intent: "Show a real dashboard proof and keep source labels exact.",
            proof_need: "hero proof screenshot",
            dominant_anchor: "dashboard value",
          },
          {
            scene_id: "scene-metaphor",
            scene_job: "hook",
            intent: "Open with a warm desk lamp and city window metaphor for attention drift.",
            proof_need: "none",
            dominant_anchor: "warm desk lamp",
          },
        ],
      },
    },
    visual: {
      visual_policy: {
        short_form_policy: {aspect_ratio: "9:16"},
      },
      director_board: {
        brainstorming_contract: {
          resource_preflight: {
            visual_resource_research_path: "visual-resource-research.md",
            visual_resource_research_json_path: "visual-resource-research.json",
            prompt_pack_paths: [],
            selected_routes: {},
            stock_footage_candidates: [],
          },
        },
        scene_boards: [
          {
            scene_id: "scene-proof",
            scene_job: "proof",
            source_layer: {
              evidence_role: "hero",
              must_preserve: "Exact source pixels and labels stay inspectable.",
            },
            tech_stack_layer: {primary_stack: "remotion"},
          },
          {
            scene_id: "scene-metaphor",
            scene_job: "hook",
            frame_layer: {
              main_frame_design: "Warm desk lamp, city window, subtle camera drift.",
              camera_path: "slow push through light texture",
            },
            tech_stack_layer: {
              primary_stack: "gen_insert",
              why_this_stack: "Need a short bounded motion plate, not proof.",
            },
          },
        ],
      },
    },
    render: {
      scene_motion_specs: [
        {scene_id: "scene-proof", motion_source: "native_remotion"},
        {scene_id: "scene-metaphor", motion_source: "ai_video_generation"},
      ],
      ai_video_prompt_requests: [],
      ai_video_candidates: [],
      plugin_adapter_runs: [],
    },
  };
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: skillRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      PEXELS_API_KEY: "",
      PIXABAY_API_KEY: "",
      COVERR_API_KEY: "",
    },
    ...options,
  });
}

{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-scout-"));
  const statePath = path.join(dir, "project-state.json");
  const outputPath = path.join(dir, "stock-footage-scout.json");
  writeJson(statePath, makeState());

  const result = run(process.execPath, [
    scoutScript,
    "--state",
    statePath,
    "--project-root",
    dir,
    "--global-root",
    path.join(dir, "visual-assets"),
    "--output",
    outputPath,
    "--dry-run",
    "--write-state",
  ]);

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  assert.equal(report.report_kind, "xingchen_material_route_scout");
  assert.equal(report.global_asset_library.checked, true);
  assert.equal(report.global_asset_library.registry_missing, true);
  assert.equal(report.scene_needs.find((item) => item.scene_id === "scene-proof").need_type, "code_native");
  assert.ok(report.imagegen_requests.some((item) => item.scene_id === "scene-metaphor"));
  assert.ok(report.veo_video_requests.some((item) => item.scene_ids.includes("scene-metaphor")));
  assert.equal(report.remotion_integration.captions_and_proof_owned_by_remotion, true);

  const updatedState = JSON.parse(fs.readFileSync(statePath, "utf8"));
  assert.equal(updatedState.render.ai_video_prompt_requests[0].provider, "veo_video_generation");
  assert.match(
    updatedState.render.ai_video_prompt_requests[0].negative_prompt,
    /text|proof|subtitle/i
  );
  assert.ok(
    updatedState.visual.director_board.brainstorming_contract.resource_preflight.prompt_pack_paths.includes(
      path.join(dir, "veo-video-request.json")
    )
  );
  assert.ok(
    updatedState.render.scene_motion_specs
      .find((item) => item.scene_id === "scene-metaphor")
      .ai_video_prompt_request_ids.includes("veo-scene-metaphor-video-plate")
  );

  const validatorResult = run(process.execPath, [scoutValidator, outputPath]);
  assert.equal(validatorResult.status, 0, `${validatorResult.stdout}\n${validatorResult.stderr}`);
  fs.rmSync(dir, {recursive: true, force: true});
}

{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-scout-coverr-"));
  const statePath = path.join(dir, "project-state.json");
  const outputPath = path.join(dir, "stock-footage-scout.json");
  writeJson(statePath, makeState());

  const result = run(process.execPath, [
    scoutScript,
    "--state",
    statePath,
    "--project-root",
    dir,
    "--global-root",
    path.join(dir, "visual-assets"),
    "--output",
    outputPath,
    "--providers",
    "coverr",
  ]);

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  const coverrStatus = report.provider_status.find((item) => item.provider === "coverr");
  assert.equal(coverrStatus.status, "skipped");
  assert.match(coverrStatus.reason, /COVERR_API_KEY/);
  assert.equal(report.candidates.length, 0);
  fs.rmSync(dir, {recursive: true, force: true});
}

{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-scout-invalid-"));
  const invalidPath = path.join(dir, "stock-footage-scout.json");
  writeJson(invalidPath, {
    report_kind: "xingchen_material_route_scout",
    scene_needs: [
      {
        scene_id: "scene-stock",
        need_type: "stock_footage",
        visual_job: "office b-roll",
        fallback_if_rejected: "Remotion plate",
        remotion_precision_layer_required: true,
      },
    ],
    fallback_chain: [
      {
        scene_id: "scene-stock",
        ordered_routes: [
          {route: "global_asset_library"},
          {route: "stock_footage"},
          {route: "imagegen_plate"},
          {route: "veo_video_generation"},
          {route: "remotion_precision_layer"},
        ],
      },
    ],
    query_plan: [{scene_id: "scene-stock", queries: ["office"], desired_aspect: "9:16"}],
    global_asset_library: {checked: true, registry_missing: true, candidate_ids: [], matches: []},
    candidates: [
      {
        asset_id: "stock-test",
        source_name: "pexels",
        source_url: "https://example.com/video",
        license_url: "https://www.pexels.com/license/",
        commercial_use_status: "allowed",
        attribution_required: false,
        people_or_model_release_risk: "manual_review_required",
        trademark_or_brand_risk: "none",
        property_or_landmark_risk: "none",
        intended_scene_ids: ["scene-stock"],
        role: "broll_plate",
        local_path: "",
        checksum_sha256: "",
        decision: "selected",
      },
    ],
    imagegen_requests: [],
    veo_video_requests: [],
    remotion_integration: {captions_and_proof_owned_by_remotion: true},
  });

  const result = run(process.execPath, [scoutValidator, invalidPath]);
  assert.notEqual(result.status, 0, "invalid selected stock candidate unexpectedly passed");
  assert.match(`${result.stdout}${result.stderr}`, /manual_review_required|local_path|checksum/);
  fs.rmSync(dir, {recursive: true, force: true});
}

{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-scout-empty-"));
  const emptyPath = path.join(dir, "stock-footage-scout.json");
  writeJson(emptyPath, {
    report_kind: "xingchen_material_route_scout",
    scene_needs: [],
    fallback_chain: [],
    query_plan: [],
    global_asset_library: {checked: true},
    candidates: [],
    imagegen_requests: [],
    veo_video_requests: [],
    remotion_integration: {captions_and_proof_owned_by_remotion: true},
  });

  const result = run(process.execPath, [scoutValidator, emptyPath]);
  assert.notEqual(result.status, 0, "empty scout unexpectedly passed");
  assert.match(`${result.stdout}${result.stderr}`, /scene_needs must be a non-empty array/);
  fs.rmSync(dir, {recursive: true, force: true});
}

{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-scout-download-"));
  const statePath = path.join(dir, "project-state.json");
  const outputPath = path.join(dir, "stock-footage-scout.json");
  writeJson(statePath, makeState());
  writeJson(outputPath, {
    report_kind: "xingchen_material_route_scout",
    project_id: "material-scout-test",
    project_root: dir,
    scene_needs: [
      {
        scene_id: "scene-metaphor",
        need_type: "stock_footage",
        visual_job: "desk lamp b-roll",
        fallback_if_rejected: "Remotion plate",
        remotion_precision_layer_required: true,
      },
    ],
    fallback_chain: [
      {
        scene_id: "scene-metaphor",
        ordered_routes: [
          {route: "global_asset_library"},
          {route: "stock_footage"},
          {route: "imagegen_plate"},
          {route: "veo_video_generation"},
          {route: "remotion_precision_layer"},
        ],
      },
    ],
    query_plan: [{scene_id: "scene-metaphor", queries: ["desk lamp"], desired_aspect: "9:16"}],
    global_asset_library: {checked: true, registry_missing: true, candidate_ids: [], matches: []},
    candidates: [
      {
        asset_id: "stock-test",
        source_name: "pexels",
        source_url: "https://example.com/video",
        download_url: "https://example.com/video.mp4",
        license_url: "https://www.pexels.com/license/",
        commercial_use_status: "manual_review_required",
        attribution_required: false,
        people_or_model_release_risk: "manual_review_required",
        trademark_or_brand_risk: "none",
        property_or_landmark_risk: "none",
        intended_scene_ids: ["scene-metaphor"],
        role: "broll_plate",
        decision: "selected",
      },
    ],
    imagegen_requests: [],
    veo_video_requests: [],
    remotion_integration: {captions_and_proof_owned_by_remotion: true},
  });

  const result = run(process.execPath, [
    scoutScript,
    "--state",
    statePath,
    "--project-root",
    dir,
    "--global-root",
    path.join(dir, "visual-assets"),
    "--output",
    outputPath,
    "--download",
    "selected",
  ]);
  assert.notEqual(result.status, 0, "download selected unexpectedly allowed unresolved candidate");
  assert.match(`${result.stdout}${result.stderr}`, /resolve license\/risk\/download fields/);
  fs.rmSync(dir, {recursive: true, force: true});
}

console.log("stock-footage-scout tests passed");
