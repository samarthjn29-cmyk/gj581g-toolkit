PREFIX = 'Mini13'
TITLE = 'Toolkit v1.3 test'
NARRATOR = 'test'
def sl(**k):
    base = dict(tracker='Intro', purpose='test', visual='test', highlight='', receipt='Source: test', device='', trans='fade', caveat=None,
                energy='medium', style='clear', delivery='', builds=[(0.0, 0.1, 'Title (fade)')], media='none')
    base.update(k); return base
TH = ['People are missing something', 'The data is missing something']
SLIDES = [
 sl(name='Hyp', chapter='Intro', layout='hypotheses', head='Two ways the feeling and the data could both be right', theories=TH,
    builds=[(0.0, 0.1, 'Title (fade)'), (0.3, 0.4, 'Theory 1 (wipe-from-left)'), (0.6, 0.7, 'Theory 2 (wipe-from-left)')], vo=['Either people are missing something. [beat] Or the data is.']),
 sl(name='Card', chapter='Intro', layout='evidence-card', head='Most people say prices are beating their pay', builds=[(0.0, 0.1, 'Card (fly-from-right)'), (0.45, 0.55, 'Arrow (wipe-from-left)')], vo=['In this test survey, nine in ten say prices are rising faster than their income.']),
 sl(name='Pills', chapter='Intro', layout='process-flow', head='A thought experiment: one teacher, one farmer', builds=[(0.0, 0.1, 'Bread (zoom)'), (0.3, 0.4, 'Scale (fade)'), (0.6, 0.7, 'Education (zoom)')], vo=['Picture one farmer and one teacher. [beat] The farmer gets faster every year. The teacher does not.']),
 sl(name='Score', chapter='Conclusion', layout='scorecard', head='The evidence backs the data story more than the feeling story',
    verdicts=[{'theory': TH[0], 'score': 1, 'note': 'Some support, small effect'}, {'theory': TH[1], 'score': 3, 'note': 'Strongest evidence'}],
    builds=[(0.0, 0.1, 'Title (fade)'), (0.3, 0.4, 'Row 1 (wipe-from-left)'), (0.6, 0.7, 'Row 2 (wipe-from-left)')], vo=['So which is it? [beat] Mostly, the data is missing something.']),
]
SOURCES = []
