import React, { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSourceFile } from "../registry";
import { drift, reveal, rise, sec, SLOW_OUT } from "../motion";
import { CropImage, cropToBox, type Rect } from "../layers/CropImage";
import { ScreenStrokes, type StrokesSpec } from "../layers/ScreenStrokes";

// VIS-001 ArchivalScanCard (beat type 1: document or quote proof, calm).
// A real scan on a tray, a highlighter sweeping across the words that matter (image-pixel coordinates),
// the line set as a serif quote with an accent underline, and a mono source tag.
export type ArchivalScanCardProps = {
  srcId: string;
  file?: string; // one page of a multi-page source (e.g. SRC-058, six pages of Newton's 1672 letter)
  imgSize: readonly [number, number];
  crop: Rect;
  highlights: { box: Rect; atSec: number; dimAtSec?: number; dimTo?: number }[]; // dimAtSec: this highlight fades to dimTo (default 0.4) over 0.5 s
  quote: string;
  source: string;
  side?: "left" | "right";
  // VIS-029 ContrastCallout (studied Chris Moran's short "How to guide your viewer's eye using contrast";
  // analysis only): from atSec the rest of the page dims and only the highlighted lines stay bright.
  callout?: { atSec: number; dim?: number; keep?: Rect[] }; // keep: boxes that stay bright without a highlight (WCL-E01 act 5 B)
  quoteMarks?: boolean; // false for a book title (not a quote)
  notes?: { text: string; atSec: number; untilSec?: number; accent?: boolean }[]; // mono notes under the source tag, on their words
  quoteAtSec?: number; // the quote column comes in on its spoken word, not with the card (default: with the card)
  strokes?: StrokesSpec; // TEX-008 ScreenStrokes over the held page, kept off the highlighted words
  startSec?: number;
};

export const ArchivalScanCard: React.FC<ArchivalScanCardProps> = ({
  srcId,
  file,
  imgSize,
  crop,
  highlights,
  quote,
  source,
  side = "left",
  callout,
  quoteMarks = true,
  notes = [],
  strokes,
  quoteAtSec,
  startSec = 0,
}) => {
  useAssets(["VIS-001", "MOT-001", "MOT-002", ...(callout ? ["VIS-029"] : []), ...(strokes ? ["TEX-008"] : [])]);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const src = useSourceFile(srcId, file);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const st = t.motion.staggerSec;

  const cardH = 860;
  const cardW = Math.min(900, Math.round((cardH * crop[2]) / crop[3]));
  const pad = 18;
  const innerW = cardW - pad * 2;
  const innerH = cardH - pad * 2;
  const { map } = cropToBox(crop, innerW, innerH, "cover");
  const cardX = side === "left" ? t.safe.x : 1920 - t.safe.x - cardW;
  const textX = side === "left" ? cardX + cardW + 90 : t.safe.x;
  const textW = 1920 - t.safe.x * 2 - cardW - 90;

  const pCard = reveal(frame, fps, startSec, t.motion.enterSec);
  const pQuote = reveal(frame, fps, quoteAtSec ?? startSec + st * 2, t.motion.enterSec);
  const pLine = reveal(frame, fps, startSec + st * 2 + t.motion.enterSec, 0.7);
  const pTag = reveal(frame, fps, startSec + st * 4, t.motion.enterSec);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: (1080 - cardH) / 2,
          width: cardW,
          height: cardH,
          padding: pad,
          background: t.colors.panel,
          borderRadius: 6,
          boxShadow: "0 30px 60px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.35)",
          ...rise(pCard, 36),
        }}
      >
        <div style={{ transform: `scale(${drift(frame, durationInFrames)})`, transformOrigin: "50% 40%" }}>
          <CropImage
            src={src}
            imgSize={imgSize}
            crop={crop}
            width={innerW}
            height={innerH}
            filter="grayscale(0.55) sepia(0.12) contrast(1.06) brightness(0.94)"
          >
            {highlights.map((h, i) => {
              const r = map(h.box);
              const a = sec(h.atSec, fps);
              const p = interpolate(frame, [a, a + sec(0.7, fps)], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: SLOW_OUT,
              });
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: r.left - 6,
                    top: r.top - 4,
                    width: (r.width + 12) * p,
                    height: r.height + 8,
                    background: t.colors.accentSoft,
                    mixBlendMode: "multiply",
                    borderRadius: 3,
                    opacity: h.dimAtSec === undefined ? 1 : interpolate(frame, [sec(h.dimAtSec, fps), sec(h.dimAtSec + 0.5, fps)], [1, h.dimTo ?? 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  }}
                />
              );
            })}
            {strokes ? <ScreenStrokes width={innerW} height={innerH} spec={{ mode: "shadow", ...strokes }} holes={highlights.map((h) => map(h.box))} /> : null}
            {callout ? (
              <svg width={innerW} height={innerH} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
                <defs>
                  <mask id={`co${uid}`}>
                    <rect width={innerW} height={innerH} fill="white" />
                    {highlights
                      .filter((h) => frame >= sec(h.atSec, fps))
                      .map((h, i) => {
                        const r = map(h.box);
                        return <rect key={i} x={r.left - 10} y={r.top - 8} width={r.width + 20} height={r.height + 16} rx={4} fill="black" />;
                      })}
                    {(callout.keep ?? []).map((b, i) => {
                      const r = map(b);
                      return <rect key={`k${i}`} x={r.left - 10} y={r.top - 8} width={r.width + 20} height={r.height + 16} rx={4} fill="black" />;
                    })}
                  </mask>
                </defs>
                <rect
                  width={innerW}
                  height={innerH}
                  fill={t.colors.dimMask}
                  mask={`url(#co${uid})`}
                  opacity={(callout.dim ?? 0.7) * reveal(frame, fps, callout.atSec, 0.6)}
                />
              </svg>
            ) : null}
          </CropImage>
        </div>
      </div>
      <div style={{ position: "absolute", left: textX, top: 300, width: textW }}>
        <div
          style={{
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 58,
            lineHeight: 1.2,
            color: t.colors.ink,
            ...rise(pQuote),
          }}
        >
          {quoteMarks ? `“${quote}”` : quote}
        </div>
        <div style={{ height: 4, width: 260 * pLine, background: t.colors.accent, marginTop: 34, borderRadius: 2 }} />
        <div
          style={{
            display: "inline-block",
            marginTop: 30,
            fontFamily: t.fonts.mono,
            fontSize: 28,
            letterSpacing: 1.2,
            color: t.colors.secondary,
            background: t.colors.chip,
            padding: "8px 14px",
            borderRadius: 4,
            ...rise(pTag, 16),
          }}
        >
          {source}
        </div>
        {notes.map((n) => {
          const pn = reveal(frame, fps, n.atSec, t.motion.enterSec);
          const on = n.untilSec !== undefined ? 1 - reveal(frame, fps, n.untilSec, 0.6) : 1;
          if (pn * on <= 0) return null;
          return (
            <div key={`${n.text}${n.atSec}`} style={{ marginTop: 22, fontFamily: t.fonts.mono, fontSize: 30, letterSpacing: 3, color: n.accent ? t.colors.accent : t.colors.ink, ...rise(pn * on, 14) }}>
              {n.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
