# Material Route Scout

- project_id:
- project_root:
- created_at:
- scout_reason:
- route_order: global_asset_library -> stock_footage -> imagegen_plate -> veo_video_generation -> remotion_precision_layer

## Scene Needs

| scene_id | need_type | visual job | why stock footage | why imagegen / Veo | fallback if rejected |
|---|---|---|---|---|---|
|  | stock_footage_or_imagegen_fallback |  |  |  |  |

## Fallback Chain

| scene_id | stock footage | imagegen plate | Veo video plate | final controller |
|---|---|---|---|---|
|  | search_first | request_if_stock_rejected | request_after_image_plate_if_motion_needed | Remotion precision layer |

## Query Plan

| scene_id | queries | desired aspect | desired motion | min duration |
|---|---|---|---|---|
|  |  | 9:16 |  | 4s |

## Candidates

| asset_id | source | query | source_url | license_url | duration | commercial_use_status | people risk | brand risk | property risk | decision |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | manual_review_required | manual_review_required | manual_review_required | manual_review_required | pending |

## Imagegen Requests

| request_id | scene_id | visual job | proof role | expected output |
|---|---|---|---|---|
|  |  |  | not_proof |  |

## Veo Video Requests

| request_id | scene_ids | provider | technical_route | status | expected candidate |
|---|---|---|---|---|---|
|  |  | veo_video_generation | image_to_video | drafted |  |

## Rejected

| candidate | reason |
|---|---|
|  |  |

## Remotion Integration

- video_plate scenes:
- background/transition scenes:
- captions/proof ownership: Remotion owns all subtitles, proof, labels, charts, routes, timing, and final composition.
- attribution placement:
