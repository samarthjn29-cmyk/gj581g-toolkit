"""Decked out Data: build the research-story hand-off files from one project data file.

Usage:
  python handoff.py <project.py> <out_dir> [--vo-dur durations.json]

Writes <PREFIX>_story_brief.md, <PREFIX>_storyboard.md, <PREFIX>_voiceovers.md, <PREFIX>_vo_text.zip
and slides.json (the deck builder's input), then prints the checks (runtime, one number per sentence,
no digits in speech, banned phrases, 8-second visual gaps, title length, snippet length, unknown source IDs).

--vo-dur: durations.json written by tts/synth.py ([[n, seconds, ...], ...]). Slide durations then become
clip length + 0.4 s (rounded up) instead of the word-count estimate. Rerun after narration.

The project file is plain Python (see examples/blindness/project.py). Required names:
  PREFIX   'Blindness'                          file prefix
  TITLE    "Why you don't see ..."               video title
  NARRATOR "Michael (am_michael, American male) at 1.1x"
  SLIDES   list of dicts: name, chapter, layout, tracker, purpose, head, [sup], visual, highlight, receipt,
           builds [(start_frac, end_frac, "description (effect)")], device, trans, caveat,
           energy, style, delivery, vo [marked lines], [snippet {text, attribution, sid}], [media "..."]
  SOURCES  list of tuples (id, claim, exact wording or derivation, source, location, scope, notes)
Optional names:
  BRIEF_BODY      markdown for the brief sections before the source map (idea, open loops, basics plan,
                  reports table, research notes, synthesis). String.Template placeholders: $runtime,
                  $slides, $words, $narrator.
  BRIEF_TAIL      markdown for "Before you publish".
  SNIP_LICENCES   {source_id: licence text}
  LENGTH_ROWS     [(section, slide range, budget, chapter prefix or list of slide numbers)]
  MID_SLIDE       name of the mid-video turn slide
  STORYBOARD_NOTES  markdown notes for the deck builder (colors by role, not hex)
  VOICE_BRIEF, DELIVERY_ARC  markdown
  GLOSSARY        [(word, say it, note)]
  SELF_CHECK_NOTES {check label: result text} to override the defaults
  SNIP_READ_S     extra seconds held on slides with a snippet (default 2.0)
  RHYTHM_S        longest allowed gap between visual events (default 5.0; builds, clip cuts and word changes count)
Optional slide fields: cuts [fractions of the slide when a background clip cuts to the next one (multi-clip
  sequences)], layout 'word-card' with lines ["Looking.", "isn't seeing."] (full-screen word or short phrase at a
  climax, revealed line by line), layout 'map' (the recurring
  chapter map with the current item highlighted and unknown items as '??????'), hold (seconds of silent visual beat
  after the narration, e.g. after a reveal; adds to the slide's duration).
  layout 'hypotheses' with theories ["People are missing something", "The data is missing something"] (the competing
  explanations the video will test, shown early) and layout 'scorecard' with verdicts [{theory, score 0-3, note}]
  (the evidence verdict that ranks them near the end). A hypotheses slide needs a later scorecard with the same theories.
  layout 'evidence-card' (real screenshots of sources: survey charts, headlines, a paper's title block; snip.py CONTEXT).
"""
import sys, os, re, math, zipfile, json, importlib.util, string
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from vo_lib import *

args = sys.argv[1:]
vo_dur = None
if '--vo-dur' in args:
    i = args.index('--vo-dur'); vo_dur = args[i + 1]; del args[i:i + 2]
PROJ, OUT = args[0], args[1]
os.makedirs(OUT, exist_ok=True)
spec = importlib.util.spec_from_file_location('project', PROJ); P = importlib.util.module_from_spec(spec)
sys.path.insert(0, os.path.dirname(os.path.abspath(PROJ))); spec.loader.exec_module(P)
g = lambda name, default=None: getattr(P, name, default)
PREFIX, TITLE, NARR = P.PREFIX, P.TITLE, g('NARRATOR', 'narrator to be chosen by the deck builder')
fname = lambda kind: os.path.join(OUT, f'{PREFIX}_{kind}')

SL = [dict(s) for s in P.SLIDES]
_VD = {x[0]: x[1] for x in json.load(open(vo_dur))} if vo_dur else {}
t = 0.0
for i, s in enumerate(SL, 1):
    s['n'] = i
    s['text'] = ' '.join(s['vo']); s['words'] = word_count(s['text'])
    s['pause_s'] = pause_seconds(s['text']); s['est'] = estimate(s['text'])
    extra = g('SNIP_READ_S', 2.0) if s.get('snippet') else 0.0
    s['dur'] = (math.ceil(_VD[i] + 0.4) if i in _VD else math.ceil(s['est'] + extra)) + int(s.get('hold', 0))
    s['start'] = t; t += s['dur']
RUNTIME = int(t); TOTAL_WORDS = sum(s['words'] for s in SL)

def mmss(x): x = int(round(x)); return f'{x // 60}:{x % 60:02d}'
def vo_id(s): return f"VO-{s['n']:02d}"
def table(h, rows):
    o = ['| ' + ' | '.join(h) + ' |', '|' + '|'.join('---' for _ in h) + '|']
    o += ['| ' + ' | '.join(str(c).replace('|', '/') for c in r) + ' |' for r in rows]
    return '\n'.join(o)

# ---------------------------------------------------------------- checks
issues = []
prev = None
SM = {r[0] for r in P.SOURCES}
for s in SL:
    if prev == s['layout']: issues.append(f"Slide {s['n']:02d}: same layout as previous ({prev})")
    prev = s['layout']
    hw = len(s['head'].split())
    if hw > 15: issues.append(f"Slide {s['n']:02d}: action title {hw} words")
    if s.get('snippet'):
        n = len(s['snippet']['text'].split()); s['snippet']['words'] = n
        if n >= 15: issues.append(f"Slide {s['n']:02d}: snippet {n} words")
    for sent, runs in numbers_report(s['text']):
        issues.append(f"Slide {s['n']:02d}: >1 number: {sent!r} {runs}")
    if re.search(r'\d', spoken(s['text'])): issues.append(f"Slide {s['n']:02d}: digit in spoken text")
    if re.search(r"dive in|in today's video|welcome back|without further ado|subscribe", s['text'], re.I):
        issues.append(f"Slide {s['n']:02d}: banned phrase")
    ev = sorted([0.0] + [a * s['dur'] for a, b, _ in s['builds']] + [c * s['dur'] for c in s.get('cuts', [])] + [float(s['dur'])])
    s['max_gap'] = max(ev[i + 1] - ev[i] for i in range(len(ev) - 1))
    s['mean_gap'] = s['dur'] / (len(ev) - 1)
    RH = g('RHYTHM_S', 5.0)
    if s['max_gap'] > RH + 0.05 and s['layout'] not in ('video-full', 'word-card'):
        issues.append(f"Slide {s['n']:02d}: visual gap {s['max_gap']:.1f}s > {RH:.0f}s: add a build, a clip cut or a word change")
    if not s.get('media'): issues.append(f"Slide {s['n']:02d}: no Media line")
if not 240 <= RUNTIME <= 720: issues.append(f'Runtime {RUNTIME}s outside 4-12 min')
nwc = sum(1 for s in SL if s['layout'] == 'word-card'); nmap = sum(1 for s in SL if s['layout'] == 'map'); nhold = sum(1 for s in SL if s.get('hold'))
if nwc < 2: issues.append(f'Only {nwc} word-card slides: plan 2-4 single-word beats at the climaxes')
if nmap < 2 and not g('ROUTE_ICONS', False): issues.append(f'Only {nmap} map slides: return to the chapter map at each chapter (current item highlighted, twist as ??????)')
if nhold and str(g('STYLE', '')).upper() != 'S7': issues.append('Silent holds found: since 1 Nov 2026 hold must be 0 outside a video essay (S7)')
hyp = [s for s in SL if s['layout'] == 'hypotheses']; sc = [s for s in SL if s['layout'] == 'scorecard']
if hyp and not any(c['n'] > hyp[0]['n'] for c in sc): issues.append(f"Slide {hyp[0]['n']:02d}: hypotheses slide but no later scorecard: rank the theories by the evidence before the end")
if hyp and sc:
    th = set(hyp[0].get('theories') or []); vt = {v['theory'] for v in sc[-1].get('verdicts') or []}
    if th != vt: issues.append(f"Slide {sc[-1]['n']:02d}: scorecard theories {sorted(vt)} differ from the hypotheses {sorted(th)}")
if hyp and hyp[0]['start'] > 0.25 * RUNTIME: issues.append(f"Slide {hyp[0]['n']:02d}: theories announced at {hyp[0]['start']:.0f}s: name them in the first quarter")
MG = sum(s['dur'] for s in SL) / max(1, sum(len(s['builds']) + len(s.get('cuts', [])) + 1 for s in SL))

CH = []
for s in SL:
    if s['chapter'] not in [c for c, _ in CH]: CH.append((s['chapter'], s['start']))
mid = next((s for s in SL if s['name'] == g('MID_SLIDE')), None)
ctx = dict(runtime=mmss(RUNTIME), slides=len(SL), words=TOTAL_WORDS, narrator=NARR)
tmpl = lambda md: string.Template(md or '').safe_substitute(ctx)

# ---------------------------------------------------------------- story brief
br = []; A = br.append
A(f'# Story brief: {TITLE} (Decked out Data)\n')
A(f'**Runtime:** about {mmss(RUNTIME)} | **Slides:** {len(SL)} | **Spoken words:** {TOTAL_WORDS} | **Narrator:** {NARR}, narration only.\n')
A(tmpl(g('BRIEF_BODY')))
A('\n## Source map\n')
A(table(['ID', 'Number / claim on screen', 'Exact wording or derivation', 'Source', 'Location', 'Scope', 'Notes'], P.SOURCES))
snips = [s for s in SL if s.get('snippet')]
if snips:
    lic = g('SNIP_LICENCES', {})
    A('\n## Verbatim snippets\n')
    A(table(['Report', 'Snippet', 'Words', 'Slide', 'Licence'], [
        [s['snippet']['attribution'], f"\"{s['snippet']['text']}\"", s['snippet']['words'], f"{s['n']:02d} [{s['snippet']['sid']}]", lic.get(s['snippet']['sid'], '')] for s in snips]))
A('\n## Length math\n')
def secs(sel):
    if isinstance(sel, str): return sum(s['dur'] for s in SL if s['chapter'].startswith(sel))
    return sum(s['dur'] for s in SL if s['n'] in sel)
rows = g('LENGTH_ROWS')
if rows: A(table(['Section', 'Slides', 'Budget', 'Estimate'], [[a, b, c, f'{secs(d)} s'] for a, b, c, d in rows]))
A(f"\nTotal {RUNTIME} s ({mmss(RUNTIME)}) {'from the narration clips' if _VD else 'at the 2.6 words/s estimate'}; {TOTAL_WORDS} words.\n")
A('## Structure and retention map\n')
A(table(['Start', 'Chapter'], [[mmss(st), ch] for ch, st in CH]))
if mid: A(f"\nMid-video turn: slide {mid['n']} at {mmss(mid['start'])} ({round(100 * mid['start'] / RUNTIME)}%).\n")
A(f"Average time between visual changes: {MG:.1f} s (aim for 3-4 s; explainer and primer slides nearer 3 s).\n")
A(table(['Slide', 'Start', 'Dur', 'Visual events', 'Longest gap', 'Avg gap', 'Media', 'Device'],
        [[f"{s['n']:02d}", mmss(s['start']), f"{s['dur']} s", len(s['builds']), f"{s['max_gap']:.1f} s", f"{s['mean_gap']:.1f} s", s.get('media', ''), s['device']] for s in SL]))
if g('BRIEF_TAIL'): A('\n## Before you publish\n' + tmpl(P.BRIEF_TAIL))
open(fname('story_brief.md'), 'w').write('\n'.join(br) + '\n')

# ---------------------------------------------------------------- storyboard
sb = []; B = sb.append
B(f'# Storyboard: {TITLE} (Decked out Data)\n')
B(f'**Runtime:** about {mmss(RUNTIME)} | **Slides:** {len(SL)} | **Format:** 16:9 corporate consulting style in this project\'s palette (colors named by role), mixed media | **Audio:** narration only | **Source IDs** [S#] refer to the source map in {PREFIX}_story_brief.md.\n')
if g('STORYBOARD_NOTES'): B('**Notes for the deck builder**\n' + P.STORYBOARD_NOTES + '\n')
B('**Chapters**\n'); B(table(['Start', 'Chapter'], [[mmss(st), ch] for ch, st in CH])); B('')
for s in SL:
    B(f"\n## Slide {s['n']:02d}: {s['name']}")
    B(f"- Chapter: {s['chapter']}  |  Layout: `{s['layout']}`  |  Start: {mmss(s['start'])}  |  Duration: {s['dur']} s")
    B(f"- Purpose: {s['purpose']}")
    if s.get('tracker'): B(f"- Tracker: \"{s['tracker']}\"")
    B(f"- Action title: \"{s['head']}\"")
    if s.get('sup'): B(f"- Subtitle: \"{s['sup']}\"")
    if s.get('snippet'):
        sn = s['snippet']; lead = '…' if sn['text'][0].islower() else ''
        B(f"- Snippet (verbatim, {sn['words']} words) [{sn['sid']}]: \"{lead}{sn['text']}\"  \n  Attribution: \"{sn['attribution']}\"")
    if s.get('theories'): B('- Theories: ' + '; '.join(f'{i + 1}. {t}' for i, t in enumerate(s['theories'])))
    if s.get('verdicts'): B('- Verdicts: ' + '; '.join(f"{v['theory']} ({v['score']}/3: {v['note']})" for v in s['verdicts']))
    B(f"- Visual: {s['visual']}")
    B(f"- Media: {s.get('media', 'none')}")
    B(f"- Highlight: {s['highlight']}")
    B('- Source line: ' + (f"\"{s['receipt']}\"" if s.get('receipt') else 'none (no data)'))
    B('- Builds (timed):')
    for a, b, d in s['builds']: B(f"  - {a * s['dur']:.1f}-{b * s['dur']:.1f} s: {d}")
    if s.get('cuts'): B('- Background cuts at: ' + ', '.join(f"{c * s['dur']:.1f} s" for c in s['cuts']))
    if s.get('hold'): B(f"- Silent hold: {s['hold']} s after the narration (visuals only)")
    B(f"- Retention device: {s['device']}")
    B(f"- Transition out: {s['trans']}  |  Caveat: {s['caveat'] or 'none'}  |  VO: {vo_id(s)}")
open(fname('storyboard.md'), 'w').write('\n'.join(sb) + '\n')

# ---------------------------------------------------------------- voiceovers
vo = []; V = vo.append
V(f'# Voiceovers: {TITLE} (Decked out Data)\n')
V(f'{len(SL)} clips, VO-01 to VO-{len(SL):02d}. Runtime {mmss(RUNTIME)}. Narrator: {NARR}; narration only.\n')
V('## Voice brief\n' + (g('VOICE_BRIEF') or '- A smart, warm analyst telling a story; slower on definitions and numbers.') + '\n')
V('## Markup\n'); V(table(['Marker', 'Meaning', 'Length'], [['`[beat]`', 'small breath', '~0.3 s'], ['`[pause]`', 'let it land', '~0.7 s'], ['`[long pause]`', 'dramatic pause', '~1.2 s'], ['`[pause:N]`', 'silence', 'N s'], ['`*word*`', 'lean on this word', '-'], ['`...`', 'trailing thought', '-']]))
if g('GLOSSARY'): V('\n## Pronunciation glossary\n'); V(table(['Word', 'Say it', 'Note'], P.GLOSSARY))
if g('DELIVERY_ARC'): V('\n## Delivery arc\n' + P.DELIVERY_ARC + '\n')
V('## Clips\n')
for s in SL:
    V(f"### {vo_id(s)} | Slide {s['n']:02d} | target {s['dur']}s")
    V(f"- Energy: {s['energy']}"); V(f"- Style: {s['style']}"); V(f"- Delivery: {s['delivery']}")
    V(f"- Words: {s['words']} | est. {s['est']:.1f}s (speech {s['words'] / WPS:.1f}s + pauses {s['pause_s']:.1f}s + pad {PAD}s)")
    V('Text:')
    for ln in s['vo']: V(f'> {ln}')
    V('')
has = lambda k: any(k in i for i in issues)
chk = {'Runtime 4-12 min': mmss(RUNTIME) + ('' if 240 <= RUNTIME <= 720 else ' FAIL'),
       'One number per sentence; no digits in speech': 'FAIL' if has('>1 number') or has('digit') else 'pass',
       'No banned filler or subscribe asks': 'FAIL' if has('banned') else 'pass',
       'Snippets verbatim, under 15 words': 'FAIL' if has('snippet') else 'pass (check verbatim against the PDF)',
       'Action title at most 15 words': 'FAIL' if has('action title') else 'pass',
       'Media line on every card': 'FAIL' if has('no Media') else 'pass',
       f"Visual event at least every {g('RHYTHM_S', 5.0):.0f} s": 'check' if has('visual gap') else 'pass',
       'Word cards (2-4), chapter map, silent holds': 'check' if has('word-card') or has('map slides') or has('silent holds') else 'pass',
       'Theories named early and ranked by a scorecard': ('check' if has('hypotheses') or has('scorecard') or has('theories announced') else 'pass') if hyp else 'n/a (no hypotheses slide)'}
chk.update(g('SELF_CHECK_NOTES', {}))
V('## Self-check\n'); V(table(['Check', 'Result'], list(chk.items())))
open(fname('voiceovers.md'), 'w').write('\n'.join(vo) + '\n')

with zipfile.ZipFile(fname('vo_text.zip'), 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('vo_text/README.txt', f'Decked out Data: {TITLE}. One file per clip.\nplain/ any TTS tool; ssml/ SSML breaks and emphasis; tags/ bracketed pause tags.\n')
    for s in SL:
        z.writestr(f'vo_text/plain/{vo_id(s)}.txt', render_plain(s['text']) + '\n')
        z.writestr(f'vo_text/ssml/{vo_id(s)}.ssml', render_ssml(s['text']) + '\n')
        z.writestr(f'vo_text/tags/{vo_id(s)}.txt', render_tags(s['text']) + '\n')

# ---------------------------------------------------------------- slides.json for the deck builder
EFF = re.compile(r'\((zoom|fade|wipe-from-\w+|fly-from-\w+)\)\s*$')
exp = []
for s in SL:
    ids = sorted({x for grp in re.findall(r'\[(S[\db]+(?:,\s*S[\db]+)*)\]', s['visual']) for x in re.findall(r'S[\db]+', grp)})
    for x in ids:
        if x not in SM: issues.append(f"Slide {s['n']:02d}: unknown source id {x}")
    exp.append({k: s.get(k) for k in ('n', 'name', 'chapter', 'layout', 'dur', 'start', 'tracker', 'head', 'sup', 'snippet', 'receipt', 'caveat', 'visual', 'media', 'trans', 'energy', 'style', 'delivery', 'hold', 'lines', 'map_items', 'map_current', 'map_hidden', 'theories', 'verdicts')} | {'cuts': [round(c * s['dur'], 2) for c in s.get('cuts', [])]} |
               {'builds': [{'t': round(a * s['dur'], 2), 'end': round(b * s['dur'], 2), 'effect': (EFF.search(d).group(1) if EFF.search(d) else 'fade'), 'desc': d} for a, b, d in s['builds']],
                'vo_marked': s['vo'], 'vo_plain': render_plain(s['text']), 'sources': ids, 'sfx': []})
json.dump(exp, open(os.path.join(OUT, 'slides.json'), 'w'), indent=1)

print(f'Slides {len(SL)} Runtime {RUNTIME}s ({mmss(RUNTIME)}) Words {TOTAL_WORDS} Avg visual gap {MG:.1f}s' + (f" Mid {mmss(mid['start'])}" if mid else ''))
for c, st in CH: print(f'  {mmss(st)} {c}')
print('ISSUES:' if issues else 'No issues.')
for i in issues: print('  -', i)
