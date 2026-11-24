import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource, useAsset, assetFile } from "../registry";

const PLASTER = "public/assets/textures/texturelabs/Texturelabs_Concrete_202M.jpg";
// TEX-009 is only checked (and must be Active) when a shot asks for it; props are fixed for a shot's life.
const usePlaster = (on: boolean) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return on ? assetFile(useAsset("TEX-009"), PLASTER) : "";
};
import { particles, type RaySpec } from "../layers/RayParticles";
import { reveal, rise } from "../motion";
import { wavelengthRGB } from "../layers/spectrum";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-015 PerspectiveGrid: a room or a floor drawn as a one-point perspective grid in the theme's ink,
// with objects placed in the same space (a beam, a prism, a spectrum fan on the back wall, a page lying on
// the floor, coloured patches, a lens ring, labels). One slow dolly per shot, inside the calm limit.
//
// World units are px. x right, y down, z = depth into the screen (0 = the screen plane, D = the back wall).
// A point at depth z is drawn at scale F / (F + z) around the vanishing point; CSS 3D objects (pages) use
// the same perspective, so lines and pages line up.

type V3 = [number, number, number];
// Act 4 builder additions (25 Nov 2026, WCL-E01 act 4 Director's brief): every object may leave (untilSec, 0.5 s fade)
// and dim (dimSec -> dimTo over 0.6 s); prisms point down (light bends towards the base), turn, and dim to an outline;
// fans draw their cone first (coneAtSec), shift sideways (shift), and can be a dashed ghost (the prediction);
// boards (a panel standing in the room), lenses and dashed rings.
type Life = { untilSec?: number; dimSec?: number; dimTo?: number };
export type GridObject = (
  | {
      kind: "beam";
      from: V3;
      to: V3;
      width?: number;
      color?: string;
      atSec?: number;
      drawSec?: number;
    }
  | { kind: "prism"; at: V3; size?: number; atSec?: number; apex?: "up" | "down"; turn?: { atSec: number; deg: number; sec?: number } }
  | {
      kind: "fan";
      from: V3;
      x0: number;
      x1: number;
      y: number;
      height: number;
      z?: number;
      atSec?: number;
      coneAtSec?: number; // the cone from the prism draws first; the band lands at atSec
      ghost?: boolean; smooth?: boolean; // dashed outline, faint fill: a prediction, not a result
      shift?: { atSec: number; dx: number; sec?: number };
    }
  | { kind: "hole"; at: V3; r?: number; atSec?: number }
  // a closed wooden window shutter on a wall (draw it before its hole); boards as faint vertical lines
  | { kind: "shutter"; at: V3; w: number; h: number; boards?: number; atSec?: number }
  | {
      kind: "patch";
      at: V3;
      w: number;
      h: number;
      color: string;
      atSec?: number;
    }
  | { kind: "ring"; at: V3; r: number; atSec?: number; dashed?: boolean }
  | {
      kind: "page";
      srcId: string;
      aspect: number;
      x: number;
      z: number;
      width: number;
      plane?: "floor" | "wall";
      atSec?: number;
    }
  | { kind: "label"; at: V3; text: string; atSec?: number; dy?: number }
  // VIS-021 RayParticles: dots of light travelling from `from` to `to` (one dot per ray), shrinking with depth.
  | ({ kind: "rays"; from: V3; to: V3; color?: string; trail?: number; streak?: number } & RaySpec) // trail: faint path line opacity (0-0.35); streak: draw each ray as a short streak of this many px
  | { kind: "board"; at: V3; w: number; h: number; atSec?: number }
  | { kind: "lens"; at: V3; w: number; h: number; atSec?: number }
) & Life;

export type PerspectiveGridProps = {
  variant?: "room" | "floor";
  width?: number; // room width
  depth?: number; // back wall depth
  floorY?: number; // floor height below the vanishing point
  ceilY?: number; // ceiling height above the vanishing point (room only)
  cell?: number; // grid spacing
  vanishY?: number;
  focal?: number;
  dolly?: number; // near-plane scale reached by the end of the shot, 0..0.03 (calm limit)
  dollyFrom?: number; // near-plane scale at the shot's first frame (0 = 1.00): continue a previous shot's dolly at a join
  lineFadeSec?: number; // the room's lines fade to lineTo (0.8 s) from this time
  lineTo?: number;
  title?: { text: string; atSec?: number; untilSec?: number; x?: number; y?: number }; // a chapter title standing in the room
  lineOpacity?: number;
  nearZ?: number; // how far the floor and walls run in front of the screen plane (negative = towards the viewer)
  dark?: number; // 0..1 darkens the canvas (Newton's dark room)
  plaster?: number; // 0..0.3: TEX-009 plaster (Concrete_202) inside the room's walls and floor, never over lines or text
  fog?: number; // 0..0.6 LOK-014 DepthFog: far lines and objects fade and soften, a haze sits at the back, beams scatter
  objects?: GridObject[];
  caption?: string;
  tag?: DatelineTagProps; // e.g. the name of who is in the room, when no figure is drawn
  startSec?: number;
};

export const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({
  variant = "room",
  width = 2600,
  depth = 2400,
  floorY = 430,
  ceilY = 470,
  cell = 200,
  vanishY = 470,
  focal = 1100,
  dolly = 0.02,
  dollyFrom = 0,
  lineFadeSec,
  lineTo = 0.4,
  title,
  lineOpacity = 0.26,
  nearZ = -420,
  dark = 0,
  plaster = 0,
  fog = 0,
  objects = [],
  caption,
  tag,
  startSec = 0,
}) => {
  const hasRays = objects.some((o) => o.kind === "rays");
  useAssets([
    "VIS-015",
    "MOT-001",
    "MOT-002",
    ...(hasRays ? ["VIS-021"] : []),
    ...(fog > 0 ? ["LOK-014"] : []),
  ]);
  const plasterSrc = usePlaster(plaster > 0);
  if (plaster < 0 || plaster > 0.3)
    throw new Error(`PerspectiveGrid plaster ${plaster} is outside 0-0.3.`);
  if (dollyFrom < 0 || dollyFrom > dolly + 1e-9)
    throw new Error(`PerspectiveGrid dollyFrom ${dollyFrom} must be 0..dolly.`);
  if (dolly < 0 || dolly > 0.03)
    throw new Error(
      `PerspectiveGrid dolly ${dolly} is outside the calm limit (0-0.03).`,
    );
  if (fog < 0 || fog > 0.6)
    throw new Error(`PerspectiveGrid fog ${fog} is outside 0-0.6.`);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width: W } = useVideoConfig();
  const cx = W / 2;
  const cy = vanishY;
  // The camera moves forward so the near plane grows to 1 + dolly by the end of the shot.
  const push = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [focal * (1 - 1 / (1 + dollyFrom)), focal * (1 - 1 / (1 + dolly))],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    },
  );
  const zOf = (z: number) => Math.max(1 - focal * 0.9, z - push);
  const s = (z: number) => focal / (focal + zOf(z));
  const P = (x: number, y: number, z: number): [number, number] => [
    cx + x * s(z),
    cy + y * s(z),
  ];
  const fade = (z: number) => {
    const d = Math.min(1, Math.max(0, z / depth));
    return lineOpacity * (1 - 0.75 * d) * (1 - 0.7 * fog * d);
  };
  const z0 = Math.ceil(nearZ / cell) * cell;
  const pGrid = reveal(frame, fps, startSec, 0.9);
  const ink = t.colors.ink;

  const lines: {
    a: [number, number];
    b: [number, number];
    o: number;
    k: string;
    far: boolean;
  }[] = [];
  const hw = width / 2;
  const L = (k: string, a: V3, b: V3) =>
    lines.push({
      k,
      a: P(...a),
      b: P(...b),
      o: fade(Math.min(a[2], b[2])),
      far: Math.min(a[2], b[2]) > depth * 0.5,
    });
  const objZ = (o: GridObject): number =>
    "at" in o
      ? o.at[2]
      : o.kind === "fan"
        ? (o.z ?? depth)
        : o.kind === "page"
          ? o.z
          : "to" in o
            ? Math.min(o.from[2], o.to[2])
            : 0;
  const fogged = (o: GridObject, el: React.ReactNode, key: number) =>
    fog > 0 && objZ(o) > depth * 0.6 ? (
      <g key={key} filter="url(#pg-fog)">
        {el}
      </g>
    ) : (
      el
    );
  // Floor: lines running into the distance, then lines across at each depth step.
  for (let x = -hw; x <= hw + 0.5; x += cell)
    L(`fx${x}`, [x, floorY, nearZ], [x, floorY, depth]);
  for (let z = z0; z <= depth + 0.5; z += cell)
    L(`fz${z}`, [-hw, floorY, z], [hw, floorY, z]);
  if (variant === "room") {
    // Back wall.
    for (let x = -hw; x <= hw + 0.5; x += cell)
      L(`bx${x}`, [x, -ceilY, depth], [x, floorY, depth]);
    for (let y = -ceilY; y <= floorY + 0.5; y += cell)
      L(`by${y}`, [-hw, y, depth], [hw, y, depth]);
    // Side walls and ceiling edges.
    for (const sx of [-hw, hw]) {
      for (let z = z0; z <= depth + 0.5; z += cell)
        L(`sz${sx}${z}`, [sx, -ceilY, z], [sx, floorY, z]);
      for (let y = -ceilY; y <= floorY + 0.5; y += cell)
        L(`sy${sx}${y}`, [sx, y, nearZ], [sx, y, depth]);
    }
    for (let x = -hw; x <= hw + 0.5; x += cell * 2)
      L(`cx${x}`, [x, -ceilY, nearZ], [x, -ceilY, depth]);
  }

  const appear = (o: { atSec?: number }) =>
    reveal(frame, fps, o.atSec ?? startSec + 0.6, 0.8);
  const life = (o: Life) => {
    const tt = frame / fps;
    let k = 1;
    if (o.untilSec !== undefined) k *= interpolate(tt, [o.untilSec, o.untilSec + 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (o.dimSec !== undefined) k *= interpolate(tt, [o.dimSec, o.dimSec + 0.6], [1, o.dimTo ?? 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
    return k;
  };
  const lineK = lineFadeSec === undefined ? 1 : interpolate(frame / fps, [lineFadeSec, lineFadeSec + 0.8], [1, lineTo], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // One object in the grid's SVG (labels and pages are drawn outside it).
  const drawObject = (o: GridObject, i: number): React.ReactNode => {
    const p = appear(o);
    if (o.kind === "rays") {
      const len = Math.hypot(
        o.to[0] - o.from[0],
        o.to[1] - o.from[1],
        o.to[2] - o.from[2],
      );
      const ps = particles(o, len, frame / fps);
      const dots = ps.map((q) => {
        const pt: V3 = [
          o.from[0] + (o.to[0] - o.from[0]) * q.u,
          o.from[1] + (o.to[1] - o.from[1]) * q.u + q.side,
          o.from[2] + (o.to[2] - o.from[2]) * q.u,
        ];
        const [x, y] = P(...pt);
        return {
          x,
          y,
          r: (o.size ?? 5) * s(pt[2]),
          a: q.alpha,
          c: q.color ?? o.color ?? "#FFF6DD",
          k: q.k,
        };
      });
      const pa = P(...o.from);
      const pb = P(...o.to);
      const trailOp = Math.min(0.35, o.trail ?? 0) * Math.min(1, ps.length ? 1 : 0) * appear({ atSec: o.atSec });
      return (
        <g key={i}>
          {trailOp > 0 ? (
            <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} stroke={o.color ?? o.colors?.[0] ?? "#FFF6DD"} strokeOpacity={trailOp} strokeWidth={2} strokeLinecap="round" />
          ) : null}
          <g filter="url(#pg-glow)">
            {dots.map((d) => (
              <circle
                key={`g${d.k}`}
                cx={d.x}
                cy={d.y}
                r={d.r * (3 + 2 * fog)}
                fill={d.c}
                opacity={0.35 * d.a}
              />
            ))}
          </g>
          {o.streak
            ? (() => {
                const dx = pb[0] - pa[0];
                const dy = pb[1] - pa[1];
                const n = Math.hypot(dx, dy) || 1;
                const ux = (dx / n) * (o.streak ?? 0) * 0.5;
                const uy = (dy / n) * (o.streak ?? 0) * 0.5;
                return dots.map((d) => (
                  <line key={`d${d.k}`} x1={d.x - ux} y1={d.y - uy} x2={d.x + ux} y2={d.y + uy} stroke={d.c} strokeOpacity={d.a} strokeWidth={d.r * 1.6} strokeLinecap="round" />
                ));
              })()
            : dots.map((d) => (
                <circle
                  key={`d${d.k}`}
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill={d.c}
                  opacity={d.a}
                />
              ))}
        </g>
      );
    }
    if (o.kind === "beam") {
      const d = reveal(frame, fps, o.atSec ?? startSec + 0.6, o.drawSec ?? 0.9);
      const a = P(...o.from);
      const end: V3 = [
        o.from[0] + (o.to[0] - o.from[0]) * d,
        o.from[1] + (o.to[1] - o.from[1]) * d,
        o.from[2] + (o.to[2] - o.from[2]) * d,
      ];
      const b = P(...end);
      const w = (o.width ?? 18) * s((o.from[2] + end[2]) / 2);
      const col = o.color ?? "#FFF6DD";
      return (
        <g key={i} opacity={Math.min(1, d * 3)}>
          <line
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke={col}
            strokeWidth={w * (2.4 + 2 * fog)}
            strokeOpacity={0.25 + 0.35 * fog}
            filter="url(#pg-glow)"
            strokeLinecap="round"
          />
          <line
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke={col}
            strokeWidth={w}
            strokeOpacity={0.9}
            strokeLinecap="round"
          />
        </g>
      );
    }
    if (o.kind === "shutter") {
      const sc = s(o.at[2]);
      const [x, y] = P(...o.at);
      const w = o.w * sc;
      const h = o.h * sc;
      const n = o.boards ?? 4;
      return (
        <g key={i} opacity={p}>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4 * sc} fill={t.colors.panel} stroke={t.colors.ink} strokeOpacity={0.35} strokeWidth={2} />
          {Array.from({ length: n - 1 }, (_, k) => (
            <line key={k} x1={x - w / 2 + ((k + 1) * w) / n} y1={y - h / 2 + 4} x2={x - w / 2 + ((k + 1) * w) / n} y2={y + h / 2 - 4} stroke={t.colors.ink} strokeOpacity={0.18} strokeWidth={1.5} />
          ))}
        </g>
      );
    }
    if (o.kind === "hole") {
      const [x, y] = P(...o.at);
      const r = (o.r ?? 16) * s(o.at[2]);
      return (
        <g key={i} opacity={p}>
          <circle
            cx={x}
            cy={y}
            r={r * 3}
            fill="#FFF6DD"
            opacity={0.25}
            filter="url(#pg-glow)"
          />
          <circle cx={x} cy={y} r={r} fill="#FFF6DD" />
        </g>
      );
    }
    if (o.kind === "prism") {
      const [x, y] = P(...o.at);
      const k = (o.size ?? 120) * s(o.at[2]);
      const dn = o.apex === "down" ? -1 : 1;
      const pts = [
        [x, y - dn * k * 0.62],
        [x - k * 0.55, y + dn * k * 0.38],
        [x + k * 0.55, y + dn * k * 0.38],
      ];
      const deg = o.turn ? interpolate(frame / fps, [o.turn.atSec, o.turn.atSec + (o.turn.sec ?? 0.5)], [0, o.turn.deg], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) }) : 0;
      return (
        <polygon
          key={i}
          transform={deg ? `rotate(${deg} ${x} ${y})` : undefined}
          points={pts.map((q) => q.join(",")).join(" ")}
          fill={ink}
          fillOpacity={0.1 * p}
          stroke={ink}
          strokeOpacity={0.85 * p}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      );
    }
    if (o.kind === "fan") {
      const z = o.z ?? depth;
      const a = P(...o.from);
      const n = 24;
      const sh = o.shift ? interpolate(frame / fps, [o.shift.atSec, o.shift.atSec + (o.shift.sec ?? 0.5)], [0, o.shift.dx], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) }) : 0;
      const pc = o.coneAtSec !== undefined ? reveal(frame, fps, o.coneAtSec, 0.8) : p;
      const bands = Array.from({ length: n }, (_, j) => {
        const u0 = j / n;
        const u1 = (j + 1) / n;
        const nm = 400 + (300 * (j + 0.5)) / n;
        const xa = o.x0 + sh + (o.x1 - o.x0) * u0;
        const xb = o.x0 + sh + (o.x1 - o.x0) * u1;
        const top = o.y - o.height / 2;
        const bot = o.y + o.height / 2;
        const q = [P(xa, top, z), P(xb, top, z), P(xb, bot, z), P(xa, bot, z)];
        return { nm, q, mid: P((xa + xb) / 2, o.y, z) };
      });
      if (o.ghost) {
        const top = o.y - o.height / 2;
        const bot = o.y + o.height / 2;
        const q = [P(o.x0 + sh, top, z), P(o.x1 + sh, top, z), P(o.x1 + sh, bot, z), P(o.x0 + sh, bot, z)];
        return (
          <g key={i} opacity={p}>
            {bands.map((b, j) => (
              <polygon key={`gf${j}`} points={b.q.map((q2) => q2.join(",")).join(" ")} fill={wavelengthRGB(b.nm)} opacity={0.18} />
            ))}
            <polygon points={q.map((q2) => q2.join(",")).join(" ")} fill="none" stroke={ink} strokeOpacity={0.8} strokeWidth={2} strokeDasharray="10 8" />
            <polyline points={[q[0], a, q[3]].map((q2) => q2.join(",")).join(" ")} fill="none" stroke={ink} strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="6 8" />
          </g>
        );
      }
      return (
        <g key={i}>
          <g opacity={pc}>
          {bands.map((b, j) => (
            <polygon
              key={`f${j}`}
              points={[
                a,
                [(b.q[0][0] + b.q[1][0]) / 2, b.q[0][1]],
                [(b.q[2][0] + b.q[3][0]) / 2, b.q[2][1]],
              ]
                .map((q) => q.join(","))
                .join(" ")}
              fill={wavelengthRGB(b.nm)}
              opacity={0.14}
              style={{ mixBlendMode: "screen" }}
            />
          ))}
          </g>
          <g opacity={p}>
          {o.smooth ? (() => {
            // one patch: a horizontal spectrum gradient, feathered top and bottom, fading ends (Designer, 25 Nov 2026)
            const q0 = bands[0].q[0];
            const q1 = bands[n - 1].q[2];
            const gx = Math.min(q0[0], q1[0]);
            const gy = Math.min(q0[1], q1[1]);
            const gw = Math.abs(q1[0] - q0[0]);
            const gh = Math.abs(q1[1] - q0[1]);
            const id = `pgf${i}`;
            const stops = Array.from({ length: 16 }, (_, k) => k / 15);
            return (
              <>
                <defs>
                  <linearGradient id={`${id}c`} x1="0" x2="1" y1="0" y2="0">
                    {stops.map((u) => {
                      const nm = o.x1 >= o.x0 ? 400 + 300 * u : 700 - 300 * u;
                      const end = Math.min(1, Math.min(u, 1 - u) / 0.08);
                      const op = (u < 0.5 ? 0.55 : 0.7) + (1 - (u < 0.5 ? 0.55 : 0.7)) * end;
                      return <stop key={u} offset={u} stopColor={wavelengthRGB(nm)} stopOpacity={op} />;
                    })}
                  </linearGradient>
                  <linearGradient id={`${id}v`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset={0} stopColor="#fff" stopOpacity={0} />
                    <stop offset={0.15} stopColor="#fff" stopOpacity={1} />
                    <stop offset={0.85} stopColor="#fff" stopOpacity={1} />
                    <stop offset={1} stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                  <mask id={`${id}m`} maskContentUnits="userSpaceOnUse">
                    <rect x={gx} y={gy} width={gw} height={gh} fill={`url(#${id}v)`} />
                  </mask>
                </defs>
                <g mask={`url(#${id}m)`}>
                  <rect x={gx} y={gy} width={gw} height={gh} fill={`url(#${id}c)`} />
                </g>
                <rect x={gx} y={gy} width={gw} height={gh} fill={`url(#${id}c)`} opacity={0.5} filter="url(#pg-glow)" />
              </>
            );
          })() : (<>
          {bands.map((b, j) => (
            <polygon
              key={`w${j}`}
              points={b.q.map((q) => q.join(",")).join(" ")}
              fill={wavelengthRGB(b.nm)}
            />
          ))}
          {bands.map((b, j) => (
            <polygon
              key={`g${j}`}
              points={b.q.map((q) => q.join(",")).join(" ")}
              fill={wavelengthRGB(b.nm)}
              opacity={0.5}
              filter="url(#pg-glow)"
            />
          ))}
                    </>)}
          </g>
        </g>
      );
    }
    if (o.kind === "board") {
      const sc = s(o.at[2]);
      const [x, y] = P(...o.at);
      return (
        <g key={i} opacity={p}>
          {/* contact shadow on the floor, a side face for thickness, the face, one lit edge (Designer, 25 Nov 2026) */}
          {(() => {
            const [fx, fy] = P(o.at[0], floorY, o.at[2]);
            return <ellipse cx={fx} cy={fy} rx={(o.w * sc) * 0.55} ry={10 * sc + 4} fill="#000" opacity={0.35} filter="url(#pg-glow)" />;
          })()}
          <rect x={x - (o.w * sc) / 2 + 8 * sc} y={y - (o.h * sc) / 2 + 8 * sc} width={o.w * sc} height={o.h * sc} rx={3 * sc} fill="#221E1A" opacity={0.95} />
          <rect x={x - (o.w * sc) / 2} y={y - (o.h * sc) / 2} width={o.w * sc} height={o.h * sc} rx={3 * sc} fill="#3A332D" opacity={0.95} stroke={ink} strokeOpacity={0.2} strokeWidth={1.5} />
          {plasterSrc ? (
            <image href={plasterSrc} x={x - (o.w * sc) / 2} y={y - (o.h * sc) / 2} width={o.w * sc} height={o.h * sc} preserveAspectRatio="xMidYMid slice" opacity={0.18} style={{ mixBlendMode: "screen" }} />
          ) : null}
          <polyline points={`${x - (o.w * sc) / 2},${y + (o.h * sc) / 2} ${x - (o.w * sc) / 2},${y - (o.h * sc) / 2} ${x + (o.w * sc) / 2},${y - (o.h * sc) / 2}`} fill="none" stroke={ink} strokeOpacity={0.25} strokeWidth={1.5} />
        </g>
      );
    }
    if (o.kind === "lens") {
      const sc = s(o.at[2]);
      const [x, y] = P(...o.at);
      const w = o.w * sc;
      const h = o.h * sc;
      const rise2 = (1 - p) * 40;
      const d = `M ${x} ${y - h / 2 + rise2} Q ${x + w} ${y + rise2} ${x} ${y + h / 2 + rise2} Q ${x - w} ${y + rise2} ${x} ${y - h / 2 + rise2} Z`;
      return <path key={i} d={d} fill={ink} fillOpacity={0.08 * p} stroke={ink} strokeOpacity={0.85 * p} strokeWidth={2.2} />;
    }
    if (o.kind === "patch") {
      const sc = s(o.at[2]);
      const [x, y] = P(...o.at);
      return (
        <g key={i} opacity={p}>
          <rect
            x={x - (o.w * sc) / 2}
            y={y - (o.h * sc) / 2}
            width={o.w * sc}
            height={o.h * sc}
            rx={6 * sc}
            fill={o.color}
            opacity={0.5}
            filter="url(#pg-glow)"
          />
          <rect
            x={x - (o.w * sc) / 2}
            y={y - (o.h * sc) / 2}
            width={o.w * sc}
            height={o.h * sc}
            rx={6 * sc}
            fill={o.color}
          />
        </g>
      );
    }
    if (o.kind === "ring") {
      const [x, y] = P(...o.at);
      const r = o.r * s(o.at[2]);
      return (
        <g key={i} opacity={p}>
          <circle
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke={ink}
            strokeOpacity={0.9}
            strokeWidth={3}
            strokeDasharray={o.dashed ? "9 7" : undefined}
          />
          <circle
            cx={x}
            cy={y}
            r={r + 14}
            fill="none"
            stroke={ink}
            strokeOpacity={0.25}
            strokeWidth={1.5}
          />
        </g>
      );
    }
    return null;
  };

  return (
    <AbsoluteFill>
      {dark > 0 ? (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${0.62 * dark})` }} />
      ) : null}
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="pg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="pg-fog" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={(1.6 * fog).toFixed(2)} />
          </filter>
        </defs>
        {plaster > 0 && variant === "room" ? (() => {
          const poly = (pts: V3[]) => pts.map((q) => P(...q).map((v) => v.toFixed(1)).join(",")).join(" ");
          const D = depth, n = nearZ, c = -ceilY, f = floorY;
          const planes: V3[][] = [
            [[-hw, c, D], [hw, c, D], [hw, f, D], [-hw, f, D]],
            [[-hw, f, n], [hw, f, n], [hw, f, D], [-hw, f, D]],
            [[-hw, c, n], [-hw, c, D], [-hw, f, D], [-hw, f, n]],
            [[hw, c, n], [hw, c, D], [hw, f, D], [hw, f, n]],
          ];
          return (
            <g opacity={pGrid * plaster * lineK} style={{ mixBlendMode: "screen" }}>
              <clipPath id="pg-plaster">
                {planes.map((q, i) => <polygon key={i} points={poly(q)} />)}
              </clipPath>
              <image href={plasterSrc} x={0} y={0} width={W} height={1080} preserveAspectRatio="xMidYMid slice" clipPath="url(#pg-plaster)" />
            </g>
          );
        })() : null}
        <g opacity={pGrid * lineK}>
          {lines
            .filter((l) => !(fog > 0 && l.far))
            .map((l) => (
              <line
                key={l.k}
                x1={l.a[0]}
                y1={l.a[1]}
                x2={l.b[0]}
                y2={l.b[1]}
                stroke={ink}
                strokeOpacity={l.o}
                strokeWidth={1.3}
              />
            ))}
          {fog > 0 ? (
            <g filter="url(#pg-fog)">
              {lines
                .filter((l) => l.far)
                .map((l) => (
                  <line
                    key={l.k}
                    x1={l.a[0]}
                    y1={l.a[1]}
                    x2={l.b[0]}
                    y2={l.b[1]}
                    stroke={ink}
                    strokeOpacity={l.o}
                    strokeWidth={1.3}
                  />
                ))}
            </g>
          ) : null}
        </g>
        {objects.map((o, i) => {
          const k = life(o);
          return k <= 0.001 ? null : <g key={i} opacity={k}>{fogged(o, drawObject(o, i), i)}</g>;
        })}
      </svg>
      {fog > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 55% 42% at ${cx}px ${cy}px, ${ink} 0%, transparent 72%)`,
            opacity: 0.1 * fog * pGrid,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {/* Pages: CSS 3D with the same focal length and vanishing point as the grid. */}
      <AbsoluteFill
        style={{
          perspective: `${focal}px`,
          perspectiveOrigin: `${cx}px ${cy}px`,
          transformStyle: "preserve-3d",
        }}
      >
        {objects.map((o, i) =>
          o.kind === "page" ? (
            <GridPage
              key={i}
              o={o}
              cx={cx}
              cy={cy}
              floorY={floorY}
              push={push}
              p={appear(o)}
            />
          ) : null,
        )}
      </AbsoluteFill>
      {objects.map((o, i) => {
        if (o.kind !== "label") return null;
        const [x, y] = P(...o.at);
        const p = appear(o) * life(o);
        if (p <= 0.001) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.min(W - 280, Math.max(280, x)),
              top: y + (o.dy ?? -56),
              transform: `translateX(-50%) ${rise(p, 14).transform}`,
              opacity: p,
              fontFamily: t.fonts.mono,
              fontSize: 22,
              letterSpacing: "0.08em",
              color: t.colors.ink,
              background: t.colors.chip,
              padding: "6px 12px",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            {o.text}
          </div>
        );
      })}
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 160,
            right: 160,
            bottom: 70,
            textAlign: "center",
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontSize: 40,
            color: t.colors.secondary,
            ...rise(reveal(frame, fps, startSec + 1, t.motion.enterSec), 16),
          }}
        >
          {caption}
        </div>
      ) : null}
      {title ? (() => {
        const tt = frame / fps;
        const pin = reveal(frame, fps, title.atSec ?? 0.2, 0.7);
        const pout = title.untilSec === undefined ? 1 : interpolate(tt, [title.untilSec, title.untilSec + 0.45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const wipe = Math.min(pin, pout);
        if (wipe <= 0.001) return null;
        return (
          <div style={{ position: "absolute", left: title.x ?? 620, top: (title.y ?? 560) - 76, fontFamily: t.fonts.serif, fontSize: 76, fontWeight: 600, color: t.colors.ink, whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`, ...rise(pin, 18) }}>
            {title.text}
          </div>
        );
      })() : null}
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};

const GridPage: React.FC<{
  o: Extract<GridObject, { kind: "page" }>;
  cx: number;
  cy: number;
  floorY: number;
  push: number;
  p: number;
}> = ({ o, cx, cy, floorY, push, p }) => {
  const src = useSource(o.srcId);
  const h = o.width / o.aspect;
  const onFloor = (o.plane ?? "floor") === "floor";
  // The page's centre sits at (x, floorY, z). On the floor it lies flat, top edge away from the viewer.
  const tz = -(o.z - push);
  const transform = onFloor
    ? `translate3d(${o.x - o.width / 2}px, ${floorY - h / 2}px, ${tz}px) rotateX(90deg) translateY(${(1 - p) * 30}px)`
    : `translate3d(${o.x - o.width / 2}px, ${-h / 2}px, ${tz}px)`;
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: o.width,
        height: h,
        transform,
        transformOrigin: "50% 50%",
        opacity: p,
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        backfaceVisibility: "visible",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};
