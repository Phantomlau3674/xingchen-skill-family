# Dynamic Runtime Adapter Contract

This contract keeps Remotion, Hyperframes, VibeMotion, and Spark as execution lanes instead of visual templates.

## Core Rule

Every render-bound source file must be generated from the current project's approved state:

- `project-state.json`
- `mother.story_mother`
- `visual.visual_policy`
- `visual.scene_decisions`
- `render.scene_motion_specs`
- proof boundaries, safe regions, and subtitle policy
- current script, beat map, and platform variant

Do not use a standing scene bundle, theme, template, demo composition, or older project as the visible output. Reusable code may only provide neutral adapter behavior such as CLI invocation, validation, capture, deterministic helper functions, or primitive motion utilities that do not decide the creative look.

## Source Audit Location

External runtime/package source audits live under `C:\Users\liuzh\.codex\vendor_imports\video-runtimes`.

These audits verify package interfaces and upstream behavior. They are not project templates, and they are not bundled into skill packages.

## Runtime Lanes

### Remotion

Use Remotion for the final composition controller: formal timeline, voice/BGM, captions, proof overlays, z-order, platform variants, and final export.

Generated Remotion scene code must be compiled from `render-plan.json`; it must not silently reuse another project's scene design.

### Hyperframes

Use Hyperframes for project-local generated HTML/CSS/GSAP/Anime/Lottie/Three scenes. Its output may be:

- captured HTML/canvas plate
- transparent asset layer
- video plate
- rewritten/copied Remotion component

Required state trace:

- `render.hyperframes_candidates[].source_path`
- `render.hyperframes_candidates[].motion_source: "hyperframes_runtime"`
- `render.hyperframes_candidates[].candidate_origin`
- `render.hyperframes_candidates[].state_trace_refs[]`
- `render.scene_motion_specs[].source_html_path` or `hyperframes_candidate_ids[]`
- `integration_mode`
- `promotion_target_renderer_family`

### VibeMotion

Use VibeMotion as a project-local candidate source or primitive generator. Candidate outputs may inform final motion, but they must be promoted before render and must not impose a standing template.

Required state trace:

- `render.vibemotion_candidates[].generator_skill`
- `render.vibemotion_candidates[].output_path`
- `render.vibemotion_candidates[].motion_source: "vibemotion_skill"`
- `render.vibemotion_candidates[].candidate_origin`
- `render.vibemotion_candidates[].state_trace_refs[]`
- `render.scene_motion_specs[].candidate_skill`
- `vibemotion_candidate_ids[]` when available
- `integration_mode`
- `promotion_target_renderer_family`

### Spark

Use Spark only for spatial/world-asset scenes with explicit asset provenance. Spark output is a browser/canvas world plate; it does not own subtitles, proof overlays, voice, or final export.

## Adapter Review Checklist

Before render:

- source files are project-local generated code, not copied visual templates
- every candidate has a real preview artifact or source artifact
- every approved candidate records promotion metadata
- every final scene records runtime, motion source, integration mode, and promotion target
- proof scenes preserve geometry and safe regions
- generated source can be regenerated from state or has enough state trace to explain why it exists
