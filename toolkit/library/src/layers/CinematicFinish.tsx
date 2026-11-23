import React, { useId } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";

// LOK-030 CinematicFinish (Sam, 23 Nov 2026: "Build the necessary cinematic pieces"; review of Johnny Harris, byl
// and Mapal in styles/CINEMATIC_REVIEW_2026-11-23.md). One finish over the whole act, so every shot sits in the
// same lens and film: a hand-held breath (<= 0.6 px, a new target every 6 frames, eased), a 1 px edge colour split
// (red out, blue in, only towards the frame edges), a warm grade (soft-light kraft), a light exposure flicker
// (<= 1.5%), film dust (a few specks, on sixes) and the theme's grain (already in OpticalStack).
// Best use: every act of an episode, once, at the Episode level. Limit: these strengths are the ceiling (the calm
// version); never stacked with a second finish; off on title cards only if the act file asks.
export type FinishSpec = { shake?: number; split?: number; warm?: number; dust?: number; flicker?: number };

const target = (k: number, s: string) => (random(`cf-${s}-${k}`) - 0.5) * 2;

export const CinematicFinish: React.FC<{ spec?: FinishSpec; children: React.ReactNode }> = ({ spec = {}, children }) => {
  useAsset("LOK-030");
  const t = useTheme();
  const frame = useCurrentFrame();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shake = Math.min(0.6, spec.shake ?? 0.45);
  const split = Math.min(1.2, spec.split ?? 1);
  const warm = Math.min(0.12, spec.warm ?? 0.08);
  const dust = Math.min(0.3, spec.dust ?? 0.18);
  const flicker = Math.min(0.015, spec.flicker ?? 0.01);
  // eased hand-held breath between targets that change every 6 frames
  const k = Math.floor(frame / 6);
  const f = (frame % 6) / 6;
  const e = f * f * (3 - 2 * f);
  const sx = (target(k, "x") * (1 - e) + target(k + 1, "x") * e) * shake;
  const sy = (target(k, "y") * (1 - e) + target(k + 1, "y") * e) * shake;
  const b = 1 + target(Math.floor(frame / 3), "b") * flicker;
  const dk = Math.floor(frame / 6);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          {/* colour split towards the edges: the red channel pushed out, blue pulled in, masked by distance from centre */}
          <filter id={`cs${uid}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bl" />
            <feOffset in="r" dx={split} dy={0} result="r2" />
            <feOffset in="bl" dx={-split} dy={0} result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" result="split" />
            <feImage href={`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><radialGradient id="g" cx="50%" cy="50%" r="62%"><stop offset="62%" stop-color="black"/><stop offset="100%" stop-color="white"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#g)"/></svg>')}`} x="0" y="0" width="1920" height="1080" result="mask" />
            <feColorMatrix in="mask" type="luminanceToAlpha" result="ma" />
            <feComposite in="split" in2="ma" operator="in" result="edge" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="edge" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ transform: `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px) scale(1.004)`, filter: `url(#cs${uid}) brightness(${b.toFixed(4)})` }}>{children}</AbsoluteFill>
      {/* warm grade */}
      <AbsoluteFill style={{ background: t.colors.kraft ?? t.colors.secondary, mixBlendMode: "soft-light", opacity: warm * 2.2, pointerEvents: "none" }} />
      {/* film dust on sixes */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: dust, mixBlendMode: "screen", pointerEvents: "none" }}>
        {Array.from({ length: 14 }, (_, i) => {
          const r = (s: string) => random(`fd-${dk}-${i}-${s}`);
          if (r("on") > 0.55) return null;
          const long = r("l") > 0.8;
          return long ? (
            <line key={i} x1={r("x") * 1920} y1={r("y") * 1080} x2={r("x") * 1920 + (r("dx") - 0.5) * 40} y2={r("y") * 1080 + r("dy") * 30} stroke={t.colors.ink} strokeWidth={1.2} strokeLinecap="round" />
          ) : (
            <circle key={i} cx={r("x") * 1920} cy={r("y") * 1080} r={0.8 + r("s") * 2.2} fill={t.colors.ink} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
