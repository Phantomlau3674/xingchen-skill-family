import React from "react";
import {interpolate, spring} from "remotion";

const displayFont = "\"Microsoft YaHei UI\", \"Microsoft YaHei\", \"PingFang SC\", \"Hiragino Sans GB\", \"Source Han Sans SC\", \"Noto Sans SC\", \"Space Grotesk\", \"Segoe UI\", sans-serif";
const monoFont = "\"JetBrains Mono\", \"Cascadia Code\", Consolas, monospace";

type BespokeVisualProps = {
  source: string;
  frame: number;
  fps: number;
  accent: string;
  ink: string;
  mute: string;
  surface: string;
  surfaceAlt: string;
};

const getVisualKey = (source: string) => {
  const normalized = source.replace(/\\/g, "/").split("/").pop()?.replace(/\.svg$/i, "").toLowerCase() ?? "";
  return normalized;
};

const wobble = (frame: number, fps: number, amplitude: number, speed: number, phase = 0) =>
  Math.sin(frame / Math.max(fps, 1) / speed + phase) * amplitude;

const breathe = (frame: number, fps: number, min: number, max: number, speed: number, phase = 0) => {
  const wave = Math.sin(frame / Math.max(fps, 1) / speed + phase);
  return min + ((wave + 1) / 2) * (max - min);
};

const softFloat = (frame: number, fps: number, amplitude: number, speed: number, phase = 0, delay = 0) =>
  wobble(frame, fps, amplitude, speed, phase) * appear(frame, fps, delay, 76);

const gentlePulse = (frame: number, fps: number, min: number, max: number, speed: number, phase = 0, delay = 0) => {
  const ramp = appear(frame, fps, delay, 74);
  const pulse = breathe(frame, fps, min, max, speed, phase);
  return 1 + (pulse - 1) * ramp;
};

const settlePop = (frame: number, fps: number, delay: number, from: number, peak: number, to = 1) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: {damping: 13, stiffness: 118, mass: 0.82},
  });
  return interpolate(progress, [0, 0.72, 1], [from, peak, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const appear = (frame: number, fps: number, delay: number, stiffness = 90) =>
  spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: {damping: 16, stiffness},
  });

const shellStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: 18,
  background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(245,238,229,0.98))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -32px 64px rgba(199,173,142,0.08)",
  textRendering: "geometricPrecision",
  WebkitFontSmoothing: "antialiased",
};

const labelStyle: React.CSSProperties = {
  position: "absolute",
  left: 34,
  top: 28,
  fontFamily: displayFont,
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: 2,
};

const nodeCard = (borderColor: string, tone: string): React.CSSProperties => ({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  width: 190,
  height: 190,
  borderRadius: 999,
  background: tone,
  border: `5px solid ${borderColor}`,
  boxShadow: "0 24px 42px rgba(33,25,20,0.12)",
});

const miniLineStyle: React.CSSProperties = {
  fontFamily: displayFont,
  fontSize: 22,
  lineHeight: 1.25,
};

const HumanAgentLoopVisual: React.FC<BespokeVisualProps> = ({frame, fps}) => {
  const loopReveal = appear(frame, fps, 0, 82);
  const leftReveal = appear(frame, fps, 4);
  const rightReveal = appear(frame, fps, 9);
  const baseReveal = appear(frame, fps, 15);
  const badgeReveal = appear(frame, fps, 20, 74);
  const badgeFloat = softFloat(frame, fps, 3, 2.4, 0.4, 20);
  const leftFloat = softFloat(frame, fps, 2, 2.8, 0.2, 8);
  const rightFloat = softFloat(frame, fps, 2.4, 2.6, 1.1, 12);
  const baseFloat = softFloat(frame, fps, 1.8, 3.0, 0.6, 16);
  const badgeScale = gentlePulse(frame, fps, 0.985, 1.018, 2.2, 0.2, 20);
  const leftScale = settlePop(frame, fps, 4, 0.92, 1.02);
  const rightScale = settlePop(frame, fps, 9, 0.92, 1.02);
  const baseScale = settlePop(frame, fps, 15, 0.93, 1.018);

  return (
    <div style={shellStyle}>
      <div style={{...labelStyle, color: "#a24331"}}>协作闭环</div>
      <div
        style={{
          position: "absolute",
          inset: 36,
          borderRadius: 28,
          border: "2px solid #dbcbbb",
          background: "radial-gradient(circle at 50% 38%, rgba(241,226,205,0.88), rgba(250,246,239,0.98) 72%)",
        }}
      />
      <svg viewBox="0 0 1000 820" style={{position: "absolute", inset: 44, width: "calc(100% - 88px)", height: "calc(100% - 88px)"}}>
        <path
          d="M255 236C345 152 655 152 745 236"
          fill="none"
          stroke="url(#loop-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="520"
          strokeDashoffset={(1 - loopReveal) * 520}
        />
        <path
          d="M218 378C196 548 286 690 448 744"
          fill="none"
          stroke="url(#loop-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="460"
          strokeDashoffset={(1 - loopReveal) * 460}
        />
        <path
          d="M782 378C804 548 714 690 552 744"
          fill="none"
          stroke="url(#loop-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="460"
          strokeDashoffset={(1 - loopReveal) * 460}
        />
        <defs>
          <linearGradient id="loop-grad" x1="210" y1="210" x2="790" y2="640" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c34e38" />
            <stop offset="0.55" stopColor="#916652" />
            <stop offset="1" stopColor="#4c657b" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          ...nodeCard("#c34e38", "#fff8f1"),
          left: 124,
          top: 184,
          transform: `translateY(${(1 - leftReveal) * 14 + leftFloat}px) scale(${leftScale})`,
          opacity: leftReveal,
        }}
      >
        <div style={{fontFamily: displayFont, fontSize: 48, fontWeight: 700, color: "#17120f"}}>人</div>
        <div style={{...miniLineStyle, marginTop: 16, color: "#6f5947"}}>判断 / 目标</div>
        <div style={{...miniLineStyle, color: "#6f5947"}}>方向 / 取舍</div>
      </div>
      <div
        style={{
          ...nodeCard("#4c657b", "#f9fbfd"),
          right: 124,
          top: 184,
          transform: `translateY(${(1 - rightReveal) * 14 + rightFloat}px) scale(${rightScale})`,
          opacity: rightReveal,
        }}
      >
        <div style={{fontFamily: displayFont, fontSize: 48, fontWeight: 700, color: "#17120f"}}>智能体</div>
        <div style={{...miniLineStyle, marginTop: 16, color: "#51697e"}}>拆解 / 执行</div>
        <div style={{...miniLineStyle, color: "#51697e"}}>整理 / 更新</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 112,
          width: 400,
          height: 132,
          marginLeft: -200,
          borderRadius: 32,
          background: "#f4ece3",
          border: "4px solid #7b6758",
          boxShadow: "0 20px 36px rgba(33,25,20,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${(1 - baseReveal) * 14 + baseFloat}px) scale(${baseScale})`,
          opacity: baseReveal,
        }}
      >
        <div style={{fontFamily: displayFont, fontSize: 44, fontWeight: 700, color: "#17120f"}}>工作空间</div>
        <div style={{fontFamily: displayFont, fontSize: 26, color: "#6f5947", marginTop: 10}}>上下文 / 记忆 / 资产</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 114 + badgeFloat,
          width: 86,
          height: 86,
          marginLeft: -43,
          borderRadius: 999,
          background: "#17120f",
          color: "#f7f0e7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: displayFont,
          fontSize: 22,
          lineHeight: 1.05,
          transform: `scale(${settlePop(frame, fps, 20, 0.9, 1.05) * badgeScale})`,
          opacity: badgeReveal,
        }}
      >
        <div>长期</div>
        <div>协作</div>
      </div>
    </div>
  );
};

const PmContextWebVisual: React.FC<BespokeVisualProps> = ({frame, fps}) => {
  const coreReveal = appear(frame, fps, 0, 80);
  const nodes = [
    {label: "产品规划", subline: "过去的判断", left: 408, top: 76, border: "#c34e38", tone: "#fff8f1", delay: 4},
    {label: "竞品研究", subline: "过去的观察", left: 706, top: 218, border: "#4c657b", tone: "#f8fbfd", delay: 8},
    {label: "需求管理", subline: "基线 / 变更", left: 706, top: 494, border: "#c34e38", tone: "#fff8f1", delay: 12},
    {label: "项目推进", subline: "节奏 / 状态", left: 110, top: 494, border: "#4c657b", tone: "#f8fbfd", delay: 16},
    {label: "发布复盘", subline: "结果回流", left: 110, top: 218, border: "#c34e38", tone: "#fff8f1", delay: 20},
  ];
  const lineReveal = appear(frame, fps, 0, 72);
  const coreGlow = gentlePulse(frame, fps, 1.02, 1.12, 2.5, 0.3, 6);
  const corePop = settlePop(frame, fps, 0, 0.92, 1.03);

  return (
    <div style={shellStyle}>
      <div style={{...labelStyle, color: "#425069"}}>PM 上下文网</div>
      <svg viewBox="0 0 1000 820" style={{position: "absolute", inset: 44, width: "calc(100% - 88px)", height: "calc(100% - 88px)"}}>
        {nodes.map((node, index) => {
          const cx = node.left + 92;
          const cy = node.top + 92;
          return (
            <line
              key={node.label}
              x1="500"
              y1="410"
              x2={cx}
              y2={cy}
              stroke={index % 2 === 0 ? "#cfb8a7" : "#c5d2df"}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="360"
              strokeDashoffset={(1 - lineReveal) * 360 + index * 18}
            />
          );
        })}
        {nodes.map((node, index) => {
          const cx = node.left + 92;
          const cy = node.top + 92;
          const travel = (Math.sin(frame / Math.max(fps, 1) / 1.55 + index * 0.75) + 1) / 2;
          const dotX = 500 + (cx - 500) * travel;
          const dotY = 410 + (cy - 410) * travel;
          return (
            <circle
              key={`${node.label}-pulse`}
              cx={dotX}
              cy={dotY}
              r="6"
              fill={index % 2 === 0 ? "#c34e38" : "#4c657b"}
              opacity={0.12 + lineReveal * 0.44}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 248,
          height: 248,
          marginLeft: -124,
          marginTop: -124,
          borderRadius: 999,
          background: "#1b1713",
          border: "5px solid #d96a54",
          boxShadow: `0 28px 48px rgba(28,22,17,0.28), 0 0 0 14px rgba(217,106,84,${0.16 * coreGlow})`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${softFloat(frame, fps, 1.6, 3.1, 0.4, 10)}px) scale(${corePop})`,
        }}
      >
        <div style={{fontFamily: displayFont, fontSize: 54, fontWeight: 700, color: "#f7f0e8"}}>PM OS</div>
        <div style={{fontFamily: displayFont, fontSize: 26, color: "#d9ccc0", marginTop: 14}}>上下文越积越强</div>
      </div>
      {nodes.map((node) => {
        const nodeReveal = appear(frame, fps, node.delay);
        const nodeFloat = softFloat(frame, fps, 1.4, 3.4, node.delay * 0.25, node.delay + 4);
        const nodeScale = settlePop(frame, fps, node.delay, 0.93, 1.016);
        return (
          <div
            key={node.label}
            style={{
              ...nodeCard(node.border, node.tone),
              left: node.left,
              top: node.top,
              width: 184,
              height: 176,
              transform: `translateY(${(1 - nodeReveal) * 12 + nodeFloat}px) scale(${nodeScale})`,
              opacity: nodeReveal,
            }}
          >
            <div style={{fontFamily: displayFont, fontSize: 34, fontWeight: 700, color: "#17120f"}}>{node.label}</div>
            <div style={{fontFamily: displayFont, fontSize: 22, color: "#6b5848", marginTop: 14}}>{node.subline}</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 144,
          right: 144,
          bottom: 44,
          height: 74,
          borderRadius: 28,
          border: "3px solid #dbcbbb",
          background: "rgba(255,250,245,0.88)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: displayFont,
          fontSize: 24,
          color: "#5f5246",
        }}
      >
        产品经理不是一次性输出，而是持续吃上下文的工作
      </div>
    </div>
  );
};

const UpkeepShiftVisual: React.FC<BespokeVisualProps> = ({frame, fps}) => {
  const dividerShift = wobble(frame, fps, 6, 1.1);
  const leftItems = ["自己整理", "自己更新", "自己连接", "最后做不下去"];
  const rightItems = ["上下文被持续维护", "历史判断能回流", "后续输出更自然"];
  const arrowReveal = appear(frame, fps, 14);

  return (
    <div style={shellStyle}>
      <div style={{...labelStyle, color: "#a24331"}}>维护负担转移</div>
      <div style={{position: "absolute", left: "50%", top: 92, bottom: 92, width: 2, background: "#d9c8b7", opacity: 0.8, transform: `translateX(${dividerShift}px)`}} />
      <div style={{position: "absolute", left: 106, top: 98, fontFamily: displayFont, fontSize: 38, fontWeight: 700, color: "#17120f"}}>以前</div>
      <div style={{position: "absolute", right: 136, top: 98, fontFamily: displayFont, fontSize: 38, fontWeight: 700, color: "#17120f"}}>现在</div>
      {leftItems.map((item, index) => {
        const reveal = appear(frame, fps, index * 4);
        const drift = softFloat(frame, fps, 1.4, 3.6, index * 0.45, 12 + index * 2);
        const pop = settlePop(frame, fps, index * 4, 0.94, 1.016);
        return (
          <div
            key={item}
            style={{
              position: "absolute",
              left: 88 + (index % 2) * 24,
              top: 176 + index * 124,
              width: 334,
              height: 104,
              borderRadius: 30,
              border: "4px solid #b44a36",
              background: "#fff7ee",
              boxShadow: "0 16px 28px rgba(180,74,54,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: displayFont,
              fontSize: 34,
              fontWeight: 700,
              color: "#17120f",
              transform: `translateY(${(1 - reveal) * 12 + drift}px) rotate(${index % 2 === 0 ? -1.4 : 1.4}deg) scale(${pop})`,
              opacity: 0.56 + reveal * 0.44,
            }}
          >
            {item}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 382,
          width: 122,
          marginLeft: -61,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          opacity: arrowReveal,
          transform: `translateX(${(1 - arrowReveal) * -14}px)`,
        }}
      >
        <div style={{width: 68, borderTop: "8px solid #4b687e", borderRadius: 999}} />
        <div style={{width: 0, height: 0, borderTop: "16px solid transparent", borderBottom: "16px solid transparent", borderLeft: "22px solid #4b687e"}} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 94,
          top: 158,
          width: 338,
          height: 150,
          borderRadius: 36,
          border: "4px solid #4b687e",
          background: "#f7fbfd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 18px 32px rgba(52,71,92,0.12)",
          transform: `translateY(${(1 - appear(frame, fps, 12)) * 12 + softFloat(frame, fps, 1.1, 3.4, 0.2, 16)}px) scale(${settlePop(frame, fps, 12, 0.95, 1.014)})`,
          opacity: appear(frame, fps, 12),
        }}
      >
        <div style={{fontFamily: displayFont, fontSize: 36, fontWeight: 700, color: "#17120f"}}>智能体接手维护</div>
        <div style={{fontFamily: displayFont, fontSize: 26, color: "#587287", marginTop: 12}}>整理 / 更新 / 连接</div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 94,
          top: 356,
          width: 338,
          borderRadius: 40,
          border: "4px solid #7b695a",
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 22px 36px rgba(33,25,20,0.12)",
          padding: "32px 28px",
          boxSizing: "border-box",
          transform: `translateY(${(1 - appear(frame, fps, 18)) * 12 + softFloat(frame, fps, 1.1, 3.8, 0.7, 22)}px) scale(${settlePop(frame, fps, 18, 0.96, 1.012)})`,
          opacity: appear(frame, fps, 18),
        }}
      >
        <div style={{fontFamily: displayFont, fontSize: 36, fontWeight: 700, color: "#17120f", marginBottom: 24}}>知识库开始自己变厚</div>
        {rightItems.map((item, index) => (
          <div
            key={item}
            style={{
              marginTop: index === 0 ? 0 : 14,
              borderRadius: 20,
              background: "#f4ece2",
              padding: "18px 20px",
              fontFamily: displayFont,
              fontSize: 24,
              color: "#5b4d41",
              transform: `translateX(${(1 - appear(frame, fps, 22 + index * 4)) * 24}px)`,
              opacity: appear(frame, fps, 22 + index * 4),
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const PmOperatingLogicVisual: React.FC<BespokeVisualProps> = ({frame, fps}) => {
  const cards = [
    {
      index: 1,
      title: "先判断 工作模式",
      tone: "#fff9f2",
      border: "#cebfae",
      badge: "#b24432",
      pills: ["初始化建档", "日常执行", "系统维护"],
    },
    {
      index: 2,
      title: "再判断 模块 / 输出",
      tone: "#f8fbfd",
      border: "#cebfae",
      badge: "#4c657b",
      pills: ["策略", "竞品", "需求", "推进"],
    },
    {
      index: 3,
      title: "最后拆开证据层级",
      tone: "#fff9f2",
      border: "#cebfae",
      badge: "#b24432",
      pills: ["直接证据", "工作假设", "判断建议"],
    },
  ];

  return (
    <div style={shellStyle}>
      <div style={{...labelStyle, color: "#425069"}}>判断路径</div>
      {cards.map((card, index) => {
        const reveal = appear(frame, fps, index * 7);
        const drift = softFloat(frame, fps, 1.1, 4.0, index * 0.35, 20 + index * 2);
        const cardScale = settlePop(frame, fps, index * 7, 0.95, 1.014);
        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: 92,
              right: 92,
              top: 124 + index * 194,
              minHeight: index === 2 ? 232 : 164,
              borderRadius: 34,
              border: `4px solid ${card.border}`,
              background: card.tone,
              padding: "24px 28px 22px 92px",
              boxSizing: "border-box",
              boxShadow: index === 1 ? "0 26px 40px rgba(66,80,105,0.08)" : "0 18px 32px rgba(33,25,20,0.08)",
              transform: `translateY(${(1 - reveal) * 12 + drift}px) scale(${cardScale})`,
              opacity: reveal,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 18,
                width: 52,
                height: 52,
                borderRadius: 999,
                background: card.badge,
                color: "#f8f1e9",
                fontFamily: monoFont,
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.index}
            </div>
            <div style={{fontFamily: displayFont, fontSize: 34, fontWeight: 700, color: "#17120f"}}>{card.title}</div>
            <div style={{display: "flex", gap: 14, flexWrap: "wrap", marginTop: 22}}>
              {card.pills.map((pill, pillIndex) => {
                const pillReveal = appear(frame, fps, index * 7 + 4 + pillIndex * 2);
                const pillScale = settlePop(frame, fps, index * 7 + 4 + pillIndex * 2, 0.94, 1.016);
                const pillTone = card.index === 1 ? "#f7e7e0" : card.index === 2 ? "#e8f0f6" : "#ffffff";
                const pillBorder = card.index === 3 ? ["#b24432", "#b48d32", "#4c657b"][pillIndex] : "transparent";
                return (
                  <div
                    key={pill}
                    style={{
                      padding: card.index === 3 ? "16px 18px" : "14px 18px",
                      minWidth: card.index === 3 ? 168 : 140,
                      borderRadius: 20,
                      background: pillTone,
                      border: card.index === 3 ? `3px solid ${pillBorder}` : "none",
                      color: card.index === 1 ? "#7c3d2e" : card.index === 2 ? "#466277" : pillBorder,
                      fontFamily: displayFont,
                      fontSize: card.index === 3 ? 24 : 24,
                      fontWeight: card.index === 3 ? 700 : 500,
                      textAlign: "center",
                      transform: `translateY(${(1 - pillReveal) * 8}px) scale(${pillScale})`,
                      opacity: pillReveal,
                    }}
                  >
                    {pill}
                    {card.index === 3 ? (
                      <div style={{fontFamily: displayFont, fontSize: 16, fontWeight: 400, color: "#6b5c4f", marginTop: 8}}>
                        {pillIndex === 0
                          ? "能证明的就写能证明的"
                          : pillIndex === 1
                            ? "推测必须显式标注"
                            : "判断要和证据脱钩"}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MessyInputRouteVisual: React.FC<BespokeVisualProps> = ({frame, fps}) => {
  const chips = ["需求", "竞品", "推进", "判断"];
  const outputs = ["research-brief.md", "requirement.md", "delivery-tracker.md"];
  const outputLineWidths = [
    [124, 154, 110],
    [146, 118, 158],
    [134, 160, 122],
  ];

  return (
    <div style={shellStyle}>
      <div style={{...labelStyle, color: "#a24331"}}>现场演示桥</div>
      {chips.map((chip, index) => {
        const reveal = appear(frame, fps, index * 3);
        const rotations = [-6, 4, -3, 7];
        const chipFloat = softFloat(frame, fps, 1.2, 3.5, index * 0.4, 10 + index * 2);
        const chipScale = settlePop(frame, fps, index * 3, 0.94, 1.018);
        return (
          <div
            key={chip}
            style={{
              position: "absolute",
              left: 54 + (index % 2) * 18,
              top: 170 + index * 108,
              width: 210,
              height: 72,
              borderRadius: 22,
              background: "#fff8f0",
              border: "4px solid #b44534",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: displayFont,
              fontSize: 32,
              fontWeight: 700,
              color: "#17120f",
              transform: `translateX(${(1 - reveal) * -18}px) translateY(${chipFloat}px) rotate(${rotations[index] * 0.5}deg) scale(${chipScale})`,
              opacity: reveal,
            }}
          >
            {chip}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 292,
          top: 356,
          width: 188,
          borderTop: "8px solid #bca99a",
          transform: `scaleX(${appear(frame, fps, 10)})`,
          transformOrigin: "left center",
        }}
      />
      <div style={{position: "absolute", left: 458, top: 340, width: 0, height: 0, borderTop: "20px solid transparent", borderBottom: "20px solid transparent", borderLeft: "28px solid #bca99a", opacity: appear(frame, fps, 10)}} />
      <div
        style={{
          position: "absolute",
          left: 496,
          top: 266,
          width: 224,
          height: 284,
          borderRadius: 34,
          background: "#1c1713",
          boxShadow: "0 28px 44px rgba(28,23,19,0.24)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 42,
          boxSizing: "border-box",
          transform: `translateY(${(1 - appear(frame, fps, 12)) * 12 + softFloat(frame, fps, 1.0, 4.2, 0.3, 18)}px) scale(${settlePop(frame, fps, 12, 0.95, 1.015)})`,
          opacity: appear(frame, fps, 12),
        }}
      >
        <div style={{fontFamily: displayFont, fontSize: 40, fontWeight: 700, color: "#f5eee6"}}>Router</div>
        {["分类", "路由", "定形"].map((step, index) => {
          const barReveal = appear(frame, fps, 16 + index * 3);
          const colors = ["#b44534", "#4c657b", "#7b6757"];
          return (
            <div
              key={step}
              style={{
                width: 132,
                height: 50,
                borderRadius: 18,
                background: colors[index],
                color: "#f8f1e9",
                fontFamily: displayFont,
                fontSize: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 18,
                transform: `scale(${settlePop(frame, fps, 16 + index * 3, 0.94, 1.018)})`,
                opacity: 0.72 + barReveal * 0.28,
              }}
            >
              {step}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 744,
          top: 356,
          width: 188,
          borderTop: "8px solid #bca99a",
          transform: `scaleX(${appear(frame, fps, 20)})`,
          transformOrigin: "left center",
        }}
      />
      <div style={{position: "absolute", left: 910, top: 340, width: 0, height: 0, borderTop: "20px solid transparent", borderBottom: "20px solid transparent", borderLeft: "28px solid #bca99a", opacity: appear(frame, fps, 20)}} />
      {outputs.map((output, index) => {
        const reveal = appear(frame, fps, 24 + index * 4);
        const borders = ["#4c657b", "#b44534", "#7b6757"];
        return (
          <div
            key={output}
            style={{
              position: "absolute",
              left: 724,
              top: 176 + index * 158,
              width: 220,
              height: 120,
              borderRadius: 28,
              background: "#ffffff",
              border: `4px solid ${borders[index]}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
              padding: "16px 18px 14px",
              boxSizing: "border-box",
              color: "#17120f",
              boxShadow: "0 14px 22px rgba(33,25,20,0.08)",
               transform: `translateX(${(1 - reveal) * 18}px) translateY(${softFloat(frame, fps, 0.9, 4.6, index * 0.45, 28)}px) scale(${settlePop(frame, fps, 24 + index * 4, 0.95, 1.014)})`,
               opacity: reveal,
             }}
          >
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <div style={{width: 10, height: 10, borderRadius: 999, background: borders[index]}} />
              <div style={{fontFamily: monoFont, fontSize: 18, fontWeight: 700, color: "#17120f"}}>{output}</div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: 10, marginTop: 18}}>
              {outputLineWidths[index].map((lineWidth, lineIndex) => {
                const lineReveal = appear(frame, fps, 28 + index * 4 + lineIndex * 2);
                return (
                  <div
                    key={`${output}-${lineWidth}`}
                    style={{
                      width: lineWidth,
                      height: 12,
                      borderRadius: 999,
                      background: `${borders[index]}1a`,
                      transform: `scaleX(${0.84 + lineReveal * 0.16})`,
                      transformOrigin: "left center",
                      opacity: 0.42 + lineReveal * 0.58,
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{position: "absolute", left: 56, bottom: 54, fontFamily: monoFont, fontSize: 20, color: "#7a6859"}}>messy spoken input</div>
      <div style={{position: "absolute", right: 54, bottom: 54, fontFamily: monoFont, fontSize: 20, color: "#7a6859"}}>durable markdown assets</div>
    </div>
  );
};

export const renderBespokeVisualAsset = (props: BespokeVisualProps) => {
  switch (getVisualKey(props.source)) {
    case "human-agent-loop":
      return <HumanAgentLoopVisual {...props} />;
    case "pm-context-web":
      return <PmContextWebVisual {...props} />;
    case "upkeep-shift":
      return <UpkeepShiftVisual {...props} />;
    case "pm-operating-logic":
      return <PmOperatingLogicVisual {...props} />;
    case "messy-input-route":
      return <MessyInputRouteVisual {...props} />;
    default:
      return null;
  }
};
