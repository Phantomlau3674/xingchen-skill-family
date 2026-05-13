# Energy Density Map

This reference governs how Xingchen Next thinks about per-second visual intensity, information pacing, and the rhythm contract between the video and the viewer.

The core failure of "flat" videos is not bad visuals — it is uniform energy. Every scene feels the same weight, the same speed, the same importance. The viewer's brain stops distinguishing signal from noise, and attention drifts.

## The Rhythm Contract

Every video makes an implicit rhythm contract with the viewer:

- "I will not waste your time" (no dead air, no repeated information)
- "I will signal when something important is happening" (intensity rises at key moments)
- "I will give you rest between peaks" (density drops after a proof or payoff, allowing absorption)

A video that breaks this contract — by being uniformly dense, uniformly sparse, or randomly varying — loses the viewer not through boredom but through fatigue or disorientation.

## Energy Levels

Think of visual energy on a 1-10 scale. This is not about "how much stuff is on screen" — it is about how much cognitive and emotional demand the frame places on the viewer.

| Level | Character | Visual Signals |
|-------|-----------|----------------|
| 1-2 | Rest / breath | Negative space, slow drift, single element, ambient background, no text overlay |
| 3-4 | Orientation / context | Clear layout, stable composition, moderate text, explanatory diagram at rest |
| 5-6 | Active explanation | Animated diagram, evidence with annotation, multiple elements with clear hierarchy |
| 7-8 | Proof / impact | Large-scale data reveal, before/after contrast, evidence filling the frame, fast-cut montage |
| 9-10 | Peak / climax | Full-screen takeover, extreme scale, rapid sequence, maximum visual density with clear focal point |

## The Three-Act Energy Shape

Knowledge/opinion videos on Douyin follow a predictable energy shape. Deviating from this shape is allowed but requires an explicit reason.

### Act 1: Assault (0–5 seconds)

Energy: 8-10 → 6-7

The first frame hits hard (see [douyin-hook-science.md]). The hook creates peak energy. The next 2-4 seconds establish context — who is speaking, what the topic is, why it matters. Energy drops from peak to "high normal."

Think about:
- the hook frame itself should be the highest-energy moment of Act 1
- the drop from hook to context must not feel like a letdown — it should feel like "now I will explain what you just saw"
- if Act 1 ends and the viewer does not know what the video is about, the context was too slow
- information rate in Act 1: one new idea per 1-2 seconds

### Act 2: Build (5 seconds – last 15 seconds)

Energy: 5-6 baseline with 7-8 peaks every 15-30 seconds

This is where the argument lives. Energy stays at a "working" level with periodic peaks at proof moments.

Think about:
- every 15-30 seconds, the viewer needs a reason to stay. A new proof, a surprising comparison, a number that resets their expectations. These are energy peaks.
- between peaks, the energy can drop to 4-5 for explanation, setup, or transition. This is not weakness — it is contrast that makes the peaks feel stronger.
- if the video runs longer than 90 seconds at a constant 5-6 energy with no peaks, the viewer's attention is decaying. Something must escalate.
- information rate in Act 2: one new idea per 3-5 seconds. Faster for montage/list sections, slower for deep explanation.

### Act 3: Payoff + Accelerate (last 15 seconds)

Energy: 7-8 → 9-10 → 3-4

The closing should not simply stop. Two patterns work:

**Pattern A: Rapid Recap** — Key points flash back in rapid succession (kinetic typography at 1.2-1.5x the original reading speed), creating a "greatest hits" feeling that rewards attention and encourages rewatch. Energy peaks at 9-10, then drops to a clean close.

**Pattern B: Single Punch** — One final, decisive proof or statement lands at maximum impact, followed by a clean exit. Energy peaks once and drops.

Think about:
- the viewer should feel that the ending was earned, not arbitrary
- a CTA (follow, like, comment prompt) lives in the 3-4 energy zone after the payoff, not during it
- the final frame must work as a still (it may be what the viewer sees when they pause to comment)

## Information Density Budget

Information density is not the same as visual density. A single number filling the screen can carry more information than a crowded diagram if that number is surprising.

### Density Measurement

Count "information units" per scene:
- a new fact = 1 unit
- a comparison (X vs Y) = 1 unit
- a proof (screenshot, data, quote) = 1 unit
- a transition/recap of known info = 0 units (it is structural, not informational)

### Density Targets

| Video Length | Total Units | Units Per Scene (avg) |
|-------------|-------------|----------------------|
| 30-60s | 5-8 | 1-2 |
| 60-120s | 8-15 | 1-2 |
| 120-180s | 12-20 | 1-3 |

If a scene carries 0 units, it must be serving a structural purpose (transition, breath, energy reset). If more than 2 consecutive scenes carry 0 units, the pacing is stalling.

If a scene carries 4+ units, it is overloaded. Split it or prioritize.

## Scene-Level Energy Assignment

Before visual direction, every scene in the story mother should be assigned an energy level and a density count.

Think about:
- does the energy assignment create a readable shape? (can you see the three-act curve in the numbers?)
- are there at least 2 peaks above energy 7 in the middle section?
- is there at least 1 rest moment (energy 3-4) between major peaks?
- does the opening scene have the highest or second-highest energy?
- does the closing payoff reach at least energy 8?

### Energy Assignment Anti-Patterns

- **Flatline**: every scene is energy 5-6. The video feels competent but forgettable. Viewers complete but do not share or rewatch.
- **All peaks**: every scene is energy 8-10. The video feels exhausting. Viewers drop off in the middle because there is no contrast.
- **Slow start**: the first scene is energy 4-5. The viewer has already scrolled away.
- **Cliff drop**: energy jumps from 9 to 3 with no transition. The viewer feels disoriented.
- **Random walk**: energy levels have no pattern. The viewer cannot predict when to pay attention.

## Visual Intensity Levers

When a scene needs higher energy, these are the levers to consider. They are not all appropriate for every scene — choose based on what the scene's job is.

### Scale

- making the dominant element larger (a 200px number vs an 80px number)
- filling more of the frame (90% vs 60%)
- extreme close-up on a detail

### Contrast

- color temperature shift from the previous scene
- light/dark inversion
- saturated accent against desaturated background

### Speed

- faster animation timing (200ms vs 600ms entry)
- quicker scene-internal cuts
- overlapping animations instead of sequential

### Density

- more visible elements (but with clear hierarchy)
- layered composition (foreground + midground + background)
- text + image + diagram simultaneously

### Surprise

- unexpected layout (not the same grid as the last 3 scenes)
- unusual angle or perspective
- element appearing from an unexpected direction

### Reduction

- paradoxically, a single element on an empty frame can feel more intense than a crowded one
- negative space creates focus
- silence (or a beat drop) creates auditory intensity through absence

## Audio-Visual Energy Sync

Visual energy does not work alone. On Douyin, audio is on by default. BGM rhythm, sound effects, and voice pacing all carry energy — and they must match the visual energy map.

### BGM and Energy Curve

Think about:
- BGM tempo and intensity should follow the three-act energy shape. A high-energy hook with a mellow BGM creates dissonance — the viewer feels something is wrong without knowing what.
- BGM beat drops and energy peaks should align. When the visual hits energy 8-10, the music should hit a beat drop, a swell, or a rhythmic accent at the same moment.
- rest scenes (energy 1-3) are where the BGM can pull back to ambient or go silent. A 1-2 second music gap before a peak creates anticipation.
- the BGM should not fight the voice. During dense narration (Act 2 build scenes), BGM should duck below -18 LUFS. During pure visual moments (no voice), BGM can come forward.

### Sound Effects and Energy Punctuation

Think about:
- a "whoosh" or "hit" sound on a data reveal amplifies the visual snap. But if every scene has a whoosh, none of them feel special.
- sound effects are energy punctuation marks, not energy itself. Use them at 2-3 peak moments per video, not on every transition.
- the strongest sound effect should accompany the hero frame moment.
- silence (a deliberate audio gap of 0.3-0.5 seconds) before a peak moment creates more impact than any sound effect.

### Voice Pacing and Visual Rhythm

Think about:
- when the narrator speeds up, the visual pacing should match (faster cuts, quicker animations).
- when the narrator pauses, the visual should pause too (hold on a frame, let the viewer read the evidence).
- a mismatch between voice pacing and visual pacing creates cognitive dissonance — the viewer's eyes and ears are telling different stories.

Record audio-visual sync decisions in `project-state.json.visual.energy_map` alongside the visual energy assignments. The energy map is not complete until audio energy is considered.

## Integration With Other Systems

### Story Mother

Energy levels should be assigned during story mother construction, not during visual direction. The energy shape is a narrative decision, not a decoration decision.

Write energy assignments into `project-state.json.script.scenes[].energy_level` (1-10) and `project-state.json.script.scenes[].density_units` (integer count).

### Visual Direction

During visual direction, the energy level constrains visual choices:
- energy 1-3: restrained motion, negative space, slow easing
- energy 4-6: standard animation, clear layout, moderate density
- energy 7-8: aggressive animation, scale drama, high contrast
- energy 9-10: full-frame takeover, maximum scale, fastest timing, strongest color

### Lookdev Gate

The lookdev audit should check:
- does the rendered energy visually match the assigned level? (a scene assigned energy 8 that looks like energy 5 is a failure)
- does the energy curve read clearly when watching at 2x speed? (if the peaks are invisible at double speed, they are too subtle)
- is there at least one moment that would make a viewer screenshot or rewatch?

## The Rewatch Test

The highest quality signal for a Douyin knowledge video is rewatch rate. Visual energy directly drives this:

- if the viewer feels they missed something (because the pacing was fast enough to reward attention), they rewatch
- if the viewer wants to screenshot a specific frame (because the visual design was striking enough), they pause and return
- if the viewer wants to share a specific moment (because the proof was visually memorable), they generate traffic

Think about: does this video contain at least one "screenshot-worthy" frame and one "I need to see that again" moment? If not, the energy curve is too flat.

## State Writeback

Record the energy map in `project-state.json.visual.energy_map`:

- `shape`: which three-act pattern was chosen
- `peak_scenes`: list of scene IDs assigned energy 7+
- `rest_scenes`: list of scene IDs assigned energy 1-3
- `density_budget`: total information units across all scenes
- `rewatch_candidate_scenes`: scenes designed to reward replay
- `screenshot_candidate_scenes`: scenes designed to survive as stills
