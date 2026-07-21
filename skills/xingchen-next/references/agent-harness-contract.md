# Agent Harness Contract

## Purpose

The harness converts a video request into a stateful, inspectable execution. It is not a hidden mega-prompt and it does not make a remote generator the quality engine.

Keep four control planes separate:

1. workflow skill: questions, artifacts, tool order, and acceptance evidence
2. design style: color, type, material, texture, and motion character
3. output grammar: shots, topology changes, continuity, rhythm, and sound
4. runtime policy: reasoning depth, quality/speed, typed permissions, job recovery, and commit rules

Store the run at `extensions.agent_harness`. Start from [agent-harness-run.template.json](../templates/agent-harness-run.template.json) and validate it with:

```powershell
node ./scripts/validate-agent-harness.mjs <agent-harness.json>
```

The Lean project-state validator applies the same checks automatically from `scene-production` onward.

## Medium And Style Binding

Do not let the agent silently choose the cheapest medium. `route.medium_strategy` records the production mode, who made that choice, and the actual modalities. Default faceless voiceover knowledge videos to `narration-led`: the accepted voice is A-roll and designed visuals respond to it. `motion-graphic-only` is valid only when the user or accepted brief selected it; it cannot be an agent fallback for an ordinary film. A source-led route must contain real footage, source proof, or screen capture, but it is a special route rather than a default real-material quota. Mixed-media work must name at least two modalities.

Do not treat a style adjective as a bound design system. Record `design_style_source` as `none`, `user-named`, `active-spec`, `catalog-preset`, or `accepted-example`. A persisted spec, preset, or accepted example requires `design_style_spec_ref`. When the source is `none`, both the style name and spec reference stay empty.

For multiple related visual assets, use `batch_policy`. An active spec, selected preset, or accepted example can authorize a batch. A merely user-named direction requires one rendered representative to be approved before expansion. Shared palette and typography do not justify reusing the same form for different viewer jobs.

## Runtime Policy

`thinking_mode` controls planning depth: `fast`, `standard`, or `deep`.

`quality_mode` controls iteration economics: `speed`, `balance`, or `quality`. It does not select a visual style. Use `quality` for final Xingchen work unless the user explicitly asks for a rough iteration.

Permissions are typed by capability, not granted to the whole agent:

- `motion_graphics`
- `video_generation`
- `image_generation`

Each is `allow`, `ask`, or `deny`, with `permission_scope` set to `project` or `global`. Local Remotion work does not need a generation permission. A job in an `ask` capability cannot execute without an authorization trace carrying `approval_ref`.

## Execution State Machine

Use this ordered trace:

`route -> preflight -> plan -> authorize -> execute -> track -> verify -> commit`

- `route`: select workflow skill, visual format, and output grammar; keep design style separate.
- `preflight`: check source reality, accepted timeline revision, local runtime, asset paths, and target timeline.
- `plan`: name the artifact ladder, scene mechanisms, estimated cost, and reversible first action.
- `authorize`: record typed approval only where the runtime policy requires it.
- `execute`: submit or run one idempotent job.
- `track`: resume by job id and cursor after reload; never resubmit merely because the UI disconnected.
- `verify`: inspect decodable output and semantic boundary evidence, not just a success message.
- `commit`: place the verified artifact on the accepted timeline revision and record the output reference.

Before `scene-production` completes, all eight trace stages must be successful and ordered. A failed job preserves upstream artifacts and moves the run to `failed`; it does not silently downgrade to a card template.

## Visual Strategy

Every scene strategy declares:

- `before_state` and `after_state`: what the viewer can understand before and after the scene
- `causal_force`: what visibly produces the change
- `continuity_anchor`: what persists while the scene changes
- `operators`: the cinematic or graphic mechanisms doing the work
- `topology` and `layout_signature`: the actual spatial organization, not a style label
- `proof_frames`: at least `before` and `after` evidence references
- `motion_carries_meaning`: true only when removing the motion would remove information

Useful non-editorial operators include `source_reveal`, `object_transform`, `spatial_relation`, `camera_reveal`, `data_behavior`, `character_action`, `kinetic_type`, and `compositing`. `editorial_layout` may support them but cannot be the only mechanism in an ordinary film or motion graphic.

## Anti-PPT Gate

The validator derives duration-weighted ratios from scene strategies:

- card-like topology ratio: at most `0.35`
- largest repeated layout-signature ratio: at most `0.50`
- static-hold ratio: at most `0.60`

Card-like topologies are `card`, `panel`, `slide`, and `deck`. These thresholds are release gates, not targets. Passing them does not prove quality; failing them proves the current plan is structurally slide-like.

An intentional `editorial-card` format may declare `editorial_card_exception: true` with a concrete reason. The exception only relaxes the three ratios. It does not relax semantic state changes, causal motion, proof frames, readability, or preview review.

Ordinary multi-scene work also needs at least two distinct non-editorial operators across the piece. A one-scene piece needs at least one. This prevents the cheap fallback of repeating a title, rounded rectangle, arrow, and fade under different copy.

## Async Job Recovery

Every submitted job records `job_id`, `capability`, `idempotency_key`, `attempt`, `status`, `progress`, and `last_checked_at`. Remote generation that is submitted or running also records `resume_cursor`. Successful jobs require `output_ref`.

Keep charge evidence separate from completion evidence. `charge_status: charged` does not mean the artifact succeeded, and a disconnected client does not authorize a duplicate submission.

An internal idempotency key does not make an external mutation idempotent. Every job records `intent_fingerprint` and whether the server operation is actually idempotent. After an ambiguous timeout, 502, or dropped response on a non-idempotent mutation, re-read the target project and store `reconciliation_ref` before increasing `attempt`. Retry only when the intended asset, item, or timeline mutation is absent.

Keep asset authoring, timeline placement, and composed-frame verification as separate receipts. A valid asset is not proof that it was placed; a placed item is not proof that it looks correct.

## Verification Rule

Plans may contain intended proof-frame references. Commit requires rendered evidence in the owning scene implementation and a full playable preview under the normal Preview Lock. The harness proves that the agent followed the execution protocol; it does not replace media decoding, phone review, or human judgment.
