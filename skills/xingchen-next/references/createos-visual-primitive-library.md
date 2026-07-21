# CreateOS Visual Primitive Library

Use this reference when the user asks to turn a successful or failed video into a reusable Remotion visual component library, asks for `CreateOS` visual primitives, or asks whether WebGL/shader should enter the Xingchen video stack.

This is a governance lane, not a standing aesthetic template. The user's taste and current project evidence decide what becomes a primitive. Codex may research, prototype in a sandbox, recommend, and implement after gates; it must not invent a reusable visual language from renderer taste.

## Ownership

- `xingchen-next` owns phase gates, approval pauses, and where the work sits in the project lifecycle.
- `xingchen-art-direction` owns taste preflight, resource preflight, token/aesthetic commitments, and anti-slop criteria.
- `xingchen-visual-compiler` owns primitive kit-extension requests, scene-to-primitive mapping, and implementation handoff.
- `remotion-render-adapter` owns final Remotion implementation once the primitive contract is approved.

Do not create a new top-level skill until at least one project has proved the primitive by rendering stills or video and the user approves extraction.

## When To Run

Run this lane when any of these are true:

- the user asks for a visual component library, reusable primitive kit, CreateOS visual library, or reusable Remotion shots
- a project needs to rewrite a failed render by extracting locked primitives instead of patching one-off scene code
- `visual.director_board.scene_boards[]` repeatedly asks for a component not covered by `shot-library.md`
- the user asks whether WebGL/shader should be used for Burn, smoke, grain, organic masks, turbulence, or canvas effects

Do not run it for ordinary one-off scene implementation. Ordinary scenes use `shot-library.md` and `render.scene_motion_specs[]`.

## Phase Gates

Use the project-local execution plan as the authority when present, for example:

`{project_root}\0525-createos-visual-library-build-plan.md`

Important mode split:

- If the user asks to **edit, repair, or sync skills**, do only skill-file work. Do not start Phase 1, do not run Remotion, do not install npm packages, and do not launch headless Chrome.
- If the user asks to **execute, retest, or run the plan through this skill**, then begin at Phase 1 and obey the STOP GATEs below.
- Reading a project plan is not permission to execute it. Treat the plan as source material until the user explicitly switches into execution/retest mode.

If no plan exists, use this minimum gate sequence:

1. Research existing Remotion/primitives/token/noise references. Output markdown notes only.
2. If WebGL/shader is being considered, run feasibility in a sandbox only.
3. Write a design contract: primitive list, token policy, public props, locked internal decisions, and rejected aesthetics.
4. Scaffold the kit docs and tokens without implementing all primitives.
5. Implement one primitive at a time; render a still PNG and stop for user review before the next primitive.
6. Migrate the target project using only approved primitives.
7. Only after a real project proves the kit, package it as a skill or shared render kernel.

Every phase ends with a STOP GATE. Do not continue just because the next step is obvious.

## WebGL And Shader Gate

WebGL/shader code is allowed only inside a project-local sandbox such as:

`{project_root}\research-webgl\experiments\`

It may not enter `skill-source`, the Remotion project `src`, a shared skill, or a render kernel until the user approves a written decision.

Do not run WebGL, Remotion stills, npm installs, or headless-browser checks while only updating skills. Runtime checks belong to a later project retest, after the user explicitly approves execution mode.

The decision must answer:

- Where does WebGL visibly improve current or recent frames, with timestamps and benefit ratings?
- Which Remotion integration route rendered a deterministic still: `@remotion/three`, custom canvas, wrapped fragment shader, or offline prerendered plate?
- What shader difficulty can Codex honestly implement without pretending?
- What is the frame-time budget, and when should the route fall back to an offline transparent video plate?
- Which real projects or official docs prove frame determinism and maintainability?

Use frame-driven uniforms only: `useCurrentFrame()`, `fps`, scene progress, or explicit props. Do not use `Date.now()`, `performance.now()`, uncontrolled timers, or `Math.random()` in final-render paths.

Retest protocol for Phase 1B:

1. Before experiments, write `research-webgl/00-methodology.md` with source videos, frame sampling method, allowed sandbox path, and exact commands planned.
2. Extract frame sheets first and write `Q1-where-it-helps.md`; if Q1 has too few must-have scenes, recommend stopping before any WebGL runtime work.
3. Only if Q1 justifies it, run the four Q2 integration probes in `research-webgl/experiments/`.
4. Each probe gets at most one focused fix attempt after a failure. If Remotion/headless Chrome hangs or times out, stop that route, record the timeout as evidence, and move on; do not keep retrying silently.
5. Every command that starts a browser, installs packages, or renders a frame must be recorded in `experiments/README.md` with outcome, elapsed time, and whether it modified only the sandbox.
6. If a process is interrupted, inspect and stop only command lines that point to the sandbox before continuing.

WebGL/shader is not a renderer family. It remains a Remotion implementation route:

- live component: `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "native_remotion"`, `integration_mode: "live_component"`
- offline plate: `renderer_family: "remotion_component"`, `execution_runtime: "remotion"`, `motion_source: "bespoke_code"`, `integration_mode: "video_plate"`

## Primitive Contract

Each approved primitive needs:

- `README.md`: job, public props, locked decisions, forbidden variants, examples
- implementation file: one public component and private helpers only when needed
- token dependencies: palette, typography, motion, spacing, shadows, and asset rules
- still preview: one frame rendered from a minimal demo
- verification note: props match README, locked decisions have no prop escape hatch, screenshot path, user review state
- changelog/postmortem when replacing a failed earlier implementation

Public props should be few and structural: region, source, timing window, content id, variant selected by the approved board. Do not expose taste knobs such as arbitrary colors, glow strength, shadow style, or animation curves unless the design contract explicitly allows them.

## Burn / Organic Effects

Burn-like primitives are high risk because agents tend to add flames, orange glow, particles, and fake premium effects. Before implementing, read project anti-references and any failed old component. The primitive must name forbidden aesthetics in its README and changelog.

Allowed implementation paths:

- SVG mask: lowest operational risk; use deterministic noise and restrained smoke/ember details.
- live shader: allowed only after the WebGL gate proves deterministic still rendering and acceptable frame time.
- offline transparent video plate: allowed when shader quality is useful but live render cost or determinism is risky.

The user decides the path from evidence. Codex may recommend, but not promote WebGL because it sounds advanced.

## Skill Extraction

Keep project experiments project-local until the user approves extraction. When extraction is approved:

- copy only the stable primitive kit, docs, tokens, examples, and verification notes
- exclude research clones, temporary experiments, `node_modules`, caches, and rejected scratch code
- update `SKILL.md` as a concise trigger and navigation file, not as the full research diary
- sync mirrored skill trees when this environment uses `.codex`, `.agents`, and `.claude`

If the result is only useful for the current video, keep it as project code and do not create a new skill.
