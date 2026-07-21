import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export const TransitionFlash: React.FC<{type: string}> = ({type}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  switch (type) {
    case "zoom-burst":
    case "contrast-cut": {
      const flash = interpolate(frame, [0, 2, durationInFrames], [0, 0.85, 0], {
        extrapolateRight: "clamp",
      });
      return <AbsoluteFill style={{background: "white", opacity: flash, mixBlendMode: "screen"}} />;
    }
    case "whip-pan": {
      const flash = interpolate(frame, [0, 1, 3, durationInFrames], [0, 0.6, 0.3, 0], {
        extrapolateRight: "clamp",
      });
      return (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, rgba(255,120,50,0.8), rgba(50,120,255,0.6))",
            opacity: flash,
            mixBlendMode: "screen",
            filter: `blur(${interpolate(frame, [0, durationInFrames], [0, 20])}px)`,
          }}
        />
      );
    }
    case "dim-pause": {
      const dark = interpolate(frame, [0, Math.floor(durationInFrames / 2), durationInFrames], [0, 0.6, 0], {
        extrapolateRight: "clamp",
      });
      return <AbsoluteFill style={{background: "black", opacity: dark}} />;
    }
    default:
      return null;
  }
};
