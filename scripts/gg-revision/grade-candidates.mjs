// CODEX DRAFT — NOT CANON. Grade externally supplied blind answers with real engines.
import fs from 'node:fs';
import { gradeGrammar, gradeVocab } from '../../packages/engine/src/index.ts';
import { MACHINES } from '../../packages/game-paint/src/cards/machines.ts';
import { pilotData } from './pilot-data.mjs';
import { compareIds, digest } from './core.mjs';
import { outside } from './census.mjs';
const [manifestFile,candidateFile,outFile]=process.argv.slice(2);
if(!outFile)throw new Error('Usage: grade-candidates.mjs SOLVER_MANIFEST ANSWERS_JSON EXTERNAL_OUTPUT');
const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8')),input=JSON.parse(fs.readFileSync(candidateFile,'utf8')),entries=pilotData();
if(input.packetSha256!==digest(manifest))throw new Error('STALE_READER: wrong frozen packet');
if(!input.readerSession||input.readerSession==='CODEX cgo-006')throw new Error('Reader identity required; author is not independent');
const errors=compareIds(entries.map(e=>e.itemId),input.items.map(e=>e.itemId));if(errors.length)throw new Error(errors.join('\n'));
const results=input.items.map(row=>{
 const entry=entries.find(e=>e.itemId===row.itemId);
 if(!Array.isArray(row.candidates)||row.candidates.length===0)throw new Error('At least one candidate per item');
 const candidates=row.candidates.map(answer=>{
  if(entry.kind==='vocab'){if(typeof answer!=='string')throw new Error('Vocabulary answer must be text');return{answer,...gradeVocab(entry.item,answer,entry.pool)};}
  if(entry.kind==='paint'){
   const m=MACHINES[entry.item.kind];let state=m.init(entry.item);
   const actions=entry.item.kind==='restore'?[{pickName:answer.name},{pickColour:answer.colour}]:[{pick:answer}];
   for(const action of actions)state=m.act(state,action);return{answer,tier:m.grade(state)};
  }
  const item=entry.item;
  const shaped=['matching','matching-pairs'].includes(item.format)?{kind:'matching',value:answer}:item.format==='group-sort'?{kind:'groupSort',value:answer}:{kind:['multiple-choice','context-picker'].includes(item.format)?'choice':'text',value:answer};
  return{answer,...gradeGrammar(item,shaped)};
 });
 return{itemId:row.itemId,candidates,readerNote:row.note??null};
});
const report={label:'CODEX DRAFT — NOT CANON',readerSession:input.readerSession,packetSha256:input.packetSha256,results,
 meaning:'Mechanical comparison only. Disagreement requires source review; do not change a key to force agreement.'};
fs.writeFileSync(outside(outFile),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({items:results.length,nonCorrect:results.filter(r=>r.candidates.some(c=>c.tier!=='correct')).map(r=>r.itemId)}));
