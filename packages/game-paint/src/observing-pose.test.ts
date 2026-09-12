// CODEX DRAFT — NOT CANON. Poses change only the witnessed endpoint picture.
import React from 'react';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire,stripTypeScriptTypes} from 'node:module';
import {SceneCutout} from './cards/SceneCutout.tsx';
import {fromSubs} from './paint.ts';
import {describe,it,expect} from 'vitest';
import {StageV2,type StageV2Spec} from '../../content-schema/src/paint-zoo.ts';
import {zooActorPoseCells} from '../../content-schema/src/zoo-pose-cells.ts';
import {readZooJson} from './test-fixtures/zoo/read-fixture.ts';
import type {PaintLevel} from './level.ts';
import {spawnEntities} from './entities.ts';
import {SUBS,TILE} from './paint.ts';
import {beginSceneBeat,createSceneState,stepSceneBeat,snapshotScene,worldSceneSnapshot,sceneDrawItems} from './scene-v2.ts';
import {stageV2LawErrors} from './stage-v2-laws.ts';
import {stepStage,solveStage} from './stage-v2.ts';
import {zooSnapshot} from './guardian-zoo.ts';
import {ZOO_CELLS,zooStageCell} from './zoo-visuals.ts';
import {ZOO_LION_CELLS} from './zoo-art.ts';
import {phaseArtScope,phaseRequiredStems} from './artScope.ts';
const level=readZooJson('ch02.level.json') as PaintLevel;
const def=level.phases.flatMap(p=>p.entities).find(e=>e.id==='p1-buehne-papagei')!;
const posed=()=>{const spec=structuredClone(def.params!.stageV2!);spec.actors[0]!.skin="papagei_auto";spec.beats.find(b=>b.id==='a09')!.poseByActor={parrot:'crouch'};return spec;};
const under=(s:StageV2Spec)=>s.beats.find(b=>b.id==='a09')!;
const actor=(s:{actors:{id:string;cell:string}[]})=>s.actors.find(a=>a.id==='parrot')!;
function endpoint(spec=posed()){const s=createSceneState(spec),b=under(spec);beginSceneBeat(s,b);for(let i=0;i<b.moveTicks;i++)stepSceneBeat(s,spec,b);return {s,b,spec};}
function live(){const e=spawnEntities([{...structuredClone(def),params:{...structuredClone(def.params),stageV2:posed()}}],[]).entities[0]!;e.state='waiting';const g=posed().groups.find(g=>g.id===under(posed()).groupId)!;const input={visible:true,playerX:(g.observer.c+.5)*TILE*SUBS,playerY:(g.observer.r+1)*TILE*SUBS,grounded:true,engage:true,flags:new Set<string>(),ownerAvailable:true};let req;
 for(let i=0;i<250&&!req;i++)req=stepStage(e,'g1.paint.ch02.a09',input).find(r=>r.type==='question');expect(req?.type).toBe('question');return {e,input,req};}

describe('authored observing poses',()=>{
 it('retains unchanged frozen stage specs and cells when no pose is authored',()=>{
  for(const ph of [...level.phases,...level.arena?[level.arena]:[]])for(const e of ph.entities){const spec=e.params?.stageV2;if(!spec)continue;expect(StageV2.parse(spec)).toEqual(spec);for(const b of spec.beats){const s=createSceneState(spec);beginSceneBeat(s,b);for(let n=0;n<b.moveTicks+b.holdTicks;n++){stepSceneBeat(s,spec,b);expect(snapshotScene(e.id,0,0,s,spec).actors).toEqual(s.actors);}}}
 });
 it('flies unchanged until the exact endpoint, then world and card share crouch without mutating live actors',()=>{const spec=posed(),b=under(spec),s=createSceneState(spec);beginSceneBeat(s,b);for(let t=1;t<b.moveTicks;t++){stepSceneBeat(s,spec,b);expect(actor(snapshotScene('stage',0,0,s,spec)).cell).toBe(zooStageCell('papagei','moving',t));}stepSceneBeat(s,spec,b);const before=structuredClone(s),card=snapshotScene('stage',0,0,s,spec),world=worldSceneSnapshot('stage',0,0,s,spec);expect(actor(card).cell).toBe('crouch');expect(world).toEqual(card);expect(sceneDrawItems(card).find(i=>i.id==='parrot:0')?.stem).toBe('papagei_auto_crouch');expect(s).toEqual(before);expect(actor(s).cell).toBe('look');});
 it('holds the real question/retry and save-resume pose, then clears it on solve and next begin',()=>{const {e,input,req}=live();if(req?.type!=='question')throw Error('missing question');expect(actor(req.snapshot).cell).toBe('crouch');e.stageRuntime!.retry=true;const retry=stepStage(e,'g1.paint.ch02.a09',input).find(r=>r.type==='question');expect(retry?.type==='question'&&retry.snapshot).toEqual(req.snapshot);const restored=JSON.parse(JSON.stringify(e)) as typeof e;expect(actor(worldSceneSnapshot(e.id,e.homeX,e.homeY,restored.stageRuntime!.scene,restored.params.stageV2!)).cell).toBe('crouch');solveStage(restored);expect(actor(worldSceneSnapshot(e.id,e.homeX,e.homeY,restored.stageRuntime!.scene,restored.params.stageV2!)).cell).not.toBe('crouch');beginSceneBeat(restored.stageRuntime!.scene,restored.params.stageV2!.beats[0]!);expect(actor(worldSceneSnapshot(e.id,e.homeX,e.homeY,restored.stageRuntime!.scene,restored.params.stageV2!)).cell).not.toBe('crouch');expect(actor(req.snapshot).cell).toBe('crouch');});
 it('poses a stationary actor too, while hidden selections stay hidden',()=>{const spec=posed();spec.actors.push({id:'second',skin:'papagei_auto',displayHeightPx:40,anchor:{x:.1,y:.5}});under(spec).poseByActor!.second='crouch';const {s}=endpoint(spec);expect(snapshotScene('x',0,0,s,spec).actors.find(a=>a.id==='second')?.cell).toBe('crouch');under(spec).view={actorIds:['parrot']};expect(snapshotScene('x',0,0,s,spec).actors.map(a=>a.id)).toEqual(['parrot']);});
 it('rejects unknown/ambiguous actor IDs and unsupported cells at the authored map path',()=>{for(const mode of ['actor','ambiguous','cell']){const spec=posed();if(mode==='actor')under(spec).poseByActor={missing:'crouch'};if(mode==='ambiguous')spec.actors.push(structuredClone(spec.actors[0]!));if(mode==='cell')under(spec).poseByActor={parrot:'sit0'};const result=StageV2.safeParse(spec);expect(result.success).toBe(false);if(!result.success)expect(result.error.issues.some(i=>i.path.includes('poseByActor'))).toBe(true);}});
 it('uses scene skin aliases and the same authoritative lion registry',()=>{const spec=posed();spec.actors[0]!.skin='affe';under(spec).poseByActor={parrot:'climb0'};expect(StageV2.safeParse(spec).success).toBe(true);under(spec).poseByActor={parrot:'throw0'};expect(StageV2.safeParse(spec).success).toBe(false);expect(zooActorPoseCells('loewe')).toEqual(ZOO_LION_CELLS);expect(zooActorPoseCells('papagei')).toBe(ZOO_CELLS.papagei);expect(zooActorPoseCells('unknown')).toEqual(['a']);});
 it('requires and loads crouch through the same registry',()=>{const copy=structuredClone(level);copy.phases.flatMap(p=>p.entities).find(e=>e.id===def.id)!.params!.stageV2=posed();expect(phaseRequiredStems(copy,'p1').has('papagei_auto_crouch')).toBe(true);expect(phaseArtScope(copy,'p1',new Set()).has('papagei_auto_crouch')).toBe(true);expect(phaseRequiredStems(level,'p1').has('papagei_auto_crouch')).toBe(false);expect(phaseRequiredStems(copy,'p1').has('papagei_crouch')).toBe(false);});
 it('preserves a stationary lion endpoint pose without replacing walking or return animation',()=>{const e=spawnEntities([structuredClone(level.arena!.entities.find(e=>e.role==='guardian')!)],[]).entities[0]!;const spec=e.params.stageV2!,b=spec.beats[0]!;b.poseByActor={lion:'lie0'};expect(StageV2.safeParse(spec).success).toBe(true);const s=createSceneState(spec);beginSceneBeat(s,b);for(let n=0;n<b.moveTicks;n++)stepSceneBeat(s,spec,b);e.zoo={scene:s,round:0,card:0} as NonNullable<typeof e.zoo>;e.state='report';e.vx=0;expect(zooSnapshot(e).actors.find(a=>a.id==='lion')?.cell).toBe('lie0');e.vx=SUBS;expect(zooSnapshot(e).actors.find(a=>a.id==='lion')?.cell).toMatch(/^walk/);e.vx=0;e.state='home';s.returning=true;expect(zooSnapshot(e).actors.find(a=>a.id==='lion')?.cell).toBe('follow');});
});

const {renderToStaticMarkup}=createRequire(new URL('../../../apps/web/package.json',import.meta.url))('react-dom/server');
const threeByTwo='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="150" height="100"><rect x="0" y="0" width="150" height="100" fill="red"/></svg>');
function recordedWorld(spec:StageV2Spec,s:ReturnType<typeof createSceneState>){
 const code=fs.readFileSync(new URL('./PaintScene.ts',import.meta.url),'utf8'),a=code.indexOf('  private renderZooScenes()'),b=code.indexOf('  private renderEntities()',a);
 const js=stripTypeScriptTypes(code.slice(a,b).replace('private renderZooScenes','function renderZooScenes'));
 const ctx=vm.createContext({worldSceneSnapshot,sceneDrawItems,fromSubs,structuredClone});
 vm.runInContext(js,ctx);
 const make=()=>{const o:Record<string,unknown>={};for(const k of ['Visible','Texture','Position','DisplaySize','Depth','Origin','Alpha'])o['set'+k]=(...v:unknown[])=>{o[k]=v;return o;};return o;};
 const imgs=new Map<string,Record<string,unknown>>();
 const host={world:{entities:[{id:'stage',state:'asking',homeX:0,homeY:0,params:{stageV2:spec},stageRuntime:{scene:s}}]},sim:{learning:{transfers:[]}},zooSceneImgs:imgs,zooSceneLabels:new Map(),entityImgs:new Map(),washImgs:new Map(),bloomImgs:new Map(),stagePropImgs:new Map(),textures:{exists:()=>true},add:{graphics:()=>({setDepth(){return this;},clear(){}}),image:make}};
 ctx.renderZooScenes.call(host);return imgs;
}
describe('registered actor width',()=>{
 it('uses authored 36×24 in the actual world render and SVG card while keeping feet and snapshot independent',()=>{
  const spec=posed();spec.actors[0]!.displayHeightPx=24;spec.actors[0]!.displayWidthPx=36;expect(StageV2.parse(spec)).toEqual(spec);
  const {s}=endpoint(spec),before=structuredClone(s),shot=snapshotScene('stage',0,0,s,spec),item=sceneDrawItems(shot).find(i=>i.id==='parrot:0')!;
  expect(item).toMatchObject({w:36,h:24,stem:'papagei_auto_crouch'});
  const image=recordedWorld(spec,s).get('stage:parrot:0')!;expect(image.DisplaySize).toEqual([36,24]);expect(image.Position).toEqual([item.x,item.y]);expect(image.Origin).toEqual([.5,1]);
  const html=renderToStaticMarkup(React.createElement(SceneCutout,{snapshot:shot,art:{papagei_auto_crouch:threeByTwo}}));const tag=html.match(/<image\b[^>]*>/)![0];expect(tag).toContain('width="36"');expect(tag).toContain('height="24"');expect(tag).toContain('preserveAspectRatio="none"');expect(tag).toContain('x="'+(item.x-18)+'"');expect(tag).toContain('y="'+(item.y-24)+'"');
  expect(s).toEqual(before);shot.actors[0]!.displayWidthPx=999;expect(s.actors[0]!.displayWidthPx).toBe(36);
 });
 it('keeps legacy .65 sizing and transfers the optional width through serialized snapshots and return state',()=>{
  const spec=posed();spec.actors[0]!.displayHeightPx=24;let {s}=endpoint(spec);expect(sceneDrawItems(snapshotScene('stage',0,0,s,spec)).find(i=>i.id==='parrot:0')!.w).toBeCloseTo(15.6);
  spec.actors[0]!.displayWidthPx=36;s=endpoint(spec).s;s.returning=true;const restored=JSON.parse(JSON.stringify(s)) as typeof s;expect(sceneDrawItems(worldSceneSnapshot('stage',0,0,restored,spec)).find(i=>i.id==='parrot:0')).toMatchObject({w:36,h:24});
 });
 it('rejects zero, negative, infinite, NaN and nonnumeric authored widths',()=>{for(const width of [0,-1,Infinity,NaN,'wide']){const spec=posed();spec.actors[0]!.displayWidthPx=width as number;const result=StageV2.safeParse(spec);expect(result.success).toBe(false);if(!result.success)expect(result.error.issues.some(i=>i.path.includes('displayWidthPx'))).toBe(true);}});
});

it('the existing level gate reports invalid poses and widths instead of silently skipping a bad stage',()=>{
 const lv=structuredClone(level),e=lv.phases.flatMap(p=>p.entities).find(e=>e.id===def.id)!;e.params!.stageV2=posed();expect(stageV2LawErrors(lv).filter(f=>f.detail.includes(e.id))).toEqual([]);
 under(e.params!.stageV2).poseByActor={parrot:'not-a-cell'};expect(stageV2LawErrors(lv).some(f=>f.detail.includes('poseByActor')&&f.detail.includes('unsupported pose'))).toBe(true);
 under(e.params!.stageV2).poseByActor={missing:'crouch'};expect(stageV2LawErrors(lv).some(f=>f.detail.includes('poseByActor')&&f.detail.includes('pose actor'))).toBe(true);
 under(e.params!.stageV2).poseByActor={parrot:'crouch'};e.params!.stageV2.actors[0]!.displayWidthPx=0;expect(stageV2LawErrors(lv).some(f=>f.detail.includes('displayWidthPx'))).toBe(true);
});

it('keeps the old parrot family unchanged while the car-only family shares its flight cadence',()=>{expect(ZOO_CELLS.papagei).toEqual(['a','flap0','flap1','flap2','flap3','land','look','rest']);expect(ZOO_CELLS.papagei_auto).toEqual([...ZOO_CELLS.papagei!,'crouch']);for(let tick=0;tick<48;tick++)expect(zooStageCell('papagei_auto','moving',tick)).toBe(zooStageCell('papagei','moving',tick));});
