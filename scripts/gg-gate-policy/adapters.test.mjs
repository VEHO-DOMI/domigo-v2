// CODEX DRAFT — NOT CANON. Real CLI probes; run only in an owned checkout,
// after installation and with the program's heavy-test slot. Restores exact bytes.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { openFindingMap, findingRows, vocabFindingScope } from '../paint-art-claims.mjs';
const root = process.cwd();
const out = process.env.GG_GATE_EVIDENCE_DIR ?? fs.mkdtempSync(path.join(os.tmpdir(), 'cgo-017-adapters-'));
if (path.resolve(out).startsWith(root + path.sep)) throw new Error('Evidence must be outside product repo');
fs.mkdirSync(out, { recursive: true });
const runs = [];
function run(name, script, date = '2026-09-30', extra = []) {
  const result = spawnSync(process.execPath, ['--import', './scripts/gg-gate-policy/clock.mjs', script, ...extra], {
    cwd: root, env: { ...process.env, GG_GATE_TEST_DATE: date }, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024,
  });
  fs.writeFileSync(path.join(out, `${name}.log`), result.stdout + result.stderr);
  runs.push({ name, script, date, args: extra, exit: result.status, signal: result.signal });
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(runs, null, 2)+'\n');
  assert.equal(result.signal, null, `${name} was interrupted`);
  return result;
}
function red(name, script, pattern) {
  const r = run(name, script); assert.notEqual(r.status, 0, `${name} stayed green`);
  assert.match(r.stdout + r.stderr, pattern, `${name} failed for the wrong reason`);
}
const register = 'docs/design/g1/paint/DEBT_REGISTER.md';
const originals = new Map([[register, fs.readFileSync(register)]]);
const save = file => { if (!originals.has(file)) originals.set(file, fs.readFileSync(file)); };
const restore = () => { for (const [file, bytes] of originals) fs.writeFileSync(file, bytes); };
const registerText = originals.get(register).toString('utf8'), findings = findingRows(registerText);
const vocabulary = findings.find(r => r.status === 'offen' && r.scope.includes('ch01.policy.json#/vocabLedger/'));
const claim = findings.find(r => r.status === 'offen' && r.scope.includes('/claims.json#/claims/'));
assert(vocabulary && claim, 'real source witnesses required');
const [policyFile, pointer] = vocabulary.scope.split('#/vocabLedger/');
const [claimFile, claimKey] = claim.scope.split('#/claims/');
save(policyFile); save(claimFile);
const policy = () => JSON.parse(originals.get(policyFile));
const changePolicy = fn => { const p = policy(); fn(p); fs.writeFileSync(policyFile, JSON.stringify(p, null, 2)+'\n'); };
try {
  if (process.argv.includes('--focused')) {
    for (const script of ['check-registers', 'check-game-tasks']) {
      assert.equal(run(`${script}-focused-control`, `scripts/${script}.mjs`).status, 0, `${script} focused control red`);
    }
  }
  for (const script of (process.argv.includes('--focused') ? [] : ['check-game-tasks', 'check-level-design', 'check-paint-art', 'check-ground-plane', 'check-registers'])) {
    const now = run(`${script}-today`, `scripts/${script}.mjs`);
    const future = run(`${script}-2099`, `scripts/${script}.mjs`, '2099-01-01');
    assert.equal(now.status, 0, `${script} current baseline red`);
    assert.equal(future.status, now.status, `${script} calendar changed exit`);
    assert.equal(future.stdout, now.stdout, `${script} calendar changed stdout`);
    assert.equal(future.stderr, now.stderr, `${script} calendar changed stderr`);
  }
  // cgo-080: the real callers must reject each placeholder evidence cell.
  const witnessLine = registerText.split('\n')[vocabulary.line - 1];
  for (const [variant, placeholder] of [['plain', 'x'], ['bold', '**TODO**'], ['punctuated', 'TODO.'], ['html-bold', '<b>TODO</b>'], ['html-em', '<em>TODO</em>'], ['link', '[TODO](#pending)'], ['combined', 'TODO / TBD'], ['nested-reference', '[TODO [TBD]][pending]'], ['escaped-reference', String.raw`[TODO][pending\]tail]`]]) for (const [name, index] of [['reason', 4], ['resolution', 5], ['owner', 6], ['proof', 7]]) {
    const cells = witnessLine.split(/(?<!\\)\|/);
    assert.equal(cells.length, 9, 'seven-column register witness required');
    cells[index] = ` ${placeholder} `;
    const referenceDefinition = variant === 'nested-reference' ? '\n\n[pending]: #pending\n'
      : variant === 'escaped-reference' ? '\n\n' + String.raw`[pending\]tail]: #pending` + '\n' : '';
    fs.writeFileSync(register, registerText.replace(witnessLine, cells.join('|')) + referenceDefinition);
    red(`register-placeholder-${name}-${variant}`, 'scripts/check-registers.mjs', /Befund/);
    red(`ledger-placeholder-${name}-${variant}`, 'scripts/check-game-tasks.mjs', /17e.*finding/);
    restore();
  }
  changePolicy(p => { p.vocabLedger[pointer].offen = 'D-0'; });
  red('ledger-unknown', 'scripts/check-game-tasks.mjs', /17e.*finding/);
  red('register-unknown', 'scripts/check-registers.mjs', /Befund D-0/); restore();
  changePolicy(p => { p.vocabLedger[pointer].offen = findings.find(r => r.id !== vocabulary.id).id; });
  red('ledger-foreign', 'scripts/check-game-tasks.mjs', /17e.*finding/); restore();
  fs.writeFileSync(register, registerText.replace(`| ${vocabulary.id} | offen |`, `| ${vocabulary.id} | geschlossen |`));
  red('ledger-closed', 'scripts/check-game-tasks.mjs', /17e.*finding/); restore();
  fs.writeFileSync(register, registerText.split('\n').filter(l => !l.startsWith(`| ${vocabulary.id} |`)).join('\n'));
  red('ledger-missing', 'scripts/check-game-tasks.mjs', /17e.*finding/); restore();
  const claims = JSON.parse(originals.get(claimFile)); claims.claims[claimKey].exception.offen = vocabulary.id;
  fs.writeFileSync(claimFile, JSON.stringify(claims, null, 2)+'\n');
  red('claim-foreign', 'scripts/check-level-design.mjs', /Befund/); restore();
  fs.writeFileSync(register, registerText.replace(`| ${claim.id} | offen |`, `| ${claim.id} | geschlossen |`));
  red('claim-closed', 'scripts/check-level-design.mjs', /Befund/); restore();
  // Correctly bound but no longer needed: derive an actually answered word.
  const chapter = policy().chapter;
  const tasks = JSON.parse(fs.readFileSync(policyFile.replace('.policy.json', '.tasks.v2.json'), 'utf8')).items;
  const answered = tasks.filter(t => ['encounter','quickfire','door','rescue','pickupset'].includes(t.use)).flatMap(t => t.exercises ?? []).find(id => /\.w\./.test(id) && !policy().vocabLedger[id]);
  assert(answered, 'actual answered word required');
  const freeId = `D-${1 + Math.max(...[...registerText.matchAll(/^\| (?:~~)?D-(\d+)/gm)].map(m => Number(m[1])))}`;
  changePolicy(p => { p.vocabLedger[answered] = { cards: 'exempt', reason: 'test only: already answered', offen: freeId }; });
  fs.writeFileSync(register, registerText + `\n| ${freeId} | offen | ${vocabFindingScope(chapter, answered)} | Synthetischer bereits beantworteter Fall | Ausnahme nach Antwort entfernen | Testteam | Direkter Torlauf prüft den Fall |\n`);
  assert.equal(openFindingMap(fs.readFileSync(register,'utf8')).get(freeId), vocabFindingScope(chapter, answered));
  red('ledger-unnecessary', 'scripts/check-game-tasks.mjs', /17c.*still declares/); restore();
  changePolicy(p => { delete p.vocabLedger[pointer]; });
  red('register-omitted-entry', 'scripts/check-registers.mjs', /offener Befund ohne passende/); restore();
  assert.equal(run('restored-register', 'scripts/check-registers.mjs').status, 0);
} finally {
  restore();
  for (const [file, bytes] of originals) assert(fs.readFileSync(file).equals(bytes), `${file} not restored`);
}
console.log(`Adapter probes passed: ${runs.length} real gate calls; exact original bytes restored. Evidence: ${out}`);
