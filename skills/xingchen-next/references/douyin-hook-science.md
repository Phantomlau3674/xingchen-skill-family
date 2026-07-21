# Douyin Hook Science

This reference governs how Xingchen Next thinks about the first 0.5–3 seconds of any Douyin-bound video.

The hook is not a creative flourish. It is a survival mechanism. On Douyin, the viewer's thumb is already in motion. The hook must create a reason to stop — not "want to watch" but "cannot scroll past."

## The 0.3-Second Decision

Douyin's feed is a scroll stream. The viewer does not choose to watch; they choose not to leave. The decision window is roughly 0.3 seconds — one glance, one frame, one gut reaction.

What works in that window:

- a number that feels wrong ("90% 的人不知道")
- a visual that breaks the pattern of what came before in the feed (unusual angle, extreme scale, unexpected color)
- a face expressing a strong emotion (genuine surprise, focused intensity, not performed excitement)
- a conflict visible in the frame itself (before vs after, old vs new, broken vs working)

What does not work:

- a title card with no visual tension
- a slow fade-in
- a logo or brand sting (the viewer has not earned a reason to care yet)
- any frame that could belong to any other video

## Hook Visual Patterns

These are not templates. They are thinking directions. Each project must choose the pattern that serves its thesis, not the one that "looks cool."

### Pattern: Data Bomb

One number fills the frame. The number must feel surprising or counterintuitive.

Think about:
- what is the single most striking number in this piece?
- does the number alone create a question? ("97%" creates "of what?")
- is the number large enough to dominate the frame? (it should feel like it owns the screen, not that it was placed on the screen)
- does the typography make the number feel heavy, urgent, or inevitable?

When to use: the piece has a clear data proof that contradicts expectation.

When NOT to use: the number is unsurprising, the piece is narrative-driven with no single stat anchor, or the number requires too much context to feel surprising.

### Pattern: Conflict Frame

The frame shows two states in visible tension — before/after, old/new, wrong/right, expectation/reality.

Think about:
- can the viewer read the conflict without any text? (if yes, the visual design is working)
- is the contrast strong enough to feel like a collision, not a comparison?
- does the frame create a side? (the viewer should instinctively feel which side is "right" or "better")

When to use: the piece argues that X is better than Y, or that something changed.

When NOT to use: the contrast is subtle or requires explanation, the piece is about a single subject rather than a comparison.

### Pattern: Evidence Interrupt

A real screenshot, document, or artifact fills the frame in a way that feels raw and immediate — as if the viewer stumbled onto something they were not supposed to see.

Think about:
- does the evidence feel real? (not beautified, not over-designed — the container should feel transparent)
- is there a visible detail that rewards a closer look? (a highlighted number, a circled phrase, an unexpected UI element)
- does the crop create urgency? (showing part of the evidence implies there is more to discover)

When to use: the piece has strong literal proof (a paper, a benchmark, a product screenshot, a leaked document).

When NOT to use: the evidence is generic or requires context to be interesting.

### Pattern: High-Climax Pre-Roll

The most dramatic visual result from the piece is shown first, with no context.

Think about:
- what is the single most visually striking moment in the piece? (put it at frame 0)
- does the frame create a "how did they do that?" or "what happened?" reaction?
- is the context gap interesting, not confusing? (the viewer should want to know more, not feel lost)

When to use: the piece has a clear climax moment that is visually strong without context.

When NOT to use: the climax requires setup to be impressive, or the piece is structured as a gradual argument rather than a reveal.

### Pattern: Scale Shock

An object, interface, or concept is shown at an extreme, unusual scale — microscopically close, astronomically wide, or at an impossible angle.

Think about:
- does this perspective reveal something the viewer has never noticed?
- is the scale shift immediate? (do not animate into the scale — start there)
- does the unusual scale create a new understanding of something familiar?

When to use: the subject has a hidden structure that becomes visible at a different scale (chips, algorithms, interfaces, systems).

When NOT to use: the subject does not benefit from scale change, or the extreme view is merely decorative.

## Hook Self-Test

Before approving any hook, ask:

1. **Thumb stop**: if I saw this frame while scrolling at normal speed, would my thumb stop? If the answer requires "well, if they read the text..." — the visual is not doing its job.

2. **Feed contrast**: does this frame look different from the 5 frames before and after it in a typical Douyin feed? Dark tech backgrounds blend into every other tech video. A bright frame, an unusual layout, or an extreme close-up breaks the feed pattern.

3. **Promise clarity**: does the frame make a promise the viewer wants to collect on? The promise can be "I will explain this number," "I will resolve this conflict," "I will show you what happened." If there is no implicit promise, the hook is decorative.

4. **3-second contract**: if the viewer stays for 3 seconds, have they received enough new information to justify staying for 10 more? The hook buys you 3 seconds. The first scene must spend them wisely.

5. **Thumbnail survival**: does this frame work as a still image in search results and recommendations? If the hook depends entirely on motion, it fails in static contexts.

6. **Audience tier check（AI 自检，不是用户检）**: AI 读 `sources.source_pack.audience.tier`。如果 tier ∈ {lay_scrolling, lay_curious} 且 hook 文案/画面含任一 `audience_visibility=banned_for_lay` 词汇（`PROOF` / `REVEAL` / `scene-board` / `xingchen-*` / `S01-S99` 章节编号 / PowerShell log / tool 品牌名如 `VoxCPM2` / `Remotion` 等）⇒ AI 自己重写 hook，不交付给用户审阅再退回。普通观众的 0.3 秒决策窗口里，看到内部词汇就划走——这是任何"金句 + 引用框"组合都补不回来的损失。本检查在所有具体 Hook Pattern 选择前生效；如果一个候选 hook 满足上面 4 条但中了第 6 条，候选作废、AI 重新生成。

## Hook and Energy Curve Integration

The hook sets the energy ceiling for the piece. If the hook is at 9/10 intensity, the piece must sustain high energy or it creates a letdown. If the hook is at 6/10 intensity (a thoughtful question, a calm evidence reveal), the piece can build upward.

Think about the energy contract:
- a Data Bomb hook promises fast-paced, proof-heavy content. Do not follow it with a slow, meditative explanation.
- an Evidence Interrupt hook promises insider knowledge. The piece must deliver depth, not surface.
- a High-Climax Pre-Roll hook promises a journey to that moment. The pacing must earn it.

See [energy-density-map.md] for the full energy budget system.

## Platform-Specific Visual Rules

### Safe Areas

Douyin overlays UI elements on the video. The hook frame must account for:

- bottom 200-300px: comment bar, interaction buttons
- right 80-100px: like/comment/share/follow buttons
- top 100px: status bar, creator info

The hook's primary visual anchor must live in the center-left of the frame, not bottom-right.

### Audio-On Default

Unlike Instagram (which defaults to muted), Douyin viewers mostly have audio on. The hook can rely on voice to complement the visual — but the visual must work alone first, then the audio amplifies.

### Vertical-First Composition

9:16 is not a rotated 16:9. Vertical composition stacks information top-to-bottom. The eye enters at the top-center and moves down. Place the hook's primary element in the upper 40% of the frame.

### Feed Color Context

Douyin's feed is dominated by dark backgrounds in tech/knowledge content. A deliberately light, bright, or high-saturation hook frame has a structural advantage because it breaks the feed's visual monotony. This is not a rule to always use light backgrounds — it is a thinking prompt: what color world would make this frame feel alien in the feed?

## State Writeback

The approved hook design must be recorded in `project-state.json.visual.hook_design`:

- `hook_pattern`: which pattern was chosen and why
- `hook_promise`: what the viewer expects after seeing the hook
- `hook_energy_level`: 1-10, sets the ceiling for the energy curve
- `hook_thumbnail_viable`: boolean — does the hook frame survive as a still?
- `hook_feed_contrast_note`: one sentence on how this frame differs from typical feed content
- `rejected_patterns`: which patterns were considered and why they were rejected
