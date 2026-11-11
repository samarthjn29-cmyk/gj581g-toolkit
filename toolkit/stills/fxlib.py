#!/usr/bin/env python3
"""The GJ 581g effects library (Sam, 11 Nov 2026): one entry per camera move, card, picture gag and sound.
  fxlib.py timeline OUTDIR   -> a demo timeline.json (every entry 3 s, in order) for kit/StillsScene.jsx, plus the pictures it needs
  fxlib.py clips RENDER.mp4 SFXDIR OUTDIR  -> one 3 s preview mp4 per entry, its paired sound mixed in
  fxlib.py json OUT.json      -> the library as data (for the gallery page and EFFECTS_LIBRARY.md)
Each entry: id, group, name, what it's for, the plan JSON to use it, the paired sound (with offset), and the gag shape it comes from."""
import json, sys, os, shutil, subprocess

SEG = 3.0
IMGS = ['R_gbt.jpg', 'G_alien_radio.jpg', 'R_servers.jpg', 'G_robots_react.jpg', 'R_cinema.jpg', 'G_alien_popcorn.jpg', 'R_stopwatch.jpg',
        'G_bigtech_campus.jpg', 'R_leopard.jpg', 'G_robot_helps.jpg', 'R_capitol.jpg', 'G_dc_party.jpg', 'R_vla_dawn.jpg', 'G_alien_alone.jpg']
Y = {'ground': '#FCCF3E', 'ink': '#0B5E2A', 'inkNum': '#063F1C'}

# (id, group, name, use, shot overrides, card or None, sound 'name@offset' or '', source)
L = [
 # camera moves
 ('push', 'Camera move', 'Push', 'Slow push in: the default for a still the line is about.', {'move': 'push'}, None, '', 'Ken Burns'),
 ('pullback', 'Camera move', 'Pull back', 'Starts close, reveals the whole picture: a reveal or "and here is the scale of it".', {'move': 'pullback'}, None, '', 'Ken Burns'),
 ('pan', 'Camera move', 'Pan right / panL', 'Travel across a wide picture (a landscape, a row of servers).', {'move': 'pan'}, None, '', 'Ken Burns'),
 ('tilt', 'Camera move', 'Tilt up / tiltDown', 'Climb a tall thing (a dish, a building) or come down to a detail.', {'move': 'tilt'}, None, '', 'Ken Burns'),
 ('drift', 'Camera move', 'Drift', 'Gentle float for reflective lines.', {'move': 'drift'}, None, '', 'Ken Burns'),
 ('hold', 'Camera move', 'Hold', 'Almost still: under cards, or when the picture must be read.', {'move': 'hold'}, None, '', ''),
 ('punch', 'Gag move', 'Punch-in', 'Snap zoom onto the funny detail on the beat ("Can you believe that?").', {'move': 'punch', 'punch_at': 0.6, 'punch': 0.3}, None, 'whoosh@0.5', 'Edgar Wright snap zoom'),
 ('whip', 'Gag move', 'Whip pan', 'Fast blurred arrival: a sudden change of subject.', {'move': 'whip', 'from': 70}, None, 'whoosh@0.0', 'Edgar Wright whip pan'),
 ('spin', 'Gag move', 'Spin in', 'The picture spins in from small: a newspaper-spin "meanwhile".', {'move': 'spin'}, None, 'whoosh@0.05', 'old newsreel'),
 ('crash', 'Gag move', 'Crash zoom', 'Slams in from very close: shock, a big reveal.', {'move': 'crash'}, None, 'boom@0.0', 'crash zoom'),
 ('bounce', 'Gag move', 'Bounce', 'Springy scale: cute or silly subjects (robot babies).', {'move': 'bounce'}, None, 'boing@0.0', 'cartoon squash'),
 ('dutch', 'Gag move', 'Dutch tilt', 'The frame tips over: something is wrong, mock-sinister.', {'move': 'dutch', 'angle': -8}, None, 'dundun@0.2', 'Dutch angle'),
 ('triple', 'Gag move', 'Triple zoom', 'Three snaps in: soap-opera shock reaction.', {'move': 'triple', 'triple_at': 0.3}, None, 'dundun@0.3', 'Indian daily-soap reaction'),
 ('shake', 'Gag move', 'Shake', 'Camera shake that settles: an impact, a boom, a shouted word.', {'move': 'hold', 'shake': 1.8, 'shake_at': 0.4}, None, 'boom@0.4', 'impact shake'),
 # cards: numbers and text
 ('kinetic', 'Card', 'Number card (kinetic short)', 'The spoken number in big type on the parakeet-yellow ground, words landing as said.', {}, dict(kind='kinetic', style='short', text='730 billion dollars', nums=['730'], dur=2.6, **Y), 'boom@0.3', 'Blank Rascal study'),
 ('kinetic_static', 'Card', 'Static word card', 'A short line, all words at once, no motion ("What the F**K?").', {}, dict(kind='kinetic', style='short', text='What the F**K?', static=True, dur=2.2, **Y), 'scratch@0.0', 'Sam, 11 Nov 2026'),
 ('rise', 'Card', 'Rising words', 'Big bold words rise from below over the picture.', {}, dict(kind='kinetic', style='rise', text='Seventy-two minutes', dur=2.6), 'whoosh@0.2', ''),
 ('number', 'Card', 'Big number', 'One fact-checked figure with its plain-words unit.', {}, dict(kind='number', term='$730B', text='four companies, this year', dur=2.6), 'ding@0.5', ''),
 ('title', 'Card', 'Title card', 'Chapter marks and quotes, centred serif.', {}, dict(kind='title', text='1. The cold box', dur=2.6), '', ''),
 ('text', 'Card', 'Lower text line', 'One key line low on the picture.', {}, dict(kind='text', text='More than twenty metres of volcanic rock', dur=2.6), '', ''),
 ('bars', 'Card', 'True-scale bar chart', 'Two amounts at honest scale: the camera climbs the big bar for ages.', {}, dict(kind='bars', dur=2.9, ratio=7300, h0=8, tick=4000, tickStep=50, hold0=0.8, scrollEnd=2.1, a={'label': 'Alien search, ten years', 'value': '$100 million'}, b={'label': 'Big tech, this year', 'value': '$730 billion'}), 'climb@0.8 ding@2.1', 'xkcd scale chart (E6)'),
 ('counter', 'Card', 'Draining counter', 'A money counter that holds, then drains faster and faster to $0.', {}, dict(kind='counter', dur=2.9, **{'from': 100000000}, to=0, hold=0.5, drain=1.7, label='the biggest alien search, live'), 'ticks@0.0', 'countdown gag'),
 # picture gags
 ('banner', 'Picture gag', 'Breaking-news banner', 'A sober headline about something obvious, with a joke ticker.', {}, dict(kind='banner', text='TECH COMPANIES STILL TECH COMPANIES', ticker='aliens unavailable for comment  •  more at eleven', dur=2.9), 'newsstab@0.0', 'news parody'),
 ('headline', 'Picture gag', 'Newspaper front page', 'Spins in: an Onion-style sober headline ("THE DAILY SHRUG").', {}, dict(kind='headline', text='Civilisation Spends 72 Minutes On Biggest Question Ever', dur=2.9, size=74), 'whoosh@0.0', 'The Onion / newsreel'),
 ('aside', 'Picture gag', 'Tiny aside', 'Small italic text pops on and off: a muttered comment.', {}, dict(kind='aside', text='(rated u for unfunded)', dur=2.4, x=1080, y=140, size=64), 'pop@0.0', 'Bill Wurtz'),
 ('stamp', 'Picture gag', 'Rubber stamp', 'A verdict slammed onto the picture (REJECTED, CANCELLED).', {}, dict(kind='stamp', text='CANCELLED', dur=2.4, rot=-12), 'boom@0.05', 'stamp gag'),
 ('starburst', 'Picture gag', 'Infomercial starburst', 'A spiky yellow star with a "deal": mock salesmanship.', {}, dict(kind='starburst', text='ONLY $100M!\nTEN WHOLE\nYEARS!', dur=2.4), 'tada@0.0', 'infomercial'),
 ('pip', 'Picture gag', 'Reaction pop-up', 'A reaction picture pops up in the corner.', {}, dict(kind='pip', img='G_alien_popcorn.jpg', dur=2.4), 'pop@0.0', 'reaction cut-in'),
 ('flash', 'Picture gag', 'White flash', 'A camera-flash frame on an impact or a cut.', {}, dict(kind='flash', dur=0.3, t_off=0.8), 'click@0.8', ''),
 ('rain', 'Picture gag', 'Money rain', 'Banknotes falling over the picture: big spending.', {}, dict(kind='rain', dur=2.9), 'register@0.2', 'make-it-rain'),
 ('confetti', 'Picture gag', 'Confetti burst', 'A burst of confetti from the bottom: mock celebration.', {}, dict(kind='confetti', dur=2.6), 'popper@0.0', 'party gag'),
 ('glint', 'Picture gag', 'Sparkle glint', 'A light sweep and twinkles: "shiny", "brand new".', {}, dict(kind='glint', dur=1.2, t_off=0.6), 'sparkle@0.6', 'sparkle'),
 ('freeze', 'Picture gag', 'Freeze-frame caption', 'The picture goes grey and a yellow label lands: "Yep. That\'s me."', {}, dict(kind='freeze', text='Yep. That\'s the plan.', dur=2.6, t_off=0.3), 'scratch@0.3', 'freeze-frame narration'),
 ('circle', 'Picture gag', 'Red circle', 'A hand-drawn circle around the detail, with a scribble.', {}, dict(kind='circle', x=0.5, y=0.45, rx=0.14, text='the entire budget', dur=2.6, t_off=0.2), 'squeak@0.2', 'red-circle annotation'),
 ('arrow', 'Picture gag', 'Red arrow', 'An arrow from a scribbled note to the thing that matters.', {}, dict(kind='arrow', x=0.55, y=0.55, fx=0.22, fy=0.2, text='this costs $0', dur=2.6, t_off=0.2), 'squeak@0.3', 'annotation'),
 ('censor', 'Picture gag', 'Censor bar', 'A black bar over a word or a face, with a bleep.', {}, dict(kind='censor', x=0.36, y=0.42, w=0.28, h=0.12, text='[REDACTED]', dur=2.6, delay=0.4), 'bleep@0.4', 'censor bar'),
 ('censor_blur', 'Picture gag', 'Blur box', 'A blurred mosaic box: "we are not allowed to show this".', {}, dict(kind='censor', mode='blur', x=0.3, y=0.25, w=0.4, h=0.45, dur=2.6, delay=0.3), 'bleep@0.3', 'pixelation'),
 ('spotlight', 'Picture gag', 'Spotlight', 'Everything goes dark except the detail: "and THIS is the problem".', {}, dict(kind='spotlight', x=0.5, y=0.45, r=0.13, text='the one that matters', dur=2.6), 'dundun@0.2', 'iris highlight'),
 ('lens', 'Picture gag', 'Magnifying glass', 'A lens enlarges a tiny detail of the same picture.', {}, dict(kind='lens', x=0.5, y=0.4, r=0.13, zoom=2.6, dur=2.6), 'pop@0.0', 'magnifier'),
 ('bubble', 'Picture gag', 'Speech bubble', 'A picture "says" the subtext.', {}, dict(kind='bubble', text='Please. Just one more data centre.', x=0.64, y=0.22, tx=0.5, ty=0.5, dur=2.6), 'pop@0.0', 'comic bubble'),
 ('think', 'Picture gag', 'Thought bubble', 'What the subject is secretly thinking.', {}, dict(kind='bubble', think=True, text='is anyone out there?', x=0.66, y=0.22, tx=0.48, ty=0.55, dur=2.6), 'pop@0.0', 'comic bubble'),
 ('notify', 'Picture gag', 'Phone notification', 'A push notification slides down with the bad news.', {}, dict(kind='notify', app='Space budget', title='Mission cancelled', text='Your Mars sample is now someone else\'s problem.', dur=2.9), 'ping@0.1', 'phone notification'),
 ('errorbox', 'Picture gag', 'Error dialog', 'A retro error box (stacked): something has stopped working.', {}, dict(kind='errorbox', title='budget.exe', text='Funding for curiosity has stopped responding.', stack=3, dur=2.9), 'error@0.0 error@0.18 error@0.36', 'computer error'),
 ('loading', 'Picture gag', 'Stalled loading bar', 'A progress bar that crawls and stalls at 3%.', {}, dict(kind='loading', text='Loading alien budget…', pct=3, sub='about 40 years left', dur=2.9), 'ticks@0.0', 'loading bar'),
 ('tag', 'Picture gag', 'Price tag', 'A swinging price tag on the thing: "this is what it costs".', {}, dict(kind='tag', text='$100M', sub='ten years', x=0.66, y=0.12, dur=2.6), 'register@0.25', 'price tag'),
 ('strike', 'Picture gag', 'Strike-through correction', 'A word struck out and the honest one scribbled above.', {}, dict(kind='strike', before='The search was ', wrong='funded', right='defunded', after='.', dur=2.9), 'squeak@0.5', 'self-correction'),
 ('caption', 'Picture gag', 'Meme caption', 'Big outlined words at the top and bottom of the picture.', {}, dict(kind='caption', top='They spent $730 billion', bottom='on not aliens', dur=2.6), 'airhorn@0.2', 'meme caption'),
 ('trend_down', 'Picture gag', 'Crashing line', 'A red line crashes down across the picture.', {}, dict(kind='trend', dir='down', text='alien funding', dur=2.6), 'fall@0.1', 'stonks'),
 ('trend_up', 'Picture gag', 'Rocketing line', 'A green line rockets up across the picture.', {}, dict(kind='trend', dir='up', text='AI spending', dur=2.6), 'climb@0.1', 'stonks'),
 ('rec', 'Picture gag', 'Camcorder REC', 'Corner brackets, blinking REC and a timecode: "live footage".', {}, dict(kind='rec', text='REC', dur=2.9, **{'from': 3601}), 'click@0.0', 'found footage'),
 ('glitch', 'Picture gag', 'VHS glitch', 'Scan lines, tearing and a PLAY read-out: rewinding, old tape, a malfunction.', {}, dict(kind='glitch', dur=1.6, t_off=0.5), 'static@0.5', 'VHS'),
 ('split', 'Picture gag', 'Expectation vs reality', 'Two pictures side by side, labelled.', {}, dict(kind='split', imgs=['G_alien_radio.jpg', 'R_leopard.jpg'], labels=['EXPECTATION', 'REALITY'], dur=2.9), 'trombone@0.6', 'expectation vs reality meme'),
 ('later', 'Picture gag', '"Some time later…" card', 'The old documentary time-skip card.', {}, dict(kind='later', text='Thirty years later…', dur=2.6), 'tada@0.0', 'SpongeBob-style time card'),
 ('iris', 'Picture gag', 'Iris out', 'The picture closes to a circle and goes black: "that\'s all, folks".', {}, dict(kind='iris', x=0.5, y=0.45, dur=2.4, t_off=0.4), 'boing@1.6', 'Looney Tunes iris'),
 ('sticker', 'Picture gag', 'Sticker pop-in', 'A cut-out object with a white border pops in and stays (Indian vlog texture).', {}, dict(kind='sticker', file='coin.json', x=0.78, y=0.42, w=0.22, text='₹100?', dur=2.6), 'pop@0.0', 'Slayy Point (edit study)'),
 ('burst', 'Picture gag', 'Collage sting', 'One second of tilted pictures around one big word, then straight back.', {}, dict(kind='burst', imgs=['G_bigtech_campus.jpg', 'R_servers.jpg', 'G_dc_party.jpg', 'R_capitol.jpg'], text='WOW.', dur=1.6), 'r:impact@0.0', 'Climate Town "DANG!" (edit study)'),
 ('grow', 'Picture gag', 'Escalating words', 'Each spoken word bigger than the last, for a line that builds to a punch.', {'move': 'crash'}, dict(kind='grow', text='Seventy-two. Whole. MINUTES.', times=[0.0, 0.5, 1.0], dur=2.6), 'whoosh@0.0 r:impact@1.0', 'OverSimplified (edit study)'),
 ('doc', 'Picture gag', 'Document slide-in', 'A document slides in, then its key line is lifted out as big highlighted text.', {}, dict(kind='doc', title='FY2026 Budget Request', quote='Mars Sample Return: terminated.', source='NASA budget request, 2026', dur=2.9), 'whoosh@0.0', 'Climate Town (edit study)'),
 ('meter', 'Picture gag', 'Evidence badge', 'A corner badge rates each claim as it is spoken, from the fact-check verdict (a running gag that stays honest).', {}, dict(kind='meter', title='EVIDENCE', steps=[[0, 'SOLID', '#22C55E', '✓'], [1.0, 'SORT OF', '#FCCF3E', '~'], [2.0, 'NOPE', '#E0261B', '✕']], dur=2.9), 'r:correct@0.0 r:wrong@2.0', 'Sam O\'Nella Academy (study 2)'),
 ('chain', 'Picture gag', 'Evolution chain', 'Pictures in a row joined by red arrows, each step a degree worse, the last a twist.', {}, dict(kind='chain', imgs=['R_gbt.jpg', 'R_servers.jpg', 'G_dc_party.jpg', 'G_alien_popcorn.jpg'], labels=['the plan', 'the budget', 'the priority', 'the aliens'], gap=0.55, dur=2.9), 'pop@0.0 pop@0.55 pop@1.1 r:sadtrombone@1.65', 'Casually Explained (study 2)'),
 ('labels', 'Picture gag', 'Stacked label arrows', 'Short labels arrive one by one, all pointing at the same subject, so the joke builds.', {}, dict(kind='labels', items=['cold', 'on hold', 'in a metal box', 'happy?'], x=0.5, y=0.55, gap=0.55, dur=2.9), 'pop@0.0 pop@0.55 pop@1.1 pop@1.65', 'Sam O\'Nella Academy (study 2)'),
 ('overlay_static', 'Picture gag', 'TV static overlay', 'Real TV static over the picture for a moment: a signal, a channel change, a glitch.', {}, dict(kind='overlay', file='ov_static_tv.mp4', opacity=0.6, dur=1.2), 'r:static@0.0', 'Mixkit footage'),
 ('overlay_glitch', 'Picture gag', 'TV glitch overlay', 'A real glitching-screen texture over the picture.', {}, dict(kind='overlay', file='ov_glitch_tv.mp4', opacity=0.7, dur=1.6), 'r:glitch@0.0', 'Mixkit footage'),
 ('lottie_explosion', 'Animation', 'Cartoon Explosion', 'LottieFiles animation by bejika (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='explosion.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:impact@0.0', 'LottieFiles'),
 ('lottie_bomb', 'Animation', 'Bomb Explosion Cartoon', 'LottieFiles animation by bejika (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='bomb.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'boom@0.8', 'LottieFiles'),
 ('lottie_headboom', 'Animation', 'Emoji Head Explosion', 'LottieFiles animation by lzt2562861buk2qd (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='headboom.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:impact@0.3', 'LottieFiles'),
 ('lottie_fireworks', 'Animation', 'Fireworks', 'LottieFiles animation by SelvaUX (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='fireworks.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:cheer@0.0', 'LottieFiles'),
 ('lottie_confetti', 'Animation', 'Confetti', 'LottieFiles animation by lhgfbbx7pjxaop0y (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='confetti.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:laughclap@0.0', 'LottieFiles'),
 ('lottie_ufo', 'Animation', 'Ufo Lottie Animation', 'LottieFiles animation by smrony (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='ufo.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:sparklewhoosh@0.0', 'LottieFiles'),
 ('lottie_alien_rocket', 'Animation', 'Alien Going To Space Emoji Animation', 'LottieFiles animation by animoox (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='alien_rocket.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:whoosh@0.2', 'LottieFiles'),
 ('lottie_money', 'Animation', 'Money', 'LottieFiles animation by mahendra (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='money.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'register@0.3', 'LottieFiles'),
 ('lottie_money_fall', 'Animation', 'Green Money Falling', 'LottieFiles animation by bo4qrpsi6p (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='money_fall.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:servicebell@0.0', 'LottieFiles'),
 ('lottie_coin', 'Animation', 'Coin', 'LottieFiles animation by kpiwd93x6lik6wdr (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='coin.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:pop@0.0', 'LottieFiles'),
 ('lottie_sparkles', 'Animation', 'Sparkle Stars', 'LottieFiles animation by jst40i3h130syma3 (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='sparkles.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'sparkle@0.0', 'LottieFiles'),
 ('lottie_question', 'Animation', 'Question Mark', 'LottieFiles animation by avh0fk3jtl (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='question.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:suspense@0.0', 'LottieFiles'),
 ('lottie_facepalm', 'Animation', 'Facepalm', 'LottieFiles animation by zzkxhjpygu (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='facepalm.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:failpiano@0.2', 'LottieFiles'),
 ('lottie_crying', 'Animation', 'Crying Emoji', 'LottieFiles animation by lhgfbbx7pjxaop0y (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='crying.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:sadtrombone@0.0', 'LottieFiles'),
 ('lottie_thumbsdown', 'Animation', 'Thumbs Down', 'LottieFiles animation by jituraut (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='thumbsdown.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:wrong@0.2', 'LottieFiles'),
 ('lottie_check', 'Animation', 'Check Mark', 'LottieFiles animation by illustratemotionstudio (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='check.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:correct@0.1', 'LottieFiles'),
 ('lottie_cross', 'Animation', 'Cross', 'LottieFiles animation by manju (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='cross.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:wrong@0.1', 'LottieFiles'),
 ('lottie_clock', 'Animation', 'Clock Time', 'LottieFiles animation by fsdgmitcdl32sui5 (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='clock.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'ticks@0.0', 'LottieFiles'),
 ('lottie_eyes', 'Animation', 'Eyes', 'LottieFiles animation by samedcetin (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='eyes.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:pop@0.0', 'LottieFiles'),
 ('lottie_popcorn', 'Animation', 'Popcorn', 'LottieFiles animation by bizwbzqp7w (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='popcorn.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:crowdlaugh@0.0', 'LottieFiles'),
 ('lottie_globe', 'Animation', 'Earth Globe Rotating With Seamless Loop ', 'LottieFiles animation by kvwizbmx6vrsy15u (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='globe.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:whooshcine@0.0', 'LottieFiles'),
 ('lottie_skull', 'Animation', 'Haunted Skull', 'LottieFiles animation by mandysasaaa (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='skull.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:gameover@0.0', 'LottieFiles'),
 ('lottie_alert', 'Animation', 'Alert', 'LottieFiles animation by Martov90 (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='alert.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:wronglong@0.0', 'LottieFiles'),
 ('lottie_smile', 'Animation', 'Emoji Smile Face', 'LottieFiles animation by Chondonbackla705 (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='smile.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:cartoonlaugh@0.0', 'LottieFiles'),
 ('lottie_rocket', 'Animation', 'Rocket Launch Animation Space Exploratio', 'LottieFiles animation by animoox (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='rocket.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:whoosh@0.0', 'LottieFiles'),
 ('lottie_robot', 'Animation', 'Robot', 'LottieFiles animation by iwgyi7wxx1 (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='robot.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:squeaky@0.2', 'LottieFiles'),
 ('lottie_spit', 'Animation', 'Spits Coffee', 'LottieFiles animation by zzkxhjpygu (Lottie Simple License). Place it on a picture as a reaction or a literal object.', {}, dict(kind='lottie', file='spit.json', x=0.5, y=0.5, w=0.42, loop=True, dur=2.9), 'r:splat@0.4', 'LottieFiles'),
 # built 11 Nov 2026: the South Park, Tanmay Bhat and Captain Disillusion gags (gag_schools.json)
 ('count', 'Picture gag', 'Running-gag counter', 'A plain black counter tallies a running gag each time it returns ("NOTHING · 1", "NOTHING · 2").', {}, dict(kind='count', text='NOTHING · 1', x=0.5, y=0.5, dur=2.2), 'click@0.25', 'South Park "01 OF 50" card'),
 ('callin', 'Picture gag', 'Call-in box', 'One static photo in a phone-in box with a ringing phone icon and an ON THE LINE strap: give a picture a voice.', {}, dict(kind='callin', img='G_alien_popcorn.jpg', name='ALIEN, DEEP SPACE', title='Human have money. Human buy computer.', dur=2.9), 'r:notify@0.1', 'South Park news call-in'),
 ('triptych', 'Picture gag', 'Slide-talk stage', 'A lecture stage with three screens; our pictures swap in on cue words, one point per screen.', {}, dict(kind='triptych', imgs=['R_gbt.jpg', 'R_servers.jpg', 'R_leopard.jpg'], slides=[[0, 0, 0], [0.6, 1, 1], [1.2, 2, 2]], caps=['the cost', 'the competition', 'the upside'], dur=2.9), 'click@0.0 click@0.85 click@1.45', 'South Park slide talk'),
 ('ruler', 'Picture gag', 'Crude scale diagram', 'A schoolroom ruler on flat yellow with one tiny red tick: how small something is, shown literally.', {}, dict(kind='ruler', title='One year of NASA science', max=365, step=30, unit='days', marks=[[4, 'big tech: 4 days']], dur=2.9), 'squeak@0.75', 'South Park crude diagram'),
 ('advert', 'Picture gag', 'Mock advert switch', 'Hard cut to a glossy advert: slow push, lens flare, gold serif title, then a tagline on black.', {}, dict(kind='advert', img='R_servers.jpg', title='THE CLOUD', tagline='Very large warm boxes.\nThat think.', tagDur=1.2, dur=2.9), 'sparkle@0.2', 'South Park PSA'),
 ('grey', 'Picture gag', 'Grey-out', 'The subject of the joke drains to black and white while the rest stays in colour.', {'img': 'G_robots_react.jpg', 'move': 'hold'}, dict(kind='grey', x=0.36, y=0.08, w=0.3, h=0.9, scale=1.04, dur=2.6), 'scratch@0.0', 'Tanmay Bhat roast edit'),
 ('grid', 'Picture gag', 'Reaction grid', 'One line, then a grid of reaction pictures popping in (our mascot or anonymous stock only).', {}, dict(kind='grid', imgs=['G_alien_popcorn.jpg', 'G_robots_react.jpg', 'G_alien_alone.jpg', 'G_alien_radio.jpg'], labels=['aliens', 'robots', 'also aliens', 'nobody'], dur=2.6), 'pop@0.0 pop@0.1 pop@0.2 pop@0.3', 'Tanmay Bhat reaction grid'),
 ('namesake', 'Picture gag', 'Namesake card', 'An idea named after a person: their real portrait (open licence) beside the idea, the name stamped on in yellow.', {}, dict(kind='namesake', img='R_drake_portrait.jpg', idea='R_tatel_1958.jpg', name='DRAKE', stampAt=0.6, dur=2.9), 'r:impact@0.6', 'Captain Disillusion'),
 ('variants', 'Picture gag', 'Variants board', 'The same picture several times, each with a named treatment, lit one by one.', {}, dict(kind='variants', img='G_alien_alone.jpg', title='THE SAME EMPTY SKY, ACCORDING TO', items=[['OPTIMISTS', 'saturate(1.7) brightness(1.15)'], ['PESSIMISTS', 'grayscale(1) contrast(1.3)'], ['ACCOUNTANTS', 'sepia(1)'], ['YOUR MUM', 'hue-rotate(150deg)']], gap=0.55, dur=2.9), 'click@0.0 click@0.55 click@1.1 click@1.65', 'Captain Disillusion'),
]

SOUNDS = [('trombone', 'Sad trombone: a failure, a let-down'), ('boo', 'Crowd boo (synthesised; a real CC0 one is sfx_boo_real)'), ('popper', 'Party popper'),
 ('register', 'Cash register ka-ching'), ('kiss', 'Cartoon "mwah"'), ('airhorn', 'Air horn'), ('scratch', 'Record scratch: stop, what?'), ('drumroll', 'Drum roll before a reveal'),
 ('boom', 'Deep boom on a big number or impact'), ('whistle', 'Short slide whistle up'), ('climb', 'Long slide whistle up: a bar or line that keeps going'), ('fall', 'Slide whistle down: things going badly'),
 ('dundun', 'Dun-dun-DUNNN: mock drama'), ('whoosh', 'Whoosh for fast moves and spins'), ('thunder', 'Thunder: doom'), ('boing', 'Cartoon boing'), ('tada', 'Ta-da fanfare'),
 ('kazoo', 'Kazoo fanfare: mock triumph'), ('newsstab', 'News sting'), ('ding', 'Clean bell ding: a correct answer, a landing'), ('sparkle', 'Sparkle chime: shiny'),
 ('ticks', 'Stopwatch ticking faster and faster'), ('bleep', 'Censor bleep'), ('static', 'TV static burst'), ('ping', 'Phone notification'), ('error', 'Retro computer error buzz'),
 ('pop', 'Bubble pop: something appears'), ('click', 'Camera shutter'), ('squeak', 'Marker squeak while drawing')]

REAL = [tuple(l.rstrip('\n').split('\t')[0::2]) for l in open('/home/claude/aliens/sfx_real/pick.tsv')]   # (name, Mixkit title)

def entries():
    out = []
    for i, (eid, grp, name, use, shot, card, snd, src) in enumerate(L):
        t0 = round(i * SEG, 2); s = {'id': eid, 't': t0, 'dur': SEG, 'img': IMGS[i % len(IMGS)], 'move': 'hold', 'cut': True, **shot}
        c = None
        if card:
            c = dict(card); off = c.pop('t_off', 0.25); c['t'] = round(t0 + off, 2)
        plan = {'shot': {k: v for k, v in shot.items()} or None, 'card': ({k: v for k, v in card.items() if k != 't_off'} if card else None)}
        out.append(dict(id=eid, group=grp, name=name, use=use, t=t0, shotdef=s, card=c, plan=plan,
                        sounds=[x for x in snd.split() if x], source=src))
    return out

def timeline(od):
    E = entries(); os.makedirs(od, exist_ok=True); shots = [e['shotdef'] for e in E]; cards = [e['card'] for e in E if e['card']]
    words = []
    for e in E:   # kinetic cards land each word on a spoken time: fake evenly spaced "words" in the demo
        c = e['card']
        if c and c['kind'] == 'kinetic' and c.get('style') == 'short':
            for j, w in enumerate(c['text'].split()): words.append([w, round(c['t'] + j * 0.35, 2), round(c['t'] + j * 0.35 + 0.3, 2)])
    dur = round(len(E) * SEG, 2)
    for f in set(IMGS + ['G_alien_popcorn.jpg', 'G_alien_radio.jpg', 'R_leopard.jpg', 'R_drake_portrait.jpg', 'R_tatel_1958.jpg']):
        for d in ('/home/claude/aliens/public/real', '/home/claude/aliens/ai'):
            if os.path.exists(f'{d}/{f}'): shutil.copy(f'{d}/{f}', f'{od}/{f}'); break
    for d in ('/home/claude/aliens/lottie/json', '/home/claude/aliens/video/overlays'):
        for f in os.listdir(d): shutil.copy(f'{d}/{f}', f'{od}/{f}')
    for e in E:   # the lens shows the shot's own picture
        if e['card'] and e['card']['kind'] in ('lens', 'grey'): e['card']['img'] = e['shotdef']['img']
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', str(dur), '-c:a', 'libmp3lame', f'{od}/vo.mp3'], check=True)
    pub = os.path.abspath(od).split('/public/')[-1]
    json.dump({'dir': pub, 'scene': 'fxlib', 't0': 0, 'dur': dur, 'words': words, 'shots': shots, 'cards': cards, 'finish': {'vignette': 0.3}}, open(f'{od}/timeline.json', 'w'), indent=1)
    print(len(E), 'entries,', dur, 's')

def clips(render, sfx, od, first=0):
    os.makedirs(od, exist_ok=True); E = entries(); base = E[first]['t']
    for e in E[first:]:
        ins, fc, mix = ['-ss', str(round(e['t'] - base, 2)), '-t', str(SEG), '-i', render], [], []
        for k, s in enumerate(e['sounds']):
            n, off = s.split('@'); ins += ['-i', f'{sfx}_real/mk_{n[2:]}.wav' if n.startswith('r:') else f'{sfx}/sfx_{n}.wav']
            fc.append(f'[{k + 1}:a]volume=-6dB,adelay={int(float(off) * 1000)}:all=1,aresample=48000[s{k}]'); mix.append(f'[s{k}]')
        if mix: fc.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0,apad,atrim=0:{SEG}[a]"); amap = ['-map', '[a]']
        else: fc.append(f'anullsrc=r=48000:cl=stereo,atrim=0:{SEG}[a]'); amap = ['-map', '[a]']
        subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fc), '-map', '0:v', *amap, '-vf', 'scale=640:360',
                        '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', '-t', str(SEG), f'{od}/{e["id"]}.mp4'], check=True)
    for n, _ in SOUNDS: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{sfx}/sfx_{n}.wav', '-c:a', 'libmp3lame', '-b:a', '96k', f'{od}/sfx_{n}.mp3'], check=True)
    for n, _ in REAL: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{sfx}_real/mk_{n}.mp3', '-t', '6', '-c:a', 'libmp3lame', '-b:a', '96k', f'{od}/real_{n}.mp3'], check=True)
    print('clips done')

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'timeline': timeline(sys.argv[2])
    if cmd == 'clips': clips(*sys.argv[2:5], int(sys.argv[5]) if len(sys.argv) > 5 else 0)
    if cmd == 'json': json.dump({'entries': [{k: v for k, v in e.items() if k not in ('shotdef', 'card', 't')} for e in entries()], 'sounds': SOUNDS, 'real': REAL}, open(sys.argv[2], 'w'), indent=1)
