import React from "react";

// Halftone dot screens drawn as SVG patterns (LOK-017). Deterministic: everything follows the props, so
// stills and renders agree. Used by HalftoneMoire (a colour broken into process-ink dots under a loupe,
// with a second screen turning slowly over it for the moire) and by DuotoneCollage.
//
// Process inks are physical printing data (the same in every theme), like the spectrum in spectrum.ts.
export const PROCESS_INKS = {
  C: "#00A0E3",
  M: "#E5007E",
  Y: "#FFE600",
  K: "#1D1D1B",
} as const;
export const SCREEN_ANGLES = { C: 15, M: 75, Y: 0, K: 45 } as const; // the classic four-colour angles

// Naive RGB -> CMYK coverage (0..1 each) for a flat colour given as #RRGGBB data.
export function cmyk(hex: string): {
  C: number;
  M: number;
  Y: number;
  K: number;
} {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255,
    g = ((n >> 8) & 255) / 255,
    b = (n & 255) / 255;
  const K = 1 - Math.max(r, g, b);
  const d = 1 - K || 1;
  return { C: (1 - r - K) / d, M: (1 - g - K) / d, Y: (1 - b - K) / d, K };
}

// Dot radius for a coverage: dot area = coverage x cell area, capped where neighbours touch.
export const dotR = (cell: number, coverage: number) =>
  Math.min(cell * 0.72, cell * Math.sqrt(Math.max(0, coverage) / Math.PI));

export const DotPattern: React.FC<{
  id: string;
  cell: number;
  angle: number;
  r: number;
  color: string;
  x?: number; // pattern origin, so a screen can be slid without moving its dots' size
  y?: number;
}> = ({ id, cell, angle, r, color, x = 0, y = 0 }) => (
  <pattern
    id={id}
    width={cell}
    height={cell}
    patternUnits="userSpaceOnUse"
    patternTransform={`translate(${x} ${y}) rotate(${angle})`}
  >
    <circle cx={cell / 2} cy={cell / 2} r={r} fill={color} />
  </pattern>
);

// LOK-023 screen medium (studied Chris Moran's shorts on fake-looking screens and Vox screen recordings;
// analysis only). A display makes colour from light: each pixel is three sub-pixel stripes (red, green, blue)
// whose brightness follows the colour. Display primaries are physical data, the same in every theme.
export const SUBPIXELS = { R: "#FF2A1F", G: "#2BFF4A", B: "#2F5BFF" } as const;
export function rgb01(hex: string): { R: number; G: number; B: number } {
  const n = parseInt(hex.replace("#", ""), 16);
  return {
    R: ((n >> 16) & 255) / 255,
    G: ((n >> 8) & 255) / 255,
    B: (n & 255) / 255,
  };
}
// One pixel cell: three vertical stripes, each lit to its channel's level (display gamma ignored on purpose:
// the point is which stripes are on, not a colour-exact model).
export const SubpixelPattern: React.FC<{
  id: string;
  cell: number;
  color: string;
  angle?: number;
}> = ({ id, cell, color, angle = 0 }) => {
  const v = rgb01(color);
  const w = cell / 3;
  return (
    <pattern
      id={id}
      width={cell}
      height={cell}
      patternUnits="userSpaceOnUse"
      patternTransform={`rotate(${angle})`}
    >
      {(["R", "G", "B"] as const).map((k, i) => (
        <rect
          key={k}
          x={i * w + w * 0.1}
          y={cell * 0.06}
          width={w * 0.8}
          height={cell * 0.88}
          rx={w * 0.25}
          fill={SUBPIXELS[k]}
          opacity={Math.max(0.04, v[k])}
        />
      ))}
    </pattern>
  );
};
