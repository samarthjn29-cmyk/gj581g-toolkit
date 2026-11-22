import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, rise } from "../motion";
import { spectrumGradient } from "../layers/spectrum";

// PKG-006 EpisodeCard: "EPISODE n OF 6" and the episode title, matching the series card.
export type EpisodeCardProps = { number: number; of?: number; title: string; series?: string; startSec?: number };

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ number, of = 6, title, series = "WHERE COLOUR LIVES", startSec = 0 }) => {
  useAssets(["PKG-006", "MOT-001", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pNum = reveal(frame, fps, startSec, t.motion.enterSec);
  const pTitle = reveal(frame, fps, startSec + 0.3, 0.9);
  const pLine = reveal(frame, fps, startSec + 0.7, 0.9);
  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <div style={{ position: "absolute", left: t.safe.x + 60, top: 380 }}>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 6, color: t.colors.accent, ...rise(pNum, 14) }}>
          EPISODE {number} OF {of} · {series}
        </div>
        <div style={{ marginTop: 22, fontFamily: t.fonts.serif, fontWeight: t.fonts.titleWeight, fontSize: 120, lineHeight: 1.05, color: t.colors.ink, ...rise(pTitle, 26) }}>{title}</div>
        <div style={{ marginTop: 30, width: 520 * pLine, height: 4, borderRadius: 2, background: spectrumGradient(400, 680) }} />
      </div>
    </AbsoluteFill>
  );
};
