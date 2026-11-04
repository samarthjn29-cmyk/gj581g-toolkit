#!/usr/bin/env python3
"""Measure a peer video's script (5 Nov 2026, from the Maxinomics and similar-videos studies).
Usage: script_metrics.py transcript.txt minutes [--first 90]
Prints words/min, spoken numbers/min, average sentence length, share of short (<8 word) sentences,
questions/min, "you" and "I/me/my" per min. Numbers counted as digit groups plus number words.
Analysis only: keep the transcript in the run folder, never in channel docs."""
import sys, re
t = open(sys.argv[1]).read(); mins = float(sys.argv[2])
if '--first' in sys.argv:
    sec = float(sys.argv[sys.argv.index('--first') + 1]); w = t.split(); t = ' '.join(w[:int(len(w) * sec / (mins * 60))]); mins = sec / 60
W = re.findall(r"[A-Za-z0-9'%$.,-]+", t); n = len(W)
NUM = re.compile(r"\$?\d[\d,.]*%?|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|percent)\b", re.I)
S = [s for s in re.split(r'(?<=[.!?])\s+', t) if s.strip()]
L = [len(s.split()) for s in S] or [0]
print(f"words {n} | {n / mins:.0f} wpm | numbers {len(NUM.findall(t)) / mins:.1f}/min | sentences {len(S)}, avg {sum(L) / len(L):.1f} words, "
      f"short {sum(1 for x in L if x < 8) / len(L):.0%} | questions {t.count('?') / mins:.1f}/min | you {len(re.findall(r'\byou(r|rs)?\b', t, re.I)) / mins:.1f}/min | "
      f"I/me/my {len(re.findall(r'\b(I|me|my)\b', t)) / mins:.1f}/min")
print('(punctuation-free auto captions make the sentence figures unreliable; say so in the study)')
