import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { reveal, sec, SLOW_OUT } from "../motion";

// MAP-012 TravellingMap (Johnny Harris 'Coups, Mapped' and 'Sudan, Mapped'; byl's tilted map; Mapal; analysis only;
// Sam, 23 Nov 2026: "Build the necessary cinematic pieces"). One registered map is the act's world and the camera
// travels over it: it flies between places (centre, zoom), may tilt the map back in 3D (rotateX up to 40 degrees)
// and turn it a little, never cutting. Pins and labels stand up off the tilted map (billboards); routes draw on in
// a rough hand line and can end in an X that marks the spot; the camera never stops (a slow drift between moves).
// Best use: a story that moves between named places (Eaglesfield -> Kendal -> Manchester). Limit: max 2 per act;
// moves 1.2-2 s, eased, only between spoken places; registered maps only, captioned with their date; place names
// are the narration's or the map's own.
type XY = readonly [number, number];
export type MapCam = { atSec: number; center: XY; zoom: number; tilt?: number; turn?: number; sec?: number };
export type MapPin = { at: XY; label: string; atSec: number; untilSec?: number; sub?: string; accent?: boolean };
export type MapRoute = { points: XY[]; atSec: number; sec?: number; mark?: boolean; dashed?: boolean };
export type TravellingMapProps = {
  srcId: string;
  file?: string;
  size: readonly [number, number];
  cams: MapCam[];
  pins?: MapPin[];
  routes?: MapRoute[];
  caption: string;
  dark?: boolean; // the lit-map grade (MAP-011's look) instead of the warm paper grade
  startSec?: number;
};

const inOut = Easing.bezier(0.45, 0, 0.15, 1);

export const TravellingMap: React.FC<TravellingMapProps> = ({ srcId, file, size, cams, pins = [], routes = [], caption, dark, startSec = 0 }) => {
  useAssets(["MAP-012", "MOT-001", ...(routes.length ? ["MOT-005"] : [])]);
  if (cams.some((c) => (c.tilt ?? 0) > 40)) throw new Error("TravellingMap: tilt above 40 degrees.");
  const t = useTheme();
  const src = useSourceFile(srcId, file);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // camera: eased from one framing to the next; a slow 2% creep between moves so it never stops
  let c = { x: cams[0].center[0], y: cams[0].center[1], z: cams[0].zoom, tilt: cams[0].tilt ?? 0, turn: cams[0].turn ?? 0 };
  for (const k of cams.slice(1)) {
    const d = k.sec ?? 1.6;
    if (d < 1.2 || d > 2) throw new Error("TravellingMap: camera moves take 1.2-2 s.");
    const p = inOut(interpolate(frame, [sec(k.atSec, fps), sec(k.atSec + d, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    c = { x: c.x + (k.center[0] - c.x) * p, y: c.y + (k.center[1] - c.y) * p, z: c.z * Math.pow(k.zoom / c.z, p), tilt: c.tilt + ((k.tilt ?? 0) - c.tilt) * p, turn: c.turn + ((k.turn ?? 0) - c.turn) * p };
  }
  const creep = 1 + 0.02 * (frame / Math.max(1, durationInFrames - 1));
  const z = c.z * creep;
  const pIn = reveal(frame, fps, startSec, 0.8);
  const grade = dark ? "grayscale(0.85) sepia(0.25) contrast(1.1) brightness(0.5)" : "sepia(0.35) saturate(0.7) contrast(1.05) brightness(0.98)";
  return (
    <AbsoluteFill style={{ opacity: pIn, background: t.colors.canvas, perspective: 1700, perspectiveOrigin: "50% 40%", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          width: size[0],
          height: size[1],
          transformOrigin: "0 0",
          transformStyle: "preserve-3d",
          transform: `rotateX(${c.tilt}deg) rotateZ(${c.turn}deg) scale(${z}) translate(${-c.x}px, ${-c.y}px)`,
        }}
      >
        <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: size[0], height: size[1], maxWidth: "none", filter: grade }} />
        <svg width={size[0]} height={size[1]} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {routes.map((r, i) => {
            const p = interpolate(frame, [sec(r.atSec, fps), sec(r.atSec + (r.sec ?? 1.4), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
            if (p <= 0) return null;
            const d = r.points.map((q, k) => `${k ? "L" : "M"} ${q[0]} ${q[1]}`).join(" ");
            const w = 7 / z;
            const end = r.points[r.points.length - 1];
            const xp = interpolate(frame, [sec(r.atSec + (r.sec ?? 1.4), fps), sec(r.atSec + (r.sec ?? 1.4) + 0.4, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const s = 22 / z;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={t.colors.cones.L} strokeOpacity={0.85} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={r.dashed ? undefined : 1} strokeDashoffset={r.dashed ? undefined : 1 - p} style={{ mixBlendMode: "multiply" }} />
                {r.mark && xp > 0 ? (
                  <g stroke={t.colors.cones.L} strokeWidth={w * 1.2} strokeLinecap="round" opacity={0.9}>
                    <line x1={end[0] - s} y1={end[1] - s} x2={end[0] - s + 2 * s * Math.min(1, xp * 2)} y2={end[1] - s + 2 * s * Math.min(1, xp * 2)} />
                    {xp > 0.5 ? <line x1={end[0] + s} y1={end[1] - s} x2={end[0] + s - 2 * s * (xp - 0.5) * 2} y2={end[1] - s + 2 * s * (xp - 0.5) * 2} /> : null}
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
        {pins.map((pin) => {
          const a = reveal(frame, fps, pin.atSec, 0.7);
          const out = pin.untilSec !== undefined ? 1 - reveal(frame, fps, pin.untilSec, 0.6) : 1;
          if (a * out <= 0) return null;
          return (
            <div key={pin.label + pin.atSec} style={{ position: "absolute", left: pin.at[0], top: pin.at[1], transformOrigin: "0 0", transformStyle: "preserve-3d", transform: `scale(${1 / z}) rotateX(${-c.tilt}deg)` }}>
              <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: pin.accent ? t.colors.accent : t.colors.ink, border: `3px solid ${t.colors.canvas}`, opacity: a * out }} />
              <div style={{ position: "absolute", left: 0, bottom: 22, transform: `translate(-50%, ${(1 - a) * 12}px)`, opacity: a * out, whiteSpace: "nowrap", textAlign: "center" }}>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 30, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "8px 14px", borderRadius: 4 }}>{pin.label}</div>
                {pin.sub ? <div style={{ marginTop: 6, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.secondary }}>{pin.sub}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) ${dark ? 30 : 55}%, ${t.colors.dimMask} 100%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{caption}</div>
    </AbsoluteFill>
  );
};
