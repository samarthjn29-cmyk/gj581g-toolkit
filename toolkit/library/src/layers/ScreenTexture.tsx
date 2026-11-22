import React, { useId } from "react";

// LOK-023 ScreenTexture (studied Chris Moran's shorts "Why your screen effects look fake" and "How Vox makes
// their screen recordings look less sterile"; analysis only). A picture that is meant to be ON a screen
// (a website, a lab monitor, a phone) looks pasted on unless the screen is felt: fine horizontal scanlines,
// a faint sub-pixel stripe, a soft bloom on the bright parts and a slight edge falloff. Layered over that
// picture only, never over the whole frame. Static (no flicker), calm strength.
export const ScreenTexture: React.FC<{ strength?: number; line?: number }> = ({ strength = 1, line = 4 }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const k = Math.max(0, Math.min(1.5, strength));
  return (
    <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <pattern id={`sl${uid}`} width={8} height={line} patternUnits="userSpaceOnUse">
          <rect width={8} height={line * 0.38} fill="#000000" />
        </pattern>
        <pattern id={`sp${uid}`} width={6} height={6} patternUnits="userSpaceOnUse">
          <rect x={0} width={2} height={6} fill="#FF0000" />
          <rect x={2} width={2} height={6} fill="#00FF00" />
          <rect x={4} width={2} height={6} fill="#0000FF" />
        </pattern>
        <radialGradient id={`vg${uid}`} cx="50%" cy="50%" r="70%">
          <stop offset="0.6" stopColor="#000000" stopOpacity={0} />
          <stop offset="1" stopColor="#000000" stopOpacity={0.35 * k} />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#sp${uid})`} opacity={0.07 * k} style={{ mixBlendMode: "multiply" }} />
      <rect width="100%" height="100%" fill={`url(#sl${uid})`} opacity={0.22 * k} />
      <rect width="100%" height="100%" fill={`url(#vg${uid})`} />
    </svg>
  );
};
