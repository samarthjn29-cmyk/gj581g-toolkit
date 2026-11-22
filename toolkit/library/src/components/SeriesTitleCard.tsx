import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, rise } from "../motion";
import { spectrumGradient } from "../layers/spectrum";

// PKG-005 SeriesTitleCard (Where Colour Lives): the series name over a thin spectrum line that draws across.
export type SeriesTitleCardProps = { title?: string; kicker?: string; startSec?: number };

export const SeriesTitleCard: React.FC<SeriesTitleCardProps> = ({ title = "Where Colour Lives", kicker = "A SERIES IN SIX PARTS", startSec = 0 }) => {
  useAssets(["PKG-005", "MOT-001", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pTitle = reveal(frame, fps, startSec + 0.2, 0.9);
  const pLine = reveal(frame, fps, startSec + 0.6, 0.9);
  const pKick = reveal(frame, fps, startSec + 1.0, t.motion.enterSec);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: t.fonts.serif, fontWeight: t.fonts.titleWeight, fontSize: 150, letterSpacing: "-0.01em", color: t.colors.ink, ...rise(pTitle, 30) }}>{title}</div>
        <div style={{ margin: "34px auto 0", width: 900 * pLine, height: 4, borderRadius: 2, background: spectrumGradient(400, 680) }} />
        <div style={{ marginTop: 34, fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 8, color: t.colors.secondary, ...rise(pKick, 12) }}>{kicker}</div>
      </div>
    </AbsoluteFill>
  );
};
