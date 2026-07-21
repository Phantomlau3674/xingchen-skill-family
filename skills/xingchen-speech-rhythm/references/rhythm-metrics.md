# Speech Rhythm Metrics

## Core model

The engine treats speech rhythm as a rowset, not as a vibe:

```json
{
  "segment_id": "seg-001",
  "scene_id": "S01",
  "start": 0.0,
  "end": 2.4,
  "text": "",
  "char_count": 22,
  "cpm": 550,
  "pause_after_ms": 420,
  "density": "normal",
  "term_load": "professional_term",
  "beat_job": "definition",
  "flags": ["term_too_fast"],
  "visual_hint": "definition needs on-screen support"
}
```

For Chinese narration, count CJK characters plus spoken alphanumeric tokens. Ignore punctuation when calculating speed, but preserve punctuation for sentence splitting.

## Planning bands

These are defaults, not a universal law:

| Beat type | Target cpm | Purpose |
|---|---:|---|
| hook spike | 320-480 | urgency without losing the core question |
| anchor claim | 180-260 | make the thesis land |
| normal explanation | 260-380 | comfortable reasoning |
| professional term / definition | 180-300 | give comprehension space |
| connective tissue | 380-520 | move between ideas |
| payoff | 220-340 | let the conclusion feel earned |

Sustained speed above `520 cpm` is risky. It can work for short connective lines, but it should be followed by a pause, a simpler line, or a visual support beat.

## Diagnostic rules

- `term_too_fast`: professional-term or definition segment above the segment median cpm.
- `dense_without_pause`: dense segment with `pause_after_ms < 300`.
- `flat_run`: 5 or more adjacent segments within +/-10% of median cpm.
- `sustained_fast`: 3 or more adjacent segments above `480 cpm`.
- `anchor_too_fast`: anchor claim or conclusion above `320 cpm`.
- `dead_air`: pause over `1800 ms` without scene-break or reset purpose.
- `healthy_breath`: pause `500-1200 ms` after a dense or anchor segment.

## Rhythm score

Use the score to guide review, not to pretend speech has a single truth.

Suggested components:

- variation: normalized cpm standard deviation
- slowdown discipline: professional-term segments below or near median speed
- breath discipline: dense segments followed by adequate pauses
- flatness penalty: longest flat run
- sustained speed penalty: number and length of fast clusters

## State writeback

### `script.speech_rhythm_plan`

```json
{
  "status": "planned",
  "skill_ref": "xingchen-speech-rhythm",
  "source_ref": "script.spoken_script",
  "plan_path": "speech-rhythm-plan.md",
  "plan_json_path": "speech-rhythm-plan.json",
  "target_profile": "high-density conversational explainer",
  "beats": [],
  "risk_notes": [],
  "not_needed_reason": ""
}
```

Allowed `status`: `planned`, `manual_review_required`, `not_needed`, `blocked`.

### `sources.speech_rhythm`

```json
{
  "status": "completed",
  "skill_ref": "xingchen-speech-rhythm",
  "source_srt_path": "audio.srt",
  "analysis_path": "speech-rhythm-analysis.md",
  "analysis_json_path": "speech-rhythm-analysis.json",
  "chart_path": "speech-rhythm-chart.html",
  "summary": {},
  "segments": [],
  "visual_handoff": {
    "anchor_beats": [],
    "slowdown_beats": [],
    "transition_pauses": [],
    "rushed_terms": [],
    "flat_runs": []
  },
  "manual_review_notes": ""
}
```

Allowed `status`: `completed`, `manual_review_required`, `not_needed`, `blocked`.

## Visual handoff

- slow anchor beat -> title emphasis, proof push-in, held frame, or diagram stabilization
- professional term slowdown -> keyword lock, glossary chip, schematic label, or example overlay
- fast connective line -> subtitle-only or small motion bridge
- healthy breath -> transition, camera reset, proof scan, or chapter beat
- flat run -> introduce visual contrast or rewrite pacing before render
- dense rushed line -> split sentence, rerecord, or provide stronger visual scaffolding

## Baseline usage

Tom's Tim analysis suggests the useful pattern: high information density becomes watchable when sentence speed varies and professional/dense lines receive slowdowns. Do not copy title cards, exact charts, or identity. Copy the measurable discipline.
