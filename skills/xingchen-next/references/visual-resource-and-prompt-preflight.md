# Visual Resource And Prompt Preflight

This reference is the mandatory research gate before Xingchen enters visual design. It prevents the agent from starting with private taste, generic gradients, random cards, or renderer defaults.

Run this together with [huashu-design-taste-upgrade.md](./huashu-design-taste-upgrade.md). Huashu decides the taste posture; this file decides the current source, library, SVG, Lottie, Remotion, and image-generation resource route. For voice-led knowledge / AI explainer work, also evaluate [spoken-knowledge-motion-grammar.md](./spoken-knowledge-motion-grammar.md) and [hybrid-imagegen-precision-layer-policy.md](./hybrid-imagegen-precision-layer-policy.md) before approving generated props or wireframe scenes.

When a project may use the creator-avatar family look, read [creator-avatar-family-brand.md](./creator-avatar-family-brand.md) and [stitch-remotion-family-template-intake.md](./stitch-remotion-family-template-intake.md). They are memory/reference inputs only: do not copy Stitch source, remote image URLs, or fixed scene layouts into the project.

## When To Run

Run or refresh this preflight before every `visual-direction` pass:

- new project entering `xingchen-director-board`
- user asks for a visual redesign, better aesthetics, prompt pack, image generation, SVG, Remotion, 3D, or library research
- user asks to build or extract a reusable visual component library, CreateOS primitive kit, Burn primitive, shader/WebGL feasibility, or Remotion primitive governance
- a scene uses generated images, logos, icons, Lottie JSON, real products, UI screenshots, data graphics, physical metaphors, or motion libraries
- the user says the work is ugly, generic, PPT-like, fake, flat, or too AI-looking

If the user is only asking to modify skills or governance, this preflight is documentation work only. Do not run external searches, generation, Remotion renders, npm installs, or headless-browser probes unless the user explicitly switches to project execution/retest mode.

Before any external search or generation, check the global visual asset library in [visual-asset-library-governance.md](./visual-asset-library-governance.md). New downloads are allowed only after the preflight records why the existing library cannot satisfy the scene. If the scene can be improved by public commercially usable b-roll, run [commercial-video-footage-scout.md](./commercial-video-footage-scout.md) and record license/attribution/risk decisions. If the scene genuinely needs a real 3DGS space, Gaussian splat, navigable world plate, or Aholo Viewer preview, route to `xingchen-3dgs-retrieval` and produce `3dgs-resource-scout.md/json` before render planning.

If a current project already has this preflight, refresh only the parts affected by new source material, new platform variant, or changed direction. Do not skip it silently. When a route is unnecessary, write `not_needed` with a reason; absence is not a valid shortcut.

## Required Artifacts

Create or update these review surfaces in the project workspace:

- `visual-resource-research.md`: human-readable findings, source links, library choices, rejected options, and reasons
- `visual-resource-research.json`: machine-readable matrix for downstream skills
- `imagegen-prompt-pack.md` / `.json`: only when any generated image, generated video, style reference, or model prompt is needed
- `library-decision-matrix.md`: optional separate file for large projects; otherwise include the matrix inside `visual-resource-research.md`
- `createos-primitive-decision.md` or a linked project plan: only when reusable primitives, CreateOS component libraries, or WebGL/shader feasibility are being evaluated
- `_ready_materials\asset-library-reference.md`: project-local pointer to selected global assets when reusable assets are used
- `stock-footage-scout.md` / `.json`: unified material route scout when public stock/b-roll clips are searched, shortlisted, downloaded, rejected, or when missing stock triggers imagegen/Veo-style fallback request packs
- `3dgs-resource-scout.md` / `.json`: only when 3DGS, Gaussian splat, Aholo Viewer, Spark world, or spatial scene assets are searched, shortlisted, downloaded, or rejected

Templates:

- [visual-resource-research.template.md](../../xingchen-art-direction/templates/visual-resource-research.template.md)
- [visual-resource-research.template.json](../../xingchen-art-direction/templates/visual-resource-research.template.json)
- [imagegen-prompt-pack.template.json](../../xingchen-art-direction/templates/imagegen-prompt-pack.template.json)

State writeback uses existing paths:

- `visual.director_board.brainstorming_contract.resource_preflight`
- `visual.director_board.scene_boards[].brainstorming_layer.analogy_pass.concrete_execution_plan`
- `visual.visual_policy.creator_signature_policy`
- `visual.visual_policy.manual_review_policy`
- `visual.visual_policy.forbidden_list`
- `render.dependency_install_requests[]`
- `render.generated_assets[]`
- `render.visual_preprocess_assets[]`
- `render.plugin_adapter_runs[]`
- `render.ai_video_prompt_requests[]`

If the schema has no dedicated field, keep a structured block in the derived artifact and cite its path from the closest state-backed policy field.

## Research Sequence

### 1. Source Reality First

Before looking for style, list what the project actually has:

- user-provided screenshots, recordings, PDFs, photos, audio, notes, links, brand files, or previous renders
- proof scenes that must stay literal and legible
- real objects, products, logos, UI, or people that cannot be faked
- missing assets that block a credible hero frame
- aspect ratio, duration, audience tier, subtitle policy, and platform constraints

Output:

```json
{
  "source_reality": {
    "real_assets_available": [],
    "must_preserve_pixels": [],
    "can_generate_or_rebuild": [],
    "missing_assets": [],
    "honest_placeholder_policy": ""
  }
}
```

### 2. External Resource Scout

Search current sources when a resource choice could materially change quality. Prefer primary or official sources: GitHub repos, official docs, package docs, model-provider skills, and real design-system references.

The scout must answer:

- What visual work type is this: proof film, product demo, data explainer, physical metaphor, cinematic insert, UI prototype, or mixed?
- Is this a spoken knowledge / oral AI explainer project where Remotion-native concept motion should replace cheap generated props?
- Which design-system memory exists or must be created?
- Is the creator-avatar family memory active, and if so what is the project-specific adaptation reason and anti-template constraint?
- Which SVG/icon family is appropriate, and which would be decorative noise?
- Does any scene need a Lottie motion asset? If yes, read [lottie-motion-assets.md](./lottie-motion-assets.md), check the global asset registry first, then record selected/rejected source pages, license/provenance, local JSON path, integration route, and deterministic preview risk.
- Which Remotion packages unlock real motion language here?
- Which image-generation route is needed, and what must stay programmatic in Remotion?
- Which scenes are image plates / shock images, and which scenes are code-native precision layers?
- Are any semantic wireframes, routes, nodes, or grids being pasted over a busy generated background? If yes, reject the composition or require a safe-zone rewrite.
- What should be explicitly rejected before implementation?
- Is a public commercially usable video plate better than imagegen, AI video, or a code-native diagram for this scene? If yes, record source, license, attribution, people/brand/property risks, and intended Remotion integration.
- If public stock is not good enough, should the scene fall back to imagegen plate generation, Veo-style generated motion, or code-native Remotion? Use the fixed order `global_asset_library -> stock_footage -> imagegen_plate -> veo_video_generation -> remotion_precision_layer`, but stop early for proof, data, UI, route, chart, and subtitle-heavy scenes that must remain code-native.
- Does the scene need a real 3DGS/spatial asset instead of a flat image or procedural 3D? If yes, run `xingchen-3dgs-retrieval`, check local approved assets first, then current public 3DGS sources, and record Aholo Viewer/Spark compatibility.

Minimum matrix:

```json
{
  "library_candidate_matrix": [
    {
      "candidate": "",
      "category": "design_system|icon|brand_logo|svg_graphics|lottie_motion|remotion|imagegen|3d|data_viz|animation",
      "source_url": "",
      "use_for": "",
      "do_not_use_for": "",
      "license_or_provenance_note": "",
      "project_fit_score": 0,
      "selected": false,
      "reason": ""
    }
  ],
  "selected_routes": {
    "design_system_memory": "",
    "global_asset_candidates": [],
    "project_usage_manifest_path": "",
    "stock_footage_candidates": [],
    "imagegen_requests": [],
    "veo_video_requests": [],
    "icon_family": "",
    "svg_graphics": [],
    "lottie_assets": [],
    "remotion_packages": [],
    "motion_grammar": "",
    "hybrid_imagegen_precision_policy": "",
    "imagegen_models_or_skills": [],
    "real_asset_sources": []
  }
}
```

### 3. Design System Memory Contract

For any UI, branded page, product demo, dashboard, slide-like composition, or reusable video visual language, create a compact design system contract before scene design.

Use the `token + rule + rationale` shape:

- tokens: exact colors, type scale, spacing, radii, elevation, stroke widths, icon size, grid rhythm
- rules: when each token/component is used
- rationale: why this serves the thesis and audience

Do not write only adjectives such as "premium", "modern", "clean", "cinematic", or "tech". If the next agent cannot build the same visual system from the file, the contract is too vague.

If creator-avatar family memory is active, fill `visual.visual_policy.creator_signature_policy` in state:

```json
{
  "brand_memory_used": true,
  "selected_family_from_brand_memory": "",
  "adaptation_reason": "",
  "anti_template_constraint": "",
  "reference_path": "references/creator-avatar-family-brand.md"
}
```

`adaptation_reason` must explain why this project should use the memory now. `anti_template_constraint` must explain how the project avoids repeating a fixed opener, outro, palette, avatar placement, or PawScience/Stitch family clone.

### 4. Library Route Before Renderer Route

Library selection is not taste selection. It is the implementation route after the director-board has fixed scene intent.

Decision rules:

- use SVG/icons for symbols, UI controls, diagrams, paths, masks, charts, motion handles, labels, and highlights
- do not use SVG polygons, gradients, or div cards to fake real physical objects, product shots, proof UI, or photographic scenes
- use Remotion packages for frame-driven animation, timing, audio, subtitles, plates, composition, and deterministic render logic
- do not let Remotion package availability decide the story picture
- use Lottie for local, licensed, prebuilt vector motion that supports a named scene job; do not let Lottie own proof, subtitles, claims, narration timing, or a generic decorative loop
- for spoken knowledge / oral AI explainers, default abstract metaphors to Remotion-native concept structures (line routes, rails, layers, nodes, scans, feedback loops) before considering generated props
- use imagegen for physical objects, textural backgrounds, metaphor props that genuinely need material presence, characters, product-style plates, and illustration assets that are not proof
- use Veo-style generated video only for bounded short motion plates after a visual gap is named; generated video may move light, material, camera, atmosphere, or concept motion, but it cannot own proof or final timing
- use the visual preprocess lane for source plates or generated stills that are visually promising but flat, low-resolution, poorly separated from subtitles, or missing camera depth; record outputs in `render.visual_preprocess_assets[]`
- do not ask imagegen to create Chinese text, proof dashboards, real claims, UI evidence, logos, or factual screenshots
- do not ask Veo-style video generation to create readable claims, UI evidence, Chinese text, subtitles, logos, charts, proof dashboards, real faces, or factual screenshots
- do not use transparent wireframe PNGs as the main explanation layer over detailed generated backgrounds; if a wireframe carries the argument, implement it as a Remotion/SVG/Canvas scene and keep the background simple
- use imagegen heavily for hero/shock plates, atmospheric backgrounds, physical metaphor scenes, and chapter openers, but keep every claim, route, label, chart, and proof region in the precision layer

## Material Route Scout

Run the local material scout when a scene lacks believable source material, stock b-roll, or an image/video plate:

```powershell
node ../scripts/stock-footage-scout.mjs --state path\to\project-state.json --project-root path\to\project --dry-run
```

Default stock providers are `pexels,pixabay,coverr`. `coverr` is strongest for HD/4K 16:9 plates; treat 9:16 use as a crop/letterbox decision that must survive lookdev.

The scout writes:

- `stock-footage-scout.json/md`: scene needs, query plan, fallback chain, stock candidates, imagegen requests, Veo-style video requests, and Remotion ownership
- `imagegen-prompt-pack.json/md`: fallback clean plate requests when stock is weak and the scene is eligible for imagegen

If any query plan, prompt pack, or route fragment was generated by an LLM and returned with Markdown fences or wrapper prose, recover it per [llm-json-recovery.md](./llm-json-recovery.md) before writing JSON artifacts.
- `veo-video-request.json/md`: prompt-only generated-video handoff requests using `provider: "veo_video_generation"`

Use `--write-state` only after reviewing the generated request pack. Use `--download selected` only after candidates are marked `decision: "selected"` and license/people/brand/property risks are resolved. Downloaded or generated selected assets belong in the global visual asset library, with the project referencing them through a usage manifest.

## SVG And Icon Library Matrix

Select one primary icon family per project unless a real brand logo source requires otherwise.

### UI Icon Families

- `lucide`: default for clean, consistent UI/action symbols; good React support and broad coverage.
- `heroicons`: strong Tailwind/product UI fit; simple MIT-licensed UI icons.
- `tabler-icons`: very broad icon coverage; useful when many specific tool/action glyphs are needed.
- `phosphor`: useful when weight variants and a softer editorial icon voice are needed.

Rules:

- never mix icon families casually
- set stroke width, cap, join, optical size, and label rules
- icons support information; they are not hero proof
- if an icon needs text to explain it, decide whether a label is clearer than the icon

### Brand Logo Sources

- `simple-icons`: brand SVG icons; use only with trademark and provenance awareness.
- `svgl`: SVG logo library; verify the right to use the logo and source license before shipping.
- `iconify` / `react-icons`: useful for discovery or prototyping, but prefer the original package/source for final provenance when possible.

Rules:

- logos are real identity assets, not decoration
- do not redraw known brands by hand
- cite source and license/provenance in the resource matrix

### Programmatic SVG And Vector Graphics

- `@remotion/shapes`: simple frame-driven SVG shapes in Remotion.
- `@remotion/paths`: path length, point, tangent, morph, warp, scale, and path evolution.
- `d3`: data, scales, shapes, axes, force layouts, and data-driven SVG/Canvas/HTML.
- `flubber`: smooth 2D shape morphing when path interpolation needs better topology handling.
- `roughjs`: intentional hand-drawn/sketch visual language for explainers, not generic premium UI.
- `svg.js`: direct SVG manipulation and animation when a lightweight imperative SVG layer is useful.
- `paper.js`: vector geometry and Canvas scripting for complex shapes or generative vector illustration.
- `lottie-web` / `@remotion/lottie`: After Effects exported animation plates, with deterministic Remotion caveats; follow [lottie-motion-assets.md](./lottie-motion-assets.md) for source scouting, local JSON loading, and lookdev checks.

Rules:

- charts and diagrams need data binding or explicit symbolic logic
- morphs need narrative meaning; do not morph because it looks expensive
- sketch style must be selected by art direction, not by convenience
- generated SVG must pass text fit, subtitle safe region, and proof overlap checks

## Remotion Library Matrix

Prefer official Remotion packages and keep package versions aligned with the installed Remotion version.

For voice-led short-video work, keep the package shortlist small:

- Required candidates: `@remotion/captions`, `@remotion/transitions`, `@remotion/noise`, `@remotion/motion-blur`, `@remotion/fonts`
- Recommended candidates: `@remotion/rounded-text-box`, `@remotion/light-leaks`, `@remotion/layout-utils`
- These packages are implementation candidates only; they do not replace the approved creator aesthetic, director-board scene purpose, or imagegen/precision-layer split
- Do not import neutral-tech purple/cyan defaults from generic examples when the project has a creator signature style

Core Remotion routes:

- `remotion`: timeline, `Sequence`, `Series`, `spring`, `interpolate`, `Easing`, `Freeze`, `Loop`, `Img`, `Video`, `OffthreadVideo`, and final composition
- `@remotion/shapes`: arrows, rectangles, circles, polygons, pie, and generated SVG paths
- `@remotion/paths`: SVG path measurement, point/tangent, morphing, path evolution, and geometric transitions
- `@remotion/transitions`: `TransitionSeries`, timing presets, and scene transitions when the edge board justifies them
- `@remotion/motion-blur`: trail and camera blur for real high-speed motion; not a blanket polish filter
- `@remotion/media-utils`: audio data, waveform, beat-reactive or narration-reactive visuals
- `@remotion/three`: React Three Fiber in Remotion for true 3D scenes; use `layout="none"` in `Sequence` inside `ThreeCanvas`
- `@remotion/lottie`: local Lottie JSON plates when the source animation is suitable, licensed, scene-bound, and deterministic enough; record `@remotion/lottie` plus `lottie-web` in dependency requests when missing
- `@remotion/noise`: procedural texture, turbulence, and organic field motion
- `@remotion/skia`: advanced canvas/vector drawing when the route is justified and supported locally
- `@remotion/gif`, `@remotion/captions`, `@remotion/fonts`, `@remotion/google-fonts`, `@remotion/layout-utils`, `@remotion/zod-types`: utility packages for asset, caption, font, layout, and schema rigor

Non-Remotion libraries may be used inside Remotion only when they remain deterministic and frame-driven:

- `three`, `@react-three/fiber`, `@react-three/drei` for 3D
- `d3` for data layout and SVG geometry
- `matter-js`, `rapier`, `cannon` for physics, preferably sampled deterministically
- `gsap` only if converted to frame-controlled state; no uncontrolled runtime timelines in final renders

Output for every selected Remotion package:

```json
{
  "package": "@remotion/paths",
  "scene_ids": ["S03"],
  "capability_level": "L2|L3",
  "visual_job": "morph the proof rectangle into a system map",
  "why_not_simpler": "opacity cut would feel like a slide replacement",
  "dependency_status": "installed|install_request_needed",
  "audit_signal": "import {interpolatePath} from '@remotion/paths'"
}
```

## Imagegen Prompt Pack Protocol

Do not call image generation from a one-line idea. Create a prompt pack first.

### Prompt Schema

Every generated image or video request must include:

```json
{
  "asset_id": "",
  "scene_id": "",
  "proof_role": "none|supporting|texture|metaphor|background|character|object|plate",
  "model_route": "",
  "reference_image_paths": [],
  "source_truth_constraints": [],
  "subject": "",
  "action_or_state": "",
  "environment": "",
  "composition": "",
  "camera_and_lens": "",
  "lighting": "",
  "materials_and_texture": "",
  "palette_tokens": [],
  "style_dna": "",
  "negative_constraints": [],
  "positive_replacements": [],
  "text_policy": "no readable text inside image; Chinese text is Remotion overlay only",
  "aspect_ratio": "",
  "resolution_target": "",
  "variation_count": 3,
  "acceptance_criteria": [],
  "expected_output_paths": [],
  "remotion_overlay_plan": "",
  "fallback_plan": ""
}
```

### Model-Specific Notes

- FLUX/BFL-style routes: prefer natural-language prompts with clear subject, composition, lighting, color, material, and camera intent. For complex scenes, use structured JSON-style prompts. FLUX guidance treats negative prompts differently; record exclusions, then express the final prompt as positive visual instructions such as "blank label surfaces, no visible lettering, clean empty caption space".
- Reference-image routes: use image-to-image or multi-reference editing when preserving product identity, character consistency, style continuity, or exact layout matters.
- Midjourney-style routes: keep style and camera language strong, but convert model-specific flags into the target platform syntax; do not paste flags into unrelated models.
- DALL-E/GPT-image-style routes: avoid asking for exact Chinese text in the bitmap; reserve text, proof, labels, and claims for Remotion.
- Generated video routes: only for bounded `gen_insert` plates; proof, subtitles, claims, logos, and final timing remain Remotion-controlled.

### Prompt Quality Bar

A prompt is not ready unless a visual designer could sketch the frame without asking follow-up questions:

- exact subject and role in the scene
- concrete composition and crop
- camera distance and angle
- lighting motivation
- material surface and texture
- color tokens linked to art direction
- what must be absent
- where Remotion text/subtitles will sit
- how the asset will be used in the scene

Generate 2-4 variants for hero assets, physical metaphors, style-setting backgrounds, or any asset the user previously criticized. Score each variant:

- relevance to thesis
- recognizability
- material/craft quality
- crop and aspect fit
- text-free compliance
- integration with Remotion overlay plan
- originality without breaking clarity

Reject assets below 8/10 for hero scenes or any asset with visible fake text, fake UI proof, broken brand identity, wrong object, or unusable crop.

## Visual Resource Review Block

Add this block to `visual-resource-research.md` and cite it from art direction:

```json
{
  "visual_resource_preflight": {
    "ran_at_stage": "visual-direction",
    "research_sources": [],
    "design_system_memory": "",
    "selected_icon_family": "",
    "selected_svg_tools": [],
    "selected_lottie_assets": [],
    "selected_remotion_packages": [],
    "selected_motion_grammar": "",
    "selected_imagegen_routes": [],
    "asset_gaps": [],
    "prompt_pack_paths": [],
    "rejected_defaults": [],
    "lookdev_audit_hooks": []
  }
}
```

## Repair Trigger

When a preview is criticized as ugly, generic, flat, PPT-like, or AI-looking:

1. Re-open this preflight before color tuning.
2. Check whether the failing scene skipped source reality, design-system memory, library matrix, or prompt pack.
3. Replace fake SVG/div objects with real generated or sourced assets.
4. Replace weak Remotion L0/L1 motion with a justified L2/L3 package route.
5. Rewrite prompt pack variants and regenerate the asset if the bitmap carries the wrong visual job.
6. Update the director board, art direction, compiler trace, and lookdev audit hooks before rendering again.

## Research Anchors

These are starting points, not a frozen menu:

- Stevenmind Huashu taste gate: `C:\stevenmind\stevenmind\04 Wiki\视频创作\视觉美学\华叔品味预检.md`
- Stevenmind visual library index: `C:\stevenmind\stevenmind\04 Wiki\视频创作\视觉美学\视觉设计资料库索引.md`
- Stevenmind Xingchen aesthetic standards: `C:\stevenmind\stevenmind\04 Wiki\视频创作\视觉美学\Xingchen 审美标准与主题标准.md`
- Stevenmind programmatic video component library: `C:\stevenmind\stevenmind\04 Wiki\视频创作\视觉美学\程序化视频视觉组件库.md`
- Stevenmind Remotion R3F Blender capability map: `C:\stevenmind\stevenmind\04 Wiki\视频创作\视觉美学\Remotion R3F Blender 能力全图.md`
- Stevenmind high-aesthetic project map: `C:\stevenmind\stevenmind\04 Wiki\视频创作\视觉美学\高审美项目参考地图.md`
- Stevenmind PaperClip-style demo animation grammar: `C:\stevenmind\stevenmind\04 Wiki\视频创作\动效语法\回形针式演示动画语法.md`
- HyperFrames catalog: https://hyperframes.heygen.com/catalog/blocks/data-chart
- React Bits: https://github.com/DavidHDev/react-bits
- Magic UI: https://magicui.design/docs
- Aceternity UI AI catalog: https://ui.aceternity.com/ai-recommendations
- Motion Primitives: https://motion-primitives.com/docs
- GSAP docs: https://gsap.com/docs/v3/
- Huashu Design: https://github.com/alchaincyf/huashu-design
- Interface Design: https://github.com/Dammyjay93/interface-design
- Awesome Claude Design / DESIGN.md examples: https://github.com/VoltAgent/awesome-claude-design
- Black Forest Labs FLUX skills: https://github.com/black-forest-labs/skills
- Arc design workflow: https://github.com/howells/arc
- Lucide: https://github.com/lucide-icons/lucide
- Heroicons: https://github.com/tailwindlabs/heroicons
- Tabler Icons: https://github.com/tabler/tabler-icons
- Phosphor Icons: https://github.com/phosphor-icons/core
- Simple Icons: https://github.com/simple-icons/simple-icons
- SVGL: https://github.com/pheralb/svgl
- D3: https://github.com/d3/d3
- Flubber: https://github.com/veltman/flubber
- Rough.js: https://github.com/rough-stuff/rough
- SVG.js: https://github.com/svgdotjs/svg.js
- Paper.js: https://github.com/paperjs/paper.js
- Lottie Web: https://github.com/airbnb/lottie-web
- Remotion Lottie docs: https://www.remotion.dev/docs/lottie
- LottieFiles free animations: https://lottiefiles.com/free-animations
- Lordicon animated icons: https://lordicon.com/
- IconScout Lottie animations: https://iconscout.com/lotties
- Icons8 animated icons: https://icons8.com/animated-icons
- Remotion docs: https://www.remotion.dev/docs/
