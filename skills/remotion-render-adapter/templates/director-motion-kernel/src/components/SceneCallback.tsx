import React from "react";
import {Img, spring, useVideoConfig} from "remotion";
import {type CallbackReference, type DirectorScene} from "../directorData";
import {baseText, editorialCard, editorialEyebrow, resolveStatic} from "../shared";

type SceneCallbackProps = {
  callback: CallbackReference;
  targetScene: DirectorScene;
  localFrame: number;
  accent: string;
};

const positionStyle = (position: CallbackReference["position"]) => {
  switch (position) {
    case "top-left":
      return {top: 28, left: 28};
    case "bottom-left":
      return {bottom: 46, left: 28};
    case "bottom-right":
      return {bottom: 46, right: 28};
    default:
      return {top: 28, right: 28};
  }
};

export const SceneCallback: React.FC<SceneCallbackProps> = ({callback, targetScene, localFrame, accent}) => {
  const {fps, height, width} = useVideoConfig();
  const isVertical = height > width;
  const timingFrames = Math.max(0, Math.round(Number(callback.timing_s ?? 0.8) * fps));
  const durationFrames = Math.max(1, Math.round(Number(callback.duration_s ?? 2.4) * fps));
  const activeFrame = localFrame - timingFrames;
  if (activeFrame < 0 || activeFrame > durationFrames) {
    return null;
  }

  const enter = spring({fps, frame: activeFrame, config: {damping: 18, stiffness: 120, mass: 0.9}});
  const thumbnailSrc = resolveStatic(targetScene.asset_placements?.[0]?.file ?? "");
  const compact = callback.size !== "medium";
  const xOffset = callback.position?.endsWith("left") ? -24 : 24;

  return (
    <div
      style={{
        position: "absolute",
        width: compact ? (isVertical ? 264 : 300) : (isVertical ? 336 : 380),
        ...positionStyle(callback.position),
        opacity: enter,
        transform: `translateX(${(1 - enter) * xOffset}px) scale(${0.92 + enter * 0.08})`,
        transformOrigin: callback.position?.endsWith("left") ? "left top" : "right top",
        pointerEvents: "none",
      }}
    >
      <div style={editorialCard("glass-ink", accent, {padding: 14, radius: 26})}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12}}>
          <div style={editorialEyebrow(accent)}>Callback</div>
          <div style={{...baseText, fontSize: 12, color: "#9fb4d8"}}>{targetScene.beat}</div>
        </div>
        <div style={{marginTop: 12, display: "grid", gridTemplateColumns: compact ? "96px 1fr" : "120px 1fr", gap: 12, alignItems: "stretch"}}>
          <div
            style={{
              minHeight: compact ? 96 : 120,
              borderRadius: 18,
              overflow: "hidden",
              background: `linear-gradient(145deg, ${accent}1f, rgba(255,255,255,0.04))`,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {thumbnailSrc ? (
              <Img src={thumbnailSrc} style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...baseText,
                  fontSize: 14,
                  color: "#dce6f8",
                }}
              >
                {targetScene.ppt_layer.headline}
              </div>
            )}
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: 8, justifyContent: "center"}}>
            <div style={{...baseText, fontSize: compact ? 20 : 22, fontWeight: 700, lineHeight: 1.06, color: "#f4f7ff"}}>
              {targetScene.ppt_layer.headline}
            </div>
            <div style={{...baseText, fontSize: 14, lineHeight: 1.3, color: "#bfd0eb"}}>
              {(targetScene.ppt_layer.bullets ?? []).slice(0, 1).join(" ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
