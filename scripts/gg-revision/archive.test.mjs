// CODEX DRAFT — NOT CANON. Tiny archive fixtures, not a new solver export.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('S3: directory and ZIP membership remain separate checks for both declared layouts',t=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'revision-archive-'));t.after(()=>fs.rmSync(out,{recursive:true,force:true}));
  const solver=path.join(out,'solver');fs.mkdirSync(solver);fs.writeFileSync(path.join(solver,'index.html'),'fixture');
  for(const layout of ['solver','flat']) {
    const archive=path.join(out,layout+'.zip');
    const make=extra=>{
      const r=spawnSync('python3',['-c',"import sys,zipfile; z=zipfile.ZipFile(sys.argv[1],'w'); z.writestr(sys.argv[2]+'index.html','fixture'); z.writestr(sys.argv[2]+'answer-pencil/',b'') if sys.argv[3]=='extra' else None; z.close()",archive,layout==='solver'?'solver/':'',extra],{encoding:'utf8'});
      assert.equal(r.status,0,r.stderr);
    };
    const check=()=>spawnSync('python3',[path.join(import.meta.dirname,'check-archive.py'),solver,archive,'--layout',layout],{encoding:'utf8'});
    make('clean');assert.equal(check().status,0);
    const pin=fs.readFileSync(archive);
    fs.mkdirSync(path.join(solver,'answer-pencil'));let r=check();assert.equal(r.status,1);assert.ok(r.stderr.includes('DIRECTORY:MEMBERSHIP'));
    assert.deepEqual(fs.readFileSync(archive),pin);fs.rmdirSync(path.join(solver,'answer-pencil'));
    make('extra');r=check();assert.equal(r.status,1);assert.ok(r.stderr.includes('ARCHIVE:MEMBERSHIP'));
  }
});
