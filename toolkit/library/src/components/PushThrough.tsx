import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// TRN-006 PushThrough (from Colour_v1): the new shot grows out of the last shot's key picture.
// The old shot pushes in 8% around the focus point and fades; the new one opens from that same point (0.6 s).
export const PushThrough: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec: number;
  focus: readonly [number, number];
  durSec?: number;
}> = ({ from, to, atSec, focus, durSec = 0.6 }) => {
  useAsset("TRN-006");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(1, sec(durSec, fps));
  const p = interpolate(frame, [a, a + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const origin = `${focus[0]}px ${focus[1]}px`;
  return (
    <AbsoluteFill>
      {frame < a + d ? (
        <AbsoluteFill style={{ transform: `scale(${1 + 0.08 * p})`, transformOrigin: origin, opacity: 1 - p }}>{from}</AbsoluteFill>
      ) : null}
      <Sequence from={a} layout="none">
        <AbsoluteFill
          style={{
            clipPath: p >= 1 ? undefined : `circle(${(p * 2300).toFixed(1)}px at ${origin})`,
            transform: `scale(${0.92 + 0.08 * p})`,
            transformOrigin: origin,
            backgroundColor: p >= 1 ? undefined : t.colors.canvas, // covers the old shot inside the circle (no ghost text); off once open (corner light)
          }}
        >
          {to}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
