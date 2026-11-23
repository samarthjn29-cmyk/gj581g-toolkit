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
  FootagePlate: {
    srcId: "SRC-013",
    kind: "image",
    size: [1920, 1280],
    crop: [300, 260, 1160, 652],
    warmth: [0.9, 0.2],
    warmthSec: [2.5, 4.5],
    labels: [{ text: "PREVIEW LABEL · FLOWER", atSec: 0.8, x: 1240, y: 820 }],
    tag: { parts: [{ text: "PREVIEW", atSec: 0.3 }, { text: "PLACE · DATE", atSec: 1.4 }], at: "low-centre", toCornerAtSec: 3.2 },
  },
  SwatchRows: {
    columns: ["BY DAY", "BY CANDLE"],
    rows: [
      { name: "ROW A", atSec: 0.3, cells: [{ color: "#86B5E8", name: "SKY-BLUE", atSec: 0.3 }, { color: "#C8402F", name: "RED", atSec: 0.6, fillSec: 1.6 }] },
      { name: "ROW B", atSec: 2.0, cells: [{ color: "#E79AB9", name: "PINK", atSec: 2.0 }, { color: "#E79AB9", name: "PINK", atSec: 2.3 }], tag: { text: "PREVIEW TAG", atSec: 2.8 } },
    ],
    caption: { text: "Preview caption", atSec: 3.4 },
  },
  YearCounter: { to: 151, unit: "YEARS", countFromSec: 0.5, lockSec: 3.0 },
  EyeDiagram: { mode: "simple", openKeys: [{ atSec: 0, open: 0.05 }, { atSec: 0.6, open: 1 }, { atSec: 3.4, open: 0.04 }] },
  KineticLine: {
    lines: [{ text: "Preview question?", atSec: 0.6 }, { text: "PREVIEW · MONO LINE", atSec: 1.6, style: "mono" }],
    backdrop: { srcId: "SRC-013", imgSize: [1920, 1280], crop: [300, 260, 1160, 652], layout: "full" },
  },
  HalftoneMoire: {
    color: "#E79AB9",
    name: "PREVIEW · PINK",
    loupe: { atSec: 0.3, from: [1130, 470], to: [1480, 600], moveSec: 3, r: 230, cell: 22 },
    lines: [{ text: "Preview question?", atSec: 0.6 }],
  },
  RisoPlate: {
    srcId: "SRC-004",
    imgSize: [996, 1230],
    w: 560,
    inks: [
      { file: "public/assets/sources/dalton_turner1834_trace.png", color: "#E4004F", atSec: 0, offset: [3, -2], drift: [1.5, 0.5] },
      { file: "public/assets/sources/dalton_turner1834_halftone_full.png", color: "#0078BF", atSec: 0.8, offset: [-2, 1] },
    ],
    caption: "PREVIEW · TWO INKS",
    lines: [{ text: "Preview: two inks make a third", atSec: 0.5 }],
  },
  DuotoneCollage: {
    pieces: [
      { color: "#86B5E8", x: 1660, y: 230, w: 320, h: 210, rot: 6, atSec: 0 },
      { srcId: "SRC-004", file: "public/assets/sources/dalton_turner1834_halftone.png", imgSize: [760, 972], x: 1420, y: 450, w: 600, rot: -2.5, atSec: 0.2, caption: "PREVIEW · PORTRAIT", captionAt: "top" },
      { srcId: "SRC-031", file: "public/assets/sources/dalton1808_symbols_line.png", imgSize: [1000, 705], x: 1240, y: 735, w: 620, rot: 2.5, atSec: 0.9, caption: "PREVIEW · PLATE" },
    ],
    lines: [{ text: "Preview line", atSec: 0.6 }],
  },
  EyeDissection: {
    cutAtSec: 0.6,
    openAtSec: 2.4,
    words: [
      { text: "Preview line", atSec: 0.4 },
      { text: "PREVIEW · MONO LINE", atSec: 1.2, style: "mono" },
    ],
  },
};

// Extra previews of one component in other set-ups: composition id -> component name and props.
export const DEMO_VARIANTS: Record<string, { name: string; props: Record<string, unknown> }> = {
  // 22 Nov 2026 text layers on KineticLine (TXT-021 / TXT-020 / TXT-022) and strokes on a scan (TEX-008).
  "FootagePlate-Candle": {
    name: "FootagePlate",
    props: { srcId: "SRC-013", kind: "image", size: [1920, 1280], crop: [380, 330, 1000, 562], warmth: [1, 1], flicker: {}, analogue: {}, labels: [{ text: "PREVIEW · LABEL", atSec: 0.4, x: 1240, y: 820 }] },
  },
  "PeriodMapPlate-FocusDim": {
    name: "PeriodMapPlate",
    props: {
      srcId: "SRC-033", size: [4000, 5313], views: [{ atSec: 0, crop: [400, 2300, 2000, 1125] }],
      pins: [{ id: "a", x: 858, y: 2795, atSec: 0.3, label: "PIN A" }], focusDim: { pin: "a", atSec: 1.0 },
      source: "MAP · PREVIEW · SOURCE LINE",
    },
  },
  "KineticLine-Typewriter": {
    name: "KineticLine",
    props: { lines: [{ text: "Preview line", atSec: 0.3 }, { text: "PREVIEW · A TYPED MONO LINE", atSec: 1.2, style: "mono", type: true }] },
  },
  "KineticLine-Strike": {
    name: "KineticLine",
    props: { lines: [{ text: "The preview view", atSec: 0.3, strike: { atSec: 1.6 } }, { text: "PREVIEW · THE RIGHT WORDS", atSec: 2.4, style: "mono" }] },
  },
  "KineticLine-Ruled": {
    name: "KineticLine",
    props: { lines: [{ text: "Preview Title", atSec: 0.3, ruled: { atSec: 0.3 } }, { text: "PREVIEW · A TYPED LINE", atSec: 1.0, style: "mono", type: true }] },
  },
  "ArchivalScanCard-Strokes": {
    name: "ArchivalScanCard",
    props: {
      srcId: "SRC-007", imgSize: [2288, 4010], crop: [200, 900, 1900, 1900],
      highlights: [{ box: [300, 1500, 1500, 90], atSec: 1.4 }],
      quote: "A preview quote", source: "PREVIEW · SOURCE LINE", strokes: {},
    },
  },
  "HalftoneMoire-Screen": {
    name: "HalftoneMoire",
    props: {
      color: "#E79AB9",
      medium: "screen",
      name: "PREVIEW · PINK ON A SCREEN",
      loupe: { atSec: 0.3, from: [1130, 470], to: [1480, 600], moveSec: 3, r: 230, cell: 30 },
      lines: [{ text: "Preview: red and blue light", atSec: 0.6 }],
    },
  },
  "KineticLine-Mark": {
    name: "KineticLine",
    props: {
      ink: true,
      lines: [
        { text: "Preview marker highlight", atSec: 0.4, fill: { word: "marker", atSec: 1.0, color: "#00E0BE", style: "mark", onMark: "#2F2D2C" } },
        { text: "PREVIEW · INK-PRESSED HEADLINE", atSec: 1.2, style: "mono" },
      ],
    },
  },
  "FootagePlate-Screen": {
    name: "FootagePlate",
    props: {
      srcId: "SRC-031",
      kind: "image",
      size: [1280, 2078],
      crop: [200, 250, 900, 506],
      screen: { strength: 1 },
      labels: [{ text: "PREVIEW · ON A SCREEN", atSec: 0.5, x: 960, y: 900, align: "center" }],
    },
  },
  "ArchivalScanCard-Callout": {
    name: "ArchivalScanCard",
    props: {
      srcId: "SRC-001",
      imgSize: [1920, 2813],
      crop: [380, 1220, 1100, 1050],
      highlights: [{ box: [440, 2100, 700, 54], atSec: 1.0 }],
      callout: { atSec: 1.4, dim: 0.7 },
      quote: "Preview: the rest of the page dims",
      source: "PREVIEW · CONTRAST CALLOUT",
    },
  },
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
  "FootagePlate-Video": {
    name: "FootagePlate",
    props: {
      srcId: "SRC-011",
      file: "public/assets/sources/candle_lighting_mixkit3458_rev.mp4",
      kind: "video",
      size: [1080, 1920],
      focus: 0.56,
      zoom: 1.0,
      warmth: [1, 1],
      tag: { parts: [{ text: "PREVIEW · PLACE", atSec: 0.8 }], at: "low-centre" },
    },
  },
  "EyeDiagram-Section": {
    name: "EyeDiagram",
    props: {
      mode: "section",
      parts: [
        { part: "cornea", text: "CORNEA", atSec: 0.4 },
        { part: "lens", text: "LENS", atSec: 0.7 },
        { part: "vitreous", text: "VITREOUS HUMOUR", atSec: 1.0 },
        { part: "retina", text: "BACK OF THE EYE", atSec: 1.3 },
      ],
      tints: [{ part: "vitreous", color: "#3C6FD8", atSec: 2.0, opacity: 0.4 }],
      beat: { atSec: 1.6 },
      question: { atSec: 3.2 },
    },
  },
  "KineticLine-Card": {
    name: "KineticLine",
    props: {
      lines: [{ text: "Preview line beside a card", atSec: 0.5 }, { text: "PREVIEW · 1808", atSec: 1.5, style: "mono" }],
      backdrop: { srcId: "SRC-004", imgSize: [996, 1230], crop: [110, 60, 790, 1010], layout: "card-right" },
    },
  },
  "PerspectiveGrid-Rays": {
    name: "PerspectiveGrid",
    props: {
      variant: "room",
      depth: 2000,
      dark: 0.7,
      fog: 0.45,
      dolly: 0.02,
      objects: [
        { kind: "hole", at: [-1300, -150, 600], r: 22, atSec: 0.2 },
        { kind: "beam", from: [-1300, -150, 600], to: [-520, 60, 900], width: 6, atSec: 0.4, drawSec: 0.8 },
        { kind: "rays", from: [-1300, -150, 600], to: [-520, 60, 900], speed: 520, count: 14, atSec: 0.6, size: 8, jitter: 6 },
        { kind: "prism", at: [-520, 60, 900], size: 170, atSec: 1.0 },
        { kind: "rays", from: [-520, 60, 900], to: [300, -120, 2000], speed: 700, count: 12, atSec: 1.6, size: 10, trail: 0.22, colors: ["#FF4A3D"] },
        { kind: "rays", from: [-520, 60, 900], to: [700, -60, 2000], speed: 700, count: 12, atSec: 1.7, size: 10, trail: 0.22, colors: ["#3DFF7A"] },
        { kind: "rays", from: [-520, 60, 900], to: [1100, 0, 2000], speed: 700, count: 12, atSec: 1.8, size: 10, trail: 0.22, colors: ["#4A7BFF"] },
        { kind: "label", at: [-1300, -150, 600], text: "PREVIEW · RAYS", atSec: 0.8 },
      ],
    },
  },
  "EyeDiagram-Rays": {
    name: "EyeDiagram",
    props: {
      mode: "section",
      parts: [{ part: "retina", text: "BACK OF THE EYE", atSec: 0.4 }],
      rays: { speed: 360, count: 12, atSec: 0.5, size: 6, jitter: 18, colors: ["#FF4A3D", "#3DFF7A", "#4A7BFF"] },
    },
  },
};

// Act 2 pieces (22 Nov 2026). Preview labels are neutral; real cues are set in make_act2.py.
export const DEMO_ACT2: Record<string, Record<string, unknown>> = {
  PeriodMapPlate: {
    srcId: "SRC-033",
    size: [4000, 5313],
    views: [{ atSec: 0, crop: [400, 2300, 2000, 1125] }, { atSec: 2.2, crop: [500, 2620, 2311, 1300], moveSec: 1.6 }],
    pins: [
      { id: "a", x: 858, y: 2795, atSec: 0.6, label: "PIN A" },
      { id: "b", x: 1985, y: 3825, atSec: 2.0, label: "PIN B", labelDx: -200 },
    ],
    rings: [{ pin: "a", atSec: 0.8 }],
    route: { from: "a", to: "b", atSec: 2.4, drawSec: 1.3, tilt: { atSec: 3.6, deg: 8 } },
    source: "MAP · PREVIEW · SOURCE LINE",
  },
  ReportedColour: {
    srcId: "SRC-037",
    file: "public/assets/sources/period_stockings_flat.jpg",
    mask: "public/assets/sources/period_stockings_flat_mask.png",
    size: [2600, 1622],
    crop: [60, 80, 2480, 1395],
    states: [{ atSec: 0, color: null }, { atSec: 1.2, color: "#3B4250" }, { atSec: 3.0, color: "#B3262E", snap: true }],
    people: [
      { name: "PERSON A", color: "#3B4250", colorName: "DARK", atSec: 1.4, x: 560, y: 900 },
      { name: "PERSON B", color: "#B3262E", colorName: "RED", atSec: 3.2, x: 1360, y: 900 },
    ],
    caption: "PREVIEW · OBJECT OF THE PERIOD",
    printScreen: 0.08,
  },
  SplitComparisonCard: {
    panels: [
      { srcId: "SRC-013", kind: "image", size: [1920, 1280], crop: [380, 230, 900, 900], label: "PANEL A", atSec: 0.3, stamp: { text: "SAME", atSec: 1.2 } },
      { srcId: "SRC-011", kind: "video", size: [1080, 1920], focus: 0.56, label: "PANEL B", atSec: 0.5, stamp: { text: "SAME", atSec: 1.6 } },
      { srcId: "SRC-037", file: "public/assets/sources/period_stockings_flat.jpg", kind: "image", size: [2600, 1622], crop: [900, 180, 1300, 1300], label: "PANEL C", atSec: 0.7, stamp: { text: "SAME", atSec: 2.0 } },
    ],
    lines: [{ text: "Preview line?", atSec: 0.2, untilSec: 2.6 }, { text: "Second preview line.", atSec: 2.8 }],
    dimAtSec: 2.8,
    names: [{ text: "NAME A", atSec: 3.1 }, { text: "NAME B", atSec: 3.4 }],
    thread: { atSec: 3.5, drawSec: 1.0 },
  },
  ScaleField: {
    phases: [
      { atSec: 0, total: 100, cols: 20, lit: 8, litAtSec: 0.8, label: { text: "PREVIEW · 8 IN 100", atSec: 1.0 } },
      { atSec: 3.0, total: 1000, cols: 50, lit: 4, litAtSec: 3.6, seed: 2, label: { text: "PREVIEW · 4 IN 1,000", atSec: 3.6 } },
    ],
    lines: [{ text: "Preview line", atSec: 0.2 }],
    source: "PREVIEW · SOURCE LINE",
  },
  PageSpread: {
    pages: [
      { srcId: "SRC-001", imgSize: [1920, 2813], label: "PAGE A" },
      { srcId: "SRC-029", imgSize: [1920, 2934], label: "PAGE B" },
      { srcId: "SRC-002", imgSize: [1920, 2934], label: "PAGE C" },
    ],
    spreadSec: 1.0,
    focus: { index: 1, atSec: 2.6, scale: 1.3 },
    highlights: [{ page: 1, box: [570, 882, 970, 56], atSec: 3.6 }],
    notes: [{ text: "PREVIEW · NOTE", atSec: 3.2 }],
    source: "PREVIEW · SOURCE LINE",
    strokes: {},
  },
  LedgerCard: {
    title: "PREVIEW · A LIST",
    rows: [
      { text: "ITEM ONE", value: "VALUE", atSec: 0.6 },
      { text: "ITEM TWO", value: "VALUE", atSec: 1.2 },
      { text: "ITEM THREE", value: "VALUE", atSec: 1.8, markAtSec: 3.0 },
      { text: "ITEM FOUR", value: "VALUE", atSec: 2.4 },
    ],
    lines: [{ text: "A preview line beside the card", atSec: 0.4 }],
    source: "PREVIEW · SOURCE LINE",
  },
  SourceWall: {
    items: [
      { srcId: "SRC-005", imgSize: [1600, 2321], label: "PIECE A · YEAR", atSec: 0.2 },
      { srcId: "SRC-006", imgSize: [1400, 1823], label: "PIECE B · YEAR", atSec: 1.6 },
      { srcId: "SRC-036", imgSize: [785, 1158], label: "PIECE C · YEAR", atSec: 3.0 },
    ],
    source: "PREVIEW · SOURCE LINE",
  },
  BuildUpMap: {
    title: "PREVIEW · WHERE IS IT?",
    nodes: [
      { act: 1, label: "Idea one", keywords: ["WORD", "WORD"], icon: "flower", atSec: 0.2 },
      { act: 2, label: "Idea two", keywords: ["WORD"], icon: "brothers", atSec: 0.6 },
      { act: 3, label: "Idea three", keywords: ["WORD", "WORD"], icon: "eye", atSec: 1.0 },
      { act: 4, label: "Idea four", keywords: ["WORD"], icon: "prism", atSec: 1.4 },
      { act: 5, label: "Idea five", keywords: ["WORD"], icon: "page", atSec: 1.8 },
    ],
    focus: { act: 3, atSec: 2.2 },
    assembleAtSec: 3.4,
    ringLabel: "?",
  },
  ObjectStory: {
    srcId: "SRC-037",
    file: "public/assets/sources/period_stockings_flat.jpg",
    mask: "public/assets/sources/period_stockings_flat_mask.png",
    size: [2600, 1622],
    bbox: [176, 236, 2274, 1037],
    window: { atSec: 0.1, objectAtSec: 0.5, outAtSec: 1.3 },
    states: [{ atSec: 1.8, color: "#4A4E57" }],
    notes: [{ atSec: 1.8, untilSec: 2.6, head: "PREVIEW · HEAD", text: "'A quote'", by: "SOURCE, YEAR" }],
    parcel: { atSec: 2.7, openAtSec: 4.0, tag: "FOR SOMEONE" },
    views: { atSec: 4.8, columns: [{ name: "ONE", color: "#4A4E57", colorName: "DARK", atSec: 4.8 }, { name: "TWO", color: "#B3261E", colorName: "RED", atSec: 5.2 }], focus: { index: 1, atSec: 5.8 } },
    caption: "PREVIEW · OBJECT · SOURCE",
    illustration: [[0, 1.6], [2.7, 4.3]],
  },
  TravellingMap: {
    srcId: "SRC-033",
    size: [4000, 5313],
    cams: [
      { atSec: 0, center: [900, 2800], zoom: 0.55, tilt: 0 },
      { atSec: 1.0, center: [1900, 3700], zoom: 0.75, tilt: 32, turn: -4, sec: 1.6 },
    ],
    pins: [
      { at: [858, 2795], label: "PLACE A", atSec: 0.2 },
      { at: [1985, 3825], label: "PLACE B", sub: "PREVIEW · SUB", atSec: 2.0, accent: true },
    ],
    routes: [{ points: [[858, 2795], [1300, 3200], [1985, 3825]], atSec: 1.0, sec: 1.4, mark: true }],
    caption: "PREVIEW · MAP · YEAR",
  },
  FootageMontage: {
    clips: [
      { srcId: "SRC-020", kind: "video", size: [1920, 1080], atSec: 0, label: "PREVIEW · CLIP A" },
      { srcId: "SRC-011", file: "public/assets/sources/candle_lighting_mixkit3458.mp4", kind: "video", size: [1080, 1920], atSec: 1.6, clipStartSec: 4, label: "PREVIEW · CLIP B" },
      { srcId: "SRC-013", kind: "image", size: [1920, 1280], atSec: 3.4, label: "PREVIEW · PHOTO C" },
    ],
    frame: "inset",
  },
  StillsMontage: {
    stills: [
      { srcId: "SRC-001", imgSize: [1920, 2813], label: "STILL A · YEAR", atSec: 0.2 },
      { srcId: "SRC-004", imgSize: [996, 1230], label: "STILL B · YEAR", atSec: 1.0 },
      { srcId: "SRC-007", imgSize: [2288, 4010], crop: [0, 600, 2288, 2600], label: "STILL C · YEAR", atSec: 1.8 },
      { srcId: "SRC-029", imgSize: [1920, 2934], label: "STILL D · YEAR", atSec: 3.6 },
    ],
    years: { from: 1794, to: 1844, atSec: 0.4, untilSec: 3.6, caption: "PREVIEW · CAPTION" },
    burst: { atSec: 2.8, sec: 0.7 },
    source: "PREVIEW · SOURCE LINE",
  },
  "KineticLine-Notebook": {
    lines: [{ text: "Preview line", atSec: 0.4 }, { text: "PREVIEW · MONO LINE", atSec: 1.2, style: "mono" }],
    notebook: { atSec: 0.3, rowsFromSec: 1.0, rowsToSec: 4.0 },
  },
};
