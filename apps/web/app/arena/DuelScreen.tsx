"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DuelScreenData } from "@/lib/arena/server";
import { arenaCopy, arenaMessage } from "@/lib/arena/copy";
import { DuelResult, RoundBlocks } from "./ArenaScreen";

export default function DuelScreen({ data, grade, preview, ownerId }: { data: DuelScreenData; grade: number; preview: boolean; ownerId: string | null }) {
  const c = arenaCopy(grade), router = useRouter(), { duel, prompt, chapters } = data, next = duel.next;
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [receipt, setReceipt] = useState<{ tier: string; xpAwarded: number } | null>(null), [selected, setSelected] = useState<string | null>(null);
  const inFlight = useRef(false);
  async function post(path: string, body: unknown) {
    if (preview || !ownerId || inFlight.current || receipt) return;
    inFlight.current = true; setBusy(true); setError("");
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const reply = await response.json();
      if (!response.ok || !reply.ok) { setError(arenaMessage(reply.error, grade)); return; }
      if (path === "/api/attempts") setReceipt({ tier: reply.tier, xpAwarded: reply.xpAwarded });
      else router.refresh();
    } catch { setError(c.unavailable); }
    finally { inFlight.current = false; setBusy(false); }
  }
  function answer(value: string) {
    if (preview || !ownerId || !next || inFlight.current || receipt) return;
    setSelected(value);
    void post("/api/attempts", { ownerId, clientAttemptId: crypto.randomUUID(), itemId: next.itemId, mode: `duel:${duel.id}`,
      input: { kind: "choice", value }, context: { duelId: duel.id, round: next.round, question: next.question } });
  }
  return <main className="og-screen arena-screen" lang={grade === 1 ? "de" : "en"}>
    <div className="arena-heading"><Link className="og-back" href={`/arena${preview ? `?jahrgang=${grade}` : ""}`}>← {c.back}</Link><h1>{c.duel}</h1></div>
    {error && <p className="arena-notice" role="alert">{error} <button className="arena-text-button" type="button" onClick={() => router.refresh()}>{c.refresh}</button></p>}
    {preview && <p className="arena-notice">{c.preview}</p>}
    {next && !preview ? <section className="arena-question" aria-label={c.question}>
      <h2>{c.round} {next.round + 1} · Chapter {duel.rounds[next.round]?.chapter}</h2><p className="arena-muted">{c.question} {next.question + 1} {c.of} 3</p>
      <div className="arena-question-progress" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className={i <= next.question ? "filled" : ""} />)}</div>
      <p className="arena-prompt-label">{c.translate}</p><p className="arena-prompt">{prompt}</p>
      <div className="arena-options">{next.options.map(option => <button type="button" key={option} disabled={busy || !!receipt} onClick={() => answer(option)} className={`arena-option${receipt && selected === option ? receipt.tier === "correct" ? " correct" : " wrong" : ""}`}>{option}</button>)}</div>
      {receipt && <div className="arena-receipt" role="status"><strong>{receipt.tier === "correct" ? `✓ ${c.correct}` : `× ${c.wrong}`}</strong><span>+{receipt.xpAwarded} XP · {c.saved}</span><button type="button" className="og-primary" onClick={() => router.refresh()}>{c.continue}</button></div>}
    </section> : <>
      <section className="arena-scoreboard" aria-label={c.score}>
        <div className="arena-players"><div><img src={`/avatars/${String(duel.myAvatar).padStart(2, "0")}.png`} width={48} height={48} alt="" /><strong>{duel.me}</strong><small>{c.me}</small></div><b>{duel.myScore}–{duel.theirScore}</b><div><img src={`/avatars/${String(duel.avatar).padStart(2, "0")}.png`} width={48} height={48} alt="" /><strong>{duel.opponent}</strong></div></div>
        {duel.status !== "active" && <div className="arena-result"><h2><DuelResult duel={duel} grade={grade} /></h2><p>{duel.status === "expired" ? c.expiredHint : `${duel.myScore}/15 ${c.points} · +${duel.xp} XP`}</p></div>}
        {[0, 1, 2, 3, 4].map(i => <div className="arena-round-row" key={i}><RoundBlocks answers={duel.rounds[i]?.mine ?? []} label={`${c.me} · ${c.round} ${i + 1}`} /><div>{c.round} {i + 1}{duel.rounds[i] && <small>Chapter {duel.rounds[i]!.chapter}</small>}</div><RoundBlocks answers={duel.rounds[i]?.theirs ?? []} label={`${duel.opponent} · ${c.round} ${i + 1}`} /></div>)}
        {!duel.canOpen && duel.status === "active" && !preview && <p className="arena-wait">{c.waitHint} <button className="arena-text-button" type="button" onClick={() => router.refresh()}>{c.refresh}</button></p>}
      </section>
      {duel.canOpen && !preview && <section className="arena-chapters"><h2>{c.chooseChapter}</h2><p className="arena-muted">{c.round} {duel.rounds.length + 1} {c.of} 5 · 3 {c.question.toLowerCase()}</p>{chapters.length === 0 ? <p>{c.noChapters}</p> : <div className="arena-chapter-grid">{chapters.map(chapter => <button className="arena-chapter" type="button" disabled={busy} key={chapter.key} onClick={() => void post("/api/arena/rounds", { duelId: duel.id, unitKey: chapter.key })}>Chapter {chapter.chapter}</button>)}</div>}</section>}
    </>}
  </main>;
}
