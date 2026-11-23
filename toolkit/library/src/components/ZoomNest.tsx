import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets } from "../registry";
import { useTheme } from "../themes";
import { reveal, sec } from "../motion";

// VIS-057 ZoomNest (Johnny Harris and Max Fisher, 'The REAL reason China built so much': a crowd of figures, then the
// camera drills in step by step, each step lighting a smaller group at the centre while the rest go pale and the
// outer labels are carried off the frame by the zoom; analysis only; Sam, 23 Nov 2026: "Pay attention to how new
// objects are brought in on to the screen and how they leave the screen").
// Units (small figures, or dots) sit in a sunflower spiral, so every smaller group is the innermost part of the one
// before. Level 0 is the whole crowd. On each later level's word the camera zooms (0.8 s, eased) so that group fills
// the middle of the frame, that group takes its colour, the rest fade to pale, and its label is written at the
// group's left edge, in the crowd's own space (so earlier labels slide off the frame as the camera goes in).
// Best use: a share inside a share (100 men, 8 colour-blind, 1 like Dalton), or a body inside a body (a society, its
// council, its president). Limit: 2-4 levels; the crowd up to 1,200 units; max 1 per act; counts from the
// fact-checked script; an illustration of proportion, labelled as such when the units aren't one-to-one.
export type NestLevel = { count: number; label: string; atSec: number; color?: "accent" | "L" | "M" | "S" | "ink" };
export type ZoomNestProps = { levels: NestLevel[]; unit?: "figure" | "dot"; caption?: string; startSec?: number };

const GOLD = 2.399963; // golden angle, radians
const R0 = 400; // the crowd's radius at zoom 1

export const ZoomNest: React.FC<ZoomNestProps> = ({ levels, unit = "figure", caption, startSec = 0 }) => {
  useAssets(["VIS-057", "MOT-002"]);
  if (levels.length < 2 || levels.length > 4) throw new Error("ZoomNest: 2-4 levels.");
  const N = levels[0].count;
  if (N > 1200) throw new Error("ZoomNest: up to 1,200 units.");
  levels.forEach((l, i) => {
    if (i && l.count >= levels[i - 1].count) throw new Error("ZoomNest: each level is smaller than the one before.");
  });
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pIn = reveal(frame, fps, startSec, 0.75);
  const c = R0 / Math.sqrt(N);
  const radiusOf = (k: number) => c * Math.sqrt(Math.max(1, k)) + c * 0.6;
  // the camera: zoom so the current group's radius reads at ~300 px
  let z = 1;
  levels.slice(1).forEach((l) => {
    const p = Easing.bezier(0.45, 0, 0.15, 1)(interpolate(frame, [sec(l.atSec, fps), sec(l.atSec + 0.8, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const target = Math.min(14, 300 / radiusOf(l.count));
    z = z * Math.pow(target / z, p);
  });
  const col = (k?: NestLevel["color"]) => (k === "L" || k === "M" || k === "S" ? t.colors.cones[k] : k === "ink" ? t.colors.ink : t.colors.accent);
  // which level each unit belongs to now (the deepest level that has started and holds it)
  const lit = levels.map((l, li) => (li === 0 ? 1 : interpolate(frame, [sec(l.atSec + 0.3, fps), sec(l.atSec + 0.7, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const units: React.ReactNode[] = [];
  const s = c * 0.42;
  for (let i = 0; i < N; i++) {
    const r = c * Math.sqrt(i + 0.5);
    const a = i * GOLD;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    let fill = t.colors.secondary;
    let op = 0.9;
    let grow = 1;
    for (let li = 1; li < levels.length; li++) {
      const inLevel = i < levels[li].count;
      if (lit[li] <= 0) continue;
      if (inLevel) {
        fill = col(levels[li].color);
        grow = 1 + 0.15 * lit[li] * (li === levels.length - 1 ? 1 : 0);
      } else if (li === levels.length - 1 || lit[li + 1] === undefined || lit[li + 1] <= 0) {
        op = 0.9 - 0.55 * lit[li];
      }
    }
    const sz = s * grow;
    units.push(
      unit === "dot" ? (
        <circle key={i} cx={x} cy={y} r={sz * 0.8} fill={fill} opacity={op} />
      ) : (
        <g key={i} transform={`translate(${x} ${y})`} opacity={op} fill={fill}>
          <circle cy={-sz * 0.55} r={sz * 0.42} />
          <path d={`M ${-sz * 0.62} ${sz * 0.75} Q ${-sz * 0.6} ${-sz * 0.05} 0 ${-sz * 0.05} Q ${sz * 0.6} ${-sz * 0.05} ${sz * 0.62} ${sz * 0.75} Z`} />
        </g>
      ),
    );
  }
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(960 540) scale(${z})`}>
          {units}
          {levels.map((l, li) => {
            const a = li === 0 ? reveal(frame, fps, l.atSec, 0.7) : interpolate(frame, [sec(l.atSec + 0.5, fps), sec(l.atSec + 0.9, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            if (a <= 0) return null;
            const R = li === 0 ? R0 + c : radiusOf(l.count);
            const zl = li === 0 ? 1 : Math.min(14, 300 / radiusOf(l.count)); // the zoom at which this label was written
            const fs = 30 / zl;
            return (
              <g key={li} opacity={a}>
                <text x={-R - 18 / zl} y={fs * 0.35} textAnchor="end" fontFamily={t.fonts.mono} fontSize={fs} letterSpacing={2 / zl} fill={li === 0 ? t.colors.ink : col(l.color)}>
                  {l.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {caption ? <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};
