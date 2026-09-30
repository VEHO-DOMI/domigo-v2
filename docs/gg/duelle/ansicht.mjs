// CODEX DRAFT — NOT CANON · GEPLANT. No server writes, cookies or local storage.
import { initial, reduce, admission, revision } from './modell.mjs';
import { text, phrases } from './texte.mjs';
const view = document.querySelector('#view');
let state = initial();
let data;
let helpOpen = false;
const el = (tag, value, cls) => { const n = document.createElement(tag); if (value !== undefined) n.textContent = value; if (cls) n.className = cls; return n; };
const copy = (tag, key, cls, parameters) => el(tag, text(key, parameters), cls);
const english = (tag, value) => { const n = el(tag, value); n.lang = 'en'; return n; };
const button = (value, fn, key, secondary = false) => { const b = el('button', value, secondary ? 'secondary' : ''); b.type = 'button'; b.dataset.focusKey = key; b.onclick = fn; return b; };
const send = action => {
 const oldStage = state.stage;
 const focusKey = document.activeElement?.dataset.focusKey;
 state = reduce(state, action); render();
 if (state.stage !== oldStage) {
  const heading = view.querySelector('h2'); if (heading) { heading.tabIndex = -1; heading.focus(); }
 } else if (focusKey) {
  [...view.querySelectorAll('[data-focus-key]')].find(n => n.dataset.focusKey === focusKey)?.focus();
 }
};
const config = () => ({ consentA: state.consentA, consentB: state.mode === 'solo' || state.consentB, knownA: state.knownA, knownB: state.mode === 'solo' || state.knownB, timeScoring: false, abortPenalty: 0, deckA: data.sourceMd5, deckB: data.sourceMd5, helpA: revision, helpB: revision });
function card(item) {
 const box = el('div', undefined, 'paper');
 box.append(el('p', item.stimulus.showsDe), el('h2', item.storyDe));
 return box;
}
function glossary(values = Object.keys(phrases)) {
 const list = el('dl', undefined, 'glossary');
 for (const value of values) list.append(english('dt', value), el('dd', phrases[value].meaning));
 return list;
}
function comparison(item, selected) {
 const box = el('div', undefined, 'paper');
 box.append(copy('p', 'selected'), english('blockquote', selected), el('p', phrases[selected].meaning), copy('p', 'sourceAnswer'), english('blockquote', item.answer), el('p', phrases[item.answer].meaning));
 return box;
}
function render() {
 view.replaceChildren(); view.dataset.stage = state.stage;
 const actions = el('div', undefined, 'actions');
 const add = (key, action, secondary = false) => actions.append(button(text(key), () => send(action), key, secondary));
 const paired = state.mode === 'pair';
 if (state.stage === 'welcome') {
  view.append(copy('h2', 'welcomeTitle'), copy('p', 'welcomeBody'));
  add('preparePair', { type: 'prepare', mode: 'pair' }); add('prepareSolo', { type: 'prepare', mode: 'solo' }, true);
 } else if (state.stage === 'prepare') {
  view.append(copy('h2', 'prepareTitle'), copy('p', 'prepareBody'), glossary(), copy('p', 'preparePractice'));
  add('toReady', { type: 'ready' });
 } else if (state.stage === 'ready') {
  view.append(copy('h2', 'readyTitle'), copy('p', 'readyBody'));
  const fields = [['consentA', paired ? 'consentA' : 'consentSolo'], ['knownA', paired ? 'knownA' : 'knownSolo']];
  if (paired) fields.push(['consentB', 'consentB'], ['knownB', 'knownB']);
  for (const [field, key] of fields) {
   const label = el('label'); const input = el('input');
   input.type = 'checkbox'; input.checked = state[field]; input.dataset.focusKey = field;
   input.onchange = () => send({ type: 'confirm', field, value: input.checked });
   label.append(input, document.createTextNode(text(key))); view.append(label);
  }
  const result = admission(config()); view.append(el('p', result.ok ? text('readyYes') : result.reason, 'note'));
  const start = button(text('start'), () => send({ type: 'start', config: config() }), 'start'); start.disabled = !result.ok; actions.append(start);
  add('practice', { type: 'practice' }, true);
  if (paired) add('prepareSolo', { type: 'prepare', mode: 'solo' }, true);
 } else if (state.stage === 'question') {
  const item = data.items[state.round];
  view.append(paired ? copy('p', state.round === 0 ? 'roleA' : 'roleB', 'label') : copy('p', 'soloRound', 'label', { number: state.round + 1 }), card(item));
  view.append(copy('p', paired ? 'choosePair' : 'chooseSolo'));
  const options = el('div', undefined, 'options');
  item.options.forEach(value => {
   const b = button(value, () => send({ type: 'choose', value }), value); b.lang = 'en';
   b.setAttribute('aria-pressed', String(state.answers[state.round] === value)); options.append(b);
  }); view.append(options);
  const help = el('details'); help.open = helpOpen; help.ontoggle = () => { helpOpen = help.open; };
  help.append(copy('summary', 'help'), glossary(item.options)); view.append(help);
  if (!state.answers[state.round]) view.append(copy('p', 'empty', 'note'));
  const compare = button(text('compare'), () => send({ type: 'reveal' }), 'compare'); compare.disabled = !state.answers[state.round]; actions.append(compare);
  add('pause', { type: 'pause' }, true);
 } else if (state.stage === 'feedback') {
  const item = data.items[state.round];
  view.append(copy('h2', 'feedbackTitle'), el('p', item.storyDe), comparison(item, state.answers[state.round]), copy('p', 'compareBody'), copy('p', paired ? 'feedbackPair' : 'feedbackSolo'));
  add('retry', { type: 'retry' }, true); add('next', { type: 'next' }); add('pause', { type: 'pause' }, true);
 } else if (state.stage === 'handover') {
  view.append(copy('h2', paired ? 'handoverPair' : 'handoverSolo'), copy('p', paired ? 'handoverBodyPair' : 'handoverBodySolo'));
  add('handover', { type: 'handover' }); add('pause', { type: 'pause' }, true);
 } else if (state.stage === 'summary') {
  view.append(copy('h2', 'summaryTitle'));
  data.items.forEach((item, i) => { view.append(card(item), comparison(item, state.answers[i])); });
  view.append(copy('p', paired ? 'summaryPair' : 'summarySolo')); add('restart', { type: 'restart' }, true);
 } else if (state.stage === 'paused') {
  view.append(copy('h2', 'pauseTitle'), copy('p', 'pauseBody')); add('resume', { type: 'resume' });
 } else if (state.stage === 'end-confirm') {
  view.append(copy('h2', 'endTitle'), copy('p', 'endBody'));
  add('keep', { type: 'keep' }); add('end', { type: 'end' }, true);
 } else if (state.stage === 'ended') {
  view.append(copy('h2', 'endedTitle'), copy('p', 'endedBody')); add('restart', { type: 'restart' });
 }
 if (!['welcome', 'ended', 'end-confirm'].includes(state.stage)) add('askEnd', { type: 'ask-end' }, true);
 view.append(actions);
}
for (const element of document.querySelectorAll('[data-copy]')) element.textContent = text(element.dataset.copy);
document.title = `${text('title')} · GEPLANT`;
try {
 const response = await fetch('./muster-daten.json'); if (!response.ok) throw new Error('Missing data');
 data = await response.json();
 if (data.items.length !== 2 || data.items.some(item => !item.options.includes(item.answer) || item.options.some(value => !phrases[value]))) throw new Error('Incomplete set');
 render();
} catch { view.replaceChildren(copy('p', 'loadError', 'error')); }
