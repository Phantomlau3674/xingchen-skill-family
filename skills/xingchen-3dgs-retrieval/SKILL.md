---
name: xingchen-3dgs-retrieval
description: Use when a Xingchen video scene needs a real 3DGS space, Gaussian splat, navigable 3D world plate, Aholo Viewer preview, or searchable 3D spatial asset before visual-compiler/render work.
---

# Xingchen 3DGS Retrieval

## Role

This skill finds, evaluates, and registers 3DGS / Gaussian splat world assets for Xingchen scenes. It sits between visual resource preflight and renderer execution.

Use it when a scene board says the picture may need:

- real scanned space, room, street, museum, lab, store, archive, city block, or landscape
- a navigable 3D world plate rather than a flat generated image
- `.ply`, `.spz`, `.splat`, `.ksplat`, `.sog`, `.zip`, or related 3DGS files
- Aholo Viewer preview/distribution, Spark 3DGS, or Remotion-controlled browser canvas plates

Do not use it for literal proof screenshots, charts, UI captures, subtitles, exact text, generic premium background, or scenes where Remotion-native objects are enough.

## Workflow

1. Read the current scene's visual job from `visual.director_board.scene_boards[]` or the user's requested画面.
2. Decide whether a real 3DGS asset is justified. If not, return to Remotion/imagegen/source-media routes.
3. Search in this order:
   - existing local library: `C:\xingchen-spark\assets\spark-worlds\manifests\manifest.json` and `C:\Users\liuzh\Videos\douyin\visual-assets\registry\asset-registry.json`
   - current public sources in [3dgs-source-catalog.md](./references/3dgs-source-catalog.md)
   - official project pages, Hugging Face datasets, GitHub releases, Scaniverse/SPZ, Polycam exports, or Aholo examples
4. For each candidate record: source URL, format, size, license/provenance, commercial-use status, content fit, expected camera route, and viewer compatibility.
5. Prefer assets that can be previewed in Aholo Viewer or converted with `@manycore/aholo-splat-transform`; keep Spark/Remotion integration as downstream execution, not discovery truth.
6. Download only when license/provenance is acceptable and the scene has a real need. Place unreviewed assets under `C:\xingchen-spark\assets\spark-worlds\_incoming\<asset-id>\`.
7. Register approved assets in `C:\xingchen-spark\assets\spark-worlds\manifests\manifest.json` after preview evidence, stable path, camera presets, and license notes exist.

## Aholo Viewer Path

Use Aholo Viewer for browser preview, shareable 3DGS inspection, and large-scene evaluation when the asset format is compatible or can be converted.

Useful commands and docs:

```powershell
npm install @manycore/aholo-splat-transform -g
splat-transform create input.ply output.spz
splat-transform lod:auto-chunk --type spz --max-chunk-counts 200000 input.ply output-lod
```

Official entrypoints:

- `https://aholojs.dev/zh-CN/`
- `https://github.com/manycoretech/aholo-viewer`

Aholo Viewer is a viewer/renderer. It does not by itself create a 3D space from video. For creation, use Aholo app/platform, Polycam, Scaniverse, or another 3DGS reconstruction pipeline, then bring the resulting file back through this skill.

## Candidate Matrix

For each shortlisted asset write a compact row:

```json
{
  "candidate_id": "3dgs-playroom-v001",
  "scene_id": "S03",
  "source_url": "",
  "source_kind": "huggingface|github|scaniverse|polycam|aholo|local|other",
  "format": "ply|spz|splat|ksplat|sog|zip|other",
  "license": "",
  "commercial_use_status": "allowed|allowed_with_attribution|research_only|unclear|forbidden",
  "content_fit": "",
  "viewer_plan": "aholo_viewer|spark|convert_then_aholo|preview_only|reject",
  "quality_risks": [],
  "download_path": "",
  "preview_evidence": "",
  "decision": "shortlist|download|approve|reject"
}
```

## Approval Rules

- Never approve an asset with unclear license for a public/commercial video. Keep it as research-only or reject it.
- Do not describe ordinary mesh/point-cloud `.ply` as 3DGS unless the file contains Gaussian splat attributes and loads in a 3DGS viewer.
- If a dataset is research-only, it can be used for local route tests but not final public publishing.
- A final 3DGS scene must still keep captions, proof overlays, audio timing, and final assembly under Remotion/Xingchen state control.
- Lookdev approval requires a real moving browser preview or captured plate, not a static screenshot.

## Outputs

Produce or update:

- `3dgs-resource-scout.md`
- `3dgs-resource-scout.json`
- optional Aholo Viewer preview notes or URL
- optional `_incoming\<asset-id>\` downloaded asset folder
- approved asset manifest update only after review evidence exists

## References

- [3dgs-source-catalog.md](./references/3dgs-source-catalog.md)
- [spark-3dgs-world-route.md](../xingchen-next/references/spark-3dgs-world-route.md)
- [visual-resource-and-prompt-preflight.md](../xingchen-next/references/visual-resource-and-prompt-preflight.md)
