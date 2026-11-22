import React from "react";
import { AbsoluteFill, Freeze, Sequence, useVideoConfig } from "remotion";
import { COMPONENTS } from "../components";
import { ThemeProvider } from "../themes";
import { OpticalStack } from "../layers/OpticalStack";
import { PushThrough } from "../components/PushThrough";
import { RegistryModeProvider, useAssets } from "../registry";
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
  transitionIn?: "cut" | "push";
  focus?: [number, number]; // key point for a push-through (the last shot's key picture)
};
export type EpisodeProps = { episodeId: string; themeId: string; beats: Beat[] };

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

export const Episode: React.FC<EpisodeProps> = ({ themeId, beats }) => (
  <RegistryModeProvider mode="render">
    <ThemeProvider themeId={themeId}>
      <AbsoluteFill>
        <Beats beats={beats} />
      </AbsoluteFill>
    </ThemeProvider>
  </RegistryModeProvider>
);
