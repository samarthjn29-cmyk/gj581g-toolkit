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
import { useAssets, useSource } from "../registry";
import { particles, type RaySpec } from "../layers/RayParticles";
import { reveal, rise } from "../motion";
import { wavelengthRGB } from "../layers/spectrum";

// VIS-015 PerspectiveGrid: a room or a floor drawn as a one-point perspective grid in the theme's ink,
// with objects placed in the same space (a beam, a prism, a spectrum fan on the back wall, a page lying on
// the floor, coloured patches, a lens ring, labels). One slow dolly per shot, inside the calm limit.
//
// World units are px. x right, y down, z = depth into the screen (0 = the screen plane, D = the back wall).
// A point at depth z is drawn at scale F / (F + z) around the vanishing point; CSS 3D objects (pages) use
// the same perspective, so lines and pages line up.

type V3 = [number, number, number];
export type GridObject =
  | {
      kind: "beam";
      from: V3;
      to: V3;
      width?: number;
      color?: string;
      atSec?: number;
      drawSec?: number;
    }
  | { kind: "prism"; at: V3; size?: number; atSec?: number }
  | {
      kind: "fan";
      from: V3;
      x0: number;
      x1: number;
      y: number;
      height: number;
      z?: number;
      atSec?: number;
    }
  | { kind: "hole"; at: V3; r?: number; atSec?: number }
  | {
      kind: "patch";
      at: V3;
      w: number;
      h: number;
      color: string;
      atSec?: number;
    }
  | { kind: "ring"; at: V3; r: number; atSec?: number }
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
  | ({ kind: "rays"; from: V3; to: V3; color?: string; trail?: number } & RaySpec); // trail: faint path line opacity (0-0.35)

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
  lineOpacity?: number;
  nearZ?: number; // how far the floor and walls run in front of the screen plane (negative = towards the viewer)
  dark?: number; // 0..1 darkens the canvas (Newton's dark room)
  fog?: number; // 0..0.6 LOK-014 DepthFog: far lines and objects fade and soften, a haze sits at the back, beams scatter
  objects?: GridObject[];
  caption?: string;
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
  lineOpacity = 0.26,
  nearZ = -420,
  dark = 0,
  fog = 0,
  objects = [],
  caption,
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
    [0, focal * (1 - 1 / (1 + dolly))],
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
          {dots.map((d) => (
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
      const pts = [
        [x, y - k * 0.62],
        [x - k * 0.55, y + k * 0.38],
        [x + k * 0.55, y + k * 0.38],
      ];
      return (
        <polygon
          key={i}
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
      const bands = Array.from({ length: n }, (_, j) => {
        const u0 = j / n;
        const u1 = (j + 1) / n;
        const nm = 400 + (300 * (j + 0.5)) / n;
        const xa = o.x0 + (o.x1 - o.x0) * u0;
        const xb = o.x0 + (o.x1 - o.x0) * u1;
        const top = o.y - o.height / 2;
        const bot = o.y + o.height / 2;
        const q = [P(xa, top, z), P(xb, top, z), P(xb, bot, z), P(xa, bot, z)];
        return { nm, q, mid: P((xa + xb) / 2, o.y, z) };
      });
      return (
        <g key={i} opacity={p}>
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
        </g>
      );
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
        <g opacity={pGrid}>
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
        {objects.map((o, i) => fogged(o, drawObject(o, i), i))}
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
        const p = appear(o);
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
