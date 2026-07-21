import React from "react";

type NarrativeProgressProps = {
  currentScene: number;
  totalScenes: number;
  progress: number;
  beatColors: string[];
  accent: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const NarrativeProgress: React.FC<NarrativeProgressProps> = ({
  currentScene,
  totalScenes,
  progress,
  beatColors,
  accent,
}) => {
  const safeTotal = Math.max(1, totalScenes);
  const globalProgress = clamp01((currentScene + clamp01(progress)) / safeTotal);

  return (
    <div
      style={{
        position: "absolute",
        left: "6%",
        right: "6%",
        bottom: 18,
        height: 10,
        borderRadius: 999,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${beatColors.join(", ") || accent})`,
          opacity: 0.16,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${globalProgress * 100}%`,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${beatColors.slice(0, Math.max(currentScene + 1, 1)).join(", ") || accent})`,
          boxShadow: `0 0 22px ${accent}66`,
        }}
      />
      {Array.from({length: safeTotal}).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${((index + 1) / safeTotal) * 100}%`,
            top: 1,
            bottom: 1,
            width: 1,
            background: "rgba(255,255,255,0.12)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: 8,
          top: -22,
          color: "#dce6f8",
          fontSize: 12,
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        Story arc
      </div>
    </div>
  );
};
