# Output Reconstruction Grammar

Use this reference when a public reference video or template library is worth learning from. Reconstruct the observable design logic; do not copy hidden prompts, proprietary code, branding, or unlicensed prompt text.

## Evidence Before Interpretation

For each reference, collect:

- real video metadata and audio presence;
- hard-cut timestamps and shot intervals;
- representative frames at semantic changes;
- visible subject, proof, layout, motion, and handoff behavior;
- defects such as silence, clipping, unreadable text, identity drift, or decorative motion.

Run:

```powershell
node ./scripts/analyze-reference-output.mjs <reference-video.mp4>
```

The analyzer reports streams, canvas, duration, hard cuts, shot intervals, and basic audio levels. It does not decide whether a cut or style is good.

## Reconstructed Output Packet

Describe an output with this order:

1. `semantic_job` — hook, explain, prove, compare, orient, transition, or resolve.
2. `narrative_arc` — the visible change from opening state to closing state.
3. `continuity_anchor` — the subject, object, geometry, color, direction, or source region that must remain stable.
4. `shot_plan` — shot scale, viewpoint, duration, and cut or continuous-camera logic.
5. `layout_topology` — full screen, split, overlay, card, grid, chart, list, timeline, or transparent cutout.
6. `focal_hierarchy` — what must be seen first, second, and last at phone size.
7. `material_language` — documentary, editorial, paper, glass, dark tech, watercolor, product macro, or another justified material system.
8. `motion_choreography` — reveal, stagger, slide, draw, grow, spring, mask, count, hold, or exit; each motion needs a semantic reason.
9. `audio_role` — voice anchor, follower bed, independent punctuation, intentional silence, or source sound.
10. `constraints` — proof, face, logo, text, product edge, safe region, identity, and negative constraints.
11. `handoff` — how the scene exits or prepares the next scene.

This packet is an implementation hypothesis. A rendered candidate and full-piece review decide whether it works.

## Public-Output Study, 2026-07-13

The public ChatCut prompt library exposed 123 visible cards: 5 app-promo, 14 video-generation, and 104 motion-graphics examples. The motion-graphics descriptions repeatedly combined:

- a semantic container such as card, chart, overlay, list, timeline, or lower third;
- a visual system such as gradient, tech, editorial, minimal, paper, pixel, or watercolor;
- a small choreography such as reveal, stagger, sequential entry, slide, draw, pop, spring, grow, or count;
- editable data or text slots;
- sometimes an explicit exit or source-video cutout.

The useful abstraction is:

`semantic role + layout topology + material system + motion choreography + editable payload + handoff`

Do not reduce this to a style-name prompt. The semantic role and hierarchy come first.

Four public preview videos showed different sequence grammars:

- documentary promo: fast alternation between person, source screen, and result; proof cutaways carry credibility;
- studio product launch: delay the whole-object reveal, move from material macro to component proof to final hero view;
- storyboard-to-film: preserve one identity anchor while changing shot scale and viewpoint across action beats;
- time-freeze: use one continuous camera path and stable spatial relationships instead of cutting.

Analyzer evidence at scene threshold `0.25`:

| public preview | duration | detected shots | mean shot | audio observation |
|---|---:|---:|---:|---|
| documentary promo | 9.682s | 11 | 0.880s | stereo audio, peak -4.2 dB |
| studio product launch | 15.069s | 5 | 3.014s | stereo audio, peak 0.0 dB |
| storyboard-to-film | 15.069s | 8 | 1.884s | stereo audio, peak -5.5 dB |
| time-freeze | 15.042s | 1 | 15.042s | no audio stream |

These are role-specific patterns, not universal shot-count rules.

## Account-Visible Workflow Study, 2026-07-13

A signed-in, zero-credit inspection of the editor exposed six onboarding workflows: talking-head editing, motion graphics, long-video-to-shorts, product or app promotion, AI short film, and explainer video. Their seed prompts were not hidden production prompts. They were compact intake contracts that told the agent which decisions to collect and which skill or artifact sequence to load.

Across the six workflows, the reusable structure was:

`goal + source readiness + decision variables + workflow skill + artifact ladder + review loop`

The decision variables changed by job:

- talking head: upload readiness and treatment choices such as speech cleanup, B-roll, motion graphics, music, and captions;
- long-to-shorts: target platform, clip count, clip length, captions, titles, music, and restrained motion graphics;
- product promo: duration, URL-versus-upload intake, product evidence, visual approach, script, and final assembly;
- motion graphics: communication job, real content, brand cues, style cues, first design, and iteration;
- short film: premise, emotion, audience, platform, aspect ratio, duration, ending, story structure, style bible, shot list, per-shot prompts, continuity, assembly, and final review;
- explainer: topic, audience, length, narration readiness, sectioned script, visual treatment per section, voiceover, music, and synchronization.

This supports four implementation rules:

1. Treat an entry prompt as an onboarding macro, not as the quality engine. Quality comes from the routed skill, explicit intermediate artifacts, rendered evidence, and revision loop.
2. Build a job-specific intake contract before production. Do not ask every possible question; collect only variables that can change the edit.
3. Define an artifact ladder for the job. For example, a short film needs a brief, structure, style bible, shot list, continuity plan, clips, timeline, and final review; a talking-head edit needs source intake, structural cleanup, treatment decisions, timeline work, and a full-preview review.
4. Ask for the next blocking decision at the stage where it becomes useful. Do not front-load a giant questionnaire.

The editor also exposed separate selectors for design styles and workflow skills. The style selector offered families such as dark tech, monochrome neon, violet glow, warm paper, editorial, and orange minimal. The skill selector offered procedural jobs such as long-to-shorts, multi-clip reels, short-film planning, product scripting, explainer assembly, motion-graphic placement, storyboard breakdown, thumbnail generation, and saving a successful process as a reusable skill.

Therefore keep these concerns orthogonal:

- `workflow_skill` decides the questions, artifacts, tools, order, and verification;
- `design_style` decides visual material, color, typography, texture, and motion character;
- `output_grammar` decides how meaning, proof, continuity, timing, sound, and handoff appear in the rendered piece.

Never let a style preset decide the story or shot logic. Never bake one fixed look into a reusable workflow skill. Never call an onboarding macro a complete production method.

## What Not To Inherit

Public outputs are evidence, not authority. In the same sample set:

- one cinematic preview had no audio stream;
- one product preview peaked at the digital ceiling;
- fast cutting worked for a short product proof but would damage a dense explanation;
- visual polish did not guarantee proof readability or semantic depth.

Borrow the causal mechanism, then run Xingchen's own proof, audio, mobile, and full-preview checks.

## Candidate Rule

Render two candidates by default for a critical scene. Add a third only when the first pair leaves a real unresolved tradeoff. Candidates must change a visible mechanism, not only color, copy, or easing.

Use pairwise review to answer:

- Which candidate communicates the scene job sooner?
- Which preserves proof and continuity better?
- Which earns its motion and sound?
- Which survives the adjacent scenes in the full piece?

Keep the losing hypothesis in state so a later sequence-level regression can reverse the choice.

## Open-Source Boundary

Record provenance for reference URLs, dates, and observed outputs. Publish derived schemas, analyzers, tests, and original examples. Do not publish copied prompt libraries or plugin files unless their license explicitly permits redistribution.
