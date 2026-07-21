# Shot Library

Single source of truth for the **shot components** that `xingchen-visual-compiler` may pick into `chrome_components` for any render-bound scene.

The library lives at `../../remotion-render-adapter/templates/director-motion-kernel/src` and ships with the Remotion render kernel. Any scene whose `chrome_components[*]` references a name not in this catalog is invalid (visual-compiler must reject or raise `kit-extension-request`).

`renderer_family` and `actual_renderer_family` enums are authored in [renderer-families.md](../../xingchen-next/references/renderer-families.md). This file authors **shot names** — finer-grained than renderer family, the actual React component a scene compiles into.

## Dispatch model

A scene's component is chosen by SceneRenderer.tsx in this priority order (first match wins):

1. `scene.scene_kind === "immersive-bg"` + `primarySrc` → `LookdevBoardScene`
2. `sceneIndex === 0` + `scene.visual_strategy === "hook-opener"` → `HookOpener`
3. `scene.visual_strategy === "auto-diagram"` + no structured infographic anchor → `RemotionDemo`
4. `primarySrc` + not a `generatedPremiumStrategy` → `AssetScene` (uses `DeviceFrame` + `HighlightedHeadline`)
5. fallback → `TextScene` → `VisualAnchorBlock` (which dispatches by `visual_anchor.type`)

`generatedPremiumStrategies` = `{icon-driven, auto-code, auto-metric, kinetic-text}` — these go to `TextScene`, not `AssetScene`, even when an asset exists.

`VisualAnchorBlock` dispatches by `visual_anchor.type`:

| `visual_anchor.type` | Component | Use when |
|---|---|---|
| `icon` | IconOrbit | concept ecosystem, "AI tools landscape" |
| `terminal` | TerminalBlock | shell / code execution proof |
| `counter` | AnimatedCounter | single big number / stat shot |
| `progress` | inline progress bar | percent reveal |
| `flowchart` | AnimatedFlowChart | 2–5 step process |
| `comparison` | ComparisonPanel | 传统 vs AI 对比 |
| `architecture` | ArchitectureDiagram | system / pipeline layers |
| `timeline` | TimelineStrip | time-based sequence |
| `quote` (or fallback) | inline quote card | spoken quote |
| `quote-paper` | **PaperQuote** *(new)* | 论文段落引文 + 词级高亮 |
| `formula` | **FormulaReveal** *(new)* | 公式逐项推导(KaTeX) |
| `embedding` | **EmbeddingScatter** *(new)* | 2D embedding 散点 + 高亮 |
| `attention` | **AttentionHeatmap** *(new)* | token-to-token 热力图 |
| `loss-curve` | **LossCurveScrub** *(new)* | 训练 loss 曲线 scrub 揭示 |
| `prompt-flow` | **PromptToOutput** *(new)* | prompt → token 流式输出 |
| `network-graph` | **NetworkGraphBuild** *(new)* | 节点/边增量构建 |
| `chart-line` | **ChartLineReveal** *(new)* | 通用折线/柱状图项目揭示 |
| `ai-video-plate` | **AIVideoPlate** *(new)* | Seedance/API generated video plate under Remotion overlays |

## Knowledge Continuity Transition Primitives

These primitives are the allowed compile targets for `visual.director_board.scene_edge_boards[].transition_method`. They are for knowledge-blogger continuity: the handle may be a keyword, number, proof region, diagram axis, subtitle phrase, voice beat, or concept state. It does not need to be a physical prop.

If the current Remotion kernel or HTML/canvas route cannot implement the selected primitive, `xingchen-visual-compiler` must generate `kit-extension-request.md` instead of silently replacing it with a fade.

| Director board method | Primitive | Use when |
|---|---|---|
| `keyword_relay` | `KeywordRelay` | A highlighted term exits one scene and becomes the next scene's title, label, or anchor. |
| `proof_region_relay` | `ProofRegionRelay` | A readable proof area, chart area, or screenshot crop keeps its spatial identity across the cut. |
| `diagram_morph` | `DiagramMorph` | A simple structure evolves: list to flow, point to axis, card to chart, proof mark to diagram node. |
| `scale_shift` | `ScaleShiftBridge` | The argument changes scale: detail to system, case to map, local metric to full model. |
| `axis_handoff` | `AxisHandoff` | A line, arrow, timeline, or chart axis carries the viewer's eye into the next frame. |
| `question_answer_cut` | `QuestionAnswerCut` | One scene ends as a clear question and the next begins as its visual answer. |
| `color_logic_cut` | `ColorLogicCut` | Color continuity marks logic state, not decoration: warning to resolution, unknown to proven, local to global. |
| `subtitle_to_visual` | `SubtitleToVisualBridge` | A spoken/subtitled phrase becomes the next frame's visual object or proof region. |
| `hard_cut` | `HardCut` | The edge deliberately creates contrast, but the board still names the knowledge reason and cut moment. |
| `breath_cut` | `BreathCut` | A short pause lets a dense proof settle before the next idea starts. |

## Existing shots (19)

### HookOpener — `src/components/HookOpener.tsx`
- **Props**: `{headline, bullets[], accent, backgroundSrc?, textSafeArea?, compositionMode?, durationFrames, designLanguage}`
- **Job**: hook / build-up. Full-screen scene-0 opener with orbit ring + staggered hero text + floating proof card.
- **Motion verbs**: drift, pulse, reveal, lock-on
- **Dispatch**: `sceneIndex === 0 && visual_strategy === "hook-opener"`
- **AI 科普 fit**: 5 — first frame of every Douyin video; orbit ring + big headline = instant hook signal.

### BeatBackground — `src/components/BeatBackground.tsx`
- **Props**: `{beat, accent, frame, backgroundFamily?}`
- **Job**: infrastructure (lives behind every scene).
- **Motion verbs**: drift, scan
- **Background families**: `atmospheric-grid | studio-halo | proof-slate | contrast-vignette | warm-resolve`
- **AI 科普 fit**: 5 — never opt out; swap family per beat for mood.

### AnimatedCounter — `src/components/AnimatedCounter.tsx`
- **Props**: `{value, label, prefix?, frame, fps, accent, designLanguage}`
- **Job**: data / proof / payoff. Spring-eased big number with ghost-number depth.
- **Motion verbs**: type, pulse
- **Dispatch**: `visual_anchor.type === "counter"`
- **AI 科普 fit**: 5 — "X 倍速度提升" / "Y 个参数" / "Z 倍效果" stat shots are core.

### AnimatedFlowChart — `src/components/AnimatedFlowChart.tsx`
- **Props**: `{steps[], activeStep?, accent, frame, fps, direction?, designLanguage}`
- **Job**: explain / build-up / transition. Staggered step cards with grow-in connectors; active step glows.
- **Motion verbs**: stack, reveal
- **Dispatch**: `visual_anchor.type === "flowchart"`
- **AI 科普 fit**: 5 — "3-step process" is the universal explainer pattern. Active step can sync to caption cues.
- **Limit**: 5 horizontal / 6 vertical.

### ArchitectureDiagram — `src/components/ArchitectureDiagram.tsx`
- **Props**: `{layers[], connections?[], accent, frame, fps, designLanguage}`
- **Job**: explain / data / proof. Layered stack with chip pills and connector dots; staggered reveal.
- **Motion verbs**: stack, reveal
- **Dispatch**: `visual_anchor.type === "architecture"`
- **AI 科普 fit**: 4 — good for "transformer 架构 / pipeline 分层" but less visceral than counter/flowchart.
- **Limit**: 5 layers, 6 items per layer.

### ComparisonPanel — `src/components/ComparisonPanel.tsx`
- **Props**: `{left{label,items,tone}, right{label,items,tone}, accent, frame, fps, designLanguage}`
- **Job**: contrast / proof. Two-column before/after; left amber-warm (negative), right accent (positive).
- **Motion verbs**: crack, reveal
- **Dispatch**: `visual_anchor.type === "comparison"`
- **AI 科普 fit**: 5 — "传统方法 vs AI 方法" is the signature contrast.
- **Limit**: 4 items per column.

### DeviceFrame — `src/components/DeviceFrame.tsx`
- **Props**: `{type: "terminal"|"browser"|"phone"|"vscode"|"none", children}`
- **Job**: proof. Static chrome wrapper for screenshots / UI captures.
- **Motion verbs**: (none — pure container)
- **AI 科普 fit**: 4 — wrap proof screenshots; `vscode` and `terminal` framings are most relevant.

### HighlightedHeadline — `src/components/HighlightedHeadline.tsx`
- **Props**: `{text, highlights[], accent}`
- **Job**: utility (used in every text-heavy scene). Greedy longest-match keyword highlighting.
- **Motion verbs**: (none — pure render util)
- **AI 科普 fit**: 5 — accent-color keyword emphasis is critical for Douyin readability at 1.5–2× playback.

### IconOrbit — `src/components/IconOrbit.tsx`
- **Props**: `{icons[], accent, frame, fps, designLanguage}`
- **Job**: explain / hook / build-up. Icon labels orbit central "core" on glowing ring with radial connectors.
- **Motion verbs**: drift, lock-on, pulse
- **Dispatch**: `visual_anchor.type === "icon"`
- **AI 科普 fit**: 4 — "AI ecosystem" / "tools landscape"; icons are plain text strings.

### LookdevBoardScene — `src/components/LookdevBoardScene.tsx`
- **Props**: `{scene, src, accent, designLanguage, boardMotion?}`
- **Job**: proof / explain / hook. Full-bleed immersive scene with sweep light + camera-beat-driven push/drift/focus-punch + optional `BoardMotionOverlay`.
- **Motion verbs**: drift, scan, lock-on, push
- **Dispatch**: `scene_kind === "immersive-bg"` + `primarySrc`
- **AI 科普 fit**: 4 — high production; needs a great screenshot/board asset.

### BoardMotionOverlay — `src/components/BoardMotionOverlay.tsx`
- **Props**: `{motion: BoardMotion, accent}`
- **Job**: proof / explain / data. Animates `focus_regions`, `modules`, `connectors` (SVG draw-on / flow / pulse), and `glyph_groups` over a board image.
- **Motion verbs**: reveal, pulse, drift, scan, stack
- **AI 科普 fit**: 4 — sophisticated; requires pre-authored `BoardMotion` JSON; overkill for simple shots.

### NarrativeProgress — `src/components/NarrativeProgress.tsx`
- **Props**: `{currentScene, totalScenes, progress, beatColors[], accent}`
- **Job**: transition / closing. Bottom-of-screen segmented progress bar across all scenes.
- **Motion verbs**: (driven externally)
- **AI 科普 fit**: 3 — series feel; subtle enough to leave on by default.

### TerminalBlock — `src/components/TerminalBlock.tsx`
- **Props**: `{lines[], frame, fps, accent, designLanguage}`
- **Job**: proof / explain. macOS terminal chrome + per-line typewriter.
- **Motion verbs**: type, reveal
- **Dispatch**: `visual_anchor.type === "terminal"`
- **AI 科普 fit**: 5 — shell commands / CLI tool execution is core proof content.

### TimelineStrip — `src/components/TimelineStrip.tsx`
- **Props**: `{events[{time, label, status}], accent, frame, fps, designLanguage}`
- **Job**: explain / build-up / data. Horizontal time-stamped events; `current` pulses, `future` dashed.
- **Motion verbs**: stack, pulse, reveal
- **Dispatch**: `visual_anchor.type === "timeline"`
- **AI 科普 fit**: 4 — "AI development timeline" / "release sequence".
- **Limit**: 5 events.

### RemotionDemo — `src/components/RemotionDemo.tsx`
- **Props**: `{headline, bullets[], accent, durationFrames, assetSrc?, designLanguage}`
- **Job**: explain / build-up. "Focus / system map" headline + bullets + 4-step pipeline below.
- **Motion verbs**: reveal, stack
- **Dispatch**: `visual_strategy === "auto-diagram"` + no structured infographic anchor
- **AI 科普 fit**: 3 — currently hardcoded "Director flow" steps; repurposable but content-bound.

### SceneCallback — `src/components/SceneCallback.tsx`
- **Props**: `{callback, targetScene, localFrame, accent}`
- **Job**: transition / hook. Timed floating PiP referencing another scene.
- **Motion verbs**: reveal, collapse
- **AI 科普 fit**: 3 — narrative callbacks are advanced; useful for longer episodes.

### ClosingScene — `src/components/ClosingScene.tsx`
- **Props**: `{seriesConfig, accent?, designLanguage?}`
- **Job**: closing / payoff. Full closing card with follow-CTA, episode info, optional QR/avatar/logo, brand palette.
- **Motion verbs**: reveal, pulse
- **Templates**: `minimal | qr-focus | text-first | text-left`
- **AI 科普 fit**: 5 — every episode needs this; `SeriesConfig` drives all brand customization.

### CoverFrame *(standalone)* — `src/standalone/CoverFrame.tsx`
- **Props**: `DirectorVideoProps` (full)
- **Job**: hook (cover thumbnail — rendered as still, not a video scene). Picks best scene image, places title + episode label, brand badge, bullet chips.
- **Motion verbs**: (none — static composition)
- **Selection**: prefers `ai_image_brief.enabled` scene → `hook-opener` → first scene with asset.
- **AI 科普 fit**: 5 — Douyin first-frame / 封面 is the primary CTR driver.

### TechEffectOpener *(standalone)* — `src/standalone/TechEffectOpener.tsx`
- **Props**: `{designLanguage?}`
- **Job**: hook / build-up. Animated intro sting: 3 rotating SVG rings + orbital pulse dots + glass shards + flash burst (premium mode).
- **Motion verbs**: drift, pulse, reveal, whip, crack
- **AI 科普 fit**: 4 — spectacular self-contained opener sting using `@remotion/paths` and `@remotion/shapes`.

## Planned new shots (Phase B — AI 科普 specific)

These are NOT YET BUILT. When `xingchen-visual-compiler` writes a `chrome_components` reference to one of these, the project must be at a Phase-B-ready state.

### PaperQuote
- **Anchor**: `visual_anchor.type === "quote-paper"`
- **Props**: `{quote, source: {title, authors[], year, venue?, url?}, highlights[], accent, frame, fps, designLanguage}`
- **Job**: proof / explain. Renders an arxiv-style quote block with title + author + year + url, with word-level highlight reveal sequenced over time.
- **Motion verbs**: type, reveal, pulse
- **AI 科普 fit**: 5 — every AI 科普 video引用论文,this shot eliminates copy-paste motion design per scene.

### FormulaReveal
- **Anchor**: `visual_anchor.type === "formula"`
- **Props**: `{steps[{tex, annotation?, highlight_tokens?[]}], accent, frame, fps, designLanguage}`
- **Job**: explain / proof. KaTeX-rendered LaTeX, step-by-step (Manim derivation style); each step appears, optional annotation arrow, optional highlight on selected tokens.
- **Motion verbs**: stack, reveal, pulse
- **Dependencies**: KaTeX (added to package.json)
- **AI 科普 fit**: 5 — softmax / attention / loss / scaling derivations are core 技术原理 content.

### EmbeddingScatter
- **Anchor**: `visual_anchor.type === "embedding"`
- **Props**: `{points[{x,y,label,cluster?}], highlights[], accent, frame, fps, designLanguage}`
- **Job**: explain / data. 2D scatter of embedding points (typically t-SNE/UMAP-style), with optional cluster coloring and per-point label reveal on highlighted points.
- **Motion verbs**: drift, lock-on, reveal
- **AI 科普 fit**: 5 — "embedding 把语义空间打开" is one of the most replayed AI 科普 metaphors.

### AttentionHeatmap
- **Anchor**: `visual_anchor.type === "attention"`
- **Props**: `{tokens[], matrix[][] (square), highlight_pairs?[{from,to}], accent, frame, fps, designLanguage}`
- **Job**: explain / proof. Token×token grid heatmap; cells color-coded by attention weight; optional sequenced highlight on selected `(from, to)` pairs.
- **Motion verbs**: scan, lock-on, pulse
- **AI 科普 fit**: 5 — Transformer / Attention 直观化是入门必讲题目.

### LossCurveScrub
- **Anchor**: `visual_anchor.type === "loss-curve"`
- **Props**: `{series[{name, points[{step, value}]}], annotations[{step, label}], accent, frame, fps, designLanguage}`
- **Job**: data / proof. Loss / accuracy curves scrub-revealed left-to-right; annotations land at marked steps.
- **Motion verbs**: type (line draw), reveal, lock-on (annotation arrival)
- **AI 科普 fit**: 5 — scaling laws / training dynamics 必备.

### PromptToOutput
- **Anchor**: `visual_anchor.type === "prompt-flow"`
- **Props**: `{prompt, output_tokens[], accent, frame, fps, designLanguage}`
- **Job**: explain / proof. Prompt input box → token-stream output animation, character-by-character.
- **Motion verbs**: type, reveal
- **AI 科普 fit**: 5 — most direct visual metaphor for LLM behavior.

### NetworkGraphBuild
- **Anchor**: `visual_anchor.type === "network-graph"`
- **Props**: `{nodes[{id, label, x, y, group?}], edges[{from, to, weight?}], reveal_order?[], accent, frame, fps, designLanguage}`
- **Job**: explain / build-up. Network/knowledge graph: nodes appear first then edges draw on, optionally per `reveal_order`.
- **Motion verbs**: stack, reveal, drift (post-build)
- **AI 科普 fit**: 4 — agent system / 知识图谱 / multi-agent topology.

### ChartLineReveal
- **Anchor**: `visual_anchor.type === "chart-line"`
- **Props**: `{series[{name, points[{x, y}], color?}], x_label?, y_label?, highlights[{x, label}], accent, frame, fps, designLanguage}`
- **Job**: data. Generic line/bar chart with item-by-item reveal and highlight callouts.
- **Motion verbs**: stack, reveal, lock-on
- **AI 科普 fit**: 4 — universal data viz; complement to LossCurveScrub when not training-specific.

### AIVideoPlate
- **Anchor**: `visual_anchor.type === "ai-video-plate"`
- **Props**: `{candidateId, src, fit: "cover"|"contain", crop?, opacity?, proofExclusionPolicy, remotionOverlayPlan, frame, fps, designLanguage}`
- **Job**: concept / atmosphere / transition support. Mounts an approved Seedance/API generated video only as a muted background or midground `video_plate` while Remotion owns proof overlays, subtitles, timing, and final export.
- **Motion verbs**: drift, hold, reveal
- **AI 科普 fit**: 3 — useful for abstract concept-motion gaps; invalid for hero proof, UI evidence, readable claims, subtitles, logos, or faces.
- **Route rule**: prompt-only stage uses `render.ai_video_prompt_requests[]` and `ai_video_prompt_request_ids[]`; final/render stage requires `render.ai_video_candidates[]`, `ai_video_candidate_ids[]`, `motion_source: "ai_video_generation"`, and `integration_mode: "video_plate"`.

## ReactBits-derived planned extension candidates

These are NOT BUILT in the current Remotion kernel. They are allowed names for `component_registry_plan[]`, director-board extension planning, or `kit-extension-request.md` only. If `xingchen-visual-compiler` writes one into `chrome_components[]` before the component exists, render validation must fail or the compiler must select an existing fallback.

Use [reactbits-remotion-upgrade.md](./reactbits-remotion-upgrade.md) for source-component mapping and Remotion adaptation rules.

### KineticKeywordReveal
- **Anchor**: `visual_anchor.type === "kinetic-keyword"`
- **ReactBits references**: `SplitText`, `BlurText`, `DecryptedText`, `ScrambledText`, `GlitchText`, `ShinyText`, `GradientText`
- **Props**: `{text, keywords[], mode, frame, fps, durationFrames, accent, safeRegion, designLanguage}`
- **Job**: hook / explain / payoff. One keyword or short phrase becomes the scene beat; it is not a subtitle renderer.
- **Motion verbs**: reveal, sharpen, decrypt, pulse
- **Route rule**: Remotion-native rewrite only; no CSS keyframes, scroll trigger, hover trigger, or uncontrolled random scrambling.

### ProofFocusCard
- **Anchor**: `visual_anchor.type === "proof-focus-card"`
- **ReactBits references**: `SpotlightCard`, `GlareHover`, `TiltedCard`, `ElectricBorder`, `BorderGlow`
- **Props**: `{sourceSrc, proofRegions[], focusRegion, shellMode, frame, fps, accent, subtitleSafeRegion, designLanguage}`
- **Job**: proof / context. Adds focus shell, glare, border, or light sweep around literal evidence while preserving readable pixels.
- **Motion verbs**: lock-on, scan, reveal, hold
- **Route rule**: proof region must stay flat or distortion-free during the inspection hold.

### EvidenceStackMorph
- **Anchor**: `visual_anchor.type === "evidence-stack-morph"`
- **ReactBits references**: `Stack`, `CardSwap`, `BounceCards`, `ScrollStack`, `PixelTransition`
- **Props**: `{cards[], activeIndex, transitionMode, frame, fps, accent, proofRegions[], designLanguage}`
- **Job**: proof / build / transition. Several evidence cards become an ordered argument or hand off into the next scene.
- **Motion verbs**: stack, swap, peel, morph
- **Route rule**: if the stack contains proof, each active card must get a dwell period with no perspective distortion.

### ConceptFieldPlate
- **Anchor**: `visual_anchor.type === "concept-field-plate"`
- **ReactBits references**: `Aurora`, `Threads`, `Particles`, `DotGrid`, `GridMotion`, `Beams`, `LightRays`
- **Props**: `{fieldFamily, density, energyLevel, frame, fps, accent, safeRegions[], proofExclusionPolicy, designLanguage}`
- **Job**: explain / transition / background. Non-proof atmosphere or relation field behind source material and subtitles.
- **Motion verbs**: drift, scan, flow, pulse
- **Route rule**: default to Remotion-native rewrite for simple fields; use HyperFrames/HTML candidate only for shader/canvas/WebGL fields with a promotion plan.

### KnowledgeBentoMap
- **Anchor**: `visual_anchor.type === "knowledge-bento-map"`
- **ReactBits references**: `MagicBento`, `ChromaGrid`, `AnimatedList`, `FlowingMenu`, `Dock`
- **Props**: `{items[], groups[], activeItemId, frame, fps, accent, layoutMode, designLanguage}`
- **Job**: explain / context / build. Tool ecosystem, agent map, module inventory, or model comparison as a working surface.
- **Motion verbs**: organize, reveal, highlight, connect
- **Route rule**: must avoid landing-page UI composition; each tile needs a knowledge role.

### TactileStickerRelay
- **Anchor**: `visual_anchor.type === "tactile-sticker-relay"`
- **ReactBits references**: `StickerPeel`, `PixelTransition`, `GradualBlur`
- **Props**: `{fromHandle, toHandle, peelRegion, revealLayer, frame, fps, accent, subtitleSafeRegion, designLanguage}`
- **Job**: transition / proof reveal. A hidden layer, contradiction, or label peels away and becomes the next scene handle.
- **Motion verbs**: peel, uncover, push, relay
- **Route rule**: valid only when the director board edge names a continuity handle and lookdev can see the handoff.

### CountPressureStat
- **Anchor**: `visual_anchor.type === "count-pressure-stat"`
- **ReactBits references**: `CountUp`, `TextPressure`, `GradientText`, `TrueFocus`
- **Props**: `{value, label, pressureWord, unit, frame, fps, accent, emphasisWindow, designLanguage}`
- **Job**: data / hook / payoff. A number or pressure word becomes the scene's dominant anchor.
- **Motion verbs**: count, pressurize, focus, lock-on
- **Route rule**: claim source must be traceable; effect cannot replace proof citation or evidence.

## Shared utilities (for new shots)

New components MUST reuse these helpers from `src/shared.tsx` and `src/theme.ts` to stay coherent:

- `FPS = 30`
- `getBeatColors(beat)` → `{accent, accentSoft, glow}`
- `getPacing(beat)` → number multiplier
- `editorialCard(material, accent, {padding, radius}, designLanguage)` — primary card surface
- `editorialEyebrow(accent, designLanguage)` — pill badge / label header
- `accentLine(accent, width, designLanguage)` — gradient or solid emphasis line
- `materialSurface(material, designLanguage)` — `screen-emissive | glass-ink | tactile-metal | matte-paper`
- `baseText`, `displayText`, `monoText` — font stack styles
- `normalizeText(text)` — whitespace collapse
- `resolveStatic(file)` — path resolver for assets
- `FONT_STACKS` from theme: `display | body | mono`

Material families and their look:

- `screen-emissive` — glowing emissive surface, for active / focus elements
- `glass-ink` — glass-morphism, for body cards
- `tactile-metal` — heavy metallic, for hero stats
- `matte-paper` — flat paper, for chip pills

## Validation rule for `xingchen-visual-compiler`

When writing `render.scene_motion_specs[*].chrome_components`:

- Every entry must reference a component name from this catalog (existing shots + planned shots once Phase B ships).
- If a needed shot is not in the catalog, raise `kit-extension-request.md` per `xingchen-art-direction` downstream contract; do not invent inline.
- `visual_anchor.type` must be one of the dispatched types listed in the table above.
- For planned shots, `xingchen-visual-compiler` may write the spec, but the project's render-time check should refuse to dispatch until Phase B is shipped (component file exists at the expected path).
