# Recording Motion Routing

Use this after recording correction and speech-rhythm analysis have completed, and after the source material director pass has read the corrected recording rhythm and bound narration beats to StoryMother scenes. This file chooses route hints for motion execution; it does not replace the earlier page/beat-level director reading.

## Purpose

This file only governs recording-first videos: the user brings a narration take, transcript, or spoken draft and expects Xingchen Next to turn the voice into a richer口播 visual system.

The route starts from corrected voice evidence, not from a renderer menu. First identify what the voice is doing, then choose the visual job, then choose the runtime and motion source.

Do not use raw takes for visual design when `sources.recording_correction.status` is still `pending` or `blocked`. For voice-led recording-first projects, do not ignore `sources.speech_rhythm`; it is the timing evidence for pauses, rushed terms, flat runs, and anchor beats.

## State Writeback

Write the analysis into `project-state.json.visual.recording_visual_brief`:

```json
{
  "source_audio_ref": "",
  "speech_rhythm_ref": "",
  "voice_energy_curve": [],
  "pause_map": [],
  "emphasis_beats": [],
  "visual_opportunity_beats": [],
  "route_hints": [
    {
      "scene_id": "",
      "voice_signal": "",
      "visual_job": "",
      "execution_runtime": "remotion",
      "motion_source": "native_remotion",
      "integration_mode": "live_component",
      "candidate_skill": "",
      "promotion_target_renderer_family": "remotion_component",
      "reason": ""
    }
  ]
}
```

Allowed route taxonomy:

- `execution_runtime`: `remotion`, `spark_browser_canvas`, `html_browser_capture`, `source_media`
- `motion_source`: `native_remotion`, `vibemotion_skill`, `hyperframes_runtime`, `spark_runtime`, `bespoke_code`, `existing_media`
- `integration_mode`: `live_component`, `copied_component`, `rewritten_component`, `captured_html_plate`, `transparent_asset_layer`, `video_plate`, `browser_canvas_plate`

## Route Selection

### Native Remotion

Use Remotion as the default runtime when the scene needs precision:

- timed subtitles and karaoke emphasis
- exact proof screenshots, UI captures, charts, documents, and callouts
- structured explanation, argument steps, timelines, or number changes
- voice-synced evidence reveals
- final composition with voice, BGM, captions, overlays, and export

Typical route hint:

```json
{
  "execution_runtime": "remotion",
  "motion_source": "native_remotion",
  "integration_mode": "live_component",
  "promotion_target_renderer_family": "remotion_component"
}
```

### VibeMotion As Motion Source

Use VibeMotion when the voice beat calls for a reusable motion primitive or a fast reviewable motion candidate:

- typing, prompt, terminal, or transcript reveal: `claude-typer`
- chat/message flow: `wechat-2d-render`
- threshold, progress, ruler, measurement: `ruler-progress-render`
- SVG assembly or explainable object construction: `svg-assembly-animator`
- spotlight or text/logo reveal: `light-spotlight-render`
- infinite gallery, ticker, 3D wall: `remotion-3d-ticker`
- audio metaphor, record, disc, source object: `remotion-vinyl-player`
- organic/procedural motion plate: `procedural-fish-render`

VibeMotion output does not become final by itself. Record it as `motion_source: "vibemotion_skill"`, then promote it into the final renderer with one of:

- `live_component` when the output is a Remotion component used directly
- `copied_component` or `rewritten_component` when the component pattern is imported or reimplemented
- `captured_html_plate` when HTML is captured and composited
- `transparent_asset_layer` when alpha MOV/PNG sequence is layered in Remotion
- `video_plate` when a rendered clip becomes a background or insert plate

Typical route hint:

```json
{
  "execution_runtime": "remotion",
  "motion_source": "vibemotion_skill",
  "integration_mode": "transparent_asset_layer",
  "candidate_skill": "light-spotlight-render",
  "promotion_target_renderer_family": "remotion_component"
}
```

### Hyperframes As HTML Scene Source

Use Hyperframes when the voice beat wants an agent-authored HTML/canvas explainer that can be reviewed quickly:

- token conveyor, attention web, RAG library, agent desk, model pipeline, or GPU factory metaphor
- DOM/SVG/GSAP/Anime/Lottie motion that is easier to write as HTML than as a native Remotion component
- lightweight Three/canvas plates that explain a system without needing Spark world-asset provenance
- future editor-friendly scenes where DOM elements should remain inspectable

Hyperframes output does not become the full-video controller. Record it as `motion_source: "hyperframes_runtime"`, then promote it into `html_scene`, `canvas_scene`, or a Remotion-composited layer.

Typical route hint:

```json
{
  "execution_runtime": "html_browser_capture",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "promotion_target_renderer_family": "html_scene"
}
```

### Spark Runtime

Use Spark only when the recording has a real spatial reason:

- concept space, knowledge map, system orbit, archive, maze, market structure, or spatial traversal
- approved 3DGS asset, streaming RAD world, procedural splat world, or hybrid Spark+Three world plate
- the scene benefits from moving through a world, not just having a prettier background

Spark should output a browser canvas world plate. Remotion remains responsible for voice alignment, subtitles, proof callouts, overlays, and final delivery.

Typical route hint:

```json
{
  "execution_runtime": "spark_browser_canvas",
  "motion_source": "spark_runtime",
  "integration_mode": "browser_canvas_plate",
  "promotion_target_renderer_family": "spark_3dgs"
}
```

## 45-Second Dry Run Pattern

For a 45-second口播 dry run, use this minimum mix:

1. Native Remotion proof/subtitle scene: opening claim, exact subtitles, a chart or screenshot reveal, and proof-safe callout.
2. VibeMotion or Hyperframes motion-source scene: one voice-emphasis beat becomes a typed prompt, chat flow, spotlight reveal, ruler threshold, SVG assembly, token conveyor, attention web, or HTML-native explainer. Record candidate source and promotion target.
3. Spark world plate only if spatially justified: a concept map or world traversal that explains structure better than flat motion. Record `spark_browser_canvas`, `spark_runtime`, `browser_canvas_plate`, and keep the SparkRoutePreview gate.

If the third scene has no spatial reason, skip Spark and make the richness come from Remotion layout, evidence scale, typography rhythm, and one strong VibeMotion- or Hyperframes-derived motion layer.

## Failure Modes

- Choosing Spark for generic atmosphere.
- Treating VibeMotion as the final renderer instead of a candidate or component source.
- Treating Hyperframes as the full-video controller instead of an HTML/canvas scene source.
- Using HTML capture for exact proof when native Remotion can keep text, timing, and callouts controllable.
- Adding visual richness that ignores pauses, emphasis, or the spoken argument.
