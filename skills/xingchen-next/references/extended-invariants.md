# Extended Invariants

These invariants apply only to Extended mode or legacy projects without a mode field.

## INV-AI-VIDEO-GEN-INSERT

AI video generation, including Seedance-style platform output and local ComfyUI Wan2.2 output, is a bounded visual-upgrade candidate lane. It starts as `render.ai_video_prompt_requests[]` when Codex only prepares prompts for the user to run manually, and becomes `render.ai_video_candidates[]` only after a real generated file exists. Prompt requests may be written only after `visual.director_board.scene_boards[].tech_stack_layer.primary_stack` selects `gen_insert` with a concrete visual-gap reason, proof exclusion policy, Remotion `video_plate` integration, and preview requirement. AI video candidates must record provider/model, prompt and negative prompt, current-state trace refs, safety review, output path, and a matching `render.plugin_adapter_runs[]` entry. External platform runs use `adapter_kind: "external_api"` or `manual_implementation`; local Wan runs use `adapter_kind: "local_skill"` or `local_cli` with `adapter_id: "comfyui-wan22-ti2v"`. Final render specs must keep `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "ai_video_generation"`, `integration_mode: "video_plate"`, `promotion_target_renderer_family: "remotion_component"`, and `ai_video_candidate_ids[]`. Generated video cannot carry hero proof, readable claims, UI evidence, subtitles, logos, faces, or false factual content.

## INV-ANALOGY-REQUIRED-FOR-LAY

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 且 scene 的 `brainstorming_layer.knowledge_action ∈ {define, compare, decompose, prove}` 时，`brainstorming_layer.analogy_pass.lay_analogy` 必填且非空。

触发：Visual Lock 之前。
验证：扫 `visual.director_board.scene_boards[]`，缺 `lay_analogy` 的 scene ⇒ block，cite 路径 `scene-XX.brainstorming_layer.analogy_pass.lay_analogy`。

修复路径：AI 退回 `xingchen-director-board` 的 Procedure 2.5 补类比。`anti_ppt_decision` 管"画面动作不像 PPT"、`analogy_pass` 管"概念翻译给普通人"，两者并存不替代。

## INV-ASSET-SPECS-COMPLETENESS

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 且 `concrete_execution_plan.enumerated_concepts.length > 1` 时，`additional_asset_specs.length` 必须 ≥ `enumerated_concepts.length`，每个 concept 对应一个真实生成 spec。

**为什么**：当 lay_analogy / 口播稿中并列多个具象名词（如 R04 的"杂乱文本/图片/聊天记录/语气/文档/PPT/视频"7 个），AI 不能用 1 张图凑——会被迫用 7 个 div 卡片堆。强制 N 个 spec ⇒ AI 必须为每个名词生成真实素材。**这是阻止 dashboard chip 凑数的根本机制**。

触发：Visual Lock 前。
验证：扫所有 `scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan`，`enumerated_concepts.length > 1` 且 `additional_asset_specs.length < enumerated_concepts.length` ⇒ block，cite 缺失的 concepts。
修复路径：AI 退回 director-board Procedure 2.5 为每个 enumerated_concept 写一个 `additional_asset_specs[]` 条目（按 [`concrete-analogy-playbook.md`](./concrete-analogy-playbook.md) 套路选模板）。

## INV-AUDIENCE-TIER-LOCKED

**AI agent** 在 ingest 阶段必须完成以下动作才能进入 `research/proof` 之后的任何阶段：

(a) 从录音稿 / 源材料推断 `sources.source_pack.audience.tier`，结果为 `lay_scrolling` / `lay_curious` / `domain_aware` / `insider` 之一
(b) 在 `audience.tier_inference_evidence` 写出推断依据（引用录音里的关键用语作为证据）
(c) 向用户**陈述判断**（例："我判断这期是 lay_curious 受众，因为你录音里说了'让大家'、'每一个人'"）
(d) 等用户一句"对/错"答复，确认后写 `tier_user_confirmed=true` + `tier_user_confirmed_at` + `tier_locked_at`

AI 同时必须从录音稿自动识别本期话题词填充 `audience.vocabulary_level.allowed_jargon_terms`（如录音里讲 RAG ⇒ 自动加 `"RAG"`），避免本期内容相关 jargon 被自己的 lookdev 规则误伤。

**不向用户提供任何"填表"形态的交互**——用户输入 = 录音 + 一句话答复，不是表单。这条约束的对象是 AI agent，不是用户。

验证：`tier_user_confirmed=true` 且 `tier_inference_evidence` 非空且 `tier_inferred_by` 非空（记录是哪个 agent 做的推断，便于后续追责/调试）且 `tier_locked_at` 非空。失败 ⇒ block，**不走 manual_review_required fallback**。Legacy import 时 audience 仍是 string 的项目，把 string 塞进 `technical_literacy`、`tier` 留空，下次打开此项目必须先补全 tier 才能进入 visual-direction。

## INV-AUDIENCE-VOCAB-FORBIDDEN-LIST

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，**所有进入 render 的画面字段**必须通过 `forbidden-patterns.md` 中所有 `audience_visibility=banned_for_lay` 条目的 token-grep 扫描。**扫描范围有两路，两路都是 blocker**：

- **路径 1（render-pack JSON）**：`render-plan.json` / `video-project.json` / `scene-direction.json` / `render.scene_motion_specs[]` 中所有 `text` / `title` / `subtitle` / `caption` / `badge` / `label` 字段
- **路径 2（React 组件源码）**：`render.scene_motion_specs[].component_path` 指向的每个 `.tsx` / `.jsx` 文件全文，包括 JSX 文本字面值（`<div>STRUCTURE QUESTION</div>`）和变量渲染（`<span>{scene.id}</span>` / `<span>{scene.verb}</span>` 等 metadata 字段名当 JSX 子节点）

触发：Lookdev Approval 评估阶段。
验证：
- `rule_id=render_pack_text_grep`（路径 1）必须 `passed`
- `rule_id=tsx_source_text_grep`（路径 2）必须 `passed`
- 任一 `failed` ⇒ INV 整体 fail

修复路径：
- 路径 1 失败 ⇒ AI 退回 `xingchen-visual-compiler` 重写 render-pack 字段（遵循 `Render-pack text field discipline`）
- 路径 2 失败 ⇒ AI 退回 `xingchen-visual-compiler` 重写 React 组件源码（删除 `{scene.id}` / `{scene.verb}` 等 metadata 字段绑定，删除硬编码内部词汇文本节点，改成观众语义字段如 `{scene.title}` / `{scene.lay_analogy}`）

**用户 0512 项目回归 case**：`StructureVideo.tsx:582 <span>{scene.id}</span>`（红色 S01-S21 chip）+ `StructureVideo.tsx:927 STRUCTURE QUESTION`（硬编码英文章节名）+ `StructureVideo.tsx:584 <span>{scene.verb}</span>`（reveal/scan/prove uppercase）—— 这些会被 `tsx_source_text_grep` 命中，AI 自己改成 `<span>{scene.title}</span>` 等观众语义字段或删除。不退给用户。

## INV-BRAINSTORMING-BEFORE-PICTURE

Every scene picture in `visual.director_board.scene_boards[]` must include a `brainstorming_layer` produced with the `superpowers/brainstorming` method. It must record the scene question, knowledge action, at least two visual options considered, selected direction, why selected, continuity handles, and an anti-PPT decision. Knowledge videos may use designed concept handles such as keywords, numbers, frames, arrows, proof regions, and color logic; physical objects are not required.

## INV-CAMERA-AS-ARGUMENT

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，每个**非 rest** scene 的镜头必须做叙事性运动：

- `concrete_execution_plan.camera_intent` 不能是 `held`（held 仅 rest scene 允许）
- `camera_scale_change ≥ 0.15` 或 `camera_translate_px ≥ 视口 15%`
- `camera_motion_reveals` 必填非空，说明"运动揭示了什么"（揭示某物件 / 揭示空间关系 / 揭示尺度对比 / 揭示因果对立）
- visual-compiler 实际写出 .tsx 后，CameraRig / 镜头实现的 transform 数值必须满足声明的 intent 最小幅度

**为什么**：镜头是叙事工具，不是装饰。R04 的 CameraRig translate ±42px / scale 1.02-1.10 = 装饰性飘移 = 无镜头语言 = PPT。回形针每个 scene 都有真实运镜揭示新东西。

触发：Visual Lock 前 + Lookdev Approval。
验证：
- director-board 阶段：检查 camera_intent / camera_scale_change / camera_translate_px / camera_motion_reveals 字段满足要求
- lookdev `rule_id=camera_motion_check`：扫 .tsx 中 CameraRig / transform 实际 interpolate 数值范围，与声明对比

修复路径：AI 退回 director-board 重选 camera_intent 并把镜头幅度做大；visual-compiler 实现时把 scale / translate 的 interpolate 输出范围拉到声明值。

## INV-COMPILED-DIRECTOR-TRACE

`xingchen-visual-compiler` must carry the director board into `render.scene_motion_specs[]`. Each render-bound scene must preserve `brainstorming_trace`, `continuity_handles_used[]`, and `anti_ppt_decision` from its scene board. Adjacent scene edges must compile into `edge_in_trace`, `edge_out_trace`, and `transition_primitives[]`. A scene spec that only back-references the director board but omits these execution traces is not ready for platform adaptation.

## INV-CONCRETE-ASSET-REALIZATION

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 且 scene 的 `concrete_execution_plan` 存在时，`xingchen-visual-compiler` 必须执行 Concrete Asset Realization Pass：

(a) 按 `asset_kind` 路由执行对应实现：外部素材路线调用 imagegen / comfyui_hunyuan3d / manual handoff；`remotion_native` 路线直接实现程序化 SVG / Canvas / Three / paths
(b) 外部素材路线把生成的素材登记到 `render.generated_assets[]`，并写一条 `render.plugin_adapter_runs[]` 追踪；`remotion_native` 路线不需要 `render.generated_assets[]`，但必须写 `render.scene_motion_specs[].component_path` 和 `visual_resource_trace`
(c) 外部素材路线要求 `analogy_pass.concrete_execution_plan.asset_realized=true` 且 `asset_realized_paths[]` 非空；`remotion_native` 路线要求 `concept_object_plan` / `motion_primitives[]` 非空并在组件内出现真实程序化视觉节点
(d) 对应 React 组件（`render.scene_motion_specs[].component_path`）必须有至少一个真实视觉节点引用（外部素材：`<Img>` / `<Video>` / `<ThreeCanvas>`；程序化路线：`<svg>` / `<canvas>` / `@remotion/paths` / `@remotion/shapes` / `@remotion/three`）

**禁止 fall back 到 `<div>` + `<Subtitle>` 的纯文字场景**——这是历史 PPT 帧的根源。例外：`scene_job === "rest"` 的休息镜头可允许无媒体节点，但必须在 board 写 `tech_stack_layer.empty_frame_reason`。

素材生成失败时按 `concrete_execution_plan.fallback_plan` 降级；仍失败 ⇒ scene 状态退回 director-board，不进入 lookdev。

触发：Lookdev Approval。
验证：`review.lookdev_gate_results[].rule_results[rule_id=concrete_asset_realization_check]` 必须 `passed`（或 `manual_review_required` 显式签字）。

修复路径：AI 自己退回 visual-compiler 重生成素材，不退给用户。

## INV-CONCRETE-EXECUTION-PLAN-REQUIRED

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，每个 `scene_boards[].brainstorming_layer.analogy_pass` 必须有 `concrete_execution_plan` 子对象，且至少包含：

- 非空 `asset_kind`（枚举：`imagegen_2d` / `hunyuan3d_mesh` / `comfyui_workflow` / `remotion_dataviz` / `screen_recording_annotated` / `infographic_svg` / `chibi_layered` / `stock_photo_annotated` / `mixed_compose`）
- 非空 `generation_skill_route`（枚举：`imagegen` / `comfyui_hunyuan3d` / `local_cli` / `manual_implementation` / `remotion_native`）
- 生成路线有非空 `generation_prompt`（完整 prompt 文本，能直接喂给目标 skill）；`generation_skill_route === "remotion_native"` 时可写 `not_needed_programmatic`，但必须有非空 `concept_object_plan` + `motion_primitives[]`
- 非空 `remotion_layout_plan`（镜头计划 + 字幕布局）

这是阻止 AI 只写"AI 像翻书"这种空话就完事的根本机制——必须把抽象类比落地成具体素材生成指令或可运动概念结构。AI 在 director-board 阶段必须按 [`concrete-analogy-playbook.md`](./concrete-analogy-playbook.md) 或 [`spoken-knowledge-motion-grammar.md`](./spoken-knowledge-motion-grammar.md) 填具体内容。

触发：Visual Lock 前。
验证：扫所有 `scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan`，缺任一必填字段 ⇒ block。生成路线缺 `generation_prompt` ⇒ block；`generation_skill_route === "remotion_native"` 时缺 `concept_object_plan` / `motion_primitives[]` ⇒ block。cite `scene-XX.brainstorming_layer.analogy_pass.concrete_execution_plan.{字段}`。

修复路径：AI 退回 `xingchen-director-board` Procedure 2.5 补写完整 plan，不退给用户。

## INV-CREATOR-SIGNATURE-ADAPTATION

Creator-avatar family memory is a signature style memory, not a template source. If `visual.visual_policy.creator_signature_policy.brand_memory_used === true`, Visual Lock requires non-empty `selected_family_from_brand_memory`, `adaptation_reason`, and `anti_template_constraint`. The adaptation reason must explain why this project should use the creator signature, and the anti-template constraint must prevent repeated opener/outro layouts, fixed palette stamping, avatar-as-proof, or copied Stitch/Remotion family code.

## INV-DIRECTOR-BOARD

Visual Lock requires `visual.director_board`. The board must read the user's material unit by unit, read recording/transcript rhythm when present, bind every StoryMother scene to source units and narration beats, and specify source, arrangement, aesthetic, frame, detail, component, subtitle, tech-stack, and lookdev-acceptance layers for every scene. HTML 3D must state camera/depth purpose, Spark must state spatial/world reason plus preview requirement, VibeMotion must stay supporting/candidate only, and subtitles must declare safe regions plus `must_not_cover[]`.

## INV-DIRECTOR-PLAN-BEFORE-RENDER

Rendering cannot begin from isolated renderer prompts. A project must first have script beats, a locked StoryMother, scene cards, proof binding, narration spine, visual scene decisions, and render scene motion specs that trace back to the StoryMother. Render adapters compile the director plan; they do not invent the film.

## INV-ENERGY-CURVE-REQUIRED

Every project must assign energy levels (1-10) to each scene during story mother construction. The energy curve must pass the three-act shape check (assault / build / payoff) and must not be a flatline, all-peaks, or slow-start anti-pattern. See [energy-density-map.md].

## INV-GLOBAL-ASSET-REGISTRY

任何可复用视觉素材（模型、HDRI、纹理、图标、字体、参考包、生成资产、组件示例）进入 Xingchen 工作流前，必须先经过全局素材库治理。

**强制规则**：

- 新下载或新生成前，先查 `C:\Users\liuzh\Videos\douyin\visual-assets\registry\asset-registry.json`
- 新增可复用素材后，必须登记 source、license、local_path、tags、visual_roles、checksum 或 pack checksum
- 单个项目只保留 `_ready_materials\asset-library-reference.md` 或 project usage JSON，避免把大素材包散落复制到每个项目
- 版权或来源不清的素材只能标记 `blocked_for_reuse`，不能进入公开成片

触发：asset-intake、visual-resource preflight、visual-compiler 外部素材生成后。
验证：有 reusable asset path 但 registry 无匹配 `asset_id` ⇒ warning；进入 render 且仍无 license/provenance ⇒ failed。
修复路径：退回 asset-intake，补 registry 和 project usage manifest；不清楚授权就替换为 CC0 / 官方证据 / 自生成资产。

## INV-GSAP-HYPERFRAMES-TRACE

For DOM/SVG-heavy HyperFrames routes, GSAP is the default choreography lane. A candidate must either record `gsap_usage: "used"` with `gsap_timeline_notes` describing the semantic reveal sequence, or record `gsap_usage: "skipped_with_reason"` with a concrete reason such as literal proof geometry staying in Remotion or an already approved Remotion-native component. A static HTML/TSX fallback without `gsap_usage` is invalid when the scene job depends on staged DOM/SVG motion.

## INV-HERO-FRAME-REQUIRED

Every project must identify a `hero_frame_scene_id` in `project-state.json.visual` during story mother construction. The hero frame is the single scene carrying the thesis's strongest visual proof. During visual direction, the hero frame must receive 2-3x the scale of any other element in the video. A project where no frame stands out visually above the rest has failed this invariant.

## INV-HOOK-DESIGN-REQUIRED

Every Douyin-bound project must record a `hook_design` in `project-state.json.visual` before `Visual Lock`. The hook design must name the chosen hook pattern, pass the thumb-stop self-test, and record `hook_energy_level` as the ceiling for the energy curve. See [douyin-hook-science.md].

## INV-HUASHU-TASTE-PREFLIGHT

Before `Visual Lock`, Xingchen must run the Huashu-inspired taste preflight in [huashu-design-taste-upgrade.md](./huashu-design-taste-upgrade.md). The preflight must record: medium persona, core asset protocol, three materially different direction options when direction is not already locked, selected direction, anti-AI-slop bar, placeholder policy, and continuous-motion rule. Branded/product/UI/proof scenes must use real assets or honest placeholders; fake dashboards, CSS/SVG product silhouettes, and generated proof UI are blockers. If the user says the output is ugly, flat, generic, or PPT-like, the agent reruns this preflight before renderer or color tuning.

## INV-IMAGEGEN-ASSET-BOUND-TO-SCENE

`render.generated_assets[]` 中所有 `asset_kind ∈ {imagegen_2d, hunyuan3d_mesh, mixed_compose, stock_photo_annotated}` 的资产**必须**：

(a) 被至少一个 scene 的 `concrete_execution_plan.expected_output_paths[]` 或 `additional_asset_specs[N].expected_output_paths[]` 引用
(b) 至少一个 `render.scene_motion_specs[].component_path` 指向的 .tsx 文件含 `staticFile("...{filename}...")` 实际 import 该资产

**为什么**：资产生成了但代码里没 import = imagegen 白白生成 + 画面退化到 div 凑数。0513 的 `premium-object-sheet.png`（5 个真实金属/玻璃物件，质感非常好）在 .tsx 里 0 次 import 是这条规则的典型缺位案例。

触发：Lookdev Approval。
验证：lookdev `rule_id=imagegen_asset_orphan_scan`：对 generated_assets[] 中每个 imagegen 类资产做双重 grep（scene plan + .tsx 源码），两个都没命中 ⇒ failed，cite 孤儿资产文件名。
修复路径：AI 退回 director-board 把孤儿资产绑到具体 scene 的 plan（写进 expected_output_paths）；然后退回 visual-compiler 在该 scene 组件里 `<Img src={staticFile("...")}/>`。如果资产确实不该用，从 generated_assets 删除。

## INV-IMAGEGEN-NO-CHINESE-TEXT

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，所有 imagegen 生成的图（`asset_kind ∈ {imagegen_2d, mixed_compose, stock_photo_annotated}` 的产出）**不允许含中文文字**。

**为什么**：image-gen 模型（SDXL / FLUX / GPT-Image / DALL-E）出中文几乎必糊 + 必错字。生成的"传统程序的天花板"会变成"传统呈序的太花扳"。中文必须由 Remotion 程序叠字（用 NotoSansSC / DengXian 真实字体）。

**强制规则**：

(a) 所有进入 imagegen / Hunyuan3D / stock-photo 生成路线的 `concrete_execution_plan.generation_prompt` 和 `additional_asset_specs[].generation_prompt` 必须包含 negative prompt 段：`"no Chinese text in image, no Chinese characters, no text inside the artwork, leave clean space at top/bottom for overlay caption"`。`generation_skill_route === "remotion_native"` 的程序化概念结构不适用本条。
(b) imagegen 出图后跑 OCR 扫描中文字符
(c) 中文必须**留给 Remotion 程序叠字层**，imagegen 出**留白版**主体图

**例外**：用户提供的真实截图素材（来自 `sources.asset_manifest[]`）含中文是"真实证据"，不在此规则范围。

触发：visual-compiler 在 Concrete Asset Realization Pass 写 prompt 时（前置） + Lookdev Approval（事后检测）。
验证：
- prompt 内是否含 "no Chinese text" 负面段
- lookdev `rule_id=imagegen_chinese_text_scan`：对 `render.generated_assets[].asset_paths[]` 中 `asset_kind` 是 imagegen 类的 PNG 跑 OCR，命中 ≥ 2 个连续中文 ⇒ warning；≥ 4 个或成完整词组 ⇒ failed
修复路径：AI 退回 visual-compiler，重写 generation_prompt（加 negative prompt + 留白要求），重新调 imagegen 生成。Remotion 组件里**始终**用 `<NotoSansSCText>` 真实字体程序叠中文，**禁止**依赖 imagegen 出的图内文字。

## INV-IMAGEGEN-REMOTION-DIVISION

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，画面元素的生产路由必须按 [`imagegen-vs-remotion-division.md`](../../xingchen-visual-compiler/references/imagegen-vs-remotion-division.md) 的三层 layered 模板：

- **Layer 0（imagegen 物件层）**：真实物件 / 质感资产 / 角色 / 背景 / 场景
- **Layer 1（Remotion 几何标注层）**：SVG 箭头 / 圈红 / 高亮框 / 连接线 / 粒子 / scan 线 / 状态指示
- **Layer 2（Remotion 中文文字层）**：字幕 / 关键词标签 / 章节短词 / 状态短句（NotoSansSC / DengXian）
- **Layer 3（Remotion 镜头层）**：CameraRig + 多 z-depth parallax + Freeze + 真镜头运动

**禁止职责错配**：

- ❌ SVG 程序绘制本应是物件的东西（违反 `svg-mimicking-physical-object` forbidden pattern）
- ❌ imagegen 生成中文文字（违反 `INV-IMAGEGEN-NO-CHINESE-TEXT`）
- ❌ imagegen 出假 UI / 假 dashboard（违反 `imagegen-fake-ui-screenshot` forbidden pattern）

触发：Visual Lock 前（director-board 写 `concrete_execution_plan` 选 asset_kind 时） + Lookdev Approval。
验证：lookdev `rule_id=programmatic_object_form_check`（扫 .tsx 找 SVG 假装物件） + `rule_id=imagegen_chinese_text_scan`（扫 imagegen PNG 找中文）。
修复路径：AI 按 [`imagegen-vs-remotion-division.md`](../../xingchen-visual-compiler/references/imagegen-vs-remotion-division.md) 的 3 问决策矩阵重新分工——物件层用 imagegen 重生成，信息层用 Remotion 程序，中文层用真实字体叠字。

## INV-JARGON-DENSITY-CAP

当 `audience.tier = lay_curious` 时，每分钟 jargon 出现次数（jargon = 在 `script.spoken_script` 或画面可见文本中出现、但不在 `audience.vocabulary_level.allowed_jargon_terms` 的技术词）不超过 `audience.vocabulary_level.max_jargon_density_per_minute`（默认 3）。

触发：Script Lock + Lookdev 双重。
验证：counts / duration_min。超过 ⇒ warning 写入 `lookdev_gate_results[].rule_results[rule_id=jargon_density_scan]`，不直接 block 但提醒 AI 下次自检。

## INV-KNOWLEDGE-WRITEBACK

每个完成或认真尝试过的 Xingchen 项目，都必须在 review 后显式处理知识回写。

**强制规则**：

- review 后运行 [knowledge-writeback-pass.md](./knowledge-writeback-pass.md)
- 成功画面、失败路线、素材寻找方法、技术契约、创作者风格洞察都要进入候选列表
- 候选要么写入 stevenmind / skill reference / asset registry，要么记录拒绝理由
- 静默结束不允许

触发：`publish -> review -> knowledge-writeback`。
验证：项目有 publish/review 证据但无 `knowledge_writeback.status` 或无 accepted/rejected/not_needed 说明 ⇒ warning；反复项目无回写 ⇒ failed。
修复路径：补 `knowledge-writeback-candidates.md/json`，按域路由写入 stevenmind 或 skill reference，并更新 asset registry。

## INV-LANGUAGE-GAME-CORRECTION

Before Script Lock and Visual Lock, key creative terms must pass [language-game-correction.md](./language-game-correction.md). A term passes only when its use in the current production game is public: narration wording, on-screen text, proof role, camera reveal, object behavior, transition, or lookdev criterion. Phrases such as `高级`, `电影感`, `更丰富`, `黑箱`, `飞轮`, `像人讲的`, and similar style labels cannot move downstream as private taste instructions. They must be rewritten into existing state fields (`scene_question`, `why_selected`, `on_screen_text`, `camera_path`, `why_this_stack`, `visual_resource_trace`, or `lookdev_gate_results`) or routed to `unresolved_questions` / `manual_review_required`.

## INV-LOOKDEV-BEFORE-RENDER

`Lookdev Approval` must be `approved` (or `manual_review_required` with explicit human override) before render execution. The runtime check is `metadata.active_stage === "render"` ⇒ `workflow.approvals[Lookdev Approval].status !== "pending"`.

## INV-LOOKDEV-NO-SKIP-FOR-LAY

强化 `INV-LOOKDEV-BEFORE-RENDER`：当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，**禁止**通过 user manual approve 跳过 lookdev。

- 旧规则允许"用户跳过 lookdev 直接 render"（0506 项目模式）—— 在 lay tier 项目里**这条快捷通道关闭**
- `workflow.approvals[Lookdev Approval].status` 必须是 `approved`，且 `review.lookdev_gate_results[]` 非空且**所有 audit rule_id 都有结果**（不能 lookdev_gate_results: []）
- "用户已签字接受" 不是足够理由 —— 必须真的跑完 audit
- 0513 的 `lookdev_gate_results: []` + 直接 render 是这条规则的缺位案例

**为什么**：lay 受众视频的 11 项 audit 是阻止画面退化到 PPT 的**最后防线**。lookdev 跳过 = 所有 INV 失效 = codex 选什么就出什么。

触发：进入 `metadata.active_stage === "render"` 前。
验证：tier ≤ lay_curious 且 `review.lookdev_gate_results.length === 0` ⇒ block render；tier ≤ lay_curious 且某 audit rule_id 状态为 `pending` / `not_evaluated` ⇒ block render（不能 manual_review_required 兜底直接放）。
修复路径：AI 必须真的跑完所有 11 项 audit（13 项加 E 系列后 15 项），任一 failed 退回上游修。"用户说可以发了"不能绕过这条规则。

## INV-LOOKDEV-VOCAB-AUDIT-PASS

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，Lookdev 必须包含以下 audit 结果，且每条 status ∈ {`passed`, `manual_review_required`}（manual_review_required 需用户显式签字）：

- `rule_id=render_pack_text_grep`（render-pack JSON 文本字段扫描）
- `rule_id=tsx_source_text_grep`（.tsx/.jsx React 组件源码扫描——抓硬编码 JSX 文本和 metadata 字段绑定）
- `rule_id=onscreen_text_cite_audit`（cite_source 合法性 + cite_quote 子串验证）

触发：Lookdev Approval。
验证：`review.lookdev_gate_results[].rule_results[]` 必含三条且 status 不为 `pending` / `failed`。

修复路径：失败时 AI 自己退回上游修，不退给用户。用户只看到最终通过 lookdev 的成片。

## INV-MATERIAL-DIRECTOR-PASS

`visual.material_director_pass` is retained as compatibility evidence for source-led projects. New projects should express this work through `visual.director_board`, which is the primary Visual Lock gate.

## INV-MONOTONY-CHECK

Before `Visual Lock`, the visual direction must pass the variety checkpoint: at least 4 of 6 contrast dimensions (color temperature, layout structure, element scale, visual density, motion character, background world) must show meaningful variation across the piece. See [visual-contrast-system.md].

## INV-MOTHER-LOCK-BEFORE-VARIANT

`StoryMother Lock` must be `approved` before `visual-direction` or `platform-adapt`. A platform variant cannot be derived from an unlocked mother.

## INV-NO-GEN-DEFAULT

Generated-image/video inserts (`gen_insert` / `mixed_scene`) must not become the default renderer for a piece. `code_primary` is the project default and the per-scene default. Generated inserts must stay scoped to named scenes and may not carry proof, subtitles, narration timing, or final assembly ownership.

## INV-NO-HYPERFRAMES-UNPROMOTED-FINAL

Hyperframes candidates are review evidence and HTML/canvas scene sources. They cannot become final delivery without (a) `Lookdev Approval` recording the candidate's `review_status: "approved"`, (b) the candidate recording `candidate_origin` plus non-empty `state_trace_refs[]`, and (c) the final route recording `motion_source: "hyperframes_runtime"`, `integration_mode`, and `promotion_target_renderer_family`. Hyperframes must not silently become the full-video controller for narration, subtitles, proof overlays, audio assembly, platform variants, or final export.

## INV-NO-INSIDER-CHROME-ON-LAY

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 且 `audience.insider_chrome_allowed=false` 时，`visual.visual_policy.allowed_chrome[]` 不允许包含 `family=development_toolchain` 或 `family=production_pipeline` 的组件。

触发：Visual Lock。
验证：`allowed_chrome[].family` 与 `audience.insider_chrome_allowed` 交叉。命中即 block，cite 具体 `allowed_chrome[X].component_name` + `family`。

修复路径：AI 退回 `xingchen-art-direction` 重新挑选 chrome，从 family 中剔除上述两类。

## INV-NO-MOTHER-REWRITE-ON-VARIANT

A `PlatformVariant` may change hook, pacing density, subtitle policy, title, cover brief, and limited scene packaging. It must not silently rewrite `core_thesis`, `proof_binding` meaning, or `mother.story_mother.scene_order` unless the rewrite is explicitly recorded in `variants[*].scene_adjustments` and re-approved.

## INV-NO-PARALLEL-TRUTH

`art-direction.md`, `visual-language-kit.json`, and `lookdev-gate.yaml` are derived review surfaces once `project-state.json` exists. Editing decisions go to state first, then re-export the surfaces.

## INV-NO-SILENT-PASS

When an approval rule is `unsupported` or `not_evaluated`, the overall result must route to `manual_review_required`. Unsupported rules cannot pass silently. This applies to both machine gates and aesthetic checks.

## INV-NO-VIBEMOTION-FINAL

VibeMotion candidates are review evidence. They cannot become final delivery without (a) `Lookdev Approval` recording the candidate's `review_status: "approved"`, (b) the candidate recording `candidate_origin` plus non-empty `state_trace_refs[]`, and (c) the final route recording `integration_mode` and `promotion_target_renderer_family`. `renderer_family: "vibemotion_candidate"` is blocked at `active_stage >= "render"`.

## INV-PHYSICAL-METAPHOR-NEEDS-IMAGEGEN

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，scene 的 `concrete_execution_plan.enumerated_concepts[]` 含**实物隐喻名词**（中文实物词如：笼/箱/盒/管/桶/罐/邮件/表格/纸/书/相机/屏幕/键盘/桌/椅/灯/装置/外壳/机器/仪器/钥匙/路标/标牌/冰山/齿轮/电路/抽屉/文件夹/容器/玻璃 等），且画面意图是让观众相信“这是一个真实可见物件”时，asset_kind **必须**是 `imagegen_2d` / `hunyuan3d_mesh` / `mixed_compose` / `stock_photo_annotated`，**不能**是 `remotion_dataviz` / `infographic_svg`。

**口播知识 override**：当 `visual.visual_policy.spoken_knowledge_motion_policy.selected === true` 且“黑箱 / 锁 / 积木 / 路线 / 边界”等只是抽象论证隐喻时，不触发本规则；优先用 `remotion_dataviz` / `infographic_svg` 实现可运动概念结构（关系场、轨道、层级、节点图、扫描窗、反馈回路），并记录选用的 `motion_primitives[]`。本规则仍适用于真正需要物理材质、真实产品、场景、人物、纸张、机器、器具的镜头。

**为什么**：实物隐喻的画面力量来自真实物理质感（金属/玻璃/纸张/机械结构）。但口播知识视频里，抽象隐喻的价值常常不是“像一个道具”，而是“把论证路线变成可看见、可运动、可被声音驱动的结构”。低质生成物件会拉低可信度，必须允许 Remotion-native 结构优先。

**枚举具象名词的检测**：当 `enumerated_concepts[]` 元素是上面列表中的中文实物词（或包含这些词的复合词如"工具笼"），且 scene 的 `visual_intent` / `asset_quality_reason` 要求真实物件质感，即触发本规则。若是口播知识 override，必须写明它被转译成哪种概念结构，而不是用词面触发 imagegen。

触发：Visual Lock 前（director-board 写 plan 阶段直接拦） + Lookdev Approval（事后兜底）。
验证：lookdev `rule_id=concept_as_svg_geometry_check`：扫每个 scene 的 `concrete_execution_plan.enumerated_concepts[]`，含上述实物名词且 `asset_kind ∈ {remotion_dataviz, infographic_svg}`，但没有 `spoken_knowledge_motion_policy` override / `concept_object_plan` ⇒ failed。
修复路径：AI 退回 director-board 二选一：若确实需要真实物件，改 `asset_kind` 为 `imagegen_2d` / `hunyuan3d_mesh` / `mixed_compose`，加 `additional_asset_specs[]`；若是口播知识抽象隐喻，补 `concept_object_plan`、`motion_primitives[]`、`generated_prop_decision: "rejected_for_explainer_clarity"`，SVG/Canvas/Remotion 作为主画面结构。

## INV-PHYSICS-OVER-LINEAR

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 且 scene 的 `concrete_execution_plan.physics_targets[]` 非空（即 scene 含进入/离开/碰撞/弹跳/散落动作）时：

- visual-compiler 实现这些目标的位置/scale 动画**必须用** `spring({frame, fps, config})` 或物理引擎（`matter-js` / `rapier` / `cannon` / `@dimforge/rapier3d`）
- **禁用** `interpolate(...)` 的 linear 平移（即使带 Easing.bezier 也不算物理）

**为什么**：物理动作的视觉力量来自真实的惯性 + 弹性 + 阻尼 + 碰撞反馈。R04 的"7 种杂乱素材飞进玻璃舱"用 7 条 linear interpolate 是平稳滑入——没有"被吸力扯进 / 撞击玻璃 / 反弹震动"的物理感。

触发：Lookdev Approval。
验证：`physics_targets[]` 非空 ⇒ 扫 .tsx 必须含 `spring(` 或物理引擎 import ⇒ pass；只有 interpolate(linear) ⇒ fail。
修复路径：AI 退回 visual-compiler，把对应目标改用 `spring()`（每个 target 独立 mass/damping/stiffness 制造节奏错落）或 import 物理库做真实碰撞。

## INV-PLUGIN-ADAPTER-TRACE

Codex plugins, local CLIs, local skills, and manual implementations are execution adapters, not planning authorities. Any adapter-created or adapter-promoted scene artifact must append `render.plugin_adapter_runs[]` with `adapter_kind`, `adapter_id`, concrete skill/command lane, scene ids, input state refs, output paths, state writebacks, status, candidate ids when applicable, promotion target renderer family, and lookdev evidence requirement. HyperFrames candidates must also appear in `render.hyperframes_candidates[]` and be linked by `candidate_ids[]`. Adapter runs cannot replace `visual.director_board` or bypass Visual Lock.

## INV-PROOF-FRAME-STRATEGY

Render-bound scenes that carry literal proof (screenshots, UI captures, terminals, charts, PDFs) must record explicit `frame_strategy`, `distortion_policy`, `anchor_region`, `proof_regions`, `subtitle_safe_region`, and `z_order_plan` on their `SceneMotionSpec`. Render adapters may not improvise crop, stretch, or overlay order under deadline pressure.

## INV-REACTBITS-FRAME-DRIVEN

ReactBits-derived effects are component references, not renderer families, template scenes, or approval evidence by themselves. Any ReactBits-inspired motion must resolve into an existing Xingchen shot, a kit-extension request, or a bounded HyperFrames/HTML candidate. Final Remotion motion must be frame-driven; raw hover, cursor, scroll, CSS keyframe, requestAnimationFrame, or uncontrolled-random behavior cannot ship. Proof regions and subtitle safe regions must remain explicit and readable.

## INV-RECORDING-CORRECTION-BEFORE-VISUAL

Recording-first projects must correct and inspect narration before visual design. Before `visual-direction`, `sources.recording_correction` must record source audio refs, cleaned or accepted audio paths, transcript path, cleanup report path, correction actions, and quality checks. Director boards cannot be built from raw audio guesswork.

## INV-REMOTION-ANIMATION-DEPTH

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时：

- 每个**非 rest** scene 必须使用 ≥ 1 个 **L2** Remotion 能力（spring 物理 / 多层 parallax / 真镜头运动 / paths 路径动画 / animation-utils 链式变换 / Freeze / 粒子 ≥ 50 / transitions / shapes / Sequence-Loop 编排）
- 全片至少 1 个 scene 使用 ≥ 1 个 **L3** Remotion 招牌能力（@remotion/three / media-utils 声波驱动 / paths SVG morph / motion-blur / Skia / 物理引擎 / Lottie / time-remap / noise / WebGL shader）

**为什么**：xingchen 项目的画面"像 PPT"的根因不是审美/词汇——是 Remotion 高阶能力 0 使用。只 `interpolate + Easing.bezier + opacity` 等价 CSS transition。让 Remotion 真正发挥需要强制使用其独家能力。

详细能力分级、grep 检测算法和推荐 install 包清单见 [`remotion-animation-depth.md`](../../xingchen-visual-compiler/references/remotion-animation-depth.md)。

触发：Visual Lock 前（director-board 写 `remotion_animation_depth` 字段）+ Lookdev Approval（visual-compiler 实际写出 .tsx 后 audit）。
验证：
- 每个 scene 的 `concrete_execution_plan.remotion_animation_depth.l2_capabilities_used[].length ≥ 1`（director-board 阶段）
- 全片至少 1 个 scene 的 `l3_capabilities_used[].length ≥ 1`（director-board 阶段）
- lookdev `rule_id=remotion_animation_depth_check`：对每个 scene 的 component_path .tsx 跑 grep（按 `remotion-animation-depth.md` 的 L2/L3 触发条件 regex），实际使用与声明匹配 ⇒ pass；声明了但 .tsx 里没实际用 ⇒ fail

修复路径：缺 L2 ⇒ AI 退回 visual-compiler 加 spring / parallax / 真镜头 / paths / 等任一 L2 实现；缺 L3 ⇒ 选一个 hero scene 接入 @remotion/three 或 useAudioData 或物理引擎。若所需 npm 包未装，写 `render.dependency_install_requests[]` 让 codex `npm i`。

## INV-SCENE-DECISION-CARD

Before visual direction, every scene must record a decision card in `project-state.json.visual.scene_decisions[]` containing: `job`, `energy_level` (1-10), `layout_pattern`, `color_temperature_direction`, `is_scale_moment` (boolean), `evidence_role` (hero/supporting/background/none), `motion_character` (snappy/smooth/slow/held), `density` (minimal/moderate/dense). Scenes without decision cards cannot proceed to lookdev.

## INV-SCENE-EDGE-FLOW

Every adjacent StoryMother scene pair must have a `visual.director_board.scene_edge_boards[]` entry. The edge board must record the bridge question, options considered, selected bridge, narrative bridge, continuity handle kind, out/in handles, transition method, cut moment, duration, anti-PPT risk, and lookdev acceptance. Its out/in handles must reference real `scene_boards[].brainstorming_layer.continuity_handles[]` ids. This makes flow a director decision rather than a post-production effect.

## INV-SCENE-JOB-NAMED

Every scene in the story mother must have an explicit `job` label: one of `hook`, `context`, `proof`, `build`, `peak`, `rest`, `payoff`, `close`. Two consecutive scenes with the same job require explicit justification. A scene without a named job cannot enter visual direction.

## INV-SCREEN-RECORDING-ROUTE

Screen recordings are existing source media. They may be used as `evidence_clip` or `source_media_plate`, but the recording itself must not be routed through VibeMotion, Hyperframes, or Spark. Record `motion_source: "existing_media"`, `integration_mode: "video_plate"`, and `promotion_target_renderer_family: "remotion_component"`; use Remotion for crop, zoom, redaction, subtitles, callouts, and final composition.

## INV-SCRIPT-LOCK-BEFORE-MOTHER

`Script Lock` must be `approved` before `story-mother` work begins. Locks spoken wording, narration spine, proof boundaries, and beat truth.

## INV-SOURCE-MATERIAL-DIRECTOR-PLAN

If screenshots, recordings, screen recordings, or existing media assets enter the project, Visual Lock requires `visual.source_material_plan[]`. The plan must say which scene uses which source asset or screen-recording clip, what role it plays, and how it will be treated visually. Media may be rejected or marked reference-only, but it cannot disappear silently between ingest and render.

## INV-SPARK-NEEDS-ASSET

`renderer_family: "spark_3dgs"` may be selected only when the scene records a real `spark_asset_need`: a 3D model, real 3DGS asset, streaming RAD world, procedural splat world, hybrid Spark+Three world plate, spatial traversal, or material/light/volume/effect attached to a justified world asset. Spark scenes must preserve `execution_runtime: "spark_browser_canvas"` and should enter final composition as browser canvas plates. Spark is never the default for proof, UI, generic backgrounds, subtitles, voice, or final audio assembly.

## INV-SPEECH-RHYTHM-TRACE

Narration-led projects must preserve speech rhythm as explicit production evidence, not a private impression.

- Script-first projects: before Script Lock, `script.speech_rhythm_plan` should be `planned`, `manual_review_required`, or `not_needed` with a concrete reason. It must identify planned slowdowns, dense/professional-term pressure, pause points, and downstream visual support hints.
- Recording-first projects: before visual-direction, `sources.speech_rhythm` should be `completed`, `manual_review_required`, or `not_needed` with a concrete reason. It must point to timestamp truth (SRT or transcript segments), analysis outputs, rhythm flags, and visual handoff beats.
- When both plan and actual analysis exist, compare them before deciding whether to rewrite, rerecord, or compensate visually.

The rhythm map can suggest scene boundaries, transitions, subtitle grouping, and visual anchors. It cannot change claims, proof boundaries, or renderer ownership by itself.

## INV-SPOKEN-KNOWLEDGE-MOTION-GRAMMAR

当项目是口播型知识视频、AI explainer、recording-first educational video，或用户明确自称口播型知识博主时，Visual Lock 前必须评估 [`spoken-knowledge-motion-grammar.md`](./spoken-knowledge-motion-grammar.md)。

默认资产路线：真实证据素材 + Remotion 程序化概念物体（线、框、轨道、层级、节点、扫描、高亮、反馈回路）。生成物件 / 3D 只有在 director board 说明“为什么必须有真实材质、为什么该资产能通过 lookdev”时才允许。

触发：Art Direction → Director Board → Visual Compiler。
验证：`visual.visual_policy.spoken_knowledge_motion_policy.selected === true` 时，每个非 rest scene 必须有 `motion_primitives[]`、`concept_object_plan`、`generated_prop_decision`，且生成资产必须有 `quality_reason` / `lookdev_risk` / `fallback_to_programmatic_structure`。
修复路径：AI 退回 art-direction 选择 1-3 个 motion primitives，并把 cheap generated prop 改写为 Remotion-native 概念结构；只有通过质量理由的道具才进入 imagegen prompt pack。

## INV-TOPIC-LOCK-FIRST

`Topic Lock` must be `approved` before `script` or `story-mother` work begins. Locks `thesis`, `audience`, `goal`.

## INV-VISUAL-DISCOVERY-SESSION

讲解式动画的关键场景不能直接从脚本跳到 director board。Hook、抽象概念、证明、转折、结尾/payoff 场必须先完成 Visual Discovery Session。

**强制规则**：

- 每个 required scene 说明画面由什么构成：真实证据、源媒体、全局素材、生成物件、Remotion/R3F 概念结构、3D 空间、录屏标注或混合构成
- 每个 required scene 说明主视觉对象、资产来源决策、镜头揭示目的、连续性把手、anti-PPT commitment
- 用户未逐场讨论时，agent 可以提出方案，但必须标记 `user_discussion_status = "agent_proposed"` 并列出 assumptions

触发：xingchen-director-board 进入 Visual Lock 前。
验证：required scene 缺 `visual_discovery_session` 或缺 `asset_source_decision` / `camera_reveal` / `anti_ppt_commitment` ⇒ Visual Lock failed。
修复路径：退回 director-board，逐场补讨论或 agent proposed 方案。

## INV-VISUAL-LOCK-BEFORE-RENDER

`Visual Lock` must be `approved` before any render-bound work. Locks `visual.director_board`, `visual.visual_policy`, `lookdev_gate`, scene motion intent, and the derived director/art-direction review surfaces.

## INV-VISUAL-RESOURCE-PREFLIGHT

Before every `visual-direction` pass, Xingchen must run or refresh [visual-resource-and-prompt-preflight.md](./visual-resource-and-prompt-preflight.md). The preflight must produce a current resource matrix covering source reality, design-system memory, selected/rejected SVG or icon libraries, selected/rejected Remotion packages, image-generation route, prompt-pack paths when generation is needed, license/provenance notes, and lookdev audit hooks. Routes that are not needed must be recorded as `not_needed` with a reason; missing preflight evidence is not allowed. A scene cannot enter Visual Lock with only a style adjective or renderer suggestion. If the preflight is missing or stale, route back to `xingchen-director-board` / `xingchen-art-direction` before compiling scenes.

## INV-VISUAL-VOCABULARY-DIVERSITY

当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，同一支视频建议至少使用 2 种画面语言（参考 [`visual-vocabulary-library.md`](../../xingchen-visual-compiler/references/visual-vocabulary-library.md) 的 10 种枚举）。**单一画面语言占比 > 70% 或全片只用 1 种** ⇒ warning（不 block，但提醒 AI 下次自检）。

理由：单一画面语言全片重复 = 等价于 PPT 模板感（即使每帧画质好，整体也单调）。回形针 / Kurzgesagt / Vox 都混合使用至少 3-4 种画面语言。

触发：Lookdev Approval。
验证：`review.lookdev_gate_results[].rule_results[rule_id=visual_vocabulary_diversity_scan]` 的 status。
修复路径：AI 自己回 director-board 调整若干 scene 的 `asset_kind`，引入第二种画面语言。
