import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const validatorPath = path.join(here, "validate-project-state.mjs");
const invariantManifestPath = path.join(
  skillRoot,
  "references",
  "invariants.extended.json",
);
const templatePath = path.join(skillRoot, "templates", "project-state.template.json");

{
  const manifest = JSON.parse(fs.readFileSync(invariantManifestPath, "utf8"));
  const validatorSource = fs.readFileSync(validatorPath, "utf8");
  assert.equal(manifest.mode, "extended");
  assert.equal(manifest.blocking_ids.length, 59);
  assert.equal(new Set(manifest.blocking_ids).size, manifest.blocking_ids.length);
  assert.doesNotMatch(validatorSource, /invariants\.lean/);
}

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

function audienceFixture(overrides = {}) {
  return {
    summary: "Domain-aware viewers who need a source-led explanation.",
    tier: "domain_aware",
    content_lane: "domain_review",
    creator_profile: "knowledge creator",
    spoken_knowledge_video: false,
    tier_inferred_by: "validator-test-fixture",
    tier_inference_evidence: ["Fixture source says the audience can follow domain terms with proof support."],
    tier_user_confirmed: true,
    tier_user_confirmed_at: "2026-05-03T00:00:00+08:00",
    tier_locked_at: "2026-05-03T00:00:00+08:00",
    self_check_persona: "busy professional viewer",
    technical_literacy: "Can follow domain terms when proof is visible.",
    insider_chrome_allowed: true,
    vocabulary_level: {
      allowed_jargon_terms: ["proof", "renderer", "Remotion"],
      max_jargon_density_per_minute: 6,
    },
    ...overrides,
  };
}

function setLayCuriousAudience(state, overrides = {}) {
  state.sources.source_pack.audience = audienceFixture({
    summary: "Lay curious viewers need the idea translated into concrete visual actions.",
    tier: "lay_curious",
    content_lane: "source_led_explainer",
    tier_inference_evidence: ["Narration uses public-facing phrasing and asks viewers to follow an unfamiliar idea."],
    self_check_persona: "smart non-specialist friend",
    insider_chrome_allowed: false,
    vocabulary_level: {
      allowed_jargon_terms: ["AI", "proof"],
      max_jargon_density_per_minute: 3,
    },
    ...overrides,
  });
}

function makeVisualReady(state, sceneIds = ["scene-motion"]) {
  const [heroSceneId] = sceneIds;
  state.sources.source_pack = {
    core_thesis: "A single piece of evidence changes the user's conclusion.",
    audience: audienceFixture(),
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
      visual_collaboration: {
        source_ref: "visual-collaboration-contract.md",
        status: "agent_proposed",
        recording_or_beat_basis: "Fixture uses script beat_map timing and narration_spine because no live recording is attached.",
        options_presented: [
          "Make the proof source dominate the frame before the narrated keyword lands.",
          "Use a structured motion diagram that rebuilds the proof relationship without fake UI.",
        ],
        selected_option: "Make the proof source dominate the frame before the narrated keyword lands.",
        rejected_options: ["Generic dark-tech card stack."],
        user_feedback: "",
        agent_assumptions: ["Validator fixture has no live user discussion."],
        short_video_constraints: ["0.3-second feed stop", "9:16 proof-safe composition", "subtitle safe region"],
        lessons_applied: ["Avoid generic card/chip stacks from prior PPT-like failures."],
        unresolved_visual_concerns: [],
      },
      github_design_intake: {
        source_ref: "github-design-skill-intake.md",
        fact_check: {
          status: "not_needed",
          verified_items: ["No unstable named product/version claim in fixture."],
          not_needed_reason: "Fixture uses local source proof notes rather than a current external product.",
        },
        core_assets: {
          available: ["source proof note"],
          missing: [],
          placeholder_policy: "Missing proof assets block the scene; non-proof texture can use labeled placeholders.",
        },
        design_system: "Proof-first Remotion tokens: inspectable source plate, restrained accents, deterministic subtitle/proof safe zones.",
        direction_choice: {
          selected: "source-led proof composition",
          killed_alternatives: ["generic premium dark tech", "template dashboard card stack"],
        },
        anti_slop_bar: ["no purple gradient hero", "no decorative orbs", "no fake SVG product", "no glass card stack"],
        verification_route: "Lookdev L3 motion slice plus component grep for source/proof imports and safe-zone checks.",
        five_dimension_review_plan: {
          philosophy_consistency: "source-led proof thesis visible in every scene",
          visual_hierarchy: "proof/source anchor reads before decorative motion",
          detail_execution: "spacing, subtitle safe regions, and callout alignment clean",
          functionality: "scene supports spoken proof and platform constraints",
          innovation: "one earned motion idea beyond template competence",
        },
      },
      resource_preflight: {
        visual_resource_research_path: "visual-resource-research.md",
        visual_resource_research_json_path: "visual-resource-research.json",
        source_reality: {
          real_assets_available: ["source proof note"],
          must_preserve_pixels: ["proof wording and source relationship"],
          can_generate_or_rebuild: ["non-proof callout geometry and motion handles"],
          missing_assets: [],
          honest_placeholder_policy: "Missing real proof assets block the scene; non-proof texture may use labeled placeholders.",
        },
        design_system_memory: "Tokens, rules, and rationale are locked for proof-first Remotion composition before scene implementation.",
        library_candidate_matrix: [
          {
            candidate: "remotion",
            category: "remotion",
            source_url: "https://www.remotion.dev/docs/",
            use_for: "deterministic proof timing, subtitles, and callout composition",
            do_not_use_for: "inventing scene purpose",
            license_or_provenance_note: "project dependency",
            project_fit_score: 9,
            selected: true,
            reason: "The piece needs exact source/proof timing and deterministic render control.",
          },
          {
            candidate: "generic SVG product silhouette",
            category: "svg_graphics",
            source_url: "",
            use_for: "not selected",
            do_not_use_for: "fake physical objects or proof UI",
            license_or_provenance_note: "not applicable",
            project_fit_score: 1,
            selected: false,
            reason: "Would recreate the PPT/fake-object failure mode.",
          },
        ],
        selected_routes: {
          design_system_memory: "proof-first Remotion visual system",
          global_asset_candidates: [],
          project_usage_manifest_path: "not_needed_no_reusable_global_assets_selected",
          stock_footage_candidates: [],
          icon_family: "not_needed",
          svg_graphics: ["proof callout geometry"],
          remotion_packages: ["remotion"],
          imagegen_models_or_skills: [],
          real_asset_sources: ["source proof note"],
        },
        prompt_pack_paths: [],
        rejected_defaults: ["generic gradient hero", "fake dashboard", "SVG fake product"],
        lookdev_audit_hooks: ["verify Remotion proof timing", "verify source proof readability", "verify no fake UI proof"],
        global_asset_registry_checked: true,
        global_asset_candidate_ids: [],
        project_usage_manifest_path: "not_needed_no_reusable_global_assets_selected",
        stock_footage_scout_path: "not_needed_no_stock_footage_selected",
        stock_footage_candidates: [],
      },
      visual_discovery_session: {
        required_scene_ids: sceneIds,
        user_discussion_status: "agent_proposed",
        assumptions: ["Validator fixture proposes scene constituents without a live user discussion."],
      },
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
        visual_discovery_session: {
          scene_id: sceneId,
          session_required: true,
          user_discussion_status: "agent_proposed",
          picture_constituents: ["source proof plate", "Remotion callout geometry", "subtitle-safe lower lane"],
          dominant_visual_object: `proof plane for ${sceneId}`,
          asset_source_decision: "remotion_native",
          global_asset_candidate_ids: [],
          new_asset_needed: false,
          camera_reveal: "The push-in reveals the proof region before the narrated keyword lands.",
          continuity_handle: `handle-${sceneId}-keyword`,
          anti_ppt_commitment: "The frame is built from proof focus and camera reveal, not centered cards or status chips.",
          open_question_for_user: "",
        },
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

function addConcreteExecutionPlans(state) {
  for (const sceneBoard of state.visual.director_board.scene_boards) {
    sceneBoard.brainstorming_layer.analogy_pass = {
      required_by_tier: true,
      concept_being_explained: "abstract tool workflow",
      lay_analogy: "A route is drawn through constraints rather than a fake prop being displayed.",
      analogy_carrier_visual: "route rail, constraint frame, and proof push-in",
      domain_term_used_in_voice: false,
      domain_term_appears_on_screen: false,
      self_check_persona_pass: "A lay viewer can follow the route before reading labels.",
      jargon_safety_net: "Concept is built visually before any label appears.",
      concrete_execution_plan: {
        asset_kind: "remotion_dataviz",
        generation_skill_route: "remotion_native",
        generation_prompt: "not_needed_programmatic",
        generation_negative_prompt: "",
        style_reference: "spoken knowledge motion grammar",
        expected_output_paths: [],
        enumerated_concepts: ["route constraint"],
        additional_asset_specs: [],
        concept_object_plan: "Draw a constrained route rail, snap a proof frame into place, then push into the cited proof region.",
        motion_primitives: ["RouteDraw", "BlockSnap", "ProofPushIn"],
        generated_prop_decision: "rejected_for_explainer_clarity",
        quality_reason: "",
        lookdev_risk: "A generated prop would read as a cheap object instead of an argument structure.",
        fallback_to_programmatic_structure: "Use SVG route lines, proof crop, and scan highlight.",
        remotion_layout_plan: "Use SVG paths for the rail, a spring-snapped proof frame, and a camera push into the proof plate.",
        camera_intent: "push_in",
        camera_motion_reveals: "The route explains why the proof becomes inspectable.",
        camera_scale_change: 0.35,
        camera_translate_px: 0,
        fallback_plan: "If path animation is unavailable, use staggered Sequence blocks and a proof scan window.",
        asset_realized: true,
        asset_realized_paths: [],
      },
    };
  }
}

function enableSpokenKnowledgeMotion(state) {
  state.visual.visual_policy.spoken_knowledge_motion_policy = {
    selected: true,
    why: "voice-led knowledge explainer; abstract concepts need staged construction",
    asset_policy: "real proof plus Remotion-native concept objects; generated props are opt-in",
    motion_primitives: ["RouteDraw", "BlockSnap", "ProofPushIn"],
    lookdev_risks: ["static cards", "cheap generated props"],
  };
  addConcreteExecutionPlans(state);
}

const voxRemotionLookdevRuleIds = [
  "scene_contract_check",
  "world_continuity_check",
  "layer_stack_check",
  "remotion_proof_ownership_check",
  "bitmap_text_ocr_check",
  "mobile_downsample_check",
  "safe_zone_overlap_check",
  "foreground_dominance_check",
  "red_marker_semantics_check",
  "beat_sync_check",
  "motion_density_check",
  "final_hold_frame_check",
  "prop_control_smoke_test",
  "proof_source_trace_check",
];

function enableVoxRemotionStyle(state) {
  state.visual.visual_policy.visual_style_influence = {
    source: "vox_remotion_visual_style",
    selected_traits: [
      "shared paper/grid world",
      "foreground proof carriers",
      "Remotion-owned captions and proof overlays",
    ],
    xingchen_adaptation: "Keeps the creator's proof-first Xingchen voice and mobile readability instead of copying the reference video.",
    avoid_copying: ["source creator identity", "exact source scenes", "title card", "political example"],
  };
  state.visual.visual_policy.editorial_world_system = {
    background_id: "paper_grid_world_v1",
    grid_size: "low-contrast shared alignment grid",
    grain_noise: "subtle print grain",
    palette_lock: ["paper", "charcoal", "red accent"],
    typography_lock: "Remotion-owned Chinese labels and subtitles",
    halftone_cutout_policy: "supporting context only",
    red_offset_marker_policy: "emphasis, tension, path, warning, or separation only",
    remotion_proof_ownership: "all text, data, labels, subtitles, and audited claims are code-owned",
    safe_area_mask: "proof, subtitle, marker, and cutout safe zones do not overlap",
  };
}

function attachVoxRemotionSceneTraces(state) {
  for (const spec of state.render.scene_motion_specs) {
    spec.visual_style_trace = {
      source: "vox_remotion_visual_style",
      selected_traits: state.visual.visual_policy.visual_style_influence.selected_traits,
      adaptation_note: state.visual.visual_policy.visual_style_influence.xingchen_adaptation,
    };
    spec.scene_contract_trace = {
      world_base: "paper_grid_world_v1",
      mid_cutouts: ["source cutout layer", "halftone context layer"],
      foreground_proof_carrier: `foreground proof plane for ${spec.scene_id}`,
      remotion_overlay: "Chinese labels, numbers, subtitles, and claim overlays are code-owned",
      voiceover_beat: "proof reveal lands within the narrated keyword window",
      safe_zones: ["subtitle lower lane", "foreground proof carrier", "red marker lane"],
      proof_source_trace: ["proof.evidence_items[0]", "sources.asset_manifest.source-note-main"],
    };
    spec.prop_controls = {
      x: true,
      y: true,
      scale: true,
      crop: true,
      opacity: true,
      marker: true,
      halftone: true,
      grid: true,
    };
    spec.lookdev_style_checks = [...voxRemotionLookdevRuleIds];
  }
}

function addPassedLookdevGateResults(state) {
  const ruleIds = [
    "concrete_asset_realization_check",
    "remotion_animation_depth_check",
    "asset_specs_completeness_check",
    "render_pack_text_grep",
    "tsx_source_text_grep",
    "onscreen_text_cite_audit",
    "visual_vocabulary_diversity_scan",
  ];
  if (state.visual?.visual_policy?.visual_style_influence?.source === "vox_remotion_visual_style") {
    ruleIds.push(...voxRemotionLookdevRuleIds);
  }
  state.review.lookdev_gate_results = [
    {
      gate_id: "lay-audience-lookdev-audit",
      status: "passed",
      rule_results: ruleIds.map((ruleId) => ({
        rule_id: ruleId,
        status: "passed",
        evidence: `Fixture evidence for ${ruleId}`,
      })),
    },
  ];
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

function addMarbleAdapterRun(state, {
  runId = "adapter-marble-world-main",
  sceneIds = ["scene-world"],
  adapterKind = "external_api",
  adapterId = "world-labs-api",
  skillName = "world-labs-api",
  status = "generated",
  outputPaths = ["C:/xingchen-spark/assets/spark-worlds/_incoming/marble-world-001/world.spz"],
  stateWritebacks = ["render.scene_motion_specs", "render.plugin_adapter_runs"],
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
    candidate_ids: [],
    promotion_target_renderer_family: "spark_3dgs",
    lookdev_evidence_required: true,
    notes: "World Labs Marble world asset generated from the locked director board and registered for SparkRoutePreview.",
  });
}

function addVisualPreprocessAdapterRun(state, {
  runId = "adapter-visual-preprocess-main",
  assetIds = ["vp-scene-motion-depth"],
  sceneIds = ["scene-motion"],
  adapterKind = "local_cli",
  adapterId = "visual-preprocess-lane",
  skillName = "visual-preprocess-lane",
  status = "generated",
  outputPaths = ["assets/scene-motion/depth.npy", "assets/scene-motion/depth_vis.png"],
  stateWritebacks = ["render.visual_preprocess_assets", "render.scene_motion_specs"],
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
    candidate_ids: assetIds,
    promotion_target_renderer_family: "remotion_component",
    lookdev_evidence_required: true,
    notes: "Local visual preprocessing produced depth/mask/upscale assets for Remotion-controlled 2.5D composition.",
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
  setStage(state, "platform-adapt");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  state.visual.director_board.brainstorming_contract.visual_collaboration.status = "not_needed";

  expectFail("Visual collaboration cannot be bypassed with not_needed", state, /not_needed/);
}

{
  const state = cloneTemplate();
  setStage(state, "platform-adapt");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  state.visual.director_board.brainstorming_contract.visual_collaboration.agent_assumptions = [];

  expectFail("Agent-proposed visual collaboration records assumptions", state, /agent_assumptions must be non-empty/);
}

{
  const state = cloneTemplate();
  setStage(state, "platform-adapt");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  state.visual.director_board.brainstorming_contract.visual_collaboration.status = "discussed";
  state.visual.director_board.brainstorming_contract.visual_collaboration.user_feedback = "";

  expectFail("Discussed visual collaboration records user feedback", state, /user_feedback is required/);
}

{
  const state = cloneTemplate();
  setStage(state, "platform-adapt");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  state.visual.director_board.brainstorming_contract.visual_collaboration.status = "manual_review_required";
  state.visual.director_board.brainstorming_contract.visual_collaboration.unresolved_visual_concerns = [];

  expectFail("Manual-review visual collaboration records unresolved concerns", state, /unresolved_visual_concerns must be non-empty/);
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
    core_thesis: "The project has enough source material to plan from.",
    audience: "legacy audience string",
    goal: "create a directed video from source material",
    links: [],
    screenshots: [],
    screen_recordings: [],
    notes: ["source note"],
    draft_recordings: [],
    existing_assets: [],
    constraints: [],
  };

  expectFail("Audience tier must be structured before proof work", state, /INV-AUDIENCE-TIER-LOCKED/);
}

{
  const state = cloneTemplate();
  setStage(state, "research/proof");
  state.sources.source_pack = {
    core_thesis: "The screenshot proves the point.",
    audience: audienceFixture(),
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
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  enableSpokenKnowledgeMotion(state);

  expectPass("Spoken knowledge motion grammar can pass with Remotion-native concept structure", state);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.brainstorming_contract.visual_style_influence = {
    source: "vox_remotion_visual_style",
  };

  expectFail("Vox visual influence cannot use brainstorming_contract as trigger path", state, /visual_style_influence must live at visual\.visual_policy\.visual_style_influence/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  enableVoxRemotionStyle(state);
  attachVoxRemotionSceneTraces(state);

  expectPass("Vox Remotion style can pass Visual Lock with canonical policy and full scene traces", state);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  enableVoxRemotionStyle(state);
  attachVoxRemotionSceneTraces(state);
  state.render.scene_motion_specs[0].lookdev_style_checks = state.render.scene_motion_specs[0].lookdev_style_checks
    .filter((ruleId) => ruleId !== "proof_source_trace_check");

  expectFail("Vox scene specs require the full style lookdev rule set", state, /lookdev_style_checks missing proof_source_trace_check/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  enableSpokenKnowledgeMotion(state);
  delete state.visual.director_board.scene_boards[0].brainstorming_layer.analogy_pass.concrete_execution_plan.concept_object_plan;

  expectFail("Spoken knowledge motion grammar requires concept object plans", state, /INV-SPOKEN-KNOWLEDGE-MOTION-GRAMMAR/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  enableSpokenKnowledgeMotion(state);
  const plan = state.visual.director_board.scene_boards[0].brainstorming_layer.analogy_pass.concrete_execution_plan;
  plan.generated_prop_decision = "selected_with_quality_reason";
  plan.quality_reason = "";

  expectFail("Selected generated props require quality reasons under spoken knowledge grammar", state, /quality_reason/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  setLayCuriousAudience(state);

  expectFail("Lay audience Visual Lock requires concrete analogy execution plans", state, /INV-CONCRETE-EXECUTION-PLAN-REQUIRED/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.sources.source_pack.audience = audienceFixture({
    content_lane: "spoken_knowledge",
    spoken_knowledge_video: true,
    summary: "A voice-led AI explainer for a Douyin knowledge creator.",
  });
  addConcreteExecutionPlans(state);

  expectFail("Spoken knowledge projects must explicitly select the motion grammar policy", state, /spoken_knowledge_motion_policy\.selected/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  delete state.visual.director_board.brainstorming_contract.resource_preflight;

  expectFail("Visual Lock requires visual resource preflight evidence", state, /INV-VISUAL-RESOURCE-PREFLIGHT/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  delete state.visual.director_board.brainstorming_contract.github_design_intake;

  expectFail("Visual Lock requires GitHub design intake evidence", state, /INV-GITHUB-DESIGN-INTAKE|github_design_intake/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.brainstorming_contract.resource_preflight.global_asset_registry_checked = false;

  expectFail("Visual Lock requires global asset registry checks", state, /INV-GLOBAL-ASSET-REGISTRY/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  delete state.visual.director_board.scene_boards[0].brainstorming_layer.visual_discovery_session;

  expectFail("Visual Lock requires Visual Discovery Session for proof scenes", state, /INV-VISUAL-DISCOVERY-SESSION/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.brainstorming_contract.resource_preflight.stock_footage_candidates = [
    {
      asset_id: "stock-clip-001",
      source_name: "Pexels",
      source_url: "https://www.pexels.com/video/example",
      license_url: "https://www.pexels.com/license/",
      commercial_use_status: "allowed_with_attribution",
      attribution_required: true,
      attribution_text: "",
      people_or_model_release_risk: "none",
      trademark_or_brand_risk: "none",
      property_or_landmark_risk: "none",
    },
  ];

  expectFail("Stock footage requiring attribution must record attribution text", state, /attribution_text/);
}

{
  const state = cloneTemplate();
  setStage(state, "lookdev");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.director_board.brainstorming_contract.resource_preflight.selected_routes.imagegen_models_or_skills = ["imagegen"];
  state.visual.director_board.brainstorming_contract.resource_preflight.prompt_pack_paths = [];

  expectFail("Generated image routes require prompt pack paths", state, /prompt_pack_paths/);
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
      gsap_usage: "used",
      gsap_timeline_notes: "GSAP timeline staggers the HTML nodes in the scene's explanation order.",
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
  setStage(state, "lookdev");
  setApproval(state, "Topic Lock", "approved");
  setApproval(state, "Script Lock", "approved");
  setApproval(state, "StoryMother Lock", "approved");
  setApproval(state, "Visual Lock", "approved");
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.render.hyperframes_candidates = [
    {
      candidate_id: "candidate-missing-gsap-trace",
      scene_ids: ["scene-motion"],
      option_type: "recommended",
      generator: "hyperframes-cli",
      technical_route: "hyperframes_html",
      source_path: "hyperframes/missing-gsap/index.html",
      output_path: "renders/missing-gsap.html",
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
    candidateId: "candidate-missing-gsap-trace",
    adapterKind: "local_cli",
    adapterId: "hyperframes-cli",
    skillName: "hyperframes-cli",
    status: "generated",
    outputPaths: ["hyperframes/missing-gsap/index.html", "renders/missing-gsap.html"],
    stateWritebacks: ["render.hyperframes_candidates"],
  });

  expectFail("HyperFrames HTML candidates must record GSAP usage or skip reason", state, /INV-GSAP-HYPERFRAMES-TRACE/);
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
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  setLayCuriousAudience(state);
  addConcreteExecutionPlans(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);

  expectFail("Lay audience render requires non-empty lookdev audit results", state, /lookdev_gate_results/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  setLayCuriousAudience(state);
  addConcreteExecutionPlans(state);
  addPassedLookdevGateResults(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  setApproval(state, "Lookdev Approval", "manual_review_required");

  expectFail("Lay audience render cannot bypass lookdev with manual review", state, /manual_review_required cannot bypass/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  setLayCuriousAudience(state);
  addConcreteExecutionPlans(state);
  addPassedLookdevGateResults(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);

  expectPass("Lay audience render can pass after concrete plans and lookdev audits", state);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  enableVoxRemotionStyle(state);
  attachVoxRemotionSceneTraces(state);

  expectFail("Vox Remotion render requires style-specific lookdev rule results", state, /style rules before render/);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  enableVoxRemotionStyle(state);
  attachVoxRemotionSceneTraces(state);
  addPassedLookdevGateResults(state);

  expectPass("Vox Remotion render can pass with complete style-specific lookdev results", state);
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
      gsap_usage: "used",
      gsap_timeline_notes: "GSAP timeline reveals the token conveyor in narration order.",
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
      gsap_usage: "used",
      gsap_timeline_notes: "Fixture keeps GSAP present so this case fails on candidate_origin.",
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
      gsap_usage: "used",
      gsap_timeline_notes: "GSAP timeline reveals attention nodes and connector paths by semantic group.",
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
      gsap_usage: "used",
      gsap_timeline_notes: "Promoted HTML plate preserves the GSAP semantic reveal order.",
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
      gsap_usage: "used",
      gsap_timeline_notes: "Fixture keeps GSAP trace present so this case fails on runtime.",
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
  state.render.ai_video_prompt_requests[0].provider = "other_ai_video";
  state.render.ai_video_prompt_requests[0].provider_model_hint = "local_comfyui_wan22_ti2v_5b";
  state.render.ai_video_prompt_requests[0].technical_route = "image_to_video";
  state.render.ai_video_prompt_requests[0].handoff_instructions = "Run comfyui-wan-video locally against the approved input image and register the returned mp4.";
  state.render.ai_video_candidates[0].provider = "other_ai_video";
  state.render.ai_video_candidates[0].provider_model = "local_comfyui_wan22_ti2v_5b";
  state.render.ai_video_candidates[0].technical_route = "image_to_video";
  state.render.ai_video_candidates[0].output_path = "C:/comfyui/output/video/wan22_scene_ai_video_00001_.mp4";
  state.render.plugin_adapter_runs[0].adapter_kind = "local_skill";
  state.render.plugin_adapter_runs[0].adapter_id = "comfyui-wan22-ti2v";
  state.render.plugin_adapter_runs[0].skill_name = "comfyui-wan-video";
  state.render.plugin_adapter_runs[0].output_paths = ["C:/comfyui/output/video/wan22_scene_ai_video_00001_.mp4"];

  expectPass("Local ComfyUI Wan2.2 AI video plate is valid as a Remotion-controlled video_plate", state);
}

{
  const state = makeAIVideoReadyState("scene-ai-video");
  state.render.ai_video_prompt_requests[0].provider = "veo_video_generation";
  state.render.ai_video_prompt_requests[0].provider_model_hint = "configured_veo_model_id";
  state.render.ai_video_prompt_requests[0].technical_route = "image_to_video";
  state.render.ai_video_prompt_requests[0].prompt_pack_path = "veo-video-request.md";
  state.render.ai_video_prompt_requests[0].prompt_path = "veo-video-requests/scene-ai-video.md";
  state.render.ai_video_prompt_requests[0].handoff_instructions = "User manually generates this on the configured Veo platform/model, downloads the mp4, returns it to the project, then Codex registers render.ai_video_candidates.";
  state.render.ai_video_candidates[0].provider = "veo_video_generation";
  state.render.ai_video_candidates[0].provider_model = "configured_veo_model_id";
  state.render.ai_video_candidates[0].technical_route = "image_to_video";
  state.render.ai_video_candidates[0].candidate_origin = "reference_guided_from_current_state";
  state.render.plugin_adapter_runs[0].adapter_kind = "external_api";
  state.render.plugin_adapter_runs[0].adapter_id = "veo-video-api";
  state.render.plugin_adapter_runs[0].skill_name = "veo-video-api";

  expectPass("Veo-style AI video plate is valid as a configured Remotion-controlled video_plate lane", state);
}

{
  const state = makeAIVideoReadyState("scene-ai-video");
  state.visual.director_board.scene_boards[0].source_layer.evidence_role = "hero";

  expectFail("AI video gen_insert cannot carry hero proof", state, /INV-AI-VIDEO-GEN-INSERT/);
}

{
  const state = cloneTemplate();
  setStage(state, "platform-adapt");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  state.visual.visual_policy.creator_signature_policy = {
    brand_memory_used: true,
    selected_family_from_brand_memory: "creator-avatar-family-brand",
    adaptation_reason: "",
    anti_template_constraint: "Use as a signature memory only, not as a fixed opener/outro template.",
  };

  expectFail("Creator avatar brand memory requires an adaptation reason", state, /INV-CREATOR-SIGNATURE-ADAPTATION/);
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
  makeVisualReady(state, ["scene-motion"]);
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-motion",
      director_board_scene_id: "scene-motion",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "native_remotion",
      integration_mode: "live_component",
      dominant_anchor: "source plate upgraded with depth and camera motion",
    },
  ];
  state.render.visual_preprocess_assets = [
    {
      asset_id: "vp-scene-motion-depth",
      scene_id: "scene-motion",
      source_asset_ref: "sources.asset_manifest.source-note-main",
      asset_kind: "depth_map",
      generator: "depth_anything_v2_small",
      backend: "pytorch_rocm",
      output_paths: ["assets/scene-motion/depth.npy", "assets/scene-motion/depth_vis.png"],
      status: "generated",
      state_trace_refs: [
        "visual.director_board.scene_boards.scene-motion",
        "render.scene_motion_specs.scene-motion",
      ],
      remotion_usage: "Use the depth map for 2.5D parallax camera movement behind Remotion proof and subtitle layers.",
      proof_policy: "Preprocessing does not alter proof; Remotion owns proof overlays, subtitles, and factual labels.",
      quality_checks: {
        nonblank: true,
        no_proof_rewrite: true,
      },
      adapter_run_id: "adapter-visual-preprocess-main",
    },
  ];
  addVisualPreprocessAdapterRun(state);
  attachDirectorTraces(state);

  expectPass("Visual preprocess depth assets can be traced into Remotion 2.5D use", state);
}

{
  const state = cloneTemplate();
  setStage(state, "render");
  approveThroughRender(state);
  makeVisualReady(state, ["scene-motion"]);
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-motion",
      director_board_scene_id: "scene-motion",
      render_mode: "code_primary",
      renderer_family: "remotion_component",
      execution_runtime: "remotion",
      motion_source: "native_remotion",
      integration_mode: "live_component",
      dominant_anchor: "source plate upgraded with mask and subtitle safety",
    },
  ];
  state.render.visual_preprocess_assets = [
    {
      asset_id: "vp-scene-motion-mask",
      scene_id: "scene-motion",
      source_asset_ref: "sources.asset_manifest.source-note-main",
      asset_kind: "foreground_mask",
      generator: "mobile_sam",
      backend: "pytorch_rocm",
      output_paths: ["assets/scene-motion/mask_fg.png"],
      status: "generated",
      state_trace_refs: [
        "visual.director_board.scene_boards.scene-motion",
        "render.scene_motion_specs.scene-motion",
      ],
      remotion_usage: "Use as a foreground mask for subtitle safe-zone avoidance.",
      proof_policy: "Use the mask to improve style.",
      adapter_run_id: "adapter-visual-preprocess-main",
    },
  ];
  addVisualPreprocessAdapterRun(state, {
    assetIds: ["vp-scene-motion-mask"],
    outputPaths: ["assets/scene-motion/mask_fg.png"],
  });
  attachDirectorTraces(state);

  expectFail("Visual preprocess assets must say they do not rewrite proof", state, /proof_policy must state that preprocessing does not rewrite proof/);
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
  makeVisualReady(state, ["scene-world"]);
  state.render.scene_motion_specs = [
    {
      scene_id: "scene-world",
      director_board_scene_id: "scene-world",
      render_mode: "code_primary",
      renderer_family: "spark_3dgs",
      actual_renderer_family: "spark_3dgs",
      route_status: "true_3dgs_asset",
      execution_runtime: "spark_browser_canvas",
      motion_source: "spark_runtime",
      integration_mode: "browser_canvas_plate",
      dominant_anchor: "Marble-generated concept archive world",
      spark_asset_need: "A real exported Marble splat world is needed for a high-value spatial transition.",
      spark_asset_route: {
        route: "true_3dgs_asset",
        loader: "SplatMesh",
        requires_approved_real_asset: true,
        manifest_path: "C:/xingchen-spark/assets/spark-worlds/manifests/manifest.json",
      },
      spark_runtime_profile: {
        paged: false,
        target_fps: 30,
      },
      world_asset: {
        asset_id: "marble-world-001",
        asset_kind: "real_3dgs",
        source_kind: "marble",
        format: "spz",
        path_or_url: "C:/xingchen-spark/assets/spark-worlds/approved/marble-world-001/world.spz",
        library_manifest: "C:/xingchen-spark/assets/spark-worlds/manifests/manifest.json",
        status: "approved",
        marble_world_id: "world_001",
        marble_model: "marble-1.1",
        provenance: {
          origin: "World Labs Marble",
          created_at: "2026-05-16",
        },
        license: {
          usage: "project_generated",
        },
        preview_evidence: {
          video_path: "previews/spark-route-preview.mp4",
          verified_at: "2026-05-16",
        },
      },
    },
  ];
  addMarbleAdapterRun(state);
  attachDirectorTraces(state);

  expectPass("Marble SPZ intake can promote a true Spark 3DGS world asset with adapter trace", state);
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
      actual_renderer_family: "spark_3dgs",
      route_status: "true_3dgs_asset",
      execution_runtime: "spark_browser_canvas",
      motion_source: "spark_runtime",
      integration_mode: "browser_canvas_plate",
      dominant_anchor: "Marble GLB mistakenly marked as 3DGS",
      spark_asset_route: {
        route: "true_3dgs_asset",
        loader: "SplatMesh",
        requires_approved_real_asset: true,
      },
      spark_runtime_profile: {
        paged: false,
        target_fps: 30,
      },
      world_asset: {
        asset_id: "marble-world-glb",
        asset_kind: "mesh",
        source_kind: "marble",
        format: "glb",
        path_or_url: "C:/xingchen-spark/assets/spark-worlds/approved/marble-world-glb/world.glb",
        library_manifest: "C:/xingchen-spark/assets/spark-worlds/manifests/manifest.json",
        status: "approved",
      },
    },
  ];
  addMarbleAdapterRun(state, {
    outputPaths: ["C:/xingchen-spark/assets/spark-worlds/_incoming/marble-world-glb/world.glb"],
  });
  attachDirectorTraces(state);

  expectFail("Marble GLB mesh export cannot masquerade as true Spark 3DGS", state, /Marble GLB mesh exports must use route_status "hybrid_spark_three"/);
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

{
  const state = cloneTemplate();
  setStage(state, "knowledge-writeback");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  attachDirectorTraces(state);
  state.review.knowledge_writeback = {
    status: "completed",
    candidate_count: 1,
    accepted_writes: [
      {
        title: "Proof-plane camera reveal pattern",
        target: "04 Wiki/视频创作/案例",
        why_reusable: "It keeps source proof readable while avoiding a PPT card.",
        source_project_evidence: "0516 visual director board fixture",
        write_path: "C:/stevenmind/stevenmind/04 Wiki/视频创作/案例/proof-plane-camera-reveal.md",
      },
    ],
    rejected_candidates: [],
    vault_paths: ["C:/stevenmind/stevenmind/04 Wiki/视频创作/案例/proof-plane-camera-reveal.md"],
    skill_reference_paths: [],
    asset_registry_updates: [],
  };

  expectPass("Knowledge writeback stage can pass with accepted writes", state);
}

{
  const state = cloneTemplate();
  setStage(state, "knowledge-writeback");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  attachDirectorTraces(state);

  expectFail("Knowledge writeback stage requires explicit writeback decision", state, /INV-KNOWLEDGE-WRITEBACK/);
}

{
  const state = cloneTemplate();
  setStage(state, "knowledge-writeback");
  approveThroughRender(state);
  makeVisualReady(state);
  setRemotionSceneSpecs(state, ["scene-motion"]);
  attachDirectorTraces(state);
  state.review.knowledge_writeback = {
    status: "not_needed",
    candidate_count: 0,
    accepted_writes: [],
    rejected_candidates: [],
    vault_paths: [],
    skill_reference_paths: [],
    asset_registry_updates: [],
    not_needed_reason: "No reusable visual, technical, or style lesson emerged from this fixture.",
  };

  expectPass("Knowledge writeback can be explicitly marked not needed", state);
}

{
  const state = cloneTemplate();
  state.mode = "lean";
  expectFail(
    "Extended validator rejects Lean mode",
    state,
    /Extended validator accepts mode="extended" or absent legacy mode/,
  );
}

{
  const state = cloneTemplate();
  state.workflow.approvals[state.workflow.approvals.length - 1] = {
    ...state.workflow.approvals[0],
  };
  expectFail(
    "Extended validator rejects duplicate approval checkpoints",
    state,
    /must contain exactly one checkpoint: Topic Lock/,
  );
}

console.log("validate-project-state tests passed");
