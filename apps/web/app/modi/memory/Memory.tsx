"use client";
import { useEffect, useRef, useState } from "react";
import { distinctWords, fullAnswer, shuffle } from "@/lib/modi/decks";
import { memoryPairCount } from "@/lib/modi/catalog";
import type { GameProps } from "@/lib/modi/types";

export default function Memory({ words, grade, submit, finish }: GameProps) {
  const [pairs] = useState(() => distinctWords(words).slice(0, memoryPairCount(grade)));
  const [cards] = useState(() => shuffle(pairs.flatMap((word, pair) => [{ pair, side: "EN", text: word.w }, { pair, side: "DE", text: word.g }])));
  const [open, setOpen] = useState<number[]>([]), [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0), [seconds, setSeconds] = useState(0);
  const lock = useRef(false), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const de = grade === 1;
  useEffect(() => { const start = performance.now(); const interval = setInterval(() => setSeconds(Math.floor((performance.now() - start) / 1000)), 1000); return () => { clearInterval(interval); if (timer.current) clearTimeout(timer.current); }; }, []);
  async function flip(index: number) {
    if (lock.current || open.includes(index) || matched.includes(cards[index]!.pair)) return;
    const opened = [...open, index]; setOpen(opened);
    if (opened.length < 2) return;
    lock.current = true; setMoves((value) => value + 1);
    const a = cards[opened[0]!]!, b = cards[index]!;
    if (a.pair === b.pair && a.side !== b.side) {
      const word = pairs[a.pair]!;
      await submit(word, { kind: "choice", value: fullAnswer(word) });
      setMatched((old) => [...old, a.pair]); setOpen([]); lock.current = false;
      if (matched.length + 1 === pairs.length) finish();
    } else {
      // A turn is not an assessed word attempt; only completed pairs count.
      timer.current = setTimeout(() => { setOpen([]); lock.current = false; }, 900);
    }
  }
  return <section>
    <div className="og-game-stats"><span>{de ? "Paare" : "Pairs"}: {matched.length}/{pairs.length}</span><span>{de ? "Züge" : "Moves"}: {moves}</span><span>{seconds}s</span></div>
    <div className="og-game-prompt"><small>{de ? "FINDE DIE PAARE" : "MATCH EN ↔ DE"}</small><strong>{de ? "Englisch und Deutsch" : "English & German"}</strong></div>
    <div className="og-memory-grid">{cards.map((card, index) => {
      const visible = open.includes(index) || matched.includes(card.pair), gone = matched.includes(card.pair);
      return <button key={index} className={`og-memory-card ${visible ? "is-open" : ""} ${gone ? "is-matched" : ""}`} disabled={gone} aria-label={`${card.side} ${visible ? card.text : de ? "verdeckte Karte" : "hidden card"}`} onClick={() => void flip(index)}><small>{card.side}</small><span>{visible ? card.text : "?"}</span></button>;
    })}</div>
  </section>;
}
