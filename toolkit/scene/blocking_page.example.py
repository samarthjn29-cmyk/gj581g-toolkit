# Gate 1 for scene 2: the blocking page. Positions in metres come from the pilot's scene spec (room.scene.json via core.mjs);
# depth (front-back) is schematic, because the 2D set only has lanes, not measured depth.
import json, math
spec = json.load(open('/home/claude/twice/remotion/src/scrolls/scene/room.scene.json'))
O = {o['id']: o for o in spec['objects']}
S, X0, Y0 = 150, 50, 40            # px per metre, origin
D = {'wall': 0.0, 'near': 1.15, 'mid': 1.85, 'front': 3.3}      # schematic depth of each lane (m from the back wall)
px = lambda x: X0 + x * S; py = lambda d: Y0 + d * S
W = 8.73
g = []
A = g.append
A(f'<rect x="{px(0)}" y="{py(-0.15)}" width="{W*S}" height="{0.15*S}" fill="#8a3a3a"/>')      # back wall
A(f'<text x="{px(W/2)}" y="{py(-0.15)-8}" class="lb" text-anchor="middle">BACK WALL · red panels, painted squares above the racks</text>')
for k in 'ABC':
    o = O['rack'+k]; x0 = o['x'] - o['w']/2
    A(f'<rect x="{px(x0)}" y="{py(0)}" width="{o["w"]*S}" height="{0.4*S}" fill="#5b3b24" stroke="#000" stroke-width="2"/>')
    A(f'<text x="{px(o["x"])}" y="{py(0.27)}" class="lw" text-anchor="middle">RACK {k}</text>')
# the taken cubby
A(f'<circle cx="{px(4.004)}" cy="{py(0.4)}" r="6" fill="#B8322B" stroke="#000" stroke-width="1.5"/><text x="{px(4.004)+10}" y="{py(0.52)}" class="sm">cubby 2,0 (empty after the pilot)</text>')
c = O['cabinet']; A(f'<rect x="{px(c["x"]-c["w"]/2)}" y="{py(D["mid"]-0.3)}" width="{c["w"]*S}" height="{0.6*S}" fill="#b07a4c" stroke="#000" stroke-width="2"/>')
A(f'<polygon points="{px(c["x"]-0.48)},{py(D["mid"]+0.18)} {px(c["x"]+0.48)},{py(D["mid"]+0.18)} {px(c["x"]+0.48)},{py(D["mid"]-0.2)} {px(c["x"]-0.48)},{py(D["mid"]-0.2)}" fill="#d49a66" stroke="#000" stroke-width="1.5" stroke-dasharray="5 3"/>')
A(f'<text x="{px(c["x"])}" y="{py(D["mid"]-0.36)}" class="lb" text-anchor="middle">CASE + SLANTED STAND (low edge to the front)</text>')
A(f'<rect x="{px(c["x"]-0.45)}" y="{py(D["mid"]+0.07)}" width="{0.9*S}" height="10" fill="#F1E2C4" stroke="#000" stroke-width="1.5"/>')
l = O['lamp']; A(f'<circle cx="{px(l["x"])}" cy="{py(D["mid"])}" r="13" fill="#F2B85A" stroke="#000" stroke-width="2"/><circle cx="{px(l["x"])}" cy="{py(D["mid"])}" r="70" fill="none" stroke="#F2B85A" stroke-width="2" stroke-dasharray="4 5"/><text x="{px(l["x"])+70}" y="{py(D["mid"])+32}" class="lb" text-anchor="start" dx="18">LAMP · the only light</text>')
# front wall with the arch the camera came through in the pilot
A(f'<rect x="{px(0)}" y="{py(D["front"])}" width="{(4.36-0.9)*S}" height="{0.15*S}" fill="#1b2230"/><rect x="{px(4.36+0.9)}" y="{py(D["front"])}" width="{(W-4.36-0.9)*S}" height="{0.15*S}" fill="#1b2230"/>')
A(f'<text x="{px(4.36)}" y="{py(D["front"])+38}" class="lb" text-anchor="middle">FRONT WALL · ARCH (pilot camera enters here)</text>')
# lanes
for n, d in [('walk lane (librarian)', D['near'])]:
    A(f'<line x1="{px(0.05)}" x2="{px(W-0.05)}" y1="{py(d)}" y2="{py(d)}" stroke="#7d838d" stroke-dasharray="8 6"/><text x="{px(0.45)}" y="{py(d)-8}" class="sm">{n}</text>')
# librarian marks
def mark(x, d, lab, col, sub=''):
    A(f'<circle cx="{px(x)}" cy="{py(d)}" r="15" fill="{col}" stroke="#000" stroke-width="2"/><text x="{px(x)}" y="{py(d)+5}" class="mk" text-anchor="middle">{lab}</text>')
    if sub: A(f'<text x="{px(x)}" y="{py(d)+32}" class="sm" text-anchor="middle">{sub}</text>')
mark(0.2, D['near'], 'L1', '#cfb38f', 'enters (pilot)'); mark(3.5, D['near'], 'L2', '#cfb38f', 'takes the scroll (pilot)'); mark(5.35, D['near'], 'L3', '#cfb38f', 'lays it down (pilot end)')
mark(3.75, D['near']+0.35, 'L4', '#e7c27a', 'scene 2: back at rack C')
A(f'<path d="M{px(5.2)},{py(D["near"])+18} Q{px(4.6)},{py(D["near"]+0.5)} {px(3.95)},{py(D["near"]+0.38)}" fill="none" stroke="#a8633a" stroke-width="3" marker-end="url(#ar)"/>')
mark(c['x']-0.05, D['mid']+0.62, 'YOU', '#9fc3e6', 'the viewer, at the stand\'s low edge (2C)')
# cameras
def cam(x, d, ang, fov, lab, col, rng=1.4):
    a0, a1 = math.radians(ang - fov/2), math.radians(ang + fov/2)
    p = lambda a: (px(x + rng*math.cos(a)), py(d - rng*math.sin(a)))
    (x1, y1), (x2, y2) = p(a0), p(a1)
    A(f'<polygon points="{px(x)},{py(d)} {x1},{y1} {x2},{y2}" fill="{col}" opacity="0.18"/><rect x="{px(x)-14}" y="{py(d)-10}" width="28" height="20" fill="{col}" stroke="#000" stroke-width="2"/><text x="{px(x)}" y="{py(d)+30}" class="lb" text-anchor="middle">{lab}</text>')
cam(4.3, 4.3, 90, 70, 'C0 wide (2D-1)', '#3b6ea5', 3.6)
cam(6.2, 2.85, 90, 34, 'C1 stand close-up (T1, 2A, 2B, 2E)', '#a8633a', 1.0)
A(f'<line x1="{px(6.29)}" x2="{px(6.29)}" y1="{py(2.6)}" y2="{py(D["mid"]+0.25)}" stroke="#a8633a" stroke-width="2" marker-end="url(#ar)"/>')
A(f'<text x="{px(6.5)}" y="{py(2.45)}" class="sm">C1 trucks left → right along the open sheet (2B)</text>')
cam(6.1, 2.35, 92, 60, '', '#5a8f5a', 2.1)
A(f'<text x="{px(7.0)}" y="{py(2.95)}" class="lb">C2 = YOUR EYES (2C)</text>')
svg_top = f'<svg width="{px(W)+50}" height="{py(4.6)}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#a8633a"/></marker></defs><rect width="100%" height="100%" fill="#efe9dd"/>' + ''.join(g) + '</svg>'

# ---- front elevation strip (what the C0 camera sees), true heights
E = []; S2 = 110; ex = lambda x: 40 + x * S2; ey = lambda h: 30 + (2.6 - h) * S2
E.append(f'<rect x="{ex(0)}" y="{ey(2.6)}" width="{W*S2}" height="{2.6*S2}" fill="#c9c3cf"/><rect x="{ex(0)}" y="{ey(1.0)}" width="{W*S2}" height="{1.0*S2}" fill="#8a3a3a"/>')
for k in 'ABC':
    o = O['rack'+k]; E.append(f'<rect x="{ex(o["x"]-o["w"]/2)}" y="{ey(o["h"])}" width="{o["w"]*S2}" height="{o["h"]*S2}" fill="#5b3b24" stroke="#000" stroke-width="2"/>')
    p = O['panel'+k]; E.append(f'<rect x="{ex(p["x"]-p["w"]/2)}" y="{ey(p["z"]+p["h"]/2)}" width="{p["w"]*S2}" height="{min(p["h"],0.5)*S2}" fill="#9b2f3a" stroke="#000" stroke-width="1.5"/>')
E.append(f'<circle cx="{ex(4.004)}" cy="{ey(1.151)}" r="5" fill="#B8322B" stroke="#000"/>')
E.append(f'<rect x="{ex(c["x"]-c["w"]/2)}" y="{ey(c["h"])}" width="{c["w"]*S2}" height="{c["h"]*S2}" fill="#b07a4c" stroke="#000" stroke-width="2"/><polygon points="{ex(c["x"]-0.55)},{ey(c["h"]+0.12)} {ex(c["x"]+0.4)},{ey(c["h"]+0.12)} {ex(c["x"]+0.4)},{ey(c["h"]+0.55)} {ex(c["x"]-0.33)},{ey(c["h"]+0.55)}" fill="#d49a66" stroke="#000" stroke-width="2"/>')
E.append(f'<line x1="{ex(l["x"])}" x2="{ex(l["x"])}" y1="{ey(0)}" y2="{ey(l["h"])}" stroke="#a8742e" stroke-width="4"/><circle cx="{ex(l["x"])}" cy="{ey(l["h"])}" r="9" fill="#F2B85A" stroke="#000"/>')
for x, lab in [(3.5, 'L2 = L4'), (5.35, 'L3')]:
    E.append(f'<rect x="{ex(x)-12}" y="{ey(1.7)}" width="24" height="{1.7*S2}" rx="12" fill="#e7d6bf" stroke="#000" stroke-width="2"/><text x="{ex(x)}" y="{ey(1.75)}" class="sm" text-anchor="middle">{lab}</text>')
E.append(f'<line x1="{ex(0)}" x2="{ex(W)}" y1="{ey(0)}" y2="{ey(0)}" stroke="#000" stroke-width="3"/>')
for h in (1.0, 1.7, 2.0):
    E.append(f'<text x="{ex(W)+6}" y="{ey(h)+4}" class="sm">{h} m</text><line x1="{ex(W)-6}" x2="{ex(W)}" y1="{ey(h)}" y2="{ey(h)}" stroke="#000"/>')
svg_front = f'<svg width="{ex(W)+60}" height="{ey(0)+20}" xmlns="http://www.w3.org/2000/svg">' + ''.join(E) + '</svg>'

shots = [
 ('T1', '85.6–86.2', 'C1', 'magnifier shrinks back onto the open sheet', 'L3, out of frame left', 'sheet on the stand', 'same frame the pilot ended on'),
 ('2A', '86.2–89.6', 'C1, slow push', 'sheet joins glow one by one', 'L3, out of frame', 'open sheet · board · blurred red wall', '"glued end to end"'),
 ('2B', '89.6–92.9', 'C1 trucks L → R', 'columns light up left to right', 'walks off to L4 (unseen)', 'sheet, rollers at both ends', 'ends on the right roller'),
 ('2C', '93.3–98.1', 'C2 your eyes', 'YOUR hands lift the roll off the board; right hand unrolls twice', 'L4, behind you', 'FG hands · MG one column · BG blurred: red panel centre, rack C edge left, lamp glow right', 'right roller = right hand, same screen spot as 2B ended'),
 ('2D-1', '98.1–100.7', 'C2 → C0 pull-back', 'hands lower out of frame; scroll ends ripple on "hundreds"', 'L4, reshelving at rack C (seen small)', 'whole room, lit by the one lamp', 'the gap in cubby 2,0 is still there'),
 ('2D-2', '100.7–106.6', 'rise out of the room', 'map; the room becomes one lit pin', '—', 'map (a graphic, not a set)', 'continuous move'),
 ('2E', '106.6–110.7', 'C1, very close', 'one column of Greek; finds the title tag', '—', 'the same sheet you just held', 'cut on "Greek"'),
]
rows = ''.join(f'<tr><td class="t">{a}</td><td>{b}</td><td>{c_}</td><td>{d}</td><td>{e}</td><td>{f}</td><td>{h}</td></tr>' for a, b, c_, d, e, f, h in shots)

issues = [
 ('In v2, the librarian\'s two hands take both rollers in 2B.', 'He stands at the stand\'s left side in profile (L3). The far roller is about 1.1 m away across a slanted board, so nobody can reach it naturally. This is exactly the kind of thing that used to surface only after animating.', 'Nobody hands it over: <b>you</b> step up to the stand\'s low edge (where a reader stands) and lift the roll yourself (2C). He walks back to rack C (L4) while the camera is on the sheet, and you see him there, small, in 2D-1. That gives the wide shot life and keeps the empty cubby in view.'),
 ('The pack put scroll racks behind the roll in 2C.', 'From the stand (x 6.2 m) you face the back wall where there is <b>no rack</b>: racks stop at 5.0 m. Rack C is to your left, the lamp to your right.', '2C background: a blurred red wall panel in the centre, the edge of rack C on the left, the lamp glow at upper right. The light comes from the right in every room shot.'),
 ('The sheet\'s writing changes between scenes.', 'The pilot close-up shows abstract ink marks; 2E shows real Greek capitals on what is meant to be the same sheet.', 'One sheet, one writing: Greek capitals from the pilot\'s close-up on (after the Greek passes the fact-check). The pilot close-up is re-rendered once, not patched later.'),
 ('The pack proposed turning the cabinet into Gell\'s central case in 2D-1.', 'Changing a set piece between scenes is a continuity break.', 'Lock it now: the freestanding case under the stand <b>is</b> the central case, the same in every shot of both scenes.'),
 ('The title tags are red rectangles in the pilot; the pack proposed parchment with a red edge (closer to the sources).', 'There are tags on every rack and on the carried scroll, so changing them later means re-rendering the pilot.', 'Your call (decision 1 below), made before gate 2 so it is drawn once.'),
]
iss = ''.join(f'<div class="c"><h3>{i+1}. {a}</h3><p class="mut">{b}</p><p><span class="ok">Plan:</span> {c_}</p></div>' for i, (a, b, c_) in enumerate(issues))

html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
body{{margin:0;background:#f4f1ea;font-family:Inter,'DejaVu Sans',sans-serif;color:#1d1d1d;width:1600px}}.w{{padding:36px 48px}}
h1{{font-size:32px;margin:0 0 6px}}h2{{font-size:23px;margin:30px 0 10px}}h3{{font-size:16px;margin:0 0 6px}}p{{margin:4px 0;font-size:14.5px;line-height:1.5}}
.sub{{color:#5a5a5a;font-size:16px;line-height:1.5;max-width:1400px}}.mut{{color:#555}}.ok{{color:#1b5e20;font-weight:700}}
.gates{{display:flex;gap:10px}}.gates div{{flex:1;padding:12px 14px;font-size:14px;line-height:1.45;border:1px solid #d9d3c7;background:#fff}}.gates .on{{border:3px solid #a8633a}}
.c{{background:#fff;border:1px solid #d9d3c7;padding:12px 16px;margin-bottom:10px}}
table{{border-collapse:collapse;width:100%;background:#fff;font-size:13.6px}}td,th{{border:1px solid #d9d3c7;padding:7px 8px;vertical-align:top;line-height:1.4}}th{{background:#e9e4da;text-align:left}}td.t{{font-weight:700;white-space:nowrap}}
.lb{{font:700 13px Inter,'DejaVu Sans',sans-serif;fill:#1d1d1d}}.lw{{font:700 13px Inter,'DejaVu Sans',sans-serif;fill:#fff}}.sm{{font:12px Inter,'DejaVu Sans',sans-serif;fill:#333}}.mk{{font:700 11px Inter,'DejaVu Sans',sans-serif;fill:#000}}
.fig{{background:#fff;border:1px solid #d9d3c7;padding:10px;display:inline-block}}ol li{{margin:6px 0;font-size:15px;line-height:1.5}}
</style></head><body><div class="w">
<h1>Scene 2 · "The long strip" — blocking plan (gate 1)</h1>
<p class="sub">Lines lib7–lib10, 85.6–110.7 s. Set first, then actors: this page fixes where everything stands, where the cameras are and who moves where, before any set is built or anyone animated. Positions across the room are the pilot's real numbers in metres; front-to-back depth is schematic (the 2D set only has layers). Built on animatic v2, which is still waiting for your OK.</p>
<h2>The four gates</h2><div class="gates">
<div class="on"><b>1 · Blocking plan</b> (this page)<br>marks, cameras, sight lines, light direction. Cheapest place to change anything.</div>
<div><b>2 · Empty set, locked</b><br>the room and props at true scale, a still from every camera (C0, C1, C2) with nobody in it. Set checks run here.</div>
<div><b>3 · Stand-in pass</b><br>a grey mannequin and grey hands at real timing in the locked set: reach, crops, hand-overs, foot room.</div>
<div><b>4 · Performance</b><br>the real librarian and your hands go in; the work is only acting. A change to the set after its lock sends us back to gate 2.</div></div>
<h2>Floor plan (seen from above)</h2><div class="fig">{svg_top}</div>
<h2>Front view from C0 (true heights)</h2><div class="fig">{svg_front}</div>
<p class="mut">The red dot on rack C is cubby 2,0 (1.15 m up), the scroll he took in the pilot. The librarian is 1.70 m; the board's centre is 1.10 m up, about his waist, so lifting a roll from it is a natural move.</p>
<h2>Shots: camera, action, who is where</h2>
<table><tr><th>Shot</th><th>Time (s)</th><th>Camera</th><th>Action</th><th>Librarian</th><th>In frame</th><th>Join / continuity</th></tr>{rows}</table>
<h2>What the blocking caught before anything was drawn</h2>{iss}
<h2>Decisions for you</h2><ol>
<li><b>Title tags:</b> keep red, or switch to parchment with a red edge (closer to the sources) before the set is locked?</li>
<li><b>2B–2C:</b> OK that <b>you</b> lift the roll from the stand yourself and the librarian goes back to rack C (no hand-over)?</li>
<li><b>Greek on the sheet</b> from the pilot's close-up on (once the Greek passes the fact-check)?</li>
<li>With those answers I lock this page and build <b>gate 2</b>: empty-set stills from C0, C1 and C2.</li></ol>
</div></body></html>'''
open('blocking.html', 'w').write(html)
