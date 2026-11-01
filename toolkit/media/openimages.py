"""Public-domain images with no API key: museum open-access collections and NASA. Search, licence check, download, log.

  openimages.py search <cleveland|met|nasa> "term" ["term" ...]   -> prints id, licence, size, date, title; writes openimages_results.json
  openimages.py get <source>:<id> [...] [--dir media/img]          -> re-checks the licence, downloads the largest image and adds a
                                                                      row to media/licence_log.csv (credit line included)
Sources:
  cleveland  Cleveland Museum of Art Open Access: only items marked CC0 (paintings, prints, photographs, objects; strong for
             history, everyday life, cities, portraits, science instruments). Credit appreciated: "Cleveland Museum of Art, CC0".
  met        The Met Open Access: only objects with isPublicDomain = true (CC0 images). Credit: "The Metropolitan Museum of Art".
  nasa       NASA Image and Video Library (photos): generally not copyrighted; no NASA logos or endorsement; items credited to
             ESA, other agencies, agencies or photographers outside NASA ('courtesy', '©', 'Getty') are skipped.
Not reachable from the workspace (bot protection) as of Oct 2026: Art Institute of Chicago, Library of Congress; DVIDS and the
Smithsonian need a free API key. Openverse (media/openverse.py) covers Creative Commons photos; Unsplash needs a key.
Old artworks are history, not footage of an event: label them on the slide like archive film ("Etching, 1516")."""
import sys, os, re, json, datetime, urllib.request, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from openvideo import log_row
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124 Safari/537.36 DeckedOutData/0.1'}
get_json = lambda u: json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40))
THIRD = re.compile(r'courtesy|©|copyright|getty|reuters|associated press|\bESA\b|JAXA|Roscosmos', re.I)

def cleveland_search(q, n=8):
    d = get_json('https://openaccess-api.clevelandart.org/api/artworks/?' + urllib.parse.urlencode({'q': q, 'cc0': 1, 'has_image': 1, 'limit': n}))['data']
    return [dict(source='cleveland', id=str(x['id']), title=x['title'], date=x.get('creation_date'), licence='CC0 (Cleveland Museum of Art Open Access)',
                 size=f"{(x['images'].get('print') or x['images']['web']).get('width')}x{(x['images'].get('print') or x['images']['web']).get('height')}") for x in d if x.get('share_license_status') == 'CC0']

def cleveland_get(i):
    x = get_json(f'https://openaccess-api.clevelandart.org/api/artworks/{i}')['data']
    if x.get('share_license_status') != 'CC0': sys.exit(f'cleveland:{i}: not CC0')
    img = x['images'].get('print') or x['images']['web']
    return img['url'], dict(title=f"{x['title']} ({x.get('creation_date')})", licence='CC0 (Cleveland Museum of Art Open Access)', licence_url='https://www.clevelandart.org/open-access',
                            credit='Cleveland Museum of Art, CC0', page=x.get('url'))

def met_search(q, n=8):
    ids = get_json('https://collectionapi.metmuseum.org/public/collection/v1.1/search?' + urllib.parse.urlencode({'q': q, 'hasImages': 'true', 'limit': 60}))['objectIDs'] or []
    out = []
    for i in ids:
        if len(out) >= n: break
        o = get_json(f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{i}')
        if o.get('isPublicDomain') and o.get('primaryImage'):
            out.append(dict(source='met', id=str(i), title=o['title'], date=o.get('objectDate'), licence='Public domain (Met Open Access, CC0)', size=''))
    return out

def met_get(i):
    o = get_json(f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{i}')
    if not (o.get('isPublicDomain') and o.get('primaryImage')): sys.exit(f'met:{i}: not public domain or no image')
    return o['primaryImage'], dict(title=f"{o['title']} ({o.get('objectDate')}), {o.get('artistDisplayName') or 'unknown artist'}", licence='Public domain (Met Open Access, CC0)',
                                   licence_url='https://www.metmuseum.org/policies/image-resources', credit='The Metropolitan Museum of Art', page=o.get('objectURL'))

def nasa_search(q, n=8):
    items = get_json('https://images-api.nasa.gov/search?' + urllib.parse.urlencode({'q': q, 'media_type': 'image'}))['collection']['items']
    out = []
    for it in items:
        x = it['data'][0]; cr = ' '.join(str(x.get(k, '')) for k in ('secondary_creator', 'photographer', 'center'))
        if THIRD.search(cr + ' ' + x.get('description', '')[:400]): continue
        out.append(dict(source='nasa', id=x['nasa_id'], title=x.get('title', ''), date=x.get('date_created', '')[:10], licence='NASA media (not copyrighted; no logos, no endorsement)', size=''))
        if len(out) >= n: break
    return out

def nasa_get(i):
    it = get_json('https://images-api.nasa.gov/search?' + urllib.parse.urlencode({'nasa_id': i}))['collection']['items']
    if not it: sys.exit(f'nasa:{i}: not found')
    files = get_json(urllib.parse.quote(it[0]['href'].replace('http://', 'https://'), safe=':/~'))
    jpg = [f for f in files if f.lower().endswith(('.jpg', '.png', '.tif'))]
    pick = next((u for k in ('~orig.jpg', '~large', '~medium') for u in jpg if k in u), jpg[0])
    return urllib.parse.quote(pick.replace('http://', 'https://'), safe=':/~%'), dict(title=it[0]['data'][0].get('title', i), licence='NASA media (not copyrighted; no logos, no endorsement)',
                                                                                 licence_url='https://www.nasa.gov/nasa-brand-center/images-and-media/', credit='NASA', page='https://images.nasa.gov/details/' + urllib.parse.quote(i))

SRC = {'cleveland': (cleveland_search, cleveland_get), 'met': (met_search, met_get), 'nasa': (nasa_search, nasa_get)}

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == 'search':
        res = []
        for q in a[2:]:
            print('##', a[1], q)
            for r in SRC[a[1]][0](q): res.append(r); print(f"  {r['source']}:{r['id'][:40]:40s} {r['size']:10s} {str(r['date'])[:12]:12s} {r['title'][:60]}")
        json.dump(res, open('openimages_results.json', 'w'), indent=1)
    elif a[0] == 'get':
        d = a[a.index('--dir') + 1] if '--dir' in a else 'media/img'; os.makedirs(d, exist_ok=True)
        for spec in [x for k, x in enumerate(a[1:], 1) if ':' in x and a[k - 1] != '--dir']:
            src, i = spec.split(':', 1); url, meta = SRC[src][1](i)
            ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower() or '.jpg'
            out = os.path.join(d, f"{src}_{re.sub(r'[^A-Za-z0-9]+', '_', i)[:50]}{ext}")
            open(out, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180).read())
            log_row(dict(date=datetime.date.today().isoformat(), file=out, source=src, id=i, proof='licence flag read from the source API at download', **meta))
            print(out, '|', meta['title'][:70], '|', meta['credit'])
    else: sys.exit(__doc__)
