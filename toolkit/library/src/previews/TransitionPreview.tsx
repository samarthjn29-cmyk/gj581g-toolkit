import React from "react";
import { COMPONENTS } from "../components";
import { ThemeProvider } from "../themes";
import { OpticalStack } from "../layers/OpticalStack";
import { PaperBandWipe } from "../components/PaperBandWipe";
import { ColourBlockWipe } from "../components/ColourBlockWipe";
import { FlashFrame } from "../components/FlashFrame";
import { LensSettle } from "../components/LensSettle";
import { DraftingWipe } from "../components/DraftingWipe";
import { PhotoToCard } from "../components/PhotoToCard";
import { CanvasGridPan } from "../components/CanvasGridPan";
import { InkBleed } from "../components/InkBleed";
import { ShapeMorph } from "../components/ShapeMorph";
import { CutOnAction } from "../components/CutOnAction";
import { StaticBurst } from "../components/StaticBurst";
import { PrismSplit } from "../components/PrismSplit";
import { PageTurn } from "../components/PageTurn";
import { ColourFlood } from "../components/ColourFlood";
import { MacroDive } from "../components/MacroDive";
import { AbsoluteFill, Sequence } from "remotion";
import { RegistryModeProvider, type RegistryMode } from "../registry";
import { DEMO } from "./demoProps";

// TRN-011/012/013 previews: the chapter slate into the scan card, the transition at 2 s.
export type TransitionKind = "band" | "band-dark" | "block" | "flash" | "lens" | "draft" | "photocard" | "canvas" | "ink" | "morph" | "action" | "static" | "prism" | "pageturn" | "flood" | "dive";
export const TransitionPreview: React.FC<{ themeId: string; registryMode: RegistryMode; kind: TransitionKind }> = ({ themeId, registryMode, kind }) => {
  const A = COMPONENTS.ChapterSlate.Component;
  const B = COMPONENTS.ArchivalScanCard.Component;
  const from = <A {...DEMO.ChapterSlate} />;
  const to = <B {...DEMO.ArchivalScanCard} />;
  // 23 Nov 2026 kinds: a page into a diagram (and back) so each move is seen between two real shots
  const E = COMPONENTS.EyeDiagram.Component;
  const S = COMPONENTS.SpectrumStrip.Component;
  const page = <B {...DEMO.ArchivalScanCard} startSec={-1} />;
  const eye = <E {...DEMO.EyeDiagram} startSec={-1} />;
  const strip = <S {...DEMO.SpectrumStrip} startSec={-1} />;
  return (
    <RegistryModeProvider mode={registryMode}>
      <ThemeProvider themeId={themeId}>
        <OpticalStack grid={false}>
          {kind === "band" ? <PaperBandWipe from={from} to={to} atSec={2} /> : null}
          {kind === "band-dark" ? <PaperBandWipe from={from} to={to} atSec={2} tone="dark" /> : null}
          {kind === "block" ? <ColourBlockWipe from={from} to={to} atSec={2} color="#E79AB9" /> : null}
          {kind === "flash" ? <FlashFrame from={from} to={to} atSec={2} /> : null}
          {kind === "draft" ? <DraftingWipe from={eye} to={page} atSec={2} /> : null}
          {kind === "photocard" ? <PhotoToCard from={page} to={strip} atSec={2} rect={[1240, 120, 560, 315]} /> : null}
          {kind === "canvas" ? <CanvasGridPan from={page} to={strip} atSec={2} /> : null}
          {kind === "ink" ? <InkBleed from={page} to={eye} atSec={2} at={[960, 540]} tint="#3D6BD6" /> : null}
          {kind === "morph" ? <ShapeMorph from={page} to={eye} atSec={2} fromShape={[560, 470, 800, 60, 8]} toShape={[810, 390, 300, 300, 150]} /> : null}
          {kind === "action" ? <CutOnAction from={eye} to={page} atSec={2} dir="down" /> : null}
          {kind === "prism" ? <PrismSplit from={page} to={strip} atSec={2} /> : null}
          {kind === "pageturn" ? <PageTurn from={page} to={to} atSec={2} /> : null}
          {kind === "flood" ? <ColourFlood from={strip} to={eye} atSec={2} color="#E79AB9" at={[960, 540]} r0={60} /> : null}
          {kind === "dive" ? <MacroDive from={eye} to={page} atSec={2} focus={[960, 540]} r0={40} /> : null}
          {kind === "static" ? <StaticBurst from={from} to={page} atSec={2} /> : null}
          {kind === "lens" ? (
            <>
              <Sequence durationInFrames={60} layout="none"><AbsoluteFill>{from}</AbsoluteFill></Sequence>
              <Sequence from={60} layout="none"><LensSettle>{to}</LensSettle></Sequence>
            </>
          ) : null}
        </OpticalStack>
      </ThemeProvider>
    </RegistryModeProvider>
  );
};
