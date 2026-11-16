// Render one doodle card to mp4.
// node render.js <page.html> "<query>" <start_s> <end_s> <out.mp4> [stillAt_s]
//   start/end are the card's times in the chapter or full video (render(t) gets those absolute times).
//   With stillAt_s it writes one PNG at that time instead of a video (for checks).
const { chromium } = require('playwright'); const http = require('http'); const fs = require('fs'); const path = require('path'); const { spawn } = require('child_process');
const [page, query, start, end, out, stillAt] = process.argv.slice(2); const FPS = 30;
const srv = http.createServer((q, r) => { const f = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); const ext = path.extname(f);
  r.setHeader('Content-Type', {'.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2'}[ext] || 'application/octet-stream');
  fs.createReadStream(f).on('error', () => { r.statusCode = 404; r.end(); }).pipe(r); }).listen(0);
(async () => {
  const port = srv.address().port; const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  p.on('pageerror', e => console.error('PAGE', e.message));
  await p.goto(`http://localhost:${port}/${page}?${query || ''}`); await p.waitForFunction('window.ready === true', null, {timeout: 20000});
  if (stillAt) { await p.evaluate(t => render(t), +stillAt); await p.locator('#c').screenshot({path: out, omitBackground: true}); }
  else {
    const webm = out.endsWith('.webm'), alpha = out.endsWith('.mov') || webm;   // .webm = the same transparent layer as VP9 with alpha, a fraction of the size (Stanford, 16 Nov 2026)   // .mov = transparent ink layer (qtrle with alpha) for drawing on a painted still
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', ...(webm ? ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-deadline', 'good', '-cpu-used', '5', '-row-mt', '1'] : alpha ? ['-c:v', 'qtrle', '-pix_fmt', 'argb'] : ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p']), out]);
    const n = Math.round((+end - +start) * FPS);
    for (let i = 0; i < n; i++) { await p.evaluate(t => render(t), +start + i / FPS); ff.stdin.write(await p.locator('#c').screenshot(alpha ? {type: 'png', omitBackground: true} : {type: 'jpeg', quality: 93})); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close(); srv.close(); console.log('done', out);
})();
