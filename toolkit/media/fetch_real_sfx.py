#!/usr/bin/env python3
"""Fetch the real recorded gag sounds the library names (Mixkit, free licence for use in videos; files are not kept in this repo
because the licence does not allow re-sharing them as sound files). Writes OUTDIR/mk_<name>.mp3 and appends OUTDIR/pick.tsv
(name, Mixkit id, Mixkit title) the way fxlib.py REAL reads it.
  python3 toolkit/media/fetch_real_sfx.py /home/claude/<video>/sfx_real [names...]
Added 14 Nov 2026 (gag study, eighth study: Technology Connections' [canned laughter] and [maniacal laughter] cues)."""
import os, subprocess, sys

SOUNDS = {   # name: (Mixkit id, Mixkit title, what it is for)
    'laugh_canned': (343, 'Small crowd laugh and applause', 'sitcom laugh after a deliberately bad pun'),
    'laugh_crowd': (414, 'Crowd laugh', 'a bigger audience laugh'),
    'laugh_evil': (411, 'Evil dwarf laugh', 'cartoon villain laugh on an evil-plan line'),
    'laugh_troll': (2993, 'Troll warrior laugh', 'a deep villain laugh'),
}

def fetch(od, names):
    os.makedirs(od, exist_ok=True); tsv = os.path.join(od, 'pick.tsv'); have = open(tsv).read() if os.path.exists(tsv) else ''
    for n in names:
        mid, title, _ = SOUNDS[n]; f = os.path.join(od, f'mk_{n}.mp3')
        subprocess.run(['curl', '-sS', '-f', '-m', '60', '-o', f, f'https://assets.mixkit.co/active_storage/sfx/{mid}/{mid}-preview.mp3'], check=True)
        if f'{n}\t' not in have:
            with open(tsv, 'a') as t: t.write(f'{n}\t{mid}\t{title}\n')
        print(n, os.path.getsize(f), 'bytes')

if __name__ == '__main__':
    fetch(sys.argv[1], sys.argv[2:] or list(SOUNDS))
