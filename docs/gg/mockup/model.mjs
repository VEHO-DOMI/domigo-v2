// CODEX DRAFT — NOT CANON. Local exemplar grading, never a product grader.
export const stages = ['intro', 'word-card', 'word', 'sentence', 'grammar', 'summary'];
export const initial = () => ({ version: 2, stage: 'intro', answers: { word: '', grammar: '' }, results: {}, help: { word: 0, grammar: 0 }, usedHelp: { word: false, grammar: false }, note: '', noteDraft: '', theme: 'system', motion: 'system', saveMode: 'success', saveState: 'idle', simulated: false, returnTo: '', ui: '' });
export const wordCases = [
  ['empty', '', null], ['selected', 'b', null], ['correct', 'book', 'wordCorrect'],
  ['article', 'a book', 'wordArticle'], ['plural', 'books', 'wordPlural'],
  ['near', 'bok', 'wordNear'], ['related', 'textbook', 'wordRelated'],
  ['german', 'Buch', 'wordGerman'], ['wrong', 'pen', 'wordWrong'],
];
export function grade(task, answer, source, copy) {
  if (typeof answer !== 'string' || answer.length > 100) throw new Error('Invalid answer');
  let code;
  if (task === 'word') {
    const value = answer.trim().replace(/\s+/g, ' ').toLowerCase();
    if (!value) throw new Error('Empty answer');
    if (source.answers.vocab.some(x => x.tier === 'full' && x.text.toLowerCase() === value)) code = 'wordCorrect';
    else if (['a book', 'the book'].includes(value)) code = 'wordArticle';
    else if (value === 'books') code = 'wordPlural';
    else if (['bok', 'boook', 'boock'].includes(value)) code = 'wordNear';
    else if (['textbook', 'english book', 'exercise book', 'notebook'].includes(value)) code = 'wordRelated';
    else if (['buch', 'das buch', 'ein buch'].includes(value)) code = 'wordGerman';
    else code = 'wordWrong';
  } else if (task === 'grammar') {
    if (!source.tasks.grammar.options.includes(answer)) throw new Error('Unknown choice');
    if (source.answers.grammar.some(x => x.tier === 'full' && x.text === answer)) code = 'grammarCorrect';
    else code = { Its: 'grammarIts', "He's": 'grammarHe', "That's": 'grammarThat' }[answer];
    if (!code) throw new Error('Unmapped source distractor');
  } else throw new Error('Unknown task');
  const correct = ['wordCorrect', 'wordArticle', 'grammarCorrect'].includes(code);
  const titleId = correct ? (code === 'wordArticle' ? 'feedback.variantTitle' : 'feedback.correctTitle') : 'feedback.retryTitle';
  const textId = 'feedback.' + code;
  if (!copy[titleId] || !copy[textId]) throw new Error('Missing feedback');
  return { correct, code, titleId, textId, title: copy[titleId], text: copy[textId] };
}
export function scenarioList(source) {
  return [
    { id: 'intro', label: 'Einstieg', stage: 'intro' },
    { id: 'word-card', label: 'Wortkarte · Lernbeispiel', stage: 'word-card' },
    { id: 'word', label: 'Wort · offen', stage: 'word' },
    ...wordCases.map(([id, answer, code]) => ({ id: `word-${id}`, label: `Wort · ${{empty:'keine Eingabe',selected:'Eingabe begonnen',correct:'richtig',article:'mit Artikel',plural:'Mehrzahl',near:'Schreibfehler',related:'verwandtes Wort',german:'deutsches Wort',wrong:'falsches Wort'}[id]}`, stage: 'word', answer, code, ui: id === 'empty' ? 'empty' : '' })),
    { id: 'word-assisted', label: 'Wort · richtig mit Hilfe', stage: 'word', answer: 'book', code: 'wordCorrect', assisted: true },
    ...[1,2,3,4].map(help => ({ id: `word-help-${help}`, label: `Wort · Hilfe ${help}`, stage: 'word', help })),
    { id: 'word-checking', label: 'Wort · Prüfung wartet', stage: 'word', answer: 'b', ui: 'checking' },
    { id: 'word-error', label: 'Wort · Prüfungsfehler', stage: 'word', answer: 'b', ui: 'check-error' },
    { id: 'sentence', label: 'Satz · Lernbeispiel', stage: 'sentence' },
    { id: 'grammar', label: 'Kurzform · offen', stage: 'grammar' },
    { id: 'grammar-empty', label: 'Kurzform · keine Auswahl', stage: 'grammar', ui: 'empty' },
    { id: 'grammar-selected', label: 'Kurzform · ausgewählt', stage: 'grammar', answer: source.tasks.grammar.options[0] },
    ...source.tasks.grammar.options.map((answer,i) => ({ id: `grammar-result-${i}`, label: `Kurzform · Rückmeldung ${i+1}`, stage: 'grammar', answer, graded: true })),
    { id: 'grammar-assisted', label: 'Kurzform · richtig mit Hilfe', stage: 'grammar', answer: source.originals.grammar.answers[0].text, graded: true, assisted: true },
    { id: 'grammar-help', label: 'Kurzform · Hilfe', stage: 'grammar', help: 1 },
    { id: 'grammar-checking', label: 'Kurzform · Prüfung wartet', stage: 'grammar', answer: source.tasks.grammar.options[0], ui: 'checking' },
    { id: 'grammar-error', label: 'Kurzform · Prüfungsfehler', stage: 'grammar', answer: source.tasks.grammar.options[0], ui: 'check-error' },
    ...['pending','error','saved'].map(saveState => ({ id: `summary-${saveState}`, label: `Rückmeldung · ${{pending:'wartet',error:'Fehler',saved:'fertig'}[saveState]}`, stage: 'summary', saveState })),
    { id: 'load-error', label: 'Ladefehler', stage: 'load-error' },
  ];
}
export function scenario(id, source, copy) {
  const spec = scenarioList(source).find(x => x.id === id);
  if (!spec) throw new Error('Unknown scenario');
  const state = initial();
  Object.assign(state, { scenarioId: id, stage: spec.stage, ui: spec.ui || '', saveState: spec.saveState || 'idle', simulated: true });
  if (['word','grammar'].includes(spec.stage)) {
    state.answers[spec.stage] = spec.answer || '';
    state.help[spec.stage] = spec.help || 0;
    state.usedHelp[spec.stage] = !!spec.help || !!spec.assisted;
    if (spec.code || spec.graded) state.results[spec.stage] = grade(spec.stage, spec.answer, source, copy);
  }
  if (state.stage === 'summary') {
    state.answers = { word: source.originals.vocab.w, grammar: source.originals.grammar.answers[0].text };
    state.results = Object.fromEntries(Object.entries(state.answers).map(([key,a]) => [key,grade(key,a,source,copy)]));
  }
  return state;
}
