#!/usr/bin/env python3
"""Daily alert check (3 Nov 2026): stays silent unless something big moved.
  python3 alert.py [watchlist.json] [reports_dir]   -> prints ALERT lines (and writes reports_dir/alerts/<date>.md), or "NO ALERT"
Checks:
  * currencies (ECB daily reference rates, converted to units per US dollar; the dollar itself is read against the euro):
    a 1-day move >= move_1d_pct, a 5-day move >= move_5d_pct, or a new 52-week high/low;
  * news in the last 24 hours (Google News) matching an alert phrase;
  * a scheduled event from calendar.json happening tomorrow (a heads-up, not an alert on its own)."""
import sys, os, json, csv, io, time, subprocess, urllib.parse, datetime as dt, xml.etree.ElementTree as ET
D = os.path.dirname(os.path.abspath(__file__))
W = json.load(open(sys.argv[1] if len(sys.argv) > 1 else f'{D}/watchlist.json')); A = W['alerts']
REP = sys.argv[2] if len(sys.argv) > 2 else f'{D}/reports'
get = lambda u: subprocess.run(['curl', '-s', '-m', '30', '-A', 'Mozilla/5.0', u], capture_output=True, text=True).stdout
cur = [c for c in A['currencies'] if c != 'EUR']
import zipfile, tempfile
S = {}
zp = tempfile.mktemp(suffix='.zip'); subprocess.run(['curl', '-s', '-m', '60', '-o', zp, 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.zip'])
try:
    rows = list(csv.DictReader(io.StringIO(zipfile.ZipFile(zp).read('eurofxref-hist.csv').decode())))[:400]  # newest first
    for r in rows:
        for c in cur:
            try: S.setdefault(c, {})[r['Date']] = float(r[c])
            except (ValueError, KeyError): pass
except Exception: pass
alerts, notes = [], []
if 'USD' in S:
    days = sorted(S['USD'])
    def per_usd(c, d): return S['USD'][d] if c == 'EUR' else S[c][d] / S['USD'][d]  # EUR: dollars per euro; others: units per dollar
    for c in ['EUR'] + [c for c in cur if c != 'USD']:
        ds = [d for d in days if c == 'EUR' or d in S.get(c, {})]
        if len(ds) < 6: continue
        x = [per_usd(c, d) for d in ds]; last = x[-1]
        m1 = (last / x[-2] - 1) * 100; m5 = (last / x[-6] - 1) * 100; yr = x[-260:]
        label = 'USD per EUR' if c == 'EUR' else f'{c} per USD'
        if abs(m1) >= A['move_1d_pct']: alerts.append(f'{label}: {m1:+.1f}% in a day ({ds[-1]}: {last:.4g})')
        if abs(m5) >= A['move_5d_pct']: alerts.append(f'{label}: {m5:+.1f}% in 5 days ({ds[-1]}: {last:.4g})')
        # 52-week extremes only on the first breach in a week (a steadily sliding currency sets new highs most days; daily repeats are noise)
        hi_before, lo_before = max(x[-265:-1]), min(x[-265:-1])
        if last > hi_before and max(x[-6:-1]) <= max(x[-265:-6]): alerts.append(f'{label}: 52-week HIGH {last:.4g} ({ds[-1]})' + ('' if c == 'EUR' else f': the {c} is at its weakest against the dollar in a year'))
        elif last < lo_before and min(x[-6:-1]) >= min(x[-265:-6]): alerts.append(f'{label}: 52-week LOW {last:.4g} ({ds[-1]})' + ('' if c == 'EUR' else f': the {c} is at its strongest against the dollar in a year'))
else: notes.append('ECB rates could not be read today')
for ph in A['news_phrases']:
    try: root = ET.fromstring(get(f'https://news.google.com/rss/search?q={urllib.parse.quote(chr(34) + ph + chr(34))}+when:1d&hl=en-US&gl=US&ceid=US:en'))
    except ET.ParseError: continue
    for it in [i for i in root.iter('item') if all(w in (i.findtext('title') or '').lower() for w in ph.lower().split())][:3]:  # every word of the phrase in the headline
        alerts.append(f"news '{ph}': {it.findtext('title')} ({(it.findtext('pubDate') or '')[:16]}) {it.findtext('link')}")
tom = (dt.date.today() + dt.timedelta(days=1)).isoformat()
cal = json.load(open(f'{D}/calendar.json'))['events'] if os.path.exists(f'{D}/calendar.json') else []
notes += [f"tomorrow: {e['region']} {e['name']}" for e in cal if e['date'] == tom]
if alerts:
    os.makedirs(f'{REP}/alerts', exist_ok=True)
    open(f"{REP}/alerts/{time.strftime('%Y-%m-%d')}.md", 'w').write('\n'.join(['# Alerts ' + time.strftime('%d %b %Y')] + [f'- {a}' for a in alerts] + [f'- ({n})' for n in notes]) + '\n')
    print('\n'.join('ALERT ' + a for a in alerts))
else: print('NO ALERT')
for n in notes: print('note:', n)
