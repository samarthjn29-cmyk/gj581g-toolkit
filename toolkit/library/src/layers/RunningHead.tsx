import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAsset } from "../registry";

// TXT-013 RunningHead (studied Anton, 'Why Graphic Design Still Matters'; analysis only): a small mono running head
// naming the current act, on through the act, so the viewer always knows where they are. Ours sits top-RIGHT,
// because DatelineTag (TXT-011) owns the top-left corner. It shows only on shots that are diagrams, charts or
// text cards, and is off during title cards, quotes, pages and full-frame pictures (fading 0.3 s at each change).
// Best use: acts longer than 2 minutes. Limit: one per act; off during title cards, quotes and full-frame pictures.
export const HEAD_ON = new Set([
  "KineticLine", "ScaleField", "SwatchRows", "SplitComparisonCard", "ConeTrio", "ConeCurveChart", "SpectrumStrip",
  "EyeDiagram", "EyeDissection", "PerspectiveGrid", "YearCounter", "ColourPathMap", "LedgerCard", "MinimalDataChart",
]);
type B = { start: number; end: number; component: string; props: Record<string, unknown>; ground?: { kind: string; tone?: string } };
const allowed = (b: B) => {
  if (!HEAD_ON.has(b.component)) return false;
  const bd = b.props.backdrop as { layout?: string } | undefined;
  return !(bd && bd.layout === "full"); // a line over a full-frame picture counts as a full-frame picture
};

export const RunningHead: React.FC<{ text: string; beats: B[]; fromSec?: number }> = ({ text, beats, fromSec = 0 }) => {
  useAsset("TXT-013");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  if (now < fromSec) return null;
  // Opacity follows the shots: 1 inside an allowed shot, with 0.3 s ramps at the edges of each allowed run.
  let o = 0;
  let paper = false; // on a paper ground (LOK-027) the head takes the paper palette's secondary, so it reads
  for (const b of beats) {
    if (now >= b.start && now < b.end) paper = b.ground?.kind === "paper" && b.ground?.tone !== "dark";
    if (!allowed(b)) continue;
    const v = interpolate(now, [b.start, b.start + 0.3, b.end - 0.3, b.end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const prevOn = beats.some((p) => Math.abs(p.end - b.start) < 0.02 && allowed(p));
    const nextOn = beats.some((p) => Math.abs(p.start - b.end) < 0.02 && allowed(p));
    const inside = now >= b.start && now < b.end;
    if (!inside) continue;
    o = (prevOn && now < b.start + 0.3) || (nextOn && now > b.end - 0.3) ? 1 : v;
  }
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: t.safe.x,
        top: t.safe.y,
        fontFamily: t.fonts.mono,
        fontSize: 22,
        letterSpacing: 4,
        color: paper && t.paper?.secondary ? t.paper.secondary : t.colors.secondary,
        opacity: 0.85 * o,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
