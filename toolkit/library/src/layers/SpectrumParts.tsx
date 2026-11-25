import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";
import { wavelengthRGB } from "./spectrum";

// Pieces of VIS-014 SpectrumStrip built for WCL-E01 act 5 (Director's brief, Builder additions 2-4; Expert, 25 Nov 2026).
// All in frame px and shot seconds. Red on the left by default (`reverse`), as act 3's six bands.

const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// colour of a wavelength scaled by a weight given in LINEAR light (a profile of 0.02 at 450 nm means 2% of the light),
// shown with the display's gamma so a weak end still reads as weak but visible
const weighted = (nm: number, w: number) => {
  const m = /rgb\((\d+),(\d+),(\d+)\)/.exec(wavelengthRGB(nm));
  const k = Math.pow(Math.max(0, Math.min(1, w)), 1 / 2.2);
  if (!m) return "rgb(0,0,0)";
  return `rgb(${Math.round(+m[1] * k)},${Math.round(+m[2] * k)},${Math.round(+m[3] * k)})`;
};
const interp = (profile: [number, number][], nm: number) => {
  const p = [...profile].sort((a, b) => a[0] - b[0]);
  if (nm <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) if (nm <= p[i][0]) return p[i - 1][1] + ((p[i][1] - p[i - 1][1]) * (nm - p[i - 1][0])) / (p[i][0] - p[i - 1][0]);
  return p[p.length - 1][1];
};
export const profileGradient = (profile: [number, number][] | undefined, reverse = true, from = 400, to = 700, steps = 40) => {
  const stops = Array.from({ length: steps + 1 }, (_, i) => {
    const f = i / steps;
    const nm = reverse ? to - (to - from) * f : from + (to - from) * f;
    return `${weighted(nm, profile ? interp(profile, nm) : 1)} ${(f * 100).toFixed(1)}%`;
  });
  return `linear-gradient(90deg, ${stops.join(", ")})`;
};
// soft top and bottom edges and fading ends (Designer, act 4: a lit spectrum is one smooth, feathered patch)
export const FEATHER: React.CSSProperties = {
  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

export type SpectrumRow = {
  x: number;
  y: number;
  w: number;
  h?: number;
  atSec: number; // draws left to right over 0.9 s
  label?: string; // mono 22, above the strip's left end
  labelTone?: "chip"; // the label on a dark chip, for a bright world behind it (Designer, act 5 Gate 3)
  labelAtSec?: number;
  under?: string; // mono 22, centred under the strip (e.g. SENT BACK), with the strip
  profile?: [number, number][]; // [nm, weight 0..1 in linear light]; none = all colours full
  reverse?: boolean; // default true: red on the left
  mark?: { fromNm: number; toNm: number; text: string; atSec: number }; // a bracket over a span, a mono label beside it
  untilSec?: number;
};

export const SpectrumRows: React.FC<{ rows: SpectrumRow[] }> = ({ rows }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {rows.map((r, i) => {
        const h = r.h ?? 46;
        const rev = r.reverse ?? true;
        const p = interpolate(frame, [sec(r.atSec, fps), sec(r.atSec + 0.9, fps)], [0, 1], clamp);
        const out = r.untilSec !== undefined ? interpolate(frame, [sec(r.untilSec, fps), sec(r.untilSec + 0.4, fps)], [1, 0], ease) : 1;
        const pl = r.label ? interpolate(frame, [sec(r.labelAtSec ?? r.atSec, fps), sec((r.labelAtSec ?? r.atSec) + 0.6, fps)], [0, 1], ease) : 0;
        const X = (nm: number) => r.x + (rev ? (700 - nm) / 300 : (nm - 400) / 300) * r.w;
        const pm = r.mark ? interpolate(frame, [sec(r.mark.atSec, fps), sec(r.mark.atSec + 0.6, fps)], [0, 1], ease) : 0;
        if (Math.max(p, pl) <= 0 || out <= 0) return null;
        const mx0 = r.mark ? Math.min(X(r.mark.fromNm), X(r.mark.toNm)) : 0;
        const mx1 = r.mark ? Math.max(X(r.mark.fromNm), X(r.mark.toNm)) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: out }}>
            <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: h, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: profileGradient(r.profile, rev), ...FEATHER }} />
            </div>
            {r.label && pl > 0 ? (
              <div style={{ position: "absolute", left: r.x - (r.labelTone ? 8 : 0), top: r.y - (r.labelTone ? 42 : 34), fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 2, color: r.labelTone ? "#F2EDE4" : t.colors.ink, opacity: pl, whiteSpace: "nowrap", ...(r.labelTone ? { background: "rgba(24,21,19,0.82)", padding: "4px 8px", borderRadius: 3 } : {}) }}>{r.label}</div>
            ) : null}
            {r.under && p > 0 ? (
              <div style={{ position: "absolute", left: r.x, top: r.y + h + 14, width: r.w, textAlign: "center", fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 2, color: t.colors.secondary, opacity: p }}>{r.under}</div>
            ) : null}
            {r.mark && pm > 0 ? (
              <>
                <div style={{ position: "absolute", left: mx0, top: r.y - 8, width: (mx1 - mx0) * pm, height: 2, background: t.colors.ink }} />
                <div style={{ position: "absolute", left: mx0, top: r.y - 8, width: 2, height: 10, background: t.colors.ink, opacity: pm }} />
                <div style={{ position: "absolute", left: mx1, top: r.y - 8, width: 2, height: 10, background: t.colors.ink, opacity: pm }} />
                <div style={{ position: "absolute", left: mx1 + 20, top: r.y + h / 2 - 14, fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 2, color: t.colors.ink, opacity: pm, whiteSpace: "nowrap" }}>{r.mark.text}</div>
              </>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

// Newton's seven (Opticks 1704 p.92): one band divided at given fractions (red first, on the left), each segment in its
// named colour, blended about +-20 px at the boundaries; dividers dropped on cue; names on their words; one segment put
// into question (dashed dividers, a '?'); a string divided at the same stops, the notes ON the stops (Newton's colours
// are the intervals between notes; Expert S4), the string running off the left edge (his string is twice the band).
export type SpectrumDivisions = {
  fractions: number[];
  colorsNm: number[]; // one wavelength per segment for its colour
  drawAtSec?: number; // band wipes on left to right (0.9 s); omit = whole from the start
  dividersAtSec?: number;
  names?: { text: string; atSec: number }[];
  nameSize?: number; // default 22
  liftFrom?: number; // each segment starts at this opacity and comes up when its name lands (the colours named one by one)
  query?: { segment: number; atSec: number };
  chord?: { atSec: number; y?: number; notesAtSec?: number };
  brighten?: { atSec: number; from?: number }; // segments start at `from` brightness and come up one by one
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

export const Divisions: React.FC<{ d: SpectrumDivisions }> = ({ d }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x0 = d.x ?? 210;
  const y = d.y ?? 470;
  const w = d.w ?? 1500;
  const h = d.h ?? 96;
  const sum = d.fractions.reduce((a, b) => a + b, 0);
  const edges = [x0];
  d.fractions.forEach((f) => edges.push(edges[edges.length - 1] + (f / sum) * w));
  const cols = d.colorsNm.map((nm) => wavelengthRGB(nm));
  const stops: string[] = [];
  const B = 40 / w; // blend +-40 px (Designer S3)
  d.fractions.forEach((_, i) => {
    const a = (edges[i] - x0) / w;
    const b = (edges[i + 1] - x0) / w;
    stops.push(`${cols[i]} ${((i === 0 ? a : a + B) * 100).toFixed(2)}%`, `${cols[i]} ${((i === cols.length - 1 ? b : b - B) * 100).toFixed(2)}%`);
  });
  const pDraw = d.drawAtSec === undefined ? 1 : interpolate(frame, [sec(d.drawAtSec, fps), sec(d.drawAtSec + 0.9, fps)], [0, 1], clamp);
  const q = d.query;
  const pq = q ? interpolate(frame, [sec(q.atSec, fps), sec(q.atSec + 0.5, fps)], [0, 1], ease) : 0;
  const c = d.chord;
  const cy = c?.y ?? 400;
  const pStr = c ? interpolate(frame, [sec(c.atSec, fps), sec(c.atSec + 0.5, fps)], [0, 1], ease) : 0;
  const stopsX = edges.slice().reverse(); // violet end first: the whole chord G, then the stops towards red
  return (
    <>
      {/* the band as seven slices of one gradient, each dimmed by its own opacity (Designer M5), one feather over all */}
      <div style={{ position: "absolute", left: x0, top: y, width: w, height: h, clipPath: `inset(0 ${(1 - pDraw) * 100}% 0 0)`, ...FEATHER }}>
        {d.fractions.map((_, i) => {
          const b = d.brighten;
          const p = b ? interpolate(frame, [sec(b.atSec + i * 0.12, fps), sec(b.atSec + i * 0.12 + 0.4, fps)], [0, 1], ease) : 1;
          let op = b ? (b.from ?? 0.35) + (1 - (b.from ?? 0.35)) * p : 1;
          const nm = d.names?.[i];
          if (d.liftFrom !== undefined && nm) {
            const pl = interpolate(frame, [sec(nm.atSec, fps), sec(nm.atSec + 0.4, fps)], [0, 1], ease);
            op *= d.liftFrom + (1 - d.liftFrom) * pl;
          }
          const l = edges[i] - x0;
          return (
            <div key={`s${i}`} style={{ position: "absolute", left: l, top: 0, width: edges[i + 1] - edges[i] + 0.5, height: h, opacity: op, background: `linear-gradient(90deg, ${stops.join(", ")})`, backgroundSize: `${w}px ${h}px`, backgroundPosition: `${-l}px 0` }} />
          );
        })}
      </div>
      {d.dividersAtSec !== undefined
        ? edges.slice(1, -1).map((ex, i) => {
            const p = interpolate(frame, [sec(d.dividersAtSec! + i * 0.08, fps), sec(d.dividersAtSec! + i * 0.08 + 0.35, fps)], [0, 1], ease);
            const dashed = q && (i === q.segment - 1 || i === q.segment) && pq > 0;
            return p > 0 ? (
              <div key={`d${i}`} style={{ position: "absolute", left: ex - 1, top: y - 6 - 20 * (1 - p), width: 2, height: h + 12, opacity: p, background: dashed ? `repeating-linear-gradient(180deg, ${t.colors.ink} 0 10px, transparent 10px 18px)` : t.colors.ink }} />
            ) : null;
          })
        : null}
      {(d.names ?? []).map((n, i) => {
        const p = interpolate(frame, [sec(n.atSec, fps), sec(n.atSec + 0.5, fps)], [0, 1], ease);
        return p > 0 ? (
          <div key={`n${i}`} style={{ position: "absolute", left: (edges[i] + edges[i + 1]) / 2 - 100, top: y + h + 24 + 10 * (1 - p), width: 200, textAlign: "center", fontFamily: t.fonts.mono, fontSize: d.nameSize ?? 22, letterSpacing: 2, color: t.colors.ink, opacity: p }}>
            {n.text}
          </div>
        ) : null;
      })}
      {q && pq > 0 ? (
        <div style={{ position: "absolute", left: (edges[q.segment] + edges[q.segment + 1]) / 2 - 40, top: y + h + 64, width: 80, textAlign: "center", fontFamily: t.fonts.headline, fontWeight: 600, fontSize: 72, color: t.colors.accent, opacity: pq, transform: `scale(${0.8 + 0.2 * pq})` }}>?</div>
      ) : null}
      {c && pStr > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* the string: from off the left edge (the rest of his chord) to the violet end */}
          <line x1={-20} y1={cy} x2={-20 + (x0 + w + 20) * pStr} y2={cy} stroke={t.colors.ink} strokeWidth={3} />
          {stopsX.map((sx, i) => {
            const p = interpolate(frame, [sec((c.notesAtSec ?? c.atSec + 0.3) + i * 0.08, fps), sec((c.notesAtSec ?? c.atSec + 0.3) + i * 0.08 + 0.35, fps)], [0, 1], ease);
            if (p <= 0) return null;
            const hollow = i === stopsX.length - 1; // the band's red end (x 210): the octave of the whole chord, drawn open
            return (
              <g key={i} opacity={p} transform={`translate(${sx} ${cy}) scale(${0.7 + 0.3 * p})`}>
                <line x1={0} y1={-14} x2={0} y2={14} stroke={t.colors.ink} strokeWidth={2} />
                <ellipse cx={0} cy={-34} rx={14} ry={10} transform="rotate(-20 0 -34)" fill={hollow ? "none" : t.colors.ink} stroke={t.colors.ink} strokeWidth={3} />
                <line x1={13} y1={-37} x2={13} y2={-84} stroke={t.colors.ink} strokeWidth={3} />
              </g>
            );
          })}
        </svg>
      ) : null}
    </>
  );
};
