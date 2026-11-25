import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";

// TRN-021 ColourFlood (Sam, 25 Nov 2026: "Sure build them"): a colour already on screen (a swatch, a petal, a cell)
// grows from where it sits until it fills the frame, holds a breath, and the next shot opens out of that same point.
// The colour is the DATA colour the story is about, never the theme accent. Calm: 0.45 s flood, 0.12 s hold, 0.45 s open.
export const ColourFlood: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  color: string;
  at: readonly [number, number]; // where the colour sits in the old shot
  r0?: number; // its size there
  atSec?: number;
  floodSec?: number;
  holdSec?: number;
  openSec?: number;
}> = ({ from, to, color, at, r0 = 40, atSec = 0, floodSec = 0.45, holdSec = 0.12, openSec = 0.45 }) => {
  useAsset("TRN-021");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const f1 = a + Math.max(3, sec(floodSec, fps));
  const h1 = f1 + sec(holdSec, fps);
  const o1 = h1 + Math.max(3, sec(openSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= o1) return <AbsoluteFill>{to}</AbsoluteFill>;
  const R = Math.hypot(Math.max(at[0], 1920 - at[0]), Math.max(at[1], 1080 - at[1])) + 20;
  const pf = interpolate(frame, [a, f1], [0, 1], { ...clamp, easing: SLOW_OUT });
  const po = interpolate(frame, [h1, o1], [0, 1], { ...clamp, easing: SLOW_OUT });
  const rf = r0 + (R - r0) * pf;
  const ro = R * po;
  return (
    <AbsoluteFill>
      {frame < f1 ? <AbsoluteFill>{from}</AbsoluteFill> : null}
      <AbsoluteFill style={{ background: color, clipPath: `circle(${rf.toFixed(1)}px at ${at[0]}px ${at[1]}px)` }} />
      {po > 0 ? (
        <AbsoluteFill style={{ clipPath: `circle(${ro.toFixed(1)}px at ${at[0]}px ${at[1]}px)`, background: t.colors.canvas }}>{to}</AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
