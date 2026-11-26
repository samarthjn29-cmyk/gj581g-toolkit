"""Beat_Sheet I:S (asset IDs) for WCL-E01 act 2 v2 (rows 45-112), from the act file and its cue sheet, and a full
A1:W dump for beatsheet-check built from a saved I1:S get_values result (A-E come from the act files).
usage (from library/): python3 ../episodes_src/WCL-E01/gate3_act2v2/beat_rows.py IS_VALUES.json OUT_dump.json OUT_act2_IS.json"""
import json, sys
COL = ["VIS", "TXT", "MOT", "TRN", "LOK", "SFX", "MUS", "TEX", "MAP", "PKG", "SRC"]
a = json.load(open("src/episodes/ep01-act02-v2.json")); mus = json.load(open("src/episodes/ep01-act02-v2.music.json"))
raw = json.load(open(sys.argv[1]))
if isinstance(raw, list):
    raw = json.loads(raw[0]["text"])
IS = raw["values"]
v1 = {x["id"]: x for x in json.load(open("src/episodes/ep01-act02.json"))["beats"]}
OLD = IS[44:112]  # the Gate 1 rows (per-beat IDs); v2 keeps each beat's picture IDs and lays the rework's changes over them
act2 = []; k = 0
for b in a["beats"]:
    old = v1[b["id"]]["assets"]
    added = [x for x in b["assets"] if x not in old and x.split("-")[0] == "TRN"]
    removed = [x for x in old if x not in b["assets"]]
    for n, (bid, s, e) in enumerate(b["beatTimes"]):
        ids = {c: [y.strip() for y in cell.split(",") if y.strip()] for c, cell in zip(COL, (OLD[k] + [""] * 11)[:11])}
        k += 1
        def put(x):
            p = x.split("-")[0]
            if x not in ids[p]:
                ids[p].append(x)
        ids["LOK"] = [x for x in ids["LOK"] if x != "LOK-009"]; put("LOK-033")
        ids["TRN"] = [x for x in ids["TRN"] if x not in removed]
        if n == 0:
            for x in added:
                put(x)
        ids["SFX"], ids["MUS"] = [], []
        for c in a["audio"]:
            if (s <= c["atSec"] < e) or (c.get("endSec") and c["atSec"] < s and c["endSec"] > s):
                put(c["id"])
        for cid, c in zip(mus["ids"]["cues"], mus["cues"]):
            if c["at"] < e and c["until"] > s:
                put(cid)
        if mus["break"][0] < e and mus["break"][1] > s:
            put("MUS-010")
        if any(s <= t < e for t, _ in mus["sweeps"]):
            put("MUS-011")
        if any(s <= b["start"] + c["atSec"] < e for p in b.get("overlay", {}).get("chips", []) for c in p["chips"]):
            put("TXT-024")
        act2.append((bid, s, e, [", ".join(ids[c]) for c in COL]))
assert len(act2) == 68
head = ["Beat", "Act", "Start_Sec", "End_Sec", "Duration_Sec", "Frames_30fps", "Pacing_Check", "Spoken_Line"] + IS[0] + ["Proof_Asset_File", "New_Assets_Flag", "Callout_&_Director_Notes", "Registry_Check"]
times = []
for n, f in ((1, "ep01-act01-v2"), (2, "ep01-act02-v2"), (3, "ep01-act03"), (4, "ep01-act04"), (5, "ep01-act05")):
    for b in json.load(open(f"src/episodes/{f}.json"))["beats"]:
        times += [(bid, n, s, e) for bid, s, e in b["beatTimes"]]
body = IS[1:]
print("sheet rows", len(body), "act-file beats", len(times))
assert len(body) == len(times)
rows = [head]
for i, ((bid, n, s, e), r) in enumerate(zip(times, body)):
    r = (r + [""] * 11)[:11]
    if n == 2:
        k = i - 43; assert act2[k][0] == bid, (act2[k][0], bid); r = act2[k][3]
    rows.append([bid, str(n), f"{s:.2f}", f"{e:.2f}", f"{e - s:.2f}", str(round((e - s) * 30)), "OK", ""] + r + ["", "", "", ""])
json.dump({"values": rows}, open(sys.argv[2], "w"), indent=1)
json.dump([x[3] for x in act2], open(sys.argv[3], "w"))
print("ok", len(rows) - 1, "rows; act 2 rows 45-112")
