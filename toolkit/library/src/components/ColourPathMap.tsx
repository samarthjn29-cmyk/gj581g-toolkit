import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, lock, reveal, rise } from "../motion";

// VIS-011 ColourPathMap: the season device of Where Colour Lives.
// Five stops (light, object, eye, brain, words); the stops visited so far glow, the current one is ringed.
const STOPS = [
  { key: "light", label: "Light" },
  { key: "object", label: "Object" },
  { key: "eye", label: "Eye" },
  { key: "brain", label: "Brain" },
  { key: "words", label: "Words" },
] as const;
type StopKey = (typeof STOPS)[number]["key"];

export type ColourPathMapProps = {
  lit: StopKey[];
  current?: StopKey;
  kicker?: string;
  caption?: string;
  startSec?: number;
};

export const ColourPathMap: React.FC<ColourPathMapProps> = ({ lit, current, kicker = "PREVIOUSLY", caption, startSec = 0 }) => {
  useAssets(["VIS-011", "MOT-001", "MOT-002", "MOT-003"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const st = t.motion.staggerSec;
  const x0 = 360;
  const gap = 300;
  const y = 520;
  const pLine = reveal(frame, fps, startSec + 0.1, 0.9);
  const pKick = reveal(frame, fps, startSec, t.motion.enterSec);
  const pCap = reveal(frame, fps, startSec + st * 7, t.motion.enterSec);
  const lineEnd = x0 + gap * 4;

  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <div style={{ position: "absolute", left: t.safe.x, top: 220, fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 5, color: t.colors.accent, ...rise(pKick, 14) }}>
        {kicker}
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x0} y1={y} x2={x0 + (lineEnd - x0) * pLine} y2={y} stroke={t.colors.hairline} strokeWidth={2} />
      </svg>
      {STOPS.map((s, i) => {
        const cx = x0 + gap * i;
        const on = lit.includes(s.key);
        const isCur = s.key === current;
        const p = reveal(frame, fps, startSec + st * (i + 1), t.motion.enterSec);
        const ring = isCur ? lock(frame, fps, startSec + st * 6) : 0;
        const glow = on ? interpolate(p, [0, 1], [0, 1]) : 0;
        return (
          <div key={s.key} style={{ position: "absolute", left: cx - 120, top: y - 34, width: 240, textAlign: "center", ...rise(p, 18) }}>
            <div
              style={{
                margin: "0 auto",
                width: 68,
                height: 68,
                borderRadius: "50%",
                border: `2px solid ${on ? t.colors.accent : t.colors.secondary}`,
                background: on ? t.colors.accent : "transparent",
                boxShadow: on ? `0 0 ${40 * glow}px ${t.colors.accentSoft}` : "none",
                outline: isCur ? `3px solid ${t.colors.ink}` : "none",
                outlineOffset: isCur ? 10 + (1 - ring) * 14 : 0,
                opacity: on || isCur ? 1 : 0.7,
              }}
            />
            <div
              style={{
                marginTop: 34,
                fontFamily: t.fonts.serif,
                fontWeight: isCur ? t.fonts.titleWeight : 400,
                fontSize: isCur ? 46 : 36,
                color: isCur || on ? t.colors.ink : t.colors.secondary,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: t.safe.x,
            right: t.safe.x,
            top: 760,
            textAlign: "center",
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontSize: 40,
            color: t.colors.secondary,
            ...rise(pCap, 16),
          }}
        >
          {caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
