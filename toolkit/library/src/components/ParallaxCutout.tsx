import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme, lightTone } from "../themes";
import { useAssets, useSource, useSourceFile } from "../registry";
import { drift, reveal, rise, sec, slide, SLOW_OUT } from "../motion";
import { interpolate } from "remotion";
import { CropImage, type Rect } from "../layers/CropImage";

// VIS-004 ParallaxCutout (beat type 4: hero photo or subject, calm).
// Three planes drifting at different speeds: a blurred background picture, the headline, and the photo card.
export type ParallaxCutoutProps = {
  bg: { srcId: string; imgSize: readonly [number, number]; crop?: Rect };
  fg: { srcId: string; imgSize: readonly [number, number]; crop?: Rect };
  kicker: string;
  headline: string;
  caption?: string;
  // TRN-008 TraceToPicture (studied Chris Moran's short on Vox's seamless transitions; analysis only): the
  // photo card first shows a line trace of the picture (a registered file of the same source, made with
  // scripts/trace.py), drawn on by a soft diagonal wipe, then the picture fades up under it and the lines go.
  trace?: { file: string; atSec: number; drawSec?: number; fillSec?: number };
  startSec?: number;
};

const Trace: React.FC<{ srcId: string; file: string; imgSize: readonly [number, number]; crop?: Rect; w: number; h: number; p: number; out: number }> = ({ srcId, file, imgSize, crop, w, h, p, out }) => {
  const t = useTheme();
  const src = useSourceFile(srcId, file);
  // the trace file is a mask: lines opaque. Wipe: a soft diagonal edge sweeping from top-left.
  const edge = -40 + p * 180;
  const wipe = `linear-gradient(135deg, #000 ${edge - 25}%, transparent ${edge}%)`;
  return (
    <div style={{ position: "absolute", inset: 14, opacity: out }}>
      <div style={{ position: "absolute", inset: 0, background: t.colors.panel }} />
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: wipe, maskImage: wipe }}>
        <MaskedInk src={src} imgSize={imgSize} crop={crop} w={w} h={h} color={t.colors.ink} />
      </div>
    </div>
  );
};

// The trace mask filled with one colour, cropped exactly like the photo.
const MaskedInk: React.FC<{ src: string; imgSize: readonly [number, number]; crop?: Rect; w: number; h: number; color: string }> = ({ src, imgSize, crop, w, h, color }) => {
  const c = crop ?? ([0, 0, imgSize[0], imgSize[1]] as const);
  const s = Math.max(w / c[2], h / c[3]);
  const ox = (w - c[2] * s) / 2 - c[0] * s;
  const oy = (h - c[3] * s) / 2 - c[1] * s;
  const m = `url(${src})`;
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: ox, top: oy, width: imgSize[0] * s, height: imgSize[1] * s, background: color, WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
    </div>
  );
};

export const ParallaxCutout: React.FC<ParallaxCutoutProps> = ({ bg, fg, kicker, headline, caption, trace, startSec = 0 }) => {
  useAssets(["VIS-004", "MOT-001", "MOT-002", ...(trace ? ["TRN-008"] : [])]);
  const bgSrc = useSource(bg.srcId);
  const fgSrc = useSource(fg.srcId);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames: d } = useVideoConfig();
  const st = t.motion.staggerSec;
  const pFg = reveal(frame, fps, startSec, t.motion.enterSec);
  const pKick = reveal(frame, fps, startSec + st * 2, t.motion.enterSec);
  const pHead = reveal(frame, fps, startSec + st * 3, t.motion.enterSec);
  const cardW = 600;
  const cardH = 760;
  const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT } as const;
  const tA = trace ? sec(trace.atSec, fps) : 0;
  const tD = trace ? sec(trace.drawSec ?? 0.9, fps) : 0;
  const tF = trace ? sec(trace.fillSec ?? 0.6, fps) : 0;
  const pTrace = trace ? interpolate(frame, [tA, tA + tD], [0, 1], ease) : 1;
  const pPic = trace ? interpolate(frame, [tA + tD * 0.8, tA + tD * 0.8 + tF], [0, 1], ease) : 1;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.06 * drift(frame, d)}) translateX(${slide(frame, d, -24)}px)` }}>
        <CropImage
          src={bgSrc}
          imgSize={bg.imgSize}
          crop={bg.crop}
          width={1920}
          height={1080}
          filter="blur(14px) grayscale(0.5) brightness(0.42)"
        />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: t.safe.x, top: 330, width: 900, transform: `translateX(${slide(frame, d, 14)}px)` }}>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 30, letterSpacing: 3, color: t.colors.accent, marginBottom: 22, ...rise(pKick, 16) }}>
          {kicker}
        </div>
        <div
          style={{
            fontFamily: t.fonts.headline,
            fontWeight: t.fonts.headlineWeight,
            letterSpacing: t.fonts.headlineTracking,
            fontSize: 112,
            lineHeight: 1.02,
            color: lightTone(t), // the headline sits on the dark blurred portrait plate in every theme
            ...rise(pHead),
          }}
        >
          {headline}
        </div>
        {caption ? (
          <div style={{ fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 36, color: t.colors.secondary, marginTop: 28, ...rise(pHead, 20) }}>
            {caption}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          right: t.safe.x + 40,
          top: (1080 - cardH) / 2,
          padding: 14,
          background: t.colors.panel,
          borderRadius: 6,
          boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
          transform: `translateX(${slide(frame, d, -36)}px) scale(${drift(frame, d, 0.02)})`,
          ...{ opacity: pFg },
        }}
      >
        <div style={{ transform: `translateY(${(1 - pFg) * 40}px)`, opacity: pPic }}>
          <CropImage src={fgSrc} imgSize={fg.imgSize} crop={fg.crop} width={cardW - 28} height={cardH - 28} filter="contrast(1.04)" />
        </div>
        {trace ? <Trace srcId={fg.srcId} file={trace.file} imgSize={fg.imgSize} crop={fg.crop} w={cardW - 28} h={cardH - 28} p={pTrace} out={1 - pPic} /> : null}
      </div>
    </AbsoluteFill>
  );
};
