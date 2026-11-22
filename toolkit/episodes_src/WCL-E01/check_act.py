"""Voice pre-check for one WCL-E01 act take (the toolkit precheck expects named scenes; this script has numbered acts).
Transcribes with faster-whisper medium.en (word times), compares with the act's script lines (numbers as words),
reports word differences with times, long mid-sentence pauses, pace, and writes NN_<name>_words.json.
usage: python3 check_act.py ACT_NUMBER MP3 OUT_WORDS.json"""
import sys, json, re, difflib, subprocess
import numpy as np
from num2words import num2words
from faster_whisper import WhisperModel

act, mp3, outw = int(sys.argv[1]), sys.argv[2], sys.argv[3]
S = json.load(open("/home/claude/wcl/ep01/story/WCL-E01_script_v2.json"))
lines = [l for l in S["lines"] if l["scene"] == act]
text = " ".join(l["text"] for l in lines)

def words(t):
    t = re.sub(r"\[[^\]]*\]", " ", t)
    t = t.replace("’", "'").replace("-", " ")
    out = []
    for w in t.split():
        w = re.sub(r"[^\w']", "", w).lower()
        if not w:
            continue
        if w.isdigit():
            n = int(w)
            s = num2words(n, to="year") if 1000 < n < 2100 else num2words(n)
            out += [x for x in re.sub(r"[^a-z ]", " ", s.replace("-", " ")).split()]
        else:
            out.append(w.strip("'"))
    return [w for w in out if w and w != "and" or w == "and"]

script = words(text)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.float32)
m = WhisperModel("medium.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(x, language="en", beam_size=5, word_timestamps=True)
W = []
for s in segs:
    for w in s.words:
        W.append([w.word.strip(), round(w.start, 2), round(w.end, 2)])
json.dump(W, open(outw, "w"))
heard = []
idx = []
for i, (w, a, b) in enumerate(W):
    for k in words(w):
        heard.append(k)
        idx.append(i)
sm = difflib.SequenceMatcher(a=script, b=heard, autojunk=False)
print(f"act {act}: {len(lines)} lines, script {len(script)} words, heard {len(heard)}; match {sm.ratio():.3f}")
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == "equal":
        continue
    t = W[idx[min(j1, len(idx) - 1)]][1] if idx else 0
    print(f"  {op:8s} at {t:6.2f} s: script '{' '.join(script[i1:i2])}' / heard '{' '.join(heard[j1:j2])}'")
span = W[-1][2] - W[0][1]
print(f"pace: {len(script)} script words over {span:.1f} s = {len(script) / span * 60:.1f} wpm (first word {W[0][1]:.2f} s, last ends {W[-1][2]:.2f} s)")
gaps = [(W[i][2], W[i + 1][1] - W[i][2], W[i][0]) for i in range(len(W) - 1)]
mid = [g for g in gaps if g[1] > 0.75 and not re.search(r"[.?!,;:\"”]$", g[2])]
print("long pauses mid-sentence (>0.75 s, no punctuation):", [(round(a, 2), round(d, 2), w) for a, d, w in mid] or "none")
