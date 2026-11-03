"""Peer watch (GJ 581g): follow channels like ours, track how each new video does over time, and gather what is needed to learn from it.
Usage: python3 peer_watch.py [peers.json] [outdir]
Reads peers.json; keeps ledger.json (every video seen, with a views snapshot per run, so growth at about day 1/7/28 can be read);
writes <outdir>/<date>/: digest.md (new uploads, outliers, growth leaders, cadence), learn/<id>.json (one card per video to study:
length, publish date, description stats, chapters, links, captions availability, top comments) and thumbs/<id>.jpg.
Free sources only: the channel's /videos page and the watch page (no login, no API key). Captions are fetched when YouTube serves them
to plain requests; otherwise the card says so and the run uses the browser method or one vidIQ transcript (5 credits).
"""
import sys, os, re, json, time, subprocess, statistics, datetime
D = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(sys.argv[1] if len(sys.argv) > 1 else f'{D}/peers.json'))
OUTROOT = sys.argv[2] if len(sys.argv) > 2 else f'{D}/reports'
TODAY = time.strftime('%Y-%m-%d'); OUT = f'{OUTROOT}/{TODAY}'
for sub in ('learn', 'thumbs'): os.makedirs(f'{OUT}/{sub}', exist_ok=True)
LEDGER = f'{D}/ledger.json'; L = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
FIRST_RUN = not L

def get(u):
    for k in range(3):
        s = subprocess.run(['curl', '-s', '-m', '25', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '-H', 'Accept-Language: en-US', u], capture_output=True, text=True).stdout
        if len(s) > 20000 or 'timedtext' in u: return s
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
    m = re.match(r'([\d.]+)\s*([KMB]?)', (t or '').replace(',', '')); return int(float(m.group(1)) * {'': 1, 'K': 1e3, 'M': 1e6, 'B': 1e9}[m.group(2)]) if m else 0
AGE = {'second': 1/86400, 'minute': 1/1440, 'hour': 1/24, 'day': 1, 'week': 7, 'month': 30.4, 'year': 365}
def days(a):
    m = re.search(r'(\d+)\s*(second|minute|hour|day|week|month|year)', a or ''); return int(m.group(1)) * AGE[m.group(2)] if m else None
def dur(t):
    p = [int(x) for x in re.findall(r'\d+', t or '')]; s = 0
    for x in p: s = s * 60 + x
    return s or None
PAT = [('question', r'\?'), ('why', r'\bwhy\b'), ('how', r'^\s*how\b'), ('what-if', r'\bwhat (if|happens)\b'), ('number', r'\d'),
       ('explained', r'explain'), ('you/your', r"\byou(r|'re)?\b"), ('country', r'\b(america|us|uk|britain|canada|australia|india|china|japan|europe|germany|france|world|countr)\w*'),
       ('dramatic', r'\b(collapse|crisis|dying|destroy|broke|killing|secret|truth|lie|scam|bubble|trap|nobody|insane|actually)\w*'), ('format-hook', r'\b(with bananas|in \d+ min|levels of|entire|every)\b')]
def pattern(t): return [k for k, r in PAT if re.search(r, t, re.I)]

def channel_videos(handle):
    s = get(f'https://www.youtube.com/{handle}/videos'); d = jsvar(s, 'ytInitialData')
    subs = re.search(r'"content":"([\d.,]+[KMB]?) subscribers"', s)
    out = []
    for lv in walk(d, 'lockupViewModel'):
        t = lv.get('metadata', {}).get('lockupMetadataViewModel', {})
        parts = [(p.get('accessibilityLabel') or p.get('text', {}).get('content', '')) for r in t.get('metadata', {}).get('contentMetadataViewModel', {}).get('metadataRows', []) for p in r.get('metadataParts', [])]
        v = next((p for p in parts if re.search(r'views?$', p.strip())), ''); a = next((p for p in parts if 'ago' in p), '')
        mv = re.match(r'([\d.,]+)\s*(thousand|million|billion|K|M|B)?', v.replace(',', ''))
        v = str(int(float(mv.group(1)) * {None: 1, 'thousand': 1e3, 'K': 1e3, 'million': 1e6, 'M': 1e6, 'billion': 1e9, 'B': 1e9}[mv.group(2)])) if mv else ''
        badge = next((b.get('text') for b in walk(lv, 'thumbnailBadgeViewModel') if re.match(r'^\d+:\d', b.get('text', ''))), None)
        if lv.get('contentId'): out.append(dict(id=lv['contentId'], title=t.get('title', {}).get('content', ''), views=num(v), age_days=days(a), length_s=dur(badge)))
    return out, (num(subs.group(1)) if subs else None)

def comments(s, n=25):
    d = jsvar(s, 'ytInitialData')
    key = re.search(r'"INNERTUBE_API_KEY":"([^"]+)"', s); ver = re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"', s)
    toks = [c['token'] for c in walk(d, 'continuationCommand') if c.get('request') == 'CONTINUATION_REQUEST_TYPE_WATCH_NEXT']
    if not (key and ver and toks): return []
    for tok in reversed(toks):
        body = json.dumps({'context': {'client': {'clientName': 'WEB', 'clientVersion': ver.group(1), 'hl': 'en'}}, 'continuation': tok})
        r = subprocess.run(['curl', '-s', '-m', '25', '-H', 'Content-Type: application/json', '-d', body, f'https://www.youtube.com/youtubei/v1/next?key={key.group(1)}'], capture_output=True, text=True).stdout
        try: j = json.loads(r)
        except Exception: continue
        out = [dict(text=p['properties']['content']['content'], likes=num(p.get('toolbar', {}).get('likeCountNotliked', '0'))) for p in walk(j, 'commentEntityPayload')]
        if out: return [c for c in out if not re.search(r'sponsor|promo code|use code|http', c['text'], re.I)][:n]
    return []

def learn(vid, peer, row, med):
    # The watch page's player data is behind YouTube's bot check for plain requests, so the card reads the page data
    # (description, date, likes, comments) and takes the length from the channel list. Captions: browser method or vidIQ.
    for k in range(3):  # YouTube answers bursts with a thin page: back off and retry
        s = get(f'https://www.youtube.com/watch?v={vid}&hl=en'); d = jsvar(s, 'ytInitialData')
        if 'attributedDescription' in s: break
        time.sleep(10 + 10 * k)
    desc = next((x.get('content', '') for x in walk(d, 'attributedDescription') if isinstance(x, dict) and len(x.get('content', '')) > 40), '')
    date = next((x.get('simpleText', '') for x in walk(d, 'dateText') if isinstance(x, dict)), '')
    likes = re.search(r'along with ([\d,]+) other', s)
    chapters = re.findall(r'^\s*\(?(\d{1,2}:\d{2}(?::\d{2})?)\)?\s+[-–:]?\s*(.+)$', desc, re.M)
    cap = None
    card = dict(id=vid, peer=peer, title=row['title'], views=row['views'], x_median=round(row['views'] / med, 2) if med else None,
                published=date, length_s=row.get('length_s'), likes=int(likes.group(1).replace(',', '')) if likes else None,
                patterns=pattern(row['title']), desc_chars=len(desc), desc_links=len(re.findall(r'https?://', desc)),
                desc_has_sources=bool(re.search(r'\bsources?\b|references|bibliograph', desc, re.I)), sponsor=bool(re.search(r'sponsor|use code|promo|% off', desc, re.I)),
                chapters=[[a, b.strip()[:80]] for a, b in chapters][:30], desc_head=desc[:600],
                captions='not fetched by plain requests: use the browser method (built-in browser) or vidIQ transcript (5 credits)',
                comments=comments(s))
    if cap:  # kept only in the run folder for analysis; never copied into channel docs (analysis, not transcripts)
        open(f'{OUT}/learn/{vid}.captions.txt', 'w').write(cap)
    json.dump(card, open(f'{OUT}/learn/{vid}.json', 'w'), indent=1)
    t = subprocess.run(['curl', '-s', '-m', '20', '-o', f'{OUT}/thumbs/{vid}.jpg', '-w', '%{http_code}', f'https://i.ytimg.com/vi/{vid}/maxresdefault.jpg'], capture_output=True, text=True).stdout
    if t != '200': subprocess.run(['curl', '-s', '-m', '20', '-o', f'{OUT}/thumbs/{vid}.jpg', f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg'])
    return card

rows, cad, queue, growth = [], [], [], []
for p in P['peers']:
    h = p['handle']
    try: vids, subs = channel_videos(h)
    except Exception as e: print('skip', h, e); continue
    if not vids: print('no videos', h); continue
    med = statistics.median([v['views'] for v in vids if v['views']] or [0])
    ages = sorted(v['age_days'] for v in vids if v['age_days'] is not None)
    recent = [a for a in ages if a <= 90]
    gaps = [b - a for a, b in zip(ages, ages[1:]) if b <= 180]
    lens = [v['length_s'] for v in vids if v['length_s']]
    cad.append(dict(peer=h, tier=p['tier'], subs=subs, median_views=int(med), uploads_90d=len(recent), median_gap_days=round(statistics.median(gaps), 1) if gaps else None,
                    median_length_min=round(statistics.median(lens) / 60, 1) if lens else None))
    for v in vids:
        rec = L.setdefault(v['id'], dict(peer=h, title=v['title'], first_seen=TODAY, snaps=[], published_approx=None, learned=False))
        if v['age_days'] is not None and not rec['published_approx']:
            rec['published_approx'] = (datetime.date.today() - datetime.timedelta(days=v['age_days'])).isoformat()
        if not rec['snaps'] or rec['snaps'][-1][0] != TODAY: rec['snaps'].append([TODAY, v['views']])
        x = v['views'] / med if med else 0
        new = rec['first_seen'] == TODAY and not FIRST_RUN
        fresh = v['age_days'] is not None and v['age_days'] <= 14
        out = x >= P.get('outlier_x', 2.0) and (v['age_days'] or 9999) <= 365
        rows.append(dict(peer=h, tier=p['tier'], **v, x_median=round(x, 2), new=new, outlier=out, patterns=pattern(v['title'])))
        if len(rec['snaps']) >= 2:
            (d0, v0), (d1, v1) = rec['snaps'][-2], rec['snaps'][-1]
            dd = max((datetime.date.fromisoformat(d1) - datetime.date.fromisoformat(d0)).days, 1)
            growth.append(dict(peer=h, id=v['id'], title=v['title'], per_day=round((v1 - v0) / dd), x_median=round(x, 2)))
        if not rec['learned'] and (new or (FIRST_RUN and fresh) or out): queue.append((x, v, h, med))
    time.sleep(1)

queue.sort(key=lambda q: -q[0]); learned = []
for x, v, h, med in queue[:P.get('learn_per_run', 8)]:
    try: learned.append(learn(v['id'], h, v, med)); L[v['id']]['learned'] = True
    except Exception as e: print('learn failed', v['id'], e)
    time.sleep(6)
json.dump(L, open(LEDGER, 'w'), indent=0)
json.dump(dict(rows=rows, cadence=cad, growth=growth), open(f'{OUT}/data.json', 'w'), indent=0)

def fm(n): return f'{n/1e6:.1f}M' if n >= 1e6 else (f'{n/1e3:.0f}k' if n >= 1e3 else str(n))
md = [f'# Peer watch {TODAY}', '', f'{len(cad)} channels, {len(rows)} videos on their /videos pages; {len(learned)} learn cards in `learn/`, thumbnails in `thumbs/`.', '']
md += ['## New uploads since the last run' if not FIRST_RUN else '## Uploads in the last 14 days (first run)', '']
fresh = [r for r in rows if (r['new'] if not FIRST_RUN else (r['age_days'] or 99) <= 14)]
md += [f"- **{r['title']}** ({r['peer']}, {fm(r['views'])} views, {r['x_median']}x median, {round((r['length_s'] or 0)/60,1)} min) `{r['id']}` {', '.join(r['patterns'])}" for r in sorted(fresh, key=lambda r: -r['x_median'])] or ['- none']
md += ['', '## Outliers (2x+ their channel median, last 12 months)', '']
md += [f"- {r['x_median']}x **{r['title']}** ({r['peer']}, {fm(r['views'])}, {round((r['length_s'] or 0)/60,1)} min) `{r['id']}` {', '.join(r['patterns'])}" for r in sorted([r for r in rows if r['outlier']], key=lambda r: -r['x_median'])[:20]] or ['- none']
if growth:
    md += ['', '## Fastest growing since the last run (views per day)', '']
    md += [f"- {fm(g['per_day'])}/day **{g['title']}** ({g['peer']}, {g['x_median']}x)" for g in sorted(growth, key=lambda g: -g['per_day'])[:10]]
md += ['', '## Cadence and format', '', '| Channel | Tier | Subs | Median views | Uploads (90 d) | Median length (min) |', '|---|---|---|---|---|---|']
md += [f"| {c['peer']} | {c['tier']} | {fm(c['subs']) if c['subs'] else '-'} | {fm(c['median_views'])} | {c['uploads_90d']} | {c['median_length_min'] or '-'} |" for c in cad]
pt = {}
for r in rows:
    for k in r['patterns']: pt.setdefault(k, []).append(r['x_median'])
md += ['', '## Title patterns vs performance (median x-median of videos using each)', '']
md += [f"- {k}: {round(statistics.median(v), 2)}x over {len(v)} videos" for k, v in sorted(pt.items(), key=lambda kv: -statistics.median(kv[1]))]
md += ['', '## Learn cards', ''] + [f"- `{c['id']}` {c['title']} ({c['peer']}): {round(c['length_s']/60,1)} min, {len(c['chapters'])} chapters, sources in description: {c['desc_has_sources']}, sponsor: {c['sponsor']}, captions: {c['captions']}, {len(c['comments'])} comments" for c in learned]
open(f'{OUT}/digest.md', 'w').write('\n'.join(md) + '\n')
print(f'{OUT}/digest.md', len(rows), 'videos', len(learned), 'learned')
