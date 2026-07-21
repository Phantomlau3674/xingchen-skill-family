import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, displayText, editorialCard, editorialEyebrow, monoText} from "../shared";

export type PaperQuoteSource = {
  title: string;
  authors?: string[];
  year?: number;
  venue?: string;
  url?: string;
};

export const PaperQuote: React.FC<{
  quote: string;
  source: PaperQuoteSource;
  highlights?: string[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({quote, source, highlights, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const cardOpacity = enter;
  const cardLift = interpolate(enter, [0, 1], [24, 0]);

  // Word-level reveal driven by frame progression. Total reveal completes by ~1.6s.
  const revealFrames = Math.max(48, Math.round(fps * 1.6));
  const revealProgress = Math.min(1, Math.max(0, (frame - 6) / revealFrames));

  const words = quote.split(/(\s+)/);
  const visibleCount = Math.floor(revealProgress * words.length);

  const highlightSet = new Set((highlights ?? []).map((h) => h.toLowerCase()));

  const authorLine = [
    source.authors?.slice(0, 3).join(", ") + (source.authors && source.authors.length > 3 ? " et al." : ""),
    source.year ? `(${source.year})` : null,
    source.venue,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 880,
        ...editorialCard("matte-paper", accent, {padding: 32, radius: 24}, designLanguage),
        opacity: cardOpacity,
        transform: `translateY(${cardLift}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={editorialEyebrow(accent, designLanguage)}>Paper</div>
      <div style={{...displayText, ...baseText, fontSize: 24, fontWeight: 700, lineHeight: 1.3}}>
        {source.title}
      </div>
      <div style={{...baseText, fontSize: 16, color: "#9fb0d3", letterSpacing: 0.4}}>{authorLine}</div>

      <div
        style={{
          marginTop: 8,
          paddingLeft: 16,
          borderLeft: `4px solid ${accent}`,
          ...baseText,
          fontSize: 28,
          lineHeight: 1.55,
          fontStyle: "italic",
        }}
      >
        {words.slice(0, visibleCount).map((word, i) => {
          if (/^\s+$/.test(word)) return word;
          const isHighlighted = highlightSet.has(word.toLowerCase().replace(/[.,;:!?'"]/g, ""));
          return (
            <span
              key={i}
              style={
                isHighlighted
                  ? {
                      color: accent,
                      fontWeight: 700,
                      textShadow: `0 0 10px ${accent}66`,
                    }
                  : undefined
              }
            >
              {word}
            </span>
          );
        })}
      </div>

      {source.url ? (
        <div style={{...monoText, fontSize: 13, color: "#7d8aa8", marginTop: 4, opacity: 0.8}}>{source.url}</div>
      ) : null}
    </div>
  );
};
