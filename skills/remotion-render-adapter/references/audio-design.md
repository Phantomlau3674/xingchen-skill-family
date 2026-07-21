# Audio Design

## Track Structure

- `voice`: approved narration source, target around `-14 LUFS`, peak around `-1 dBTP`
- `bgm`: background music, nominal bed around `-20 dBFS`
- `sfx`: optional transition or interaction effects, nominal bed around `-16 dBFS`

Final integrated target:

- roughly `-14 LUFS`

## BGM Selection

Map from editorial tone:

- `专业 / 冷静` -> `minimal-piano` or `ambient-electronic`
- `温暖 / 叙事` -> `acoustic-folk` or `warm-strings`
- `紧张 / 悬念` -> `tension-build` or `cinematic-pulse`
- `轻快 / 活泼` -> `upbeat-pop` or `bright-synth`

Preferred libraries:

- project-local `assets/bgm/`
- shared family library `_shared/bgm/`

## Ducking Rule

When voice is active:

- drop BGM to about `-26 dBFS`

When voice is inactive:

- restore BGM to about `-20 dBFS`

Use about `200ms` attack and release windows to avoid abrupt jumps.

## Fade Rule

- BGM fade-in: about `500ms`
- after narration ends, BGM may hold for about `2s`
- final fade-out: about `1s`

## Deterministic Assembly Branches

### Voice Only

- render silent video first
- loudness-normalize voice
- mux video plus normalized voice

### Voice Plus BGM

- render silent video first
- loudness-normalize voice
- trim or loop BGM to project duration
- duck BGM under voice using sidechain compression or equivalent deterministic automation
- run final loudness pass after the mix is formed

## Outputs

- `outputs/final.mp4`
- `outputs/assembly-log.json`
- optional `outputs/audio-mix.log`
