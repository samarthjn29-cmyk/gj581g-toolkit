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
Exit 1 on any FAIL.
"""
import sys, re, json
S = json.load(open(sys.argv[1])); L = S['lines'] if isinstance(S, dict) and 'lines' in S else S
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
    if n / m > 4: warns.append(f'scene {sc}: {n} numbers in ~{m*60:.0f} s ({n/m:.1f}/min)')
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
print(f'first-lecture lint: {total_words} words, ~{dur/60:.1f} min, {len(sents)} sentences')
for f in fails: print('FAIL', f)
for w in warns: print('WARN', w)
print('OK' if not fails else 'FAILED')
sys.exit(1 if fails else 0)
