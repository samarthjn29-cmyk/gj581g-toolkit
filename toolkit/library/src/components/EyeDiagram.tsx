import React, { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, lock, reveal, sec, SLOW_OUT } from "../motion";
import { Label, type LabelSpec } from "../layers/Label";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";
import { particles, type RaySpec } from "../layers/RayParticles";

// VIS-019 EyeDiagram (beat type 4: lines about the eye itself, calm).
// Two modes, drawn in the theme's ink:
//  - "simple": a drawn eye that opens and closes on cue (`openKeys`: openness 0..1 at shot seconds);
//  - "section": a side cross-section (cornea, lens, vitreous humour, retina) whose parts can tint on cue,
//    with labels, an optional light beam passing through, and a question mark settling at the back.
export type PlateCaption = {
  text: string;
  atSec: number;
  untilSec?: number;
  at: [number, number]; // text position (frame px, left of the text's baseline unless align)
  anchor?: [number, number]; // the point on the drawing the fine leader line runs to
  align?: "start" | "end";
  size?: number; // default 30
  mono?: boolean; // a small caps mono tag (e.g. DALTON'S GUESS), else an italic serif caption
  underline?: { atSec: number; fromCh?: number; toCh?: number; untilSec?: number };
};
export type EyeDiagramProps = {
  mode: "simple" | "section" | "plate";
  // plate mode (act 3 v6, Designer + Subject Expert, 24 Nov 2026): the section drawn as an anatomical plate on a cream
  // card, in true proportion for a 24 mm eye (cornea, aqueous, iris, lens, ciliary body, vitreous cupped round the
  // lens, retina almost to the front, optic nerve to the nasal side), engraved hatching on the sclera, stipple on the
  // lens, serif captions on fine leaders, the vitreous tint as a watercolour wash brushed on, light as dots.
  captions?: PlateCaption[];
  card?: { x: number; y: number; w: number; h: number; tilt?: number };
  openKeys?: { atSec: number; open: number }[];
  tints?: { part: "vitreous" | "lens"; color: string; atSec: number; opacity?: number; brushSec?: number }[]; // brushSec: plate wash brush-on time (default 1.2)
  parts?: { part: "cornea" | "lens" | "vitreous" | "retina"; text: string; atSec: number }[];
  beat?: { atSec: number; drawSec?: number; color?: string };
  rays?: RaySpec & { color?: string }; // section mode: VIS-021 dots of light travelling in through the front to the back
  question?: { atSec: number; dimAtSec?: number };
  labels?: LabelSpec[];
  tag?: DatelineTagProps;
  // section mode (WCL-E01 act 3, the Director's D_into_the_eye / C): a part outline on cue in the accent (the fluids on
  // 'clear fluids', then the vitreous alone on 'clear jelly'); untilSec un-draws it
  outlines?: { parts: ("aqueous" | "vitreous")[]; atSec: number; untilSec?: number }[];
  // a tint pulse: the tint's opacity rises to `to` and settles back over `sec` (C: 'blue glass', 0.5 -> 0.6 -> 0.5)
  pulses?: { part: "vitreous" | "lens"; atSec: number; to: number; sec?: number }[];
  startSec?: number;
};

export const EyeDiagram: React.FC<EyeDiagramProps> = ({
  mode,
  openKeys = [{ atSec: 0, open: 1 }],
  tints = [],
  parts = [],
  beat,
  rays,
  question,
  labels = [],
  tag,
  outlines = [],
  pulses = [],
  startSec = 0,
  captions = [],
  card,
}) => {
  useAssets(["VIS-019", "MOT-001", "MOT-002", ...(rays ? ["VIS-021"] : [])]);
  const t = useTheme();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pIn = reveal(frame, fps, startSec, 0.9);
  const ink = t.colors.ink;
  const hair = t.colors.secondary;
  const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT } as const;

  if (mode === "simple") {
    // openness between keyframes; each change takes 0.8 s from its key.
    const now = frame / fps;
    let i = 0;
    for (let k = 0; k < openKeys.length; k++) if (openKeys[k].atSec <= now) i = k;
    let open = openKeys[i]?.open ?? 1;
    if (i > 0) {
      const a = sec(openKeys[i].atSec, fps);
      open = interpolate(frame, [a, a + sec(0.8, fps)], [openKeys[i - 1].open, openKeys[i].open], ease);
    }
    const W = 760;
    const H = 330;
    const cx = W / 2;
    const cy = H / 2;
    const lowCtrl = cy + (H / 2) * 1.05;
    const upCtrl = lowCtrl + (cy - H - lowCtrl) * open; // closed: the upper lid meets the lower one
    const upper = `M 20 ${cy} Q ${cx} ${upCtrl} ${W - 20} ${cy}`;
    const lower = `M 20 ${cy} Q ${cx} ${cy + (H / 2) * 1.05} ${W - 20} ${cy}`;
    const clipId = `eyeclip${uid}`;
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: pIn, transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        <svg width={W} height={H + 40} viewBox={`0 -20 ${W} ${H + 40}`} style={{ overflow: "visible" }}>
          <defs>
            <clipPath id={clipId}>
              <path d={`${upper} Q ${cx} ${cy + (H / 2) * 1.05} 20 ${cy} Z`} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect x={0} y={-20} width={W} height={H + 40} fill={t.colors.panel} />
            <circle cx={cx} cy={cy + 6} r={112} fill="none" stroke={ink} strokeWidth={4} />
            <circle cx={cx} cy={cy + 6} r={52} fill={t.colors.dimMask} stroke={ink} strokeWidth={3} />
            <circle cx={cx + 22} cy={cy - 14} r={11} fill={ink} opacity={0.9} />
          </g>
          <path d={upper} fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
          <path d={lower} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        </svg>
        {labels.map((l) => (
          <Label key={`${l.text}${l.atSec}`} spec={l} />
        ))}
        {tag ? <DatelineTag {...tag} /> : null}
      </AbsoluteFill>
    );
  }

  if (mode === "plate") {
    const P = { ...t.colors, ...(t.paper ?? {}) };
    const C = card ?? { x: 680, y: 120, w: 1060, h: 840, tilt: -1.2 };
    const mm = 23.8; // px per mm: a 24 mm eye is 571 px across
    const R = 12 * mm; // the globe (sclera outer surface)
    const ex = C.x + C.w * 0.5 + 10; // eye centre
    const ey = C.y + C.h * 0.5;
    const apex = ex - R - 1.0 * mm; // the cornea bulges ~1 mm beyond the globe
    const corR = 7.8 * mm; // cornea radius of curvature
    const corH = 5.8 * mm; // half the corneal diameter
    // where the cornea meets the globe (x on the globe at y = +-corH)
    const limbX = ex - Math.sqrt(R * R - corH * corH);
    const lensF = apex + 3.6 * mm; // lens front (aqueous ~3 mm deep behind a 0.55 mm cornea)
    const lensB = lensF + 4.0 * mm; // lens back (4 mm thick)
    const lensH = 4.7 * mm; // half the lens diameter (9.5 mm)
    const pupil = 2.0 * mm;
    const retinaR = R - 0.9 * mm; // retina lines the inside
    const ciliaryX = limbX + 1.6 * mm;
    const ciliaryY = lensH + 1.6 * mm;
    // the inner wall's x at height y (back half of the globe)
    const wallX = (y: number) => ex + Math.sqrt(Math.max(0, retinaR * retinaR - y * y));
    const frontX = (r: number, h: number) => ex - Math.sqrt(Math.max(0, r * r - h * h)); // a point on the front of a circle
    const pIn2 = pIn;
    // rounded equator (Gate 3 v6 picture pass S2): cubic curves with flat tangents at the tips; back steeper than front
    const lm = (lensF + lensB) / 2;
    const lensPath = `M ${lm} ${ey - lensH} C ${lm - 1.1 * mm} ${ey - lensH} ${lensF} ${ey - lensH * 0.6} ${lensF} ${ey} C ${lensF} ${ey + lensH * 0.6} ${lm - 1.1 * mm} ${ey + lensH} ${lm} ${ey + lensH} C ${lm + 1.2 * mm} ${ey + lensH} ${lensB} ${ey + lensH * 0.42} ${lensB} ${ey} C ${lensB} ${ey - lensH * 0.42} ${lm + 1.2 * mm} ${ey - lensH} ${lm} ${ey - lensH} Z`;
    // vitreous: from the ciliary body round the back wall, then cupped round the lens back (hyaloid fossa)
    const vTopY = ey - (ciliaryY + 1.4 * mm);
    const vTopX = frontX(retinaR, ey - vTopY);
    const vitPath = `M ${vTopX} ${vTopY} A ${retinaR} ${retinaR} 0 1 1 ${vTopX} ${2 * ey - vTopY} Q ${lensB + 0.6 * mm} ${ey + lensH * 0.9} ${lensB + 0.5 * mm} ${ey} Q ${lensB + 0.6 * mm} ${ey - lensH * 0.9} ${vTopX} ${vTopY} Z`;
    const aqPath = `M ${limbX} ${ey - corH} A ${corR} ${corR} 0 0 0 ${limbX} ${ey + corH} L ${lensF + 0.4 * mm} ${ey + pupil} Q ${lensF - 0.5 * mm} ${ey} ${lensF + 0.4 * mm} ${ey - pupil} Z`;
    const tv = (() => {
      const x = tints.filter((q) => q.part === "vitreous").pop();
      if (!x) return null;
      const a = sec(x.atSec, fps);
      const brush = interpolate(frame, [a, a + sec(x.brushSec ?? 1.2, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      let op = x.opacity ?? 0.45;
      for (const pu of pulses.filter((q) => q.part === "vitreous")) {
        const d = pu.sec ?? 1.2;
        const u = interpolate(frame, [sec(pu.atSec, fps), sec(pu.atSec + d, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        op += (pu.to - (x.opacity ?? 0.45)) * Math.sin(Math.PI * u);
      }
      return { color: x.color, op, brush };
    })();
    // the light: dots from the card's left edge to the retina (VIS-021), as in shot C
    const x0 = C.x + 34;
    const x1 = wallX(0) - 6;
    const id = (k: string) => `${k}${uid}`;
    const nerveA = 0.26; // optic nerve leaves ~15 degrees to the nasal side of the axis
    const nx = ex + R * Math.cos(nerveA);
    const ny = ey + R * Math.sin(nerveA);
    return (
      <AbsoluteFill style={{ opacity: pIn2, transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        <svg width={1920} height={1080}>
          <defs>
            <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.30  0 0 0 0 0.24  0 0 0 0.10 0" result="g" />
              <feComposite in="g" in2="SourceGraphic" operator="in" result="gg" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="gg" />
              </feMerge>
            </filter>
            <filter id={id("shadow")} x="-10%" y="-10%" width="120%" height="125%">
              <feDropShadow dx={-10} dy={16} stdDeviation={16} floodColor="#000" floodOpacity={0.42} />
            </filter>
            <pattern id={id("hatch")} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
              <line x1={0} y1={0} x2={0} y2={7} stroke={P.ink} strokeWidth={1.1} opacity={0.55} />
            </pattern>
            <pattern id={id("hatch2")} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(-52)">
              <line x1={0} y1={0} x2={0} y2={9} stroke={P.ink} strokeWidth={0.9} opacity={0.35} />
            </pattern>
            <pattern id={id("stipple")} width={9} height={9} patternUnits="userSpaceOnUse">
              <circle cx={2} cy={3} r={0.9} fill={P.ink} opacity={0.45} />
              <circle cx={6.5} cy={7} r={0.8} fill={P.ink} opacity={0.35} />
            </pattern>
            <clipPath id={id("ring")}>
              <path clipRule="evenodd" d={`M ${ex - R} ${ey} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0 Z M ${ex - (R - 0.9 * mm)} ${ey} a ${R - 0.9 * mm} ${R - 0.9 * mm} 0 1 0 ${2 * (R - 0.9 * mm)} 0 a ${R - 0.9 * mm} ${R - 0.9 * mm} 0 1 0 ${-2 * (R - 0.9 * mm)} 0 Z`} />
            </clipPath>
            <mask id={id("front")} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
              <rect x={0} y={0} width={1920} height={1080} fill="#fff" />
              <rect x={ex - R - 6} y={ey - corH + 1} width={limbX - (ex - R) + 8} height={2 * corH - 2} fill="#000" />
            </mask>
            <clipPath id={id("vit")}>
              <path d={vitPath} />
            </clipPath>
            <filter id={id("wash")} x="-5%" y="-5%" width="110%" height="110%">
              {/* watercolour granulation (Gate 3 v6 picture pass S1): low-frequency pigment variation, no per-pixel noise */}
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={9} result="t" />
              <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.38 1.08" result="pm" />
              <feComposite in="SourceGraphic" in2="pm" operator="in" />
            </filter>
            <linearGradient id={id("brush")} x1="0" x2="1" y1="0" y2="0">
              <stop offset={Math.max(0, (tv?.brush ?? 0) * 1.15 - 0.15)} stopColor="#fff" stopOpacity={1} />
              <stop offset={Math.min(1, (tv?.brush ?? 0) * 1.15)} stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id={id("brushm")} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
              <rect x={ex - R} y={ey - R} width={2 * R} height={2 * R} fill={`url(#${id("brush")})`} />
            </mask>
          </defs>
          {/* the plate: cream card on the graphite, tilted, with the scanned pages' shadow */}
          <g transform={`rotate(${C.tilt ?? -1.2} ${C.x + C.w / 2} ${C.y + C.h / 2})`}>
            <rect x={C.x} y={C.y} width={C.w} height={C.h} fill={P.canvas} filter={`url(#${id("shadow")})`} />
            <rect x={C.x} y={C.y} width={C.w} height={C.h} fill={P.canvas} filter={`url(#${id("grain")})`} />
            <rect x={C.x + 22} y={C.y + 22} width={C.w - 44} height={C.h - 44} fill="none" stroke={P.ink} strokeWidth={1.2} opacity={0.35} />
          </g>
          {/* sclera: engraved double hatch in the ring */}
          {/* the globe, open at the front where the cornea takes over (masked, so no patch on the paper) */}
          <g mask={`url(#${id("front")})`}>
            <g clipPath={`url(#${id("ring")})`}>
              <rect x={ex - R - 2} y={ey - R - 2} width={2 * R + 4} height={2 * R + 4} fill={`url(#${id("hatch")})`} />
              <rect x={ex - R - 2} y={ey - R - 2} width={2 * R + 4} height={2 * R + 4} fill={`url(#${id("hatch2")})`} />
            </g>
            <circle cx={ex} cy={ey} r={R} fill="none" stroke={P.ink} strokeWidth={2.6} />
            <circle cx={ex} cy={ey} r={R - 0.9 * mm} fill="none" stroke={P.ink} strokeWidth={1.2} opacity={0.7} />
          </g>
          {/* cornea: a 0.55 mm shell bulging ~1 mm beyond the globe */}
          <path d={`M ${limbX} ${ey - corH} A ${corR} ${corR} 0 0 0 ${limbX} ${ey + corH}`} fill="none" stroke={P.ink} strokeWidth={2.6} />
          <path d={`M ${limbX + 0.4 * mm} ${ey - corH + 0.5 * mm} A ${corR - 0.55 * mm} ${corR - 0.55 * mm} 0 0 0 ${limbX + 0.4 * mm} ${ey + corH - 0.5 * mm}`} fill="none" stroke={P.ink} strokeWidth={1.1} opacity={0.75} />
          {/* the vitreous wash: Dalton's guess, brushed on in watercolour */}
          {tv ? (
            <g mask={`url(#${id("brushm")})`} style={{ mixBlendMode: "multiply" }}>
              <g clipPath={`url(#${id("vit")})`}>
                <path d={vitPath} fill={tv.color} opacity={tv.op} filter={`url(#${id("wash")})`} />
                {/* the pigment edge where the wash dried against the wall (about +15% density, 2-3 px inside) */}
                <path d={vitPath} fill="none" stroke={tv.color} strokeWidth={5} opacity={Math.min(1, tv.op * 0.6)} />
              </g>
            </g>
          ) : null}
          {/* retina: lines the inside almost to the front (ora serrata near the ciliary body) */}
          <path d={`M ${frontX(retinaR, ciliaryY + 1.9 * mm)} ${ey - (ciliaryY + 1.9 * mm)} A ${retinaR} ${retinaR} 0 1 1 ${frontX(retinaR, ciliaryY + 1.9 * mm)} ${ey + ciliaryY + 1.9 * mm}`} fill="none" stroke={P.ink} strokeWidth={2.6} opacity={1} />
          <path d={`M ${frontX(retinaR - 0.45 * mm, ciliaryY + 1.7 * mm)} ${ey - (ciliaryY + 1.7 * mm)} A ${retinaR - 0.45 * mm} ${retinaR - 0.45 * mm} 0 1 1 ${frontX(retinaR - 0.45 * mm, ciliaryY + 1.7 * mm)} ${ey + ciliaryY + 1.7 * mm}`} fill="none" stroke={P.ink} strokeWidth={0.9} opacity={0.45} />
          {/* ciliary body and zonules holding the lens */}
          {[-1, 1].map((sgn) => (
            <g key={sgn}>
              <path d={`M ${limbX + 0.2 * mm} ${ey + sgn * (corH + 0.1 * mm)} L ${ciliaryX + 2.2 * mm} ${ey + sgn * (ciliaryY + 1.9 * mm)} L ${ciliaryX + 0.6 * mm} ${ey + sgn * (lensH + 1.2 * mm)} Z`} fill={P.ink} fillOpacity={0.42} stroke={P.ink} strokeWidth={1} strokeLinejoin="round" />
              <path d={`M ${limbX + 0.2 * mm} ${ey + sgn * (corH + 0.1 * mm)} L ${ciliaryX + 2.2 * mm} ${ey + sgn * (ciliaryY + 1.9 * mm)} L ${ciliaryX + 0.6 * mm} ${ey + sgn * (lensH + 1.2 * mm)} Z`} fill={`url(#${id("hatch")})`} />
              {[0, 1, 2, 3].map((k) => (
                <line key={k} x1={ciliaryX + 0.6 * mm + k * 0.35 * mm} y1={ey + sgn * (lensH + 1.15 * mm - k * 0.1 * mm)} x2={(lensF + lensB) / 2 - 0.6 * mm + k * 0.5 * mm} y2={ey + sgn * (lensH - 0.1 * mm)} stroke={P.ink} strokeWidth={0.6} opacity={0.6} />
              ))}
              {/* iris: rests on the lens front, the pupil between */}
              <path d={`M ${limbX + 0.2 * mm} ${ey + sgn * (corH + 0.1 * mm)} Q ${lensF - 0.6 * mm} ${ey + sgn * (pupil + 2.2 * mm)} ${lensF + 0.1 * mm} ${ey + sgn * pupil} L ${lensF - 0.5 * mm} ${ey + sgn * (pupil + 0.2 * mm)} Q ${limbX - 0.3 * mm} ${ey + sgn * (corH - 1.0 * mm)} ${limbX + 0.2 * mm} ${ey + sgn * (corH + 0.1 * mm)} Z`} fill={P.ink} opacity={0.82} />
            </g>
          ))}
          {/* lens: 4 mm thick, 9.5 mm across, back more curved than the front, stippled, never tinted */}
          <path d={lensPath} fill={P.canvas} />
          <path d={lensPath} fill={`url(#${id("stipple")})`} stroke={P.ink} strokeWidth={2.2} />
          {/* optic nerve, to the nasal side of the axis */}
          <path d={`M ${nx - 1.4 * mm * Math.sin(nerveA)} ${ny - 1.6 * mm} L ${nx + 4.5 * mm} ${ny + 0.6 * mm} M ${nx + 1.4 * mm * Math.sin(nerveA)} ${ny + 1.6 * mm} L ${nx + 4.2 * mm} ${ny + 3.2 * mm}`} stroke={P.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          {outlines.map((o, i) => {
            const pin = interpolate(frame, [sec(o.atSec, fps), sec(o.atSec + 0.7, fps)], [0, 1], ease);
            const pout = o.untilSec !== undefined ? interpolate(frame, [sec(o.untilSec, fps), sec(o.untilSec + 0.4, fps)], [1, 0], ease) : 1;
            if (Math.min(pin, pout) <= 0) return null;
            const len = 2600;
            return (
              <g key={i} fill="none" stroke={P.accent} strokeWidth={4} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - pin)} opacity={pout}>
                {o.parts.includes("vitreous") ? <path d={vitPath} /> : null}
                {o.parts.includes("aqueous") ? <path d={aqPath} /> : null}
              </g>
            );
          })}
          {rays
            ? particles(rays, x1 - x0, frame / fps).map((q) => (
                <circle key={q.k} cx={x0 + (x1 - x0) * q.u} cy={ey + q.side} r={rays.size ?? 6} fill={q.color ?? rays.color ?? P.ink} opacity={q.alpha} stroke={P.ink} strokeOpacity={0.25 * q.alpha} strokeWidth={1} />
              ))
            : null}
          {/* captions: italic serif on fine leaders (or a small mono tag), in the paper's ink */}
          {captions.map((c, i) => {
            const pin = interpolate(frame, [sec(c.atSec, fps), sec(c.atSec + 0.6, fps)], [0, 1], ease);
            const pout = c.untilSec !== undefined ? interpolate(frame, [sec(c.untilSec, fps), sec(c.untilSec + 0.4, fps)], [1, 0], ease) : 1;
            const v = Math.min(pin, pout);
            if (v <= 0) return null;
            const size = c.size ?? (c.mono ? 20 : 30);
            const ulOut = c.underline?.untilSec !== undefined ? interpolate(frame, [sec(c.underline.untilSec, fps), sec(c.underline.untilSec + 0.3, fps)], [1, 0], ease) : 1;
            const ul = c.underline ? interpolate(frame, [sec(c.underline.atSec, fps), sec(c.underline.atSec + 0.35, fps)], [0, 1], ease) * ulOut : 0;
            const chW = size * (c.mono ? 0.62 : 0.5);
            const f = c.underline?.fromCh ?? 0;
            const tch = c.underline?.toCh ?? c.text.length;
            const tx = c.align === "end" ? c.at[0] - c.text.length * chW : c.at[0];
            return (
              <g key={i} opacity={v}>
                {c.anchor ? (
                  <>
                    {(() => {
                      // the leader leaves the caption's nearer end, 6 px clear of the text (Gate 3 v6 picture pass S5)
                      const L = tx - 6;
                      const Rr = tx + c.text.length * chW + 6;
                      const lx = c.anchor[0] <= L ? L : c.anchor[0] >= Rr ? Rr : c.anchor[0] - L < Rr - c.anchor[0] ? L : Rr;
                      const ly = c.anchor[0] > L && c.anchor[0] < Rr ? (c.anchor[1] > c.at[1] ? c.at[1] + 10 : c.at[1] - size * 0.9) : c.at[1] - size * 0.32;
                      return <line x1={lx} y1={ly} x2={c.anchor[0]} y2={c.anchor[1]} stroke={P.ink} strokeWidth={1} opacity={0.7} />;
                    })()}
                    <circle cx={c.anchor[0]} cy={c.anchor[1]} r={3} fill={P.ink} />
                  </>
                ) : null}
                <text x={c.at[0]} y={c.at[1]} fontFamily={c.mono ? t.fonts.mono : t.fonts.serif} fontStyle={c.mono ? "normal" : "italic"} fontSize={size} letterSpacing={c.mono ? 2.5 : 0.2} fill={P.ink} textAnchor={c.align === "end" ? "end" : "start"}>
                  {c.text}
                </text>
                {ul > 0 ? <line x1={tx + f * chW} y1={c.at[1] + 8} x2={tx + f * chW + (tch - f) * chW * ul} y2={c.at[1] + 8} stroke={P.accent} strokeWidth={3} /> : null}
              </g>
            );
          })}
        </svg>
        {labels.map((l) => (
          <Label key={`${l.text}${l.atSec}`} spec={l} />
        ))}
        {tag ? <DatelineTag {...tag} /> : null}
      </AbsoluteFill>
    );
  }

  // Section mode: eyeball centred at (960, 540), light enters from the left through the cornea.
  const R = 330;
  const cx = 960;
  const cy = 540;
  const tintOf = (part: "vitreous" | "lens") =>
    tints
      .filter((x) => x.part === part)
      .map((x) => {
        let op = interpolate(frame, [sec(x.atSec, fps), sec(x.atSec + 1.2, fps)], [0, x.opacity ?? 0.45], ease);
        for (const pu of pulses.filter((q) => q.part === part)) {
          const d = pu.sec ?? 1.2;
          const u = interpolate(frame, [sec(pu.atSec, fps), sec(pu.atSec + d, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          op += (pu.to - (x.opacity ?? 0.45)) * Math.sin(Math.PI * u);
        }
        return { color: x.color, op };
      })
      .pop();
  const tv = tintOf("vitreous");
  const tl = tintOf("lens");
  const partPos: Record<string, [number, number]> = {
    cornea: [cx - R - 60, cy - 230],
    lens: [cx - R + 120, cy + 400],
    vitreous: [cx + 40, cy - 60],
    retina: [cx + R + 30, cy - 250],
  };
  const pBeam = beat ? interpolate(frame, [sec(beat.atSec, fps), sec(beat.atSec + (beat.drawSec ?? 1.4), fps)], [0, 1], ease) : 0;
  const pQ = question ? reveal(frame, fps, question.atSec, 0.9) : 0;
  const qDim = question?.dimAtSec !== undefined ? 1 - 0.6 * reveal(frame, fps, question.dimAtSec, 0.9) : 1;
  const x0 = cx - R - 420;
  const x1 = cx + R - 10;
  return (
    <AbsoluteFill style={{ opacity: pIn, transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <svg width={1920} height={1080}>
        <circle cx={cx} cy={cy} r={R} fill={t.colors.panel} stroke={ink} strokeWidth={4} />
        {tv ? <path d={`M ${cx - R + 168} ${cy - 252} A ${R - 18} ${R - 18} 0 1 1 ${cx - R + 168} ${cy + 252} Q ${cx - R + 150} ${cy} ${cx - R + 168} ${cy - 252} Z`} fill={tv.color} opacity={tv.op} /> : null /* the vitreous shape, as its outline (Gate 3 review S4) */}
        <path d={`M ${cx - R + 40} ${cy - 150} Q ${cx - R - 70} ${cy} ${cx - R + 40} ${cy + 150}`} fill={t.colors.canvas} stroke={ink} strokeWidth={4} />
        <ellipse cx={cx - R + 120} cy={cy} rx={42} ry={110} fill={t.colors.canvas} stroke={ink} strokeWidth={4} />
        {tl ? <ellipse cx={cx - R + 120} cy={cy} rx={40} ry={108} fill={tl.color} opacity={tl.op} /> : null}
        <path
          d={`M ${cx + (R - 12) * Math.cos(-1.1)} ${cy + (R - 12) * Math.sin(-1.1)} A ${R - 12} ${R - 12} 0 0 1 ${cx + (R - 12) * Math.cos(1.1)} ${cy + (R - 12) * Math.sin(1.1)}`}
          fill="none"
          stroke={t.colors.accent}
          strokeWidth={6}
          opacity={0.8}
        />
        {outlines.map((o, i) => {
          const pin = interpolate(frame, [sec(o.atSec, fps), sec(o.atSec + 0.7, fps)], [0, 1], ease);
          const pout = o.untilSec !== undefined ? interpolate(frame, [sec(o.untilSec, fps), sec(o.untilSec + 0.4, fps)], [1, 0], ease) : 1;
          const v = Math.min(pin, pout);
          if (v <= 0) return null;
          const len = 2400;
          return (
            <g key={i} fill="none" stroke={t.colors.accent} strokeWidth={5} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - pin)} opacity={pout}>
              {o.parts.includes("vitreous") ? <path d={`M ${cx - R + 168} ${cy - 252} A ${R - 18} ${R - 18} 0 1 1 ${cx - R + 168} ${cy + 252} Q ${cx - R + 150} ${cy} ${cx - R + 168} ${cy - 252} Z`} /> : null}
              {o.parts.includes("aqueous") ? <path d={`M ${cx - R + 44} ${cy - 140} Q ${cx - R - 56} ${cy} ${cx - R + 44} ${cy + 140} Q ${cx - R + 86} ${cy} ${cx - R + 44} ${cy - 140} Z`} /> : null}
            </g>
          );
        })}
        {beat && pBeam > 0 ? ( // no zero-length line: its round cap would show as a stray dot before the beam draws
          <line
            x1={x0}
            y1={cy}
            x2={x0 + (x1 - x0) * pBeam}
            y2={cy}
            stroke={beat.color ?? ink}
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.85}
          />
        ) : null}
        {rays
          ? particles(rays, x1 - x0, frame / fps).map((q) => (
              <circle key={q.k} cx={x0 + (x1 - x0) * q.u} cy={cy + q.side} r={rays.size ?? 6} fill={q.color ?? rays.color ?? ink} opacity={q.alpha} />
            ))
          : null}
        {question ? (
          <text
            x={cx + R - 90}
            y={cy + 30 - (1 - pQ) * 30}
            fontFamily={t.fonts.serif}
            fontSize={150}
            fill={t.colors.accent}
            opacity={pQ * qDim}
            textAnchor="middle"
          >
            ?
          </text>
        ) : null}
        {parts.map((p) => {
          const [lx, ly] = partPos[p.part];
          return (
            <text
              key={p.part}
              x={lx}
              y={ly}
              fontFamily={t.fonts.mono}
              fontSize={26}
              letterSpacing={3}
              fill={hair}
              opacity={Math.min(1, lock(frame, fps, p.atSec))}
              textAnchor={p.part === "retina" ? "start" : p.part === "cornea" ? "end" : "middle"}
            >
              {p.text}
            </text>
          );
        })}
      </svg>
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
