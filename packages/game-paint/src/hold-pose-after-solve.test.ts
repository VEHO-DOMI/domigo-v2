// CODEX DRAFT — NOT CANON. A witnessed stationary pose survives answer/save; moving actors retain their own cycle.
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {describe,it,expect} from 'vitest';
import {StageV2,type StageV2Spec} from '../../content-schema/src/paint-zoo.ts';
import {readZooJson} from './test-fixtures/zoo/read-fixture.ts';
import {Sim,type SimEvent} from './sim.ts';
import {newChapterLearning} from './learning.ts';
import type {PaintLevel} from './level.ts';
import {IDLE_PAD} from './player.ts';
import {beginSceneBeat,stepSceneBeat,worldSceneSnapshot,sceneDrawItems} from './scene-v2.ts';
import {solveStage,stepStage} from './stage-v2.ts';
import {SUBS,TILE} from './paint.ts';
const frozen=readZooJson('ch02.level.json') as PaintLevel;
const id='p1-buehne-buddy',a13='g1.paint.ch02.a13',a14='g1.paint.ch02.a14';
const sample=(hold:boolean|"absent"=true)=>{const level=structuredClone(frozen),ph=level.phases[0]!;ph.entities=ph.entities.filter(e=>e.id===id);const def=ph.entities[0]!,spec=def.params!.stageV2!;def.params!.hidden=false;
 const dog=spec.actors.find(a=>a.id==='buddy')!,bird=spec.actors.find(a=>a.id==='parrot')!;
 dog.displayHeightPx=36*416/405;dog.displayWidthPx=36*448/405;bird.displayHeightPx=18;bird.displayWidthPx=18*265/270;bird.attachTo!.offsetPx={x:-11.7,y:-19.044444444444444};
 spec.beats.find(b=>b.id==='a13')!.poseByActor={buddy:'parrot_support0'};
 const b=spec.beats.find(b=>b.id==='a14')!;b.poseByActor={buddy:'parrot_support1',parrot:'look'};if(hold!=="absent")b.holdPoseAfterSolve=hold;
 b.targetPositions.find(p=>p.actorId==='buddy')!.y=1;return level;};
const cfg=(level:PaintLevel,learning=newChapterLearning())=>({level,phaseId:'p1',learningProgress:learning,grantedAbilities:()=>['jump','hang','run','punch'],freedCageIds:()=>[]});
function observe(level=sample()){const learning=newChapterLearning();learning.flags=['penguinHome'];const sim=new Sim(cfg(level,learning));sim.warp(50,17);let request:Extract<SimEvent,{type:'task'}>|undefined;const seen:string[]=[];
 for(let tick=0;tick<500&&!request;tick++)for(const event of sim.step(IDLE_PAD)){if(event.type!=='task'||!('taskId' in event.req.ctx))continue;const task=event.req.ctx.taskId;if(task===a13){seen.push(task);sim.solveTask(event.req.ctx);}else if(task===a14){seen.push(task);request=event;}}
 expect(seen).toEqual([a13,a14]);expect(request).toBeDefined();const e=sim.world.entities.find(e=>e.id===id)!;expect(e.state).toBe('asking');return{sim,e,request:request!,level};}
const picture=(e:ReturnType<typeof observe>['e'])=>worldSceneSnapshot(e.id,e.homeX,e.homeY,e.stageRuntime!.scene,e.params.stageV2!);
const cell=(e:ReturnType<typeof observe>['e'],id='buddy')=>picture(e).actors.find(a=>a.id===id)!.cell;
const readPNG=(stem:string)=>{const{PNG}=createRequire(import.meta.url)('pngjs');return PNG.sync.read(fs.readFileSync(new URL('../../../apps/web/public/art/g1/paint/ch02/'+stem+'.png',import.meta.url))) as{width:number;height:number;data:Uint8Array};};
// Manually identified opaque toe landmarks and a back-only band (excluding head/ear), pinned to the registered source frame.
function contact(e:ReturnType<typeof observe>['e']){const items=sceneDrawItems(picture(e)),d=items.find(i=>i.id==='buddy:0')!,p=items.find(i=>i.id==='parrot:0')!,dog=readPNG(d.stem),bird=readPNG(p.stem);return [[140,269],[205,264]].map(([x,y])=>{expect(bird.data[(y!*bird.width+x!)*4+3]).toBeGreaterThanOrEqual(200);const wx=p.x-p.w/2+x!*p.w/bird.width,wy=p.y-p.h+y!*p.h/bird.height,dx=(wx-d.x+d.w/2)*dog.width/d.w,dy=(wy-d.y+d.h)*dog.height/d.h;let top=-1;for(let row=0;row<dog.height;row++)if(dog.data[(row*dog.width+Math.round(dx))*4+3]!>=200){top=row;break;}const depth=(dy-top)*d.h/dog.height;return dx>=90&&dx<=151&&top>=0&&depth>=-.15&&depth<=1.2;});}
const input=(spec:StageV2Spec)=>{const g=spec.groups[0]!;return{visible:true,playerX:(g.observer.c+.5)*TILE*SUBS,playerY:(g.observer.r+1)*TILE*SUBS,grounded:true,engage:false,flags:new Set(['penguinHome']),ownerAvailable:true};};

describe('explicit stationary pose after solving',()=>{
 it('keeps actual A14 answer, waiting and restored world on the same painted back',()=>{let{sim,e,request,level}=observe();const frozenShot=structuredClone(request.req.sceneSnapshot);expect(cell(e)).toBe('parrot_support1');expect(contact(e)).toEqual([true,true]);expect(e.stageRuntime!.scene.actors.find(a=>a.id==='buddy')!.cell).toBe('listen');
  expect(sim.solveTask(request.req.ctx).some(ev=>ev.type==='taskSolved'&&ev.taskId===a14)).toBe(true);expect(e.state).toBe('returning');expect(cell(e)).toBe('parrot_support1');expect(contact(e)).toEqual([true,true]);
  // Sim writes the real scene cell into ChapterLearningState in solveTask.
  sim=new Sim(cfg(level,JSON.parse(JSON.stringify(sim.learning))));sim.warp(50,17);e=sim.world.entities.find(x=>x.id===id)!;expect(e.state).toBe('returning');expect(cell(e)).toBe('parrot_support1');expect(contact(e)).toEqual([true,true]);sim.step(IDLE_PAD);expect(e.state).toBe('waiting');expect(contact(e)).toEqual([true,true]);
  sim=new Sim(cfg(level,JSON.parse(JSON.stringify(sim.learning))));sim.warp(50,17);e=sim.world.entities.find(x=>x.id===id)!;expect(e.state).toBe('waiting');expect(cell(e)).toBe('parrot_support1');expect(contact(e)).toEqual([true,true]);for(let n=0;n<4;n++)sim.step(IDLE_PAD);expect(e.state).toBe('complete');expect(cell(e)).toBe('parrot_support1');expect(contact(e)).toEqual([true,true]);expect(request.req.sceneSnapshot).toEqual(frozenShot);
 });
 it('leaves absent and false opt-ins identical to the legacy post-answer picture',()=>{const absent=observe(sample("absent")),off=observe(sample(false));absent.sim.solveTask(absent.request.req.ctx);off.sim.solveTask(off.request.req.ctx);expect(cell(absent.e)).toBe('listen');expect(cell(off.e)).toBe('listen');expect(JSON.stringify(picture(absent.e))).toBe(JSON.stringify(picture(off.e)));expect(contact(absent.e).every(Boolean)).toBe(false);});
 it('never commits a held cell to an actor with an authored return path',()=>{const level=sample(),b=level.phases[0]!.entities[0]!.params!.stageV2!.beats.find(b=>b.id==='a14')!;b.afterSolve=[{actorId:'buddy',waypoints:[{x:.8,y:1}],ticks:12}];const{sim,e,request}=observe(level);sim.solveTask(request.req.ctx);expect(e.stageRuntime!.scene.actors.find(a=>a.id==='buddy')!.cell).toBe('listen');const spec=e.params.stageV2!;stepStage(e,undefined,input(spec));expect(cell(e)).toMatch(/^walk/);for(let n=1;n<12;n++)stepStage(e,undefined,input(spec));expect(cell(e)).toBe('a');expect(e.stageRuntime!.returnedActors).toEqual(['buddy']);expect(cell(e,'parrot')).toBe('look');});
 it('the next beat computes its own walking and endpoint cells normally',()=>{const{sim,e,request}=observe();sim.solveTask(request.req.ctx);const spec=e.params.stageV2!,next=structuredClone(spec.beats.find(b=>b.id==='a13')!);const scene=e.stageRuntime!.scene;beginSceneBeat(scene,next);stepSceneBeat(scene,spec,next);expect(scene.returning).toBe(false);expect(cell(e)).toMatch(/^walk/);expect(scene.actors.find(a=>a.id==='buddy')!.cell).toMatch(/^walk/);for(let n=1;n<next.moveTicks;n++)stepSceneBeat(scene,spec,next);expect(scene.actors.find(a=>a.id==='buddy')!.cell).toBe('listen');expect(cell(e)).toBe('parrot_support0');});
 it('cannot commit an endpoint pose before it has actually been reached',()=>{const{e}=observe();e.stageRuntime!.scene.ticks=1;solveStage(e);expect(cell(e)).toBe('listen');});
 it('parses only boolean opt-in and still rejects an invalid authored pose',()=>{const spec=sample().phases[0]!.entities[0]!.params!.stageV2!;expect(StageV2.parse(spec)).toEqual(spec);const b=spec.beats.find(b=>b.id==='a14')!;for(const invalid of ['true',1,null]){b.holdPoseAfterSolve=invalid as never;expect(StageV2.safeParse(spec).success).toBe(false);}b.holdPoseAfterSolve=true;b.poseByActor={buddy:'invented'};expect(StageV2.safeParse(spec).success).toBe(false);});
});
