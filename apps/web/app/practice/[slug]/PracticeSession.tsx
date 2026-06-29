"use client";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { xpForTier } from "@domigo/engine";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

type Mode = "grammar" | "vocab";

export default function PracticeSession({ slug, vocab, grammar }: {
  slug: string; vocab: VocabItem[]; grammar: GrammarItem[];
}) {
  const [mode, setMode] = useState<Mode>("grammar");
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<Array<{ tier: Tier; xp: number }>>([]);
  const [streak, setStreak] = useState<number | null>(null);
  useOutboxFlush();

  const list: Array<GrammarItem | VocabItem> = mode === "grammar" ? grammar : vocab;
  const item = list[i];

  const switchMode = (m: Mode) => { setMode(m); setI(0); setAnswered(false); setResults([]); };
  const onResult = (tier: Tier, detail: ResultDetail) => {
    if (!item) return;
    setAnswered(true);
    setResults((prev) => [...prev, { tier, xp: xpForTier(item.difficulty * 10, tier) }]); // instant optimistic UI

    // Best-effort persistence via the offline outbox (queues + retries when offline);
    // the server re-grades authoritatively and returns the updated daily streak.
    void sendAttempt({
      clientAttemptId: crypto.randomUUID(),
      itemId: detail.itemId,
      mode: "practice",
      input: detail.input,
      latencyMs: null,
      hintUsed: false,
    }).then((r) => {
      if (typeof r.streak === "number") setStreak(r.streak);
    });
  };
  const next = () => { setAnswered(false); setI((x) => Math.min(x + 1, list.length - 1)); };

  const xpTotal = results.reduce((s, r) => s + r.xp, 0);
  const counts = results.reduce<Record<string, number>>((m, r) => ({ ...m, [r.tier]: (m[r.tier] ?? 0) + 1 }), {});
  const grade = slug.match(/^g(\d)/)?.[1];
  const tabStyle = (active: boolean): CSSProperties => ({
    border: active ? "none" : "1.5px solid var(--card-border)", borderRadius: 999, padding: "7px 16px", cursor: "pointer",
    background: active ? "var(--accent)" : "var(--card)", color: active ? "#fff" : "var(--text-secondary)",
    fontSize: 14, fontWeight: 700, fontFamily: "var(--font-body)",
  });

  return (
    <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{slug}</h1>
        <Link href="/practice" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← all units</Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button style={tabStyle(mode === "grammar")} onClick={() => switchMode("grammar")}>Grammar ({grammar.length})</button>
        <button style={tabStyle(mode === "vocab")} onClick={() => switchMode("vocab")}>Vocab ({vocab.length})</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
        <span>Item {Math.min(i + 1, list.length)} / {list.length}</span>
        <span>
          {xpTotal} XP{" "}
          {(["correct", "partial", "close", "wrong"] as Tier[])
            .filter((t) => counts[t])
            .map((t) => `· ${counts[t]} ${t}`)
            .join(" ")}
          {streak ? ` · 🔥 ${streak}` : ""}
        </span>
      </div>

      {item ? (
        mode === "grammar" ? (
          <GrammarItemView key={item.id} item={item as GrammarItem} onResult={onResult} />
        ) : (
          <VocabItemView key={item.id} item={item as VocabItem} onResult={onResult} />
        )
      ) : (
        <p>No items in this mode.</p>
      )}

      {answered && (
        <button className="dg-btn" onClick={next} disabled={i >= list.length - 1} style={{ marginTop: 14 }}>
          {i >= list.length - 1 ? "End of set" : "Next →"}
        </button>
      )}
    </main>
  );
}
