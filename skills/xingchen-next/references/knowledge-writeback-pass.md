# Knowledge Writeback Pass

Every finished Xingchen project should leave behind reusable knowledge. The goal is not a long retrospective; it is a small, immediate decision pass that prevents visual discoveries, script lessons, and workflow fixes from staying trapped in one project folder.

## When To Run

Run after `publish -> review`, and also after any major failed lookdev pass that teaches a durable lesson.

Do not wait for a weekly cleanup. The pass should produce a short candidate list, get confirmation when needed, and write immediately.

## Candidate Types

Write back only material that can help a future project:

- Successful scene pattern: a concrete visual composition, motion primitive, proof treatment, or transition that worked.
- Failed visual route: a route that looked cheap, fake, illegible, too PPT-like, or too hard to implement.
- Reusable source method: how to find, license, register, or use a class of assets.
- Technical contract: validator field, renderer route, package rule, or render constraint.
- Creator style insight: stable speaking rhythm, humor, pacing, screen-text taste, or audience expectation.

Do not write back one-off project trivia, temporary filenames, or scene IDs unless they serve as a case study.

## Routing

Use the stevenmind domain rules:

- `04 Wiki\视频创作\案例\对标\`: external benchmark case studies compiled from `03 来源\抖音拆解\`.
- `04 Wiki\视频创作\案例\自制\`: user-made video retrospectives from `C:\Users\liuzh\Videos\douyin\...`; do not mirror raw self-made project assets into `03 来源`.
- `04 Wiki\视频创作\Hook 设计\`: hook, attention, first-three-seconds, and retention methods.
- `04 Wiki\视频创作\视觉美学\`: taste standards, anti-PPT rules, visual reference libraries, composition patterns, and source-to-picture methods.
- `04 Wiki\视频创作\动效语法\`: explainer animation grammar, motion primitives, transition patterns, and timing rules.
- `04 Wiki\视频创作\`: video-only pacing, recording rhythm, article-to-video bridge, and other existing video pages when they do not fit a more specific child directory.
- `04 Wiki\技术栈\`: tool/workflow summaries, decision matrices, and case links for Remotion, R3F, HyperFrames, Blender/ComfyUI, render adapters, and asset pipelines.
- `04 Wiki\共享方法论\`: only cross-medium methods that are small and genuinely reusable. Keep this directory under its page cap.
- Local skill `references/`: executable contracts, validator rules, schemas, full technical contracts, runtime commands, and state-field definitions only.

Accepted stevenmind writes should be executed or verified through `obsidian-vault-maintainer-lite`. Before writing across domains, use:

```bash
python C:\stevenmind\stevenmind\tools\vault_manager.py read-check --root C:\stevenmind\stevenmind --skill obsidian-vault-maintainer-lite --page "{target_page}"
```

After an accepted vault write, refresh indexes/logs through the maintainer workflow so `index-public.md`, `index-by-domain.md`, and the decision log stay current.

## Output Shape

The project review should include:

```json
{
  "knowledge_writeback": {
    "status": "completed|manual_review_required|not_needed",
    "candidate_count": 0,
    "accepted_writes": [],
    "rejected_candidates": [],
    "vault_paths": [],
    "skill_reference_paths": [],
    "asset_registry_updates": []
  }
}
```

Human review surface:

```markdown
# Knowledge Writeback Candidates

## Accepted

- title:
- target:
- why reusable:
- source project evidence:
- write path:

## Rejected

- title:
- reason:
```

## Decision Rule

If the writeback is about "how to think", send it to stevenmind. If it is about "what the machine must validate or execute", keep it in the relevant skill reference and link from the wiki summary. If it is about a reusable visual asset, update the global asset registry.

## Required Minimum

For each published or seriously attempted video, at least one of these must be explicitly marked:

- `accepted_writes[]` has one entry.
- `rejected_candidates[]` explains why nothing should be written.
- `status = not_needed` with a concrete reason.

Silent completion is not allowed.
