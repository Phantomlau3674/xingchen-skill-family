# Local Runtime Environment

This file is the durable machine contract for running Xingchen Next locally. Do not install transcription, browser, or render dependencies into temporary project folders unless a one-off experiment is explicitly isolated.

## Stable paths

- Xingchen runtime root: `C:\Users\liuzh\.codex\runtimes\xingchen-next`
- Python venv: `C:\Users\liuzh\.codex\runtimes\xingchen-next\.venv`
- Venv Python: `C:\Users\liuzh\.codex\runtimes\xingchen-next\.venv\Scripts\python.exe`
- Node tools: `C:\Users\liuzh\.codex\runtimes\xingchen-next\node-tools`
- Shared headless browser: `C:\Users\liuzh\AppData\Local\ms-playwright\chromium_headless_shell-1217\chrome-headless-shell-win64\chrome-headless-shell.exe`
- Model cache: `C:\Users\liuzh\.codex\models\huggingface`
- Upstream runtime source snapshots: `C:\Users\liuzh\.codex\vendor_imports\video-runtimes`
- Remotion adapter harness: `../../remotion-render-adapter/templates/director-motion-kernel`
- Spark route root, when Spark is selected: `C:\xingchen-spark`
- Local ComfyUI base directory for Wan2.2 inserts: `C:\comfyui`
- Local ComfyUI Wan skill: `../../comfyui-wan-video`
- Local ComfyUI API host: `http://127.0.0.1:8188`
- Local ComfyUI output directory: `C:\comfyui\output`

## Current baseline on this machine

- `ffmpeg` and `ffprobe` are installed through WinGet Gyan FFmpeg and are required for media inspection and final audio/video assembly.
- Node, npm, npx, pnpm, and git are installed.
- The global Remotion CLI command is not installed; use the Remotion adapter harness or a project-local Remotion install.
- Node Playwright and Hyperframes are installed in the persistent Node tools folder. Playwright browser binaries exist under `C:\Users\liuzh\AppData\Local\ms-playwright`.
- `HYPERFRAMES_BROWSER_PATH`, `PUPPETEER_EXECUTABLE_PATH`, and `REMOTION_BROWSER_EXECUTABLE` should point to the shared headless browser so Hyperframes, Puppeteer-style capture helpers, and Remotion do not each download another Chromium.
- `nvidia-smi` is not available in the default PATH, so the safe transcription default is CPU with `compute_type=int8`.
- The Windows `py` launcher is not available. Use the full venv Python path instead of `py`.

## Transcription runtime

Use the persistent venv for human recording takes:

```powershell
& C:\Users\liuzh\.codex\runtimes\xingchen-next\.venv\Scripts\python.exe `
  ../../xingchen-transcribe/scripts/transcribe_faster_whisper.py `
  --audio take1.mp3 take2.mp3 take3.mp3 `
  --state project-state.json `
  --out-dir . `
  --model small `
  --language zh `
  --device cpu `
  --compute-type int8
```

Outputs:

- `transcript.tsv`
- `recording-cleanup-report.md`
- `project-state.json -> sources.transcript.segments`
- `project-state.json -> sources.source_pack.draft_recordings`
- `project-state.json -> sources.asset_manifest[]` entries for audio recordings

The first run of a model downloads it into the stable model cache. Later runs reuse the cache.

For better Chinese accuracy on a final pass, raise `--model medium` or another approved faster-whisper model, but record that model in the transcript runtime metadata.

## Browser and Hyperframes runtime

Use the persistent Node tools folder for custom browser capture helpers or Hyperframes candidate generation:

```powershell
& C:\Users\liuzh\.codex\runtimes\xingchen-next\node-tools\node_modules\.bin\hyperframes.cmd --version
```

Use the shared browser for render/capture:

```powershell
[Environment]::SetEnvironmentVariable("HYPERFRAMES_BROWSER_PATH", "C:\Users\liuzh\AppData\Local\ms-playwright\chromium_headless_shell-1217\chrome-headless-shell-win64\chrome-headless-shell.exe", "User")
[Environment]::SetEnvironmentVariable("PUPPETEER_EXECUTABLE_PATH", "C:\Users\liuzh\AppData\Local\ms-playwright\chromium_headless_shell-1217\chrome-headless-shell-win64\chrome-headless-shell.exe", "User")
[Environment]::SetEnvironmentVariable("REMOTION_BROWSER_EXECUTABLE", "C:\Users\liuzh\AppData\Local\ms-playwright\chromium_headless_shell-1217\chrome-headless-shell-win64\chrome-headless-shell.exe", "User")
```

Project-specific Remotion renders should still use the approved render project or adapter harness so package versions remain tied to the current render plan.

## Remotion runtime doctor

Use the Remotion adapter harness doctor when a project's videos, props, and process files live in one folder:

```powershell
cd ../../remotion-render-adapter/templates/director-motion-kernel
npm run doctor -- --project-root C:\path\to\project
npm run doctor:still:vertical -- --project-root C:\path\to\project --frame 30
```

The static doctor checks JSON, asset paths, package alignment, browser paths, and typecheck. The still doctor also renders a frame and checks that the PNG is nonblank. Still checks are runtime verification; use them for project retest or render debugging, not pure skill-edit housekeeping.

## Local ComfyUI Wan2.2 runtime

Use the `comfyui-wan-video` skill only for bounded image-to-video insert clips. It is not the final renderer and it does not own subtitles, proof, or full-video timing.

Runtime check:

```powershell
powershell -ExecutionPolicy Bypass -File ../../comfyui-wan-video/scripts/check-runtime.ps1
```

Start local ComfyUI when needed:

```powershell
powershell -ExecutionPolicy Bypass -File ../../comfyui-wan-video/scripts/start-comfyui.ps1
```

Submit a smoke clip:

```powershell
C:\comfyui\.venv\Scripts\python.exe ../../comfyui-wan-video/scripts/submit-wan22-ti2v.py --image C:\path\to\image.png --prompt "subtle controlled motion, slow push-in, no text"
```

Defaults are `512x288`, `9` frames, `8` fps, `4` steps, `cfg=5.0`, `sampler=uni_pc`, `scheduler=simple`, and `shift=8.0`. Register successful outputs as `render.ai_video_candidates[]` with adapter id `comfyui-wan22-ti2v`.

## Runtime check

Run this before a full project if the machine has changed:

```powershell
powershell -ExecutionPolicy Bypass -File ../scripts/check-local-runtime.ps1
```

The script checks the core CLI tools, persistent transcription venv, model cache, Remotion harness, Playwright browser availability, vendor runtime snapshots, and Spark root.

## Stage-to-environment map

| Stage | Required local environment |
|---|---|
| `ingest` assets | `ffprobe`, filesystem access, source files present |
| `ingest` audio | persistent Python venv, `faster-whisper`, model cache, `ffmpeg`/`ffprobe` |
| `research/proof` | no special runtime beyond file access and validator |
| `script` | no special runtime beyond file access and validator |
| `story-mother` | no special runtime beyond file access and validator |
| `visual-direction` | validator; optional upstream source snapshots for runtime choice review |
| `platform-adapt` | validator |
| `lookdev` | Node/npm, Remotion harness or project-local Remotion, browser capture path for Hyperframes/Spark/HTML lanes |
| `render` | project-local Remotion, `ffmpeg`/`ffprobe`, approved render job paths; optional local ComfyUI Wan2.2 only for approved `gen_insert` video plates |
| `publish` | final media files and cover assets |
| `review` | shipped output, metrics or qualitative evidence |

## Non-template rule

Installed runtimes are execution tools only. They do not provide standing visual templates. Scene code, browser plates, motion candidates, and Remotion timelines must be generated from the current `project-state.json`, StoryMother, VisualPolicy, material director pass, scene decisions, source-material plan, and render jobs.
