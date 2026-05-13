# Forbidden Patterns

These patterns are not aesthetic disagreements. They are failure modes that break the form-to-content bond.

## pattern: english-status-chip

- looks like: `ESTABLISH` `FOCUS` `PROOF` `MAX PLAN` 一类英文胶囊浮标，漂在角落当专业感装饰
- why it fails: 它既不承担叙事，也不携带证据，只是在借行业 UI 语气装懂
- detection: scene has floating status chip text that is not referenced by narration, proof, or workflow state
- example path: `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\frame-01.png`
- allowed swap: 用真实命令提示符、路径引用或 skill 徽章承担状态信息

## pattern: pseudo-dashboard-card

- looks like: `W1 成本` `NODE 1` 这类分区卡、发光框、流程框，看似结构化，实则没有真实系统含义
- why it fails: 形式借用了 dashboard 的权威感，但内容并不是 dashboard 该呈现的东西
- detection: floating panels or labeled boxes exist without a real data, system, or proof contract behind them
- example path: `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\frame-04.png`
- allowed swap: 用真实文件树、时间线、证据截图或真实流程节点替代假面板

## pattern: narration-echo-bubble

- looks like: 屏幕侧边或中间出现整句辅助泡泡，把旁白几乎原样再念一遍
- why it fails: 观众左耳右眼同时消费同一句，既不补信息，也不增加记忆钩子
- detection: support text block exceeds 8 characters and semantic overlap with spoken line is above 70%
- example path: `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\frame-03.png`
- allowed swap: 把屏幕文字压缩成 2 到 8 个结构词，或直接让证据画面承担信息

## pattern: thumbnail-evidence

- looks like: 关键截图被缩在角落卡片里，只能看出"有张图"，看不出图里写了什么
- why it fails: 证据本该承担信任，却被压成了装饰缩略图
- detection: proof-heavy scene evidence coverage below 0.60, or critical proof text unreadable at target resolution
- example path: `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\frame-05.png`
- allowed swap: 把证据做成 hero visual，至少 60% 覆盖，关键区域逐段高亮

## pattern: gradient-blob-decor

- looks like: 背景大面积渐变光斑、粒子、扫光、柔焦氛围层
- why it fails: 它把注意力从内容锚点拉走，用气氛冒充设计
- detection: decorative glow or particle layer exists with no story, proof, or motion role
- example path: `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\frame-01.png`
- allowed swap: 用可解释的动效承担节拍，如光标闪烁、diff 滚动、扫描框、高亮线

## pattern: mixed-chrome-families

- looks like: 终端语汇、SaaS dashboard、纪录片时间码、宣传片光斑同时出现在一条片子里
- why it fails: 全片没有单一符号系统，观众每一场都要重新学语言
- detection: `chrome_family` not singular across scene packaging, or multiple families appear in one scene without art-direction exception
- example path: `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`
- allowed swap: 先锁一个 family，再让所有 scene 从同一家族变体出发

## pattern: static-over-1.5s

- looks like: 场景超过 45 帧几乎不变，只剩轻微呼吸或背景闪烁
- why it fails: 抖音信息流里这会被读成 PPT，不是 motion design
- detection: max static run frames > 45
- example path: `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`
- allowed swap: 保证每场至少有 entry / sustain / boundary 三类不同动作

## pattern: centered-bullet-list

- looks like: 黑底中央堆一坨分点或大标题+条目，像 PPT 列大纲
- why it fails: 它只在"讲清楚结构"上尽责，却没有把结构变成画面动作
- detection: bullet or stacked text list occupies the central anchor without a matching scene metaphor
- example path: `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`
- allowed swap: 把结构转成文件树、路径、分裂墙、命令面板、时间线等可感知装置

## pattern: apple-keynote-sans

- looks like: 黑底、无衬线超大字、中央对称构图、几条很干净的线
- why it fails: 它是品牌发布会语法，不是这条内容自己的语法
- detection: scene can survive a full text swap with almost no other layout change
- example path: `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\frame-03.png`
- allowed swap: 让排版服从内容世界，而不是反过来用通用发布会版式装内容

## pattern: fake-cli-without-skill-binding

- looks like: 有终端条、光标或进度线，但这些元素和真正的 skill 行为无绑定，只是赛博装饰
- why it fails: 假终端比不用终端更糟，因为它会消耗观众对"运行证据"的信任
- detection: terminal-like chrome appears, but no command, diff, path, progress, or real task semantics are connected to it
- example path: `C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\v1-failure-frames\frame-01.png`
- allowed swap: 只有当命令、进度、diff、路径本身就是叙事证据时，才允许使用 CLI 语汇
