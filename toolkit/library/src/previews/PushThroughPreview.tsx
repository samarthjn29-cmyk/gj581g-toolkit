import React from "react";
import { COMPONENTS } from "../components";
import { ThemeProvider } from "../themes";
import { OpticalStack } from "../layers/OpticalStack";
import { PushThrough } from "../components/PushThrough";
import { RegistryModeProvider, type RegistryMode } from "../registry";
import { DEMO } from "./demoProps";

// TRN-006 preview: the chapter slate's title opens into the scan card.
export const PushThroughPreview: React.FC<{ themeId: string; registryMode: RegistryMode }> = ({ themeId, registryMode }) => {
  const A = COMPONENTS.ChapterSlate.Component;
  const B = COMPONENTS.ArchivalScanCard.Component;
  return (
    <RegistryModeProvider mode={registryMode}>
      <ThemeProvider themeId={themeId}>
        <OpticalStack grid={false}>
          <PushThrough from={<A {...DEMO.ChapterSlate} />} to={<B {...DEMO.ArchivalScanCard} />} atSec={2} focus={[560, 500]} />
        </OpticalStack>
      </ThemeProvider>
    </RegistryModeProvider>
  );
};
