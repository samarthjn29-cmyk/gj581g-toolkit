# Example of the v1.1 features: chapter map (layout map), word cards (layout word-card, lines), multi-clip background (cuts), silent hold (hold).
# Run from a project folder: python3 toolkit/story/handoff.py project.py story, then media/prep.py and deck/build.sh with a deck_config.json.
PREFIX = 'Mini'
TITLE = 'Toolkit v1.1 test'
NARRATOR = 'test'
def sl(**k):
    base = dict(tracker='2 | Experts', purpose='test', visual='test', highlight='', receipt=None, device='', trans='fade', caveat=None,
                energy='medium', style='clear', delivery='', builds=[(0.0, 0.1, 'Title (fade)')], media='none')
    base.update(k); return base
SLIDES = [
 sl(name='Map', chapter='2 | Experts', layout='map', head='Where we are', map_items=['The basics: attention as a filter', 'Experts: radiologists', 'The real world: a staged fight', 'The twist'], map_current=1, map_hidden=[3],
    vo=['Next: the experts. [beat] Surely trained eyes do better?'], media='VIDEO; full screen under tint; street at dusk'),
 sl(name='Word', chapter='2 | Experts', layout='word-card', head='Looking isn\'t seeing', lines=['Looking.', "isn't seeing."], vo=['Looking... [pause] is not the same as seeing.'], media='none'),
 sl(name='Cuts', chapter='2 | Experts', layout='media-bleed', head='Three clips, one background', cuts=[0.33, 0.66], builds=[(0.0, 0.1, 'Title (fade)'), (0.5, 0.6, 'Panel (fade)')],
    vo=['This background cuts between three short clips, so the picture changes every few seconds while the content stays put.'], media='VIDEO; full screen under tint; 3 clips cut'),
 sl(name='Hold', chapter='2 | Experts', layout='word-card', head='Your attention', lines=['You see with', 'your attention.'], hold=4, vo=['You see with your attention.'], media='VIDEO; tinted eye'),
]
SOURCES = []
