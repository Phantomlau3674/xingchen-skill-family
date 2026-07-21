---
name: xingchen-proof-pack
description: Use when topic notes, transcripts, screenshots, or external sources need explicit evidence boundaries, proof visibility, and state-backed proof rules before scene direction or render work.
---

# Xingchen Proof Pack

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

Triggered during `research/proof` after `xingchen-editorial-room` locks the scene board, before `xingchen-script-polish`. Use when a topic needs screenshot-backed or citation-backed claims, the source pack feels too raw for scene writing, or evidence must be separated from decoration. Do not let `decorative` or `inference-only` evidence masquerade as literal proof.

## Stage owned

`research/proof` | writeback: `project-state.json -> proof`. Exported review surface: `proof-pack.json`.

## Ownership in family

This skill is the canonical owner of [proof-visibility.md](./references/proof-visibility.md). Downstream skills (`xingchen-visual-compiler`, `xingchen-lookdev`, `remotion-render-adapter`) reference proof-visibility decisions written here; they do not redefine `evidence_type`, `visibility_requirement`, `abstraction_room`, or `forbidden_shortcuts`.

## Ironclad rules

- INV-PROOF-FRAME-STRATEGY: every render-bound proof scene must end up with explicit `frame_strategy` and `distortion_policy` set downstream.
- If a proof item says `abstraction_room = none`, downstream cannot replace it with a generic infographic.
- If a scene requires `pixel-readable` proof, downstream must preserve readability and safe space.

Other shared rules: see [cross-skill-invariants.md](../xingchen-next/references/cross-skill-invariants.md).

## Skill-local procedure

### Evidence model

- `literal` — the asset directly proves the claim
- `decorative` — the asset supports tone or context but does not prove the claim
- `inference-only` — the claim is a reasonable conclusion from sources, not something the asset itself proves

### Proof visibility

Each proof item also decides how the audience must encounter the evidence:

- `pixel-readable` — key pixels must be readable on screen
- `presence-only` — the audience only needs to recognize that the asset exists
- `abstractable` — the claim may be visualized structurally instead of showing literal pixels

### Minimum contract per proof item

`scene_id`, `claim_id`, `asset_id`, `evidence_type`, `source_ref`, `allowed_usage`, `visibility_requirement`, `abstraction_room` (`none` / `limited` / `open`), `forbidden_shortcuts`.

### Operations

- map claims to allowable evidence
- mark asset boundaries clearly
- reject evidence that is too weak for a literal proof scene
- decide whether the proof must be read, merely noticed, or may be abstracted
- record what downstream layers are forbidden to do with the asset
- make proof visibility an explicit decision before visual packaging starts

Do not collapse all proof into the same screenshot-card treatment.

## References

- [proof-visibility.md](./references/proof-visibility.md) — house rules
- [codex-runbook.md](../xingchen-next/references/codex-runbook.md) — `research/proof` stage
