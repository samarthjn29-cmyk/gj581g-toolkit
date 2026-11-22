import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sec, SLOW_OUT } from "../motion";

// TXT-015 FillSweep (studied Chris Moran's short on Vox text animation; analysis only): one key word in a line
// fills with a colour from left to right on its spoken word, like a highlighter running through the letters.
// The rest of the line keeps the theme ink. Calm: one fill per line, 0.6 s, no bounce.
export type WordFill = { word: string; atSec: number; color: string; sec?: number };

export const FillLine: React.FC<{ text: string; fill?: WordFill; ink: string }> = ({ text, fill, ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!fill) return <>{text}</>;
  const i = text.toLowerCase().indexOf(fill.word.toLowerCase());
  if (i < 0) throw new Error(`FillSweep: "${fill.word}" is not in "${text}"`);
  const p = interpolate(frame, [sec(fill.atSec, fps), sec(fill.atSec + (fill.sec ?? 0.6), fps)], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  const w = text.slice(i, i + fill.word.length);
  return (
    <>
      {text.slice(0, i)}
      <span
        style={{
          backgroundImage: `linear-gradient(90deg, ${fill.color} ${p}%, ${ink} ${p}%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {w}
      </span>
      {text.slice(i + fill.word.length)}
    </>
  );
};
