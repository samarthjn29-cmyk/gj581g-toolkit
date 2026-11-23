import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { drift, reveal, sec } from "../motion";

// VIS-058 ObjectEntrance with MOT-015 RealEntrance (Johnny Harris, 'Oligarchy is worse than you think' and 'Gold
// Explained, Finally': the bus drives in and slows to a stop, the hand slides in and only then the pouch opens;
// analysis only; Sam, 23 Nov 2026: "Sure" to building the rule, after asking how "things entering by their own motion"
// would work). A real object, cut out of a registered picture (the SRC row's cut-out file), comes in the way it moves
// in life, with its shadow, and does its one action only after it has landed:
//   slide   - pushed across the surface from an edge, slowing by friction, turning a little as it settles;
//   setDown - lowered from just above, its shadow tightening and darkening as it touches;
//   roll    - rolls in from an edge, turning by the distance it covers, slowing to a stop;
//   path    - travels along a drawn path (a letter on its way), turning with the path, then settles;
//   grow    - grows up from where it stands (a plant).
// Actions (after landing only): swap (turns over to its second picture: a page turning, a case opening), tint (takes a
// data colour, masked to its own shape), glint (a light sweep across its own shape), tilt (tips up towards us).
// Every landing has its sound (gate2-qa fails a silent landing); no fades, no bounces, no overshoot (the calm rule).
// Best use: a real thing in the story arriving at the moment it is named (a paper, a pair of spectacles, a pot, a
// letter, a jar). Limit: 1-4 objects a shot, one entrance each, 0.6-1.2 s; registered cut-outs only, with the source
// chip; a stand-in object (not the real one) carries an ILLUSTRATION tag; max 3 shots an act.
type XY = readonly [number, number];
export type EntryKind = "slide" | "setDown" | "roll" | "path" | "grow";
export type ObjectAction = { kind: "swap" | "tint" | "glint" | "tilt"; atSec: number; srcId?: string; file?: string; color?: string }; // swap: the second picture (its own SRC row or another file of the same row)
export type EntryObject = {
  srcId: string;
  file?: string;
  size: readonly [number, number]; // the cut-out's pixel size
  at: XY; // where it rests (its centre, frame px)
  w: number; // shown width (px)
  rot?: number; // resting rotation (deg)
  atSec: number;
  enter: { kind: EntryKind; from?: "left" | "right" | "top" | "bottom"; sec?: number; path?: XY[] };
  action?: ObjectAction;
  label?: { text: string; atSec?: number };
  illustrative?: boolean;
  shadow?: boolean;
  shape?: "flat" | "solid"; // flat things (a page, spectacles lying open) cast a drop shadow; solid things (a pot, a jar) a contact shadow
};
export type ObjectEntranceProps = { objects: EntryObject[]; caption?: string; startSec?: number };

const friction = Easing.bezier(0.2, 0.75, 0.25, 1);
const lower = Easing.bezier(0.45, 0, 0.25, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const along = (pts: readonly XY[], p: number): { x: number; y: number; a: number } => {
  const seg = pts.slice(1).map((q, k) => Math.hypot(q[0] - pts[k][0], q[1] - pts[k][1]));
  let left = seg.reduce((s, v) => s + v, 0) * Math.min(1, Math.max(0, p));
  for (let k = 0; k < seg.length; k++) {
    if (left <= seg[k] || k === seg.length - 1) {
      const f = seg[k] ? Math.min(1, left / seg[k]) : 0;
      const [a, b] = [pts[k], pts[k + 1]];
      return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, a: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
    }
    left -= seg[k];
  }
  const e = pts[pts.length - 1];
  return { x: e[0], y: e[1], a: 0 };
};

export const landingSec = (o: EntryObject) => o.atSec + (o.enter.sec ?? 0.9);

const Thing: React.FC<{ o: EntryObject }> = ({ o }) => {
  const t = useTheme();
  const src = useSourceFile(o.srcId, o.file);
  const alt = useSourceFile(o.action?.kind === "swap" ? o.action.srcId ?? o.srcId : o.srcId, o.action?.kind === "swap" ? o.action.file : o.file);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = o.enter.sec ?? 0.9;
  if (d < 0.6 || d > 1.2) throw new Error("ObjectEntrance: entrances take 0.6-1.2 s.");
  const land = landingSec(o);
  if (o.action && o.action.atSec < land) throw new Error(`ObjectEntrance: the ${o.action.kind} at ${o.action.atSec}s comes before the object lands (${land.toFixed(2)}s).`);
  if (o.action?.kind === "swap" && !o.action.file && !o.action.srcId) throw new Error("ObjectEntrance: swap needs the second picture.");
  const lin = interpolate(frame, [sec(o.atSec, fps), sec(land, fps)], [0, 1], clamp);
  if (frame < sec(o.atSec, fps)) return null;
  const h = (o.w * o.size[1]) / o.size[0];
  const rot = o.rot ?? 0;
  let x = o.at[0];
  let y = o.at[1];
  let r = rot;
  let lift = 0; // height above the surface (px), for the shadow
  let sx = 1;
  let sy = 1;
  const k = o.enter.kind;
  const from = o.enter.from ?? (k === "setDown" || k === "grow" ? "top" : "left");
  const off = (side: string) => (side === "left" ? [-o.w, o.at[1]] : side === "right" ? [1920 + o.w, o.at[1]] : side === "top" ? [o.at[0], -h] : [o.at[0], 1080 + h]);
  if (k === "slide") {
    const p = friction(lin);
    const [fx, fy] = off(from);
    x = fx + (o.at[0] - fx) * p;
    y = fy + (o.at[1] - fy) * p;
    r = rot + 7 * (1 - p) * (from === "right" ? -1 : 1);
  } else if (k === "roll") {
    const p = friction(lin);
    const [fx] = off(from);
    x = fx + (o.at[0] - fx) * p;
    const radius = Math.min(o.w, h) / 2;
    r = rot + (((x - o.at[0]) / radius) * 180) / Math.PI;
  } else if (k === "setDown") {
    const p = lower(lin);
    lift = 70 * (1 - p);
    y = o.at[1] - lift;
    sx = sy = 1 + 0.06 * (1 - p);
    r = rot + 4 * (1 - p);
  } else if (k === "path") {
    const pts = o.enter.path ?? [];
    if (pts.length < 2) throw new Error("ObjectEntrance: path needs 2+ points ending where it rests.");
    const p = friction(lin);
    const q = along([...pts, o.at], p);
    x = q.x;
    y = q.y;
    r = rot + (p < 0.85 ? q.a * 0.15 : q.a * 0.15 * (1 - (p - 0.85) / 0.15));
    lift = 20 * (1 - p);
  } else if (k === "grow") {
    sy = Easing.out(Easing.cubic)(lin);
    sx = 0.85 + 0.15 * sy;
  }
  // actions after landing
  const a = o.action;
  const ap = a ? interpolate(frame, [sec(a.atSec, fps), sec(a.atSec + 0.6, fps)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;
  const flip = a?.kind === "swap" ? ap * 180 : 0;
  const tilt = a?.kind === "tilt" ? -18 * ap : 0;
  const imgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", maxWidth: "none" };
  const maskStyle = (u: string): React.CSSProperties => ({ WebkitMaskImage: `url(${u})`, maskImage: `url(${u})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" });
  const solid = (o.shape ?? (k === "setDown" || k === "roll" || k === "grow" ? "solid" : "flat")) === "solid";
  const shadow = o.shadow !== false && solid;
  const sh = Math.min(1, 0.35 + 0.65 * (1 - lift / 70));
  return (
    <>
      {shadow ? (
        <div style={{ position: "absolute", left: x - (o.w * 0.48) * (1 + lift / 140), top: o.at[1] + h * 0.34 + (k === "grow" ? h * 0.12 : 0), width: o.w * 0.96 * (1 + lift / 140), height: h * 0.22, borderRadius: "50%", background: "rgba(0,0,0,0.42)", filter: `blur(${(8 + lift * 0.35).toFixed(1)}px)`, opacity: sh * (k === "grow" ? sy : 1), transform: k === "slide" || k === "roll" ? `translateY(${(y - o.at[1]).toFixed(1)}px)` : undefined }} />
      ) : null}
      <div style={{ position: "absolute", left: x - o.w / 2, top: y - h / 2, width: o.w, height: h, transformOrigin: k === "grow" ? "50% 100%" : "50% 50%", transform: `perspective(1400px) rotate(${r.toFixed(2)}deg) rotateX(${tilt}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})` }}>
        {a?.kind === "swap" && ap > 0 ? <Img src={alt} style={{ ...imgStyle, filter: `drop-shadow(0 6px 10px rgba(0,0,0,0.4))` }} /> : null}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: flip ? `perspective(1600px) rotateY(${(-flip).toFixed(2)}deg)` : undefined, backfaceVisibility: "hidden", opacity: flip > 90 ? 0 : 1 }}>
        <Img src={src} style={{ ...imgStyle, filter: solid || o.shadow === false ? "drop-shadow(0 2px 2px rgba(0,0,0,0.25))" : `drop-shadow(0 ${(6 + lift * 0.5).toFixed(1)}px ${(10 + lift * 0.4).toFixed(1)}px rgba(0,0,0,${(0.4 * sh).toFixed(3)}))` }} />
        </div>
        {a?.kind === "tint" && ap > 0 ? <div style={{ position: "absolute", inset: 0, background: a.color ?? t.colors.accent, mixBlendMode: "multiply", opacity: 0.85 * ap, ...maskStyle(src) }} /> : null}
        {a?.kind === "glint" && ap > 0 && ap < 1 ? (
          <div style={{ position: "absolute", inset: 0, ...maskStyle(src), background: `linear-gradient(105deg, rgba(255,255,255,0) ${(ap * 140 - 40).toFixed(1)}%, rgba(255,250,235,0.85) ${(ap * 140 - 25).toFixed(1)}%, rgba(255,255,255,0) ${(ap * 140 - 10).toFixed(1)}%)`, mixBlendMode: "screen" }} />
        ) : null}
      </div>
    </>
  );
};

export const ObjectEntrance: React.FC<ObjectEntranceProps> = ({ objects, caption, startSec = 0 }) => {
  useAssets(["VIS-058", "MOT-015", "MOT-001", ...objects.map((o) => o.srcId), ...objects.filter((o) => o.action?.srcId).map((o) => o.action?.srcId as string)]);
  if (objects.length < 1 || objects.length > 4) throw new Error("ObjectEntrance: 1-4 objects.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const z = drift(frame, durationInFrames, 0.02);
  const pIn = reveal(frame, fps, startSec, 0.6);
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        {objects.map((o, i) => (
          <Thing key={i} o={o} />
        ))}
        {objects.map((o, i) => {
          if (!o.label) return null;
          const la = reveal(frame, fps, o.label.atSec ?? landingSec(o) + 0.3, 0.6);
          if (la <= 0) return null;
          const h = (o.w * o.size[1]) / o.size[0];
          return (
            <div key={`l${i}`} style={{ position: "absolute", left: o.at[0], top: o.at[1] + h / 2 + 28, transform: `translate(-50%, ${((1 - la) * 10).toFixed(1)}px)`, opacity: la, whiteSpace: "nowrap", textAlign: "center" }}>
              <span style={{ fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{o.label.text}</span>
              {o.illustrative ? <span style={{ marginLeft: 10, fontFamily: t.fonts.mono, fontSize: 18, letterSpacing: 2, color: t.colors.secondary, border: `1px solid ${t.colors.secondary}`, padding: "4px 8px", borderRadius: 3 }}>ILLUSTRATION</span> : null}
            </div>
          );
        })}
      </AbsoluteFill>
      {caption ? <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};
