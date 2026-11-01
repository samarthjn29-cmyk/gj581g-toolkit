"""Voiceover helpers: markup parsing, timing estimate, per-sentence number check, renderers."""
import re, math
from xml.sax.saxutils import escape

TOKEN = re.compile(r"\[(beat|pause|long pause|pause:\s*[0-9.]+)\]")
# Second "viewer" voice (toolkit 1.9): {viewer: Wait, they looked right at it?} is spoken by the VIEWER voice in synth.py.
VIEWER = re.compile(r"\{viewer:\s*([^}]*)\}")
WPS = 2.6          # speaking rate, words per second (excluding pauses)
PAD = 0.4          # lead-in/out pad per clip
BEAT, PAUSE, LONG = 0.3, 0.7, 1.2

NUMW = ("one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen "
        "sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety "
        "hundred thousand million billion half third quarter").split()
_NUM = "|".join(NUMW)
RUN = re.compile(rf"\b(?:{_NUM})\b(?:[\s-]+(?:(?:and|point)\s+)?(?:{_NUM})\b)*", re.I)
DIGIT = re.compile(r"\d")


def pause_seconds(text):
    total = 0.0
    for m in TOKEN.finditer(text):
        t = m.group(1)
        if t == "beat": total += BEAT
        elif t == "pause": total += PAUSE
        elif t == "long pause": total += LONG
        else: total += float(t.split(":")[1])
    return total


def spoken(text):
    t = VIEWER.sub(lambda m: m.group(1), text)
    t = TOKEN.sub(" ", t)
    t = t.replace("*", "")
    return re.sub(r"\s+", " ", t).strip()


def word_count(text):
    return len(re.findall(r"[A-Za-z0-9']+", spoken(text)))


def estimate(text):
    return word_count(text) / WPS + pause_seconds(text) + PAD


def sentences(text):
    s = spoken(text).replace("...", "…")
    parts = re.split(r"(?<=[.?!])\s+", s)
    return [p.replace("…", "...") for p in parts if p.strip()]


def number_runs(sentence):
    s = re.sub(r"world war two|second world war", " ", sentence, flags=re.I)
    s = re.sub(r"\band a half\b", " ", s, flags=re.I)
    return RUN.findall(s) + DIGIT.findall(s)


def numbers_report(text):
    """Return list of (sentence, runs) where a sentence holds more than one number."""
    bad = []
    for s in sentences(text):
        runs = number_runs(s)
        if len(runs) > 1:
            bad.append((s, runs))
    return bad


# ---------- renderers ----------
def _clean(s):
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\s+([,.?!])", r"\1", s)
    return s.strip()


def render_plain(text):
    text = VIEWER.sub(lambda m: f"(Viewer: {m.group(1).strip()})", text)
    out, last = [], 0
    for m in TOKEN.finditer(text):
        out.append(text[last:m.start()])
        prev = "".join(out).rstrip()
        at_end = prev.endswith((".", "?", "!", "\u2026"))
        t = m.group(1)
        if t == "beat":
            out.append(" " if at_end else " \u2014 ")
        elif t == "pause":
            out.append("\n\n" if at_end else " ... ")
        elif t == "long pause":
            out.append("\n\n...\n\n" if at_end else " ...... ")
        else:
            n = float(t.split(":")[1])
            out.append("\n\n" + "...\n\n" * max(1, int(round(n / 1.5))))
        last = m.end()
    out.append(text[last:])
    s = "".join(out).replace("*", "")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" *\n *", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def render_ssml(text):
    text = VIEWER.sub(lambda m: f'<voice name="viewer">{m.group(1).strip()}</voice>', text)
    parts, last = [], 0
    for m in TOKEN.finditer(text):
        parts.append(("t", text[last:m.start()]))
        t = m.group(1)
        if t == "beat": ms = 300
        elif t == "pause": ms = 700
        elif t == "long pause": ms = 1200
        else: ms = int(float(t.split(":")[1]) * 1000)
        parts.append(("b", ms))
        last = m.end()
    parts.append(("t", text[last:]))
    out = []
    for kind, val in parts:
        if kind == "b":
            out.append(f'<break time="{val}ms"/>')
        else:
            seg = escape(val).replace('&lt;voice name="viewer"&gt;', '<voice name="viewer">').replace('&lt;/voice&gt;', '</voice>')
            seg = re.sub(r"\*([^*]+)\*", r'<emphasis level="moderate">\1</emphasis>', seg)
            out.append(seg)
    body = _clean("".join(out))
    return f"<speak>{body}</speak>"


def render_tags(text):
    def sub(m):
        t = m.group(1)
        if t == "beat": return " [short pause] "
        if t == "pause": return " [pause] "
        if t == "long pause": return " [long pause] "
        n = float(t.split(":")[1])
        return " [long pause] " * max(1, int(round(n / 1.2)))
    t = VIEWER.sub(lambda m: f" [second voice, curious viewer:] {m.group(1).strip()} [narrator:] ", text)
    t = TOKEN.sub(sub, t)
    t = re.sub(r"\*([^*]+)\*", lambda m: m.group(1).upper(), t)
    return _clean(t)
