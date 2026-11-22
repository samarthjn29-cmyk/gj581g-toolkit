import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sec, SLOW_OUT } from "../motion";

// TXT-020 StrikeThrough (studied RandomAI, 'Claude Opus 5.5 Is INSANE at Vox-Style Motion Graphics', 22 Nov 2026;
// analysis only): a hand-drawn line crosses the words on the spoken correction, then the struck words grey back.
// The right words come on the next line (a KineticLine line, or a KeywordSlab when TXT-012 is built).
// The stroke is our own: a slightly rising, slightly wavy line, a touch longer than the words, drawn left to right.
// Best use: correcting a misconception said out loud (THE COMMON VIEW, THE GUESS). Limit: max 2 per episode;
// the correction must be sourced.
export type StrikeSpec = {
  atSec: number;
  sec?: number;
  color?: string;
  greyTo?: string;
};

export const Strike: React.FC<{
  spec: StrikeSpec;
  color: string;
  ink: string;
  grey: string;
  children: React.ReactNode;
}> = ({ spec, color, ink, grey, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = spec.sec ?? 0.45;
  if (d < 0.25 || d > 0.9)
    throw new Error(`StrikeThrough: draw time ${d} s outside 0.25-0.9 s.`);
  const a = sec(spec.atSec, fps);
  const p = interpolate(frame, [a, a + sec(d, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  const g = interpolate(
    frame,
    [a + sec(d, fps), a + sec(d + 0.4, fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // A fixed hand-drawn shape in a 0-100 box: rises ~6% across, with two soft waves.
  const path = "M -3 58 C 18 54, 30 60, 48 52 S 80 50, 103 44";
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{ color: g > 0 ? mix(ink, spec.greyTo ?? grey, g) : undefined }}
      >
        {children}
      </span>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <path
          d={path}
          fill="none"
          stroke={spec.color ?? color}
          strokeWidth={7}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
          style={{ strokeWidth: "0.09em" }}
        />
      </svg>
    </span>
  );
};

// Linear mix of two #rrggbb colours (theme tokens are hex).
function mix(a: string, b: string, t: number): string {
  const h = (s: string) =>
    [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b))
    return t < 0.5 ? a : b;
  const [x, y] = [h(a), h(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
}
