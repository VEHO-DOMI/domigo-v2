import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
export function freezeSources(root, files) {
  return files.map(file => ({path:file,sha256:createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')}));
}
export function verifySources(root, snapshot) {
  assert.deepEqual(freezeSources(root,snapshot.map(file=>file.path)),snapshot,'Examined source changed during the run');
}
if(process.argv.includes('--selftest')) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'source-snapshot-'));
  fs.writeFileSync(path.join(dir,'fixture.ts'),'export const value=1;');
  const frozen=freezeSources(dir,['fixture.ts']);verifySources(dir,frozen);
  fs.writeFileSync(path.join(dir,'fixture.ts'),'export const value=2;');
  assert.throws(()=>verifySources(dir,frozen),/Examined source changed/);
  console.log('KILLED source-change: one changed source byte invalidates the run');
}
