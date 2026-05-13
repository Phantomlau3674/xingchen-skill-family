---
name: xingchen
description: Use when migrating, auditing, or recovering legacy artifact-first xingchen projects and bridging them into Xingchen Next.
---

# Xingchen Legacy Bridge

## Overview

`xingchen` is now the compatibility bridge for the old artifact-first short-video family.

New work should start in [xingchen-next](C:\Users\liuzh\.codex\skills\xingchen-next\SKILL.md), where `project-state.json` is the single source of truth.

Use this bridge when:

- an older project already exists as markdown/json artifacts
- an old prompt still expects the legacy artifact chain
- migration, audit, or recovery needs a legacy handoff

## Bridge Responsibilities Only

- import legacy artifact bundles into `project-state.json`
- export legacy packs from a stateful Xingchen Next project
- preserve scene ids and proof meaning during migration
- record missing or conflicting legacy data instead of guessing

This bridge should not own active house-style, proof, composition, or render references anymore. Those now live with the owning Xingchen Next skills.

## Legacy Artifact Bundle

The legacy family may include:

- `transcript.tsv`
- `asset-manifest.json`
- `editorial-brief.md`
- `scene-board.md`
- `proof-pack.json`
- `spoken-script.md`
- `slides.md`
- `beat-map.json`
- `art-direction.md`
- `visual-language-kit.json`
- `lookdev-gate.yaml`
- `scene-asset-map.md`
- `effect-brief.md`
- `scene-direction.json`
- `video-project.json`
- `render-plan.json`
- `lookdev-gate-result.json`

## Forward To Xingchen Next

If the work is new or should be treated as new, route to `xingchen-next` and create `project-state.json`.

That is the default for:

- source-pack-first projects
- knowledge-opinion videos
- platform variants from one mother
- code-first rendering
- post-publish review loops

## Bridge Rules

- do not let legacy artifacts outrank `project-state.json` after import
- do not start a new project from legacy files alone
- duplicate `scene_id` values must block migration
- proof conflicts must block migration
- `legacy-pack` output is only for migration, audit, or recovery
- exported legacy files remain views, not primary truth

## References

- [handoff-contracts.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\handoff-contracts.md)
- [xingchen-next](C:\Users\liuzh\.codex\skills\xingchen-next\SKILL.md)
- [legacy-bridge.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\legacy-bridge.md)
