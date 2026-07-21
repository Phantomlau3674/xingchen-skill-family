# Render Plan Contract

## Input Assumption

`project-state.json` and the exported `video-project.json` render pack are already approved and structurally valid.

If wording, proof meaning, or scene order is still unsettled, stop and send the change upstream.

## Minimum Output

`render-plan.json` should include:

- `meta`
- `globals`
- `scenes`

## `meta`

Minimum fields:

- `project_id`
- `title`
- `profile_id`
- `aspect`
- `state`
- `variant_id`
- `source_state_version`
- `render_route`
- `composition_id`
- `review_sheet_id`
- `width`
- `height`
- `fps`
- `scene_count`
- `duration_s`

## Scene Mapping

Each render-plan scene should preserve:

- the upstream `scene_id`
- the same narration and headline meaning
- the approved duration
- proof annotations when proof matters
- any upstream `director_state` needed for rendering

## Render-Plan V2 Fields

Each render-plan scene should include renderer-facing direction such as:

- `renderer_recipe`
- `renderer_family`
- `anchor_strategy`
- `motion_stack`
- `camera_path`
- `transition_profile`
- `subtitle_policy`
- `proof_strategy`
- `live_mode`
- `render_mode`
- `vibemotion_candidate_ids`
- `candidate_promotion_mode`
- `frame_strategy`
- `asset_fit_policy`
- `distortion_policy`
- `anchor_region`
- `proof_regions`
- `subtitle_safe_region`
- `z_order_plan`

These are renderer fields. They must be derived from approved upstream direction, not used to rewrite story truth.

When a scene promotes VibeMotion work, `candidate_promotion_mode` should be one of:

- `copied_component`
- `rewritten_live_component`
- `captured_html_canvas_plate`
- `video_plate`
- `transparent_asset_layer`

Only candidates approved by lookdev should be promoted into the final Remotion render plan.

When `renderer_family` is `spark_3dgs`, the scene should also carry:

- `world_asset`
- `composite_role`
- `capture_policy`
- `fallback_strategy`
- `performance_budget`
- `asset_license` when provenance is not obvious

The adapter should treat Spark as a browser/canvas world plate and keep captions, callouts, voice, and final audio assembly outside Spark.

## Geometry Rule

Render plans must preserve approved geometry truth.

Required behaviors:

- literal proof and UI captures keep source aspect ratio unless upstream explicitly approved a crop
- non-uniform scaling is forbidden for screenshots, terminals, and proof plates
- `frame_strategy` must be explicit, for example `contain`, `cover`, `focus-crop`, or `split-stage`
- callouts must attach to approved proof regions, not guessed regions created during render
- subtitle placement must respect the approved safe region
- if a plate cannot fit honestly, fail or reroute upstream instead of improvising distortion

## Dynamic Render Requirement

Final render plans should record how each scene stays live until export.

`code_primary` is the default route.

Recommended `live_mode` values:

- `component-animation`
- `html-scene`
- `proof-capture`
- `canvas-scene`
- `vibemotion-promoted-candidate`

Use `canvas-scene` or `html-scene` for `spark_3dgs`.

Not acceptable as the default final mode:

- `preview-still`
- `contact-sheet`
- concatenated lookdev PNGs
- theme-level scene reuse that was never re-approved for the current project
- full-project fallback to generated video because one insert looked good

## Primitive Rule

Reusable motion bundles may be used as primitive libraries.

They must not become the default answer for a new project unless the current project explicitly re-approves the full bundle.

## Incremental Render Guidance

If upstream graph data includes scene render-state metadata:

- keep the scene cache traceable by `scene_id` and `source_hash`
- allow clean reuse of unchanged scenes
- rebuild final assembly after cache reuse or partial rerender
- do not silently reuse stale scenes after upstream direction changes
