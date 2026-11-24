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
export const DEMO_VARIANTS: Record<string, { name: string; props: Record<string, unknown>; sec?: number }> = {
  // 23 Nov 2026 layer tests (VIS-059 LayerStage; Sam: "Start working on building the layers.")
  "LayerStage-Geranium": {
    name: "LayerStage",
    sec: 10,
    props: {
      worlds: [
        { atSec: 0, srcId: "SRC-040", kind: "video", size: [1920, 1080], revFile: "public/assets/sources/sky_clouds_mixkit51102_rev.mp4", clipSec: 8.5, light: "day", haze: 0.12, blur: 2, rackSec: 0.3, label: "DAYLIGHT", today: true, why: "The change itself: Dalton saw the flower sky-blue by day." },
        { atSec: 5.6, srcId: "SRC-011", kind: "video", size: [1080, 1920], focus: [0.5, 0.5], clipStartSec: 7.6, change: "dissolve", sec: 1.4, light: "warm", blur: 1.5, lightFrom: "left", label: "CANDLELIGHT", today: true, why: "The change itself: by candle the same flower turned red to him." },
      ],
      carry: [
        { srcId: "SRC-013", file: "public/assets/sources/geranium_stang_flowerhead_cutout.png", size: [1185, 769], at: [960, 470], w: 780, atSec: 0.3, enter: "rise",
          moves: [{ atSec: 5.7, to: [1290, 430], w: 600, sec: 1.3, why: "Steps aside so the flame that changes it is seen." }],
          states: [
            { atSec: 0.3, color: null, label: "TO US: PINK" },
            { atSec: 2.8, color: "#86B5E8", label: "TO DALTON, BY DAY: SKY-BLUE" },
            { atSec: 6.8, color: "#C8402F", label: "BY CANDLE: RED" },
          ],
          caption: "REPORTED COLOURS · PHOTO D. J. STANG, CC BY-SA 4.0 (CUT OUT)" },
      ],
      camera: { pan: -70, push: 0.03 },
    },
  },
  "LayerStage-Weather": {
    // Rebuilt from the Director's brief (episodes_src/WCL-E01/director/LayerStage-Weather_brief.md) after Sam's note:
    // the book, then the weather it was about (Howard's 1803 print), then the place (Kendal), each world a period picture.
    // Shot time 0 = act 2 17.4 s ("Dalton lives that way ... every single day.").
    name: "LayerStage",
    sec: 10,
    props: {
      worlds: [
        { atSec: 0, srcId: "SRC-041", kind: "image", size: [1920, 1148], zoom: 1.2, focus: [0.417, 0.5255], light: "day", haze: 0.1, blur: 1.4, rackSec: 0.2, lightFrom: "top-left", label: "A DISTANT SHOWER · LUKE HOWARD · 1803",
          why: "Same time, same idea: the weather of Dalton's years, drawn in 1803 by Luke Howard, who named the clouds; this book and the diary record that weather." },
        { atSec: 8.3, srcId: "SRC-033", kind: "image", size: [4000, 5313], focus: [0.506, 0.684], change: "dissolve", sec: 1.2, light: "none", label: "MAP · EMANUEL BOWEN · 1760",
          why: "Same place: Kendal, where he taught and where the 1793 book's observations were made; the next words name it." },
      ],
      carry: [
        { srcId: "SRC-035", size: [1575, 2588], at: [620, 500], w: 400, atSec: 0.1, enter: "rise",
          states: [{ atSec: 1.2, label: "1793 · BUILT ON HIS WEATHER RECORDS" }, { atSec: 3.2 }],
          moves: [{ atSec: 3.6, to: [620, 1480], sec: 0.7, why: "Leaves the way it came, before the diary is named, so the 1793 book is never taken for the diary." }],
          caption: "ETH-BIBLIOTHEK ZÜRICH", captionUntilSec: 3.2 },
      ],
      labels: [
        { text: "FROM 24 MARCH 1787", atSec: 4.36, untilSec: 7.7, x: 580, y: 320, align: "center" },  // Director build 1: in open sky, off the castle
        { text: "TO THE EVENING BEFORE HE DIED · 1844", atSec: 5.58, untilSec: 7.8, x: 580, y: 382, align: "center" },
      ],
      camera: { pan: -60, push: 0.04 },
    },
  },
  "LayerStage-LeafWax": {
    // 23 Nov 2026 test of the act 3 shot B cut-outs on the new depth options (not the act build: that waits for Sam's
    // yes on the act 3 plan and the Director's brief). World: Dalton's own p.34, where the example is printed.
    // Olive = Machado deuteranope simulation of the two cut-outs (leaf #4F492A, wax #5F5405 -> #574F18).
    name: "LayerStage",
    sec: 8,
    props: {
      worlds: [
        { atSec: 0, srcId: "SRC-002", kind: "image", size: [1920, 2934], zoom: 1.1, focus: [0.5, 0.55], light: "warm", haze: 0.14, blur: 1.6, rackSec: 0.4, lightFrom: "top-left", label: "JOHN DALTON · 1798 · P. 34",
          why: "Same thing: the page where Dalton prints the laurel-leaf and sealing-wax match." },
      ],
      carry: [
        { srcId: "SRC-014", file: "public/assets/sources/laurel_runicearth_leaf_cutout.png", size: [800, 700], at: [560, 560], w: 520, atSec: 0.4, enter: "setDown", rest: true,
          states: [{ atSec: 0.4, color: null, label: "LAUREL LEAF" }, { atSec: 4.2, color: "#574F18", label: "SIMULATION · ONE WAY HE MAY HAVE SEEN THEM" }] },
        { srcId: "SRC-015", file: "public/assets/sources/sealingwax_petrik_cutout.png", size: [438, 497], at: [1360, 600], w: 380, atSec: 1.4, enter: "setDown", rest: true,
          states: [{ atSec: 1.4, color: null, label: "RED SEALING-WAX" }, { atSec: 4.2, color: "#574F18" }] },
      ],
      // no typed quote: the printed line is on the page behind (a single-line label overflowed the frame); the act
      // build highlights that line on p.34 (ArchivalScanCard) before the cut-outs lift off.
      camera: { pan: -40, push: 0.03 },
    },
  },
  // 24 Nov 2026 act 3 Gate 2 builder tests (the Director's "Added layer shots" and "Within Motion blend" briefs), on
  // the real act 3 pictures with the timing compressed. Strict stills for TXT-024/025, VIS-060/061, MAP-017 and the
  // LayerStage / EyeDiagram / SpectrumStrip / Label / CutOnAction additions.
  "LayerStage-A3-Chapel": {
    name: "LayerStage",
    sec: 10,
    props: {
      worlds: [
        { atSec: 0, srcId: "SRC-009", kind: "image", size: [1920, 1280], zoom: 1.1, focus: [0.4769, 0.37], light: "paper", haze: 0.06, lightFrom: "top-left", label: "PLAN OF MANCHESTER · WILLIAM GREEN · 1794",
          rings: [{ x: 1280, y: 307, r: 125, atSec: 3.2, untilSec: 5.2 }],
          why: "Same place, same year: Manchester in 1794, the town where Dalton reads his paper." },
        { atSec: 6.0, srcId: "SRC-044", kind: "image", size: [800, 564], zoom: 1.0, focus: [0.47, 0.5], change: "dissolve", sec: 1.2, light: "paper", haze: 0.12, blur: 1.8, rackSec: 8.0, lightFrom: "top-left",
          why: "Same place, same night: in 1794 the Literary and Philosophical Society met in a room at Cross Street Chapel; this is that building, drawn as it looked in 1835." },
      ],
      carry: [
        { srcId: "SRC-045", size: [960, 1015], at: [440, 560], w: 520, atSec: 1.5, enter: "rise", tilt: -4, torn: true, untilSec: 4.6, exit: "sink",
          route: { from: [411, 346], to: [602, 894], atSec: 1.7, drawSec: 0.8, circleSec: 2.5, chips: [{ text: "KENDAL", at: [190, 300] }, { text: "MANCHESTER", at: [300, 940] }], source: "KITCHIN · LAURIE & WHITTLE · 1794" } },
        { srcId: "SRC-042", file: "public/assets/sources/dalton1798_p28_page.png", size: [1661, 1890], at: [464, 1106], w: 500, atSec: 8.0, enter: "rise" },
      ],
      labels: [
        { text: "AGE 28", atSec: 3.0, untilSec: 5.0, x: 1280, y: 490, size: 26, align: "center" },
        { text: "CROSS STREET CHAPEL · AS IN 1835", lines: ["THE SOCIETY MET IN A ROOM HERE UNTIL 1799"], atSec: 7.4, untilSec: 9.4, x: 120, y: 84, size: 22 },
      ],
      tag: { parts: [{ text: "MANCHESTER", atSec: 0.3 }, { text: "31 OCT 1794", atSec: 0.6 }], at: "low-centre", toCornerAtSec: 1.0, untilSec: 6.0 },
      camera: { pan: -40, push: 0.03 },
      __overlay: {
        chips: [{ chips: [{ text: "question", atSec: 0.4, x: 160, y: 400 }, { text: "experts", atSec: 1.0, x: 260, y: 520, accent: true }], arrows: [{ atSec: 0.8, from: [330, 495], to: [300, 520] }], untilSec: 1.4 }],
      },
    },
  },
  "LayerStage-A3-Prism": {
    name: "LayerStage",
    sec: 9,
    props: {
      worlds: [
        { atSec: 0, srcId: "SRC-043", kind: "image", size: [1920, 1282], zoom: 1.1, focus: [0.5, 0.642], light: "none", haze: 0.12, dim: 0.15, blur: 3, rackSec: 3.0, rackDim: 0.55, outSec: 7.4, label: "PHOTO TODAY · A GLASS PRISM · EVIE S. / UNSPLASH",
          why: "Same idea: the line explains what a prism is; a glass prism today doing it, behind the band others see and the band Dalton describes." },
      ],
      overlay: {
        spectrum: {
          tracks: { drawAtSec: 0.6, drawSec: 1.4, lowerAtSec: 3.0, fills: [{ band: "red", atSec: 4.6 }, { band: "yellow", atSec: 6.0 }, { band: "blue", atSec: 6.4 }, { band: "purple", atSec: 6.8 }], count: { text: "I see only two or at most three distinctions", atSec: 5.6 } },
          labels: [{ text: "OTHERS · DALTON'S SIX", atSec: 0.3, x: 210, y: 408, size: 22 }, { text: "DALTON'S WORDS", atSec: 3.0, x: 210, y: 714, size: 22 }],
        },
      },
      camera: { pan: 0, push: 0.03 },
      __overlay: {
        quotes: [{ lines: [{ x: 210, y: 760, words: [{ text: "little", atSec: 3.6 }, { text: "more", atSec: 3.8 }, { text: "than", atSec: 4.0 }, { text: "a", atSec: 4.15 }, { text: "shade,", atSec: 4.3 }] }, { x: 210, y: 828, words: [{ text: "or", atSec: 4.6 }, { text: "defect", atSec: 4.75 }, { text: "of", atSec: 4.95 }, { text: "light", atSec: 5.1 }] }],
          source: { text: "DALTON · 1798 · P. 31", atSec: 3.6, x: 720, y: 840 }, untilSec: 5.5 }],
      },
    },
  },
  "LayerStage-A3-Wish": {
    name: "LayerStage",
    sec: 6,
    props: {
      worlds: [
        { atSec: 0, srcId: "SRC-004", file: "public/assets/sources/dalton_turner1834.jpg", kind: "image", size: [996, 1230], zoom: 1.0, focus: [0.47, 0.32], light: "none", haze: 0.1, blur: 1.5, rackSec: 4.0, lightFrom: "top-left", label: "JOHN DALTON · 1834",
          why: "Same person: John Dalton, whose eyes his wish was about; his biographer's words about it are held up in front of him." },
      ],
      carry: [
        { srcId: "SRC-007", file: "public/assets/sources/henry1854_p25_wish_line.png", size: [1850, 170], at: [880, 872], w: 1440, atSec: 1.0, enter: "rise",
          highlights: [{ box: [710, 20, 1112, 52], atSec: 2.6 }, { box: [598, 102, 822, 54], atSec: 4.6 }] },
      ],
      labels: [{ text: "W. C. HENRY · 1854 · P. 25", atSec: 1.9, untilSec: 5.4, x: 160, y: 746, size: 22 }],
      arrive: { dir: "down", px: 90, sec: 0.45 },
      camera: { pan: -30, push: 0.02 },
    },
  },
  "LayerStage-A3-Letter": {
    name: "LayerStage",
    sec: 8,
    props: {
      worlds: [
        { atSec: 0, srcId: "SRC-002", kind: "image", size: [1920, 2934], zoom: 1.15, focus: [0.538, 0.4797], light: "paper", haze: 0.08, blur: 2, rackSec: 3.2, lightFrom: "top-left", label: "JOHN DALTON · 1798 · P. 34",
          highlights: [{ box: [1645, 1252, 80, 50], atSec: 0 }, { box: [745, 1308, 980, 54], atSec: 0 }, { box: [745, 1366, 690, 54], atSec: 1.0 }],
          why: "Same thing: the page where Dalton prints the laurel-leaf and sealing-wax match." },
      ],
      carry: [
        { srcId: "SRC-014", file: "public/assets/sources/laurel_runicearth_leaf_cutout.png", size: [800, 700], at: [330, 360], w: 300, atSec: 0.2, enter: "rise" },
        { srcId: "SRC-015", file: "public/assets/sources/sealingwax_petrik_cutout.png", size: [438, 497], at: [330, 690], w: 220, atSec: 0.8, enter: "rise" },
        { srcId: "SRC-046", size: [1920, 1089], at: [1450, 770], w: 360, atSec: 1.6, enter: "rise", untilSec: 3.0, exit: "sink", caption: "A SEALED LETTER · 1841", captionSize: 20 },
      ],
      camera: { pan: -40, push: 0.03 },
      __overlay: {
        chips: [{ chips: [{ text: "green", atSec: 4.0, x: 1160, y: 640 }, { text: "red", atSec: 4.6, x: 1430, y: 640 }, { text: "to you", atSec: 5.4, x: 1160, y: 750, accent: true }], untilSec: 7.0 }],
      },
    },
  },
  "EarthFlyIn-Kendal": {
    name: "EarthFlyIn",
    sec: 9,
    props: {
      globe: { srcId: "SRC-050", file: "public/assets/sources/bm_global_8192.jpg", size: [8192, 4096] },
      inset: { srcId: "SRC-050", file: "public/assets/sources/bm_britain_240ppd.jpg", size: [3840, 3120], lon0: -12, lon1: 4, lat0: 61, lat1: 48 },
      keys: [
        { atSec: 0, lon: -35, lat: 28, radius: 360 },
        { atSec: 2.2, lon: -8, lat: 46, radius: 900, sec: 2.2 },
        { atSec: 6.0, lon: -2.55, lat: 53.95, radius: 26000, sec: 3.8 },
        { atSec: 9.0, lon: -2.5, lat: 53.92, radius: 30000, sec: 3.0 },
      ],
      pins: [
        { lon: -2.746, lat: 54.328, text: "KENDAL", atSec: 5.2 },
        { lon: -2.244, lat: 53.48, text: "MANCHESTER", atSec: 5.5, accent: true },
      ],
      map: { srcId: "SRC-045", size: [960, 1015], atSec: 6.6, sec: 1.6, fit: [[411, 346, -2.746, 54.328], [602, 894, -2.244, 53.48]], grade: "paper" },
      tag: { text: "SATELLITE COMPOSITE TODAY · NASA BLUE MARBLE", atSec: 0.3, untilSec: 6.6 },
    },
  },
  "EyeDiagram-A3-Section": {
    name: "EyeDiagram",
    sec: 6,
    props: {
      mode: "section",
      outlines: [{ parts: ["aqueous", "vitreous"], atSec: 0.4, untilSec: 1.6 }, { parts: ["vitreous"], atSec: 1.7 }],
      labels: [{ text: "VITREOUS HUMOUR", atSec: 2.0, x: 1000, y: 480, size: 26, underline: { atSec: 2.8, fromCh: 9 } }, { text: "DALTON'S GUESS", atSec: 3.0, x: 1500, y: 84, size: 22 }],
      beat: { atSec: 2.4, drawSec: 1.0 },
      tints: [{ part: "vitreous", color: "#3D6BD6", atSec: 4.4, opacity: 0.5 }],
      __overlay: {
        chips: [{ chips: [{ text: "clear", atSec: 3.4, x: 160, y: 250, strikeSec: 4.0 }, { text: "tinted", atSec: 4.8, x: 160, y: 370, accent: true }], arrows: [{ atSec: 4.4, from: [230, 345], to: [215, 375] }] }],
      },
    },
  },
  "EyeDiagram-A3-Carry": {
    name: "EyeDiagram",
    sec: 6,
    props: {
      mode: "section",
      tints: [{ part: "vitreous", color: "#3D6BD6", atSec: -1, opacity: 0.5 }],
      pulses: [{ part: "vitreous", atSec: 0.5, to: 0.6, sec: 1.2 }],
      rays: { atSec: 1.0, speed: 700, count: 18, colors: ["#FF3B30", "#30D158", "#2F6BFF"], absorb: { atSec: 1.0, colors: ["#FF3B30", "#30D158"], from: 0.55, to: 0.75, keep: 0.3 } },
      labels: [{ text: "DALTON'S GUESS", atSec: -1, x: 1500, y: 84, size: 22 }],
      __overlay: {
        drift: 0.02,
        stickers: [
          { srcId: "SRC-014", file: "public/assets/sources/laurel_runicearth_leaf_cutout.png", size: [800, 700], at: [300, 380], w: 180, atSec: 2.0, tilt: -3, states: [{ atSec: 3.6, multiply: "#3D6BD6", opacity: 0.6 }], moves: [{ atSec: 3.6, to: [300, 440] }] },
          { srcId: "SRC-015", file: "public/assets/sources/sealingwax_petrik_cutout.png", size: [438, 497], at: [300, 700], w: 140, atSec: 2.6, tilt: 2, states: [{ atSec: 3.6, multiply: "#3D6BD6", opacity: 0.6 }], moves: [{ atSec: 3.6, to: [300, 645] }] },
        ],
      },
    },
  },
  "EyeDiagram-A3-Model": {
    name: "EyeDiagram",
    sec: 4,
    props: {
      mode: "simple",
      openKeys: [{ atSec: 0, open: 1 }, { atSec: 3.2, open: 0 }],
      __overlay: {
        stickers: [{ srcId: "SRC-047", file: "public/assets/sources/eye_model_wellcome_cutout.png", size: [1714, 1197], at: [1600, 520], w: 320, atSec: 0.4, tilt: 2, object: true, tag: { text: "A MODEL OF AN EYE\nWELLCOME COLLECTION" } }],
        chips: [{ chips: [{ text: "only", atSec: 1.6, x: 160, y: 490 }, { text: "two", atSec: 2.2, x: 376, y: 490, accent: true }] }],
      },
    },
  },
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
      { atSec: 1.0, center: [1500, 3300], zoom: 0.72, tilt: 32, turn: -5, sec: 1.6 },
    ],
    lag: 0.3,
    holdTilt: 3,
    dof: { focusY: 600 },
    pins: [
      { at: [858, 2795], label: "PLACE A", atSec: 0.2, drop: true },
      { at: [1985, 3825], label: "PLACE B", sub: "PREVIEW · SUB", atSec: 2.0, accent: true, drop: true },
      { at: [1250, 3050], label: "REGION", atSec: 1.4, flat: true },
    ],
    routes: [{ points: [[858, 2795], [1300, 3200], [1985, 3825]], atSec: 1.0, sec: 1.4, mark: true }, { points: [[1985, 3825], [2300, 3300], [2500, 2900]], atSec: 2.4, sec: 1.6, glow: true }],
    regions: [
      { points: [[620, 2520], [1320, 2460], [1520, 2980], [1140, 3320], [660, 3120]], atSec: 0.6, sec: 1.4, mode: "bleed", edge: true, ragged: true, front: { points: [[620, 2520], [1520, 2400], [1800, 3000], [1400, 3420], [660, 3120]], atSec: 2.4, sec: 2 } },
    ],
    sheet: { srcId: "SRC-001", at: [1700, 2700, 520, 762], atSec: 2.6, lift: 50, label: "PREVIEW · SHEET" },
    caption: "PREVIEW · MAP · YEAR",
  },
  EvidenceChain: {
    nodes: [
      { id: "a", at: [420, 520], atSec: 0.2, label: "PERSON A", sub: "PREVIEW", srcId: "SRC-004", focus: [0.5, 0.3] },
      { id: "b", at: [960, 360], atSec: 0.9, label: "A PAPER", icon: "page" },
      { id: "c", at: [1500, 520], atSec: 1.6, label: "A SOCIETY", icon: "bank" },
      { id: "d", at: [960, 760], atSec: 2.3, label: "AN EYE", icon: "jar", accent: true },
    ],
    links: [
      { from: "a", to: "b", atSec: 0.6, label: "WROTE" },
      { from: "b", to: "c", atSec: 1.3, token: { text: "LETTER", atSec: 2.0, sec: 1.2 } },
      { from: "a", to: "d", atSec: 2.6, dashed: true, label: "CLAIMED" },
    ],
    caption: "PREVIEW · SOURCE",
  },
  LayerStage: {
    worlds: [
      { atSec: 0, srcId: "SRC-040", kind: "video", size: [1920, 1080], light: "day", label: "PREVIEW · WORLD A", why: "Preview: world A for the component card." },
      { atSec: 2.6, srcId: "SRC-011", kind: "video", size: [1080, 1920], focus: [0.5, 0.4], clipStartSec: 7.6, change: "dissolve", sec: 1.2, light: "warm", label: "PREVIEW · WORLD B", why: "Preview: world B for the component card." },
    ],
    carry: [{ srcId: "SRC-013", file: "public/assets/sources/geranium_stang_flowerhead_cutout.png", size: [1185, 769], at: [960, 480], w: 700, atSec: 0.3, states: [{ atSec: 0.3, color: null, label: "PREVIEW · STATE A" }, { atSec: 3.2, color: "#C8402F", label: "PREVIEW · STATE B" }] }],
  },
  ObjectEntrance: {
    __ground: { kind: "paper" },
    objects: [
      { srcId: "SRC-001", size: [1920, 2813], at: [700, 520], w: 520, rot: -3, atSec: 0.2, enter: { kind: "slide", from: "left", sec: 1.0 }, action: { kind: "swap", atSec: 2.0, srcId: "SRC-029" }, label: { text: "PREVIEW · PAGE" } },
      { srcId: "SRC-039", size: [2000, 828], at: [1330, 640], w: 620, rot: 6, atSec: 1.0, enter: { kind: "setDown", sec: 0.8 }, action: { kind: "glint", atSec: 3.2 }, label: { text: "PREVIEW · SPECTACLES", atSec: 2.4 }, illustrative: true },
    ],
    caption: "PREVIEW · SOURCES",
  },
  ArchiveGate: {
    slides: [
      { srcId: "SRC-004", imgSize: [996, 1230], atSec: 0.2, focus: [0.5, 0.3], label: "PREVIEW · SLIDE A" },
      { srcId: "SRC-001", imgSize: [1920, 2813], atSec: 2.0, label: "PREVIEW · SLIDE B" },
      { srcId: "SRC-033", imgSize: [4000, 5313], atSec: 3.6, focus: [0.3, 0.55], label: "PREVIEW · SLIDE C" },
    ],
    bleedAtSec: 4.0,
  },
  ZoomNest: {
    levels: [
      { count: 400, label: "PREVIEW · 400", atSec: 0.2, color: "ink" },
      { count: 32, label: "PREVIEW · 32", atSec: 1.6 },
      { count: 3, label: "PREVIEW · 3", atSec: 3.2, color: "L" },
    ],
    caption: "PREVIEW · ILLUSTRATIVE",
  },
  TimelineRail: {
    from: 1760, to: 1850, pxPerYear: 26, majorEvery: 20,
    cams: [{ atSec: 0, year: 1766 }, { atSec: 1.6, year: 1794, sec: 1.4 }],
    items: [
      { year: 1766, atSec: 0.2, untilSec: 1.6, srcId: "SRC-004", focus: [0.5, 0.3], label: "PERSON A" },
      { year: 1794, atSec: 2.3, text: "A preview paper", label: "PREVIEW" },
      { year: 1844, atSec: 3.6, icon: "jar" },
    ],
    caption: "PREVIEW · CAPTION",
  },
  LetterDrop: {
    word: "PREVIEW", atSec: 0.2,
    roll: { to: "WEIVERP", atSec: 1.6 },
    mark: { from: 0, to: 3, atSec: 2.6 },
    gloss: { text: "a preview gloss", atSec: 3.0 },
  },
  WhatWeKnow: {
    lines: [
      { text: "Preview line one", tickAtSec: 1.0 },
      { text: "Preview line two" },
      { text: "A line that is wrong", strikeAtSec: 3.4 },
      { text: "The new line, written", atSec: 1.6 },
    ],
    beside: { srcId: "SRC-004", imgSize: [996, 1230], focus: [0.5, 0.3], label: "PREVIEW · PORTRAIT" },
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
  FlashMontage: {
    // TRN-016 preview: the 1834 portrait held, three 0.3 s flashes of registered pages (a cold-open device, max 8 s).
    hero: { srcId: "SRC-004", size: [996, 1230], atSec: 0, label: "PREVIEW · HERO", focus: [0.5, 0.35] },
    flashes: [
      { srcId: "SRC-001", size: [1920, 2813], atSec: 1.0, label: "PREVIEW · FLASH A" },
      { srcId: "SRC-029", size: [1920, 2934], atSec: 2.1, label: "PREVIEW · FLASH B" },
      { srcId: "SRC-007", size: [2288, 4010], atSec: 3.2, label: "PREVIEW · FLASH C", focus: [0.5, 0.3] },
    ],
    flashSec: 0.3,
  },
  "KineticLine-Notebook": {
    lines: [{ text: "Preview line", atSec: 0.4 }, { text: "PREVIEW · MONO LINE", atSec: 1.2, style: "mono" }],
    notebook: { atSec: 0.3, rowsFromSec: 1.0, rowsToSec: 4.0 },
  },
};
