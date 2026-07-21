---
name: xingchen-director-board
description: Design the visual argument for Xingchen knowledge videos from approved script beats, sources, and real timing. Use for difficult scene exploration, proof-to-picture decisions, diagram relationships, critical Remotion prototypes, or continuity planning. Lean mode is the default; load the historical extended contract only for Extended or legacy projects.
---

# Xingchen Director Board

Design what the viewer must see in order to understand the argument. Do not turn planning fields into on-screen cards.

## Mode

Read `project-state.json`.

- `mode: "lean"`: follow this file.
- `mode: "extended"` or legacy state without `mode`: read [extended-contract.md](references/extended-contract.md).

Lean rules override conflicting requirements in every template or reference loaded by this skill. Bare `must`, `fail`, `blocker`, Visual Lock, eight-layer board, L2/L3, camera-amplitude, asset-quota, and mandatory-preflight rules in historical references are Extended-only.

## Lean Inputs

Read:

- `brief.thesis`, audience, claims, and real sources
- `script.spoken_text`, beats, audio reference, and timing basis
- `script.timeline_revision`
- current `scenes[]`
- [lean-invariants.md](../xingchen-next/references/lean-invariants.md)

Use actual recording or subtitle timing when available. Do not infer proof or rhythm from memory.

## Lean Scene Contract

Write one scene decision with:

- `scene_id`
- `beat_id`
- `knowledge_change`
- `dominant_visual`
- `motion_action`
- `proof_ref`
- `safe_region`
- `timing`
- `implementation.visual_kind`
- `semantic_relation`

Write target-frame exclusions to `safe_region.must_not_cover` and source-content protections to `safe_region.source_must_preserve`.

The `knowledge_change` must state what becomes newly understandable. The `dominant_visual` must name a picture, proof carrier, or visible transformation rather than a component family.

## Procedure

1. Read the source and exact beat timing.
2. Name the one cognitive job of the scene.
3. Choose the dominant visual before choosing components or APIs.
4. Bind literal proof to real source ids.
5. Choose one semantic motion action: `reveal`, `compare`, `trace`, `build`, `transform`, `hold`, or `resolve`.
6. Define subtitle and proof safe regions.
7. Write the implementation route without prescribing unnecessary technical complexity.
8. Across adjacent scenes, preserve a continuity anchor when identity, direction, geometry, or source position must remain stable; vary shot scale or visual grammar only for a semantic reason.

## Critical Scenes

Explore two genuinely different visual directions by default only for:

- the opening hook
- the hardest explanation or proof
- the payoff
- another unresolved high-risk scene

Add a third only when the first pair leaves a real unresolved tradeoff. Ordinary scenes need one defended direction. Prototype selection is a working decision, not an approval lock.

For critical scenes, keep the alternatives as `extensions.visual_intent.scenes[].candidate_hypotheses` until the compiler renders them. Each hypothesis must change the visual mechanism or evidence reveal, not merely palette, font, or easing. Do not choose a winner from prose.

## Diagram Rule

When `implementation.visual_kind` is `diagram`, fill:

```json
{
  "semantic_relation": {
    "big_question": "",
    "small_question": "",
    "relationship": ""
  }
}
```

The relationship must also be visible in primary copy or geometry. Do not make the viewer infer essential meaning from an abstract loop, arrow, or tiny annotation.

## Mobile Readability

Design essential meaning for phone viewing:

- main subtitles around `58-64 px`
- thesis labels around `44-52 px`
- important node labels around `38-46 px`

Secondary labels cannot carry the only explanation. Proof and semantic relationships must remain readable after phone downsampling.

## Creator Identity

The default avatar source is:

`C:\Users\liuzh\Pictures\04_AI生成图片\2026-05\ChatGPT Image 2026年5月7日 15_14_14.png`

Reuse it instead of inventing a placeholder. A project may skip showing it with a concrete thesis, proof, or tone reason. The asset does not make the Shanghai-night/workbench style mandatory.

## Reference Styles

Do not infer a style from a library or famous reference. A reference style enters planning only when `visual_policy.reference_style.selected` is `true` and state records:

- source
- selection reason
- selected traits
- avoid-copying list

Unselected references add no scene fields or lookdev rules.

When a selected reference is a public output rather than a style name, read [output-reconstruction-grammar.md](../xingchen-next/references/output-reconstruction-grammar.md). Reconstruct its semantic job, continuity anchor, shot logic, hierarchy, motion, audio role, constraints, and handoff. Store only traits that change the current film and an explicit avoid-copying list.

## Anti-PPT Test

Reject or revise a direction when:

- narration and screen repeat the same sentence
- the scene is mainly a centered card, title, and entry animation
- motion can be removed without changing comprehension
- proof requires pausing because camera motion reduces readability
- multiple scenes repeat the same visual sentence

Stillness passes when `hold` is the correct cognitive action.

## Handoff

Write film-changing decisions to Lean state. When whole-piece direction is needed, send the scene contract and candidate hypotheses to `xingchen-art-direction`; always preserve critical hypotheses into `xingchen-visual-compiler` for rendered comparison.

Do not create a parallel canonical board file in Lean mode.
