"use client";
import { useRef, useState } from "react";
import type { HuntRound } from "@/lib/modi/decks";
import type { GameProps, ModeReply } from "@/lib/modi/types";

export default function WordHunt(props: GameProps & { rounds: HuntRound[] }) {
  const [index, setIndex] = useState(0);
  return <HuntRoundView key={index} {...props} index={index} round={props.rounds[index]!} next={() => index + 1 === props.rounds.length ? props.finish([{ label: props.grade === 1 ? "Runden" : "Rounds", value: String(props.rounds.length) }]) : setIndex(index + 1)} />;
}
function HuntRoundView({ grade, submit, index, round, next }: GameProps & { index: number; round: HuntRound; next: () => void }) {
  const [picked, setPicked] = useState<Record<number, ModeReply>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false), [checked, setChecked] = useState(false);
  const lock = useRef(false);
  const de = grade === 1;
  async function check() {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    for (const index of selected) {
      const tile = round.tiles[index]!;
      const reply = await submit(tile.item, { kind: "choice", value: tile.word });
      setPicked((old) => ({ ...old, [index]: reply }));
    }
    setBusy(false); setChecked(true);
  }
  return <section>
    <div className="og-game-stats"><span>{de ? "Runde" : "Round"}: {index + 1}/8</span><span>{selected.length} {de ? "gewählt" : "selected"}</span></div>
    <div className="og-game-prompt og-hunt-prompt"><small>{de ? "WÄHLE ALLE PASSENDEN WÖRTER" : "PICK ALL THAT MATCH"}</small><strong>{de ? "Welche Wörter gehören zu" : "Which words belong to"} <span>Chapter {round.chapter}</span>?</strong></div>
    <div className="og-hunt-grid">{round.tiles.map((tile, i) => <button key={i} className={`og-hunt-tile ${picked[i]?.tier === "correct" ? "is-correct" : picked[i]?.tier ? "is-wrong" : ""}`} aria-pressed={selected.includes(i)} disabled={busy || checked} onClick={() => setSelected((old) => old.includes(i) ? old.filter((n) => n !== i) : [...old, i])}>{tile.word}{picked[i]?.tier && <small>{picked[i]?.tier === "correct" ? "✓" : "✗"}</small>}</button>)}</div>
    {!checked ? <button className="og-primary" disabled={busy || selected.length === 0} onClick={() => void check()}>{de ? "Prüfen" : "Check"} ✓</button> : <><p className="og-game-feedback" role="status">{Object.values(picked).filter((reply) => reply.tier === "correct").length}/{selected.length} {de ? "richtig" : "correct"}</p><button className="og-primary" onClick={next}>{de ? "Weiter" : "Next round"} →</button></>}
  </section>;
}
