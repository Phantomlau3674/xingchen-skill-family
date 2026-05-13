# Hyperframes Route Policy

Hyperframes is the AI-first HTML scene lane for Xingchen Next. It is useful when the fastest high-quality route is to let an agent author a deterministic HTML/CSS/GSAP/Anime/Lottie/Three scene and capture it as a video plate or promote it into Remotion.

It is not the default full-video controller. Remotion still owns final narration sync, subtitles, proof overlays, cross-scene timing, audio assembly, platform variants, and final delivery unless a project receives explicit upstream approval for a different final runtime.

## No Fixed Templates

Do not ship Hyperframes as a visual template, theme, reusable scene bundle, or default look. Hyperframes source must be generated per project from the approved `project-state.json`, StoryMother, VisualPolicy, SceneMotionSpec, proof boundaries, and current script timing.

Reusable code is allowed only as neutral adapter infrastructure: CLI invocation, candidate-record emission, deterministic validation, capture conventions, and tiny helper functions that do not impose layout, palette, typography, metaphor, or scene structure.

## When To Use

Prefer Hyperframes for:

- explanation-motion prototypes where DOM, SVG, GSAP, Anime, Lottie, or Three gives faster iteration than TSX-first Remotion code
- webpage, dashboard, CodePen-style, or HTML-native visual metaphors
- AI explainer scenes such as token conveyors, attention webs, RAG libraries, agent desks, model pipelines, comparison boards, and UI-like proof environments
- future editor-friendly scenes where DOM elements should remain inspectable, selectable, or reusable
- lookdev candidates that need real moving evidence before becoming final render specs

Avoid Hyperframes for:

- final full-video assembly, voice/BGM, subtitle layout, and platform delivery
- literal proof scenes where evidence geometry, crop, or region highlighting must stay under Remotion control
- generic background decoration that does not carry a scene job
- 3DGS, RAD, splat, or spatial world-asset routes; use Spark for those
- cases where Remotion already has a clean reusable component and the HTML route would duplicate it

## Route Fields

Hyperframes scenes must stay inside the existing renderer-family taxonomy.

Typical HTML plate:

```json
{
  "renderer_family": "html_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "promotion_target_renderer_family": "html_scene"
}
```

Typical canvas/WebGL plate:

```json
{
  "renderer_family": "canvas_scene",
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "promotion_target_renderer_family": "canvas_scene"
}
```

Typical Remotion-promoted asset:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "transparent_asset_layer",
  "promotion_target_renderer_family": "remotion_component"
}
```

## Candidate Records

Use `render.hyperframes_candidates[]` for real review artifacts produced by Hyperframes. They are lookdev evidence until approved and promoted.

When HyperFrames is used through a Codex plugin, local CLI, local skill, or manual implementation, also append `render.plugin_adapter_runs[]` per [plugin-adapter-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\plugin-adapter-policy.md). The adapter run must name the adapter kind/id, concrete skill or command lane, scene ids, input state refs, output paths, state writebacks, status, candidate ids, promotion target renderer family, and lookdev evidence requirement.

Each candidate should record:

- `candidate_id`
- `scene_ids`
- `option_type`: `recommended`, `bold`, or `safe`
- `generator`: normally `hyperframes`
- `technical_route`: `hyperframes_html`, `hyperframes_canvas`, `hyperframes_lottie`, `hyperframes_three`, or `hyperframes_asset`
- `source_path`
- `output_path`
- `output_kind`: `mp4`, `mov`, `html`, `component`, or `transparent_asset`
- `review_status`
- `motion_source: "hyperframes_runtime"`
- `candidate_origin`: `generated_from_current_state` or `primitive_reference_adapted_to_current_state`
- `state_trace_refs[]`: StoryMother, visual policy, scene decision, proof-boundary, script-timing, or SceneMotionSpec references that generated the candidate
- `integration_mode`
- `promotion_target_renderer_family`
- `selected_by_user`
- `promotion_rule`
- `notes`

Before `metadata.active_stage >= "render"`, every approved Hyperframes candidate must have `integration_mode`, `promotion_target_renderer_family`, `candidate_origin`, and `state_trace_refs[]`. A Hyperframes-sourced final scene must also carry matching route fields in `render.scene_motion_specs[]`.
The candidate's source should be project-local generated code, not copied from a standing template, unless the copied code is a neutral adapter helper with no visible creative decision.

## Lookdev Gate

Hyperframes candidates should pass:

- deterministic frame seek or repeatable capture at the target fps
- no runtime network dependency unless explicitly approved and pinned
- fonts and assets resolved locally or through approved asset URLs
- target aspect preview captured, not only shown in a desktop browser
- proof-safe z-order and subtitle-safe region if the scene will be composited under Remotion
- promotion notes explaining whether the result remains an HTML/canvas plate, becomes a transparent asset, or is rewritten as a Remotion component

## Failure Conditions

Block or reroute when:

- a Hyperframes scene tries to own the full video timeline, voice, subtitles, or final export by default
- a Hyperframes scene is copied from a fixed visual template instead of generated from the approved story and visual policy
- `motion_source: "hyperframes_runtime"` is present at render without `integration_mode` or `promotion_target_renderer_family`
- a Hyperframes candidate is present without a matching `render.plugin_adapter_runs[].candidate_ids[]` trace
- a Hyperframes HTML/canvas final scene uses a runtime other than `html_browser_capture`
- a screen recording is routed through Hyperframes instead of `existing_media`
- a Spark/world-asset scene is disguised as Hyperframes canvas
- the scene is a generic decorative background rather than a named scene job

## Adapter Handoff

The Remotion adapter should treat Hyperframes output as one of:

- a captured HTML/canvas plate scheduled under the final composition
- a transparent asset layer
- a video plate
- a rewritten/copied live component when that is safer for final timing

Remotion remains responsible for final subtitles, callouts, voice, BGM, proof overlays, and export.
