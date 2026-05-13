---
name: xingchen-asset-intake
description: Use when the user brings screenshots, web captures, documents, or messy image folders that need OCR, deduplication, tagging, and state-backed review before proof decisions or scene-to-asset mapping.
---

# Xingchen Asset Intake

## When to enter

Triggered during `ingest` when raw screenshots, captures, PDFs, or image folders need to become a reviewed inventory. Upstream prerequisite: `metadata.project_id` exists in `project-state.json`. Do not use to bind assets to final scenes — that belongs in mother/variant planning. Do not use to decide proof type — that belongs in `xingchen-proof-pack`.

## Stage owned

`ingest` | writeback: `project-state.json -> sources.asset_manifest` (`asset-manifest.json` is an exported review surface, not canonical truth).

## Ironclad rules

- INV-STATE-TRUTH applies: write `sources.asset_manifest` first, export `asset-manifest.json` only when a pack needs it.
- Do not mark an asset as literal proof unless the visible content really proves the claim. (Proof type is decided downstream.)
- Preserve original file paths so later skills can find the right screenshots again.

Other shared rules: see [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md).

## Skill-local procedure

1. Inventory the provided folders; do not move or rename original files.
2. Extract lightweight OCR or visible-text summaries.
3. Detect obvious duplicates and near-duplicates; collapse into a `dedupe_group`.
4. Classify each asset by type and likely topic; keep tags short and reusable.
5. Flag each asset as `proof_candidate`, `context`, `comparison`, `avoid`, or `needs_human` when crop, blur, or OCR is weak.

### Per-asset decision shape

For each asset write:

- what it appears to show
- candidate role (`proof_candidate` / `context` / `comparison` / `avoid`)
- whether it duplicates another asset closely enough to collapse
- whether human confirmation is still needed

Filenames are not authoritative — never assume the user's filenames carry meaning the OCR can't independently confirm.

## References

- [asset-manifest-schema.md](C:\Users\liuzh\.codex\skills\xingchen-asset-intake\references\asset-manifest-schema.md) — minimum schema and review vocabulary
- [codex-runbook.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\codex-runbook.md) — `ingest` stage
