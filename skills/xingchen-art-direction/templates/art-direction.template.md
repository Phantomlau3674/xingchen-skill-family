# Art Direction Template

Use this file as the project-level decision record.

The examples below are illustrative:

- accepted example: 0417 `output-16x9-v2`
- rejected example: 0417 `output-16x9`

## 1. Meta Concept

- chosen_meta_concept:
- one_sentence_binding:
- taste_thesis:

Example:

- `This video feels like a live proof session, not a keynote.`

Counterexample:

- `Modern technology with blue gradients.`

## 2. Aesthetic Grounding

- benchmark_canon:
- reference_set:
- selected_aesthetic_mode:
- aesthetic_modes:
- editing_priority_stack:
- continuity_policy:
- mise_en_scene_policy:
- color_script_policy:
- audio_policy:
- voice_policy:
- anti_cheapness:
- hero_frame_scene_id:
- hero_frame_laws:
- energy_curve:
- short_form_policy:
- style_consistency_policy:
- manual_review_policy:

Example:

- `benchmark_canon`: `Oxford composition`, `project-specific Rule of Six ordering`, `color script`, `short-form hook`
- `reference_set`: `hero frame`, `motion slice`, `proof readability frame`
- `selected_aesthetic_mode`: `clarity_first_documentary`
- `aesthetic_modes`: `selected clarity_first_documentary because proof trust wins; rejected theatrical_control because it would over-stage the evidence`
- `editing_priority_stack`: `story > emotion > eye-trace > rhythm > 2D plane > 3D space because proof clarity is primary`
- `continuity_policy`: `flow stays clear in time and space`
- `mise_en_scene_policy`: `staging, blocking, lighting motivation, and color abstraction do narrative work`
- `color_script_policy`: `opening cool anchor -> middle denser neutrals -> closing controlled release`
- `audio_policy`: `light tension bed only under proof escalation; no stock hype rise`
- `voice_policy`: `measured but pressing, audible breaths preserved, pronunciation watchlist locked`
- `anti_cheapness`: `fake dashboard chrome`, `subtitle echo bubble`, `generic keynote gradient`, `AI skin sheen`, `whip zoom abuse`
- `hero_frame_scene_id`: `scene-01`
- `hero_frame_laws`: `one dominant anchor`, `instant claim clarity`, `protect proof pixels`
- `energy_curve`: `opening hook -> proof build -> release`
- `short_form_policy`: `9:16`, `audio-on`, `first seconds matter`
- `style_consistency_policy`: `same voice across lighting and subjects`
- `manual_review_policy`: `unsupported aesthetic rules must route to human review`

## 2.5 Strategy Modes

- primary_mode:
- rejected_modes:
- tradeoffs_accepted:
- tradeoffs_rejected:
- disallowed_mode_mix:

Example:

- `primary_mode`: `clarity_first_documentary`
- `rejected_modes`: `theatrical_control because it would stage the proof; singular_iconic_frame as primary because this piece needs sequence rhythm`
- `tradeoffs_accepted`: `less spectacle, more legibility`
- `tradeoffs_rejected`: `layered clutter, generic keynote polish`
- `disallowed_mode_mix`: `do not borrow theatrical lighting cues that make the evidence feel performed`

## 3. Anti Reference

- path:
- why_rejected_1:
- why_rejected_2:
- why_rejected_3:

Example:

- `C:\Users\liuzh\Videos\douyin\0417\out\output-16x9.mp4`
- floating English status chips with no real narrative job
- proof cropped into decorative cards
- side bubbles that repeat the narration instead of adding meaning

## 4. Forbidden List

List at least 5 patterns.

Recommended format:

- `pattern_name`: what it looks like / why it fails / what to swap to

Example:

- `english-status-chip`: floating English chips that look professional but carry no story meaning
- `pseudo-dashboard-card`: dashboard-like boxes with no real system behind them
- `narration-echo-bubble`: text that repeats the script instead of adding information
- `thumbnail-evidence`: proof shrunk into a thumbnail so the claim cannot be read
- `gradient-blob-decor`: decorative glow, blobs, or particles with no narrative role

## 5. Allowed Chrome

List at least 5 allowed elements from one symbolic family only.

Example:

- terminal cursor `_`
- command prompt `/`
- state path reference `mother.story_mother.scene_cards[2]`
- real progress bar
- diff line `+++`
- skill badge pill
- keyboard glyph `>`

Counterexample:

- terminal frame + SaaS dashboard card + documentary timestamp mixed together

## 6. Evidence Rule

- proof_scene_min_coverage_ratio:
- hero_proof_recommended_ratio:
- min_legible_font_px_at_target_resolution:
- subtitle_overlap_max_ratio:

Example:

- `proof_scene_min_coverage_ratio: 0.60`
- `hero_proof_recommended_ratio: 0.70`
- `min_legible_font_px_at_target_resolution: 24`
- `subtitle_overlap_max_ratio: 0.10`

## 7. Motion Rhythm

- min_motion_classes_per_scene:
- max_static_run_frames:
- cadence_floor_events_per_second:
- approved_transition_behaviors:

Example:

- `min_motion_classes_per_scene: 3`
- `max_static_run_frames: 45`
- `cadence_floor_events_per_second: 1.2`

## 8. Palette Lock

Declare exact values, not adjectives.

Example:

- `bg-void: #0A0B0E`
- `bg-panel: #12141A`
- `text-primary: #ECEFF4`
- `accent-warm: #F5A524`
- `accent-cool: #7DD3FC`
- `accent-good: #4ADE80`
- `accent-bad: #F87171`

Counterexample:

- `modern gradient blue-purple`

## 9. Typography Lock

- display_font:
- display_weight:
- body_font:
- body_weight:
- mono_font:
- mono_weight:
- tracking_rules:

Example:

- `display_font: Alibaba PuHuiTi 3.0 95 Ultra Bold`
- `body_font: Alibaba PuHuiTi 3.0 55 Medium`
- `mono_font: JetBrains Mono`

## 10. Decision Trace

### Ignition

- essential_verb:
- symbolic_worlds:
- tempting_cliche:
- second_two_reaction:

### Proposer

#### Candidate A

- meta_concept:
- chrome_family:
- why_it_fits_this_content:

#### Candidate B

- meta_concept:
- chrome_family:
- why_it_fits_this_content:

#### Candidate C

- meta_concept:
- chrome_family:
- why_it_fits_this_content:

### Critic

#### Kill A

- fatal_weakness:
- likely_forbidden_pattern:
- why_viewer_stops:

#### Kill B

- fatal_weakness:
- likely_forbidden_pattern:
- why_viewer_stops:

#### Kill C

- fatal_weakness:
- likely_forbidden_pattern:
- why_viewer_stops:

### Arbiter Verdict

- chosen_candidate:
- why_selected:
- why_killed_other_1:
- why_killed_other_2:

## 11. Downstream Binding

- visual_language_kit_path:
- lookdev_gate_path:
- allowed_chrome_family:
- forbidden_patterns_must_propagate_to_visual_compiler:
- kit_extension_request_protocol:

Example:

- `visual_language_kit_path: ./visual-language-kit.json`
- `lookdev_gate_path: ./lookdev-gate.yaml`
- `kit_extension_request_protocol: if a new component is needed, block and route back to art-direction`

## 12. User Signature Line

- approved_by:
- approved_at:
- approval_note:
