import type {RenderPlanLayer, RenderPlanScene} from "./renderPlanData";

export type SceneLayout = "manifesto" | "proof-sheet" | "closing-argument" | "briefing";

export type ScenePalette = {
  stage: string;
  ink: string;
  accent: string;
  surface: string;
  surfaceAlt: string;
  rule: string;
  mute: string;
};

export type SceneDesign = {
  layout: SceneLayout;
  palette: ScenePalette;
  metaLabel: string;
  counter: string;
  headlineLines: string[];
  supportText: string;
  emphasis: string[];
  cjkHeavy: boolean;
};

export type StageMetrics = {
  paddingTop: number;
  paddingBottom: number;
  paddingX: number;
  maxWidth: number;
  alignY: "start" | "center";
};

export type CenteredCardMetrics = {
  headlineSize: number;
  cardPadding: number;
  cardRadius: number;
  cardMaxWidth: number;
};

export type BackdropMetrics = {
  showGrid: boolean;
  showFrameLines: boolean;
  showCounter: boolean;
};

const MANIFESTO: ScenePalette = {
  stage: "#12100e",
  ink: "#f3eee6",
  accent: "#b24331",
  surface: "#1c1713",
  surfaceAlt: "#221d18",
  rule: "rgba(243, 238, 230, 0.16)",
  mute: "rgba(243, 238, 230, 0.62)",
};

const PROOF: ScenePalette = {
  stage: "#f3eee6",
  ink: "#171411",
  accent: "#a33f2f",
  surface: "#ece5db",
  surfaceAlt: "#e3dbcf",
  rule: "rgba(23, 20, 17, 0.12)",
  mute: "rgba(23, 20, 17, 0.62)",
};

const CLOSING: ScenePalette = {
  stage: "#291612",
  ink: "#f7f0e8",
  accent: "#d4624f",
  surface: "#341c16",
  surfaceAlt: "#43231c",
  rule: "rgba(247, 240, 232, 0.16)",
  mute: "rgba(247, 240, 232, 0.64)",
};

const BRIEFING: ScenePalette = {
  stage: "#ede7dd",
  ink: "#15120f",
  accent: "#425069",
  surface: "#e4ddd2",
  surfaceAlt: "#dbd2c5",
  rule: "rgba(21, 18, 15, 0.10)",
  mute: "rgba(21, 18, 15, 0.55)",
};

export const getStageMetrics = (layout: SceneLayout, vertical: boolean): StageMetrics => {
  if (vertical) {
    if (layout === "proof-sheet") {
      return {
        paddingTop: 92,
        paddingBottom: 330,
        paddingX: 56,
        maxWidth: 920,
        alignY: "start",
      };
    }
    return {
      paddingTop: 128,
      paddingBottom: 340,
      paddingX: 58,
      maxWidth: 900,
      alignY: "center",
    };
  }

  if (layout === "proof-sheet") {
    return {
      paddingTop: 72,
      paddingBottom: 148,
      paddingX: 84,
      maxWidth: 1480,
      alignY: "start",
    };
  }

  return {
    paddingTop: 82,
    paddingBottom: 154,
    paddingX: 92,
    maxWidth: 1520,
    alignY: "center",
  };
};

export const getCenteredCardMetrics = (
  layout: SceneLayout,
  vertical: boolean,
  cjkHeavy: boolean,
): CenteredCardMetrics => {
  if (vertical) {
    return {
      headlineSize: cjkHeavy ? (layout === "manifesto" ? 86 : 78) : 92,
      cardPadding: 36,
      cardRadius: 12,
      cardMaxWidth: layout === "manifesto" ? 840 : 800,
    };
  }

  return {
    headlineSize: cjkHeavy ? 60 : 72,
    cardPadding: 28,
    cardRadius: 12,
    cardMaxWidth: 980,
  };
};

export const getBackdropMetrics = (variant: string, vertical: boolean): BackdropMetrics => {
  if (vertical) {
    if (variant === "chart-card") {
      return {
        showGrid: true,
        showFrameLines: false,
        showCounter: false,
      };
    }

    if (variant === "infographic-card") {
      return {
        showGrid: false,
        showFrameLines: true,
        showCounter: false,
      };
    }

    return {
      showGrid: false,
      showFrameLines: false,
      showCounter: false,
    };
  }

  return {
    showGrid: variant !== "paper-card",
    showFrameLines: variant !== "paper-card",
    showCounter: true,
  };
};

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const CJK_CHAR = /[\u3400-\u9fff]/;
const ASCII_WORD = /^[A-Za-z0-9_-]+$/;
const PUNCTUATION = /^[，。！？；：、,.!?;:]$/;

const extractEmphasis = (scene: RenderPlanScene): string[] => {
  for (const layer of scene.layers) {
    const styleWords = (layer.style?.emphasis_words ?? []) as unknown[];
    const words = styleWords.map((item) => clean(String(item))).filter(Boolean);
    if (words.length > 0) {
      return words;
    }
  }
  return [];
};

const weightedLength = (value: string) => {
  let total = 0;
  for (const char of value) {
    if (CJK_CHAR.test(char)) {
      total += 1;
    } else if (ASCII_WORD.test(char)) {
      total += 0.58;
    } else if (PUNCTUATION.test(char)) {
      total += 0.28;
    } else {
      total += 0.5;
    }
  }
  return total;
};

const tokenizeHeadline = (headline: string) => clean(headline).match(/[A-Za-z0-9_-]+|[\u3400-\u9fff]|[^\s]/g) ?? [];

const isCjkHeavy = (headline: string) => {
  const cleaned = clean(headline);
  const cjkCount = [...cleaned].filter((char) => CJK_CHAR.test(char)).length;
  return cjkCount >= Math.max(4, cleaned.length * 0.25);
};

export const splitHeadline = (headline: string, targetChars = 24): string[] => {
  const explicitLines = headline
    .split(/\n+/)
    .map((line) => clean(line))
    .filter(Boolean);
  if (explicitLines.length > 1) {
    return explicitLines;
  }

  const cleaned = clean(headline);
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  if (isCjkHeavy(cleaned)) {
    const tokens = tokenizeHeadline(cleaned);
    const lines: string[] = [];
    let current = "";

    for (const token of tokens) {
      const next = `${current}${token}`;
      const threshold = PUNCTUATION.test(token) ? targetChars * 0.72 : targetChars;
      if (current && weightedLength(next) > threshold) {
        lines.push(current);
        current = token;
      } else {
        current = next;
      }

      if (current && PUNCTUATION.test(token) && weightedLength(current) >= targetChars * 0.66) {
        lines.push(current);
        current = "";
      }
    }

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= targetChars || current.length === 0) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

export const findPrimaryImageLayer = (scene: RenderPlanScene): RenderPlanLayer | null => {
  return scene.layers.find((layer) => layer.kind === "image" && layer.asset?.source) ?? null;
};

export const deriveSceneDesign = (scene: RenderPlanScene, index: number, totalScenes: number): SceneDesign => {
  const emphasis = extractEmphasis(scene);
  const counter = String(index + 1).padStart(2, "0");

  if (scene.scene_id === "hook" || index === 0) {
    const cjkHeavy = isCjkHeavy(scene.headline);
    return {
      layout: "manifesto",
      palette: MANIFESTO,
      metaLabel: "opening",
      counter,
      headlineLines: splitHeadline(scene.headline, cjkHeavy ? 9 : 18),
      supportText: scene.intent,
      emphasis,
      cjkHeavy,
    };
  }

  if (scene.scene_id === "close" || index === totalScenes - 1) {
    const cjkHeavy = isCjkHeavy(scene.headline);
    return {
      layout: "closing-argument",
      palette: CLOSING,
      metaLabel: "takeaway",
      counter,
      headlineLines: splitHeadline(scene.headline, cjkHeavy ? 10 : 20),
      supportText: scene.intent,
      emphasis,
      cjkHeavy,
    };
  }

  if (scene.proof_required || scene.proof_annotations.length > 0) {
    const proofHeadline = clean(scene.intent) || scene.headline;
    const cjkHeavy = isCjkHeavy(proofHeadline);
    return {
      layout: "proof-sheet",
      palette: PROOF,
      metaLabel: "evidence",
      counter,
      headlineLines: splitHeadline(proofHeadline, cjkHeavy ? 11 : 24),
      supportText: scene.headline,
      emphasis,
      cjkHeavy,
    };
  }

  const cjkHeavy = isCjkHeavy(scene.headline);
  return {
    layout: "briefing",
    palette: BRIEFING,
    metaLabel: "briefing",
    counter,
    headlineLines: splitHeadline(scene.headline, cjkHeavy ? 11 : 24),
    supportText: scene.intent,
    emphasis,
    cjkHeavy,
  };
};
