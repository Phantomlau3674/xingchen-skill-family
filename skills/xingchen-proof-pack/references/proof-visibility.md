# Proof Visibility

This file decides how proof must be seen, not just whether proof exists.

## Visibility Levels

### `pixel-readable`

Use when the claim depends on actual visible pixels.

Requirements:

- proof pixels stay large enough to read
- subtitles avoid the proof region
- do not shrink the proof into a decorative corner card
- motion may guide attention, but must not blur the evidence away

### `presence-only`

Use when the audience only needs to recognize that the evidence exists.

Requirements:

- the asset is clearly identifiable
- readability is helpful but not mandatory
- the scene may give more room to headline or emotion

### `abstractable`

Use when the claim can be visualized structurally without showing literal pixels.

Requirements:

- proof truth is still respected
- abstraction must not imply evidence the source does not carry

## Forbidden Shortcuts

- turning `pixel-readable` proof into a thumbnail
- placing subtitles over proof-critical pixels
- using heavy blur, bloom, or fake device frames to hide weak proof
- calling an abstracted proof scene "literal proof"
