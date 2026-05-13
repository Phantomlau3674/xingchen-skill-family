# AI Video Prompt Pack

This pack is for manual platform generation. Codex writes prompts; the user generates the videos on Seedance or another platform; Codex registers returned files later.

## Pack Metadata

- Project:
- State path:
- Director board path:
- Generated at:
- Target platform/model:
- Aspect ratio:
- Default duration:

## Global Rules

- Generated video is a visual plate only.
- No proof, no UI evidence, no readable claim text, no subtitles, no logos, no faces.
- Remotion owns proof overlays, captions, timing, audio, and final export.
- Return files as project-local `.mp4`, `.mov`, `.webm`, or image sequence paths.

## Requests

### Request: `<request_id>`

- Scene ids:
- Scene job:
- Option type: recommended | bold | safe
- Provider target:
- Provider model hint:
- Technical route: text_to_video | image_to_video | video_to_video | reference_guided_video
- Duration:
- Aspect ratio:
- Reference assets:
- Expected candidate id:

#### Director Intent

- Knowledge beat:
- Why generated video is needed:
- What the generated plate must help the viewer feel or understand:
- What Remotion will add above it:

#### Prompt

```text

```

#### Negative Prompt

```text
readable claim text, proof, evidence, UI, logos, faces, numbers, subtitles
```

#### Proof Exclusion Policy

No proof, no evidence, no readable claims, and no subtitles; Remotion owns proof overlays and captions.

#### Remotion Integration Plan

Use only as a muted video_plate under Remotion-controlled proof overlays, subtitles, and final timing.

#### User Handoff

Generate this on the chosen platform, download the file, place it under the project path, then return the file path so Codex can register `render.ai_video_candidates[]`.

