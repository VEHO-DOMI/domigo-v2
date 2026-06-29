"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GrammarStructure, WordBank } from "@domigo/content-schema";
import { GrammarIntroView, VocabIntroView } from "@domigo/task-ui";

export default function TeachingNode({ unitSlug, nodeId, kind, wordbank, structures }: {
  unitSlug: string;
  nodeId: string;
  kind: string;
  wordbank?: WordBank;
  structures?: GrammarStructure[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Best-effort completion (no outbox — path state is cosmetic + idempotent;
  // a lost write heals on the next visit). Route back to the map either way.
  const markDone = () => {
    setSaving(true);
    void fetch("/api/study-path", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unitSlug, nodeId, stars: 0, accuracy: 1 }),
    })
      .catch(() => {})
      .finally(() => router.push(`/learn/${unitSlug}`));
  };

  const grade = unitSlug.match(/^g(\d)/)?.[1];
  return (
    <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 24, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{kind === "vocab-intro" ? "Vocabulary" : "Grammar"}</h1>
        <Link href={`/learn/${unitSlug}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Path</Link>
      </div>
      {wordbank && <VocabIntroView wordbank={wordbank} />}
      {structures && <GrammarIntroView structures={structures} />}
      <button className="dg-btn" onClick={markDone} disabled={saving} style={{ marginTop: 16 }}>
        {saving ? "Saving…" : "Got it — done ✓"}
      </button>
    </main>
  );
}
