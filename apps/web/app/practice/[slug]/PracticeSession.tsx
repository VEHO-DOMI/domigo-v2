"use client";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { xpForTier } from "@domigo/engine";
import { GrammarItemView, VocabItemView } from "@domigo/task-ui";

type Mode = "grammar" | "vocab";

export default function PracticeSession({ slug, vocab, grammar }: {
  slug: string; vocab: VocabItem[]; grammar: GrammarItem[];
}) {
  const [mode, setMode] = useState<Mode>("grammar");
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<Array<{ tier: Tier; xp: number }>>([]);

  const list: Array<GrammarItem | VocabItem> = mode === "grammar" ? grammar : vocab;
  const item = list[i];

  const switchMode = (m: Mode) => { setMode(m); setI(0); setAnswered(false); setResults([]); };
  const onResult = (tier: Tier) => {
    if (!item) return;
    setAnswered(true);
    setResults((prev) => [...prev, { tier, xp: xpForTier(item.difficulty * 10, tier) }]);
  };
  const next = () => { setAnswered(false); setI((x) => Math.min(x + 1, list.length - 1)); };

  const xpTotal = results.reduce((s, r) => s + r.xp, 0);
  const counts = results.reduce<Record<string, number>>((m, r) => ({ ...m, [r.tier]: (m[r.tier] ?? 0) + 1 }), {});
  const tabStyle = (active: boolean): CSSProperties => ({
    border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", cursor: "pointer",
    background: active ? "#111827" : "#fff", color: active ? "#fff" : "#334155", fontSize: 14,
  });

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>{slug}</h1>
        <Link href="/practice" style={{ fontSize: 14, color: "#2563eb" }}>← all units</Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button style={tabStyle(mode === "grammar")} onClick={() => switchMode("grammar")}>Grammar ({grammar.length})</button>
        <button style={tabStyle(mode === "vocab")} onClick={() => switchMode("vocab")}>Vocab ({vocab.length})</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 10 }}>
        <span>Item {Math.min(i + 1, list.length)} / {list.length}</span>
        <span>
          {xpTotal} XP{" "}
          {(["correct", "partial", "close", "wrong"] as Tier[])
            .filter((t) => counts[t])
            .map((t) => `· ${counts[t]} ${t}`)
            .join(" ")}
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
        <button
          onClick={next}
          disabled={i >= list.length - 1}
          style={{
            marginTop: 14, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 18px", fontSize: 15, cursor: i >= list.length - 1 ? "default" : "pointer",
            opacity: i >= list.length - 1 ? 0.5 : 1,
          }}
        >
          {i >= list.length - 1 ? "End of set" : "Next →"}
        </button>
      )}
    </main>
  );
}
