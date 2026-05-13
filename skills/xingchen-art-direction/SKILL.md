---
name: xingchen-art-direction
description: Use after xingchen-director-board and before visual-compiler, to lock the whole-piece visual meta-concept, project-original chrome whitelist, anti-reference, and machine-checkable lookdev gates for any render-bound xingchen project.
---

# Xingchen Art Direction

## When to enter

Triggered during `visual-direction`, after `xingchen-director-board` writes `project-state.json.visual.director_board`, before `xingchen-visual-compiler`. The project needs an explicit whole-piece visual direction decision - not a vibe, not a template pick. Refuses to run without at least one concrete `anti_reference`. Do not let `xingchen-visual-compiler` begin before the three approval surfaces below are signed off.

This skill consumes the director board and extracts/refines the whole-piece aesthetic system only. It does not own page-by-page, beat-by-beat, per-scene director work, scene binding, component choice, subtitle placement, or technical-stack justification; those decisions live in `visual.director_board.scene_boards[]`.

## Stage owned

`visual-direction` (whole-piece aesthetic layer) | writeback: `project-state.json -> visual.visual_policy` (and the Visual Lock approval). Exported review surfaces: `art-direction.md`, `visual-language-kit.json`, `lookdev-gate.yaml`. These are derived once state exists; edit state-backed decisions first, then re-export. `project-state.json.visual.director_board` remains owned by `xingchen-director-board`.

## Ownership in family

This skill is the canonical operator of the **aesthetic-grounding method**. The method file lives at [aesthetic-grounding.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\aesthetic-grounding.md) (kept under `xingchen-next/references` because more than one skill reads it), but only this skill writes the resulting `visual.visual_policy.*` fields. Other skills reference the method but do not invoke it independently.

## Ironclad rules

- **No `anti_reference`, no output.** This skill refuses to generate `art-direction.md` from nothing. The whole purpose is rejecting a concrete bad direction before locking a new one.
- **No completed director board, no aesthetic lock.** Refuse to proceed unless `project-state.json.visual.director_board.status` is `completed` or `manual_review_required` and every StoryMother scene has a concrete `scene_boards[]` entry.
- **Adversarial flow is mandatory** - three mutually exclusive `meta_concept` candidates, fatal-weakness critique, arbiter kills two. No blends by default. See [adversarial-flow.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\adversarial-flow.md).
- **Precedent gallery is inspiration, not a menu.** `visual-language-kit.json` must be project-original output, never a starter template imported wholesale. Critic must kill any proposal that reuses a precedent's chrome family + palette family + motion grammar together.
- INV-VISUAL-LOCK-BEFORE-RENDER, INV-NO-PARALLEL-TRUTH, INV-NO-SILENT-PASS apply.

Other shared rules: see [cross-skill-invariants.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\cross-skill-invariants.md).

## Skill-local procedure

### Step 0 - Director board intake

Before creative ignition or aesthetic mode selection, read `project-state.json.visual.director_board` and its `board_md_path` / `board_json_path`. Treat `global_director_thesis`, `aesthetic_system`, `subtitle_system`, `tech_stack_policy`, and `lookdev_acceptance` as upstream constraints.

Required behavior:

- confirm every `scene_boards[]` item has specific source, arrangement, aesthetic, frame, detail, component, subtitle, and tech-stack layers
- extract cross-scene aesthetic patterns, recurring motifs, palette pressure, typography posture, motion rhythm, and cheapness risks from the board
- refine only the whole-piece `meta_concept`, `anti_reference`, `forbidden_list`, `allowed_chrome`, `palette_lock`, `typography_lock`, `motif_system`, and `hero_scene_shortlist`
- preserve board-owned scene decisions; if a scene board is missing or generic, send it back to `xingchen-director-board` instead of filling the gap here

Do not proceed to `meta_concept`, chrome, palette, or renderer-family selection while `visual.director_board.status` is missing, `pending`, or `blocked`.

### Step 1 - Creative ignition

Run [creative-ignition.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\creative-ignition.md) before any candidate is pitched. Write the result into `art-direction.md -> ## Ignition`:

1. the content's essential verb
2. at least 5 candidate symbolic worlds spanning at least 3 distinct domains
3. the most tempting cliche direction (named, not implied)
4. the viewer's likely second-two reaction

Hard requirements: 5 worlds may not all stay inside software UI territory; if ignition collapses into "modern tech aesthetic", restart it.

### Step 2 - Aesthetic method

Run [aesthetic-grounding.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\aesthetic-grounding.md). Write back into `visual.visual_policy` (full field list in `project-state-contract.md` `VisualPolicy` section). Hard requirements:

- taste thesis explicit, not implied
- director board completed or routed to `manual_review_required`
- selected aesthetic mode named, not implied; rejected paths recorded
- benchmark canon concrete enough to review
- forbidden cheap patterns named (`forbidden_list` at least 8 items)
- hero frame governed by rules and points to a `scene_id`, not vibes
- color script explicit across opening / middle / closing
- voice route, prosody target, and mix posture explicit
- any rule that can't be automated yet -> `manual_review_required`
- recurring motifs are deliberate and few; hero quality concentrated in a `hero_scene_shortlist` of 2-3 scenes

### Step 3 - Strategy mode (one primary, no default blends)

Choose one and document the cost:

- `clarity_first_documentary` - best for proof-heavy work; less theatrical
- `layered_human_complexity` - best for lived-in density; easier to clutter
- `theatrical_control` - best for authored mood; easier to feel staged
- `singular_iconic_frame` - best for hero shots and covers; easier to flatten sequence rhythm

Hybrid is allowed only when at least one other mode is rejected explicitly with the non-negotiable tradeoff stated.

### Step 4 - Adversarial flow (3 candidates -> kill 2)

Per [adversarial-flow.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\adversarial-flow.md):

- `Proposer`: 3 mutually exclusive `meta_concept` candidates with different `chrome_family` values, attacking the `anti_reference` from different angles ("same family, different colors" does not count)
- `Critic`: fatal weakness of each + which forbidden pattern it risks
- `Arbiter`: pick 1, kill 2 explicitly; no blend

All three roles preserved in `art-direction.md -> ## Decision Trace`.

### Recording-first knowledge video lens

When the project is a spoken knowledge video:

- lock 3-5 recurring motifs strong enough to carry the whole piece without template reuse
- decide which 2-3 scenes are true hero scenes; downstream protects them first
- prefer project-specific symbolic systems over generic "future tech" chrome
- subtitle bars and HUD strips are support surfaces, not project identity
- opening earns trust quickly even when bold; middle reuses approved motifs with variation; closing feels like payoff or return

## Output artifacts

`art-direction.md` required sections (reject the output if any are missing): `meta_concept`, `anti_reference`, `forbidden_list`, `allowed_chrome`, `evidence_rule`, `motion_rhythm`, `palette_lock`, `typography_lock`, `motif_system`, `hero_scene_shortlist`, `decision_trace`, `downstream_binding`, `user_signature_line`.

`visual-language-kit.json` is the machine-consumed whitelist for downstream: chosen `chrome_family`, locked palette and typography, every allowed chrome component, motion lexicon, forbidden component names, and how downstream raises `kit-extension-request`. Live project document, never a frozen menu import.

`lookdev-gate.yaml` is the machine-checkable red-line file used by `xingchen-lookdev`. Blocking rules cover at minimum: evidence coverage, proof legibility, max static run, component whitelist, forbidden pattern hits, subtitle/proof overlap, motion density.

## Downstream contract

- `xingchen-visual-compiler` may only choose scene components and technical routes from `visual.director_board.scene_boards[].component_layer` and `.tech_stack_layer`; `visual-language-kit.json` constrains the whole-piece chrome language.
- New components require `kit-extension-request.md`, never silent invention.
- `video-project-graph` rejects components outside the approved kit and board plan.
- `xingchen-lookdev` evaluates `lookdev-gate.yaml` plus exact `visual.director_board.scene_boards[]` layers before preview approval.

## References

- [creative-ignition.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\creative-ignition.md)
- [adversarial-flow.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\adversarial-flow.md)
- [aesthetic-grounding.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\aesthetic-grounding.md)
- [forbidden-patterns.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\forbidden-patterns.md)
- [precedent-gallery.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\precedent-gallery.md)
- [chrome-kit-library.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\chrome-kit-library.md)
- [meta-concept-examples.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\references\meta-concept-examples.md)
- [art-direction.template.md](C:\Users\liuzh\.codex\skills\xingchen-art-direction\templates\art-direction.template.md)
- [visual-language-kit.template.json](C:\Users\liuzh\.codex\skills\xingchen-art-direction\templates\visual-language-kit.template.json)
- [lookdev-gate.template.yaml](C:\Users\liuzh\.codex\skills\xingchen-art-direction\templates\lookdev-gate.template.yaml)
- [project-state-contract.md](C:\Users\liuzh\.codex\skills\xingchen-next\references\project-state-contract.md) - full `VisualPolicy` field list
