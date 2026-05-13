---
name: xingchen-script-polish
description: Use when an approved short-video outline needs narration polishing, term locking, spoken-vs-screen separation, and state-backed beat mapping before scene direction or render work.
---

# Xingchen Script Polish

## When to enter

Triggered during `script` stage, after `xingchen-proof-pack` and before `xingchen-visual-compiler`. The thesis and scene order are approved but the lines still feel rough; the spoken script needs better pacing or clarity; on-screen text duplicates narration; or key terms must stop drifting. Default language is Chinese. Do not embed renderer component names, coordinates, or animation code here.

## Stage owned

`script` | writeback: `project-state.json -> script` (and the Script Lock approval). Exported review surfaces: `spoken-script.md`, `slides.md`, `beat-map.json`, `script-polish-notes.md`.

## Ironclad rules

- INV-SCRIPT-LOCK-BEFORE-MOTHER: do not hand off to `story-mother` work until Script Lock is approved.
- Do not introduce new claims that are missing from the proof pack.
- Do not let synonyms drift once a term is locked; downstream motion follows term emphasis.

Other shared rules: see [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md).

## Skill-local procedure

### Spoken script contract

- keep each scene aligned to the approved scene card
- spoken narration may be richer than on-screen copy, but it must preserve the approved claim
- preserve user phrasing when it is stronger than a rewrite

### On-screen text contract

- short, structural, easy to scan
- do not paste full narration onto the screen
- screen text supports scene intent; it does not duplicate every spoken line

### Beat-map contract

`beat-map.json` is timing truth for downstream motion, not a render recipe. Each scene entry includes:

- `scene_id`
- `emphasis_beats` — each with `cue_text`, `strength`, `offset_hint_ms`, `beat_type`
- `pause_points`
- `keyword_locks`
- optional `subtitle_density`

### Operations

- tighten hook and scene-level wording without changing claim intent
- split narration from display copy
- normalize locked terms across every scene
- map emphasis, pause, and verbal landing points
- record deliberate tradeoffs in `script-polish-notes.md`

If the thesis must change after approval, reopen editorial review explicitly rather than mutating the locked script in place.

## References

- [codex-runbook.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\codex-runbook.md) — `script` stage
