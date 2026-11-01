"""Openverse image search (Creative Commons photos, commercial-use licences only). Usage: openverse.py "query" [...]. Credit author + licence; avoid NC/ND."""
import sys, json, urllib.parse, urllib.request
def search(q, n=8, extra=None):
    p = dict(q=q, license_type='commercial', page_size=n, mature='false')
    if extra: p.update(extra)
    u = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode(p)
    d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'DeckedOutData/0.1'}), timeout=30))
    return d['results']
if __name__ == '__main__':
    for q in sys.argv[1:]:
        print('##', q)
        for r in search(q):
            print(f"  {r['id'][:8]} {r['license']}{r['license_version'] or ''} {r.get('width')}x{r.get('height')} {r['source']:10s} {r['title'][:55]!r} | {(r.get('creator') or '')[:25]} | {r['url'][:90]}")
