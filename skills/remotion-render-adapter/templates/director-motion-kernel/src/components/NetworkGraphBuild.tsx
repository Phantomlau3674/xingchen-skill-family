import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, editorialCard, editorialEyebrow} from "../shared";

export type GraphNode = {
  id: string;
  label: string;
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  group?: string;
};

export type GraphEdge = {
  from: string;
  to: string;
  weight?: number;
};

const GROUP_COLORS = ["#7c9cff", "#ff8a7c", "#7cffd0", "#ffd87c", "#c47cff"];

const colorForGroup = (group: string | undefined, fallback: string) => {
  if (!group) return fallback;
  let hash = 0;
  for (let i = 0; i < group.length; i += 1) hash = (hash * 31 + group.charCodeAt(i)) >>> 0;
  return GROUP_COLORS[hash % GROUP_COLORS.length] ?? fallback;
};

export const NetworkGraphBuild: React.FC<{
  nodes: GraphNode[];
  edges: GraphEdge[];
  reveal_order?: string[]; // node ids in build order
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({nodes, edges, reveal_order, accent, frame, fps, designLanguage}) => {
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const width = 760;
  const height = 460;
  const padding = 40;

  const order = reveal_order ?? nodes.map((n) => n.id);
  const nodeStaggerFrames = Math.max(8, Math.round(fps * 0.22));
  const nodesDoneFrame = order.length * nodeStaggerFrames;
  const edgeStartFrame = nodesDoneFrame + Math.round(fps * 0.2);
  const edgeStaggerFrames = Math.max(4, Math.round(fps * 0.12));

  const nodeIndex = (id: string) => order.indexOf(id);
  const positionFor = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return {x: padding, y: padding};
    return {
      x: padding + node.x * (width - padding * 2),
      y: padding + node.y * (height - padding * 2),
    };
  };

  // Drift offset for ambient post-build motion
  const driftPhase = Math.max(0, frame - edgeStartFrame - edges.length * edgeStaggerFrames - fps * 0.5);
  const ambientDrift = Math.sin(driftPhase * 0.04) * 1.5;

  return (
    <div
      style={{
        ...editorialCard("glass-ink", accent, {padding: 22, radius: 28}, designLanguage),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={editorialEyebrow(accent, designLanguage)}>Network</div>
        <div style={{...baseText, fontSize: 13, color: "#9fb0d3"}}>{nodes.length} nodes · {edges.length} edges</div>
      </div>
      <svg width={width} height={height}>
        {/* edges */}
        {edges.map((edge, i) => {
          const a = positionFor(edge.from);
          const b = positionFor(edge.to);
          const edgeLocalFrame = frame - edgeStartFrame - i * edgeStaggerFrames;
          const draw = Math.max(0, Math.min(1, edgeLocalFrame / Math.max(1, fps * 0.4)));
          if (draw <= 0) return null;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const tx = a.x + dx * draw;
          const ty = a.y + dy * draw;
          const strokeOpacity = 0.35 + 0.5 * (edge.weight ?? 0.5);
          return (
            <line
              key={`edge-${i}`}
              x1={a.x + ambientDrift}
              y1={a.y}
              x2={tx + ambientDrift}
              y2={ty}
              stroke={accent}
              strokeOpacity={strokeOpacity}
              strokeWidth={1.5 + 1.5 * (edge.weight ?? 0.5)}
            />
          );
        })}
        {/* nodes */}
        {nodes.map((n) => {
          const idx = nodeIndex(n.id);
          if (idx < 0) return null;
          const nodeLocalFrame = frame - idx * nodeStaggerFrames;
          const nApp = spring({fps, frame: nodeLocalFrame, config: {damping: 22, stiffness: 140}});
          if (nApp <= 0.01) return null;
          const pos = positionFor(n.id);
          const color = colorForGroup(n.group, accent);
          const r = 12 * nApp;
          return (
            <g key={`node-${n.id}`} opacity={nApp} transform={`translate(${pos.x + ambientDrift} ${pos.y})`}>
              <circle r={r + 8} fill={color} fillOpacity={0.15} />
              <circle r={r} fill={color} stroke="#0c1020" strokeWidth={1.5} />
              <text x={0} y={r + 18} fill="#f4f7ff" fontSize={13} fontWeight={700} textAnchor="middle" style={{...baseText}}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
