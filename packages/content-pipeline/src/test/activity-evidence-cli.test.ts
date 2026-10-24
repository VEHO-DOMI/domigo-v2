import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { REPO_ROOT } from "../paths.ts";

test("real command imports and verifies sources, retains current tasks, and rejects tampered reports",()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"domigo-activity-evidence-"));
  try {
    const entries=[1,2,3,4].map(grade=>({grade,data:{alias:`source-year-${grade}`,path:`PRIVATE_SOURCE_${grade}.js`},...(grade===1?{audit:{alias:"audit-one",path:"PRIVATE_AUDIT.csv"},overrides:{alias:"override-one",path:"PRIVATE_OVERRIDE.csv"},notes:[{alias:"note-one",path:"PRIVATE_NOTE.md"}]}:{})}));
    for(const entry of entries)fs.writeFileSync(path.join(dir,entry.data.path),'window.ACTIVITY_WORDS = [\n{ unit: 1, w: "window", g: "Fenster", cat: "draw" },\n];\n');
    fs.writeFileSync(path.join(dir,"PRIVATE_AUDIT.csv"),'unit,w,g,cat,confidence,justification\n1,window,Fenster,draw,high,"Glass, in a frame."\n');
    fs.writeFileSync(path.join(dir,"PRIVATE_OVERRIDE.csv"),"unit,w,cat\n");
    fs.writeFileSync(path.join(dir,"PRIVATE_NOTE.md"),"Proposed show mode; not a decision record.");
    const manifest=path.join(dir,"PRIVATE_MANIFEST.json"),output=path.join(dir,"report.json");
    fs.writeFileSync(manifest,JSON.stringify({schema:"activity-evidence-input@1",sources:entries}));
    const cli=path.join(REPO_ROOT,"packages/content-pipeline/src/content.ts");
    const args=[cli,"activity-evidence","--manifest",manifest,"--out",output];
    const run=(extra:string[]=[],overrides:string[]=[])=>(spawnSync(process.execPath,[...overrides,...args,...extra],{cwd:REPO_ROOT,encoding:"utf8"}));
    const first=run();assert.equal(first.status,0,first.stderr);
    const text=fs.readFileSync(output,"utf8"),report=JSON.parse(text);
    assert.equal(report.schema,"activity-source-evidence@1");assert.equal(report.counts.tasks,2446);assert.equal(report.counts.classifications,2435);assert.equal(report.counts.missingClassifications,11);
    assert.equal(report.counts.sourceRows,4);assert.equal(report.corpusPins.length,60);assert.equal(report.counts.approvedMappings,0);assert.equal(report.counts.approvedTeacherDecisions,15);assert.equal(report.counts.staleTeacherDecisions,0);
    assert.equal(report.sources[0].overrides.state,"present-empty");assert.equal(report.sources[1].overrides,null);
    for(const sentinel of [dir,"PRIVATE_SOURCE_1.js","PRIVATE_AUDIT.csv","PRIVATE_OVERRIDE.csv","PRIVATE_NOTE.md","PRIVATE_MANIFEST.json","Proposed show mode"])assert.ok(!text.includes(sentinel),sentinel);
    assert.equal(run(["--verify"]).status,0);assert.match(run().stderr,/already exists/);
    for(const change of [
      (r:typeof report)=>{r.sources[0].data.rows=[];},
      (r:typeof report)=>{r.sources[0].audit.rows[0].justification="Invented rationale";},
      (r:typeof report)=>{r.tasks[0].verifiedMeaning=true;},
      (r:typeof report)=>{r.sources[0].provenance.hashMatches=true;},
      (r:typeof report)=>{r.tasks.pop();},
      (r:typeof report)=>{r.tasks.find((t:{teacherDecision:unknown})=>t.teacherDecision).teacherDecision.mode="invented";},
    ]) {const mutated=structuredClone(report);change(mutated);fs.writeFileSync(output,JSON.stringify(mutated,null,2)+"\n");assert.match(run(["--verify"]).stderr,/verification failed/);}
    fs.writeFileSync(output,text);
    const original=fs.readFileSync(path.join(dir,entries[0]!.data.path));fs.appendFileSync(path.join(dir,entries[0]!.data.path),"// a changed source version\n");
    assert.match(run(["--verify"]).stderr,/verification failed/);fs.writeFileSync(path.join(dir,entries[0]!.data.path),original);
    for(const flags of [["--verify","--verify"],["--unknown"],["--out",output]])assert.notEqual(run(flags).status,0);

    // Simulate a source/manifest/corpus revision changing after capture; never edit real corpus bytes.
    for(const [index,target] of [manifest,path.join(dir,entries[0]!.data.path),path.join(REPO_ROOT,"apps/web/lib/activity/categories.json"),path.join(REPO_ROOT,"apps/web/lib/activity/teacher-decisions.json"),path.join(REPO_ROOT,"content/overlays/item-fixes.json"),path.join(REPO_ROOT,"content/corpus/units/g1-u01/vocab.json")].entries()) {
      const hook=path.join(dir,`race-${index}.mjs`);fs.writeFileSync(hook,`import fs from "node:fs";const original=fs.readFileSync;let reads=0;fs.readFileSync=function(file,...rest){const value=original.call(this,file,...rest);if(String(file)!==${JSON.stringify(fs.realpathSync(target))}||++reads===1)return value;return typeof value==="string"?value+"\\n":Buffer.concat([value,Buffer.from("\\n")]);};`);
      const result=run(["--verify"],["--import",hook]);assert.notEqual(result.status,0,`race target ${index} must change captured bytes`);assert.match(result.stderr,/changed while reading/);
    }

    // A real CLI read with a missing author must reject, without changing repository bytes.
    const invalidTeacher=path.join(dir,"invalid-teacher.mjs"), teacherFile=path.join(REPO_ROOT,"apps/web/lib/activity/teacher-decisions.json");
    fs.writeFileSync(invalidTeacher,`import fs from "node:fs";const read=fs.readFileSync;fs.readFileSync=function(file,...rest){const value=read.call(this,file,...rest);if(String(file)!==${JSON.stringify(teacherFile)})return value;const rows=JSON.parse(value.toString());delete rows[0].decidedBy;const text=JSON.stringify(rows);return typeof value==="string"?text:Buffer.from(text);};`);
    const missingAuthor=run(["--verify"],["--import",invalidTeacher]);assert.notEqual(missingAuthor.status,0);assert.match(missingAuthor.stderr,/invalid activity evidence input/);

    // A shortcut must still name the captured target, even if replacement bytes are identical.
    for(const [index,target] of [manifest,path.join(dir,entries[0]!.data.path),path.join(dir,"PRIVATE_AUDIT.csv")].entries()) {
      const requested=path.join(dir,`shortcut-${index}${path.extname(target)}`);
      const replacement=path.join(dir,`replacement-${index}${path.extname(target)}`);
      fs.copyFileSync(target,replacement);fs.symlinkSync(target,requested);
      const modified=JSON.parse(fs.readFileSync(manifest,"utf8"));
      if(index===1)modified.sources[0].data.path=requested;
      if(index===2)modified.sources[0].audit.path=requested;
      if(index>0)fs.writeFileSync(manifest,JSON.stringify(modified));
      const hook=path.join(dir,`retarget-${index}.mjs`);
      fs.writeFileSync(hook,`import fs from "node:fs";const read=fs.readFileSync;let switched=false;fs.readFileSync=function(file,...rest){const value=read.call(this,file,...rest);if(!switched&&String(file)===${JSON.stringify(fs.realpathSync(target))}){switched=true;fs.unlinkSync(${JSON.stringify(requested)});fs.symlinkSync(${JSON.stringify(replacement)},${JSON.stringify(requested)});}return value;};`);
      const requestedManifest=index===0?requested:manifest;
      const result=spawnSync(process.execPath,["--import",hook,cli,"activity-evidence","--manifest",requestedManifest,"--out",output,"--verify"],{cwd:REPO_ROOT,encoding:"utf8"});
      assert.equal(fs.realpathSync(requested),fs.realpathSync(replacement),`shortcut ${index} was actually redirected`);
      assert.notEqual(result.status,0,`shortcut ${index} must not change target`);assert.match(result.stderr,/changed while reading/);
      fs.writeFileSync(manifest,JSON.stringify({schema:"activity-evidence-input@1",sources:entries}));
    }

    fs.symlinkSync(REPO_ROOT,path.join(dir,"repo-link"),"dir");
    const inside=spawnSync(process.execPath,[cli,"activity-evidence","--manifest",manifest,"--out",path.join(dir,"repo-link","activity-must-not-exist.json")],{cwd:REPO_ROOT,encoding:"utf8"});
    assert.notEqual(inside.status,0);assert.equal(fs.existsSync(path.join(REPO_ROOT,"activity-must-not-exist.json")),false);
    assert.ok(!inside.stderr.includes(dir));
    const before=fs.readFileSync(path.join(dir,entries[0]!.data.path));
    const collision=spawnSync(process.execPath,[cli,"activity-evidence","--manifest",manifest,"--out",path.join(dir,entries[0]!.data.path)],{cwd:REPO_ROOT,encoding:"utf8"});
    assert.notEqual(collision.status,0);assert.deepEqual(fs.readFileSync(path.join(dir,entries[0]!.data.path)),before);

    const input=JSON.parse(fs.readFileSync(manifest,"utf8"));input.approved=true;fs.writeFileSync(manifest,JSON.stringify(input));
    const forged=run(["--verify"]);assert.notEqual(forged.status,0);assert.ok(!forged.stderr.includes(manifest));delete input.approved;
    input.sources[0].data.path="PRIVATE_MISSING.js";fs.writeFileSync(manifest,JSON.stringify(input));
    const missing=run(["--verify"]);assert.notEqual(missing.status,0);assert.ok(!missing.stderr.includes("PRIVATE_MISSING"));assert.ok(!missing.stderr.includes(dir));
    input.sources=entries;fs.writeFileSync(manifest,JSON.stringify(input));
    for(const location of ["PRIVATE_SOURCE_1.js",dir,fs.realpathSync(dir),path.join(dir,"unlisted-private-note.md")]) {
      fs.writeFileSync(path.join(dir,"PRIVATE_AUDIT.csv"),`unit,w,g,cat,confidence,justification\n1,window,Fenster,draw,high,"${location.replaceAll('"','""')}"\n`);
      const leak=run(["--verify"]);assert.notEqual(leak.status,0);assert.match(leak.stderr,/contains an input location/);assert.ok(!leak.stderr.includes(location));
    }
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
