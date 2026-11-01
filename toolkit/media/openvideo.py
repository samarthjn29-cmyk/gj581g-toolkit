"""Public-domain and openly licensed video: search, licence check, download, licence log.

  openvideo.py search <archive|nasa|commons> "term" ["term" ...]   -> prints id, licence, title; writes openvideo_results.json
  openvideo.py get <source>:<id> [...] [--dir media/ov] [--start S --len L]  -> re-checks the licence, downloads an mp4 (H.264, at most 1080p)
                                                                       to <dir>/<source>_<id>.mp4, writes <same>.licence.json and
                                                                       adds a row to media/licence_log.csv
  openvideo.py log <file> --source "..." --licence "..." --proof "..." [--credit "..."]
                                                                    -> records a clip the user supplied (bought, or used with written
                                                                       permission) in media/licence_log.csv; the deck never uses a
                                                                       third-party clip without a row here

Sources and what is accepted:
  archive  Internet Archive movies whose licenseurl is a public-domain mark, CC0, CC BY or CC BY-SA, from trusted collections
           only (Prelinger, FedFlix / US government, National Archives): uploader-claimed licences elsewhere are often wrong
           (TV shows and wrestling tapes marked 'public domain'). --any also lists other collections, marked CHECK.
  nasa     NASA Image and Video Library. NASA material is generally not copyrighted, but: no NASA logos or insignia on screen,
           nothing that implies NASA endorses the video, and items credited to a third party (check 'Credit' in the result)
           are refused.
  commons  Wikimedia Commons video files with Public domain, PD-USGov-*, CC0, CC BY or CC BY-SA. Commons often rate-limits
           shared cloud connections (HTTP 429): the script retries, then says so; try later or another source.
Refused everywhere: NC (non-commercial), ND (no derivatives: we crop, tint and cut), 'fair use' and unknown licences.
CC BY / BY-SA need the credit shown (deck notes + description); the log row carries the exact credit line.
Never used: footage downloaded from YouTube, TikTok, Instagram, X or news sites (copyright and platform rules), even when
it is credited. Those appear only as clips the user supplies with a licence or permission (see 'log')."""
import sys, os, re, json, csv, time, subprocess, urllib.parse, urllib.request, datetime

UA = 'DeckedOutDataBot/0.3 (research explainer channel; open-licence video search)'
OK = [(r'publicdomain|public domain|pd-|cc0|cc-zero|pdm', 'Public domain / CC0'), (r'by-sa|cc by-sa', 'CC BY-SA'), (r'(/by/|cc by\b|cc-by\b|cc by \d)', 'CC BY')]
BAD = r'(-nc|nc-|noncommercial|non-commercial|-nd|nd-|noderiv|fair use|all rights reserved)'

def classify(text):
    t = (text or '').lower()
    if not t or re.search(BAD, t): return None
    for pat, name in OK:
        if re.search(pat, t): return name
    return None

def fetch(url, tries=4, raw=False):
    for i in range(tries):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60)
            b = r.read(); return b if raw else json.loads(b)
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < tries - 1: time.sleep(5 * (i + 1)); continue
            if e.code == 429: sys.exit(f'rate-limited (HTTP 429) by {urllib.parse.urlparse(url).netloc}: try again later or another source')
            raise

# ---------------------------------------------------------------- Internet Archive
TRUSTED = ('prelinger', 'fedflix', 'usgovernmentdocuments', 'us_national_archives', 'nationalarchives', 'nasa', 'naravideo')
ANY = '--any' in sys.argv
def archive_search(q, n=8):
    coll = '' if ANY else ' AND (' + ' OR '.join(f'collection:{c}' for c in TRUSTED) + ')'
    p = {'q': f'({q}) AND mediatype:movies AND licenseurl:*' + coll, 'fl[]': ['identifier', 'title', 'licenseurl', 'runtime', 'collection'], 'rows': n * 3, 'output': 'json'}
    d = fetch('https://archive.org/advancedsearch.php?' + urllib.parse.urlencode(p, doseq=True))
    out = []
    for x in d['response']['docs']:
        lic = classify(x.get('licenseurl'))
        trusted = any(c.lower() in TRUSTED for c in (x.get('collection') or []))
        if lic: out.append(dict(source='archive', id=x['identifier'], title=('' if trusted else 'CHECK ') + str(x.get('title', ''))[:90], licence=lic, licence_url=x.get('licenseurl'),
                                credit=None, page='https://archive.org/details/' + x['identifier'], runtime=x.get('runtime')))
    return out[:n]

def archive_get(i):
    m = fetch(f'https://archive.org/metadata/{i}'); md = m.get('metadata', {})
    lu = md.get('licenseurl'); lic = classify(lu)
    if not lic: sys.exit(f'archive:{i}: licence not accepted ({lu})')
    colls = md.get('collection'); colls = colls if isinstance(colls, list) else [colls]
    if not ANY and not any(str(c).lower() in TRUSTED for c in colls): sys.exit(f'archive:{i}: not in a trusted collection ({colls}); check the rights yourself and rerun with --any')
    vids = [f for f in m['files'] if f['name'].lower().endswith(('.mp4', '.mpeg4', '.m4v', '.ogv', '.mov')) or f.get('format', '').lower().startswith(('mpeg4', 'h.264'))]
    if not vids: sys.exit(f'archive:{i}: no video file')
    best = max(vids, key=lambda f: (min(int(f.get('height') or 0), 1080), int(f.get('size') or 0)))
    url = f"https://archive.org/download/{i}/{urllib.parse.quote(best['name'])}"
    creator = md.get('creator'); creator = ', '.join(creator) if isinstance(creator, list) else creator
    return url, dict(licence=lic, licence_url=lu, title=md.get('title'), credit=(f"{md.get('title')} by {creator or 'unknown'}, Internet Archive ({lic})" if lic != 'Public domain / CC0' else None),
                     page=f'https://archive.org/details/{i}')

# ---------------------------------------------------------------- NASA
def nasa_search(q, n=8):
    d = fetch('https://images-api.nasa.gov/search?' + urllib.parse.urlencode({'q': q, 'media_type': 'video'}))
    out = []
    for it in d['collection']['items'][:n * 2]:
        x = it['data'][0]; credit = x.get('secondary_creator') or x.get('photographer') or ''
        third = bool(re.search(r'courtesy|©|copyright|getty|reuters|associated press', credit + ' ' + x.get('description', '')[:400], re.I))
        if third: continue
        out.append(dict(source='nasa', id=x['nasa_id'], title=x.get('title', '')[:90], licence='NASA media (not copyrighted; no logos, no endorsement)', licence_url='https://www.nasa.gov/nasa-brand-center/images-and-media/',
                        credit='NASA', page='https://images.nasa.gov/details/' + urllib.parse.quote(x['nasa_id'])))
    return out[:n]

def nasa_get(i):
    it = fetch('https://images-api.nasa.gov/search?' + urllib.parse.urlencode({'nasa_id': i}))['collection']['items']
    if not it: sys.exit(f'nasa:{i}: not found')
    files = fetch(urllib.parse.quote(it[0]['href'].replace('http://', 'https://'), safe=':/~'))
    mp4 = [f for f in files if f.lower().endswith('.mp4')]
    if not mp4: sys.exit(f'nasa:{i}: no mp4')
    pick = next((u for k in ('~orig', '~large', '~medium') for u in mp4 if k in u), mp4[0])
    return urllib.parse.quote(pick.replace('http://', 'https://'), safe=':/~%'), dict(licence='NASA media (not copyrighted; no logos, no endorsement)', licence_url='https://www.nasa.gov/nasa-brand-center/images-and-media/',
                                                                    title=i, credit='NASA', page='https://images.nasa.gov/details/' + urllib.parse.quote(i))

# ---------------------------------------------------------------- Wikimedia Commons
def commons_info(titles):
    p = dict(action='query', format='json', titles='|'.join(titles), prop='imageinfo', iiprop='url|extmetadata|size|mime')
    return fetch('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p))['query']['pages'].values()

def commons_row(pg):
    ii = pg['imageinfo'][0]; m = ii.get('extmetadata', {})
    lic = classify(m.get('LicenseShortName', {}).get('value', '') + ' ' + m.get('License', {}).get('value', ''))
    art = re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip()[:80]
    return lic, art, ii, m

def commons_search(q, n=8):
    p = dict(action='query', format='json', generator='search', gsrnamespace=6, gsrsearch=q + ' filetype:video', gsrlimit=n * 2, prop='imageinfo', iiprop='url|extmetadata|size|mime')
    pages = fetch('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p)).get('query', {}).get('pages', {}).values()
    out = []
    for pg in pages:
        lic, art, ii, m = commons_row(pg)
        if lic: out.append(dict(source='commons', id=pg['title'].replace('File:', ''), title=pg['title'][5:95], licence=lic, licence_url=m.get('LicenseUrl', {}).get('value'),
                                credit=(f'{art}, Wikimedia Commons ({lic})' if lic != 'Public domain / CC0' else None), page=ii['descriptionurl'], size=f"{ii.get('width')}x{ii.get('height')}"))
    return out[:n]

def commons_get(i):
    pg = list(commons_info(['File:' + i]))[0]
    lic, art, ii, m = commons_row(pg)
    if not lic: sys.exit(f'commons:{i}: licence not accepted')
    return ii['url'], dict(licence=lic, licence_url=m.get('LicenseUrl', {}).get('value'), title=i, credit=(f'{art}, Wikimedia Commons ({lic})' if lic != 'Public domain / CC0' else None), page=ii['descriptionurl'])

SRC = {'archive': (archive_search, archive_get), 'nasa': (nasa_search, nasa_get), 'commons': (commons_search, commons_get)}
LOG = os.path.join('media', 'licence_log.csv')
COLS = ['date', 'file', 'source', 'id', 'title', 'licence', 'licence_url', 'credit', 'page', 'proof']

def log_row(row):
    os.makedirs(os.path.dirname(LOG), exist_ok=True); new = not os.path.exists(LOG)
    with open(LOG, 'a', newline='') as f:
        w = csv.DictWriter(f, COLS); new and w.writeheader(); w.writerow({k: row.get(k, '') for k in COLS})

def main(a):
    if not a: sys.exit(__doc__)
    if a[0] == 'search':
        res = []
        for q in [x for x in a[2:] if x != '--any']:
            print('##', a[1], q)
            for r in SRC[a[1]][0](q):
                res.append(r); print(f"  {r['source']}:{r['id'][:60]:60s} {r['licence'][:22]:22s} {r['title'][:60]}")
        json.dump(res, open('openvideo_results.json', 'w'), indent=1)
    elif a[0] == 'get':
        d = a[a.index('--dir') + 1] if '--dir' in a else 'media/ov'; os.makedirs(d, exist_ok=True)
        for spec in [x for k, x in enumerate(a[1:], 1) if ':' in x and not x.startswith('--') and a[k - 1] not in ('--dir', '--start', '--len')]:
            src, i = spec.split(':', 1); url, meta = SRC[src][1](i)
            base = os.path.join(d, src + '_' + re.sub(r'[^A-Za-z0-9]+', '_', i)[:60]); raw = base + '.src'
            open(raw, 'wb').write(fetch(url, raw=True))
            cut = (['-ss', a[a.index('--start') + 1]] if '--start' in a else []) + (['-t', a[a.index('--len') + 1]] if '--len' in a else [])
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *cut, '-i', raw, '-an', '-vf', "scale='min(1920,iw)':-2", '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', base + '.mp4'], check=True)
            os.remove(raw)
            row = dict(date=datetime.date.today().isoformat(), file=base + '.mp4', source=src, id=i, **meta, proof='licence read from the source API at download')
            json.dump(row, open(base + '.licence.json', 'w'), indent=1); log_row(row)
            print(f"{base}.mp4  [{meta['licence']}]  credit: {meta.get('credit') or 'not required'}")
    elif a[0] == 'log':
        f = a[1]; o = {a[k][2:]: a[k + 1] for k in range(2, len(a) - 1, 2)}
        if not o.get('licence') or not o.get('proof'): sys.exit('log needs --licence and --proof (receipt, licence page or the written permission)')
        log_row(dict(date=datetime.date.today().isoformat(), file=f, source=o.get('source', 'user-supplied'), title=os.path.basename(f), licence=o['licence'], credit=o.get('credit', ''), proof=o['proof']))
        print('logged', f)
    else: sys.exit(__doc__)

if __name__ == '__main__': main(sys.argv[1:])
