# Source-Led Film Contract

Use this contract when `route.medium_strategy` selects `source-led`, or when a mixed-media film includes screen capture, source proof, or real footage.

Store the plan at `extensions.source_led_film`. Start from [source-led-film.template.json](../templates/source-led-film.template.json). Validate it directly with:

```powershell
node ./scripts/validate-source-led-film.mjs <source-led-film.json>
```

## 1. Inspect Before Interpreting

Run `analyze-source-events.mjs` on screen recordings and footage before choosing clips. Its visual-activity windows are candidates, not semantic truth. Review them and record what visibly changes, which region must remain inspectable, and what narrative duty the event can perform.

Still images, screenshots, and documents use an inspection receipt instead of invented source time. Their event time is `0`.

Reject weak events explicitly. Do not hide rejected or unusable source material by silently replacing it with generic motion graphics.

## 2. Give Every Shot A Production Duty

Every shot records:

- one viewer question and one viewer answer;
- a complexity owner: `source-event`, `designed-bridge`, `audio-led`, or `generated-plate`;
- timeline bounds and owning scene;
- camera motivation, movement, and landing region;
- a sound role, sync anchor, exact timeline time, and visible response;
- incoming and outgoing continuity anchors;
- the current representation layer and transition contract.

`source-event` shots must cite selected events. Generated plates need a concrete exception reason and cannot serve as factual proof.

## 3. Let Sound Cause Picture

Do not add sound as a late decoration layer. Each shot names the sound event that changes attention or picture state: a spoken word, pause, click, diegetic response, designed accent, musical turn, or intentional silence. `sync_time_sec` must fall inside the shot. `visual_response` states what the viewer sees because that sound event happened.

Silence is valid when it owns a hold, reveal, reset, or payoff. An empty sync anchor is not silence; it is an unfinished sound contract.

## 4. Preserve Handoffs

Represent every intentional gap, hold, or black frame as a shot. Shot bounds must cover the accepted scene timeline without unexplained gaps or overlaps.

For `continue` and `match-cut`, the previous outgoing anchor must equal the next incoming anchor. A representation-layer change requires a `match-cut` or an explicit `deliberate-break`. Deliberate breaks need a reason.

## 5. Source-Led Means Source-Owned

For a `source-led` route, selected real-source events must own at least half of the shot duration. This is a floor, not a target. A passing ratio does not excuse weak footage, unreadable proof, unmotivated camera motion, or generic connective graphics.

Commit requires full scene coverage, sound-sync coverage, current timeline revision, and a `verified` contract. Rendered scene checkpoints and full playable previews remain authoritative for actual quality.
