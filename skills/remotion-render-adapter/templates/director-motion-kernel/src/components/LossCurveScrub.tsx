import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, editorialCard, editorialEyebrow, monoText} from "../shared";

export type LossSeries = {
  name: string;
  points: Array<{step: number; value: number}>;
  color?: string;
};

export type LossAnnotation = {
  step: number;
  label: string;
};

const SERIES_COLORS = ["#7c9cff", "#ff8a7c", "#7cffd0", "#ffd87c"];

export const LossCurveScrub: React.FC<{
  series: LossSeries[];
  annotations?: LossAnnotation[];
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({series, annotations, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const width = 760;
  const height = 360;
  const padding = {top: 24, right: 28, bottom: 36, left: 56};
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const allPoints = series.flatMap((s) => s.points);
  const minStep = Math.min(...allPoints.map((p) => p.step));
  const maxStep = Math.max(...allPoints.map((p) => p.step));
  const minVal = Math.min(...allPoints.map((p) => p.value));
  const maxVal = Math.max(...allPoints.map((p) => p.value));

  const stepRange = Math.max(1, maxStep - minStep);
  const valRange = Math.max(0.0001, maxVal - minVal);

  const xFor = (step: number) => padding.left + ((step - minStep) / stepRange) * plotW;
  const yFor = (value: number) => padding.top + (1 - (value - minVal) / valRange) * plotH;

  // Scrub progress: line draws across the time domain after a brief delay.
  const drawStartFrame = Math.round(fps * 0.2);
  const drawDurationFrames = Math.max(60, Math.round(fps * 2.4));
  const drawProgress = Math.max(0, Math.min(1, (frame - drawStartFrame) / drawDurationFrames));

  const annotationStartFrame = drawStartFrame + drawDurationFrames + Math.round(fps * 0.2);

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
        <div style={editorialEyebrow(accent, designLanguage)}>Training curve</div>
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
        {/* y axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding.top + t * plotH;
          const value = maxVal - t * valRange;
          return (
            <g key={`y-${i}`}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.06)" />
              <text x={padding.left - 8} y={y + 4} fill="#7d8aa8" fontSize={11} textAnchor="end" style={{...monoText}}>
                {value.toFixed(2)}
              </text>
            </g>
          );
        })}
        {/* lines */}
        {series.map((s, idx) => {
          const color = s.color ?? SERIES_COLORS[idx % SERIES_COLORS.length];
          const visibleCount = Math.max(2, Math.floor(s.points.length * drawProgress));
          const visible = s.points.slice(0, visibleCount);
          if (visible.length < 2) return null;
          const d = visible.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.step).toFixed(2)} ${yFor(p.value).toFixed(2)}`).join(" ");
          return (
            <g key={`line-${idx}`}>
              <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 4px ${color}88)`}} />
            </g>
          );
        })}
        {/* annotations */}
        {(annotations ?? []).map((ann, i) => {
          const x = xFor(ann.step);
          const annFrame = frame - annotationStartFrame - i * Math.round(fps * 0.4);
          const annAppear = spring({fps, frame: annFrame, config: {damping: 20, stiffness: 140}});
          if (annAppear <= 0.01) return null;
          return (
            <g key={`ann-${i}`} opacity={annAppear}>
              <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke={accent} strokeDasharray="4 4" strokeWidth={1} />
              <rect x={x + 6} y={padding.top + 6} width={Math.max(60, ann.label.length * 8)} height={26} rx={6} fill={`${accent}20`} stroke={accent} strokeWidth={1} />
              <text x={x + 12} y={padding.top + 23} fill={accent} fontSize={13} fontWeight={700} style={{...baseText}}>
                {ann.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
