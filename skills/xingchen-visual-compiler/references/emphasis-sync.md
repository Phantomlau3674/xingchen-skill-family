# Emphasis Sync

The goal is simple: when narration hits a meaningful word, the related visual element should respond in time.

## What Counts As An Emphasis Candidate

When `project-state.json -> script` or exported `spoken-script.md` is available, treat these as default emphasis candidates:

- strong signal words such as `最重要`, `关键`, `核心`, `记住`, `注意`, `其实`
- all numbers including percentages, money, and time markers
- locked terms from script polish
- words wrapped in quotation marks or book-title marks

Users may still add or remove emphasis candidates during script review.

## `emphasis_beats`

Each packaged scene may include:

```json
{
  "emphasis_beats": [
    {
      "at_ms": 1800,
      "text": "42%",
      "target_layer_id": "stat-main",
      "style": "scale-glow"
    }
  ]
}
```

## Timing Rule

- `at_ms` is measured from the start of the scene
- estimate from transcript timing and character offset when exact word timing is unavailable
- keep a minimum interval of `400ms` between repeated emphasis triggers on the same layer

## Allowed Styles

- `scale-glow`
- `underline-wipe`
- `count-up`

## Default Limit

- keep at most `3` emphasis beats per scene
- if there are more candidates, prioritize `numbers > locked terms > signal words`
