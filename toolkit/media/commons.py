"""Wikimedia Commons image search with licence and author. Usage: commons.py "query" [...]. May be rate-limited (HTTP 429) on shared connections."""
import sys, json, urllib.parse, urllib.request, re
UA = {'User-Agent': 'DeckedOutDataBot/0.1 (research video; contact via channel)'}
def search(q, n=8):
    p = dict(action='query', format='json', generator='search', gsrnamespace=6, gsrsearch=q + ' filetype:bitmap', gsrlimit=n,
             prop='imageinfo', iiprop='url|extmetadata|size|mime', iiurlwidth=1920)
    u = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p)
    d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30))
    out = []
    for pg in d.get('query', {}).get('pages', {}).values():
        ii = pg['imageinfo'][0]; m = ii.get('extmetadata', {})
        lic = m.get('LicenseShortName', {}).get('value', '')
        art = re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', ''))[:60]
        out.append((pg['title'], ii['width'], ii['height'], lic, art, ii.get('thumburl') or ii['url'], ii['descriptionurl']))
    return out
if __name__ == '__main__':
    for q in sys.argv[1:]:
        print('##', q)
        for r in search(q):
            print(f"  {r[3]:14s} {r[1]}x{r[2]} {r[0][:70]} | {r[4]}")
