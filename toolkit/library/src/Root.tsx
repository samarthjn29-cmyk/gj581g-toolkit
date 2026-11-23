import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { Preview, type PreviewProps } from "./previews/Preview";
import { PushThroughPreview } from "./previews/PushThroughPreview";
import { TransitionPreview, type TransitionKind } from "./previews/TransitionPreview";
import { MotionTexturePreview, type MotionTextureKind } from "./previews/MotionTexturePreview";
import { DEMO, DEMO_VARIANTS, DEMO_ACT2 } from "./previews/demoProps";
import { COMPONENTS } from "./components";
import { Episode, type EpisodeProps } from "./episodes/Episode";
import demoAct from "./episodes/ep00-act00.json";

const FPS = 30;
const W = 1920;
const H = 1080;
const THEMES = [
  { id: "LOK-009", folder: "Library-WarmGraphite" },
  { id: "LOK-001", folder: "Library-ArchivalDesk" },
];

// The Episode composition's default is the library demo act; Gate 2 passes a real act file as --props.
const demoEpisode = demoAct as unknown as EpisodeProps;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {THEMES.map((th) => (
        <Folder key={th.id} name={th.folder}>
          {Object.keys(COMPONENTS).map((name) => (
            <Composition
              key={name}
              id={`${name}-${th.id}`}
              component={Preview}
              durationInFrames={5 * FPS}
              fps={FPS}
              width={W}
              height={H}
              defaultProps={{ name, themeId: th.id, registryMode: "render", props: DEMO[name] ?? DEMO_ACT2[name] ?? {} } satisfies PreviewProps}
            />
          ))}
          {Object.entries(DEMO_VARIANTS).map(([vid, v]) => (
            <Composition
              key={vid}
              id={`${vid}-${th.id}`}
              component={Preview}
              durationInFrames={5 * FPS}
              fps={FPS}
              width={W}
              height={H}
              defaultProps={{ name: v.name, themeId: th.id, registryMode: "render", props: v.props } satisfies PreviewProps}
            />
          ))}
          <Composition
            id={`KineticLine-Notebook-${th.id}`}
            component={Preview}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={W}
            height={H}
            defaultProps={{ name: "KineticLine", themeId: th.id, registryMode: "render", props: DEMO_ACT2["KineticLine-Notebook"] } satisfies PreviewProps}
          />
          <Composition
            id={`PushThrough-${th.id}`}
            component={PushThroughPreview}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={W}
            height={H}
            defaultProps={{ themeId: th.id, registryMode: "render" as const }}
          />
          {([["PaperBandWipe", "band"], ["PaperBandWipe-dark", "band-dark"], ["ColourBlockWipe", "block"], ["FlashFrame", "flash"], ["LensSettle", "lens"]] as [string, TransitionKind][]).map(([id, kind]) => (
            <Composition
              key={id}
              id={`${id}-${th.id}`}
              component={TransitionPreview}
              durationInFrames={5 * FPS}
              fps={FPS}
              width={W}
              height={H}
              defaultProps={{ themeId: th.id, registryMode: "render" as const, kind }}
            />
          ))}
          {([["VectorTraceConnector", "trace"], ["LineBoil", "boil"], ["ExtremeEase", "snap"], ["EngravingHatch", "hatch"], ["PrintScreenOverlay", "printscreen"]] as [string, MotionTextureKind][]).map(([id, kind]) => (
            <Composition
              key={id}
              id={`${id}-${th.id}`}
              component={MotionTexturePreview}
              durationInFrames={5 * FPS}
              fps={FPS}
              width={W}
              height={H}
              defaultProps={{ themeId: th.id, registryMode: "render" as const, kind }}
            />
          ))}
        </Folder>
      ))}
      <Folder name="Episodes">
        <Composition
          id="Episode"
          component={Episode}
          fps={FPS}
          width={W}
          height={H}
          durationInFrames={1}
          defaultProps={demoEpisode}
          calculateMetadata={({ props }) => ({
            durationInFrames: Math.max(1, Math.round(Math.max(...props.beats.map((b) => b.end)) * FPS)),
          })}
        />
      </Folder>
    </>
  );
};
