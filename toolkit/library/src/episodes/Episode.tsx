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
export type Cue = { id: string; atSec: number; volumeDb?: number; fadeInSec?: number; fadeOutSec?: number; endSec?: number };
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
        src={assetFile(e)}
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

const Shot: React.FC<{ beat: Beat }> = ({ beat }) => {
  const entry = COMPONENTS[beat.component];
  if (!entry) throw new Error(`${beat.id}: ${beat.component} is not a library component.`);
  const C = entry.Component;
  return <C {...beat.props} />;
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
        let body: React.ReactNode = <Shot beat={b} />;
        if (b.transitionIn === "slide" && prev) {
          const prevDur = sec(prev.end, fps) - sec(prev.start, fps);
          body = (
            <SlideAcross
              from={
                <Freeze frame={prevDur - 1}>
                  <Shot beat={prev} />
                </Freeze>
              }
              to={<Shot beat={b} />}
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
              to={<Shot beat={b} />}
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
