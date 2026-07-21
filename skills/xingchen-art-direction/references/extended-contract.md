# Extended Contract

> This historical contract applies only when project-state.json uses mode extended or a legacy state has no mode field. It does not add gates or required fields to Lean projects.


# Xingchen Art Direction

## Lean Mode Override

When `project-state.json.mode === "lean"`, this section overrides every later conflicting requirement in this file.

Produce a compact visual language that affects the rendered film:

- one visual thesis
- hierarchy and dominant-subject rule
- palette and contrast logic
- typography and mobile-readability rules
- continuity anchor
- motion character and allowed stillness
- proof treatment
- anti-template red lines

Offer multiple directions only when an unresolved high-impact choice exists. Open Design, GitHub, Huashu, Lottie, GSAP, image generation, adversarial arbitration, and visual-resource research are optional references, not mandatory preflights.

Do not require Visual Lock, a chrome whitelist, three candidates, expanded audit fields, or package/resource decisions that do not affect the current film.

When a creator signature or avatar is relevant, adapt the established asset to the topic. Do not stamp the same night-window/workbench motif into every video.

All later mandatory-preflight and Visual Lock requirements apply only to Extended or legacy projects.

## Knowledge Base Routing

For reusable video methodology, read stevenmind first:

- `C:\stevenmind\stevenmind\04 Wiki\视频创作\`
- `C:\stevenmind\stevenmind\04 Wiki\共享方法论\`
- `C:\stevenmind\stevenmind\04 Wiki\技术栈\`
- `C:\stevenmind\stevenmind\04 Wiki\抖音\` non-legacy pages

Do not read `C:\stevenmind\stevenmind\04 Wiki\公众号创作\`. That domain belongs to `wechat-*`.

Use local `references/`, `schema/`, and validators for executable contracts only: state fields, route policies, INV rules, validator logic, runtime commands, and rollback evidence. If a wiki page and a local reference overlap, use the wiki for method wording and the local reference for machine/state requirements.

Before crossing domains, verify with:

```powershell
python C:\stevenmind\stevenmind\tools\vault_manager.py read-check --root C:\stevenmind\stevenmind --skill xingchen-next --page "{page}"
```
## When to enter

Triggered during `visual-direction`, after `xingchen-director-board` writes `project-state.json.visual.director_board`, before `xingchen-visual-compiler`. The project needs an explicit whole-piece visual direction decision - not a vibe, not a template pick. Refuses to run without at least one concrete `anti_reference`. Do not let `xingchen-visual-compiler` begin before the three approval surfaces below are signed off.

This skill consumes the director board and extracts/refines the whole-piece aesthetic system only. It does not own page-by-page, beat-by-beat, per-scene director work, scene binding, component choice, subtitle placement, or technical-stack justification; those decisions live in `visual.director_board.scene_boards[]`.

## Stage owned

`visual-direction` (whole-piece aesthetic layer) | writeback: `project-state.json -> visual.visual_policy` (and the Visual Lock approval). Exported review surfaces: `art-direction.md`, `visual-language-kit.json`, `lookdev-gate.yaml`. These are derived once state exists; edit state-backed decisions first, then re-export. `project-state.json.visual.director_board` remains owned by `xingchen-director-board`.

## Ownership in family

This skill is the canonical operator of the **aesthetic-grounding method**. The method file lives at [aesthetic-grounding.md](../../xingchen-next/references/aesthetic-grounding.md) (kept under `xingchen-next/references` because more than one skill reads it), but only this skill writes the resulting `visual.visual_policy.*` fields. Other skills reference the method but do not invoke it independently.

## Ironclad rules

- **No `anti_reference`, no output.** This skill refuses to generate `art-direction.md` from nothing. The whole purpose is rejecting a concrete bad direction before locking a new one.
- **No completed director board, no aesthetic lock.** Refuse to proceed unless `project-state.json.visual.director_board.status` is `completed` or `manual_review_required` and every StoryMother scene has a concrete `scene_boards[]` entry.
- **Huashu taste preflight is mandatory.** Before locking `meta_concept`, record medium persona, core asset protocol, three materially different direction options when needed, selected direction, anti-slop bar, placeholder policy, and continuous-motion rule. See [huashu-design-taste-upgrade.md](../../xingchen-next/references/huashu-design-taste-upgrade.md).
- **GitHub design intake is mandatory.** Before locking `meta_concept`, read [github-design-skill-intake.md](../../xingchen-next/references/github-design-skill-intake.md) and record fact-check status, real assets, design-system decision, direction choice, anti-slop bar, verification route, and five-dimension review plan in `visual.director_board.brainstorming_contract.github_design_intake`.
- **Open Design original skills are conditional references.** If any installed Open Design original skill is used for design-system capture, web UI review, frame archetypes, HTML/HyperFrames candidates, or motion taste, read [open-design-original-skill-intake.md](../../xingchen-next/references/open-design-original-skill-intake.md) and record the original skill path, snapshot commit, selected traits, rejected traits, Xingchen adaptation, preview route, and proof/subtitle ownership. Do not lock a meta-concept by choosing an Open Design template.
- **Language-game correction is mandatory.** Before locking `meta_concept`, apply [language-game-correction.md](../../xingchen-next/references/language-game-correction.md). Whole-piece words such as `高级`, `电影感`, `更丰富`, `温暖`, or metaphor labels must become public visual criteria, anti-reference rules, motif behavior, motion rhythm, or lookdev checks.
- **Visual resource preflight is mandatory.** Before locking `meta_concept`, record source reality, design-system memory, selected/rejected SVG/icon libraries, selected/rejected Remotion packages, imagegen route, prompt-pack paths when needed, and lookdev audit hooks. See [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md).
- **Style influence must be adapted, not copied.** If [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md) is selected, record `visual_style_influence` and `editorial_world_system` in `visual.visual_policy`, including selected traits, Xingchen adaptation, avoid-copying list, proof ownership, and lookdev hooks.
- **Adversarial flow is mandatory** - three mutually exclusive `meta_concept` candidates, fatal-weakness critique, arbiter kills two. No blends by default. See [adversarial-flow.md](./adversarial-flow.md).
- **Precedent gallery is inspiration, not a menu.** `visual-language-kit.json` must be project-original output, never a starter template imported wholesale. Critic must kill any proposal that reuses a precedent's chrome family + palette family + motion grammar together.
- INV-VISUAL-LOCK-BEFORE-RENDER, INV-NO-PARALLEL-TRUTH, INV-NO-SILENT-PASS apply.

Other shared rules: see [cross-skill-invariants.md](../../xingchen-next/references/cross-skill-invariants.md).

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

Run [creative-ignition.md](./creative-ignition.md) before any candidate is pitched. Write the result into `art-direction.md -> ## Ignition`:

1. the content's essential verb
2. at least 5 candidate symbolic worlds spanning at least 3 distinct domains
3. the most tempting cliche direction (named, not implied)
4. the viewer's likely second-two reaction

Hard requirements: 5 worlds may not all stay inside software UI territory; if ignition collapses into "modern tech aesthetic", restart it.

### Step 1.5 - Huashu taste preflight

Run [huashu-design-taste-upgrade.md](../../xingchen-next/references/huashu-design-taste-upgrade.md) before the aesthetic method and adversarial flow are finalized. Write the result into `art-direction.md -> ## Huashu Taste Preflight`, and mirror stable decisions into `visual.visual_policy` where the schema already has matching fields.

Required outputs:

- `medium_persona`: the role the agent is embodying for this deliverable, such as motion director, information designer, product prototype designer, or film editor
- `core_asset_protocol`: real assets required, real assets available, missing assets, placeholder policy, and asset quality bar
- `direction_options`: exactly three materially different direction options when the user has not already locked the direction; they must differ in metaphor, chrome family, composition logic, palette pressure, and motion signature
- `selected_direction`: one selected option plus why the other two are killed; do not blend by default
- `anti_slop_bar`: concrete patterns to delete before implementation, especially fake dashboards, decorative gradient/glow, stock-photo filler, CSS/SVG fake products, and generated proof UI
- `continuous_motion_rule`: the 1-2 persistent elements or handles that make the piece feel like one motion narrative instead of a sequence of slides
- `lookdev_five_axis_plan`: how lookdev will score thesis fit, visual hierarchy, craft quality, functional clarity, and originality

If any branded product, UI, real object, screenshot, or proof document appears without a real asset or an honest placeholder plan, route back to `xingchen-director-board` or ingest. Do not solve missing assets with CSS silhouettes, fake screenshots, or generic generated dashboard images.

### Step 1.52 - GitHub design skill intake

Run [github-design-skill-intake.md](../../xingchen-next/references/github-design-skill-intake.md) immediately after Huashu taste preflight. Write the result into `art-direction.md -> ## GitHub Design Skill Intake`, and mirror the machine-readable summary into `visual.director_board.brainstorming_contract.github_design_intake`.

Required outputs:

- `source_ref`: `github-design-skill-intake.md`
- `fact_check`: what named brands/products/versions were verified, or explicit `not_needed`
- `core_assets`: logo/product/UI/source/proof assets available, missing, and placeholders
- `design_system`: declared/extracted token rules for palette, type, spacing, surfaces, radius, and motion mood
- `direction_choice`: selected direction and the two killed alternatives when direction was not locked
- `anti_slop_bar`: concrete visual defaults rejected before implementation
- `verification_route`: how preview/browser/canvas checks will prove the design is non-generic
- `five_dimension_review_plan`: philosophy consistency, visual hierarchy, detail execution, functionality, and innovation thresholds
- `open_design_original_skill_intake`: required when an installed Open Design original skill materially influences the direction; include original skill path, snapshot commit, selected traits, rejected traits, Xingchen adaptation, proof/subtitle ownership, and preview route per [open-design-original-skill-intake.md](../../xingchen-next/references/open-design-original-skill-intake.md)

If the project truly has no brand/product/UI/design-heavy scene, write `not_needed_reason`; otherwise the field is required before Visual Lock.

### Step 1.55 - Language-game correction

Run [language-game-correction.md](../../xingchen-next/references/language-game-correction.md) before finalizing candidate directions. For each important aesthetic word or metaphor, write a compact correction into `art-direction.md -> ## Language Game Correction`: phrase, production game, public criterion, corrected use, and route. Mirror stable decisions into existing `visual.visual_policy` fields such as taste thesis, forbidden list, motif system, motion rhythm, and lookdev gates. If a direction cannot be made public, kill it in adversarial flow instead of blending it.

### Step 1.6 - Visual resource and prompt preflight

Run [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md) before the aesthetic method and adversarial flow are finalized. Write the result into `art-direction.md -> ## Visual Resource And Prompt Preflight`, and mirror the required machine-readable summary into `visual.director_board.brainstorming_contract.resource_preflight`.

Required outputs:

- `source_reality`: real assets available, source pixels that must be preserved, what can be generated/rebuilt, missing assets, and honest placeholder policy
- `design_system_memory`: token + rule + rationale contract for palette, type, spacing, icon rules, motion posture, and source/proof treatment
- `library_candidate_matrix`: selected and rejected SVG/icon, brand-logo, vector graphics, Remotion, imagegen, 3D, data-viz, and animation libraries with source URL, use case, do-not-use case, provenance/license note, and fit score
- `selected_routes`: final icon family, SVG tools, Remotion packages, imagegen model/skill route, real asset sources, and dependency install requests
- `imagegen_prompt_pack`: prompt pack path or explicit `not_needed` reason
- `lookdev_audit_hooks`: which package imports, prompt-pack outputs, OCR checks, proof/source checks, and library traces lookdev must verify

If any generated image or video is needed, require `imagegen-prompt-pack.md/json` before downstream implementation. A one-line image prompt is not a valid art-direction output.

### Step 1.65 - Editorial collage influence lock

When the project selects Vox/Remotion-style editorial motion influence, read [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md) and write a bounded influence record into `art-direction.md -> ## Visual Style Influence` and `visual.visual_policy`:

- `visual_style_influence.source = "vox_remotion_visual_style"`
- `selected_traits[]`: only the traits this project will actually use, such as shared paper world, halftone cutouts, red marker offsets, foreground proof carriers, kinetic numbers, or Remotion-owned captions
- `xingchen_adaptation`: how the traits preserve creator identity, mobile readability, and the current proof/script instead of copying the source video
- `avoid_copying[]`: exact source scenes, topic, creator identity, title card, and brand voice
- `editorial_world_system`: background id, paper/grid texture, grain, palette, typography, cutout policy, red marker policy, proof ownership, and safe-area mask
- `lookdev_hooks[]`: the full Vox/Remotion rule set when this influence is selected: `scene_contract_check`, `world_continuity_check`, `layer_stack_check`, `remotion_proof_ownership_check`, `bitmap_text_ocr_check`, `mobile_downsample_check`, `safe_zone_overlap_check`, `foreground_dominance_check`, `red_marker_semantics_check`, `beat_sync_check`, `motion_density_check`, `final_hold_frame_check`, `prop_control_smoke_test`, and `proof_source_trace_check`

Kill this influence in adversarial flow if it would turn the piece into a generic Vox imitation, a slide deck with red accents, or a palette-only reskin.

### Step 2 - Aesthetic method

Run [aesthetic-grounding.md](../../xingchen-next/references/aesthetic-grounding.md). Write back into `visual.visual_policy` (full field list in `project-state-contract.md` `VisualPolicy` section). Hard requirements:

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

Per [adversarial-flow.md](./adversarial-flow.md):

- `Proposer`: 3 mutually exclusive `meta_concept` candidates with different `chrome_family` values, attacking the `anti_reference` from different angles ("same family, different colors" does not count)
- `Critic`: fatal weakness of each + which forbidden pattern it risks
- `Arbiter`: pick 1, kill 2 explicitly; no blend

All three roles preserved in `art-direction.md -> ## Decision Trace`.

### Recording-first knowledge video lens

When the project is a spoken knowledge video:

- default-check `spoken_knowledge_motion` from [spoken-knowledge-motion-grammar.md](../../xingchen-next/references/spoken-knowledge-motion-grammar.md): staged concept construction, semantic arrows/rails/blocks, real proof zooms, and Remotion-native information objects
- if the user is a口播型知识博主 or AI explainer creator, prefer this grammar over generated object props unless the board records why a physical asset is necessary and likely to pass lookdev
- when selected, write `visual.visual_policy.spoken_knowledge_motion_policy` with `selected`, `why`, `asset_policy`, `motion_primitives`, and `lookdev_risks`; director-board only fills scene-level `concrete_execution_plan` fields and must not author `visual.visual_policy.*`
- lock 3-5 recurring motifs strong enough to carry the whole piece without template reuse
- decide which 2-3 scenes are true hero scenes; downstream protects them first
- prefer project-specific symbolic systems over generic "future tech" chrome
- treat generated props as a risk, not a default: if they read as cheap, reroute to linework/type/proof crops/staged diagrams
- subtitle bars and HUD strips are support surfaces, not project identity
- opening earns trust quickly even when bold; middle reuses approved motifs with variation; closing feels like payoff or return

## Output artifacts

`art-direction.md` required sections (reject the output if any are missing): `meta_concept`, `huashu_taste_preflight`, `github_design_skill_intake`, `visual_resource_and_prompt_preflight`, `spoken_knowledge_motion_policy` when the project is a spoken knowledge video, `anti_reference`, `forbidden_list`, `allowed_chrome`, `evidence_rule`, `motion_rhythm`, `palette_lock`, `typography_lock`, `motif_system`, `hero_scene_shortlist`, `decision_trace`, `downstream_binding`, `user_signature_line`.

`visual-language-kit.json` is the machine-consumed whitelist for downstream: chosen `chrome_family`, locked palette and typography, every allowed chrome component, motion lexicon, forbidden component names, and how downstream raises `kit-extension-request`. Live project document, never a frozen menu import.

`lookdev-gate.yaml` is the machine-checkable red-line file used by `xingchen-lookdev`. Blocking rules cover at minimum: evidence coverage, proof legibility, max static run, component whitelist, forbidden pattern hits, subtitle/proof overlap, motion density.

## Downstream contract

- `xingchen-visual-compiler` may only choose scene components and technical routes from `visual.director_board.scene_boards[].component_layer` and `.tech_stack_layer`; `visual-language-kit.json` constrains the whole-piece chrome language.
- New components require `kit-extension-request.md`, never silent invention.
- `video-project-graph` rejects components outside the approved kit and board plan.
- `xingchen-lookdev` evaluates `lookdev-gate.yaml` plus exact `visual.director_board.scene_boards[]` layers before preview approval.

## References

- [creative-ignition.md](./creative-ignition.md)
- [adversarial-flow.md](./adversarial-flow.md)
- [language-game-correction.md](../../xingchen-next/references/language-game-correction.md)
- [huashu-design-taste-upgrade.md](../../xingchen-next/references/huashu-design-taste-upgrade.md)
- [github-design-skill-intake.md](../../xingchen-next/references/github-design-skill-intake.md)
- [open-design-original-skill-intake.md](../../xingchen-next/references/open-design-original-skill-intake.md)
- [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md)
- [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md)
- [aesthetic-grounding.md](../../xingchen-next/references/aesthetic-grounding.md)
- [forbidden-patterns.md](./forbidden-patterns.md)
- [precedent-gallery.md](./precedent-gallery.md)
- [chrome-kit-library.md](./chrome-kit-library.md)
- [meta-concept-examples.md](./meta-concept-examples.md)
- [art-direction.template.md](../templates/art-direction.template.md)
- [visual-resource-research.template.md](../templates/visual-resource-research.template.md)
- [visual-resource-research.template.json](../templates/visual-resource-research.template.json)
- [imagegen-prompt-pack.template.json](../templates/imagegen-prompt-pack.template.json)
- [visual-language-kit.template.json](../templates/visual-language-kit.template.json)
- [lookdev-gate.template.yaml](../templates/lookdev-gate.template.yaml)
- [project-state-contract.md](../../xingchen-next/references/project-state-contract.md) - full `VisualPolicy` field list
