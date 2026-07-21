import React from "react";
import {evolvePath} from "@remotion/paths";
import {makeCircle} from "@remotion/shapes";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {accentLine, baseText, editorialCard, editorialEyebrow, isUncodixifiedLanguage} from "../shared";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

type TechEffectOpenerProps = {
  designLanguage?: string;
};

const Ring: React.FC<{
  radius: number;
  stroke: string;
  frame: number;
  delay: number;
  rotationSpeed: number;
  thickness: number;
  glow: string;
}> = ({radius, stroke, frame, delay, rotationSpeed, thickness, glow}) => {
  const {path} = makeCircle({radius});
  const reveal = spring({
    fps: 30,
    frame: frame - delay,
    config: {damping: 16, stiffness: 120, mass: 0.8},
  });
  const evolved = evolvePath(clamp01(reveal), path);

  return (
    <svg
      width={radius * 2 + thickness * 6}
      height={radius * 2 + thickness * 6}
      viewBox={`${-radius - thickness * 3} ${-radius - thickness * 3} ${radius * 2 + thickness * 6} ${radius * 2 + thickness * 6}`}
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",
        transform: `rotate(${frame * rotationSpeed}deg)`,
        overflow: "visible",
      }}
    >
      <path
        d={path}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={Math.max(1, thickness * 0.6)}
        fill="none"
        strokeDasharray="8 12"
      />
      <path
        d={path}
        stroke={stroke}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
        style={{
          filter: `drop-shadow(0 0 14px ${glow})`,
        }}
      />
    </svg>
  );
};

const Shard: React.FC<{
  frame: number;
  delay: number;
  width: number;
  height: number;
  x: number;
  y: number;
  rotate: number;
  tint: string;
}> = ({frame, delay, width, height, x, y, rotate, tint}) => {
  const enter = spring({
    fps: 30,
    frame: frame - delay,
    config: {damping: 14, stiffness: 140, mass: 0.9},
  });
  const exit = interpolate(frame, [70, 89], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        height,
        borderRadius: Math.min(width, height) * 0.28,
        transform: `translate3d(${interpolate(enter, [0, 1], [x * 0.4, x])}px, ${interpolate(enter, [0, 1], [y * 0.4, y])}px, 0) rotate(${rotate + frame * 0.06}deg) scale(${interpolate(enter, [0, 1], [0.72, 1.04])})`,
        transformOrigin: "50% 50%",
        marginLeft: -width / 2,
        marginTop: -height / 2,
        background: `linear-gradient(135deg, rgba(255,255,255,0.18), ${tint})`,
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: `0 18px 42px rgba(0,0,0,0.28), 0 0 28px ${tint}`,
        opacity: enter * exit,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "14%",
          right: "14%",
          top: "24%",
          height: "18%",
          borderRadius: 999,
          background: "rgba(255,255,255,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "14%",
          right: "24%",
          bottom: "22%",
          height: "14%",
          borderRadius: 999,
          background: "rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
};

const OrbitalPulse: React.FC<{
  frame: number;
  radius: number;
  delay: number;
  size: number;
  hue: string;
  angularOffset: number;
}> = ({frame, radius, delay, size, hue, angularOffset}) => {
  const enter = spring({
    fps: 30,
    frame: frame - delay,
    config: {damping: 18, stiffness: 110, mass: 0.9},
  });
  const orbitFrame = Math.max(0, frame - delay);
  const angle = angularOffset + orbitFrame * 0.085;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius * 0.66;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        borderRadius: size / 2,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${interpolate(enter, [0, 1], [0.6, 1.18])})`,
        background: hue,
        boxShadow: `0 0 22px ${hue}, 0 0 56px ${hue}`,
        opacity: enter,
      }}
    />
  );
};

const EditorialTechEffectOpener: React.FC<{designLanguage: string}> = ({designLanguage}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const isVertical = height > width;
  const intro = spring({
    fps: 30,
    frame,
    config: {damping: 16, stiffness: 110, mass: 0.9},
  });
  const detailEnter = spring({
    fps: 30,
    frame: frame - 8,
    config: {damping: 18, stiffness: 100, mass: 0.92},
  });
  const drift = Math.sin(frame * 0.04) * (isVertical ? 10 : 12);
  const accent = "#9bd1ff";
  const secondary = "#90d9bf";

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "linear-gradient(155deg, #071119 0%, #0d1720 54%, #121b24 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          background:
            "radial-gradient(circle at 18% 16%, rgba(155,209,255,0.12) 0%, transparent 30%), radial-gradient(circle at 82% 20%, rgba(144,217,191,0.1) 0%, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
          opacity: 0.82,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: isVertical ? 48 : 72,
          right: isVertical ? 48 : 72,
          top: isVertical ? 88 : 72,
          opacity: detailEnter,
          transform: `translateY(${interpolate(detailEnter, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={accentLine(accent, isVertical ? 220 : 320, designLanguage)} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: isVertical ? "150px 48px 170px" : "108px 96px 114px",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          opacity: intro,
          transform: `translateY(${interpolate(intro, [0, 1], [34, 0])}px) scale(${interpolate(intro, [0, 1], [0.96, 1])})`,
        }}
      >
        <div
          style={{
            ...editorialCard("matte-paper", accent, {padding: isVertical ? 28 : 32, radius: 30}, designLanguage),
            width: "100%",
            maxWidth: isVertical ? 760 : 1160,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16}}>
            <div style={editorialEyebrow(accent, designLanguage)}>片头结构</div>
            <div style={{...baseText, fontSize: 14, color: "#d5dfef", letterSpacing: 0.4}}>起势 / 铺陈 / 收束</div>
          </div>

          <div style={{display: "grid", gridTemplateColumns: isVertical ? "1fr" : "1.12fr 0.88fr", gap: 18, flex: 1}}>
            <div style={{display: "flex", flexDirection: "column", gap: 14}}>
              <div
                style={{
                  minHeight: isVertical ? 300 : 260,
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  padding: isVertical ? 22 : 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{width: isVertical ? "74%" : "68%", height: 14, borderRadius: 999, background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.08))`}} />
                <div style={{display: "grid", gap: 12}}>
                  {[0.82, 0.64, 0.9].map((widthRatio, index) => (
                    <div
                      key={widthRatio}
                      style={{
                        width: `${widthRatio * 100}%`,
                        height: index === 0 ? 60 : 44,
                        borderRadius: 18,
                        background: index === 0
                          ? "linear-gradient(135deg, rgba(155,209,255,0.12), rgba(255,255,255,0.04))"
                          : "rgba(255,255,255,0.05)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
                {[
                  {accentColor: accent, label: "层次清楚"},
                  {accentColor: secondary, label: "动线克制"},
                ].map((item, index) => (
                  <div
                    key={item.label}
                    style={{
                      ...editorialCard(index === 0 ? "glass-ink" : "matte-paper", item.accentColor, {padding: 18, radius: 22}, designLanguage),
                      minHeight: 112,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{...baseText, fontSize: 13, color: item.accentColor, letterSpacing: 0.4}}>{item.label}</div>
                    <div style={{display: "grid", gap: 8}}>
                      <div style={{width: "74%", height: 12, borderRadius: 999, background: "rgba(255,255,255,0.14)"}} />
                      <div style={{width: "58%", height: 12, borderRadius: 999, background: "rgba(255,255,255,0.08)"}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display: "grid", gridTemplateRows: "repeat(3, 1fr)", gap: 12}}>
              {[
                {accentColor: accent, title: "先给信号"},
                {accentColor: secondary, title: "再定框架"},
                {accentColor: "#d6dde8", title: "收尾干净"},
              ].map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    ...editorialCard(index === 1 ? "glass-ink" : "matte-paper", item.accentColor, {padding: 18, radius: 20}, designLanguage),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transform: `translateX(${interpolate(detailEnter, [0, 1], [18 + index * 8, 0])}px)`,
                  }}
                >
                  <div style={{...baseText, fontSize: 14, color: item.accentColor, letterSpacing: 0.4}}>{item.title}</div>
                  <div style={{display: "grid", gap: 8}}>
                    <div style={{width: "82%", height: 12, borderRadius: 999, background: "rgba(255,255,255,0.14)"}} />
                    <div style={{width: "68%", height: 12, borderRadius: 999, background: "rgba(255,255,255,0.08)"}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: isVertical ? 40 : 72,
          top: isVertical ? 118 : 92,
          width: isVertical ? 160 : 190,
          ...editorialCard("glass-ink", secondary, {padding: 16, radius: 20}, designLanguage),
          opacity: detailEnter,
          transform: `translateY(${interpolate(detailEnter, [0, 1], [24, 0]) + drift}px)`,
        }}
      >
        <div style={{...baseText, fontSize: 13, color: secondary, letterSpacing: 0.4}}>人工节奏</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: isVertical ? 36 : 72,
          bottom: isVertical ? 124 : 88,
          width: isVertical ? 180 : 220,
          ...editorialCard("matte-paper", accent, {padding: 18, radius: 22}, designLanguage),
          opacity: detailEnter,
          transform: `translateY(${interpolate(detailEnter, [0, 1], [28, 0]) - drift}px)`,
        }}
      >
        <div style={{...baseText, fontSize: 14, color: "#e7eef9", lineHeight: 1.4}}>
          不靠假仪表盘和玻璃壳，先把节奏和层次立住。
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TechEffectOpener: React.FC<TechEffectOpenerProps> = ({designLanguage}) => {
  const resolvedDesignLanguage = designLanguage ?? "premium-tech-editorial";
  if (isUncodixifiedLanguage(resolvedDesignLanguage)) {
    return <EditorialTechEffectOpener designLanguage={resolvedDesignLanguage} />;
  }

  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const isVertical = height > width;
  const intro = spring({
    fps: 30,
    frame,
    config: {damping: 14, stiffness: 110, mass: 0.9},
  });
  const burst = interpolate(frame, [56, 72, durationInFrames - 1], [0, 1, 0.24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalPush = interpolate(frame, [0, durationInFrames - 1], [0.94, 1.1], {
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ambientNoise = 0.08 + Math.sin(frame * 0.1) * 0.03;
  const haloSize = isVertical ? 660 : 760;
  const flash = interpolate(frame, [66, 72, 82], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 50%, rgba(23,43,86,0.92) 0%, rgba(10,14,28,1) 44%, rgba(3,5,10,1) 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-8%",
          opacity: ambientNoise,
          mixBlendMode: "screen",
          background:
            "repeating-linear-gradient(120deg, rgba(255,255,255,0.08) 0 2px, rgba(255,255,255,0.0) 2px 18px), radial-gradient(circle at 20% 30%, rgba(112,244,255,0.1), rgba(0,0,0,0) 28%), radial-gradient(circle at 75% 70%, rgba(255,116,214,0.08), rgba(0,0,0,0) 24%)",
          filter: "blur(1px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${globalPush})`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: haloSize,
            height: haloSize,
            marginLeft: -haloSize / 2,
            marginTop: -haloSize / 2,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(121,232,255,0.28) 0%, rgba(121,232,255,0.12) 28%, rgba(0,0,0,0) 70%)",
            filter: "blur(34px)",
            opacity: 0.58 + burst * 0.26,
            transform: `scale(${interpolate(intro, [0, 1], [0.58, 1.06])})`,
          }}
        />

        <Ring radius={isVertical ? 164 : 220} stroke="#7de8ff" frame={frame} delay={0} rotationSpeed={0.45} thickness={4} glow="rgba(125,232,255,0.7)" />
        <Ring radius={isVertical ? 228 : 318} stroke="#66f2b6" frame={frame} delay={8} rotationSpeed={-0.28} thickness={3} glow="rgba(102,242,182,0.62)" />
        <Ring radius={isVertical ? 292 : 406} stroke="#ff9adf" frame={frame} delay={14} rotationSpeed={0.16} thickness={3} glow="rgba(255,154,223,0.56)" />

        <OrbitalPulse frame={frame} radius={isVertical ? 208 : 276} delay={4} size={isVertical ? 24 : 20} hue="#7de8ff" angularOffset={0.2} />
        <OrbitalPulse frame={frame} radius={isVertical ? 250 : 352} delay={10} size={isVertical ? 18 : 16} hue="#66f2b6" angularOffset={2.3} />
        <OrbitalPulse frame={frame} radius={isVertical ? 318 : 432} delay={16} size={isVertical ? 16 : 14} hue="#ff9adf" angularOffset={4.8} />

        <Shard frame={frame} delay={4} width={isVertical ? 170 : 220} height={isVertical ? 250 : 170} x={isVertical ? -220 : -340} y={isVertical ? -420 : -170} rotate={-18} tint="rgba(125,232,255,0.24)" />
        <Shard frame={frame} delay={10} width={isVertical ? 148 : 184} height={isVertical ? 220 : 150} x={isVertical ? 250 : 360} y={isVertical ? -260 : -140} rotate={12} tint="rgba(102,242,182,0.22)" />
        <Shard frame={frame} delay={16} width={isVertical ? 180 : 248} height={isVertical ? 118 : 142} x={isVertical ? -210 : -300} y={isVertical ? 330 : 190} rotate={8} tint="rgba(255,154,223,0.22)" />
        <Shard frame={frame} delay={22} width={isVertical ? 158 : 210} height={isVertical ? 128 : 130} x={isVertical ? 230 : 322} y={isVertical ? 432 : 220} rotate={-10} tint="rgba(125,232,255,0.18)" />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: isVertical ? 250 : 320,
            height: isVertical ? 250 : 320,
            marginLeft: isVertical ? -125 : -160,
            marginTop: isVertical ? -125 : -160,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.16)",
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(125,232,255,0.15) 24%, rgba(0,0,0,0) 70%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 0 48px rgba(125,232,255,0.22), inset 0 0 48px rgba(255,255,255,0.08)",
            transform: `scale(${interpolate(intro, [0, 1], [0.54, 1.06])}) rotate(${frame * 0.42}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "24%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.86) 0%, rgba(125,232,255,0.88) 26%, rgba(0,0,0,0) 74%)",
              filter: `blur(${interpolate(burst, [0, 1], [2, 0.2])}px)`,
              transform: `scale(${1 + burst * 0.26})`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 36%, rgba(0,0,0,0.5) 100%)",
          opacity: 0.7,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: flash,
          background: "linear-gradient(135deg, rgba(255,255,255,0) 16%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0) 82%)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
