# Source Material Director Pass

This is the legacy source-material analysis contract. New projects should run `xingchen-director-board`, which writes the same source/rhythm thinking into `project-state.json.visual.director_board` plus `visual-director-board.md/json`.

Keep this reference for compatibility with older projects that still populate `visual.material_director_pass`.

Its purpose is simple: before choosing a renderer, the operator must understand what the material is saying, how the recording moves, what each scene should show, how the source should be used, and which technical stack is justified.

## Why This Exists

Recent failure mode:

- the pipeline accepted source material and a voice recording
- the visual stage jumped too quickly to style, components, or renderer choices
- scenes became decorative, slide-like, or generic because nobody first asked what each source page or audio beat was trying to express

This pass makes the director work explicit. Renderers compile the answer; they do not discover it under pressure.

## Required Order

Run this only when maintaining an older project or when downstream tooling still reads `visual.material_director_pass`. For new projects, run `xingchen-director-board` after StoryMother Lock and before `xingchen-art-direction`.

### 1. Page / Asset Reading

Read the user's material unit by unit.

For each page, screenshot, clip, note, or source segment, record:

- `unit_id`
- source reference: asset id, page number, slide number, screenshot path, clip time range, transcript segment, or link
- what this unit is actually expressing
- what claim, feeling, or contradiction it can support
- which part must stay literal, inspectable, or legible
- what can be abstracted, rebuilt, or ignored
- the strongest possible visual role: hero proof, supporting proof, context, texture, reference only, or unused

Do not summarize the whole source pack in one paragraph. If the user gave pages, think page by page. If the user gave a recording, think beat by beat.

### 2. Recording Rhythm Reading

For human voice, transcript, or spoken draft, read the rhythm before designing pictures.

Record:

- where the voice accelerates, slows, pauses, or stresses a keyword
- which pauses need visual breathing room
- which words need the frame ready before the word lands
- which sentences should stay visually calm so the viewer can understand
- where a visual surprise, proof reveal, zoom, cut, or spatial move is earned

The visual anchor should land slightly before or exactly on the spoken keyword. A scene that reacts late to the voice is not synced, even if the animation is beautiful.

### 3. Scene Binding

Bind material and rhythm to scenes.

For every StoryMother scene, record:

- which source units it uses
- which narration beat or recording time range it follows
- what the frame must make the viewer understand
- the picture design in plain language
- whether the source is kept literal, magnified, rebuilt from data, used as texture, or rejected
- what the subtitle must avoid
- the cut or transition logic into and out of the scene

This is where the operator decides the picture. A later Remotion, Hyperframes, VibeMotion, or Spark route may implement it, but may not replace the scene's purpose.

### 4. Technology Stack Routing

Choose the stack after the material and rhythm are understood.

Use this routing judgment:

- `remotion`: final assembly, exact timing, subtitles, proof overlays, charts, typography, source media plates, and most knowledge-video scenes
- `source_media`: when the user's recording or screen recording is the scene's main plate and must remain inspectable
- `hyperframes`: HTML/CSS/SVG/canvas motion candidates when the scene needs a custom explainer or DOM-native visual system
- `vibemotion`: review candidates or transparent motion assets for a named beat, never final control
- `spark`: real spatial world, 3DGS, procedural splat world, or justified spatial traversal, never generic atmosphere or literal proof
- `gen_insert`: scoped hero realism or shot gaps only, never default video construction

For each scene, record the primary stack, supporting stacks, rejected stacks, and why. A stack choice without a material/rhythm reason is not a director plan.

## Required State Writeback

Legacy writeback is `project-state.json.visual.material_director_pass`.

New writeback is `project-state.json.visual.director_board`; the director board expands this pass into source, arrangement, aesthetic, frame, detail, component, subtitle, tech-stack, and lookdev-acceptance layers per scene.

Minimum shape:

- `status`
- `director_summary`
- `source_unit_readings[]`
- `recording_rhythm_reading.segments[]` when recording or transcript exists
- `scene_binding_plan[]`
- `tech_stack_plan[]`
- `unresolved_questions[]`

Each `source_unit_readings[]` item should include:

- `unit_id`
- `source_ref`
- `source_kind`
- `expressed_meaning`
- `claim_or_feeling`
- `must_preserve`
- `visual_potential`
- `use_decision`

Each `scene_binding_plan[]` item should include:

- `scene_id`
- `source_unit_ids`
- `narration_refs`
- `material_role`
- `picture_design`
- `timing_design`
- `source_treatment`
- `subtitle_avoidance`
- `transition_logic`

Each `tech_stack_plan[]` item should include:

- `scene_id`
- `primary_stack`
- `supporting_stacks`
- `rejected_stacks`
- `why_this_stack`

## Visual Lock Rule

For legacy projects, this pass is valid compatibility evidence only when:

- the source units have been read, not merely listed
- every StoryMother scene has a material/rhythm binding
- every StoryMother scene has a technology route reason
- recording-first projects include rhythm reading
- unresolved questions are either answered or explicitly routed to manual review

For new projects, Visual Lock is enforced through `visual.director_board`. If the director board is missing, the project is not ready for visual direction. It may have assets and a renderer, but it does not yet have a film.
