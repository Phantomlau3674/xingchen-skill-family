# Scene Composition Audit

Run this audit before approving proof-heavy or screenshot-heavy scenes.

Its job is to catch the frame-level failures that often survive a normal taste pass:

- offset plates
- silent stretch
- dishonest crop
- callouts that no longer point to the real target
- subtitle and proof collisions

## Audit Order

### 1. Plate Truth

Confirm the actual rendered plate matches the approved source type:

- literal screenshot stays literal
- terminal capture stays monospaced and unwarped
- photo proof is not silently rebuilt as a synthetic card

### 2. Geometry Truth

Check:

- aspect ratio is preserved
- `asset_fit_policy` matches what the frame really does
- `distortion_policy` is obeyed
- no non-uniform scale or perspective cheat appears on literal proof

### 3. Region Truth

Confirm the approved regions still map to the real frame:

- `anchor_region`
- `proof_regions`
- `subtitle_safe_region`
- `camera_window`

If motion, crop, or resize moved the plate, the regions must be revalidated, not assumed.

### 4. Read Path

Check the actual reading order:

- what lands first
- what stays readable long enough
- what gets blocked by subtitles, chrome, or transition motion

### 5. Exit Safety

Check the scene near the boundary:

- last readable frame before transition
- first readable frame after transition
- no proof-critical pixels lost during whip, zoom, or mask moves

### 6. Spark Route Truth

For `renderer_family: "spark_3dgs"` scenes, confirm:

- `route_status` matches the actual route loaded by the browser preview
- `actual_renderer_family` is `spark_3dgs` only for approved real splat assets
- procedural `constructSplats` plates are labelled `procedural_splat_world`
- `.rad` worlds use paged streaming and a recorded LOD/foveation budget
- `window.__XINGCHEN_SPARK_PLATE__` reports nonblank canvas health, load status, splat count, runtime profile, and fallback reason if any
- subtitles and chrome remain outside the dominant spatial anchor

### 7. VibeMotion Candidate Truth

For scenes with `vibemotion_candidate_ids`, confirm:

- selected candidates have real output files or components
- text-only option descriptions are not treated as motion approval evidence
- candidate motion preserves script and proof meaning
- any candidate moving toward final has a Remotion promotion note

## Blocking Findings

Block approval when any of these happen:

- proof pixels are stretched or squeezed
- the crop hides the noun, result, or action the claim depends on
- callouts or highlights point to the wrong area after motion
- subtitles invade a proof-critical region
- the scene can only be understood when paused
- Spark route status overclaims the actual loaded asset
- a Spark preview is blank, missing its asset, or lacks runtime health evidence
- VibeMotion candidates are missing, text-only, or promoted without lookdev approval

## Recommended Output

Record findings in:

- `lookdev-brief.md`
- `lookdev-gate-result.json`

When `project-state.json` exists, include the geometry blockers in the state-backed lookdev result instead of leaving them as informal notes.

Spark blockers should be recorded under `spark_route_findings` in the state-backed lookdev result.

VibeMotion blockers should be recorded under `vibemotion_candidate_findings` in the state-backed lookdev result.
