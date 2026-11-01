// Blindness deck: per-slide code (uses helpers from deck/head.js). Slide n0 numbering + CFG.offset.
let s;
// ===== 0 Opener: 'try it yourself' video (full screen) =====
{
  const d = sd(1);
  pres.addSection({ title: d.chapter }); sections.add(d.chapter);
  s = pres.addSlide({ masterName: 'CORP_BLANK', sectionTitle: d.chapter }); count += 1; s.__n = count;
  timing.slides['1'] = { advance_s: d.dur, transition: 'fade', transition_dur_s: 0.5, animations: [], sfx: [] };
  s.addNotes(`OPENER VIDEO (narration is in the narration track)\n${d.vo_marked.join('\n')}\n\nSOURCE-MAP IDS\n${d.sources.join(', ')}`);
  VID(s, 'opener', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Opener video' });
}
// ===== 1 Cold open KPI =====
s = frame(1);
VID(s, 's1_gorilla', { x: 7.1, y: 1.9, w: 5.63, h: 3.95, name: 'Gorilla video' });
T(s, 'Stock footage: a real gorilla (Mixkit)', { x: 7.1, y: 5.9, w: 5.63, h: 0.3, size: 10, italic: true, color: SLATE, align: 'right', name: 'Video credit' });
const k1 = kpi(s, { x: 0.6, y: 1.9, w: 6.2, h: 1.9, value: '78%', label: 'in a national survey agreed people generally notice when something unexpected enters their field of view', vsize: 48, name: 'Tile 1' });
const k2 = kpi(s, { x: 0.6, y: 3.95, w: 6.2, h: 1.9, value: '~50%', label: 'of observers missed a person in a gorilla suit walking through a ball-passing video', color: TEAL, vsize: 48, name: 'Tile 2' });
footnote(s, "Survey figure as reported in Simons's Noba chapter (citing Simons and Chabris, 2010).", 6.25);
A(s, 2, k1); A(s, 3, k2, { stagger: 0.12 }); A(s, 4, 'Footnote');

// ===== 2 Title =====
s = frame(2, 'CORP_TITLE');
VID(s, 's2_crowd', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Crowd video' });
T(s, sdo(2).head, { x: 0.9, y: 2.2, w: 11.5, h: 1.6, size: 44, bold: true, color: WHITE, name: 'Title' });
T(s, sdo(2).sup, { x: 0.9, y: 3.95, w: 11.5, h: 0.6, size: 22, color: RULE, name: 'Subtitle' });
L(s, 0.9, 5.9, 1.2, 0, { color: TEAL, width: 3, name: 'Title rule' });
T(s, 'Decked out Data', { x: 0.9, y: 6.0, w: 4, h: 0.4, size: 14, bold: true, color: WHITE, name: 'Channel name' });
A(s, 1, 'Subtitle'); A(s, 2, ['Title rule', 'Channel name'], { stagger: 0.2 });

// ===== 3 Agenda =====
s = frame(3, 'CORP_MEDIA');
VID(s, 's3_dusk', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Dusk video' });
mediaHead(s, 3);
const agenda = ['The basics: attention as a filter', 'Experts: radiologists and a gorilla (Drew, Võ and Wolfe, 2013)', 'The real world: a staged fight (Chabris et al., 2011)', 'Is it just some people? (Kreitz et al., 2015)', 'The twist: did they really see nothing? (Nartker et al., 2025)', 'What this means for you'];
agenda.forEach((t, i) => {
  const yy = 1.95 + i * 0.74;
  T(s, String(i + 1), { x: 0.6, y: yy, w: 0.6, h: 0.6, size: 24, bold: true, color: i === 4 ? AMBER : LIGHT, name: `Row ${i + 1} num` });
  T(s, t, { x: 1.3, y: yy, w: 11.4, h: 0.6, size: 20, bold: i === 4, color: WHITE, name: `Row ${i + 1} text` });
  L(s, 0.6, yy + 0.67, 12.13, 0, { color: LINE_ON_MEDIA, width: 0.75, name: `Row ${i + 1} rule` });
});
const row = i => [`Row ${i} num`, `Row ${i} text`, `Row ${i} rule`];
A(s, 1, [...row(1), ...row(2)], { stagger: 0.12 }); A(s, 2, [...row(3), ...row(4)], { stagger: 0.12 }); A(s, 3, row(5)); A(s, 4, row(6));

// ===== 4 Process: attention as a filter =====
s = frame(4, 'CORP_MEDIA');
VID(s, 's4_street', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Street video' });
mediaHead(s, 4);
chev(s, 0.6, 2.05, 4.5, 1.4, 'Everything your eyes and ears take in', SLATE, 'Chevron 1');
chev(s, 4.95, 2.05, 4.1, 1.4, 'Attention selects', NAVY, 'Chevron 2');
chev(s, 8.9, 2.05, 3.83, 1.4, "What you're aware of", TEAL, 'Chevron 3');
R(s, { x: 0.6, y: 3.95, w: 12.13, h: 1.9, fill: GREY, name: 'Def panel' });
quoteMark(s, 0.8, 3.9, 66, 'Def mark');
T(s, 'We appear able to process only one stream of information at a time, effectively filtering other information from awareness.', { x: 1.65, y: 4.1, w: 10.8, h: 1.1, size: 22, bold: true, name: 'Def text' });
T(s, '— Daniel Simons, Noba Project', { x: 1.65, y: 5.25, w: 10.8, h: 0.4, size: 14, color: SLATE, name: 'Def cite' });
A(s, 1, 'Chevron 1'); A(s, 2, 'Chevron 2'); A(s, 3, 'Chevron 3'); A(s, 4, ['Def panel', 'Def mark', 'Def text', 'Def cite'], { stagger: 0.1 });

// ===== 5 Definition: the gorilla experiment =====
s = frame(5);
T(s, 'Inattentional blindness', { x: 0.6, y: 1.95, w: 5.6, h: 0.55, size: 26, bold: true, name: 'Term' });
T(s, 'The surprising failure to notice an unexpected object or event when attention is focused on something else.', { x: 0.6, y: 2.55, w: 5.6, h: 1.5, size: 18, color: SLATE, valign: 'top', name: 'Definition' });
T(s, '— Simons, Noba Project', { x: 0.6, y: 4.0, w: 5.6, h: 0.35, size: 13, color: SLATE, name: 'Def cite' });
VID(s, 's5_anim', { x: 6.6, y: 1.95, w: 6.13, h: 3.065, name: 'Experiment animation' });
T(s, 'About half the viewers missed the gorilla', { x: 0.6, y: 5.3, w: 12.13, h: 0.75, size: 24, bold: true, color: WHITE, fill: TEAL, align: 'center', name: 'Result strip' });
A(s, 1, ['Term', 'Definition', 'Def cite'], { stagger: 0.15 }); A(s, 5, 'Result strip');

// ===== 6 Driver tree: what makes you miss =====
s = frame(6, 'CORP_MEDIA');
VID(s, 's6_court', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Court video' });
mediaHead(s, 6);
T(s, 'Chance of missing the unexpected', { x: 0.6, y: 2.85, w: 3.3, h: 1.4, size: 20, bold: true, color: WHITE, fill: TEAL, align: 'center', name: 'Root' });
L(s, 3.9, 3.55, 0.35, 0, { color: LIGHT, width: 1.5, name: 'Trunk' });
L(s, 4.25, 2.7, 0, 1.75, { color: LIGHT, width: 1.5, name: 'Stem' });
const br6 = (y, head, body, nm) => {
  L(s, 4.25, y + 0.75, 0.35, 0, { color: LIGHT, width: 1.5, name: nm + ' arm' });
  R(s, { x: 4.6, y, w: 8.13, h: 1.5, fill: GREY, name: nm });
  T(s, head, { x: 4.85, y: y + 0.12, w: 7.6, h: 0.45, size: 21, bold: true, color: TEAL, name: nm + ' head' });
  T(s, body, { x: 4.85, y: y + 0.58, w: 7.6, h: 0.85, size: 16, valign: 'top', name: nm + ' body' });
};
br6(1.95, 'A harder task', 'Keeping separate counts of bounce passes and aerial passes made viewers less likely to notice the gorilla.', 'Branch 1');
br6(3.7, "It resembles what you're ignoring", 'Viewers counting the team in white missed the dark gorilla more than those counting the team in black.', 'Branch 2');
T(s, [{ text: 'Even unique items get missed: ', options: { bold: true } }, { text: 'about 30% failed to see a bright red cross crossing the screen for five seconds (Most et al., 2001).' }], { x: 0.6, y: 5.5, w: 12.13, h: 0.65, size: 16, fill: GREY, margin: 8, name: 'Bottom note' });
A(s, 1, ['Branch 1 arm', 'Branch 1', 'Branch 1 head']); A(s, 2, 'Branch 1 body'); A(s, 3, ['Branch 2 arm', 'Branch 2', 'Branch 2 head']); A(s, 4, 'Branch 2 body'); A(s, 5, 'Bottom note');

// ===== 7 Definition: how it's measured =====
s = frame(7, 'CORP_MEDIA');
VID(s, 's7_notes', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Notes video' });
mediaHead(s, 7);
R(s, { x: 0.6, y: 1.95, w: 12.13, h: 1.7, fill: GREY, name: 'Q panel' });
quoteMark(s, 0.8, 1.9, 66, 'Q mark');
T(s, "Did you notice anything unusual on the last trial which wasn't there on previous trials?", { x: 1.65, y: 2.1, w: 10.8, h: 1.0, size: 24, bold: true, name: 'Q text' });
T(s, '— the standard question, as described by Nartker et al. (2025)', { x: 1.65, y: 3.1, w: 10.8, h: 0.4, size: 13, color: SLATE, name: 'Q cite' });
T(s, 'Answer: no', { x: 0.6, y: 4.1, w: 3.0, h: 1.0, size: 22, bold: true, color: WHITE, fill: TEAL, align: 'center', name: 'Flow 1' });
L(s, 3.7, 4.6, 0.8, 0, { color: LIGHT, width: 2, arrow: true, name: 'Flow arrow' });
T(s, 'Counted as inattentionally blind: assumed to have seen nothing', { x: 4.6, y: 4.1, w: 8.13, h: 1.0, size: 20, bold: true, fill: GREY, align: 'center', name: 'Flow 2' });
tag(s, 'Hold that thought', { x: 10.23, y: 5.45, w: 2.5, name: 'Hold tag' });
A(s, 1, ['Q panel', 'Q mark', 'Q text', 'Q cite'], { stagger: 0.1 }); A(s, 2, ['Flow 1', 'Flow arrow', 'Flow 2'], { stagger: 0.3 }); A(s, 3, 'Hold tag');

// ===== 8 Paper profile: Drew =====
s = frame(8);
let P = paper(s, { label: 'RESEARCH 1  |  PEER-REVIEWED', title: 'The invisible gorilla strikes again: Sustained inattentional blindness in expert observers', authors: 'Trafton Drew, Melissa L.-H. Võ, Jeremy M. Wolfe', pub: 'Psychological Science 24(9), 2013',
  rows: [['Sample', '24 radiologists; 24-25 untrained observers'], ['Task', 'Search five lung CT scans for nodules while eye-tracked'], ['The twist', 'A gorilla inserted into the last scan']] });
tag(s, '24 radiologists, eye-tracked', { x: 7.3, y: 5.95, w: 3.4, fill: TEAL, name: 'Teal tag' });
A(s, 1, P.left, { stagger: 0.15 }); A(s, 2, P.right, { stagger: 0.08 }); A(s, 3, 'Teal tag');

// ===== 9 KPI: gorilla in the lungs =====
s = frame(9, 'CORP_MEDIA');
VID(s, 's9_hall', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Hospital video' });
mediaHead(s, 9);
T(s, 'Generic hospital footage, not from the study', { x: 0.6, y: 5.6, w: 6, h: 0.35, size: 11, italic: true, color: LIGHT_RULE, name: 'Footage note' });
const g1 = kpi(s, { x: 0.6, y: 2.0, w: 3.75, h: 3.4, value: '48x', label: 'Gorilla size vs the average lung nodule in the scans', name: 'Tile 1' });
const g2 = kpi(s, { x: 4.8, y: 2.0, w: 3.75, h: 3.4, value: 'Matchbook', label: 'Roughly the gorilla’s size, inside a scan of 239 slices', vsize: 40, name: 'Tile 2' });
const g3 = kpi(s, { x: 9.0, y: 2.0, w: 3.73, h: 3.4, value: '20 of 24', label: 'Radiologists who did not report the gorilla (83%)', color: TEAL, vsize: 54, name: 'Tile 3' });
A(s, 1, g1); A(s, 2, g2); A(s, 3, g3);

// ===== 10 Snip + strips: looked right at it =====
s = frame(10);
let sp = snipPanel(s, 'drew', { y: 1.9, cite: sdo(10).snippet.attribution });
const e1 = strip(s, { y: sp.bottom + 0.3, value: '12 of 20', text: 'radiologists who missed the gorilla looked directly at its location (eye-tracking)', name: 'Eye strip' });
const e2 = strip(s, { y: sp.bottom + 1.25, value: '88%', text: 'detection by untrained observers when told where to look (control test)', name: 'Control strip', color: NAVY });
footnote(s, 'The authors suggest a light-coloured gorilla, closer to the bright nodules the radiologists hunted, might have been noticed more.', 5.95);
A(s, 1, sp.base, { stagger: 0.05 }); A(s, 2, sp.hl, { effect: 'wipe-from-left' }); A(s, 3, e1); A(s, 4, e2); A(s, 5, 'Footnote');

// ===== 11 Timeline: the Boston case =====
s = frame(11, 'CORP_MEDIA');
VID(s, 's11_night', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Night video' });
mediaHead(s, 11);
L(s, 0.9, 3.0, 11.6, 0, { color: LIGHT_RULE, width: 1.5, name: 'Axis' });
const pts = [['25 Jan 1995, 2 a.m.', 'Officer Kenny Conley chases a suspect over a fence, past where fellow officer Michael Cox is being beaten', 'FFFFFF'],
  ['Afterwards', 'Conley says he didn’t see the beating', 'FFFFFF'], ['Trial', 'Convicted of perjury and obstruction; sentenced to 34 months', AMBER], ['Later', 'Wins on appeal; not retried', LIGHT]];
pts.forEach(([d, t, c], i) => {
  const x = 0.9 + i * 3.0, nm = `Point ${i + 1}`;
  s.addShape(pres.shapes.OVAL, { x: x + 0.05, y: 2.82, w: 0.36, h: 0.36, fill: { color: c }, line: { type: 'none' }, objectName: nm + ' dot' });
  T(s, d, { x, y: 2.2, w: 2.85, h: 0.45, size: 14, bold: true, color: c, name: nm + ' date' });
  T(s, t, { x, y: 3.4, w: 2.75, h: 1.8, size: 16, valign: 'top', color: WHITE, name: nm });
});
T(s, 'The appeal decision did not rely on inattentional blindness (Chabris et al., 2011).', { x: 0.6, y: 5.8, w: 9, h: 0.4, size: 11, color: LIGHT_RULE, name: 'Footnote' });
T(s, 'Generic stock footage, not the 1995 scene', { x: 8.7, y: 6.35, w: 4.03, h: 0.3, size: 10, italic: true, color: LIGHT_RULE, align: 'right', name: 'Footage note' });
const pt = i => [`Point ${i} dot`, `Point ${i} date`, `Point ${i}`];
A(s, 1, pt(1)); A(s, 2, pt(2)); A(s, 3, pt(3)); A(s, 4, [...pt(4), 'Footnote']);

// ===== 12 Paper profile: Chabris =====
s = frame(12);
P = paperMedia(s, { video: 's12_jog', label: 'RESEARCH 2  |  PEER-REVIEWED SHORT REPORT', title: 'You do not talk about Fight Club if you do not notice Fight Club: Inattentional blindness for a simulated real-world assault', authors: 'Christopher Chabris, Adam Weinberger, Matthew Fontaine, Daniel Simons', pub: 'i-Perception 2, 2011',
  rows: [['Task', 'Follow a runner 9.1 m behind on a 400 m route, counting his head-touches'], ['The surprise', 'Three people staging a fight, 8 m off the path'], ['Sample', '94 students across three studies']] });
tag(s, 'A staged fight beside the route', { x: 7.3, y: 5.95, w: 3.7, fill: TEAL, name: 'Teal tag' });
A(s, 1, P.left, { stagger: 0.15 }); A(s, 2, P.right, { stagger: 0.08 }); A(s, 3, 'Teal tag');

// ===== 13 Columns: night and day =====
s = frame(13);
const b13 = 5.5, k13 = 0.032;
T(s, 'Share of runners who noticed the fight (%)', { x: 0.6, y: 1.85, w: 7, h: 0.4, size: 14, color: SLATE, name: 'Chart title' });
L(s, 0.8, b13, 6.8, 0, { color: SLATE, width: 1, name: 'Baseline' });
const n1 = col(s, { x: 1.8, base: b13, w: 1.9, h: 35 * k13, fill: NAVY, value: '35%', label: 'Night (7 of 20)', name: 'Night col' });
const n2 = col(s, { x: 4.6, base: b13, w: 1.9, h: 56 * k13, fill: TEAL, value: '56%', label: 'Day (9 of 16)', name: 'Day col', vcolor: TEAL });
VID(s, 's13_night', { x: 8.3, y: 2.3, w: 2.1, h: 1.3, name: 'Night clip' });
VID(s, 's13_day', { x: 10.63, y: 2.3, w: 2.1, h: 1.3, name: 'Day clip' });
T(s, 'Night', { x: 8.3, y: 3.65, w: 2.1, h: 0.35, size: 14, bold: true, color: NAVY, name: 'Night clip label' });
T(s, 'Day', { x: 10.63, y: 3.65, w: 2.1, h: 0.35, size: 14, bold: true, color: TEAL, name: 'Day clip label' });
T(s, 'In daylight the fight was visible for at least 30 seconds.', { x: 8.3, y: 4.2, w: 4.43, h: 1.2, size: 20, bold: true, fill: GREY, margin: 8, name: 'Note text' });
subs.push('Slide 13: columns drawn exact-scale (0.032 in per percentage point).');
A(s, 1, n1, { stagger: 0.2 }); A(s, 2, n2, { stagger: 0.2 }); A(s, 3, 'Note text');

// ===== 14 Bars: load + snip =====
s = frame(14);
T(s, 'Share who noticed the fight, daytime (%)', { x: 0.6, y: 1.85, w: 7, h: 0.35, size: 14, color: SLATE, name: 'Chart title' });
const x14 = 5.0, k14 = 0.075;
L(s, x14, 2.3, 0, 1.9, { color: SLATE, width: 1, name: 'Axis' });
const bar14 = (y, label, v, fill, nm, c) => { T(s, label, { x: 0.6, y, w: 4.2, h: 0.75, size: 16, bold: true, align: 'right', name: nm + ' label' }); R(s, { x: x14, y, w: v * k14, h: 0.75, fill, name: nm }); T(s, `${v}%`, { x: x14 + v * k14 + 0.15, y, w: 1.4, h: 0.75, size: 22, bold: true, color: c, name: nm + ' value' }); return [nm + ' label', nm, nm + ' value']; };
const lb1 = bar14(2.35, 'Just follow the runner (18 of 25)', 72, NAVY, 'Bar 1', NAVY);
const lb2 = bar14(3.3, 'Keep separate counts for each hand (14 of 33)', 42, TEAL, 'Bar 2', TEAL);
sp = snipPanel(s, 'chabris', { y: 4.45, cite: sdo(14).snippet.attribution });
subs.push('Slide 14: bars drawn exact-scale (0.075 in per percentage point).');
A(s, 1, lb1, { stagger: 0.15 }); A(s, 2, lb2, { stagger: 0.15 }); A(s, 3, sp.base, { stagger: 0.05 }); A(s, 4, sp.hl, { effect: 'wipe-from-left' });

// ===== 15 Paper profile: Kreitz =====
s = frame(15);
P = paperMedia(s, { video: 's15_study', label: 'RESEARCH 3  |  PEER-REVIEWED, OPEN ACCESS', title: 'Inattentional Blindness and Individual Differences in Cognitive Abilities', authors: 'Carina Kreitz, Philip Furley, Daniel Memmert, Daniel Simons', pub: 'PLOS ONE 10(8), 2015',
  rows: [['Sample', 'University students: 116 in study 1, 198 in study 2'], ['Measures', 'Working memory, breadth of attention, and more'], ['Test', 'Several inattentional blindness tasks each']] });
A(s, 1, P.left, { stagger: 0.15 }); A(s, 2, P.right, { stagger: 0.08 });

// ===== 16 Does / doesn't + snip =====
s = frame(16);
T(s, 'PREDICTED NOTICING', { x: 0.6, y: 1.9, w: 5.9, h: 0.4, size: 14, bold: true, color: TEAL, name: 'Hdr yes' });
L(s, 0.6, 2.32, 5.9, 0, { color: TEAL, width: 1.5, name: 'Rule yes' });
T(s, [{ text: '✓  ', options: { color: TEAL, bold: true } }, { text: 'Working memory, weakly, in one of four task versions' }], { x: 0.6, y: 2.45, w: 5.9, h: 0.7, size: 17, name: 'Yes 1' });
T(s, "DIDN'T PREDICT NOTICING", { x: 6.83, y: 1.9, w: 5.9, h: 0.4, size: 14, bold: true, color: SLATE, name: 'Hdr no' });
L(s, 6.83, 2.32, 5.9, 0, { color: SLATE, width: 1.5, name: 'Rule no' });
T(s, [{ text: '–  Working memory in the other tasks', options: { breakLine: true } }, { text: '–  Breadth of attention', options: { breakLine: true } }, { text: '–  Noticing in one task barely predicted another' }], { x: 6.83, y: 2.45, w: 5.9, h: 1.5, size: 17, valign: 'top', psa: 4, name: 'No list' });
sp = snipPanel(s, 'kreitz', { y: 4.15, cite: sdo(16).snippet.attribution });
A(s, 1, ['Hdr yes', 'Rule yes', 'Yes 1']); A(s, 2, ['Hdr no', 'Rule no', 'No list']); A(s, 3, sp.base, { stagger: 0.05 }); A(s, 4, sp.hl, { effect: 'wipe-from-left' });

// ===== 17 Paper profile: Nartker =====
s = frame(17);
P = paperMedia(s, { video: 's17_office', label: 'RESEARCH 4  |  PEER-REVIEWED (eLife ASSESSMENT: CONVINCING)', title: 'Sensitivity to visual features in inattentional blindness', authors: 'Makaela Nartker, Chaz Firestone, Howard Egeth, Ian Phillips (Johns Hopkins)', pub: 'eLife, Version of Record 19 May 2025',
  rows: [['Sample', 'Over 25,000 online participants'], ['Design', 'Five pre-registered experiments'], ['Authors’ claim', 'The largest ever set of inattentional blindness studies']] });
tag(s, 'Over 25,000 people', { x: 7.3, y: 5.95, w: 2.6, name: 'Amber tag' });
tag(s, 'Largest ever set of IB studies', { x: 10.05, y: 5.95, w: 2.68, fill: NAVY, name: 'Largest tag' });
A(s, 1, P.left, { stagger: 0.15 }); A(s, 2, P.right, { stagger: 0.08 }); A(s, 3, 'Amber tag'); A(s, 4, 'Largest tag');

// ===== 18 Process: the extra question =====
s = frame(18, 'CORP_MEDIA');
VID(s, 's18_laptop', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Laptop video' });
mediaHead(s, 18);
const ch18 = ['Judge which arm of a cross is longer', 'A surprise red line flashes at the side', 'Did you notice anything unusual? (yes/no)', 'Even if no: was it on the left or right?'];
ch18.forEach((t, i) => chev(s, 0.6 + i * 3.04, 2.2, 3.12, 1.5, t, i === 3 ? TEAL : NAVY, `Chevron ${i + 1}`));
T(s, 'Some people were shown nothing at all, but asked anyway', { x: 0.6, y: 4.3, w: 7.0, h: 0.6, size: 17, bold: true, fill: GREY, align: 'center', name: 'Absent tag' });
T(s, 'Experiment 1 design (N = 374); absent trials were added in later experiments.', { x: 0.6, y: 5.4, w: 12.13, h: 0.42, size: 12, color: LIGHT_RULE, name: 'Footnote' });
A(s, 1, 'Chevron 1'); A(s, 2, 'Chevron 2'); A(s, 3, 'Chevron 3'); A(s, 4, 'Chevron 4'); A(s, 5, ['Absent tag', 'Footnote'], { stagger: 0.2 });

// ===== 19 Columns: they saw more than they said =====
s = frame(19);
const b19 = 5.45, k19 = 0.031;
T(s, 'Experiment 1 (%)', { x: 0.6, y: 1.85, w: 7, h: 0.35, size: 14, color: SLATE, name: 'Chart title' });
L(s, 0.8, b19, 11.4, 0, { color: SLATE, width: 1, name: 'Baseline' });
const c1 = col(s, { x: 1.4, base: b19, w: 2.2, h: 71.4 * k19, fill: SLATE, value: '71.4%', label: 'Said they noticed it', name: 'Col 1' });
const c2 = col(s, { x: 5.2, base: b19, w: 2.2, h: 87.4 * k19, fill: NAVY, value: '87.4%', label: 'Located it correctly', name: 'Col 2' });
const c3 = col(s, { x: 9.0, base: b19, w: 2.2, h: 63.6 * k19, fill: TEAL, value: '63.6%', label: '“Non-noticers” who located it', name: 'Col 3', vcolor: TEAL });
L(s, 8.6, b19 - 50 * k19, 4.1, 0, { color: AMBER, width: 2.5, dash: 'dash', name: 'Chance line' });
T(s, 'guessing: 50%', { x: 11.25, y: b19 - 50 * k19 - 0.4, w: 1.48, h: 0.35, size: 12, bold: true, color: AMBER, align: 'right', name: 'Chance label' });
subs.push('Slide 19: columns drawn exact-scale (0.031 in per percentage point); the 50% chance line is at exact height.');
A(s, 1, c1, { stagger: 0.15 }); A(s, 2, c2, { stagger: 0.15 }); A(s, 3, ['Chance line', 'Chance label']); A(s, 4, c3, { stagger: 0.15 });

// ===== 20 KPI + snip: playing it safe =====
s = frame(20);
const p1 = kpi(s, { x: 0.6, y: 1.9, w: 5.9, h: 1.9, value: '7.2%', label: 'said yes when nothing was shown at all (Experiment 5)', vsize: 44, name: 'Tile 1' });
T(s, 'Shown nothing, asked anyway', { x: 0.6, y: 3.85, w: 5.9, h: 0.35, size: 12, italic: true, color: SLATE, name: 'Tile 1 note' });
const p2 = kpi(s, { x: 6.83, y: 1.9, w: 5.9, h: 1.9, value: 'Above chance', label: 'even people highly confident they saw nothing (N = 204)', color: TEAL, vsize: 36, name: 'Tile 2' });
sp = snipPanel(s, 'nartker', { y: 4.35, cite: sdo(20).snippet.attribution, w: 10.6 });
A(s, 1, p1); A(s, 2, 'Tile 1 note'); A(s, 3, p2); A(s, 4, sp.base, { stagger: 0.05 }); A(s, 5, sp.hl, { effect: 'wipe-from-left' });

// ===== 21 Does / doesn't =====
s = frame(21, 'CORP_MEDIA');
VID(s, 's21_glass', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Magnifier video' });
mediaHead(s, 21);
T(s, 'WHAT IT SHOWS', { x: 0.6, y: 1.95, w: 5.9, h: 0.45, size: 14, bold: true, color: LIGHT, name: 'Hdr shows' });
T(s, "WHAT IT DOESN'T SHOW", { x: 6.83, y: 1.95, w: 5.9, h: 0.45, size: 14, bold: true, color: LIGHT_RULE, name: 'Hdr not' });
L(s, 0.6, 2.42, 5.9, 0, { color: LIGHT, width: 1.5, name: 'Rule shows' }); L(s, 6.83, 2.42, 5.9, 0, { color: LIGHT_RULE, width: 1.5, name: 'Rule not' });
const it21 = (x, y, mark, mc, t, nm) => { T(s, mark, { x, y, w: 0.5, h: 1.0, size: 22, bold: true, color: mc, valign: 'top', name: nm + ' mark' }); T(s, t, { x: x + 0.55, y, w: 5.3, h: 1.2, size: 18, color: WHITE, valign: 'top', name: nm }); return [nm + ' mark', nm]; };
const sh1 = it21(0.6, 2.65, '✓', LIGHT, 'As a group, people pick up location, colour and shape of things they deny seeing', 'Shows 1');
const sh2 = it21(0.6, 4.0, '✓', LIGHT, "The yes/no question undercounts what people perceive", 'Shows 2');
const nt1 = it21(6.83, 2.65, '–', LIGHT_RULE, 'That every individual saw it: the results are group-level', 'Not 1');
const nt2 = it21(6.83, 4.0, '–', LIGHT_RULE, 'That missing things is a myth: with a moving object on screen for 5 seconds, 57.3% still said they noticed nothing', 'Not 2');
A(s, 1, ['Hdr shows', 'Rule shows', ...sh1]); A(s, 2, sh2); A(s, 3, ['Hdr not', 'Rule not', ...nt1]); A(s, 4, nt2);

// ===== 22 Comparison table =====
s = frame(22);
const cx22 = [0.6, 3.6, 8.4], cw22 = [2.9, 4.7, 4.33];
['Study', 'Finding', 'What it adds'].forEach((h, i) => T(s, h, { x: cx22[i] + 0.1, y: 1.9, w: cw22[i] - 0.2, h: 0.4, size: 14, bold: true, color: SLATE, name: `Hdr ${i + 1}` }));
L(s, 0.6, 2.32, 12.13, 0, { color: NAVY, width: 1.5, name: 'Hdr rule' });
const rows22 = [['Radiologists (2013)', '20 of 24 missed a gorilla; many looked right at it', "Expertise doesn't protect you"],
  ['Staged fight (2011)', '35% noticed at night, 56% by day; 42% under heavy load', 'It happens outside the lab, and load matters'],
  ['Individual differences (2015)', 'Brainpower barely predicts noticing', "It's the situation, not the person"],
  ['Johns Hopkins (2025)', 'Non-noticers located the object 63.6% of the time', "We see more than we're willing to report"]];
rows22.forEach((r, i) => {
  const y = 2.4 + i * 0.95, nm = `Row ${i + 1}`;
  R(s, { x: 0.6, y, w: 12.13, h: 0.88, fill: i % 2 === 0 ? GREY : undefined, name: nm + ' band' });
  r.forEach((t, j) => T(s, t, { x: cx22[j] + 0.1, y, w: cw22[j] - 0.2, h: 0.88, size: j === 0 ? 17 : 15, bold: j === 0, color: (i === 3 && j === 0) ? TEAL : NAVY, name: `${nm} c${j + 1}` }));
});
R(s, { x: 0.6, y: 2.4 + 3 * 0.95, w: 12.13, h: 0.88, line: TEAL, lw: 2, name: 'Row 4 hl' });
const r22 = i => [`Row ${i} band`, `Row ${i} c1`, `Row ${i} c2`, `Row ${i} c3`];
A(s, 1, r22(1)); A(s, 2, r22(2)); A(s, 3, r22(3)); A(s, 4, [...r22(4), 'Row 4 hl']);

// ===== 23 Scenario: what helps =====
s = frame(23, 'CORP_MEDIA');
VID(s, 's23_park', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Park video' });
mediaHead(s, 23);
const sc23 = [['Lighten the load', "Runners who didn't count noticed the fight 72% of the time, vs 42% with separate counts (Chabris et al.)"],
  ['Expect the unexpected', 'The radiology study’s authors think their experts would have done much better if told to look for it (Drew et al.)'],
  ['Doubt “I would have noticed”', 'Most people overestimate what they notice (Simons, Noba)']];
sc23.forEach(([a, b], i) => {
  const y = 1.95 + i * 1.2, nm = `Row ${i + 1}`;
  T(s, a, { x: 0.6, y, w: 3.2, h: 1.0, size: 16, bold: true, color: WHITE, fill: i === 0 ? TEAL : MID, align: 'center', name: nm + ' if' });
  L(s, 3.85, y + 0.5, 0.45, 0, { color: LIGHT, width: 2, arrow: true, name: nm + ' arrow' });
  T(s, b, { x: 4.4, y, w: 8.33, h: 1.0, size: 16, fill: GREY, margin: 6, name: nm + ' then' });
});
T(s, "The expectation effect is the authors' presumption, not tested in their study.", { x: 0.6, y: 5.7, w: 12.13, h: 0.42, size: 12, color: LIGHT_RULE, name: 'Footnote' });
const r23 = i => [`Row ${i} if`, `Row ${i} arrow`, `Row ${i} then`];
A(s, 1, r23(1)); A(s, 2, r23(2)); A(s, 3, r23(3)); A(s, 4, 'Footnote');

// ===== 24 Key takeaways =====
s = frame(24, 'CORP_MEDIA');
VID(s, 's24_eye', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Eye video' });
mediaHead(s, 24);
R(s, { x: 0.6, y: 1.95, w: 4.6, h: 3.55, fill: NAVY, name: 'Answer panel' });
T(s, 'THE ANSWER', { x: 0.9, y: 2.1, w: 4.0, h: 0.35, size: 12, bold: true, color: RULE, name: 'Answer label' });
T(s, 'Why don’t we see what’s right in front of us? Attention filters it out, and we under-report the little that gets through.', { x: 0.9, y: 2.5, w: 4.0, h: 2.8, size: 19, color: WHITE, valign: 'top', name: 'Answer text' });
const tk24 = ['About half missed the gorilla', 'Experts aren’t immune', 'It’s the situation, not your IQ', 'We often see more than we say'];
const TK = tk24.map((t, i) => {
  const y = 1.95 + i * 0.9, nm = `Takeaway ${i + 1}`;
  T(s, String(i + 1), { x: 5.6, y: y + 0.1, w: 0.6, h: 0.6, size: 18, bold: true, color: WHITE, fill: TEAL, shape: pres.shapes.OVAL, align: 'center', name: nm + ' num' });
  T(s, t, { x: 6.4, y, w: 6.33, h: 0.8, size: 20, bold: true, color: WHITE, name: nm });
  return [nm + ' num', nm];
});
T(s, "You don't see with your eyes. You see with your attention.", { x: 0.6, y: 5.75, w: 12.13, h: 0.8, size: 26, bold: true, color: WHITE, fill: TEAL, align: 'center', name: 'Banner' });
A(s, 1, ['Answer panel', 'Answer label', 'Answer text']); A(s, 2, TK[0]); A(s, 3, TK[1]); A(s, 4, TK[2]); A(s, 5, TK[3]); A(s, 6, 'Banner');


