# Cut a Recraft vector character into puppet parts for fluid animation in Remotion.
# Each colour fill path becomes a part mask; the single black outline path is shared out to the nearest part;
# limbs are split at joints by half-planes; hidden parts of far limbs are filled with their convex hull.
# usage: python3 build_rig.py <rig.json spec> <out_dir>
import re, json, sys, os, subprocess, numpy as np, cv2

spec = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
svg = open(spec['svg']).read()
vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
H = spec.get('height_px', 1600); S = H / vb[3]; W = int(round(vb[2] * S))
paths = re.findall(r'(<path[^>]*/>)', svg)
head = svg[:svg.index('<path')].split('<metadata')[0]
head = re.sub(r'width="[^"]*" height="[^"]*"', f'width="{W}" height="{H}"', head, count=1)
tmp = '/tmp/rigsvg'; os.makedirs(tmp, exist_ok=True)

def render(idx_list, recolor=None):
    body = []
    for i in idx_list:
        p = paths[i]
        if recolor: p = re.sub(r'fill="[^"]*"', f'fill="{recolor}"', p)
        body.append(p)
    open(f'{tmp}/x.svg', 'w').write(head + ''.join(body) + '</svg>')
    subprocess.run(['rsvg-convert', f'{tmp}/x.svg', '-o', f'{tmp}/x.png'], check=True)
    return cv2.imread(f'{tmp}/x.png', cv2.IMREAD_UNCHANGED)

bg = [i for i, p in enumerate(paths) if re.search(r'fill="rgb\((\d+),(\d+),(\d+)\)"', p) and (lambda r, g, b: g > 150 and r < 90 and b < 130)(*map(int, re.search(r'fill="rgb\((\d+),(\d+),(\d+)\)"', p).groups()))]
full = render([i for i in range(len(paths)) if i not in bg])
full_a = full[..., 3]
outline = render([spec['outline']], recolor='#ffffff')[..., 3] > 128

def halfplane(mask, clip):
    if not clip: return mask
    Y, X = np.mgrid[0:mask.shape[0], 0:mask.shape[1]]
    for (ax, ay, bx, by, keep) in clip:  # keep the side of line a->b where the cross product has sign keep
        ax, ay, bx, by = ax * S, ay * S, bx * S, by * S
        cr = (bx - ax) * (Y - ay) - (by - ay) * (X - ax)
        mask = mask & ((cr > 0) if keep > 0 else (cr <= 0))
    return mask

parts = spec['parts']; masks = {}
for p in parts:
    m = np.zeros(full_a.shape, bool); first = None
    for entry in p['paths']:
        i, clip = (entry, None) if isinstance(entry, int) else (entry[0], [entry[1:]])
        pm = render([i], recolor='#ffffff')[..., 3] > 128
        pm = halfplane(pm, clip); m |= pm
        if first is None: first = pm
    if p.get('hull'):  # fill the hidden part of the limb itself (first path only), not its foot
        ys, xs = np.where(first)
        if len(xs):
            hull = cv2.convexHull(np.stack([xs, ys], 1).astype(np.int32)); hm = np.zeros(m.shape, np.uint8); cv2.fillPoly(hm, [hull], 1); m = m | (hm > 0)
    masks[p['name']] = m
# share the outline (and any leftover pixels) out to the nearest part
names = [p['name'] for p in parts]
dist = np.stack([cv2.distanceTransform((~masks[n]).astype(np.uint8), cv2.DIST_L2, 3) for n in names], 0)
owner = np.argmin(dist, 0)
alpha_any = full_a > 0
meta = {'scale': S, 'width': W, 'height': H, 'parts': []}
for k, p in enumerate(parts):
    n = p['name']
    m = masks[n] | (alpha_any & (owner == k) & (dist[k] < spec.get('outline_reach', 14)))
    rgba = full.copy(); rgba[..., 3] = np.where(m, full_a, 0)
    if p.get('hull'):  # paint hidden hull area with the part's fill colour and outline its edge
        fillc = np.array(p['hull_fill'][::-1] + [255], np.uint8)
        hole = masks[n] & (full_a == 0) | (masks[n] & ~np.isin(np.arange(1), [1])[0])
        hidden = masks[n] & (rgba[..., 3] < 10)
        rgba[hidden] = fillc
        edge = cv2.morphologyEx(masks[n].astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((5, 5), np.uint8)) > 0
        rgba[edge & hidden] = (0, 0, 0, 255)
    if p.get('fill'):  # paint the area another part covered (e.g. the torso under the arm) in this part's colour
        under = np.zeros(full_a.shape, bool)
        for i in p['fill']['paths']: under |= render([i], recolor='#ffffff')[..., 3] > 128
        under0 = under.copy()
        ys0, xs0 = np.where(masks[n]); hull = cv2.convexHull(np.stack([xs0, ys0], 1).astype(np.int32))
        hm = np.zeros(full_a.shape, np.uint8); cv2.fillPoly(hm, [hull], 1)
        under = cv2.dilate(under.astype(np.uint8), np.ones((17, 17), np.uint8)).astype(bool) & (hm > 0) & ~masks[n]
        fc = np.array(p['fill']['color'][::-1] + [255], np.uint8); rgba[under] = fc
        zone = cv2.dilate(under0.astype(np.uint8), np.ones((17, 17), np.uint8)).astype(bool) & (hm > 0)
        px = full[..., :3].astype(int); belt = (np.abs(px - np.array([59, 93, 139])).max(-1) < 30)
        darkpx = (np.abs(px - np.array(p['fill']['color'][::-1])).max(-1) > 10) & ~belt
        keep_edge = cv2.erode(hm, np.ones((25, 25), np.uint8)) > 0   # keep the torso's own outer outline
        rgba[zone & darkpx & keep_edge & (rgba[..., 3] > 0)] = fc
    ys, xs = np.where(rgba[..., 3] > 0)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    cv2.imwrite(f'{OUT}/{n}.png', rgba[y0:y1, x0:x1])
    meta['parts'].append({'name': n, 'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0), 'parent': p.get('parent'),
                          'pivot': [p['pivot'][0] * S, p['pivot'][1] * S] if p.get('pivot') else None, 'z': p['z'],
                          'cap': p.get('cap')})
json.dump(meta, open(f'{OUT}/rig.json', 'w'), indent=1)
# debug: parts tinted
dbg = np.zeros((H, W, 3), np.uint8) + 40
rng = np.random.default_rng(3)
for k, n in enumerate(names):
    c = rng.integers(60, 255, 3); dbg[masks[n]] = c
cv2.imwrite(f'{OUT}/_parts.png', dbg)
print('ok', W, H, names)
