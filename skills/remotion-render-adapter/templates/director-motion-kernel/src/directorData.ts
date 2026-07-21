import directorData from "../director-script.render.json";

export type Annotation = {
  type: "highlight-region" | "zoom-to-region" | "arrow-point";
  region: {x: number; y: number; w: number; h: number};
  label?: string;
  timing_s: number;
};

export type RegionRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type AssetPlacement = {
  asset_id?: string;
  file: string;
  role?: string;
  display_mode: string;
  aspect_hint: string;
  content_type: string;
  visual_description?: string;
  anchor_reason?: string;
  immersive_ok?: boolean;
  note?: string;
  needs_human_review?: boolean;
  match_confidence?: number;
  device_frame?: "terminal" | "browser" | "phone" | "vscode" | "none";
  annotations?: Annotation[];
};

export type PptLayer = {
  headline: string;
  bullets: string[];
  render_mode: string;
  highlight_words: string[];
};

export type VisualAnchor =
  | {type: "icon"; icons?: string[]}
  | {type: "counter"; value?: number; label?: string; prefix?: string}
  | {type: "terminal"; lines?: string[]}
  | {type: "progress"; step?: number; total?: number}
  | {type: "quote"}
  | {type: "flowchart"; steps: Array<{label: string; description?: string; icon?: string}>; active_step_cue_index?: number; direction?: "horizontal" | "vertical"}
  | {type: "comparison"; left: {label: string; items: string[]; tone: "negative" | "neutral"}; right: {label: string; items: string[]; tone: "positive" | "neutral"}}
  | {type: "architecture"; layers: Array<{label: string; items: string[]}>; connections?: Array<{from: number; to: number}>}
  | {type: "timeline"; events: Array<{time: string; label: string; status: "done" | "current" | "future"}>}
  // AI-科普 specific shots (Phase B)
  | {
      type: "quote-paper";
      quote: string;
      source: {title: string; authors?: string[]; year?: number; venue?: string; url?: string};
      highlights?: string[];
    }
  | {
      type: "formula";
      steps: Array<{tex: string; annotation?: string; highlight_tokens?: string[]}>;
    }
  | {
      type: "embedding";
      points: Array<{x: number; y: number; label?: string; cluster?: string}>;
      highlights?: string[];
    }
  | {
      type: "attention";
      tokens: string[];
      matrix: number[][];
      highlight_pairs?: Array<{from: number; to: number}>;
    }
  | {
      type: "loss-curve";
      series: Array<{name: string; points: Array<{step: number; value: number}>; color?: string}>;
      annotations?: Array<{step: number; label: string}>;
    }
  | {
      type: "prompt-flow";
      prompt: string;
      output_tokens: string[];
    }
  | {
      type: "network-graph";
      nodes: Array<{id: string; label: string; x: number; y: number; group?: string}>;
      edges: Array<{from: string; to: string; weight?: number}>;
      reveal_order?: string[];
    }
  | {
      type: "chart-line";
      series: Array<{name: string; points: Array<{x: number; y: number}>; color?: string}>;
      x_label?: string;
      y_label?: string;
      highlights?: Array<{x: number; label: string}>;
    };

export type AiImageBrief = {
  enabled: boolean;
  goal: "hero-image" | "mood-plate" | "conceptual-visual" | "background-repair";
  why_this_needs_ai?: string;
  prompt_prompting_principles?: string[];
  subject?: string;
  contrast_pair?: string;
  composition?: string;
  layout_reserve_area?: "left" | "right" | "top" | "bottom" | "center-clear";
  lighting_material?: string;
  background_atmosphere?: string;
  style_reference?: string;
  consistency_group?: string;
  editing_intent?: "generate-new" | "clean-background" | "extend-canvas" | "relight-subject";
  negative_constraints?: string[];
  overlay_text_plan?: string;
};

export type CaptionCue = {
  text: string;
  start_s: number;
  end_s: number;
};

export type SubtitleTreatment = {
  mode?: "default" | "immersive" | "avoid-board";
  placement?: "bottom-center" | "bottom-left" | "bottom-right" | "top-center";
  max_width_pct?: number;
  margin_px?: number;
  exclusion_zones?: RegionRect[];
};

export type BoardFocusRegion = {
  region_id: string;
  label?: string;
  region: RegionRect;
  emphasis?: "primary" | "secondary" | "ambient";
};

export type BoardMotionModule = {
  module_id: string;
  label: string;
  kind: "headline" | "chip" | "panel" | "terminal" | "metric" | "cta" | "node" | "callout";
  region: RegionRect;
  color_role?: "accent" | "secondary" | "neutral" | "warm";
  reveal_from?: "up" | "down" | "left" | "right" | "scale";
  glow_strength?: number;
  lift_px?: number;
  parallax_px?: number;
  border_radius?: number;
};

export type BoardMotionConnectorPoint = {
  x: number;
  y: number;
};

export type BoardMotionConnector = {
  connector_id: string;
  from_module_id?: string;
  to_module_id?: string;
  points: BoardMotionConnectorPoint[];
  style?: "line" | "arrow" | "curve";
  animated?: "draw" | "pulse" | "flow";
  color_role?: "accent" | "secondary" | "neutral" | "warm";
};

export type BoardMotionGlyph = {
  glyph_id: string;
  type: "dot" | "badge" | "icon-chip" | "spark" | "counter-pill";
  x: number;
  y: number;
  label?: string;
  icon?: string;
  accent?: string;
  size?: "sm" | "md" | "lg";
};

export type BoardMotionGlyphGroup = {
  group_id: string;
  behavior?: "orbit" | "pulse" | "stagger" | "settle";
  glyphs: BoardMotionGlyph[];
};

export type BoardMotionActivation = {
  target_id: string;
  target_kind: "module" | "connector" | "glyph-group" | "focus-region";
  start_s: number;
  end_s: number;
  emphasis?: "primary" | "secondary" | "ambient";
};

export type BoardMotionCameraBeat = {
  beat_id: string;
  start_s: number;
  end_s: number;
  move?: "hold" | "push" | "drift" | "focus-punch";
  focus_region_id?: string;
  intensity?: number;
};

export type BoardMotionManualOverrides = {
  dim_strength?: number;
  overlay_opacity?: number;
  connector_flow_speed?: number;
  subtitle_safe_area?: RegionRect[];
};

export type BoardMotion = {
  motion_blueprint_id: string;
  plate_mode: "board-first" | "plate-only";
  subtitle_treatment?: SubtitleTreatment | null;
  focus_regions: BoardFocusRegion[];
  modules: BoardMotionModule[];
  connectors: BoardMotionConnector[];
  glyph_groups: BoardMotionGlyphGroup[];
  activation_track: BoardMotionActivation[];
  reveal_order: string[];
  camera_beats?: BoardMotionCameraBeat[];
  exclusion_zones?: RegionRect[];
  manual_overrides?: BoardMotionManualOverrides | null;
  compiler: {
    engine: "antv-x6";
    version?: string;
    compiled_at?: string;
    source_scene_id: string;
  };
};

export type StyleframeTokens = {
  background_family: "atmospheric-grid" | "studio-halo" | "proof-slate" | "contrast-vignette" | "warm-resolve";
  typography_mode: "hero-kicker" | "split-proof" | "metric-wall" | "terminal-editorial" | "quiet-quote";
  material_family: "screen-emissive" | "glass-ink" | "tactile-metal" | "matte-paper";
  composition_mode?: string;
};

export type CameraPlan = {
  move: "lockoff" | "push-in" | "parallax-drift" | "proof-punch" | "orbit-micro";
  framing?: string;
  pace?: string;
  text_safe_area?: "left" | "right" | "top" | "bottom" | "center-clear" | string;
};

export type SeriesBrand = {
  primary_color?: string;
  secondary_color?: string;
  primary_palette?: string[];
  font_display?: string;
  font_body?: string;
  avatar_file?: string;
  logo_file?: string;
  wordmark?: string;
  watermark_position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  watermark_opacity?: number;
};

export type SeriesOpeningConfig = {
  template?: string;
  composition?: string;
  duration_s?: number;
  overlay_text?: string;
};

export type SeriesClosingElement = {
  type: "text" | "qrcode";
  content?: string;
  file?: string;
};

export type SeriesClosingConfig = {
  template?: string;
  duration_s?: number;
  follow_text?: string;
  next_episode_hint?: string;
  elements?: SeriesClosingElement[];
};

export type SeriesCoverConfig = {
  template?: string;
  text_position?: "left" | "center" | "right";
  background?: string;
  overlay_gradient?: boolean;
  title_max_chars?: number;
  series_label?: string;
};

export type SeriesConfig = {
  series_name: string;
  series_id: string;
  episode_number?: number;
  episode_format?: string;
  brand?: SeriesBrand;
  opening?: SeriesOpeningConfig;
  closing?: SeriesClosingConfig;
  cover?: SeriesCoverConfig;
};

export type CallbackReference = {
  target_scene: string | number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "small" | "medium";
  timing_s?: number;
  duration_s?: number;
};

export type ProofFocus = {
  label: string;
  annotation_style: "arrow" | "box" | "magnify";
  timing_s: number;
};

export type DirectorScene = {
  scene_id: string;
  beat: string;
  scene_kind: "ppt-only" | "evidence-card" | "split-layout" | "immersive-bg";
  visual_strategy: "hook-opener" | "screenshot" | "auto-diagram" | "auto-code" | "auto-metric" | "icon-driven" | "kinetic-text";
  editorial_role: "establish" | "focus" | "proof" | "contrast" | "release";
  transition_out?: string;
  evidence_need: string;
  evidence_source: string;
  evidence_span_id: string;
  objective: string;
  start_s: number;
  end_s: number;
  duration_s: number;
  narration: string;
  on_screen: string[];
  source_unit_ids: string[];
  source_texts: string[];
  caption_cues?: CaptionCue[];
  ppt_layer: PptLayer;
  visual_anchor?: VisualAnchor | null;
  motion_blueprint_id?: string | null;
  board_motion?: BoardMotion | null;
  callback_reference?: CallbackReference | null;
  asset_placements: AssetPlacement[];
  auto_generate?: Record<string, unknown> | null;
  ai_image_brief?: AiImageBrief | null;
  interaction_timeline: Array<Record<string, unknown>>;
  styleframe_tokens: StyleframeTokens;
  camera_plan: CameraPlan;
  sound_cues: string[];
  proof_focus?: ProofFocus | null;
};

export type DirectorVideoProps = {
  meta: {
    topic: string;
    aspect: string;
    style: string;
    style_pack: string;
    sound_mode: string;
    voice_style: string;
    estimated_total_s: number;
    source_estimated_total_s: number;
    source_unit_count: number;
    scene_count: number;
    audio_file: string;
    alignment_mode: string;
    screenshot_scene_count: number;
    screenshot_scene_budget: number;
    visual_strategy_confirmation_required?: boolean;
    design_language?: string;
    visual_guardrails?: string[];
  };
  director_intent: {
    thesis: string;
    rhythm: string;
    camera_system: string;
  };
  series_config?: SeriesConfig;
  scenes: DirectorScene[];
};

export const defaultDirectorProps = directorData as DirectorVideoProps;

export const totalDurationInFrames = (fps: number, props: DirectorVideoProps) =>
  Math.max(1, props.scenes.reduce((total, scene) => total + Math.max(1, Math.round(scene.duration_s * fps)), 0))
  + Math.max(0, Math.round(Number(props.series_config?.opening?.duration_s ?? 0) * fps))
  + Math.max(0, Math.round(Number(props.series_config?.closing?.duration_s ?? 0) * fps));
