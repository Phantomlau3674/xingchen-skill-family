# HTML 3D Scene Route

Use this when a scene needs browser-native 3D: Three.js, React Three Fiber, CSS 3D, WebGL shaders, HTML/canvas 3D plates, or Theatre.js-style timeline motion.

The rule is: 3D must serve the material director pass. It is not a premium-looking background. The scene must say what the 3D space explains, what the camera reveals, and how the plate enters the final Remotion-controlled video.

## Route Families

### 1. Remotion-native 3D component

Use when the scene must be frame-accurate with narration, subtitles, proof overlays, or other Remotion layers.

Recommended stack:

- `@remotion/three`
- React Three Fiber
- `<ThreeCanvas>`
- Remotion `useCurrentFrame()` / `interpolate()` for timeline truth

State route:

- `execution_runtime: "remotion"`
- `motion_source: "native_remotion"` or `"hyperframes_runtime"` if promoted from an HTML candidate
- `integration_mode: "live_component"` or `"rewritten_component"`
- `renderer_family: "remotion_component"`

Use this for:

- 3D data objects that must sync to narration
- source screenshots mapped onto planes/cards in a controlled camera move
- token/context/agent/RAG metaphors with exact beats
- 3D device containers carrying real source media or proof plates

Important Remotion constraint: inside `<ThreeCanvas>`, animate declaratively from `useCurrentFrame()`, not uncontrolled `useFrame()` loops, so timeline scrubbing and deterministic render work.

### 2. HTML browser-captured 3D plate

Use when the scene is easier to author as standalone HTML/CSS/Canvas/WebGL, or when Hyperframes should generate a candidate scene.

Recommended stack:

- Three.js or React Three Fiber in a Vite/HTML scene
- optional Theatre.js for camera/object keyframes during lookdev
- browser capture through the shared headless browser
- Remotion final assembly

State route:

- `execution_runtime: "html_browser_capture"`
- `motion_source: "hyperframes_runtime"` or `"bespoke_code"`
- `integration_mode: "captured_html_plate"`
- `renderer_family: "html_scene"` or `"canvas_scene"`

Use this for:

- motion studies
- complex WebGL effects that do not need live Remotion overlays inside the canvas
- candidate variants for a hero shot
- visual experiments that will be promoted only after lookdev approval

The captured plate is not final truth by itself. It must be promoted into `render.scene_motion_specs[]` and assembled by Remotion.

### 3. Transparent 3D overlay asset

Use when the 3D effect is a supporting accent, not the whole scene.

Recommended stack:

- Remotion render with alpha, or browser-captured transparent WebM/ProRes
- final Remotion composition as an overlay

State route:

- `execution_runtime: "remotion"` or `"html_browser_capture"`
- `motion_source: "native_remotion"`, `"hyperframes_runtime"`, or `"bespoke_code"`
- `integration_mode: "transparent_asset_layer"`
- `promotion_target_renderer_family: "remotion_component"`

Use this for:

- a rotating evidence marker
- a depth sweep that reveals structure
- a light or particle accent tied to one keyword

Do not use it for proof-critical text, because compression or alpha edges can reduce legibility.

### 4. Spark / 3DGS world plate

Use only when the scene needs a real or procedural spatial world, 3DGS, RAD streaming world, splat traversal, or hybrid Spark+Three world plate.

State route:

- `execution_runtime: "spark_browser_canvas"`
- `motion_source: "spark_runtime"`
- `integration_mode: "browser_canvas_plate"`
- `renderer_family: "spark_3dgs"`

Spark is not the default HTML 3D route. It is for justified world assets or spatial traversal, not generic atmosphere.

Use Spark instead of ordinary HTML/Three only when at least one of these is true:

- the scene has an approved `.spz`, `.ply`, `.splat`, `.ksplat`, `.sog`, `.zip`, or `.rad` world asset
- the scene needs procedural splats or Spark-specific effects such as SDF lighting, dyno transitions, splat edits, portals, or depth-aware world treatment
- the camera move is a spatial argument through a world, not just a 3D flourish
- the source material benefits from becoming a navigable map, room, archive, market structure, city, lab, pipeline, maze, or orbit

If the goal is only a 3D card stack, token flow, camera orbit around charts, or source screenshots on planes, use Remotion-native Three/R3F first. If the goal is a fast browser-native motion candidate, use HTML capture / Hyperframes first.

## Scene Design Patterns

### Proof Plane

Map a screenshot, chart, or UI capture onto a near-front plane. The camera starts wide enough to show context, then pushes to the proof region. Use Remotion overlays for highlights and subtitles unless the proof region is inside the 3D canvas by design.

Best for: source material that must stay inspectable but benefits from depth.

### Concept Room

Use a shallow 3D room where each wall or table carries one concept, source, or agent role. The camera movement reveals relationships instead of listing bullets.

Best for: abstract systems such as RAG, agent workflow, context windows, model routing.

### Evidence Stack

Layer source cards in depth. The hero proof moves to the front; supporting evidence stays behind at lower contrast.

Best for: multiple pages/screenshots that need hierarchy.

### Camera-As-Argument

The camera path carries the reasoning: zoom in for proof, orbit for tradeoff, pull back for system view, hard cut for contradiction.

Best for: narration with clear emphasis beats and pauses.

### 3D Device / Portal

Place source media or screen recordings inside a phone, browser, dashboard, or portal surface. This can make real material feel authored without destroying evidence truth.

Best for: UI walkthroughs and screen recordings.

## Material Director Requirements

Before selecting HTML 3D, `visual.director_board.scene_boards[].tech_stack_layer` and `frame_layer` must explain:

- why flat 2D is insufficient
- what the 3D camera reveals that a card/layout cannot
- what source material is kept literal
- what subtitles and proof regions must avoid
- whether the 3D scene is final live component, captured plate, or transparent overlay

If the answer is "it looks cool," reject HTML 3D.

## Lookdev Checks

HTML 3D scenes require real preview evidence:

- nonblank canvas check
- frame-accurate timing at the scene's key beats
- camera path readable at 2x speed
- source/proof planes preserve aspect ratio
- no proof-critical text distorted, blurred, or too small
- subtitle safe region remains outside dominant anchor and proof regions
- the 3D scene still makes sense as 4 representative stills
- if rendered through Remotion, `<ThreeCanvas>` width/height and Chromium GL settings are configured
- if captured as a plate, output path and promotion route are recorded before render

## Anti-Patterns

- generic rotating cube, globe, grid, tunnel, or particle field with no scene job
- 3D background behind a flat PPT card
- screenshot tilted so proof text becomes unreadable
- camera orbit that delays comprehension
- using Spark for ordinary HTML 3D
- using `useFrame()` or wall-clock time in a Remotion-bound 3D scene
- making the 3D canvas own subtitles, final audio, or full-video assembly
