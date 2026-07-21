# Visual Collaboration Contract

Human discussion is not a failure path in Xingchen. It is the quality mechanism that prevents silent, generic, unattractive visual plans.

Use this contract whenever a project reaches `visual-direction`, especially recording-first knowledge videos where the voice carries the idea and the picture must be invented with care.

## Required Posture

The agent must not jump from transcript or StoryMother directly to a finished visual board. First it should expose its visual thinking in a reviewable form:

1. Read the source material, proof needs, StoryMother, and recording rhythm.
2. Match each important scene to the actual recording result: emphasis, pause, speed change, sentence weight, and the word the picture must be ready for.
3. Propose two or three concrete visual directions for the important scenes.
4. Discuss the tradeoffs with the user when the user is present.
5. Record the selected direction, rejected options, user feedback, assumptions, and anti-PPT reasoning in `visual.director_board.brainstorming_contract` and the relevant `scene_boards[].brainstorming_layer`.
6. Apply any durable lessons from prior lookdev failures or knowledge-writeback notes.
7. Only then compile the director board, art direction, and scene motion specs.

When the user delegates completely, the agent may continue with a proposed answer, but it must mark the discussion status as `agent_proposed`, list assumptions, and keep Visual Lock pending until the user approves or explicitly accepts the proposal.

## Imagination Brief

The visual design stage should be imaginative first and disciplined second.

Do not conservatively translate the script into subtitles, cards, process boxes, or a polite background. Invent a visual event that makes the viewer stop, understand, and remember. For every important scene, propose bold picture ideas that could plausibly win the first 0.3 seconds of a short-video feed: extreme scale, physical metaphor, evidence interruption, impossible camera angle, visible conflict, spatial traversal, programmatic structure, tactile object, real source media, or mixed composition.

Bold does not mean vague. Every proposal must explain:

- what the viewer sees first before reading subtitles
- what the picture is made of in concrete pixels, objects, source media, diagrams, depth, or motion
- which recorded word, pause, stress, or speed change it is synchronized to
- what detail appears before the spoken keyword lands
- why the picture expresses the idea better than a card, chip, title frame, or ordinary chart
- how it survives vertical 9:16, 3-second hook pressure, subtitle safe regions, proof legibility, and Douyin UI overlays

Use words like `bold`, `strange`, `surprising`, or `beautiful` only as prompts to design a visible thing. Never let `premium`, `cinematic`, `tech style`, or `dynamic` stand in for frame construction.

## What To Discuss

Do not ask vague style questions such as "what visual style do you want?" Bring specific choices:

- the dominant first frame and what the viewer notices before reading subtitles
- what the frame is physically or graphically made of
- which recording beat, pause, emphasis, or spoken keyword the picture is built around
- whether the scene uses source media, programmatic Remotion structure, generated plate, HTML/canvas, 3D space, or mixed composition
- what proof, UI, number, quote, or timing detail must stay faithful
- what camera movement reveals that a static slide cannot
- where subtitles and proof callouts can live without covering the main point
- which option best avoids centered cards, chip clouds, decorative labels, and narration-echo text
- what taste risk might make the scene look cheap, fake, flat, or PPT-like

A useful proposal sounds like: "For scene S02 I see three possible pictures..." followed by concrete frame descriptions, not renderer names.

## Minimum State Evidence

Before Visual Lock, record:

- `visual.director_board.brainstorming_contract.visual_collaboration.status`
- whether the visual discussion was `discussed`, `agent_proposed`, or `manual_review_required`
- `source_ref: "visual-collaboration-contract.md"`
- the recording or beat-map basis used for visual timing
- options presented and why they differed
- selected option and rejected options
- user feedback or agent assumptions
- short-video constraints checked: 0.3-second feed stop, 3-second hook, 9:16 composition, subtitle safe area, proof legibility, Douyin UI overlays
- visual lessons applied from earlier bad outputs
- unresolved visual concerns that should block or delay Visual Lock

Per important scene, also record the same decision in `scene_boards[].brainstorming_layer`: options considered, selected direction, why selected, continuity handles, anti-PPT decision, asset source decision, and lookdev risk.

## Failure Handling

If the user says the result is ugly, generic, PPT-like, visually cheap, or not thought through:

- stop advancing toward render
- return to the Visual Discovery Session
- write a short failure note: what failed, which scene fields were too vague, and what the next proposal must make concrete
- revise the director board before generating more candidates

Do not treat human correction as a bypass. Human correction updates the visual truth, and the state must follow.

## Knowledge Writeback

After a project ships or a visual attempt is rejected, use the existing [knowledge-writeback-pass.md](./knowledge-writeback-pass.md). Do not create a parallel retrospective system.

Capture what visual pattern failed, what improved it, what should be avoided next time, and whether any stevenmind page, skill reference, lookdev rule, forbidden pattern, or asset registry entry should be updated.
