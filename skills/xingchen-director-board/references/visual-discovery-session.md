# Visual Discovery Session

This is the heavier planning conversation before Xingchen locks a visual director board. Its purpose is to decide what each important frame is made of before any renderer, template, or asset generator takes over.

The session should be imaginative, not merely corrective. Start wide, then constrain. The agent should first invent bold visual possibilities that match the recording's actual emphasis, pauses, speed changes, and key words, then test them against short-video rules: 0.3-second feed stop, 3-second hook, vertical 9:16 hierarchy, subtitle safety, proof legibility, and Douyin UI overlays.

## When It Is Mandatory

Run this session for:

- hook scenes
- abstract concept scenes
- claim/proof scenes
- transition scenes that carry the argument
- ending/payoff scenes
- any scene where the user says the output feels PPT-like, rough, fake, flat, or visually cheap

Lightweight scenes may use a compressed version, but the board must still record why they do not need a full session.

## Conversation Questions

For each mandatory scene, answer:

1. What exact idea does this scene need the viewer to understand or feel?
2. Which recorded word, pause, stress, speed change, or sentence turn should the picture land on?
3. What should the viewer see first before reading or hearing the explanation?
4. What are two or three bold ways to make that first frame memorable without breaking the truth of the material?
5. Is the core picture built from real evidence, real source media, global asset library material, generated physical props, programmatic diagrams, 3D space, screen recording, or a mixed composition?
6. Which pixels, logos, UI, numbers, quotes, or timing details must remain faithful?
7. What must not appear on screen, especially internal metadata, fake proof UI, decorative labels, and narration-echo text?
8. What is the dominant object or structure in the frame?
9. What does the camera movement reveal that a static frame cannot?
10. What continuity handle passes into or out of the scene: keyword, number, line, shape, proof region, object, color logic, or camera vector?
11. Which asset source is most credible: existing project asset, global asset registry, official source capture, CC0 library, imagegen, Hunyuan3D, Blender, Remotion/R3F, HyperFrames, or manual user-provided material?
12. What would make this scene look like a PPT slide, and what specific design decision avoids that?

## Output

Record the result in `visual.director_board.brainstorming_contract.visual_discovery_session` and per scene in `scene_boards[].brainstorming_layer`.

Minimum per-scene record:

```json
{
  "scene_id": "",
  "session_required": true,
  "user_discussion_status": "discussed|agent_proposed|manual_review_required|not_needed",
  "picture_constituents": [],
  "dominant_visual_object": "",
  "asset_source_decision": "project_source|global_asset_library|official_capture|cc0_asset|imagegen|hunyuan3d|blender|remotion_native|r3f|hyperframes|manual_user_asset|mixed",
  "global_asset_candidate_ids": [],
  "new_asset_needed": false,
  "camera_reveal": "",
  "continuity_handle": "",
  "anti_ppt_commitment": "",
  "open_question_for_user": ""
}
```

When the user is present and the scene is important, prefer a focused back-and-forth over silent autopilot. When the user delegates completely, the agent may propose the answers, but it must still mark `user_discussion_status = "agent_proposed"` and list assumptions.

For recording-first videos, proposals that ignore the recording rhythm are incomplete even if the frame is visually rich. The board should say what detail appears before the key word lands, where the scene breathes with a pause, and which movement or stillness supports the voice.

## Failure Conditions

Return to this session instead of rendering when:

- the scene only says "premium", "cinematic", "tech style", or "dynamic"
- the plan does not say what the frame is physically or graphically made of
- the plan has no asset source decision
- the camera movement has no argumentative purpose
- generated assets are selected only because the agent cannot think of a code-native structure
- the plan would still compile into centered cards, chips, or subtitle-only frames
