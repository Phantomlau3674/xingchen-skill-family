import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import {interpolate, spring} from "remotion";
import {baseText, editorialCard, editorialEyebrow} from "../shared";

export type FormulaStep = {
  tex: string;
  annotation?: string;
  highlight_tokens?: string[];
};

const renderTex = (tex: string, displayMode = true): string => {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
      output: "html",
    });
  } catch {
    return `<span style="color:#ff8080">${tex}</span>`;
  }
};

export const FormulaReveal: React.FC<{
  steps: FormulaStep[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({steps, accent, frame, fps, designLanguage}) => {
  const stepStaggerFrames = Math.max(18, Math.round(fps * 0.6));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 920,
        ...editorialCard("glass-ink", accent, {padding: 32, radius: 28}, designLanguage),
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={editorialEyebrow(accent, designLanguage)}>Derivation</div>
      {steps.slice(0, 6).map((step, index) => {
        const stepFrame = frame - index * stepStaggerFrames;
        const enter = spring({fps, frame: stepFrame, config: {damping: 20, stiffness: 130}});
        if (enter <= 0.001) return null;
        const html = renderTex(step.tex);
        return (
          <div
            key={`formula-${index}`}
            style={{
              opacity: enter,
              transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 38,
                color: "#f4f7ff",
                lineHeight: 1.4,
                textAlign: "center",
              }}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{__html: html}}
            />
            {step.annotation ? (
              <div
                style={{
                  ...baseText,
                  fontSize: 16,
                  color: "#9fb0d3",
                  letterSpacing: 0.4,
                  marginTop: 4,
                  textAlign: "center",
                  maxWidth: 760,
                }}
              >
                ↑ {step.annotation}
              </div>
            ) : null}
            {index < steps.length - 1 ? (
              <div
                style={{
                  width: 2,
                  height: 14,
                  background: accent,
                  opacity: 0.5,
                  borderRadius: 999,
                  marginTop: 4,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
