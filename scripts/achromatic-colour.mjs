// CODEX DRAFT — NOT CANON. Separate neutral-body measurement; ordinary colour laws are untouched.
import {createHash} from 'node:crypto';
import {OPAQUE,fields,WORD_FAMILY} from './material-classes.mjs';
export const NEUTRAL_LIMITS=Object.freeze({blackMax:105,blackSpread:32,whiteMin:185,whiteSpread:32,whiteLuma:200,coverage:.80,componentShare:.70,coreShare:.45,erosionRadius:2});
const allowed=new Set(Object.keys(WORD_FAMILY));
export const colourPair=word=>{const a=typeof word==='string'?word.trim().toLowerCase().split(/\s+and\s+/):[];return a.length===2&&new Set(a).size===2&&a.every(w=>allowed.has(w))?a.sort():null;};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const quantiles=a=>{a.sort((a,b)=>a-b);return a.length?[.05,.5,.95].map(p=>a[Math.floor((a.length-1)*p)]):[];};
export function measureNeutralRegions(png,reading){
 const errors=[],regions=[],{width:w,height:h,data}=png;
 if(!reading||w!==reading.width||h!==reading.height||data.length!==w*h*4)return {errors:['neutral-regions: dimensions do not match the recorded anatomical frame'],regions};
 const occupied=new Uint8Array(w*h);
 if(!Array.isArray(reading.regions)||reading.regions.length<2||!['black','white'].every(c=>reading.regions.some(r=>r.colour===c)))return {errors:['neutral-regions: both body colours need recorded regions'],regions};
 for(const r of reading.regions){
  const ints=[r.x,r.y,r.w,r.h].every(Number.isInteger),area=r.w*r.h;
  if(!ints||r.x<0||r.y<0||r.w<20||r.h<20||r.x+r.w>w||r.y+r.h>h||!['black','white'].includes(r.colour)){errors.push(`neutral-regions: invalid region ${r.id}`);continue;}
  const mask=new Uint8Array(area),channels=[[],[],[]];let opaque=0,overlap=false;
  for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){
   const p=(r.y+y)*w+r.x+x,i=p*4;overlap ||= occupied[p]===1;occupied[p]=1;
   const [red,green,blue,alpha]=data.subarray(i,i+4);if(alpha<OPAQUE)continue;opaque++;
   [red,green,blue].forEach((v,j)=>channels[j].push(v));
   const hi=Math.max(red,green,blue),lo=Math.min(red,green,blue),spread=hi-lo;
   const passes=r.colour==='black'?hi<=NEUTRAL_LIMITS.blackMax&&spread<=NEUTRAL_LIMITS.blackSpread
    :lo>=NEUTRAL_LIMITS.whiteMin&&spread<=NEUTRAL_LIMITS.whiteSpread&&.2126*red+.7152*green+.0722*blue>=NEUTRAL_LIMITS.whiteLuma;
   if(passes)mask[y*r.w+x]=1;
  }
  if(overlap)errors.push(`neutral-regions: overlapping region ${r.id}`);
  const blobs=fields(mask,r.w,r.h),largest=blobs[0]?.length??0,qualifying=mask.reduce((a,b)=>a+b,0),radius=NEUTRAL_LIMITS.erosionRadius;
  let core=0;for(let y=radius;y<r.h-radius;y++)for(let x=radius;x<r.w-radius;x++){let full=true;for(let dy=-radius;dy<=radius&&full;dy++)for(let dx=-radius;dx<=radius;dx++)if(!mask[(y+dy)*r.w+x+dx]){full=false;break;}if(full)core++;}
  const result={id:r.id,colour:r.colour,area,opaque,qualifying,coverage:qualifying/area,largest,componentShare:largest/area,core,coreShare:core/area,rgbQuantiles:channels.map(quantiles)};regions.push(result);
  if(result.coverage<NEUTRAL_LIMITS.coverage||result.componentShare<NEUTRAL_LIMITS.componentShare||result.coreShare<NEUTRAL_LIMITS.coreShare)errors.push(`neutral-regions: ${r.id} lacks a broad opaque ${r.colour} body field (coverage ${result.coverage.toFixed(3)}, component ${result.componentShare.toFixed(3)}, core ${result.coreShare.toFixed(3)})`);
 }
 return {errors,regions};
}
export function checkDualColour({png,bytes,task,reading}){
 const errors=[];
 if(!reading)return {errors:['dual-colour: no chapter-qualified anatomical reading'],regions:[]};
 const pair=colourPair(task.colour);
 if(!same(pair,['black','white'])||!same(colourPair(reading.word),pair))errors.push('dual-colour: the card and reading must name black and white');
 if(!reading.why?.trim())errors.push('dual-colour: reading has no rationale');
 if(createHash('sha256').update(bytes).digest('hex')!==reading.sourceSha256)errors.push('dual-colour: source bytes changed; anatomical reading must be reviewed');
 const options=task.colourOptions??[],pairs=options.map(colourPair);
 if(!options.includes(task.colour))errors.push('dual-colour: answer is absent from options');
 if(pairs.some(p=>p===null))errors.push('dual-colour: every option must name two distinct taught colours');
 const keys=pairs.filter(Boolean).map(p=>p.join('+'));
 if(new Set(keys).size!==keys.length)errors.push('dual-colour: equivalent duplicate options');
 if(pairs.some(p=>p&&!same(p,pair)&&p.some(c=>pair?.includes(c))))errors.push('dual-colour: distractor shares a true target colour');
 const m=measureNeutralRegions(png,reading);return {errors:[...errors,...m.errors],regions:m.regions};
}

/** Synthetic instrument checks only; the file walker measures the real art. */
export function neutralSelftestCases(){
 const reading={width:64,height:40,regions:[{id:'body',colour:'black',x:2,y:4,w:24,h:32},{id:'belly',colour:'white',x:36,y:4,w:24,h:32}]};
 const make=()=>{const p={width:64,height:40,data:new Uint8Array(64*40*4)};for(const r of reading.regions)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const i=(y*p.width+x)*4,v=r.colour==='black'?45:240;p.data.set([v,v,v,255],i);}return p;};
 const edit=(p,colour,fn)=>{for(const r of reading.regions.filter(r=>r.colour===colour))for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)fn(p.data,(y*p.width+x)*4,x,y);};
 const cases=[['broad opaque neutral body and belly',()=>{},true],
  ['opaque white body has no black interior',p=>edit(p,'black',(d,i)=>d.set([240,240,240,255],i)),false],
  ['warm ivory is not neutral white',p=>edit(p,'white',(d,i)=>d.set([208,185,134,255],i)),false],
  ['transparent white RGB cannot replace belly',p=>edit(p,'white',(d,i)=>d[i+3]=0),false],
  ['saturated blue is not black',p=>edit(p,'black',(d,i)=>d.set([25,50,120,255],i)),false],
  ['yellow is not neutral white',p=>edit(p,'white',(d,i)=>d.set([240,220,30,255],i)),false],
  ['perforated neutral specks cannot replace solid body',p=>edit(p,'white',(d,i,x,y)=>{if(x%4===0&&y%4===0)d.set([35,35,35,255],i);}),false]];
 return cases.map(([name,mutate,green])=>{const p=make();mutate(p);const m=measureNeutralRegions(p,reading);return {name:'[neutral] '+name,pass:(m.errors.length===0)===green};});
}
