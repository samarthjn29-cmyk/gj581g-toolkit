// Render one doodle card to mp4.
// node render.js <page.html> "<query>" <start_s> <end_s> <out.mp4> [stillAt_s]
//   start/end are the card's times in the chapter or full video (render(t) gets those absolute times).
//   With stillAt_s it writes one PNG at that time instead of a video (for checks).
const { chromium } = require('playwright'); const http = require('http'); const fs = require('fs'); const path = require('path'); const { spawn } = require('child_process');
const [page, query, start, end, out, stillAt] = process.argv.slice(2); const FPS = 30;
const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webm': 'video/webm', '.mp4': 'video/mp4'};
const srv = http.createServer((q, r) => { const f = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); const ext = path.extname(f);
  r.setHeader('Content-Type', MIME[ext] || 'application/octet-stream'); r.setHeader('Accept-Ranges', 'bytes');
  let st; try { st = fs.statSync(f); } catch (e) { r.statusCode = 404; return r.end(); }
  const m = /bytes=(\d*)-(\d*)/.exec(q.headers.range || '');   // range requests, so <video> can seek (footage in the canvas pages)
  if (m) { const a = m[1] ? +m[1] : 0, b = m[2] ? +m[2] : st.size - 1; r.statusCode = 206; r.setHeader('Content-Range', `bytes ${a}-${b}/${st.size}`); r.setHeader('Content-Length', b - a + 1); return fs.createReadStream(f, {start: a, end: b}).pipe(r); }
  r.setHeader('Content-Length', st.size); fs.createReadStream(f).pipe(r); }).listen(0);
(async () => {
  const port = srv.address().port; const gpu = process.env.GPU === '1';   // GPU=1 on a laptop with a graphics card: real hardware WebGL instead of the software renderer
  const b = await chromium.launch(gpu ? {args: ['--enable-gpu', '--ignore-gpu-blocklist', ...(process.platform === 'win32' ? ['--use-angle=d3d11'] : process.platform === 'darwin' ? ['--use-angle=metal'] : [])]} : {});
  const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  console.log('WebGL:', await p.evaluate(() => { const c = document.createElement('canvas').getContext('webgl2'); if (!c) return 'none'; const e = c.getExtension('WEBGL_debug_renderer_info'); return e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : c.getParameter(c.RENDERER); }));
  p.on('pageerror', e => console.error('PAGE', e.message));
  await p.goto(`http://localhost:${port}/${page}?${query || ''}`); await p.waitForFunction('window.ready === true', null, {timeout: 20000});
  if (stillAt) { await p.evaluate(t => render(t), +stillAt); await p.locator('#c').screenshot({path: out, omitBackground: true}); }
  else {
    const webm = out.endsWith('.webm'), alpha = out.endsWith('.mov') || webm;   // .webm = the same transparent layer as VP9 with alpha, a fraction of the size (Stanford, 16 Nov 2026)   // .mov = transparent ink layer (qtrle with alpha) for drawing on a painted still
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', ...(webm ? ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-deadline', 'good', '-cpu-used', '5', '-row-mt', '1'] : alpha ? ['-c:v', 'qtrle', '-pix_fmt', 'argb'] : ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p']), out]);
    const n = Math.round((+end - +start) * FPS);
    const t0 = Date.now(); for (let i = 0; i < n; i++) { if (i && i % 30 === 0) console.log(`frame ${i}/${n}, ${((Date.now() - t0) / 1000 / i).toFixed(1)} s a frame`); await p.evaluate(t => render(t), +start + i / FPS); ff.stdin.write(await p.locator('#c').screenshot(alpha ? {type: 'png', omitBackground: true} : {type: 'jpeg', quality: 93})); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close(); srv.close(); console.log('done', out);
})();
