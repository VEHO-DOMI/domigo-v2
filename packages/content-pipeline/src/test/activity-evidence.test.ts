import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { assertActivityEvidence, buildActivityEvidence, parseActivityRows, parseEvidenceCsv } from "../activity-evidence.ts";

const hash=(bytes:Uint8Array)=>createHash("sha256").update(bytes).digest("hex");
const data=(rows:Array<{unit:number;w:string;g:string;cat:string}>)=>Buffer.from("window.ACTIVITY_WORDS = [\n"+rows.map(r=>`  { unit: ${r.unit}, w: ${JSON.stringify(r.w)}, g: ${JSON.stringify(r.g)}, cat: ${JSON.stringify(r.cat)} },`).join("\n")+"\n];\n");
function fixture() {
  const sources=[1,2,3,4].map(grade=>({grade,data:{alias:`activity-year-${grade}`,bytes:data(grade===1 ? [{unit:1,w:"bank",g:"Bank",cat:"draw"},{unit:1,w:"bank",g:"Flussufer",cat:"draw"}] : grade===2 ? [{unit:6,w:"picnic",g:"Picknick",cat:"draw"}] : [])},audit:grade===1 ? {alias:"audit-year-one",bytes:Buffer.from('unit,w,g,cat,confidence,justification\r\n1,bank,Kreditinstitut,draw,high,"A building, with a sign.\r\nKeep the rationale."\r\n1,bank,Flussufer,draw,medium,"River ""edge""."\r\n')} : null,overrides:grade===1 ? {alias:"override-year-one",bytes:Buffer.from("unit,w,cat\n")} : null,notes:grade===1 ? [{alias:"note-year-one",bytes:Buffer.from("Prose proposal: show. This is not an approval.")}] : []}));
  return {sources,expectedSources:sources.map(s=>({grade:s.grade,sha256:s.grade===1 ? "0".repeat(64) : hash(s.data.bytes),originalEntries:s.grade===1 ? 3 : s.grade===2 ? 1 : 0,matched:0,canonicalEntries:0})),
    tasks:[{id:"g1u01.w.bank",grade:1,unit:1,w:"bank",g:"Bank",taskFingerprint:"a".repeat(64)},{id:"g1u01.w.bank-2",grade:1,unit:1,w:"bank",g:"Flussufer",taskFingerprint:"b".repeat(64)},{id:"g2u03.w.picnic",grade:2,unit:3,w:"picnic",g:"Picknick",taskFingerprint:"c".repeat(64)},{id:"g4u11.w.unknown",grade:4,unit:11,w:"unknown",g:"unbekannt",taskFingerprint:"d".repeat(64)}],
    classifications:[{id:"g1u01.w.bank",word:"bank",mode:"draw"},{id:"g1u01.w.bank-2",word:"bank",mode:"explain"}],corpusPins:[]};
}

test("calibration retains source rows, distinct task meanings, missing categories and unapproved cross-unit candidates",()=>{
  const report=buildActivityEvidence(fixture());
  assert.equal(report.counts.sourceRows,3);assert.equal(report.counts.tasks,4);assert.equal(report.counts.missingClassifications,2);
  assert.equal(report.sources[0]!.provenance.hashMatches,false);assert.equal(report.sources[0]!.provenance.rowCountMatches,false);
  const banks=report.tasks.filter(t=>t.w==="bank");assert.equal(banks.length,2);assert.notEqual(banks[0]!.id,banks[1]!.id);
  assert.deepEqual(banks.map(b=>b.g),["Bank","Flussufer"]);assert.ok(banks.every(b=>b.candidates.length===2));
  assert.ok(banks.every(b=>b.meaningId===null&&b.verifiedMeaning===false));
  const picnic=report.tasks.find(t=>t.w==="picnic")!;assert.equal(picnic.classification,null);assert.equal(picnic.candidates[0]!.sameUnit,false);
  assert.equal(report.tasks.find(t=>t.w==="unknown")!.candidates.length,0);
  assert.equal(report.counts.approvedMappings,0);assert.equal(report.counts.approvedTeacherDecisions,0);
});

test("audit alignment preserves differing glosses, quoted commas/newlines and confidence without granting approval",()=>{
  const audit=buildActivityEvidence(fixture()).sources[0]!.audit!;
  assert.equal(audit.alignment.status,"ordered-unit-word-mode-match");assert.equal(audit.alignment.germanDifferences,1);
  assert.equal(audit.rows[0]!.g,"Kreditinstitut");assert.equal(audit.rows[0]!.justification,"A building, with a sign.\r\nKeep the rationale.");
  assert.equal(audit.rows[1]!.justification,'River "edge".');assert.equal(audit.rows[0]!.confidence,"high");
  assert.deepEqual(audit.rows.map(r=>[r.line1,r.lineEnd]),[[2,3],[4,4]]);
  assert.ok(audit.rows.every(r=>r.sourceRowId!==null));
  const source=buildActivityEvidence(fixture()).sources[0]!;assert.equal(source.data.rows[0]!.g,"Bank");
  assert.equal(source.overrides!.state,"present-empty");assert.equal(buildActivityEvidence(fixture()).sources[1]!.overrides,null);
  assert.equal(source.notes[0]!.interpretation,"metadata-only-not-a-decision");assert.ok(!JSON.stringify(source).includes("Prose proposal"));
});

test("mismatched audit evidence survives unbound rather than silently shifting rows",()=>{
  const input=fixture();input.sources[0]!.audit!.bytes=Buffer.from("unit,w,g,cat,confidence,justification\n1,bank,Bank,explain,low,Changed mode\n");
  const audit=buildActivityEvidence(input).sources[0]!.audit!;
  assert.equal(audit.rows.length,1);assert.equal(audit.rows[0]!.cat,"explain");assert.equal(audit.rows[0]!.sourceRowId,null);
  assert.equal(audit.alignment.status,"different-pool");assert.equal(audit.alignment.germanDifferences,null);
});

test("duplicate source rows and conflicting override inputs remain individually locatable",()=>{
  const input=fixture();input.sources[0]!.data.bytes=data([{unit:1,w:"bank",g:"Bank",cat:"draw"},{unit:1,w:"bank",g:"Bank",cat:"draw"}]);
  input.sources[0]!.overrides!.bytes=Buffer.from("unit,w,cat\n1,bank,show\n1,bank,explain\n");
  const source=buildActivityEvidence(input).sources[0]!;
  assert.equal(source.data.rows.length,2);assert.notEqual(source.data.rows[0]!.id,source.data.rows[1]!.id);
  assert.deepEqual(source.overrides!.rows.map(r=>r.cat),["show","explain"]);
  assert.ok(source.overrides!.rows.every(r=>r.sourceRowIds.length===2&&r.approval==="unverified-source-input"));
});

test("static parser refuses executable/unknown row values and malformed CSV without evaluating source code",()=>{
  const control='window.ACTIVITY_WORDS = [\n{ unit: 1, w: "bank", g: "Bank", cat: "draw" },\n];';
  assert.equal(parseActivityRows(control).length,1);
  for(const altered of [control.replace('w: "bank"','w: process.exit(99)'),control.replace('cat: "draw"','cat: "draw", approved: true'),control.replace('];',''),control+'\n'+control,control.replace('cat: "draw"','cat: "new-mode"'),'/*\n'+control+'\n*/',control+'\nwindow.ACTIVITY_WORDS.push({});',control.replace('w: "bank"','w: "bank", w: "other"')]) assert.throws(()=>parseActivityRows(altered));
  for(const csv of ['a,b\n"unterminated','a,b\n"closed"x,b','a,b\na"bad,b']) assert.throws(()=>parseEvidenceCsv(csv));
  assert.deepEqual(parseEvidenceCsv('a,b\n"a,b","a""b"\n').map(r=>r.fields),[["a","b"],["a,b",'a"b']]);
});

test("no authority-bearing extra fields, duplicate task/source identities or unaccounted map entries are accepted",()=>{
  for(const change of [
    (v:ReturnType<typeof fixture>)=>Object.assign(v,{approved:true}),
    (v:ReturnType<typeof fixture>)=>Object.assign(v.sources[0]!,{verifiedMeaning:true}),
    (v:ReturnType<typeof fixture>)=>v.tasks.push(v.tasks[0]!),
    (v:ReturnType<typeof fixture>)=>{v.sources[1]!.grade=1;},
    (v:ReturnType<typeof fixture>)=>{v.sources[1]!.data.alias=v.sources[0]!.data.alias;},
    (v:ReturnType<typeof fixture>)=>v.classifications.push({id:"g1u01.w.absent",word:"absent",mode:"draw"}),
  ]) { const input=fixture();change(input);assert.throws(()=>buildActivityEvidence(input)); }
});

test("report generation is deterministic and source or task changes invalidate its fingerprint",()=>{
  const input=fixture(),original=buildActivityEvidence(input);
  const reordered=fixture();reordered.sources.reverse();reordered.expectedSources.reverse();reordered.tasks.reverse();reordered.classifications.reverse();
  assert.deepEqual(buildActivityEvidence(reordered),original);
  input.tasks[0]!.taskFingerprint="e".repeat(64);assert.notEqual(buildActivityEvidence(input).fingerprint,original.fingerprint);
  const changed=fixture();changed.sources[0]!.audit!.bytes=Buffer.from(changed.sources[0]!.audit!.bytes.toString().replace("high","low"));
  assert.notEqual(buildActivityEvidence(changed).fingerprint,original.fingerprint);
});

test("re-derivation rejects lost, duplicated, altered and falsely approved evidence (tamper controls)",()=>{
  const input=fixture();const original=buildActivityEvidence(input);assert.doesNotThrow(()=>assertActivityEvidence(input,original));
  for(const change of [
    (r:typeof original)=>{r.sources[0]!.data.rows.pop();},
    (r:typeof original)=>{r.sources[0]!.data.rows.push(r.sources[0]!.data.rows[0]!);},
    (r:typeof original)=>{r.sources[0]!.audit!.rows[0]!.justification="invented";},
    (r:typeof original)=>{r.sources[0]!.provenance.hashMatches=true;},
    (r:typeof original)=>{r.tasks.pop();},
    (r:typeof original)=>{r.counts.approvedMappings=1;},
  ]) {const changed=structuredClone(original);change(changed);assert.throws(()=>assertActivityEvidence(input,changed),/differs/);}
});

test("a stale saved word does not lend its mode to a current task candidate",()=>{
  const input=fixture();input.classifications[0]!.word="different";const result=buildActivityEvidence(input);
  const task=result.tasks.find(t=>t.id==="g1u01.w.bank")!;assert.equal(task.classificationStatus,"saved-word-differs");assert.ok(task.candidates.every(c=>c.modeAgrees===null));
});
