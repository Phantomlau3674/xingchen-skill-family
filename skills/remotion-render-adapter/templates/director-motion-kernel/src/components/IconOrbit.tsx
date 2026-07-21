import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, displayText, editorialCard, editorialEyebrow} from "../shared";

export const IconOrbit: React.FC<{
  icons: string[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({icons, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 90}});
  const radius = 172;

  return (
    <div style={{width: "100%", maxWidth: 560, ...editorialCard("screen-emissive", accent, {padding: 24, radius: 34}, designLanguage), opacity: enter}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={editorialEyebrow(accent, designLanguage)}>System Orbit</div>
        <div style={{...baseText, fontSize: 14, color: "#9eb0d6"}}>{icons.length} nodes</div>
      </div>
      <div style={{position: "relative", width: "100%", height: 420, marginTop: 22, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div style={{position: "absolute", left: "50%", top: "50%", width: 222, height: 222, borderRadius: "50%", border: `1px solid ${accent}35`, boxShadow: `0 0 24px ${accent}15`, transform: "translate(-50%, -50%)"}} />
        <div style={{position: "absolute", left: "50%", top: "50%", width: 128, height: 128, borderRadius: "50%", background: `radial-gradient(circle, ${accent}28 0%, transparent 72%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: "translate(-50%, -50%)"}}>
          <div style={{...displayText, fontSize: 20, fontWeight: 700, color: "#ffffff"}}>Director</div>
        </div>
        {icons.map((icon, index) => {
          const angle = ((index / Math.max(icons.length, 1)) * Math.PI * 2) + frame * 0.01;
          const x = 240 + Math.cos(angle) * radius;
          const y = 210 + Math.sin(angle) * radius;
          return (
            <React.Fragment key={`${icon}-${index}`}>
              <div
                style={{
                  position: "absolute",
                  left: 240,
                  top: 210,
                  width: radius,
                  height: 1,
                  background: `linear-gradient(90deg, ${accent}00, ${accent}66)`,
                  transformOrigin: "0 0",
                  transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                  opacity: 0.55,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x - 56,
                  top: y - 24,
                  width: 112,
                  height: 48,
                  borderRadius: 24,
                  background: "rgba(10,14,24,0.88)",
                  border: `1px solid ${accent}45`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${interpolate(enter, [0, 1], [0.72, 1])})`,
                  boxShadow: `0 0 20px ${accent}18`,
                }}
              >
                <span style={{...baseText, fontSize: 17, fontWeight: 700}}>{icon}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
