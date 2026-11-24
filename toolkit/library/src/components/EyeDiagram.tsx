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
export type EyeDiagramProps = {
  mode: "simple" | "section";
  openKeys?: { atSec: number; open: number }[];
  tints?: { part: "vitreous" | "lens"; color: string; atSec: number; opacity?: number }[];
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
