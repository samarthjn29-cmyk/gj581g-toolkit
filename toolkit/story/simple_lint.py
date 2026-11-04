"""First-lecture lint (GJ 581g, Sam 3 Nov 2026): is the script simple enough for a student on the first day of college?
Usage: python3 simple_lint.py script.json [timing.json]
script.json: a list of lines (or {"lines": [...]}), each with "text" (and optional "id", "scene", "who"; heckler lines are skipped).
Without timing.json, duration is estimated at 150 words a minute (the pace of the small channels that win with simple explainers).
Checks (from the 3 Nov peer study: small-channel winners speak 2.4-3.4 numbers a minute, ours spoke about 17):
  - spoken numbers per minute: FAIL above 4, WARN above 3 (whole video) and per scene;
  - more than one number in a sentence: WARN (a two-number comparison is fine if it is the point);
  - sentences: average over 15 words WARN, any over 25 words WARN;
  - jargon: a listed term used before a plain definition ("X is...", "X means...", "that's called X", "we call it X"), WARN;
  - new terms: more than 3 defined terms in the video, WARN (one per chapter is the target).
Script craft (Maxinomics script study, Sam 4 Nov 2026), all WARN:
  - two sentence gears: under 20% or over 45% of sentences shorter than 8 words (his hits: 30-40%);
  - "you" under 3 a minute, or "I/me/my" over 1 a minute (narrator lines);
  - questions over 2 a minute (narrator + Heckler), or a question that isn't in the first two lines of its scene (hinges, not decoration);
  - the motif ({"motif": "ruler", "lines": [...]}) said fewer than 6 times;
  - jokes (lines with a "pattern" B-ID or energy "dry") outside about one every 45-60 s;
  - a number burst is allowed once per video in a scene tagged "ladder": true (one unit ladder, up to 4 numbers).
Exit 1 on any FAIL.
"""
import sys, re, json
S = json.load(open(sys.argv[1])); L = S['lines'] if isinstance(S, dict) and 'lines' in S else S
MOTIF = S.get('motif') if isinstance(S, dict) else None; ALL = [l for l in L if isinstance(l, dict) and l.get('text')]
L = [l for l in L if isinstance(l, dict) and l.get('text') and l.get('who') != 'heckler']
T = {x['id']: x for x in json.load(open(sys.argv[2]))['lines']} if len(sys.argv) > 2 else {}
NUM = re.compile(r"\$?\d[\d,.]*\s*(?:%|percent|trillion|billion|million|thousand)?|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|"
                 r"thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|"
                 r"million|billion|trillion|percent|half|quarter|third)(?:[- ](?:one|two|three|four|five|six|seven|eight|nine|percent|hundred|thousand))*\b", re.I)
JARGON = ['inflation', 'nominal', 'real wage', 'real raise', 'purchasing power', 'exchange rate', 'depreciation', 'appreciation', 'gdp', 'cpi', 'deflator',
          'basket', 'reserve currency', 'bond', 'yield', 'interest rate', 'central bank', 'deficit', 'surplus', 'ppp', 'parity', 'median', 'index',
          'fiscal', 'monetary', 'liquidity', 'currency peg', 'balance of payments', 'money illusion']
DEF = r"\b{t}\b[^.?!]{{0,40}}\b(is|are|means|measures|tells)\b|\b(called|call it|we call|known as|that's)\b[^.?!]{{0,30}}\b{t}\b"
def words(s): return re.findall(r"[A-Za-z0-9$%'.,-]+", s)
fails, warns = [], []
alltext = ' '.join(l['text'] for l in L)
total_words = len(words(alltext))
dur = sum(T[l['id']]['end'] - T[l['id']]['start'] for l in L if l.get('id') in T) if T else total_words / 150 * 60
nums = len(NUM.findall(alltext)); npm = nums / (dur / 60)
(fails if npm > 4 else warns if npm > 3 else []).append(f'spoken numbers: {nums} in {dur/60:.1f} min = {npm:.1f}/min (target 3 or fewer)')
scenes = {}
for l in L: scenes.setdefault(l.get('scene', 'all'), []).append(l)
for sc, ls in scenes.items():
    t = ' '.join(x['text'] for x in ls); w = len(words(t)); n = len(NUM.findall(t)); m = w / 150
    if m < 0.33: continue  # too short to judge alone (under about 20 s)
    if n / m > 4 and not (any(x.get('ladder') for x in ls) and n <= 4): warns.append(f'scene {sc}: {n} numbers in ~{m*60:.0f} s ({n/m:.1f}/min)')
ladders = {l.get('scene') for l in L if l.get('ladder')}
if len(ladders) > 1: warns.append(f'{len(ladders)} scenes tagged ladder ({", ".join(map(str, ladders))}): one number burst per video')
sents = [s.strip() for s in re.split(r'(?<=[.?!])\s+', alltext) if len(words(s)) > 2]
avg = sum(len(words(s)) for s in sents) / max(len(sents), 1)
if avg > 15: warns.append(f'average sentence {avg:.1f} words (target 10-15)')
for s in sents:
    if len(words(s)) > 25: warns.append(f'long sentence ({len(words(s))} words): {s[:90]}...')
    if len(NUM.findall(s)) > 1: warns.append(f'{len(NUM.findall(s))} numbers in one sentence: {s[:90]}')
defined = []
for term in JARGON:
    first = re.search(rf'\b{re.escape(term)}\b', alltext, re.I)
    if not first: continue
    d = re.search(DEF.format(t=re.escape(term)), alltext, re.I)
    if not d: warns.append(f'jargon "{term}" never defined in plain words')
    elif d.start() > first.start() + 200: warns.append(f'jargon "{term}" used before it is defined')
    else: defined.append(term)
if len(defined) > 3: warns.append(f'{len(defined)} new terms ({", ".join(defined)}): target one per chapter, three at most')
# ---- script craft (4 Nov 2026)
mins = dur / 60
short = sum(1 for x in sents if len(words(x)) < 8) / max(len(sents), 1)
if not 0.2 <= short <= 0.45: warns.append(f'sentence gears: {short:.0%} of sentences under 8 words (target 20-45%: story sentences cut by short punches)')
you = len(re.findall(r"\b(you|your|you're|yours|yourself)\b", alltext, re.I)); me = len(re.findall(r"\b(I|me|my|I'm|I've)\b", alltext))
if you / mins < 3: warns.append(f'"you" {you / mins:.1f} a minute (target 3 or more: talk to the viewer)')
if me / mins > 1: warns.append(f'"I/me/my" {me / mins:.1f} a minute (target 1 or fewer: no presenter)')
qs = [(l, x) for l in ALL for x in re.split(r'(?<=[.?!])\s+', l['text']) if x.strip().endswith('?')]
if len(qs) / mins > 2: warns.append(f'questions: {len(qs)} = {len(qs) / mins:.1f} a minute (target 1-2, at section starts)')
first2 = {}
for l in ALL: first2.setdefault(l.get('scene', 'all'), []).append(l.get('id'))
for l, x in qs:
    if l.get('id') not in first2.get(l.get('scene', 'all'), [])[:2] and l.get('who') != 'heckler': warns.append(f'question mid-scene ({l.get("id")}): "{x[:60]}" (questions are hinges at a section start)')
if MOTIF:
    k = len(re.findall(rf'\b{re.escape(MOTIF)}', alltext, re.I))
    if k < 6: warns.append(f'motif "{MOTIF}" said {k} times (target 6 or more)')
jokes = [l for l in ALL if l.get('pattern') or l.get('energy') == 'dry']
if jokes and not 0.7 <= len(jokes) / mins <= 1.5: warns.append(f'jokes: {len(jokes)} = {len(jokes) / mins:.1f} a minute (target about one every 45-60 s)')
print(f'first-lecture lint: {total_words} words, ~{dur/60:.1f} min, {len(sents)} sentences')
for f in fails: print('FAIL', f)
for w in warns: print('WARN', w)
print('OK' if not fails else 'FAILED')
sys.exit(1 if fails else 0)
