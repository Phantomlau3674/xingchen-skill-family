---
name: xingchen-director-board
description: Use after story-mother and before xingchen-art-direction to turn source material, recording rhythm, scene jobs, composition intent, components, subtitles, and technical-stack choices into a detailed visual director board for Xingchen projects.
---

# Xingchen Director Board

## When to Enter

Run during `visual-direction`, immediately after `StoryMother Lock` and before `xingchen-art-direction`.

This skill owns the missing video-director stage. It does not choose the final whole-piece aesthetic system and it does not implement renderer specs. It writes the executable director board that later skills must obey:

`source understanding -> arrangement logic -> aesthetic intent -> main frame -> frame details -> components/tech stack -> subtitles`

Refuse to proceed from generic style words, renderer taste, or reusable templates. Every scene board must explain what the current user material says, how the recording or narration moves, what picture should carry the beat, which component should express it, and why the selected technical stack is justified.

For every scene picture and every scene-to-scene flow decision, run a `superpowers/brainstorming`-style exploration before selecting the final design. The board must preserve the brainstorm result: question, options considered, selected direction, why selected, continuity handles, and anti-PPT decision. This is not a casual ideation note; it is Visual Lock evidence.

## Inputs

Read these state and artifact layers first:

- `sources.source_pack`, `sources.asset_manifest`, `sources.transcript.segments`
- `proof.claims[]`, `proof.evidence_items[]`
- `script.spoken_script.blocks[]`, `script.beat_map.scenes[]`
- `mother.story_mother.scene_order[]`, `scene_cards[]`, `proof_binding[]`, `narration_spine[]`
- existing `visual.source_material_plan`, `visual.recording_visual_brief`, `visual.scene_decisions`, and legacy `visual.material_director_pass` when present
- available component/shot vocabulary from [shot-library.md](C:\Users\liuzh\.codex\skills\xingchen-visual-compiler\references\shot-library.md)
- technical-stack rules from [tech-stack-director-matrix.md](C:\Users\liuzh\.codex\skills\xingchen-director-board\references\tech-stack-director-matrix.md)

Recording-first projects must read `sources.recording_correction` before visual design. If the user has provided narration audio, do not design pictures from raw audio alone: require corrected transcript truth, cleanup report, and rhythm evidence first.

## Output Contract

Write both files into the project workspace:

- `visual-director-board.md` for human review
- `visual-director-board.json` for `xingchen-art-direction`, `xingchen-visual-compiler`, and `xingchen-lookdev`

Then write the same machine contract into:

`project-state.json.visual.director_board`

The state object must be:

```json
{
  "status": "completed",
  "board_md_path": "visual-director-board.md",
  "board_json_path": "visual-director-board.json",
  "global_director_thesis": "",
  "aesthetic_system": {},
  "brainstorming_contract": {},
  "scene_boards": [],
  "scene_edge_boards": [],
  "component_registry_plan": [],
  "subtitle_system": {},
  "tech_stack_policy": {},
  "lookdev_acceptance": [],
  "unresolved_questions": []
}
```

`status` may be `completed`, `manual_review_required`, or `blocked`. Use `blocked` when a missing source asset, missing transcript timing, unresolved proof claim, or impossible renderer route prevents a defensible board. Use `manual_review_required` only when the board is complete but a human taste or source interpretation call cannot be automated.

## Required Scene Board

Create one `scene_boards[]` entry for every `mother.story_mother.scene_order[]` scene. Field names are fixed.

```json
{
  "scene_id": "",
  "scene_job": "hook",
  "source_layer": {
    "source_unit_ids": [],
    "what_material_says": "",
    "must_preserve": "",
    "can_transform": "",
    "evidence_role": "hero"
  },
  "arrangement_layer": {
    "narration_refs": [],
    "voice_timing": "",
    "beat_before_keyword": "",
    "scene_duration_sec": 0,
    "transition_in": "",
    "transition_out": ""
  },
  "brainstorming_layer": {
    "skill_ref": "superpowers/brainstorming",
    "scene_question": "",
    "knowledge_action": "define|compare|decompose|prove|invert|compress|expand|summarize|bridge|hook",
    "options_considered": [],
    "selected_direction": "",
    "why_selected": "",
    "continuity_handles": [],
    "anti_ppt_decision": ""
  },
  "aesthetic_layer": {
    "aesthetic_role": "",
    "color_temperature": "",
    "density": "moderate",
    "energy_level": 7,
    "contrast_to_prev_scene": "",
    "cheapness_to_avoid": []
  },
  "frame_layer": {
    "main_frame_design": "",
    "dominant_anchor": "",
    "layout_pattern": "",
    "camera_path": "",
    "depth_plan": "",
    "proof_regions": [],
    "subtitle_safe_region": ""
  },
  "detail_layer": {
    "lighting": "",
    "material_surface": "",
    "typography_role": "",
    "motion_verbs": [],
    "micro_interactions": [],
    "failure_risks": []
  },
  "component_layer": {
    "primary_component": "",
    "supporting_components": [],
    "component_props_brief": "",
    "fallback_component": "",
    "kit_extension_needed": false
  },
  "subtitle_layer": {
    "subtitle_mode": "bottom_bar",
    "subtitle_position": "",
    "keyword_highlights": [],
    "must_not_cover": [],
    "relationship_to_voice": ""
  },
  "tech_stack_layer": {
    "primary_stack": "remotion",
    "integration_mode": "",
    "why_this_stack": "",
    "rejected_stacks": [],
    "preview_required": ""
  },
  "lookdev_acceptance": {
    "still_frame_check": "",
    "motion_check": "",
    "proof_readability_check": "",
    "aesthetic_check": ""
  }
}
```

## Required Scene Edge Board

Create one `scene_edge_boards[]` entry for every adjacent pair in `mother.story_mother.scene_order[]`. These edges are where knowledge-video continuity is designed. They are not generic transition effects.

```json
{
  "edge_id": "",
  "from_scene_id": "",
  "to_scene_id": "",
  "skill_ref": "superpowers/brainstorming",
  "bridge_question": "",
  "options_considered": [],
  "selected_bridge": "",
  "narrative_bridge": "",
  "continuity_handle_kind": "keyword|number|shape|line|frame|arrow|color|motion|layout|proof_region|question_answer|scale_shift",
  "out_handle": "",
  "in_handle": "",
  "transition_method": "keyword_relay|proof_region_relay|diagram_morph|scale_shift|axis_handoff|question_answer_cut|color_logic_cut|subtitle_to_visual|hard_cut|breath_cut",
  "cut_moment": "",
  "duration_frames": 8,
  "anti_ppt_risk": "",
  "lookdev_acceptance": ""
}
```

Knowledge videos may have few physical objects. Continuity handles can be designed graphics, not only extracted objects: keyword, number, underline, proof region, frame, arrow, color logic, layout state, or voice emphasis. The goal is not decorative transition; it is making the viewer feel the argument is moving.

## Procedure

### 1. Source Unit Reading

Break user material into named source units. For each source page, screenshot, clip, note, link, audio segment, or transcript beat, state:

- what it literally contains
- what claim, feeling, or contradiction it expresses
- what pixels, wording, order, or context must remain faithful
- what can be transformed into design language
- whether it is hero evidence, supporting proof, background texture, or reference-only

If the input is a recording or transcript, map the pauses, emphasis beats, sentence turns, and speed changes before designing pictures.

### 2. Scene Arrangement

Walk `mother.story_mother.scene_order[]` in order. For each scene, decide its scene job, duration, incoming/outgoing transition, narration refs, and the beat that should visually arrive before the keyword. The viewer should feel that the picture is anticipating the voice, not lagging behind it.

### 2.5 Brainstorm Scene Picture

For every scene, run a compact brainstorming pass:

- Ask what knowledge action the scene performs: define, compare, decompose, prove, invert, compress, expand, summarize, bridge, or hook.
- Consider at least two materially different visual directions.
- Select one direction and state why it serves the voice and proof better than the alternatives.
- Define continuity handles that can be passed into or out of adjacent scenes.
- State how the design avoids becoming a static PPT page.

Write the result into `scene_boards[].brainstorming_layer`.

### 3. Aesthetic Intent

Write a concrete scene-level aesthetic role, not a whole-video style slogan. State whether the scene clarifies, shocks, slows, validates, compresses, opens space, or pays off. Name color temperature, density, energy level, and what cheap pattern this scene could accidentally fall into.

### 4. Frame Construction

Describe the main frame like a director talking to a designer:

- the dominant anchor and its frame position
- layout pattern and read path
- camera path when motion or 3D is used
- depth plan even for flat scenes
- proof regions that must stay inspectable
- subtitle safe region

For HTML 3D, the `camera_path` and `depth_plan` must explain what the camera reveals. For Spark, the frame must state the spatial/world reason.

### 5. Detail Design

Specify lighting, material surface, typography role, motion verbs, micro interactions, and likely failure risks. This layer is where the board prevents the "technically correct but visually cheap" failure.

### 6. Components and Technical Stack

Choose `component_layer.primary_component` and `supporting_components` from the current kit/shot library when possible. If the scene needs a missing component, set `kit_extension_needed: true` and name the fallback component.

Choose `tech_stack_layer.primary_stack` from:

`remotion`, `html_3d`, `hyperframes`, `spark`, `vibemotion`, `source_media`, `gen_insert`

Use [tech-stack-director-matrix.md](C:\Users\liuzh\.codex\skills\xingchen-director-board\references\tech-stack-director-matrix.md) for selection, rejection, and preview conditions. Rejected stacks are not optional decoration; they prove that the chosen route was considered.

When selecting `gen_insert`, write the route as a bounded AI video/image candidate lane such as Seedance/manual platform output. The board must state the visual gap, why generated motion is needed, what proof/text/subtitle ownership is excluded, and how Remotion will composite the result as a `video_plate`. Do not select `gen_insert` for hero proof, readable UI evidence, source inspection, subtitles, or a generic premium background. If Codex has no API, downstream compiler should produce a prompt pack first and wait for the user-generated file before registering a candidate.

Runtime adapters are not called from this stage. The board may route a scene toward Remotion implementation support or HyperFrames candidate generation later, but here it only states why that route serves the source, voice timing, frame, component, and subtitle plan. Downstream adapter use is traced in `render.plugin_adapter_runs[]`; in Claude Code this will be local CLI/local skill/manual rather than Codex plugin.

### 7. Subtitle System

Subtitles are part of composition. For every scene, choose `bottom_bar`, `floating_caption`, `keyword_only`, or `none`. Declare exact position, keyword highlights, `must_not_cover`, and relationship to voice. The subtitle layer must inherit the proof and anchor constraints from the frame layer.

### 8. Scene Flow Brainstorm

After all scene boards exist, run a second brainstorming pass for each adjacent scene pair. Decide how the knowledge continues:

- keyword relay: emphasized word becomes next visual node
- proof region relay: a highlight frame expands into the next scene container
- diagram morph: a simple relation becomes a fuller diagram
- scale shift: local proof zooms out to system map, or vice versa
- axis handoff: number becomes timeline, axis, ruler, or progress structure
- question-answer cut: question frame folds into answer structure
- color logic cut: color carries meaning, not decoration
- subtitle-to-visual: a spoken keyword triggers the next picture

Write these into `visual.director_board.scene_edge_boards[]`.

## Human MD Format

Use [visual-director-board.template.md](C:\Users\liuzh\.codex\skills\xingchen-director-board\templates\visual-director-board.template.md). Every scene must use the eight-layer structure:

1. Source Layer
2. Arrangement Layer
3. Brainstorming Layer
4. Aesthetic Layer
5. Frame Layer
6. Detail Layer
7. Component / Tech Layer
8. Subtitle Layer

The MD must also include Scene Edge Boards for scene-to-scene flow.

The MD should read like a real video director board, not a field dump. It should be specific enough that a designer can sketch the scene, a renderer can implement it, and lookdev can reject it with exact field paths.

## Machine JSON Format

Use [visual-director-board.template.json](C:\Users\liuzh\.codex\skills\xingchen-director-board\templates\visual-director-board.template.json). Keep keys stable. Do not add ad hoc field names unless `unresolved_questions[]` says why the schema needs extension.

## Downstream Boundaries

- `xingchen-art-direction` consumes the board and extracts the whole-piece aesthetic system. It does not rewrite the per-scene director board.
- `xingchen-visual-compiler` may only select components and technical routes from `scene_boards[].component_layer` and `scene_boards[].tech_stack_layer`.
- `xingchen-visual-compiler` must compile `scene_edge_boards[]` into transition primitives or raise a kit extension request.
- `xingchen-lookdev` audits previews against the exact layers and reports failures as paths such as `scene-03.brainstorming_layer.anti_ppt_decision`, `scene-03.frame_layer.camera_path`, `scene-05.subtitle_layer.must_not_cover`, or `edge-scene-03-to-scene-04.selected_bridge`.

## Visual Lock Rule

`Visual Lock` fails unless `visual.director_board.status` is `completed` or `manual_review_required`, every StoryMother scene has a `scene_boards[]` entry, every adjacent scene pair has a `scene_edge_boards[]` entry, and every scene board has all eight layers filled with specific, non-generic decisions.
