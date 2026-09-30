// CODEX DRAFT — NOT CANON. Pure tests; real gate adapters are exercised separately.
import test from 'node:test';
import assert from 'node:assert/strict';
import { openFindingMap, findingRows, findingError, vocabFindingScope, claimFindingScope } from '../paint-art-claims.mjs';
const scope = vocabFindingScope('ch01', 'unit.word');
const row = (id = 'D-1', state = 'offen', binding = scope) => `| ${id} | ${state} | ${binding} | Grund | Bedingung | GG-DomiGo | Quellenprüfung |`;
test('exact open binding, missing, closed, foreign, duplicate and incomplete findings', () => {
  const text = row(), open = openFindingMap(text);
  assert.equal(findingRows(text).length, 1);
  assert.equal(findingError('D-1', scope, open), null);
  for (const changed of ['', row('D-1', 'geschlossen'), row('D-1', 'historisch: offen'), row()+'\n'+row(), row().replace('Bedingung', ''), row().replace('GG-DomiGo', ''), row().replace('Quellenprüfung', '')]) {
    assert.match(findingError('D-1', scope, openFindingMap(changed)), /Befund/);
  }
  assert.match(findingError('D-1', vocabFindingScope('ch02', 'unit.word'), open), /Befund/);
  assert.match(findingError('D-1', claimFindingScope('ch01', 'unit.word'), open), /Befund/);
  assert.match(findingError('D-2', scope, open), /Befund/);
  assert.match(findingError(undefined, scope, open), /Befund/);
});
test('calendar text and escaped pipes cannot create or close authorization', () => {
  const historicalDate = row().replace('Grund', 'Grund \\| frühere Frist 2026-10-31');
  assert.deepEqual(openFindingMap(historicalDate), openFindingMap(historicalDate.replace('2026-10-31', '2099-01-01')));
  assert.equal(findingError('D-1', scope, openFindingMap(historicalDate)), null);
  assert.match(findingError('D-1', scope, openFindingMap(row('D-1', 'geschlossen').replace('Grund', 'offen'))), /Befund/);
});
