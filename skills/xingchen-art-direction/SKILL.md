---
name: xingchen-art-direction
description: "Create a coherent whole-piece visual language for Xingchen videos: hierarchy, palette, typography, continuity, proof treatment, creator identity, and conditional reference-style adaptation. Lean mode writes only film-changing decisions; Extended and legacy projects use the historical contract."
---

# Xingchen Art Direction

Create a visual system that strengthens the argument. Do not make the project look consistent by forcing every topic into the same template.

## Mode

Read `project-state.json`.

- `mode: "lean"`: follow this file.
- `mode: "extended"` or legacy state without `mode`: read [extended-contract.md](references/extended-contract.md).

Lean rules override conflicting requirements in every template or reference loaded by this skill. Historical Visual Lock, chrome whitelist, three-candidate arbitration, continuous-motion, global resource preflight, and style-specific blocker rules are Extended-only unless the Lean contract explicitly selects them.

## Lean Inputs

Read:

- thesis, audience, platform, and source constraints
- scene `knowledge_change`, `dominant_visual`, `safe_region`, and semantic relationships
- current `visual_policy`
- [lean-invariants.md](../xingchen-next/references/lean-invariants.md)

## Lean Output

Keep the required `visual_policy.creator_avatar` and `visual_policy.reference_style` in canonical state.

When extra whole-piece direction is needed, write a compact object under `extensions.art_direction`:

```json
{
  "visual_thesis": "",
  "hierarchy_rule": "",
  "palette_logic": "",
  "typography_rule": "",
  "continuity_anchor": "",
  "motion_character": "",
  "allowed_stillness": "",
  "proof_treatment": "",
  "anti_template_rules": []
}
```

Do not add fields that cannot change the rendered film or preview review.

Use `extensions.visual_intent` as the shared Lean bridge when sequence decisions matter:

```json
{
  "timeline_revision": 1,
  "hero_scene_id": null,
  "scenes": [
    {
      "scene_id": "",
      "job": "",
      "energy": "low | medium | high",
      "speech_cues": [],
      "contrast_from_previous": "",
      "candidate_hypotheses": []
    }
  ],
  "audio_roles": {"anchor_ref": "", "followers": []}
}
```

Read [visual-excellence-patterns.md](../xingchen-next/references/visual-excellence-patterns.md), [energy-density-map.md](../xingchen-next/references/energy-density-map.md), [speech-rhythm-engine.md](../xingchen-next/references/speech-rhythm-engine.md), and [visual-contrast-system.md](../xingchen-next/references/visual-contrast-system.md) only to derive these film-changing cues. Do not copy their historical `visual.*`, StoryMother, Script Lock, or Visual Lock surfaces into Lean state.

## Creator Avatar

Default to:

`C:\Users\liuzh\Pictures\04_AI生成图片\2026-05\ChatGPT Image 2026年5月7日 15_14_14.png`

Use the fixed cat-director asset for creator identity instead of generating a temporary mascot. It may orient, host, transition, or close. It cannot replace proof.

The broader Shanghai-night, warm-lamp, workbench style is conditional. Reusing the avatar does not automatically select that visual world.

## Reference-Style Gate

A named video, studio, illustrator, or visual style is unselected by default.

Select it only when state records:

- `selected: true`
- a concrete source
- why it fits the current thesis and audience
- traits to adapt
- what must not be copied

Only selected styles activate their references, templates, or lookdev checks. Never inject Vox, Kurzgesagt, 3Blue1Brown, PaperClip, or another style because a director left the style blank.

For a selected public video or template library, use [output-reconstruction-grammar.md](../xingchen-next/references/output-reconstruction-grammar.md). Adapt the causal system—semantic role, layout topology, continuity, hierarchy, motion choreography, audio role, and handoff—not copied wording, branding, or a style costume.

## Mobile Hierarchy

For Douyin-oriented work, start from:

- subtitles `58-64 px`
- thesis labels `44-52 px`
- important node labels `38-46 px`

Essential meaning must survive phone downsampling. Decorative text can be smaller only when removing it would not change comprehension.

## Semantic Relationship

The main visual must carry the relationship, not tiny labels. For diagrams, preserve the explicit big question, small question, and relationship through type, layout, color, and motion.

## Direction Selection

Offer multiple whole-piece systems only when an unresolved high-impact choice exists. Critical hook, hardest-proof, and payoff hypotheses are different: preserve two or three scene mechanisms until real clips can be compared. Otherwise produce one defended system and move to prototypes.

Open Design, GitHub, Huashu, Lottie, GSAP, HyperFrames, image generation, and visual-vocabulary libraries are optional references. They are never automatic preflights.

## Handoff

Send the compact direction plus scene contracts to `xingchen-visual-compiler`.

Acceptance depends on actual critical clips and full-preview evidence, not on filling a lookdev template.
