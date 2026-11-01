"""Open-source icons in the project's palette, as transparent PNGs for the deck (no API key; fetched from GitHub).

  icons.py <set> <hex color> <out_dir> name [name ...] [--size 512] [--stroke 1.75]
    set: lucide (ISC licence)  | tabler (MIT; outline icons) | phosphor (MIT; regular weight; use --weight bold|fill|light)
    e.g. icons.py lucide 7A4FB5 media/icons eye scan-eye users brain search
  Browse names: lucide.dev/icons, tabler.io/icons, phosphoricons.com (names are the file names on those sites).
Writes <out_dir>/<set>_<name>.png (512 px, transparent) and .svg, and one licence-log row per icon set used.
Rendered with the pre-installed Playwright Chromium (no extra installs). Icons are line drawings: use them for thought
experiments, process steps, pills and section markers; one style (one set, one stroke width) per deck."""
import sys, os, json, subprocess, datetime, urllib.request, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'media'))
from openvideo import log_row
SETS = {'lucide': ('https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/{n}.svg', 'ISC (Lucide)', 'https://lucide.dev/license'),
        'tabler': ('https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/{n}.svg', 'MIT (Tabler Icons)', 'https://github.com/tabler/tabler-icons/blob/main/LICENSE'),
        'phosphor': ('https://raw.githubusercontent.com/phosphor-icons/core/main/assets/{w}/{n}{s}.svg', 'MIT (Phosphor Icons)', 'https://github.com/phosphor-icons/core/blob/main/LICENSE')}
a = sys.argv[1:]
if len(a) < 4: sys.exit(__doc__)
opt = lambda k, d: a[a.index(k) + 1] if k in a else d
st, color, out = a[0], '#' + a[1].lstrip('#'), a[2]
names = [x for i, x in enumerate(a[3:], 3) if not x.startswith('--') and a[i - 1] not in ('--size', '--stroke', '--weight')]
size, stroke, weight = int(opt('--size', 512)), opt('--stroke', None), opt('--weight', 'regular')
os.makedirs(out, exist_ok=True); jobs = []
for n in names:
    url = SETS[st][0].format(n=n, w=weight, s='' if weight == 'regular' else '-' + weight)
    try: svg = urllib.request.urlopen(url, timeout=30).read().decode()
    except Exception as e: print(f'{n}: not found in {st} ({e})'); continue
    svg = svg.replace('currentColor', color)
    if st == 'phosphor': svg = svg.replace('<svg ', f'<svg fill="{color}" ', 1)
    if stroke: svg = svg.replace('stroke-width="2"', f'stroke-width="{stroke}"')
    p = os.path.join(out, f'{st}_{n}'); open(p + '.svg', 'w').write(svg); jobs.append((os.path.abspath(p + '.svg'), os.path.abspath(p + '.png')))
js = """const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: %d, height: %d } });
for (const [s, o] of %s) { const svg = fs.readFileSync(s, 'utf8').replace(/width="[^"]*"/, 'width="100%%"').replace(/height="[^"]*"/, 'height="100%%"');
  await pg.setContent(`<html><body style="margin:0;background:transparent"><div style="width:%dpx;height:%dpx">${svg}</div></body></html>`);
  await pg.screenshot({ path: o, omitBackground: true }); }
await b.close(); })();""" % (size, size, json.dumps(jobs), size, size)
f = tempfile.NamedTemporaryFile('w', suffix='.js', delete=False); f.write(js); f.close()
env = dict(os.environ, NODE_PATH=subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip() + ':/opt/npm-tools/node_modules')
subprocess.run(['node', f.name], check=True, env=env); os.unlink(f.name)
if jobs:
    log_row(dict(date=datetime.date.today().isoformat(), file=out + f'/{st}_*.png', source=st + ' icons', title=', '.join(names), licence=SETS[st][1], licence_url=SETS[st][2], proof='open-source licence; credit in deck notes'))
for _, o in jobs: print(o)
