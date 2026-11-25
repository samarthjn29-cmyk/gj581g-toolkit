"""Beat_Sheet rows 2-40 (act 1) for WCL-E01 act 1 v2, from the act file (Gate 2 approved 25 Nov 2026).
usage (from library/): python3 ../episodes_src/WCL-E01/gate3_act1v2/beat_rows.py OUT_dump.json"""
import json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
a = json.load(open("src/episodes/ep01-act01-v2.json"))
mus = json.load(open("src/episodes/ep01-act01-v2.music.json"))
lines = [x.get("text") or x.get("line") or "" for x in json.load(open(os.path.join(HERE, "..", "gate1", "act1_beats.json")))]
HEAD = ["Beat", "Act", "Start_Sec", "End_Sec", "Duration_Sec", "Frames_30fps", "Pacing_Check", "Spoken_Line", "Visual_ID", "Text_ID", "Motion_ID", "Transition_ID", "Look_ID", "SFX_ID", "Music_ID", "Texture_ID", "Map_ID", "Packaging_ID", "Source_ID", "Proof_Asset_File", "New_Assets_Flag", "Callout_&_Director_Notes", "Registry_Check"]
COL = {"VIS": 8, "TXT": 9, "MOT": 10, "TRN": 11, "LOK": 12, "SFX": 13, "MUS": 14, "TEX": 15, "MAP": 16, "PKG": 17, "SRC": 18}
rows = [HEAD]
n = 0
for b in a["beats"]:
    for bid, s, e in b["beatTimes"]:
        ids = {k: [] for k in COL}
        def put(x):
            p = x.split("-")[0]
            if p in ids and x not in ids[p]:
                ids[p].append(x)
        for x in b["assets"]:
            if x.split("-")[0] not in ("SFX", "MUS"):
                put(x)
        put("LOK-033")
        for c in a["audio"]:
            end = c.get("endSec", c["atSec"] + 0.5)
            if (s <= c["atSec"] < e) or (c["atSec"] < s and end > s and c.get("endSec")):
                put(c["id"])
        for cid, c in zip(mus["ids"]["cues"], mus["cues"]):
            if c["at"] < e and c["until"] > s:
                put(cid)
        if not ids["VIS"]:  # the shot's own component is its visual (EarthFlyIn MAP-013, HalftoneMoire LOK-017, title cards PKG)
            comp = {"EarthFlyIn": "MAP-013", "HalftoneMoire": "LOK-017", "SeriesTitleCard": "PKG-005", "EpisodeCard": "PKG-006"}.get(b["component"])
            if comp:
                ids["VIS"].append(comp)
        d = round(e - s, 2)
        pace = "OK" if 2.0 <= d <= 3.5 else ("Too Fast" if d < 2.0 else "Too Slow")
        chips = [c["text"] for p in b.get("overlay", {}).get("chips", []) for c in p["chips"] if s <= b["start"] + c["atSec"] < e]
        note = f"Act 1 v2 (Gate 2 approved 25 Nov 2026; rework_act1_v2.py): shot {b['id']} {b['component']}" + (f", in: {b['transitionIn']}" if b.get("transitionIn") and s == b["start"] else "") + "."
        if chips:
            note += " Chips: " + " / ".join(chips) + "."
        if bid == "E01-A1-01":
            note += " Earth fly-in onto Kendal (TODAY tag), pin on 'Kendal'; whoosh on the plunge; boundary to 02 moved 2.95 -> 3.70 (in the pause)."
        if bid == "E01-A1-02":
            note += " Focus match into Kitchin's 1794 scrap, Kendal circled; scrap sinks as the candle comes up; KENDAL · AUTUMN 1792."
        if bid == "E01-A1-07":
            note += " The candle wipes to TODAY daylight; the flower moves to the centre."
        line = lines[n] if n < len(lines) else ""
        n += 1
        row = [bid, "1", f"{s:.2f}", f"{e:.2f}", f"{d:.2f}", str(round(d * 30)), pace, line] + [", ".join(ids[k]) for k in COL] + ["", "", note, ""]
        rows.append(row)
json.dump({"values": rows}, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)
print(len(rows) - 1, "rows")
