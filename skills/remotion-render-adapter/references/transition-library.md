# Scene Transition Library

The default scene boundary should no longer be an unexamined hard cut.

## Transition Types

### `cut`

- `0ms`
- use when two proof-heavy scenes should connect without visual flourish

### `fade`

- about `300ms`
- use when the scene language changes enough that a neutral bridge helps

### `push`

- about `400ms`
- use when the next scene should feel like a forward step
- may specify a direction

### `match-cut`

- about `400ms`
- use when both scenes share a visual anchor and layout continuity matters

### `mask-wipe`

- about `500ms`
- use when a chapter-like change deserves a stronger handoff

### `text-carry`

- about `600ms`
- use when one critical word or phrase should travel into the next scene

### `chart-morph`

- about `800ms`
- use when both scenes are data-driven and visual continuity beats a hard reset

### `camera-push`

- about `500ms`
- use before a closing argument or payoff scene

## Default Mapping Heuristics

| from | to | recommended |
|---|---|---|
| `statement` | anything | `fade` |
| anything | `closing` | `camera-push` |
| `proof-card` | `proof-card` | `cut` |
| `infographic` | `infographic` | `match-cut` |
| `comparison` | `statement` | `push` |
| anything | `quote` | `mask-wipe` |
| `timeline` | anything | `chart-morph` when continuity exists |

## Audio Coordination

During transitions:

- voice should continue on its approved timing
- if a transition lasts longer than about `400ms`, BGM may dip by around `3dB`
- `push`, `mask-wipe`, and `camera-push` may optionally attach light whoosh-style SFX
