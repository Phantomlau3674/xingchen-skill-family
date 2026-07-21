# GSAP / HyperFrames Motion Lane

GSAP is useful for Xingchen only when it is kept in the right place: a
deterministic HTML/SVG/canvas candidate lane for scene motion, usually through
HyperFrames or a local HTML capture. It is not the final video controller.

This lane is a trigger, not a shelf. If a scene selects a DOM/SVG-heavy
HyperFrames route, create a GSAP timeline candidate first unless the board
records a concrete skip reason.

Remotion still owns the final timeline, subtitles, proof overlays, narration
sync, platform variants, audio assembly, and export.

## Good Uses

Prefer GSAP when a scene is easier to prototype or inspect as DOM/SVG:

- node graphs, flow maps, state machines, agent desks, RAG libraries
- dashboard or webpage-like source environments
- concept diagrams with staged reveals and connector motion
- SVG path drawing, staggered labels, and grouped object choreography
- mouse/path/camera-like HTML interactions that will be captured as a plate

GSAP is especially useful when the motion is the explanation: the order,
grouping, and timing reveal a semantic relationship.

## Bad Uses

Avoid GSAP when:

- Remotion already has a clean native component for the scene
- the scene is literal proof and needs exact crop, region, or source geometry
- the output is generic decorative motion with no scene job
- the scene needs final subtitles, voice timing, or full-video assembly
- the code would require runtime network assets that are not pinned locally

## Route Contract

GSAP work must enter the existing HyperFrames route:

```json
{
  "renderer_family": "html_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "promotion_target_renderer_family": "html_scene"
}
```

If rewritten into Remotion, the final scene should say:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "rewritten_component",
  "promotion_target_renderer_family": "remotion_component"
}
```

Every GSAP/HyperFrames candidate needs:

- project-local source path
- deterministic preview artifact
- `render.hyperframes_candidates[]`
- matching `render.plugin_adapter_runs[]`
- `candidate_origin`
- non-empty `state_trace_refs[]`
- promotion notes that say whether it stays HTML/canvas, becomes a plate, or
  is rewritten as Remotion
- `gsap_usage: "used"` or `gsap_usage: "skipped_with_reason"`
- `gsap_timeline_notes` naming the semantic reveal sequence

## Taste Gate

Borrow only the useful part of Taste Skill:

- `picture_variance`: how much layout structure changes scene to scene
- `motion_intensity`: how much movement the explanation needs
- `information_density`: how much readable information the viewport can carry

For Douyin/mobile outputs, density loses to readability:

- main subtitles: about 58-64 px
- scene thesis labels: about 44-52 px
- important node labels: about 38-46 px
- secondary labels cannot carry essential meaning

Semantic relationships must be stated directly. Do not make viewers decode a
loop, orbit, or clever connector when simple text can name the relationship.

## Implementation Notes

Use timelines instead of scattered delays. Prefer transform and opacity
animation. Kill timelines after capture. Keep all fonts and assets local or
explicitly approved.

Good GSAP primitives:

- `gsap.timeline({ defaults: { ease: "power2.out" } })`
- timeline labels for narration beats
- `stagger` for grouped labels or nodes
- `x`, `y`, `scale`, `rotation`, `autoAlpha`
- SVG path reveal when the path is the argument

Do not animate layout properties such as width, height, top, or left when
transforms can do the job.
