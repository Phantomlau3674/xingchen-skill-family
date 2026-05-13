---
name: xingchen-transcribe
description: Use when raw narration takes such as .mp3, .wav, .m4a, or .webm need cleanup, transcript truth, and pacing evidence before the Xingchen Next editorial pipeline begins.
---

# Xingchen Transcribe

## When to enter

Triggered when a project starts from human-recorded narration (recording-first) or has audio takes that must drive timing truth. Runs early in `ingest`, before or alongside `xingchen-asset-intake`. Default language is Chinese. Do not use for synthetic narration generation — this skill only consumes audio that already exists.

## Stage owned

`ingest` | writeback: `project-state.json -> sources.transcript.segments` and `project-state.json -> sources.recording_correction`. Exported review surfaces: `transcript.tsv`, `recording-cleanup-report.md`, cleaned wavs or accepted original audio paths.

## Ironclad rules

- Recorded takes are canonical truth; old script wording is a matching aid only.
- Do not decide final scene boundaries here — those are editorial decisions.
- Do not silently replace a human-recorded project with full synthetic narration because a few scenes were weak. Selective scene-level repair must be tracked in a manifest.
- Do not hand off to visual-direction until recording correction is written. Visual design starts from corrected transcript/rhythm truth, not raw audio guesswork.

Other shared rules: see [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md).

## Skill-local procedure

### Runtime contract

Use the persistent Xingchen runtime, not an ad hoc install in a project folder:

```powershell
& C:\Users\liuzh\.codex\runtimes\xingchen-next\.venv\Scripts\python.exe scripts\transcribe_faster_whisper.py --audio take1.mp3 take2.mp3 take3.mp3 --state project-state.json --out-dir . --language zh --model small --device cpu --compute-type int8
```

The helper writes `transcript.tsv`, `recording-cleanup-report.md`, optional `project-state.json -> sources.transcript.segments`, audio manifest entries, and `project-state.json -> sources.recording_correction`. Model files must download to `C:\Users\liuzh\.codex\models\huggingface`, not a temporary folder. Runtime details and machine checks live in [local-runtime-environment.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\local-runtime-environment.md).

Confirm `sources.recording_correction` after the helper runs:

```json
{
  "status": "completed",
  "source_audio_refs": [],
  "cleaned_audio_paths": [],
  "transcript_path": "transcript.tsv",
  "cleanup_report_path": "recording-cleanup-report.md",
  "correction_actions": [],
  "quality_checks": [],
  "manual_review_notes": ""
}
```

When the helper does not destructively trim audio, `cleaned_audio_paths` may list the accepted original audio paths. Use `manual_review_required` only when the corrected transcript/rhythm is usable but a human should accept a pronunciation, noise, trim, or cadence issue. Use `blocked` when the recording cannot safely drive visual design.

### Transcript segment shape

Each segment in `sources.transcript.segments` carries: `start`, `end`, `speaker`, `text`, `pause_after_ms`, `speech_rate`, `scene_break_hint`, `tone_shift`. Recording-first projects also carry `take_id`, `source_file`, `confidence`, `cleanup_action`, `pronunciation_lock` when relevant.

### Cleanup-first pass (recording-first only)

Before locking transcript truth:

- clean obvious accidental tail, duplicated bridge, or dead trailing silence
- keep natural breath, cadence, and spoken endings unless clearly accidental
- review the tail transcript before trimming so a valid ending is not cut by waveform guesswork
- preserve cross-file continuity when one spoken idea spans take files
- document every cleanup decision in `recording-cleanup-report.md`

Posture: remove accidents, keep performance, never polish into synthetic smoothness.

### Pronunciation and reading locks

For knowledge videos with product names, CLI commands, or mixed Chinese-English terms:

- capture pronunciation locks for unstable terms before transcript approval
- keep the chosen reading consistent across all takes once locked
- if the spoken explanation paraphrases an on-screen command, mark that distinction; do not "correct" the transcript to literal UI text
- if a command is spoken verbatim, it must stay consistent with the eventual on-screen proof

### Selective repair, not full replacement

When a few scenes need fix-ups after the main take:

- prefer scene-level rerecord or `voicefix` outputs over full regen
- maintain a manifest of repaired scenes and their replacement wav paths
- repaired scenes must match surrounding human cadence closely enough to survive edit and render

### Pause and pacing hints

- `pause_after_ms >= 1500` → `scene_break_hint: strong`
- `pause_after_ms >= 800` → `scene_break_hint: weak`
- adjacent `speech_rate` differing by >30% → `tone_shift: true`

These are hints, not binding scene decisions.

## References

- [voice-clone-playbook.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\voice-clone-playbook.md) when cloned narration is involved
- [local-runtime-environment.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\local-runtime-environment.md) for persistent local runtime paths and checks
- [codex-runbook.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\codex-runbook.md) — `ingest` stage

## Handoff

After transcription and recording correction: hand to `xingchen-asset-intake` if screenshots matter, otherwise to `xingchen-editorial-room`. Do not start `xingchen-director-board` until `sources.recording_correction.status` is `completed` or `manual_review_required`.
