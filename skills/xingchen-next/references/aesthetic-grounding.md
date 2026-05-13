# Aesthetic Grounding

This reference turns cinema, animation, photography, sound, and short-form platform guidance into Xingchen-native operating rules.

The goal is not "make it prettier." The goal is to let an operator choose a defensible visual and sonic strategy, lock it in state, and review it against concrete rules.

## What The Source Set Contributes

- Oxford Academic, [Shot Composition Basics](https://academic.oup.com/book/39668/chapter/339654550)
  - composition carries clarity, mood, and meaning
  - symmetry, balance, contrast, leading lines, framing, and crop are narrative choices
  - look-space, walk-space, foreground/background, and perspective affect how a frame reads

- Oxford Academic, [Continuity Editing Basics](https://academic.oup.com/book/39668/chapter/339654901)
  - editing should preserve clear, logical flow in time and space
  - cuts should not make the viewer re-derive where they are or what changed

- Adobe, [12 Principles of Animation](https://www.adobe.com/creativecloud/animation/discover/principles-of-animation.html)
  - staging, anticipation, arcs, easing, secondary action, timing, exaggeration, and appeal make motion readable and intentional

- Adobe, [Complete Guide to Animation Easing](https://www.adobe.com/uk/creativecloud/animation/discover/easing.html)
  - linear motion reads as mechanical
  - eased motion reads as organic and controlled

- Adobe Blog, [Six Principles of Using Animation in UX Design](https://blog.adobe.com/en/publish/2019/06/19/designing-animation-six-principles-using-animation-ux)
  - motion sets hierarchy and directs focus
  - timing, easing, and spatial continuity keep the viewer oriented

- Adobe Stock, [Visual Storytelling Creative Guide](https://stock.adobe.com/pages/artisthub/pdf/2023-visual-storytelling-creative-guide.pdf)
  - story benefits from beginning, middle, and end
  - coverage should include wide, medium, close, and detail
  - shot lists should specify perspective, angle, and distraction removal

- Adobe MAX 2024, [Stylistic Consistency](https://www.adobe.com/max/2024/sessions/elevating-storytelling-stylistic-consistency-os804.html)
  - a recognizable thread can survive different subjects and lighting
  - consistency is a method, not a filter

- TikTok For Business, [short-video best practices](https://ads.tiktok.com/business/en-US/blog/tiktok-short-video-best-practice) and [TikTok-friendly guidance](https://ads.tiktok.com/business/en-US/blog/7-ways-to-make-your-videos-tiktok-friendly)
  - the first seconds matter
  - vertical 9:16, audio-on, concise, and show-and-tell alignment are structural advantages
  - authentic can be lo-fi, but not low quality

- YouTube / Google Shorts guidance
  - vertical assets perform better
  - short and engaging matters
  - creator voice is part of the aesthetic decision, not a separate layer

- Walter Murch, Rule of Six
  - influential practitioner heuristic: emotion, story, rhythm, eye-trace, 2D plane, 3D space
  - useful as a project-specific judgment stack, not a fixed default machine score

## Encoded Source Translations

These names only matter if they become Xingchen-native rules.

- Roger Deakins -> `mise_en_scene_policy.lighting_motivation`
  - light should feel earned by story logic, not sprayed on because "cinematic" looks cool

- Alex Webb -> `mise_en_scene_policy.foreground_background` plus `SceneMotionSpec.dominant_anchor`
  - multiple planes are allowed only when a dominant anchor survives

- Saul Leiter -> `mise_en_scene_policy.color_abstraction_policy`
  - color can become abstraction only when it does not destroy proof truth

- Mary Ellen Mark -> `hero_frame_scene_id` plus `hero_frame_laws`
  - even documentary bodies still need one singular image that stands alone

- Annie Leibovitz, Alec Soth, Rebecca Norris Webb -> `editing_priority_stack` and `energy_curve`
  - sequencing is about rhythm, choreography, beginnings, endings, and meter

- Peter Lindbergh -> `anti_cheapness`
  - over-retouching and cosmetic polish are explicit failure signatures when the thesis wants honesty

These translated controls belong in state. The reference list alone is not the system.

## Xingchen-Native Operating Model

### 1. Taste Thesis

Every project needs one sentence that states the intended visual and sonic judgment.

The thesis should answer:

- what feeling the viewer should get
- what kind of attention the frame should command
- what motion behavior should feel inevitable
- what kind of sound and voice behavior should feel right
- what kind of image or audio quality would feel wrong

If the thesis cannot be stated cleanly, the aesthetic layer is not ready.

### 2. Benchmark Canon

The benchmark canon is the small set of references used to hold the line.

Rules:

- use 3 to 7 references
- each reference must have a job
- do not mix unrelated families unless the project explicitly needs a hybrid
- include at least one reference for composition, one for motion, one for style continuity, and one for a hero frame

The canon should be concrete enough that an operator can say, "this is on-model" or "this is drifting."

### 3. Aesthetic Modes And Tradeoffs

Xingchen should recognize multiple high-end paths, not one visual religion.

Pick one primary mode, then document the tradeoffs you are accepting and the modes you explicitly rejected.

#### `clarity_first_documentary`

- prioritizes legibility, proof, and trust
- uses simple staging, naturalistic light, and clean crop logic
- best for knowledge-opinion, evidence-heavy scenes, and claim clarity
- tradeoff: can feel restrained if the content needs spectacle
- do not choose as primary when symbolic mood or operatic tension matters more than proof trust

#### `layered_human_complexity`

- prioritizes depth, multiple planes, and lived-in environments
- uses foreground, midground, background, and shadow to create tension
- best for human observation, urban texture, and social contradiction
- tradeoff: can become cluttered if the frame lacks a dominant anchor
- do not choose as primary when the content needs immediate single-read proof clarity

#### `theatrical_control`

- prioritizes authored mood, controlled light, and symbolic composition
- best when the piece needs atmosphere, tension, or a stronger emotional charge
- tradeoff: can feel staged or over-designed if the thesis is supposed to feel immediate and real
- do not choose as primary for proof-heavy knowledge scenes unless the proof is still the dominant visual truth

#### `singular_iconic_frame`

- prioritizes one frame that can stand alone as a poster, cover, or hero still
- best for hooks, covers, and moments that must survive as a still image
- tradeoff: can flatten sequence rhythm if everything is pushed toward the same one-frame punch
- do not choose as primary when the piece depends on sustained explanation, proof accumulation, or rhythm across many scenes

Selection rule:

- choose the mode that protects the thesis
- document rejected modes and why
- do not blend modes just because the team likes all of them
- if a hybrid is necessary, document the exact conflict it solves and the drift it must not permit

### 4. Frame Logic

Composition is not decoration. It is how the frame makes meaning.

Use these controls deliberately:

- symmetry and asymmetry
- balance and imbalance
- contrast and negative space
- leading lines and directional flow
- look-space and walk-space
- foreground / background separation
- perspective and angle
- crop discipline

The operator should be able to explain why a subject sits where it sits.

### 5. Motion Logic

Motion should feel staged, not accidental.

Use the animation stack as judgment:

- staging directs attention
- anticipation prepares the viewer
- arcs and easing make movement feel alive
- secondary action should support, not distract
- timing controls how hard the frame hits
- exaggeration is allowed when it serves clarity or emotion

Rules:

- linear motion is a warning sign unless mechanical behavior is the point
- motion should create hierarchy, not noise
- motion density is not the same thing as momentum

### 6. Edit Logic

Continuity editing should preserve clear flow in time and space.

The cut should not force the viewer to reconstruct the scene from scratch.

Editing priorities should be ranked per project, not copied blindly from a book.

Sequence guidance:

- build a beginning, middle, and end
- use wide, medium, close, and detail coverage when the story needs progression
- preserve logical spatial and temporal continuity unless the break is intentional
- if rhythm moves above story or eye-trace for this piece, state why

### 7. Color Script And Style Consistency

Color should behave like a script, not a random decoration layer.

Write a color script policy that says:

- which anchor colors open the piece
- what shifts in the middle
- what release or closure happens at the end
- how value and contrast evolve across the arc
- how much drift is acceptable before the work is off-model

Style consistency policy should say:

- which visual thread must survive across subjects and lighting
- what may vary and what may not
- how palette, typography, and motion grammar stay recognizable

Consistency does not mean sameness. It means the viewer can tell the same author made the piece.

### 8. Audio And Voice Taste

High-end short-form quality is not visual-only.

Write explicit audio and voice policy for:

- what music is doing, if anything
- what silence is doing, if anything
- when SFX may clarify versus cheapen
- how narration should breathe, stress, and land
- what cloned voice risks must be watched
- which pronunciation errors, flattened prosody, or over-cleaned voice textures are unacceptable

If the sound would make the piece feel generic, the visual quality does not save it.

### 9. Anti-Cheapness

Cheapness is a failure mode, not a taste disagreement.

Every anti-cheapness rule should declare whether it is:

- `machine_blacklist`
- `preview_detector`
- `manual_aesthetic_review`

Failure families to cover:

- UI and template cheapness
  - fake dashboard chrome with no real system meaning
  - decorative glow, particles, or blobs with no narrative job
  - narration echo bubbles that only repeat the script
  - mixed chrome families that feel like a template mashup
- motion and edit cheapness
  - static scenes that overstay without purpose
  - whip zoom abuse
  - false urgency jump cuts
  - kinetic typography that fights narration instead of clarifying it
- AI image cheapness
  - plasticky skin
  - symmetry artifacts
  - impossible fingers or facial geometry
  - fake shallow-depth blur as a shortcut to "cinematic"
- AI voice and mix cheapness
  - flattened prosody
  - wrong pronunciation on key nouns
  - breathless or airless speech
  - stock-tension music that overstates a weak idea
  - faux film dirt or letterbox added without narrative reason

If a cheaper-looking choice is intentional, it still needs a reason and a review note.

### 10. Hero-Frame / Singular-Image Requirement

Every project needs at least one frame that survives as a still.

That frame must:

- carry the thesis without requiring playback
- have one dominant anchor
- read cleanly on first glance
- protect proof pixels from crop and subtitle collisions when proof is literal

`hero_frame_scene_id` should point to the mother scene that owns this obligation.

If no singular image can be named, the direction is too diffuse.

### 11. Energy Curve

Short-form work needs cadence.

Use an opening / middle / closing arc:

- opening: immediate hook and orientation
- middle: proof, development, or escalation
- closing: release, boundary, or resolution

Do not flatten the piece into constant motion. A clean pause, a change in density, or a controlled reveal is often stronger than more motion.

### 12. Manual Review Policy

If an aesthetic rule cannot yet be evaluated with confidence, do not mark it as pass.

Required behavior:

- use `manual_review_required`
- mark the unsupported rule as `unsupported`
- record the human judgment still needed
- do not let automation silently bless a taste call it cannot defend

### 13. State Writeback

Write the approved aesthetic system into `project-state.json.visual.visual_policy`.

Minimum fields:

- `taste_thesis`
- `benchmark_canon`
- `reference_set`
- `selected_aesthetic_mode`
- `aesthetic_modes`
- `editing_priority_stack`
- `continuity_policy`
- `mise_en_scene_policy`
- `color_script_policy`
- `audio_policy`
- `voice_policy`
- `anti_cheapness`
- `hero_frame_scene_id`
- `hero_frame_laws`
- `energy_curve`
- `style_consistency_policy`
- `short_form_policy`
- `manual_review_policy`
- `anti_reference`
- `forbidden_list`
- `allowed_chrome`
- `palette_lock`
- `typography_lock`
- `motion_rhythm`
- `evidence_rule`

## Practical Selection Rule

When the operator chooses an aesthetic direction:

- match the mode to the content problem
- name the tradeoff you are accepting
- identify the hero frame once the mother scene order exists and before `Visual Lock`
- lock the color script before scene packing
- treat unsupported taste claims as manual review, not a pass

The system should help the operator choose the right path, not force every project into the same look.
