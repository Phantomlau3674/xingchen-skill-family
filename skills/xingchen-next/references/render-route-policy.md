# Render Route Policy

## Default Philosophy

Xingchen Next is `code_primary` by default, but "code-first" no longer means every technology is a peer renderer.

- Remotion is the primary video runtime, scene programming framework, preview surface, and final render system.
- VibeMotion is a motion-source layer: skill outputs may become components, transparent assets, HTML plates, video plates, or candidate review artifacts.
- Hyperframes is the AI-first HTML scene lane: agent-authored HTML/CSS/GSAP/Anime/Lottie/Three scenes may become HTML/canvas plates, transparent assets, or Remotion-promoted components.
- AI video platforms such as Seedance are bounded generated-video plate lanes, not renderer families. Codex may only write prompt requests when no API is available; the user-generated file is registered later.
- Spark is the spatial runtime for 3DGS, procedural splat, RAD, and hybrid world plates.

None of these lanes may become fixed visual templates. Scene source must be generated from the current project's approved state, not copied from a standing scene bundle. Reuse is limited to neutral runtime adapters, primitive helpers, validation scripts, and capture conventions that do not decide the scene's look, metaphor, rhythm, or proof treatment.

Any VibeMotion, Hyperframes, or AI video candidate must record `candidate_origin` and `state_trace_refs[]` so the reviewer can see which current StoryMother, visual policy, scene decision, proof boundary, recording brief, director-board scene, or SceneMotionSpec generated it.

Codex plugins are one adapter source under this policy, not the only source. In Claude Code, use local CLI, synced local skills, or manual implementation lanes instead. Every artifact an adapter creates or promotes must be traced in `render.plugin_adapter_runs[]`.

## RenderRoute

Allowed high-level route values:

- `code_primary`
- `gen_insert`
- `mixed_scene`

Renderer families are subroutes under the route value. They do not replace `RenderRoute`.

Known renderer families:

- `remotion_component`
- `html_scene`
- `canvas_scene`
- `spark_3dgs`
- `vibemotion_candidate` (lookdev only; must be promoted before render)

## Route Taxonomy

`SceneMotionSpec` should separate runtime, motion origin, and integration:

- `execution_runtime`: `remotion`, `spark_browser_canvas`, `html_browser_capture`, `source_media`
- `motion_source`: `native_remotion`, `vibemotion_skill`, `hyperframes_runtime`, `ai_video_generation`, `spark_runtime`, `bespoke_code`, `existing_media`
- `integration_mode`: `live_component`, `copied_component`, `rewritten_component`, `captured_html_plate`, `transparent_asset_layer`, `video_plate`, `browser_canvas_plate`

Examples:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "native_remotion",
  "integration_mode": "live_component"
}
```

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "vibemotion_skill",
  "integration_mode": "transparent_asset_layer",
  "candidate_skill": "svg-assembly-animator",
  "promotion_target_renderer_family": "remotion_component"
}
```

```json
{
  "renderer_family": "html_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "promotion_target_renderer_family": "html_scene"
}
```

```json
{
  "renderer_family": "spark_3dgs",
  "execution_runtime": "spark_browser_canvas",
  "motion_source": "spark_runtime",
  "integration_mode": "browser_canvas_plate"
}
```

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "ai_video_generation",
  "integration_mode": "video_plate",
  "promotion_target_renderer_family": "remotion_component"
}
```

## Route Rules

- every project defaults to `code_primary`
- every scene defaults to `code_primary`
- `gen_insert` is only for explicit visual realism/concept-motion gaps declared by the director board
- `mixed_scene` is allowed only when the scene needs both code-driven packaging and a generated insert
- Remotion should own final subtitles, narration sync, proof overlays, timeline composition, and export
- VibeMotion candidates require real review artifacts and must be promoted before final render
- Hyperframes candidates require deterministic HTML/canvas review artifacts and must be promoted before final render
- VibeMotion and Hyperframes candidates require `candidate_origin` plus non-empty `state_trace_refs[]`; fixed-template output is invalid even if the artifact renders
- Hyperframes adapter candidates require a linked `render.plugin_adapter_runs[]` record; Remotion adapter implementation or preview work should write the affected render state paths into the same trace array
- AI video prompt handoffs require `render.ai_video_prompt_requests[]`, prompt pack path, prompt and negative prompt, proof exclusion policy, Remotion integration plan, and user handoff instructions
- AI video returned files require `render.ai_video_candidates[]`, provider/model, prompt and negative prompt, safety review, proof exclusion policy, Remotion integration plan, and a linked external-API/manual adapter run
- AI video candidates may not contain readable proof, UI evidence, subtitles, logos, faces, or false factual claims
- Spark requires a spatial/world-asset reason and must preserve the SparkRoutePreview gate
- Screen recordings stay as `existing_media` / `video_plate` and are polished by Remotion

## Hero-Shot Guardrail

Generated-video inserts must:

- stay scoped to named scenes or shots
- keep proof meaning outside the generated video
- enter final composition only as a Remotion-controlled `video_plate`
- remain subordinate to the project's code-first motion system and subtitle/proof overlays

Do not let hero shots become a hidden full-project fallback.

## SceneMotionSpec

Every render-bound scene should carry a `SceneMotionSpec`.

Minimum fields:

- `scene_id`
- `render_mode`
- `renderer_family`
- `execution_runtime`
- `motion_source`
- `integration_mode`
- `dominant_anchor`
- `motion_stack`
- `proof_strategy`
- `subtitle_avoidance`
- `camera_intent`
- `frame_strategy`
- `distortion_policy`
- `subtitle_safe_region`
- `z_order_plan`

When VibeMotion contributed the motion, add:

- `candidate_skill`
- `vibemotion_candidate_ids`
- `candidate_origin`
- `state_trace_refs`
- `promotion_target_renderer_family`
- `remotion_promotion_notes`

When Hyperframes contributed the motion, add:

- `hyperframes_candidate_ids`
- `candidate_origin`
- `state_trace_refs`
- `promotion_target_renderer_family`
- `hyperframes_promotion_notes`
- `source_html_path` or equivalent source reference

When AI video contributed the motion, add:

- `ai_video_prompt_request_ids` while waiting for the user-generated file
- `ai_video_candidate_ids`
- `motion_source: "ai_video_generation"`
- `integration_mode: "video_plate"`
- `promotion_target_renderer_family: "remotion_component"`
- `remotion_integration_plan` in the linked candidate
- `proof_exclusion_policy` in the linked candidate

When screen recordings are used, add:

- `screen_recording_clip_ids`
- `motion_source: "existing_media"`
- `integration_mode: "video_plate"`
- `promotion_target_renderer_family: "remotion_component"`

Before lookdev, scenes may expose a VibeMotion option menu with `recommended`, `bold`, and `safe` choices. VibeMotion candidates must produce real review artifacts such as `.mp4`, `.mov`, `.html`, Remotion components, or transparent assets; text-only ideas are not lookdev evidence.

Before lookdev, Hyperframes may produce an option menu with the same `recommended`, `bold`, and `safe` choices. Hyperframes candidates must produce deterministic `.html`, `.mp4`, `.mov`, component source, or transparent assets; text-only prompts are not lookdev evidence. See [hyperframes-route-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\hyperframes-route-policy.md).

When `renderer_family` is `spark_3dgs`, the spec must also include:

- `spark_asset_need`
- `spark_asset_route`
- `spark_effect_route`
- `spark_runtime_profile`
- `world_asset`
- `route_status`
- `actual_renderer_family`
- `camera_path`
- `composite_role`
- `capture_policy`
- `fallback_strategy`
- `performance_budget`

See [spark-3dgs-world-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\spark-3dgs-world-route.md).

Spark route statuses must stay verifiable: `true_3dgs_asset`, `streaming_rad_world`, `procedural_splat_world`, `hybrid_spark_three`, `fallback_preview`, `blocked_missing_asset`, or `approved_fallback_final`. A procedural `constructSplats` plate is valid Spark work, but it is not a true 3DGS asset route. Spark should be selected only for real 3D model, 3DGS, spatial traversal, or world-asset needs.

## Recording-First Route

When the source is narration audio or a transcript, choose scene technology from `visual.recording_visual_brief.route_hints[]`. Use [recording-motion-routing.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\recording-motion-routing.md) before selecting VibeMotion or Spark.

## Screen Recording Route

When the source is a screen recording, choose either `evidence_clip` or `source_media_plate` from [screen-recording-routing.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\screen-recording-routing.md). The recording itself is existing media; Remotion handles crop, zoom, subtitles, callouts, redactions, and final composition.

## VisualPolicy Boundary

Render routing may use `VisualPolicy`, but it may not rewrite it.

If render execution needs a new visual component:

- raise a kit extension or upstream review
- do not invent a new family inside rendering
