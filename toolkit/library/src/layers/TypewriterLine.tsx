import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// TXT-021 TypewriterLine (studied RandomAI and MoSidd Vox-style demos, 22 Nov 2026; analysis only):
// mono caps typed letter by letter with a block cursor. The typing starts on the spoken word (atSec) and runs at
// `cps` letters a second (default 22, a fast but readable typist); the cursor blinks on twice after the last letter,
// then goes. Pair with SFX-027 TypewriterKeys (a typing run under the line, the bell only on a closing line).
// Best use: a closing line or a quoted line from a document. Limit: 1 per act.
export type TypeSpec = { cps?: number; cursor?: boolean };

export const typedCount = (
  text: string,
  frame: number,
  fps: number,
  atSec: number,
  cps = 22,
): number =>
  Math.max(0, Math.min(text.length, Math.floor((frame / fps - atSec) * cps)));

export const typeEndSec = (text: string, atSec: number, cps = 22): number =>
  atSec + text.length / cps;

export const Typed: React.FC<{
  text: string;
  atSec: number;
  spec?: TypeSpec;
  color: string;
}> = ({ text, atSec, spec, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cps = spec?.cps ?? 22;
  if (cps < 8 || cps > 40)
    throw new Error(
      `TypewriterLine: cps ${cps} outside 8-40 (unreadable or crawling).`,
    );
  const n = typedCount(text, frame, fps, atSec, cps);
  const t = frame / fps;
  const end = typeEndSec(text, atSec, cps);
  // Cursor: solid while typing, then two blinks (0.25 s on, 0.25 s off), then gone.
  const after = t - end;
  const cursorOn =
    spec?.cursor !== false &&
    t >= atSec &&
    (after < 0 || (after < 1.0 && Math.floor(after / 0.25) % 2 === 0));
  return (
    <span style={{ whiteSpace: "pre" }}>
      {/* The untyped rest stays in place (transparent), so the line never reflows while it types; the cursor has
          zero net width (negative right margin), so it doesn't push anything either. */}
      <span style={{ color }}>{text.slice(0, n)}</span>
      <span
        style={{
          display: "inline-block",
          width: "0.6em",
          height: "1.0em",
          marginRight: "-0.6em",
          verticalAlign: "-0.12em",
          background: color,
          opacity: cursorOn ? 0.85 : 0,
        }}
      />
      <span style={{ color: "transparent" }}>{text.slice(n)}</span>
    </span>
  );
};
