import { test } from "node:test";
import assert from "node:assert/strict";
import { VocabItem } from "@domigo/content-schema";
import { buildVocabularyIntake, fingerprint, type AppendixSource, type BankOccurrence } from "../vocabulary-intake.ts";
import { buildVocabularyCases } from "../vocabulary-cases.ts";
import { activityHash, buildActivityEvidence } from "../activity-evidence.ts";
import { assertSourceWave, buildSourceWave } from "../vocabulary-source-wave.ts";
import { sourceWaveReviewFiles } from "../vocabulary-source-wave-review.ts";
import { assertSupportWordsLocated, prerequisiteLexicon, supportLanguageEvidence, taskPrerequisites } from "../vocabulary-prerequisites.ts";

const banks: BankOccurrence[] = [
  {id:"g1u01.w.cat",slug:"g1-u01",grade:1,unit:1,en:"cat",deRaw:"Katze"},
  {id:"g1u02.w.helicopter",slug:"g1-u02",grade:1,unit:2,en:"helicopter",deRaw:"Hubschrauber"},
  {id:"g2u01.w.bank",slug:"g2-u01",grade:2,unit:1,en:"bank",deRaw:"Bank"},
  {id:"g2u01.w.bank-2",slug:"g2-u01",grade:2,unit:1,en:"bank",deRaw:"Flussufer"},
];
const task = (b: BankOccurrence) => VocabItem.parse({id:b.id,rev:1,w:b.en,g:b.deRaw,d:b.en==="cat"?"helicopter":"cat",s:"cat ___",difficulty:1,sSource:"invented",gloss:[],mc:["alpha","beta","gamma"],hintDe:"Denk an das Bild.",presentation:{variants:[],gameMeta:null,audio:null},provenance:{by:"fable",sbRef:null,seedV1:null,narrative:null,note:"Synthetic test."},dAnswers:[{text:b.en,tier:"full"}],sAnswers:[{text:b.en,tier:"full"}],translation:{deToEn:[{text:b.en,tier:"full"}],enToDe:[{text:b.deRaw,tier:"full"}]}});
function fixture() {
  const sources: AppendixSource[] = ([1,2,3,4] as const).map(grade=>({grade,sha256:String(grade).repeat(64),blocks:[{kind:"table",rows:[
    ["Headword","Reference","German"],
    ...(grade===1 ? [["cat","U1/1","Katze"],["— p. 132 —"],["helicopter","U2/1","Hubschrauber"],["to walk","U2/1","gehen"],["car crash","U2/1","Autounfall"]] : grade===2 ? [["bank","U1/1","Bank"],["bank","U1/1","Flussufer"],["unmatched","U1/2","ohne"],["bank","OYW2","Bank"]] : grade===4 ? [["outside","U14/1","außerhalb"]] : [])
  ]}]}));
  const evidence=banks.map(b=>({id:b.id,sourceSha256:"a".repeat(64),task:task(b)}));
  const intake=buildVocabularyIntake(sources,banks,banks.map(b=>({id:b.id,slug:b.slug,w:b.en})),[]);
  const activitySources=[1,2,3,4].map(grade=>({grade,data:{alias:`activity-year-${grade}`,bytes:Buffer.from('window.ACTIVITY_WORDS = [\n];\n')},audit:null,overrides:null,notes:[]}));
  const activity=buildActivityEvidence({sources:activitySources,expectedSources:activitySources.map(s=>({grade:s.grade,sha256:activityHash(s.data.bytes),originalEntries:0,matched:0,canonicalEntries:0})),tasks:evidence.map(e=>{const b=banks.find(b=>b.id===e.id)!;return {id:e.id,grade:b.grade,unit:b.unit,w:e.task.w,g:e.task.g,taskFingerprint:fingerprint(e.task)};}),classifications:[],corpusPins:[]});
  return {sources,evidence,intake,activity};
}
const build=(f=fixture())=>buildSourceWave(f.intake,f.evidence,f.activity,[]);

test("literal links preserve independent meanings, exact unit and explicit page claims",()=>{
  const r=build();assert.equal(r.counts.literalEvidenceLinks,2);
  const cat=r.links.find(l=>l.word==="cat")!;assert.equal(cat.pageMarker,null,"do not invent a page before the first marker");
  const later=r.links.find(l=>l.word==="helicopter")!;assert.equal(later.pageMarker!.claimedPrintedPage,132);
  assert.equal(r.draftIndex.records.filter(x=>x.bank.word==="bank").length,2);assert.ok(!r.links.some(l=>l.word==="bank"));
  assert.deepEqual(r.draftIndex.records.filter(x=>x.bank.word==="bank").map(x=>x.bank.german),["Bank","Flussufer"]);
  assert.ok(r.draftIndex.records.every(x=>x.meaningId===null&&x.firstTaught===null&&!x.approved&&!x.runtime));
  assert.ok(r.sourceRecords.every(x=>!x.page.originalPdfVerified));
  assert.equal(Object.values(r.counts.remainingPartition).reduce((a,b)=>a+b,0),r.counts.remainingOccurrences);
  assert.equal(r.counts.literalLinkedOccurrences+r.counts.remainingWithoutLiteralLink,r.counts.remainingOccurrences);
  assert.ok(r.decisions.every(d=>d.decision===null&&d.options.length===3&&d.recommendation.kind==="verification-order-only"));
});

test("prior sample identity changes bookkeeping only, with duplicate and stale sources rejected",()=>{
  const f=fixture(),c=buildVocabularyCases(f.intake,f.evidence).cases[0]!;
  const prior={id:c.id,sourceFingerprint:fingerprint(c.source)};
  const r=buildSourceWave(f.intake,f.evidence,f.activity,[prior]);
  assert.equal(r.counts.previousSample,1);assert.equal(r.counts.remainingOccurrences,r.counts.sourceOccurrences-1);
  assert.equal(r.sourceRecords.find(x=>x.id===c.id)!.verifiedMeaning,false);
  for (const bad of [[prior,prior],[{...prior,id:"absent"}],[{...prior,sourceFingerprint:"0".repeat(64)}]]) assert.throws(()=>buildSourceWave(f.intake,f.evidence,f.activity,bad),/prior sample/);
});

test("normalization, another unit, another gloss and changed effective tasks do not acquire literal links",()=>{
  for (const [col,value] of [[0,"CAT"],[1,"U2/1"],[2,"katze"]] as const) {
    const f=fixture();const block=f.sources[0]!.blocks[0]!;assert.equal(block.kind,"table");if(block.kind!=="table")throw Error();block.rows[1]![col]=value;
    f.intake=buildVocabularyIntake(f.sources,banks,banks.map(b=>({id:b.id,slug:b.slug,w:b.en})),[]);
    assert.ok(!build(f).links.some(l=>l.taskId===banks[0]!.id),value);
  }
  const f=fixture();f.evidence[0]!.task.g="Kater";
  const act=f.activity.tasks.find(t=>t.id===f.evidence[0]!.id)!;act.g="Kater";act.taskFingerprint=fingerprint(f.evidence[0]!.task);
  const {fingerprint:_,...body}=f.activity;f.activity.fingerprint=fingerprint(body);
  assert.ok(!build(f).links.some(l=>l.taskId===banks[0]!.id));
});

test("deterministic re-derivation rejects dropped, duplicated, altered or falsely approved evidence",()=>{
  const f=fixture(),r=build(f);assertSourceWave(f.intake,f.evidence,f.activity,[],r);
  assert.deepEqual(buildSourceWave(f.intake,[...f.evidence].reverse(),f.activity,[]),r);
  for(const change of [
    (x:typeof r)=>{x.links.pop();},(x:typeof r)=>{x.links.push(x.links[0]!);},
    (x:typeof r)=>{x.links[0]!.quotation=["fabricated"];},(x:typeof r)=>{x.counts.literalEvidenceLinks++;},
    (x:typeof r)=>{x.draftIndex.records[0]!.approved=true;},(x:typeof r)=>{x.draftIndex.records[0]!.prerequisites!.lexicalInventory.pop();},
    (x:typeof r)=>{x.draftIndex.prerequisiteLexicon.cat!.pop();},
  ]) {const changed=structuredClone(r);change(changed);assert.throws(()=>assertSourceWave(f.intake,f.evidence,f.activity,[],changed),/differs/);}
  const broken=structuredClone(f.activity);broken.tasks[0]!.taskFingerprint="0".repeat(64);assert.throws(()=>buildSourceWave(f.intake,f.evidence,broken,[]),/fingerprint/);
  const changed=fixture();changed.evidence[0]!.task.s="cat cat ___";assert.throws(()=>build(changed),/fingerprint/);
});

test("R2 negative gate rejects a later word; known word candidates never grant semantic approval",()=>{
  const f=fixture(),sources=buildVocabularyCases(f.intake,f.evidence).cases.map(c=>c.source),lexicon=prerequisiteLexicon(sources);
  const control=supportLanguageEvidence({definition:"cat"},"bank",1,1,lexicon);
  assert.doesNotThrow(()=>assertSupportWordsLocated(control));assert.equal(control[0]!.verifiedUse,false);
  const tamper=supportLanguageEvidence({definition:"cat helicopter"},"bank",1,1,lexicon);
  assert.equal(tamper.find(x=>x.surface==="helicopter")!.status,"later-reference-only");
  assert.throws(()=>assertSupportWordsLocated(tamper),/helicopter/);
  assert.doesNotThrow(()=>assertSupportWordsLocated(supportLanguageEvidence({definition:"cat helicopter"},"bank",1,2,lexicon)));
  assert.equal(supportLanguageEvidence({definition:"walk"},"cat",1,1,lexicon)[0]!.status,"later-reference-only");
  assert.equal(lexicon.has("crash"),false,"components of a source phrase are not granted standalone exposure");
  const taskEvidence=taskPrerequisites(f.evidence[0]!.task,1,1,lexicon);assert.equal(taskEvidence.status,"not-approved");assert.equal(taskEvidence.constructionReview.approved,false);
});

test("only inserted answer spans are targets: identical surrounding words and auxiliary glosses still need evidence",()=>{
  const f=fixture(),lexicon=prerequisiteLexicon(buildVocabularyCases(f.intake,f.evidence).cases.map(c=>c.source));
  const item={...f.evidence[1]!.task,s:"cat ___"};
  const clear=taskPrerequisites(item,1,1,lexicon);assert.equal(clear.lexicalInventory.find(x=>x.surface==="helicopter")!.status,"current-target-only");
  item.s="helicopter ___";assert.throws(()=>assertSupportWordsLocated(taskPrerequisites(item,1,1,lexicon).lexicalInventory),/helicopter/);
  const glossed={...f.evidence[0]!.task,gloss:[{word:"helicopter",de:"Hubschrauber",scope:null}]};
  assert.throws(()=>assertSupportWordsLocated(taskPrerequisites(glossed,1,1,lexicon).lexicalInventory),/helicopter/);
});

test("review documents retain exact decisions, all chapters and a resolvable shared lexicon",()=>{
  const wave=build(),files=sourceWaveReviewFiles(wave);
  assert.deepEqual(JSON.parse(files["source-decisions-wave-2.json"]!).decisions,wave.decisions);
  assert.deepEqual(JSON.parse(files["source-occurrences-wave-2.json"]!).sources,wave.sourceRecords);
  const index=JSON.parse(files["vocabulary-index-wave-2.json"]!);
  const all=index.chapters.flatMap((ch:{path:string})=>JSON.parse(files[ch.path]!).records);
  assert.deepEqual(all,wave.draftIndex.records);
  for(const record of wave.draftIndex.records)for(const word of record.prerequisites!.lexicalInventory)assert.equal(index.prerequisiteLexicon[word.lexiconKey]?.length??0,word.candidateCounts.total);
  assert.ok(files["source-decisions-wave-2.md"]!.includes(`${wave.decisions.length} Blätter`));
  assert.ok(!files["source-decisions-wave-2.md"]!.endsWith("\n\n"));
  assert.deepEqual(sourceWaveReviewFiles(wave),files);
});

test("historical diagnostic pointers recheck task identity without carrying stale approval forward",()=>{
  const f=fixture(),calibration={artifact:"fixture.json",sha256:"a".repeat(64),records:[{recordId:f.evidence[0]!.id,task:{fingerprint:fingerprint(f.evidence[0]!.task)}}]};
  const run=()=>buildSourceWave(f.intake,f.evidence,f.activity,[],calibration);
  assert.equal(run().draftIndex.records[0]!.priorCalibration!.taskBinding,"current");
  calibration.records[0]!.task.fingerprint="0".repeat(64);assert.equal(run().draftIndex.records[0]!.priorCalibration!.taskBinding,"stale");
  assert.equal(run().draftIndex.records[0]!.approved,false);
  calibration.records.push(calibration.records[0]!);assert.throws(run,/calibration record coverage/);
});
