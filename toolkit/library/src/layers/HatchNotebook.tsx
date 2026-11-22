import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { reveal, sec } from "../motion";
import { HatchDefs, hatch } from "./EngravingHatch";
import { BoilDefs } from "./LineBoil";

// An open notebook drawn as a period engraving (TEX-005 hatch, MOT-009 boil): illustrative only, no writing on it.
// Its ruled rows draw in one by one between rowsFromSec and rowsToSec ("every single day"). Frame pixels.
export type NotebookSpec = { atSec: number; rowsFromSec: number; rowsToSec: number; rows?: number; x?: number; y?: number; scale?: number };

export const HatchNotebook: React.FC<{ spec: NotebookSpec }> = ({ spec }) => {
  useAssets(["TEX-005", "MOT-009"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = spec.rows ?? 9;
  const p = reveal(frame, fps, spec.atSec, 0.8);
  const k = interpolate(frame, [sec(spec.rowsFromSec, fps), sec(spec.rowsToSec, fps)], [0, n], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = spec.x ?? 1430, y = spec.y ?? 540, s = spec.scale ?? 0.72;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: p }}>
      <defs>
        <HatchDefs prefix="nbh" />
        <BoilDefs id="nbboil" amp={0.8} />
      </defs>
      <g transform={`translate(${x} ${y + (1 - p) * 20}) scale(${s}) translate(-480 -540)`}>
        <g filter="url(#nbboil)" stroke={t.colors.ink} strokeWidth={3} strokeLinejoin="round">
          <path d="M40 780 L480 820 L920 780 L920 320 L480 360 L40 320 Z" fill={hatch(0.75, "nbh")} />
          <path d="M60 760 L480 798 L480 350 L60 312 Z" fill={t.colors.panel} />
          <path d="M900 760 L480 798 L480 350 L900 312 Z" fill={t.colors.panel} />
          <path d="M480 350 L480 798 L425 792 L425 345 Z" fill={hatch(0.45, "nbh")} stroke="none" />
          <path d="M480 350 L480 798 L535 792 L535 345 Z" fill={hatch(0.3, "nbh")} stroke="none" />
          <path d="M900 312 L900 760 L860 764 Q880 540 860 316 Z" fill={hatch(0.15, "nbh")} stroke="none" />
        </g>
        <g stroke={t.colors.secondary} strokeWidth={2.5} opacity={0.85}>
          {Array.from({ length: n }, (_, i) => {
            const f = Math.max(0, Math.min(1, k - i));
            return f > 0 ? <line key={i} x1={570} y1={400 + i * 40} x2={570 + 290 * f} y2={400 + i * 40 - 3 * f} /> : null;
          })}
          {Array.from({ length: n }, (_, i) => (
            <line key={`l${i}`} x1={110} y1={400 + i * 40} x2={430} y2={400 + i * 40 - 3} opacity={0.35} />
          ))}
        </g>
      </g>
    </svg>
  );
};
