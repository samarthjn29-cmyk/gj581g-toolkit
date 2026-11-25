import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// TRN-022 MacroDive (Sam, 25 Nov 2026: "Sure build them"): the camera dives into one small detail of the old shot (a
// printed letter, a pupil, one petal) until the detail is a window, and the next shot is what lies inside it. Unlike
// PushThrough (an 8% push and a fade) the dive is deep (6x) and the window is the detail's own round shape.
// For a same-scene change that goes closer or inside; at most one in three scene changes of an act. Calm: 0.85 s.
export const MacroDive: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  focus: readonly [number, number];
  r0?: number; // the detail's radius in the old shot
  atSec?: number;
  durSec?: number;
  depth?: number;
}> = ({ from, to, focus, r0 = 26, atSec = 0, durSec = 0.85, depth = 6 }) => {
  useAsset("TRN-022");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const e = a + Math.max(6, sec(durSec, fps));
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const p = interpolate(frame, [a, e], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const s = Math.pow(depth, p); // exponential zoom reads as constant speed
  const [fx, fy] = focus;
  // the window: the detail's circle scaled with the old shot, moved to the frame centre as the camera centres on it
  const cx = fx + (960 - fx) * p;
  const cy = fy + (540 - fy) * p;
  const r = r0 * s * (1 + 3 * p * p);
  const blur = 6 * Math.sin(Math.PI * p);
  const inner = 1.25 - 0.25 * p; // the new shot settles from slightly large
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${fx}px ${fy}px`, transform: `translate(${cx - fx}px, ${cy - fy}px) scale(${s})`, filter: `blur(${blur.toFixed(2)}px)`, background: t.colors.canvas }}>
        {from}
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r.toFixed(1)}px at ${cx}px ${cy}px)`, background: t.colors.canvas }}>
        <AbsoluteFill style={{ transform: `scale(${inner})`, transformOrigin: "center" }}>{to}</AbsoluteFill>
        <AbsoluteFill style={{ boxShadow: `inset 0 0 ${80 * (1 - p)}px rgba(0,0,0,${0.5 * (1 - p)})`, borderRadius: "50%" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
