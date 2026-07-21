# Xingchen Family Dispatch Contract

`xingchen-next` is the router, not the workbench. In Lean mode it loads child
skills only when their specialization is needed. It must not turn every
available owner, adapter, or reference into a mandatory lane.

In Extended mode it may enforce formal stage ownership, handoffs, and receipts.

## Problem This Prevents

The family fails when the router absorbs every rule:

- child skills stop being loaded
- visual planning, art direction, compilation, lookdev, and render checks blur
  into one conversation
- adapter routes such as Remotion, HyperFrames, GSAP, Spark, and AI video become
  taste choices instead of state-backed downstream decisions
- runtime failures are fixed by adding prose to `xingchen-next` instead of
  strengthening the owner skill, validator, or adapter check

Old projects may be used as observation samples only. They should not be
migrated just to satisfy the current contract.

## Visual Weight Rule

Visual design is intentionally heavier than routing. Do not optimize the family
by thinning out picture thinking, taste judgment, scene responsibility, or
lookdev criteria. Optimize by moving that weight into the correct owner:

- `xingchen-director-board` can be rich because it owns source rhythm, scene
  picture responsibility, Visual Discovery, and scene-edge continuity.
- `xingchen-art-direction` can be rich because it owns whole-piece taste,
  anti-reference, visual language, and lookdev red lines.
- `xingchen-visual-compiler` can be rich because it preserves board intent while
  compiling concrete components, motion specs, adapter candidates, and traces.
- `xingchen-lookdev` can be rich because it judges the actual preview against
  meaning, readability, and craft.

The smell is not "visual owner has many rules." The smell is "the router can do
visual owner work without loading the visual owner skill" or "a downstream
adapter rewrites visual intent."

## Need-First Dispatch Rule

For Lean project work:

1. Identify the current Lean stage and the next concrete deliverable.
2. Load only the child skill needed for that deliverable.
3. Read only the references needed for the current decision.
4. Write film-changing decisions to Lean state.
5. Validate the state and inspect actual preview evidence when available.

Do not stop merely because an optional owner skill is unavailable. Stop only
when the missing capability prevents truthful evidence, implementation, or
preview validation.

## Owner Map

| Work | Owner | Router may do | Router must not do |
|---|---|---|---|
| asset/source intake | `xingchen-asset-intake` | require source trace fields | infer OCR/source truth from memory |
| audio/transcript | `xingchen-transcribe` | require correction evidence | design visuals from raw audio |
| topic/proof/script seed | `xingchen-editorial-room`, `xingchen-proof-pack` | enforce proof trace | rewrite proof meaning downstream |
| narration polish | `xingchen-script-polish` | require Content Lock | write final narration as visual copy |
| director board | `xingchen-director-board` | require scene cognitive jobs | invent scenes from renderer fashion |
| whole-piece art direction | `xingchen-art-direction` | require policy export paths | choose per-scene components |
| selected Vox editorial collage branch | `xingchen-vox-collage` | require explicit style selection and scene truth | turn collage into a global default or rewrite proof/story |
| scene motion specs/candidates | `xingchen-visual-compiler` | validate traces | implement scenes from generic renderer ideas |
| render-pack graph | `video-project-graph` | require export paths | create parallel render truth |
| lookdev | `xingchen-lookdev` | require actual preview result | silently approve previews |
| final render | `remotion-render-adapter` | require render job trace | let adapters rewrite story/proof/director board |
| review/writeback | `obsidian-vault-maintainer-lite` + router | route durable lessons | edit old projects to match new rules |

## Handoff Receipt

Extended-mode child runs should leave a compact receipt in the state or project
artifacts. Lean mode records a receipt only when a handoff, external adapter, or
debugging need justifies it. Prefer existing fields before adding new ones.

Minimum receipt:

```json
{
  "owner_skill": "xingchen-director-board",
  "stage": "visual-direction",
  "input_refs": ["project-state.json", "source-pack"],
  "output_refs": ["visual-director-board.md", "visual-director-board.json"],
  "state_paths_written": ["visual.director_board"],
  "validator_or_audit": "node schema/validate-project-state.mjs project-state.json",
  "status": "completed"
}
```

Do not create a second truth file just for receipts when an existing state path
already records the same facts.

## Router Edit Rule

When a failure repeats, patch the narrowest owner:

- missing stage routing -> `xingchen-next`
- missing scene design thinking -> `xingchen-director-board`
- weak whole-piece taste -> `xingchen-art-direction`
- weak or incomplete selected Vox editorial collage mechanism -> `xingchen-vox-collage`
- missing implementation trace or GSAP/HyperFrames use -> `xingchen-visual-compiler`
  or `plugin-adapter-policy.md`
- Remotion props/assets/typecheck/nonblank failures -> `remotion-render-adapter`
- preview quality misses -> `xingchen-lookdev`

Do not add another paragraph to `xingchen-next` if a child skill or validator
can own the rule.
