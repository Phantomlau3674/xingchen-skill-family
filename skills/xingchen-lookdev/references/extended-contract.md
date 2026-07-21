# Extended Contract

> This historical contract applies only when project-state.json uses mode extended or a legacy state has no mode field. It does not add gates or required fields to Lean projects.


# Xingchen Lookdev

## Lean Mode Override

When `project-state.json.mode === "lean"`, this section overrides every later conflicting requirement in this file.

Review rendered evidence, not planning completeness:

1. Watch the hook, hardest explanation or proof, and payoff with real audio on a phone-sized downsample.
2. Blind-watch the full preview and restate the thesis, confusing exits, and least trusted proof.
3. Check a platform-native draft on a real device.
4. Score the first seven dimensions in `xingchen-next/references/preview-quality-scorecard.md`.

Machine checks cover blank frames, assets, text overflow, safe regions, geometry, timestamps, and deterministic rendering. Human review covers comprehension, rhythm, trust, hierarchy, and PPT-like repetition.

Do not block Lean work for missing Topic, Script, StoryMother, Visual, or Lookdev locks; L2/L3 API absence; camera amplitude; missing `spring()`; missing optional packages; or incomplete Extended board fields.

The Lean blocking decision is `Preview Lock`, based on an actual full preview. All later five-lock and API-depth checks apply only to Extended or legacy projects.

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

Triggered during `lookdev`, after `xingchen-visual-compiler` writes scene motion specs and `video-project-graph` produces the render-pack, before `remotion-render-adapter` runs final render. Catches the common failure where a project is structurally valid but still ships flat, templated, unreadable, slide-like, or built on text-only motion promises. Do not approve final render from stills alone. Do not force a full-project rerender when the problem is isolated.

## Stage owned

`lookdev` | writeback: `project-state.json -> review.lookdev_gate_results[]` (and the Lookdev Approval). Exported audit artifact: `lookdev-gate-result.json`. Sets INV-LOOKDEV-BEFORE-RENDER.

## Ownership in family

Canonical owner of the **scene composition audit** ([scene-composition-audit.md](./scene-composition-audit.md)) and the **aesthetic review loop** ([aesthetic-review-loop.md](./aesthetic-review-loop.md)). The review loop includes the Huashu five-axis taste review from [huashu-design-taste-upgrade.md](../../xingchen-next/references/huashu-design-taste-upgrade.md), the GitHub design intake checks from [github-design-skill-intake.md](../../xingchen-next/references/github-design-skill-intake.md), and resource-route verification from [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md). The pre-render scene composition pass is owned by `xingchen-visual-compiler`; the audit consumes the geometry fields written there and verifies them against `visual.director_board.scene_boards[]`.

## Ironclad rules

- Approval requires real motion artifacts: `.mp4`, `.mov`, `.html`, Remotion component, or transparent asset. Stills are support only. Text-only VibeMotion descriptions are not evidence.
- Adapter-created artifacts must be traceable through `render.plugin_adapter_runs[]`; missing input state refs, output paths, state writebacks, or candidate ids are lookdev blockers, not paperwork gaps.
- AI video prompt requests are not preview evidence. AI video candidates are never proof; approve them only after the user/API has produced real files registered as Remotion-controlled `video_plate` artifacts with `render.ai_video_candidates[]`, safety review, proof exclusion policy, Remotion integration plan, and matching adapter trace.
- ReactBits-derived motion is not automatically approved because the source component looks polished. It must obey [reactbits-remotion-upgrade.md](../../xingchen-visual-compiler/references/reactbits-remotion-upgrade.md): frame-driven timing, no raw hover/cursor/scroll dependency, proof-safe regions, subtitle-safe regions, and either an existing Xingchen shot or a kit-extension request.
- Preview approval must audit consistency against each matching `visual.director_board.scene_boards[]` entry: `source_layer`, `arrangement_layer`, `brainstorming_layer`, `aesthetic_layer`, `frame_layer`, `detail_layer`, `component_layer`, `subtitle_layer`, and `tech_stack_layer`.
- Preview approval must audit every adjacent transition against `visual.director_board.scene_edge_boards[]`: the selected bridge, continuity handles, transition method, cut moment, and anti-PPT risk must be visible in the motion artifact.
- Preview approval must audit language-game correction from [language-game-correction.md](../../xingchen-next/references/language-game-correction.md): any preview claiming `高级`, `电影感`, `更丰富`, `黑箱`, `飞轮`, or `像人讲的` must visibly satisfy the public criterion recorded upstream. Vague "looks good" approvals are invalid.
- Preview approval must audit `visual.director_board.brainstorming_contract.github_design_intake`: real asset promises are visible or honestly absent, the design-system rules are followed, rejected slop patterns do not reappear, the verification route has evidence, and the five-dimension review plan is scored.
- If `visual.visual_policy.visual_style_influence.source = "vox_remotion_visual_style"`, preview approval must audit [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md): scene contract, world continuity, layer stack, one foreground proof carrier, Remotion-owned proof/text, mobile downsample readability, red marker semantics, beat sync, prop controls, and final hold frame.
- Failures must cite exact scene board or edge-board field paths, such as `scene-03.brainstorming_layer.anti_ppt_decision`, `scene-03.frame_layer.camera_path`, `scene-03.component_layer.primary_component`, `scene-05.subtitle_layer.must_not_cover`, or `edge-scene-03-to-scene-04.selected_bridge`. Vague failures like "not pretty enough" are invalid.
- Any unsupported aesthetic rule must route to `manual_review_required` (INV-NO-SILENT-PASS) — never a fake pass.
- Spark scenes: never approve `spark_3dgs` from a still, blank canvas, missing asset, or speculative plate. Procedural plates label as `procedural_splat_world`, not `true_3dgs_asset`. Fallback final quality requires explicit `approved_fallback_final` state and user acceptance.

Other shared rules: see [cross-skill-invariants.md](../../xingchen-next/references/cross-skill-invariants.md).

## Skill-local procedure

### Preview contract

Lookdev produces:

- `lookdev-brief.md`
- `lookdev-gate-result.json` and the state-backed `LookdevGateResult` entry
- low-res motion slices for the first 1–3 critical scenes or scene types
- actual VibeMotion candidate files for selected scene options when candidates are part of the plan
- actual HyperFrames plugin candidate files and their `render.plugin_adapter_runs[]` trace when HTML/canvas candidates are part of the plan
- actual AI video candidate files and their `render.ai_video_candidates[]` / `render.plugin_adapter_runs[]` trace when Seedance/manual generated-video plates are part of the plan; `render.ai_video_prompt_requests[]` alone is a handoff artifact, not lookdev evidence
- optional stills as support only
- style-specific stills or slices when a visual influence is selected, including evidence for foreground proof readability, layer stack, safe zones, and beat-synced reveal

Recommended output paths: `lookdev-slices/*.mp4`, `vibemotion-candidates/*`, `lookdev-stills/*.png`, `preview-audit.json`.

### Preview levels

- `L2 keyframe-stills` — validates scale, palette, safe areas. Not enough to approve final motion.
- `L3 low-res-motion` — default approval surface. Short low-res motion slices with working timing and subtitles. Validates rhythm, proof readability, transition behavior, candidate viability.
- `L4 full-preview` — full-resolution preview with audio. Use when the motion language is already trusted.

Defaults: new render work goes `L3 → L4`. `L2` is optional support, never the main gate.

### Approval gate prerequisites

Render path may continue only when:

- `project-state.json` is current
- Topic Lock, Script Lock, StoryMother Lock, Visual Lock all resolved
- proof and script layers reviewed in state
- `sources.source_pack.audience.tier` 已锁定且 `tier_user_confirmed=true`、`tier_locked_at` 非空（INV-AUDIENCE-TIER-LOCKED）
- tier ≤ `lay_curious` 时，所有 `knowledge_action ∈ {define, compare, decompose, prove}` 场景已有非空 `brainstorming_layer.analogy_pass.lay_analogy`（INV-ANALOGY-REQUIRED-FOR-LAY）
- 所有 `scene_boards[].frame_layer.on_screen_text[]` 条目都有合法 `cite_source`（指向 script / analogy / source_material，非 metadata 字段名）
- tier ≤ `lay_curious` 时，每个 scene 的 `concrete_execution_plan.enumerated_concepts.length > 1` 时 `additional_asset_specs.length ≥ enumerated_concepts.length`（INV-ASSET-SPECS-COMPLETENESS）
- tier ≤ `lay_curious` 时，每个非 rest scene 的 `concrete_execution_plan.remotion_animation_depth.l2_capabilities_used[].length ≥ 1`，全片至少 1 个 scene 的 `l3_capabilities_used[].length ≥ 1`（INV-REMOTION-ANIMATION-DEPTH）
- tier ≤ `lay_curious` 时，每个非 rest scene 的 `concrete_execution_plan.camera_intent != "held"`，且 `camera_scale_change ≥ 0.15` 或 `camera_translate_px ≥ 视口 15%`，且 `camera_motion_reveals` 非空（INV-CAMERA-AS-ARGUMENT）
- tier ≤ `lay_curious` 时，每个 scene 的 `physics_targets[]` 非空场景，对应 .tsx 已含 `spring(` 或物理引擎 import（INV-PHYSICS-OVER-LINEAR）
- tier ≤ `lay_curious` 时，npm `package.json` 已装满足声明 `l2/l3_capabilities_used[]` 所需的全部包（缺包必须在 `render.dependency_install_requests[]` 显式声明并由 codex 装齐）
- tier ≤ `lay_curious` 时，所有 imagegen 生成的 PNG 不含中文文字（INV-IMAGEGEN-NO-CHINESE-TEXT）+ 所有真实物件元素由 imagegen/source/Hunyuan3D 承担而非 SVG 程序绘制；口播知识抽象隐喻可用 Remotion-native 概念结构（INV-IMAGEGEN-REMOTION-DIVISION / INV-SPOKEN-KNOWLEDGE-MOTION-GRAMMAR）
- tier ≤ `lay_curious` 时，含实物隐喻名词且画面要求真实物件质感的 scene 必须 `asset_kind ∈ {imagegen_2d, hunyuan3d_mesh, mixed_compose, stock_photo_annotated}`；若 `asset_kind ∈ {remotion_dataviz, infographic_svg}`，必须有 `spoken_knowledge_motion_policy` override + `concept_object_plan`（INV-PHYSICAL-METAPHOR-NEEDS-IMAGEGEN）
- tier ≤ `lay_curious` 时，`render.generated_assets[]` 中所有 imagegen 类资产已被至少一个 scene plan 引用 + 至少一个 .tsx 文件 `staticFile()` import（INV-IMAGEGEN-ASSET-BOUND-TO-SCENE）
- tier ≤ `lay_curious` 时，`review.lookdev_gate_results[]` 非空且**所有** rule_id 都有结果（不允许 user manual approve 跳过 lookdev 直接 render；INV-LOOKDEV-NO-SKIP-FOR-LAY）
- `visual.director_board.status` is `completed` or `manual_review_required`
- the Huashu taste preflight exists in `art-direction.md` or a state-backed review surface, with medium persona, selected direction, core asset protocol, anti-slop bar, continuous-motion rule, and five-axis lookdev plan
- the GitHub design intake exists in `visual.director_board.brainstorming_contract.github_design_intake` or an equivalent state-backed review surface, with fact-check status, real assets, design system, direction choice, anti-slop bar, verification route, and five-dimension review plan
- the visual resource preflight exists in `visual-resource-research.md` or a state-backed review surface, with source reality, design-system memory, selected/rejected SVG/icon libraries, selected/rejected Remotion packages, imagegen route, prompt-pack paths when needed, and lookdev audit hooks
- if `visual_style_influence.source = "vox_remotion_visual_style"`, the preview evidence includes the style-specific checks named in [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md), or records unsupported aesthetic checks as `manual_review_required`
- spoken knowledge projects have `visual.visual_policy.spoken_knowledge_motion_policy` and each non-rest scene records `motion_primitives[]`, `concept_object_plan`, and `generated_prop_decision`
- every reviewed scene has a non-generic `brainstorming_layer`, and every adjacent scene pair has a `scene_edge_boards[]` bridge
- every key vague term or metaphor recorded upstream has a visible public criterion in the preview, or a `review.lookdev_gate_results[]` failure routes it back upstream
- visual policy and exported review files consistent
- every reviewed `render.scene_motion_specs[]` item back-references `visual.director_board.scene_boards[scene_id]`
- VibeMotion candidate files exist for selected candidate ids
- HyperFrames candidate files exist for selected candidate ids and every candidate id is linked from `render.plugin_adapter_runs[].candidate_ids`
- AI video candidate files exist for selected candidate ids, every candidate id is linked from `render.plugin_adapter_runs[].candidate_ids`, and the candidate safety review says no false evidence, no readable claim text, no brand/IP issue, and no face/identity risk
- Remotion plugin implementation or preview records identify affected `render.scene_motion_specs[]`, `render.jobs[]`, or render-pack paths when used
- render-pack graph current for the target variant
- `lookdev-gate.yaml` evaluation passes
- relevant motion slices approved
- Lookdev Approval written into `workflow.approvals`

### Recording-first motion review

For human-narration projects: preview slices use the real recording (or a timing-identical proxy, never a generic placeholder voice); opening order follows spoken sequence even when scene numbering shifted; frames are ready when keywords land, not a beat late; dominant anchors hold long enough to be understood; custom scenes still read after duration stretch; subtitles stay subordinate; recording-file boundaries did not create a fake scene break inside one continuous spoken thought.

### Scene composition audit (proof / UI / screenshot work)

Before approving screenshot-heavy or proof-heavy scenes, run [scene-composition-audit.md](./scene-composition-audit.md) to verify plate truth, geometry truth, region truth, read path, and exit safety against `visual.director_board.scene_boards[scene_id].frame_layer`. When a preview-frame manifest is available, pass `preview-audit.json` so overlap and safe-area failures are computed from actual pixels, not vibes.

### What to verify in any approval

**Audience-tier audits (新增，AI 自动跑，失败 AI 自己退回上游修，不退给用户)**：

1. **`rule_id: render_pack_text_grep`**（自动，blocker，tier ≤ `lay_curious` 时激活）：对 `render-plan.json` / `video-project.json` / `scene-direction.json` 中所有 `text` / `title` / `subtitle` / `caption` / `badge` / `label` 字段做 regex 匹配，针对 `forbidden-patterns.md` 中所有 `audience_visibility=banned_for_lay` 条目的 `detection` regex 集合。命中即 `failed`，cite 具体 token + scene_id。**AI 修复路径**：退回 `xingchen-visual-compiler` 重写该字段，遵循 `Render-pack text field discipline`；不退给用户。
2. **`rule_id: onscreen_text_cite_audit`**（自动，blocker）：扫所有 `scene_boards[].frame_layer.on_screen_text[].cite_source` 字段。任一条 `cite_source` 为空、指向 metadata 字段名（`scene_id` / `evidence_role` / `knowledge_action` / `job`）、指向项目内部章节名（`scene-board.md` / `S01-question`）、指向工具名（`xingchen-*` / `VoxCPM2` / `Remotion`）、或指向 `script.spoken_script` 不存在的行号 ⇒ failed。**额外验证**：`cite_quote` 字段必须是 `cite_source` 解引用后字符串的子串（case-insensitive, 去标点），否则 fail（cite 是假的）。**AI 修复路径**：退回 `xingchen-director-board`，删掉无合法 cite 的 text 条目，让该场画面回到"只有视觉"状态。
3. **`rule_id: analogy_presence_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：遍历 `scene_boards[].brainstorming_layer.analogy_pass`，`knowledge_action ∈ {define, compare, decompose, prove}` 且 `lay_analogy` 为空 ⇒ failed，cite `scene-XX.brainstorming_layer.analogy_pass.lay_analogy`。**AI 修复路径**：退回 `xingchen-director-board` 的 Procedure 2.5 补类比。
4. **`rule_id: jargon_density_scan`**（自动，warning）：在 `script.spoken_script` + 画面可见文本中统计 `audience.vocabulary_level.allowed_jargon_terms` 之外的技术词出现次数，除以 duration_min。超过 `max_jargon_density_per_minute`（默认 3）⇒ warning 写入 `lookdev_gate_results`，不 block 但提醒 AI 下次自检。
5. **`rule_id: concrete_execution_plan_required`**（自动，blocker，tier ≤ `lay_curious` 时激活）：遍历 `scene_boards[].brainstorming_layer.analogy_pass`，缺 `concrete_execution_plan`、缺其中任一必填字段（`asset_kind` / `generation_skill_route` / `remotion_layout_plan`） ⇒ failed。生成路线缺 `generation_prompt` ⇒ failed；`generation_skill_route === "remotion_native"` 时，`generation_prompt` 可为 `not_needed_programmatic`，但必须有 `concept_object_plan` + `motion_primitives[]`。**AI 修复路径**：退回 `xingchen-director-board` 的 Procedure 2.5，按 [concrete-analogy-playbook.md](../../xingchen-next/references/concrete-analogy-playbook.md) 或 [spoken-knowledge-motion-grammar.md](../../xingchen-next/references/spoken-knowledge-motion-grammar.md) 套路写完整 plan。
6. **`rule_id: concrete_asset_realization_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：对每个有 `concrete_execution_plan` 的 scene 做以下检查：
   - 外部素材路线（`asset_kind ∈ {imagegen_2d, hunyuan3d_mesh, comfyui_workflow, screen_recording_annotated, chibi_layered, stock_photo_annotated, mixed_compose}`）要求 `analogy_pass.concrete_execution_plan.asset_realized=true` 且 `asset_realized_paths[]` 非空，或存在明确 manual handoff 请求。
   - 外部生成路线要求存在匹配的 `render.generated_assets[]` 条目（`concrete_execution_plan_ref` 反指本 scene），且 `render.generated_assets[].asset_realization_status ∈ {generated, previewed, approved}`。
   - `remotion_native` 程序化路线（例如 `asset_kind=remotion_dataviz`，或 `infographic_svg + generation_skill_route=remotion_native`）不要求 `render.generated_assets[]`，但要求 `concept_object_plan`、`motion_primitives[]` 非空，并且组件内有 `<svg>` / `<canvas>` / `@remotion/paths` / `@remotion/shapes` / `@remotion/three` 证据。
   - 对应 React 组件（`render.scene_motion_specs[].component_path` 指向的文件）内含至少一个媒体或程序化视觉节点。**扫描算法**：读 component_path 指向的 .tsx 全文，用 regex `/<(Img|Video|OffthreadVideo|ThreeCanvas|svg|canvas|primitive|Audio|Sequence)\b/` 匹配标签，至少 1 个匹配 ⇒ pass；外部素材路线还要检查至少一个 `<Img>` / `<Video>` 的 src prop 字符串能在 `render.generated_assets[].asset_paths` / `sources.asset_manifest[]` / `sources.brand_kit.*_path` 中找到匹配。
   - **例外**：`scene_job === "rest"` 的休息镜头可允许无媒体节点（但必须在 board 写 `tech_stack_layer.empty_frame_reason`）

   任一条不满足 ⇒ failed，cite 具体 scene_id + 缺失项。**AI 修复路径**：外部素材路线退回 `xingchen-visual-compiler` 生成/接入素材；`remotion_native` 路线退回 visual-compiler 写真实程序化结构，不生成廉价道具图。
7. **`rule_id: visual_vocabulary_diversity_scan`**（自动，warning）：统计所有 scene 的 `asset_kind` + 对应画面语言。若同一种画面语言（按 [visual-vocabulary-library.md](../../xingchen-visual-compiler/references/visual-vocabulary-library.md) 分类）占比超过 70%、或全片只用 1 种 ⇒ warning（视觉对比维度不足，参考 `INV-MONOTONY-CHECK`）。允许同主基调，但要至少 2 种画面语言混合。

8. **`rule_id: asset_specs_completeness_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：遍历每个 scene 的 `concrete_execution_plan`，若 `enumerated_concepts.length > 1` 且 `additional_asset_specs.length < enumerated_concepts.length` ⇒ failed，cite 缺失的 concept 名。**AI 修复路径**：退回 director-board Procedure 2.5 为每个 enumerated concept 写一个独立的 `additional_asset_specs[]` 条目（按 [`concrete-analogy-playbook.md`](../../xingchen-next/references/concrete-analogy-playbook.md) 套路选模板），并在 visual-compiler 阶段为每个 spec 调用 imagegen / ComfyUI 生成对应素材，**禁止用 div chip 凑数**。

9. **`rule_id: dashboard_chip_form_scan`**（自动，blocker，tier ≤ `lay_curious` 时激活）：扫描 `render.scene_motion_specs[].component_path` 指向的每个 `.tsx`，匹配 `<div style={{...}}>` 节点同时含 `border` + (`linear-gradient` 或 `radial-gradient`) + `box-shadow` 且作为前景文字容器。这种节点在同一 scene 内 > 2 ⇒ failed，cite 文件 + 行号。覆盖 `forbidden-patterns.md::dashboard-chip-shape-foreground`。**AI 修复路径**：把额外 chip 替换为 `<Img>` 引用真实生成素材（来自 `additional_asset_specs[]`），让物件本身承担信息而非 chip 容器。

10. **`rule_id: remotion_animation_depth_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：对每个非 rest scene 的 component_path .tsx 跑 [`remotion-animation-depth.md`](../../xingchen-visual-compiler/references/remotion-animation-depth.md) 中"如何 grep 检测 API 使用"段的 L2/L3 触发条件 regex 集合。
   - L2 命中数 ≥ 1（每个非 rest scene） ⇒ pass
   - 全片 L3 命中数 ≥ 1（任意一个 scene） ⇒ pass
   - 任一不满足 ⇒ failed，cite 缺哪一级 + 推荐至少 2 个可选 capability。
   - 同时交叉验证：`concrete_execution_plan.remotion_animation_depth.l2_capabilities_used[]` 声明的能力实际在 .tsx 中检测到（声明 `three_3d_canvas` 但 grep 找不到 `@remotion/three` import ⇒ failed）。
   **AI 修复路径**：退回 visual-compiler 实际 import 并使用对应 API。缺 npm 包先写 `render.dependency_install_requests[]` 让 codex 装包。

11. **`rule_id: camera_motion_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：扫每个非 rest scene 的 component_path .tsx，提取 CameraRig / 顶层 transform 中的 `interpolate(...)` 调用 outputRange 数值范围：
   - 计算 `scale` 最大变化绝对值
   - 计算 `translate{X,Y}` 任一方向累计幅度
   - scale 变化 < 0.15 AND translate 累计 < 视口 10% ⇒ failed（命中 `static-camera-decoration` forbidden pattern）
   - `camera_intent != "held"` 但实际幅度不满足该 intent 最小要求（push_in/pull_out scale ≥ 0.3 / dolly translate ≥ 视口 15%）⇒ failed
   **AI 修复路径**：退回 visual-compiler 重写 CameraRig，把声明的 camera_intent 实现到位（scale interpolate 输出范围拉到 ≥ 0.3 跨度 / translate interpolate 拉到 ≥ 视口 15%）。

12. **`rule_id: physics_over_linear_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：当 `concrete_execution_plan.physics_targets[]` 非空时，扫对应 .tsx 必须含以下任一：
   - `spring(` 调用（来自 `remotion` 包）
   - `import .* from ['"]matter-js['"]` 或 `rapier` / `cannon` / `@dimforge/rapier3d`
   只有 `interpolate(...)` 平移（无论是否带 Easing.bezier） ⇒ failed（命中 `linear-physics-for-impact-motion` forbidden pattern）
   **AI 修复路径**：退回 visual-compiler 把 physics_targets[] 对应元素的位置/scale 动画改用 `spring({frame, fps, config: {damping, stiffness, mass}})`，每个 target 独立 mass 制造节奏错落；或 import matter-js 做真实碰撞 + 重力 + 反弹。

13. **`rule_id: imagegen_chinese_text_scan`**（自动，blocker，tier ≤ `lay_curious` 时激活）：对 `render.generated_assets[]` 中 `asset_kind ∈ {imagegen_2d, mixed_compose, stock_photo_annotated}` 的所有 PNG 跑 OCR（PaddleOCR / RapidOCR），检测中文字符（Unicode CJK Unified Ideographs `一-鿿`）。
   - 命中连续 ≥ 2 个中文字符 ⇒ warning
   - 命中连续 ≥ 4 个中文字符或成完整词组（如"传统程序" / "无法处理" / "杂乱文本"）⇒ failed
   - 例外：`generated_assets[].provenance.is_user_provided_screenshot = true` 跳过（用户真实截图含中文是真实证据）
   **AI 修复路径**：退回 visual-compiler 重写 `generation_prompt` 加 `"no Chinese text in image, no Chinese characters, no text inside the artwork, leave clean space for overlay caption"` 负面段，重新调 imagegen 出留白版。Remotion 组件里用 `NotoSansSC` / `DengXian` 真实字体程序叠中文。覆盖 `forbidden-patterns.md::imagegen-with-chinese-text` 和 `INV-IMAGEGEN-NO-CHINESE-TEXT`。

15. **`rule_id: concept_as_svg_geometry_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：扫每个 scene 的 `concrete_execution_plan.enumerated_concepts[]`，检测是否含**中文实物隐喻名词**：`笼 / 箱 / 盒 / 管 / 桶 / 罐 / 瓶 / 邮件 / 表格 / 纸 / 书 / 相机 / 屏幕 / 键盘 / 鼠标 / 桌 / 椅 / 灯 / 装置 / 外壳 / 机器 / 仪器 / 仪表 / 钥匙 / 路标 / 标牌 / 冰山 / 齿轮 / 弹簧 / 电路 / 屏 / 杯 / 壶 / 抽屉 / 文件夹 / 容器 / 玻璃` 之一。命中实物名词且该 scene 的 `asset_kind ∈ {remotion_dataviz, infographic_svg}`，但没有 `spoken_knowledge_motion_policy` override / `concept_object_plan` / `motion_primitives[]` ⇒ failed，cite scene_id + 实物名词。覆盖 `forbidden-patterns.md::concept-as-svg-geometry-when-physical-metaphor`、`INV-PHYSICAL-METAPHOR-NEEDS-IMAGEGEN` 和 `INV-SPOKEN-KNOWLEDGE-MOTION-GRAMMAR`。
   **AI 修复路径**：退回 director-board 二选一：若画面真的需要真实物件质感，把对应 scene 的 `asset_kind` 改为 `imagegen_2d` / `hunyuan3d_mesh` / `mixed_compose`，写 `additional_asset_specs[]`；若这是口播知识抽象隐喻（如黑箱、锁定、知识积木、路线、边界、反馈），保留 `remotion_dataviz` / `infographic_svg`，补 `concept_object_plan`、`motion_primitives[]`、`generated_prop_decision: "rejected_for_explainer_clarity"`，并在 Remotion 里做可运动概念结构。

16. **`rule_id: imagegen_asset_orphan_scan`**（自动，blocker，tier ≤ `lay_curious` 时激活）：扫 `render.generated_assets[]` 中所有 `asset_kind ∈ {imagegen_2d, hunyuan3d_mesh, mixed_compose, stock_photo_annotated}` 的资产，对每个资产做双重 grep：
   - 资产 path 是否被任一 scene 的 `concrete_execution_plan.expected_output_paths[]` 或 `additional_asset_specs[N].expected_output_paths[]` 引用
   - 资产 filename 是否在任一 `render.scene_motion_specs[].component_path` 指向的 .tsx 中通过 `staticFile("...{filename}...")` 实际 import
   两个都没命中 ⇒ failed，cite 孤儿资产文件名。覆盖 `forbidden-patterns.md::imagegen-asset-orphan` 和 `INV-IMAGEGEN-ASSET-BOUND-TO-SCENE`。
   **AI 修复路径**：退回 director-board 把孤儿资产绑到具体 scene plan（写 `expected_output_paths`），visual-compiler 在该 scene 组件里 `<Img src={staticFile("...")}/>`。或者从 generated_assets 删除该资产。0513 项目的 `premium-object-sheet.png` 是这条规则的典型修复对象。

14. **`rule_id: programmatic_object_form_check`**（自动，blocker，tier ≤ `lay_curious` 时激活）：扫 `render.scene_motion_specs[].component_path` 指向的 .tsx，找疑似"程序绘制真实物件"的 SVG 块：
   - 同一 SVG 内 ≥ 3 个 polygon/path/rect 节点
   - 至少一个 `fill="url(#linearGradient...)"` 或含 `radial-gradient` / `linear-gradient` 引用
   - 该 scene 的 `enumerated_concepts[]` 含明显实物名（"机器/纸/书/相机/瓶/盒/管/灯/桌/椅/装置/外壳/胶片/磁带/CD/文件夹/玻璃/天花板/键盘/屏幕/手机"等中文实物名词）
   三者同时满足且没有 `spoken_knowledge_motion_policy` override / `concept_object_plan` ⇒ failed。覆盖 `forbidden-patterns.md::svg-mimicking-physical-object`。
   **AI 修复路径**：退回 `xingchen-director-board`。真实物件路线改为 `imagegen_2d` 或 `hunyuan3d_mesh` 并生成资产；口播知识抽象隐喻路线则补 `concept_object_plan` 与 `motion_primitives[]`，把 SVG/Canvas 明确为**概念结构层**而不是假物件层。详见 [`imagegen-vs-remotion-division.md`](../../xingchen-visual-compiler/references/imagegen-vs-remotion-division.md)。

**关键规则（与用户决策"INV 失败直接 block render，不走 manual_review"对齐）**：
- 上面 1/2/3 audit 失败 ⇒ 不向用户报错让用户处理。AI agent 自己退回上游 skill 修复并重新走 lookdev。
- 用户对失败不可见，只看到最终通过 lookdev 的成片。
- 只有所有 audit 都通过（或显式 manual_review_required 但已批）后才进入 render。
- `rule_id: ocr_vocabulary_scan` 留作 P1 兜底（OCR 抓背景图渗入的词汇），第一版用 text-field grep 覆盖 ~95%。

**传统 audit（保留）**：

- Vox/Remotion editorial influence checks when selected: `scene_contract_check`, `world_continuity_check`, `layer_stack_check`, `remotion_proof_ownership_check`, `bitmap_text_ocr_check`, `mobile_downsample_check`, `safe_zone_overlap_check`, `foreground_dominance_check`, `red_marker_semantics_check`, `beat_sync_check`, `motion_density_check`, `final_hold_frame_check`, `prop_control_smoke_test`, and `proof_source_trace_check`.
- proof readability and aspect/crop integrity (no non-uniform scaling on literal proof)
- subtitle avoidance of dominant anchor and proof-critical pixels
- one dominant visual anchor per scene, not multiple competing
- approved frame strategy actually respected
- piece feels like motion design, not a slide deck
- rendered scenes honor `visual.director_board.scene_boards[]`: source units are preserved, arrangement beats land on time, aesthetic intent is visible, frame/camera/proof/subtitle regions are respected, component choices match the board, and the chosen stack still matches `tech_stack_layer.why_this_stack`
- rendered scenes honor `brainstorming_layer.selected_direction`, use at least one declared continuity handle, and visibly avoid the stated `anti_ppt_decision`
- adjacent scene cuts honor `scene_edge_boards[]`: the outgoing handle, incoming handle, selected bridge, cut moment, and transition primitive read as one knowledge flow rather than slide replacement
- color script and style continuity read as one authored piece
- selected aesthetic mode honored, not drifted into a different high-end family
- GitHub design intake honored: assets match promises, design-system tokens are visible, direction choice is still the selected one, and five-dimension review scores hierarchy/detail/functionality at 7+ before Lookdev Approval
- VibeMotion candidates follow the approved script and have a Remotion promotion path
- HyperFrames plugin candidates follow the approved scene board, preserve subtitle/proof-safe regions, and have a captured HTML/canvas, transparent asset, video plate, or Remotion promotion path
- ReactBits-derived candidates follow the approved component brief, are rewritten or captured under the declared route, do not rely on unrenderable CSS/hover/cursor/scroll state, and do not turn proof scenes into decorative cards
- AI video candidates follow `tech_stack_layer.primary_stack: "gen_insert"` exactly: they fill only the bounded visual gap, contain no proof/subtitles/readable claims/UI evidence/logos/faces, and remain a muted Remotion `video_plate`
- `render.plugin_adapter_runs[]` records match actual files and do not claim an adapter did planning work that belongs to director-board or visual-compiler
- total-duration alignment is not hiding scene-internal timing drift
- Spark route_status and actual_renderer_family match the asset actually loaded; `.rad` worlds use paged streaming with explicit LOD/foveation budget; Spark plate exposes `window.__XINGCHEN_SPARK_PLATE__` with load state, splat count, route status, runtime profile, canvas health

### Result write-back rules

- gate with `on_fail: block` halts the pipeline with a specific scene pointer + rule id
- every failed gate records `scene_id`, `rule_id`, and one or more exact board paths from `source_layer`, `arrangement_layer`, `brainstorming_layer`, `aesthetic_layer`, `frame_layer`, `detail_layer`, `component_layer`, `subtitle_layer`, or `tech_stack_layer`; transition failures also record the exact `scene_edge_boards[].field` path
- review-only aesthetic rule that cannot be defended yet → `manual_review_required`
- write to `lookdev-gate-result.json` for audit
- write the same result back into state when `project-state.json` exists
- plugin failures should cite the adapter trace and the director-board field it failed to realize, for example `render.plugin_adapter_runs[2].output_paths` plus `scene-03.frame_layer.subtitle_safe_region`
- AI video failures should cite both the candidate and board path, for example `render.ai_video_candidates[0].safety_review.no_readable_claim_text` plus `scene-02.tech_stack_layer.why_this_stack`
- document geometry blockers explicitly when scene composition audit fails
- if a motion slice fails, capture affected `scene_id` values and reroute selectively (no blind full-project rerender)

## References

- [plugin-adapter-policy.md](../../xingchen-next/references/plugin-adapter-policy.md)
- [aesthetic-review-loop.md](./aesthetic-review-loop.md)
- [huashu-design-taste-upgrade.md](../../xingchen-next/references/huashu-design-taste-upgrade.md)
- [github-design-skill-intake.md](../../xingchen-next/references/github-design-skill-intake.md)
- [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md)
- [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md)
- [spoken-knowledge-motion-grammar.md](../../xingchen-next/references/spoken-knowledge-motion-grammar.md)
- [scene-composition-audit.md](./scene-composition-audit.md)
- [lookdev-gate-result-contract.md](./lookdev-gate-result-contract.md)
- [reactbits-remotion-upgrade.md](../../xingchen-visual-compiler/references/reactbits-remotion-upgrade.md)
- [spark-3dgs-world-route.md](../../xingchen-next/references/spark-3dgs-world-route.md) for Spark scene approval rules
- [renderer-families.md](../../xingchen-next/references/renderer-families.md) for `actual_renderer_family` honesty
