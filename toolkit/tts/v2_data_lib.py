"""Shared v2 tables: scene -> drawing component (MAP) and -> word-timing key (WKEY); words(first,last) merges timings."""
import json
T = '/home/claude/Tokens_v1'
MAP = {1: 'S1', 2: 'S2', 3: 'S4', 4: 'S5', 5: 'V5', 6: 'V6', 7: 'S11', 8: 'S12', 9: 'V9', 10: 'V10', 11: 'S14', 12: 'S15', 13: 'S16',
       14: 'S17', 15: 'V15', 16: 'S21', 17: 'S22', 18: 'S25', 19: 'S26', 20: 'S27', 21: 'V21', 22: 'S3', 23: 'S28', 24: 'S29',
       25: 'S30', 26: 'S31', 27: 'V27', 28: 'V28', 29: 'S8', 30: 'S9', 31: 'S33', 32: 'S34', 33: 'S35', 34: 'S37', 35: 'S39', 36: 'S40'}
WKEY = {n: (c[1:] if c.startswith('S') else f'v{n}') for n, c in MAP.items()}; WKEY[28] = '7'

def words(first=1, last=99):
    W = json.load(open(f'{T}/tts/words_all.json')); raw = json.load(open(f'{T}/tts/words_v2_raw.json'))
    voiced = set(json.load(open(f'{T}/tts/vo2/plan.json'))['to_voice'])
    for n in voiced:
        if str(n) in raw: W[WKEY[n]] = raw[str(n)]
    return W
