# Huashu Design Taste Upgrade

This reference adapts the useful operating habits from the public `alchaincyf/huashu-design` skill into the Xingchen video pipeline. It is not a template import. It is a taste preflight that helps Xingchen stop producing generic cards, dashboard chips, fake product silhouettes, and slide-like scene cuts.

Run it with [visual-resource-and-prompt-preflight.md](./visual-resource-and-prompt-preflight.md): Huashu decides the taste posture, and the resource preflight decides the current design-system, SVG, Remotion, library, and image-generation route.

When the creator-avatar family look is relevant, read [creator-avatar-family-brand.md](./creator-avatar-family-brand.md) as signature memory only. It can shape motifs, warmth, framing, and continuity handles, but it must not become a fixed opener, fixed outro, or repeated scene template.

## Why This Exists

Xingchen already has many renderer and lookdev rules, but the weak failure mode is earlier: the agent can obey the schema while still choosing a dull visual world. This pass forces the agent to act like a visual director before it acts like an implementer.

Use this when:

- the user asks for a better looking video, visual plan, prototype, animation, or design direction
- the user says the output is ugly, flat, generic, too PPT-like, or too AI-looking
- a project is about to enter `Visual Lock`
- a branded product, app, tool, place, or real object appears in the piece

## Extracted Principles

### 1. Medium Persona First

Do not think "web page" just because the implementation is HTML, React, Remotion, or a browser capture. Decide the creative role first:

- knowledge video: motion director plus editor
- product/app demo: product prototype designer
- proof-heavy explainer: information designer
- long narration animation: film editor plus motion designer
- slide deck: presentation designer

Write the chosen persona into the art-direction decision trace. If the work looks like a website, dashboard, or deck when it is supposed to be a film, the pass failed.

### 2. Core Asset Protocol

For any concrete brand, product, app, platform, real person, place, object, UI, screenshot, or source document, visual identity comes from real assets before color adjectives.

Required behavior:

- brand or organization: find/use logo, actual brand colors, typography cues when available
- physical product or object: use real product images, user-provided photos, or generated assets based on real references; do not hand-draw a CSS/SVG silhouette as the hero
- digital product: use real UI screenshots or recordings; do not ask imagegen to invent proof UI
- document/proof scene: keep source pixels legible and treated as evidence, not decoration
- missing asset: write an honest placeholder or source request; do not fake a finished object

Asset quality bar:

- search more than once before giving up
- prefer fewer strong assets over filling the frame with weak stock
- score candidate assets for relevance, recognizability, resolution, crop flexibility, and license/provenance
- any asset under the quality bar must be labeled `placeholder`, `reference_only`, or `needs_user_asset`

### 3. Three Direction Map

When the design direction is not already locked, propose exactly three materially different options before the final lock:

- `safe_professional`: clear, reliable, information-led
- `kinetic_immersive`: motion-led, spatial, more memorable
- `poetic_distinctive`: metaphor-led, quieter or stranger, high differentiation

They must differ in metaphor, chrome family, composition logic, palette pressure, and motion signature. Three palette swaps are not three directions. Do not pick two options from the same visual family unless the user explicitly asked to compare close variants.

For each option, record:

- what it makes the viewer feel
- why it fits this thesis
- what it risks becoming if executed badly
- which anti-reference it defeats
- what the hero frame would look like
- whether the creator signature appears, why it belongs in this direction, and how the direction prevents the signature from becoming a repeated family template

### 4. Placeholder Beats Bad Fakery

An honest placeholder is better than a fake asset that pretends to be final.

Allowed placeholders:

- a labeled blank asset slot with exact missing source named
- a neutral crop box for a pending screenshot
- a scene note that says the renderer cannot proceed without a real file

Disallowed fakery:

- fake dashboards or fake app screens as proof
- CSS product silhouettes standing in for real objects
- generated readable UI text as factual evidence
- decorative stock photos that would not reduce information loss if removed

### 5. Anti-AI-Slop Questions

Before any chrome, gradient, glow, rounded card, status chip, icon, fake stat, particle field, or abstract background enters a scene, ask:

- What job does it do for the scene?
- Does removing it reduce meaning, proof, rhythm, or orientation?
- Is this visual family specific to this project, or just the model's default taste?
- Is the element carrying information, or only trying to look expensive?

If the answer is not concrete, delete it or replace it with source material, a real asset, a motion beat, or empty space.

## Visual Lock Gate

Before `Visual Lock`, write a `huashu_taste_preflight` block into the relevant review surface and mirror the decisions into existing state fields where available.

Minimum block:

```json
{
  "medium_persona": "",
  "core_asset_protocol": {
    "required_assets": [],
    "available_assets": [],
    "missing_assets": [],
    "placeholder_policy": "",
    "asset_quality_bar": ""
  },
  "direction_options": [
    {
      "option_id": "safe_professional",
      "metaphor": "",
      "chrome_family": "",
      "motion_signature": "",
      "hero_frame_sketch": "",
      "risk_if_bad": ""
    }
  ],
  "selected_direction": "",
  "creator_signature_policy": {
    "brand_memory_used": false,
    "selected_family_from_brand_memory": "",
    "adaptation_reason": "",
    "anti_template_constraint": "",
    "reference_path": ""
  },
  "anti_slop_bar": [],
  "continuous_motion_rule": "",
  "lookdev_five_axis_plan": [],
  "visual_resource_preflight_path": "visual-resource-research.md"
}
```

Use existing state paths:

- `visual.director_board.brainstorming_contract` for process evidence
- `visual.director_board.scene_boards[].aesthetic_layer.cheapness_to_avoid[]` for scene-level slop risks
- `visual.visual_policy.forbidden_list` for project-level slop patterns
- `visual.visual_policy.motif_system` for the 1-2 persistent hero elements
- `visual.visual_policy.motion_rhythm` for continuous-motion rules
- `review.lookdev_gate_results[]` for the five-axis review result

If the schema does not yet expose a dedicated field, keep the structured block in `art-direction.md` and cite it from `visual.visual_policy.manual_review_policy`.

The Huashu block is incomplete unless it points to the current visual resource preflight. The taste decision and the library/prompt decision must stay paired: a selected direction without selected assets, SVG/Remotion routes, and prompt-pack evidence is still too vague for Visual Lock.

## Continuous Motion Rule

For narration-led animation and knowledge video, the work is one continuous motion narrative, not a stack of independent pages.

Rules:

- choose 1-2 persistent hero elements or continuity handles for the full piece
- scenes should transform, reframe, pass, split, merge, zoom through, or reveal those handles
- pure `fade-up content -> full-page opacity cut -> new layout` is a PPT failure unless the cut is explicitly meaningful
- every adjacent scene should name what survives across the edge: object, number, keyword, proof region, shape, camera vector, color logic, or question-answer state
- if no handle can survive, the hard cut must have a narrative reason and a recorded cut moment

## Five-Axis Lookdev Review

At lookdev, score the actual preview or still set on five axes. This is a repair tool, not a user-facing performance theater.

- `thesis_fit`: does the visual philosophy match the content and audience?
- `visual_hierarchy`: can the viewer immediately tell what to watch first, second, and third?
- `craft_quality`: do spacing, crop, type, alignment, color, and motion feel deliberate?
- `functional_clarity`: does every element earn its place and help understanding?
- `originality`: does the piece avoid the common AI/default-template look?

Guidance:

- overall below 8 or any axis below 7 means revise before final render
- a proof-heavy project may accept lower originality only when clarity and evidence fidelity are excellent
- a hook/cover/hero scene cannot pass with weak originality or weak hierarchy
- findings must name concrete fixes, not just taste adjectives

## Repair Trigger

When the user says the work is ugly, flat, generic, too PPT-like, or "still not there", do not tune colors first. Rerun this sequence:

1. Re-open the current preview/stills.
2. Identify the slop family and the missing real asset or missing motion idea.
3. Generate three materially different direction repairs.
4. Pick one, kill the other two, and update the director board or art direction.
5. Recompile the affected scenes and rerun lookdev.

Renderer tweaks come after this pass, not before it.
