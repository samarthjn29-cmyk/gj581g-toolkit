# Predict where viewers look in a frame with DeepGaze IIE (Linardos, Kümmerer, Press & Bethge 2021; free model trained on
# human eye-tracking data, MIT1003 centre bias). Writes a heat-map overlay and prints the top fixation regions.
# usage: gaze/bin/python gaze.py out_dir img1.jpg img2.jpg ...
import sys, os, numpy as np, torch, cv2
sys.path.insert(0, '/home/claude/deepgaze_src')
from scipy.special import logsumexp
from scipy.ndimage import zoom
import deepgaze_pytorch
torch.set_num_threads(os.cpu_count())
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
model = deepgaze_pytorch.DeepGazeIIE(pretrained=True).eval()
cb_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'centerbias_mit1003.npy')
if not os.path.exists(cb_path):
    torch.hub.download_url_to_file('https://github.com/matthias-k/DeepGaze/releases/download/v1.0.0/centerbias_mit1003.npy', cb_path)
cb0 = np.load(cb_path)
for f in sys.argv[2:]:
    img = cv2.cvtColor(cv2.imread(f), cv2.COLOR_BGR2RGB); img = cv2.resize(img, (1024, 576), interpolation=cv2.INTER_AREA)
    cb = zoom(cb0, (img.shape[0] / cb0.shape[0], img.shape[1] / cb0.shape[1]), order=0, mode='nearest'); cb -= logsumexp(cb)
    with torch.no_grad():
        ld = model(torch.tensor([img.transpose(2, 0, 1)]).float(), torch.tensor([cb]).float())[0, 0].numpy()
    p = np.exp(ld); p /= p.sum()
    # share of predicted fixations in each third of the frame and the peak
    h = cv2.applyColorMap((255 * p / p.max()).astype(np.uint8), cv2.COLORMAP_INFERNO)
    ov = cv2.addWeighted(cv2.cvtColor(img, cv2.COLOR_RGB2BGR), 0.45, h, 0.55, 0)
    # contour holding 50% of the predicted fixations
    s = np.sort(p.ravel())[::-1]; thr = s[np.searchsorted(np.cumsum(s), 0.5)]
    cs, _ = cv2.findContours((p >= thr).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(ov, cs, -1, (255, 255, 255), 2)
    name = os.path.splitext(os.path.basename(f))[0]
    cv2.imwrite(f'{OUT}/{name}_gaze.jpg', ov)
    np.save(f'{OUT}/{name}_gaze.npy', p.astype(np.float32))
    y, x = np.unravel_index(p.argmax(), p.shape)
    print(f'{name}: peak at ({x / 1024:.2f}, {y / 576:.2f}) of frame; 50% region covers {(p >= thr).mean():.1%} of frame')
