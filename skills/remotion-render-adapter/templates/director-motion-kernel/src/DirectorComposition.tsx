import React from "react";
import {AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {type DirectorScene, type DirectorVideoProps} from "./directorData";
import {ClosingScene} from "./components/ClosingScene";
import {NarrativeProgress} from "./components/NarrativeProgress";
import {SceneRenderer} from "./components/SceneRenderer";
import {SceneCallback} from "./components/SceneCallback";
import {TechEffectOpener} from "./standalone/TechEffectOpener";
import {getStageOverlapFrames, transitionForRole} from "./transitions/resolveTransition";
import {brandBodyStyle, brandDisplayStyle, brandPalette, editorialCard, editorialEyebrow, isUncodixifiedLanguage, getBeatColors, normalizeText, resolveStatic, sceneFrames} from "./shared";

const resolveAudio = (file: string) => {
  const value = normalizeText(file);
  if (!value) {
    return null;
  }
  if (value.startsWith("audio/")) {
    return staticFile(value);
  }
  return staticFile(value.replace(/^\/+/, ""));
};

type SceneTimeline = {
  scene: DirectorScene;
  index: number;
  start: number;
  visualStart: number;
  duration: number;
  visualDuration: number;
  enterOverlap: number;
  exitOverlap: number;
  transitionOut: string;
};

type CueDefinition = {
  file: string;
  volume: number;
  durationFrames: number;
};

type SfxEvent = CueDefinition & {
  key: string;
  cue: string;
  from: number;
};

const SFX_LIBRARY: Record<string, CueDefinition> = {
  tick: {file: "audio/sfx/tick.wav", volume: 0.16, durationFrames: 12},
  whoosh: {file: "audio/sfx/whoosh.wav", volume: 0.22, durationFrames: 18},
  hit: {file: "audio/sfx/hit.wav", volume: 0.24, durationFrames: 16},
  pulse: {file: "audio/sfx/pulse.wav", volume: 0.18, durationFrames: 20},
  shimmer: {file: "audio/sfx/shimmer.wav", volume: 0.18, durationFrames: 24},
  resolve: {file: "audio/sfx/resolve.wav", volume: 0.2, durationFrames: 26},
};

const buildSceneTimeline = (scenes: DirectorScene[], fps: number): SceneTimeline[] => {
  let cursor = 0;
  let previousExitOverlap = 0;

  return scenes.map((scene, index) => {
    const duration = sceneFrames(scene);
    const transitionOut = scene.transition_out ?? transitionForRole(scene.editorial_role);
    const exitOverlap = index < scenes.length - 1 ? getStageOverlapFrames(transitionOut, fps) : 0;
    const start = cursor;
    const visualStart = Math.max(0, start - previousExitOverlap);
    const item: SceneTimeline = {
      scene,
      index,
      start,
      visualStart,
      duration,
      visualDuration: duration + previousExitOverlap,
      enterOverlap: previousExitOverlap,
      exitOverlap,
      transitionOut,
    };
    cursor += duration;
    previousExitOverlap = exitOverlap;
    return item;
  });
};

const cueMarksForScene = (scene: DirectorScene): number[] => {
  const marks = [
    ...scene.interaction_timeline.map((event) => Number((event as {at_s?: number}).at_s ?? Number.NaN)),
    ...((scene.caption_cues ?? []).map((cue) => Number(cue.start_s ?? 0) + 0.08)),
  ]
    .filter((mark) => Number.isFinite(mark) && mark >= 0)
    .map((mark) => Number(mark.toFixed(2)));

  if (scene.proof_focus?.timing_s != null) {
    marks.push(Number(scene.proof_focus.timing_s));
  }

  return [...new Set(marks)].sort((left, right) => left - right);
};

const resolveCallbackScene = (
  scenes: DirectorScene[],
  callbackReference: DirectorScene["callback_reference"],
) => {
  if (!callbackReference) {
    return null;
  }
  const target = callbackReference.target_scene;
  if (typeof target === "number") {
    return scenes[target] ?? null;
  }
  return scenes.find((scene) => scene.scene_id === target) ?? null;
};

const buildSfxEvents = (timeline: SceneTimeline[], fps: number): SfxEvent[] =>
  timeline.flatMap((item) => {
    const marks = cueMarksForScene(item.scene);
    const cueCount = item.scene.sound_cues.length;

    return item.scene.sound_cues.flatMap((cue, index) => {
      const definition = SFX_LIBRARY[cue];
      if (!definition) {
        return [];
      }

      const fallbackSpacing = Math.max(0.22, item.scene.duration_s / Math.max(cueCount + 1, 2));
      const fallbackMark = 0.16 + index * fallbackSpacing;
      const cueMark = marks[index] ?? fallbackMark;
      const cueSecond = Math.max(0, Math.min(item.scene.duration_s - 0.1, cueMark));

      return {
        ...definition,
        cue,
        key: `${item.scene.scene_id}-${cue}-${index}`,
        from: item.start + Math.max(0, Math.round(cueSecond * fps)),
      };
    });
  });

const formatSeriesText = (template: string | undefined, seriesConfig: DirectorVideoProps["series_config"]) => {
  const value = normalizeText(template ?? "");
  if (!value || !seriesConfig) {
    return "";
  }
  return value
    .replace(/\{series_name\}/g, seriesConfig.series_name ?? "")
    .replace(/\{series_id\}/g, seriesConfig.series_id ?? "")
    .replace(/\{episode_number\}/g, String(seriesConfig.episode_number ?? 1).padStart(2, "0"));
};

const SeriesOpening: React.FC<{
  seriesConfig: NonNullable<DirectorVideoProps["series_config"]>;
  designLanguage?: string;
}> = ({seriesConfig, designLanguage}) => {
  const overlayText = formatSeriesText(seriesConfig.opening?.overlay_text, seriesConfig);
  const avatarSrc = resolveStatic(seriesConfig.brand?.avatar_file ?? "");
  const openingTemplate = normalizeText(seriesConfig.opening?.template ?? "steven-avatar-seal").toLowerCase();
  const resolvedDesignLanguage = designLanguage ?? "premium-tech-editorial";
  const uncodixified = isUncodixifiedLanguage(resolvedDesignLanguage);
  const palette = brandPalette(seriesConfig);
  const bodyStyle = brandBodyStyle(seriesConfig);
  const displayStyle = brandDisplayStyle(seriesConfig);
  const ribbonLayout = openingTemplate.includes("ribbon") || openingTemplate.includes("left");
  const minimalLayout = openingTemplate.includes("minimal");
  const showAvatar = Boolean(avatarSrc) && !minimalLayout && !openingTemplate.includes("wordmark-only");
  return (
    <AbsoluteFill
      style={{
        background: uncodixified
          ? `linear-gradient(155deg, #071119 0%, #0d1720 54%, #121b24 100%)`
          : `radial-gradient(circle at 18% 18%, ${palette.primary}20 0%, transparent 34%), radial-gradient(circle at 82% 16%, ${palette.secondary}1a 0%, transparent 30%)`,
      }}
    >
      <TechEffectOpener designLanguage={resolvedDesignLanguage} />
      {showAvatar ? (
        <div
          style={{
            position: "absolute",
            left: ribbonLayout ? 84 : "50%",
            top: minimalLayout ? "14%" : "24%",
            transform: ribbonLayout ? "none" : "translateX(-50%)",
            ...editorialCard("glass-ink", palette.primary, {padding: 10, radius: 999}, resolvedDesignLanguage),
            width: ribbonLayout ? 116 : 138,
            height: ribbonLayout ? 116 : 138,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img src={avatarSrc ?? ""} style={{width: ribbonLayout ? 96 : 118, height: ribbonLayout ? 96 : 118, borderRadius: "50%", objectFit: "cover"}} />
        </div>
      ) : null}
      {overlayText ? (
        <div
          style={{
            position: "absolute",
            left: ribbonLayout ? 84 : "50%",
            bottom: ribbonLayout ? "auto" : 118,
            top: ribbonLayout ? 118 : undefined,
            transform: ribbonLayout ? "none" : "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: ribbonLayout ? "flex-start" : "center",
            gap: 14,
            textAlign: ribbonLayout ? "left" : "center",
            color: "#f4f7ff",
            pointerEvents: "none",
            ...bodyStyle,
          }}
        >
          <div style={editorialEyebrow(palette.primary, resolvedDesignLanguage)}>
            {(seriesConfig.brand?.wordmark ?? seriesConfig.series_name).toUpperCase()}
          </div>
          <div
            style={{
              ...displayStyle,
              fontSize: ribbonLayout ? 44 : 54,
              lineHeight: 0.94,
              fontWeight: 700,
              letterSpacing: -1.6,
              textShadow: uncodixified ? "0 8px 28px rgba(0,0,0,0.24)" : "0 14px 42px rgba(0,0,0,0.45)",
            }}
          >
            {overlayText}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const BrandWatermark: React.FC<{
  seriesConfig?: DirectorVideoProps["series_config"];
  designLanguage?: string;
}> = ({seriesConfig, designLanguage}) => {
  const position = normalizeText(seriesConfig?.brand?.watermark_position ?? "");
  if (!position) {
    return null;
  }
  const resolvedDesignLanguage = designLanguage ?? "premium-tech-editorial";
  const palette = brandPalette(seriesConfig);
  const bodyStyle = brandBodyStyle(seriesConfig);
  const wordmark = normalizeText(seriesConfig?.brand?.wordmark ?? seriesConfig?.series_name ?? "");
  const avatarSrc = resolveStatic(seriesConfig?.brand?.avatar_file ?? seriesConfig?.brand?.logo_file ?? "");
  const opacity = Number(seriesConfig?.brand?.watermark_opacity ?? 0.16);
  const anchor =
    position === "top-left"
      ? {top: 34, left: 34}
      : position === "top-right"
        ? {top: 34, right: 34}
        : position === "bottom-left"
          ? {bottom: 34, left: 34}
          : {bottom: 34, right: 34};
  if (!avatarSrc && !wordmark) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        ...anchor,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {avatarSrc ? (
        <div
          style={{
            ...editorialCard("glass-ink", palette.primary, {padding: 6, radius: 999}, resolvedDesignLanguage),
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img src={avatarSrc} style={{width: 32, height: 32, borderRadius: "50%", objectFit: "cover"}} />
        </div>
      ) : null}
      {wordmark ? (
        <div
          style={{
            ...editorialCard("glass-ink", palette.secondary, {padding: 10, radius: 999}, resolvedDesignLanguage),
            ...bodyStyle,
            fontSize: 13,
            fontWeight: 700,
            color: "#edf4ff",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {wordmark}
        </div>
      ) : null}
    </div>
  );
};

const roleMotion = (role: string) => {
  switch (role) {
    case "establish":
      return {x: 0, y: 18, scaleIn: 0.985, scaleOut: 1.01};
    case "proof":
      return {x: 10, y: 0, scaleIn: 1.01, scaleOut: 0.996};
    case "contrast":
      return {x: -14, y: 0, scaleIn: 1.005, scaleOut: 1.012};
    case "release":
      return {x: 0, y: 8, scaleIn: 0.992, scaleOut: 1.0};
    default:
      return {x: 12, y: 10, scaleIn: 0.992, scaleOut: 1.006};
  }
};

const StageLayer: React.FC<{
  timeline: SceneTimeline;
  meta: DirectorVideoProps["meta"];
  totalScenes: number;
  previousTransitionOut?: string | null;
  beatColors: string[];
  previousAccent?: string | null;
  callbackTarget?: DirectorScene | null;
}> = ({timeline, meta, totalScenes, previousTransitionOut, beatColors, previousAccent, callbackTarget}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const motion = roleMotion(timeline.scene.editorial_role);
  const preRoll = frame < timeline.enterOverlap;
  const contentFrame = Math.max(0, frame - timeline.enterOverlap);
  const currentAccent = beatColors[timeline.index] ?? "#79e8ff";
  const sceneProgress = Math.max(0, Math.min(1, contentFrame / Math.max(1, timeline.duration)));

  const enterProgress = timeline.enterOverlap > 0
    ? spring({fps, frame: frame - 1, config: {damping: 20, stiffness: 110}, durationInFrames: timeline.enterOverlap})
    : 1;
  const exitProgress = timeline.exitOverlap > 0
    ? interpolate(contentFrame, [Math.max(0, timeline.duration - timeline.exitOverlap), timeline.duration], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const opacity = Math.min(1, enterProgress, exitProgress);
  const x = interpolate(enterProgress, [0, 1], [motion.x, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
    + interpolate(exitProgress, [0, 1], [0, -motion.x * 0.35], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const y = interpolate(enterProgress, [0, 1], [motion.y, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scale = interpolate(enterProgress, [0, 1], [motion.scaleIn, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
    * interpolate(exitProgress, [0, 1], [motion.scaleOut, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const flashOpacity =
    timeline.transitionOut === "contrast-cut"
      ? interpolate(contentFrame, [Math.max(0, timeline.duration - timeline.exitOverlap), timeline.duration], [0, 0.12], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const bridgeOpacity =
    previousAccent && timeline.enterOverlap > 0
      ? interpolate(frame, [0, timeline.enterOverlap], [0.16, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const sceneNode = (
    <SceneRenderer
      scene={timeline.scene}
      sceneIndex={timeline.index}
      totalScenes={totalScenes}
      meta={meta}
      previousTransitionOut={previousTransitionOut}
      showSubtitles={!preRoll}
    />
  );

  return (
    <AbsoluteFill style={{opacity, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`, willChange: "opacity, transform"}}>
      {preRoll ? <Freeze frame={0}>{sceneNode}</Freeze> : sceneNode}
      {bridgeOpacity > 0 && previousAccent ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${previousAccent}20 0%, transparent 38%, ${currentAccent}12 100%)`,
            opacity: bridgeOpacity,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div style={{position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.3}}>
        <div
          style={{
            position: "absolute",
            top: -140,
            left: "18%",
            width: 360,
            height: 220,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${currentAccent}1f 0%, transparent 72%)`,
            filter: "blur(22px)",
            transform: `translateX(${Math.sin((timeline.start + frame) * 0.02) * 18}px)`,
          }}
        />
        {[0.16, 0.52, 0.82].map((position, index) => (
          <div
            key={position}
            style={{
              position: "absolute",
              left: `${position * 100}%`,
              top: `${18 + index * 10}%`,
              width: index === 1 ? 10 : 7,
              height: index === 1 ? 10 : 7,
              borderRadius: "50%",
              background: currentAccent,
              boxShadow: `0 0 16px ${currentAccent}`,
              opacity: 0.32 + index * 0.08,
              transform: `translateY(${Math.sin((timeline.start + frame) * (0.02 + index * 0.005)) * (10 + index * 4)}px)`,
            }}
          />
        ))}
      </div>
      {flashOpacity > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {timeline.scene.callback_reference && callbackTarget ? (
        <SceneCallback
          callback={timeline.scene.callback_reference}
          targetScene={callbackTarget}
          localFrame={contentFrame}
          accent={currentAccent}
        />
      ) : null}
      <NarrativeProgress
        currentScene={timeline.index}
        totalScenes={totalScenes}
        progress={sceneProgress}
        beatColors={beatColors}
        accent={currentAccent}
      />
      {timeline.scene.sound_cues?.length ? (
        <div style={{position: "absolute", top: 28, right: 28, opacity: 0.001, pointerEvents: "none"}}>
          {timeline.scene.sound_cues.join(",")}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const DirectorComposition: React.FC<DirectorVideoProps> = ({meta, scenes, series_config}) => {
  const {fps} = useVideoConfig();
  const audioSrc = resolveAudio(meta.audio_file);
  const designLanguage = meta.design_language ?? "premium-tech-editorial";
  const timeline = React.useMemo(() => buildSceneTimeline(scenes, fps), [fps, scenes]);
  const sfxEvents = React.useMemo(() => buildSfxEvents(timeline, fps), [fps, timeline]);
  const beatColors = React.useMemo(() => scenes.map((scene) => getBeatColors(scene.beat).accent), [scenes]);
  const openingDurationInFrames = Math.max(0, Math.round(Number(series_config?.opening?.duration_s ?? 0) * fps));
  const timelineDurationInFrames = React.useMemo(
    () => timeline.reduce((total, item) => Math.max(total, item.start + item.duration), 0),
    [timeline],
  );
  const closingDurationInFrames = Math.max(0, Math.round(Number(series_config?.closing?.duration_s ?? 0) * fps));

  return (
    <>
      {audioSrc ? (
        openingDurationInFrames > 0 ? (
          <Sequence from={openingDurationInFrames} durationInFrames={Math.max(1, timelineDurationInFrames + closingDurationInFrames)}>
            <Audio src={audioSrc} />
          </Sequence>
        ) : (
          <Audio src={audioSrc} />
        )
      ) : null}
      {sfxEvents.map((event) => (
        <Sequence key={event.key} from={openingDurationInFrames + event.from} durationInFrames={event.durationFrames} name={`sfx-${event.cue}`}>
          <Audio src={staticFile(event.file)} volume={event.volume} />
        </Sequence>
      ))}
      <AbsoluteFill style={{background: "#050810", overflow: "hidden"}}>
        {series_config?.opening && openingDurationInFrames > 0 ? (
          <Sequence from={0} durationInFrames={openingDurationInFrames} name={series_config?.opening?.composition ?? "series-opening"}>
            <SeriesOpening seriesConfig={series_config} designLanguage={designLanguage} />
          </Sequence>
        ) : null}
        <BrandWatermark seriesConfig={series_config} designLanguage={designLanguage} />
        {timeline.map((item) => (
          <Sequence key={item.scene.scene_id} from={openingDurationInFrames + item.visualStart} durationInFrames={item.visualDuration} name={item.scene.scene_id}>
            <StageLayer
              timeline={item}
              meta={meta}
              totalScenes={scenes.length}
              previousTransitionOut={item.index > 0 ? timeline[item.index - 1].transitionOut : null}
              beatColors={beatColors}
              previousAccent={item.index > 0 ? beatColors[item.index - 1] : null}
              callbackTarget={resolveCallbackScene(scenes, item.scene.callback_reference)}
            />
          </Sequence>
        ))}
        {series_config && closingDurationInFrames > 0 ? (
          <Sequence from={openingDurationInFrames + timelineDurationInFrames} durationInFrames={closingDurationInFrames} name="series-closing">
            <ClosingScene
              seriesConfig={series_config}
              accent={series_config.brand?.primary_color ?? undefined}
              designLanguage={designLanguage}
            />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    </>
  );
};
