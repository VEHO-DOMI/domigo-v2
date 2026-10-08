"use client";
import { useEffect, useRef, useState } from "react";
import { fullAnswer, chapterOf } from "@/lib/modi/decks";
import type { GameProps, ModeReply } from "@/lib/modi/types";

export default function Speed({ words, grade, submit, finish, duration }: GameProps & { duration: number }) {
  const [remaining, setRemaining] = useState(duration);
  const [index, setIndex] = useState(0), [value, setValue] = useState("");
  const [busy, setBusy] = useState(false), [reply, setReply] = useState<ModeReply | null>(null);
  const deadline = useRef<number | null>(null), lock = useRef(false);
  const finishRef = useRef(finish);
  useEffect(() => { finishRef.current = finish; }, [finish]);
  useEffect(() => {
    deadline.current = performance.now() + duration;
    const timer = setInterval(() => {
      const left = Math.max(0, deadline.current! - performance.now()); setRemaining(left);
      if (left === 0) { clearInterval(timer); finishRef.current(); }
    }, 100);
    return () => clearInterval(timer);
  }, [duration]);
  const word = words[index];
  const de = grade === 1;
  async function check() {
    if (lock.current || !word || deadline.current === null || performance.now() >= deadline.current) return;
    lock.current = true; setBusy(true);
    setReply(await submit(word, { kind: "vocab", value, pool: "deToEn" })); setBusy(false);
  }
  function next() {
    if (index + 1 === words.length) { finish(); return; }
    setIndex(index + 1); setValue(""); setReply(null); lock.current = false;
  }
  if (!word) return null;
  return <section>
    <div className={`og-speed-timer ${remaining <= 10_000 ? "is-urgent" : ""}`}><strong aria-label={de ? "Sekunden übrig" : "Seconds remaining"}>⚡ {Math.ceil(remaining / 1000)}s</strong><progress max={60_000} value={remaining} /></div>
    <div className="og-game-stats"><span>{de ? "Wort" : "Word"} {index + 1}</span><span>🇩🇪 → 🇬🇧</span></div>
    <div className="og-speed-question"><div className="og-game-prompt"><small>{de ? "ÜBERSETZE INS ENGLISCHE" : "TRANSLATE TO ENGLISH"}</small><strong>{word.g}</strong></div>
    <form onSubmit={(event) => { event.preventDefault(); if (reply) next(); else void check(); }}><label className="og-typed-label">{de ? "Deine Antwort" : "Your answer"}<input aria-label={de ? "Deine Antwort" : "Your answer"} autoComplete="off" autoCapitalize="none" spellCheck={false} value={value} readOnly={reply !== null} disabled={busy} onChange={(event) => setValue(event.target.value)} /></label>
      {reply && <p role="status" className="og-game-feedback">{reply.tier === "correct" ? (de ? "✓ Richtig!" : "✓ Correct!") : reply.tier ? fullAnswer(word, "deToEn") : (de ? "Antwort noch nicht bestätigt." : "Answer not yet confirmed.")}</p>}
      <button className="og-primary" disabled={busy || !value.trim()}>{reply ? (de ? "Weiter →" : "Next →") : (de ? "Prüfen ✓" : "Check ✓")}</button>
    </form><p className="og-speed-chapter">Chapter {chapterOf(word)}</p></div>
  </section>;
}
