"use client";
import Link from "next/link";
import { useState } from "react";
import type { Tier } from "@domigo/engine";
import { ListeningTaskView, type ClientListeningTask, type ResultDetail } from "@domigo/task-ui";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

export default function ListeningSession({ slug, tasks }: { slug: string; tasks: ClientListeningTask[] }) {
  const [t, setT] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Tier[]>([]);
  const [streak, setStreak] = useState<number | null>(null);
  useOutboxFlush();

  const task = tasks[t];

  const onResult = (tier: Tier, detail: ResultDetail) => {
    setResults((prev) => [...prev, tier]);
    // Listening attempts grade + earn XP/streak but skip the Leitner queue (audio can't re-render in /review).
    void sendAttempt({
      clientAttemptId: crypto.randomUUID(),
      itemId: detail.itemId,
      mode: "listening",
      input: detail.input,
      latencyMs: null,
      hintUsed: false,
    }).then((r) => {
      if (typeof r.streak === "number") setStreak(r.streak);
    });
  };

  const isLast = t >= tasks.length - 1;
  const next = () => {
    if (isLast) { setDone(true); return; }
    setT((x) => x + 1);
  };

  const counts = results.reduce<Record<string, number>>((m, tier) => ({ ...m, [tier]: (m[tier] ?? 0) + 1 }), {});
  const tierSummary = (["correct", "partial", "close", "wrong"] as Tier[])
    .filter((x) => counts[x])
    .map((x) => `· ${counts[x]} ${x}`)
    .join(" ");

  const grade = slug.match(/^g(\d)/)?.[1];

  if (done || !task) {
    return (
      <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
        <h1 style={{ fontSize: 24, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Listening complete — {results.length} answered 👂</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{tierSummary}{streak ? ` · 🔥 ${streak}-day streak` : ""}</p>
        <Link href="/listening" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← All listening</Link>
      </main>
    );
  }

  return (
    <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{slug}</h1>
        <Link href="/listening" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Listening</Link>
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
        Task {t + 1} / {tasks.length}{streak ? ` · 🔥 ${streak}` : ""}
      </div>

      <ListeningTaskView key={task.id} task={task} onResult={onResult} />

      <button className="dg-btn" onClick={next} style={{ marginTop: 16 }}>
        {isLast ? "Finish →" : "Next task →"}
      </button>
    </main>
  );
}
