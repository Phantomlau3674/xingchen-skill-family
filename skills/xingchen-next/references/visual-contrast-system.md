# Visual Contrast System

This reference governs how Xingchen Next thinks about scene-to-scene visual variety, scale drama, and the prevention of visual monotony.

The core failure: when every scene uses the same background family, the same font sizes, the same layout grid, and the same animation timing, the viewer's brain habituates. Each scene looks "fine" in isolation, but the sequence feels like a slideshow with different text. This is the single most common reason a technically-correct video feels "flat" or "平淡."

## The Monotony Test

Before approving any visual direction, apply this test:

Take 4 consecutive scenes from the middle of the video. Show them as still frames, side by side, without text. Can a viewer tell which scene is which? If the 4 frames look interchangeable — same color temperature, same layout structure, same background density, same element scale — the visual direction has failed the monotony test.

This test does not require that every scene looks radically different. It requires that consecutive scenes have at least one clearly different visual dimension.

## Contrast Dimensions

When thinking about scene-to-scene variety, consider these dimensions independently. A scene does not need to change on all dimensions — but it must change on at least one significant dimension from the scene before it.

### 1. Color Temperature

Think about:
- does the video live entirely in one temperature zone? (all cool blue, all warm amber, all neutral gray)
- temperature shifts signal topic shifts. A warm-to-cool transition can mark "the problem" to "the solution." A cool-to-warm transition can mark "technical explanation" to "human impact."
- the shift does not need to be dramatic. A 500K shift (warm neutral to cool neutral) is enough for the viewer to feel a change, even if they cannot name it.

Anti-pattern: every scene uses the same dark blue-purple background gradient. This is the most common xingchen-next monotony signature.

What to think about instead:
- can one scene use a dark warm background (charcoal, deep brown, dark green) while the next uses a dark cool one?
- can the proof scenes use a brighter, more clinical background to signal "evidence zone"?
- can the hook scene use a color that breaks the feed pattern? (see [douyin-hook-science.md] on feed contrast)

### 2. Layout Structure

Think about:
- does every scene use the same grid? (centered title + centered content + bottom subtitle is the default — and the most monotonous)
- layout shifts signal importance shifts. A full-bleed image says "look at this." A small, centered text block says "think about this." An asymmetric layout with text-left/image-right says "here is the proof."

Layout patterns to alternate between:
- **full-frame takeover**: one element owns the entire frame. Best for peak energy moments, data bombs, hero evidence.
- **asymmetric split**: content on one side, proof on the other. Best for explanation + evidence scenes.
- **stacked reveal**: elements appear top-to-bottom in sequence. Best for step-by-step arguments.
- **negative space focus**: small element in large empty space. Best for rest moments, questions, transitions.
- **grid/mosaic**: multiple small elements in a grid. Best for comparison, ecosystem, landscape scenes.

Anti-pattern: every scene uses centered layout with title on top and content below. This is "上下结构" and it is the single most templated layout in knowledge video.

What to think about instead:
- if the previous scene was centered, can this scene be asymmetric?
- if the previous scene was text-heavy, can this scene be image-dominant?
- if the previous scene had many elements, can this scene have one?

### 3. Element Scale

Think about:
- are all headlines the same size? (if every headline is 80px, none of them feel important)
- scale creates hierarchy across time, not just within a frame. The most important headline in the video should be the largest headline in the video. Supporting points should be visibly smaller.
- extreme scale is underused. A number at 300px filling the screen creates more impact than any animation on a 60px number.

Scale drama thinking:
- what is the single most important visual moment in this video? Make that element 2-3x larger than anything else.
- what is the least important structural scene? Make its elements deliberately smaller, creating space and rest.
- when two consecutive scenes have the same element scale, the viewer cannot tell which one matters more.

Anti-pattern: every headline is 80-96px, every bullet is 24-30px, every accent line is the same length. This is "uniform type scale" and it flattens hierarchy across time.

What to think about instead:
- can the hook headline be 150-200px?
- can the data proof number be 250-300px?
- can the transition scene text be 40px in a sea of negative space?
- does the scale progression create a visual rhythm? (large → medium → large → small → LARGE)

### 4. Visual Density

Think about:
- how many visible elements are on screen simultaneously?
- density creates rhythm when it varies. A dense scene followed by a sparse scene creates a "breathe" moment.
- uniform density is invisible. The viewer cannot feel the complexity if every scene has 4-6 elements.

Density patterns:
- **minimal (1-2 elements)**: creates focus, signals importance or rest
- **moderate (3-5 elements)**: standard explanation, comfortable to read
- **dense (6+ elements)**: creates energy, signals complexity or comparison
- **progressive (starts minimal, adds elements)**: creates build-up, good for process explanations

Anti-pattern: every scene has 4-5 elements (headline + accent line + 2 bullets + anchor). The density never varies.

### 5. Motion Character

Think about:
- does every scene use the same animation timing? (the same spring config, the same delay pattern)
- motion character should match energy level. High-energy scenes need faster, more aggressive motion. Rest scenes need slower, gentler motion.
- the most powerful motion tool is stillness after motion. A scene that holds completely still for 0.5 seconds after everything around it was animated creates the strongest emphasis.

Motion character vocabulary:
- **snappy**: fast entry (150-250ms), sharp easing, aggressive overshoot. For energy 7-10.
- **smooth**: medium entry (300-500ms), natural easing, no overshoot. For energy 4-6.
- **slow**: long entry (600-1000ms), gentle easing, drift-like. For energy 1-3.
- **staccato**: multiple rapid micro-animations in sequence. For list reveals, data cascades.
- **held**: element appears instantly and holds. For emphasis through contrast with surrounding motion.

Anti-pattern: every scene uses spring(damping: 14-18, stiffness: 90-120). This produces uniformly "smooth" motion that never feels urgent or restful.

### 6. Background World

Think about:
- does the background change meaning across scenes, or just color?
- background is not wallpaper. It communicates the visual world of the scene.
- switching background families between acts (not just between scenes) creates macro-level structure.

Background thinking:
- **Act 1** (hook, context): the background should feel like the topic's world. For tech: clean, dark, precise. For human stories: textured, warm, environmental.
- **Act 2** (proof, argument): the background should recede. Evidence needs room. A quieter background lets proof screenshots and data dominate.
- **Act 3** (payoff, close): the background should resolve. Return to the opening's visual world, or shift to a warmer/brighter version of it, signaling conclusion.

Anti-pattern: the same BeatBackground family runs for the entire video with only accent color changes. The viewer's brain deletes it from attention after scene 3.

## The 60:30:10 Color Budget

Every video needs a color discipline:

- **60% base**: the dominant background and text color family. Sets the mood.
- **30% secondary**: the content and structural element color. Distinguishes information from background.
- **10% accent**: the attention-directing color. Used only for the most important elements in any given frame.

Think about:
- is the accent color being overused? If everything is accent-colored, nothing is emphasized.
- does the accent color change meaning across the video? (it should not — accent should be a consistent signal for "this matters")
- does the base color create enough contrast for text readability? (dark gray text on dark blue background is technically readable but fatiguing)

## Evidence and Proof Visual Treatment

Evidence is the most important visual content in a knowledge video. Its treatment must be deliberate, not default.

### Evidence Hierarchy

Think about what role the evidence plays:

- **Hero evidence** (the main proof of the thesis): full-frame or near-full-frame treatment. The evidence IS the visual, not a supporting element.
- **Supporting evidence** (reinforces a point): contained in a device frame or card, with clear annotation of what to look at.
- **Background evidence** (establishes credibility): reduced opacity, blurred, or partially visible behind text. The viewer knows it exists but does not need to read it.

### Evidence Presentation Rules

Think about:
- does the evidence have a container that signals its real-world origin? (browser frame for web screenshots, paper texture for documents, terminal chrome for code)
- is the important part of the evidence visually marked? (highlight, circle, callout arrow, zoom)
- is the evidence large enough to read at the video's target viewing size? (phone screen, not desktop)
- does the evidence have an entrance that signals "look at this"? (zoom-in, slide-in from off-screen, fade-up from blur)
- is the evidence given enough screen time for the viewer to verify it? (proof that flashes past too quickly undermines trust instead of building it)

Anti-pattern: every screenshot is the same size, in the same container, in the same position, with no annotation. The viewer cannot tell which evidence is more important.

## Scene Transition Contrast

Transitions are contrast opportunities. Every transition should either:

1. **Reinforce the contrast** between scenes (a hard cut between a dense scene and a sparse scene amplifies the shift)
2. **Bridge the contrast** smoothly (a cross-dissolve between two scenes with different color temperatures creates a gentle shift)

Think about:
- the transition should match the energy shift. High-to-low energy: let the scene breathe out with a gentle transition. Low-to-high energy: snap cut, no cushion.
- if two consecutive scenes have similar visual treatment, the transition must create the variety that the scenes themselves lack. A match-cut or a whip-pan can differentiate two visually similar scenes.

## The Variety Checkpoint

Before Lean Preview Lock, or before Extended Visual Lock, check:

1. **Color variety**: do at least 3 scenes have noticeably different color temperatures?
2. **Layout variety**: are at least 2 different layout structures used?
3. **Scale variety**: is there at least one scene where the dominant element is 2x larger than the average?
4. **Density variety**: do scenes range from minimal (1-2 elements) to moderate/dense?
5. **Motion variety**: do high-energy and low-energy scenes use different motion characters?
6. **Background variety**: is the background world different between acts, or at least between the hook and the body?

If fewer than 4 of these 6 checks pass, the visual direction is too monotonous.

## State Writeback

In Lean mode, record only the film-changing relation to the previous scene in `extensions.visual_intent.scenes[].contrast_from_previous`. Extended projects may retain the historical detailed `visual.contrast_map`.
