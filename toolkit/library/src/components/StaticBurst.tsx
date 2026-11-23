import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { sec } from "../motion";

// TRN-014 StaticBurst (own build, 23 Nov 2026; studied byl's CapCut Johnny Harris edit, 22 Nov 2026, analysis only):
// 6-10 frames of our own synthesised TV static (fresh noise every frame), an RGB split and horizontal tear lines,
// over the end of the old shot and the start of the new one; the cut sits in the middle. Sound: SFX-023 AnalogNoise
// (a short crackle) set in the act.
// Limits (register K): max 2 per episode, never two in a row, never over a real photo of a person's face; not for calm
// reflective moments.
export const StaticBurst: React.FC<{ from: React.ReactNode; to: React.ReactNode; atSec?: number; frames?: number; strength?: number }> = ({
  from,
  to,
  atSec = 0,
  frames = 8,
  strength = 0.75,
}) => {
  useAsset("TRN-014");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const cut = a + Math.floor(frames / 2);
  const end = a + frames;
  const on = frame >= a && frame < end;
  const k = frame - a;
  const env = on ? Math.sin((Math.PI * (k + 0.5)) / frames) : 0; // up then down
  const shot = frame < cut ? from : to;
  const split = 10 * env;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='270'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${frame}'/>` +
    `<feColorMatrix type='saturate' values='0'/></filter><rect width='480' height='270' filter='url(%23n)'/></svg>`;
  const tears = Array.from({ length: 5 }, (_, i) => ({ y: random(`t${frame}-${i}`) * 1080, h: 4 + random(`h${frame}-${i}`) * 26, dx: (random(`x${frame}-${i}`) - 0.5) * 120 }));
  return (
    <AbsoluteFill>
      {on ? (
        <>
          <AbsoluteFill style={{ transform: `translateX(${-split}px)`, mixBlendMode: "screen", filter: "url(#sbR)" }}>{shot}</AbsoluteFill>
          <AbsoluteFill style={{ transform: `translateX(${split}px)`, mixBlendMode: "screen", filter: "url(#sbB)" }}>{shot}</AbsoluteFill>
          <svg width={0} height={0} style={{ position: "absolute" }}>
            <filter id="sbR"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0.5 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
            <filter id="sbB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0.5 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
          </svg>
          {tears.map((t, i) => (
            <div key={i} style={{ position: "absolute", left: t.dx, top: t.y, width: 1920, height: t.h, overflow: "hidden", opacity: env }}>
              <div style={{ position: "absolute", top: -t.y, width: 1920, height: 1080 }}>{shot}</div>
            </div>
          ))}
          <AbsoluteFill
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.replace("%23", "#"))}")`,
              backgroundSize: "100% 100%",
              opacity: strength * env,
              mixBlendMode: "screen",
            }}
          />
        </>
      ) : (
        <AbsoluteFill>{shot}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
