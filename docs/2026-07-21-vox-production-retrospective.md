# 0721 Vox production retrospective

This update comes from an approximately 82-second, narration-led editorial-collage production, not from a prompt-only design exercise. The accepted master used real cloned narration timing, deterministic Remotion assembly, separate generated cutouts, and one bounded generated-motion insert.

## What failed in the first assembled preview

Three defects survived scene-by-scene review:

1. **Caption-only static interval.** The source strip settled early and the picture waited for changing captions. The scene was technically animated but semantically static.
2. **Phone-size semantic actors were too small.** The tool relationship was correct in planning, but the main nodes became postage stamps inside a large decorative field at 640x360.
3. **Adjacent scenes lost their material world.** A layer scene worked in isolation, yet hard cuts on both sides abandoned the previous table and next aperture, so the sequence felt assembled from unrelated slides.

These are different failures. Adding generic motion, larger subtitles, or more texture would not have repaired them.

## Repairs that worked

- The static interval gained finite physical states: scanner sweep, registration clips, perforation, and one offcut. The camera stayed locked; the picture started carrying the explanation again.
- The tool scene became two large tactile stations joined by one rail. Exactly two symbolic tokens carried the low-credit idea without inventing a price or receipt.
- The layer scene gained backing mats and registration shadows, then inherited cobalt/cream geometry from the previous scene and introduced the teal aperture used by the next scene.

## Durable workflow changes

### 1. Blind review now has a subtitle-hidden pass

A caption or label update is not accepted as a picture-state change. Intentional stillness remains valid when the held image itself carries the active idea and the review records why motion would weaken it.

### 2. Phone review judges semantic scale, not only typography

Readable subtitles do not prove that the picture works. Essential actors and their relationship must still be identifiable without zooming.

### 3. Transition review names a physical anchor

Each adjacent-scene handoff carries at least one material, object, rail, aperture, color field, or motion vector. An intentional world reset is allowed, but it must be stated as a decision.

### 4. Lean state and branch scene spec must agree

The Vox validator now compares scene order, ids, beat ids, timings, dimensions, fps, timeline revision, and source master against `project-state.json`. This prevents a stale scene contract from passing after the real edit has changed.

### 5. Review evidence is generated consistently

`build_scene_evidence.py` reads the accepted master and synchronized scene timings, then extracts H.264/AAC scene clips, entry/settled/exit frames, contact sheets, and a machine-readable index. It refuses to overwrite a non-empty evidence directory and never edits the source-of-truth files.

### 6. External coding agents do not own pixel approval

An external coding agent may receive a bounded list of scene files and run type checks. The root director still renders the full master, inspects pixels at full and phone size, performs full decode, and accepts or rejects the repair. A controller timeout is not evidence that the saved code failed, and a clean type check is not evidence that the film works.

### 7. Generated video is a bounded motion layer

Generated video is used when continuous material, hand, or camera motion earns its cost. Exact Chinese, evidence, URLs, counts, subtitles, and final timing stay deterministic. This is a responsibility split, not a provider preference.

## Files that encode the learning

- `skills/xingchen-next/SKILL.md`
- `skills/xingchen-next/references/preview-quality-scorecard.md`
- `skills/xingchen-lookdev/SKILL.md`
- `skills/xingchen-vox-collage/SKILL.md`
- `skills/xingchen-vox-collage/references/visual-qa.md`
- `skills/xingchen-vox-collage/scripts/validate_vox_branch.py`
- `skills/xingchen-vox-collage/scripts/build_scene_evidence.py`
- `skills/xingchen-vox-collage/tests/test_scripts.py`

## What was deliberately not generalized

- no constant-motion quota
- no universal number of layers or props
- no fixed provider or copied seed prompt
- no generated source proof or exact text
- no assumption that a beautiful isolated scene survives its neighbors

The transferable unit is the control chain: accepted narration and evidence -> visual proposition -> settled hero frame -> separate actors -> bounded motion -> deterministic assembly -> blind full-piece review -> narrow repair -> verified delivery.
