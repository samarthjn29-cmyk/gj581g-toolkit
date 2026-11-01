"""Write src/scenes_gen.jsx from story/slides.json: a working scene for every slide, timed to the narration.
Usage: gen_scenes.py src/data/slides.json src/scenes_gen.jsx [--manifest media/prepared/manifest.json]

Fully generated (usually final): title-slide, map (chapter map, first map's rows on their build times, a hidden chapter
decoding when a later map reveals it), word-card (each line on its first spoken word), hypotheses, scorecard, video-full.
Everything else gets its background (full-bleed clip from the manifest, or paper), action title, video panel, source line
and brand, plus a red dashed TODO box per planned build at its time: replace them in scenes_custom.jsx with the real
content (house style: dot charts, big numbers, labelled photos, paper sheets...). run.py refuses to render while TODO boxes
remain. All times go through snapCue(), so planned builds land on the nearest spoken word.
"""
import sys, json, os, argparse

ap = argparse.ArgumentParser(); ap.add_argument('slides'); ap.add_argument('out'); ap.add_argument('--manifest')
a = ap.parse_args()
S = json.load(open(a.slides)); M = json.load(open(a.manifest)) if a.manifest and os.path.exists(a.manifest) else {}
clips = {}
for name, m in M.items():
    clips.setdefault(m['slide'], []).append((os.path.basename(m['path']), m.get('w', 1920) >= 1900))
js = lambda v: json.dumps(v, ensure_ascii=False)

def builds(d):
    return sorted([(b['t'], b.get('desc', '')) for b in d.get('builds', []) if not b.get('desc', '').lower().startswith('action title')])

def bt(d, i, default):
    b = builds(d); return round(b[i][0], 2) if i < len(b) else default

out = ["// Written by gen_scenes.py from slides.json. Don't edit: copy a scene into scenes_custom.jsx to change it.",
       "import React from 'react';",
       "import {C, cue, snapCue, Footage, PaperBg, Stage, Head, Source, Brand, Note} from './lib';",
       "import {Tint, Todo, VidPanel, ChapterMap, WordCard, TitleCard, Suspects, Scorecard} from './layouts';",
       "const cueOr = (n, w, t) => { try { return cue(n, w); } catch (e) { return snapCue(n, t); } };", ""]
prev_hidden = None; first_map = True
for d in S:
    n, L = d['n'], d['layout']; full = [c for c, f in clips.get(n, []) if f]; panel = [c for c, f in clips.get(n, []) if not f]
    video = js(full[0]) if full else 'null'
    if L == 'title-slide':
        out.append(f"export const S{n} = () => <TitleCard video={{{video}}} title={{{js(d['head'])}}} sup={{{js(d.get('sup'))}}} supAt={{snapCue({n}, {bt(d, 0, 2.5)})}} brandAt={{snapCue({n}, {bt(d, 1, 4)})}} />;")
    elif L == 'map':
        items = d.get('map_items') or []; hid = d.get('map_hidden') or []; cur = d.get('map_current', 0)
        rowats = ''
        if first_map:
            ts = [round(t, 2) for t, _ in builds(d)][1:] or []
            if len(ts) >= 1:
                ts = (ts + [ts[-1] + 0.8] * len(items))[:len(items)]
                rowats = f" rowAts={{[{', '.join(f'snapCue({n}, {t})' for t in ts)}]}}"
        rev = ''
        if prev_hidden is not None:
            newly = [i for i in prev_hidden if i not in hid]
            if newly: rev = f" revealIndex={{{newly[0]}}} reveal={{snapCue({n}, {bt(d, 0, 0.6)})}}"
        out.append(f"export const S{n} = () => <ChapterMap items={{{js(items)}}} video={{{video}}} current={{{cur}}} hidden={{{js(hid)}}}{rowats}{rev} />;")
        prev_hidden = hid; first_map = False
    elif L == 'word-card':
        lines = d.get('lines') or [d['head']]
        ats = []
        for i, l in enumerate(lines):
            w = ''.join(ch for ch in l.split()[0] if ch.isalnum() or ch in "'-") if l.split() else ''
            ats.append(f"cueOr({n}, {js(w)}, {bt(d, i, 0.3 + i)})")
        out.append(f"export const S{n} = () => <WordCard video={{{video}}} lines={{{js(lines)}}} ats={{[{', '.join(ats)}]}} />;")
    elif L == 'hypotheses':
        th = d.get('theories') or []; b = builds(d)
        ats = [f"snapCue({n}, {round(b[i][0], 2) if i < len(b) else 2 + 2.5 * i})" for i in range(len(th))]
        pill = f" pillAt={{snapCue({n}, {round(b[len(th)][0], 2)})}}" if len(b) > len(th) else ''
        out.append(f"export const S{n} = () => <Suspects n={{{n}}} theories={{{js(th)}}} ats={{[{', '.join(ats)}]}}{pill} />;")
    elif L == 'scorecard':
        v = d.get('verdicts') or []; b = builds(d)
        at = [f"snapCue({n}, {round(b[2 * k][0], 2) if 2 * k < len(b) else 2 + 6 * k})" for k in range(len(v))]
        va = [f"snapCue({n}, {round(b[2 * k + 1][0], 2) if 2 * k + 1 < len(b) else 4 + 6 * k})" for k in range(len(v))]
        foot = f" footnote={{<Note at={{snapCue({n}, {bt(d, 2 * len(v), d['dur'] - 4)})}} x={{0.6}} y={{6.42}} w={{9.6}} text={{{js(d.get('caveat') or '')}}} />}}" if d.get('caveat') else ''
        out.append(f"export const S{n} = () => <Scorecard n={{{n}}} verdicts={{{js(v)}}} ats={{[{', '.join(at)}]}} verdictAts={{[{', '.join(va)}]}}{foot} />;")
    elif L == 'video-full':
        if full: out.append(f"export const S{n} = () => <Footage src={{{video}}} drift={{0}} />;")
        else: out.append(f"export const S{n} = () => <Todo text={{{js('full-screen clip: ' + str(d.get('media') or ''))}}} />;")
    else:
        media = bool(full); body = []
        body.append(f"<Footage src={{{video}}} /><Tint k={{0.35}} />" if full else "<PaperBg />")
        st = [f"<Head n={{{n}}}{' media' if media else ''} />"]
        y = 1.9; bs = builds(d)
        if panel:
            st.append(f"<VidPanel src={js(panel[0])} at={{snapCue({n}, {round(bs[0][0], 2) if bs else 0.5})}} />")
        w = 6.3 if panel else 12.1
        for t, desc in bs:
            st.append(f"<Todo x={{0.6}} y={{{round(y, 2)}}} w={{{w}}} h={{0.8}} at={{snapCue({n}, {round(t, 2)})}} text={js(f'[{L}] {desc}')} />"); y = min(y + 0.9, 5.6)
        if d.get('snippet'):
            sn = d['snippet']; st.append(f"<Todo x={{0.6}} y={{{round(min(y, 5.6), 2)}}} w={{{w}}} h={{0.8}} at={{0.5}} text={js('PaperSheet for snippet: ' + sn['text'] + ' (' + sn['attribution'] + ')')} />")
        if d.get('caveat'):
            st.append(f"<Note at={{snapCue({n}, {round(d['dur'] * 0.7, 2)})}} x={{0.6}} y={{6.35}} w={{9.6}}{' media' if media else ''} text={js(d['caveat'])} />")
        st.append(f"<Source n={{{n}}}{' media' if media else ''} /><Brand{' media' if media else ''} />")
        out.append(f"export const S{n} = () => <>{''.join(body)}<Stage>{''.join(st)}</Stage></>;")
open(a.out, 'w').write('\n'.join(out) + '\n')
todo = sum(l.count('<Todo') for l in out)
print(f'wrote {a.out}: {len(S)} scenes, {todo} TODO boxes to replace in scenes_custom.jsx')
