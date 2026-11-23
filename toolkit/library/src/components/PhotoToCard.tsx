import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAsset } from "../registry";
import { useTheme } from "../themes";
import { sec } from "../motion";

// TRN-003 PhotoToCardMatchCut (own build, 23 Nov 2026): the whole old shot (a full-frame photo or page) shrinks and
// flies into the place where it sits in the next layout (a card, a thumbnail, a slot on a board), and the next shot
// builds up around it. So the viewer sees that the picture they were in is now one piece of a bigger picture.
// `rect` = where the picture lands in the new shot (x, y, w, h in frame px). The flying card gets a thin paper border
// and a soft shadow; inside the rect the new shot's own card takes over in the last 0.25 s.
// Calm: 0.9 s, eased; the new shot fades up behind the card; one move, no spin beyond `tilt`.
export const PhotoToCard: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  atSec?: number;
  durSec?: number;
  rect: [number, number, number, number];
  tilt?: number;
}> = ({ from, to, atSec = 0, durSec = 0.9, rect, tilt = 0 }) => {
  useAsset("TRN-003");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sec(atSec, fps);
  const d = Math.max(1, sec(durSec, fps));
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const p = interpolate(frame, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const [x, y, w, h] = rect;
  const s = 1 + (w / 1920 - 1) * p; // width scale; height follows the rect's own aspect at the end
  const sy = 1 + (h / 1080 - 1) * p;
  const cx = 960 + (x + w / 2 - 960) * p;
  const cy = 540 + (y + h / 2 - 540) * p;
  const bgO = interpolate(frame, [a + d * 0.15, a + d * 0.85], [0, 1], clamp);
  const handover = interpolate(frame, [a + d - sec(0.25, fps), a + d], [1, 0], clamp);
  const border = 10 * p;
  const done = frame >= a + d;
  if (frame < a) return <AbsoluteFill>{from}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: done ? 1 : bgO }}>{to}</AbsoluteFill>
      {!done ? (
        <div
          style={{
            position: "absolute",
            left: cx - 960,
            top: cy - 540,
            width: 1920,
            height: 1080,
            transform: `scale(${s}, ${sy}) rotate(${tilt * p}deg)`,
            transformOrigin: "50% 50%",
            opacity: handover,
            boxShadow: `0 ${30 * p}px ${80 * p}px rgba(0,0,0,${0.45 * p})`,
            outline: `${border / Math.max(s, 0.05)}px solid ${t.colors.ink}`,
            overflow: "hidden",
          }}
        >
          {from}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
