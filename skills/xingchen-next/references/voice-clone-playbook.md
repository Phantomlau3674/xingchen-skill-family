# Voice Clone Playbook

Use this playbook when a Xingchen Next project needs cloned or identity-matched narration.

This file exists so voice-routing knowledge stays visible from the family shell instead of being buried only in renderer notes.

Detailed execution notes still live in:

- [voice-cloning-routing.md](../../remotion-render-adapter/references/voice-cloning-routing.md)
- [amd-wsl-voxcpm2.md](../../remotion-render-adapter/references/amd-wsl-voxcpm2.md)

## Recommended Order

For Chinese-first projects:

1. keep the user's approved real recording when it is already strong enough
2. use `VoxCPM2` `ultimate cloning` when clean reference audio and its exact transcript both exist
3. use `VoxCPM2` controllable cloning when a clean reference clip exists but transcript prep is not ready
4. use Azure Chinese HD or Flash voices when speed matters more than identity
5. reserve `MAI-Voice-1` for English-only variants

## Default House Pattern

### Controllable Cloning

Use when:

- the clone is needed quickly
- you want identity approximation, not maximum fidelity
- you still need speed or emotion steering

Minimum:

- at least `5s` of clean reference audio

### Ultimate Cloning

Use when:

- the voice identity matters
- the project is recurring
- the team can prepare a small reference pool

Validated house pattern:

- cut a `15-25s` mono `16kHz` Chinese prompt clip
- store it under `reference_pool/*.prompt16k.wav`
- transcribe that same clip into `reference_pool/*.prompt.txt`
- index the pool in `reference-pool.json`
- pass the same clip to both `prompt-audio` and `reference-audio`
- generate one short verification sample first
- scale to full narration only after the identity is approved

### LoRA Fine-Tune

Use when:

- the same voice will recur across many videos
- the team can curate `5-10` minutes of clean audio
- setup cost is justified

Do not jump to LoRA before `ultimate cloning` has already failed or proven insufficient.

## Operational Notes

- Python `>= 3.10`
- PyTorch `>= 2.5.0`
- CUDA `>= 12.0` or validated AMD WSL ROCm path
- roughly `8 GB` VRAM for inference

AMD Windows route:

- Ubuntu WSL is acceptable
- validate ROCm + PyTorch before `voxcpm`
- export `HSA_ENABLE_DXG_DETECTION=1`
- export `LD_LIBRARY_PATH=/opt/rocm/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}`

## Writeback Rule

When cloned voice is used, preserve these facts in project review or assembly logs:

- `voice_backend`
- cloning mode
- reference clip path
- prompt clip path when applicable
- transcript source
- whether prompt and reference reused the same clip
- checkpoint or model id

## Guardrails

- do not use cloned voice for impersonation, fraud, or deception
- when clone timing changes materially, sync timing truth back into script and render planning
- always sample-test first before generating the whole piece
