// CODEX DRAFT — NOT CANON. Public metadata and private-map regression tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sha256, digest } from './core.mjs';
import { pageShell, finalizePacket, packetErrors } from './solver-packet.mjs';

function fixture(t) {
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'revision-packet-'));
  t.after(()=>fs.rmSync(out,{recursive:true,force:true}));
  const solver=path.join(out,'solver');fs.mkdirSync(solver);
  const entries=['pencil','book'].map(word=>({itemId:'g1u01.w.'+word,unit:'g1-u01',kind:'vocab',pool:'definition',item:{w:word},context:null}));
  const html=pageShell('<main><p>Compare book and notebook. Which word?</p><input value=""/></main>');
  const views=entries.map((e,i)=>({publicId:`p00${i+1}`,unit:e.unit,kind:e.kind,pool:e.pool,file:`p00${i+1}.html`,htmlSha256:sha256(html)}));
  for(const v of views)fs.writeFileSync(path.join(solver,v.file),html);
  fs.writeFileSync(path.join(solver,'style.css'),'');
  fs.writeFileSync(path.join(solver,'manifest.json'),JSON.stringify({label:'CODEX DRAFT — NOT CANON',schema:'revision-solver-packet@2',basis:'1'.repeat(40),cssSha256:sha256(''),indexSha256:'',rendererSha256:'2'.repeat(64),views,states:[],assets:[]}));
  const packet=finalizePacket(out,entries,[]);
  const contract={basis:'1'.repeat(40),rendererSha256:'2'.repeat(64),pages:Object.fromEntries(views.map(v=>[v.file,html]))};
  return {out,solver,entries,contract,...packet};
}
const check=f=>packetErrors(f.solver,f.manifest,f.mapping,f.entries,'2'.repeat(64),f.contract);
function updateManifest(f){fs.writeFileSync(path.join(f.solver,'manifest.json'),JSON.stringify(f.manifest));f.mapping.packetSha256=digest(f.manifest);}
function editPage(f,edit){const v=f.manifest.views[0],file=path.join(f.solver,v.file);const html=edit(fs.readFileSync(file,'utf8'));fs.writeFileSync(file,html);v.htmlSha256=sha256(html);updateManifest(f);}

test('neutral complete packet is green, including unchanged legitimate exercise words',t=>{
  const f=fixture(t);assert.deepEqual(check(f),[]);
});
test('speaking filename fails even with updated file hashes and manifest binding',t=>{
  const f=fixture(t),v=f.manifest.views[0];fs.renameSync(path.join(f.solver,v.file),path.join(f.solver,'pencil.html'));v.file='pencil.html';updateManifest(f);
  assert.ok(check(f).includes('FILES:SPEAKING_OR_UNEXPECTED_NAME'));
});
test('public source ID is forbidden, including an extra manifest field',t=>{
  const f=fixture(t);f.manifest.views[0].itemId='g1u01.w.pencil';updateManifest(f);
  assert.ok(check(f).includes('PUBLIC:SOURCE_ID manifest.json'));
});
test('target leaked through visible DOM metadata fails after hashes are updated',t=>{
  const f=fixture(t);editPage(f,s=>s.replace('<main>','<main data-answer="pencil">'));
  assert.ok(check(f).includes('PUBLIC:TARGET_IN_METADATA p001.html'));
});
test('encoded single-quoted and unquoted metadata still leak the target',t=>{
  const f=fixture(t);editPage(f,s=>s.replace('<main>',"<main data-answer='&#112;encil' title=pencil>"));
  assert.ok(check(f).includes('PUBLIC:TARGET_IN_METADATA p001.html'));
});
test('swapped private identity fails even if private packet digest is current',t=>{
  const f=fixture(t);[f.mapping.entries[0].itemId,f.mapping.entries[1].itemId]=[f.mapping.entries[1].itemId,f.mapping.entries[0].itemId];
  assert.ok(check(f).includes('MAP:IDENTITY_OR_CONTENT'));
});
test('missing private identity and stale packet are separate failures',t=>{
  const f=fixture(t);f.mapping.entries.pop();f.mapping.packetSha256='old';
  assert.ok(check(f).includes('MAP:IDENTITY_OR_CONTENT'));assert.ok(check(f).includes('MAP:STALE_PACKET'));
});
test('unexpected public file cannot hide outside the manifest',t=>{
  const f=fixture(t);fs.writeFileSync(path.join(f.solver,'private-data.json'),'{"answer":"pencil"}');
  assert.ok(check(f).some(e=>e.startsWith('FILES:UNEXPECTED:')));
});

// Independent reviewer037 regressions: rehash malicious bytes so the content
// contract, not an accidentally stale checksum, must reject each change.
test('S1: nested label.notes.p002.answer and every non-string scalar fail', t=>{
  const f=fixture(t); f.manifest.label={label:'CODEX DRAFT — NOT CANON',notes:{p002:{answer:'pencil'}}}; updateManifest(f);
  assert.ok(check(f).includes('PACKET:PUBLIC_VALUES'));
  for(const key of ['label','basis','cssSha256','indexSha256','rendererSha256']) {
    const g=fixture(t); g.manifest[key]={notes:{answer:'book'}}; updateManifest(g);
    assert.ok(check(g).includes('PACKET:PUBLIC_VALUES'),key);
  }
});
test('S1: malformed collection types fail closed instead of throwing', t=>{
  for(const value of [null,{},'answer',[null],[[]]]) for(const key of ['views','states','assets']) {
    const f=fixture(t);f.manifest[key]=value;updateManifest(f);
    assert.ok(check(f).includes('PACKET:COLLECTION_TYPES'));
  }
});
test('S2: aria-description answer and arbitrary unknown structures fail', t=>{
  for(const addition of ['aria-description="pencil"','aria-details="pencil"','data-future="pencil"','itemprop="pencil"','hidden','style="--secret:pencil"']) {
    const f=fixture(t);editPage(f,s=>s.replace('<main>',`<main ${addition}>`));
    assert.ok(check(f).includes('PUBLIC:RENDER_MISMATCH p001.html'),addition);
  }
  const f=fixture(t);editPage(f,s=>s.replace('</main>','<span>pencil</span></main>'));
  assert.ok(check(f).includes('PUBLIC:RENDER_MISMATCH p001.html'));
});
test('S2: trusted full render is mandatory; packet cannot supply its own expectation',t=>{
  const f=fixture(t);
  assert.ok(packetErrors(f.solver,f.manifest,f.mapping,f.entries,'2'.repeat(64)).includes('PUBLIC:RENDER_CONTRACT_REQUIRED'));
});
test('S3: empty speaking and neutral-looking nested directories fail without any byte change',t=>{
  for(const dir of ['p002-answer-pencil','assets/empty','unused']) {
    const f=fixture(t),pin=digest(f.manifest);fs.mkdirSync(path.join(f.solver,dir),{recursive:true});
    assert.ok(check(f).some(e=>e.startsWith('DIRECTORIES:UNEXPECTED:')));
    assert.equal(digest(f.manifest),pin);assert.equal(f.mapping.packetSha256,pin);
  }
});
test('S3: symlink cannot expand the public tree',t=>{
  const f=fixture(t);fs.symlinkSync(f.out,path.join(f.solver,'extra'));
  assert.ok(check(f).some(e=>e.startsWith('SOLVER:SYMLINK')));
});
