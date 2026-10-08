import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const repo = new URL('../../../../', import.meta.url).pathname.replace(/\/$/, '');
const require = createRequire(`${repo}/apps/web/package.json`);
const ts = require('typescript');
const jsx = require('react/jsx-runtime');
const React = require('react');
const pureDb = await import("@domigo/db");
let view, reads, seenYear;
const chapters = ['g1-u01', 'g2-u03', 'g2-u04', 'g3-u01', 'g4-u01'];
const vocab = Array.from({length: 22}, (_, i) => ({id: `v${i}`, difficulty: 1}));
const grammar = [{id: 'grammar', difficulty: 1}];
const component = name => Object.assign(() => null, {displayName: name});
const pageModules = {
  'react/jsx-runtime': jsx,
  'next/link': {default: component('Link')},
  'next/navigation': {redirect: location => { throw new Error(`REDIRECT:${location}`); }, notFound: () => { throw new Error('NOT_FOUND'); }},
  '@/lib/student-view': {resolveStudentView: async raw => { seenYear = raw; return view; }},
  '@/lib/grade-scope': {isSlugAllowed: (slug, grades) => grades.includes(Number(slug[1]))},
  '@/app/PreviewBanner': {default: component('PreviewBanner')},
  '@/lib/hoeren': {ohneSprechtextFuersKind: a => a},
  '@/lib/content-service': {loadUnitWithOverrides: async slug => ({slug, vocab, grammar})},
  '@domigo/content-loader': {
    listApprovedUnits: () => chapters,
    listListeningUnits: () => ['g2-u03', 'g2-u04'],
    listTestUnits: () => ['g2-u03', 'g2-u04'],
    loadJourney: () => null,
    loadWordbank: () => ({}), loadUnitStructures: () => [],
    loadListening: () => ({tasks: [{id: 't', items: [], audio: {file: '/fake.mp3'}}]}),
    loadTest: () => ({test: {id: 'test', sections: [{kind: 'vocab', titleDe: 'Words', itemIds: ['v0']} ]}}),
  },
  '@domigo/db': {
    ...pureDb,
    getPathSummary: async () => { reads.push('pathSummary'); return new Map(); },
    getUnitPathProgress: async () => { reads.push('pathProgress'); return new Map(); },
    getDb: () => { reads.push('getDb'); return {}; },
    getDueCounts: async (_db, ownerId, classId) => { reads.push({op: 'dueCounts', ownerId, classId}); return {total: 1, vocab: 1, grammar: 0}; },
    getDueRefs: async (_db, ownerId, classId, filter, limit) => { reads.push({op: 'dueRefs', ownerId, classId, filter, limit}); return [{unitSlug: 'g2-u03', kind: 'vocab', itemId: 'v0'}]; },
  },
};
function load(path, modules) {
  const source = readFileSync(`${repo}/${path}`, 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022}}).outputText;
  const loaded = {exports: {}};
  new Function('require', 'module', 'exports', code)(specifier => {
    if (specifier in modules) return {__esModule: true, ...modules[specifier]};
    if (specifier.startsWith('./')) return {__esModule: true, default: component(specifier)};
    throw new Error(`Unmocked module ${specifier}`);
  }, loaded, loaded.exports);
  return loaded.exports;
}
function allElements(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(allElements);
  return [node, ...allElements(node.props?.children)];
}
const teacher = {kind: 'preview', teacher: {userId: 'fixture-teacher'}, grades: [2]};
const child = {kind: 'student', player: {userId: 'fixture-child', classId: 'fixture-class'}, grades: [2]};
const paths = ['learn/page.tsx', 'learn/[slug]/page.tsx', 'learn/[slug]/[node]/page.tsx', 'listening/page.tsx', 'listening/[slug]/page.tsx', 'tests/page.tsx', 'tests/[slug]/page.tsx', 'review/page.tsx', 'review/session/page.tsx'];
for (const path of paths) {
  const page = load(`apps/web/app/${path}`, pageModules).default;
  view = teacher; reads = []; seenYear = undefined;
  const tree = await page({params: Promise.resolve({slug: 'g2-u03', node: 'vocab-intro'}), searchParams: Promise.resolve({jahrgang: '2', chapter: 'g2-u04'})});
  assert.equal(seenYear, '2', path);
  assert.equal(reads.length, 0, `${path}: preview child reads`);
  const nodes = allElements(tree);
  assert.ok(nodes.some(n => n.type?.displayName === 'PreviewBanner'), `${path}: missing banner`);
  if ((path.includes('/[slug]/') && path !== 'learn/[slug]/page.tsx') || path.includes('/session/')) {
    const runner = nodes.find(n => n.type?.displayName?.startsWith('./'));
    assert.equal(runner.props.preview, true, path);
    if (path !== 'learn/[slug]/[node]/page.tsx') assert.equal(runner.props.ownerId, null, path);
    if (path.startsWith('review/')) assert.equal(runner.props.items.length, 20);
  }
  view = child; reads = [];
  const childTree = await page({params: Promise.resolve({slug: 'g2-u03', node: 'vocab-intro'}), searchParams: Promise.resolve({jahrgang: '4', chapter: 'g4-u01'})});
  const childNodes = allElements(childTree);
  assert.ok(childNodes.every(n => n.type?.displayName !== 'PreviewBanner'));
  if (path.startsWith('review/')) {
    assert.ok(reads.some(r => r.ownerId === 'fixture-child' && r.classId === 'fixture-class'));
    if (path.includes('/session/')) assert.equal(childNodes.find(n => n.type?.displayName?.startsWith('./')).props.items.length, 1);
  }
  if (path.includes('/[slug]/')) {
    view = {...child, grades: [1]};
    await assert.rejects(page({params: Promise.resolve({slug:'g2-u03', node:'vocab-intro'}), searchParams:Promise.resolve({})}), /REDIRECT/);
  }
  console.log(`PASS ${path}: preview banner/no child reads, child branch, year forwarding${path.includes('/[slug]/') ? ', foreign-year wall' : ''}`);
}
let slots, cursor, sends, flushes, writes;
const useState = initial => {
  const n = cursor++;
  if (!(n in slots)) slots[n] = initial;
  return [slots[n], next => { slots[n] = typeof next === 'function' ? next(slots[n]) : next; }];
};
const sender = load('apps/web/lib/preview-attempt.ts', {'./attempt-outbox.ts': {sendAttempt: async (body, ownerId) => {sends.push({body, ownerId}); return {ok:true, queued:false};}}});
const clients = {
  'react/jsx-runtime': jsx, 'react': {...React, useState}, 'next/link': {default: component('Link')},
  '@/lib/preview-attempt': sender, '@/lib/useOutboxFlush': {useOutboxFlush: (enabled, ownerId) => flushes.push({enabled, ownerId})},
  '@domigo/engine': {xpForTier: base => base, XP_WEIGHT: {correct:1, partial:0.5, close:0.25, wrong:0}},
  '@domigo/task-ui': Object.fromEntries(['ListeningTaskView','GrammarIntroView','VocabIntroView','GrammarItemView','VocabItemView','AudioClip'].map(name => [name, component(name)])),
};
globalThis.fetch = async (...args) => {writes.push(args); return {ok:true, json: async () => ({ok:true, stars:3})};};
for (const [path, props] of [
  ['learn/[slug]/[node]/PathPracticeNode.tsx', {unitSlug:'g2-u03',nodeId:'vocab-practice-1',isCheckpoint:false,items:[{kind:'vocab',item:vocab[0]}]}],
  ['listening/[slug]/ListeningSession.tsx', {slug:'g2-u03', tasks:[{id:'t',items:[]}]}],
  ['tests/[slug]/TestSession.tsx', {slug:'g2-u03',testId:'test',sections:[{kind:'vocab',titleDe:'Words',items:[vocab[0]]}]}],
  ['review/session/ReviewSession.tsx', {items:[{kind:'vocab',item:vocab[0]}]}],
]) {
  const Client = load(`apps/web/app/${path}`, clients).default;
  for (const preview of [true, false]) {
    slots = []; cursor = 0; sends = []; flushes = []; writes = [];
    const p = {...props, preview, ownerId: preview ? null : 'fixture-child'};
    const render = () => {cursor = 0; return Client(p);};
    let tree = render();
    const item = allElements(tree).find(n => /ItemView|ListeningTaskView/.test(n.type?.displayName));
    item.props.onResult('correct', {itemId:'v0', input:'fixture-answer'});
    await Promise.resolve();
    assert.equal(sends.length, preview ? 0 : 1, path);
    assert.equal(flushes[0].enabled, !preview, path);
    if (!preview) assert.deepEqual(sends[0], {ownerId:'fixture-child', body:{clientAttemptId:sends[0].body.clientAttemptId,itemId:'v0',input:'fixture-answer',mode:path.startsWith('learn/')?'study:vocab-practice-1':path.startsWith('review/')?'review':path.startsWith('tests/')?'test:vocab':'listening',latencyMs:null,hintUsed:false}});
    tree = render();
    allElements(tree).find(n => n.type === 'button' && n.props.onClick).props.onClick();
    tree = render();
    if (preview) assert.ok(allElements(tree).some(n => n.props?.children === 'Vorschau — nichts gespeichert'), path);
    assert.equal(writes.length, !preview && path.startsWith('learn/') ? 1 : 0);
  }
  console.log(`PASS ${path}: preview zero attempts/disabled outbox/local completion; child original payload`);
}
const Test = load('apps/web/app/tests/[slug]/TestSession.tsx', clients).default;
for (const preview of [true, false]) {
  slots = []; cursor = 0; sends = []; flushes = []; writes = [];
  const tree = Test({preview, ownerId:preview?null:'fixture-child', slug:'g2-u03',testId:'test', sections:[{kind:'writing',titleDe:'Write',promptId:'p',taskEn:'Write',promptDe:'Schreibe',minWords:1,maxWords:10}]});
  const area = allElements(tree).find(n => n.type?.name === 'WritingArea');
  slots = []; cursor = 0;
  let rendered = area.type(area.props);
  allElements(rendered).find(n => n.type === 'textarea').props.onChange({target:{value:'fixture text'}});
  cursor = 0; rendered = area.type(area.props);
  allElements(rendered).find(n => n.type === 'button').props.onClick();
  assert.equal(writes.length, preview ? 0 : 1);
  if (!preview) assert.deepEqual(JSON.parse(writes[0][1].body), {unitSlug:'g2-u03',testId:'test',promptId:'p',text:'fixture text'});
}
console.log('PASS WritingArea: preview zero POST, child original writing payload');
