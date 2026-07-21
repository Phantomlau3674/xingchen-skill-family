# Commercial Video Footage Scout

Xingchen may plan and gather public, commercially usable stock footage as part of visual planning. Treat this as an asset-routing lane, not as permission to download random videos or randomly assemble b-roll.

This lane now borrows the useful part of MoneyPrinterTurbo's material workflow: generate search terms from the current video intent, query stock providers, filter by duration/aspect/source, dedupe, cache selected clips, and stop when enough credible material has been found. It does **not** borrow MoneyPrinterTurbo's final random stock montage behavior. Xingchen scenes still come from StoryMother, director board, Visual Lock, lookdev, and Remotion composition.

## Purpose

Use this when a scene would benefit from real-world motion that is hard or wasteful to generate:

- city, office, desk, factory, lab, nature, traffic, screen-adjacent ambience
- human hands, devices, typing, walking, commuting, work scenes
- abstract backgrounds such as ink, smoke, light, particles, clouds, water
- historical or documentary footage from open archives
- b-roll plates that Remotion can annotate, crop, subtitle, or composite

Use the material route scout first:

```powershell
node ../scripts/stock-footage-scout.mjs --state path\to\project-state.json --project-root path\to\project --dry-run
```

Default provider order is `pexels,pixabay,coverr`. Live search uses `PEXELS_API_KEY`, `PIXABAY_API_KEY`, and `COVERR_API_KEY` from the environment. Missing keys are recorded as skipped provider status, not as a failed scout.

The scout's default route order is:

`global_asset_library -> stock_footage -> imagegen_plate -> veo_video_generation -> remotion_precision_layer`

Only stock candidates selected after license/risk review should be downloaded or registered. Imagegen and Veo-style requests are fallback request packs when stock is weak or missing; they are not automatic renderer choices.

## Source Priority

Prefer sources with official license pages and downloadable files:

1. Pexels videos: free personal/commercial use; attribution not required; do not imply endorsement or resell unmodified copies.
   - License: https://www.pexels.com/license/
2. Pixabay videos: free use and adaptation under its Content License summary; watch standalone resale, trademarks/logos/brands, people, misleading use, and third-party rights.
   - License summary: https://pixabay.com/service/license-summary/
3. Mixkit stock videos: only use clips under the Mixkit Video Free License for commercial projects; reject Restricted License clips.
   - License: https://mixkit.co/license/
   - Video FAQ: https://mixkit.co/free-stock-video/
4. Coverr videos: commercial use allowed, but free downloads may require attribution and users must check releases/trademarks/properties. The Coverr API is useful for HD/4K 16:9-friendly plates; portrait matches are rare, so Remotion crop/letterbox fit must be checked before selection.
   - License: https://coverr.co/license
5. Wikimedia Commons videos: commercially reusable only when the file page license allows it; most Creative Commons files require attribution, and fair-use media from Wikipedia is not acceptable.
   - Reuse guide: https://commons.wikimedia.org/wiki/Commons:Simple_media_reuse_guide
6. YSJH / 影视飓风素材库: high-quality Chinese creator footage source. The official material detail UI exposes personal commercial and enterprise commercial license options, and free SKUs can be used when the selected clip page shows the matching commercial license and price 0. Record the exact material page, chosen license tier, and any usage limits for every clip.
   - Library entry: https://www.ysjf.com/materialLibrary

Add more sources only after checking their official license page in the current run.

## Planning Rule

During Visual Discovery Session, ask for each important scene:

- Would real b-roll make this more believable than generated footage?
- Is the clip proof, ambience, metaphor, or transition texture?
- Can the clip be safely used commercially after checking people, brands, trademarks, property, and license terms?
- Does it need attribution in the final description or credits?
- Will Remotion own all captions, proof labels, and argument overlays?
- If no good stock clip exists, is the scene eligible for an imagegen plate, or is it precision/proof content that must remain code-native?
- If a generated image plate exists and motion is genuinely needed, is a bounded Veo-style `video_plate` better than Remotion-native motion?

Stock footage should rarely carry factual proof by itself. It is usually a plate behind Remotion annotations or a rhythm/texture layer.

## Generated Fallback Rule

If stock footage is missing or rejected:

- use imagegen only for hero/shock plates, atmosphere, clean backgrounds, physical metaphor objects, or chapter plates
- use Veo-style video generation only after a source/image plate exists or a text-to-video visual gap is explicitly named
- never ask imagegen or Veo to create proof dashboards, UI evidence, readable claims, Chinese text, subtitles, logos, charts, or source screenshots
- record prompt packs in `imagegen-prompt-pack.md/json` and `veo-video-request.md/json`
- record Veo-style prompt handoffs in `render.ai_video_prompt_requests[]` with `provider: "veo_video_generation"` and `integration_mode` later fixed as Remotion `video_plate`
- keep Remotion responsible for subtitles, proof overlays, labels, route lines, timing, and final export

## Candidate Record

Each selected or shortlisted clip must be recorded before use. The unified scout file may also contain `query_plan[]`, `fallback_chain[]`, `imagegen_requests[]`, and `veo_video_requests[]`.

```json
{
  "asset_id": "",
  "source_name": "",
  "source_url": "",
  "license_name": "",
  "license_url": "",
  "commercial_use_status": "allowed|allowed_with_attribution|blocked|manual_review_required",
  "attribution_required": false,
  "attribution_text": "",
  "people_or_model_release_risk": "none|low|manual_review_required",
  "trademark_or_brand_risk": "none|low|manual_review_required",
  "property_or_landmark_risk": "none|low|manual_review_required",
  "intended_scene_ids": [],
  "role": "broll_plate|transition_texture|background_motion|historical_evidence|metaphor_plate",
  "local_path": "",
  "checksum_sha256": "",
  "downloaded_at": ""
}
```

Write reusable downloaded clips into the global visual asset library registry. Write project-specific clip selections into the project usage manifest.

Templates:

- [stock-footage-scout.template.md](../templates/stock-footage-scout.template.md)
- [stock-footage-scout.template.json](../templates/stock-footage-scout.template.json)

Validation helper:

```powershell
node ../scripts/validate-stock-footage-scout.mjs path\to\stock-footage-scout.json
```

## Rejection Rules

Reject or mark `manual_review_required` when:

- the license page cannot be found or is not current
- the clip is editorial-only, non-commercial, or restricted for the intended use
- the source is only a third-party navigation/repost description and no official clip-level license or account terms have been verified
- for YSJH / 影视飓风, the official material page does not show a matching personal commercial or enterprise commercial SKU for the intended use
- for Coverr, the clip needs 9:16 framing but the candidate only works as a wide 16:9 scene after crop/letterbox
- the clip contains recognizable logos/brands being used to suggest endorsement
- the clip contains recognizable people in a sensitive, offensive, deceptive, or product-endorsement context
- the clip is a plain stock-site repost with no primary source
- the clip would be used unmodified as a standalone asset rather than inside a new edited video

## Remotion Integration

Downloaded clips enter Remotion as `video_plate` or background/transition layers. Remotion owns:

- captions and subtitles
- labels and arrows
- proof quotes and citations
- crop, speed, freeze, blur, masks, and color grade
- provenance overlays if needed

Never rely on a stock clip to contain readable claims or generated text. If a clip is used as historical evidence, prefer official source footage or an archive file page with explicit license and attribution.
