#!/usr/bin/env python3
"""Most-replayed peaks + all comments for one YouTube video (5 Nov 2026, skill gj581g-similar-videos).
Free (plain page fetch + YouTube's web comment API, no vidIQ credits). Analysis only: output stays in the run folder.

Usage: heat_comments.py VIDEO_ID out_dir [--max 600]
Writes out_dir/<id>.json with:
  heat: 100 segments [start_s, length_s, intensity 0-1];  peaks: local maxima above 0.6 (and YouTube's "Most replayed" labels)
  chapters: [start_s, title];  peaks get the chapter they fall in
  comments: [{text, likes, replies, stamps:[seconds]}] (top-level, as many pages as --max allows; sponsor/link spam dropped)
  stamped: comments that mention a timestamp, sorted by likes, each matched to the nearest heat peak
Prints a short summary. Theme counts (praise, accuracy complaints, "you forgot", next questions, jokes) are done by the
reader from comments, not by keyword rules here."""
import sys, os, re, json, subprocess, time
vid, out = sys.argv[1], sys.argv[2]; MAX = int(sys.argv[sys.argv.index('--max') + 1]) if '--max' in sys.argv else 600
os.makedirs(out, exist_ok=True)

def get(u):
    for k in range(3):
        s = subprocess.run(['curl', '-s', '-m', '25', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '-H', 'Accept-Language: en-US', u], capture_output=True, text=True).stdout
        if len(s) > 20000: return s
        time.sleep(3 + 3 * k)
    return s
def jsvar(s, name):
    i = s.find(name + ' = ')
    if i < 0: i = s.find(name + '=')
    if i < 0: return {}
    i = s.find('{', i)
    try: return json.JSONDecoder().raw_decode(s[i:])[0]
    except Exception: return {}
def walk(o, key):
    if isinstance(o, dict):
        if key in o: yield o[key]
        for x in o.values(): yield from walk(x, key)
    elif isinstance(o, list):
        for x in o: yield from walk(x, key)
def num(t):
    t = str(t).replace(',', '').strip().upper(); m = re.match(r'([\d.]+)\s*([KM]?)', t)
    return int(float(m.group(1)) * {'': 1, 'K': 1e3, 'M': 1e6}[m.group(2)]) if m else 0
def stamps(t):
    out = []
    for m in re.finditer(r'\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b', t):
        a, b, c = m.groups(); out.append(int(a) * 3600 + int(b) * 60 + int(c) if c else int(a) * 60 + int(b))
    return out

s = get(f'https://www.youtube.com/watch?v={vid}&hl=en'); d = jsvar(s, 'ytInitialData')
heat = []
for ml in walk(d, 'markersList'):
    if isinstance(ml, dict) and ml.get('markerType') == 'MARKER_TYPE_HEATMAP':
        heat = [[int(m['startMillis']) / 1000, int(m['durationMillis']) / 1000, round(m['intensityScoreNormalized'], 3)] for m in ml['markers']]; break
labels = [x['decorationTimeMillis'] / 1000 for dl in walk(d, 'timedMarkerDecorations') for x in dl if 'Most replayed' in json.dumps(x.get('label', {}))]
chapters = []
for ml in walk(d, 'markersList'):
    if isinstance(ml, dict) and ml.get('markerType') == 'MARKER_TYPE_CHAPTERS':
        chapters = [[int(m['startMillis']) / 1000, m.get('title', {}).get('simpleText', '')] for m in ml.get('markers', [])]
if not chapters:
    for c in walk(d, 'chapterRenderer'):
        chapters.append([c['timeRangeStartMillis'] / 1000, c['title']['simpleText']])
def chap(t):
    c = [x for x in chapters if x[0] <= t]; return c[-1][1] if c else ''
peaks = [h for i, h in enumerate(heat) if h[2] >= 0.6 and h[2] >= max(x[2] for x in heat[max(0, i - 2):i + 3])]
peaks = [dict(t=round(p[0] + p[1] / 2), intensity=p[2], chapter=chap(p[0]), labelled=any(abs(l - p[0] - p[1] / 2) < p[1] for l in labels)) for p in peaks]

# comments: follow continuation pages until MAX
key = re.search(r'"INNERTUBE_API_KEY":"([^"]+)"', s); ver = re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"', s)
toks = [c['token'] for c in walk(d, 'continuationCommand') if c.get('request') == 'CONTINUATION_REQUEST_TYPE_WATCH_NEXT']
coms, seen, tok = [], set(), (toks[-1] if toks else None)
while key and ver and tok and len(coms) < MAX:
    body = json.dumps({'context': {'client': {'clientName': 'WEB', 'clientVersion': ver.group(1), 'hl': 'en'}}, 'continuation': tok})
    r = subprocess.run(['curl', '-s', '-m', '25', '-H', 'Content-Type: application/json', '-d', body, f'https://www.youtube.com/youtubei/v1/next?key={key.group(1)}'], capture_output=True, text=True).stdout
    try: j = json.loads(r)
    except Exception: break
    got = 0
    for p in walk(j, 'commentEntityPayload'):
        cid = p.get('properties', {}).get('commentId')
        if cid in seen or p.get('properties', {}).get('replyLevel', 0): continue
        seen.add(cid); t = p['properties']['content']['content']; got += 1
        if re.search(r'sponsor|promo code|use code|http', t, re.I): continue
        tb = p.get('toolbar', {})
        coms.append(dict(text=t, likes=num(tb.get('likeCountNotliked', '0')), replies=num(tb.get('replyCount', '0') or '0'), stamps=stamps(t)))
    nxt = [c['token'] for c in walk(j, 'continuationCommand') if c.get('request') == 'CONTINUATION_REQUEST_TYPE_WATCH_NEXT']
    tok = nxt[-1] if nxt and got else None; time.sleep(0.6)
coms.sort(key=lambda c: -c['likes'])
def near(t):
    return min(peaks, key=lambda p: abs(p['t'] - t)) if peaks else None
stamped = [dict(c, near_peak=(near(c['stamps'][0])['t'] if near(c['stamps'][0]) and abs(near(c['stamps'][0])['t'] - c['stamps'][0]) < 30 else None)) for c in coms if c['stamps']]
json.dump(dict(id=vid, heat=heat, labels=labels, peaks=peaks, chapters=chapters, comments=coms, stamped=stamped), open(f'{out}/{vid}.json', 'w'), indent=1)
print(f'{vid}: heat {len(heat)} segments, {len(peaks)} peaks {[(p["t"], p["intensity"], p["chapter"][:30]) for p in peaks][:6]}; '
      f'{len(coms)} comments, {len(stamped)} with timestamps ({sum(1 for c in stamped if c["near_peak"])} near a peak)')
if not heat: print('no Most-replayed data (too few views, or YouTube did not send it): say so in the study')
