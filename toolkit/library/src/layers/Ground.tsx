import React, { useId } from "react";
import { AbsoluteFill, Img, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { isLightTheme, useTheme } from "../themes";
import { assetFile, useAsset, useAssets, useSourceFile } from "../registry";
import { chapterColour } from "../themes/chapterKey";

// The ground a shot sits on (Sam, 23 Nov 2026: "it gets a bit boring when you use only one background for all
// your frames"; study styles/BACKGROUNDS_STUDY_2026-11-23.md). The rule: no ground for more than 2 shots in a row,
// 4+ grounds an act, graphite at most ~40% of an act (scripts/ground-check.mjs). The ground follows the shot's job:
// place -> map, document or object -> paper, person or photo -> blur, evidence -> collage, data and light -> graphite.
//   paper   LOK-027 PaperDesk: cream sheet, fibre and grunge, warm edge, slow texture zoom, dust. The shot's theme
//           switches to its paper palette (dark ink), so every component reads on it.
//   map     MAP-011 LitMapGround: a registered period map, desaturated and dark under a soft spot, slow pan.
//   blur    LOK-028 BlurPlate: the shot's own photo, enlarged, blurred and darkened behind the sharp card.
//   collage VIS-050 CollageGround: 3-6 registered sources scattered, turned, blurred and dimmed.
//   inset   LOK-029 InsetGround: a deeper canvas with the act's chapter colour (LOK-026) as a low glow and slow dust.
export type GroundSpec =
  | { kind: "paper"; seed?: number; tone?: "light" | "dark"; tex?: { file: string; strength?: number } } // dark: a warm dark desk under a light pool (things lie on it); tex: a TEX-009 Texturelabs paper inside the desk (multiply, 0.1-0.3), never over the shot's ink (DIRECTOR rules 20-26; WCL-E01 act 1 v2)
  | { kind: "map"; srcId: string; file?: string; size: readonly [number, number]; focus?: readonly [number, number]; zoom?: number }
  | { kind: "blur"; srcId: string; file?: string; size: readonly [number, number]; focus?: readonly [number, number]; blurPx?: number; brightness?: number; zoom?: number } // blurPx/brightness/zoom: default 38 / 0.42 / 1.18
  | { kind: "collage"; items: { srcId: string; file?: string; size: readonly [number, number] }[]; seed?: number }
  | { kind: "inset"; act: number };

export const GROUND_IDS: Record<GroundSpec["kind"], string> = { paper: "LOK-027", map: "MAP-011", blur: "LOK-028", collage: "VIS-050", inset: "LOK-029" };

const Dust: React.FC<{ n: number; color: string; opacity: number; seed: number }> = ({ n, color, opacity, seed }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 6); // dust jumps every 6 frames, like film
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity }}>
      {Array.from({ length: n }, (_, i) => {
        const r = (k: string) => random(`dust${seed}-${i}-${k}-${step}`);
        return <circle key={i} cx={r("x") * 1920} cy={r("y") * 1080} r={0.6 + r("r") * 1.8} fill={color} />;
      })}
    </svg>
  );
};

const cover = (size: readonly [number, number], scale: number, focus: readonly [number, number] = [0.5, 0.5]) => {
  const s = Math.max(1920 / size[0], 1080 / size[1]) * scale;
  const w = size[0] * s;
  const h = size[1] * s;
  const left = Math.min(0, Math.max(1920 - w, 960 - focus[0] * w));
  const top = Math.min(0, Math.max(1080 - h, 540 - focus[1] * h));
  return { left, top, width: w, height: h };
};

export const Ground: React.FC<{ spec: GroundSpec }> = ({ spec }) => {
  useAssets([GROUND_IDS[spec.kind]]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  switch (spec.kind) {
    case "paper": {
      const z = 1 + 0.03 * p; // the texture zooms slowly, under a still layout
      if (spec.tone === "dark") {
        const warm = t.colors.kraft ?? t.colors.secondary;
        return (
          <AbsoluteFill style={{ background: t.colors.canvas }}>
            <AbsoluteFill style={{ background: warm, opacity: 0.1 }} />
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${z})` }}>
              <defs>
                <filter id={`dfib${uid}`}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.7 0.03" numOctaves={2} seed={spec.seed ?? 4} />
                  <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0 0.65  0 0 0 0.05 0" />
                </filter>
              </defs>
              <rect width={1920} height={1080} filter={`url(#dfib${uid})`} />
            </svg>
            <AbsoluteFill style={{ background: `radial-gradient(ellipse at 28% 18%, ${t.colors.ink} 0%, transparent 55%)`, opacity: 0.09 }} />
            <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, ${t.colors.dimMask} 100%)` }} />
          </AbsoluteFill>
        );
      }
      const tex = spec.tex;
      if (tex && ((tex.strength ?? 0.2) < 0 || (tex.strength ?? 0.2) > 0.3))
        throw new Error(`Ground paper tex strength ${tex.strength} is outside 0-0.3.`);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const texEntry = tex ? useAsset("TEX-009") : null;
      return (
        <AbsoluteFill style={{ background: t.colors.canvas }}>
          {tex && texEntry ? (
            <Img
              src={assetFile(texEntry, tex.file)}
              style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", transform: `scale(${z * 1.04})`, transformOrigin: "50% 50%", mixBlendMode: "multiply", opacity: tex.strength ?? 0.2, filter: "grayscale(0.6) sepia(0.25)" }}
            />
          ) : null}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${z})`, transformOrigin: "50% 50%" }}>
            <defs>
              <filter id={`fib${uid}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves={2} seed={spec.seed ?? 3} />
                <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.30  0 0 0 0.09 0" />
              </filter>
              <filter id={`gru${uid}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={(spec.seed ?? 3) + 7} />
                <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.34  0 0 0 0 0.26  0 0 0 0.9 -0.42" />
              </filter>
              <radialGradient id={`edge${uid}`} cx="50%" cy="48%" r="75%">
                <stop offset="55%" stopColor={t.colors.kraft ?? t.colors.secondary} stopOpacity={0} />
                <stop offset="100%" stopColor={t.colors.kraft ?? t.colors.secondary} stopOpacity={0.38} />
              </radialGradient>
            </defs>
            <rect width={1920} height={1080} filter={`url(#gru${uid})`} style={{ mixBlendMode: "multiply" }} />
            <rect width={1920} height={1080} filter={`url(#fib${uid})`} />
            <rect width={1920} height={1080} fill={`url(#edge${uid})`} style={{ mixBlendMode: "multiply" }} />
          </svg>
          <Dust n={70} color={t.colors.secondary} opacity={0.35} seed={spec.seed ?? 3} />
        </AbsoluteFill>
      );
    }
    case "map":
    case "blur": {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const src = useSourceFile(spec.srcId, spec.file);
      const isMap = spec.kind === "map";
      const z = isMap ? (spec.zoom ?? 1.25) * (1 + 0.035 * p) : ((spec as { zoom?: number }).zoom ?? 1.18) * (1 + 0.03 * p);
      const bl = spec.kind === "blur" ? spec : undefined;
      const box = cover(spec.size, z, spec.focus);
      const panX = isMap ? interpolate(p, [0, 1], [18, -18]) : 0;
      return (
        <AbsoluteFill style={{ background: t.colors.canvas, overflow: "hidden" }}>
          <Img
            src={src}
            style={{
              position: "absolute",
              left: box.left + panX,
              top: box.top,
              width: box.width,
              height: box.height,
              maxWidth: "none",
              filter: isMap ? "grayscale(0.85) sepia(0.25) contrast(1.1) brightness(0.42)" : `blur(${bl?.blurPx ?? 38}px) saturate(0.85) brightness(${bl?.brightness ?? 0.42})`,
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 30%, rgba(22,21,20,0.8) 100%)" }} />{/* a darkened picture vignettes to dark on every theme (dimMask is cream on light themes; act 2 v2 Gate 3) */}
        </AbsoluteFill>
      );
    }
    case "collage": {
      const n = spec.items.length;
      if (n < 3 || n > 6) throw new Error("CollageGround: 3-6 sources.");
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const srcs = spec.items.map((it) => useSourceFile(it.srcId, it.file));
      const seed = spec.seed ?? 5;
      const slots = [
        [180, 160], [760, 90], [1380, 200], [330, 620], [1050, 560], [1600, 700],
      ];
      return (
        <AbsoluteFill style={{ background: t.colors.canvas, overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `scale(${1.06 + 0.03 * p})`, filter: isLightTheme(t) ? "blur(7px) brightness(0.95) saturate(0.5)" : "blur(5px) brightness(0.5) saturate(0.6)", opacity: isLightTheme(t) ? 0.5 : 1 }}>
            {spec.items.map((it, i) => {
              const h = 520 + random(`cg${seed}-${i}-h`) * 160;
              const w = (h * it.size[0]) / it.size[1];
              const [x, y] = slots[(i * 2 + seed) % slots.length];
              const rot = (random(`cg${seed}-${i}-r`) - 0.5) * 18;
              return (
                <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - h / 3, width: w, height: h, transform: `rotate(${rot}deg)`, padding: 12, background: t.colors.panel, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
                  <Img src={srcs[i]} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.5) sepia(0.15)" }} />
                </div>
              );
            })}
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 35%, ${t.colors.dimMask} 100%)` }} />
        </AbsoluteFill>
      );
    }
    case "inset": {
      const c = chapterColour(spec.act);
      return (
        <AbsoluteFill style={{ background: t.colors.dimMask }}>
          <AbsoluteFill style={{ background: t.colors.canvas, opacity: 0.55 }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + 6 * Math.sin(p * 3)}% 42%, ${c} 0%, transparent 60%)`, opacity: 0.3 }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, ${t.colors.dimMask} 100%)` }} />
          <Dust n={90} color={t.colors.ink} opacity={0.22} seed={spec.act + 11} />
        </AbsoluteFill>
      );
    }
  }
};
