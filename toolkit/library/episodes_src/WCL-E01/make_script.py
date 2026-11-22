"""Build WCL-E01 script JSON + ElevenLabs blocks from WCL-E01_script_v1.txt.
Usage: python3 make_script.py [src.txt]  -> WCL-E01_script_v1.json, WCL-E01_eleven.md, prints word counts.
Pause tags (styles/HANDS_SCRIPT_STYLE.md): [long pause] after a question, a short sentence (4 words or fewer)
and every paragraph end; [short pause] between other sentences. Inline tags ([deadpan] etc.) are kept for ElevenLabs
and stripped from `text` (captions, fact-check)."""
import re, json, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'WCL-E01_script_v2.txt'
ver = re.search(r'_v(\d+)', src).group(1)
TAG = re.compile(r'\[[a-z\- ,]+\]')
acts, cur, par = [], None, None
for raw in open(src, encoding='utf-8'):
    line = raw.rstrip('\n')
    if line.startswith('#') or not line.strip(): continue
    if line.startswith('== '):
        n, f, t = [x.strip() for x in line[3:].split('|')]
        cur = {'act': int(n), 'file': f + '.mp3', 'title': t, 'paras': []}; acts.append(cur); continue
    k, v = line[:2], line[2:].strip()
    if k == 'V:': par = {'voice': v}; cur['paras'].append(par)
    elif k == 'S:': par['screen'] = v
    elif k == 'C:': par['claims'] = [] if v == '-' else [c.strip() for c in v.split(',')]

def sentences(s):
    return [x for x in re.split(r'(?:(?<=[.?!])|(?<=[.?!]["”]))\s+(?=[A-Z"“\[])', s) if x.strip()]

def eleven(voice):
    out = []
    for sent in sentences(voice):
        plain = TAG.sub('', sent).strip()
        if not plain: out.append(sent.strip()); continue
        n = len(re.findall(r"[A-Za-z0-9'-]+", plain))
        pause = '[long pause]' if plain.rstrip('"”').endswith('?') or n <= 4 else '[short pause]'
        out.append(f'{sent.strip()} {pause}')
    s = ' '.join(out)
    s = re.sub(r'\[short pause\]\s*$', '[long pause]', s)
    if not s.rstrip().endswith('[long pause]'):
        # paragraph ends on an inline tag: put the long pause before it
        m = re.search(r'(\[[a-z\- ]+\])\s*$', s)
        if m: s = s[:m.start()].rstrip()
        s = re.sub(r'\[(short|long) pause\]\s*$', '', s).rstrip() + ' [long pause]' + (' ' + m.group(1) if m else '')
    return s

lines, total = [], 0
for a in acts:
    w = 0
    for i, p in enumerate(a['paras'], 1):
        text = re.sub(r'\s+', ' ', TAG.sub('', p['voice'])).strip()
        p['text'] = text; p['eleven'] = eleven(p['voice']); p['id'] = f"a{a['act']}-{i:02d}"
        nw = len(re.findall(r"[A-Za-z0-9'-]+", text)); w += nw
        lines.append({'id': p['id'], 'scene': a['act'], 'text': text, 'src': p.get('claims', []), 'screen': p.get('screen', '')})
    a['words'] = w; total += w
    print(f"act {a['act']} {a['title']:<28} {w:5d} words  ~{w/145:4.1f} min at 145 wpm")
print(f"total {total} words  ~{total/145:.1f} min at 145 wpm, ~{total/140:.1f} at 140")
json.dump({'episode': 'WCL-E01', 'title': 'The Man Who Saw Pink', 'lines': lines}, open(f'WCL-E01_script_v{ver}.json', 'w'), indent=1, ensure_ascii=False)
json.dump(acts, open(f'WCL-E01_acts_v{ver}.json', 'w'), indent=1, ensure_ascii=False)
with open(f'WCL-E01_eleven_v{ver}.md', 'w') as f:
    for a in acts:
        f.write(f"## {a['act']}. {a['title']} ({a['file']})\n\n" + '\n\n'.join(p['eleven'] for p in a['paras']) + '\n\n')
