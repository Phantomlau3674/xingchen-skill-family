import React, {type CSSProperties} from "react";
import {staticFile} from "remotion";
import {type AssetPlacement, type DirectorScene, type SeriesConfig} from "./directorData";
import {EDITORIAL_TEXTURES, FONT_STACKS, MATERIALS} from "./theme";

export const FPS = 30;

export const BEAT_PACING: Record<string, number> = {
  hook: 0.8,
  mechanism: 1.0,
  example: 1.3,
  caveat: 0.9,
  cta: 1.5,
};

export const palette: Record<string, {accent: string; accentSoft: string; glow: string}> = {
  hook: {accent: "#79e8ff", accentSoft: "rgba(121,232,255,0.20)", glow: "rgba(121,232,255,0.18)"},
  mechanism: {accent: "#66f2b6", accentSoft: "rgba(102,242,182,0.18)", glow: "rgba(102,242,182,0.14)"},
  example: {accent: "#ff9adf", accentSoft: "rgba(255,154,223,0.20)", glow: "rgba(255,154,223,0.16)"},
  caveat: {accent: "#ffd87d", accentSoft: "rgba(255,216,125,0.18)", glow: "rgba(255,216,125,0.16)"},
  cta: {accent: "#ff9b8c", accentSoft: "rgba(255,155,140,0.20)", glow: "rgba(255,155,140,0.16)"},
};

export const baseText: CSSProperties = {
  color: "#f4f7ff",
  fontFamily: FONT_STACKS.body,
};

export const displayText: CSSProperties = {
  fontFamily: FONT_STACKS.display,
};

export const monoText: CSSProperties = {
  fontFamily: FONT_STACKS.mono,
};

export const normalizeText = (text: string) => String(text ?? "").replace(/\s+/g, " ").trim();

export const uniq = (values: string[]) => {
  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const cleaned = normalizeText(value);
    if (!cleaned || seen.has(cleaned)) {
      continue;
    }
    seen.add(cleaned);
    ordered.push(cleaned);
  }
  return ordered;
};

export const sceneFrames = (scene: DirectorScene) => Math.max(1, Math.round(scene.duration_s * FPS));

export const stagePadding = (isVertical: boolean) => (isVertical ? 34 : 84);

export const getBeatColors = (beat: string) => palette[beat] ?? palette.mechanism;
export const getPacing = (beat: string) => BEAT_PACING[beat] ?? 1.0;

export type DesignLanguage = "uncodixified-editorial" | "brand-first-editorial" | "premium-tech-editorial" | string;

export const isUncodixifiedLanguage = (designLanguage?: DesignLanguage) => designLanguage === "uncodixified-editorial";

export const materialSurface = (material: keyof typeof MATERIALS, designLanguage: DesignLanguage = "premium-tech-editorial"): CSSProperties => {
  const item = MATERIALS[material] ?? MATERIALS["screen-emissive"];
  if (isUncodixifiedLanguage(designLanguage)) {
    return {
      background: item.panel,
      border: `1px solid ${item.border}`,
      boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
    };
  }
  return {
    background: `${EDITORIAL_TEXTURES.topLight}, ${item.panel}`,
    border: `1px solid ${item.border}`,
    boxShadow: item.shadow,
    backdropFilter: "blur(24px) saturate(135%)",
    WebkitBackdropFilter: "blur(24px) saturate(135%)",
  };
};

export const editorialCard = (
  material: keyof typeof MATERIALS,
  accent: string,
  options?: {padding?: number; radius?: number},
  designLanguage: DesignLanguage = "premium-tech-editorial",
): CSSProperties => {
  const item = MATERIALS[material] ?? MATERIALS["screen-emissive"];
  const radius = isUncodixifiedLanguage(designLanguage) ? Math.min(options?.radius ?? 14, 14) : (options?.radius ?? 30);
  if (isUncodixifiedLanguage(designLanguage)) {
    return {
      position: "relative",
      overflow: "hidden",
      borderRadius: radius,
      padding: options?.padding ?? 20,
      background: item.panel,
      border: `1px solid ${item.border}`,
      boxShadow: "0 4px 14px rgba(0,0,0,0.16)",
    };
  }
  return {
    position: "relative",
    overflow: "hidden",
    borderRadius: radius,
    padding: options?.padding ?? 24,
    background: `${EDITORIAL_TEXTURES.topLight}, ${EDITORIAL_TEXTURES.sideLight}, ${item.panel}`,
    border: `1px solid ${item.border}`,
    boxShadow: `${item.shadow}, inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px ${accent}14`,
    backdropFilter: "blur(24px) saturate(135%)",
    WebkitBackdropFilter: "blur(24px) saturate(135%)",
  };
};

export const editorialEyebrow = (accent: string, designLanguage: DesignLanguage = "premium-tech-editorial"): CSSProperties => (
  isUncodixifiedLanguage(designLanguage)
    ? {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: 0,
        color: accent,
        fontFamily: FONT_STACKS.body,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: 0.2,
        textTransform: "none",
      }
    : {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 999,
        background: `linear-gradient(135deg, ${accent}16, rgba(255,255,255,0.03))`,
        border: `1px solid ${accent}44`,
        boxShadow: `0 10px 32px ${accent}18`,
        color: accent,
        fontFamily: FONT_STACKS.display,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1.4,
        textTransform: "uppercase",
      }
);

export const accentLine = (accent: string, width: number, designLanguage: DesignLanguage = "premium-tech-editorial"): CSSProperties => (
  isUncodixifiedLanguage(designLanguage)
    ? {
        width,
        height: 2,
        borderRadius: 2,
        background: accent,
        opacity: 0.9,
      }
    : {
        width,
        height: 4,
        borderRadius: 999,
        background: `linear-gradient(90deg, transparent, ${accent}, ${accent}, transparent)`,
        boxShadow: `0 0 22px ${accent}55`,
      }
);

export const Glass: React.FC<{children: React.ReactNode; style?: CSSProperties}> = ({children, style}) => (
  <div style={{borderRadius: 34, ...style}}>{children}</div>
);

export const resolveStatic = (file: string) => {
  const value = normalizeText(file);
  if (!value) {
    return null;
  }
  if (/^[a-z]+:\/\//i.test(value)) {
    return value;
  }
  if (/^[A-Za-z]:[\\/]/.test(value)) {
    const normalized = value.replace(/\\/g, "/");
    const basename = normalized.split("/").pop() ?? normalized;
    const lower = normalized.toLowerCase();
    if (lower.includes("/audio/") || lower.includes("/voice/")) {
      return staticFile(`audio/${basename}`);
    }
    return staticFile(`screenshots/${basename}`);
  }
  if (value.startsWith("/")) {
    return staticFile(value.slice(1));
  }
  return staticFile(value);
};

export const brandPalette = (seriesConfig?: SeriesConfig | null) => {
  const configured = (seriesConfig?.brand?.primary_palette ?? [])
    .map((item) => normalizeText(String(item)))
    .filter(Boolean);
  return {
    primary: seriesConfig?.brand?.primary_color ?? configured[0] ?? "#79e8ff",
    secondary: seriesConfig?.brand?.secondary_color ?? configured[1] ?? configured[0] ?? "#66f2b6",
    tertiary: configured[2] ?? configured[1] ?? "#dfe8f4",
  };
};

export const fontWithFallback = (configuredFont: string | undefined | null, fallbackStack: string) => {
  const value = normalizeText(configuredFont ?? "");
  if (!value) {
    return fallbackStack;
  }
  if (value.includes(",") || /(?:sans-serif|serif|monospace)/i.test(value)) {
    return value;
  }
  return `${value}, ${fallbackStack}`;
};

export const brandDisplayStyle = (seriesConfig?: SeriesConfig | null): CSSProperties => ({
  fontFamily: fontWithFallback(seriesConfig?.brand?.font_display, FONT_STACKS.display),
});

export const brandBodyStyle = (seriesConfig?: SeriesConfig | null): CSSProperties => ({
  fontFamily: fontWithFallback(seriesConfig?.brand?.font_body, FONT_STACKS.body),
});

export const resolveConfiguredBackground = (background?: string) => {
  const value = normalizeText(background ?? "");
  if (!value) {
    return {src: null as string | null, background: null as string | null};
  }
  if (
    /^[a-z]+:\/\//i.test(value)
    || /^[A-Za-z]:[\\/]/.test(value)
    || value.startsWith("/")
    || /\.(png|jpe?g|svg|webp)$/i.test(value)
  ) {
    return {src: resolveStatic(value), background: null as string | null};
  }
  return {src: null as string | null, background: value};
};

export const sanitizeDisplayMode = (placement: AssetPlacement) => {
  const displayMode = placement.display_mode || "center-framed";
  if (displayMode === "fullscreen-bg") {
    if (placement.aspect_hint === "portrait") {
      return "pip-right";
    }
    if (placement.aspect_hint === "wide-banner") {
      return "center-framed";
    }
    if (placement.aspect_hint === "square" && !placement.immersive_ok) {
      return "center-framed";
    }
  }
  return displayMode;
};

export const getProofSize = (asset: AssetPlacement, isVertical: boolean) => {
  const aspect = asset.aspect_hint || "landscape";
  if (isVertical) {
    if (aspect === "portrait") {
      return {width: 420, height: 860};
    }
    if (aspect === "wide-banner") {
      return {width: 920, height: 420};
    }
    if (aspect === "square") {
      return {width: 760, height: 760};
    }
    return {width: 940, height: 620};
  }
  if (aspect === "portrait") {
    return {width: 420, height: 760};
  }
  if (aspect === "wide-banner") {
    return {width: 1180, height: 420};
  }
  if (aspect === "square") {
    return {width: 620, height: 620};
  }
  return {width: 1080, height: 620};
};

export const isFastCameraPlan = (cameraPlan: string) => {
  const plan = normalizeText(cameraPlan).toLowerCase();
  return plan.includes("push") || plan.includes("zoom") || plan.includes("track") || plan.includes("impact") || plan.includes("punch") || plan.includes("whip");
};
