import React from "react";
import {AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {type Annotation, type CaptionCue, type DirectorScene, type DirectorVideoProps, type SubtitleTreatment} from "../directorData";
import {FPS, accentLine, baseText, displayText, editorialCard, editorialEyebrow, getBeatColors, materialSurface, normalizeText, resolveStatic} from "../shared";
import {AnimatedCounter} from "./AnimatedCounter";
import {AnimatedFlowChart} from "./AnimatedFlowChart";
import {ArchitectureDiagram} from "./ArchitectureDiagram";
import {AttentionHeatmap} from "./AttentionHeatmap";
import {BeatBackground} from "./BeatBackground";
import {ChartLineReveal} from "./ChartLineReveal";
import {ComparisonPanel} from "./ComparisonPanel";
import {DeviceFrame} from "./DeviceFrame";
import {EmbeddingScatter} from "./EmbeddingScatter";
import {FormulaReveal} from "./FormulaReveal";
import {HighlightedHeadline} from "./HighlightedHeadline";
import {HookOpener} from "./HookOpener";
import {IconOrbit} from "./IconOrbit";
import {LookdevBoardScene} from "./LookdevBoardScene";
import {LossCurveScrub} from "./LossCurveScrub";
import {NetworkGraphBuild} from "./NetworkGraphBuild";
import {PaperQuote} from "./PaperQuote";
import {PromptToOutput} from "./PromptToOutput";
import {RemotionDemo} from "./RemotionDemo";
import {TerminalBlock} from "./TerminalBlock";
import {TimelineStrip} from "./TimelineStrip";
import {useCameraMotion} from "../hooks/useCameraMotion";

const generatedPremiumStrategies = new Set(["icon-driven", "auto-code", "auto-metric", "kinetic-text"]);

const resolveCues = (scene: DirectorScene): CaptionCue[] => {
  const cues = (scene.caption_cues ?? [])
    .map((cue) => ({text: normalizeText(cue.text), start_s: Number(cue.start_s ?? 0), end_s: Number(cue.end_s ?? scene.duration_s)}))
    .filter((cue) => cue.text && cue.end_s > cue.start_s)
    .sort((left, right) => left.start_s - right.start_s);
  if (cues.length) {
    return cues;
  }
  const fallback = normalizeText(scene.narration);
  return fallback ? [{text: fallback, start_s: 0, end_s: Math.max(0.01, scene.duration_s)}] : [];
};

const SubtitleOverlay: React.FC<{
  cue: CaptionCue;
  isVertical: boolean;
  accent: string;
  designLanguage: string;
  mode?: "default" | "immersive";
  treatment?: SubtitleTreatment | null;
}> = ({cue, isVertical, accent, designLanguage, mode = "default", treatment}) => {
  const resolvedMode = treatment?.mode === "avoid-board" ? "immersive" : mode;
  const placement = treatment?.placement ?? "bottom-center";
  const marginPx = treatment?.margin_px ?? (resolvedMode === "immersive" ? (isVertical ? 52 : 42) : (isVertical ? 180 : 112));
  const maxWidthPct = treatment?.max_width_pct ?? (resolvedMode === "immersive" ? (isVertical ? 0.76 : 0.66) : (isVertical ? 0.86 : 0.72));
  const horizontalInset = isVertical ? 32 : 60;
  const justifyContent =
    placement.endsWith("left") ? "flex-start" : placement.endsWith("right") ? "flex-end" : "center";
  const placementStyle =
    placement === "top-center"
      ? {top: marginPx, left: horizontalInset, right: horizontalInset}
      : placement === "bottom-left"
        ? {bottom: marginPx, left: horizontalInset, right: horizontalInset}
        : placement === "bottom-right"
          ? {bottom: marginPx, left: horizontalInset, right: horizontalInset}
          : {bottom: marginPx, left: horizontalInset, right: horizontalInset};

  return (
  <div style={{position: "absolute", display: "flex", justifyContent, ...placementStyle}}>
    <div style={{...editorialCard("glass-ink", accent, {padding: resolvedMode === "immersive" ? (isVertical ? 12 : 10) : (isVertical ? 16 : 14), radius: resolvedMode === "immersive" ? 18 : 20}, designLanguage), maxWidth: `${Math.round(maxWidthPct * 100)}%`, background: resolvedMode === "immersive" ? "linear-gradient(180deg, rgba(8,12,22,0.74), rgba(7,10,18,0.58))" : undefined}}>
      <span style={{...baseText, ...displayText, fontSize: resolvedMode === "immersive" ? (isVertical ? 28 : 24) : (isVertical ? 38 : 34), fontWeight: 700, lineHeight: resolvedMode === "immersive" ? 1.22 : 1.32, letterSpacing: 0.3, textAlign: "center", display: "block"}}>
        {cue.text}
      </span>
    </div>
  </div>
  );
};

const AnnotationOverlay: React.FC<{annotations: Annotation[]; accent: string; frame: number; fps: number; proofLabel?: string; designLanguage: string}> = ({annotations, accent, frame, fps, proofLabel, designLanguage}) => {
  const time = frame / fps;
  return (
    <>
      {annotations.map((annotation, index) => {
        if (time < annotation.timing_s) {
          return null;
        }
        const appear = spring({fps, frame: frame - Math.round(annotation.timing_s * fps), config: {damping: 20, stiffness: 120}});
        return (
          <div
            key={`${annotation.type}-${index}`}
            style={{
              position: "absolute",
              left: `${annotation.region.x * 100}%`,
              top: `${annotation.region.y * 100}%`,
              width: `${annotation.region.w * 100}%`,
              height: `${annotation.region.h * 100}%`,
              border: `3px solid ${accent}`,
              borderRadius: 12,
              opacity: appear,
              boxShadow: `0 0 28px ${accent}70`,
              pointerEvents: "none",
            }}
          >
            <div style={{position: "absolute", top: -40, left: 0, ...editorialCard("glass-ink", accent, {padding: 10, radius: 12}, designLanguage), ...baseText, fontSize: 16, fontWeight: 700}}>
              {annotation.label ?? proofLabel ?? "Proof focus"}
            </div>
          </div>
        );
      })}
    </>
  );
};

const SceneEyebrow: React.FC<{scene: DirectorScene; accent: string; designLanguage: string}> = ({scene, accent, designLanguage}) => (
  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
    <div style={editorialEyebrow(accent, designLanguage)}>{scene.editorial_role}</div>
    <div style={{...baseText, fontSize: 13, color: "#9fb0d3"}}>{scene.styleframe_tokens?.typography_mode}</div>
  </div>
);

const ProofBadge: React.FC<{label: string; accent: string; designLanguage: string}> = ({label, accent, designLanguage}) => (
  <div style={{...editorialCard("glass-ink", accent, {padding: 10, radius: 999}, designLanguage), display: "inline-flex", alignItems: "center", gap: 10, color: accent, fontSize: 17, fontWeight: 700}}>
    <div style={{width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}`}} />
    {label}
  </div>
);

const SupportRail: React.FC<{items: string[]; accent: string; isVertical: boolean; designLanguage: string; align?: "center" | "left"}> = ({items, accent, isVertical, designLanguage, align = "center"}) => {
  const cleaned = items.filter(Boolean).slice(0, 2);
  if (!cleaned.length) {
    return null;
  }
  return (
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: 10, width: "100%"}}>
      {cleaned.map((item, index) => (
        <div
          key={`${item}-${index}`}
          style={{
            ...editorialCard("glass-ink", accent, {padding: isVertical ? 12 : 10, radius: 999}, designLanguage),
            color: index === 0 ? accent : "#dbe4f5",
            fontSize: isVertical ? 18 : 16,
            fontWeight: index === 0 ? 700 : 600,
            lineHeight: 1.2,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

const AnchorStage: React.FC<{accent: string; isVertical: boolean; role: DirectorScene["editorial_role"]; children: React.ReactNode}> = ({accent, isVertical, role, children}) => {
  const minHeight = role === "release" ? (isVertical ? 420 : 360) : (isVertical ? 430 : 380);
  return (
    <div style={{position: "relative", width: isVertical ? "92%" : "78%", minHeight, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div style={{position: "absolute", inset: isVertical ? "10% 6%" : "12% 10%", borderRadius: 42, background: `radial-gradient(circle at center, ${accent}1e 0%, transparent 65%)`, filter: "blur(18px)"}} />
      <div style={{position: "absolute", left: "50%", top: "50%", width: isVertical ? 420 : 520, height: isVertical ? 420 : 300, transform: "translate(-50%, -50%)", borderRadius: 999, border: `1px solid ${accent}1f`, boxShadow: `0 0 42px ${accent}16 inset`}} />
      <div style={{position: "relative", width: "100%", display: "flex", justifyContent: "center"}}>{children}</div>
    </div>
  );
};

const AssetScene: React.FC<{scene: DirectorScene; src: string; accent: string; isVertical: boolean; designLanguage: string}> = ({scene, src, accent, isVertical, designLanguage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const primary = scene.asset_placements[0];
  const annotations = primary.annotations ?? [];
  const proofFocus = scene.proof_focus;
  const material = scene.styleframe_tokens?.material_family ?? "glass-ink";

  return (
    <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: isVertical ? "column" : "row", justifyContent: "center", alignItems: "center", gap: isVertical ? 22 : 40, padding: isVertical ? "86px 42px 274px" : "84px 80px 180px"}}>
      <div style={{flex: isVertical ? "none" : 1, width: isVertical ? "88%" : undefined, maxWidth: isVertical ? "88%" : "34%", textAlign: isVertical ? "center" : "left"}}>
        <SceneEyebrow scene={scene} accent={accent} designLanguage={designLanguage} />
        <div style={{marginTop: 22, ...baseText, ...displayText, fontSize: isVertical ? 64 : 46, fontWeight: 700, lineHeight: 1.04}}>
          <HighlightedHeadline text={scene.ppt_layer.headline} highlights={scene.ppt_layer.highlight_words} accent={accent} />
        </div>
        <div style={{marginTop: 18, display: "flex", justifyContent: isVertical ? "center" : "flex-start"}}>
          <div style={accentLine(accent, isVertical ? 200 : 160, designLanguage)} />
        </div>
        <div style={{marginTop: 18, display: "flex", justifyContent: isVertical ? "center" : "flex-start"}}>
          <ProofBadge label={proofFocus?.label ?? "Proof"} accent={accent} designLanguage={designLanguage} />
        </div>
        {!isVertical ? (
          <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 22, alignItems: "flex-start"}}>
            {scene.ppt_layer.bullets.map((bullet, index) => (
              <div key={`${bullet}-${index}`} style={{...baseText, fontSize: 26, color: index === 0 ? accent : "#c7d2ea", textAlign: "left"}}>
                {bullet}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div style={{flex: isVertical ? "none" : 1, width: isVertical ? "100%" : "60%", display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
        <div style={{width: isVertical ? "96%" : "100%", height: isVertical ? 748 : 660, position: "relative", borderRadius: 24, ...materialSurface(material, designLanguage)}}>
          <DeviceFrame type={primary.device_frame ?? "none"}>
            <Img src={src} style={{width: "100%", height: "100%", objectFit: primary.aspect_hint === "portrait" ? "cover" : "contain", display: "block", background: "#0c1020"}} />
            <AnnotationOverlay annotations={annotations} accent={accent} frame={frame} fps={fps} proofLabel={proofFocus?.label} designLanguage={designLanguage} />
          </DeviceFrame>
        </div>
        {isVertical ? <SupportRail items={scene.ppt_layer.bullets} accent={accent} isVertical={isVertical} designLanguage={designLanguage} align="center" /> : null}
      </div>
    </div>
  );
};

const VisualAnchorBlock: React.FC<{scene: DirectorScene; accent: string; frame: number; fps: number; designLanguage: string}> = ({scene, accent, frame, fps, designLanguage}) => {
  const anchor = scene.visual_anchor;
  if (!anchor) {
    return null;
  }
  if (anchor.type === "icon") {
    return <IconOrbit icons={anchor.icons ?? ["director", "workflow"]} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "terminal") {
    return <TerminalBlock lines={anchor.lines ?? ["python scripts/rebuild_episode.py"]} frame={frame} fps={fps} accent={accent} designLanguage={designLanguage} />;
  }
  if (anchor.type === "counter") {
    return <AnimatedCounter value={anchor.value ?? 3} label={anchor.label ?? "steps"} prefix={anchor.prefix} frame={frame} fps={fps} accent={accent} designLanguage={designLanguage} />;
  }
  if (anchor.type === "progress") {
    return (
      <div style={{width: "80%", ...editorialCard("glass-ink", accent, {padding: 18, radius: 24}, designLanguage), display: "flex", flexDirection: "column", gap: 12}}>
        <div style={{...baseText, fontSize: 28, color: "#c7d2ea"}}>Workflow progress</div>
        <div style={{height: 12, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden"}}>
          <div style={{width: `${((anchor.step ?? 1) / Math.max(anchor.total ?? 1, 1)) * 100}%`, height: "100%", background: accent}} />
        </div>
      </div>
    );
  }
  if (anchor.type === "flowchart") {
    const cueIndex = (scene.caption_cues ?? []).findIndex((cue) => {
      const time = frame / fps;
      return time >= cue.start_s && time < cue.end_s;
    });
    const activeStep = anchor.active_step_cue_index != null
      ? Math.max(0, Math.min(anchor.steps.length - 1, cueIndex >= 0 ? cueIndex : anchor.active_step_cue_index))
      : Math.max(0, Math.min(anchor.steps.length - 1, Math.floor((frame / Math.max(1, scene.duration_s * fps)) * anchor.steps.length)));
    return (
        <AnimatedFlowChart
          steps={anchor.steps}
          activeStep={activeStep}
          accent={accent}
          frame={frame}
          fps={fps}
          direction={anchor.direction ?? "horizontal"}
          designLanguage={designLanguage}
        />
    );
  }
  if (anchor.type === "comparison") {
    return <ComparisonPanel left={anchor.left} right={anchor.right} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "architecture") {
    return <ArchitectureDiagram layers={anchor.layers} connections={anchor.connections} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "timeline") {
    return <TimelineStrip events={anchor.events} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "quote-paper") {
    return <PaperQuote quote={anchor.quote} source={anchor.source} highlights={anchor.highlights} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "formula") {
    return <FormulaReveal steps={anchor.steps} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "embedding") {
    return <EmbeddingScatter points={anchor.points} highlights={anchor.highlights} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "attention") {
    return <AttentionHeatmap tokens={anchor.tokens} matrix={anchor.matrix} highlight_pairs={anchor.highlight_pairs} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "loss-curve") {
    return <LossCurveScrub series={anchor.series} annotations={anchor.annotations} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "prompt-flow") {
    return <PromptToOutput prompt={anchor.prompt} output_tokens={anchor.output_tokens} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "network-graph") {
    return <NetworkGraphBuild nodes={anchor.nodes} edges={anchor.edges} reveal_order={anchor.reveal_order} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  if (anchor.type === "chart-line") {
    return <ChartLineReveal series={anchor.series} x_label={anchor.x_label} y_label={anchor.y_label} highlights={anchor.highlights} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  }
  return (
    <div style={{maxWidth: "76%", ...editorialCard("matte-paper", accent, {padding: 24, radius: 24}, designLanguage), ...baseText, fontSize: 30}}>
      "{scene.ppt_layer.bullets[0] ?? scene.ppt_layer.headline}"
    </div>
  );
};

const TextScene: React.FC<{
  scene: DirectorScene;
  accent: string;
  isVertical: boolean;
  backgroundSrc?: string | null;
  textSafeArea?: string;
  compositionMode?: string;
  designLanguage: string;
}> = ({scene, accent, isVertical, backgroundSrc, textSafeArea, compositionMode, designLanguage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const typographyMode = scene.styleframe_tokens?.typography_mode ?? "quiet-quote";
  const safeArea = textSafeArea ?? "center-clear";
  const alignLeft = safeArea === "left" || (!isVertical && safeArea === "center-clear" && (typographyMode === "terminal-editorial" || typographyMode === "hero-kicker"));
  const alignRight = safeArea === "right";
  const bigMetric = typographyMode === "metric-wall";
  const role = scene.editorial_role;
  const contentWidth = isVertical ? "86%" : alignLeft ? "72%" : "80%";
  const anchorNode = <VisualAnchorBlock scene={scene} accent={accent} frame={frame} fps={fps} designLanguage={designLanguage} />;
  const hasAnchor = Boolean(scene.visual_anchor);
  const supportRail = <SupportRail items={scene.ppt_layer.bullets} accent={accent} isVertical={isVertical} designLanguage={designLanguage} align={alignLeft ? "left" : "center"} />;
  const anchorFirst = hasAnchor && (role === "focus" || role === "proof" || role === "release");
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
    <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: isVertical ? "96px 48px 284px" : "102px 120px 200px", gap: 22}}>
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
              opacity: 0.3,
              filter: "saturate(0.92) contrast(1.02)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                safeArea === "right"
                  ? "linear-gradient(90deg, rgba(5,8,16,0.14) 0%, rgba(5,8,16,0.3) 42%, rgba(5,8,16,0.84) 100%)"
                  : safeArea === "left"
                    ? "linear-gradient(90deg, rgba(5,8,16,0.84) 0%, rgba(5,8,16,0.3) 58%, rgba(5,8,16,0.14) 100%)"
                    : safeArea === "top"
                      ? "linear-gradient(180deg, rgba(5,8,16,0.86) 0%, rgba(5,8,16,0.28) 44%, rgba(5,8,16,0.28) 100%)"
                      : "radial-gradient(circle at center, rgba(5,8,16,0.2) 0%, rgba(5,8,16,0.82) 100%)",
            }}
          />
        </>
      ) : null}
      <div style={{width: contentWidth, display: "flex", flexDirection: "column", alignItems: alignRight ? "flex-end" : alignLeft ? "flex-start" : "center", textAlign: alignRight ? "right" : alignLeft ? "left" : "center"}}>
        <SceneEyebrow scene={scene} accent={accent} designLanguage={designLanguage} />
        <div style={{...baseText, ...displayText, fontSize: bigMetric ? (isVertical ? 124 : 112) : (isVertical ? 84 : 68), fontWeight: 700, lineHeight: 0.98, textAlign: alignRight ? "right" : alignLeft ? "left" : "center", maxWidth: bigMetric ? "100%" : (isVertical ? "100%" : "88%"), marginTop: 18}}>
          <HighlightedHeadline text={scene.ppt_layer.headline} highlights={scene.ppt_layer.highlight_words} accent={accent} />
        </div>
        <div style={{marginTop: 18, display: "flex", justifyContent: alignRight ? "flex-end" : alignLeft ? "flex-start" : "center", width: "100%"}}>
          <div style={accentLine(accent, bigMetric ? 260 : 170, designLanguage)} />
        </div>
        {!anchorFirst ? (
          <div style={{display: "flex", flexDirection: "column", gap: 12, alignItems: alignRight ? "flex-end" : alignLeft ? "flex-start" : "center", maxWidth: isVertical ? "94%" : "74%", marginTop: 18}}>
            {scene.ppt_layer.bullets.map((bullet, index) => (
              <div key={`${bullet}-${index}`} style={{...baseText, fontSize: isVertical ? (index === 0 ? 30 : 25) : 28, color: index === 0 ? accent : "#cad4e8", textAlign: alignRight ? "right" : alignLeft ? "left" : "center", lineHeight: 1.35}}>
                {bullet}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {anchorFirst ? <AnchorStage accent={accent} isVertical={isVertical} role={role}>{anchorNode}</AnchorStage> : anchorNode}
      {anchorFirst ? supportRail : null}
    </div>
  );
};

export const SceneRenderer: React.FC<{
  scene: DirectorScene;
  sceneIndex: number;
  totalScenes: number;
  meta: DirectorVideoProps["meta"];
  previousTransitionOut?: string | null;
  showSubtitles?: boolean;
}> = ({scene, sceneIndex, meta, showSubtitles = true}) => {
  const frame = useCurrentFrame();
  const {height, width} = useVideoConfig();
  const colors = getBeatColors(scene.beat);
  const isVertical = height > width;
  const cues = React.useMemo(() => resolveCues(scene), [scene]);
  const time = frame / FPS;
  const activeCue = cues.find((cue) => time >= cue.start_s && time < cue.end_s) ?? cues[cues.length - 1];
  const primary = scene.asset_placements[0];
  const primarySrc = primary ? resolveStatic(primary.file) : null;
  const backgroundFamily = scene.styleframe_tokens?.background_family;
  const compositionMode = scene.styleframe_tokens?.composition_mode;
  const textSafeArea = scene.camera_plan?.text_safe_area;
  const premiumGeneratedEvidence = scene.evidence_source === "auto-generated" || scene.evidence_source === "external-generated";
  const premiumBackgroundSrc = premiumGeneratedEvidence ? primarySrc : null;
  const designLanguage = meta.design_language ?? "premium-tech-editorial";
  const supportsGeneratedPremiumScene = premiumGeneratedEvidence && generatedPremiumStrategies.has(scene.visual_strategy);
  const usesStructuredInfographic = [
    "flowchart",
    "comparison",
    "architecture",
    "timeline",
    "quote-paper",
    "formula",
    "embedding",
    "attention",
    "loss-curve",
    "prompt-flow",
    "network-graph",
    "chart-line",
  ].includes(scene.visual_anchor?.type ?? "");
  const immersiveLookdevScene = scene.scene_kind === "immersive-bg" && primarySrc;
  const durationFrames = Math.max(1, Math.round(scene.duration_s * FPS));
  const cameraMotionStyle = useCameraMotion(scene.camera_plan, durationFrames, primary?.annotations?.[0]?.region);
  const subtitleMode = scene.scene_kind === "immersive-bg" ? "immersive" : "default";
  const subtitleTreatment = scene.board_motion?.subtitle_treatment ?? null;

  return (
    <AbsoluteFill style={{background: "#050810", overflow: "hidden"}}>
      <BeatBackground beat={scene.beat} accent={colors.accent} frame={frame} backgroundFamily={backgroundFamily} />
      <AbsoluteFill style={{background: "radial-gradient(circle at center, transparent 38%, rgba(0,0,0,0.46) 100%)"}} />
      <div style={{position: "absolute", top: 28, left: 28, opacity: 0.001}}>{scene.editorial_role}{scene.styleframe_tokens?.background_family}</div>
      <AbsoluteFill style={{...cameraMotionStyle}}>
        {immersiveLookdevScene ? (
          <LookdevBoardScene scene={scene} src={primarySrc} accent={colors.accent} designLanguage={designLanguage} boardMotion={scene.board_motion} />
        ) : sceneIndex === 0 && scene.visual_strategy === "hook-opener" ? (
          <HookOpener
            headline={scene.ppt_layer.headline}
            bullets={scene.ppt_layer.bullets}
            accent={colors.accent}
            backgroundSrc={premiumBackgroundSrc}
            textSafeArea={textSafeArea}
            compositionMode={compositionMode}
            durationFrames={durationFrames}
            designLanguage={designLanguage}
          />
        ) : scene.visual_strategy === "auto-diagram" && !usesStructuredInfographic ? (
          <RemotionDemo
            headline={scene.ppt_layer.headline}
            bullets={scene.ppt_layer.bullets}
            accent={colors.accent}
            durationFrames={durationFrames}
            assetSrc={primarySrc}
            designLanguage={designLanguage}
          />
        ) : primarySrc && !supportsGeneratedPremiumScene ? (
          <AssetScene scene={scene} src={primarySrc} accent={colors.accent} isVertical={isVertical} designLanguage={designLanguage} />
        ) : (
          <TextScene
            scene={scene}
            accent={colors.accent}
            isVertical={isVertical}
            backgroundSrc={supportsGeneratedPremiumScene ? primarySrc : null}
            textSafeArea={textSafeArea}
            compositionMode={compositionMode}
            designLanguage={designLanguage}
          />
        )}
      </AbsoluteFill>
      {showSubtitles && activeCue ? <SubtitleOverlay cue={activeCue} isVertical={isVertical} accent={colors.accent} designLanguage={designLanguage} mode={subtitleMode} treatment={subtitleTreatment} /> : null}
    </AbsoluteFill>
  );
};
