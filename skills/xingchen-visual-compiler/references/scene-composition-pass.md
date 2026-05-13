# Scene Composition Pass

Use this pass after the source material director pass and scene forces are known, before motion is chosen.

Its purpose is to lock how a scene occupies the frame so render work does not improvise crop, scale, or overlay placement under deadline pressure.

## Why This Exists

Recent failure mode:

- the scene thesis and motion intent were correct
- the final frame still felt wrong because proof plates were cropped badly, stretched, offset, or overlaid in the wrong place

This pass exists to stop that class of error before lookdev and final render.

## Required Order

For every scene, answer these in order.

### 0. Material And Rhythm Binding

Start from `visual.material_director_pass.scene_binding_plan[]` and `tech_stack_plan[]`.

Confirm:

- which source units this scene uses
- which narration refs or recording time ranges it follows
- what the material is meant to express
- what picture design has already been approved
- which source treatment is required: literal, magnified, rebuilt, texture, reference-only, or unused
- why the selected technical stack is justified

If this binding is missing, stop. Composition cannot be solved from a renderer prompt alone.

### 1. Truth Hierarchy

Lock which layer carries truth:

- literal proof pixels
- structural diagram
- headline
- emotional chrome

If literal proof pixels carry the claim, every later decision must protect those pixels first.

### 2. Plate Choice

Decide the base plate:

- screenshot
- terminal capture
- html scene
- chart
- illustration
- rebuilt code scene
- Spark real splat asset
- Spark procedural splat world
- Spark plus Three.js hybrid world

Record the source aspect ratio and source resolution.

If the plate is Spark-routed, also record whether the asset route is `true_3dgs_asset`, `streaming_rad_world`, `procedural_splat_world`, `hybrid_spark_three`, or fallback. The frame can be spectacular only after this truth route is explicit.

### 3. Frame Strategy

Choose exactly one:

- `contain`
- `cover`
- `focus-crop`
- `split-stage`
- `rebuild-from-data`

Do not leave this implicit.

If the plate is proof-heavy and the claim is pixel-readable, default toward `contain` or explicitly-approved `focus-crop`.

### 4. Dominant Anchor

Lock the one thing the eye should hit first.

Record:

- anchor label
- approximate normalized region
- why it wins

If two elements both need first-read priority, the scene is not solved yet.

### 5. Proof Regions

Mark all proof-critical regions that later overlays must respect.

At minimum record:

- primary proof region
- secondary proof region if any
- whether each region is `pixel-readable`, `presence-only`, or `abstractable`

### 6. Subtitle Safe Zone

Do not treat subtitle placement as a renderer afterthought.

Record:

- preferred subtitle zone
- forbidden overlap region
- fallback subtitle behavior if the default zone collides with proof

### 7. Z-Order Plan

Lock the layer stack before motion:

1. plate
2. proof highlight
3. headline
4. support chips
5. subtitles

If the layer order is unclear, motion will usually make the scene worse.

### 8. Camera Window

Decide what camera movement is allowed:

- static
- push-in
- lateral reveal
- rack focus simulation
- no camera motion

Record what the camera must never do, especially around proof.

### 9. Distortion Policy

State the red lines explicitly.

Typical policy:

- no non-uniform scaling on screenshots, proof, or UI
- no perspective skew on literal proof unless the scene is marked `presence-only`
- no decorative blur over proof-critical text
- no crop that removes the noun or action the claim depends on

### 10. Failure Plan

If the plate does not fit the frame truthfully, choose the fallback now:

- enlarge proof and reduce headline
- split stage instead of overlap
- rebuild the scene from structured elements
- reroute upstream because the scene cannot be solved honestly

Do not "just make it fit" at render time.

## Output Fields

This pass should feed state-backed scene motion or layout truth such as:

- `frame_strategy`
- `asset_fit_policy`
- `distortion_policy`
- `anchor_region`
- `proof_regions`
- `subtitle_safe_region`
- `z_order_plan`
- `camera_window`
- `geometry_risks`
- `spark_asset_route`
- `spark_effect_route`
- `spark_runtime_profile`
- `route_status`
- `actual_renderer_family`

## Red Flags

- proof screenshot is stretched to fill frame
- proof callout points to empty or decorative area
- subtitles sit on top of the proof noun or result
- crop removes the action that makes the screenshot meaningful
- support chips are more legible than the evidence
- camera motion makes the proof readable only when paused
- Spark procedural or fallback plates are described as true 3DGS assets
- `.rad` worlds are planned without paged streaming and LOD budget
- Spark spectacle competes with the subtitle safe zone or proof regions
