import React from "react";
import {spring} from "remotion";
import {baseText, displayText, editorialCard, editorialEyebrow} from "../shared";

export const AnimatedCounter: React.FC<{
  value: number;
  label: string;
  prefix?: string;
  frame: number;
  fps: number;
  accent: string;
  designLanguage: string;
}> = ({value, label, prefix, frame, fps, accent, designLanguage}) => {
  const progress = spring({fps, frame: frame - 8, config: {damping: 20, stiffness: 100}});
  const displayValue = Math.round(progress * value);

  return (
    <div style={{width: "100%", maxWidth: 620, ...editorialCard("tactile-metal", accent, {padding: 30, radius: 36}, designLanguage)}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={editorialEyebrow(accent, designLanguage)}>Release</div>
        <div style={{...baseText, fontSize: 14, color: "#c8d2e7", opacity: 0.72}}>metric wall</div>
      </div>
      <div style={{position: "relative", marginTop: 20, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14}}>
        <div style={{...displayText, fontSize: 220, fontWeight: 700, color: accent, letterSpacing: -6, lineHeight: 0.92, textShadow: `0 0 36px ${accent}40`}}>
          {prefix}{displayValue}
        </div>
        <div style={{...baseText, fontSize: 42, fontWeight: 700, opacity: 0.92}}>{label}</div>
        <div style={{position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", ...displayText, fontSize: 220, fontWeight: 700, color: "#ffffff", opacity: 0.04, letterSpacing: -6}}>
          {prefix}{value}
        </div>
      </div>
    </div>
  );
};
