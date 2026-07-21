# Visual Asset Library Governance

Xingchen must not scatter downloaded or generated visual assets across project folders. Use one global library for reusable assets, and lightweight project manifests for per-video selection.

## Canonical Locations

- Global library root: `C:\Users\liuzh\Videos\douyin\visual-assets`
- Global registry: `C:\Users\liuzh\Videos\douyin\visual-assets\registry\asset-registry.json`
- Project usage manifests: `C:\Users\liuzh\Videos\douyin\visual-assets\registry\project-usages\`
- Project handoff folder: `{project_root}\_ready_materials`

The global library owns source provenance, license notes, checksums, tags, and reuse history. A project folder owns only the assets actually selected for that video, plus a manifest that points back to the global asset IDs. Avoid copying large reusable asset packs into every project unless the render tool needs a project-local copy.

## Required Asset Record

Every reusable asset pack or individual asset registered for Xingchen must have:

```json
{
  "asset_id": "",
  "asset_group": "",
  "asset_type": "model|hdri|texture|image|stock_video|source_video|audio|font|icon|component|reference",
  "title": "",
  "source_name": "",
  "source_url": "",
  "license": "",
  "license_url": "",
  "local_path": "",
  "checksum_sha256": "",
  "tags": [],
  "visual_roles": [],
  "best_for": [],
  "do_not_use_for": [],
  "provenance_file": "",
  "used_in_projects": []
}
```

Pack-level records are allowed when the source is a coherent asset pack. For render-critical files such as `.glb`, `.hdr`, `.png`, `.exr`, and `.mp4`, prefer individual file records or a child manifest.

## Discovery Order

Before searching the web or generating assets, the agent must:

1. Read the global registry.
2. Search tags and visual roles for reusable candidates.
3. Decide whether the project can reference the global asset directly or needs a project-local copy.
4. Record selected assets in `{project_root}\_ready_materials\asset-library-reference.md` or a project usage JSON.
5. Only then fetch new assets, generate new assets, or ask the user for manual platform output.

If the global registry is missing, create it before continuing. If a candidate has unclear license or provenance, mark it `blocked_for_reuse` and do not use it in a public video.

## Project Usage Manifest

Each project that uses global assets should write:

```json
{
  "project_id": "",
  "project_root": "",
  "created_at": "",
  "selected_assets": [
    {
      "asset_id": "",
      "role_in_video": "",
      "scene_ids": [],
      "usage_mode": "reference_global|copied_project_local|render_import",
      "project_local_path": "",
      "notes": ""
    }
  ]
}
```

`reference_global` is preferred for research and planning. `copied_project_local` is acceptable when Remotion bundling, offline render, or archive reproducibility requires local files. `render_import` means the file path is wired into code.

## No-Pileup Rule

Do not leave "maybe useful" downloads in a project folder. New assets go through the global library first, then the project manifest selects a subset. If a user asks to gather assets for a project, the deliverable is a registered asset pack plus a project usage manifest, not a loose downloads folder.

## License Discipline

Acceptable default reuse tiers:

- CC0 or public-domain-like assets: reusable after manifesting source and license.
- Public stock video/b-roll: reusable only after clip-level license, attribution, people/brand/property risk, and source page are recorded.
- Permissive open-source components: usable if package license is recorded and attribution needs are noted.
- Official product screenshots/pages: usable as evidence/reference, not as generic decorative stock.
- Generated assets: usable only with prompt, model/provider, date, and output path recorded.

Reject or require human review:

- Unknown license mirrors.
- Social-media reposts without primary source.
- Assets with brand logos used decoratively.
- AI-generated screenshots or fake UI used as proof.

## Writebacks

When a project proves an asset works especially well, add `used_in_projects[]` and a short `best_for` note. When lookdev rejects an asset, add a `do_not_use_for` note so future projects do not repeat the same mistake.
