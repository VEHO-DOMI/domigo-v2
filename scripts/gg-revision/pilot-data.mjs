// CODEX DRAFT — NOT CANON. Fixtures only: nothing is written into corpus/.
import fs from 'node:fs';
import { loadUnit, loadStory, loadStoryComprehension } from '../../packages/content-loader/src/index.ts';
import { loadPaintTasksV2 } from '../../apps/web/lib/paint-content.ts';
export const selection = JSON.parse(fs.readFileSync(new URL('./pilots.json', import.meta.url), 'utf8'));
export function pilotData() {
  return selection.pilots.flatMap(pilot => {
    if (pilot.cases.length + 1 > 10) throw new Error('Pilot exceeds ten tasks including transfer');
    const unit = loadUnit(pilot.unit);
    const cases = pilot.cases.map(spec => {
      let item, context = null;
      if (spec.kind === 'paint') item = loadPaintTasksV2(spec.storyId, spec.chapter).find(i => i.id === spec.itemId);
      else if (spec.kind === 'story') {
        item = loadStoryComprehension(spec.storyId).items.find(i => i.id === spec.itemId);
        const chapter = loadStory(spec.storyId).chapters.find(c => c.scenes.some(s => s.id === spec.sceneId));
        const index = chapter.scenes.findIndex(s => s.id === spec.sceneId);
        // Original preceding scene + exact task scene; never a synopsis written by us.
        context = chapter.scenes.slice(Math.max(0,index-1), index+1).map(s => ({ id:s.id, speaker:s.speaker, textEn:s.textEn, scaffoldDe:s.scaffoldDe, glosses:s.glosses }));
      } else item = unit[spec.kind].find(i => i.id === spec.itemId);
      if (!item) throw new Error(`Missing pilot item: ${spec.itemId}`);
      return { ...spec, unit: pilot.unit, item, context };
    });
    const template = unit.grammar.find(i => i.id === pilot.transfer.templateId);
    const transfer = { ...template, id: pilot.transfer.itemId, format: pilot.unit === 'g1-u01' ? 'translation' : 'gap-fill',
      prompt: { text: pilot.transfer.prompt, lang: 'de', blanks: pilot.unit === 'g1-u01' ? 0 : 2 },
      answers: pilot.transfer.answers.map(text => ({ text, tier: 'full' })), distractors: [], pairs: [], groups: [], gloss: [],
      direction: pilot.unit === 'g1-u01' ? 'deToEn' : null,
      hintDe: 'Denk an das Beispiel darüber.', hintEn: null,
      explainDe: pilot.unit === 'g1-u01' ? "Don't speak! und Don't talk! passen beide: Sprich nicht! / Rede nicht! Do not ist die ausgeschriebene Form. Mit please wird die Bitte höflicher." : 'Does he write …? Nach does steht write ohne -s.', explainEn: null,
      presentation: { variants: [], gameMeta: null, audio: null },
      provenance: { ...template.provenance, by: 'codex', note: 'cgo-006 DRAFT fixture only; no publication' } };
    return [...cases, { itemId: transfer.id, item: transfer, unit: pilot.unit, kind: 'transfer', pair: pilot.pair, context: null }];
  });
}
