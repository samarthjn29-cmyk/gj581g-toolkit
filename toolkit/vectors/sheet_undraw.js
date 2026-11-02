const fs=require('fs');const {chromium}=require('playwright');
const dir='node_modules/undraw-svg/svgs';const files=fs.readdirSync(dir).filter(f=>f.endsWith('.svg')).sort();
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1960,height:800}});
for(let s=0;s*240<files.length;s++){const part=files.slice(s*240,(s+1)*240);
 const cells=part.map(f=>{let svg=fs.readFileSync(dir+'/'+f,'utf8').replace(/#6c63ff/gi,'#35609E').replace(/<svg /,'<svg width="150" height="110" ');return `<div class=c>${svg}<p>${f.replace('.svg','')}</p></div>`}).join('');
 fs.writeFileSync('u.html',`<html><body style="background:#FAF5EA;font-family:monospace;margin:10px"><style>.c{display:inline-block;width:158px;height:140px;text-align:center;vertical-align:top;overflow:hidden}p{margin:0;font-size:9px;white-space:nowrap;overflow:hidden}</style>${cells}</body></html>`);
 await p.goto('file://'+process.cwd()+'/u.html');await p.screenshot({path:`undraw_sheet_${s+1}.png`,fullPage:true});}
await b.close();console.log(files.length)})();
