// FOURTEEN pre-answer help must not single out the key. Post-answer explanations
// are deliberately excluded. The key pin covers ALL G3 unit/story/overlay tasks,
// including presentation variants, not just the tasks imported by the overlay.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const story = read('content/corpus/stories/g3.st.fourteen/story.json');
const bound = new Set(story.chapters.flatMap(c => c.scenes.flatMap(s => s.taskSlots.map(t => t.itemId))));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.json') ? [join(dir, e.name)] : []);
export function tasks(value, result = []) {
  if (Array.isArray(value)) value.forEach(v => tasks(v, result));
  else if (value && typeof value === 'object') {
    if (/^g3u\d\d\./.test(value.id ?? '') && (value.prompt || value.w)) result.push(value);
    else Object.values(value).forEach(v => tasks(v, result));
  }
  return result;
}
const files = walk(join(root, 'content')).sort().flatMap(path => {
  const items = tasks(JSON.parse(readFileSync(path, 'utf8')));
  return items.length ? [{ path: relative(root, path), items }] : [];
});
const protectedField = /^(?:id|format|direction|strict|prompt.*|.*answers?|accept.*|distractors|pairs|groups|w|g|d|s|translation|mc)$/i;
// Preserve complete values under protected keys. Recurse into variants without
// pulling gloss/hint/explanation edits into the answer-key pin.
export function protectedFields(value) {
  if (Array.isArray(value)) return value.map(protectedFields);
  if (!value || typeof value !== 'object') return null;
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).flatMap(([key, child]) => {
    if (protectedField.test(key)) return [[key, child]];
    if (/^(?:gloss(?:es)?|hint.*|explain.*)$/.test(key)) return [];
    const nested = protectedFields(child);
    return nested && JSON.stringify(nested) !== '{}' && JSON.stringify(nested) !== '[]' ? [[key, nested]] : [];
  }));
}
const sha = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const keySnapshot = entries => entries.map(({ path, items }) => ({ path, tasks: items.length, sha256: sha(items.map(protectedFields)) }));
const norm = text => String(text).normalize('NFKC').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const contains = (help, answer) => norm(answer) && ` ${norm(help)} `.includes(` ${norm(answer)} `);
const strings = value => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
export function spoiler(item, includeHints = true) {
  // Word-help is shown for English sentence/definition answers; translation
  // directions do not show scaffold glosses (VocabItemView / ask.scaffold).
  const correct = [item.answers, item.sAnswers, item.dAnswers].flatMap(a => a ?? []).filter(a => a.tier === 'full').map(a => a.text);
  if (item.w) correct.push(item.w);
  const options = item.distractors ?? item.mc ?? [];
  const help = [...strings(item.gloss), ...strings(item.glosses), ...(includeHints ? [...strings(item.hintDe), ...strings(item.hintEn)] : [])];
  // Inspect each help entry, so listing all options elsewhere cannot disguise
  // an individual giveaway. A balanced comparison in ONE hint is permitted.
  return help.some(text => correct.some(answer => contains(text, answer)) && !(options.length && options.every(answer => contains(text, answer))));
}
export function inspect(entries) {
  return entries.flatMap(({ path, items }) => items.flatMap(item => {
    const hints = bound.has(item.id) || path.includes('/stories/g3.') || path.includes('/overlays/');
    return [item, ...(item.presentation?.variants ?? []).map(v => ({ ...item, ...v }))]
      .filter(view => spoiler(view, hints)).map(view => `${path}: ${item.id}${view.key ? ` / ${view.key}` : ''}`);
  }));
}
const pin = read('scripts/pins/g3-answer-key.json');
const failures = inspect(files);
if (JSON.stringify(keySnapshot(files)) !== JSON.stringify(pin.files)) failures.push('G3 prompt/answer/accept pin differs; review the key change, never regenerate silently.');

if (process.argv.includes('--selftest')) {
  const task = { id: 'g3u01.ci.fixture', prompt: { text: 'She ___ a channel.' }, answers: [{ text: 'has', tier: 'full' }], distractors: ['have', 'had', 'having'], gloss: [{ word: 'channel', de: 'Kanal' }] };
  const fixtures = [
    ['non-overlay answer h1', t => { t.answers[0].text = 'have'; }, 'pin'],
    ['prompt', t => { t.prompt.text = 'Another prompt'; }, 'pin'],
    ['accept', t => { t.accept = ['have']; }, 'pin'],
    ['spoiler j', t => { t.gloss[0].de = 'Kanal. Loesung: has'; }, 'spoiler'],
    ['normalized option', t => { t.gloss[0].word = ' HAS! '; }, 'spoiler'],
    ['hint giveaway', t => { t.hintDe = 'Choose has.'; }, 'spoiler'],
    ['one distractor does not balance a hint', t => { t.hintDe = 'Choose has, not have.'; }, 'spoiler'],
  ];
  for (const [name, mutate, kind] of fixtures) {
    const bad = structuredClone(task); mutate(bad);
    assert.ok(kind === 'pin' ? sha(protectedFields(bad)) !== sha(protectedFields(task)) : spoiler(bad), name);
  }
  assert.equal(spoiler(task), false);
  assert.equal(spoiler({ ...task, gloss: [{ word: 'has / have / had / having', de: 'Formen von haben' }] }), false);
  assert.equal(spoiler({ ...task, gloss: [{ word: 'phase', de: 'Phase' }], explainDe: 'The answer is has.' }), false);
  assert.equal(spoiler({ w: 'afterwards', sAnswers: [], dAnswers: [{ text: 'later', tier: 'full' }], gloss: [{ word: 'later', de: 'später' }] }), true, 'definition answer');
  assert.equal(spoiler({ w: 'afterwards', gloss: [{ word: 'afterwards', de: 'danach' }] }), true, 'vocabulary target fallback');
  const variant = structuredClone(task); variant.presentation = { variants: [{ prompt: { text: 'Different' }, answers: [{ text: 'has', tier: 'full' }] }] };
  const changed = structuredClone(variant); changed.presentation.variants[0].answers[0].text = 'have';
  assert.notEqual(sha(protectedFields(variant)), sha(protectedFields(changed)), 'variant answer pin');
  assert.deepEqual(failures, [], 'real corpus must pass too');
  console.log('check-g3-spoiler --selftest: 10 mutations red; balanced help, word boundaries and post-answer explanation green.');
} else if (failures.length) {
  console.error(`check-g3-spoiler: ${failures.length} failure(s)\n${failures.join('\n')}`); process.exitCode = 1;
} else console.log(`check-g3-spoiler: ${files.reduce((n, f) => n + f.items.length, 0)} G3 task records pinned; all G3 glosses and all FOURTEEN task hints checked.`);
