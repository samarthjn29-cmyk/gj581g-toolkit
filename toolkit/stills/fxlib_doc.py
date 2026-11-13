"""Write styles/EFFECTS_LIBRARY.md from fxlib.py (the library is the source; this doc is generated, never hand-edited).
  python3 toolkit/stills/fxlib_doc.py OUT.md
Entries whose source names a date in gag_pass.NOT_FOR are marked "from the next video" (held out of the current video's gag menu)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__)); sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'gags'))
import fxlib
try: from gag_pass import NOT_FOR
except Exception: NOT_FOR = {}

HEAD = """# Effects library: camera moves, cards, picture gags and sounds

Built 11 Nov 2026 for Sam ("a detailed library of picture gags and various effects which we can give on our pictures and videos"); generated from `toolkit/stills/fxlib.py` by `toolkit/stills/fxlib_doc.py` (last on {date}), so the doc lists every entry in the kit ({n}), including the gags from the daily gag studies (`styles/GAG_STUDY_LOG.md`). Every entry works in the stills kit today (`kit/StillsScene.jsx` + `kit/Gags.jsx` + `kit/Gags2.jsx`). Regenerate the demo reel and previews with `toolkit/stills/fxlib.py`.

**How to use one:** add the shot fields or the card to the scene plan (`stills/<scene>.json`), cue it on a heard word, then add the paired sound to the mix with `mix_bed.py --sfx sfx/sfx_<name>.wav@<cue time + offset>:-29`. Sam's clean cuts use voice + gag sounds only (`--bed none`, 11 Nov 2026), with gag sounds on as many gags as fit.

**In the gag pass:** `toolkit/gags/gag_pass.py pack` lists every picture gag, card, gag move and habit below as `library / <id>` for the writer (Lottie animations and video overlays are left out: they are not in the painted format). **Gags from the 13 Nov 2026 studies (marked below) are in the menu from the video after Aliens** (Sam, 13 Nov 2026: "start using them from next video onwards"); the 11-12 Nov ones are in from Aliens chapter 5.

**Rules:** pictures at least 2 s on screen; text gags up for 0.8 s + 0.3 s a word; one gag per beat; back-to-back full-screen cards hard-cut; sounds about 12 dB under the voice and never on top of a fact the viewer must follow; gags punch up; no real logos or AI likenesses of real people; on-screen figures and quotes are the fact-checked spoken ones ("demo" text in the plans below is a placeholder, never a fact).

## Painted format (Sam, 12 Nov 2026: "make sure every gag is used in the AI animated painted format")
- Every picture follows `stills/STYLE_PAINTED.md` (gouache repaint, Nano Banana 2). Every gag card is drawn through the **painted finish**: put `"painted": true` in the timeline's `finish` (fxlib's demo has it on).
- What it does to the cards: a slow brush-edge wobble that re-seeds every `boil` frames (default 4: the hand-made "animated painting" boil; `0` = still), paper grain inside the card shapes only, and a warm gouache shift (`paintSat` 0.85, `paintSepia` 0.16) so white reads as cream and red as brick. `paintEdge` sets the wobble (default 5 px).
- Cards that read the picture behind them (freeze grey-out, blur censor, VHS glitch) are kept outside the painted wrapper, so they still work.
- The gag-study cards (`Gags2.jsx`) are painted-native: palette forest green #2E4A33, cream #F1E6CF, parakeet yellow #E8C547, brick #A6432F, charcoal #2A2724; hand-lettered labels on cream brush-shaped chips.
- Cut-out gags (puppet path, jack-in-the-box and its sign, clones, queue, giant hand, outline, recap host, palm, void and hero object, blueprint, picture sum, mascot stand-in, call-in alien) need cut-out PNGs: generate the object, repaint it with the painted recipe, then remove the background (Recraft or Adobe). fxlib draws simple painted stand-ins only for the demo.
- Tested: the 28 gags of 12 Nov, the 9 of the 13 Nov fourth study, the 8 of the fifth study and the 9 of the sixth study rendered in the painted finish (preview reels sent to Sam), plus 16 older cards.
"""
SECTIONS = [('Camera move', 'Camera moves'), ('Gag move', 'Gag moves'), ('Card', 'Cards'), ('Picture gag', 'Picture gags'), ('Animation', 'Animations'),
            ('Habit', 'Habits (sound and writing shapes, no card of their own)')]
TAIL = """
Real recorded sounds (Mixkit, prefix `r:` in the plans) are listed in `fxlib.py` REAL and the Gag Library page.

## Growing the library
- Build the remaining shapes in `PICTURE_GAGS_CATALOGUE.md`.
- New gag shapes come from the daily gag study (`styles/GAG_STUDY_LOG.md`); each one gets a card or a habit row here, in the painted format, and a start date in `gag_pass.py` NOT_FOR when Sam names one.
- Real recorded sounds (Freesound CC0, Pixabay, Mixkit) where the synthesised ones sound fake; Sam's own reaction sounds.
- Every new video adds 2-3 entries; Sam's notes become rules here.
"""
J = lambda d: json.dumps(d, ensure_ascii=False)

def plan(e):
    sh, cd = e['plan']['shot'], e['plan']['card']
    if sh and cd: return f'`shot {J(sh)} + {J(cd)}`'
    if sh: return f'`shot {J(sh)}`'
    if cd: return f'`{J(cd)}`'
    return '-'

def main(out, date='13 Nov 2026'):
    E = fxlib.entries(); L = [HEAD.format(date=date, n=len(E)), '']
    for grp, title in SECTIONS:
        L += [f'## {title}', '', '| id | name | use it for | plan fields | paired sound | shape from |', '|---|---|---|---|---|---|']
        for e in E:
            if e['group'] != grp: continue
            mark = ' **· from the next video**' if any(d in e['source'] for d in NOT_FOR) else ''
            L.append(f"| `{e['id']}` | {e['name']} | {e['use']} | {plan(e)} | {', '.join(e['sounds']) or '-'} | {e['source'] or '-'}{mark} |")
        L.append('')
    L += ['## Sounds (`toolkit/media/gag_sfx.py OUTDIR <names>`, in-house, no credit)', '', '| name | what it is |', '|---|---|'] + [f'| `{n}` | {w} |' for n, w in fxlib.SOUNDS]
    open(out, 'w').write('\n'.join(L) + '\n' + TAIL); print(out, len(E), 'entries')

if __name__ == '__main__': main(*sys.argv[1:])
