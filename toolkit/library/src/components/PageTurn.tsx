import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// TRN-020 PageTurn (Sam, 25 Nov 2026: "Sure build them"): the old shot turns like a leaf of a book on a hinge at the
// left edge, its back a plain paper verso, and the new shot lies under it, in the leaf's moving shadow. For one page or
// document card to the next one in the same source. Calm: 0.8 s, eased, one turn, never two in a row.
export const PageTurn: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
  hinge?: "left" | "right";
}> = ({ from, to, atSec = 0, durSec = 0.8, hinge = "left" }) => {
  useAsset("TRN-020");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const e = a + Math.max(4, sec(durSec, fps));
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (frame >= e) return <AbsoluteFill>{to}</AbsoluteFill>;
  const p = interpolate(frame, [a, e], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const deg = (hinge === "left" ? -1 : 1) * 180 * p;
  const front = p < 0.5;
  const verso = t.paper?.canvas ?? "#ECE4D2";
  const shade = Math.sin(Math.PI * p); // how much the lifted leaf darkens what lies under it
  const sideOut = hinge === "left" ? "right" : "left";
  return (
    <AbsoluteFill style={{ perspective: 2600, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: t.colors.canvas }}>{to}</AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(to ${sideOut}, rgba(0,0,0,${0.45 * shade}) 0%, rgba(0,0,0,${0.12 * shade}) 45%, rgba(0,0,0,0) 80%)` }} />
      <AbsoluteFill style={{ transformOrigin: `${hinge} center`, transform: `rotateY(${deg}deg)`, boxShadow: `0 0 ${60 * shade}px rgba(0,0,0,${0.4 * shade})` }}>
        {front ? (
          <AbsoluteFill style={{ background: t.colors.canvas }}>
            {from}
            <AbsoluteFill style={{ background: `linear-gradient(to ${hinge}, rgba(0,0,0,${0.35 * p * 2}) 0%, rgba(255,255,255,${0.10 * p * 2}) 60%, rgba(0,0,0,0) 100%)` }} />
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ transform: "scaleX(-1)", background: verso }}>
            <AbsoluteFill style={{ background: `linear-gradient(to ${sideOut}, rgba(0,0,0,${0.25 * (1 - p) * 2}) 0%, rgba(0,0,0,0) 70%)`, opacity: 0.9 }} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
