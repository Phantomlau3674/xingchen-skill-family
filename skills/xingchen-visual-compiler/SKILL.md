---
name: xingchen-visual-compiler
description: Compile Xingchen Lean scene contracts into concrete Remotion components and playable critical prototypes while preserving proof, timing, mobile readability, and explicit semantic relationships. Use the historical extended contract only for Extended or legacy projects.
---

# Xingchen Visual Compiler

Turn approved scene intent into deterministic, playable video. Do not use technical complexity as a substitute for visual reasoning.

## Mode

Read `project-state.json`.

- `mode: "lean"`: follow this file.
- `mode: "extended"` or legacy state without `mode`: read [extended-contract.md](references/extended-contract.md).

Lean rules override conflicting requirements in every template or reference loaded by this skill. Historical Visual Lock, complete director-board, edge-board, L2/L3, camera-amplitude, mandatory spring/physics, package-install, asset-quota, and adapter-trace blockers are Extended-only.

## Lean Inputs

Read each scene's:

- `knowledge_change`
- `dominant_visual`
- `motion_action`
- `proof_ref`
- `safe_region`
- `timing`
- `implementation.visual_kind`
- `semantic_relation`

Read accepted audio timing and the compact visual direction when present.
Read `script.timeline_revision` and `extensions.visual_intent`. Do not compile stale scene intent from an earlier speech or A-roll structure.

## Prototype First

Before full production, implement two real Remotion candidates by default for:

- the hook
- the hardest explanation or proof
- the payoff

Add a third candidate only when the first pair leaves a real unresolved tradeoff. Keep the accepted audio span, dimensions, and phone-downsample viewport constant. Each candidate changes one visible mechanism, not merely color or easing. Use actual scene assets. A still board or code sample is not a candidate.

## Scene-Specific Checkpoints

Use checkpoints only when they expose the scene type's real failure mode:

- motion graphic or diagram: `entry`, `settled`, `exit`
- source proof: `context`, `detail`, `hold`
- footage: `cut-in`, `action-peak`, `exit`
- talking head: `face`, `gesture`, `handoff`
- montage: `group-open`, `rhythm-peak`, `group-exit`

For MG and diagrams, design the settled composition before animation. For footage and edits, do not force a settled frame where the meaning comes from cuts, action, or continuity. Checkpoints never replace the playable clip.

## Compilation Procedure

1. Resolve real source and asset paths.
2. Preserve source geometry for screenshots, UI, charts, terminals, and documents.
3. Establish one dominant visual.
4. Align reveals, cuts, holds, and silence with `speech_cues` and accepted audio.
5. Protect target-frame regions in `must_not_cover` and source content in `source_must_preserve`. Choose `cover`, `contain`, or a deliberate reframe per asset.
6. Implement the semantic motion action with the simplest sufficient technique.
7. Run a structural check: component, real asset references, proof binding, timing, and safe regions.
8. When checkpoints are useful, render the matching profile and write `implementation.verification`.
9. Render playable critical candidates and the scene with accepted audio.
10. Write `implementation.timeline_revision` from the current script revision. A revision mismatch makes the implementation stale.

## Audio Roles

Treat narration and A-roll speech as the anchor. Music and ambient beds are followers that duck under speech and recover in pauses. Short SFX stay independent unless a scene needs them tucked under voice. Do not solve clarity by permanently crushing music and also applying deep ducking.

Use sound effects as semantic punctuation at selected peaks. A structural timing change invalidates music length, ducking, captions, B-roll, MG, and preview evidence.

Generated music is raw material, not a timing oracle. Do not assume its beats land on scene changes. Place, trim, loop, fade, and duck it against the accepted timeline after generation.

## Transitions And Effects

- Default to subtle effects that preserve skin, proof contrast, highlight detail, and natural blacks.
- For a full-frame transition, the opening endpoint must match the outgoing picture and the closing endpoint must match the incoming picture without a visible jump.
- Let both clips participate when the transition's material logic requires it; do not hide a weak handoff under a one-sided overlay.
- Use eased timing instead of linear progress unless linear motion expresses the subject.
- Add secondary motion, stagger, or depth only when it clarifies hierarchy, material, or direction.
- Review the transition inside adjacent scenes. An isolated effect demo cannot approve continuity.

## Motion Selection

Prefer semantic actions:

- `reveal`
- `compare`
- `trace`
- `build`
- `transform`
- `hold`
- `resolve`

Stillness and held proof are valid. L2/L3 APIs, camera travel, particles, parallax, 3D, `spring()`, and physics are optional capabilities, not quality requirements.

Read [remotion-animation-depth.md](references/remotion-animation-depth.md) only when a scene job genuinely needs a specialized capability.

When adapting a public reference output, first run `xingchen-next/scripts/analyze-reference-output.mjs` and read [output-reconstruction-grammar.md](../xingchen-next/references/output-reconstruction-grammar.md). Convert observations into original candidate hypotheses; never paste a public prompt library into project state.

## Diagram Compilation

When `visual_kind` is `diagram`:

- render the big question, small question, and relationship explicitly
- make the relationship visible at phone size
- do not hide meaning in small labels
- do not paste semantic wireframes onto a busy generated plate
- preserve the relation through motion, not only the final frame

If the relationship cannot be restated from a phone downsample, return the scene to the director board.

## Creator Avatar

Use:

`C:\Users\liuzh\Pictures\04_AI生成图片\2026-05\ChatGPT Image 2026年5月7日 15_14_14.png`

Do not generate a placeholder cat or substitute identity asset. The avatar can be cropped or masked for a host chip, but it cannot own proof.

## Reference Styles

Compile style-specific traits only when `visual_policy.reference_style.selected` is `true`. Preserve the recorded selection reason and avoid-copying list.

When no style is selected, do not infer or inject a style from visual-vocabulary libraries, famous videos, templates, or asset kinds.

When the selected branch is Vox-inspired editorial collage, load `xingchen-vox-collage`. Consume its project-local `visual/vox/DESIGN.md`, `scene-spec.json`, and `assets.json`; preserve settled hero-frame coordinates, live text/data ownership, independent actor layers, and its anti-PPT checks. The branch owns collage image mechanics and motion grammar; this compiler still owns the concrete Remotion implementation and playable candidates.

## Mobile Readability

For Douyin-oriented layouts, start from:

- subtitles `58-64 px`
- thesis labels `44-52 px`
- important nodes `38-46 px`

Do not rely on desktop-only legibility. Essential relationships and proof must survive phone downsampling without pausing.

## Anti-PPT Acceptance

Inspect rendered sequences:

- narration and screen have different jobs
- each scene has a visible knowledge change
- the dominant visual is not a centered title card
- motion improves comprehension
- proof stays readable
- adjacent scenes do not repeat the same card grammar
- a hero frame exists only when the film has a genuine hero proof or payoff
- scene checkpoints match the visual kind rather than a universal three-frame recipe
- cuts and motion accents follow speech beats; music and sound effects do not fill every gap

API grep, import count, and component count cannot pass this review.

## Handoff

Send all rendered critical candidates and the full implemented scene set to `xingchen-lookdev`. Do not discard losing hypotheses before rendered comparison. Lookdev writes the selected candidate and viewing reason, then judges the assembled output against the Lean preview contract.
