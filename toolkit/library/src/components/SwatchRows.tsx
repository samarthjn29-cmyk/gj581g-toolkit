import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, exit, lock, reveal, rise, sec, SLOW_OUT } from "../motion";
import { Label, type LabelSpec } from "../layers/Label";

// VIS-017 SwatchRows (beat type 2: comparing what different people see, calm).
// Rows of colour swatches under column heads (BY DAY / BY CANDLE), one row per person or group. A swatch
// appears empty (an outline) and fills with its colour on its word; a row can dim or brighten later, and a
// tag can lock beside a row ("NO REAL CHANGE"). Colours are data (what each person reported), given as props.
export type Swatch = { color?: string; name?: string; atSec: number; fillSec?: number };
export type SwatchRow = {
  name?: string;
  nameAtSec?: number;
  atSec: number; // row slides in
  cells: Swatch[];
  dimAtSec?: number;
  brightAtSec?: number;
  tag?: { text: string; atSec: number };
  sub?: { text: string; atSec: number }; // e.g. a name under the row label (JONATHAN)
};
export type SwatchRowsProps = {
  columns: string[];
  rows: SwatchRow[];
  caption?: { text: string; atSec: number; untilSec?: number };
  labels?: LabelSpec[];
  startSec?: number;
};

export const SwatchRows: React.FC<SwatchRowsProps> = ({ columns, rows, caption, labels = [], startSec = 0 }) => {
  useAssets(["VIS-017", "MOT-001", "MOT-002", "MOT-003"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sw = 250;
  const sh = 150;
  const gap = 44;
  const nameW = 440;
  const rowH = sh + 56;
  const totalW = nameW + columns.length * sw + (columns.length - 1) * gap;
  const x0 = (1920 - totalW) / 2;
  const n = rows.length;
  const y0 = 540 - (n * rowH) / 2 + 40;
  const pHead = reveal(frame, fps, startSec, t.motion.enterSec);
  const pCap = caption
    ? reveal(frame, fps, caption.atSec, t.motion.enterSec) * (caption.untilSec !== undefined ? exit(frame, fps, caption.untilSec, t.motion.enterSec) : 1)
    : 0;

  const ramp = (a?: number, from = 1, to = 1) =>
    a === undefined
      ? from
      : interpolate(frame, [sec(a, fps), sec(a, fps) + sec(0.7, fps)], [from, to], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: SLOW_OUT,
        });

  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.015)})` }}>
      {columns.map((c, i) => (
        <div
          key={c}
          style={{
            position: "absolute",
            left: x0 + nameW + i * (sw + gap),
            width: sw,
            top: y0 - 70,
            textAlign: "center",
            fontFamily: t.fonts.mono,
            fontSize: 24,
            letterSpacing: 3,
            color: t.colors.secondary,
            ...rise(pHead, 12),
          }}
        >
          {c}
        </div>
      ))}
      {rows.map((r, ri) => {
        const pRow = reveal(frame, fps, r.atSec, t.motion.enterSec);
        const dimmed = ramp(r.dimAtSec, 1, 0.35);
        const bright = r.brightAtSec !== undefined ? ramp(r.brightAtSec, 0, 1) : 0;
        const op = Math.min(1, dimmed + bright * (1 - dimmed));
        const y = y0 + ri * rowH;
        const pName = r.name ? reveal(frame, fps, r.nameAtSec ?? r.atSec, t.motion.enterSec) : 0;
        return (
          <div key={ri} style={{ position: "absolute", left: 0, top: 0, opacity: op * pRow }}>
            <div
              style={{
                position: "absolute",
                left: x0,
                top: y + sh / 2 - 34,
                width: nameW - 40,
                textAlign: "right",
                fontFamily: t.fonts.serif,
                fontWeight: t.fonts.titleWeight,
                fontSize: 44,
                whiteSpace: "nowrap",
                color: t.colors.ink,
                ...rise(pName, 14),
              }}
            >
              {r.name ?? ""}
              {r.sub ? (
                <div
                  style={{
                    fontFamily: t.fonts.mono,
                    fontWeight: 500,
                    fontSize: 22,
                    letterSpacing: 3,
                    color: t.colors.accent,
                    marginTop: 6,
                    opacity: lock(frame, fps, r.sub.atSec),
                  }}
                >
                  {r.sub.text}
                </div>
              ) : null}
            </div>
            {r.cells.map((c, ci) => {
              const shown = reveal(frame, fps, c.atSec, 0.6);
              const fill = c.color ? lock(frame, fps, c.fillSec ?? c.atSec) : 0;
              const left = x0 + nameW + ci * (sw + gap);
              return (
                <React.Fragment key={ci}>
                <div
                  style={{
                    position: "absolute",
                    left,
                    top: y + (1 - pRow) * 30,
                    width: sw,
                    height: sh,
                    borderRadius: 10,
                    border: `2px solid ${t.colors.hairline}`,
                    boxShadow: fill > 0.01 ? "0 18px 40px rgba(0,0,0,0.35)" : "none",
                    opacity: shown,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: c.color ?? "transparent", opacity: fill }} />
                </div>
                {c.name ? (
                  <div
                    style={{
                      position: "absolute",
                      left,
                      width: sw,
                      top: y + sh + 10 + (1 - pRow) * 30,
                      textAlign: "center",
                      fontFamily: t.fonts.mono,
                      fontSize: 20,
                      letterSpacing: 2,
                      color: t.colors.secondary,
                      opacity: fill,
                    }}
                  >
                    {c.name}
                  </div>
                ) : null}
                </React.Fragment>
              );
            })}
            {r.tag ? (
              <div
                style={{
                  position: "absolute",
                  left: x0 + nameW + r.cells.length * (sw + gap) - gap + 36,
                  top: y + sh / 2 - 22,
                  fontFamily: t.fonts.mono,
                  fontSize: 24,
                  letterSpacing: 3,
                  color: t.colors.accent,
                  background: t.colors.chip,
                  padding: "8px 14px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                  ...rise(Math.min(1, lock(frame, fps, r.tag.atSec)), 10),
                }}
              >
                {r.tag.text}
              </div>
            ) : null}
          </div>
        );
      })}
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: y0 + n * rowH + 30,
            textAlign: "center",
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontSize: 46,
            color: t.colors.ink,
            ...rise(pCap, 18),
          }}
        >
          {caption.text}
        </div>
      ) : null}
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
    </AbsoluteFill>
  );
};
