// CODEX DRAFT — NOT CANON. Pure rendering shared by browser and coverage audit.
export const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function render(state, data, used = new Set()) {
  const t = id => { used.add(id); if (!Object.hasOwn(data.copy,id)) throw new Error(`Missing surface text: ${id}`); return escape(data.copy[id]); };
  const button = (id, text, primary = false) => `<button type="button" id="${id}" class="${primary ? 'primary' : 'secondary'}">${t(text)}</button>`;
  const book = (large = false) => `<img class="book ${large ? 'large' : ''}" src="/assets/object.png" width="631" height="471" alt="${t('ui.wordAlt')}">`;
  const title = id => `<h1 tabindex="-1">${t(id)}</h1>`;
  const nav = `<div class="page-top"><span class="chapter">${t('ui.chapter')}</span><span class="topic">${t('ui.topic')}</span></div>`;
  const footer = state.stage === 'intro' ? '' : `<div class="step-navigation">${button('back','ui.back')}${button('home','ui.home')}</div>`;
  let body = '';
  if (state.stage === 'load-error') return title('ui.loadError') + `<p>${t('ui.loadAdvice')}</p>` + button('reload','ui.reload',true);
  if (state.stage === 'intro') body = `${title('intro.title')}<p class="intro-copy">${t('intro.description')}</p><section class="card hero"><div><p>${t('intro.plan')}</p>${button('start','ui.start',true)}</div>${book(true)}</section>`;
  else if (state.stage === 'word-card') body = `${title('word.title')}<p>${t('word.look')}</p><section class="card word-card">${book(true)}<div class="word-label"><strong lang="en">${t('word.label')}</strong><span>${t('word.meaning')}</span></div>${button('recall','ui.recall',true)}</section>`;
  else if (state.stage === 'sentence') body = `${title('sentence.title')}<section class="card example"><p class="eyebrow">${t('sentence.example')}</p><p>${t('sentence.intro')}</p><div class="colour-example">${book()}<p><b lang="en">${t('sentence.colour')}</b><span> — ${t('sentence.colourMeaning')}</span></p></div><div class="sentence-pair"><p lang="en">${t('sentence.long')}</p><span aria-hidden="true">↓</span><p lang="en">${t('sentence.short')}</p></div><p>${t('sentence.meaning')}</p><div class="explanation"><img src="/assets/mentor.png" width="512" height="512" alt=""><p>${t('sentence.explanation')}</p></div>${button('choose','ui.choose',true)}</section>`;
  else if (state.stage === 'word' || state.stage === 'grammar') {
    const key = state.stage, word = key === 'word', result = state.results[key], answer = state.answers[key];
    const locked = !!result || state.ui === 'checking';
    const help = state.help[key];
    body = title(word ? 'word.recallTitle' : 'grammar.title');
    body += `<section class="card"><p class="eyebrow">${t(word ? 'ui.progressWord' : 'ui.progressSentence')}</p>`;
    body += word ? `<div class="recall-visual">${book()}<p>${t('word.instruction')}</p></div>` : `<div class="task-visual">${book()}<div><p lang="en" class="full-sentence">${t('grammar.long')}</p><p>${t('grammar.meaning')}</p></div></div><p>${t('grammar.instruction')}</p><p class="gap" lang="en">${result?.correct ? t('grammar.gap').replace('___',escape(answer)) : t('grammar.gap')}</p>`;
    body += '<form id="answer-form" novalidate>';
    body += word ? `<label class="answer-label" for="answer-input">${t('ui.answer')}</label><input id="answer-input" type="text" name="answer" value="${escape(answer)}" maxlength="100" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="${t('ui.placeholder')}" ${locked ? 'disabled' : ''}>` : `<fieldset class="choices" ${locked ? 'disabled' : ''}><legend>${t('grammar.legend')}</legend>${data.tasks.grammar.options.map(option=>`<label class="choice ${result && !result.correct && option === answer ? 'wrong-choice' : ''}"><input type="radio" name="answer" value="${escape(option)}" ${answer === option ? 'checked' : ''}><span lang="en">${escape(option)}</span></label>`).join('')}</fieldset>`;
    if (result) {
      used.add(result.titleId); used.add(result.textId);
      body += `<div tabindex="-1" class="feedback ${result.correct ? '' : 'wrong'}" role="status"><strong>${escape(result.title)}</strong><p>${escape(result.text)}</p>${result.correct ? `<p class="help-record">${t(state.usedHelp[key] ? 'ui.learnedHelp' : 'ui.learnedAlone')}</p>` : ''}</div>`;
    }
    if (state.ui === 'empty') body += `<p class="warning" role="alert">${t(word ? 'ui.emptyWord' : 'ui.emptyGrammar')}</p>`;
    if (state.ui === 'check-error') body += `<p class="warning" role="alert">${t(word ? 'ui.checkError' : 'ui.checkGrammarError')}</p>`;
    if (state.ui === 'checking') body += `<p role="status">${t('ui.checking')}</p>`;
    body += `<div class="actions"><button id="advance" class="primary" ${state.ui === 'checking' ? 'disabled' : ''}>${t(result ? (result.correct ? (word ? 'ui.sentence' : 'ui.finish') : 'ui.retry') : 'ui.check')}</button></div></form>`;
    if (!result?.correct && state.ui !== 'checking') {
      if (help) body += `<aside tabindex="-1" class="help" aria-label="${t(word ? 'word.helpTitle' : 'grammar.helpTitle')}"><p>${t(word ? 'word.help' + help : 'grammar.help')}</p><div>${word ? (help < 4 ? button('more-help','ui.more') : button('show-card','ui.card')) : button('show-example','grammar.example')}${button('hide-help','ui.hide')}</div></aside>`;
      else body += `<div class="help-actions">${button('help','ui.help')}</div>`;
    }
    body += '</section>';
  } else if (state.stage === 'summary') {
    body = `${title('summary.title')}<section class="card"><ul class="summary-list"><li><strong>${t('summary.word')}</strong><span class="written" lang="en">${escape(state.answers.word)}</span><span>${t(state.usedHelp.word ? 'ui.learnedHelp' : 'ui.learnedAlone')}</span></li><li><strong>${t('summary.grammar')}</strong><span class="written" lang="en">${escape(state.answers.grammar)}</span><span>${t(state.usedHelp.grammar ? 'ui.learnedHelp' : 'ui.learnedAlone')}</span></li></ul><div class="save-state" role="status">`;
    if (state.saveState === 'pending') body += `<strong>${t('summary.pending')}</strong><p>${t('summary.pendingText')}</p>`;
    else if (state.saveState === 'error') body += `<strong>${t('summary.error')}</strong><p>${t('summary.errorText')}</p>${button('retry-save','summary.retry',true)}`;
    else body += `<strong>${t('summary.saved')}</strong><p>${t('summary.next')}</p>${button('again','ui.again',true)}`;
    body += '</div></section>';
  } else throw new Error('Unknown stage');
  return nav + body + footer;
}
export function renderTeacher(data, used = new Set()) {
  const t=id=>{used.add(id);if(!Object.hasOwn(data.copy,id))throw new Error(`Missing surface text: ${id}`);return escape(data.copy[id]);};
  const select=(id,label,options)=>`<label>${t(label)}<select id="${id}">${options.map(([value,copy])=>`<option value="${value}">${t(copy)}</option>`).join('')}</select></label>`;
  return `<h2 id="teacher-title">${t('teacher.controlsTitle')}</h2><p class="draft">${t('teacher.draft')}</p><p>${t('teacher.description')}</p><p>${t('teacher.storage')}</p><div class="controls"><label>${t('teacher.scene')}<select id="scene">${data.scenes.map(x=>`<option value="${x.id}">${escape(x.label)}</option>`).join('')}</select></label>${select('save-mode','teacher.saveMode',[['success','teacher.successMode'],['pending','teacher.pendingMode'],['error','teacher.errorMode']])}${select('theme','teacher.theme',[['system','teacher.system'],['light','teacher.light'],['dark','teacher.dark']])}${select('motion','teacher.motion',[['system','teacher.system'],['reduce','teacher.reduce']])}${select('storage-mode','teacher.fault',[['normal','teacher.normal'],['fail','teacher.fail']])}${select('response-mode','teacher.responseMode',[['normal','teacher.responseOk'],['error','teacher.responseError']])}</div><p id="fault-label" class="warning" hidden>${t('teacher.faultLabel')}</p><label class="note-label" for="note">${t('teacher.note')}</label><textarea id="note" rows="3" maxlength="4000" placeholder="${t('teacher.notePlaceholder')}"></textarea><div class="note-actions"><button id="save-note">${t('teacher.saveNote')}</button><span id="note-status" role="status">${t('local.idle')}</span></div><p id="local-status" role="status"></p><details class="sources"><summary>${t('teacher.sources')}</summary><p>${t('teacher.sourceDetail')}</p></details>`;
}
