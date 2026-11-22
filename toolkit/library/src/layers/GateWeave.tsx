import React from "react";
import { useCurrentFrame } from "remotion";

// LOK-022 GateWeave (studied Chris Moran's short "Vox uses this technique to make their static compositions
// feel alive"; analysis only). Film in a projector never sits perfectly still: the frame weaves a pixel or so
// and the exposure flickers by a couple of percent. Wrapped round a held still or card, it keeps the frame
// alive without a visible move (the 4-second stillness rule) and gives archival material a projected feel.
// Deterministic (seeded by frame), calm: weave <= 1.5 px, flicker <= 3 %, changes every 2 frames.
const rnd = (n: number, s: number) => {
  const x = Math.sin(n * 91.7 + s * 47.3) * 43758.5453;
  return x - Math.floor(x);
};

export const GateWeave: React.FC<{
  children: React.ReactNode;
  weave?: number;
  flicker?: number;
  seed?: number;
}> = ({ children, weave = 1, flicker = 0.02, seed = 1 }) => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / 2);
  // smooth-ish weave: blend two neighbouring random targets
  const f = (frame % 2) / 2;
  const wx =
    (rnd(k, seed) * (1 - f) + rnd(k + 1, seed) * f - 0.5) *
    2 *
    Math.min(1.5, weave);
  const wy =
    (rnd(k, seed + 3) * (1 - f) + rnd(k + 1, seed + 3) * f - 0.5) *
    2 *
    Math.min(1.5, weave);
  const b = 1 + (rnd(k, seed + 7) - 0.5) * 2 * Math.min(0.03, flicker);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${wx.toFixed(2)}px, ${wy.toFixed(2)}px)`,
        filter: `brightness(${b.toFixed(3)})`,
      }}
    >
      {children}
    </div>
  );
};
