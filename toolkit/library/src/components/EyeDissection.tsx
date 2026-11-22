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
    group?: number;
  }[]; // group: lines that share a column
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

  // Meridians and parallels (faint) keep the drawing's volume; shading, vessels, iris and the optic nerve make it an eye.
  const meridians = [0.3, 0.62, 0.88].map((k) => R * k);
  const parallels = [-0.55, 0, 0.55];
  const cutLen =
    Math.PI *
    (3 * (cutRx + cutRy) -
      Math.sqrt((3 * cutRx + cutRy) * (cutRx + 3 * cutRy)));
  // The eye looks front-left; a slow drift of the gaze (12 px over the shot) keeps the drawing alive.
  const gaze = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const iris = { x: cx - R * 0.64 + gaze, rx: R * 0.17, ry: R * 0.42 };
  const pupil = { rx: iris.rx * 0.4, ry: iris.ry * 0.4 };
  // Thin vessels on the white, running from the back towards the iris (seeded, the same every frame).
  const vessels = [
    [0.15, -0.55, -0.32, -0.3, -0.45, -0.16],
    [0.25, 0.5, -0.2, 0.32, -0.43, 0.18],
    [0.35, -0.1, -0.1, -0.05, -0.38, 0.02],
    [-0.05, -0.75, -0.3, -0.62, -0.5, -0.34],
    [0.05, 0.78, -0.28, 0.6, -0.5, 0.36],
  ].map(
    (v) =>
      `M ${cx + v[0] * R} ${cy + v[1] * R} Q ${cx + v[2] * R} ${cy + v[3] * R} ${cx + v[4] * R} ${cy + v[5] * R}`,
  );
  const fibres = 44;

  const ball = (side: "front" | "back") => (
    <g clipPath={`url(#${side}${uid})`}>
      <circle cx={cx} cy={cy} r={R} fill={`url(#shade${uid})`} />
      {meridians.map((m) => (
        <ellipse
          key={m}
          cx={cx}
          cy={cy}
          rx={m}
          ry={R}
          fill="none"
          stroke={ink}
          strokeOpacity={0.07}
          strokeWidth={1}
        />
      ))}
      {parallels.map((q) => (
        <ellipse
          key={q}
          cx={cx}
          cy={cy + q * R}
          rx={R * Math.sqrt(1 - q * q)}
          ry={R * 0.12 * Math.sqrt(1 - q * q)}
          fill="none"
          stroke={ink}
          strokeOpacity={0.06}
          strokeWidth={1}
        />
      ))}
      {vessels.map((d, k) => (
        <path
          key={k}
          d={d}
          fill="none"
          stroke={t.colors.cones.L}
          strokeOpacity={0.28}
          strokeWidth={k < 3 ? 1.6 : 1.1}
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={cy} r={R} fill={`url(#rim${uid})`} />
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke={ink}
        strokeWidth={2.6}
      />
      {side === "front" ? (
        <g>
          <ellipse
            cx={iris.x}
            cy={cy}
            rx={iris.rx}
            ry={iris.ry}
            fill={`url(#iris${uid})`}
            stroke={ink}
            strokeWidth={2.4}
          />
          {Array.from({ length: fibres }, (_, k) => {
            const ang = (k / fibres) * Math.PI * 2;
            const wob = 0.06 * Math.sin(k * 2.7);
            return (
              <line
                key={k}
                x1={iris.x + Math.cos(ang) * pupil.rx * 1.08}
                y1={cy + Math.sin(ang) * pupil.ry * 1.08}
                x2={iris.x + Math.cos(ang + wob) * iris.rx * 0.94}
                y2={cy + Math.sin(ang + wob) * iris.ry * 0.94}
                stroke={ink}
                strokeOpacity={k % 3 === 0 ? 0.45 : 0.22}
                strokeWidth={1}
              />
            );
          })}
          <ellipse
            cx={iris.x}
            cy={cy}
            rx={iris.rx * 0.62}
            ry={iris.ry * 0.62}
            fill="none"
            stroke={ink}
            strokeOpacity={0.35}
            strokeWidth={1.2}
            strokeDasharray="3 5"
          />
          <ellipse
            cx={iris.x}
            cy={cy}
            rx={pupil.rx}
            ry={pupil.ry}
            fill={t.colors.dimMask}
            stroke={ink}
            strokeOpacity={0.6}
            strokeWidth={1.6}
          />
          {/* The cornea: a clear dome over the iris, with a window-shaped highlight. */}
          <path
            d={`M ${iris.x + 10} ${cy - iris.ry * 1.22} Q ${iris.x - R * 0.34} ${cy} ${iris.x + 10} ${cy + iris.ry * 1.22}`}
            fill={ink}
            fillOpacity={0.04}
            stroke={ink}
            strokeOpacity={0.6}
            strokeWidth={1.8}
          />
          <ellipse
            cx={iris.x - iris.rx * 0.25}
            cy={cy - iris.ry * 0.38}
            rx={iris.rx * 0.18}
            ry={iris.ry * 0.12}
            fill={ink}
            opacity={0.75}
            transform={`rotate(-20 ${iris.x - iris.rx * 0.25} ${cy - iris.ry * 0.38})`}
          />
        </g>
      ) : (
        <g>
          {/* The optic nerve leaving the back of the eye. */}
          <path
            d={`M ${cx + R * 0.93} ${cy - 38} C ${cx + R * 1.12} ${cy - 40} ${cx + R * 1.3} ${cy - 30} ${cx + R * 1.42} ${cy - 22} L ${cx + R * 1.42} ${cy + 46} C ${cx + R * 1.3} ${cy + 52} ${cx + R * 1.12} ${cy + 58} ${cx + R * 0.93} ${cy + 56}`}
            fill={t.colors.panel}
            stroke={ink}
            strokeWidth={2.4}
          />
          <path
            d={`M ${cx + R * 0.98} ${cy + 10} C ${cx + R * 1.15} ${cy + 8} ${cx + R * 1.3} ${cy + 12} ${cx + R * 1.42} ${cy + 12}`}
            fill="none"
            stroke={ink}
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        </g>
      )}
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
          <radialGradient id={`shade${uid}`} cx="34%" cy="36%" r="72%">
            <stop offset="0%" stopColor={ink} stopOpacity={0.2} />
            <stop offset="55%" stopColor={t.colors.panel} stopOpacity={1} />
            <stop offset="100%" stopColor={t.colors.canvas} stopOpacity={1} />
          </radialGradient>
          <radialGradient id={`rim${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={ink} stopOpacity={0} />
            <stop offset="100%" stopColor={ink} stopOpacity={0.12} />
          </radialGradient>
          <radialGradient id={`iris${uid}`} cx="50%" cy="50%" r="50%">
            <stop
              offset="30%"
              stopColor={t.colors.secondary}
              stopOpacity={0.55}
            />
            <stop
              offset="100%"
              stopColor={t.colors.secondary}
              stopOpacity={0.18}
            />
          </radialGradient>
          <radialGradient id={`jelly${uid}`} cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor={ink} stopOpacity={0.16} />
            <stop offset="100%" stopColor={ink} stopOpacity={0.03} />
          </radialGradient>
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
            fill={ink}
            fillOpacity={0.85}
            stroke={ink}
            strokeWidth={2.6}
          />
          <ellipse
            cx={cutX}
            cy={cy}
            rx={cutRx * 0.9}
            ry={cutRy * 0.95}
            fill={t.colors.canvas}
          />
          <ellipse
            cx={cutX}
            cy={cy}
            rx={cutRx * 0.86}
            ry={cutRy * 0.915}
            fill="none"
            stroke={t.colors.accent}
            strokeWidth={4}
            strokeOpacity={0.85}
          />
          <ellipse
            cx={cutX}
            cy={cy}
            rx={cutRx * 0.8}
            ry={cutRy * 0.87}
            fill={`url(#jelly${uid})`}
          />
          {[0.25, 0.5, 0.72].map((k) => (
            <ellipse
              key={k}
              cx={cutX}
              cy={cy}
              rx={cutRx * 0.8 * k}
              ry={cutRy * 0.87 * k}
              fill="none"
              stroke={ink}
              strokeOpacity={0.06}
              strokeWidth={1}
            />
          ))}
          {jellyTint ? (
            <ellipse
              cx={cutX}
              cy={cy}
              rx={cutRx * 0.8}
              ry={cutRy * 0.87}
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
              strokeWidth={2.6}
            />
            <path
              d={`M ${cutX} ${cy - cutRy * 0.95} A ${cutRx * 0.86} ${cutRy * 0.915} 0 0 1 ${cutX} ${cy + cutRy * 0.95}`}
              fill="none"
              stroke={t.colors.accent}
              strokeOpacity={0.6}
              strokeWidth={3}
            />
            <ellipse
              cx={cutX + cutRx * 0.32}
              cy={cy}
              rx={cutRx * 0.34}
              ry={cutRy * 0.3}
              fill={ink}
              fillOpacity={0.12}
              stroke={ink}
              strokeOpacity={0.7}
              strokeWidth={1.8}
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
              fontSize={28}
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
      {/* Words sit in groups; each group has its own column at the same place, and a new group only arrives once
          the group before it has gone (Sam, act 1 v3: the next line appeared under the fading one, then jumped up). */}
      {Array.from(new Set(words.map((w) => w.group ?? 0))).map(
        (g, gi, groups) => {
          const prevUntil = Math.max(
            -Infinity,
            ...words
              .filter(
                (w) =>
                  groups.indexOf(w.group ?? 0) < gi && w.untilSec !== undefined,
              )
              .map((w) => w.untilSec as number),
          );
          return (
            <div
              key={g}
              style={{
                position: "absolute",
                left: t.safe.x,
                top: 300,
                width: 760,
              }}
            >
              {words
                .filter((w) => (w.group ?? 0) === g)
                .map((w) => {
                  const at = Number.isFinite(prevUntil)
                    ? Math.max(w.atSec, prevUntil + 0.6)
                    : w.atSec;
                  const p = reveal(frame, fps, at, t.motion.enterSec);
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
          );
        },
      )}
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
