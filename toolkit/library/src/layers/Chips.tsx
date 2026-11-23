import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";

// TXT-024 KeywordChips and TXT-025 QuoteChips (Within Motion blend, Sam 24 Nov 2026: "Blend into E01 from act 3").
// The spoken key word set big on paper chips: white chips (the theme's paper chip, its paper ink), the one key word on
// the accent chip. Lowercase as spoken, the headline serif (Fraunces 600 in LOK-009) so spoken words read apart from
// our uppercase mono labels. Each chip lands on its word with the house lock (rises 12 px, 0.35 s, no overshoot) and
// sits at a fixed tilt of +-1.5 degrees. Options: a strike (6 px accent line swiped across in 0.3 s on its word), a
// hand-drawn arrow (0.35 s) before the next chip of a swap, stacked rows. Exit: un-wipe (MOT-013) or with the shot.
// Silent, as all our text is.
// Best use (TXT-024): one keyword panel at a story turn, the line's key word or words, all spoken; limit 8 panels an
// act, at most one panel every 15 s; never a whole spoken line; never on the act's impact or over a page's own
// highlight. TXT-025: a verbatim quote as spoken, word by word, with its source on a mono chip; max 3 an act.
type XY = readonly [number, number];
export type KeywordChip = { text: string; atSec: number; x: number; y: number; accent?: boolean; strikeSec?: number };
export type KeywordPanel = { chips: KeywordChip[]; arrows?: { atSec: number; from: XY; to: XY }[]; untilSec?: number; size?: number };
export type QuotePanel = {
  lines: { x: number; y: number; words: { text: string; atSec: number }[] }[];
  source?: { text: string; atSec: number; x: number; y: number; untilSec?: number };
  untilSec?: number;
  size?: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useChipLook = () => {
  const t = useTheme();
  const paper = t.paper ?? {};
  return {
    white: paper.chip ?? t.colors.ink,
    whiteInk: paper.ink ?? t.colors.canvas,
    accent: t.colors.accent,
    accentInk: paper.ink ?? t.colors.canvas,
    font: t.fonts.headline,
    weight: t.fonts.headlineWeight,
    mono: t.fonts.mono,
    t,
  };
};

const unwipe = (frame: number, fps: number, untilSec?: number) =>
  untilSec === undefined ? 1 : interpolate(frame, [sec(untilSec, fps), sec(untilSec + 0.5, fps)], [1, 0], clamp);
// MOT-013 for a whole panel: one clip sweeping from the panel's left edge to its right, the words going in reading
// order, a short fade at the end
const PanelClip: React.FC<{ out: number; x0: number; x1: number; children: React.ReactNode }> = ({ out, x0, x1, children }) =>
  out <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, clipPath: out < 1 ? `inset(-40px -40px -40px ${(x0 + (x1 - x0) * (1 - out)).toFixed(1)}px)` : undefined, opacity: Math.min(1, out * 2.5) }}>{children}</div>
  );

const Chip: React.FC<{ text: string; atSec: number; accent?: boolean; size: number; tilt: number; strikeSec?: number; out: number; style?: React.CSSProperties }> = ({ text, atSec, accent, size, tilt, strikeSec, out, style }) => {
  const L = useChipLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [sec(atSec, fps), sec(atSec + 0.35, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
  if (p <= 0 || out <= 0) return null;
  const ps = strikeSec !== undefined ? interpolate(frame, [sec(strikeSec, fps), sec(strikeSec + 0.3, fps)], [0, 1], { ...clamp, easing: SLOW_OUT }) : 0;
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: `${Math.round(size * 0.13)}px ${Math.round(size * 0.24)}px`,
        borderRadius: 4,
        background: accent ? L.accent : L.white,
        color: accent ? L.accentInk : L.whiteInk,
        fontFamily: L.font,
        fontWeight: L.weight,
        fontSize: size,
        lineHeight: 1.05,
        whiteSpace: "nowrap",
        transform: `translateY(${((1 - p) * 12).toFixed(1)}px) rotate(${tilt}deg)`,
        opacity: Math.min(1, p * 1.8),
        boxShadow: "0 6px 16px rgba(0,0,0,0.28)",
        ...style,
      }}
    >
      {text}
      {ps > 0 ? <div style={{ position: "absolute", left: "6%", top: "52%", height: 6, width: `${(88 * ps).toFixed(1)}%`, borderRadius: 3, background: accent ? L.whiteInk : L.accent }} /> : null}
    </div>
  );
};

export const KeywordChips: React.FC<{ panel: KeywordPanel }> = ({ panel }) => {
  const L = useChipLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = unwipe(frame, fps, panel.untilSec);
  const size = panel.size ?? 76;
  if (panel.chips.filter((c) => c.accent).length > 1) throw new Error("KeywordChips: one accent chip per panel.");
  const x0 = Math.min(...panel.chips.map((c) => c.x)) - 10;
  const x1 = Math.max(...panel.chips.map((c) => c.x + c.text.length * size * 0.56 + size * 0.5)) + 40;
  return (
    <PanelClip out={out} x0={x0} x1={x1}>
      {(panel.arrows ?? []).map((a, i) => {
        const p = interpolate(frame, [sec(a.atSec, fps), sec(a.atSec + 0.35, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
        if (p <= 0 || out <= 0) return null;
        const [x0, y0] = a.from;
        const [x1, y1] = a.to;
        // a hand-drawn bow: the control point sits off the straight line, so it reads as drawn, not ruled
        const mx = (x0 + x1) / 2 + (y1 - y0) * 0.25;
        const my = (y0 + y1) / 2 - (x1 - x0) * 0.25;
        const ang = Math.atan2(y1 - my, x1 - mx);
        const hd = (s: number) => `${x1 + 22 * Math.cos(ang + Math.PI + s)},${y1 + 22 * Math.sin(ang + Math.PI + s)}`;
        return (
          <svg key={i} width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`} fill="none" stroke={L.accent} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
            {p > 0.92 ? <polyline points={`${hd(0.45)} ${x1},${y1} ${hd(-0.45)}`} fill="none" stroke={L.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </svg>
        );
      })}
      {panel.chips.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: c.x, top: c.y }}>
          <Chip text={c.text} atSec={c.atSec} accent={c.accent} size={size} tilt={i % 2 ? 1.5 : -1.5} strikeSec={c.strikeSec} out={out} />
        </div>
      ))}
    </PanelClip>
  );
};

export const QuoteChips: React.FC<{ panel: QuotePanel }> = ({ panel }) => {
  const L = useChipLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = unwipe(frame, fps, panel.untilSec);
  const size = panel.size ?? 44;
  const src = panel.source;
  const sOut = src ? unwipe(frame, fps, src.untilSec) : 0;
  const sIn = src ? interpolate(frame, [sec(src.atSec, fps), sec(src.atSec + 0.35, fps)], [0, 1], { ...clamp, easing: SLOW_OUT }) : 0;
  let k = 0;
  const qx0 = Math.min(...panel.lines.map((l) => l.x)) - 10;
  const qx1 = Math.max(...panel.lines.map((l) => l.x + l.words.reduce((a, w) => a + w.text.length * size * 0.52 + size * 0.5 + 8, 0))) + 40;
  return (
    <>
      <PanelClip out={out} x0={qx0} x1={qx1}>
      {panel.lines.map((ln, li) => (
        <div key={li} style={{ position: "absolute", left: ln.x, top: ln.y, display: "flex", gap: 8, alignItems: "baseline" }}>
          {ln.words.map((w, wi) => (
            <Chip key={wi} text={w.text} atSec={w.atSec} size={size} tilt={(k++ % 2 ? 1 : -1) * 1.0} out={out} />
          ))}
        </div>
      ))}
      </PanelClip>
      {src && sIn > 0 && sOut > 0 ? (
        <div style={{ position: "absolute", left: src.x, top: src.y, fontFamily: L.mono, fontSize: 20, letterSpacing: 2, color: L.t.colors.ink, background: L.t.colors.chip, padding: "6px 12px", borderRadius: 3, opacity: sIn * Math.min(1, sOut * 2.5), transform: `translateY(${((1 - sIn) * 10).toFixed(1)}px)`, clipPath: sOut < 1 ? `inset(-4px -4px -4px ${((1 - sOut) * 100).toFixed(1)}%)` : undefined, whiteSpace: "nowrap" }}>
          {src.text}
        </div>
      ) : null}
    </>
  );
};
