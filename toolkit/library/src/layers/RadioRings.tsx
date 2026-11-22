import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// MAP-008 RadioRings (studied Chris Moran's 3 Vox-style effects short; analysis only): concentric rings pulse out
// from one point on a map or photo to mark "here". Calm: at most 3 rings, each 1.4 s, 0.45 s apart, radius up to
// 90 px, fading as they grow; the centre dot stays. Frame pixels. Usually sounded with a soft sub (set in the act).
export type RingSpec = { x: number; y: number; atSec: number; pulses?: number; radius?: number };

export const RadioRings: React.FC<{ spec: RingSpec }> = ({ spec }) => {
  useAsset("MAP-008");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.min(3, spec.pulses ?? 2);
  const R = Math.min(90, spec.radius ?? 80);
  const a = sec(spec.atSec, fps);
  if (frame < a) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const s0 = a + sec(0.45 * i, fps);
        const p = interpolate(frame, [s0, s0 + sec(1.4, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (p <= 0 || p >= 1) return null;
        return <circle key={i} cx={spec.x} cy={spec.y} r={10 + R * p} fill="none" stroke={t.colors.accent} strokeWidth={3} opacity={(1 - p) * 0.9} />;
      })}
    </svg>
  );
};
