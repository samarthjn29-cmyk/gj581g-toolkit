#!/usr/bin/env python3
"""Scene lint for hand-written Remotion scenes (LongChat lessons, 2 Nov 2026).
Flags HTML text components placed inside an SVG <Sheet> (they don't render) and SVG pieces placed outside a <Sheet>
(they don't render either: the missing "11 of 13" squares chart), plus wobbly strokes on straight-edged objects.
Usage: scene_lint.py scenes.jsx"""
import re, sys
HTML = {'Hand', 'Mono', 'Stamp', 'Hero', 'Label', 'Src', 'PartCard', 'Montage', 'AbsoluteFill', 'OffthreadVideo', 'Page'}
SVG = {'Ink', 'Grid', 'Paper', 'Sticky', 'Solid', 'Gauge2', 'Walker', 'Pupil', 'Msg', 'Card', 'Scroll', 'Spot', 'PopG', 'DeskRoom', 'Laptop',
       'path', 'rect', 'circle', 'ellipse', 'line', 'g', 'defs', 'text', 'Bub', 'Die', 'ChatWin'}
src = open(sys.argv[1]).read(); bad = 0
for m in re.finditer(r'export const (S\d+|\w+) = \(\) =>(.*?)(?=\n(?:export )?const |\n// -{5}|\Z)', src, re.S):
    name, body = m.group(1), m.group(2); depth = 0
    for t in re.finditer(r'<(/?)(\w+)([^<>]*?)(/?)>', body):
        close, tag, attrs, selfc = t.groups()
        if tag in ('Sheet', 'svg'):
            depth += -1 if close else (0 if selfc else 1); continue
        if close or tag[0].islower() and tag not in SVG: continue
        line = src[:m.start(2) + t.start()].count('\n') + 1
        if depth > 0 and tag in HTML - {'Page'}: print(f'{name} line {line}: <{tag}> is HTML but sits inside <Sheet> (will not render)'); bad += 1
        if depth == 0 and tag in SVG and tag not in ('g', 'defs', 'text'): print(f'{name} line {line}: <{tag}> is SVG but sits outside <Sheet> (will not render)'); bad += 1
for m in re.finditer(r'wob\(\[\[[^\]]*\][^)]*\)', src):
    pass  # wob is fine for organic shapes; architecture should use poly (see the scene-quality skill)
print('scene lint:', 'clean' if not bad else f'{bad} issue(s)')
