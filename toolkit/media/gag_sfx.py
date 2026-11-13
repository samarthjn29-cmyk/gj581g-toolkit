#!/usr/bin/env python3
"""In-house comedy sound effects (no credit needed), Aliens opening, 11 Nov 2026.
  trombone  sad "wah-wah-wah-waaah": four falling notes with a plunger-mute wah (Bb3 A3 Ab3 G3, last one long, wobbling)
  boo       a crowd booing: ~40 voices of a low "ooo" vowel (formants 300/870 Hz), each with its own pitch, drift, onset
  popper    two party-popper cracks with paper-confetti rustle
  register  cash register "ka-ching": drawer clunk + bright bell with partials
  kiss      a soft cartoon "mwah": lip smack + short pitched "ah"
Usage: gag_sfx.py OUTDIR [names...]  (48 kHz mono WAV, peak -3 dBFS)"""
import sys, os, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 48000
rng = np.random.default_rng(7)
t_ = lambda d: np.arange(int(d * SR)) / SR
def bp(x, lo, hi, o=2): b, a = butter(o, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f, o=2): b, a = butter(o, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f / (SR / 2), 'high'); return lfilter(b, a, x)
def env(n, a=0.01, r=0.1):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, max(na, 1)); e[-nr:] *= np.linspace(1, 0, max(nr, 1)); return e
def saw(f, t, ph=0): p = np.cumsum(f / SR) + ph; return 2 * (p % 1) - 1
def norm(x, db=-3): return x / (np.max(np.abs(x)) + 1e-9) * 10 ** (db / 20)

def trombone():
    notes = [(233.1, 0.42), (220.0, 0.42), (207.7, 0.42), (196.0, 1.5)]
    out = []
    for i, (f, d) in enumerate(notes):
        t = t_(d); vib = 1 + (0.012 * np.sin(2 * np.pi * 5.5 * t) * (t > 0.3) if i == 3 else 0)
        bend = 1 - (0.03 * np.clip((t - 0.5) / 1.0, 0, 1) if i == 3 else 0)
        x = sum(saw(f * vib * bend * k, t) / k ** 1.1 for k in (1, 2, 3))
        wah = 0.5 + 0.5 * np.sin(2 * np.pi * (2.2 if i == 3 else 1 / d) * t - np.pi / 2)   # plunger opening
        cut = 500 + 1800 * wah
        y = np.zeros_like(x); blk = 480
        for s in range(0, len(x), blk): y[s:s + blk] = lp(x[s:s + blk], float(np.mean(cut[s:s + blk])))
        out.append(y * env(len(t), 0.03, 0.08 if i < 3 else 0.5))
        out.append(np.zeros(int(0.04 * SR)))
    return norm(np.concatenate(out))

def boo(d=2.6):
    t = t_(d); x = np.zeros_like(t)
    for v in range(40):
        f0 = rng.uniform(110, 230) * (1 + 0.04 * np.sin(2 * np.pi * rng.uniform(0.2, 0.7) * t + rng.uniform(0, 6)))
        on = rng.uniform(0, 0.35); amp = rng.uniform(0.4, 1.0)
        g = (t > on) * np.clip((t - on) / 0.15, 0, 1) * np.clip((d - t) / 0.5, 0, 1)
        src = saw(f0, t, rng.uniform())
        voice = 1.0 * bp(src, 250, 380) + 0.35 * bp(src, 780, 950) + 0.08 * bp(src, 2200, 2600)
        x += amp * g * voice
    x += 0.15 * bp(rng.standard_normal(len(t)), 200, 1500) * np.clip((d - t) / 0.5, 0, 1)   # breath of the room
    return norm(x * env(len(t), 0.1, 0.4))

def popper():
    out = np.zeros(int(1.6 * SR))
    for at in (0.0, 0.33):
        i = int(at * SR); n = int(0.03 * SR)
        crack = rng.standard_normal(n) * np.exp(-np.linspace(0, 9, n))
        out[i:i + n] += hp(crack, 900) * 1.0
        rn = int(1.1 * SR); rust = rng.standard_normal(rn) * (rng.random(rn) < 0.08)   # paper confetti flutter
        out[i + n:i + n + rn] += 0.25 * bp(rust, 2500, 9000) * np.exp(-np.linspace(0, 3, rn))[:len(out[i + n:i + n + rn])]
    return norm(out)

def register():
    out = np.zeros(int(1.6 * SR))
    n = int(0.12 * SR); clunk = lp(rng.standard_normal(n), 900) * np.exp(-np.linspace(0, 6, n))
    out[:n] += 0.8 * clunk
    i = int(0.12 * SR); t = t_(1.4)
    bell = sum(a * np.sin(2 * np.pi * 2093 * k * t) * np.exp(-t * (2.5 + k)) for k, a in ((1, 1), (2.76, .5), (5.4, .25), (8.9, .12)))
    out[i:i + len(t)] += bell
    j = int(0.05 * SR); m = int(0.2 * SR)   # drawer slide
    out[j:j + m] += 0.2 * bp(rng.standard_normal(m), 400, 2500) * np.linspace(1, 0, m)
    return norm(out)

def kiss():
    out = np.zeros(int(0.7 * SR))
    n = int(0.02 * SR); out[:n] += hp(rng.standard_normal(n), 1500) * np.exp(-np.linspace(0, 8, n))
    t = t_(0.35); f = 520 - 180 * t / 0.35
    ah = sum(np.sin(2 * np.pi * np.cumsum(f * k) / SR) / k for k in (1, 2, 3)) * env(len(t), 0.02, 0.2)
    i = int(0.05 * SR); out[i:i + len(t)] += 0.6 * bp(ah, 300, 3000)
    return norm(out, -6)

def airhorn():
    t = t_(1.3); f = 466 * (1 + 0.004 * np.sin(2 * np.pi * 7 * t))
    x = sum(saw(f * r, t) for r in (1, 1.26, 1.5)) / 3            # three horns a chord apart
    x = bp(x, 300, 4000) * env(len(t), 0.02, 0.15)
    gaps = np.ones_like(t); gaps[(t > 0.28) & (t < 0.36)] = 0.05; gaps[(t > 0.64) & (t < 0.72)] = 0.05   # BWAH BWAH BWAAAH
    return norm(np.tanh(3 * x * gaps))

def scratch():
    t = t_(0.55); f = 900 + 700 * np.sin(2 * np.pi * 3.2 * t)       # record pulled back and forth
    x = bp(rng.standard_normal(len(t)), 600, 5000) * (0.5 + 0.5 * np.sin(np.cumsum(f) / SR * 2 * np.pi))
    return norm(x * env(len(t), 0.005, 0.08))

def drumroll(d=1.6):
    out = np.zeros(int((d + 0.6) * SR)); n = int(0.03 * SR)
    for i, at in enumerate(np.arange(0, d, 0.045)):
        k = int(at * SR); hit = bp(rng.standard_normal(n), 150, 3000) * np.exp(-np.linspace(0, 7, n)); out[k:k + n] += hit * (0.4 + 0.6 * at / d)
    k = int(d * SR); m = int(0.5 * SR); tt = t_(0.5)
    out[k:k + m] += 1.4 * (np.sin(2 * np.pi * 60 * tt) * np.exp(-tt * 8) + 0.6 * hp(rng.standard_normal(m), 3000) * np.exp(-tt * 6))   # crash
    return norm(out)

def boom():
    t = t_(1.8); f = 70 * np.exp(-t * 1.2) + 30
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) + 0.5 * lp(rng.standard_normal(len(t)), 400) * np.exp(-t * 3)
    return norm(np.tanh(2 * x))

def whistle():
    t = t_(0.9); f = 600 + 1400 * (t / 0.9) ** 1.5                  # slide whistle up
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.03, 0.15) * (1 + 0.05 * np.sin(2 * np.pi * 6 * t)))

def dundun():
    out = []
    for f, d in ((98, 0.35), (92.5, 0.35), (87.3, 1.3)):              # DUN DUN DUNNN
        t = t_(d); x = sum(saw(f * k, t) / k for k in (1, 2, 3, 4)) + 0.5 * saw(f * 0.5, t)
        out += [lp(x, 1200) * env(len(t), 0.01, 0.2 if d < 1 else 0.8), np.zeros(int(0.08 * SR))]
    return norm(np.concatenate(out))

def whoosh():
    t = t_(0.45); n = rng.standard_normal(len(t)); y = np.zeros_like(n); blk = 480
    for i in range(0, len(n), blk):
        fc = 300 + 4000 * np.sin(np.pi * i / len(n)); y[i:i + blk] = bp(n[i:i + blk], max(80, fc * 0.6), min(20000, fc * 1.4))
    return norm(y * np.sin(np.pi * t / 0.45) ** 2)

def thunder():
    t = t_(1.4); x = lp(rng.standard_normal(len(t)), 220) * np.exp(-t * 2.5) * (1 + 2 * (t < 0.08))
    hit = np.sin(2 * np.pi * 55 * t) * np.exp(-t * 4)
    return norm(np.tanh(2.5 * (x + hit)))

def boing():
    t = t_(0.7); f = 180 + 260 * np.exp(-t * 6) * np.cos(2 * np.pi * 9 * t)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4))

def tada():
    out = []
    for f, d in ((523.3, 0.13), (659.3, 0.13), (784.0, 0.13), (1046.5, 0.7)):   # C E G C, brassy synth
        t = t_(d); x = sum(saw(f * k, t) / k for k in (1, 2, 3)) * 0.5 + 0.3 * np.sin(2 * np.pi * f * 2 * t)
        out.append(lp(x, 3500) * env(len(t), 0.005, 0.05 if d < 0.5 else 0.4))
    return norm(np.concatenate(out))

def kazoo():
    out = []
    for f, d in ((392, 0.18), (440, 0.18), (494, 0.18), (523, 0.6)):
        t = t_(d); vib = 1 + 0.02 * np.sin(2 * np.pi * 6 * t); x = saw(f * vib, t)
        x = bp(x, 400, 3500) + 0.3 * bp(rng.standard_normal(len(t)), 1500, 4000)   # buzzy membrane
        out.append(np.tanh(3 * x) * env(len(t), 0.02, 0.08))
    return norm(np.concatenate(out))

def newsstab():
    t = t_(1.2); x = sum(saw(f, t) for f in (110, 164.8, 220, 277.2)) / 4
    x = lp(x, 2500) * np.exp(-t * 2.2) + 0.6 * np.sin(2 * np.pi * 55 * t) * np.exp(-t * 5) + 0.4 * hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 12)
    return norm(np.tanh(2 * x))

def bell(f, d=0.9, k=4.0):   # struck bell: inharmonic partials, fast attack
    t = t_(d); return sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k * m ** 0.5) for m, a in ((1, 1), (2.76, 0.5), (5.4, 0.25), (8.9, 0.12))) * env(len(t), 0.002, 0.05)

def ding(): return norm(bell(1568, 1.2, 3.0))                         # one clean "ding!" (G6)

def sparkle():                                                       # a glint: a quick rising run of tiny bells + shimmer
    out = np.zeros(int(0.9 * SR))
    for i, f in enumerate((2093, 2637, 3136, 3951, 4699)):
        b = bell(f, 0.5, 9); s = int(i * 0.055 * SR); out[s:s + len(b)] += b * (0.6 + 0.1 * i)
    t = t_(0.9); out += 0.08 * hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * 6)
    return norm(out)

def ticks(d=2.6):                                                    # a stopwatch ticking faster and faster, then a click
    out = np.zeros(int(d * SR)); t = 0.0; gap = 0.32
    while t < d - 0.15:
        tk = t_(0.03); c = hp(rng.standard_normal(len(tk)), 2500) * np.exp(-tk * 260) + 0.5 * np.sin(2 * np.pi * 3200 * tk) * np.exp(-tk * 300)
        s = int(t * SR); out[s:s + len(c)] += c[:len(out) - s]; t += gap; gap = max(0.045, gap * 0.86)
    return norm(out)

def climb(d=1.6):                                                    # a long slide whistle up, for a chart bar that keeps going
    t = t_(d); f = 500 * 2 ** (2.6 * (t / d) ** 1.3)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.05, 0.12) * (1 + 0.06 * np.sin(2 * np.pi * 7 * t)))

def bleep(d=0.6): t = t_(d); return norm(np.sin(2 * np.pi * 1000 * t) * env(len(t), 0.005, 0.01))   # TV censor bleep

def static(d=0.8):                                                   # TV/VHS static burst
    t = t_(d); x = hp(rng.standard_normal(len(t)), 800) * (0.6 + 0.4 * (rng.random(len(t)) > 0.5)); return norm(x * env(len(t), 0.01, 0.15))

def ping():                                                          # phone notification: two soft bell notes
    a = bell(1318.5, 0.35, 7); b = bell(1760, 0.6, 5); out = np.zeros(int(0.8 * SR)); out[:len(a)] += a; s = int(0.12 * SR); out[s:s + len(b)] += b; return norm(out)

def error():                                                         # retro computer error: a low dissonant two-tone buzz
    t = t_(0.5); x = (np.sign(np.sin(2 * np.pi * 220 * t)) + np.sign(np.sin(2 * np.pi * 233 * t))) / 2
    return norm(lp(x, 2500) * env(len(t), 0.005, 0.08))

def pop():                                                           # bubble pop
    t = t_(0.12); f = 900 * np.exp(-t * 30) + 300; return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40))

def click():                                                         # camera shutter: two clicks
    out = np.zeros(int(0.25 * SR))
    for s0 in (0, 0.09):
        tk = t_(0.04); c = hp(rng.standard_normal(len(tk)), 1500) * np.exp(-tk * 160); s = int(s0 * SR); out[s:s + len(c)] += c
    return norm(out)

def squeak():                                                        # marker squeak while a circle is drawn
    t = t_(0.45); f = 2200 + 500 * np.sin(2 * np.pi * 7 * t); return norm(bp(saw(f, t), 1500, 5000) * env(len(t), 0.02, 0.06) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)))

def fall(d=1.3):                                                     # slide whistle down (things going badly)
    t = t_(d); f = 1800 * 2 ** (-2.4 * (t / d) ** 1.2)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.03, 0.15) * (1 + 0.06 * np.sin(2 * np.pi * 7 * t)))
def holdmusic(d=3.4):                                                # telephone hold music: Beethoven's Fur Elise opening (public-domain tune), thin and tinny like a phone line
    E5, Ds5, B4, D5, C5, A4, C4, E4, A3 = 659.3, 622.3, 493.9, 587.3, 523.3, 440.0, 261.6, 329.6, 220.0
    notes = [(E5, .2), (Ds5, .2), (E5, .2), (Ds5, .2), (E5, .2), (B4, .2), (D5, .2), (C5, .2), (A4, .6), (C4, .2), (E4, .2), (A4, .2), (B4, .6)]
    out = []
    for f, du in notes:
        t = t_(du); x = sum(np.sign(np.sin(2 * np.pi * f * k * t)) / k for k in (1, 2)) * env(len(t), .005, .08)   # square-ish chip tone
        out.append(x)
    x = np.concatenate(out)[:int(d * SR)]
    x = bp(x, 400, 3000, 3) + 0.004 * rng.standard_normal(len(x))   # phone band + line hiss
    return norm(x, -6)
def crickets(d=3.0):                                                 # night crickets: a lone chirping insect, for "the universe said... nothing"
    t = t_(d); x = np.zeros_like(t)
    for start in np.arange(0.15, d - 0.3, 0.62):
        for p in range(3):                                           # one chirp = three fast pulses
            s = int((start + p * 0.045) * SR); n = int(0.03 * SR); tt = np.arange(n) / SR
            x[s:s + n] += np.sin(2 * np.pi * 4300 * tt) * np.hanning(n)
    return norm(x * (0.85 + 0.15 * np.sin(2 * np.pi * 0.4 * t)), -6)
def brrr(d=1.0):                                                     # teeth-chattering shiver: fast dry clicks
    t = t_(d); x = np.zeros_like(t)
    for s0 in np.arange(0.02, d - 0.05, 0.055):
        s = int(s0 * SR); n = int(0.012 * SR); x[s:s + n] += rng.standard_normal(n) * np.hanning(n)
    return norm(bp(x, 1500, 6000) * env(len(t), 0.05, 0.3), -6)
def wind(d=2.5):                                                     # cold wind whistling around a metal box
    t = t_(d); n = rng.standard_normal(len(t)); f = 700 + 300 * np.sin(2 * np.pi * 0.35 * t)
    x = sum(bp(n, fc * 0.92, fc * 1.08) for fc in (600, 900)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * t))
    return norm(x * env(len(t), 0.5, 0.8), -6)

# Gag study 12 Nov 2026: "the wrong sound, explained away" (Danny Gonzalez) and the object's POV.
def modem(d=2.2):                                                    # dial-up modem handshake: dial tones, a screech, warbling noise
    t1 = t_(0.35); dial = (np.sin(2 * np.pi * 350 * t1) + np.sin(2 * np.pi * 440 * t1)) * 0.5
    t2 = t_(0.45); scr = np.sin(2 * np.pi * (1800 + 700 * np.sin(2 * np.pi * 9 * t2)) * t2)
    t3 = t_(max(0.3, d - 0.8)); war = np.sign(np.sin(2 * np.pi * np.cumsum(1200 + 900 * np.sign(np.sin(2 * np.pi * 37 * t3))) / SR)) * 0.6 + 0.5 * rng.standard_normal(len(t3))
    x = np.concatenate([dial, scr, bp(war, 600, 3400)])
    return norm(bp(x, 300, 3400, 3), -6)
def choir(d=2.4):                                                    # heavenly "aaah": a stacked major chord of soft vowel-like voices
    t = t_(d); x = np.zeros_like(t)
    for f in (261.6, 329.6, 392.0, 523.3):
        for det in (-0.6, 0, 0.6):
            x += saw((f + det) * (1 + 0.004 * np.sin(2 * np.pi * 5.2 * t)), t, rng.random())   # gentle vibrato
    x = bp(x, 500, 1100) + 0.5 * bp(x, 1000, 1500)                   # an "ah" formant pair
    return norm(x * env(len(t), 0.35, 0.7), -6)
def yelp():                                                          # a short cartoon yelp (not a realistic scream): a fast rising-falling squeal
    t = t_(0.45); f = 700 + 1300 * np.sin(np.pi * t / 0.45) ** 0.6
    x = saw(f, t) * env(len(t), 0.01, 0.12) * (1 + 0.3 * np.sin(2 * np.pi * 30 * t))
    return norm(bp(x, 600, 4500), -4)
def servo(d=0.7):                                                    # a camera servo whirr: a motor tone that spins up and settles, then a tick
    t = t_(d); f = 180 + 260 * np.minimum(1, t / (d * 0.5)) - 80 * np.maximum(0, (t - d * 0.6) / (d * 0.4))
    x = (saw(f, t) * 0.6 + 0.3 * saw(f * 2.01, t)) * env(len(t), 0.03, 0.12)
    s = int((d - 0.06) * SR); x[s:s + 200] += 0.8 * np.hanning(200)
    return norm(bp(x, 150, 3000), -6)

# Gag studies 12 Nov 2026 (second and third): the quiet scream (Map Men), the hidden signal (LEMMiNO), the VCR time skip
# (Internet Historian), the jack-in-the-box (Danny Gonzalez) and the queue (CGP Grey).
def muffled():                                                       # a tiny muffled yelp from a still object, as if from behind glass
    return norm(lp(yelp(), 900, 3) * 0.6, -14)
MORSE = {'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--',
         'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
         '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'}
def morse(text='GJ581G', wpm=20, f=700):                             # a beep "signal" that spells a text in Morse (dot 1 unit, dash 3, gaps 1/3/7)
    u = 1.2 / wpm; out = []
    def tone(n): t = t_(n * u); return np.sin(2 * np.pi * f * t) * env(len(t), 0.004, 0.008)
    for w in text.upper().split():
        for ch in w:
            for sym in MORSE.get(ch, ''):
                out += [tone(1 if sym == '.' else 3), np.zeros(int(u * SR))]
            out.append(np.zeros(int(2 * u * SR)))
        out.append(np.zeros(int(4 * u * SR)))
    x = np.concatenate(out); x = x + 0.01 * rng.standard_normal(len(x))   # a faint hiss under it, like a radio
    return norm(bp(x, 300, 3000), -6)
def ffwd(d=1.0):                                                     # a VCR fast-forward: a chirpy squealing tape whir
    t = t_(d); f = 2400 + 900 * np.sin(2 * np.pi * 13 * t) + 600 * np.sign(np.sin(2 * np.pi * 3 * t))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + 0.3 * bp(rng.standard_normal(len(t)), 1500, 6000)
    return norm(x * env(len(t), 0.02, 0.1), -8)
def creak(d=0.8):                                                    # a lid creaking open: slow, rough, falling clicks
    t = t_(d); x = np.zeros_like(t); rate = 40 + 60 * (t / d)
    pos = np.cumsum(rate / SR); idx = np.where(np.diff(np.floor(pos)) > 0)[0]
    for i in idx: n = 160; x[i:i + n] += np.hanning(n)[:len(x[i:i + n])] * (0.5 + 0.5 * rng.random())
    return norm(bp(x, 300, 2500) * env(len(t), 0.05, 0.2), -6)
def sigh(d=1.1):                                                     # a tired breathy sigh (filtered noise, falling)
    t = t_(d); n = rng.standard_normal(len(t)); x = bp(n, 300, 1800) * np.exp(-2.2 * t / d) * np.minimum(1, t / 0.12)
    return norm(lp(x, 1400), -8)

def knock(n=3, gap=0.22):                                            # knuckles on a wooden door: n dull thuds (Aliens ch5 doorbell gag)
    d = n * gap + 0.3; t = t_(d); x = np.zeros(len(t))
    for k in range(n):
        i = int(k * gap * SR); m = min(len(t) - i, int(0.12 * SR)); tt = np.arange(m) / SR
        x[i:i + m] += (bp(rng.standard_normal(m), 120, 900) * 0.6 + np.sin(2 * np.pi * 180 * tt)) * np.exp(-tt * 45)
    return norm(lp(x, 2500), -4)
def rip(d=0.55):                                                     # paper tearing: crackly noise bursts that speed up then trail off
    t = t_(d); x = np.zeros_like(t); rate = 90 + 260 * np.minimum(1, t / (d * 0.35))
    pos = np.cumsum(rate / SR); idx = np.where(np.diff(np.floor(pos)) > 0)[0]
    for i in idx: n = int(60 + 120 * rng.random()); seg = rng.standard_normal(n) * np.hanning(n); x[i:i + n] += seg[:len(x[i:i + n])] * (0.4 + 0.6 * rng.random())
    x = hp(x, 900) + 0.25 * bp(rng.standard_normal(len(t)), 2000, 7000)
    return norm(x * env(len(t), 0.01, 0.18) * np.exp(-1.2 * t / d), -5)

def blow(d=0.7):                                                     # a breathy puff, blowing dust off something
    t = t_(d); n = rng.standard_normal(len(t)); x = bp(n, 250, 2200) * np.exp(-3.2 * t / d) * np.minimum(1, t / 0.04)
    return norm(lp(x, 2600), -6)
def spit(d=0.35):                                                    # a short dry "ptoo": a lip pop then a spray
    t = t_(d); x = np.zeros(len(t)); m = int(0.03 * SR); tt = np.arange(m) / SR
    x[:m] += np.sin(2 * np.pi * 140 * tt) * np.exp(-tt * 120)
    i0 = int(0.04 * SR); sp = bp(rng.standard_normal(len(t) - i0), 1800, 7000) * np.exp(-np.arange(len(t) - i0) / SR * 14)
    x[i0:] += 0.7 * sp
    return norm(x, -5)

if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    names = sys.argv[2:] or ['trombone', 'boo', 'popper', 'register', 'kiss']
    for n in names:   # morse_HELLO-THERE spells a text in Morse
        x = morse(n.split('_', 1)[1].replace('-', ' ')) if n.startswith('morse_') else globals()[n](); wavfile.write(f'{od}/sfx_{n}.wav', SR, (x * 32767).astype(np.int16)); print(n, f'{len(x) / SR:.2f} s')
