import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sec, SLOW_OUT } from "../motion";

// TXT-015 FillSweep (studied Chris Moran's short on Vox text animation; analysis only): one key word in a line
// fills with a colour from left to right on its spoken word, like a highlighter running through the letters.
// The rest of the line keeps the theme ink. Calm: one fill per line, 0.6 s, no bounce.
// style "fill" (TXT-015): the letters fill. style "mark" (TXT-017 MarkerHighlight, studied Chris Moran's short on
// Vox's animation style): a solid block sweeps in BEHIND the word, like a marker; the letters switch to `onMark`.
export type WordFill = { word: string; atSec: number; color: string; sec?: number; style?: "fill" | "mark"; onMark?: string };

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
  if (fill.style === "mark") {
    return (
      <>
        {text.slice(0, i)}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: "-0.08em", right: "-0.08em", top: "0.08em", bottom: "0.02em", background: fill.color, transform: `scaleX(${p / 100})`, transformOrigin: "0% 50%", borderRadius: "0.06em", zIndex: 0 }} />
          <span style={{ position: "relative", zIndex: 1, color: p > 50 && fill.onMark ? fill.onMark : undefined }}>{w}</span>
        </span>
        {text.slice(i + fill.word.length)}
      </>
    );
  }
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
