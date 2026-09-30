// CODEX DRAFT — NOT CANON · GEPLANT. No server writes, cookies or local storage.
import { initial, reduce, admission, revision } from './modell.mjs';
const view = document.querySelector('#view');
let state = initial();
let data;
const el = (tag, text, cls) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (text, fn, secondary = false) => { const b = el('button', text, secondary ? 'secondary' : ''); b.type = 'button'; b.onclick = fn; return b; };
const send = action => { state = reduce(state, action); render(); };
const config = () => ({ consentA:state.consentA, consentB:state.mode==='solo'||state.consentB, knownA:state.knownA, knownB:state.mode==='solo'||state.knownB, timeScoring:false, abortPenalty:0, deckA:data.sourceMd5, deckB:data.sourceMd5, helpA:revision, helpB:revision });
function card(t, reveal=false) { const box=el('div',undefined,'paper'); box.append(el('p',t.stimulus.showsDe),el('h2',t.storyDe)); if(reveal){box.append(el('p',t.options.join(' · ')),el('blockquote',t.answer));} return box; }
function render() {
 view.replaceChildren(); view.dataset.stage=state.stage;
 const actions=el('div',undefined,'actions');
 const add=(txt,action,secondary=false)=>actions.append(button(txt,()=>send(action),secondary));
 if(state.stage==='welcome'){
  view.append(el('h2','Zwei Rollen. Eine gemeinsame Antwort.'),el('p','Eine Person bedient, die andere erklärt. Dann wechselt ihr. Zuerst schaut ihr euch beide Aufgaben in Ruhe an.'));
  add('Gemeinsam vorbereiten',{type:'prepare',mode:'pair'});add('Lieber allein üben',{type:'prepare',mode:'solo'},true);
 }else if(state.stage==='prepare'){
  view.append(el('h2','Erst gemeinsam üben'),el('p','Lest beide Situationen, alle Möglichkeiten und die Lösungen. Erklärt euch, was die Aufforderungen bedeuten. Ihr habt so viel Zeit, wie ihr braucht.'));
  data.items.forEach(t=>view.append(card(t,true)));
  add('Zur Bereitschaft',{type:'ready'});
 }else if(state.stage==='ready'){
  view.append(el('h2','Möchtet ihr anfangen?'),el('p','Jede Person entscheidet selbst. Noch einmal üben ist genauso in Ordnung.'));
  const fields=[['consentA','A: Ich möchte mitmachen.'],['knownA','A: Ich habe diese Wörter vorher geübt.']];
  if(state.mode==='pair')fields.push(['consentB','B: Ich möchte mitmachen.'],['knownB','B: Ich habe diese Wörter vorher geübt.']);
  for(const [field,text] of fields){const l=el('label');const i=el('input');i.type='checkbox';i.checked=state[field];i.onchange=()=>send({type:'confirm',field,value:i.checked});l.append(i,document.createTextNode(text));view.append(l);}
  const result=admission(config());view.append(el('p',result.ok?'Ihr könnt starten.':result.reason,'note'));
  const b=button('Ohne Uhr anfangen',()=>send({type:'start',config:config()}));b.disabled=!result.ok;actions.append(b);
  add('Noch einmal üben',{type:'practice'},true);
 }else if(state.stage==='question'){
  const t=data.items[state.round];view.append(el('p',state.mode==='solo'?`Aufgabe ${state.round+1} von 2`:state.round===0?'A bedient · B erklärt':'B bedient · A erklärt','label'),card(t));
  const opts=el('div',undefined,'options');
  t.options.forEach(value=>{const b=button(value,()=>send({type:'choose',value}));b.setAttribute('aria-pressed',String(state.answers[state.round]===value));opts.append(b);});view.append(opts);
  view.append(el('p','Beratet eure Auswahl. Ihr könnt sie vor dem Aufdecken noch ändern.','note'));
  const b=button('Mit der Quelllösung vergleichen',()=>send({type:'reveal'}));b.disabled=!state.answers[state.round];actions.append(b);add('Pause',{type:'pause'},true);
 }else if(state.stage==='feedback'){
  const t=data.items[state.round];view.append(el('h2','Vergleicht und erklärt'),el('p',`Eure Auswahl: ${state.answers[state.round]}`),el('blockquote',`Quelllösung: ${t.answer}`),el('p','Passt eure Auswahl zur Handlung? Erklärt, was die Aufforderung bedeutet. Dieses Modell bewertet eure Erklärung nicht.'),el('p','Auch eine Änderung nach dem Aufdecken ist Übung, kein Beweis selbstständigen Könnens.','note'));
  add('Noch einmal auswählen',{type:'retry'},true);add('Besprochen — weiter',{type:'next'});add('Pause',{type:'pause'},true);
 }else if(state.stage==='handover'){
  view.append(el('h2',state.mode==='solo'?'Die zweite Aufgabe':'Jetzt tauscht ihr die Rollen'),el('p',state.mode==='solo'?'Gehe in deinem Tempo weiter.':'B bedient jetzt. A erklärt. Ihr löst die zweite Aufgabe wieder gemeinsam.'));
  add('Bereit für die zweite Aufgabe',{type:'handover'});add('Pause',{type:'pause'},true);
 }else if(state.stage==='summary'){
  view.append(el('h2','Was könnt ihr einander erklären?'));
  data.items.forEach((t,i)=>{const box=card(t);box.append(el('p',`Eure Auswahl: ${state.answers[i]}`),el('blockquote',`Quelllösung: ${t.answer}`));view.append(box);});
  view.append(el('p','Sagt euch eine Aufforderung und erklärt, wann sie passt. Es gibt keinen Sieger und keine Punktzahl.'));
  add('Neu beginnen',{type:'restart'},true);
 }else if(state.stage==='paused'){
  view.append(el('h2','Pause'),el('p','Eure Auswahl und Rollen bleiben in diesem geöffneten Modell erhalten. Beim Neuladen gehen sie verloren.'));
  add('An derselben Stelle weiter',{type:'resume'});
 }else if(state.stage==='end-confirm'){
  view.append(el('h2','Diesen lokalen Durchgang beenden?'),el('p','Die Antworten dieses Modells werden verworfen. Es wurden keine Produktpunkte verändert und keine Antworten dauerhaft gespeichert.'));
  add('Weiterüben',{type:'keep'});add('Durchgang beenden',{type:'end'},true);
 }else if(state.stage==='ended'){
  view.append(el('h2','Für jetzt beendet'),el('p','Kein Punktverlust, keine Niederlage. Ihr könnt jederzeit neu anfangen.'));
  add('Neuer Durchgang',{type:'restart'});
 }
 if(!['welcome','ended','end-confirm'].includes(state.stage))add('Beenden',{type:'ask-end'},true);
 view.append(actions);
}
try { const res=await fetch('./muster-daten.json'); if(!res.ok)throw new Error('Daten fehlen');data=await res.json(); if(data.items.length!==2)throw new Error('Aufgabensatz unvollständig');render(); } catch { view.replaceChildren(el('p','Das lokale Modell konnte nicht geladen werden. Bitte über den dokumentierten lokalen Server öffnen.','error')); }
