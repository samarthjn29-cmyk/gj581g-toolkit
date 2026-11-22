import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource } from "../registry";
import { drift, reveal, rise, slide } from "../motion";
import { CropImage, type Rect } from "../layers/CropImage";

// VIS-004 ParallaxCutout (beat type 4: hero photo or subject, calm).
// Three planes drifting at different speeds: a blurred background picture, the headline, and the photo card.
export type ParallaxCutoutProps = {
  bg: { srcId: string; imgSize: readonly [number, number]; crop?: Rect };
  fg: { srcId: string; imgSize: readonly [number, number]; crop?: Rect };
  kicker: string;
  headline: string;
  caption?: string;
  startSec?: number;
};

export const ParallaxCutout: React.FC<ParallaxCutoutProps> = ({ bg, fg, kicker, headline, caption, startSec = 0 }) => {
  useAssets(["VIS-004", "MOT-001", "MOT-002"]);
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
        <div style={{ fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 3, color: t.colors.accent, marginBottom: 22, ...rise(pKick, 16) }}>
          {kicker}
        </div>
        <div
          style={{
            fontFamily: t.fonts.headline,
            fontWeight: t.fonts.headlineWeight,
            letterSpacing: t.fonts.headlineTracking,
            fontSize: 112,
            lineHeight: 1.02,
            color: t.colors.ink,
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
        <div style={{ transform: `translateY(${(1 - pFg) * 40}px)` }}>
          <CropImage src={fgSrc} imgSize={fg.imgSize} crop={fg.crop} width={cardW - 28} height={cardH - 28} filter="contrast(1.04)" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
