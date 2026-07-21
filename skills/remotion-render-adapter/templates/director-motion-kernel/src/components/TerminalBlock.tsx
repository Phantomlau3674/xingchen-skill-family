import React from "react";
import {interpolate, spring} from "remotion";
import {editorialCard, editorialEyebrow, monoText} from "../shared";

export const TerminalBlock: React.FC<{
  lines: string[];
  frame: number;
  fps: number;
  accent: string;
  designLanguage: string;
}> = ({lines, frame, fps, accent, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 100}});

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        ...editorialCard("screen-emissive", accent, {padding: 24, radius: 30}, designLanguage),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
      }}
    >
      <div style={{position: "absolute", inset: 0, background: `linear-gradient(180deg, ${accent}12, transparent 32%)`, pointerEvents: "none"}} />
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18}}>
        <div style={editorialEyebrow(accent, designLanguage)}>Quality Gate</div>
        <div style={{...monoText, fontSize: 14, color: "#91a1c8"}}>{lines.length} commands</div>
      </div>
      <div style={{display: "flex", gap: 8, marginBottom: 18}}>
        <div style={{width: 11, height: 11, borderRadius: "50%", background: "#ff5f57"}} />
        <div style={{width: 11, height: 11, borderRadius: "50%", background: "#febc2e"}} />
        <div style={{width: 11, height: 11, borderRadius: "50%", background: "#28c840"}} />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 8}}>
        {lines.map((line, index) => {
          const charCount = Math.max(0, Math.floor((frame - index * 8) * 1.75));
          return (
            <div key={`${line}-${index}`} style={{...monoText, color: index === 0 ? accent : "#c9d5f0", fontSize: 25, lineHeight: 1.58, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
              $ {line.slice(0, charCount)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
