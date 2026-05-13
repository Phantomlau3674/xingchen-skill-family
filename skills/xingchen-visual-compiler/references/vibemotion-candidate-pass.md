# VibeMotion Candidate Pass

## Purpose

VibeMotion is the executable review-candidate layer for Xingchen Next.

It turns approved script and scene direction into viewable motion candidates before lookdev. It is not a template library, style label, primitive-only reference, or final renderer.

## Default Flow

For every render-bound scene:

1. Read the approved `StoryMother`, `scene_cards`, `beat_map`, `proof_binding`, and platform variant.
2. Write a three-option menu: `recommended`, `bold`, and `safe`.
3. Keep the scene thesis, evidence meaning, narration logic, and scene order unchanged.
4. Generate review candidates only after the option is selected or the default `recommended` option is allowed to proceed.
5. Record generated artifacts in `project-state.json.render.vibemotion_candidates[]`.

## Option Menu Contract

Each option should state:

- `option_type`: `recommended`, `bold`, or `safe`
- `visual_job`: what the viewer should believe, see, or remember
- `motion_design`: entrance, hold, exit, and transition behavior
- `technical_route`: `vibemotion_video`, `vibemotion_html`, `remotion_component`, or `spark_plate_plus_remotion`
- `generator_skill`: the VibeMotion skill or custom generator to use
- `risk_notes`: comprehension, proof, subtitle, or taste risk
- `candidate_output_kind`: `mp4`, `mov`, `html`, `component`, or `transparent_asset`

## Candidate Contract

Each generated candidate should include:

- `candidate_id`
- `scene_ids`
- `option_type`
- `generator_skill`
- `technical_route`
- `output_path`
- `output_kind`
- `review_status`
- `selected_by_user`
- `promotion_rule`
- `notes`

The default `promotion_rule` is `approved_candidate_may_be_compiled_into_remotion_final`.

## Available VibeMotion Routes

Use installed or source-available VibeMotion skills as executable generators:

- `wechat-2d-render`: chat/message motion candidates
- `claude-typer`: prompt or terminal typing candidates
- `remotion-3d-ticker`: 3D scrolling wall or infinite gallery candidates
- `ruler-progress-render`: measurement, progress, or threshold candidates
- `svg-assembly-animator`: vector assembly and speed/force transparent assets
- `light-spotlight-render`: text/logo reveal HTML candidates
- `procedural-fish-render`: organic procedural motion candidates
- `remotion-vinyl-player`: source-available Remotion component for spinning object/audio metaphor candidates
- `custom-vibemotion`: project-specific generator when no existing route fits

## Promotion To Final Render

VibeMotion output is review evidence first.

After lookdev approval, Remotion may promote the candidate as:

- a copied Remotion component
- a rewritten live component
- a captured HTML/canvas plate
- a video plate inside the final timeline
- a transparent asset layered into a larger Remotion scene

Do not treat a candidate as final delivery just because it renders.

## Guardrails

- Do not generate candidates that rewrite the script.
- Do not use one VibeMotion demo unchanged as a whole-scene answer unless the current project explicitly approves that reuse.
- Do not let VibeMotion override proof readability, subtitle safe zones, or approved geometry.
- Do not use Spark unless the option truly needs a 3D model, 3DGS asset, spatial traversal, or world plate.
- Do not approve text-only candidate descriptions in lookdev.
