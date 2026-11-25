import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme, lightTone, darkTone } from "../themes";
import { PaperFibre } from "../layers/PaperFibre";
import { sec } from "../motion";

// TRN-011 PaperBandWipe (studied ilkin's collage ad and Chris Moran's Netflix-doc text tutorial, 22 Nov 2026;
// analysis only, the build is ours): a wide band of paper sweeps across the frame and the next scene is already
// in place behind it. Ahead of the band: the old shot; behind it: the new one. Its sound is SFX-024 AirSwish,
// started 0.05-0.15 s before the band (set in the act file).
//  tone "paper": the theme's paper (ink token) with fibre; "dark": the theme's panel, a faint lit edge on the
//  leading side, for a move into a dark scene.
// Calm: 0.75 s (about 0.65 s in frame), one direction, eased in and out, no bounce.
export const PaperBandWipe: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
  dir?: "down" | "up";
  tone?: "paper" | "dark";
  band?: number; // band height in px
  tilt?: number; // degrees; a slight tilt reads as a real sheet, not a UI panel
}> = ({ from, to, atSec = 0, durSec = 0.75, dir = "down", tone = "paper", band = 560, tilt = -2.5 }) => {
  useAsset("TRN-011");
  useAsset("TEX-007");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(1, sec(durSec, fps));
  // Gentle ease (independent review, v11: inOut cubic with a 140 px run-up kept the band out of sight for 0.2 s and
  // then whipped it across in 0.28 s, after its swish had finished): a quad ease and a 50 px run-up, so the band is in
  // frame from the first frames and crosses in about 0.65 s.
  const p = interpolate(frame, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  // The band's top edge travels from above the frame to below it (down), so the frame is covered at mid-move.
  const H = 1080;
  const pad = 50; // the tilt needs about 45 px so no corner shows
  const top0 = -band - pad;
  const top1 = H + pad;
  const top = dir === "down" ? top0 + (top1 - top0) * p : top1 - (top1 - top0) * p;
  const lead = dir === "down" ? top + band : top; // the edge that is still moving into the old shot
  const trail = dir === "down" ? top : top + band;
  // Old shot: what lies ahead of the band. New shot: what lies behind it.
  // Clip lines overlap the band by m px: the band is tilted, so its edges wander about +-45 px across the
  // frame; the band is drawn on top, so the overlap never shows and no gap opens beside it.
  const m = 70;
  const oldClip = dir === "down" ? `inset(${Math.max(0, lead - m).toFixed(1)}px 0 0 0)` : `inset(0 0 ${Math.max(0, H - lead - m).toFixed(1)}px 0)`;
  const newClip = dir === "down" ? `inset(0 0 ${Math.max(0, H - trail - m).toFixed(1)}px 0)` : `inset(${Math.max(0, trail - m).toFixed(1)}px 0 0 0)`;
  const done = frame >= a + d;
  const fill = tone === "dark" ? darkTone(t) : lightTone(t);
  return (
    <AbsoluteFill>
      {!done ? <AbsoluteFill style={{ clipPath: frame < a ? undefined : oldClip }}>{from}</AbsoluteFill> : null}
      {frame >= a ? (
        // No canvas behind the incoming shot: it never moves (the band covers the seam), and a painted canvas would hide
        // OpticalStack's corner light for the whole shot (independent review, v11).
        <AbsoluteFill style={{ clipPath: done ? undefined : newClip }}>{to}</AbsoluteFill>
      ) : null}
      {frame >= a && !done ? (
        <div
          style={{
            position: "absolute",
            left: -200,
            width: 2320,
            top,
            height: band,
            transform: `rotate(${tilt}deg)`,
            transformOrigin: "50% 50%",
            background: fill,
            boxShadow: "0 18px 50px rgba(0,0,0,0.42), 0 -18px 50px rgba(0,0,0,0.32)",
            overflow: "hidden",
          }}
        >
          <PaperFibre seed={11} strength={tone === "dark" ? 0.6 : 1} />
          {tone === "dark" ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 3,
                [dir === "down" ? "bottom" : "top"]: 0,
                background: "rgba(242,224,190,0.35)",
              }}
            />
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
