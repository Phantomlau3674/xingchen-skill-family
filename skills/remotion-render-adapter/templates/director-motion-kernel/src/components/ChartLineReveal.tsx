import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, editorialCard, editorialEyebrow, monoText} from "../shared";

export type ChartSeries = {
  name: string;
  points: Array<{x: number; y: number}>;
  color?: string;
};

export type ChartHighlight = {
  x: number;
  label: string;
};

const SERIES_COLORS = ["#7c9cff", "#ff8a7c", "#7cffd0", "#ffd87c"];

export const ChartLineReveal: React.FC<{
  series: ChartSeries[];
  x_label?: string;
  y_label?: string;
  highlights?: ChartHighlight[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({series, x_label, y_label, highlights, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const width = 760;
  const height = 360;
  const padding = {top: 24, right: 28, bottom: 44, left: 60};
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const allPoints = series.flatMap((s) => s.points);
  const minX = Math.min(...allPoints.map((p) => p.x));
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const minY = Math.min(...allPoints.map((p) => p.y));
  const maxY = Math.max(...allPoints.map((p) => p.y));
  const xRange = Math.max(0.0001, maxX - minX);
  const yRange = Math.max(0.0001, maxY - minY);

  const xFor = (x: number) => padding.left + ((x - minX) / xRange) * plotW;
  const yFor = (y: number) => padding.top + (1 - (y - minY) / yRange) * plotH;

  const drawStartFrame = Math.round(fps * 0.2);
  const drawDurationFrames = Math.max(60, Math.round(fps * 2.0));
  const drawProgress = Math.max(0, Math.min(1, (frame - drawStartFrame) / drawDurationFrames));

  const highlightStartFrame = drawStartFrame + drawDurationFrames + Math.round(fps * 0.25);

  return (
    <div
      style={{
        ...editorialCard("glass-ink", accent, {padding: 24, radius: 28}, designLanguage),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={editorialEyebrow(accent, designLanguage)}>{y_label ? `${y_label} vs ${x_label ?? "x"}` : "Chart"}</div>
        <div style={{display: "flex", gap: 14}}>
          {series.map((s, i) => (
            <div key={`legend-${i}`} style={{display: "flex", gap: 6, alignItems: "center"}}>
              <div style={{width: 10, height: 10, borderRadius: 999, background: s.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}} />
              <span style={{...baseText, fontSize: 13, color: "#c7d2ea"}}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
      <svg width={width} height={height}>
        {/* y grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding.top + t * plotH;
          const value = maxY - t * yRange;
          return (
            <g key={`yg-${i}`}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.06)" />
              <text x={padding.left - 8} y={y + 4} fill="#7d8aa8" fontSize={11} textAnchor="end" style={{...monoText}}>
                {Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2)}
              </text>
            </g>
          );
        })}
        {/* x label */}
        {x_label ? (
          <text x={width / 2} y={height - 8} fill="#9fb0d3" fontSize={12} textAnchor="middle" style={{...baseText}}>
            {x_label}
          </text>
        ) : null}
        {/* lines */}
        {series.map((s, idx) => {
          const color = s.color ?? SERIES_COLORS[idx % SERIES_COLORS.length];
          const visibleCount = Math.max(2, Math.floor(s.points.length * drawProgress));
          const visible = s.points.slice(0, visibleCount);
          if (visible.length < 2) return null;
          const d = visible.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.x).toFixed(2)} ${yFor(p.y).toFixed(2)}`).join(" ");
          return (
            <g key={`line-${idx}`}>
              <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 4px ${color}88)`}} />
              {/* highlight last drawn point */}
              {visible.length > 0 ? (
                <circle cx={xFor(visible[visible.length - 1].x)} cy={yFor(visible[visible.length - 1].y)} r={4} fill={color} stroke="#0c1020" strokeWidth={1.5} />
              ) : null}
            </g>
          );
        })}
        {/* highlights */}
        {(highlights ?? []).map((h, i) => {
          const localFrame = frame - highlightStartFrame - i * Math.round(fps * 0.4);
          const hApp = spring({fps, frame: localFrame, config: {damping: 20, stiffness: 140}});
          if (hApp <= 0.01) return null;
          const x = xFor(h.x);
          return (
            <g key={`hi-${i}`} opacity={hApp}>
              <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke={accent} strokeDasharray="4 4" strokeWidth={1} />
              <rect x={x + 6} y={padding.top + 6} width={Math.max(60, h.label.length * 8)} height={26} rx={6} fill={`${accent}20`} stroke={accent} strokeWidth={1} />
              <text x={x + 12} y={padding.top + 23} fill={accent} fontSize={13} fontWeight={700} style={{...baseText}}>
                {h.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
