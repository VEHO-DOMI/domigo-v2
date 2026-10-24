import assert from "node:assert/strict";
import { it } from "node:test";
import * as jsx from "react/jsx-runtime";
import { loadTestModule } from "./arena/test-loader.ts";
import { isSlugAllowed } from "./grade-scope.ts";
function page(view: unknown, fail=false){
  const calls: unknown[][]=[];
  const modules={"react/jsx-runtime":jsx,"next/navigation":{redirect:()=>{throw Error("redirect");},notFound:()=>{throw Error("not found");}},"@domigo/content-loader":{listApprovedUnits:()=>["g1-u01","g2-u01"]},"../load-practice":{loadPracticeWords:async(...args:unknown[])=>{calls.push(args);if(fail)throw Error("reserve unavailable");return{vocab:[],grammar:[]};}},"@/lib/grade-scope":{isSlugAllowed},"@/lib/student-view":{resolveStudentView:async()=>view},"@/app/PreviewBanner":{default:()=>null},"@/lib/trainer/LearningShell":{default:()=>null,LearningText:()=>null},"./PracticeSession":{default:()=>null}};
  return{calls,run:loadTestModule("apps/web/app/practice/[slug]/page.tsx",modules).default as (p:{params:Promise<{slug:string}>})=>Promise<unknown>};
}
const child={kind:"student",grades:[2],player:{userId:"synthetic",classId:"synthetic-class",classScope:["synthetic-class"]}};
it("Chapter deep link uses the central reserve loader with the exact authenticated view",async()=>{const p=page(child);await p.run({params:Promise.resolve({slug:"g2-u01"})});assert.deepEqual(p.calls,[[child,2,["g2-u01"]]]);});
it("a deep-link reserve outage cannot degrade into the unreserved corpus",async()=>{const p=page(child,true);await assert.rejects(p.run({params:Promise.resolve({slug:"g2-u01"})}),/reserve unavailable/);});
it("foreign Chapter rejects before content or reserve reads",async()=>{const p=page(child);await assert.rejects(p.run({params:Promise.resolve({slug:"g1-u01"})}),/redirect/);assert.deepEqual(p.calls,[]);});
it("preview keeps the existing class-free content policy",async()=>{const preview={kind:"preview",grades:[1,2,3,4]};const p=page(preview);await p.run({params:Promise.resolve({slug:"g1-u01"})});assert.deepEqual(p.calls,[[preview,1,["g1-u01"]]]);});
