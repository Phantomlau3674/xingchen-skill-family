# Concrete Analogy Playbook

把抽象概念翻译成可生成素材的 10 种套路。每种套路告诉 AI：

- 这种套路**适合什么 knowledge_action**
- 配哪种 `asset_kind`（imagegen / Hunyuan3D / Remotion / 录屏 / 信息图）
- 直接可用的 `generation_prompt` 模板
- `remotion_layout_plan` 镜头建议

`xingchen-director-board` 在 Procedure 2.5 写 `analogy_pass.concrete_execution_plan` 时**从这里抄套路 + prompt 模板，不要凭空想**。

---

## 全局 imagegen prompt 规则（每个套路都适用）

**强制 negative prompt**：所有以 `imagegen_2d` / `mixed_compose` / `stock_photo_annotated` 为 asset_kind 的 generation_prompt **必须**包含以下 negative prompt 段（INV-IMAGEGEN-NO-CHINESE-TEXT）：

```
no Chinese text in image, no Chinese characters, no text inside the artwork,
leave clean space at top/bottom for overlay caption
```

**为什么**：image-gen 模型出中文几乎必糊 + 必错字。中文叠字必须由 Remotion 程序绘制（NotoSansSC / DengXian 真实字体）。下面所有套路模板里的 `generation_prompt` 都隐含这条要求——AI 写完 prompt 后必须 append 这段。

**职责分工**：本 playbook 的所有 prompt 模板都只描述**物件主体 / 场景 / 质感 / 光影 / 构图**——不要在 imagegen 输出里要求"标签 / 标题 / 状态文字 / 章节名"。那些都是 Remotion 程序叠字层的事。详见 [`imagegen-vs-remotion-division.md`](../../xingchen-visual-compiler/references/imagegen-vs-remotion-division.md)。

---

## 套路 1：拟人化（Personification）

**适合 knowledge_action**：`define`、`decompose`、`bridge`

把抽象系统/工具拟人化成一个有职业身份的角色。普通人对"人物"有共情本能。

**例**：

- AI Agent → "一个穿西装的跑腿实习生"
- RAG 检索 → "现场翻书做答的助理"
- Prompt → "给员工写的工作清单"
- Token → "用秒表计时的会议费"
- LLM 参数 → "脑子里塞满书的图书管理员"

**推荐 asset_kind**：`imagegen_2d`

**`generation_prompt` 模板**：

```
手绘黑白线稿风格，正面 3/4 视角，一个【职业 + 穿着】卡通人物【正在做什么具体动作】，背景是【具体环境】，手中或身边有【具体物件 1】、【具体物件 2】，配色克制（仅黑白灰 + 1 个点缀色），回形针 PaperClip 信息图质感，no dashboard UI, no terminal log, no glowing tech aesthetic, no AI generated face artifacts。
```

**`generation_negative_prompt`**：

```
photorealistic face, plastic 3d render, dashboard ui, terminal text, code block, dark sci-fi glow, fantasy lighting
```

**`remotion_layout_plan` 模板**：

```
imagegen 出图后置于 Remotion <Img> 居中略偏左，初始 scale 1.0，2.5s 内 scale 缓推至 1.3 锁定到人物上半身 / 手部动作。配字幕底部安全区，字幕只承担"是谁/在做什么"的最少信息。镜头慢推 = 强化"我们在看一个具体的人"。
```

**Hunyuan3D 升级**：如果该角色会反复出现（品牌 IP 级），可以走 `hunyuan3d_mesh` 出一个 3D 模型，多视角切换。

**不适合**：proof 重的场景（讲具体数据 / 具体截图）——拟人化会喧宾夺主。

---

## 套路 2：拟物化（Reification）

**适合 knowledge_action**：`define`、`decompose`、`compare`

把抽象数据/流程当成真实物件。

**例**：

- 数据流 → 工厂流水线 / 仓库传送带
- 上下文窗口 → 桌面摊开的纸张
- 缓存 → 抽屉柜分区
- API 调用 → 一根电话线
- 数据库 → 一个档案柜

**推荐 asset_kind**：`imagegen_2d` 或 `hunyuan3d_mesh`

**`generation_prompt` 模板（2D 版）**：

```
手绘线稿风格，俯视/侧视角，一个【具体物件 + 场景】，物件上有【标注：标签 1、标签 2、标签 3】（标签用中文/英文写实物名而非术语），物件正在【发生什么动作：传送/翻动/打开】，背景留白，回形针 PaperClip 剖面图风，no glowing effects, no neon, no dashboard, no AI ui。
```

**`generation_prompt` 模板（3D 道具版）**：

```
喂给 Hunyuan3D-2mv：character sheet 4 视角的【物件】，简洁几何造型，无品牌 logo，标签贴纸位置预留在【正面/顶面】。生成 .glb 后用 R3F 加载，正面缓慢旋转 15° 展示。
```

**`remotion_layout_plan` 模板**：

```
imagegen 出剖面图 → Remotion <Img> 90% 屏占，初始静态展示 1s，然后镜头沿物件长轴推进 / pan over 高亮各个标签区域（用 Remotion overlay 圆圈高亮，跟着 voiceover 节奏）。
```

**不适合**：人物心理类话题（用拟人化更好）。

---

## 套路 3：横截面（Cross-section）

**适合 knowledge_action**：`decompose`、`prove`、`expand`

把封闭系统"剖开"，露出内部结构。这是回形针 PaperClip 的招牌套路。

**例**：

- 神经网络 → 多层透视立方体，每层有不同颜色和功能标签
- LLM 推理过程 → 大模型剖面图，token 流穿过各层
- 数据库 → 仓库切开，看到货架分层
- AI 应用栈 → 建筑剖面图，前端/后端/模型/数据

**推荐 asset_kind**：`imagegen_2d` 或 `infographic_svg`

**`generation_prompt` 模板**：

```
等距/正面剖面视图，手绘黑白技术插画风，一个【系统/容器】被切开露出 N 层内部结构，每层用浅色填充（不要饱和色），每层有清晰标签写【层名 1】、【层名 2】、【层名 3】，层与层之间有【数据流向箭头/连接线/光路】，整体回形针 PaperClip 剖面图风，no glowing tech, no holographic effect, no dashboard chrome.
```

**`remotion_layout_plan` 模板**：

```
剖面图全屏展示，镜头初始全景看整体（2s），然后 Remotion 镜头依次推进到每一层（推进 + 高亮该层标签 + 字幕命名该层，每层 2-3s）。镜头路径 = 论证路径。这种镜头本身就是叙事。
```

**不适合**：感性话题、人物故事。

---

## 套路 4：比例缩放（Scale Comparison）

**适合 knowledge_action**：`prove`、`expand`

把不可见的巨量/微量用日常物对照。让"100亿参数"从数字变成可感知体积。

**例**：

- "GPT-4 有 1.7 万亿参数" → 一颗米对照一座米山
- "Token 处理速度 100ms" → 眨眼时间对照
- "训练数据 45TB" → 多少本书的厚度
- "上下文 200K tokens" → 多少页 A4 纸

**推荐 asset_kind**：`imagegen_2d` + `remotion_dataviz`（混合）

**`generation_prompt` 模板**：

```
对比构图：左侧一个【小日常物：一颗米 / 一秒 / 一本书】，右侧巨型【同物件堆积/拉长/重复 N 次】，背景留白，简洁标注【1 vs N】。手绘线稿，无装饰，回形针科普图风。
```

**`remotion_layout_plan` 模板**：

```
左物件先入画（"这是 1 颗米"），右物件从画外逐步堆积入画（伴随计数器从 1 跳到 N，节奏匹配 voiceover）。最终对照定格 2s。镜头从左物件慢慢拉远，让右物件的庞大感扑面而来。
```

**Remotion 程序化部分**：右物件可以用 `<Img>` 多次平铺 + `interpolate` 动画位置/数量，比 imagegen 出整图更灵活。

**不适合**：定性话题（没有可量化的对比）。

---

## 套路 5：流程化（Flow Visualization）

**适合 knowledge_action**：`decompose`、`prove`、`bridge`

把过程变成步骤图。

**例**：

- RAG 流程 → 用户问 → 检索 → 取证 → 生成 → 回答
- Agent 工作 → 接到任务 → 拆解 → 调工具 → 汇报
- 提示词工程 → 草稿 → 测试 → 改进 → 锁定

**推荐 asset_kind**：`infographic_svg` 或 `remotion_dataviz`

**`generation_prompt` 模板**（如果用 imagegen 出图）：

```
横向流程图，N 个圆形/方形节点从左到右，每个节点内有【步骤名 + 一个小图标】，节点之间用【箭头/虚线/数据流符号】连接，每个节点下面有一行【简短动作描述】。手绘风信息图，黑底白线 or 白底深蓝，no dashboard, no neon。
```

**`remotion_layout_plan` 模板（推荐 Remotion 程序生成而不是 imagegen 出整图）**：

```
用 Remotion <AbsoluteFill> + <Sequence> 程序化绘制：每个节点是一个 <Circle> + <Text>，箭头是 <Line>。节点按 voiceover 节奏逐个 fade-in + scale-in，箭头随之 draw（从左到右描线动画）。每个节点的 entry timing 与 spoken_script 关键词对齐。
```

**为什么 Remotion 程序生成更好**：流程图节点数会随话题变（5-8 个），节奏要跟 voiceover 对齐——这是程序化更擅长的。imagegen 出整图后无法切片对齐节奏。

**不适合**：单点强调（用 hero frame 更好）。

---

## 套路 6：对照实验（Side-by-Side）

**适合 knowledge_action**：`compare`、`prove`、`invert`

A 方案 vs B 方案的同时演示。

**例**：

- 有 AI vs 没 AI 干同一件事
- 老方法 vs 新方法
- 错误用法 vs 正确用法
- 凭记忆答 vs 现场翻书答

**推荐 asset_kind**：`imagegen_2d` 或 `screen_recording_annotated`

**`generation_prompt` 模板**：

```
左右分屏对照，左侧【A 场景具体描述】，右侧【B 场景具体描述】，两侧风格一致（同一插画师/同一手绘风），中间一条细分割线。左侧整体偏冷色调，右侧整体偏暖色调（暗示对错/旧新）。回形针对照图风，no dashboard, no UI elements。
```

**`remotion_layout_plan` 模板**：

```
左右分屏：左侧先入画并演示 2s 完整动作（A 方案），然后右侧入画并演示 2s（B 方案）。完成后两侧定格 2s 让观众对比。镜头不动——让对比本身完成论证。字幕底部分两行标 A / B。
```

**Hunyuan3D 升级**：如果 A/B 是物理装置对比（如"老式仪表盘 vs 现代屏幕"），可以走 `hunyuan3d_mesh` 各出一个 3D 模型并排。

**不适合**：单方案讲解（没有对比对象）。

---

## 套路 7：历史对比（Historical）

**适合 knowledge_action**：`compare`、`bridge`、`hook`

这件事过去怎么做 vs 现在怎么做。

**例**：

- 过去查资料：去图书馆翻书 vs 现在：AI 现场翻书
- 过去做视频：摄像机+剪辑师 vs 现在：录音 + AI
- 过去画图：手绘+扫描 vs 现在：prompt → imagegen

**推荐 asset_kind**：`imagegen_2d`（两张图分别画）或 `mixed_compose`

**`generation_prompt` 模板**（两次调用）：

```
第一次：复古黑白照片风/老画报风/胶片质感，一个【过去年代场景】，人物在【做事】，使用【旧工具】，整体怀旧氛围。
第二次：现代手绘插画风/扁平设计，一个【当代场景】，人物在【做同样的事但用新工具】，整体明亮简洁。
```

**`remotion_layout_plan` 模板**：

```
左侧（"过去"）旧照片风图，右侧（"现在"）现代插画风图。先单独展示左侧 2s（带"以前"字幕），然后右侧入画 + 字幕"现在"。两侧风格反差**就是**论证。
```

**不适合**：永恒话题（没有时代变化）。

---

## 套路 8：物理类比（Physical Analog）

**适合 knowledge_action**：`define`、`decompose`、`prove`

抽象功能 → 物理装置/机械结构。

**例**：

- 神经网络权重 → 调音台滑块（每个滑块控制一个频段）
- Attention 机制 → 探照灯（聚焦光斑）
- 模型温度 → 收音机调谐旋钮（高温=噪声大）
- Token embedding → 多维坐标系上的星点

**推荐 asset_kind**：`hunyuan3d_mesh`（最适合）或 `imagegen_2d`

**`generation_prompt` 模板（imagegen 版）**：

```
复古机械装置风，一个【具体仪器：调音台/收音机/老打字机/天文望远镜】，特写视角，金属/木质质感，仪表盘上标签写【概念映射 1: 滑块=权重】、【概念映射 2: 旋钮=温度】，背景暗色木桌，光线侧打，回形针物理类比图风，no dashboard, no holographic display.
```

**Hunyuan3D 版**：从 imagegen 出 4 视角 character sheet → 喂给 Hunyuan3D-2mv → .glb → R3F 加载，镜头围绕装置缓慢 orbit。

**`remotion_layout_plan` 模板**：

```
3D 装置或 imagegen 图 60% 屏占，镜头初始全景（看到整个装置），然后慢慢推进到一个关键控件（如调音台某个滑块），字幕命名"这个滑块就是模型的 X 参数"。镜头路径 = 论证流。
```

**不适合**：纯软件话题（没有物理对应物）。

---

## 套路 9：数据可视化（Data Visualization）

**适合 knowledge_action**：`prove`、`compare`、`expand`

把数字变图表，但**不是 dashboard 风的图表**，是叙事性图表。

**例**：

- 模型参数量增长曲线（GPT-1 → GPT-4）
- 不同模型在某任务上的成功率对比
- 训练成本 vs 推理成本占比

**推荐 asset_kind**：`remotion_dataviz`（**强烈推荐 Remotion 程序生成**，imagegen 出图静态、对不齐节奏）

**`remotion_layout_plan` 模板**：

```
Remotion 程序绘制：条形图/折线图。每个数据点按 voiceover 节奏 fade-in（不是一下子全出来）。x 轴/y 轴用手绘线稿风格（不是 dashboard 的精确刻度）。配色克制（背景白/米色，主色 1 个暖色 + 1 个冷色对比）。每个数据点上方有一个具体物的对照图（如"175B 参数 = 这堆纸"），数据 + 类比并存。
```

**关键**：避免做成 Tableau / Grafana dashboard 风。数据可视化要**有作者视角**——哪个数字大、哪个反常、哪个该警惕——通过镜头强调（zoom 到反常的数据点 + 字幕"看这里"）来表达。

**不适合**：定性话题。

---

## 套路 10：录屏 + 标注（Screen Recording Annotated）

**适合 knowledge_action**：`prove`、`decompose`、`hook`

真实操作演示 + Remotion 程序化高亮/箭头/标注。

**例**：

- 演示一个 AI 工具怎么用（Claude / Codex / ChatGPT）
- 展示一个 prompt 的实际输出
- 复现一个 bug 或 quirk

**推荐 asset_kind**：`screen_recording_annotated`

**采集流程**：

1. 用户自己录屏（不需要 AI 生成；这是真实证据）
2. AI 在 visual-compiler 阶段在 Remotion 里 layer：
   - 录屏视频作为底层 `<Video>`
   - 高亮覆盖：Remotion `<Rect>` 圈出 UI 关键区域
   - 箭头标注：Remotion `<Svg>` 画箭头指向
   - 字幕：Remotion `<Subtitle>` 跟 voiceover 节奏

**`remotion_layout_plan` 模板**：

```
录屏视频 100% 屏占，初始 1:1 playback，到关键时刻（voiceover 说 "看这个"）镜头放大到屏幕局部 200% + 红色圆圈高亮 UI 元素 + 箭头从字幕指向元素。voiceover 讲完后镜头拉回 100% 继续 playback。
```

**`generation_prompt`**：录屏不需要生成 prompt，但要在 `style_reference` 写"截屏完后用 Remotion 加手绘风圈红 + 箭头标注，不要用警告 tooltip 风"。

**不适合**：抽象概念话题（没有具体可操作的演示）。

---

## 套路选择决策表

| knowledge_action | 默认套路 | 备选 |
|---|---|---|
| `define`（定义） | 1 拟人化 / 2 拟物化 | 3 横截面 / 8 物理类比 |
| `compare`（比较） | 6 对照实验 / 7 历史对比 | 4 比例缩放 / 9 数据可视化 |
| `decompose`（拆解） | 3 横截面 / 5 流程化 | 2 拟物化 |
| `prove`（证明） | 9 数据可视化 / 10 录屏标注 | 4 比例缩放 / 6 对照实验 |
| `invert`（反转） | 6 对照实验 / 7 历史对比 | - |
| `compress`（压缩） | 5 流程化 | 1 拟人化 |
| `expand`（展开） | 3 横截面 / 4 比例缩放 | 9 数据可视化 |
| `summarize`（总结） | 5 流程化 | - |
| `bridge`（过渡） | 1 拟人化 / 7 历史对比 | - |
| `hook`（钩子） | 4 比例缩放 / 10 录屏标注 | 6 对照实验 |

---

## AI 在 director-board 选套路的算法

1. 读 scene 的 `brainstorming_layer.knowledge_action`
2. 从决策表选默认套路（如果默认不合该 scene 的具体内容，从备选选）
3. 套用本文档对应套路的 `generation_prompt` 模板，**把模板里的【方括号】占位符填成具体内容**（不是抽象描述）
4. 写入 `analogy_pass.concrete_execution_plan.generation_prompt`
5. 套用 `remotion_layout_plan` 模板，按 scene 实际时长调整
6. 写入 `analogy_pass.concrete_execution_plan.remotion_layout_plan`
7. 完成

**反模式**（AI 不要做的）：

- 同一支视频 10 个 scene 全用同一个套路（套路要变化，避免画面单调）
- 写 `generation_prompt` 时仅复制模板不填具体内容（出来的图会是抽象塑料感）
- 在 `style_reference` 写 "AI 风 / 高科技风 / 赛博朋克"——本 playbook 所有套路的**默认审美是回形针/Kurzgesagt/3B1B 的手绘信息图风**，不是 AI 默认风
- 把套路 10（录屏）的 `generation_prompt` 写成"生成一段录屏"——录屏不是 AI 生成的，是用户提供的素材
