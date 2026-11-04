// Dollar Yardstick No. 3 illustrations v3 (5 Nov 2026): free Adobe Stock vector sets, recoloured to Banknote pixel by
// pixel (toolkit/media/recolour_png.py), with the Folk II cast and our own devices (chapter tag, word card, badges, labels
// by kind, fine grain) on top. Sourcing order per LESSONS 58. Stock IDs are credited on screen and in licence_log.csv.
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Rig} from './rig4';
import {SAM} from './twice';
import {P, poly, Tx, Chalk, GrainFine, Chapter, Kind, Word, Badge, Coin, NoteMan, Hormuz as HormuzV2} from './illus3b';
import {OS, FR, IN} from './bank';
import {geoNaturalEarth1, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import world110 from 'world-atlas/countries-110m.json';
const W = 1920, H = 1080;
const IMG = (n) => staticFile(`v3stock/${n}`);
const SAMCAFE = {...SAM, apron: '#5A3A28'};
const MARINA = {skin: '#B9835E', hair: 'long', hairColor: '#2A1C14', top: '#C4623F', bottom: '#3E3A36', hat: 'sunhat', hatColor: '#D9B77A', build: 'f'};
const UNDER = {skin: '#E9D3BC', hair: 'short', hairColor: '#2A2522', top: '#1C1A18', bottom: '#1C1A18', tie: '#1C1A18', hat: 'top', hatColor: '#1C1A18'};
const Svg = ({children, defs}) => <svg width={W} height={H} style={{position: 'absolute'}}><defs>{defs}
  <linearGradient id="kNY" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C9D6D4" /><stop offset="1" stopColor="#ECE4D2" /></linearGradient></defs>{children}</svg>;
const cup = (hx, hy) => <g transform={`translate(${hx} ${hy - 12})`}><path d="M -13 -14 L 13 -14 L 10 10 L -10 10 Z" fill="#F7F3E8" /><path d="M 13 -8 C 22 -8 22 3 12 3" stroke="#F7F3E8" strokeWidth="4" fill="none" /></g>;
const STK = (ids) => `SET: ADOBE STOCK ${ids}, RECOLOURED`;

// ---------- the café (AdobeStock_223318393). cam: {x, y, z} zooms into the set (camera travel, T101)
const CafeSet = ({dawn = false, beans = false, children, cam = {x: 0, y: 0, z: 1}, boardText = false}) => <g transform={`scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
  <image href={IMG('r223318393_bank.png')} x="0" y="0" width={W} height={1098} />
  {/* window lettering replaced with ours, mirrored as seen from inside */}
  {/* the stock window lettering covered by our own hanging sign */}
  <rect x="352" y="378" width="196" height="220" fill="#E9EDDF" opacity="0.9" />
  <path d="M 380 300 L 390 392 M 520 300 L 510 392" stroke="#55361F" strokeWidth="3" />
  <rect x="360" y="390" width="180" height="150" rx="6" fill={P.paper2} /><rect x="368" y="398" width="164" height="134" rx="4" fill="none" stroke={P.gold} strokeWidth="3" />
  <Tx x={450} y={448} s={36} c={P.green} f={FR} ls={0}>SAM'S</Tx><Tx x={450} y={496} s={44} c={P.ox} f={FR} ls={0}>CAFÉ</Tx><Tx x={450} y={522} s={16} c={P.mute} ls={5}>PUNE</Tx>
  {/* the menu board becomes the route board (data on an in-world surface, T96) */}
  {boardText && <g><rect x="1532" y="128" width="256" height="226" fill="#20302A" />
    <Chalk x={1660} y={162} s={24}>Sam's money: the route</Chalk>
    {['Swap the money', 'New York', 'How NY got the job', 'The catch', 'The detours'].map((t, i) => <g key={t}><circle cx={1556} cy={192 + i * 34} r={11} fill={i < 2 ? P.gold2 : 'none'} stroke={P.chalk} strokeWidth={i < 2 ? 0 : 2} /><Tx x={1556} y={197 + i * 34} s={14} c={i < 2 ? '#20302A' : P.chalk} f={FR} ls={0}>{i + 1}</Tx><Chalk x={1576} y={200 + i * 34} a="start" s={20}>{t}</Chalk></g>)}</g>}
  {beans && <g><path d={poly([[1060, 668], [1090, 560], [1200, 560], [1230, 668]])} fill="#D9C3A0" /><path d={poly([[1150, 668], [1170, 560], [1200, 560], [1230, 668]])} fill="#C4AE88" /><rect x="1080" y="548" width="130" height="20" rx="5" fill="#B39C76" /><Tx x={1145} y={630} s={24} c={P.green}>BRASIL</Tx></g>}
  {children}
  <defs><clipPath id="cfront"><rect x="990" y="668" width="900" height="420" /></clipPath></defs>
  <image href={IMG('r223318393_bank.png')} x="0" y="0" width={W} height={1098} clipPath="url(#cfront)" />
  {dawn && <rect x="0" y="0" width={W} height={H} fill="#F0A860" opacity="0.14" />}
</g>;

export const Cafe = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg><CafeSet><Rig x={1235} y={1112} s={1.3} look={SAMCAFE} face="happy" pose={{fa: 32, fb: 70}} turn={-1} frontItem={cup} /></CafeSet></Svg>
  <GrainFine /><Chapter n="00" pre="The " em="order" /><Kind k="ILLUSTRATIVE" src={'PUNE · ' + STK('223318393')} />
</AbsoluteFill>;

// camera has pushed in to the board on the wall
export const CafeRoute = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg><CafeSet boardText cam={{x: 1000, y: 30, z: 2.1}} /></Svg>
  <GrainFine /><Chapter n="01" pre="The " em="swap" words={1} /><Kind k="ILLUSTRATIVE" src={STK('223318393')} />
  <Word n={1} term="Go-between currency" def="The money everyone swaps through, because everyone else swaps through it." x={56} y={700} w={620} />
  <div style={{position: 'absolute', right: 70, top: 770, width: 520, background: P.paper2, borderRadius: 8, padding: '18px 26px', boxShadow: '0 10px 0 rgba(28,36,34,0.1)'}}>
    <div style={{fontFamily: OS, fontSize: 18, letterSpacing: 4, color: P.mute}}>CURRENCY SWAPS WITH THE DOLLAR ON ONE SIDE</div>
    <div style={{fontFamily: FR, fontWeight: 700, fontSize: 92, color: P.green, lineHeight: 1.05}}>almost 9 in 10</div>
    <div style={{fontFamily: OS, fontSize: 16, letterSpacing: 3, color: P.mute}}>SOURCE: BIS TRIENNIAL SURVEY, 2025</div></div>
</AbsoluteFill>;

// ---------- Marina's farm (AdobeStock_378184656); our coffee rows in front hide the stock tractor
const Bush = ({x, y, s = 1}) => <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx="0" cy="0" rx="70" ry="44" fill="#2E5541" /><ellipse cx="-14" cy="-14" rx="46" ry="26" fill="#3E6B52" /><ellipse cx="20" cy="-6" rx="30" ry="18" fill="#4B7A5E" />
  {[[-30, 6], [8, 12], [34, -4], [-6, -20], [46, 14]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="6" fill={i % 2 ? '#9C2F3B' : '#B8414B'} />)}</g>;
export const Farm = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg>
    <image href={IMG('r378184656_bank.png')} x="0" y="0" width={W} height={H} />
    {/* farmhouse on the far hill */}
    <g transform="translate(1180 470) scale(0.55)"><rect x="0" y="0" width="230" height="150" fill="#F2EBDA" /><rect x="0" y="0" width="60" height="150" fill="#E2D8C3" /><path d={poly([[-20, 10], [115, -70], [250, 10]])} fill="#7A2333" /><path d={poly([[115, -70], [250, 10], [115, 10]])} fill="#5E1A27" /><rect x="90" y="70" width="50" height="80" fill="#6B4430" /><rect x="25" y="40" width="44" height="40" fill="#C9D6D4" /></g>
    {Array.from({length: 3}, (_, r) => Array.from({length: 11}, (_, i) => <Bush key={`${r}-${i}`} x={-40 + i * 190 + (r % 2) * 95} y={790 + r * 110} s={0.9 + r * 0.25} />))}
    {/* the order note pinned to a post */}
    <rect x="300" y="560" width="14" height="300" fill="#55361F" /><rect x="196" y="520" width="222" height="150" rx="4" fill={P.paper2} />
    <Tx x={307} y={558} s={20} c={P.mute} ls={3}>ORDER</Tx><Tx x={307} y={600} s={30} c={P.ink} f={FR} ls={0}>Café, Pune</Tx><Tx x={307} y={644} s={24} c={P.ox} f={IN} w={600} ls={0}>pays in rupees</Tx>
    <Rig x={800} y={1000} s={1.15} look={MARINA} face="smile" turn={1} pose={{fa: 40, fb: 30}} />
    <Bush x={700} y={1040} s={1.5} /><Bush x={980} y={1060} s={1.4} /><Bush x={1300} y={760} s={1.5} /><Bush x={1285} y={905} s={1.5} /><Bush x={1470} y={745} s={1.8} /><Bush x={1450} y={850} s={1.9} /><Bush x={1560} y={880} s={1.6} /><Bush x={1440} y={960} s={1.6} /><Bush x={1560} y={1000} s={1.5} /><Bush x={1330} y={1010} s={1.3} />
  </Svg>
  <GrainFine /><Chapter n="00" pre="The " em="order" /><Kind k="ILLUSTRATIVE" src={'MINAS GERAIS, BRAZIL · ' + STK('378184656')} />
</AbsoluteFill>;

// ---------- New York: the clearing bank (AdobeStock_502727287) on our street
export const Bank = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg>
    <rect width={W} height={H} fill="url(#kNY)" />
    {[[0, 260, 230], [200, 160, 200], [1500, 220, 210], [1690, 120, 230], [1300, 330, 160]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height={H - y} fill={['#AFBDBA', '#9CACA9', '#A7B5B2', '#94A4A1', '#B9C5C2'][i]} />
      {Array.from({length: 14}, (_, r) => Array.from({length: Math.floor(w / 50)}, (_, c) => <rect key={`${r}${c}`} x={x + 16 + c * 50} y={y + 26 + r * 62} width={22} height={30} fill={(r * 3 + c + i) % 7 ? '#C9D4D1' : '#E2B54A'} opacity="0.9" />))}</g>)}
    <rect x="0" y="930" width={W} height="150" fill="#B5AC9A" /><rect x="0" y="930" width={W} height="14" fill="#CFC6B4" />
    <image href={IMG('bank_building.png')} x="430" y="300" width="1060" height="686" />
    <rect x="860" y="190" width="200" height="56" rx="4" fill={P.paper2} /><Tx x={960} y={228} s={26} c={P.green} ls={6}>CLEARING BANK</Tx><rect x="957" y="246" width="6" height="60" fill="#55361F" />
    <rect x="1545" y="640" width="14" height="300" fill="#55361F" /><rect x="1729" y="640" width="14" height="300" fill="#55361F" />
    <rect x="1515" y="560" width="260" height="300" rx="6" fill={P.paper2} /><rect x="1515" y="560" width="260" height="44" rx="6" fill={P.ox} />
    <Tx x={1645} y={592} s={20} c={P.cream} ls={4}>TODAY'S CHAIN</Tx>
    {["Sam's bank", 'big US bank', "Marina's bank"].map((t, i) => <g key={t}><Tx x={1645} y={650 + i * 80} s={26} c={i === 1 ? P.ox : P.ink} f={FR} ls={0}>{t}</Tx>{i < 2 && <path d={`M 1645 ${662 + i * 80} L 1645 ${690 + i * 80} M 1635 ${680 + i * 80} L 1645 ${692 + i * 80} L 1655 ${680 + i * 80}`} stroke={P.mute} strokeWidth={3} fill="none" />}</g>)}
    <Coin x={330} y={960} r={30} sym="₹" />
    <text x={378} y={970} fontFamily="'Kalam', cursive" fontWeight={700} fontSize={32} fill={P.ink}>Sam's money, waiting</text>
  </Svg>
  <GrainFine /><Chapter n="02" em="New York" words={1} /><Kind k="ILLUSTRATIVE" src={'NOT A REAL BANK · ' + STK('502727287')} />
</AbsoluteFill>;

// ---------- Bretton Woods, July 1944 (valley AdobeStock_413814830 + our hotel), flashback sepia
const Hotel = ({x, y, s}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect x={-440} y={-200} width={880} height={200} fill={P.paper2} /><rect x={-440} y={-200} width={880} height={30} fill="#E7DFCB" />
  <path d={poly([[-460, -190], [0, -240], [460, -190]])} fill={P.ox} />
  {[-320, 320].map((tx) => <g key={tx}><rect x={tx - 45} y={-310} width={90} height={310} fill={P.paper2} /><rect x={tx + 15} y={-310} width={30} height={310} fill="#E7DFCB" /><path d={poly([[tx - 60, -300], [tx, -380], [tx + 60, -300]])} fill={P.ox} /><path d={poly([[tx, -380], [tx + 60, -300], [tx, -300]])} fill="#5E1A27" /></g>)}
  {Array.from({length: 3}, (_, r) => Array.from({length: 18}, (_, c) => <rect key={`${r}${c}`} x={-415 + c * 47} y={-160 + r * 50} width={22} height={30} fill="#CFCBB8" />))}
  <rect x={-460} y={0} width={920} height={24} fill="#D8CFBA" /></g>;
export const Woods = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg>
    <image href={IMG('r413814830_bank.png')} x="-390" y="0" width="2700" height={H} />
    <Hotel x={820} y={760} s={0.62} />
    {[[330, 'KEYNES', 'A new world money,', 'owned by no country'], [1590, 'WHITE', 'Dollars swap for a', 'fixed amount of gold']].map(([x, who, a, b], i) => <g key={who}>
      <path d={`M ${x - 90} 1000 L ${x - 40} 700 M ${x + 90} 1000 L ${x + 40} 700 M ${x} 1000 L ${x} 720`} stroke="#55361F" strokeWidth={12} strokeLinecap="round" />
      <rect x={x - 170} y={640} width={340} height={230} rx={6} fill={P.paper2} /><rect x={x - 170} y={640} width={340} height={46} rx={6} fill={i ? P.green : P.ox} />
      <Tx x={x} y={674} s={24} c={P.cream} ls={5}>{who}'S PLAN</Tx>
      <Tx x={x} y={752} s={28} c={P.ink} f={FR} ls={0}>{a}</Tx><Tx x={x} y={794} s={28} c={P.ink} f={FR} ls={0}>{b}</Tx>
      {i === 1 && <g><rect x={x - 90} y={814} width={180} height={40} rx={20} fill={P.gold2} /><Tx x={x} y={843} s={22} c="#1A3329" ls={4}>MOSTLY WON</Tx></g>}</g>)}
    <rect width={W} height={H} fill="#B98B2E" opacity="0.12" />
  </Svg>
  <GrainFine o={0.2} /><Chapter n="03" pre="The " em="flashback" words={1} />
  <Badge name="John Maynard Keynes" ini="JMK" role="UNITED KINGDOM" top={44} /><Badge name="Harry Dexter White" ini="HDW" role="UNITED STATES" top={160} />
  <Kind k="ILLUSTRATIVE" src={'BRETTON WOODS, JULY 1944 · SOURCE: FEDERAL RESERVE HISTORY · ' + STK('413814830')} />
</AbsoluteFill>;

// ---------- Mr Underwood's funeral (graveyard AdobeStock_682058735)
export const Funeral = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg>
    <image href={IMG('r682058735_bank.png')} x="0" y="0" width={W} height={1081} />
    <NoteMan x={1750} y={960} s={0.78} />
    {[1150, 1500].map((x) => <path key={x} d={poly([[x - 40, 1010], [x - 10, 910], [x + 10, 910], [x + 40, 1010]])} fill="#4A4A44" />)}
    <path d={poly([[1060, 770], [1110, 712], [1560, 650], [1600, 700]])} fill="#8A5A3B" />
    <path d={poly([[1020, 830], [1090, 780], [1580, 780], [1640, 830], [1580, 910], [1090, 910]])} fill="#6B4430" />
    <path d={poly([[1020, 830], [1640, 830], [1580, 910], [1090, 910]])} fill="#55361F" />
    {[1110, 1330, 1550].map((x) => <rect key={x} x={x - 20} y={856} width={40} height={14} rx={4} fill={P.gold} />)}
    <rect x={1270} y={792} width={120} height={34} rx={6} fill={P.gold} /><Tx x={1330} y={818} s={24} c={P.cream} f={FR} ls={0}>R.I.P. $</Tx>
    <Rig x={900} y={1015} s={1.2} look={UNDER} face="sad" turn={1} pose={{fa: 70, fb: 40}} />
    <rect width={W} height={H} fill="#B98B2E" opacity="0.10" />
  </Svg>
  <GrainFine o={0.2} /><Chapter n="03" pre="The " em="flashback" words={3} /><Kind k="ILLUSTRATIVE" src={'RUNNING GAG · ' + STK('682058735')} />
</AbsoluteFill>;

// ---------- the detours (road AdobeStock_406824036)
export const Detours = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg>
    <defs><pattern id="kstripes" width="80" height="40" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)"><rect width="40" height="40" fill={P.ox} /></pattern></defs>
    <image href={IMG('r406824036_bank.png')} x="0" y="-330" width={W} height={1464} />
    <rect x={560} y={330} width={20} height={620} fill="#6B4430" /><rect x={570} y={330} width={10} height={620} fill="#55361F" />
    {[['RUPEE', -1, 360, '#C99A2E'], ['YUAN', 1, 440, P.ox], ['GOLD', -1, 520, P.gold], ['BRICS', 1, 600, P.green2], ['CRYPTO', -1, 680, '#2E4A5E']].map(([t, d, y, c]) => { const x0 = d > 0 ? 580 : 560, len = 280;
      const pts = d > 0 ? [[x0, y], [x0 + len, y], [x0 + len + 40, y + 30], [x0 + len, y + 60], [x0, y + 60]] : [[x0, y], [x0 - len, y], [x0 - len - 40, y + 30], [x0 - len, y + 60], [x0, y + 60]];
      return <g key={t}><path d={poly(pts)} fill={c} /><path d={poly(pts.map(([px, py]) => [px, Math.max(py, y + 46)]))} fill="#000" opacity="0.14" /><Tx x={x0 + d * len / 2} y={y + 42} s={32} c={P.cream}>{t}</Tx></g>; })}
    <rect x={780} y={930} width={460} height={40} fill={P.cream} /><rect x={780} y={930} width={460} height={40} fill="url(#kstripes)" />
    <rect x={810} y={970} width={20} height={90} fill="#4A4A44" /><rect x={1190} y={970} width={20} height={90} fill="#4A4A44" />
    <rect x={850} y={872} width={320} height={44} rx={4} fill={P.paper2} /><Tx x={1010} y={904} s={26} c={P.ox}>ROAD NARROWS</Tx>
  </Svg>
  <GrainFine /><Chapter n="05" pre="The " em="detours" words={7} /><Kind k="ILLUSTRATIVE" src={STK('406824036')} />
  <Word n={7} term="Stablecoin" def="A digital token that's usually meant to be worth exactly one dollar." x={1300} y={120} w={560} />
</AbsoluteFill>;

// ---------- the end: same café at dawn, beans arrived (lighting arc closes)
export const CafeDawn = () => <AbsoluteFill style={{background: P.paper}}>
  <Svg><CafeSet dawn beans><Rig x={1400} y={1112} s={1.3} look={SAMCAFE} face="happy" pose={{fa: 32, fb: 70}} turn={-1} frontItem={cup} /></CafeSet></Svg>
  <GrainFine /><Chapter n="08" pre="The " em="beans arrive" words={7} /><Kind k="ILLUSTRATIVE" src={'PUNE · ' + STK('223318393')} />
</AbsoluteFill>;
export const Hormuz = HormuzV2;
const countries110 = feature(world110, world110.objects.countries).features;
const HI = {'356': P.gold2, '840': '#C0566A', '076': '#6E9C7E'};
export const RouteMap = () => { const proj = geoNaturalEarth1().fitExtent([[70, 210], [1110, 900]], {type: 'Sphere'}); const path = geoPath(proj);
  const pune = proj([73.86, 18.52]), ny = proj([-74.0, 40.71]), farm = proj([-45.4, -21.6]);
  const arc = (a, b, lift) => `M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - lift} ${b[0]} ${b[1]}`;
  return <AbsoluteFill style={{background: P.paper}}>
    <Svg><CafeSet><Rig x={1235} y={1112} s={1.3} look={SAMCAFE} face="neutral" pose={{fa: 20, fb: 30}} turn={-1} /></CafeSet>
      <rect x={0} y={0} width={1180} height={H} fill="#1A3329" /><rect x={1180} y={0} width={10} height={H} fill={P.gold} />
      <Tx x={70} y={170} a="start" s={22} c={P.gold2} ls={5}>THE ROUTE OF SAM'S PAYMENT</Tx>
      <path d={path({type: 'Sphere'})} fill="#22413A" />
      {countries110.map((f) => <path key={f.id} d={path(f)} fill={HI[f.id] || '#3B5B50'} />)}
      <path d={arc(pune, ny, 170)} fill="none" stroke={P.cream} strokeWidth={4} strokeDasharray="12 10" />
      <path d={arc(ny, farm, 80)} fill="none" stroke={P.cream} strokeWidth={4} strokeDasharray="12 10" />
      {[[pune, 'PUNE', 1], [ny, 'NEW YORK', -1], [farm, 'MARINA', 1]].map(([pt, t, d]) => <g key={t}><circle cx={pt[0]} cy={pt[1]} r={13} fill={P.cream} /><circle cx={pt[0]} cy={pt[1]} r={6} fill="#1A3329" />
        <rect x={pt[0] - (t.length * 10 + 18)} y={pt[1] + (d < 0 ? -72 : 22)} width={t.length * 20 + 36} height={42} rx={4} fill={P.cream} />
        <Tx x={pt[0]} y={pt[1] + (d < 0 ? -42 : 52)} c="#1A3329" s={24}>{t}</Tx></g>)}
      <Coin x={ny[0] + 42} y={ny[1] - 8} r={22} />
    </Svg>
    <GrainFine /><Chapter n="01" pre="The " em="swap" words={1} dark /><Kind k="SCHEMATIC" src="MAPS: NATURAL EARTH" dark />
  </AbsoluteFill>; };
