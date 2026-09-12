// CODEX DRAFT — NOT CANON: Zoo opt-in cage/ceremony scope, no global legacy requirement.
import {describe,it,expect} from 'vitest';
import {domArtStems,phaseRequiredStems,phaseArtScope,type ScopeLevel} from './artScope.ts';
const level=(entities:ScopeLevel['phases'][number]['entities']):ScopeLevel=>({chapter:'isolated-zoo-test',phases:[{id:'p1',rows:['....','####'],entities}]});
const cage=(key:string,artSet?:string,role='cage')=>({id:'test-'+key,skin:'kaefig',role,params:{captive:key,...(artSet?{artSet}:{})}});
describe('Zoo captive scope actual public functions',()=>{
 for(const key of ['ticket','train','stone']){
  const expected=['captive_'+key,'obj_'+key];
  it(key+' both the captive and freed object are required even before art arrives',()=>{
   const l=level([cage(key,'zoo-v2')]);for(const s of expected)expect(phaseRequiredStems(l,'p1').has(s),s).toBe(true);
  });
  it(key+' DOM ceremony claims both actual states',()=>{
   const l=level([cage(key,'zoo-v2')]);for(const s of expected)expect(domArtStems(l).has(s),s).toBe(true);
  });
  it(key+' required stems can actually be loaded by this phase',()=>{
   const l=level([cage(key,'zoo-v2')]);for(const s of expected)expect(phaseArtScope(l,'p1',expected).has(s),s).toBe(true);
  });
 }
 it('does not harden legacy cage requirements or add new legacy ceremony claims',()=>{
  for(const key of ['ticket','train','stone']){const l=level([cage(key)]);for(const s of ['captive_'+key,'obj_'+key]){expect(phaseRequiredStems(l,'p1').has(s)).toBe(false);expect(domArtStems(l).has(s)).toBe(false);}expect(phaseArtScope(l,'p1',[]).has('captive_'+key)).toBe(true);}
 });
 it('does not claim invalid occupant keys or non-cage params',()=>{
  for(const e of [cage('bad/key','zoo-v2'),cage('ticket','zoo-v2','tip')]){const l=level([e]);for(const s of ['captive_'+e.params.captive,'obj_'+e.params.captive]){expect(phaseRequiredStems(l,'p1').has(s)).toBe(false);expect(domArtStems(l).has(s)).toBe(false);}}
 });
 it('arena and bonus cages retain distinct phase ownership',()=>{
  const l=level([]);l.arena={id:'arena',rows:['#'],entities:[cage('train','zoo-v2')]};l.bonus={id:'bonus',rows:['#'],entities:[cage('stone','zoo-v2')]};expect(domArtStems(l).has('obj_train')).toBe(true);expect(domArtStems(l).has('obj_stone')).toBe(true);expect(phaseRequiredStems(l,'p1').has('obj_train')).toBe(false);expect(phaseRequiredStems(l,'arena').has('obj_train')).toBe(true);expect(phaseRequiredStems(l,'arena').has('obj_stone')).toBe(false);expect(phaseRequiredStems(l,'bonus').has('obj_stone')).toBe(true);
 });
});
