# SkillOpt-Style Evaluation Lane

This lane adapts the useful part of SkillOpt to Xingchen Next: do not trust a
skill edit because it sounds better. Accept a skill or adapter change only after
it improves a small, repeatable task set.

The full Microsoft SkillOpt framework can be used later for automated training.
This local lane is the lightweight version that fits the current Xingchen
workflow and the user's co-located project folders.

## What It Optimizes

Optimize skill behavior against real Xingchen failures:

- director board misses the source or recording rhythm
- visual policy becomes taste words without scene responsibility
- scene motion specs lose safe regions, proof regions, or camera purpose
- render plans compile but produce still, blank, distorted, or unreadable output
- adapter runs create files without traceable state writebacks
- knowledge writeback silently skips a reusable lesson

Do not optimize for longer instructions. Optimize for fewer repeated runtime
breaks.

## Task Set Shape

Each eval item should live in a project-local folder, ideally next to the
project's videos and process files:

```text
project/
  project-state.json
  render-plan.json
  video-project.json
  visual-director-board.json
  visual-director-board.md
  art-direction.md
  lookdev-gate.yaml
  inputs/
  public/
  outputs/
```

Minimum item metadata:

```json
{
  "id": "short-stable-id",
  "project_root": "C:/path/to/project",
  "task_type": "director_board | render_plan | remotion_runtime | lookdev_audit | writeback",
  "entry_state": "project-state.json",
  "expected_checks": [
    "state_validator_passes",
    "render_plan_assets_exist",
    "vertical_still_nonblank",
    "subtitle_safe_region_present"
  ],
  "known_failure": "what used to break",
  "acceptance_note": "what must be better after the skill edit"
}
```

Start with 20 to 50 items. Add a new item whenever a real project breaks in a
way that should not recur.

Historical Douyin projects are observation samples unless the user explicitly
asks to migrate them. Use them to learn distribution and detect repeated
failure shapes, but do not treat old missing fields as required repair work.
Fresh project fixtures and current validators are the acceptance gate.

Visual owner skills are allowed to be heavier than router skills. Do not score a
director-board, art-direction, visual-compiler, or lookdev skill down just
because it carries substantial design judgment. Score it down only when the
weight lives in the wrong owner, blocks progressive disclosure, or lets a
downstream adapter override upstream visual intent.

## Acceptance Gate

For any non-trivial edit to `xingchen-next`, `xingchen-*`, or
`remotion-render-adapter`:

1. Run the local static tests for the touched skill.
2. Run the state validator on every changed fixture or target project.
3. Run the Remotion runtime doctor for render-bound projects.
4. Compare failures against the previous baseline.
5. Accept the edit only when it removes a real failure or preserves all known
   checks while adding needed coverage.

Do not accept an edit that only adds more prose while the same runtime break
continues to pass silently.

## Vox/Remotion Visual Influence Regression Items

When a skill edit touches [vox-remotion-visual-style.md](./vox-remotion-visual-style.md), `visual_style_influence`, editorial collage rules, Remotion proof ownership, or lookdev gates, add or refresh a small regression item before accepting the edit.

Minimum fixture shape:

```json
{
  "id": "vox-remotion-style-contract",
  "task_type": "lookdev_audit",
  "entry_state": "project-state.json",
  "known_failure": "Vox-style visual influence is recorded as prose but not enforced by scene contract or lookdev gates.",
  "expected_checks": [
    "visual_style_influence_recorded",
    "editorial_world_system_recorded",
    "scene_contract_trace_present",
    "remotion_proof_ownership_rule_present",
    "lookdev_gate_contains_full_vox_rule_set",
    "no_vox_renderer_family",
    "no_generated_plate_text_ownership"
  ],
  "acceptance_note": "The style influence remains optional, does not create a renderer family, and produces the full conditional Vox/Remotion lookdev rule set across scene contract, world continuity, layer stack, proof ownership, OCR, mobile readability, safe zones, foreground proof, marker semantics, beat sync, motion density, final hold, prop controls, and proof source trace."
}
```

Static assertions for the fixture:

- `visual.visual_policy.visual_style_influence.source` is `vox_remotion_visual_style`.
- `visual.visual_policy.editorial_world_system` records background, palette, cutout, marker, proof ownership, and safe-area policy.
- Every non-rest scene has a board-level scene contract expressed through existing layers: world base, mid cutouts, foreground proof carrier, Remotion overlay, voiceover beat, safe zones, and prop controls.
- `lookdev-gate.yaml` contains the full conditional rule set: `scene_contract_check`, `world_continuity_check`, `layer_stack_check`, `remotion_proof_ownership_check`, `bitmap_text_ocr_check`, `mobile_downsample_check`, `safe_zone_overlap_check`, `foreground_dominance_check`, `red_marker_semantics_check`, `beat_sync_check`, `motion_density_check`, `final_hold_frame_check`, `prop_control_smoke_test`, and `proof_source_trace_check`.
- `render.scene_motion_specs[]` does not use `renderer_family` values such as `vox_renderer`, `vox_remotion`, or `editorial_collage_renderer`.
- Generated image or video plates do not own Chinese text, data labels, subtitles, proof UI, or audited claims.
- Unsupported visual/aesthetic checks become `manual_review_required`; they do not silently pass.

This regression item is intentionally contract-level. It should run during skill maintenance without launching Remotion unless the user explicitly asks for a project retest.

## Scorecard

Track each eval run with a compact scorecard:

```json
{
  "run_id": "2026-05-31-xingchen-skillopt-lite",
  "skill_snapshot": "xingchen-next@local",
  "items_total": 24,
  "items_passed": 21,
  "new_failures": [],
  "fixed_failures": ["render-plan-missing-asset-detected"],
  "blocked_items": [
    {
      "id": "project-017",
      "reason": "source video missing from project folder"
    }
  ],
  "accepted": true
}
```

Keep the scorecard with the project or under a future eval directory. If the
same failure repeats, promote it into a validator, runtime-doctor check, or
lookdev audit rule instead of adding another paragraph to the skill.

## Fast Local Commands

From `..`:

```powershell
npm test
npm run audit:family
powershell -ExecutionPolicy Bypass -File .\scripts\check-local-runtime.ps1
node .\schema\validate-project-state.mjs C:\path\to\project\project-state.json
npm run audit:project -- --project-root C:\path\to\project
npm run audit:project -- --project-root C:\path\to\project --runtime-doctor
```

From the Remotion harness:

```powershell
npm run doctor -- --project-root C:\path\to\project
npm run doctor:still:vertical -- --project-root C:\path\to\project --frame 30
```

The still check is a runtime check. Use it during project retest or explicit
render debugging, not during pure skill-edit housekeeping unless the user asks
to run render checks.

## Writeback Rule

After a project ships or a runtime failure is fixed, write one concise lesson:

- what broke
- which state path or artifact should have caught it
- which validator, doctor, or reference now catches it
- whether the lesson belongs in stevenmind, a Xingchen reference, or an adapter
  script

This is the local SkillOpt loop: real failure, small test, bounded skill edit,
validated improvement, durable writeback.
