---
name: xingchen-next
description: Use when building or operating the stateful creator OS for high-end knowledge-opinion short videos with project-state truth, approval gates, director-board visual planning, code-first rendering, platform variants, lookdev, or Spark/HTML 3D route governance.
---

# Xingchen Next

## Role

This is the family router and gatekeeper. It owns canonical state, stage order, approval gates, validator entrypoints, and cross-skill boundaries. It should not keep absorbing detailed visual-method prose.

Codex executes the workflow through [codex-runbook.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\codex-runbook.md). The old `xingchen_next_runner` Python CLI referenced in legacy docs does not exist.

## Canonical Truth

`project-state.json` is the only primary truth for new work. Derived files such as `visual-director-board.md`, `art-direction.md`, `visual-language-kit.json`, `lookdev-gate.yaml`, `video-project.json`, and `render-plan.json` are review or export surfaces. Write decisions to state first, then re-export surfaces.

Validator command:

```powershell
node C:\Users\liuzh\.codex\skills\xingchen-next\schema\validate-project-state.mjs path\to\project-state.json
```

Schema and field contract:

- [project-state.schema.json](C:\Users\liuzh\.codex\skills\xingchen-next\schema\project-state.schema.json)
- [validate-project-state.mjs](C:\Users\liuzh\.codex\skills\xingchen-next\schema\validate-project-state.mjs)
- [project-state-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\project-state-contract.md)
- [plugin-adapter-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\plugin-adapter-policy.md)

## Stage Order

`ingest -> research/proof -> script -> story-mother -> visual-direction -> platform-adapt -> lookdev -> render -> publish -> review`

Hard approval gates:

- `Topic Lock`
- `Script Lock`
- `StoryMother Lock`
- `Visual Lock`
- `Lookdev Approval`

Stage details live in [stage-lifecycle.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\stage-lifecycle.md). Approval evidence lives in [approval-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\approval-contract.md).

## Family Routing

| Stage | Owning skill |
|---|---|
| `ingest` assets | `xingchen-asset-intake` |
| `ingest` audio/transcript | `xingchen-transcribe` |
| `research/proof` topic and mother seed | `xingchen-editorial-room` |
| `research/proof` proof rules | `xingchen-proof-pack` |
| `script` | `xingchen-script-polish` |
| `story-mother` | `xingchen-editorial-room` |
| `visual-direction` director board | `xingchen-director-board` |
| `visual-direction` aesthetic system | `xingchen-art-direction` |
| `visual-direction` scene specs and candidates | `xingchen-visual-compiler` |
| `platform-adapt` | `xingchen-visual-compiler` |
| render-pack graph | `video-project-graph` |
| `lookdev` | `xingchen-lookdev` |
| `render` | `remotion-render-adapter` |
| editable draft export only | `jianying-draft-builder` |

Visual-direction sequence is fixed:

`xingchen-director-board -> xingchen-art-direction -> xingchen-visual-compiler -> plugin adapters when needed -> xingchen-lookdev`

## Visual Lock Contract

`Visual Lock` is not a vibe approval. It requires state-backed evidence that the picture was designed from the current material and recording rhythm.

Recording-first projects must complete recording correction before visual design. Do not enter `xingchen-director-board` from raw audio alone: `sources.recording_correction` must identify source audio, corrected/cleaned audio or accepted manual-review status, transcript path, cleanup report, correction actions, and quality checks.

Required before `metadata.active_stage >= "platform-adapt"`:

- `visual.director_board.status` is `completed` or `manual_review_required`
- `visual.director_board.board_md_path` and `board_json_path` are filled
- every `mother.story_mother.scene_order[]` scene has a matching `visual.director_board.scene_boards[]` entry
- every adjacent scene pair has a matching `visual.director_board.scene_edge_boards[]` entry
- every scene board fills source, arrangement, brainstorming, aesthetic, frame, detail, component, subtitle, tech-stack, and lookdev-acceptance layers
- every scene board's `brainstorming_layer` records `superpowers/brainstorming`, knowledge action, options considered, selected direction, continuity handles, and anti-PPT decision
- every scene edge board records its `superpowers/brainstorming` bridge question, options considered, selected bridge, continuity handle, transition method, cut moment, anti-PPT risk, and lookdev acceptance
- subtitle safe region and `must_not_cover[]` are explicit for every scene
- HTML 3D scenes explain camera/depth purpose
- Spark scenes explain spatial/world reason, route status, and preview requirement
- VibeMotion remains supporting/candidate motion, not the final controller
- Gen insert / AI video scenes explain the bounded visual gap, declare no proof/subtitle ownership, and integrate only as Remotion-controlled `video_plate`
- `render.scene_motion_specs[]` cover the locked StoryMother scene order
- each `render.scene_motion_specs[]` item compiles the director board into `brainstorming_trace`, `continuity_handles_used[]`, `anti_ppt_decision`, and adjacent edge transition traces/primitives
- Douyin quality checks still pass: hook design, energy map, contrast map, hero frame, scene decision cards

Legacy `visual.material_director_pass` is still accepted as compatibility evidence when present, but the new hard gate is `visual.director_board`.

## Visual Responsibilities

- `xingchen-director-board`: reads source material and recording rhythm page by page / beat by beat; writes `visual-director-board.md`, `visual-director-board.json`, and `visual.director_board`.
- `xingchen-art-direction`: extracts the whole-piece aesthetic system from the director board; writes `visual.visual_policy`, `art-direction.md`, `visual-language-kit.json`, and `lookdev-gate.yaml`.
- `xingchen-visual-compiler`: compiles scene specs from `visual.director_board.scene_boards[]`; components and tech routes must trace to the board and shot library.
- `xingchen-lookdev`: audits actual previews against the exact director-board layers and reports failures with field paths.

## Renderer Route Policy

Remotion is the default controller for timeline, subtitles, proof overlays, components, audio, preview, and final composition.

Other routes are scene-level exceptions:

- HTML 3D: 3D card stacks, proof planes, concept rooms, and camera-as-argument moves; must say what the camera reveals.
- Hyperframes: HTML/canvas candidate scenes; must produce candidate artifacts and promotion path.
- Spark: 3DGS, procedural splat, world plates, spatial traversal; never ordinary premium background.
- VibeMotion: candidate/supporting motion or transparent layer; never final full-video controller.
- Source media: original screenshots, clips, recordings, or screen recordings as evidence; must stay faithful and legible.
- Gen insert: bounded generated-image/video gap only; Seedance/API output may be a candidate `video_plate`, but proof, captions, timing, overlays, and final assembly stay in Remotion.

Runtime adapters are not planning authorities:

- In Codex, `Remotion:remotion` is the preferred craft reference when writing or debugging Remotion/React video code.
- In Codex, `HyperFrames by HeyGen:hyperframes` and related HyperFrames plugin skills may generate HTML/canvas candidates after the director board and compiler have fixed scene intent.
- Seedance-style AI video work is prompt-pack first when Codex has no API access: write bounded `render.ai_video_prompt_requests[]`, let the user generate on the platform, then register returned files as `render.ai_video_candidates[]`. Direct API use follows the same state contract.
- In Claude Code, those Codex plugins are not callable; use local CLI, synced local skills, or manual implementation lanes and record `adapter_kind` accordingly.
- Any adapter-created or adapter-promoted artifact must append `render.plugin_adapter_runs[]` with inputs, scene ids, outputs, state writebacks, status, candidate ids, and lookdev evidence requirements.
- Adapters never rewrite StoryMother, proof meaning, director-board layers, final subtitle policy, or full-video ownership.

Detailed route rules:

- [renderer-families.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\renderer-families.md)
- [render-route-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\render-route-policy.md)
- [html-3d-scene-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\html-3d-scene-route.md)
- [spark-3dgs-world-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\spark-3dgs-world-route.md)
- [hyperframes-route-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\hyperframes-route-policy.md)
- [plugin-adapter-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\plugin-adapter-policy.md)

## Hard Rules

The rule text lives in [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md). The router enforces these through stage routing and validator checks:

- INV-STATE-TRUTH
- INV-SOURCE-PACK-TRACE
- INV-TOPIC-LOCK-FIRST
- INV-SCRIPT-LOCK-BEFORE-MOTHER
- INV-MOTHER-LOCK-BEFORE-VARIANT
- INV-VISUAL-LOCK-BEFORE-RENDER
- INV-LOOKDEV-BEFORE-RENDER
- INV-DIRECTOR-BOARD
- INV-DIRECTOR-PLAN-BEFORE-RENDER
- INV-PROOF-FRAME-STRATEGY
- INV-SOURCE-MATERIAL-DIRECTOR-PLAN
- INV-NO-GEN-DEFAULT
- INV-NO-VIBEMOTION-FINAL
- INV-NO-HYPERFRAMES-UNPROMOTED-FINAL
- INV-PLUGIN-ADAPTER-TRACE
- INV-AI-VIDEO-GEN-INSERT
- INV-SPARK-NEEDS-ASSET
- INV-SCREEN-RECORDING-ROUTE
- INV-NO-PARALLEL-TRUTH
- INV-NO-MOTHER-REWRITE-ON-VARIANT
- INV-HOOK-DESIGN-REQUIRED
- INV-ENERGY-CURVE-REQUIRED
- INV-MONOTONY-CHECK
- INV-HERO-FRAME-REQUIRED
- INV-SCENE-JOB-NAMED
- INV-SCENE-DECISION-CARD
- INV-RECORDING-CORRECTION-BEFORE-VISUAL
- INV-BRAINSTORMING-BEFORE-PICTURE
- INV-SCENE-EDGE-FLOW
- INV-COMPILED-DIRECTOR-TRACE
- INV-FINAL-RENDER-JOB-TRACE
- INV-NO-SILENT-PASS

## Reference Index

- [codex-runbook.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\codex-runbook.md)
- [stage-lifecycle.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\stage-lifecycle.md)
- [approval-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\approval-contract.md)
- [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md)
- [project-state-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\project-state-contract.md)
- [story-mother-and-variants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\story-mother-and-variants.md)
- [douyin-hook-science.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\douyin-hook-science.md)
- [energy-density-map.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\energy-density-map.md)
- [visual-contrast-system.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\visual-contrast-system.md)
- [visual-excellence-patterns.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\visual-excellence-patterns.md)
- [source-material-director-pass.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\source-material-director-pass.md)
- [recording-motion-routing.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\recording-motion-routing.md)
- [screen-recording-routing.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\screen-recording-routing.md)
- [local-runtime-environment.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\local-runtime-environment.md)
- [artifact-export-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\artifact-export-contract.md)
- [publish-review-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\publish-review-contract.md)
- [legacy-bridge.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\legacy-bridge.md)
- [runner-integration.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\runner-integration.md)
