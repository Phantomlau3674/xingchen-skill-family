import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/jetbrains-mono/600.css";

export const FONT_STACKS = {
  display: '"Space Grotesk", "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans SC", "Segoe UI", sans-serif',
  body: '"Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans SC", "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", "Cascadia Code", monospace',
};

export const EDITORIAL_TEXTURES = {
  grain: "radial-gradient(rgba(255,255,255,0.055) 0.7px, transparent 0.7px)",
  scanline: "repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)",
  topLight: "radial-gradient(circle at 50% -8%, rgba(255,255,255,0.16), transparent 55%)",
  sideLight: "radial-gradient(circle at 84% 22%, rgba(255,255,255,0.08), transparent 34%)",
  edgeFalloff: "radial-gradient(circle at center, transparent 42%, rgba(3,5,11,0.62) 100%)",
};

export const MATERIALS = {
  "screen-emissive": {
    panel: "linear-gradient(180deg, rgba(13,18,31,0.97), rgba(8,11,22,0.88))",
    border: "rgba(132,170,255,0.22)",
    shadow: "0 28px 80px rgba(0,0,0,0.54), 0 8px 30px rgba(121,232,255,0.08)",
  },
  "glass-ink": {
    panel: "linear-gradient(180deg, rgba(14,18,29,0.9), rgba(9,12,22,0.78))",
    border: "rgba(255,255,255,0.12)",
    shadow: "0 30px 82px rgba(0,0,0,0.58), 0 10px 32px rgba(255,255,255,0.03)",
  },
  "tactile-metal": {
    panel: "linear-gradient(165deg, rgba(35,27,26,0.96), rgba(20,16,18,0.9))",
    border: "rgba(255,194,163,0.24)",
    shadow: "0 30px 86px rgba(0,0,0,0.62), 0 8px 28px rgba(255,155,140,0.08)",
  },
  "matte-paper": {
    panel: "linear-gradient(180deg, rgba(21,21,27,0.96), rgba(12,12,18,0.88))",
    border: "rgba(255,255,255,0.09)",
    shadow: "0 24px 68px rgba(0,0,0,0.48), 0 8px 26px rgba(255,255,255,0.02)",
  },
} as const;
