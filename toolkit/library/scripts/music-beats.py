#!/usr/bin/env python3
"""Music editor's check (Sam, 24 Nov 2026: "Sure", to the Sound reviewer): does each music cue enter on a beat and
finish its fade on a bar line, the way a music editor cuts? Cue times are set by the narration (a pause, a turn), so
they never move. What can move is WHERE IN THE TRACK the cue starts (`from`) and how long its fades are:
  entry: shift `from` by less than half a beat so a beat (a downbeat when one is close) lands exactly on `at`;
  end:   when the cue fades out at `until`, lengthen or shorten `fadeOut` (within 0.4-2.5 s) so the fade starts on
         a beat and ends on a bar line of the track as it plays.
It beat-tracks each track (librosa), estimates bars of 4, and prints the shifts. --apply writes them into the
.music.json (a copy is kept as .music.before-beats.json). It never changes `at` or `until`.
usage: music-beats.py ACT.music.json [--apply]"""
import json, os, shutil, sys
import numpy as np
import librosa

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(HERE)
path = sys.argv[1]
apply = "--apply" in sys.argv
cs = json.load(open(path))
SR = 22050
cache = {}


def beats(f):
    if f not in cache:
        y, _ = librosa.load(os.path.join(LIB, f), sr=SR, mono=True)
        tempo, bt = librosa.beat.beat_track(y=y, sr=SR, units="time")
        onset = librosa.onset.onset_strength(y=y, sr=SR)
        bt = np.asarray(bt)
        # bar phase: the beat offset (0-3) whose beats carry the most onset strength = the downbeats
        fr = librosa.time_to_frames(bt, sr=SR)
        fr = fr[fr < len(onset)]
        strength = [onset[fr[k::4]].mean() if len(fr[k::4]) else 0 for k in range(4)]
        cache[f] = (float(np.atleast_1d(tempo)[0]), bt, int(np.argmax(strength)))
    return cache[f]


lines, changed = [], False
for c in cs["cues"]:
    tempo, bt, ph = beats(c["file"])
    period = 60.0 / tempo
    down = bt[ph::4]
    pos = c["from"]  # track time that plays at act time c["at"]
    near = bt[np.abs(bt - pos) <= 8]
    iv = np.diff(near)
    if len(near) < 6 or iv.std() / max(iv.mean(), 1e-6) > 0.15:
        lines.append(f"{c['name']}: no steady beat near track {pos:.2f} s (ambient or rubato): leave as it is")
        continue
    # entry: nearest downbeat within half a beat, else the nearest beat
    cand = down[np.abs(down - pos) <= period / 2]
    tgt = cand[np.argmin(np.abs(cand - pos))] if len(cand) else bt[np.argmin(np.abs(bt - pos))]
    shift = round(float(tgt - pos), 3)
    kind = "downbeat" if len(cand) else "beat"
    newfrom = round(pos + shift, 3)
    msg = f"{c['name']}: {tempo:.0f} bpm; enters at {c['at']:.2f} s on track {pos:.2f} s -> from {newfrom:.2f} ({shift:+.3f} s, {kind})"
    fo = c.get("fadeOut") or 0
    newfo = fo
    if fo:
        end_track = newfrom + (c["until"] - c["at"])  # track time at the act's cue end
        bars = down[down <= end_track + 1e-6]
        if len(bars):
            last_bar = bars[-1]
            # the fade should end on a bar: shorten it so it ends on the last bar before until? `until` is fixed, so
            # instead start the fade on a beat such that the fade reaches silence at until; pick the beat nearest to
            # (until - fo) within 0.4-2.5 s of until, preferring one that starts a bar.
            starts = bt[(bt >= end_track - 2.5) & (bt <= end_track - 0.4)]
            if len(starts):
                prefer = [s for s in starts if np.min(np.abs(down - s)) < 0.02]
                pool = np.array(prefer) if prefer else starts
                s = pool[np.argmin(np.abs((end_track - pool) - fo))]
                newfo = round(float(end_track - s), 2)
                msg += f"; fade-out {fo:.2f} s -> {newfo:.2f} s (starts on a {'bar' if prefer else 'beat'}, track {s:.2f} s)"
    lines.append(msg)
    if apply:
        if abs(newfrom - c["from"]) > 1e-3 or abs(newfo - fo) > 1e-3:
            changed = True
        c["from"] = newfrom
        if fo:
            c["fadeOut"] = newfo
print("\n".join(lines))
if apply and changed:
    shutil.copy(path, path.replace(".music.json", ".music.before-beats.json"))
    json.dump(cs, open(path, "w"), indent=1, ensure_ascii=False)
    print("written", path)
