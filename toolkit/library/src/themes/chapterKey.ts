// LOK-026 ChapterColourKey (studied Johnny Harris, 'I don't get democracy', 22 Nov 2026; analysis only):
// each act owns one colour, used only on its BuildUpMap piece, its frame accents and its one highlight, so the
// viewer feels where they are without a title card. Ours: seven muted colours chosen away from the episode's data
// colours (the reported reds, the cone colours), every one at least 5:1 on both theme canvases (checked below).
// Best use: episodes with 3+ acts that return to one diagram. Limit: 3-7 colours; never used as a data colour.
export const CHAPTER_KEY: readonly string[] = [
  "#E39AB0", // act 1 rose
  "#CDA349", // act 2 ochre
  "#8FB98B", // act 3 sage
  "#9AA6E8", // act 4 periwinkle
  "#B79CE0", // act 5 lilac
  "#E5876F", // act 6 coral
  "#D8C7A6", // act 7 sand
];

export const chapterColour = (act: number): string => {
  const c = CHAPTER_KEY[act - 1];
  if (!c) throw new Error(`ChapterColourKey: no colour for act ${act} (1-${CHAPTER_KEY.length}).`);
  return c;
};

// WCAG relative luminance contrast; used by the library check so a new colour can't slip under 3:1.
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
