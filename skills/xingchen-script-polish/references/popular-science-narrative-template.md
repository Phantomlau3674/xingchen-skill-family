# Popular Science Narrative Template

针对 `audience.tier ∈ {lay_scrolling, lay_curious}` 的 AI 科普视频默认叙事框架。

这套结构来自对回形针 PaperClip / Kurzgesagt / Vox Explained / 3Blue1Brown / 影视飓风等参考创作者的逐集逐帧拆解，**不是通用文案模板**——它是为"把抽象概念讲给普通人 + 让普通人愿意看完"专门设计的节奏曲线。

`xingchen-script-polish` 和 `xingchen-editorial-room` 在为 lay 受众做 AI 科普时，**默认套用本模板**生成 StoryMother + script。

---

## 标准 6 段结构（90-180 秒视频）

```
[抛问] → [具象化] → [实物展示] → [数据/反常识] → [回归生活] → [收尾 CTA]
  5-10s    15-30s     30-60s        15-30s         15-30s        5-10s
```

### 1. 抛问（Hook，5-10 秒）

**目的**：用反常识 / 反差 / 具体问题在 0.3 秒内钩住观众。

**模板**：

- ❌ "今天我们聊聊 AI Agent"
- ❌ "AI Agent 是什么？让我来解释"
- ✅ "**你以为 AI 答错是因为它笨——其实是因为它现场没翻书**"
- ✅ "**你 ChatGPT 用了一年，可能根本不知道它是在'胡说八道'还是在'真的查'**"
- ✅ "**1 个 token = 多少个汉字？答案比你想的少 30%**"

**`knowledge_action`**：`hook`
**默认 hook_pattern**（按 [douyin-hook-science.md](../../xingchen-next/references/douyin-hook-science.md)）：

- Data Bomb（一个意外数字）
- Conflict Frame（你以为 X 其实 Y）
- Evidence Interrupt（一张真实截图当冲击）

**默认 `asset_kind`**：

- `imagegen_2d`（套路 1 拟人化 / 套路 4 比例缩放 的 hook 版）
- 或 `screen_recording_annotated`（真实证据截图）

**默认 `energy_level`**：8-9（拉到接近全片峰值）

---

### 2. 具象化（Context，15-30 秒）

**目的**：把抽象概念**翻译成可见物件/场景**——这是回形针的招牌套路。

**模板**：

- 接 hook 的反差，给一个**具体的物理类比**作为整支视频的"母图"
- 这个母图后面会反复出现，作为认知锚点

**例**：

- Hook："AI 答错是因为它现场没翻书"
- 具象化："**AI 工作时其实有两种模式——一种是凭记忆答（容易胡说），一种是现场翻书答（基于事实）。我们叫后者 RAG。**" 配画面：一个穿衬衫的卡通人坐在书桌前，左边是凭空想（脑袋上空气泡 ?），右边是真的翻一本厚书。

**`knowledge_action`**：`define` 或 `decompose`

**默认 `asset_kind`**：

- `imagegen_2d`（套路 1 拟人化 / 套路 2 拟物化 / 套路 3 横截面 中选一个）
- 或 `chibi_layered`（如果用品牌虚拟形象）

**关键**：这一段产出的视觉锚点（"翻书的人 / 工厂流水线 / 调音台"）会在后面的 proof 段和回归生活段**重复出现**——这是观众记得住这支视频的根本原因。如果整支视频每段都换新比喻，观众什么都记不住。

**默认 `energy_level`**：6-7

---

### 3. 实物展示（Proof，30-60 秒）

**目的**：用真实物件 / 截图 / 录屏 / 数据展示**具体例子**——这是 hero frame 出现的段。

**模板**：

- 给至少 2-3 个具体实例
- 至少 1 个是"用户能直接 G 然后试" 的演示（屏幕录制）
- 至少 1 个是"用户能感觉到差别" 的对比（side-by-side）
- **hero frame 必须落在这段**——按 `INV-HERO-FRAME-REQUIRED`

**例**：

- 实例 1：演示 ChatGPT 不联网时答错某个时效问题（屏幕录制）
- 实例 2：演示 ChatGPT 联网+RAG 时答对（屏幕录制对比）
- 实例 3：把 RAG 流程画成"接到问题 → 检索 → 取证 → 回答"4 步图（流程化）

**`knowledge_action`**：`prove` / `compare` / `decompose`

**默认 `asset_kind`**：

- `screen_recording_annotated`（套路 10，主力）
- `imagegen_2d`（套路 3 横截面 / 套路 6 对照实验 辅助）
- `remotion_dataviz`（套路 9 数据可视化 数据点）

**关键**：这一段是**画面密度最高**的段——观众判断"这支视频有没有干货"就看这段。AI 不能糊弄，必须真的拿出截图 / 数据 / 流程图。

**默认 `energy_level`**：7-8

---

### 4. 数据 / 反常识（Peak，15-30 秒）

**目的**：抛出一个让观众"卧槽"的数据 / 比例 / 对比——情绪最高点。

**模板**：

- 必须是**让人意外**的数据
- 必须用**可感知的比例**（不是干巴巴的数字）
- 必须有**视觉冲击的画面**承载

**例**：

- "**GPT-4 训练用了 25000 张 A100，相当于 350 个普通办公室一年的电费**" 配画面：一张 A100 GPU + 旁边 350 个堆满电费账单的办公桌
- "**1 个 token 大约是 0.75 个汉字——但中文有 5 万个汉字**" 配画面：1 个 token 表示一颗米 vs 5 万颗米
- "**ChatGPT 一次对话最多记住 200K 个 token——大约 400 页 A4 纸**" 配画面：400 页 A4 纸堆起来的高度

**`knowledge_action`**：`prove` / `expand` / `compare`

**默认 `asset_kind`**（注意：`asset_kind` 枚举值，**不要**写画面语言名作为 asset_kind）：

- `imagegen_2d` —— 套路 4 比例缩放主图（对应画面语言 10 `scale_stack_visualization`）
- `remotion_dataviz` —— 套路 9 数据可视化（对应画面语言 3 `manim_math_animation` 或 4 `vox_style_infographic`）
- `mixed_compose` —— imagegen 出对照图 + Remotion 程序化叠加计数器（套路 4 的视觉锚点 + 同步增长数字）

**默认 `energy_level`**：9-10（全片峰值）

**关键**：这一段如果做不出"卧槽感"，整支视频就没有传播点——观众不会截图、不会评论、不会转发。**这段是视频在抖音流量分发里能不能爆的关键**。

---

### 5. 回归生活（Payoff，15-30 秒）

**目的**：把抽象概念**拉回观众日常**——"所以这跟我有什么关系？"

**模板**：

- 给观众**可立即行动**的建议
- 用 hook 段抛出的具象图重复出现（让认知锚点闭环）
- **不**要再讲新概念

**例**：

- "**所以下次用 ChatGPT，如果问的是 2024 年以后的事——记得先让它'翻书'再答（开启联网/RAG/Bing 搜索）**" 配画面：套路 1 拟人化的"翻书人"再次出现，但这次手里多了一个"现在"日历。

**`knowledge_action`**：`summarize` 或 `bridge`

**默认 `asset_kind`**：

- 重用 Context 段的 `concrete_execution_plan.analogy_carrier_visual`（同一个翻书人 / 工厂 / 调音台再次出现）
- 配新的"行动建议"覆盖文本

**默认 `energy_level`**：6-7（从 peak 降下来，结束情绪)

**关键**：这一段决定**观众有没有获得感**——如果只是看了热闹但学不到怎么用，他们不会关注/收藏。

---

### 6. 收尾 CTA（Close，5-10 秒）

**目的**：评论区互动 + 关注引导。

**模板**：

- 给一个**具体可回答**的评论引导（不是"你怎么看"——是"你最常问 AI 的是哪一类问题：[A] 信息查询 [B] 写作 [C] 编码"）
- 关注/收藏话术不要太长
- **不**要在这里讲新内容

**`knowledge_action`**：`hook`（开启下一支的钩子）

**默认 `asset_kind`**：

- `chibi_layered`（品牌虚拟形象出场互动）
- 或 `imagegen_2d`（套路 1 拟人化 的"举手提问" 收尾画面）

**默认 `energy_level`**：5-6（缓和但保留余温）

---

## 完整 Example: "什么是 AI Agent" 视频 6 段拆解

| 段 | 时长 | 内容 | knowledge_action | asset_kind | analogy_carrier_visual |
|---|---|---|---|---|---|
| **1. 抛问** | 7s | "你 ChatGPT 用了一年，知道它和 AI Agent 差别在哪吗？一个能干 1 件事，一个能自己干 10 件事——但只有 5% 的人见过真的 Agent 工作" | hook (Data Bomb) | imagegen_2d | 拟人化：一个穿衬衫的人 vs 一个穿西装跑腿的人对比 |
| **2. 具象化** | 25s | "Agent 不是 ChatGPT。**ChatGPT 是个会答问题的同事，Agent 是个能自己干活的实习生**。你给它一个目标，它自己拆解、自己找工具、自己干完、自己汇报。" | define | imagegen_2d（套路 1 拟人化） | 实习生 + 待办清单 |
| **3. 实物展示** | 50s | 屏幕录制：演示一个真实 Agent（如 Claude Code / Cursor）接到任务后的实际工作流（接任务 → 拆解 → 调工具 → 汇报）。3 个真实案例。 | prove | screen_recording_annotated | 录屏 + 高亮 + 流程图叠加 |
| **4. 数据/反常识** | 20s | "**目前最强 Agent 一次能调 100+ 个工具自动完成任务——但 95% 的普通用户连 1 个工具都没让它调过**" | prove | mixed_compose（imagegen_2d 出对照图 + remotion_dataviz 程序化叠加计数器，对应画面语言 10 `scale_stack_visualization`） | 100 个工具图标 vs 1 个 |
| **5. 回归生活** | 25s | "**所以你下次别只让 AI 答问题——给它一个目标，让它自己找路。这就是 Agent 思维**" | bridge | imagegen_2d（重用 #2 的实习生形象）| 实习生 + 待办清单（这次清单被一项一项划掉） |
| **6. 收尾 CTA** | 8s | "评论区告诉我，你最想让 Agent 帮你干的一件事是什么？最常见的我下期细讲" | hook | chibi_layered（猫导演举手） | 猫导演 |

**总时长**：~135 秒，符合抖音 lay 受众的最佳长度区间（90-180s）

**画面语言混合**（满足 `INV-VISUAL-VOCABULARY-DIVERSITY`）：

- imagegen_2d（拟人化/比例缩放）：4 段
- screen_recording_annotated：1 段
- chibi_layered：1 段

**视觉锚点（analogy_carrier_visual）**：实习生 + 待办清单——在段 2、5 重复出现。

**Energy curve**：8 → 6 → 7 → 9 → 6 → 5（满足 `INV-ENERGY-CURVE-REQUIRED` 的 assault→build→payoff 形状）

**Hero frame**：段 4 的 "100 个工具 vs 1 个" 比例对照图（满足 `INV-HERO-FRAME-REQUIRED`）

---

## 反模式（AI 不要做的）

1. **6 段全在讲概念**——没有 proof 段就是 PPT 大纲。必须有 30-60s 是真实截图 / 录屏 / 数据。
2. **每段换新比喻**——观众记不住。整支视频应该有 1 个核心 `analogy_carrier_visual` 在 2/5 段重复出现。
3. **数据段没有视觉锚定**——"GPT-4 有 1.7 万亿参数" 配 PPT 字幕 = 无效。必须配比例堆积可视化（画面语言 10 `scale_stack_visualization`，asset_kind 走 `imagegen_2d` 或 `mixed_compose`）。
4. **回归生活段又开始讲新概念**——观众已经累了，这段只能总结和闭环。
5. **CTA 太抽象**——"欢迎评论"无效。必须是具体可选问题（"评论区告诉我你最常问 AI 的是 A / B / C"）。

---

## xingchen-script-polish 和 xingchen-editorial-room 怎么用本模板

### 在 editorial-room（StoryMother 构建阶段）

1. 当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，**默认套用本 6 段结构**生成 `mother.story_mother.scene_order[]`
2. 每段对应一个 scene（可拆成多个子 scene 但保持段功能）
3. 每段写入 `scene_cards[]` 时填好 `job`（hook/context/proof/build/peak/payoff/close）和默认 `knowledge_action`
4. 全片 energy curve 默认按本模板的曲线（8→6→7→9→6→5）

### 在 script-polish（脚本打磨阶段）

1. 按段写口播文案，**段过渡时用 hook 段抛出的反差 / 类比作为认知钩子**反复闭环
2. 检查每段时长是否符合默认区间（hook 5-10s / context 15-30s / proof 30-60s / peak 15-30s / payoff 15-30s / close 5-10s）
3. 把段 2 写出的 `analogy_carrier_visual` 锁定，**保证段 5 重复出现同一形象**（不要换比喻）

### 在 director-board（视觉规划阶段）

1. 段 1 / 段 4 必须有 hero frame 候选
2. 段 2 的 `concrete_execution_plan.analogy_carrier_visual` 在段 5 重用——visual-compiler 共享同一素材资产
3. 段 3 的 `asset_kind` 优先选 `screen_recording_annotated`（实物证据），其次选 `imagegen_2d`（套路 3 / 6 / 9）
4. 段 4 的 `asset_kind` 默认 `scale_stack_visualization` 或 `remotion_dataviz`
5. 段 6 的 `asset_kind` 默认 `chibi_layered`（虚拟形象出场互动）或 `imagegen_2d` 套路 1
