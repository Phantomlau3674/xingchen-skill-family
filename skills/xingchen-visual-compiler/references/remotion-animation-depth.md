# Remotion Capability Catalog

This file is an advisory catalog, not a quality ladder.

Do not require an L2 capability in every scene. Do not require an L3 capability in every film. API presence, grep matches, particle counts, camera amplitude, and dependency count are not evidence that a video works.

Choose a capability only when it helps the viewer understand, feel, or notice something the scene needs.

## Start With The Cognitive Job

Name one primary motion action:

- `reveal`: expose hidden evidence, hierarchy, or a missing part
- `compare`: keep two states legible long enough to judge their difference
- `trace`: follow a route, causal chain, timeline, or dependency
- `build`: assemble a system in meaningful order
- `transform`: show a before state becoming an after state
- `hold`: preserve attention on proof, silence, or a difficult sentence
- `resolve`: close an open visual question

Then choose the simplest technique that performs that action.

## Capability Bands

The bands describe implementation complexity. They do not describe artistic quality.

### L0: Static And Held

Examples:

- a truthful screenshot held for reading
- a still portrait with restrained subtitle timing
- a single diagram state
- a deliberate pause or negative space

L0 is valid when stillness is the correct viewing behavior. It becomes a problem only when the scene needs a visible change and none occurs.

### L1: Frame-Driven Basics

Examples:

- `useCurrentFrame()`
- `interpolate()`
- `Easing`
- `<Sequence>`
- SVG line drawing
- opacity, position, scale, crop, and mask changes driven by frame

Use L1 for clear timing, entry, emphasis, comparison, and simple staged reveal.

### L2: Structured Motion Tools

Examples:

- `spring()` when an object should settle, rebound, or collide
- `@remotion/paths` for meaningful route tracing
- `@remotion/animation-utils` for reusable transform composition
- `<Freeze>` for evidence or causal interruption
- `@remotion/transitions` for a transition with a narrative bridge
- `@remotion/shapes` for programmatic geometry
- multi-layer parallax when depth explains spatial relation
- multiple `<Sequence>` blocks when order carries meaning

Use L2 when the scene job benefits from the capability. Do not add it to satisfy a quota.

### L3: Specialized Systems

Examples:

- `@remotion/media-utils` for audio-responsive evidence or rhythm
- `@remotion/three` or React Three Fiber for a justified 3D relationship
- `interpolatePath()` for semantic shape transformation
- `@remotion/motion-blur` for genuinely fast movement
- `@remotion/skia` for rendering needs that ordinary DOM/SVG cannot meet
- a physics engine for real collision or constraint behavior
- `@remotion/lottie` for an approved deterministic vector asset
- frame-by-frame time remapping
- WebGL shaders for a scene-specific visual process
- `@remotion/noise` for controlled procedural texture or fields

Use L3 only when the viewing problem requires it. A film with no L3 can be excellent.

## Selection Examples

| Scene need | Likely choice | Avoid |
|---|---|---|
| read a real error line | hold, crop, one restrained zoom | camera motion that makes reading harder |
| compare two outcomes | stable split frame, synchronized reveal | two unrelated cards flying in |
| explain a causal chain | path trace, staged nodes, persistent anchor | labels appearing without visible relation |
| show a system assembling | ordered sequences or transform | arbitrary particle burst |
| pause on a difficult claim | freeze or held proof | movement added only to avoid stillness |
| show true spatial structure | 3D or parallax if depth matters | decorative 3D card stack |

## Anti-PPT Review

Review the rendered sequence, not the source code alone.

Ask:

1. What did the viewer understand earlier because of this motion?
2. Does the screen add a visual argument instead of repeating narration?
3. Is there one dominant visual, or only title-plus-card composition?
4. Can proof be read without pausing?
5. Does the scene expose a before state, transformation, or after state when the idea needs one?
6. Are several scenes repeating the same centered-card grammar?
7. Would removing an effect improve clarity?

Stillness with a reason passes. Movement without a reason is a risk.

## Optional Diagnostics

Static scans may inventory imports and APIs for debugging, dependency planning, or performance review. They must not:

- assign a video-quality score
- fail a scene because L2 or L3 is absent
- demand a numeric camera range
- treat `spring()` as automatically better than `interpolate()`
- require particles, parallax, 3D, or physics
- install packages merely to raise a capability level

## Dependency Policy

Inspect the existing project before adding a package. Add a dependency only when:

- an approved scene job needs it
- the same result cannot be produced more simply with current tools
- deterministic Remotion rendering can be demonstrated
- the preview benefit justifies the maintenance and render cost

Missing optional packages are not a reason to block the project or fabricate a more complex route.

## Acceptance Evidence

Use:

- actual playable clips
- real or accepted audio
- phone-sized downsample checks
- proof geometry and safe-region checks
- full-sequence human review
- deterministic render and asset checks

Do not use capability level as approval evidence.
