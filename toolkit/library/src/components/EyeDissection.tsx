import React, { useId } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, exit, reveal, rise, sec, SLOW_OUT } from "../motion";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-022 EyeDissection (beat type 4: the request to examine his eyes and the examination itself, calm).
// A whole eyeball in three-quarter view, drawn as a fine anatomical line drawing (meridians for volume,
// iris and cornea facing front-left), on a faint drafting ground (guide circles, a crosshair, ticks).
// On cue a cut line traces around it (`cutAtSec`); later the front cap lifts away (`openAtSec`), showing the
// cut face inside: the white outer coat, the back lining and the clear jelly, with optional labels.
// The spoken words sit beside it (`words`), each on its word. Line art only: no blood, no realism.
export type EyeDissectionProps = {
  cutAtSec?: number;
  openAtSec?: number;
  jellyTint?: { color: string; atSec: number; clearAtSec?: number }; // e.g. a blue tint that clears
  parts?: { part: "coat" | "lining" | "jelly"; text: string; atSec: number }[];
  words?: {
    text: string;
    atSec: number;
    style?: "serif" | "mono";
    untilSec?: number;
  }[];
  dimAtSec?: number;
  tag?: DatelineTagProps;
  startSec?: number;
};

export const EyeDissection: React.FC<EyeDissectionProps> = ({
  cutAtSec,
  openAtSec,
  jellyTint,
  parts = [],
  words = [],
  dimAtSec,
  tag,
  startSec = 0,
}) => {
  useAssets(["VIS-022", "MOT-001", "MOT-002", "MOT-003"]);
  const t = useTheme();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ease = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  } as const;
  const ink = t.colors.ink;
  const hair = t.colors.secondary; // drafting ground, drawn at low opacity

  const R = 300;
  const cx = 1330;
  const cy = 540;
  const cutX = cx - 70; // the cut plane, seen edge-on as an ellipse
  const cutRx = 92;
  const cutRy = Math.sqrt(R * R - (cutX - cx) ** 2);
  const pIn = reveal(frame, fps, startSec, 0.9);
  const pCut =
    cutAtSec !== undefined
      ? interpolate(
          frame,
          [sec(cutAtSec, fps), sec(cutAtSec + 1.3, fps)],
          [0, 1],
          ease,
        )
      : 0;
  const pOpen =
    openAtSec !== undefined
      ? interpolate(
          frame,
          [sec(openAtSec, fps), sec(openAtSec + 1.4, fps)],
          [0, 1],
          ease,
        )
      : 0;
  const dim =
    dimAtSec !== undefined ? 0.45 + 0.55 * exit(frame, fps, dimAtSec, 0.9) : 1;
  const tint =
    jellyTint === undefined
      ? 0
      : interpolate(
          frame,
          [sec(jellyTint.atSec, fps), sec(jellyTint.atSec + 1, fps)],
          [0, 0.55],
          ease,
        ) *
        (jellyTint.clearAtSec !== undefined
          ? interpolate(
              frame,
              [
                sec(jellyTint.clearAtSec, fps),
                sec(jellyTint.clearAtSec + 1.4, fps),
              ],
              [1, 0],
              ease,
            )
          : 1);

  // Meridians (vertical ellipses) and parallels give the ball its volume.
  const meridians = [0.25, 0.55, 0.82].map((k) => R * k);
  const parallels = [-0.55, 0, 0.55];
  const cutLen =
    Math.PI *
    (3 * (cutRx + cutRy) -
      Math.sqrt((3 * cutRx + cutRy) * (cutRx + 3 * cutRy)));
  const iris = { x: cx - R * 0.62, rx: R * 0.16, ry: R * 0.4 };

  const ball = (side: "front" | "back") => (
    <g clipPath={`url(#${side}${uid})`}>
      <circle cx={cx} cy={cy} r={R} fill={t.colors.panel} />
      {meridians.map((m) => (
        <ellipse
          key={m}
          cx={cx}
          cy={cy}
          rx={m}
          ry={R}
          fill="none"
          stroke={ink}
          strokeOpacity={0.14}
          strokeWidth={1.2}
        />
      ))}
      {parallels.map((p) => (
        <ellipse
          key={p}
          cx={cx}
          cy={cy + p * R}
          rx={R * Math.sqrt(1 - p * p)}
          ry={R * 0.12 * Math.sqrt(1 - p * p)}
          fill="none"
          stroke={ink}
          strokeOpacity={0.12}
          strokeWidth={1.2}
        />
      ))}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={ink} strokeWidth={3} />
      {side === "front" ? (
        <g>
          <ellipse
            cx={iris.x}
            cy={cy}
            rx={iris.rx}
            ry={iris.ry}
            fill="none"
            stroke={ink}
            strokeWidth={2.6}
          />
          {Array.from({ length: 14 }, (_, k) => {
            const a = (k / 14) * Math.PI * 2;
            return (
              <line
                key={k}
                x1={iris.x + Math.cos(a) * iris.rx * 0.45}
                y1={cy + Math.sin(a) * iris.ry * 0.45}
                x2={iris.x + Math.cos(a) * iris.rx * 0.92}
                y2={cy + Math.sin(a) * iris.ry * 0.92}
                stroke={ink}
                strokeOpacity={0.35}
                strokeWidth={1.2}
              />
            );
          })}
          <ellipse
            cx={iris.x}
            cy={cy}
            rx={iris.rx * 0.42}
            ry={iris.ry * 0.42}
            fill={t.colors.dimMask}
            stroke={ink}
            strokeWidth={2}
          />
          <path
            d={`M ${iris.x + 8} ${cy - iris.ry * 1.25} Q ${iris.x - R * 0.3} ${cy} ${iris.x + 8} ${cy + iris.ry * 1.25}`}
            fill="none"
            stroke={ink}
            strokeOpacity={0.55}
            strokeWidth={2}
          />
        </g>
      ) : null}
    </g>
  );

  return (
    <AbsoluteFill style={{ opacity: pIn * dim }}>
      {/* Drafting ground: guide circles, crosshair and ticks, so the frame reads as a working drawing. */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {[1.25, 1.5, 1.8].map((k) => (
          <circle
            key={k}
            cx={cx}
            cy={cy}
            r={R * k}
            fill="none"
            stroke={hair}
            strokeOpacity={0.22}
            strokeWidth={1}
            strokeDasharray="4 10"
          />
        ))}
        <line
          x1={cx - R * 1.9}
          y1={cy}
          x2={cx + R * 1.9}
          y2={cy}
          stroke={hair}
          strokeOpacity={0.2}
          strokeWidth={1}
        />
        <line
          x1={cx}
          y1={cy - R * 1.7}
          x2={cx}
          y2={cy + R * 1.7}
          stroke={hair}
          strokeOpacity={0.2}
          strokeWidth={1}
        />
        {Array.from({ length: 25 }, (_, k) => (
          <line
            key={k}
            x1={cx - R * 1.5 + k * R * 0.125}
            y1={cy + R * 1.55}
            x2={cx - R * 1.5 + k * R * 0.125}
            y2={cy + R * 1.55 + (k % 4 === 0 ? 18 : 9)}
            stroke={hair}
            strokeOpacity={0.3}
            strokeWidth={1.2}
          />
        ))}
      </svg>
      <svg
        width={1920}
        height={1080}
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${drift(frame, durationInFrames, 0.02)})`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        <defs>
          <clipPath id={`front${uid}`}>
            <rect x={0} y={0} width={cutX} height={1080} />
          </clipPath>
          <clipPath id={`back${uid}`}>
            <rect x={cutX} y={0} width={1920 - cutX} height={1080} />
          </clipPath>
        </defs>
        {ball("back")}
        {/* The cut face (seen once the front cap lifts): outer coat, back lining, clear jelly. */}
        <g opacity={pOpen}>
          <ellipse
            cx={cutX}
            cy={cy}
            rx={cutRx}
            ry={cutRy}
            fill={t.colors.canvas}
            stroke={ink}
            strokeWidth={3}
          />
          <ellipse
            cx={cutX}
            cy={cy}
            rx={cutRx * 0.9}
            ry={cutRy * 0.94}
            fill="none"
            stroke={t.colors.accent}
            strokeWidth={4}
            strokeOpacity={0.8}
          />
          <ellipse
            cx={cutX}
            cy={cy}
            rx={cutRx * 0.84}
            ry={cutRy * 0.88}
            fill={ink}
            fillOpacity={0.06}
          />
          {jellyTint ? (
            <ellipse
              cx={cutX}
              cy={cy}
              rx={cutRx * 0.84}
              ry={cutRy * 0.88}
              fill={jellyTint.color}
              opacity={tint}
            />
          ) : null}
        </g>
        {/* The front cap: whole eye at first; lifts up and away on openAtSec. */}
        <g
          transform={`translate(${-220 * pOpen} ${-40 * pOpen}) rotate(${-14 * pOpen} ${cutX} ${cy})`}
        >
          {ball("front")}
          <g opacity={pOpen}>
            <path
              d={`M ${cutX} ${cy - cutRy} A ${cutRx} ${cutRy} 0 0 1 ${cutX} ${cy + cutRy}`}
              fill={t.colors.canvas}
              stroke={ink}
              strokeWidth={3}
            />
          </g>
        </g>
        {/* The cut line: traces around the ball like a guide for the knife (accent, dashed). */}
        {cutAtSec !== undefined ? (
          <ellipse
            cx={cutX}
            cy={cy}
            rx={cutRx}
            ry={cutRy}
            fill="none"
            stroke={t.colors.accent}
            strokeWidth={3}
            strokeDasharray={`${cutLen * pCut} ${cutLen}`}
            opacity={1 - pOpen}
          />
        ) : null}
        {parts.map((p) => {
          const pos: Record<string, [number, number]> = {
            coat: [cutX, cy - cutRy - 34],
            lining: [cutX + cutRx + 150, cy - cutRy * 0.55],
            jelly: [cutX + cutRx + 150, cy + 20],
          };
          const [x, y] = pos[p.part];
          return (
            <text
              key={p.part}
              x={x}
              y={y}
              fontFamily={t.fonts.mono}
              fontSize={24}
              letterSpacing={3}
              fill={t.colors.secondary}
              textAnchor={p.part === "coat" ? "middle" : "start"}
              opacity={reveal(frame, fps, p.atSec, 0.6)}
            >
              {p.text}
            </text>
          );
        })}
      </svg>
      <div
        style={{ position: "absolute", left: t.safe.x, top: 300, width: 760 }}
      >
        {words
          .filter(
            (w) =>
              w.untilSec === undefined || frame < sec(w.untilSec + 0.6, fps),
          ) // gone words leave the column
          .map((w) => {
            const p = reveal(frame, fps, w.atSec, t.motion.enterSec);
            const out =
              w.untilSec !== undefined
                ? exit(frame, fps, w.untilSec, t.motion.enterSec)
                : 1;
            const mono = w.style === "mono";
            return (
              <div
                key={w.text}
                style={{
                  fontFamily: mono ? t.fonts.mono : t.fonts.headline,
                  fontWeight: mono ? 500 : t.fonts.headlineWeight,
                  fontSize: mono ? 30 : 72,
                  lineHeight: mono ? 1.5 : 1.05,
                  letterSpacing: mono ? 3 : t.fonts.headlineTracking,
                  color: mono ? t.colors.secondary : t.colors.ink,
                  marginBottom: mono ? 10 : 22,
                  ...rise(p * out, mono ? 12 : 24),
                }}
              >
                {w.text}
              </div>
            );
          })}
      </div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
