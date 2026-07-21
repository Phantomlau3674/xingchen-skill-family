# Local Wan Video Insert Lane

This lane governs local ComfyUI Wan2.2 TI2V clips created through the `comfyui-wan-video` skill. It is a bounded generated-video insert lane, not a renderer family and not a full-video controller.

Use it only after the director board names a concrete visual gap and confirms that Remotion, HyperFrames, source media, or visual preprocessing are not the cleaner route.

## ComfyUI Lane Split

| Question | ComfyUI 3D asset lane | Local Wan video insert lane |
|---|---|---|
| Output | mesh, GLB, OBJ, PLY, splat, depth, normal, texture, or turntable preview | short mp4 video plate |
| Model family | Hunyuan3D, ComfyUI-3D-Pack, TRELLIS, Stable Fast 3D | Wan2.2 TI2V 5B |
| Integration | Spark, Remotion Three, HTML 3D, or asset lab | Remotion `video_plate` |
| State path | `render.scene_motion_specs[].world_asset` or generated 3D asset records | `render.ai_video_prompt_requests[]` and `render.ai_video_candidates[]` |
| Upstream reference | [comfyui-3d-asset-lane.md](./comfyui-3d-asset-lane.md) | this file |

If the output is geometry, route to the 3D asset lane. If the output is a motion clip, route here.

## Route Contract

Wan2.2 clips stay under the existing AI video contract:

```json
{
  "render_mode": "gen_insert",
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "ai_video_generation",
  "integration_mode": "video_plate",
  "promotion_target_renderer_family": "remotion_component"
}
```

The lane is governed by `INV-AI-VIDEO-GEN-INSERT`, the Hero-Shot Guardrail, Visual Lock, and Lookdev Approval. Do not create a new `renderer_family`, provider enum, or invariant for Wan2.2 unless real usage shows that the existing AI video guardrail is too loose.

## Adapter Identity

Use:

```json
{
  "adapter_kind": "local_skill",
  "adapter_id": "comfyui-wan22-ti2v",
  "skill_name": "comfyui-wan-video"
}
```

`adapter_kind: "local_cli"` is also valid when the submit script is called directly. `provider` remains `"other_ai_video"` and `provider_model_hint` / `provider_model` should identify `local_comfyui_wan22_ti2v_5b`.

## When To Use

Prefer this lane when all are true:

- the director board has a named `gen_insert` visual gap
- a strong input image or concept plate already exists
- the clip is needed for physical motion, atmosphere, material behavior, camera drift, or a short concept-motion plate
- the clip will not carry proof, UI, subtitles, numbers, logos, or readable claims
- Remotion remains responsible for foreground captions, proof overlays, voice sync, timeline, and final export
- there is a fallback scene if the generated clip drifts or fails lookdev

Good uses:

- desk-lamp glow breathing across a creator-avatar plate
- abstract data particles moving behind a Remotion proof plane
- a warm city-window plate with subtle camera push
- a concept object shifting light or texture without readable claims

## Do Not Use

Block or reroute when the scene needs:

- exact proof, chart, UI, terminal, screenshot, or source recording
- readable Chinese or English text generated inside the video
- subtitles or captions baked into the model output
- a real person, identity-sensitive face, logo, or brand proof
- full-video timing, voice sync, or final assembly
- a substitute for director-board thinking

If the scene only needs controllable abstract motion, prefer HyperFrames, Canvas, SVG, or Remotion-native components. If the still is flat but truthful, prefer the visual preprocess lane before AI video.

## Shot Brief

Every Wan2.2 request must start from a shot brief, not a prompt alone. Use [wan22-video-insert-brief.template.json](../templates/wan22-video-insert-brief.template.json).

Required thinking:

- `visual_gap`: what visible problem this generated clip solves
- `why_not_remotion_or_hyperframes`: why deterministic code motion is not the better route
- `input_image_role`: what the start image represents and what it is not allowed to become
- `motion_intent`: the single motion job
- `camera_motion`, `subject_motion`, `material_motion`, `background_motion`: four-axis motion control
- `proof_exclusion_policy`: what information must stay out of the generated video
- `remotion_integration_plan`: how Remotion will place, crop, mute, overlay, and time the clip
- `fallback_plan`: what happens if the clip is rejected

Prompt language should be concrete and physical. Avoid style-only prompts such as "cinematic", "premium", or "more advanced" unless they resolve into visible camera, material, lighting, or motion behavior.

## Local Runtime Defaults

The current local smoke-test defaults from `comfyui-wan-video` are:

- model: `wan2.2_ti2v_5B_fp16.safetensors`
- text encoder: `umt5_xxl_fp8_e4m3fn_scaled.safetensors`
- VAE: `wan2.2_vae.safetensors`
- size: `512x288`
- frames: `9`
- fps: `8`
- steps: `4`
- cfg: `5.0`
- sampler: `uni_pc`
- scheduler: `simple`
- shift: `8.0`
- output kind: `mp4`

For project use, increase frames and steps gradually only after a smoke clip proves the input image, prompt, and route are coherent.

## State Writeback

Before generation, create a prompt request:

- `render.ai_video_prompt_requests[].provider = "other_ai_video"`
- `provider_model_hint = "local_comfyui_wan22_ti2v_5b"`
- `technical_route = "image_to_video"`
- `prompt_pack_path` or `prompt_path` points to the Wan brief
- `proof_exclusion_policy` and `remotion_integration_plan` are non-empty

After generation, create a candidate:

- `render.ai_video_candidates[].provider = "other_ai_video"`
- `provider_model = "local_comfyui_wan22_ti2v_5b"`
- `motion_source = "ai_video_generation"`
- `integration_mode = "video_plate"`
- `promotion_target_renderer_family = "remotion_component"`
- `output_path` points under `C:\comfyui\output`
- `safety_review` confirms no false evidence, readable claim text, brand/IP issue, or identity risk

Every generated, previewed, promoted, or rejected run must append `render.plugin_adapter_runs[]` with the adapter identity above, related candidate ids, output paths, state writebacks, and lookdev evidence requirement.
