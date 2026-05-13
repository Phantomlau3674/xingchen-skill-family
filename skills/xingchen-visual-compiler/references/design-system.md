# Xingchen Design System

## Grid

Base unit: `8px`

- `xs=4`
- `sm=8`
- `md=16`
- `lg=24`
- `xl=32`
- `2xl=48`
- `3xl=64`

All spacing should snap to the 8px rhythm unless there is a strong visual reason not to.

Defaults:

- `card-padding=24`
- `stage-padding-y=32`
- `stage-padding-x=80`
- `element-gap=16`
- `list-item-gap=12`
- compact list gap may drop to `8`
- `scene-gap=0`

Do not invent values such as `18`, `34`, or `36` when a system value already exists.

## Type Scale

Lock the scale to these six levels.

| level | size | weight | line height | letter spacing | purpose |
|---|---:|---:|---:|---:|---|
| hero | 88px | 700 | 1.10 | -0.02em | manifesto openers |
| headline | 72px | 700 | 1.15 | -0.01em | scene title |
| subhead | 48px | 500 | 1.25 | 0 | supporting takeaway |
| body | 32px | 400 | 1.50 | 0 | explanatory copy |
| caption | 24px | 400 | 1.40 | 0 | source or note |
| label | 20px | 600 | 1.30 | 0.04em | chips and category labels |

CJK correction:

- multiply nominal font size by `0.92`
- add `0.1` to line height when the line is CJK-heavy
- target `12-16` CJK characters per line
- target about `28` Latin characters per line

## Safe Area

### 9:16 (`1080x1920`)

- top: `96px`
- bottom: `200px`
- left: `56px`
- right: `56px`
- safe content region: `968 x 1624`

### 16:9 (`1920x1080`)

- top: `64px`
- bottom: `96px`
- left: `96px`
- right: `96px`
- safe content region: `1728 x 920`

### 1:1 (`1080x1080`)

- top: `64px`
- bottom: `64px`
- left: `64px`
- right: `64px`
- safe content region: `952 x 952`

Subtitle-safe addition:

- reserve an extra `160px` at the bottom
- subtitles must not enter the protected board-safe zone by default

## Color Usage

- main text: `ink`
- secondary text: `ink@62%`
- weak text: `ink@38%`
- emphasis: `accent`
- weak emphasis: `accent@20%`
- emphasis glow: `accent@50%`
- divider: `ink@8%`
- card background: stage shifted by about `4%` brightness
- dark mask: `#000 @ 40-60%`

Do not hardcode ad hoc colors inside scene packaging when the preset palette already owns the choice.

## Card And Container Base

- content card radius: `12`
- primary container radius: `20`
- pill radius: `999`
- border: `1px ink@12%`
- `shadow-sm: 0 4px 12px rgba(0,0,0,0.12)`
- `shadow-md: 0 8px 24px rgba(0,0,0,0.20)`
- `shadow-lg: 0 16px 48px rgba(0,0,0,0.32)`

## Scene Layout Bias

- `manifesto`: title in top 25%, hero visual in center 50%, support line in bottom 25%
- `briefing`: title in top 15%, structure grid in center 70%, source or footer in bottom 15%
- `proof-sheet`: evidence in center 60%, annotation overlay above, source footer in bottom 10%
- `closing`: core line around center 40%, CTA in bottom 20%

## Recording-First Composition Defaults

- each scene should have one dominant anchor that owns the first read
- subtitles and lower-thirds should support the scene, not define its silhouette
- keep the dominant anchor out of the protected subtitle region by default
- if a spoken keyword is the scene payoff, the anchor should be visually ready just before the line lands
- scenes may reuse recurring motifs, but each reuse should express a different stage, argument, or emotional state
- reserve the most theatrical composition moves for the hero-scene shortlist, not for every scene
- when in doubt, simplify toward one strong frame instead of adding another explanatory layer

## Evidence Scene Styling

- screenshot container radius: `8px`
- border: `1px rgba(255,255,255,0.12)`
- shadow: `0 8px 24px rgba(0,0,0,0.3)`
- highlight box: accent with roughly 20% fill
- source label: caption size, 50% opacity, bottom-right alignment
