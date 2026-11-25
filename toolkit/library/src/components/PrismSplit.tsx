import React, { useId } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";

// TRN-019 PrismSplit (Sam, 25 Nov 2026: "Sure build them", the series' own signature move): a thin white beam crosses
// from the left to a split point, then fans into the spectrum; the fan is a window onto the next shot, and it opens
// until the new shot fills the frame. Red bends least: the red fringe is the fan's upper edge, violet the lower (one
// side for the whole series). Calm: beam 0.3 s, fan 0.65 s. Best at an act turn about light or colour.
const SPEC = ["#ff2a1f", "#ff8a1a", "#ffe41a", "#38d140", "#1e9bff", "#3b3fd6", "#8a2be2"];
export const PrismSplit: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  y?: number; // beam height
  splitX?: number;
  beamSec?: number;
  fanSec?: number;
}> = ({ from, to, atSec = 0, y = 540, splitX = 760, beamSec = 0.3, fanSec = 0.8 }) => {
  useAsset("TRN-019");
  const t = useTheme();
  const id = useId().replace(/:/g, "");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const b1 = a + Math.max(2, sec(beamSec, fps));
  const f1 = b1 + Math.max(3, sec(fanSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= f1 + 2) return <AbsoluteFill>{to}</AbsoluteFill>;
  const pb = interpolate(frame, [a, b1], [0, 1], { ...clamp, easing: SLOW_OUT });
  const pf = interpolate(frame, [b1, f1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  // the fan: apex runs back left and the opening grows, so the window ends larger than the frame
  const ax = splitX - 3200 * pf * pf;
  const spread = 40 + 2600 * pf;
  const far = 2400;
  const tUp: [number, number] = [far, y - spread];
  const tDn: [number, number] = [far, y + spread];
  const poly = `polygon(${ax}px ${y}px, ${tUp[0]}px ${tUp[1]}px, ${tDn[0]}px ${tDn[1]}px)`;
  const beamX = -40 + (splitX + 40) * pb;
  const fringe = interpolate(pf, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{from}</AbsoluteFill>
      {pf > 0 ? <AbsoluteFill style={{ clipPath: poly, background: t.colors.canvas }}>{to}</AbsoluteFill> : null}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        <defs>
          <filter id={`g${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={3} />
          </filter>
        </defs>
        {/* the white beam, fading as the fan opens */}
        <g opacity={1 - pf} style={{ mixBlendMode: "screen" }}>
          <line x1={-40} y1={y} x2={beamX} y2={y} stroke="#fff" strokeWidth={10} filter={`url(#g${id})`} />
          <line x1={-40} y1={y} x2={beamX} y2={y} stroke="#fff" strokeWidth={3} />
        </g>
        {/* spectral fringes on both fan edges: red on top, violet below */}
        {pf > 0
          ? SPEC.map((c, i) => {
              // dispersion fans out from the apex: red outermost on the upper edge, violet outermost on the lower
              const up = (6 - i) * 26 * (0.3 + pf);
              const dn = i * 26 * (0.3 + pf);
              return (
                <g key={i} opacity={0.9 * fringe}>
                  <line x1={ax} y1={y} x2={tUp[0]} y2={tUp[1] - up} stroke={c} strokeWidth={7} strokeLinecap="round" filter={`url(#g${id})`} />
                  <line x1={ax} y1={y} x2={tDn[0]} y2={tDn[1] + dn} stroke={c} strokeWidth={7} strokeLinecap="round" filter={`url(#g${id})`} />
                </g>
              );
            })
          : null}
      </svg>
    </AbsoluteFill>
  );
};
