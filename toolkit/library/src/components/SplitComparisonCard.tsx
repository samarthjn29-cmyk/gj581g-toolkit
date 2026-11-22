import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { exit, lock, reveal, rise, sec, SLOW_OUT } from "../motion";
import { cropToBox, type Rect } from "../layers/CropImage";
import { VectorTraceConnector } from "../layers/VectorTraceConnector";

// VIS-008 SplitComparisonCard: two to four real pictures side by side as equal panels, each with its label; on its
// word each panel takes a SAME (or other) stamp that locks on (MOT-003). The panels can dim back so names come
// forward, and an optional MOT-005 thread joins two names. A line of type sits above the panels.
export type ComparisonPanel = {
  srcId: string;
  file?: string;
  kind: "image" | "video";
  size: readonly [number, number];
  crop?: Rect; // image pixels; for video the frame is covered around `focus`
  focus?: number;
  label: string;
  atSec: number;
  stamp?: { text: string; atSec: number };
  multiply?: string; // tint a pale object (e.g. stockings as reported), with mask
  mask?: string;
};
export type SplitComparisonCardProps = {
  panels: ComparisonPanel[];
  lines?: { text: string; atSec: number; untilSec?: number }[];
  dimAtSec?: number;
  names?: { text: string; atSec: number }[];
  thread?: { atSec: number; drawSec?: number };
  startSec?: number;
};

const Panel: React.FC<{ p: ComparisonPanel; x: number; w: number; h: number; top: number; dim: number }> = ({ p, x, w, h, top, dim }) => {
  const t = useTheme();
  const src = useSourceFile(p.srcId, p.file);
  const msk = p.mask ? useSourceFile(p.srcId, p.mask) : undefined; // eslint-disable-line react-hooks/rules-of-hooks
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = reveal(frame, fps, p.atSec, 0.75);
  const st = p.stamp ? lock(frame, fps, p.stamp.atSec) : 0;
  let pic: React.ReactNode;
  if (p.kind === "video") {
    const sc = Math.max(w / p.size[0], h / p.size[1]);
    const vw = p.size[0] * sc, vh = p.size[1] * sc;
    const topv = Math.min(0, Math.max(h - vh, h / 2 - (p.focus ?? 0.5) * vh));
    pic = <OffthreadVideo src={src} muted style={{ position: "absolute", left: (w - vw) / 2, top: topv, width: vw, height: vh, maxWidth: "none", filter: "sepia(0.3) saturate(1.15)" }} />;
  } else {
    const c = p.crop ?? ([0, 0, p.size[0], p.size[1]] as const);
    const { s, ox, oy } = cropToBox(c, w, h, "cover");
    const box: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: p.size[0] * s, height: p.size[1] * s, maxWidth: "none" };
    pic = (
      <>
        <Img src={src} style={box} />
        {p.multiply && msk ? <div style={{ ...box, background: p.multiply, mixBlendMode: "multiply", WebkitMaskImage: `url(${msk})`, maskImage: `url(${msk})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} /> : null}
      </>
    );
  }
  return (
    <div style={{ position: "absolute", left: x, top, width: w, ...rise(a, 30) }}>
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,0.45)", filter: `brightness(${(1 - 0.55 * dim).toFixed(3)}) saturate(${(1 - 0.5 * dim).toFixed(3)})` }}>{pic}</div>
      <div style={{ marginTop: 18, fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 3, color: t.colors.secondary, textAlign: "center", opacity: 1 - 0.5 * dim }}>{p.label}</div>
      {p.stamp && st > 0 ? (
        <div style={{ position: "absolute", left: "50%", top: h * 0.42, transform: `translate(-50%, -50%) rotate(-7deg) scale(${(1.25 - 0.25 * st).toFixed(3)})`, opacity: st * (1 - 0.6 * dim), fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 54, letterSpacing: 8, color: t.colors.accent, border: `4px solid ${t.colors.accent}`, borderRadius: 6, padding: "6px 22px", background: "rgba(0,0,0,0.25)" }}>{p.stamp.text}</div>
      ) : null}
    </div>
  );
};

export const SplitComparisonCard: React.FC<SplitComparisonCardProps> = ({ panels, lines = [], dimAtSec, names = [], thread, startSec = 0 }) => {
  useAssets(["VIS-008", "MOT-002", "MOT-003", ...(thread ? ["MOT-005"] : [])]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = panels.length;
  if (n < 2 || n > 4) throw new Error("SplitComparisonCard takes 2-4 panels.");
  const gap = 48;
  const w = Math.floor((1920 - 2 * t.safe.x - gap * (n - 1)) / n);
  const h = Math.min(560, Math.round(w * 1.05));
  const top = 300;
  const dim = dimAtSec !== undefined ? interpolate(frame, [sec(dimAtSec, fps), sec(dimAtSec + 0.9, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT }) : 0;
  const nameY = top + h / 2;
  const nameXs = names.length === 2 ? [660, 1260] : names.map((_, i) => 960 + (i - (names.length - 1) / 2) * 520);
  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6) }}>
      {lines.map((l) => {
        const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
        const out = l.untilSec !== undefined ? exit(frame, fps, l.untilSec, t.motion.enterSec) : 1;
        return (
          <div key={`${l.text}${l.atSec}`} style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: t.fonts.headline, fontWeight: t.fonts.headlineWeight, fontSize: 72, color: t.colors.ink, ...rise(p * out, 20) }}>
            {l.text}
          </div>
        );
      })}
      {panels.map((p, i) => (
        <Panel key={p.label} p={p} x={t.safe.x + i * (w + gap)} w={w} h={h} top={top} dim={dim} />
      ))}
      {thread && names.length >= 2 ? <VectorTraceConnector id="names" spec={{ from: [nameXs[0] + 150, nameY], to: [nameXs[1] - 150, nameY], atSec: thread.atSec, drawSec: thread.drawSec ?? 1.0, tone: "ink", width: 4, bend: -0.12, endRing: false }} /> : null}
      {names.map((nm, i) => {
        const p = lock(frame, fps, nm.atSec);
        return (
          <div key={nm.text} style={{ position: "absolute", left: nameXs[i], top: nameY, transform: `translate(-50%, -50%) scale(${(0.92 + 0.08 * p).toFixed(3)})`, opacity: p, fontFamily: t.fonts.mono, fontSize: 52, letterSpacing: 8, color: t.colors.ink, background: t.colors.chip, padding: "14px 28px", borderRadius: 6, borderBottom: `4px solid ${t.colors.accent}` }}>
            {nm.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
