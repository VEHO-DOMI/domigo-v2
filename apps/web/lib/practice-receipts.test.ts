import assert from "node:assert/strict";
import { it } from "node:test";
import { createElement } from "react";
import { loadUnit } from "@domigo/content-loader";
import type { AttemptResult } from "./attempt-outbox.ts";
import { mount, nodes, text, click, settle } from "./modi/grammar-render-harness.ts";
const unit=loadUnit("g2-u01"),item=unit.vocab[0]!;
function fixture(preview=false){
  const sent: {id:string;resolve:(r:AttemptResult)=>void}[]=[];
  let receive:(id:string,r:AttemptResult)=>void=()=>{};
  const props={slug:"g2-u01",vocab:[item,item],grammar:unit.grammar.slice(0,1),today:"2026-10-24",ownerId:"synthetic-owner",preview,runMode:"full"};
  const view=mount("app/practice/[slug]/PracticeSession.tsx",props,{
    "../options":{multipleChoiceBank:()=>[]},
    "@/lib/useOutboxFlush":{useOutboxFlush(_enabled:boolean,_owner:string,onReply:typeof receive){receive=onReply;}},
    "@/lib/preview-attempt":{attemptSender:()=> (body:{clientAttemptId:string})=>new Promise<AttemptResult>(resolve=>sent.push({id:body.clientAttemptId,resolve}))},
    "@domigo/task-ui":{rotateVocabPool:()=>"carrier",VOCAB_POOLS:["carrier","definition"],VOCAB_POOL_LABEL:{carrier:"Context",definition:"Meaning"},
      VocabItemView:({onResult,hideXp}:{onResult:(tier:string,detail:unknown)=>void;hideXp?:boolean})=>{assert.equal(hideXp,true,"the task must not display local XP");return createElement("button",{onClick:()=>onResult("correct",{itemId:item.id,input:{kind:"vocab",value:"x"}} )},"answer");},GrammarItemView:({hideXp}:{hideXp?:boolean})=>{assert.equal(hideXp,true);return null;}},
  });
  return {view,props,sent,reply:(id:string,r:AttemptResult)=>receive(id,r),answer:()=>click(nodes(view.render()).find(n=>n.type==="button"&&text(n.props.children)==="answer")!)};
}
const xp=(f:ReturnType<typeof fixture>)=>Number(nodes(f.view.render()).map(n=>text(n.props.children)).find(t=>/^\d+ XP/.test(t))?.match(/^(\d+) XP/)?.[1]);
it("waits for the persisted receipt, then uses server XP and tier",async()=>{
  const f=fixture();f.answer();assert.equal(xp(f),0);f.sent[0]!.resolve({ok:true,queued:false,xpAwarded:5,tier:"partial"});await settle();assert.equal(xp(f),5);assert.match(text(f.view.render()),/1 partial/);
});
for(const reply of [{ok:false,queued:false,xpAwarded:20},{ok:false,queued:true,xpAwarded:20},{ok:true,queued:true,xpAwarded:20}])it(`unconfirmed ${JSON.stringify(reply)} never earns XP`,async()=>{const f=fixture();f.answer();f.sent[0]!.resolve(reply);await settle();assert.equal(xp(f),0);});
it("preview remains zero even if a faulty sender supplies XP",async()=>{const f=fixture(true);f.answer();f.sent[0]!.resolve({ok:true,queued:false,xpAwarded:20});await settle();assert.equal(xp(f),0);});
it("delayed outbox confirmation counts once, including repeated and stale immediate replies",async()=>{
  const f=fixture();f.answer();const id=f.sent[0]!.id;f.reply(id,{ok:true,queued:false,xpAwarded:7});f.reply(id,{ok:true,queued:false,xpAwarded:99});f.sent[0]!.resolve({ok:false,queued:true});await settle();assert.equal(xp(f),7);
});
it("foreign attempt receipts cannot change this round",()=>{const f=fixture();f.answer();f.reply("foreign",{ok:true,queued:false,xpAwarded:99});assert.equal(xp(f),0);});
it("two callbacks for the same displayed task do not create two attempts",()=>{const f=fixture();f.answer();f.answer();assert.equal(f.sent.length,1);});
it("switching the pool discards late old-round receipts",async()=>{
  const f=fixture();delete (f.props as {runMode?:string}).runMode;f.view.render();click(nodes(f.view.render()).find(n=>n.type==="button"&&text(n.props.children).startsWith("Vocab"))!);f.answer();
  click(nodes(f.view.render()).find(n=>n.type==="button"&&text(n.props.children)==="Meaning")!);f.sent[0]!.resolve({ok:true,queued:false,xpAwarded:20});await settle();assert.equal(xp(f),0);
});
it("changing owner creates a fresh round without old points",async()=>{const f=fixture();f.answer();f.props.ownerId="new-owner";f.view.render();f.sent[0]!.resolve({ok:true,queued:false,xpAwarded:20});await settle();assert.equal(xp(f),0);});

for (const change of ["day", "vocab", "grammar", "order"] as const) it(`changing ${change} creates a fresh round and accepts a new answer`, async () => {
  const f = fixture();
  if (change === "order") f.props.vocab = [item, loadUnit("g2-u02").vocab[0]!];
  f.answer();
  if (change === "day") f.props.today = "2026-10-25";
  if (change === "vocab") f.props.vocab = loadUnit("g2-u02").vocab.slice(0, 1);
  if (change === "grammar") f.props.grammar = loadUnit("g2-u02").grammar.slice(0, 1);
  if (change === "order") f.props.vocab = [...f.props.vocab].reverse();
  f.view.render();
  f.sent[0]!.resolve({ ok: true, queued: false, xpAwarded: 19 });
  await settle(); assert.equal(xp(f), 0);
  assert.doesNotMatch(text(f.view.render()), /Done →/);
  f.answer(); assert.equal(f.sent.length, 2);
});
it("identical freshly allocated task arrays preserve the current round", async () => {
  const f = fixture(); f.answer(); f.props.vocab = [...f.props.vocab]; f.props.grammar = [...f.props.grammar]; f.view.render();
  f.sent[0]!.resolve({ ok: true, queued: false, xpAwarded: 7 }); await settle(); assert.equal(xp(f), 7);
});
for (const lost of [true, false]) it(`original persisted receipt survives ${lost ? "lost" : "overtaken"} first response exactly once`, async () => {
  const f = fixture(); f.answer(); const first = f.sent[0]!;
  if (lost) { first.resolve({ ok: false, queued: true }); await settle(); }
  f.reply(first.id, { ok: true, queued: false, xpAwarded: 0, receipt: { tier: "partial", xpAwarded: 7 } });
  assert.equal(xp(f), 7); assert.match(text(f.view.render()), /1 partial/);
  if (!lost) { first.resolve({ ok: true, queued: false, xpAwarded: 7, receipt: { tier: "partial", xpAwarded: 7 } }); await settle(); }
  f.reply(first.id, { ok: true, queued: false, xpAwarded: 0, receipt: { tier: "correct", xpAwarded: 99 } });
  assert.equal(xp(f), 7);
});
it("a stored wrong answer remains zero even if replay was newly graded correct", () => {
  const f = fixture(); f.answer(); f.reply(f.sent[0]!.id, { ok: true, queued: false, tier: "correct", xpAwarded: 20, receipt: { tier: "wrong", xpAwarded: 0 } });
  assert.equal(xp(f), 0); assert.match(text(f.view.render()), /1 wrong/);
});
