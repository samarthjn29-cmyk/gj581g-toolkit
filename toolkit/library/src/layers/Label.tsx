import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { exit, lock, rise, sec, SLOW_OUT } from "../motion";

// A small mono label (TXT-010 style) that locks on its word, and may later move and shrink to a corner.
// Used inside components (it is not a beat visual of its own). Positions are frame pixels.
export type LabelSpec = {
  text: string;
  atSec: number;
  untilSec?: number; // fades out here
  x: number;
  y: number;
  align?: "left" | "center" | "right";
  size?: number; // font size, default 26
  accent?: boolean; // accent colour for the one focal label
  moveTo?: { atSec: number; x: number; y: number; scale?: number }; // e.g. shrink to a corner
};

export const Label: React.FC<{ spec: LabelSpec }> = ({ spec }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = lock(frame, fps, spec.atSec);
  const out = spec.untilSec !== undefined ? exit(frame, fps, spec.untilSec, t.motion.enterSec) : 1;
  let x = spec.x;
  let y = spec.y;
  let sc = 1;
  if (spec.moveTo) {
    const a = sec(spec.moveTo.atSec, fps);
    const m = interpolate(frame, [a, a + sec(0.8, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
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
        transformOrigin: align === "right" ? "100% 0%" : align === "center" ? "50% 0%" : "0% 0%",
        opacity: r.opacity * out,
        fontFamily: t.fonts.mono,
        fontSize: spec.size ?? 32,
        letterSpacing: 2,
        color: spec.accent ? t.colors.accent : t.colors.ink,
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
