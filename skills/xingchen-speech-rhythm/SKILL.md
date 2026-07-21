---
name: xingchen-speech-rhythm
description: Use when Xingchen Next needs pre-recording narration rhythm planning, post-recording SRT rhythm analysis, Tim/Tom-style speech-rate scatter diagnostics, or speech rhythm handoff into script, StoryMother, director-board, and Remotion timing.
---

# Xingchen Speech Rhythm

## Project State Mode

- Lean: store analysis artifact paths and accepted rhythm truth in `extensions.recording_truth.rhythm`; route only film-changing per-scene emphasis, pause, and turn cues into `extensions.visual_intent`. Do not add historical `script.speech_rhythm_plan`, `sources.speech_rhythm`, `visual.*`, StoryMother, Script Lock, or Visual Lock fields.
- Extended or legacy: keep the historical state fields below.

The `plan`, `analysis`, and `compare` operations are independent of the project state mode.

## When to enter

Use this skill in two modes:

- `plan`: during Lean `script-beats` or Extended `script`, when spoken narration needs pacing design before recording.
- `analysis`: during Lean `brief-evidence` / `script-beats` or Extended `ingest`, after transcript/SRT exists, when the actual take needs rhythm diagnostics.
- `compare`: after both exist, compare planned rhythm against the actual SRT and write correction notes.

This skill is a supporting skill. It does not replace `xingchen-script-polish`, `xingchen-transcribe`, `xingchen-editorial-room`, or visual-direction skills. It gives them rhythm truth.

## State Writeback

Lean writes only:

- `extensions.recording_truth.rhythm` artifact paths, status, and comparison notes
- `extensions.visual_intent` per-scene `speech_cues` that actually change timing or picture

Extended may write:

- `script.speech_rhythm_plan`
- `sources.speech_rhythm`
- optional `visual.recording_visual_brief.speech_rhythm_ref`
- optional `script.beat_map.scenes[].rhythm_cues`

Review artifacts:

- `speech-rhythm-plan.md`
- `speech-rhythm-plan.json`
- `speech-rhythm-analysis.md`
- `speech-rhythm-analysis.json`
- `speech-rhythm-chart.html`
- `speech-rhythm-delta.md`

## Ironclad rules

- Rhythm is not decoration. It protects comprehension, attention, and the feeling of live thinking.
- Do not judge quality by word count alone. Analyze sentence speed, variation, pauses, and whether dense/professional terms slow down.
- Do not change claims or proof boundaries. Route claim changes back to editorial or script-polish.
- Do not use the Tim/Tom sample as a style costume. Use it as a measurable baseline: ordinary voice can feel premium when rhythm creates comprehension space.
- For recording-first projects, do not let visual-direction start from raw audio guesswork. Use corrected transcript/SRT plus rhythm analysis.

## Procedure

### 1. Plan mode

Input: `script.spoken_script`, `spoken-script.md`, or a pasted draft.

Produce a sentence/beat table:

- `beat_id`
- `scene_id`
- `text`
- `beat_job`: `hook`, `context`, `proof`, `turn`, `definition`, `example`, `payoff`, `close`
- `density`: `light`, `normal`, `dense`
- `term_load`: `none`, `topic_term`, `professional_term`
- `target_rate_cpm`
- `target_pause_after_ms`
- `delivery_note`
- `visual_hint`

Default Chinese pacing bands:

- anchor claim / conclusion: `180-260 cpm`
- normal explanation: `260-380 cpm`
- connective or setup line: `380-520 cpm`
- sustained `>520 cpm`: risky unless it is short and followed by a pause

Professional terms, new definitions, and key judgments should slow down or receive a visible support beat.

### 2. Analysis mode

Input: SRT, transcript segments, or corrected transcript TSV with timestamps.

For each segment or sentence, compute:

- duration
- character count
- characters per minute (`cpm`)
- pause after
- relative speed band
- term/density tags
- flags: `too_fast`, `too_slow`, `flat_run`, `dense_without_pause`, `term_too_fast`

Project-level metrics:

- mean/median cpm
- cpm standard deviation
- rhythm variation score
- pause distribution
- percent of professional-term segments below median cpm
- longest flat run
- sustained-fast risk
- comprehension pressure notes

### 3. Compare mode

Compare the plan artifact against the accepted analysis artifact. In Extended these may also be mirrored in `script.speech_rhythm_plan` and `sources.speech_rhythm`:

- planned slowdowns that were missed
- actual pauses that create scene-break opportunities
- rushed definitions that need rerecording or visual support
- dead-flat runs that need rewrite, cutaways, or breath points
- useful spontaneous cadence to preserve

## Handoff

- To `xingchen-script-polish`: rewrite dense or flat narration before Lean `Content Lock` or Extended Script Lock.
- To `xingchen-transcribe`: request correction or manual review when SRT timing is unreliable.
- To `xingchen-editorial-room`: propose scene boundaries from strong rhythm breaks; editorial makes the semantic decision.
- To `xingchen-director-board`: use slow/proof beats as visual anchors, pauses as transitions, fast connective beats as lightweight motion.
- To `xingchen-visual-compiler` / `remotion-render-adapter`: compile rhythm cues into subtitle grouping, proof reveals, transitions, and scene timing.

## References

- [rhythm-metrics.md](./references/rhythm-metrics.md)
- [cross-skill-invariants.md](../xingchen-next/references/cross-skill-invariants.md)
- [project-state-contract.md](../xingchen-next/references/project-state-contract.md)
