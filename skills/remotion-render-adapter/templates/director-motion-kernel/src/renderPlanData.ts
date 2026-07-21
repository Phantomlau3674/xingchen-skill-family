import renderPlan from "../render-plan.json";

export type RenderPlanAsset = {
  asset_id: string;
  kind: "video" | "image" | "audio" | "captions" | "generated_image";
  source: string;
  proof_mode: "literal" | "decorative";
  status: "missing" | "ready";
};

export type RenderPlanLayer = {
  layer_id: string;
  kind: "video" | "image" | "text" | "audio" | "captions" | "shape" | "group";
  start_s: number;
  end_s: number;
  asset_id?: string | null;
  text?: string | null;
  placement?: Record<string, unknown>;
  style?: Record<string, unknown>;
  asset?: RenderPlanAsset;
};

export type RenderPlanScene = {
  scene_id: string;
  intent: string;
  narration: string;
  headline: string;
  duration_s: number;
  proof_required: boolean;
  review_state: "draft" | "locked";
  proof_annotations: Array<{
    asset_id: string;
    label: string;
    annotation_style: "box" | "arrow" | "magnify" | string;
  }>;
  layers: RenderPlanLayer[];
};

export type RenderPlan = {
  meta: {
    project_id: string;
    title: string;
    profile_id: string;
    aspect: "9:16" | "16:9";
    state: "draft" | "reviewed" | "ready_to_render" | "rendered";
    composition_id: "VideoProjectVertical" | "VideoProjectHorizontal";
    review_sheet_id: "RenderPlanReviewSheet";
    width: number;
    height: number;
    fps: number;
    scene_count: number;
    duration_s: number;
  };
  globals: {
    caption_preset: string;
    safe_areas: Record<string, number>;
    audio_mix: {voice: number; music: number; sfx: number};
  };
  scenes: RenderPlanScene[];
};

export const defaultRenderPlan = renderPlan as RenderPlan;

export const totalDurationInFrames = (fps: number, plan: RenderPlan) =>
  Math.max(1, plan.scenes.reduce((total, scene) => total + Math.max(1, Math.round(scene.duration_s * fps)), 0));
