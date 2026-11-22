import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource } from "../registry";
import { drift, lock, rise, reveal } from "../motion";
import { CropImage, cropToBox, type Rect } from "../layers/CropImage";

// VIS-005 SpotlightIsolator (beat type 5: a detail in a crowded frame, calm).
// The frame dims around one region, accent corner brackets lock onto it, and a label chip names it.
export type SpotlightIsolatorProps = {
  srcId: string;
  imgSize: readonly [number, number];
  crop?: Rect;
  target: Rect;
  label: string;
  atSec?: number;
  startSec?: number;
};

export const SpotlightIsolator: React.FC<SpotlightIsolatorProps> = ({ srcId, imgSize, crop, target, label, atSec = 1, startSec = 0 }) => {
  useAssets(["VIS-005", "MOT-001", "MOT-003"]);
  const src = useSource(srcId);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = crop ?? ([0, 0, imgSize[0], imgSize[1]] as const);
  const r = cropToBox(c, 1920, 1080, "cover").map(target);
  const p = lock(frame, fps, atSec);
  const pIn = reveal(frame, fps, startSec, t.motion.enterSec);
  const pLabel = reveal(frame, fps, atSec + t.motion.staggerSec * 2, t.motion.enterSec);
  const gap = 16;
  const arm = 40;
  const k = 1.14 - 0.14 * p; // brackets close in from slightly wide
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const bw = (r.width / 2 + gap) * k;
  const bh = (r.height / 2 + gap) * k;
  const corner = (sx: number, sy: number) => (
    <div
      key={`${sx}${sy}`}
      style={{
        position: "absolute",
        left: sx < 0 ? cx - bw : cx + bw - arm,
        top: sy < 0 ? cy - bh : cy + bh - arm,
        width: arm,
        height: arm,
        borderColor: t.colors.accent,
        borderStyle: "solid",
        borderWidth: 0,
        [sy < 0 ? "borderTopWidth" : "borderBottomWidth"]: 5,
        [sx < 0 ? "borderLeftWidth" : "borderRightWidth"]: 5,
        opacity: p,
      }}
    />
  );
  const labelBelow = r.top + r.height + gap + 110 < 1080 - t.safe.y;

  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames)})`, transformOrigin: `${cx}px ${cy}px` }}>
        <CropImage src={src} imgSize={imgSize} crop={c} width={1920} height={1080} filter="grayscale(0.5) contrast(1.05)" />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
          <path
            fillRule="evenodd"
            fill={t.colors.dimMask}
            d={`M-2000 -2000 H3920 V3080 H-2000 Z M${r.left - gap} ${r.top - gap} h${r.width + gap * 2} v${r.height + gap * 2} h${-(r.width + gap * 2)} Z`}
          />
        </svg>
        {[-1, 1].flatMap((sx) => [-1, 1].map((sy) => corner(sx, sy)))}
        <div
          style={{
            position: "absolute",
            left: r.left - gap,
            top: labelBelow ? r.top + r.height + gap + 26 : r.top - gap - 86,
            fontFamily: t.fonts.mono,
            fontSize: 26,
            letterSpacing: 1.2,
            color: t.colors.ink,
            background: t.colors.chip,
            borderLeft: `5px solid ${t.colors.accent}`,
            padding: "10px 18px",
            borderRadius: 3,
            ...rise(pLabel, 14),
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
