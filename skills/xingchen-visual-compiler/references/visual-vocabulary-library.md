# Visual Vocabulary Library

10 种"非 PPT"画面语言。每种规定：

- 视觉特征（看起来像什么）
- 参考创作者（谁在用）
- 适配 [`concrete-analogy-playbook.md`](../../xingchen-next/references/concrete-analogy-playbook.md) 哪些套路
- 对应 `asset_kind` 路由
- `generation_prompt` 风格关键词
- Remotion 实现要点
- 不适合的场景

This is an optional reference catalog. It does not select a project style.

`xingchen-visual-compiler` may use an entry only when `visual_policy.reference_style.selected === true` and the recorded `source` or `selected_traits[]` explicitly selects that vocabulary. When no reference style is selected, do not infer a style from `asset_kind` and do not append any style keywords from this library.

When explicitly selected:

1. 读 `scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan.asset_kind`
2. 从本文档查对应画面语言
3. 仅追加项目状态明确选择的风格特征
4. 套用 Remotion 实现要点写 React 组件

**全片范围**：一支视频建议**主用 2-3 种画面语言**（统一基调），**穿插 1-2 种**（节奏变化）。10 种全混在一支视频里 = 违反 `INV-MONOTONY-CHECK`（视觉对比维度过载，反而混乱）。

---

## 画面语言 1: handdrawn_cross_section（手绘剖面图）

**视觉特征**：黑白或低饱和度线稿、等距/正面剖面视图、技术插画质感、克制配色（1-2 个点缀色）、清晰中文/英文层标签、无 dashboard chrome、无发光特效。

**参考创作者**：

- **回形针 PaperClip**——电梯剖面、键盘内部、芯片结构
- 早期 Vox Explained 系列科普图
- 《How It Works》杂志技术插画

**适配 analogy 套路**：

- 套路 3 横截面（主力）
- 套路 8 物理类比
- 套路 2 拟物化的剖面版

**asset_kind 路由**：`imagegen_2d`

**generation_prompt 风格关键词**（追加到 director-board prompt 末尾）：

```
手绘技术插画风格，等距剖面/正面剖面视图，黑白线稿为主 + 单一点缀色（米黄或暗红），层结构清晰，每层有清晰中文标签，整体回形针 PaperClip / 《How It Works》信息图风，no glowing effects, no neon, no dashboard chrome, no holographic display, no AI generated faces, no fantasy lighting.
```

**Remotion 实现要点**：

```tsx
// 单张剖面图全屏 + 镜头逐层推进
<AbsoluteFill>
  <Img src={crossSectionUrl} style={{
    transform: `scale(${zoom}) translateX(${panX}px) translateY(${panY}px)`,
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  }} />
  {layerLabels.map((label, i) => (
    <Subtitle
      key={label}
      enterAt={layerEnterFrames[i]}
      anchor={layerAnchors[i]}
    >{label}</Subtitle>
  ))}
</AbsoluteFill>
```

镜头路径 = 论证路径（每个 voiceover 关键词 → 推到对应层 + 高亮）。

**不适合**：纯人物故事、感性话题。

---

## 画面语言 2: chibi_layered_animation（chibi 分层动画）

**视觉特征**：扁平大头小身的卡通角色、纯色块填充、夸张表情、配饰可拆分、镜头驱动深度（多平面摄像机感）、背景简洁有几何感。

**参考创作者**：

- **Kurzgesagt — In a Nutshell**（天花板）
- TED-Ed 动画系列
- 部分国内"半佛仙人"片段（chibi 化的人物剧情）

**适配 analogy 套路**：

- 套路 1 拟人化（主力）
- 套路 6 对照实验（A 角色 vs B 角色）
- 套路 7 历史对比（古装版 vs 现代版同一角色）

**asset_kind 路由**：`chibi_layered`（用户已有猫导演 character sheet + 切片）

**generation_prompt 风格关键词**（如果还要扩展 character sheet）：

```
chibi 卡通风格，大头小身比例（头身比 1:1.2），扁平设计 flat design，纯色块填充无渐变，配色 3-4 色（主色 + 配色 + 中性色 + 1 个点缀），可爱但不幼稚（avoid baby aesthetic），完整 character sheet 4 视角 + 5 表情 + 配饰分离，背景透明，Kurzgesagt 同款风格。
```

**Remotion 实现要点**：

```tsx
// 分层 plane + 镜头驱动深度感（参考用户已有的 _flat.html 思路升级版）
<AbsoluteFill>
  <Layer z={-3}><Background /></Layer>           {/* 远景 */}
  <Layer z={-1}><PropsScattered /></Layer>       {/* 中景道具 */}
  <Layer z={0}><CatDirectorChibi
    expression={currentExpression}                {/* happy/thinking/surprised */}
    view={currentView}                            {/* front/side/3q */}
    mouthFrame={mouthSyncFrame}                   {/* 嘴动 */}
  /></Layer>                                      {/* 主角 */}
  <Layer z={2}><ForegroundProp /></Layer>        {/* 前景道具，制造深度 */}
</AbsoluteFill>

// 用 useCurrentFrame 驱动每层的 translateZ/scale 模拟镜头推进
```

**关键**：chibi 不像 PPT 的关键不在角色本身，**在镜头**——多平面摄像机模拟、推/拉/摇/移、前景遮挡。这是 Kurzgesagt 和 PPT 的分水岭。

**不适合**：需要严肃质感的硬核技术话题、proof 重的截图场景。

---

## 画面语言 3: manim_math_animation（数学动画）

**视觉特征**：黑色背景、白色或荧光色几何图形、平滑数学过渡（莫比乌斯/拓扑形变）、清晰公式、点线面的舞蹈、配音独白节奏。

**参考创作者**：

- **3Blue1Brown**（Grant Sanderson，主力）
- Mathologer
- Numberphile（部分）

**适配 analogy 套路**：

- 套路 5 流程化（数学版）
- 套路 9 数据可视化（高级版）
- 套路 3 横截面的数学版

**asset_kind 路由**：`remotion_dataviz`（**不用 imagegen，用 Remotion 程序绘制**）

**generation_prompt 风格关键词**：N/A（程序生成不用 imagegen）

**Remotion 实现要点**：

```tsx
// 程序化绘制几何 + 平滑动画
<AbsoluteFill style={{ background: '#0a0a0a' }}>
  {/* 用 SVG 或 react-three/drei 画几何 */}
  <svg viewBox="0 0 1000 1000">
    <circle
      cx={interpolate(frame, [0, 60], [200, 500])}
      cy={500}
      r={50}
      fill="#3b82f6"
    />
    {/* 关键：用 interpolate + spring 让动画平滑，不要瞬切 */}
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      strokeDasharray="1000"
      strokeDashoffset={interpolate(frame, [30, 90], [1000, 0])}
      stroke="#fff"
    />
  </svg>
  <FormulaTeX>{currentFormula}</FormulaTeX>
</AbsoluteFill>
```

**关键**：manim 风的精髓是**形变过程本身就是论证**——一个公式 morph 到另一个公式，告诉观众"它们是等价的"。不是放静态公式 + 字幕念。

**不适合**：日常生活话题、人物故事。AI 科普讲到原理时（如"什么是 attention 机制"）适合。

---

## 画面语言 4: vox_style_infographic（Vox 信息图）

**视觉特征**：高对比配色（亮色背景 + 深色文字 / 反之）、清晰的图标 + 数据 + 简短标签、横向叙事流（左到右）、动态切换、新闻感与权威感并存。

**参考创作者**：

- **Vox**（特别是 Explained 系列、Borders 系列）
- 央视新闻可视化栏目
- 部分 The Verge 解释视频

**适配 analogy 套路**：

- 套路 5 流程化（新闻感版）
- 套路 9 数据可视化（带情绪）
- 套路 7 历史对比（时间轴版）

**asset_kind 路由**：`infographic_svg` 或 `remotion_dataviz`

**generation_prompt 风格关键词**（如果要 imagegen 出辅助图标）：

```
扁平图标设计 flat icon design，单色或双色，简洁几何形状，避免具体写实细节，类似 Material Icons / Heroicons 风格，可作为信息图组件嵌入更大画面。
```

**Remotion 实现要点**：

```tsx
// 信息图横向时间轴 + 数据卡 + 图标
<AbsoluteFill style={{ background: '#fef3c7' /* 暖背景 */ }}>
  <Timeline>
    {events.map((event, i) => (
      <TimelineNode
        key={event.id}
        enterAt={i * 30}
        x={i * 200 + 100}
        icon={event.icon}      {/* 来自 imagegen 出的图标 / Heroicons */}
        label={event.label}
        dataPoint={event.value}
      />
    ))}
  </Timeline>
</AbsoluteFill>
```

**关键**：Vox 风的不像 PPT，在于**配色和节奏**——亮色背景 + 强对比文字（突破"AI 科普必须暗背景"的默认），节奏紧凑（每秒一个新信息），但每条信息都有数据/图标/标签三件套。

**不适合**：纯感性话题、抽象哲思类。

---

## 画面语言 5: physical_macro_photography（实物特写摄影）

**视觉特征**：真实物件的极近距离照片、自然光、浅景深、可见材质纹理（金属/木/纸/塑料）、有重量感、不完美（划痕、灰尘）。

**参考创作者**：

- **回形针 PaperClip**（物理论证主力）
- 影视飓风（部分实物对比镜头）
- 《Wired》/《MIT Technology Review》技术摄影

**适配 analogy 套路**：

- 套路 4 比例缩放（一颗米对照）
- 套路 8 物理类比（真实仪器特写）
- 套路 10 录屏标注的物理版

**asset_kind 路由**：`stock_photo_annotated`（最佳）或 `imagegen_2d`（次选，因为 imagegen 生成的"实物照"质感比真实图差）

**采集策略**：

1. 优先用 **真实图库 / 商用可用素材源**：Unsplash / Pexels / Pixabay / Mixkit / Coverr / 影视飓风素材库等都必须按官方许可页或具体素材页逐条确认；不要把它们笼统写成 CC0。公开视频素材走 [commercial-video-footage-scout.md](../../xingchen-next/references/commercial-video-footage-scout.md)，静态/3D/纹理资产走 [visual-asset-library-governance.md](../../xingchen-next/references/visual-asset-library-governance.md)。
2. 次选用 **imagegen 生成"摄影风"**：要写明 photorealistic, macro photography, shallow depth of field, natural lighting
3. 实在没有再 imagegen 出手绘风（降级到画面语言 1）

**generation_prompt 风格关键词**（imagegen 备选时）：

```
极近距离 macro photography, 一个【具体物件】特写，自然光从【方向】打来，浅景深背景虚化，可见材质纹理（如金属反光、木纹、纸质纤维），有真实物件的不完美痕迹（轻微划痕、灰尘），无 logo，构图简洁，色调克制。
```

**Remotion 实现要点**：

```tsx
// 实物图全屏 + Remotion 标注覆盖
<AbsoluteFill>
  <Img src={macroPhotoUrl} style={{ objectFit: 'cover' }} />

  {/* 用 Remotion 在图上叠加圆圈高亮 + 箭头标注 */}
  <AnnotationOverlay enterAt={20}>
    <Circle cx={highlightX} cy={highlightY} r={80}
      stroke="#ef4444" strokeWidth={4} fill="transparent" />
    <Arrow from={[labelX, labelY]} to={[highlightX, highlightY]} />
    <Label x={labelX} y={labelY}>{annotationText}</Label>
  </AnnotationOverlay>
</AbsoluteFill>
```

**关键**：实物特写 + 程序化标注 = 回形针的另一个招牌。**实物图保留真实质感，标注用手绘风（不是 dashboard UI 风的 tooltip）**。

**不适合**：抽象软件话题（找不到对应实物）、纯人物心理话题。

---

## 画面语言 6: screen_recording_overlay（屏幕录制 + 标注）

**视觉特征**：真实软件 UI 录屏（不是模仿 UI 的 mockup）、跟随用户操作的真实节奏、Remotion 程序化覆盖（圈红/箭头/高亮/对话框）、字幕承担解释。

**参考创作者**：

- **何同学**（数码评测 + 工具演示）
- **影视飓风**（教学视频）
- LinusTechTips（部分软件演示）
- People Make Games

**适配 analogy 套路**：

- 套路 10 录屏标注（主力）
- 套路 6 对照实验（两个软件并排录屏）

**asset_kind 路由**：`screen_recording_annotated`

**采集策略**：

1. **必须用户提供录屏**——AI 不能生成"假录屏"
2. AI 在 visual-compiler 阶段：解析录屏时长 + 用户的操作节奏，决定何时叠加什么标注
3. 标注**只在关键操作时刻出现**（voiceover 说"看这里"时），其它时间录屏纯净显示

**generation_prompt 风格关键词**：N/A（录屏不是 imagegen 生成）

**Remotion 实现要点**：

```tsx
<AbsoluteFill>
  <Video src={recordingUrl} />

  {/* 在 voiceover 关键时刻叠加标注 */}
  {keyMoments.map(moment => (
    <Sequence key={moment.id} from={moment.frame} durationInFrames={45}>
      <AbsoluteFill>
        <ZoomToRegion region={moment.uiRegion} duration={20}>
          {/* 镜头放大到 UI 局部 */}
        </ZoomToRegion>
        <CircleHighlight at={moment.uiCenter} r={80} color="#ef4444" />
        <ArrowFromTo from={moment.labelPos} to={moment.uiCenter} />
        <Callout at={moment.labelPos}>{moment.text}</Callout>
      </AbsoluteFill>
    </Sequence>
  ))}
</AbsoluteFill>
```

**关键**：标注**要手绘感**（不要用 Tailwind 默认的 alert/toast 组件——那是 dashboard UI 语言）。可以用 SVG 画带轻微抖动的圈红、用毛笔笔触感的箭头。

**不适合**：抽象概念讲解（没有可演示的真实操作）。

---

## 画面语言 7: hunyuan3d_product_showcase（3D 物件展示）

**视觉特征**：单个 3D 物件居中、棚拍布光、360° 旋转或缓慢 orbit、纯色或低饱和背景、有材质（金属/塑料/玻璃）、Apple 发布会式的产品质感。

**参考创作者**：

- Apple Keynote（产品 reveal 镜头）
- Wired 产品评测 3D 镜头
- 部分 Vox / Verge 视频的关键道具展示

**适配 analogy 套路**：

- 套路 2 拟物化（3D 道具版）
- 套路 8 物理类比（用 3D 仪器代替剖面图）

**asset_kind 路由**：`hunyuan3d_mesh`

**采集策略**：

1. AI 写 imagegen prompt 出物件 character sheet（4 视角）
2. 走 ComfyUI Hunyuan3D-2mv workflow 生成 .glb
3. Visual-compiler 用 `@remotion/three` + `@react-three/drei` 的 `useGLTF` 加载
4. 镜头围绕物件 orbit / 推拉

**generation_prompt 风格关键词**（生成 character sheet 阶段）：

```
等距 4 视角（front/side/back/3-quarter）character sheet，一个【具体物件：复古调音台 / 木质书本 / 黄铜望远镜】，简洁几何造型，无品牌 logo，纯色背景（白或浅灰），统一光照（避免单视角的强光影），适合 Hunyuan3D-2mv 多视角 mesh 生成。
```

**Remotion 实现要点**：

```tsx
import { ThreeCanvas, useVideoConfig } from '@remotion/three';
import { useGLTF } from '@react-three/drei';

const Scene = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { scene } = useGLTF('/assets/hunyuan-prop.glb');

  // 镜头围绕物件 orbit，由 frame 驱动（不是 useFrame，要确定性）
  const angle = (frame / 90) * Math.PI;  // 3 秒一圈

  return (
    <ThreeCanvas width={width} height={height}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <primitive object={scene} />
      <PerspectiveCamera
        position={[Math.cos(angle) * 5, 2, Math.sin(angle) * 5]}
        lookAt={[0, 0, 0]}
      />
    </ThreeCanvas>
  );
};
```

**关键**：3D 展示**不要变成游戏画面**——光线要克制（不是 fantasy lighting），物件造型要简洁（不要 hyper-detailed mesh），镜头要慢（orbit 不超过 0.5°/frame）。

**不适合**：chibi 角色（用画面语言 2）、概念图（用画面语言 1 剖面图更合适）、proof 重的截图。

---

## 画面语言 8: dramatic_character_panels（拟人剧情分镜）

**视觉特征**：分镜漫画风、人物有夸张情绪、对话气泡、连续画面讲一个微剧情、配音夸张戏剧化。

**参考创作者**：

- **小约翰可汗**（PPT 风但靠剧情戏剧化）
- 半佛仙人（部分拟人段落）
- 老田家的张老板（视频化讲段子）

**适配 analogy 套路**：

- 套路 1 拟人化（剧情版）
- 套路 7 历史对比（古今人物对话）
- 套路 6 对照实验（角色 A 演示错误用法 vs 角色 B 演示正确用法）

**asset_kind 路由**：`imagegen_2d`（多张分镜）

**generation_prompt 风格关键词**：

```
漫画分镜风格，4 格或 6 格 panel layout，每格一个【人物 + 动作 + 表情】，对话气泡内有【简短台词】，黑白线稿为主 + 少量平涂色块，参考新海诚剧情分镜 / 日漫四格 / 中国新闻漫画风格，no manga eye sparkle, no excessive shading, no anime sexualization.
```

**Remotion 实现要点**：

```tsx
// 分镜逐格 reveal + 缩放到当前活动 panel
<AbsoluteFill>
  <ComicLayout grid="2x2">
    {panels.map((panel, i) => (
      <Panel
        key={i}
        active={frame >= panel.enterFrame}
        scale={frame >= panel.zoomFrame ? 1.6 : 1.0}
        imageUrl={panel.imageUrl}
      />
    ))}
  </ComicLayout>
</AbsoluteFill>
```

**关键**：剧情分镜不是"按顺序播 4 张图"——是**视点跟着剧情走**，镜头放大到当前对话的 panel、字幕节奏跟人物对话节奏。

**不适合**：纯理论讲解、proof-重的技术演示。

---

## 画面语言 9: retro_instrument_panel（复古仪表盘 / 物理装置）

**视觉特征**：黄铜/木质/绝缘材质、模拟刻度、机械滑块旋钮、indicator lights（不是 LED 是真灯泡）、有怀旧仪器质感。

**参考创作者**：

- 部分 3Blue1Brown 物理动画
- Wikipedia 物理仪器插画
- 早期工业设计图

**适配 analogy 套路**：

- 套路 8 物理类比（主力）
- 套路 9 数据可视化的复古版（用旧仪表盘代替 dashboard）

**asset_kind 路由**：`imagegen_2d` 或 `hunyuan3d_mesh`

**generation_prompt 风格关键词**：

```
复古工业仪器风格，正面视角，一个【调音台 / 收音机 / 老示波器 / 蒸汽朋克控制台】，黄铜 + 木质材质，模拟刻度盘 + 滑块旋钮，indicator 是真灯泡不是 LED，材质有岁月感，参考 1950s vintage analog instrument，no LED screen, no dashboard UI, no digital display, no neon.
```

**Remotion 实现要点**：

```tsx
// 仪表盘全屏 + 镜头推进到一个旋钮 + 旋钮指针动画
<AbsoluteFill>
  <Img src={instrumentPanelUrl} />

  {/* 用 Remotion 让其中一个旋钮的指针转动（程序化叠加 SVG 指针） */}
  <SvgOverlay>
    <line
      x1={knobCenterX} y1={knobCenterY}
      x2={knobCenterX + Math.cos(angle) * 30}
      y2={knobCenterY + Math.sin(angle) * 30}
      stroke="#000" strokeWidth={3}
    />
  </SvgOverlay>
</AbsoluteFill>
```

**关键**：复古仪表盘**不是为了怀旧而怀旧**——是为了**用一个具象物理装置代替抽象数字**（模型温度 = 收音机调谐旋钮 / 神经网络权重 = 调音台滑块）。

**不适合**：现代软件话题（用画面语言 6 录屏更合适）。

---

## 画面语言 10: scale_stack_visualization（比例堆积可视化）

**视觉特征**：一个小物件对照巨型堆积、可数（不是模糊的"很多"）、有重量感、可对比（具体数字 vs 具体堆积）。

**参考创作者**：

- 回形针（比例论证主力）
- Vox 数据可视化
- BBC Earth（讲生物数量时）

**适配 analogy 套路**：

- 套路 4 比例缩放（主力）
- 套路 9 数据可视化的实物版

**asset_kind 路由**：`imagegen_2d` + `remotion_dataviz`（混合）

**generation_prompt 风格关键词**（堆积主体图）：

```
对比构图：左侧一个【小日常物：一颗米 / 一秒 / 一本书】，右侧巨型【同物件堆积 / 拉长 / 排列】，背景简洁，标注【1 vs N】用手写体而非数字 UI，整体回形针比例对照图风。
```

**Remotion 实现要点**：

```tsx
// 左侧小物件先入画 + 右侧堆积逐步累加 + 计数器同步跳动
<AbsoluteFill>
  <SmallReference x={120} y={500}
    imageUrl={smallItemUrl}
    label="1 个"
  />

  {/* 程序化堆积：N 个图标按 grid 排列，每帧多入画一些 */}
  <BigStack
    x={500} y={200}
    imageUrl={smallItemUrl}
    countShown={Math.floor(interpolate(frame, [0, 90], [0, totalCount]))}
    totalCount={totalCount}
  />

  <BigCounter
    x={1700} y={500}
    value={Math.floor(interpolate(frame, [0, 90], [0, totalCount]))}
    label={`${unitName} 个`}
  />
</AbsoluteFill>
```

**关键**：堆积要**可数**——观众能数到"哦这是 1000 个"而不是看到"很多很多"。imagegen 出整图后用 Remotion 在上面程序化叠加计数器同步增长，让"数字"和"视觉"同时增长。

**不适合**：定性话题（没有数字对照）。

---

## 画面语言匹配速查表

| `concrete_execution_plan.asset_kind` | 画面语言 | 套路适配 |
|---|---|---|
| `imagegen_2d` | 1 剖面 / 5 实物特写 / 8 分镜 / 9 仪表盘 / 10 比例堆积 | 套路 1-10 全部 |
| `hunyuan3d_mesh` | 7 3D 展示 / 9 仪表盘 3D 版 | 套路 2, 8 |
| `comfyui_workflow` | 自定义（用户高级用法） | - |
| `remotion_dataviz` | 3 manim / 4 Vox 信息图 | 套路 5, 9 |
| `screen_recording_annotated` | 6 录屏标注 | 套路 10 |
| `infographic_svg` | 4 Vox 信息图 | 套路 5, 9 |
| `chibi_layered` | 2 chibi 分层 | 套路 1, 6, 7 |
| `stock_photo_annotated` | 5 实物特写 | 套路 4, 8, 10 |
| `mixed_compose` | 多种组合 | 复杂场景 |

---

## visual-compiler 在编译时怎么用本文档

1. 读 `scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan.asset_kind`
2. 查上面匹配速查表，定位本场画面语言
3. 读对应画面语言的"Remotion 实现要点"代码模板
4. 写 React 组件时**直接采用模板结构 + 替换具体 props**（imageUrl / x / y / 内容）
5. 如果 director-board 的 `generation_prompt` 没写风格 reference，从本画面语言的"generation_prompt 风格关键词"块**追加到 prompt 末尾**
6. 调对应素材生成 skill（imagegen / comfyui_hunyuan3d）真的生成素材
7. 把生成出来的素材路径写回 `analogy_pass.concrete_execution_plan.asset_realized_paths`
8. 在 React 组件里 import 该素材

**反模式**：

- 同一支视频 10 个 scene 全用画面语言 2（chibi）——违反 `INV-MONOTONY-CHECK`
- 选了 `imagegen_2d` 但没指定画面语言（1/5/8/9/10 中的一个）——会出来 SDXL 默认风（塑料 AI 味）
- 把画面语言 3（manim）的 `asset_kind` 写成 `imagegen_2d`——manim 必须程序生成
- 把画面语言 6（录屏）当成"AI 生成假录屏"——录屏必须用户真实提供
- 画面语言 7（3D 展示）的 Hunyuan3D mesh 没经过 lookdev gate 就 ship——参考 `comfyui-3d-asset-lane.md` 的 lookdev 要求
