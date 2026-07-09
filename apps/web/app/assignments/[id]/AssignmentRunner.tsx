"use client";
/**
 * The assignment runner (M-3). Walks the sitting's sections forward-only; each
 * answer POSTs DIRECTLY to /api/assignments/attempt (NO outbox — a mock test's
 * clock is the server's, so answers must reach it live and be walled there).
 * A mock renders items single-attempt (Schularbeit: no retry ladder). When the
 * server clock runs out the runner auto-submits. Finish → /api/assignments/submit
 * returns the exact Note.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";

export interface RunnerSection {
  position: number;
  kind: "vocab" | "grammar";
  titleDe: string;
  items: Array<VocabItem | GrammarItem>;
}

interface SubmitResult { note: number; displayPct: number }

const NOTE_LABEL: Record<number, string> = { 1: "Sehr gut", 2: "Gut", 3: "Befriedigend", 4: "Genügend", 5: "Nicht genügend" };

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AssignmentRunner({ assignmentId, sessionId, title, mode, expiresAt, sections }: {
  assignmentId: string; sessionId: string; title: string; mode: "practice" | "mock_test"; expiresAt: string | null; sections: RunnerSection[];
}) {
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(() => (expiresAt ? Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000)) : null));
  const submittedRef = useRef(false);
  const isMock = mode === "mock_test";
  const section = sections[idx];
  const last = idx >= sections.length - 1;

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/assignments/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ assignmentId, sessionId }) });
      const d = await res.json().catch(() => ({}));
      if (d.ok || typeof d.note === "number") setResult({ note: d.note, displayPct: d.displayPct });
      else { submittedRef.current = false; setSubmitting(false); }
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
    }
  }, [assignmentId, sessionId]);

  // Server clock: tick down; auto-submit at 0. All state writes happen inside the
  // timer callback (async) — never synchronously in the effect body.
  useEffect(() => {
    if (remaining === null || result) return;
    const t = setTimeout(() => {
      if (remaining <= 1) void submit();
      else setRemaining((r) => (r === null ? null : r - 1));
    }, 1000);
    return () => clearTimeout(t);
  }, [remaining, result, submit]);

  const onResult = (_tier: Tier, detail: ResultDetail) => {
    const input = detail.kind === "vocab" ? { kind: "vocab" as const, value: detail.input.value } : detail.input;
    // Fire directly (no outbox) so the server wall + clock govern the record.
    void fetch("/api/assignments/attempt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ clientAttemptId: crypto.randomUUID(), assignmentId, sessionId, itemId: detail.itemId, input }),
    }).catch(() => { /* a dropped answer scores 0 for that item — honest under the clock */ });
  };

  if (result) {
    const good = result.note <= 2;
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px", fontFamily: "var(--font-body)", color: "var(--text)", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Abgegeben ✓</h1>
        <p style={{ fontSize: 18 }}><strong>{title}</strong></p>
        {isMock ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: good ? "var(--correct)" : result.note <= 4 ? "var(--partial)" : "var(--incorrect)" }}>Note {result.note}</div>
            <div style={{ fontSize: 15, color: "var(--text-secondary)" }}>{NOTE_LABEL[result.note]} · {Math.round(result.displayPct)}%</div>
          </div>
        ) : (
          <div style={{ marginTop: 16, fontSize: 20, fontWeight: 700 }}>{Math.round(result.displayPct)}% richtig</div>
        )}
        <Link href={`/assignments/${assignmentId}`} className="dg-btn" style={{ display: "inline-block", marginTop: 24 }}>Zur Übersicht</Link>
      </main>
    );
  }

  if (!section) {
    return <main style={{ maxWidth: 560, margin: "0 auto", padding: 40 }}><Link href={`/assignments/${assignmentId}`}>← Zurück</Link></main>;
  }

  const timeLow = remaining !== null && remaining <= 60;
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>{title}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Teil {idx + 1} / {sections.length} · {section.titleDe}
          </div>
        </div>
        {remaining !== null && (
          <div aria-live="polite" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: 20, color: timeLow ? "var(--incorrect)" : "var(--text)" }}>⏱ {fmt(remaining)}</div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {section.items.map((it) =>
          section.kind === "vocab"
            ? <VocabItemView key={it.id} item={it as VocabItem} onResult={onResult} hideXp hideHint={isMock} singleAttempt={isMock} />
            : <GrammarItemView key={it.id} item={it as GrammarItem} onResult={onResult} hideXp hideHint={isMock} singleAttempt={isMock} />,
        )}
        {section.items.length === 0 && <p style={{ color: "var(--muted)" }}>Dieser Teil hat keine Aufgaben.</p>}
      </div>

      <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
        {last ? (
          <button className="dg-btn" disabled={submitting} onClick={submit}>{submitting ? "Wird abgegeben…" : "Abgeben"}</button>
        ) : (
          <button className="dg-btn" onClick={() => setIdx((i) => i + 1)}>Nächster Teil →</button>
        )}
      </div>
    </main>
  );
}
