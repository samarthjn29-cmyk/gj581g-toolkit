import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource } from "../registry";
import { drift, reveal, rise, sec, SLOW_OUT } from "../motion";
import { CropImage, cropToBox, type Rect } from "../layers/CropImage";
import { ScreenStrokes, type StrokesSpec } from "../layers/ScreenStrokes";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-045 PageSpread (studied byl, 'How I Edit Documentary Video LIKE Johnny Harris in Capcut (Part 1)',
// 22 Nov 2026; analysis only): one real page sits alone on the canvas, then two or three pages of the same
// document slide out side by side (thin paper border, soft shadow), then the camera pushes into the page that
// matters while the others dim. Highlights land on that page in image-pixel coordinates, as in VIS-001.
// Best use: a document with several pages the narration names (Dalton 1798 pp.28-43, Henry 1854 pp.201-203).
// Limit: max 2 per episode; real pages only, credited; at least 4 s on screen before a highlight.
type Page = {
  srcId: string;
  imgSize: readonly [number, number];
  crop?: Rect;
  label?: string;
};
export type PageSpreadProps = {
  pages: Page[];
  spreadSec: number; // when the one page becomes two or three
  focus?: { index: number; atSec: number; scale?: number }; // push into one page (scale <= 1.4)
  highlights?: { page: number; box: Rect; atSec: number }[];
  source: string;
  notes?: {
    text: string;
    atSec: number;
    untilSec?: number;
    accent?: boolean;
  }[];
  tag?: DatelineTagProps;
  strokes?: StrokesSpec; // TEX-008 over the pages, kept off the highlights
  startSec?: number;
};

const PAGE_H = 760;

export const PageSpread: React.FC<PageSpreadProps> = ({
  pages,
  spreadSec,
  focus,
  highlights = [],
  source,
  notes = [],
  tag,
  strokes,
  startSec = 0,
}) => {
  useAssets(["VIS-045", "MOT-001", "MOT-002", ...(strokes ? ["TEX-008"] : [])]);
  if (pages.length < 2 || pages.length > 3)
    throw new Error("PageSpread: 2 or 3 pages of one document.");
  if (focus && (focus.scale ?? 1.3) > 1.4)
    throw new Error("PageSpread: focus scale over 1.4 (calm limit).");
  const srcs = pages.map((p) => useSource(p.srcId)); // eslint-disable-line react-hooks/rules-of-hooks
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pad = 12;
  const sizes = pages.map((p) => {
    const c = p.crop ?? ([0, 0, p.imgSize[0], p.imgSize[1]] as const);
    const w = Math.round((PAGE_H * c[2]) / c[3]);
    return { w: Math.min(w, 560), h: PAGE_H };
  });
  const gap = 56;
  const total =
    sizes.reduce((a, s) => a + s.w + pad * 2, 0) + gap * (pages.length - 1);
  const x0 = (1920 - total) / 2;
  const xs: number[] = [];
  sizes.reduce((x, s) => (xs.push(x), x + s.w + pad * 2 + gap), x0);
  const cy = 1080 / 2 - 30;

  const pIn = reveal(frame, fps, startSec, t.motion.enterSec);
  const a = sec(spreadSec, fps);
  const sp = interpolate(frame, [a, a + sec(0.9, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  const f = focus ? sec(focus.atSec, fps) : 0;
  const fp = focus
    ? interpolate(frame, [f, f + sec(1.1, fps)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: SLOW_OUT,
      })
    : 0;
  const fs = 1 + ((focus?.scale ?? 1.3) - 1) * fp;
  const fi = focus?.index ?? 0;
  const fcx = xs[fi] + sizes[fi].w / 2 + pad;
  const camX = (960 - fcx) * fp;
  const d = drift(frame, durationInFrames, 0.015);

  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${camX * fs}px, 0px) scale(${fs * d})`,
          transformOrigin: `${960}px ${cy}px`,
        }}
      >
        {pages.map((p, i) => {
          const s = sizes[i];
          // Before the spread every page sits under the first one, centred; then each slides to its place.
          const homeX = xs[i];
          const stackX = (1920 - s.w - pad * 2) / 2 + i * 10;
          const x = stackX + (homeX - stackX) * sp;
          const y = cy - s.h / 2 - pad + i * 8 * (1 - sp);
          const dim = focus && i !== fi ? 1 - 0.6 * fp : 1;
          const { map } = cropToBox(
            p.crop ?? ([0, 0, p.imgSize[0], p.imgSize[1]] as const),
            s.w,
            s.h,
            "cover",
          );
          const hs = highlights.filter((h) => h.page === i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                zIndex: pages.length - i,
                opacity: i === 0 ? 1 : Math.min(1, sp * 3),
                filter: `brightness(${dim})`,
              }}
            >
              <div
                style={{
                  padding: pad,
                  background: t.colors.panel,
                  borderRadius: 4,
                  boxShadow:
                    "0 30px 60px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.35)",
                }}
              >
                <CropImage
                  src={srcs[i]}
                  imgSize={p.imgSize}
                  crop={p.crop}
                  width={s.w}
                  height={s.h}
                  filter="grayscale(0.55) sepia(0.12) contrast(1.06) brightness(0.94)"
                >
                  {hs.map((h, k) => {
                    const r = map(h.box);
                    const hb = sec(h.atSec, fps);
                    const hp = interpolate(
                      frame,
                      [hb, hb + sec(0.7, fps)],
                      [0, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: SLOW_OUT,
                      },
                    );
                    return (
                      <div
                        key={k}
                        style={{
                          position: "absolute",
                          left: r.left - 5,
                          top: r.top - 3,
                          width: (r.width + 10) * hp,
                          height: r.height + 6,
                          background: t.colors.accentSoft,
                          mixBlendMode: "multiply",
                          borderRadius: 3,
                        }}
                      />
                    );
                  })}
                  {strokes ? (
                    <ScreenStrokes
                      width={s.w}
                      height={s.h}
                      spec={{ mode: "shadow", ...strokes, seed: (strokes.seed ?? 1) + i }}
                      holes={hs.map((h) => map(h.box))}
                    />
                  ) : null}
                </CropImage>
              </div>
              {p.label ? (
                <div
                  style={{
                    marginTop: 14,
                    textAlign: "center",
                    fontFamily: t.fonts.mono,
                    fontSize: 24,
                    letterSpacing: 3,
                    color: t.colors.secondary,
                    opacity: sp,
                  }}
                >
                  {p.label}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: t.safe.x,
          bottom: t.safe.y,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        {notes.map((n) => {
          const pn = reveal(frame, fps, n.atSec, t.motion.enterSec);
          const on =
            n.untilSec !== undefined
              ? 1 - reveal(frame, fps, n.untilSec, 0.6)
              : 1;
          if (pn * on <= 0) return null;
          return (
            <div
              key={`${n.text}${n.atSec}`}
              style={{
                fontFamily: t.fonts.mono,
                fontSize: 30,
                letterSpacing: 3,
                color: n.accent ? t.colors.accent : t.colors.ink,
                background: t.colors.chip,
                padding: "6px 12px",
                borderRadius: 4,
                ...rise(pn * on, 14),
              }}
            >
              {n.text}
            </div>
          );
        })}
        <div
          style={{
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
      </div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
