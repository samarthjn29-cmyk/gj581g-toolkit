const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']}); const p=await b.newPage({viewport:{width:1280,height:720}});
for(const f of process.argv.slice(2)){await p.goto('file://'+f); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
 await p.screenshot({path:f.replace('/pages/','/out/').replace('.html','.png')});} await b.close();})();
