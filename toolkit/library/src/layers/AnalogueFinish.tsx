import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAsset } from "../registry";

// LOK-015 AnalogueFinish (studied Ben Marriott, 'Best Motion Design of 2026'; analysis only): a faint chromatic
// fringe at the frame's edges and one slow warm light leak drifting across, on top of the grain, adding warmth
// without taking over. Ours: the fringe is two thin edge gradients in the long and short cone colours (screen,
// 6% at most); the leak is one soft long-cone glow crossing the frame over about 12 s.
// Best use: candlelit, archival and memory scenes. Limit: max 15% of runtime; never on diagrams or text-heavy
// beats. Not for: the whole episode.
export const AnalogueFinish: React.FC<{ strength?: number; seed?: number }> = ({ strength = 1, seed = 1 }) => {
  useAsset("LOK-015");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (strength < 0 || strength > 1) throw new Error("AnalogueFinish: strength 0-1.");
  const s = (frame / fps + seed * 3.7) / 12; // one crossing every ~12 s
  const lx = -30 + ((s % 1) * 160); // percent across the frame
  const ly = 30 + 25 * Math.sin(s * Math.PI * 2 + seed);
  const L = t.colors.cones.L;
  const S = t.colors.cones.S;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: strength }}>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${L} 0%, transparent 2.2%, transparent 97.8%, ${S} 100%)`, opacity: 0.06 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 38% 55% at ${lx}% ${ly}%, ${L} 0%, transparent 70%)`, opacity: 0.07 }} />
    </AbsoluteFill>
  );
};
