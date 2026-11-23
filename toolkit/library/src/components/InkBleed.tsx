import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { sec } from "../motion";
import { useTheme } from "../themes";

// TRN-005 InkBleedTransition (own build, 23 Nov 2026): a drop of ink lands at `at` and spreads like ink in wet paper,
// with a ragged, fibrous edge; the new shot shows through the ink. Optional `tint`: the ink carries a colour that
// means something (Dalton's blue jelly, #3D6BD6) for its first frames, then clears to the new shot.
// The edge comes from SVG turbulence on the mask, so it is soft and never a perfect circle.
// Sound: a soft drip and paper wet-spread (SFX-016 PaperFoley at -26 dB, or SFX-017 ink).
// Calm: 1.0 s, eased out (fast at the drop, slow at the end), one drop only.
export const InkBleed: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
  at?: [number, number];
  tint?: string | null;
  seed?: number;
}> = ({ from, to, atSec = 0, durSec = 1.0, at = [960, 540], tint = null, seed = 3 }) => {
  useAsset("TRN-005");
  const th = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(1, sec(durSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const p = interpolate(frame, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const [x, y] = at;
  const far = Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y)) * 1.25;
  const r = 6 + far * p;
  const tintO = tint ? interpolate(frame, [a, a + d * 0.35, a + d], [0.85, 0.6, 0], clamp) : 0;
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= a + d) return <AbsoluteFill>{to}</AbsoluteFill>;
  const disp = 40 + 60 * (1 - p); // ragged edge, calming as it spreads
  // The mask is an SVG image (data URL) so its turbulence edge renders inside the mask (an SVG <mask> referenced from
  // HTML is not reliable in Chrome).
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'>` +
    `<filter id='f' x='-20%' y='-20%' width='140%' height='140%'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.018' numOctaves='3' seed='${seed}'/>` +
    `<feDisplacementMap in='SourceGraphic' scale='${disp.toFixed(1)}' xChannelSelector='R' yChannelSelector='G'/><feGaussianBlur stdDeviation='1.2'/></filter>` +
    `<g filter='url(#f)' fill='white'><circle cx='${x}' cy='${y}' r='${r.toFixed(1)}'/><circle cx='${(x + r * 0.35).toFixed(1)}' cy='${(y - r * 0.2).toFixed(1)}' r='${(r * 0.55).toFixed(1)}'/>` +
    `<circle cx='${(x - r * 0.3).toFixed(1)}' cy='${(y + r * 0.25).toFixed(1)}' r='${(r * 0.6).toFixed(1)}'/></g></svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{from}</AbsoluteFill>
      <AbsoluteFill style={{ maskImage: url, WebkitMaskImage: url, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskMode: "luminance", background: th.colors.canvas } as React.CSSProperties}>
        {to}
        {tint ? <AbsoluteFill style={{ background: tint, opacity: tintO * 0.5 }} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
