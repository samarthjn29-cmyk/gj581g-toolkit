import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { reveal, sec, SLOW_OUT } from "../motion";
import { Label, type LabelSpec } from "../layers/Label";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// MAP-012 TravellingMap (Johnny Harris 'Coups, Mapped' and 'Sudan, Mapped'; byl's tilted map; Mapal; analysis only;
// Sam, 23 Nov 2026: "Build the necessary cinematic pieces"). One registered map is the act's world and the camera
// travels over it: it flies between places (centre, zoom), may tilt the map back in 3D (rotateX up to 40 degrees)
// and turn it a little, never cutting. Pins and labels stand up off the tilted map (billboards); routes draw on in
// a rough hand line and can end in an X that marks the spot; the camera never stops (a slow drift between moves).
// Best use: a story that moves between named places (Eaglesfield -> Kendal -> Manchester). Limit: max 2 per act;
// moves 1.2-2 s, eased, only between spoken places; registered maps only, captioned with their date; place names
// are the narration's or the map's own.
//
// v2 (Sam, 23 Nov 2026: "learn from the presenter and build better cinematics"; styles/MAPS_AND_CINEMATICS_STUDY):
// - lag: the turn and tilt run a little behind the position (Johnny Harris keys the bearing late), so a move orbits.
// - holdTilt: the camera keeps tilting down slowly through the shot (degrees over the whole shot, <= 4).
// - routes carry a drop shadow, lifted off the paper (Ignace Aleya); `shadow: false` turns it off.
// - pins with `drop` land (MOT-012 PinDrop): a 16 px fall, a tightening shadow and one echo ring. No overshoot.
// - pins with `flat` lay their label on the map (it scales with the map, like his EGYPT), not standing up.
// - dof (LOK-032 MapDepthOfField): only a band round the focus stays sharp on a tilted map; blur grows with tilt.
// - regions (MAP-014 MapRegion): a polygon tint that wipes or grows on, may glow at its edge, fade, or move its
//   front to a new shape along a ragged edge.
// - sheet (MAP-015 MapOverlaySheet): a registered period map laid over the base map at its place, lifted, shadowed.
type XY = readonly [number, number];
export type MapCam = { atSec: number; center: XY; zoom: number; tilt?: number; turn?: number; sec?: number };
export type MapPin = { at: XY; label?: string; atSec: number; untilSec?: number; sub?: string; accent?: boolean; drop?: boolean; flat?: boolean; flatSize?: number };
export type MapRoute = { points: XY[]; atSec: number; sec?: number; mark?: boolean; dashed?: boolean; shadow?: boolean };
export type MapRegion = {
  points: XY[]; // map px, closed
  atSec: number;
  sec?: number; // 0.6-1.6 s
  mode?: "wipe" | "grow"; // wipe: left to right; grow: a feathered circle from `from` (default: the centroid)
  from?: XY;
  color?: "accent" | "L" | "M" | "S";
  edge?: boolean; // a lit border (Johnny Harris)
  ragged?: boolean; // a turbulent, hand-torn edge (fronts)
  untilSec?: number; // fades out from here (0.6 s)
  front?: { points: XY[]; atSec: number; sec?: number }; // move to this shape (same number of points), 1-3 s
};
export type MapSheet = { srcId: string; file?: string; at: readonly [number, number, number, number]; atSec: number; untilSec?: number; opacity?: number; lift?: number; label?: string };
export type TravellingMapProps = {
  srcId: string;
  file?: string;
  size: readonly [number, number];
  cams: MapCam[];
  pins?: MapPin[];
  routes?: MapRoute[];
  regions?: MapRegion[];
  sheet?: MapSheet;
  caption: string;
  labels?: LabelSpec[]; // screen-space lines (the layers/Label chip), as on PeriodMapPlate
  tag?: DatelineTagProps; // the corner place tag, as on PeriodMapPlate
  dark?: boolean; // the lit-map grade (MAP-011's look) instead of the warm paper grade
  lag?: number; // s, turn and tilt behind the position (0-0.4; default 0.25)
  holdTilt?: number; // degrees over the whole shot (0-4; default 0)
  dof?: { focusY?: number; band?: number; maxBlur?: number } | false;
  startSec?: number;
};

const inOut = Easing.bezier(0.45, 0, 0.15, 1);
const fall = Easing.bezier(0.55, 0, 0.8, 0.35);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerpPts = (a: XY[], b: XY[], p: number) => a.map((q, i) => [q[0] + (b[i][0] - q[0]) * p, q[1] + (b[i][1] - q[1]) * p] as const);
const pathOf = (pts: readonly XY[], close = false) => pts.map((q, k) => `${k ? "L" : "M"} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" ") + (close ? " Z" : "");

export const TravellingMap: React.FC<TravellingMapProps> = ({ srcId, file, size, cams, pins = [], routes = [], regions = [], sheet, caption, labels = [], tag, dark, lag = 0.25, holdTilt = 0, dof, startSec = 0 }) => {
  const usesDrop = pins.some((p) => p.drop);
  useAssets([
    "MAP-012",
    "MOT-001",
    ...(routes.length ? ["MOT-005"] : []),
    ...(usesDrop ? ["MOT-012"] : []),
    ...(dof ? ["LOK-032"] : []),
    ...(regions.length ? ["MAP-014"] : []),
    ...(sheet ? ["MAP-015", sheet.srcId] : []),
  ]);
  if (cams.some((c) => (c.tilt ?? 0) > 40)) throw new Error("TravellingMap: tilt above 40 degrees.");
  if (lag < 0 || lag > 0.4) throw new Error("TravellingMap: lag 0-0.4 s.");
  if (holdTilt < 0 || holdTilt > 4) throw new Error("TravellingMap: holdTilt 0-4 degrees.");
  regions.forEach((r) => {
    if ((r.sec ?? 1) < 0.6 || (r.sec ?? 1) > 1.6) throw new Error("TravellingMap: a region draws on in 0.6-1.6 s.");
    if (r.front && (r.front.points.length !== r.points.length || (r.front.sec ?? 2) < 1 || (r.front.sec ?? 2) > 3)) throw new Error("TravellingMap: a front moves to the same number of points in 1-3 s.");
  });
  if (regions.length > 3) throw new Error("TravellingMap: max 3 regions.");
  const t = useTheme();
  const src = useSourceFile(srcId, file);
  const sheetSrc = useSourceFile(sheet?.srcId ?? srcId, sheet?.file ?? (sheet ? undefined : file));
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // camera: position eased from one framing to the next; turn and tilt follow `lag` s behind (an orbit)
  let c = { x: cams[0].center[0], y: cams[0].center[1], z: cams[0].zoom, tilt: cams[0].tilt ?? 0, turn: cams[0].turn ?? 0 };
  for (const k of cams.slice(1)) {
    const d = k.sec ?? 1.6;
    if (d < 1.2 || d > 2) throw new Error("TravellingMap: camera moves take 1.2-2 s.");
    const p = inOut(interpolate(frame, [sec(k.atSec, fps), sec(k.atSec + d, fps)], [0, 1], clamp));
    const pl = inOut(interpolate(frame, [sec(k.atSec + lag, fps), sec(k.atSec + lag + d, fps)], [0, 1], clamp));
    c = { x: c.x + (k.center[0] - c.x) * p, y: c.y + (k.center[1] - c.y) * p, z: c.z * Math.pow(k.zoom / c.z, p), tilt: c.tilt + ((k.tilt ?? 0) - c.tilt) * pl, turn: c.turn + ((k.turn ?? 0) - c.turn) * pl };
  }
  const prog = frame / Math.max(1, durationInFrames - 1);
  const creep = 1 + 0.02 * prog;
  const z = c.z * creep;
  const tilt = Math.min(40, c.tilt + holdTilt * Easing.inOut(Easing.sin)(prog));
  const pIn = reveal(frame, fps, startSec, 0.8);
  const grade = dark ? "grayscale(0.85) sepia(0.25) contrast(1.1) brightness(0.5)" : "sepia(0.35) saturate(0.7) contrast(1.05) brightness(0.98)";
  const planeStyle: React.CSSProperties = {
    position: "absolute",
    left: 960,
    top: 540,
    width: size[0],
    height: size[1],
    transformOrigin: "0 0",
    transformStyle: "preserve-3d",
    transform: `rotateX(${tilt}deg) rotateZ(${c.turn}deg) scale(${z}) translate(${-c.x}px, ${-c.y}px)`,
  };
  const persp: React.CSSProperties = { perspective: 1700, perspectiveOrigin: "50% 40%", overflow: "hidden" };
  const tint = (k?: MapRegion["color"]) => (k === "L" || k === "M" || k === "S" ? t.colors.cones[k] : t.colors.accent);

  // the map's surface: image, sheet, regions and routes (drawn twice under depth of field: soft and sharp)
  const surface = (key: string) => (
    <div key={key} style={planeStyle}>
      <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: size[0], height: size[1], maxWidth: "none", filter: grade }} />
      {sheet
        ? (() => {
            const a = reveal(frame, fps, sheet.atSec, 0.9);
            const out = sheet.untilSec !== undefined ? 1 - reveal(frame, fps, sheet.untilSec, 0.8) : 1;
            const lift = (sheet.lift ?? 40) * (0.4 + 0.6 * a) + (1 - out) * 60;
            if (a * out <= 0) return null;
            return (
              <div style={{ position: "absolute", left: sheet.at[0], top: sheet.at[1], width: sheet.at[2], height: sheet.at[3], transform: `translateZ(${lift}px)`, opacity: a * out * (sheet.opacity ?? 0.85), boxShadow: `0 ${18 / z}px ${46 / z}px rgba(0,0,0,0.45)` }}>
                <Img src={sheetSrc} style={{ width: "100%", height: "100%", maxWidth: "none", objectFit: "fill", filter: "sepia(0.25) contrast(1.05)" }} />
              </div>
            );
          })()
        : null}
      <svg width={size[0]} height={size[1]} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <filter id={`rag-${key}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency={0.012} numOctaves={3} seed={7} />
            <feDisplacementMap in="SourceGraphic" scale={14 / z} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={`glow-${key}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={6 / z} />
          </filter>
        </defs>
        {regions.map((r, i) => {
          const d = r.sec ?? 1;
          const p = interpolate(frame, [sec(r.atSec, fps), sec(r.atSec + d, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
          if (p <= 0) return null;
          const out = r.untilSec !== undefined ? 1 - reveal(frame, fps, r.untilSec, 0.6) : 1;
          const fp = r.front ? inOut(interpolate(frame, [sec(r.front.atSec, fps), sec(r.front.atSec + (r.front.sec ?? 2), fps)], [0, 1], clamp)) : 0;
          const pts = r.front ? lerpPts(r.points, r.front.points, fp) : r.points;
          const xs = pts.map((q) => q[0]);
          const ys = pts.map((q) => q[1]);
          const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
          const o = r.from ?? ([xs.reduce((a, b) => a + b, 0) / xs.length, ys.reduce((a, b) => a + b, 0) / ys.length] as const);
          const R = Math.hypot(Math.max(o[0] - x0, x1 - o[0]), Math.max(o[1] - y0, y1 - o[1])) * 1.15;
          const col = tint(r.color);
          const dd = pathOf(pts, true);
          const clip = `clip-${key}-${i}`;
          return (
            <g key={i} opacity={out}>
              <defs>
                {r.mode === "grow" ? (
                  <mask id={clip}>
                    <radialGradient id={`${clip}-g`} cx={o[0]} cy={o[1]} r={Math.max(1, R * p)} gradientUnits="userSpaceOnUse">
                      <stop offset="0.82" stopColor="white" />
                      <stop offset="1" stopColor="black" />
                    </radialGradient>
                    <rect x={x0 - 50} y={y0 - 50} width={x1 - x0 + 100} height={y1 - y0 + 100} fill={`url(#${clip}-g)`} />
                  </mask>
                ) : (
                  <clipPath id={clip}>
                    <rect x={x0 - 50} y={y0 - 50} width={(x1 - x0 + 100) * p} height={y1 - y0 + 100} />
                  </clipPath>
                )}
              </defs>
              <g {...(r.mode === "grow" ? { mask: `url(#${clip})` } : { clipPath: `url(#${clip})` })} filter={r.ragged ? `url(#rag-${key})` : undefined}>
                <path d={dd} fill={col} fillOpacity={dark ? 0.34 : 0.28} style={{ mixBlendMode: dark ? "screen" : "multiply" }} />
                {r.edge ? (
                  <>
                    <path d={dd} fill="none" stroke={col} strokeOpacity={0.55} strokeWidth={10 / z} filter={`url(#glow-${key})`} />
                    <path d={dd} fill="none" stroke={col} strokeOpacity={0.9} strokeWidth={2.4 / z} strokeLinejoin="round" />
                  </>
                ) : null}
              </g>
            </g>
          );
        })}
        {routes.map((r, i) => {
          const p = interpolate(frame, [sec(r.atSec, fps), sec(r.atSec + (r.sec ?? 1.4), fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
          if (p <= 0) return null;
          const d = pathOf(r.points);
          const w = 7 / z;
          const end = r.points[r.points.length - 1];
          const xp = interpolate(frame, [sec(r.atSec + (r.sec ?? 1.4), fps), sec(r.atSec + (r.sec ?? 1.4) + 0.4, fps)], [0, 1], clamp);
          const s = 22 / z;
          const dash = r.dashed ? { strokeDasharray: `${0.012} ${0.012}` } : {};
          const draw = { pathLength: 1, strokeDasharray: r.dashed ? undefined : 1, strokeDashoffset: r.dashed ? undefined : 1 - p };
          return (
            <g key={i}>
              {r.shadow !== false ? <path d={d} fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth={w * 1.3} strokeLinecap="round" strokeLinejoin="round" transform={`translate(${5 / z} ${9 / z})`} filter={`url(#glow-${key})`} {...draw} {...dash} /> : null}
              <path d={d} fill="none" stroke={t.colors.cones.L} strokeOpacity={0.88} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" {...draw} {...dash} style={{ mixBlendMode: r.shadow === false ? "multiply" : undefined }} />
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
      {pins
        .filter((pin) => pin.flat)
        .map((pin) => {
          const a = reveal(frame, fps, pin.atSec, 0.8);
          const out = pin.untilSec !== undefined ? 1 - reveal(frame, fps, pin.untilSec, 0.6) : 1;
          if (a * out <= 0) return null;
          const fs = pin.flatSize ?? 40 / cams[0].zoom;
          return (
            <div key={`flat-${pin.label ?? ''}-${pin.atSec}`} style={{ position: "absolute", left: pin.at[0], top: pin.at[1], transform: `translate(-50%, -50%) translateY(${(1 - a) * fs * 0.3}px)`, opacity: a * out * 0.82, whiteSpace: "nowrap", fontFamily: t.fonts.mono, fontSize: fs, letterSpacing: fs * 0.32, color: dark ? t.colors.ink : t.paper?.ink ?? t.colors.secondary, textShadow: dark ? `0 0 ${fs * 0.3}px rgba(0,0,0,0.6)` : undefined }}>
              {pin.label}
            </div>
          );
        })}
    </div>
  );

  // the standing pins (billboards), never blurred
  const standing = (
    <div style={planeStyle}>
      {pins
        .filter((pin) => !pin.flat)
        .map((pin) => {
          const out = pin.untilSec !== undefined ? 1 - reveal(frame, fps, pin.untilSec, 0.6) : 1;
          // PinDrop: a 0.6 s accelerating fall onto the map, then the label rises in; no overshoot
          const fp = pin.drop ? fall(interpolate(frame, [sec(pin.atSec, fps), sec(pin.atSec + 0.6, fps)], [0, 1], clamp)) : 1;
          const a = pin.drop ? reveal(frame, fps, pin.atSec + 0.45, 0.7) : reveal(frame, fps, pin.atSec, 0.7);
          const shown = pin.drop ? (frame >= sec(pin.atSec, fps) ? 1 : 0) : a;
          if (shown * out <= 0) return null;
          const ring = pin.drop ? interpolate(frame, [sec(pin.atSec + 0.6, fps), sec(pin.atSec + 1.5, fps)], [0, 1], clamp) : 0;
          const ringE = Easing.out(Easing.cubic)(ring);
          return (
            <div key={`${pin.label ?? 'pin'}-${pin.at[0]}-${pin.atSec}`} style={{ position: "absolute", left: pin.at[0], top: pin.at[1], transformOrigin: "0 0", transformStyle: "preserve-3d", transform: `scale(${1 / z}) rotateX(${-tilt}deg)` }}>
              {pin.drop ? (
                <>
                  <div style={{ position: "absolute", left: -12 * (0.5 + 0.5 * fp), top: -4 * (0.5 + 0.5 * fp), width: 24 * (0.5 + 0.5 * fp), height: 8 * (0.5 + 0.5 * fp), borderRadius: "50%", background: "rgba(0,0,0,0.45)", filter: `blur(${(1 - fp) * 4 + 1}px)`, opacity: out * (0.3 + 0.7 * fp) }} />
                  {ring > 0 && ring < 1 ? <div style={{ position: "absolute", left: -(9 + 40 * ringE), top: -(9 + 40 * ringE), width: 2 * (9 + 40 * ringE), height: 2 * (9 + 40 * ringE), borderRadius: "50%", border: `${3 - 2.4 * ringE}px solid ${pin.accent ? t.colors.accent : t.colors.ink}`, opacity: (1 - ring) * 0.85 * out }} /> : null}
                </>
              ) : null}
              <div style={{ position: "absolute", left: -9, top: -9 - (1 - fp) * 16, width: 18, height: 18, borderRadius: 9, background: pin.accent ? t.colors.accent : t.colors.ink, border: `3px solid ${t.colors.canvas}`, opacity: (pin.drop ? Math.min(1, fp * 3) : a) * out }} />
              {pin.label ? (
                <div style={{ position: "absolute", left: 0, bottom: 22, transform: `translate(-50%, ${(1 - a) * 12}px)`, opacity: a * out, whiteSpace: "nowrap", textAlign: "center" }}>
                  <div style={{ fontFamily: t.fonts.mono, fontSize: 30, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "8px 14px", borderRadius: 4 }}>{pin.label}</div>
                  {pin.sub ? <div style={{ marginTop: 6, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.secondary }}>{pin.sub}</div> : null}
                </div>
              ) : null}
            </div>
          );
        })}
    </div>
  );

  // depth of field: soft copy under, sharp copy masked to a band round the focus; blur grows with the tilt
  const maxBlur = dof ? Math.min(8, dof.maxBlur ?? 6) : 0;
  const blurPx = dof ? maxBlur * Math.min(1, tilt / 30) : 0;
  const fy = dof ? (dof.focusY ?? 600) / 1080 : 0.5;
  const band = dof ? (dof.band ?? 240) / 1080 : 0.2;
  const mask = `linear-gradient(to bottom, transparent ${((fy - band * 2.2) * 100).toFixed(1)}%, black ${((fy - band) * 100).toFixed(1)}%, black ${((fy + band) * 100).toFixed(1)}%, transparent ${((fy + band * 2.8) * 100).toFixed(1)}%)`;
  return (
    <AbsoluteFill style={{ opacity: pIn, background: t.colors.canvas, overflow: "hidden" }}>
      {blurPx > 0.3 ? (
        <>
          <AbsoluteFill style={{ ...persp, filter: `blur(${blurPx.toFixed(2)}px)` }}>{surface("soft")}</AbsoluteFill>
          <AbsoluteFill style={{ ...persp, WebkitMaskImage: mask, maskImage: mask }}>{surface("sharp")}</AbsoluteFill>
        </>
      ) : (
        <AbsoluteFill style={persp}>{surface("one")}</AbsoluteFill>
      )}
      <AbsoluteFill style={persp}>{standing}</AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) ${dark ? 30 : 55}%, ${t.colors.dimMask} 100%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{caption}</div>
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
      {tag ? <DatelineTag {...tag} /> : null}
      {sheet?.label && reveal(frame, fps, sheet.atSec + 0.4, 0.7) > 0 ? (
        <div style={{ position: "absolute", right: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, opacity: reveal(frame, fps, sheet.atSec + 0.4, 0.7) * (sheet.untilSec !== undefined ? 1 - reveal(frame, fps, sheet.untilSec, 0.6) : 1) }}>{sheet.label}</div>
      ) : null}
    </AbsoluteFill>
  );
};
