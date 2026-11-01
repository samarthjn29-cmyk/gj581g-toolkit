"""Decked out Data: one-command pipeline (toolkit 2.0). Runs the stages in order, checks each, and stops with a clear
message when something needs a human or a fix.

Usage (from the project folder):  python3 toolkit/run.py video.json [stage | from:to | all]
  e.g.  run.py video.json all          story -> ... -> review (stops at the review checkpoint; nothing renders)
        run.py video.json voice:words  only those stages
        run.py video.json render       cloud render after the user approved the review sheets (or: package for the laptop)

video.json (project settings):
  {"prefix": "Blindness", "project": "project.py", "voice": "am_michael", "viewer": null, "speed": 1.1, "dialect": "us",
   "kokoro_dir": "toolkit/tts/dl", "media_specs": "media_specs.json", "remotion": "Blindness_remotion",
   "snips": "snips", "pron": null, "browser": "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome"}

Stages:
  story    story/handoff.py project.py story (fails on its errors)
  factcheck story/factcheck.py -> story/<prefix>_factcheck.csv (the checklist the independent fact-check agent works through)
  voice    tts/synth.py (VIEWER voice if the script has {viewer: ...} lines)
  retime   handoff.py --vo-dur (slide lengths from the real clips)
  media    media/prep.py media_specs.json (if present)
  setup    copy toolkit/remotion into <remotion>/ if missing; npm install if node_modules is missing (cloud proxy flags)
  words    tts/align.py -> <remotion>/src/data/words.json (fails on MISMATCH unless fixed by hand)
  assets   copy slides.json, prepared clips, VO clips, snips and fonts into the Remotion project
  gen      remotion/gen_scenes.py -> src/scenes_gen.jsx (hand-written scenes go in scenes_custom.jsx and win)
  sections write sections.txt (sections start at chapter maps, about 1.5-3 minutes each)
  review   one still per scene (review.mjs) -> review sheets with narration lines: THE CHECKPOINT. Send them to the user.
  srt      captions file for YouTube
  package  zips under 30 MB + render.bat + README for the user's laptop (out/package/)
  render   cloud render in sections + narration + grain (refuses while TODO boxes remain)
"""
import sys, os, json, shutil, subprocess, re, glob, zipfile

TK = os.path.dirname(os.path.abspath(__file__))
STAGES = ['story', 'factcheck', 'voice', 'retime', 'media', 'setup', 'words', 'assets', 'gen', 'sections', 'review', 'srt', 'package', 'render']
cfg = json.load(open(sys.argv[1])); arg = sys.argv[2] if len(sys.argv) > 2 else 'all'
P = cfg['prefix']; R = cfg.get('remotion', f'{P}_remotion'); ENV = dict(os.environ)
ENV.update({'KOKORO_DIR': os.path.abspath(cfg.get('kokoro_dir', os.path.join(TK, 'tts/dl'))), 'SPEED': str(cfg.get('speed', 1.1))})
if cfg.get('dialect') == 'gb': ENV['DIALECT'] = 'gb'
if cfg.get('viewer'): ENV['VIEWER'] = cfg['viewer']
if cfg.get('pron'): ENV['PRON'] = os.path.abspath(cfg['pron'])
BROWSER = cfg.get('browser')

def sh(cmd, cwd=None, check=True, quiet=False):
    print('  $', cmd if isinstance(cmd, str) else ' '.join(cmd), flush=True)
    r = subprocess.run(cmd, shell=isinstance(cmd, str), cwd=cwd, env=ENV, capture_output=True, text=True)
    if not quiet: sys.stdout.write(r.stdout[-4000:])
    if check and r.returncode != 0: stop(f'command failed:\n{r.stderr[-3000:]}')
    return r
def stop(msg): print(f'\nSTOPPED: {msg}'); sys.exit(1)
def ok(msg): print(f'  OK {msg}')
slides = lambda: json.load(open('story/slides.json'))

def st_story():
    r = sh(['python3', f'{TK}/story/handoff.py', cfg.get('project', 'project.py'), 'story'], check=False)
    if r.returncode != 0: stop('handoff.py reported errors (fix project.py):\n' + r.stdout[-3000:] + r.stderr[-2000:])
    ok('hand-off files written')
def st_factcheck():
    sh(['python3', f'{TK}/story/factcheck.py', 'story/slides.json', cfg.get('project', 'project.py'), f'story/{P}_factcheck.csv'])
    ok('checklist ready: give it to an independent fact-check agent with the source files before voicing')
def st_voice():
    txt = json.dumps(slides())
    fc = f'story/{P}_factcheck.csv'
    if os.path.exists(fc) and not cfg.get('skip_factcheck'):
        import csv; rows = list(csv.DictReader(open(fc)))
        bad = [r for r in rows if r['verdict'].strip().upper() in ('WRONG', 'UNSUPPORTED', 'OVERSTATED')]
        if bad: stop(f'{len(bad)} fact-check rows failed (fix the script, rerun story + factcheck):\n' + '\n'.join(f"  slide {r['slide']}: {r['text'][:90]} -> {r['fix']}" for r in bad[:20]))
        if any(not r['verdict'].strip() for r in rows): stop(f'{fc} has rows without a verdict: the independent fact-check agent must finish it first (or set "skip_factcheck": true)')
    elif not cfg.get('skip_factcheck'): stop('run the factcheck stage and have an independent agent fill the verdicts before voicing')
    if '{viewer:' in txt and not cfg.get('viewer'): stop('the script has {viewer: ...} lines: set "viewer" in video.json to a second Kokoro voice id')
    sh(['python3', f'{TK}/tts/synth.py', 'story/slides.json', 'tts/vo', cfg['voice']])
    ok('narration clips in tts/vo')
def st_retime():
    sh(['python3', f'{TK}/story/handoff.py', cfg.get('project', 'project.py'), 'story', '--vo-dur', 'tts/vo/durations.json'])
    ok(f"runtime {sum(d['dur'] for d in slides()) // 60:.0f} min")
def st_media():
    ms = cfg.get('media_specs', 'media_specs.json')
    if not os.path.exists(ms): print('  (no media_specs.json: skipped)'); return
    sh(['python3', f'{TK}/media/prep.py', ms, 'story/slides.json', 'media/prepared']); ok('clips prepared')
def st_setup():
    if not os.path.exists(f'{R}/src/lib.jsx'): shutil.copytree(f'{TK}/remotion', R, dirs_exist_ok=True); ok(f'copied the Remotion engine to {R}/')
    for d in ['src/data', 'public/vo', 'public/snips', 'public/fonts', 'out']: os.makedirs(f'{R}/{d}', exist_ok=True)
    if not os.path.exists(f'{R}/node_modules'):
        px = os.environ.get('HTTPS_PROXY')
        cmd = f'NO_PROXY= no_proxy= npm install --proxy "{px}" --https-proxy "{px}" --noproxy "" --cafile /root/.ccr/ca-bundle.crt' if px else 'npm install'
        sh(cmd, cwd=R, quiet=True); ok('npm packages installed')
def st_words():
    r = sh(['python3', f'{TK}/tts/align.py', 'story/slides.json', 'tts/vo', cfg['voice'], f'{R}/src/data/words.json'])
    bad = [l for l in r.stdout.splitlines() if 'MISMATCH' in l]
    ov = cfg.get('words_override')   # {"2": [...words...]} file with hand-fixed timings for clips edited after synthesis
    if ov and os.path.exists(ov):
        W = json.load(open(f'{R}/src/data/words.json')); O = json.load(open(ov)); W.update(O)
        json.dump(W, open(f'{R}/src/data/words.json', 'w')); print(f'  hand-fixed timings used for VO {", ".join(sorted(O))}')
        bad = [l for l in bad if re.match(r'VO-(\d+)', l) and str(int(re.match(r'VO-(\d+)', l).group(1))) not in O]
    if bad: stop('word timing mismatch (a clip was edited after synthesis; shift its words to the real speech islands, see decked-out-video):\n' + '\n'.join(bad))
    ok('word timings for every clip')
def st_assets():
    shutil.copy('story/slides.json', f'{R}/src/data/slides.json')
    for f in glob.glob('tts/vo/VO-*.mp3'): shutil.copy(f, f'{R}/public/vo/')
    for f in glob.glob('media/prepared/*.mp4'): shutil.copy(f, f'{R}/public/')
    sd = cfg.get('snips', 'snips')
    for f in glob.glob(f'{sd}/*_plain.png') + glob.glob(f'{sd}/t_*.png'): shutil.copy(f, f'{R}/public/snips/')
    for f in glob.glob(f'{TK}/remotion/public/*'):
        if not os.path.exists(f'{R}/public/{os.path.basename(f)}'): shutil.copy(f, f'{R}/public/')
    sh(['python3', f'{R}/measure_snips.py', f'{R}/public/snips', sd, f'{R}/src/data/snips.json'])
    if not glob.glob(f'{R}/public/fonts/*'): print('  NOTE: put the theme font files in public/fonts/ (and list them in FONT_FILES in lib.jsx)')
    ok('assets copied')
def st_gen():
    man = 'media/prepared/manifest.json'
    sh(['python3', f'{R}/gen_scenes.py', f'{R}/src/data/slides.json', f'{R}/src/scenes_gen.jsx'] + (['--manifest', man] if os.path.exists(man) else []))
def st_sections():
    S = slides(); starts = [0]
    for d in S:
        if d['layout'] == 'map' and d['start'] - S[starts[-1]]['start'] >= 90: starts.append(S.index(d))
    lines = ['# section  slides  frames (30 fps; written by run.py at chapter maps)']
    for k, i in enumerate(starts):
        j = starts[k + 1] - 1 if k + 1 < len(starts) else len(S) - 1
        f0 = round(S[i]['start'] * 30); f1 = round((S[j]['start'] + S[j]['dur']) * 30) - 1
        lines.append(f"{k + 1}  {S[i]['n']}-{S[j]['n']}  {f0}-{f1}")
    open(f'{R}/sections.txt', 'w').write('\n'.join(lines) + '\n'); ok(f'{len(starts)} sections')
def remaining_todos():
    custom = open(f'{R}/src/scenes_custom.jsx').read() if os.path.exists(f'{R}/src/scenes_custom.jsx') else ''
    overridden = set(re.findall(r'export const (S\d+)', custom)); n = custom.count('<Todo')
    for l in open(f'{R}/src/scenes_gen.jsx'):
        m = re.match(r'export const (S\d+)', l)
        if m and m.group(1) not in overridden: n += l.count('<Todo')
    return n
def st_review():
    cmd = ['node', 'review.mjs', 'out/review', '0.85'] + ([BROWSER] if BROWSER else [])
    sh(cmd, cwd=R, quiet=True)
    sh(['python3', 'review_sheet.py', 'src/data/slides.json', 'out/review', f'out/{P}_review'], cwd=R)
    t = remaining_todos()
    print(f'\nCHECKPOINT: send {R}/out/{P}_review_*.png to the user and wait for approval before rendering.' + (f' {t} TODO boxes still to design.' if t else ''))
def st_srt():
    sh(['python3', 'make_srt.py', f'out/{P}_captions.srt'], cwd=R); ok('captions file')
def st_package():
    pk = f'{R}/out/package'; shutil.rmtree(pk, ignore_errors=True); os.makedirs(pk)
    used = open(f'{R}/src/scenes_gen.jsx').read() + (open(f'{R}/src/scenes_custom.jsx').read() if os.path.exists(f'{R}/src/scenes_custom.jsx') else '')
    base = ['package.json', 'sections.txt'] + [os.path.join(r, f) for r, _, fs in os.walk(f'{R}/src') for f in fs]
    base = [b if b.startswith(R) else f'{R}/{b}' for b in base]
    pub = [os.path.join(r, f) for r, _, fs in os.walk(f'{R}/public') for f in fs]
    small = [f for f in pub if not f.endswith('.mp4')]
    vids = [f for f in pub if f.endswith('.mp4') and os.path.basename(f) in used]
    parts = [base + small]; cur, size = [], 0
    for f in sorted(vids, key=os.path.getsize, reverse=True):
        s = os.path.getsize(f)
        if size + s > 26e6 and cur: parts.append(cur); cur, size = [], 0
        cur.append(f); size += s
    if cur: parts.append(cur)
    for i, fs in enumerate(parts, 1):
        with zipfile.ZipFile(f'{pk}/{P}_part{i}.zip', 'w', zipfile.ZIP_DEFLATED) as Z:
            for f in fs: Z.write(f, os.path.relpath(f, R).replace(os.sep, '/'))
    bat = open(f'{TK}/remotion/render.bat').read().replace('__PREFIX__', P)
    open(f'{pk}/render.bat', 'w', newline='\r\n').write(bat.replace('\r\n', '\n'))
    if os.path.exists(f'{R}/out/{P}_captions.srt'): shutil.copy(f'{R}/out/{P}_captions.srt', pk)
    open(f'{pk}/README.txt', 'w', newline='\r\n').write(f"Decked out Data - {P} video (Remotion)\n\nDouble-click render.bat. First run: it unpacks the zips, installs Remotion (once) and renders out\\{P}_final.mp4.\n"
        "render.bat draft = 720p review copy; render.bat section 3 = one section (sections.txt); render.bat studio = preview in the browser.\n"
        f"Upload {P}_captions.srt to YouTube (Subtitles > Upload file > With timing).\n")
    for z in glob.glob(f'{pk}/*.zip'):
        if os.path.getsize(z) > 30e6: stop(f'{z} is over 30 MB')
    ok(f'package in {pk}: save every file to Documents\\Decked out Data\\projects\\{P}_v<N>_remotion on the laptop (device_commit_files)')
def st_render():
    t = remaining_todos()
    if t: stop(f'{t} TODO boxes remain in the scenes: design them first')
    sh(['bash', 'render_chunks.sh'], cwd=R)
    S = slides(); mix = f"{TK}/tts/mix_voice.py"
    sh(['python3', mix, 'story/slides.json', '-', 'tts/vo', f'{R}/out/narration.wav'])
    sh(['bash', 'assemble.sh', f'out/{P}_final.mp4'], cwd=R); ok(f'{R}/out/{P}_final.mp4')

if arg == 'all': todo = STAGES[:STAGES.index('srt') + 1]
elif ':' in arg: a, b = arg.split(':'); todo = STAGES[STAGES.index(a):STAGES.index(b) + 1]
else: todo = [arg]
for s in todo:
    print(f'\n== {s}', flush=True); globals()[f'st_{s}']()
print('\nDone:', ', '.join(todo))
