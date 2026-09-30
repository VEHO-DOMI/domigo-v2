// CODEX DRAFT — NOT CANON. Bounded, dependency-free preview build.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { allCopy, publicCopy } from './copy.mjs';
import { initial, scenarioList } from './model.mjs';
export const sourceDir = path.dirname(fileURLToPath(import.meta.url));
export const repo = path.resolve(sourceDir, '../../..');
export const defaultOutput = path.join(tmpdir(), 'domigo-cgo-032-preview');
export const fingerprint = b => createHash('md5').update(b).digest('hex');
export const publicFiles = ['index.html','style.css','app.js','render.mjs','lesson.public.json','assets/object.png','assets/mentor.png','assets/fredoka.woff2','assets/FONT-LICENSE.md'];
export async function inputs() {
  const pins = JSON.parse(await readFile(path.join(sourceDir,'source-pins.json'),'utf8'));
  const bytes = {};
  for (const [name, md5] of Object.entries(pins.files)) {
    bytes[name] = await readFile(path.join(repo,name));
    if (fingerprint(bytes[name]) !== md5) throw new Error(`Source differs from approved base: ${name}`);
  }
  const vocab = JSON.parse(bytes['content/corpus/units/g1-u01/vocab.json']).items.find(x=>x.id==='g1u01.w.book');
  const grammar = JSON.parse(bytes['content/corpus/units/g1-u01/grammar.json']).items.find(x=>x.id==='g1u01.gi.contractions.mc.006');
  if (!vocab || !grammar || grammar.format !== 'multiple-choice') throw new Error('Required original item missing or changed');
  const tasks = {
    word: { id:'mockup.ch1.word-recall.001.v1', format:'typed-recall', prompt:publicCopy['word.recallTitle'], instruction:publicCopy['word.instruction'], image:'/assets/object.png', alt:publicCopy['ui.wordAlt'] },
    grammar: { id:'mockup.ch1.it-is.context-mc.v1', format:'multiple-choice', context:publicCopy['grammar.long'], gap:publicCopy['grammar.gap'], meaning:publicCopy['grammar.meaning'], instruction:publicCopy['grammar.instruction'], question:publicCopy['grammar.legend'], options:[grammar.distractors[0],grammar.distractors[1],grammar.answers[0].text,...grammar.distractors.slice(2)] },
  };
  return { pins, bytes, source: { originals:{vocab,grammar}, answers:{vocab:vocab.dAnswers,grammar:grammar.answers}, tasks, copy:allCopy } };
}
export async function build(out = defaultOutput) {
  out = path.resolve(out);
  if (out === repo || out.startsWith(repo+path.sep)) throw new Error('Build output must stay outside the repository');
  const {pins,bytes,source} = await inputs();
  await mkdir(path.join(out,'assets'),{recursive:true});
  for (const name of ['index.html','style.css','app.js','render.mjs']) await copyFile(path.join(sourceDir,name),path.join(out,name));
  const assets = {'object.png':'apps/web/public/art/g1/paint/ch01/obj_book_a.png','mentor.png':'apps/web/public/art/g1/paint/ch01/klecks_mentor.png','fredoka.woff2':'apps/web/app/fonts/fredoka-var-latin.woff2','FONT-LICENSE.md':'apps/web/app/fonts/LICENSE.md'};
  for (const [target,original] of Object.entries(assets)) await writeFile(path.join(out,'assets',target),bytes[original]);
  const scenes = scenarioList(source).map(({id,label})=>({id,label}));
  await writeFile(path.join(out,'lesson.public.json'),JSON.stringify({copy:publicCopy,tasks:source.tasks,initial:initial(),scenes},null,2));
  // Explicit solver contract: task view only. Learning examples and help are excluded.
  for (const key of ['word','grammar']) await writeFile(path.join(out,`solver-${key}.public.json`),JSON.stringify({label:pins.label,scope:'Ein Aufgabenreiz ohne Einführung, Hilfe oder Bewertung. Wortpaket vor Grammatikpaket lösen und Antwort einfrieren.',task:source.tasks[key]},null,2));
  await writeFile(path.join(out,'tasks.private.json'),JSON.stringify(source,null,2));
  const manifest = {label:pins.label,base:pins.base,referenceBase:pins.referenceBase,head:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),sourcePins:pins.files,implementation:{},files:{}};
  for (const name of ['copy.mjs','model.mjs','render.mjs','build.mjs','serve.mjs','app.js','index.html','style.css','source-pins.json']) manifest.implementation[name] = fingerprint(await readFile(path.join(sourceDir,name)));
  for (const name of publicFiles) { const b=await readFile(path.join(out,name)); manifest.files[name]={md5:fingerprint(b),bytes:b.length}; }
  manifest.private = fingerprint(await readFile(path.join(out,'tasks.private.json')));
  manifest.solver = {};
  for (const key of ['word','grammar']) manifest.solver[key] = fingerprint(await readFile(path.join(out,`solver-${key}.public.json`)));
  await writeFile(path.join(out,'build.json'),JSON.stringify(manifest,null,2));
  return {out,manifest};
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const n=process.argv.indexOf('--out');
  const {out,manifest}=await build(n<0?defaultOutput:path.resolve(process.argv[n+1]));
  console.log(JSON.stringify({out,base:manifest.base,files:Object.keys(manifest.files).length,bytes:Object.values(manifest.files).reduce((n,x)=>n+x.bytes,0)}));
}
