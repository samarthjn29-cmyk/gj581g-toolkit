#!/usr/bin/env python3
"""Apply slide transitions, auto-advance timing, and entrance animations to a .pptx.

Usage: python apply_timing.py deck_raw.pptx timing.json -o deck.pptx [--list]

--list prints every shape name on every slide (use these in timing.json).

timing.json
{
  "default_transition": "fade",
  "slides": {
    "1": {
      "advance_s": 18.0,                 # auto-advance after N seconds (omit to leave manual)
      "transition": "push-left",         # see TRANSITIONS below
      "transition_dur_s": 0.5,
      "animations": [
        {"shape": "Big number", "effect": "zoom", "start_s": 0.4, "dur_s": 0.5}
      ],
      "sfx": [ {"t": 0.4, "name": "pop", "gain_db": -6} ]   # used by make_audio.py, ignored here
    }
  }
}
Effects: fade, zoom, wipe-from-left/right/top/bottom, fly-from-left/right/top/bottom.
Transitions: none, fade, push-left/right/up/down, wipe-left/right/up/down,
cover-left/right/up/down, pull-left/right/up/down, zoom-in, zoom-out, dissolve.
All effects start automatically from the slide start (no clicks) at start_s.
"""
import argparse, json, re, shutil, sys, zipfile
from lxml import etree

P = "http://schemas.openxmlformats.org/presentationml/2006/main"
NS = {"p": P}
DIRS = {"left": "l", "right": "r", "up": "u", "down": "d"}

def transition_xml(name, dur_s, advance_s):
    spd = "fast" if dur_s <= 0.5 else ("med" if dur_s <= 0.8 else "slow")   # fast = 0.5 s (1.7.2: quicker cover-to-motion hand-off)
    attrs = f' spd="{spd}"'
    if advance_s is not None:
        attrs += f' advTm="{int(round(advance_s * 1000))}"'
    child = ""
    if name and name != "none":
        m = re.match(r"(push|wipe|cover|pull)-(left|right|up|down)$", name)
        if m:
            child = f'<p:{m.group(1)} dir="{DIRS[m.group(2)]}"/>'
        elif name == "fade":
            child = "<p:fade/>"
        elif name == "dissolve":
            child = "<p:dissolve/>"
        elif name in ("zoom-in", "zoom-out"):
            child = f'<p:zoom dir="{name.split("-")[1]}"/>'
        else:
            raise SystemExit(f"Unknown transition '{name}'")
    return f'<p:transition xmlns:p="{P}"{attrs}>{child}</p:transition>'

class Ids:
    def __init__(self, start=3): self.n = start
    def next(self):
        v = self.n; self.n += 1; return v

def visibility_set(ids, spid):
    return (f'<p:set><p:cBhvr><p:cTn id="{ids.next()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="visible"/></p:to></p:set>')

def anim_num(ids, spid, attr, dur, v0, v1):
    def val(v):
        return f'<p:val><p:fltVal val="{v}"/></p:val>' if isinstance(v, (int, float)) else f'<p:val><p:strVal val="{v}"/></p:val>'
    return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="{ids.next()}" dur="{dur}" fill="hold"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:tavLst><p:tav tm="0">{val(v0)}</p:tav><p:tav tm="100000">{val(v1)}</p:tav></p:tavLst></p:anim>')

def fade_effect(ids, spid, dur, filt="fade"):
    return (f'<p:animEffect transition="in" filter="{filt}"><p:cBhvr><p:cTn id="{ids.next()}" dur="{dur}"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>')

WIPE = {"from-left": (8, "wipe(left)"), "from-right": (2, "wipe(right)"), "from-top": (1, "wipe(up)"), "from-bottom": (4, "wipe(down)")}
FLY = {"from-left": (8, "ppt_x", "0-#ppt_w/2", "#ppt_x"), "from-right": (2, "ppt_x", "1+#ppt_w/2", "#ppt_x"),
       "from-top": (1, "ppt_y", "0-#ppt_h/2", "#ppt_y"), "from-bottom": (4, "ppt_y", "1+#ppt_h/2", "#ppt_y")}

def effect_xml(ids, spid, effect, start_ms, dur_ms):
    outer = ids.next()
    if effect == "play":
        inner_id = ids.next()
        return (f'<p:par><p:cTn id="{outer}" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="withEffect">'
                f'<p:stCondLst><p:cond delay="{start_ms}"/></p:stCondLst><p:childTnLst><p:cmd type="call" cmd="playFrom(0.0)">'
                f'<p:cBhvr><p:cTn id="{inner_id}" dur="{dur_ms}" fill="hold"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:cmd>'
                f'</p:childTnLst></p:cTn></p:par>')
    if effect == "fade":
        preset, sub, body = 10, 0, visibility_set(ids, spid) + fade_effect(ids, spid, dur_ms)
    elif effect.startswith("wipe-"):
        sub, filt = WIPE[effect[5:]]
        preset, body = 22, visibility_set(ids, spid) + fade_effect(ids, spid, dur_ms, filt)
    elif effect == "zoom":
        preset, sub = 53, 16
        body = (visibility_set(ids, spid) + anim_num(ids, spid, "ppt_w", dur_ms, 0, "#ppt_w")
                + anim_num(ids, spid, "ppt_h", dur_ms, 0, "#ppt_h") + fade_effect(ids, spid, dur_ms))
    elif effect.startswith("fly-"):
        sub, attr, v0, v1 = FLY[effect[4:]]
        preset = 2
        body = visibility_set(ids, spid) + anim_num(ids, spid, attr, dur_ms, v0, v1)
    else:
        raise SystemExit(f"Unknown effect '{effect}'")
    return (f'<p:par><p:cTn id="{outer}" presetID="{preset}" presetClass="entr" presetSubtype="{sub}" fill="hold" nodeType="withEffect">'
            f'<p:stCondLst><p:cond delay="{start_ms}"/></p:stCondLst><p:childTnLst>{body}</p:childTnLst></p:cTn></p:par>')

def timing_xml(effects):
    ids = Ids(5)  # ids 1-4 are the fixed wrapper nodes
    inner = "".join(effect_xml(ids, spid, eff, st, du) for spid, eff, st, du in effects)
    media = "".join(f'<p:video><p:cMediaNode vol="0"><p:cTn id="{ids.next()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst></p:cTn>'
                    f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cMediaNode></p:video>' for spid, eff, st, du in effects if eff == "play")
    return (f'<p:timing xmlns:p="{P}"><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
            f'<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>'
            f'<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>'
            f'</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn>'
            f'<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            f'<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>{media}'
            f'</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')

def shape_ids(root):
    out = {}
    for el in root.iter("{%s}cNvPr" % P):
        out.setdefault(el.get("name"), int(el.get("id")))
    return out

def dedupe_ids(root):
    """pptxgenjs can give an embedded audio icon the same shape id as another shape.
    Duplicate ids make PowerPoint ask to repair the file and make animation targets ambiguous."""
    els = list(root.iter("{%s}cNvPr" % P))
    seen, nxt, fixed = set(), max([int(e.get("id")) for e in els] + [1]) + 1, 0
    for e in els:
        i = int(e.get("id"))
        if i in seen:
            e.set("id", str(nxt)); seen.add(nxt); nxt += 1; fixed += 1
        else:
            seen.add(i)
    return fixed

def process_slide(xml_bytes, cfg, default_tr):
    root = etree.fromstring(xml_bytes)
    dedupe_ids(root)
    for tag in ("transition", "timing"):
        for el in root.findall("p:" + tag, NS):
            root.remove(el)
    anchor = root.find("p:clrMapOvr", NS)
    if anchor is None:
        anchor = root.find("p:cSld", NS)
    idx = list(root).index(anchor) + 1
    tr_name = cfg.get("transition", default_tr)
    adv = cfg.get("advance_s")
    if tr_name != "none" or adv is not None:
        root.insert(idx, etree.fromstring(transition_xml(tr_name, cfg.get("transition_dur_s", 0.5), adv)))
        idx += 1
    anims = cfg.get("animations", [])
    if anims:
        names = shape_ids(root)
        effects = []
        for a in anims:
            spid = a.get("id") or names.get(a["shape"])
            if spid is None:
                raise SystemExit(f"Shape '{a['shape']}' not found. Run with --list to see names.")
            effects.append((spid, a.get("effect", "fade"), int(a.get("start_s", 0) * 1000), int(a.get("dur_s", 0.5) * 1000)))
        root.insert(idx, etree.fromstring(timing_xml(effects)))
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pptx"); ap.add_argument("timing", nargs="?"); ap.add_argument("-o", "--out")
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()
    zin = zipfile.ZipFile(a.pptx)
    slides = sorted([n for n in zin.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)], key=lambda n: int(re.findall(r"\d+", n)[0]))
    if a.list:
        for n in slides:
            root = etree.fromstring(zin.read(n))
            print(n, "->", ", ".join(f"{k} (id {v})" for k, v in shape_ids(root).items()))
        return
    if not (a.timing and a.out):
        sys.exit("Need timing.json and -o output.pptx")
    cfg = json.load(open(a.timing))
    default_tr = cfg.get("default_transition", "fade")
    zout = zipfile.ZipFile(a.out, "w", zipfile.ZIP_DEFLATED)
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename in slides:
            num = str(int(re.findall(r"\d+", item.filename)[0]))
            data = process_slide(data, cfg.get("slides", {}).get(num, {}), default_tr)
        zout.writestr(item, data)
    zout.close()
    print(f"Wrote {a.out} with timing for {len(slides)} slides")

if __name__ == "__main__":
    main()
