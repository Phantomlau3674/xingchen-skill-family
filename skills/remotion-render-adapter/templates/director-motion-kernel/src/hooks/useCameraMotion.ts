import {type CSSProperties} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {type CameraPlan} from "../directorData";

type FocusRegion = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const clampRange = (durationFrames: number) => [0, Math.max(1, durationFrames)] as const;

export const useCameraMotion = (
  cameraPlan: CameraPlan | undefined,
  durationFrames: number,
  focusRegion?: FocusRegion | null,
): CSSProperties => {
  const frame = useCurrentFrame();
  const [startFrame, endFrame] = clampRange(durationFrames);

  if (!cameraPlan) {
    return {};
  }

  switch (cameraPlan.move) {
    case "push-in": {
      const scale = interpolate(frame, [startFrame, endFrame], [1, 1.06], {extrapolateRight: "clamp"});
      const translateY = interpolate(frame, [startFrame, endFrame], [0, -8], {extrapolateRight: "clamp"});
      return {
        transform: `scale(${scale}) translateY(${translateY}px)`,
        willChange: "transform",
      };
    }
    case "parallax-drift": {
      const translateX = Math.sin(frame * 0.015) * 12;
      const translateY = Math.cos(frame * 0.012) * 6;
      return {
        transform: `translate(${translateX}px, ${translateY}px) scale(1.015)`,
        willChange: "transform",
      };
    }
    case "proof-punch": {
      const punchStart = Math.floor(durationFrames * 0.6);
      const scale =
        frame <= punchStart
          ? 1
          : interpolate(frame, [punchStart, endFrame], [1, 1.15], {extrapolateRight: "clamp"});
      const translateY =
        frame <= punchStart
          ? 0
          : interpolate(frame, [punchStart, endFrame], [0, -20], {extrapolateRight: "clamp"});
      const centerX = focusRegion ? (focusRegion.x + focusRegion.w / 2) * 100 : 50;
      const centerY = focusRegion ? (focusRegion.y + focusRegion.h / 2) * 100 : 50;
      return {
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transformOrigin: `${centerX}% ${centerY}%`,
        willChange: "transform",
      };
    }
    case "orbit-micro": {
      const rotate = Math.sin(frame * 0.018) * 0.6;
      const translateX = Math.sin(frame * 0.022) * 3;
      return {
        transform: `perspective(1400px) rotate3d(0.22, 0.8, 0, ${rotate}deg) translateX(${translateX}px)`,
        willChange: "transform",
      };
    }
    case "lockoff":
    default:
      return {};
  }
};
