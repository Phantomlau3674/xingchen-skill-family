# Plugin Adapter Policy

Runtime adapters provide domain craft, commands, and reusable implementation knowledge, but they do not become the Xingchen truth layer.

In the Codex app, `@hyperframes` and `@remotion` can be used as Codex plugin adapters. AI video platforms such as Seedance are usually manual handoff lanes here: Codex writes prompts, the user generates the video, and Codex registers returned files. Local ComfyUI Wan2.2 is the machine-local image-to-video insert lane through `comfyui-wan-video`, not a cloud provider. External API calls are allowed only when an API is actually available and a director-board `gen_insert` route exists. In Claude Code, Codex plugins are not callable; use synced local skills, local CLI commands such as `npx hyperframes` / `npx remotion`, user-generated platform files, or manual implementation under the same state contract.

`project-state.json` remains canonical. The director board decides what a scene must express; the compiler decides which approved component and renderer route may be used; adapters help execute that route and must write their evidence back to state.

## Available Adapters

### Open Design Original Skills

Use installed Open Design original skills as local design references,
HTML/HyperFrames candidate generators, web-artifact checklists, and frame
archetype prompts. They are not renderer authorities and they do not replace
Xingchen planning.

Source:

- Active skills: `../../<skill-name>/SKILL.md`
- Full raw snapshot: `../../open-design-original/snapshot/skills/<skill-name>/SKILL.md`
- Snapshot commit: `d5aeab77fc4e5c81506b379ce35b88bbb31ffae1`

Before using one, read the original skill file and follow
[open-design-original-skill-intake.md](./open-design-original-skill-intake.md).

Adapter identity:

- `adapter_kind`: `local_skill` when an active installed skill is invoked, or
  `manual_implementation` when the snapshot is only consulted as reference.
- `adapter_id`: `open-design-original:<skill-name>@d5aeab77fc4e`.
- `skill_name`: `open-design-original`.
- Concrete original skill name: keep it in `adapter_id`, `notes`, and the
  `open_design_original_skill_intake.skills_considered[]` record.

Typical promotion targets:

- frame/video skills -> `render.hyperframes_candidates[]` first, then a
  Remotion-owned plate/component if approved.
- design-system skills -> `visual.visual_policy`, `art-direction.md`, or
  lookdev checklist language, not proof meaning.
- web-artifact skills -> project-local HTML/browser candidates, not final
  assembly.
- provider-wrapper skills -> prompt packs or manual handoff only after an
  approved gen-insert route exists.

Every concrete artifact must trace through `render.plugin_adapter_runs[]` with
scene ids, input state refs, output paths, state writebacks, candidate ids when
applicable, promotion target renderer family, lookdev evidence requirement, and
notes naming selected/rejected Open Design traits.

### HyperFrames by HeyGen

Use HyperFrames only after `visual.director_board` and `render.scene_motion_specs[]` already define the scene job, proof regions, safe regions, camera/depth intent, and promotion path.

Codex plugin skills when available:

- `HyperFrames by HeyGen:hyperframes` for HTML/CSS/GSAP/canvas candidate authoring.
- `HyperFrames by HeyGen:hyperframes-cli` for `npx hyperframes` lint, validate, inspect, preview, render, transcribe, TTS, or doctor checks.
- `HyperFrames by HeyGen:hyperframes-registry` for reusable blocks/components only when the director board and kit allow them.
- `HyperFrames by HeyGen:gsap` for GSAP timing/easing choreography inside a HyperFrames scene.
- `HyperFrames by HeyGen:website-to-hyperframes` only when a website URL is actual source material and the director board routes it as source or HTML/canvas candidate evidence.

HyperFrames may generate `render.hyperframes_candidates[]`, HTML/canvas scene source, transparent assets, or review clips. It may not own full-video assembly, final subtitles, final audio, proof meaning, or scene order.

GSAP is not just a named dependency. For DOM/SVG-heavy HyperFrames scenes, the adapter run should either produce a GSAP timeline candidate or record `gsap_usage: "skipped_with_reason"` in the candidate notes. This prevents the system from repeatedly declaring GSAP available while falling back to static or generic TSX motion.

### Remotion

Use Remotion implementation guidance whenever writing or debugging Remotion code, timeline timing, captions, audio, text fitting, 3D, charts, transitions, assets, or final composition. Prefer the Codex plugin rule files when available; in Claude Code use the synced local `remotion-render-adapter` skill plus local Remotion CLI/project docs.

Codex plugin skill when available:

- `Remotion:remotion` for Remotion/React video implementation guidance.

Remotion is the default final controller for timeline, subtitles, proof overlays, audio assembly, previews, and export. The adapter can guide implementation, but it may not rewrite `visual.director_board`, `visual.visual_policy`, proof meaning, or scene order.

### ReactBits Reference Library

ReactBits is not a Codex plugin adapter in this workflow. Use it only as a component/effect reference source for Remotion-native rewrites, HyperFrames/HTML candidates, or kit-extension requests. Follow [reactbits-remotion-upgrade.md](../../xingchen-visual-compiler/references/reactbits-remotion-upgrade.md): the final scene still needs director-board intent, proof-safe regions, subtitle-safe regions, and frame-driven timing.

### Seedance / Veo / AI Video API

Use Seedance-style or Veo-style platforms only when the director board selects `tech_stack_layer.primary_stack: "gen_insert"` and explains the bounded visual gap. The normal flow is prompt-only first: create `render.ai_video_prompt_requests[]`, let the user generate and download the file, then register the returned file. The output is a candidate video plate, never the proof layer or final controller.

Veo-style request packs use `provider: "veo_video_generation"` and a configurable `provider_model_hint`; do not hard-code a future model id into the state contract. First try global assets and stock footage. If those fail, use imagegen for a clean input plate when appropriate, then create a Veo-style image-to-video or text-to-video request only for short bounded motion.

Required outputs:

- Prompt handoff: `render.ai_video_prompt_requests[]` with provider/model hint, prompt pack path, prompt path/text, negative prompt, output expectation, current-state trace refs, proof exclusion policy, Remotion integration plan, and handoff instructions.
- Returned file: `render.ai_video_candidates[]` with provider/model, prompt request id when available, prompt path/text, negative prompt, output path, review status, current-state trace refs, proof exclusion policy, Remotion integration plan, and safety review.
- Returned file trace: `render.plugin_adapter_runs[]` with `adapter_kind: "manual_implementation"` and `adapter_id: "manual-ai-video-api"` or `"manual-veo-video-generation"` when the user generated the file manually, or `adapter_kind: "external_api"` with `adapter_id: "seedance-api"` / `"veo-video-api"` only when Codex actually called the API.

Seedance/API output may not contain readable claims, UI proof, subtitles, logos, faces, or false factual material. Remotion owns all captions, proof overlays, final timing, and export.

### Local ComfyUI Wan2.2

Use local Wan2.2 only when the director board selects `tech_stack_layer.primary_stack: "gen_insert"` and explains a bounded image-to-video visual gap. The active lane is [local-wan-video-insert-lane.md](./local-wan-video-insert-lane.md). The execution skill is `comfyui-wan-video`.

Adapter identity:

- `adapter_kind`: `local_skill` when routing through the skill, or `local_cli` when calling the submit script directly.
- `adapter_id`: `comfyui-wan22-ti2v`.
- `skill_name`: `comfyui-wan-video`.
- `provider`: `other_ai_video`.
- `provider_model_hint` / `provider_model`: `local_comfyui_wan22_ti2v_5b`.

Required outputs:

- Prompt request: `render.ai_video_prompt_requests[]` with `technical_route: "image_to_video"`, prompt path/text, negative prompt, proof exclusion policy, Remotion integration plan, and state trace refs.
- Returned file: `render.ai_video_candidates[]` with output path under `C:\comfyui\output`, safety review, proof exclusion policy, and `integration_mode: "video_plate"`.
- Adapter trace: `render.plugin_adapter_runs[]` with candidate ids, output paths, state writebacks, status, and lookdev evidence requirement.

Wan output may not contain readable claims, UI proof, subtitles, logos, faces, or false factual material. Remotion owns all captions, proof overlays, final timing, and export.

### World Labs Marble

Use Marble only when the director board selects a Spark/world-asset route and explains the spatial reason. Marble may create a world asset, but Spark/Remotion still own preview and composition.

Adapter ids:

- `world-labs-api`: Codex actually calls the World Labs API.
- `marble-web-export`: the Marble web app/export UI creates the file.
- `manual-marble-export`: the user provides downloaded Marble files.

Required output trace:

- `render.plugin_adapter_runs[]` with `adapter_kind: "external_api"` for `world-labs-api`, or `adapter_kind: "manual_implementation"` for web/manual export.
- `promotion_target_renderer_family: "spark_3dgs"`.
- `state_writebacks` includes `render.scene_motion_specs`.
- `output_paths` lists exported SPZ/PLY/GLB/pano files once status is not `planned` or `blocked`.

Marble output does not use `render.ai_video_candidates[]`. SPZ/PLY/splat exports become Spark `true_3dgs_asset` only after approval; GLB exports are `hybrid_spark_three`; panoramas and PNGs are fallback plates. See [world-labs-marble-intake.md](./world-labs-marble-intake.md).

### Visual Preprocess Lane

Use the visual preprocess lane for local depth, mask, upscale, repair, interpolation, or 2.5D camera artifacts. These outputs go into `render.visual_preprocess_assets[]`, not AI-video candidates and not Spark assets.

Adapter ids:

- `visual-preprocess-lane`: combined local pipeline.
- `depth-anything-v2-small`: depth-only run.
- `mobilesam`: foreground/text-safe mask run.
- `realesrgan-ncnn-vulkan`: upscale/deblocking run.
- `gfpgan`: non-proof face/image repair run.
- `rife-lite`: short interpolation run.
- `local-visual-preprocess`: project-local script/manual helper.

Required output trace:

- `render.plugin_adapter_runs[]` with `adapter_kind: "local_cli"`, `"local_skill"`, or `"manual_implementation"`.
- `promotion_target_renderer_family: "remotion_component"`.
- `candidate_ids[]` lists the related `render.visual_preprocess_assets[].asset_id` values.
- `state_writebacks` includes `render.visual_preprocess_assets`.

Preprocessing outputs never rewrite proof. Remotion owns proof overlays, readable claims, subtitles, labels, audio sync, and final composition. See [visual-preprocess-lane.md](./visual-preprocess-lane.md).

## State Writeback Contract

Every non-trivial adapter use that creates or promotes scene artifacts must append a `render.plugin_adapter_runs[]` record.

Required fields:

- `run_id`
- `adapter_kind`: `codex_plugin`, `local_cli`, `local_skill`, `manual_implementation`, or `external_api`
- `adapter_id`: concrete adapter identity, such as `hyperframes@openai-curated`, `remotion@openai-curated`, `hyperframes-cli`, `remotion-render-adapter`, `seedance-api`, `manual-ai-video-api`, `comfyui-wan22-ti2v`, `world-labs-api`, `marble-web-export`, `manual-marble-export`, `visual-preprocess-lane`, `depth-anything-v2-small`, `mobilesam`, `realesrgan-ncnn-vulkan`, `gfpgan`, `rife-lite`, `local-visual-preprocess`, or `manual-remotion-implementation`
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
- Seedance/manual-platform/local Wan outputs that become review candidates must appear in `render.ai_video_candidates[]`.
- Marble/World Labs outputs must write Spark world-asset fields in `render.scene_motion_specs[].world_asset` and pass the SparkRoutePreview gate before final render.
- Visual preprocessing outputs must appear in `render.visual_preprocess_assets[]` and stay under Remotion composition control.
- Remotion implementation work that affects final render must trace through `render.scene_motion_specs[]`, `render.jobs[]`, or `render-plan.json`.
- An adapter run may only reference scene ids present in `mother.story_mother.scene_order[]`.
- An adapter run that writes `render.scene_motion_specs[]` must point back to `visual.director_board.scene_boards[scene_id]`.
- Lookdev treats adapter outputs as artifacts to audit, not as automatic approval.
