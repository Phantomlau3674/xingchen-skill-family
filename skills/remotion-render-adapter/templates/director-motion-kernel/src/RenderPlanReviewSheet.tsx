import React from "react";
import {AbsoluteFill} from "remotion";
import type {RenderPlan} from "./renderPlanData";

const colors = {
  bg: "#ffffff",
  panel: "#f7f8fa",
  border: "#d7dde5",
  text: "#111418",
  muted: "#5d6875",
  accent: "#3557e0",
};

export const RenderPlanReviewSheet: React.FC<RenderPlan> = (plan) => (
  <AbsoluteFill style={{background: colors.bg, padding: 48}}>
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28}}>
      <div>
        <div style={{fontFamily: "\"JetBrains Mono\", monospace", fontSize: 14, color: colors.muted, marginBottom: 10}}>
          {plan.meta.project_id} / {plan.meta.profile_id}
        </div>
        <div style={{fontFamily: "\"Space Grotesk\", sans-serif", fontSize: 46, lineHeight: 1, letterSpacing: -1.6, color: colors.text}}>
          {plan.meta.title}
        </div>
      </div>
      <div style={{fontFamily: "\"JetBrains Mono\", monospace", fontSize: 15, color: colors.accent}}>
        {plan.meta.scene_count} scenes / {plan.meta.duration_s.toFixed(1)}s
      </div>
    </div>

    <div style={{display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20}}>
      {plan.scenes.map((scene) => (
        <div
          key={scene.scene_id}
          style={{
            border: `1px solid ${colors.border}`,
            background: colors.panel,
            borderRadius: 10,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minHeight: 220,
          }}
        >
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{fontFamily: "\"JetBrains Mono\", monospace", fontSize: 13, color: colors.muted}}>{scene.scene_id}</div>
            <div style={{fontFamily: "\"JetBrains Mono\", monospace", fontSize: 13, color: scene.proof_required ? "#b1412f" : colors.accent}}>
              {scene.proof_required ? "proof" : "optional"}
            </div>
          </div>
          <div style={{fontFamily: "\"Space Grotesk\", sans-serif", fontSize: 28, lineHeight: 1.06, color: colors.text}}>{scene.headline}</div>
          <div style={{fontFamily: "\"JetBrains Mono\", monospace", fontSize: 14, lineHeight: 1.6, color: colors.muted}}>{scene.intent}</div>
          <div style={{marginTop: "auto", display: "flex", justifyContent: "space-between", fontFamily: "\"JetBrains Mono\", monospace", fontSize: 13, color: colors.muted}}>
            <span>{scene.layers.length} layers</span>
            <span>{scene.duration_s.toFixed(1)}s</span>
            <span>{scene.review_state}</span>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
