// Existing reference --selftest jobs also exercise the fixture calendar.
import './fixture-clock.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function referenceMetadata(text) {
  const metadata={};
  for(const match of text.matchAll(/^# ([a-z0-9-]+): (.+)$/gm)) {
    assert(!Object.hasOwn(metadata,match[1]),'REFERENCE_METADATA_DUPLICATE');
    metadata[match[1]]=match[2];
  }
  return metadata;
}
export function visualContract(root) {
  return sha256(Buffer.concat(['apps/web/e2e/visual-contract.ts','apps/web/e2e/visual.spec.ts','apps/web/playwright.config.ts','scripts/lib/visual/assignment-target.mjs'].map(f=>fs.readFileSync(path.join(root,f)))));
}
export function verifyReference(baseline,indexFile,contract) {
  const text=fs.readFileSync(indexFile,'utf8'), metadata=referenceMetadata(text);
  assert(metadata.version && /^[a-f0-9]{64}$/.test(metadata['capture-contract']??''),'REFERENCE_METADATA');
  assert.equal(metadata['compare-contract'],contract,'REFERENCE_COMPARE_CONTRACT');
  const entries=text.split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>{const m=l.match(/^([a-f0-9]{64})  (.+)$/);assert(m,'REFERENCE_INDEX_FORMAT');return {hash:m[1],file:m[2]};});
  const expected=[360,1280].flatMap(w=>['light','dark'].flatMap(t=>[...['home','practice','learn','review','assignments'].flatMap(route=>[1,2,3,4].map(g=>`${w}-${t}/${route}-g${g}.png`)),...['admin','signin','game'].map(route=>`${w}-${t}/${route}.png`)]));
  assert.deepEqual(entries.map(e=>e.file).sort(),[...expected,'manifest.json'].sort(),'REFERENCE_MATRIX');
  for(const e of entries){
    const file=path.join(baseline,e.file);
    // Disallow symlinked directories as well as symlinked files.
    for(let p=file;p!==path.dirname(path.resolve(baseline));p=path.dirname(p))assert(!fs.lstatSync(p).isSymbolicLink(),'REFERENCE_SYMLINK');
    assert(fs.statSync(file).isFile(),'REFERENCE_FILE');
    assert.equal(sha256(fs.readFileSync(file)),e.hash,'REFERENCE_HASH:'+e.file);
  }
  const actual=fs.readdirSync(baseline,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.png')).map(e=>path.relative(baseline,path.join(e.parentPath,e.name))).sort();
  assert.deepEqual(actual,expected.sort(),'REFERENCE_EXTRA_OR_MISSING');
  const manifest=JSON.parse(fs.readFileSync(path.join(baseline,'manifest.json'),'utf8'));
  assert.equal(manifest.environment.contract,metadata['capture-contract'],'REFERENCE_CAPTURE_CONTRACT');
  assert.deepEqual(manifest.files.map(f=>f.path).sort(),expected.sort(),'REFERENCE_MANIFEST_MATRIX');
  for(const f of manifest.files)assert.equal(f.sha256,entries.find(e=>e.file===f.path)?.hash,'REFERENCE_MANIFEST_HASH');
  return manifest;
}
