# Speech Rhythm Engine

This is the Xingchen Next integration contract for `xingchen-speech-rhythm`.

## Why it exists

Voice-led short videos fail when high-density narration becomes a flat wall of speech. The speech-rhythm engine turns script or SRT timing into rhythm truth shared by Lean visual intent, director board, and render timing. Extended projects may keep the historical StoryMother surfaces.

## Two entry points

### Pre-recording plan

Run during Lean `script-beats` before Content Lock, or during Extended `script` before Script Lock, when narration is being written or polished.

Inputs:

- `script.spoken_script`
- `spoken-script.md`
- proof terms and audience vocabulary limits

Outputs:

- `speech-rhythm-plan.md`
- `speech-rhythm-plan.json`
- Lean: selected cues in `extensions.visual_intent.scenes[].speech_cues`
- Extended: `project-state.json -> script.speech_rhythm_plan`

Use the plan to decide:

- where to slow down
- where to split sentences
- where to add a breath point
- which terms require on-screen scaffolding
- which beats should become visual anchors downstream

### Post-recording analysis

Run during `ingest` after `xingchen-transcribe` creates timestamped transcript or SRT truth.

Inputs:

- SRT or transcript segments
- `sources.recording_correction`
- optional pre-recording rhythm plan

Outputs:

- `speech-rhythm-analysis.md`
- `speech-rhythm-analysis.json`
- `speech-rhythm-chart.html`
- Lean: selected cues in `extensions.visual_intent.scenes[].speech_cues`
- Extended: `project-state.json -> sources.speech_rhythm`

Use the analysis to decide:

- whether the take can drive visual design
- whether dense or professional terms need rerecording
- where healthy pauses create scene transitions
- which rushed segments need visual compensation
- which spontaneous cadence should be preserved

## Project-state surfaces

Lean mode stores only render-changing cues under `extensions.visual_intent.scenes[].speech_cues`, tied to `script.timeline_revision`. A structural audio or beat change increments the revision and invalidates downstream use.

Extended projects may retain `script.speech_rhythm_plan`, `sources.speech_rhythm`, `visual.recording_visual_brief.speech_rhythm_ref`, and `script.beat_map.scenes[].rhythm_cues`.

## Visual handoff

Use the rhythm map as production evidence:

- slow anchor beat -> proof push-in, diagram stabilization, or held subtitle emphasis
- professional term slowdown -> keyword lock, glossary chip, label reveal, or example overlay
- fast connective line -> light subtitle motion or transition bridge
- healthy breath -> scene transition, camera reset, proof scan, or chapter marker
- flat run -> rewrite, add visual contrast, or change scene structure
- rushed dense line -> split, rerecord, or provide stronger visual scaffolding

## Gates

For narration-led projects:

- Lean before Content Lock: timing assumptions are explicit; after Content Lock, speech cues must match the current `script.timeline_revision`
- Extended before Script Lock: `script.speech_rhythm_plan.status` should be `planned`, `manual_review_required`, or `not_needed` with reason
- Extended before visual-direction in recording-first projects: `sources.speech_rhythm.status` should be `completed`, `manual_review_required`, or `not_needed` with reason
- `blocked` means keep the project upstream; do not compensate visually without user or editorial decision

## Non-goals

- It does not rewrite claims.
- It does not replace transcript correction.
- It does not select renderer families.
- It does not judge vocal timbre, microphone quality, or delivery charisma except where timing evidence supports a concrete note.
