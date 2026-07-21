import React from "react";
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {type SeriesConfig} from "../directorData";
import {
  accentLine,
  baseText,
  brandBodyStyle,
  brandDisplayStyle,
  brandPalette,
  displayText,
  editorialCard,
  editorialEyebrow,
  isUncodixifiedLanguage,
  normalizeText,
  resolveStatic,
} from "../shared";

type ClosingSceneProps = {
  seriesConfig: SeriesConfig;
  accent?: string;
  designLanguage?: string;
};

const fallbackTexts = (seriesConfig: SeriesConfig) => {
  const configured = (seriesConfig.closing?.elements ?? [])
    .filter((item) => item.type === "text" && item.content)
    .map((item) => item.content ?? "");
  if (configured.length) {
    return configured.slice(0, 2);
  }
  return [
    seriesConfig.closing?.follow_text ?? "Follow for the next episode",
    seriesConfig.closing?.next_episode_hint ?? "Next episode is already in the works",
  ].filter(Boolean);
};

export const ClosingScene: React.FC<ClosingSceneProps> = ({seriesConfig, accent, designLanguage}) => {
  const frame = useCurrentFrame();
  const {fps, height, width} = useVideoConfig();
  const isVertical = height > width;
  const resolvedDesignLanguage = designLanguage ?? "premium-tech-editorial";
  const uncodixified = isUncodixifiedLanguage(resolvedDesignLanguage);
  const palette = brandPalette(seriesConfig);
  const bodyStyle = brandBodyStyle(seriesConfig);
  const displayStyle = brandDisplayStyle(seriesConfig);
  const primary = accent ?? palette.primary;
  const secondary = palette.secondary;
  const tertiary = palette.tertiary;
  const closingTemplate = normalizeText(seriesConfig.closing?.template ?? "steven-avatar-cta").toLowerCase();
  const minimalTemplate = closingTemplate.includes("minimal");
  const qrFocusTemplate = closingTemplate.includes("qr");
  const textFirstTemplate = closingTemplate.includes("text-first") || closingTemplate.includes("left");
  const avatarSrc = resolveStatic(seriesConfig.brand?.avatar_file ?? "");
  const logoSrc = resolveStatic(seriesConfig.brand?.logo_file ?? "");
  const qrSrc = resolveStatic(
    (seriesConfig.closing?.elements ?? []).find((item) => item.type === "qrcode" && item.file)?.file ?? "",
  );
  const followText = seriesConfig.closing?.follow_text ?? "Follow for the next episode";
  const nextEpisodeHint = seriesConfig.closing?.next_episode_hint ?? "More practical workflow upgrades coming next";
  const textBlocks = fallbackTexts(seriesConfig);
  const intro = spring({fps, frame, config: {damping: 16, stiffness: 110, mass: 0.9}});
  const ctaEnter = spring({fps, frame: frame - 10, config: {damping: 18, stiffness: 100, mass: 0.9}});
  const footerEnter = spring({fps, frame: frame - 18, config: {damping: 18, stiffness: 90, mass: 0.95}});
  const pulse = 1 + Math.sin(frame * 0.06) * 0.018;
  const rightColumnRows = qrSrc ? (qrFocusTemplate ? "1.15fr auto" : "1fr auto") : "1fr";
  const desktopColumns = qrFocusTemplate ? "0.95fr 1.05fr" : textFirstTemplate ? "1.3fr 0.7fr" : "1.2fr 0.8fr";
  const heroFontSize = minimalTemplate ? (isVertical ? 62 : 72) : isVertical ? 74 : 84;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: uncodixified
          ? `linear-gradient(160deg, #07111a 0%, #0d1720 48%, #121b24 100%)`
          : `radial-gradient(circle at 18% 18%, ${primary}32 0%, transparent 28%), radial-gradient(circle at 84% 16%, ${secondary}2c 0%, transparent 30%), linear-gradient(160deg, #04060d 0%, #09111d 48%, #111623 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-8%",
          opacity: minimalTemplate ? 0.14 : uncodixified ? 0.12 : 0.2,
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, rgba(255,255,255,0) 2px 18px), radial-gradient(circle at 40% 40%, rgba(255,255,255,0.08), rgba(0,0,0,0) 44%)",
          mixBlendMode: uncodixified ? "normal" : "screen",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: isVertical ? 520 : 720,
          height: isVertical ? 520 : 720,
          borderRadius: "50%",
          transform: `translate(-50%, -54%) scale(${pulse})`,
          background: `radial-gradient(circle, ${primary}24 0%, ${secondary}12 30%, transparent 72%)`,
          filter: uncodixified ? "blur(10px)" : "blur(18px)",
          opacity: uncodixified ? 0.62 : 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: isVertical ? "88px 48px 108px" : "72px 88px 86px",
          display: "grid",
          gridTemplateColumns: isVertical ? "1fr" : desktopColumns,
          gap: isVertical ? 28 : 34,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            ...editorialCard(minimalTemplate ? "matte-paper" : "glass-ink", primary, {
              padding: isVertical ? 28 : minimalTemplate ? 30 : 34,
              radius: 34,
            }, resolvedDesignLanguage),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: intro,
            transform: `translateY(${interpolate(intro, [0, 1], [36, 0])}px)`,
          }}
        >
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16}}>
            <div style={editorialEyebrow(primary, resolvedDesignLanguage)}>{seriesConfig.series_name}</div>
            <div style={{...baseText, ...bodyStyle, fontSize: 18, color: "#dfe8fb", letterSpacing: 0.6}}>
              EP{String(seriesConfig.episode_number ?? 1).padStart(2, "0")}
            </div>
          </div>

          <div style={{marginTop: 28}}>
            <div
              style={{
                ...displayText,
                ...baseText,
                ...displayStyle,
                ...bodyStyle,
                fontSize: heroFontSize,
                fontWeight: 700,
                lineHeight: 0.96,
              }}
            >
              {followText}
            </div>
            {!minimalTemplate ? (
              <div style={{marginTop: 18}}>
                <div style={accentLine(primary, isVertical ? 260 : 300, resolvedDesignLanguage)} />
              </div>
            ) : null}
            <div style={{marginTop: 20, ...baseText, ...bodyStyle, fontSize: isVertical ? 28 : 30, lineHeight: 1.35, color: "#ccd7ed"}}>
              {nextEpisodeHint}
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: textBlocks.length > 1 && !isVertical ? "1fr 1fr" : "1fr",
              gap: 14,
            }}
          >
            {textBlocks.map((item, index) => (
              <div
                key={`${item}-${index}`}
                style={{
                  ...editorialCard(index === 0 ? "screen-emissive" : "glass-ink", index === 0 ? primary : secondary, {
                    padding: 18,
                    radius: 24,
                  }, resolvedDesignLanguage),
                  ...baseText,
                  ...bodyStyle,
                  minHeight: isVertical ? 86 : 110,
                  fontSize: isVertical ? 22 : 24,
                  lineHeight: 1.32,
                  display: "flex",
                  alignItems: "flex-end",
                  color: index === 0 ? "#f4f7ff" : "#d7ffef",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: rightColumnRows,
            gap: 22,
            opacity: footerEnter,
            transform: `translateY(${interpolate(footerEnter, [0, 1], [42, 0])}px)`,
          }}
        >
          <div
            style={{
              ...editorialCard(qrFocusTemplate ? "tactile-metal" : "screen-emissive", secondary, {
                padding: isVertical ? 24 : 30,
                radius: 34,
              }, resolvedDesignLanguage),
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16}}>
              <div style={editorialEyebrow(secondary, resolvedDesignLanguage)}>
                {qrFocusTemplate ? "Next touchpoint" : "Series cadence"}
              </div>
              <div style={{...baseText, ...bodyStyle, fontSize: 15, color: "#b9c8e6"}}>
                {seriesConfig.cover?.series_label ?? seriesConfig.series_id}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: uncodixified ? 22 : 28,
                border: "1px solid rgba(255,255,255,0.08)",
                background: uncodixified
                  ? "rgba(255,255,255,0.04)"
                  : "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                minHeight: isVertical ? 220 : 280,
                overflow: "hidden",
              }}
            >
              {qrFocusTemplate && qrSrc ? (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
                  <Img
                    src={qrSrc}
                    style={{
                      width: isVertical ? 184 : 170,
                      height: isVertical ? 184 : 170,
                      borderRadius: uncodixified ? 20 : 28,
                      boxShadow: uncodixified ? `0 10px 28px ${secondary}14` : `0 0 28px ${secondary}1f`,
                    }}
                  />
                  <div style={{...baseText, ...bodyStyle, fontSize: 20, color: "#e8f1ff"}}>
                    Scan for notes and updates
                  </div>
                </div>
              ) : logoSrc ? (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
                  {avatarSrc ? (
                    <div
                      style={{
                        width: isVertical ? 150 : 170,
                        height: isVertical ? 150 : 170,
                        borderRadius: "50%",
                        padding: 8,
                        background: uncodixified
                          ? "rgba(255,255,255,0.05)"
                          : "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: uncodixified ? `0 10px 32px rgba(0,0,0,0.22)` : `0 0 32px ${secondary}2a`,
                      }}
                    >
                      <Img src={avatarSrc} style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}} />
                    </div>
                  ) : null}
                  <Img src={logoSrc} style={{maxWidth: "62%", maxHeight: avatarSrc ? "24%" : "56%", objectFit: "contain"}} />
                </div>
              ) : (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
                  <div
                    style={{
                      width: isVertical ? 120 : 138,
                      height: isVertical ? 120 : 138,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${secondary}30 0%, transparent 72%)`,
                      boxShadow: uncodixified ? `0 10px 30px rgba(0,0,0,0.24)` : `0 0 40px ${secondary}2e`,
                    }}
                  />
                  <div
                    style={{
                      ...displayText,
                      ...baseText,
                      ...bodyStyle,
                      fontSize: isVertical ? 32 : 36,
                      fontWeight: 700,
                    }}
                  >
                    {seriesConfig.brand?.wordmark ?? seriesConfig.series_name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {qrSrc && !qrFocusTemplate ? (
            <div
              style={{
                ...editorialCard("glass-ink", primary, {padding: 18, radius: 28}, resolvedDesignLanguage),
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: ctaEnter,
                transform: `scale(${interpolate(ctaEnter, [0, 1], [0.92, 1])})`,
              }}
            >
              <Img src={qrSrc} style={{width: isVertical ? 110 : 100, height: isVertical ? 110 : 100, borderRadius: 20}} />
              <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                <div style={editorialEyebrow(primary, resolvedDesignLanguage)}>Stay with the series</div>
                <div style={{...baseText, ...bodyStyle, fontSize: isVertical ? 24 : 22, lineHeight: 1.28, color: "#dce5f7"}}>
                  Scan for updates and full episode notes
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
