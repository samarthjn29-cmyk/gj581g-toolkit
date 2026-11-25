// A theme is one LOK entry in the master register plus its row on the Theme_Library tab.
// Components read colours, fonts, motion and margins only from the active theme: no hex codes inside components.
export type Theme = {
  readonly id: string; // LOK-### in the Master_Asset_Registry
  readonly name: string;
  readonly colors: {
    readonly canvas: string;
    readonly grid: string | null; // background hairline grid colour, or none
    readonly hairline: string; // rules, dividers and slate grids
    readonly ink: string; // main text
    readonly secondary: string; // labels, sources, inactive data
    readonly accent: string; // the one focal claim, bracket or hero bar (10% of the frame at most)
    readonly accentSoft: string; // highlighter sweeps
    readonly panel: string; // card surface
    readonly chip: string; // dark chip behind small text
    readonly dimMask: string; // spotlight dimming
    readonly kraft?: string; // wrapping paper (VIS-049 parcel); falls back to a mix of ink and panel
    readonly leaks: readonly string[]; // faint corner glows (empty for none)
    readonly cones: { readonly L: string; readonly M: string; readonly S: string }; // the three cone colours (long, medium, short)
  };
  // The paper palette (LOK-027 PaperDesk ground, 23 Nov 2026): dark ink on cream, used by shots on a paper ground.
  readonly paper?: Partial<Theme["colors"]>;
  readonly fonts: {
    readonly headline: string;
    readonly headlineWeight: number;
    readonly headlineTracking: string;
    readonly serif: string;
    readonly titleWeight: number; // serif weight for slate titles
    readonly mono: string;
    readonly body: string;
  };
  readonly textStyles: readonly string[]; // TXT-### entries whose font files this theme needs
  readonly optical: {
    readonly grain: number; // 0-1 opacity of the grain layer
    readonly grainStepFrames: number; // grain pattern changes every N frames
    readonly vignette: number; // 0-1 edge darkening
    readonly gridOpacity: number;
    // Moving colour fields on a light ground (LOK-033..035 candidates, Sam 25 Nov 2026: "an illusion of energy and creativity")
    readonly blobs?: { readonly colors: readonly string[]; readonly opacity: number; readonly size: number; readonly speed: number };
  };
  readonly motion: {
    readonly drift: number; // one slow move per shot: 1.00 -> 1 + drift (calm version: 0.03 at most)
    readonly enterSec: number; // entrances 0.6-0.9 s
    readonly staggerSec: number; // 0.1-0.2 s
  };
  readonly safe: { readonly x: number; readonly y: number };
};
