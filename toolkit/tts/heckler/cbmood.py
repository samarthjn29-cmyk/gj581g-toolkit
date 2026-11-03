import sys, json, os, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS, Conditionals
torch.manual_seed(11)
m = ChatterboxTTS.from_pretrained(device='cpu')
sam = Conditionals.load('/mnt/user-data/uploads/Decked out Data/voice_sample/sam_voice_v1/conds.pt')
M = {'impatient':(0.7,0.45),'pushy':(0.85,0.35),'deflated':(0.3,0.6),'exasperated':(0.95,0.3),'groan':(0.55,0.5),'envious':(0.75,0.4),'grudging warm':(0.4,0.55)}
CAND=sys.argv[1]
if CAND!='none': m.prepare_conditionals(f'ref_{CAND}.wav', exaggeration=0.5); fab = m.conds
for si, scene in enumerate(json.load(open('mood.json'))):
    for li, row in enumerate(scene):
        who, text = row[0], row[1]
        out = f'cb/sam_{si}_{li}.wav' if who=='N' else f'cb/{CAND}_{si}_{li}.wav'
        if os.path.exists(out): continue
        if who=='H' and CAND=='none': continue
        if who=='N':
            m.conds = sam; w = m.generate(text, exaggeration=0.5, cfg_weight=0.5, temperature=0.8)
        else:
            ex, cfg = M[row[2]]; m.conds = fab
            w = m.generate(text, exaggeration=ex, cfg_weight=cfg, temperature=0.8)
        ta.save(out, w, m.sr); print(out, row[2] if who=='H' else '', flush=True)
print('MOOD DONE')
