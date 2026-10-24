import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { buildVocabularyIntake, type AppendixSource, type BankOccurrence } from "../vocabulary-intake.ts";
import { applyCaseDecisions, buildVocabularyCases, citationCandidates, type BankEvidence } from "../vocabulary-cases.ts";
import { REPO_ROOT } from "../paths.ts";

const banks: BankOccurrence[] = [
  {id:"g1u01.w.bank",slug:"g1-u01",grade:1,unit:1,en:"bank",deRaw:"Bank"},
  {id:"g2u02.w.bank",slug:"g2-u02",grade:2,unit:2,en:"bank",deRaw:"Flussufer"},
  {id:"g1u03.w.walk",slug:"g1-u03",grade:1,unit:3,en:"walk",deRaw:"gehen"},
];
const evidence: BankEvidence[] = banks.map(b=>({id:b.id,sourceSha256:"a".repeat(64),task:{id:b.id,w:b.en,g:b.deRaw,d:"A place where you keep money.",s:"I put my money in the ___.",sAnswers:[{text:b.en,tier:"full"}],dAnswers:[{text:b.en,tier:"full"}],translation:{deToEn:[{text:b.en,tier:"full"}],enToDe:[{text:b.deRaw,tier:"full"}]}}}));
const sources: AppendixSource[] = ([1,2,3,4] as const).map(grade=>({grade,sha256:String(grade).repeat(64),blocks:[{kind:"table",rows: [["Headword","Reference","German"],...(grade===1 ? [["bank","U1/1","Bank"],["to walk","U2/1","gehen"],["absent","T6","fehlt"]] : grade===4 ? [["novelist","U14/1","Romanautor/in"]] : [])]}]}));
function fixture(s=sources, e=evidence) {
  return buildVocabularyCases(buildVocabularyIntake(s,banks,banks.map(b=>({id:b.id,slug:b.slug,w:b.en})),[]),e);
}
function decision(book=fixture()) {
  const c=book.cases.find(c=>c.source.entry.en==="bank")!;
  return {caseId:c.id,caseFingerprint:c.fingerprint,bankId:banks[0]!.id,relation:"same-meaning",rationale:"The quoted evidence supports this local proposal.",author:"fixture-author",limitations:["Edition and first teaching are unknown."],taskAlignment:"unreviewed",evidence:[{side:"appendix",field:"de",text:"Bank"},{side:"bank",field:"de",text:"Bank"}]};
}
const decisions=(d: unknown[])=>({schema:"vocabulary-case-decisions@1",decisions:d});

test("citation suggestions retain exact form and never invent synonyms or strip arbitrary parentheses",()=>{
  for(const [input,expected,op] of [["to walk","walk","citation-to"],["the Alps","alps","leading-article"],["aunty (informal)","aunty","register-label"],["hippo (=hippopotamus)","hippopotamus","explicit-parenthetical-alias"],["wood(s)","woods","optional-plural-expanded"]]) {
    const forms=citationCandidates(input!);assert.equal(forms[0]!.form,input!.toLowerCase());assert.deepEqual(forms[0]!.operations,[]);
    assert.deepEqual(forms.find(f=>f.form===expected)?.operations,[op]);
  }
  assert.deepEqual(citationCandidates("bank (river)"),[{form:"bank (river)",operations:[]}]);
  assert.ok(!citationCandidates("ambulance").some(f=>f.form==="emergency vehicle"));
});

test("every source occurrence survives; spelling, chapter, meaning and first teaching remain separate",()=>{
  const b=fixture();assert.equal(b.counts.sourceOccurrences,4);assert.equal(b.counts.excludedOccurrences,1);assert.equal(b.counts.withCitationCandidate,2);
  const c=b.cases.find(c=>c.source.entry.en==="bank")!;
  assert.equal(c.candidates.length,2);assert.equal(c.candidates[0]!.exactTranslation,true);assert.equal(c.candidates[1]!.exactTranslation,false);
  assert.deepEqual(c.candidates.map(c=>c.placement),["same-unit","different-grade"]);
  const walk=b.cases.find(c=>c.source.entry.en==="to walk")!;assert.equal(walk.candidates[0]!.placement,"different-unit");assert.equal(walk.source.entry.reference.unit,2);
  assert.ok(b.cases.every(c=>c.meaningStatus==="unreviewed"&&c.firstTaught===null&&c.editionMapping==="unverified"));
  assert.equal(b.cases.find(c=>c.source.entry.en==="absent")!.source.entry.reference.unit,null);
  assert.deepEqual(fixture([...sources].reverse(),[...evidence].reverse()),b);
});

test("candidate evidence must cover every bank once and bind task and source identities",()=>{
  for(const e of [evidence.slice(1),[...evidence,evidence[0]!],evidence.map((x,i)=>i===0?{...x,sourceSha256:"bad"}:x),evidence.map((x,i)=>i===0?{...x,task:{...x.task!,id:"wrong"}}:x)]) assert.throws(()=>fixture(sources,e),/evidence/);
});

test("attributed decisions stay proposals even when quotes match; no caller can grant approval",()=>{
  const book=fixture();const d=decision(book);const result=applyCaseDecisions(book,decisions([d]));
  assert.equal(result.proposals[0]!.verifiedMeaning,false);assert.equal(result.proposals[0]!.state,"proposal-needs-independent-review");assert.equal(result.proposals[0]!.firstTaught,null);assert.equal(result.decisionCounts.independentlyVerified,0);
  for(const extra of [{author:" "},{rationale:"            "},{limitations:[" "]},{verifiedMeaning:true},{firstTaught:1},{approved:true}]) assert.throws(()=>applyCaseDecisions(book,decisions([{...d,...extra}])));
});

test("stale source, translation, task, candidate set or source-pin decisions fail (deliberate tampers)",()=>{
  const b=fixture();const d=decision(b);
  const mutations=[
    ()=>{const s=structuredClone(sources);const block=s[0]!.blocks[0]!;if(block.kind==="table")block.rows[1]![2]="Sitzbank";return fixture(s);},
    ()=>{const e=structuredClone(evidence);e[0]!.task!.s="Changed context ___";return fixture(sources,e);},
    ()=>{const e=structuredClone(evidence);e[0]!.sourceSha256="b".repeat(64);return fixture(sources,e);},
    ()=>{const s=structuredClone(sources);s[0]!.sha256="c".repeat(64);return fixture(s);},
  ];
  for(const mutate of mutations) assert.throws(()=>applyCaseDecisions(mutate(),decisions([d])),/missing or stale/);
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,caseFingerprint:"0".repeat(64)}])),/missing or stale/);
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,bankId:"unknown"}])),/not an evidenced candidate/);
});

test("duplicate, fabricated or wrong-field quotes and unsupported meaning decisions are rejected",()=>{
  const b=fixture(),d=decision(b);
  assert.throws(()=>applyCaseDecisions(b,decisions([d,d])),/duplicate/);
  for(const citation of [{side:"bank",field:"de",text:"Flussufer"},{side:"appendix",field:"s",text:"Bank"},{side:"task",field:"d",text:"invented citation"}]) assert.throws(()=>applyCaseDecisions(b,decisions([{...d,evidence:[...d.evidence,citation]}])),/not present/);
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,evidence:[d.evidence[0]]}])),/both translation/);
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,bankId:null}])),/require a bank/);
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,relation:"no-candidate",bankId:null}])),/has candidates/);
});

test("no candidate and outside-course retain source status; missing tasks cannot acquire judgments",()=>{
  const b=fixture(),d=decision(b);const none=b.cases.find(c=>c.source.entry.en==="absent")!;const excluded=b.cases.find(c=>c.source.disposition==="excluded")!;
  for(const [c,relation] of [[none,"no-candidate"],[excluded,"outside-course"]] as const) {
    const p={...d,caseId:c.id,caseFingerprint:c.fingerprint,bankId:null,relation,taskAlignment:"not-available",evidence:[{side:"appendix",field:"en",text:c.source.entry.en}]};
    assert.equal(applyCaseDecisions(b,decisions([p])).proposals[0]!.verifiedMeaning,false);
    assert.throws(()=>applyCaseDecisions(b,decisions([{...p,taskAlignment:"consistent-with-bank-meaning"}])),/available candidate task/);
  }
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,relation:"outside-course",bankId:null}])),/source disposition/);
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,taskAlignment:"not-available"}])),/available task/);
  assert.throws(()=>applyCaseDecisions(b,decisions([{...d,taskAlignment:"consistent-with-bank-meaning"}])),/definition or context/);
  assert.equal(applyCaseDecisions(b,decisions([{...d,taskAlignment:"consistent-with-bank-meaning",evidence:[...d.evidence,{side:"task",field:"d",text:"A place where you keep money."}]}])).proposals.length,1);
});

test("CLI rebuilds source and effective task evidence, verifies bytes and refuses tampered review artifacts",()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"domigo-vocabulary-cases-"));
  try {
    fs.mkdirSync(path.join(dir,"word"));
    fs.writeFileSync(path.join(dir,"word/document.xml"),'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:tbl><w:tr>'+["Headword","Reference","German"].map(s=>`<w:tc><w:p><w:r><w:t>${s}</w:t></w:r></w:p></w:tc>`).join("")+"</w:tr><w:tr>"+["window","U1/16","Fenster"].map(s=>`<w:tc><w:p><w:r><w:t>${s}</w:t></w:r></w:p></w:tc>`).join("")+"</w:tr></w:tbl></w:body></w:document>");
    execFileSync("zip",["-q",path.join(dir,"source.docx"),"word/document.xml"],{cwd:dir});
    const manifest=path.join(dir,"manifest.json"),out=path.join(dir,"out.json");
    fs.writeFileSync(manifest,JSON.stringify([1,2,3,4].map(grade=>({grade,path:"source.docx"}))));
    const args=[path.join(REPO_ROOT,"packages/content-pipeline/src/content.ts"),"vocabulary-cases","--manifest",manifest,"--out",out];
    const run=(extra:string[]=[])=>spawnSync(process.execPath,[...args,...extra],{cwd:REPO_ROOT,encoding:"utf8"});
    const first=run();assert.equal(first.status,0,first.stderr);
    const b=JSON.parse(fs.readFileSync(out,"utf8"));assert.equal(b.schema,"vocabulary-source-cases@1");assert.equal(b.cases.length,4);assert.equal(b.counts.bankOccurrences,2446);assert.ok(b.cases.some((c:{candidates:{task:unknown}[]})=>c.candidates.some(b=>b.task)));
    assert.ok(!fs.readFileSync(out,"utf8").includes(dir));assert.equal(run(["--verify"]).status,0);assert.notEqual(run().status,0);
    b.cases[0].candidates[0].bank.de="invented";fs.writeFileSync(out,JSON.stringify(b,null,2)+"\n");assert.match(run(["--verify"]).stderr,/case verification failed/);
    const privateName=path.join(dir,"PRIVATE_DECISION_SENTINEL.json");fs.writeFileSync(privateName,JSON.stringify({schema:"invalid",decisions:[],privateName}));
    const bad=run(["--decisions",privateName]);assert.notEqual(bad.status,0);assert.match(bad.stderr,/invalid vocabulary case/);assert.ok(!bad.stderr.includes(privateName));
    assert.notEqual(run(["--unknown"]).status,0);assert.notEqual(run(["--verify","--verify"]).status,0);
    // Simulate changed bytes after the captured read; never edit a real corpus file.
    for (const mode of ["bank","vocab","overlay"] as const) {
      const target=path.join(REPO_ROOT,mode==="overlay" ? "content/overlays/item-fixes.json" : `content/corpus/units/g1-u01/${mode==="bank" ? "wordbank" : "vocab"}.json`);
      const hook=path.join(dir,`race-${mode}.mjs`),raceOut=path.join(dir,`race-${mode}.json`);
      fs.writeFileSync(hook,`import fs from "node:fs";
const original=fs.readFileSync;let reads=0;
fs.readFileSync=function(file,...rest){const result=original.call(this,file,...rest);if(String(file)!==${JSON.stringify(target)}||++reads===1)return result;const value=JSON.parse(result.toString());
${mode==="bank" ? 'value.entries[0].deRaw="SYNTHETIC_CHANGED_TRANSLATION";' : mode==="vocab" ? 'value.items[0].s="SYNTHETIC_CHANGED_CONTEXT ___";' : 'value["g1-u01"]={patch:{"g1u01.w.address":{s:"SYNTHETIC_CHANGED_CONTEXT ___"}}};'}
const bytes=JSON.stringify(value);return typeof result==="string"?bytes:Buffer.from(bytes);};`);
      const raced=spawnSync(process.execPath,["--import",hook,...args.map((arg,i)=>args[i-1]==="--out"?raceOut:arg)],{cwd:REPO_ROOT,encoding:"utf8"});
      assert.notEqual(raced.status,0,`${mode}: changed revision must fail`);
      assert.match(raced.stderr,/corpus changed while reading/);assert.equal(fs.existsSync(raceOut),false,"no mixed-revision report may be written");
    }
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
