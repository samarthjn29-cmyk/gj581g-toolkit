// Sample content for the library previews. Preview text only: nothing here is a claim for a video.
// Every picture is a registered source (SRC-###); crops and boxes are in the image's own pixels.
export const DEMO: Record<string, Record<string, unknown>> = {
  ArchivalScanCard: {
    srcId: "SRC-001",
    imgSize: [1920, 2813],
    crop: [380, 400, 1220, 1100],
    highlights: [
      { box: [480, 704, 990, 46], atSec: 1.6 },
      { box: [480, 766, 560, 46], atSec: 2.2 },
    ],
    quote: "when the term red was substituted for pink, I thought it highly improper",
    source: "JOHN DALTON · 1798 · MEMOIRS, MANCHESTER LIT. & PHIL. SOC. · P. 29",
  },
  MinimalDataChart: {
    title: "Preview: two bars, one hero",
    bars: [
      { label: "SERIES A", value: 8, hero: true },
      { label: "SERIES B", value: 0.5 },
    ],
    unit: "%",
    decimals: 1,
    source: "PREVIEW DATA · NOT A CLAIM",
  },
  HeadlineMatchCut: {
    keyword: "COLOUR",
    framesPerCard: 7,
    cards: [
      { srcId: "SRC-001", imgSize: [1920, 2813], crop: [300, 300, 1400, 970] },
      { srcId: "SRC-005", imgSize: [1600, 2321], crop: [100, 600, 1400, 970] },
      { srcId: "SRC-002", imgSize: [1920, 2813], crop: [300, 500, 1400, 970] },
      { srcId: "SRC-006", imgSize: [1400, 1823], crop: [80, 250, 1240, 860] },
      { srcId: "SRC-007", imgSize: [2288, 4010], crop: [250, 1500, 1800, 1250] },
      { srcId: "SRC-003", imgSize: [1920, 2813], crop: [300, 900, 1400, 970] },
    ],
  },
  ParallaxCutout: {
    bg: { srcId: "SRC-002", imgSize: [1920, 2813], crop: [200, 400, 1500, 845] },
    fg: { srcId: "SRC-004", imgSize: [996, 1230], crop: [110, 60, 790, 1010] },
    kicker: "MANCHESTER · 1794",
    headline: "John Dalton",
    caption: "Preview caption in the serif italic",
  },
  SpotlightIsolator: {
    srcId: "SRC-005",
    imgSize: [1600, 2321],
    crop: [0, 260, 1600, 900],
    target: [585, 588, 580, 62],
    label: "NEWTON · OPTICKS · 1704 · P. 90",
    atSec: 1.2,
  },
  CleanUICard: {
    kicker: "PREVIEW · CARD",
    title: "Three kinds of cone",
    nodes: [
      { label: "S cone", detail: "short" },
      { label: "M cone", detail: "medium" },
      { label: "L cone", detail: "long" },
    ],
    firstSec: 1.4,
    stepSec: 1.1,
  },
  ChapterSlate: { index: "01", title: "The man who saw pink", subtitle: "Preview subtitle in the serif italic" },
  ColourPathMap: { lit: ["light", "eye"], current: "eye", caption: "Preview: the stops this season has visited so far" },
  ConeTrio: { preset: "dalton", from: [1, 1, 1], atSec: 1.8, caption: "Preview: one kind of cone missing" },
  ConeCurveChart: { title: "Three kinds of cone", markerFromNm: 450, markerToNm: 600, markerAtSec: 1.6 },
  SpectrumStrip: { title: "Preview: one yellow, two ways", markers: [{ nm: 540, label: "540 nm" }, { nm: 580, label: "580 nm" }, { nm: 620, label: "620 nm" }] },
  PerspectiveGrid: {
    variant: "room",
    depth: 2000,
    dark: 0.7,
    dolly: 0.02,
    objects: [
      { kind: "hole", at: [-1300, -150, 600], r: 22, atSec: 0.5 },
      { kind: "beam", from: [-1300, -150, 600], to: [-520, 60, 900], width: 14, atSec: 0.9, drawSec: 0.9 },
      { kind: "prism", at: [-520, 60, 900], size: 170, atSec: 1.4 },
      { kind: "fan", from: [-520, 60, 900], x0: -150, x1: 1150, y: -60, height: 150, atSec: 1.9 },
      { kind: "label", at: [-1300, -150, 600], text: "PREVIEW · THE HOLE", atSec: 1.0 },
      { kind: "label", at: [500, -130, 2000], text: "PREVIEW · THE FAR WALL", atSec: 2.4 },
    ],
  },
  SeriesTitleCard: {},
  EpisodeCard: { number: 1, title: "The Man Who Saw Pink" },
};

// Extra previews of one component in other set-ups: composition id -> component name and props.
export const DEMO_VARIANTS: Record<string, { name: string; props: Record<string, unknown> }> = {
  "PerspectiveGrid-Floor": {
    name: "PerspectiveGrid",
    props: {
      variant: "floor",
      vanishY: 300,
      floorY: 520,
      depth: 2600,
      dolly: 0.03,
      objects: [
        { kind: "page", srcId: "SRC-005", aspect: 1600 / 2321, x: 0, z: 420, width: 700, atSec: 0.6 },
        { kind: "label", at: [0, 520, 1700], text: "PREVIEW · A PAGE ON THE DESK", atSec: 1.4, dy: -40 },
      ],
    },
  },
  "PerspectiveGrid-LookThrough": {
    name: "PerspectiveGrid",
    props: {
      variant: "room",
      depth: 1800,
      dolly: 0.02,
      objects: [
        { kind: "patch", at: [-330, -20, 1800], w: 480, h: 340, color: "#E0301E", atSec: 0.6 },
        { kind: "patch", at: [330, -20, 1800], w: 480, h: 340, color: "#2FAF55", atSec: 0.8 },
        { kind: "ring", at: [0, -20, 260], r: 330, atSec: 1.4 },
        { kind: "label", at: [0, -340, 260], text: "PREVIEW · LOOKING THROUGH", atSec: 1.8 },
      ],
    },
  },
};
