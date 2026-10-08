"use client";
import { useRef, useState } from "react";
import { spellingAnswer, spellingLayout } from "@domigo/engine";
import { fullAnswer, shuffle, spellingWords } from "@/lib/modi/decks";
import type { GameProps, ModeReply } from "@/lib/modi/types";

export default function Spelling(props: GameProps) {
  const [deck] = useState(() => spellingWords(props.words));
  const [index, setIndex] = useState(0);
  if (!deck[index]) return <p>{props.grade === 1 ? "Keine passenden Wörter. Wähle andere Chapters." : "No suitable words. Choose different Chapters."}</p>;
  return <SpellingWord key={index} {...props} words={[deck[index]!]} index={index} total={deck.length} next={() => index + 1 === deck.length ? props.finish() : setIndex(index + 1)} />;
}
function SpellingWord({ words, grade, submit, index, total, next }: GameProps & { index: number; total: number; next: () => void }) {
  const word = words[0]!;
  const [layout] = useState(() => spellingLayout(fullAnswer(word, "deToEn")));
  const [tiles] = useState(() => shuffle(layout.filter((slot) => !slot.fixed).map((slot) => slot.text.toUpperCase())));
  const [letters, setLetters] = useState("");
  const [used, setUsed] = useState<number[]>([]);
  const [hint, setHint] = useState(false), [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<ModeReply | null>(null);
  const lock = useRef(false);
  const de = grade === 1;
  let letterIndex = 0;
  async function check() {
    if (lock.current || reply) return;
    lock.current = true; setBusy(true);
    setReply(await submit(word, { kind: "vocab", value: spellingAnswer(layout, letters), pool: "deToEn" }, hint));
    setBusy(false);
  }
  return <section>
    <div className="og-game-stats"><span>{de ? "Wort" : "Word"}: {index + 1}/{total}</span></div>
    <div className="og-game-prompt"><small>{de ? "ÜBERSETZE UND BUCHSTABIERE" : "TRANSLATE & SPELL"}</small><strong>{word.g}</strong><em>{word.d}</em></div>
    <div className="og-spelling-answer" aria-hidden="true">{layout.map((slot, i) => slot.fixed ? <span className="og-fixed" key={i}>{slot.text}</span> : <span className="og-letter" key={i}>{letters[letterIndex++]?.toUpperCase() ?? ""}</span>)}</div>
    <form onSubmit={(event) => { event.preventDefault(); void check(); }}>
      <label className="og-typed-label">{de ? "Buchstaben tippen oder unten antippen" : "Type the letters or tap them below"}<input aria-label={de ? "Deine Buchstaben" : "Your letters"} autoComplete="off" autoCapitalize="none" spellCheck={false} value={letters} disabled={busy || reply !== null} onChange={(event) => { setLetters(event.target.value); setUsed([]); }} /></label>
      <div className="og-letter-bank">{tiles.map((letter, i) => <button key={i} type="button" className="og-letter" disabled={busy || reply !== null || used.includes(i)} onClick={() => { setLetters(letters + letter); setUsed([...used, i]); }}>{letter}</button>)}</div>
      {!reply && <><div className="og-spelling-actions"><button type="button" className="og-game-back" disabled={busy} aria-label={de ? "Letzten Buchstaben löschen" : "Delete last letter"} onClick={() => { setLetters(letters.slice(0, -1)); setUsed(used.slice(0, -1)); }}>⌫</button><button type="button" className="og-game-back" disabled={busy} onClick={() => { setLetters(""); setUsed([]); }}>{de ? "Leeren" : "Clear"}</button><button type="button" className="og-game-back" disabled={busy || hint} onClick={() => { setHint(true); const first = layout.find((slot) => !slot.fixed)!.text.toUpperCase(); setLetters(first); setUsed([tiles.indexOf(first)]); }}>{de ? "Hinweis" : "Hint"}</button></div><button className="og-primary" disabled={busy || !letters.trim()}>{de ? "Prüfen" : "Check"} ✓</button></>}
    </form>
    {reply && <><p className={`og-game-feedback ${reply.tier === "wrong" ? "is-wrong" : ""}`} role="status">{reply.tier === "correct" ? (de ? "✓ Richtig!" : "✓ Correct!") : reply.tier === "close" ? (de ? "Fast richtig!" : "Almost!") : reply.tier ? (de ? "So schreibt man es:" : "The spelling is:") : (de ? "Antwort noch nicht bestätigt." : "Answer not yet confirmed.")} {reply.tier !== "correct" && fullAnswer(word, "deToEn")}</p><button className="og-primary" onClick={next}>{de ? "Weiter" : "Continue"} →</button></>}
  </section>;
}
