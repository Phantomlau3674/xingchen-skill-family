---
name: xingchen-script-polish
description: Use when an approved short-video outline needs narration polishing, term locking, spoken-vs-screen separation, and state-backed beat mapping before scene direction or render work.
---

# Xingchen Script Polish

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

Triggered during `script` stage, after `xingchen-proof-pack` and before `xingchen-visual-compiler`. The thesis and scene order are approved but the lines still feel rough; the spoken script needs better pacing or clarity; on-screen text duplicates narration; or key terms must stop drifting. Default language is Chinese. Do not embed renderer component names, coordinates, or animation code here.

## Stage owned

`script` | writeback: `project-state.json -> script` (and the Script Lock approval). Exported review surfaces: `spoken-script.md`, `slides.md`, `beat-map.json`, `script-polish-notes.md`. For voice-led projects, route narration pacing to `xingchen-speech-rhythm` before Script Lock and write `script.speech_rhythm_plan`.

## Ironclad rules

- INV-SCRIPT-LOCK-BEFORE-MOTHER: do not hand off to `story-mother` work until Script Lock is approved.
- Do not introduce new claims that are missing from the proof pack.
- Do not let synonyms drift once a term is locked; downstream motion follows term emphasis.
- Do not approve Script Lock for a narration-led project until `script.speech_rhythm_plan` is `planned`, `manual_review_required`, or `not_needed` with a concrete reason.
- Run [language-game-correction.md](../xingchen-next/references/language-game-correction.md) on key terms, metaphors, and taste words before Script Lock. If a term has no public use in voice, screen text, proof, or beat behavior, rewrite it or reopen editorial review.

Other shared rules: see [cross-skill-invariants.md](../xingchen-next/references/cross-skill-invariants.md).

## Skill-local procedure

### Spoken script contract

- keep each scene aligned to the approved scene card
- spoken narration may be richer than on-screen copy, but it must preserve the approved claim
- preserve user phrasing when it is stronger than a rewrite

### On-screen text contract

- short, structural, easy to scan
- do not paste full narration onto the screen
- screen text supports scene intent; it does not duplicate every spoken line

### Beat-map contract

`beat-map.json` is timing truth for downstream motion, not a render recipe. Each scene entry includes:

- `scene_id`
- `emphasis_beats` — each with `cue_text`, `strength`, `offset_hint_ms`, `beat_type`
- `pause_points`
- `keyword_locks`
- optional `subtitle_density`
- optional `rhythm_cues` copied from `script.speech_rhythm_plan`

### Speech rhythm planning

Before Script Lock on voice-led projects, route the draft to `xingchen-speech-rhythm` in plan mode. Use its output to:

- split dense lines before recording
- slow professional terms, definitions, and core judgments
- place breath points after high-density segments
- mark beats that need on-screen scaffolding
- prevent long flat runs where every sentence has the same cadence

Write the complete plan to `script.speech_rhythm_plan`; copy only selected downstream timing hints into `script.beat_map.scenes[].rhythm_cues`.

### Operations

- tighten hook and scene-level wording without changing claim intent
- split narration from display copy
- normalize locked terms across every scene
- map emphasis, pause, and verbal landing points
- turn vague words like `高级`, `电影感`, `黑箱`, `飞轮`, `像人讲的`, and `更丰富` into stable spoken wording, display-copy roles, proof behavior, or beat-map cues
- record deliberate tradeoffs in `script-polish-notes.md`

If the thesis must change after approval, reopen editorial review explicitly rather than mutating the locked script in place.

## Audience-tier default narrative

当 `sources.source_pack.audience.tier ∈ {lay_scrolling, lay_curious}` 时，**默认套用** [popular-science-narrative-template.md](./references/popular-science-narrative-template.md) 的 6 段叙事框架：

```
[Hook 5-10s] → [Context 15-30s] → [Proof 30-60s] → [Peak 15-30s] → [Payoff 15-30s] → [Close 5-10s]
```

该模板绑定：

- 每段时长默认值
- 每段 `knowledge_action` 默认值
- 每段 `asset_kind` 默认值（向下传给 director-board）
- 能量曲线形状（8 → 6 → 7 → 9 → 6 → 5，满足 `INV-ENERGY-CURVE-REQUIRED`）
- hero frame 落点（peak 段，满足 `INV-HERO-FRAME-REQUIRED`）
- 视觉锚点复用规则（context 段的 `analogy_carrier_visual` 必须在 payoff 段重现）

对 `domain_aware` / `insider` 受众，该模板是**建议而非强制**——脚本可以采用其它叙事结构。

## References

- [codex-runbook.md](../xingchen-next/references/codex-runbook.md) — `script` stage
- [language-game-correction.md](../xingchen-next/references/language-game-correction.md) — term/metaphor correction before Script Lock
- [popular-science-narrative-template.md](./references/popular-science-narrative-template.md) — 6 段 lay-tier AI 科普叙事模板
