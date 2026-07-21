# Lottie Motion Assets

This reference governs Lottie JSON animations in Xingchen projects. Lottie is a motion asset source, not a renderer family and not a proof layer.

Use this when a scene needs reusable vector motion such as status icons, loaders, success/error beats, looping ambient UI motion, lightweight explainer accents, or a prebuilt After Effects animation that can be safely scheduled by Remotion.

Do not use Lottie for final subtitles, Chinese text, proof screenshots, factual dashboards, narration timing, cross-scene assembly, or any scene where the animation decides the argument instead of supporting a director-board decision.

## Route Decision

Default route:

```json
{
  "renderer_family": "remotion_component",
  "execution_runtime": "remotion",
  "motion_source": "native_remotion",
  "integration_mode": "live_component"
}
```

Use `@remotion/lottie` when the Lottie JSON is local, licensed, visually tied to the current scene job, and deterministic in preview.

Hyperframes may use Lottie only as a candidate HTML/canvas source:

```json
{
  "technical_route": "hyperframes_lottie",
  "motion_source": "hyperframes_runtime",
  "integration_mode": "captured_html_plate",
  "promotion_target_renderer_family": "html_scene"
}
```

If a Hyperframes Lottie candidate is approved for final Remotion composition, either capture it as a plate or rewrite/promote it into a Remotion-controlled layer. It must still carry `candidate_origin`, `state_trace_refs[]`, and the linked adapter run.

## Asset Scout Order

Before downloading anything, check the global visual asset registry and the project usage manifest per [visual-asset-library-governance.md](./visual-asset-library-governance.md).

Search current sources only when no local reusable asset fits. Prefer:

- LottieFiles free animations and marketplace: https://lottiefiles.com/free-animations - broad discovery, Lottie JSON download, editor/optimizer/tooling, and community or paid assets. Use the official asset page as provenance.
- Lordicon: https://lordicon.com/ - animated icon packs for UI states, product gestures, status marks, and small semantic accents.
- IconScout Lottie animations: https://iconscout.com/lotties - large catalogue for business, UI, explainer, and illustration-style motion assets.
- Icons8 animated icons: https://icons8.com/animated-icons - useful for compact icon-state motion when a small UI-like symbol is enough.
- Custom export: After Effects + Bodymovin/LottieFiles plugin, Lottie Creator, or SVG-to-Lottie tools when the scene needs project-specific motion rather than stock animation.

Reject:

- random CDN JSON with unclear author, license, or original page
- files that require runtime network access for final render
- assets with embedded text, logos, claims, UI proof, or brand marks unless source truth and license are explicit
- decorative loops that add motion but no scene job
- assets whose palette, geometry, or metaphor conflicts with the approved visual policy

## Download And Registration

For final render, keep the Lottie package local:

- download/export `Lottie JSON`; if the source is `.lottie` / dotLottie, convert or export to JSON unless the approved HTML lane explicitly uses a dotLottie runtime
- place JSON under the Remotion project's `public/lottie/<asset-id>/` or another project-local public asset folder
- copy any referenced raster image assets and preserve relative paths expected by the JSON
- record original URL, author/vendor, license/provenance, download date, local path, tags, scene ids, and checksum in the global registry or project usage manifest
- if a package is paid, private, or account-gated, record proof of entitlement without committing secrets or account-only URLs

Remote URLs are allowed only for quick preview or explicitly approved experiments. Final rendering should not depend on remote Lottie URLs; if a remote URL is unavoidable, pin the URL, verify CORS, and record the risk in the resource matrix.

## Remotion Loading Pattern

Install only when the project actually selects a Lottie route:

```powershell
npm i @remotion/lottie lottie-web
```

For project assets in `public/`, use `staticFile()` + `fetch()` + `delayRender()`:

```tsx
import {Lottie, type LottieAnimationData} from '@remotion/lottie';
import {useEffect, useMemo, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

export const LocalLottieLayer: React.FC<{
  assetPath: string;
  loop?: boolean;
  playbackRate?: number;
}> = ({assetPath, loop = false, playbackRate = 1}) => {
  const [handle] = useState(() => delayRender('Loading Lottie animation'));
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile(assetPath))
      .then((response) => response.json())
      .then((json) => {
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [assetPath, handle]);

  const style = useMemo(
    () => ({width: '100%', height: '100%', pointerEvents: 'none' as const}),
    []
  );

  if (!animationData) {
    return null;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      playbackRate={playbackRate}
      style={style}
    />
  );
};
```

Small stable JSON may be imported directly, but prefer `public/` + `staticFile()` for larger assets and source provenance clarity. Memoize or hold the `animationData` object in state so Remotion does not re-initialize it unexpectedly.

Use `Sequence`, `Series`, `Loop`, `Freeze`, `interpolate`, and scene-owned props around the Lottie layer. Do not call `lottie-web` imperatively in a final Remotion render unless there is a frame-seek wrapper and a preview proves determinism.

## Lookdev Checks

Before approving a Lottie asset:

- inspect dimensions, duration, frame rate, and loopability; use `getLottieMetadata()` when helpful
- render a still and a short clip at target fps and aspect ratio
- check transparent background, z-order, subtitle safe region, and `must_not_cover[]`
- verify no tiny text, embedded Chinese, fake UI proof, unlicensed logo, or unreadable claim is inside the asset
- test for flicker; Lottie expressions have limited deterministic support in Remotion and must be evaluated per file
- watch performance: very large JSON, many masks, raster image embeds, heavy expressions, or hidden layers may need optimization or replacement
- confirm color adaptation: recolor with source tooling when possible, not by piling CSS filters over a mismatched stock asset

Acceptance note for `visual-resource-research.md`:

```json
{
  "lottie_asset_decision": {
    "asset_id": "",
    "scene_ids": [],
    "source_url": "",
    "license_or_provenance_note": "",
    "local_json_path": "",
    "integration_route": "remotion_lottie|hyperframes_lottie_candidate|rejected",
    "visual_job": "",
    "proof_policy": "no proof, subtitles, claims, or readable text inside the Lottie asset",
    "determinism_check": "",
    "selected": false,
    "reason": ""
  }
}
```
