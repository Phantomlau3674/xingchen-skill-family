# Spoken Knowledge Motion Grammar

Use this for spoken knowledge bloggers, AI explainers, recording-first educational videos, and any project where the user's voice is the main authority and the visuals must help the audience understand abstract ideas without turning into fake premium props.

This reference is inspired by strong Chinese AI explainer motion language: clean concept scaffolds, staged diagram construction, semantic arrows, proof zooms, and restrained accents. It is not permission to copy a creator's exact drawings, identity, title cards, or compositions.

## Default Posture

For a spoken knowledge video, default to `spoken_knowledge_motion` unless the project has a stronger approved visual identity.

The style is:

- real proof first
- abstract concepts as programmable structures
- motion as explanation, not decoration
- strong typography plus clean SVG/Canvas geometry
- imagegen for background plates, shock images, physical metaphors, and atmosphere
- code-native wireframes for explanation; no semantic linework pasted onto busy generated backgrounds
- few decorative generated props; no fake 3D object unless it clears a high quality bar

## Short-Video Operating Contract

For voice-led Douyin / Shorts style output, compile the motion grammar as a short-video lens system, not a slide sequence:

- frame `0-90` must show a speaker/avatar/main visual layer plus the hook proposition; do not open with an empty cover or pure title page
- pure title pages or full-screen static cards may not hold longer than `12` frames
- captions are the rhythm layer, not bottom explanatory footnotes; one caption group must stay within `2` lines
- info cards, proof cards, routes, nodes, and tables are overlays over a persistent main visual, not replacements for the visual layer
- every `75-120` frames must contain at least one light visual change: caption state, camera push/pull, card swap, path draw, proof scan, focus shift, or short transition overlay
- backgrounds must keep low-intensity depth, breathing, grain, blur, or texture; a plain static solid fill is not acceptable for non-rest scenes
- keep the creator signature aesthetic when present; do not import neutral-tech purple/cyan defaults as the visual identity

## Asset Policy

Use Remotion-native construction for concept objects:

- route lines
- function boxes
- input/output rails
- matrix or table grids
- stacked layers
- node graphs
- constraint frames
- scan windows
- highlighted proof regions
- feedback loops

These are scene-native structures, not static transparent PNG stickers. If route lines, node graphs, rails, tables, or process diagrams explain the voiceover, build the scene in Remotion/SVG/Canvas with a clean background or a declared low-contrast safe zone.

Use source media for proof:

- screenshots
- screen recordings
- tables
- documents
- real app/UI captures

Use generated image/3D assets only when all are true:

- the scene truly needs physical material texture rather than conceptual structure
- the asset is not proof, UI, Chinese text, brand identity, or factual evidence
- the prompt pack names its exact scene job and Remotion overlay plan
- lookdev can reject it if it reads as cheap generated prop

Use generated image plates generously when the scene job is hook shock, chapter atmosphere, cinematic metaphor, or payoff memory. The generated plate must stay text-free and must not compete with proof or subtitles.

If generated props look weak, delete the route and re-express the idea as linework, type, proof crops, or staged diagrams.

## Motion Grammar

Every non-rest scene should select 1-3 semantic primitives:

| Primitive | Meaning | Remotion route |
|---|---|---|
| `FalseRouteStrike` | reject a bad learning path or wrong interpretation | SVG slash, 6-12 frame snap |
| `RouteDraw` | show reasoning direction or chosen path | `@remotion/paths`, stroke evolution |
| `BlockSnap` | a concept becomes stable or named | `spring()` scale/position |
| `RailConstraint` | tool/platform/software imposes a flow | Remotion SVG rails + clipped motion |
| `StepBuild` | vague idea becomes ordered steps | staggered `Sequence` blocks |
| `ProofPushIn` | evidence becomes inspectable | screenshot plate camera push |
| `FocusScan` | tell the eye exactly where to look | moving rectangle or mask over proof |
| `FeedbackLoop` | output changes the next input | curved path returning to origin |
| `SystemPullout` | reveal that a small idea sits inside a larger system | scale/translate pull-out |
| `NodeDock` | background knowledge connects to a new tool | delayed edges + spring nodes |

Avoid motion with no semantic job. "Glow", "float", "particle", "orbital drift", and "tech scanline" are allowed only when the director board names what they explain.

## Scene Construction Pattern

Do not drop a finished diagram on screen. Build it along the narration:

1. Start with one simple object or phrase.
2. Attach a label when the voice names it.
3. Add the next object only when the argument needs it.
4. Connect them with a path, arrow, rail, or transform.
5. Push in for proof or pull out for system scale.
6. End with the diagram in a cleaner state than it began.

This keeps a long voiceover from becoming a stack of title cards.

## 0513-Like Mapping

For Vibe Coding / AI collaboration topics:

- "提示词、平台操作、工作流" -> false route labels crossed out, not fake logos
- "工具锁定" -> rail constraint or clipped workflow, not fake locks
- "AI 黑箱" -> high-contrast input/output/feedback field, not generated cube
- "会幻觉" -> warning branch from the output, not monster/prop imagery
- "重复劳动" -> looped rail or repeated task marks
- "自己的工具" -> route escapes the constraint rail
- "真实案例" -> screenshot push-in and scan highlight
- "软件工程全景" -> depth stack or system pullout
- "认知积木" -> node graph or docked knowledge blocks, not generated cubes by default

## Lookdev Checks

A preview fails this grammar if:

- the opening 90 frames lack a speaker/avatar/main visual layer or clear hook proposition
- a pure title page or full-screen static card holds longer than 12 frames
- captions become dense footnotes, exceed 2 lines, or sit outside the declared safe region
- cards replace the main visual instead of acting as overlays
- more than 120 frames pass without a visible rhythm change
- a non-rest scene uses a plain static solid background
- generated props are the visual hero while real proof is small
- semantic wireframes, routes, nodes, grids, or labels are pasted over a busy imagegen background instead of being a readable code-native scene
- the scene would still make sense if all motion were removed
- text labels explain what the picture failed to show
- every scene is a static card with different words
- fake UI or fake dashboards replace source evidence
- a physical metaphor looks cheaper than a clean line diagram

## Output Trace

When this grammar is selected, record it in the art direction or director board:

```json
{
  "spoken_knowledge_motion": {
    "selected": true,
    "why": "voice-led AI explainer; abstract concepts need staged construction",
    "asset_policy": "real proof + Remotion-native concept objects; no generated props by default",
    "motion_primitives": ["RouteDraw", "BlockSnap", "ProofPushIn"],
    "lookdev_risks": ["static cards", "cheap generated props", "motion without semantic job"]
  }
}
```

Downstream `render.scene_motion_specs[]` should mirror the selected primitives in `motion_verbs`, `transition_primitives`, `remotion_layout_plan`, and `visual_resource_trace`.
