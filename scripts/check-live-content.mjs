#!/usr/bin/env node
/** Structural persistence of independent semantic review. This cannot perform
 * the human/model judgment itself; it prevents unreviewed bytes inheriting it. */
import assert from 'node:assert/strict';
import { listApprovedUnits, loadUnit } from '../packages/content-loader/src/index.ts';
import { gradeVocab, vocabAnswers } from '../packages/engine/src/index.ts';
import { liveContentFingerprint, livePool } from '../packages/db/src/live-rules.ts';
import { LIVE_REVIEWED_BANK, LIVE_REVIEW_PROVENANCE } from '../packages/db/src/live-reviewed-bank.ts';
const items=new Map(listApprovedUnits().flatMap(u=>loadUnit(u).vocab).map(i=>[i.id,i]));
function validate(bank,provenance=LIVE_REVIEW_PROVENANCE,source=items,grade=gradeVocab){
 const bad=[],coverage={};let answersChecked=0;
 if(Object.keys(bank).length!==provenance.approved)bad.push('approved-count');
 for(const [key,pin]of Object.entries(bank)){
  const colon=key.lastIndexOf(':'),id=key.slice(0,colon),pool=key.slice(colon+1),item=source.get(id);
  if(!item||!['deToEn','definition','carrier'].includes(pool)){bad.push('unknown-entry:'+key);continue;}
  if(!/^[a-f0-9]{64}$/.test(pin)||liveContentFingerprint(item,pool)!==pin)bad.push('changed-content:'+key);
  for(const answer of vocabAnswers(item,pool)){answersChecked++;if(grade(item,answer.text,pool).tier!==(answer.tier==='full'?'correct':'partial'))bad.push('answer-tier:'+key+':'+answer.text);}
  const options=[vocabAnswers(item,pool).find(a=>a.tier==='full')?.text,...item.mc];
  if(options.length!==4||options.filter(o=>typeof o==='string'&&grade(item,o,pool).tier==='correct').length!==1)bad.push('structural-options:'+key);
  const scope=id.slice(0,2)+':'+pool;coverage[scope]=(coverage[scope]||0)+1;
 }
 for(const grade of [1,2,3,4])for(const mode of ['translation','definition','context'])if((coverage[`g${grade}:${livePool(mode)}`]||0)<5)bad.push('insufficient-year-mode:'+grade+':'+mode);
 return {bad,coverage,answersChecked};
}
const result=validate(LIVE_REVIEWED_BANK);
assert.deepEqual(result.bad,[]);
if(process.argv.includes('--selftest')){
 const [key,pin]=Object.entries(LIVE_REVIEWED_BANK)[0];assert(key&&pin);
 const altered={...LIVE_REVIEWED_BANK,[key]:'0'.repeat(64)};assert(validate(altered).bad.some(x=>x.startsWith('changed-content:')));
 assert(validate({...LIVE_REVIEWED_BANK,'unknown:carrier':pin},{...LIVE_REVIEW_PROVENANCE,approved:LIVE_REVIEW_PROVENANCE.approved+1}).bad.some(x=>x.startsWith('unknown-entry:')));
 assert(validate(LIVE_REVIEWED_BANK,{...LIVE_REVIEW_PROVENANCE,approved:0}).bad.includes('approved-count'));
 const id=key.slice(0,key.lastIndexOf(':')),edited=new Map(items),item=edited.get(id);edited.set(id,{...item,mc:['unread A','unread B','unread C']});assert(validate(LIVE_REVIEWED_BANK,LIVE_REVIEW_PROVENANCE,edited).bad.some(x=>x.startsWith('changed-content:')));
 const withoutYear=Object.fromEntries(Object.entries(LIVE_REVIEWED_BANK).filter(([k])=>!k.startsWith('g4')));assert(validate(withoutYear,{...LIVE_REVIEW_PROVENANCE,approved:Object.keys(withoutYear).length}).bad.some(x=>x.startsWith('insufficient-year-mode:')));
 assert(validate(LIVE_REVIEWED_BANK,LIVE_REVIEW_PROVENANCE,items,()=>({tier:'wrong'})).bad.some(x=>x.startsWith('answer-tier:')));
 console.log('live-content: 6 independent structural mutations detected; semantic judgment remains pinned external evidence');
}else console.log(JSON.stringify({approved:Object.keys(LIVE_REVIEWED_BANK).length,coverage:result.coverage,answersChecked:result.answersChecked,unreviewed:'excluded',semanticSource:LIVE_REVIEW_PROVENANCE}));
