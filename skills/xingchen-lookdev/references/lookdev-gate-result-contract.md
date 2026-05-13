# Lookdev Gate Result Contract

## Canonical Meaning

`lookdev-gate-result.json` is an execution artifact and audit record.

In Xingchen Next, the primary writeback target is `project-state.json.review.lookdev_gate_results`.

`aesthetic_review_findings` lives inside each `LookdevGateResult`, not as a parallel top-level review truth.

## Payload Shapes

Downstream consumers must distinguish two shapes:

- `legacy-import` audit objects copied verbatim from old bundles
- normalized evaluator results produced by the structural lookdev evaluator

Legacy-imported payloads may preserve older field names and nested structures. Normalized evaluator results should follow the fields in this contract.

## Minimum Fields

- `evaluation_id`
- `status`
- `rule_results`
- `blocking_scene_ids`
- `reason`
- `evaluated_at`
- `aesthetic_review_findings`

Optional but recommended when geometry issues are present:

- `geometry_findings`
- `vibemotion_candidate_findings`
- `unsupported_rule_ids`
- `manual_review_required_rule_ids`

Optional but recommended when taste is being judged:

- `selected_aesthetic_mode`
- `mode_tradeoff_notes`

## Status Model

`status` should make incompleteness explicit.

Recommended values:

- `passed`
- `failed`
- `manual_review_required`

Use `manual_review_required` when the gate includes required rules that the evaluator cannot compute yet.

Use it as well when taste, reference fit, style consistency, voice authenticity, or audio mix posture cannot be defended automatically.

## `rule_results`

Each rule result should include:

- `rule_id`
- `status`
- `scene_ids`
- `metric_value`
- `threshold`
- `message`

Recommended rule result statuses:

- `passed`
- `failed`
- `unsupported`
- `not_evaluated`

## `aesthetic_review_findings`

Each aesthetic finding should include:

- `finding_id`
- `scene_ids`
- `rule_id`
- `status`
- `observation`
- `recommended_action`

When the review is judging taste, mode fit, hero-frame strength, color-script continuity, style consistency, voice authenticity, or mix quality, the finding should say so plainly instead of hiding behind a generic pass/fail note.

## `vibemotion_candidate_findings`

When the project uses VibeMotion Candidate Pass, each finding should state:

- whether selected candidate artifacts exist
- whether outputs are actual motion artifacts, not text-only descriptions
- whether the candidate preserves approved script and proof meaning
- whether Remotion promotion is recorded before any candidate proceeds toward final render

## Propagation Rules

- every blocked render must point to concrete scene ids when possible
- advisory failures may warn, but must not masquerade as pass
- unsupported blocking rules must be called out explicitly instead of being treated as pass
- geometry blockers from scene composition audit should be preserved explicitly instead of flattened into one vague `reason`
- missing or text-only VibeMotion candidates must block candidate-based approval
- if any blocking machine rule fails, overall `status` must be `failed`
- if no blocking machine rule fails, but any required review-only or aesthetic rule is unresolved, unsupported, or not evaluated, overall `status` must be `manual_review_required`
- `passed` is allowed only when all blocking rules pass and no required review-only rule remains unresolved
- write the same status to file and state when both outputs exist
- do not let the json audit artifact outrank the state-backed result once state exists
- do not hide an aesthetic disagreement inside a generic motion or geometry comment
