// CODEX DRAFT — NOT CANON: explicit actor canvas, same world/card size, legacy preserved.
import {describe,it,expect,vi} from 'vitest';
import {entDisplayH,GUARDIAN_DISPLAY_H} from './anim.ts';
import {zooLionDisplaySize,applyZooLionDisplaySize} from './zoo-lion-size.ts';
import {zooSnapshot} from './guardian-zoo.ts';
import {sceneDrawItems} from './scene-v2.ts';
import {Sim} from './sim.ts';
import {readZooJson} from './test-fixtures/zoo/read-fixture.ts';
import type {PaintLevel} from './level.ts';
import {newChapterLearning} from './learning.ts';
import {IDLE_PAD} from './player.ts';
const base=readZooJson('ch02.level.json') as PaintLevel;
const config=(height:number,width?:number)=>{const level=structuredClone(base);const e=level.arena!.entities.find(e=>e.role==='guardian')!;const a=e.params!.stageV2!.actors.find(a=>a.id==='lion')!;a.displayHeightPx=height;if(width===undefined)delete a.displayWidthPx;else a.displayWidthPx=width;return level;};
const start=(level:PaintLevel,learning=newChapterLearning())=>new Sim({level,phaseId:'p4',learningProgress:learning,grantedAbilities:()=>['jump','run','punch','hang'],freedCageIds:()=>[]});
const lion=(s:Sim)=>s.world.entities.find(e=>e.role==='guardian')!;
const draw=(s:Sim)=>sceneDrawItems(zooSnapshot(lion(s))).find(a=>a.id.startsWith('lion'))!;
describe('explicit zoo lion size shared by world and question/home drawing',()=>{
 for(const [height,width]of [[96,96],[96,72],[48,48]])it(`authored ${width}×${height} reaches actual snapshot and world render branch`,()=>{
  const sim=start(config(height!,width!));sim.step(IDLE_PAD);const e=lion(sim);expect(entDisplayH(e)).toBe(height);expect(zooLionDisplaySize(e)).toEqual({width,height});const item=draw(sim);expect([item.w,item.h]).toEqual([width,height]);const before=[e.x,e.y];const setDisplaySize=vi.fn();expect(applyZooLionDisplaySize({setDisplaySize},e,1.1)).toBe(true);expect(setDisplaySize).toHaveBeenCalledExactlyOnceWith(width!*1.1,height!*1.1);expect([e.x,e.y]).toEqual(before);
 });
 it('height-only older stage retains historical64 and legacy scene width',()=>{
  const sim=start(config(96));sim.step(IDLE_PAD);const e=lion(sim);expect(entDisplayH(e)).toBe(64);expect(zooLionDisplaySize(e)).toBeNull();expect([draw(sim).w,draw(sim).h]).toEqual([41.6,64]);const setDisplaySize=vi.fn();expect(applyZooLionDisplaySize({setDisplaySize},e,1)).toBe(false);expect(setDisplaySize).not.toHaveBeenCalled();
 });
 it('ordinary guardian has no zoo size override',()=>{
  const e={role:'guardian',skin:'guardian',params:{stageV2:{actors:[{id:'lion',displayWidthPx:96,displayHeightPx:96}]}}};expect(entDisplayH(e)).toBe(GUARDIAN_DISPLAY_H);expect(zooLionDisplaySize(e)).toBeNull();expect(applyZooLionDisplaySize({setDisplaySize:()=>{throw Error('legacy changed');}},e,1)).toBe(false);
 });
 it('invalid explicit dimensions cannot override the established fallback',()=>{
  for(const width of [0,-1,NaN,Infinity]){const sim=start(config(96,width));sim.step(IDLE_PAD);expect(entDisplayH(lion(sim))).toBe(64);expect(zooLionDisplaySize(lion(sim))).toBeNull();}
 });
 it('actual question, post-answer and resumed state keep authored dimensions and physical feet',()=>{
  const level=config(96,96),learning=newChapterLearning(),sim=start(level,learning);let answered=false;
  for(let t=0;t<1800;t++){
   sim.player.iframes=999;const plate=sim.world.projectiles.find(p=>p.kind==='plate'&&!p.deflected&&(!p.groundReturn||p.grounded));if(plate)sim.fist={active:true,x:plate.x,y:plate.y,dir:1,vSubs:0,travelLeftSubs:999999,returning:false,charge:0};
   const req=sim.step(IDLE_PAD).find(e=>e.type==='task');if(!req||req.type!=='task')continue;
   expect([draw(sim).w,draw(sim).h]).toEqual([96,96]);const snapshot=zooSnapshot(lion(sim));const a=snapshot.actors.find(a=>a.id==='lion')!;expect(a.worldX).toBe(lion(sim).x/256);expect(a.worldY).toBe(lion(sim).y/256);
   expect(sim.solveTask(req.req.ctx).some(e=>e.type==='taskSolved')).toBe(true);expect([draw(sim).w,draw(sim).h]).toEqual([96,96]);sim.step(IDLE_PAD);const resumed=start(level,structuredClone(learning));expect([draw(resumed).w,draw(resumed).h]).toEqual([96,96]);answered=true;break;
  }expect(answered).toBe(true);
 });
});
