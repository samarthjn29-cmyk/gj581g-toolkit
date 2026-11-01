"""Clean world (or regional) choropleth maps in the project's palette, from Natural Earth (public domain; fetched once from GitHub).

  mapmaker.py data.csv out.png --palette <deck_config.json> [--bins 0,20,40,60,80,100] [--labels "0-20%,20-40%,..."]
              [--region world|europe|asia|africa|americas|<minlon,minlat,maxlon,maxlat>] [--highlight IND,USA] [--title "..."]
  data.csv: iso3,value  (ISO 3166-1 alpha-3 codes, e.g. IND, USA, GBR; numbers exactly as in the source map)
Writes a transparent 1920x1080 PNG (map plus legend; put the action title, source line and caveats on the slide itself) and
out.json with the legend bins. Countries without data are near-white with a light hatch and named 'No data' in the legend.
Colours: a sequential ramp from Panel to Primary (or Accent with --ramp accent); --highlight outlines countries in Callout.
Clean-facts rules: bins are stated exactly, the ramp is ordered, missing data is never coloured as a value, Equal Earth
projection (areas are true to size), no 3D or shading. Natural Earth: public domain, credit appreciated ("Made with Natural Earth")."""
import sys, os, json, csv, math, urllib.request
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Patch
NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ne_110m_countries.geojson')
REG = {'world': (-180, -58, 180, 84), 'europe': (-25, 34, 45, 72), 'asia': (25, -12, 150, 56), 'africa': (-20, -36, 55, 38), 'americas': (-170, -57, -30, 75)}

def equal_earth(lon, lat):
    A1, A2, A3, A4 = 1.340264, -0.081106, 0.000893, 0.003796; M = math.sqrt(3) / 2
    l, p = math.radians(lon), math.asin(M * math.sin(math.radians(lat))); p2 = p * p; p6 = p2 * p2 * p2
    x = l * math.cos(p) / (M * (A1 + 3 * A2 * p2 + p6 * (7 * A3 + 9 * A4 * p2)))
    y = p * (A1 + A2 * p2 + p6 * (A3 + A4 * p2)); return x, y

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
def mix(a, b, t): return tuple(a[i] * (1 - t) + b[i] * t for i in range(3))

a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__)
opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
data = {r['iso3'].strip().upper(): float(r['value']) for r in csv.DictReader(open(a[0]))}
pal = json.load(open(opt('--palette')))['palette']
if not os.path.exists(CACHE): open(CACHE, 'wb').write(urllib.request.urlopen(NE, timeout=120).read())
geo = json.load(open(CACHE))
vals = sorted(data.values())
bins = [float(x) for x in opt('--bins').split(',')] if opt('--bins') else [vals[0] + (vals[-1] - vals[0]) * i / 5 for i in range(6)]
labels = opt('--labels').split(',') if opt('--labels') else [f'{bins[i]:g} to {bins[i + 1]:g}' for i in range(len(bins) - 1)]
lo, hi = hexrgb(pal['panel']), hexrgb(pal['accent'] if opt('--ramp') == 'accent' else pal['primary'])
ramp = [mix(mix(lo, hi, 0.15), hi, i / max(1, len(bins) - 2)) for i in range(len(bins) - 1)]
cls = lambda v: next((i for i in range(len(bins) - 1) if v <= bins[i + 1]), len(bins) - 2)
reg = opt('--region', 'world'); box = REG.get(reg) or tuple(float(x) for x in reg.split(','))
hl = set((opt('--highlight') or '').upper().split(',')) - {''}
fig = plt.figure(figsize=(19.2, 10.8), dpi=100); ax = fig.add_axes([0.02, 0.12, 0.96, 0.86]); ax.set_axis_off()
for f in geo['features']:
    pr = f['properties']; iso = pr.get('ISO_A3') if pr.get('ISO_A3') not in (None, '-99') else pr.get('ADM0_A3')
    v = data.get(iso); fc = ramp[cls(v)] if v is not None else (0.97, 0.97, 0.97)
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    for poly in polys:
        pts = [equal_earth(x, y) for x, y in poly[0]]
        ax.add_patch(Polygon(pts, closed=True, facecolor=fc, edgecolor='#FFFFFF' if v is not None else '#' + pal['rule'], linewidth=0.6, hatch=None if v is not None else '////', zorder=1))
        if iso in hl: ax.add_patch(Polygon(pts, closed=True, fill=False, edgecolor='#' + pal['callout'], linewidth=2.5, zorder=3))
x0, y0 = equal_earth(box[0], box[1]); x1, y1 = equal_earth(box[2], box[3])
xm0, _ = equal_earth(box[0], 0); xm1, _ = equal_earth(box[2], 0)
ax.set_xlim(min(x0, xm0), max(x1, xm1)); ax.set_ylim(y0, y1); ax.set_aspect('equal')
handles = [Patch(facecolor=c, edgecolor='none', label=l) for c, l in zip(ramp, labels)] + [Patch(facecolor=(0.97, 0.97, 0.97), edgecolor='#' + pal['rule'], hatch='////', label='No data')]
fig.legend(handles=handles, loc='lower center', ncol=len(handles), frameon=False, fontsize=20, labelcolor='#' + pal['secondary'], handlelength=1.6, handleheight=1.0,
           title=opt('--title'), title_fontsize=20)
fig.savefig(a[1], transparent=True); json.dump({'bins': bins, 'labels': labels, 'region': reg}, open(os.path.splitext(a[1])[0] + '.json', 'w'))
print(a[1], f'{len(data)} countries with data; bins {bins}')
