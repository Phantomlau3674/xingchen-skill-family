# Stage Lifecycle

## Fixed Order

The default Xingchen Next stage order is:

1. `ingest`
2. `research/proof`
3. `script`
4. `story-mother`
5. `visual-direction`
6. `platform-adapt`
7. `lookdev`
8. `render`
9. `publish`
10. `review`

## Stage Ownership

- `ingest`: normalize `SourcePack`, transcript, asset manifest, screenshots, recordings, screen recordings, and source constraints
- `research/proof`: lock claims and evidence boundaries
- `script`: lock wording, spoken flow, and beat truth
- `story-mother`: lock the single approved mother
- `visual-direction`: lock `visual.director_board`, VisualPolicy, selected aesthetic mode, taste thesis, benchmark canon, anti-cheapness, hero-frame laws, hero-frame scene id, source-material plan, audio and voice policy, scene motion intent, scene composition truth, and VibeMotion/Hyperframes per-scene candidate options. Legacy `material_director_pass` may remain as compatibility evidence, but `director_board` is the primary Visual Lock gate.
- `platform-adapt`: derive `PlatformVariant` outputs
- `lookdev`: evaluate actual VibeMotion candidate videos or live preview slices, motion quality, aesthetic fit, chosen mode alignment, audio and voice fit, run scene composition audit, and enforce geometry stability plus machine gates
- `render`: execute code-first render jobs without mutating approved fit, crop, or distortion policy
- `publish`: record platform delivery facts
- `review`: record learning without mutating shipped truth

## Automatic Progress

Default behavior is automatic progression between stages when:

- required upstream sections exist
- no blocking approval is pending
- no validation rule is failing

## Required Stops

The pipeline must stop for a human decision at:

- `Topic Lock`
- `Script Lock`
- `StoryMother Lock`
- `Visual Lock`
- `Lookdev Approval`

## Failure Behavior

If a stage fails:

- keep `active_stage` at the failing stage
- write `workflow.blocked=true`
- write `workflow.blocking_reason`
- write a machine-readable error reference when available
- when the selected aesthetic mode or a benchmark canon cannot be defended automatically, route the issue to `manual_review_required` instead of forcing a generic pass
- when an aesthetic rule is unsupported, stop at `lookdev` and mark the result `manual_review_required` instead of guessing a pass
- when preview approval is unresolved, do not advance to `render` just because the machine checks passed

## Rollback Guidance

When a downstream stage invalidates an upstream assumption:

- roll back to the narrowest truthful stage
- do not wipe already-approved state without a reason
- preserve approval history and invalidation reason
