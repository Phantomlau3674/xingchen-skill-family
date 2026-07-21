# Voice-Led Faceless Contract

Use this as the default production contract for narration-led videos where the creator is not on camera. The accepted narration is A-roll. Designed visuals, diagrams, typography, B-roll, metaphor plates, generated plates, and sparse real proof respond to the voice.

Store the plan at `extensions.voice_led_film` and start from [voice-led-film.template.json](../templates/voice-led-film.template.json). Source-led analysis is optional and applies only to scenes that genuinely use screen recordings or footage.

## Voice Beats Own Time

Map every accepted script beat into timestamped `voice_beats`. Mark its spoken function, emphasis, and visual job. A breath or pause may be its own beat when it changes the edit.

Every shot cites one or more voice beats. The narration decides when a shot starts, changes state, holds, and exits. Visuals must not run as an unrelated slideshow underneath the speech.

## Visuals Need Jobs, Not Real-Material Quotas

Choose the cheapest source that can achieve the required picture quality and truth:

- `local-design`: Remotion/SVG/Canvas explanation;
- `reusable-primitive`: an existing high-quality visual mechanism;
- `real-proof`: the minimum real screenshot, document, chart, or capture needed for a claim;
- `stock`: believable B-roll or texture;
- `generated-still` or `generated-video`: atmosphere, metaphor, transition, or payoff material;
- `source-capture`: a real screen or footage event when it is actually useful.

There is no minimum real-material ratio. Generated or designed material cannot serve as factual proof. A `real-proof` shot must cite registered proof sources.

## Faceless Means The Voice Is The Presenter

Keep `visibility_policy: "faceless"`. Do not route the default film through talking-head grammar or invent a human presenter. An optional recurring avatar may provide identity, but it does not replace the voice, proof, or scene action.

Each shot records its viewer job and visible screen action. Captions carry rhythm and accessibility; they cannot be the only picture.

## Animated A-roll Is The Default Picture

For voice-led work, designed animation may be the A-roll. Store the film-level policy at `animated_a_roll`. For animated primary shots, each shot must name its `a_roll_state`:

- `opening_state`;
- `transform`;
- `settled_state`;
- `handoff`;
- `continuity_anchor`.

Read [animated-a-roll-grammar.md](animated-a-roll-grammar.md) before designing full-frame motion graphics, kinetic typography, diagram sequences, or process scenes. The key rule is continuous state change: reuse visible objects across a span and let speech cause them to scatter, group, split, compare, trace, collapse, or resolve. Do not treat a sequence of cards as A-roll unless the cards themselves transform as the editorial object.

## Sound Causes Picture

Each shot records a sound sync anchor, exact `sync_time_sec`, and visible response. Spoken emphasis, pauses, breaths, clicks, designed accents, music turns, and silence are valid anchors. The time must fall inside the shot.

## Coverage

The shot plan must cover the accepted scene timeline without unexplained gaps or overlaps. Every script beat, voice beat, and scene must be covered. Sparse proof is valid; uncovered narration and subtitle-only scenes are not.
