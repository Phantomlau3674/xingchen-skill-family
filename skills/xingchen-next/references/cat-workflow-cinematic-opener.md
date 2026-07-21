# Cat Workflow Cinematic Opener

This reference is a reusable opener module for Xingchen Next projects that use the user's cat director avatar as a personal visual signature.

It is not a generic mascot intro. It must connect the cat image to the actual Xingchen workflow: source intake, proof reading, script lock, director board, lookdev, and render.

## Source Identity

Reference image:

`C:\Users\liuzh\Documents\xwechat_files\phantom37_e901\temp\RWTemp\2026-05\9e20f478899dc29eb19741386f9343c8\f5741a099079a4770bf8bb37a486fcdc.jpg`

Identity cues to preserve:

- round tabby cat face, warm eyes, small smile, pink nose
- navy vest, white shirt, bow tie
- coffee mug with paw mark
- creator desk: laptop, notebook, camera, candle, small plant
- Shanghai evening skyline outside the window
- warm interior light plus purple-orange city dusk

Do not replace the avatar with a random realistic cat. Do not over-humanize it into a generic corporate character. The charm is "serious creator in a cozy control room."

## Core Concept

Name: **Cat Director Control Room**

Visual thesis:

> The cat is not decoration. It is the operator of the Xingchen creator OS. The desk becomes a miniature command room where raw materials turn into proof planes, scene cards, camera paths, and final render.

Use this opener when the video benefits from a personal creator signature or recurring channel identity.

Reject this opener when:

- the opening must start with hard proof immediately
- the topic is too solemn for a warm avatar
- the cat would weaken trust in a serious evidence-first piece
- the episode has no creator/workflow framing

## 8-Second Opening Board

### 0.00-0.35 - Eye Reflection Hook

Frame:

- extreme close-up on the cat's eye
- inside the eye reflection: tiny source cards, waveform, screenshots, and `project-state.json` nodes spark on
- no title card
- no explanatory text

Camera:

- macro push, 120ms snap-in
- shallow depth of field
- reflection glints from warm candle to cool screen light

Hook job:

- thumb-stop through face plus strange reflected workflow
- viewer question: "what is this cat operating?"

Subtitle safe region:

- keep bottom clear, but avoid subtitles in the first 0.35s unless the spoken hook already begins

### 0.35-1.40 - Desk Becomes Interface

Frame:

- pull back to reveal the laptop, mug, notebook, and camera
- the laptop screen projects a thin 3D constellation of the workflow
- node labels are short and readable only when needed: `Topic Lock`, `Script`, `Visual`, `Lookdev`, `Render`

Camera:

- move from eye reflection to laptop screen through a match cut
- parallax layers: city/window far, cat mid, desk foreground

Motion:

- paw lightly taps the mug
- the tap sends a circular pulse into the laptop and notebook

### 1.40-2.80 - Source Intake Portal

Frame:

- screenshots, audio waveform, notes, and proof cards enter from the window/city side as glowing paper-thin planes
- they do not contain fake proof text
- any real source screenshot must stay literal and legible if used

Camera:

- orbit 15 degrees around the laptop, not around the cat
- camera path explains transformation: outside world -> desk -> workflow graph

Tech route:

- Remotion 2.5D proof-plane stack by default
- HTML 3D only if the camera needs real depth through the cards

### 2.80-4.30 - Director Board Assembly

Frame:

- source cards snap into a floating board above the notebook
- scene cards arrange left to right: `Hook`, `Proof`, `Build`, `Peak`, `Close`
- cat's bow tie catches a navy highlight that becomes the accent color for the piece

Camera:

- slight top-down tilt so the board reads as a planning surface
- hold for 8-12 frames after the snap so the viewer can parse the structure

Workflow meaning:

- this is where Xingchen decides picture logic before renderer choices
- show "director board" as action, not as explanatory UI text

### 4.30-5.80 - Lookdev Gate Spark

Frame:

- camera lens on the desk rotates into view
- inside the lens: a fast turntable silhouette of one concept object or proof plane
- green/amber/red inspection ticks briefly appear as abstract marks, not a checklist

3D policy:

- generated 3D is optional and candidate-only
- use Hunyuan3D/ComfyUI for a symbolic object, not for proof or the cat identity
- if the asset is weak, replace with procedural geometry or 2.5D depth plates

### 5.80-7.20 - Timeline Ignition

Frame:

- cards compress into a horizontal timeline or vertical Douyin stack
- waveform aligns with the first real narration beat
- the cat looks up, confident, as if the edit is now locked

Camera:

- snap zoom from board into timeline
- motion must land exactly before the first spoken keyword of the episode

Typography:

- no generic "welcome" text
- title may be episode-specific or a small `Xingchen Next` signature

### 7.20-8.00 - Hard Cut Into Episode Proof

Frame:

- the opener exits into the first real evidence frame
- use a light sweep or laptop-screen wipe only if it preserves proof readability

Rule:

- do not end on a logo fade
- the opener earns the next scene by handing off to actual content

## Route Recommendation

Default implementation:

- `remotion` final controller
- 2.5D layered treatment of the provided cat image
- masks/layers: skyline, window frame, cat body/head/eyes, laptop, mug, notebook, camera, candle glow
- workflow cards as Remotion SVG/HTML planes
- optional Three/R3F only for source-card depth and camera-as-argument

ComfyUI/Hunyuan3D lane:

- do not generate the cat as a mesh by default; identity drift risk is too high
- Hunyuan3D may audition the mug, camera, desk token, or "workflow core" as a GLB concept object
- any generated mesh must pass the ComfyUI 3D asset readiness ladder before use

HTML 3D lane:

- only use HTML 3D if the camera move explains the workflow transformation
- acceptable: source cards move through depth into a director board
- reject: generic rotating room, tunnel, particles, grid, or glowing background

## Director Board Writeback Shape

Use this shape when applying the opener to a real `project-state.json`:

```json
{
  "scene_id": "opener_cat_control_room",
  "scene_job": "hook",
  "intent": "Use the cat director avatar to turn Xingchen workflow into an immediate visual promise, then hand off to the episode proof.",
  "source_layer": {
    "evidence_role": "none",
    "source_refs": ["personal_cat_director_ref"],
    "must_preserve": ["cat identity cues", "desk creator environment", "no fake proof text"]
  },
  "frame_layer": {
    "dominant_anchor": "cat eye reflection and laptop workflow projection",
    "camera_path": "macro eye reflection -> laptop projection -> director board -> timeline -> proof cut",
    "subtitle_safe_region": "bottom 20 percent clear after 0.35s; no subtitle in frame 0 unless narration starts immediately",
    "must_not_cover": ["cat eyes", "laptop projection", "first proof handoff region"]
  },
  "component_layer": {
    "component": "CatWorkflowOpener",
    "component_props_brief": "layered cat reference image, workflow card set, episode title, first proof transition target",
    "fallback_component": "static hero frame plus 2D card sweep"
  },
  "tech_stack_layer": {
    "primary_stack": "remotion",
    "supporting_stacks": ["remotion_three_optional", "comfyui_3d_asset_lane_optional"],
    "rejected_stacks": ["full_ai_video_controller", "generic_spark_background", "cat_mesh_default"],
    "why_this_stack": "The opener needs frame-accurate timing, subtitle safety, and proof handoff. The cat image should remain identity-true."
  },
  "lookdev_acceptance": {
    "checks": [
      "cat identity still recognizable in frame 0 and final hold",
      "workflow graph readable as structure, not UI clutter",
      "no fake proof appears in generated cards",
      "first evidence scene remains more important than the opener",
      "9:16 crop keeps cat eyes and laptop projection inside safe area",
      "16:9 crop keeps city, cat, and desk workflow in balanced thirds"
    ]
  }
}
```

## Platform Variants

### 9:16 Douyin

- first frame: cat eye or cat face upper 40 percent
- workflow projection center-left
- avoid right-side UI buttons
- bottom 250px clean for platform overlays and subtitles
- cut to proof by 8s at the latest; 6s preferred for fast topics

### 16:9 Bilibili / YouTube

- cat on right third, city and laptop on left/middle
- workflow board can breathe wider
- subtitle band bottom center
- opener can run 8-10s if the topic is creator/workflow-oriented

## Prompt Pack For Still Lookdev

Use only for concept stills or background extension, not as final truth:

```text
cozy Shanghai night creator studio, round tabby cat director in navy vest and bow tie, warm candle light, laptop projecting a cinematic workflow constellation, source cards and proof planes floating above a wooden desk, notebook and camera in foreground, purple orange city skyline through tall window, premium anime illustration, sharp composition, depth of field, cinematic lighting, no readable fake text, no extra characters
```

Negative prompt:

```text
generic cat, realistic horror cat, distorted face, extra paws, fake UI text, unreadable charts, logo, watermark, corporate mascot, empty neon tunnel, cluttered interface, proof text hallucination
```
