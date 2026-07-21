# VibeMotion Skill Inventory

## Source Snapshot

- repository: `https://github.com/vibe-motion/skills`
- reviewed commit: `2837561c8c28636636f8dfb5a77daea2b7490ff6`
- stable source audit: `C:\Users\liuzh\.codex\vendor_imports\video-runtimes\vibe-motion-skills`
- original temp checkout during integration: `%TEMP%\vibe-motion-skills` (disposable; do not rely on it for future review)

## Codex-Visible Copies

Local sibling skills under `../../<skill-name>`:

- `claude-typer`
- `light-spotlight-render`
- `procedural-fish-render`
- `remotion-3d-ticker`
- `remotion-vinyl-player`
- `ruler-progress-render`
- `svg-assembly-animator`
- `wechat-2d-render`

Some CLI profiles may omit `remotion-vinyl-player`; the sibling skill remains valid source material when it is installed under the same skills root.

## Use In Xingchen

Use VibeMotion as a motion-source and review-candidate layer. It is not a final renderer family.

Approved VibeMotion output must be promoted into a final renderer route with:

- `motion_source: "vibemotion_skill"`
- `candidate_origin`
- `state_trace_refs[]`
- `integration_mode`
- `candidate_skill`
- `promotion_target_renderer_family`

## No Fixed Templates

VibeMotion skills are allowed as current-project candidate generators and primitive references only. Do not use their demo compositions, HTML templates, default scenes, sample copy, or older project renders as the visible answer for a new Xingchen project.

Every `render.vibemotion_candidates[]` item must record:

- `candidate_origin: "generated_from_current_state"` when the source is generated directly from the current plan
- `candidate_origin: "primitive_reference_adapted_to_current_state"` when a local skill primitive is rewritten or parameterized for the current plan
- `state_trace_refs[]` pointing to the current StoryMother, visual policy, recording brief, scene decision, and SceneMotionSpec that produced the candidate

## Inventory By Technical Product

### Remotion Component Pattern

These skills provide reusable component ideas or source components that can be used directly, copied, or rewritten inside the final Remotion project.

| Skill | Product | Best use | Likely integration |
|---|---|---|---|
| `remotion-3d-ticker` | Remotion component pattern (`VerticalTicker.tsx`) | 3D ticker, scrolling gallery, infinite wall | `live_component`, `copied_component`, or `rewritten_component` into `remotion_component` |
| `remotion-vinyl-player` | Remotion component pattern (`VinylPlayer.tsx`) | audio metaphor, record/source object, premium loop | `live_component`, `copied_component`, or `rewritten_component` into `remotion_component` |

### Remotion Render Project Or Script

These skills create or run Remotion render projects/scripts. Their output can be a review clip, transparent asset, or source pattern for the final Remotion composition.

| Skill | Product | Best use | Likely integration |
|---|---|---|---|
| `claude-typer` | Remotion/CLI render against a typing scene; transparent ProRes MOV by default | prompt, terminal, transcript, AI-workflow typing | `transparent_asset_layer`, `video_plate`, or rewritten native component |
| `wechat-2d-render` | Remotion project/script with deterministic per-frame output | chat flow, message motion, social proof thread | `transparent_asset_layer`, `video_plate`, or rewritten native component |
| `procedural-fish-render` | Remotion render project from `vibe-motion/procedural-fish` | organic/procedural motion metaphor | `video_plate` or rewritten component if the pattern becomes core |
| `ruler-progress-render` | Remotion render project/script | progress, threshold, measurement, pressure build | `transparent_asset_layer`, `video_plate`, or rewritten native component |

### HTML / SVG / Transparent Asset Generator

These skills are useful when a browser animation or alpha asset is the fastest way to test motion. They should still be scheduled and layered by Remotion for final delivery.

| Skill | Product | Best use | Likely integration |
|---|---|---|---|
| `light-spotlight-render` | HTML/SVG/GSAP animation; browser-capturable plate | spotlight reveal, text/logo emphasis, voice beat accent | `captured_html_plate` or `transparent_asset_layer` |
| `svg-assembly-animator` | HTML5/GSAP SVG assembly; transparent PNG sequence export | explainable object construction, diagrams, mechanical reveal | `transparent_asset_layer`, `captured_html_plate`, or rewritten native component |

## Route Examples

VibeMotion candidate before lookdev:

```json
{
  "renderer_family": "vibemotion_candidate",
  "motion_source": "vibemotion_skill",
  "candidate_skill": "claude-typer"
}
```

Promoted final scene:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "vibemotion_skill",
  "integration_mode": "transparent_asset_layer",
  "candidate_skill": "claude-typer",
  "promotion_target_renderer_family": "remotion_component"
}
```

## Guardrail

`vibemotion_candidate` is allowed only as a review/lookdev transition. At `metadata.active_stage >= "render"`, the validator blocks unresolved `renderer_family: "vibemotion_candidate"` and blocks approved candidates without promotion metadata.
