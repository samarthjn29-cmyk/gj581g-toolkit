#!/usr/bin/env python3
"""Niche scout v2 (3 Nov 2026). One run gathers the signals the gj581g-niche-scout skill reasons over.
  python3 scout.py [watchlist.json] [reports_dir]   -> reports_dir/<date>/
Writes youtube.csv (search results per seed and per region), suggest.json, trends.json, news.json, peers.csv,
comments.json, metrics.json (this week's numbers, for next week's comparison), thumbs/ (outlier thumbnails), signals.md.
New in v2 (Sam, 3 Nov 2026: a global channel for the US, UK/Europe, Canada, Australia and other English-speaking audiences):
  * regional search: every seed is searched as a viewer in each `search_geos` country, and the report shows where demand differs;
  * week over week: medians and autocomplete compared with the previous run (rising, falling, new suggestions);
  * gap measure: recent videos (12 months) from small channels (< 100k subscribers) that still beat 50k views and their own
    subscriber count; many such wins = an open topic, none = owned by big channels;
  * viewer questions: top comments of peer outliers and of each core seed's top result (YouTube's web API, no key);
  * patterns: title-pattern tags for every outlier and its thumbnail saved for a visual look;
  * calendar: scheduled events in the next 6 weeks from calendar.json (plan pegs ahead; a video takes days).
Reachability (3 Nov 2026): YouTube pages + youtubei API, Google autocomplete, Google Trends daily RSS, Google News RSS work;
Reddit (403), Google Trends explore API (429) and yt-dlp (bot check) do not."""
import sys, os, re, json, csv, time, glob, subprocess, urllib.parse, statistics as st, xml.etree.ElementTree as ET, datetime as dt
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
from yt_search import search
W = json.load(open(sys.argv[1] if len(sys.argv) > 1 else f'{D}/watchlist.json'))
REP = sys.argv[2] if len(sys.argv) > 2 else f'{D}/reports'; TODAY = time.strftime('%Y-%m-%d')
OUT = os.path.join(REP, TODAY); os.makedirs(f'{OUT}/thumbs', exist_ok=True)
CACHE = f'{D}/cache'; os.makedirs(CACHE, exist_ok=True)
def get(u, data=None):
    cmd = ['curl', '-s', '-m', '25', '-A', 'Mozilla/5.0', '-H', 'Accept-Language: en-US', u]
    if data: cmd[1:1] = ['-H', 'Content-Type: application/json', '-d', data]
    return subprocess.run(cmd, capture_output=True, text=True).stdout
U = {'s': 1/3e7, 'min': 1/5e5, 'h': 1/8760, 'd': 1/365, 'w': 7/365, 'mo': 1/12, 'y': 1}
def yrs(a):
    m = re.match(r'(\d+)\s*(mo|min|s|h|d|w|y)', a or ''); return int(m.group(1)) * U[m.group(2)] if m else None
def num(t):
    m = re.match(r'([\d.]+)\s*([KMB]?)', (t or '').replace(',', '')); return int(float(m.group(1)) * {'': 1, 'K': 1e3, 'M': 1e6, 'B': 1e9}[m.group(2)]) if m else 0
def initial(s):
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', s); return json.loads(m.group(1)) if m else {}
def walk(o, key):
    if isinstance(o, dict):
        if key in o: yield o[key]
        for x in o.values(): yield from walk(x, key)
    elif isinstance(o, list):
        for x in o: yield from walk(x, key)
# ---------- helpers
def suggest(q, gl='US'):
    yt = get(f'https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=en&gl={gl}&q=' + urllib.parse.quote(q))
    g = get(f'https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl={gl}&q=' + urllib.parse.quote(q))
    try: gs = json.loads(g)[1]
    except Exception: gs = []
    return dict(youtube=re.findall(r'\["([^"]+)",0', yt)[:10], google=gs[:10])
def rss(u, n=15):
    try: root = ET.fromstring(get(u))
    except Exception: return []
    out = []
    for it in root.iter('item'):
        e = {c.tag.split('}')[-1]: (c.text or '') for c in it}
        out.append(dict(title=e.get('title', ''), link=e.get('link', ''), date=e.get('pubDate', ''), traffic=e.get('approx_traffic', '')))
    return out[:n]
SUBS = json.load(open(f'{CACHE}/subs.json')) if os.path.exists(f'{CACHE}/subs.json') else {}
def subs(curl):
    """subscriber count of a channel (/@handle), cached for 30 days"""
    if not curl: return None
    c = SUBS.get(curl)
    if c and (time.time() - c['t']) < 30 * 86400: return c['n']
    s = get(f'https://www.youtube.com{curl}'); m = re.search(r'"metadataParts":\[\{"text":\{"content":"([\d.,]+[KMB]?) subscribers"', s)
    n = num(m.group(1)) if m else None; SUBS[curl] = dict(n=n, t=time.time()); return n
def peer_videos(u):
    out = []
    for lv in walk(initial(get(f'https://www.youtube.com{u}/videos')), 'lockupViewModel'):
        t = lv.get('metadata', {}).get('lockupMetadataViewModel', {})
        parts = [p.get('text', {}).get('content', '') for r in t.get('metadata', {}).get('contentMetadataViewModel', {}).get('metadataRows', []) for p in r.get('metadataParts', [])]
        v = next((p for p in parts if re.match(r'^[\d.,]+[KMB]?( views?)?$', p.strip())), ''); a = next((p for p in parts if 'ago' in p), '')
        out.append(dict(peer=u, id=lv.get('contentId', ''), title=t.get('title', {}).get('content', ''), views=num(v), age=a))
    return out
def comments(vid, n=20):
    """top comments of a video through YouTube's own web API (no key, no login)"""
    s = get(f'https://www.youtube.com/watch?v={vid}&hl=en'); key = re.search(r'"INNERTUBE_API_KEY":"([^"]+)"', s); ver = re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"', s)
    toks = [c['token'] for c in walk(initial(s), 'continuationCommand') if c.get('request') == 'CONTINUATION_REQUEST_TYPE_WATCH_NEXT']
    if not (key and ver and toks): return []
    j = get(f'https://www.youtube.com/youtubei/v1/next?key={key.group(1)}', json.dumps({'context': {'client': {'clientName': 'WEB', 'clientVersion': ver.group(1), 'hl': 'en'}}, 'continuation': toks[-1]}))
    try: j = json.loads(j)
    except Exception: return []
    out = [dict(text=p['properties']['content']['content'], likes=num(p.get('toolbar', {}).get('likeCountNotliked', '0'))) for p in walk(j, 'commentEntityPayload')]
    return [c for c in out if not re.search(r'sponsor|promo code|use code|link in|http', c['text'], re.I)][:n]
PAT = [('question', r'\?'), ('why', r'^\s*why\b|\bwhy\b'), ('how', r'^\s*how\b'), ('what-if', r'\bwhat (if|happens)\b'), ('number', r'\d'),
       ('explained', r'explain'), ('you/your', r"\byou(r|'re)?\b"), ('country', r'\b(america|us|uk|britain|canada|australia|india|china|japan|europe|germany|france|world)\b'),
       ('dramatic', r'\b(collapse|crisis|dying|destroy|broke|killing|secret|truth|lie|scam|bubble|trap)\w*'), ('format-hook', r'\b(with bananas|in \d+ min|levels of|entire)\b')]
def pattern(t): return [k for k, r in PAT if re.search(r, t, re.I)]
geos = W.get('search_geos', ['US']); core = [n for n, c in W['niches'].items() if c['status'] == 'core']
# ---------- 1 YouTube demand per seed per region, autocomplete
yt, sug = [], {}
for niche, cfg in W['niches'].items():
    if cfg['status'] == 'paused': continue
    for q in cfg['seeds']:
        for gl in geos:
            for r in search(q, gl)[:20]: yt.append(dict(r, niche=niche, gl=gl))
            time.sleep(0.5)
        sug[q] = suggest(q, geos[0])
with open(f'{OUT}/youtube.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['niche', 'gl', 'q', 'id', 'title', 'views', 'age', 'channel', 'curl', 'length']); w.writeheader(); w.writerows(yt)
json.dump(sug, open(f'{OUT}/suggest.json', 'w'), indent=1)
# ---------- 2 metrics per seed (+ gap measure on the first region)
M = {}
for q in dict.fromkeys(r['q'] for r in yt):
    M[q] = {}
    for gl in geos:
        R = [r for r in yt if r['q'] == q and r['gl'] == gl and r['views']]
        if not R: continue
        vpy = [r['views'] / max(yrs(r['age']), .25) for r in R if yrs(r['age'])]
        M[q][gl] = dict(median=st.median(r['views'] for r in R), vpy=st.median(vpy) if vpy else 0, recent=sum(1 for r in R if (yrs(r['age']) or 9) <= 1))
    R = [r for r in yt if r['q'] == q and r['gl'] == geos[0] and r['views'] and (yrs(r['age']) or 9) <= 1]
    wins = []
    for r in R:
        n = subs(r.get('curl'))
        if n is not None and n < 100_000 and r['views'] >= max(50_000, n): wins.append(f"{r['channel']} ({n/1e3:,.0f}k subs) {r['views']/1e3:,.0f}k: {r['title'][:60]}")
    M[q]['small_wins'] = wins; M[q]['suggest'] = sug.get(q, {}).get('youtube', [])
json.dump(SUBS, open(f'{CACHE}/subs.json', 'w'))
json.dump(M, open(f'{OUT}/metrics.json', 'w'), indent=1)
prev_dir = sorted(d for d in glob.glob(f'{REP}/*/metrics.json') if TODAY not in d)
P = json.load(open(prev_dir[-1])) if prev_dir else {}
# ---------- 3 trends, news, calendar
trends = {g: rss(f'https://trends.google.com/trending/rss?geo={g}', 25) for g in W['trends_geo']}
news = {q: rss(f'https://news.google.com/rss/search?q={urllib.parse.quote(q)}+when:7d&hl=en-US&gl=US&ceid=US:en', 8) for q in W['news']}
json.dump(trends, open(f'{OUT}/trends.json', 'w'), indent=1); json.dump(news, open(f'{OUT}/news.json', 'w'), indent=1)
cal = json.load(open(f'{D}/calendar.json'))['events'] if os.path.exists(f'{D}/calendar.json') else []
soon = [e for e in cal if TODAY <= e['date'] <= (dt.date.today() + dt.timedelta(days=42)).isoformat()]
# ---------- 4 peer outliers, their patterns, thumbnails and comments
peers = []
for p in W['peers']:
    v = peer_videos(p)[:30]
    if v:
        med = st.median([x['views'] for x in v]) or 1
        for x in v: x['x_median'] = round(x['views'] / med, 2); x['patterns'] = ' '.join(pattern(x['title']))
    peers += v; time.sleep(0.5)
with open(f'{OUT}/peers.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['peer', 'id', 'title', 'views', 'age', 'x_median', 'patterns']); w.writeheader(); w.writerows(peers)
outl = sorted([x for x in peers if x.get('x_median', 0) >= 2 and (yrs(x['age']) or 9) <= 1], key=lambda x: -x['x_median'])[:15]
for x in outl:
    if x['id']: subprocess.run(['curl', '-s', '-m', '20', '-o', f"{OUT}/thumbs/{x['id']}.jpg", f"https://i.ytimg.com/vi/{x['id']}/hqdefault.jpg"])
CM = {}
for x in outl[:6]: CM[f"peer {x['peer']}: {x['title']}"] = comments(x['id'])
for q in [q for q in M if any(r['niche'] in core for r in yt if r['q'] == q)][:8]:
    top = sorted([r for r in yt if r['q'] == q and r['gl'] == geos[0]], key=lambda r: -r['views'])[:1]
    if top: CM[f"seed '{q}': {top[0]['title']}"] = comments(top[0]['id'])
json.dump(CM, open(f'{OUT}/comments.json', 'w'), indent=1)
# ---------- 5 signals.md
k = lambda v: f'{v/1e3:,.0f}k'
L = [f'# Niche scout signals, {time.strftime("%d %b %Y")}', '', f'Regions searched: {", ".join(geos)} (first = main). Previous run: {os.path.basename(os.path.dirname(prev_dir[-1])) if prev_dir else "none"}.', '',
     '## Demand by seed', 'median views of top results per region | views/yr (main region) | change vs last run | small-channel wins in the last 12 months']
for niche, cfg in W['niches'].items():
    if cfg['status'] == 'paused': continue
    L.append(f"\n**{niche}** ({cfg['status']})")
    for q in cfg['seeds']:
        m = M.get(q, {}); g0 = m.get(geos[0])
        if not g0: L.append(f'- {q}: no results'); continue
        reg = ' / '.join(f"{gl} {k(m[gl]['median'])}" for gl in geos if gl in m)
        p0 = P.get(q, {}).get(geos[0]); chg = f"{(g0['median'] / p0['median'] - 1) * 100:+.0f}%" if p0 and p0['median'] else 'new'
        L.append(f"- **{q}**: {reg} | {k(g0['vpy'])}/yr | {chg} | small wins: {len(m['small_wins'])}")
        new_s = [s for s in m['suggest'] if s not in P.get(q, {}).get('suggest', [])] if P.get(q) else []
        L.append(f"  - autocomplete: {', '.join(m['suggest'][:6])}" + (f" | NEW this week: {', '.join(new_s[:4])}" if new_s else ''))
        for wn in m['small_wins'][:2]: L.append(f'  - small win: {wn}')
L += ['', '## Peer outliers (last 12 months, at least 2x their channel median) with title patterns; thumbnails in thumbs/']
for x in outl: L.append(f"- {x['peer']}: {x['title']} | {k(x['views'])} | {x['age']} | {x['x_median']}x | {x['patterns'] or '-'} | thumbs/{x['id']}.jpg")
pc = {}
for x in outl:
    for t in x['patterns'].split(): pc[t] = pc.get(t, 0) + 1
L.append(f"- pattern counts among outliers: {', '.join(f'{a} {b}' for a, b in sorted(pc.items(), key=lambda z: -z[1]))}")
L += ['', '## Viewer questions (top comments containing a question; full text in comments.json)']
for src, cs in CM.items():
    qs = [c for c in cs if '?' in c['text'] or re.search(r'\b(why|how|what about|explain|does this|is it)\b', c['text'], re.I)][:4]
    if qs: L.append(f'**{src[:90]}**'); L += [f"- {c['text'][:180].replace(chr(10), ' ')} ({c['likes']} likes)" for c in qs]
L += ['', '## Coming up (next 6 weeks, from calendar.json): plan pegs now']
L += [f"- {e['date']} {e['region']} {e['type']}: {e['name']} ({e['status']})" for e in soon] or ['- calendar.json missing or empty']
L += ['', '## Trending searches today']
for g, items in trends.items(): L.append(f"- {g}: " + '; '.join(f"{i['title']} ({i['traffic']})" for i in items[:12]))
L += ['', '## News this week (Google News, US edition)']
for q, items in news.items():
    L.append(f'**{q}**'); L += [f"- {i['title']} ({i['date'][:16]})" for i in items[:5]]
open(f'{OUT}/signals.md', 'w').write('\n'.join(L) + '\n'); print(f'{OUT}/signals.md')
