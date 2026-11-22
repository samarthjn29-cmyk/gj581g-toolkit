import React, { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, rise, sec, SLOW_OUT } from "../motion";
import { cmyk, DotPattern, dotR, PROCESS_INKS, SCREEN_ANGLES } from "../layers/DotScreen";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// LOK-017 HalftoneMoire (Sam, 22 Nov 2026: "I like the Moire pattern. Let's use it where it fits best").
// A flat colour (data: what someone reported, e.g. the friends' PINK) set as a large swatch. A loupe glides
// slowly across it; inside the loupe the "flat" colour is shown for what a printed one really is: dots of
// process inks on paper, at the classic screen angles. A second, finer screen turns a few degrees over the
// loupe, so the interference (the moire) drifts gently: the still feels alive without moving fast.
// Calm: one slow loupe move, entrances 0.75 s, moire opacity <= 0.3, no overshoot.
// Own build (studied Chris Moran's short on Johnny Harris's moire stills; analysis only).
export type HalftoneMoireProps = {
  color: string; // data colour (#RRGGBB) of the swatch
  name?: string; // swatch label, e.g. PINK
  loupe: { atSec: number; from: [number, number]; to: [number, number]; moveSec: number; r?: number; cell?: number };
  moire?: { opacity?: number; turnDeg?: number; scale?: number };
  lines?: { text: string; atSec: number; style?: "serif" | "mono" }[];
  tag?: DatelineTagProps;
  startSec?: number;
};

const SW = { x: 860, y: 200, w: 920, h: 680 }; // the swatch box

export const HalftoneMoire: React.FC<HalftoneMoireProps> = ({ color, name, loupe, moire = {}, lines = [], tag, startSec = 0 }) => {
  useAssets(["LOK-017", "MOT-002"]);
  const t = useTheme();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const now = frame / fps;
  const pIn = reveal(frame, fps, startSec, 0.75);
  const pL = reveal(frame, fps, loupe.atSec, 0.75);
  const u = interpolate(frame, [sec(loupe.atSec, fps), sec(loupe.atSec + loupe.moveSec, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  const lx = loupe.from[0] + (loupe.to[0] - loupe.from[0]) * u;
  const ly = loupe.from[1] + (loupe.to[1] - loupe.from[1]) * u;
  const R = loupe.r ?? 230;
  const cell = loupe.cell ?? 22;
  const cov = cmyk(color);
  const turn = (moire.turnDeg ?? 4) * Math.min(1, Math.max(0, (now - loupe.atSec) / Math.max(1, (durationInFrames / fps) - loupe.atSec)));
  const mCell = cell * (moire.scale ?? 0.94);
  const mOp = Math.min(0.3, moire.opacity ?? 0.18) * pL;
  // a light colour keeps its black screen out (a few dark dots read as dirt, not as the colour)
  const inks = (["Y", "C", "M", "K"] as const).filter((k) => cov[k] > (k === "K" ? 0.15 : 0.02));
  const clip = `loupe${uid}`;
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        <svg width={1920} height={1080}>
          <defs>
            {inks.map((k) => (
              <DotPattern key={k} id={`${k}${uid}`} cell={cell} angle={SCREEN_ANGLES[k]} r={dotR(cell, cov[k])} color={PROCESS_INKS[k]} />
            ))}
            <DotPattern id={`mo${uid}`} cell={mCell} angle={SCREEN_ANGLES.M + turn} r={mCell * 0.24} color={t.colors.canvas} />
            <clipPath id={clip}>
              <circle cx={lx} cy={ly} r={R * pL} />
            </clipPath>
          </defs>
          {/* the flat swatch, as the eye sees it from a distance */}
          <rect x={SW.x} y={SW.y} width={SW.w} height={SW.h} rx={10} fill={color} />
          {/* inside the loupe: paper and ink dots, then the turning screen that makes the moire */}
          <g clipPath={`url(#${clip})`}>
            <rect x={0} y={0} width={1920} height={1080} fill={t.colors.ink} />
            {inks.map((k) => (
              <rect key={k} x={0} y={0} width={1920} height={1080} fill={`url(#${k}${uid})`} style={{ mixBlendMode: "multiply" }} />
            ))}
            <rect x={0} y={0} width={1920} height={1080} fill={`url(#mo${uid})`} opacity={mOp} style={{ mixBlendMode: "multiply" }} />
          </g>
          {/* the loupe's rim and a small shadow under it */}
          <circle cx={lx} cy={ly + 10} r={R * pL + 6} fill="none" stroke={t.colors.dimMask} strokeWidth={14} opacity={0.5 * pL} />
          <circle cx={lx} cy={ly} r={R * pL} fill="none" stroke={t.colors.ink} strokeWidth={6} opacity={pL} />
          {name ? (
            <text x={SW.x} y={SW.y + SW.h + 50} fontFamily={t.fonts.mono} fontSize={24} letterSpacing={3} fill={t.colors.secondary}>
              {name}
            </text>
          ) : null}
        </svg>
      </div>
      <div style={{ position: "absolute", left: t.safe.x, top: 0, bottom: 0, width: SW.x - t.safe.x - 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {lines.map((l) => {
          const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
          const mono = l.style === "mono";
          return (
            <div
              key={l.text}
              style={{
                fontFamily: mono ? t.fonts.mono : t.fonts.headline,
                fontWeight: mono ? 500 : t.fonts.headlineWeight,
                letterSpacing: mono ? 3 : t.fonts.headlineTracking,
                fontSize: mono ? 26 : 92,
                lineHeight: mono ? 1.4 : 1.05,
                color: mono ? t.colors.secondary : t.colors.ink,
                marginTop: mono ? 28 : 0,
                ...rise(p, mono ? 12 : 26),
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

