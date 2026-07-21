---
name: xingchen-asset-intake
description: Use when the user brings screenshots, web captures, documents, or messy image folders that need OCR, deduplication, tagging, and state-backed review before proof decisions or scene-to-asset mapping.
---

# Xingchen Asset Intake

## Knowledge Base Routing

For reusable video methodology, read stevenmind first:

- `C:\stevenmind\stevenmind\04 Wiki\视频创作\`
- `C:\stevenmind\stevenmind\04 Wiki\共享方法论\`
- `C:\stevenmind\stevenmind\04 Wiki\技术栈\`
- `C:\stevenmind\stevenmind\04 Wiki\抖音\` non-legacy pages

Do not read `C:\stevenmind\stevenmind\04 Wiki\公众号创作\`. That domain belongs to `wechat-*`.

Use local `references/`, `schema/`, and validators for executable contracts only: state fields, route policies, INV rules, validator logic, runtime commands, and rollback evidence. If a wiki page and a local reference overlap, use the wiki for method wording and the local reference for machine/state requirements.

Before crossing domains, verify with:

```powershell
python C:\stevenmind\stevenmind\tools\vault_manager.py read-check --root C:\stevenmind\stevenmind --skill xingchen-next --page "{page}"
```
## Mode And Stage

Read `project-state.json` before writing.

- `mode: "lean"`: enter during `brief-evidence`; write reviewed inputs to `brief.sources[]` with `source_id`, `kind`, `ref`, `proof_eligible`, and concise notes.
- `mode: "extended"` or legacy state without `mode`: enter during `ingest`; write `sources.asset_manifest` and optional `sources.brand_kit`.

Upstream prerequisite: `metadata.project_id` exists. Do not use intake to bind assets to final scenes or decide whether a candidate truly proves a claim.

## Global Visual Asset Library

Reusable visual assets do not belong only to one project. When the user asks to gather, download, reuse, or "move" visual materials, register them under the global library:

- root: `C:\Users\liuzh\Videos\douyin\visual-assets`
- registry: `C:\Users\liuzh\Videos\douyin\visual-assets\registry\asset-registry.json`
- project usage manifests: `C:\Users\liuzh\Videos\douyin\visual-assets\registry\project-usages\`

Follow [visual-asset-library-governance.md](../xingchen-next/references/visual-asset-library-governance.md). The project folder may keep a small `_ready_materials\asset-library-reference.md`, but reusable models, HDRIs, textures, icon packs, and reference packs should be canonical in the global library.

## Brand Kit ingestion (per-project optional, per-account persistent)

For Extended projects, when the user provides a coherent set of character-sheet-style assets meant to persist across multiple video projects, register them in `sources.brand_kit` per the schema in [`project-state-contract.md::BrandKit`](../xingchen-next/references/project-state-contract.md). Required fields: `brand_kit_id`, `character_id`, `character_sheet_path`, `character_sheet_manifest_path`, `expression_slices[]`, `view_slices[]`, `props_library[]`, `color_palette[]`, `typography_lock`, `voice_persona`, `brand_kit_locked_at`, `brand_kit_version`, `provenance`.

Lean mode does not contain `sources.brand_kit`. Register reusable files in the global library and list concrete project inputs in `brief.sources[]`. Use Extended mode only when the full brand-kit state contract is actually needed.

`xingchen-asset-intake` is the **owning skill** for brand_kit ingestion. Downstream skills (director-board / visual-compiler) read `sources.brand_kit` when `concrete_execution_plan.asset_kind = "chibi_layered"` — they cannot synthesize a brand kit on demand. If a project needs chibi_layered scenes but `sources.brand_kit` is empty, asset-intake should be re-entered to register the kit before visual-direction proceeds.

Detection heuristics for brand_kit candidate folders:

- folder contains a single large `character-sheet`-like image plus a `slices/` or `transparent/` subdirectory with per-expression / per-view PNGs
- a manifest.json listing slice metadata exists
- file naming follows `{character}_{view}.png` / `{character}_expr_{emotion}.png` patterns
- the user explicitly says "this is the character / mascot / virtual host"

When detected, write the brand_kit entry; do NOT also register the same files in `sources.asset_manifest[]` (asset_manifest is for per-project source material, brand_kit is for cross-project brand persistence).

## Ironclad rules

- INV-STATE-TRUTH applies: Lean writes `brief.sources[]`; Extended writes `sources.asset_manifest`. Exported manifests are review surfaces, never parallel canonical truth.
- INV-GLOBAL-ASSET-REGISTRY applies: before adding new reusable visual assets, check the global registry for duplicates; after adding them, record source, license, local path, checksum or pack checksum, tags, and intended visual roles.
- Do not mark an asset as literal proof unless the visible content really proves the claim. (Proof type is decided downstream.)
- Preserve original file paths so later skills can find the right screenshots again.

Other shared rules: see [cross-skill-invariants.md](../xingchen-next/references/cross-skill-invariants.md).

## Skill-local procedure

1. Inventory the provided folders; do not move or rename original files.
2. Extract lightweight OCR or visible-text summaries.
3. Detect obvious duplicates and near-duplicates; collapse into a `dedupe_group`.
4. Classify each asset by type and likely topic; keep tags short and reusable.
5. Flag each asset as `proof_candidate`, `context`, `comparison`, `avoid`, or `needs_human` when crop, blur, or OCR is weak.
6. Write Lean inputs to `brief.sources[]` or Extended inputs to `sources.asset_manifest`, matching the active mode.
7. For reusable assets, register or update `visual-assets\registry\asset-registry.json` and create/update the project usage manifest instead of leaving a loose project-local download pile.

### Per-asset decision shape

For each asset write:

- what it appears to show
- candidate role (`proof_candidate` / `context` / `comparison` / `avoid`)
- whether it duplicates another asset closely enough to collapse
- whether human confirmation is still needed

Filenames are not authoritative — never assume the user's filenames carry meaning the OCR can't independently confirm.

## References

- [asset-manifest-schema.md](./references/asset-manifest-schema.md) — minimum schema and review vocabulary
- [visual-asset-library-governance.md](../xingchen-next/references/visual-asset-library-governance.md) — global reusable visual asset registry and project usage rules
- [codex-runbook.md](../xingchen-next/references/codex-runbook.md) — `ingest` stage
