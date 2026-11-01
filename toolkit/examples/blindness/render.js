// Example: the four Blindness thumbnails (Oct 2026). Needs bg_crowd.jpg next to it, a tinted, blurred frame of Mixkit #4401:
//   ffmpeg -ss 8 -i 4401.mp4 -frames:v 1 -vf "crop=iw:ih*0.62:0:ih*0.38,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,gblur=sigma=2.2,drawbox=x=0:y=0:w=iw:h=ih:color=0x2B1B3F@0.72:t=fill" bg_crowd.jpg
// Contains a reusable flat gorilla silhouette (SVG). For new projects, one HTML file per design + thumbs/shoot.js is simpler.
// Render the four Blindness thumbnails (1280x720) from HTML with Playwright.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const D = __dirname;
const P = { plum: '#2B1B3F', sec: '#6E6680', panel: '#F4F1F8', rule: '#DCD6E5', accent: '#7A4FB5', light: '#C9B6EE', coral: '#E07A5F' };
const bg = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(D, 'bg_crowd.jpg')).toString('base64');

// Flat gorilla silhouette, same construction as the video's original animation (origin at the torso centre).
// Flat gorilla silhouette: broad shoulders, small low head with crest, long arms down to the knuckles, short legs.
const gorilla = (fill) => `
  <path d="M-48,60 L-56,150 M48,60 L56,150" stroke="${fill}" stroke-width="48" stroke-linecap="round"/>
  <ellipse cx="0" cy="10" rx="92" ry="78" fill="${fill}"/>
  <ellipse cx="0" cy="-48" rx="118" ry="50" fill="${fill}"/>
  <circle cx="0" cy="-92" r="38" fill="${fill}"/>
  <ellipse cx="0" cy="-122" rx="22" ry="18" fill="${fill}"/>
  <path d="M-100,-40 L-128,140 M100,-40 L128,140" stroke="${fill}" stroke-width="48" stroke-linecap="round"/>
  <ellipse cx="-132" cy="156" rx="30" ry="18" fill="${fill}"/><ellipse cx="132" cy="156" rx="30" ry="18" fill="${fill}"/>`;

const base = `*{margin:0;padding:0;box-sizing:border-box} body{width:1280px;height:720px;overflow:hidden;font-family:'Inter Display','Inter',Arial,sans-serif;position:relative}
.t{position:absolute;font-weight:900;letter-spacing:-0.02em;line-height:0.95}`;

const pages = {
  A: `<style>${base} body{background:#fff}</style>
  <div class="t" style="left:60px;top:150px;font-size:196px;color:${P.accent};letter-spacing:-0.04em">20 of 24</div>
  <div class="t" style="left:66px;top:400px;font-size:82px;color:${P.plum}">EXPERTS<br>MISSED IT</div>
  <div style="position:absolute;left:66px;top:595px;width:150px;height:12px;background:${P.coral}"></div>
  <svg style="position:absolute;left:905px;top:60px" width="320" height="420" viewBox="0 0 320 420">
    <rect x="0" y="0" width="320" height="420" rx="28" fill="${P.plum}"/>
    <path d="M150,70 C80,60 40,140 40,240 C40,320 70,370 120,370 C145,370 150,340 150,300 Z" fill="${P.light}" opacity="0.9"/>
    <path d="M170,70 C240,60 280,140 280,240 C280,320 250,370 200,370 C175,370 170,340 170,300 Z" fill="${P.light}" opacity="0.9"/>
    <rect x="152" y="40" width="16" height="120" rx="8" fill="${P.light}" opacity="0.9"/>
    <g transform="translate(222,264) scale(0.17)">${gorilla(P.coral)}</g>
    <circle cx="222" cy="262" r="44" fill="none" stroke="${P.coral}" stroke-width="7"/>
  </svg>`,

  B: (() => {
    const base0 = 600, k = 4.6; // px per percentage point, exact scale
    const cols = [[71.4, P.plum, 150], [87.4, P.plum, 400], [63.6, P.accent, 650]];
    const bars = cols.map(([v, c, x]) => `<div style="position:absolute;left:${x}px;top:${base0 - v * k}px;width:190px;height:${v * k}px;background:${c}"></div>`).join('');
    return `<style>${base} body{background:${P.panel}}</style>
    <div class="t" style="left:60px;top:44px;font-size:100px;color:${P.plum}">THEY SAW MORE</div>
    ${bars}
    <div style="position:absolute;left:120px;top:${base0}px;width:780px;height:4px;background:${P.sec}"></div>
    <div style="position:absolute;left:600px;top:${base0 - 50 * k - 3}px;width:330px;height:0;border-top:7px dashed ${P.coral}"></div>
    <div class="t" style="left:944px;top:${base0 - 50 * k - 26}px;font-size:40px;color:${P.coral}">CHANCE</div>
    <div class="t" style="left:640px;top:${base0 - 63.6 * k - 74}px;width:210px;text-align:center;font-size:60px;color:${P.accent}">63.6%</div>`;
  })(),

  C: `<style>${base} body{background:${P.panel}}</style>
  <div style="position:absolute;left:640px;top:0;width:640px;height:720px;background:${P.plum}"></div>
  <div class="t" style="left:56px;top:70px;font-size:112px;color:${P.plum}">YOU'D<br>NOTICE</div>
  <div class="t" style="left:60px;top:330px;font-size:120px;color:${P.accent}">✓</div>
  <div class="t" style="left:872px;top:70px;font-size:112px;color:#fff;text-align:right;width:360px">HALF<br>DIDN'T</div>
  <div class="t" style="left:1110px;top:330px;font-size:120px;color:${P.coral}">✗</div>
  <svg style="position:absolute;left:0;top:0" width="1280" height="720">
    <defs><clipPath id="l"><rect x="0" y="0" width="640" height="720"/></clipPath><clipPath id="r"><rect x="640" y="0" width="640" height="720"/></clipPath></defs>
    <g clip-path="url(#l)"><g transform="translate(640,440) scale(1.45)">${gorilla(P.plum)}</g></g>
    <g clip-path="url(#r)"><g transform="translate(640,440) scale(1.45)">${gorilla(P.light)}</g></g>
  </svg>`,

  D: `<style>${base} body{background:url(${bg}) center/cover}</style>
  <div class="t" style="left:60px;top:56px;font-size:132px;color:#fff">DID YOU<br><span style="color:${P.light}">SEE</span> IT?</div>
  <svg style="position:absolute;left:690px;top:420px" width="84" height="84" viewBox="0 0 70 70">
    <path d="M24,0 H46 V24 H70 V46 H46 V70 H24 V46 H0 V24 H24 Z" fill="${P.coral}"/></svg>`,
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const [k, html] of Object.entries(pages)) {
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(D, `Blindness_thumb_${k}.png`), type: 'png' });
    console.log('rendered', k);
  }
  await browser.close();
})();
