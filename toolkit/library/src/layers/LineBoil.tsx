import React from "react";
import { useCurrentFrame } from "remotion";
import { useAsset } from "../registry";
import { boilStep } from "../motion";

// MOT-009 LineBoil: an SVG filter that displaces a drawing by a pixel or so, re-seeded every few frames, so our
// own line drawings feel handmade. Put <BoilDefs id=.../> inside an <svg><defs>, then filter="url(#id)" on the
// group of lines. Calm limit: amp 0.5-2 px. Never on text, photos or scans.
export const BoilDefs: React.FC<{ id: string; amp?: number; every?: number; seed?: number }> = ({ id, amp = 1.2, every = 3, seed = 1 }) => {
  useAsset("MOT-009");
  if (amp > 2) throw new Error(`line boil ${amp}px is above the calm limit (2 px).`);
  const frame = useCurrentFrame();
  const s = boilStep(frame, every, seed);
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={s} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={amp * 2} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
};
