#!/usr/bin/env python3
"""Gag pass for a GJ 581g chapter (12 Nov 2026): writer -> judge -> shortlist -> reel -> Sam's ratings -> taste file.
  gag_pass.py pack  SCRIPT.json SCENE OUTDIR [--timing T.json] [--schools a,b] [--nogag id,id] [--taste F] [--every 50]
        writes OUTDIR/pack.md (+ pack.json): lines with times, slots, banned lines, allowed cards and sounds, taste, used log.
        Then a fresh writer agent follows gags/WRITER.md -> OUTDIR/candidates.json
  gag_pass.py check OUTDIR          validates candidates.json against the pack (ids, slots, banned lines, kinds, sounds, caption length)
        Then a separate judge agent (a different model) follows gags/JUDGE.md -> OUTDIR/scores.json
  gag_pass.py pick  OUTDIR [--keep 2]   merges scores, rejects untrue/unclear, ranks per slot -> OUTDIR/shortlist.md + shortlist.json
  gag_pass.py log   OUTDIR VIDEO ID:verdict ...   records Sam's 👍/👎 (verdict up|down|placed) in gags/GAGS_USED.csv
Timing: Sam's timing.json when it exists, otherwise estimated at 150 words a minute plus 0.4 s between lines."""
import json, sys, os, re, csv, argparse, datetime
HERE = os.path.dirname(os.path.abspath(__file__)); TK = os.path.dirname(HERE)
USED = os.path.join(HERE, 'GAGS_USED.csv')
USED_COLS = ['date', 'video', 'line', 'id', 'kind', 'twist', 'spice', 'picture', 'caption', 'sound', 'verdict']
NO_CRUDE = {'fart', 'fart_long'}        # Sam 12 Nov 2026: crude sound 👎

def fxlib():
    """The effects library (stills/fxlib.py, every built card with its plan and paired sound) as data, without running its main."""
    src = open(os.path.join(TK, 'stills', 'fxlib.py')).read().split("if __name__")[0]; ns = {}; exec(src, ns); return ns

# Library gags start from a given video (Sam, 13 Nov 2026: the fourth gag study's gags "start using them from next video onwards").
# An entry whose source names one of these study dates is left out of the pack for the videos listed (script file prefix).
NOT_FOR = {'13 Nov 2026': ('Aliens',), '14 Nov 2026': ('Aliens',)}   # the 14 Nov (eighth study) gags follow the same start

def sounds():
    lib = set(re.findall(r'"id":"sfx_([a-z_0-9]+)"', open(os.path.join(TK, 'media', 'sound_library.html')).read()))
    sys.path.insert(0, HERE); import sfx_synth
    fx = {n for n, _ in fxlib()['SOUNDS']}   # in-house gag_sfx.py sounds (modem, choir, morse, muffled ...)
    return sorted((lib | set(sfx_synth.SOUNDS) | fx) - NO_CRUDE)

def library(prefix):
    """Effects-library entries the writer may use: picture gags, cards, gag moves and habits from the gag studies (EFFECTS_LIBRARY.md).
    kind = the card kind (options in the plan JSON), 'move:<name>' for camera gag moves, 'shot:<field>' for shot options, 'habit:<id>'."""
    out = []
    for e in fxlib()['entries']():
        if e['group'] not in ('Picture gag', 'Card', 'Gag move', 'Habit'): continue
        if any(d in e['source'] and any(prefix.startswith(v) for v in vids) for d, vids in NOT_FOR.items()): continue
        card, shot = e['plan']['card'], e['plan']['shot'] or {}
        if card and card['kind'] in ('overlay', 'lottie'): continue   # not in the painted format (Sam, 12 Nov 2026): no flat Lottie or video overlay
        kd = card['kind'] if card else ('habit:' + e['id'] if e['group'] == 'Habit' else 'move:' + shot['move'] if 'move' in shot and e['group'] == 'Gag move' else 'shot:' + next(iter(shot), e['id']))
        out.append(('library', e['id'], kd, f"{e['name']}: {e['use']} Plan: {json.dumps(card or shot, ensure_ascii=False)}. Sound: {' '.join(e['sounds']) or '-'}"))
    return out

def kinds(schools):
    reg = json.load(open(os.path.join(TK, 'stills', 'gag_schools.json')))['schools']
    use = {k: v for k, v in reg.items() if not schools or k in schools or k == 'house'}
    rec = [(k, r['id'], r['match'].get('kind'), r['name']) for k, v in use.items() for r in v['recipes'] if r.get('status', 'built') == 'built']
    adult = [('adult', 'AD-mosaic', 'mosaic', 'Pixel blur over something innocent'), ('adult', 'AD-advisory', 'advisory', 'Viewer-advisory label (our design)'),
             ('adult', 'AD-cut', 'cut', 'Hard cut-away to a new picture'), ('adult', 'AD-grade', 'grade', 'Colour tint for the shot (with a sting)')]
    return rec + adult

def est_times(lines, timing):
    if timing and os.path.exists(timing):
        T = {x['id']: x for x in json.load(open(timing))['lines']}
        if all(l['id'] in T for l in lines):
            t0 = T[lines[0]['id']]['start']; return [(T[l['id']]['start'] - t0, T[l['id']]['end'] - t0) for l in lines], 'timing.json'
    out, t = [], 0.0
    for l in lines:
        d = len(l['text'].split()) / 150 * 60; out.append((t, t + d)); t += d + 0.4
    return out, 'estimated at 150 wpm'

def quoteish(text): return bool(re.search(r'in (his|her|their) words|"|“|, quote', text, re.I))

def cmd_pack(a):
    S = json.load(open(a.script)); L = [l for l in S['lines'] if l['scene'] == a.scene]
    if not L: sys.exit(f'no lines in scene {a.scene}')
    times, how = est_times(L, a.timing); dur = times[-1][1]
    nogag = set(filter(None, (a.nogag or '').split(','))) | {l['id'] for l in L if l.get('keeper') or l.get('no_gag')}
    n = max(1, round(dur / a.every)); edges = [dur * i / n for i in range(n + 1)]
    slots = []
    for i in range(n):
        ids = [l['id'] for l, (s, e) in zip(L, times) if edges[i] <= s < edges[i + 1] and l['id'] not in nogag]
        if ids: slots.append({'slot': len(slots) + 1, 'from': round(edges[i], 1), 'to': round(edges[i + 1], 1), 'lines': ids})
    K = kinds(set(filter(None, (a.schools or '').split(',')))) + library(os.path.basename(a.script)); SND = sounds()
    used = list(csv.DictReader(open(USED))) if os.path.exists(USED) else []
    taste = open(a.taste).read() if a.taste and os.path.exists(a.taste) else '(no taste file given)'
    os.makedirs(a.out, exist_ok=True)
    pack = {'video': S.get('title', ''), 'scene': a.scene, 'timing': how, 'dur': round(dur, 1), 'slots': slots, 'nogag': sorted(nogag),
            'lines': [dict(id=l['id'], text=l['text'], kind=l.get('kind', ''), src=l.get('src', ''), t=round(s, 1), quote=quoteish(l['text']))
                      for l, (s, e) in zip(L, times)],
            'kinds': [dict(school=k, recipe=r, kind=kd, name=nm) for k, r, kd, nm in K], 'sounds': SND}
    json.dump(pack, open(f'{a.out}/pack.json', 'w'), indent=1, ensure_ascii=False)
    md = [f"# Gag pack: {pack['video']} / scene `{a.scene}`", f"Chapter length {pack['dur']} s ({how}); {len(slots)} slots, one gag each at most.", '',
          '## Lines', '| id | t (s) | kind | text | note |', '|---|---|---|---|---|']
    for x in pack['lines']:
        note = 'NO GAG' if x['id'] in nogag else ('contains a quote: no play on the quoted words' if x['quote'] else '')
        md.append(f"| {x['id']} | {x['t']} | {x['kind']} | {x['text']} | {note} |")
    md += ['', '## Slots'] + [f"- Slot {s['slot']} ({s['from']}-{s['to']} s): lines {', '.join(s['lines'])}" for s in slots]
    md += ['', '## Kit cards you can use (school / recipe / card kind)'] + [f"- {k['school']} / {k['recipe']} / `{k['kind']}`: {k['name']}" for k in pack['kinds']]
    md += ['', '## Sounds you can use', ', '.join(SND), '', '## Sam\'s taste file', taste, '', '## Gags already used or piloted on the channel (do not repeat)']
    md += [f"- {u['video']} {u['line']}: {u['kind']} | {u['caption']} | {u['sound']} | {u['verdict']}" for u in used] or ['- none yet']
    open(f'{a.out}/pack.md', 'w').write('\n'.join(md) + '\n')
    print(f"{a.out}/pack.md: {len(L)} lines, {pack['dur']} s, {len(slots)} slots, {len(pack['kinds'])} card recipes, {len(SND)} sounds")

def load(a):
    P = json.load(open(f'{a.out}/pack.json')); C = json.load(open(f'{a.out}/candidates.json')); return P, C

def cmd_check(a):
    P, C = load(a); ids = {x['id']: x for x in P['lines']}; kinds_ok = {k['kind'] for k in P['kinds']}; snd = set(P['sounds'])
    slot_lines = {s['slot']: set(s['lines']) for s in P['slots']}; errs = []; seen = set()
    need = ['id', 'slot', 'line', 'word', 'kind', 'twist', 'spice', 'picture', 'caption', 'sound', 'timing', 'facts', 'why', 'build']
    for c in C:
        e = lambda m: errs.append(f"{c.get('id', '?')}: {m}")
        for k in need:
            if k not in c: e(f'missing {k}')
        if c.get('id') in seen: e('duplicate id')
        seen.add(c.get('id'))
        ln = c.get('line')
        if ln not in ids: e(f'unknown line {ln}'); continue
        if ln in P['nogag']: e(f'{ln} is a no-gag line')
        if c.get('slot') not in slot_lines or ln not in slot_lines[c['slot']]: e(f'{ln} is not in slot {c.get("slot")}')
        if c.get('word') and c['word'].lower().strip('.,!?') not in ids[ln]['text'].lower(): e(f"cue word '{c['word']}' not in {ln}")
        k = c.get('kind', '')
        if not k.startswith('new:') and k not in kinds_ok: e(f'kind {k} not allowed for these schools')
        for s in filter(None, re.split(r'[ ,+]+', c.get('sound') or '')):
            if s not in snd: e(f'sound {s} not in the library')
        cap = re.sub(r'\(.*?\)', '', c.get('caption') or '')
        if len(cap.split()) > 8: e(f'caption over 8 words: {cap!r}')
        if re.search(r'\b(shit|fuck|bitch|bastard|damn|hell|crap|bloody)\b', c.get('caption') or '', re.I): e('swear in a caption')
        if c.get('spice') not in (1, 2, 3): e('spice must be 1, 2 or 3')
    per = {}
    for c in C: per[c.get('slot')] = per.get(c.get('slot'), 0) + 1
    for s in slot_lines:
        if per.get(s, 0) < 5: errs.append(f'slot {s}: only {per.get(s, 0)} candidates (want 5)')
    print('\n'.join(errs) if errs else f'OK: {len(C)} candidates'); sys.exit(1 if errs else 0)

W = dict(surprise=3, fit=3, clear=2, fresh=1.5, cost=0.5)
def cmd_pick(a):
    P, C = load(a); S = {s['id']: s for s in json.load(open(f'{a.out}/scores.json'))}; rows = []
    for c in C:
        s = S.get(c['id'])
        if not s: rows.append(dict(c, total=0, status='unscored')); continue
        tot = sum(s[k] * w for k, w in W.items()); st = 'ok'
        if s['true'] < 4: st = 'rejected: true < 4'
        elif s['clear'] < 3: st = 'rejected: unclear'
        rows.append(dict(c, **{f'j_{k}': s[k] for k in ['surprise', 'clear', 'true', 'fresh', 'fit', 'cost']}, note=s.get('note', ''), fix=s.get('fix', ''),
                         total=round(tot, 1), status=st))
    out = []; md = [f"# Gag shortlist: {P['video']} / `{P['scene']}`", f"Score = 3 surprise + 3 fit + 2 clear + 1.5 fresh + 0.5 cost (max 50). Rejected if true < 4 or clear < 3.", '']
    for s in P['slots']:
        cand = sorted([r for r in rows if r['slot'] == s['slot']], key=lambda r: (r['status'] != 'ok', -r['total']))
        md += [f"## Slot {s['slot']} ({s['from']}-{s['to']} s)"]
        for i, r in enumerate(cand):
            keep = i < a.keep and r['status'] == 'ok'
            if keep: out.append(r)
            md.append(f"{'**KEEP**' if keep else '-'} `{r['id']}` {r['line']} on \"{r['word']}\" | {r['kind']} ({r['twist']}, spice {r['spice']}) | {r['total']} | {r['status']}")
            md.append(f"    picture: {r['picture']}" + (f" | caption: \"{r['caption']}\"" if r['caption'] else '') + (f" | sound: {r['sound']}" if r['sound'] else ''))
            if r.get('note'): md.append(f"    judge: {r['note']}" + (f" | fix: {r['fix']}" if r.get('fix') else ''))
        md.append('')
    open(f'{a.out}/shortlist.md', 'w').write('\n'.join(md)); json.dump(out, open(f'{a.out}/shortlist.json', 'w'), indent=1, ensure_ascii=False)
    print(f"{a.out}/shortlist.md: {len(out)} kept of {len(rows)} ({sum(r['status'].startswith('rejected') for r in rows)} rejected)")

def cmd_log(a):
    P = json.load(open(f'{a.out}/pack.json')); C = {c['id']: c for c in json.load(open(f'{a.out}/candidates.json'))}
    new = not os.path.exists(USED); f = open(USED, 'a', newline=''); w = csv.DictWriter(f, USED_COLS)
    if new: w.writeheader()
    for item in a.items:
        gid, verdict = item.split(':'); c = C[gid]
        w.writerow(dict(date=datetime.date.today().isoformat(), video=a.video, line=c['line'], id=gid, kind=c['kind'], twist=c['twist'], spice=c['spice'],
                        picture=c['picture'], caption=c['caption'], sound=c['sound'], verdict=verdict))
    f.close(); print(f'logged {len(a.items)} in {USED}')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
    p = sp.add_parser('pack'); p.add_argument('script'); p.add_argument('scene'); p.add_argument('out'); p.add_argument('--timing')
    p.add_argument('--schools'); p.add_argument('--nogag'); p.add_argument('--taste'); p.add_argument('--every', type=float, default=50)
    for n in ('check', 'pick'):
        q = sp.add_parser(n); q.add_argument('out')
        if n == 'pick': q.add_argument('--keep', type=int, default=2)
    q = sp.add_parser('log'); q.add_argument('out'); q.add_argument('video'); q.add_argument('items', nargs='+')
    a = ap.parse_args(); dict(pack=cmd_pack, check=cmd_check, pick=cmd_pick, log=cmd_log)[a.cmd](a)
