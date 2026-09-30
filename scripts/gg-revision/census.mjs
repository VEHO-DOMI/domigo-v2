// CODEX DRAFT — NOT CANON · cgo-006. Read-only runtime census, external outputs.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadUnit, loadWordbank, loadUnitStructures, listApprovedUnits, loadStory, loadStoryComprehension, loadListening, loadTest, loadReleasedChapters } from '../../packages/content-loader/src/index.ts';
import { readUnitItems, applyItemFixes } from '../../packages/content-pipeline/src/gen-items.ts';
import { corpusStamp } from '../../packages/content-pipeline/src/corpus-stamp.ts';
import { SKIPPED_FORMATS } from '../../packages/content-pipeline/src/blind-solve.ts';
import { VocabItemView, GrammarItemView, VOCAB_POOLS } from '../../packages/task-ui/src/index.tsx';
import { vocabAnswers } from '../../packages/engine/src/index.ts';
import { loadPaintTasksV2 } from '../../apps/web/lib/paint-content.ts';
import { resolvePaintArt } from '../../apps/web/lib/paint-art.ts';
import { CardHost } from '../../packages/game-paint/src/cards/CardHost.tsx';
import { digest, sha256, makeBinding, compareIds } from './core.mjs';

export const ROOT = path.resolve(import.meta.dirname, '../..');
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const fileHash = p => sha256(fs.readFileSync(path.join(ROOT, p)));
export function outside(file) {
  const out = path.resolve(file);
  if (out === ROOT || out.startsWith(ROOT + path.sep)) throw new Error('Output must be outside product repo');
  return out;
}
const basename = p => path.basename(p).replace(/\.(docx|txt)$/, '').trim();
const counts = rows => Object.fromEntries([...new Set(rows)].sort().map(k => [k, rows.filter(x => x === k).length]));
export function rendererFingerprint() {
  const files = execFileSync('git', ['ls-files', 'packages/task-ui', 'packages/game-feel', 'packages/engine', 'packages/content-loader', 'packages/content-schema', 'packages/game-paint/src', 'apps/web/lib/paint-content.ts', 'apps/web/lib/paint-art.ts', 'apps/web/lib/paint-art-manifest.json', 'apps/web/app/globals.css', 'pnpm-lock.yaml'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n')
    .filter(p => /\.(ts|tsx|css|json|yaml)$/.test(p) && !p.includes('.test.'));
  // The isolation wrapper and its compilation adapter are part of the view too.
  for (const file of fs.readdirSync(path.join(ROOT,'scripts/gg-revision')).filter(f => /\.(mjs|tsx|json)$/.test(f))) files.push('scripts/gg-revision/'+file);
  return [...new Set(files)].sort().map(file => ({ file, sha256: fileHash(file) }));
}
export function unitHtml(kind, item, pool = 'carrier', tactile = true) {
  return renderToStaticMarkup(createElement(kind === 'vocab' ? VocabItemView : GrammarItemView, { item, pool, tactile }));
}
export function paintArt(chapter) {
  const cwd = process.cwd();
  try { process.chdir(path.join(ROOT, 'apps/web')); return resolvePaintArt(chapter); }
  finally { process.chdir(cwd); }
}
export function paintHtml(item, chapter) {
  return renderToStaticMarkup(createElement(CardHost, { task: item, art: paintArt(chapter), clockMs: 0, onResolve() {}, onDismiss() {} }));
}
function sourceRef(ref, grade, sources) {
  if (!ref) return { ref: null, status: 'UNVERIFIZIERT', reason: 'no item-level source reference' };
  const local = `content/build/transcripts/${ref.split('#')[0]}`;
  const role = ref.includes('/wb/') ? 'wb-transcript' : 'sb-transcript';
  const original = sources.filter(s => s.grade === grade && s.role === role && basename(s.relPath) === basename(ref.split('#')[0]));
  return { ref, transcript: local, transcriptSha256: fs.existsSync(path.join(ROOT, local)) ? fileHash(local) : null,
    originals: original,
    status: original.length === 1 && original[0].status === 'BYTES_CONFIRMED' && fs.existsSync(path.join(ROOT, local)) ? 'SOURCE_FILE_PRESENT' : 'UNVERIFIZIERT',
    semanticVerdict: 'UNVERIFIZIERT: source bytes are not an item-level judgement' };
}
export function collect(sourceFile) {
  const sources = JSON.parse(fs.readFileSync(sourceFile, 'utf8')).sources;
  const renderer = rendererFingerprint(), rendererSha256 = digest(renderer);
  const slugs = fs.readdirSync(path.join(ROOT, 'content/corpus/units')).filter(s => /^g[1-4]-u\d{2}$/.test(s)).sort();
  const approved = listApprovedUnits(), approvedSet = new Set(approved);
  const unitRows = [], paintRows = [], storyRows = [], auxiliary = [], agreements = [];
  const stamp = corpusStamp();
  for (const slug of slugs) {
    const unit = loadUnit(slug), pipeline = applyItemFixes(slug, readUnitItems(slug));
    for (const kind of ['vocab', 'grammar']) {
      const errors = compareIds(unit[kind].map(i => i.id), pipeline[kind].map(i => i.id));
      if (errors.length || digest(unit[kind]) !== digest(pipeline[kind])) throw new Error(`Runtime/pipeline disagreement: ${slug}/${kind}: ${errors.join(';')}`);
    }
    agreements.push(slug);
    const grade = Number(slug[1]), wordbank = loadWordbank(slug);
    const statePath = `content/corpus/units/${slug}/state.json`;
    const auditPath = `content/build/audit/blind-solve/g${grade}.dry.json`;
    const oldAudit = read(auditPath);
    const priorEvidence = { unitStatePath: statePath, unitStateSha256: fileHash(statePath), lastState: read(statePath).transitions.at(-1),
      auditPath, auditSha256: fileHash(auditPath), auditCorpusHash: oldAudit.corpusHash, currentCorpusHash: stamp,
      auditFresh: oldAudit.corpusHash === stamp, auditKind: 'KEY_SELF_CHECK_NOT_BLIND_VERDICT' };
    for (const kind of ['vocab', 'grammar']) for (const item of unit[kind]) {
      let source;
      if (kind === 'vocab') {
        const originals = sources.filter(s => s.grade === grade && s.role === 'master-list' && s.sha256 === wordbank.source.sha256);
        const entries = wordbank.entries.filter(e => e.id === item.id || e.en === item.w || e.forms.includes(item.w));
        source = { wordbank: `content/corpus/units/${slug}/wordbank.json`, wordbankSha256: fileHash(`content/corpus/units/${slug}/wordbank.json`),
          entryIds: entries.map(e => e.id), originals, carrierClaim: item.sSource, explicitRef: item.provenance.sbRef,
          status: originals.length === 1 && entries.length > 0 ? 'WORD_SOURCE_PRESENT' : 'UNVERIFIZIERT', semanticVerdict: 'UNVERIFIZIERT: carrier and answer variants require source reading' };
      } else {
        source = sourceRef(item.provenance.sbRef, grade, sources);
        source.structureCandidates = (loadUnitStructures(slug).find(s => s.id === item.structureId)?.sbRefs ?? []).map(ref => sourceRef(ref, grade, sources));
        // An inherited structure reference is a candidate, never an invented item citation.
        if (source.status === 'UNVERIFIZIERT' && source.structureCandidates.some(s => s.status === 'SOURCE_FILE_PRESENT')) source.status = 'STRUCTURE_SOURCE_CANDIDATE';
      }
      const views = (kind === 'vocab' ? VOCAB_POOLS : ['grammar']).map(mode => ({ key: `${item.id}#${mode}`, mode, scope: 'practice-initial', htmlSha256: sha256(unitHtml(kind, item, mode)) }));
      if (kind === 'grammar' && ['anagram','sentence-building'].includes(item.format)) views.push({ key: `${item.id}#type-instead`, mode: 'type-instead', scope: 'practice-alternate', htmlSha256: sha256(unitHtml(kind, item, 'carrier', false)) });
      for (const v of item.presentation.variants) {
        const variant = kind === 'vocab' ? { ...item, s: v.prompt.text, gloss: v.glosses } : { ...item, prompt: { ...item.prompt, text: v.prompt.text }, gloss: v.glosses };
        views.push({ key: `${item.id}#${v.key}`, mode: v.key, scope: 'authored-story-variant-isolated', htmlSha256: sha256(unitHtml(kind, variant)), contextStatus: 'SCENE_REQUIRED_BEFORE_RELEASE' });
      }
      const answers = kind === 'vocab' ? Object.fromEntries(VOCAB_POOLS.map(pool => [pool, vocabAnswers(item, pool)])) : { answers: item.answers, distractors: item.distractors, pairs: item.pairs, groups: item.groups };
      const binding = makeBinding({ itemId: item.id, source, content: item, answers, views, renderer: rendererSha256 });
      unitRows.push({ itemId: item.id, unit: slug, grade, kind, format: kind === 'vocab' ? 'vocab' : item.format,
        learningGoal: kind === 'vocab' ? item.w : item.structureId, corpusPath: `content/corpus/units/${slug}/${kind}.json`, approvedUnit: approvedSet.has(slug), source,
        contentSha256: binding.contentSha256, answersSha256: binding.answersSha256, views, viewSha256: binding.viewsSha256, binding,
        previousEvidence: priorEvidence, oldBlindSolve: kind === 'vocab' ? 'carrier-only' : SKIPPED_FORMATS.has(item.format) ? 'SKIPPED' : 'text-or-choice',
        revisionStatus: 'UNVERIFIZIERT' });
    }
    for (const [mode, loader] of [['listening',loadListening],['test',loadTest]]) {
      const content = loader(slug);
      if (content) auxiliary.push({ unit: slug, mode, file: `content/corpus/units/${slug}/${mode}.json`, contentSha256: digest(content), viewStatus: 'UNVERIFIZIERT: separate whole-sheet/audio review required' });
    }
  }
  const stories = fs.readdirSync(path.join(ROOT, 'content/corpus/stories')).filter(s => /^g[1-4]\.st\./.test(s)).sort();
  for (const storyId of stories) {
    const story = loadStory(storyId), comprehension = loadStoryComprehension(storyId);
    for (const chapter of story?.chapters ?? []) for (const scene of chapter.scenes) for (const slot of scene.taskSlots) {
      storyRows.push({ storyId, chapterId: chapter.id, unit: `g${story.grade}-u${String(chapter.unit).padStart(2,'0')}`, sceneId: scene.id,
        itemId: slot.itemId, slot: slot.slot, variantKey: slot.variantKey, sceneSha256: digest(scene),
        releasedChapter: loadReleasedChapters(storyId).includes(chapter.id),
        contentSha256: digest(comprehension?.items.find(i => i.id === slot.itemId) ?? unitRows.find(i => i.itemId === slot.itemId)?.binding ?? null),
        viewStatus: 'UNVERIFIZIERT: original scene and item must be reviewed together' });
    }
    const dir = path.join(ROOT, 'content/corpus/stories', storyId, 'paint');
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => /^ch\d{2}\.tasks\.v2\.json$/.test(f)).sort()) {
      const chapter = file.slice(0,4), p = `content/corpus/stories/${storyId}/paint/${file}`;
      const raw = read(p), tasks = loadPaintTasksV2(storyId, chapter);
      if (compareIds(raw.items.map(i => i.id), tasks.map(i => i.id)).length) throw new Error(`Paint loader mismatch: ${p}`);
      for (const item of tasks) {
        const source = { exercises: item.exercises ?? [], taskSource: p, status: 'UNVERIFIZIERT: exercise references require source interpretation' };
        const view = { key: `${item.id}#initial`, htmlSha256: sha256(paintHtml(item, chapter)), sceneSnapshot: null, status: item.stimulus?.type === 'scene' ? 'UNVERIFIZIERT: live scene required' : 'ACTUAL_CARD_INITIAL_WITH_CHAPTER_ART' };
        paintRows.push({ itemId: item.id, unit: raw.unit, kind: item.kind, chapter, storyId, source, learningGoal: item.exercises ?? [],
          contentSha256: digest(item), views: [view], viewSha256: digest(view), previousEvidence: { proof: p.replace('.tasks.v2.json','.proof.json'), status: 'HISTORICAL_NOT_REJUDGED' },
          revisionStatus: 'UNVERIFIZIERT' });
      }
    }
  }
  const summary = { units: slugs.length, approvedUnits: approved.length, runtimePipelineAgreements: agreements.length,
    unitItems: unitRows.length, vocabItems: unitRows.filter(r => r.kind === 'vocab').length, grammarItems: unitRows.filter(r => r.kind === 'grammar').length,
    vocabDirections: [...VOCAB_POOLS], practiceDirectionViews: unitRows.reduce((n,r) => n + (r.kind === 'vocab' ? 4 : 1),0),
    additionalTypedViews: unitRows.flatMap(r => r.views).filter(v => v.scope === 'practice-alternate').length,
    authoredVariantViews: unitRows.flatMap(r => r.views).filter(v => v.scope === 'authored-story-variant-isolated').length,
    grammarFormats: counts(unitRows.filter(r => r.kind === 'grammar').map(r => r.format)),
    skippedBlindGrammar: counts(unitRows.filter(r => r.oldBlindSolve === 'SKIPPED').map(r => r.format)),
    byGrade: Object.fromEntries([1,2,3,4].map(g => [g, { units: slugs.filter(s => s[1] === String(g)).length, vocab: unitRows.filter(r => r.grade===g && r.kind==='vocab').length, grammar: unitRows.filter(r => r.grade===g && r.kind==='grammar').length }])),
    paintCards: paintRows.length, paintKinds: counts(paintRows.map(r => r.kind)), storySlots: storyRows.length,
    sourceStatus: counts(unitRows.map(r => r.source.status)), sourceFiles: counts(sources.map(s => s.status)),
    auxiliaryFiles: auxiliary.length, liveDatabaseOverlay: 'UNVERIFIZIERT — not read; file corpus only', corpusStamp: stamp };
  return { schema: 'domigo-revision-census@1', label: 'CODEX DRAFT — NOT CANON', basis: 'df258ae8952cf5e5747e7507759d4d7b61e094b5', summary, slugs, renderer, unitRows, paintRows, storyRows, auxiliary };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [sources, output] = process.argv.slice(2);
  if (!sources || !output) throw new Error('Usage: node --import ./scripts/gg-revision/register.mjs scripts/gg-revision/census.mjs SOURCES_JSON EXTERNAL_OUT');
  const result = collect(sources), dest = outside(output);
  fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result.summary,null,2));
}
