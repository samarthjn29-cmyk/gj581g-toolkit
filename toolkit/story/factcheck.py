"""Fact-check checklist (toolkit 2.0): every claim a viewer will see or hear, paired with the source-map entry it cites,
for an INDEPENDENT fact-check agent to verify against the source files before narration is recorded.

Usage: factcheck.py story/slides.json project.py out.csv
Rows: every on-screen text with a number or an [S#] tag (title, subtitle, visual spec, caveat; navigation slides skipped), every snippet
(must be verbatim, under 15 words), and every narration sentence that carries a number (digits or spelled: "half",
"thirty percent", "one in four", "five seconds"; a bare "one:" list number is not a claim) or a comparison word ("most", "twice", "more likely"...).
Columns: row, slide, where, text, cited, source_claim, source_quote, report, location, verdict, fix
The agent fills verdict (OK / WRONG / UNSUPPORTED / OVERSTATED / CHECK) and fix; run.py voice stops while any row is
WRONG, UNSUPPORTED or OVERSTATED. Also prints the rows that cite nothing."""
import sys, json, re, csv, runpy

S = json.load(open(sys.argv[1])); proj = runpy.run_path(sys.argv[2]); out = sys.argv[3]
SRC = {s[0]: s for s in proj.get('SOURCES', [])}
SMALL = r"\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(in|out of|of every|of (the|them|us|those)|percent|times|hundred|thousand|million|billion|seconds?|minutes?|hours?|days?|weeks?|months?|years?|people|participants|observers|radiologists|subjects|studies)\b"
NUMW = r"\b(zero|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|half|third|quarter|percent|per cent|twice|double|triple|times|dozen)\b"
CMPW = r"\b(most|majority|minority|almost all|nearly all|more likely|less likely|fewer|least|highest|lowest|doubled|halved|record|every|never|always)\b"
tags = lambda t: sorted(set(re.findall(r'\[(S\d+[a-z]?)\]', t or '')))
has_claim = lambda t: bool(re.search(r'\d', t) or re.search(NUMW, t, re.I) or re.search(SMALL, t, re.I) or re.search(CMPW, t, re.I))
rows = []
SKIP = {'map', 'title-slide', 'hypotheses', 'section-divider', 'agenda'}   # navigation slides: no claims (scorecards are checked)
def add(d, where, text, cited=None):
    cited = cited if cited is not None else (tags(text) or d.get('sources') or [])
    ss = [SRC.get(sid, (sid, '(not in SOURCES)', '', '', '', '', '')) for sid in cited]; j = lambda k: ' | '.join(x[k] for x in ss)
    rows.append(dict(row=len(rows) + 1, slide=d['n'], where=where, text=re.sub(r'\s+', ' ', text).strip(), cited='; '.join(cited),
                     source_claim=j(1), source_quote=j(2), report=j(3), location=j(4), verdict='', fix=''))
for d in S:
    if d['layout'] in SKIP: continue
    for k in ['head', 'sup', 'caveat', 'visual']:
        t = d.get(k)
        if t and (has_claim(t) or tags(t)): add(d, k, t, tags(t) or (d.get('sources') or []))
    for k in ['lines', 'theories']:
        for t in d.get(k) or []:
            if has_claim(t): add(d, k, t)
    for v in d.get('verdicts') or []:
        add(d, 'verdict', f"{v.get('theory')}: score {v.get('score')}; {v.get('note', '')}")
    sn = d.get('snippet')
    if sn:
        words = len(sn['text'].split())
        add(d, f'SNIPPET verbatim ({words} words{", OVER 15" if words >= 15 else ""})', f"\"{sn['text']}\" ({sn.get('attribution', '')})", [sn['sid']] if sn.get('sid') else (d.get('sources') or []))
    vo = re.sub(r'\[[^\]]*\]|\*|\{viewer:|\}', ' ', d.get('vo_plain') or ' '.join(d.get('vo_marked') or []))
    for sent in re.split(r'(?<=[.?!])\s+', vo):
        if has_claim(sent): add(d, 'narration', sent)
with open(out, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else ['row']); w.writeheader(); w.writerows(rows)
none = [r for r in rows if not r['cited']]
print(f'wrote {out}: {len(rows)} rows to verify ({sum(1 for r in rows if r["where"].startswith("SNIPPET"))} snippets); {len(none)} cite no source:')
for r in none[:40]: print(f"  slide {r['slide']} {r['where']}: {r['text'][:110]}")
