import React from "react";
import {AbsoluteFill, Img, useVideoConfig} from "remotion";
import {type AssetPlacement, type DirectorScene, type DirectorVideoProps} from "../directorData";
import {
  accentLine,
  baseText,
  brandBodyStyle,
  brandDisplayStyle,
  brandPalette,
  displayText,
  editorialCard,
  editorialEyebrow,
  getBeatColors,
  isUncodixifiedLanguage,
  normalizeText,
  resolveConfiguredBackground,
  resolveStatic,
} from "../shared";

const truncateHeadline = (headline: string, maxChars: number) => {
  const cleaned = normalizeText(headline);
  if (!cleaned) {
    return "";
  }
  if (cleaned.length <= maxChars) {
    return cleaned;
  }
  return `${cleaned.slice(0, Math.max(1, maxChars - 3))}...`;
};

const pickCoverScene = (scenes: DirectorScene[]) =>
  scenes.find((scene) => scene.ai_image_brief?.enabled && scene.asset_placements.length)
  ?? scenes.find((scene) => scene.visual_strategy === "hook-opener" && scene.asset_placements.length)
  ?? scenes.find((scene) => scene.asset_placements.length)
  ?? scenes[0];

const pickPrimaryAsset = (scene?: DirectorScene): AssetPlacement | undefined =>
  scene?.asset_placements.find((asset) => asset.role === "primary")
  ?? scene?.asset_placements[0];

const pickBrandHeroSrc = (seriesConfig: DirectorVideoProps["series_config"]) =>
  resolveStatic(seriesConfig?.brand?.avatar_file ?? seriesConfig?.brand?.logo_file ?? "");

const defaultCoverAlign = (seriesConfig: DirectorVideoProps["series_config"]) => {
  const explicit = seriesConfig?.cover?.text_position;
  if (explicit) {
    return explicit;
  }
  const template = normalizeText(seriesConfig?.cover?.template ?? "").toLowerCase();
  if (template.includes("split") || template.includes("left")) {
    return "left";
  }
  if (template.includes("right")) {
    return "right";
  }
  return "center";
};

export const CoverFrame: React.FC<DirectorVideoProps> = ({meta, scenes, series_config}) => {
  const {height, width} = useVideoConfig();
  const isVertical = height > width;
  const designLanguage = meta.design_language ?? "premium-tech-editorial";
  const uncodixified = isUncodixifiedLanguage(designLanguage);
  const selectedScene = pickCoverScene(scenes);
  const primaryAsset = pickPrimaryAsset(selectedScene);
  const sceneBackgroundSrc = primaryAsset ? resolveStatic(primaryAsset.file) : null;
  const configuredBackground = resolveConfiguredBackground(series_config?.cover?.background);
  const backgroundSrc = configuredBackground.src ?? sceneBackgroundSrc;
  const brandHeroSrc = pickBrandHeroSrc(series_config);
  const palette = brandPalette(series_config);
  const accent = palette.primary ?? getBeatColors(selectedScene?.beat ?? "hook").accent;
  const secondary = palette.secondary ?? getBeatColors(selectedScene?.beat ?? "mechanism").accent;
  const tertiary = palette.tertiary;
  const bodyStyle = brandBodyStyle(series_config);
  const displayStyle = brandDisplayStyle(series_config);
  const coverTemplate = normalizeText(series_config?.cover?.template ?? "steven-avatar-cover").toLowerCase();
  const maxChars = Math.max(6, Number(series_config?.cover?.title_max_chars ?? 12));
  const title = truncateHeadline(selectedScene?.ppt_layer.headline ?? meta.topic, maxChars) || meta.topic;
  const bullets = (selectedScene?.ppt_layer.bullets ?? []).filter(Boolean).slice(0, 2);
  const align = defaultCoverAlign(series_config);
  const alignItems = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  const textAlign = align === "left" ? "left" : align === "right" ? "right" : "center";
  const overlayGradient = series_config?.cover?.overlay_gradient ?? true;
  const badgeSize = coverTemplate.includes("badge-large") ? 82 : 70;
  const badgeImageSize = coverTemplate.includes("badge-large") ? 64 : 54;
  const rootBackground = configuredBackground.background
    ?? (
      uncodixified
        ? "linear-gradient(160deg, #071019 0%, #0d1722 42%, #111a24 100%)"
        : `linear-gradient(160deg, ${tertiary}12 0%, #08111c 34%, #121725 100%)`
    );

  return (
    <AbsoluteFill style={{overflow: "hidden", background: rootBackground}}>
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
              objectPosition: coverTemplate.includes("split") ? "right center" : "center center",
              opacity: configuredBackground.src ? 0.64 : 0.48,
              filter: uncodixified ? "saturate(0.98) contrast(1.02)" : "saturate(1.02) contrast(1.04)",
            }}
          />
          {overlayGradient ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  align === "left"
                    ? "linear-gradient(90deg, rgba(4,7,15,0.92) 0%, rgba(4,7,15,0.48) 54%, rgba(4,7,15,0.18) 100%)"
                    : align === "right"
                      ? "linear-gradient(90deg, rgba(4,7,15,0.18) 0%, rgba(4,7,15,0.48) 46%, rgba(4,7,15,0.92) 100%)"
                      : "linear-gradient(180deg, rgba(4,7,15,0.18) 0%, rgba(4,7,15,0.36) 44%, rgba(4,7,15,0.92) 100%)",
              }}
            />
          ) : null}
        </>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: "-12%",
          background: `radial-gradient(circle at 18% 20%, ${accent}22 0%, transparent 28%), radial-gradient(circle at 84% 16%, ${secondary}1f 0%, transparent 28%), radial-gradient(circle at 52% 86%, ${tertiary}18 0%, transparent 22%)`,
          mixBlendMode: uncodixified ? "normal" : "screen",
          opacity: uncodixified ? 0.72 : 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: isVertical ? "64px 52px 88px" : "64px 80px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems,
        }}
      >
        <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", gap: 16}}>
          <div style={editorialEyebrow(accent, designLanguage)}>{series_config?.cover?.series_label ?? series_config?.series_name ?? "RemotionAI Video"}</div>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            {brandHeroSrc ? (
              <div
                style={{
                  ...editorialCard("glass-ink", secondary, {padding: 8, radius: 999}, designLanguage),
                  width: badgeSize,
                  height: badgeSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Img src={brandHeroSrc} style={{width: badgeImageSize, height: badgeImageSize, borderRadius: "50%", objectFit: "cover"}} />
              </div>
            ) : null}
            <div
              style={{
                ...editorialCard("glass-ink", secondary, {padding: 12, radius: 999}, designLanguage),
                ...baseText,
                ...bodyStyle,
                fontSize: 16,
                fontWeight: 700,
                color: "#eef6ff",
              }}
            >
              {(series_config?.brand?.wordmark ?? "STEVEN").toUpperCase()} | EP{String(series_config?.episode_number ?? 1).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div
          style={{
            width: align === "center" ? "100%" : isVertical ? "88%" : "64%",
            display: "flex",
            flexDirection: "column",
            alignItems,
            textAlign,
            gap: 20,
          }}
        >
          <div
            style={{
              ...displayText,
              ...baseText,
              ...displayStyle,
              fontSize: isVertical ? 116 : 98,
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: -2.4,
              maxWidth: isVertical ? "100%" : "94%",
              textShadow: uncodixified ? "0 10px 28px rgba(0,0,0,0.28)" : "0 14px 48px rgba(0,0,0,0.45)",
            }}
          >
            {title}
          </div>
          <div style={accentLine(accent, isVertical ? 280 : 320, designLanguage)} />
          {bullets.length ? (
            <div style={{display: "flex", flexWrap: "wrap", gap: 12, justifyContent: align === "center" ? "center" : "flex-start"}}>
              {bullets.map((bullet, index) => (
                <div
                  key={`${bullet}-${index}`}
                  style={{
                    ...editorialCard("glass-ink", index === 0 ? accent : secondary, {padding: 14, radius: 999}, designLanguage),
                    ...baseText,
                    ...bodyStyle,
                    fontSize: isVertical ? 24 : 22,
                    fontWeight: index === 0 ? 700 : 600,
                    color: index === 0 ? accent : "#e4edf9",
                  }}
                >
                  {bullet}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "space-between",
            alignItems: "flex-end",
            gap: 20,
          }}
        >
          <div style={{...baseText, ...bodyStyle, fontSize: 16, color: "#b6c6e4"}}>
            {selectedScene?.beat ? `${selectedScene.beat} scene` : "series cover"}
          </div>
          {align === "center" ? (
            <div style={{...baseText, ...bodyStyle, fontSize: 16, color: "#b6c6e4"}}>
              {meta.topic}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
