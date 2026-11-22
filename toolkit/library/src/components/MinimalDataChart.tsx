import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, rise } from "../motion";

// VIS-002 MinimalDataChart (beat type 2: statistic or contrast, peak).
// One to three horizontal bars, counting numbers in tabular figures, the hero bar in the accent.
export type MinimalDataChartProps = {
  title: string;
  bars: { label: string; value: number; hero?: boolean }[];
  unit?: string;
  decimals?: number;
  source: string;
  startSec?: number;
};

export const MinimalDataChart: React.FC<MinimalDataChartProps> = ({
  title,
  bars,
  unit = "",
  decimals = 0,
  source,
  startSec = 0,
}) => {
  useAssets(["VIS-002", "MOT-001", "MOT-002"]);
  if (bars.length < 1 || bars.length > 3) throw new Error("MinimalDataChart takes 1-3 bars.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const st = t.motion.staggerSec;
  const max = Math.max(...bars.map((b) => b.value));
  const trackW = 1180;
  const pTitle = reveal(frame, fps, startSec, t.motion.enterSec);
  const pSrc = reveal(frame, fps, startSec + st * (bars.length + 3), t.motion.enterSec);

  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <div
        style={{
          position: "absolute",
          left: t.safe.x + 60,
          top: 150,
          fontFamily: t.fonts.headline,
          fontWeight: t.fonts.headlineWeight,
          fontSize: 68,
          letterSpacing: t.fonts.headlineTracking,
          color: t.colors.ink,
          ...rise(pTitle),
        }}
      >
        {title}
      </div>
      {bars.map((b, i) => {
        const p = reveal(frame, fps, startSec + st * (i + 2), 0.9);
        const w = (b.value / max) * trackW * p;
        const color = b.hero ? t.colors.accent : t.colors.secondary;
        return (
          <div key={b.label} style={{ position: "absolute", left: t.safe.x + 60, top: 360 + i * 170, ...rise(Math.min(1, p * 1.6), 18) }}>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 1, color: b.hero ? t.colors.ink : t.colors.secondary, marginBottom: 14 }}>
              {b.label}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ position: "relative", width: trackW, height: 60 }}>
                <div style={{ position: "absolute", inset: 0, background: t.colors.hairline, borderRadius: 4 }} />
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, background: color, opacity: b.hero ? 1 : 0.7, borderRadius: 4 }} />
              </div>
              <div
                style={{
                  marginLeft: 36,
                  fontFamily: t.fonts.mono,
                  fontVariantNumeric: "tabular-nums",
                  fontSize: 58,
                  color: b.hero ? t.colors.accent : t.colors.ink,
                  minWidth: 260,
                }}
              >
                {(b.value * p).toFixed(decimals)}
                {unit}
              </div>
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: t.safe.x + 60,
          bottom: t.safe.y + 20,
          fontFamily: t.fonts.mono,
          fontSize: 20,
          letterSpacing: 1.2,
          color: t.colors.secondary,
          ...rise(pSrc, 12),
        }}
      >
        {source}
      </div>
    </AbsoluteFill>
  );
};
