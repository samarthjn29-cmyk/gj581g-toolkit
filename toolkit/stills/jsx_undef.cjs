// Finds identifiers a kit file uses but never defines (12 Nov 2026: a "q is not defined" stopped every frame). Run from twice/remotion: node /home/claude/toolkit/toolkit/stills/jsx_undef.cjs src/stills/*.jsx
const parser=require('@babel/parser'), traverse=require('@babel/traverse').default, fs=require('fs');
for (const f of process.argv.slice(2)) { const ast=parser.parse(fs.readFileSync(f,'utf8'),{sourceType:'module',plugins:['jsx']});
 const G=new Set(['Math','window','document','console','String','Number','Array','Object','JSON','Promise','fetch','FontFace','Set','Map','undefined','Infinity','NaN','parseInt','parseFloat','isNaN','Date','Boolean','Error','setTimeout','encodeURIComponent']);
 traverse(ast,{ReferencedIdentifier(p){const n=p.node.name; if(p.parentPath.isJSXAttribute()||p.isJSXIdentifier()&&/^[a-z]/.test(n))return; if(!p.scope.hasBinding(n)&&!G.has(n)) console.log(f, p.node.loc.start.line, n);}}); }
