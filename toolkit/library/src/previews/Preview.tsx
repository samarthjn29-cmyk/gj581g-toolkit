import React from "react";
import { COMPONENTS } from "../components";
import { ThemeOverride, ThemeProvider } from "../themes";
import { Ground, type GroundSpec } from "../layers/Ground";
import { OpticalStack } from "../layers/OpticalStack";
import { RegistryModeProvider, type RegistryMode } from "../registry";
import { ShotOverlay, type ShotOverlaySpec } from "../layers/ShotOverlay";

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
  // a preview may sit on a ground (LOK-027 paper etc.) like an episode shot: props.__ground
  // and carry a shot overlay (chips, quote chips, stickers) like an episode shot: props.__overlay
  const { __ground, __overlay, ...rest } = props as { __ground?: GroundSpec; __overlay?: ShotOverlaySpec };
  const over = __overlay ? <ShotOverlay spec={__overlay} /> : null;
  if (__ground)
    return (
      <RegistryModeProvider mode={registryMode}>
        <ThemeProvider themeId={themeId}>
          <OpticalStack grid={false}>
            <ThemeOverride paper={__ground.kind === "paper" && __ground.tone !== "dark"}>
              <Ground spec={__ground} />
              <C {...rest} />
              {over}
            </ThemeOverride>
          </OpticalStack>
        </ThemeProvider>
      </RegistryModeProvider>
    );
  return (
    <RegistryModeProvider mode={registryMode}>
      <ThemeProvider themeId={themeId}>
        <OpticalStack grid={entry.grid}>
          <C {...rest} />
          {over}
        </OpticalStack>
      </ThemeProvider>
    </RegistryModeProvider>
  );
};
