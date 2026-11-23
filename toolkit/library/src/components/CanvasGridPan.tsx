import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// TRN-004 InfiniteCanvasGrid (own build, 23 Nov 2026; from the 22 Nov Vox-style demo study): every shot of one idea
// sits as a card on one big gridded drafting sheet. Between two of them the camera pulls back a little (to `pull`),
// the grid sheet shows round both cards, the camera glides across the sheet to the next card (a short directional
// blur at top speed) and pushes back in. So a run of scenes reads as one place, not a string of cuts.
// Calm: 1.3 s in all (pull 0.35, glide 0.6, push 0.35), pull to 0.82 at most, blur 6 px at most.
export const CanvasGridPan: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
  dir?: "right" | "left" | "down" | "up";
  pull?: number;
  gap?: number; // px between the two cards on the sheet
}> = ({ from, to, atSec = 0, durSec = 1.3, dir = "right", pull = 0.82, gap = 160 }) => {
  useAsset("TRN-004");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(3, sec(durSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const f = frame - a;
  const k1 = d * 0.27, k2 = d * 0.73;
  const scale = f <= 0 ? 1 : f >= d ? 1 : f < k1 ? interpolate(f, [0, k1], [1, pull], { ...clamp, easing: Easing.inOut(Easing.quad) }) : f > k2 ? interpolate(f, [k2, d], [pull, 1], { ...clamp, easing: Easing.inOut(Easing.quad) }) : pull;
  const g = interpolate(f, [k1 * 0.6, k2 + (d - k2) * 0.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const horiz = dir === "right" || dir === "left";
  const step = (horiz ? 1920 : 1080) + gap;
  const sign = dir === "right" || dir === "down" ? 1 : -1;
  const off = -sign * step * g; // the sheet moves opposite to the camera
  const speed = Math.abs(interpolate(f + 1, [k1 * 0.6, k2 + (d - k2) * 0.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) - g);
  const blur = Math.min(6, speed * step * 0.06);
  if (f < 0) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (f >= d) return <AbsoluteFill>{to}</AbsoluteFill>;
  const grid = t.colors.hairline;
  const card = (node: React.ReactNode, i: number) => (
    <div
      style={{
        position: "absolute",
        left: horiz ? i * sign * step : 0,
        top: horiz ? 0 : i * sign * step,
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: t.colors.canvas,
        boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
        outline: `1px solid ${t.colors.hairline}`,
      }}
    >
      {node}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: t.colors.panel, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
        <div
          style={{
            position: "absolute",
            left: -4000 + (horiz ? off : 0),
            top: -4000 + (horiz ? 0 : off),
            width: 12000,
            height: 10000,
            backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${horiz ? off : 0}px, ${horiz ? 0 : off}px)`, filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
          {card(from, 0)}
          {card(to, 1)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
