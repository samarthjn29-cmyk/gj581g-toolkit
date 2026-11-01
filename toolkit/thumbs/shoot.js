// Screenshot every <name>.html in a folder at exactly 1280x720 -> <name>.png (YouTube thumbnail size).
// Usage: node thumbs/shoot.js <folder>      then: python3 thumbs/sheets.py <Prefix> <folder>/<Prefix>_thumb_*.png
// Write each design as a self-contained HTML page (inline CSS/SVG, palette hex values, heavy sans-serif such as
// 'Inter Display' 900 or Arial Black, background images as data: URIs or files next to the HTML).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.resolve(process.argv[2] || '.');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort()) {
    await page.goto('file://' + path.join(dir, f));
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(dir, f.replace(/\.html$/, '.png'));
    await page.screenshot({ path: out, type: 'png' });
    console.log('rendered', out);
  }
  await browser.close();
})();
