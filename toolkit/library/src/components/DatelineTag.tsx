import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAsset } from "../registry";
import { exit, reveal, sec, SLOW_OUT } from "../motion";

// TXT-011 DatelineTag: the small mono tag for a place and a date ("KENDAL · AUTUMN 1792"), shown the first
// time a new place or date opens a scene. It fades up (low centre or top-left), extends part by part on cue,
// and may ease to the top-left corner. Rendered inside a beat's visual (the `tag` prop), never on its own.
export type DatelineTagProps = {
  parts: { text: string; atSec: number; untilSec?: number }[];
  at?: "low-centre" | "corner";
  toCornerAtSec?: number;
  untilSec?: number;
};

export const DatelineTag: React.FC<DatelineTagProps> = ({ parts, at = "corner", toCornerAtSec, untilSec }) => {
  useAsset("TXT-011");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowSec = frame / fps;
  const first = parts[0]?.atSec ?? 0;
  const pIn = reveal(frame, fps, first, t.motion.enterSec);
  const pOut = untilSec !== undefined ? exit(frame, fps, untilSec, t.motion.enterSec) : 1;
  const corner = { x: t.safe.x, y: t.safe.y };
  const low = { x: 960, y: 860 };
  let m = at === "corner" ? 1 : 0;
  if (at !== "corner" && toCornerAtSec !== undefined) {
    const a = sec(toCornerAtSec, fps);
    m = interpolate(frame, [a, a + sec(0.9, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
  }
  const x = low.x + (corner.x - low.x) * m;
  const y = low.y + (corner.y - low.y) * m;
  // A part wipes in and un-wipes out by its width (MOT-013), so the tag's width eases and a centred tag never jumps
  // (gate 3 review of WCL-E01 act 1 v17: "· NORTH OF ENGLAND" vanished in one frame and the tag jumped 245 px).
  const vis = (p: DatelineTagProps["parts"][number]) =>
    reveal(frame, fps, p.atSec, 0.6) * (p.untilSec !== undefined ? exit(frame, fps, p.untilSec, 0.6) : 1);
  const shown = parts.filter((p) => nowSec >= p.atSec && vis(p) > 0);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${-50 * (1 - m)}%) translateY(${(1 - pIn) * 14}px)`,
        opacity: pIn * pOut,
        fontFamily: t.fonts.mono,
        fontSize: 32 - 4 * m,
        letterSpacing: 4,
        color: t.colors.ink,
        background: t.colors.chip,
        padding: "10px 18px",
        borderRadius: 4,
        borderLeft: `3px solid ${t.colors.accent}`,
        whiteSpace: "nowrap",
      }}
    >
      {shown.map((p, i) => {
        const text = `${i > 0 ? "  ·  " : ""}${p.text}`;
        const v = i === 0 && p.untilSec === undefined ? 1 : vis(p);
        return (
          <span
            key={p.text}
            style={{
              display: "inline-block",
              verticalAlign: "bottom",
              whiteSpace: "pre",
              overflow: "hidden",
              maxWidth: v >= 1 ? undefined : `calc(${v.toFixed(4)} * ${text.length} * (1ch + 4px))`,
              opacity: Math.min(1, v * 2.5),
            }}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
};
