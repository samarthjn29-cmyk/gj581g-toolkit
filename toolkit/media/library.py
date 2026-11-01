"""Reusable media library (toolkit 2.0): an index of every clip and photo already vetted for a Decked out Data video, so the
next video can reuse it instead of searching again. It stores WHERE an asset came from (source, id, page, licence, proof)
and what it shows, not the file itself: files are re-downloaded by id when needed, so the toolkit stays small.

  library.py seed <licence_log.csv> --project NAME [--manifest media/prepared/manifest.json]
        add every row of a project's licence log (skips duplicates; marks the asset used in NAME)
  library.py add --source mixkit --id 4747 --title "Scientist walking down a corridor" --licence "Mixkit Free License"
        [--page URL] [--tags "lab,corridor,science"] [--file media/mk/4747.mp4] [--kind video|photo] [--note "..."]
        (with --file: resolution, duration and the first-second check are measured)
  library.py search office night [--kind video] [--min-w 1920]     -> matching assets, best first, with where they were used
  library.py fetch <key> [--dir media/lib]                          -> re-downloads with the right fetcher, re-checking the licence
  library.py used <key> --project NAME                              -> mark as used (keeps a channel-wide record of repeats)
  library.py tag <key> "tag1,tag2"

Index: media/library.json in the toolkit (key = source:id). Rules: only assets whose licence was read from the source at
download go in (never Adobe Stock paid items, never YouTube/TikTok/Instagram/news unless the user supplied the licence);
avoid reusing the same hero clip in two consecutive videos (search shows used_in)."""
import sys, os, json, csv, re, subprocess, argparse, datetime
TK = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('MEDIA_LIBRARY', os.path.join(TK, 'library.json'))
load = lambda: json.load(open(LIB)) if os.path.exists(LIB) else {}
def save(L): json.dump(L, open(LIB, 'w'), indent=1, ensure_ascii=False, sort_keys=True)

def probe(path):
    try:
        r = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration',
                                       '-of', 'json', path], capture_output=True, text=True).stdout)
        st = r['streams'][0]; info = dict(w=st['width'], h=st['height'], dur=round(float(r['format'].get('duration', 0)), 1))
        # first-second check: does the first second differ from the middle (no black/static title card at the start)?
        y = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-t', '1', '-vf', 'signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
        ys = [float(v) for v in re.findall(r'YAVG=([\d.]+)', y)]
        info['first_second'] = 'black' if ys and max(ys) < 20 else 'ok'
        return info
    except Exception: return {}

def classify_row(r):
    src, title = r.get('source', ''), r.get('title', '')
    m = re.match(r'Mixkit #(\d+) \((.*)\)', src)
    if m: return 'mixkit', m.group(1), m.group(2)
    m = re.match(r'Unsplash (\S+) by (.*?) \((.*)\)', src)
    if m: return 'unsplash', m.group(1), m.group(3)
    m = re.match(r'"?Adobe Stock #(\d+)', src)
    if m: return 'adobe-free', m.group(1), src
    if src.startswith('Original'): return 'own', os.path.basename(r.get('file', '')) or src, src
    if src in ('archive', 'nasa', 'commons', 'coverr', 'pexels', 'pixabay'): return src, r.get('id', ''), title
    return re.sub(r'\W+', '-', src.lower())[:20] or 'other', r.get('id') or os.path.basename(r.get('file', '')), title or src

def cmd_seed(a):
    L = load(); n = 0; base = os.path.dirname(os.path.abspath(a.log)); proj_root = os.path.dirname(base)
    man = json.load(open(a.manifest)) if a.manifest and os.path.exists(a.manifest) else {}
    for r in csv.DictReader(open(a.log)):
        src, i, title = classify_row(r)
        if src == 'own': continue   # project-specific animations are not reusable stock
        if 'not yet used' in (r.get('source', '') + r.get('title', '')): continue
        key = f'{src}:{i}'; e = L.get(key) or {}
        f = os.path.join(proj_root, r.get('file', '')) if r.get('file') else ''
        e.update({k: v for k, v in dict(source=src, id=i, title=title, licence=r.get('licence', ''), licence_url=r.get('licence_url', ''),
                  credit=r.get('credit', ''), page=r.get('page', ''), proof=r.get('proof', ''), added=e.get('added') or r.get('date', '')).items() if v or k not in e})
        e['kind'] = 'photo' if src == 'unsplash' or re.search(r'\.(jpe?g|png|webp)$', f, re.I) else 'video'
        if f and os.path.exists(f) and 'w' not in e: e.update(probe(f) if e['kind'] == 'video' else {})
        e.setdefault('tags', sorted(set(w for w in re.findall(r'[a-z]{4,}', title.lower()) if w not in {'with', 'from', 'that', 'part', 'view', 'down'})))
        e['used_in'] = sorted(set(e.get('used_in', []) + [a.project]))
        slides = [m['slide'] for m in man.values() if r.get('file') and os.path.basename(r['file']).split('.')[0] in json.dumps(m)]
        if slides: e.setdefault('notes', f'{a.project}: slide {slides[0]}')
        if key not in L: n += 1
        L[key] = e
    save(L); print(f'{n} new assets ({len(L)} in the library: {LIB})')

def cmd_add(a):
    L = load(); key = f'{a.source}:{a.id}'; e = L.get(key, {})
    e.update(source=a.source, id=a.id, title=a.title, licence=a.licence, page=a.page or e.get('page', ''), kind=a.kind,
             tags=sorted(set(e.get('tags', []) + [t.strip().lower() for t in (a.tags or '').split(',') if t.strip()])),
             added=e.get('added') or datetime.date.today().isoformat(), used_in=e.get('used_in', []))
    if a.note: e['notes'] = a.note
    if a.file and os.path.exists(a.file) and a.kind == 'video': e.update(probe(a.file))
    L[key] = e; save(L); print('saved', key, {k: e.get(k) for k in ('w', 'h', 'dur', 'first_second')})

def cmd_search(a):
    L = load(); q = [w.lower() for w in a.terms]
    def score(e):
        hay = ' '.join([e.get('title', ''), ' '.join(e.get('tags', [])), e.get('notes', '')]).lower()
        return sum(2 if w in e.get('tags', []) else 1 for w in q if w in hay)
    hits = [(score(e), k, e) for k, e in L.items() if (not a.kind or e.get('kind') == a.kind) and e.get('w', 9999) >= a.min_w]
    hits = sorted([h for h in hits if h[0] > 0], key=lambda h: (-h[0], len(h[2].get('used_in', []))))
    for s, k, e in hits[:a.n]:
        res = f"{e.get('w')}x{e.get('h')} {e.get('dur')}s" if e.get('w') else ''
        print(f"{k:28} {e.get('title', '')[:58]:58} {res:16} used: {', '.join(e.get('used_in', [])) or '-'}  [{e.get('licence', '')[:30]}]")
    if not hits: print('no match: search the sources (decked-out-media) and add what you vet')

def cmd_fetch(a):
    L = load(); e = L.get(a.key) or sys.exit(f'{a.key} is not in the library'); os.makedirs(a.dir, exist_ok=True)
    s, i = e['source'], e['id']
    if s in ('archive', 'nasa', 'commons'): cmd = ['python3', f'{TK}/openvideo.py', 'get', f'{s}:{i}', '--dir', a.dir]
    elif s == 'mixkit': cmd = ['python3', f'{TK}/mixkit.py', 'get', e.get('page') or i, '--dir', a.dir]
    elif s == 'coverr': cmd = ['python3', f'{TK}/coverr.py', 'get', i, '--dir', a.dir]
    elif s == 'unsplash': print(f'Unsplash photo {i}: download with the Unsplash connector (download_asset, id {i}), credit "{e.get("credit") or e.get("title")}"'); return
    else: print(f'{a.key}: re-download from {e.get("page") or "its source"} ({e.get("licence")})'); return
    r = subprocess.run(cmd);
    if r.returncode == 0: print('fetched; the licence was re-checked by the fetcher. Add the row to this project\'s licence_log.csv.')
    elif s == 'mixkit' and not e.get('page'): print('mixkit.py needs the id in a recent search: run mixkit.py search "' + e.get('title', '') + '" first')

def cmd_used(a):
    L = load(); e = L[a.key]; e['used_in'] = sorted(set(e.get('used_in', []) + [a.project])); save(L); print(a.key, e['used_in'])
def cmd_tag(a):
    L = load(); e = L[a.key]; e['tags'] = sorted(set(e.get('tags', []) + [t.strip().lower() for t in a.tags.split(',')])); save(L); print(a.key, e['tags'])

ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
p = sp.add_parser('seed'); p.add_argument('log'); p.add_argument('--project', required=True); p.add_argument('--manifest')
p = sp.add_parser('add')
for k in ['source', 'id', 'title', 'licence']: p.add_argument(f'--{k}', required=True)
for k in ['page', 'tags', 'file', 'note']: p.add_argument(f'--{k}')
p.add_argument('--kind', default='video')
p = sp.add_parser('search'); p.add_argument('terms', nargs='+'); p.add_argument('--kind'); p.add_argument('--min-w', type=int, default=0); p.add_argument('-n', type=int, default=15)
p = sp.add_parser('fetch'); p.add_argument('key'); p.add_argument('--dir', default='media/lib')
p = sp.add_parser('used'); p.add_argument('key'); p.add_argument('--project', required=True)
p = sp.add_parser('tag'); p.add_argument('key'); p.add_argument('tags')
a = ap.parse_args(); globals()[f'cmd_{a.cmd}'](a)
