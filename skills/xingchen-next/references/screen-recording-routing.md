# Screen Recording Routing

## Purpose

Use this when the user brings screen recordings, app walkthroughs, webpage captures, dashboard demos, or UI operation clips.

For this creator workflow, screen recordings usually have only two valid jobs:

- `evidence_clip`: the recording proves a claim and must stay inspectable.
- `source_media_plate`: the recording is the main visual plate for an operation or product-flow scene.

Do not route screen recordings to VibeMotion or Spark. VibeMotion can add separate motion accents around the recording, and Spark can appear in another scene when spatially justified, but the recording itself remains existing source media.

## State Writeback

Write clip treatment into `project-state.json.visual.screen_recording_brief.clips[]`:

```json
{
  "clip_id": "clip-dashboard-change",
  "media_path": "recordings/dashboard.mov",
  "time_range": { "start": 4, "end": 12 },
  "route_type": "evidence_clip",
  "visual_job": "prove the dashboard value change",
  "proof_role": "hero",
  "privacy_review": "passed",
  "legibility_check": "needs_zoom",
  "crop_strategy": "punch into the metric region, preserve cursor context",
  "remotion_treatment": "crop, magnify, add callout, subtitle-safe lower third",
  "execution_runtime": "remotion",
  "motion_source": "existing_media",
  "integration_mode": "video_plate",
  "promotion_target_renderer_family": "remotion_component",
  "reason": "The original recording is evidence and should stay inspectable."
}
```

Scene specs that use these clips should reference them:

```json
{
  "scene_id": "scene-evidence-recording",
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "existing_media",
  "integration_mode": "video_plate",
  "promotion_target_renderer_family": "remotion_component",
  "screen_recording_clip_ids": ["clip-dashboard-change"]
}
```

## Evidence Clip

Use `route_type: "evidence_clip"` when the viewer must believe or inspect something from the recording.

Treatment:

- preserve original UI meaning
- crop and zoom for phone legibility
- add highlight boxes, arrows, cursor holds, or freeze frames
- redact private data before lookdev
- keep subtitles and proof callouts outside critical UI regions

Recommended route fields:

- `execution_runtime: "remotion"`
- `motion_source: "existing_media"`
- `integration_mode: "video_plate"`
- `promotion_target_renderer_family: "remotion_component"`

## Source Media Plate

Use `route_type: "source_media_plate"` when the recording is the scene's main subject: operation flow, product demo, web walkthrough, or before/after comparison.

Treatment:

- keep the clip as the main plate
- use Remotion for timing, captions, zooms, callouts, and chapter beats
- trim dead cursor time
- optionally speed-ramp boring transitions
- rebuild the UI in Remotion only if legibility is poor or the recording is visually noisy

Recommended route fields:

- `execution_runtime: "source_media"` or `remotion`
- `motion_source: "existing_media"`
- `integration_mode: "video_plate"`
- `promotion_target_renderer_family: "remotion_component"`

## Validator Guardrail

The validator blocks screen recording clips when:

- `motion_source` is not `existing_media`
- `execution_runtime` is Spark, HTML capture, or another non-source route
- `integration_mode` is not `video_plate`
- `promotion_target_renderer_family` is not `remotion_component`
- privacy or legibility is `blocked`
- a scene references an unknown `screen_recording_clip_ids[]` value

This keeps screen recordings in the proof/media lane while leaving room for Remotion to make them feel polished.
