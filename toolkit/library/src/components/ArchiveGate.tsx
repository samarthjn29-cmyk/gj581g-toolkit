import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";

// VIS-056 ArchiveGate (Johnny Harris, 'Why Egypt Guards This River With an Army' and 'The REAL reason the US can't
// beat Iran': archive pictures shown in a rounded projector gate on black, each slide fitted to its own shape, a
// two-frame black between slides like a slide projector changing, then the gate opens out to fill the frame when the
// story steps into the archive; analysis only; Sam, 23 Nov 2026: "Pay attention to how new objects are brought in on
// to the screen and how they leave the screen").
// The first slide arrives from 96% out of black; each later slide replaces it after a 2-frame black; every slide
// drifts 3% and the gate weaves a little (on threes). `bleedAtSec` opens the gate to full frame (0.9 s), the corners
// squaring as it grows. Each slide keeps its own source chip under the gate.
// Best use: a run of real period pictures (engravings, portraits, plates, pages) about one moment. Limit: 2-6 slides,
// each 1.5-3 s (the last may run on); max 2 per act; registered sources only, each with its chip; never presented as
// moving film when it is a still.
export type GateSlide = { srcId: string; file?: string; imgSize: readonly [number, number]; atSec: number; focus?: readonly [number, number]; label: string };
export type ArchiveGateProps = { slides: GateSlide[]; bleedAtSec?: number; startSec?: number };

const GATE_W = 1440;
const GATE_H = 830;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Slide: React.FC<{ s: GateSlide; local: number; len: number; bleed: number }> = ({ s, local, len, bleed }) => {
  const src = useSourceFile(s.srcId, s.file);
  const { fps } = useVideoConfig();
  // fit the picture to the gate by its own shape, then grow towards cover as the gate opens
  const fit = Math.min(GATE_W / s.imgSize[0], GATE_H / s.imgSize[1]);
  const cover = Math.max(1920 / s.imgSize[0], 1080 / s.imgSize[1]);
  const sc = fit + (cover - fit) * bleed;
  const w = s.imgSize[0] * sc;
  const h = s.imgSize[1] * sc;
  const push = 1 + 0.03 * Math.min(1, local / Math.max(1, len));
  const f = s.focus ?? [0.5, 0.5];
  const k = Math.floor((local * fps) / 3);
  const wx = (random(`gw-x-${k}`) - 0.5) * 1.2 * (1 - bleed);
  const wy = (random(`gw-y-${k}`) - 0.5) * 1.2 * (1 - bleed);
  return (
    <div style={{ position: "absolute", left: 960 - w / 2 + wx, top: 520 - h / 2 + wy + bleed * 20, width: w, height: h, borderRadius: 26 * (1 - bleed), overflow: "hidden", boxShadow: bleed < 1 ? `0 0 ${40 * (1 - bleed)}px rgba(255,244,220,${(0.12 * (1 - bleed)).toFixed(3)})` : undefined }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})`, transformOrigin: `${f[0] * 100}% ${f[1] * 100}%`, filter: "sepia(0.25) contrast(1.08) brightness(0.96)" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,${(0.5 * (1 - bleed * 0.6)).toFixed(2)}) 100%)` }} />
    </div>
  );
};

export const ArchiveGate: React.FC<ArchiveGateProps> = ({ slides, bleedAtSec, startSec = 0 }) => {
  useAssets(["VIS-056", "MOT-001", ...slides.map((s) => s.srcId)]);
  if (slides.length < 2 || slides.length > 6) throw new Error("ArchiveGate: 2-6 slides.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const now = frame / fps;
  const ends = slides.map((s, i) => (i + 1 < slides.length ? slides[i + 1].atSec : durationInFrames / fps));
  slides.forEach((s, i) => {
    const len = ends[i] - s.atSec;
    if (i < slides.length - 1 && (len < 1.5 || len > 3)) throw new Error(`ArchiveGate: slide ${i + 1} runs ${len.toFixed(2)} s (1.5-3 s).`);
  });
  let cur = 0;
  slides.forEach((s, i) => {
    if (now >= s.atSec) cur = i;
  });
  const s = slides[cur];
  const localF = frame - sec(s.atSec, fps);
  const dark = cur > 0 && localF < 2; // the projector changing slides
  const pIn = interpolate(frame, [sec(startSec, fps), sec(startSec + 0.6, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
  const bleed = bleedAtSec !== undefined ? Easing.inOut(Easing.cubic)(interpolate(frame, [sec(bleedAtSec, fps), sec(bleedAtSec + 0.9, fps)], [0, 1], clamp)) : 0;
  return (
    <AbsoluteFill style={{ background: "rgba(8,7,6,1)" }}>
      {!dark ? (
        <AbsoluteFill style={{ opacity: cur === 0 ? pIn : 1, transform: cur === 0 ? `scale(${0.96 + 0.04 * pIn})` : undefined }}>
          <Slide s={s} local={now - s.atSec} len={ends[cur] - s.atSec} bleed={bleed} />
        </AbsoluteFill>
      ) : null}
      {!dark ? (
        <div style={{ position: "absolute", left: bleed > 0.5 ? t.safe.x : 960, bottom: bleed > 0.5 ? 60 : 1080 - (520 + GATE_H / 2) - 54, transform: bleed > 0.5 ? undefined : "translateX(-50%)", fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, whiteSpace: "nowrap", opacity: cur === 0 ? pIn : 1 }}>
          {s.label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
