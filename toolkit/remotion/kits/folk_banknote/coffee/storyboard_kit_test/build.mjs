import * as esbuild from 'esbuild';
import {createRequire} from 'module'; const {chromium} = createRequire('/home/claude/.npm-global/lib/node_modules/')('playwright');
import fs from 'fs';
await esbuild.build({entryPoints: ['storyboard.jsx'], bundle: true, platform: 'node', format: 'cjs', outfile: 'out/sb.cjs',
  jsx: 'transform', loader: {'.jsx': 'jsx'}, nodePaths: [process.cwd() + '/node_modules'], logLevel: 'warning'});
const {render, frames} = createRequire(import.meta.url)('./out/sb.cjs');
const font = `@font-face{font-family:Fraunces;font-weight:400;src:url(fraunces-latin-400-normal.woff2)}@font-face{font-family:Fraunces;font-weight:700;src:url(fraunces-latin-700-normal.woff2)}
@font-face{font-family:Fraunces;font-weight:700;font-style:italic;src:url(fraunces-latin-700-italic.woff2)}@font-face{font-family:Oswald;font-weight:700;src:url(oswald-latin-700-normal.woff2)}`;
const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1920, height: 1080}});
for (const k of Object.keys(frames).filter(k => !process.env.ONLY || process.env.ONLY.includes(k))) {
  fs.writeFileSync(`${k}.html`, `<html><head><style>${font} body{margin:0}</style></head><body>${render(k)}</body></html>`);
  await p.goto(`file://${process.cwd()}/${k}.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({path: `out/${k}.png`});
}
await b.close(); console.log('ok');
