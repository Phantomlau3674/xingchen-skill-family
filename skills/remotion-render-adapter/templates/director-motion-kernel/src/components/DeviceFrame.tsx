import React from "react";

const titleBar = (type: "terminal" | "browser" | "phone" | "vscode" | "none") => {
  if (type === "none") {
    return null;
  }
  if (type === "phone") {
    return (
      <div style={{height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f18"}}>
        <div style={{width: 72, height: 6, borderRadius: 999, background: "rgba(255,255,255,0.16)"}} />
      </div>
    );
  }
  const label = type === "vscode" ? "VS Code" : type === "terminal" ? "Terminal" : "Browser";
  return (
    <div style={{height: 34, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", background: "#11161f", borderBottom: "1px solid rgba(255,255,255,0.08)"}}>
      <div style={{width: 10, height: 10, borderRadius: "50%", background: "#ff5f57"}} />
      <div style={{width: 10, height: 10, borderRadius: "50%", background: "#febc2e"}} />
      <div style={{width: 10, height: 10, borderRadius: "50%", background: "#28c840"}} />
      <span style={{marginLeft: 8, fontSize: 14, color: "rgba(255,255,255,0.66)"}}>{label}</span>
    </div>
  );
};

export const DeviceFrame: React.FC<{
  type: "terminal" | "browser" | "phone" | "vscode" | "none";
  children: React.ReactNode;
}> = ({type, children}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: type === "phone" ? 28 : 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.42)",
        background: "#090e18",
      }}
    >
      {titleBar(type)}
      <div style={{position: "relative", width: "100%", height: type === "phone" ? "calc(100% - 28px)" : "calc(100% - 34px)"}}>{children}</div>
    </div>
  );
};
