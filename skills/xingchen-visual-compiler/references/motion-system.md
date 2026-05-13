# Motion System (Fallback Appendix)

Do not use this file as the primary creative driver in Xingchen V2.

First derive motion from:

- `scene_job`
- `dominant_anchor`
- `project-state.json -> script.beat_map` or exported `beat-map.json`
- `motion_verbs`
- proof visibility

Use this appendix only when a scene needs a stable recovery answer.

## Fallback Motion Defaults

- `entrance`: medium-speed reveal with readable easing
- `sustain`: subtle anchor motion that keeps the scene alive
- `exit`: short boundary motion or clean cut
- `emphasis`: small scale or glow support tied to approved beats

## Rules

- never let fallback motion outrun the beat map
- never use motion to hide unreadable proof
- never stack multiple motions unless the scene still has one dominant anchor
