# Motion Blueprint Contract

## Purpose

`motion-blueprint.json` is a legacy or compatibility export for board-first motion handoff between visual packaging and render adaptation.

In Xingchen Next, primary truth stays in `project-state.json -> render.scene_motion_specs` plus render-pack exports such as `video-project.json`.

Use `motion-blueprint.json` only when the approved lookdev board should remain the primary plate and the motion layer should animate staged overlays instead of redrawing the whole scene.

## Scene Shape

Each scene entry should include:

- `motion_blueprint_id`
- `scene_id`
- `plate_mode`
- `plate_asset_id`
- `subtitle_treatment`
- `focus_regions`
- `modules`
- `connectors`
- `glyph_groups`
- `activation_track`
- `camera_beats`
- optional `outgoing_transition`
- optional `incoming_transition`
- optional `manual_overrides`

## Coordinate Rule

- normalize all coordinates against the approved board
- use `x`, `y`, `w`, `h` values in the `0-1` range
- do not emit renderer pixel values here

## Module Rule

Modules should describe the semantic pieces that deserve independent motion, for example:

- headline blocks
- chips
- panels
- CTA rows
- terminal strips
- proof callouts

Each module should carry a stable `module_id`, a semantic `kind`, a normalized region, and lightweight motion intent such as reveal direction and emphasis strength.

## Connector Rule

Connectors should describe how modules are visually related.

Allowed approaches:

- explicit normalized points when the path is already known
- logical `from_module_id` and `to_module_id` links when the adapter should derive the route

## Subtitle Rule

Subtitles are a support layer.

Use `subtitle_treatment` to tell render adapters where subtitles should go or what areas to avoid. Do not rebuild the board just to make room for default subtitles.

## Transition Rule

Transitions should describe intent, not renderer code.

Recommended shape:

- `type`
- `duration_ms`
- optional `direction`

Use outgoing transition as the default owner of a boundary unless review notes explicitly override the incoming side.

## What Not To Put Here

- Remotion composition ids
- fps
- pixel geometry tied to one renderer
- renderer component names
- final export settings
