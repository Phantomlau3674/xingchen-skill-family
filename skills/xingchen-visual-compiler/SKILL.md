---
name: xingchen-visual-compiler
description: Use when approved story-mother scenes, platform variants, and visual policy need effect-first scene motion specs plus whitelist-respecting export views before graphing or render work.
---

# Xingchen Visual Compiler

## When to enter

Triggered during `visual-direction` (second half), after `xingchen-art-direction` exports `art-direction.md` / `visual-language-kit.json` / `lookdev-gate.yaml`, before `video-project-graph` and `xingchen-lookdev`. The job is effect-first scene packaging under the approved direction — never template-first. Do not mutate thesis, proof meaning, or platform strategy here. Do not invent a new visual language after Visual Lock.

Also require `project-state.json.visual.director_board` from `xingchen-director-board`. This skill consumes `visual.director_board.scene_boards[]` and turns board-approved component and technical-stack choices into executable scene motion specs. If the director board is missing, blocked, or generic, stop and send the work back upstream instead of inventing scene visuals from renderer taste.

## Stage owned

`visual-direction` (second half) and `platform-adapt` packaging | writeback: `project-state.json -> render.scene_motion_specs[]`, `project-state.json -> render.vibemotion_candidates[]` when candidates are generated, `project-state.json -> render.hyperframes_candidates[]` when HyperFrames candidates are generated, `project-state.json -> render.ai_video_prompt_requests[]` when Seedance/manual generated-video prompts are handed to the user, `project-state.json -> render.ai_video_candidates[]` when returned generated files are registered, and `project-state.json -> render.plugin_adapter_runs[]` for adapter-created or adapter-promoted artifacts. Exported review surfaces: `effect-brief.md`, `scene-direction.json`, `vibemotion-candidate-plan.json`, `ai-video-prompt-pack.md`, optional `kit-extension-request.md`, `lookdev-brief.md`, `candidate-manifest.json`.

## Ownership in family

Canonical owner of:

- **Director-board execution mapping** - reads `visual.director_board.scene_boards[]`, chooses only declared components/routes, and writes traceable render specs. It does not author or rewrite the director board.

- **VFX Director Pass** — defined and executed here. Writes `visual.visual_policy.vfx_director_pass` and mirrors per-scene decisions into `render.scene_motion_specs[]`.
- **VibeMotion Candidate Pass** — operational rules at [vibemotion-candidate-pass.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\vibemotion-candidate-pass.md). Other skills point to that file; they do not restate option rules or candidate shape.
- **Pre-render Scene Composition Pass** — runs here per [scene-composition-pass.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\scene-composition-pass.md). Audit-time counterpart in `xingchen-lookdev`; the handoff is the geometry fields written into `render.scene_motion_specs[]`.

## Ironclad rules

- Every scene's component and route choice must come from `visual.director_board.scene_boards[].component_layer` and `.tech_stack_layer`; visual-compiler may only compile, select declared fallbacks, or request extensions within that board.
- Every scene's picture choice must preserve `visual.director_board.scene_boards[].brainstorming_layer`: compile the selected direction, continuity handles, and `anti_ppt_decision` into the scene spec. Do not replace it with a centered-card/page-flip default.
- Every scene-to-scene transition must come from `visual.director_board.scene_edge_boards[]`. Compile the selected bridge into an explicit transition primitive; if the method cannot be implemented by the current shot library, raise `kit-extension-request.md`.
- Missing shot-library coverage for `component_layer.primary_component`, `supporting_components`, or `fallback_component` requires `kit-extension-request.md`; never invent silently or rename the board component to fit the current kit.

- Every scene's chrome component choice must map to (a) an entry in `visual-language-kit.json.chrome_components` AND (b) a shot name listed in [shot-library.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\shot-library.md). Needing something outside both is normal — raise `kit-extension-request`, never invent silently.
- INV-PROOF-FRAME-STRATEGY: literal proof or UI plates may not enter render without explicit `frame_strategy` and `distortion_policy`.
- HTML 3D scenes must follow [html-3d-scene-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\html-3d-scene-route.md). Use Remotion-native 3D for exact narration/proof timing, captured HTML/canvas plates for browser-native candidates, transparent 3D overlays only for non-proof accents, and Spark only for justified world assets.
- HyperFrames plugin skills in Codex, or local CLI/local skill/manual HyperFrames lanes in Claude Code, are allowed only as execution adapters after scene intent is locked. Every generated HTML/canvas candidate must write both `render.hyperframes_candidates[]` and `render.plugin_adapter_runs[]`; the adapter cannot become a template library or full-video controller.
- Seedance/manual AI video generation is allowed only when the director board selects `tech_stack_layer.primary_stack: "gen_insert"` with a bounded visual-gap reason. When no API is available, write `render.ai_video_prompt_requests[]` and `ai-video-prompt-pack.md/json` first. Only after the user returns a generated file should you write `render.ai_video_candidates[]` and `render.plugin_adapter_runs[]`. Final render specs must stay `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, and `promotion_target_renderer_family: "remotion_component"`.
- Remotion plugin guidance in Codex, or local `remotion-render-adapter`/manual Remotion implementation in Claude Code, may be used for implementation rules, captions, audio, timing, 3D, charts, transitions, and text fitting, but it does not decide scene purpose. Record implementation or preview use in `render.plugin_adapter_runs[]` when it creates or promotes artifacts.
- HTML 3D, Spark, and source-media specs inherit `frame_layer.subtitle_safe_region`, `frame_layer.proof_regions`, and `frame_layer.camera_path` from the matching director-board scene. Do not replace these with renderer defaults.
- INV-SPARK-NEEDS-ASSET: do not assign `spark_3dgs` to literal proof, UI, chart, terminal, PDF, number-inspection, or generic-background scenes. Procedural `constructSplats` plates use `procedural_splat_world`, never `true_3dgs_asset`.
- Custom motion beats must be written in relative terms (`durationFrames`, scene progress) — never frozen frame counts copied from older drafts. Otherwise scenes fight human-audio alignment.

Other shared rules: see [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md).

## Skill-local procedure

### Project-level direction (`effect-brief.md`)

Capture: clarity-vs-spectacle ratio, energy curve across the full piece, what audiences should trust vs feel, what stays calm even in energetic moments, how the approved `meta_concept` constrains every scene family, and the VFX Director pass result.

### Scene-level direction (`scene-direction.json` and `render.scene_motion_specs[]`)

Each scene carries the geometry-truth fields written into state: `scene_id`, `director_board_scene_id`, `scene_job`, `dominant_anchor`, `anchor_region`, `trust_source`, `spectacle_source`, `motion_verbs`, `camera_intent`, `frame_strategy`, `asset_fit_policy`, `distortion_policy`, `proof_regions`, `subtitle_avoidance`, `subtitle_safe_region`, `z_order_plan`, `proof_visibility`, `transition_owner`, `kill_list`, `fallback_strategy`, `chrome_components`, `timing_basis`, `anchor_dwell_ms` (default ~2000ms unless approved style argues otherwise), `onscreen_text_role`, `narration_alignment_notes`, `brainstorming_trace`, `continuity_handles_used`, `anti_ppt_decision`, `edge_in_trace`, `edge_out_trace`, `transition_primitives`, `scene_option_menu`, `selected_option_type`, `vibemotion_candidate_ids`, `hyperframes_candidate_ids`, `ai_video_candidate_ids`, `remotion_promotion_notes`, `spark_asset_need`. Each `render.scene_motion_specs[]` item must back-reference `visual.director_board.scene_boards[scene_id]`; the scene job, source treatment, timing basis, proof regions, subtitle safe region, camera path, component set, primary stack, brainstorming selected direction, and adjacent edge-board bridge must trace back to the board.

Renderer family choice follows [renderer-families.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\renderer-families.md). For Spark scenes also write `spark_asset_route`, `spark_effect_route`, `spark_runtime_profile`, `route_status`, `actual_renderer_family` per [spark-3dgs-world-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\spark-3dgs-world-route.md).

### Per-scene VibeMotion option menu

Before lookdev, every render-bound scene gets `recommended` / `bold` / `safe` options. If user does not select, default to `recommended` with `selected_by_user: false`. Generated candidates are real review artifacts (mp4/mov/html/component/transparent_asset) — text-only direction is not lookdev evidence. Full rules at [vibemotion-candidate-pass.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\vibemotion-candidate-pass.md).

### HyperFrames / Remotion plugin adapter pass

If a scene board selects `hyperframes` or an HTML/canvas candidate is useful, invoke HyperFrames through the current environment's adapter lane only: Codex plugin when available, otherwise Claude Code local CLI/local skill/manual implementation. The output must be project-local, deterministic, linked to the current scene spec, and registered as:

- `render.hyperframes_candidates[]` with `candidate_origin`, `state_trace_refs[]`, `source_path`, `output_path`, review status, and promotion fields when approved
- `render.plugin_adapter_runs[]` with the concrete plugin skill, scene ids, input state refs, output paths, state writebacks, status, candidate ids, and lookdev evidence flag

If Remotion plugin rules are used to implement or preview the scene package, append a `render.plugin_adapter_runs[]` entry that points to `render.scene_motion_specs[]`, `render.jobs[]`, or the render-pack state/export paths affected.

### Seedance / AI video prompt and adapter pass

If a scene board selects `gen_insert`, compile it as a bounded generated-video plate lane, not a final renderer. With no API, stop at a prompt pack until the user returns the generated file.

- keep the scene spec under Remotion: `render_mode: "gen_insert"` or `"mixed_scene"`, `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, `ai_video_prompt_request_ids[]`, and `promotion_target_renderer_family: "remotion_component"`
- create `render.ai_video_prompt_requests[]` with provider/model hint, prompt pack path, prompt path/text, negative prompt, proof exclusion policy, Remotion integration plan, output expectation, handoff instructions, current-state trace refs, and expected candidate id
- export `ai-video-prompt-pack.md` and `ai-video-prompt-pack.json` from [ai-video-prompt-pack.template.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\templates\ai-video-prompt-pack.template.md) / [ai-video-prompt-pack.template.json](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\templates\ai-video-prompt-pack.template.json)
- after the user supplies the video file, create `render.ai_video_candidates[]` with provider/model, `prompt_request_id`, prompt path/text, negative prompt, proof exclusion policy, Remotion integration plan, safety review, output path, review status, and `candidate_origin`
- after the user supplies the video file, create `render.plugin_adapter_runs[]` with `adapter_kind: "manual_implementation"` and `adapter_id: "manual-ai-video-api"` for manual platform generation, or `external_api` / `seedance-api` only if Codex actually called the API
- forbid generated readable claims, proof UI, subtitles, logos, faces, and false factual content; those belong to Remotion or source media

If the director board does not select `gen_insert`, do not write AI video prompts or call an AI video platform as a taste upgrade.

### Recording-first packaging

When narration is human-recorded: one-sentence scene job with one dominant anchor before flourish; onscreen text compresses claim or structure, not mirrors subtitles; lower-thirds support read path; prefer scene-specific metaphors over global chrome; visual anchor lands slightly early or exactly on the keyword beat; opening reorder allowed when the approved performance changed (cold-open bridge instead of forcing legacy scene order); custom beats in relative terms so scenes survive duration stretch.

### Operations order

1. Read `visual.director_board` and confirm every StoryMother scene has a matching `scene_boards[]` entry with source, arrangement, frame, component, subtitle, and tech-stack layers.
2. Confirm every scene board has a concrete `brainstorming_layer`, and every adjacent StoryMother scene pair has a `scene_edge_boards[]` entry with a selected bridge and transition method.
3. Read [scene-forces.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\scene-forces.md) and import approved `meta_concept` / `forbidden_list` / `allowed_chrome`.
4. Run scene-composition-pass before motion polish.
5. Run VFX Director pass before assigning renderer families.
6. Decide trust source vs spectacle source per scene from `scene_boards[].source_layer`, `.aesthetic_layer`, `.frame_layer`, and `.brainstorming_layer`, not from visual flourish.
7. Compile each `scene_edge_boards[]` transition into a named primitive (`KeywordRelay`, `ProofRegionRelay`, `DiagramMorph`, `ScaleShiftBridge`, `AxisHandoff`, `QuestionAnswerCut`, `ColorLogicCut`, `SubtitleToVisualBridge`, `HardCut`, or `BreathCut`) with out/in handles and acceptance text.
8. Write the per-scene option menu and run VibeMotion candidate pass.
9. Run HyperFrames, AI-video prompt handoff, returned-file registration, or Remotion adapter work only when the board route calls for it, then write `render.hyperframes_candidates[]`, `render.ai_video_prompt_requests[]`, `render.ai_video_candidates[]`, and/or `render.plugin_adapter_runs[]` as applicable.
10. Make frame strategy and distortion policy explicit before any proof asset enters the render path, inheriting board `proof_regions`, `subtitle_safe_region`, and `camera_path`.
11. Write scene motion intent back into state with `visual.director_board.scene_boards[scene_id]` and `visual.director_board.scene_edge_boards[edge_id]` back-references, then export review files.

## References

- [plugin-adapter-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\plugin-adapter-policy.md)
- [scene-forces.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\scene-forces.md)
- [attention-direction.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\attention-direction.md)
- [motion-verbs.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\motion-verbs.md)
- [shot-library.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\shot-library.md) — full catalog of 18 existing + 8 planned AI 科普 shot components, with dispatch rules and per-shot props
- [scene-composition-pass.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\scene-composition-pass.md)
- [vibemotion-candidate-pass.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\vibemotion-candidate-pass.md)
- [ai-video-prompt-pack.template.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\templates\ai-video-prompt-pack.template.md)
- [anti-template-rules.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\anti-template-rules.md)
- [design-system.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\design-system.md)
- [emphasis-sync.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\emphasis-sync.md)
- [proof-visibility.md](C:\Users\liuzh\.codex\skills\xingchen-proof-pack\references\proof-visibility.md) (owned by `xingchen-proof-pack`)
- [renderer-families.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\renderer-families.md)
- [spark-3dgs-world-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\spark-3dgs-world-route.md)
- [project-state-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\project-state-contract.md) — full `SceneMotionSpec` and `VibeMotionCandidate` field shape
