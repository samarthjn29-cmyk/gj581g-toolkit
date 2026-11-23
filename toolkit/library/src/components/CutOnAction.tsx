import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { sec } from "../motion";

// TRN-010 CutOnAction (own build, 23 Nov 2026): the cut lands in the middle of a movement. The old shot starts to move
// (a blink closing, a page dropping, a thing falling out of frame) and the new shot arrives already moving the same
// way, then settles, so the motion carries the eye straight through the cut. `dir` = the movement's direction; `px` =
// how far the frames travel either side of the cut; 2 frames of directional blur sit on the cut itself.
// Calm: 0.25 s of motion before the cut, 0.45 s settle after it, at most 120 px.
export const CutOnAction: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  leadSec?: number;
  settleSec?: number;
  dir?: "down" | "up" | "left" | "right";
  px?: number;
}> = ({ from, to, atSec = 0, leadSec = 0.25, settleSec = 0.45, dir = "down", px = 90 }) => {
  useAsset("TRN-010");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cut = sec(atSec + leadSec, fps);
  const a = sec(atSec, fps);
  const e = cut + Math.max(1, sec(settleSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const [vx, vy] = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[dir];
  const out = interpolate(frame, [a, cut], [0, px], { ...clamp, easing: Easing.in(Easing.quad) });
  const inn = interpolate(frame, [cut, e], [-px, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const near = Math.abs(frame - cut) <= 1;
  const blur = near ? `blur(${vx ? 0 : 0}px)` : undefined;
  const dirBlur = near ? (vy ? "url(#coaV)" : "url(#coaH)") : undefined;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="coaV"><feGaussianBlur stdDeviation="0 7" /></filter>
        <filter id="coaH"><feGaussianBlur stdDeviation="7 0" /></filter>
      </svg>
      {frame < cut ? (
        <AbsoluteFill style={{ transform: `translate(${vx * out}px, ${vy * out}px)`, filter: dirBlur ?? blur }}>{from}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ transform: `translate(${vx * inn}px, ${vy * inn}px)`, filter: dirBlur ?? blur }}>{to}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
