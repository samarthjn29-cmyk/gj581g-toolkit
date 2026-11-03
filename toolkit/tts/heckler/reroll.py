import json, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS, Conditionals
m = ChatterboxTTS.from_pretrained(device='cpu')
sam = Conditionals.load('/mnt/user-data/uploads/Decked out Data/voice_sample/sam_voice_v1/conds.pt')
m.prepare_conditionals('ref_bf_isabella.wav', exaggeration=0.5); isa = m.conds
jobs=[('H','Get there faster!',0.85,0.35,'r_0_3'),('N','Which is why we need a second ruler.',0.5,0.5,'r_1_2'),('H','Nine percent? Lucky sod!',0.75,0.4,'r_2_1')]
for who,text,ex,cfg,name in jobs:
    for s in range(4):
        torch.manual_seed(100+s); m.conds = sam if who=='N' else isa
        w=m.generate(text,exaggeration=ex,cfg_weight=cfg,temperature=0.8); ta.save(f'cb/{name}_{s}.wav',w,m.sr); print(name,s,flush=True)
