"use client";
import Link from "next/link";
import { useState } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { xpForTier } from "@domigo/engine";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

type QueueItem = { kind: "vocab" | "grammar"; item: VocabItem | GrammarItem };

export default function ReviewSession({ items }: { items: QueueItem[] }) {
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Array<{ tier: Tier; xp: number }>>([]);
  const [streak, setStreak] = useState<number | null>(null);
  useOutboxFlush();

  const current = items[i];

  const onResult = (tier: Tier, detail: ResultDetail) => {
    if (!current) return;
    setAnswered(true);
    setResults((prev) => [...prev, { tier, xp: xpForTier(current.item.difficulty * 10, tier) }]); // instant optimistic UI

    // Best-effort persistence via the offline outbox (queues + retries when offline);
    // the POST re-grades + reschedules the item (mode:"review") and returns the daily streak.
    void sendAttempt({
      clientAttemptId: crypto.randomUUID(),
      itemId: detail.itemId,
      mode: "review",
      input: detail.input,
      latencyMs: null,
      hintUsed: false,
    }).then((r) => {
      if (typeof r.streak === "number") setStreak(r.streak);
    });
  };

  const isLast = i >= items.length - 1;
  const next = () => {
    if (isLast) { setDone(true); return; }
    setAnswered(false);
    setI((x) => x + 1);
  };

  const xpTotal = results.reduce((s, r) => s + r.xp, 0);
  const counts = results.reduce<Record<string, number>>((m, r) => ({ ...m, [r.tier]: (m[r.tier] ?? 0) + 1 }), {});
  const tierSummary = (["correct", "partial", "close", "wrong"] as Tier[])
    .filter((t) => counts[t])
    .map((t) => `· ${counts[t]} ${t}`)
    .join(" ");

  if (done || !current) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
        <h1 style={{ fontSize: 24, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Reviewed {results.length} — see you tomorrow 👋</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{xpTotal} XP {tierSummary}</p>
        {streak ? <p style={{ fontSize: 15, color: "#ea580c", fontWeight: 700 }}>🔥 {streak}-day streak</p> : null}
        <Link href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Review</h1>
        <Link href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
        <span>Item {Math.min(i + 1, items.length)} / {items.length}</span>
        <span>{xpTotal} XP {tierSummary}</span>
      </div>

      {current.kind === "grammar" ? (
        <GrammarItemView key={current.item.id} item={current.item as GrammarItem} onResult={onResult} tactile />
      ) : (
        <VocabItemView key={current.item.id} item={current.item as VocabItem} onResult={onResult} />
      )}

      {answered && (
        <button className="dg-btn" onClick={next} style={{ marginTop: 14 }}>
          {isLast ? "Finish →" : "Next →"}
        </button>
      )}
    </main>
  );
}
