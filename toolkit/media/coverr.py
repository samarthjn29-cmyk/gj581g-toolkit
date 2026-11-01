"""Coverr stock video (no API key): search and download free clips, with a licence-log row for each.

  coverr.py search "city street" ["term" ...]   -> prints id, duration, size, title; writes coverr_results.json
  coverr.py get <id> [...] [--dir media/cv]     -> downloads the 1080p mp4 to <dir>/coverr_<id>.mp4 and logs it

Coverr licence (coverr.co/license, read Oct 2026): free for commercial and non-commercial use, no attribution required
(credit appreciated); not for AI training or for building a competing service; Coverr holds model releases but does not
pass them on, and has no releases for brands, trademarks or landmarks (so: no recognisable logos on screen, as always).
Refused: premium items (Coverr+ only), vertical clips, and clips flagged AI-generated (an AI clip could be mistaken for
real footage of the events the video discusses)."""
import sys, os, json, datetime, urllib.request, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from openvideo import log_row
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124 Safari/537.36'}
LIC = 'Coverr license (free commercial use, no attribution required)'
api = lambda p: json.load(urllib.request.urlopen(urllib.request.Request('https://coverr.co/api/' + p, headers=UA), timeout=40))

def ok(h): return not h.get('is_premium') and not h.get('is_vertical') and not h.get('is_ai_generated') and h.get('aspect_ratio', '16:9') in ('16:9', '1.78:1')

def search(q, n=8):
    hits = api('videos?' + urllib.parse.urlencode({'query': q, 'page_size': 40}))['hits']
    return [dict(id=h['id'], title=h['title'], dur=float(h.get('duration') or 0), size=f"{h.get('max_width')}x{h.get('max_height')}") for h in hits if ok(h)][:n]

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == 'search':
        res = {}
        for q in a[1:]:
            res[q] = search(q); print('##', q)
            for r in res[q]: print(f"  {r['id']:12s} {r['dur']:5.1f}s {r['size']:10s} {r['title'][:70]}")
        json.dump(res, open('coverr_results.json', 'w'), indent=1)
    elif a[0] == 'get':
        d = a[a.index('--dir') + 1] if '--dir' in a else 'media/cv'; os.makedirs(d, exist_ok=True)
        for i in [x for k, x in enumerate(a[1:], 1) if not x.startswith('--') and a[k - 1] != '--dir']:
            h = api('videos/' + i)
            if not ok(h): print(f'{i}: refused (premium, vertical or AI-generated)'); continue
            url = h['urls']['mp4']; out = os.path.join(d, f'coverr_{i}.mp4')
            open(out, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180).read())
            log_row(dict(date=datetime.date.today().isoformat(), file=out, source='coverr', id=i, title=h['title'], licence=LIC,
                         licence_url='https://coverr.co/license', page='https://coverr.co/videos/' + h.get('slug', i), proof='is_premium=false, is_ai_generated=false (API)'))
            print(out, h['title'])
    else: sys.exit(__doc__)
