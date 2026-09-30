// CODEX DRAFT — NOT CANON. Built preview, no packages and no product build.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

export const sourceDir = path.dirname(fileURLToPath(import.meta.url));
export const repo = path.resolve(sourceDir, '../../..');
export const defaultOutput = path.join(tmpdir(), 'domigo-cgo-007-preview');
export async function build(out = defaultOutput) {
  const pins = JSON.parse(await readFile(path.join(sourceDir, 'source-pins.json'), 'utf8'));
  const bytes = {};
  for (const [name, md5] of Object.entries(pins.files)) {
    bytes[name] = await readFile(path.join(repo, name));
    if (createHash('md5').update(bytes[name]).digest('hex') !== md5) throw new Error(`Source differs from approved base: ${name}`);
  }
  const vocabFile = 'content/corpus/units/g1-u01/vocab.json';
  const grammarFile = 'content/corpus/units/g1-u01/grammar.json';
  const vocab = JSON.parse(bytes[vocabFile]).items.find((x) => x.id === 'g1u01.w.book');
  const grammar = JSON.parse(bytes[grammarFile]).items.find((x) => x.id === 'g1u01.gi.contractions.mc.006');
  if (!vocab || !grammar) throw new Error('Required source item missing');
  const tasks = {
    vocab: { context: vocab.d, question: 'Which word fits?', options: [vocab.mc[0], vocab.w, ...vocab.mc.slice(1)] },
    grammar: { context: 'It is a book.', question: 'Which short form means “it is”?', options: [grammar.distractors[0], grammar.distractors[1], grammar.answers[0].text, ...grammar.distractors.slice(2)] },
  };
  const answers = { vocab: vocab.dAnswers, grammar: grammar.answers };
  const explanations = {
    vocab: { correct: 'Yes, a book. You read it. It has many pages and pictures.', wrong: 'Look at the pages. You read them. Have another look at the words.' },
    grammar: { correct: 'It is becomes It’s. The apostrophe takes the place of the missing i.', wrong: 'We need a short form of it is. The apostrophe takes the place of the missing i. Try once more.' },
  };
  await mkdir(path.join(out, 'assets'), { recursive: true });
  for (const name of ['index.html', 'style.css', 'app.js']) await copyFile(path.join(sourceDir, name), path.join(out, name));
  const assets = {
    'object.png': 'apps/web/public/art/g1/paint/ch01/obj_book_a.png',
    'mentor.png': 'apps/web/public/art/g1/paint/ch01/klecks_mentor.png',
    'fredoka.woff2': 'apps/web/app/fonts/fredoka-var-latin.woff2',
    'FONT-LICENSE.md': 'apps/web/app/fonts/LICENSE.md',
  };
  for (const [target, original] of Object.entries(assets)) await writeFile(path.join(out, 'assets', target), bytes[original]);
  // Server-only source: the HTTP allowlist deliberately excludes this file.
  await writeFile(path.join(out, 'tasks.private.json'), JSON.stringify({ tasks, answers, explanations, originals: { vocab, grammar } }, null, 2));
  const manifest = { label: pins.label, base: pins.base, head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(), sourcePins: pins.files, files: {} };
  for (const name of ['index.html', 'style.css', 'app.js', ...Object.keys(assets).map((x) => 'assets/' + x)]) {
    const b = await readFile(path.join(out, name));
    manifest.files[name] = { md5: createHash('md5').update(b).digest('hex'), bytes: b.length };
  }
  await writeFile(path.join(out, 'build.json'), JSON.stringify(manifest, null, 2));
  return { out, manifest };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = process.argv.indexOf('--out');
  const { out, manifest } = await build(arg < 0 ? defaultOutput : path.resolve(process.argv[arg + 1]));
  console.log(JSON.stringify({ out, base: manifest.base, files: Object.keys(manifest.files).length, bytes: Object.values(manifest.files).reduce((n, x) => n + x.bytes, 0) }));
}
