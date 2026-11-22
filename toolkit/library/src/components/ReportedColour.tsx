import React from "react";
import { AbsoluteFill, Img, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { drift, reveal, sec, snap, SLOW_OUT } from "../motion";
import { cropToBox, type Rect } from "../layers/CropImage";
import { Label, type LabelSpec } from "../layers/Label";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";
import { PrintScreenOverlay } from "../layers/PrintScreenOverlay";

// VIS-035 ReportedColour: a real photo of an object shown in the colour each person REPORTED, with their name.
// The photo's shape and light stay; only its colour is set from the words, through a mask of the object and a
// multiply layer (white = the photo as it is). A REPORTED COLOURS tag stays on screen the whole shot: this is an
// illustration of what people said, never a measurement and never "what a colour-blind person sees".
// States change on their words with a calm ease, or with MOT-011 snap for the act's one crisp move.
export type ReportedState = { atSec: number; color: string | null; snap?: boolean; sec?: number };
export type ReportedPerson = { name: string; color: string; colorName: string; atSec: number; x: number; y: number; untilSec?: number };
export type ReportedColourProps = {
  srcId: string;
  file: string; // the flat photo
  mask: string; // its object mask (PNG alpha), registered on the same source
  size: readonly [number, number];
  crop?: Rect;
  states: ReportedState[];
  people?: ReportedPerson[];
  labels?: LabelSpec[];
  tag?: DatelineTagProps;
  caption: string; // e.g. "STOCKINGS OF THE PERIOD · RIJKSMUSEUM"
  printScreen?: number; // TEX-006 strength (<= 0.15)
  startSec?: number;
};

export const ReportedColour: React.FC<ReportedColourProps> = ({ srcId, file, mask, size, crop, states, people = [], labels = [], tag, caption, printScreen, startSec = 0 }) => {
  useAssets(["VIS-035", "MOT-001", ...(states.some((s) => s.snap) ? ["MOT-011"] : [])]);
  const t = useTheme();
  const img = useSourceFile(srcId, file);
  const msk = useSourceFile(srcId, mask);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const now = frame / fps;
  // the colour now: blend from the previous state into the latest one that has started
  let color = "#FFFFFF";
  let prev = "#FFFFFF";
  for (const st of states) {
    if (now < st.atSec) break;
    const target = st.color ?? "#FFFFFF";
    const p = st.snap ? snap(frame, fps, st.atSec, st.sec ?? 0.6) : interpolate(frame, [sec(st.atSec, fps), sec(st.atSec + (st.sec ?? 0.9), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
    prev = color;
    color = interpolateColors(p, [0, 1], [prev, target]);
  }
  const c = crop ?? ([0, 0, size[0], size[1]] as const);
  const { s, ox, oy } = cropToBox(c, 1920, 1080, "cover");
  const box: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: size[0] * s, height: size[1] * s, maxWidth: "none" };
  const pIn = reveal(frame, fps, startSec, 0.9);
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.025)})` }}>
        <Img src={img} style={{ ...box, filter: "contrast(1.03)" }} />
        <div style={{ ...box, background: color, mixBlendMode: "multiply", WebkitMaskImage: `url(${msk})`, maskImage: `url(${msk})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.32) 100%)" }} />
      </AbsoluteFill>
      {printScreen ? <PrintScreenOverlay strength={printScreen} /> : null}
      {people.map((p) => (
        <PersonChip key={`${p.name}${p.atSec}`} p={p} />
      ))}
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
      <div style={{ position: "absolute", right: t.safe.x, top: t.safe.y, fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "8px 14px", borderRadius: 4, borderLeft: `3px solid ${t.colors.accent}`, opacity: pIn }}>REPORTED COLOURS</div>
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, opacity: pIn }}>{caption}</div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};

const PersonChip: React.FC<{ p: ReportedPerson }> = ({ p }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = reveal(frame, fps, p.atSec, 0.75);
  const out = p.untilSec !== undefined ? 1 - reveal(frame, fps, p.untilSec, 0.6) : 1;
  if (a * out <= 0) return null;
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%, ${((1 - a) * 16).toFixed(1)}px)`, opacity: a * out, display: "flex", alignItems: "center", gap: 14, fontFamily: t.fonts.mono, fontSize: 28, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "10px 16px", borderRadius: 4 }}>
      <span>{p.name}</span>
      <span style={{ width: 30, height: 30, borderRadius: 3, background: p.color, border: `2px solid ${t.colors.ink}` }} />
      <span style={{ color: t.colors.secondary }}>{p.colorName}</span>
    </div>
  );
};
