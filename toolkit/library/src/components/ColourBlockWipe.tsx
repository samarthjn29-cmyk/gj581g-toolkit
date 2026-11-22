import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";

// TRN-012 ColourBlockWipe (studied ilkin's collage ad, 22 Nov 2026; analysis only, the build is ours): a solid block
// in one DATA colour (the colour the story is about, never a theme accent) floods in from a side, holds a beat, then
// the next scene slides up out of it like a sheet pulled from under a stack. Sounded with SFX-024 (set in the act).
// Phases: flood floodSec (slow-out), hold holdSec, reveal revealSec (the new shot rises from below, its top edge
// casting a soft shadow on the block). Calm: about 0.65 s in all, one direction each.
export const ColourBlockWipe: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  color: string;
  atSec?: number;
  side?: "right" | "left";
  floodSec?: number;
  holdSec?: number;
  revealSec?: number;
}> = ({ from, to, color, atSec = 0, side = "right", floodSec = 0.28, holdSec = 0.1, revealSec = 0.32 }) => {
  useAsset("TRN-012");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const f1 = a + Math.max(1, sec(floodSec, fps));
  const h1 = f1 + sec(holdSec, fps);
  const r1 = h1 + Math.max(1, sec(revealSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const flood = interpolate(frame, [a, f1], [0, 1], { ...clamp, easing: SLOW_OUT });
  const rise = interpolate(frame, [h1, r1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const W = 1920;
  const x = (1 - flood) * (side === "right" ? W : -W);
  return (
    <AbsoluteFill>
      {frame < f1 ? <AbsoluteFill>{from}</AbsoluteFill> : null}
      {frame >= a && frame < r1 ? (
        <AbsoluteFill style={{ background: color, transform: `translateX(${x.toFixed(1)}px)`, boxShadow: "0 0 60px rgba(0,0,0,0.35)" }} />
      ) : null}
      {frame >= h1 ? (
        <AbsoluteFill
          style={{
            transform: frame >= r1 ? undefined : `translateY(${((1 - rise) * 1080).toFixed(1)}px)`,
            boxShadow: frame >= r1 ? undefined : "0 -30px 70px rgba(0,0,0,0.38)",
            backgroundColor: frame >= r1 ? undefined : t.colors.canvas, // only while it rises (corner light, review v11)
          }}
        >
          {to}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
