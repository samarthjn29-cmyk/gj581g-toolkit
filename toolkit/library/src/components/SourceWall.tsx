import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource } from "../registry";
import { reveal, sec, SLOW_OUT } from "../motion";
import { CropImage, type Rect } from "../layers/CropImage";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-026 SourceWall (Planned 22 Nov 2026 from the motion-ideas study; built 22 Nov 2026): several real sources
// (pages, prints, letters) pinned in a row on one slightly tilted wall. The camera glides along the wall; one
// source is lit at a time (the rest dim), each with its own mono label (what it is, the year).
// Ours: a 10-14 degree turn, a soft light pool on the lit piece, the glide eased between pieces on their words.
// Best use: a story told across several sources in turn (Newton's letters 1672-1678; the pages of an account).
// Limit: max 3 beats per episode (register K); 3-6 pieces; real sources only, each labelled. Not for: a single source.
type Item = {
  srcId: string;
  imgSize: readonly [number, number];
  crop?: Rect;
  label: string;
  atSec: number;
  h?: number;
};
export type SourceWallProps = {
  items: Item[];
  turnDeg?: number;
  source?: string;
  tag?: DatelineTagProps;
  startSec?: number;
};

export const SourceWall: React.FC<SourceWallProps> = ({
  items,
  turnDeg = 12,
  source,
  tag,
  startSec = 0,
}) => {
  useAssets(["VIS-026", "MOT-001", "MOT-002"]);
  if (items.length < 3 || items.length > 6)
    throw new Error("SourceWall: 3-6 sources.");
  if (turnDeg < 6 || turnDeg > 16)
    throw new Error("SourceWall: wall turn outside 6-16 degrees.");
  const srcs = items.map((it) => useSource(it.srcId)); // eslint-disable-line react-hooks/rules-of-hooks
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gap = 90;
  const sizes = items.map((it) => {
    const c = it.crop ?? ([0, 0, it.imgSize[0], it.imgSize[1]] as const);
    const h = it.h ?? 620;
    return { w: Math.round((h * c[2]) / c[3]), h };
  });
  const xs: number[] = [];
  sizes.reduce((x, s) => (xs.push(x), x + s.w + 28 + gap), 0);
  const centres = xs.map((x, i) => x + (sizes[i].w + 28) / 2);
  // Which piece is lit, and where the camera is: eased between pieces over 1.2 s from each piece's atSec.
  const now = frame / fps;
  let lit = 0;
  items.forEach((it, i) => {
    if (now >= it.atSec) lit = i;
  });
  let camX = centres[0];
  items.forEach((it, i) => {
    if (i === 0) return;
    const a = sec(it.atSec, fps);
    const p = interpolate(
      frame,
      [a - sec(0.2, fps), a + sec(1.0, fps)],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT },
    );
    camX += (centres[i] - centres[i - 1]) * p;
  });
  const pIn = reveal(frame, fps, startSec, t.motion.enterSec);
  return (
    <AbsoluteFill
      style={{ opacity: pIn, perspective: 1800, perspectiveOrigin: "50% 45%" }}
    >
      <div
        style={{
          position: "absolute",
          left: 960 - camX,
          top: 170,
          transformStyle: "preserve-3d",
          transform: `rotateY(${-turnDeg}deg)`,
          transformOrigin: `${camX}px 300px`,
        }}
      >
        {items.map((it, i) => {
          const s = sizes[i];
          const a = sec(it.atSec, fps);
          const on = interpolate(
            frame,
            [a - sec(0.2, fps), a + sec(0.5, fps)],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const isLit = i === lit;
          const light = isLit ? 0.45 + 0.55 * on : 0.45;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: xs[i],
                top: (620 - s.h) / 2,
              }}
            >
              <div
                style={{
                  padding: 14,
                  background: t.colors.panel,
                  borderRadius: 4,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                  filter: `brightness(${light})`,
                }}
              >
                <CropImage
                  src={srcs[i]}
                  imgSize={it.imgSize}
                  crop={it.crop}
                  width={s.w}
                  height={s.h}
                  filter="grayscale(0.55) sepia(0.12) contrast(1.06) brightness(0.94)"
                />
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: t.fonts.mono,
                  fontSize: 26,
                  letterSpacing: 3,
                  color: isLit ? t.colors.ink : t.colors.secondary,
                  opacity: 0.4 + 0.6 * (isLit ? on : 0.5),
                }}
              >
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
      {source ? (
        <div
          style={{
            position: "absolute",
            left: t.safe.x,
            bottom: t.safe.y,
            fontFamily: t.fonts.mono,
            fontSize: 22,
            letterSpacing: 1.2,
            color: t.colors.secondary,
            background: t.colors.chip,
            padding: "6px 12px",
            borderRadius: 4,
          }}
        >
          {source}
        </div>
      ) : null}
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
