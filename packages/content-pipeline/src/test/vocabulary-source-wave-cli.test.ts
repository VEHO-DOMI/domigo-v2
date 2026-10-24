import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { REPO_ROOT } from "../paths.ts";
import { loadVocabularySnapshot } from "../vocabulary-intake-cli.ts";
import { buildVocabularyCases } from "../vocabulary-cases.ts";
import { fingerprint } from "../vocabulary-intake.ts";

// Synthetic originals exercise the real CLI/corpus path. In-process read hooks
// substitute only the fixed prior-sample fixture, never edit repository files.
test("source-wave CLI rebuilds and byte-verifies, rejects tampered output and changed private/corpus inputs",()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"domigo-source-wave-"));
  try {
    const cells=(row:string[])=>"<w:tr>"+row.map(t=>"<w:tc><w:p><w:r><w:t>"+t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")+"</w:t></w:r></w:p></w:tc>").join("")+"</w:tr>";
    const rows=Array.from({length:25},(_,i)=>[`fixtureword${i}`,"U1/1",`Testwort ${i}`]);
    fs.mkdirSync(path.join(dir,"word"));
    fs.writeFileSync(path.join(dir,"word/document.xml"),'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:tbl>'+["Headword,Reference,German".split(","),...rows].map(cells).join("")+"</w:tbl></w:body></w:document>");
    execFileSync("zip",["-q",path.join(dir,"appendix.docx"),"word/document.xml"],{cwd:dir});
    const manifest=path.join(dir,"appendix.json"),activity=path.join(dir,"activity.json"),out=path.join(dir,"wave.json"),review=path.join(dir,"review");
    fs.writeFileSync(manifest,JSON.stringify([1,2,3,4].map(grade=>({grade,path:"appendix.docx"}))));
    fs.writeFileSync(path.join(dir,"words.js"),'window.ACTIVITY_WORDS = [\n];\n');
    fs.writeFileSync(activity,JSON.stringify({schema:"activity-evidence-input@1",sources:[1,2,3,4].map(grade=>({grade,data:{alias:`year-${grade}`,path:"words.js"}}))}));
    const snapshot=loadVocabularySnapshot(manifest),cases=buildVocabularyCases(snapshot.intake,snapshot.evidence).cases;
    const prior={schema:"vocabulary-source-prior-sample@1",label:"CODEX DRAFT — NOT CANON",origin:"synthetic CLI fixture",sourceArtifactSha256:"0".repeat(64),cases:cases.slice(0,25).map(c=>({id:c.id,sourceFingerprint:fingerprint(c.source)}))};
    const priorTarget=path.join(REPO_ROOT,"docs/review/source-wave-prior-sample.json");
    const hook=path.join(dir,"fixture.mjs");
    const hookBase=`import fs from "node:fs";import {fileURLToPath} from "node:url";import {syncBuiltinESMExports} from "node:module";
const original=fs.readFileSync;const target=${JSON.stringify(priorTarget)};const fixture=${JSON.stringify(JSON.stringify(prior))};
fs.readFileSync=function(file,...rest){const name=file instanceof URL?fileURLToPath(file):String(file);const result=original.call(this,file,...rest);if(name===target)return typeof result==="string"?fixture:Buffer.from(fixture);return result;};syncBuiltinESMExports();\n`;
    fs.writeFileSync(hook,hookBase);
    const cli=path.join(REPO_ROOT,"packages/content-pipeline/src/content.ts");
    const run=(extra:string[]=[],output=out,extraHook?:string)=>spawnSync(process.execPath,["--import",hook,...(extraHook?["--import",extraHook]:[]),cli,"vocabulary-source-wave","--manifest",manifest,"--activity-manifest",activity,"--out",output,"--review-dir",output===out?review:output+"-review",...extra],{cwd:REPO_ROOT,encoding:"utf8",maxBuffer:1024*1024});
    const first=run();assert.equal(first.status,0,first.stderr);
    const bytes=fs.readFileSync(out,"utf8"),r=JSON.parse(bytes);assert.equal(r.counts.sourceOccurrences,100);assert.equal(r.counts.remainingOccurrences,75);assert.equal(r.counts.draftRecords,2446);
    assert.ok(!bytes.includes(dir));assert.equal(run(["--verify"]).status,0);assert.notEqual(run().status,0);
    r.counts.literalEvidenceLinks++;fs.writeFileSync(out,JSON.stringify(r,null,2)+"\n");assert.match(run(["--verify"]).stderr,/wave verification failed/);
    fs.writeFileSync(out,bytes);const derived=path.join(review,"vocabulary-index-wave-2/g1-u01.json");fs.appendFileSync(derived," ");assert.match(run(["--verify"]).stderr,/wave verification failed/);
    for(const flags of [["--verify","--verify"],["--unknown"],["--manifest",manifest]])assert.notEqual(run(flags).status,0);
    assert.notEqual(run([],path.join(REPO_ROOT,"wave-test-must-not-exist.json")).status,0);assert.ok(!fs.existsSync(path.join(REPO_ROOT,"wave-test-must-not-exist.json")));
    for(const [kind,target,after] of [["private",path.join(dir,"words.js"),2],["corpus",path.join(REPO_ROOT,"content/overlays/item-fixes.json"),2]] as const) {
      const race=path.join(dir,`race-${kind}.mjs`),raceOut=path.join(dir,`race-${kind}.json`);
      fs.writeFileSync(race,`import fs from "node:fs";import {syncBuiltinESMExports} from "node:module";const original=fs.readFileSync;let reads=0;fs.readFileSync=function(file,...rest){const result=original.call(this,file,...rest);if(String(file)===${JSON.stringify(fs.realpathSync(target))}&&++reads>${after}){const altered=result.toString()+" ";return typeof result==="string"?altered:Buffer.from(altered);}return result;};syncBuiltinESMExports();`);
      const result=run([],raceOut,race);assert.notEqual(result.status,0,`${kind} race must fail`);assert.equal(fs.existsSync(raceOut),false);assert.ok(!result.stderr.includes(dir));
    }
    fs.writeFileSync(manifest,JSON.stringify([{grade:1,path:"PRIVATE_SENTINEL_MISSING.docx"},...[2,3,4].map(grade=>({grade,path:"appendix.docx"}))]));
    const missing=run([],path.join(dir,"missing.json"));assert.notEqual(missing.status,0);assert.ok(!missing.stderr.includes("PRIVATE_SENTINEL"));assert.ok(!missing.stderr.includes(dir));
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
