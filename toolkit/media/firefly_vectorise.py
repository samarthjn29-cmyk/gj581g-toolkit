import sys, subprocess, vtracer
from PIL import Image
n = sys.argv[1]; src = f'/home/claude/scrolls/art/ff/{n}_full.jpg'; out = f'/home/claude/scrolls/art/vec/{n}'
import os; os.makedirs(out, exist_ok=True)
vtracer.convert_image_to_svg_py(src, f'{out}/art.svg', colormode='color', hierarchical='stacked', mode='spline', filter_speckle=4, color_precision=7,
  layer_difference=10, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=2)
subprocess.run(['rsvg-convert', '-w', '3840', f'{out}/art.svg', '-o', f'{out}/art.png'], check=True)
Image.open(f'{out}/art.png').convert('RGB').save(f'/home/claude/twice/remotion/public/scrolls/{n}.jpg', quality=92)
print(n, 'ok', os.path.getsize(f'{out}/art.svg') // 1024, 'KB svg')
