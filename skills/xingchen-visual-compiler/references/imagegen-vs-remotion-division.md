# imagegen vs Remotion: 职责分工

## 核心原则

每一帧画面是**两条生产线协作**的产物，不是二选一：

- **imagegen 负责"物件 / 质感"**：真实物理形态 + 表面材质的静态资产
- **Remotion 原生负责"信息 / 精确 / 动效"**：中文文字、数据、几何关系、动效、镜头、状态

## Steven SuperPPT 双层板规则（视频版）

沿用 `steven-superppt-skill` 的生产思路：先把画面拆成两层，再决定工具。

- **图像板 / Image plate**：由 imagegen 或真实素材提供，负责背景、震撼图、氛围、质感、隐喻物件、章节场景。它可以漂亮、电影感、带空间纵深，但不能承载需要读准的信息。
- **精准层 / Precision layer**：由 Remotion / SVG / Canvas / Three.js 代码绘制，负责线框、路线、节点、表格、截图框、数据图、箭头、字幕、中文标签、证据高亮和节奏控制。

硬规则：

- 线框、路线图、节点关系、流程图、表格网格一律是代码原生组件，不做成透明 PNG 往 imagegen 背景上贴。
- imagegen 背景必须给精准层留安全区，不能用复杂纹理穿过文字、箭头、证据区。
- 震撼图可以占主视觉，但所有结论、数字、中文、推理链都回到精准层。
- 如果背景和线框同时抢注意力，删背景复杂度，保信息层可读。

R04 等过去翻车的核心症状是**职责错配**：

- 用 SVG polygon 画机械臂、玻璃天花板 → 这是"物件" 但用 Remotion 程序硬画 → 没质感
- 用 div + border + skewX 当"杂乱文本/图片/PPT" 标签 → 这也是"物件"但用 Remotion 程序硬画 → 全是 chip 形态
- 反过来用 imagegen 出整张带"传统程序的天花板"中文字的图 → imagegen 出中文糊 + 错字 + 不可控

正确做法：**imagegen 出真实物件主体，Remotion 在物件上叠中文/标注/动效/镜头**。

---

## imagegen 该做的（"物件 / 质感"）

### 判断特征

- 有真实**物理形态** + 表面材质（纸纹、塑料、金属、玻璃、布、墨水、皮革）
- **静态外观就有意义**（不依赖动画就能识别"这是什么")
- 复杂细节**不可程序化**（机器内部、纸张褶皱、自然光影、景深）
- 需要的是**质感而非精确**

### 具体物件清单

| 类别 | 例子 |
|---|---|
| **纸类** | 手写笔记、印刷文档、便签、贴纸、报纸、信封、剪报 |
| **屏幕物** | 聊天截图打印件、网页打印、PPT 印刷品（注意：是"印刷品物体"，不是 UI 截图本身） |
| **媒体物** | 照片、胶片帧、磁带、CD/DVD、唱片、录像带 |
| **装置 / 机器** | 机器外壳、仪器、装订夹、文件柜、键盘、相机、电子设备 |
| **自然物** | 植物、食物、水、火、烟雾、雪、沙、矿物 |
| **角色 / 人物** | character sheet（chibi / 写实 / 手绘）、表情切片、配饰 |
| **场景背景** | 房间、街道、工作台、桌面、抽象空间、世界场 |
| **质感纹理** | 木纹、布料、生锈金属、湿润玻璃、烟雾、布满灰尘的表面 |

---

## Remotion 该做的（"信息 / 精确 / 动效"）

### 判断特征

- 需要**精确控制**（数值、时间对齐、位置约束、对齐 voiceover 节奏）
- 是**信息载体**而非物件本体（文字、数据、关系、状态）
- 需要**动态变化**（运动、形变、出入场、状态切换、响应交互）
- 需要**叠在 imagegen 物件之上**作为信息层

### 具体清单

| 类别 | 例子 |
|---|---|
| **中文文字（强制）** | 口播字幕、关键词标签、状态提示、章节标题、CTA |
| **英文 / 数字文字** | 数据点、百分比、价格、计数、时间码 |
| **图表** | 条形图、折线图、饼图、网络图、流程图节点 |
| **几何抽象** | 箭头、连接线、圈红、高亮框、虚线、网格、刻度尺 |
| **动效** | 镜头推/拉/摇/移、碰撞、弹动、粒子、声波响应 |
| **状态指示** | 警告灯、进度条、计数器、计时器、匹配/未匹配标志 |
| **UI 覆盖** | 字幕卡、标签气泡、调用框、对话框、tooltip |
| **时间扭曲** | freeze、slow-mo、time-jump、scrub |
| **图形特效** | 高斯模糊、扫光、scan 线、glow、shadow、辉光 |

---

## 3 问决策矩阵

写每个画面元素前问 3 个问题：

### 问题 1：它是"物件"还是"信息"？

- **物件**（纸、照片、机器、人物、场景） → imagegen
- **信息**（文字、数字、图表、箭头、标签、状态） → Remotion

### 问题 2：它需要"质感"还是"精确"？

- **质感**（光影、纹理、材质、自然感） → imagegen
- **精确**（数值、时间对齐、位置约束、可控动效） → Remotion

### 问题 3：它在画面里"静态展示"还是"动态变化"？

- **静态展示主体** → imagegen 出整张
- **动态变化**（运动、形变、出入场、响应） → Remotion 控制（即使主体来自 imagegen，运动用 Remotion）

### 同时需要"质感主体 + 动态变化"时（最常见情况）

**两层协作**：

- imagegen 出**静态质感主体图**（无文字、无标注、无 UI 元素）
- Remotion 加**镜头运动 + 中文文字层 + 标注覆盖 + 高亮 + 出入场动效**

例：R04 的"传统程序的天花板"

- ❌ 错：div 红色斜体 chip "传统程序的天花板" + SVG polygon 假装玻璃裂纹
- ✅ 对：imagegen 出"破裂的玻璃天花板特写"（无任何文字）+ Remotion 在底部叠中文字幕"传统程序的天花板"+ Remotion 镜头推进暴露裂纹细节 + Remotion 程序绘制红色高亮圈

---

## 关键禁令

### 禁令 1：imagegen 不生成中文文字（INV-IMAGEGEN-NO-CHINESE-TEXT）

**为什么**：imagegen / SDXL / FLUX / GPT-Image 出中文**几乎必糊 + 必错字**（笔画断裂、错别字、繁简混乱）。生成出来的"传统程序的天花板"会变成"传统呈序的太花扳"之类——观众一看就破功。

**强制规则**：

- 所有 `concrete_execution_plan.generation_prompt` 必须包含 negative prompt：`"no Chinese text in image, no Chinese characters, no text inside the artwork, leave space for caption overlay"`
- imagegen 出的 PNG 跑 OCR 扫描，命中 ≥ 2 个连续中文字符 ⇒ lookdev `imagegen_chinese_text_scan` warning；连续 ≥ 4 个或成句 ⇒ fail，AI 重生成
- 例外：**原始截图素材**（用户提供的真实聊天截图 / 公众号截图 / 录屏帧）的中文是"真实证据"，不在此规则范围

**正确做法**：imagegen 出的图**留出叠字空间**（如顶部 / 底部 / 侧边留 200px 净空），Remotion 在那里用 NotoSansSC 程序叠中文。

### 禁令 2：SVG / div 不假装真实物件（svg-mimicking-physical-object pattern）

**为什么**：用 SVG polygon + 渐变阴影画"机械臂 / 纸张 / 相机 / 书 / 玻璃 / 人像"这些**应该有真实质感**的物件，结果就是图标级抽象 ≈ PPT 示意图。

**强制规则**：

- 当 scene 需要呈现真实物件时，`asset_kind` 必须是 `imagegen_2d` 或 `hunyuan3d_mesh` 或 `stock_photo_annotated`，**不是** `remotion_dataviz` / `infographic_svg`
- 例外：**图标级抽象**（明显是符号 icon scale，不是实物）—— 但要满足"画面里同时有真实物件 + 抽象图标"的混合，不能整场全图标
- lookdev `programmatic_object_form_check`：扫 .tsx 找复杂 SVG 块（≥ 3 个 polygon/path + 渐变 fill），如果该 scene 的 `enumerated_concepts[]` 含明显物件名（"机器/纸/书/相机/人/桌子/瓶/盒/管/灯"等），警告：物件本应由 imagegen 承担

### 禁令 3：imagegen 不画 UI 截图 / dashboard 元素

**为什么**：imagegen 画"假的 dashboard / 假的 ChatGPT 界面 / 假的代码编辑器" 会出 fake UI + fake text + fake button——这是 R04 之前的"伪 dashboard"问题的图像版。

**强制规则**：

- UI 截图 / 屏幕录制必须是**真实**用户提供素材（`asset_kind: "screen_recording_annotated"` 或 `sources.asset_manifest[]` 中的真实截图）
- imagegen 用于 UI 时只能出"印刷品形态"（如"打印出来的聊天截图作为纸张物件"），不出"运行中的 UI"

---

## 物件 / 信息 / 动效混合 layered 模板

每个 scene 的 `remotion_layout_plan` 应按这个三层结构写：

```
Layer 0 (imagegen 物件层)：
  - 主体物件 1: <Img src=imagegen-output-1.png> 位置/scale
  - 主体物件 2-N: <Img src=imagegen-output-N.png> 位置/scale
  - 背景图（可选）: <Img src=background.png> 透明度 / 模糊

Layer 1 (Remotion 几何 / 标注层)：
  - SVG 箭头 / 圈红 / 高亮框 / 连接线（程序绘制）
  - 粒子系统 / 扫光 / scan 线
  - 状态指示（警告灯闪烁、进度条）

Layer 2 (Remotion 中文文字层)：
  - 字幕（NotoSansSC / DengXian）
  - 关键词标签（叠在 Layer 0 物件之上，但用 Remotion 文本，不用 imagegen 文字）
  - 章节短词 / 状态短句

Layer 3 (镜头层)：
  - CameraRig 真镜头运动（push_in / pull_out / orbit / dolly）
  - 多 z-depth parallax（Layer 0/1/2 独立速度）
  - Freeze 关键瞬间
```

---

## Case Study：R04 该怎么混合

假设 R04 的 scene 是"机械故障：7 种杂乱素材冲入解析机被卡住"，**正确分工**：

### imagegen 出（一次性，长期复用）

- `parser-machine.png` —— "工业级解析机外壳特写"，金属质感、铆钉、玻璃面板、内部齿轮可见，**留出顶部 200px 净空给中文字幕**
- `cascade-paper-handnotes.png` —— 一沓散落的手写笔记
- `cascade-photo-print.png` —— 一张被翻折过的照片打印件
- `cascade-chat-printout.png` —— 一份打印的聊天截图（**纸张形态，非屏幕 UI**）
- `cascade-audio-cassette.png` —— 一盒磁带（代表"语气"）
- `cascade-document-stack.png` —— 一沓装订文件
- `cascade-slide-printout.png` —— 一份 PPT 印刷品（A4 纸 8 格小图）
- `cascade-film-strip.png` —— 一段 35mm 胶片

**注意**：每张图的 imagegen prompt 都必须含 `"no Chinese text, no text inside the artwork, leave clean space at top for overlay caption"`

### Remotion 程序绘制 / 动效

- 7 个素材入场用 `spring()` 物理（不同 mass 制造节奏错落）
- 进入解析机时碰撞反馈（机器 scale 反弹 + 玻璃 1 帧 freeze）
- 散落后惯性二次弹动（用 spring damping）
- 机器"卡住"红色警告灯闪烁（state machine）
- 中文叠字："传统程序的天花板"（顶部 NotoSansSC）、"只能处理预定义结构"（底部）
- SVG 程序绘制：圈红高亮"卡住"的位置 + 箭头指向
- 粒子：碎屑从机器缝隙飞出（≥ 50 粒子）
- 镜头：push_in 1.0 → 1.4 推进到机器面板暴露"卡住"细节
- 声波驱动：用 `useAudioData` 让警告灯闪烁强度跟口播节奏

**这才是 Remotion + imagegen 各自发力的画面**——任何一个用 SVG 假装都会减分。

---

## director-board AI 选 asset_kind 的快速决策

```
question = "这个元素是什么？"

# 第 1 优先级：检查 enumerated_concepts 是否含中文实物隐喻名词
# 命中即强制 imagegen，无论概念上是否"抽象"
if enumerated_concepts 含任一中文实物名词（黑箱/笼/锁/箱/盒/管/桶/罐/邮件/表格/纸/书/相机/屏幕/键盘/桌/椅/灯/装置/外壳/机器/仪器/钥匙/路标/标牌/冰山/积木/齿轮/电路/抽屉/文件夹/容器/玻璃 ...）：
    asset_kind = imagegen_2d 或 hunyuan3d_mesh 或 mixed_compose
    # 即使"AI 黑箱"是抽象概念隐喻，"黑箱"这个名词指向真实物件
    # 必须 imagegen 出真实金属外壳 + 玻璃面板 + 输入孔 + 输出孔
    # 禁止用 SVG <rect> + 渐变假装"黑箱"

if 是真实物件 + 需要质感（纸张/机器/照片/人物/自然物/场景背景）：
    asset_kind = imagegen_2d
    generation_prompt 必须含 "no Chinese text, no text inside artwork"

elif 是 3D 道具 + 需要镜头围绕（杯子/机器/标志物）：
    asset_kind = hunyuan3d_mesh

elif 是真实用户提供的截图 / 录屏：
    asset_kind = screen_recording_annotated 或 sources.asset_manifest[]

elif 是数据 / 图表 / 流程图节点：
    asset_kind = remotion_dataviz   # Remotion 程序绘制

elif 是纯几何抽象（数学曲线、网络节点、轨迹，不带任何实物隐喻名词）：
    asset_kind = remotion_dataviz   # 不要用 imagegen，imagegen 画几何是垃圾

elif 是 chibi 角色 + 已有 brand_kit：
    asset_kind = chibi_layered

else 信息层（标签、状态、字幕、警告）：
    # 不创建 asset_kind，直接在 Remotion 组件里程序绘制 + 字体叠加
```

**核心心智**：默认走 imagegen（真实质感），只有"信息 / 几何 / 数据"才走 Remotion 程序。**反向不成立**——不要为了"省钱省时间"就用 SVG 假装真实物件。

### 实物隐喻陷阱（0513 案例的根因）

口播稿写"AI 像一个黑箱" / "工具锁" / "知识积木" / "信息冰山"—— AI 在 director-board 阶段容易把这些判定为"抽象概念关系"，选 `remotion_dataviz` 用 SVG 程序画。**这是错的。**

**判定规则**：

- 概念是**抽象关系**（如"输入输出对照"、"流程顺序"、"权重比例"、"网络拓扑"）⇒ `remotion_dataviz`
- 概念用**实物名词**承载（如"黑箱"、"工具笼"、"知识积木"、"冰山"、"邮件"、"表格"）⇒ **必须 imagegen 出真实物件**

口诀：**"AI 像 X" 的 X 是名词时，X 必须 imagegen**。这是 `INV-PHYSICAL-METAPHOR-NEEDS-IMAGEGEN` 的核心。

### 资产必须接到 scene 才算用上

imagegen 出图后，资产必须满足两个条件之一才算"被使用"：

1. 该资产 path 出现在某 scene 的 `concrete_execution_plan.expected_output_paths[]` 或 `additional_asset_specs[N].expected_output_paths[]`
2. 该资产 filename 在某 scene 的 React 组件 .tsx 中通过 `staticFile("...{filename}...")` 实际 import

**孤儿资产**（generated_assets[] 登记了但 .tsx 没 import）= imagegen 白白浪费 + 画面退化到 div 凑数（0513 的 `premium-object-sheet.png` 就是这个症状）。`INV-IMAGEGEN-ASSET-BOUND-TO-SCENE` 和 lookdev `imagegen_asset_orphan_scan` audit 直接拦这种情况。
