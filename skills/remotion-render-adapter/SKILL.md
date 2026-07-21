---
name: remotion-render-adapter
description: Use when approved project-state render exports need to become a live Remotion `render-plan.json` under a code-first route without falling back to fixed themes or generic scene templates. Also owns compatible requests that use the older `remotionaivideo` name.
---

# Remotion Render Adapter

## Overview

This skill converts the renderer-agnostic project graph and approved review candidates into Remotion execution inputs.

Its job is to compile approved director decisions into dynamic HTML/React/SVG/Canvas video, not to pick a fixed theme and force every project through it.
Remotion, Hyperframes, and VibeMotion integrations are runtime adapters, not visual templates. Scene code must be generated from the current `project-state.json`, `video-project.json`, and `render-plan.json`; adapter examples may provide command shape or neutral helpers only.

In Xingchen Next, `render-plan.json` is a render-pack export derived from `project-state.json`, `RenderRoute`, and `video-project.json`.

## Primary Outputs

- `render-plan.json`
- optional Remotion preview props
- optional reusable primitive libraries or motion helpers when the current project lacks them
- optional promotion records for approved VibeMotion candidates
- `render.plugin_adapter_runs[]` records when `Remotion:remotion`, local Remotion CLI/skill guidance, or manual Remotion implementation is used for implementation or preview, or when adapter-generated candidates are promoted

## Inputs To Expect

- approved `project-state.json`
- approved `video-project.json` render-pack export
- beat and scene-motion truth from state or exported review files
- effect direction from state-backed scene motion specs or `effect-brief.md`
- approved VibeMotion candidate records when the visual path used Candidate Pass
- approved Hyperframes candidate records when the visual path used HTML/canvas scene candidates
- local media assets referenced by the graph
- approved geometry decisions such as frame strategy, fit policy, proof regions, and subtitle-safe zones
- optional primitive libraries or reusable motion helpers

## Adapter Responsibilities

- resolve scene timing into renderer-friendly units
- compile director state into live scene recipes
- attach composition ids, fps, and output dimensions
- preserve review state so unresolved scenes do not look accidentally final
- assemble scene motion from primitives instead of forcing a theme-level scene bundle
- promote approved VibeMotion candidates as copied components, rewritten live components, captured HTML/canvas plates, video plates, or transparent assets
- promote approved Hyperframes candidates as captured HTML/canvas plates, transparent assets, video plates, or rewritten/copied Remotion components
- record every Remotion or HyperFrames plugin promotion in `render.plugin_adapter_runs[]` with scene ids, input state refs, output paths, state writebacks, status, and candidate ids when applicable
- choose transitions deliberately from the approved direction
- support incremental rerender decisions from scene-level render state
- keep `code_primary` as the default route and require explicit opt-in for generated inserts
- preserve approved source geometry instead of silently stretching or over-cropping proof assets
- compile `spark_3dgs` scenes as browser/canvas world plates, then layer subtitles, callouts, voice, and BGM outside Spark

## Render-Plan V2

Each render-plan scene should preserve story truth and include renderer-facing direction such as:

- `renderer_recipe`
- `renderer_family`
- `anchor_strategy`
- `motion_stack`
- `camera_path`
- `transition_profile`
- `subtitle_policy`
- `proof_strategy`
- `live_mode`
- `vibemotion_candidate_ids`
- `hyperframes_candidate_ids`
- `candidate_promotion_mode`

These fields must be derived from approved upstream direction, not improvised as a fallback template.

## Rules

- do not mutate thesis, narration, or proof meaning during adaptation
- keep renderer-only fields in `render-plan.json`, not in `video-project.json`
- fail loudly when assets are missing or ambiguous
- do not execute final render unless `project-state.json.render.jobs[]` records the job, variant, lookdev status, state path, video project path, render plan path, and output path
- do not treat lookdev stills, contact sheets, or preview PNGs as final-render source frames
- do not treat VibeMotion candidate outputs as final-render source frames unless lookdev approval and candidate promotion are recorded
- do not make an older project's scene bundle the default answer for a new project
- if reusable scene code exists, mine it for primitives only unless the current project explicitly re-approves the whole bundle
- do not use Hyperframes, Remotion, or VibeMotion as a standing visual template library
- do not let Codex plugins become a parallel renderer truth; plugin runs are implementation traces under `project-state.json`
- do not copy a generated candidate from another project unless the current StoryMother and VisualPolicy explicitly re-approve the same creative choice
- if the only available output is a still-preview slice, label it `preview` or `animatic`, not final output
- do not promote generated-video clips into the project default render route
- `gen_insert` and `mixed_scene` require explicit scene-level decisions
- do not treat `spark_3dgs` as generated-video fallback; it remains `code_primary` browser/canvas rendering with explicit world-asset provenance
- do not non-uniformly scale screenshots, UI captures, or literal proof assets
- if a plate does not fit honestly, fail or reroute upstream instead of improvising a distorted fit
- subtitles and callouts must obey approved proof and safe-region decisions
- VibeMotion candidates may inform final motion, but Remotion remains responsible for formal timeline, subtitles, proof overlays, audio assembly, and final export
- Hyperframes candidates may supply HTML/canvas motion or transparent assets, but Remotion remains responsible for formal timeline, subtitles, proof overlays, audio assembly, and final export

## Audio Assembly

After live render is complete, this layer may assemble final delivery audio.

Recommended flow:

1. render video output first
2. locate the approved voice or narration source
3. optionally add BGM when requested
4. assemble to `outputs/final.mp4`
5. write `outputs/assembly-log.json`

Keep assembly explicit, deterministic, and reviewable.

## Notes

Remotion is a renderer, not the truth layer.

When the Codex `Remotion:remotion` plugin is available, use it as the preferred Remotion craft reference for captions, audio, timing, transitions, 3D, charts, assets, and text fitting. In Claude Code, use this local skill plus project Remotion docs/CLI instead. Record the work in `render.plugin_adapter_runs[]` if it created a preview, changed render inputs, promoted a candidate, or produced final-render evidence.

If the requested change affects story, proof meaning, or scene order, send it upstream first.

## Reference

See [render-plan-contract.md](./references/render-plan-contract.md) for the render-plan contract.
See [dynamic-render-policy.md](./references/dynamic-render-policy.md) for the live-render rules.
See [dynamic-runtime-adapter-contract.md](./references/dynamic-runtime-adapter-contract.md) for the no-fixed-template runtime adapter rule.
See [render-route-policy.md](../xingchen-next/references/render-route-policy.md) for the upstream route guardrails.
See [plugin-adapter-policy.md](../xingchen-next/references/plugin-adapter-policy.md) for Codex Remotion/HyperFrames plugin state tracing.
See [spark-3dgs-world-route.md](../xingchen-next/references/spark-3dgs-world-route.md) for Spark 2.0 browser/canvas world-plate handoff.
See [voice-cloning-routing.md](./references/voice-cloning-routing.md) for cloned-voice routing.
See [amd-wsl-voxcpm2.md](./references/amd-wsl-voxcpm2.md) for validated AMD WSL notes.

## Adapter Verification

Run `node --test tests/*.test.mjs` after changing the bundled kernel or adapter scripts. The tests exercise the no-blueprint compiler path, CLI stdout mode, render-plan fixture invariants, dependency-version alignment, and portability/shell-execution guards without rendering video or loading any `xingchen-*` file.
