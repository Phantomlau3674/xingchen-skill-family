# Forbidden Patterns

These patterns are not aesthetic disagreements. They are failure modes that break the form-to-content bond.

每条 pattern 末尾的 `audience_visibility` / `triggers_above_tier` / `failure_severity` 三字段决定该 pattern 在 lookdev gate 中的激活与阻断强度：

- `audience_visibility`: `universal`（任何受众都不接受）/ `insider_only`（仅 insider 受众允许）/ `banned_for_lay`（lay 受众下硬阻断、其它受众允许）
- `triggers_above_tier`: 此 pattern 检测对哪个 tier 及以上**让位**。lay_scrolling < lay_curious < domain_aware < insider。例如 `triggers_above_tier: insider` 表示从 insider 开始可以接受。
- `failure_severity`: `blocker`（lookdev 直接 failed）/ `warning`（记录但不阻断）/ `manual_review`（人工签字）

## pattern: english-status-chip

- looks like: `ESTABLISH` `FOCUS` `PROOF` `MAX PLAN` 一类英文胶囊浮标，漂在角落当专业感装饰
- why it fails: 它既不承担叙事，也不携带证据，只是在借行业 UI 语气装懂
- detection: scene has floating status chip text that is not referenced by narration, proof, or workflow state
- example path: `./v1-failure-frames/frame-01.png`
- allowed swap: 用真实命令提示符、路径引用或 skill 徽章承担状态信息
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: pseudo-dashboard-card

- looks like: `W1 成本` `NODE 1` 这类分区卡、发光框、流程框，看似结构化，实则没有真实系统含义
- why it fails: 形式借用了 dashboard 的权威感，但内容并不是 dashboard 该呈现的东西
- detection: floating panels or labeled boxes exist without a real data, system, or proof contract behind them
- example path: `./v1-failure-frames/frame-04.png`
- allowed swap: 用真实文件树、时间线、证据截图或真实流程节点替代假面板
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: narration-echo-bubble

- looks like: 屏幕侧边或中间出现整句辅助泡泡，把旁白几乎原样再念一遍
- why it fails: 观众左耳右眼同时消费同一句，既不补信息，也不增加记忆钩子
- detection: support text block exceeds 8 characters and semantic overlap with spoken line is above 70%
- example path: `./v1-failure-frames/frame-03.png`
- allowed swap: 把屏幕文字压缩成 2 到 8 个结构词，或直接让证据画面承担信息
- audience_visibility: universal
- triggers_above_tier: insider
- failure_severity: warning

## pattern: thumbnail-evidence

- looks like: 关键截图被缩在角落卡片里，只能看出"有张图"，看不出图里写了什么
- why it fails: 证据本该承担信任，却被压成了装饰缩略图
- detection: proof-heavy scene evidence coverage below 0.60, or critical proof text unreadable at target resolution
- example path: `./v1-failure-frames/frame-05.png`
- allowed swap: 把证据做成 hero visual，至少 60% 覆盖，关键区域逐段高亮
- audience_visibility: universal
- triggers_above_tier: insider
- failure_severity: blocker

## pattern: gradient-blob-decor

- looks like: 背景大面积渐变光斑、粒子、扫光、柔焦氛围层
- why it fails: 它把注意力从内容锚点拉走，用气氛冒充设计
- detection: decorative glow or particle layer exists with no story, proof, or motion role
- example path: `./v1-failure-frames/frame-01.png`
- allowed swap: 用可解释的动效承担节拍，如光标闪烁、diff 滚动、扫描框、高亮线
- audience_visibility: universal
- triggers_above_tier: insider
- failure_severity: warning

## pattern: mixed-chrome-families

- looks like: 终端语汇、SaaS dashboard、纪录片时间码、宣传片光斑同时出现在一条片子里
- why it fails: 全片没有单一符号系统，观众每一场都要重新学语言
- detection: `chrome_family` not singular across scene packaging, or multiple families appear in one scene without art-direction exception
- example path: `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`
- allowed swap: 先锁一个 family，再让所有 scene 从同一家族变体出发
- audience_visibility: universal
- triggers_above_tier: insider
- failure_severity: manual_review

## pattern: static-over-1.5s

- looks like: 场景超过 45 帧几乎不变，只剩轻微呼吸或背景闪烁
- why it fails: 抖音信息流里这会被读成 PPT，不是 motion design
- detection: max static run frames > 45
- example path: `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`
- allowed swap: 保证每场至少有 entry / sustain / boundary 三类不同动作
- audience_visibility: universal
- triggers_above_tier: insider
- failure_severity: blocker

## pattern: centered-bullet-list

- looks like: 黑底中央堆一坨分点或大标题+条目，像 PPT 列大纲
- why it fails: 它只在"讲清楚结构"上尽责，却没有把结构变成画面动作
- detection: bullet or stacked text list occupies the central anchor without a matching scene metaphor
- example path: `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`
- allowed swap: 把结构转成文件树、路径、分裂墙、命令面板、时间线等可感知装置
- audience_visibility: universal
- triggers_above_tier: insider
- failure_severity: blocker

## pattern: apple-keynote-sans

- looks like: 黑底、无衬线超大字、中央对称构图、几条很干净的线
- why it fails: 它是品牌发布会语法，不是这条内容自己的语法
- detection: scene can survive a full text swap with almost no other layout change
- example path: `./v1-failure-frames/frame-03.png`
- allowed swap: 让排版服从内容世界，而不是反过来用通用发布会版式装内容
- audience_visibility: universal
- triggers_above_tier: insider
- failure_severity: warning

## pattern: fake-cli-without-skill-binding

- looks like: 有终端条、光标或进度线，但这些元素和真正的 skill 行为无绑定，只是赛博装饰
- why it fails: 假终端比不用终端更糟，因为它会消耗观众对"运行证据"的信任
- detection: terminal-like chrome appears, but no command, diff, path, progress, or real task semantics are connected to it
- example path: `./v1-failure-frames/frame-01.png`
- allowed swap: 只有当命令、进度、diff、路径本身就是叙事证据时，才允许使用 CLI 语汇
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: xingchen-internal-vocabulary-leak

- looks like: 画面上出现 `scene-board` / `scene-board.md` / `xingchen-proof-pack` / `project-state` / `STRUCTURE QUESTION` / `S01`-`S99` 章节编号、或其它 xingchen 家族内部脚手架词汇
- why it fails: 这些是制作管线词汇，对内有意义对外是黑话。普通观众读到"scene-board"会感到"在看别人的脚手架"，立刻划走
- detection: OCR scan 或 render-plan.json 文本字段 grep 命中 regex `/scene[_-]?board|proof[_-]?pack|project[_-]?state|xingchen[_-]\w+|STRUCTURE QUESTION|^S\d{2}$/i`
- example path: `C:\Users\liuzh\Videos\douyin\0512\out\still-s01.png`
- allowed swap: 章节标题换成观众语义（"第三步"、"为什么"、"看一下"），编号删掉或换成中文章节名
- audience_visibility: banned_for_lay
- triggers_above_tier: insider
- failure_severity: blocker

## pattern: powershell-log-frame

- looks like: 大块 PowerShell / bash / Codex 命令行 log、`Created N files`、绿/红 diff 直接铺画面当背景或装饰
- why it fails: 不是叙事证据时这就是赛博装饰；普通用户看不懂也不信任，且 log 没和当下旁白绑定
- detection: scene contains >3 lines of console-style monospaced text without each line being anchored by narration in `script.spoken_script`
- example path: `C:\Users\liuzh\Videos\douyin\0417\out\review-h\s5.png`
- allowed swap: 把"运行了什么"翻成观众听得懂的一句话 + 一张结果截图（带高亮）；终端只在"命令本身就是论据"时使用
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: pipeline-stage-tag

- looks like: `PROVE` / `REVEAL` / `PATH A` / `PATH B` / `proof · focus-crop` 这类制作管线 stage/role 标签当画面 chip/badge 漂在角落
- why it fails: 这些是 `knowledge_action` / `evidence_role` / `job` 字段值，给制作流程看的内部 metadata。观众没有这个语言系统，会读成"乱码贴纸"
- detection: scene 上出现大写 ASCII chip/badge 文本，该文本未出现在 `script.spoken_script` 且不在 `visual.visual_policy.allowed_chrome[]` 白名单
- example path: `C:\Users\liuzh\Videos\douyin\0506\output\mayday-signal-library-v3-real-subtitles.mp4`
- allowed swap: 状态/分支用中文短词；或让画面布局本身承担信息（左右分屏 = PATH A/B）；或直接删掉 chip 让画面更干净
- audience_visibility: banned_for_lay
- triggers_above_tier: insider
- failure_severity: blocker

## pattern: dashboard-chip-shape-foreground

- looks like: 前景文字标签套了 `border: 1px solid rgba(...) + linear-gradient background + box-shadow + skewX/rotate` 这组合（典型 dashboard chip / sci-fi alarm tag 视觉语言）
- why it fails: 无论文字本身是否干净（来自口播稿）、无论审美底是 paper / chibi / sci-fi——一旦多个前景文字用 chip 容器堆叠在画面里，整体视觉等价于 dashboard PPT。回形针 / 3B1B / Kurzgesagt 无一家这样用。R04 段被嘲讽的核心症状即此模式（7 个 "杂乱文本/图片/PPT" div chip 堆叠在 imagegen 背景前）。
- detection: `.tsx` 文件中 `<div style={{ ... }}>` 节点同时含 `border` + (`linear-gradient` 或 `radial-gradient`) + `box-shadow` 且作为前景文字容器（含中文 text node 子元素或 `<span>` 文字子元素）。这种节点在同一 scene 组件中 > 2 个 ⇒ fail。
- example path: `C:\Users\liuzh\Videos\douyin\0512\handoff\claude-r04-ceiling-segment-20260514-102913\src\R04CeilingSegment.tsx`
- allowed swap: 1) 文字标签直接 typeset 在 `<Img>` 物件之上（无 chip 容器）；2) 写在 hand-drawn 风的 `<svg>` label 上；3) 完全不要文字让 `<Img>` 物件 + 镜头运动承担信息。每个前景概念应该有自己的真实生成素材（imagegen / Hunyuan3D），由 `additional_asset_specs[]` 强制保证。
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: static-camera-decoration

- looks like: `CameraRig` / 全片镜头 transform 只有微抖（scale 变化 < 0.15 OR translate 累计 < 视口 10%），没有真正的推 / 拉 / 摇 / 移
- why it fails: 镜头不动 ≠ 沉稳——是丧失叙事工具。回形针 / 3B1B 每个 scene 都有有意图的运镜（揭示细节 / 揭示空间 / 揭示尺度对比）。R04 的 `CameraRig` translate ±42px / scale 1.02~1.10 = 装饰性飘移
- detection: 扫 `.tsx` 中 transform 字符串内的 `interpolate(..., [...], [a, b], ...)` 数值范围。scale 最大变化 < 0.15 AND translate 任一方向累计 < 视口 10% ⇒ fail
- example path: `C:\Users\liuzh\Videos\douyin\0512\handoff\claude-r04-ceiling-segment-20260514-102913\src\R04CeilingSegment.tsx`
- allowed swap: 必须从 `concrete_execution_plan.camera_intent` enum 中选一个非 `held` 的运动类型，且实际 transform 数值满足该 intent 的最小幅度要求（push_in / pull_out scale 变化 ≥ 0.3；dolly translate ≥ 视口 15%）
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: linear-physics-for-impact-motion

- looks like: 物体"进入 / 离开 / 碰撞 / 弹跳 / 散落"动作用 `interpolate(..., {easing: Easing.linear})` 或 `interpolate(...)` 不指定 easing 的纯线性平移
- why it fails: 物理动作的视觉力量来自惯性 + 弹性 + 阻尼。R04 的"7 种杂乱素材飞进玻璃舱"用了 7 条 linear interpolate—— 7 个标签平稳滑入位置，没有"被吸力扯进 / 撞击玻璃 / 反弹震动"的物理感
- detection: `concrete_execution_plan.physics_targets[]` 非空时，扫对应 .tsx 中相关元素的位置/scale interpolate 调用，无 `spring(` 也无 `matter-js` / `rapier` / `cannon` import ⇒ fail
- example path: `C:\Users\liuzh\Videos\douyin\0512\handoff\claude-r04-ceiling-segment-20260514-102913\src\R04CeilingSegment.tsx`（MaterialCascade 段）
- allowed swap: 用 `spring({frame: frame - delay, fps, config: {damping, stiffness, mass}})` 驱动这些元素；或 import 物理引擎做真实碰撞 + 重力 + 反弹（"机械故障 + 杂乱素材冲入 + 玻璃震动"的画面需要这一层）
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: imagegen-with-chinese-text

- looks like: imagegen / SDXL / FLUX / GPT-Image 出的图里**含中文文字**（标题、标签、章节名、CTA 等）
- why it fails: 当前任何 image-gen 模型出中文几乎必糊 + 必错字（笔画断裂、错别字、繁简混乱）。"传统程序的天花板"出来变成"传统呈序的太花扳"——观众一眼破功。中文必须由 Remotion 程序叠字（NotoSansSC / DengXian），用真实字体而不是生成
- detection: 对 `render.generated_assets[]` 中所有 `asset_kind ∈ {imagegen_2d, mixed_compose, stock_photo_annotated}` 的 PNG 文件跑 OCR（PaddleOCR / RapidOCR），检测中文字符。命中连续 ≥ 2 个中文字符 ⇒ warning；连续 ≥ 4 个或成完整词组 ⇒ blocker
- example path: 历史 0512 项目部分 AI 生成背景图含错字痕迹
- allowed swap: (1) 重写 `concrete_execution_plan.generation_prompt` 加 negative prompt: `"no Chinese text in image, no Chinese characters, no text inside the artwork, leave clean space at top/bottom for overlay caption"`；(2) imagegen 出**留白版**主体图，Remotion 在留白区程序叠中文。例外：用户提供的真实截图（来自 `sources.asset_manifest[]`）含中文是"真实证据"，不在此规则范围
- audience_visibility: banned_for_lay
- triggers_above_tier: insider
- failure_severity: blocker

## pattern: svg-mimicking-physical-object

- looks like: 用 SVG `<polygon>` / `<path>` / `<rect>` + 渐变 fill + box-shadow 程序绘制**本应是真实物件**的东西（机器、纸张、相机、书、玻璃、人像、家具、自然物）
- why it fails: 程序化几何永远画不出真实物理质感（纸纹/塑料/金属/光影/景深）。结果是图标级抽象 ≈ PPT 示意图。R04 的 SVG polygon 机械臂、玻璃裂纹、解析机外壳都是这条 pattern 的典型
- detection: 扫 `render.scene_motion_specs[].component_path` 指向的 .tsx，找 `<svg>` 块内 ≥ 3 个 polygon/path/rect 节点 + 至少一个 `fill="url(#linearGradient...)"` 或 `radial-gradient` 引用 + 该 scene 的 `enumerated_concepts[]` 含明显物件名（"机器/纸/书/相机/瓶/盒/管/灯/桌/椅/装置/外壳/胶片/磁带/CD/文件夹"等）⇒ 警告：物件应由 imagegen 承担
- example path: `C:\Users\liuzh\Videos\douyin\0512\handoff\claude-r04-ceiling-segment-20260514-102913\src\R04CeilingSegment.tsx`（MechanicalRig 段）
- allowed swap: 把 SVG 几何换成 `<Img src=imagegen-output.png>`，imagegen 出真实物件特写（机器/纸/相机），Remotion 只负责叠中文/箭头/高亮/动效。SVG 仅用于**信息层**（箭头、连接线、流程节点、数据图表、刻度尺）和**抽象图标**（明确符号 icon scale）
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: imagegen-fake-ui-screenshot

- looks like: imagegen 出"假的 ChatGPT 界面 / 假的 dashboard / 假的代码编辑器 / 假的聊天 UI" 当 proof
- why it fails: imagegen 画 UI 会出 fake buttons + fake text + fake user avatars + fake numbers——是 dashboard PPT 的图像版。真实 UI 必须是用户提供的真实截图 / 录屏
- detection: imagegen 生成的图含 UI 元素特征（窗口标题栏 / 按钮 / 输入框 / 列表项 / 鼠标光标 / 滚动条），且文件命名或 generation_prompt 含 `UI` / `screenshot` / `interface` / `dashboard` 等关键词 ⇒ fail
- allowed swap: (1) UI 证据必须用 `asset_kind: "screen_recording_annotated"` 接用户真实录屏；(2) UI 静态展示用 `sources.asset_manifest[]` 中用户上传的真实截图；(3) imagegen 用于 UI 时**只能出"印刷品形态"**（如"打印出来的聊天截图当纸张物件"），不出"运行中的 UI"
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: concept-as-svg-geometry-when-physical-metaphor

- looks like: 口播稿 / lay_analogy / director-board 写了**实物隐喻**（"AI 黑箱 / 工具笼 / 知识积木 / 工具锁 / 路标 / 冰山 / 黑盒 / 邮件 / 表格 / 钥匙 / 箱 / 盒 / 管 / 桶 / 电路 / 机器 / 仪器 / 纸 / 书 / 相机 / 屏幕 / 键盘"），但 `concrete_execution_plan.asset_kind` 选了 `remotion_dataviz` / `infographic_svg`（程序绘制）
- why it fails: 实物隐喻的画面力量来自**真实物理质感**——金属表面、玻璃反光、纸张纹理、机械结构。用 SVG `<rect>` + 渐变 + 边框画的"AI 黑箱"是写着"AI 黑箱"4 个字的方块，没有黑箱感。0513 项目所有 scene 全选 `remotion_dataviz` 是这条 pattern 的极端案例：物件素材 `premium-object-sheet.png` 已经生成但没被代码 import，画面退化成 div 矩形堆
- detection: 扫每个 scene 的 `concrete_execution_plan.enumerated_concepts[]` 含以下中文实物名词：`黑箱 / 黑盒 / 笼 / 锁 / 箱 / 盒 / 管 / 桶 / 罐 / 瓶 / 邮件 / 表格 / 纸 / 书 / 相机 / 屏幕 / 键盘 / 鼠标 / 桌 / 椅 / 灯 / 装置 / 外壳 / 机器 / 仪器 / 仪表 / 钥匙 / 路标 / 标牌 / 冰山 / 积木 / 齿轮 / 弹簧 / 电路 / 屏 / 杯 / 壶 / 罐 / 抽屉 / 文件夹 / 容器 / 玻璃` 之一，且该 scene 的 `asset_kind` 是 `remotion_dataviz` 或 `infographic_svg` ⇒ failed
- example path: `C:\Users\liuzh\Videos\douyin\0513\project-state.json` (11 个 scene 全选 `remotion_dataviz`，含"黑箱 / 工具 / 积木 / 邮件 / 表格"等实物隐喻)
- allowed swap: 把这些 scene 的 `asset_kind` 改为 `imagegen_2d`（出真实物件特写） 或 `hunyuan3d_mesh`（3D 道具） 或 `mixed_compose`（imagegen 出物件 + Remotion 程序加箭头/标签/动效）。SVG 仅保留作为**信息层**（箭头/连接线/高亮/数据图表）—— 不再承担"是什么物件"的呈现
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: imagegen-asset-orphan

- looks like: `render.generated_assets[]` 中登记了 `asset_kind: imagegen_2d` / `hunyuan3d_mesh` / `mixed_compose` 的资产，但**没有任何 scene 的 `concrete_execution_plan.expected_output_paths[]` 或 `additional_asset_specs[N].expected_output_paths[]` 引用该资产**，**且**没有任何 `render.scene_motion_specs[].component_path` 指向的 .tsx 文件含 `staticFile("...{该资产文件名}...")` 调用
- why it fails: 资产生成了但代码里没 import = imagegen 白白生成。0513 的 `premium-object-sheet.png`（5 个真实金属/玻璃物件特写）就是这条 pattern 典型——质感非常好但 .tsx 里 0 次 import，画面退化成 div 矩形
- detection: 对 `render.generated_assets[]` 中每个 imagegen 类资产，扫 (a) 所有 scene 的 `concrete_execution_plan.expected_output_paths[]` + `additional_asset_specs[N].expected_output_paths[]` 是否含此 path；(b) 所有 `render.scene_motion_specs[].component_path` 指向的 .tsx 是否含 `staticFile("...{filename}...")`。两个都没命中 ⇒ failed
- example path: `C:\Users\liuzh\Videos\douyin\0513\remotion\public\assets\imagegen\premium-object-sheet.png`
- allowed swap: AI 退回 director-board 把孤儿资产绑到具体 scene 的 plan（写进 expected_output_paths），然后 visual-compiler 在该 scene 组件里 `<Img src={staticFile("...")}/>`；如果资产真的不该用，从 generated_assets 删除
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker

## pattern: voice-of-script-jargon

- looks like: `VoxCPM2` / `Remotion` / `Hyperframes` / `Seedance` / `Spark` / `3DGS` / `xingchen-*` 等工具/skill 品牌名直接打在画面上
- why it fails: 工具品牌名是行业话题，不是普通人的话题。放出来等于在炫技，让普通观众感到"这不是给我看的"
- detection: scene 包含 tool/skill 品牌字符串，且该工具不是该期视频的内容主题（即不在 `audience.vocabulary_level.allowed_jargon_terms`）
- example path: `C:\Users\liuzh\Videos\douyin\0506\output\mayday-signal-library-v3-real-subtitles.mp4`
- allowed swap: 工具名只在"这期视频内容就是讲这个工具"时（已加入 `allowed_jargon_terms`）才能出现；否则用功能描述代替（"AI 配音"代替"VoxCPM2"，"动画工具"代替"Remotion"）
- audience_visibility: banned_for_lay
- triggers_above_tier: domain_aware
- failure_severity: blocker
