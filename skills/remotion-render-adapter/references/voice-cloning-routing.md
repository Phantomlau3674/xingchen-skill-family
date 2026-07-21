# Voice Cloning Routing

## Recommended Order

For Chinese-first projects:

1. keep the user's approved recording when it is strong enough
2. use `VoxCPM2` `ultimate cloning` when reference audio and its exact transcript are available
3. use `VoxCPM2` controllable cloning when a clean reference clip exists but exact prompt transcript is not yet ready
4. use Azure Chinese HD or Flash voices when speed matters more than identity matching
4. reserve `MAI-Voice-1` for English-only variants

## Why `VoxCPM2`

`VoxCPM2` is currently the strongest open route in this family for Chinese-oriented voice cloning because it combines:

- multilingual text-to-speech with Chinese support
- controllable cloning from a short reference clip
- higher-fidelity `ultimate cloning` when reference audio and transcript are both provided
- optional LoRA fine-tuning for recurring voice identities

## Recommended Modes

### Controllable Cloning

Use when:

- the project needs a quick clone from a clean reference clip
- you still want to steer speed, emotion, or delivery style

Minimum:

- at least `5s` of clean reference audio

### Ultimate Cloning

Use when:

- the project is recurring
- fidelity matters more than raw speed
- reference audio and its exact transcript are both available
- you can afford a short reference-pool preparation pass before final generation

Validated house pattern:

- cut a `15-25s` mono `16kHz` prompt clip from a clean Chinese narration segment
- store the clip under `reference_pool/*.prompt16k.wav`
- transcribe the same clip into `reference_pool/*.prompt.txt`
- write a summary index such as `reference-pool.json`
- pass the same clip to both `prompt-audio` and `reference-audio` for maximum similarity
- keep the generated target text short for the first verification pass, then scale up once the voice identity sounds right

### LoRA Fine-Tune

Use when:

- the same personal voice will be reused across many videos
- the team can curate `5-10` minutes of cleaner training audio
- a setup and evaluation pass is worth the upfront cost

## Operational Assumptions

- `pip install voxcpm`
- Python `>= 3.10`
- PyTorch `>= 2.5.0`
- CUDA `>= 12.0`
- roughly `8 GB` VRAM for inference

Validated AMD path:

- Ubuntu WSL on Windows is acceptable for AMD laptop-class GPUs when native Windows training support is missing
- ROCm runtime plus PyTorch ROCm must be working before `voxcpm` is attempted
- export `HSA_ENABLE_DXG_DETECTION=1`
- export `LD_LIBRARY_PATH=/opt/rocm/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}`
- one validated configuration used `gfx1151 / AMD Radeon 8060S` with ROCm `7.2.x`, PyTorch `2.9.1+rocm7.2.0`, and `voxcpm 2.0.2`

## Guardrails

- do not use voice cloning for impersonation, fraud, or deceptive public output
- clearly mark AI-generated voice when policy or platform context requires it
- treat long or highly expressive inputs as higher risk and test before final export
- when clone timing changes materially, sync the updated timing back to render planning

## Assembly Log

When `VoxCPM2` is used, record:

- `voice_backend=voxcpm2`
- cloning mode such as `controllable`, `ultimate`, or `lora`
- reference clip path
- prompt clip path when ultimate cloning is used
- transcript source when ultimate cloning is used
- whether the same clip was reused for both prompt and reference roles
- model id or checkpoint
