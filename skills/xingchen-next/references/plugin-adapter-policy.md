# Plugin Adapter Policy

Runtime adapters provide domain craft, commands, and reusable implementation knowledge, but they do not become the Xingchen truth layer.

In the Codex app, `@hyperframes` and `@remotion` can be used as Codex plugin adapters. AI video platforms such as Seedance are usually manual handoff lanes here: Codex writes prompts, the user generates the video, and Codex registers returned files. External API calls are allowed only when an API is actually available and a director-board `gen_insert` route exists. In Claude Code, Codex plugins are not callable; use synced local skills, local CLI commands such as `npx hyperframes` / `npx remotion`, user-generated platform files, or manual implementation under the same state contract.

`project-state.json` remains canonical. The director board decides what a scene must express; the compiler decides which approved component and renderer route may be used; adapters help execute that route and must write their evidence back to state.

## Available Adapters

### HyperFrames by HeyGen

Use HyperFrames only after `visual.director_board` and `render.scene_motion_specs[]` already define the scene job, proof regions, safe regions, camera/depth intent, and promotion path.

Codex plugin skills when available:

- `HyperFrames by HeyGen:hyperframes` for HTML/CSS/GSAP/canvas candidate authoring.
- `HyperFrames by HeyGen:hyperframes-cli` for `npx hyperframes` lint, validate, inspect, preview, render, transcribe, TTS, or doctor checks.
- `HyperFrames by HeyGen:hyperframes-registry` for reusable blocks/components only when the director board and kit allow them.
- `HyperFrames by HeyGen:gsap` for GSAP timing/easing choreography inside a HyperFrames scene.
- `HyperFrames by HeyGen:website-to-hyperframes` only when a website URL is actual source material and the director board routes it as source or HTML/canvas candidate evidence.

HyperFrames may generate `render.hyperframes_candidates[]`, HTML/canvas scene source, transparent assets, or review clips. It may not own full-video assembly, final subtitles, final audio, proof meaning, or scene order.

### Remotion

Use Remotion implementation guidance whenever writing or debugging Remotion code, timeline timing, captions, audio, text fitting, 3D, charts, transitions, assets, or final composition. Prefer the Codex plugin rule files when available; in Claude Code use the synced local `remotion-render-adapter` skill plus local Remotion CLI/project docs.

Codex plugin skill when available:

- `Remotion:remotion` for Remotion/React video implementation guidance.

Remotion is the default final controller for timeline, subtitles, proof overlays, audio assembly, previews, and export. The adapter can guide implementation, but it may not rewrite `visual.director_board`, `visual.visual_policy`, proof meaning, or scene order.

### Seedance / AI Video API

Use Seedance-style platforms only when the director board selects `tech_stack_layer.primary_stack: "gen_insert"` and explains the bounded visual gap. The normal flow is prompt-only first: create `render.ai_video_prompt_requests[]`, let the user generate and download the file, then register the returned file. The output is a candidate video plate, never the proof layer or final controller.

Required outputs:

- Prompt handoff: `render.ai_video_prompt_requests[]` with provider/model hint, prompt pack path, prompt path/text, negative prompt, output expectation, current-state trace refs, proof exclusion policy, Remotion integration plan, and handoff instructions.
- Returned file: `render.ai_video_candidates[]` with provider/model, prompt request id when available, prompt path/text, negative prompt, output path, review status, current-state trace refs, proof exclusion policy, Remotion integration plan, and safety review.
- Returned file trace: `render.plugin_adapter_runs[]` with `adapter_kind: "manual_implementation"` and `adapter_id: "manual-ai-video-api"` when the user generated the file manually, or `adapter_kind: "external_api"` and `adapter_id: "seedance-api"` only when Codex actually called the API.

Seedance/API output may not contain readable claims, UI proof, subtitles, logos, faces, or false factual material. Remotion owns all captions, proof overlays, final timing, and export.

## State Writeback Contract

Every non-trivial adapter use that creates or promotes scene artifacts must append a `render.plugin_adapter_runs[]` record.

Required fields:

- `run_id`
- `adapter_kind`: `codex_plugin`, `local_cli`, `local_skill`, `manual_implementation`, or `external_api`
- `adapter_id`: concrete adapter identity, such as `hyperframes@openai-curated`, `remotion@openai-curated`, `hyperframes-cli`, `remotion-render-adapter`, `seedance-api`, `manual-ai-video-api`, or `manual-remotion-implementation`
- `plugin_id`: optional compatibility alias for Codex plugin adapter ids
- `skill_name`: the concrete plugin, local skill, CLI, or implementation lane used
- `scene_ids`: affected StoryMother scene ids
- `input_state_refs`: state paths the plugin consumed
- `output_paths`: created or inspected files; required once status is `generated`, `previewed`, `promoted`, or `rejected`
- `state_writebacks`: state paths changed or expected to change; required once status is `generated`, `previewed`, `promoted`, or `rejected`
- `status`: `planned`, `generated`, `previewed`, `promoted`, `rejected`, or `blocked`
- `candidate_ids`: related `render.hyperframes_candidates[]` or `render.ai_video_candidates[]` ids when applicable
- `promotion_target_renderer_family`
- `lookdev_evidence_required`
- `notes`

## Non-Conflict Rules

- Adapters cannot bypass `Visual Lock`; a valid director board is still mandatory.
- HyperFrames outputs that become review candidates must appear in `render.hyperframes_candidates[]`.
- Seedance/manual-platform outputs that become review candidates must appear in `render.ai_video_candidates[]`.
- Remotion implementation work that affects final render must trace through `render.scene_motion_specs[]`, `render.jobs[]`, or `render-plan.json`.
- An adapter run may only reference scene ids present in `mother.story_mother.scene_order[]`.
- An adapter run that writes `render.scene_motion_specs[]` must point back to `visual.director_board.scene_boards[scene_id]`.
- Lookdev treats adapter outputs as artifacts to audit, not as automatic approval.
