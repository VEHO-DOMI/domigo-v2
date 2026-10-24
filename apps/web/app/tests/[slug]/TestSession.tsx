"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Gloss, GrammarItem, ListeningItem, ReadingItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { AudioClip, GrammarItemView, VocabItemView, type ClientAudioRef, type ResultDetail } from "@domigo/task-ui";
import { attemptSender } from "@/lib/preview-attempt";
import { useOutboxFlush } from "@/lib/useOutboxFlush";
import { sendCompletedAttempt, sendVocabularyCheck } from "@/lib/vocabulary-history-client";

export type ResolvedSection =
  | { kind: "vocab"; titleDe: string; items: VocabItem[] }
  | { kind: "grammar"; titleDe: string; items: GrammarItem[] }
  | { kind: "listening"; titleDe: string; audio: ClientAudioRef; items: ListeningItem[] }
  | { kind: "reading"; titleDe: string; passage: string; passageGloss: Gloss[]; items: ReadingItem[] }
  | { kind: "writing"; titleDe: string; promptId: string; promptDe: string; taskEn: string; minWords: number; maxWords: number };

const page = { maxWidth: 680, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" } as const;

type TestSessionProps = { preview?: boolean; ownerId: string | null; slug: string; testId: string; sections: ResolvedSection[] };

export default function TestSession(props: TestSessionProps) {
  // A different test/account is a fresh local test, even without a route remount.
  return <TestRound key={JSON.stringify([props.slug, props.testId, props.ownerId, !!props.preview])} {...props} />;
}

function TestRound({ preview = false, ownerId, slug, testId, sections }: TestSessionProps) {
  const [s, setS] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Tier[]>([]);
  const [streak, setStreak] = useState<number | null>(null);
  const completedVisits = useRef(new Set<string>());
  useOutboxFlush(!preview, ownerId);

  const section = sections[s];

  const record = (mode: string) => (tier: Tier, detail: ResultDetail) => {
    const visitId = mode === "test:vocab" && detail.kind === "vocab" ? detail.history?.visitId : undefined;
    // A repeated terminal callback must not manufacture another completion.
    if (visitId && completedVisits.current.has(visitId)) return;
    if (visitId) completedVisits.current.add(visitId);
    setResults((p) => [...p, tier]);
    const body = {
      clientAttemptId: crypto.randomUUID(),
      itemId: detail.itemId,
      mode,
      input: detail.input,
      latencyMs: null,
      hintUsed: false,
    };
    const send = attemptSender(preview, ownerId);
    void (mode === "test:vocab" ? sendCompletedAttempt(send, body, detail) : send(body)).then((r) => {
      if (typeof r.streak === "number") setStreak(r.streak);
    }).catch(() => { /* the existing owned outbox retains pending attempts */ });
  };

  const checkVocabulary = (_tier: Tier, detail: ResultDetail) => {
    void sendVocabularyCheck(attemptSender(preview, ownerId), detail, "test:vocab")
      .catch(() => { /* a failed check is never represented as confirmed */ });
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
        {preview && <p role="status">Vorschau — nichts gespeichert</p>}
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          {correct}/{results.length} auto-graded correct{preview ? "." : " · writing sent for review."}{streak ? ` · 🔥 ${streak}-day streak` : ""}
        </p>
        <Link href={preview ? `/tests?jahrgang=${grade}` : "/tests"} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← All tests</Link>
      </main>
    );
  }

  return (
    <main data-grade={grade} style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Chapter {Number(slug.match(/-u(\d+)/)?.[1])} — test</h1>
        <Link href={preview ? `/tests?jahrgang=${grade}` : "/tests"} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Tests</Link>
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
        Section {s + 1} / {sections.length}{streak ? ` · 🔥 ${streak}` : ""}
      </div>
      <h2 style={{ fontSize: 17, color: "var(--accent)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase" }}>{section.titleDe}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {section.kind === "vocab" &&
          section.items.map((it, index) => <VocabItemView key={`${s}:${index}:${it.id}`} item={it} onCheck={checkVocabulary} onResult={record("test:vocab")} hideHint />)}
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
        {section.kind === "writing" && <WritingArea preview={preview} slug={slug} testId={testId} section={section} />}
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

function WritingArea({ preview, slug, testId, section }: {
  preview: boolean;
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
    if (preview) return;
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
        style={{ width: "100%", boxSizing: "border-box", resize: "vertical" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: ok ? "var(--correct)" : "var(--muted)" }}>{words} words</span>
        <button className="dg-btn" onClick={submit} disabled={saved || !ok} style={{ padding: "8px 16px", fontSize: 14 }}>
          {saved ? (preview ? "Vorschau — nichts gespeichert" : "Submitted ✓") : "Submit writing"}
        </button>
      </div>
    </div>
  );
}
