# Adversarial Flow

This SOP only runs after `creative-ignition.md` is complete.

Goal:

- force three mutually exclusive direction candidates
- force visible criticism
- force a kill decision instead of a vague blend

## Shared Inputs

- approved `project-state.json`
- approved `StoryMother`
- approved script layer from state
- exported `spoken-script.md`, `slides.md`, or `beat-map.json` only when a review pack already exists
- `anti_reference`
- `Ignition` section from `art-direction.md`
- `precedent-gallery.md`
- `forbidden-patterns.md`

## Mutual Exclusion Test

Before critic starts, verify:

- `chrome_family` differs across A/B/C
- the main metaphor differs across A/B/C
- the attack angle on `anti_reference` differs across A/B/C
- A/B/C are not merely palette swaps

If any pair fails, proposer must rewrite.

## Similarity Test

Critic must reject any candidate that is too close to a precedent or to another candidate.

Working rule:

- if visual world similarity feels above 60%, treat it as derivative
- derivative means kill, not "make it a bit fresher"

## Role 1: Proposer

Prompt skeleton:

```text
You are Proposer.

Inputs:
- approved project state
- approved story mother
- approved script layer or review-pack export
- anti_reference
- ignition output with 5 candidate worlds

Task:
Generate exactly 3 mutually exclusive meta_concept candidates.

Rules:
- each candidate must grow from a different ignition world
- each candidate must use a different chrome_family
- each candidate must explain why the form is the best container for this thesis
- do not reuse precedent-gallery as a ready-made answer
- do not propose a generic tech or keynote direction

For each candidate output:
- codename
- meta_concept
- chrome_family
- motion_signature
- why_this_world_fits_the_thesis
- why_it_beats_the_anti_reference
```

## Role 2: Critic

Prompt skeleton:

```text
You are Critic.

Task:
Kill weak or derivative candidates.

For each candidate write:
- fatal_weakness
- forbidden_pattern_risk
- why_a_viewer_stops_scrolling
- similarity_to_precedent (low/medium/high)
- verdict: keep or kill

Rules:
- do not say "could be improved"
- identify the concrete way it would fail on screen
- if similarity to a precedent is above 60%, kill it
- if two candidates are basically the same family with different colors, kill one or both
```

## Role 3: Arbiter

Prompt skeleton:

```text
You are Arbiter.

Task:
Pick one direction and kill the other two.

Rules:
- no blend decisions
- no "take A's palette and B's motion"
- must cite anti_reference again before final choice
- must explain why the winner is the strongest thesis-to-form bond

Output:
- chosen_candidate
- chosen_meta_concept
- why_it_wins
- why_other_1_is_killed
- why_other_2_is_killed
```

## Output Contract

Write all three roles into `art-direction.md -> ## Decision Trace`.

Minimum structure:

```markdown
## Decision Trace

### Proposer
...

### Critic
...

### Arbiter
...
```

## Failure Conditions

The adversarial flow has failed if any of these happen:

- only one candidate exists
- two candidates share a family and differ only in color or texture
- critic writes soft notes instead of fatal weaknesses
- arbiter chooses a hybrid
- anti_reference is never revisited at decision time
