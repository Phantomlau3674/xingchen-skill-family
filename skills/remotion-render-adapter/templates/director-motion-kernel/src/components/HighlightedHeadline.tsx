import React from "react";

export const HighlightedHeadline: React.FC<{
  text: string;
  highlights: string[];
  accent: string;
}> = ({text, highlights, accent}) => {
  const sorted = [...highlights].filter(Boolean).sort((left, right) => right.length - left.length);
  const parts: Array<{text: string; highlighted: boolean}> = [];
  let cursor = 0;
  while (cursor < text.length) {
    const match = sorted.find((item) => text.slice(cursor).startsWith(item));
    if (match) {
      parts.push({text: match, highlighted: true});
      cursor += match.length;
      continue;
    }
    parts.push({text: text[cursor], highlighted: false});
    cursor += 1;
  }

  return (
    <>
      {parts.map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          style={{
            color: part.highlighted ? accent : "#f4f7ff",
            textShadow: part.highlighted ? `0 0 20px ${accent}80` : "none",
          }}
        >
          {part.text}
        </span>
      ))}
    </>
  );
};
