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

const page = { maxWidth: 680, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" } as const;

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

  const grade = slug.match(/^g(\d)/)?.[1];

  if (done || !section) {
    const correct = results.filter((t) => t === "correct").length;
    return (
      <main data-grade={grade} style={page}>
        <h1 style={{ fontSize: 24, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Test complete 🎓</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          {correct}/{results.length} auto-graded correct · writing sent for review.{streak ? ` · 🔥 ${streak}-day streak` : ""}
        </p>
        <Link href="/tests" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← All tests</Link>
      </main>
    );
  }

  return (
    <main data-grade={grade} style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{slug} — test</h1>
        <Link href="/tests" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Tests</Link>
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
        Section {s + 1} / {sections.length}{streak ? ` · 🔥 ${streak}` : ""}
      </div>
      <h2 style={{ fontSize: 17, color: "var(--accent)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase" }}>{section.titleDe}</h2>

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

      <button className="dg-btn" onClick={next} style={{ marginTop: 16 }}>
        {isLast ? "Finish →" : "Next section →"}
      </button>
    </main>
  );
}

function ReadingPassage({ passage, gloss }: { passage: string; gloss: Gloss[] }) {
  return (
    <div className="dg-card">
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--text)" }}>{passage}</p>
      {gloss.length > 0 && (
        <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--text-secondary)", fontSize: 13 }}>
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
    <div className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ margin: 0, fontSize: 15, color: "var(--text)" }}>{section.taskEn}</p>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
        {section.promptDe} ({section.minWords}–{section.maxWords} Wörter)
      </p>
      <textarea
        value={text}
        disabled={saved}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="dg-input"
        style={{ width: "100%", resize: "vertical" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: ok ? "var(--correct)" : "var(--muted)" }}>{words} words</span>
        <button className="dg-btn" onClick={submit} disabled={saved || !ok} style={{ padding: "8px 16px", fontSize: 14 }}>
          {saved ? "Submitted ✓" : "Submit writing"}
        </button>
      </div>
    </div>
  );
}
