// CODEX DRAFT — NOT CANON. Render-derived coverage, not a judgement of language quality.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allCopy, groups } from './copy.mjs';
import { inputs, sourceDir } from './build.mjs';
import { scenario, scenarioList } from './model.mjs';
import { render, renderTeacher } from './render.mjs';
export async function inventory() {
  const {source} = await inputs();
  const scenes = scenarioList(source);
  const data = {copy:allCopy,tasks:source.tasks,scenes};
  const places=new Map();
  const add=(id,place)=>{if(!Object.hasOwn(allCopy,id))throw new Error(`Missing surface text: ${id}`);if(!places.has(id))places.set(id,new Set());places.get(id).add(place);};
  for(const {id} of scenes){
    const used=new Set();const html=render(scenario(id,source,allCopy),data,used);
    if(!html.includes('<h1'))throw new Error(`Empty render state: ${id}`);
    for(const key of used)add(key,`Schülerfläche/${id}`);
  }
  const used=new Set();renderTeacher(data,used);for(const id of used)add(id,'Lehrerbereich');
  const app=await readFile(path.join(sourceDir,'app.js'),'utf8');
  // Include direct runtime-only messages; dynamic branches are separately enumerated below.
  for(const m of app.matchAll(/(?:t|status)\((?:'[^']+',)?\s*'((?:ui|teacher|local)\.[A-Za-z]+)'/g))add(m[1],'Laufzeit/Status');
  for(const id of ['teacher.brand','teacher.areas','ui.home','teacher.title','teacher.noPoints','teacher.preset','teacher.real','teacher.idle','teacher.pending','teacher.error','teacher.saved','local.draft','local.idle','local.saved','local.failure','local.stored','local.invalid','local.recovered','local.restored','ui.loading'])add(id,'Rahmen/Browserstatus');
  const rows=Object.entries(allCopy).map(([id,text])=>{
    const group=groups[id.split('.')[0]];
    return {id,text,places:[...(places.get(id)||[])].sort(),function:group.purpose,language:group.language,bookEvidence:group.evidence,exposure:group.private?'nach Antwortprüfung':'Lern-/Bedienansicht'};
  });
  const unused=rows.filter(x=>!x.places.length);
  if(unused.length)throw new Error('Unbound registry texts: '+unused.map(x=>x.id).join(', '));
  for(const task of Object.values(source.tasks))for(const option of task.options||[])rows.push({id:`${task.id}/option/${option}`,text:option,places:['Schülerfläche/grammar'],function:'Auswahlwert, keine englische Bedienvoraussetzung',language:'en; Originaloption',bookEvidence:'g1u01.gi.contractions.mc.006 rev1; SB13/14',exposure:'unmarkierte Antwortoption'});
  rows.push({id:'render/grammar-filled',text:allCopy['grammar.gap'].replace('___',source.originals.grammar.answers[0].text),places:['Schülerfläche/grammar-result-2','Schülerfläche/grammar-assisted'],function:'Korrekte Auswahl erscheint im vollständigen Satz',language:'en; vorher eingeführtes Satzmuster',bookEvidence:'SB13/14, eigener Kontext',exposure:'nach richtiger Antwort'});
  rows.push({id:'static/noscript',text:'Dieses anklickbare Lehrer-Muster benötigt JavaScript.',places:['index.html/noscript'],function:'Startvoraussetzung außerhalb der Lernhandlung',language:'de',bookEvidence:'technische Rahmeninformation',exposure:'Rahmen'});
  for(const x of scenes)rows.push({id:`teacher/scene/${x.id}`,text:x.label,places:['Lehrerbereich/Ansicht'],function:'Zustand gezielt nachstellen',language:'de; technische Zustandsnamen im Lehrerbereich',bookEvidence:'Musterautorenschaft',exposure:'Lehrerbereich'});
  return {label:'CODEX DRAFT — NOT CANON',scope:'Maschinelle Vollständigkeit und Bindung, keine Stilfreigabe',states:scenes.map(x=>x.id),rows};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const result=await inventory();
  if(process.argv.includes('--write')){
    const destination=path.resolve(sourceDir,'../pedagogy/student-texts.json');
    await writeFile(destination,JSON.stringify(result,null,2)+'\n');
  }
  console.log(JSON.stringify({states:result.states.length,texts:result.rows.length}));
}
