// Hand-authored source overlay; deterministic application only, never content generation.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const source = read('content/overlays/g3-fourteen-feedback.json');
const base = 'content/corpus/stories/g3.st.fourteen/';
const story = read(base + 'story.json');
const items = read(base + 'comprehension.json');
for (const edit of source.chapters ?? []) {
  const chapter = story.chapters.find((c) => c.id === edit.id);
  if (!chapter) throw new Error(`Missing chapter ${edit.id}`);
  Object.assign(chapter, edit);
}
items.items = items.items.filter((item) => !source.retiredDraftIds.includes(item.id));
const scenes = story.chapters.flatMap((c) => c.scenes);
for (const edit of source.scenes) {
  const scene = scenes.find((s) => s.id === edit.id);
  if (!scene) throw new Error(`Missing scene ${edit.id}`);
  Object.assign(scene, edit);
}
for (const binding of source.bindings) {
  const slot = scenes.find((s) => s.id === binding.sceneId)?.taskSlots.find((s) => s.slot === binding.slot);
  if (!slot) throw new Error(`Missing slot ${binding.sceneId}/${binding.slot}`);
  slot.itemId = binding.itemId; slot.variantKey = null;
}
for (const item of [...source.items, ...(source.revisedExistingItems ?? [])]) {
  const i = items.items.findIndex((x) => x.id === item.id);
  if (i < 0) items.items.push(item); else items.items[i] = item;
}
// Preserve the corpus's compact scene/field layout so review shows content changes.
const inline = (value) => {
  if (Array.isArray(value)) return '[' + value.map(inline).join(', ') + ']';
  if (value && typeof value === 'object') return '{ ' + Object.entries(value).map(([k, v]) => JSON.stringify(k) + ': ' + inline(v)).join(', ') + ' }';
  return JSON.stringify(value);
};
const format = (file, value) => {
  if (file === 'story.json') return '{\n' + Object.entries(value).map(([key, val]) => key === 'chapters'
    ? '  "chapters": [\n' + val.map(c => '    {\n' + Object.entries(c).map(([k, v]) => k === 'scenes' ? '      "scenes": [\n' + v.map(scene => '        ' + inline(scene)).join(',\n') + '\n      ]' : '      ' + JSON.stringify(k) + ': ' + inline(v)).join(',\n') + '\n    }').join(',\n') + '\n  ]'
    : '  ' + JSON.stringify(key) + ': ' + inline(val)).join(',\n') + '\n}\n';
  return '{\n  "schema": ' + JSON.stringify(value.schema) + ',\n  "storyId": ' + JSON.stringify(value.storyId) + ',\n  "items": [\n' + value.items.map(item => '    {\n' + Object.entries(item).map(([k, v]) => '      ' + JSON.stringify(k) + ': ' + inline(v)).join(',\n') + '\n    }').join(',\n') + '\n  ]\n}\n';
};
for (const [file, value] of [['story.json', story], ['comprehension.json', items]]) {
  const target = path.join(root, base, file);
  if (process.argv.includes('--check')) {
    if (JSON.stringify(read(base + file)) !== JSON.stringify(value)) throw new Error(`${file} differs from authored feedback source`);
  } else fs.writeFileSync(target, format(file, value));
}
console.log(`${process.argv.includes('--check') ? 'Verified' : 'Applied'} ${source.items.length} authored tasks and ${source.bindings.length} bindings.`);
