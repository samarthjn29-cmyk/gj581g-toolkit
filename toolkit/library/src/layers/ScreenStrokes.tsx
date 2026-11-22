import React, { useId } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";

// TEX-008 ScreenStrokes (studied byl, 'How I Edit Documentary Video LIKE Johnny Harris in Capcut (Part 1)',
// 22 Nov 2026; analysis only): slow white ink or smoke strokes in screen blend drifting across a black-and-white
// page or photo, so a held scan has one moving part. Ours are procedural (no stock overlay): 3-4 broad soft
// strokes, blurred, drifting a few pixels a second; `holes` keep them off the highlighted words.
// Best use: under a held document or a monochrome photo for 3+ s. Limit: max 3 per act; 0.2-0.4 strength;
// never over the words being highlighted, never on a colour photo.
// mode "light" (default): white strokes in screen blend, for dark or monochrome photos. mode "shadow": soft
// canvas-coloured strokes in multiply, for light paper pages, where white strokes would not show.
export type StrokesSpec = { strength?: number; seed?: number; speed?: number; mode?: "light" | "shadow" };
type Rect = { left: number; top: number; width: number; height: number };

export const ScreenStrokes: React.FC<{
  width: number;
  height: number;
  spec?: StrokesSpec;
  holes?: Rect[];
}> = ({ width, height, spec, holes = [] }) => {
  const th = useTheme();
  const shadow = spec?.mode === "shadow";
  const ink = shadow ? th.colors.canvas : th.colors.ink;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const strength = spec?.strength ?? (spec?.mode === "shadow" ? 0.18 : 0.28);
  if (strength < 0.15 || strength > 0.4)
    throw new Error(`ScreenStrokes: strength ${strength} outside 0.15-0.4.`);
  const seed = spec?.seed ?? 1;
  const speed = spec?.speed ?? 14; // px a second at 1920 wide
  const t = frame / fps;
  const n = 4;
  const strokes = Array.from({ length: n }, (_, i) => {
    const r = (k: string) => random(`ss${seed}-${i}-${k}`);
    const y0 = height * (0.1 + 0.8 * r("y"));
    const amp = height * (0.08 + 0.12 * r("a"));
    const w = Math.max(18, width * (0.03 + 0.05 * r("w")));
    const dir = r("d") > 0.5 ? 1 : -1;
    const dx = dir * speed * (0.6 + 0.8 * r("s")) * t * (width / 1920);
    const dy = Math.sin(t * 0.35 + i) * height * 0.015;
    const x0 = -width * 0.2 + dx;
    const x1 = width * 1.2 + dx;
    const d = `M ${x0} ${y0} C ${width * 0.3 + dx} ${y0 - amp}, ${width * 0.6 + dx} ${y0 + amp}, ${x1} ${y0 - amp * 0.4}`;
    return { d, w, dy, o: 0.55 + 0.45 * r("o") };
  });
  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        mixBlendMode: shadow ? "multiply" : "screen",
        opacity: strength,
      }}
    >
      <defs>
        <filter id={`ssb${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={Math.max(6, width / (spec?.mode === "shadow" ? 70 : 120))} />
        </filter>
        <mask id={`ssm${uid}`}>
          <rect width={width} height={height} fill="white" />
          {holes.map((h, i) => (
            <rect
              key={i}
              x={h.left - 24}
              y={h.top - 20}
              width={h.width + 48}
              height={h.height + 40}
              rx={10}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <g mask={`url(#ssm${uid})`} filter={`url(#ssb${uid})`}>
        {strokes.map((s, i) => (
          <path
            key={i}
            d={s.d}
            transform={`translate(0 ${s.dy})`}
            fill="none"
            stroke={ink}
            strokeOpacity={s.o}
            strokeWidth={s.w}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
};
