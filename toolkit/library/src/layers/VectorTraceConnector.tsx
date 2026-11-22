import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";
import { BoilDefs } from "./LineBoil";

// MOT-005 VectorTraceConnector: a line that draws itself from one thing to another (a route between two places,
// a thread between two names), with a small head dot leading it and a ring settling on the end. A gentle bend
// keeps it hand-drawn rather than mechanical; optional MOT-009 boil. Calm: one trace at a time, 0.8-1.6 s,
// slow-out. Positions are frame pixels. Colours come from the theme (accent by default, or ink / secondary).
export type TraceSpec = {
  from: [number, number];
  to: [number, number];
  atSec: number;
  drawSec?: number;
  bend?: number; // -0.4..0.4: sideways bow as a share of the distance
  tone?: "accent" | "ink" | "secondary";
  width?: number;
  dashed?: boolean; // a route on a map
  endRing?: boolean;
  boil?: number; // px, 0 = off
  untilSec?: number; // fades out here
};

const quad = (
  a: [number, number],
  c: [number, number],
  b: [number, number],
  t: number,
): [number, number] => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];

export const VectorTraceConnector: React.FC<{
  spec: TraceSpec;
  id?: string;
}> = ({ spec, id = "trace" }) => {
  useAssets(["MOT-005", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawSec = spec.drawSec ?? 1.1;
  if (drawSec < 0.8 || drawSec > 1.6)
    throw new Error(`trace ${drawSec}s is outside the calm range 0.8-1.6 s.`);
  const color = t.colors[spec.tone ?? "accent"];
  const width = spec.width ?? 4;
  const [ax, ay] = spec.from;
  const [bx, by] = spec.to;
  const dx = bx - ax,
    dy = by - ay;
  const bend = Math.max(-0.4, Math.min(0.4, spec.bend ?? 0.18));
  const c: [number, number] = [
    (ax + bx) / 2 - dy * bend,
    (ay + by) / 2 + dx * bend,
  ];
  const N = 96;
  const pts = Array.from({ length: N + 1 }, (_, i) =>
    quad(spec.from, c, spec.to, i / N),
  );
  const cum = [0];
  for (let i = 1; i <= N; i++)
    cum.push(
      cum[i - 1] +
        Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]),
    );
  const L = cum[N];
  const a = sec(spec.atSec, fps);
  const p = interpolate(frame, [a, a + sec(drawSec, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  const out =
    spec.untilSec !== undefined
      ? interpolate(
          frame,
          [sec(spec.untilSec, fps), sec(spec.untilSec, fps) + 12],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 1;
  if (frame < a || out <= 0) return null;
  const len = p * L;
  let k = 1;
  while (k < N && cum[k] < len) k++;
  const f =
    cum[k] === cum[k - 1] ? 0 : (len - cum[k - 1]) / (cum[k] - cum[k - 1]);
  const head: [number, number] = [
    pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * f,
    pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * f,
  ];
  const drawn = [...pts.slice(0, k), head];
  const d = drawn
    .map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`)
    .join(" ");
  const ring =
    spec.endRing === false
      ? 0
      : interpolate(p, [0.85, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const boil = spec.boil ?? 0;
  const fid = `${id}-boil`;
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, opacity: out }}
    >
      {boil > 0 ? (
        <defs>
          <BoilDefs id={fid} amp={boil} />
        </defs>
      ) : null}
      <g filter={boil > 0 ? `url(#${fid})` : undefined}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={
            spec.dashed ? `${width * 3} ${width * 2.4}` : undefined
          }
        />
        {p < 1 ? (
          <circle cx={head[0]} cy={head[1]} r={width * 1.6} fill={color} />
        ) : null}
        {ring > 0 ? (
          <circle
            cx={bx}
            cy={by}
            r={8 + 16 * ring}
            fill="none"
            stroke={color}
            strokeWidth={width * 0.75}
            opacity={0.35 + 0.65 * ring}
          />
        ) : null}
        {ring > 0 ? (
          <circle cx={bx} cy={by} r={width * 1.8} fill={color} />
        ) : null}
      </g>
    </svg>
  );
};
