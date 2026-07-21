import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, displayText, editorialCard} from "../shared";

export const ArchitectureDiagram: React.FC<{
  layers: Array<{
    label: string;
    items: string[];
  }>;
  connections?: Array<{from: number; to: number}>;
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({layers, connections, accent, frame, fps, designLanguage}) => {
  return (
    <div style={{width: "100%", display: "flex", flexDirection: "column", gap: 14}}>
      {layers.slice(0, 5).map((layer, index) => {
        const appear = spring({fps, frame: frame - index * 7, config: {damping: 18, stiffness: 120}});
        const hasIncoming = (connections ?? []).some((connection) => connection.to === index);
        return (
          <React.Fragment key={`${layer.label}-${index}`}>
            <div
              style={{
                ...editorialCard(index === 0 ? "screen-emissive" : "glass-ink", accent, {padding: 18, radius: 24}, designLanguage),
                opacity: appear,
                transform: `translateY(${interpolate(appear, [0, 1], [20, 0])}px) scale(${interpolate(appear, [0, 1], [0.97, 1])})`,
              }}
            >
              <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <div style={{width: 10, height: 10, borderRadius: 999, background: accent, boxShadow: `0 0 10px ${accent}`}} />
                <div style={{...displayText, ...baseText, fontSize: 20, fontWeight: 700}}>{layer.label}</div>
                {hasIncoming ? <div style={{...baseText, fontSize: 12, color: "#9fb0d3"}}>linked</div> : null}
              </div>
              <div style={{display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16}}>
                {layer.items.slice(0, 6).map((item, itemIndex) => (
                  <div
                    key={`${layer.label}-${itemIndex}`}
                    style={{
                      ...editorialCard("matte-paper", accent, {padding: 10, radius: 999}, designLanguage),
                      ...baseText,
                      fontSize: 14,
                      lineHeight: 1.2,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {index < layers.length - 1 ? (
              <div
                style={{
                  alignSelf: "center",
                  width: 4,
                  height: 18,
                  borderRadius: 999,
                  background: accent,
                  opacity: 0.4,
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
