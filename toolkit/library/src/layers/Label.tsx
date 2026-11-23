import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { exit, lock, rise, sec, SLOW_OUT } from "../motion";

// A small mono label (TXT-010 style) that locks on its word, and may later move and shrink to a corner.
// Used inside components (it is not a beat visual of its own). Positions are frame pixels.
// Exit (MOT-013 UnwipeExit, Vox study 23 Nov 2026): a label leaves by un-wiping from its left edge, the words going in
// reading order, with only a short fade at the end, never a plain fade; it leaves before the object it names.
export type LabelSpec = {
  text: string;
  atSec: number;
  untilSec?: number; // un-wipes out from here (MOT-013)
  x: number;
  y: number;
  align?: "left" | "center" | "right";
  size?: number; // font size, default 26
  accent?: boolean; // accent colour for the one focal label
  settle?: boolean; // MOT-014 AccentSettle: arrives in the accent, cools to ink 0.5-1.1 s after (Johnny Harris's place names)
  moveTo?: { atSec: number; x: number; y: number; scale?: number }; // e.g. shrink to a corner
};

export const Label: React.FC<{ spec: LabelSpec }> = ({ spec }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = lock(frame, fps, spec.atSec);
  const out =
    spec.untilSec !== undefined
      ? exit(frame, fps, spec.untilSec, t.motion.enterSec)
      : 1;
  let x = spec.x;
  let y = spec.y;
  let sc = 1;
  if (spec.moveTo) {
    const a = sec(spec.moveTo.atSec, fps);
    const m = interpolate(frame, [a, a + sec(0.8, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SLOW_OUT,
    });
    x += (spec.moveTo.x - spec.x) * m;
    y += (spec.moveTo.y - spec.y) * m;
    sc = 1 + ((spec.moveTo.scale ?? 1) - 1) * m;
  }
  const align = spec.align ?? "left";
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0%";
  const r = rise(Math.min(1, p), 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${tx}) ${r.transform} scale(${sc})`,
        transformOrigin:
          align === "right"
            ? "100% 0%"
            : align === "center"
              ? "50% 0%"
              : "0% 0%",
        opacity: r.opacity * Math.min(1, out * 2.5),
        clipPath: out < 1 ? `inset(-4px -4px -4px ${((1 - out) * 100).toFixed(1)}%)` : undefined,
        fontFamily: t.fonts.mono,
        fontSize: spec.size ?? 32,
        letterSpacing: 2,
        color: spec.settle
          ? interpolateColors(frame, [sec(spec.atSec + 0.5, fps), sec(spec.atSec + 1.1, fps)], [t.colors.accent, t.colors.ink])
          : spec.accent
            ? t.colors.accent
            : t.colors.ink,
        background: t.colors.chip,
        padding: "8px 14px",
        borderRadius: 4,
        whiteSpace: "nowrap",
      }}
    >
      {spec.text}
    </div>
  );
};
