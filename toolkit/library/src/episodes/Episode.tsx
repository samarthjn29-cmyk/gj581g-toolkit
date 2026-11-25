import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FocusMatchCut } from "../components/FocusMatchCut";
import { LensSettle } from "../components/LensSettle";
import { CinematicFinish, type FinishSpec } from "../layers/CinematicFinish";
import { COMPONENTS } from "../components";
import { ThemeOverride, ThemeProvider } from "../themes";
import { Ground, GROUND_IDS, type GroundSpec } from "../layers/Ground";
import { OpticalStack } from "../layers/OpticalStack";
import { PrismSplit } from "../components/PrismSplit";
import { PageTurn } from "../components/PageTurn";
import { ColourFlood } from "../components/ColourFlood";
import { MacroDive } from "../components/MacroDive";
import { PushThrough } from "../components/PushThrough";
import { SlideAcross } from "../components/SlideAcross";
import { PaperBandWipe } from "../components/PaperBandWipe";
import { ColourBlockWipe } from "../components/ColourBlockWipe";
import { FlashFrame } from "../components/FlashFrame";
import { DraftingWipe } from "../components/DraftingWipe";
import { PhotoToCard } from "../components/PhotoToCard";
import { CanvasGridPan } from "../components/CanvasGridPan";
import { InkBleed } from "../components/InkBleed";
import { ShapeMorph } from "../components/ShapeMorph";
import { CutOnAction } from "../components/CutOnAction";
import { StaticBurst } from "../components/StaticBurst";
import { assetFile, RegistryModeProvider, useAsset, useAssets } from "../registry";
import { sec } from "../motion";
import { RunningHead } from "../layers/RunningHead";
import { ShotOverlay, type ShotOverlaySpec } from "../layers/ShotOverlay";

// One act of an episode, composed only from library components (src/episodes/epXX-actYY.json).
// Episodes always render in strict registry mode: every ID in a beat must be Active.
export type Beat = {
  id: string;
  start: number; // seconds, from the locked word times
  end: number;
  component: string;
  props: Record<string, unknown>;
  assets: string[]; // every registry ID the beat uses, as on the beat sheet
  transitionIn?: "cut" | "push" | "slide" | "band" | "block" | "flash" | "match" | "lens" | "draft" | "photocard" | "canvas" | "ink" | "morph" | "action" | "static" | "prism" | "pageturn" | "flood" | "dive"; // lens = TRN-017 LensSettle (a cut that settles through a lens)
  // Options for the transition (22 Nov 2026, Sam: "more transitions and transition music"): band = TRN-011
  // PaperBandWipe {dir, tone}; block = TRN-012 ColourBlockWipe {color (data colour), side}; flash = TRN-013 FlashFrame.
  // 23 Nov 2026 (Sam: "Build the transitions which we haven't built yet"): draft = TRN-002 DraftingWipe {angle, dir};
  // photocard = TRN-003 PhotoToCard {rect}; canvas = TRN-004 CanvasGridPan {dir, pull}; ink = TRN-005 InkBleed {at, tint};
  // morph = TRN-009 ShapeMorph {fromShape, toShape}; action = TRN-010 CutOnAction {dir, px}; static = TRN-014 StaticBurst.
  transition?: Record<string, unknown>;
  // The shot's ground (LOK-027 paper, MAP-011 map, LOK-028 blur, VIS-050 collage, LOK-029 inset); none = the theme
  // canvas (graphite). Its ID must be in `assets`. Rule in scripts/ground-check.mjs.
  ground?: GroundSpec;
  focus?: [number, number]; // key point for a push-through (the last shot's key picture)
  beats?: string[]; // the beat-sheet beats this shot covers (a shot may join beats whose picture carries on)
  // chips, quote chips and stickers over the component (layers/ShotOverlay.tsx); their IDs must be in `assets`
  overlay?: ShotOverlaySpec;
  // act join (WCL-E01 act 5, Director's Builder 1): the first beat's match/slide/push starts from a still of the previous
  // act's real last frame (a registered file of `id`, e.g. TRN-015), so the act boundary carries a designed transition
  joinFrom?: { id: string; file: string };
  note?: string;
};
// Sound: every file is a registered asset (the narration take is an SRC row, the sounds SFX rows).
// `file` picks one of the row's registered files (an SFX kit's variants: rule V in scripts/sound-pass.py, never the
// same file twice within 10 s).
export type Cue = { id: string; atSec: number; volumeDb?: number; fadeInSec?: number; fadeOutSec?: number; endSec?: number; file?: string };
// finish: LOK-030 CinematicFinish over the whole act. motionBlur: LOK-031 on the moving transitions (slide, push,
// match) for their first 0.8 s only, 6 samples at a 180-degree shutter (render cost stays inside those frames).
export type EpisodeProps = { episodeId: string; themeId: string; beats: Beat[]; voice?: Cue; audio?: Cue[]; note?: string; runningHead?: { text: string; fromSec?: number }; finish?: FinishSpec | false; motionBlur?: boolean; previewMode?: boolean };

const MOVING = new Set(["slide", "push", "match", "canvas", "photocard"]);
const BlurWindow: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  useAsset("LOK-031");
  const frame = useCurrentFrame();
  return frame < frames ? <CameraMotionBlur shutterAngle={180} samples={6}>{children}</CameraMotionBlur> : <>{children}</>;
};

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
  const ov = beat.overlay;
  if (ov) {
    const need = [...((ov.chips ?? []).length ? ["TXT-024"] : []), ...((ov.quotes ?? []).length ? ["TXT-025"] : []), ...((ov.stickers ?? []).length ? ["VIS-060"] : []), ...(ov.stickers ?? []).map((x) => x.srcId)];
    for (const id of need) if (!beat.assets.includes(id)) throw new Error(`${beat.id}: overlay uses ${id}, which is not listed in the beat's assets.`);
  }
  const over = ov ? <ShotOverlay spec={ov} /> : null;
  if (!beat.ground) return over ? <><C {...props} />{over}</> : <C {...props} />;
  if (!beat.assets.includes(GROUND_IDS[beat.ground.kind])) throw new Error(`${beat.id}: ground ${GROUND_IDS[beat.ground.kind]} is not listed in the beat's assets.`);
  return (
    <ThemeOverride paper={beat.ground.kind === "paper" && beat.ground.tone !== "dark"}>
      <Ground spec={beat.ground} />
      <C {...props} />
      {over}
    </ThemeOverride>
  );
};

const JoinStill: React.FC<{ id: string; file: string }> = ({ id, file }) => {
  const e = useAsset(id);
  return (
    <AbsoluteFill>
      <Img src={assetFile(e, file)} style={{ width: 1920, height: 1080 }} />
    </AbsoluteFill>
  );
};

const Beats: React.FC<{ beats: Beat[]; motionBlur?: boolean }> = ({ beats, motionBlur }) => {
  const { fps } = useVideoConfig();
  useAssets(Array.from(new Set(beats.flatMap((b) => [...b.assets, COMPONENTS[b.component]?.assetId ?? b.component]))));
  return (
    <>
      {beats.map((b, i) => {
        const from = sec(b.start, fps);
        const dur = sec(b.end, fps) - from;
        const prev = beats[i - 1];
        const entry = COMPONENTS[b.component];
        const cut = i > 0 && (!b.transitionIn || b.transitionIn === "cut" || b.transitionIn === "lens");
        let body: React.ReactNode = <Shot beat={b} built={cut} />;
        if (b.transitionIn === "slide" && prev) {
          const prevDur = sec(prev.end, fps) - sec(prev.start, fps);
          body = (
            <SlideAcross
              from={
                <Freeze frame={prevDur - 1}>
                  <Sequence durationInFrames={prevDur} layout="none">
                    <Shot beat={prev} />
                  </Sequence>
                </Freeze>
              }
              to={<Shot beat={b} built />}
            />
          );
        }
        const frozenPrev = () => {
          const prevDur = sec(prev.end, fps) - sec(prev.start, fps);
          return (
            <Freeze frame={prevDur - 1}>
              <Sequence durationInFrames={prevDur} layout="none">
                <Shot beat={prev} />
              </Sequence>
            </Freeze>
          );
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const o = (b.transition ?? {}) as any;
        if (b.transitionIn === "band" && prev) body = <PaperBandWipe {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "block" && prev) body = <ColourBlockWipe {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "flash" && prev) body = <FlashFrame {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "match" && prev) body = <FocusMatchCut from={frozenPrev()} to={<Shot beat={b} built />} focus={b.focus ?? [960, 540]} />;
        if (b.transitionIn === "match" && !prev && b.joinFrom) body = <FocusMatchCut from={<JoinStill {...b.joinFrom} />} to={<Shot beat={b} built />} focus={b.focus ?? [960, 540]} />;
        if (b.transitionIn === "lens" && prev) body = <LensSettle {...o}><Shot beat={b} built /></LensSettle>;
        if (b.transitionIn === "draft" && prev) body = <DraftingWipe {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "photocard" && prev) body = <PhotoToCard {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "canvas" && prev) body = <CanvasGridPan {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "ink" && prev) body = <InkBleed {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "morph" && prev) body = <ShapeMorph {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        // Cut on action plays the old shot ON past its end (its movement keeps going: the lid keeps closing) until the cut
        // at leadSec, never a frozen frame (Director, 23 Nov 2026: a frozen lid stops dead and only the frame slides).
        if (b.transitionIn === "action" && prev) {
          const prevDur = sec(prev.end, fps) - sec(prev.start, fps);
          body = (
            <CutOnAction
              {...o}
              from={
                <Sequence from={-prevDur} layout="none">
                  <Shot beat={prev} />
                </Sequence>
              }
              to={<Shot beat={b} built />}
            />
          );
        }
        if (b.transitionIn === "prism" && prev) body = <PrismSplit {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "pageturn" && prev) body = <PageTurn {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "flood" && prev) body = <ColourFlood {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "dive" && prev) body = <MacroDive {...o} focus={o.focus ?? b.focus ?? [960, 540]} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "static" && prev) body = <StaticBurst {...o} from={frozenPrev()} to={<Shot beat={b} built />} />;
        if (b.transitionIn === "push" && prev) {
          const prevDur = sec(prev.end, fps) - sec(prev.start, fps);
          body = (
            <PushThrough
              from={
                <Freeze frame={prevDur - 1}>
                  <Sequence durationInFrames={prevDur} layout="none">
                    <Shot beat={prev} />
                  </Sequence>
                </Freeze>
              }
              to={<Shot beat={b} built />}
              atSec={0}
              focus={b.focus ?? [960, 540]}
            />
          );
        }
        if (motionBlur && prev && b.transitionIn && MOVING.has(b.transitionIn)) body = <BlurWindow frames={Math.round(0.8 * fps)}>{body}</BlurWindow>;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={`${b.id} ${b.component}`}>
            <OpticalStack grid={entry?.grid ?? true}>{body}</OpticalStack>
          </Sequence>
        );
      })}
    </>
  );
};

export const Episode: React.FC<EpisodeProps> = ({ themeId, beats, voice, audio = [], runningHead, finish, motionBlur, previewMode }) => (
  // previewMode: a test cut for Sam with candidate (Planned) pieces; frames carry BUILD PREVIEW. Never for a delivery.
  <RegistryModeProvider mode={previewMode ? "build" : "render"}>
    <ThemeProvider themeId={themeId}>
      <AbsoluteFill>
        {finish ? (
          <CinematicFinish spec={finish}>
            <Beats beats={beats} motionBlur={motionBlur} />
          </CinematicFinish>
        ) : (
          <Beats beats={beats} motionBlur={motionBlur} />
        )}
        {runningHead ? <RunningHead text={runningHead.text} fromSec={runningHead.fromSec} beats={beats} /> : null}
        {voice ? <Sound cue={voice} /> : null}
        {audio.map((c) => (
          <Sound key={`${c.id}${c.atSec}`} cue={c} />
        ))}
      </AbsoluteFill>
    </ThemeProvider>
  </RegistryModeProvider>
);
