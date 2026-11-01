"""Contact sheet for choosing clips: two frames per clip (30% and 70% of its length), labelled with the file name.
Usage: contact_sheet.py out.png clip1.mp4 [clip2.mp4 ...]   -> look at out.png before choosing."""
import sys, subprocess, os, tempfile
from PIL import Image, ImageDraw
out, clips = sys.argv[1], sys.argv[2:]
tw, th = 480, 270
sheet = Image.new('RGB', (tw * 2 + 10, len(clips) * (th + 10)), 'white'); d = ImageDraw.Draw(sheet)
tmp = tempfile.mkdtemp()
for i, c in enumerate(clips):
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', c], capture_output=True, text=True).stdout or 0)
    wh = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', c], capture_output=True, text=True).stdout.strip()
    for j, p in enumerate((0.3, 0.7)):
        f = os.path.join(tmp, f'{i}_{j}.png')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(dur * p), '-i', c, '-frames:v', '1', '-vf', f'scale={tw}:{th}:force_original_aspect_ratio=decrease,pad={tw}:{th}:(ow-iw)/2:(oh-ih)/2', f])
        if os.path.exists(f): sheet.paste(Image.open(f), (j * (tw + 10), i * (th + 10)))
    d.rectangle([0, i * (th + 10), 300, i * (th + 10) + 22], fill='black')
    d.text((5, i * (th + 10) + 5), f'{os.path.basename(c)}  {dur:.1f}s  {wh}', fill='yellow')
sheet.save(out); print('wrote', out)
