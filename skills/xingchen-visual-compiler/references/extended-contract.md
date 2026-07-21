# Extended Contract

> This historical contract applies only when project-state.json uses mode extended or a legacy state has no mode field. It does not add gates or required fields to Lean projects.


# Xingchen Visual Compiler

## Lean Mode Override

When `project-state.json.mode === "lean"`, this section overrides every later conflicting requirement in this file.

- Compile from the Lean scene contract: `knowledge_change`, `dominant_visual`, `motion_action`, `proof_ref`, `safe_region`, `timing`, and `implementation`.
- Build the hook, hardest explanation or proof, and payoff as real playable prototypes before full production.
- Preserve proof geometry, subtitle safety, deterministic rendering, and real-audio timing.
- Judge motion by its semantic job: reveal, compare, trace, build, transform, hold, or resolve.
- Do not require a StoryMother, Visual Lock, eight-layer board, edge board for every transition, or global resource preflight.
- Do not require L2/L3 APIs, camera amplitude, `spring()`, particles, parallax, 3D, physics, dependency installation, or one asset per noun.
- Treat API inventory and adapter traces as diagnostics when they help debugging, not as video-quality evidence.
- Allow held frames and restrained motion when they improve comprehension.

All later L2/L3 quotas, camera thresholds, physics mandates, and five-lock references apply only to Extended or legacy projects.

## Knowledge Base Routing

For reusable video methodology, read stevenmind first:

- `C:\stevenmind\stevenmind\04 Wiki\视频创作\`
- `C:\stevenmind\stevenmind\04 Wiki\共享方法论\`
- `C:\stevenmind\stevenmind\04 Wiki\技术栈\`
- `C:\stevenmind\stevenmind\04 Wiki\抖音\` non-legacy pages

Do not read `C:\stevenmind\stevenmind\04 Wiki\公众号创作\`. That domain belongs to `wechat-*`.

Use local `references/`, `schema/`, and validators for executable contracts only: state fields, route policies, INV rules, validator logic, runtime commands, and rollback evidence. If a wiki page and a local reference overlap, use the wiki for method wording and the local reference for machine/state requirements.

Before crossing domains, verify with:

```powershell
python C:\stevenmind\stevenmind\tools\vault_manager.py read-check --root C:\stevenmind\stevenmind --skill xingchen-next --page "{page}"
```
## When to enter

Triggered during `visual-direction` (second half), after `xingchen-art-direction` exports `art-direction.md` / `visual-language-kit.json` / `lookdev-gate.yaml`, before `video-project-graph` and `xingchen-lookdev`. The job is effect-first scene packaging under the approved direction — never template-first. Do not mutate thesis, proof meaning, or platform strategy here. Do not invent a new visual language after Visual Lock.

Also require `project-state.json.visual.director_board` from `xingchen-director-board`. This skill consumes `visual.director_board.scene_boards[]` and turns board-approved component and technical-stack choices into executable scene motion specs. If the director board is missing, blocked, or generic, stop and send the work back upstream instead of inventing scene visuals from renderer taste.

## Stage owned

`visual-direction` (second half) and `platform-adapt` packaging | writeback: `project-state.json -> render.scene_motion_specs[]`, `project-state.json -> render.vibemotion_candidates[]` when candidates are generated, `project-state.json -> render.hyperframes_candidates[]` when HyperFrames candidates are generated, `project-state.json -> render.ai_video_prompt_requests[]` when Seedance/manual generated-video prompts are handed to the user, `project-state.json -> render.ai_video_candidates[]` when returned generated files are registered, and `project-state.json -> render.plugin_adapter_runs[]` for adapter-created or adapter-promoted artifacts. Exported review surfaces: `effect-brief.md`, `scene-direction.json`, `vibemotion-candidate-plan.json`, `ai-video-prompt-pack.md`, optional `kit-extension-request.md`, optional `createos-primitive-decision.md`, `lookdev-brief.md`, `candidate-manifest.json`.

## Ownership in family

Canonical owner of:

- **Director-board execution mapping** - reads `visual.director_board.scene_boards[]`, chooses only declared components/routes, and writes traceable render specs. It does not author or rewrite the director board.

- **VFX Director Pass** — defined and executed here. Writes `visual.visual_policy.vfx_director_pass` and mirrors per-scene decisions into `render.scene_motion_specs[]`.
- **VibeMotion Candidate Pass** — operational rules at [vibemotion-candidate-pass.md](./vibemotion-candidate-pass.md). Other skills point to that file; they do not restate option rules or candidate shape.
- **Pre-render Scene Composition Pass** — runs here per [scene-composition-pass.md](./scene-composition-pass.md). Audit-time counterpart in `xingchen-lookdev`; the handoff is the geometry fields written into `render.scene_motion_specs[]`.
- **CreateOS Primitive Kit-Extension Pass** — runs when a scene or project needs reusable Remotion primitives instead of one-off scene code. Follow [createos-visual-primitive-library.md](../../xingchen-next/references/createos-visual-primitive-library.md); keep research and WebGL/shader experiments project-local until the user approves extraction.
- For the 0525 CreateOS visual-library build plan or a 0524 primitive-library rebuild, delegate the detailed phase workflow to the `createos-visual-primitives` skill.

## Ironclad rules

- Every scene's component and route choice must come from `visual.director_board.scene_boards[].component_layer` and `.tech_stack_layer`; visual-compiler may only compile, select declared fallbacks, or request extensions within that board.
- Every scene's picture choice must preserve `visual.director_board.scene_boards[].brainstorming_layer`: compile the selected direction, continuity handles, and `anti_ppt_decision` into the scene spec. Do not replace it with a centered-card/page-flip default.
- Every scene's language-game correction from [language-game-correction.md](../../xingchen-next/references/language-game-correction.md) must remain public downstream: vague words may only compile if the director board has translated them into source treatment, on-screen text purpose, camera reveal, object behavior, transition behavior, or lookdev criterion. Otherwise return to `xingchen-director-board` / `xingchen-art-direction`.
- Every scene-to-scene transition must come from `visual.director_board.scene_edge_boards[]`. Compile the selected bridge into an explicit transition primitive; if the method cannot be implemented by the current shot library, raise `kit-extension-request.md`.
- Narration-led animation must compile the continuous-motion rule from [huashu-design-taste-upgrade.md](../../xingchen-next/references/huashu-design-taste-upgrade.md): preserve 1-2 hero elements or continuity handles across scene edges where possible, and reject default `fade-up content -> full-page opacity cut -> new layout` packaging unless the director board records a meaningful hard cut.
- Visual resource choices must compile from [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md): selected SVG/icon libraries, Remotion packages, imagegen routes, prompt-pack paths, dependency install requests, and audit hooks must be present before implementation. Do not improvise libraries from renderer taste.
- Open Design original skills may be used only when the director board or resource preflight records [open-design-original-skill-intake.md](../../xingchen-next/references/open-design-original-skill-intake.md). Read the original `SKILL.md`, compile only selected traits, preserve rejected traits, and record concrete artifacts through `render.plugin_adapter_runs[]` with `skill_name: "open-design-original"` and `adapter_id: "open-design-original:<skill-name>@d5aeab77fc4e"`.
- If `visual.visual_policy.visual_style_influence.source = "vox_remotion_visual_style"`, compile [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md) into scene specs and components: shared world base, layer stack, one foreground proof carrier, Remotion-owned text/proof overlays, beat sync, prop controls, and style-specific lookdev checks. Do not create a `vox_renderer`, and do not collapse the scene into a baked bitmap.
- LLM-produced scene specs, prompt packs, or route JSON must follow [llm-json-recovery.md](../../xingchen-next/references/llm-json-recovery.md) before they become artifacts or state. Strip Markdown fences/wrapper prose, validate required fields, and do not save partial parses.
- Global reusable assets must compile from [visual-asset-library-governance.md](../../xingchen-next/references/visual-asset-library-governance.md): if the board cites a global `asset_id`, use the registered local path and write project usage; if a new reusable asset is produced, register it before lookdev.
- Public stock/b-roll clips must compile from [commercial-video-footage-scout.md](../../xingchen-next/references/commercial-video-footage-scout.md): use only clips with `commercial_use_status` allowed or allowed-with-attribution, preserve attribution notes, and integrate as Remotion-controlled `video_plate` / background / transition layers.
- Missing shot-library coverage for `component_layer.primary_component`, `supporting_components`, or `fallback_component` requires `kit-extension-request.md`; never invent silently or rename the board component to fit the current kit.
- Reusable primitive/library work is not a shortcut around the director board. A primitive may be proposed only when the current project provides repeated scene demand, a failed implementation postmortem, or a user request for extraction. WebGL/shader proposals must stay in the project sandbox until the gate in [createos-visual-primitive-library.md](../../xingchen-next/references/createos-visual-primitive-library.md) is approved.
- When the user explicitly names the CreateOS primitive build plan, load `createos-visual-primitives` and follow its `references/build-plan-contract.md` instead of improvising the phase sequence here.
- If the user is asking to edit skills, do not start compiler execution or runtime probes. Update the skill/reference contract only; Remotion stills, WebGL experiments, npm installs, and headless Chrome checks require a separate explicit retest request.

- Every scene's chrome component choice must map to (a) an entry in `visual-language-kit.json.chrome_components` AND (b) a shot name listed in [shot-library.md](./shot-library.md). Needing something outside both is normal — raise `kit-extension-request`, never invent silently.
- INV-PROOF-FRAME-STRATEGY: literal proof or UI plates may not enter render without explicit `frame_strategy` and `distortion_policy`.
- HTML 3D scenes must follow [html-3d-scene-route.md](../../xingchen-next/references/html-3d-scene-route.md). Use Remotion-native 3D for exact narration/proof timing, captured HTML/canvas plates for browser-native candidates, transparent 3D overlays only for non-proof accents, and Spark only for justified world assets.
- HyperFrames plugin skills in Codex, or local CLI/local skill/manual HyperFrames lanes in Claude Code, are allowed only as execution adapters after scene intent is locked. Every generated HTML/canvas candidate must write both `render.hyperframes_candidates[]` and `render.plugin_adapter_runs[]`; the adapter cannot become a template library or full-video controller.
- Seedance/manual AI video generation is allowed only when the director board selects `tech_stack_layer.primary_stack: "gen_insert"` with a bounded visual-gap reason. When no API is available, write `render.ai_video_prompt_requests[]` and `ai-video-prompt-pack.md/json` first. Only after the user returns a generated file should you write `render.ai_video_candidates[]` and `render.plugin_adapter_runs[]`. Final render specs must stay `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, and `promotion_target_renderer_family: "remotion_component"`.
- Remotion plugin guidance in Codex, or local `remotion-render-adapter`/manual Remotion implementation in Claude Code, may be used for implementation rules, captions, audio, timing, 3D, charts, transitions, and text fitting, but it does not decide scene purpose. Record implementation or preview use in `render.plugin_adapter_runs[]` when it creates or promotes artifacts.
- When `visual.visual_policy.spoken_knowledge_motion_policy.selected === true` or the board selects a voice-led AI explainer / 口播知识 style, compile [spoken-knowledge-motion-grammar.md](../../xingchen-next/references/spoken-knowledge-motion-grammar.md): real proof + Remotion-native concept objects are the default; generated props are opt-in and must have an explicit quality/lookdev reason.
- For voice-led short-video output, express the anti-slide rules with existing fields where possible: `subtitle_safe_region` records organic/ad-safe safe area; `subtitle_background_policy`, `subtitle_background_padding`, and `subtitle_max_lines` record any stroke or rounded translucent subtitle background; `z_order_plan` orders image plate / main visual / info overlay / caption; `anti_ppt_decision` says how pure title-card holds are avoided; `motion_verbs` and `transition_primitives` name the `75-120` frame rhythm change; `visual_resource_trace` names caption, background, info-card, and motion package routes.
- ReactBits-derived effects are allowed only through [reactbits-remotion-upgrade.md](./reactbits-remotion-upgrade.md). Treat ReactBits as a motion-primitive source, not a template library: final Remotion timing must be frame-driven, hover/cursor/scroll-only behavior must be rewritten or rejected, and missing components require `kit-extension-request.md`.
- HTML 3D, Spark, and source-media specs inherit `frame_layer.subtitle_safe_region`, `frame_layer.proof_regions`, and `frame_layer.camera_path` from the matching director-board scene. Do not replace these with renderer defaults.
- INV-SPARK-NEEDS-ASSET: do not assign `spark_3dgs` to literal proof, UI, chart, terminal, PDF, number-inspection, or generic-background scenes. Procedural `constructSplats` plates use `procedural_splat_world`, never `true_3dgs_asset`.
- Custom motion beats must be written in relative terms (`durationFrames`, scene progress) — never frozen frame counts copied from older drafts. Otherwise scenes fight human-audio alignment.
- INV-CONCRETE-ASSET-REALIZATION: 当 `audience.tier ≤ lay_curious` 且 scene 的 `brainstorming_layer.analogy_pass.concrete_execution_plan` 存在时，visual-compiler 必须执行 [Concrete Asset Realization Pass](#concrete-asset-realization-pass)。外部素材路线（imagegen / comfyui_hunyuan3d / stock_photo / screen recording）登记到 `render.generated_assets[]` 或对应 handoff；`remotion_native` 路线不登记 generated asset，但必须在 Remotion React 组件里实现真实程序化视觉节点并写 `visual_resource_trace`。**禁止 fall back 到 `<div>` + `<Subtitle>` 的纯文字场景**（例外：scene_job === "rest" 的休息镜头）。资产生成失败时按 `fallback_plan` 降级，仍然失败 ⇒ 退回 director-board，**不**进入 lookdev。
- INV-ASSET-SPECS-COMPLETENESS: 当 `concrete_execution_plan.enumerated_concepts.length > 1` 时，`additional_asset_specs.length ≥ enumerated_concepts.length`。每个具象名词必须有自己的真实生成素材，**禁用 div chip 凑数**（详见 `dashboard-chip-shape-foreground` forbidden pattern）。
- INV-REMOTION-ANIMATION-DEPTH: 当 `audience.tier ≤ lay_curious` 时，visual-compiler 必须执行 [Remotion Animation Depth Pass](#remotion-animation-depth-pass)：每个非 rest scene 实现 ≥ 1 个 L2 Remotion 能力，全片至少 1 个 scene 实现 ≥ 1 个 L3 能力。详细能力分级见 [`remotion-animation-depth.md`](./remotion-animation-depth.md)。缺 npm 包必须写 `render.dependency_install_requests[]` 让 codex 装，**不允许降级到 L0/L1**。
- INV-CAMERA-AS-ARGUMENT: 每个非 rest scene 的 CameraRig / 镜头实现必须满足声明的 `camera_intent` 最小幅度（`push_in/pull_out` scale 变化 ≥ 0.3；`dolly_*` translate ≥ 视口 15%；`held` 仅 rest 允许）。装饰性微抖（scale 变化 < 0.15 AND translate < 视口 10%）违反此 INV。
- INV-PHYSICS-OVER-LINEAR: 当 `physics_targets[]` 非空时，相关元素必须用 `spring()` 或物理引擎驱动，**禁用 `interpolate(linear)` 平移**这些目标。涉及"进入/离开/碰撞/弹跳/散落"动作必须有真实物理感。
- 画面语言（visual vocabulary）选择必须遵循 [visual-vocabulary-library.md](./visual-vocabulary-library.md)：每个 `asset_kind` 对应一种或几种画面语言（手绘剖面图 / chibi 分层 / manim 数学 / Vox 信息图 / 实物特写 / 录屏标注 / 3D 物件 / 拟人剧情 / 复古仪表盘 / 比例堆积）；同一支视频建议主用 2-3 种画面语言（统一基调）+ 穿插 1-2 种（节奏变化），10 种全混 ⇒ 违反 `INV-MONOTONY-CHECK`。

Other shared rules: see [cross-skill-invariants.md](../../xingchen-next/references/cross-skill-invariants.md).

## Skill-local procedure

### Project-level direction (`effect-brief.md`)

Capture: clarity-vs-spectacle ratio, energy curve across the full piece, what audiences should trust vs feel, what stays calm even in energetic moments, how the approved `meta_concept` constrains every scene family, and the VFX Director pass result.

Also capture the Huashu taste preflight commitments: medium persona, selected direction, core asset protocol, anti-slop bar, placeholder policy, continuous-motion rule, and the five-axis lookdev plan. Capture the GitHub design intake commitments: fact-check status, real assets, design-system rule, selected/killed directions, rejected slop patterns, verification route, and five-dimension review plan. Capture Open Design original skill intake commitments when present: source skill path, snapshot commit, selected traits, rejected traits, Xingchen adaptation, preview route, and proof/subtitle ownership. Capture the visual resource preflight commitments too: source reality, design-system memory, selected SVG/icon libraries, selected Remotion packages, selected imagegen routes, prompt-pack paths, rejected defaults, and lookdev audit hooks. If these are absent, return to `xingchen-art-direction`; do not infer them from renderer taste.

### Scene-level direction (`scene-direction.json` and `render.scene_motion_specs[]`)

Each scene carries the geometry-truth fields written into state: `scene_id`, `director_board_scene_id`, `scene_job`, `dominant_anchor`, `anchor_region`, `trust_source`, `spectacle_source`, `motion_verbs`, `camera_intent`, `frame_strategy`, `asset_fit_policy`, `distortion_policy`, `proof_regions`, `subtitle_avoidance`, `subtitle_safe_region`, `z_order_plan`, `proof_visibility`, `transition_owner`, `kill_list`, `fallback_strategy`, `chrome_components`, `timing_basis`, `anchor_dwell_ms` (default ~2000ms unless approved style argues otherwise), `onscreen_text_role`, `narration_alignment_notes`, `brainstorming_trace`, `continuity_handles_used`, `anti_ppt_decision`, `huashu_taste_trace`, `visual_resource_trace`, `edge_in_trace`, `edge_out_trace`, `transition_primitives`, `scene_option_menu`, `selected_option_type`, `vibemotion_candidate_ids`, `hyperframes_candidate_ids`, `ai_video_candidate_ids`, `remotion_promotion_notes`, `spark_asset_need`. Each `render.scene_motion_specs[]` item must back-reference `visual.director_board.scene_boards[scene_id]`; the scene job, source treatment, timing basis, proof regions, subtitle safe region, camera path, component set, primary stack, brainstorming selected direction, and adjacent edge-board bridge must trace back to the board.

When `vox_remotion_visual_style` is selected, add compact trace fields where the project state or export surface allows them: `visual_style_trace`, `scene_contract_trace`, `prop_controls`, and `lookdev_style_checks`. At minimum the exported `scene-direction.json` must show which background/world token, mid-cutout layer, foreground proof carrier, Remotion overlay, voiceover beat, safe zone, and prop controls were compiled for each scene. `lookdev_style_checks` must carry the full style-specific rule set from [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md), not a partial subset.

For each scene, include a `huashu_taste_trace` note in `effect-brief.md` or the scene direction export that names: real asset used or honest placeholder, slop pattern avoided, continuity handle used, and which five-axis lookdev concern should be watched. Also include `github_design_trace` when the GitHub design intake has concrete obligations for the scene: token/system rule used, asset promise honored, slop pattern avoided, and verification evidence expected. This trace is short, but it prevents visually expensive work from drifting back into generic cards.

For each scene whose board used language-game correction, include the result in `brainstorming_trace`, `visual_resource_trace`, or `anti_ppt_decision`: the original phrase, its public criterion, and how the component/motion makes that use visible. Do not create a separate schema field.

For each scene, include a `visual_resource_trace` note that names: selected library/package route, rejected route, dependency status, prompt-pack asset id when generation is involved, and the exact audit signal lookdev should check. Examples: `@remotion/paths -> interpolatePath import`, `d3 -> source data axis labels`, `lucide -> one icon family only`, `imagegen asset -> OCR no text + staticFile import`.

For voice-led short-video scenes, the scene spec must remain compact but explicit: the first `0-90` frames must identify the main visual and hook proposition, pure title/static-card holds must stay under `12` frames, captions must be declared as a rhythm layer with no more than `2` lines per group, any subtitle background must have padding/clipping checks, and the background route must include low-intensity depth/breathing/texture unless the scene is a deliberate rest beat.

Renderer family choice follows [renderer-families.md](../../xingchen-next/references/renderer-families.md). For Spark scenes also write `spark_asset_route`, `spark_effect_route`, `spark_runtime_profile`, `route_status`, `actual_renderer_family` per [spark-3dgs-world-route.md](../../xingchen-next/references/spark-3dgs-world-route.md).

### Per-scene VibeMotion option menu

Before lookdev, every render-bound scene gets `recommended` / `bold` / `safe` options. If user does not select, default to `recommended` with `selected_by_user: false`. Generated candidates are real review artifacts (mp4/mov/html/component/transparent_asset) — text-only direction is not lookdev evidence. Full rules at [vibemotion-candidate-pass.md](./vibemotion-candidate-pass.md).

### HyperFrames / Remotion plugin adapter pass

If a scene board selects `hyperframes` or an HTML/canvas candidate is useful, invoke HyperFrames through the current environment's adapter lane only: Codex plugin when available, otherwise Claude Code local CLI/local skill/manual implementation. The output must be project-local, deterministic, linked to the current scene spec, and registered as:

- `render.hyperframes_candidates[]` with `candidate_origin`, `state_trace_refs[]`, `source_path`, `output_path`, review status, and promotion fields when approved
- `render.plugin_adapter_runs[]` with the concrete plugin skill, scene ids, input state refs, output paths, state writebacks, status, candidate ids, and lookdev evidence flag

If Remotion plugin rules are used to implement or preview the scene package, append a `render.plugin_adapter_runs[]` entry that points to `render.scene_motion_specs[]`, `render.jobs[]`, or the render-pack state/export paths affected.

### Seedance / AI video prompt and adapter pass

If a scene board selects `gen_insert`, compile it as a bounded generated-video plate lane, not a final renderer. With no API, stop at a prompt pack until the user returns the generated file.

- keep the scene spec under Remotion: `render_mode: "gen_insert"` or `"mixed_scene"`, `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, `ai_video_prompt_request_ids[]`, and `promotion_target_renderer_family: "remotion_component"`
- create `render.ai_video_prompt_requests[]` with provider/model hint, prompt pack path, prompt path/text, negative prompt, proof exclusion policy, Remotion integration plan, output expectation, handoff instructions, current-state trace refs, and expected candidate id
- export `ai-video-prompt-pack.md` and `ai-video-prompt-pack.json` from [ai-video-prompt-pack.template.md](../templates/ai-video-prompt-pack.template.md) / [ai-video-prompt-pack.template.json](../templates/ai-video-prompt-pack.template.json)
- after the user supplies the video file, create `render.ai_video_candidates[]` with provider/model, `prompt_request_id`, prompt path/text, negative prompt, proof exclusion policy, Remotion integration plan, safety review, output path, review status, and `candidate_origin`
- after the user supplies the video file, create `render.plugin_adapter_runs[]` with `adapter_kind: "manual_implementation"` and `adapter_id: "manual-ai-video-api"` for manual platform generation, or `external_api` / `seedance-api` only if Codex actually called the API
- forbid generated readable claims, proof UI, subtitles, logos, faces, and false factual content; those belong to Remotion or source media

If the director board does not select `gen_insert`, do not write AI video prompts or call an AI video platform as a taste upgrade.

### Concrete Asset Realization Pass

**这是 visual-compiler 在 tier ≤ `lay_curious` 时的核心新职责**——把 director-board 写好的 `concrete_execution_plan` 真的变成可加载的素材。**禁止 fall back 到 `<div>` + 字幕**。

#### 输入

每个 `scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan`，包含：

- `asset_kind`（素材类型枚举）
- `generation_skill_route`（要调用哪个 skill）
- `generation_prompt`（完整 prompt 文本）
- `generation_negative_prompt`
- `style_reference`
- `expected_output_paths`
- `remotion_layout_plan`
- `camera_intent`
- `fallback_plan`

When any external image/video generation is involved, also read `imagegen-prompt-pack.md/json` from [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md). The compiler must use the prompt-pack `asset_id`, `reference_image_paths`, `text_policy`, `acceptance_criteria`, `expected_output_paths`, and `remotion_overlay_plan`; it may tighten wording for the target model, but it may not collapse the prompt back to a one-line idea.

#### 处理流程

按 `asset_kind` 路由：

| `asset_kind` | `generation_skill_route` | AI 怎么做 | 写到哪里 |
|---|---|---|---|
| `imagegen_2d` | `imagegen` | 调用 imagegen skill：在 Codex/Claude Code 里通过 Skill tool 触发 `imagegen` skill（imagegen 的 built-in `image_gen` 模式负责出图），把 `generation_prompt` 作为输入 prompt，把 `style_reference` 追加到 prompt 末尾作为风格 hint。imagegen 出图默认落 `$CODEX_HOME/generated_images/` 后 AI 把文件 move 到 `expected_output_paths[0]`。具体能力以当前运行环境提供的 `imagegen` Skill 说明为准，不假设它位于 Xingchen 的 `skillsRoot`。复用 [visual-vocabulary-library.md](./visual-vocabulary-library.md) 的画面语言风格关键词追加到 prompt 末尾。 | `render.generated_assets[]`、`asset_realized_paths` |
| `hunyuan3d_mesh` | `comfyui_hunyuan3d` 或 `manual_implementation` 降级 | **优先路径**：(1) 先调 imagegen skill 出 4 视角 character sheet（front/side/back/3q）；(2) 检查 [local-runtime-environment.md](../../xingchen-next/references/local-runtime-environment.md) 是否有 ComfyUI server URL 和 Hunyuan3D-2mv workflow 路径配置；有 ⇒ HTTP POST 到 ComfyUI `/prompt` endpoint；(3) .glb 落地到 `expected_output_paths`。**降级路径（local-runtime-environment 没配 ComfyUI 时）**：转为 `manual_implementation` 路由——visual-compiler 在 `render.recording_requests[]` 风格写一个 `render.hunyuan3d_prompt_requests[]` handoff（含 character sheet 4 视角图 + Hunyuan3D-2mv workflow.json 路径建议），等用户手动跑 ComfyUI 后回填 `.glb` 路径，与 ai_video_prompt 同模式。**禁止 AI 假装出 .glb**——找不到本地 ComfyUI 就走降级。 | `render.generated_assets[]` + `render.generated_3d_assets[]`（或 `render.hunyuan3d_prompt_requests[]` 当降级） |
| `comfyui_workflow` | `comfyui_hunyuan3d` 或 `local_cli` | 调用自定义 ComfyUI workflow.json，传 `generation_prompt` 作为 prompt 节点输入 | `render.generated_assets[]` |
| `remotion_dataviz` | `remotion_native` | **不需要外部生成**——直接在 Remotion React 组件里程序化绘制（SVG / `@remotion/paths` / `@remotion/shapes` / `@remotion/three` / canvas），按 `remotion_layout_plan` 写组件。口播知识视频里，黑箱、工具锁定、路径、层级、反馈、认知积木等抽象隐喻优先转成可运动的概念结构，而不是廉价生成物件。 | N/A（代码本身就是资产，组件 path 写到 `render.scene_motion_specs[].component_path`） |
| `screen_recording_annotated` | `manual_implementation` | 检查 `sources.asset_manifest[]` 是否已有用户提供的录屏；没有 ⇒ 写 `render.recording_requests[]` 等用户提供后再继续；有 ⇒ 在 Remotion 里 layer 录屏 + 程序化标注 | 已有录屏写 `render.scene_motion_specs[].video_plate_path`；标注是代码 |
| `infographic_svg` | `imagegen` 或 `remotion_native` | 简单流程图 / 口播解释概念图 ⇒ Remotion `<svg>` 程序化生成；复杂插画风信息图 ⇒ 只有在 resource preflight 记录 lookdev 质量理由后才调 imagegen + 风格 reference 为 "回形针 / Vox 信息图" | `render.generated_assets[]`（纯 Remotion 路线则 N/A） |
| `chibi_layered` | `manual_implementation`（已有 brand kit） | 不生成新素材——读 `sources.brand_kit.character_sheet` + `sources.brand_kit.expression_slices[]`，在 Remotion 组件里多层 plane 渲染（参考 [visual-vocabulary-library.md](./visual-vocabulary-library.md) 画面语言 2 的实现要点） | 引用 `sources.brand_kit`，不写新 `generated_assets[]` |
| `stock_photo_annotated` | `imagegen`（次选，回形针强烈建议真实图库优先） | 调 imagegen 用 `photorealistic, macro photography, shallow depth of field, natural lighting` 关键词 | `render.generated_assets[]` |
| `mixed_compose` | 多个 | 拆分成多个子 `concrete_execution_plan`，每个走对应 route，然后在 Remotion 组件里 compose | `render.generated_assets[]` 多条 |

#### 状态写回（强制）

每次外部素材生成完成后写 `render.generated_assets[]` 一条。`remotion_native` / 纯程序化概念结构不写 `generated_assets[]`；它写回 `render.scene_motion_specs[].component_path`、`visual_resource_trace`、`motion_verbs` / `transition_primitives`，并在组件中实际使用 SVG / Canvas / Three / paths 等视觉节点。

```json
{
  "asset_id": "scene-S03-mainframe-handdrawn-cross-section",
  "scene_id": "S03",
  "concrete_execution_plan_ref": "scene-S03.brainstorming_layer.analogy_pass.concrete_execution_plan",
  "asset_kind": "imagegen_2d",
  "generation_skill_route": "imagegen",
  "generation_prompt_used": "完整 prompt 文本（包括 director-board 的 prompt + visual-vocabulary 的风格关键词追加）",
  "asset_paths": ["public/assets/generated/scene-S03-cross-section-v1.png"],
  "asset_realization_status": "generated|previewed|approved|rejected",
  "used_in_components": ["src/scenes/SceneS03.tsx"],
  "fallback_used": false,
  "lookdev_evidence_required": true
}
```

同时写一条 `render.plugin_adapter_runs[]`（按 `INV-PLUGIN-ADAPTER-TRACE`），`adapter_kind: "local_skill"` / `"local_cli"` / `"manual_implementation"`，`adapter_id` 为具体调用的 skill 名。

#### React 组件强制规则

每个 scene 的 React 组件**必须**至少有一个真实视觉节点。外部素材路线引用 `render.generated_assets[]` / `sources.brand_kit` / `sources.asset_manifest[]`；程序化路线用 Remotion-native SVG / Canvas / Three / paths：

- `<Img src={...}>`（imagegen / stock_photo / chibi_layered）
- `<Video src={...}>`（screen_recording）
- `<ThreeCanvas>` + `useGLTF`（hunyuan3d_mesh）
- 程序化 SVG / `@remotion/three`（remotion_dataviz）

**禁止**：组件里只有 `<div>` + `<Subtitle>` 没有任何媒体节点（=fall back 到 PPT 风字幕场景，违反 `INV-CONCRETE-ASSET-REALIZATION`）。

例外：`scene_job === "rest"` 的休息镜头允许纯视觉留白（无媒体），但必须在 board 写 `tech_stack_layer.empty_frame_reason`。

#### Fallback 处理（明确路径）

素材生成失败时：

1. 不允许写 placeholder `<div>` 凑数
2. 读 `concrete_execution_plan.fallback_plan` 中的降级方案
3. 重新调用对应 skill 执行降级方案
4. 仍然失败 ⇒ 写 `render.generated_assets[].asset_realization_status = "rejected"`、`fallback_used = true`，并把该 scene 状态退回 `xingchen-director-board` 让 board 改 plan
5. **不进入 lookdev**

#### 验证

- 外部素材路线的 `render.scene_motion_specs[]` 必须有匹配的 `render.generated_assets[]` 或 source asset 引用（除非 scene_job === "rest" 例外）
- `remotion_native` 路线不需要 `render.generated_assets[]`，但 `render.scene_motion_specs[].component_path` 指向的 React 文件必须包含至少一个程序化视觉节点（`<svg>` / `<canvas>` / `@remotion/paths` / `@remotion/shapes` / `@remotion/three`）
- `render.scene_motion_specs[].component_path` 指向的 React 文件必须包含至少一个媒体或程序化视觉节点
- 没有 `<div>` + `<Subtitle>` 单独成场的代码

### Remotion Animation Depth Pass

**这是 visual-compiler 在 tier ≤ `lay_curious` 时与 Concrete Asset Realization 同等重要的核心职责**——让 Remotion 的高阶能力真正在画面里发力。详细能力分级 + grep 检测算法见 [`remotion-animation-depth.md`](./remotion-animation-depth.md)。

#### 输入

每个 `scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan.remotion_animation_depth`：

- `l2_capabilities_used[]`: director-board 声明的 L2 能力清单（每个非 rest scene ≥ 1）
- `l3_capabilities_used[]`: director-board 声明的 L3 能力清单（全片至少 1 个 scene ≥ 1）
- `physics_targets[]`: 涉及物理动作的物件
- `camera_intent` + `camera_scale_change` + `camera_translate_px`: 镜头运动声明

#### 处理流程

**第 1 步：检查 npm 包是否已装**

读项目 `package.json`，按 `l2/l3_capabilities_used[]` 列表确认所需包是否已装：

| 能力 | 需要的包 |
|---|---|
| `spring_physics` | `remotion`（核心包自带） |
| `multi_layer_parallax` | `remotion`（核心包自带） |
| `real_camera_motion` | `remotion`（核心包自带） |
| `remotion_paths_evolve` / `paths_interpolate_morph` | `@remotion/paths` |
| `animation_utils_transform` | `@remotion/animation-utils` |
| `freeze_frame` | `remotion`（`<Freeze>` 自带） |
| `particle_system_50plus` | `remotion`（自实现） |
| `transitions_package` | `@remotion/transitions` |
| `shapes_package` | `@remotion/shapes` |
| `multi_sequence_loop` | `remotion`（`<Sequence>` / `<Loop>` 自带） |
| `three_3d_canvas` | `@remotion/three` + `three` + `@react-three/fiber` + `@react-three/drei` |
| `media_utils_audio_data` | `@remotion/media-utils` |
| `motion_blur` | `@remotion/motion-blur` |
| `skia_canvas` | `@remotion/skia` |
| `matter_physics` | `matter-js`（或 `rapier` / `cannon`） |
| `lottie` | `@remotion/lottie` |
| `noise_procedural` | `@remotion/noise` |

缺包 ⇒ 写一条 `render.dependency_install_requests[]`：

```json
{
  "request_id": "install-remotion-paths",
  "scene_ids": ["scene-XX"],
  "packages": ["@remotion/paths"],
  "reason": "scene-XX concrete_execution_plan.l2_capabilities_used 含 remotion_paths_evolve，但 package.json 未装",
  "install_command": "npm i @remotion/paths"
}
```

让 codex 跑 `npm i ...`，**不能因为没装就降级到 L0/L1**。

**第 2 步：按声明的能力实现 React 组件**

对每个 scene 的 `concrete_execution_plan.remotion_animation_depth` 声明，在生成的 React 组件中**实际用上声明的 API**。例：

- 声明 `spring_physics` + `physics_targets: ["杂乱素材进玻璃舱"]` ⇒ 那 7 个素材 `<Img>` 必须用 `spring({frame: frame - delay, fps, config})` 驱动位置，**不能**用 `interpolate(frame, [...], [x1, x2])`
- 声明 `multi_layer_parallax` ⇒ 至少 3 个 z-depth 层各有独立 frame-driven translate/scale，速度不同
- 声明 `real_camera_motion` + `camera_intent: "push_in"` + `camera_scale_change: 0.4` ⇒ CameraRig 的 scale interpolate 输出范围必须含 ≥ 0.4 跨度（如 `[1.0, 1.4]`）
- 声明 `three_3d_canvas` ⇒ 必须 import `<ThreeCanvas>` from `@remotion/three`，且至少一个 `<primitive>` / `useGLTF` 节点
- 声明 `media_utils_audio_data` ⇒ 必须 `import {useAudioData, visualizeAudio} from '@remotion/media-utils'` 且实际调用驱动某属性
- 声明 `paths_interpolate_morph` ⇒ 必须 import `{interpolatePath} from '@remotion/paths'` 且实际用其结果作为 `<path d={...}>`

**第 3 步：自检 grep**

编译完成 .tsx 后，AI 自己跑 grep 验证：

```
对 component_path 跑 [remotion-animation-depth.md L2/L3 触发条件](./remotion-animation-depth.md#如何-grep-检测-api-使用lookdev-audit-算法) 的 regex 集合。
实际命中的 L2/L3 能力数 ≥ 声明数 ⇒ pass，写回 actual_capabilities_used。
实际命中 < 声明 ⇒ 退回重写，把声明的 API 真的用上。
```

**第 4 步：状态写回**

```json
"render.scene_motion_specs[]": {
  ...,
  "remotion_animation_depth_actual": {
    "l2_capabilities_detected": ["spring_physics", "real_camera_motion"],
    "l3_capabilities_detected": ["media_utils_audio_data"],
    "physics_implementation": "spring + matter-js for 7 cascade materials",
    "camera_implementation_scale_range": [1.0, 1.42],
    "camera_implementation_translate_px": 320,
    "grep_evidence_paths": ["src/R04CeilingSegment.tsx:42-58", ...]
  }
}
```

lookdev `rule_id=remotion_animation_depth_check` 用这些字段交叉验证。

#### Fallback 规则

- 缺包 ⇒ 写 `dependency_install_requests[]`，等 codex 跑安装后回继续。**不允许**降级 capability。
- 实现复杂（如 matter-js 物理引擎接入难）⇒ 降级到 `spring`（同属 physics 范畴）。但**不允许**降级到 linear interpolate。
- @remotion/three + useGLTF 加载 .glb 失败 ⇒ 用 `<Sphere>` / `<Box>` from drei 程序化几何（依然是真 3D），**不允许**回退到 SVG polygon 假装 3D。

### Asset / Programmatic Division Rule

每个 scene 编译时按 [`imagegen-vs-remotion-division.md`](./imagegen-vs-remotion-division.md) 的 4 层 layered 模板组织 React 组件：

```
Layer 0 (imagegen 物件层): 真实物件 / 质感资产 / 角色 / 背景 → <Img src=imagegen-output.png>
Layer 1 (Remotion 几何标注层): SVG 箭头 / 圈红 / 高亮 / 粒子 / 连接线 / 状态指示
Layer 2 (Remotion 中文文字层): 字幕 / 标签 / 章节短词 (NotoSansSC / DengXian 真实字体)
Layer 3 (Remotion 镜头层): CameraRig + 多 z-depth parallax + Freeze + 真镜头运动
```

**强制规则**：

(a) 凡是 `concrete_execution_plan.asset_kind` 是 `imagegen_2d` / `hunyuan3d_mesh` / `stock_photo_annotated` / `chibi_layered` 的产出，visual-compiler 在调用 imagegen / ComfyUI 时**必须**在 prompt 末尾追加：`"no Chinese text in image, no Chinese characters, no text inside the artwork, leave clean space at top/bottom for overlay caption"`。生成后跑 OCR 自检中文字符，命中 ⇒ 重生成。

(b) 凡是中文文字（标题、标签、字幕、CTA）**必须**用 Remotion 程序绘制（`<Text fontFamily="NotoSansSC">` 或 `<Subtitle>`）—— **禁止**让 imagegen 出图后期望"图里就有这串中文"。

(c) 凡是画面需要观众相信它是**真实可见物件**（机器、纸张、人物、场景、自然物、容器、装置）时，必须走 source media / imagegen / Hunyuan3D 路径—— **禁止**用 `<svg>` + polygon + 渐变 fill 假装物件（违反 `svg-mimicking-physical-object` forbidden pattern + `programmatic_object_form_check` audit）。但当 `spoken_knowledge_motion_policy.selected === true` 且“黑箱 / 锁 / 积木 / 路线 / 边界”等只是抽象论证隐喻时，优先改写为 Remotion-native 概念结构（关系场、轨道、层级、节点图、扫描窗、反馈回路），不为廉价道具图强行 imagegen。

(d) 凡是信息抽象（箭头、连接线、流程图节点、数据图表、网络图、刻度尺、几何关系）**用 Remotion 程序绘制**（SVG / `@remotion/shapes` / `@remotion/paths`）—— 这是 SVG 的本职。

详细 3 问决策矩阵 + 7 类物件清单 + R04 案例分工拆解 + Case Study 模板见 [`imagegen-vs-remotion-division.md`](./imagegen-vs-remotion-division.md)。

### Render-pack text field discipline

AI 在写 `render.scene_motion_specs[]` / `scene-direction.json` / 任何下游 `render-plan.json` / `video-project.json` 的 `text` / `title` / `subtitle` / `caption` / `badge` / `label` 字段时，**每条值必须能追溯到 `visual.director_board.scene_boards[].frame_layer.on_screen_text[].cite_source`**。

`on_screen_text[]` 是 `xingchen-director-board` 写入的强制 cite 数组，每条 text 都已记录来源类型（来自 script 第 N 行 / 来自 analogy 具象词 / 来自源材料原文）。visual-compiler 在编译时**不允许**新增没有 cite_source 的画面文字。

**禁止行为**（这些是历史 PPT 帧的来源；命中 lookdev 直接 block 然后 AI 自己退回修）：

- 把 `scene_id` 字面值（如 `"S01"`、`"scene-03"`）当 badge、chapter title、或 progress label
- 把 `evidence_role` 字段值（如 `"proof"`、`"hero"`、`"supporting"`、`"background"`）字面搬上画面 tag
- 把 `knowledge_action` 字段值（如 `"prove"`、`"reveal"`、`"compare"`、`"decompose"`）当画面 chip
- 把 `job` 字段值（如 `"hook"`、`"payoff"`、`"close"`、`"build"`）当画面 stage 标签
- 把 skill 或工程文件名（`xingchen-proof-pack`、`scene-board.md`、`project-state.json`、`director-board.json`）当画面文字
- 把工具品牌名（`VoxCPM2`、`Remotion`、`Hyperframes`、`Seedance`、`Spark`、`3DGS`）当画面文字，**除非**该工具已被 `audience.vocabulary_level.allowed_jargon_terms` 显式 allow（即"这期视频内容就是讲这个工具"）
- 把 dashboard 风的"进度计数"（`02 / 09`、`STATUS: locked`、`scene board locked`、progress bar 标签）当画面元素
- 把 `Created N files`、`✔ done`、`tier_locked_at: ...` 等 metadata 状态值当画面文字

**允许行为**：

- 引用 `script.spoken_script` 中口播过的关键词，作为画面 keyword highlight（必须在 `on_screen_text[].cite_source` 写 `script.spoken_script.line_N`）
- 引用 `analogy_pass.lay_analogy` 中的具象词（书、扳手、跑腿、翻动），作为画面 label（cite_source 写 `analogy_pass.lay_analogy`）
- 引用 `sources.asset_manifest[].summary` 中描述的源材料原文（截图里就有的字），作为画面 proof quote（cite_source 写 `source_material.{asset_id}.original_text`）

**AI 找不到合法引用时的正确行为**：对应字段填 `null` 或空字符串，**不要凑字数**。让画面回到"只有视觉、无文字"状态，比强写一条 metadata 文字凑数好 10 倍。

**编译时自检**：在写出每个 `scene_motion_specs[].onscreen_text_role` / `chrome_components` 文本字段前，先把即将写入的 text 值与下面的 metadata 字段名集合做匹配，命中即不允许写出（视为内部 bug）：

```
禁止集合（部分）:
- scene_id 字面值（"S01"-"S99"、"scene-*"）
- knowledge_action 枚举值（define/compare/decompose/prove/invert/compress/expand/summarize/bridge/hook）
- evidence_role 枚举值（hero/supporting/background/none）
- job 枚举值（hook/context/proof/build/peak/rest/payoff/close）
- skill 家族字面字符串（xingchen-*）
- 工具品牌（VoxCPM2/Remotion/Hyperframes/Seedance/Spark/3DGS）当 allowed_jargon_terms 不含时
```

历史回归：用户 0512 项目里出现的 `S01 问题引子 REVEAL`、`STRUCTURE QUESTION`、`PROVE` chip 全部由这条规则覆盖。

### Recording-first packaging

When narration is human-recorded: one-sentence scene job with one dominant anchor before flourish; onscreen text compresses claim or structure, not mirrors subtitles; lower-thirds support read path; prefer scene-specific metaphors over global chrome; visual anchor lands slightly early or exactly on the keyword beat; opening reorder allowed when the approved performance changed (cold-open bridge instead of forcing legacy scene order); custom beats in relative terms so scenes survive duration stretch.

### Operations order

1. Read `visual.director_board` and confirm every StoryMother scene has a matching `scene_boards[]` entry with source, arrangement, frame, component, subtitle, and tech-stack layers.
2. Confirm every scene board has a concrete `brainstorming_layer`, and every adjacent StoryMother scene pair has a `scene_edge_boards[]` entry with a selected bridge and transition method.
3. Read [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md), [visual-asset-library-governance.md](../../xingchen-next/references/visual-asset-library-governance.md), and any stock-footage scout outputs; resolve selected libraries, selected Remotion packages, global asset IDs, stock clip license status, attribution notes, prompt-pack paths, dependency install requests, and lookdev audit hooks before writing code. If Open Design original skills are selected, also read [open-design-original-skill-intake.md](../../xingchen-next/references/open-design-original-skill-intake.md) and the matching original `SKILL.md` before compiling candidates.
4. If the project is a spoken knowledge / oral AI explainer, read [spoken-knowledge-motion-grammar.md](../../xingchen-next/references/spoken-knowledge-motion-grammar.md) and select 1-3 named motion primitives for each non-rest scene before choosing generated props.
5. If `visual_style_influence.source = "vox_remotion_visual_style"`, read [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md) and compile the scene contract into `scene-direction.json`, `render.scene_motion_specs[]`, and component props before motion polish.
6. If the user asks for reusable primitives, CreateOS visual components, Burn rebuild, or WebGL/shader feasibility, read [createos-visual-primitive-library.md](../../xingchen-next/references/createos-visual-primitive-library.md) and produce a project-local decision/kit-extension plan before implementation.
7. Read [scene-forces.md](./scene-forces.md) and import approved `meta_concept` / `forbidden_list` / `allowed_chrome`.
8. Run scene-composition-pass before motion polish.
9. Run VFX Director pass before assigning renderer families.
10. Decide trust source vs spectacle source per scene from `scene_boards[].source_layer`, `.aesthetic_layer`, `.frame_layer`, and `.brainstorming_layer`, not from visual flourish.
11. Compile each `scene_edge_boards[]` transition into a named primitive (`KeywordRelay`, `ProofRegionRelay`, `DiagramMorph`, `ScaleShiftBridge`, `AxisHandoff`, `QuestionAnswerCut`, `ColorLogicCut`, `SubtitleToVisualBridge`, `HardCut`, or `BreathCut`) with out/in handles and acceptance text.
12. Write the per-scene option menu and run VibeMotion candidate pass.
13. If the board names a ReactBits-derived component or effect, map it through [reactbits-remotion-upgrade.md](./reactbits-remotion-upgrade.md): use an existing Xingchen shot, write a kit-extension request, or create a bounded HyperFrames/HTML candidate route. Never compile a raw hover/cursor/scroll effect as final Remotion motion.
14. Run HyperFrames, AI-video prompt handoff, returned-file registration, or Remotion adapter work only when the board route calls for it, then write `render.hyperframes_candidates[]`, `render.ai_video_prompt_requests[]`, `render.ai_video_candidates[]`, and/or `render.plugin_adapter_runs[]` as applicable.
15. Make frame strategy and distortion policy explicit before any proof asset enters the render path, inheriting board `proof_regions`, `subtitle_safe_region`, and `camera_path`.
16. Write scene motion intent back into state with `visual.director_board.scene_boards[scene_id]` and `visual.director_board.scene_edge_boards[edge_id]` back-references, then export review files.

## References

- [plugin-adapter-policy.md](../../xingchen-next/references/plugin-adapter-policy.md)
- [open-design-original-skill-intake.md](../../xingchen-next/references/open-design-original-skill-intake.md)
- [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md)
- [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md)
- [createos-visual-primitive-library.md](../../xingchen-next/references/createos-visual-primitive-library.md)
- [visual-asset-library-governance.md](../../xingchen-next/references/visual-asset-library-governance.md)
- [commercial-video-footage-scout.md](../../xingchen-next/references/commercial-video-footage-scout.md)
- [spoken-knowledge-motion-grammar.md](../../xingchen-next/references/spoken-knowledge-motion-grammar.md)
- [scene-forces.md](./scene-forces.md)
- [attention-direction.md](./attention-direction.md)
- [motion-verbs.md](./motion-verbs.md)
- [shot-library.md](./shot-library.md) — full catalog of 18 existing + 8 planned AI 科普 shot components, with dispatch rules and per-shot props
- [scene-composition-pass.md](./scene-composition-pass.md)
- [vibemotion-candidate-pass.md](./vibemotion-candidate-pass.md)
- [reactbits-remotion-upgrade.md](./reactbits-remotion-upgrade.md)
- [ai-video-prompt-pack.template.md](../templates/ai-video-prompt-pack.template.md)
- [anti-template-rules.md](./anti-template-rules.md)
- [design-system.md](./design-system.md)
- [emphasis-sync.md](./emphasis-sync.md)
- [proof-visibility.md](../../xingchen-proof-pack/references/proof-visibility.md) (owned by `xingchen-proof-pack`)
- [renderer-families.md](../../xingchen-next/references/renderer-families.md)
- [spark-3dgs-world-route.md](../../xingchen-next/references/spark-3dgs-world-route.md)
- [project-state-contract.md](../../xingchen-next/references/project-state-contract.md) — full `SceneMotionSpec` and `VibeMotionCandidate` field shape
