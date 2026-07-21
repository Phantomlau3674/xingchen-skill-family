# Runner Integration

## Status — read this first

The Python runner referenced in older docs (`xingchen_next_runner`, `xingchen-next-runner`, `xingchen-next-export`) **does not exist on this machine**. It was never implemented. Treat any prose mentioning a runner CLI as historical, not actionable.

The only executable command in this skill family is the project-state validator:

```
node ../schema/validate-project-state.mjs path\to\project-state.json
```

Zero dependencies, mirrors the working pattern at `C:\xingchen-spark\templates\xingchen-spark-plate\scripts\validate-spark-routes.mjs`. Run it at every stage flip.

## Use Codex, not a runner

Codex executes the workflow directly by following [codex-runbook.md](./codex-runbook.md). The runbook is a flat per-stage checklist: required `project-state.json` paths, required artifacts on disk, gate signoffs, and the validator command. Pack creation, lookdev evaluation, render preparation, and render completion are all done by editing state directly and exporting artifacts as derived surfaces, not by invoking a CLI subcommand.

## What the older docs called CLI subcommands

If you find references to these in old material, here is what each maps to under the codex-runbook approach:

| Old fictional CLI | What it actually means now |
|---|---|
| `xingchen-next-runner export --kind review-pack ...` | Generate the review-pack files from `project-state.json` (visual policy, lookdev-gate.yaml, art-direction.md, etc.) and write paths into `exports.review_pack`. |
| `xingchen-next-runner export --kind render-pack ...` | Have `video-project-graph` produce `video-project.json` and `render-plan.json` from approved scene_motion_specs; write paths into `exports.render_pack`. |
| `xingchen-next-runner import-legacy ...` | Walk the legacy artifact bundle and populate the matching `project-state.json` sections per [legacy-bridge.md](./legacy-bridge.md). |
| `xingchen-next-runner evaluate-lookdev ...` | Run `xingchen-lookdev` per [scene-composition-audit.md](../../xingchen-lookdev/references/scene-composition-audit.md) and [aesthetic-review-loop.md](../../xingchen-lookdev/references/aesthetic-review-loop.md), then write a `LookdevGateResult` into `review.lookdev_gate_results` and produce `lookdev-gate-result.json`. |
| `xingchen-next-runner prepare-render ...` | After Lookdev Approval, append a `RenderJob` to `render.jobs` per the codex-runbook `render` stage prerequisites. |
| `xingchen-next-runner complete-render ...` | After Remotion finishes, fill the completion fields on the matching `RenderJob` (silent_video_path, final_output_path, assembly_log_path, completed_at) and flip `metadata.active_stage` to `publish`. |

Each row corresponds to a section in [codex-runbook.md](./codex-runbook.md).

## Why no runner

A real runner is the right tool when many users execute the same pipeline thousands of times. This skill family is operated by Codex on behalf of one creator. A JSON Schema + a 200-line validator catches the structural and gate-by-stage errors that would have been the runner's main value, without a Python package, without an install step, and without a maintenance burden.

If a runner is added later, it should preserve the validator's exit codes and error messages so the runbook stays compatible.
