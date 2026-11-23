import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { snap } from "../motion";

// TRN-017 LensSettle (Motion Array, 'How To Edit A Documentary Like Johnny Harris', the 'Ken Burns 2.0' still;
// analysis only; Sam, 23 Nov 2026: "learn from the presenter and build better cinematics"). A hard cut where the
// new picture arrives through a lens: it lands from 42 px below and a touch large (1.08), out of a 14 px blur, on
// the ExtremeEase curve (most of the travel in the first 8 frames, then a long, soft finish), so a still feels
// like a print slid under a camera. The projector tick (SFX-003 shutter_vintage, or a ticker click) goes on the cut.
// Best use: a cut to a real picture (a scan, a portrait, a photo, a page), not to a text card or a chart.
// Limit: at most 1 in 4 scene changes in an act, never two in a row; 0.6-0.8 s; blur <= 16 px.
export const LensSettle: React.FC<{ children: React.ReactNode; durSec?: number; blur?: number }> = ({ children, durSec = 0.7, blur = 14 }) => {
  useAsset("TRN-017");
  if (durSec < 0.6 || durSec > 0.8) throw new Error("LensSettle: 0.6-0.8 s.");
  if (blur > 16) throw new Error("LensSettle: blur <= 16 px.");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = snap(frame, fps, 0, durSec);
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(42 * (1 - p)).toFixed(2)}px) scale(${(1.08 - 0.08 * p).toFixed(4)})`, filter: p < 0.999 ? `blur(${(blur * (1 - p)).toFixed(2)}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};
