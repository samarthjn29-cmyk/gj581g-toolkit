"""Which card kinds cover the whole frame (so the picture under them is hidden).
One list for every checker (Sam, Moctar 14 Nov 2026: the 'void' card ended 0.14 s before the next shot and the old phone picture
flashed; visible_lint and build_scene each had their own short list without 'void'). The kit is also scanned: any renderer whose
root is an AbsoluteFill with a background counts as opaque, so a new full-screen kind is caught without editing this file."""
import os, re, glob
HAND = {'panels', 'title', 'number', 'split', 'bars', 'triptych', 'chain', 'later', 'ruler', 'advert', 'grid', 'namesake',
        'variants', 'recap', 'scroll', 'linechart', 'void', 'black', 'blocks', 'blueprint', 'equation', 'nest', 'rollcall', 'search'}
NOT = {'glitch', 'iris', 'pov'}   # transitions / partial overlays: the picture still shows
def _scan():
    here = os.path.dirname(os.path.abspath(__file__)); rm = os.environ.get('RM', '/home/claude/twice/remotion')
    files = glob.glob(f'{rm}/src/stills/*.jsx') + glob.glob(f'{here}/kit/*.jsx'); out = set()
    for f in files:
        kind, n = None, 0
        for line in open(f, encoding='utf8'):
            m = re.match(r'^  ([a-z]+): \(c', line)
            if m: kind, n = m.group(1), 0
            if kind and n < 4 and re.search(r'AbsoluteFill style=\{\{background', line): out.add(kind); kind = None
            n += 1
    return out
OPAQUE = (HAND | _scan()) - NOT
def is_opaque(c):
    k = c.get('kind')
    if k == 'kinetic': return c.get('style') != 'rise'
    if k == 'text': return bool(c.get('bg'))
    return k in OPAQUE
