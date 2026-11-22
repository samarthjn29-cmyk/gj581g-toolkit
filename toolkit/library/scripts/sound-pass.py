#!/usr/bin/env python3
"""Sound pass for an act (22 Nov 2026; rules from the study of Chris Moran's "The VOX Sound Design System", analysis
only, mapped onto our calm look and Sam's standing sound rules). Reads the act file, lists every visible motion
the shot props declare, checks the act's sound cues against the rules, and suggests cues from the SFX kits.
  usage: sound-pass.py ACT.json --words WORDS.json [--lead 0.8] [--out report.md]
Rules (each finding names its rule):
  H  Hierarchy and restraint: sound the shot's ONE hero motion (the biggest thing moving, e.g. the building
     emerging), never the text and arrows around it. At most one hero sound plus one texture layer per shot.
  S  Stack: a hero move may carry ONE texture under it (paper under a whoosh when the thing moving is paper),
     8-10 dB under the hero.
  V  Variation: never the same file twice within 10 s; use the kit's other variant (v1/v2/v3) or another sound
     of the same family. (Moran rate-stretches; we use variants, and never stretch or pitch anything on the voice.)
  J  J-cut: a sound that belongs to the next scene starts 0.1-0.3 s BEFORE the cut, so the ear is ready.
  L  Levels, measured against the narration: hero sounds 8-16 dB under the voice, textures 16-24 dB under,
     ambience 24-30 dB under (Moran: dialogue about -6 dB, sound effects -10 to -20, music about -20).
  W  Words: a hero sound sits in a pause, not on a spoken word (Sam's rule for picture sounds); textures
     20+ dB under the voice may run under words.
  M  Motion with no sound: listed as a suggestion only; restraint (H) decides whether it is worth one.
Exit code 1 when an existing cue breaks V, L (too loud) or W."""
import argparse, json, os, re, subprocess, sys

LIB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = json.load(open(os.path.join(LIB, "scripts", "data", "registry_values.json")))["values"]
ROWS = {r[0]: r for r in REG if r}
_cache = {}


def paths(aid):
    r = ROWS.get(aid)
    return [p.strip() for p in (r[4] if r and len(r) > 4 else "").split(";") if p.strip()]


def lufs(path):
    if path in _cache:
        return _cache[path]
    full = os.path.join(LIB, path)
    if not os.path.exists(full):
        _cache[path] = None
        return None
    o = subprocess.run(["ffmpeg", "-nostats", "-i", full, "-af", "apad=pad_dur=0.4,loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    try:
        v = float(json.loads(o[o.rindex("{"): o.rindex("}") + 1])["input_i"])
    except Exception:
        v = None
    _cache[path] = v
    return v


def loud(path):
    """(start, end, peak dBFS) of the file's loud stretch: the 50 ms windows within 6 dB of its loudest one.
    Rule W is judged on this stretch, not on the cue's start (review of act 1 v9: a whoosh starting in a pause
    peaked 0.5 s later, on a word)."""
    key = "loud:" + path
    if key in _cache:
        return _cache[key]
    full = os.path.join(LIB, path)
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", full, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], capture_output=True).stdout
    import numpy as np
    x = np.frombuffer(r, dtype=np.float32).astype(float)
    h = 2400
    e = np.array([np.sqrt(np.mean(x[i:i + h] ** 2)) + 1e-12 for i in range(0, max(1, len(x) - h), h // 2)])
    db = 20 * np.log10(e)
    idx = np.where(db >= db.max() - 6)[0]
    # the peak is read on 10 ms windows, so a click (all its energy in a few ms) is not averaged away
    e10 = np.array([np.sqrt(np.mean(x[i:i + 480] ** 2)) + 1e-12 for i in range(0, max(1, len(x) - 480), 240)])
    out = (idx[0] * h / 2 / 48000, (idx[-1] * h / 2 + h) / 48000, float(max(db.max(), 20 * np.log10(e10.max()) - 3)))
    _cache[key] = out
    return out


# What a sound is for, by kit (the suggestion table). family: hero | texture | ambience
KIT = {
    "move": ("SFX-020", "hero", "low whoosh (rotate v1/v2/v3)"),
    "move_fast": ("SFX-021", "hero", "air whoosh"),
    "fold": ("SFX-021", "hero", "cloth slide (a window or panel collapsing)"),
    "paper": ("SFX-016", "texture", "paper movement under the move"),
    "page": ("SFX-006", "hero", "a document arriving"),
    "line": ("SFX-017", "hero", "pencil (literal) or SFX-018 ticks (creative)"),
    "mark": ("SFX-017", "hero", "marker stroke on the highlight"),
    "photo": ("SFX-003", "hero", "shutter click as a photograph lands"),
    "switch": ("SFX-019", "hero", "switch click (something turning on, a hole opening)"),
    "count": ("SFX-015", "hero", "count lock tick"),
    "beam": ("SFX-001", "hero", "soft whoosh rising with the beam"),
    "screen": ("SFX-007", "hero", "key press or mouse click"),
}
BANDS = {"hero": (-16, -8), "texture": (-24, -16), "ambience": (-30, -24)}


def walk(o, pre=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield pre + k, v
            yield from walk(v, pre + k + ".")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield pre + str(i), v
            yield from walk(v, pre + f"{i}.")


def motions(shot):
    """(time in act seconds, kind, what) for each motion the props declare."""
    s0 = shot["start"]
    p = shot.get("props", {})
    out = []
    if shot.get("transitionIn") in ("push", "slide"):
        out.append((s0, "move", f"{shot['transitionIn']} into the shot"))
    c = shot["component"]
    for k, v in walk(p):
        if not isinstance(v, dict) or not isinstance(v.get("atSec"), (int, float)) or v["atSec"] < 0:
            continue
        t = s0 + v["atSec"]
        leaf = k.split(".")[-1]
        if leaf in ("push", "out", "loupe"):
            out.append((t, "move", f"{c} {leaf}"))
        elif leaf == "open":
            out.append((t, "switch", f"{c} opens"))
        elif leaf == "trace":
            out.append((t, "line", "trace draws on"))
        elif leaf == "callout":
            out.append((t, "mark", "callout highlights"))
        elif leaf == "fill" and v.get("style") == "mark":
            out.append((t, "mark", f"marker on '{v.get('word')}'"))
        elif re.match(r"pieces\.\d+$", k):
            out.append((t, "paper", f"collage piece {v.get('srcId') or v.get('file') or ''}".strip()))
        elif re.match(r"objects\.\d+$", k) and v.get("kind") in ("shutter", "hole"):
            out.append((t, "switch", f"{v['kind']} appears"))
        elif re.match(r"objects\.\d+$", k) and v.get("kind") == "beam":
            out.append((t, "beam", "light beam draws"))
    if c == "YearCounter":
        out.append((s0 + p.get("lockSec", 0) if isinstance(p.get("lockSec"), (int, float)) else s0, "count", "counter lock"))
    return sorted(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("act")
    ap.add_argument("--words", required=True)
    ap.add_argument("--lead", type=float, default=0.8)
    ap.add_argument("--out")
    a = ap.parse_args()
    act = json.load(open(a.act))
    W = [(t, s + a.lead, e + a.lead) for t, s, e in json.load(open(a.words))]
    shots = act["beats"]
    vpath = paths(act["voice"]["id"])[0]
    vL = lufs(vpath) or -16.0
    cues = sorted(act.get("audio", []), key=lambda c: c["atSec"])
    lines, bad = [], 0
    lines.append(f"# Sound pass: {act['episodeId']}\n")
    lines.append(f"Voice {act['voice']['id']} at {vL:.1f} LUFS. {len(shots)} shots, {len(cues)} cues.\n")

    def shot_at(t):
        # a sound up to 0.4 s before a cut belongs to the next shot (rule J: its lead-in)
        for s in shots:
            if 0 < s["start"] - t <= 0.4:
                return s
        for s in shots:
            if s["start"] - 1e-6 <= t < s["end"]:
                return s
        return shots[-1]

    def on_word(t, d=0.25):
        return next((w for w in W if w[1] < t + d and w[2] > t + 0.03), None)

    # --- existing cues
    lines.append("## Existing cues\n")
    lines.append("| t (s) | cue | shot | level vs voice | findings |\n|---|---|---|---|---|")
    last_file = {}
    per_shot = {}
    for c in cues:
        f = c.get("file") or (paths(c["id"]) or [""])[0]
        L = lufs(f)
        rel = None if L is None else L + c.get("volumeDb", 0) - vL
        sh = shot_at(c["atSec"])
        per_shot.setdefault(sh["id"], []).append(c)
        fam = "ambience" if (c.get("endSec", c["atSec"]) - c["atSec"]) > 4 else ("texture" if rel is not None and rel < -20 else "hero")
        if ROWS.get(c["id"], ["", ""])[1] == "7_Music":
            fam = "music"
        fx = []
        if f in last_file and c["atSec"] - last_file[f] < 10:
            fx.append(f"V: same file {c['atSec'] - last_file[f]:.1f} s after the last one; use another variant")
            bad += 1
        last_file[f] = c["atSec"]
        if rel is not None and fam in BANDS:
            lo, hi = BANDS[fam]
            if rel > hi + 2:
                fx.append(f"L: {rel:+.1f} dB is louder than a {fam} sound ({lo}..{hi})")
                bad += 1
            elif rel < lo - 4:
                fx.append(f"L: {rel:+.1f} dB may be lost ({fam} band {lo}..{hi})")
        ls, le, pk = loud(f) if os.path.exists(os.path.join(LIB, f)) else (0, 0.25, -99)
        # loudest 50 ms against the voice's own 50 ms peaks (speech peaks run about 6 dB over its LUFS); short clicks
        # read far too low when their loudness is averaged over the file
        prel = pk + c.get("volumeDb", 0) - (vL + 6)
        w = next((w for w in W if w[1] < c["atSec"] + le - 0.06 and w[2] > c["atSec"] + ls + 0.06), None)
        on_word_ok = "on the word" in (ROWS.get(c["id"], [""] * 11)[10] or "").lower()  # e.g. SFX-015: a lock ON its word
        if fam != "ambience" and fam != "music" and w and prel > -20 and not on_word_ok:
            fx.append(f"W: its loud part ({c['atSec'] + ls:.2f}-{c['atSec'] + le:.2f}, {prel:+.1f} dB vs voice) is on '{w[0]}' ({w[1]:.2f}-{w[2]:.2f})")
            bad += 1
        cut = min(shots, key=lambda s: abs(s["start"] - c["atSec"]))
        if fam == "hero" and 0 <= c["atSec"] - cut["start"] <= 0.12 and cut["start"] > 0.5:
            fx.append(f"J: on the cut at {cut['start']:.2f}; try {cut['start'] - 0.2:.2f} (0.2 s lead)")
        lines.append(f"| {c['atSec']:.2f} | {c['id']}{(' ' + os.path.basename(f)) if c.get('file') else ''} {c.get('volumeDb', 0):+g} dB | {sh['id']} {sh['component']} | {'' if rel is None else f'{rel:+.1f} dB'} ({fam}) | {'; '.join(fx) or 'ok'} |")
    for sid, cs in per_shot.items():
        heroes = [c for c in cs if (c.get("endSec", c["atSec"]) - c["atSec"]) <= 4 and ROWS.get(c["id"], ["", ""])[1] != "7_Music"]
        if len(heroes) > 2:
            lines.append(f"\nH: shot {sid} has {len(heroes)} short sounds; keep one hero and one texture.")

    # --- motions and suggestions
    lines.append("\n## Motions and suggestions (restraint first: one hero per shot)\n")
    lines.append("| shot | component | motion | t (s) | sounded? | suggestion |\n|---|---|---|---|---|---|")
    covered = 0
    for s in shots:
        ms = motions(s)
        have = per_shot.get(s["id"], [])
        if have:
            covered += 1
        hero_done = bool(have)
        for i, (t, kind, what) in enumerate(ms):
            near = [c for c in have if abs(c["atSec"] - t) < 0.6]
            if near:
                lines.append(f"| {s['id']} | {s['component']} | {what} | {t:.2f} | yes ({near[0]['id']}) | |")
                continue
            kid, fam, desc = KIT[kind]
            w = on_word(t - 0.1)
            if not hero_done and fam == "hero":
                at = t - 0.1
                pause = "" if not w else f" (on '{w[0]}': move into the pause after it, or play it as a texture, 20 dB under)"
                lines.append(f"| {s['id']} | {s['component']} | {what} | {t:.2f} | no | M: {kid} {desc} at {at:.2f}{pause} |")
                hero_done = True
            elif fam == "texture" and i < 3:
                lines.append(f"| {s['id']} | {s['component']} | {what} | {t:.2f} | no | S: {kid} {desc}, only if this shot's hero is paper |")
            else:
                lines.append(f"| {s['id']} | {s['component']} | {what} | {t:.2f} | no | H: leave silent (one hero per shot) |")
    lines.append(f"\nShots with a sound: {covered} of {len(shots)}.")
    txt = "\n".join(lines) + "\n"
    if a.out:
        open(a.out, "w").write(txt)
    print(txt)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
