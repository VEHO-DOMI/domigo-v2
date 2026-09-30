// CODEX DRAFT — NOT CANON. Real runtime/engine/render tests; never grants release.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GrammarItem } from '../../packages/content-schema/src/index.ts';
import { gradeGrammar, gradeVocab, vocabAnswers } from '../../packages/engine/src/index.ts';
import { autoSolve } from '../../packages/game-paint/src/cards/machines.ts';
import { collect, outside, paintArt } from './census.mjs';
import { PilotView } from './PilotView.tsx';
import { pilotData } from './pilot-data.mjs';
import { packetErrors, expectedStates } from './solver-packet.mjs';
import { makeBinding, checkBinding, approvalErrors, rankingStatus, compareIds, digest, sha256, solverHtmlErrors } from './core.mjs';
const [sourceFile, viewDirectory, output, sourceRoot] = process.argv.slice(2);
if (!output || !sourceRoot) throw new Error('Usage: verify.mjs SOURCES_JSON VIEWS_DIR EXTERNAL_OUT ORIGINAL_SOURCE_ROOT');
const sources=JSON.parse(fs.readFileSync(sourceFile,'utf8')).sources;
const census=collect(sourceFile), entries=pilotData(), receipts=[],seals=[],sabotage=[];
assert.equal(census.summary.units,57);assert.equal(census.summary.runtimePipelineAgreements,57);
assert.equal(Object.keys(census.summary.grammarFormats).length,13);assert.equal(Object.keys(census.summary.paintKinds).length,10);
assert.equal(census.summary.practiceDirectionViews,census.summary.vocabItems*4+census.summary.grammarItems);
// Reload source bytes now: an old scan file is not fresh evidence.
for(const source of sources){
 assert.equal(sha256(fs.readFileSync(path.join(sourceRoot,source.relPath))),source.sha256,`Source changed: ${source.relPath}`);
 assert.equal(source.status,'BYTES_CONFIRMED');
}
const expectedIds=census.unitRows.map(r=>r.itemId);
assert.ok(compareIds(expectedIds,expectedIds.slice(1)).some(e=>e.startsWith('MISSING:')));
sabotage.push({test:'omitted census item',detected:true});
const publicManifest=JSON.parse(fs.readFileSync(path.join(viewDirectory,'solver/manifest.json'),'utf8'));
const privateMapping=JSON.parse(fs.readFileSync(path.join(viewDirectory,'private-mapping.json'),'utf8'));
assert.deepEqual(packetErrors(path.join(viewDirectory,'solver'),publicManifest,privateMapping,entries,digest(census.renderer)),[]);
assert.equal(publicManifest.rendererSha256,digest(census.renderer),'Renderer changed since export');
const requiredStates=expectedStates(entries).map(s=>s.publicId+'#'+s.stateId);
assert.deepEqual(compareIds(requiredStates,publicManifest.states.map(s=>s.publicId+'#'+s.stateId)),[]);
assert.ok(compareIds(requiredStates,[]).length,'Missing second stage must fail');
sabotage.push({test:'omitted restore colour state',detected:true});
for(const state of publicManifest.states){const html=fs.readFileSync(path.join(viewDirectory,'solver',state.file));assert.equal(sha256(html),state.htmlSha256);assert.deepEqual(solverHtmlErrors(html.toString()),[]);}
assert.deepEqual(compareIds(privateMapping.entries.map(e=>e.publicId),publicManifest.views.map(v=>v.publicId)),[]);
for(const pilot of ['g1-u01','g3-u01'])assert.equal(entries.filter(e=>e.unit===pilot).length,10);
for(const entry of entries){
 const item=entry.item, grade=Number(entry.unit[1]);
 const checks=[];
 if(entry.kind==='paint'){assert.equal(autoSolve(item),'correct');checks.push('paint-machine:correct');}
 else if(entry.kind==='vocab'){
  for(const pool of ['carrier','definition','deToEn','enToDe'])for(const answer of vocabAnswers(item,pool).filter(a=>a.tier==='full')){
   assert.equal(gradeVocab(item,answer.text,pool).tier,'correct',entry.itemId+'/'+pool);checks.push(pool+':correct');
  }
 }else{
  if(entry.kind==='transfer')GrammarItem.parse(item);
  let inputs;
  if(['matching','matching-pairs'].includes(item.format))inputs=[{kind:'matching',value:Object.fromEntries(item.pairs.map(p=>[p.left,p.right]))}];
  else if(item.format==='group-sort')inputs=[{kind:'groupSort',value:Object.fromEntries(item.groups.flatMap(g=>g.members.map(m=>[m,g.label])))}];
  else inputs=item.answers.filter(a=>a.tier==='full').map(a=>({kind:['multiple-choice','context-picker'].includes(item.format)?'choice':'text',value:a.text}));
  assert.ok(inputs.length);for(const input of inputs){assert.equal(gradeGrammar(item,input).tier,'correct',entry.itemId);checks.push(input.kind+':correct');}
 }
 const sourceRecords=sources.filter(s=>s.grade===grade && (s.role==='master-list'||(s.role==='sb-transcript'&&/Unit 1(?:-|\.|\.docx)/i.test(path.basename(s.relPath)))));
 assert.ok(sourceRecords.length>=2,`Pilot original sources missing: ${entry.unit}`);
 const source={records:sourceRecords,semanticVerdict:'UNVERIFIZIERT; author source notes and two blind judgements still required'};
 const art=entry.kind==='paint'?paintArt(entry.chapter):undefined;
 const html=renderToStaticMarkup(createElement(PilotView,{entry,art}));
 assert.deepEqual(solverHtmlErrors(html),[]);
 const publicId=privateMapping.entries.find(m=>m.itemId===entry.itemId).publicId;
 const view=publicManifest.views.find(v=>v.publicId===publicId),file=path.join(viewDirectory,'solver',view.file);
 assert.equal(sha256(fs.readFileSync(file)),view.htmlSha256);
 assert.deepEqual(solverHtmlErrors(fs.readFileSync(file,'utf8')),[]);
 const allViews=census.unitRows.find(r=>r.itemId===item.id)?.views??[];
 const answers=entry.kind==='vocab'?Object.fromEntries(['carrier','definition','deToEn','enToDe'].map(p=>[p,vocabAnswers(item,p)])):{answers:item.answers??null,pairs:item.pairs??null,groups:item.groups??null,paintItem:entry.kind==='paint'?item:null};
 const parts={itemId:item.id,source,content:item,answers,views:{allViews,pilotHtmlSha256:sha256(html),frozenHtmlSha256:view.htmlSha256,states:publicManifest.states.filter(s=>s.publicId===publicId),privateMappingSha256:digest(privateMapping),packetSha256:digest(publicManifest),context:entry.context,pair:entry.pair??null,cssSha256:publicManifest.cssSha256,assets:publicManifest.assets},renderer:census.renderer};
 const binding=makeBinding(parts), seal={label:'CODEX DRAFT — NOT CANON',state:'draft',author:'CODEX cgo-006',binding,solvers:[],kokiVerdict:null};
 const blockers=approvalErrors(seal,binding,true);assert.ok(blockers.includes('READERS:TWO_INDEPENDENT_REQUIRED'));assert.ok(blockers.includes('KOKI:REQUIRED_FOR_THIS_BINDING'));
 seals.push({...seal,approvalBlockers:blockers});
 receipts.push({itemId:entry.itemId,checks,sourcePaths:sourceRecords.map(s=>s.relPath),bindingSha256:digest(binding)});
 if(entry.kind==='vocab'&&entry.pool==='carrier'){
  const changedSource=structuredClone(parts);changedSource.source.records[0].sha256='0'.repeat(64);
  assert.ok(checkBinding(binding,makeBinding(changedSource)).includes('DRIFT:sourceSha256'));
  const changedAnswer=structuredClone(parts);changedAnswer.answers.carrier[0].text='changed-key';
  assert.ok(checkBinding(binding,makeBinding(changedAnswer)).includes('DRIFT:answersSha256'));
  const injected=structuredClone(entry);injected.item.d+=' Answer: '+item.sAnswers[0].text;
  const changedView=structuredClone(parts);changedView.views.pilotHtmlSha256=sha256(renderToStaticMarkup(createElement(PilotView,{entry:injected})));
  assert.ok(checkBinding(binding,makeBinding(changedView)).includes('DRIFT:viewsSha256'));
  assert.equal(rankingStatus(binding,makeBinding(changedView)),'unranked');
  assert.ok(approvalErrors(seal,binding,false).includes('SOURCE:UNVERIFIZIERT'));
  for(const label of ['source fingerprint changed','answer changed','answer injected into actual renderer','missing source'])sabotage.push({itemId:item.id,test:label,detected:true});
 }
}
const result={label:'CODEX DRAFT — NOT CANON',summary:census.summary,items:receipts,seals,sabotage,judgement:'MECHANICAL_SELF_CHECK_ONLY',independentSolvers:0,kokiVerdict:'PENDING',checks:receipts.reduce((n,r)=>n+r.checks.length,0)};
const dest=outside(output);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(path.dirname(dest),'census.json'),JSON.stringify(census,null,2)+'\n');
console.log(JSON.stringify({pilotItems:entries.length,mechanicalChecks:result.checks,sabotage:result.sabotage.length,publication:'BLOCKED'}));
