# Approval Contract

## Principle

Lean mode has two blocking decisions. Internal reviews may produce notes and revisions, but they do not become additional locks.

Store decisions in `workflow.approvals[]` with:

- `checkpoint`
- `status`
- `reviewer`
- `reason`
- `blocked_fields`
- `created_at`
- `updated_at`

Allowed statuses:

- `pending`
- `approved`
- `rejected`
- `superseded`
- `manual_review_required`

## Content Lock

`Content Lock` approves one coherent package:

- thesis
- audience and viewing goal
- complete spoken script
- factual claims and proof boundaries
- beat map
- timing basis or recording plan

It blocks `scene-production`.

Do not split this decision into Topic, Script, and StoryMother approvals in Lean mode. The user should judge the actual argument, not the router's internal decomposition.

Reject when a factual claim lacks a source, the thesis is unstable, the script is incomplete, or the beats do not support the intended runtime.

## Preview Lock

`Preview Lock` approves the actual viewing experience:

- a full playable preview with the real or accepted final audio
- pairwise rendered-candidate decisions for `hook`, `hardest-proof`, and `payoff`
- readable subtitles and key information on a phone-sized downsample
- trustworthy, legible proof geometry
- acceptable voice-picture-subtitle sync
- completed blind full-piece review
- no unresolved blocking issue
- a real-device playback check; local transfer is sufficient unless platform upload is explicitly authorized

It blocks `final-delivery`.

Preview evidence is structured, not a list of unchecked strings. Each critical role keeps two decodable candidates by default, or three when an unresolved tradeoff is documented, plus the selected candidate and viewing reason, accepted audio, positive duration, phone-downsample viewport, current timeline revision, and review time. The full preview records equivalent timing and revision evidence. Paths and candidate ids cannot repeat.

`Preview Lock` authorizes entry into `final-delivery`. It does not claim that the final render already exists.

`ffprobe` and full FFmpeg decode establish media truth. Machine checks still cannot approve taste, comprehension, rhythm, or trust by themselves. Numeric scores are optional diagnostics and never authorize the lock.

`manual_review_required` is allowed when automation cannot judge an aesthetic or comprehension issue. Final delivery still needs an explicit human decision.

## Rejection Rules

- Name the blocked fields, scene ids, or timestamps.
- Preserve drafts without presenting them as approved truth.
- Roll back only to the narrowest stage that can repair the issue.
- Do not convert rejection into a new permanent form field.

## Extended Compatibility

Extended and legacy projects may retain:

- `Topic Lock`
- `Script Lock`
- `StoryMother Lock`
- `Visual Lock`
- `Lookdev Approval`

When importing them into Lean mode, map the latest approved Topic, Script, and StoryMother decisions into `Content Lock`; map Visual and Lookdev evidence into `Preview Lock` only after a real full preview exists.
