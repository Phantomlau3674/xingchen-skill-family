# Tech Stack Director Matrix

This matrix is used by `xingchen-director-board` before any renderer implementation. A stack is selected only when the source material, narration rhythm, frame design, and preview evidence justify it.

## Shared Selection Rules

- Choose the simplest stack that can express the scene's director job without losing proof readability.
- Record rejected stacks with concrete reasons. "Too complex" is insufficient unless it names what would break.
- Every non-Remotion route must still explain how Remotion or the final graph controls subtitles, audio, timing, proof overlays, and final assembly.
- Text-only route promises are not preview evidence.

## Remotion

Use when:

- the scene needs exact narration timing, captions, proof overlays, charts, UI rebuilds, or deterministic component animation
- the source material must remain legible and inspectable
- scene logic is compositional rather than spatial

Do not use as:

- a shortcut for generic text-card videos
- a reason to skip source-material interpretation

Acceptance:

- timeline can be previewed locally
- subtitle safe region and proof regions are explicit
- component props can be derived from the scene board
- if Remotion adapter guidance creates or promotes artifacts downstream, `render.plugin_adapter_runs[]` records the adapter kind/id and affected render state paths

## HTML 3D

Use when:

- a 3D card stack, proof plane, concept room, or camera-as-argument move reveals a relationship that flat layout cannot express
- the camera path itself makes the narration clearer
- depth creates hierarchy between proof, explanation, and subtitles

Do not use when:

- the only reason is "more advanced", "cinematic", "premium", or "looks cool"
- proof pixels would become unreadable
- subtitles or timing need exact Remotion-native control and no capture/promotion path is defined

Required board fields:

- `frame_layer.camera_path` states what the camera reveals and when
- `frame_layer.depth_plan` states foreground/midground/background purpose
- `tech_stack_layer.why_this_stack` explains the camera/depth argument
- `tech_stack_layer.preview_required` names browser or Remotion Three preview evidence

Acceptance:

- desktop and mobile browser preview is nonblank and framed
- camera motion does not hide proof or subtitles
- captured plate or Remotion Three component has a final integration path

## Hyperframes

Use when:

- an HTML/canvas/GSAP/Anime/Lottie candidate can explore an explanation-motion scene faster than native Remotion
- the output is a candidate artifact, not the final video controller
- the scene can be promoted into Remotion, HTML, canvas, component source, or transparent asset

Do not use when:

- subtitles, audio, and full-video timeline would be delegated to the candidate
- literal proof geometry must stay exact and no proof-preservation plan exists
- a fixed template is being dressed with different text

Acceptance:

- candidate artifact exists
- `candidate_origin` traces to current state
- promotion route is explicit before render
- when using HyperFrames through Codex plugin, local CLI, local skill, or manual implementation, `render.plugin_adapter_runs[]` links the adapter run to the generated `render.hyperframes_candidates[]` candidate ids

## Spark

Use when:

- the scene needs true 3DGS, procedural splat world, hybrid Spark+Three world, streaming RAD, world plate, or spatial traversal
- the viewer must move through a world or knowledge map to understand the argument
- procedural geometry materially expresses the thesis

Do not use when:

- the scene is ordinary proof, UI, chart, subtitle, generic background, generic transition, or just "high-end"
- source media must remain literal and inspectable

Required board fields:

- `frame_layer.camera_path` states the spatial traversal
- `frame_layer.depth_plan` names the world layers
- `tech_stack_layer.why_this_stack` includes a spatial/world reason
- `tech_stack_layer.integration_mode` names a Spark/browser canvas plate route
- `tech_stack_layer.preview_required` names `SparkRoutePreview` or equivalent
- downstream `render.scene_motion_specs[]` records `route_status`

Acceptance:

- Spark route status is honest: `true_3dgs_asset`, `procedural_splat_world`, `hybrid_spark_three`, `streaming_rad_world`, or approved fallback
- preview loads real world/procedural data
- subtitles and proof overlays remain controlled outside the Spark plate when needed

## VibeMotion

Use when:

- a motion primitive, generated transparent layer, or candidate clip can support a scene
- the result is reviewed before promotion
- Remotion or another final renderer remains the controller

Do not use when:

- it would rewrite the scene purpose
- it is selected as the final full-video controller
- it hides source material or changes proof meaning

Required board fields:

- `tech_stack_layer.integration_mode` includes `candidate`, `supporting`, `transparent_asset_layer`, or equivalent supporting-motion language
- `component_layer.primary_component` still names the final scene component or fallback

Acceptance:

- candidate artifact exists
- promotion target renderer family is explicit
- lookdev can approve or reject it without blocking the whole board

## Source Media

Use when:

- the original screenshot, screen recording, video, or audio-derived clip is itself evidence
- visual transformation would reduce trust or readability
- the viewer must inspect source pixels, order, cursor movement, or timing

Do not use when:

- the media is only texture and not meaningful evidence
- private or unreadable regions have not been reviewed

Acceptance:

- crop, redaction, zoom, proof region, and subtitle-safe region are named
- source pixels stay faithful
- Remotion treatment is explicit

## Gen Insert

Use when:

- there is a clear visual realism or concept-motion gap that code/components/source media cannot solve cleanly
- Seedance or another AI video platform can produce a bounded candidate plate for one scene or moment, usually through a prompt pack the user runs manually
- the generated image/video does not claim false evidence, readable proof, UI truth, subtitles, logos, faces, or source facts
- Remotion can own proof overlays, subtitles, timing, and final assembly above the generated plate

Do not use when:

- it would become the default visual language
- a source proof or UI asset needs literal inspection
- it replaces director thinking with a generic hero prompt
- it is merely "more cinematic", "more advanced", or a premium background

Required board fields:

- `source_layer.evidence_role` is `supporting`, `background`, or `none`, never `hero`
- `frame_layer.main_frame_design` says where the generated video sits relative to proof/subtitles
- `tech_stack_layer.integration_mode` names a Remotion-controlled `video_plate`
- `tech_stack_layer.why_this_stack` names the bounded visual gap and why generated video helps the scene's knowledge beat
- `tech_stack_layer.preview_required` requires both the generated motion preview and a Remotion composite preview

Acceptance:

- `render.ai_video_prompt_requests[]` records the prompt pack, prompt text, negative prompt, proof exclusion policy, Remotion integration plan, output expectation, and user handoff
- after the user returns a generated file, `render.ai_video_candidates[]` records provider/model, prompt request id, prompt path/text, negative prompt, proof exclusion policy, Remotion integration plan, safety review, output path, review status, and current-state trace refs
- `render.plugin_adapter_runs[]` records the manual returned-file registration or actual API adapter, candidate id, input state refs, output paths, and state writebacks
- generated insert role is bounded and does not contain proof or subtitles
- source/proof relationship is clear and remains in Remotion overlays or source media
- Remotion or final graph controls assembly, captions, proof overlays, and timing
