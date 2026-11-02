# Self-made banknote sound set (synthesised here, no licence needed): typewriter, stamp, register ding, whoosh, paper slide, coin.
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 48000; rng = np.random.default_rng(7)
def env(n, a=0.002, d=0.08):
    t = np.arange(n)/SR; return np.minimum(1, t/a) * np.exp(-t/d)
def bp(x, lo, hi):
    b, a = butter(2, [lo/(SR/2), hi/(SR/2)], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f/(SR/2)); return lfilter(b, a, x)
def save(name, x):
    x = x/np.max(np.abs(x))*0.9; wavfile.write(f'{name}.wav', SR, (x*32767).astype(np.int16))
def key():
    n = int(0.06*SR); x = bp(rng.standard_normal(n), 1800, 6000)*env(n, .0005, .008)
    x += 0.5*np.sin(2*np.pi*190*np.arange(n)/SR)*env(n, .0005, .015); return x
# typewriter: 6 irregular keys
tw = np.zeros(int(0.9*SR))
for i, t0 in enumerate([0, .11, .19, .33, .42, .58]):
    k = key()*(0.8+0.4*rng.random()); s = int(t0*SR); tw[s:s+len(k)] += k
save('typewriter', tw)
# stamp: low thud + paper slap
n = int(0.5*SR); t = np.arange(n)/SR
st = np.sin(2*np.pi*(90*np.exp(-t*8)+45)*t)*env(n, .001, .09) + 0.6*bp(rng.standard_normal(n), 300, 2500)*env(n, .0005, .02)
save('stamp', st)
# register ding: bell partials + short mechanical clack before
n = int(1.4*SR); t = np.arange(n)/SR
bell = sum(a*np.sin(2*np.pi*f*t)*np.exp(-t/d) for f, a, d in [(2093, 1, .5), (2637, .5, .35), (4186, .25, .2), (5274, .15, .12)])
cl = np.zeros(n); c = key(); cl[:len(c)] += c*0.8; c2 = key(); s = int(.07*SR); cl[s:s+len(c2)] += c2*.6
ding = cl + np.concatenate([np.zeros(int(.12*SR)), bell[:n-int(.12*SR)]])*0.7
save('ding', ding)
# whoosh: swept band noise
n = int(0.7*SR); t = np.arange(n)/SR; x = rng.standard_normal(n)
segs = []; out = np.zeros(n); blk = 1200
for i in range(0, n, blk):
    f = 400 + 3000*np.sin(np.pi*i/n)**2; out[i:i+blk] = bp(x[i:i+blk], f*0.6, f*1.4)[:len(out[i:i+blk])]
out *= np.sin(np.pi*t/t[-1])**2; save('whoosh', out)
# paper slide / note flick
n = int(0.35*SR); t = np.arange(n)/SR
pp = bp(rng.standard_normal(n), 2000, 9000)*np.abs(np.sin(np.pi*t/t[-1]))**1.5*(0.6+0.4*np.sin(2*np.pi*35*t))
save('paper', pp)
# coin: small metallic tink x2
n = int(0.8*SR); t = np.arange(n)/SR
def tink(f): return sum(a*np.sin(2*np.pi*f*m*t)*np.exp(-t/d) for m, a, d in [(1, 1, .18), (2.76, .5, .08), (5.4, .3, .04)])
co = tink(3200); s = int(.16*SR); co[s:] += 0.6*tink(3500)[:n-s]
save('coin', co)
print('ok')
