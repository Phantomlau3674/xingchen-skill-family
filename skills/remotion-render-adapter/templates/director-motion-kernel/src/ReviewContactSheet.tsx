import React from "react";
import {AbsoluteFill, Img} from "remotion";
import {type DirectorScene, type DirectorVideoProps} from "./directorData";
import {FONT_STACKS, MATERIALS} from "./theme";
import {resolveStatic} from "./shared";

const PREVIEW_BACKGROUNDS: Record<string, string> = {
  "atmospheric-grid": "radial-gradient(circle at 35% 28%, rgba(121,232,255,0.26), transparent 38%), linear-gradient(180deg, #07111e 0%, #0c1528 100%)",
  "studio-halo": "radial-gradient(circle at 50% 42%, rgba(102,242,182,0.22), transparent 36%), linear-gradient(180deg, #0c111f 0%, #101827 100%)",
  "proof-slate": "radial-gradient(circle at 64% 26%, rgba(255,154,223,0.18), transparent 34%), linear-gradient(180deg, #120f18 0%, #17141f 100%)",
  "contrast-vignette": "radial-gradient(circle at 50% 50%, rgba(255,216,125,0.10), transparent 34%), linear-gradient(180deg, #170f12 0%, #100a0d 100%)",
  "warm-resolve": "radial-gradient(circle at 50% 18%, rgba(255,155,140,0.2), transparent 32%), linear-gradient(180deg, #1a1111 0%, #120c0d 100%)",
};

const roleAccent = (role: string) => {
  switch (role) {
    case "establish":
      return "#79e8ff";
    case "focus":
      return "#66f2b6";
    case "proof":
      return "#ff9adf";
    case "contrast":
      return "#ffd87d";
    case "release":
      return "#ff9b8c";
    default:
      return "#79e8ff";
  }
};

const previewBackground = (scene: DirectorScene) => PREVIEW_BACKGROUNDS[scene.styleframe_tokens?.background_family ?? "studio-halo"] ?? PREVIEW_BACKGROUNDS["studio-halo"];

const PreviewScene: React.FC<{scene: DirectorScene}> = ({scene}) => {
  const accent = roleAccent(scene.editorial_role ?? "focus");
  const strategy = scene.visual_strategy;
  const assetFile = scene.asset_placements?.[0]?.file ? resolveStatic(scene.asset_placements[0].file) : null;
  const proofStyle = scene.proof_focus?.annotation_style ?? "proof";
  const anchor = scene.visual_anchor;
  const autoGenerate = (scene.auto_generate && typeof scene.auto_generate === "object" ? scene.auto_generate : {}) as {
    lines?: string[];
    value?: number;
    label?: string;
  };

  if (strategy === "screenshot" && assetFile) {
    return (
      <div
        style={{
          position: "relative",
          height: 180,
          borderRadius: 22,
          overflow: "hidden",
          background: "#0b1020",
          border: `1px solid ${accent}44`,
          boxShadow: MATERIALS["glass-ink"].shadow,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#10172a",
          }}
        >
          <Img src={assetFile} style={{width: "100%", height: "100%", objectFit: "cover"}} />
          <div
            style={{
              position: "absolute",
              left: "15%",
              top: "23%",
              width: "54%",
              height: "20%",
              border: `3px solid ${accent}`,
              borderRadius: 12,
              boxShadow: `0 0 24px ${accent}55`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 16,
              background: "rgba(0,0,0,0.72)",
              color: accent,
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            {proofStyle}
          </div>
        </div>
      </div>
    );
  }

  if (strategy === "auto-code") {
    const terminalLines = anchor?.type === "terminal" ? anchor.lines ?? [] : [];
    const generatedLines = Array.isArray(autoGenerate.lines) ? autoGenerate.lines : [];
    return (
      <div
        style={{
          height: 180,
          borderRadius: 22,
          background: "#0d1324",
          border: `1px solid ${accent}44`,
          boxShadow: MATERIALS["screen-emissive"].shadow,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          justifyContent: "center",
        }}
      >
        {[...terminalLines, ...generatedLines].slice(0, 3).map((line, index) => (
          <div key={`${line}-${index}`} style={{fontFamily: FONT_STACKS.mono, color: index === 0 ? accent : "#d4dcf2", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
            $ {line}
          </div>
        ))}
      </div>
    );
  }

  if (strategy === "auto-metric") {
    const value = Number(anchor?.type === "counter" ? anchor.value ?? 9 : autoGenerate.value ?? 9);
    const label = String(anchor?.type === "counter" ? anchor.label ?? "s" : autoGenerate.label ?? "s");
    return (
      <div
        style={{
          height: 180,
          borderRadius: 22,
          background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: `1px solid ${accent}44`,
          boxShadow: MATERIALS["tactile-metal"].shadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{fontFamily: FONT_STACKS.display, fontSize: 68, fontWeight: 700, color: accent, lineHeight: 1}}>{value}</div>
        <div style={{fontSize: 16, color: "#f4f7ff", marginTop: 6}}>{label}</div>
      </div>
    );
  }

  if (strategy === "auto-diagram") {
    if (assetFile) {
      return (
        <div
          style={{
            position: "relative",
            height: 180,
            borderRadius: 22,
            overflow: "hidden",
            border: `1px solid ${accent}44`,
            background: "#0b1020",
            boxShadow: MATERIALS["matte-paper"].shadow,
          }}
        >
          <Img src={assetFile} style={{width: "100%", height: "100%", objectFit: "contain", background: "#0a1020"}} />
        </div>
      );
    }
    const nodes = ["Narration", "Strategy", "Editorial", "Render"];
    return (
      <div
        style={{
          position: "relative",
          height: 180,
          borderRadius: 22,
          background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          border: `1px solid ${accent}44`,
          overflow: "hidden",
        }}
      >
        <div style={{position: "absolute", left: 24, right: 24, top: "50%", height: 4, marginTop: -2, background: "rgba(255,255,255,0.12)"}} />
        <div style={{display: "flex", justifyContent: "space-between", padding: "54px 18px 0"}}>
          {nodes.map((node) => (
            <div key={node} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
              <div style={{width: 18, height: 18, borderRadius: "50%", background: accent, boxShadow: `0 0 16px ${accent}`}} />
              <div style={{fontSize: 11, color: "#f4f7ff", maxWidth: 56, textAlign: "center"}}>{node}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: 180,
        borderRadius: 22,
        overflow: "hidden",
        border: `1px solid ${accent}44`,
        boxShadow: MATERIALS["screen-emissive"].shadow,
      }}
    >
      <div style={{position: "absolute", inset: 0, background: previewBackground(scene)}} />
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 36%, rgba(0,0,0,0.45) 100%)"}} />
      <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 14}}>
        <div style={{position: "relative", width: 120, height: 120}}>
          <div style={{position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${accent}55`}} />
          <div style={{position: "absolute", inset: 18, borderRadius: "50%", border: `1px solid ${accent}35`}} />
          <div style={{position: "absolute", left: 12, top: 50, width: 8, height: 8, borderRadius: "50%", background: accent}} />
          <div style={{position: "absolute", right: 22, top: 18, width: 8, height: 8, borderRadius: "50%", background: "#ffffff"}} />
          <div style={{position: "absolute", left: 56, bottom: 10, width: 8, height: 8, borderRadius: "50%", background: "#9fb4e8"}} />
        </div>
        <div style={{fontFamily: FONT_STACKS.display, fontSize: 24, fontWeight: 700, color: "#ffffff", textAlign: "center", maxWidth: "82%", lineHeight: 1.05}}>
          {scene.ppt_layer.headline}
        </div>
      </div>
    </div>
  );
};

const ContactCard: React.FC<{scene: DirectorScene}> = ({scene}) => {
  const accent = roleAccent(scene.editorial_role ?? "focus");
  return (
    <div
      style={{
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(180deg, rgba(12,16,28,0.98), rgba(8,10,18,0.92))",
        padding: 18,
        boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
      }}
    >
      <PreviewScene scene={scene} />
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16}}>
        <div style={{color: accent, fontSize: 13, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 700}}>{scene.editorial_role}</div>
        <div style={{color: "#9fb0d3", fontSize: 12}}>{scene.styleframe_tokens?.background_family}</div>
      </div>
      <div style={{color: "#ffffff", fontFamily: FONT_STACKS.display, fontSize: 22, fontWeight: 700, marginTop: 8}}>
        {scene.ppt_layer.headline}
      </div>
      <div style={{color: "#cad4e8", fontSize: 14, marginTop: 12}}>SFX: {(scene.sound_cues ?? []).join(", ") || "-"}</div>
      <div style={{color: "#cad4e8", fontSize: 14, marginTop: 6}}>Proof: {scene.proof_focus?.annotation_style ?? "-"}</div>
    </div>
  );
};

export const ReviewContactSheet: React.FC<DirectorVideoProps> = ({meta, scenes}) => {
  const cards = scenes.slice(0, 6);
  return (
    <AbsoluteFill style={{background: "#050810", padding: 40, fontFamily: FONT_STACKS.body}}>
      <div style={{color: "#f5f7ff", fontFamily: FONT_STACKS.display, fontSize: 52, fontWeight: 700}}>Premium Editorial Contact Sheet</div>
      <div style={{color: "#9fb0d3", fontSize: 22, marginTop: 10}}>{meta.topic}</div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 22, marginTop: 30}}>
        {cards.map((scene) => (
          <ContactCard key={scene.scene_id} scene={scene} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
