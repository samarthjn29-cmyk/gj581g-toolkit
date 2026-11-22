import React, { useId } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource } from "../registry";
import { reveal, rise, sec, SLOW_OUT } from "../motion";
import { cropToBox, type Rect } from "../layers/CropImage";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-032 LensDive (Sam, 22 Nov 2026: "a pair of eyes ... a magnifying glass to look into the eyes and the
// camera goes straight into the magnifying glass and transition to the next scene"; refined with the
// independent reviewer: the glass is Dalton's OWN spectacle lens in his real 1834 portrait, so nothing about him
// is invented, and his face never moves).
//  1. The real portrait, framed on his face; brackets lock onto one spectacle lens on a cue.
//  2. The push (the act's one designed flashy moment): the camera dives into that lens while its circle grows
//     and moves to a stage; inside it, the idea being tested is SHOWN: paper scraps in data colours behind a
//     tinted "fluid" (a blue tint darkens the red, as a blue-tinted humour would), which can clear on a cue.
//  3. Out: the circle shrinks to a point (e.g. where the next shot's "0" sits), so the cut is a match.
//  Mode "open" (the pay-off): the lens ring brightens and opens out to fill the frame.
// Calm everywhere else: entrances 0.75 s, no bounce; no blink, no gore, no tissue, no tools on the eye.
export type LensDiveProps = {
  srcId: string;
  imgSize: readonly [number, number];
  crop: Rect; // portrait framing (image px), shown full-frame
  lens: { x: number; y: number; r: number }; // the spectacle lens, image px
  bracketsAtSec?: number;
  push?: { atSec: number; sec?: number; to?: [number, number]; r?: number }; // stage circle after the push
  inside?: {
    scraps: { color: string; x: number; y: number; w: number; h: number; rot?: number }[]; // relative to stage centre
    tint?: { color: string; opacity?: number }; // the "fluid"
    clearAtSec?: number; // the tint drains away
  };
  out?: { atSec: number; sec?: number; to: [number, number]; r: number };
  open?: { atSec: number; sec?: number };
  lines?: { text: string; atSec: number; untilSec?: number; row?: number; style?: "serif" | "mono" }[];
  labels?: { text: string; atSec: number; untilSec?: number; dx?: number; dy?: number }[]; // chips on the stage circle
  tag?: DatelineTagProps;
  startSec?: number;
};

const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT } as const;

export const LensDive: React.FC<LensDiveProps> = ({
  srcId,
  imgSize,
  crop,
  lens,
  bracketsAtSec,
  push,
  inside,
  out,
  open,
  lines = [],
  labels = [],
  tag,
  startSec = 0,
}) => {
  useAssets(["VIS-032", "MOT-002"]);
  const t = useTheme();
  const src = useSource(srcId);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const W = 1920;
  const H = 1080;
  const { s, ox, oy } = cropToBox(crop, W, H, "cover");
  // the lens on screen before any move
  const lx = ox + lens.x * s;
  const ly = oy + lens.y * s;
  const lr = lens.r * s;

  // slow drift on the portrait (calm), towards the lens
  const driftK = 1 + 0.02 * (frame / Math.max(1, durationInFrames));
  // the push: camera zoom into the lens, the circle travels to the stage
  const pP = push ? interpolate(frame, [sec(push.atSec, fps), sec(push.atSec + (push.sec ?? 1.1), fps)], [0, 1], ease) : 0;
  const stage = push?.to ?? [1180, 540];
  const stageR = push?.r ?? 360;
  const zoom = driftK * (1 + pP * (stageR / lr - 1) * 0.9);
  // out: shrink the circle to a point
  const pO = out ? interpolate(frame, [sec(out.atSec, fps), sec(out.atSec + (out.sec ?? 0.5), fps)], [0, 1], ease) : 0;
  // open: the ring opens to fill the frame
  const pOpen = open ? interpolate(frame, [sec(open.atSec, fps), sec(open.atSec + (open.sec ?? 1.2), fps)], [0, 1], ease) : 0;

  let cx = lx + (stage[0] - lx) * pP;
  let cy = ly + (stage[1] - ly) * pP;
  let cr = lr + (stageR - lr) * pP;
  if (out) {
    cx += (out.to[0] - cx) * pO;
    cy += (out.to[1] - cy) * pO;
    cr += (out.r - cr) * pO;
  }
  if (open) {
    // the view inside centres on the stage while the ring opens past the frame
    cx += (stage[0] - cx) * pOpen;
    cy += (stage[1] - cy) * pOpen;
    cr = cr + (1250 - cr) * pOpen;
  }

  // the portrait follows the zoom around the lens, so the lens stays under the circle as it travels
  const portraitT = `translate(${cx}px, ${cy}px) scale(${zoom}) translate(${-lx}px, ${-ly}px)`;
  const portraitOp = 1 - 0.85 * pP;
  const insideOp = Math.max(pP, open ? pOpen : 0);
  const pB = bracketsAtSec !== undefined ? reveal(frame, fps, bracketsAtSec, 0.6) : 0;
  const pClear = inside?.clearAtSec !== undefined ? interpolate(frame, [sec(inside.clearAtSec, fps), sec(inside.clearAtSec + 1.0, fps)], [0, 1], ease) : 0;
  const tintOp = (inside?.tint?.opacity ?? 0.72) * (1 - pClear);
  const clip = `ld${uid}`;
  // the scraps scale with the circle, so the dive and the opening read as moving in
  const k = Math.max(0.25, Math.min(open ? 1.15 : 3, cr / stageR));
  const ringW = 6 + 4 * pOpen;

  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6), background: t.colors.canvas }}>
      {/* the real portrait (grayscale grade), moved as one with the lens */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: portraitT, opacity: portraitOp }}>
        <Img
          src={src}
          style={{ position: "absolute", left: ox, top: oy, width: imgSize[0] * s, height: imgSize[1] * s, maxWidth: "none", filter: "grayscale(1) contrast(1.05) brightness(0.92)" }}
        />
      </div>
      {/* left side darkened for the words */}
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${t.colors.canvas} 0%, ${t.colors.canvas} 18%, transparent 52%)`, opacity: 0.92 }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id={clip}>
            <circle cx={cx} cy={cy} r={Math.max(0, cr)} />
          </clipPath>
        </defs>
        {/* inside the lens: the idea, shown */}
        {inside ? (
          <g clipPath={`url(#${clip})`} opacity={insideOp * (1 - pO * 0.7)}>
            <rect x={0} y={0} width={W} height={H} fill={t.colors.panel} />
            {inside.scraps.map((p, i) => (
              <rect
                key={i}
                x={cx + p.x * k - (p.w * k) / 2}
                y={cy + p.y * k - (p.h * k) / 2}
                width={p.w * k}
                height={p.h * k}
                rx={6 * k}
                fill={p.color}
                transform={`rotate(${p.rot ?? 0} ${cx + p.x * k} ${cy + p.y * k})`}
              />
            ))}
            {inside.tint ? <rect x={0} y={0} width={W} height={H} fill={inside.tint.color} opacity={tintOp} style={{ mixBlendMode: "multiply" }} /> : null}
            {inside.tint ? <rect x={0} y={0} width={W} height={H} fill={inside.tint.color} opacity={tintOp * 0.35} /> : null}
          </g>
        ) : null}
        {/* the lens rim */}
        <circle cx={cx} cy={cy} r={Math.max(0, cr)} fill="none" stroke={t.colors.ink} strokeWidth={ringW} opacity={Math.min(1, 0.35 + pP + pOpen) * (1 - pOpen * 0.8)} />
        {/* brackets locking onto the lens (before the push) */}
        {pB > 0 && pP < 1
          ? [
              [-1, -1],
              [1, -1],
              [-1, 1],
              [1, 1],
            ].map(([sx, sy], i) => {
              const g = lr * (1.9 - 0.5 * pB);
              const bx = lx + sx * g;
              const by = ly + sy * g;
              const L = lr * 0.55;
              return (
                <path
                  key={i}
                  d={`M ${bx} ${by - sy * L} L ${bx} ${by} L ${bx - sx * L} ${by}`}
                  fill="none"
                  stroke={t.colors.accent}
                  strokeWidth={4}
                  opacity={pB * (1 - pP) * (1 - pOpen)}
                />
              );
            })
          : null}
      </svg>
      {/* chips on the stage circle */}
      {labels.map((l) => {
        const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
        const u = l.untilSec !== undefined ? 1 - interpolate(frame, [sec(l.untilSec, fps), sec(l.untilSec + 0.4, fps)], [0, 1], ease) : 1;
        return (
          <div
            key={l.text}
            style={{
              position: "absolute",
              left: cx + (l.dx ?? 0),
              top: cy + cr + 30 + (l.dy ?? 0),
              transform: "translateX(-50%)",
              padding: "10px 16px",
              background: t.colors.chip,
              color: t.colors.ink,
              fontFamily: t.fonts.mono,
              fontSize: 32,
              letterSpacing: 3,
              whiteSpace: "nowrap",
              borderRadius: 4,
              opacity: p * u * (1 - pO),
            }}
          >
            {l.text}
          </div>
        );
      })}
      {/* the spoken words, left */}
      <div style={{ position: "absolute", left: t.safe.x, top: 330, width: 900 }}>
        {lines.map((l) => {
          const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
          const u = l.untilSec !== undefined ? 1 - interpolate(frame, [sec(l.untilSec, fps), sec(l.untilSec + 0.5, fps)], [0, 1], ease) : 1;
          const mono = l.style === "mono";
          return (
            <div
              key={l.text}
              style={{
                position: "absolute",
                top: (l.row ?? 0) * 110,
                fontFamily: mono ? t.fonts.mono : t.fonts.headline,
                fontWeight: mono ? 500 : t.fonts.headlineWeight,
                letterSpacing: mono ? 3 : t.fonts.headlineTracking,
                fontSize: mono ? 34 : 84,
                lineHeight: 1.05,
                color: mono ? t.colors.secondary : t.colors.ink,
                width: 900,
                ...rise(p * u * (1 - pO), mono ? 12 : 26),
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
