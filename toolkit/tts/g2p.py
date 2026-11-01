"""English G2P for Kokoro using the CMU Pronouncing Dictionary (ARPAbet -> Kokoro/misaki US phonemes)."""
import re, os
D = os.path.dirname(os.path.abspath(__file__))
DL = os.environ.get('KOKORO_DIR', os.path.join(D, 'dl'))   # set up by tts/setup.sh
V = {'AA': 'ɑ', 'AE': 'æ', 'AO': 'ɔ', 'AW': 'W', 'AY': 'I', 'EH': 'ɛ', 'EY': 'A', 'IH': 'ɪ', 'IY': 'i', 'OW': 'O', 'OY': 'Y', 'UH': 'ʊ', 'UW': 'u'}
C = {'B': 'b', 'CH': 'ʧ', 'D': 'd', 'DH': 'ð', 'F': 'f', 'G': 'ɡ', 'HH': 'h', 'JH': 'ʤ', 'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'NG': 'ŋ', 'P': 'p', 'R': 'ɹ', 'S': 's', 'SH': 'ʃ', 'T': 't', 'TH': 'θ', 'V': 'v', 'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ'}

# Hand-written pronunciations (ARPAbet) for names and words the dictionary lacks or gets wrong.
CUSTOM = {
    'bachmann': 'B AA1 K M AH0 N', 'ichiue': 'IY2 CH IY0 UW1 EH0', 'nishiguchi': 'N IY2 SH IY0 G UW1 CH IY0',
    'kaufmann': 'K AW1 F M AH0 N', 'econometrics': 'IH0 K AA2 N AH0 M EH1 T R IH0 K S', 'deflation': 'D IH0 F L EY1 SH AH0 N',
    'interwar': 'IH1 N T ER0 W AO2 R', 'archetypal': 'AA2 R K AH0 T AY1 P AH0 L', 'bis': 'B IY1 AY1 EH1 S',
    'durables': 'D UH1 R AH0 B AH0 L Z', 'misfiled': 'M IH0 S F AY1 L D', 'big-ticket': 'B IH1 G T IH1 K AH0 T',
    'rollercoaster': 'R OW1 L ER0 K OW2 S T ER0', 'drumroll': 'D R AH1 M R OW2 L',
    'tv': 'T IY1 V IY1', 'dallas': 'D AE1 L AH0 S', 'fed': 'F EH1 D', 'hundreds': 'HH AH1 N D R AH0 D Z',
    'nineteenth-century': 'N AY1 N T IY1 N TH S EH1 N CH ER0 IY0', 'eighteen-hundreds': 'EY1 T IY1 N HH AH1 N D R AH0 D Z',
    'nineteen-thirties': 'N AY1 N T IY1 N TH ER1 T IY0 Z', 'two-thirds': 'T UW1 TH ER1 D Z', 'one-way': 'W AH1 N W EY1',
    'near-zero': 'N IH1 R Z IY1 R OW0', 'depression-era': 'D IH0 P R EH1 SH AH0 N IH1 R AH0', 'multi-year': 'M AH2 L T IY0 Y IH1 R',
    'messiest': 'M EH1 S IY0 AH0 S T', 'politest': 'P AH0 L AY1 T AH0 S T', 'wobbles': 'W AA1 B AH0 L Z',
    'gold-standard': 'G OW1 L D S T AE1 N D ER0 D', 'sixty-three': 'S IH1 K S T IY0 TH R IY1', 'thirty-eight': 'TH ER1 T IY0 EY1 T',
    'schularick': 'SH UW1 L AA0 R IH0 K', 'mcgrevy': 'M AH0 K G R EH1 V IY0', 'ubs': 'Y UW1 B IY1 EH1 S',
    'upzoned': 'AH1 P Z OW2 N D', 'upzoning': 'AH1 P Z OW2 N IH0 NG', 'steger': 'SH T EY1 G ER0',
    'monro': 'M AH0 N R OW1', 'auckland': 'AO1 K L AH0 N D', 'katharina': 'K AE2 T AH0 R IY1 N AH0',
    'moritz': 'M AO1 R IH0 T S', 'paris': 'P AE1 R IH0 S', 'toronto': 'T AH0 R AA1 N T OW0',
    'cafe': 'K AE1 F EY0', 'carina': 'K AH0 R IY1 N AH0', 'chabris': 'SH EY1 B R IH0 S', 'inattentional': 'IH2 N AH0 T EH1 N SH AH0 N AH0 L',
    'noticers': 'N OW1 T IH0 S ER0 Z', 'scrolled': 'S K R OW1 L D', 'kreitz': 'K R AY1 T S', 'vo': 'V OW1', 'nartker': 'N AA1 R T K ER0',
}
# Project-specific pronunciations: PRON=<file.json> with {"word": "ARPAbet"} (names, jargon). Add good ones to CUSTOM above.
if os.environ.get('PRON'):
    import json as _json
    CUSTOM.update({k.lower(): v for k, v in _json.load(open(os.environ['PRON'])).items()})
_dict = None
def load():
    global _dict
    if _dict is None:
        _dict = {}
        for line in open(os.path.join(DL, 'cmud/cmudict.dict'), encoding='utf-8'):
            line = line.split('#')[0].strip()
            if not line: continue
            w, *ph = line.split()
            w = re.sub(r'\(\d+\)$', '', w)
            _dict.setdefault(w, ' '.join(ph))
    return _dict

def arpa_to_k(arpa):
    out = []
    for p in arpa.split():
        m = re.match(r'([A-Z]+)(\d)?', p); b, st = m.group(1), m.group(2)
        if b == 'ER':
            out.append(('ˈɜɹ' if st == '1' else 'ˌɜɹ' if st == '2' else 'əɹ'))
        elif b == 'AH':
            out.append('ˈʌ' if st == '1' else 'ˌʌ' if st == '2' else 'ə')
        elif b in V:
            out.append(('ˈ' if st == '1' else 'ˌ' if st == '2' else '') + V[b])
        else:
            out.append(C[b])
    return ''.join(out)

def word(w, missing):
    d = load(); lw = w.lower().replace('’', "'")
    if w == 'US': return arpa_to_k('Y UW1 EH1 S')
    if lw in CUSTOM: return arpa_to_k(CUSTOM[lw])
    if lw in d: return arpa_to_k(d[lw])
    if '-' in lw:
        parts = [word(p, missing) for p in lw.split('-') if p]
        return ' '.join(parts)
    if lw.endswith("'s") and lw[:-2] in d: return arpa_to_k(d[lw[:-2]] + ' Z')
    missing.add(lw)
    return lw

def phonemize(text, missing=None):
    missing = set() if missing is None else missing
    text = text.replace('Võ', 'Vo').replace('café', 'cafe').replace('—', ' — ').replace('...', ' … ').replace(':', ',').replace(';', ',')
    out = []
    for tok in re.findall(r"[A-Za-z][A-Za-z'’\-]*|[.,!?—…\"“”()]", text):
        if re.match(r'[A-Za-z]', tok): out.append(word(tok.strip("'"), missing))
        else: out.append(tok)
    s = ' '.join(out)
    s = re.sub(r' ([.,!?…])', r'\1', s)
    return s, missing

# ---------------- British English (non-rhotic, RP vowels) ----------------
import os as _os
GB_V = {'AE': 'a', 'AW': 'W', 'AY': 'I', 'EH': 'ɛ', 'EY': 'A', 'IH': 'ɪ', 'IY': 'i', 'OW': 'Q', 'OY': 'Y', 'UH': 'ʊ', 'UW': 'u'}
VOW = set(list(GB_V) + ['AA', 'AH', 'ER', 'AO'])
def arpa_to_gb(arpa, spelling):
    ph = arpa.split(); out = []
    lot = ('o' in spelling) and ('a' not in spelling)
    i = 0
    while i < len(ph):
        m = re.match(r'([A-Z]+)(\d)?', ph[i]); b, st = m.group(1), m.group(2)
        mark = 'ˈ' if st == '1' else 'ˌ' if st == '2' else ''
        nxt = re.match(r'([A-Z]+)', ph[i + 1]).group(1) if i + 1 < len(ph) else None
        nxt2 = re.match(r'([A-Z]+)', ph[i + 2]).group(1) if i + 2 < len(ph) else None
        r_follows = nxt == 'R' and (nxt2 is None or nxt2 not in VOW)
        if b == 'ER':
            out.append(mark + ('ɜː' if st in ('1', '2') else 'ə'))
            if nxt and nxt in VOW: out.append('ɹ')
        elif b in ('IH', 'IY') and r_follows: out.append(mark + 'ɪə'); i += 1
        elif b in ('EH', 'EY') and r_follows: out.append(mark + 'ɛː'); i += 1
        elif b in ('UH', 'UW') and r_follows: out.append(mark + 'ʊə'); i += 1
        elif b == 'AA' and r_follows: out.append(mark + 'ɑː'); i += 1
        elif b == 'AO' and r_follows: out.append(mark + 'ɔː'); i += 1
        elif b == 'AA':
            sp = spelling
            if any(x in sp for x in ('augh', 'ough', 'aw', 'au')) or (re.search(r'al[lkt]', sp) and 'alm' not in sp): v = 'ɔː'
            elif 'o' in sp or re.search(r'(w|qu)a', sp): v = 'ɒ'
            else: v = 'ɑː'
            out.append(mark + v)
        elif b == 'AO':
            sp = spelling
            if nxt == 'R' or any(x in sp for x in ('augh', 'ough', 'aw', 'au', 'al', 'oar', 'our')) or 'o' not in sp: v = 'ɔː'
            else: v = 'ɒ'
            out.append(mark + v)
        elif b == 'AH':
            if st == '1' and spelling in ('what', 'was', "wasn't", 'because', 'of', 'from', 'want'): out.append('ˈɒ')
            else: out.append('ˈʌ' if st == '1' else 'ˌʌ' if st == '2' else 'ə')
        elif b in GB_V: out.append(mark + GB_V[b])
        elif b == 'R':
            if nxt is not None and nxt in VOW: out.append('ɹ')
        else: out.append(C[b])
        i += 1
    return ''.join(out)

if _os.environ.get('DIALECT') == 'gb':
    _us_word = word
    def word(w, missing):
        d = load(); lw = w.lower().replace('’', "'")
        if w == 'US': return arpa_to_gb('Y UW1 EH1 S', 'us')
        if lw in CUSTOM: return arpa_to_gb(CUSTOM[lw], lw)
        if lw in d: return arpa_to_gb(d[lw], lw)
        if '-' in lw: return ' '.join(word(p, missing) for p in lw.split('-') if p)
        if lw.endswith("'s") and lw[:-2] in d: return arpa_to_gb(d[lw[:-2]] + ' Z', lw)
        missing.add(lw); return lw
