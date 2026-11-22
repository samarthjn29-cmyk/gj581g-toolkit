import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, rise, sec, SLOW_OUT } from "../motion";
import { Typed } from "../layers/TypewriterLine";

// VIS-039 LedgerCard (studied RandomAI, 'Claude Opus 5.5 Is INSANE at Vox-Style Motion Graphics', 22 Nov 2026;
// analysis only): a torn, receipt-like paper card. Each row types in on its word (TXT-021) with a dotted leader
// to its value; one row is marked with the marker highlight. The paper is the theme's ink colour and the type is
// the canvas colour, so the card reads as a printed list, not as one of our labels.
// Best use: a few named items from one real document compared (Dalton's colour list, 1798 p.34; a page's list
// of names). Limit: max 2 per episode; every row's words come from the source, never invented.
export type LedgerCardProps = {
  title: string;
  rows: { text: string; value?: string; atSec: number; markAtSec?: number }[];
  source: string;
  side?: "left" | "right";
  lines?: {
    text: string;
    atSec: number;
    untilSec?: number;
    style?: "serif" | "mono";
  }[]; // beside the card
  startSec?: number;
};

const CARD_W = 760;

export const LedgerCard: React.FC<LedgerCardProps> = ({
  title,
  rows,
  source,
  side = "left",
  lines = [],
  startSec = 0,
}) => {
  useAssets([
    "VIS-039",
    "TXT-021",
    "MOT-001",
    "MOT-002",
    ...(rows.some((r) => r.markAtSec !== undefined) ? ["TXT-017"] : []),
  ]);
  if (rows.length < 2 || rows.length > 9)
    throw new Error("LedgerCard: 2-9 rows (a few named items).");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const paper = t.colors.ink;
  const type = t.colors.canvas;
  const rowH = 64;
  const cardH = 150 + rows.length * rowH + 70;
  const cardX = side === "left" ? t.safe.x + 40 : 1920 - t.safe.x - 40 - CARD_W;
  const cardY = (1080 - cardH) / 2;
  const textX = side === "left" ? cardX + CARD_W + 100 : t.safe.x;
  const textW = 1920 - t.safe.x * 2 - CARD_W - 140;
  const pCard = reveal(frame, fps, startSec, t.motion.enterSec);
  // Torn top and bottom: a fixed zigzag (our own), 22 teeth.
  const teeth = 22;
  const zig = (y: number, dir: 1 | -1) =>
    Array.from(
      { length: teeth + 1 },
      (_, i) => `${(i / teeth) * 100}% ${y + (i % 2 ? dir * 1.2 : 0)}%`,
    ).join(", ");
  const clip = `polygon(${zig(0.6, 1)}, ${zig(99.4, -1).split(", ").reverse().join(", ")})`;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY,
          width: CARD_W,
          height: cardH,
          ...rise(pCard, 36),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotate(-1.2deg) scale(${drift(frame, durationInFrames, 0.015)})`,
            filter: "drop-shadow(0 28px 40px rgba(0,0,0,0.45))",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: paper,
              clipPath: clip,
              padding: "64px 56px 0 56px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontFamily: t.fonts.mono,
                fontSize: 30,
                letterSpacing: 4,
                color: type,
                fontWeight: 500,
                marginBottom: 30,
                textAlign: "center",
              }}
            >
              {title}
            </div>
            <div
              style={{
                height: 2,
                background: type,
                opacity: 0.35,
                marginBottom: 26,
              }}
            />
            {rows.map((r, i) => {
              const shown = frame >= sec(r.atSec, fps);
              const m =
                r.markAtSec !== undefined ? sec(r.markAtSec, fps) : null;
              const mp =
                m === null
                  ? 0
                  : interpolate(frame, [m, m + sec(0.6, fps)], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: SLOW_OUT,
                    });
              const valueAt = r.atSec + r.text.length / 22 + 0.15;
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    height: rowH,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: t.fonts.mono,
                    fontSize: 32,
                    letterSpacing: 2,
                    color: type,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -12,
                      right: -12,
                      top: 8,
                      bottom: 8,
                      background: t.colors.accent,
                      opacity: 0.55,
                      transform: `scaleX(${mp})`,
                      transformOrigin: "0% 50%",
                      borderRadius: 4,
                    }}
                  />
                  <span style={{ position: "relative" }}>
                    {shown ? (
                      <Typed
                        text={r.text}
                        atSec={r.atSec}
                        spec={{ cursor: false }}
                        color={type}
                      />
                    ) : null}
                  </span>
                  <span
                    style={{
                      position: "relative",
                      flex: 1,
                      margin: "0 14px",
                      borderBottom: `3px dotted ${type}`,
                      opacity: shown ? 0.35 : 0,
                      transform: "translateY(10px)",
                    }}
                  />
                  {r.value ? (
                    <span style={{ position: "relative" }}>
                      {frame >= sec(valueAt, fps) ? (
                        <Typed
                          text={r.value}
                          atSec={valueAt}
                          spec={{ cursor: false }}
                          color={type}
                        />
                      ) : null}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{ position: "absolute", left: textX, top: 330, width: textW }}
      >
        {lines.map((l) => {
          const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
          const out =
            l.untilSec !== undefined
              ? 1 - reveal(frame, fps, l.untilSec, 0.6)
              : 1;
          const mono = l.style === "mono";
          return (
            <div
              key={`${l.text}${l.atSec}`}
              style={{
                fontFamily: mono ? t.fonts.mono : t.fonts.serif,
                fontSize: mono ? 30 : 58,
                letterSpacing: mono ? 3 : undefined,
                fontStyle: mono ? undefined : "italic",
                lineHeight: 1.2,
                color: mono ? t.colors.secondary : t.colors.ink,
                marginTop: mono ? 24 : 0,
                ...rise(p * out, mono ? 12 : 22),
              }}
            >
              {l.text}
            </div>
          );
        })}
        <div
          style={{
            display: "inline-block",
            marginTop: 30,
            fontFamily: t.fonts.mono,
            fontSize: 24,
            letterSpacing: 1.2,
            color: t.colors.secondary,
            background: t.colors.chip,
            padding: "8px 14px",
            borderRadius: 4,
            ...rise(reveal(frame, fps, startSec + 0.6, t.motion.enterSec), 12),
          }}
        >
          {source}
        </div>
      </div>
    </AbsoluteFill>
  );
};
