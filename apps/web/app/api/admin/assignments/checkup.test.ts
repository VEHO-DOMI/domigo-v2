import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import * as nodeModule from "node:module";
import { fixture, resetSchoolFixture } from "../../../../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
import { vocabAnswers } from "@domigo/engine";
const loaderURL = import.meta.resolve("@domigo/content-loader");
const dbURL = import.meta.resolve("@domigo/db");
type Resolver = (specifier: string, context: { parentURL?: string }, next: Resolver) => { url: string; shortCircuit?: boolean };
const { registerHooks } = nodeModule as unknown as { registerHooks: (hooks: { resolve: Resolver }) => void };
let workflowId = "";
const state = {
  rows: new Map<string, Record<string, unknown>>(), origins: new Map<string, { access: { teacherId: string; classId: string }; itemIds: string[] }>(),
  overrides: [] as unknown[], overlayReads: 0, driftAt: Number.POSITIVE_INFINITY,
  badKeyItemId: "", setupError: false, pollError: false, batchSizes: [] as number[],
  runs: new Map<string, unknown>(), launched: 0, writes: 0, ready: false, wrong: false, dbFailure: false, reserveFailure: false,
};
Object.assign(globalThis, { __cgo100Route: state, __cgo100Answers: vocabAnswers });
registerHooks({ resolve(specifier, context, next) {
  let source: string | undefined;
  if (specifier.endsWith("content-check-journal.ts")) source = `
    const s=globalThis.__cgo100Route;
    function guard(a){if(!a.scope.includes(a.classId))throw Error('scope');if(s.dbFailure)throw Error('db');}
    export async function beginCheckupWorkflow(_db,a){guard(a);const id=crypto.randomUUID();s.origins.set(id,{access:a,unitSlug:'',seed:'',itemIds:[],automatic:false});return id;}
    export async function recordCheckupComposition(_db,a,id,c){guard(a);const o=s.origins.get(id);if(!o||o.access.teacherId!==a.teacherId||o.access.classId!==a.classId)throw Error('origin');s.origins.set(id,{access:a,...c,automatic:true});}
    export async function readCheckupComposition(_db,a,id){guard(a);const o=s.origins.get(id);return o&&o.access.teacherId===a.teacherId&&o.access.classId===a.classId?o:null;}
    export async function hasCheckupCompositionItems(_db,a,ids){guard(a);return [...s.origins.values()].some(o=>o.access.teacherId===a.teacherId&&o.access.classId===a.classId&&o.itemIds.some(id=>ids.includes(id)));}
    export async function readContentCheck(_db,a,key){guard(a);return s.rows.get(key)??null;}
    export async function claimContentCheck(_db,a,key,meta,retry){guard(a);const old=s.rows.get(key);if(old&&(old.status!=='error'||old.attemptId!==retry))return false;s.rows.set(key,{status:'checking',createdAt:new Date(),attemptId:old?key+'-retry-'+old.attemptNumber:key,attemptNumber:(old?.attemptNumber??0)+1});return true;}
    export async function appendContentCheck(_db,a,key,e){guard(a);const old=s.rows.get(key);if(old?.terminal || (e.attemptId && e.attemptId!==old?.attemptId))return;s.rows.set(key,{...old,...e,terminal:e.status!=='checking'});}
  `;
  if (specifier.endsWith("studio-solve-sandbox.ts")) source = `
    const s=globalThis.__cgo100Route;
    export async function startSandboxFrame(t,remember){const id='synthetic-'+(++s.launched);s.runs.set(id,t);await remember(id);}
    export async function pollSandboxFrame(id){if(!s.ready)return {status:'checking'};const t=s.runs.get(id);const answers=t.kind==='grammar'?t.item.answers:globalThis.__cgo100Answers(t.item,t.pool);return {status:'complete',candidates:[{answer:s.wrong?'zzz-wrong':answers.find(a=>a.tier==='full').text,confidence:.99}],costUsd:null,inputTokens:null,outputTokens:null};}
    export async function startSandboxBatch(tasks,remember){s.batchSizes.push(tasks.length);if(s.setupError)throw Error('setup');const id='batch-'+(++s.launched);s.runs.set(id,tasks);await remember(id);}
    export async function pollSandboxBatch(id){if(s.pollError)return {status:'error',note:'synthetic unavailable'};if(!s.ready)return {status:'checking'};const results={};for(const t of s.runs.get(id)){const answers=t.kind==='grammar'?t.item.answers:globalThis.__cgo100Answers(t.item,t.pool);results[t.key]={status:'complete',candidates:[{answer:s.wrong?'zzz-wrong':answers.find(a=>a.tier==='full').text,confidence:.99}],costUsd:null,inputTokens:null,outputTokens:null};}return {status:'complete',results};}
    export async function stopSandboxFrame(){}
  `;
  if(specifier==="@domigo/content-loader")source=`export * from ${JSON.stringify(loaderURL)};import {loadUnit as realLoad} from ${JSON.stringify(loaderURL)};const s=globalThis.__cgo100Route;
    export function loadUnit(slug){const unit=realLoad(slug);if(!s.badKeyItemId)return unit;const copy=structuredClone(unit);const item=copy.vocab.find(v=>v.id===s.badKeyItemId);if(item)item.sAnswers.push({tier:'full',text:'   '});return copy;}`;
  if(specifier==="@domigo/db")source=`export * from ${JSON.stringify(dbURL)};const s=globalThis.__cgo100Route;
    export const loadPublishedOverrides=async()=>{if(s.dbFailure)throw Error('db');s.overlayReads++;return s.overlayReads>=s.driftAt?s.overrides:[]};
    export const loadPublishedDrafts=async()=>[];
    export const listReservedForClass=async()=>{if(s.reserveFailure)throw Error('reserve');return new Set()};
    export const createAssignment=async()=>{s.writes++;return 'synthetic-assignment'};`;
  return source?{shortCircuit:true,url:'data:text/javascript,'+encodeURIComponent(source)}:next(specifier,context,next);
} });
const { composeCheckup } = await import("../../../../lib/checkup.ts");
const { POST } = await import("./route.ts");
const { POST: COMPOSE } = await import("./compose-checkup/route.ts");
const request=(body:unknown)=>new Request("https://synthetic.invalid/api/admin/assignments",{method:"POST",body:JSON.stringify(body)});
const composed=composeCheckup("g2-u03",2,"cgo100-routes"); assert.ok(composed.ok);
const sections=composed.sections.map(s=>({...s,weightPct:0}));
const base=()=>({compositionId:workflowId,submissionId:"00000000-0000-4000-8000-000000000001",title:"Synthetic checkup",mode:"checkup",classId:"own",attemptsPerTest:1,sections});
async function automatic(){const r=await COMPOSE(request({compositionId:workflowId,classId:"own",unitSlug:"g2-u03",seed:"cgo100-routes"}));assert.equal(r.status,200);return {...base(),compositionId:(await r.json()).compositionId as string};}
beforeEach(async()=>{
  resetSchoolFixture();fixture.session={user:{id:"teacher-a",role:"teacher",classId:null,scope:["own"]}};
  fixture.classRows=[{id:"own",name:"Synthetic own",grade:2},{id:"foreign",name:"Synthetic foreign",grade:2}];
  state.badKeyItemId="";state.setupError=false;state.pollError=false;state.batchSizes=[];
  state.overrides=[];state.overlayReads=0;state.driftAt=Number.POSITIVE_INFINITY;
  state.rows.clear();state.origins.clear();state.runs.clear();state.launched=0;state.writes=0;state.ready=false;state.wrong=false;state.dbFailure=false;state.reserveFailure=false;
  const response=await COMPOSE(request({action:"begin",classId:"own"})); assert.equal(response.status,200); workflowId=(await response.json()).compositionId;
});
describe("checkup route intelligence wall",()=>{
  it("auto without journal returns checking and never persists optimistically",async()=>{
    const r=await POST(request(await automatic()));assert.equal(r.status,202);const d=await r.json();
    assert.equal(d.status,"checking");assert.equal(d.checked,0);assert.equal(d.total,20);assert.ok(d.runId);assert.equal(state.launched,1);assert.equal(state.writes,0);
  });
  it("polls to green and reuses exact journal hits without another run",async()=>{
    const body=await automatic();assert.equal((await POST(request(body))).status,202);state.ready=true;
    let r:Response|undefined;for(let i=0;i<21;i++){r=await POST(request(body));if(r.status!==202)break;}
    assert.equal(r!.status,200);assert.equal(state.writes,1);assert.equal(state.launched,1);
    assert.equal((await POST(request(body))).status,200);assert.equal(state.launched,1);
  });
  it("blocked returns 422 plus reason and swap target before publication",async()=>{
    const body=await automatic();state.ready=true;state.wrong=true;const r=await POST(request(body));assert.equal(r.status,422);
    const d=await r.json();assert.equal(d.error,"checkup_blocked");assert.equal(d.blockedItemIds.length,20);assert.match(d.errors[0],/Item tauschen/);assert.equal(state.writes,0);
  });
  it("manual default performs no sandbox run",async()=>{assert.equal((await POST(request(base()))).status,200);assert.equal(state.launched,0);assert.equal(state.writes,1);});
  it("manual opt-in starts the intelligence gate",async()=>{assert.equal((await POST(request({...base(),alsoCheck:true}))).status,202);assert.equal(state.launched,1);assert.equal(state.writes,0);});
  it("stripping automatic origin or forging passed flags cannot bypass the gate",async()=>{
    await automatic();assert.equal((await POST(request({...base(),alsoCheck:false,status:"passed",checked:true}))).status,202);assert.equal(state.writes,0);
  });
  it("stripping the workflow ID blocks across owned classes",async()=>{
    const body=await automatic();fixture.session!.user.scope.push("own-second");fixture.classRows.push({id:"own-second",name:"Synthetic second",grade:2});
    assert.equal((await POST(request({...body,compositionId:undefined,classId:"own-second"}))).status,422);assert.equal(state.launched,0);assert.equal(state.writes,0);
  });
  it("a fresh manual workflow stays opt-out even after earlier automatic use of the same items",async()=>{
    await automatic(); const r=await COMPOSE(request({action:"begin",classId:"own"}));const manual=(await r.json()).compositionId;
    assert.equal((await POST(request({...base(),compositionId:manual}))).status,200);assert.equal(state.launched,0);
  });
  it("swapping every item retains the explicit server-recorded automatic origin",async()=>{
    const body=await automatic();const other=composeCheckup("g2-u06",2,"different");assert.ok(other.ok);
    assert.equal((await POST(request({...body,sections:other.sections.map(s=>({...s,weightPct:0}))}))).status,202);assert.equal(state.writes,0);
  });
  it("foreign class is 403 before any journal, model or publication operation",async()=>{
    assert.equal((await POST(request({...base(),classId:"foreign",alsoCheck:true}))).status,403);
    assert.equal((await COMPOSE(request({compositionId:workflowId,classId:"foreign",unitSlug:"g2-u03"}))).status,403);
    assert.equal(state.launched,0);assert.equal(state.rows.size,0);assert.equal(state.origins.size,1);assert.equal(state.writes,0);
  });
  it("a foreign composition proof cannot publish",async()=>{
    const body=await automatic();fixture.session!.user.id="teacher-b";assert.equal((await POST(request(body))).status,422);assert.equal(state.launched,0);assert.equal(state.writes,0);
  });
  it("compose refuses grade mismatch and unreadable reservations",async()=>{
    assert.equal((await COMPOSE(request({compositionId:workflowId,classId:"own",unitSlug:"g3-u03"}))).status,403);state.reserveFailure=true;
    assert.equal((await COMPOSE(request({compositionId:workflowId,classId:"own",unitSlug:"g2-u03"}))).status,503);assert.equal(state.origins.size,1);
  });
  it("journal failure blocks even manual publication",async()=>{
    state.dbFailure=true;assert.equal((await POST(request(base()))).status,503);assert.equal(state.writes,0);assert.equal(state.launched,0);
  });
  it("rereads the displayed bytes after asynchronous checking and blocks observed drift",async()=>{
    const body=await automatic(); assert.equal((await POST(request(body))).status,202); state.ready=true;
    const id=sections.find(s=>s.kind==="vocab")!.itemIds[0]!;
    const item=loadUnit("g2-u03").vocab.find(v=>v.id===id)!;
    state.overrides=[{itemId:id,kind:"vocab",patch:{s:item.s+" "}}];
    state.driftAt=state.overlayReads+2;
    const r=await POST(request(body));assert.equal(r.status,202);assert.equal((await r.json()).checked,0);assert.equal(state.writes,0);
  });
  it("keeps the /20 gate before all model spending",async()=>{
    const body=await automatic();assert.equal((await POST(request({...body,sections:sections.slice(1)}))).status,422);assert.equal(state.launched,0);
  });
});

it("auto with an unreachable full key returns 422 before any sandbox start",async()=>{
  const body=await automatic();state.badKeyItemId=sections.find(s=>s.sectionConfig.checkupKind==="words-phrases")!.itemIds[0]!;
  const response=await POST(request(body));const data=await response.json();
  assert.equal(response.status,422);assert.equal(data.status,"blocked");
  assert.match(data.errors.join(" "),/Lösungsschlüssel/);assert.equal(state.launched,0);assert.equal(state.rows.size,0);assert.equal(state.writes,0);
});
it("twenty missing tasks use one batch and infrastructure errors return 503 then retry",async()=>{
  const body=await automatic();state.setupError=true;
  const failed=await POST(request(body));const data=await failed.json();
  assert.equal(failed.status,503);assert.equal(data.status,"error");assert.deepEqual(data.blockedItemIds,[]);
  assert.match(data.errors.join(" "),/Prüfung konnte nicht laufen — später erneut/);assert.equal(state.writes,0);
  state.setupError=false;assert.equal((await POST(request(body))).status,202);
  assert.deepEqual(state.batchSizes,[20,20]);assert.equal(state.launched,1);
  state.ready=true;assert.equal((await POST(request(body))).status,200);assert.equal(state.launched,1);
});
it("a sandbox outage returns 503 without publishing or suggesting an item swap",async()=>{
  const body=await automatic();await POST(request(body));state.pollError=true;
  const response=await POST(request(body));const data=await response.json();
  assert.equal(response.status,503);assert.equal(data.status,"error");assert.deepEqual(data.blockedItemIds,[]);assert.equal(state.writes,0);
  state.pollError=false;assert.equal((await POST(request(body))).status,202);assert.equal(state.launched,2);
});
