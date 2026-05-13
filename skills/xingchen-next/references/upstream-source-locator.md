# Upstream Source Locator

This file records where the external video-runtime source audits live. These are not skill files and should not be treated as visual templates.

## Stable Audit Root

`C:\Users\liuzh\.codex\vendor_imports\video-runtimes`

Use this root for source review, interface verification, and future refreshes. Do not keep authoritative source audits under `%TEMP%`; Temp checkouts are disposable and may be cleaned by Windows or maintenance tools.

## Current Runtime Audits

| Runtime | Stable audit path | What it verifies |
|---|---|---|
| Hyperframes | `C:\Users\liuzh\.codex\vendor_imports\video-runtimes\hyperframes` | GitHub source, package layout, CLI commands, Hyperframes skill guidance |
| Remotion CLI | `C:\Users\liuzh\.codex\vendor_imports\video-runtimes\remotion-cli-4.0.457-npm` | Published npm CLI package and render command surface |
| VibeMotion skills | `C:\Users\liuzh\.codex\vendor_imports\video-runtimes\vibe-motion-skills` | Upstream skill repository used to compare local VibeMotion skill copies |

## Skill Boundary

The source audits answer "what does this runtime/package expose?"

The skills answer "how may Xingchen use it?"

- `xingchen-next` owns state, routing, approvals, and validation.
- `remotion-render-adapter` owns final render compilation and promotion rules.
- VibeMotion local skills are callable generators or primitive references.
- Hyperframes and Remotion npm packages are project dependencies when a specific render project needs them.

No package source here may be copied into a project as a fixed visual template. Visible scene code must be generated from the current project state and approved planning.
