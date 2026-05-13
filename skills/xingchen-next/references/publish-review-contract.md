# Publish And Review Contract

## PublishRecord

Store one `PublishRecord` per shipped platform variant.

Minimum fields:

- `publish_id`
- `variant_id`
- `platform`
- `title`
- `cover_ref`
- `published_at`
- `status`
- `metrics_snapshot`

Recommended metrics:

- `views`
- `watch_time`
- `completion_rate`
- `engagement_rate`
- `conversion_notes`

## PerformanceReview

Store learning separately from shipped truth.

Minimum fields:

- `review_id`
- `publish_id`
- `metric_summary`
- `qualitative_findings`
- `next_time_recommendations`

Recommended categories:

- hook strength
- scene pacing
- proof clarity
- subtitle readability
- platform fit

## Non-Destructive Learning Rule

- reviews may influence future topic, hook, visual, and variant preferences
- reviews must not rewrite the already shipped mother or published record
- if a new version is needed, create a new variant or a new project state revision
