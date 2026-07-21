import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, displayText, editorialCard} from "../shared";

type FlowStep = {
  label: string;
  description?: string;
  icon?: string;
};

export const AnimatedFlowChart: React.FC<{
  steps: FlowStep[];
  activeStep?: number;
  accent: string;
  frame: number;
  fps: number;
  direction?: "horizontal" | "vertical";
  designLanguage: string;
}> = ({steps, activeStep = -1, accent, frame, fps, direction = "horizontal", designLanguage}) => {
  const vertical = direction === "vertical";
  const visibleSteps = steps.slice(0, vertical ? 6 : 5);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        alignItems: "stretch",
        justifyContent: "center",
        gap: vertical ? 16 : 12,
      }}
    >
      {visibleSteps.map((step, index) => {
        const appear = spring({
          fps,
          frame: frame - index * 6,
          config: {damping: 18, stiffness: 120},
        });
        const isActive = index === activeStep;
        const lineGrow = interpolate(appear, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <React.Fragment key={`${step.label}-${index}`}>
            <div
              style={{
                ...editorialCard(isActive ? "screen-emissive" : "glass-ink", accent, {
                  padding: vertical ? 18 : 16,
                  radius: 24,
                }, designLanguage),
                flex: vertical ? "0 0 auto" : 1,
                minWidth: vertical ? "100%" : 0,
                minHeight: vertical ? 108 : 148,
                opacity: appear,
                transform: `translateY(${interpolate(appear, [0, 1], [18, 0])}px) scale(${interpolate(appear, [0, 1], [0.95, 1])})`,
                borderColor: isActive ? `${accent}` : undefined,
                boxShadow: isActive ? `0 0 0 1px ${accent}, 0 0 26px ${accent}30` : undefined,
              }}
            >
              <div style={{...displayText, ...baseText, fontSize: 18, fontWeight: 700, letterSpacing: 0.4}}>
                {step.icon ? `${step.icon} ` : ""}{step.label}
              </div>
              {step.description ? (
                <div style={{...baseText, marginTop: 10, fontSize: 14, lineHeight: 1.35, color: isActive ? "#f4f7ff" : "#c7d2ea"}}>
                  {step.description}
                </div>
              ) : null}
            </div>
            {index < visibleSteps.length - 1 ? (
              <div
                style={{
                  alignSelf: "center",
                  width: vertical ? 4 : 44,
                  height: vertical ? 28 : 4,
                  borderRadius: 999,
                  background: accent,
                  opacity: 0.45,
                  transform: vertical ? `scaleY(${lineGrow})` : `scaleX(${lineGrow})`,
                  transformOrigin: vertical ? "center top" : "left center",
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
