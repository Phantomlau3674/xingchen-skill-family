# 3DGS Source Catalog

Use this as a starting map, then verify live links and licenses before downloading.

## First Check Local

- `C:\xingchen-spark\assets\spark-worlds\manifests\manifest.json`
- `C:\xingchen-spark\assets\spark-worlds\approved`
- `C:\xingchen-spark\assets\spark-worlds\_incoming`
- `C:\Users\liuzh\Videos\douyin\visual-assets\registry\asset-registry.json`

Do not redownload a public asset if a reviewed local copy already exists.

## Public Sources

### Hugging Face

- `https://huggingface.co/datasets/Voxel51/gaussian_splatting`
  - Good first test set: classic 3DGS examples such as playroom, drjohnson, train, and truck.
  - Use for route smoke tests and viewer compatibility.
- `https://huggingface.co/datasets/GaussianWorld/scene_splat_49k`
  - Large scene collection for space-like visual searches.
  - Treat license and split terms carefully before public use.
- `https://huggingface.co/datasets/404-Gen/404mini`
  - Generated 3DGS-like assets in `.ply.spz`; better for object/style tests than real space.

### Official 3DGS / Benchmark Sources

- `https://github.com/graphdeco-inria/gaussian-splatting`
  - Original 3D Gaussian Splatting implementation and pretrained model resources.
  - Often large; best for technical benchmark references.
- `https://huggingface.co/johnowhitaker/gaussian_splatter_models`
  - Mirror-style access to common pretrained examples.

### Mobile Scan / SPZ Ecosystem

- `https://scaniverse.com/spz`
  - SPZ format and Scaniverse ecosystem.
  - Public community scans may not always allow direct download or commercial use.
- Polycam Gaussian splat docs and exports:
  - `https://learn.poly.cam/hc/en-us/articles/30298543166612-How-to-Create-Gaussian-splats-on-Polycam-Web`
  - `https://learn.poly.cam/hc/en-us/articles/41491673295508-How-to-Import-Your-Gaussian-Splat-Captures-into-Unity`
  - Good when the user can create or export their own capture.

### Aholo

- `https://www.aholo3d.com/`
- `https://aholojs.dev/zh-CN/`
- `https://github.com/manycoretech/aholo-viewer`

Aholo app/platform can create or host 3D spaces. Aholo Viewer is the browser renderer for inspection/distribution.

## Search Queries

Use targeted queries such as:

- `"3D Gaussian Splatting" "download" "ply"`
- `"3DGS" "spz" "download"`
- `site:huggingface.co/datasets "gaussian splatting" "ply"`
- `site:github.com "gaussian splatting" "pretrained models"`
- `site:scaniverse.com "SPZ" "download"`

For Chinese content:

- `"3D 高斯" "下载" "PLY"`
- `"高斯泼溅" "SPZ"`
- `"3DGS 数据集" "下载"`

## Quality Checklist

- Is it a true 3DGS asset, not a normal mesh or point cloud?
- Does it load in Aholo Viewer, Spark, SuperSplat, or another reliable 3DGS viewer?
- Is the scene visually aligned with the script, not just impressive?
- Are camera paths safe for vertical 9:16 composition and subtitles?
- Does license allow the intended use?
- Is attribution required?
- Does the file size fit the render/capture workflow?
- Are there people, brands, private interiors, license plates, artwork, or copyrighted objects that create rights risk?

## Recommended Decisions

- `approve`: license/provenance clear, loads in viewer, scene fit is strong, preview evidence recorded.
- `shortlist`: content fit is promising, but download or license still needs checking.
- `research_only`: useful for local testing or inspiration, not for public final.
- `reject`: license unclear/forbidden, weak fit, too heavy, broken load, or non-3DGS file.
