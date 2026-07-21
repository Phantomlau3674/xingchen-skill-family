import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, editorialCard, editorialEyebrow, monoText} from "../shared";

export type AttentionPair = {from: number; to: number};

export const AttentionHeatmap: React.FC<{
  tokens: string[];
  matrix: number[][]; // square, values in [0..1]
  highlight_pairs?: AttentionPair[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({tokens, matrix, highlight_pairs, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const n = tokens.length;
  const cellSize = Math.min(54, Math.floor(640 / Math.max(1, n)));
  const labelArea = 96;
  const total = n * cellSize + labelArea;

  // Highlight pairs land sequentially.
  const highlightStaggerFrames = Math.max(12, Math.round(fps * 0.4));
  const highlightStartFrame = Math.max(0, Math.round(fps * 0.6));

  const isHighlighted = (row: number, col: number): {active: boolean; phase: number} => {
    if (!highlight_pairs?.length) return {active: false, phase: 0};
    for (let i = 0; i < highlight_pairs.length; i += 1) {
      const pair = highlight_pairs[i];
      if (pair.from === row && pair.to === col) {
        const localFrame = frame - highlightStartFrame - i * highlightStaggerFrames;
        const phase = spring({fps, frame: localFrame, config: {damping: 20, stiffness: 160}});
        return {active: phase > 0.02, phase};
      }
    }
    return {active: false, phase: 0};
  };

  return (
    <div
      style={{
        ...editorialCard("glass-ink", accent, {padding: 24, radius: 28}, designLanguage),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [14, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={editorialEyebrow(accent, designLanguage)}>Attention</div>
        <div style={{...baseText, fontSize: 13, color: "#9fb0d3"}}>
          {n}×{n} tokens
        </div>
      </div>
      <svg width={total} height={total} style={{display: "block"}}>
        {/* column labels (top) */}
        {tokens.map((t, c) => (
          <text
            key={`col-${c}`}
            x={labelArea + c * cellSize + cellSize / 2}
            y={labelArea - 8}
            fill="#c7d2ea"
            fontSize={12}
            textAnchor="middle"
            style={{...monoText}}
          >
            {t.length > 6 ? t.slice(0, 5) + "…" : t}
          </text>
        ))}
        {/* row labels (left) */}
        {tokens.map((t, r) => (
          <text
            key={`row-${r}`}
            x={labelArea - 8}
            y={labelArea + r * cellSize + cellSize / 2 + 4}
            fill="#c7d2ea"
            fontSize={12}
            textAnchor="end"
            style={{...monoText}}
          >
            {t.length > 9 ? t.slice(0, 8) + "…" : t}
          </text>
        ))}
        {/* heatmap cells */}
        {matrix.slice(0, n).map((row, r) =>
          row.slice(0, n).map((value, c) => {
            const v = Math.max(0, Math.min(1, value));
            const x = labelArea + c * cellSize;
            const y = labelArea + r * cellSize;
            const {active, phase} = isHighlighted(r, c);
            const baseFill = `rgba(124, 156, 255, ${0.05 + v * 0.85})`;
            return (
              <g key={`cell-${r}-${c}`}>
                <rect x={x} y={y} width={cellSize - 1} height={cellSize - 1} fill={baseFill} />
                {active ? (
                  <rect
                    x={x}
                    y={y}
                    width={cellSize - 1}
                    height={cellSize - 1}
                    fill="none"
                    stroke={accent}
                    strokeWidth={Math.max(1, 3 * phase)}
                    style={{filter: `drop-shadow(0 0 ${6 * phase}px ${accent})`}}
                  />
                ) : null}
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
};
