#!/usr/bin/env node
/** Mechanical carrier-pool guard. This checks insertion structure, not meaning
 * or whether a synonym should count. Source corpus plus trusted git overlays. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const words=text=>[...text.matchAll(/[a-z]+(?:['’][a-z]+)?/gi)].map(m=>({word:m[0].toLowerCase(),start:m.index,end:m.index+m[0].length}));

export function insertionProblems(sentence,answer){
  const blanks=[...sentence.matchAll(/_{3,}/g)];
  if(blanks.length!==1)return [{rule:'blank-count',count:blanks.length}];
  const blank=blanks[0],start=blank.index,end=start+answer.length;
  const before=sentence.slice(0,start),after=sentence.slice(start+blank[0].length);
  const inserted=before+answer+after,tokens=words(inserted),problems=[];
  const touches=t=>t.start<end&&t.end>start;
  // Only repetitions involving inserted words, joined by whitespace. Repeated
  // words elsewhere, or across punctuation/sentence boundaries, are not errors.
  for(let i=0;i<tokens.length;i++)for(let width=1;width<=4&&i+2*width<=tokens.length;width++){
    const a=tokens.slice(i,i+width),b=tokens.slice(i+width,i+2*width),all=[...a,...b];
    if(!all.some(touches)||!a.every((t,k)=>t.word===b[k].word))continue;
    if(!all.slice(1).every((t,k)=>/^\s+$/.test(inserted.slice(all[k].end,t.start))))continue;
    problems.push({rule:'adjacent-repeat',words:a.map(t=>t.word).join(' '),inserted});
  }
  // A separable particle may already stand after the object: "bite ___ off".
  // Restrict this to the immediate object phrase, never a later clause.
  if(/\boff\s*$/i.test(answer)&&/^\s+(?:my|your|his|her|its|our|their|the|a|an)\s+[a-z]+(?:\s+[a-z]+)?\s+off\b/i.test(after)){
    problems.push({rule:'split-off-repeat',inserted});
  }
  // The bank's attested non-adjacent article defect. Keep its grammatical
  // context explicit; a generic "the ... the" rule rejects valid sentences.
  if(/\bin the Australian\s*$/i.test(before)&&/^the\s+/i.test(answer)){
    problems.push({rule:'article-before-australian-noun',inserted});
  }
  return problems;
}

export function scanContextPools(repoRoot=root){
  const units=path.join(repoRoot,'content/corpus/units');
  const fixes=JSON.parse(fs.readFileSync(path.join(repoRoot,'content/overlays/item-fixes.json'),'utf8'));
  const findings=[];let contexts=0,answers=0;
  for(const unit of fs.readdirSync(units).sort()){
    const file=path.join(units,unit,'vocab.json');if(!fs.existsSync(file))continue;
    const fix=fixes[unit]??{},drop=new Set(fix.drop??[]);
    for(const raw of JSON.parse(fs.readFileSync(file,'utf8')).items){
      if(drop.has(raw.id))continue;
      const item={...raw,...fix.patch?.[raw.id]};contexts++;
      for(const answer of item.sAnswers??[]){
        answers++;
        for(const issue of insertionProblems(item.s,answer.text))findings.push({unit,itemId:item.id,sentence:item.s,answer:answer.text,tier:answer.tier,...issue});
      }
    }
  }
  return {contexts,answers,affectedItems:new Set(findings.map(f=>f.itemId)).size,findings};
}

export function selftest(){
  for(const [sentence,answer]of[
    ['I want to ___.','to read'],['She is ___ of it.','scared of'],
    ['Do you want to ___ part in it?','take part'],['Do you want to ___ part in it?','take part in'],
    ['It can ___ your finger off!','bite off'],['It will ___ his arm off.','cut off'],
    ['It is hot in the Australian ___.','the outback'],['What is your email ___?','email address'],
  ])assert(insertionProblems(sentence,answer).length,`MISSED_INSERTION: ${sentence} / ${answer}`);
  for(const [sentence,answer]of[
    ['No, no, no. He is ___.','angry'],['___ You look hungry.','Poor you!'],
    ['___ I also hate it.','Neither do I.'],['The desk moves. It is ___.','moveable'],
    ['It can ___ your finger off!','bite'],['It is hot in the Australian ___.','outback'],
    ['She asked the teacher ___.','the time'],['They ___ the TV before they go off.','turn off'],
  ])assert.deepEqual(insertionProblems(sentence,answer),[],`FALSE_INSERTION: ${sentence} / ${answer}`);
  const original='I want to ___.';assert.deepEqual(insertionProblems(original,'read'),[]);
  assert(insertionProblems(original,'to read').some(f=>f.rule==='adjacent-repeat'),'TAMPER_NOT_REJECTED');
  console.log('context-insertion: 8 broken insertions rejected, 8 controls preserved; added-marker tamper rejected');
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.argv.includes('--selftest'))selftest();
  const result=scanContextPools();
  console.log(JSON.stringify(result,null,2));
  if(result.findings.length)process.exitCode=1;
}
