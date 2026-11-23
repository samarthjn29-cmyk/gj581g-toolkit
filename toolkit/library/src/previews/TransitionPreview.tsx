import React from "react";
import { COMPONENTS } from "../components";
import { ThemeProvider } from "../themes";
import { OpticalStack } from "../layers/OpticalStack";
import { PaperBandWipe } from "../components/PaperBandWipe";
import { ColourBlockWipe } from "../components/ColourBlockWipe";
import { FlashFrame } from "../components/FlashFrame";
import { LensSettle } from "../components/LensSettle";
import { AbsoluteFill, Sequence } from "remotion";
import { RegistryModeProvider, type RegistryMode } from "../registry";
import { DEMO } from "./demoProps";

// TRN-011/012/013 previews: the chapter slate into the scan card, the transition at 2 s.
export type TransitionKind = "band" | "band-dark" | "block" | "flash" | "lens";
export const TransitionPreview: React.FC<{ themeId: string; registryMode: RegistryMode; kind: TransitionKind }> = ({ themeId, registryMode, kind }) => {
  const A = COMPONENTS.ChapterSlate.Component;
  const B = COMPONENTS.ArchivalScanCard.Component;
  const from = <A {...DEMO.ChapterSlate} />;
  const to = <B {...DEMO.ArchivalScanCard} />;
  return (
    <RegistryModeProvider mode={registryMode}>
      <ThemeProvider themeId={themeId}>
        <OpticalStack grid={false}>
          {kind === "band" ? <PaperBandWipe from={from} to={to} atSec={2} /> : null}
          {kind === "band-dark" ? <PaperBandWipe from={from} to={to} atSec={2} tone="dark" /> : null}
          {kind === "block" ? <ColourBlockWipe from={from} to={to} atSec={2} color="#E79AB9" /> : null}
          {kind === "flash" ? <FlashFrame from={from} to={to} atSec={2} /> : null}
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
