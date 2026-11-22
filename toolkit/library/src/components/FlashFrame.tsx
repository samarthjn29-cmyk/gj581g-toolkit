import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { sec } from "../motion";

// TRN-013 FlashFrame (studied Chris Moran's Netflix-doc text tutorial, 22 Nov 2026; analysis only): his flash is
// phone footage of lights shot at a slow shutter. Ours is a synthesised plate, no camera footage: soft, blown-out
// light streaks drifting sideways. The old shot blooms up into the streaks, the cut happens under the brightest
// frame, and the new shot settles out of them. Sounded with SFX-024 (set in the act).
// Calm version: peak at most `peak` (0.85) opacity, warm light, 0.5 s in all, no strobe.
const Streaks: React.FC<{ p: number; seed: number; tint: string }> = ({ p, seed, tint }) => {
  const bars = Array.from({ length: 16 }, (_, i) => {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    return {
      y: r("y") * 1080,
      h: 10 + r("h") * 90,
      w: 700 + r("w") * 1500,
      x0: -900 + r("x") * 1600,
      v: 500 + r("v") * 900, // px travelled over the flash
      o: 0.35 + r("o") * 0.65,
    };
  });
  return (
    <AbsoluteFill style={{ filter: "blur(14px)" }}>
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x0 + b.v * p,
            top: b.y - b.h / 2,
            width: b.w,
            height: b.h,
            borderRadius: b.h,
            opacity: b.o,
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${tint} 30%, #FFFFFF 55%, ${tint} 75%, rgba(255,255,255,0) 100%)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const FlashFrame: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  upSec?: number; // old shot blooming into the light
  downSec?: number; // new shot settling out of it
  peak?: number;
  seed?: number;
}> = ({ from, to, atSec = 0, upSec = 0.2, downSec = 0.3, peak = 0.85, seed = 5 }) => {
  useAsset("TRN-013");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const cut = a + Math.max(1, sec(upSec, fps));
  const end = cut + Math.max(1, sec(downSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const up = interpolate(frame, [a, cut], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const down = interpolate(frame, [cut, end], [1, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  const glow = frame < cut ? up : down; // 0..1
  const p = interpolate(frame, [a, end], [0, 1], clamp); // streak travel across the whole flash
  const tint = "rgba(255,226,182,0.95)"; // warm light (data-free: the flash is light, not a colour claim)
  const look = (g: number) => ({ filter: `brightness(${(1 + 1.6 * g).toFixed(3)}) blur(${(6 * g).toFixed(2)}px)` });
  return (
    // No root canvas: the old and new shots fill the frame, and a canvas would hide the corner light (review v12).
    <AbsoluteFill>
      {frame < cut ? <AbsoluteFill style={look(up)}>{from}</AbsoluteFill> : <AbsoluteFill style={frame < end ? look(down) : undefined}>{to}</AbsoluteFill>}
      {frame >= a && frame < end ? (
        <AbsoluteFill style={{ opacity: glow * peak, mixBlendMode: "screen" }}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,240,220,0.9) 0%, rgba(255,220,170,0.35) 55%, rgba(255,220,170,0) 100%)" }} />
          <Streaks p={p} seed={seed} tint={tint} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
