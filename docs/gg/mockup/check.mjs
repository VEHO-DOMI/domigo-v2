// CODEX DRAFT — NOT CANON. Bounded source/HTTP checks; no production battery.
import assert from 'node:assert/strict';
import { readFile, mkdtemp } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { build, repo, sourceDir } from './build.mjs';

const pos = process.argv.indexOf('--out');
const out = pos < 0 ? await mkdtemp(path.join(tmpdir(), 'cgo-007-check-')) : path.resolve(process.argv[pos + 1]);
if (!process.argv.includes('--no-build')) await build(out);
const actual = JSON.parse(await readFile(path.join(out, 'tasks.private.json'), 'utf8'));
const original = async (name, id) => JSON.parse(await readFile(path.join(repo, `content/corpus/units/g1-u01/${name}.json`), 'utf8')).items.find((x) => x.id === id);
const vocab = await original('vocab', 'g1u01.w.book');
const grammar = await original('grammar', 'g1u01.gi.contractions.mc.006');
assert.deepEqual(actual.originals, { vocab, grammar }, 'Quelltreue: vollständige Originalitems');
assert.deepEqual(actual.answers, { vocab: vocab.dAnswers, grammar: grammar.answers }, 'Quelltreue: unveränderte vollständige Schlüssel');
assert.equal(actual.tasks.vocab.context, vocab.d, 'Definition wortgetreu');
assert.deepEqual([...actual.tasks.vocab.options].sort(), [vocab.w, ...vocab.mc].sort(), 'Alle vier Vokabeloptionen');
assert.deepEqual([...actual.tasks.grammar.options].sort(), [...grammar.answers.map((x) => x.text), ...grammar.distractors].sort(), 'Alle vier Grammatikoptionen');
const port = Number(process.env.MOCKUP_CHECK_PORT || 4178);
const server = spawn(process.execPath, [path.join(sourceDir, 'serve.mjs'), '--no-build', '--out', out, '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
const base = `http://127.0.0.1:${port}`;
try {
  await Promise.race([once(server.stdout, 'data'), once(server, 'exit').then(() => { throw new Error('Preview failed to start'); })]);
  const response = await fetch(base + '/api/tasks');
  assert.equal(response.status, 200);
  const publicTasks = await response.json();
  assert.deepEqual(publicTasks, actual.tasks);
  assert.ok(!/"(answers|correct|explanation|originals)"/.test(JSON.stringify(publicTasks)), 'Keine Schlüsselmarkierung im Lösermaterial');
  let graded = 0;
  for (const [name, item] of Object.entries(publicTasks)) {
    const key = name === 'vocab' ? vocab.dAnswers : grammar.answers;
    for (const choice of item.options) {
      const r = await fetch(base + '/api/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task: name, choice }) });
      assert.equal(r.status, 200);
      assert.equal((await r.json()).correct, key.some((x) => x.text === choice && x.tier === 'full'), `${name}: ${choice}`);
      graded++;
    }
  }
  for (const file of ['/tasks.private.json', '/source-pins.json', '/content/corpus/units/g1-u01/grammar.json']) assert.equal((await fetch(base + file)).status, 404, `Private file ${file}`);
  const alien = await fetch(base + '/api/answer', { method: 'POST', headers: { Origin: 'https://example.invalid' }, body: '{}' });
  assert.equal(alien.status, 403, 'Fremde Herkunft');
  const bad = await fetch(base + '/api/answer', { method: 'POST', body: JSON.stringify({ task: 'grammar', choice: 'invalid' }) });
  assert.equal(bad.status, 400, 'Ungültige Auswahl');
  const version = await (await fetch(base + '/api/version')).json();
  assert.equal(version.head, execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(), 'Bau gehört zum aktuellen Kopf');
  const manifest = version.files;
  assert.deepEqual(Object.keys(manifest).sort(), ['index.html', 'style.css', 'app.js', 'assets/object.png', 'assets/mentor.png', 'assets/fredoka.woff2', 'assets/FONT-LICENSE.md'].sort(), 'Vollständige Auslieferung');
  for (const [file, info] of Object.entries(manifest)) {
    const response = await fetch(base + '/' + file);
    assert.equal(response.status, 200, `Built file ${file}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.length, info.bytes, `Delivered size ${file}`);
    assert.equal(createHash('md5').update(bytes).digest('hex'), info.md5, `Delivered fingerprint ${file}`);
  }
  console.log(JSON.stringify({ verdict: 'PASS', originalItems: 2, gradedChoices: graded, privateFilesDenied: 3, invalidRequestsDenied: 2, deliveredFiles: Object.keys(manifest).length, out }));
} finally {
  server.kill('SIGTERM');
  await once(server, 'exit');
}
