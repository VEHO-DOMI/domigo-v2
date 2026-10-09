"use client";
import { useRef, useState } from "react";
import type { GrammarItem } from "@domigo/content-schema";
import type { GrammarInput } from "@domigo/engine";
import type { AttemptResult } from "@/lib/attempt-outbox";
import { shuffle } from "@/lib/modi/decks";
import { FORMAT_NAMES, visibleGrammarGloss } from "@/lib/modi/grammar";
import GrammarMemory from "./GrammarMemory";

export type GrammarSubmit = (item: GrammarItem, input: GrammarInput, hintUsed: boolean) => Promise<AttemptResult>;
export default function GrammarExercise({ item, grade, memory, submit, next }: {
  item: GrammarItem; grade: number; memory: boolean; submit: GrammarSubmit; next: () => void;
}) {
  const de = grade === 1;
  const [text, setText] = useState<string[]>([]);
  const [choice, setChoice] = useState("");
  const [map, setMap] = useState<Record<string, string>>({});
  const [hint, setHint] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [receipt, setReceipt] = useState<AttemptResult | null>(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const [options] = useState(() => shuffle([...new Set([...item.answers.filter((a) => a.tier === "full").map((a) => a.text), ...item.distractors])]));
  const [rights] = useState(() => shuffle(item.pairs.map((p) => p.right)));
  const isChoice = item.format === "multiple-choice" || item.format === "context-picker";
  const isMatch = item.format === "matching" || item.format === "matching-pairs";
  const isGroup = item.format === "group-sort";
  const full = item.answers.filter((a) => a.tier === "full").map((a) => a.text);
  const blanks = Math.max(1, item.prompt.blanks, (full[0] ?? "").split("|").length);
  const done = !!receipt && (receipt.queued || !!receipt.tier && (receipt.tier !== "wrong" || wrong >= 3));
  const gloss = visibleGrammarGloss(item, hint || wrong >= 2);
  const rows = isMatch ? item.pairs.map((p) => p.left) : item.groups.flatMap((g) => g.members);
  const choices = isMatch ? rights : item.groups.map((g) => g.label);
  const complete = isChoice ? !!choice : isMatch || isGroup ? rows.every((row) => !!map[row]) : Array.from({ length: blanks }, (_, i) => text[i]?.trim()).every(Boolean);
  async function check() {
    if (locked.current || done || !complete) return;
    locked.current = true; setBusy(true);
    const input: GrammarInput = isChoice ? { kind: "choice", value: choice } : isMatch ? { kind: "matching", value: map } : isGroup ? { kind: "groupSort", value: map } : { kind: "text", value: text.join(" | ") };
    try {
      const result = await submit(item, input, hint || wrong >= 2);
      setReceipt(result);
      if (result.tier === "wrong") setWrong((n) => n + 1);
    } finally { locked.current = false; setBusy(false); }
  }
  return <section className="og-grammar-exercise" data-item={item.id} data-format={item.format}>
    <div className="og-grammar-format">{FORMAT_NAMES[item.format][de ? "de" : "en"]}</div>
    <h2>{item.prompt.text}</h2>
    <form onSubmit={(event) => { event.preventDefault(); void check(); }}>
      <fieldset disabled={busy || done}>
        <legend className="og-sr-only">{de ? "Deine Antwort" : "Your answer"}</legend>
        {isChoice && <div className="og-grammar-options">{options.map((option) => <button type="button" key={option} aria-pressed={choice === option} onClick={() => setChoice(option)}>{option}</button>)}</div>}
        {memory ? <GrammarMemory pairs={item.pairs} value={map} onChange={setMap} disabled={busy || done} /> : (isMatch || isGroup) && rows.map((row) => <label className="og-grammar-match" key={row}><span>{row}</span><select aria-label={row} value={map[row] ?? ""} onChange={(event) => setMap({ ...map, [row]: event.target.value })}><option value="">—</option>{choices.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}
        {!isChoice && !isMatch && !isGroup && Array.from({ length: blanks }, (_, i) => <label className="og-grammar-input" key={i}>{de ? "Deine Antwort" : "Your answer"}{blanks > 1 ? ` ${i + 1}` : ""}<input autoComplete="off" value={text[i] ?? ""} onChange={(event) => setText((old) => Array.from({ length: blanks }, (_, j) => j === i ? event.target.value : old[j] ?? ""))} /></label>)}
        {gloss.length > 0 && <p className="og-grammar-gloss">{gloss.map((g) => `${g.word}: ${g.de}`).join(" · ")}</p>}
        {!done && <button className="og-grammar-hint" type="button" onClick={() => setHint(true)}>💡 {de ? "Hinweis" : "Hint"}</button>}
        {!done && <button className="og-primary" type="submit" disabled={!complete || busy}>{busy ? "…" : wrong > 0 ? (de ? "Noch einmal prüfen" : "Try again") : (de ? "Prüfen" : "Check")}</button>}
      </fieldset>
    </form>
    {(hint || wrong >= 2) && <p className="og-grammar-hint-text">💡 {de ? item.hintDe : item.hintEn ?? item.hintDe}</p>}
    {receipt && <div className="og-game-feedback" role="status">
      {receipt.tier ? <strong>{receipt.tier === "correct" ? (de ? "Richtig!" : "Correct!") : receipt.tier === "wrong" ? (de ? "Schau her:" : "Take a look:") : receipt.tier === "close" ? (de ? "Knapp!" : "Close!") : (de ? "Fast!" : "Almost!")}</strong> : <p>{de ? "Deine Antwort ist noch nicht bestätigt." : "Your answer is not yet confirmed."}</p>}
      {receipt.tier === "wrong" && !done && <p>{de ? "Versuch es gleich nochmal." : "Try again."}</p>}
      {done && receipt.tier && <><p>{isMatch ? item.pairs.map((p) => `${p.left} → ${p.right}`).join(" · ") : isGroup ? item.groups.map((g) => `${g.label}: ${g.members.join(", ")}`).join(" · ") : full.join(" / ")}</p><p>{de ? item.explainDe : item.explainEn ?? item.explainDe}</p></>}
      {done && <button className="og-primary" onClick={next}>{de ? "Weiter →" : "Next →"}</button>}
    </div>}
  </section>;
}
