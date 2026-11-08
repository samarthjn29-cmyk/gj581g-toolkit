# The continuity sheet page for Sam, generated from story/Scrolls_continuity.json (one source of truth).
import json, html
C = json.load(open('/home/claude/scrolls/story/Scrolls_continuity.json'))
e = html.escape
def ul(items): return '<ul>' + ''.join(f'<li>{e(x)}</li>' for x in items) + '</ul>'
ch = ''.join(f"<tr><td class='t'>{e(c['id'])}</td><td>{e(c['lines'])}</td><td>{e(', '.join(c['sets']))}</td><td>{e(c['light'])}</td></tr>" for c in C['chapters'])
sets = ''.join(f"<div class='c'><h3>{e(s['id'])} <span class='st {'ok' if 'LOCK' in s.get('status','') or 'built' in s.get('status','') else ''}'>{e(s.get('status',''))}</span></h3><p>{e(s['what'])}</p>{ul(s['states']) if 'states' in s else ''}{('<p class=mut>'+e(s['note'])+'</p>') if 'note' in s else ''}</div>" for s in C['sets'])
props = ''.join(f"<tr><td class='t'>{e(p['id'])}</td><td>{e(p['drawing'])}{('<br><b>Size:</b> '+e(p['size'])) if 'size' in p else ''}{('<br><span class=warn>Check: '+e(p['check'])+'</span>') if 'check' in p else ''}</td><td>{ul(p['states'])}</td></tr>" for p in C['props'])
chars = ''.join(f"<tr><td class='t'>{e(c['id'])}</td><td>{e(c['kind'])}</td><td>{ul(c.get('appears', c.get('who', [])))}{('<p class=mut>'+e(c['rule'])+'</p>') if 'rule' in c else ''}</td></tr>" for c in C['characters'])
R = C['rules']
rules = ''.join(f"<li><b>{e(k.replace('_',' '))}:</b> {e(v if isinstance(v,str) else ' · '.join(v))}</li>" for k, v in R.items())
page = f"""<!doctype html><html><head><meta charset=utf-8><style>
body{{margin:0;background:#f4f1ea;font-family:Inter,'DejaVu Sans',sans-serif;color:#1d1d1d;width:1600px}}.w{{padding:36px 48px}}
h1{{font-size:32px;margin:0 0 6px}}h2{{font-size:23px;margin:28px 0 10px}}h3{{font-size:16px;margin:0 0 6px}}p,li{{font-size:14px;line-height:1.45;margin:3px 0}}ul{{margin:4px 0 0 18px;padding:0}}
.sub{{color:#5a5a5a;font-size:16px;line-height:1.5}}.mut{{color:#666}}.warn{{color:#9a5b00}}
table{{border-collapse:collapse;width:100%;background:#fff;font-size:13.6px}}td,th{{border:1px solid #d9d3c7;padding:7px 9px;vertical-align:top}}th{{background:#e9e4da;text-align:left}}td.t{{font-weight:700;white-space:nowrap}}
.grid{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}}.c{{background:#fff;border:1px solid #d9d3c7;padding:12px 14px}}
.st{{font-size:11px;font-weight:700;color:#fff;background:#a8633a;padding:2px 6px;border-radius:3px;margin-left:6px}}.st.ok{{background:#1b5e20}}
.dec li{{font-size:15.5px;margin:8px 0}}</style></head><body><div class=w>
<h1>Scrolls · continuity sheet (the whole video)</h1>
<p class=sub>Decided once, before the remaining scenes are built. Every scene is built against this sheet and an automatic check compares each scene with it. After your OK, you'll see a scene only when it needs a choice this sheet doesn't settle, and when its clip is finished.</p>
<h2>Chapters: sets and light</h2><table><tr><th>Chapter</th><th>Lines</th><th>Sets</th><th>Light</th></tr>{ch}</table>
<h2>Sets (each built once, reused in every state)</h2><div class=grid>{sets}</div>
<h2>Props: one drawing each, every state it passes through</h2><table><tr><th>Prop</th><th>Drawing and size</th><th>States, in story order</th></tr>{props}</table>
<h2>Characters</h2><table><tr><th>Who</th><th>How they're drawn</th><th>Where they appear</th></tr>{chars}</table>
<h2>Rules for every scene</h2><ul>{rules}</ul>
<h2>Looked up before each set is drawn</h2>{ul(C['to_check_before_drawing'])}
<h2>Decided</h2><ul>{''.join(f'<li>{e(d)}</li>' for d in C.get('decided', []))}</ul><p class=mut>{e(C.get('status', ''))}</p>
</div></body></html>"""
open('continuity.html', 'w').write(page)
