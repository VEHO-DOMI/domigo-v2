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
  const html=pageShell('<main><p>Which word?</p><input value=""/></main>');
  const views=entries.map((e,i)=>({publicId:`p00${i+1}`,unit:e.unit,kind:e.kind,pool:e.pool,file:`p00${i+1}.html`,htmlSha256:sha256(html)}));
  for(const v of views)fs.writeFileSync(path.join(solver,v.file),html);
  fs.writeFileSync(path.join(solver,'style.css'),'');
  fs.writeFileSync(path.join(solver,'manifest.json'),JSON.stringify({label:'CODEX DRAFT — NOT CANON',schema:'revision-solver-packet@2',basis:'basis',cssSha256:sha256(''),indexSha256:'',rendererSha256:'renderer',views,states:[],assets:[]}));
  const packet=finalizePacket(out,entries,[]);
  return {out,solver,entries,...packet};
}
const check=f=>packetErrors(f.solver,f.manifest,f.mapping,f.entries,'renderer');
function updateManifest(f){fs.writeFileSync(path.join(f.solver,'manifest.json'),JSON.stringify(f.manifest));f.mapping.packetSha256=digest(f.manifest);}
function editPage(f,edit){const v=f.manifest.views[0],file=path.join(f.solver,v.file);const html=edit(fs.readFileSync(file,'utf8'));fs.writeFileSync(file,html);v.htmlSha256=sha256(html);updateManifest(f);}

test('neutral complete packet is green, including unchanged legitimate exercise words',t=>{
  const f=fixture(t);editPage(f,s=>s.replace('Which word?','Compare book and notebook.'));assert.deepEqual(check(f),[]);
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
