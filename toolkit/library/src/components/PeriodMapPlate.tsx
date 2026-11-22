import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { drift, reveal, sec, SLOW_OUT } from "../motion";
import { cropToBox, type Rect } from "../layers/CropImage";
import { Label, type LabelSpec } from "../layers/Label";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";
import { RadioRings } from "../layers/RadioRings";
import { VectorTraceConnector } from "../layers/VectorTraceConnector";
import { BoilDefs } from "../layers/LineBoil";

// MAP-010 PeriodMapPlate: a real period map (an SRC row) as a full-frame plate. The camera moves between views
// (crops of the map, SLOW_OUT, 1.6 s by default) with one slow drift; our own drawn pins sit on the map's own
// place names (MOT-009 boil), MAP-008 rings mark "here", and MAP-009 draws a route between two pins (MOT-005
// trace, dashed) after which the plate may tilt back a few degrees. The scan itself is never redrawn or boiled.
// It always carries a source chip with the map's maker and real date. Pins, routes and labels are in map pixels.
export type MapPin = { id: string; x: number; y: number; atSec: number; label?: string; labelDx?: number; labelDy?: number };
export type PeriodMapPlateProps = {
  srcId: string;
  size: readonly [number, number];
  views: { atSec: number; crop: Rect; moveSec?: number }[];
  pins?: MapPin[];
  rings?: { pin: string; atSec: number; pulses?: number }[];
  route?: { from: string; to: string; atSec: number; drawSec?: number; tilt?: { atSec: number; deg: number } };
  labels?: LabelSpec[];
  tag?: DatelineTagProps;
  source: string; // e.g. "MAP · EMANUEL BOWEN · 1760 · YALE UNIVERSITY LIBRARY"
  // MAP-005 FocusDim (built 22 Nov 2026): from atSec the map dims outside a soft circle round one pin, so the one
  // place being spoken about holds the eye; untilSec lets the rest come back. Max 4 beats per episode.
  focusDim?: { pin: string; atSec: number; untilSec?: number; radius?: number; dim?: number };
  startSec?: number;
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const PeriodMapPlate: React.FC<PeriodMapPlateProps> = ({ srcId, size, views, pins = [], rings = [], route, labels = [], tag, source, focusDim, startSec = 0 }) => {
  useAssets(["MAP-010", "MOT-001", ...(pins.length ? ["MOT-009"] : []), ...(route ? ["MAP-009", "MOT-005"] : []), ...(focusDim ? ["MAP-005"] : [])]);
  const t = useTheme();
  const src = useSourceFile(srcId);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const now = frame / fps;
  // the current crop: ease from the previous view into the latest one that has started
  let crop: Rect = views[0].crop;
  for (let i = 1; i < views.length; i++) {
    const v = views[i];
    if (now < v.atSec) break;
    const p = interpolate(frame, [sec(v.atSec, fps), sec(v.atSec + (v.moveSec ?? 1.6), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
    const a = crop;
    crop = [lerp(a[0], v.crop[0], p), lerp(a[1], v.crop[1], p), lerp(a[2], v.crop[2], p), lerp(a[3], v.crop[3], p)];
  }
  const { s, ox, oy } = cropToBox(crop, 1920, 1080, "cover");
  const toScreen = (x: number, y: number): [number, number] => [ox + x * s, oy + y * s];
  const pin = (id: string) => {
    const q = pins.find((p) => p.id === id);
    if (!q) throw new Error(`PeriodMapPlate: no pin ${id}`);
    return q;
  };
  const tilt = route?.tilt;
  const tiltDeg = tilt ? Math.min(10, tilt.deg) * interpolate(frame, [sec(tilt.atSec, fps), sec(tilt.atSec + 1.4, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT }) : 0;
  const pIn = reveal(frame, fps, startSec, 0.9);
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <AbsoluteFill style={{ perspective: 1800 }}>
        <AbsoluteFill style={{ transform: `rotateX(${tiltDeg.toFixed(2)}deg) scale(${(drift(frame, durationInFrames, 0.02) * (1 + tiltDeg * 0.006)).toFixed(4)})`, transformOrigin: "50% 60%" }}>
          <Img src={src} style={{ position: "absolute", left: ox, top: oy, width: size[0] * s, height: size[1] * s, maxWidth: "none", filter: "sepia(0.12) contrast(1.05) brightness(0.96)" }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.38) 100%)" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <BoilDefs id="mapboil" amp={1} />
            </defs>
            <g filter="url(#mapboil)">
              {pins.map((q) => {
                const p = reveal(frame, fps, q.atSec, 0.6);
                if (p <= 0) return null;
                const [x, y] = toScreen(q.x, q.y);
                return (
                  <g key={q.id} opacity={p}>
                    <circle cx={x} cy={y} r={14 + (1 - p) * 8} fill="none" stroke={t.colors.accent} strokeWidth={3.5} />
                    <circle cx={x} cy={y} r={5} fill={t.colors.accent} />
                  </g>
                );
              })}
            </g>
          </svg>
          {focusDim
            ? (() => {
                const [fx, fy] = toScreen(pin(focusDim.pin).x, pin(focusDim.pin).y);
                const on = reveal(frame, fps, focusDim.atSec, 0.8) * (focusDim.untilSec !== undefined ? 1 - reveal(frame, fps, focusDim.untilSec, 0.8) : 1);
                const r = focusDim.radius ?? 240;
                return <AbsoluteFill style={{ background: `radial-gradient(circle ${r * 1.6}px at ${fx}px ${fy}px, rgba(0,0,0,0) ${Math.round(r * 0.55)}px, ${t.colors.dimMask} ${r * 1.6}px)`, opacity: (focusDim.dim ?? 0.75) * on }} />;
              })()
            : null}
          {rings.map((r) => {
            const [x, y] = toScreen(pin(r.pin).x, pin(r.pin).y);
            return <RadioRings key={`${r.pin}${r.atSec}`} spec={{ x, y, atSec: r.atSec, pulses: r.pulses }} />;
          })}
          {route
            ? (() => {
                const [ax, ay] = toScreen(pin(route.from).x, pin(route.from).y);
                const [bx, by] = toScreen(pin(route.to).x, pin(route.to).y);
                return <VectorTraceConnector id="route" spec={{ from: [ax, ay], to: [bx, by], atSec: route.atSec, drawSec: route.drawSec ?? 1.3, dashed: true, boil: 1, bend: 0.16 }} />;
              })()
            : null}
          {pins.map((q) => {
            if (!q.label) return null;
            const [x, y] = toScreen(q.x, q.y);
            return <Label key={`l${q.id}`} spec={{ text: q.label, atSec: q.atSec, x: x + (q.labelDx ?? 30), y: y + (q.labelDy ?? -50) }} />;
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, opacity: reveal(frame, fps, startSec + 0.4, 0.75) }}>{source}</div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
