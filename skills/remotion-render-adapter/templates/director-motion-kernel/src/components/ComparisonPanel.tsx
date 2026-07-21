import React from "react";
import {interpolate, spring} from "remotion";
import {baseText, displayText, editorialCard} from "../shared";

export const ComparisonPanel: React.FC<{
  left: {
    label: string;
    items: string[];
    tone: "negative" | "neutral";
  };
  right: {
    label: string;
    items: string[];
    tone: "positive" | "neutral";
  };
  accent: string;
  frame: number;
  fps: number;
  designLanguage: string;
}> = ({left, right, accent, frame, fps, designLanguage}) => {
  const leftAccent = left.tone === "negative" ? "#ffd87d" : "#dbe4f5";
  const rightAccent = right.tone === "positive" ? accent : "#dbe4f5";
  const columns = [
    {key: "left", title: left.label, items: left.items, columnAccent: leftAccent},
    {key: "right", title: right.label, items: right.items, columnAccent: rightAccent},
  ];

  return (
    <div style={{width: "100%", display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 18, alignItems: "stretch"}}>
      {columns.map((column, columnIndex) => {
        const appear = spring({fps, frame: frame - columnIndex * 8, config: {damping: 18, stiffness: 120}});
        return (
          <React.Fragment key={column.key}>
            <div
              style={{
                ...editorialCard("glass-ink", column.columnAccent, {padding: 20, radius: 26}, designLanguage),
                opacity: appear,
                transform: `translateY(${interpolate(appear, [0, 1], [16, 0])}px)`,
                minHeight: 260,
              }}
            >
              <div style={{...displayText, ...baseText, color: column.columnAccent, fontSize: 24, fontWeight: 700}}>
                {column.title}
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 20}}>
                {column.items.slice(0, 4).map((item, itemIndex) => {
                  const itemAppear = spring({fps, frame: frame - columnIndex * 8 - itemIndex * 5, config: {damping: 20, stiffness: 130}});
                  return (
                    <div
                      key={`${column.key}-${itemIndex}`}
                      style={{
                        ...baseText,
                        ...editorialCard("matte-paper", column.columnAccent, {padding: 14, radius: 18}, designLanguage),
                        fontSize: 16,
                        lineHeight: 1.35,
                        opacity: itemAppear,
                        transform: `translateX(${interpolate(itemAppear, [0, 1], [columnIndex === 0 ? -14 : 14, 0])}px)`,
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
            {columnIndex === 0 ? (
              <div
                style={{
                  width: 1,
                  background: `linear-gradient(180deg, transparent 0%, ${accent}90 20%, ${accent}90 80%, transparent 100%)`,
                  opacity: 0.65,
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
