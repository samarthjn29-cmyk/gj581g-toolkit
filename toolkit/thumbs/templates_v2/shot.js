const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const p=await b.newPage(); p.on('console',m=>console.log('C:',m.text())); p.on('pageerror',e=>console.log('E:',e.message));
await p.goto('file://'+process.argv[2]); await p.waitForFunction('window.DONE',{timeout:60000});
const d=await p.evaluate('window.DONE'); fs.writeFileSync(process.argv[3],Buffer.from(d.split(',')[1],'base64')); await b.close();})();
