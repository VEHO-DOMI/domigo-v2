import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { assertSourceAccounting, buildVocabularyIntake, exactTextKey, parseAppendixReference, sourceRows, type AppendixSource, type BankOccurrence, type IntakeGrade } from "../vocabulary-intake.ts";
import { REPO_ROOT } from "../paths.ts";
import { reportOutputPath } from "../vocabulary-intake-cli.ts";

const source = (grade: IntakeGrade, rows: string[][]): AppendixSource => ({grade,sha256:String(grade).repeat(64),blocks:[{kind:"table",rows:[["Headword","Reference","German"],...rows]}]});
const sources = (rows: string[][] = []): AppendixSource[] => [source(1,rows),source(2,[]),source(3,[]),source(4,[])];
const banks: BankOccurrence[] = [
  {id:"g1u01.w.window",slug:"g1-u01",grade:1,unit:1,en:"window",deRaw:"Fenster"},
  {id:"g2u11.w.window",slug:"g2-u11",grade:2,unit:11,en:"window",deRaw:"Fenster"},
];
const tasks = banks.map(b=>({id:b.id,slug:b.slug,w:b.en}));

test("references preserve exact exercise code; a prior book does not invent a unit",()=>{
  assert.deepEqual(parseAppendixReference("U6/OYW2",2),{kind:"unit",grade:2,unit:6,code:"U6/OYW2"});
  assert.deepEqual(parseAppendixReference("OYW3",2),{kind:"section",grade:2,unit:null,code:"OYW3"});
  assert.deepEqual(parseAppendixReference("MORE 1",4),{kind:"prior-grade",grade:1,unit:null,code:"MORE 1"});
  for(const ref of ["MORE 2","MORE 4","U0/1","U16/1","U1/1 and U2/1","mystery"]) assert.equal(parseAppendixReference(ref,2),null);
});

test("table source text and optional pronunciation survive, paragraphs remain quarantined",()=>{
  const s: AppendixSource = {grade:1,sha256:"a".repeat(64),blocks:[{kind:"paragraph",text:"WORDLIST"},{kind:"paragraph",text:"window U1/16 [wɪndəʊ] Fenster door U1/4 [dɔː] Tür"},{kind:"table",rows:[["Headword","Reference","Phonetics","German"],["window","U1/16","[wɪndəʊ]","Fenster"],["— p. 132 —"],["A"],["to work","unknown","[wɜːk]","arbeiten"],["broken row"]]}]};
  const rows=sourceRows(s);
  assert.equal(rows.length,8);
  assert.equal(rows[1]!.state,"quarantined"); assert.equal(rows[1]!.entry,null);
  assert.deepEqual(rows[3]!.entry,{en:"window",de:"Fenster",phonetics:"[wɪndəʊ]",reference:{kind:"unit",grade:1,unit:1,code:"U1/16"}});
  assert.equal(rows[6]!.reason,"unrecognized-or-out-of-course-reference");
  assert.equal(rows[7]!.reason,"unrecognized-table-shape");
  assertSourceAccounting([s],rows);
});

test("missing, duplicate, moved and altered source rows fail accounting (deliberate tampers)",()=>{
  const input=sources([["window","U1/16","Fenster"]]);const rows=input.flatMap(sourceRows);
  assert.throws(()=>assertSourceAccounting(input,rows.slice(1)),/accounting/);
  assert.throws(()=>assertSourceAccounting(input,[...rows.slice(1),rows[1]!]),/accounting/);
  const altered=structuredClone(rows);altered[1]!.raw[0]="door";
  assert.throws(()=>assertSourceAccounting(input,altered),/altered/);
  const moved=structuredClone(rows);moved[1]!.locator.row=99;
  assert.throws(()=>assertSourceAccounting(input,moved),/altered/);
});

test("matching retains unit occurrences, meaning disagreements and reference conflicts",()=>{
  const report=buildVocabularyIntake(sources([["window","U1/16","Fenster"],["window","U2/1","Fenster"],["window","U1/16","Zeitfenster"],["to window","U1/16","Fenster"]]),banks,tasks,[]);
  const rows=report.rows.filter(r=>r.entry);
  assert.deepEqual(rows.map(r=>r.reconciliation!.state),["exact-text-reference-match","reference-conflict","meaning-review","unmatched"]);
  assert.equal(rows[0]!.reconciliation!.candidates.length,2);
  assert.equal(rows[0]!.reconciliation!.verifiedMeaning,false);
  assert.equal(rows[0]!.reconciliation!.firstTaught,null);
  assert.equal(report.bankCoverage.length,2);
  assert.equal(exactTextKey("  WINDOW  "),"window");
  assert.notEqual(exactTextKey("to work"),exactTextKey("work"));
  assert.notEqual(exactTextKey("wood(s)"),exactTextKey("wood"));
});

test("standalone episode references never acquire a guessed unit or automatic match",()=>{
  const input=sources();input[1]=source(2,[["window","OYW3","Fenster"]]);
  const r=buildVocabularyIntake(input,banks,tasks,[]);
  const row=r.rows.find(r=>r.entry)!;
  assert.equal(row.entry!.reference.unit,null);assert.equal(row.reconciliation!.state,"section-reference-review");
});

test("duplicates and same-spelling senses remain ambiguous instead of coalescing",()=>{
  const r=buildVocabularyIntake(sources([["window","U1/16","Fenster"],["window","U1/16","Fenster"]]),banks,tasks,[]);
  assert.ok(r.rows.filter(r=>r.entry).every(r=>r.reconciliation!.state === "ambiguous" && r.reconciliation!.duplicateRows.length === 1));
  const many=[...banks,{...banks[0]!,id:"g1u01.w.window-2",deRaw:"Zeitfenster"}];
  assert.equal(buildVocabularyIntake(sources([["window","U1/16","Fenster"]]),many,tasks,[]).rows[1]!.reconciliation!.state,"ambiguous");
});

test("bank/task integrity reports missing, renamed and orphaned tasks; duplicates fail",()=>{
  const r=buildVocabularyIntake(sources(),banks,[{...tasks[0]!,w:"door"},{id:"g1u01.w.new",slug:"g1-u01",w:"new"}],[]);
  assert.deepEqual(r.bankCoverage.map(b=>b.taskState),["headword-differs","missing-or-dropped"]);
  assert.equal(r.orphanTasks.length,1);
  assert.throws(()=>buildVocabularyIntake(sources(),[...banks,banks[0]!],tasks,[]),/duplicate bank/);
  assert.throws(()=>buildVocabularyIntake(sources(),banks,[...tasks,tasks[0]!],[]),/duplicate effective/);
  assert.throws(()=>buildVocabularyIntake([source(1,[]),source(1,[]),source(3,[]),source(4,[])],banks,tasks,[]),/four grades/);
});

test("same pinned inputs yield identical output regardless of source/bank/task enumeration",()=>{
  const input=sources([["window","U1/16","Fenster"]]);
  assert.deepEqual(buildVocabularyIntake(input,banks,tasks,[]),buildVocabularyIntake([...input].reverse(),[...banks].reverse(),[...tasks].reverse(),[]));
});

test("physical repository boundary rejects directory and file aliases, including new descendants",()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"domigo-intake-boundary-"));
  try {
    const repo=path.join(dir,"repo");fs.mkdirSync(repo);fs.symlinkSync(repo,path.join(dir,"alias"),"dir");
    fs.writeFileSync(path.join(repo,"existing.json"),"preserve");fs.symlinkSync(path.join(repo,"existing.json"),path.join(dir,"file-alias"));
    for (const out of [path.join(repo,"new.json"),path.join(dir,"alias/new/sub/report.json"),path.join(dir,"file-alias")]) assert.throws(()=>reportOutputPath(out,repo),/outside the repository/);
    assert.equal(reportOutputPath(path.join(dir,"outside/new.json"),repo),path.join(fs.realpathSync(dir),"outside/new.json"));
    assert.equal(fs.readFileSync(path.join(repo,"existing.json"),"utf8"),"preserve");
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});

test("real CLI reads synthetic DOCX, includes current corpus, verifies and detects a dropped artifact row",()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"domigo-vocabulary-intake-"));
  try {
    const word=path.join(dir,"word");fs.mkdirSync(word);
    const cell=(s:string)=>`<w:tc><w:p><w:r><w:t>${s}</w:t></w:r></w:p></w:tc>`;
    const row=(ss:string[])=>`<w:tr>${ss.map(cell).join("")}</w:tr>`;
    fs.writeFileSync(path.join(word,"document.xml"),`<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:tbl>${row(["Headword","Reference","German"])}${row(["window","U1/16","Fenster"])}</w:tbl></w:body></w:document>`);
    execFileSync("zip",["-q",path.join(dir,"appendix.docx"),"word/document.xml"],{cwd:dir});
    const manifest=path.join(dir,"inputs.json");const out=path.join(dir,"result.json");
    fs.writeFileSync(manifest,JSON.stringify([1,2,3,4].map(grade=>({grade,path:"appendix.docx"}))));
    const args=[path.join(REPO_ROOT,"packages/content-pipeline/src/content.ts"),"vocabulary-intake","--manifest",manifest,"--out",out];
    const run=(extra:string[]=[])=>spawnSync(process.execPath,[...args,...extra],{cwd:REPO_ROOT,encoding:"utf8"});
    const first=run();assert.equal(first.status,0,first.stderr);
    const data=JSON.parse(fs.readFileSync(out,"utf8"));
    assert.ok(data.counts.bankOccurrences > 0);assert.equal(new Set(data.bankCoverage.map((b:{slug:string})=>b.slug)).size,57);
    assert.equal(data.counts.accountedRows,8);assert.equal(data.studioLayers,"not-read; live coverage unverified");
    assert.ok(!fs.readFileSync(out,"utf8").includes(dir));
    assert.equal(run(["--verify"]).status,0);
    assert.notEqual(run().status,0,"must not overwrite an existing artifact");
    data.rows.splice(1,1);fs.writeFileSync(out,JSON.stringify(data,null,2)+"\n");
    const tamper=run(["--verify"]);assert.notEqual(tamper.status,0);assert.match(tamper.stderr,/intake verification failed/);
    const privateTargetDir=path.join(dir,"PRIVATE_OUTPUT_TARGET");fs.mkdirSync(privateTargetDir);
    const privateTarget=path.join(privateTargetDir,"original.docx");fs.copyFileSync(path.join(dir,"appendix.docx"),privateTarget);
    const before=fs.readFileSync(privateTarget);const alias=path.join(dir,"apparently-public-report.json");fs.symlinkSync(privateTarget,alias);
    const aliasArgs=args.map((arg,i)=>args[i-1] === "--out" ? alias : arg);
    const refused=spawnSync(process.execPath,aliasArgs,{cwd:REPO_ROOT,encoding:"utf8"});
    assert.notEqual(refused.status,0);assert.match(refused.stderr,/output already exists/);
    assert.ok(!refused.stderr.includes(privateTargetDir) && !refused.stdout.includes(privateTargetDir));
    assert.deepEqual(fs.readFileSync(privateTarget),before,"original source must be preserved");
    const privateDir=path.join(dir,"PRIVATE_SOURCE_SENTINEL");fs.mkdirSync(privateDir);
    const corrupt=path.join(privateDir,"private-name.docx");fs.writeFileSync(corrupt,"not a zip archive");
    fs.writeFileSync(manifest,JSON.stringify([1,2,3,4].map(grade=>({grade,path:corrupt}))));
    const broken=run();assert.notEqual(broken.status,0);assert.match(broken.stderr,/cannot read appendix for grade 1/);
    assert.ok(!broken.stderr.includes(privateDir) && !broken.stdout.includes(privateDir),"unzip must not forward private source paths");
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
