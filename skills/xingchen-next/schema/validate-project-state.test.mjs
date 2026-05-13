import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const validatorPath = path.join(here, "validate-project-state.mjs");
const templatePath = path.join(skillRoot, "templates", "project-state.template.json");

function cloneTemplate() {
  return JSON.parse(fs.readFileSync(templatePath, "utf8"));
}

function setStage(state, stage) {
  state.metadata.active_stage = stage;
  state.metadata.updated_at = "2026-05-03T00:00:00+08:00";
}

function setApproval(state, checkpoint, status) {
  const approval = state.workflow.approvals.find((a) => a.checkpoint === checkpoint);
  assert.ok(approval, `missing checkpoint fixture: ${checkpoint}`);
  approval.status = status;
}

function approveThroughRender(state) {
  for (const checkpoint of [
    "Topic Lock",
    "Script Lock",
    "StoryMother Lock",
    "Visual Lock",
    "Lookdev Approval",
  ]) {
    setApproval(state, checkpoint, "approved");
  }
}

function makeVisualReady(state, sceneIds = ["scene-motion"]) {
  const [heroSceneId] = sceneIds;
  state.sources.source_pack = {
    core_thesis: "A single piece of evidence changes the user's conclusion.",
    audience: "knowledge-video viewers",
    goal: "turn source material into a complete directed video",
    links: [],
    screenshots: [],
    screen_recordings: [],
    notes: ["source note from current project planning"],
    draft_recordings: [],
    existing_assets: [],
    constraints: [],
  };
  state.proof.claims = [
    {
      claim_id: "claim-main",
      text: "The source material supports the central argument.",
    },
  ];
  state.sources.asset_manifest = [
    {
      asset_id: "source-note-main",
      file_path: "inputs/source-note.md",
      asset_type: "document",
      summary: "Planning note used as source material",
      proof_candidate: true,
      review_status: "approved",
    },
  ];
  state.proof.evidence_items = [
    {
      claim_id: "claim-main",
      asset_id: "source-note-main",
      source: "sources.source_pack.notes[0]",
      evidence_type: "planning_note",
      visibility_requirement: "can be summarized visually",
      allowed_usage: "script_and_visual_planning",
    },
  ];
  state.script.spoken_script.blocks = sceneIds.map((sceneId, index) => ({
    scene_id: sceneId,
    text: `Narration block ${index + 1}`,
  }));
  state.script.beat_map.scenes = sceneIds.map((sceneId, index) => ({
    scene_id: sceneId,
    start_s: index * 4,
    end_s: index * 4 + 4,
  }));
  state.mother.story_mother = {
    mother_id: "mother-main",
    thesis: "A directed video should emerge from current source material, not a renderer template.",
    audience_promise: "Understand the proof quickly and remember the visual point.",
    scene_order: sceneIds,
    scene_cards: sceneIds.map((sceneId, index) => ({
      scene_id: sceneId,
      scene_job: index === 0 ? "proof" : "build",
      intent: `Directed scene ${index + 1}`,
      proof_need: index === 0 ? "hero evidence" : "supporting context",
      dominant_anchor: `anchor-${sceneId}`,
    })),
    proof_binding: [{claim_id: "claim-main", scene_id: heroSceneId, asset_id: "source-note-main"}],
    narration_spine: sceneIds.map((sceneId) => ({scene_id: sceneId, beat: `Narration for ${sceneId}`})),
    visual_intent: "Director-led source-to-video plan.",
  };
  state.render.jobs = [
    {
      job_id: "render-main",
      variant_id: "douyin-main",
      status: "ready",
      lookdev_evaluation_id: "lookdev-main",
      lookdev_status: "approved",
      state_path: "project-state.json",
      video_project_path: "exports/render-pack/video-project.json",
      render_plan_path: "exports/render-pack/render-plan.json",
      output_path: "outputs/final.mp4",
    },
  ];

  state.visual.hero_frame_scene_id = heroSceneId;
  state.visual.hook_design = {
    hook_pattern: "Evidence Interrupt",
    hook_promise: "Show the one chart that changes the conclusion.",
    hook_energy_level: 9,
    hook_thumbnail_viable: true,
    hook_feed_contrast_note: "Near-full-frame chart with one highlighted contradiction.",
    rejected_patterns: [],
  };
  state.visual.energy_map = {
    shape: "assault-build-payoff",
    peak_scenes: [heroSceneId],
    rest_scenes: ["scene-rest"],
    density_budget: 0.72,
    rewatch_candidate_scenes: [heroSceneId],
    screenshot_candidate_scenes: [heroSceneId],
  };
  state.visual.contrast_map = {
    monotony_test_result: "Four middle stills vary by scale, layout, density, and background world.",
    variety_checkpoint_score: 4,
    scale_drama_scenes: [heroSceneId],
    layout_pattern_sequence: ["full-frame takeover", "asymmetric proof", "negative space payoff"],
  };
  state.visual.scene_decisions = sceneIds.map((sceneId, index) => ({
      scene_id: sceneId,
      job: index === 0 ? "proof" : "build",
      energy_level: 9,
      layout_pattern: "full-frame takeover",
      color_temperature_direction: "cool-to-warm contrast",
      is_scale_moment: true,
      evidence_role: "hero",
      motion_character: "snappy",
      density: "dense",
      est_duration_sec: 4,
    }));
  state.visual.material_director_pass = {
    status: "completed",
    director_summary: "Read the source material first, then bind every scene to a picture, timing, and renderer route.",
    source_unit_readings: sceneIds.map((sceneId, index) => ({
      unit_id: `unit-${sceneId}`,
      source_ref: index === 0 ? "inputs/source-note.md#main-proof" : `script.beat_map.scenes.${sceneId}`,
      source_kind: index === 0 ? "document" : "script_beat",
      expressed_meaning: index === 0
        ? "The source note carries the central proof."
        : "This beat advances the explanation from the same proof.",
      claim_or_feeling: index === 0 ? "proof shift" : "argument build",
      must_preserve: index === 0 ? "The proof wording and logical contrast stay legible." : "The beat's relation to the proof stays clear.",
      visual_potential: index === 0 ? "full-frame proof takeover" : "supporting visual bridge",
      use_decision: index === 0 ? "hero_proof" : "supporting_proof",
    })),
    recording_rhythm_reading: {
      source_audio_ref: "",
      segments: [],
    },
    scene_binding_plan: sceneIds.map((sceneId, index) => ({
      scene_id: sceneId,
      source_unit_ids: [`unit-${sceneId}`],
      narration_refs: [`script.spoken_script.blocks.${sceneId}`],
      material_role: index === 0 ? "hero proof" : "supporting argument beat",
      picture_design: index === 0 ? "Make the proof dominate the frame with one callout." : "Carry the same proof into a clearer supporting frame.",
      timing_design: "Anchor lands before the narrated keyword and holds through the sentence.",
      source_treatment: index === 0 ? "keep literal proof inspectable" : "rebuild as structured support while preserving meaning",
      subtitle_avoidance: "Keep subtitles below the proof-safe region.",
      transition_logic: "Cut only after the dominant anchor has been readable.",
    })),
    tech_stack_plan: sceneIds.map((sceneId) => ({
      scene_id: sceneId,
      primary_stack: "remotion",
      supporting_stacks: [],
      rejected_stacks: ["spark"],
      why_this_stack: "The scene needs exact source/proof timing, subtitles, and deterministic composition.",
    })),
    unresolved_questions: [],
  };
  state.visual.director_board = {
    status: "completed",
    board_md_path: "visual-director-board.md",
    board_json_path: "visual-director-board.json",
    global_director_thesis: "Every scene is built from the current source material, with proof readability and voice timing deciding the picture before renderer choice.",
    aesthetic_system: {
      visual_promise: "clear evidence with authored motion",
      evidence_posture: "source-led and inspectable",
      energy_arc: "proof spike, structured build, calm payoff",
      anti_cheapness_posture: "avoid generic tech cards and empty glow backgrounds",
    },
    brainstorming_contract: {
      skill_ref: "superpowers/brainstorming",
      required_for: ["scene_boards.picture", "scene_edge_boards.flow"],
      output_rule: "Each scene and adjacent scene edge records question, options, selected direction, and anti-PPT decision before renderer choice.",
    },
    scene_boards: sceneIds.map((sceneId, index) => ({
      scene_id: sceneId,
      scene_job: index === 0 ? "proof" : "build",
      source_layer: {
        source_unit_ids: [`unit-${sceneId}`],
        what_material_says: index === 0
          ? "The current source note contains the proof that should dominate the scene."
          : "The same source note carries the supporting explanation for the next beat.",
        must_preserve: "The proof wording, source relationship, and logical contrast remain legible.",
        can_transform: "The note can be rebuilt into a structured proof frame with callouts and controlled scale.",
        evidence_role: index === 0 ? "hero" : "supporting",
      },
      arrangement_layer: {
        narration_refs: [`script.spoken_script.blocks.${sceneId}`],
        voice_timing: "The visual anchor is visible slightly before the narrated proof keyword and holds through the sentence.",
        beat_before_keyword: "Proof container lands one beat before the word that changes the argument.",
        scene_duration_sec: 4,
        transition_in: index === 0 ? "hard evidence interrupt from black" : "cut from prior proof after anchor readability",
        transition_out: "exit only after callout and subtitle have both been readable.",
      },
      brainstorming_layer: {
        skill_ref: "superpowers/brainstorming",
        scene_question: index === 0
          ? "How can this proof feel like an unavoidable visual argument instead of a PPT card?"
          : "How can this supporting beat evolve the previous proof frame without becoming another static slide?",
        knowledge_action: index === 0 ? "prove" : "bridge",
        options_considered: [
          "Full-frame proof plane with one contradiction callout and a timed subtitle lane.",
          "Small centered card stack with decorative background and separate subtitles.",
        ],
        selected_direction: "Use the source-led proof plane and make the callout arrive before the narrated keyword.",
        why_selected: "It keeps the evidence inspectable while giving the scene a specific visual action tied to the voice.",
        continuity_handles: [
          {
            handle_id: `handle-${sceneId}-keyword`,
            handle_origin: "concept",
            handle_kind: "keyword",
            meaning: "The proof keyword carries the argument into or out of the scene.",
            visual_form: "Warm highlighted keyword connected to the proof callout.",
            usable_as: ["in_anchor", "out_anchor"],
            must_remain_recognizable: "Keep the word, highlight color, and callout relationship visible across the cut.",
          },
        ],
        anti_ppt_decision: "The scene changes scale, timing, and proof-region focus instead of swapping one centered card for another.",
      },
      aesthetic_layer: {
        aesthetic_role: index === 0 ? "make the proof feel unavoidable" : "keep the build precise and calmer than the proof peak",
        color_temperature: index === 0 ? "cool proof field with warm contradiction accent" : "neutral cool base with warmer support accent",
        density: index === 0 ? "dense" : "moderate",
        energy_level: index === 0 ? 9 : 7,
        contrast_to_prev_scene: index === 0 ? "opening scene establishes the visual world" : "lower density and wider negative space than the hero proof scene",
        cheapness_to_avoid: ["generic dark gradient", "floating buzzword cards"],
      },
      frame_layer: {
        main_frame_design: "A near-full-frame proof plane owns the center, with one highlighted contradiction and a thin lower subtitle lane.",
        dominant_anchor: `anchor-${sceneId}`,
        layout_pattern: "asymmetric proof takeover",
        camera_path: "A shallow push-in reveals the proof region first, then settles before the subtitle line changes.",
        depth_plan: "Foreground callout, midground proof plate, background muted source context; subtitles sit outside proof depth.",
        proof_regions: ["center proof plate", "right contradiction callout"],
        subtitle_safe_region: "bottom 18 percent, outside center proof plate and callout.",
      },
      detail_layer: {
        lighting: "Soft directional key light on the proof plate with restrained rim on the callout.",
        material_surface: "Matte paper-like proof surface with crisp vector callout edges.",
        typography_role: "Labels compress proof structure; subtitles carry voice, not extra claims.",
        motion_verbs: ["land", "highlight", "settle"],
        micro_interactions: ["callout underline draws after proof appears", "anchor scale eases once before holding"],
        failure_risks: ["subtitle collides with proof", "callout glow feels like a template"],
      },
      component_layer: {
        primary_component: "ProofPlane",
        supporting_components: ["BottomSubtitleBar", "EvidenceCallout"],
        component_props_brief: "Use source unit id, proof region ids, warm accent highlight, and bottom subtitle-safe lane.",
        fallback_component: "EvidenceCard",
        kit_extension_needed: false,
      },
      subtitle_layer: {
        subtitle_mode: "bottom_bar",
        subtitle_position: "bottom 18 percent, left aligned inside safe lane",
        keyword_highlights: ["proof", "change"],
        must_not_cover: ["center proof plate", "right contradiction callout", `anchor-${sceneId}`],
        relationship_to_voice: "Subtitle follows the spoken sentence while keyword highlight appears exactly on the emphasized word.",
      },
      tech_stack_layer: {
        primary_stack: "remotion",
        integration_mode: "live_component with Remotion-controlled subtitles and proof overlays",
        why_this_stack: "The scene needs exact source proof timing, subtitle safety, and deterministic callout composition in Remotion.",
        rejected_stacks: ["spark", "gen_insert"],
        preview_required: "Remotion low-res motion preview with proof readability check.",
      },
      lookdev_acceptance: {
        still_frame_check: "Proof plate is the dominant anchor and the subtitle lane is outside proof regions.",
        motion_check: "Anchor lands before the proof keyword and holds long enough to read.",
        proof_readability_check: "Source wording and contradiction callout remain inspectable at target resolution.",
        aesthetic_check: "Scene feels source-led, not like a generic tech template.",
      },
    })),
    scene_edge_boards: sceneIds.slice(0, -1).map((sceneId, index) => ({
      edge_id: `edge-${sceneId}-to-${sceneIds[index + 1]}`,
      from_scene_id: sceneId,
      to_scene_id: sceneIds[index + 1],
      skill_ref: "superpowers/brainstorming",
      bridge_question: "What knowledge handle should carry the viewer from this proof beat into the next beat?",
      options_considered: [
        "Relay the warm proof keyword from the outgoing callout into the incoming frame title.",
        "Use a generic fade between two complete cards.",
      ],
      selected_bridge: "Relay the proof keyword and keep its spatial position connected to the next proof region.",
      narrative_bridge: "The viewer leaves with the keyword and immediately sees how the next scene answers it.",
      continuity_handle_kind: "keyword",
      out_handle: `handle-${sceneId}-keyword`,
      in_handle: `handle-${sceneIds[index + 1]}-keyword`,
      transition_method: "keyword_relay",
      cut_moment: "Cut on the short pause after the outgoing keyword has become readable.",
      duration_frames: 8,
      anti_ppt_risk: "Avoid a full-frame fade that makes the two beats feel like independent slides.",
      lookdev_acceptance: "The warm keyword remains recognizable as the viewer moves from one proof beat to the next.",
    })),
    component_registry_plan: [
      {
        component: "ProofPlane",
        scene_ids: sceneIds,
        kit_status: "available",
        extension_note: "",
      },
    ],
    subtitle_system: {
      global_mode: "bottom_bar",
      safe_region_law: "bottom 18 percent never covers proof regions or dominant anchors",
      keyword_style: "single warm accent highlight on emphasized words",
    },
    tech_stack_policy: {
      default_stack: "remotion",
      non_remotion_requires_preview: true,
      spark_requires_spatial_world_reason: true,
    },
    lookdev_acceptance: [
      "Every preview must be checked against source_layer, frame_layer, component_layer, and subtitle_layer.",
    ],
    unresolved_questions: [],
  };
}

function markRecordingCorrectionReady(state, {
  sourceAudioRef = "takes/dry-run.wav",
  cleanedAudioPath = "audio/dry-run.cleaned.wav",
  transcriptPath = "transcript.tsv",
  cleanupReportPath = "recording-cleanup-report.md",
} = {}) {
  state.sources.recording_correction = {
    status: "completed",
    source_audio_refs: [sourceAudioRef],
    cleaned_audio_paths: [cleanedAudioPath],
    transcript_path: transcriptPath,
    cleanup_report_path: cleanupReportPath,
    correction_actions: ["accepted_or_cleaned narration take and aligned transcript timing"],
    quality_checks: ["transcript segments and audio timing are ready for visual-direction"],
    manual_review_notes: "",
  };
}

function applyDirectorTraceToSceneSpec(state, spec) {
  const sceneBoard = state.visual.director_board.scene_boards.find((board) => board.scene_id === spec.scene_id);
  if (!sceneBoard) return spec;

  const brainstorming = sceneBoard.brainstorming_layer;
  const handles = brainstorming.continuity_handles.map((handle) => handle.handle_id);
  const edgeIn = state.visual.director_board.scene_edge_boards.find((edge) => edge.to_scene_id === spec.scene_id);
  const edgeOut = state.visual.director_board.scene_edge_boards.find((edge) => edge.from_scene_id === spec.scene_id);
  const transition_primitives = [];
  if (edgeIn) {
    transition_primitives.push({
      edge_id: edgeIn.edge_id,
      method: edgeIn.transition_method,
      primitive: "KeywordRelay",
      duration_frames: edgeIn.duration_frames,
    });
    spec.edge_in_trace = {
      edge_id: edgeIn.edge_id,
      selected_bridge: edgeIn.selected_bridge,
      transition_method: edgeIn.transition_method,
      in_handle: edgeIn.in_handle,
    };
  }
  if (edgeOut) {
    transition_primitives.push({
      edge_id: edgeOut.edge_id,
      method: edgeOut.transition_method,
      primitive: "KeywordRelay",
      duration_frames: edgeOut.duration_frames,
    });
    spec.edge_out_trace = {
      edge_id: edgeOut.edge_id,
      selected_bridge: edgeOut.selected_bridge,
      transition_method: edgeOut.transition_method,
      out_handle: edgeOut.out_handle,
    };
  }

  spec.brainstorming_trace = {
    skill_ref: brainstorming.skill_ref,
    scene_question: brainstorming.scene_question,
    selected_direction: brainstorming.selected_direction,
    why_selected: brainstorming.why_selected,
  };
  spec.continuity_handles_used = handles;
  spec.anti_ppt_decision = brainstorming.anti_ppt_decision;
  spec.transition_primitives = transition_primitives;
  return spec;
}

function attachDirectorTraces(state) {
  for (const spec of state.render.scene_motion_specs) {
    applyDirectorTraceToSceneSpec(state, spec);
  }
}

function setRemotionSceneSpecs(state, sceneIds) {
  state.render.scene_motion_specs = sceneIds.map((sceneId) => ({
    scene_id: sceneId,
    director_board_scene_id: sceneId,
    render_mode: "code_primary",
    renderer_family: "remotion_component",
    execution_runtime: "remotion",
    motion_source: "native_remotion",
    integration_mode: "live_component",
    dominant_anchor: `directed anchor for ${sceneId}`,
    proof_regions: ["center proof plate", "right contradiction callout"],
    subtitle_safe_region: "bottom 18 percent, outside center proof plate and callout.",
    camera_path: "A shallow push-in reveals the proof region first, then settles before the subtitle line changes.",
  }));
  attachDirectorTraces(state);
}

function addHyperframesPluginRun(state, {
  runId = "plugin-hyperframes-main",
  candidateId = "candidate-hyperframes-main",
  sceneIds = ["scene-motion"],
  adapterKind = "codex_plugin",
  adapterId = "hyperframes@openai-curated",
  skillName = "HyperFrames by HeyGen:hyperframes",
  status = "generated",
  outputPaths = ["hyperframes/candidate/index.html", "renders/candidate-preview.mp4"],
  stateWritebacks = ["render.hyperframes_candidates"],
  promotionTarget = "html_scene",
} = {}) {
  state.render.plugin_adapter_runs.push({
    run_id: runId,
    adapter_kind: adapterKind,
    adapter_id: adapterId,
    skill_name: skillName,
    scene_ids: sceneIds,
    input_state_refs: [
      "visual.director_board.scene_boards",
      "render.scene_motion_specs",
    ],
    output_paths: outputPaths,
    state_writebacks: stateWritebacks,
    status,
    candidate_ids: [candidateId],
    promotion_target_renderer_family: promotionTarget,
    lookdev_evidence_required: true,
    notes: "HyperFrames candidate generated from current director board and scene spec.",
  });
}

function addRemotionPluginRun(state, {
  runId = "plugin-remotion-main",
  sceneIds = ["scene-motion"],
  adapterKind = "codex_plugin",
  adapterId = "remotion@openai-curated",
  skillName = "Remotion:remotion",
  status = "previewed",
  outputPaths = ["remotion/preview-scene-motion.mp4"],
  stateWritebacks = ["render.scene_motion_specs", "render.jobs"],
} = {}) {
  state.render.plugin_adapter_runs.push({
    run_id: runId,
    adapter_kind: adapterKind,
    adapter_id: adapterId,
    skill_name: skillName,
    scene_ids: sceneIds,
    input_state_refs: [
      "visual.director_board.scene_boards",
      "render.scene_motion_specs",
      "render.jobs",
    ],
    output_paths: outputPaths,
    state_writebacks: stateWritebacks,
    status,
    candidate_ids: [],
    promotion_target_renderer_family: "remotion_component",
    lookdev_evidence_required: true,
    notes: "Remotion plugin used for implementation guidance and preview validation.",
  });
}

function addAIVideoPromptRequest(state, {
  requestId = "request-seedance-concept-plate",
  sceneIds = ["scene-ai-video"],
  provider = "seedance",
  status = "handed_to_user",
  expectedCandidateId = "candidate-seedance-concept-plate",
} = {}) {
  state.render.ai_video_prompt_requests.push({
    request_id: requestId,
    scene_ids: sceneIds,
    option_type: "recommended",
    provider,
    provider_model_hint: "seedance or equivalent vertical video model",
    technical_route: "text_to_video",
    prompt_pack_path: "ai-video/prompt-pack.md",
    prompt_path: `ai-video/${requestId}/prompt.md`,
    prompt_text: "Generate an abstract knowledge-motion plate with no text, no proof UI, no logos, and no faces.",
    negative_prompt: "readable claim text, proof, evidence, UI, logos, faces, numbers, subtitles",
    duration_sec: 3,
    aspect_ratio: "9:16",
    reference_asset_paths: [],
    output_expectation: "One 9:16 mp4 or mov file, no baked subtitles, no readable text, suitable as a muted Remotion video_plate.",
    status,
    state_trace_refs: [
      `visual.director_board.scene_boards.${sceneIds[0]}`,
      "visual.director_board.scene_edge_boards",
      `render.scene_motion_specs.${sceneIds[0]}`,
    ],
    proof_exclusion_policy: "No proof, no evidence, no readable claims, and no subtitles; Remotion owns proof overlays and captions.",
    remotion_integration_plan: "Use only as a muted video_plate under Remotion-controlled proof overlays, subtitles, and final timing.",
    handoff_instructions: "User manually generates this on the chosen platform, downloads the file, returns or places it in the project, then Codex registers render.ai_video_candidates.",
    expected_candidate_id: expectedCandidateId,
    notes: "Prompt-only handoff; no generated file is required at this stage.",
  });
}

function addAIVideoCandidate(state, {
  candidateId = "candidate-seedance-concept-plate",
  sceneIds = ["scene-ai-video"],
  provider = "seedance",
  providerModel = "seedance-test",
  reviewStatus = "approved",
  integrationMode = "video_plate",
  promotionTarget = "remotion_component",
  promptRequestId,
} = {}) {
  state.render.ai_video_candidates.push({
    candidate_id: candidateId,
    ...(promptRequestId ? {prompt_request_id: promptRequestId} : {}),
    scene_ids: sceneIds,
    option_type: "recommended",
    provider,
    provider_model: providerModel,
    technical_route: "text_to_video",
    prompt_path: `ai-video/${candidateId}/prompt.md`,
    prompt_text: "Generate an abstract knowledge-motion plate with no text, no proof UI, no logos, and no faces.",
    negative_prompt: "readable claim text, proof, evidence, UI, logos, faces, numbers, subtitles",
    duration_sec: 3,
    aspect_ratio: "9:16",
    output_path: `ai-video/${candidateId}/candidate.mp4`,
    output_kind: "mp4",
    review_status: reviewStatus,
    motion_source: "ai_video_generation",
    candidate_origin: "generated_from_current_state",
    state_trace_refs: [
      `visual.director_board.scene_boards.${sceneIds[0]}`,
      "visual.director_board.scene_edge_boards",
      `render.scene_motion_specs.${sceneIds[0]}`,
    ],
    proof_exclusion_policy: "No proof, no evidence, no readable claims, and no subtitles; Remotion owns proof overlays and captions.",
    remotion_integration_plan: "Use only as a muted video_plate under Remotion-controlled proof overlays, subtitles, and final timing.",
    safety_review: {
      no_false_evidence: true,
      no_readable_claim_text: true,
      no_brand_or_ip_issue: true,
      no_face_or_identity_risk: true,
      notes: "Abstract plate only; no factual text or identifiable media.",
    },
    integration_mode: integrationMode,
    promotion_target_renderer_family: promotionTarget,
    selected_by_user: false,
    promotion_rule: "approved_ai_video_candidate_must_be_video_plate_under_remotion",
    notes: "Seedance-style generated insert is a visual upgrade plate, not a proof carrier.",
  });
}

function addAIVideoAdapterRun(state, {
  runId = "adapter-seedance-main",
  candidateId = "candidate-seedance-concept-plate",
  sceneIds = ["scene-ai-video"],
  adapterKind = "manual_implementation",
  adapterId = "manual-ai-video-api",
  skillName = "manual-ai-video-api",
  status = "promoted",
  outputPaths = ["ai-video/candidate-seedance-concept-plate/candidate.mp4"],
  stateWritebacks = ["render.ai_video_candidates", "render.scene_motion_specs"],
} = {}) {
  state.render.plugin_adapter_runs.push({
    run_id: runId,
    adapter_kind: adapterKind,
    adapter_id: adapterId,
    skill_name: skillName,
    scene_ids: sceneIds,
    input_state_refs: [
      "visual.director_board.scene_boards",
      "visual.director_board.scene_edge_boards",
      "render.scene_motion_specs",
    ],
    output_paths: outputPaths,
    state_writebacks: stateWritebacks,
    status,
    candidate_ids: [candidateId],
    promotion_target_renderer_family: "remotion_component",
    lookdev_evidence_required: true,
    notes: "User returned a manually generated bounded video plate from the locked director board prompt pack.",
  });
}

function makeAIVideoReadyState(sceneId = "scene-ai-video") {
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state, [sceneId]);

  const board = state.visual.director_board.scene_boards[0];
  board.source_layer.evidence_role = "none";
  board.source_layer.what_material_says = "The narration needs a conceptual feeling of scale; no source proof is carried by this generated plate.";
  board.source_layer.must_preserve = "The generated plate must not introduce facts, UI, readable claims, or proof-like text.";
  board.source_layer.can_transform = "The concept can become an abstract motion world because Remotion still owns proof, captions, and timing.";
  board.frame_layer.main_frame_design = "A Seedance-style abstract concept plate fills the background while Remotion keeps proof overlays and subtitles above it.";
  board.frame_layer.camera_path = "Slow lateral drift through the concept plate only creates atmosphere; it does not reveal evidence.";
  board.frame_layer.depth_plan = "Generated background depth sits behind a Remotion proof/subtitle plane and never competes with readable overlays.";
  board.component_layer.primary_component = "AIVideoPlate";
  board.component_layer.supporting_components = ["BottomSubtitleBar", "ProofPlane"];
  board.component_layer.component_props_brief = "Mount the approved candidate as a muted background video plate, crop to 9:16, and reserve subtitle/proof safe regions.";
  board.component_layer.fallback_component = "AbstractGradientMotionPlate";
  board.tech_stack_layer.primary_stack = "gen_insert";
  board.tech_stack_layer.integration_mode = "candidate video_plate under Remotion proof, subtitle, and timeline control";
  board.tech_stack_layer.why_this_stack = "Seedance AI video fills a bounded visual gap for abstract concept motion; it is not evidence or the final controller.";
  board.tech_stack_layer.rejected_stacks = ["spark", "source_media"];
  board.tech_stack_layer.preview_required = "AI video motion preview plus Remotion composite lookdev preview before promotion.";
  board.lookdev_acceptance.proof_readability_check = "Generated video contains no proof; Remotion proof overlays remain readable and separate.";

  state.render.scene_motion_specs = [
    {
      scene_id: sceneId,
      director_board_scene_id: sceneId,
      render_mode: "mixed_scene",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "ai_video_generation",
      integration_mode: "video_plate",
      ai_video_prompt_request_ids: ["request-seedance-concept-plate"],
      ai_video_candidate_ids: ["candidate-seedance-concept-plate"],
      promotion_target_renderer_family: "remotion_component",
      dominant_anchor: "abstract concept motion plate under Remotion proof/subtitle layers",
      proof_regions: ["upper proof overlay lane"],
      subtitle_safe_region: "bottom 18 percent, never baked into AI video.",
      camera_path: "AI video drift remains background-only; Remotion camera/composition owns foreground proof.",
    },
  ];
  attachDirectorTraces(state);
  addAIVideoPromptRequest(state, {requestId: "request-seedance-concept-plate", sceneIds: [sceneId]});
  addAIVideoCandidate(state, {
    candidateId: "candidate-seedance-concept-plate",
    sceneIds: [sceneId],
    promptRequestId: "request-seedance-concept-plate",
  });
  addAIVideoAdapterRun(state, {candidateId: "candidate-seedance-concept-plate", sceneIds: [sceneId]});
  return state;
}

function makeAIVideoPromptOnlyState(sceneId = "scene-ai-video") {
  const state = makeAIVideoReadyState(sceneId);
  setStage(state, "platform-adapt");
  state.workflow.approvals.find((a) => a.checkpoint === "Lookdev Approval").status = "pending";
  state.render.ai_video_candidates = [];
  state.render.plugin_adapter_runs = [];
  state.render.scene_motion_specs[0].ai_video_candidate_ids = [];
  state.render.ai_video_prompt_requests[0].status = "handed_to_user";
  return state;
}

function runValidation(state) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-next-validator-"));
  const statePath = path.join(dir, "project-state.json");
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  const result = spawnSync(process.execPath, [validatorPath, statePath], {
    encoding: "utf8",
    cwd: skillRoot,
  });
  fs.rmSync(dir, {recursive: true, force: true});
  return {
    ok: result.status === 0,
    output: `${result.stdout}${result.stderr}`,
  };
}

function expectPass(name, state) {
  const result = runValidation(state);
  assert.equal(result.ok, true, `${name}\n${result.output}`);
}

function expectFail(name, state, needle) {
  const result = runValidation(state);
  assert.equal(result.ok, false, `${name} unexpectedly passed\n${result.output}`);
  assert.match(result.output, needle, `${name} failed for the wrong reason\n${result.output}`);
}

{
  const state = cloneTemplate();
  setStage(state, "script");

  expectFail("Topic Lock is required before script stage", state, /INV-TOPIC-LOCK-FIRST/);
}

{
  const state = cloneTemplate();
  setStage(state, "research/proof");
  state.sources.source_pack = {
    core_thesis: "The screenshot proves the point.",
    audience: "knowledge-video viewers",
    goal: "create a directed video from real source material",
    links: [],
    screenshots: [{asset_id: "screenshot-claim", path: "inputs/claim.png"}],
    screen_recordings: [],
    notes: [],
    draft_recordings: [],
    existing_assets: [],
    constraints: [],
  };

  expectFail("Media inputs require an asset manifest before proof work", state, /sources\.asset_manifest/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  state.visual.hook_design = {};
  state.visual.energy_map = {};
  state.visual.contrast_map = {};
  state.visual.scene_decisions = [];
  state.visual.hero_frame_scene_id = "";

  expectFail("Visual Lock cannot pass with empty quality fields", state, /INV-HOOK-DESIGN-REQUIRED/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  state.visual.director_board = {
    status: "pending",
    board_md_path: "",
    board_json_path: "",
    global_director_thesis: "",
    aesthetic_system: {},
    brainstorming_contract: {},
    scene_boards: [],
    scene_edge_boards: [],
    component_registry_plan: [],
    subtitle_system: {},
    tech_stack_policy: {},
    lookdev_acceptance: [],
    unresolved_questions: [],
  };

  expectFail("Visual Lock requires a complete visual director board", state, /INV-DIRECTOR-BOARD/);
}

{
  const state = cloneTemplate();
  setStage(state, "visual-direction");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.status = "pending";

  expectFail("Approved Visual Lock triggers director-board checks before stage flip", state, /INV-DIRECTOR-BOARD/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.scene_boards[0].brainstorming_layer.scene_question = "";

  expectFail("Visual Lock requires per-scene brainstorming before picture design", state, /INV-BRAINSTORMING-BEFORE-PICTURE/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-proof", "scene-build"]);
  state.visual.director_board.scene_edge_boards[0].out_handle = "missing-handle";
  setRemotionSceneSpecs(state, ["scene-proof", "scene-build"]);

  expectFail("Scene-edge out handles must reference real continuity handles", state, /INV-SCENE-EDGE-FLOW/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  delete state.render.scene_motion_specs[0].brainstorming_trace;

  expectFail("Compiled scene specs must preserve director-board brainstorming trace", state, /INV-COMPILED-DIRECTOR-TRACE/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-proof", "scene-build"]);
  setRemotionSceneSpecs(state, ["scene-proof", "scene-build"]);
  state.render.scene_motion_specs[0].transition_primitives = [];

  expectFail("Compiled scene specs must preserve scene-edge transition primitives", state, /INV-COMPILED-DIRECTOR-TRACE/);
}

{
  const state = cloneTemplate();
  state.sources.recording_correction.manual_review_notes = [];

  expectFail("Recording correction manual review notes must stay a string", state, /manual_review_notes must be a string/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-proof", "scene-build"]);
  setRemotionSceneSpecs(state, ["scene-proof", "scene-build"]);
  state.visual.director_board.scene_edge_boards = [];

  expectFail("Visual Lock requires scene-edge flow boards between adjacent scenes", state, /INV-SCENE-EDGE-FLOW/);
}

{
  const state = cloneTemplate();
  delete state.visual.director_board;

  expectFail("Schema requiredness enforces visual.director_board presence", state, /schema\.required: state\.visual\.director_board/);
}

{
  const state = cloneTemplate();
  delete state.render.plugin_adapter_runs;

  expectFail("Schema requiredness enforces render.plugin_adapter_runs presence", state, /schema\.required: state\.render\.plugin_adapter_runs/);
}

{
  const state = cloneTemplate();
  state.render.scene_motion_specs = [
    {
      scene_id: "draft-scene",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      dominant_anchor: "draft anchor",
    },
  ];

  expectFail("Schema requiredness enforces director_board_scene_id on scene specs", state, /schema\.required: state\.render\.scene_motion_specs\[0\]\.director_board_scene_id/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  addHyperframesPluginRun(state, {
    outputPaths: [],
    stateWritebacks: [],
  });

  expectFail("Generated plugin runs must record outputs and state writebacks", state, /INV-PLUGIN-ADAPTER-TRACE: render\.plugin_adapter_runs\[0\]\.output_paths/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  addRemotionPluginRun(state);
  state.render.plugin_adapter_runs[0].skill_name = "HyperFrames by HeyGen:hyperframes";

  expectFail("Plugin id and skill name must match", state, /skill_name must be "Remotion:remotion"/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  addRemotionPluginRun(state, {sceneIds: ["scene-ghost"]});

  expectFail("Adapter runs cannot reference scenes outside StoryMother", state, /unknown story mother scene "scene-ghost"/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  addRemotionPluginRun(state);

  expectPass("Remotion plugin adapter run can trace preview state", state);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.render.hyperframes_candidates = [
    {
      candidate_id: "candidate-local-html",
      scene_ids: ["scene-motion"],
      option_type: "recommended",
      generator: "hyperframes-cli",
      technical_route: "hyperframes_html",
      source_path: "hyperframes/local-html/index.html",
      output_path: "renders/local-html.html",
      output_kind: "html",
      review_status: "pending",
      motion_source: "hyperframes_runtime",
      candidate_origin: "generated_from_current_state",
      state_trace_refs: [
        "mother.story_mother.scene_cards.scene-motion",
        "visual.director_board.scene_boards.scene-motion",
        "render.scene_motion_specs.scene-motion",
      ],
    },
  ];
  addHyperframesPluginRun(state, {
    candidateId: "candidate-local-html",
    adapterKind: "local_cli",
    adapterId: "hyperframes-cli",
    skillName: "hyperframes-cli",
    status: "generated",
    outputPaths: ["hyperframes/local-html/index.html", "renders/local-html.html"],
    stateWritebacks: ["render.hyperframes_candidates"],
  });

  expectPass("Claude Code compatible local CLI HyperFrames adapter run is valid", state);
}

{
  const state = cloneTemplate();
  const sceneIds = ["scene-01", "scene-02"];
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state, sceneIds);
  setRemotionSceneSpecs(state, sceneIds);
  state.visual.director_board.scene_boards = state.visual.director_board.scene_boards.filter((board) => board.scene_id !== "scene-02");

  expectFail("Every StoryMother scene must have a director board scene", state, /scene_boards must include story scene "scene-02"/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.scene_boards[0].frame_layer.camera_path = "";

  expectFail("Director board scene layers must be complete", state, /frame_layer\.camera_path/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state, ["scene-html"]);
  setRemotionSceneSpecs(state, ["scene-html"]);
  const board = state.visual.director_board.scene_boards[0];
  board.tech_stack_layer.primary_stack = "html_3d";
  board.tech_stack_layer.why_this_stack = "更高级";
  board.frame_layer.camera_path = "高级镜头";
  board.frame_layer.depth_plan = "高级层次";

  expectFail("HTML 3D must state camera and depth purpose, not generic polish", state, /camera\/depth purpose|scene-specific reason/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state, ["scene-world"]);
  setRemotionSceneSpecs(state, ["scene-world"]);
  const board = state.visual.director_board.scene_boards[0];
  board.tech_stack_layer.primary_stack = "spark";
  board.tech_stack_layer.integration_mode = "browser_canvas_plate";
  board.tech_stack_layer.why_this_stack = "It feels more cinematic.";
  board.tech_stack_layer.preview_required = "";

  expectFail("Spark needs a spatial/world reason and preview requirement", state, /spark requires a spatial\/world reason|spark requires preview_required/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.scene_boards[0].subtitle_layer.must_not_cover = [];

  expectFail("Subtitle layer must declare must-not-cover regions", state, /subtitle_layer\.must_not_cover/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.scene_boards[0].subtitle_layer.subtitle_mode = "none";
  state.visual.director_board.scene_boards[0].subtitle_layer.subtitle_position = "none; no visible subtitle in this scene";
  state.visual.director_board.scene_boards[0].subtitle_layer.keyword_highlights = [];
  state.visual.director_board.scene_boards[0].subtitle_layer.relationship_to_voice = "The voice is carried by the image; no on-screen subtitle is rendered.";

  expectPass("Subtitle mode none can truthfully omit keyword highlights", state);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.scene_boards[0].frame_layer.subtitle_safe_region = "";

  expectFail("Subtitle layer must declare a frame safe region", state, /frame_layer\.subtitle_safe_region/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  delete state.render.scene_motion_specs[0].director_board_scene_id;

  expectFail("Scene motion specs must back-reference the director board scene", state, /back-reference visual\.director_board/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  delete state.render.scene_motion_specs[0].director_board_scene_id;
  state.render.scene_motion_specs[0].director_board_ref = "visual.director_board.scene_boards.anything";

  expectFail("Arbitrary director_board_ref cannot satisfy the scene backref gate", state, /director_board_scene_id/);
}

{
  const state = cloneTemplate();
  const sceneIds = ["scene-01", "scene-02", "scene-03"];
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state, sceneIds);
  setRemotionSceneSpecs(state, sceneIds);

  const htmlBoard = state.visual.director_board.scene_boards[1];
  htmlBoard.scene_job = "context";
  htmlBoard.component_layer.primary_component = "ConceptRoom";
  htmlBoard.component_layer.supporting_components = ["ProofPlane", "BottomSubtitleBar"];
  htmlBoard.frame_layer.main_frame_design = "A concept room places the proof plane in midground while the camera reveals the relationship between source claim and consequence.";
  htmlBoard.frame_layer.camera_path = "Camera starts outside the room, pushes through the proof plane, then lands beside the claim keyword before subtitles change.";
  htmlBoard.frame_layer.depth_plan = "Foreground threshold line, midground proof plane, background concept wall; depth separates explanation from evidence.";
  htmlBoard.tech_stack_layer.primary_stack = "html_3d";
  htmlBoard.tech_stack_layer.integration_mode = "captured_html_plate promoted under Remotion subtitle and audio control";
  htmlBoard.tech_stack_layer.why_this_stack = "HTML 3D is justified because the camera and depth reveal the proof relationship more clearly than a flat split layout.";
  htmlBoard.tech_stack_layer.rejected_stacks = ["spark", "gen_insert"];
  htmlBoard.tech_stack_layer.preview_required = "Browser HTML 3D preview plus still frame proof/subtitle safe-region check.";

  const sparkBoard = state.visual.director_board.scene_boards[2];
  sparkBoard.scene_job = "payoff";
  sparkBoard.component_layer.primary_component = "KnowledgeMapWorld";
  sparkBoard.component_layer.supporting_components = ["SparkRoutePreview", "BottomSubtitleBar"];
  sparkBoard.frame_layer.main_frame_design = "A spatial knowledge map opens from the proof plane and lets the viewer travel across the argument landscape.";
  sparkBoard.frame_layer.camera_path = "Camera travels through the spatial map from source node to consequence node, then returns to the proof anchor.";
  sparkBoard.frame_layer.depth_plan = "Foreground source node, midground decision path, background world plate that shows how the argument expands.";
  sparkBoard.tech_stack_layer.primary_stack = "spark";
  sparkBoard.tech_stack_layer.integration_mode = "browser_canvas_plate with route_status procedural_splat_world under Remotion subtitles";
  sparkBoard.tech_stack_layer.why_this_stack = "Spark is justified by a procedural_splat_world spatial traversal that turns the proof into a navigable knowledge world.";
  sparkBoard.tech_stack_layer.rejected_stacks = ["html_3d", "gen_insert"];
  sparkBoard.tech_stack_layer.preview_required = "SparkRoutePreview browser canvas preview with route_status procedural_splat_world and subtitle-safe overlay check.";

  expectPass("Complete three-scene director board can mix Remotion, HTML 3D, and Spark routes", state);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-motion",
      director_board_scene_id: "scene-motion",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "native_remotion",
      integration_mode: "live_component",
      dominant_anchor: "native Remotion scene",
    },
  ];
  state.render.jobs = [];

  expectFail("Render stage must keep a traceable render job", state, /INV-FINAL-RENDER-JOB-TRACE/);
}

{
  const state = cloneTemplate();
  setStage(state, "visual-direction");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  makeVisualReady(state);
  state.sources.transcript.segments = [
    {
      start: 0,
      end: 3.2,
      speaker: "host",
      text: "Here is the moment the argument turns.",
    },
  ];

  expectFail("Recording-first visual direction requires corrected audio first", state, /INV-RECORDING-CORRECTION-BEFORE-VISUAL/);
}

{
  const state = cloneTemplate();
  setStage(state, "visual-direction");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  makeVisualReady(state);
  state.sources.transcript.segments = [
    {
      start: 0,
      end: 3.2,
      speaker: "host",
      text: "Here is the moment the argument turns.",
    },
  ];
  markRecordingCorrectionReady(state);

  expectFail("Recording-first visual direction needs a recording visual brief", state, /INV-RECORDING-MOTION-ROUTING/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-motion",
      director_board_scene_id: "scene-motion",
      render_mode: "code_primary",
      renderer_family: "vibemotion_candidate",
      dominant_anchor: "typing rhythm",
    },
  ];

  expectFail("VibeMotion candidate cannot be an unresolved final renderer", state, /INV-NO-VIBEMOTION-FINAL/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  state.render.vibemotion_candidates = [
    {
      candidate_id: "candidate-typer",
      scene_ids: ["scene-motion"],
      option_type: "recommended",
      generator_skill: "claude-typer",
      technical_route: "vibemotion_video",
      output_path: "renders/candidate-typer.mov",
      output_kind: "transparent_asset",
      review_status: "approved",
      motion_source: "vibemotion_skill",
      candidate_origin: "primitive_reference_adapted_to_current_state",
      state_trace_refs: [
        "mother.story_mother.scene_cards.scene-motion",
        "visual.scene_decisions.scene-motion",
        "render.scene_motion_specs.scene-motion",
      ],
    },
  ];

  expectFail("Approved VibeMotion candidates need promotion metadata before render", state, /promotion_target_renderer_family/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  state.render.vibemotion_candidates = [
    {
      candidate_id: "candidate-template-risk",
      scene_ids: ["scene-motion"],
      option_type: "recommended",
      generator_skill: "ruler-progress-render",
      technical_route: "vibemotion_video",
      output_path: "renders/template-risk.mov",
      output_kind: "transparent_asset",
      review_status: "pending",
      motion_source: "vibemotion_skill",
      state_trace_refs: ["render.scene_motion_specs.scene-motion"],
    },
  ];

  expectFail("VibeMotion candidates must record current-state origin", state, /candidate_origin/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  state.render.vibemotion_candidates = [
    {
      candidate_id: "candidate-spotlight",
      scene_ids: ["scene-motion"],
      option_type: "recommended",
      generator_skill: "light-spotlight-render",
      technical_route: "vibemotion_html",
      output_path: "renders/spotlight-alpha.mov",
      output_kind: "transparent_asset",
      review_status: "approved",
      motion_source: "vibemotion_skill",
      candidate_origin: "primitive_reference_adapted_to_current_state",
      state_trace_refs: [
        "mother.story_mother.scene_cards.scene-motion",
        "visual.scene_decisions.scene-motion",
        "render.scene_motion_specs.scene-motion",
      ],
      integration_mode: "transparent_asset_layer",
      promotion_target_renderer_family: "remotion_component",
    },
  ];
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-motion",
      director_board_scene_id: "scene-motion",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "vibemotion_skill",
      integration_mode: "transparent_asset_layer",
      candidate_skill: "light-spotlight-render",
      vibemotion_candidate_ids: ["candidate-spotlight"],
      promotion_target_renderer_family: "remotion_component",
      dominant_anchor: "spotlight reveal over narration emphasis",
    },
  ];
  attachDirectorTraces(state);

  expectPass("Promoted VibeMotion transparent layer is valid for render", state);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  state.render.hyperframes_candidates = [
    {
      candidate_id: "candidate-token-conveyor",
      scene_ids: ["scene-motion"],
      option_type: "recommended",
      generator: "hyperframes",
      technical_route: "hyperframes_html",
      source_path: "hyperframes/token-conveyor/index.html",
      output_path: "renders/token-conveyor.html",
      output_kind: "html",
      review_status: "approved",
      motion_source: "hyperframes_runtime",
      candidate_origin: "generated_from_current_state",
      state_trace_refs: [
        "mother.story_mother.scene_cards.scene-motion",
        "visual.visual_policy.hyperframes_scene_policy",
        "render.scene_motion_specs.scene-motion",
      ],
    },
  ];
  addHyperframesPluginRun(state, {
    candidateId: "candidate-token-conveyor",
    sceneIds: ["scene-motion"],
    status: "generated",
    outputPaths: ["hyperframes/token-conveyor/index.html", "renders/token-conveyor.html"],
    stateWritebacks: ["render.hyperframes_candidates"],
  });

  expectFail("Approved Hyperframes candidates need promotion metadata before render", state, /INV-NO-HYPERFRAMES-UNPROMOTED-FINAL/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  state.render.hyperframes_candidates = [
    {
      candidate_id: "candidate-fixed-html",
      scene_ids: ["scene-html"],
      option_type: "recommended",
      generator: "hyperframes",
      technical_route: "hyperframes_html",
      source_path: "hyperframes/fixed-template/index.html",
      output_path: "renders/fixed-template.html",
      output_kind: "html",
      review_status: "pending",
      motion_source: "hyperframes_runtime",
      candidate_origin: "fixed_template",
      state_trace_refs: ["render.scene_motion_specs.scene-html"],
    },
  ];

  expectFail("Hyperframes candidates reject fixed-template origin", state, /candidate_origin/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-html"]);
  state.render.hyperframes_candidates = [
    {
      candidate_id: "candidate-attention-web",
      scene_ids: ["scene-html"],
      option_type: "recommended",
      generator: "hyperframes",
      technical_route: "hyperframes_html",
      source_path: "hyperframes/attention-web/index.html",
      output_path: "renders/attention-web.html",
      output_kind: "html",
      review_status: "approved",
      motion_source: "hyperframes_runtime",
      candidate_origin: "generated_from_current_state",
      state_trace_refs: [
        "mother.story_mother.scene_cards.scene-html",
        "visual.visual_policy.hyperframes_scene_policy",
        "render.scene_motion_specs.scene-html",
      ],
      integration_mode: "captured_html_plate",
      promotion_target_renderer_family: "html_scene",
      selected_by_user: false,
      promotion_rule: "approved_candidate_must_promote_to_html_canvas_or_remotion",
    },
  ];
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-html",
      director_board_scene_id: "scene-html",
      render_mode: "code_primary",
      renderer_family: "html_scene",
      actual_renderer_family: "html_scene",
      execution_runtime: "html_browser_capture",
      motion_source: "hyperframes_runtime",
      integration_mode: "captured_html_plate",
      hyperframes_candidate_ids: ["candidate-attention-web"],
      source_html_path: "hyperframes/attention-web/index.html",
      promotion_target_renderer_family: "html_scene",
      dominant_anchor: "attention web explains model focus",
    },
  ];
  attachDirectorTraces(state);
  addHyperframesPluginRun(state, {
    candidateId: "candidate-attention-web",
    sceneIds: ["scene-html"],
    status: "promoted",
    outputPaths: ["hyperframes/attention-web/index.html", "renders/attention-web.html"],
    stateWritebacks: ["render.hyperframes_candidates", "render.scene_motion_specs"],
  });
  expectPass("Promoted Hyperframes HTML scene is valid for render", state);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-html"]);
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-html",
      director_board_scene_id: "scene-html",
      render_mode: "code_primary",
      renderer_family: "html_scene",
      actual_renderer_family: "html_scene",
      execution_runtime: "remotion",
      motion_source: "hyperframes_runtime",
      integration_mode: "captured_html_plate",
      promotion_target_renderer_family: "html_scene",
      dominant_anchor: "HTML scene with wrong runtime",
    },
  ];

  expectFail("Hyperframes HTML scenes must use browser capture runtime", state, /html_browser_capture/);
}

{
  const state = makeAIVideoPromptOnlyState("scene-ai-video");

  expectPass("AI video prompt-only handoff can pass Visual Lock before the user returns a generated file", state);
}

{
  const state = makeAIVideoPromptOnlyState("scene-ai-video");
  state.render.ai_video_prompt_requests[0].negative_prompt = "";

  expectFail("AI video prompt requests require negative prompts", state, /negative_prompt/);
}

{
  const state = makeAIVideoPromptOnlyState("scene-ai-video");
  setStage(state, "render");
  setApproval(state, "Lookdev Approval", "approved");

  expectFail("AI video prompt-only handoff cannot enter render without a generated candidate file", state, /ai_video_candidate_ids must link generated video files before render/);
}

{
  const state = makeAIVideoReadyState("scene-ai-video");

  expectPass("Seedance-style AI video plate is valid when Remotion remains the controller", state);
}

{
  const state = makeAIVideoReadyState("scene-ai-video");
  state.visual.director_board.scene_boards[0].source_layer.evidence_role = "hero";

  expectFail("AI video gen_insert cannot carry hero proof", state, /INV-AI-VIDEO-GEN-INSERT/);
}

{
  const state = makeAIVideoReadyState("scene-ai-video");
  state.render.ai_video_candidates[0].safety_review.no_readable_claim_text = false;

  expectFail("AI video candidates require safety review before entering state", state, /safety_review\.no_readable_claim_text/);
}

{
  const state = makeAIVideoReadyState("scene-ai-video");
  delete state.render.scene_motion_specs[0].ai_video_candidate_ids;

  expectFail("AI video scene specs must link candidate ids", state, /ai_video_candidate_ids/);
}

{
  const state = makeAIVideoReadyState("scene-ai-video");
  state.render.plugin_adapter_runs = [];

  expectFail("AI video candidates require adapter trace", state, /render\.ai_video_candidates candidate_id "candidate-seedance-concept-plate" must be linked/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-world"]);
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-world",
      director_board_scene_id: "scene-world",
      render_mode: "code_primary",
      renderer_family: "spark_3dgs",
      actual_renderer_family: "spark_procedural_splat",
      route_status: "procedural_splat_world",
      execution_runtime: "spark_browser_canvas",
      motion_source: "spark_runtime",
      integration_mode: "browser_canvas_plate",
      dominant_anchor: "spatial knowledge map traversal",
      spark_asset_route: {
        route_id: "spark-procedural-knowledge-map-v001",
        manifest_path: "C:/xingchen-spark/assets/manifest.json",
      },
      spark_runtime_profile: {
        paged: false,
        target_fps: 30,
      },
      world_asset: {
        asset_id: "spark-procedural-knowledge-map-v001",
        asset_kind: "procedural_splat",
        source_kind: "procedural",
        format: "procedural_packed_splats",
        status: "approved",
      },
    },
  ];
  attachDirectorTraces(state);

  expectPass("Spark procedural splat world keeps Spark browser canvas runtime", state);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-proof", "scene-motion", "scene-world"]);
  state.sources.transcript.segments = [
    {start: 0, end: 6, speaker: "host", text: "First, watch the evidence line up."},
    {start: 16, end: 22, speaker: "host", text: "This is the threshold moment."},
    {start: 32, end: 40, speaker: "host", text: "Now step back and see the whole map."},
  ];
  markRecordingCorrectionReady(state);
  state.visual.recording_visual_brief = {
    source_audio_ref: "takes/dry-run.wav",
    voice_energy_curve: [],
    pause_map: [],
    emphasis_beats: [],
    visual_opportunity_beats: ["scene-proof", "scene-motion", "scene-world"],
    route_hints: [
      {
        scene_id: "scene-proof",
        voice_signal: "opening claim needs exact proof",
        visual_job: "timed subtitle and chart reveal",
        execution_runtime: "remotion",
        motion_source: "native_remotion",
        integration_mode: "live_component",
        promotion_target_renderer_family: "remotion_component",
        reason: "Precise proof and captions belong in Remotion.",
      },
      {
        scene_id: "scene-motion",
        voice_signal: "threshold emphasis beat",
        visual_job: "ruler progress accent",
        execution_runtime: "remotion",
        motion_source: "vibemotion_skill",
        integration_mode: "transparent_asset_layer",
        candidate_skill: "ruler-progress-render",
        promotion_target_renderer_family: "remotion_component",
        reason: "The motion primitive is useful, but final timing remains in Remotion.",
      },
      {
        scene_id: "scene-world",
        voice_signal: "spatial zoom-out",
        visual_job: "knowledge map traversal",
        execution_runtime: "spark_browser_canvas",
        motion_source: "spark_runtime",
        integration_mode: "browser_canvas_plate",
        promotion_target_renderer_family: "spark_3dgs",
        reason: "The narration benefits from a spatial map, not generic atmosphere.",
      },
    ],
  };
  state.visual.material_director_pass.recording_rhythm_reading = {
    source_audio_ref: "takes/dry-run.wav",
    segments: [
      {
        segment_ref: "sources.transcript.segments[0]",
        time_range: "0-6s",
        voice_energy_level: 8,
        pause_or_emphasis: "opening emphasis on evidence",
        spoken_intent: "Ask the viewer to watch the proof line up.",
        visual_response: "Have the chart proof already framed before the keyword lands.",
      },
      {
        segment_ref: "sources.transcript.segments[1]",
        time_range: "16-22s",
        voice_energy_level: 9,
        pause_or_emphasis: "threshold beat",
        spoken_intent: "Make the threshold feel like a turn.",
        visual_response: "Use the ruler accent as a transparent layer timed to the stress.",
      },
      {
        segment_ref: "sources.transcript.segments[2]",
        time_range: "32-40s",
        voice_energy_level: 6,
        pause_or_emphasis: "zoom-out reset",
        spoken_intent: "Step back from proof into map-level understanding.",
        visual_response: "Shift into the spatial world plate after the proof is understood.",
      },
    ],
  };
  state.render.vibemotion_candidates = [
    {
      candidate_id: "candidate-ruler",
      scene_ids: ["scene-motion"],
      option_type: "recommended",
      generator_skill: "ruler-progress-render",
      technical_route: "vibemotion_video",
      output_path: "renders/ruler-alpha.mov",
      output_kind: "transparent_asset",
      review_status: "approved",
      motion_source: "vibemotion_skill",
      candidate_origin: "primitive_reference_adapted_to_current_state",
      state_trace_refs: [
        "mother.story_mother.scene_cards.scene-motion",
        "visual.recording_visual_brief.route_hints.scene-motion",
        "render.scene_motion_specs.scene-motion",
      ],
      integration_mode: "transparent_asset_layer",
      promotion_target_renderer_family: "remotion_component",
    },
  ];
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-proof",
      director_board_scene_id: "scene-proof",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "native_remotion",
      integration_mode: "live_component",
      dominant_anchor: "chart proof and subtitles",
    },
    {
      scene_id: "scene-motion",
      director_board_scene_id: "scene-motion",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "vibemotion_skill",
      integration_mode: "transparent_asset_layer",
      candidate_skill: "ruler-progress-render",
      vibemotion_candidate_ids: ["candidate-ruler"],
      promotion_target_renderer_family: "remotion_component",
      dominant_anchor: "threshold ruler accent",
    },
    {
      scene_id: "scene-world",
      director_board_scene_id: "scene-world",
      render_mode: "code_primary",
      renderer_family: "spark_3dgs",
      actual_renderer_family: "spark_procedural_splat",
      route_status: "procedural_splat_world",
      execution_runtime: "spark_browser_canvas",
      motion_source: "spark_runtime",
      integration_mode: "browser_canvas_plate",
      dominant_anchor: "knowledge map traversal",
      spark_asset_route: {
        route_id: "spark-procedural-knowledge-map-v001",
        manifest_path: "C:/xingchen-spark/assets/manifest.json",
      },
      spark_runtime_profile: {
        paged: false,
        target_fps: 30,
      },
      world_asset: {
        asset_id: "spark-procedural-knowledge-map-v001",
        asset_kind: "procedural_splat",
        source_kind: "procedural",
        format: "procedural_packed_splats",
        status: "approved",
      },
    },
  ];
  attachDirectorTraces(state);

  expectPass("45-second recording dry run can mix Remotion, VibeMotion source, and Spark plate", state);
}

{
  const state = cloneTemplate();
  state.visual.screen_recording_brief = {
    clips: [
      {
        clip_id: "clip-bad-spark",
        media_path: "recordings/product-demo.mov",
        time_range: {start: 0, end: 8},
        route_type: "source_media_plate",
        visual_job: "show the operation flow",
        proof_role: "hero",
        privacy_review: "passed",
        legibility_check: "passed",
        crop_strategy: "vertical crop",
        remotion_treatment: "place as the main plate",
        execution_runtime: "spark_browser_canvas",
        motion_source: "spark_runtime",
        integration_mode: "browser_canvas_plate",
        promotion_target_renderer_family: "spark_3dgs",
        reason: "Wrongly routes screen recording as a Spark world plate.",
      },
    ],
  };

  expectFail("Screen recordings cannot be routed as Spark or VibeMotion", state, /INV-SCREEN-RECORDING-ROUTE/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-evidence-recording", "scene-flow-recording"]);
  state.sources.source_pack.screen_recordings = [
    {asset_id: "recording-chart-proof", path: "recordings/chart-proof.mov"},
    {asset_id: "recording-product-flow", path: "recordings/product-flow.mov"},
  ];
  state.sources.asset_manifest = [
    {
      asset_id: "source-note-main",
      file_path: "inputs/source-note.md",
      asset_type: "document",
      summary: "Planning note used as source material",
      proof_candidate: true,
      review_status: "approved",
    },
    {
      asset_id: "recording-chart-proof",
      file_path: "recordings/chart-proof.mov",
      asset_type: "screen_recording",
      summary: "Dashboard proof recording",
      proof_candidate: true,
      review_status: "approved",
    },
    {
      asset_id: "recording-product-flow",
      file_path: "recordings/product-flow.mov",
      asset_type: "screen_recording",
      summary: "Product flow recording",
      proof_candidate: true,
      review_status: "approved",
    },
  ];
  state.visual.screen_recording_brief = {
    clips: [
      {
        clip_id: "clip-evidence",
        media_path: "recordings/chart-proof.mov",
        time_range: {start: 4, end: 12},
        route_type: "evidence_clip",
        visual_job: "prove the dashboard value change",
        proof_role: "hero",
        privacy_review: "passed",
        legibility_check: "needs_zoom",
        crop_strategy: "punch into the metric region, preserve cursor context",
        remotion_treatment: "crop, magnify, add callout, subtitle-safe lower third",
        execution_runtime: "remotion",
        motion_source: "existing_media",
        integration_mode: "video_plate",
        promotion_target_renderer_family: "remotion_component",
        reason: "The original recording is evidence and should stay inspectable.",
      },
      {
        clip_id: "clip-flow",
        media_path: "recordings/product-flow.mov",
        time_range: {start: 18, end: 31},
        route_type: "source_media_plate",
        visual_job: "carry the operation walkthrough",
        proof_role: "supporting",
        privacy_review: "passed",
        legibility_check: "passed",
        crop_strategy: "full-height vertical plate with soft zooms",
        remotion_treatment: "use as main media plate with captions and highlights",
        execution_runtime: "source_media",
        motion_source: "existing_media",
        integration_mode: "video_plate",
        promotion_target_renderer_family: "remotion_component",
        reason: "The screen recording is the scene's subject, not a generated motion candidate.",
      },
    ],
  };
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-evidence-recording",
      director_board_scene_id: "scene-evidence-recording",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "existing_media",
      integration_mode: "video_plate",
      promotion_target_renderer_family: "remotion_component",
      screen_recording_clip_ids: ["clip-evidence"],
      dominant_anchor: "dashboard value change from recording",
    },
    {
      scene_id: "scene-flow-recording",
      director_board_scene_id: "scene-flow-recording",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "source_media",
      motion_source: "existing_media",
      integration_mode: "video_plate",
      promotion_target_renderer_family: "remotion_component",
      screen_recording_clip_ids: ["clip-flow"],
      dominant_anchor: "product operation flow recording",
    },
  ];
  attachDirectorTraces(state);
  state.visual.source_material_plan = [
    {
      scene_id: "scene-evidence-recording",
      asset_ids: ["recording-chart-proof"],
      screen_recording_clip_ids: ["clip-evidence"],
      usage_role: "hero_proof",
      treatment: "Crop and magnify the proof region while preserving source geometry.",
      director_reason: "The recording itself proves the value change.",
    },
    {
      scene_id: "scene-flow-recording",
      asset_ids: ["recording-product-flow"],
      screen_recording_clip_ids: ["clip-flow"],
      usage_role: "supporting_proof",
      treatment: "Use as source media plate with caption and highlight layers.",
      director_reason: "The operation flow is the subject of the scene.",
    },
  ];

  expectPass("Screen recordings can be evidence clips or source media plates", state);
}

console.log("validate-project-state tests passed");
