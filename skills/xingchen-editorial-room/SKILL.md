---
name: xingchen-editorial-room
description: Use when a recording-first or source-pack-first short-video idea needs Chinese co-creation, thesis selection, hook drafting, scene ordering, and StoryMother locking before proof, script, and render work.
---

# Xingchen Editorial Room

## When to enter

Triggered during `research/proof` and continuing through `story-mother`. The user has a raw idea, transcript, or source pack, and the thesis, hook, or scene order is still unstable. Default language is Chinese. Do not use to choose visual templates, motion verbs, or render tactics — those belong downstream. Do not turn a proof scene into a vibes-only scene at the editorial layer.

## Stage owned

`research/proof` and `story-mother` | writeback: `project-state.json -> mother.story_mother` and `project-state.json -> workflow.approvals[Topic Lock]` and `[StoryMother Lock]`. Exported review surfaces: `editorial-brief.md`, `scene-board.md`.

## Ironclad rules

- INV-TOPIC-LOCK-FIRST and INV-MOTHER-LOCK-BEFORE-VARIANT both gate downstream work; do not hand off until checkpoint 2 is approved.
- Preserve the user's wording when it is stronger than a rewrite.
- Ask for concrete tradeoffs (2–3 options, then narrow) instead of jumping to a full draft.

Other shared rules: see [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md).

## Skill-local procedure

### StoryMother contract

The mother captures: `thesis`, `audience_promise`, `scene_order`, `scene_cards`, `narration_spine`, `visual_intent`. Each scene card carries: `scene_id`, `scene_job`, `must_believe`, `must_feel`, `must_remember`, one-screen takeaway, `proof_need`.

### Two approval checkpoints

1. **Topic Lock** — confirms thesis, hook, audience framing, and project-level believe / feel / remember.
2. **StoryMother Lock** — confirms the scene board: scene jobs and per-scene believe / feel / remember.

Do not hand off to proof, script, or visual work until checkpoint 2 is approved.

### Discussion order

Discuss in this order, two-to-three options at each step:

1. thesis options
2. hook direction
3. audience framing
4. scene order
5. scene job per scene
6. what each scene must make the viewer believe / feel / remember
7. closing line and takeaway

If a stronger term appears later (during script-polish or visual-direction), reopen editorial review explicitly rather than mutating the locked mother in place.

## References

- [story-mother-and-variants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\story-mother-and-variants.md)
- [codex-runbook.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\codex-runbook.md) — `research/proof` and `story-mother` stages
