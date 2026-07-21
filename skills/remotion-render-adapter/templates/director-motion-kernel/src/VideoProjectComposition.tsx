import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  deriveSceneDesign,
  findPrimaryImageLayer,
  getBackdropMetrics,
  getStageMetrics,
} from "./sceneDesign";
import {renderBespokeVisualAsset} from "./bespokeVisuals";
import type {RenderPlan, RenderPlanLayer, RenderPlanScene} from "./renderPlanData";

const displayFont = "\"Microsoft YaHei UI\", \"Microsoft YaHei\", \"PingFang SC\", \"Hiragino Sans GB\", \"Source Han Sans SC\", \"Noto Sans SC\", \"Space Grotesk\", \"Segoe UI\", sans-serif";
const monoFont = "\"JetBrains Mono\", \"Cascadia Code\", Consolas, monospace";

const sceneFrames = (durationS: number, fps: number) => Math.max(1, Math.round(durationS * fps));

const resolveAsset = (layer: RenderPlanLayer) => {
  const source = layer.asset?.source;
  if (!source) {
    return null;
  }
  if (/^https?:\/\//i.test(source)) {
    return source;
  }
  return staticFile(source.replace(/^\/+/, ""));
};

const primaryTextStyle = (scene: RenderPlanScene) => {
  const layer = scene.layers.find((item) => item.kind === "text");
  return (layer?.style ?? {}) as Record<string, unknown>;
};

const normalizeSpecValue = (value: unknown) => String(value ?? "").trim().toLowerCase();

const resolveInternalVariant = (scene: RenderPlanScene) => {
  const style = primaryTextStyle(scene);
  const explicitVariant = normalizeSpecValue(style.layout_hint);
  if (explicitVariant) {
    return explicitVariant;
  }

  const dominantMedium = normalizeSpecValue(style.dominant_medium);
  const compositionIntent = normalizeSpecValue(style.composition_intent);
  const informationDensity = normalizeSpecValue(style.information_density);
  const evidenceMode = normalizeSpecValue(style.evidence_mode);
  const sourceSkill = normalizeSpecValue(style.source_skill);

  if (scene.proof_required || scene.proof_annotations.length > 0) {
    return "proof-sheet";
  }

  if (
    dominantMedium === "chart" ||
    compositionIntent === "trend" ||
    (evidenceMode === "literal" && sourceSkill === "chart-visualization") ||
    sourceSkill === "chart-visualization"
  ) {
    return "chart-card";
  }

  if (
    dominantMedium === "infographic" ||
    compositionIntent === "process" ||
    compositionIntent === "hierarchy" ||
    (evidenceMode === "literal" && sourceSkill === "infographic-creator") ||
    sourceSkill === "infographic-creator"
  ) {
    return "infographic-card";
  }

  if (
    dominantMedium === "number" ||
    compositionIntent === "stat" ||
    normalizeSpecValue(style.stat_value)
  ) {
    return "stat-card";
  }

  if (dominantMedium === "comparison" || compositionIntent === "contrast" || normalizeSpecValue(style.contrast_left)) {
    return "contrast-card";
  }

  if (dominantMedium === "statement" && compositionIntent === "quote") {
    return "quote-card";
  }

  if (informationDensity === "dense") {
    return "paper-card";
  }

  return "manifesto-card";
};

const SceneBackdrop: React.FC<{
  stage: string;
  rule: string;
  ink: string;
  accent: string;
  counter: string;
  variant: string;
  vertical: boolean;
}> = ({stage, rule, ink, accent, counter, variant, vertical}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const backdrop = getBackdropMetrics(variant, vertical);
  const sweepBackground =
    variant === "paper-card"
      ? "linear-gradient(180deg, rgba(30,24,18,0.01), rgba(30,24,18,0.04), rgba(30,24,18,0.01))"
      : variant === "chart-card"
        ? `linear-gradient(180deg, transparent, ${accent}18, transparent)`
        : variant === "infographic-card"
          ? `linear-gradient(180deg, transparent, ${accent}12, transparent)`
          : `linear-gradient(180deg, transparent, ${accent}10, transparent)`;
  const sweep = interpolate(frame, [0, durationInFrames], [-width * 0.18, width * 0.72], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{background: stage, overflow: "hidden"}}>
      {backdrop.showGrid ? (
        <AbsoluteFill
          style={{
            opacity: 0.05,
            backgroundImage: [
              `linear-gradient(${rule} 1px, transparent 1px)`,
              `linear-gradient(90deg, ${rule} 1px, transparent 1px)`,
            ].join(","),
            backgroundSize: "120px 120px",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          top: vertical ? -240 : -120,
          left: sweep,
          width: vertical ? width * 0.18 : width * 0.28,
          height: height + 260,
          background: sweepBackground,
          transform: "rotate(8deg)",
        }}
      />
      {variant === "chart-card" || variant === "infographic-card" ? (
        <div
          style={{
            position: "absolute",
            top: vertical ? 120 : 84,
            right: vertical ? 48 : 72,
            width: vertical ? 180 : 240,
            height: vertical ? 180 : 240,
            borderRadius: 999,
            background: `radial-gradient(circle, ${accent}22 0%, ${accent}08 46%, transparent 72%)`,
            filter: "blur(2px)",
          }}
        />
      ) : null}
      {backdrop.showFrameLines ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 42,
              left: 48,
              right: 48,
              borderTop: `1px solid ${rule}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 42,
              bottom: 42,
              left: 48,
              borderLeft: `1px solid ${rule}`,
            }}
          />
        </>
      ) : null}
      {backdrop.showCounter ? (
        <div
          style={{
            position: "absolute",
            right: 36,
            bottom: -32,
            fontFamily: displayFont,
            fontSize: Math.min(width * 0.28, 240),
            lineHeight: 0.86,
            letterSpacing: -6,
            color: ink,
            opacity: variant === "paper-card" ? 0.03 : 0.035,
          }}
        >
          {counter}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const VerticalManifesto: React.FC<{
  lines: string[];
  ink: string;
  accent: string;
  mute: string;
  cjkHeavy: boolean;
  intent: string;
}> = ({lines, ink, accent, mute, cjkHeavy, intent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "200px 64px 340px",
        boxSizing: "border-box",
      }}
    >
      <div style={{display: "flex", flexDirection: "column", gap: 12}}>
        {lines.map((line, index) => {
          const lineProgress = spring({
            fps,
            frame: Math.max(0, frame - index * 5),
            config: {damping: 16, stiffness: 90},
          });
          return (
            <div
              key={`${line}-${index}`}
              style={{
                fontFamily: displayFont,
                fontSize: cjkHeavy ? 64 : 72,
                lineHeight: cjkHeavy ? 1.15 : 1.0,
                letterSpacing: cjkHeavy ? -1 : -2.4,
                fontWeight: 700,
                color: ink,
                transform: `translateY(${(1 - lineProgress) * 12}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
      <div style={{width: 80, borderTop: `3px solid ${accent}`, marginTop: 28, opacity: 0.85}} />
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 16,
          lineHeight: 1.7,
          color: mute,
          marginTop: 18,
          maxWidth: 540,
        }}
      >
        {intent}
      </div>
    </div>
  );
};

const VerticalPaper: React.FC<{
  lines: string[];
  ink: string;
  accent: string;
  mute: string;
  cjkHeavy: boolean;
  intent: string;
}> = ({lines, ink, accent, mute, cjkHeavy, intent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "220px 72px 340px",
        boxSizing: "border-box",
      }}
    >
      <div style={{display: "flex", flexDirection: "column", gap: 8}}>
        {lines.map((line, index) => {
          const lineProgress = spring({
            fps,
            frame: Math.max(0, frame - index * 5),
            config: {damping: 18, stiffness: 88},
          });
          return (
            <div
              key={`${line}-${index}`}
              style={{
                fontFamily: displayFont,
                fontSize: cjkHeavy ? 56 : 64,
                lineHeight: cjkHeavy ? 1.2 : 1.05,
                letterSpacing: cjkHeavy ? -0.5 : -2,
                fontWeight: 500,
                color: ink,
                transform: `translateY(${(1 - lineProgress) * 10}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
      <div style={{width: 60, borderTop: `2px solid ${accent}`, marginTop: 32, opacity: 0.6}} />
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 15,
          lineHeight: 1.7,
          color: mute,
          marginTop: 16,
          maxWidth: 480,
          opacity: 0.8,
        }}
      >
        {intent}
      </div>
    </div>
  );
};

const VerticalContrast: React.FC<{
  contrastLeft: string;
  contrastRight: string;
  subline: string;
  ink: string;
  accent: string;
  mute: string;
}> = ({contrastLeft, contrastRight, subline, ink, accent, mute}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({fps, frame, config: {damping: 16, stiffness: 88}});
  const revealB = spring({fps, frame: Math.max(0, frame - 12), config: {damping: 16, stiffness: 88}});

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "200px 56px 340px",
        boxSizing: "border-box",
        gap: 32,
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 80,
          lineHeight: 0.95,
          letterSpacing: -2,
          fontWeight: 700,
          color: ink,
          textAlign: "center",
          transform: `translateY(${(1 - reveal) * 14}px)`,
        }}
      >
        {contrastLeft}
      </div>
            <div style={{display: "flex", alignItems: "center", gap: 18, marginTop: -4, marginBottom: -4}}>
        <div style={{width: 72, borderTop: `2px solid ${accent}`}} />
        <div
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: `1.5px solid ${accent}44`,
            fontFamily: displayFont,
            fontSize: 28,
            lineHeight: 1,
            letterSpacing: -0.5,
            fontWeight: 700,
            color: accent,
            whiteSpace: "nowrap",
          }}
        >
          {subline || "not equal"}
        </div>
        <div style={{width: 72, borderTop: `2px solid ${accent}`}} />
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 80,
          lineHeight: 0.95,
          letterSpacing: -2,
          fontWeight: 700,
          color: ink,
          textAlign: "center",
          transform: `translateY(${(1 - revealB) * 14}px)`,
        }}
      >
        {contrastRight}
      </div>
    </div>
  );
};

const VerticalQuote: React.FC<{
  lines: string[];
  ink: string;
  accent: string;
  mute: string;
  subline: string;
}> = ({lines, ink, accent, mute, subline}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({fps, frame, config: {damping: 18, stiffness: 90}});

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "180px 64px 340px",
        boxSizing: "border-box",
      }}
    >
      <div style={{width: 68, borderTop: `2px solid ${accent}`, marginBottom: 24, opacity: 0.9}} />
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 140,
          lineHeight: 0.72,
          letterSpacing: -6,
          color: accent,
          opacity: 0.2,
          transform: `translateY(${(1 - reveal) * 8}px)`,
        }}
      >
        "
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: -32}}>
        {lines.map((line, index) => (
          <div
            key={`${line}-${index}`}
            style={{
              fontFamily: displayFont,
              fontSize: 62,
              lineHeight: 1.12,
              letterSpacing: -1.4,
              fontWeight: 600,
              color: ink,
              transform: `translateY(${(1 - reveal) * 10}px)`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <div style={{width: 96, borderTop: `2px solid ${accent}`, marginTop: 28}} />
      {subline ? (
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 15,
            lineHeight: 1.7,
            color: mute,
            marginTop: 18,
            maxWidth: 520,
          }}
        >
          {subline}
        </div>
      ) : null}
    </div>
  );
};

const VerticalStat: React.FC<{
  lines: string[];
  scene: RenderPlanScene;
  ink: string;
  accent: string;
  mute: string;
  subline: string;
}> = ({lines, scene, ink, accent, mute, subline}) => {
  const style = primaryTextStyle(scene);
  const statValue = String(style.stat_value ?? lines[0] ?? scene.headline);
  const statLabel = String(style.stat_label ?? lines.slice(1).join(" ") ?? scene.intent);
  const statDetail = String(style.stat_detail ?? subline ?? scene.intent);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({fps, frame, config: {damping: 16, stiffness: 92}});

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "190px 64px 340px",
        boxSizing: "border-box",
      }}
    >
      <div style={{width: 68, borderTop: `2px solid ${accent}`, marginBottom: 20, opacity: 0.9}} />
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 104,
          lineHeight: 0.92,
          letterSpacing: -4,
          fontWeight: 700,
          color: ink,
          transform: `translateY(${(1 - reveal) * 12}px)`,
        }}
      >
        {statValue}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: "10px 14px",
          borderRadius: 999,
          background: `${accent}18`,
          color: accent,
          fontFamily: displayFont,
          fontSize: 24,
          lineHeight: 1.2,
          fontWeight: 600,
        }}
      >
        {statLabel || scene.intent}
      </div>
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 15,
          lineHeight: 1.7,
          color: mute,
          marginTop: 18,
          maxWidth: 520,
        }}
      >
        {statDetail}
      </div>
    </div>
  );
};

const VerticalVisualAsset: React.FC<{
  scene: RenderPlanScene;
  lines: string[];
  ink: string;
  accent: string;
  mute: string;
  surface: string;
  surfaceAlt: string;
  variant: "chart-card" | "infographic-card";
  subline: string;
}> = ({scene, lines, ink, accent, mute, surface, surfaceAlt, variant, subline}) => {
  const assetLayer = findPrimaryImageLayer(scene);
  const src = assetLayer ? resolveAsset(assetLayer) : null;
  const proofMode = assetLayer?.asset?.proof_mode ?? "decorative";
  const assetHeight = variant === "chart-card" ? 820 : 800;
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const reveal = spring({fps, frame, config: {damping: 18, stiffness: 90}});
  const cardReveal = spring({fps, frame: Math.max(0, frame - 3), config: {damping: 16, stiffness: 82}});
  const cardLift = interpolate(cardReveal, [0, 1], [22, 0]);
  const cardScale = interpolate(cardReveal, [0, 1], [0.975, 1]);
  const shineX = interpolate(frame, [0, durationInFrames], [-220, 820], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bespokeVisual = renderBespokeVisualAsset({
    source: assetLayer?.asset?.source ?? "",
    frame,
    fps,
    accent,
    ink,
    mute,
    surface,
    surfaceAlt,
  });
  const cardDrift = bespokeVisual ? 0 : Math.sin(frame / Math.max(fps, 1) / 1.4) * 0.5;
  const chartGlow = 0.08 + ((Math.sin(frame / Math.max(fps, 1) / 2.4) + 1) / 2) * 0.06;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "156px 48px 300px",
        boxSizing: "border-box",
        gap: 20,
      }}
    >
      <div style={{width: 76, borderTop: `2px solid ${accent}`, opacity: 0.9}} />
      <div style={{display: "flex", flexDirection: "column", gap: 8}}>
        {lines.map((line, index) => (
          <div
            key={`${line}-${index}`}
            style={{
              fontFamily: displayFont,
              fontSize: lines.length >= 3 ? 50 : 54,
              lineHeight: 1.08,
              letterSpacing: -1.6,
              fontWeight: 650,
              color: ink,
              transform: `translateY(${(1 - reveal) * 10}px)`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
      {subline ? (
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 23,
            lineHeight: 1.35,
            letterSpacing: -0.3,
            color: mute,
            maxWidth: 640,
            opacity: 0.84,
          }}
        >
          {subline}
        </div>
      ) : null}
      <div
        style={{
          borderRadius: 28,
          padding: bespokeVisual ? 0 : 18,
          background: bespokeVisual
            ? `linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,239,230,0.98))`
            : `linear-gradient(180deg, ${surface}, ${surfaceAlt})`,
          border: `1px solid ${ink}10`,
          boxShadow: bespokeVisual
            ? `0 32px 96px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.62), inset 0 1px 0 rgba(255,255,255,0.86), 0 0 0 12px rgba(178,69,52,${chartGlow * 0.1})`
            : "0 28px 90px rgba(0,0,0,0.22)",
          overflow: "hidden",
          position: "relative",
          transform: `translateY(${cardLift + cardDrift}px) scale(${cardScale})`,
        }}
      >
        {bespokeVisual ? (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: [
                  "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0))",
                  "linear-gradient(90deg, rgba(60,44,32,0.04) 1px, transparent 1px)",
                  "linear-gradient(rgba(60,44,32,0.04) 1px, transparent 1px)",
                ].join(","),
                backgroundSize: "100% 100%, 140px 140px, 140px 140px",
                opacity: 0.38,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 86% 14%, rgba(178,69,52,${chartGlow}), transparent 24%)`,
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />
          </>
        ) : null}
        {bespokeVisual ? (
          <div style={{height: assetHeight, position: "relative", zIndex: 1}}>{bespokeVisual}</div>
        ) : src ? (
          <Img
            src={src}
            style={{
              width: "100%",
              height: assetHeight,
              objectFit: "contain",
              borderRadius: 18,
              background: variant === "chart-card" ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.98)",
              transform: `scale(${1.02 - reveal * 0.02}) translateY(${(1 - reveal) * 8}px)`,
            }}
          />
        ) : (
          <div
            style={{
              height: assetHeight,
              borderRadius: 18,
              border: `1px dashed ${ink}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: monoFont,
              fontSize: 16,
              color: mute,
            }}
          >
            visual asset missing
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: -40,
            left: shineX,
            width: 180,
            height: assetHeight + 120,
            background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.16), rgba(255,255,255,0))",
            transform: "rotate(10deg)",
            pointerEvents: "none",
            opacity: bespokeVisual ? 0.28 : 0.24,
            mixBlendMode: "screen",
          }}
        />
      </div>
      {proofMode === "literal" ? (
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 13,
            lineHeight: 1.6,
            color: mute,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          literal source
        </div>
      ) : null}
    </div>
  );
};

const CenteredVerticalScene: React.FC<{
  scene: RenderPlanScene;
  lines: string[];
  ink: string;
  accent: string;
  mute: string;
  cjkHeavy: boolean;
  surface: string;
  surfaceAlt: string;
}> = ({scene, lines, ink, accent, mute, cjkHeavy, surface, surfaceAlt}) => {
  const style = primaryTextStyle(scene);
  const layoutHint = resolveInternalVariant(scene);
  const subline = String(style.subline ?? "");
  const contrastLeft = String(style.contrast_left ?? "");
  const contrastRight = String(style.contrast_right ?? "");
  const assetLayer = findPrimaryImageLayer(scene);

  if (layoutHint === "contrast-card") {
    return (
      <VerticalContrast
        contrastLeft={contrastLeft}
        contrastRight={contrastRight}
        subline={subline}
        ink={ink}
        accent={accent}
        mute={mute}
      />
    );
  }

  if (layoutHint === "quote-card") {
    return <VerticalQuote lines={lines} ink={ink} accent={accent} mute={mute} subline={subline} />;
  }

  if (layoutHint === "stat-card") {
    return <VerticalStat lines={lines} scene={scene} ink={ink} accent={accent} mute={mute} subline={subline} />;
  }

  if ((layoutHint === "chart-card" || layoutHint === "infographic-card") && assetLayer) {
    return (
      <VerticalVisualAsset
        scene={scene}
        lines={lines}
        ink={ink}
        accent={accent}
        mute={mute}
        surface={surface}
        surfaceAlt={surfaceAlt}
        variant={layoutHint as "chart-card" | "infographic-card"}
        subline={subline}
      />
    );
  }

  if (layoutHint === "paper-card") {
    return (
      <VerticalPaper
        lines={lines}
        ink={ink}
        accent={accent}
        mute={mute}
        cjkHeavy={cjkHeavy}
        intent={scene.intent}
      />
    );
  }

  return (
    <VerticalManifesto
      lines={lines}
      ink={ink}
      accent={accent}
      mute={mute}
      cjkHeavy={cjkHeavy}
      intent={scene.intent}
    />
  );
};

const ProofScene: React.FC<{
  scene: RenderPlanScene;
  ink: string;
  accent: string;
  mute: string;
  surface: string;
  surfaceAlt: string;
}> = ({scene, ink, accent, mute, surface, surfaceAlt}) => {
  const {height, width} = useVideoConfig();
  const metrics = getStageMetrics("proof-sheet", height > width);
  const assetLayer = findPrimaryImageLayer(scene);
  const src = assetLayer ? resolveAsset(assetLayer) : null;
  const annotation = scene.proof_annotations[0];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: `${metrics.paddingTop}px ${metrics.paddingX}px ${metrics.paddingBottom}px`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: metrics.maxWidth,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: height > width ? "1fr" : "420px 1fr",
          gap: 24,
          height: "100%",
        }}
      >
        <div style={{display: "flex", flexDirection: "column", gap: 18}}>
          <div style={{fontFamily: displayFont, fontSize: 44, lineHeight: 0.98, letterSpacing: -1.8, color: ink}}>
            {scene.intent}
          </div>
          <div style={{width: 104, borderTop: `3px solid ${accent}`}} />
          <div style={{fontFamily: monoFont, fontSize: 15, lineHeight: 1.7, color: mute}}>
            {scene.narration}
          </div>
        </div>
        <div
          style={{
            border: `1px solid ${ink}18`,
            background: surface,
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{padding: "16px 18px", borderBottom: `1px solid ${ink}14`, fontFamily: monoFont, fontSize: 13, color: mute}}>
            {annotation?.label ?? "proof"}
          </div>
          <div style={{flex: 1, background: surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", padding: 16}}>
            {src ? <Img src={src} style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const CenteredDesktopScene: React.FC<{
  scene: RenderPlanScene;
  lines: string[];
  ink: string;
  accent: string;
  mute: string;
  cjkHeavy: boolean;
}> = ({scene, lines, ink, accent, mute, cjkHeavy}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "82px 92px 154px",
        boxSizing: "border-box",
      }}
    >
      <div style={{width: "100%", maxWidth: 1120, display: "flex", flexDirection: "column", gap: 20}}>
        {lines.map((line, index) => (
          <div key={`${line}-${index}`} style={{fontFamily: displayFont, fontSize: cjkHeavy ? 58 : 72, lineHeight: cjkHeavy ? 1.02 : 0.92, letterSpacing: -2.2, color: ink}}>
            {line}
          </div>
        ))}
        <div style={{width: 132, borderTop: `3px solid ${accent}`}} />
        <div style={{fontFamily: monoFont, fontSize: 18, lineHeight: 1.64, color: mute, maxWidth: 620}}>
          {scene.intent}
        </div>
      </div>
    </div>
  );
};

const SceneCard: React.FC<{scene: RenderPlanScene; index: number; totalScenes: number}> = ({scene, index, totalScenes}) => {
  const design = deriveSceneDesign(scene, index, totalScenes);
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  const layoutHint = resolveInternalVariant(scene);

  return (
    <AbsoluteFill>
      <SceneBackdrop
        stage={design.palette.stage}
        rule={design.palette.rule}
        ink={design.palette.ink}
        accent={design.palette.accent}
        counter={design.counter}
        variant={layoutHint}
        vertical={vertical}
      />
      {design.layout === "proof-sheet" ? (
        <ProofScene
          scene={scene}
          ink={design.palette.ink}
          accent={design.palette.accent}
          mute={design.palette.mute}
          surface={design.palette.surface}
          surfaceAlt={design.palette.surfaceAlt}
        />
      ) : vertical ? (
        <CenteredVerticalScene
          scene={scene}
          lines={design.headlineLines}
          ink={design.palette.ink}
          accent={design.palette.accent}
          mute={design.palette.mute}
          cjkHeavy={design.cjkHeavy}
          surface={design.palette.surface}
          surfaceAlt={design.palette.surfaceAlt}
        />
      ) : (
        <CenteredDesktopScene
          scene={scene}
          lines={design.headlineLines}
          ink={design.palette.ink}
          accent={design.palette.accent}
          mute={design.palette.mute}
          cjkHeavy={design.cjkHeavy}
        />
      )}
    </AbsoluteFill>
  );
};

export const VideoProjectComposition: React.FC<RenderPlan> = (plan) => {
  const {fps} = useVideoConfig();
  let cursor = 0;

  return (
    <AbsoluteFill>
      {plan.scenes.map((scene, index) => {
        const from = cursor;
        const durationInFrames = sceneFrames(scene.duration_s, fps);
        cursor += durationInFrames;
        return (
          <Sequence key={scene.scene_id} from={from} durationInFrames={durationInFrames}>
            <SceneCard scene={scene} index={index} totalScenes={plan.scenes.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
