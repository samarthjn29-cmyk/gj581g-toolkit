# Voice lint: before cloning, flag phrasings the clone is known to garble (from the voice profile's "hazards").
# Usage: python3 voice_lint.py script.json profile_dir [allow_id ...]   exit 1 if any 'fail' hazard is not allowed.
# Hazards are regexes run on each line's spoken text ('say' or 'text'); add one to profile.json every time Sam hears a new garble.
import sys, json, re
S = json.load(open(sys.argv[1])); H = json.load(open(f'{sys.argv[2]}/profile.json')).get('hazards', []); allow = set(sys.argv[3:])
bad = 0
for l in S:
    t = l.get('say', l['text'])
    for h in H:
        if re.search(h['pattern'], t):
            lv = 'allowed' if l['id'] in allow else h['level']; bad += lv == 'fail'
            print(f"{lv.upper():7} {l['id']}: {h['why']} -> {h['fix']} | {t}")
print(f'voice lint: {bad} failing line(s)'); sys.exit(1 if bad else 0)
