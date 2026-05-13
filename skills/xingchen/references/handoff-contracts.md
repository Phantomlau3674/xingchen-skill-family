# Xingchen Legacy Bridge Contracts

## Primary Truth

In Xingchen Next, the canonical truth is:

- `project-state.json`

Legacy artifacts are now import or export views only.

## Legacy Import Map

Import these artifacts into state sections when available:

- `transcript.tsv` -> `sources`
- `asset-manifest.json` -> `sources.source_pack.existing_assets`
- `editorial-brief.md` and `scene-board.md` -> `mother.story_mother`
- `proof-pack.json` -> `proof`
- `spoken-script.md`, `slides.md`, `beat-map.json` -> `script`
- `art-direction.md`, `visual-language-kit.json`, `lookdev-gate.yaml` -> `visual`
- `effect-brief.md`, `scene-direction.json` -> `render.scene_motion_specs` provenance
- `video-project.json`, `render-plan.json` -> `exports.render_pack`
- `lookdev-gate-result.json` -> `review.lookdev_gate_results`

## Legacy Export Map

Export legacy files from state only when an old consumer still needs them.

Recommended export buckets:

- review artifacts
- render artifacts
- optional legacy package pair for recovery-only flows

## Blocking Conditions

Stop migration when:

- two artifacts disagree on `scene_id`
- proof bindings conflict
- required approvals are missing but the export claims approved truth
- a legacy file tries to overwrite newer state truth without an explicit recovery decision

## Legacy Package Pair

`script-package.json` and `motion-blueprint.json` remain fallback appendix artifacts only.

They must not be used as the default handoff for new work.
