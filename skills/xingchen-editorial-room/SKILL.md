---
name: xingchen-editorial-room
description: Use when a recording-first or source-pack-first short-video idea needs Chinese co-creation, thesis selection, hook drafting, scene ordering, and StoryMother locking before proof, script, and render work.
---

# Xingchen Editorial Room

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

Triggered during `research/proof` and continuing through `story-mother`. The user has a raw idea, transcript, or source pack, and the thesis, hook, or scene order is still unstable. Default language is Chinese. Do not use to choose visual templates, motion verbs, or render tactics — those belong downstream. Do not turn a proof scene into a vibes-only scene at the editorial layer.

## Stage owned

`research/proof` and `story-mother` | writeback: `project-state.json -> mother.story_mother` and `project-state.json -> workflow.approvals[Topic Lock]` and `[StoryMother Lock]`. Exported review surfaces: `editorial-brief.md`, `scene-board.md`.

## Ironclad rules

- INV-TOPIC-LOCK-FIRST and INV-MOTHER-LOCK-BEFORE-VARIANT both gate downstream work; do not hand off until checkpoint 2 is approved.
- Preserve the user's wording when it is stronger than a rewrite.
- Ask for concrete tradeoffs (2–3 options, then narrow) instead of jumping to a full draft.

Other shared rules: see [cross-skill-invariants.md](../xingchen-next/references/cross-skill-invariants.md).

## Skill-local procedure

### StoryMother contract

The mother captures: `thesis`, `audience_promise`, `scene_order`, `scene_cards`, `narration_spine`, `visual_intent`. Each scene card carries: `scene_id`, `scene_job`, `must_believe`, `must_feel`, `must_remember`, one-screen takeaway, `proof_need`.

### Two approval checkpoints

1. **Topic Lock** — confirms thesis, hook, audience framing, and project-level believe / feel / remember.
2. **StoryMother Lock** — confirms the scene board: scene jobs and per-scene believe / feel / remember.

Do not hand off to proof, script, or visual work until checkpoint 2 is approved.

### Discussion order

Discuss in this order, two-to-three options at each step:

1. thesis options
2. hook direction
3. audience framing
4. scene order
5. scene job per scene
6. what each scene must make the viewer believe / feel / remember
7. closing line and takeaway

If a stronger term appears later (during script-polish or visual-direction), reopen editorial review explicitly rather than mutating the locked mother in place.

## Audience-tier default StoryMother shape

当 `sources.source_pack.audience.tier ∈ {lay_scrolling, lay_curious}` 时，**StoryMother 默认形状**采用 [popular-science-narrative-template.md](../xingchen-script-polish/references/popular-science-narrative-template.md) 的 6 段模板：

```
hook → context → proof → peak → payoff → close
```

每段对应一个 `mother.story_mother.scene_order[]` scene（也可拆成多个子 scene 但保持段功能）。默认 `scene_cards[].job` 跟段名一致。默认 `scene_cards[].knowledge_action` 跟模板内的默认值一致。默认能量曲线 `8 → 6 → 7 → 9 → 6 → 5`（满足 `INV-ENERGY-CURVE-REQUIRED`）。

**视觉锚点复用规则**：context 段写的 `analogy_carrier_visual` 必须在 payoff 段重现以完成认知闭环。Editorial review 阶段需要明确标记此复用预期到 `scene_cards[]`。

对 `domain_aware` / `insider` 受众，该模板是建议而非强制。

## References

- [story-mother-and-variants.md](../xingchen-next/references/story-mother-and-variants.md)
- [codex-runbook.md](../xingchen-next/references/codex-runbook.md) — `research/proof` and `story-mother` stages
- [popular-science-narrative-template.md](../xingchen-script-polish/references/popular-science-narrative-template.md) — 6 段 lay-tier AI 科普 StoryMother 模板
