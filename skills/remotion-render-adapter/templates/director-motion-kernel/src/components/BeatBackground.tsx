import React from "react";
import {EDITORIAL_TEXTURES} from "../theme";

export const BeatBackground: React.FC<{
  beat: string;
  accent: string;
  frame: number;
  backgroundFamily?: string;
}> = ({beat, accent, frame, backgroundFamily}) => {
  const shift = Math.sin(frame * 0.012) * 10;
  const family = backgroundFamily ?? ({
    hook: "atmospheric-grid",
    mechanism: "studio-halo",
    example: "proof-slate",
    caveat: "contrast-vignette",
    cta: "warm-resolve",
  }[beat] || "studio-halo");

  const variants: Record<string, {base: string; pattern?: string; atmosphere?: string}> = {
    "atmospheric-grid": {
      base: `radial-gradient(circle at 18% 20%, ${accent}24 0%, transparent 34%), linear-gradient(${136 + shift}deg, #060b14 0%, #0b1730 56%, #04070e 100%)`,
      pattern: `linear-gradient(${accent}26 1px, transparent 1px), linear-gradient(90deg, ${accent}20 1px, transparent 1px)`,
      atmosphere: `radial-gradient(circle at 52% 42%, ${accent}18 0%, transparent 40%)`,
    },
    "studio-halo": {
      base: `radial-gradient(circle at 48% 24%, ${accent}22 0%, transparent 32%), linear-gradient(${120 + shift}deg, #081018 0%, #101824 54%, #050a10 100%)`,
      pattern: "linear-gradient(120deg, rgba(255,255,255,0.04) 0%, transparent 24%, transparent 76%, rgba(255,255,255,0.03) 100%)",
      atmosphere: `radial-gradient(circle at 50% 44%, ${accent}14 0%, transparent 48%)`,
    },
    "proof-slate": {
      base: `radial-gradient(circle at 74% 18%, ${accent}14 0%, transparent 26%), linear-gradient(${150 + shift}deg, #130f18 0%, #1a1124 48%, #07070d 100%)`,
      pattern: "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 22px)",
      atmosphere: `radial-gradient(circle at 58% 60%, ${accent}10 0%, transparent 44%)`,
    },
    "contrast-vignette": {
      base: `radial-gradient(circle at 50% 50%, ${accent}10 0%, transparent 32%), linear-gradient(${176 + shift}deg, #170f12 0%, #120d12 52%, #060608 100%)`,
      pattern: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 18%, transparent 82%, rgba(255,255,255,0.03) 100%)",
      atmosphere: `radial-gradient(circle at 18% 78%, ${accent}10 0%, transparent 32%)`,
    },
    "warm-resolve": {
      base: `radial-gradient(circle at 52% 16%, ${accent}18 0%, transparent 34%), linear-gradient(${112 + shift}deg, #1b1111 0%, #140d11 45%, #06070c 100%)`,
      pattern: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%)",
      atmosphere: `radial-gradient(circle at 50% 48%, ${accent}12 0%, transparent 50%)`,
    },
  };

  const variant = variants[family] ?? variants["studio-halo"];

  return (
    <div style={{position: "absolute", inset: 0}}>
      <div style={{position: "absolute", inset: 0, background: variant.base}} />
      <div style={{position: "absolute", inset: 0, background: variant.atmosphere, opacity: 0.8, filter: "blur(36px)"}} />
      {variant.pattern ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: family === "atmospheric-grid" ? 0.08 : 0.06,
            backgroundImage: variant.pattern,
            backgroundSize: family === "atmospheric-grid" ? "52px 52px" : "100% 100%",
            transform: family === "atmospheric-grid" ? `perspective(1100px) rotateX(64deg) translateY(${-frame * 0.55}px)` : undefined,
            transformOrigin: family === "atmospheric-grid" ? "center 120%" : undefined,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: EDITORIAL_TEXTURES.grain,
          backgroundSize: "7px 7px",
          opacity: 0.06,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: EDITORIAL_TEXTURES.scanline,
          opacity: 0.06,
          mixBlendMode: "soft-light",
        }}
      />
      <div style={{position: "absolute", inset: 0, background: EDITORIAL_TEXTURES.topLight, opacity: 0.22}} />
      <div style={{position: "absolute", inset: 0, background: EDITORIAL_TEXTURES.sideLight, opacity: 0.24}} />
      <div style={{position: "absolute", inset: 0, background: EDITORIAL_TEXTURES.edgeFalloff}} />
    </div>
  );
};
