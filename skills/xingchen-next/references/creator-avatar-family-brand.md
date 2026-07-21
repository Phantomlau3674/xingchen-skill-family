# Creator Avatar Family Brand

This is a creator signature style memory, not a fixed template. It helps Xingchen keep a recognizable family identity across videos without cloning a single opener, palette, layout, or mascot scene.

The fixed avatar source is:

`C:\Users\liuzh\Pictures\04_AI生成图片\2026-05\ChatGPT Image 2026年5月7日 15_14_14.png`

Reuse this asset by default whenever a creator avatar, host chip, or cat-director identity anchor is needed. Do not invent a placeholder. A project may skip showing the avatar when it would weaken the thesis, proof, or tone, but it must record a concrete skip reason.

The asset default does not make the surrounding Shanghai-night/workbench style a default. Any broader signature style still needs a project-specific adaptation reason and anti-template constraint.

## Source Of This Memory

This memory distills:

- the user's avatar-led creator identity
- the existing Xingchen signature of Shanghai night window, warm desk lamp, notebook/camera/laptop workspace, warm interior vs cool city, and a cat-director motif
- the Stitch reference intake recorded in [stitch-remotion-family-template-intake.md](./stitch-remotion-family-template-intake.md)

The Stitch archives are references only. Do not copy their HTML/CSS, remote image URLs, literal PawScience copy, or fixed scene layouts into project work.

## Brand Posture

The family identity should feel:

- warm executive, not corporate cold
- technical but human
- AI explainer creator, not generic AI dashboard
- calm but sharp
- desk-lamp studio, not children's cartoon set
- Shanghai night window plus warm interior, not a flat beige app screen
- avatar-guided, not mascot-dominated

The recurring avatar/cat-director motif is a signature, not proof. It can orient, host, transition, or close, but it cannot replace the scene job.

## Suggested Tokens

These are suggested tokens, not enforced defaults. Each project must adapt or reject them in the director-board art direction.

| Role | Suggested family | Notes |
|---|---|---|
| Surface | warm off-white, paper cream, lamp-lit beige | Must keep enough contrast for subtitles and proof |
| Primary | amber, burnt orange, sunset highlight | Use for host signature, key motion accents, or selected callouts |
| Secondary | coffee brown, warm near-black | Use for readable text and structural anchors |
| Accent | soft lavender or muted violet | Use sparingly for secondary rhythm, not a generic tech gradient |
| Cool counterpoint | Shanghai night blue, glass reflection, city-window shadow | Use to stop the palette becoming one-note beige |

Avoid default purple/cyan tech gradients when the creator signature is active. Also avoid an all-beige low-contrast piece.

Typography guidance:

- use a rounded modern sans for English headlines when available
- use a friendly but readable sans for labels and body text
- for Chinese, prefer locally available readable sans fonts over childish rounded display fonts
- do not force the Stitch font pair into every project

## Motif System

Use one or two motifs per project, not all motifs at once:

- avatar/host chip: a small creator identity marker near scene transitions or lower-third metadata
- cat-director mark: a tiny cue for director commentary, never a proof layer
- desk lamp: warm key light, vignette, or chapter transition
- notebook/camera/laptop: creator-workbench context for intro, rest, or payoff scenes
- Shanghai night window: cool exterior counterpoint behind warm interior explanation
- paw/cat-ear geometry: tiny decorative rhythm only when it does not cheapen the topic

Motifs must stay outside subtitle and proof safe regions.

## Scene Family Mapping

The signature can inform scene families, but it does not provide templates:

| Scene family | Signature use | Constraint |
|---|---|---|
| identity opener | avatar, lamp, city window, one topic proposition | no fixed opener layout |
| topic chapter | warm host stamp, concise chapter marker | no decorative card stack |
| detail proof explainer | subtle warm frame or host cue | evidence owns the frame |
| AI process map | amber path plus cool technical counterpoint | no fake proof UI |
| AI comparison | warm/cool asymmetry, clear winner signal | comparison hierarchy beats motif |
| AI data viz | coffee text, amber key number, restrained lavender secondary | number or chart is larger than mascot |
| neural/attention/diffusion scene | avatar motif can introduce, not dominate | code/SVG/Canvas carries the explanation |
| rest/payoff | warm desk-lamp breath or avatar return | keep it quiet and short |
| outro | creator identity can return strongly | still no copied Stitch outro |

## Required State Trace

Lean projects write:

```json
{
  "visual_policy": {
    "creator_avatar": {
      "decision": "reuse",
      "asset_path": "C:\\Users\\liuzh\\Pictures\\04_AI生成图片\\2026-05\\ChatGPT Image 2026年5月7日 15_14_14.png",
      "skip_reason": ""
    }
  }
}
```

When skipping, set `decision: "skipped"` and provide `skip_reason`.

Extended projects that use the broader family style write:

```json
{
  "visual": {
    "visual_policy": {
      "creator_signature_policy": {
        "brand_memory_used": true,
        "selected_family_from_brand_memory": "creator-avatar-family-brand",
        "adaptation_reason": "",
        "anti_template_constraint": "",
        "reference_path": "references/creator-avatar-family-brand.md"
      }
    }
  }
}
```

`adaptation_reason` must say why this project's audience, thesis, and source material should carry the signature. `anti_template_constraint` must say how the project avoids becoming a repeated family template.

## Anti-Patterns

- copying Stitch HTML/CSS or remote images into a final video
- reusing PawScience, Cozy Paws, Professor Whiskers, or similar literal copy
- making every scene amber, lavender, and beige
- using the avatar as the main proof object
- placing mascot/chip elements over subtitles, charts, screenshots, or callouts
- turning serious proof scenes into cute office UI
- using paw/cat-ear decorations when removing them would not reduce meaning, rhythm, or orientation
- creating a fixed default intro/outro that bypasses director-board decisions
- using rounded cards as the main visual grammar for an entire video

## Lookdev Questions

Before approval, ask:

- Can a viewer recognize the creator family without seeing a copied template?
- Does the scene still work if the avatar motif is removed?
- Does the motif serve orientation, rhythm, or emotional return?
- Is proof still larger, clearer, and more important than the signature?
- Does the palette have warm/cool contrast, or has it collapsed into beige?
- Is the adaptation reason specific to this project?
