import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSourceFile } from "../registry";
import { reveal, rise, sec, SLOW_OUT } from "../motion";
import { CropImage, type Rect } from "../layers/CropImage";

// VIS-027 StillsMontage (studied Ben Marriott, 'Best Motion Design of 2026'; analysis only): held stills that show
// time passing, set against one short burst of motion (stillness against action). Ours: real stills land one by
// one on a pile, each held, each with its year; a big mono year runs beside them between the spoken years; at
// `burst` the pile riffles (the held cards fly off in under a second) to the last still: the one burst per montage.
// Best use: a long span said out loud (1794 to 1844; 1844 to 1995), years passing in a life. Limit: max 3 beats
// per episode; one burst of motion per montage. Not for: comparisons.
type Still = { srcId: string; file?: string; imgSize: readonly [number, number]; crop?: Rect; label: string; atSec: number };
export type StillsMontageProps = {
  stills: Still[];
  years?: { from: number; to: number; atSec: number; untilSec: number; caption?: string };
  burst?: { atSec: number; sec?: number };
  source?: string;
  startSec?: number;
};

const CARD_H = 640;

export const StillsMontage: React.FC<StillsMontageProps> = ({ stills, years, burst, source, startSec = 0 }) => {
  useAssets(["VIS-027", "MOT-002", "MOT-003"]);
  if (stills.length < 3 || stills.length > 7) throw new Error("StillsMontage: 3-7 stills.");
  if (burst && (burst.sec ?? 0.7) > 1) throw new Error("StillsMontage: the burst lasts at most 1 s.");
  const srcs = stills.map((s) => useSourceFile(s.srcId, s.file)); // eslint-disable-line react-hooks/rules-of-hooks
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const pileX = 560;
  const pileY = 540;
  const b = burst ? sec(burst.atSec, fps) : null;
  const bd = burst?.sec ?? 0.7;
  const last = stills.length - 1;
  const pIn = reveal(frame, fps, startSec, t.motion.enterSec);
  const yearNow = years
    ? Math.round(interpolate(now, [years.atSec, years.untilSec], [years.from, years.to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
    : null;
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      {stills.map((st, i) => {
        const c = st.crop ?? ([0, 0, st.imgSize[0], st.imgSize[1]] as const);
        const w = Math.min(820, Math.round((CARD_H * c[2]) / c[3]));
        const land = interpolate(frame, [sec(st.atSec, fps), sec(st.atSec + 0.45, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
        if (land <= 0 && i > 0) return null;
        const rot = (random(`sm-${i}`) - 0.5) * 7;
        const dx = (random(`smx-${i}`) - 0.5) * 50;
        // The burst: every card above the last one flies off in turn within `bd` seconds.
        let fly = 0;
        if (b !== null && i < last) {
          const slot = b + sec((bd * i) / Math.max(1, last), fps);
          fly = interpolate(frame, [slot, slot + sec(0.22, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        }
        const isTop = stills.filter((s2, k) => k > i && now >= s2.atSec).length === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pileX - w / 2 + dx + fly * (i % 2 ? 1400 : -1400),
              top: pileY - CARD_H / 2 - 14 + (1 - land) * -60 + fly * -120,
              transform: `rotate(${rot + fly * (i % 2 ? 25 : -25)}deg) scale(${1.06 - 0.06 * land})`,
              opacity: i === 0 ? 1 : land,
              padding: 14,
              background: t.colors.panel,
              borderRadius: 4,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              filter: isTop ? undefined : "brightness(0.6)",
              zIndex: i,
            }}
          >
            <CropImage src={srcs[i]} imgSize={st.imgSize} crop={st.crop} width={w} height={CARD_H} filter="grayscale(0.5) sepia(0.12) contrast(1.05)" />
            <div style={{ position: "absolute", left: 14, bottom: -44, fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 3, color: t.colors.secondary, opacity: isTop ? 1 : 0 }}>{st.label}</div>
          </div>
        );
      })}
      {years && yearNow !== null ? (
        <div style={{ position: "absolute", left: 1120, top: 380, ...rise(reveal(frame, fps, years.atSec - 0.3, 0.6), 16) }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 150, letterSpacing: 6, color: t.colors.ink, lineHeight: 1 }}>{yearNow}</div>
          {years.caption ? <div style={{ marginTop: 20, fontFamily: t.fonts.mono, fontSize: 28, letterSpacing: 4, color: t.colors.secondary }}>{years.caption}</div> : null}
        </div>
      ) : null}
      {source ? (
        <div style={{ position: "absolute", left: t.safe.x, bottom: t.safe.y, fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 1.2, color: t.colors.secondary, background: t.colors.chip, padding: "6px 12px", borderRadius: 4 }}>{source}</div>
      ) : null}
    </AbsoluteFill>
  );
};
