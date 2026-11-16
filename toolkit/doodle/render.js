const { chromium } = require('playwright'); const http = require('http'); const fs = require('fs'); const path = require('path'); const { spawn } = require('child_process');
const FPS = 30, DUR = +(process.argv[2] || 16), OUT = process.argv[3] || 'societies_card.mp4', QS = process.argv[4] || '';
const srv = http.createServer((q, r) => { const f = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); const ext = path.extname(f);
  r.setHeader('Content-Type', {'.html':'text/html','.js':'text/javascript','.woff2':'font/woff2'}[ext] || 'application/octet-stream'); fs.createReadStream(f).on('error', () => { r.statusCode = 404; r.end(); }).pipe(r); }).listen(8765);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  await p.goto('http://localhost:8765/' + (process.argv[5] || 'card.html') + (QS ? '?' + QS : '')); await p.waitForFunction('window.ready === true');
  const ff = spawn('ffmpeg', ['-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p', OUT]);
  for (let i = 0; i < FPS * DUR; i++) { await p.evaluate(t => render(t), i / FPS); ff.stdin.write(await p.locator('#c').screenshot({type: 'jpeg', quality: 92})); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); srv.close(); console.log('done', OUT);
})();
