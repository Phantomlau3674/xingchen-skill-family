import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, editorialCard, editorialEyebrow, monoText} from "../shared";

export const PromptToOutput: React.FC<{
  prompt: string;
  output_tokens: string[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({prompt, output_tokens, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});

  // Phase 1 (0-1.4s): prompt types in.
  const promptDurationFrames = Math.max(30, Math.round(fps * 1.4));
  const promptCount = Math.max(0, Math.min(prompt.length, Math.floor(frame * 1.6)));

  // Phase 2 (after prompt, ~0.4s pause): output tokens stream in.
  const outputStartFrame = promptDurationFrames + Math.round(fps * 0.4);
  const tokensPerSecond = 6; // visual rhythm, not realistic LLM speed
  const tokenIndex = Math.max(0, Math.floor(((frame - outputStartFrame) / fps) * tokensPerSecond));
  const visibleTokens = output_tokens.slice(0, tokenIndex);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 880,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* Prompt input box */}
      <div
        style={{
          ...editorialCard("matte-paper", accent, {padding: 20, radius: 18}, designLanguage),
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={editorialEyebrow(accent, designLanguage)}>Prompt</div>
        <div style={{...monoText, fontSize: 22, color: "#1f2540", lineHeight: 1.5}}>
          {prompt.slice(0, promptCount)}
          {promptCount < prompt.length ? <span style={{color: accent, opacity: (frame % 30) > 15 ? 1 : 0.2}}>▌</span> : null}
        </div>
      </div>

      {/* Connector */}
      <div style={{display: "flex", justifyContent: "center"}}>
        <div
          style={{
            width: 2,
            height: 28,
            background: `linear-gradient(180deg, ${accent}, ${accent}33)`,
            borderRadius: 999,
          }}
        />
      </div>

      {/* Output stream */}
      <div
        style={{
          ...editorialCard("screen-emissive", accent, {padding: 22, radius: 22}, designLanguage),
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 160,
          position: "relative",
        }}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={editorialEyebrow(accent, designLanguage)}>Output</div>
          <div style={{...baseText, fontSize: 12, color: "#9fb0d3"}}>{visibleTokens.length} / {output_tokens.length} tokens</div>
        </div>
        <div style={{display: "flex", flexWrap: "wrap", gap: 4, ...baseText, fontSize: 26, lineHeight: 1.55}}>
          {visibleTokens.map((tok, i) => {
            const tokenAppearFrame = outputStartFrame + Math.round((i / tokensPerSecond) * fps);
            const tokenLocal = frame - tokenAppearFrame;
            const tokenOpacity = Math.min(1, Math.max(0, tokenLocal / Math.max(1, fps * 0.18)));
            return (
              <span
                key={`tok-${i}`}
                style={{
                  opacity: tokenOpacity,
                  color: i === visibleTokens.length - 1 ? accent : "#f4f7ff",
                  textShadow: i === visibleTokens.length - 1 ? `0 0 10px ${accent}66` : undefined,
                }}
              >
                {tok}
              </span>
            );
          })}
          {tokenIndex > 0 && tokenIndex < output_tokens.length ? (
            <span style={{color: accent, opacity: (frame % 30) > 15 ? 1 : 0.2}}>▌</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
