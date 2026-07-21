# Stage Lifecycle

## Mode Resolution

New projects use `mode: "lean"`.

Use `mode: "extended"` only for legacy state, multi-party production, high-risk audit needs, complex platform matrices, custom 3D/world pipelines, or an explicit user request.

Never promote a project to Extended merely to make it look more ambitious.

## Lean Order

1. `brief-evidence`
2. `script-beats`
3. `scene-production`
4. `preview-revision`
5. `final-delivery`

## Stage Ownership

| Stage | Required outcome | Typical owner |
|---|---|---|
| `brief-evidence` | thesis, audience, goal, source list, claims and proof boundaries | `xingchen-editorial-room` with proof support as needed |
| `script-beats` | complete spoken script, beat map, timing basis | `xingchen-script-polish` |
| `scene-production` | scene-specific checkpoints when useful, two rendered candidates by default for each critical role, a third only for an unresolved tradeoff, then complete implementation | director board, art direction, and visual compiler only as needed |
| `preview-revision` | pairwise critical-candidate selection, current real-audio full preview, weakest-semantic-interval repair, blind and real-device review | `xingchen-lookdev` |
| `final-delivery` | approved output, cover/export paths, platform check, one learning record | render adapter and router |

Platform adaptation happens inside scene production or final delivery. It is not a mandatory standalone stage.

Knowledge writeback happens after delivery and must not block delivery.

## Automatic Progress

Advance automatically when:

- the current stage's required truth exists
- no core invariant fails
- no required approval is pending

Do not create extra approvals for internal drafts, aesthetic options, resource searches, adapter candidates, or API choices.

## Stage Status

`metadata.stage_status` is either `active` or `completed`.

- `active` means the project is currently doing the stage's work.
- `completed` means the stage's exit conditions are satisfied.

Entering `final-delivery` requires an approved `Preview Lock` and complete preview evidence. It does not require `delivery.final_path` yet.

Completing `final-delivery` requires `delivery.status: "delivered"`, a locally decodable final video with audio, and the final output trace.

## Required Stops

Stop only at:

- `Content Lock`, between `script-beats` and `scene-production`
- `Preview Lock`, between `preview-revision` and `final-delivery`

## Prototype Checkpoint

The opening, hardest explanation or proof, and payoff should each keep two hypotheses until real clips can be compared. Add a third only when the first pair leaves a real unresolved tradeoff. This is a working checkpoint, not a formal lock. The user may delegate pairwise selection to the agent.

Do not replace `Content Lock` or `Preview Lock` with prototype approval, source confirmation, or direction selection. Do not invent alternate mode or stage names in user-facing plans.

## Failure Behavior

When a stage fails:

- keep `metadata.active_stage` at the narrowest truthful stage
- set `workflow.blocked=true`
- name the concrete blocker and affected scene or field
- preserve usable upstream work
- repair the smallest responsible owner or artifact

Do not respond to a visual failure by adding more state fields.

## Extended Compatibility

Extended and legacy projects retain the historical order:

`ingest -> research/proof -> script -> story-mother -> visual-direction -> platform-adapt -> lookdev -> render -> publish -> review -> knowledge-writeback`

They may also retain `Topic Lock`, `Script Lock`, `StoryMother Lock`, `Visual Lock`, and `Lookdev Approval`. Those checkpoints do not apply to Lean projects.
