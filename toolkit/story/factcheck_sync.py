#!/usr/bin/env python3
"""Keep the fact-check table in step with the script (3 Nov 2026, after video 2 needed four hand-patched check rounds).

Every script line (narrator and Heckler) and every scene's on-screen note has one row in the fact-check CSV, keyed by
`line` (a line id, or `media:<scene>` for the on-screen note). Each row stores `hash`, a fingerprint of the exact wording
that was checked. A row counts as passed only when its verdict is OK (or "no claim") AND its hash matches the script now.

  factcheck_sync.py script.json factcheck.csv            report: new / changed / removed / not-OK rows; exit 1 if any
  factcheck_sync.py script.json factcheck.csv --update   add rows for new lines and changed wording as PENDING (verdict
                                                          cleared, old verdict kept in first_verdict), drop removed lines,
                                                          then write <csv>.todo.md: just the rows a checker must look at.
                                                          A line whose exact wording passed under another id keeps that verdict.
  factcheck_sync.py script.json factcheck.csv --stamp ID [ID ...] | --stamp-all-ok
                                                          after the checker passes rows: record the current hash
  factcheck_sync.py script.json factcheck.csv --fresh    list time-sensitive lines (rates, "this year", records, "latest")
                                                          to re-check right before upload
The CSV is always written to <csv>.new, re-read, then moved over the old file (a crashed write once wiped half a table).
build.py's voice gate calls check() and refuses to voice if any row is pending, changed or missing."""
import sys, os, csv, json, re, hashlib, shutil, time

PASS = ('OK', 'NO CLAIM')
FIELDS = ['row', 'line', 'where', 'text', 'cited', 'verdict', 'fix', 'first_verdict', 'hash', 'checked']
FRESH = re.compile(r"\b(this (year|month|october|november|december|january|week)|last (year|month|financial year)|today|now|currently|"
                   r"record|weakest|strongest|highest|lowest|latest|so far|at the end of|cost about|costs? about|per dollar|\d{4})\b", re.I)

def items(S):
    """(key, where, text) for every line and every scene's on-screen note, in script order"""
    out, seen = [], set()
    for l in S:
        if l['scene'] not in seen and l.get('media'):
            seen.add(l['scene']); out.append((f"media:{l['scene']}", 'screen', l['media']))
        out.append((l['id'], 'heckler' if l.get('who') == 'heckler' else 'narration', l.get('text', '')))
    return out

def fp(text): return hashlib.sha1(re.sub(r'\s+', ' ', text.strip()).encode()).hexdigest()[:12]

def load(p):
    return list(csv.DictReader(open(p, newline='', encoding='utf-8'))) if os.path.exists(p) else []

def save(p, rows):
    for i, r in enumerate(rows, 1): r['row'] = str(i)
    keys = FIELDS + [k for r in rows for k in r if k not in FIELDS and k]
    keys = list(dict.fromkeys(keys))
    with open(p + '.new', 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=keys, extrasaction='ignore'); w.writeheader(); w.writerows(rows)
    assert len(load(p + '.new')) == len(rows), 're-read mismatch: old CSV kept'
    if os.path.exists(p): shutil.copy(p, p + '.bak')
    os.replace(p + '.new', p)

def check(S, rows):
    """-> dict(missing, changed, pending, removed) lists of keys"""
    by = {r['line']: r for r in rows}; cur = items(S); keys = {k for k, _, _ in cur}
    res = dict(missing=[], changed=[], pending=[], removed=[k for k in by if k not in keys and not k.endswith('-screen')])
    for k, _, t in cur:
        r = by.get(k)
        if not r: res['missing'].append(k)
        elif r.get('hash') and r['hash'] != fp(t): res['changed'].append(k)
        elif not r.get('hash') and r.get('text', '').strip() != t.strip(): res['changed'].append(k)
        elif (r.get('verdict') or '').strip().upper() not in PASS: res['pending'].append(k)
    return res

def main():
    a = sys.argv[1:]; S = json.load(open(a[0])); S = S["lines"] if isinstance(S, dict) else S; p = a[1]; rows = load(p); cur = items(S); text = {k: t for k, _, t in cur}
    if '--fresh' in a:
        for k, w, t in cur:
            if w != 'heckler' and FRESH.search(t): print(f'{k:16s} {t}')
        return
    if '--stamp-all-ok' in a or '--stamp' in a:
        ids = None if '--stamp-all-ok' in a else set(a[a.index('--stamp') + 1:])
        n = 0
        for r in rows:
            if r.get('hash') and r['hash'] != fp(text.get(r['line'], '')): continue  # wording changed since the check: --update and re-check first, never stamp over it
            if not r.get('hash') and ' '.join(r.get('text', '').split()) != ' '.join(text.get(r['line'], '').split()): continue  # no fingerprint yet (older table): the checked wording in `text` must match the script now
            if r['line'] in text and (ids is None or r['line'] in ids) and (r.get('verdict') or '').strip().upper() in PASS:
                r['hash'] = fp(text[r['line']]); r['text'] = text[r['line']]; r['checked'] = r.get('checked') or time.strftime('%Y-%m-%d'); n += 1
        save(p, rows); print(f'stamped {n} rows'); return
    res = check(S, rows)
    if '--update' in a:
        by = {r['line']: r for r in rows}; new = []; carried = []
        # a passed row whose exact wording reappears under another id (a line moved, a script was reordered) keeps its
        # verdict: the check was on the words, not the id (Trial_v1 -> Coffee rewrite, 5 Nov 2026, lost 45 verdicts)
        passed = {fp(r.get('text', '')): r for r in rows if (r.get('verdict') or '').strip().upper() in PASS and r.get('hash') == fp(r.get('text', ''))}
        for k, w, t in cur:
            r = by.get(k)
            if k in res['missing']:
                r = dict(line=k, where=w, text=t, cited='', verdict='', fix='', first_verdict='', hash='', checked='')
            elif k in res['changed']:
                r['first_verdict'] = r.get('first_verdict') or r.get('verdict', ''); r['fix'] = (r.get('fix', '') + f" | was: {r.get('text', '')[:200]}").strip(' |')
                r['text'] = t; r['verdict'] = ''; r['hash'] = ''
            if (r.get('verdict') or '').strip().upper() not in PASS and fp(t) in passed and passed[fp(t)] is not r:
                o = passed[fp(t)]; r.update(verdict=o['verdict'], hash=fp(t), checked=o.get('checked', ''),
                                            fix=f"carried from {o['line']} (identical wording): " + (o.get('fix') or '')[:300]); carried.append(k)
            new.append(r)
        save(p, new)
        if carried: print(f'carried {len(carried)} verdicts by identical wording: {", ".join(carried)}')
        todo = [r for r in new if (r.get('verdict') or '').strip().upper() not in PASS]
        with open(p + '.todo.md', 'w') as f:
            f.write(f'# Rows to check ({len(todo)})\n\nApply toolkit/story/FACTCHECK_CHECKLIST.md to each. Give: line | verdict (OK / no claim / FIX / OVERSTATED / WRONG) | evidence | replacement.\n\n')
            for r in todo: f.write(f"- **{r['line']}** ({r['where']}): {r['text']}\n")
        print(f"updated: {len(res['missing'])} new, {len(res['changed'])} changed, {len(res['removed'])} removed; {len(todo)} rows to check -> {p}.todo.md")
        return
    for k, v in res.items():
        if v: print(f'{k}: {", ".join(v)}')
    sys.exit(1 if any(res[k] for k in ('missing', 'changed', 'pending')) else 0)

if __name__ == '__main__': main()
