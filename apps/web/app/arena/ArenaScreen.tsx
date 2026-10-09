"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { arenaCopy, arenaMessage } from "@/lib/arena/copy";
import type { ArenaData, DuelSummary } from "@/lib/arena/server";

export function RoundBlocks({ answers, label }: { answers: readonly boolean[]; label: string }) {
  return <span className="arena-blocks" aria-label={label}>{[0, 1, 2].map(i => <span key={i} className={`arena-block ${answers[i] === true ? "correct" : answers[i] === false ? "wrong" : "empty"}`} aria-label={answers[i] === undefined ? "—" : answers[i] ? "✓" : "×"}>{answers[i] === undefined ? "" : answers[i] ? "✓" : "×"}</span>)}</span>;
}
export function DuelResult({ duel, grade }: { duel: DuelSummary; grade: number }) {
  const c = arenaCopy(grade);
  return <>{duel.status === "expired" ? c.expired : duel.result === "win" ? `🏆 ${c.victory}` : duel.result === "loss" ? `💪 ${c.defeat}` : `🤝 ${c.draw}`}</>;
}
export default function ArenaScreen({ arena, grade, preview }: { arena: ArenaData; grade: number; preview: boolean }) {
  const c = arenaCopy(grade), router = useRouter(), suffix = preview ? `?jahrgang=${grade}` : "";
  const [choosing, setChoosing] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function challenge(peer: number) {
    if (preview || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/arena/duels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ peer, rosterVersion: arena.rosterVersion }) });
      const reply = await response.json();
      if (!response.ok || !reply.ok) { setError(arenaMessage(reply.error, grade)); setBusy(false); return; }
      router.push(`/arena/duel/${reply.id}`);
    } catch { setError(c.unavailable); setBusy(false); }
  }
  return <main className="og-screen arena-screen" lang={grade === 1 ? "de" : "en"}>
    <div className="arena-heading"><Link className="og-back" href={`/home${suffix}`}>← {c.back}</Link><h1>⚔️ {c.title}</h1></div>
    {!arena.enabled ? <p className="arena-notice" role="status">{arena.unavailable ? c.unavailable : c.off}</p> : <>
      <section className="arena-stats" aria-label={c.title}>{[[c.played, arena.stats.played], [c.won, arena.stats.won], [c.rate, `${arena.stats.winRate}%`], [c.xp, arena.stats.xp]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
      <section className="arena-challenge"><button type="button" className="og-primary" onClick={() => setChoosing(!choosing)} aria-expanded={choosing}>⚔️ {c.newDuel}</button></section>
      {choosing && <section className="arena-picker" aria-label={c.choosePeer}><div className="arena-section-heading"><h2>{c.choosePeer}</h2><button type="button" className="arena-text-button" onClick={() => setChoosing(false)}>{c.close}</button></div><p>{c.peerHint}</p>
        {arena.peers.length === 0 && <p>{c.noPeers}</p>}{arena.peers.map(peer => <button type="button" className="arena-peer" key={peer.number} disabled={preview || busy} onClick={() => void challenge(peer.number)}><img src={`/avatars/${String(peer.avatar).padStart(2, "0")}.png`} width={36} height={36} alt="" /><span>{peer.name}</span><span aria-hidden="true">→</span></button>)}
        {preview && <p>{c.preview}</p>}
      </section>}
      {error && <p className="arena-notice" role="alert">{error} <button type="button" className="arena-text-button" onClick={() => router.refresh()}>{c.refresh}</button></p>}
      <section className="arena-list"><div className="arena-section-heading"><h2>{c.duel}</h2><span>{arena.waiting}</span></div><p className="arena-muted">{c.waitingCount}: {arena.waiting}</p>
        {arena.active.length === 0 && <p className="arena-empty">{c.noDuels}</p>}
        {arena.active.map(duel => <Link className="arena-duel-card" key={duel.id} href={`/arena/duel/${duel.id}${suffix}`}><div className="arena-card-heading"><strong>vs {duel.opponent}</strong><span className={`arena-status ${duel.myTurn ? "your-turn" : "waiting"}`}>{duel.myTurn ? c.yourTurn : c.waiting}</span></div><div className="arena-card-bottom"><b>{duel.myScore}–{duel.theirScore}</b><div className="arena-mini-rounds">{[0, 1, 2, 3, 4].map(i => <RoundBlocks key={i} answers={duel.rounds[i]?.mine ?? []} label={`${c.round} ${i + 1}`} />)}</div></div></Link>)}
      </section>
      <section className="arena-history"><h2>{c.history}</h2>{arena.history.length === 0 && <p className="arena-empty">{c.noHistory}</p>}{arena.history.map(duel => <Link className={`arena-history-row ${duel.result ?? "expired"}`} href={`/arena/duel/${duel.id}${suffix}`} key={duel.id}><span className="arena-history-emoji" aria-hidden="true">{duel.result === "win" ? "🏆" : duel.result === "loss" ? "💪" : duel.result === "draw" ? "🤝" : "⌛"}</span><div><strong>vs {duel.opponent}</strong><small>{c.duel} · {new Intl.DateTimeFormat(grade === 1 ? "de-AT" : "en-GB", { day: "numeric", month: "short", timeZone: "Europe/Vienna" }).format(new Date(duel.date))}</small><small><DuelResult duel={duel} grade={grade} /></small></div><div className="arena-history-score"><b>{duel.myScore}–{duel.theirScore}</b><small>+{duel.xp} XP</small></div></Link>)}</section>
    </>}
  </main>;
}
