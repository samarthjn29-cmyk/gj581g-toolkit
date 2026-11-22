import React from "react";
import { COMPONENTS } from "../components";
import { ThemeProvider } from "../themes";
import { OpticalStack } from "../layers/OpticalStack";
import { RegistryModeProvider, type RegistryMode } from "../registry";

// A library preview: one component, in one theme, inside the optical stack.
export type PreviewProps = {
  name: string;
  themeId: string;
  registryMode: RegistryMode;
  props: Record<string, unknown>;
};

export const Preview: React.FC<PreviewProps> = ({ name, themeId, registryMode, props }) => {
  const entry = COMPONENTS[name];
  if (!entry) throw new Error(`${name} is not in src/components/index.ts`);
  const C = entry.Component;
  return (
    <RegistryModeProvider mode={registryMode}>
      <ThemeProvider themeId={themeId}>
        <OpticalStack grid={entry.grid}>
          <C {...props} />
        </OpticalStack>
      </ThemeProvider>
    </RegistryModeProvider>
  );
};
