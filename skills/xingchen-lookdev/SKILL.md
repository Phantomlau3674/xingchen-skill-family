---
name: xingchen-lookdev
description: Review actual Xingchen and Remotion clips for comprehension, proof truth, mobile readability, sync, continuity, anti-PPT quality, and Preview Lock evidence. Lean mode uses rendered evidence and the preview scorecard; Extended and legacy projects use the historical contract.
---

# Xingchen Lookdev

Judge the viewing experience, not planning completeness.

## Mode

Read `project-state.json`.

- `mode: "lean"`: follow this file.
- `mode: "extended"` or legacy state without `mode`: read [extended-contract.md](references/extended-contract.md).

Lean rules override conflicting requirements in every template or reference loaded by this skill. Historical five-lock, chrome-whitelist, continuous-motion, L2/L3, camera-amplitude, package, and complete-board blockers are Extended-only.

## Required Lean Evidence

Review:

1. two hook candidates by default; a third only for an unresolved tradeoff
2. two hardest-proof candidates by default; a third only for an unresolved tradeoff
3. two payoff candidates by default; a third only for an unresolved tradeoff
4. the complete preview
5. a real-phone playback, transferred locally by default

All clips use the accepted script audio. Static boards, source code, API grep, and isolated stills cannot replace playable evidence.

When a scene has checkpoint evidence, use its declared profile: MG/diagram `entry-settled-exit`, proof `context-detail-hold`, footage `cut-in-action-peak-exit`, talking head `face-gesture-handoff`, or montage `group-open-rhythm-peak-group-exit`. Frames catch composition defects; clips remain the authority for timing, continuity, and sound.

## Structured Preview Evidence

Write `delivery.critical_previews[]` with exactly one of each role:

- `hook`
- `hardest-proof`
- `payoff`

Each record includes:

- two decodable local candidate clips with different hypotheses, or three when the unresolved tradeoff is recorded
- selected candidate id, selected path, and a concrete viewing reason
- matching `script.audio_ref`
- positive duration
- `phone-downsample` viewport
- matching `script.timeline_revision`
- review time

Write equivalent evidence to `delivery.full_preview`.

## Review Procedure

### Critical Candidate Challenge

Randomize candidate labels when practical. Watch pairwise with real audio and phone downsampling. Keep speech span, dimensions, and encoding conditions comparable. Reject a candidate if it improves spectacle while reducing comprehension, proof trust, or continuity.

Check:

- the subject is visible immediately
- proof remains readable without pausing
- subtitle, thesis, and important-node hierarchy survives
- motion reveals meaning rather than decorating a card
- a diagram directly states its big question, small question, and relationship
- scene-specific checkpoints expose the right risk rather than forcing one visual grammar
- adjacent scenes vary shot grammar, scale, density, temperature, or energy for a semantic reason
- a hero frame is judged only when `hero_scene_id` is intentionally selected
- voice remains dominant; music ducks under dense speech; sound effects punctuate only meaningful peaks
- transition endpoints do not jump, and the handoff still works with both adjacent scenes visible
- effects preserve skin, highlight detail, natural blacks, source text, and proof contrast

Write the selected candidate and why it won. Preserve rejected candidates and hypotheses so a later full-piece regression can reverse the choice.

### Blind Full-Piece Review

Without reading planning fields, ask the reviewer to:

- restate the thesis
- identify confusing exits
- name the least trusted proof
- describe the main relationship in diagram scenes

Then identify the weakest semantic interval, whatever its length. For every repair, append `preview_review.revision_log[]` with scene id, interval, issue, action, real before/after artifacts, status, and verification time. Rewatch adjacent scenes after the local fix.

Run three failure-specific passes before choosing that interval:

- `caption-only-static`: hide subtitles and exact labels; if the picture no longer changes or advances meaning, captions were masking a static scene;
- `semantic-subject-too-small`: at phone size, confirm the essential actors and their relationship remain identifiable without zooming, even when all text is readable;
- `transition-anchor-break`: watch the previous scene, the interval, and the next scene together; require one carried physical anchor or record an intentional world reset.

Do not convert these checks into a constant-motion rule. A deliberate hold is valid when the held image carries the active idea and the review says why it should remain still.

### Platform Draft

Record the real device and check time. Verify safe regions, crop, subtitle size, proof visibility, and audio behavior. Transfer locally by default. Do not upload a platform draft, publish, or create a remote project without explicit user authorization.

## Preview Decision

Use [preview-quality-scorecard.md](../xingchen-next/references/preview-quality-scorecard.md) and [lean-invariants.md](../xingchen-next/references/lean-invariants.md).

Use the seven dimensions as diagnostic prompts, not a release equation. Numeric scores are optional and advisory. Preview Lock requires real candidate selection, a current full preview, completed blind review, real-device platform check, and no blocking issue.

## Machine Checks

Use automation for:

- missing, empty, black, or transparent media
- asset failures
- text overflow and safe-region overlap
- proof distortion
- audio/subtitle timing drift
- deterministic render failures

Run the actual media verifier before visual review:

```powershell
node ..\xingchen-next\scripts\verify-media-evidence.mjs <project-state.json>
```

It uses `ffprobe` plus full FFmpeg decode. File existence, extension, and API presence are not media proof.

Do not use API presence, particle count, camera amplitude, L2/L3 labels, or constant motion as quality scores.

## Creator And Style Checks

When the avatar appears, verify it is the fixed cat-director asset and does not cover proof or subtitles.

Run style-specific checks only when `visual_policy.reference_style.selected` is `true`. An unselected reference style cannot add blockers.

## Preview Lock

Approve `Preview Lock` only after all structured evidence is decodable, every preview matches the current `script.timeline_revision`, candidate winners survive the assembled full piece, and no blocker remains.

Preview Lock authorizes entry into `final-delivery`; it does not claim that the final render already exists.

Write failures with scene ids or timestamps and repair the narrowest artifact.
