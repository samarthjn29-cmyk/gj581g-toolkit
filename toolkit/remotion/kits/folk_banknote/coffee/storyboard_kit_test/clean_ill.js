// strip the square background and the footer credit line from Illlustrations SVGs (1000x1000 canvas)
const {chromium} = require(process.argv[2] + '/playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  for (const [src, out] of JSON.parse(process.argv[3])) {
    await p.setContent(`<html><body>${fs.readFileSync(src, 'utf8').replace(/<\?xml[^>]*>/, '')}</body></html>`);
    const res = await p.evaluate(() => { const svg = document.querySelector('svg'); let n = 0;
      for (const el of [...svg.querySelectorAll('rect,path,polygon,circle,ellipse,line,polyline,text')]) {
        let bb; try { bb = el.getBBox(); } catch (e) { continue; }
        if ((bb.width > 900 && bb.height > 900) || bb.y > 905) { el.remove(); n++; } }
      return [n, svg.outerHTML]; });
    fs.writeFileSync(out, res[1]); console.log(out, 'removed', res[0]); }
  await b.close(); })();
