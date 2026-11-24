import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { reveal, sec, SLOW_OUT } from "../motion";
import { Icon, type ChainIcon } from "./EvidenceChain";

// VIS-055 TimelineRail (Vox, 'Why the right can't stop talking about communism' and 'Why are fewer Black Americans
// getting GLP-1s?', History Can't Hide; 'How US intervention is changing Venezuela'; analysis only; Sam, 23 Nov 2026:
// "Pay attention to how new objects are brought in on to the screen and how they leave the screen").
// A single ruled line across the frame is the horizon of time. The camera pans along it to each year (1-2 s, eased),
// so earlier things are carried off the left edge, never faded. Things rise up from behind the line on their word
// (masked by the line), a small stem drops from them to their tick, and their name tag wipes on after them. They leave
// in the reverse order: the tag un-wipes first, then the thing sinks back behind the line (accelerating). Years
// ahead of the camera sit pale and turn solid as the camera reaches them.
// Best use: a life or a story told in dated steps (born 1766, Kendal 1781, the paper 1794, the eye 1844, the test 1995).
// Limit: 2-6 items; pans 1-2 s, only on spoken years; max 2 per act; real registered pictures, own icons, or text.
type Item = {
  year: number;
  atSec: number; // rises on its word
  untilSec?: number; // tag un-wipes here, then it sinks
  srcId?: string;
  file?: string;
  focus?: readonly [number, number];
  icon?: ChainIcon;
  text?: string; // a short line on a paper slip
  label?: string; // the name tag (accent chip)
  w?: number;
  h?: number;
};
export type TimelineRailProps = {
  from: number;
  to: number;
  pxPerYear: number;
  majorEvery?: number; // labelled ticks (default 10)
  cams: { atSec: number; year: number; sec?: number }[];
  items: Item[];
  caption?: string;
  startSec?: number;
  yearLabels?: number[]; // label only these years (act 4: 1666, 1766), instead of the decade ticks
  accents?: { year: number; atSec: number }[]; // a year label turns accent on its word
  bracket?: { fromYear: number; toYear: number; atSec: number; text?: string; y?: number; sec?: number }; // a span drawn under the labels
  labelTone?: "accent" | "chip"; // name tags: accent chip (default, acts 1-3) or a dark credit chip (Designer, 25 Nov 2026)
};

const RAIL_Y = 700;
const inOut = Easing.bezier(0.45, 0, 0.15, 1);
const sink = Easing.bezier(0.55, 0, 0.9, 0.4);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Picture: React.FC<{ it: Item; w: number; h: number }> = ({ it, w, h }) => {
  const src = useSourceFile(it.srcId as string, it.file);
  const f = it.focus ?? [0.5, 0.3];
  return <Img src={src} style={{ width: w, height: h, objectFit: "cover", objectPosition: `${f[0] * 100}% ${f[1] * 100}%`, display: "block", filter: "grayscale(0.2) sepia(0.15) contrast(1.04)" }} />;
};

export const TimelineRail: React.FC<TimelineRailProps> = ({
  labelTone = "accent", from, to, pxPerYear, majorEvery = 10, cams, items, caption, startSec = 0, yearLabels, accents = [], bracket }) => {
  useAssets(["VIS-055", "MOT-013", "MOT-002", ...items.filter((i) => i.srcId).map((i) => i.srcId as string)]);
  if (items.length < 2 || items.length > 6) throw new Error("TimelineRail: 2-6 items.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // camera: the year at the frame's centre, eased between spoken years
  let cy = cams[0].year;
  for (const k of cams.slice(1)) {
    const d = k.sec ?? 1.4;
    if (d < 1 || d > 2) throw new Error("TimelineRail: pans take 1-2 s.");
    const p = inOut(interpolate(frame, [sec(k.atSec, fps), sec(k.atSec + d, fps)], [0, 1], clamp));
    cy = cy + (k.year - cy) * p;
  }
  const X = (y: number) => 960 + (y - cy) * pxPerYear;
  const pIn = reveal(frame, fps, startSec, 0.75);
  const ticks: number[] = yearLabels ? [...yearLabels] : [];
  if (!yearLabels) for (let y = Math.ceil(from / majorEvery) * majorEvery; y <= to; y += majorEvery) ticks.push(y);
  items.forEach((it) => {
    if (!ticks.includes(it.year)) ticks.push(it.year);
  });
  const pale = (y: number) => {
    const it = items.find((i) => i.year === y);
    if (it && frame >= sec(it.atSec, fps)) return 1;
    return y > cy + 0.5 ? 0.35 : 1;
  };
  const accentK = (y: number) => {
    const a = accents.find((q) => q.year === y);
    return a ? interpolate(frame, [sec(a.atSec, fps), sec(a.atSec + 0.4, fps)], [0, 1], clamp) : 0;
  };
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      {/* the rail */}
      <div style={{ position: "absolute", left: 0, right: 0, top: RAIL_Y, height: 3, background: t.colors.ink, opacity: 0.85 }} />
      {ticks.map((y) => {
        const x = X(y);
        if (x < -100 || x > 2020) return null;
        return (
          <React.Fragment key={y}>
            <div style={{ position: "absolute", left: x - 5, top: RAIL_Y - 4, width: 10, height: 10, background: t.colors.ink, opacity: pale(y) }} />
            <div style={{ position: "absolute", left: x, top: RAIL_Y + 26, transform: "translateX(-50%)", fontFamily: t.fonts.serif, fontSize: 40, color: accentK(y) > 0.5 ? t.colors.accent : t.colors.ink, opacity: pale(y) }}>{y}</div>
          </React.Fragment>
        );
      })}
      {/* things rise from behind the rail: everything above it is clipped at the line */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: RAIL_Y, overflow: "hidden" }}>
        {items.map((it, i) => {
          const w = it.w ?? (it.srcId ? 230 : it.text ? 320 : 150);
          const h = it.h ?? (it.srcId ? 290 : it.text ? 150 : 150);
          const up = interpolate(frame, [sec(it.atSec, fps), sec(it.atSec + 0.7, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
          const down = it.untilSec !== undefined ? sink(interpolate(frame, [sec(it.untilSec + 0.4, fps), sec(it.untilSec + 0.85, fps)], [0, 1], clamp)) : 0;
          const lift = up * (1 - down);
          if (lift <= 0) return null;
          const x = X(it.year);
          const bottom = RAIL_Y - 64; // the thing stands above its stem
          const y = bottom - h + (1 - lift) * (h + 70);
          return (
            <div key={i} style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h }}>
              {it.srcId ? (
                <div style={{ width: w, height: h, boxShadow: "0 10px 26px rgba(0,0,0,0.28)", border: `6px solid ${t.colors.panel}` }}>
                  <Picture it={it} w={w - 12} h={h - 12} />
                </div>
              ) : it.icon ? (
                <svg width={w} height={h} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
                  <Icon k={it.icon} c={t.colors.ink} s={Math.min(w, h) * 0.8} />
                </svg>
              ) : (
                <div style={{ width: w, height: h, background: t.colors.panel, boxShadow: "0 10px 26px rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, boxSizing: "border-box", fontFamily: t.fonts.serif, fontSize: 30, lineHeight: 1.2, color: t.colors.ink, textAlign: "center" }}>{it.text}</div>
              )}
              {/* the stem to the tick */}
              <div style={{ position: "absolute", left: w / 2 - 1, top: h + 8, width: 0, height: 52, borderLeft: `2px dotted ${t.colors.ink}`, opacity: 0.6 }} />
            </div>
          );
        })}
      </div>
      {/* name tags: wipe on after the thing has risen, un-wipe before it sinks */}
      {items.map((it, i) => {
        if (!it.label) return null;
        const w = it.w ?? (it.srcId ? 230 : it.text ? 320 : 150);
        const on = interpolate(frame, [sec(it.atSec + 0.55, fps), sec(it.atSec + 0.95, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
        const off = it.untilSec !== undefined ? interpolate(frame, [sec(it.untilSec, fps), sec(it.untilSec + 0.4, fps)], [0, 1], clamp) : 0;
        if (on <= 0 || off >= 1) return null;
        const x = X(it.year) + w / 2 - 20;
        return (
          <div key={`l${i}`} style={{ position: "absolute", left: x, top: RAIL_Y - 120, whiteSpace: "nowrap", fontFamily: t.fonts.mono, fontSize: labelTone === "chip" ? 22 : 24, letterSpacing: 2, color: labelTone === "chip" ? t.colors.ink : t.colors.canvas, background: labelTone === "chip" ? t.colors.chip : t.colors.accent, padding: "5px 11px", clipPath: `inset(-2px ${((1 - on) * 100).toFixed(1)}% -2px ${(off * 100).toFixed(1)}%)` }}>
            {it.label}
          </div>
        );
      })}
      {bracket ? (() => {
        const d = interpolate(frame, [sec(bracket.atSec, fps), sec(bracket.atSec + (bracket.sec ?? 1.3), fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
        if (d <= 0) return null;
        const xa = X(bracket.fromYear);
        const xb = X(bracket.toYear);
        const by = bracket.y ?? RAIL_Y + 90;
        const xe = xa + (xb - xa) * d;
        return (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              <path d={`M ${xa} ${by - 14} L ${xa} ${by} L ${xe} ${by}${d >= 1 ? ` L ${xb} ${by - 14}` : ""}`} fill="none" stroke={t.colors.ink} strokeWidth={2.5} strokeOpacity={0.85} />
            </svg>
            {bracket.text ? (
              <div style={{ position: "absolute", left: (xa + xb) / 2, top: by + 16, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "5px 11px", opacity: interpolate(d, [0.5, 1], [0, 1], clamp) }}>{bracket.text}</div>
            ) : null}
          </>
        );
      })() : null}
      {caption ? <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};
