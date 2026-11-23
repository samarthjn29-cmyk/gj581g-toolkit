import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { drift, reveal, sec } from "../motion";

// VIS-054 WhatWeKnow (Johnny Harris, 'The Secret Trump Investigation Nobody is Talking About', his 'What We Know'
// list on penmanship paper that comes back and grows; analysis only; Sam, 23 Nov 2026: "learn from the presenter and
// build better cinematics"). A ruled card (solid lines with a dashed middle line, like handwriting paper) in the left
// third of the frame, titled in mono caps. It comes back during an act: the lines already known sit written, and the
// new line is written on its word, left to right at handwriting speed. A line can be ticked, or struck through when
// the story overturns it. Beside it, optionally, the real picture the list is about, drifting slowly.
// Best use: a mystery or a case told in steps (what Dalton knew, what the eye showed). Limit: up to 6 lines, one new
// line per return, at most 4 returns an act; every line is a fact the narration says in the same words or fewer;
// a line struck through is said to be wrong.
export type KnowLine = { text: string; atSec?: number; tickAtSec?: number; strikeAtSec?: number };
export type WhatWeKnowProps = {
  title?: string;
  lines: KnowLine[]; // lines without atSec are already written when the shot opens
  beside?: { srcId: string; file?: string; imgSize: readonly [number, number]; focus?: readonly [number, number]; label?: string };
  side?: "left" | "right";
  startSec?: number;
};

const CARD = { w: 700, h: 760, row: 92 };

const Beside: React.FC<{ b: NonNullable<WhatWeKnowProps["beside"]>; side: "left" | "right"; z: number }> = ({ b, side, z }) => {
  const t = useTheme();
  const src = useSourceFile(b.srcId, b.file);
  const f = b.focus ?? [0.5, 0.4];
  return (
    <div style={{ position: "absolute", left: side === "left" ? 900 : 120, top: 150, width: 900, height: 780, overflow: "hidden", borderRadius: 6, boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${f[0] * 100}% ${f[1] * 100}%`, transform: `scale(${z})`, filter: "sepia(0.2) contrast(1.04)" }} />
      {b.label ? <div style={{ position: "absolute", left: 18, bottom: 18, fontFamily: t.fonts.mono, fontSize: 18, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "5px 10px", borderRadius: 3 }}>{b.label}</div> : null}
    </div>
  );
};

export const WhatWeKnow: React.FC<WhatWeKnowProps> = ({ title = "WHAT WE KNOW", lines, beside, side = "left", startSec = 0 }) => {
  useAssets(["VIS-054", "MOT-001", "MOT-002", ...(beside ? [beside.srcId] : [])]);
  if (lines.length > 6) throw new Error("WhatWeKnow: up to 6 lines.");
  if (lines.filter((l) => l.atSec !== undefined).length > 1) throw new Error("WhatWeKnow: one new line per return.");
  const t = useTheme();
  const P = { ...t.colors, ...(t.paper ?? {}) };
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pIn = reveal(frame, fps, startSec, 0.75);
  const z = drift(frame, durationInFrames, 0.02);
  const left = side === "left" ? 150 : 1920 - 150 - CARD.w;
  const top = (1080 - CARD.h) / 2;
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      {beside ? <Beside b={beside} side={side} z={z} /> : null}
      <div style={{ position: "absolute", left, top, width: CARD.w, height: CARD.h, background: P.canvas, borderRadius: 4, transform: `rotate(-1deg) translateY(${(1 - pIn) * 18}px)`, boxShadow: "0 26px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 44, top: 40, fontFamily: t.fonts.mono, fontSize: 30, letterSpacing: 6, color: P.ink }}>{title}</div>
        <div style={{ position: "absolute", left: 44, right: 44, top: 88, height: 3, background: P.ink, opacity: 0.8 }} />
        <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 6 }, (_, i) => {
            const y = 168 + i * CARD.row;
            return (
              <g key={i} stroke={t.colors.cones.S} strokeWidth={1.6}>
                <line x1={36} x2={CARD.w - 36} y1={y - 46} y2={y - 46} strokeOpacity={0.35} />
                <line x1={36} x2={CARD.w - 36} y1={y - 23} y2={y - 23} strokeOpacity={0.3} strokeDasharray="8 8" />
                <line x1={36} x2={CARD.w - 36} y1={y} y2={y} strokeOpacity={0.5} />
              </g>
            );
          })}
        </svg>
        {lines.map((l, i) => {
          const y = 168 + i * CARD.row;
          const isNew = l.atSec !== undefined;
          const writeSec = Math.min(2.4, Math.max(0.6, l.text.length / 16));
          const w = isNew ? interpolate(frame, [sec(l.atSec as number, fps), sec((l.atSec as number) + writeSec, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
          if (w <= 0) return null;
          const tick = l.tickAtSec !== undefined ? interpolate(frame, [sec(l.tickAtSec, fps), sec(l.tickAtSec + 0.4, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          const strike = l.strikeAtSec !== undefined ? interpolate(frame, [sec(l.strikeAtSec, fps), sec(l.strikeAtSec + 0.5, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          const textW = Math.min(CARD.w - 150, l.text.length * 17.5);
          return (
            <div key={i} style={{ position: "absolute", left: 44, top: y - 50, width: CARD.w - 88, height: 56 }}>
              <div style={{ position: "absolute", left: 0, top: 10, fontFamily: t.fonts.mono, fontSize: 24, color: P.secondary }}>{i + 1}.</div>
              <div style={{ position: "absolute", left: 46, top: 0, whiteSpace: "nowrap", fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 34, color: P.ink, clipPath: `inset(-10px ${((1 - w) * 100).toFixed(1)}% -10px 0)`, opacity: strike > 0 ? 1 - 0.45 * strike : 1 }}>{l.text}</div>
              <svg width={CARD.w} height={80} style={{ position: "absolute", left: 0, top: -12, overflow: "visible" }}>
                {strike > 0 ? <path d={`M 40 36 Q ${46 + textW / 2} 30 ${52 + textW} 34`} fill="none" stroke={t.colors.cones.L} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} /> : null}
                {tick > 0 ? <path d={`M ${CARD.w - 132} 36 L ${CARD.w - 120} 50 L ${CARD.w - 98} 18`} fill="none" stroke={P.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} /> : null}
              </svg>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
