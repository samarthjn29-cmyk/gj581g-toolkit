# Layout for version D: real cone centres + types from Fong et al. 2025 Fig. 1B(iv) (cones.json), gaps and surround Poisson-filled (illustrative).
import json, random, math
rnd = random.Random(581); U = 0.1
real = json.load(open('cones.json'))
cells = [dict(x=round((c['x'] - 34) * U, 3), y=round((34 - c['y']) * U, 3), t=c['t'], real=1) for c in real]
grid = {}
def cell_key(x, y): return (int(math.floor(x / 0.5)), int(math.floor(y / 0.5)))
for c in cells: grid.setdefault(cell_key(c['x'], c['y']), []).append(c)
def far(x, y, d):
    kx, ky = cell_key(x, y)
    for i in range(kx - 2, kx + 3):
        for j in range(ky - 2, ky + 3):
            for c in grid.get((i, j), []):
                if (c['x'] - x) ** 2 + (c['y'] - y) ** 2 < d * d: return False
    return True
def pick():
    q = rnd.random(); return 'L' if q < .64 else 'M' if q < .94 else 'S'
for _ in range(120000):
    x, y = rnd.uniform(-11, 11), rnd.uniform(-7.5, 7.5)
    inside = abs(x) < 3.45 and abs(y) < 3.45
    if far(x, y, 0.47 if inside else 0.44):
        c = dict(x=round(x, 3), y=round(y, 3), t=pick(), real=0); cells.append(c); grid.setdefault(cell_key(x, y), []).append(c)
for c in cells: c['r'] = round(0.205 * (1 + rnd.uniform(-0.07, 0.09)), 3); c['h'] = round(rnd.uniform(0.85, 1.15), 3); c['o'] = round(rnd.random(), 3)
json.dump(cells, open('/home/claude/toolkit/toolkit/doodle/cards/colour_d_layout.json', 'w'))
from collections import Counter
print(len(cells), Counter(c['t'] for c in cells if c['real']), Counter(c['t'] for c in cells))
