# Director Motion Kernel

This directory is a Remotion adapter harness for `remotion-render-adapter`.

Use it when a xingchen-family project already has approved `project-state.json` plus an exported `video-project.json` or `render-plan.json`, and the render layer now needs a truthful motion output.

It is not a visual template, theme, default scene bundle, or reusable project look. The included sample `render-plan.json` and `director-script.render.json` are fixtures only.

## Default Render Path

1. Copy this harness into the target project as `remotion-project`.
2. Put narration audio into `public/audio/`.
3. Export the current render pack from `project-state.json`.
4. Replace the fixture `render-plan.json` with one generated from the current project state.
5. If a legacy board-first route is explicitly approved, place `motion-blueprint.json` next to the project root and run `npm run compile:board-motion` for inspection.
6. Render `DirectorVertical` or `DirectorHorizontal`.

The harness uses the shared machine browser from `REMOTION_BROWSER_EXECUTABLE` or `HYPERFRAMES_BROWSER_PATH` when present. Otherwise it leaves browser resolution to the installed Remotion CLI; it never assumes a user-specific Playwright cache path. Do not let each project download another Chromium unless the shared/default browser is missing or intentionally unsuitable.

If the project already has approved `lookdev-stills/*.svg` or HTML boards, promote those boards into the live render path before falling back to generic infographic components. In the render data, prefer an explicit board-first marker such as `scene_kind: "immersive-bg"` plus a primary board asset.

## Rules

- `Director*` compositions are the preferred final render path for live motion output.
- approved lookdev SVG or HTML boards should become the preferred scene plates when available.
- `motion-blueprint.json` is a compatibility handoff for explicit board-first scenes, not the default truth layer.
- the harness compiles blueprint data into runtime `board_motion` props before Remotion renders.
- `VideoProject*` compositions may remain for review or compatibility.
- Do not copy fixture scene content, palette, typography, or sample render data into a new project.
- Every visible scene decision must come from the current project's approved StoryMother, visual policy, scene motion spec, and render plan.
- Do not feed lookdev stills, contact sheets, or preview PNGs into the final render path.
- If you only have stills, stop at `preview` or `animatic`.
