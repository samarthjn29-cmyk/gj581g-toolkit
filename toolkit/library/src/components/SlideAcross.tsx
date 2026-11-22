import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { canvasAfterMove, sec, SLOW_OUT } from "../motion";

// TRN-007 SlideAcross (studied Vox via a Denys Zhylin tutorial short; analysis only): the old shot slides out to
// the left while the new one slides in from the right, like a page pushed across a desk (0.7 s, slow-out, no
// overshoot). For moving into or out of a document, or between two documents. Calm: 0.7 s, one direction.
export const SlideAcross: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
}> = ({ from, to, atSec = 0, durSec = 0.7 }) => {
  useAsset("TRN-007");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(1, sec(durSec, fps));
  const p = interpolate(frame, [a, a + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  return (
    <AbsoluteFill>
      {frame < a + d ? (
        <AbsoluteFill
          style={{
            transform: `translateX(${(-1920 * 0.6 * p).toFixed(1)}px)`,
            opacity: 1 - 0.7 * p,
          }}
        >
          {from}
        </AbsoluteFill>
      ) : null}
      <Sequence from={a} layout="none">
        <AbsoluteFill
          style={{
            transform: `translateX(${(1920 * (1 - p)).toFixed(1)}px)`,
            boxShadow: "-40px 0 80px rgba(0,0,0,0.45)",
            // The incoming shot carries its own canvas, so it covers the old one as it slides in
            // (transparent shots let the old text show through; Sam, act 1 v3, 22 Nov 2026).
            // ... only while it moves: after the slide a painted canvas would hide OpticalStack's corner light
            // (independent review, act 1 v11).
            backgroundColor: canvasAfterMove(t.colors.canvas, frame, a + d), // fades out after the move (review v12)
          }}
        >
          {to}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
