# Vox Remotion Visual Style

Use this as a visual style atlas for narration-led explainers that need the editorial, collage-like, code-motion feel observed in MoSidd's "I Made Vox-Style Motion Graphics Using Only Claude Code & Remotion" (`https://www.youtube.com/watch?v=7wuYBfE131U`).

This reference is about picture language and execution checks, not a mandatory production pipeline. Do not copy the creator's scenes, title card, voice, example topic, or identity. Translate the grammar into Xingchen's current subject, proof, creator signature, aspect ratio, and Douyin readability constraints.

## Observed Source Pattern

The captured video has two useful layers for Xingchen:

- the opening sample shows the final style in motion: paper-grid continuity, cutout figures, red offset strokes, proof objects, charts, maps, kinetic numbers, and concise captions
- the tutorial body reveals the production method: script first, scenes as Remotion components, Studio props for manual layout tuning, and screenshots/stills used to judge whether the frame works

The lesson is not "make every project look like Vox." The lesson is: treat the narration as a timeline, make one proof carrier dominate each beat, keep a shared editorial world across scenes, and let Remotion own all audit-critical information.

## Visual DNA

The look is editorial motion collage:

- a stable full-frame background that makes multiple scenes feel like one continuous explainer world
- paper, print, map, or magazine texture rather than glossy app UI polish
- black-and-white halftone or duotone cutout people and objects
- a restrained palette: off-white paper, charcoal, black, one strong red or orange accent, with proof-color exceptions only when the data needs them
- foreground structures that are easy to read: buildings, maps, tankers, charts, number blocks, arrows, labels, proof crops
- mid-ground cutouts that create tension and human context but do not own the factual claim
- red offset marker strokes or shadow plates behind cutouts to create separation, emphasis, and a light 2.5D feel
- chart and number reveals that arrive exactly when the narration names the claim
- occasional alpha or green-screen motion plates as texture, still controlled by the code composition

The frame should still communicate the argument if the viewer only sees the final held frame.

## Scene Contract

When this style is selected, each non-rest scene should express the contract below through existing Xingchen fields. Do not add a parallel schema unless a project needs a future migration.

```json
{
  "scene_contract": {
    "world_base": "shared paper/grid/map/editorial texture token",
    "mid_cutouts": ["halftone person/object/context cutouts"],
    "foreground_proof": "one dominant proof carrier for this beat",
    "remotion_overlay": "captions, Chinese text, callouts, chart labels, proof highlights",
    "voiceover_beat": "keyword/time cue that triggers the foreground reveal",
    "safe_zones": "subtitle and proof regions that must remain readable in 9:16",
    "prop_controls": "x/y/scale/crop/opacity/markerOffset/halftoneAmount/gridDensity",
    "lookdev_evidence": "still or slice paths proving layer, proof, text, and motion timing"
  }
}
```

Map the contract to existing fields:

- `world_base` -> `visual.visual_policy.editorial_world_system` plus `scene_boards[].frame_layer.depth_plan`
- `mid_cutouts` -> `scene_boards[].detail_layer.material_surface` and `component_layer.supporting_components[]`
- `foreground_proof` -> `frame_layer.dominant_anchor`, `frame_layer.proof_regions[]`, and `render.scene_motion_specs[].proof_strategy`
- `remotion_overlay` -> `frame_layer.on_screen_text[]`, `subtitle_layer`, and Remotion/SVG/HTML/Canvas implementation
- `voiceover_beat` -> `arrangement_layer.voice_timing`, `beat_before_keyword`, and `render.scene_motion_specs[].timing_basis`
- `safe_zones` -> `frame_layer.subtitle_safe_region`, `subtitle_layer.must_not_cover[]`, `proof_regions[]`
- `prop_controls` -> `component_layer.component_props_brief`, scene props, Studio controls, or kit-extension notes
- `lookdev_evidence` -> `lookdev_acceptance`, `review.lookdev_gate_results[].rule_results[].evidence`

## Editorial World System

Use a small set of persistent world tokens:

- `background_id`: one shared background family, such as `paper_grid_world_v1`, `map_paper_world_v1`, or `desk_evidence_world_v1`
- `grid_size`: visible but low-contrast; it should align frames, not decorate them
- `grain_noise`: subtle paper/print grain; avoid dark texture that hurts mobile text
- `palette_lock`: paper/black/charcoal plus one red or orange accent; data colors are exceptions, not new palette families
- `camera_base`: mostly locked camera with small parallax; major camera moves must reveal proof or scale, not add ambience
- `safe_area_mask`: reserved subtitle and proof zones for 9:16 and horizontal variants

Every scene may change the foreground proof object, but the world should feel continuous unless the StoryMother explicitly calls for a world break.

## Layer Recipe

Default frame stack:

1. `background`: shared paper/map/wall/desk/world plate with low contrast and room for captions.
2. `mid_ground`: halftone portraits, symbolic cutouts, texture swashes, accent strokes, low-speed parallax.
3. `foreground`: proof object, chart, map, number, title phrase, or diagram element that carries the current beat.
4. `caption/proof overlay`: clean type, callouts, chart labels, subtitles, and evidence highlights; never baked into generated images.

Foreground proof and Chinese text stay Remotion/SVG/HTML/Canvas owned. Image generation may supply atmosphere, texture, physical plates, or cutouts, but not audited claims, charts, UI proof, or subtitles.

## Proof Carrier Rule

Each beat needs exactly one dominant proof carrier:

- a physical object, if the scene needs material credibility
- a chart or map, if the scene is numeric or geographic
- a cropped source proof, if the claim needs inspection
- a kinetic number block, if the spoken number is the claim
- a programmatic diagram, if the idea is relational or abstract

Do not split one beat across many equal cards. Secondary cutouts are context and tension, not competing proof.

## Beat Sync

The strongest foreground object should be ready slightly before or exactly on the spoken keyword:

- setup elements may enter earlier
- proof carrier reveal should happen within the keyword window, usually about 6-8 frames either side when exact timing exists
- red marker, highlight, number snap, or chart label should land with the named claim
- hold the completed frame for roughly 12-24 frames after a strong reveal, longer when the proof needs reading time

If speech rhythm is available, scene timing follows `script.speech_rhythm_plan` or `sources.speech_rhythm`. Do not approximate from vibes.

## Motion Feel

Use motion as editorial emphasis:

- `PopSpring`: hero objects spring up from below or scale from `0.92` to `1.0`, then settle.
- `StaggerCutouts`: portraits or props appear one after another; avoid all-at-once reveals.
- `MarkerStrokeOffset`: red accent shadow sits slightly behind a black-white cutout and moves with it.
- `ChartSnap`: chart line, axis highlight, or value block appears at the exact word where the number is spoken.
- `ProofPushIn`: camera pushes toward a document, map, or chart region so the viewer knows where to look.
- `ParallaxPaper`: background moves very little, mid-ground moves more, foreground moves most.
- `BeatHold`: after a strong reveal, hold the composed frame briefly so the claim lands.

Avoid generic float, glow, particles, and slow decorative drift. Motion must explain emphasis, sequence, scale, proof, or tension.

## Remotion Prop Controls

This style depends on manual layout tuning. Components that implement it should expose props that can be adjusted in Remotion Studio or an equivalent scene config:

- `assetX`, `assetY`, `assetScale`, `assetRotation`
- `cropX`, `cropY`, `cropWidth`, `cropHeight` for source/proof plates
- `opacity`, `blur`, `grainAmount`, `halftoneAmount`
- `markerOffsetX`, `markerOffsetY`, `markerThickness`, `accentColor`
- `gridDensity`, `paperNoise`, `backgroundParallax`
- `captionSafeRegion`, `proofSafeRegion`, `mobileScale`

Hard-coded all-in-one bitmap scenes are invalid for this style. The source video's method treats the first generated scene as a draft and uses prop tuning to make the frame work.

## 9:16 Douyin Adaptation

Do not auto-crop a 16:9 composition into portrait. Recompose the scene:

- foreground proof fills the upper or central reading area; subtitles own a clean bottom or side-safe zone
- large source/proof crops should stack vertically or scan through a crop window
- side cutouts can be bolder and more cropped; full-body figures usually waste portrait space
- numbers should be physical and large, not small labels beside a chart
- red marker strokes should be shorter and thicker on mobile
- main subtitles: about `64-72 px`
- scene thesis or key claim labels: about `52-60 px`
- important nodes or short labels: about `42-48 px`
- tiny secondary labels are allowed only if they are not essential meaning

If a proof crop cannot be read after phone downsampling, the scene must become `manual_review_required` or be redesigned.

## Prompt Fragments

Use concrete visual language:

```text
Editorial paper-collage explainer frame, shared off-white map-paper background,
black-and-white halftone cutout portraits in the mid-ground, red offset marker
stroke behind each cutout, large foreground proof object, kinetic number block,
clean Chinese captions drawn in Remotion, subtle parallax, no glossy tech UI.
```

```text
Make the spoken number become the hero object: a large red-and-black value block
snaps onto the foreground chart while the background stays stable and the
mid-ground cutouts settle behind it.
```

Avoid vague prompts:

```text
Make it premium Vox style, cinematic, high-end, dynamic.
```

## Xingchen Adaptation

When this style is selected, record it as an art-direction influence, not as a new route:

```json
{
  "visual_style_influence": {
    "source": "vox_remotion_visual_style",
    "selected_traits": [
      "editorial paper collage",
      "halftone cutouts",
      "red offset marker stroke",
      "shared background continuity",
      "foreground proof and kinetic numbers",
      "Remotion-owned captions and proof overlays"
    ],
    "xingchen_adaptation": "keeps creator identity and mobile readability; proof/text remain code-owned",
    "avoid_copying": ["exact source compositions", "creator identity", "political example", "title card"]
  },
  "editorial_world_system": {
    "background_id": "paper_grid_world_v1",
    "palette_lock": ["paper", "charcoal", "black", "red accent"],
    "halftone_cutout_policy": "supporting context only",
    "red_offset_marker_policy": "emphasis, tension, path, or figure-ground separation only",
    "remotion_proof_ownership": "all text, data, labels, subtitles, and audited proof are code-owned"
  }
}
```

This combines with existing Xingchen rules:

- keep the user's recurring creator or family-brand identity when relevant
- preserve Douyin mobile readability
- state semantic relationships directly in labels and motion
- use source proof where the claim needs evidence
- keep captions and audited information out of generated images

## Lookdev Checks

A preview fails this style when any blocking item below is true:

- `scene_contract_check`: selected scenes lack a world base, mid cutout role, foreground proof carrier, Remotion overlay plan, or safe zones
- `world_continuity_check`: every scene uses a different generated background without a StoryMother reason
- `layer_stack_check`: the frame collapses into one flat card layer or one baked bitmap
- `remotion_proof_ownership_check`: Chinese text, proof labels, data, charts, or subtitles are baked into imagegen/video plates
- `bitmap_text_ocr_check`: generated plates contain readable Chinese text that is not a source screenshot exception
- `mobile_downsample_check`: the proof carrier, chart number, or subtitle fails phone-size readability
- `safe_zone_overlap_check`: subtitles, proof crops, marker strokes, or cutouts cover each other
- `foreground_dominance_check`: no single object carries the beat
- `red_marker_semantics_check`: red strokes are random decoration rather than emphasis, path, warning, tension, or separation
- `beat_sync_check`: chart, number, proof crop, or marker reveal lands late relative to the spoken keyword
- `motion_density_check`: too many objects move at once, or nothing important moves
- `final_hold_frame_check`: the completed claim frame is not held long enough to read
- `prop_control_smoke_test`: scene cannot adjust x/y/scale/crop/opacity/marker offset without rewriting the component
- `proof_source_trace_check`: proof carrier has no source/evidence/state trace when the claim requires proof

Some checks are static; some require preview stills or motion slices. Unsupported aesthetic checks must become `manual_review_required`, not fake passes.

## Owner Handoff

- `xingchen-next`: router only. It records the optional influence and enforces that this is not a new renderer family.
- `xingchen-director-board`: writes the scene contract through existing scene-board layers.
- `xingchen-art-direction`: records `visual.visual_policy.visual_style_influence` and `editorial_world_system` when selected.
- `xingchen-visual-compiler`: compiles the scene contract into scene specs, layer stack, prop controls, Remotion-owned proof overlays, and timing basis.
- `xingchen-lookdev`: runs the style-specific checks above against real stills or motion artifacts.

## Failure Modes

- normal slide deck with red accents
- many equal cards instead of one foreground proof carrier
- all scenes generated as unrelated backgrounds
- halftone cutouts are decorative while the proof is tiny
- Chinese text appears inside imagegen assets
- red strokes do not clarify figure/ground or argument tension
- charts and numbers are too small for mobile
- all objects move at once
- prop positions cannot be tuned without code surgery
- scene copies the source video's exact subject, composition, or brand identity
