# Remotion Runtime Doctor

The runtime doctor is the missing bridge between "the state validates" and "the
video can actually render." It is a project-folder check for Xingchen projects
whose videos, render files, and process artifacts live together.

Use it after Visual Lock / Lookdev work has produced render-bound files, and
before treating a Remotion preview or final render as trustworthy evidence.

## Default Assumption

A project folder may contain:

```text
project/
  project-state.json
  render-plan.json
  video-project.json
  director-script.render.json
  public/
  inputs/
  outputs/
```

The doctor resolves local assets from:

- `project/public/<asset>`
- `project/<asset>`
- the Remotion harness `public/<asset>` for bundled fixtures

This supports the user's current habit of keeping videos and process files in
the same place while still allowing the shared harness to provide neutral
runtime code.

## Checks

Static checks:

- Node package versions for `remotion` and `@remotion/*` are internally aligned.
- Shared browser env vars point to an existing executable when set.
- `project-state.json`, when present, parses and has stage/render job shape.
- `render-plan.json`, when present, has `meta`, `globals`, and `scenes`.
- Scene count and duration are consistent enough to render.
- Local render-plan assets exist.
- Render-bound scenes do not rely only on preview stills or contact sheets.
- Subtitle safe-area data is present for vertical/Douyin variants.

Runtime still checks, when explicitly requested:

- Remotion can render the requested composition at a target frame.
- The PNG output has real dimensions.
- The frame is nonblank enough to catch black/transparent output.

The doctor is intentionally not a full lookdev judge. It catches mechanical
breakage so that `xingchen-lookdev` can spend attention on meaning, taste, and
scene responsibility.

## Commands

From the harness:

```powershell
cd ../../remotion-render-adapter/templates/director-motion-kernel
npm run doctor -- --project-root C:\path\to\project
npm run doctor:still:vertical -- --project-root C:\path\to\project --frame 30
npm run doctor:still:horizontal -- --project-root C:\path\to\project --frame 30
```

Use `--render-plan` or `--director-props` when the file name is not standard:

```powershell
npm run doctor:still:vertical -- --project-root C:\path\to\project --render-plan .\exports\render-plan.json
```

## Evidence Writeback

When the doctor creates or inspects a preview artifact, write or update a
`render.plugin_adapter_runs[]` record if this happened inside a project run.

Minimum trace:

- adapter id: `remotion-runtime-doctor`
- input refs: `project-state.json`, `render-plan.json`, or
  `director-script.render.json`
- output paths: still PNG or report path
- state writebacks: affected `render.jobs[]` or `render.scene_motion_specs[]`
- status: `previewed`, `blocked`, or `rejected`
- notes: exact failure or pass summary

## Failure Policy

If the doctor fails, do not patch around it by using screenshots as a fake final
video. Fix the project folder, render plan, asset paths, Remotion code, or
upstream scene route. If the scene cannot pass a still check, it is not ready
for final render.
