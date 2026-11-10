#!/usr/bin/env python3
"""Short kinetic text cards (gj581g-stills-world s1, Sam 10 Nov 2026, Blank Rascal study): 1-4 spoken words on the
video's plain dark ground, timed to the words, 1.2-2.5 s, colour roles (ordinary cream / accent gold / numbers blue).
Finds each phrase in the chapter's heard words, checks it is verbatim in the script line, and writes the card into
stills/<s>.json (replacing earlier short cards). Usage: add_kinetic.py [--dry]"""
import json, re, sys
Z = '/home/claude/zeig'
NUM = {'ten': '10', 'forty': '40', 'sixty': '60', 'nineteen': '1950'}
def n(w): return re.sub(r'[^a-z0-9]', '', w.lower())
def eq(a, b): a, b = n(a), n(b); a = NUM.get(a, a); return a == b or (len(a) > 3 and (a.startswith(b) or b.startswith(a)))

# (phrase as in the script, accent words, number words)
K = {
 'berlin': [('never writes anything down.', ['down'], []), ('a famous name.', ['famous'], []),
            ('charmingly simple.', ['simple'], []), ('partway through,', ['partway'], []),
            ("here's what she found.", ['found'], []), ('nearly twice as well.', [], ['twice'])],
 'itch':   [('like pulling a spring.', ['spring'], []), ('the spring stays pulled,', ['pulled'], []),
            ('Not hunger, not thirst.', ['hunger', 'thirst'], []), ('slightly terrifying', ['terrifying'], []),
            ('these little contracts.', ['contracts'], []), ("they're not.", ['not'], [])],
 'moscow': [('Stalin is in charge.', ['Stalin'], []), ('vanish in the night.', ['vanish'], []),
            ('ten years', [], ['ten']), ('Just gone.', ['gone'], []),
            ('destroys her own drafts.', ['destroys'], []), ('a whole new field', ['new'], [])],
 'turn':   [('mixed results.', ['mixed'], []), ('The memory idea.', ['memory'], []),
            ('Nobody asked them to.', ['Nobody'], []), ('A strict experimenter.', ['strict'], []),
            ('checking her homework.', ['homework'], []), ("That's science working.", ['working'], []),
            ('from 1950,', [], ['1950'])],
 'tabs':   [("a job you've started.", ['job'], []), ('still pulled.', ['pulled'], []),
            ('forty tabs open,', [], ['forty']), ('It might be yours.', ['yours'], []),
            ('fell asleep faster', ['faster'], []), ('small studies.', ['small'], [])],
 'end':    [('a dubious personality.', ['dubious'], []), ('emphatically not recommended.', ['not'], []),
            ("it isn't a fault.", ['fault'], []), ('corridor of doors.', ['doors'], []),
            ('Tidy. Finished.', [], []), ('on purpose,', ['purpose'], []), ('that starts things.', ['starts'], [])],
}
dry = '--dry' in sys.argv
for s, items in K.items():
    P = json.load(open(f'{Z}/stills/{s}.json'))
    T = json.load(open(f'/home/claude/twice/remotion/public/zeig/{s}/timeline.json')); W = T['words']
    L = json.load(open(f'{Z}/voice/final/timing_{s}.json'))['lines']
    S = {l['id']: l['text'] for l in json.load(open(f'{Z}/story/Zeigarnik_script_v3.json'))['lines']}
    P['cards'] = [c for c in P['cards'] if c.get('style') != 'short']
    for ph, acc, nums in items:
        toks = ph.split()
        hit = next((i for i in range(len(W) - len(toks) + 1) if all(eq(toks[j], W[i + j][0]) for j in range(len(toks)))), None)
        if hit is None: sys.exit(f'{s}: not heard: {ph}')
        t0, t1 = W[hit][1], W[hit + len(toks) - 1][2]
        line = next(l for l in L if l['start'] - 0.3 <= t0 <= l['end'] + 0.3)
        if n(ph) not in n(S[line['id']]): sys.exit(f'{s}: "{ph}" not verbatim in {line["id"]}')
        ls, le = line['start'], line['end']; first = n(toks[0])
        k = [w for w in W if ls - 0.3 <= w[1] <= le + 0.3 and n(w[0]).startswith(NUM.get(first, first))].index(W[hit])
        dur = round(min(2.5, max(1.2, t1 - t0 + 0.75)), 2)
        txt = (ph[0].upper() + ph[1:]).rstrip(',')
        for c in T['cards']:
            if c['t'] - 0.3 < t0 + dur and t0 < c['t'] + c.get('dur', 4.5) + 0.3: sys.exit(f'{s}: "{ph}" overlaps card {c.get("text", c.get("term"))}')
        P['cards'].append({'at': line['id'], 'word': NUM.get(first, first), 'k': k, 'kind': 'kinetic', 'style': 'short',
                           'text': txt, 'accent': acc, 'nums': nums, 'dur': dur})
        print(f'{s:7}{line["id"]:7}{t0:7.2f}s {dur:4}s k={k}  {txt}')
    if not dry: json.dump(P, open(f'{Z}/stills/{s}.json', 'w'), indent=1, ensure_ascii=False)
