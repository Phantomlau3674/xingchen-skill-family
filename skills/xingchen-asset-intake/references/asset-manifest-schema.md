# Asset Manifest Schema

In Xingchen Next, this schema maps to `project-state.json -> sources.asset_manifest`.

`asset-manifest.json` is the exported review or legacy view of that state section.

## Required Fields

- `asset_id`: stable identifier reused by proof and scene mapping
- `file_path`: original local path
- `asset_type`: one of `webpage`, `document`, `chat`, `mindmap`, `table`, `terminal`, `slide`, `photo`, `unknown`
- `summary`: short human-readable description
- `topic_tags`: reusable tags for later scene matching
- `proof_candidate`: `yes`, `no`, or `needs-review`
- `dedupe_group`: shared id for close duplicates
- `review_status`: `accepted`, `needs-review`, or `rejected`

## Optional Fields

- `ocr_text`
- `source_url`
- `crop_note`
- `human_note`
- `recommended_usage`

## Review Vocabulary

- `proof`: likely literal evidence
- `context`: useful but not literal proof
- `comparison`: good for before/after or contrast
- `avoid`: low signal, duplicate, or too noisy
