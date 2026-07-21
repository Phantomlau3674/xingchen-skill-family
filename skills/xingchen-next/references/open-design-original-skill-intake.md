# Open Design Original Skill Intake

This reference governs how Xingchen Next may use the locally installed
`nexu-io/open-design` original skills snapshot.

Source snapshot:

- Active archive skill: `../../open-design-original`
- Raw snapshot: `../../open-design-original/snapshot/skills`
- Commit: `d5aeab77fc4e5c81506b379ce35b88bbb31ffae1`
- Install manifest: `../../open-design-original/install-manifest.json`

The snapshot is an external design-skill library. It can provide visual
vocabulary, design-system extraction hints, HTML/HyperFrames candidate
patterns, GSAP motion references, and web-artifact review checklists. It is not
a new Xingchen truth layer.

## Non-Negotiable Boundary

Open Design skills never replace:

- `project-state.json`
- StoryMother scene order
- `visual.director_board`
- `visual.visual_policy`
- proof meaning
- final subtitle policy
- Remotion final assembly

Every use must be traced back to current Xingchen state. If a skill cannot be
adapted to the current source material, recording rhythm, proof boundary, and
Douyin readability constraints, do not use it.

## What "Original" Means

Keep the Open Design skill files unmodified. Read the original `SKILL.md`
before use, then record how it was adapted into Xingchen.

Use one of these source paths:

- Active non-conflicting skills: `../../<skill-name>/SKILL.md`
- Full raw snapshot: `../../open-design-original/snapshot/skills/<skill-name>/SKILL.md`

Conflict note: `frontend-slides`, `hatch-pet`, and `imagegen` existed locally
before the Open Design install. Their Open Design originals are available only
through the snapshot path unless the user explicitly chooses to inspect them.

## When To Consider It

Use this intake only after the relevant Xingchen stage has enough state to make
a scene-specific decision.

Good triggers:

- a scene is web, dashboard, chart, UI, flowchart, deck, artifact, or
  design-system heavy
- the director board asks for HTML/canvas/GSAP/HyperFrames candidate evidence
- the project needs a reusable design-system or brand-rule capture
- a lookdev pass needs product UI, spacing, hierarchy, motion, or accessibility
  review language
- the visual compiler needs a frame archetype before writing Remotion code

Bad triggers:

- "make it prettier" without a named scene job
- template shopping before StoryMother and director-board decisions
- using a visual style to avoid source/proof work
- letting provider-wrapper skills choose media generation by convenience
- using a frame template as a final scene strategy

## Useful Skill Groups

### Design System And Brand Rules

Candidates:

- `design-md`
- `brand-extract`
- `brand-guidelines`
- `reference-design-contract`
- `web-design-guidelines`
- `frontend-design`

Use for: visual policy, DESIGN.md-style rule capture, UI review language,
brand-token extraction, and lookdev checklists.

Do not let token imitation outrank real source assets, creator signature
policy, or proof responsibilities.

### HTML Artifact And Web UI Candidates

Candidates:

- `artifacts-builder`
- `web-artifacts-builder`
- `web-clone`
- `shadcn-ui`
- `ui-ux-pro-max`
- `impeccable-design-polish`

Use for: HTML/browser candidate artifacts, dashboard or webpage-like proof
environments, and UI polish review.

Generated artifacts must remain project-local review candidates until promoted
by `xingchen-visual-compiler` and audited by `xingchen-lookdev`.

### Frame Archetypes

Candidates:

- `video-hyperframes`
- `frame-data-chart-nyt`
- `frame-flowchart-sticky`
- `frame-glitch-title`
- `frame-light-leak-cinema`
- `frame-liquid-bg-hero`
- `frame-logo-outro`
- `frame-macos-notification`
- `swiss-user-research-video-template`
- `weread-year-in-review-video-template`

Use for: scene archetype inspiration and HTML/HyperFrames candidates.

Required adaptation:

- replace template content with the current scene job and source material
- state the semantic relationship directly
- preserve subtitle and proof safe zones
- keep essential meaning out of secondary labels
- record selected and rejected traits

For Douyin/mobile targets, enforce the durable readability ladder:

- main subtitles: about `58-64 px`
- scene thesis labels: about `44-52 px`
- important node labels: about `38-46 px`
- secondary labels: non-essential only

### Motion And GSAP References

Candidates:

- `gsap-core`
- `gsap-timeline`
- `gsap-scrolltrigger`
- `gsap-react`
- `gsap-performance`
- `emilkowalski-motion`
- `review-animations`

Use for: DOM/SVG-heavy HyperFrames candidates, staged semantic reveals,
micro-motion restraint, and lookdev motion review.

The final timeline remains Remotion-owned. GSAP must record `gsap_usage` and
semantic reveal notes through the HyperFrames route.

### Data, Proof, And Diagram Frames

Candidates:

- `frame-data-chart-nyt`
- `d3-visualization`
- `data-report`
- `hand-drawn-diagrams`

Use for: chart/proof scenes, process diagrams, and explanation scaffolds.

Proof labels, chart values, route labels, and citations must be code-owned and
auditable. Do not paste semantic wireframes onto generated background plates.

### Provider And Media Wrappers

Candidates include `fal-*`, `venice-*`, `replicate`, `sora`, and similar
provider wrappers.

Use only when Xingchen already has an approved adapter route and the provider
is actually available. Provider skills may create prompt packs, candidate
assets, or manual handoff instructions; they may not own proof, subtitles,
logos, faces, or final timing.

## Required Intake Record

When an Open Design skill materially influences visual-direction,
visual-compiler, lookdev, or render work, record this under the director-board
brainstorming/resource preflight area:

```json
{
  "open_design_original_skill_intake": {
    "snapshot_commit": "d5aeab77fc4e5c81506b379ce35b88bbb31ffae1",
    "skills_considered": [
      {
        "skill_name": "",
        "source_path": "",
        "stage": "visual-direction|visual-compiler|lookdev|render",
        "scene_ids": [],
        "selected_traits": [],
        "rejected_traits": [],
        "xingchen_adaptation": "",
        "proof_or_subtitle_ownership": "remotion_or_code_owned",
        "readability_plan": "",
        "preview_verification_route": "",
        "decision": "use|reject|defer"
      }
    ]
  }
}
```

If the skill creates or inspects a concrete artifact, also append a
`render.plugin_adapter_runs[]` record per `plugin-adapter-policy.md`.

## Adapter Identity

Use this adapter id pattern:

```text
open-design-original:<skill-name>@d5aeab77fc4e
```

Use `skill_name: "open-design-original"` in `render.plugin_adapter_runs[]`.
The concrete original skill name lives in `adapter_id`, `notes`, and the
`open_design_original_skill_intake.skills_considered[]` record.

Use `adapter_kind: "local_skill"` for active installed skills and
`adapter_kind: "manual_implementation"` when only reading the raw snapshot as a
reference.

## Approval Gate

Do not promote an Open Design-derived candidate unless all are true:

- it traces to current StoryMother, director board, visual policy, and script
  timing
- it names what was borrowed and what was rejected
- it passes mobile readability and semantic-copy checks
- it keeps proof/subtitles/final timing under Remotion or code control
- it has a preview route and lookdev evidence
- it does not copy a template as the final scene strategy
