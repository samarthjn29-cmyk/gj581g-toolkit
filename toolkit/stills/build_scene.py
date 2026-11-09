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
    segs, _ = m.transcribe(np.fromfile(tmp, dtype=np.float32), word_timestamps=True, language='en')
    return [[w.word.strip(), round(w.start, 2), round(w.end, 2)] for s in segs for w in s.words]

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
        if not shot.get('word'): return round(ls, 2)
        k = shot.get('k', 0); hits = [w for w in W if ls - 0.3 <= w[1] <= le + 0.3 and norm(w[0]).startswith(norm(shot['word']))]
        if len(hits) <= k: sys.exit(f"cue word '{shot['word']}' not found in {shot['at']}")
        return hits[k][1]
    shots = [dict(s, t=at(s)) for s in P['shots']]; shots[0]['t'] = 0.0
    cards = [dict(c, t=at(c)) for c in P.get('cards', [])]
    dur = round(t1 - t0, 2); fails = []
    for i in range(1, len(shots)):   # Zeigarnik, 9 Nov 2026: a shot listed out of spoken order gave a negative length
        if shots[i]['t'] < shots[i - 1]['t']: fails.append(f"{shots[i]['id']} starts before {shots[i - 1]['id']}: list shots in spoken order")
    for i, s in enumerate(shots):
        end = shots[i + 1]['t'] if i + 1 < len(shots) else dur; s['dur'] = round(end - s['t'], 2)
        if s['dur'] > 9 and not s.get('hold'): fails.append(f"{s['id']} lasts {s['dur']} s (over 9 s): split it or add a card/move")
        if s['dur'] < 1.2: fails.append(f"{s['id']} lasts only {s['dur']} s")
    big = sorted([c for c in cards if c.get('kind') in ('text', 'title')], key=lambda c: c['t'])   # Zeigarnik, 9 Nov 2026: two text cards drawn on top of each other
    for c0, c1 in zip(big, big[1:]):
        if c1['t'] < c0['t'] + c0.get('dur', 4.5): fails.append(f"text card '{c1['text'][:30]}' starts before '{c0['text'][:30]}' has gone: shorten or drop one")
    pub = os.path.abspath(a.out).split('/public/')[-1]
    json.dump({'dir': pub, 'scene': P['scene'], 't0': round(t0, 3), 'dur': dur, 'words': W, 'shots': shots, 'cards': cards}, open(f'{a.out}/timeline.json', 'w'), indent=1)
    print(f"{P['scene']}: {dur} s, {len(shots)} shots, {len(cards)} cards"); [print('FAIL', f) for f in fails]
    sys.exit(1 if fails else 0)
main()
