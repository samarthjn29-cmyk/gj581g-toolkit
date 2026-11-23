import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets } from "../registry";
import { useTheme } from "../themes";
import { reveal, SLOW_OUT } from "../motion";

// TXT-023 LetterDrop (Vox, 'Creatine, debunked': the word typed on letter by letter, each letter arriving pale and a
// touch high and settling dark on the baseline; then the word rolls letter by letter into its origin, a highlighter
// line draws under its root and the meaning is set under it in italic; analysis only; Sam, 23 Nov 2026: "Pay attention
// to how new objects are brought in on to the screen and how they leave the screen").
// One word, on the canvas or the shot's ground: it types on (each letter 0.06 s after the last, settling in 0.15 s);
// `roll` turns it into another word letter by letter (the old letter drops out below as the new one drops in from
// above); `mark` draws a highlighter line under a run of letters; `gloss` types an italic line under it, word by word.
// It leaves by a hard cut (no fade), or `outSec` un-types it right to left.
// Best use: a term and where it comes from (Daltonism, from Dalton; 'protan', first), or one word the act turns on.
// Limit: one word, up to 16 letters; max 2 per act; the origin and gloss come from the fact-checked script.
export type LetterDropProps = {
  word: string;
  atSec: number;
  roll?: { to: string; atSec: number };
  mark?: { from: number; to: number; atSec: number }; // letter indices of the final word, inclusive
  gloss?: { text: string; atSec: number };
  outSec?: number;
  size?: number;
  serif?: boolean;
  startSec?: number;
};

const STEP = 0.06;
const SETTLE = 0.15;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const LetterDrop: React.FC<LetterDropProps> = ({ word, atSec, roll, mark, gloss, outSec, size = 150, serif = false, startSec = 0 }) => {
  useAssets(["TXT-023", ...(mark ? ["TXT-017"] : [])]);
  if (word.length > 16 || (roll && roll.to.length > 16)) throw new Error("LetterDrop: up to 16 letters.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const pIn = reveal(frame, fps, startSec, 0.6);
  const font = serif ? t.fonts.serif : t.fonts.headline;
  const n = Math.max(word.length, roll?.to.length ?? 0);
  const settle = (start: number) => SLOW_OUT(Math.min(1, Math.max(0, (now - start) / SETTLE)));
  const out = (i: number, len: number) => (outSec === undefined ? 1 : 1 - Math.min(1, Math.max(0, (now - (outSec + (len - 1 - i) * 0.04)) / 0.12)));
  const fin = roll ? roll.to : word;
  const letterStyle = (p: number, dy: number, o: number): React.CSSProperties => ({
    gridArea: "1 / 1",
    textAlign: "center",
    color: p < 1 ? t.colors.secondary : t.colors.ink,
    opacity: (0.45 + 0.55 * p) * o,
    transform: `translateY(${dy.toFixed(1)}px) scale(${(1.1 - 0.1 * p).toFixed(3)})`,
    whiteSpace: "pre",
  });
  // each slot holds the old and the new letter in one grid cell, so the slot is as wide as the wider letter
  const slots: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = word[i] ?? "";
    const b = roll ? roll.to[i] ?? "" : a;
    const tIn = atSec + i * STEP;
    const tRoll = roll ? roll.atSec + i * 0.05 : Infinity;
    const pa = settle(tIn);
    const pr = roll ? settle(tRoll) : 0;
    const o = out(i, n);
    const inMark = mark && i >= mark.from && i <= mark.to;
    const mp = mark ? interpolate(now, [mark.atSec + (i - mark.from) * 0.06, mark.atSec + (i - mark.from) * 0.06 + 0.12], [0, 1], clamp) : 0;
    slots.push(
      <div key={i} style={{ display: "inline-grid", position: "relative" }}>
        <span style={{ gridArea: "1 / 1", visibility: "hidden", whiteSpace: "pre" }}>{(roll && now >= tRoll ? b : a) || " "}</span>
        {now >= tIn && pr < 1 && a ? <span style={letterStyle(pa, -(1 - pa) * size * 0.3 + pr * size * 0.45, o)}>{a}</span> : null}
        {roll && now >= tRoll && b ? <span style={letterStyle(pr, -(1 - pr) * size * 0.4, o)}>{b}</span> : null}
        {inMark && mp > 0 ? <div style={{ position: "absolute", left: 0, bottom: -size * 0.1, height: size * 0.13, width: `${(mp * 100).toFixed(1)}%`, background: t.colors.accent, opacity: 0.9 * o }} /> : null}
      </div>,
    );
  }
  const gWords = gloss ? gloss.text.split(" ") : [];
  return (
    <AbsoluteFill style={{ opacity: pIn, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", marginTop: -40 }}>
        <div style={{ display: "flex", fontFamily: font, fontWeight: 700, fontSize: size, lineHeight: 1.05 }}>{slots}</div>
        {gloss ? (
          <div style={{ display: "flex", gap: size * 0.11, marginTop: size * 0.2, fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: size * 0.36 }}>
            {gWords.map((w, k) => {
              const ts = gloss.atSec + k * 0.18;
              const p = settle(ts);
              return (
                <span key={k} style={{ color: p < 1 ? t.colors.secondary : t.colors.ink, opacity: now < ts ? 0 : (0.45 + 0.55 * p) * out(0, fin.length), transform: `translateY(${(-(1 - p) * 14).toFixed(1)}px)` }}>
                  {w}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
