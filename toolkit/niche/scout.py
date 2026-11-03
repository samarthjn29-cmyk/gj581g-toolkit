#!/usr/bin/env python3
"""Niche scout (3 Nov 2026): one run gathers the signals the gj581g-niche-scout skill reasons over.
  python3 scout.py [watchlist.json] [outdir]   -> outdir/<date>/ {youtube.csv, suggest.json, trends.json, news.json, peers.csv, signals.md}
Sources reachable from the workspace: YouTube search + channel pages, YouTube and Google autocomplete, Google Trends daily RSS,
Google News RSS. Reddit blocks the workspace (403): the skill reads Reddit through WebSearch/WebFetch or the built-in browser."""
import sys, os, re, json, csv, time, subprocess, urllib.parse, statistics as st, xml.etree.ElementTree as ET
from yt_search import search
D = os.path.dirname(os.path.abspath(__file__))
W = json.load(open(sys.argv[1] if len(sys.argv) > 1 else f'{D}/watchlist.json'))
OUT = os.path.join(sys.argv[2] if len(sys.argv) > 2 else f'{D}/reports', time.strftime('%Y-%m-%d')); os.makedirs(OUT, exist_ok=True)
get = lambda u: subprocess.run(['curl', '-s', '-m', '25', '-A', 'Mozilla/5.0', '-H', 'Accept-Language: en-US', u], capture_output=True, text=True).stdout
U = {'s': 1/3e7, 'min': 1/5e5, 'h': 1/8760, 'd': 1/365, 'w': 7/365, 'mo': 1/12, 'y': 1}
def yrs(a):
    m = re.match(r'(\d+)\s*(mo|min|s|h|d|w|y)', a or ''); return int(m.group(1)) * U[m.group(2)] if m else None
def suggest(q):
    yt = get('https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=' + urllib.parse.quote(q))
    g = get('https://suggestqueries.google.com/complete/search?client=firefox&q=' + urllib.parse.quote(q))
    yts = re.findall(r'\["([^"]+)",0', yt)
    try: gs = json.loads(g)[1]
    except Exception: gs = []
    return dict(youtube=yts[:10], google=gs[:10])
def rss(u, n=15):
    try: root = ET.fromstring(get(u))
    except Exception: return []
    out = []
    for it in root.iter('item'):
        e = {c.tag.split('}')[-1]: (c.text or '') for c in it}
        out.append(dict(title=e.get('title', ''), link=e.get('link', ''), date=e.get('pubDate', ''), traffic=e.get('approx_traffic', ''), source=e.get('source', '')))
    return out[:n]
def peer_videos(u):
    s = get(f'https://www.youtube.com{u}/videos'); m = re.search(r'var ytInitialData = (\{.*?\});</script>', s); out = []
    if not m: return out
    def walk(o):
        if isinstance(o, dict):
            if 'lockupViewModel' in o:
                t = o['lockupViewModel'].get('metadata', {}).get('lockupMetadataViewModel', {})
                parts = [p.get('text', {}).get('content', '') for r in t.get('metadata', {}).get('contentMetadataViewModel', {}).get('metadataRows', []) for p in r.get('metadataParts', [])]
                v = next((p for p in parts if re.match(r'^[\d.,]+[KMB]?( views?)?$', p.strip())), ''); a = next((p for p in parts if 'ago' in p), '')
                n = re.match(r'([\d.]+)([KMB]?)', v.replace(',', ''))
                views = float(n.group(1)) * {'': 1, 'K': 1e3, 'M': 1e6, 'B': 1e9}[n.group(2)] if n else 0
                out.append(dict(peer=u, title=t.get('title', {}).get('content', ''), views=int(views), age=a)); return
            for x in o.values(): walk(x)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(json.loads(m.group(1))); return out
# 1 YouTube demand per seed
yt, sug = [], {}
for niche, cfg in W['niches'].items():
    for q in cfg['seeds']:
        for r in search(q)[:20]: yt.append(dict(r, niche=niche))
        sug[q] = suggest(q); time.sleep(1)
with open(f'{OUT}/youtube.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['niche', 'q', 'id', 'title', 'views', 'age', 'channel', 'curl', 'length']); w.writeheader(); w.writerows(yt)
json.dump(sug, open(f'{OUT}/suggest.json', 'w'), indent=1)
# 2 trends + news
trends = {g: rss(f'https://trends.google.com/trending/rss?geo={g}', 25) for g in W['trends_geo']}
news = {q: rss(f'https://news.google.com/rss/search?q={urllib.parse.quote(q)}+when:7d&hl=en-IN&gl=IN&ceid=IN:en', 8) for q in W['news']}
json.dump(trends, open(f'{OUT}/trends.json', 'w'), indent=1); json.dump(news, open(f'{OUT}/news.json', 'w'), indent=1)
# 3 peer outliers: a video at >= 2x its channel's median views is an outlier (the topic or packaging worked)
peers = []
for p in W['peers']:
    v = peer_videos(p)[:30]
    if v:
        med = st.median([x['views'] for x in v]) or 1
        for x in v: x['x_median'] = round(x['views'] / med, 2)
    peers += v; time.sleep(1)
with open(f'{OUT}/peers.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['peer', 'title', 'views', 'age', 'x_median']); w.writeheader(); w.writerows(peers)
# 4 summary for the skill to reason over
L = ['# Niche scout signals, ' + time.strftime('%d %b %Y'), '', '## YouTube demand by seed (median views of top results | median of results from the last year | views per year)']
for niche, cfg in W['niches'].items():
    L.append(f"\n**{niche}** ({cfg['status']})")
    for q in cfg['seeds']:
        R = [r for r in yt if r['q'] == q and r['views']]
        if not R: L.append(f'- {q}: no results'); continue
        v = [r['views'] for r in R]; rec = [r['views'] for r in R if (yrs(r['age']) or 9) <= 1]; vpy = [r['views'] / max(yrs(r['age']), .25) for r in R if yrs(r['age'])]
        top = '; '.join(f"{r['channel']} {r['views']/1e3:,.0f}k ({r['age']})" for r in sorted(R, key=lambda r: -r['views'])[:2])
        L.append(f"- {q}: {st.median(v)/1e3:,.0f}k | {len(rec)} recent, median {st.median(rec)/1e3 if rec else 0:,.0f}k | {st.median(vpy)/1e3 if vpy else 0:,.0f}k/yr | top: {top}")
        L.append(f"  - people also search: {', '.join((sug[q]['youtube'] or sug[q]['google'])[:6])}")
L += ['', '## Peer outliers (at least 2x the channel median, newest first)']
for x in [x for x in peers if x.get('x_median', 0) >= 2][:25]: L.append(f"- {x['peer']}: {x['title']} | {x['views']/1e3:,.0f}k | {x['age']} | {x['x_median']}x")
L += ['', '## Trending searches today']
for g, items in trends.items(): L.append(f"- {g}: " + '; '.join(f"{i['title']} ({i['traffic']})" for i in items[:12]))
L += ['', '## News this week (Google News)']
for q, items in news.items():
    L.append(f'**{q}**'); L += [f"- {i['title']} ({i['date'][:16]})" for i in items[:5]]
open(f'{OUT}/signals.md', 'w').write('\n'.join(L) + '\n'); print(f'{OUT}/signals.md')
