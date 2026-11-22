import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, lock, reveal, rise, sec } from "../motion";

// VIS-006 CleanUICard (beat type 6: web, spec or process evidence, calm).
// A stripped-down card whose rows light up one at a time; no sidebars, no clutter.
export type CleanUICardProps = {
  kicker: string;
  title: string;
  nodes: { label: string; detail: string }[];
  firstSec?: number;
  stepSec?: number;
  startSec?: number;
};

export const CleanUICard: React.FC<CleanUICardProps> = ({ kicker, title, nodes, firstSec = 1, stepSec = 1, startSec = 0 }) => {
  useAssets(["VIS-006", "MOT-001", "MOT-002", "MOT-003"]);
  if (nodes.length < 2 || nodes.length > 5) throw new Error("CleanUICard takes 2-5 rows.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pCard = reveal(frame, fps, startSec, t.motion.enterSec);
  const active = Math.min(nodes.length - 1, Math.floor((frame - sec(firstSec, fps)) / Math.max(1, sec(stepSec, fps))));
  const cardW = 1120;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <div
        style={{
          width: cardW,
          background: t.colors.panel,
          borderRadius: 16,
          border: `1px solid ${t.colors.hairline}`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
          padding: "44px 56px 30px",
          ...rise(pCard, 34),
        }}
      >
        <div style={{ fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 2.5, color: t.colors.secondary }}>{kicker}</div>
        <div
          style={{
            fontFamily: t.fonts.headline,
            fontWeight: t.fonts.headlineWeight,
            letterSpacing: t.fonts.headlineTracking,
            fontSize: 54,
            color: t.colors.ink,
            margin: "12px 0 26px",
          }}
        >
          {title}
        </div>
        {nodes.map((n, i) => {
          const pRow = reveal(frame, fps, startSec + t.motion.staggerSec * (i + 2), t.motion.enterSec);
          const on = i === active ? lock(frame, fps, firstSec + i * stepSec) : 0;
          const was = i < active ? 1 : 0;
          const ink = interpolate(on, [0, 1], [0, 1]);
          return (
            <div
              key={n.label}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                padding: "22px 0 22px 34px",
                borderTop: `1px solid ${t.colors.hairline}`,
                ...rise(pRow, 16),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 18,
                  bottom: 18,
                  width: 6,
                  borderRadius: 3,
                  background: t.colors.accent,
                  opacity: Math.max(ink, was * 0.35),
                  transform: `scaleY(${Math.max(ink, was)})`,
                }}
              />
              <div style={{ fontFamily: t.fonts.serif, fontSize: 38, color: ink > 0.5 || was ? t.colors.ink : t.colors.secondary }}>{n.label}</div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 24, color: ink > 0.5 ? t.colors.accent : t.colors.secondary }}>{n.detail}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
