# Cross-Skill Invariants

These are the non-negotiable rules for the entire `xingchen-*` family.

Every SKILL.md in the family references these by ID only. The full statement lives here, once. If a rule is contested or changed, edit it here and only here.

If a rule applies to a single skill (and is genuinely local), it stays in that skill's SKILL.md under `Skill-local rules`. Anything that constrains more than one skill belongs in this file.

## INV-STATE-TRUTH

`project-state.json` outranks every derived artifact, exported pack, review surface, or legacy bundle. Once state exists, no other file becomes parallel canonical truth.

## INV-SOURCE-PACK-TRACE

Every project must register the user's actual input reality in `sources.source_pack` before it becomes proof or script: thesis, audience, goal, and at least one source material item such as links, notes, screenshots, draft recordings, screen recordings, existing assets, or transcript segments. Media inputs require `sources.asset_manifest[]` entries with asset ids, file paths, asset types, and review status.

## INV-RECORDING-CORRECTION-BEFORE-VISUAL

Recording-first projects must correct and inspect narration before visual design. Before `visual-direction`, `sources.recording_correction` must record source audio refs, cleaned or accepted audio paths, transcript path, cleanup report path, correction actions, and quality checks. Director boards cannot be built from raw audio guesswork.

## INV-TOPIC-LOCK-FIRST

`Topic Lock` must be `approved` before `script` or `story-mother` work begins. Locks `thesis`, `audience`, `goal`.

## INV-SCRIPT-LOCK-BEFORE-MOTHER

`Script Lock` must be `approved` before `story-mother` work begins. Locks spoken wording, narration spine, proof boundaries, and beat truth.

## INV-MOTHER-LOCK-BEFORE-VARIANT

`StoryMother Lock` must be `approved` before `visual-direction` or `platform-adapt`. A platform variant cannot be derived from an unlocked mother.

## INV-VISUAL-LOCK-BEFORE-RENDER

`Visual Lock` must be `approved` before any render-bound work. Locks `visual.director_board`, `visual.visual_policy`, `lookdev_gate`, scene motion intent, and the derived director/art-direction review surfaces.

## INV-LOOKDEV-BEFORE-RENDER

`Lookdev Approval` must be `approved` (or `manual_review_required` with explicit human override) before render execution. The runtime check is `metadata.active_stage === "render"` ⇒ `workflow.approvals[Lookdev Approval].status !== "pending"`.

## INV-NO-GEN-DEFAULT

Generated-image/video inserts (`gen_insert` / `mixed_scene`) must not become the default renderer for a piece. `code_primary` is the project default and the per-scene default. Generated inserts must stay scoped to named scenes and may not carry proof, subtitles, narration timing, or final assembly ownership.

## INV-NO-VIBEMOTION-FINAL

VibeMotion candidates are review evidence. They cannot become final delivery without (a) `Lookdev Approval` recording the candidate's `review_status: "approved"`, (b) the candidate recording `candidate_origin` plus non-empty `state_trace_refs[]`, and (c) the final route recording `integration_mode` and `promotion_target_renderer_family`. `renderer_family: "vibemotion_candidate"` is blocked at `active_stage >= "render"`.

## INV-NO-HYPERFRAMES-UNPROMOTED-FINAL

Hyperframes candidates are review evidence and HTML/canvas scene sources. They cannot become final delivery without (a) `Lookdev Approval` recording the candidate's `review_status: "approved"`, (b) the candidate recording `candidate_origin` plus non-empty `state_trace_refs[]`, and (c) the final route recording `motion_source: "hyperframes_runtime"`, `integration_mode`, and `promotion_target_renderer_family`. Hyperframes must not silently become the full-video controller for narration, subtitles, proof overlays, audio assembly, platform variants, or final export.

## INV-PLUGIN-ADAPTER-TRACE

Codex plugins, local CLIs, local skills, and manual implementations are execution adapters, not planning authorities. Any adapter-created or adapter-promoted scene artifact must append `render.plugin_adapter_runs[]` with `adapter_kind`, `adapter_id`, concrete skill/command lane, scene ids, input state refs, output paths, state writebacks, status, candidate ids when applicable, promotion target renderer family, and lookdev evidence requirement. HyperFrames candidates must also appear in `render.hyperframes_candidates[]` and be linked by `candidate_ids[]`. Adapter runs cannot replace `visual.director_board` or bypass Visual Lock.

## INV-AI-VIDEO-GEN-INSERT

External AI video generation, including Seedance-style platform output, is a bounded visual-upgrade candidate lane. It starts as `render.ai_video_prompt_requests[]` when Codex only prepares prompts for the user to run manually, and becomes `render.ai_video_candidates[]` only after a real generated file exists. Prompt requests may be written only after `visual.director_board.scene_boards[].tech_stack_layer.primary_stack` selects `gen_insert` with a concrete visual-gap reason, proof exclusion policy, Remotion `video_plate` integration, and preview requirement. AI video candidates must record provider/model, prompt and negative prompt, current-state trace refs, safety review, output path, and a matching `render.plugin_adapter_runs[]` entry with `adapter_kind: "external_api"` or `manual_implementation`. Final render specs must keep `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, `promotion_target_renderer_family: "remotion_component"`, and `ai_video_candidate_ids[]`. Generated video cannot carry hero proof, readable claims, UI evidence, subtitles, logos, faces, or false factual content.

## INV-NO-SILENT-PASS

When an approval rule is `unsupported` or `not_evaluated`, the overall result must route to `manual_review_required`. Unsupported rules cannot pass silently. This applies to both machine gates and aesthetic checks.

## INV-PROOF-FRAME-STRATEGY

Render-bound scenes that carry literal proof (screenshots, UI captures, terminals, charts, PDFs) must record explicit `frame_strategy`, `distortion_policy`, `anchor_region`, `proof_regions`, `subtitle_safe_region`, and `z_order_plan` on their `SceneMotionSpec`. Render adapters may not improvise crop, stretch, or overlay order under deadline pressure.

## INV-NO-PARALLEL-TRUTH

`art-direction.md`, `visual-language-kit.json`, and `lookdev-gate.yaml` are derived review surfaces once `project-state.json` exists. Editing decisions go to state first, then re-export the surfaces.

## INV-NO-MOTHER-REWRITE-ON-VARIANT

A `PlatformVariant` may change hook, pacing density, subtitle policy, title, cover brief, and limited scene packaging. It must not silently rewrite `core_thesis`, `proof_binding` meaning, or `mother.story_mother.scene_order` unless the rewrite is explicitly recorded in `variants[*].scene_adjustments` and re-approved.

## INV-HOOK-DESIGN-REQUIRED

Every Douyin-bound project must record a `hook_design` in `project-state.json.visual` before `Visual Lock`. The hook design must name the chosen hook pattern, pass the thumb-stop self-test, and record `hook_energy_level` as the ceiling for the energy curve. See [douyin-hook-science.md].

## INV-ENERGY-CURVE-REQUIRED

Every project must assign energy levels (1-10) to each scene during story mother construction. The energy curve must pass the three-act shape check (assault / build / payoff) and must not be a flatline, all-peaks, or slow-start anti-pattern. See [energy-density-map.md].

## INV-MONOTONY-CHECK

Before `Visual Lock`, the visual direction must pass the variety checkpoint: at least 4 of 6 contrast dimensions (color temperature, layout structure, element scale, visual density, motion character, background world) must show meaningful variation across the piece. See [visual-contrast-system.md].

## INV-SPARK-NEEDS-ASSET

`renderer_family: "spark_3dgs"` may be selected only when the scene records a real `spark_asset_need`: a 3D model, real 3DGS asset, streaming RAD world, procedural splat world, hybrid Spark+Three world plate, spatial traversal, or material/light/volume/effect attached to a justified world asset. Spark scenes must preserve `execution_runtime: "spark_browser_canvas"` and should enter final composition as browser canvas plates. Spark is never the default for proof, UI, generic backgrounds, subtitles, voice, or final audio assembly.

## INV-SCREEN-RECORDING-ROUTE

Screen recordings are existing source media. They may be used as `evidence_clip` or `source_media_plate`, but the recording itself must not be routed through VibeMotion, Hyperframes, or Spark. Record `motion_source: "existing_media"`, `integration_mode: "video_plate"`, and `promotion_target_renderer_family: "remotion_component"`; use Remotion for crop, zoom, redaction, subtitles, callouts, and final composition.

## INV-SOURCE-MATERIAL-DIRECTOR-PLAN

If screenshots, recordings, screen recordings, or existing media assets enter the project, Visual Lock requires `visual.source_material_plan[]`. The plan must say which scene uses which source asset or screen-recording clip, what role it plays, and how it will be treated visually. Media may be rejected or marked reference-only, but it cannot disappear silently between ingest and render.

## INV-MATERIAL-DIRECTOR-PASS

`visual.material_director_pass` is retained as compatibility evidence for source-led projects. New projects should express this work through `visual.director_board`, which is the primary Visual Lock gate.

## INV-DIRECTOR-BOARD

Visual Lock requires `visual.director_board`. The board must read the user's material unit by unit, read recording/transcript rhythm when present, bind every StoryMother scene to source units and narration beats, and specify source, arrangement, aesthetic, frame, detail, component, subtitle, tech-stack, and lookdev-acceptance layers for every scene. HTML 3D must state camera/depth purpose, Spark must state spatial/world reason plus preview requirement, VibeMotion must stay supporting/candidate only, and subtitles must declare safe regions plus `must_not_cover[]`.

## INV-BRAINSTORMING-BEFORE-PICTURE

Every scene picture in `visual.director_board.scene_boards[]` must include a `brainstorming_layer` produced with the `superpowers/brainstorming` method. It must record the scene question, knowledge action, at least two visual options considered, selected direction, why selected, continuity handles, and an anti-PPT decision. Knowledge videos may use designed concept handles such as keywords, numbers, frames, arrows, proof regions, and color logic; physical objects are not required.

## INV-SCENE-EDGE-FLOW

Every adjacent StoryMother scene pair must have a `visual.director_board.scene_edge_boards[]` entry. The edge board must record the bridge question, options considered, selected bridge, narrative bridge, continuity handle kind, out/in handles, transition method, cut moment, duration, anti-PPT risk, and lookdev acceptance. Its out/in handles must reference real `scene_boards[].brainstorming_layer.continuity_handles[]` ids. This makes flow a director decision rather than a post-production effect.

## INV-COMPILED-DIRECTOR-TRACE

`xingchen-visual-compiler` must carry the director board into `render.scene_motion_specs[]`. Each render-bound scene must preserve `brainstorming_trace`, `continuity_handles_used[]`, and `anti_ppt_decision` from its scene board. Adjacent scene edges must compile into `edge_in_trace`, `edge_out_trace`, and `transition_primitives[]`. A scene spec that only back-references the director board but omits these execution traces is not ready for platform adaptation.

## INV-DIRECTOR-PLAN-BEFORE-RENDER

Rendering cannot begin from isolated renderer prompts. A project must first have script beats, a locked StoryMother, scene cards, proof binding, narration spine, visual scene decisions, and render scene motion specs that trace back to the StoryMother. Render adapters compile the director plan; they do not invent the film.

## INV-FINAL-RENDER-JOB-TRACE

At `metadata.active_stage >= "render"`, `render.jobs[]` must identify the render job, variant, lookdev status, state path, video-project path, render-plan path, and output path. Final video generation must be traceable as an execution job, not just implied by a renderer choice.

## INV-HERO-FRAME-REQUIRED

Every project must identify a `hero_frame_scene_id` in `project-state.json.visual` during story mother construction. The hero frame is the single scene carrying the thesis's strongest visual proof. During visual direction, the hero frame must receive 2-3x the scale of any other element in the video. A project where no frame stands out visually above the rest has failed this invariant.

## INV-SCENE-JOB-NAMED

Every scene in the story mother must have an explicit `job` label: one of `hook`, `context`, `proof`, `build`, `peak`, `rest`, `payoff`, `close`. Two consecutive scenes with the same job require explicit justification. A scene without a named job cannot enter visual direction.

## INV-SCENE-DECISION-CARD

Before visual direction, every scene must record a decision card in `project-state.json.visual.scene_decisions[]` containing: `job`, `energy_level` (1-10), `layout_pattern`, `color_temperature_direction`, `is_scale_moment` (boolean), `evidence_role` (hero/supporting/background/none), `motion_character` (snappy/smooth/slow/held), `density` (minimal/moderate/dense). Scenes without decision cards cannot proceed to lookdev.
