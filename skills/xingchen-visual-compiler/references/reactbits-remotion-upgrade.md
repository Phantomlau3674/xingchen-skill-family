# ReactBits to Remotion Upgrade Matrix

Purpose: use ReactBits as a source of motion ideas and component extension briefs for Xingchen knowledge videos, while keeping Remotion, the director board, and proof readability in control.

ReactBits is useful because its official catalog is organized around animated text, animations, backgrounds, and UI components. Treat those as motion primitives, not as finished scene templates.

Official source snapshot:

- Catalog/site: https://www.reactbits.dev/
- Repository: https://github.com/DavidHDev/react-bits
- Verified categories from `src/content` on 2026-05-13: `TextAnimations`, `Animations`, `Backgrounds`, `Components`.

## Non-Negotiables

- ReactBits never decides scene purpose. The scene purpose comes from `visual.director_board.scene_boards[]`.
- Direct ReactBits code is not automatically render-safe in Remotion. Rebuild or adapt every animation so timing is driven by `useCurrentFrame()`, `interpolate()`, `spring()`, scene progress, or explicit frame props.
- CSS transitions, CSS keyframes, pointer state, hover state, scroll state, cursor following, requestAnimationFrame loops, and uncontrolled randomness are invalid for final Remotion timing.
- WebGL/canvas/Three/OGL/Matter/GSAP components are candidates only after a route is named: Remotion-native rewrite, Remotion Three, HyperFrames/HTML capture, transparent asset, or video plate.
- Proof assets stay above decorative motion. If a source screenshot, chart, terminal, UI, paper quote, or number is evidence, the ReactBits-derived effect cannot distort it or lower readability.
- Subtitles inherit the director-board safe region. ReactBits-derived backgrounds and overlays must name `must_not_cover` regions before lookdev.
- If the component is not built in the current render kernel, write `kit-extension-request.md`; do not silently rename it to an existing generic card.

## Best Fits for Knowledge Videos

### 1. Kinetic Keywords

Use when the voice lands on a term, contrast, or surprise.

Good ReactBits references:

- `SplitText`, `BlurText`, `DecryptedText`, `ScrambledText`, `GlitchText`
- `ShinyText`, `GradientText`, `RotatingText`, `TextPressure`, `TrueFocus`
- `CountUp`, `ScrollVelocity`, `TextType`

Xingchen use:

- hook keyword before the spoken punchline
- concept reveal after a proof screenshot
- "old belief -> new belief" contrast
- one big number or pressure word, not full subtitles

Avoid:

- using these as normal captions
- per-character noise over long sentences
- unreadable glitch on proof claims

### 2. Proof Focus and Card Motion

Use when a screenshot, table, source page, quote, or UI proof needs editorial focus without becoming a PPT page.

Good ReactBits references:

- `SpotlightCard`, `GlareHover`, `TiltedCard`, `ElectricBorder`, `BorderGlow`
- `PixelTransition`, `AnimatedContent`, `FadeContent`, `GradualBlur`
- `Stack`, `CardSwap`, `BounceCards`, `ScrollStack`, `StickerPeel`

Xingchen use:

- proof region lock-on
- source card depth without losing literal pixels
- card stack as evidence order
- sticker peel only when revealing a hidden layer or contradiction

Avoid:

- hover-only shimmer with no narration reason
- rotating or tilting proof so text becomes unreadable
- nesting cards inside cards

### 3. Concept Fields and Spatial Plates

Use when a scene needs a non-literal field, knowledge map, system atmosphere, or transition support.

Good ReactBits references:

- `Aurora`, `SoftAurora`, `Beams`, `LightRays`, `Threads`, `Particles`
- `DotGrid`, `DotField`, `GridMotion`, `GridScan`, `RippleGrid`, `Dither`
- `Cubes`, `MetaBalls`, `Ribbons`, `LaserFlow`, `OrbitImages`, `MagicRings`

Xingchen use:

- background plate behind proof
- concept room / relation field
- spatial transition between explanation layers
- texture layer for generated-video gaps when `gen_insert` is not justified

Avoid:

- generic premium background with no knowledge action
- dark atmospheric field that hides subtitles
- Spark substitution. These are not automatically Spark; Spark still needs a world/spatial reason.

### 4. Interface Landscape and Tool Maps

Use when explaining an ecosystem, agent system, tool comparison, model family, or workflow surface.

Good ReactBits references:

- `MagicBento`, `ChromaGrid`, `AnimatedList`, `FlowingMenu`, `Dock`
- `Carousel`, `Stepper`, `Counter`, `CircularGallery`, `Masonry`
- `Folder`, `GlassIcons`, `PixelCard`, `ReflectiveCard`

Xingchen use:

- tool landscape
- agent/module inventory
- step-by-step system state
- choice menu or before/after grid

Avoid:

- product-landing-page composition
- profile-card or portfolio metaphors unless the content is really about a person/product identity

## Reject or Demote by Default

These can look impressive but often fight knowledge-video clarity:

- Cursor and pointer effects: `BlobCursor`, `ClickSpark`, `GhostCursor`, `TargetCursor`, `SplashCursor`, `Crosshair`, `TextCursor`.
- Pure decoration with weak semantic role: `Orb`, `Galaxy`, `Balatro`, `Prism`, `Plasma`, `LiquidChrome`, `LiquidEther`.
- Interaction-first navigation: `GooeyNav`, `BubbleMenu`, `CardNav`, `PillNav`, `StaggeredMenu`.
- Personal/portfolio blocks: `ProfileCard`, `Lanyard`, `ModelViewer` unless the scene is explicitly about a person, product object, or 3D model.

They may still be used as inspiration after the director board names the exact knowledge reason and safe-region constraints.

## Integration Modes

### Remotion-native rewrite

Default for text, cards, counters, diagrams, proof overlays, and deterministic UI motion.

Required:

- Replace component-internal time, CSS animation, scroll triggers, and hover state with frame props.
- Props must include `frame`, `fps`, `durationFrames`, `accent`, `safeRegion`, and any proof regions touched by the effect.
- Entry, hold, and exit beats must line up with narration refs from the director board.

### Remotion Three

Use for 3D card stacks, cubes, proof planes, concept rooms, and camera-as-argument scenes.

Required:

- Use `@remotion/three` / `ThreeCanvas`.
- No `useFrame()` loops. Animation is driven by `useCurrentFrame()`.
- `frame_layer.camera_path` and `frame_layer.depth_plan` must explain what the camera reveals.

### HyperFrames or HTML candidate

Use when a ReactBits-like shader/canvas/WebGL experiment is faster to explore in browser land.

Required:

- Output is a candidate artifact, not the final video controller.
- Candidate must be registered in `render.hyperframes_candidates[]` and `render.plugin_adapter_runs[]`.
- Promotion path back to Remotion must be explicit.

### Transparent asset or video plate

Use only for non-proof motion layers or bounded generated/captured plates.

Required:

- Remotion still owns subtitles, proof overlays, timeline, and final assembly.
- The plate must not contain readable claims, fake UI truth, captions, or proof.

## Director Board Checklist

When a scene chooses a ReactBits-derived effect, the board must include:

- `component_layer.primary_component` or `supporting_components`: the Xingchen component name, not only the ReactBits source name.
- `component_layer.component_props_brief`: ReactBits reference names, what is copied conceptually, and how it becomes frame-driven.
- `component_layer.kit_extension_needed`: `true` unless the exact Xingchen component already exists in `shot-library.md` and the render kernel.
- `detail_layer.motion_verbs`: the actual verbs, such as reveal, lock-on, peel, scan, drift, stack, or pulse.
- `frame_layer.proof_regions`, `frame_layer.subtitle_safe_region`, and `subtitle_layer.must_not_cover`: the regions the effect cannot cover.
- `lookdev_acceptance.motion_check`: how to prove the effect served the narration instead of just decorating.

## Suggested Kit Extension Briefs

These names may appear in director-board component plans only as extension requests until built.

| Xingchen component | ReactBits references | Use | Default route |
|---|---|---|---|
| `KineticKeywordReveal` | `SplitText`, `BlurText`, `DecryptedText`, `ScrambledText`, `GlitchText`, `ShinyText`, `GradientText` | One keyword or short phrase becomes the beat anchor. | Remotion-native rewrite |
| `ProofFocusCard` | `SpotlightCard`, `GlareHover`, `TiltedCard`, `ElectricBorder`, `BorderGlow` | Source proof gets a readable focus shell and timed highlight. | Remotion-native rewrite |
| `EvidenceStackMorph` | `Stack`, `CardSwap`, `BounceCards`, `ScrollStack`, `PixelTransition` | Several proof cards become an ordered argument. | Remotion-native rewrite or HTML candidate |
| `ConceptFieldPlate` | `Aurora`, `Threads`, `Particles`, `DotGrid`, `GridMotion`, `Beams`, `LightRays` | Non-proof field behind explanation or transition. | Remotion-native rewrite or HyperFrames candidate |
| `KnowledgeBentoMap` | `MagicBento`, `ChromaGrid`, `AnimatedList`, `FlowingMenu`, `Dock` | Tool ecosystem, agent map, module inventory. | Remotion-native rewrite |
| `TactileStickerRelay` | `StickerPeel`, `PixelTransition`, `GradualBlur` | A hidden layer or contradiction is revealed, then handed to next scene. | Remotion overlay or transition primitive |
| `CountPressureStat` | `CountUp`, `TextPressure`, `GradientText`, `TrueFocus` | A number or pressure word becomes the scene's dominant anchor. | Remotion-native rewrite |

## Lookdev Failure Language

ReactBits-derived motion fails lookdev when any of these are true:

- `scene_id.component_layer`: the component is only a ReactBits name and has no Xingchen implementation or kit-extension request.
- `scene_id.detail_layer.motion_verbs`: the effect has no narration-timed action.
- `scene_id.frame_layer.proof_regions`: proof text is distorted, covered, too small, or moving during inspection.
- `scene_id.subtitle_layer.must_not_cover`: subtitles overlap the effect or the effect crowds the subtitle safe region.
- `scene_id.tech_stack_layer`: WebGL/canvas/3D code is not previewed or has no promotion route back to Remotion.
- `edge_id.selected_bridge`: transition uses a visual trick without carrying a keyword, proof region, diagram state, axis, color logic, or question-answer relationship.
