---
name: xingchen-next
description: Build high-quality knowledge and science videos with a lean source-to-Remotion workflow, two approval locks, evidence traceability, mobile-readable visuals, real-audio timing, and preview-based quality review. Use for Xingchen, Remotion explainers, Douyin knowledge videos, source-led video production, or when an existing Xingchen project needs the heavier Extended workflow.
---

# Xingchen Next

Xingchen Next is a video-making router. Its goal is not to maximize process compliance. Its goal is to help produce a video that is true, understandable, visually alive, and worth watching.

Default to **Lean mode**. Use **Extended mode** only when its extra coordination or audit cost is justified.

The only mode values are `lean` and `extended`. Do not invent names such as prototype-first, fast, lite, studio, or source-locked.

## Choose The Mode

Use `lean` unless one of these is true:

- an existing project already uses the legacy extended state
- multiple people or vendors need formal handoffs
- regulated, commercial, or high-risk claims need a deeper audit trail
- the project has many platform variants, custom 3D worlds, or external generation pipelines
- the user explicitly requests the full studio workflow

Do not upgrade merely because the video should look premium. Visual ambition is not a reason to add paperwork.

## Default Workflow

The Lean lifecycle has five stages:

1. `brief-evidence`
2. `script-beats`
3. `scene-production`
4. `preview-revision`
5. `final-delivery`

Only two human checkpoints may block the default path:

- `Content Lock`
- `Preview Lock`

Use these exact stage and checkpoint names in plans and state. Source verification, prototype selection, visual direction choice, resource intake, and adapter selection are working decisions, not additional approval locks. Do not rename or replace the two locks.

Read [stage-lifecycle.md](references/stage-lifecycle.md) and [approval-contract.md](references/approval-contract.md) before creating or advancing state.

## Workflow Contract

Before routing a production skill, collect only the job-changing decisions needed for the next artifact:

- goal, audience, platform, aspect ratio, duration, and ending or CTA;
- source readiness and intake method: existing media, URL, live capture, generated media, or missing evidence;
- job-specific choices such as clip count, narration readiness, treatment mix, product proof, visual approach, or continuity anchors;
- the next artifact to produce and the rendered evidence that will verify it.

Ask for the next blocking decision when it becomes useful. Do not front-load a giant questionnaire. Route the workflow skill to decide questions, artifacts, tool order, and verification. Keep design style orthogonal: it may control material, color, type, texture, and motion character, but it must not decide the thesis, story, proof, shot logic, or acceptance criteria.

An entry prompt is an onboarding macro, not the quality engine. Quality comes from explicit intermediate artifacts, real media, preview evidence, and revision.

Before scene production, instantiate `extensions.agent_harness` from [agent-harness-run.template.json](templates/agent-harness-run.template.json). Follow [agent-harness-contract.md](references/agent-harness-contract.md): keep runtime policy separate from workflow and style, trace `route -> preflight -> plan -> authorize -> execute -> track -> verify -> commit`, and block slide-like plans with the deterministic anti-PPT gate.
Default faceless narration work to `narration-led` and [voice-led-faceless-contract.md](references/voice-led-faceless-contract.md); for animated primary-picture scenes, read [animated-a-roll-grammar.md](references/animated-a-roll-grammar.md) and require a visible state machine. Use [source-led-film-contract.md](references/source-led-film-contract.md) only when real captures genuinely own the film, never as a real-material quota for ordinary voiceover.

## Lean Production Loop

### 1. Brief And Evidence

Establish the thesis, audience, viewing goal, platform, source reality, and factual claims. Every factual claim must point to a real source. Generated media is never proof.

### 2. Script And Beats

Write the complete spoken script and a compact beat map. Use real recording timestamps when available. When recording does not exist yet, record timing assumptions explicitly and replace them after recording.

Stop at `Content Lock`. Approval covers the thesis, audience, spoken script, claims, proof boundaries, and beats together.

### 3. Scene Production

Design three critical scenes before building the whole film:

- the opening hook
- the hardest explanation or proof scene
- the payoff or resolution

Create real, playable Remotion clips for these scenes. Do not approve them from boards alone.

Render two genuinely different visual hypotheses for each critical scene by default. Add a third only when the first pair leaves a real unresolved tradeoff. Keep them comparable with the same accepted audio span, dimensions, and phone-downsample viewport. Do not choose the winner from prose or boards.

Use scene-specific checkpoints only when they expose a real risk:

- motion graphic or diagram: `entry`, `settled`, `exit`
- source proof: `context`, `detail`, `hold`
- footage: `cut-in`, `action-peak`, `exit`
- talking head: `face`, `gesture`, `handoff`
- montage: `group-open`, `rhythm-peak`, `group-exit`

These frames diagnose composition. Playable candidates remain the authority for rhythm, easing, continuity, and sound.

Every scene needs only:

- `scene_id`
- `beat_id`
- `knowledge_change`
- `dominant_visual`
- `motion_action`
- `proof_ref`
- `safe_region`
- `timing`
- `implementation`
- `semantic_relation` when the scene is a diagram

The screen must perform a cognitive action that narration alone cannot perform.
Diagram scenes must state the big question, small question, and their relationship directly.

### 4. Preview And Revision

Assemble a full preview with real audio. Review the three critical clips on a phone-sized downsample, then blind-watch the full piece without reading its planning fields.

Add three passes to the blind watch:

- hide subtitles and exact labels once; changing captions do not count as picture-state change;
- inspect the phone downsample for semantic-subject scale, not only text size;
- watch every repaired interval with both neighboring scenes and name the carried continuity anchor or the intentional reset.

Use [preview-quality-scorecard.md](references/preview-quality-scorecard.md). Engineering lint is necessary but does not count as video quality.

Compare critical candidates pairwise, select one with a concrete viewing reason, and keep the rejected hypotheses visible in state. Review and repair the weakest semantic interval, not an arbitrary fixed duration. Numeric scores are optional diagnostics and never authorize delivery.

### 5. Final Delivery

Stop at `Preview Lock`. Approval requires an actual full preview, readable proof and subtitles, acceptable sync, no unresolved blockers, and a real-device platform check.

Transfer the preview to the phone locally by default. Uploading a native platform draft, publishing, or creating a remote project requires explicit user authorization.

After publishing, record one executable learning:

`observation -> timestamp/data -> likely cause -> one change next time -> comparison metric`

## Anti-PPT Remotion Rules

- Design the picture before choosing components or APIs.
- Give each scene one visible knowledge change.
- Separate narration and screen roles. Do not paste the spoken sentence onto the canvas.
- Prefer semantic motion verbs: `reveal`, `compare`, `trace`, `build`, `transform`, `hold`, `resolve`.
- Let important scenes show a before state, a transformation, and an after state.
- A subtitle, label, or annotation update does not count as the scene's visual state change.
- For faceless voice-led videos, treat strong full-frame animation as possible A-roll: it must carry a continuous object/state transformation tied to the voice, not merely decorate captions.
- Use a hero frame only when one scene genuinely carries the film's visual proof or payoff.
- Create contrast across adjacent scenes: scale, temperature, density, shot grammar, or energy must change for a reason.
- Preserve a visual anchor across adjacent scenes when it helps continuity.
- At phone size, the essential semantic actor must remain immediately identifiable; large decorative negative space cannot excuse postage-stamp subjects.
- Allow stillness, holds, silence, and whitespace. Constant movement is not quality.
- Choose source proof, programmatic diagrams, generated plates, footage, 3D, or UI capture according to the scene job.

The following are not default gates:

- L2 or L3 API quotas
- mandatory camera travel or scale amplitude
- mandatory `spring()`, particles, parallax, 3D, or physics
- one asset per noun
- mandatory analogy or generated physical metaphor
- mandatory Open Design, GitHub, Lottie, GSAP, HyperFrames, Spark, or image-generation intake
- a full multi-layer director board for every scene

Use [remotion-animation-depth.md](../xingchen-visual-compiler/references/remotion-animation-depth.md) only as an optional capability catalog.

A reference video's visual style is never a project default. Select it only through the conditional reference-style gate, record why it fits this thesis, list the traits to adapt, and list what must not be copied.

When learning from a public reference output, use [output-reconstruction-grammar.md](references/output-reconstruction-grammar.md). Analyze real streams, shot intervals, composition changes, motion, audio, and defects. Reconstruct the causal output grammar; do not copy prompt text, private implementation, branding, or a style name as strategy.

When reconstructing an account-visible workflow, paraphrase its decision contract and artifact ladder. Do not publish copied seed prompts. Preserve the separation between workflow skill, design style, and rendered output grammar.

## Lean Visual Intent

Do not leave quality methods as orphaned reading. When they can change the film, route them into one compact `extensions.visual_intent` object consumed by director board, art direction, compiler, and lookdev:

- scene job and optional hero scene: [visual-excellence-patterns.md](references/visual-excellence-patterns.md)
- low / medium / high sequence energy: [energy-density-map.md](references/energy-density-map.md)
- speech emphasis, pause, and turn cues: [speech-rhythm-engine.md](references/speech-rhythm-engine.md)
- contrast from the previous scene: [visual-contrast-system.md](references/visual-contrast-system.md)

Store only film-changing cues: `timeline_revision`, per-scene `job`, `energy`, `speech_cues`, `contrast_from_previous`, and critical `candidate_hypotheses`. `hero_scene_id` is optional. Do not copy the references' historical `visual.*`, StoryMother, Script Lock, or Visual Lock fields into Lean state.

## Mobile Readability

For Douyin-oriented `1920x1080` master layouts, start from:

- main subtitles: `58-64 px`
- thesis labels: `44-52 px`
- important node labels: `38-46 px`

Secondary labels must not carry essential meaning. Name semantic relationships directly instead of asking viewers to decode abstract loops or symbols.

The default creator-avatar asset is:

`C:\Users\liuzh\Pictures\04_AI生成图片\2026-05\ChatGPT Image 2026年5月7日 15_14_14.png`

Reuse this fixed cat-director asset instead of inventing a placeholder. A project may skip showing the avatar when it would weaken the thesis or proof, but it must record a concrete skip reason. Reusing the asset does not make the Shanghai-night visual style mandatory.

## State And Validation

For new projects, start from:

- [project-state.lean.template.json](templates/project-state.lean.template.json)
- [project-state.lean.schema.json](schema/project-state.lean.schema.json)

Validate with:

```powershell
node ./schema/validate-lean-project-state.mjs <project-state.json>
```

Before Preview Lock or delivery, verify that evidence is genuinely decodable:

```powershell
node ./scripts/verify-media-evidence.mjs <project-state.json>
```

The Lean validator also runs the agent-harness contract. For isolated checks use `node ./scripts/validate-agent-harness.mjs <agent-harness.json>`.

`script.timeline_revision` is the structure baseline. Every implemented scene and preview must match it. Increment it after speech, beat, timing, or A-roll structure changes; stale captions, MG, B-roll, music, scene previews, and full previews must be rebuilt or rechecked.

Lean critical-preview records keep two rendered candidates by default, or three when a documented tradeoff remains unresolved, plus the selected candidate and selection reason. `delivery.preview_review.revision_log` records only real before/after repairs by semantic interval. Scores may be recorded for comparison but cannot pass a project.

For Extended or legacy projects, keep using:

- [project-state.template.json](templates/project-state.template.json)
- [project-state.schema.json](schema/project-state.schema.json)
- `schema/validate-project-state.mjs`

Read [project-state-contract.md](references/project-state-contract.md) for mode resolution and compatibility.

## Route Owners On Demand

Load child skills only when their work is needed:

Dispatch-first rule: identify the next concrete deliverable, then dispatch only to the owner needed for that deliverable.

- evidence and script: `xingchen-editorial-room`, `xingchen-proof-pack`, `xingchen-script-polish`
- scene design: `xingchen-director-board`
- whole-piece visual language: `xingchen-art-direction`
- selected Vox-inspired editorial collage visual language, asset decomposition, and motion grammar: `xingchen-vox-collage`
- Remotion implementation: `xingchen-visual-compiler`
- actual preview review: `xingchen-lookdev`
- final rendering: `remotion-render-adapter`

Open Design originals, GSAP, Lottie, HyperFrames, Spark, AI video, stock footage, and reusable primitive systems are candidate resources. They are not planning authorities or mandatory intake lanes.

Read [family-dispatch-contract.md](references/family-dispatch-contract.md) when routing across child skills.

## Core Invariants

Lean mode blocks only the core rules defined in [lean-invariants.md](./references/lean-invariants.md) and [invariants.lean.json](./references/invariants.lean.json):

- `INV-STATE-TRUTH`
- `INV-SOURCE-PACK-TRACE`
- `INV-PROOF-TRUTH`
- `INV-AUDIO-TIMING-TRUTH`
- `INV-SCENE-COGNITIVE-JOB`
- `INV-MOBILE-READABILITY`
- `INV-REAL-PREVIEW-BEFORE-DELIVERY`
- `INV-FINAL-RENDER-JOB-TRACE`
- `INV-CREATOR-AVATAR-DEFAULT`
- `INV-REFERENCE-STYLE-CONDITIONAL`
- `INV-SEMANTIC-RELATION-EXPLICIT`
- `INV-AGENT-HARNESS-TRACE`
- `INV-ANTI-PPT-SEMANTIC-MOTION`
- `INV-SOURCE-LED-FILM`
- `INV-VOICE-LED-FACELESS`
All other historical invariants are Extended-mode rules or advisory checks unless the project explicitly opts into them.

## Skill Edit Mode
When the user asks to change or repair Xingchen skills, edit skill and reference files and run static validation only. Do not run a video project, install npm packages, render Remotion, or launch browsers unless the user explicitly asks to execute or retest production.
