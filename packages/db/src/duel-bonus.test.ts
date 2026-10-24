import { describe,expect,it } from "vitest";
import {readFileSync} from "node:fs";
import ts from "typescript";
import { resultBonus,bonusReceipt } from "./duel-bonus.ts";
const at=new Date("2026-10-23T12:00:00Z"),empty={pairWeek:0,p1Day:0,p2Day:0,lastPairAt:null};
describe("cgo-122 pure bonus policy",()=>{
 it("B01 rewards win/draw, never loss, only when both have eight correct",()=>{
  expect(resultBonus(15,8,empty,at)).toEqual({p1:100,p2:0});expect(resultBonus(8,15,empty,at)).toEqual({p1:0,p2:100});
  expect(resultBonus(8,8,empty,at)).toEqual({p1:50,p2:50});
  for(const scores of [[15,7],[7,15],[7,7],[0,0]])expect(resultBonus(scores[0]!,scores[1]!,empty,at)).toEqual({p1:0,p2:0});
 });
 it("B02 a pair has two weekly awards and the cooldown includes the last non-bonus completion",()=>{
  expect(resultBonus(15,15,{...empty,pairWeek:1},at)).toEqual({p1:50,p2:50});
  expect(resultBonus(15,15,{...empty,pairWeek:2},at)).toEqual({p1:0,p2:0});
  expect(resultBonus(15,15,{...empty,lastPairAt:new Date(at.getTime()-86400000+1)},at)).toEqual({p1:0,p2:0});
  expect(resultBonus(15,15,{...empty,lastPairAt:new Date(at.getTime()-86400000)},at)).toEqual({p1:50,p2:50});
  expect(resultBonus(15,15,{...empty,lastPairAt:new Date(at.getTime()+1)},at)).toEqual({p1:0,p2:0});
 });
 it("B03 daily caps apply independently to each recipient",()=>{
  expect(resultBonus(15,15,{...empty,p1Day:2},at)).toEqual({p1:50,p2:50});
  expect(resultBonus(15,15,{...empty,p1Day:3},at)).toEqual({p1:0,p2:50});
  expect(resultBonus(15,15,{...empty,p2Day:3},at)).toEqual({p1:50,p2:0});
  expect(resultBonus(15,8,{...empty,p1Day:3},at)).toEqual({p1:0,p2:0});
 });
 it("B04 invalid counters and dates fail closed",()=>{
  for(const n of [NaN,Infinity,-1,.5])expect(()=>resultBonus(15,15,{...empty,pairWeek:n},at)).toThrow();
  expect(()=>resultBonus(16,15,empty,at)).toThrow();expect(()=>resultBonus(15,15,empty,new Date("bad"))).toThrow();
 });
 it("B05 legacy has no retroactive receipt and malformed receipts fail closed",()=>{
  const b={version:1 as const,at:at.toISOString(),attemptId:"synthetic",p1:100 as const,p2:0 as const};
  const rounds=[{},{},{},{},{bonus:b}];expect(bonusReceipt(rounds)).toEqual(b);expect(bonusReceipt([{},{}])).toBe(null);
  for(const change of [{version:2},{p1:101},{p2:100},{attemptId:""},{at:"bad"}])expect(()=>bonusReceipt([{},{},{},{},{bonus:{...b,...change} as typeof b}])).toThrow();
 });
});

it("B14 six weakened policy mutations are rejected by concrete result checks",()=>{
 const original=readFileSync(new URL("./duel-bonus.ts",import.meta.url),"utf8");
 for(const [from,to,check]of [
  ["DUEL_WIN_BONUS = 100","DUEL_WIN_BONUS = 101",(fn:typeof resultBonus)=>expect(fn(15,8,empty,at)).toEqual({p1:100,p2:0})],
  ["DUEL_DRAW_BONUS = 50","DUEL_DRAW_BONUS = 25",(fn:typeof resultBonus)=>expect(fn(8,8,empty,at)).toEqual({p1:50,p2:50})],
  ["DUEL_BONUS_MIN_CORRECT = 8","DUEL_BONUS_MIN_CORRECT = 7",(fn:typeof resultBonus)=>expect(fn(15,7,empty,at)).toEqual({p1:0,p2:0})],
  ["DUEL_BONUS_PAIR_WEEK = 2","DUEL_BONUS_PAIR_WEEK = 3",(fn:typeof resultBonus)=>expect(fn(15,15,{...empty,pairWeek:2},at)).toEqual({p1:0,p2:0})],
  ["DUEL_BONUS_USER_DAY = 3","DUEL_BONUS_USER_DAY = 4",(fn:typeof resultBonus)=>expect(fn(15,15,{...empty,p1Day:3},at)).toEqual({p1:0,p2:50})],
  ["DUEL_BONUS_GAP_MS = 24","DUEL_BONUS_GAP_MS = 0",(fn:typeof resultBonus)=>expect(fn(15,15,{...empty,lastPairAt:at},at)).toEqual({p1:0,p2:0})],
 ] as const){
  const changed=original.replace(from,to);expect(changed).not.toBe(original);const exports={} as {resultBonus:typeof resultBonus};
  new Function("exports",ts.transpileModule(changed,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);
  expect(()=>check(exports.resultBonus)).toThrow();
 }
});
