# Extended Contract

> This historical contract applies only when project-state.json uses mode extended or a legacy state has no mode field. It does not add gates or required fields to Lean projects.


# Xingchen Director Board

## Lean Mode Override

When `project-state.json.mode === "lean"`, this section overrides every later conflicting requirement in this file.

- Work from approved script beats and real timing evidence when available.
- For each scene, write only `knowledge_change`, `dominant_visual`, `motion_action`, `proof_ref`, `safe_region`, `timing`, and the intended implementation route.
- Explore two or three genuinely different visual directions for the hook, hardest explanation or proof, payoff, and any unresolved high-risk scene. Ordinary scenes need one defended direction, not ritual brainstorming.
- State semantic relationships directly. Do not let small labels or abstract loops carry essential meaning.
- Preserve one useful continuity anchor across adjacent scenes when it helps the argument. Do not require an edge-board object for every cut.
- Do not require eight layers, a StoryMother, Visual Lock, analogy fields, one asset per noun, generated physical metaphors, camera amplitude, L2/L3 capability plans, or global resource preflight.
- Allow a scene to choose `hold` when stillness is the clearest visual action.

All later Visual Lock, eight-layer board, asset quota, L2/L3, camera, and physics requirements apply only to Extended or legacy projects.

## Knowledge Base Routing

For reusable video methodology, read stevenmind first:

- `C:\stevenmind\stevenmind\04 Wiki\视频创作\`
- `C:\stevenmind\stevenmind\04 Wiki\共享方法论\`
- `C:\stevenmind\stevenmind\04 Wiki\技术栈\`
- `C:\stevenmind\stevenmind\04 Wiki\抖音\` non-legacy pages

Do not read `C:\stevenmind\stevenmind\04 Wiki\公众号创作\`. That domain belongs to `wechat-*`.

Use local `references/`, `schema/`, and validators for executable contracts only: state fields, route policies, INV rules, validator logic, runtime commands, and rollback evidence. If a wiki page and a local reference overlap, use the wiki for method wording and the local reference for machine/state requirements.

Before crossing domains, verify with:

```powershell
python C:\stevenmind\stevenmind\tools\vault_manager.py read-check --root C:\stevenmind\stevenmind --skill xingchen-next --page "{page}"
```
## When to Enter

Run during `visual-direction`, immediately after `StoryMother Lock` and before `xingchen-art-direction`.

This skill owns the missing video-director stage. It does not choose the final whole-piece aesthetic system and it does not implement renderer specs. It writes the executable director board that later skills must obey:

`source understanding -> arrangement logic -> aesthetic intent -> main frame -> frame details -> components/tech stack -> subtitles`

Refuse to proceed from generic style words, renderer taste, or reusable templates. Every scene board must explain what the current user material says, how the recording or narration moves, what picture should carry the beat, which component should express it, and why the selected technical stack is justified.

For every scene picture and every scene-to-scene flow decision, run a `superpowers/brainstorming`-style exploration before selecting the final design. The board must preserve the brainstorm result: question, options considered, selected direction, why selected, continuity handles, and anti-PPT decision. This is not a casual ideation note; it is Visual Lock evidence.

The exploration must start imaginatively. Do not begin with renderer names or safe layouts. For important scenes, propose two or three bold visual events that could stop a short-video viewer, then explain how each one maps to the recording's emphasis, pause, speed, or key word and how it survives vertical 9:16, subtitle safety, proof legibility, and anti-PPT constraints. A detailed, voice-matched picture can be unusual, physical, spatial, abstract, generated, code-native, or mixed; the failure is not boldness, but vague or under-designed picture responsibility.

When an LLM or assistant returns director-board JSON, recover it through [llm-json-recovery.md](../../xingchen-next/references/llm-json-recovery.md) before writing `visual-director-board.json` or `project-state.json`. Strip Markdown fences or wrapper prose deterministically, validate required fields, and leave state unchanged if parsing or validation fails.

## Inputs

Read these state and artifact layers first:

- `sources.source_pack`, `sources.asset_manifest`, `sources.transcript.segments`
- `proof.claims[]`, `proof.evidence_items[]`
- `script.spoken_script.blocks[]`, `script.beat_map.scenes[]`
- `mother.story_mother.scene_order[]`, `scene_cards[]`, `proof_binding[]`, `narration_spine[]`
- existing `visual.source_material_plan`, `visual.recording_visual_brief`, `visual.scene_decisions`, and legacy `visual.material_director_pass` when present
- available component/shot vocabulary from [shot-library.md](../../xingchen-visual-compiler/references/shot-library.md)
- ReactBits-to-Remotion upgrade guidance from [reactbits-remotion-upgrade.md](../../xingchen-visual-compiler/references/reactbits-remotion-upgrade.md) when a scene needs kinetic keywords, proof focus cards, concept fields, bento maps, tactile reveals, or stat emphasis
- technical-stack rules from [tech-stack-director-matrix.md](./tech-stack-director-matrix.md)
- Visual Discovery Session guidance from [visual-discovery-session.md](./visual-discovery-session.md)
- Visual Collaboration guidance from [visual-collaboration-contract.md](../../xingchen-next/references/visual-collaboration-contract.md), especially matching picture options to recording rhythm, proposing bold concrete alternatives, recording user feedback or assumptions, and applying lessons from prior visual failures
- language-game correction guidance from [language-game-correction.md](../../xingchen-next/references/language-game-correction.md), especially turning vague aesthetic words and metaphors into source meaning, scene questions, object behavior, camera reveal, or lookdev criteria
- Huashu taste preflight guidance from [huashu-design-taste-upgrade.md](../../xingchen-next/references/huashu-design-taste-upgrade.md), especially core asset protocol, honest placeholders, anti-AI-slop questions, and continuous-motion narrative rules
- GitHub design intake guidance from [github-design-skill-intake.md](../../xingchen-next/references/github-design-skill-intake.md), especially fact check, real assets, design-system declaration, anti-slop bar, and five-dimension review plan
- visual resource and prompt preflight guidance from [visual-resource-and-prompt-preflight.md](../../xingchen-next/references/visual-resource-and-prompt-preflight.md), especially design-system memory, SVG/icon selection, Remotion package routes, and imagegen prompt-pack requirements
- global visual asset library guidance from [visual-asset-library-governance.md](../../xingchen-next/references/visual-asset-library-governance.md), especially registry lookup before new downloads, `global_asset_candidate_ids[]`, and project usage manifests
- public commercial b-roll guidance from [commercial-video-footage-scout.md](../../xingchen-next/references/commercial-video-footage-scout.md), especially source license checks, attribution, people/brand/property risk, and Remotion `video_plate` integration
- spoken knowledge motion guidance from [spoken-knowledge-motion-grammar.md](../../xingchen-next/references/spoken-knowledge-motion-grammar.md) when the user is a voice-led knowledge creator, AI explainer, or recording-first educational author
- optional editorial collage motion guidance from [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md) when the user, art-direction pass, or source-study asks for Vox/Remotion-style visual influence. Treat it as scene-contract vocabulary, not a template.

Recording-first projects must read `sources.recording_correction` before visual design. If the user has provided narration audio, do not design pictures from raw audio alone: require corrected transcript truth, cleanup report, and rhythm evidence first.

Language-game correction is mandatory for key scene words before the board can be considered complete. Words like `高级`, `电影感`, `更丰富`, `黑箱`, `飞轮`, `系统`, and `像人讲的` must be rewritten into public scene criteria in existing fields: `source_layer.what_material_says`, `brainstorming_layer.scene_question`, `brainstorming_layer.why_selected`, `frame_layer.camera_path`, `frame_layer.on_screen_text[].purpose`, `tech_stack_layer.why_this_stack`, or `lookdev_acceptance`. If the board cannot make the use public, set `status` to `manual_review_required` or add the issue to `unresolved_questions`.

## Output Contract

Write both files into the project workspace:

- `visual-director-board.md` for human review
- `visual-director-board.json` for `xingchen-art-direction`, `xingchen-visual-compiler`, and `xingchen-lookdev`

Then write the same machine contract into:

`project-state.json.visual.director_board`

The state object must be:

```json
{
  "status": "completed",
  "board_md_path": "visual-director-board.md",
  "board_json_path": "visual-director-board.json",
  "global_director_thesis": "",
  "aesthetic_system": {},
  "brainstorming_contract": {
    "visual_collaboration": {}
  },
  "scene_boards": [],
  "scene_edge_boards": [],
  "component_registry_plan": [],
  "subtitle_system": {},
  "tech_stack_policy": {},
  "lookdev_acceptance": [],
  "unresolved_questions": []
}
```

`status` may be `completed`, `manual_review_required`, or `blocked`. Use `blocked` when a missing source asset, missing transcript timing, unresolved proof claim, or impossible renderer route prevents a defensible board. Use `manual_review_required` only when the board is complete but a human taste or source interpretation call cannot be automated.

## Required Scene Board

Create one `scene_boards[]` entry for every `mother.story_mother.scene_order[]` scene. Field names are fixed.

```json
{
  "scene_id": "",
  "scene_job": "hook",
  "source_layer": {
    "source_unit_ids": [],
    "what_material_says": "",
    "must_preserve": "",
    "can_transform": "",
    "evidence_role": "hero"
  },
  "arrangement_layer": {
    "narration_refs": [],
    "voice_timing": "",
    "beat_before_keyword": "",
    "scene_duration_sec": 0,
    "transition_in": "",
    "transition_out": ""
  },
  "brainstorming_layer": {
    "skill_ref": "superpowers/brainstorming",
    "scene_question": "",
    "knowledge_action": "define|compare|decompose|prove|invert|compress|expand|summarize|bridge|hook",
    "options_considered": [],
    "selected_direction": "",
    "why_selected": "",
    "continuity_handles": [],
    "anti_ppt_decision": "",
    "analogy_pass": {
      "required_by_tier": true,
      "concept_being_explained": "",
      "lay_analogy": "",
      "analogy_carrier_visual": "",
      "domain_term_used_in_voice": false,
      "domain_term_appears_on_screen": false,
      "self_check_persona_pass": "",
      "jargon_safety_net": "",
      "concrete_execution_plan": {
        "asset_kind": "imagegen_2d|hunyuan3d_mesh|comfyui_workflow|remotion_dataviz|screen_recording_annotated|infographic_svg|chibi_layered|stock_photo_annotated|mixed_compose",
        "generation_skill_route": "imagegen|comfyui_hunyuan3d|local_cli|manual_implementation|remotion_native",
        "generation_prompt": "",
        "generation_negative_prompt": "",
        "style_reference": "",
        "expected_output_paths": [],
        "enumerated_concepts": [],
        "additional_asset_specs": [],
        "concept_object_plan": "",
        "motion_primitives": [],
        "generated_prop_decision": "not_needed|selected_with_quality_reason|rejected_for_explainer_clarity",
        "quality_reason": "",
        "lookdev_risk": "",
        "fallback_to_programmatic_structure": "",
        "remotion_layout_plan": "",
        "camera_intent": "push_in|pull_out|orbit|dolly_left|dolly_right|crane_down|pan|whip_pan|freeze_zoom|held",
        "camera_motion_reveals": "",
        "camera_scale_change": 0,
        "camera_translate_px": 0,
        "remotion_animation_depth": {
          "l2_capabilities_used": [],
          "l3_capabilities_used": [],
          "physics_targets": []
        },
        "fallback_plan": "",
        "asset_realized": false,
        "asset_realized_paths": []
      }
    }
  },
  "aesthetic_layer": {
    "aesthetic_role": "",
    "color_temperature": "",
    "density": "moderate",
    "energy_level": 7,
    "contrast_to_prev_scene": "",
    "cheapness_to_avoid": []
  },
  "frame_layer": {
    "main_frame_design": "",
    "dominant_anchor": "",
    "layout_pattern": "",
    "camera_path": "",
    "depth_plan": "",
    "proof_regions": [],
    "subtitle_safe_region": "",
    "on_screen_text": [
      {
        "text": "",
        "cite_source": "",
        "cite_quote": "",
        "purpose": "title|callout|label|caption|proof_quote"
      }
    ]
  },
  "detail_layer": {
    "lighting": "",
    "material_surface": "",
    "typography_role": "",
    "motion_verbs": [],
    "micro_interactions": [],
    "failure_risks": []
  },
  "component_layer": {
    "primary_component": "",
    "supporting_components": [],
    "component_props_brief": "",
    "fallback_component": "",
    "kit_extension_needed": false
  },
  "subtitle_layer": {
    "subtitle_mode": "bottom_bar",
    "subtitle_position": "",
    "keyword_highlights": [],
    "must_not_cover": [],
    "relationship_to_voice": ""
  },
  "tech_stack_layer": {
    "primary_stack": "remotion",
    "integration_mode": "",
    "why_this_stack": "",
    "rejected_stacks": [],
    "preview_required": ""
  },
  "lookdev_acceptance": {
    "still_frame_check": "",
    "motion_check": "",
    "proof_readability_check": "",
    "aesthetic_check": ""
  }
}
```

## Required Scene Edge Board

Create one `scene_edge_boards[]` entry for every adjacent pair in `mother.story_mother.scene_order[]`. These edges are where knowledge-video continuity is designed. They are not generic transition effects.

```json
{
  "edge_id": "",
  "from_scene_id": "",
  "to_scene_id": "",
  "skill_ref": "superpowers/brainstorming",
  "bridge_question": "",
  "options_considered": [],
  "selected_bridge": "",
  "narrative_bridge": "",
  "continuity_handle_kind": "keyword|number|shape|line|frame|arrow|color|motion|layout|proof_region|question_answer|scale_shift",
  "out_handle": "",
  "in_handle": "",
  "transition_method": "keyword_relay|proof_region_relay|diagram_morph|scale_shift|axis_handoff|question_answer_cut|color_logic_cut|subtitle_to_visual|hard_cut|breath_cut",
  "cut_moment": "",
  "duration_frames": 8,
  "anti_ppt_risk": "",
  "lookdev_acceptance": ""
}
```

Knowledge videos may have few physical objects. Continuity handles can be designed graphics, not only extracted objects: keyword, number, underline, proof region, frame, arrow, color logic, layout state, or voice emphasis. The goal is not decorative transition; it is making the viewer feel the argument is moving.

## Procedure

### 0. Visual Discovery Session

Before scene boards are locked, run the heavier Visual Discovery Session for hook scenes, abstract concept scenes, proof scenes, transition scenes that carry the argument, and payoff scenes. If the user is present, discuss these scenes one by one; if the user delegates, propose the answers and mark them as agent assumptions.

For each required scene, decide:

- what the frame is made of: real proof, source media, global asset library item, commercially usable b-roll, generated prop, Remotion/R3F concept structure, 3D space, screen recording, or mixed composition
- which existing global assets might work, using `global_asset_candidate_ids[]`
- what new asset is truly needed, if any
- what the dominant visual object or structure is
- what the camera movement reveals
- what continuity handle connects this scene to its neighbors
- which specific decision prevents a PPT-style card/chip/subtitle-only fallback

Record project-level findings in `visual.director_board.brainstorming_contract.visual_discovery_session`. Record scene-level decisions in `scene_boards[].brainstorming_layer` and, when useful, inside `concrete_execution_plan`.

### 1. Source Unit Reading

Break user material into named source units. For each source page, screenshot, clip, note, link, audio segment, or transcript beat, state:

- what it literally contains
- what claim, feeling, or contradiction it expresses
- what pixels, wording, order, or context must remain faithful
- what can be transformed into design language
- whether it is hero evidence, supporting proof, background texture, or reference-only

If the input is a recording or transcript, map the pauses, emphasis beats, sentence turns, and speed changes before designing pictures.

### 2. Scene Arrangement

Walk `mother.story_mother.scene_order[]` in order. For each scene, decide its scene job, duration, incoming/outgoing transition, narration refs, and the beat that should visually arrive before the keyword. The viewer should feel that the picture is anticipating the voice, not lagging behind it.

### 2.5 Brainstorm Scene Picture

For every scene, run a compact brainstorming pass:

- Ask what knowledge action the scene performs: define, compare, decompose, prove, invert, compress, expand, summarize, bridge, or hook.
- Consider at least two materially different visual directions.
- Select one direction and state why it serves the voice and proof better than the alternatives.
- Define continuity handles that can be passed into or out of adjacent scenes.
- State how the design avoids becoming a static PPT page.

Write the result into `scene_boards[].brainstorming_layer`.

### 2.55 Editorial Collage Scene Contract

When `visual.visual_policy.visual_style_influence.source = "vox_remotion_visual_style"` or the project explicitly selects that influence, translate [vox-remotion-visual-style.md](../../xingchen-next/references/vox-remotion-visual-style.md) into existing scene-board fields:

- choose one dominant foreground proof carrier for the beat; write it into `frame_layer.dominant_anchor` and `proof_regions[]`
- keep a shared `world_base` through `frame_layer.depth_plan`, `aesthetic_layer`, and continuity handles
- place halftone/cutout figures only as mid-ground context in `detail_layer` and `component_layer.supporting_components[]`
- use red offset marker strokes only for figure-ground separation, path, warning, tension, or emphasis; name that semantic role in `detail_layer.motion_verbs` or `lookdev_acceptance`
- bind the foreground reveal to `arrangement_layer.beat_before_keyword` and speech-rhythm evidence when available
- put all Chinese text, data labels, subtitles, charts, proof highlights, and callouts into Remotion-owned `frame_layer.on_screen_text[]`, `subtitle_layer`, or downstream SVG/Canvas code; never into generated plates
- write the needed prop controls in `component_layer.component_props_brief`, including x/y/scale/crop/opacity/marker offset/halftone/grid controls
- for 9:16, make the proof carrier and subtitle/proof safe zones explicit; if the proof cannot survive phone downsampling, set `manual_review_required`

### 2.6 Huashu Taste Inputs

Before leaving each scene board, translate the Huashu taste preflight into existing scene fields. Do not add a generic style layer; make the current scene more specific.

- `source_layer.must_preserve`: name the real source pixels, UI, product, object, logo, document, or screenshot that cannot be faked
- `source_layer.can_transform`: say exactly what may be redrawn, abstracted, cropped, or generated without breaking truth
- `brainstorming_layer.options_considered[]`: include materially different picture directions, not only palette or card-layout variants
- `brainstorming_layer.selected_direction`: explain why this direction beats the dull/default direction
- `brainstorming_layer.continuity_handles[]`: include any hero element, keyword, number, shape, proof region, camera vector, or color logic that should survive into adjacent scenes
- `brainstorming_layer.anti_ppt_decision`: name how the picture avoids the "independent slide with fade-up text" failure
- `aesthetic_layer.cheapness_to_avoid[]`: include likely AI slop for this exact scene, such as fake dashboard, decorative gradient/glow, stock-photo filler, CSS/SVG fake product, generated proof UI, status chip, or narration echo
- `frame_layer.main_frame_design`: state whether the frame uses real source media, generated assets, programmatic data/graphics, or an honest placeholder
- `lookdev_acceptance.aesthetic_check`: include the five-axis review concern that is most likely to fail for this scene

If a concrete brand, product, UI, screenshot, physical object, or proof document is central and no real asset or honest placeholder exists, set board `status: "blocked"` or `manual_review_required`. Do not let downstream solve it by drawing a fake object from CSS or SVG.

### 2.7 Visual Resource Inputs

Before leaving each scene board, translate the visual resource preflight into existing scene fields. This is where GitHub/library research becomes executable scene direction rather than a bookmark list.

- Check `C:\Users\liuzh\Videos\douyin\visual-assets\registry\asset-registry.json` before web search or generation. If a suitable asset exists, cite its `asset_id` and local path; if no suitable asset exists, record the search/generation gap and planned registry write.
- When a global asset is selected, add it to the project usage manifest and reference it in `resource_preflight.global_asset_candidate_ids[]` or the scene-level visual discovery record.
- When public stock footage is a candidate, create `stock-footage-scout.md/json`, record commercial-use status and attribution needs, and route the clip as `source_media` / `video_plate`. Reject editorial-only, restricted, unclear-license, or brand/person-risk clips before Visual Lock.
- `brainstorming_layer.options_considered[]`: include at least one route-level alternative when relevant, such as source-media proof, imagegen physical prop, programmatic SVG/data, Remotion-native 3D, Lottie plate, or AI-video insert
- for spoken knowledge / oral AI explainer scenes, include a Remotion-native concept-motion alternative before selecting any generated prop; cite `spoken-knowledge-motion-grammar.md` and name 1-3 `motion_primitives[]`
- `brainstorming_layer.analogy_pass.concrete_execution_plan.generation_prompt`: use the prompt-pack schema when the asset is generated; include subject, composition, camera/lens, lighting, materials, palette tokens, text policy, expected output path, and Remotion overlay plan
- `brainstorming_layer.analogy_pass.concrete_execution_plan.style_reference`: cite the selected visual-system or imagegen style reference, not a vague "premium style"
- `component_layer.component_props_brief`: name the selected SVG/icon/vector library when the component depends on it, such as `lucide`, `tabler-icons`, `@remotion/shapes`, `@remotion/paths`, `d3`, or `roughjs`
- `tech_stack_layer.why_this_stack`: include the selected Remotion package or SVG/data library when it is central to the scene; explain why a simpler card/fade would fail
- `tech_stack_layer.rejected_stacks[]`: record rejected libraries or routes, such as `SVG rejected for physical object`, `imagegen rejected for proof UI`, or `Lottie rejected because no deterministic source file`
- `lookdev_acceptance.motion_check`: include package-level audit hooks, such as `grep @remotion/paths import`, `verify D3-generated axis labels come from cited data`, or `OCR imagegen asset for text`

If any selected route requires an uninstalled package, record the dependency as an install request for downstream compiler. Do not downgrade from an intended L2/L3 Remotion route to opacity and translate just because the package is absent.

**当 `audience.tier ∈ {lay_scrolling, lay_curious}` 时，本步骤必须额外产出 `analogy_pass`**：

- `concept_being_explained`: 该场要解释的抽象概念（如"RAG 检索增强"、"Agent 工作流"、"上下文窗口"）
- `lay_analogy`: 给普通人的类比一句话（如"AI 现场翻书做答而不是凭记忆"、"AI 像一个会跑腿的实习生"、"AI 的短期记忆容量"）
- `analogy_carrier_visual`: 这个类比靠什么具象画面承载（如"一个人桌前 + 一摞书 + 在翻动"、"一个穿西装的人在跑腿 + 一张待办清单"）
- `domain_term_used_in_voice` / `domain_term_appears_on_screen`: 是否在口播 / 画面使用该术语（true 时必须有 `jargon_safety_net`）
- `self_check_persona_pass`: 用 `audience.self_check_persona`（如"我妈"）视角自检，本场画面能否被理解
- `jargon_safety_net`: 如果 voice 必须用术语，画面在术语出现前 2 秒内必须有类比铺底

`anti_ppt_decision` 管"画面动作不像 PPT"，`analogy_pass` 管"概念翻译给普通人"。两者并存不替代——前者让画面动起来，后者让画面被听懂。

**`concrete_execution_plan` —— 从"类比文字"到"可生成素材"的强制翻译**（tier ≤ `lay_curious` 时必填）：

只写 `lay_analogy: "AI 像翻书"` 是空头支票——AI 在下游 visual-compiler 会 fall back 到 `<div className="card">AI 像翻书</div>` + 字幕，画面还是 PPT。本字段强制 AI 在 director-board 阶段就把类比落地成**具体的素材生成指令**：

- `asset_kind`: 选一个素材类型枚举：
  - `imagegen_2d` —— 用 imagegen skill 出 2D 图（手绘风/插画风/信息图/剖面图，回形针主力）
  - `hunyuan3d_mesh` —— 用本地 ComfyUI + Hunyuan3D 出 3D 道具/物件
  - `comfyui_workflow` —— 自定义 ComfyUI 工作流（SDXL + ControlNet + IP-Adapter 等组合）
  - `remotion_dataviz` —— Remotion 程序化概念结构 / 数据可视化（路径、轨道、层级、节点图、反馈回路、条形图、折线、网络图、比例尺）；口播知识视频的抽象隐喻优先走这里
  - `screen_recording_annotated` —— 已有屏幕录制 + Remotion 程序化标注覆盖
  - `infographic_svg` —— SVG 程序化生成或手绘风信息图
  - `chibi_layered` —— 你已有的 chibi 立绘平面动画（猫导演那套）
  - `stock_photo_annotated` —— 真实摄影/图库照片 + Remotion 标注
  - `mixed_compose` —— 多素材组合（imagegen 图 + Hunyuan3D 道具 + Remotion 标注 等）
- `generation_skill_route`: AI 在 visual-compiler 阶段要调用哪个 skill：`imagegen` / `comfyui_hunyuan3d`（本地 CLI）/ `local_cli` / `manual_implementation`（需用户手动跑）/ `remotion_native`（无外部生成）
- `generation_prompt`: **完整的、可直接喂给目标 skill 的 prompt 文本**。不是"想象一张图"——是字面 imagegen prompt（含风格、构图、视角、光线、配色、负面 prompt 引导）。若 `generation_skill_route === "remotion_native"`，写 `"not_needed_programmatic"`，并把具体画面落到 `concept_object_plan` / `motion_primitives[]` / `remotion_layout_plan`。
- `generation_negative_prompt`: 要避免的元素（如"no dashboard UI / no terminal log / no tech glow"）
- `style_reference`: 风格参考（如"回形针 PaperClip 手绘剖面图风"、"Kurzgesagt chibi 平面"、"3Blue1Brown manim 数学动画"），帮助 imagegen 锁定 aesthetic
- `expected_output_paths`: 预期素材保存位置（visual-compiler 跑完后会填 `asset_realized_paths` 对照验证）
- `remotion_layout_plan`: 这张素材在 Remotion 场景里**怎么放**——初始位置/缩放、镜头如何运动（推/拉/摇/orbit）、字幕在哪、其它图层 z-order
- `concept_object_plan`: 当选择 `remotion_dataviz` / `infographic_svg` 作为口播解释结构时，说明抽象概念如何变成可运动对象：线、框、轨道、层级、节点、扫描窗、证明区域、反馈回路等
- `motion_primitives[]`: 从 `spoken-knowledge-motion-grammar.md` 选择 1-3 个动作语义（如 `RouteDraw` / `BlockSnap` / `ProofPushIn`），不是泛泛写"动效高级"
- `generated_prop_decision`: 记录生成道具是否被拒绝或选用；口播知识视频默认 `rejected_for_explainer_clarity`，除非 `quality_reason` 能说明真实材质为什么必要且可通过 lookdev
- `enumerated_concepts[]`: **当口播稿或 lay_analogy 中并列出现多个具象名词时（如"杂乱文本/图片/聊天记录/语气/文档/PPT/视频"7 个），逐一列出**。是 audit `asset_specs_completeness_check` 的判定依据。如果只有 1 个核心概念可填空数组。
- `additional_asset_specs[]`: **当 `enumerated_concepts.length > 1` 时必填**。每个额外名词对应一个完整 spec（含 `concept_name` / `asset_kind` / `generation_skill_route` / `generation_prompt` / `expected_output_paths`）。**这是阻止 AI 用 div 卡片凑 N 个概念的根本机制**——每个名词都得有自己的真实素材。例：R04 的"7 种杂乱素材"必须 `enumerated_concepts=["杂乱文本","图片","聊天记录","语气","文档","PPT","视频"]` + `additional_asset_specs[]` 长度 ≥ 7（每个一张 imagegen 实拍物件图，而非 7 个 div 卡片）。
- `remotion_layout_plan`: 这张/这组素材在 Remotion 场景里**怎么放**——初始位置/缩放、镜头如何运动、字幕在哪、其它图层 z-order。**必须明确镜头运动**（不是"轻微飘动" / "微抖"）。
- `camera_intent`: 镜头运动类型（强制 enum）：
  - `push_in` —— 推进到细节，scale 涨 ≥ 0.3 或 0.4
  - `pull_out` —— 拉远到系统，scale 降 ≥ 0.3
  - `orbit` —— 围绕物件转（需 @remotion/three）
  - `dolly_left` / `dolly_right` —— 横向大幅扫过 translateX ≥ 视口 15%
  - `crane_down` —— translateY + scale 同步
  - `pan` —— 横向中速扫
  - `whip_pan` —— 极快横扫（≤200ms）配 motion blur
  - `freeze_zoom` —— 关键时刻 Freeze + 推进
  - `held` —— **仅 `scene_job === "rest"` 时允许**，其他场景禁用（违反 `INV-CAMERA-AS-ARGUMENT`）
- `camera_motion_reveals`: 镜头运动**揭示了什么**（如"推进暴露玻璃裂纹细节" / "环绕揭示机械臂三个组件" / "拉远揭示整个系统空间关系"）。不能写"装饰性运镜" / "增加电影感"——必须是叙事性目的。
- `camera_scale_change`: 镜头 scale 变化绝对值（如 0.3 表示从 1.0 推到 1.3 或 0.7）。`held` 之外的 intent 至少 0.15。
- `camera_translate_px`: 镜头 translate 累计幅度（px）。`held` 之外的 intent 至少视口 15%（1080p 9:16 ≈ 162px / 1920px 横屏 ≈ 288px）。
- `remotion_animation_depth.l2_capabilities_used[]`: 本场景计划使用的 L2 能力枚举（见 [`remotion-animation-depth.md`](../../xingchen-visual-compiler/references/remotion-animation-depth.md)）。**必须至少 1 个**。可选值：`spring_physics` / `multi_layer_parallax` / `real_camera_motion` / `remotion_paths_evolve` / `animation_utils_transform` / `freeze_frame` / `particle_system_50plus` / `transitions_package` / `shapes_package` / `multi_sequence_loop`。
- `remotion_animation_depth.l3_capabilities_used[]`: 本场景计划使用的 L3 能力枚举。**全片至少 1 个 scene 使用 ≥ 1 个 L3**。可选值：`three_3d_canvas` / `media_utils_audio_data` / `paths_interpolate_morph` / `motion_blur` / `skia_canvas` / `matter_physics` / `lottie` / `frame_time_remap` / `webgl_shader` / `noise_procedural`。
- `remotion_animation_depth.physics_targets[]`: 列出本场景需要物理（spring / 物理引擎）的物件（如"杂乱素材进玻璃舱" / "天花板震动" / "粒子聚散"）。涉及"进入/离开/碰撞/弹跳/散落"动作的目标 ⇒ 必须用 spring 或物理引擎，**禁用 linear interpolate translate**（违反 `INV-PHYSICS-OVER-LINEAR`）。
- `fallback_plan`: 素材生成失败时的降级（如"如果 imagegen 出不来回形针风，降级到 chibi_layered"）

**写完后 AI 必须自检 3 个问题**：

1. 如果这是 imagegen / Hunyuan3D 路线，这个 `generation_prompt` 现在丢给生成工具能直接出图吗？如果这是 `remotion_native` 路线，`concept_object_plan` + `motion_primitives[]` 能直接让 visual-compiler 写组件吗？
2. 这个 `remotion_layout_plan` 现在丢给 visual-compiler，能直接写出 Remotion 组件吗？（如果还需要再想"怎么放"，plan 不够具体）
3. 跑完整套 pipeline 后，画面是否还会出现 `<div>` + 字幕的 fall back？如果会，说明 plan 没把素材路径锁死。

详细套路库见 [concrete-analogy-playbook.md](../../xingchen-next/references/concrete-analogy-playbook.md)，每种 `asset_kind` 配 prompt 模板和 remotion_layout 草图。

**职责分工（强制原则）**：选 `asset_kind` 时必须按 [`imagegen-vs-remotion-division.md`](../../xingchen-visual-compiler/references/imagegen-vs-remotion-division.md) 的 3 问决策矩阵：

- **物件层**（纸/照片/机器/人物/场景/质感物，且画面意图要求真实材质） ⇒ `imagegen_2d` / `hunyuan3d_mesh` / `stock_photo_annotated`
- **信息层**（中文字幕/标签/状态/数据/图表/箭头/几何关系） ⇒ Remotion 程序绘制（不进 asset_kind）
- **口播知识抽象隐喻**（黑箱、锁定、路线、边界、积木、反馈等只是论证结构，不是要看一个真实道具） ⇒ `remotion_dataviz` / `infographic_svg` + `concept_object_plan`，不强行 imagegen
- **绝不**用 SVG / div + skewX 假装真实物件（违反 `svg-mimicking-physical-object` forbidden pattern）
- **绝不**让 imagegen 在图里生成中文文字（违反 `INV-IMAGEGEN-NO-CHINESE-TEXT`）—— 所有 `generation_prompt` 必须含 negative prompt：`"no Chinese text in image, no Chinese characters, no text inside the artwork, leave clean space for overlay caption"`

### 2.6 On-Screen Text Source Citation

AI 在写 `frame_layer.on_screen_text[]` 时必须**逐条 cite 来源**。这是阻止 AI 把项目内部 metadata 字段名/scene id 顺手塞进画面的根本手段。

**允许的 cite_source 类型**：

1. `script.spoken_script.line_N` —— 这条画面文字是口播稿第 N 行的关键词。`cite_quote` 必须是 line N 原文中的一段，且能在 line N 中找到。
2. `analogy_pass.lay_analogy` —— 这条画面文字是 `brainstorming_layer.analogy_pass.lay_analogy` 中的具象词（如类比是"翻书查答"，画面词可以是"书"、"翻动"）。
3. `source_material.{asset_id}.original_text` —— 这条画面文字是原始截图/录屏/PDF 里**就有**的文字（来自 `sources.asset_manifest[asset_id]` 内容）。

**禁止的 cite_source**：

- 项目元数据字段名：`scene_id`、`evidence_role`、`job`、`knowledge_action`、`hook_pattern`、`energy_level` 等
- 项目内部章节名：`scene-board.md`、`S01-question`、`scene-03-prove`、`director-board.json`
- 工具/skill 名：`xingchen-proof-pack`、`xingchen-visual-compiler`、`VoxCPM2`、`Remotion`、`Hyperframes`、`Seedance`
- Workflow 状态值：`Visual Lock`、`scene board locked`、`tier_locked_at`、`Created N files`

**AI 找不到合法 cite 时的正确行为**：让画面只剩视觉无文字（`on_screen_text` 为空数组或 `null`）。**不要强行写一条 metadata 文字凑数**——空画面比 PPT 画面好 10 倍。

**自检流程**（AI 在写每条 `on_screen_text[]` 时自问）：

1. 这条文字是观众在视频里**会听到**的（来自口播稿）吗？
2. 这条文字是用户提供的**源材料里本来就有**的（来自截图、PDF）吗？
3. 这条文字是这一场**类比的具象词**（来自 `analogy_pass.lay_analogy`）吗？

三个问题都答"不是" ⇒ 这条文字不应该写进 `on_screen_text[]`。

### 3. Aesthetic Intent

Write a concrete scene-level aesthetic role, not a whole-video style slogan. State whether the scene clarifies, shocks, slows, validates, compresses, opens space, or pays off. Name color temperature, density, energy level, and what cheap pattern this scene could accidentally fall into.

### 4. Frame Construction

Describe the main frame like a director talking to a designer:

- the dominant anchor and its frame position
- layout pattern and read path
- camera path when motion or 3D is used
- depth plan even for flat scenes
- proof regions that must stay inspectable
- subtitle safe region

For HTML 3D, the `camera_path` and `depth_plan` must explain what the camera reveals. For Spark, the frame must state the spatial/world reason.

### 5. Detail Design

Specify lighting, material surface, typography role, motion verbs, micro interactions, and likely failure risks. This layer is where the board prevents the "technically correct but visually cheap" failure.

### 6. Components and Technical Stack

Choose `component_layer.primary_component` and `supporting_components` from the current kit/shot library when possible. If the scene needs a missing component, set `kit_extension_needed: true` and name the fallback component.

If a scene uses a ReactBits-inspired upgrade, do not put only the ReactBits component name into the board. Name the Xingchen component or extension brief (`KineticKeywordReveal`, `ProofFocusCard`, `EvidenceStackMorph`, `ConceptFieldPlate`, `KnowledgeBentoMap`, `TactileStickerRelay`, or `CountPressureStat`), cite the ReactBits reference names in `component_props_brief`, state how the motion will be frame-driven in Remotion, and keep proof/subtitle regions explicit.

Choose `tech_stack_layer.primary_stack` from:

`remotion`, `html_3d`, `hyperframes`, `spark`, `vibemotion`, `source_media`, `gen_insert`

Use [tech-stack-director-matrix.md](./tech-stack-director-matrix.md) for selection, rejection, and preview conditions. Rejected stacks are not optional decoration; they prove that the chosen route was considered.

When selecting `gen_insert`, write the route as a bounded AI video/image candidate lane such as Seedance/manual platform output. The board must state the visual gap, why generated motion is needed, what proof/text/subtitle ownership is excluded, and how Remotion will composite the result as a `video_plate`. Do not select `gen_insert` for hero proof, readable UI evidence, source inspection, subtitles, or a generic premium background. If Codex has no API, downstream compiler should produce a prompt pack first and wait for the user-generated file before registering a candidate.

Runtime adapters are not called from this stage. The board may route a scene toward Remotion implementation support or HyperFrames candidate generation later, but here it only states why that route serves the source, voice timing, frame, component, and subtitle plan. Downstream adapter use is traced in `render.plugin_adapter_runs[]`; in Claude Code this will be local CLI/local skill/manual rather than Codex plugin.

### 7. Subtitle System

Subtitles are part of composition. For every scene, choose `bottom_bar`, `floating_caption`, `keyword_only`, or `none`. Declare exact position, keyword highlights, `must_not_cover`, and relationship to voice. The subtitle layer must inherit the proof and anchor constraints from the frame layer.

### 8. Scene Flow Brainstorm

After all scene boards exist, run a second brainstorming pass for each adjacent scene pair. Decide how the knowledge continues:

- keyword relay: emphasized word becomes next visual node
- proof region relay: a highlight frame expands into the next scene container
- diagram morph: a simple relation becomes a fuller diagram
- scale shift: local proof zooms out to system map, or vice versa
- axis handoff: number becomes timeline, axis, ruler, or progress structure
- question-answer cut: question frame folds into answer structure
- color logic cut: color carries meaning, not decoration
- subtitle-to-visual: a spoken keyword triggers the next picture

Write these into `visual.director_board.scene_edge_boards[]`.

## Human MD Format

Use [visual-director-board.template.md](../templates/visual-director-board.template.md). Every scene must use the eight-layer structure:

1. Source Layer
2. Arrangement Layer
3. Brainstorming Layer
4. Aesthetic Layer
5. Frame Layer
6. Detail Layer
7. Component / Tech Layer
8. Subtitle Layer

The MD must also include the Visual Resource Preflight summary and Scene Edge Boards for scene-to-scene flow.

The MD should read like a real video director board, not a field dump. It should be specific enough that a designer can sketch the scene, a renderer can implement it, and lookdev can reject it with exact field paths.

## Machine JSON Format

Use [visual-director-board.template.json](../templates/visual-director-board.template.json). Keep keys stable. Do not add ad hoc field names unless `unresolved_questions[]` says why the schema needs extension.

## Downstream Boundaries

- `xingchen-art-direction` consumes the board and extracts the whole-piece aesthetic system. It does not rewrite the per-scene director board.
- `xingchen-visual-compiler` may only select components and technical routes from `scene_boards[].component_layer` and `scene_boards[].tech_stack_layer`.
- `xingchen-visual-compiler` must compile `scene_edge_boards[]` into transition primitives or raise a kit extension request.
- `xingchen-lookdev` audits previews against the exact layers and reports failures as paths such as `scene-03.brainstorming_layer.anti_ppt_decision`, `scene-03.frame_layer.camera_path`, `scene-05.subtitle_layer.must_not_cover`, or `edge-scene-03-to-scene-04.selected_bridge`.

## Visual Lock Rule

`Visual Lock` fails unless `visual.director_board.status` is `completed` or `manual_review_required`, every StoryMother scene has a `scene_boards[]` entry, every adjacent scene pair has a `scene_edge_boards[]` entry, every scene board has all eight layers filled with specific, non-generic decisions, the GitHub design intake is recorded in `brainstorming_contract.github_design_intake`, and the visual resource preflight has current source/library/prompt-pack evidence for the project. Routes that are not needed must be marked `not_needed`; the preflight itself is never optional.

Additional rules tied to audience tier and on-screen text:

- When `visual_style_influence.source = "vox_remotion_visual_style"`, every non-rest scene must encode the editorial collage scene contract: shared world base, one foreground proof carrier, Remotion-owned proof/text overlay, beat timing, safe zones, prop controls, and lookdev checks. Missing any of these makes Visual Lock `manual_review_required` or failed.
- 当项目是口播型知识视频 / AI explainer / recording-first educational video，或用户明确自称口播型知识博主时，本 skill 必须把该需求标记进 director-board 的场景决策，并在每个非 rest scene 的 `concrete_execution_plan` 中写 `concept_object_plan`、`motion_primitives[]`、`generated_prop_decision`；`visual.visual_policy.spoken_knowledge_motion_policy` 由 `xingchen-art-direction` 写入。缺失即 Visual Lock fail（INV-SPOKEN-KNOWLEDGE-MOTION-GRAMMAR）。
- 当 `sources.source_pack.audience.tier ∈ {lay_scrolling, lay_curious}` 时，每个 `scene_boards[]` 的 `brainstorming_layer.analogy_pass.lay_analogy` 必须非空（且 `knowledge_action ∈ {define, compare, decompose, prove}` 时尤其严格）。缺失即 Visual Lock fail。
- 当 tier ≤ `lay_curious` 时，`analogy_pass.concrete_execution_plan` 必填且至少包含：非空 `asset_kind` 枚举值、非空 `generation_skill_route`、非空 `remotion_layout_plan` 镜头计划。生成路线必须有非空 `generation_prompt` 完整文本；`remotion_native` 路线必须有 `concept_object_plan` + `motion_primitives[]`。这是"AI 必须把抽象类比翻译成具体素材或概念结构"的强制机制——禁止只写 lay_analogy 文字就完事。缺失即 Visual Lock fail（INV-CONCRETE-EXECUTION-PLAN-REQUIRED / INV-SPOKEN-KNOWLEDGE-MOTION-GRAMMAR）。
- 当 `enumerated_concepts.length > 1` 时，`additional_asset_specs.length` 必须 ≥ `enumerated_concepts.length`，每个 concept 一个真实生成 spec。缺失即 Visual Lock fail（INV-ASSET-SPECS-COMPLETENESS）。**这是阻止 div 卡片凑 N 个名词的根本机制。**
- `camera_intent` 字段必填且为 enum 之一。`held` 仅 `scene_job === "rest"` 允许，其他场景写 `held` 即 fail。`camera_scale_change` 和 `camera_translate_px` 必须满足该 intent 的最小幅度（push_in/pull_out scale 变化 ≥ 0.3；dolly translate ≥ 视口 15%）。**违反即 Visual Lock fail（INV-CAMERA-AS-ARGUMENT）**——这是阻止"装饰性微抖镜头"的根本机制。
- `remotion_animation_depth.l2_capabilities_used[]` 必须至少 1 项（每个非 rest scene）。全片至少 1 个 scene 的 `l3_capabilities_used[]` 非空（不必是 hero）。缺失即 Visual Lock fail（INV-REMOTION-ANIMATION-DEPTH）。详细能力枚举和 grep 检测算法见 [`remotion-animation-depth.md`](../../xingchen-visual-compiler/references/remotion-animation-depth.md)。
- 当 `remotion_animation_depth.physics_targets[]` 非空（即 scene 含进入/离开/碰撞/散落动作），visual-compiler 实现必须用 `spring()` 或物理引擎（matter-js / rapier），**禁用 `interpolate(..., {easing: linear})` 平移**这些目标。违反即 Lookdev fail（INV-PHYSICS-OVER-LINEAR）。
- 每条 `frame_layer.on_screen_text[]` 必须有合法 `cite_source`（指向 `script.spoken_script.line_N` / `analogy_pass.lay_analogy` / `source_material.{asset_id}.original_text` 之一）。`cite_source` 为空、指向 metadata 字段名（`scene_id` / `evidence_role` / `knowledge_action` / `job`）、指向项目内部章节名（`scene-board.md` / `S01-question`）、或指向工具/skill 名（`xingchen-*` / `VoxCPM2`）即 fail。
- AI 找不到合法 cite 时，**不要写这条 on_screen_text**——让该场画面回到"只有视觉、无文字"状态，比强行写一条 metadata 文字凑数更安全。
