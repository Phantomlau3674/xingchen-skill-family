# Approval Contract

## ApprovalDecision

Store each checkpoint as an `ApprovalDecision` inside `project-state.json.workflow.approvals`.

Minimum fields:

- `checkpoint`
- `status`
- `reviewer`
- `reason`
- `blocked_fields`
- `created_at`
- `updated_at`

Allowed `status` values:

- `pending`
- `approved`
- `rejected`
- `superseded`
- `manual_review_required`

`manual_review_required` is valid only on `Lookdev Approval` and on aesthetic-check gates that an automated rule cannot defend yet (INV-NO-SILENT-PASS). It still requires explicit human override before downstream stages may proceed. The four content locks (`Topic Lock`, `Script Lock`, `StoryMother Lock`, `Visual Lock`) require `approved` — they do not accept `manual_review_required` as a bypass, because content correctness is not what `manual_review_required` is meant to defer.

## Hard Checkpoints

### `Topic Lock`

Locks:

- thesis
- audience
- goal

Blocks downstream:

- `script`
- `story-mother`
- `visual-direction`

### `Script Lock`

Locks:

- spoken wording
- narration spine
- proof boundaries
- beat truth

Blocks downstream:

- `story-mother`
- `visual-direction`
- `platform-adapt`
- `lookdev`
- `render`

### `StoryMother Lock`

Locks:

- `mother.story_mother.thesis`
- `mother.story_mother.scene_order`
- `mother.story_mother.scene_cards`
- `mother.story_mother.proof_binding`
- `mother.story_mother.narration_spine`

Blocks downstream:

- `visual-direction`
- `platform-adapt`
- `lookdev`
- `render`

### `Visual Lock`

Locks:

- `visual.director_board`
- `VisualPolicy`
- `lookdev_gate`
- scene motion intent
- derived director-board and art-direction review surfaces exported from current state

Blocks downstream:

- `platform-adapt`
- `lookdev`
- `render`
- publish-facing exports that claim final quality

### `Lookdev Approval`

Locks:

- `review.lookdev_gate_results[*]`
- preview slices used for approval
- preview audit findings

Blocks downstream:

- `render`
- publish-facing exports that claim final quality

## Rejection Rules

- rejected checkpoints must name the blocked fields explicitly
- a rejection must never be represented as silent inactivity
- downstream stages may keep drafts, but they must not be treated as approved truth
