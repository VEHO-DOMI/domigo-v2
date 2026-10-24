import assert from 'node:assert/strict';
import { it } from 'node:test';
import { createRequire } from 'node:module';
const { referenceMetadata }=createRequire(import.meta.url)('../../../../scripts/lib/visual/reference.mjs');
it('fixed-reference metadata retains SHA-256 keys and rejects duplicate pins',()=>{
  const hash='a'.repeat(64);
  const metadata=referenceMetadata(`# version: synthetic-v1\n# archive-sha256: ${hash}\n# artifact-id: 123\n# artifact-run: 456\n# compare-contract: ${hash}\n${hash}  manifest.json\n`);
  assert.deepEqual(metadata,{version:'synthetic-v1','archive-sha256':hash,'artifact-id':'123','artifact-run':'456','compare-contract':hash});
  assert.throws(()=>referenceMetadata('# artifact-id: 123\n# artifact-id: 456\n'),/REFERENCE_METADATA_DUPLICATE/);
});
