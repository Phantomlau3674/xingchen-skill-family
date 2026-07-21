import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {
  type BoardFocusRegion,
  type BoardMotion,
  type BoardMotionActivation,
  type BoardMotionCameraBeat,
  type BoardMotionConnector,
  type BoardMotionGlyphGroup,
  type BoardMotionModule,
} from "../directorData";
import {baseText, displayText} from "../shared";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const colorForRole = (accent: string, role?: string) => {
  switch (role) {
    case "warm":
      return "#ff8b6b";
    case "secondary":
      return "#7da8ff";
    case "neutral":
      return "rgba(219, 228, 245, 0.92)";
    default:
      return accent;
  }
};

const activationWindow = (
  activationTrack: BoardMotionActivation[],
  targetKind: BoardMotionActivation["target_kind"],
  targetId: string,
  fallbackEndS: number,
) => {
  const matches = activationTrack
    .filter((item) => item.target_kind === targetKind && item.target_id === targetId)
    .sort((left, right) => left.start_s - right.start_s);
  if (!matches.length) {
    return {start_s: 0, end_s: fallbackEndS, emphasis: "secondary" as const};
  }
  return {
    start_s: matches[0].start_s,
    end_s: matches[matches.length - 1].end_s,
    emphasis: matches[0].emphasis ?? "secondary",
  };
};

const progressForWindow = (frame: number, fps: number, startS: number) =>
  clamp01(spring({fps, frame: frame - Math.round(startS * fps), config: {damping: 18, stiffness: 120}}));

const activityForWindow = (timeS: number, startS: number, endS: number) => {
  if (timeS < startS) {
    return 0;
  }
  if (timeS <= endS) {
    return 1;
  }
  return clamp01(0.46 - (timeS - endS) * 0.45);
};

const transformFromReveal = (module: BoardMotionModule, frame: number, progress: number, activity: number) => {
  const lift = (module.lift_px ?? 18) * (1 - progress);
  const parallaxStrength = (module.parallax_px ?? 8) * (0.22 + activity * 0.78);
  const swayX = Math.sin(frame * 0.02 + module.region.x * 16) * parallaxStrength;
  const swayY = Math.cos(frame * 0.018 + module.region.y * 18) * (parallaxStrength * 0.6);

  switch (module.reveal_from) {
    case "up":
      return `translate3d(${swayX}px, ${lift + swayY}px, 0) scale(${0.94 + progress * 0.06})`;
    case "down":
      return `translate3d(${swayX}px, ${-lift + swayY}px, 0) scale(${0.94 + progress * 0.06})`;
    case "left":
      return `translate3d(${lift + swayX}px, ${swayY}px, 0) scale(${0.95 + progress * 0.05})`;
    case "right":
      return `translate3d(${-lift + swayX}px, ${swayY}px, 0) scale(${0.95 + progress * 0.05})`;
    case "scale":
    default:
      return `translate3d(${swayX}px, ${swayY}px, 0) scale(${0.9 + progress * 0.1})`;
  }
};

const pathFromPoints = (points: BoardMotionConnector["points"]) =>
  points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x * 100} ${point.y * 100}`).join(" ");

const markerIdFor = (connectorId: string) => `board-motion-arrow-${connectorId}`;

const FocusRegionOverlay: React.FC<{
  region: BoardFocusRegion;
  accent: string;
  frame: number;
  progress: number;
  activity: number;
}> = ({region, accent, frame, progress, activity}) => {
  const glowScale = 0.92 + progress * 0.14 + Math.sin(frame * 0.03) * 0.02;
  const glowOpacity = 0.08 + progress * 0.18 + activity * 0.1;
  return (
    <div
      style={{
        position: "absolute",
        left: `${region.region.x * 100}%`,
        top: `${region.region.y * 100}%`,
        width: `${region.region.w * 100}%`,
        height: `${region.region.h * 100}%`,
        transform: `scale(${glowScale})`,
        transformOrigin: "center center",
        borderRadius: 32,
        border: `1px solid ${accent}${region.emphasis === "primary" ? "8a" : "52"}`,
        background:
          region.emphasis === "primary"
            ? `radial-gradient(circle at center, ${accent}20 0%, transparent 70%)`
            : `radial-gradient(circle at center, ${accent}14 0%, transparent 72%)`,
        boxShadow: `0 0 42px ${accent}${region.emphasis === "primary" ? "5a" : "34"}`,
        opacity: glowOpacity,
      }}
    />
  );
};

const ModuleOverlay: React.FC<{
  module: BoardMotionModule;
  accent: string;
  frame: number;
  progress: number;
  activity: number;
}> = ({module, accent, frame, progress, activity}) => {
  const color = colorForRole(accent, module.color_role);
  const glowStrength = module.glow_strength ?? 0.9;
  return (
    <div
      style={{
        position: "absolute",
        left: `${module.region.x * 100}%`,
        top: `${module.region.y * 100}%`,
        width: `${module.region.w * 100}%`,
        height: `${module.region.h * 100}%`,
        transform: transformFromReveal(module, frame, progress, activity),
        transformOrigin: "center center",
        borderRadius: module.border_radius ?? 20,
        border: `1.5px solid ${color}${activity > 0.7 ? "cc" : "70"}`,
        background: `linear-gradient(180deg, ${color}14, rgba(8,12,22,0.02))`,
        boxShadow: `0 0 ${28 + glowStrength * 18}px ${color}${activity > 0.75 ? "5a" : "22"}, inset 0 0 0 1px ${color}1a`,
        opacity: 0.12 + progress * 0.86,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: "6px 10px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${color}24, rgba(10,14,24,0.56))`,
          border: `1px solid ${color}40`,
          color,
          ...baseText,
          ...displayText,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          opacity: 0.62 + progress * 0.38,
        }}
      >
        {module.label}
      </div>
    </div>
  );
};

const ConnectorOverlay: React.FC<{
  connector: BoardMotionConnector;
  accent: string;
  frame: number;
  fps: number;
  progress: number;
  activity: number;
  flowSpeed: number;
}> = ({connector, accent, frame, fps, progress, activity, flowSpeed}) => {
  if (!connector.points.length) {
    return null;
  }
  const color = colorForRole(accent, connector.color_role);
  const markerId = markerIdFor(connector.connector_id);
  const dashOffset = -((frame / fps) * 0.18 * flowSpeed);
  const path = pathFromPoints(connector.points);
  const showArrow = connector.style === "arrow";
  const showFlow = connector.animated === "flow";
  const showPulse = connector.animated === "pulse";

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: "absolute", inset: 0, overflow: "visible"}}>
      <defs>
        <marker id={markerId} viewBox="0 0 8 8" refX="6.2" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={color} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`${color}22`}
        strokeWidth={showPulse ? 1.6 : 1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={showArrow ? `url(#${markerId})` : undefined}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={showPulse ? 1.8 + activity * 0.8 : 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={showArrow ? `url(#${markerId})` : undefined}
        pathLength={1}
        strokeDasharray={showFlow ? "0.12 0.1" : "1"}
        strokeDashoffset={showFlow ? dashOffset : 1 - progress}
        opacity={0.18 + Math.max(progress, activity) * 0.82}
        style={{
          filter: `drop-shadow(0 0 ${showPulse ? 12 : 8}px ${color})`,
        }}
      />
    </svg>
  );
};

const GlyphGroupOverlay: React.FC<{
  group: BoardMotionGlyphGroup;
  accent: string;
  frame: number;
  progress: number;
  activity: number;
}> = ({group, accent, frame, progress, activity}) => (
  <>
    {group.glyphs.map((glyph, index) => {
      const sizePx = glyph.size === "lg" ? 64 : glyph.size === "sm" ? 28 : 42;
      const offsetWave = group.behavior === "orbit"
        ? {
            x: Math.sin(frame * 0.028 + index) * 8,
            y: Math.cos(frame * 0.022 + index) * 6,
          }
        : group.behavior === "pulse"
          ? {
              x: 0,
              y: Math.sin(frame * 0.05 + index) * 4,
            }
          : group.behavior === "settle"
            ? {
                x: 0,
                y: (1 - progress) * 14,
              }
            : {
                x: Math.sin(frame * 0.016 + index) * 3,
                y: Math.cos(frame * 0.018 + index) * 2,
              };
      const color = glyph.accent ?? accent;
      const baseScale = glyph.type === "spark" ? 0.88 : 0.94;
      const scale = baseScale + progress * 0.18 + activity * 0.06;
      return (
        <div
          key={glyph.glyph_id}
          style={{
            position: "absolute",
            left: `calc(${glyph.x * 100}% - ${sizePx / 2}px + ${offsetWave.x}px)`,
            top: `calc(${glyph.y * 100}% - ${sizePx / 2}px + ${offsetWave.y}px)`,
            minWidth: sizePx,
            minHeight: glyph.type === "badge" || glyph.type === "counter-pill" || glyph.type === "icon-chip" ? sizePx * 0.7 : sizePx * 0.46,
            padding: glyph.label ? "8px 12px" : 0,
            borderRadius: glyph.type === "dot" ? 999 : 18,
            background:
              glyph.type === "spark"
                ? "transparent"
                : `linear-gradient(135deg, ${color}24, rgba(10,14,24,0.58))`,
            border: glyph.type === "spark" ? "none" : `1px solid ${color}48`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color,
            ...baseText,
            fontSize: glyph.size === "lg" ? 18 : 14,
            fontWeight: 700,
            letterSpacing: 0.25,
            transform: `scale(${scale})`,
            boxShadow: glyph.type === "spark" ? "none" : `0 0 18px ${color}34`,
            opacity: glyph.type === "spark" ? 0.45 + progress * 0.55 : 0.24 + progress * 0.76,
          }}
        >
          {glyph.type === "spark" ? (
            <div style={{width: sizePx * 0.34, height: sizePx * 0.34, borderRadius: 999, background: color, boxShadow: `0 0 14px ${color}`}} />
          ) : glyph.label ? (
            <>
              {glyph.icon ? <span style={{fontSize: glyph.size === "lg" ? 18 : 14}}>{glyph.icon}</span> : null}
              <span>{glyph.label}</span>
            </>
          ) : (
            <div style={{width: sizePx * 0.32, height: sizePx * 0.32, borderRadius: 999, background: color, boxShadow: `0 0 12px ${color}`}} />
          )}
        </div>
      );
    })}
  </>
);

const beatForTime = (cameraBeats: BoardMotionCameraBeat[] | undefined, timeS: number) =>
  cameraBeats?.find((beat) => timeS >= beat.start_s && timeS <= beat.end_s) ?? null;

export const BoardMotionOverlay: React.FC<{
  motion: BoardMotion;
  accent: string;
}> = ({motion, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const timeS = frame / fps;
  const beat = beatForTime(motion.camera_beats, timeS);
  const dimStrength = motion.manual_overrides?.dim_strength ?? 0.28;
  const overlayOpacity = motion.manual_overrides?.overlay_opacity ?? 0.88;
  const flowSpeed = motion.manual_overrides?.connector_flow_speed ?? 1;
  const beatFocusRegion = beat?.focus_region_id
    ? motion.focus_regions.find((region) => region.region_id === beat.focus_region_id) ?? null
    : motion.focus_regions[0] ?? null;

  return (
    <AbsoluteFill style={{pointerEvents: "none", opacity: overlayOpacity}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(4,8,16,${Math.min(0.42, dimStrength * 0.8).toFixed(2)}), rgba(4,8,16,${Math.min(0.58, dimStrength + 0.08).toFixed(2)}))`,
          mixBlendMode: "multiply",
        }}
      />

      {motion.focus_regions.map((region) => {
        const window = activationWindow(motion.activation_track, "focus-region", region.region_id, 12);
        const progress = progressForWindow(frame, fps, window.start_s);
        const activity = activityForWindow(timeS, window.start_s, window.end_s);
        return <FocusRegionOverlay key={region.region_id} region={region} accent={accent} frame={frame} progress={progress} activity={activity} />;
      })}

      {motion.modules.map((module) => {
        const window = activationWindow(motion.activation_track, "module", module.module_id, 12);
        const progress = progressForWindow(frame, fps, window.start_s);
        const activity = activityForWindow(timeS, window.start_s, window.end_s);
        return <ModuleOverlay key={module.module_id} module={module} accent={accent} frame={frame} progress={progress} activity={activity} />;
      })}

      {motion.connectors.map((connector) => {
        const window = activationWindow(motion.activation_track, "connector", connector.connector_id, 12);
        const progress = progressForWindow(frame, fps, window.start_s);
        const activity = activityForWindow(timeS, window.start_s, window.end_s);
        return (
          <ConnectorOverlay
            key={connector.connector_id}
            connector={connector}
            accent={accent}
            frame={frame}
            fps={fps}
            progress={progress}
            activity={activity}
            flowSpeed={flowSpeed}
          />
        );
      })}

      {motion.glyph_groups.map((group) => {
        const window = activationWindow(motion.activation_track, "glyph-group", group.group_id, 12);
        const progress = progressForWindow(frame, fps, window.start_s);
        const activity = activityForWindow(timeS, window.start_s, window.end_s);
        return <GlyphGroupOverlay key={group.group_id} group={group} accent={accent} frame={frame} progress={progress} activity={activity} />;
      })}

      {beatFocusRegion ? (
        <div
          style={{
            position: "absolute",
            left: `${beatFocusRegion.region.x * 100}%`,
            top: `${beatFocusRegion.region.y * 100}%`,
            width: `${beatFocusRegion.region.w * 100}%`,
            height: `${beatFocusRegion.region.h * 100}%`,
            borderRadius: 42,
            background: `radial-gradient(circle at center, ${accent}20 0%, transparent 76%)`,
            filter: "blur(12px)",
            opacity: 0.2 + interpolate(Math.sin(frame * 0.04), [-1, 1], [0.04, 0.2]),
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
