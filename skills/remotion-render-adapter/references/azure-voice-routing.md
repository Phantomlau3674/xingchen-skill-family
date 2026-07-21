# Azure Voice Routing

## Purpose

This note keeps `xingchen` voice choices aligned with current Azure capabilities.

It exists to prevent a Chinese-first short-video pipeline from accidentally routing into an English-only premium voice path just because the voice sounds newer.

## Recommended Default

- user recording first
- `VoxCPM2` second when Chinese voice cloning or personal timbre matching matters
- Chinese Azure Speech voice after that when fast synthetic narration matters more than identity matching
- `MAI-Voice-1` only for explicit English narration or localized English exports

## Microsoft `MAI-Voice-1`

Use when all of the following are true:

- the project needs synthesized narration
- the target language is English
- preview risk is acceptable
- the team can provision the required Azure Speech region

Operational assumptions:

- region: `East US`
- voice family: `en-US`
- style control: use SSML styles deliberately, not at random

Good fits:

- English promo cuts
- product trailers
- premium English explainers that need stronger emotional range than standard neural voices

Bad fits:

- default Chinese narration
- Chinese proof-heavy explainers
- projects that must stay in generally available voice infrastructure only

## Chinese Route

When the target language is Chinese:

- keep the user's own approved recording if available
- prefer `VoxCPM2` first when the goal is to preserve or clone a specific Chinese voice identity
- otherwise prefer Azure Speech Chinese voices, especially newer HD or Flash variants when the project needs higher expressiveness with less setup
- pick the voice after script lock, because tone choice depends on the approved thesis and pacing

Practical starting points:

- `zh-CN-Xiaoxiao2:DragonHDFlashLatestNeural` for expressive female narration
- `zh-CN-Xiaochen:DragonHDFlashLatestNeural` for steadier explainers or review-style voiceover
- `zh-CN-Yunhan:DragonHDFlashLatestNeural` when the copy needs softer emotional range
- `zh-CN-YunjianNeural` when a more documentary or commentary tone fits better than a chatty style

If the project needs bilingual delivery:

- keep Chinese and English renders as separate voice routes
- use Chinese Azure Speech for the Chinese master
- use `MAI-Voice-1` only for the English export variant

## Assembly Log

If synthesized voice is used, record at least:

- `voice_backend`
- `voice_id`
- `voice_locale`
- `preview_or_ga`
- `ssml_style`
- `source_text_version`

This keeps rerenders reproducible and makes it obvious when timing changed because the voice backend changed.
