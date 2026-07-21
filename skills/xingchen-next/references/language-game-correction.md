# Language Game Correction For Xingchen

This is a thin correction layer for `xingchen-*`. It turns vague creative language into visible, state-backed scene responsibility. It should be absorbed through existing fields, not new schema.

Core idea: a word's meaning is its use in the current creative practice. In Xingchen, that means every important term must become script behavior, scene responsibility, source evidence, motion behavior, or lookdev criterion.

## Where It Runs

- `script`: before Script Lock, check that key terms have stable use and do not drift through synonyms.
- `story-mother`: check that scene jobs and proof bindings say what each scene does, not merely what it feels like.
- `visual-direction`: before Visual Lock, check director-board language for public visual criteria.
- `lookdev`: before Lookdev Approval, check whether the rendered preview visibly satisfies the claimed use.

## Five Checks

1. **Production game**: Is this phrase being used as narration, on-screen text, proof label, metaphor carrier, motion instruction, aesthetic direction, or lookdev rule?
2. **Use**: What does it make the viewer do: stop scrolling, understand a relation, trust a proof, feel a contrast, follow a transition, or remember the thesis?
3. **Public criterion**: What should be visible/audible in the artifact: source quote, proof region, camera reveal, object behavior, motion primitive, subtitle relation, or viewer-readable text?
4. **Private-language risk**: If the phrase only means something inside the creator's head, rewrite it into scene-level evidence or put it in `unresolved_questions`.
5. **Say/show boundary**: Decide whether the meaning belongs in voice, text, source plate, object, camera, transition, or should be removed.

## State Mapping

Do not add new state fields unless a future schema change is explicitly approved. Put the correction into existing fields:

- `script.spoken_script.blocks[]`: stable wording and no synonym drift.
- `script.beat_map.scenes[]`: emphasis and pause points that prove how the term is used.
- `mother.story_mother.scene_cards[].intent`: what the scene does.
- `visual.director_board.global_director_thesis`: whole-piece use, not vibe.
- `scene_boards[].source_layer.what_material_says`: source-bound meaning.
- `scene_boards[].brainstorming_layer.scene_question`: the precise visual question.
- `scene_boards[].brainstorming_layer.why_selected`: public criterion for the chosen picture.
- `scene_boards[].frame_layer.on_screen_text[]`: viewer-facing words with source/purpose.
- `scene_boards[].frame_layer.camera_path`: what the camera reveals.
- `scene_boards[].tech_stack_layer.why_this_stack`: what this stack makes visible that another stack cannot.
- `render.scene_motion_specs[].brainstorming_trace`, `anti_ppt_decision`, `visual_resource_trace`: compile the correction downstream.
- `review.lookdev_gate_results[]`: actual pass/fail evidence.

## Blocking Patterns

- A direction says `高级`, `电影感`, `更丰富`, `震撼`, or `有温度` but names no visible criterion.
- A metaphor is only a noun: `黑箱`, `飞轮`, `宇宙`, `神经网络`, `积木`, with no carrier, behavior, or camera reveal.
- A scene is assigned to a renderer because the renderer sounds cool, not because it makes the scene's use public.
- On-screen text repeats internal metadata or tool words instead of audience-facing meaning.
- Lookdev approves a preview because it is "好看" while the original scene job, proof role, or camera reveal is not visible.

## Correction Output

For each risky term, write a compact correction in the owning artifact:

```md
Language-game correction:
- phrase: ...
- game: narration / visual / proof / motion / lookdev
- public criterion: ...
- corrected use: ...
- route: keep / rewrite / show-through-motion / move-to-proof / remove / manual-review
```

Use `manual-review` when source interpretation or taste cannot be decided honestly by the agent.

## Examples

- `黑箱` -> `input chips enter a dark chamber, internals stay occluded, one trace line exits with a confidence tag`.
- `电影感` -> `camera reveals the relation between proof plate and thesis object; lighting separates evidence from atmosphere; no static title-card hold over 12 frames`.
- `更丰富` -> `at least three scene jobs use different visual vocabulary: proof crop, concept structure, and payoff return`.
- `像人讲的` -> `voice keeps one hesitation or concession, screen text stays structural, subtitles do not turn every sentence into a slogan`.

## Rule

If a key phrase cannot pass this check, do not push it downstream as a taste instruction. Rewrite it, ask one focused question, or route back to the owning upstream skill.
