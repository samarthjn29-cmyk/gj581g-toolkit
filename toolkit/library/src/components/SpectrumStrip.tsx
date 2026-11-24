import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, lock, reveal, rise } from "../motion";
import { spectrumGradient, wavelengthRGB } from "../layers/spectrum";
import { Label, type LabelSpec } from "../layers/Label";
import { interpolate } from "remotion";
import { sec, SLOW_OUT } from "../motion";

// VIS-014 SpectrumStrip: the visible spectrum with wavelength ticks and markers that lock on in turn.
export type SpectrumStripProps = {
  markers?: { nm: number; label: string; atSec?: number }[];
  title?: string;
  caption?: string;
  fromNm?: number;
  toNm?: number;
  startSec?: number;
  // two-track mode (WCL-E01 act 3 a3-07, the Director's S_prism_world): a top track of the six colours others name,
  // drawn left to right from x 210 as discrete bands, and a lower track for what Dalton says he sees: an opaque panel
  // while empty that fills on cue (his yellow dimmed at the red end, one yellow strong to pale under orange-yellow-green,
  // blue, darker blue).
  // No nm ticks and no title in this mode; the track names are mono chips. `count`: a serif line typed in place.
  tracks?: TwoTrack;
  labels?: LabelSpec[];
  // transparent: no canvas of its own (drawn over another component's world, e.g. LayerStage's overlay plane)
};
export type TwoTrack = {
  drawAtSec: number;
  drawSec?: number;
  lowerAtSec: number;
  fills: { band: "red" | "yellow" | "blue" | "purple"; atSec: number }[];
  count?: { text: string; atSec: number; x?: number; y?: number; untilSec?: number };
};
// the six named colours as physical wavelength colours (layers/spectrum.ts), not theme colours
const BANDS = [650, 605, 578, 530, 470, 420].map((nm) => wavelengthRGB(nm));
// Dalton's words (p.31): red 'little more than a shade' (dim, not black); one yellow 'from an intense to a rare
// yellow' under orange, yellow and green; his blue under blue; purple 'blue much darkened'
const Y = wavelengthRGB(578);
const LOWER: Record<string, { x0: number; x1: number; bg: string; f?: string }> = {
  // the red end is his yellow, dimmed (Dalton 1798 p.31: his yellow covers "the red, orange, yellow, and green of
  // others"; the red part "little more than a shade, or defect of light"; Subject Expert, act 3 v6: never a red hue)
  red: { x0: 0, x1: 1, bg: Y, f: "brightness(0.28)" },
  yellow: { x0: 1, x1: 4, bg: `linear-gradient(90deg, ${Y} 0%, ${Y} 30%, rgba(236,226,170,1) 100%)` },
  blue: { x0: 4, x1: 5, bg: wavelengthRGB(470) },
  purple: { x0: 5, x1: 6, bg: wavelengthRGB(470), f: "brightness(0.5)" },
};

const TwoTracks: React.FC<{ tr: TwoTrack }> = ({ tr }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x0 = 210;
  const bw = 250;
  const yTop = 470;
  const yLow = 598;
  const h = 96;
  const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT } as const;
  const pDraw = interpolate(frame, [sec(tr.drawAtSec, fps), sec(tr.drawAtSec + (tr.drawSec ?? 1.4), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pLow = interpolate(frame, [sec(tr.lowerAtSec, fps), sec(tr.lowerAtSec + 0.6, fps)], [0, 1], ease);
  const c = tr.count;
  const pType = c ? interpolate(frame, [sec(c.atSec, fps), sec(c.atSec + Math.min(1.6, c.text.length * 0.035), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const cOut = c?.untilSec !== undefined ? interpolate(frame, [sec(c.untilSec, fps), sec(c.untilSec + 0.6, fps)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <>
      {BANDS.map((col, i) => {
        const f = Math.min(1, Math.max(0, pDraw * 6 - i));
        return f > 0 ? <div key={i} style={{ position: "absolute", left: x0 + i * bw, top: yTop, width: bw * f, height: h, background: col, borderRadius: i === 0 ? "6px 0 0 6px" : i === 5 ? "0 6px 6px 0" : 0 }} /> : null;
      })}
      {pLow > 0 ? <div style={{ position: "absolute", left: x0, top: yLow, width: bw * 6, height: h, background: t.colors.panel, border: `2px solid ${t.colors.hairline}`, borderRadius: 6, opacity: pLow, boxSizing: "border-box" }} /> : null}
      {tr.fills.map((fl, i) => {
        const L = LOWER[fl.band];
        const p = interpolate(frame, [sec(fl.atSec, fps), sec(fl.atSec + 0.9, fps)], [0, 1], ease);
        return p > 0 ? <div key={i} style={{ position: "absolute", left: x0 + L.x0 * bw, top: yLow, width: (L.x1 - L.x0) * bw * p, height: h, background: L.bg, filter: L.f, borderRadius: L.x0 === 0 ? "6px 0 0 6px" : L.x1 === 6 ? "0 6px 6px 0" : 0 }} /> : null;
      })}
      {c && pType > 0 && cOut > 0 ? (
        <div style={{ position: "absolute", left: c.x ?? x0, top: c.y ?? 790, fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 40, color: t.colors.ink, opacity: cOut, whiteSpace: "nowrap" }}>
          {c.text.slice(0, Math.round(c.text.length * pType))}
        </div>
      ) : null}
    </>
  );
};

export const SpectrumStrip: React.FC<SpectrumStripProps> = ({ markers = [], title, caption, fromNm = 380, toNm = 700, startSec = 0, tracks, labels = [] }) => {
  useAssets(["VIS-014", "MOT-001", "MOT-002", "MOT-003"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const x0 = 210;
  const w = 1500;
  const y = 470;
  const h = 96;
  const X = (nm: number) => x0 + ((nm - fromNm) / (toNm - fromNm)) * w;
  const pWipe = reveal(frame, fps, startSec + 0.1, 0.9);
  const pTitle = reveal(frame, fps, startSec, t.motion.enterSec);
  const ticks = [];
  for (let nm = Math.ceil(fromNm / 50) * 50; nm <= toNm; nm += 50) ticks.push(nm);

  if (tracks)
    return (
      <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        <TwoTracks tr={tracks} />
        {labels.map((l) => (
          <Label key={`${l.text}${l.atSec}`} spec={l} />
        ))}
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      {title ? (
        <div style={{ position: "absolute", left: x0, top: 250, fontFamily: t.fonts.headline, fontWeight: t.fonts.headlineWeight, letterSpacing: t.fonts.headlineTracking, fontSize: 62, color: t.colors.ink, ...rise(pTitle) }}>
          {title}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y,
          width: w,
          height: h,
          borderRadius: 6,
          background: spectrumGradient(fromNm, toNm),
          clipPath: `inset(0 ${(1 - pWipe) * 100}% 0 0)`,
          boxShadow: `0 0 60px rgba(0,0,0,0.35)`,
        }}
      />
      {ticks.map((nm) => (
        <div key={nm} style={{ position: "absolute", left: X(nm) - 40, top: y + h + 16, width: 80, textAlign: "center", fontFamily: t.fonts.mono, fontSize: 20, color: t.colors.secondary, opacity: pWipe }}>
          {nm}
        </div>
      ))}
      <div style={{ position: "absolute", left: x0 + w + 40, top: y + h + 16, fontFamily: t.fonts.mono, fontSize: 20, color: t.colors.secondary, opacity: pWipe }}>nm</div>
      {markers.map((m, i) => {
        const p = lock(frame, fps, m.atSec ?? startSec + 1.2 + i * 0.6);
        return (
          <div key={`${m.nm}-${i}`} style={{ position: "absolute", left: X(m.nm) - 2, top: y - 40 - 24 * (1 - p), opacity: p }}>
            <div style={{ width: 4, height: h + 80, background: t.colors.ink, borderRadius: 2 }} />
            <div
              style={{
                position: "absolute",
                top: i % 2 ? -104 : -56,
                left: -75,
                width: 150,
                textAlign: "center",
                fontFamily: t.fonts.mono,
                fontSize: 22,
                color: t.colors.ink,
                background: t.colors.chip,
                padding: "6px 0",
                borderRadius: 4,
              }}
            >
              {m.label}
            </div>
          </div>
        );
      })}
      {caption ? (
        <div style={{ position: "absolute", left: x0, top: 760, width: w, fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 40, color: t.colors.secondary, ...rise(reveal(frame, fps, startSec + 1, t.motion.enterSec), 16) }}>
          {caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
