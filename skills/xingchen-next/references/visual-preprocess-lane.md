# Visual Preprocess Lane

This lane is the practical non-3D upgrade path for Xingchen videos. It turns still images, screenshots, source plates, generated keyframes, or selected frames into depth, mask, upscale, repair, and camera-path assets that Remotion can compose into richer motion.

Use this before reaching for Marble, Spark, full video generation, or complex 3D. It is the default fix when a scene feels flat, slide-like, low-resolution, or visually under-authored but still needs proof, subtitles, and timing controlled by Remotion.

## Core Route

Preferred short loop:

```text
still/source plate -> depth_map -> foreground/text-safe masks -> upscaled/repaired still -> camera_path -> Remotion 2.5D composite
```

Recommended local model lanes:

| Job | Preferred tool | State asset kind | Backend note |
|---|---|---|---|
| Depth / parallax | Depth Anything V2 Small | `depth_map` | `pytorch_rocm`, `onnxruntime_directml`, or `cpu` |
| Foreground / subtitle-safe masks | MobileSAM | `foreground_mask`, `text_safe_mask` | `pytorch_rocm`, ONNX/DirectML when available |
| Upscale / deblocking | Real-ESRGAN ncnn Vulkan | `upscaled_still` | `ncnn_vulkan`, good fit for AMD APU |
| Local repair | GFPGAN / manual paint / local script | `repaired_still` | only for non-proof image quality fixes |
| Camera plan | local script / visual compiler | `camera_path`, `layered_2_5d_manifest` | deterministic JSON for Remotion |

## State Contract

Every generated preprocessing artifact goes into `render.visual_preprocess_assets[]`.

Minimum item:

```json
{
  "asset_id": "vp-S03-depth",
  "scene_id": "S03",
  "source_asset_ref": "sources.asset_manifest.screenshot-main",
  "asset_kind": "depth_map",
  "generator": "depth_anything_v2_small",
  "backend": "pytorch_rocm",
  "output_paths": [
    "assets/S03/depth.npy",
    "assets/S03/depth_vis.png"
  ],
  "status": "generated",
  "state_trace_refs": [
    "visual.director_board.scene_boards.S03",
    "render.scene_motion_specs.S03"
  ],
  "remotion_usage": "Use the depth map for 2.5D parallax camera movement behind Remotion proof and subtitle layers.",
  "proof_policy": "Preprocessing does not alter proof; Remotion owns proof overlays, subtitles, and factual labels.",
  "quality_checks": {
    "nonblank": true,
    "no_proof_rewrite": true
  },
  "adapter_run_id": "adapter-visual-preprocess-S03"
}
```

Each generated or previewed asset must be linked from `render.plugin_adapter_runs[].candidate_ids[]` by `asset_id`. Use `adapter_id: "visual-preprocess-lane"` for a bundled local preprocessing pipeline, or the specific adapter id when only one model was run:

- `depth-anything-v2-small`
- `mobilesam`
- `realesrgan-ncnn-vulkan`
- `gfpgan`
- `rife-lite`
- `local-visual-preprocess`

## Remotion Boundary

These assets are material, not truth.

- Depth maps guide parallax, focus, lighting, or 2.5D camera motion.
- Masks guide foreground separation, subtitle avoidance, local blur, or glow.
- Upscaled/repaired stills improve texture quality.
- Camera paths decide deterministic motion for Remotion.
- None of them may rewrite source proof, readable claims, UI evidence, subtitles, numbers, logos, or factual labels.

Remotion stays responsible for:

- proof overlays
- captions and subtitles
- claim text and labels
- final timing and audio sync
- composition order and crop

## When To Use

Good fits:

- screenshots, source pages, diagrams, and proof plates that need camera language
- imagegen keyframes that are useful but too flat
- low-resolution background or source plates
- scenes where foreground/background separation improves subtitle safety
- non-proof establishing shots that need texture and depth

Bad fits:

- fake UI, fake data, fake proof, or synthetic claims
- full video generation as a substitute for storyboarding
- rewriting charts, documents, or screenshots through an image model
- applying face or text repair to identity/proof material without explicit review
- trying to make a weak image look premium with blur and darkness

## Quality Bar

Before lookdev accepts preprocessing:

- output files exist and are nonblank
- masks align with the intended subject or subtitle-safe zone
- depth does not invert the main subject or create obvious tearing
- upscale does not hallucinate fake text or labels
- camera path is deterministic and does not make proof unreadable
- Remotion preview shows the final text/proof layers above the processed plate

Failure messages should point to:

- `render.visual_preprocess_assets[...].remotion_usage`
- `render.visual_preprocess_assets[...].proof_policy`
- `render.plugin_adapter_runs[...].candidate_ids`
- `render.scene_motion_specs[...].component_path`

## First Implementation Target

The first production-grade local target should be:

1. `depth_anything_v2_small` -> `depth.npy`, `depth_vis.png`
2. `mobile_sam` -> `mask_fg.png`, optional `mask_textsafe.png`
3. `realesrgan_ncnn_vulkan` -> `still_upscaled.png`
4. local camera planner -> `camera_path.json`, `preprocess_manifest.json`

The skill should treat this as a preprocessing layer. Do not add these model dependencies to the `xingchen-next` router runtime; run them through project-local scripts, ComfyUI/local Python, or a dedicated visual preprocessing helper, then record outputs in state.
