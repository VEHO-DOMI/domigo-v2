"use client";
import { useState } from "react";
import type { GrammarItem } from "@domigo/content-schema";
import { shuffle } from "@/lib/modi/decks";

/** Concealed authored pairs. Assignments are proposals; only /api/attempts judges the complete map. */
export default function GrammarMemory({ pairs, value, onChange, disabled }: {
  pairs: GrammarItem["pairs"]; value: Record<string, string>; onChange: (value: Record<string, string>) => void; disabled: boolean;
}) {
  const [cards] = useState(() => shuffle(pairs.flatMap((pair) => [{ side: "left", text: pair.left }, { side: "right", text: pair.right }])));
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const assigned = (index: number) => cards[index]!.side === "left" ? cards[index]!.text in value : Object.values(value).includes(cards[index]!.text);
  function flip(index: number) {
    if (disabled || assigned(index)) return;
    if (first === null || second !== null) { setFirst(index); setSecond(null); return; }
    if (first !== index) setSecond(index);
  }
  function pair() {
    if (first === null || second === null) return;
    const left = cards[first]!.side === "left" ? cards[first]! : cards[second]!;
    const right = cards[first]!.side === "right" ? cards[first]! : cards[second]!;
    onChange({ ...value, [left.text]: right.text }); setFirst(null); setSecond(null);
  }
  return <div className="og-grammar-memory">
    <p>{Object.keys(value).length}/{pairs.length} zugeordnet · Decke zwei Karten auf.</p>
    <div className="og-memory-grid">{cards.map((card, i) => <button className={`og-memory-card ${assigned(i) ? "is-matched" : ""}`} type="button" key={i} disabled={disabled || assigned(i)} onClick={() => flip(i)} aria-label={`Karte ${i + 1}`}><small>{card.side === "left" ? "A" : "B"}</small><span>{assigned(i) || first === i || second === i ? card.text : "?"}</span></button>)}</div>
    {first !== null && second !== null && <button className="og-primary" type="button" disabled={cards[first]!.side === cards[second]!.side || disabled} onClick={pair}>A und B zuordnen</button>}
    {Object.keys(value).length > 0 && <button className="og-grammar-hint" type="button" disabled={disabled} onClick={() => { onChange({}); setFirst(null); setSecond(null); }}>Zuordnung neu legen</button>}
  </div>;
}
