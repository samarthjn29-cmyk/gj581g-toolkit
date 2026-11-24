import React from "react";
import { Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";

// VIS-060 StickerCutout (Within Motion blend, Sam 24 Nov 2026): a real registered cut-out with a white sticker edge
// (its alpha dilated 6 px) and a small soft shadow, entering with the calm pop: scale 0.94 -> 1 and a tilt of about
// 6 degrees settling to a resting 2-3 degrees over 0.6 s, slow-out, no overshoot. Colour states (a reported or
// imagined colour, labelled elsewhere) are laid inside the photo only; the white edge stays white.
// Best use: a real object or a real person's cut-out from a real photo, beside the words that name it. Limit: 12 beats
// an act; one sticker entrance at a time; never on a face that would seem to act; never a halftone where the colour is
// the point. VIS-061 ObjectProp (`object: true`): the literal spoken noun as a real object (the sealed letter, the eye
// model), only on the line that names it, tagged with its date or TODAY; max 6 beats an act.
type XY = readonly [number, number];
export type StickerSpec = {
  srcId: string;
  file?: string;
  size: readonly [number, number];
  at: XY; // centre, frame px
  w: number;
  atSec: number;
  tilt?: number; // resting tilt in degrees (default 2)
  fromTilt?: number; // tilt it pops in from (default 4 degrees further the same way)
  object?: boolean; // VIS-061 ObjectProp
  edge?: number; // white edge px (default 6; 0 for none)
  crop?: readonly [number, number, number, number]; // x, y, w, h in source px: show only this part (a scan's border off)
  states?: { atSec: number; multiply?: string | null; opacity?: number }[];
  moves?: { atSec: number; to: XY; w?: number; sec?: number }[];
  tag?: { text: string; dy?: number; untilSec?: number }; // '\n' breaks the tag into lines
  untilSec?: number; // leaves from here
  exit?: "sink" | "unwipe";
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.45, 0, 0.15, 1);

export const Sticker: React.FC<{ s: StickerSpec }> = ({ s }) => {
  const t = useTheme();
  const src = useSourceFile(s.srcId, s.file);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  if (frame < sec(s.atSec, fps)) return null;
  let at = s.at;
  let w = s.w;
  for (const m of s.moves ?? []) {
    const p = inOut(interpolate(frame, [sec(m.atSec, fps), sec(m.atSec + (m.sec ?? 1.0), fps)], [0, 1], clamp));
    at = [at[0] + (m.to[0] - at[0]) * p, at[1] + (m.to[1] - at[1]) * p];
    w = w + ((m.w ?? w) - w) * p;
  }
  const cr = s.crop ?? [0, 0, s.size[0], s.size[1]];
  const h = (w * cr[3]) / cr[2];
  const k = w / cr[2]; // frame px per source px
  const p = interpolate(frame, [sec(s.atSec, fps), sec(s.atSec + 0.6, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
  const rest = s.tilt ?? 2;
  const from = s.fromTilt ?? (rest >= 0 ? rest + 4 : rest - 4); // pops in from about 6 degrees, settles to 2-3
  const tilt = from + (rest - from) * p;
  const scale = 0.94 + 0.06 * p;
  const op = Math.min(1, p * 4);
  const xo = s.untilSec !== undefined ? interpolate(frame, [sec(s.untilSec, fps), sec(s.untilSec + 0.6, fps)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  if (xo >= 1) return null;
  const sink = (s.exit ?? "sink") === "sink";
  const exitStyle: React.CSSProperties = sink ? { transform: `translateY(${(xo * 140).toFixed(1)}px)`, opacity: 1 - xo } : { clipPath: `inset(-20px -20px -20px ${(xo * 100).toFixed(1)}%)` };
  const states = s.states ?? [];
  const layers = states.map((st, i) => {
    const pin = interpolate(frame, [sec(st.atSec, fps), sec(st.atSec + 0.8, fps)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const nx = states[i + 1];
    const pout = nx ? interpolate(frame, [sec(nx.atSec, fps), sec(nx.atSec + 0.8, fps)], [1, 0], clamp) : 1;
    return { st, o: pin * pout };
  });
  const mask: React.CSSProperties = { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };
  const edge = s.edge ?? 6;
  const fid = `stk-${uid}`;
  const tagOut = s.tag?.untilSec !== undefined ? interpolate(frame, [sec(s.tag.untilSec, fps), sec(s.tag.untilSec + 0.4, fps)], [1, 0], clamp) : 1;
  const tagIn = interpolate(frame, [sec(s.atSec + 0.3, fps), sec(s.atSec + 0.8, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
  return (
    <div style={{ position: "absolute", left: at[0] - w / 2, top: at[1] - h / 2, width: w, height: h, ...exitStyle }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={fid} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius={edge} result="fat" />
          <feGaussianBlur in="fat" stdDeviation={0.6} result="fatS" />
          <feFlood floodColor="#ffffff" result="white" />
          <feComposite in="white" in2="fatS" operator="in" result="edge" />
          <feMerge>
            <feMergeNode in="edge" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`, opacity: op, filter: "drop-shadow(0px 8px 10px rgba(0,0,0,0.30))" }}>
        {s.crop ? (
          <div style={{ position: "absolute", inset: 0, filter: edge > 0 ? `url(#${fid})` : undefined }}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <Img src={src} style={{ position: "absolute", left: -cr[0] * k, top: -cr[1] * k, width: s.size[0] * k, height: s.size[1] * k, maxWidth: "none" }} />
            </div>
          </div>
        ) : (
          <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", filter: edge > 0 ? `url(#${fid})` : undefined }} />
        )}
        {layers.map(({ st, o }, i) => (st.multiply && o > 0 ? <div key={i} style={{ position: "absolute", inset: 0, background: st.multiply, mixBlendMode: "multiply", opacity: o * (st.opacity ?? 0.85), ...mask }} /> : null))}
      </div>
      {s.tag && tagIn > 0 && tagOut > 0 ? (
        <div style={{ position: "absolute", left: "50%", top: h + (s.tag.dy ?? 26), transform: `translateX(-50%) translateY(${((1 - tagIn) * 8).toFixed(1)}px)`, whiteSpace: "pre", textAlign: "center", lineHeight: 1.35, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, opacity: tagIn * Math.min(1, tagOut * 2.5) }}>
          {s.tag.text}
        </div>
      ) : null}
    </div>
  );
};
