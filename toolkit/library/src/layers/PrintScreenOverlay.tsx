import React from "react";
import { useAsset } from "../registry";

// TEX-006 PrintScreenOverlay (studied Chris Moran's moire short, 22 Nov 2026; analysis only): a faint print screen
// laid over a held full-frame still. The screen stays fixed to the frame while the picture drifts under it (MOT-001),
// so the still shimmers like a printed plate without anything visibly moving. Calm and legible: strength <= 0.15,
// cells >= 8 px at 1080p (finer screens turn to mush in YouTube's encoder). Not for text, diagrams or faces.
export const PrintScreenOverlay: React.FC<{ strength?: number; cell?: number; angle?: number; kind?: "dot" | "line"; id?: string }> = ({
  strength = 0.08,
  cell = 9,
  angle = 45,
  kind = "dot",
  id = "printscreen",
}) => {
  useAsset("TEX-006");
  if (strength > 0.15) throw new Error(`print screen ${strength} is above the calm limit (0.15).`);
  if (cell < 8) throw new Error(`print screen cell ${cell}px is below 8 px.`);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: strength, pointerEvents: "none" }}>
      <defs>
        <pattern id={id} width={cell} height={cell} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
          {kind === "dot" ? <circle cx={cell / 2} cy={cell / 2} r={cell * 0.34} fill="#141210" /> : <rect x={0} y={cell * 0.3} width={cell} height={cell * 0.4} fill="#141210" />}
        </pattern>
        <radialGradient id={`${id}-v`} cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#fff" stopOpacity={1} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0.6} />
        </radialGradient>
        <mask id={`${id}-m`}>
          <rect width={1920} height={1080} fill={`url(#${id}-v)`} />
        </mask>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id})`} mask={`url(#${id}-m)`} />
    </svg>
  );
};
