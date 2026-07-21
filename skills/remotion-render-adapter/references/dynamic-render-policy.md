# Dynamic Render Policy

## Why This Exists

The most common failure mode is a structurally correct project that still looks like a slideshow because the system falls back to stills, generic cards, an older scene bundle, or a hidden generated-video shortcut that does not belong to the current piece.

This policy prevents that shortcut.

## Final Render Default

Final Remotion output should come from one of these:

- live scene components rendered in Remotion
- HTML or canvas scenes rendered as motion output
- approved VibeMotion candidates promoted as live components, captured HTML/canvas plates, video plates, or transparent assets
- Spark 2.0 / 3DGS browser-captured world plates when approved as `renderer_family: "spark_3dgs"`
- truthful source recordings such as user-provided screen capture or literal proof video

This is a `code-first` dynamic HTML/React/SVG/Canvas policy.

The scene logic should be compiled from current director decisions, not inherited wholesale from a previous project's theme.

## Preview-Only Artifacts

These are review artifacts, not final render inputs by default:

- `lookdev-stills/`
- contact sheets
- review PNGs
- preview-only motion slices
- VibeMotion candidates that lack lookdev approval or Remotion promotion records

## Not Allowed

- shipping a final cut built from approval stills
- hiding a missing renderer behind camera push-ins on PNGs
- binding every new project to a fixed scene bundle because one earlier project looked good
- describing a still-based animatic as the renderer output
- silently switching the project default from `code_primary` to generated-video output
- treating Spark 2.0 as a universal background, proof renderer, or voice/video generator
- treating VibeMotion candidates as final render just because a candidate file exists

## What To Do Instead

- compile approved director direction into live scene recipes
- promote only approved VibeMotion candidates and record how they enter Remotion
- promote reusable code into primitives, not fixed answers
- preserve proof readability and subtitle avoidance from upstream direction
- create a new scene from the current project's own anchor, beat, and proof needs
- keep generated-video usage scoped to explicit inserts or mixed scenes
- for `spark_3dgs`, capture a real moving browser/canvas plate and layer subtitles, proof callouts, voice, and BGM outside Spark
