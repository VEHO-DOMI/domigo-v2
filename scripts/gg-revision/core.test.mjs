// CODEX DRAFT — NOT CANON. In-memory sabotage; no corpus mutation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeBinding, checkBinding, compareIds, approvalErrors, rankingStatus, solverHtmlErrors, digest } from './core.mjs';

const fixture = () => ({ itemId: 'fixture', source: { path: 'book', sha256: 'a' }, content: { question: 'A ___' }, answers: { carrier: ['book'], deToEn: ['book'] }, views: [{ mode: 'carrier', html: '<p>A ___</p><input value=""/>' }], renderer: { sha: 'r' } });
test('source fingerprint, answer pool and injected answer each invalidate their binding', () => {
  const original = fixture(), frozen = makeBinding(original);
  for (const [field, mutate] of [
    ['sourceSha256', x => { x.source.sha256 = 'b'; }],
    ['answersSha256', x => { x.answers.deToEn = ['pen']; }],
    ['viewsSha256', x => { x.views[0].html += '<p>Answer: book</p>'; }],
  ]) {
    const changed = structuredClone(original); mutate(changed);
    assert.ok(checkBinding(frozen, makeBinding(changed)).includes(`DRIFT:${field}`));
    assert.equal(rankingStatus(frozen, makeBinding(changed)), 'unranked');
  }
});
test('missing and substituted items, duplicates, missing sources and stale verdicts fail', () => {
  assert.deepEqual(compareIds(['a','b'], ['a','b']), []);
  for (const ids of [['a'], ['a','c'], ['a','a']]) assert.ok(compareIds(['a','b'], ids).length);
  const binding = makeBinding(fixture());
  const seal = { state: 'draft', author: 'author', binding, solvers: [1,2].map(n => ({ session: `reader${n}`, verdict: 'yes', bindingSha256: digest(binding) })), kokiVerdict: { verdict: 'yes', bindingSha256: digest(binding) } };
  assert.deepEqual(approvalErrors(seal, binding, true), []);
  assert.ok(approvalErrors(seal, binding, false).includes('SOURCE:UNVERIFIZIERT'));
  assert.ok(approvalErrors({ ...seal, solvers: [] }, binding, true).length);
  const changed = makeBinding({ ...fixture(), answers: ['new'] });
  assert.ok(approvalErrors(seal, changed, true).includes('READERS:INVALID_OR_STALE'));
});
test('solver export rejects hidden key payloads and prefilled inputs', () => {
  assert.deepEqual(solverHtmlErrors('<p>Which word?</p><input value=""/>'), []);
  for (const html of ['<script>{"sAnswers":["book"]}</script>', '<input value="book"/>', '<p onclick="x()">Hi</p>']) assert.ok(solverHtmlErrors(html).length);
});
