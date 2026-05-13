# Spark 2.0 / 3DGS Asset Route

## Purpose

Spark 2.0 is a `code_primary` renderer family for 3D Gaussian Splatting assets, 3D model/world plates, and spatial traversal. In Xingchen Next it is a 3D asset layer, not a replacement for scripting, narration, proof handling, subtitles, VibeMotion candidates, Remotion assembly, or approval gates.

Use this route when a knowledge-opinion scene genuinely needs a 3D model, real 3DGS asset, or navigable conceptual space: network, market structure, system map, city, lab, archive, pipeline, maze, orbit, or future room.

## Route Name

Use:

- `render_mode: "code_primary"`
- `renderer_family: "spark_3dgs"`
- `execution_runtime: "spark_browser_canvas"`
- `motion_source: "spark_runtime"`
- `integration_mode: "browser_canvas_plate"`
- `live_mode: "canvas-scene"` or `live_mode: "html-scene"` in render exports

Never invent alternate names such as `spark_video`, `worldlabs_scene`, or `3d_background` when writing state.

## Fixed Local Locations

Use these stable local paths on this machine:

- Xingchen Spark root: `C:\xingchen-spark`
- Spark 2.0 engine checkout: `C:\xingchen-spark\engine\spark-2.0`
- Xingchen Spark diagnostic harness: `C:\xingchen-spark\templates\xingchen-spark-plate`
- Approved Spark / 3DGS asset library: `C:\xingchen-spark\assets\spark-worlds`
- Approved assets: `C:\xingchen-spark\assets\spark-worlds\approved`
- Asset manifest: `C:\xingchen-spark\assets\spark-worlds\manifests\manifest.json`
- Unreviewed intake: `C:\xingchen-spark\assets\spark-worlds\_incoming`

New video projects should reference approved assets by `asset_id` and stable library path. Do not scatter `.spz`, `.splat`, `.ply`, `.ksplat`, `.sog`, or `.rad` files into random project folders unless the project is being archived as a self-contained package.

## Route Integrity

Keep intended route and actual execution truth separate.

`renderer_family: "spark_3dgs"` means the approved scene intent wants a Spark / 3DGS route. It does not prove the local implementation is using a real `.spz`, `.splat`, `.ply`, `.ksplat`, `.sog`, or `.rad` asset.

Every Spark scene must record:

- `spark_asset_route`: the asset loading route and what kind of Spark source is expected
- `spark_effect_route`: optional Spark effect route such as dyno transition, SDF lighting, portal, depth-of-field, or no effect
- `spark_runtime_profile`: performance/capture settings such as `paged`, `ext_splats`, `lod_splat_scale`, foveation, target viewport, and browser capture notes
- `world_asset.status`: `approved`, `approved_procedural`, `missing`, `unapproved`, `remote_demo`, or `fallback_only`
- `route_status`: `true_3dgs_asset`, `streaming_rad_world`, `procedural_splat_world`, `hybrid_spark_three`, `fallback_preview`, `blocked_missing_asset`, or `approved_fallback_final`
- `actual_renderer_family`: `spark_3dgs`, `spark_procedural_splat`, `spark_hybrid_three`, or `html_canvas_world_plate_fallback`

Use `spark_3dgs` as `actual_renderer_family` only when a real approved splat asset is loaded from `.spz`, `.ply`, `.splat`, `.ksplat`, `.sog`, `.zip`, or `.rad`. A `constructSplats` procedural world can be approved as a useful Spark plate, but it must use `route_status: "procedural_splat_world"` and `actual_renderer_family: "spark_procedural_splat"`.

If no approved real 3DGS asset exists, the scene may be previewed as a fallback world plate, but it must not be described as a completed true 3DGS asset route.

## Spark 2.0 Capability Routes

Use these route families so the plan maps to real Spark 2.0 APIs:

| Route | Spark API surface | Truth rule |
| --- | --- | --- |
| `true_3dgs_asset` | `new SplatMesh({ url })` for `.spz`, `.ply`, `.splat`, `.ksplat`, `.sog`, or `.zip` | Requires approved real asset path or URL, provenance, and preview evidence |
| `streaming_rad_world` | `new SplatMesh({ url, paged: true })` plus `SparkRenderer({ pagedExtSplats })` when needed | Requires `.rad` asset and runtime LOD budget |
| `procedural_splat_world` | `new SplatMesh({ constructSplats })` / `PackedSplats.pushSplat` | Valid Spark plate, not a real scanned/generated 3DGS world asset |
| `hybrid_spark_three` | Spark splats plus Three.js meshes/materials or environment-map staging | Must identify which layer carries truth and which is spectacle |
| `fallback_preview` | HTML/canvas/Three fallback without approved Spark asset | Review-only unless upgraded or explicitly accepted as fallback final |

Spark effect routes may use `objectModifiers`, `worldModifiers`, dyno uniforms, `SplatEdit`, `SplatEditSdf`, depth of field, portals, multi-view render targets, or `renderEnvMap`. Record the named effect and the deterministic uniforms that must be driven during capture.

## Good Fits

- cold opens that need spatial wonder before a knowledge claim
- section transitions that move through a concept space
- hero-world plates behind short title and subtitle layers when a 3D asset is the point
- abstract systems that become easier to understand as a route, orbit, stack, network, or map
- generated or scanned 3DGS assets used as atmosphere while code overlays preserve clarity

## Bad Fits

- literal proof screenshots, charts, terminals, PDFs, or UI captures
- scenes where the viewer must inspect exact numbers or text
- normal talking-head packaging that only needs restrained motion
- any scene where Spark would compete with subtitles or narration comprehension
- final audio, voice cloning, lip sync, caption timing, or publish metadata

## Required SceneMotionSpec Fields

Each Spark scene should include:

```json
{
  "scene_id": "S00-spark-knowledge-plate",
  "render_mode": "code_primary",
  "renderer_family": "spark_3dgs",
  "execution_runtime": "spark_browser_canvas",
  "motion_source": "spark_runtime",
  "integration_mode": "browser_canvas_plate",
  "dominant_anchor": "3dgs_subject_center",
  "spark_asset_route": {
    "route": "procedural_splat_world",
    "loader": "constructSplats",
    "requires_approved_real_asset": false
  },
  "spark_effect_route": {
    "effects": ["sdf_lighting", "dyno_transition"],
    "deterministic": true,
    "uniforms": ["time"]
  },
  "spark_runtime_profile": {
    "paged": false,
    "ext_splats": false,
    "lod_splat_scale": 1,
    "sort_radial": true,
    "target_viewport": "1080x1920",
    "capture": "browser_canvas"
  },
  "world_asset": {
    "asset_id": "",
    "asset_kind": "real_3dgs|streaming_rad|procedural_splat|hybrid|fallback",
    "source_kind": "marble|scan|local|remote|generated|procedural_recipe",
    "format": "spz|splat|ply|ksplat|sog|zip|rad|procedural_packed_splats",
    "path_or_url": "",
    "library_manifest": "C:\\xingchen-spark\\assets\\spark-worlds\\manifests\\manifest.json",
    "status": "approved|approved_procedural|missing|unapproved|remote_demo|fallback_only"
  },
  "route_status": "true_3dgs_asset|streaming_rad_world|procedural_splat_world|hybrid_spark_three|fallback_preview|blocked_missing_asset|approved_fallback_final",
  "actual_renderer_family": "spark_3dgs|spark_procedural_splat|spark_hybrid_three|html_canvas_world_plate_fallback",
  "camera_path": "forward_drift_orbit",
  "composite_role": "hero_world_background",
  "frame_strategy": "vertical_9_16_full_bleed",
  "subtitle_safe_region": { "x": 0.08, "y": 0.78, "w": 0.84, "h": 0.14 },
  "z_order_plan": ["spark_3dgs_world", "code_overlay", "subtitle_layer"]
}
```

Optional but useful:

- `capture_policy`: fps, width, height, duration source, and browser capture target
- `fallback_strategy`: what to show if the 3DGS asset fails to load
- `asset_license`: source, allowed usage, and attribution notes
- `performance_budget`: target device, max asset size, and streaming assumptions

## Asset Manifest Contract

Every asset entry in `C:\xingchen-spark\assets\spark-worlds\manifests\manifest.json` should include:

- `asset_id`
- `title`
- `status`
- `asset_kind`
- `source_kind`
- `format`
- `path_or_url`
- `provenance`
- `license`
- `scale_orientation`
- `camera_presets`
- `lod_profile`
- `quality_notes`
- `preview_evidence`

Incoming assets under `_incoming` are never approved just because a preview exists. Move them into `approved/<asset-id>/` only after provenance, license, stable path, camera presets, and preview evidence are recorded.

## Approval Rules

- `Visual Lock` must approve Spark as a scene family before lookdev.
- `Lookdev Approval` must verify a real moving browser preview or captured plate, not just a still.
- Full render is blocked until a `SparkRoutePreview` has been rendered, inspected, and recorded when the project contains any `spark_3dgs` scene.
- If Spark is used as a generated realism shortcut, reroute as `gen_insert` or `mixed_scene`; do not hide it under `spark_3dgs`.
- Proof-heavy scenes must stay on the proof-safe route unless upstream explicitly approves a separate world-plate transition.
- Fallback world plates cannot pass as true 3DGS. They may proceed to final render only if the user explicitly accepts fallback final quality and state records `route_status: "approved_fallback_final"`.

## SparkRoutePreview Gate

Before any full-video render, create a dedicated preview composition when Spark-routed scenes exist.

Recommended name:

- composition: `SparkRoutePreview`
- output: `spark-route-preview.mp4`

The preview should include all Spark-routed scenes when practical. If there are too many, include every unique Spark scene type plus all opening, transition, and hero-world scenes, and record the exact `scene_ids`.

The preview result must record:

- `scene_ids`
- output path
- width, height, fps, duration, and frame count from `ffprobe` or equivalent
- typecheck/build result
- route integrity summary: count of `true_3dgs_asset`, `streaming_rad_world`, `procedural_splat_world`, `hybrid_spark_three`, `fallback_preview`, `blocked_missing_asset`, and `approved_fallback_final`
- process cleanup status after render

Do not continue to full render just because the preview file exists. The preview must be watched or explicitly approved at the current checkpoint.

## Adapter Handoff

Remotion or another render adapter should treat Spark as a browser/canvas source:

- open the Spark scene URL or local app
- set the approved aspect, fps, duration, and device scale
- capture the canvas or browser output as a plate
- layer captions, callouts, voice, and BGM outside Spark
- write the source URL, capture command, and output path into the render job log

The adapter may use the local diagnostic harness at `C:\xingchen-spark\templates\xingchen-spark-plate` to verify a Spark route, but project state still owns the truth and this harness is not a production style template.

If the implementation uses local HTML/canvas fallback because no approved 3DGS asset exists, the render log and state should say `html_canvas_world_plate_fallback`. That is acceptable for route exploration and review, but it is not a real Spark 3DGS asset pass.

The Spark plate harness must expose `window.__XINGCHEN_SPARK_PLATE__` with at least:

- effective scene spec and route status
- actual load status and error/fallback reason
- splat count when available
- LOD, paged, `ExtSplats`, and foveation settings
- canvas health, frame count, and last sample result
- capture/readiness status for the adapter

## Failure Conditions

Stop and reroute upstream if:

- `world_asset.path_or_url` is missing or unstable
- the asset license or provenance is unclear
- `renderer_family` says `spark_3dgs` but `actual_renderer_family` is missing
- a procedural or fallback preview is being treated as `true_3dgs_asset`
- a fallback preview is being treated as final quality without explicit approval
- `.rad` is used without `paged: true`
- a huge-coordinate asset needs `ExtSplats` but the runtime profile does not say so
- a full render is requested before `SparkRoutePreview` is approved
- the preview is blank, mostly black, badly cropped, or too slow for the target device
- subtitles overlap the dominant anchor or become unreadable
- Spark visuals make the proof meaning feel decorative or speculative
