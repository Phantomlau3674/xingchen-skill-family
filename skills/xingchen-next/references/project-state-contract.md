# Project State Contract

## Mode Resolution

New projects use `mode: "lean"` and the Lean schema, template, and validator.

Use `mode: "extended"` only for legacy projects, multi-party production, high-risk audit needs, complex platform matrices, custom 3D/world pipelines, or an explicit user request.

Absence of `mode` in a historical `XingchenNextProjectState` means `extended`. Do not migrate an active legacy project merely to satisfy the new default.

## Lean Canonical Shape

Lean state remains canonical, but it stores decisions that affect the film rather than every internal thought.

Required top-level fields:

- `kind`
- `version`
- `mode`
- `metadata`
- `workflow`
- `brief`
- `script`
- `visual_policy`
- `scenes`
- `delivery`

### `metadata`

Keep:

- `project_id`
- `title`
- `platform`
- `format`
- `active_stage`
- `stage_status`
- `created_at`
- `updated_at`

`format.profile` makes the canvas choice explicit. Supported defaults are `douyin-horizontal-1920x1080`, `douyin-vertical-1080x1920`, and `custom`.

### `brief`

Keep:

- `thesis`
- `audience`
- `goal`
- `sources[]`
- `claims[]`

Every source needs an id, kind, reference, and proof eligibility. Every factual claim needs source ids. Generated media must set `proof_eligible: false`.

### `script`

Keep:

- `spoken_text`
- `audio_ref`
- `timing_basis`
- `timeline_revision`
- `beats[]`
- `content_approved`

Replace estimated timing with actual recording or subtitle timing before preview review.

Start `timeline_revision` at `1` when Content Lock establishes the first real speech and structure baseline. Increment it after speech, beat, timing, or A-roll structure changes. Downstream scene implementations and previews must match it.

### `scenes[]`

Each scene keeps:

- `scene_id`
- `beat_id`
- `knowledge_change`
- `dominant_visual`
- `motion_action`
- `proof_ref`
- `safe_region`
- `timing`
- `implementation`
- `semantic_relation`

`safe_region` protects both sides of a composite: `must_not_cover` names target-frame regions and `source_must_preserve` names source content that crop or cover must not destroy. Implemented scenes record the matching `implementation.timeline_revision`.

Optional resource searches, rejected concepts, adapter traces, and expanded art direction belong under `extensions` only when they affect execution or are required by Extended mode.

When `implementation.visual_kind` is `diagram`, `semantic_relation` must name `big_question`, `small_question`, and `relationship`. Other scenes may set it to `null`.

### `visual_policy`

Keep:

- `creator_avatar`
- `reference_style`

`creator_avatar` defaults to reusing `C:\Users\liuzh\Pictures\04_AI生成图片\2026-05\ChatGPT Image 2026年5月7日 15_14_14.png`. Skipping requires a concrete reason.

`reference_style.selected` defaults to `false`. When a reference style is selected, record its source, selection reason, selected traits, and avoid-copying list. Selection activates only that style's conditional checks.

### `delivery`

Keep:

- `status`
- `critical_previews[]`
- `full_preview`
- `preview_review`
- `platform_draft`
- `final_path`
- `cover_path`
- `learning`

Use [preview-quality-scorecard.md](preview-quality-scorecard.md) for `preview_review`.

Each critical preview uses one unique role from `hook`, `hardest-proof`, and `payoff`. It keeps two decodable rendered candidates with different hypotheses by default, or three when a documented tradeoff remains unresolved, the selected candidate id and path, a viewing reason, accepted audio, positive duration, `phone-downsample` viewport, current timeline revision, and review time. `full_preview` records equivalent timing and revision evidence for the complete piece. The historical `platform_draft` field may record local real-device playback; it does not authorize upload.

`preview_review.revision_log[]` records real before/after repairs by semantic interval. Numeric scores are optional diagnostics, not release authorization.

`delivery.status` progresses through `not-started`, `approved-to-render`, `rendering`, `rendered`, and `delivered`.

Entering `final-delivery` requires valid decodable preview evidence and `Preview Lock`; completing it requires a decodable final video with audio and `delivery.status: "delivered"`.

### `workflow`

Lean approvals contain only:

- `Content Lock`
- `Preview Lock`

Use [approval-contract.md](approval-contract.md).

## Lean Files

- template: `templates/project-state.lean.template.json`
- schema: `schema/project-state.lean.schema.json`
- validator: `schema/validate-lean-project-state.mjs`

## Extended Compatibility Contract

Everything below describes the historical Extended state. It remains valid for `mode: "extended"` and legacy states without a mode field. It does not add required fields or approval gates to Lean projects.

### Canonical File

Every new Xingchen Next project should maintain:

- `project-state.json`

This file is the single source of truth.

Derived review surfaces and export packs may exist, but once state exists they do not outrank it.

## Minimum Top-Level Shape

- `kind`
- `version`
- `metadata`
- `workflow`
- `sources`
- `proof`
- `script`
- `visual`
- `mother`
- `variants`
- `render`
- `publish`
- `review`
- `exports`

## `metadata`

Minimum fields:

- `project_id`
- `title`
- `content_lane`
- `default_language`
- `quality_mode`
- `default_platform`
- `active_stage`
- `created_at`
- `updated_at`

## `workflow`

This section owns stage status and approvals.

Minimum fields:

- `stage_history`
- `approvals`
- `blocked`
- `blocking_reason`

`workflow.approvals` should include, at minimum:

- `Topic Lock`
- `Script Lock`
- `StoryMother Lock`
- `Visual Lock`
- `Lookdev Approval`

## `SourcePack`

Store input reality in `sources.source_pack`.

Minimum fields:

- `core_thesis`
- `audience`
- `goal`
- `links`
- `screenshots`
- `screen_recordings`
- `notes`
- `draft_recordings`
- `existing_assets`
- `constraints`

### `audience` (object, AI-inferred)

`audience` is an object (历史版本曾是字符串；legacy import 把旧字符串塞进 `technical_literacy` 并把 `tier` 留空待 AI 补全)。所有字段由 **AI agent** 在 ingest 阶段从录音稿/源材料推断填充，向用户陈述判断依据，等用户一句"对/错"确认。**不向用户提供任何"填表"形态的交互**——这与"约束 AI agent 而不是约束用户"的设计原则对齐。

Required fields:

- `tier`: one of `lay_scrolling`, `lay_curious`, `domain_aware`, `insider`
- `tier_inferred_by`: agent identity that wrote the inference (e.g. `claude-opus-4-7`)
- `tier_inference_evidence`: AI 引用录音里的几个用语作为推断依据（如：用户说"让大家"、"每一个人"⇒ `lay_curious`）
- `tier_user_confirmed`: boolean. `true` 才能解锁后续 stage
- `tier_user_confirmed_at`: ISO 8601 timestamp
- `tier_locked_at`: ISO 8601 timestamp
- `platform_context`: `douyin_feed` / `xiaohongshu` / `bilibili` / `youtube` / etc.
- `technical_literacy`: AI 自由文本描述（如"听过 ChatGPT 但不会写代码"）
- `vocabulary_level`: object with `universal_only` (bool), `allowed_jargon_terms` (string[]), `banned_jargon_terms` (string[]), `max_jargon_density_per_minute` (number, default 3)
- `analogy_required`: boolean; default `true` when `tier ≤ lay_curious`
- `insider_chrome_allowed`: boolean; default `false` when `tier ≤ lay_curious`
- `self_check_persona`: AI 在 lookdev 阶段自检使用的视角描述（如"我妈刷到这条会停住吗"）

Tier 含义：

| tier | 含义 |
|---|---|
| `lay_scrolling` | 抖音算法推到的随机用户，0 上下文 |
| `lay_curious` | 关注科技但非从业者（用户当前定位） |
| `domain_aware` | 行业邻近，知道大概念但不写代码 |
| `insider` | 同行工程师/开发者/AI 创业者 |

`tier ≤ lay_curious` 时，下游 lookdev 自动激活：
- `audience_visibility=banned_for_lay` 模式硬阻断（INV-AUDIENCE-VOCAB-FORBIDDEN-LIST）
- `analogy_pass.lay_analogy` 必填（INV-ANALOGY-REQUIRED-FOR-LAY）
- `chrome_family ∈ {development_toolchain, production_pipeline}` 不允许进 `allowed_chrome[]`（INV-NO-INSIDER-CHROME-ON-LAY）

`allowed_jargon_terms` 由 AI 从录音稿自动识别本期话题词填充（讲 RAG 时自动加 RAG、讲 agent 时自动加 agent），让本期视频的话题词不被自己的规则误伤。用户不需要手填白名单。

### `BrandKit`

Long-lived brand-level assets registered in `sources.brand_kit`. Persists across multiple video projects (one brand_kit instance can be referenced by N project-states). Required when `visual.director_board.scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan.asset_kind = "chibi_layered"` so that visual-compiler has a defined place to read the character + slices + props.

Minimum fields:

- `brand_kit_id`
- `character_id`: e.g. `cat-director-v1`
- `character_sheet_path`: master character-sheet image
- `character_sheet_manifest_path`: manifest.json listing slices and slice metadata
- `expression_slices[]`: array of `{expression_id, file_path, transparent_path}` for each named expression (happy/thinking/surprised/serious/wink/etc.)
- `view_slices[]`: array of `{view_id, file_path, transparent_path}` for front/side/back/three_quarter views
- `props_library[]`: array of `{prop_id, file_path, asset_type: "2d_png" | "3d_glb", transparent_path, glb_path}` for accessories and recurring props
- `color_palette[]`: hex color list locked for the brand
- `typography_lock`: object with `font_family`, `font_weight`, optional `letter_spacing`
- `voice_persona`: free-text description of speaking persona (used by voice synthesis when applicable)
- `brand_kit_locked_at`: ISO 8601
- `brand_kit_version`: string
- `provenance`: object with `created_at`, `created_by`, source asset directory path

`xingchen-asset-intake` is the owning skill for importing materials into `sources.brand_kit`. When a project does not need chibi-layered scenes, this field may be omitted; when `asset_kind="chibi_layered"` is selected, `INV-CONCRETE-ASSET-REALIZATION` requires `sources.brand_kit` to be present and the relevant slices to exist.

## Section Provenance

Imported state sections should retain a `provenance` object when legacy material was used.

The following sections should carry provenance after a legacy import:

- `sources`
- `proof`
- `script`
- `visual`
- `mother`
- `render`
- `review`

Each section provenance object should include:

- `origin` set to `legacy-import`
- `section`
- `used_artifacts`
- `missing_artifacts`
- `imported_at`

## `sources.transcript`

When the project begins from narration audio or a recording-first workflow, store transcript truth in `sources.transcript`.

Recommended fields:

- `segments`
- `runtime` for transcription engine/model/device/cache metadata
- `source_files` for take-level source file summaries

Each segment should include:

- `start`
- `end`
- `speaker`
- `text`
- `pause_after_ms`
- `speech_rate`
- `scene_break_hint`
- `tone_shift`

## `sources.recording_correction`

Recording-first projects must complete recording correction before visual design. Store the correction truth in `sources.recording_correction`.

Minimum fields:

- `status`: `pending`, `completed`, `manual_review_required`, or `blocked`
- `source_audio_refs`
- `cleaned_audio_paths`
- `transcript_path`
- `cleanup_report_path`
- `correction_actions`
- `quality_checks`
- `manual_review_notes` as a string

`completed` means the transcript, cleaned/accepted audio, and cleanup report are ready for director-board use. `manual_review_required` is allowed only when the correction is usable but a human must accept a pronunciation, trim, noise, or cadence issue. `blocked` means do not design visuals yet.

## `sources.speech_rhythm`

When SRT or timestamped transcript truth exists, store actual speech-rhythm analysis in `sources.speech_rhythm`.

Recommended fields:

- `status`: `completed`, `manual_review_required`, `not_needed`, or `blocked`
- `skill_ref`: normally `xingchen-speech-rhythm`
- `source_srt_path`
- `source_transcript_ref`
- `analysis_path`
- `analysis_json_path`
- `chart_path`
- `summary`
- `segments`
- `visual_handoff`
- `manual_review_notes`
- `not_needed_reason`

`visual_handoff` should include `anchor_beats`, `slowdown_beats`, `transition_pauses`, `rushed_terms`, and `flat_runs`. Director-board and visual-compiler consume these as timing evidence, not as renderer instructions.

## `sources.asset_manifest`

When screenshots or documents have been reviewed, store the asset inventory in `sources.asset_manifest`.

Each asset item should include:

- `asset_id`
- `file_path`
- `asset_type`
- `summary`
- `topic_tags`
- `proof_candidate`
- `dedupe_group`
- `review_status`

Allowed practical `asset_type` values include `screenshot`, `screen_recording`, `audio_recording`, `image`, `document`, `video`, `html`, `data`, and `other`.

Media source inputs such as screenshots, recordings, screen recordings, and existing assets should receive manifest entries before proof work starts. This is the trace that lets later director planning explain exactly what source material is used, ignored, rebuilt, or kept literal.

## `proof`

Minimum fields:

- `claims`
- `evidence_items`
- `proof_status`

Each evidence item should retain:

- `claim_id`
- `asset_id`
- `source`
- `evidence_type`
- `visibility_requirement`
- `allowed_usage`

## `script`

Minimum fields:

- `topic_lock`
- `script_lock`
- `spoken_script`
- `slides`
- `beat_map`
- `speech_rhythm_plan`
- `status`

### `script.speech_rhythm_plan`

For narration-led projects, store the pre-recording rhythm plan in `script.speech_rhythm_plan` before Script Lock.

Recommended fields:

- `status`: `planned`, `manual_review_required`, `not_needed`, or `blocked`
- `skill_ref`: normally `xingchen-speech-rhythm`
- `source_ref`
- `plan_path`
- `plan_json_path`
- `target_profile`
- `beats`
- `risk_notes`
- `not_needed_reason`

Each beat should include `beat_id`, `scene_id`, `text`, `beat_job`, `density`, `term_load`, `target_rate_cpm`, `target_pause_after_ms`, `delivery_note`, and `visual_hint`. `script.beat_map` may copy selected rhythm cues, but `script.speech_rhythm_plan` remains the full planning surface.

## `visual`

This section owns the machine-readable visual truth.

Minimum fields:

- `visual_lock`
- `visual_policy`
- `director_board`
- `material_director_pass`
- `lookdev_gate`
- `artifacts`
- `status`

### `VisualPolicy`

Recommended fields:

- `meta_concept`
- `taste_thesis`
- `selected_aesthetic_mode`
- `aesthetic_modes`
- `benchmark_canon`
- `reference_set`
- `visual_style_influence`
- `editorial_world_system`
- `editing_priority_stack`
- `continuity_policy`
- `mise_en_scene_policy`
- `color_script_policy`
- `audio_policy`
- `voice_policy`
- `anti_cheapness`
- `hero_frame_scene_id`
- `hero_frame_laws`
- `energy_curve`
- `style_consistency_policy`
- `short_form_policy`
- `manual_review_policy`
- `anti_reference`
- `forbidden_list`
- `allowed_chrome`
- `palette_lock`
- `typography_lock`
- `motion_rhythm`
- `evidence_rule`
- `vibemotion_candidate_policy`
- `hyperframes_scene_policy`
- `vfx_director_pass`

`selected_aesthetic_mode` must point to exactly one approved primary mode.

`aesthetic_modes` is a list of modes actually considered for this project. It is not a static catalog dump.

Optional visual-style influences may be recorded here when the user or art-direction pass selects a concrete outside reference. They are optional schema-backed contracts, not renderer families. If a style influence is selected, this is the canonical trigger path; do not put the trigger only under `visual.director_board.brainstorming_contract`.

For Vox/Remotion editorial-motion inspiration, prefer this shape:

```json
{
  "visual_style_influence": {
    "source": "vox_remotion_visual_style",
    "selected_traits": [
      "editorial paper collage",
      "shared paper/grid world",
      "halftone cutouts",
      "red offset marker strokes",
      "foreground proof carriers",
      "beat-synced kinetic numbers",
      "Remotion-owned captions and proof overlays"
    ],
    "xingchen_adaptation": "keeps creator identity and mobile readability; does not copy the source video",
    "avoid_copying": ["exact source compositions", "creator identity", "political example", "title card"]
  },
  "editorial_world_system": {
    "background_id": "paper_grid_world_v1",
    "grid_size": "low-contrast shared alignment grid",
    "grain_noise": "subtle paper print texture",
    "palette_lock": ["paper", "charcoal", "black", "red accent"],
    "typography_lock": "Remotion-owned Chinese text, phone-readable",
    "halftone_cutout_policy": "supporting context only",
    "red_offset_marker_policy": "emphasis, tension, path, or figure-ground separation only",
    "remotion_proof_ownership": "all text, data, labels, subtitles, and audited proof are code-owned",
    "safe_area_mask": "proof, subtitle, marker, and cutout safe zones do not fight each other"
  }
}
```

When selected, the actual scene-by-scene contract still lives in `visual.director_board.scene_boards[]` and `render.scene_motion_specs[]`; do not create a parallel truth file.

### `DirectorBoard`

`visual.director_board` is the primary Visual Lock director contract. It is produced by `xingchen-director-board` after StoryMother Lock and before `xingchen-art-direction`.

Minimum fields:

- `status`: `pending`, `completed`, `blocked`, or `manual_review_required`
- `board_md_path`
- `board_json_path`
- `global_director_thesis`
- `aesthetic_system`
- `brainstorming_contract`
- `scene_boards`
- `scene_edge_boards`
- `component_registry_plan`
- `subtitle_system`
- `tech_stack_policy`
- `lookdev_acceptance`
- `unresolved_questions`

Each `scene_boards[]` item must include:

- `scene_id`
- `scene_job`: `hook`, `context`, `proof`, `build`, `peak`, `rest`, `payoff`, or `close`
- `source_layer`
- `arrangement_layer`
- `brainstorming_layer`
- `aesthetic_layer`
- `frame_layer`
- `detail_layer`
- `component_layer`
- `subtitle_layer`
- `tech_stack_layer`
- `lookdev_acceptance`

Required layer intent:

- `source_layer` says which source units matter, what the material expresses, what must stay faithful, what may transform, and whether the material is hero/supporting/background/none evidence.
- `arrangement_layer` maps narration refs, voice timing, beat-before-keyword, duration, and transitions.
- `brainstorming_layer` records the `superpowers/brainstorming` scene-picture pass: scene question, knowledge action, options considered, selected direction, continuity handles, anti-PPT decision, **and `analogy_pass`**. `analogy_pass` is required when `audience.tier ≤ lay_curious` and records `concept_being_explained`, `lay_analogy`, `analogy_carrier_visual`, whether the domain term is used in voice / appears on screen, `self_check_persona_pass`, and `jargon_safety_net`. Missing `analogy_pass.lay_analogy` under lay tier is a Visual Lock fail (INV-ANALOGY-REQUIRED-FOR-LAY).
- `brainstorming_contract.resource_preflight` records the visual resource preflight from [visual-resource-and-prompt-preflight.md](./visual-resource-and-prompt-preflight.md): source reality, design-system memory, selected/rejected SVG/icon libraries, selected/rejected Remotion packages, imagegen route, prompt-pack paths when generation is needed, license/provenance notes, and lookdev audit hooks. Missing or stale resource evidence is a Visual Lock fail (INV-VISUAL-RESOURCE-PREFLIGHT).
- `aesthetic_layer` records scene role, color temperature, density, energy level, contrast to previous scene, and cheapness risks.
- `frame_layer` records main frame design, dominant anchor, layout pattern, camera path, depth plan, proof regions, subtitle safe region, **and `on_screen_text[]`**. Each `on_screen_text[]` item must record `text`, `cite_source`, `cite_quote`, and `purpose`. `cite_source` must point to one of `script.spoken_script.line_N`, `analogy_pass.lay_analogy`, or `source_material.{asset_id}.original_text`. Pointing to metadata field names (`scene_id`, `evidence_role`, `knowledge_action`, `job`), project-internal chapter names (`scene-board.md`, `S01-question`), or tool/skill names (`xingchen-*`, `VoxCPM2`) is a Visual Lock fail and a Lookdev `onscreen_text_cite_audit` blocker. AI 找不到合法 cite 时应让该场 `on_screen_text[]` 为空数组而非强写 metadata 文字。
- `detail_layer` records lighting, material surface, typography role, motion verbs, micro interactions, and failure risks.
- `component_layer` records primary component, supporting components, component props, optional `library_package_trace`, fallback, and whether kit extension is needed.
- `subtitle_layer` records subtitle mode, position, keyword highlights, `must_not_cover[]`, voice relationship, and any subtitle background policy. If stroke or a rounded translucent box is used, record padding, max lines, and a clipping/overlap risk note so lookdev can verify the actual rendered frame.
- `tech_stack_layer` records primary stack, integration mode, stack reason, rejected stacks, and preview requirement.

Allowed `tech_stack_layer.primary_stack` values are `remotion`, `html_3d`, `hyperframes`, `spark`, `vibemotion`, `source_media`, and `gen_insert`.

This section is more than a summary. It is the scene-by-scene director board that later aesthetic, compiler, and lookdev work must consume.

When `visual.visual_policy.visual_style_influence.source = "vox_remotion_visual_style"`, express the scene contract through existing layers rather than adding a new schema branch:

- `world_base` belongs in `frame_layer.depth_plan`, `aesthetic_layer`, and the project-level `editorial_world_system`.
- `mid_cutouts` belong in `detail_layer.material_surface`, `component_layer.supporting_components[]`, and `component_layer.component_props_brief`.
- `foreground_proof` belongs in `frame_layer.dominant_anchor`, `frame_layer.proof_regions[]`, and the scene's proof binding.
- `remotion_overlay` belongs in `frame_layer.on_screen_text[]`, `subtitle_layer`, and code-owned proof/chart/label plans.
- `voiceover_beat` belongs in `arrangement_layer.voice_timing`, `beat_before_keyword`, and later `render.scene_motion_specs[].timing_basis`.
- `safe_zones` belong in `frame_layer.subtitle_safe_region`, `subtitle_layer.must_not_cover[]`, and `proof_regions[]`.
- `prop_controls` belong in `component_layer.component_props_brief`, naming the tunable x/y/scale/crop/opacity/marker/halftone/grid props that visual-compiler must expose.
- `lookdev_evidence` belongs in `lookdev_acceptance` and later `review.lookdev_gate_results[].rule_results[].evidence`.

### `SceneEdgeBoard`

`visual.director_board.scene_edge_boards[]` records the flow between adjacent StoryMother scenes. It is required for every adjacent pair in `mother.story_mother.scene_order[]`.

Each item should include:

- `edge_id`
- `from_scene_id`
- `to_scene_id`
- `skill_ref`, normally `superpowers/brainstorming`
- `bridge_question`
- `options_considered`
- `selected_bridge`
- `narrative_bridge`
- `continuity_handle_kind`
- `out_handle`
- `in_handle`
- `transition_method`
- `cut_moment`
- `duration_frames`
- `anti_ppt_risk`
- `lookdev_acceptance`

Allowed transition methods are `keyword_relay`, `proof_region_relay`, `diagram_morph`, `scale_shift`, `axis_handoff`, `question_answer_cut`, `color_logic_cut`, `subtitle_to_visual`, `hard_cut`, and `breath_cut`.

This field exists because knowledge videos often lack physical objects. The continuity handles may be concepts, keywords, numbers, frames, arrows, proof regions, layout states, or voice beats. The goal is to make the argument flow, not to imitate lifestyle montage.

### `ConcreteExecutionPlan`

Nested under `visual.director_board.scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan` when `audience.tier ≤ lay_curious`. Required for every scene whose `knowledge_action ∈ {define, compare, decompose, prove}`. This is the AI agent's contract for translating an abstract `lay_analogy` into concrete asset-generation instructions or Remotion-native concept structures—the mechanism that prevents `<div>` chip fall-back and cheap generated-prop drift.

Minimum fields:

- `asset_kind`: one of `imagegen_2d` / `hunyuan3d_mesh` / `comfyui_workflow` / `remotion_dataviz` / `screen_recording_annotated` / `infographic_svg` / `chibi_layered` / `stock_photo_annotated` / `mixed_compose`
- `generation_skill_route`: one of `imagegen` / `comfyui_hunyuan3d` / `local_cli` / `manual_implementation` / `remotion_native`
- `generation_prompt`: complete prompt text directly feedable to the target skill. For `generation_skill_route="remotion_native"`, use `not_needed_programmatic` and fill `concept_object_plan` + `motion_primitives[]` instead.
- `generation_negative_prompt`
- `style_reference`: aesthetic reference string (e.g. "回形针 PaperClip 手绘剖面图风" / "Kurzgesagt chibi flat")
- `expected_output_paths[]`: paths where visual-compiler should write produced assets
- `enumerated_concepts[]`: array of distinct concrete-noun concepts present in the spoken script / lay_analogy for this scene. **When length > 1, INV-ASSET-SPECS-COMPLETENESS requires each concept to have its own asset spec.** Example for R04-style scene: `["杂乱文本", "图片", "聊天记录", "语气", "文档", "PPT", "视频"]`
- `additional_asset_specs[]`: array of additional asset spec objects when `enumerated_concepts.length > 1`. Each item has `concept_name`, `asset_kind`, `generation_skill_route`, `generation_prompt`, `expected_output_paths`, `asset_realized`, `asset_realized_paths`. Length must be ≥ `enumerated_concepts.length`. Lookdev `rule_id=asset_specs_completeness_check` enforces this.
- `concept_object_plan`: required when `asset_kind ∈ {remotion_dataviz, infographic_svg}` is used for spoken knowledge / oral AI explainer scenes. Describes how the abstract concept becomes programmable linework, rails, layers, nodes, scan windows, proof regions, or feedback loops.
- `motion_primitives[]`: 1-3 primitives from [`spoken-knowledge-motion-grammar.md`](./spoken-knowledge-motion-grammar.md), such as `RouteDraw`, `BlockSnap`, `ProofPushIn`, `RailConstraint`, or `FeedbackLoop`.
- `generated_prop_decision`: `not_needed`, `selected_with_quality_reason`, or `rejected_for_explainer_clarity`. Spoken knowledge projects default to rejecting generated props unless `quality_reason` explains why physical material is necessary and likely to pass lookdev.
- `quality_reason`, `lookdev_risk`, `fallback_to_programmatic_structure`: required when a generated prop is selected for a spoken knowledge scene.
- `remotion_layout_plan`: textual description of where the asset(s) sit in the Remotion scene, camera motion, subtitle safe region, z-order
- `camera_intent`: one of `push_in` / `pull_out` / `orbit` / `dolly_left` / `dolly_right` / `crane_down` / `pan` / `whip_pan` / `freeze_zoom` / `held` (held only when `scene_job === "rest"`)
- `camera_motion_reveals`: text describing what the motion reveals to the viewer (must be narrative purpose, not decoration)
- `camera_scale_change`: absolute scale variation (e.g. 0.4 means scale interpolates from 1.0 to 1.4 or 0.6). Must be ≥ 0.15 for non-`held` intents, ≥ 0.3 for `push_in`/`pull_out`.
- `camera_translate_px`: cumulative translate magnitude in pixels. Must be ≥ viewport 15% for `dolly_*` intents.
- `remotion_animation_depth`: object with the three arrays:
  - `l2_capabilities_used[]`: declared L2 capabilities (must have ≥ 1 per non-rest scene). Values from the enum in [`remotion-animation-depth.md`](../../xingchen-visual-compiler/references/remotion-animation-depth.md): `spring_physics` / `multi_layer_parallax` / `real_camera_motion` / `remotion_paths_evolve` / `animation_utils_transform` / `freeze_frame` / `particle_system_50plus` / `transitions_package` / `shapes_package` / `multi_sequence_loop`
  - `l3_capabilities_used[]`: declared L3 capabilities (whole project must have ≥ 1 scene with this non-empty). Values: `three_3d_canvas` / `media_utils_audio_data` / `paths_interpolate_morph` / `motion_blur` / `skia_canvas` / `matter_physics` / `lottie` / `frame_time_remap` / `webgl_shader` / `noise_procedural`
  - `physics_targets[]`: array of element names that need physics-driven motion (entries / exits / collisions / scatter). When non-empty, visual-compiler implementation must use `spring()` or physics-engine import—`interpolate(linear)` translation is forbidden (INV-PHYSICS-OVER-LINEAR).
- `fallback_plan`: how to degrade if generation fails
- `asset_realized`: boolean
- `asset_realized_paths[]`: actual paths after visual-compiler ran generation

The full enforcement contract for this object lives in `xingchen-director-board/SKILL.md::Procedure 2.5` and is validated by `xingchen-lookdev/SKILL.md` audits `asset_specs_completeness_check` / `remotion_animation_depth_check` / `camera_motion_check` / `physics_over_linear_check`.

### `MaterialDirectorPass`

Legacy compatibility field for earlier projects. New projects should store source-to-picture director analysis in `visual.director_board`; `visual.material_director_pass` may remain populated when older tooling still reads it.

Minimum fields:

- `status`: `pending`, `completed`, `blocked`, or `manual_review_required`
- `director_summary`
- `source_unit_readings`
- `recording_rhythm_reading`
- `scene_binding_plan`
- `tech_stack_plan`
- `unresolved_questions`

Each `source_unit_readings[]` item should include:

- `unit_id`
- `source_ref`
- `source_kind`
- `expressed_meaning`
- `claim_or_feeling`
- `must_preserve`
- `visual_potential`
- `use_decision`: `hero_proof`, `supporting_proof`, `context`, `texture`, `reference_only`, or `unused`

Each `recording_rhythm_reading.segments[]` item should include:

- `segment_ref`
- `time_range`
- `voice_energy_level`
- `pause_or_emphasis`
- `spoken_intent`
- `visual_response`

Each `scene_binding_plan[]` item should include:

- `scene_id`
- `source_unit_ids`
- `narration_refs`
- `material_role`
- `picture_design`
- `timing_design`
- `source_treatment`
- `subtitle_avoidance`
- `transition_logic`

Each `tech_stack_plan[]` item should include:

- `scene_id`
- `primary_stack`: `remotion`, `html_3d`, `source_media`, `hyperframes`, `vibemotion`, `spark`, or `gen_insert`
- `supporting_stacks`
- `rejected_stacks`
- `why_this_stack`

This section is the bridge from "user gave us material" to "we know what film to build." It is more specific than `visual.source_material_plan`: it reads the material, maps it to the recording rhythm and StoryMother scenes, and explains why the current technical route is appropriate.

### `VfxDirectorPass`

This section records the scene-level visual-effect judgment before candidate generation and renderer implementation.

Recommended fields:

- `required`
- `scene_decisions`
- `spark_use_policy`
- `vibemotion_candidate_pass`
- `proof_scene_guardrail`

Each `scene_decisions` item should name the scene job, trust source, spectacle source, allowed renderer family, VibeMotion option menu expectations, and what must remain quiet for comprehension.

### `RecordingVisualBrief`

When a project starts from narration audio, a transcript, or a spoken draft, store the voice-to-visual route analysis in `visual.recording_visual_brief`.

Recommended fields:

- `source_audio_ref`
- `voice_energy_curve`
- `pause_map`
- `emphasis_beats`
- `visual_opportunity_beats`
- `route_hints`

Each `route_hints[]` item should include:

- `scene_id`
- `voice_signal`
- `visual_job`
- `execution_runtime`
- `motion_source`
- `integration_mode`
- `candidate_skill`
- `promotion_target_renderer_family`
- `reason`

Allowed `execution_runtime` values are `remotion`, `spark_browser_canvas`, `html_browser_capture`, and `source_media`.

Allowed `motion_source` values are `native_remotion`, `vibemotion_skill`, `hyperframes_runtime`, `spark_runtime`, `bespoke_code`, and `existing_media`.

For render-bound scene specs, `ai_video_generation` is also allowed when the scene is a bounded generated-video plate under Remotion control.

Allowed `integration_mode` values are `live_component`, `copied_component`, `rewritten_component`, `captured_html_plate`, `transparent_asset_layer`, `video_plate`, and `browser_canvas_plate`.

### `ScreenRecordingBrief`

When the user provides screen recordings, app walkthroughs, web captures, or UI operation clips, store clip treatment in `visual.screen_recording_brief.clips[]`.

Each clip should include:

- `clip_id`
- `media_path`
- `time_range`
- `route_type`
- `visual_job`
- `proof_role`
- `privacy_review`
- `legibility_check`
- `crop_strategy`
- `remotion_treatment`
- `execution_runtime`
- `motion_source`
- `integration_mode`
- `promotion_target_renderer_family`
- `reason`

Allowed `route_type` values are `evidence_clip` and `source_media_plate`.

Screen recordings should stay in the existing-media lane: `motion_source: "existing_media"`, `integration_mode: "video_plate"`, and `promotion_target_renderer_family: "remotion_component"`. `execution_runtime` may be `remotion` for evidence treatment or `source_media` when the clip is the main plate.

### `SourceMaterialPlan`

When the project includes screenshots, screen recordings, audio/video files, or other existing assets, store the director-level use decision in `visual.source_material_plan[]`.

Each item should include:

- `scene_id`
- `asset_ids`
- `screen_recording_clip_ids` when applicable
- `usage_role`: `hero_proof`, `supporting_proof`, `context`, `texture`, `reference_only`, or `unused`
- `treatment`
- `director_reason`

This is the bridge between source intake and visual direction. It prevents assets from vanishing silently and prevents render-time improvisation about how a screenshot, recording, or document should appear.

### `VibeMotionCandidatePolicy`

This policy makes VibeMotion an executable review-video candidate layer, not a style rule, primitive catalog, or final renderer.

Recommended fields:

- `mode`, normally `generate_review_video_candidates`
- `default_discussion`, normally `per_scene_options`
- `default_options`, normally `recommended`, `bold`, and `safe`
- `default_selection_rule`, normally `use_recommended_when_user_does_not_select`
- `not_a_template_library`, normally `true`

The policy must preserve script truth: VibeMotion options may explore how a scene moves, but they must not rewrite thesis, proof meaning, scene order, or narration logic.

### `HyperframesScenePolicy`

This policy makes Hyperframes an AI-first HTML scene and motion-candidate lane, not a replacement for the final Xingchen Next render controller.

Recommended fields:

- `mode`, normally `generate_html_scene_candidates`
- `default_discussion`, normally `per_scene_html_motion_options`
- `default_options`, normally `recommended`, `bold`, and `safe`
- `allowed_jobs`, such as HTML-native explainers, DOM/SVG motion, GSAP/Anime/Lottie, lightweight Three/canvas plates, and future editor-friendly scenes
- `forbidden_jobs`, such as full-video assembly, subtitles, proof geometry, voice/audio assembly, generic decoration, screen-recording reinterpretation, and Spark/world-asset substitution
- `promotion_rule`, normally `approved_candidate_must_promote_to_html_canvas_or_remotion`
- `not_final_video_controller`, normally `true`
- `not_a_template_library`, normally `true`
- `generated_per_story_mother`, normally `true`

Hyperframes may explore how an HTML/canvas scene moves, but it must not rewrite thesis, proof meaning, scene order, narration logic, final subtitles, or final audio timing.
It also must not supply a fixed visual template. Every Hyperframes scene source should be generated from the current StoryMother, VisualPolicy, SceneMotionSpec, proof boundaries, and script timing.

### `AestheticModeDecision`

Each `aesthetic_modes` item should include:

- `mode_id`
- `decision`
- `fit_reason`
- `tradeoffs_accepted`
- `tradeoffs_rejected`
- `selection_constraints`

Recommended `decision` values:

- `selected`
- `rejected`

### `BenchmarkCanonItem`

Each `benchmark_canon` item should include:

- `ref_id`
- `source_name`
- `family`
- `job`
- `must_keep`
- `must_avoid`

### `ReferenceSetItem`

Each `reference_set` item should include:

- `ref_id`
- `asset_path_or_url`
- `job`
- `time_range_or_frame`
- `notes`

### `EditingPriorityItem`

Each `editing_priority_stack` item should include:

- `priority`
- `dimension`
- `reason`

Do not hardcode Walter Murch's order as a universal default. Each project should justify its own ordering.

### `ContinuityPolicy`

Recommended fields:

- `time_flow`
- `space_flow`
- `cut_readability`
- `intentional_break_policy`

### `MiseEnScenePolicy`

Recommended fields:

- `staging`
- `blocking`
- `foreground_background`
- `lighting_motivation`
- `retouching_discipline`
- `color_abstraction_policy`

### `ColorScriptPolicy`

Recommended fields:

- `opening_anchor_hex`
- `middle_anchor_hex`
- `closing_anchor_hex`
- `temperature_arc`
- `value_arc`
- `drift_tolerance_delta_e`

### `AudioPolicy`

Recommended fields:

- `music_function`
- `sfx_discipline`
- `mix_floor_lufs`
- `mix_ceiling_lufs`
- `silence_policy`
- `ducking_policy`

### `VoicePolicy`

Recommended fields:

- `voice_route`
- `prosody_target`
- `breath_policy`
- `pronunciation_watchlist`
- `authenticity_guardrail`
- `clone_disclosure_mode`

### `AntiCheapnessRule`

Each `anti_cheapness` item should include:

- `rule_id`
- `category`
- `detection_mode`
- `failure_signature`
- `swap_strategy`

Suggested `detection_mode` values:

- `machine_blacklist`
- `preview_detector`
- `manual_aesthetic_review`

### `HeroFrameLaw`

Each `hero_frame_laws` item should include:

- `law_id`
- `requirement`
- `failure_mode`

### `ForbiddenPatternItem`

Each `forbidden_list` item should include:

- `pattern_id`
- `description`
- `detection_mode`
- `replacement_direction`
- `audience_visibility`: `universal` / `insider_only` / `banned_for_lay`
- `triggers_above_tier`: `lay_scrolling` / `lay_curious` / `domain_aware` / `insider`（此 pattern 对哪个 tier 及以上让位）
- `failure_severity`: `blocker` / `warning` / `manual_review`

These three fields are sourced from `xingchen-art-direction/references/forbidden-patterns.md` and must travel with each pattern when `xingchen-art-direction` injects rules into `visual.visual_policy.forbidden_list[]`. Lookdev uses them to decide which patterns are active under the current `audience.tier` and what severity governs failure.

### `AllowedChromeItem`

Each `allowed_chrome` item should include:

- `component_name`
- `family`
- `scene_jobs`
- `notes`

### `ManualReviewPolicy`

Recommended fields:

- `unsupported_aesthetic_rules`
- `required_human_signoff`
- `notes`

### `lookdev_gate`

Recommended fields:

- `path`
- `status`
- `approval_checkpoint`
- `aesthetic_checks`
- `unsupported_policy`

### `visual.artifacts`

Recommended fields:

- `art_direction_path`
- `aesthetic_grounding_path`
- `visual_language_kit_path`
- `lookdev_gate_path`

## `mother`

This section owns the single approved content mother.

Minimum fields:

- `story_mother_lock`
- `story_mother`
- `status`

### `StoryMother`

Minimum fields:

- `mother_id`
- `thesis`
- `audience_promise`
- `scene_order`
- `scene_cards`
- `proof_binding`
- `narration_spine`
- `visual_intent`

### `SceneCard`

Each `scene_cards` item should include:

- `scene_id`
- `scene_job`
- `intent`
- `proof_need`
- `dominant_anchor`
- `timing_note`

### `ProofBindingItem`

Each `proof_binding` item should include:

- `scene_id`
- `claim_id`
- `evidence_item_ids`
- `binding_note`

## `variants`

This is a list of per-platform derivatives.

### `PlatformVariant`

Minimum fields:

- `variant_id`
- `mother_id`
- `platform`
- `aspect`
- `hook`
- `pacing_density`
- `subtitle_policy`
- `title_options`
- `cover_brief`
- `scene_adjustments`
- `status`

## `render`

This section owns render routing and scene execution state.

Minimum fields:

- `route`
- `vibemotion_candidates`
- `hyperframes_candidates`
- `ai_video_prompt_requests`
- `ai_video_candidates`
- `visual_preprocess_assets`
- `generated_assets`
- `generated_3d_assets`
- `recording_requests`
- `dependency_install_requests`
- `plugin_adapter_runs`
- `scene_motion_specs`
- `jobs`
- `status`

### `GeneratedAssetItem`

Each `render.generated_assets[]` item records a concrete asset produced by `xingchen-visual-compiler`'s Concrete Asset Realization Pass when a scene's `concrete_execution_plan` requires it. Required fields:

- `asset_id`
- `scene_id`
- `concrete_execution_plan_ref`: path to the originating plan, e.g. `scene-S03.brainstorming_layer.analogy_pass.concrete_execution_plan` (for the scene's primary asset). When the asset originates from a sub-spec inside `additional_asset_specs[]`, the ref points to that index, e.g. `scene-S03.brainstorming_layer.analogy_pass.concrete_execution_plan.additional_asset_specs[2]`. Each item in `additional_asset_specs[]` must produce its own `generated_assets[]` entry; lookdev `rule_id=asset_specs_completeness_check` counts these against `enumerated_concepts.length`.
- `asset_kind`: from the `concrete_execution_plan.asset_kind` enum (`imagegen_2d` / `hunyuan3d_mesh` / `comfyui_workflow` / `remotion_dataviz` / `screen_recording_annotated` / `infographic_svg` / `chibi_layered` / `stock_photo_annotated` / `mixed_compose`)
- `generation_skill_route`: which skill/CLI actually produced the asset (`imagegen` / `comfyui_hunyuan3d` / `local_cli` / `manual_implementation` / `remotion_native`)
- `generation_prompt_used`: full prompt text actually sent to the skill (including style-reference appendix from `visual-vocabulary-library.md`)
- `generation_negative_prompt_used`
- `style_reference_used`
- `asset_paths`: array of file paths to the produced assets
- `asset_realization_status`: `pending`, `generated`, `previewed`, `approved`, or `rejected`
- `used_in_components`: array of component file paths (`render.scene_motion_specs[].component_path`) that import this asset
- `fallback_used`: boolean — was a fallback executed
- `fallback_reason`: text — why fallback triggered
- `lookdev_evidence_required`: boolean — `true` until lookdev `concrete_asset_realization_check` passes
- `provenance`: object with `created_at`, `created_by` (agent identity), and `adapter_run_id` (linking to `render.plugin_adapter_runs[]`)

Lookdev's `rule_id: concrete_asset_realization_check` (defined in `xingchen-lookdev/SKILL.md`) verifies every scene with a `concrete_execution_plan` has a matching entry here with `asset_realization_status ∈ {generated, previewed, approved}` and `used_in_components` non-empty.

### `VisualPreprocessAsset`

Each `render.visual_preprocess_assets[]` item records a non-3D visual enhancement artifact generated for Remotion composition. See [visual-preprocess-lane.md](./visual-preprocess-lane.md).

Use this for the P0 enhancement path:

- `depth_map`: Depth Anything V2 Small or equivalent, used for 2.5D parallax and camera motion
- `foreground_mask` / `text_safe_mask`: MobileSAM or equivalent, used for layer separation and subtitle avoidance
- `upscaled_still` / `repaired_still`: Real-ESRGAN ncnn Vulkan, GFPGAN, or manual repair
- `camera_path` / `layered_2_5d_manifest` / `preprocess_manifest`: deterministic JSON consumed by Remotion

Required fields:

- `asset_id`
- `scene_id`
- `source_asset_ref`
- `asset_kind`
- `generator`
- `backend`
- `output_paths`
- `status`
- `state_trace_refs`
- `remotion_usage`
- `proof_policy`

Every generated or previewed preprocess asset must be linked by `asset_id` from a matching `render.plugin_adapter_runs[].candidate_ids[]`. The adapter run should use `adapter_id: "visual-preprocess-lane"` for a combined pipeline, or one of `depth-anything-v2-small`, `mobilesam`, `realesrgan-ncnn-vulkan`, `gfpgan`, `rife-lite`, or `local-visual-preprocess`.

The proof policy must state that preprocessing does not rewrite proof. Remotion remains responsible for proof overlays, readable claims, subtitles, labels, audio sync, and final composition.

### `Generated3DAssetItem`

Each `render.generated_3d_assets[]` item records a 3D asset (mesh / texture / depth / multi-view) generated through the ComfyUI 3D Asset Lane (see [comfyui-3d-asset-lane.md](./comfyui-3d-asset-lane.md)). Reuses the asset manifest schema in that document. When a `render.generated_assets[]` entry has `asset_kind: "hunyuan3d_mesh"`, it must additionally produce a `render.generated_3d_assets[]` entry with the 3D-specific quality / camera-limits / fallback metadata.

### `RecordingRequest`

Each `render.recording_requests[]` item records a screen recording or footage request handed back to the user (because `asset_kind: "screen_recording_annotated"` requires real user-captured footage, not AI generation). Minimum fields:

- `request_id`
- `scene_id`
- `concrete_execution_plan_ref`
- `recording_brief`: what to record, in plain language
- `expected_duration_sec`
- `key_moments`: array of `{time_sec, ui_region, voiceover_keyword}` describing where annotations will land
- `delivery_path`: where the user should save the recording
- `status`: `pending`, `delivered`, `accepted`, `rejected`
- `delivered_path`: filled when user provides the recording

Visual-compiler may not synthesize fake recordings to satisfy `screen_recording_annotated` plans; it must write a `RecordingRequest`, wait, then proceed only after user delivery.

### `DependencyInstallRequest`

Each `render.dependency_install_requests[]` item records an npm dependency the project must install before `xingchen-visual-compiler` can implement declared `remotion_animation_depth.l2/l3_capabilities_used[]` capabilities. Written when visual-compiler detects the target `package.json` is missing a required `@remotion/*` subpackage or physics-engine package.

Minimum fields:

- `request_id`
- `scene_ids[]`: scenes that need the package
- `packages[]`: npm package names (e.g. `["@remotion/three", "three", "@react-three/fiber", "@react-three/drei"]`)
- `reason`: text linking the requirement to specific capabilities (e.g. "scene-S03 declares `three_3d_canvas` and `media_utils_audio_data` in `l3_capabilities_used` but project package.json has neither installed")
- `install_command`: the exact shell command (e.g. `npm i @remotion/three three @react-three/fiber @react-three/drei`)
- `status`: `pending` / `installed` / `failed`
- `installed_at`: ISO 8601 timestamp filled by codex after running `npm i`

`INV-REMOTION-ANIMATION-DEPTH` forbids visual-compiler from downgrading to L0/L1 just because packages are missing—it must write a `DependencyInstallRequest`, wait for codex to install, then continue.

### `RenderRoute`

Minimum fields:

- `default_mode`
- `hero_shot_mode`
- `mixed_scene_requires_explicit_opt_in`

Allowed values:

- `code_primary`
- `gen_insert`
- `mixed_scene`

`RenderRoute` values are high-level policy. Renderer families such as `spark_3dgs`, `html_scene`, or `remotion_component` live inside scene motion specs and render-pack scenes; they must not replace `code_primary`.

### `SceneMotionSpec`

Each scene motion spec should include:

- `scene_id`
- `dominant_anchor`
- `proof_strategy`
- `motion_stack`
- `subtitle_avoidance`
- `camera_intent`
- `render_mode`
- `renderer_family`
- `execution_runtime`
- `motion_source`
- `integration_mode`
- `candidate_skill`
- `promotion_target_renderer_family`
- `screen_recording_clip_ids`
- `frame_strategy`
- `asset_fit_policy`
- `distortion_policy`
- `anchor_region`
- `proof_regions`
- `subtitle_safe_region`
- `z_order_plan`
- `camera_window`
- `geometry_risks`
- `director_board_scene_id`
- `brainstorming_trace`
- `continuity_handles_used`
- `anti_ppt_decision`
- `edge_in_trace`
- `edge_out_trace`
- `transition_primitives`
- `scene_option_menu`
- `selected_option_type`
- `vibemotion_candidate_ids`
- `hyperframes_candidate_ids`
- `ai_video_prompt_request_ids`
- `ai_video_candidate_ids`
- `remotion_promotion_notes`
- `spark_asset_need`
- `visual_style_trace`
- `scene_contract_trace`
- `prop_controls`
- `lookdev_style_checks`
- `component_path`: file path to the React component (.tsx) implementing this scene. Lookdev audits scan this file for forbidden patterns, asset imports, animation depth API usage, and camera motion magnitudes.
- `remotion_animation_depth_actual`: object reporting what visual-compiler actually implemented (cross-checked against the director-board declaration in `concrete_execution_plan.remotion_animation_depth`). Fields:
  - `l2_capabilities_detected[]`: L2 capabilities found in the .tsx by grep (e.g. `["spring_physics", "real_camera_motion"]`)
  - `l3_capabilities_detected[]`: L3 capabilities found
  - `physics_implementation`: text describing how physics was implemented (e.g. "spring + matter-js for 7 cascade materials")
  - `camera_implementation_scale_range`: `[min, max]` actual scale interpolate output range detected
  - `camera_implementation_translate_px`: actual cumulative translate magnitude detected
  - `grep_evidence_paths[]`: source-file paths + line numbers where each declared capability was detected (e.g. `["src/SceneS03.tsx:42-58", "src/SceneS03.tsx:120"]`)
  Lookdev `rule_id=remotion_animation_depth_check` and `rule_id=camera_motion_check` use these fields to verify the .tsx implementation matches the director-board declaration.

When a visual influence such as `vox_remotion_visual_style` is selected, `visual_style_trace`, `scene_contract_trace`, `prop_controls`, and `lookdev_style_checks` are required trace fields on non-rest scene specs before render planning proceeds. They should summarize the selected traits, the mapped scene contract, the exposed Studio/props controls, and the full style-specific lookdev rule set: `scene_contract_check`, `world_continuity_check`, `layer_stack_check`, `remotion_proof_ownership_check`, `bitmap_text_ocr_check`, `mobile_downsample_check`, `safe_zone_overlap_check`, `foreground_dominance_check`, `red_marker_semantics_check`, `beat_sync_check`, `motion_density_check`, `final_hold_frame_check`, `prop_control_smoke_test`, and `proof_source_trace_check`. Missing fields should route to manual/lookdev review rather than silently passing.

These geometry-facing fields exist so downstream renderers do not improvise crop, stretch, overlay order, or proof placement under deadline pressure. `director_board_scene_id` must point to the matching `visual.director_board.scene_boards[].scene_id`; `brainstorming_trace`, `continuity_handles_used`, and `anti_ppt_decision` must carry the selected scene-picture reasoning into execution. Adjacent transitions must compile from `visual.director_board.scene_edge_boards[]` into `edge_in_trace`, `edge_out_trace`, and `transition_primitives` so scene flow is not replaced by a default fade or slide cut.

`scene_option_menu` should carry the per-scene VibeMotion discussion options. The default option types are `recommended`, `bold`, and `safe`. If the pipeline proceeds without an explicit user selection, `selected_option_type` may be `recommended`, but the related candidate should keep `selected_by_user: false`.

`spark_asset_need` should be present only when the scene truly needs a 3D model, 3DGS asset, spatial traversal, or world plate. Spark is not a generic background or proof route.

Route semantics:

- Remotion final scenes should normally use `execution_runtime: "remotion"` and `promotion_target_renderer_family: "remotion_component"` when promoted from another source.
- VibeMotion-sourced final scenes should use `motion_source: "vibemotion_skill"` and record `integration_mode`, `candidate_skill`, and `promotion_target_renderer_family`.
- Hyperframes-sourced final scenes should use `motion_source: "hyperframes_runtime"` and record `integration_mode`, `hyperframes_candidate_ids`, `source_html_path` or equivalent source reference, and `promotion_target_renderer_family`.
- AI-video-sourced final scenes should use `render_mode: "gen_insert"` or `"mixed_scene"`, `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, `ai_video_candidate_ids`, and `promotion_target_renderer_family: "remotion_component"`.
- Spark scenes should use `execution_runtime: "spark_browser_canvas"`, `motion_source: "spark_runtime"`, and `integration_mode: "browser_canvas_plate"`.
- Marble/World Labs world assets remain Spark scene assets, not a separate renderer family. A Marble SPZ/PLY/splat export uses `world_asset.source_kind: "marble"`, `route_status: "true_3dgs_asset"`, and `actual_renderer_family: "spark_3dgs"`. A Marble GLB export uses `route_status: "hybrid_spark_three"` and `actual_renderer_family: "spark_hybrid_three"`. A Marble panorama/PNG export is only `fallback_preview` or explicitly approved fallback final.
- `renderer_family: "vibemotion_candidate"` is a lookdev transition state only and must not remain at render.
- Screen recording scenes should use `motion_source: "existing_media"`, `integration_mode: "video_plate"`, `promotion_target_renderer_family: "remotion_component"`, and reference `visual.screen_recording_brief.clips[]` with `screen_recording_clip_ids`.

### `VibeMotionCandidate`

Each item in `render.vibemotion_candidates` is a real review candidate, not a text-only direction.

Minimum fields:

- `candidate_id`
- `scene_ids`
- `option_type`
- `generator_skill`
- `technical_route`
- `output_path`
- `output_kind`
- `review_status`
- `motion_source`
- `candidate_origin`
- `state_trace_refs`
- `integration_mode`
- `promotion_target_renderer_family`
- `selected_by_user`
- `promotion_rule`
- `notes`

Allowed `option_type` values are `recommended`, `bold`, and `safe`.

Allowed `technical_route` values are `vibemotion_video`, `vibemotion_html`, `remotion_component`, and `spark_plate_plus_remotion`.

Allowed `output_kind` values are `mp4`, `mov`, `html`, `component`, and `transparent_asset`.

Allowed `review_status` values are `pending`, `approved`, `rejected`, and `needs_revision`.

`motion_source` must be `vibemotion_skill`.

Allowed `candidate_origin` values are:

- `generated_from_current_state`
- `primitive_reference_adapted_to_current_state`

`state_trace_refs[]` must point back to the current project's StoryMother, visual policy, scene decisions, recording brief, or scene motion spec. It is the guardrail that keeps VibeMotion from becoming a fixed skill-template output.

The default `promotion_rule` is `approved_candidate_may_be_compiled_into_remotion_final`. A candidate cannot become final delivery evidence unless lookdev approves it and the Remotion adapter records how it was promoted.

At `metadata.active_stage >= "render"`, any approved candidate must record `integration_mode` and `promotion_target_renderer_family`.

### `HyperframesCandidate`

Each item in `render.hyperframes_candidates` is a real review candidate, not a text-only prompt.

Minimum fields:

- `candidate_id`
- `scene_ids`
- `option_type`
- `generator`
- `technical_route`
- `source_path`
- `output_path`
- `output_kind`
- `review_status`
- `motion_source`
- `candidate_origin`
- `state_trace_refs`
- `integration_mode`
- `promotion_target_renderer_family`
- `selected_by_user`
- `promotion_rule`
- `notes`

Allowed `option_type` values are `recommended`, `bold`, and `safe`.

Allowed `technical_route` values are `hyperframes_html`, `hyperframes_canvas`, `hyperframes_lottie`, `hyperframes_three`, and `hyperframes_asset`.

Allowed `output_kind` values are `mp4`, `mov`, `html`, `component`, and `transparent_asset`.

Allowed `review_status` values are `pending`, `approved`, `rejected`, and `needs_revision`.

`motion_source` must be `hyperframes_runtime`.

Allowed `candidate_origin` values are:

- `generated_from_current_state`
- `primitive_reference_adapted_to_current_state`

`state_trace_refs[]` must point back to the current project's StoryMother, visual policy, scene decisions, proof boundaries, script timing, or scene motion spec. It is the guardrail that keeps Hyperframes from becoming a fixed HTML visual template.

The default `promotion_rule` is `approved_candidate_must_promote_to_html_canvas_or_remotion`. A candidate cannot become final delivery evidence unless lookdev approves it and the final scene records whether it remains an HTML/canvas plate, becomes a transparent asset, or is rewritten/copied into Remotion.

At `metadata.active_stage >= "render"`, any approved Hyperframes candidate must record `integration_mode` and `promotion_target_renderer_family`.

### `AIVideoPromptRequest`

Each item in `render.ai_video_prompt_requests` is a prompt-only handoff for manual platform generation. It does not require an output file and does not satisfy final render by itself.

Minimum fields:

- `request_id`
- `scene_ids`
- `option_type`
- `provider`: `seedance`, `runway`, `pika`, `kling`, `luma`, or `other_ai_video`
- `provider_model_hint`
- `technical_route`: `text_to_video`, `image_to_video`, `video_to_video`, or `reference_guided_video`
- `prompt_pack_path`
- `prompt_path`
- `prompt_text`
- `negative_prompt`
- `output_expectation`
- `status`: `drafted`, `handed_to_user`, `generated`, `cancelled`, or `blocked`
- `state_trace_refs`
- `proof_exclusion_policy`
- `remotion_integration_plan`
- `handoff_instructions`
- `expected_candidate_id`
- `notes`

Use this when Codex lists prompts and the user generates the video on a platform manually. Once the user returns a file path, create the matching `render.ai_video_candidates[]` item and adapter trace.

### `AIVideoCandidate`

Each item in `render.ai_video_candidates` is a generated video plate candidate, not proof and not a final renderer.

Minimum fields:

- `candidate_id`
- `prompt_request_id` when derived from a prompt request
- `scene_ids`
- `option_type`
- `provider`: `seedance`, `runway`, `pika`, `kling`, `luma`, or `other_ai_video`
- `provider_model`
- `technical_route`: `text_to_video`, `image_to_video`, `video_to_video`, or `reference_guided_video`
- `prompt_path`
- `prompt_text`
- `negative_prompt`
- `output_path`
- `output_kind`: `mp4`, `mov`, `webm`, or `image_sequence`
- `review_status`
- `motion_source`: always `ai_video_generation`
- `candidate_origin`: `generated_from_current_state` or `reference_guided_from_current_state`
- `state_trace_refs`
- `proof_exclusion_policy`
- `remotion_integration_plan`
- `safety_review`
- `integration_mode`: `video_plate` when approved
- `promotion_target_renderer_family`: `remotion_component` when approved
- `selected_by_user`
- `promotion_rule`
- `notes`

`negative_prompt` and `proof_exclusion_policy` must explicitly exclude readable claims, proof/evidence UI, subtitles, logos, faces, and false factual content. `remotion_integration_plan` must say how Remotion owns proof overlays, captions, timing, and final assembly. Every candidate must be linked by `render.plugin_adapter_runs[].candidate_ids[]`.

### `PluginAdapterRun`

Each item in `render.plugin_adapter_runs` records a concrete adapter use that generated, previewed, promoted, rejected, or blocked a scene artifact. In Codex this may be a plugin; in Claude Code this is usually a local CLI, synced local skill, manual implementation, or user-returned platform file registration. This keeps HyperFrames, Remotion, and AI video work inside Xingchen state instead of becoming a parallel truth.

Minimum fields:

- `run_id`
- `adapter_kind`: `codex_plugin`, `local_cli`, `local_skill`, `manual_implementation`, or `external_api`
- `adapter_id`
- `plugin_id`: optional compatibility alias for Codex plugin adapter ids
- `skill_name`
- `scene_ids`
- `input_state_refs`
- `output_paths`
- `state_writebacks`
- `status`
- `candidate_ids`
- `promotion_target_renderer_family`
- `lookdev_evidence_required`
- `notes`

Allowed `skill_name` values:

- `HyperFrames by HeyGen:hyperframes`
- `HyperFrames by HeyGen:hyperframes-cli`
- `HyperFrames by HeyGen:hyperframes-registry`
- `HyperFrames by HeyGen:gsap`
- `HyperFrames by HeyGen:website-to-hyperframes`
- `Remotion:remotion`
- `hyperframes-cli`
- `hyperframes-local-skill`
- `remotion-render-adapter`
- `manual-hyperframes-implementation`
- `open-design-original`
- `manual-remotion-implementation`
- `seedance-api`
- `manual-ai-video-api`

Allowed `status` values are `planned`, `generated`, `previewed`, `promoted`, `rejected`, and `blocked`.

Rules:

- HyperFrames outputs that create review candidates must be registered in both `render.hyperframes_candidates[]` and `render.plugin_adapter_runs[]`.
- AI video prompt handoffs are registered in `render.ai_video_prompt_requests[]`. Once the user returns generated files, register them in both `render.ai_video_candidates[]` and `render.plugin_adapter_runs[]`; use `adapter_kind: "manual_implementation"` with `manual-ai-video-api` for user-generated files, or `external_api` with `seedance-api` only when Codex actually called an API.
- Remotion implementation or promotion work should reference the affected `render.scene_motion_specs[]`, `render.jobs[]`, or render-pack paths in `state_writebacks`.
- Open Design original skill work uses `skill_name: "open-design-original"` and `adapter_id: "open-design-original:<skill-name>@d5aeab77fc4e"`; record selected/rejected traits in `notes` and the Open Design intake record.
- `scene_ids[]` must point to StoryMother scenes.
- `input_state_refs[]` must name the director-board, scene spec, visual policy, proof, script, or render-pack state paths consumed.
- `output_paths[]` and `state_writebacks[]` are required once a run leaves `planned` or `blocked`.
- Adapter runs do not satisfy Visual Lock by themselves and cannot replace `visual.director_board`.

Spark 2.0 / 3DGS scenes use `renderer_family: "spark_3dgs"` and should additionally include:

- `spark_asset_route`
- `spark_effect_route`
- `spark_runtime_profile`
- `world_asset`
- `route_status`
- `actual_renderer_family`
- `camera_path`
- `composite_role`
- `capture_policy`
- `fallback_strategy`
- `performance_budget`

Allowed Spark route statuses are `true_3dgs_asset`, `streaming_rad_world`, `procedural_splat_world`, `hybrid_spark_three`, `fallback_preview`, `blocked_missing_asset`, and `approved_fallback_final`.

Spark route rules live in [spark-3dgs-world-route.md](./spark-3dgs-world-route.md). Spark is a 3D model, 3DGS, and spatial world-asset route, not a proof renderer, voice layer, subtitle engine, generic background template, or full-project fallback. Procedural Spark `constructSplats` plates must be recorded as `procedural_splat_world`, not as true 3DGS assets.

### `RenderJob`

Each render job written by `prepare-render` should include:

- `job_id`
- `variant_id`
- `status`
- `lookdev_evaluation_id`
- `lookdev_status`
- `manual_review_override_used`
- `source_hash`
- `state_path`
- `video_project_path`
- `render_plan_path`
- `lookdev_result_path`
- `output_path`
- `created_at`
- `updated_at`

When `complete-render` records a truthful completion, the matching job should additionally carry:

- `status` set to `completed`
- `assembly_mode`
- `silent_video_path`
- `final_output_path`
- `assembly_log_path`
- `completed_at`
- `updated_at`
- `voice_path` when the assembly mode uses voice
- `bgm_path` when the assembly mode uses background music

The canonical state should also move to:

- `render.status = completed`
- `metadata.active_stage = publish`
- `workflow.blocked = false`
- `publish.status = ready`

Successful completion should append a minimal breadcrumb to `workflow.stage_history` describing the `render -> publish` transition.

## `publish`

This section records what was actually shipped.

Minimum fields:

- `status`
- `records`

### `PublishRecord`

Minimum fields:

- `publish_id`
- `variant_id`
- `platform`
- `title`
- `cover_ref`
- `published_at`
- `status`
- `metrics_snapshot`

## `review`

This section stores non-destructive learning.

`review.lookdev_gate_results` may contain either:

- raw legacy-imported audit objects copied verbatim from old bundles
- normalized evaluator results produced by Xingchen Next

For geometry-heavy or proof-heavy work, the normalized evaluator results should also carry the findings from the scene composition audit instead of leaving them in informal review notes.

When the entries came from legacy import, preserve the legacy audit objects verbatim. When the entries came from the evaluator, use the normalized `LookdevGateResult` shape below.

### `PerformanceReview`

Minimum fields:

- `review_id`
- `publish_id`
- `metric_summary`
- `qualitative_findings`
- `next_time_recommendations`

### `LookdevGateResult`

Minimum fields:

- `evaluation_id`
- `rule_results`
- `blocking_scene_ids`
- `status`
- `reason`
- `aesthetic_review_findings`

Recommended fields:

- `unsupported_rule_ids`
- `manual_review_required_rule_ids`
- `geometry_findings`
- `spark_route_findings`
- `vibemotion_candidate_findings`
- `selected_aesthetic_mode`
- `mode_tradeoff_notes`

The evaluator-backed payload may use `passed`, `failed`, or `manual_review_required` for `status`.

Rule results may use `passed`, `failed`, `unsupported`, or `not_evaluated` so incomplete gates stay honest.

Status propagation rules:

- if any blocking machine rule fails, overall `status` must be `failed`
- if no blocking machine rule fails, but any required aesthetic or review-only rule is `unsupported`, `not_evaluated`, or otherwise unresolved, overall `status` must be `manual_review_required`
- overall `status` may be `passed` only when all blocking machine rules passed and no required review-only rule remains unresolved

Unsupported aesthetic rules must not be treated as pass; they should push the result to `manual_review_required` until a human resolves them.

### `AestheticReviewFinding`

Minimum fields:

- `finding_id`
- `scene_ids`
- `rule_id`
- `status`
- `observation`
- `recommended_action`

When aesthetic judgment is part of the review, the finding should capture the chosen strategy and the specific failure or uncertainty instead of a vague overall taste label.

## `exports`

Track the latest derived packs here.

Minimum fields:

- `review_pack`
- `render_pack`
- `publish_pack`
- `legacy_pack`

## Invariants

- `project-state.json` outranks every derived artifact
- shipped truth may be reviewed, but not rewritten in place
- legacy artifacts may be imported or exported, but they do not regain canonical status
- `variants[*]` must trace back to exactly one `StoryMother` through `mother_id`
- `art-direction.md`, `visual-language-kit.json`, and `lookdev-gate.yaml` are derived review surfaces once state exists
