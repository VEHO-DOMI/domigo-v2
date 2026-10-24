#!/usr/bin/env node
/** Actual React clients + synthetic server replies. Covers rendered states and
 * real language/answer controls; API/DB correctness has separate real-SQL tests. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { measure, violations } from './lib/trainer-display-measure.mjs';
import { liveFixture } from './lib/live-browser-fixture.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),args=process.argv.slice(2),selftest=args.includes('--selftest'),smoke=args.includes('--smoke');
const index=args.indexOf('--out');assert(index<0||args[index+1]);
const out=index<0?fs.mkdtempSync(path.join(os.tmpdir(),'live-display-')):path.resolve(args[index+1]);assert(out!==root&&!out.startsWith(root+path.sep));fs.mkdirSync(out,{recursive:true});
const req=createRequire(path.join(root,'apps/web/package.json')),postcss=createRequire(req.resolve('@tailwindcss/postcss'))('postcss');
const sourceCss=fs.readFileSync(path.join(root,'apps/web/app/arena/live.css'),'utf8');
function tokenViolations(css){const bad=[];postcss.parse(css).walkDecls(d=>{if(d.prop.startsWith('--')||/(?:\d|\.)(?:\d*\.)?\d*(?:px|rem)\b|#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i.test(d.value))bad.push(d.toString());});return bad;}
assert.deepEqual(tokenViolations(sourceCss),[]);
const fixture=await liveFixture(root),ID='00000000-0000-4000-8000-000000000123',CLASS='00000000-0000-4000-8000-000000000101';
const states=['hub','teacher-hub','limited-hub','pending','invite','lobby','countdown','battle','quiz','teacher-question','settling','answered','result','complete','cancelled','unavailable'];
function data(grade,state){
 const now=Date.now(),teacher=['teacher-hub','lobby','teacher-question'].includes(state);
 const kind=['lobby','teacher-question','quiz'].includes(state)?'quiz':'battle';
 const phase=state==='invite'?'pending':state==='battle'||state==='quiz'||state==='teacher-question'||state==='settling'||state==='answered'?'active':['pending','lobby','countdown','result','complete','cancelled'].includes(state)?state:'active';
 const label=grade===1?'Beispiel':'Example';
 const room={id:ID,kind,mode:'translation',phase,grade,round:phase==='complete'?4:0,total:5,serverNow:now,phaseAt:state==='settling'?now-16000:phase==='countdown'?now+4000:now,expiresAt:now+3600000,code:state==='lobby'?'ABC234':null,teacher,invited:state==='invite',canStart:state==='lobby',canNext:false,canClose:teacher,answered:state==='answered',answerCount:state==='answered'?1:0,xp:phase==='complete'?50:0,
 question:['countdown','active'].includes(phase)&&state!=='answered'?{prompt:'der Stuhl',options:kind==='quiz'?['chair','table','book','bag']:[],chapter:1}:null,
 players:phase==='cancelled'?[]:[{seat:0,name:`${label} 1`,avatar:1,me:!teacher,score:phase==='complete'?3:0,correct:null},{seat:1,name:`${label} 2`,avatar:2,me:false,score:phase==='complete'?2:0,correct:null}]};
 return {teacher,room,lobby:{grade,peers:[{number:1,name:`${label} 2`,avatar:2}],rosterVersion:'a'.repeat(64),rooms:[]},chapters:[{key:`g${grade}-u01`,chapter:1,available:state==='limited-hub'?{translation:3,definition:0,context:0}:{translation:15,definition:15,context:15}},{key:`g${grade}-u02`,chapter:2,available:state==='limited-hub'?{translation:3,definition:6,context:0}:{translation:15,definition:15,context:15}}]};
}
const localChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||(fs.existsSync(localChrome)?localChrome:undefined),args:['--disable-background-networking']});
const records=[],mutants=[],interactions=[],browserErrors=[];
try{
 for(const width of selftest||smoke?[375]:[375,1400])for(const theme of selftest||smoke?['light']:['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,colorScheme:theme});let selected={grade:1,state:'battle'},lastBody=null;
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());if(url.hostname!=='live-fixture.test')return route.abort();
   if(url.pathname==='/fixture.js')return route.fulfill({body:fixture.script,contentType:'text/javascript'});
   if(/^\/font\/(inter|fredoka|quicksand)$/.test(url.pathname))return route.fulfill({body:fs.readFileSync(path.join(root,'apps/web/app/fonts',url.pathname.split('/').pop()+'-var-latin.woff2')),contentType:'font/woff2'});
   if(url.pathname==='/api/arena/live'){
    if(selected.state==='unavailable')return route.fulfill({status:503,json:{ok:false,error:'live_unavailable'}});
    const d=data(selected.grade,selected.state);return route.fulfill({json:{ok:true,...(['hub','teacher-hub','limited-hub'].includes(selected.state)?{lobby:d.lobby,chapters:d.chapters}:{room:d.room})}});
   }
   if(url.pathname==='/api/attempts'){lastBody=route.request().postDataJSON();return route.fulfill({json:{ok:true,tier:'correct',xpAwarded:10}});}
   selected={grade:Number(url.searchParams.get('grade')||1),state:url.searchParams.get('state')||'battle'};const d=data(selected.grade,selected.state);
   return route.fulfill({body:fixture.html({grade:selected.grade,preview:false,ownerId:'synthetic-own',enabled:true,...(d.teacher?{classId:CLASS}:{}),...(['hub','teacher-hub','limited-hub'].includes(selected.state)?{}:{id:ID})},theme),contentType:'text/html'});
  });
  const page=await context.newPage();page.on("pageerror",error=>browserErrors.push(String(error)));
  const ready=async(grade,state)=>{await page.goto(`https://live-fixture.test/?grade=${grade}&state=${state}`);await page.locator(state==='unavailable'?'[role=alert]':state==='hub'||state==='teacher-hub'||state==='limited-hub'?'.live-chapters':'.arena-scoreboard,.arena-notice').first().waitFor();await page.evaluate(()=>document.fonts.ready);};
  for(const grade of selftest||smoke?[1]:[1,2,3,4])for(const state of selftest?['battle','quiz','hub']:states){
   await ready(grade,state);
   if(state==='limited-hub')await page.getByRole('button',{name:'Chapter 1',exact:true}).click();
   const file=`g${grade}-${state}-${width}-${theme}.png`;
   if(['hub','limited-hub','battle','quiz','lobby','complete','unavailable','settling'].includes(state))await page.screenshot({path:path.join(out,file),fullPage:true,animations:'disabled'});
   const record={grade,state,width,theme,file,...await measure(page,'.arena-option:not(:disabled),.arena-chapter:not(:disabled),.live-field input:not(:disabled),.live-field select,.og-back')};record.violations=violations(record);records.push(record);
  }
  if(selftest){
   await ready(1,'battle');
   for(const [name,rule,kind]of[['small-input','.live-field input { min-height:0!important;height:20px!important;padding:0!important; }','target '],['pale-prompt','.arena-prompt { color:#aaa!important;background:#fff!important; }','contrast der Stuhl'],['pale-border','.live-field input { border-color:transparent!important; }','control '],['overflow','.og-root { overflow:visible!important; } .live-screen { min-width:900px!important; }','horizontal overflow']]){
    const style=await page.addStyleTag({content:rule}),found=violations(await measure(page,'.live-field input'));assert(found.some(v=>v.startsWith(kind)),`missed ${name}`);mutants.push({name,found});await style.evaluate(e=>e.remove());
   }
   for(const value of ['padding:19px','color:#aaa','color:rgb(1,2,3)','--local-size:19px']){assert(tokenViolations(sourceCss+` .live-field {${value}}`).length);mutants.push({name:'raw-value',value});}
   await page.getByRole('textbox').fill('chair');await page.getByRole('button',{name:'Antwort abgeben',exact:true}).click();await page.getByText('Antwort gespeichert.',{exact:false}).waitFor();assert.equal(lastBody.input.value,'chair');assert.equal(lastBody.input.kind,'vocab');assert(!('itemId'in lastBody)&&!('latencyMs'in lastBody)&&!('xpAwarded'in lastBody));interactions.push('typed answer uses sole attempt route without client task/time/XP');
   await ready(1,'quiz');await page.getByRole('button',{name:'chair',exact:true}).click();await page.getByText('Antwort gespeichert.',{exact:false}).waitFor();assert.equal(lastBody.input.kind,'choice');assert.equal(lastBody.mode,`quiz:${ID}`);interactions.push('quiz option submits once');
   selected.state='unavailable';await page.getByRole('alert').waitFor();assert.equal(await page.locator('.arena-scoreboard').count(),0);interactions.push('terminal failure clears previous player data');
   await page.clock.install();await ready(1,'invite');assert(!await page.getByRole('button',{name:'Annehmen',exact:true}).isDisabled());await page.clock.fastForward(25100);await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Annehmen'&&b.disabled));interactions.push('invitee popup closes after 25 seconds');
   await ready(1,'settling');assert(await page.getByRole('textbox').isDisabled());await page.getByText('Die Antwortzeit ist vorbei. Das Ergebnis kommt gleich.',{exact:true}).waitFor();interactions.push('deadline stops answers while server settles earlier ingress');
   await ready(1,'limited-hub');await page.getByRole('button',{name:'Chapter 1',exact:true}).click();assert(await page.locator('.arena-peer').isDisabled());await page.getByText('Wähle weitere oder andere Chapters.',{exact:false}).waitFor();await page.getByRole('button',{name:'Chapter 2',exact:true}).click();assert(!await page.locator('.arena-peer').isDisabled());
   await page.locator('.live-field select').selectOption('definition');assert(await page.getByRole('button',{name:'Chapter 1',exact:true}).isDisabled());assert.equal(await page.getByRole('button',{name:'Chapter 1',exact:true}).getAttribute('aria-pressed'),'false');assert(!await page.locator('.arena-peer').isDisabled());await page.locator('.live-field select').selectOption('context');assert(await page.locator('.arena-peer').isDisabled());assert.equal(await page.locator('.arena-chapter[aria-pressed=true]').count(),0);interactions.push('insufficient bank blocks start; combining Chapters enables it; mode changes discard unavailable Chapters');
   await ready(1,'hub');await page.getByRole('button',{name:'English',exact:true}).click();await page.getByRole('heading',{name:'Live Battle',exact:true}).first().waitFor();interactions.push('year-one language switch');
  }
  await context.close();
 }
}finally{await browser.close();}
assert.deepEqual(browserErrors,[]);
fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify({records,mutants,interactions},null,2)+'\n');
const failures=records.filter(r=>r.violations.length);console.log(JSON.stringify({views:records.length,failedViews:failures.length,mutants:mutants.length,interactions,out}));
if(failures.length){console.error(JSON.stringify(failures.map(({file,violations})=>({file,violations})),null,2));process.exitCode=1;}
