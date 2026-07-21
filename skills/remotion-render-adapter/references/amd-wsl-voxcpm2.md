# AMD WSL VoxCPM2 Notes

Use this note when the project wants `VoxCPM2` on an AMD Windows machine instead of NVIDIA or cloud inference.

## Validated Shape

- Windows host
- Ubuntu WSL guest
- ROCm `7.2.x`
- PyTorch ROCm working before `voxcpm` install
- `voxcpm==2.0.2`

One validated device family was:

- `gfx1151`
- `AMD Radeon 8060S`

## Required Environment

Before running `torch` or `voxcpm`, export:

```bash
export HSA_ENABLE_DXG_DETECTION=1
export LD_LIBRARY_PATH=/opt/rocm/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
```

If these are missing, imports may fail on runtime libraries such as:

- `libroctx64.so.4`
- `libMIOpen.so.1`
- `librccl.so.1`

## Minimum Validation

Do not attempt voice generation before this passes:

```bash
python - <<'PY'
import torch
print(torch.__version__)
print(torch.cuda.is_available())
print(torch.cuda.get_device_name(0))
x = torch.randn(512, 512, device='cuda')
y = x @ x
print(y.shape, y.device)
PY
```

Expected result:

- `torch.cuda.is_available() == True`
- device name resolves to the AMD GPU
- a small matrix multiply succeeds on `cuda:0`

## Recommended Clone Workflow

1. prepare a short Chinese reference pool first
2. cut one `15-25s` mono `16kHz` prompt clip per candidate source
3. transcribe the prompt clip
4. run `ultimate cloning` before considering LoRA
5. evaluate one short output sample before scaling to longer narration

## Why This Exists

The risk on AMD Windows machines is usually not `VoxCPM2` itself. The risk is the runtime stack:

- WSL
- ROCm runtime libraries
- PyTorch ROCm
- `voxcpm`

Once the stack is validated, `ultimate cloning` becomes the preferred first production test because it avoids the extra setup cost of LoRA while preserving much more voice detail than generic TTS.
