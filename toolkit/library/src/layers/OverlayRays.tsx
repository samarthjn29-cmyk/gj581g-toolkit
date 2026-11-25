import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { particles, type RaySpec } from "./RayParticles";

// VIS-021 RayParticles along a polyline in frame px, over any component (WCL-E01 act 5, Director's Builder 5). Several
// streams may run in one shot; `kinds` draws a stream as several kinds of ray, each its own size, speed and count (the
// rays drawn without colour: 'many kinds' by size and speed, never by hue). 40 dots on screen at most across a shot.
export type OverlayRaySpec = {
  path: [number, number][];
  atSec: number;
  untilSec?: number;
  color?: string;
  stroke?: string; // an ink edge so white dots read on cream paper
  strokeWidth?: number; // default 1.5
  glow?: number; // a soft halo (0..1) so dots read on a dark ground (Designer M1)
  jitter?: number;
  kinds: { size: number; speed: number; count: number }[];
  seed?: number;
};

const along = (path: [number, number][], u: number) => {
  const segs = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const L = segs.reduce((a, b) => a + b, 0);
  let d = u * L;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const f = segs[i] ? Math.min(1, d / segs[i]) : 0;
      const a = path[i];
      const b = path[i + 1];
      const nx = -(b[1] - a[1]) / (segs[i] || 1);
      const ny = (b[0] - a[0]) / (segs[i] || 1);
      return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, nx, ny };
    }
    d -= segs[i];
  }
  return { x: path[0][0], y: path[0][1], nx: 0, ny: 1 };
};

export const OverlayRays: React.FC<{ rays: OverlayRaySpec[] }> = ({ rays }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = rays.reduce((n, r) => n + r.kinds.reduce((a, k) => a + k.count, 0), 0);
  if (total > 40) throw new Error("OverlayRays: at most 40 dots on screen in a shot (calm limit)");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <defs>
        <filter id="rayglow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {rays.map((r, ri) => {
        const L = r.path.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - r.path[i][0], p[1] - r.path[i][1]), 0);
        return r.kinds.map((k, ki) => {
          const spec: RaySpec = { count: k.count, speed: k.speed, atSec: r.atSec + ki * 0.11, untilSec: r.untilSec, jitter: r.jitter ?? 0, seed: (r.seed ?? 1) + ri * 7 + ki * 3 };
          return particles(spec, L, frame / fps).map((q) => {
            const p = along(r.path, q.u);
            return (
              <circle key={`${ri}-${ki}-${q.k}`} cx={p.x + p.nx * q.side} cy={p.y + p.ny * q.side} r={k.size / 2} fill={r.color ?? "#FFF6DD"} opacity={q.alpha} stroke={r.stroke} strokeWidth={r.stroke ? r.strokeWidth ?? 1.5 : 0} filter={r.glow ? "url(#rayglow)" : undefined} />
            );
          });
        });
      })}
    </svg>
  );
};
