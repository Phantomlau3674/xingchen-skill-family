# Aesthetic Review Loop

This loop turns taste into an explicit lookdev review, not a vague gut check.

Use it together with `lookdev-gate.yaml`, `lookdev-gate-result.json`, and the state-backed `LookdevGateResult`.

## Review Inputs

- `project-state.json.visual.visual_policy`
- `project-state.json.visual.material_director_pass`
- approved `StoryMother`
- scene motion specs
- preview slices or stills
- audio preview when the variant is audio-on
- any failed or borderline gate outputs

## Review Order

### 1. Read the taste thesis

Confirm the piece is still serving the approved taste thesis.

- does the frame feel like the intended video
- does the motion support the story's emotional and rhetorical job
- does the opening frame make the right promise
- does the chosen aesthetic mode still fit the content problem
- are the tradeoffs documented in state still visible in the work

### 1.5. Check material-to-picture fidelity

Confirm the preview still follows the approved material director pass.

- did the rendered scene use the source units it promised to use
- did source material stay literal, magnified, rebuilt, textured, or rejected according to plan
- does the visual anchor land before or exactly on the recording keyword beat
- does the selected technical stack still make sense for the scene's material/rhythm reason
- did any renderer candidate replace the scene's purpose with a generic motion idea

### 2. Check the benchmark canon

Compare the candidate against the project's reference set.

- is the voice recognizably on-model
- is the piece drifting into a cheaper or more generic family
- are the references helping the project, not flattening it into imitation
- is the project being judged against its own selected mode rather than a different aesthetic family

### 3. Audit anti-cheapness

Look for cheap patterns that survive technical correctness.

- fake dashboard or fake UI chrome
- decorative glow or empty motion
- narration-echo bubbles
- flat static runs
- mixed chrome families
- keynote-style polish that erases the video's own voice
- AI image artifacts that look synthetic instead of authored
- AI voice or mix artifacts that sound templated instead of intentional

### 4. Test the hero frame

The opening or hero frame must read quickly and decisively.

- one dominant anchor
- clear claim or conflict
- no avoidable clutter
- proof areas stay legible and unwarped
- the frame should still work as a singular image if motion is removed

### 5. Inspect cadence, color, and style continuity

The piece needs a visible rhythm, not a continuous blur.

- opening hook
- middle proof or escalation
- closing release or boundary

Motion should use timing and easing to create direction, not noise.

Also check color-script continuity:

- does the opening / middle / closing arc still read in palette and value
- do subjects or lighting changes preserve the same authorial thread
- does the sequence feel like one piece instead of a set of unrelated shots

### 6. Review sound and voice

If the variant is audio-on, judge sound as part of the aesthetic system.

- does the voice route still fit the thesis
- are breaths, emphasis, and pacing believable
- are key nouns pronounced correctly
- does music support rather than overstate the scene
- is the mix clean without sounding generic or over-processed

### 7. Handle unsupported checks honestly

If the evaluator cannot judge an aesthetic rule with confidence:

- set the relevant result to `manual_review_required`
- mark the rule result as `unsupported` or `not_evaluated`
- record what a human must decide
- do not substitute a generic taste opinion for a rule the machine cannot check

## Finding Shape

Record aesthetic findings with enough detail to support rerender or approval decisions.

- `finding_id`
- `scene_ids`
- `rule_id`
- `status`
- `observation`
- `recommended_action`

Suggested statuses:

- `passed`
- `failed`
- `unsupported`
- `manual_review_required`

## Pass Rule

Pass only when:

- the taste thesis holds
- the selected aesthetic mode still fits the piece
- the benchmark canon is respected
- anti-cheapness checks do not trigger blocking issues
- the hero frame reads cleanly
- cadence and style remain coherent
- sound and voice still fit the chosen quality bar when audio is on
- any unsupported aesthetic rule is explicitly routed to human review

If the machine cannot defend the taste call, it should not pretend to.
