# Project State Contract

## Canonical File

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
- `status`

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
- `brainstorming_layer` records the `superpowers/brainstorming` scene-picture pass: scene question, knowledge action, options considered, selected direction, continuity handles, and anti-PPT decision.
- `aesthetic_layer` records scene role, color temperature, density, energy level, contrast to previous scene, and cheapness risks.
- `frame_layer` records main frame design, dominant anchor, layout pattern, camera path, depth plan, proof regions, and subtitle safe region.
- `detail_layer` records lighting, material surface, typography role, motion verbs, micro interactions, and failure risks.
- `component_layer` records primary component, supporting components, component props, fallback, and whether kit extension is needed.
- `subtitle_layer` records subtitle mode, position, keyword highlights, `must_not_cover[]`, and voice relationship.
- `tech_stack_layer` records primary stack, integration mode, stack reason, rejected stacks, and preview requirement.

Allowed `tech_stack_layer.primary_stack` values are `remotion`, `html_3d`, `hyperframes`, `spark`, `vibemotion`, `source_media`, and `gen_insert`.

This section is more than a summary. It is the scene-by-scene director board that later aesthetic, compiler, and lookdev work must consume.

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
- `plugin_adapter_runs`
- `scene_motion_specs`
- `jobs`
- `status`

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

These geometry-facing fields exist so downstream renderers do not improvise crop, stretch, overlay order, or proof placement under deadline pressure. `director_board_scene_id` must point to the matching `visual.director_board.scene_boards[].scene_id`; `brainstorming_trace`, `continuity_handles_used`, and `anti_ppt_decision` must carry the selected scene-picture reasoning into execution. Adjacent transitions must compile from `visual.director_board.scene_edge_boards[]` into `edge_in_trace`, `edge_out_trace`, and `transition_primitives` so scene flow is not replaced by a default fade or slide cut.

`scene_option_menu` should carry the per-scene VibeMotion discussion options. The default option types are `recommended`, `bold`, and `safe`. If the pipeline proceeds without an explicit user selection, `selected_option_type` may be `recommended`, but the related candidate should keep `selected_by_user: false`.

`spark_asset_need` should be present only when the scene truly needs a 3D model, 3DGS asset, spatial traversal, or world plate. Spark is not a generic background or proof route.

Route semantics:

- Remotion final scenes should normally use `execution_runtime: "remotion"` and `promotion_target_renderer_family: "remotion_component"` when promoted from another source.
- VibeMotion-sourced final scenes should use `motion_source: "vibemotion_skill"` and record `integration_mode`, `candidate_skill`, and `promotion_target_renderer_family`.
- Hyperframes-sourced final scenes should use `motion_source: "hyperframes_runtime"` and record `integration_mode`, `hyperframes_candidate_ids`, `source_html_path` or equivalent source reference, and `promotion_target_renderer_family`.
- AI-video-sourced final scenes should use `render_mode: "gen_insert"` or `"mixed_scene"`, `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, `ai_video_candidate_ids`, and `promotion_target_renderer_family: "remotion_component"`.
- Spark scenes should use `execution_runtime: "spark_browser_canvas"`, `motion_source: "spark_runtime"`, and `integration_mode: "browser_canvas_plate"`.
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
- `manual-remotion-implementation`
- `seedance-api`
- `manual-ai-video-api`

Allowed `status` values are `planned`, `generated`, `previewed`, `promoted`, `rejected`, and `blocked`.

Rules:

- HyperFrames outputs that create review candidates must be registered in both `render.hyperframes_candidates[]` and `render.plugin_adapter_runs[]`.
- AI video prompt handoffs are registered in `render.ai_video_prompt_requests[]`. Once the user returns generated files, register them in both `render.ai_video_candidates[]` and `render.plugin_adapter_runs[]`; use `adapter_kind: "manual_implementation"` with `manual-ai-video-api` for user-generated files, or `external_api` with `seedance-api` only when Codex actually called an API.
- Remotion implementation or promotion work should reference the affected `render.scene_motion_specs[]`, `render.jobs[]`, or render-pack paths in `state_writebacks`.
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

Spark route rules live in [spark-3dgs-world-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\spark-3dgs-world-route.md). Spark is a 3D model, 3DGS, and spatial world-asset route, not a proof renderer, voice layer, subtitle engine, generic background template, or full-project fallback. Procedural Spark `constructSplats` plates must be recorded as `procedural_splat_world`, not as true 3DGS assets.

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
