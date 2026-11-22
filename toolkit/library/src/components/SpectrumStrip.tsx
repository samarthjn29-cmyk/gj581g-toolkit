import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, lock, reveal, rise } from "../motion";
import { spectrumGradient } from "../layers/spectrum";

// VIS-014 SpectrumStrip: the visible spectrum with wavelength ticks and markers that lock on in turn.
export type SpectrumStripProps = {
  markers?: { nm: number; label: string; atSec?: number }[];
  title?: string;
  caption?: string;
  fromNm?: number;
  toNm?: number;
  startSec?: number;
};

export const SpectrumStrip: React.FC<SpectrumStripProps> = ({ markers = [], title, caption, fromNm = 380, toNm = 700, startSec = 0 }) => {
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
