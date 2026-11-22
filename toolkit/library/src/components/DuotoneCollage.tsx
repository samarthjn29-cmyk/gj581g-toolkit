import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSourceFile } from "../registry";
import { drift, reveal, rise } from "../motion";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-028 DuotoneCollage (Sam, 22 Nov 2026: "Maybe we can use collage on a few of our frames").
// Torn paper pieces laid on the canvas, slightly turned, each a registered source re-screened as ONE ink
// (scripts/halftone.py: dots for photos and mezzotints, a clean line mask for engraved plates and text).
// The pieces share two theme colours (paper = ink token, dots = canvas token), so old scans of mixed quality
// read as one set and low resolution is hidden by the screen. Paper scraps in data colours (e.g. the swatch
// colours) can sit between them. Every picture piece carries a caption chip (no picture on screen alone).
// Calm: pieces enter one by one (0.75 s, a 30 px slide, no overshoot); the whole set drifts <= 2%.
// Own build (studied Chris Moran's short on collage animation; analysis only).
export type CollagePiece = {
  srcId?: string; // a registered source; omit for a plain paper scrap
  file?: string; // the source's halftone/line file (must be listed on the entry)
  imgSize?: readonly [number, number]; // the file's pixels
  x: number; // centre, frame pixels
  y: number;
  w: number; // piece width in frame pixels (height follows the file, or `h` for a scrap)
  h?: number;
  rot?: number; // degrees
  color?: string; // scrap colour (data); picture pieces use the theme paper
  atSec: number;
  caption?: string;
  captionAt?: "top" | "bottom"; // put it on top when a later piece covers the bottom edge
  seed?: number;
};
export type DuotoneCollageProps = {
  pieces: CollagePiece[];
  lines?: { text: string; atSec: number; style?: "serif" | "mono" }[];
  tag?: DatelineTagProps;
  startSec?: number;
};

const rand = (i: number, seed: number) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// A torn-edge polygon in percentages of the piece: small seeded bites along each side.
function tornClip(seed: number): string {
  const pts: string[] = [];
  const n = 14;
  const edge = (i: number) => 0.6 + rand(i, seed) * 1.6; // % inset of the tear
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${edge(i)}%`);
  for (let i = 0; i <= n; i++) pts.push(`${100 - edge(i + 40)}% ${(i / n) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - edge(i + 80)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${edge(i + 120)}% ${(i / n) * 100}%`);
  return `polygon(${pts.join(", ")})`;
}

// One ink: the source's mask file filled with the canvas token.
const Ink: React.FC<{ srcId: string; file?: string }> = ({ srcId, file }) => {
  const t = useTheme();
  const src = useSourceFile(srcId, file);
  const m = `url(${src})`;
  return (
    <div style={{ position: "absolute", inset: 0, background: t.colors.canvas, WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
  );
};

const Piece: React.FC<{ p: CollagePiece; i: number }> = ({ p, i }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = p.h ?? (p.imgSize ? (p.w * p.imgSize[1]) / p.imgSize[0] : p.w);
  const k = reveal(frame, fps, p.atSec, t.motion.enterSec);
  const pc = reveal(frame, fps, p.atSec + 0.4, t.motion.enterSec);
  const paper = p.color ?? t.colors.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - p.w / 2,
        top: p.y - h / 2,
        width: p.w,
        height: h,
        opacity: k,
        transform: `translate(${(1 - k) * 30 * (i % 2 ? -1 : 1)}px, ${(1 - k) * 18}px) rotate(${p.rot ?? 0}deg)`,
        filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.45))",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: paper, clipPath: tornClip(p.seed ?? i + 1) }}>
        {p.srcId ? <Ink srcId={p.srcId} file={p.file} /> : null}
      </div>
      {p.caption ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            ...(p.captionAt === "top" ? { top: -22 } : { bottom: -22 }),
            padding: "8px 14px",
            background: t.colors.chip,
            color: t.colors.ink,
            fontFamily: t.fonts.mono,
            fontSize: 22,
            letterSpacing: 3,
            whiteSpace: "nowrap",
            borderRadius: 4,
            ...rise(pc, 10),
          }}
        >
          {p.caption}
        </div>
      ) : null}
    </div>
  );
};

export const DuotoneCollage: React.FC<DuotoneCollageProps> = ({ pieces, lines = [], tag, startSec = 0 }) => {
  useAssets(["VIS-028", "LOK-017", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6) }}>
      <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        {pieces.map((p, i) => (
          <Piece key={i} p={p} i={i} />
        ))}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: t.safe.x, top: 0, bottom: 0, width: 760, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {lines.map((l) => {
          const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
          const mono = l.style === "mono";
          return (
            <div
              key={l.text}
              style={{
                fontFamily: mono ? t.fonts.mono : t.fonts.headline,
                fontWeight: mono ? 500 : t.fonts.headlineWeight,
                letterSpacing: mono ? 3 : t.fonts.headlineTracking,
                fontSize: mono ? 26 : 84,
                lineHeight: mono ? 1.45 : 1.05,
                color: mono ? t.colors.secondary : t.colors.ink,
                marginTop: mono ? 28 : 0,
                ...rise(p, mono ? 12 : 26),
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
