// Download a PDF that sits behind a browser check (e.g. PubMed Central): opens the URL in Playwright Chromium and saves the download.
// Usage: node fetch/fetch_pdf.js <url> <out.pdf>
const { chromium } = require('playwright');
(async () => {
  const [,, url, out] = process.argv;
  const b = await chromium.launch(); const ctx = await b.newContext({ acceptDownloads: true });
  const p = await ctx.newPage();
  const dl = p.waitForEvent('download', { timeout: 60000 }).catch(() => null);
  await p.goto(url).catch(() => {});
  const d = await dl;
  if (d) { await d.saveAs(out); console.log('download', out); }
  else { // maybe rendered inline: refetch with cookies
    const r = await ctx.request.get(url); require('fs').writeFileSync(out, await r.body()); console.log('request', out, r.headers()['content-type']); }
  await b.close();
})();
