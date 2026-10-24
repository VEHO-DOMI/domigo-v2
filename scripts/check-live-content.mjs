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
 const bad=[],coverage={},surfaces={quiz:0,duel:0};let answersChecked=0;
 if(Object.keys(bank).length!==provenance.approved)bad.push('approved-count');
 for(const [key,approval]of Object.entries(bank)){
  const colon=key.lastIndexOf(':'),id=key.slice(0,colon),pool=key.slice(colon+1),item=source.get(id);
  if(!item||!['deToEn','definition','carrier'].includes(pool)){bad.push('unknown-entry:'+key);continue;}
  if(!approval||typeof approval!=='object'||Object.keys(approval).sort().join(',')!=='duel,quiz'){bad.push('approval-shape:'+key);continue;}
  if(approval.quiz===null&&approval.duel===null)bad.push('no-approval:'+key);
  for(const surface of ['quiz','duel']){
   const pin=approval[surface];
   if(pin===null)continue;
   if(typeof pin!=='string'||!/^[a-f0-9]{64}$/.test(pin)||liveContentFingerprint(item,pool)!==pin)bad.push('changed-content:'+surface+':'+key);
   if(surface==='duel'&&pool==='carrier')bad.push('unreviewed-free-text:'+key);
   surfaces[surface]++;
   const scope=surface+':'+id.slice(0,2)+':'+pool;coverage[scope]=(coverage[scope]||0)+1;
  }
  for(const answer of vocabAnswers(item,pool)){answersChecked++;if(grade(item,answer.text,pool).tier!==(answer.tier==='full'?'correct':'partial'))bad.push('answer-tier:'+key+':'+answer.text);}
  const options=[vocabAnswers(item,pool).find(a=>a.tier==='full')?.text,...item.mc];
  if(options.length!==4||options.filter(o=>typeof o==='string'&&grade(item,o,pool).tier==='correct').length!==1)bad.push('structural-options:'+key);

 }
 for(const surface of ['quiz','duel']){
  if(surfaces[surface]!==provenance.approvedSurfaces?.[surface])bad.push('surface-count:'+surface);
  for(const grade of [1,2,3,4])for(const mode of surface==='quiz'?['translation','definition','context']:['translation','definition'])if((coverage[`${surface}:g${grade}:${livePool(mode)}`]||0)<5)bad.push('insufficient-year-mode:'+surface+':'+grade+':'+mode);
 }
 return {bad,coverage,surfaces,answersChecked};
}
const result=validate(LIVE_REVIEWED_BANK);
assert.deepEqual(result.bad,[]);
if(process.argv.includes('--selftest')){
 const [key,pin]=Object.entries(LIVE_REVIEWED_BANK)[0];assert(key&&pin);
 const altered={...LIVE_REVIEWED_BANK,[key]:{...pin,quiz:'0'.repeat(64)}};assert(validate(altered).bad.some(x=>x.startsWith('changed-content:')));
 assert(validate({...LIVE_REVIEWED_BANK,'unknown:carrier':pin},{...LIVE_REVIEW_PROVENANCE,approved:LIVE_REVIEW_PROVENANCE.approved+1}).bad.some(x=>x.startsWith('unknown-entry:')));
 assert(validate(LIVE_REVIEWED_BANK,{...LIVE_REVIEW_PROVENANCE,approved:0}).bad.includes('approved-count'));
 const id=key.slice(0,key.lastIndexOf(':')),edited=new Map(items),item=edited.get(id);edited.set(id,{...item,mc:['unread A','unread B','unread C']});assert(validate(LIVE_REVIEWED_BANK,LIVE_REVIEW_PROVENANCE,edited).bad.some(x=>x.startsWith('changed-content:')));
 const withoutYear=Object.fromEntries(Object.entries(LIVE_REVIEWED_BANK).filter(([k])=>!k.startsWith('g4')));assert(validate(withoutYear,{...LIVE_REVIEW_PROVENANCE,approved:Object.keys(withoutYear).length}).bad.some(x=>x.startsWith('insufficient-year-mode:')));
 assert(validate(LIVE_REVIEWED_BANK,LIVE_REVIEW_PROVENANCE,items,()=>({tier:'wrong'})).bad.some(x=>x.startsWith('answer-tier:')));
 const contextKey=Object.keys(LIVE_REVIEWED_BANK).find(k=>k.endsWith(':carrier')),context=LIVE_REVIEWED_BANK[contextKey];
 assert(validate({...LIVE_REVIEWED_BANK,[contextKey]:{...context,duel:context.quiz}}).bad.some(x=>x.startsWith('unreviewed-free-text:')));
 assert(validate({...LIVE_REVIEWED_BANK,[key]:{quiz:pin.quiz}}).bad.some(x=>x.startsWith('approval-shape:')));
 assert(validate({...LIVE_REVIEWED_BANK,[key]:{...pin,duel:'0'.repeat(64)}}).bad.some(x=>x.startsWith('changed-content:duel:')));
 assert(validate({...LIVE_REVIEWED_BANK,[key]:{quiz:null,duel:null}}).bad.some(x=>x.startsWith('no-approval:')));
 console.log('live-content: 10 structural mutations detected; quiz review and GG format decision remain pinned external evidence');
}else console.log(JSON.stringify({approved:Object.keys(LIVE_REVIEWED_BANK).length,coverage:result.coverage,surfaces:result.surfaces,answersChecked:result.answersChecked,unreviewed:'excluded',semanticSource:LIVE_REVIEW_PROVENANCE}));
