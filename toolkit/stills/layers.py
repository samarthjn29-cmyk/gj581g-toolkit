#!/usr/bin/env python3
"""2.5D layers for a still (stills workflow, 8 Nov 2026).
Depth Anything V2 small (ONNX, CPU) -> depth map -> 3 soft layers (far / mid / near).
Holes left behind nearer layers are filled by OpenCV inpainting so a layer can slide a little without showing gaps.
Usage: layers.py IMAGE OUTDIR [--cuts 0.45 0.7]   -> OUTDIR/{depth.png, far.png, mid.png, near.png, layers.json}
In Remotion the far layer moves least and the near layer most during a camera move (see kit Still25D)."""
import sys, json, os, argparse
import numpy as np, cv2, onnxruntime as ort
MODEL = os.environ.get('DA2_ONNX', '/home/claude/models/da2s.onnx')

def depth(img):
    h, w = img.shape[:2]; S = 518
    x = cv2.resize(img, (S, S), interpolation=cv2.INTER_CUBIC)[:, :, ::-1].astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    s = ort.InferenceSession(MODEL, providers=['CPUExecutionProvider'])
    d = s.run(None, {s.get_inputs()[0].name: x})[0].squeeze()
    d = cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)
    d = (d - d.min()) / (d.max() - d.min() + 1e-6)        # 1 = near, 0 = far (relative inverse depth)
    return cv2.GaussianBlur(d, (0, 0), 3)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('image'); ap.add_argument('out'); ap.add_argument('--cuts', nargs=2, type=float, default=[0.45, 0.7])
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    img = cv2.imread(a.image, cv2.IMREAD_COLOR); d = depth(img)
    cv2.imwrite(f'{a.out}/depth.png', (d * 255).astype(np.uint8))
    c1, c2 = a.cuts; soft = 0.04
    m_mid = np.clip((d - c1) / soft + 0.5, 0, 1); m_near = np.clip((d - c2) / soft + 0.5, 0, 1)
    def fill(mask):   # inpaint what the nearer layers cover, so the layer behind has no hole
        k = cv2.dilate((mask > 0.05).astype(np.uint8) * 255, np.ones((25, 25), np.uint8))
        sm = cv2.resize(img, None, fx=0.25, fy=0.25); km = cv2.resize(k, None, fx=0.25, fy=0.25)
        f = cv2.resize(cv2.inpaint(sm, km, 9, cv2.INPAINT_TELEA), (img.shape[1], img.shape[0]))
        a3 = (k[:, :, None] / 255.0); return (img * (1 - a3) + f * a3).astype(np.uint8)
    far = fill(m_mid); mid = fill(m_near)
    cv2.imwrite(f'{a.out}/far.png', far)
    cv2.imwrite(f'{a.out}/mid.png', np.dstack([mid, (m_mid * 255).astype(np.uint8)]))
    cv2.imwrite(f'{a.out}/near.png', np.dstack([img, (m_near * 255).astype(np.uint8)]))
    json.dump({'cuts': a.cuts, 'size': [img.shape[1], img.shape[0]], 'near_share': float((m_near > 0.5).mean()), 'mid_share': float((m_mid > 0.5).mean())}, open(f'{a.out}/layers.json', 'w'))
    print(open(f'{a.out}/layers.json').read())
main()
