import sys, json, numpy as np, librosa
f, out = sys.argv[1], sys.argv[2]
y, sr = librosa.load(f, sr=22050, mono=True)
hop=512
oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=sr, hop_length=hop, tightness=100)
bt = librosa.frames_to_time(beats, sr=sr, hop_length=hop)
# beat strength: how periodic is onset envelope (autocorrelation peak ratio)
ac = librosa.autocorrelate(oenv - oenv.mean()); ac/=ac[0]
lo,hi = int(0.3*sr/hop), int(1.0*sr/hop)
pk = float(ac[lo:hi].max())
# onsets for alternative: onset times
on = librosa.onset.onset_detect(onset_envelope=oenv, sr=sr, hop_length=hop, units='time')
json.dump({'tempo':float(np.atleast_1d(tempo)[0]),'beats':bt.round(3).tolist(),'onsets':on.round(3).tolist(),'ac_peak':pk,'dur':len(y)/sr}, open(out,'w'))
print(f, 'tempo',float(np.atleast_1d(tempo)[0]), 'beats',len(bt),'onsets',len(on),'acpeak',round(pk,3))
