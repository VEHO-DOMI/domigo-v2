// CODEX DRAFT — NOT CANON. Actual render bodies with a recording display adapter.
import React from 'react';
import {it,expect} from 'vitest';
import fs from 'node:fs';import {fileURLToPath} from 'node:url';import vm from 'node:vm';import {createRequire,stripTypeScriptTypes} from 'node:module';
import {fromSubs} from './paint.ts';
import {sceneWithActorWash,sceneDrawItems,sceneImagePlacement} from './scene-v2.ts';
import {washAlphaFor} from './anim.ts';
import {phaseArtScope,phaseRequiredStems} from './artScope.ts';
import {CardShell} from './cards/CardShell.tsx';
const root=fileURLToPath(new URL('../../../',import.meta.url)).replace(/\/$/,'');
const {renderToStaticMarkup}=createRequire(root+'/apps/web/package.json')('react-dom/server');
const source=fs.readFileSync(new URL('./PaintScene.ts',import.meta.url),'utf8');
const level=JSON.parse(fs.readFileSync(root+'/content/corpus/stories/g1.st.lost-pages/paint/ch02.level.json','utf8'));
const tasks=JSON.parse(fs.readFileSync(root+'/content/corpus/stories/g1.st.lost-pages/paint/ch02.tasks.v2.json','utf8')).items;
const snap=()=>({entityId:'fenn',beatId:'b12',viewId:'b12',round:1,view:{x:0,y:0,width:160,height:120},actors:[
 {id:'fenn',skin:'fenn',x:.5,y:1,z:'front' as const,displayHeightPx:30,cell:'awake_name',count:1},
 {id:'friend',skin:'besucherkinder',x:.2,y:1,z:'front' as const,displayHeightPx:30,cell:'wave_a',count:1}],props:[{id:'panel',skin:'panel',anchor:{x:.5,y:1},canvas:{widthPx:160,heightPx:120}}],relations:[]});
const art={fenn_awake_name:'/fenn.png',besucherkinder_wave_a:'/friend.png',panel_a:'/panel.png'};
function img(){const o:any={frame:{realWidth:512,realHeight:512}};for(const k of ['Visible','Texture','Position','DisplaySize','Depth','Alpha','Rotation','Origin','Crop'])o['set'+k]=(...v:any[])=>{o[k]=v;return o;};return o;}
function adapter(){const g:any={rectangles:0};for(const k of ['clear','fillStyle','lineStyle','strokeRoundedRect'])g[k]=()=>g;g.fillRoundedRect=()=>{g.rectangles++;return g;};const o:any={cfg:{reducedMotion:false},world:{entities:[],projectiles:[]},projG:g,projImgs:[],zooSceneImgs:new Map(),zooSceneLabels:new Map(),entityImgs:new Map(),washImgs:new Map(),bloomImgs:new Map(),stagePropImgs:new Map(),sim:{learning:{transfers:[]}},add:{image:()=>img(),graphics:()=>({...g,setDepth(){return this;}})},textures:{exists:()=>true},greyTexOf:(k:string)=>k+'-grey',scenePlaceholder:()=> 'placeholder'};return o;}
function runZoo(o:any){const a=source.indexOf('  private renderZooScenes()'),b=source.indexOf('  private renderEntities()',a);const js=stripTypeScriptTypes(source.slice(a,b).replace('private renderZooScenes','function draw'));const c=vm.createContext({sceneWithActorWash,sceneDrawItems,sceneImagePlacement,washAlphaFor,structuredClone,fromSubs,zooEntityCell:()=> 'awake_name',ZOO_FRIEND_CELLS:{walking:'walk0',waiting:'wave_a'},classmatePresentationProps:()=>[]});vm.runInContext(js,c);c.draw.call(o);}
function runProjectiles(o:any){const a=source.indexOf('    this.projG.clear();',source.indexOf('private renderEntities')),b=source.indexOf("    // R3-4's `tafel_hand`",a);const c=vm.createContext({fromSubs});vm.runInContext('function draw(){'+source.slice(a,b)+'}',c);c.draw.call(o);}
it('keeps every awakening degree on the world owner, without greying friends or props or retaining the old pose',()=>{
 const o=adapter();const e:any={id:'fenn',role:'classmate',skin:'fenn',x:0,y:0,state:'awake',redeemed:false,timer:0,params:{},classmateScene:snap()};o.world.entities=[e];
 for(let step=0;step<=6;step++){e.awakenStep=step;e.redeemed=step===6;e.freedTick=999;runZoo(o);const expected=washAlphaFor(e,false);const w=o.zooSceneImgs.get('fenn:fenn:0:wash');if(expected){expect(w?.Visible).toEqual([true]);expect(w.Alpha).toEqual([expected]);expect(w.Texture).toEqual(['pb-fenn_awake_name-grey']);}else expect(w?.Visible).toEqual([false]);expect(o.zooSceneImgs.has('fenn:friend:0:wash')).toBe(false);expect(o.zooSceneImgs.has('fenn:panel:wash')).toBe(false);}
 e.redeemed=false;e.awakenStep=2;e.classmateScene.actors[0].cell='awake_from';runZoo(o);expect(o.zooSceneImgs.get('fenn:fenn:0:wash').Texture).toEqual(['pb-fenn_awake_from-grey']);
});
it('card shell passes its existing portrait wash to the actual scene owner only; snapshot remains unchanged',()=>{
 const snapshot=snap(),before=structuredClone(snapshot);const task=tasks.find((t:any)=>t.id==='g1.paint.ch02.b12');
 for(const wash of [1,.76,.4,0]){const html=renderToStaticMarkup(React.createElement(CardShell,{task,attempts:0,onDismiss:()=>{},round:{n:1,of:6},portraitWash:wash,sceneSnapshot:snapshot,art,children:null}));const images=[...html.matchAll(/<image\b[^>]+>/g)].map(m=>m[0]);expect(images).toHaveLength(3);const owner=images.find(i=>i.includes('/fenn.png'))!;expect(owner.includes(`grayscale(${wash})`)).toBe(wash!==0);expect(images.filter(i=>i.includes('grayscale'))).toHaveLength(wash?1:0);}
 expect(snapshot).toEqual(before);
});
it('generic scene wash helper preserves geometry and unrelated actors',()=>{const s=snap(),before=structuredClone(s),x=sceneWithActorWash(s,'fenn',.4);expect(sceneDrawItems(x).find(i=>i.id==='fenn:0')?.wash).toBe(.4);expect(sceneDrawItems(x).find(i=>i.id==='friend:0')?.wash).toBeUndefined();expect(s).toEqual(before);expect(x.view).toEqual(s.view);});
it('actual flying plate is painted once at the unchanged centre and 24×8 extent, then old sprite disappears',()=>{const o=adapter();o.world.projectiles=[{kind:'plate',skin:'stabplatte',x:25600,y:51200,age:10}];runProjectiles(o);expect(o.projG.rectangles).toBe(0);expect(o.projImgs).toHaveLength(1);expect(o.projImgs[0]).toMatchObject({Texture:['pb-stabplatte'],Position:[100,200],DisplaySize:[24,8],Rotation:[0],Alpha:[1]});o.world.projectiles=[];runProjectiles(o);expect(o.projImgs[0].Visible).toEqual([false]);});
it('missing plate texture retains the original procedural fallback and does not allocate a sprite',()=>{const o=adapter();o.textures.exists=()=>false;o.world.projectiles=[{kind:'plate',skin:'stabplatte',x:25600,y:51200,age:10}];runProjectiles(o);expect(o.projG.rectangles).toBe(1);expect(o.projImgs).toHaveLength(0);});
it('guardian nested projectile is both required and loaded, absent guardian skin does not create a requirement',()=>{expect(phaseRequiredStems(level,'p4').has('stabplatte')).toBe(true);expect(phaseArtScope(level,'p4',new Set(['stabplatte'])).has('stabplatte')).toBe(true);const copy=structuredClone(level);delete copy.arena.entities.find((e:any)=>e.role==='guardian').params.guardian.projectileSkin;expect(phaseRequiredStems(copy,'p4').has('stabplatte')).toBe(false);});
