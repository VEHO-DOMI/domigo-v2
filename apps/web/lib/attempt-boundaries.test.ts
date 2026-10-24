/** Real route, grader, corpus and local PostgreSQL; synthetic identities only. */
import assert from "node:assert/strict";
import { before, beforeEach, after, it } from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
import { loadUnit, loadListening, loadTest, loadStoryComprehension, storyIdForGrade, listApprovedUnits } from "@domigo/content-loader";
import { vocabAnswers } from "@domigo/engine";
import { startSpeedSession } from "./modi/speed-session.ts";
import { ATTEMPT_MODES, validModeInput } from "./modi/attempt-policy.ts";
const require = createRequire(new URL("../../../packages/db/package.json", import.meta.url));
const { PGlite } = require("@electric-sql/pglite"), { drizzle } = require("drizzle-orm/pglite");
const schema = await import("../../../packages/db/src/schema.ts");
const pg = new PGlite(), queries: string[] = [];
const db = drizzle(pg, { schema, logger: { logQuery: (q: string) => queries.push(q) } });
const { POST } = await import("../app/api/attempts/route.ts");
const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12,"0")}`;
const pupil=uuid(1), ownClass=uuid(2), otherClass=uuid(3), logs: string[]=[];
const realWarn=console.warn;
before(async () => {
  console.warn=(...args: unknown[])=>{logs.push(args.join(" "));};
  await pg.exec("CREATE SCHEMA domigo_v2; CREATE TABLE public.classes(id text primary key, grade integer)");
  const snapshot=JSON.parse(readFileSync(new URL("../../../packages/db/drizzle/meta/0023_snapshot.json",import.meta.url),"utf8"));
  type Col={name:string;type:string;primaryKey:boolean;notNull:boolean;default?:unknown};
  type Idx={name:string;isUnique:boolean;where?:string;columns:{expression:string;isExpression:boolean}[]};
  for(const table of Object.values(snapshot.tables) as {name:string;columns:Record<string,Col>;indexes:Record<string,Idx>}[]) {
    const cols=Object.values(table.columns).map(c=>`"${c.name}" ${c.type}${c.primaryKey?" PRIMARY KEY":""}${c.notNull?" NOT NULL":""}${"default" in c?` DEFAULT ${c.default}`:""}`);
    await pg.exec(`CREATE TABLE domigo_v2."${table.name}" (${cols.join(",")})`);
    for(const idx of Object.values(table.indexes)) await pg.exec(`CREATE ${idx.isUnique?"UNIQUE ":""}INDEX "${idx.name}" ON domigo_v2."${table.name}" (${idx.columns.map(c=>c.isExpression?c.expression:`"${c.expression}"`).join(",")})${idx.where?` WHERE ${idx.where}`:""}`);
  }
  await pg.exec(readFileSync(new URL("../../../packages/db/drizzle/0026_vocabulary_checks.sql",import.meta.url),"utf8"));
  await pg.exec(readFileSync(new URL("../../../packages/db/drizzle/0027_atomic_attempt_booking.sql",import.meta.url),"utf8"));
  for(const id of [ownClass,otherClass]) await pg.query("INSERT INTO domigo_v2.classes(id,name,grade,teacher_id,invite_code) VALUES($1,'Synthetic',2,$2,$3)",[id,uuid(9),id.slice(-6)]);
});
beforeEach(async()=>{
  resetSchoolFixture();fixture.db=db;fixture.session={user:{id:pupil,role:"student",classId:ownClass,scope:[ownClass]}};
  await pg.exec("TRUNCATE domigo_v2.practice_attempts, domigo_v2.review_queue, domigo_v2.user_progress, domigo_v2.reserved_items; UPDATE domigo_v2.classes SET grade=2");logs.length=0;queries.length=0;
});
after(async()=>{console.warn=realWarn;await pg.close();});
const vocab=loadUnit("g2-u01").vocab[0]!,answer=vocabAnswers(vocab,"carrier").find(a=>a.tier==="full")!.text;
function request(itemId=vocab.id,mode="practice",input:unknown={kind:"vocab",value:answer},id=crypto.randomUUID()) {
  return new Request("https://synthetic.invalid/api/attempts",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({ownerId:pupil,clientAttemptId:id,itemId,mode,input,...(mode==="vocabulary-check"?{vocabularyCheck:{schema:"vocabulary-check@1",visitId:uuid(30),checkNumber:1,maxChecks:3,itemRevision:vocab.rev,displayedContentSha256:null,sourceMode:"practice",checkedAt:null,reportedTier:"correct",helpShown:[]}}:{}),context:{grade:2,reserve:false,personal:"MUST_NOT_APPEAR"}})});
}
async function ledger(){return(await pg.query("SELECT (SELECT count(*) FROM domigo_v2.practice_attempts)::int attempts, (SELECT count(*) FROM domigo_v2.review_queue)::int reviews, (SELECT count(*) FROM domigo_v2.user_progress)::int progress")).rows[0];}
async function reserve(id:string,classId=ownClass,active=true){await pg.query("INSERT INTO domigo_v2.reserved_items(class_id,item_id,active) VALUES($1,$2,$3)",[classId,id,active]);}
async function denied(req:Request,error:string,status=403,expectLog=true){
  const response=await POST(req);assert.equal(response.status,status);assert.deepEqual(await response.json(),{ok:false,error});
  assert.deepEqual(await ledger(),{attempts:0,reviews:0,progress:0});
  if(expectLog) assert.ok(logs.some(log=>log===`[attempts] denied: ${error}`||log==="[attempts] eligibility_unavailable"||log==="[attempts] denied: class_scope"));
  assert.doesNotMatch(logs.join("\n"),/MUST_NOT_APPEAR|00000000-|Synthetic/);
}
it("eligible answer books authoritative XP exactly once across a replay",async()=>{
  const id=crypto.randomUUID();for(const duplicate of [false,true]){const res=await POST(request(vocab.id,"practice",undefined,id)),reply=await res.json();assert.equal(res.status,200);assert.equal(reply.ok,true);assert.equal(reply.tier,"correct");assert.equal(reply.duplicate,duplicate);}
  assert.deepEqual(await ledger(),{attempts:1,reviews:1,progress:1});assert.equal((await pg.query("SELECT xp FROM domigo_v2.user_progress")).rows[0].xp,vocab.difficulty*10);
});
for(const grade of [1,2,3,4]){
  const unit=loadUnit(`g${grade}-u01`),slugs=listApprovedUnits().filter(s=>s.startsWith(`g${grade}-`));
  const listening=slugs.flatMap(s=>loadListening(s)?.tasks.flatMap(t=>t.items)??[])[0]!;
  const reading=slugs.flatMap(s=>loadTest(s)?.test.sections.flatMap(t=>t.kind==="reading"?t.items:[])??[])[0]!;
  const storyId=storyIdForGrade(grade),story=storyId?loadStoryComprehension(storyId)?.items[0]:undefined;
  for(const item of [unit.vocab[0]!,unit.grammar[0]!,...(listening?[listening]:[]),...(reading?[reading]:[]),...(story?[story]:[])]){
    assert.ok(item,`year ${grade}: fixture exists`);
    it(`${item.id}: own active reserve rejects without any ledger effect`,async()=>{await pg.query("UPDATE domigo_v2.classes SET grade=$1 WHERE id=$2",[grade,ownClass]);await reserve(item.id);await denied(request(item.id,"practice",{kind:"text",value:"MUST_NOT_APPEAR"}),"item_reserved");});
    it(`${item.id}: foreign class grade cannot be forged in payload`,async()=>{await pg.query("UPDATE domigo_v2.classes SET grade=$1 WHERE id=$2",[grade%4+1,ownClass]);await denied(request(item.id,"practice",{kind:"text",value:"MUST_NOT_APPEAR"}),"wrong_grade");});
  }
}
for(const mode of [...ATTEMPT_MODES.filter(m=>m!=="grammar"&&m!=="speed"),"study:vocab-practice-1","study:grammar-practice-2","study:checkpoint","journey:g2-u01:first"]){
  it(`${mode}: no reserve exception`,async()=>{const input=mode==="memory"||mode==="wordhunt"?{kind:"choice",value:"x"}:{kind:"vocab",value:answer,pool:"deToEn"};assert.ok(validModeInput(mode,vocab.id,input));await reserve(vocab.id);await denied(request(vocab.id,mode,input),"item_reserved",403,mode!=="vocabulary-check");});
}
it("grammar: no reserve exception",async()=>{const item=loadUnit("g2-u01").grammar[0]!;await reserve(item.id);await denied(request(item.id,"grammar",{kind:"text",value:"x"}),"item_reserved");});
it("foreign/released reserve rows preserve the eligible item",async()=>{await reserve(vocab.id,otherClass);await reserve(vocab.id,ownClass,false);assert.equal((await(await POST(request())).json()).ok,true);assert.equal((await ledger()).attempts,1);});
for(const grade of [0,5])it(`invalid class grade ${grade} fails closed`,async()=>{await pg.query("UPDATE domigo_v2.classes SET grade=$1 WHERE id=$2",[grade,ownClass]);await denied(request(),"grade_unavailable");});
it("missing class cannot borrow the item's grade",async()=>{fixture.session!.user.classId=uuid(99);fixture.session!.user.scope=[uuid(99)];await denied(request(),"grade_unavailable");});
it("scope denial precedes database reads",async()=>{fixture.session!.user.scope=[otherClass];await denied(request(),"class_forbidden");assert.equal(queries.filter(q=>!q.startsWith("SELECT (SELECT count")).length,0);});
it("reserve outage is retryable and never graded/booked",async()=>{await pg.exec("ALTER TABLE domigo_v2.reserved_items RENAME TO reserved_items_hidden");try{await denied(request(),"eligibility_unavailable",503);}finally{await pg.exec("ALTER TABLE domigo_v2.reserved_items_hidden RENAME TO reserved_items");}});
it("teacher preview cannot book an answer",async()=>{fixture.session={user:{id:uuid(9),role:"teacher",classId:null,scope:[ownClass]}};assert.equal((await POST(request())).status,401);assert.deepEqual(await ledger(),{attempts:0,reviews:0,progress:0});});

it("speed: an authentic timer still cannot bypass the reserve", async()=>{
  const prior=process.env.AUTH_SECRET;process.env.AUTH_SECRET="synthetic-boundary-test-only";
  try { await reserve(vocab.id); const req=request(vocab.id,"speed",{kind:"vocab",value:answer,pool:"carrier"}); const body=await req.json();body.context={speedSession:startSpeedSession(pupil)};
    await denied(new Request(req.url,{method:"POST",headers:req.headers,body:JSON.stringify(body)}),"item_reserved");
  } finally { if(prior===undefined)delete process.env.AUTH_SECRET;else process.env.AUTH_SECRET=prior; }
});

for (const mode of ["practice", "daily"]) it(`${mode} replay exposes the original stored award, not regrading of a changed answer`, async () => {
  const id = crypto.randomUUID();
  const first = await (await POST(request(vocab.id, mode, { kind: "vocab", value: "not-the-answer-zzzz" }, id))).json();
  assert.equal(first.duplicate, false); assert.deepEqual(first.receipt, { tier: "wrong", xpAwarded: 0 });
  const replay = await (await POST(request(vocab.id, mode, undefined, id))).json();
  assert.equal(replay.duplicate, true); assert.equal(replay.tier, "correct");
  assert.deepEqual(replay.receipt, { tier: "wrong", xpAwarded: 0 });
  assert.deepEqual(await ledger(), { attempts: 1, reviews: 1, progress: 1 });
  const stored = await pg.query("SELECT xp_awarded FROM domigo_v2.practice_attempts");
  assert.equal(stored.rows[0]?.xp_awarded, 0);
});
it("v2 lookup failure journal never includes class parameters, even when falling back", async () => {
  const captured: string[] = [], original = console.error;
  console.error = (...args: unknown[]) => { captured.push(args.join(" ")); };
  await pg.exec("ALTER TABLE domigo_v2.classes RENAME TO classes_temporarily_unavailable");
  try {
    await denied(request(), "grade_unavailable");
    assert.equal(captured.length, 1);
    assert.doesNotMatch(captured.join("\n"), /00000000-|params:|Synthetic|MUST_NOT_APPEAR/);
  } finally {
    console.error = original;
    await pg.exec("ALTER TABLE domigo_v2.classes_temporarily_unavailable RENAME TO classes");
  }
});

// cgo-154: failure after each SQL write must never produce a partial receipt.
for (const seeded of [false, true]) for (const [step, table, event, condition] of [
  ["attempt", "practice_attempts", "INSERT", ""],
  ["queue", "review_queue", "INSERT OR UPDATE OF box, reps", ""],
  ["due", "review_queue", "UPDATE OF due_at", ""],
  ["progress", "user_progress", "INSERT OR UPDATE", ""],
  ["mark", "practice_attempts", "UPDATE", "WHEN (NEW.booked_at IS NOT NULL)"],
]) it(`real route: failure after ${step} (existing=${seeded}) rolls back; replay books exactly once`, async () => {
  const id = crypto.randomUUID();
  if (seeded) assert.equal((await (await POST(request())).json()).ok, true);
  const old = seeded ? 1 : 0;
  await pg.exec(`CREATE OR REPLACE FUNCTION domigo_v2.synthetic_fail_booking() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic_fault'; END $$;
    CREATE TRIGGER synthetic_booking_fault AFTER ${event} ON domigo_v2.${table} FOR EACH ROW ${condition} EXECUTE FUNCTION domigo_v2.synthetic_fail_booking();`);
  try {
    const failed = await (await POST(request(vocab.id, "practice", undefined, id))).json();
    assert.equal(failed.ok, false); assert.equal(failed.error, "persist_failed"); assert.equal(failed.receipt, undefined);
    assert.deepEqual(await ledger(), { attempts: old, reviews: old, progress: old });
    assert.equal((await pg.query("SELECT COALESCE(sum(xp),0)::int xp FROM domigo_v2.user_progress")).rows[0].xp, old * vocab.difficulty * 10);
  } finally { await pg.exec(`DROP TRIGGER synthetic_booking_fault ON domigo_v2.${table}`); }
  const retried = await (await POST(request(vocab.id, "practice", undefined, id))).json();
  assert.equal(retried.ok, true); assert.equal(retried.duplicate, false);
  const replay = await (await POST(request(vocab.id, "practice", { kind: "vocab", value: "synthetic-wrong" }, id))).json();
  assert.equal(replay.ok, true); assert.equal(replay.duplicate, true);
  assert.deepEqual(replay.receipt, retried.receipt);
  assert.equal(replay.receipt.xpAwarded * (old + 1), (await pg.query("SELECT xp FROM domigo_v2.user_progress")).rows[0].xp);
  assert.deepEqual(await ledger(), { attempts: old + 1, reviews: 1, progress: 1 });
  assert.equal((await pg.query("SELECT reps FROM domigo_v2.review_queue")).rows[0].reps, old + 1);
});
for (const mode of ["review", "study:vocab-practice-1", "journey:g2-u01:first"]) it(`${mode} receives the original booked award on replay`, async () => {
  const id = crypto.randomUUID();
  const first = await (await POST(request(vocab.id, mode, undefined, id))).json();
  const replay = await (await POST(request(vocab.id, mode, { kind:"vocab", value:"synthetic-wrong" }, id))).json();
  assert.equal(first.ok, true); assert.equal(replay.ok, true); assert.equal(replay.duplicate, true);
  assert.deepEqual(replay.receipt, first.receipt);
  assert.equal(replay.receipt.xpAwarded, (await pg.query("SELECT xp FROM domigo_v2.user_progress")).rows[0].xp);
});
