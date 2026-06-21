"use client";
import Link from "next/link";
import { useState } from "react";
import type { AudioRef, Gloss, GrammarItem, ListeningItem, ReadingItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { AudioClip, GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

export type ResolvedSection =
  | { kind: "vocab"; titleDe: string; items: VocabItem[] }
  | { kind: "grammar"; titleDe: string; items: GrammarItem[] }
  | { kind: "listening"; titleDe: string; audio: AudioRef; items: ListeningItem[] }
  | { kind: "reading"; titleDe: string; passage: string; passageGloss: Gloss[]; items: ReadingItem[] }
  | { kind: "writing"; titleDe: string; promptId: string; promptDe: string; taskEn: string; minWords: number; maxWords: number };

const page = { maxWidth: 680, margin: "0 auto", padding: "28px 20px", fontFamily: "system-ui, sans-serif" } as const;

export default function TestSession({ slug, testId, sections }: { slug: string; testId: string; sections: ResolvedSection[] }) {
  const [s, setS] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Tier[]>([]);
  const [streak, setStreak] = useState<number | null>(null);
  useOutboxFlush();

  const section = sections[s];

  const record = (mode: string) => (tier: Tier, detail: ResultDetail) => {
    setResults((p) => [...p, tier]);
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

  const isLast = s >= sections.length - 1;
  const next = () => {
    if (isLast) { setDone(true); return; }
    setS((x) => x + 1);
  };

  if (done || !section) {
    const correct = results.filter((t) => t === "correct").length;
    return (
      <main style={page}>
        <h1 style={{ fontSize: 22 }}>Test complete 🎓</h1>
        <p style={{ fontSize: 15, color: "#334155" }}>
          {correct}/{results.length} auto-graded correct · writing sent for review.{streak ? ` · 🔥 ${streak}-day streak` : ""}
        </p>
        <Link href="/tests" style={{ fontSize: 14, color: "#2563eb" }}>← All tests</Link>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>{slug} — test</h1>
        <Link href="/tests" style={{ fontSize: 14, color: "#2563eb" }}>← Tests</Link>
      </div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
        Section {s + 1} / {sections.length}{streak ? ` · 🔥 ${streak}` : ""}
      </div>
      <h2 style={{ fontSize: 18, color: "#334155" }}>{section.titleDe}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {section.kind === "vocab" &&
          section.items.map((it) => <VocabItemView key={it.id} item={it} onResult={record("test:vocab")} hideHint />)}
        {section.kind === "grammar" &&
          section.items.map((it) => <GrammarItemView key={it.id} item={it} onResult={record("test:grammar")} hideHint />)}
        {section.kind === "listening" && (
          <>
            <AudioClip audio={section.audio} />
            {section.items.map((it) => (
              <GrammarItemView key={it.id} item={it as unknown as GrammarItem} onResult={record("test:listening")} hideHint />
            ))}
          </>
        )}
        {section.kind === "reading" && (
          <>
            <ReadingPassage passage={section.passage} gloss={section.passageGloss} />
            {section.items.map((it) => (
              <GrammarItemView key={it.id} item={it as unknown as GrammarItem} onResult={record("test:reading")} hideHint />
            ))}
          </>
        )}
        {section.kind === "writing" && <WritingArea slug={slug} testId={testId} section={section} />}
      </div>

      <button
        onClick={next}
        style={{ marginTop: 16, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 15, cursor: "pointer" }}
      >
        {isLast ? "Finish →" : "Next section →"}
      </button>
    </main>
  );
}

function ReadingPassage({ passage, gloss }: { passage: string; gloss: Gloss[] }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#0f172a" }}>{passage}</p>
      {gloss.length > 0 && (
        <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "#475569", fontSize: 13 }}>
          {gloss.map((g, i) => (
            <li key={i}>
              <strong>{g.word}</strong> = {g.de}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WritingArea({ slug, testId, section }: {
  slug: string;
  testId: string;
  section: { promptId: string; promptDe: string; taskEn: string; minWords: number; maxWords: number };
}) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const ok = words >= section.minWords && words <= section.maxWords;
  const submit = () => {
    setSaved(true);
    void fetch("/api/writing-submission", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unitSlug: slug, testId, promptId: section.promptId, text }),
    }).catch(() => {});
  };
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff", display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ margin: 0, fontSize: 15, color: "#0f172a" }}>{section.taskEn}</p>
      <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
        {section.promptDe} ({section.minWords}–{section.maxWords} Wörter)
      </p>
      <textarea
        value={text}
        disabled={saved}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 8, padding: 10, fontSize: 15, fontFamily: "inherit" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: ok ? "#16a34a" : "#94a3b8" }}>{words} words</span>
        <button
          onClick={submit}
          disabled={saved || !ok}
          style={{
            background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 14,
            cursor: saved || !ok ? "default" : "pointer", opacity: saved || !ok ? 0.5 : 1,
          }}
        >
          {saved ? "Submitted ✓" : "Submit writing"}
        </button>
      </div>
    </div>
  );
}
