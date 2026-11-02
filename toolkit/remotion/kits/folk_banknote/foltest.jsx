import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Folk} from './folk';
const P = {bg: '#F2E8D5', ink: '#1F1B16', grey: '#8A8278', yellow: '#F2C230'};
export const FolkTest = () => <AbsoluteFill style={{background: P.bg}}>
  <svg width={1920} height={1080} viewBox="0 0 1920 1080">
    <rect x="0" y="0" width="1920" height="1080" fill={P.bg} />
    {/* Ann and Barbara */}
    <Folk x={480} y={760} h={560} hair="bob" hairColor="#3A2A22" skin="#F1C7A4" top="blazer" topColor="#2E3A59" face="smile" hold={{text: '+2%', color: P.yellow}} />
    <Folk x={1060} y={760} h={560} hair="curly" hairColor="#1E1A18" skin="#8D5B3E" top="sweater" topColor="#C4623F" face="happy" hold={{text: '+5%', color: P.yellow}} tilt={-3} />
    <text x="480" y="830" textAnchor="middle" fontFamily="Inter" fontWeight="700" fontSize="40" fill={P.ink}>Ann</text>
    <text x="1060" y="830" textAnchor="middle" fontFamily="Inter" fontWeight="700" fontSize="40" fill={P.ink}>Barbara</text>
    {/* expression row */}
    {['neutral', 'smile', 'happy', 'sad', 'thinking', 'surprised', 'smug'].map((e, i) => <g key={e}>
      <Folk x={1400 + (i % 2) * 260} y={240 + Math.floor(i / 2) * 250} h={220} hair={['short', 'bun', 'long', 'bob', 'curly', 'short', 'bun'][i]}
        hairColor={['#2B2420', '#7A4A2A', '#C99A5B', '#1E1A18', '#3A2A22', '#5A3B2A', '#2B2420'][i]} skin={['#F1C7A4', '#C68A62', '#F6D7BC', '#8D5B3E', '#E2A97E', '#5C3A28', '#F1C7A4'][i]}
        top={['shirt', 'hoodie', 'sweater', 'blazer', 'shirt', 'sweater', 'blazer'][i]} topColor={['#E9E2D3', '#4E6E58', '#C4623F', '#2E3A59', '#8A8278', '#2E3A59', '#B9863A'][i]} face={e} glasses={i === 4} />
      <text x={1400 + (i % 2) * 260} y={262 + Math.floor(i / 2) * 250} textAnchor="middle" fontFamily="Inter" fontSize="20" fill={P.grey}>{e}</text>
    </g>)}
  </svg>
</AbsoluteFill>;
