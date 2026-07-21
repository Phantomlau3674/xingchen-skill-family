import React from "react";
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {accentLine, baseText, displayText, editorialCard, editorialEyebrow, normalizeText, uniq} from "../shared";

interface HookOpenerProps {
  headline: string;
  bullets: string[];
  accent: string;
  backgroundSrc: string | null;
  textSafeArea?: string;
  compositionMode?: string;
  durationFrames: number;
  designLanguage: string;
}

const SIGNAL_POINTS = [
  {x: 0.12, y: 0.28, size: 10},
  {x: 0.22, y: 0.2, size: 6},
  {x: 0.34, y: 0.36, size: 8},
  {x: 0.56, y: 0.22, size: 9},
  {x: 0.76, y: 0.34, size: 7},
  {x: 0.84, y: 0.18, size: 5},
];

const clipLabel = (text: string, maxChars: number) => {
  const cleaned = normalizeText(text);
  if (!cleaned) {
    return "";
  }
  if (cleaned.length <= maxChars) {
    return cleaned;
  }
  return `${cleaned.slice(0, Math.max(1, maxChars - 1)).trim()}…`;
};

export const HookOpener: React.FC<HookOpenerProps> = ({
  headline,
  bullets,
  accent,
  backgroundSrc,
  textSafeArea,
  compositionMode,
  durationFrames,
  designLanguage,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const isVertical = height > width;

  const intro = spring({fps, frame: frame - 2, config: {damping: 14, stiffness: 100}});
  const orbitEnter = spring({fps, frame: frame - 12, config: {damping: 16, stiffness: 90}});
  const proofEnter = spring({fps, frame: frame - 28, config: {damping: 18, stiffness: 88}});
  const orbitAngle = frame * 0.011;
  const orbitScale = interpolate(orbitEnter, [0, 1], [0.84, 1]);
  const proofLift = Math.sin(frame * 0.04) * 6;
  const introShift = interpolate(intro, [0, 1], [34, 0]);
  const heroScale = interpolate(intro, [0, 1], [0.96, 1]);
  const safeArea = textSafeArea ?? "center-clear";
  const rightAligned = safeArea === "right";
  const leftAligned = safeArea === "left";
  const textAlign = rightAligned ? "right" : leftAligned ? "left" : "center";
  const supportItems = uniq([headline, ...bullets].map((item) => clipLabel(item, isVertical ? 16 : 18))).slice(0, 4);
  const metaLabel = supportItems[1] ?? supportItems[0] ?? "Opening beat";
  const backgroundPosition = compositionMode?.endsWith("-right")
    ? "left center"
    : compositionMode?.endsWith("-left")
      ? "right center"
      : compositionMode?.endsWith("-top")
        ? "center bottom"
        : compositionMode?.endsWith("-bottom")
          ? "center top"
          : "center center";

  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      {backgroundSrc ? (
        <>
          <Img
            src={backgroundSrc}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: backgroundPosition,
              opacity: 0.36,
              filter: "saturate(0.95) contrast(1.02)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                safeArea === "right"
                  ? "linear-gradient(90deg, rgba(5,8,16,0.18) 0%, rgba(5,8,16,0.34) 40%, rgba(5,8,16,0.84) 100%)"
                  : safeArea === "left"
                    ? "linear-gradient(90deg, rgba(5,8,16,0.84) 0%, rgba(5,8,16,0.34) 60%, rgba(5,8,16,0.18) 100%)"
                    : "radial-gradient(circle at center, rgba(5,8,16,0.18) 0%, rgba(5,8,16,0.82) 100%)",
            }}
          />
        </>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: leftAligned ? (isVertical ? 42 : 78) : rightAligned ? "auto" : "50%",
          right: rightAligned ? (isVertical ? 42 : 78) : "auto",
          top: isVertical ? 84 : 70,
          width: isVertical ? "86%" : rightAligned || leftAligned ? "48%" : "58%",
          display: "flex",
          flexDirection: "column",
          alignItems: rightAligned ? "flex-end" : leftAligned ? "flex-start" : "center",
          textAlign,
          gap: 18,
          opacity: intro,
          transform:
            rightAligned || leftAligned
              ? `translateY(${introShift}px) scale(${heroScale})`
              : `translateX(-50%) translateY(${introShift}px) scale(${heroScale})`,
        }}
      >
        <div style={editorialEyebrow(accent, designLanguage)}>Opening beat</div>
        <div style={{...displayText, ...baseText, fontSize: isVertical ? 92 : 80, fontWeight: 700, lineHeight: 0.93, letterSpacing: -2.2, maxWidth: isVertical ? "100%" : "82%"}}>
          {headline}
        </div>
        <div style={accentLine(accent, isVertical ? 260 : 220, designLanguage)} />
        <div style={{display: "flex", flexDirection: "column", alignItems: rightAligned ? "flex-end" : leftAligned ? "flex-start" : "center", gap: 10, maxWidth: isVertical ? "92%" : "70%"}}>
          {bullets.slice(0, 2).map((bullet, index) => (
            <div
              key={`${bullet}-${index}`}
              style={{
                ...baseText,
                fontSize: isVertical ? (index === 0 ? 28 : 24) : (index === 0 ? 24 : 20),
                fontWeight: index === 0 ? 700 : 500,
                lineHeight: 1.35,
                color: index === 0 ? accent : "#d9e2f4",
              }}
            >
              {bullet}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: isVertical ? 254 : 154,
          width: isVertical ? 640 : 760,
          height: isVertical ? 640 : 620,
          opacity: orbitEnter,
          transform: `translateX(-50%) scale(${orbitScale})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: isVertical ? 68 : 56,
            borderRadius: "50%",
            border: `1px solid ${accent}40`,
            boxShadow: `0 0 34px ${accent}18`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: isVertical ? 136 : 116,
            borderRadius: "50%",
            border: `1px solid ${accent}24`,
          }}
        />
        <div
          style={{
            position: "absolute",
          left: "50%",
          top: "50%",
          width: 120,
            height: 120,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${accent}34 0%, transparent 70%)`,
            filter: "blur(6px)",
          }}
        />

        {SIGNAL_POINTS.map((point, index) => {
          const radius = isVertical ? 190 : 212;
          const angle = orbitAngle + index * 0.74;
          const cx = 280 + Math.cos(angle) * radius * point.x;
          const cy = 260 + Math.sin(angle) * radius * point.y * 1.4;
          return (
            <React.Fragment key={`${point.x}-${point.y}`}>
              <div
                style={{
                  position: "absolute",
                  left: 280,
                  top: 260,
                  width: Math.hypot(cx - 280, cy - 260),
                  height: 1,
                  background: `linear-gradient(90deg, ${accent}00, ${accent}66)`,
                  transformOrigin: "0 0",
                  transform: `rotate(${(Math.atan2(cy - 260, cx - 280) * 180) / Math.PI}deg)`,
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: cx - point.size / 2,
                  top: cy - point.size / 2,
                  width: point.size,
                  height: point.size,
                  borderRadius: "50%",
                  background: index % 2 === 0 ? accent : "#f4f7ff",
                  boxShadow: index % 2 === 0 ? `0 0 16px ${accent}` : "0 0 10px rgba(255,255,255,0.4)",
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: isVertical ? 196 : 132,
          width: isVertical ? "82%" : 560,
          opacity: proofEnter,
          transform: `translateX(-50%) translateY(${interpolate(proofEnter, [0, 1], [40, 0]) + proofLift}px)`,
        }}
      >
        <div style={editorialCard(backgroundSrc ? "glass-ink" : "screen-emissive", accent, {padding: 18, radius: 34}, designLanguage)}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14}}>
            <div style={editorialEyebrow(accent, designLanguage)}>{clipLabel(headline, 18) || "Opening beat"}</div>
            <div style={{...baseText, fontSize: 13, color: "#9cb0d8"}}>{metaLabel}</div>
          </div>
          {backgroundSrc ? (
            <div style={{borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)"}}>
              <Img src={backgroundSrc} style={{width: "100%", height: 280, objectFit: "cover", display: "block"}} />
            </div>
          ) : (
            <div style={{display: "grid", gridTemplateColumns: supportItems.length > 2 ? "1fr 1fr" : "1fr", gap: 12}}>
              {supportItems.map((item) => (
                <div key={item} style={{...editorialCard("screen-emissive", accent, {padding: 16, radius: 22}, designLanguage), minHeight: 86, display: "flex", alignItems: "flex-end", ...baseText, fontSize: 18, fontWeight: 700}}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
