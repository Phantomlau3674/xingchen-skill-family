# World Labs Marble World Plate Intake

This reference defines how Xingchen Next may use World Labs Marble as an external world-asset source. Marble is useful because it can create persistent 3D worlds and export splats or meshes, but it is not a renderer authority and it does not own proof, subtitles, narration timing, or final assembly.

Use this only after the director board has selected a real spatial need: hero world opening, chapter transition, concept space, archive room, system map, or other scene where a 3D world makes the argument clearer. Do not use Marble as an ordinary premium background.

## Route Boundary

Marble output enters Xingchen as a Spark world asset or fallback world plate:

- SPZ / PLY / splat exports: `renderer_family: "spark_3dgs"`, `route_status: "true_3dgs_asset"`, `actual_renderer_family: "spark_3dgs"`.
- GLB mesh exports: `renderer_family: "spark_3dgs"`, `route_status: "hybrid_spark_three"`, `actual_renderer_family: "spark_hybrid_three"`.
- Panorama / PNG exports: preview, skybox, or fallback plate only; they are not true 3DGS assets.

Remotion remains the final controller for voice alignment, captions, proof overlays, data labels, scene order, and final export. Spark or Marble can provide the visual world underneath those layers.

## Intake Locations

Use the existing Spark asset library:

- Incoming assets: `C:\xingchen-spark\assets\spark-worlds\_incoming`
- Approved assets: `C:\xingchen-spark\assets\spark-worlds\approved`
- Asset manifest: `C:\xingchen-spark\assets\spark-worlds\manifests\manifest.json`
- Spark preview harness: `C:\xingchen-spark\templates\xingchen-spark-plate`

Incoming Marble files are never approved just because they exist. Move them into `approved/<asset-id>/` only after provenance, license, stable path, scale/orientation, preview evidence, and SparkRoutePreview status are recorded.

## Required Scene Spec

Minimum scene motion spec for a Marble SPZ asset:

```json
{
  "scene_id": "S00-world-open",
  "render_mode": "code_primary",
  "renderer_family": "spark_3dgs",
  "execution_runtime": "spark_browser_canvas",
  "motion_source": "spark_runtime",
  "integration_mode": "browser_canvas_plate",
  "spark_asset_need": "A real Marble splat world is needed for a spatial concept opening.",
  "spark_asset_route": {
    "route": "true_3dgs_asset",
    "loader": "SplatMesh",
    "requires_approved_real_asset": true,
    "manifest_path": "C:\\xingchen-spark\\assets\\spark-worlds\\manifests\\manifest.json"
  },
  "spark_runtime_profile": {
    "paged": false,
    "target_fps": 30
  },
  "world_asset": {
    "asset_id": "marble-world-001",
    "asset_kind": "real_3dgs",
    "source_kind": "marble",
    "format": "spz",
    "path_or_url": "C:\\xingchen-spark\\assets\\spark-worlds\\approved\\marble-world-001\\world.spz",
    "library_manifest": "C:\\xingchen-spark\\assets\\spark-worlds\\manifests\\manifest.json",
    "status": "approved",
    "marble_world_id": "",
    "marble_model": "marble-1.1",
    "provenance": {
      "origin": "World Labs Marble",
      "created_at": ""
    },
    "license": {
      "usage": "project_generated"
    },
    "preview_evidence": {
      "video_path": "spark-route-preview.mp4",
      "verified_at": ""
    }
  },
  "route_status": "true_3dgs_asset",
  "actual_renderer_family": "spark_3dgs",
  "composite_role": "hero_world_background",
  "z_order_plan": ["spark_world", "remotion_proof_overlay", "subtitle_layer"]
}
```

If the Marble output is GLB, use `route_status: "hybrid_spark_three"` and `actual_renderer_family: "spark_hybrid_three"`. If it is only a panorama or PNG, keep it as `fallback_preview` or `approved_fallback_final` after explicit approval.

## Adapter Trace

Every Marble API call, Marble web export, or manual Marble intake that creates or promotes a scene asset must append `render.plugin_adapter_runs[]`.

Use these adapter ids:

- `world-labs-api` when Codex actually calls the World Labs API.
- `marble-web-export` when the user or Codex uses the Marble web app/export UI.
- `manual-marble-export` when the user provides the downloaded Marble files.

Required run behavior:

- `adapter_kind`: `external_api` for `world-labs-api`; `manual_implementation` for web/manual export.
- `promotion_target_renderer_family`: `spark_3dgs`.
- `input_state_refs` must include `visual.director_board.scene_boards`.
- `state_writebacks` must include `render.scene_motion_specs`.
- `output_paths` must list the downloaded or generated files once status is `generated`, `previewed`, `promoted`, or `rejected`.

## Cost Discipline

Treat cost as a production budget, not a renderer choice. Use draft or low-stakes generations during exploration, then produce one approved standard/plus world only after the director board has locked the scene job, camera role, subtitle-safe region, and proof separation.

Recommended default:

1. One draft world for route exploration.
2. One standard or plus world only for the selected hero/transition scene.
3. No Marble use for proof-heavy scenes, normal talking-head packaging, or scenes that only need 2.5D source material.

Check current World Labs pricing before real spending. API credits and Marble web-app credits are separate.

## Failure Conditions

Reject or reroute when:

- a Marble asset is used before Visual Lock
- `world_asset.source_kind: "marble"` has no `library_manifest`
- SPZ/PLY is marked as anything other than `true_3dgs_asset`
- GLB is marked as `true_3dgs_asset` instead of `hybrid_spark_three`
- panorama/PNG is described as a real 3DGS asset
- the asset is still in `_incoming` but state says `status: "approved"`
- SparkRoutePreview has not been captured or watched
- subtitles, proof overlays, or readable claims compete with the world plate
- Marble imagery introduces fake UI, fake charts, fake logos, fake people, or unverifiable factual content
