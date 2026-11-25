import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";

// TRN-023..029 (Sam, 25 Nov 2026: "Create more transitions if we can use them in further acts"): seven transitions
// that carry the series' own subjects (eyes, candlelight, the spectrum, paper, screens, Newton's hole in the shutter).
// Each takes the old shot (frozen by Episode.tsx) and the new one, starts at atSec and lasts about durSec.
type T = { from: React.ReactNode; to: React.ReactNode; atSec?: number; durSec?: number };
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const useSpan = (atSec: number, durSec: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const e = a + Math.max(6, sec(durSec, fps));
  return { frame, a, e, p: interpolate(frame, [a, e], [0, 1], clamp) };
};

// TRN-023 IrisBlink: two lids close over the old shot (0.35 s), a beat of dark, and open on the new one (0.4 s).
// Best use: into or out of an eye, a look, an examination. Lids are the theme's dark tone with a soft lash shadow.
export const IrisBlink: React.FC<T> = ({ from, to, atSec = 0, durSec = 0.9 }) => {
  useAsset("TRN-023");
  const { frame, a, e, p } = useSpan(atSec, durSec);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const close = p < 0.4 ? Easing.in(Easing.cubic)(p / 0.4) : p < 0.55 ? 1 : 1 - SLOW_OUT((p - 0.55) / 0.45);
  const lid = 560 * close; // each lid's reach (the frame is 1080 high)
  const curve = 220 * (1 - close * 0.6);
  const lidPath = (top: boolean) =>
    top
      ? `M -40 -20 L 1960 -20 L 1960 ${lid - curve} Q 960 ${lid + curve} -40 ${lid - curve} Z`
      : `M -40 1100 L 1960 1100 L 1960 ${1080 - lid + curve} Q 960 ${1080 - lid - curve} -40 ${1080 - lid + curve} Z`;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{p < 0.47 ? from : to}</AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="lidsh"><feGaussianBlur stdDeviation="14" /></filter>
        </defs>
        <path d={lidPath(true)} fill="rgba(0,0,0,0.45)" filter="url(#lidsh)" transform="translate(0 18)" />
        <path d={lidPath(false)} fill="rgba(0,0,0,0.45)" filter="url(#lidsh)" transform="translate(0 -18)" />
        <path d={lidPath(true)} fill="#15110E" />
        <path d={lidPath(false)} fill="#15110E" />
      </svg>
    </AbsoluteFill>
  );
};

// TRN-024 LightLeak: a warm film light leak flares in from one edge, burns the frame to near-white, and the new shot
// comes up through it. Best use: a jump in time, into or out of candlelight, a memory. Never on data or diagrams.
export const LightLeak: React.FC<T & { side?: "left" | "right"; warm?: string }> = ({ from, to, atSec = 0, durSec = 1.0, side = "left", warm = "#FF8A3D" }) => {
  useAsset("TRN-024");
  const { frame, a, e, p } = useSpan(atSec, durSec);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const burn = Math.sin(Math.PI * p); // 0 -> 1 -> 0
  const x = side === "left" ? -300 + 2500 * SLOW_OUT(p) : 2220 - 2500 * SLOW_OUT(p);
  const flick = 0.9 + 0.1 * random(`leak${frame}`);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{p < 0.5 ? from : to}</AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1300px at ${x}px 540px, ${warm} 0%, rgba(255,120,60,0.55) 35%, rgba(255,80,40,0) 70%)`, mixBlendMode: "screen", opacity: burn * flick }} />
      <AbsoluteFill style={{ background: "#FFF3E2", opacity: Math.max(0, burn - 0.35) * 1.3 }} />
    </AbsoluteFill>
  );
};

// TRN-025 SpectrumSweep: a band of the visible spectrum (violet to red, with soft edges) sweeps across the frame;
// the new shot is behind it. Best use: a turn about light or colour that the prism (TRN-019) has already used; at
// most one per act, never with the prism in the same act.
export const SpectrumSweep: React.FC<T & { dir?: "right" | "left" }> = ({ from, to, atSec = 0, durSec = 0.8, dir = "right" }) => {
  useAsset("TRN-025");
  const t = useTheme();
  const { frame, a, e, p } = useSpan(atSec, durSec);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const k = Easing.inOut(Easing.cubic)(p);
  const band = 520;
  const lead = -band + (1920 + 2 * band) * k; // the band's leading edge
  const edge = dir === "right" ? lead : 1920 - lead;
  const g = "linear-gradient(90deg, rgba(120,60,200,0) 0%, #6A3DC8 12%, #2F6BFF 28%, #19B5A5 44%, #8BD13A 58%, #FFD23F 70%, #FF8A2A 82%, #E8352B 92%, rgba(232,53,43,0) 100%)";
  const oldClip = dir === "right" ? `inset(0 0 0 ${Math.max(0, edge - band / 2)}px)` : `inset(0 ${Math.max(0, 1920 - edge - band / 2)}px 0 0)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{to}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: oldClip, background: t.colors.canvas }}>{from}</AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: edge - band, width: band, background: g, transform: dir === "left" ? "scaleX(-1)" : undefined, opacity: 0.92, mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: edge - band, width: band, background: g, transform: dir === "left" ? "scaleX(-1)" : undefined, opacity: 0.55, filter: "blur(18px)", mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// TRN-026 TornPaper: the old shot is torn in two along a ragged diagonal; the halves pull apart (up-left and
// down-right, a slight turn each) and the new shot lies beneath. Best use: one document or paper scene to the next
// (letters, pages, maps), in the paper world; never on footage of today.
export const TornPaper: React.FC<T & { seed?: number }> = ({ from, to, atSec = 0, durSec = 0.8, seed = 3 }) => {
  useAsset("TRN-026");
  const t = useTheme();
  const { frame, a, e, p } = useSpan(atSec, durSec);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const k = Easing.in(Easing.quad)(p);
  // a jagged line from (0, 760) to (1920, 320)
  const pts: [number, number][] = [];
  for (let i = 0; i <= 48; i++) {
    const x = (1920 * i) / 48;
    const y = 760 - (440 * i) / 48 + (random(`tear${seed}-${i}`) - 0.5) * 46;
    pts.push([x, y]);
  }
  const line = pts.map(([x, y]) => `${x.toFixed(0)}px ${y.toFixed(0)}px`).join(", ");
  const topPoly = `polygon(0px 0px, 1920px 0px, ${[...pts].reverse().map(([x, y]) => `${x.toFixed(0)}px ${y.toFixed(0)}px`).join(", ")})`;
  const botPoly = `polygon(${line}, 1920px 1080px, 0px 1080px)`;
  const edge = t.colors.panel;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill>{to}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: topPoly, transform: `translate(${-260 * k}px, ${-520 * k}px) rotate(${-4 * k}deg)`, filter: `drop-shadow(0 10px 18px rgba(0,0,0,${0.35 * (1 - k)}))` }}>
        <AbsoluteFill style={{ background: edge }} />
        <AbsoluteFill style={{ transform: "translate(0, -5px)" }}>{from}</AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: botPoly, transform: `translate(${260 * k}px, ${520 * k}px) rotate(${3 * k}deg)`, filter: `drop-shadow(0 -10px 18px rgba(0,0,0,${0.35 * (1 - k)}))` }}>
        <AbsoluteFill style={{ background: edge }} />
        <AbsoluteFill style={{ transform: "translate(0, 5px)" }}>{from}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// TRN-027 RGBSplit: the old shot splits into its red, green and blue copies (added light), which slide apart and
// come back together as the new shot. Best use: screens, pixels, how three lights make every colour (WCL-E01 act 7,
// WCL-E02); at most one per act. The three copies sum back to the true picture when aligned.
const Channel: React.FC<{ m: string; dx: number; dy: number; id: string; children: React.ReactNode }> = ({ m, dx, dy, id, children }) => (
  <AbsoluteFill style={{ mixBlendMode: "screen", transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`, filter: `url(#${id})` }}>
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id={id} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={m} /></filter>
    </svg>
    {children}
  </AbsoluteFill>
);
export const RGBSplit: React.FC<T> = ({ from, to, atSec = 0, durSec = 0.9 }) => {
  useAsset("TRN-027");
  const { frame, a, e, p } = useSpan(atSec, durSec);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const d = 90 * Math.sin(Math.PI * p);
  const shot = p < 0.5 ? from : to;
  const R = "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0";
  const G = "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0";
  const B = "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Channel m={R} dx={-d} dy={0} id="rgbR">{shot}</Channel>
      <Channel m={G} dx={0} dy={d * 0.35} id="rgbG">{shot}</Channel>
      <Channel m={B} dx={d} dy={0} id="rgbB">{shot}</Channel>
    </AbsoluteFill>
  );
};

// TRN-028 WhipPan: a fast camera pan, the old shot rushing out with heavy motion blur and the new rushing in.
// Best use: inside a burst (ENERGY rule 1), between two shots of the same scene or place; at most two per act and
// never twice in a row.
export const WhipPan: React.FC<T & { dir?: "left" | "right" }> = ({ from, to, atSec = 0, durSec = 0.5, dir = "left" }) => {
  useAsset("TRN-028");
  const { frame, a, e, p } = useSpan(atSec, durSec);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const k = Easing.inOut(Easing.cubic)(p);
  const s = dir === "left" ? -1 : 1;
  const blur = 40 * Math.sin(Math.PI * p);
  const off = 1920 * k * s;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="whip"><feGaussianBlur stdDeviation={`${blur.toFixed(1)} 0`} /></filter>
      </svg>
      <AbsoluteFill style={{ transform: `translateX(${off.toFixed(1)}px)`, filter: "url(#whip)" }}>{from}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(off - 1920 * s).toFixed(1)}px)`, filter: "url(#whip)" }}>{to}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// TRN-029 PinholeProject: the old shot closes to a bright point (a hole in a shutter), and the new shot opens out of
// it upside-down, as a camera obscura throws it, and turns upright as it settles. Best use: Newton's dark room and
// any 'light through a small hole' turn (WCL-E01 acts 4-5, later episodes on cameras and eyes); at most one per act.
export const PinholeProject: React.FC<T & { at?: readonly [number, number] }> = ({ from, to, atSec = 0, durSec = 1.1, at = [960, 540] }) => {
  useAsset("TRN-029");
  const { frame, a, e, p } = useSpan(atSec, durSec);
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const R = Math.hypot(Math.max(at[0], 1920 - at[0]), Math.max(at[1], 1080 - at[1]));
  const [x, y] = at;
  if (p < 0.42) {
    const k = Easing.in(Easing.cubic)(p / 0.42);
    const r = R * (1 - k) + 6;
    return (
      <AbsoluteFill style={{ background: "#0B0908" }}>
        <AbsoluteFill style={{ clipPath: `circle(${r.toFixed(1)}px at ${x}px ${y}px)` }}>{from}</AbsoluteFill>
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,246,220,${0.9 * k}) 0px, rgba(255,246,220,0) ${18 + 40 * k}px)` }} />
      </AbsoluteFill>
    );
  }
  const k = interpolate(p, [0.48, 1], [0, 1], { ...clamp, easing: SLOW_OUT });
  const r = 6 + R * k;
  const rot = 180 * (1 - Easing.inOut(Easing.cubic)(interpolate(p, [0.6, 1], [0, 1], clamp)));
  return (
    <AbsoluteFill style={{ background: "#0B0908" }}>
      <AbsoluteFill style={{ clipPath: `circle(${r.toFixed(1)}px at ${x}px ${y}px)` }}>
        <AbsoluteFill style={{ transform: `rotate(${rot.toFixed(1)}deg)`, transformOrigin: `${x}px ${y}px` }}>{to}</AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,246,220,${0.9 * (1 - k)}) 0px, rgba(255,246,220,0) 60px)` }} />
    </AbsoluteFill>
  );
};
