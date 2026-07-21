---
name: xingchen-transcribe
description: Use when raw narration takes such as .mp3, .wav, .m4a, or .webm need cleanup, transcript truth, and pacing evidence before the Xingchen Next editorial pipeline begins.
---

# Xingchen Transcribe

## Knowledge Base Routing

For reusable video methodology, read stevenmind first:

- `C:\stevenmind\stevenmind\04 Wiki\视频创作\`
- `C:\stevenmind\stevenmind\04 Wiki\共享方法论\`
- `C:\stevenmind\stevenmind\04 Wiki\技术栈\`
- `C:\stevenmind\stevenmind\04 Wiki\抖音\` non-legacy pages

Do not read `C:\stevenmind\stevenmind\04 Wiki\公众号创作\`. That domain belongs to `wechat-*`.

Use local `references/`, `schema/`, and validators for executable contracts only: state fields, route policies, INV rules, validator logic, runtime commands, and rollback evidence. If a wiki page and a local reference overlap, use the wiki for method wording and the local reference for machine/state requirements.

Before crossing domains, verify with:

```powershell
python C:\stevenmind\stevenmind\tools\vault_manager.py read-check --root C:\stevenmind\stevenmind --skill xingchen-next --page "{page}"
```
## Mode

- Lean: run early in `brief-evidence` or `script-beats`. Record audio and transcript artifacts in `brief.sources[]`, the accepted timing source in `script.audio_ref`, and cleanup truth in `extensions.recording_truth`. Increment `script.timeline_revision` after any structural audio edit.
- Extended or legacy: keep the historical `ingest` and `sources.*` writebacks below.

Do not write Extended `sources.transcript`, `sources.recording_correction`, or `sources.speech_rhythm` objects into a Lean state.

## When to enter

Triggered when a project starts from human-recorded narration or has audio takes that must drive timing truth. Runs before visual direction. Default language is Chinese. Do not use for synthetic narration generation — this skill only consumes audio that already exists.

## State Writeback

Exported review surfaces in both modes: `transcript.tsv`, `recording-cleanup-report.md`, cleaned wavs or accepted original audio paths.

Lean writeback: `brief.sources[]`, `script.audio_ref`, `script.timeline_revision`, and compact `extensions.recording_truth` paths, correction actions, pronunciation locks, and rhythm handoff.

Extended writeback: `sources.transcript.segments`, `sources.recording_correction`, and voice-led `sources.speech_rhythm`.

## Ironclad rules

- Recorded takes are canonical truth; old script wording is a matching aid only.
- Do not decide final scene boundaries here — those are editorial decisions.
- Do not silently replace a human-recorded project with full synthetic narration because a few scenes were weak. Selective scene-level repair must be tracked in a manifest.
- Do not hand off to visual-direction until recording correction is written to `extensions.recording_truth` in Lean or `sources.recording_correction` in Extended. Visual design starts from corrected transcript/rhythm truth, not raw audio guesswork.
- Do not treat transcript timing as complete rhythm evidence until `xingchen-speech-rhythm` has analyzed the SRT or transcript segments, or the mode-appropriate rhythm record says `not_needed` with a reason.

Other shared rules: see [cross-skill-invariants.md](../xingchen-next/references/cross-skill-invariants.md).

## Skill-local procedure

### Runtime contract

Use the persistent Xingchen runtime, not an ad hoc install in a project folder:

```powershell
& C:\Users\liuzh\.codex\runtimes\xingchen-next\.venv\Scripts\python.exe scripts\transcribe_faster_whisper.py --audio take1.mp3 take2.mp3 take3.mp3 --out-dir . --language zh --model small --device cpu --compute-type int8
```

The helper writes `transcript.tsv` and `recording-cleanup-report.md`. In Lean mode, omit `--state` and write the compact Lean fields after review. In Extended mode, `--state project-state.json` may write the historical `sources.*` fields. Model files must download to `C:\Users\liuzh\.codex\models\huggingface`, not a temporary folder. Runtime details and machine checks live in [local-runtime-environment.md](../xingchen-next/references/local-runtime-environment.md).

For Extended state only, confirm `sources.recording_correction` after the helper runs:

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

### Extended transcript segment shape

Each segment in `sources.transcript.segments` carries: `start`, `end`, `speaker`, `text`, `pause_after_ms`, `speech_rate`, `scene_break_hint`, `tone_shift`. Recording-first projects also carry `take_id`, `source_file`, `confidence`, `cleanup_action`, `pronunciation_lock` when relevant.

### Cleanup-first pass (recording-first only)

Before locking transcript truth:

- clean obvious accidental tail, duplicated bridge, or dead trailing silence
- keep natural breath, cadence, and spoken endings unless clearly accidental
- review the tail transcript before trimming so a valid ending is not cut by waveform guesswork
- preserve cross-file continuity when one spoken idea spans take files
- document every cleanup decision in `recording-cleanup-report.md`

Posture: remove accidents, keep performance, never polish into synthetic smoothness.

After this mechanical pass, reread the refreshed transcript and latest accepted timeline. Only then hand semantic cutting to `xingchen-editorial-room`. Never make meaning-level keep/remove decisions from the pre-clean transcript, and never let this skill decide final scene structure.

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

### Speech rhythm handoff

After transcript correction, route to `xingchen-speech-rhythm` in analysis mode when the project is voice-led or recording-first. The handoff should provide the SRT path or corrected segments, cleaned/accepted audio refs, and any known term locks. In Lean, write artifact paths and accepted per-scene cues to `extensions.recording_truth.rhythm` and `extensions.visual_intent`; in Extended, the expected writeback is:

```json
{
  "sources": {
    "speech_rhythm": {
      "status": "completed",
      "skill_ref": "xingchen-speech-rhythm",
      "source_srt_path": "audio.srt",
      "analysis_path": "speech-rhythm-analysis.md",
      "analysis_json_path": "speech-rhythm-analysis.json",
      "chart_path": "speech-rhythm-chart.html",
      "visual_handoff": {}
    }
  }
}
```

If SRT timing is too noisy, set `manual_review_required` or `blocked`; do not let visual-direction infer cadence from raw audio.

## References

- [voice-clone-playbook.md](../xingchen-next/references/voice-clone-playbook.md) when cloned narration is involved
- [local-runtime-environment.md](../xingchen-next/references/local-runtime-environment.md) for persistent local runtime paths and checks
- [codex-runbook.md](../xingchen-next/references/codex-runbook.md) — `ingest` stage

## Handoff

After transcription and recording correction: hand to `xingchen-speech-rhythm` for voice-led SRT rhythm analysis, then to `xingchen-asset-intake` if screenshots matter, otherwise to `xingchen-editorial-room`. Do not start `xingchen-director-board` until the mode-appropriate recording and rhythm records are `completed`, `manual_review_required`, or explicitly `not_needed` where allowed.
