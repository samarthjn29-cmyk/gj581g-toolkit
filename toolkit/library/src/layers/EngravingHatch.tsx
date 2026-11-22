import React from "react";
import { useAsset } from "../registry";
import { useTheme } from "../themes";

// TEX-005 EngravingHatch (studied Ben Marriott's Best Motion Design of 2026, "texture as a palette from the start";
// analysis only): our own drawings of the 1790s-1840s shaded the way engravings of the time were, with parallel
// lines whose weight follows the tone and a second, crossing set in the dark parts. It is the drawing's palette,
// not a filter on top. Lines are at least 6 px apart so YouTube's encoder keeps them clean.
// Use: <HatchDefs/> once inside an <svg><defs>, then fill={hatch(tone)} on any shape (tone 0..1).
const SPACING = 7;
const LEVELS = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];

export const HatchDefs: React.FC<{
  prefix?: string;
  angle?: number;
  color?: string;
}> = ({ prefix = "hatch", angle = -35, color }) => {
  useAsset("TEX-005");
  const t = useTheme();
  const ink = color ?? t.colors.ink;
  return (
    <>
      {LEVELS.map((lv, i) => {
        const w = Math.max(0.7, SPACING * lv * 0.55);
        const cross = lv >= 0.6;
        return (
          <pattern
            key={i}
            id={`${prefix}-${i}`}
            width={SPACING}
            height={SPACING}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${angle})`}
          >
            <rect
              x={0}
              y={(SPACING - w) / 2}
              width={SPACING}
              height={w}
              fill={ink}
            />
            {cross ? (
              <rect
                x={(SPACING - w * 0.7) / 2}
                y={0}
                width={w * 0.7}
                height={SPACING}
                fill={ink}
                opacity={0.85}
              />
            ) : null}
          </pattern>
        );
      })}
    </>
  );
};

// The fill for a tone (0 = paper, 1 = darkest): the nearest hatch level, or none for paper.
export const hatch = (tone: number, prefix = "hatch"): string => {
  if (tone < 0.08) return "none";
  let best = 0;
  LEVELS.forEach((lv, i) => {
    if (Math.abs(lv - tone) < Math.abs(LEVELS[best] - tone)) best = i;
  });
  return `url(#${prefix}-${best})`;
};
