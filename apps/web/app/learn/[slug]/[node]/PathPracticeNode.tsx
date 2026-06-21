"use client";
import Link from "next/link";
import { useState } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { XP_WEIGHT, xpForTier } from "@domigo/engine";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

type QueueItem = { kind: "vocab" | "grammar"; item: VocabItem | GrammarItem };

/** Client-side stars (server re-derives authoritatively); mirrors studypath.starsFor. */
function starsFor(correctEquiv: number, total: number): number {
  if (total <= 0) return 0;
  const acc = correctEquiv / total;
  return acc >= 1 ? 3 : acc >= 0.8 ? 2 : 1;
}

export default function PathPracticeNode({ unitSlug, nodeId, isCheckpoint, items }: {
  unitSlug: string;
  nodeId: string;
  isCheckpoint: boolean;
  items: QueueItem[];
}) {
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Array<{ tier: Tier; xp: number }>>([]);
  const [streak, setStreak] = useState<number | null>(null);
  const [stars, setStars] = useState(0);
  useOutboxFlush();

  const current = items[i];
  const title = isCheckpoint ? "Checkpoint" : "Practice";

  const onResult = (tier: Tier, detail: ResultDetail) => {
    if (!current) return;
    setAnswered(true);
    setResults((prev) => [...prev, { tier, xp: xpForTier(current.item.difficulty * 10, tier) }]);

    // Per-item attempt → the existing graded/idempotent path (feeds review_queue + streak + XP).
    void sendAttempt({
      clientAttemptId: crypto.randomUUID(),
      itemId: detail.itemId,
      mode: `study:${nodeId}`,
      input: detail.input,
      latencyMs: null,
      hintUsed: false,
    }).then((r) => {
      if (typeof r.streak === "number") setStreak(r.streak);
    });
  };

  const finish = (all: Array<{ tier: Tier; xp: number }>) => {
    setDone(true);
    const correctEquiv = all.reduce((s, r) => s + XP_WEIGHT[r.tier], 0);
    const total = all.length;
    const accuracy = total > 0 ? correctEquiv / total : 0;
    setStars(starsFor(correctEquiv, total));
    // Best-effort node-completion (no outbox — cosmetic + keep-best heals a lost write).
    void fetch("/api/study-path", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unitSlug, nodeId, stars: starsFor(correctEquiv, total), accuracy }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.stars === "number") setStars(d.stars);
      })
      .catch(() => {});
  };

  const isLast = i >= items.length - 1;
  const next = () => {
    if (isLast) {
      finish(results);
      return;
    }
    setAnswered(false);
    setI((x) => x + 1);
  };

  const xpTotal = results.reduce((s, r) => s + r.xp, 0);

  if (done || !current) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 22 }}>{title} complete</h1>
        <p style={{ fontSize: 24, margin: "4px 0", color: "#ea580c" }}>
          {"★".repeat(stars)}
          {"☆".repeat(3 - stars)}
        </p>
        <p style={{ fontSize: 15, color: "#334155" }}>
          {xpTotal} XP{streak ? ` · 🔥 ${streak}-day streak` : ""}
        </p>
        <Link href={`/learn/${unitSlug}`} style={{ fontSize: 14, color: "#2563eb" }}>← Back to path</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>{title}</h1>
        <Link href={`/learn/${unitSlug}`} style={{ fontSize: 14, color: "#2563eb" }}>← Path</Link>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 10 }}>
        <span>Item {Math.min(i + 1, items.length)} / {items.length}</span>
        <span>{xpTotal} XP{streak ? ` · 🔥 ${streak}` : ""}</span>
      </div>

      {current.kind === "grammar" ? (
        <GrammarItemView key={current.item.id} item={current.item as GrammarItem} onResult={onResult} hideHint={isCheckpoint} />
      ) : (
        <VocabItemView key={current.item.id} item={current.item as VocabItem} onResult={onResult} hideHint={isCheckpoint} />
      )}

      {answered && (
        <button
          onClick={next}
          style={{
            marginTop: 14, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 18px", fontSize: 15, cursor: "pointer",
          }}
        >
          {isLast ? "Finish →" : "Next →"}
        </button>
      )}
    </main>
  );
}
