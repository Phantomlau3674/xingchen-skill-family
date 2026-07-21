# Xingchen Skill Family

Xingchen is a portable skill family for evidence-led, narration-driven short-video production. `xingchen-next` is the Lean router; specialist skills own scripting, visual direction, editorial collage, lookdev, rendering, transcription, and optional spatial or speech-rhythm routes.

## 2026-07-21 release

This release synchronizes the current Lean family and adds the production-tested `xingchen-vox-collage` branch.

- five Lean stages: `brief-evidence -> script-beats -> scene-production -> preview-revision -> final-delivery`
- two blocking decisions only: `Content Lock` and `Preview Lock`
- real-audio timing and `script.timeline_revision` as the structural baseline
- hero-frame-first editorial collage with separate assets and code-owned exact text
- strict state/spec synchronization and per-scene playable evidence
- blind-review checks for caption-only motion, phone-size semantic scale, and adjacent-scene continuity anchors
- bounded generated-video use; deterministic Remotion remains responsible for exact text, proof, timing, and final assembly

The production case behind these changes is documented in [docs/2026-07-21-vox-production-retrospective.md](docs/2026-07-21-vox-production-retrospective.md).

## Included skills

- `xingchen-next` — Lean router, state, approval, validation, and review contracts
- `xingchen-editorial-room`, `xingchen-proof-pack`, `xingchen-script-polish` — argument, evidence, and narration
- `xingchen-director-board`, `xingchen-art-direction`, `xingchen-visual-compiler` — scene responsibility, visual language, and implementation contracts
- `xingchen-vox-collage` — original editorial paper-collage branch with strict visual evidence
- `xingchen-lookdev` — candidate comparison, blind full-piece review, phone review, and Preview Lock evidence
- `remotion-render-adapter` — deterministic Remotion implementation and render checks
- `xingchen-asset-intake`, `xingchen-transcribe`, `xingchen-speech-rhythm`, `xingchen-3dgs-retrieval` — on-demand input and specialist routes
- `xingchen` — legacy compatibility bridge

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

Run the family and Lean-state test suites:

```powershell
npm --prefix .\skills\xingchen-next test
npm --prefix .\skills\xingchen-next run audit:family
```

Run the Vox branch tests:

```powershell
$env:PYTHONUTF8 = "1"
python -m unittest discover -s .\skills\xingchen-vox-collage\tests -v
```

Validate a real Lean project and Vox branch:

```powershell
node .\skills\xingchen-next\schema\validate-lean-project-state.mjs <project-state.json>
python .\skills\xingchen-vox-collage\scripts\validate_vox_branch.py <project-root>
```

## Distribution boundary

- Project videos, cloned voices, user photos, generated project assets, provider receipts, and local model files are not included.
- Local Stitch reference archives are intentionally excluded because public visibility is not a substitute for redistribution rights. Their manifest remains only as a local-reference contract.
- Creator-avatar and runtime paths in the local workflow are installation-specific. Configure them for the target machine before production.

## License

See `LICENSE`. The license covers repository content that the copyright holder is entitled to license; it does not grant rights to third-party brands, source media, models, or locally excluded reference archives.
