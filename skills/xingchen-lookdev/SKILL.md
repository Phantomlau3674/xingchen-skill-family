---
name: xingchen-lookdev
description: Use when a code-first candidate project needs motion-aware preview approval, gate evaluation, or selective rerender decisions before final render in the xingchen family.
---

# Xingchen Lookdev

## When to enter

Triggered during `lookdev`, after `xingchen-visual-compiler` writes scene motion specs and `video-project-graph` produces the render-pack, before `remotion-render-adapter` runs final render. Catches the common failure where a project is structurally valid but still ships flat, templated, unreadable, slide-like, or built on text-only motion promises. Do not approve final render from stills alone. Do not force a full-project rerender when the problem is isolated.

## Stage owned

`lookdev` | writeback: `project-state.json -> review.lookdev_gate_results[]` (and the Lookdev Approval). Exported audit artifact: `lookdev-gate-result.json`. Sets INV-LOOKDEV-BEFORE-RENDER.

## Ownership in family

Canonical owner of the **scene composition audit** ([scene-composition-audit.md](C:\Users\liuzh\.codex\skills\xingchen-lookdev\references\scene-composition-audit.md)) and the **aesthetic review loop** ([aesthetic-review-loop.md](C:\Users\liuzh\.codex\skills\xingchen-lookdev\references\aesthetic-review-loop.md)). The pre-render scene composition pass is owned by `xingchen-visual-compiler`; the audit consumes the geometry fields written there and verifies them against `visual.director_board.scene_boards[]`.

## Ironclad rules

- Approval requires real motion artifacts: `.mp4`, `.mov`, `.html`, Remotion component, or transparent asset. Stills are support only. Text-only VibeMotion descriptions are not evidence.
- Adapter-created artifacts must be traceable through `render.plugin_adapter_runs[]`; missing input state refs, output paths, state writebacks, or candidate ids are lookdev blockers, not paperwork gaps.
- AI video prompt requests are not preview evidence. AI video candidates are never proof; approve them only after the user/API has produced real files registered as Remotion-controlled `video_plate` artifacts with `render.ai_video_candidates[]`, safety review, proof exclusion policy, Remotion integration plan, and matching adapter trace.
- Preview approval must audit consistency against each matching `visual.director_board.scene_boards[]` entry: `source_layer`, `arrangement_layer`, `brainstorming_layer`, `aesthetic_layer`, `frame_layer`, `detail_layer`, `component_layer`, `subtitle_layer`, and `tech_stack_layer`.
- Preview approval must audit every adjacent transition against `visual.director_board.scene_edge_boards[]`: the selected bridge, continuity handles, transition method, cut moment, and anti-PPT risk must be visible in the motion artifact.
- Failures must cite exact scene board or edge-board field paths, such as `scene-03.brainstorming_layer.anti_ppt_decision`, `scene-03.frame_layer.camera_path`, `scene-03.component_layer.primary_component`, `scene-05.subtitle_layer.must_not_cover`, or `edge-scene-03-to-scene-04.selected_bridge`. Vague failures like "not pretty enough" are invalid.
- Any unsupported aesthetic rule must route to `manual_review_required` (INV-NO-SILENT-PASS) — never a fake pass.
- Spark scenes: never approve `spark_3dgs` from a still, blank canvas, missing asset, or speculative plate. Procedural plates label as `procedural_splat_world`, not `true_3dgs_asset`. Fallback final quality requires explicit `approved_fallback_final` state and user acceptance.

Other shared rules: see [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md).

## Skill-local procedure

### Preview contract

Lookdev produces:

- `lookdev-brief.md`
- `lookdev-gate-result.json` and the state-backed `LookdevGateResult` entry
- low-res motion slices for the first 1–3 critical scenes or scene types
- actual VibeMotion candidate files for selected scene options when candidates are part of the plan
- actual HyperFrames plugin candidate files and their `render.plugin_adapter_runs[]` trace when HTML/canvas candidates are part of the plan
- actual AI video candidate files and their `render.ai_video_candidates[]` / `render.plugin_adapter_runs[]` trace when Seedance/manual generated-video plates are part of the plan; `render.ai_video_prompt_requests[]` alone is a handoff artifact, not lookdev evidence
- optional stills as support only

Recommended output paths: `lookdev-slices/*.mp4`, `vibemotion-candidates/*`, `lookdev-stills/*.png`, `preview-audit.json`.

### Preview levels

- `L2 keyframe-stills` — validates scale, palette, safe areas. Not enough to approve final motion.
- `L3 low-res-motion` — default approval surface. Short low-res motion slices with working timing and subtitles. Validates rhythm, proof readability, transition behavior, candidate viability.
- `L4 full-preview` — full-resolution preview with audio. Use when the motion language is already trusted.

Defaults: new render work goes `L3 → L4`. `L2` is optional support, never the main gate.

### Approval gate prerequisites

Render path may continue only when:

- `project-state.json` is current
- Topic Lock, Script Lock, StoryMother Lock, Visual Lock all resolved
- proof and script layers reviewed in state
- `visual.director_board.status` is `completed` or `manual_review_required`
- every reviewed scene has a non-generic `brainstorming_layer`, and every adjacent scene pair has a `scene_edge_boards[]` bridge
- visual policy and exported review files consistent
- every reviewed `render.scene_motion_specs[]` item back-references `visual.director_board.scene_boards[scene_id]`
- VibeMotion candidate files exist for selected candidate ids
- HyperFrames candidate files exist for selected candidate ids and every candidate id is linked from `render.plugin_adapter_runs[].candidate_ids`
- AI video candidate files exist for selected candidate ids, every candidate id is linked from `render.plugin_adapter_runs[].candidate_ids`, and the candidate safety review says no false evidence, no readable claim text, no brand/IP issue, and no face/identity risk
- Remotion plugin implementation or preview records identify affected `render.scene_motion_specs[]`, `render.jobs[]`, or render-pack paths when used
- render-pack graph current for the target variant
- `lookdev-gate.yaml` evaluation passes
- relevant motion slices approved
- Lookdev Approval written into `workflow.approvals`

### Recording-first motion review

For human-narration projects: preview slices use the real recording (or a timing-identical proxy, never a generic placeholder voice); opening order follows spoken sequence even when scene numbering shifted; frames are ready when keywords land, not a beat late; dominant anchors hold long enough to be understood; custom scenes still read after duration stretch; subtitles stay subordinate; recording-file boundaries did not create a fake scene break inside one continuous spoken thought.

### Scene composition audit (proof / UI / screenshot work)

Before approving screenshot-heavy or proof-heavy scenes, run [scene-composition-audit.md](C:\Users\liuzh\.codex\skills\xingchen-lookdev\references\scene-composition-audit.md) to verify plate truth, geometry truth, region truth, read path, and exit safety against `visual.director_board.scene_boards[scene_id].frame_layer`. When a preview-frame manifest is available, pass `preview-audit.json` so overlap and safe-area failures are computed from actual pixels, not vibes.

### What to verify in any approval

- proof readability and aspect/crop integrity (no non-uniform scaling on literal proof)
- subtitle avoidance of dominant anchor and proof-critical pixels
- one dominant visual anchor per scene, not multiple competing
- approved frame strategy actually respected
- piece feels like motion design, not a slide deck
- rendered scenes honor `visual.director_board.scene_boards[]`: source units are preserved, arrangement beats land on time, aesthetic intent is visible, frame/camera/proof/subtitle regions are respected, component choices match the board, and the chosen stack still matches `tech_stack_layer.why_this_stack`
- rendered scenes honor `brainstorming_layer.selected_direction`, use at least one declared continuity handle, and visibly avoid the stated `anti_ppt_decision`
- adjacent scene cuts honor `scene_edge_boards[]`: the outgoing handle, incoming handle, selected bridge, cut moment, and transition primitive read as one knowledge flow rather than slide replacement
- color script and style continuity read as one authored piece
- selected aesthetic mode honored, not drifted into a different high-end family
- VibeMotion candidates follow the approved script and have a Remotion promotion path
- HyperFrames plugin candidates follow the approved scene board, preserve subtitle/proof-safe regions, and have a captured HTML/canvas, transparent asset, video plate, or Remotion promotion path
- AI video candidates follow `tech_stack_layer.primary_stack: "gen_insert"` exactly: they fill only the bounded visual gap, contain no proof/subtitles/readable claims/UI evidence/logos/faces, and remain a muted Remotion `video_plate`
- `render.plugin_adapter_runs[]` records match actual files and do not claim an adapter did planning work that belongs to director-board or visual-compiler
- total-duration alignment is not hiding scene-internal timing drift
- Spark route_status and actual_renderer_family match the asset actually loaded; `.rad` worlds use paged streaming with explicit LOD/foveation budget; Spark plate exposes `window.__XINGCHEN_SPARK_PLATE__` with load state, splat count, route status, runtime profile, canvas health

### Result write-back rules

- gate with `on_fail: block` halts the pipeline with a specific scene pointer + rule id
- every failed gate records `scene_id`, `rule_id`, and one or more exact board paths from `source_layer`, `arrangement_layer`, `brainstorming_layer`, `aesthetic_layer`, `frame_layer`, `detail_layer`, `component_layer`, `subtitle_layer`, or `tech_stack_layer`; transition failures also record the exact `scene_edge_boards[].field` path
- review-only aesthetic rule that cannot be defended yet → `manual_review_required`
- write to `lookdev-gate-result.json` for audit
- write the same result back into state when `project-state.json` exists
- plugin failures should cite the adapter trace and the director-board field it failed to realize, for example `render.plugin_adapter_runs[2].output_paths` plus `scene-03.frame_layer.subtitle_safe_region`
- AI video failures should cite both the candidate and board path, for example `render.ai_video_candidates[0].safety_review.no_readable_claim_text` plus `scene-02.tech_stack_layer.why_this_stack`
- document geometry blockers explicitly when scene composition audit fails
- if a motion slice fails, capture affected `scene_id` values and reroute selectively (no blind full-project rerender)

## References

- [plugin-adapter-policy.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\plugin-adapter-policy.md)
- [aesthetic-review-loop.md](C:\Users\liuzh\.codex\skills\xingchen-lookdev\references\aesthetic-review-loop.md)
- [scene-composition-audit.md](C:\Users\liuzh\.codex\skills\xingchen-lookdev\references\scene-composition-audit.md)
- [lookdev-gate-result-contract.md](C:\Users\liuzh\.codex\skills\xingchen-lookdev\references\lookdev-gate-result-contract.md)
- [spark-3dgs-world-route.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\spark-3dgs-world-route.md) for Spark scene approval rules
- [renderer-families.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\renderer-families.md) for `actual_renderer_family` honesty
