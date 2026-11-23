import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// TRN-002 JCutDraftingWipe (own build, 23 Nov 2026; Sam: "Build the transitions which we haven't built yet"): a ruled
// ink line is drawn straight across the frame by a pen nib, at a slight angle, like a draughtsman's rule; the new shot
// is already in place on the far side of the line and is uncovered as the line passes. The J-cut half lives in the act
// file: the next shot's sound (its room tone or page sound) starts 0.4-0.8 s before the wipe, so the ear moves first.
// Sound: SFX-017 InkLineFoley under the stroke.
// Calm: 0.8 s, one direction, eased; the line stays 0.25 s after the wipe as a hairline, then fades.
export const DraftingWipe: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
  angle?: number; // degrees from vertical; the line leans this much
  dir?: "right" | "left";
}> = ({ from, to, atSec = 0, durSec = 0.8, angle = 8, dir = "right" }) => {
  useAsset("TRN-002");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(1, sec(durSec, fps));
  const hold = sec(0.25, fps);
  const fadeL = sec(0.3, fps);
  const p = interpolate(frame, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const lean = Math.tan((angle * Math.PI) / 180) * 1080; // horizontal offset between top and bottom of the line
  const span = 1920 + Math.abs(lean) + 80;
  const x = -Math.abs(lean) - 40 + span * p; // x of the line's top end
  const X = dir === "right" ? x : 1920 - x;
  const top = X, bot = X - (dir === "right" ? lean : -lean);
  // the old shot keeps what is ahead of the line, the new shot what is behind it
  const behind = dir === "right" ? `polygon(-10px -10px, ${top}px -10px, ${bot}px 1090px, -10px 1090px)` : `polygon(${top}px -10px, 1930px -10px, 1930px 1090px, ${bot}px 1090px)`;
  const done = frame >= a + d;
  const lineO = frame < a ? 0 : done ? interpolate(frame, [a + d + hold, a + d + hold + fadeL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const nibY = 1080 * p; // the nib travels down the line as it crosses, so the stroke reads as drawn
  const nibX = top + (bot - top) * (nibY / 1080);
  return (
    <AbsoluteFill>
      {!done ? <AbsoluteFill>{from}</AbsoluteFill> : null}
      {frame >= a ? <AbsoluteFill style={{ clipPath: done ? undefined : behind, background: done ? undefined : t.colors.canvas }}>{to}</AbsoluteFill> : null}
      {lineO > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lineO }}>
          <line x1={top} y1={-10} x2={bot} y2={1090} stroke={t.colors.ink} strokeWidth={done ? 1.5 : 2.6} strokeLinecap="round" opacity={0.9} />
          <line x1={top + 3} y1={-10} x2={bot + 3} y2={1090} stroke="rgba(0,0,0,0.35)" strokeWidth={4} style={{ filter: "blur(3px)" }} />
          {!done ? <circle cx={nibX} cy={nibY} r={5} fill={t.colors.accent} /> : null}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
