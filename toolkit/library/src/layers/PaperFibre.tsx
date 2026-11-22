import React, { useId } from "react";

// TEX-007 PaperFibre (studied Chris Moran's shorts "Why your paper animation looks fake" and "Don't make this
// texturing mistake"; analysis only). Flat paper reads as fake: real paper has fibre, uneven light and ink that
// sits IN it. Layered inside one paper piece (never one texture over the whole frame, the "mistake"):
//  - <PaperFibre/>: fine grain + long fibres (seeded SVG turbulence, static) in multiply, and a soft light
//    falloff across the sheet (lighter top-left), so each piece is lit like a real sheet on the desk;
//  - inkFilterId(): an SVG filter that roughens ink edges slightly, so a mask printed on the paper looks
//    pressed into it rather than pasted on (use as `filter: url(#id)` on the ink layer).
// Deterministic (no time input), so stills and renders agree. Strength stays low (calm look).
export const PaperFibre: React.FC<{ seed?: number; strength?: number }> = ({ seed = 1, strength = 1 }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const k = Math.max(0, Math.min(1.5, strength));
  return (
    <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", pointerEvents: "none" }}>
      <defs>
        <filter id={`grain${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={seed} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 -1.1 0.75" />
        </filter>
        <filter id={`fibre${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.32" numOctaves={2} seed={seed + 7} result="f" />
          <feColorMatrix in="f" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.47  0 0 0 0 0.42  0 0 0 -2.2 1.25" />
        </filter>
        <linearGradient id={`light${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="1" stopColor="#000000" stopOpacity={0.14 * k} />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" filter={`url(#grain${uid})`} opacity={0.32 * k} />
      <rect width="100%" height="100%" filter={`url(#fibre${uid})`} opacity={0.22 * k} />
      <rect width="100%" height="100%" fill={`url(#light${uid})`} />
    </svg>
  );
};

// The ink-edge filter, rendered once next to the ink layer that uses it.
export const InkEdgeFilter: React.FC<{ id: string; seed?: number; amount?: number }> = ({ id, seed = 3, amount = 1.6 }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={amount} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

// TXT-016 InkSpreadType / InkPress (studied Chris Moran's shorts "The SECRET to editing nostalgia" and "A
// counter-intuitive way to make your work look analog"; analysis only): blur the shape, then threshold it back
// (a "choke"), with a touch of turbulence, so sharp digital corners round off and edges go slightly irregular,
// like ink pressed into paper. Use on large headline type and flat shapes only (filter: url(#id)).
export const InkPressFilter: React.FC<{ id: string; seed?: number; blur?: number; rough?: number }> = ({ id, seed = 5, blur = 1.4, rough = 1.5 }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-3%" y="-3%" width="106%" height="106%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={rough} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feGaussianBlur in="d" stdDeviation={blur} result="b" />
      <feComponentTransfer in="b">
        <feFuncA type="linear" slope={6} intercept={-2.4} />
      </feComponentTransfer>
    </filter>
  </svg>
);
