// Decked out Data deck builder: shared head (layouts, palette, helpers). Concatenated as head.js + <project>/slides.js + tail.js.
// Run with: node build.js <deck_config.json>   (see deck/build.sh and examples/blindness/deck_config.json)
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/mnt/skills/public/pptx/scripts/apply_theme.js');

const CFG = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const CFG_DIR = path.dirname(path.resolve(process.argv[2]));
const rel = p => (p ? path.resolve(CFG_DIR, p) : p);
const SLIDES = JSON.parse(fs.readFileSync(rel(CFG.slides_json), 'utf8'));
const OUT = rel(CFG.out_dir); fs.mkdirSync(OUT, { recursive: true });
const AUDIO = rel(CFG.audio);
const EFFECTS = new Set(['fade', 'zoom', 'wipe-from-left', 'wipe-from-right', 'wipe-from-top', 'wipe-from-bottom', 'fly-from-left', 'fly-from-right', 'fly-from-top', 'fly-from-bottom']);

// Palette (seven roles + two media tints). Internal names kept short: navy=Primary, slate=Secondary, grey=Panel, teal=Accent, amber=Callout, red=Negative.
const PAL = CFG.palette;
const HX = { navy: PAL.primary, slate: PAL.secondary, grey: PAL.panel, rule: PAL.rule, teal: PAL.accent, amber: PAL.callout, red: PAL.negative, white: 'FFFFFF' };
const LIGHT = PAL.light_accent;          // trackers, headers, lines and arrows on footage
const LIGHT_RULE = PAL.rule;             // source line, brand and slide number on footage
const MID = PAL.mid;                     // filled boxes on footage (never plain Primary)
const LINE_ON_MEDIA = PAL.line_on_media || PAL.light_accent;
// Visual theme (toolkit 1.5): each project picks a style (boardroom, retro, vintage, modern, editorial...). deck_config
// "theme": {name, head_font, body_font, label_font, radius (inches, rounded panels), title_caps, deco: 'none'|'rules'|'stripes'|'bar'}.
// Fonts must be installed with Windows + Office (Arial, Georgia, Rockwell, Century Gothic, Bahnschrift, Segoe UI, Garamond,
// Courier New, Trebuchet MS, Franklin Gothic Medium, Gill Sans MT...). The theme styles type, frames and textures; charts,
// numbers and snips stay flat, labelled and clean in every theme.
const TH = CFG.theme || {};
const HEAD = TH.head_font || 'Arial', BODY = TH.body_font || 'Arial', LABEL = TH.label_font || BODY;
const RAD = TH.radius || 0, CAPS = !!TH.title_caps, DECO = TH.deco || 'none';
const THEME = {
  name: 'Decked out Data ' + (TH.name ? TH.name + ' / ' : '') + PAL.name, headFontFace: HEAD, bodyFontFace: BODY,
  colors: { dk1: HX.navy, lt1: HX.white, dk2: HX.slate, lt2: HX.grey, accent1: HX.teal, accent2: HX.amber, accent3: HX.red, accent4: LINE_ON_MEDIA, accent5: HX.rule, accent6: MID, hlink: HX.teal, folHlink: HX.slate }
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = CFG.title + ' | Decked out Data';
pres.author = 'Decked out Data';
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
const C = pres.SchemeColor;
const NAVY = C.text1, SLATE = C.text2, GREY = C.background2, WHITE = C.background1, TEAL = C.accent1, AMBER = C.accent2, RED = C.accent3, RULE = C.accent5;

const footer = [
  { text: { text: 'Decked out Data', options: { x: 10.73, y: 6.9, w: 2.0, h: 0.3, fontSize: 10, fontFace: LABEL, color: SLATE, align: 'right', valign: 'middle', margin: 0 } } },
  { line: { x: 0.6, y: 6.78, w: 12.13, h: 0, line: { color: RULE, width: 0.75 } } },
];
// Theme decoration on content slides (kept outside the content zone)
const deco = DECO === 'rules' ? [{ line: { x: 0.6, y: 0.22, w: 12.13, h: 0, line: { color: NAVY, width: 2 } } }, { line: { x: 0.6, y: 0.28, w: 12.13, h: 0, line: { color: NAVY, width: 0.5 } } }]
  : DECO === 'stripes' ? [HX.amber, HX.teal, HX.navy].map((c, i) => ({ rect: { x: 11.93 + i * 0.27, y: 0, w: 0.2, h: 0.62, fill: { color: c } } }))
  : DECO === 'bar' ? [{ rect: { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: TEAL } } }] : [];
// No slide numbers (channel rule since Oct 2026): the brand sits at the bottom-right edge instead.
// Optional house texture: deck_config "texture": "grid" puts a faint grid in the palette's rule colour behind
// white content slides (made by deck/texture.py in build.sh), so explainer and chart slides read as one 'paper'.
const TEXTURE = CFG.texture ? path.join(rel(CFG.out_dir), 'texture_' + CFG.texture + '.png') : null;
pres.defineSlideMaster({
  title: 'CORP_CONTENT', background: TEXTURE && fs.existsSync(TEXTURE) ? { path: TEXTURE } : { color: HX.white }, objects: [...deco, ...footer,
    { placeholder: { options: { name: 'tracker', type: 'body', x: 0.6, y: 0.36, w: 9.5, h: 0.3, fontSize: 12, bold: true, fontFace: LABEL, color: TEAL, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.68, w: 12.13, h: 0.98, fontSize: 28, bold: true, fontFace: HEAD, color: NAVY, align: 'left', valign: 'top', margin: 0 }, text: '' } }]
});
pres.defineSlideMaster({ title: 'CORP_TITLE', background: { color: HX.navy }, objects: [] });
// Full-bleed media slides: video fills the slide (tinted in the clip itself), white type on top
pres.defineSlideMaster({
  title: 'CORP_MEDIA', background: { color: HX.navy }, objects: []
});
pres.defineSlideMaster({ title: 'CORP_BLANK', background: { color: HX.navy }, objects: [] });
const MEDIA = CFG.media_manifest ? JSON.parse(fs.readFileSync(rel(CFG.media_manifest), 'utf8')) : {};
const MATTE = process.env.MATTE;   // 'black' | 'white' for the preview matte renders
const mediaSlots = [];

const timing = { default_transition: 'fade', slides: {} };
const subs = [];
const sections = new Set();
let count = 0;
const sd = n => SLIDES[n - 1];

const OFF = CFG.offset || 0;        // number offset if slide code was written before an opener slide was inserted
const sdo = n => sd(n + OFF);
function frame(n0, layout = 'CORP_CONTENT') {
  const n = n0 + OFF;
  const d = sd(n);
  if (!sections.has(d.chapter)) { pres.addSection({ title: d.chapter }); sections.add(d.chapter); }
  const s = pres.addSlide({ masterName: layout, sectionTitle: d.chapter });
  count += 1; s.__n = count;
  if (count !== n) throw new Error('numbering drift ' + n);
  timing.slides[String(n)] = { advance_s: d.dur, transition: d.trans === 'push-left' ? 'push-left' : 'fade', transition_dur_s: 0.5, animations: [], sfx: [] };
  if (layout === 'CORP_CONTENT') {
    if (d.tracker) s.addText(d.tracker.toUpperCase(), { placeholder: 'tracker' });
    s.addText((CAPS ? d.head.toUpperCase() : d.head).replace(/(\d)-fold/g, '$1\u2011fold'), { placeholder: 'title' });
    if (d.receipt) T(s, d.receipt, { x: 0.6, y: 6.86, w: 9.4, h: 0.36, size: 10, color: SLATE, bold: false, name: 'Source line' });
  }
  s.__media = layout === 'CORP_MEDIA';
  s.addNotes(`VOICEOVER VO-${String(n).padStart(2, '0')} (marked)\n${d.vo_marked.join('\n')}\n\nSPOKEN (plain)\n${d.vo_plain.replace(/\n+/g, ' ')}\n\nDELIVERY\n${d.energy}; ${d.style}; ${d.delivery}\n\nSOURCE-MAP IDS\n${d.sources.join(', ') || 'none'}\n\nCAVEAT ON SCREEN\n${d.caveat || 'none'}`);
  return s;
}
// tie storyboard build i to shape names
function A(s, i, names, o = {}) {
  const d = sd(s.__n), b = d.builds[i];
  if (!b) throw new Error(`slide ${s.__n}: no build ${i}`);
  const eff = o.effect || b.effect;
  if (!EFFECTS.has(eff)) throw new Error('bad effect ' + eff);
  [].concat(names).forEach((nm, k) => {
    const st = Math.min(b.t + (o.stagger || 0) * k, d.dur - 0.6);
    timing.slides[String(s.__n)].animations.push({ shape: nm, effect: eff, start_s: +st.toFixed(2), dur_s: 0.5 });
  });
}
function T(s, text, o) {
  const big = (o.size || 18) >= 22 && (o.bold ?? false);
  s.addText(text, { x: o.x, y: o.y, w: o.w, h: o.h, fontSize: o.size || 18, fontFace: o.font || (big ? HEAD : BODY), bold: o.bold ?? false, italic: !!o.italic, color: o.color || NAVY,
    align: o.align || 'left', valign: o.valign || 'middle', margin: o.margin ?? 0, fill: o.fill ? { color: o.fill } : undefined,
    line: o.line ? { color: o.line, width: o.lw || 1 } : undefined, shape: o.shape, rectRadius: o.rr, paraSpaceAfter: o.psa, lineSpacingMultiple: o.lsm,
    isTextBox: true, objectName: o.name });
}
function R(s, o) {
  const round = RAD && o.round && !o.shape && Math.min(o.w, o.h) > 0.35;   // only panels opt in (round: true); chart marks stay square
  s.addShape(o.shape || (round ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE), { rectRadius: round ? Math.min(RAD, Math.min(o.w, o.h) / 2) : undefined, x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill ? { color: o.fill } : { type: 'none' },
    line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash } : { type: 'none' }, objectName: o.name, flipV: !!o.flipV });
}
function L(s, x, y, w, h, o) {
  s.addShape(pres.shapes.LINE, { x, y, w, h, flipV: !!o.flipV, line: { color: o.color || RULE, width: o.width || 1, dashType: o.dash, endArrowType: o.arrow ? 'triangle' : undefined }, objectName: o.name });
}
function footnote(s, text, y = 6.3, name = 'Footnote') { T(s, text, { x: 0.6, y, w: 12.13, h: 0.42, size: 11, color: SLATE, name }); }
function kpi(s, { x, y, w, h, value, label, color = NAVY, vsize = 60, name }) {
  R(s, { x, y, w, h, fill: GREY, round: true, name });
  T(s, value, { x: x + 0.3, y: y + 0.3, w: w - 0.6, h: h * 0.45, size: vsize, bold: true, color, name: name + ' value' });
  T(s, label, { x: x + 0.3, y: y + 0.3 + h * 0.47, w: w - 0.6, h: h * 0.4, size: 16, color: SLATE, valign: 'top', name: name + ' label' });
  return [name, name + ' value', name + ' label'];
}
function quoteMark(s, x, y, size, name) { T(s, '“', { x, y, w: 0.9, h: 0.9, size, bold: true, color: TEAL, name }); }
function paper(s, { label, title, authors, pub, rows }) {
  T(s, label, { x: 0.6, y: 1.95, w: 6.3, h: 0.35, size: 12, bold: true, color: TEAL, name: 'Paper label' });
  T(s, title, { x: 0.6, y: 2.35, w: 6.3, h: 1.6, size: title.length > 80 ? 19 : 24, bold: true, color: NAVY, valign: 'top', name: 'Paper title' });
  T(s, authors, { x: 0.6, y: 4.0, w: 6.3, h: 0.8, size: 18, color: NAVY, valign: 'top', name: 'Paper authors' });
  T(s, pub, { x: 0.6, y: 4.85, w: 6.3, h: 0.8, size: 15, color: SLATE, valign: 'top', name: 'Paper publisher' });
  R(s, { x: 7.3, y: 1.95, w: 5.43, h: 3.85, fill: GREY, round: true, name: 'Paper panel' });
  const names = ['Paper panel'];
  rows.forEach(([k, v], i) => {
    const yy = 2.15 + i * 1.2;
    T(s, k.toUpperCase(), { x: 7.6, y: yy, w: 4.9, h: 0.3, size: 11, bold: true, color: SLATE, name: `Paper key ${i + 1}` });
    T(s, v, { x: 7.6, y: yy + 0.3, w: 4.9, h: 0.8, size: 16, color: NAVY, valign: 'top', name: `Paper val ${i + 1}` });
    names.push(`Paper key ${i + 1}`, `Paper val ${i + 1}`);
  });
  return { left: ['Paper label', 'Paper title', 'Paper authors', 'Paper publisher'], right: names };
}
function col(s, { x, base, w, h, fill, value, label, name, vcolor = NAVY }) {
  R(s, { x, y: base - h, w, h, fill, name });
  T(s, value, { x: x - 0.5, y: base - h - 0.5, w: w + 1.0, h: 0.45, size: 22, bold: true, color: vcolor, align: 'center', name: name + ' value' });
  if (label) T(s, label, { x: x - 0.6, y: base + 0.06, w: w + 1.2, h: 0.55, size: 13, color: SLATE, align: 'center', valign: 'top', name: name + ' label' });
  return [name, name + ' value'].concat(label ? [name + ' label'] : []);
}
const chev = (s, x, y, w, h, text, fill, name) => s.addText(text, { shape: pres.shapes.CHEVRON, x, y, w, h, fill: { color: fill }, line: { type: 'none' }, fontSize: 15, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: name });


// ---------- media helpers ----------
// Embed a prepared clip; in matte mode draw a flat black/white box instead (used to composite the preview).
function VID(s, key, { x, y, w, h, name }) {
  const m = MEDIA[key]; if (!m) throw new Error('no media ' + key);
  if (m.slide !== s.__n) throw new Error(`media ${key} prepared for slide ${m.slide}, used on ${s.__n}`);
  if (MATTE) R(s, { x, y, w, h, fill: MATTE === 'black' ? '000000' : 'FFFFFF', name });
  else s.addMedia({ type: 'video', path: m.path, cover: 'data:image/png;base64,' + fs.readFileSync(m.cover).toString('base64'), x, y, w, h, objectName: name });
  mediaSlots.push({ slide: s.__n, key, name, path: m.path, x, y, w, h, dur: m.dur });
  if (!MATTE) timing.slides[String(s.__n)].animations.push({ shape: name, effect: 'play', start_s: 0, dur_s: m.dur });
  return name;
}
// Header for full-bleed media slides (white type on the tinted clip)
function mediaHead(s, n0, { receiptColor = LIGHT_RULE } = {}) {
  const d = sdo(n0);
  if (d.tracker) T(s, d.tracker.toUpperCase(), { x: 0.6, y: 0.36, w: 9.5, h: 0.3, size: 12, bold: true, color: LIGHT, name: 'Tracker' });
  T(s, CAPS ? d.head.toUpperCase() : d.head, { x: 0.6, y: 0.68, w: 12.13, h: 0.98, size: 28, bold: true, color: WHITE, valign: 'top', name: 'Title' });
  if (d.receipt) T(s, d.receipt, { x: 0.6, y: 6.86, w: 9.4, h: 0.36, size: 10, color: receiptColor, name: 'Source line' });
  T(s, 'Decked out Data', { x: 10.73, y: 6.9, w: 2.0, h: 0.3, size: 10, color: receiptColor, align: 'right', name: 'Brand' });
}

// Paper profile with a video panel on the right; study details become compact rows under the citation.
function paperMedia(s, { label, title, authors, pub, rows, video }) {
  T(s, label, { x: 0.6, y: 1.95, w: 6.3, h: 0.35, size: 12, bold: true, color: TEAL, name: 'Paper label' });
  T(s, title, { x: 0.6, y: 2.35, w: 6.3, h: 1.25, size: title.length > 80 ? 17 : 21, bold: true, color: NAVY, valign: 'top', name: 'Paper title' });
  T(s, authors, { x: 0.6, y: 3.65, w: 6.3, h: 0.55, size: 15, color: NAVY, valign: 'top', name: 'Paper authors' });
  T(s, pub, { x: 0.6, y: 4.2, w: 6.3, h: 0.35, size: 13, color: SLATE, name: 'Paper publisher' });
  const names = [];
  rows.forEach(([k, v], i) => {
    T(s, [{ text: k.toUpperCase() + '   ', options: { bold: true, color: SLATE, fontSize: 11 } }, { text: v }], { x: 0.6, y: 4.62 + i * 0.42, w: 6.3, h: 0.4, size: 13, name: `Paper row ${i + 1}` });
    names.push(`Paper row ${i + 1}`);
  });
  VID(s, video, { x: 7.3, y: 1.95, w: 5.43, h: 3.95, name: 'Paper video' });
  return { left: ['Paper label', 'Paper title', 'Paper authors', 'Paper publisher'], right: names };
}

// ---------- verbatim snips ----------
const SNIPS = rel(CFG.snips_dir || 'snips');
const SNIP_PX = CFG.snip_px || {};   // {key: [width_px, height_px]} of each cropped snip image
// Verbatim snip: plain crop plus a highlighted copy on top (the highlight wipes in on its own cue).
function snipPanel(s, key, { y, cite, w = 11.2 }) {
  const [pw, ph] = SNIP_PX[key]; const h = w * ph / pw;
  const H = h + 0.85;
  R(s, { x: 0.6, y, w: 12.13, h: H, fill: GREY, round: true, name: 'Snip panel' });
  R(s, { x: 0.85, y: y + 0.15, w: w + 0.2, h: h + 0.2, fill: WHITE, line: RULE, lw: 0.75, name: 'Snip frame' });
  s.addImage({ path: `${SNIPS}/${key}_plain.png`, x: 0.95, y: y + 0.25, w, h, altText: 'Verbatim excerpt from the paper', objectName: 'Snip image' });
  s.addImage({ path: `${SNIPS}/${key}.png`, x: 0.95, y: y + 0.25, w, h, altText: 'Verbatim excerpt from the paper, highlighted', objectName: 'Snip highlight' });
  T(s, '— ' + cite, { x: 0.85, y: y + h + 0.42, w: 11.6, h: 0.35, size: 13, color: SLATE, name: 'Snip cite' });
  return { base: ['Snip panel', 'Snip frame', 'Snip image', 'Snip cite'], hl: 'Snip highlight', bottom: y + H };
}
function tag(s, text, { x, y, w, fill = AMBER, name }) { T(s, text, { x, y, w, h: 0.4, size: 13, bold: true, color: WHITE, fill, align: 'center', name }); }
function strip(s, { y, value, text, name, color = TEAL }) {
  R(s, { x: 0.6, y, w: 12.13, h: 0.8, fill: GREY, round: true, name });
  T(s, value, { x: 0.85, y, w: 2.1, h: 0.8, size: 30, bold: true, color, name: name + ' value' });
  T(s, text, { x: 3.0, y, w: 9.5, h: 0.8, size: 18, name: name + ' text' });
  return [name, name + ' value', name + ' text'];
}


// ---------- word cards and the chapter map ----------
// Word card: a full-screen word or short phrase at a climax ("Looking." / "isn't seeing."). Lines appear one by one
// (evenly across the first 60% of the slide unless `at` gives start times); the last line is in the light Accent.
// Storyboard layout 'word-card'; text from opts.lines or the slide's `lines` field (list) or its head.
function wordCard(n0, opts = {}) {
  const d = sdo(n0);
  const s = frame(n0, opts.video ? 'CORP_MEDIA' : 'CORP_TITLE');
  if (opts.video) VID(s, opts.video, { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Word video' });
  const lines = opts.lines || d.lines || [d.head];
  const lh = Math.min(1.6, 5.2 / lines.length), size = opts.size || (lines.length > 2 ? 60 : 80);
  const y0 = 3.75 - (lines.length * lh) / 2;
  const tm = timing.slides[String(s.__n)];
  lines.forEach((ln, i) => {
    const nm = `Word ${i + 1}`;
    T(s, ln, { x: 0.8, y: y0 + i * lh, w: 11.73, h: lh, size, bold: true, color: i === lines.length - 1 && lines.length > 1 ? LIGHT : WHITE, align: opts.align || 'center', name: nm });
    const spoken = d.dur - (d.hold || 0);   // reveal the lines while the narration runs, not during the silent hold
    const st = opts.at ? opts.at[i] : (lines.length === 1 ? 0.2 : 0.2 + i * (spoken * 0.6) / Math.max(1, lines.length - 1));
    tm.animations.push({ shape: nm, effect: 'fade', start_s: +Math.min(st, d.dur - 0.6).toFixed(2), dur_s: 0.6 });
  });
  return s;
}
// Chapter map: the agenda again at each chapter, the current item highlighted in Callout, past items dimmed, and
// items not yet revealed shown as '??????' (keeps the curiosity gap). Storyboard layout 'map', fields map_items,
// map_current (0-based) and map_hidden (indices still hidden). opts.video puts it over a tinted clip; opts.rowBuilds
// (one storyboard build index per row) and opts.titleBuild reveal the rows one by one, e.g. for the opening agenda map.
function mapSlide(n0, opts = {}) {
  const d = sdo(n0);
  const s = frame(n0, opts.video ? 'CORP_MEDIA' : 'CORP_TITLE');
  if (opts.video) VID(s, opts.video, { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Map video' });
  const items = opts.items || d.map_items, cur = opts.current ?? d.map_current ?? 0, hidden = new Set(opts.hidden || d.map_hidden || []);
  T(s, (opts.title || d.tracker || 'Where we are').toUpperCase(), { x: 0.9, y: 0.8, w: 11, h: 0.5, size: 16, bold: true, color: LIGHT, name: 'Map title' });
  const rh = Math.min(0.95, 5.0 / items.length), y0 = 1.7;
  const tm = timing.slides[String(s.__n)];
  items.forEach((it, i) => {
    const y = y0 + i * rh, on = i === cur, past = i < cur, nm = `Map row ${i + 1}`;
    if (on) R(s, { x: 0.8, y: y + 0.08, w: 0.75, h: rh - 0.16, fill: HX.amber, name: nm + ' mark' });
    T(s, String(i + 1), { x: 0.8, y, w: 0.75, h: rh, size: 28, bold: true, color: on ? WHITE : (past ? LINE_ON_MEDIA : LIGHT), align: 'center', name: nm + ' num' });
    T(s, hidden.has(i) ? '??????????' : it, { x: 1.8, y, w: 10.5, h: rh, size: on ? 30 : 24, bold: on, color: on ? WHITE : (past ? LINE_ON_MEDIA : LIGHT_RULE), name: nm });
  });
  if (opts.rowBuilds) {        // reveal rows on storyboard builds: rowBuilds[i] = build index for row i (titleBuild for the title)
    if (opts.titleBuild !== undefined) A(s, opts.titleBuild, 'Map title');
    items.forEach((_, i) => A(s, opts.rowBuilds[i], [`Map row ${i + 1} num`, `Map row ${i + 1}`].concat(i === cur ? [`Map row ${i + 1} mark`] : [])));
  } else if (items.length) tm.animations.push({ shape: `Map row ${cur + 1} mark`, effect: 'wipe-from-left', start_s: 0.4, dur_s: 0.5 });
  return s;
}


// ---------- evidence cards, pills, hypotheses and the verdict scorecard (toolkit 1.3) ----------
// Pill: a rounded capsule label for mechanism diagrams and thought experiments ("BREAD", "1 EDUCATION", "INFLATION").
function pill(s, text, { x, y, w, h = 0.5, fill = WHITE, color = NAVY, line = NAVY, size = 15, name }) {
  T(s, text.toUpperCase(), { x, y, w, h, size, bold: true, color, fill, line, lw: 1.5, align: 'center', shape: pres.shapes.ROUNDED_RECTANGLE, rr: 0.5, name });
  return name;
}
// Evidence card: a real screenshot of the source (a survey chart, a headline, a paper's title block) as a white card
// with a soft shadow, optionally tilted and bleeding off the slide edge, plus an arrow at the highlighted line.
// img: a snip key (uses snips/<key>.png and, for the arrow, snips/<key>.json written by snip.py) or {path, px:[w,h]}.
// Returns {card, arrow} shape names for builds: fly or wipe the card in, then the arrow on the matching words.
function evidenceCard(s, img, { x, y, w, rotate = 0, arrow = true, name = 'Evidence', cite }) {
  const pth = typeof img === 'string' ? `${SNIPS}/${img}.png` : img.path;
  const px = typeof img === 'string' ? (SNIP_PX[img] || JSON.parse(fs.readFileSync(`${SNIPS}/${img}.json`, 'utf8')).size) : img.px;
  const h = w * px[1] / px[0], pad = 0.18;
  s.addShape(pres.shapes.RECTANGLE, { x: x - pad, y: y - pad, w: w + 2 * pad, h: h + 2 * pad, fill: { color: 'FFFFFF' }, line: { color: HX.rule, width: 0.75 }, rotate,
    shadow: { type: 'outer', color: '000000', opacity: 0.28, blur: 8, offset: 4, angle: 90 }, objectName: name + ' card' });
  s.addImage({ path: pth, x, y, w, h, rotate, altText: 'Screenshot of the source', objectName: name + ' image' });
  const names = { card: [name + ' card', name + ' image'], arrow: null, bottom: y + h + pad };
  const meta = typeof img === 'string' && fs.existsSync(`${SNIPS}/${img}.json`) ? JSON.parse(fs.readFileSync(`${SNIPS}/${img}.json`, 'utf8')) : null;
  if (arrow && meta && meta.hl && !rotate) {   // arrow from the left edge to the start of the highlighted line
    const ay = y + h * (meta.hl[1] + meta.hl[3]) / 2, ax = x + w * meta.hl[0];
    L(s, Math.max(0.15, ax - 1.3), ay, Math.min(1.15, ax - 0.15), 0, { color: HX.red, width: 4.5, arrow: true, name: name + ' arrow' });
    names.arrow = name + ' arrow';
  }
  if (cite) { T(s, cite, { x, y: y + h + pad + 0.08, w, h: 0.32, size: 11, color: s.__media ? LIGHT_RULE : SLATE, name: name + ' cite' }); names.card.push(name + ' cite'); }
  return names;
}
// Hypotheses slide: the competing explanations, numbered, as the video's spine ("1 People are missing something",
// "2 The data is missing something"). Storyboard layout 'hypotheses' with field theories [..]. Rows appear on builds.
function hypotheses(n0, opts = {}) {
  const d = sdo(n0);
  const s = opts.video ? frame(n0, 'CORP_MEDIA') : frame(n0);
  if (opts.video) { VID(s, opts.video, { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Hyp video' }); mediaHead(s, n0); }
  const th = opts.theories || d.theories, rh = Math.min(1.2, 4.4 / th.length);
  const out = [];
  th.forEach((t, i) => {
    const y = 1.95 + i * rh, nm = `Theory ${i + 1}`;
    T(s, String(i + 1), { x: 0.6, y: y + 0.08, w: rh - 0.16, h: rh - 0.16, size: 30, bold: true, color: WHITE, fill: HX.amber, align: 'center', shape: pres.shapes.OVAL, name: nm + ' num' });
    T(s, t, { x: 0.6 + rh + 0.15, y, w: 11.2, h: rh, size: 26, bold: true, color: opts.video ? WHITE : NAVY, name: nm });
    out.push([nm + ' num', nm]);
  });
  return { s, rows: out };
}
// Verdict scorecard: the theories ranked by how well the evidence supports them, with a 0-3 dot score and a
// one-line reason. Storyboard layout 'scorecard' with field verdicts [{theory, score 0-3, note}]. The channel's
// answer slide when the video tests competing explanations.
function scorecard(n0, opts = {}) {
  const d = sdo(n0);
  const s = opts.video ? frame(n0, 'CORP_MEDIA') : frame(n0);
  if (opts.video) { VID(s, opts.video, { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Score video' }); mediaHead(s, n0); }
  const rows = (opts.verdicts || d.verdicts).slice().sort((a, b) => b.score - a.score), rh = Math.min(1.15, 4.3 / rows.length);
  const on = !!opts.video, txt = on ? WHITE : NAVY, sub = on ? LIGHT_RULE : SLATE, off = on ? MID : HX.grey;
  T(s, 'EVIDENCE', { x: 7.4, y: 1.8, w: 1.9, h: 0.3, size: 11, bold: true, color: sub, align: 'center', name: 'Score head' });
  const out = [];
  rows.forEach((r, i) => {
    const y = 2.15 + i * rh, nm = `Verdict ${i + 1}`;
    if (!on) R(s, { x: 0.6, y: y + 0.05, w: 12.13, h: rh - 0.1, fill: i === 0 ? HX.grey : 'FFFFFF', line: HX.rule, lw: 0.75, round: true, name: nm + ' row' });
    T(s, r.theory, { x: 0.85, y, w: 6.4, h: rh, size: 20, bold: true, color: txt, name: nm + ' theory' });
    for (let k = 0; k < 3; k++) R(s, { shape: pres.shapes.OVAL, x: 7.6 + k * 0.55, y: y + rh / 2 - 0.19, w: 0.38, h: 0.38, fill: k < r.score ? HX.amber : off, name: `${nm} dot ${k + 1}` });
    T(s, r.note, { x: 9.5, y, w: 3.1, h: rh, size: 13, color: sub, name: nm + ' note' });
    out.push([nm + ' row', nm + ' theory', `${nm} dot 1`, `${nm} dot 2`, `${nm} dot 3`, nm + ' note'].filter(x => on ? !x.endsWith(' row') : true));
  });
  return { s, rows: out };
}
