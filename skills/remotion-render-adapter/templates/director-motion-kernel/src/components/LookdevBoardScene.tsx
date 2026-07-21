import React from "react";
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {type BoardMotion, type DirectorScene} from "../directorData";
import {materialSurface} from "../shared";
import {useCameraMotion} from "../hooks/useCameraMotion";
import {BoardMotionOverlay} from "./BoardMotionOverlay";

export const LookdevBoardScene: React.FC<{
  scene: DirectorScene;
  src: string;
  accent: string;
  designLanguage: string;
  boardMotion?: BoardMotion | null;
}> = ({scene, src, accent, designLanguage, boardMotion}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const durationFrames = Math.max(1, Math.round(scene.duration_s * fps));
  const reveal = spring({fps, frame: frame - 2, config: {damping: 18, stiffness: 90}});
  const boardScale = interpolate(reveal, [0, 1], [0.982, 1.006], {extrapolateRight: "clamp"});
  const boardOpacity = interpolate(reveal, [0, 1], [0.2, 1], {extrapolateRight: "clamp"});
  const driftX = Math.sin(frame * 0.012) * 8;
  const driftY = Math.cos(frame * 0.009) * 6;
  const sweep = interpolate(frame % Math.max(durationFrames, 1), [0, durationFrames], [-26, 26], {extrapolateRight: "clamp"});
  const cameraMotion = useCameraMotion(scene.camera_plan, durationFrames);
  const cameraTransform = typeof cameraMotion.transform === "string" ? cameraMotion.transform : "";
  const timeS = frame / fps;
  const activeBeat = boardMotion?.camera_beats?.find((beat) => timeS >= beat.start_s && timeS <= beat.end_s) ?? null;
  const activeFocus = activeBeat?.focus_region_id
    ? boardMotion?.focus_regions.find((region) => region.region_id === activeBeat.focus_region_id) ?? null
    : boardMotion?.focus_regions[0] ?? null;
  const beatProgress = activeBeat
    ? spring({fps, frame: frame - Math.round(activeBeat.start_s * fps), config: {damping: 18, stiffness: 110}})
    : 0;
  const beatIntensity = (activeBeat?.intensity ?? 0.6) * beatProgress;
  const beatScale = activeBeat?.move === "focus-punch"
    ? 1 + beatIntensity * 0.03
    : activeBeat?.move === "push"
      ? 1 + beatIntensity * 0.02
      : 1 + beatIntensity * 0.012;
  const beatShiftX = activeBeat?.move === "drift" ? Math.sin(frame * 0.024) * 12 * beatIntensity : 0;
  const beatShiftY = activeBeat?.move === "drift" ? Math.cos(frame * 0.02) * 8 * beatIntensity : 0;
  const transformOrigin = activeFocus
    ? `${(activeFocus.region.x + activeFocus.region.w / 2) * 100}% ${(activeFocus.region.y + activeFocus.region.h / 2) * 100}%`
    : "50% 50%";
  const boardTransform = `${cameraTransform} translate3d(${driftX + beatShiftX}px, ${driftY + beatShiftY}px, 0) scale(${boardScale * beatScale})`.trim();

  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 16%, ${accent}1c 0%, transparent 36%), radial-gradient(circle at 18% 84%, ${accent}12 0%, transparent 28%)`,
          filter: "blur(26px)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: boardOpacity,
          transform: boardTransform,
          transformOrigin,
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...materialSurface("screen-emissive", designLanguage),
            overflow: "hidden",
          }}
        >
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: "saturate(1.02) contrast(1.02)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(112deg, transparent 28%, ${accent}18 48%, transparent 64%)`,
              transform: `translateX(${sweep}px)`,
              mixBlendMode: "screen",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at center, transparent 58%, rgba(4,8,16,0.44) 100%)",
              pointerEvents: "none",
            }}
          />
          {boardMotion ? <BoardMotionOverlay motion={boardMotion} accent={accent} /> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
