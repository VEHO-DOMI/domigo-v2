"use client";
import { useRef, useState } from "react";
import { fullAnswer, chapterOf } from "@/lib/modi/decks";
import type { GameProps } from "@/lib/modi/types";

export default function Flashcards({ words, grade, submit, finish }: GameProps) {
  const [direction, setDirection] = useState<"deToEn" | "enToDe" | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false), pointer = useRef<number | null>(null), swiped = useRef(false);
  const word = words[index];
  const de = grade === 1;
  if (!word) return <button className="og-primary" onClick={finish}>{de ? "Ergebnis" : "Results"}</button>;
  if (!direction) return <section className="og-flash-directions"><h2>{de ? "Welche Richtung?" : "Flashcard Direction"}</h2>
    <button className="og-mode" onClick={() => setDirection("enToDe")}><span className="og-mode-icon">🇬🇧→🇩🇪</span><span>English → Deutsch</span></button>
    <button className="og-mode" onClick={() => setDirection("deToEn")}><span className="og-mode-icon">🇩🇪→🇬🇧</span><span>Deutsch → English</span></button>
  </section>;
  async function mark(got: boolean) {
    if (lock.current || !word || !direction) return;
    lock.current = true; setBusy(true);
    await submit(word, { kind: "vocab", value: got ? fullAnswer(word, direction) : "", pool: direction });
    if (index + 1 >= words.length) finish();
    else { setIndex(index + 1); setFlipped(false); }
    lock.current = false; setBusy(false);
  }
  const english = direction === "enToDe" ? !flipped : flipped;
  return <section>
    <div className="og-game-stats"><span>{index + 1}/{words.length}</span><span>Chapter {chapterOf(word)}</span></div>
    <button type="button" className={`og-flash-card ${flipped ? "is-flipped" : ""}`} disabled={busy}
      onClick={() => { if (!swiped.current) setFlipped(!flipped); swiped.current = false; }}
      onPointerDown={(event) => { pointer.current = event.clientX; swiped.current = false; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerCancel={() => { pointer.current = null; }}
      onPointerUp={(event) => { const distance = pointer.current === null ? 0 : event.clientX - pointer.current; pointer.current = null; if (Math.abs(distance) > 70) { swiped.current = true; void mark(distance > 0); } }}>
      <strong>{english ? word.w : word.g}</strong><span>{english ? word.s.replace(/_{2,}/g, fullAnswer(word)) : word.d}</span><small>{de ? "Antippen zum Umdrehen" : flipped ? "Tap to flip back" : "Tap to flip"}</small>
    </button>
    <p className="og-swipe-hint">{de ? "← Noch einmal · Gewusst →" : "← Again · Got it →"}</p>
    <div className="og-flash-actions"><button className="og-again" disabled={busy} onClick={() => void mark(false)}>✗ {de ? "Noch einmal" : "Again"}</button><button className="og-got" disabled={busy} onClick={() => void mark(true)}>✓ {de ? "Gewusst" : "Got it"}</button></div>
  </section>;
}
