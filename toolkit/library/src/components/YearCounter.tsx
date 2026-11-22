import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, exit, lock, reveal, rise, sec } from "../motion";

// VIS-018 YearCounter (beat type 2: one big span of time said out loud, peak on the lock).
// A large number counts up from `from` and locks on `to` with its unit on the spoken word, then may dim.
export type YearCounterProps = {
  from?: number;
  to: number;
  unit: string;
  countFromSec: number;
  lockSec: number; // the number reaches `to` and locks here
  dimAtSec?: number;
  caption?: string; // small mono line under it
  startSec?: number;
};

export const YearCounter: React.FC<YearCounterProps> = ({ from = 0, to, unit, countFromSec, lockSec, dimAtSec, caption, startSec = 0 }) => {
  useAssets(["VIS-018", "MOT-001", "MOT-002", "MOT-003"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (lockSec <= countFromSec) throw new Error("YearCounter: lockSec must come after countFromSec");
  const v = interpolate(frame, [sec(countFromSec, fps), sec(lockSec, fps)], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pIn = reveal(frame, fps, startSec, t.motion.enterSec);
  const pLock = lock(frame, fps, lockSec);
  const dim = dimAtSec !== undefined ? 0.35 + 0.65 * exit(frame, fps, dimAtSec, 0.9) : 1;
  const locked = frame >= sec(lockSec, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: dim, transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 36, ...rise(pIn, 24) }}>
        <div
          style={{
            fontFamily: t.fonts.headline,
            fontWeight: t.fonts.headlineWeight,
            fontSize: 300,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            color: locked ? t.colors.accent : t.colors.ink,
          }}
        >
          {Math.round(v)}
        </div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 64, letterSpacing: 8, color: t.colors.ink }}>{unit}</div>
      </div>
      {caption ? (
        <div style={{ marginTop: 40, fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 3, color: t.colors.secondary, opacity: pLock }}>
          {caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
