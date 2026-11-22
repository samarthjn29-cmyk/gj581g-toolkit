import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sec, SLOW_OUT } from "../motion";

// TXT-022 RuledTitle (studied byl, 'How I Edit Documentary Video LIKE Johnny Harris in Capcut (Part 1)', 22 Nov 2026;
// analysis only): a title between two thin rules that draw out from the centre above and below it, then the title
// scales up slowly (3-5%) while it is held. Ours: the rules are the theme hairline in the ink colour, 2 px,
// 0.7 s from the centre; the scale is capped at 5% so it stays calm.
// Best use: naming a document, place or case the first time (THE ... MEMO, OPTICKS). Limit: max 2 per act; pairs
// with TXT-021 TypewriterLine, not with KeywordSlab in the same shot.
export type RuledSpec = { atSec: number; grow?: number; holdSec?: number };

export const Ruled: React.FC<{
  spec: RuledSpec;
  color: string;
  children: React.ReactNode;
}> = ({ spec, color, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spec.grow ?? 0.04;
  if (grow > 0.05)
    throw new Error(`RuledTitle: grow ${grow} over the calm cap of 0.05.`);
  const a = sec(spec.atSec, fps);
  const p = interpolate(frame, [a, a + sec(0.7, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  const hold = spec.holdSec ?? 4;
  const s =
    1 +
    grow *
      interpolate(frame, [a, a + sec(hold, fps)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const rule: React.CSSProperties = {
    height: 2,
    background: color,
    opacity: 0.85,
    width: `${p * 100}%`,
    margin: "0 auto",
  };
  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${s})`,
        transformOrigin: "50% 50%",
      }}
    >
      <span style={{ display: "block", ...rule, marginBottom: "0.32em" }} />
      <span style={{ display: "block", padding: "0 0.4em" }}>{children}</span>
      <span style={{ display: "block", ...rule, marginTop: "0.32em" }} />
    </span>
  );
};
