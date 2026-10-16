// CODEX DRAFT — NOT CANON
import fs from "node:fs";
import {describe,it,expect} from "vitest";
import {PaintProof,GameTasksFileV2} from "@domigo/content-schema";
import {replayPhaseTape,worldAssertionErrors} from "./tape.ts";
import {evidenceKeys,solveTapeCard} from "./tape-evidence.ts";
import type {PaintLevel} from "./level.ts";
const dir=new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/",import.meta.url);
const read=(file:string)=>JSON.parse(fs.readFileSync(new URL(file,dir),"utf8"));
describe("M-6 ordered content evidence",()=>{
 it("roundtrips every old and new proof field, including later chapter abilities",()=>{
  for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(".proof.json"))){const raw=read(file);expect(PaintProof.parse(raw)).toEqual(raw);}
  const broken=read("ch02.proof.json");broken.phases.p4.expect.deflects=["four"];
  expect(PaintProof.safeParse(broken).success).toBe(false);
 });
 it("compares identities and order, not just totals, and really replays the promise",()=>{
  const level=read("ch02.level.json") as PaintLevel,proof=PaintProof.parse(read("ch02.proof.json"));
  const tasks=GameTasksFileV2.parse(read("ch02.tasks.v2.json")).items;
  for(const phase of ["p1","p4"]){
   const tape=proof.phases[phase]!,result=replayPhaseTape(level,phase,tape,[],{tasks,cageHintShown:false,arenaBriefShown:false,pickedUp:[]});
   expect(result.exited).toBe(true);expect(worldAssertionErrors(tape.expect,result.world)).toEqual([]);
   for(const key of evidenceKeys){
    const wrong=structuredClone(tape.expect!);const values=wrong[key];if(!values?.length)continue;
    if(values.length>1)[values[0],values[1]]=[values[1]!,values[0]!];else (values as unknown[])[0]="another-identity";
    expect(worldAssertionErrors(wrong,result.world).some(e=>e.startsWith(key)),key).toBe(true);
   }
  }
 });
 it("refuses missing bound cards and keys that the actual machine cannot answer",()=>{
  const task=GameTasksFileV2.parse(read("ch02.tasks.v2.json")).items.find(t=>t.id==="g1.paint.ch02.a01")!;
  const req={use:task.use,ctx:{type:"entity" as const,id:"p1-schubkarre",skin:task.skins![0]!,taskId:task.id}};
  expect(()=>solveTapeCard([],req,"p1")).toThrow(/missing/);
  expect(()=>solveTapeCard([task],req,"p1")).not.toThrow();
 });
});
