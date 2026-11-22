import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets } from "../registry";
import { useTheme } from "../themes";
import { exit, reveal, rise, sec, SLOW_OUT } from "../motion";

// VIS-024 ScaleField (studied Anton, 'Why Graphic Design Still Matters'; analysis only), built as a unit dot grid:
// a field of N dots (one dot = one person) in which a count lights up one by one in the accent, so a share like
// 8 in 100 is seen, not only heard. Phases change the field (100 -> 1,000 -> a room of 50); the old field dims away
// as the new one grows in. Lit dots are spread by a fixed seed (a picture of a share, not a map of who). A source
// line sits under every count. Calm: dots light 0.06-0.12 s apart, fields change over 0.8 s.
export type ScalePhase = { atSec: number; total: number; cols: number; lit: number; litAtSec: number; seed?: number; label?: { text: string; atSec: number } };
export type ScaleFieldProps = {
  phases: ScalePhase[];
  lines?: { text: string; atSec: number; untilSec?: number; size?: "large" | "small"; row?: number; accent?: boolean }[];
  source: string;
  startSec?: number;
};

const Field: React.FC<{ ph: ScalePhase; next?: ScalePhase }> = ({ ph, next }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pin = interpolate(frame, [sec(ph.atSec, fps), sec(ph.atSec + 0.8, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
  const pout = next ? interpolate(frame, [sec(next.atSec, fps), sec(next.atSec + 0.6, fps)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  if (pin <= 0 || pout <= 0) return null;
  const rows = Math.ceil(ph.total / ph.cols);
  const maxW = 1300, maxH = 560;
  const cell = Math.min(maxW / ph.cols, maxH / rows);
  const r = Math.max(3, cell * 0.32);
  const gw = cell * ph.cols, gh = cell * rows;
  const x0 = (1920 - gw) / 2, y0 = 300 + (maxH - gh) / 2;
  // which dots light: a seeded spread
  const order = Array.from({ length: ph.total }, (_, i) => i).sort((a, b) => random(`${ph.seed ?? 1}-${a}`) - random(`${ph.seed ?? 1}-${b}`));
  const litSet = new Map<number, number>();
  order.slice(0, ph.lit).forEach((idx, k) => litSet.set(idx, k));
  const step = Math.min(0.12, Math.max(0.06, 0.9 / Math.max(1, ph.lit)));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: pin * pout }}>
      {Array.from({ length: ph.total }, (_, i) => {
        const cx = x0 + (i % ph.cols) * cell + cell / 2;
        const cy = y0 + Math.floor(i / ph.cols) * cell + cell / 2;
        const k = litSet.get(i);
        const on = k === undefined ? 0 : interpolate(frame, [sec(ph.litAtSec + k * step, fps), sec(ph.litAtSec + k * step + 0.25, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <circle key={i} cx={cx} cy={cy} r={r * (0.85 + 0.15 * pin) * (1 + 0.25 * on)} fill={on > 0 ? t.colors.accent : t.colors.hairline.replace(/0\.\d+\)$/, "0.45)")} opacity={on > 0 ? 0.35 + 0.65 * on : 1} />;
      })}
    </svg>
  );
};

export const ScaleField: React.FC<ScaleFieldProps> = ({ phases, lines = [], source, startSec = 0 }) => {
  useAssets(["VIS-024", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const cur = [...phases].reverse().find((p) => now >= p.atSec);
  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6) }}>
      {lines.map((l) => {
        const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
        const out = l.untilSec !== undefined ? exit(frame, fps, l.untilSec, t.motion.enterSec) : 1;
        const large = l.size !== "small";
        return (
          <div key={`${l.text}${l.atSec}`} style={{ position: "absolute", left: 0, right: 0, top: large ? 120 : 226 + (l.row ?? 0) * 44, textAlign: "center", fontFamily: large ? t.fonts.headline : t.fonts.mono, fontWeight: large ? t.fonts.headlineWeight : 500, fontSize: large ? 76 : 30, letterSpacing: large ? t.fonts.headlineTracking : 3, color: large ? t.colors.ink : l.accent ? t.colors.accent : t.colors.secondary, ...rise(p * out, 18) }}>
            {l.text}
          </div>
        );
      })}
      {phases.map((ph, i) => (
        <Field key={`${ph.atSec}`} ph={ph} next={phases[i + 1]} />
      ))}
      {cur?.label ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: t.fonts.mono, fontSize: 30, letterSpacing: 4, color: t.colors.ink, opacity: reveal(frame, fps, cur.label.atSec, 0.75) }}>
          {cur.label.text}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.secondary, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{source}</div>
    </AbsoluteFill>
  );
};
