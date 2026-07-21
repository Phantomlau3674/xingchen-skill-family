# ComfyUI 3D Asset Lane

This lane exists because 3D quality depends more on asset readiness than on choosing a fashionable renderer. ComfyUI 3D workflows may help Xingchen generate or prepare 3D assets, but they do not decide scene purpose, proof meaning, camera language, subtitles, or final assembly.

Use this lane before `html_3d`, `spark`, or a 3D `gen_insert` decision when the director board needs a concrete mesh, splat, multi-view reference, depth plate, normal map, texture, or concept object.

## Official / Primary References

- ComfyUI Hunyuan3D-2 docs: https://docs.comfy.org/tutorials/3d/hunyuan3D-2
- Tencent Hunyuan3D-2: https://github.com/Tencent-Hunyuan/Hunyuan3D-2
- ComfyUI-Hunyuan3DWrapper: https://github.com/kijai/ComfyUI-Hunyuan3DWrapper
- ComfyUI-3D-Pack: https://github.com/MrForExample/ComfyUI-3D-Pack
- Stable Fast 3D: https://github.com/Stability-AI/stable-fast-3d
- TRELLIS: https://github.com/microsoft/TRELLIS

## Core Rule

Generated 3D is never evidence by default.

- Literal proof, UI, charts, screenshots, PDFs, terminals, source clips, and numbers stay as Remotion/source-media proof planes.
- ComfyUI-generated 3D may be used as concept object, metaphor, world plate, transition object, or non-proof atmosphere only after a quality review.
- If the 3D asset cannot pass asset readiness, use 2.5D planes, procedural geometry, or source-media treatment instead.

## Asset Readiness Ladder

Choose the lowest level that serves the scene.

| Level | Name | Use | Route |
|---|---|---|---|
| L0 | No 3D asset | Scene only needs proof or clear explanation. | Remotion 2D / source media |
| L1 | 2.5D proof plane | Screenshot, chart, page, or UI is mapped to a flat plane with camera push. | Remotion-native 3D or 2.5D CSS |
| L2 | Procedural concept geometry | Nodes, ribbons, cards, axes, rooms, grids, corridors, or data objects built from script/proof structure. | Remotion Three / HTML 3D |
| L3 | Generated concept mesh | ComfyUI produces a GLB/OBJ/PLY object from an image or prompt; it is symbolic, not proof. | Remotion Three / HTML capture |
| L4 | Approved cinematic mesh | Mesh has usable topology, UVs, texture/PBR, stable scale/orientation, and preview evidence. | Remotion Three / HTML 3D |
| L5 | Approved spatial world / splat | Real or generated 3DGS/world asset with route status, provenance, preview, and performance budget. | Spark / browser canvas plate |

Do not jump to L3-L5 when L1-L2 would communicate the idea more clearly.

## ComfyUI 3D Use Cases

### Hunyuan3D-2 / Hunyuan3D-2mv

Best for:

- single-object concept meshes
- hero metaphor objects
- multi-view assisted object geometry
- PBR-capable object generation after quality review

Use when:

- the scene has a concrete object concept
- the object is not proof
- a GLB output is acceptable
- a generated texture can be reviewed and, if needed, replaced or simplified

Reject when:

- the scene needs readable text, UI truth, charts, or factual evidence
- the input image is too abstract or cropped for stable geometry
- bad topology, broken back side, melted detail, or texture seams become visible in the planned camera path

### Stable Fast 3D

Best for:

- fast single-image-to-GLB concept proxies
- quick lookdev object tests
- low-friction hero-object auditions

Use when:

- speed matters more than highest detail
- the camera does not inspect the asset extremely closely
- a GLB with UV/remesh options is useful

Reject when:

- the object carries critical identity details
- the asset must survive close macro shots
- gated model access or experimental Windows support blocks the workflow

### TRELLIS

Best for:

- higher-end image-to-3D asset lab work
- mesh plus 3D Gaussian/Radiance Field experiments
- variants of a concept object

Use when:

- there is time for an asset-development pass
- Linux/NVIDIA requirements are acceptable
- the output needs multiple possible representations

Reject when:

- the episode needs fast turnaround
- the project machine cannot run the model reliably
- the result would be used as hidden proof or full-scene truth

### ComfyUI-3D-Pack

Best for:

- experimental multi-model 3D node workflows
- mesh / UV / texture / NeRF / 3DGS experiments
- comparing InstantMesh, CRM, TripoSR, and related algorithms

Use when:

- a dedicated asset pass is acceptable
- dependency/runtime fragility is budgeted
- outputs are treated as candidates with provenance and preview evidence

Reject when:

- the video pipeline needs dependable one-click production
- missing wheels, CUDA/C++ builds, or model downloads would delay the episode
- the output is being used to justify 3D after the director board failed to need it

## Material Strategy for Knowledge Videos

Many Xingchen projects start from scripts, screenshots, slides, and recordings, not rich physical-object footage. That is fine. Use these strategies:

1. **Proof plane first**: if the material is a source page, UI, chart, or screenshot, keep it flat/readable and add depth only around it.
2. **Procedural geometry before generated mesh**: build concept rooms, knowledge maps, axes, stacks, and corridors from the argument structure.
3. **Generated object only for metaphor**: ComfyUI 3D is suitable for a "black box", "knowledge core", "model engine", "market maze", or "agent tool" object, not for factual claims.
4. **Multi-view stabilization**: when generating an object, create or collect front/side/back/three-quarter views before Hunyuan3D-2mv or TRELLIS. Single-view assets need stricter camera limits.
5. **Depth/normal plates are allowed**: if a full mesh is weak, use generated depth/normal/displacement as a 2.5D parallax or lighting aid instead of pretending it is a finished 3D asset.
6. **Silhouette beats detail**: for fast Douyin shots, a clean silhouette with good lighting often beats a detailed but melted model.

## Required Director Board Fields

When using ComfyUI 3D, the scene board must write:

- `source_layer.evidence_role`: usually `supporting`, `background`, or `none`; `hero` only when the 3D object is itself a non-factual concept hero.
- `component_layer.component_props_brief`: model/workflow candidate, input image refs, expected output format, and fallback component.
- `component_layer.kit_extension_needed`: `true` unless the exact 3D component already exists.
- `frame_layer.camera_path`: camera only shows angles the asset can survive.
- `frame_layer.depth_plan`: foreground proof/subtitle, midground object, background world/lighting.
- `detail_layer.material_surface`: matte, glass, metal, paper, emissive, or splat/world surface.
- `tech_stack_layer.integration_mode`: `generated_asset_to_remotion_three`, `generated_asset_to_html_3d`, `generated_asset_to_spark_plate`, `depth_plate_2_5d`, or `asset_lab_only`.
- `tech_stack_layer.preview_required`: turntable preview plus Remotion/HTML composite preview.
- `lookdev_acceptance.aesthetic_check`: must mention silhouette, material, lighting, scale, camera survivability, and proof/subtitle separation.

## Asset Manifest Requirements

Every generated 3D candidate must be logged before use:

```json
{
  "asset_id": "",
  "asset_kind": "mesh|texture|depth_map|normal_map|multi_view_refs|splat|radiance_field|turntable_preview",
  "generator": "hunyuan3d_2|hunyuan3d_2mv|stable_fast_3d|trellis|comfyui_3d_pack|manual",
  "source_refs": [],
  "prompt_or_workflow_path": "",
  "output_paths": [],
  "format": "glb|obj|ply|spz|splat|png|mp4|json",
  "license_status": "project_generated|approved_source|unknown|blocked",
  "quality_status": "candidate|approved|rejected|needs_cleanup",
  "quality_notes": "",
  "camera_limits": "",
  "fallback_plan": ""
}
```

Until the asset is `approved`, downstream render specs must treat it as a candidate or fallback, not final visual truth.

## Lookdev Gate

Approve a ComfyUI 3D asset only when all checks pass:

- turntable or multi-angle preview exists
- mesh is not visibly melted at the planned camera distance
- texture seams and UV artifacts are not visible in the planned shot
- scale/orientation are stable
- silhouette is readable in the first second
- no fake readable text, fake UI, fake logo, fake chart, or false factual evidence appears
- proof regions and subtitles remain outside the 3D spectacle layer
- fallback scene still works if the generated asset is rejected

Fail with field paths such as:

- `scene-03.component_layer.component_props_brief`
- `scene-03.frame_layer.camera_path`
- `scene-03.detail_layer.material_surface`
- `scene-03.tech_stack_layer.integration_mode`
- `render.generated_3d_assets[0].quality_status`

## Hard Anti-Patterns

- Full scene becomes 3D just because a generated object exists.
- A weak generated mesh is hidden with dark lighting and called cinematic.
- Proof screenshot is reinterpreted by a 3D model.
- Camera orbits around an object while the narration is explaining a claim that needs reading.
- ComfyUI outputs are used without turntable preview and fallback.
- 3D model contains fake text/logos/UI and is treated as real.
- Spark is used because the mesh looks "more cinematic"; Spark still needs a world/spatial route.
