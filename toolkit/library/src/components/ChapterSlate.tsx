import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, rise } from "../motion";

// VIS-007 ChapterSlate (beat type 7: chapter or thesis turn, reset).
// A hairline grid, a drafting line that wipes across and reveals the title, a mono index and a serif title.
export type ChapterSlateProps = { index: string; title: string; subtitle?: string; startSec?: number };

export const ChapterSlate: React.FC<ChapterSlateProps> = ({ index, title, subtitle, startSec = 0 }) => {
  useAssets(["VIS-007", "MOT-001", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pWipe = reveal(frame, fps, startSec + 0.15, 0.9);
  const pIdx = reveal(frame, fps, startSec, t.motion.enterSec);
  const pSub = reveal(frame, fps, startSec + 0.9, t.motion.enterSec);
  const lineX = t.safe.x + (1920 - t.safe.x * 2) * pWipe;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 23 }, (_, i) => (
          <line key={`v${i}`} x1={i * 87.27} y1={0} x2={i * 87.27} y2={1080} stroke={t.colors.hairline} strokeWidth={1} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 90} x2={1920} y2={i * 90} stroke={t.colors.hairline} strokeWidth={1} />
        ))}
      </svg>
      <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        <div style={{ position: "absolute", left: t.safe.x, top: 360, fontFamily: t.fonts.mono, fontSize: 28, letterSpacing: 6, color: t.colors.accent, ...rise(pIdx, 14) }}>
          CHAPTER {index}
        </div>
        <div style={{ position: "absolute", left: t.safe.x, top: 420, clipPath: `inset(0 ${(1 - pWipe) * 100}% 0 0)` }}>
          <div
            style={{
              fontFamily: t.fonts.serif,
              fontWeight: t.fonts.titleWeight,
              fontSize: 132,
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
              color: t.colors.ink,
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ position: "absolute", left: t.safe.x, top: 612, width: lineX - t.safe.x, height: 2, background: t.colors.accent }} />
        {subtitle ? (
          <div style={{ position: "absolute", left: t.safe.x, top: 650, fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 40, color: t.colors.secondary, ...rise(pSub, 16) }}>
            {subtitle}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
