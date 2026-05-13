# Artifact Export Contract

## ArtifactExportRequest

Use `ArtifactExportRequest` when deriving files from `project-state.json`.

Minimum fields:

- `export_kind`
- `variant_id`
- `source_state_path`
- `target_root`
- `include`

Allowed `export_kind` values:

- `review-pack`
- `render-pack`
- `publish-pack`
- `legacy-pack`

## `review-pack`

Recommended outputs:

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
- `vibemotion-candidate-plan.json`
- `hyperframes-candidate-plan.json`
- `candidate-manifest.json`
- `candidate-review-notes.md`

## `render-pack`

Recommended outputs:

- `video-project.json`
- `render-plan.json`
- approved VibeMotion candidate references when they are being promoted
- approved Hyperframes candidate references when they are being promoted as HTML/canvas plates, transparent assets, or Remotion components
- candidate provenance fields: `candidate_origin` and `state_trace_refs[]`
- preview props or render config files when needed

## `publish-pack`

Recommended outputs:

- platform titles
- cover briefs
- subtitle policy summary
- delivery notes
- final file references

## `legacy-pack`

Allowed only for:

- migration
- audit
- recovery

Recommended outputs:

- `transcript.tsv`
- `asset-manifest.json`
- legacy review artifacts
- legacy package pair only when the consumer explicitly requires it

## Export Rules

- packs are views, not truth
- every pack should record `source_state_path`
- do not backfill missing truth by inventing values during export
- export failure should point back to the missing state section, not silently downgrade quality
- VibeMotion candidate files are review evidence until lookdev approval and Remotion promotion are both recorded
- Hyperframes candidate files are review evidence until lookdev approval and final renderer promotion are both recorded
- candidate files without `candidate_origin` and `state_trace_refs[]` must stay out of render-pack promotion
