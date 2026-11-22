import React from "react";
import { AbsoluteFill, Audio, Freeze, interpolate, Sequence, useVideoConfig } from "remotion";
import { COMPONENTS } from "../components";
import { ThemeProvider } from "../themes";
import { OpticalStack } from "../layers/OpticalStack";
import { PushThrough } from "../components/PushThrough";
import { SlideAcross } from "../components/SlideAcross";
import { assetFile, RegistryModeProvider, useAsset, useAssets } from "../registry";
import { sec } from "../motion";

// One act of an episode, composed only from library components (src/episodes/epXX-actYY.json).
// Episodes always render in strict registry mode: every ID in a beat must be Active.
export type Beat = {
  id: string;
  start: number; // seconds, from the locked word times
  end: number;
  component: string;
  props: Record<string, unknown>;
  assets: string[]; // every registry ID the beat uses, as on the beat sheet
  transitionIn?: "cut" | "push" | "slide";
  focus?: [number, number]; // key point for a push-through (the last shot's key picture)
  beats?: string[]; // the beat-sheet beats this shot covers (a shot may join beats whose picture carries on)
  note?: string;
};
// Sound: every file is a registered asset (the narration take is an SRC row, the sounds SFX rows).
// `file` picks one of the row's registered files (an SFX kit's variants: rule V in scripts/sound-pass.py, never the
// same file twice within 10 s).
export type Cue = { id: string; atSec: number; volumeDb?: number; fadeInSec?: number; fadeOutSec?: number; endSec?: number; file?: string };
export type EpisodeProps = { episodeId: string; themeId: string; beats: Beat[]; voice?: Cue; audio?: Cue[]; note?: string };

const Sound: React.FC<{ cue: Cue }> = ({ cue }) => {
  const e = useAsset(cue.id);
  const { fps } = useVideoConfig();
  const from = sec(cue.atSec, fps);
  const dur = cue.endSec !== undefined ? sec(cue.endSec, fps) - from : undefined;
  const g = Math.pow(10, (cue.volumeDb ?? 0) / 20);
  const fi = sec(cue.fadeInSec ?? 0, fps);
  const fo = sec(cue.fadeOutSec ?? 0, fps);
  return (
    <Sequence from={from} durationInFrames={dur} name={`sound ${cue.id}`}>
      <Audio
        src={assetFile(e, cue.file)}
        volume={(f) => {
          let v = g;
          if (fi > 0) v *= interpolate(f, [0, fi], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (fo > 0 && dur !== undefined) v *= interpolate(f, [dur - fo, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return v;
        }}
      />
    </Sequence>
  );
};

// `built`: a hard cut lands on a fully built frame (independent review, 22 Nov 2026: 12 of 19 cuts blinked
// to the bare canvas because every component faded its base in from 0). The shot's base entrance is moved
// before its first frame (startSec -1); cued overlays keep their own times. A shot whose act file sets a
// deliberate startSec (> 0.3 s, e.g. a dark room fading up from a dark shot) keeps it.
const Shot: React.FC<{ beat: Beat; built?: boolean }> = ({ beat, built }) => {
  const entry = COMPONENTS[beat.component];
  if (!entry) throw new Error(`${beat.id}: ${beat.component} is not a library component.`);
  const C = entry.Component;
  const st = beat.props.startSec as number | undefined;
  const props = built && !(st !== undefined && st > 0.3) ? { ...beat.props, startSec: -1 } : beat.props;
  return <C {...props} />;
};

const Beats: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const { fps } = useVideoConfig();
  useAssets(Array.from(new Set(beats.flatMap((b) => [...b.assets, COMPONENTS[b.component]?.assetId ?? b.component]))));
  return (
    <>
      {beats.map((b, i) => {
        const from = sec(b.start, fps);
        const dur = sec(b.end, fps) - from;
        const prev = beats[i - 1];
        const entry = COMPONENTS[b.component];
        const cut = i > 0 && (!b.transitionIn || b.transitionIn === "cut");
        let body: React.ReactNode = <Shot beat={b} built={cut} />;
        if (b.transitionIn === "slide" && prev) {
          const prevDur = sec(prev.end, fps) - sec(prev.start, fps);
          body = (
            <SlideAcross
              from={
                <Freeze frame={prevDur - 1}>
                  <Shot beat={prev} />
                </Freeze>
              }
              to={<Shot beat={b} built />}
            />
          );
        }
        if (b.transitionIn === "push" && prev) {
          const prevDur = sec(prev.end, fps) - sec(prev.start, fps);
          body = (
            <PushThrough
              from={
                <Freeze frame={prevDur - 1}>
                  <Shot beat={prev} />
                </Freeze>
              }
              to={<Shot beat={b} built />}
              atSec={0}
              focus={b.focus ?? [960, 540]}
            />
          );
        }
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={`${b.id} ${b.component}`}>
            <OpticalStack grid={entry?.grid ?? true}>{body}</OpticalStack>
          </Sequence>
        );
      })}
    </>
  );
};

export const Episode: React.FC<EpisodeProps> = ({ themeId, beats, voice, audio = [] }) => (
  <RegistryModeProvider mode="render">
    <ThemeProvider themeId={themeId}>
      <AbsoluteFill>
        <Beats beats={beats} />
        {voice ? <Sound cue={voice} /> : null}
        {audio.map((c) => (
          <Sound key={`${c.id}${c.atSec}`} cue={c} />
        ))}
      </AbsoluteFill>
    </ThemeProvider>
  </RegistryModeProvider>
);
