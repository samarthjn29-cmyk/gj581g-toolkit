import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import * as D from 'react-open-doodles'; import fs from 'fs';
const names = Object.keys(D).filter(k => k.endsWith('Doodle'));
const cells = names.map(n => `<div class=c>${renderToStaticMarkup(React.createElement(D[n], {ink: '#3B2F2A', accent: '#E0892E', width: 220, height: 160}))}<p>${n}</p></div>`).join('');
fs.writeFileSync('doodles.html', `<html><body style="background:#F3E6CC;font-family:monospace;margin:20px"><style>.c{display:inline-block;width:230px;text-align:center;vertical-align:top;margin:4px}p{margin:2px;font-size:12px}</style>${cells}</body></html>`);
console.log(names.length);
