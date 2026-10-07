"use client";
import React, { useEffect, useRef, useState } from "react";
import type { GrammarItem, PaintEncounter } from "@domigo/content-schema";
import { EncounterSession, canContinue, encounterFeedback, type EncounterAttempt, type EncounterProgress, type EncounterReply } from "./runtime.ts";
import "./encounter.css";

export interface EncounterStageProps {
  encounter: PaintEncounter;
  grammarItems: GrammarItem[];
  initial: EncounterProgress;
  preview: boolean;
  hubHref: string;
  onProgress: (next: EncounterProgress) => boolean;
  onAttempt: (attempt: EncounterAttempt) => Promise<EncounterReply>;
}

/** A DOM book page: no network, storage or Phaser dependency. */
export default function EncounterStage(props: EncounterStageProps): React.ReactElement {
  const { encounter, preview, hubHref } = props;
  const [state, setState] = useState({ progress: props.initial, busy: false, persisted: true });
  const [help, setHelp] = useState(false);
  const [models, setModels] = useState(false);
  const [empty, setEmpty] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [session] = useState(() => new EncounterSession({ ...props,
    onChange: (progress, busy, persisted) => setState({ progress, busy, persisted }),
  }));
  const { progress, busy, persisted } = state;
  const task = encounter.tasks[progress.cursor];
  const model = progress.cursor >= -3 && progress.cursor < 0 ? encounter.models[progress.cursor + 3] : undefined;
  const complete = progress.cursor === encounter.tasks.length;
  useEffect(() => {
    session.activate();
    // A reload between submission and acknowledgement reconciles the same UUID.
    if (props.initial.pendingAttempt && !props.initial.confirmed) void session.submit();
    return () => session.dispose();
  }, [session, props.initial]);
  useEffect(() => { titleRef.current?.focus(); }, [progress.cursor]);

  const picture = (sceneId: string): React.ReactElement => {
    const scene = encounter.scenes.find(s => s.id === sceneId)!;
    return <figure className="encounter-picture">
      {/* SVG files stay external; the alternative text carries the same spatial evidence. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={scene.asset} alt={scene.altDe} width={440} height={300} />
      <details><summary>Bild in Worten lesen</summary><p>{scene.altDe}</p></details>
    </figure>;
  };
  const showHelp = (): void => { session.useHint(); setHelp(value => !value); };
  const showModels = (): void => { session.useHint(); setModels(value => !value); };
  const advance = (): void => {
    if (!task) return;
    session.advance(task.id);
    setHelp(false); setModels(false); setEmpty(false);
  };

  return <section className="paint-encounter" aria-label="Das verschwundene Buch">
    {preview && <aside className="encounter-preview" role="note">Vorschau — nichts wird gespeichert</aside>}
    <header className="encounter-top"><span>Chapter {Number(encounter.chapter.slice(2))}</span><a href={hubHref}>Pause machen</a></header>
    <article className="encounter-paper">
      <p className="encounter-kicker">{task ? `Aufgabe ${progress.cursor + 1} von ${encounter.tasks.length}` : model ? `Beispiel ${progress.cursor + 4} von 3` : "Das gemalte Buch"}</p>
      <h1 tabIndex={-1} ref={titleRef}>{task?.titleDe ?? (model ? "Wo liegt das Buch?" : complete ? encounter.completion.title : encounter.title)}</h1>
      {progress.cursor === -4 && <>
        <p className="encounter-story">{encounter.intro.story}</p>
        {picture(encounter.models[0]!.scene)}
        <p>{encounter.intro.goal}</p><p>{encounter.intro.orientation}</p>
        <dl className="encounter-words">{encounter.intro.wordSupport.map(word => <div key={word.en}><dt lang="en">{word.en}</dt><dd>{word.de}</dd></div>)}</dl>
        <button className="encounter-primary" onClick={() => session.beginNext()}>Beispiele ansehen</button>
      </>}
      {model && <>
        {picture(model.scene)}
        <p className="encounter-sentence" lang="en">{model.sentence}</p>
        <p>{model.explanationDe}</p>
        <p className="encounter-support"><span lang="en">The book is …</span> heißt: „Das Buch ist …“</p>
        <button className="encounter-primary" onClick={() => session.beginNext()}>{progress.cursor === -1 ? "Jetzt probieren" : "Nächstes Beispiel"}</button>
      </>}
      {task && <>
        <p className="encounter-story">{task.contextDe}</p>
        {progress.worldEffects.includes("pack_book") && <p className="encounter-world" role="status">Das Buch ist geholt und eingepackt.</p>}
        {picture(task.scene)}
        <form onSubmit={event => { event.preventDefault(); if (!progress.lastInput.trim()) { setEmpty(true); return; } setEmpty(false); void session.submit(); }}>
          <p id="encounter-instruction">{task.storyDe}</p>
          <p className="encounter-sentence" lang="en">{task.promptEn}</p>
          {task.kind === "choice" ? <fieldset disabled={busy || !!progress.confirmed || !!progress.pendingAttempt} className="encounter-options">
            <legend className="encounter-sr">Wähle ein Ortswort.</legend>
            {task.options.map(option => <label key={option} className={progress.lastInput === option ? "selected" : ""}>
              <input type="radio" name="location" value={option} checked={progress.lastInput === option} onChange={() => { setEmpty(false); session.setInput(option); }} />
              <span lang="en">{option}</span>
            </label>)}
          </fieldset> : <label className="encounter-answer">Dein Ortswort
            <input autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={32} aria-describedby="encounter-instruction" value={progress.lastInput} disabled={busy || !!progress.confirmed || !!progress.pendingAttempt}
              onChange={event => { setEmpty(false); session.setInput(event.target.value); }} />
          </label>}
          {empty && <p role="alert">{task.kind === "choice" ? "Wähle ein Ortswort." : "Schreibe ein Ortswort."}</p>}
          {!progress.confirmed && <button className="encounter-primary" disabled={busy} type="submit">{busy ? "Antwort wird geprüft …" : progress.pendingAttempt ? "Speicherung noch einmal versuchen" : "Antwort prüfen"}</button>}
        </form>
        {progress.confirmed && <div className="encounter-feedback" role="status" aria-live="polite">
          <strong>{encounterFeedback(progress, preview)}</strong>
          {canContinue(progress, preview) ? <>
            <p>{task.explanationDe}</p>
            {task.worldEffects.length > 0 && <p>Mit „Weiter“ wird das Buch geholt und eingepackt.</p>}
            <button className="encounter-primary" disabled={busy} onClick={advance}>Weiter</button>
          </> : progress.confirmed.reply.ok || progress.confirmed.reply.queued || preview
            ? <button onClick={() => session.retry()}>Noch einmal</button>
            : <button disabled={busy} onClick={() => { void session.submit(); }}>{busy ? "Antwort wird geprüft …" : "Speicherung noch einmal versuchen"}</button>}
        </div>}
        <nav className="encounter-help" aria-label="Hilfen">
          <button aria-expanded={help} onClick={showHelp}>Genauer hinschauen</button>
          <button aria-expanded={models} onClick={showModels}>Beispiele nachlesen</button>
        </nav>
        {help && <p className="encounter-support">{task.helpFocusDe}</p>}
        {models && <div className="encounter-examples">{encounter.models.map(example => <div key={example.scene}>
          <p lang="en">{example.sentence}</p><p>{example.explanationDe}</p>
        </div>)}</div>}
      </>}
      {complete && <>
        {picture(encounter.tasks[encounter.tasks.length - 1]!.scene)}
        <p className="encounter-world">{encounter.completion.story}</p>
        <p>{encounter.completion.learning}</p>
        <a className="encounter-primary" href={hubHref}>{encounter.completion.continueLabel}</a>
      </>}
      {!persisted && <p className="encounter-storage" role="alert">Dein Stand kann auf diesem Gerät gerade nicht gespeichert werden. Lass die Seite offen und versuche es noch einmal.</p>}
    </article>
  </section>;
}
