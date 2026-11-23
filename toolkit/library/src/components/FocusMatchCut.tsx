import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { sec } from "../motion";

// TRN-015 FocusMatchCut (Mapal, 'How To Animate Like Johnny Harris'; byl; analysis only; Sam, 23 Nov 2026: "Build the
// necessary cinematic pieces"). A match cut on motion with a focus pull: the old shot keeps moving (scales up and drifts
// towards the next shot's key point) and goes soft; the new shot arrives already moving the same way, from soft to sharp,
// and settles. The two moves read as one camera move; the blur hides the join.
// Best use: a scene change where the next picture relates to a point in the last one (a word to its page, a map to its
// town, a face to its portrait). Limit: max 1 in 3 scene changes; never two in a row; 0.5-0.8 s; blur <= 8 px.
export const FocusMatchCut: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  focus?: readonly [number, number]; // where the old shot moves to (the next shot's key point), frame px
  dir?: readonly [number, number]; // drift direction in px over the move (default: towards the focus point)
  durSec?: number;
}> = ({ from, to, focus = [960, 540], dir, durSec = 0.65 }) => {
  useAsset("TRN-015");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (durSec < 0.5 || durSec > 0.8) throw new Error("FocusMatchCut: 0.5-0.8 s.");
  const d = Math.max(2, sec(durSec, fps));
  const half = Math.round(d * 0.5);
  const p = interpolate(frame, [0, d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mv = dir ?? ([(960 - focus[0]) * 0.18, (540 - focus[1]) * 0.18] as const);
  // the old shot: accelerates into the move and goes soft
  const po = Easing.in(Easing.cubic)(Math.min(1, frame / half));
  // the new shot: continues the move and decelerates, soft to sharp
  const pi = Easing.out(Easing.cubic)(interpolate(frame, [half - 3, d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const fade = interpolate(frame, [half - 3, half + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const origin = `${focus[0]}px ${focus[1]}px`;
  return (
    <AbsoluteFill>
      {p < 1 ? (
        <AbsoluteFill style={{ transform: `translate(${mv[0] * po}px, ${mv[1] * po}px) scale(${1 + 0.1 * po})`, transformOrigin: origin, filter: `blur(${(8 * po).toFixed(2)}px)`, opacity: 1 - fade }}>{from}</AbsoluteFill>
      ) : null}
      <Sequence from={0} layout="none">
        <AbsoluteFill style={{ transform: `translate(${-mv[0] * (1 - pi)}px, ${-mv[1] * (1 - pi)}px) scale(${1.06 - 0.06 * pi})`, filter: pi < 1 ? `blur(${(7 * (1 - pi)).toFixed(2)}px)` : undefined, opacity: fade }}>{to}</AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
