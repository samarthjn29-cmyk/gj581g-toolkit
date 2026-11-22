import React, { useId } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useSourceFile } from "../registry";

// LOK-021 RisoPrint (studied Chris Moran's short "Why Risograph prints look so good"; analysis only).
// A picture printed the risograph way: two or three spot inks, each a one-ink mask of a registered source
// (scripts/halftone.py, dots or --line), laid on paper in multiply so where inks overlap a NEW colour appears
// (subtractive mixing: the colour series' own subject), each ink a few px off register, with its own grain.
// Misregistration can drift very slowly (<= 2 px over the shot), which keeps a held print alive.
// Ink colours are data (the inks being printed), passed as props, like the swatch colours.
export type RisoInk = { file: string; color: string; offset?: [number, number]; drift?: [number, number] };

export const RisoPrint: React.FC<{
  srcId: string; // the registered source all ink files belong to
  inks: RisoInk[];
  width: number;
  height: number;
  paper: string; // theme token for the paper
  grain?: number; // 0..1
  seed?: number;
}> = ({ srcId, inks, width, height, paper, grain = 0.5, seed = 4 }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const u = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  return (
    <div style={{ position: "relative", width, height, background: paper, overflow: "hidden", isolation: "isolate" }}>
      {inks.map((k, i) => (
        <Ink key={i} srcId={srcId} ink={k} u={u} grainId={`rg${uid}${i}`} grain={grain} seed={seed + i * 13} />
      ))}
    </div>
  );
};

const Ink: React.FC<{ srcId: string; ink: RisoInk; u: number; grainId: string; grain: number; seed: number }> = ({ srcId, ink, u, grainId, grain, seed }) => {
  const src = useSourceFile(srcId, ink.file);
  const [ox, oy] = ink.offset ?? [0, 0];
  const [dx, dy] = ink.drift ?? [0, 0];
  const m = `url(${src})`;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${ox + dx * u}px, ${oy + dy * u}px)`, mixBlendMode: "multiply" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={2} seed={seed} result="n" />
          <feColorMatrix in="n" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${-1.6 * grain} ${1 + 0.35 * grain}`} result="g" />
          <feComposite in="SourceGraphic" in2="g" operator="in" />
        </filter>
      </svg>
      <div style={{ position: "absolute", inset: 0, background: ink.color, WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", filter: `url(#${grainId})` }} />
    </div>
  );
};
