// Example of the v1.1 deck helpers: mapSlide, wordCard, a CORP_MEDIA slide whose background clip is a 3-clip cut sequence.
let s;
s = mapSlide(1, { video: 'map_bg' });
s = wordCard(2);
s = frame(3, 'CORP_MEDIA'); VID(s, 'cuts_bg', { x: 0, y: 0, w: 13.333, h: 7.5, name: 'Cut video' }); mediaHead(s, 3);
R(s, { x: 0.6, y: 4.2, w: 12.13, h: 1.6, fill: GREY, name: 'Panel' }); T(s, 'Content stays put while the background cuts every few seconds', { x: 0.9, y: 4.3, w: 11.5, h: 1.4, size: 24, bold: true, name: 'Panel text' });
A(s, 1, ['Panel', 'Panel text']);
s = wordCard(4, { video: 'hold_bg' });
