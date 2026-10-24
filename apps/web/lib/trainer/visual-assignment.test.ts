import assert from 'node:assert/strict';
import { it } from 'node:test';
import { createRequire } from 'node:module';
const { assignmentTarget } = createRequire(import.meta.url)('../../../../scripts/lib/visual/assignment-target.mjs');
const baseUrl='https://synthetic.invalid', uuid='/assignments/aaaaaaaa-1234-4000-8000-000000000001';
it('external V-1 accepts real UUIDs from the rendered synthetic class and explicit contract',()=>{
  for(const provided of[undefined,uuid,baseUrl+uuid])assert.deepEqual(assignmentTarget({baseUrl,links:[uuid],local:false,provided}),{href:baseUrl+uuid,index:0});
  const second='/assignments/bbbbbbbb-1234-4000-8000-000000000002';assert.equal(assignmentTarget({baseUrl,links:[uuid,second],local:false,provided:second}).index,1);
});
it('missing, foreign and mismatched assignments fail clearly; local fixture stays local',()=>{
  assert.throws(()=>assignmentTarget({baseUrl,links:[],local:false}),/V1_ASSIGNMENT_MISSING/);
  assert.throws(()=>assignmentTarget({baseUrl,links:[uuid],local:false,provided:'/assignments/missing'}),/V1_ASSIGNMENT_MISSING/);
  for(const provided of['https://foreign.invalid'+uuid,'/home',uuid+'?x=1',uuid+'#x','https://user:pass@synthetic.invalid'+uuid])assert.throws(()=>assignmentTarget({baseUrl,links:[uuid],local:false,provided}),/V1_ASSIGNMENT_INVALID/);
  assert.throws(()=>assignmentTarget({baseUrl,links:[uuid],local:true}),/V1_ASSIGNMENT_LOCAL_FIXTURE/);
  assert.equal(assignmentTarget({baseUrl,links:['/assignments/synthetic-assignment-1'],local:true,provided:uuid}).href,baseUrl+'/assignments/synthetic-assignment-1');
});
