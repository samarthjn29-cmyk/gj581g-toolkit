import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { lock } from "../motion";
import { CropImage, type Rect } from "../layers/CropImage";
import { SourceImage } from "../layers/SourceImage";

// VIS-003 HeadlineMatchCut + MOT-004 cadence (beat type 3: scale or media frenzy, rare: once a chapter at most).
// Pages or clippings swap every 6-8 frames (calm version) while one keyword stays locked at the centre.
export type HeadlineMatchCutProps = {
  cards: { srcId: string; imgSize: readonly [number, number]; crop?: Rect }[];
  keyword: string;
  framesPerCard?: number;
  startSec?: number;
};

export const HeadlineMatchCut: React.FC<HeadlineMatchCutProps> = ({ cards, keyword, framesPerCard = 7, startSec = 0 }) => {
  useAssets(["VIS-003", "MOT-004", "MOT-003"]);
  if (framesPerCard < 6 || framesPerCard > 8) throw new Error("Calm version: 6-8 frames a card.");
  if (cards.length < 2) throw new Error("HeadlineMatchCut needs at least two cards.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.floor(frame / framesPerCard);
  const pLock = lock(frame, fps, startSec + 0.1);
  const boxW = 1240;
  const boxH = 860;
  // the current card on top of the two before it, so the swaps read as a stack of clippings
  const layers = [2, 1, 0].map((back) => step - back).filter((s) => s >= 0);

  return (
    <AbsoluteFill>
      {layers.map((s) => {
        const c = cards[s % cards.length];
        const rot = (random(`hmc-r-${s}`) - 0.5) * 6;
        const dx = (random(`hmc-x-${s}`) - 0.5) * 80;
        const dy = (random(`hmc-y-${s}`) - 0.5) * 50;
        const depth = step - s;
        return (
          <div
            key={s}
            style={{
              position: "absolute",
              left: (1920 - boxW) / 2 + dx,
              top: (1080 - boxH) / 2 + dy,
              transform: `rotate(${rot}deg) scale(${1 - depth * 0.03})`,
              boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
              filter: `brightness(${1 - depth * 0.18})`,
            }}
          >
            <SourceImage srcId={c.srcId}>
              {(src) => (
                <CropImage
                  src={src}
                  imgSize={c.imgSize}
                  crop={c.crop}
                  width={boxW}
                  height={boxH}
                  filter="grayscale(0.7) contrast(1.08) brightness(0.9)"
                />
              )}
            </SourceImage>
          </div>
        );
      })}
      <AbsoluteFill style={{ background: t.colors.dimMask, opacity: 0.35 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: t.fonts.headline,
            fontWeight: t.fonts.headlineWeight,
            letterSpacing: t.fonts.headlineTracking,
            fontSize: 88,
            color: t.colors.canvas,
            background: t.colors.accent,
            padding: "14px 34px 18px",
            borderRadius: 6,
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
            opacity: pLock,
            transform: `scale(${1.12 - 0.12 * pLock})`,
          }}
        >
          {keyword}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
