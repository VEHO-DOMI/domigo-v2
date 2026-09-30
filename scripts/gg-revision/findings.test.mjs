// CODEX DRAFT — NOT CANON. Against the real register and externally pinned returns.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readFindingsEvidence, findingsErrors, renderFindings } from './findings.mjs';
const root = process.env.REVISION_EVIDENCE_ROOT;
if (!root) throw new Error('REVISION_EVIDENCE_ROOT required; do not silently skip real reader evidence');
const register = JSON.parse(fs.readFileSync(new URL('../../docs/gg/revision/befunde.json', import.meta.url)));
const evidence = readFindingsEvidence(root);
test('complete real register is valid documentation but cannot grant content release', () => {
  assert.deepEqual(findingsErrors(register, evidence), []);
  assert.ok(findingsErrors(register, evidence, true).some(e => e.startsWith('CONTENT_RELEASE_BLOCKED')));
  assert.equal(fs.readFileSync(new URL('../../docs/gg/revision/BEFUNDE.md', import.meta.url), 'utf8'), renderFindings(register));
});
test('open p019 cannot be promoted by a release flag', () => {
  const changed = structuredClone(register); changed.contentRelease = true;
  changed.rows.find(r => r.publicId === 'p019').contentRelease = true;
  assert.ok(findingsErrors(changed, evidence).includes('UNRESOLVED_RELEASE:p019'));
});
test('a foreign packet cannot inherit these reader verdicts', () => {
  const changed = structuredClone(register); changed.reviewedPacketSha256 = '0'.repeat(64);
  assert.ok(findingsErrors(changed, evidence).includes('FOREIGN_PACKET_OR_HEAD'));
});
test('omitting an unaccepted candidate fails even if preferred answer remains', () => {
  const changed = structuredClone(register); changed.rows.find(r => r.publicId === 'p003').readers.A.pop();
  assert.ok(findingsErrors(changed, evidence).includes('CANDIDATE_OMITTED_OR_CHANGED:p003:A'));
});
test('missing row and relabelled reader No cannot pass', () => {
  const changed = structuredClone(register); changed.rows.pop(); changed.readerVerdicts.B = 'yes';
  const errors = findingsErrors(changed, evidence);
  assert.ok(errors.includes('MISSING: p020')); assert.ok(errors.includes('HISTORICAL_NO_MUST_REMAIN'));
});
