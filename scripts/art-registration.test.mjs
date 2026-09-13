// CODEX DRAFT — NOT CANON · actual importer output, not a mocked trim.
import {test} from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {PNG} from "pngjs";
import {registrationErrors} from "./art-registration.mjs";

test("four registered masks preserve canvas coordinates through the real importer; a 4px offset fails",()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"zoo-registration-"));
  try {
    const sheet=new PNG({width:2048,height:512});
    const names=["bus_base","bus_front","bus_interior","bus_roof"];
    for(let n=0;n<4;n++) for(let y=100+n*35;y<280+n*35;y++) for(let x=45+n*60;x<470-n*35;x++) {
      const i=(y*sheet.width+n*512+x)*4;
      sheet.data[i]=40+n*40;sheet.data[i+1]=80+n*20;sheet.data[i+2]=160-n*20;sheet.data[i+3]=255;
    }
    const file=path.join(dir,"sheet.png");fs.writeFileSync(file,PNG.sync.write(sheet));
    execFileSync(process.execPath,["scripts/import-codex-sheet.mjs","--sheet",file,"--cells",names.join(","),"--dest",dir,"--registration-group","bus"],{stdio:"pipe"});
    for(const [n,name] of names.entries()) {
      const out=PNG.sync.read(fs.readFileSync(path.join(dir,`${name}.png`)));
      assert.equal(out.width,512);assert.equal(out.height,512);
      for(let y=0;y<512;y++) assert.deepEqual(out.data.subarray(y*512*4,(y+1)*512*4),sheet.data.subarray((y*2048+n*512)*4,(y*2048+(n+1)*512)*4));
    }
    const metadata=JSON.parse(fs.readFileSync(path.join(dir,"bus.registration.json"),"utf8"));
    assert.deepEqual(registrationErrors(metadata),[]);
    assert.notDeepEqual(metadata[0].trim,metadata[1].trim);
    metadata[1].output.x=4;
    assert.deepEqual(registrationErrors(metadata),["bus_front: registration shifted or independently trimmed"]);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
