import { Label, type LabelSpec } from "../layers/Label";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme, isLightTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";
import { SpectrumStrip, type SpectrumStripProps } from "./SpectrumStrip";

// VIS-059 LayerStage (Sam, 23 Nov 2026: "Do you think playing with the layers will bring in more motion and
// cinematics ... a sky background which is showing moving clouds and then we bring in some objects on that background
// layer then switching the background to something else for the next scene or moving the objects to a different
// background"; then "Start working on building the layers.").
// One shot built in planes, so the world keeps going while what is in front of it changes:
//   far   - the world: a real registered clip or picture (a moving sky, a candle-lit room, a map, a desk), graded to
//           its light; worlds follow one another inside the shot by TRN-018 WorldSwap: dissolve (the light changes),
//           pan (the next world slides in at the far plane's speed while the carried things stay), or wipe;
//   mid   - optional: a registered picture in between (a window frame, a sill, a desk edge);
//   near  - carried things: registered cut-outs that stay on screen across the world changes, take the new world's
//           light (a warm candle cast, a cool day), may change colour by state (what someone reported, labelled), and
//           may move to a new place or size.
// MOT-016 ParallaxPlanes: one slow camera move drives every plane at its own depth (far 0.35x, mid 0.65x, near 1x).
// Best use: one thing seen in different worlds (the geranium by day and by candle), a thing carried from one place to
// the next (a page from the sky of Kendal to the map), a weather sky behind the man who recorded it. Limit: 1-4
// worlds and 1-3 carried things a shot; world changes 0.8-1.6 s, at most one every 2.5 s; registered pictures only;
// a recolour is a reported colour and says so on screen; max 4 per act (raised 24 Nov 2026 for act 3's layer shots).
type XY = readonly [number, number];
export type StageWorld = {
  atSec: number;
  srcId: string;
  file?: string;
  revFile?: string; // a reversed copy of a short clip, played after it (ping-pong) so it never runs out
  clipSec?: number; // the clip's length when revFile is given
  clipStartSec?: number; // start the clip here (no ping-pong)
  kind: "video" | "image";
  size: readonly [number, number];
  focus?: readonly [number, number];
  zoom?: number; // 1-1.5: scale past cover, so a subject can sit on a third without showing the canvas
  change?: "dissolve" | "pan" | "wipe";
  sec?: number;
  light?: "day" | "warm" | "night" | "none" | "paper"; // paper: a period page or plan world (act 3 brief, Builder 4)
  label?: string;
  // the Director (rules/DIRECTOR.md, Sam 23 Nov 2026: "There has to be some kind of relation between the two"):
  // the world's relation to the subject: same place, same time, same idea, or the change itself
  why: string;
  // a present-day clip or photo behind a period subject: its label reads TODAY · ...
  today?: boolean;
  // depth (layering study, 23 Nov 2026): atmospheric perspective and depth of field on the world, so the carried
  // thing separates from it. haze 0-0.35 lifts and flattens the far plane; blur 0-4 px softens it; rackSec pulls the
  // blur in from 0 over 0.8 s from that time (focus moves from the world to the thing as it arrives).
  haze?: number;
  blur?: number;
  rackSec?: number;
  // where the world's light comes from: the carried things' shadows fall the other way
  lightFrom?: "top" | "top-left" | "top-right" | "left" | "right";
  // act 3 builders (the Director's act 3 briefs, 23-24 Nov 2026):
  // highlights on the world itself, in image px (ArchivalScanCard's sweep); atSec <= 0 is lit from frame 0; they blur
  // with the world's rack (wanted: the page goes soft with its marks)
  highlights?: { box: readonly [number, number, number, number]; atSec: number }[];
  // rings drawn inside the world's plane (they move and scale with the world, outside its blur), frame px at rest
  rings?: { x: number; y: number; r: number; atSec: number; untilSec?: number; drawSec?: number }[];
  // dim 0-0.6: brightness(1-d) saturate(1-d); rackDim: the dim reached on the rack curve (rackSec, 0.8 s)
  dim?: number;
  rackDim?: number;
  // outSec: the world fades to the theme canvas over 1.2 s while its blur rises to 4 px; its label un-wipes from here
  outSec?: number;
};
export type CarryState = { atSec: number; color?: string | null; label?: string; blend?: "color" | "replace" }; // replace: one flat colour over the thing (a simulated match), its texture kept faintly
export type StageCarry = {
  srcId: string;
  file?: string;
  size: readonly [number, number];
  at: XY;
  w: number;
  atSec: number;
  enter?: "rise" | "setDown";
  states?: CarryState[];
  moves?: { atSec: number; to: XY; w?: number; sec?: number; why: string }[]; // why: what the destination means
  caption?: string;
  captionUntilSec?: number; // the caption un-wipes from here (MOT-013), with or before the thing's exit
  // rest: the thing lies on the world's surface (a page on a desk): a tight contact shadow; otherwise it is lifted
  // off the world and its shadow is softer and further away (layering study, 23 Nov 2026)
  rest?: boolean;
  captionSize?: number; // default 16; a tag under an object (A SEALED LETTER · 1841) uses 20
  // highlights on the carried thing, in its file's px (the Henry strip's two phrases)
  highlights?: { box: readonly [number, number, number, number]; atSec: number }[];
  // untilSec: the thing leaves; exit "sink" is the rise reversed (0.6 s)
  untilSec?: number;
  exit?: "sink";
  tilt?: number; // degrees, fixed
  torn?: boolean; // a torn-paper edge (MAP-017's map scrap)
  // MAP-017 MapScrapRoute drawn inside the carried map piece, in its file's px: a straight from -> to line (never a
  // road: the route is not invented), a hand-drawn circle on the end, mono place chips, a source chip
  route?: { from: XY; to: XY; atSec: number; drawSec?: number; circleSec?: number; chips?: { text: string; at: XY }[]; source?: string };
};
export type LayerStageProps = {
  worlds: StageWorld[];
  mid?: { srcId: string; file?: string; size: readonly [number, number]; at: XY; w: number };
  carry?: StageCarry[];
  camera?: { pan?: number; push?: number }; // px over the shot at the near plane; push: zoom (<= 0.06)
  caption?: string;
  // timed text on the world (the Director's Weather brief: the diary dates written across the sky), the Label layer:
  // locks in on its word, un-wipes out (MOT-013)
  labels?: LabelSpec[];
  // the dateline (TXT-011, as EyeDiagram and PeriodMapPlate have it), over the world
  tag?: DatelineTagProps;
  // a drawn plane above the vignette and below the world labels, with no grade, blur, camera move or scale of its own
  // (it keeps its own drift): the two-track SpectrumStrip in front of the prism photo
  overlay?: { spectrum?: SpectrumStripProps };
  // a cut-on-action entry with no bare edge: every plane starts offset and settles (out-cubic); pair with
  // CutOnAction moveTo: false
  arrive?: { dir: "down" | "up" | "left" | "right"; px: number; sec?: number; atSec?: number }; // atSec: when the settle starts (a CutOnAction's leadSec)
  captionUntilSec?: number; // the static caption un-wipes from here (MOT-013)
  startSec?: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.45, 0, 0.15, 1);
const GRADE: Record<string, string> = {
  paper: "none",
  day: "saturate(0.9) contrast(1.02)",
  warm: "sepia(0.35) saturate(1.1) brightness(0.92)",
  night: "saturate(0.6) brightness(0.55) contrast(1.1)",
  none: "none",
};
// the light a world casts on the carried things (a soft-light wash over them, masked to their shape)
const CAST: Record<string, string> = { paper: "rgba(255,236,205,0.10)", day: "rgba(170,205,255,0.18)", warm: "rgba(255,150,60,0.38)", night: "rgba(60,80,140,0.35)", none: "rgba(0,0,0,0)" };
// a shadow takes the world's ambient colour (a cool day, a brown candle-lit room), never neutral black
const SHADOW: Record<string, string> = { paper: "rgba(58,40,20,", day: "rgba(24,34,52,", warm: "rgba(58,26,8,", night: "rgba(6,10,26,", none: "rgba(20,18,16," };
// the carried thing is graded part-way towards its world (saturation and brightness match)
const NEAR_GRADE: Record<string, string> = { paper: "sepia(0.06) saturate(0.92)", day: "saturate(0.95)", warm: "sepia(0.12) saturate(1.04) brightness(0.96)", night: "saturate(0.8) brightness(0.8)", none: "none" };
const LIGHT_DIR: Record<string, XY> = { top: [0, 1], "top-left": [0.6, 0.8], "top-right": [-0.6, 0.8], left: [1, 0.25], right: [-1, 0.25] };

const WorldPlate: React.FC<{ w: StageWorld; until: number }> = ({ w, until }) => {
  const src = useSourceFile(w.srcId, w.file);
  const rev = useSourceFile(w.srcId, w.revFile ?? w.file);
  const { fps } = useVideoConfig();
  const z = w.zoom ?? 1;
  if (z < 1 || z > 1.5) throw new Error("LayerStage: world zoom 1-1.5.");
  const s = Math.max(1920 / w.size[0], 1080 / w.size[1]) * 1.08 * z;
  const f = w.focus ?? [0.5, 0.5];
  const frame = useCurrentFrame();
  const t = useTheme();
  const hz = w.haze ?? 0;
  if (hz < 0 || hz > 0.35) throw new Error("LayerStage: world haze 0-0.35.");
  if ((w.blur ?? 0) < 0 || (w.blur ?? 0) > 4) throw new Error("LayerStage: world blur 0-4 px.");
  // inside the world's Sequence, frame counts from the world's start
  const rack = w.rackSec !== undefined ? interpolate(frame, [sec(w.rackSec - w.atSec, fps), sec(w.rackSec - w.atSec + 0.8, fps)], [0, 1], { ...clamp, easing: SLOW_OUT }) : 1;
  const outP = w.outSec !== undefined ? interpolate(frame, [sec(w.outSec - w.atSec, fps), sec(w.outSec - w.atSec + 1.2, fps)], [0, 1], { ...clamp, easing: inOut }) : 0;
  const bl = (w.blur ?? 0) * rack + Math.max(0, 4 - (w.blur ?? 0) * rack) * outP;
  const dimTo = w.rackDim ?? w.dim ?? 0;
  const dm = (w.dim ?? 0) + (dimTo - (w.dim ?? 0)) * (w.rackSec !== undefined ? rack : 0);
  if (dm < 0 || dm > 0.6) throw new Error("LayerStage: world dim 0-0.6.");
  const depth = `${hz > 0 ? ` contrast(${(1 - hz * 0.6).toFixed(3)}) brightness(${(1 + hz * 0.25).toFixed(3)}) saturate(${(1 - hz * 0.5).toFixed(3)})` : ""}${dm > 0.005 ? ` brightness(${(1 - dm).toFixed(3)}) saturate(${(1 - dm).toFixed(3)})` : ""}${bl > 0.05 ? ` blur(${bl.toFixed(2)}px)` : ""}`;
  const box: React.CSSProperties = { position: "absolute", width: w.size[0] * s, height: w.size[1] * s, left: 960 - f[0] * w.size[0] * s, top: 540 - f[1] * w.size[1] * s, filter: `${GRADE[w.light ?? "none"]}${depth}`.replace(/^none /, "") || undefined, opacity: 1 - outP };
  const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", maxWidth: "none" };
  const hl = (w.highlights ?? []).map((h, i) => {
    const a = sec(h.atSec - w.atSec, fps);
    const p = h.atSec <= 0 ? 1 : interpolate(frame, [a, a + sec(0.7, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
    return p > 0 ? <div key={i} style={{ position: "absolute", left: h.box[0] * s - 6, top: h.box[1] * s - 4, width: (h.box[2] * s + 12) * p, height: h.box[3] * s + 8, background: t.colors.accentSoft, mixBlendMode: "multiply", borderRadius: 3 }} /> : null;
  });
  if (w.kind === "image")
    return (
      <div style={box}>
        <Img src={src} style={st} />
        {hl}
      </div>
    );
  if (!w.revFile || !w.clipSec)
    return (
      <div style={box}>
        <OffthreadVideo src={src} muted startFrom={sec(w.clipStartSec ?? 0, fps)} style={st} />
        {hl}
      </div>
    );
  // ping-pong: forward, reversed, forward... so a short real clip covers the whole shot
  const L = sec(w.clipSec, fps) - 1;
  const total = sec(until, fps);
  const parts = Math.max(1, Math.ceil(total / L));
  return (
    <div style={box}>
      {Array.from({ length: parts }, (_, i) => (
        <Sequence key={i} from={i * L} durationInFrames={L} layout="none">
          <OffthreadVideo src={i % 2 ? rev : src} muted style={st} />
        </Sequence>
      ))}
      {hl}
    </div>
  );
};

// a torn-paper edge: a jagged polygon round the piece (deterministic per piece)
const tornEdge = (seed: string): string => {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
  const pts: string[] = [];
  const n = 26;
  for (let i = 0; i <= n; i++) pts.push(`${((i / n) * 100).toFixed(2)}% ${(rnd() * 3.6).toFixed(2)}%`);
  for (let i = 0; i <= n; i++) pts.push(`${(100 - rnd() * 3.6).toFixed(2)}% ${((i / n) * 100).toFixed(2)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${((i / n) * 100).toFixed(2)}% ${(100 - rnd() * 3.6).toFixed(2)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(rnd() * 3.6).toFixed(2)}% ${((i / n) * 100).toFixed(2)}%`);
  return `polygon(${pts.join(", ")})`;
};
// a hand-drawn circle: one loop, slightly open and overshooting, in the piece's own px
const handCircle = (c: XY, r: number): string => {
  const pts: string[] = [];
  for (let i = 0; i <= 28; i++) {
    const a = -1.9 + (i / 28) * (Math.PI * 2 + 0.35);
    const rr = r * (1 + 0.07 * Math.sin(i * 1.7));
    pts.push(`${i ? "L" : "M"} ${(c[0] + rr * Math.cos(a)).toFixed(1)} ${(c[1] + rr * 0.86 * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
};

type NearLight = { a: string; b: string; p: number; key: string; from: XY };
const Carried: React.FC<{ c: StageCarry; light: NearLight; cam: XY; uid: string }> = ({ c, light, cam, uid }) => {
  const t = useTheme();
  const src = useSourceFile(c.srcId, c.file);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < sec(c.atSec, fps)) return null;
  // position: moves eased one after another
  let at = c.at;
  let w = c.w;
  for (const m of c.moves ?? []) {
    const d = m.sec ?? 1.2;
    const p = inOut(interpolate(frame, [sec(m.atSec, fps), sec(m.atSec + d, fps)], [0, 1], clamp));
    at = [at[0] + (m.to[0] - at[0]) * p, at[1] + (m.to[1] - at[1]) * p];
    w = w + ((m.w ?? w) - w) * p;
  }
  const h = (w * c.size[1]) / c.size[0];
  const pe = interpolate(frame, [sec(c.atSec, fps), sec(c.atSec + 0.9, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
  const xo = c.untilSec !== undefined ? interpolate(frame, [sec(c.untilSec, fps), sec(c.untilSec + 0.6, fps)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  if (xo >= 1) return null;
  const dy = (c.enter === "setDown" ? -60 * (1 - pe) : 140 * (1 - pe)) + 140 * xo;
  const op = (c.enter === "setDown" ? 1 : Math.min(1, pe * 1.6)) * (1 - xo);
  const k = w / c.size[0]; // carried file px -> frame px
  // colour states: a reported colour laid over the thing's own shading (mix-blend colour), crossfading
  const states = c.states ?? [];
  const layers = states.map((s, i) => {
    const pin = interpolate(frame, [sec(s.atSec, fps), sec(s.atSec + 0.7, fps)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const next = states[i + 1];
    const pout = next ? interpolate(frame, [sec(next.atSec, fps), sec(next.atSec + 0.7, fps)], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 1;
    return { s, o: pin * pout };
  });
  const mask: React.CSSProperties = { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };
  const fid = `ls-edge-${uid}`;
  // shadow: falls away from the world's light, in the world's ambient colour; tight when resting, soft when lifted
  const sc = SHADOW[light.key] ?? SHADOW.none;
  const [lx, ly] = light.from;
  const lift = c.rest ? 0 : 1 - 0.35 * pe; // a rising thing's shadow tightens as it settles
  const shadow = c.rest
    ? `drop-shadow(${(lx * 3).toFixed(1)}px ${(ly * 3).toFixed(1)}px 3px ${sc}0.42)) drop-shadow(${(lx * 12).toFixed(1)}px ${(ly * 12).toFixed(1)}px 14px ${sc}0.22))`
    : light.key === "paper" // a paper world is bright and even: the lifted shadow needs more weight to read (act 3 frame review, FIX 14)
      ? `drop-shadow(${(lx * (12 + 10 * (lift - 0.65))).toFixed(1)}px ${(ly * (12 + 10 * (lift - 0.65))).toFixed(1)}px ${(18 + 12 * (lift - 0.65)).toFixed(0)}px ${sc}0.38))`
      : `drop-shadow(${(lx * (16 + 14 * lift)).toFixed(1)}px ${(ly * (16 + 14 * lift)).toFixed(1)}px ${(22 + 16 * lift).toFixed(0)}px ${sc}${(0.3 - 0.08 * lift).toFixed(2)}))`;
  const wrapColor = light.key === "warm" ? "#ffb070" : light.key === "night" ? "#7088c0" : light.key === "day" ? "#dbe8ff" : "#ffffff";
  const wrapOpacity = light.key === "none" ? 0 : light.key === "warm" ? 0.32 : 0.22;
  const capV = c.captionUntilSec !== undefined ? interpolate(frame, [sec(c.captionUntilSec, fps), sec(c.captionUntilSec + 0.4, fps)], [1, 0], clamp) : 1;
  const torn = c.torn ? tornEdge(uid) : undefined;
  const hl = (c.highlights ?? []).map((hh, i) => {
    const a = sec(hh.atSec, fps);
    const pp = hh.atSec <= 0 ? 1 : interpolate(frame, [a, a + sec(0.7, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
    return pp > 0 ? <div key={`h${i}`} style={{ position: "absolute", left: hh.box[0] * k - 5, top: hh.box[1] * k - 3, width: (hh.box[2] * k + 10) * pp, height: hh.box[3] * k + 6, background: t.colors.accentSoft, mixBlendMode: "multiply", borderRadius: 3 }} /> : null;
  });
  const rt = c.route;
  const pr = rt ? interpolate(frame, [sec(rt.atSec, fps), sec(rt.atSec + (rt.drawSec ?? 0.8), fps)], [0, 1], { ...clamp, easing: inOut }) : 0;
  const pc = rt && rt.circleSec !== undefined ? interpolate(frame, [sec(rt.circleSec, fps), sec(rt.circleSec + 0.5, fps)], [0, 1], { ...clamp, easing: SLOW_OUT }) : 0;
  return (
    <div style={{ position: "absolute", left: at[0] - w / 2 + cam[0], top: at[1] - h / 2 + dy + cam[1], width: w, height: h, opacity: op, transform: c.tilt ? `rotate(${c.tilt}deg)` : undefined, filter: torn ? shadow : undefined }}>
      {/* edge: a 0.6 px choke kills the old background's fringe, and a soft rim of the world's light wraps the edge
          (layering study: halos and hard rims are what make a cut-out look pasted on) */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={fid} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius={0.6} result="core" />
          <feGaussianBlur in="core" stdDeviation={0.45} result="coreS" />
          <feComposite in="SourceGraphic" in2="coreS" operator="in" result="body" />
          <feMorphology in="coreS" operator="erode" radius={5} result="inner" />
          <feComposite in="coreS" in2="inner" operator="out" result="rimBand" />
          <feGaussianBlur in="rimBand" stdDeviation={3} result="rimSoft" />
          <feFlood floodColor={wrapColor} floodOpacity={wrapOpacity} />
          <feComposite in2="rimSoft" operator="in" result="rim" />
          <feComposite in="rim" in2="coreS" operator="in" result="rimIn" />
          <feBlend in="rimIn" in2="body" mode="screen" />
        </filter>
      </svg>
      <div style={{ position: "absolute", inset: 0, clipPath: torn }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", filter: `url(#${fid}) ${NEAR_GRADE[light.key] ?? "none"}${torn ? "" : ` ${shadow}`}` }} />
      {layers.map(({ s, o }, i) =>
        s.color && o > 0 ? (
          s.blend === "replace" ? (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", inset: 0, background: s.color, opacity: o, ...mask }} />
              <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", mixBlendMode: "luminosity", opacity: o * 0.14 }} />
            </React.Fragment>
          ) : (
            <div key={i} style={{ position: "absolute", inset: 0, background: s.color, mixBlendMode: "color", opacity: o * 0.92, ...mask }} />
          )
        ) : null,
      )}
      {hl}
      {/* the world's light on the thing */}
      <div style={{ position: "absolute", inset: 0, background: light.a, mixBlendMode: "soft-light", opacity: 1 - light.p, ...mask }} />
      <div style={{ position: "absolute", inset: 0, background: light.b, mixBlendMode: "soft-light", opacity: light.p, ...mask }} />
      {rt && pr > 0 ? (
        <svg width={w} height={h} viewBox={`0 0 ${c.size[0]} ${c.size[1]}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={rt.from[0]} y1={rt.from[1]} x2={rt.from[0] + (rt.to[0] - rt.from[0]) * pr} y2={rt.from[1] + (rt.to[1] - rt.from[1]) * pr} stroke={t.colors.accent} strokeWidth={7 / k} strokeLinecap="round" />
          <circle cx={rt.from[0]} cy={rt.from[1]} r={7 / k} fill={t.colors.accent} />
          {pc > 0 ? <path d={handCircle(rt.to, 36 / k)} fill="none" stroke={t.colors.accent} strokeWidth={5 / k} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pc} /> : null}
        </svg>
      ) : null}
      </div>
      {rt && pr > 0
        ? (rt.chips ?? []).map((ch, i) => (
            <div key={`rc${i}`} style={{ position: "absolute", left: ch.at[0] * k, top: ch.at[1] * k, fontFamily: t.fonts.mono, fontSize: 18, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "4px 9px", borderRadius: 3, opacity: Math.min(1, pr * 3), whiteSpace: "nowrap", transform: c.tilt ? `rotate(${-c.tilt}deg)` : undefined }}>
              {ch.text}
            </div>
          ))
        : null}
      {rt?.source && pr > 0 ? <div style={{ position: "absolute", left: 10, bottom: -40, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "4px 10px", borderRadius: 3, whiteSpace: "nowrap", opacity: Math.min(1, pr * 3), transform: c.tilt ? `rotate(${-c.tilt}deg)` : undefined }}>{rt.source}</div> : null}
      {states.map((st, i) => {
        if (!st.label) return null;
        const vin = interpolate(frame, [sec(st.atSec, fps), sec(st.atSec + 0.5, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
        const nx = states[i + 1];
        const vout = nx ? interpolate(frame, [sec(nx.atSec, fps), sec(nx.atSec + 0.4, fps)], [1, 0], clamp) : 1;
        const v = Math.min(vin, vout);
        if (v <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: "50%", top: h + 22, transform: `translateX(-50%) translateY(${((1 - vin) * 10).toFixed(1)}px)`, whiteSpace: "nowrap", fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "7px 13px", borderRadius: 3, opacity: Math.min(1, v * 2.5), clipPath: vout < 1 ? `inset(-4px ${((1 - vout) * 100).toFixed(1)}% -4px -4px)` : undefined }}>
            {st.label}
          </div>
        );
      })}
      {c.caption && capV > 0 ? <div style={{ position: "absolute", left: "50%", top: h + ((c.states ?? []).some((q) => q.label) ? 72 : 22), opacity: Math.min(1, capV * 2.5), clipPath: capV < 1 ? `inset(-4px ${((1 - capV) * 100).toFixed(1)}% -4px -4px)` : undefined, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: t.fonts.mono, fontSize: c.captionSize ?? 16, letterSpacing: 2, color: c.captionSize ? t.colors.ink : t.colors.secondary, background: t.colors.chip, padding: "4px 10px", borderRadius: 3 }}>{c.caption}</div> : null}
    </div>
  );
};

const MidPlate: React.FC<{ m: NonNullable<LayerStageProps["mid"]>; cam: XY }> = ({ m, cam }) => {
  const src = useSourceFile(m.srcId, m.file);
  const h = (m.w * m.size[1]) / m.size[0];
  return <Img src={src} style={{ position: "absolute", left: m.at[0] - m.w / 2 + cam[0], top: m.at[1] - h / 2 + cam[1], width: m.w, height: h, maxWidth: "none" }} />;
};

export const LayerStage: React.FC<LayerStageProps> = ({ worlds, mid, carry = [], camera = {}, caption, captionUntilSec, labels = [], tag, overlay, arrive, startSec = 0 }) => {
  useAssets([
    "VIS-059",
    "MOT-016",
    ...(worlds.some((w) => (w.rings ?? []).length) ? ["MAP-008"] : []),
    ...(carry.some((c) => c.route) ? ["MAP-017"] : []),
    ...(worlds.length > 1 ? ["TRN-018"] : []),
    ...worlds.map((w) => w.srcId),
    ...carry.map((c) => c.srcId),
    ...(mid ? [mid.srcId] : []),
  ]);
  if (worlds.length < 1 || worlds.length > 4) throw new Error("LayerStage: 1-4 worlds.");
  worlds.forEach((w, i) => {
    if (!w.why || w.why.trim().length < 12) throw new Error(`LayerStage: world ${i + 1} needs a 'why' (its relation to the subject; rules/DIRECTOR.md).`);
  });
  carry.forEach((c) => (c.moves ?? []).forEach((m) => {
    if (!m.why) throw new Error(`LayerStage: every move of ${c.srcId} needs a 'why' (what its destination means).`);
  }));
  if (carry.length > 3) throw new Error("LayerStage: 1-3 carried things.");
  worlds.forEach((w, i) => {
    if (i && ((w.sec ?? 1.2) < 0.8 || (w.sec ?? 1.2) > 1.6)) throw new Error("LayerStage: world changes take 0.8-1.6 s.");
    if (i && w.atSec - worlds[i - 1].atSec < 2.5) throw new Error("LayerStage: at most one world change every 2.5 s.");
  });
  if ((camera.push ?? 0) > 0.06) throw new Error("LayerStage: push <= 0.06.");
  const t = useTheme();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const prog = Easing.inOut(Easing.sin)(frame / Math.max(1, durationInFrames - 1));
  const pan = (camera.pan ?? -60) * prog;
  const push = 1 + (camera.push ?? 0.03) * prog;
  const pIn = interpolate(frame, [sec(startSec, fps), sec(startSec + 0.6, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
  // arrive: every plane starts offset against the movement and settles (out-cubic)
  const pa = arrive ? interpolate(frame, [sec(arrive.atSec ?? 0, fps), sec((arrive.atSec ?? 0) + (arrive.sec ?? 0.45), fps)], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  const [avx, avy] = arrive ? { down: [0, -1], up: [0, 1], left: [1, 0], right: [-1, 0] }[arrive.dir] : [0, 0];
  const capOut = captionUntilSec !== undefined ? interpolate(frame, [sec(captionUntilSec, fps), sec(captionUntilSec + 0.5, fps)], [1, 0], clamp) : 1;
  const ax = avx * (arrive?.px ?? 0) * pa;
  const ay = avy * (arrive?.px ?? 0) * pa;
  // which worlds are showing, and how far each change has gone
  const showing = worlds.map((w, i) => {
    if (i === 0) return 1;
    return inOut(interpolate(frame, [sec(w.atSec, fps), sec(w.atSec + (w.sec ?? 1.2), fps)], [0, 1], clamp));
  });
  let curI = 0;
  showing.forEach((p, i) => {
    if (p > 0) curI = i;
  });
  // light on the carried things: from the previous world's light to the current one's
  const prevLight = worlds[Math.max(0, curI - 1)].light ?? "none";
  const curLight = worlds[curI].light ?? "none";
  const light: NearLight = { a: CAST[curI === 0 ? curLight : prevLight], b: CAST[curLight], p: curI === 0 ? 1 : showing[curI], key: curLight, from: LIGHT_DIR[worlds[curI].lightFrom ?? "top"] };
  const until = durationInFrames / fps;
  // a pan reads as a whip: the far plane blurs while it travels (peak 12 px mid-pan), which also hides the seam
  const whip = worlds.reduce((b, w, i) => (i && (w.change ?? "dissolve") === "pan" ? Math.max(b, Math.sin(Math.PI * showing[i]) * 12) : b), 0);
  // world labels un-wipe out before the next one wipes in (clear frames between them)
  const labelVis = worlds.map((w, i) => {
    const vin = i === 0 ? 1 : interpolate(showing[i], [0.6, 1], [0, 1], clamp);
    const vout = i + 1 < worlds.length ? interpolate(showing[i + 1], [0, 0.4], [1, 0], clamp) : 1;
    const vo = w.outSec !== undefined ? interpolate(frame, [sec(w.outSec, fps), sec(w.outSec + 0.4, fps)], [1, 0], clamp) : 1;
    return Math.min(vin, vout, vo);
  });
  return (
    <AbsoluteFill style={{ opacity: pIn, background: t.colors.canvas, overflow: "hidden" }}>
      {/* far plane */}
      <AbsoluteFill style={{ transform: `translate(${(pan * 0.35 + ax).toFixed(2)}px, ${ay.toFixed(2)}px) scale(${(1 + (push - 1) * 0.5).toFixed(4)})`, filter: whip > 0.2 ? `blur(${whip.toFixed(1)}px)` : undefined }}>
        {worlds.map((w, i) => {
          const p = showing[i];
          if (p <= 0) return null;
          const later = showing.slice(i + 1).some((q) => q >= 1);
          if (later) return null;
          const ch = w.change ?? "dissolve";
          let style: React.CSSProperties = {};
          if (i > 0 && ch === "dissolve") style = { opacity: p };
          if (i > 0 && ch === "wipe") style = { clipPath: `inset(0 0 0 ${((1 - p) * 100).toFixed(2)}%)` };
          if (i > 0 && ch === "pan") style = { transform: `translateX(${((1 - p) * 1920).toFixed(1)}px)` };
          // the outgoing world slides away on a pan
          const nxt = worlds[i + 1];
          if (nxt && (nxt.change ?? "dissolve") === "pan" && showing[i + 1] > 0) style = { ...style, transform: `translateX(${(-showing[i + 1] * 1920).toFixed(1)}px)` };
          return (
            <AbsoluteFill key={i} style={style}>
              <Sequence from={i === 0 ? 0 : sec(w.atSec, fps)} layout="none">
                <WorldPlate w={w} until={until - (i === 0 ? 0 : w.atSec)} />
              </Sequence>
              {(w.rings ?? []).map((r, j) => {
                const pr = interpolate(frame, [sec(r.atSec, fps), sec(r.atSec + (r.drawSec ?? 0.8), fps)], [0, 1], { ...clamp, easing: inOut });
                const po = r.untilSec !== undefined ? interpolate(frame, [sec(r.untilSec, fps), sec(r.untilSec + 0.4, fps)], [1, 0], clamp) : 1;
                if (pr <= 0 || po <= 0) return null;
                return (
                  <svg key={`r${j}`} width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: po, overflow: "visible" }}>
                    <path d={handCircle([r.x, r.y], r.r)} fill="none" stroke={t.colors.accent} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pr} />
                  </svg>
                );
              })}
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      {/* mid plane */}
      {mid ? <MidPlate m={mid} cam={[pan * 0.65, 0]} /> : null}
      {/* near plane: the carried things */}
      <AbsoluteFill style={{ transform: `translate(${ax.toFixed(2)}px, ${ay.toFixed(2)}px) scale(${push.toFixed(4)})` }}>
        {carry.map((c, i) => (
          <Carried key={i} c={c} light={light} cam={[pan, 0]} uid={`${uid}-${i}`} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, ${isLightTheme(t) ? "rgba(22,21,20,0.8)" : t.colors.dimMask} 100%)`, opacity: 0.55, pointerEvents: "none" }} />
      {overlay?.spectrum ? <SpectrumStrip {...overlay.spectrum} startSec={-1} /> : null}
      {labels.map((l, i) => (
        <Label key={`t${i}`} spec={l} />
      ))}
      {tag ? <DatelineTag {...tag} /> : null}
      {worlds.map((w, i) =>
        w.label && labelVis[i] > 0 ? (
          <div key={`l${i}`} style={{ position: "absolute", right: t.safe.x, bottom: t.safe.y, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, clipPath: `inset(0 ${((1 - labelVis[i]) * 100).toFixed(1)}% 0 0)`, opacity: Math.min(1, labelVis[i] * 2.5) }}>
            {w.today ? `TODAY · ${w.label}` : w.label}
          </div>
        ) : null,
      )}
      {caption && capOut > 0 ? <div style={{ position: "absolute", left: t.safe.x, bottom: t.safe.y, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, clipPath: capOut < 1 ? `inset(-4px -4px -4px ${((1 - capOut) * 100).toFixed(1)}%)` : undefined, opacity: Math.min(1, capOut * 2.5) }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};
