import React from "react";
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {accentLine, baseText, displayText, editorialCard, editorialEyebrow, materialSurface} from "../shared";

interface RemotionDemoProps {
  headline: string;
  bullets: string[];
  accent: string;
  durationFrames: number;
  assetSrc?: string | null;
  designLanguage: string;
}

const WORKFLOW_STEPS = ["Narration", "Strategy", "Editorial", "Render"];

export const RemotionDemo: React.FC<RemotionDemoProps> = ({
  headline,
  bullets,
  accent,
  assetSrc,
  designLanguage,
}) => {
  const frame = useCurrentFrame();
  const {fps, height, width} = useVideoConfig();
  const isVertical = height > width;
  const intro = spring({fps, frame: frame - 4, config: {damping: 15, stiffness: 110}});
  const graphEnter = spring({fps, frame: frame - 14, config: {damping: 18, stiffness: 90}});

  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: isVertical ? 86 : 78,
          width: isVertical ? "86%" : "56%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: intro,
          transform: `translateX(-50%) translateY(${interpolate(intro, [0, 1], [24, 0])}px)`,
        }}
      >
        <div style={editorialEyebrow(accent, designLanguage)}>Focus / system map</div>
        <div style={{...displayText, ...baseText, fontSize: isVertical ? 78 : 66, fontWeight: 700, lineHeight: 0.96, letterSpacing: -1.8, marginTop: 20, maxWidth: isVertical ? "100%" : "84%"}}>
          {headline}
        </div>
        <div style={{marginTop: 18, ...accentLine(accent, isVertical ? 220 : 180, designLanguage)}} />
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 20, maxWidth: isVertical ? "92%" : "72%"}}>
          {bullets.map((bullet, index) => (
            <div key={`${bullet}-${index}`} style={{...baseText, fontSize: isVertical ? (index === 0 ? 28 : 24) : (index === 0 ? 24 : 20), color: index === 0 ? accent : "#d4dff3", fontWeight: index === 0 ? 600 : 500, lineHeight: 1.35}}>
              {bullet}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: isVertical ? 326 : 246,
          width: isVertical ? width - 72 : width * 0.62,
          ...editorialCard("matte-paper", accent, {padding: 24, radius: 34}, designLanguage),
          opacity: graphEnter,
          transform: `translateX(-50%) translateY(${interpolate(graphEnter, [0, 1], [30, 0])}px)`,
        }}
      >
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={editorialEyebrow(accent, designLanguage)}>Director flow</div>
          <div style={{...baseText, fontSize: 13, color: "#9cb0d8"}}>{assetSrc ? "generated proof" : "zero empty scenes"}</div>
        </div>
        {assetSrc ? (
          <div style={{marginTop: 28, ...materialSurface("matte-paper", designLanguage), borderRadius: 28, overflow: "hidden", minHeight: isVertical ? 300 : 340}}>
            <Img src={assetSrc} style={{width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#0a1020"}} />
          </div>
        ) : (
          <div style={{position: "relative", marginTop: 28, height: isVertical ? 250 : 220}}>
            <div style={{position: "absolute", left: 50, right: 50, top: "50%", height: 2, marginTop: -1, background: `linear-gradient(90deg, ${accent}22, ${accent}80, ${accent}22)`}} />
            <div style={{display: "grid", gridTemplateColumns: `repeat(${WORKFLOW_STEPS.length}, 1fr)`, gap: 16}}>
              {WORKFLOW_STEPS.map((step, index) => {
                const delay = spring({fps, frame: frame - 18 - index * 6, config: {damping: 18, stiffness: 92}});
                return (
                  <div
                    key={step}
                    style={{
                  ...editorialCard(index % 2 === 0 ? "screen-emissive" : "glass-ink", accent, {padding: 18, radius: 26}, designLanguage),
                      minHeight: isVertical ? 188 : 176,
                      transform: `translateY(${interpolate(delay, [0, 1], [22, 0])}px)`,
                      opacity: delay,
                    }}
                  >
                    <div style={{width: 16, height: 16, borderRadius: "50%", background: accent, boxShadow: `0 0 18px ${accent}`}} />
                    <div style={{...displayText, ...baseText, fontSize: 22, fontWeight: 700, marginTop: 18}}>
                      {step}
                    </div>
                    <div style={{...baseText, fontSize: 15, color: "#a9bbdf", marginTop: 10}}>
                      {index === 0 ? "understand the narration" : index === 1 ? "lock the visual strategy" : index === 2 ? "assign motion and sound" : "review before output"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
