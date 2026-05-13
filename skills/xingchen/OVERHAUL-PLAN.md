# Xingchen 天翻地覆改造计划

> 发起人: 用户（2026-04-18）
> 执行人: codex（拿到本文档后直接开工）
> 目标: 让 codex 使用 xingchen 产出的成片质量，达到 claude 在 `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9-v2.mp4` 与 `abstract-30s.mp4` 的水准。
> 反例: `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`（codex v1 产物，被用户判定"效果有点差"）

---

## 零、为什么要改

### 现状诊断

xingchen 当前的 skill 链路（editorial → proof → script-polish → visual-compiler → graph → lookdev → render）**流程契约是完备的**，codex 做 v1 时全部 checkpoint 都过了。但成片仍然差，原因不在流程，在**视觉方向的决断从未作为制品固化**：

- v1 通篇 SaaS keynote 卡片风，`ESTABLISH` / `FOCUS` / `MAX PLAN` 英文浮标当装饰撒
- 证据截图被压成缩略图，`codex-hermes-backup.png` 占画面 < 20%，关键字不可读
- 旁路气泡把口播稿原文复读，观众左耳听右眼读同一句
- 每场都在重新发明视觉语言，九场九种风格，没有全片统一符号系统

### 根因

`xingchen-visual-compiler` 默认了"全片视觉纲领"这个问题上游已经解决。但上游**没有任何一层**负责决定：

1. 全片的**元概念**（形式与内容主题如何绑定）
2. 允许使用的**视觉语汇白名单**（保证全片符号系统一致）
3. 禁止使用的**反模式清单**（把 keynote 默认值挡掉）
4. 可机器校验的**视觉红线**（lookdev 之前就能判死刑）

这四样东西在 claude 那次成功产出里**以 prompt 临时态存在**（"视频本身=一次 skill 运行""禁用 SaaS keynote""证据 ≥70%"），但在 skill 层是空的。codex 拿不到这四样，只能靠训练数据平均值出牌，结果就是 keynote。

### 改造原则

- **把决断变成制品**，不再依赖 agent 的临场发挥
- **强制对抗**，不允许"生成一个方案直接用"
- **机器校验先行**，在人审之前就能挡掉显然翻车的方向
- **符号系统收敛通过依赖关系强制**，不靠下游 agent 的记忆力

---

## 一、改造目标（可验收）

执行本计划完成后，必须同时满足：

1. ✅ 新增 skill `xingchen-art-direction`，位于 `script-polish` 之后、`visual-compiler` 之前
2. ✅ `xingchen` SKILL.md 路由更新，art-direction 成为**强制审批点 2.5**
3. ✅ `xingchen-art-direction` 能产出三份硬制品：`art-direction.md`、`visual-language-kit.json`、`lookdev-gate.yaml`
4. ✅ `xingchen-lookdev` 接入 `lookdev-gate.yaml` 自动校验，fail 直接 block render
5. ✅ `xingchen-visual-compiler` 只能从 `visual-language-kit.json.chrome_components` 白名单选组件
6. ✅ `video-project-graph` 校验器检测到白名单外组件即报错
7. ✅ 用 v1 反例 + v2 正例跑一遍新流程，能明确淘汰 v1 方向
8. ✅ 全链路用 `C:\Users\liuzh\Videos\douyin\0417` 的素材冷启动重跑一次，结果不得再出现 keynote 卡片风

---

## 二、新增 skill: `xingchen-art-direction`

### 2.1 位置

```
C:\Users\liuzh\.codex\skills\xingchen-art-direction\
├── SKILL.md
├── templates\
│   ├── art-direction.template.md
│   ├── visual-language-kit.template.json
│   └── lookdev-gate.template.yaml
└── references\
    ├── meta-concept-examples.md        # 正反例各 6 条
    ├── forbidden-patterns.md           # keynote 病、装饰病、复读病详解
    ├── chrome-kit-library.md           # 4 套预制语汇（skill-run / data-journal / documentary / keynote-modern）
    └── adversarial-flow.md             # 三角色对抗流程 SOP
```

### 2.2 SKILL.md 内容骨架

```markdown
---
name: xingchen-art-direction
description: Use when script-polish is approved and before visual-compiler, to lock the whole-piece visual meta-concept, chrome whitelist, forbidden patterns, and machine-checkable lookdev gates. Mandatory for any project that will render to final video.
---

# Xingchen Art Direction

## Overview

This skill produces the ONE piece of truth that was missing from the family: the visual direction decision. It is the upstream source of truth for all chrome, palette, motion-density, and evidence-visibility rules used by visual-compiler, video-project-graph, and lookdev.

## Required Inputs

- approved `editorial-brief.md`
- approved `scene-board.md`
- approved `spoken-script.md` + `slides.md`
- at least one `anti_reference`: a PNG/MP4 that represents "do NOT make it look like this". If the project has no prior failed attempt, the user must designate a public reference to reject.

## Forbidden Without Anti-Reference

This skill MUST refuse to proceed without `anti_reference`. If missing, ask user to designate one. Do not generate `art-direction.md` from nothing — the whole point is to have a concrete thing to reject.

## Adversarial Flow (mandatory)

Do not generate one art-direction and adopt it. Run the 3-role flow:

1. **Proposer**: generate exactly 3 mutually exclusive `meta_concept` candidates. Each must bind form to content via a different metaphor. No two can share the same chrome family.
2. **Critic**: for each candidate, write (a) the fatal weakness, (b) which forbidden pattern it risks collapsing into, (c) one sentence on why viewer would stop scrolling.
3. **Arbiter**: after re-examining `anti_reference`, pick 1 candidate, explicitly kill the other 2 with a reason each. Arbiter cannot pick "a blend" — must pick one.

Output all three roles' reasoning into `art-direction.md` under `## Decision Trace`. The trace is auditable, not decorative.

## Output Artifacts

### art-direction.md (required fields, reject if any missing)

- `meta_concept`: single sentence binding form to thesis
- `anti_reference`: path to the rejected visual, with 3+ specific critiques
- `forbidden_list`: ≥ 5 patterns, each with example + reason
- `allowed_chrome`: ≥ 5 visual elements, all from same symbolic family
- `evidence_rule`: numeric constraints on proof-heavy scene coverage and minimum legible font size at target resolution
- `motion_rhythm`: per-second motion event floor, max static-frame-run
- `palette_lock`: exact hex values, no "modern gradient" placeholders
- `typography_lock`: font family + weight + tracking per role
- `decision_trace`: full 3-role adversarial reasoning

### visual-language-kit.json (required, machine-consumed)

Enumerate every chrome component allowed downstream. visual-compiler and video-project-graph MUST import from this kit only.

### lookdev-gate.yaml (required, machine-checked)

Numeric/pattern rules that lookdev runs before approving a render. Failed gates block the render.

## Approval Checkpoint

This becomes Xingchen approval point **2.5** (between script approval and visual packaging). User must sign `art-direction.md` before visual-compiler runs.

## Hard Rules

- no meta_concept that describes style without referencing content thesis ("现代科技感" alone is invalid; "每一帧都是 skill 正在运行的证据" is valid)
- no `allowed_chrome` mixing two symbolic families (terminal + SaaS dashboard in same piece = reject)
- no `forbidden_list` shorter than 5 items
- no `anti_reference` = no output
- no skipping the adversarial flow even under autopilot
```

### 2.3 templates/art-direction.template.md

必须包含以下 11 个 section，每个 section 给 claude 的 v2 做例子、给 codex 的 v1 做反例：

```
1. meta_concept
2. anti_reference (with ≥3 specific critiques)
3. forbidden_list (≥5)
4. allowed_chrome (≥5, one symbolic family)
5. evidence_rule (numeric)
6. motion_rhythm (numeric)
7. palette_lock (exact hex)
8. typography_lock
9. decision_trace (proposer × 3 / critic × 3 / arbiter verdict)
10. downstream_binding (points to visual-language-kit.json and lookdev-gate.yaml)
11. user_signature_line
```

### 2.4 references/meta-concept-examples.md

正例必须有 6 条，每条格式：

```
### {name}
- thesis: {editorial thesis}
- meta_concept: {form↔content binding sentence}
- chrome_family: {terminal / data-journal / documentary / kinetic-type / ...}
- motion_signature: {3-4 verbs}
- anti_reference: {what this concept explicitly rejects}
```

6 条正例建议：

1. **skill-run**（0417 项目 v2 采纳）: 视频本身=一次 skill 运行 / terminal + command + diff
2. **data-journal**: 论点即数据变形 / chart morph + counter + annotation
3. **documentary-contact**: 证据即剪辑 / scan-pan + redacted-doc + timecode
4. **kinetic-type**: 口播即排版 / big-type + rhythm cut + color flash
5. **studio-process**: 做视频的过程就是视频 / timeline + layer-panel + preview-frame
6. **field-log**: 第一人称记录 / handheld frame + timestamp overlay + location tag

反例必须有 4 条：

1. **saas-keynote**（v1 栽过的坑）
2. **generic-gradient-particles**
3. **meme-overload**
4. **narration-echo-bubble**

### 2.5 references/forbidden-patterns.md

每个反模式格式：

```
### pattern: {name}
- looks like: {描述}
- why it fails: {why it breaks the form-content bond}
- detection: {visual-compiler / lookdev 如何识别}
- example path: {如果项目里有反例截图就指过去}
- allowed swap: {推荐替代方案}
```

初始清单（≥ 10 条，覆盖 v1 所有病症）：

1. english-status-chip（`ESTABLISH` `FOCUS` `MAX PLAN` 英文浮标）
2. pseudo-dashboard-card（伪 dashboard 分区框）
3. narration-echo-bubble（口播复读气泡）
4. thumbnail-evidence（证据被压成 <50% 缩略图）
5. gradient-blob-decor（装饰光斑、扫光粒子）
6. mixed-chrome-families（终端+SaaS+documentary 混用）
7. static-over-1.5s（任何 > 45 帧的静止镜头）
8. centered-bullet-list（项目符号居中列表）
9. apple-keynote-sans（无衬线 + 大字号 + 中央构图三连）
10. fake-cli-without-skill-binding（假终端但和内容无关，纯装饰）

### 2.6 references/precedent-gallery.md（**不是 kit 菜单**）

这是**参考画廊**，不是可选项列表。严格定位：给 proposer 激发想象用，**严禁**被当作"从里面挑一个"的菜单。

每个条目格式：

```
### {codename}
- 一次性用过的项目: {which shipped project}
- meta_concept: {一句话}
- 视觉世界: {术语 / 图形家族 / 色感 / 声形关系}
- 为什么当时成立: {内容论点如何和形式绑上的}
- 为什么别的项目搬不走: {至少一条依赖条件}
```

初始建议 6-8 条（包括 v2 的 skill-run 作为**已用过**的案例），**必须包含"为什么别的项目搬不走"**，否则就是在造菜单。

**铁律**（写进 SKILL.md）：

- proposer 可以读 precedent-gallery 找灵感，**不得**把任何一个 precedent 直接作为 3 个候选之一
- 3 个候选的 `chrome_family`、`motion_signature`、`anti_reference 攻击角度`必须两两不同
- 如果某个候选和 gallery 里任何一条的 `视觉世界`字段相似度 > 60%（例如都是"终端+命令行+diff"），必须被 critic 以"抄袭 precedent / 无针对本内容的创造"为由击毙
- visual-language-kit.json 必须**为本项目原创**——它是 art-direction 决策的**输出**，不是从库里 import 的**输入**

### 2.7 references/creative-ignition.md（**新增，对抗流程前置**）

在 proposer 生成 3 个候选之前，必须先跑一遍**创意点火**，目的是把"这个内容值得被怎么看见"这件事挖深，再谈形式。

四步点火，每步写进 art-direction.md 的 `## Ignition` 段：

1. **内容的本质动词**：这条视频在做什么动作？（不是"讲什么"，是"动作"）
   - 反例: "讲 AI 改变创作"
   - 正例: "把一个 skill 运行过程当作证据展示给你看"

2. **符号世界候选（至少 5 个，必须跨域）**：如果把这条视频放进某个"世界"里它会毫不违和，列 5 个候选世界：
   - 可能是：终端 / 实验室 / 考古现场 / 新闻直播室 / 便利店监控 / 老式剪辑台 / 舞台后台 / 医学影像 / 游戏引擎 debug 视图 / ……
   - 铁律：5 个候选**必须至少有 3 个完全不同的领域**，否则点火失败重来

3. **反直觉锚点**：主题最**容易**被做成什么样？把那个"容易"明确写出来，作为 anti_reference 的辅助定义
   - 例："讲 AI 创作很容易做成硅谷发布会卡片风"——于是 saas-keynote 就必须在 forbidden_list 里

4. **观众在第 2 秒的反应猜测**：如果用某个符号世界，观众第 2 秒会想什么？
   - 例（终端世界）: "诶这视频是 AI 生成的吗？证据就在屏幕上啊"
   - 例（考古现场世界）: "这是在挖什么？"
   - 这个反应必须和 editorial-brief 里的"观众必须相信"对得上，否则这个符号世界不适合本项目

点火产出的 5 个符号世界，proposer **从中挑 3 个**做互斥方案，每个方案把那个符号世界发展成完整 chrome 体系。

**严禁**跳过点火直接进 proposer。跳过了 = 没有真正思考这个内容，就会默认 keynote。

### 2.8 references/adversarial-flow.md

### 2.8 references/adversarial-flow.md

三角色对抗流程的详细 SOP，前置依赖 `creative-ignition.md` 已跑完。包括：

- 每个角色的 prompt 模板
- 提案者接收 ignition 产出的 5 个符号世界，挑 3 个互斥的发展为完整方案
- 每个方案必须原创 chrome 体系（不是从 precedent-gallery 抄）
- 批判者必须指出**致命**弱点（不是"可以更好"，是"这会翻车"）；且必须检查 3 个方案中是否有抄袭 precedent-gallery（相似度 > 60%）的
- 裁决者必须**淘汰**另外两个，写淘汰理由（不是"选了一个"，是"杀了两个剩一个"）
- 全程对话 trace 写进 `art-direction.md` 的 `decision_trace` 段，可审计

---

## 三、修改既有 skill

### 3.1 修改 `xingchen/SKILL.md`

**Family Layers** 段新增一行：

```
- `xingchen-art-direction`: whole-piece visual meta-concept and chrome whitelist (mandatory before visual-compiler)
```

**Default Path** 每条路径插入 `art-direction`：

```
... -> xingchen-script-polish -> xingchen-art-direction -> xingchen-visual-compiler
```

**Approval Checkpoints** 段新增 checkpoint 2.5：

```
2.5. Approve `art-direction.md`, `visual-language-kit.json`, `lookdev-gate.yaml` before any visual packaging begins
```

**Autopilot Mode** 段新增规则：

```
- in autopilot, art-direction runs automatically BUT the 3-role adversarial flow is still mandatory and its output is still a hard approval point
- autopilot is not permission to skip visual decision-making; it is permission to automate everything around it
```

**Rules** 段新增：

```
- do not skip xingchen-art-direction under any mode
- do not let visual-compiler import components outside visual-language-kit.json.chrome_components
- do not let lookdev approve a render before lookdev-gate.yaml passes
- do not generate art-direction without a concrete anti_reference
- do not let a meta_concept describe style without binding to content thesis
```

### 3.2 修改 `xingchen-visual-compiler/SKILL.md`

新增 Required Inputs:

```
- approved art-direction.md
- visual-language-kit.json (本项目原创产出，不是库引用)
```

**关键定位**：visual-language-kit.json 是**活文档**，不是只读输入。visual-compiler 在场景级 packaging 过程中，如果发现需要一个 art-direction 当初没列进 kit 的新元素（新组件、新 motion verb、新色点），流程是：

1. 不要擅自添加组件使用；
2. 写一条 `kit-extension-request`（组件名、用途、所属 chrome_family、为什么不能用现有组件替代）；
3. 回到 art-direction 层复核：是否和 meta_concept 一致？是否不破坏符号系统单一性？是否需要同步加 forbidden_list？
4. 复核通过后 art-direction 更新 kit，visual-compiler 才能使用；复核不通过则改方案。

这一步**不是**官僚主义，是**保护符号系统统一性**的唯一机制。宁可来回几次也不能让下游 agent 单方面扩展 chrome。

新增 Hard Rules:

```
- every scene's chrome component choice must map to an entry in visual-language-kit.json.chrome_components
- needing something outside the kit is NORMAL; raise kit-extension-request instead of inventing silently
- per-scene palette must be a subset of art-direction.md palette_lock
- forbidden patterns from art-direction must be checked against every scene's packaging before handoff
- chrome_family must remain singular across all scenes (no mixing terminal + dashboard + documentary)
```

### 3.3 修改 `video-project-graph/SKILL.md`

新增 validation rule:

```
- every scene.components[*].type must match visual-language-kit.json.chrome_components[*].name
- validation fails → block handoff to lookdev
```

### 3.4 修改 `xingchen-lookdev/SKILL.md`

新增 Required Inputs:

```
- lookdev-gate.yaml
```

新增 Hard Rules:

```
- before running preview render, evaluate lookdev-gate.yaml against the candidate video-project.json + motion-blueprint.json + render-plan.json
- any gate with on_fail: block that fails must halt the pipeline with a specific pointer to the failing scene and rule
- gate results are written to lookdev-gate-result.json for audit
```

新增 checklist item:

```
- [ ] lookdev-gate.yaml evaluation: PASS (all blocking gates green)
```

---

## 四、执行顺序（codex 照此顺序动手）

### Step 1: 阅读失败样本
- 打开 `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4` 看完整 90 秒
- 截至少 6 帧放进 `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\`
- 对照 `lookdev-brief-v2.md` 第 46-52 行的"禁令"清单，确认 v1 每一条都中枪
- 把对照表写进 `references/forbidden-patterns.md` 的 example 字段

### Step 2: 阅读成功样本
- 打开 `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9-v2.mp4` 看完整 93 秒
- 打开 `C:\Users\liuzh\Videos\douyin\0417\remotion\src\DouyinSkillTheme\` 通读所有 .tsx
- 提取 v2 实际使用的 chrome 组件清单，作为 `skill-run` kit 的权威实现

### Step 3: 创建新 skill 目录
- `mkdir C:\Users\liuzh\.codex\skills\xingchen-art-direction\{templates,references}`
- 按第二章骨架写 SKILL.md（先写骨架，不求一次完美）

### Step 4: 写模板和 references
- `templates/art-direction.template.md` 用 v2 项目做填空示范
- `templates/visual-language-kit.template.json` 直接列出 DouyinSkillTheme/chrome/ 下的真实组件
- `templates/lookdev-gate.template.yaml` 写 5-8 条机器可校验规则
- `references/meta-concept-examples.md` 6 正 4 反
- `references/forbidden-patterns.md` 10 条起
- `references/precedent-gallery.md` 6-8 条**已用过的**案例，每条必须写"为什么别的项目搬不走"，不得写成可选菜单
- `references/creative-ignition.md` 四步点火 SOP + 跨域符号世界示例清单（≥ 20 个世界跨 ≥ 8 个领域）
- `references/adversarial-flow.md` 写完整 prompt 模板，前置 ignition 依赖要明确

### Step 5: 修改既有 skill
按第三章 3.1 - 3.4 逐个改 SKILL.md。每改一个立刻 git diff 自检。

### Step 6: 冷启动验证
- 新开一个 shell，当作 codex 第一次见这个项目
- 用 `C:\Users\liuzh\Videos\douyin\0417\conten.txt` 从零跑一遍完整 xingchen 链路
- 在 art-direction 阶段，必须触发 3 角色对抗，必须拒绝 `saas-keynote` 方向
- 产出的 `art-direction.md` 和 claude 当初做的 `lookdev-brief-v2.md` 做对比
- 产出的 preview 不得再出现 v1 的 10 条禁令中的任何一条

### Step 7: 归档
- 在 `C:\Users\liuzh\Videos\douyin\0417\ARCHIVE.md` 记录：
  - v1 discarded + 具体原因映射到 forbidden-patterns
  - v2 adopted + 具体对应到 skill-run kit
  - AbstractFlex 作为附赠 demo 记录
  - 本次改造的 before/after
- 在本文档底部加 "Completion Log" 段，记录完成时间、实际触发的淘汰方向、冷启动验证结果

---

## 五、验收测试

codex 完工后，必须通过以下测试才算完成：

### 测试 A: 空项目触发对抗
- 新建一个空项目目录，只放一个 `editorial-brief.md`
- 跑 `xingchen-art-direction`
- **期望**：skill 拒绝继续，要求 `anti_reference`
- **实际**：应该报错而不是默默生成

### 测试 B: 提供 anti_reference 后触发 3 角色
- 补上 `anti_reference` 指向 v1 mp4
- **期望**：输出 `art-direction.md` 的 `decision_trace` 段有 3 个 proposer 方案、3 份 critic、1 份 arbiter verdict，且杀了 2 个留 1 个

### 测试 C: 下游拒绝白名单外组件
- 手改 `video-project.json`，加一个 `GradientBlob` 组件
- 跑 `video-project-graph` 校验
- **期望**：校验失败，错误指向 visual-language-kit.json 中找不到 GradientBlob

### 测试 D: lookdev-gate 阻断渲染
- 手改一个场景让证据图占比 < 60%
- 跑 `xingchen-lookdev`
- **期望**：gate evaluation 失败，render 被 block，错误指向具体场景和 `evidence_coverage` 规则

### 测试 E: 端到端冷启动
- 从 0417 项目的 `conten.txt` 重新跑完整个链路
- **期望**：产出的成片在"禁令清单"10 条上全部合规；证据图占比 ≥ 70%；每场 ≥ 3 类动效；没有口播复读气泡；chrome 组件全部来自本项目原创的 visual-language-kit.json
- **加码期望**：由于本项目 precedent-gallery 里已经有 skill-run 案例，codex 必须在 critic 环节**击毙** skill-run 相似方向（抄袭 precedent），arbiter 最终采纳一个**与 v2 不同**的 meta_concept。如果冷启动又做出了一个 terminal+diff 方案，说明 ignition 和 adversarial 都没真正运行，改造失败
- 预期可能产出方向举例：考古现场 / debug 视图 / 老式剪辑台 / 便利店监控 / 实验笔记 / ……（任何一个与 skill-run 符号世界不同的都 OK，关键是**真的在本内容上成立**）

---

## 六、不要做的事

- ❌ 不要改 `remotion-render-adapter`，渲染层不是问题来源
- ❌ 不要改 `xingchen-editorial-room`，文本层也没问题
- ❌ 不要把 AbstractFlex 那个 demo 混进来，它是另一条独立业务
- ❌ 不要把 precedent-gallery 写成"可选 kit 菜单"——它是参考画廊，每条必须带"为什么别的项目搬不走"的限定
- ❌ 不要让 proposer 跳过 creative-ignition 直接提方案（跳过 = 默认 keynote，改造就失败了）
- ❌ 不要让 3 个候选方案出现"chrome_family 相同、只是配色不同"的情况——这是伪互斥
- ❌ 不要把 visual-language-kit.json 当成只读输入；它是 art-direction 的**产出**，可以通过 kit-extension-request 迭代
- ❌ 不要在本次改造里动 jianying-draft-builder
- ❌ 不要跳过测试 B 的冷启动，skill 没跑过的流程等于没写

---

## 七、时间估计

- Step 1-2: 1 小时（看片 + 读码）
- Step 3-4: 3 小时（写 skill 主体和模板）
- Step 5: 1 小时（改既有 skill）
- Step 6: 2 小时（冷启动验证 + 迭代）
- Step 7: 30 分钟（归档）

预计总时长 7-8 小时。如果 Step 6 冷启动不通过，回到 Step 4 迭代模板，不要放水。

---

## 八、签收

- [ ] codex 开工时在本段填写开始时间
- [ ] codex 完工时追加 Completion Log 段，列出 7 步每步的实际产出路径
- [ ] 用户验收后在 `ARCHIVE.md` 里确认

---

## Completion Log

（codex 完工后在此填写）

- 完成时间:
- 实际新增文件:
- 实际修改文件:
- 冷启动测试触发淘汰的 2 个方向:
- 最终采纳的 meta_concept:
- 对比 claude v2 的差异（如有）:
- 已知遗留:
