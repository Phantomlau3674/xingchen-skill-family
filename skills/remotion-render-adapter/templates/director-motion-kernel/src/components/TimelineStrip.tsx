import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, displayText, editorialCard} from "../shared";

export const TimelineStrip: React.FC<{
  events: Array<{
    time: string;
    label: string;
    status: "done" | "current" | "future";
  }>;
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({events, accent, frame, fps, designLanguage}) => {
  const visibleEvents = events.slice(0, 5);
  return (
    <div style={{width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12}}>
      {visibleEvents.map((event, index) => {
        const appear = spring({fps, frame: frame - index * 6, config: {damping: 18, stiffness: 120}});
        const pulse = event.status === "current" ? 1 + Math.sin(frame * 0.08) * 0.06 : 1;
        const dotColor = event.status === "future" ? "#9fb0d3" : accent;
        return (
          <React.Fragment key={`${event.time}-${index}`}>
            <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: appear}}>
              <div style={{...displayText, ...baseText, color: "#c7d2ea", fontSize: 16, fontWeight: 700}}>
                {event.time}
              </div>
              <div
                style={{
                  width: event.status === "current" ? 26 : 20,
                  height: event.status === "current" ? 26 : 20,
                  borderRadius: 999,
                  background: event.status === "future" ? "transparent" : dotColor,
                  border: `2px ${event.status === "future" ? "dashed" : "solid"} ${dotColor}`,
                  transform: `scale(${pulse})`,
                  boxShadow: event.status === "future" ? "none" : `0 0 18px ${accent}55`,
                }}
              />
              <div
                style={{
                  ...editorialCard(event.status === "done" ? "glass-ink" : "matte-paper", accent, {padding: 14, radius: 20}, designLanguage),
                  ...baseText,
                  textAlign: "center",
                  fontSize: 14,
                  lineHeight: 1.35,
                  width: "100%",
                  transform: `translateY(${interpolate(appear, [0, 1], [14, 0])}px)`,
                }}
              >
                {event.label}
              </div>
            </div>
            {index < visibleEvents.length - 1 ? (
              <div
                style={{
                  flex: 0.5,
                  height: 4,
                  marginTop: 34,
                  borderRadius: 999,
                  background: event.status === "future" ? "rgba(159,176,211,0.45)" : accent,
                  opacity: 0.45,
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
