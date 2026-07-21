# Preview Quality Review

Judge rendered clips and the assembled preview. Planning completeness and self-reported totals are not video quality.

## Seven Diagnostic Dimensions

| Dimension | Required evidence |
|---|---|
| technical health | decodable media, expected streams, no deterministic render failure |
| mobile readability | phone downsample plus real-device check |
| voice, picture, and subtitle sync | accepted-audio watch |
| proof trust | source trace plus readable evidence treatment |
| transmitted meaning | blind restatement of the scene job and thesis |
| sequence rhythm | cuts, holds, transitions, and audio energy across adjacent scenes |
| visual craft | hierarchy, composition, contrast, specificity, and anti-template quality |

Use `pass`, `needs-revision`, or a short observation for each dimension. A numeric score may help compare versions, but it never authorizes Preview Lock and cannot offset a blocker.

## Critical Candidate Challenge

For `hook`, `hardest-proof`, and `payoff`:

1. render two candidates by default with the same accepted speech span, dimensions, and phone-downsample viewport; add a third only for an unresolved tradeoff
2. change one meaningful visual mechanism or evidence reveal per hypothesis
3. watch pairwise in randomized order when practical
4. reject spectacle that weakens comprehension, proof trust, or continuity
5. record the selected candidate and a concrete viewing reason; preserve losers for regression review

A still board, code path, or prose rationale cannot win the challenge.

## Scene-Specific Checkpoints

Checkpoints are optional composition diagnostics, not a universal release gate:

- motion graphic or diagram: `entry`, `settled`, `exit`
- source proof: `context`, `detail`, `hold`
- footage: `cut-in`, `action-peak`, `exit`
- talking head: `face`, `gesture`, `handoff`
- montage: `group-open`, `rhythm-peak`, `group-exit`

The playable clip remains authoritative for rhythm, easing, cuts, continuity, and sound.

## Full-Piece Review

1. Blind-watch the complete preview without planning fields.
2. Watch once with subtitles and exact labels hidden. Name the picture-state changes that still carry the narration; a changing caption is not motion evidence.
3. Restate the thesis, identify confusing exits, and name the least trusted proof.
4. Check whether critical candidate winners still work between their real neighboring scenes.
5. Inspect the phone downsample for semantic-subject scale. Essential actors and relationships must be identifiable without zooming; subtitle readability alone is insufficient.
6. At every cut, name one carried physical anchor such as a color field, rail, aperture, object, material, or motion vector. If the cut intentionally resets the world, record that reason.
7. Identify the weakest semantic interval, not a fixed number of seconds.
8. Classify it when applicable as `caption-only-static`, `semantic-subject-too-small`, or `transition-anchor-break` so the repair targets the actual failure.
9. Repair it and append a revision record with scene id, interval, issue, action, before/after artifacts, and verification time.
10. Rewatch the repaired interval with its adjacent scenes.
11. Check playback on a real phone; transfer locally by default and upload a platform draft only with explicit authorization.

During adjacent-scene review, verify transition endpoints do not jump, effects preserve skin and proof contrast, highlights are not clipped, blacks are not crushed, and music placement follows the accepted timeline rather than assuming generated beats are synchronized.

Intentional stillness is allowed. A long hold passes only when the held image itself carries the active idea and the review records why motion would weaken it.

Before judging polish, run the structural anti-PPT check. Recalculate duration-weighted card-like topology, repeated layout, and static-hold ratios from `extensions.agent_harness.scene_strategies`; do not trust manually asserted totals. Reject any ordinary film whose only mechanism is copy inside repeated panels, even when its easing and typography are clean. Passing this check only makes the preview eligible for taste review.

## Dependency Invalidation

`script.timeline_revision` is the structure baseline. Any speech, beat, timing, or A-roll structural change increments it. Scene implementations, captions, MG, B-roll, music, critical candidates, and full previews from older revisions are stale and must be rebuilt or rechecked.

## Machine Checks

Before visual judgment, run:

```powershell
node ./scripts/verify-media-evidence.mjs <project-state.json>
```

The verifier uses `ffprobe` and full FFmpeg decode. It checks actual streams and decode health rather than extensions or non-empty files. Use additional automation for black or transparent frames, text overflow, safe-region overlap, proof distortion, and subtitle drift when those detectors really exist. Do not claim an automated check that has not run.

## Preview Lock

Approve only when:

- every critical role has a selected, decodable candidate with a viewing reason
- the full preview uses the accepted audio and current timeline revision
- blind review and real-device platform review are complete
- no blocking issue remains
- local repairs have survived adjacent-scene and full-piece rewatch

## Post-Publish Learning

Record exposure, first-three-second retention, average watch time, completion, engagement, and repeated comment misunderstandings when available.

Write one next experiment:

`observation -> evidence -> likely cause -> one controlled change -> comparison metric`
