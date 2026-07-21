import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, editorialCard, editorialEyebrow} from "../shared";

export type EmbeddingPoint = {
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  label?: string;
  cluster?: string;
};

const CLUSTER_COLORS = ["#7c9cff", "#ff8a7c", "#7cffd0", "#ffd87c", "#c47cff", "#7cdcff"];

const colorForCluster = (cluster: string | undefined, fallback: string) => {
  if (!cluster) return fallback;
  let hash = 0;
  for (let i = 0; i < cluster.length; i += 1) hash = (hash * 31 + cluster.charCodeAt(i)) >>> 0;
  return CLUSTER_COLORS[hash % CLUSTER_COLORS.length] ?? fallback;
};

export const EmbeddingScatter: React.FC<{
  points: EmbeddingPoint[];
  highlights?: string[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({points, highlights, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const width = 760;
  const height = 480;
  const padding = 36;

  const highlightSet = new Set((highlights ?? []).map((h) => h.toLowerCase()));

  // Per-point staggered fade in.
  const perPointStagger = 1.2;

  return (
    <div
      style={{
        ...editorialCard("glass-ink", accent, {padding: 24, radius: 28}, designLanguage),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14}}>
        <div style={editorialEyebrow(accent, designLanguage)}>Embedding space</div>
        <div style={{...baseText, fontSize: 13, color: "#9fb0d3"}}>{points.length} tokens</div>
      </div>
      <svg width={width} height={height} style={{display: "block"}}>
        <defs>
          <radialGradient id="emb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* axes hint */}
        <rect x={padding} y={padding} width={width - padding * 2} height={height - padding * 2} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" />
        {points.map((p, i) => {
          const px = padding + p.x * (width - padding * 2);
          const py = padding + (1 - p.y) * (height - padding * 2);
          const pointFrame = frame - i * perPointStagger;
          const pAppear = spring({fps, frame: pointFrame, config: {damping: 22, stiffness: 140}});
          const isHighlighted = p.label ? highlightSet.has(p.label.toLowerCase()) : false;
          const dotColor = colorForCluster(p.cluster, accent);
          const radius = isHighlighted ? 9 : 5;
          const labelOpacity = isHighlighted ? Math.min(1, pAppear * 1.2) : 0;
          return (
            <g key={`pt-${i}`} opacity={pAppear}>
              {isHighlighted ? <circle cx={px} cy={py} r={26} fill="url(#emb-glow)" /> : null}
              <circle cx={px} cy={py} r={radius} fill={dotColor} stroke={isHighlighted ? "#fff" : "transparent"} strokeWidth={isHighlighted ? 1.5 : 0} />
              {p.label && labelOpacity > 0 ? (
                <text x={px + radius + 6} y={py + 4} fill="#f4f7ff" fontSize={14} opacity={labelOpacity} fontWeight={700}>
                  {p.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
