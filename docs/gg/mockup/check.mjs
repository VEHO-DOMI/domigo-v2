// CODEX DRAFT — NOT CANON. Bounded source/render/HTTP checks; no product battery.
import assert from 'node:assert/strict';
import { readFile, mkdtemp } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { build, inputs, repo, sourceDir, fingerprint, publicFiles } from './build.mjs';
import { inventory } from './inventory.mjs';
import { allCopy, publicCopy } from './copy.mjs';
import { scenarioList } from './model.mjs';
import { render } from './render.mjs';
const n=process.argv.indexOf('--out');
const out=n<0?await mkdtemp(path.join(tmpdir(),'cgo-032-check-')):path.resolve(process.argv[n+1]);
if(!process.argv.includes('--no-build'))await build(out);
const read=async name=>JSON.parse(await readFile(path.join(out,name),'utf8'));
const {source}=await inputs();
const actual=await read('tasks.private.json');
assert.deepEqual(actual,source,'Originale, volle Schlüssel und Musterdefinition an Quellen gebunden');
const lesson=await read('lesson.public.json');
assert.deepEqual(lesson.tasks,source.tasks,'Öffentlicher Aufgabenreiz entspricht dem tatsächlich gebauten Quellvertrag');
assert.deepEqual(lesson.copy,publicCopy,'Öffentliche Textdatei entspricht dem vollständigen Textregister');
assert.deepEqual(lesson.scenes,scenarioList(source).map(({id,label})=>({id,label})),'Zustandsliste aus tatsächlichem Modell');
const manifest=await read('build.json');
for(const [file,md5] of Object.entries(manifest.implementation))assert.equal(fingerprint(await readFile(path.join(sourceDir,file))),md5,`Build passt zu Implementierung ${file}`);
const inv=await inventory();
assert.deepEqual(JSON.parse(await readFile(path.resolve(sourceDir,'../pedagogy/student-texts.json'),'utf8')),inv,'Dauerhaftes Textregister entspricht tatsächlichen Renderwegen');
const forbidden=new Set(['answers','answer','correct','correctLetter','acceptedAnswers','rationale','explanation','originals','tier','provenance','copy']);
function noPrivate(value){if(Array.isArray(value))value.forEach(noPrivate);else if(value&&typeof value==='object')for(const [k,v]of Object.entries(value)){assert.ok(!forbidden.has(k),`Löserpaket enthält kein privates Feld ${k}`);noPrivate(v);}}
for(const key of ['word','grammar']){
  const solver=await read(`solver-${key}.public.json`);noPrivate(solver);assert.deepEqual(solver.task,source.tasks[key],'Löser sieht denselben Aufgabenreiz');
  assert.equal(fingerprint(await readFile(path.join(out,`solver-${key}.public.json`))),manifest.solver[key]);
}
const wordSolver=await read('solver-word.public.json');
assert.ok(!JSON.stringify(wordSolver).toLowerCase().includes(source.originals.vocab.w.toLowerCase()),'Wortpaket enthält das Zielwort weder im Reiz noch in Kennungen/Metadaten');
const html=await readFile(path.join(out,'index.html'),'utf8');
assert.ok(html.includes('lang="de"')&&html.includes(allCopy['ui.loading']),'Deutsche anfängliche Ladeansicht');
for(const key of ['teacher.brand','teacher.title','teacher.idle','teacher.noPoints','ui.loading'])assert.ok(html.includes(`data-static-copy="${key}">${allCopy[key]}<`),`Statische Start-/Fehlerbeschriftung ${key}`);
assert.ok(html.includes('<details class="areas" hidden>'),'Navigation erst nach erfolgreichem Laden bedienbar');
const app=await readFile(path.join(out,'app.js'),'utf8');
for(const key of ['ui.loadError','ui.loadAdvice','ui.reload'])assert.ok(app.includes(allCopy[key]),`Auch Offline-Ladefehler an Textregister gebunden ${key}`);
for(const item of lesson.scenes){
  // HTTP states are exercised below; pure render is additionally enumerated by inventory.
  assert.ok(inv.states.includes(item.id));
}
const port=Number(process.env.MOCKUP_CHECK_PORT||4199);
const probe=createServer();await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(port,'127.0.0.1',resolve);});await new Promise(resolve=>probe.close(resolve));
const server=spawn(process.execPath,[path.join(sourceDir,'serve.mjs'),'--no-build','--out',out,'--port',String(port)],{stdio:['ignore','pipe','pipe']});
let serverErrors='';server.stderr.on('data',x=>{serverErrors+=x;});
const base=`http://127.0.0.1:${port}`;
let graded=0;
try{
  await Promise.race([once(server.stdout,'data'),once(server,'exit').then(()=>{throw new Error('Preview failed: '+serverErrors);})]);
  const post=(url,body)=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  assert.deepEqual(await(await fetch(base+'/api/tasks')).json(),source.tasks);
  const cases=[['book',true],['Book',true],['  book  ',true],['a book',true],['the book',true],['A   BOOK',true],['books',false],['textbook',false],['English book',false],['exercise book',false],['notebook',false],['Buch',false],['bok',false],['boook',false],['boock',false],['pen',false],['<script>alert(1)</script>',false]];
  for(const [answer,correct]of cases){const r=await post('/api/answer',{task:'word',answer});assert.equal(r.status,200);assert.equal((await r.json()).correct,correct,`Worteingabe ${answer}`);graded++;}
  for(const answer of source.tasks.grammar.options){const r=await post('/api/answer',{task:'grammar',answer});assert.equal(r.status,200);assert.equal((await r.json()).correct,source.answers.grammar.some(x=>x.tier==='full'&&x.text===answer));graded++;}
  for(const {id}of lesson.scenes){
    const r=await post('/api/scenario',{scene:id});assert.equal(r.status,200,`Szenario ${id}`);const state=await r.json();
    const output=render(state,{copy:allCopy,tasks:source.tasks});assert.ok(output.includes('<h1'),`Gerenderter Zustand ${id}`);
    if(id==='summary-pending')assert.ok(!output.includes('id="again"')&&!output.includes('id="retry-save"'),'Während Warten keine Abschlussaktion');
    if(id==='word-wrong')assert.ok(output.includes('value="pen"'),'Fehlantwort bleibt erhalten');
  }
  const privatePaths=['/tasks.private.json','/build.json','/source-pins.json','/copy.mjs','/model.mjs','/solver-word.public.json','/solver-grammar.public.json','/content/corpus/units/g1-u01/grammar.json'];
  for(const file of privatePaths)assert.equal((await fetch(base+file)).status,404,`Private Datei ${file}`);
  for(const body of [null,{},[],{task:'word',answer:''},{task:'grammar',answer:'invalid'},{task:'word',answer:'a'.repeat(101)}])assert.equal((await post('/api/answer',body)).status,400,'Ungültige Anfrage');
  assert.equal((await fetch(base+'/api/answer',{method:'POST',headers:{Origin:'https://example.invalid'},body:'{}'})).status,403,'Fremde Herkunft');
  const version=await(await fetch(base+'/api/version')).json();assert.deepEqual(version,manifest);
  assert.equal(version.head,execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),'Bau gehört zum aktuellen Kopf');
  assert.deepEqual(Object.keys(version.files).sort(),[...publicFiles].sort());
  for(const [file,info]of Object.entries(version.files)){const r=await fetch(base+'/'+file);assert.equal(r.status,200,`Auslieferung ${file}`);const b=Buffer.from(await r.arrayBuffer());assert.equal(b.length,info.bytes);assert.equal(fingerprint(b),info.md5);}
  const png=await readFile(path.join(out,'assets/object.png'));assert.equal(png.readUInt32BE(16),631);assert.equal(png.readUInt32BE(20),471);
  console.log(JSON.stringify({verdict:'PASS',originalItems:2,newMockupTasks:2,gradedAnswers:graded,states:inv.states.length,registeredTexts:inv.rows.length,privateFilesDenied:privatePaths.length,deliveredFiles:publicFiles.length,out}));
}finally{server.kill('SIGTERM');if(server.exitCode===null)await once(server,'exit');}
