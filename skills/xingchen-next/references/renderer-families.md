# Renderer Families Registry

This file is the single source of truth for `renderer_family`, `actual_renderer_family`, and Spark `route_status` values.

`render.route.default_mode` (`code_primary` / `gen_insert` / `mixed_scene`) is high-level policy. `renderer_family` is final execution intent for a scene. `actual_renderer_family` records what actually ran. VibeMotion is a motion-source/candidate system, not a final renderer family except as a temporary lookdev state.
Hyperframes is also a motion-source/candidate system. It should normally resolve into `html_scene`, `canvas_scene`, transparent assets, or Remotion-promoted components rather than becoming a new final renderer family. Lottie is a vector motion asset source inside Remotion or a Hyperframes candidate, not a renderer family. AI video generation is a prompt-request/candidate video-plate source under Remotion, not a renderer family.

## Route Taxonomy

Every render-bound `SceneMotionSpec` may record these semantic route fields:

- `execution_runtime`: `remotion`, `spark_browser_canvas`, `html_browser_capture`, `source_media`
- `motion_source`: `native_remotion`, `vibemotion_skill`, `hyperframes_runtime`, `ai_video_generation`, `spark_runtime`, `bespoke_code`, `existing_media`
- `integration_mode`: `live_component`, `copied_component`, `rewritten_component`, `captured_html_plate`, `transparent_asset_layer`, `video_plate`, `browser_canvas_plate`

Use them to separate runtime from origin:

- Remotion can be both runtime and motion source (`execution_runtime: "remotion"`, `motion_source: "native_remotion"`).
- Lottie loaded through `@remotion/lottie` stays under Remotion (`motion_source: "native_remotion"`) and records the asset source/local JSON path in the resource matrix or motion stack.
- VibeMotion should usually be a motion source under Remotion (`motion_source: "vibemotion_skill"`).
- Hyperframes should usually be a motion source for HTML/canvas capture or Remotion-promoted assets (`motion_source: "hyperframes_runtime"`).
- AI video generation should only be a bounded Remotion-composited video plate (`motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`).
- Spark should be a browser-canvas world plate (`execution_runtime: "spark_browser_canvas"`, `integration_mode: "browser_canvas_plate"`).
- Screen recordings should stay existing media (`motion_source: "existing_media"`, `integration_mode: "video_plate"`), then be polished by Remotion.

## Allowed `renderer_family` Values

- `remotion_component`
- `html_scene`
- `canvas_scene`
- `spark_3dgs`
- `vibemotion_candidate` (lookdev transition only; blocked at `active_stage >= "render"`)

## Allowed `actual_renderer_family` Values

- `remotion_component`
- `html_scene`
- `canvas_scene`
- `vibemotion_candidate`
- `spark_3dgs`
- `spark_procedural_splat`
- `spark_hybrid_three`
- `html_canvas_world_plate_fallback`

## Allowed Spark `route_status` Values

`true_3dgs_asset`, `streaming_rad_world`, `procedural_splat_world`, `hybrid_spark_three`, `fallback_preview`, `blocked_missing_asset`, `approved_fallback_final`.

Authoritative Spark route rules live in [spark-3dgs-world-route.md](./spark-3dgs-world-route.md). Recording-first technology routing lives in [recording-motion-routing.md](./recording-motion-routing.md).

---

## remotion_component

**Role**: primary final video runtime and renderer family.

**When to use**: proof overlays, exact subtitles, charts, UI captures, screen-recording plates, evidence callouts, structured explanation, voice/BGM composition, local Lottie motion layers, reusable React/SVG/Canvas scenes, and final export.

**Typical route fields**:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "native_remotion",
  "integration_mode": "live_component",
  "actual_renderer_family": "remotion_component"
}
```

**Preview gate**: a real Remotion preview frame or sequence captured from the scene's component.

**Failure conditions**: component imports a route-external Spark, VibeMotion, Hyperframes, or Lottie artifact without recorded source/provenance, `motion_source`, `integration_mode`, and promotion target when applicable.

## html_scene

**Role**: browser-captured HTML plate that Remotion can schedule and composite.

**When to use**: DOM/SVG scenes, proof grids, glyph montages, static-DOM explainers, Hyperframes-authored agent scenes, or HTML animations where browser capture is the cleanest source.

**Typical route fields**:

```json
{
  "renderer_family": "html_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "bespoke_code",
  "integration_mode": "captured_html_plate",
  "actual_renderer_family": "html_scene"
}
```

**Hyperframes route fields**:

```json
{
  "renderer_family": "html_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "actual_renderer_family": "html_scene",
  "promotion_target_renderer_family": "html_scene"
}
```

**Preview gate**: deterministic browser capture at target aspect.

**Failure conditions**: runtime fetches, missing fonts, interactive controls, non-deterministic DOM state, or Hyperframes output used as unapproved full-video controller.

## canvas_scene

**Role**: Canvas/WebGL plate under Remotion orchestration when a full spatial Spark world is not justified.

**When to use**: waveforms, deterministic particles, force graphs, Hyperframes/Three/Lottie plates, procedural backgrounds with a proof-safe role, and lightweight WebGL motion.

**Typical route fields**:

```json
{
  "renderer_family": "canvas_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "bespoke_code",
  "integration_mode": "captured_html_plate",
  "actual_renderer_family": "canvas_scene"
}
```

**Hyperframes route fields**:

```json
{
  "renderer_family": "canvas_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "actual_renderer_family": "canvas_scene",
  "promotion_target_renderer_family": "canvas_scene"
}
```

**Preview gate**: seeded deterministic capture with fixed time uniforms.

**Failure conditions**: non-deterministic uniforms, pointer-dependent visuals, use as fake Spark when a Spark world route was promised, or unapproved full-video assembly.

## vibemotion_candidate

**Role**: lookdev transition state only.

**When to use**: before final render, to generate `recommended` / `bold` / `safe` motion options from VibeMotion skills.

**Important distinction**: VibeMotion outputs can be Remotion components, Remotion projects, HTML/GSAP pages, transparent MOVs, PNG sequences, or video plates. Those are motion sources or candidate artifacts. They must be promoted into a final renderer family before `active_stage >= "render"`.

**Required promotion fields for approved candidates before render**:

- `integration_mode`
- `promotion_target_renderer_family`
- `candidate_origin`
- `state_trace_refs[]`

**Typical promoted scene**:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "vibemotion_skill",
  "integration_mode": "transparent_asset_layer",
  "candidate_skill": "light-spotlight-render",
  "promotion_target_renderer_family": "remotion_component"
}
```

**Preview gate**: real `.mp4`, `.mov`, `.html`, Remotion component, or transparent asset. Text-only direction is not lookdev evidence.

**Failure conditions**: `renderer_family: "vibemotion_candidate"` remains at render; candidate is approved but lacks `integration_mode`, `promotion_target_renderer_family`, `candidate_origin`, or `state_trace_refs[]`; candidate source is a fixed demo/template rather than current-state generation.

See [vibemotion-skill-inventory.md](./vibemotion-skill-inventory.md).

## hyperframes_runtime

**Role**: AI-first HTML/canvas motion source and lookdev candidate layer.

**When to use**: agent-authored HTML/CSS/GSAP/Anime/Lottie/Three scenes, DOM-to-video plates, CodePen-like explainers, visual-editor-friendly scene assets, and fast concept-motion studies that can be captured deterministically.

**Typical final HTML scene**:

```json
{
  "renderer_family": "html_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "promotion_target_renderer_family": "html_scene",
  "actual_renderer_family": "html_scene"
}
```

**Typical Remotion-promoted layer**:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "transparent_asset_layer",
  "promotion_target_renderer_family": "remotion_component",
  "actual_renderer_family": "remotion_component"
}
```

**Preview gate**: deterministic `.html`, `.mp4`, `.mov`, component source, or transparent asset captured at target aspect and fps.

**Failure conditions**: Hyperframes owns final full-video assembly by default, lacks promotion metadata or `state_trace_refs[]` at render, uses network/interactive/non-deterministic state, hides a Spark world route, handles literal screen recordings that should remain `existing_media`, or copies a fixed HTML visual template.

See [hyperframes-route-policy.md](./hyperframes-route-policy.md).

## ai_video_generation

**Role**: bounded generated-video plate source for concept motion or realism gaps.

**When to use**: a director-board scene explicitly selects `gen_insert`, names the visual gap, excludes proof/text ownership, and requires a moving generated plate that code, source media, HTML, or Spark should not own.

**Typical Remotion-composited scene**:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "ai_video_generation",
  "integration_mode": "video_plate",
  "ai_video_candidate_ids": ["candidate-seedance-scene-02"],
  "promotion_target_renderer_family": "remotion_component"
}
```

**Prompt gate**: `render.ai_video_prompt_requests[]` may exist before a file is generated. It must include prompt pack path, prompt text, negative prompt, proof exclusion policy, Remotion integration plan, and user handoff instructions.

**Preview gate**: before final render, a real `.mp4`, `.mov`, `.webm`, or image sequence generated from the current state, plus a Remotion composite preview proving captions, proof overlays, and safe regions still work.

**Failure conditions**: generated video carries hero proof, readable claim text, UI-like evidence, subtitles, logos, faces, false facts, or final-video ownership; candidate lacks provider/model, negative prompt, safety review, `state_trace_refs[]`, proof exclusion policy, Remotion integration plan, or matching adapter run.

## spark_3dgs

**Role**: Spark world-plate intent for 3DGS, procedural splats, streaming RAD, or hybrid Spark+Three scenes.

**When to use**: genuine spatial jobs: concept maps, knowledge-space traversal, system orbit, archive/world plates, approved 3DGS assets, streaming `.rad`, procedural `constructSplats`, or hybrid world rendering.

**Typical route fields**:

```json
{
  "renderer_family": "spark_3dgs",
  "execution_runtime": "spark_browser_canvas",
  "motion_source": "spark_runtime",
  "integration_mode": "browser_canvas_plate"
}
```

**Spark truth fields**:

- `spark_asset_route`
- `spark_effect_route`
- `spark_runtime_profile`
- `world_asset`
- `route_status`
- `actual_renderer_family`

**Actual-family rules**:

- Real approved `.spz`, `.ply`, `.splat`, `.ksplat`, `.sog`, `.zip`, or `.rad`: `actual_renderer_family: "spark_3dgs"`.
- Procedural `constructSplats` / packed splats: `route_status: "procedural_splat_world"` and `actual_renderer_family: "spark_procedural_splat"`.
- Spark plus Three.js staging: `route_status: "hybrid_spark_three"` and `actual_renderer_family: "spark_hybrid_three"`.
- Non-Spark fallback: `actual_renderer_family: "html_canvas_world_plate_fallback"` with `route_status: "fallback_preview"` or explicit `approved_fallback_final`.

**Marble intake**: World Labs Marble is a source inside this family, not a separate renderer. Marble SPZ/PLY/splat exports follow the real-approved asset rule; Marble GLB exports follow the hybrid Spark+Three rule; Marble panorama/PNG exports are fallback plates. See [world-labs-marble-intake.md](./world-labs-marble-intake.md).

**Preview gate**: `SparkRoutePreview`, captured or watched as a moving browser canvas plate.

**Failure conditions**: Spark used as generic background, missing `execution_runtime: "spark_browser_canvas"`, procedural plate marked as true 3DGS, `.rad` without `paged: true`, or full render requested before SparkRoutePreview.

---

## Validator Coverage

The Node validator at `../schema/validate-project-state.mjs` enforces:

- `active_stage >= "render"` blocks unresolved `renderer_family: "vibemotion_candidate"`.
- Approved VibeMotion candidates at render require `integration_mode` and `promotion_target_renderer_family`.
- VibeMotion-sourced final scenes require `integration_mode` and `promotion_target_renderer_family`.
- Approved Hyperframes candidates at render require `integration_mode` and `promotion_target_renderer_family`.
- Hyperframes-sourced final scenes require `integration_mode` and `promotion_target_renderer_family`.
- AI video prompt-only work may stop at `render.ai_video_prompt_requests[]`; final render requires `render.ai_video_candidates[]`, safety review, proof exclusion policy, Remotion integration plan, matching `render.plugin_adapter_runs[]`, and approved candidates promote only as Remotion `video_plate`.
- VibeMotion and Hyperframes candidates require `candidate_origin` and non-empty `state_trace_refs[]`.
- Spark scenes require `execution_runtime: "spark_browser_canvas"`, `spark_asset_route`, `spark_runtime_profile`, `world_asset`, `route_status`, and `actual_renderer_family`.
- Procedural Spark assets require `route_status: "procedural_splat_world"` and `actual_renderer_family: "spark_procedural_splat"`.
- `true_3dgs_asset` requires a real `world_asset.path_or_url` and cannot use `procedural_packed_splats`.
- `streaming_rad_world` requires `world_asset.format: "rad"` and `spark_runtime_profile.paged === true`.
- Marble `world_asset.source_kind: "marble"` requires `library_manifest`; SPZ/PLY/splat formats must be `true_3dgs_asset`, GLB must be `hybrid_spark_three`, and pano/PNG cannot claim true Spark 3DGS.
- `render.visual_preprocess_assets[]` records depth, mask, upscale, repair, and 2.5D camera artifacts for Remotion; generated assets must link to `render.plugin_adapter_runs[].candidate_ids[]` and declare a proof policy that preprocessing does not rewrite proof.

Run from this skill directory:

```sh
node schema/validate-project-state.mjs path/to/project-state.json
```
