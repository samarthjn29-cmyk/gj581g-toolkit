#!/usr/bin/env python3
"""Regenerate styles/GAG_SCHOOLS.md from stills/gag_schools.json (run after adding a school or a recipe)."""
import json, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = json.load(open(f'{B}/stills/gag_schools.json'))['schools']
L = ["# Gag schools: every gag sorted by where it comes from (11 Nov 2026)", "",
 "Sam asked: \"If I ask you to use South Park gags then you should only utilize South Park gags. If I ask you to use some other type of gags then you should utilize those gags.\"", "",
 "**How it works:**",
 "- **One registry:** `toolkit/stills/gag_schools.json`. Every gag in the kit belongs to one or more *schools*, a style family learnt from one of our studies. This file is generated from it by `stills/gag_schools_doc.py`.",
 "- **Asking for a style:** a request like \"use South Park gags\" puts `\"gags\": [\"southpark\"]` on the chapter's plan; several schools can be listed.",
 "- **The check:** `gag_lint.py` runs on every build and stops it if any gag card, or any gag camera move, doesn't belong to a chosen school.",
 "- **House grammar is always allowed:** chapter titles, the yellow spoken-words card, lower text, true-scale bars, and the gentle Ken Burns moves.",
 "- **No style named:** any school may be used, and the build report shows which school each gag came from.",
 "- **Browsing:** the Gag Library page has a Style menu that filters by school.", "", "## The schools", ""]
for k, s in R.items():
    L += [f"### {s['name']}  (`{k}`)", f"Study: `{s['study']}`. Camera moves: {', '.join(s.get('moves', []))}" + (f"; {s['cuts']}" if s.get('cuts') else '') + ".", "",
          "| id | gag | kit card | paired sound | status |", "|---|---|---|---|---|"]
    for r in s['recipes']:
        L.append(f"| `{r['id']}` | {r['name']} | `{', '.join(f'{a}: {b}' for a, b in r['match'].items())}` | {r.get('sound', '-')} | {r.get('status', 'built')} |")
    L.append("")
L += ["## Writing shapes by school (script level, not checked by the build)",
 "- **South Park:** every beat joined by *but* or *therefore*, never *and then*. Find the take while writing. A running gag that escalates, gets banned, then comes back from the person who banned it. Same graphic, reversed meaning. A genre switch as the punchline.",
 "- **Casually Explained:** escalating evidence that always gets the same deadpan verdict. Hold still when the arrangement is the joke.",
 "- **Sam O'Nella:** the picture fact-checks the narrator (a rating badge).",
 "- **OverSimplified:** the repetition gag (\"after three… after FOUR\"), and the pictures get the lines.",
 "- **The Onion / Hindi news:** a sober headline with one swapped word.",
 "- **Unfiltered / British / Schulz toolkits:** voice and delivery (see their own docs). They pair with any picture school."]
open(f'{B}/styles/GAG_SCHOOLS.md', 'w').write('\n'.join(L) + '\n'); print('GAG_SCHOOLS.md:', len(L), 'lines')
