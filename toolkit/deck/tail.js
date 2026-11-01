// audio on slide 1, off-canvas
if (AUDIO) {
  pres.slides[0].addMedia({ type: 'audio', path: AUDIO, x: 13.5, y: 0.5, w: 0.5, h: 0.5, objectName: 'Narration (set to Play in Background)' });
}
for (const k of Object.keys(timing.slides)) {
  const seen = new Set();
  timing.slides[k].animations = timing.slides[k].animations.filter(a => !seen.has(a.shape) && seen.add(a.shape)).sort((a, b) => a.start_s - b.start_s);
}
(async () => {
  const f = path.join(OUT, MATTE ? `matte_${MATTE}.pptx` : 'deck_raw.pptx');
  await pres.writeFile({ fileName: f });
  await applyTheme(f, THEME);
  if (!MATTE) fs.writeFileSync(path.join(OUT, 'timing.json'), JSON.stringify(timing, null, 1));   // matte builds never overwrite timing
  fs.writeFileSync(path.join(OUT, 'subs_build.json'), JSON.stringify(subs, null, 1));
  fs.writeFileSync(path.join(OUT, 'media_slots.json'), JSON.stringify(mediaSlots, null, 1));
  console.log('built', count, 'slides');
})().catch(e => { console.error(e); process.exit(1); });
