# Xingchen Skill Family

This repository packages the local Xingchen short-video creator skill family as a portable set of Codex/Claude skills.

## Included Skills

- `xingchen-next` - canonical stateful router, project-state schema, approval gates, and workflow contracts.
- `xingchen` - legacy compatibility bridge for older artifact-first projects.
- `xingchen-asset-intake` - source material intake and manifest shaping.
- `xingchen-editorial-room` - topic, angle, and story-mother work.
- `xingchen-proof-pack` - proof and evidence visibility rules.
- `xingchen-script-polish` - script refinement.
- `xingchen-director-board` - source-led visual director board.
- `xingchen-art-direction` - aesthetic system and lookdev policy.
- `xingchen-visual-compiler` - scene specs, visual anchors, prompt packs, and route hints.
- `xingchen-lookdev` - preview audit and lookdev gate checks.
- `xingchen-transcribe` - recording cleanup and transcript generation support.

## Layout

```text
skills/
  xingchen-next/
  xingchen/
  xingchen-asset-intake/
  ...
```

Each skill directory is copied as a full tree, including `SKILL.md`, `agents/`, `references/`, `schema/`, `scripts/`, `templates/`, and visual reference assets when present.

Generated caches and local dependency folders are intentionally excluded.

## Install

Install into the default Codex skill root:

```powershell
.\install.ps1
```

Install into another skill root:

```powershell
.\install.ps1 -TargetRoot "$env:USERPROFILE\.claude\skills"
```

## Validate

After install, validate the `xingchen-next` schema tooling with:

```powershell
node "$env:USERPROFILE\.codex\skills\xingchen-next\schema\validate-project-state.test.mjs"
```

The main workflow should start from `xingchen-next`; the other skills are specialist routes used by that controller.
