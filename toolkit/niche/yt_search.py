import re, json, sys, urllib.parse, subprocess, csv
def search(q):
    u = 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(q) + '&hl=en&gl=US'
    s = subprocess.run(['curl','-s','-m','25','-H','Accept-Language: en-US','-b','CONSENT=YES+1',u],capture_output=True,text=True).stdout
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', s)
    if not m: return []
    d = json.loads(m.group(1)); out = []
    def walk(o):
        if isinstance(o, dict):
            if 'videoRenderer' in o:
                v = o['videoRenderer']
                t = ''.join(r.get('text','') for r in v.get('title',{}).get('runs',[]))
                vc = (v.get('viewCountText') or {}).get('simpleText','')
                n = int(re.sub(r'\D','',vc) or 0)
                out.append(dict(q=q, id=v.get('videoId'), title=t, views=n, age=(v.get('publishedTimeText') or {}).get('simpleText',''),
                                channel=''.join(r.get('text','') for r in v.get('ownerText',{}).get('runs',[])), curl=((v.get('ownerText',{}).get('runs') or [{}])[0].get('navigationEndpoint',{}).get('browseEndpoint',{}).get('canonicalBaseUrl','')), length=(v.get('lengthText') or {}).get('simpleText','')))
                return
            for x in o.values(): walk(x)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(d); return out
if __name__ == "__main__":
    rows = []
    for q in [l.strip() for l in open(sys.argv[1]) if l.strip()]:
        r = search(q)[:20]; rows += r; print(q, len(r), file=sys.stderr)
    w = csv.DictWriter(open(sys.argv[2],'w',newline=''), fieldnames=['q','id','title','views','age','channel','curl','length']); w.writeheader(); w.writerows(rows)
