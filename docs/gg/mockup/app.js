// CODEX DRAFT — NOT CANON. Local teaching exemplar; no account or learning write.
import { render as learningHTML, renderTeacher } from './render.mjs';
const $=id=>document.getElementById(id);
const storageKey='domigo-cgo-032-notebook-v2';
let data, state, localError=false, dirty=false, busy=false, generation=0, timer, storageFault=false, responseFault=false;
const t=id=>{if(!data.copy[id])throw new Error(`Missing surface text: ${id}`);return data.copy[id];};
function status(id,copy,warning=false){$(id).textContent=t(copy);$(id).className=warning?'warning':'';}
function persist(){
  try {
    if(storageFault)throw new Error('Simulated local storage failure');
    localStorage.setItem(storageKey,JSON.stringify(state));localError=false;status('local-status','local.stored');return true;
  }catch{localError=true;status('local-status','local.failure',true);return false;}
}
function cancel(){generation++;busy=false;clearTimeout(timer);}
function appearance(){document.documentElement.dataset.theme=state.theme;document.documentElement.dataset.motion=state.motion;}
function banner(){
  const save=['pending','error','saved'].includes(state.saveState)?state.saveState:'idle';
  $('simulation-label').textContent=[t(state.simulated?'teacher.preset':'teacher.real'),t('teacher.'+save)].join(' ');
  $('scene').value=data.scenes.some(x=>x.id===state.stage)?state.stage:'';
}
function render(focus=true){
  const oldFocus=document.activeElement;const hadFocus=$('learning').contains(oldFocus);const focusId=oldFocus?.id;
  banner();$('learning').setAttribute('aria-busy','false');
  $('learning').innerHTML=learningHTML(state,data);$('learning').dataset.scene=state.scenarioId||state.stage;bind();
  if(focus){$('learning').querySelector('h1')?.focus({preventScroll:true});window.scrollTo(0,0);}
  else if(hadFocus){const next=focusId&&$(focusId);(next&&!next.disabled?next:$('learning').querySelector('h1'))?.focus({preventScroll:true});}
}
function go(stage){cancel();state.scenarioId='';state.stage=stage;state.ui='';persist();render();}
function startSave(){
  clearTimeout(timer);state.saveState='pending';
  if(state.saveMode==='pending')return;
  const token=generation;
  timer=setTimeout(()=>{if(token!==generation)return;state.saveState=state.saveMode==='error'?'error':'saved';persist();render(false);},1200);
}
function resetLearning(){
  cancel();state.answers={word:'',grammar:''};state.results={};state.help={word:0,grammar:0};state.usedHelp={word:false,grammar:false};state.saveState='idle';state.returnTo='';state.simulated=false;state.ui='';
}
const on=(id,fn)=>{if($(id))$(id).onclick=fn;};
function bind(){
  on('reload',()=>location.reload());
  on('start',()=>{resetLearning();go('word-card');});
  on('recall',()=>{delete state.results.word;state.help.word=0;state.returnTo='';go('word');$('answer-input').focus();});
  on('choose',()=>{state.returnTo='';delete state.results.grammar;state.help.grammar=0;go('grammar');});
  on('home',()=>go('intro'));
  on('back',()=>{
    const previous={'word-card':'intro',word:'word-card',sentence:'word',grammar:'sentence',summary:'grammar'};
    if(state.stage==='word'||state.stage==='grammar')state.usedHelp[state.stage]=true;
    go(previous[state.stage]||'intro');
  });
  on('help',()=>{const k=state.stage;delete state.results[k];state.ui='';state.help[k]=1;state.usedHelp[k]=true;persist();render(false);$('learning').querySelector('.help')?.scrollIntoView({block:'nearest'});$('learning').querySelector('.help')?.focus({preventScroll:true});});
  on('more-help',()=>{state.help.word=Math.min(4,state.help.word+1);persist();render(false);$('learning').querySelector('.help')?.scrollIntoView({block:'nearest'});$('learning').querySelector('.help')?.focus({preventScroll:true});});
  on('hide-help',()=>{state.help[state.stage]=0;persist();render(false);$('help')?.focus();});
  on('show-card',()=>{state.usedHelp.word=true;state.returnTo='word';go('word-card');});
  on('show-example',()=>{state.usedHelp.grammar=true;state.returnTo='grammar';go('sentence');});
  on('retry-save',()=>{startSave();persist();render();});
  on('again',()=>{resetLearning();go('word');$('answer-input').focus();});
  const key=state.stage;
  if(!['word','grammar'].includes(key))return;
  const input=$('answer-input');
  if(input)input.oninput=()=>{state.answers.word=input.value;state.ui='';persist();};
  $('answer-form').onchange=e=>{if(e.target.name==='answer'){state.answers[key]=e.target.value;state.ui='';persist();}};
  $('answer-form').onsubmit=async e=>{
    e.preventDefault();if(busy)return;
    const result=state.results[key];
    if(result){
      if(result.correct){if(key==='word')go('sentence');else{go('summary');startSave();persist();render();}}
      else {delete state.results[key];state.ui='';persist();render(false);(input ? $('answer-input') : $('answer-form').querySelector('input:checked')||$('answer-form').querySelector('input'))?.focus();}
      return;
    }
    if(!state.answers[key].trim()){state.ui='empty';persist();render(false);(key==='word'?$('answer-input'):$('answer-form').querySelector('input'))?.focus();return;}
    const token=++generation;busy=true;state.ui='checking';render(false);
    try{
      if(responseFault)throw new Error('Simulated response failure');
      const response=await fetch('/api/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:key,answer:state.answers[key]})});
      if(!response.ok)throw new Error('Answer unavailable');
      const verdict=await response.json();if(token!==generation)return;
      state.results[key]=verdict;state.ui='';state.help[key]=0;persist();render(false);$('learning').querySelector('.feedback')?.scrollIntoView({block:'nearest'});$('learning').querySelector('.feedback')?.focus({preventScroll:true});
    }catch{if(token!==generation)return;state.ui='check-error';persist();render(false);}
    finally{if(token===generation)busy=false;}
  };
}
async function setScene(id){
  cancel();const token=generation;
  try{
    const response=await fetch('/api/scenario',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scene:id})});
    if(!response.ok)throw new Error('Scenario unavailable');const next=await response.json();if(token!==generation)return;
    for(const key of ['note','noteDraft','theme','motion','saveMode'])next[key]=state[key];
    state=next;persist();render();$('scene').value=id;
  }catch{if(token===generation)status('local-status','teacher.sceneError',true);}
}
function validSaved(saved){
  if(!saved||saved.version!==2||!['intro','word-card','word','sentence','grammar','summary','load-error'].includes(saved.stage))return false;
  if(typeof saved.note!=='string'||typeof saved.noteDraft!=='string'||saved.note.length>4000||saved.noteDraft.length>4000)return false;
  if(!saved.answers||!['word','grammar'].every(k=>typeof saved.answers[k]==='string'&&saved.answers[k].length<=100))return false;
  return true;
}
async function boot(){
  const response=await fetch('/lesson.public.json');if(!response.ok)throw new Error('Lesson unavailable');data=await response.json();state=structuredClone(data.initial);
  $('teacher').innerHTML=renderTeacher(data);$('teacher').hidden=false;document.querySelector('.areas').hidden=false;
  for(const [id,key] of [['brand','teacher.brand'],['areas-label','teacher.areas'],['top-home','ui.home'],['teacher-link','teacher.title'],['teacher-label','teacher.title'],['simulation-warning','teacher.noPoints']])$(id).textContent=t(key);
  $('learning').setAttribute('aria-label',t('ui.practice'));
  let restored=false;
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(saved){
      if(!validSaved(saved))throw new Error('Invalid saved state');
      const original=state;state={...original,...saved,help:{word:0,grammar:0},usedHelp:{word:!!saved.usedHelp?.word,grammar:!!saved.usedHelp?.grammar},results:{},ui:''};
      for(const k of ['theme','motion','saveMode','saveState']){
        const allowed={theme:['system','light','dark'],motion:['system','reduce'],saveMode:['success','pending','error'],saveState:['idle','pending','error','saved']}[k];
        if(!allowed.includes(state[k]))state[k]=original[k];
      }
      if(state.stage==='load-error')state.stage='intro';
      if(!data.tasks.grammar.options.includes(state.answers.grammar))state.answers.grammar='';
      // A persisted verdict is never trusted; re-check actual input against this build.
      for(const key of ['word','grammar'])if(saved.results?.[key]&&state.answers[key].trim()){
        const r=await fetch('/api/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:key,answer:state.answers[key]})});
        if(!r.ok)throw new Error('Restore unavailable');state.results[key]=await r.json();
      }
      if(state.stage==='summary'&&(!state.results.word?.correct||!state.results.grammar?.correct)){state.stage='word';state.saveState='idle';}
      restored=state.noteDraft!==state.note;
    }
  }catch{localError=true;status('local-status','local.invalid',true);}
  $('note').value=state.noteDraft;dirty=state.noteDraft!==state.note;
  if(restored)status('note-status','local.restored',true);
  $('note').oninput=()=>{state.noteDraft=$('note').value;dirty=state.noteDraft!==state.note;status('note-status',dirty?'local.draft':'local.idle',dirty);if(persist()&&dirty)status('local-status','local.recovered');};
  $('save-note').onclick=()=>{const previous=state.note;state.note=$('note').value;if(persist()){dirty=false;status('note-status','local.saved');}else{state.note=previous;dirty=true;status('note-status','local.failure',true);}};
  $('top-home').onclick=()=>{go('intro');document.querySelector('.areas').open=false;};
  $('scene').onchange=e=>setScene(e.target.value);
  $('save-mode').value=state.saveMode;$('save-mode').onchange=e=>{state.saveMode=e.target.value;if(state.stage==='summary'&&state.saveState==='pending')startSave();persist();};
  for(const key of ['theme','motion']){$(key).value=state[key];$(key).onchange=e=>{state[key]=e.target.value;appearance();persist();};}
  $('storage-mode').onchange=e=>{storageFault=e.target.value==='fail';$('fault-label').hidden=!storageFault;persist();};
  $('response-mode').onchange=e=>{responseFault=e.target.value==='error';state.simulated=true;banner();};
  appearance();render(false);
  if(state.stage==='summary'&&state.saveState==='pending')startSave();
}
window.addEventListener('beforeunload',e=>{if(dirty||localError){e.preventDefault();e.returnValue='';}});
boot().catch(()=>{
  $('learning').setAttribute('aria-busy','false');
  // Minimal boot failure remains usable even when the text package cannot load.
  $('learning').innerHTML='<h1 tabindex="-1">Die Übung konnte nicht geladen werden.</h1><p>Öffne die Seite erneut.</p><button id="reload" class="primary">Erneut laden</button>';
  $('reload').onclick=()=>location.reload();
});
