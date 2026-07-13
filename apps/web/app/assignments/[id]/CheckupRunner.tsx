"use client";
/**
 * The checkup runner (C-1, doc 21 §6) — paper-shaped: ONE page, sections in
 * preset order, a ___/20 header and ___/n per section, single-attempt items,
 * no hints, the first-letter mask on words-phrases. Answers POST directly to
 * /api/assignments/attempt (server wall + clock govern, like the mock runner).
 *
 * Feedback honors the assignment's display_config (§4b):
 *   immediate  → per-item verdicts as the student answers (practice-like)
 *   on-submit  → verdicts + points appear when the paper is handed in (default)
 *   on-release → only "Abgegeben ✓" after submit; the teacher releases results
 *
 * Never imports @domigo/db (P-29b) — the server page passes everything down;
 * the one pure formatter is inlined.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier, VocabPool } from "@domigo/engine";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";

export type CheckupFeedbackMode = "immediate" | "on-submit" | "on-release";

export interface CheckupRunnerSection {
  position: number;
  kind: "vocab" | "grammar";
  titleDe: string;
  points: number;
  /** first-letter mask on this section's vocab items (words-phrases) */
  mask: boolean;
  /** per-item engine pool, section order (vocab sections; grammar ignores it) */
  pools: VocabPool[];
  items: Array<VocabItem | GrammarItem>;
}

interface CheckupResult {
  points: number;
  outOf: number;
  perSection: Array<{ position: number; points: number; outOf: number }>;
}

/** "14.5", "14" — at most one decimal (doc 21 §7). Inlined pure helper (P-29b:
 *  a client file never imports @domigo/db, where the canonical twin lives). */
function fmtPoints(points: number): string {
  const oneDp = Math.round(points * 10) / 10;
  return Number.isInteger(oneDp) ? String(oneDp) : oneDp.toFixed(1);
}

function fmtClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const SECTION_LETTERS = "ABCDEFGH";

export default function CheckupRunner({ assignmentId, sessionId, title, expiresAt, sections, feedback }: {
  assignmentId: string;
  sessionId: string;
  title: string;
  expiresAt: string | null;
  sections: CheckupRunnerSection[];
  feedback: CheckupFeedbackMode;
}) {
  const [result, setResult] = useState<CheckupResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(() => (expiresAt ? Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000)) : null));
  const submittedRef = useRef(false);
  const outOf = sections.reduce((n, s) => n + s.points, 0);
  const submitted = result !== null;
  // Verdicts stay hidden until the paper is in (unless 'immediate'); 'on-release'
  // never reveals here — the teacher releases results later.
  const revealVerdicts = feedback === "immediate" || (submitted && feedback === "on-submit");
  const showScore = submitted && feedback !== "on-release";

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/assignments/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ assignmentId, sessionId }) });
      const d = await res.json().catch(() => ({}));
      if (d.checkup && typeof d.checkup.points === "number") {
        setResult({ points: d.checkup.points, outOf: d.checkup.outOf, perSection: d.perSection ?? [] });
      } else {
        submittedRef.current = false;
      }
    } catch {
      submittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [assignmentId, sessionId]);

  // Server clock: tick down; auto-submit at 0 (state writes only inside the
  // timer callback — never synchronously in the effect body).
  useEffect(() => {
    if (remaining === null || submitted) return;
    const t = setTimeout(() => {
      if (remaining <= 1) void submit();
      else setRemaining((r) => (r === null ? null : r - 1));
    }, 1000);
    return () => clearTimeout(t);
  }, [remaining, submitted, submit]);

  const onResult = (_tier: Tier, detail: ResultDetail) => {
    // detail.input carries the vocab pool — the server regrades the SAME pool.
    void fetch("/api/assignments/attempt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ clientAttemptId: crypto.randomUUID(), assignmentId, sessionId, itemId: detail.itemId, input: detail.input }),
    }).catch(() => { /* a dropped answer scores 0 for that item — honest under the clock */ });
  };

  // on-release: after handing in there is nothing to look at — a calm receipt.
  if (submitted && feedback === "on-release") {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px", fontFamily: "var(--font-body)", color: "var(--text)", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Abgegeben ✓</h1>
        <p style={{ fontSize: 18 }}><strong>{title}</strong></p>
        <p style={{ color: "var(--text-secondary)" }}>Dein Ergebnis bekommst du, sobald es freigegeben ist.</p>
        <Link href={`/assignments/${assignmentId}`} className="dg-btn" style={{ display: "inline-block", marginTop: 24 }}>Zur Übersicht</Link>
      </main>
    );
  }

  const perSection = new Map((result?.perSection ?? []).map((s) => [s.position, s]));
  const timeLow = remaining !== null && remaining <= 60;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      {/* paper header: title + ___/20 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink)" }}>{title}</div>
        {remaining !== null && !submitted && (
          <div aria-live="polite" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: 20, color: timeLow ? "var(--incorrect)" : "var(--text)" }}>⏱ {fmtClock(remaining)}</div>
        )}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)", marginBottom: 14 }} aria-live="polite">
        {showScore && result ? <>{fmtPoints(result.points)} / {result.outOf} Punkte</> : <>___ / {outOf} Punkte</>}
      </div>

      {/* the paper: every section on ONE page, in order. fieldset locks the
          whole sheet after submit (the server wall enforces it regardless). */}
      <fieldset disabled={submitted} style={{ border: "none", padding: 0, margin: 0, minWidth: 0 }}>
        {sections.map((sec, si) => {
          const scored = perSection.get(sec.position);
          return (
            <section key={sec.position} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-label)", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--accent)" }}>
                  Teil {SECTION_LETTERS[si] ?? si + 1} · {sec.titleDe}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                  {showScore && scored ? `${fmtPoints(scored.points)} / ${scored.outOf}` : `___ / ${sec.points}`}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {sec.items.map((it, i) =>
                  sec.kind === "vocab" ? (
                    <VocabItemView
                      key={it.id}
                      item={it as VocabItem}
                      pool={sec.pools[i] ?? "carrier"}
                      mask={sec.mask ? "first-letter" : undefined}
                      onResult={onResult}
                      hideXp
                      hideHint
                      singleAttempt
                      hideFeedback={!revealVerdicts}
                    />
                  ) : (
                    <GrammarItemView
                      key={it.id}
                      item={it as GrammarItem}
                      onResult={onResult}
                      hideXp
                      hideHint
                      singleAttempt
                      hideFeedback={!revealVerdicts}
                    />
                  ),
                )}
                {sec.items.length === 0 && <p style={{ color: "var(--muted)" }}>Dieser Teil hat keine Aufgaben.</p>}
              </div>
            </section>
          );
        })}
      </fieldset>

      <div style={{ marginTop: 10, display: "flex", justifyContent: submitted ? "center" : "flex-end" }}>
        {submitted ? (
          <Link href={`/assignments/${assignmentId}`} className="dg-btn">Zur Übersicht</Link>
        ) : (
          <button className="dg-btn" disabled={submitting} onClick={() => void submit()}>{submitting ? "Wird abgegeben…" : "Abgeben"}</button>
        )}
      </div>
    </main>
  );
}
