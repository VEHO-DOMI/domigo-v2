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

export default function PathPracticeNode({ unitSlug, nodeId, isCheckpoint, items, attemptMode }: {
  unitSlug: string;
  nodeId: string;
  isCheckpoint: boolean;
  items: QueueItem[];
  /** the attempt `mode` — legacy Study Path (default `study:<node>`) or, for a
   *  J-1 journey node, `journey:<unit>:<node>`. A journey node DERIVES its progress
   *  from these attempts, so it does NOT write the study_path_progress table (F3). */
  attemptMode?: string;
}) {
  const mode = attemptMode ?? `study:${nodeId}`;
  const isJourney = mode.startsWith("journey:");
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
      mode,
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
    // A journey node's progress is DERIVED from the attempts just posted — it must
    // NOT write study_path_progress (F3: no separate path-state table for journeys).
    if (isJourney) return;
    // Legacy Study Path: best-effort node-completion (no outbox — cosmetic + keep-best heals a lost write).
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
  const grade = unitSlug.match(/^g(\d)/)?.[1];

  if (done || !current) {
    return (
      <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
        <h1 style={{ fontSize: 24, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{title} complete</h1>
        <p style={{ fontSize: 28, margin: "4px 0", color: "#e6a700", letterSpacing: 2 }}>
          {"★".repeat(stars)}
          {"☆".repeat(3 - stars)}
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          {xpTotal} XP{streak ? ` · 🔥 ${streak}-day streak` : ""}
        </p>
        <Link href={`/learn/${unitSlug}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Back to path</Link>
      </main>
    );
  }

  return (
    <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{title}</h1>
        <Link href={`/learn/${unitSlug}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Path</Link>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
        <span>Item {Math.min(i + 1, items.length)} / {items.length}</span>
        <span>{xpTotal} XP{streak ? ` · 🔥 ${streak}` : ""}</span>
      </div>

      {current.kind === "grammar" ? (
        <GrammarItemView key={current.item.id} item={current.item as GrammarItem} onResult={onResult} hideHint={isCheckpoint} />
      ) : (
        <VocabItemView key={current.item.id} item={current.item as VocabItem} onResult={onResult} hideHint={isCheckpoint} />
      )}

      {answered && (
        <button className="dg-btn" onClick={next} style={{ marginTop: 14 }}>
          {isLast ? "Finish →" : "Next →"}
        </button>
      )}
    </main>
  );
}
