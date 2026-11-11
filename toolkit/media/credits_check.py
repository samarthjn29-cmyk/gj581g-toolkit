#!/usr/bin/env python3
"""Credit check: pictures used  vs  licence log  vs  description credit line.

usage: credits_check.py STILLS_DIR LICENCE_LOG.csv PACKAGING.md [--extra R_a.jpg,R_b.jpg]

- Every image named in an "img" field of STILLS_DIR/*.json (backups *_pre_*.json skipped)
  is collected. Real pictures are named R_<what>.<ext>; anything else is an AI still.
- FAIL: a real picture with no licence-log row naming it in `used_in`.
- FAIL: a log row whose licence needs attribution (CC BY / CC BY-SA, any version) whose
  author is not named in the description (the ``` block in PACKAGING.md).
- FAIL: AI stills used but no AI disclosure line in the description.
- WARN: public-domain / CC0 / Unsplash rows whose author is not named (credit is courtesy).
- WARN: log rows that no plan uses any more (stale, or spare).
Exit 1 on any FAIL. Written after Scrolls (9 Nov 2026): 4 used pictures had no log row and
2 credits were missing from the description on upload day.
"""
import csv, glob, json, os, re, sys


MEDIA = re.compile(r'\.(jpe?g|png|webp|gif|mp4|webm|mov|mp3|wav)$', re.I)
AI_PREFIX = ('G_', 'A_')   # AI stills and their animations (Zeigarnik naming); everything else needs a log row


def imgs_in(obj, out):
    """Every media file a plan uses: any string value that ends in a media extension, under any key
    (img, vid, clip, ...). Zeigarnik (11 Nov 2026): the old img-only scan missed every V_/F_/U_ stock clip."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str) and MEDIA.search(v):
                out.add(os.path.basename(v))
            else:
                imgs_in(v, out)
    elif isinstance(obj, list):
        for v in obj:
            imgs_in(v, out)


def description(md):
    s = open(md, encoding='utf-8').read()
    m = re.search(r'## 3\. Description\s*```(.*?)```', s, re.S) or re.search(r'```(.*?)```', s, re.S)
    return m.group(1) if m else s


def author_keys(a):
    """Words that must appear for this author: first author's surname, or a user name."""
    q = re.search(r'user\s+["\u201c](.+?)["\u201d]', a)
    if q:
        return [q.group(1)]
    a = re.sub(r'\(.*?\)', '', a).strip()
    first = re.split(r',| and | / |;', a)[0].strip()
    first = re.sub(r'\bet al\.?', '', first).strip()
    if not first:
        return []
    words = first.split()
    return [words[-1]] if len(words) > 1 and not first.startswith('User') else [first]


def main(a):
    if len(a) < 3:
        print(__doc__); return 2
    stills, log, pack = a[:3]
    extra = set()
    if '--extra' in a:
        extra = set(a[a.index('--extra') + 1].split(','))
    used = set(extra)
    for f in sorted(glob.glob(os.path.join(stills, '*.json'))):
        if '_pre_' in os.path.basename(f):
            continue
        try:
            imgs_in(json.load(open(f, encoding='utf-8')), used)
        except Exception as e:
            print(f'WARN  {f}: unreadable ({e})')
    ai = sorted(u for u in used if u.startswith(AI_PREFIX))
    real = sorted(u for u in used if not u.startswith(AI_PREFIX))
    rows = list(csv.DictReader(open(log, encoding='utf-8')))
    desc = description(pack)
    dl = desc.lower()
    fails = warns = 0

    stem = lambda n: os.path.splitext(n)[0]
    matched = set()
    for r in real:
        pat = re.compile(r'(?<![\w])' + re.escape(stem(r)) + r'(?![\w])')
        hits = [i for i, row in enumerate(rows) if any(pat.search(v or '') for v in row.values() if isinstance(v, str))]
        if not hits:
            print(f'FAIL  {r}: used in a plan, no licence-log row names it'); fails += 1
        matched.update(hits)

    for i, row in enumerate(rows):
        if row.get(None) or (not row.get('licence') and any(x in ' '.join(str(v) for v in row.values()).upper() for x in ('CC BY', 'CC0', 'PUBLIC DOMAIN', 'LICENCE', 'LICENSE'))):
            print(f'WARN  log row "{row.get("file")}": columns look shifted (licence not in the licence column); fix the row'); warns += 1
        lic = (row.get('licence') or '').upper()
        auth = row.get('author_credit') or ''
        keys = author_keys(auth)
        named = all(k.lower() in dl for k in keys) if keys else True
        needs = 'CC BY' in lic or 'CC-BY' in lic
        if i not in matched and 'AI' not in (row.get('file') or ''):
            print(f'WARN  log row "{row.get("file")}" is not used by any plan (spare or stale)'); warns += 1
            continue
        if needs and not named:
            print(f'FAIL  {row.get("file")}: {lic} needs "{auth}" named in the description'); fails += 1
        elif not named and auth and 'adobe stock contributor' not in auth.lower():
            print(f'WARN  {row.get("file")}: {lic or "no licence"}, "{auth}" not named (courtesy)'); warns += 1

    if ai and not re.search(r'ai-generated|ai generated', dl):
        print(f'FAIL  {len(ai)} AI stills used but no AI disclosure line in the description'); fails += 1

    print(f'\n{len(real)} real/stock files, {len(ai)} AI stills, {len(rows)} log rows: {fails} FAIL, {warns} WARN')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
