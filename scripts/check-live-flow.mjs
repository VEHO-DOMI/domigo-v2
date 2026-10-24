#!/usr/bin/env node
/** Three actual React browser clients -> actual route and grading code -> local
 * PGlite/Postgres only. All accounts and request sessions are synthetic. */
import fs,{readFileSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {AsyncLocalStorage} from 'node:async_hooks';
import {chromium} from 'playwright';
import {liveFixture} from './lib/live-browser-fixture.mjs';
import * as schema from '../packages/db/src/schema.ts';
import * as service from '../packages/db/src/live-service.ts';
import * as rules from '../packages/db/src/live-rules.ts';
import {classScope} from '../packages/db/src/scope.ts';
import * as loader from '../packages/content-loader/src/index.ts';
import * as engine from '../packages/engine/src/index.ts';
import * as policy from '../apps/web/lib/modi/attempt-policy.ts';
import * as itemRef from '../apps/web/lib/itemRef.ts';
import * as listeningRef from '../apps/web/lib/listeningRef.ts';
import * as testRef from '../apps/web/lib/testRef.ts';
import * as comprehensionRef from '../apps/web/lib/comprehensionRef.ts';
import {loadTestModule} from '../apps/web/lib/arena/test-loader.ts';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),req=createRequire(path.join(root,'apps/web/package.json')),dbReq=createRequire(path.join(root,'packages/db/package.json'));
const {PGlite}=dbReq('@electric-sql/pglite'),{drizzle}=dbReq('drizzle-orm/pglite'),{eq}=dbReq('drizzle-orm'),{z}=req('zod'),refs=req('@domigo/content-schema');
const uuid=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`,A=uuid(101),B=uuid(102),ME=uuid(1),PEER=uuid(2),OTHER=uuid(3),OUTSIDE=uuid(4),TEACHER=uuid(99);
const base=Date.parse('2026-10-24T08:00:00Z'),date=(offset=0)=>new Date(base+offset);let offset=0;
const pg=new PGlite(),db=drizzle(pg,{schema}),sessions=new AsyncLocalStorage();
const scope=classScope([A]);
 await pg.exec('CREATE SCHEMA domigo_v2');
 const snapshot=JSON.parse(readFileSync(new URL('../packages/db/drizzle/meta/0023_snapshot.json',import.meta.url),'utf8'));
 for(const table of Object.values(snapshot.tables)){
  const columns=Object.values(table.columns).map(c=>`"${c.name}" ${c.type}${c.primaryKey?' PRIMARY KEY':''}${c.notNull?' NOT NULL':''}${'default'in c?` DEFAULT ${c.default}`:''}`);
  const checks=Object.values(table.checkConstraints).map(c=>`CONSTRAINT "${c.name}" CHECK (${c.value})`);
  await pg.exec(`CREATE TABLE domigo_v2."${table.name}" (${[...columns,...checks].join(',')})`);
  for(const i of Object.values(table.indexes))await pg.exec(`CREATE ${i.isUnique?'UNIQUE ':''}INDEX "${i.name}" ON domigo_v2."${table.name}" (${i.columns.map(c=>`${c.isExpression?c.expression:`"${c.expression}"`}${c.asc?'':' DESC'}`).join(',')})${i.where?` WHERE ${i.where}`:''}`);
 }
 for(const migration of ['0024_word_duels.sql','0025_live_arena.sql','0025_live_arena.sql'])await pg.exec(readFileSync(new URL('../packages/db/drizzle/'+migration,import.meta.url),'utf8'));
 for(const id of [A,B]){await db.insert(schema.v2Classes).values({id,name:'Synthetic class',grade:1,teacherId:TEACHER,inviteCode:id});await db.insert(schema.classSettings).values({classId:id,purpose:'regular',leaderboard:true});}
 for(const id of [ME,PEER,OTHER,OUTSIDE,TEACHER])await db.insert(schema.v2IdentityUsers).values({id,role:id===TEACHER?'teacher':'student',classId:id===TEACHER?null:id===OUTSIDE?B:A,displayName:`Synthetic ${id.slice(-2)}`,givenName:'Invented Example',pinHash:'synthetic-unused',claimedAt:date(),createdAt:date()});

const context=()=>sessions.getStore();
const identity={getActingUser:async()=>({userId:context(),classId:A,classScope:scope}),getTeacherForPage:async()=>({userId:context(),classScope:scope})};
const timed={...service};for(const key of ['actOnLiveRoom','checkLiveAnswer','createLiveRoom','getLiveRoom','joinLiveQuiz','liveLobby','recordLiveAnswer'])timed[key]=(...args)=>service[key](...args.slice(0,service[key].length),date(offset));
const content={loadUnitWithOverrides:async slug=>loader.loadUnit(slug)};
const server=loadTestModule('apps/web/lib/arena/live-server.ts',{'server-only':{},'@domigo/content-loader':loader,'@/auth':{auth:async()=>({user:{id:context(),role:context()===TEACHER?'teacher':'student'}})},'@/lib/identity':identity,'@/lib/content-service':content,'../../../../packages/db/src/duel-service.ts':{runDuelTransaction:work=>db.transaction(work)},'../../../../packages/db/src/live-service.ts':timed,'../../../../packages/db/src/live-rules.ts':rules});
const api=loadTestModule('apps/web/lib/arena/live-api.ts',{'server-only':{},zod:{z},'./live-server':server});
const attempts=loadTestModule('apps/web/app/api/attempts/route.ts',{'next/server':{NextResponse:Response},zod:{z},'@domigo/content-schema':refs,'@domigo/content-loader':loader,'@domigo/engine':engine,'@/lib/content-service':content,'@domigo/db':{getDb:()=>{throw Error('bypass');},recordAttempt:()=>{throw Error('bypass');}},'@/lib/identity':identity,'@/lib/itemRef':itemRef,'@/lib/listeningRef':listeningRef,'@/lib/testRef':testRef,'@/lib/comprehensionRef':comprehensionRef,'@/lib/modi/speed-session':{},'@/lib/modi/attempt-policy':policy,'@/lib/arena/server':{},'@/lib/arena/live-server':server});
const fixture=await liveFixture(root),oldFlag=process.env.DOMIGO_LIVE_ARENA;process.env.DOMIGO_LIVE_ARENA='approved-under-20-usd';
const args=process.argv.slice(2),i=args.indexOf('--out'),out=i>=0?path.resolve(args[i+1]):'/private/tmp/live-flow';assert(!out.startsWith(root+path.sep));fs.mkdirSync(out,{recursive:true});
const localChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||(fs.existsSync(localChrome)?localChrome:undefined),args:['--disable-background-networking']});
const counts={poll:0,action:0,answer:0},errors=[],steps=[];
async function client(user){
 const c=await browser.newContext({viewport:{width:375,height:1000}});
 await c.route('**/*',async route=>{
  const original=route.request(),url=new URL(original.url());if(url.hostname!=='live-flow.test')return route.abort();
  if(url.pathname==='/fixture.js')return route.fulfill({body:fixture.script,contentType:'text/javascript'});
  if(/^\/font\/(inter|fredoka|quicksand)$/.test(url.pathname))return route.fulfill({body:readFileSync(path.join(root,'apps/web/app/fonts',url.pathname.split('/').pop()+'-var-latin.woff2')),contentType:'font/woff2'});
  if(url.pathname.startsWith('/api/')){
   const method=original.method(),request=new Request(original.url(),{method,headers:{...original.headers(),...(method==='POST'?{origin:url.origin}: {})},...(method==='POST'?{body:original.postData()}: {})});
   const key=url.pathname==='/api/attempts'?'answer':method==='POST'?'action':'poll';counts[key]++;
   try{const response=await sessions.run(user,()=>key==='answer'?attempts.POST(request):method==='POST'?api.livePost(request):api.liveGet(request));return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});}
   catch(error){errors.push(String(error));return route.fulfill({status:500,json:{ok:false,error:'synthetic_failed'}});}
  }
  const teacher=user===TEACHER,id=teacher?url.searchParams.get('room'):url.pathname.match(/\/live\/([0-9a-f-]+)$/)?.[1];
  return route.fulfill({body:fixture.html({grade:1,preview:false,enabled:true,ownerId:user,...(teacher?{classId:A}:{}),...(id?{id}: {})}),contentType:'text/html'});
 });
 const page=await c.newPage();page.on('pageerror',error=>errors.push(String(error)));return page;
}
async function currentRoom(id){return (await db.select().from(schema.liveRooms).where(eq(schema.liveRooms.id,id)))[0];}
function correct(room){const q=room.questions[room.round],item=loader.loadUnit(q.unitKey).vocab.find(i=>i.id===q.itemId);return engine.vocabAnswers(item,q.pool).find(a=>a.tier==='full').text;}
try{
 const me=await client(ME),peer=await client(PEER),teacher=await client(TEACHER);
 // Entire invite flow through the real browser and API.
 await me.goto('https://live-flow.test/arena/live');await me.getByRole('button',{name:'Chapter 1',exact:true}).click();await me.getByRole('button',{name:/Synthetic 02.*Einladen/}).first().click();
 await me.waitForURL(/\/arena\/live\/[0-9a-f-]+$/);const battleId=me.url().split('/').pop();steps.push('student invites through real API');
 await peer.goto(`https://live-flow.test/arena/live/${battleId}`);await peer.getByRole('button',{name:'Annehmen',exact:true}).click();await peer.getByText('Gleich geht’s los',{exact:false}).waitFor();
 offset=5000;await me.reload();await peer.reload();await me.getByRole('textbox').fill(correct(await currentRoom(battleId)));await me.getByRole('button',{name:'Antwort abgeben',exact:true}).click();await me.getByText('Antwort gespeichert.',{exact:false}).waitFor();
 offset=6000;await peer.getByRole('textbox').fill(correct(await currentRoom(battleId)));await peer.getByRole('button',{name:'Antwort abgeben',exact:true}).click();await peer.getByText('Antwort gespeichert.',{exact:false}).waitFor();
 const battle=await sessions.run(ME,()=>db.transaction(tx=>service.getLiveRoom(tx,scope,{userId:ME,classId:A,teacher:false},battleId,date(offset))));assert.equal(battle.phase,'result');assert.deepEqual(battle.players.map(p=>p.score),[1,0]);assert.equal((await db.select().from(schema.practiceAttempts)).length,2);steps.push('two browsers book two graded answers, server-time winner 1:0');
 await me.screenshot({path:path.join(out,'battle-after-answer.png'),fullPage:true});
 // Teacher create -> two code joins -> start -> answers -> teacher advances.
 offset=20000;await teacher.goto(`https://live-flow.test/admin/classes/${A}/quiz`);await teacher.getByRole('button',{name:'Chapter 1',exact:true}).click();await teacher.getByRole('button',{name:'Quizraum öffnen',exact:true}).click();await teacher.waitForURL(/room=/);
 const quizId=new URL(teacher.url()).searchParams.get('room'),quiz=await currentRoom(quizId);await teacher.getByText(quiz.code,{exact:true}).waitFor();
 for(const page of [me,peer]){await page.goto('https://live-flow.test/arena/live');await page.getByRole('textbox',{name:'Raumcode',exact:true}).fill(quiz.code);await page.getByRole('button',{name:'Beitreten',exact:true}).click();await page.waitForURL(new RegExp(quizId+'$'));}
 await teacher.getByRole('button',{name:'Quiz starten',exact:true}).click();await teacher.getByText('Gleich geht’s los',{exact:false}).waitFor();steps.push('teacher opens quiz; two authorized children join by code');
 offset=25000;for(const page of [me,peer])await page.reload();const value=correct(await currentRoom(quizId));
 await me.getByRole('button',{name:value,exact:true}).click();await me.getByText('Antwort gespeichert.',{exact:false}).waitFor();offset=26000;
 await peer.getByRole('button',{name:value,exact:true}).click();await peer.getByText('Antwort gespeichert.',{exact:false}).waitFor();await teacher.getByRole('button',{name:'Nächste Frage',exact:true}).waitFor();
 const view=await db.transaction(tx=>service.getLiveRoom(tx,scope,{userId:TEACHER,classId:A,teacher:true},quizId,date(offset)));assert.deepEqual(view.players.map(p=>p.score),[966,933]);assert.equal((await db.select().from(schema.practiceAttempts)).length,4);
 await teacher.screenshot({path:path.join(out,'quiz-teacher-result.png'),fullPage:true});await me.screenshot({path:path.join(out,'quiz-child-result.png'),fullPage:true});
 await teacher.getByRole('button',{name:'Nächste Frage',exact:true}).click();await teacher.getByText('Frage 2/5',{exact:false}).waitFor();steps.push('quiz scores 966/933; only teacher advances');
 delete process.env.DOMIGO_LIVE_ARENA;await me.reload();await me.getByRole('alert').waitFor();assert.equal(await me.locator('.arena-scoreboard').count(),0);steps.push('kill switch returns unavailable in the real client');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'flow.json'),JSON.stringify({steps,counts,errors,attempts:4,realProduction:false},null,2)+'\n');console.log(JSON.stringify({steps,counts,errors,out}));
}catch(error){fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({steps,counts,errors,error:String(error)},null,2)+'\n');throw error;}finally{await browser.close();await pg.close();if(oldFlag===undefined)delete process.env.DOMIGO_LIVE_ARENA;else process.env.DOMIGO_LIVE_ARENA=oldFlag;}
