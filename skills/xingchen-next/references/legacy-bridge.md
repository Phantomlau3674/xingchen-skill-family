# Legacy Bridge

## Purpose

The legacy bridge exists so old Xingchen projects can move into Xingchen Next without pretending the old artifacts are still the main truth layer.

## Import Direction

Import these legacy artifacts into `project-state.json` when available:

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
- `effect-brief.md`
- `scene-direction.json`
- `video-project.json`
- `render-plan.json`
- `lookdev-gate-result.json`

## Import Rules

- duplicate `scene_id` values must block import
- conflicting proof bindings must block import
- missing critical artifacts must be recorded as incomplete state, not guessed
- imported artifacts become trace data inside `project-state.json.exports` or per-section provenance
- imported `sources`, `proof`, `script`, `visual`, `mother`, `render`, and `review` sections should each carry a `provenance` object with `origin`, `used_artifacts`, `missing_artifacts`, and `imported_at`
- legacy `lookdev-gate-result.json` entries should be copied into `review.lookdev_gate_results` verbatim during import

The Python `xingchen_next_runner` CLI referenced in older docs does not exist (see [runner-integration.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\runner-integration.md)). Codex performs legacy import directly: walk the legacy bundle, populate the matching `project-state.json` sections (each with a `provenance` object), then run `node C:\Users\liuzh\.codex\skills\xingchen-next\schema\validate-project-state.mjs` against the result.

## Export Direction

Export legacy artifacts only when:

- an old tool still requires them
- the user is auditing an older pipeline
- recovery needs a pre-state handoff

## No Regression Rule

After import:

- `project-state.json` becomes canonical
- legacy artifacts stay derived or archived
- do not start editing the old files as if they were still the main source of truth
