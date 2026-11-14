#!/usr/bin/env python3
"""Stills workflow (8 Nov 2026): scene plan -> timed timeline for Remotion.
Inputs: a scene plan (stills/<scene>.json: shots with `at` line id, optional `word`, `img`, `move`, `layers`; cards),
        tts/timing.json (line starts/ends), the full narration wav.
Does:   cuts the scene's narration slice (vo.mp3), aligns words in it with faster-whisper (word cues), resolves every shot's
        start time (line start, or the cue word inside that line), checks pacing (a picture change at least every 6 s,
        no shot over 9 s unless marked hold) and writes <out>/timeline.json for kit/StillsScene.jsx.
Usage:  build_scene.py PLAN.json TIMING.json VO.wav OUTDIR [--pad 0.4]"""
import json, sys, os, subprocess, argparse, re
import numpy as np

def words(mp3, tmp):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ar', '16000', '-ac', '1', '-f', 'f32le', tmp], check=True)
    from faster_whisper import WhisperModel
    m = WhisperModel('small', device='cpu', compute_type='int8')
    y = np.fromfile(tmp, dtype=np.float32); sr = 16000
    tr = lambda x, off: [[w.word.strip(), round(w.start + off, 2), round(w.end + off, 2)] for s in m.transcribe(x, word_timestamps=True, language='en')[0] for w in s.words]
    W = tr(y, 0)
    # Whisper sometimes skips a whole spoken stretch (Aliens opening, 11 Nov 2026: "make some noise... a hundred million
    # dollars. For ten years of it." vanished, 7 s with no words). Any gap over 2.5 s that has speech in it is transcribed again
    # on its own and the words spliced in.
    edges = [0.0] + [w[2] for w in W]; starts = [w[1] for w in W] + [len(y) / sr]; add = []
    for g0, g1 in zip(edges, starts):
        if g1 - g0 > 2.5:
            seg = y[int(g0 * sr):int(g1 * sr)]
            if len(seg) and np.sqrt(np.mean(seg ** 2)) > 0.02: add += [w for w in tr(seg, g0) if g0 - 0.05 <= w[1] < g1]
    return sorted(W + add, key=lambda w: w[1])

def norm(w): return re.sub(r'[^a-z0-9]', '', w.lower())

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('plan'); ap.add_argument('timing'); ap.add_argument('vo'); ap.add_argument('out'); ap.add_argument('--pad', type=float, default=0.4)
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    P = json.load(open(a.plan)); T = {x['id']: x for x in json.load(open(a.timing))['lines']}
    if P.get('lines'):   # a scene can be part of a chapter: "lib1-lib10"
        a0, a1 = P['lines'].split('-'); order = list(T); ids = order[order.index(a0):order.index(a1) + 1]
    else: ids = [x for x in T if T[x]['scene'] == P['scene']]
    t0 = max(0, T[ids[0]]['start'] - a.pad); t1 = T[ids[-1]]['end'] + a.pad
    mp3 = f'{a.out}/vo.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t0), '-t', str(t1 - t0), '-i', a.vo, '-c:a', 'libmp3lame', '-b:a', '192k', mp3], check=True)
    W = words(mp3, f'{a.out}/vo.f32'); os.remove(f'{a.out}/vo.f32')
    def at(shot):
        ls, le = T[shot['at']]['start'] - t0, T[shot['at']]['end'] - t0
        if not shot.get('word'):   # a line-start cut snaps to just before the line's first heard word, so it never lands mid-word (Aliens ch3)
            fw = [w for w in W if ls - 0.45 <= w[1] <= ls + 0.35]
            return round(max(0, fw[0][1] - 0.04), 2) if fw else round(ls, 2)
        # a cue may list spellings: "word": ["4", "four"] (whisper writes a spoken number either way, and changes its mind after
        # silence is inserted into the voice: Aliens ch1, 12 Nov 2026)
        alts = shot['word'] if isinstance(shot['word'], list) else [shot['word']]
        k = shot.get('k', 0); hits = [w for w in W if ls - 0.3 <= w[1] <= le + 0.3 and any(norm(w[0]).startswith(norm(x)) for x in alts)]
        if len(hits) <= k: sys.exit(f"cue word '{shot['word']}' not found in {shot['at']}")
        return hits[k][1]
    shots = [dict(s, t=at(s)) for s in P['shots']]; shots[0]['t'] = 0.0
    # cut on the beat (BIG_MOVES B8, Sam 14 Nov 2026): plan "beatsnap": {"bed": "music/x.wav", "from": s, "to": s} moves every picture
    # change inside the window onto the nearest beat of the bed (beats.py writes BED.beats.json) when one is within 0.18 s
    bs = P.get('beatsnap')
    if bs:
        bj = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(a.plan))), bs['bed']) + '.beats.json'
        beats = json.load(open(bj))['beats']
        for s in shots[1:]:
            if bs.get('from', 0) <= s['t'] <= bs.get('to', 1e9):
                nb = min(beats, key=lambda b: abs(b - s['t']))
                if abs(nb - s['t']) <= 0.18: s['t'] = round(nb, 3); s['cut'] = True
    cards = [dict(c, t=round(at(c) + c.get('offset', 0), 2)) for c in P.get('cards', [])]   # offset: seconds after the cue (gags)
    # A picture change that lands as a full-screen card ends showed the OLD picture for the card's fade-out (Sam, Aliens opening,
    # 11 Nov 2026: "the stop watch again for a very brief moment"). Move such a change under the card, 0.3 s before it ends,
    # so the card fades out straight onto the new picture. Opaque cards only: kinetic 'short' and 'number' cover the frame.
    # meter steps may be cued on a word instead of an offset: [["Roughly", "ROUGHLY", colour, icon], ...] -> seconds after the
    # card starts (Sam, 12 Nov 2026: "The roughly ... came in early" once pauses were added to the voice)
    for c in cards:
        c['steps'] = [list(x) for x in c.get('steps', [])]
        for st in c['steps']:
            if isinstance(st[0], str):
                hit = [w for w in W if w[1] >= c['t'] - 0.05 and norm(w[0]).startswith(norm(st[0]))]
                if not hit: sys.exit(f"meter step word '{st[0]}' not found after {c['t']}")
                st[0] = round(hit[0][1] - c['t'], 2)
    for c in cards:
        if c.get('kind') not in ('kinetic', 'number', 'bars') or c.get('style') in ('rise', 'roll'): continue
        if not P.get('dissolve', 0): continue   # hard-cut plans: the card cuts straight to the next picture on its word, nothing to hide
        ce = c['t'] + c.get('dur', 4.5)
        for s in shots[1:]:
            if ce - 0.3 < s['t'] <= ce + 0.6: s['t'] = round(ce - 0.3, 3); s['cut'] = True; s.pop('fade', None)   # hard cut, hidden by the card: a dissolve here still ghosted the old picture
    # Two full-screen cards back to back (Sam, Aliens opening v4, 11 Nov 2026: "at 0:23 the alien picture again come back"): the first
    # card's fade-out and the next one's fade-in crossed, so the shot under them showed through for a few frames. Join them with a
    # hard cut: the first runs right up to the second (cutOut), the second appears at once (cutIn).
    opq = sorted([c for c in cards if (c.get('kind') in ('kinetic', 'number', 'bars') and c.get('style') not in ('rise', 'roll'))], key=lambda c: c['t'])
    for c0, c1 in zip(opq, opq[1:]):
        gap = c1['t'] - (c0['t'] + c0.get('dur', 4.5))
        if -0.5 < gap < 0.35: c0['dur'] = round(c1['t'] - c0['t'], 3); c0['cutOut'] = True; c1['cutIn'] = True
    # Hard cuts everywhere (plan dissolve 0, Sam 11 Nov 2026): full-screen cards cut in and out too. Their 0.15-0.4 s fades
    # ghosted the card's words over the next picture and flashed the old picture between two cards (Aliens ch3 review).
    if not P.get('dissolve', 0):
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from opaque import is_opaque   # one shared list (void, black, ...)
        for c in cards:
            if is_opaque(c) and c.get('style') not in ('rise', 'roll') and not (c.get('kind') == 'title' and c['t'] < 0.5):
                c.setdefault('cutIn', True); c.setdefault('cutOut', True)
        # No slivers around a hard-cut card: a picture change just before a card moves onto the card's start; a card that
        # ends just before a picture change runs on to it (Aliens ch2 rebuild, 12 Nov 2026: 0.02-0.04 s slivers)
        for c in [c for c in cards if c.get('cutOut') and is_opaque(c)]:
            ce = c['t'] + c.get('dur', 4.5)
            for s in shots[1:]:
                if c['t'] - 0.35 < s['t'] < c['t'] + 0.05 and c['t'] > 0.1: s['t'] = round(c['t'] + 0.05, 3)   # just after the card's first frame: on the same time, frame rounding showed one frame of the new picture before the card (Sam, Moctar ch04, 14 Nov 2026: "Feels like there is a glitch when the frame changes")
                if ce < s['t'] < ce + 0.8: c['dur'] = round(s['t'] - c['t'], 3)
    dur = round(t1 - t0, 2); fails = []
    for i in range(1, len(shots)):   # Zeigarnik, 9 Nov 2026: a shot listed out of spoken order gave a negative length
        if shots[i]['t'] < shots[i - 1]['t']: fails.append(f"{shots[i]['id']} starts before {shots[i - 1]['id']}: list shots in spoken order")
    for i, s in enumerate(shots):
        end = shots[i + 1]['t'] if i + 1 < len(shots) else dur; s['dur'] = round(end - s['t'], 2)
        if s['dur'] > 9 and not s.get('hold'): fails.append(f"{s['id']} lasts {s['dur']} s (over 9 s): split it or add a card/move")
        if s['dur'] < 1.2: fails.append(f"{s['id']} lasts only {s['dur']} s")
    # Smooth picture changes (Sam, 10 Nov 2026: "the clip will play then stop and then will transition... abrupt"):
    # a soft dissolve into every shot (plan 'dissolve' s; gags and 'cut': true shots keep a hard cut), and footage that is shorter
    # than its time on screen is slowed (rate, never below 0.5) so it never freezes on its last frame before the cut.
    dz = P.get('dissolve', 0)
    for i, s in enumerate(shots):
        if dz and i and not s.get('gag') and not s.get('cut') and s.get('move') != 'punch' and 'fade' not in s: s['fade'] = dz
    for i, s in enumerate(shots):
        if not s.get('video'): continue
        show = s['dur'] + (shots[i + 1].get('fade', 0) if i + 1 < len(shots) else 0)
        vlen = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f"{a.out}/{s['video']}"], capture_output=True, text=True).stdout or 0)
        left = vlen - s.get('vstart', 0)
        if left < show: s['rate'] = round(max(0.5, left / show), 3)
        tail = show - left / s.get('rate', 1)
        if tail > 0.3 and not s.get('freeze_img'): fails.append(f"{s['id']} footage ({s['video']}) runs out {tail:.1f} s before the cut even slowed to 0.5x: longer clip or split the shot")
    big = sorted([c for c in cards if c.get('kind') in ('text', 'title')], key=lambda c: c['t'])   # Zeigarnik, 9 Nov 2026: two text cards drawn on top of each other
    for c0, c1 in zip(big, big[1:]):
        if c1['t'] < c0['t'] + c0.get('dur', 4.5): fails.append(f"text card '{c1['text'][:30]}' starts before '{c0['text'][:30]}' has gone: shorten or drop one")
    pub = os.path.abspath(a.out).split('/public/')[-1]
    json.dump({'dir': pub, 'scene': P['scene'], 't0': round(t0, 3), 'dur': dur, 'words': W, 'shots': shots, 'cards': cards, **({'finish': P['finish']} if P.get('finish') else {})}, open(f'{a.out}/timeline.json', 'w'), indent=1)
    print(f"{P['scene']}: {dur} s, {len(shots)} shots, {len(cards)} cards"); [print('FAIL', f) for f in fails]
    sys.exit(1 if fails else 0)
main()
