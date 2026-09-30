// CODEX DRAFT — NOT CANON. No production account, score or learning write.
const $ = (id) => document.getElementById(id);
const storageKey = 'domigo-cgo-007-notebook-v1';
const initial = () => ({ version: 1, stage: 'intro', selections: { vocab: '', grammar: '' }, results: {}, note: '', noteDraft: '', theme: 'system', motion: 'system', saveMode: 'success', saveState: 'idle', simulated: false });
let state = initial();
let localError = '';
let dirty = false;
let busy = false;
let timer;
let generation = 0;
let tasks;
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (saved) {
    if (saved.version !== 1 || !['intro', 'vocab', 'grammar', 'summary'].includes(saved.stage) || typeof saved.note !== 'string' || !saved.selections || !saved.results) throw new Error('saved data');
    state = { ...initial(), ...saved };
    state.noteDraft = typeof saved.noteDraft === 'string' ? saved.noteDraft : saved.note;
  }
} catch { localError = 'Lokaler Speicher nicht verfügbar oder gespeicherte Auswahl nicht lesbar. Diese Ansicht beginnt neu.'; }

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    localError = '';
    $('local-status').textContent = 'Auswahl lokal in diesem Browser gespeichert.';
    $('local-status').className = '';
    return true;
  } catch {
    localError = 'Lokal nicht gespeichert. Lass die Seite offen und sichere deine Notiz, bevor du sie schließt.';
    $('local-status').textContent = localError;
    $('local-status').className = 'warning';
    return false;
  }
}

function appearance() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.motion = state.motion;
}

function pageTop(step) {
  return `<div class="page-top"><span class="chapter">Year 1 · School things</span><span class="path" aria-label="${step} of 2 activities complete"><i class="${step > 0 ? 'done' : ''}"></i><i class="${step > 1 ? 'done' : ''}"></i><span>${step} / 2</span></span></div>`;
}

function banner() {
  const stage = { intro: 'Einstieg', vocab: 'Vokabel', grammar: 'Grammatik', summary: 'Rückmeldung' }[state.stage];
  const result = state.results[state.stage];
  const verdict = result ? (result.correct ? 'richtig' : 'Fehlantwort') : 'offen';
  const storage = { idle: 'noch nicht gezeigt', pending: 'wartet', error: 'fehlgeschlagen', saved: 'erfolgreich nachgestellt' }[state.saveState];
  $('simulation-label').textContent = `Muster: ${stage} · ${state.stage === 'summary' ? 'Lernspeichern ' + storage : verdict}${state.simulated ? ' · per Lehrerschalter gesetzt' : ''}`;
  $('scene').value = state.stage === 'summary' ? state.saveState : state.stage + (result ? (result.correct ? '-correct' : '-wrong') : '');
}

function render(focus = true) {
  banner();
  const main = $('learning');
  main.setAttribute('aria-busy', 'false');
  if (state.stage === 'intro') {
    main.innerHTML = `${pageTop(0)}<h1 tabindex="-1">A little English.<br>A new page.</h1><p class="intro-copy">Find a word for something in your school bag. Then make a sentence a little shorter.</p><section class="card hero" aria-label="Your next activity"><div><h2>What’s in your bag?</h2><p>One word.<br>One little sentence.<br>Let’s have a look.</p><button class="primary" id="start">Let’s start <span aria-hidden="true">→</span></button></div><img class="mentor" src="/assets/mentor.png" width="512" height="512" alt="A friendly ink creature waving you over."></section><p class="below-card">Take your time. You can try again.</p>`;
    $('start').onclick = () => { state.stage = 'vocab'; persist(); render(); };
  } else if (state.stage === 'summary') {
    renderSummary();
  } else {
    renderTask();
  }
  if (focus) main.querySelector('h1')?.focus({ preventScroll: true });
}

function renderTask() {
  const key = state.stage;
  const task = tasks[key];
  const result = state.results[key];
  $('learning').innerHTML = `${pageTop(key === 'vocab' ? 0 : 1)}<h1 tabindex="-1">${key === 'vocab' ? 'What is it?' : 'A little shorter.'}</h1><section class="card"><div class="task-head"><p class="eyebrow">${key === 'vocab' ? 'Find the word' : 'Put the words together'}</p><p class="eyebrow">${key === 'vocab' ? '1' : '2'} of 2</p></div><div class="task-visual"><img src="/assets/object.png" width="628" height="466" alt="Blue covers around a thick stack of pages."><p class="${key === 'grammar' ? 'speech' : ''}">${escape(task.context)}</p></div><form id="answer"><fieldset class="choices" ${result ? 'disabled' : ''}><legend>${escape(task.question)}</legend>${task.options.map((option) => `<label class="choice ${result && !result.correct && state.selections[key] === option ? 'wrong-choice' : ''}"><input type="radio" name="answer" value="${escape(option)}" ${state.selections[key] === option ? 'checked' : ''}><span>${escape(option)}</span></label>`).join('')}</fieldset>${result ? `<div class="feedback ${result.correct ? '' : 'wrong'}" role="status"><strong>${result.correct ? 'That’s it.' : 'Not quite yet.'}</strong><p>${escape(result.explanation)}</p></div>` : ''}<div class="actions"><button class="primary" id="advance" ${!result && !state.selections[key] ? 'disabled' : ''}>${result ? (result.correct ? (key === 'vocab' ? 'Try the sentence' : 'Finish this page') : 'Try again') : 'Check my answer'}<span aria-hidden="true">→</span></button>${!result ? '<p>Choose one.</p>' : ''}</div><p id="answer-error" role="alert" hidden></p></form></section>`;
  $('answer').onchange = (event) => {
    if (event.target.name !== 'answer') return;
    state.selections[key] = event.target.value;
    persist();
    $('advance').disabled = false;
  };
  $('answer').onsubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (result) {
      if (!result.correct) {
        delete state.results[key]; state.selections[key] = '';
      } else if (key === 'vocab') state.stage = 'grammar';
      else { state.stage = 'summary'; beginSave(); }
      persist(); render(); return;
    }
    if (!state.selections[key]) return;
    const token = generation;
    busy = true;
    $('advance').disabled = true;
    $('answer').querySelector('fieldset').disabled = true;
    try {
      const response = await fetch('/api/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task: key, choice: state.selections[key] }) });
      if (!response.ok) throw new Error('answer unavailable');
      const verdict = await response.json();
      if (token !== generation) return;
      state.results[key] = verdict;
      persist(); render();
    } catch {
      if (token !== generation) return;
      $('answer-error').hidden = false;
      $('answer-error').textContent = 'I couldn’t check that. Your choice is still here. Try again.';
      $('advance').disabled = false;
      $('answer').querySelector('fieldset').disabled = false;
    } finally { busy = false; }
  };
}

function beginSave() {
  clearTimeout(timer);
  state.saveState = 'pending';
  if (state.saveMode === 'pending') return;
  timer = setTimeout(() => {
    state.saveState = state.saveMode === 'error' ? 'error' : 'saved';
    persist(); render(false);
  }, 1100);
}

function renderSummary() {
  const status = state.saveState;
  const copy = {
    pending: '<strong class="dots">Saving your page …</strong><p>Your answers are still here. Give it a moment.</p>',
    error: '<strong>Your page hasn’t been saved yet.</strong><p>Your answers are still here. Let’s try saving them again.</p><button class="primary" id="retry-save">Try saving again <span aria-hidden="true">↻</span></button>',
    saved: '<strong>Your page is saved.</strong><p>Next, practise the word and the short form once more.</p><button class="primary" id="again">Practise again <span aria-hidden="true">→</span></button>',
  };
  $('learning').innerHTML = `${pageTop(2)}<h1 tabindex="-1">You’ve got the words.</h1><section class="card"><h2>A word. A sentence.</h2><ul class="summary-list"><li><b>book</b> — you read it.</li><li><b>It is → It’s.</b><br>The apostrophe takes the place of the missing letter.</li></ul><p>It’s a book. Two things you can use together.</p><div class="save-state" role="status">${copy[status] || copy.pending}</div></section>`;
  if ($('retry-save')) $('retry-save').onclick = () => { beginSave(); persist(); render(); };
  if ($('again')) $('again').onclick = () => {
    state.stage = 'vocab'; state.selections = { vocab: '', grammar: '' }; state.results = {}; state.saveState = 'idle'; state.simulated = false;
    persist(); render();
  };
}

async function setScene(value) {
  generation++; clearTimeout(timer); busy = false;
  const token = generation;
  const [stage, verdict] = value.split('-');
  if (['pending', 'error', 'saved'].includes(stage)) {
    state.stage = 'summary'; state.saveState = stage;
  } else {
    state.stage = stage; state.saveState = 'idle';
    if (stage !== 'intro') {
      state.selections[stage] = ''; delete state.results[stage];
      if (verdict) {
        // Only the explicitly labelled teacher simulator can request a preset.
        try {
          const response = await fetch('/api/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task: stage, correct: verdict === 'correct' }) });
          if (!response.ok) throw new Error('scenario unavailable');
          const data = await response.json();
          if (token !== generation) return;
          state.selections[stage] = data.choice; state.results[stage] = data.result;
        } catch { localError = 'Musterzustand nicht geladen. Der lokale Vorschau-Server muss laufen.'; }
      }
    }
  }
  state.simulated = true; persist(); render(false);
}

$('note').value = state.noteDraft;
dirty = state.noteDraft !== state.note;
if (dirty) {
  $('note-status').textContent = 'Ungespeicherter Entwurf wiederhergestellt. Bitte Notiz lokal speichern.';
  $('note-status').className = 'warning';
}
$('note').oninput = () => {
  state.noteDraft = $('note').value;
  dirty = $('note').value !== state.note;
  $('note-status').textContent = dirty ? 'Ungespeicherte Notiz.' : 'Keine ungespeicherte Notiz.';
  $('note-status').className = dirty ? 'warning' : '';
  // Recoverable draft even in browsers that suppress the unload dialog.
  if (persist()) $('local-status').textContent = dirty ? 'Entwurf zur Wiederherstellung gesichert; noch nicht als Notiz gespeichert.' : 'Notiz und Entwurf stimmen überein.';
};
$('save-note').onclick = () => {
  const previous = state.note;
  state.note = $('note').value;
  if (persist()) {
    dirty = false;
    $('note-status').textContent = 'Notiz lokal gespeichert.';
    $('note-status').className = '';
  } else {
    state.note = previous; dirty = true;
    $('note-status').textContent = 'Notiz nicht gespeichert. Bitte offen lassen.';
    $('note-status').className = 'warning';
  }
};
window.addEventListener('beforeunload', (event) => { if (dirty || localError) { event.preventDefault(); event.returnValue = ''; } });
$('home').onclick = () => { generation++; clearTimeout(timer); state.stage = 'intro'; persist(); render(); document.querySelector('.areas').open = false; };
$('scene').onchange = (e) => setScene(e.target.value);
$('save-mode').value = state.saveMode;
$('save-mode').onchange = (e) => {
  state.saveMode = e.target.value;
  // An intentionally held pending state can be resumed through this teacher control.
  if (state.stage === 'summary' && state.saveState === 'pending') beginSave();
  persist();
};
for (const key of ['theme', 'motion']) {
  $(key).value = state[key];
  $(key).onchange = (e) => { state[key] = e.target.value; appearance(); persist(); };
}
appearance();
$('local-status').textContent = localError || 'Auswahl und gespeicherte Notizen bleiben nur in diesem Browser.';
try {
  const response = await fetch('/api/tasks');
  if (!response.ok) throw new Error('tasks unavailable');
  tasks = await response.json();
  // Never trust a stored verdict: re-derive it from the current pinned source.
  for (const key of ['vocab', 'grammar']) {
    if (state.results[key] && tasks[key].options.includes(state.selections[key])) {
      const response = await fetch('/api/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task: key, choice: state.selections[key] }) });
      if (!response.ok) throw new Error('restore unavailable');
      state.results[key] = await response.json();
    } else delete state.results[key];
    if (!tasks[key].options.includes(state.selections[key])) state.selections[key] = '';
  }
  render(false);
  if (state.stage === 'summary' && state.saveState === 'pending' && state.saveMode !== 'pending') beginSave();
} catch {
  $('learning').setAttribute('aria-busy', 'false');
  $('learning').innerHTML = '<h1>This page could not open.</h1><p>Please reopen the local preview and try again.</p><button class="primary" id="reload">Try again</button>';
  $('reload').onclick = () => location.reload();
  $('simulation-label').textContent = 'Muster konnte nicht geladen werden.';
}
