import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// TRN-009 ShapeMorphCut (own build, 23 Nov 2026; from Chris Moran's "How does Vox make their cuts look so smooth?",
// 22 Nov 2026, analysis only): a shape in the old shot (a highlight bar, a ring, a box) is lifted out as a lit outline,
// keeps moving, and changes shape on the way into its matching shape in the new shot (a circle, a frame). The eye
// follows the shape across the cut, so it never has to look for the new subject.
// `fromShape` / `toShape`: [x, y, w, h, radius] in frame px (radius = w/2 for a circle). The shots cross-dissolve
// under the shape at its midpoint (0.25 s), so the cut is hidden by the move.
// Calm: 0.75 s, eased in and out, the outline in the theme's accent, 3 px; max 2 per act.
export const ShapeMorph: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
  fromShape: [number, number, number, number, number];
  toShape: [number, number, number, number, number];
  fill?: boolean; // a soft accent fill inside the shape while it travels
  holdSec?: number; // the landed shape stays lit this long before it fades (act 3 v5 review: the hand-over read too briefly)
}> = ({ from, to, atSec = 0, durSec = 0.75, fromShape, toShape, fill = true, holdSec = 0 }) => {
  useAsset("TRN-009");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(2, sec(durSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const p = interpolate(frame, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mid = a + d / 2, x = sec(0.25, fps) / 2;
  const mixNew = interpolate(frame, [mid - x, mid + x], [0, 1], clamp);
  const lerp = (i: number) => fromShape[i] + (toShape[i] - fromShape[i]) * p;
  const [sx, sy, sw, sh, sr] = [0, 1, 2, 3, 4].map(lerp);
  const shapeO = frame < a ? 0 : interpolate(frame, [a, a + sec(0.1, fps), a + d + sec(holdSec, fps), a + d + sec(holdSec + 0.3, fps)], [0, 1, 1, 0], clamp);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      {mixNew < 1 ? <AbsoluteFill style={{ opacity: 1 - mixNew }}>{from}</AbsoluteFill> : null}
      {mixNew > 0 ? <AbsoluteFill style={{ opacity: mixNew }}>{to}</AbsoluteFill> : null}
      {shapeO > 0 ? (
        <div
          style={{
            position: "absolute",
            left: sx,
            top: sy,
            width: sw,
            height: sh,
            borderRadius: sr,
            border: `3px solid ${t.colors.accent}`,
            background: fill ? t.colors.accentSoft : undefined,
            opacity: shapeO * (fill ? 0.9 : 1),
            boxShadow: `0 0 ${18 + 20 * Math.sin(Math.PI * p)}px ${t.colors.accentSoft}`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
