// Dollar Yardstick No. 3 ("Cousin Sam's coffee"): clean vector illustration pilot (5 Nov 2026).
// Flat shapes, no outlines, one shade tone per colour, straight edges for buildings (scene-quality section 2).
// Palette from the S8 Banknote identity. Maps: Natural Earth via world-atlas (credit "Maps: Natural Earth").
import React from 'react';
import {AbsoluteFill, staticFile, delayRender, continueRender} from 'remotion';
import {geoNaturalEarth1, geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import world110 from 'world-atlas/countries-110m.json';
import world50 from 'world-atlas/countries-50m.json';
import {C, OS, FR, IN} from './bank';
import {Rig, shade, tint} from './rig3';
import {HECK} from './heckler';
import {SAM} from './twice';

if (typeof document !== 'undefined') { const h = delayRender('kalam');
  new FontFace('Kalam', `url(${staticFile('fonts/Kalam-Bold.ttf')})`).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h)); }
const W = 1920, H = 1080;
const P = {paper: '#EFE9DA', paper2: '#F7F3E8', green: '#24493A', green2: '#3E6B52', sage: '#A9BFA0', ox: '#7A2333', gold: '#B98B2E', gold2: '#E2B54A', ink: '#1C2422', mute: '#8A8070', sky: '#DCE6E0', wood: '#8A5A3B', wood2: '#6B4430', cream: '#F4ECDD', coffee: '#5A3A28'};
const MARINA = {skin: '#B9835E', hair: 'long', hairColor: '#2A1C14', top: '#C4623F', bottom: '#3E3A36', hat: 'sunhat', hatColor: '#D9B77A'};
const SAMCAFE = {...SAM, apron: '#5A3A28'};
const UNDER = {skin: '#E9D3BC', hair: 'short', hairColor: '#2A2522', top: '#1C1A18', bottom: '#1C1A18', tie: '#1C1A18', hat: 'top', hatColor: '#1C1A18'};
const Svg = ({children}) => <svg width={W} height={H} style={{position: 'absolute'}}>{children}</svg>;
const Label = ({x, y, children, s = 30, c = P.ink, a = 'middle', f = OS, w = 700, ls = 3}) => <text x={x} y={y} textAnchor={a} fontFamily={f} fontWeight={w} fontSize={s} letterSpacing={ls} fill={c}>{children}</text>;
const Tag = ({x, y, t, c = P.ox}) => <g><rect x={x} y={y} width={t.length * 22 + 40} height={52} rx={6} fill={c} /><Label x={x + 20} y={y + 37} a="start" s={32} c={P.cream}>{t}</Label></g>;
const poly = (pts) => 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';

// ---------- 1. Sam's café in Pune
export const Cafe = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg>
    <rect x={0} y={0} width={W} height={700} fill="#E8DCC4" />
    {/* window with a street outside */}
    <rect x={1180} y={120} width={600} height={420} rx={8} fill={P.sky} />
    <path d={poly([[1180, 420], [1300, 330], [1420, 400], [1560, 300], [1780, 390], [1780, 540], [1180, 540]])} fill={P.sage} />
    {[1240, 1380, 1520, 1660].map((x, i) => <g key={x}><rect x={x} y={360 - (i % 2) * 40} width={90} height={180 + (i % 2) * 40} fill={i % 2 ? '#C9B79A' : '#D8C7A8'} /><rect x={x + 20} y={390 - (i % 2) * 40} width={20} height={24} fill="#F7F3E8" /><rect x={x + 52} y={390 - (i % 2) * 40} width={20} height={24} fill="#F7F3E8" /></g>)}
    <rect x={1180} y={120} width={600} height={420} rx={8} fill="none" stroke={P.wood2} strokeWidth={18} />
    <rect x={1472} y={120} width={16} height={420} fill={P.wood2} />
    {/* menu board */}
    <rect x={140} y={110} width={520} height={330} rx={10} fill={P.green} />
    <Label x={400} y={180} c={P.cream} s={40}>SAM'S CAFÉ</Label>
    {['Filter coffee', 'Masala chai', 'Brazil pour-over'].map((t, i) => <g key={t}><Label x={190} y={250 + i * 58} a="start" c={P.cream} f={IN} w={500} s={30} ls={0}>{t}</Label><circle cx={620} cy={240 + i * 58} r={10} fill={i === 2 ? P.gold2 : P.sage} /></g>)}
    {/* shelf with jars */}
    <rect x={720} y={330} width={380} height={16} fill={P.wood2} />
    {[750, 830, 910, 990].map((x, i) => <g key={x}><rect x={x} y={250} width={60} height={80} rx={10} fill={['#C9A27A', '#8A5A3B', '#B98B2E', '#5A3A28'][i]} opacity="0.9" /><rect x={x + 6} y={240} width={48} height={14} rx={4} fill={P.wood2} /></g>)}
    {/* counter */}
    <rect x={0} y={700} width={W} height={380} fill={P.wood} />
    <rect x={0} y={700} width={W} height={34} fill={P.wood2} />
    {/* espresso machine */}
    <rect x={260} y={540} width={300} height={160} rx={14} fill="#B9B2A2" /><rect x={280} y={560} width={260} height={40} rx={8} fill="#8A8070" />
    <rect x={330} y={600} width={24} height={50} fill="#5E5A52" /><rect x={466} y={600} width={24} height={50} fill="#5E5A52" />
    <rect x={318} y={660} width={48} height={40} rx={6} fill={P.cream} /><rect x={454} y={660} width={48} height={40} rx={6} fill={P.cream} />
    {/* bag of Brazilian beans */}
    <path d={poly([[1260, 700], [1300, 560], [1440, 560], [1480, 700]])} fill="#D9C3A0" /><rect x={1290} y={545} width={160} height={24} rx={6} fill="#C4AE88" />
    <Label x={1370} y={640} s={30} c={P.green}>BRASIL</Label><Label x={1370} y={676} s={20} c={P.mute} ls={2}>GREEN COFFEE</Label>
    <Rig x={900} y={1000} s={1.0} look={SAMCAFE} face="happy" pose={{fa: 30, fb: 60}} frontItem={(hx, hy) => <g transform={`translate(${hx} ${hy - 20})`}><path d="M -22 -24 L 22 -24 L 16 18 L -16 18 Z" fill="#F7F3E8" /><path d="M 22 -14 C 36 -14 36 4 20 4" stroke="#F7F3E8" strokeWidth="6" fill="none" /><path d="M -6 -34 C -12 -46 4 -52 -2 -64" stroke="#B9B2A2" strokeWidth="4" fill="none" /></g>} />
    <rect x={560} y={760} width={720} height={320} fill={P.wood} />
  </Svg>
  <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.mute}}>PUNE, INDIA · ILLUSTRATION</div>
</AbsoluteFill>;

// ---------- 2. Marina's coffee farm
export const Farm = () => <AbsoluteFill style={{background: '#E4ECE2'}}>
  <Svg>
    <circle cx={1580} cy={200} r={90} fill={P.gold2} opacity="0.9" />
    <path d="M 0 560 C 300 430 560 470 820 520 C 1100 580 1400 420 1920 470 L 1920 1080 L 0 1080 Z" fill="#9DB894" />
    <path d="M 0 700 C 360 600 700 640 1000 690 C 1300 740 1600 640 1920 660 L 1920 1080 L 0 1080 Z" fill={P.green2} />
    <path d="M 0 860 C 400 800 900 830 1920 820 L 1920 1080 L 0 1080 Z" fill={P.green} />
    {/* coffee rows on the middle hill */}
    {Array.from({length: 5}, (_, r) => Array.from({length: 14}, (_, i) => { const x = 40 + i * 140 + (r % 2) * 70, y = 650 + r * 40 + Math.sin(i * 0.6) * 12; return <g key={`${r}-${i}`}><ellipse cx={x} cy={y} rx={46} ry={24} fill={shade('#3E6B52', 0.85)} /><circle cx={x - 12} cy={y - 4} r={5} fill="#C4362B" /><circle cx={x + 14} cy={y + 2} r={5} fill="#C4362B" /></g>; }))}
    {/* farmhouse */}
    <rect x={1320} y={430} width={230} height={150} fill={P.cream} /><path d={poly([[1300, 440], [1435, 360], [1570, 440]])} fill={P.ox} />
    <rect x={1410} y={500} width={50} height={80} fill={P.wood2} /><rect x={1345} y={470} width={44} height={40} fill={P.sky} />
    {/* sacks */}
    {[0, 1, 2].map((i) => <g key={i}><path d={poly([[1120 + i * 100, 960], [1140 + i * 100, 840], [1220 + i * 100, 840], [1240 + i * 100, 960]])} fill="#D9C3A0" /><Label x={1180 + i * 100} y={918} s={18} c={P.green}>CAFÉ</Label></g>)}
    <Rig x={760} y={1010} s={1.0} look={MARINA} face="smile" turn={1} pose={{fa: 40, fb: 30, ba: 10, bb: 10}} />
  </Svg>
  <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.green}}>MINAS GERAIS, BRAZIL · ILLUSTRATION</div>
</AbsoluteFill>;

// ---------- 3. The route map: Pune -> New York -> Brazil
const countries110 = feature(world110, world110.objects.countries).features;
const HI = {'356': P.gold2, '840': P.ox, '076': P.green2};
export const RouteMap = () => { const proj = geoNaturalEarth1().fitExtent([[80, 140], [1840, 1000]], {type: 'Sphere'}); const path = geoPath(proj);
  const pune = proj([73.86, 18.52]), ny = proj([-74.0, 40.71]), farm = proj([-45.4, -21.6]);
  const arc = (a, b, lift) => `M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - lift} ${b[0]} ${b[1]}`;
  return <AbsoluteFill style={{background: P.paper}}>
    <Svg>
      <path d={path({type: 'Sphere'})} fill="#E3DCC9" />
      {countries110.map((f) => <path key={f.id} d={path(f)} fill={HI[f.id] || P.paper2} stroke="#D8CFBA" strokeWidth={1} />)}
      <path d={arc(pune, ny, 260)} fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="14 12" />
      <path d={arc(ny, farm, 120)} fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="14 12" />
      {[[pune, 'PUNE'], [ny, 'NEW YORK'], [farm, 'MARINA’S FARM']].map(([p, t], i) => <g key={t}><circle cx={p[0]} cy={p[1]} r={16} fill={P.cream} stroke={P.ink} strokeWidth={5} />
        <rect x={p[0] - (t.length * 11 + 20)} y={p[1] + (i === 1 ? -84 : 26)} width={t.length * 22 + 40} height={48} rx={6} fill={P.ink} />
        <Label x={p[0]} y={p[1] + (i === 1 ? -50 : 60)} c={P.cream} s={28}>{t}</Label></g>)}
      {/* the coin, at New York */}
      <circle cx={ny[0] + 40} cy={ny[1] - 10} r={26} fill={P.gold2} stroke="#9C7324" strokeWidth={4} /><Label x={ny[0] + 40} y={ny[1]} s={28} c="#7A5716" f={FR}>$</Label>
    </Svg>
    <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.mute}}>THE ROUTE OF SAM'S PAYMENT · ILLUSTRATIVE · MAPS: NATURAL EARTH</div>
  </AbsoluteFill>; };

// ---------- 4. The New York bank
export const Bank = () => <AbsoluteFill style={{background: '#E6E1D3'}}>
  <Svg>
    {[[80, 300, 260, 700], [360, 180, 220, 820], [1500, 220, 240, 780], [1760, 340, 200, 660]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill={i % 2 ? '#C9C1AE' : '#D6CFBE'} />
      {Array.from({length: Math.floor(h / 70)}, (_, r) => Array.from({length: Math.floor(w / 60)}, (_, c) => <rect key={`${r}${c}`} x={x + 20 + c * 60} y={y + 30 + r * 70} width={26} height={34} fill="#EFE9DA" />))}</g>)}
    {/* neoclassical bank */}
    <rect x={560} y={330} width={800} height={60} fill={P.paper2} />
    <path d={poly([[530, 330], [960, 180], [1390, 330]])} fill={P.paper2} /><path d={poly([[610, 312], [960, 210], [1310, 312]])} fill="#E2DAC6" />
    <circle cx={960} cy={268} r={30} fill={P.gold} /><Label x={960} y={280} s={34} c={P.cream} f={FR}>$</Label>
    {Array.from({length: 6}, (_, i) => <g key={i}><rect x={610 + i * 130} y={400} width={52} height={420} fill={P.paper2} /><rect x={600 + i * 130} y={390} width={72} height={20} fill="#E2DAC6" /><rect x={600 + i * 130} y={812} width={72} height={20} fill="#E2DAC6" /></g>)}
    <rect x={560} y={832} width={800} height={40} fill="#E2DAC6" /><rect x={520} y={872} width={880} height={40} fill="#D8CFBA" /><rect x={480} y={912} width={960} height={40} fill="#CFC5AE" />
    <rect x={900} y={640} width={120} height={180} fill={P.green} />
    <Label x={960} y={372} s={34} c={P.green} ls={10}>BANK · CLEARING</Label>
    {/* the coin waiting on the steps */}
    <circle cx={1200} cy={890} r={34} fill={P.gold2} stroke="#9C7324" strokeWidth={5} /><Label x={1200} y={903} s={36} c="#7A5716" f={FR}>₹</Label>
    <text x={1240} y={860} fontFamily="'Kalam', cursive" fontSize={34} fill={P.ink}>Sam's money, waiting</text>
  </Svg>
  <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.mute}}>NEW YORK · ILLUSTRATION (NOT A REAL BANK)</div>
</AbsoluteFill>;

// ---------- 5. Bretton Woods, 1944: a grand hotel in the mountains
export const Woods = () => <AbsoluteFill style={{background: '#E9E4D6'}}>
  <Svg>
    <path d={poly([[0, 620], [300, 300], [520, 520], [800, 220], [1100, 520], [1380, 260], [1700, 560], [1920, 400], [1920, 1080], [0, 1080]])} fill="#B9C2B0" />
    <path d={poly([[700, 300], [800, 220], [900, 300], [850, 290], [800, 320], [750, 290]])} fill={P.paper2} />
    <path d="M 0 760 C 500 690 1400 700 1920 740 L 1920 1080 L 0 1080 Z" fill={P.green2} />
    {/* the hotel: long white wings, red roofs, two towers */}
    <rect x={520} y={560} width={880} height={200} fill={P.paper2} />
    <path d={poly([[500, 570], [960, 520], [1420, 570]])} fill={P.ox} />
    {[640, 1280].map((x) => <g key={x}><rect x={x - 45} y={450} width={90} height={310} fill={P.paper2} /><path d={poly([[x - 60, 460], [x, 380], [x + 60, 460]])} fill={P.ox} /></g>)}
    {Array.from({length: 3}, (_, r) => Array.from({length: 18}, (_, c) => <rect key={`${r}${c}`} x={545 + c * 47} y={590 + r * 52} width={22} height={30} fill="#C9D2CB" />))}
    <rect x={500} y={760} width={920} height={24} fill="#D8CFBA" />
    {[0, 1, 2].map((i) => <rect key={i} x={760 + i * 140} y={810 + i * 10} width={70} height={30} rx={8} fill="#2E3A48" />)}
    <Tag x={60} y={120} t="1944" />
  </Svg>
  <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.mute}}>BRETTON WOODS, NEW HAMPSHIRE · ILLUSTRATION</div>
</AbsoluteFill>;

// ---------- 6. Mr Underwood's funeral (the dollar standing behind)
const NoteMan = ({x, y, s = 1}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path d="M -40 -150 L -50 0 M 40 -150 L 50 0" stroke={P.ink} strokeWidth="18" strokeLinecap="round" />
  <path d="M -165 -330 L -250 -230 M 165 -330 L 262 -290" stroke={P.ink} strokeWidth="18" strokeLinecap="round" />
  <rect x="-170" y="-470" width="340" height="330" rx="18" fill="#DDE5D0" stroke={P.green} strokeWidth="10" />
  <ellipse cx="0" cy="-310" rx="86" ry="100" fill={P.paper} stroke={P.gold} strokeWidth="8" />
  <circle cx="-30" cy="-326" r="9" fill={P.ink} /><circle cx="30" cy="-326" r="9" fill={P.ink} />
  <path d="M -30 -270 Q 6 -252 34 -282" stroke={P.ink} strokeWidth="7" fill="none" strokeLinecap="round" />
  <circle cx="30" cy="-326" r="24" fill="none" stroke={P.gold} strokeWidth="5" />
  <rect x="-60" y="-600" width="120" height="120" rx="6" fill="#1C1A18" /><rect x="-60" y="-510" width="120" height="16" fill={P.gold} /><ellipse cx="0" cy="-480" rx="100" ry="14" fill="#141210" />
</g>;
export const Funeral = () => <AbsoluteFill style={{background: '#DDD8CC'}}>
  <Svg>
    <path d="M 0 820 C 600 790 1300 800 1920 830 L 1920 1080 L 0 1080 Z" fill="#9DB894" />
    {[[240, 560], [1640, 600]].map(([x, y], i) => <g key={i}><path d={poly([[x - 60, y + 260], [x - 60, y + 40], [x, y - 20], [x + 60, y + 40], [x + 60, y + 260]])} fill="#B9B2A2" /><rect x={x - 6} y={y + 50} width={12} height={60} fill="#8A8070" /><rect x={x - 26} y={y + 66} width={52} height={12} fill="#8A8070" /></g>)}
    <NoteMan x={1500} y={900} s={0.95} />
    {/* coffin, side view on trestles; the lid propped open behind it */}
    {[740, 1140].map((x) => <path key={x} d={poly([[x - 40, 1000], [x - 10, 900], [x + 10, 900], [x + 40, 1000]])} fill="#5E5A52" />)}
    <path d={poly([[640, 760], [700, 700], [1200, 640], [1250, 690]])} fill={P.wood} />
    <path d={poly([[600, 820], [680, 770], [1220, 770], [1280, 820], [1220, 900], [680, 900]])} fill={P.wood2} />
    <rect x={600} y={812} width={680} height={12} fill={shade('#6B4430', 0.8)} />
    {[700, 940, 1180].map((x) => <rect key={x} x={x - 20} y={846} width={40} height={14} rx={4} fill={P.gold} />)}
    <rect x={880} y={782} width={120} height={50} rx={8} fill={P.gold} /><Label x={940} y={820} s={36} c={P.cream} f={FR}>$</Label>
    <g transform="translate(1250 760)"><line x1="0" y1="0" x2="0" y2="-110" stroke="#3E6B4A" strokeWidth="6" /><path d="M 0 -110 C -30 -140 -24 -170 0 -150 C 24 -170 30 -140 0 -110 Z" fill="#FFFFFF" /></g>
    <Rig x={480} y={1000} s={1.0} look={UNDER} face="sad" turn={1} pose={{fa: 70, fb: 40}} />
  </Svg>
  <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.mute}}>MR UNDERWOOD'S FUNERALS · RUNNING GAG</div>
</AbsoluteFill>;

// ---------- 7. Strait of Hormuz
const countries50 = feature(world50, world50.objects.countries).features;
const GULF = {'364': '#C9B79A', '512': P.paper2, '784': P.paper2, '682': P.paper2, '414': P.paper2, '634': P.paper2, '048': P.paper2, '368': P.paper2};
export const Hormuz = () => { const proj = geoMercator().center([55.5, 26.3]).scale(6200).translate([960, 560]); const path = geoPath(proj);
  const tankers = [[56.6, 26.4], [56.95, 26.2], [57.4, 25.9], [55.6, 26.2], [54.5, 26.0]];
  return <AbsoluteFill style={{background: '#BCD3D6'}}>
    <Svg>
      {countries50.filter((f) => GULF[f.id]).map((f) => <path key={f.id} d={path(f)} fill={GULF[f.id]} stroke="#B8AE98" strokeWidth={2} />)}
      {tankers.map(([lo, la], i) => { const [x, y] = proj([lo, la]); return <g key={i} transform={`translate(${x} ${y}) rotate(-18)`}><path d={poly([[-46, -10], [40, -10], [54, 0], [40, 10], [-46, 10]])} fill={P.ox} /><rect x={-40} y={-20} width={18} height={12} fill={P.cream} /></g>; })}
      {(() => { const [x, y] = proj([56.4, 26.55]); return <g><rect x={x - 230} y={y - 150} width={460} height={56} rx={6} fill={P.ink} /><Label x={x} y={y - 110} c={P.cream} s={30}>STRAIT OF HORMUZ</Label><path d={`M ${x} ${y - 94} L ${x} ${y - 20}`} stroke={P.ink} strokeWidth={4} /></g>; })()}
      {[[58.6, 28.9, 'IRAN'], [56.6, 22.6, 'OMAN'], [54.3, 23.6, 'UAE']].map(([lo, la, t]) => { const [x, y] = proj([lo, la]); return <Label key={t} x={x} y={y} s={34} c={P.mute} ls={8}>{t}</Label>; })}
      <Tag x={60} y={120} t="2026" />
    </Svg>
    <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.ink}}>ILLUSTRATIVE TANKERS · MAPS: NATURAL EARTH</div>
  </AbsoluteFill>; };

// ---------- 8. The detours: signposts, each with a barrier
export const Detours = () => <AbsoluteFill style={{background: '#E8E2D2'}}>
  <Svg>
    <path d="M 860 1080 L 940 520 L 980 520 L 1060 1080 Z" fill="#B9B2A2" />
    <path d="M 0 1080 L 0 780 C 400 720 700 700 940 690 L 980 690 C 1220 700 1520 720 1920 780 L 1920 1080 Z" fill="#9DB894" opacity="0.55" />
    <rect x={950} y={300} width={20} height={520} fill={P.wood2} />
    {[['RUPEE', -1, 340, P.gold2], ['YUAN', 1, 420, P.ox], ['GOLD', -1, 500, P.gold], ['BRICS', 1, 580, P.green2], ['CRYPTO', -1, 660, '#2E4A5E']].map(([t, d, y, c]) => { const x0 = d > 0 ? 970 : 950, len = 300;
      const pts = d > 0 ? [[x0, y], [x0 + len, y], [x0 + len + 40, y + 30], [x0 + len, y + 60], [x0, y + 60]] : [[x0, y], [x0 - len, y], [x0 - len - 40, y + 30], [x0 - len, y + 60], [x0, y + 60]];
      return <g key={t}><path d={poly(pts)} fill={c} /><Label x={x0 + d * len / 2} y={y + 44} s={34} c={P.cream}>{t}</Label></g>; })}
    {/* barrier */}
    <rect x={1240} y={860} width={440} height={40} fill={P.cream} /><rect x={1240} y={860} width={440} height={40} fill="url(#stripes)" />
    <defs><pattern id="stripes" width="80" height="40" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)"><rect width="40" height="40" fill={P.ox} /></pattern></defs>
    <rect x={1270} y={900} width={20} height={120} fill="#5E5A52" /><rect x={1630} y={900} width={20} height={120} fill="#5E5A52" />
    <Label x={1460} y={840} s={30} c={P.ox}>ROAD NARROWS</Label>
  </Svg>
  <div style={{position: 'absolute', left: 60, top: 44, fontFamily: OS, fontSize: 24, letterSpacing: 3, color: P.mute}}>THE DETOURS · ILLUSTRATION</div>
</AbsoluteFill>;
