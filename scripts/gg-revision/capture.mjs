// CODEX DRAFT — NOT CANON. Own headless Chrome, real React widgets, external PNGs.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { sha256, digest, solverHtmlErrors } from './core.mjs';
const [rawUrl, rawOut, viewsOut] = process.argv.slice(2);
if (!rawUrl || !rawOut || !viewsOut || !/^http:\/\/127\.0\.0\.1:\d+$/.test(rawUrl)) throw new Error('Local harness URL, external screenshot directory and external views directory required');
const out=path.resolve(rawOut), root=path.resolve(import.meta.dirname,'../..');
if(out.startsWith(root+path.sep))throw new Error('External output directory required');
if(path.resolve(viewsOut).startsWith(root+path.sep))throw new Error('External views directory required');
fs.mkdirSync(out,{recursive:true});
const profile=fs.mkdtempSync(path.join(out,'chrome-profile-'));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-sync','--disable-extensions','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let ws,send,page;
const records=[],checks=[];
async function evaluate(expression){const r=await page('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function navigate(entry,width){
 await page('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 await page('Page.navigate',{url:rawUrl+'/?case='+encodeURIComponent(entry.itemId)});
 for(let i=0;i<100;i++){if(await evaluate('document.querySelector("main") !== null && document.readyState === "complete"'))break;await sleep(100);}
 await evaluate('document.fonts.ready');await sleep(200);
 if(!await evaluate('document.querySelector("main") !== null'))throw new Error('Actual renderer missing');
}
async function shot(name,action){
 const info=await evaluate(`({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,text:document.querySelector('main').innerText,images:[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0})),html:document.querySelector('main').outerHTML,events:window.revisionEvents})`);
 const {data}=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
 const file=name+'.png',bytes=Buffer.from(data,'base64');fs.writeFileSync(path.join(out,file),bytes);
 records.push({file,action,width:info.width,height:info.height,sha256:sha256(bytes),htmlSha256:sha256(info.html),horizontalOverflow:info.scrollWidth>info.width,images:info.images,events:info.events});
 return info;
}
async function clickText(text){
 return evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!b)throw new Error('button missing: '+${JSON.stringify(text)});b.click();return true})()`);
}
async function input(index,value){
 await evaluate(`(()=>{const e=document.querySelectorAll('input')[${index}];if(!e)throw new Error('input missing');e.focus();e.select()})()`);
 await page('Input.insertText',{text:value});await sleep(30);
}
try{
 const portFile=path.join(profile,'DevToolsActivePort');
 for(let i=0;i<200&&!fs.existsSync(portFile);i++){if(chrome.exitCode!==null)throw new Error('Own Chrome exited');await sleep(100);}
 if(!fs.existsSync(portFile))throw new Error('Own Chrome did not start');
 const [port,socketPath]=fs.readFileSync(portFile,'utf8').trim().split('\n');
 ws=new WebSocket(`ws://127.0.0.1:${port}${socketPath}`);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
 let id=0;const pending=new Map();
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}});
 send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const n=++id,timer=setTimeout(()=>{pending.delete(n);reject(new Error('CDP timeout '+method));},20000);pending.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params,sessionId}));});
 const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
 page=(method,params={})=>send(method,params,sessionId);
 await page('Page.enable');await page('Runtime.enable');await page('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 const {entries}=await (await fetch(rawUrl+'/private-data.json')).json();
 for(const entry of entries)for(const width of [390,1440]){
  await navigate(entry,width);const info=await shot(`${entry.itemId}-${width}`,'initial actual renderer; no answer entered');
  const exported=await (await fetch(rawUrl+'/solver/'+entry.itemId+'.html')).text();
  const match=await evaluate(`(()=>{const doc=new DOMParser().parseFromString(${JSON.stringify(exported)},'text/html');const normalized=n=>n.textContent.replace(/\\s+/g,' ').trim();return {text:normalized(doc.querySelector('main'))===normalized(document.querySelector('main')),inputs:doc.querySelectorAll('input,select').length===document.querySelectorAll('input,select').length}})()`);
  if(!match.text||!match.inputs)throw new Error(`Frozen/current renderer mismatch ${entry.itemId}`);
  if(solverHtmlErrors(info.html).length)throw new Error('Unexpected key payload in rendered DOM');
  checks.push({itemId:entry.itemId,width,frozenMatchesActual:match,imagesLoaded:info.images.every(i=>i.ok)});
 }
 // Real input preservation -> failed attempt -> correction -> real component feedback.
 const vocab=entries.find(e=>e.itemId==='g1u01.w.rubber');await navigate(vocab,390);
 await input(0,'xyz');await clickText('Check');await sleep(100);
 checks.push({state:'wrong-retry',retryButton:await evaluate(`document.body.innerText.includes('Try again')`),value:await evaluate(`document.querySelector('input').value`)});
 await shot('vocab-wrong-390','typed xyz; pressed Check; first retry');
 await input(0,'rubber');await clickText('Try again');await sleep(100);
 checks.push({state:'correct-after-retry',events:await evaluate('window.revisionEvents')});
 await shot('vocab-correct-390','replaced answer by rubber; pressed Try again');
 // Both blanks retain distinct values and the true grader accepts their joined input.
 const gap=entries.find(e=>e.itemId==='g3u01.gi.present-simple.gf.002');await navigate(gap,1440);
 await input(0,'plays');await input(1,'sings');
 checks.push({state:'two-inputs-retained',values:await evaluate(`[...document.querySelectorAll('input')].map(i=>i.value)`)});
 await clickText('Check');await sleep(100);await shot('two-gap-correct-1440','typed plays and sings into separate fields; Check');
 // Restore really needs two phases. A name selection alone cannot resolve the card.
 const restore=entries.find(e=>e.kind==='paint'&&e.item.kind==='restore');await navigate(restore,390);
 await clickText('rubber');await sleep(100);
 const midway=await shot('restore-colour-390','selected rubber; colour phase now visible');
 assertSafeState(midway.html);
 const solver=path.join(path.resolve(viewsOut),'solver'),stateFile='states/'+restore.itemId+'-colour.html';
 const body=midway.html.replaceAll('src="/art/','src="../art/').replaceAll('href="/art/','href="../art/');
 const frozen=`<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CODEX DRAFT — NOT CANON</title><link rel="stylesheet" href="../style.css"><body>${body}</body></html>`;
 fs.mkdirSync(path.join(solver,'states'),{recursive:true});fs.writeFileSync(path.join(solver,stateFile),frozen);
 const manifestPath=path.join(solver,'manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 manifest.states=[{itemId:restore.itemId,state:'colour',file:stateFile,htmlSha256:sha256(frozen)}];
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 const indexPath=path.join(solver,'index.html');
 fs.writeFileSync(indexPath,fs.readFileSync(indexPath,'utf8').replace('</main>',`<p><a href="${stateFile}">Farbkarte: zweiter Schritt — nach dem Namen bearbeiten</a></p></main>`));
 checks.push({state:'restore-before-colour',events:midway.events,colourVisible:midway.text.includes('pink')});
 await clickText('pink');await sleep(100);await shot('restore-complete-390','selected pink after naming rubber');
 const resolution=await evaluate('window.revisionEvents');checks.push({state:'restore-completed',events:resolution});
 await navigate(restore,1440);await clickText('Später ↩');await sleep(50);checks.push({state:'dismiss',events:await evaluate('window.revisionEvents')});
 const assertions={
   allFrozenMatch:checks.filter(c=>c.itemId).every(c=>c.frozenMatchesActual.text&&c.frozenMatchesActual.inputs),
   allImagesLoaded:checks.filter(c=>c.itemId).every(c=>c.imagesLoaded),
   retry:checks.some(c=>c.state==='wrong-retry'&&c.retryButton&&c.value==='xyz'),
   corrected:checks.some(c=>c.state==='correct-after-retry'&&c.events.some(e=>e.tier==='correct')),
   bothInputs:checks.some(c=>c.state==='two-inputs-retained'&&JSON.stringify(c.values)==='["plays","sings"]'),
   noPrematureRestore:checks.some(c=>c.state==='restore-before-colour'&&c.colourVisible&&!c.events.includes('resolved')),
   restoreCompleted:resolution.includes('resolved'),
   dismiss:checks.some(c=>c.state==='dismiss'&&c.events.includes('dismissed')),
 };
 fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({browser:await send('Browser.getVersion'),records,checks,assertions},null,2)+'\n');
 console.log(JSON.stringify({screenshots:records.length,assertions,solverPacketSha256:digest(manifest),horizontalOverflow:records.filter(r=>r.horizontalOverflow).map(r=>r.file)}));
 if(Object.values(assertions).some(v=>!v))process.exitCode=1;
}finally{if(ws){try{await send('Browser.close');}catch{}ws.close();}chrome.kill();}
function assertSafeState(html){const errors=solverHtmlErrors(html);if(errors.length)throw new Error('Unsafe frozen state: '+errors.join(';'));}
