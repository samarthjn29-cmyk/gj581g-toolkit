import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { drift, exit, reveal, sec, SLOW_OUT } from "../motion";
import { CropImage, type Rect } from "../layers/CropImage";
import { Label, type LabelSpec } from "../layers/Label";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";
import { ScreenTexture } from "../layers/ScreenTexture";

// VIS-016 FootagePlate (beat type 4: a real clip or photo that sets a scene, calm).
// The picture fills the frame with one slow move and the theme grade, and always carries a label or a
// dateline (Sam's rule: no photo of a place, book, person or article on screen alone).
// Video: a portrait clip is cropped to the frame around `focus` (0..1 of its height); `clipStartSec` picks
// where in the clip the shot starts, so a shot that returns later in the act can carry on in the same clip.
// Warmth: 1 = candlelight grade, 0 = neutral; it may drift from `warmth[0]` to `warmth[1]` over `warmthSec`.
export type FootagePlateProps = {
  srcId: string;
  file?: string; // one of the source's registered files (e.g. the reversed copy of a clip)
  kind: "image" | "video";
  size: readonly [number, number]; // the picture's own pixels
  crop?: Rect; // image: the part to show (image pixels)
  focus?: number; // video: vertical focus 0..1
  zoom?: number; // video: extra scale on top of cover (1 = cover)
  clipStartSec?: number;
  playbackRate?: number;
  push?: number; // the slow move, 0..0.03
  warmth?: readonly [number, number];
  warmthSec?: readonly [number, number]; // when the grade change starts and ends (shot seconds)
  dim?: number; // 0..1 darkening (e.g. a candle going out into the next shot)
  fadeOutSec?: number; // the frame fades to the canvas from here (into a dark next shot)
  labels?: LabelSpec[];
  tag?: DatelineTagProps;
  screen?: { strength?: number }; // LOK-023: the picture is on a screen (scanlines, sub-pixels, edge falloff)
  startSec?: number;
};

const grade = (w: number) =>
  `sepia(${(0.38 * w).toFixed(3)}) saturate(${(1 + 0.25 * w).toFixed(3)}) hue-rotate(${(-8 * w).toFixed(2)}deg) brightness(${(1 - 0.06 * w).toFixed(3)}) contrast(1.04)`;

export const FootagePlate: React.FC<FootagePlateProps> = ({
  srcId,
  file,
  kind,
  size,
  crop,
  focus = 0.5,
  zoom = 1,
  clipStartSec = 0,
  playbackRate = 1,
  push = 0.03,
  warmth = [0, 0],
  warmthSec,
  dim = 0,
  fadeOutSec,
  labels = [],
  tag,
  screen,
  startSec = 0,
}) => {
  useAssets(["VIS-016", "MOT-001", ...(screen ? ["LOK-023"] : [])]);
  const src = useSourceFile(srcId, file);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (push < 0 || push > 0.03) throw new Error(`FootagePlate push ${push} is outside the calm limit (0-0.03).`);
  const ws = warmthSec ?? [0, durationInFrames / fps];
  const w = interpolate(frame, [sec(ws[0], fps), Math.max(sec(ws[0], fps) + 1, sec(ws[1], fps))], [warmth[0], warmth[1]], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SLOW_OUT,
  });
  const pIn = reveal(frame, fps, startSec, 0.9);
  const pOut = fadeOutSec !== undefined ? exit(frame, fps, fadeOutSec, 0.9) : 1;
  const filter = `${grade(w)} brightness(${(1 - dim).toFixed(3)})`;

  let picture: React.ReactNode;
  if (kind === "video") {
    const scale = Math.max(1920 / size[0], 1080 / size[1]) * zoom;
    const vw = size[0] * scale;
    const vh = size[1] * scale;
    const top = Math.min(0, Math.max(1080 - vh, 540 - focus * vh));
    picture = (
      <OffthreadVideo
        src={src}
        muted
        startFrom={sec(clipStartSec, fps)}
        playbackRate={playbackRate}
        style={{ position: "absolute", left: (1920 - vw) / 2, top, width: vw, height: vh, maxWidth: "none", filter }}
      />
    );
  } else {
    picture = <CropImage src={src} imgSize={size} crop={crop} width={1920} height={1080} filter={filter} />;
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: pIn * pOut }}>
        <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, push)})`, transformOrigin: "50% 50%" }}>
          {picture}
          {screen ? <ScreenTexture strength={screen.strength} /> : null}
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)" }} />
      </AbsoluteFill>
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
