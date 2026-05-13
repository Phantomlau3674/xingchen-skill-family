# Codex Runbook

The `xingchen_next_runner` Python CLI referenced in older docs does not exist. Codex executes the workflow directly by following this runbook.

The validator is the only mandatory command at every stage flip. Local execution stages may also use the persistent tools in [local-runtime-environment.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\local-runtime-environment.md), especially `xingchen-transcribe\scripts\transcribe_faster_whisper.py` for recording-first ingest and the Remotion adapter harness for render. Adapter usage follows [plugin-adapter-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\plugin-adapter-policy.md); Codex plugins, Claude Code local skills, local CLIs, and manual implementation lanes execute approved routes and must write trace records, but do not replace state.

---

## How to use this runbook

For each stage:

1. Confirm the **state paths required non-empty** all carry truthful values.
2. Confirm the **artifacts on disk required** all exist at the stated path.
3. If `[GATE]` is listed, pause and obtain explicit human approval before flipping `metadata.active_stage`.
4. Run the validator before flipping the stage. The validator enforces the cross-field rules from `cross-skill-invariants.md` and `renderer-families.md`.
5. Update `metadata.active_stage` to the next stage and append a `workflow.stage_history` entry.

Validator invocation, used at every checkpoint:

```
node C:\Users\liuzh\.codex\skills\xingchen-next\schema\validate-project-state.mjs path\to\project-state.json
```

---

## ingest

State paths required non-empty: `metadata.project_id`, `metadata.title`, `metadata.content_lane`, `metadata.created_at`, `sources.source_pack.core_thesis`, `sources.source_pack.audience`, `sources.source_pack.goal`, and at least one source material item (`links`, `screenshots`, `screen_recordings`, `notes`, `draft_recordings`, `existing_assets`, or `sources.transcript.segments`).
Artifacts on disk required: none at collection time. Before leaving source intake, media inputs such as screenshots, recordings, screen recordings, and existing assets must be reflected in `sources.asset_manifest[]`.
Gate: none — automatic.
Owning skill: `xingchen-asset-intake` (and `xingchen-transcribe` for recording-first projects).
Recording-first execution: use the persistent faster-whisper helper documented in [local-runtime-environment.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\local-runtime-environment.md) to create `transcript.tsv`, `recording-cleanup-report.md`, cleaned or accepted audio paths, `sources.transcript.segments`, and `sources.recording_correction`; do not install transcription dependencies into a temporary project folder. Recording correction is mandatory before visual design.
Next stage: `research/proof`.

## research/proof

State paths required non-empty: `sources.asset_manifest[]` for any media source inputs; `proof.claims` (≥1), `proof.evidence_items` (≥1, each with `claim_id`, `asset_id`, `evidence_type`, `visibility_requirement`, `allowed_usage`).
Artifacts on disk required: `sources.asset_manifest[*].file_path` files exist when referenced; `visual.screen_recording_brief.clips[*].media_path` files should exist before lookdev when screen recordings are used.
Gate: none — automatic.
Owning skills: `xingchen-editorial-room` (Topic Lock); `xingchen-proof-pack` (proof rules).
[GATE] **Topic Lock** — locks `thesis`, `audience`, `goal`. Sets INV-TOPIC-LOCK-FIRST.
Next stage: `script`.

## script

State paths required non-empty: `script.spoken_script.blocks` (≥1), `script.beat_map.scenes` (≥1).
Artifacts on disk required: none (export files are derived).
Gate: [GATE] **Script Lock** — locks spoken wording, narration spine, proof boundaries, beat truth. Sets INV-SCRIPT-LOCK-BEFORE-MOTHER.
Owning skill: `xingchen-script-polish`.
Next stage: `story-mother`.

## story-mother

State paths required non-empty: `mother.story_mother.thesis`, `mother.story_mother.scene_order` (≥1), `mother.story_mother.scene_cards` (≥1, each with `scene_id`, `scene_job`, `intent`, `proof_need`, `dominant_anchor`), `mother.story_mother.proof_binding`, `mother.story_mother.narration_spine`.
Artifacts on disk required: none.
Gate: [GATE] **StoryMother Lock** — sets INV-MOTHER-LOCK-BEFORE-VARIANT.
Owning skill: `xingchen-editorial-room`.
Next stage: `visual-direction`.

## visual-direction

State paths required non-empty: `visual.director_board.status` (`completed` or `manual_review_required`), `visual.director_board.board_md_path`, `visual.director_board.board_json_path`, `visual.director_board.global_director_thesis`, `visual.director_board.brainstorming_contract`, `visual.director_board.scene_boards[]` covering every StoryMother scene, `visual.director_board.scene_edge_boards[]` covering every adjacent StoryMother scene pair, `visual.director_board.component_registry_plan[]`, `visual.director_board.subtitle_system`, `visual.director_board.tech_stack_policy`, `visual.visual_policy.meta_concept`, `visual.visual_policy.taste_thesis`, `visual.visual_policy.selected_aesthetic_mode`, `visual.visual_policy.aesthetic_modes` (>=1 with `decision: "selected"`), `visual.lookdev_gate.path`, and `render.scene_motion_specs[]` covering the director plan. Recording-first projects must complete `sources.recording_correction` before director-board work and must also fill `visual.recording_visual_brief.route_hints[]` or `visual.recording_visual_brief.visual_opportunity_beats[]`. Media-source projects must fill `visual.source_material_plan[]`. Legacy `visual.material_director_pass` is compatibility evidence when present, but it is no longer the primary Visual Lock gate.
Artifacts on disk required: `visual-director-board.md`, `visual-director-board.json`, `art-direction.md`, `visual-language-kit.json`, `lookdev-gate.yaml` (paths recorded in state).
Gate: [GATE] **Visual Lock** — sets INV-VISUAL-LOCK-BEFORE-RENDER.
Owning sequence: `xingchen-director-board -> xingchen-art-direction -> xingchen-visual-compiler`.
Director board: `xingchen-director-board` reads the user's material page by page / beat by beat, reads corrected recording rhythm, binds material and narration to scenes, runs `superpowers/brainstorming` for each scene picture and scene-to-scene flow, designs each frame, chooses component/tech routes, and writes `visual.director_board` plus MD/JSON board artifacts.
Aesthetic system: `xingchen-art-direction` consumes the director board and writes whole-piece `visual.visual_policy`, `art-direction.md`, `visual-language-kit.json`, and `lookdev-gate.yaml`.
Compiler: `xingchen-visual-compiler` may only choose scene components and technical routes from `visual.director_board.scene_boards[].component_layer` and `.tech_stack_layer`. It must compile `scene_boards[].brainstorming_layer` into `render.scene_motion_specs[].brainstorming_trace`, `continuity_handles_used[]`, and `anti_ppt_decision`. It must compile `visual.director_board.scene_edge_boards[]` into `edge_in_trace`, `edge_out_trace`, and knowledge-continuity `transition_primitives[]`, or raise a kit extension request. `render.scene_motion_specs[]` must back-reference the director board scene and inherit safe regions, proof regions, and camera path for HTML 3D, Spark, and source-media routes.
Adapter pass: after scene specs exist, use Codex plugin skills when available, external APIs only when actually available, or Claude Code local skills / local CLI / manual implementation lanes when not. HyperFrames outputs must write `render.hyperframes_candidates[]` plus `render.plugin_adapter_runs[]`; Seedance-style manual generation starts as `render.ai_video_prompt_requests[]`, then the user-generated file is registered as `render.ai_video_candidates[]` plus `render.plugin_adapter_runs[]` and can only be promoted as a Remotion-controlled `video_plate`; Remotion implementation or promotion work must write `render.plugin_adapter_runs[]` and the affected `render.scene_motion_specs[]`, `render.jobs[]`, or render-pack paths.
HTML 3D route: when a scene board selects `html_3d`, apply [html-3d-scene-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\html-3d-scene-route.md). The route must say what the 3D camera/depth reveals.
Spark route: when a scene board selects `spark`, the board must include spatial/world reason, route status intent, and preview requirement before lookdev.
Pre-render scene composition pass: `xingchen-visual-compiler` runs `references/scene-composition-pass.md` after the director board and writes `frame_strategy`, `distortion_policy`, `anchor_region`, `proof_regions`, `subtitle_safe_region`, `z_order_plan`, source-material treatment, director-board backrefs, and route fields into each `render.scene_motion_specs[]` entry.
Next stage: `platform-adapt`.

## platform-adapt

State paths required non-empty: `variants[*].variant_id`, `variants[*].mother_id` (must trace to exactly one StoryMother), `variants[*].platform`, `variants[*].aspect`, `variants[*].hook`, `variants[*].subtitle_policy`.
Artifacts on disk required: none.
Gate: none — automatic. INV-NO-MOTHER-REWRITE-ON-VARIANT applies: any deviation must be recorded in `variants[*].scene_adjustments`.
Owning skill: `xingchen-visual-compiler` (variant-aware scene packaging).
Next stage: `lookdev`.

## lookdev

State paths required non-empty: `render.scene_motion_specs` (>=1, each render-bound scene should name `execution_runtime`, `motion_source`, and `integration_mode`), `render.plugin_adapter_runs[]` for every adapter-created or adapter-promoted artifact, `render.vibemotion_candidates` for every VibeMotion scene option menu, `render.hyperframes_candidates` for every Hyperframes HTML/canvas scene option menu, `render.ai_video_prompt_requests` for every prompt-only Seedance/manual generated-video handoff, and `render.ai_video_candidates` for every returned generated-video file (each candidate with `output_path`, `output_kind`, `review_status`, `candidate_origin`, and non-empty `state_trace_refs[]`; approved candidates must also include `integration_mode` and `promotion_target_renderer_family`).
Artifacts on disk required: at least one real preview artifact per scene with a candidate menu: `.mp4`, `.mov`, `.html`, Remotion component, HTML/canvas source, transparent asset, or generated-video plate (INV-NO-VIBEMOTION-FINAL / INV-NO-HYPERFRAMES-UNPROMOTED-FINAL / INV-AI-VIDEO-GEN-INSERT: text-only is not lookdev evidence). For any Spark-routed scene, a `SparkRoutePreview` composition output (`spark-route-preview.mp4` or equivalent) must exist and have been watched.
Gate: [GATE] **Lookdev Approval** — sets INV-LOOKDEV-BEFORE-RENDER. Status may be `approved`, `manual_review_required` (with explicit human override), or `failed`.
Owning skill: `xingchen-lookdev`. Audits run via `references/scene-composition-audit.md` (consumes the frame_strategy / distortion_policy / anchor_region / proof_regions / subtitle_safe_region / z_order_plan fields written by visual-compiler upstream).
Plugin evidence: every file named in `render.plugin_adapter_runs[].output_paths` is review evidence only after lookdev checks it against the director-board layers and the claimed state writebacks.
Validator: must pass with the active stage about to flip to `render`. It blocks unresolved `renderer_family: "vibemotion_candidate"`, unpromoted approved Hyperframes candidates, AI video candidates without safety/adapter trace/Remotion `video_plate` promotion, Hyperframes HTML/canvas scenes that do not preserve `execution_runtime: "html_browser_capture"`, and Spark scenes that do not preserve `execution_runtime: "spark_browser_canvas"`.
Next stage: `render`.

## render

State paths required non-empty: `render.jobs` (≥1, with `job_id`, `variant_id`, `status`, `lookdev_evaluation_id`, `lookdev_status`, `state_path`, `video_project_path`, `render_plan_path`, `output_path`). When `Remotion:remotion` is used for implementation, `HyperFrames by HeyGen:*` artifacts are promoted, or Seedance/API generated-video plates are promoted into render, the matching `render.plugin_adapter_runs[]` record must be `previewed` or `promoted` and point to the render job or scene spec it affected.
Artifacts on disk required (on completion): `render.jobs[*].silent_video_path`, `render.jobs[*].final_output_path`, `render.jobs[*].assembly_log_path`. When `assembly_mode` includes voice or BGM, those audio paths must exist too.
Gate: none — automatic after lookdev approval. INV-LOOKDEV-BEFORE-RENDER enforced by validator (active_stage = "render" requires Lookdev Approval status ≠ "pending").
Owning skill: `remotion-render-adapter` (executes); `xingchen-visual-compiler` writeback frozen.
Next stage: `publish`.

## publish

State paths required non-empty: `publish.records[*].publish_id`, `publish.records[*].variant_id`, `publish.records[*].platform`, `publish.records[*].published_at`.
Artifacts on disk required: cover image referenced by `publish.records[*].cover_ref` exists.
Gate: none — automatic.
Owning skill: out-of-family for now (manual upload acknowledged in state).
Next stage: `review`.

## review

State paths required non-empty: at least one of `review.lookdev_gate_results[*]` or `review.performance_reviews[*]`. Each performance review carries `review_id`, `publish_id`, `metric_summary`, `qualitative_findings`, `next_time_recommendations`.
Artifacts on disk required: none.
Gate: none — automatic.
Owning skill: out-of-family. Findings are non-destructive: shipped truth is not rewritten in place.
Loop: `next_time_recommendations` should inform the `ingest` stage of the next project, but is not auto-applied.

---

## Stage flip checklist

Before changing `metadata.active_stage`:

1. All required state paths above are non-empty.
2. All required artifacts on disk exist.
3. Any `[GATE]` for the current stage has the right `status` — never `pending`. Content locks (`Topic Lock`, `Script Lock`, `StoryMother Lock`, `Visual Lock`) require `approved`. `Lookdev Approval` accepts `approved` or `manual_review_required` (with explicit human override).
4. Validator passes: `node C:\Users\liuzh\.codex\skills\xingchen-next\schema\validate-project-state.mjs path\to\project-state.json` exits 0.
5. Append a `workflow.stage_history` entry: `{ stage, status, transitioned_at }`.
6. Update `metadata.updated_at`.

If validation fails or a gate is unresolved, set `workflow.blocked = true`, write a clear `workflow.blocking_reason`, keep `active_stage` at the current stage, and return control upstream.
