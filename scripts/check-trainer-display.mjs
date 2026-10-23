#!/usr/bin/env node
/** W7: actual server-page output + actual React controls, synthetic data only.
 * External auth/content/data seams are blocked. Candidate baselines are external
 * artifacts: --baseline compares pixels with a 3/255 per-channel raster-noise budget; Koki blesses them later.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { measure, violations } from './lib/trainer-display-measure.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'), args=process.argv.slice(2);
const option=n=>args.includes(n)?args[args.indexOf(n)+1]:null;
const out=path.resolve(option('--out')??fs.mkdtempSync(path.join(os.tmpdir(),'trainer-display-'))), baseline=option('--baseline'), selftest=args.includes('--selftest'), smoke=args.includes('--smoke');
assert(!out.startsWith(root+path.sep));fs.mkdirSync(out,{recursive:true});
const req=createRequire(path.join(root,'apps/web/package.json')), postcss=createRequire(req.resolve('@tailwindcss/postcss'))('postcss');
const global=path.join(root,'apps/web/app/globals.css');
const css=(await postcss([req('@tailwindcss/postcss')({base:path.join(root,'apps/web')})]).process(fs.readFileSync(global,'utf8'),{from:global})).css+['home/home.css','bestenliste/leaderboard.css','modi/modes.css'].map(f=>fs.readFileSync(path.join(root,'apps/web/app',f),'utf8')).join('\n');
const fonts=['inter','fredoka','quicksand'].map(n=>`@font-face{font-family:${n};src:url(/font/${n});font-weight:300 900}:root{--font-${n}:${n}}`).join('');
const modules={
 'server-only':'export {};',
 'next/link':`import React from 'react';export default function Link({prefetch,...p}){return <a {...p}/>}`,
 'next/image':`import React from 'react';export default function Image({unoptimized,priority,...p}){return <img {...p}/>}`,
 'next/navigation':`export function redirect(to){throw Error('unexpected redirect:'+to)};export const useRouter=()=>({refresh(){}});`,
 '../le/konto-aktion':'export async function abmelden(){throw Error("logout fixture must not write")}',
 '@/lib/student-view':'export async function resolveStudentView(){return window.fixtureStudent?{kind:"student",grades:[window.fixtureGrade],player:{userId:"synthetic-owner",classId:"synthetic-room",classScope:["synthetic-room"]}}:{kind:"preview",grades:[window.fixtureGrade]}};export const trainerGrade=v=>v.grades[0];',
 '@/lib/story-world':'export const listOpenStories=async()=>[];',
 '@/lib/arena/server':'export const showArenaCard=async()=>true;',
 '@/lib/wort-des-tages':`export const viennaDateKey=()=>"2026-10-23";export const wortDesTages=async()=>({word:'window',german:'Fenster',example:'Open the window.',chapter:1});`,
 '../practice/load-practice':'export const loadDailyChallenge=async()=>({words:Array(10).fill({id:"fixture"}),availableWords:Array(10).fill({id:"fixture"}),blockedCount:0});',
 '@/lib/leaderboard':'export const readLeaderboard=async()=>({enabled:false});',
 '@domigo/db':'export function getDb(){if(!window.fixtureStudent)throw Error("preview fixture must not read database");return {}};export const getDailyChallengeCount=async()=>3,getDueCounts=async()=>({total:2}),getStudentChapterProgress=async()=>({chapters:[],days:[]});',
 '@domigo/content-loader':'export const listApprovedUnits=()=>[1,2,3,4].map(g=>`g${g}-u01`);export const loadUnit=()=>({vocab:Array(12).fill({}),grammar:Array(8).fill({})});',
};
const entry=`import React from 'react';import{createRoot}from'react-dom/client';import Home from './app/home/page';import Progress from './app/fortschritt/page';import Profile from './app/profil/page';import ModesPage from './app/modi/page';import Shell from './app/home/TrainerShell';
const q=new URLSearchParams(location.search);window.fixtureGrade=Number(q.get('grade'));window.fixtureStudent=q.has('student');const root=createRoot(document.getElementById('root'));
window.mountScreen=async(name)=>{const grade=window.fixtureGrade;const page={home:Home,modi:ModesPage,fortschritt:Progress,profil:Profile}[name];const tree=await page({searchParams:Promise.resolve({jahrgang:String(grade)})});root.render(tree);};window.mountScreen(q.get('screen')||'home');`;
const bundled=await build({stdin:{contents:entry,resolveDir:path.join(root,'apps/web'),loader:'tsx'},bundle:true,write:false,platform:'browser',format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'boundaries',setup(b){
 b.onResolve({filter:/.*/},a=>{
  if(a.path.endsWith('.css'))return {path:a.path,namespace:'empty'};
  if(a.path.endsWith('/trainer-data')||a.path==='./trainer-data')return {path:'profile',namespace:'fixture'};
  if(Object.hasOwn(modules,a.path))return {path:a.path,namespace:'fixture'};
  if(a.path.startsWith('@/')){const base=path.join(root,'apps/web',a.path.slice(2));return {path:['.ts','.tsx',''].map(ext=>base+ext).find(f=>fs.existsSync(f))};}
 });
 b.onLoad({filter:/.*/,namespace:'empty'},()=>({contents:'export {};'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:a.path==='profile'?'export const readTrainerProfile=async()=>({name:"Example",avatar:1,xp:window.fixtureStudent?120:0,grammarXp:window.fixtureStudent?80:0,streak:window.fixtureStudent?2:0});':modules[a.path],loader:'tsx',resolveDir:path.join(root,'apps/web')}));
}}]});
const bundle=bundled.outputFiles[0].text;
const trainerCss=fs.readFileSync(path.join(root,'apps/web/app/home/trainer.css'),'utf8');
async function tokenFailures(source,page){
 const problems=[],words=[];postcss.parse(source).walkDecls(d=>{
  if(d.prop==='--trainer-hairline'&&d.value==='1px'||d.prop==='--trainer-label'&&d.value==='1rem')return;
  if(/(?:\d|\.)(?:\d*\.)?\d*(?:px|rem)\b|#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i.test(d.value))problems.push(d.prop+': '+d.value);
  for(const word of d.value.replace(/var\([^)]*\)/g,'').match(/[a-z]+/gi)??[])words.push({prop:d.prop,word});
 });
 const colours=await page.evaluate(words=>words.filter(({word})=>!/^(transparent|currentcolor|inherit|initial|unset|revert|layer)$/i.test(word)&&CSS.supports('color',word)),words);
 return [...problems,...colours.map(({prop,word})=>prop+': '+word)];
}
const chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||(fs.existsSync(chrome)?chrome:undefined),args:['--disable-background-networking','--disable-gpu','--force-color-profile=srgb']});
const records=[], errors=[], network=[], mutants=[], rankProbes=[];
const rankZones=['bronze','silver','gold','diamond','prestige'];
async function featureFailures(page){
 const values=await page.evaluate(zones=>{
  const rank=document.querySelector('.og-rank'), old=rank.className;
  const ranks=zones.map(zone=>{rank.className='og-rank zone-'+zone;return getComputedStyle(rank).backgroundImage;});rank.className=old;
  return {primary:getComputedStyle(document.querySelector('.og-primary')).backgroundImage,ranks};
 },rankZones);
 return [...(!values.primary.includes('linear-gradient')?['primary gradient missing']:[]),...(!values.ranks.every(image=>image.includes('linear-gradient'))?['rank gradient missing']:[]),...(new Set(values.ranks).size!==5?['rank colours no longer distinct']:[])];
}
async function measureRankZones(page,meta){
 // Five existing badge styles, mounted together solely for a contrast probe.
 await page.evaluate(zones=>{const host=document.createElement('div');host.id='rank-probes';host.style.cssText='display:flex;flex-wrap:wrap;gap:16px;padding:16px';for(const zone of zones){const rank=document.createElement('span');rank.className='og-rank zone-'+zone;rank.textContent=zone;host.append(rank);}document.querySelector('.og-screen').prepend(host);},rankZones);
 const measured=await measure(page), contrast=measured.contrast.filter(c=>rankZones.includes(c.label));
 assert.equal(contrast.length,5);assert(contrast.every(c=>c.pass),'all five rank gradients must retain readable text');
 const file=`rank-zones-g${meta.grade}-${meta.theme}.png`;await page.locator('#rank-probes').screenshot({path:path.join(out,file)});
 await page.locator('#rank-probes').evaluate(e=>e.remove());rankProbes.push({...meta,file,contrast});
}
function pixelDifference(a,b){const x=PNG.sync.read(a),y=PNG.sync.read(b);if(x.width!==y.width||x.height!==y.height)return Infinity;let n=0;for(let i=0;i<x.data.length;i+=4)if(x.data.subarray(i,i+4).some((v,k)=>Math.abs(v-y.data[i+k])>3))n++;return n;}
try{
for(const persona of args.includes('--preview-only')?['preview']:args.includes('--student-only')?['student']:['preview','student'])for(const grade of smoke||selftest?[1]:[1,2,3,4])for(const width of smoke||selftest?[375]:[375,1400])for(const theme of selftest?['light']:['light','dark']){
 const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,colorScheme:grade<3?'dark':'light'});
 await context.addInitScript(()=>{window.fixtureIO=[];for(const method of ['getItem','setItem','removeItem','clear'])Storage.prototype[method]=function(){window.fixtureIO.push(method);throw Error('storage forbidden')};window.fetch=async()=>{window.fixtureIO.push('fetch');throw Error('network forbidden')};});
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='trainer-fixture.test'){network.push(u.href);return route.abort();}
 if(/^\/font\/(inter|fredoka|quicksand)$/.test(u.pathname))return route.fulfill({body:fs.readFileSync(path.join(root,'apps/web/app/fonts',u.pathname.split('/').pop()+'-var-latin.woff2')),contentType:'font/woff2'});
 if(u.pathname.startsWith('/avatars/')){const file=path.join(root,'apps/web/public',u.pathname);assert(file.startsWith(path.join(root,'apps/web/public/avatars/')));return route.fulfill({body:fs.readFileSync(file),contentType:'image/png'});}
 if(u.pathname==='/app.js')return route.fulfill({body:bundle,contentType:'application/javascript'});
 return route.fulfill({body:`<!doctype html><html><head><meta charset="utf-8"><style>${fonts}${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`,contentType:'text/html'});
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:new Date('2026-10-23T12:00:00Z')});
 await page.goto(`http://trainer-fixture.test/?grade=${grade}${persona==='student'?'&student':''}`);await page.locator('.og-root').waitFor();await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.og-root').getAttribute('data-theme'),grade<3?'light':'dark','year default ignores OS theme');
 if(await page.locator('.og-root').getAttribute('data-theme')!==theme)await page.locator('.og-footer button').click();
 for(const language of grade===1&&!selftest?['de','en']:['default']){
  if(language==='en')await page.getByRole('button',{name:'English',exact:true}).click();
  for(const screen of selftest?['home']:['home','modi','fortschritt','profil']){
   await page.evaluate(name=>window.mountScreen(name),screen);await page.locator(`.og-root[data-screen="${screen}"]`).waitFor();await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
   if(screen==='profil')await page.locator('dialog[open]').waitFor();
   await page.evaluate(()=>{window.scrollTo(0,0);return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
   const file=`${persona}-g${grade}-${screen}-${language}-${width}-${theme}.png`;
   const bytes=await page.screenshot({path:path.join(out,file),fullPage:true,animations:'disabled'});
   const record={persona,grade,screen,language,width,theme,file,...await measure(page)};record.violations=violations(record);
   if(baseline){const reference=path.join(baseline,file);assert(fs.existsSync(reference),'missing baseline: '+file);record.changedPixels=pixelDifference(bytes,fs.readFileSync(reference));if(record.changedPixels)record.violations.push(`baseline differs: ${record.changedPixels} pixels`);}
   records.push(record);assert.deepEqual((await page.evaluate(()=>window.fixtureIO)).filter(call=>!(persona==='student'&&call==='getItem')),[],'Only existing student mode-preference reads are allowed');assert.deepEqual(await tokenFailures(trainerCss,page),[]);
   if(screen==='profil')await page.locator('.og-avatar-close').click();
   if(screen==='home'){
    assert(await page.locator('.og-start').textContent().then(t=>t.includes(grade===1&&language!=='en'?'Übung starten':'Start Practice')));
    assert.deepEqual(await featureFailures(page),[],'original gradient identity must remain');
    if(persona==='student'&&width===375&&language!=='en')await measureRankZones(page,{grade,theme});
   }
   if(selftest){
    for(const value of ['padding:19px','color:#aaa','color:rebeccapurple','--trainer-secondary:#fff']){const failures=await tokenFailures(trainerCss+'\n.x{'+value+'}',page);assert(failures.length);mutants.push({name:'raw-design-value',failures});}
    for(const[name,css,kind]of[['small-target','.og-language button{min-height:0!important;height:20px!important;padding:0!important}','target'],['pale-label','.og-tagline{color:#aaa!important;background:#fff!important}','contrast']]){const tag=await page.addStyleTag({content:css});const found=violations(await measure(page));assert(found.some(s=>s.startsWith(kind)),name);mutants.push({name,found});await tag.evaluate(e=>e.remove());}
    if(persona==='student'){
     const tag=await page.addStyleTag({content:'.og-logout{min-height:0!important;height:20px!important;padding:0!important}'});const found=violations(await measure(page));assert(found.some(s=>s.startsWith('target Abmelden:')),'student logout mutation');mutants.push({name:'small-logout',found});await tag.evaluate(e=>e.remove());
    }
    for(const [name,css] of [['primary-gradient','.og-primary{background:var(--ink)!important}'],['rank-gradients','.og-rank{background:var(--accent-soft)!important}']]){const tag=await page.addStyleTag({content:css});const found=await featureFailures(page);assert(found.length,name);mutants.push({name,found});await tag.evaluate(e=>e.remove());}
    const tag=await page.addStyleTag({content:'.og-screen{transform:translateX(1px)}'});const changed=pixelDifference(bytes,await page.screenshot({fullPage:true,animations:'disabled'}));assert(changed>0,'one-pixel shift must fail baseline');mutants.push({name:'one-pixel-shift',changed});await tag.evaluate(e=>e.remove());
   }
  }
 }
 await context.close();
}
}finally{await browser.close();}
fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify({records,rankProbes,mutants,errors,network},null,2)+'\n');
const failures=records.filter(r=>r.violations.length);console.log(JSON.stringify({views:records.length,rankProbes:rankProbes.length,failedViews:failures.length,mutants:mutants.length,errors,network,out}));
if(errors.length||network.length||failures.length){console.error(JSON.stringify(failures.map(({file,violations})=>({file,violations})),null,2));process.exitCode=1;}
