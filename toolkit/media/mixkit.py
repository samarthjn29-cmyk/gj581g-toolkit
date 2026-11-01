"""Mixkit stock video: search (Free License only) and download.

  mixkit.py search "term" ["term" ...]      -> prints id, licence, title; writes mixkit_results.json
  mixkit.py get <id|item URL> [...] [--dir mk] -> ids must come from a previous search (mixkit_results.json); checks the item is Free License, downloads the best mp4 (1080p, else 720p) to <dir>/<id>.mp4

Licence: data-license="videoFree" = Mixkit Free License (commercial use incl. monetised YouTube, no credit required).
"videoRestricted" = non-commercial only: never used (get refuses it). Newer items (ids ~99000+) only expose
assets.mixkit.co/active_storage/video_items/<id>/<stamp>/<id>-video-720.mp4, so URLs are always read from the item page."""
import sys, re, json, subprocess, html, os
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36'
get = lambda u: subprocess.run(['curl', '-sL', '-A', UA, '--max-time', '30', u], capture_output=True, text=True).stdout

def item(path):
    """path: an item page path or URL, e.g. /free-stock-video/busy-street-in-the-city-4000/"""
    path = re.sub(r'^https?://mixkit\.co', '', path)
    vid = re.search(r'-(\d+)/?$', path).group(1)
    p = get('https://mixkit.co' + path)
    lics = set(re.findall(r'data-license="(videoFree|videoRestricted)"', p))
    lic = 'free' if lics == {'videoFree'} else ('restricted' if 'videoRestricted' in lics else '?')
    title = html.unescape(re.search(r'<title>([^<]*)', p).group(1)).split(' - ')[0].strip() if '<title>' in p else ''
    urls = sorted(set(re.findall(r'https://assets\.mixkit\.co/[^"\']*?' + vid + r'[^"\']*?\.mp4', p)))
    return dict(id=vid, title=title, license=lic, page='https://mixkit.co' + path, urls=urls)

def search(term, n=6):
    slug = re.sub(r'[^a-z0-9]+', '-', term.lower()).strip('-')
    page = get(f'https://mixkit.co/free-stock-video/{slug}/')
    paths = list(dict.fromkeys(re.findall(r'href="(/free-stock-video/[a-z0-9-]+-\d+/)"', page)))
    out = []
    for p in paths[:n * 2]:
        out.append(item(p))
        if len([o for o in out if o['license'] == 'free']) >= n: break
    return out

def best(urls):
    for q in ('-1080.mp4', '-video-1080.mp4', '-720.mp4', '-video-720.mp4', '-360.mp4', '-video-360.mp4'):
        for u in urls:
            if u.endswith(q): return u
    return urls[0] if urls else None

if __name__ == '__main__':
    cmd, rest = sys.argv[1], sys.argv[2:]
    if cmd == 'search':
        res = {t: search(t) for t in rest}
        json.dump(res, open('mixkit_results.json', 'w'), indent=1)
        for t, rs in res.items():
            print('##', t)
            for r in rs: print(f"  {r['id']:7s} {r['license']:10s} {r['title'][:60]!r}")
    elif cmd == 'get':
        d = 'mk'
        if '--dir' in rest: i = rest.index('--dir'); d = rest[i + 1]; del rest[i:i + 2]
        os.makedirs(d, exist_ok=True)
        known = {}
        if os.path.exists('mixkit_results.json'):
            for rs in json.load(open('mixkit_results.json')).values():
                for r in rs: known[r['id']] = r
        for vid in rest:
            if vid.startswith('http') or vid.startswith('/'): r = item(vid); vid = r['id']
            elif vid in known: r = known[vid]
            else: print(vid, 'unknown id: run search first or pass the item page URL'); continue
            if r['license'] != 'free': print(vid, 'SKIPPED: licence', r['license']); continue
            u = best(r['urls'])
            # 1080p is often published but not linked: try it before falling back
            for cand in ([u.replace('-720.mp4', '-1080.mp4')] if u and u.endswith('-720.mp4') else []) + [u]:
                if cand and subprocess.run(['curl', '-sfL', '-A', UA, '-o', f'{d}/{vid}.mp4', cand]).returncode == 0: break
            print(vid, r['title'][:50], '->', f'{d}/{vid}.mp4', r['page'])
