"use client";
/**
 * The mock-test / practice-set / checkup composer (M-2 + C-1). Pure client
 * state; the finished draft POSTs to /api/admin/assignments, which RE-VALIDATES
 * authoritatively (reserved items, weights, the checkup Σ=20 gate) — the inline
 * checks here are only for live feedback. Scope: vocab + grammar sections (the
 * auto-graded core); listening/reading/writing land in M-2b.
 *
 * Checkup mode (doc 21 §4b, both creation modes native): picking "Check-up"
 * seeds the class-grade's /20 preset sections (server-passed — this client file
 * never imports @domigo/db, P-29b). The teacher can auto-fill a unit
 * ("Automatisch füllen" → /api/admin/assignments/compose-checkup) AND/OR pick
 * any item manually; points stay editable per section, Σ must be exactly 20.
 */
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

interface ClassRow { id: string; name: string; grade: number }
interface CatalogItem { id: string; label: string; format: string; difficulty: number }
interface CatalogUnit { unitSlug: string; vocab: CatalogItem[]; grammar: CatalogItem[] }

type Kind = "vocab" | "grammar";
type Mode = "practice" | "mock_test" | "checkup";

// C-1 client-local twins of the @domigo/db checkup types (P-29b: no db import
// in a client component; the server page passes the preset DATA down).
type CheckupKind = "words-phrases" | "translations" | "definitions" | "grammar";
type FeedbackMode = "immediate" | "on-submit" | "on-release";
interface CheckupConfig {
  checkupKind: CheckupKind;
  points: number;
  mask: boolean;
  direction: "mixed" | "deToEn" | "enToDe";
}
export interface CheckupPreset {
  checkupKind: CheckupKind;
  points: number;
  mask?: "first-letter" | null;
  direction?: "mixed" | "deToEn" | "enToDe";
  note?: string;
}

interface Section { kind: Kind; itemIds: string[]; weightPct: number; checkup?: CheckupConfig }

const CHECKUP_TOTAL = 20;
const CHECKUP_KIND_LABEL: Record<CheckupKind, string> = {
  "words-phrases": "Words & phrases",
  translations: "Translations",
  definitions: "Definitions",
  grammar: "Grammar",
};

const fromPreset = (p: CheckupPreset): Section => ({
  kind: p.checkupKind === "grammar" ? "grammar" : "vocab",
  itemIds: [],
  weightPct: 0,
  checkup: {
    checkupKind: p.checkupKind,
    points: p.points,
    mask: p.mask === "first-letter",
    direction: p.direction ?? "mixed",
  },
});

const AHS = { 1: 90, 2: 80, 3: 65, 4: 50 };

const card: CSSProperties = { border: "1px solid var(--card-border)", borderRadius: 16, padding: 16, background: "var(--card)", boxShadow: "var(--shadow-card)", marginTop: 14 };
const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 4 };
const input: CSSProperties = { fontFamily: "var(--font-body)", fontSize: 15, padding: "8px 11px", borderRadius: 10, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%" };

export default function AssignmentBuilder({ classes, checkupPresets }: { classes: ClassRow[]; checkupPresets: Record<number, CheckupPreset[]> }) {
  const [title, setTitle] = useState("");
  const [mode, setModeState] = useState<Mode>("mock_test");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [dueAt, setDueAt] = useState("");
  const [attemptsPerTest, setAttempts] = useState(1);
  const [durationMin, setDurationMin] = useState<number | "">("");
  const [ns, setNs] = useState<{ 1: number; 2: number; 3: number; 4: number }>(AHS);
  const [sections, setSections] = useState<Section[]>([]);
  const [catalog, setCatalog] = useState<CatalogUnit[]>([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  // C-1 checkup state: verdict visibility (default on-submit, §4b), the unit
  // for "Automatisch füllen", and its in-flight flag.
  const [feedback, setFeedback] = useState<FeedbackMode>("on-submit");
  const [fillUnit, setFillUnit] = useState("");
  const [filling, setFilling] = useState(false);

  const grade = classes.find((c) => c.id === classId)?.grade ?? 0;

  /** Mode switch. Entering checkup seeds the grade preset's /20 scaffold (empty
   *  item lists — the teacher fills by auto-fill or by hand) and defaults the
   *  timer to 10 minutes (§8-⑥); leaving checkup drops the checkup configs. */
  const setMode = (m: Mode) => {
    setModeState(m);
    if (m === "checkup") {
      setSections((checkupPresets[grade] ?? []).map(fromPreset));
      setDurationMin((d) => (d === "" ? 10 : d));
    } else {
      setSections((prev) => prev.map((s) => ({ kind: s.kind, itemIds: s.itemIds, weightPct: s.weightPct })));
    }
  };

  useEffect(() => {
    let alive = true;
    // All state writes live inside this async fn (never synchronously in the
    // effect body — that would cascade renders; see the react-hooks lint).
    const load = async () => {
      if (!classId || !grade) { if (alive) { setCatalog([]); setCatError(null); } return; }
      if (alive) { setLoadingCat(true); setCatError(null); }
      // A failed/empty catalog must be VISIBLE, never mistaken for "no class
      // picked" — this exact silence hid the missing-corpus deploy bug
      // (2026-07-13: Vercel functions shipped without content/, catalog 500'd,
      // the builder showed the innocent placeholder).
      try {
        const r = await fetch(`/api/admin/catalog?grade=${grade}&classId=${classId}`);
        const d = await r.json().catch(() => null);
        if (!alive) return;
        if (r.ok && d?.ok && Array.isArray(d.units) && d.units.length > 0) {
          setCatalog(d.units as CatalogUnit[]);
        } else {
          setCatalog([]);
          setCatError(
            d?.error === "forbidden"
              ? "Katalog: keine Berechtigung — bitte neu anmelden."
              : `Der Aufgaben-Katalog konnte nicht geladen werden (${r.status}${d?.error ? ` · ${d.error}` : ""}). Das ist ein Plattform-Problem, kein Bedienfehler — bitte an Fable melden.`,
          );
        }
      } catch {
        if (alive) { setCatalog([]); setCatError("Der Aufgaben-Katalog konnte nicht geladen werden (Netzwerkfehler)."); }
      } finally {
        if (alive) setLoadingCat(false);
      }
    };
    void load();
    return () => { alive = false; };
  }, [classId, grade]);

  const labelOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of catalog) { for (const v of u.vocab) m.set(v.id, v.label); for (const g of u.grammar) m.set(g.id, g.label); }
    return m;
  }, [catalog]);

  const totalWeight = sections.reduce((s, x) => s + x.weightPct, 0);
  const totalPoints = sections.reduce((s, x) => s + (x.checkup?.points ?? 0), 0);
  const setSection = (i: number, patch: Partial<Section>) => setSections((prev) => prev.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const setCheckup = (i: number, patch: Partial<CheckupConfig>) =>
    setSections((prev) => prev.map((s, k) => (k === i && s.checkup ? { ...s, checkup: { ...s.checkup, ...patch } } : s)));
  const addSection = (kind: Kind) => setSections((prev) => [...prev, { kind, itemIds: [], weightPct: 0 }]);
  const addCheckupSection = (checkupKind: CheckupKind) =>
    setSections((prev) => {
      const remaining = Math.max(1, CHECKUP_TOTAL - prev.reduce((s, x) => s + (x.checkup?.points ?? 0), 0));
      return [...prev, fromPreset({ checkupKind, points: remaining, mask: checkupKind === "words-phrases" ? "first-letter" : null })];
    });
  const removeSection = (i: number) => setSections((prev) => prev.filter((_, k) => k !== i));
  const toggleItem = (i: number, id: string) =>
    setSection(i, { itemIds: sections[i]!.itemIds.includes(id) ? sections[i]!.itemIds.filter((x) => x !== id) : [...sections[i]!.itemIds, id] });

  /** §4b mode 1: compose the /20 paper from one unit server-side (deterministic,
   *  reserved items excluded). Each click re-rolls (a fresh seed server-side);
   *  the teacher then edits freely — this is a STARTING POINT, not a publish. */
  const autoFill = async () => {
    if (!fillUnit || filling) return;
    setFilling(true);
    setServerErrors([]);
    try {
      const presets = sections.length > 0 && sections.every((s) => s.checkup)
        ? sections.map((s) => ({
            checkupKind: s.checkup!.checkupKind,
            points: s.checkup!.points,
            mask: s.checkup!.mask ? ("first-letter" as const) : null,
            direction: s.checkup!.direction,
          }))
        : undefined; // fall back to the grade preset server-side
      const res = await fetch("/api/admin/assignments/compose-checkup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ classId, unitSlug: fillUnit, presets }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        setSections(
          (d.sections as Array<{ kind: Kind; itemIds: string[]; sectionConfig: { checkupKind: CheckupKind; points: number; mask?: string | null; direction?: CheckupConfig["direction"] } }>).map((s) => ({
            kind: s.kind,
            itemIds: s.itemIds,
            weightPct: 0,
            checkup: {
              checkupKind: s.sectionConfig.checkupKind,
              points: s.sectionConfig.points,
              mask: s.sectionConfig.mask === "first-letter",
              direction: s.sectionConfig.direction ?? "mixed",
            },
          })),
        );
      } else {
        setServerErrors(d.errors ?? [d.error ?? "Could not compose the checkup."]);
      }
    } catch {
      setServerErrors(["Network error — try again."]);
    } finally {
      setFilling(false);
    }
  };

  // Live (non-authoritative) issues — the server re-checks reserved/dupes on save.
  const issues = useMemo(() => {
    const e: string[] = [];
    if (title.trim() === "") e.push("Give the assignment a title.");
    if (!classId) e.push("Choose a class.");
    if (sections.length === 0) e.push("Add at least one section.");
    sections.forEach((s, i) => { if (s.itemIds.length === 0) e.push(`Section ${i + 1}: pick at least one item.`); });
    if (mode === "mock_test") {
      if (totalWeight !== 100) e.push(`Mock-test weights must total 100% (now ${totalWeight}%).`);
      if (sections.some((s) => s.weightPct === 0)) e.push("Every mock-test section needs a weight above 0%.");
      if (!(ns[1] > ns[2] && ns[2] > ns[3] && ns[3] > ns[4])) e.push("The Notenschlüssel must descend from Note 1 to Note 4.");
    }
    if (mode === "checkup") {
      if (totalPoints !== CHECKUP_TOTAL) e.push(`A checkup is always exactly /${CHECKUP_TOTAL} — sections sum to ${totalPoints}.`);
      sections.forEach((s, i) => {
        if (s.checkup && s.itemIds.length !== s.checkup.points) {
          e.push(`Section ${i + 1}: ${s.itemIds.length} item(s) for ${s.checkup.points} point(s) — one item = one point.`);
        }
      });
    }
    return e;
  }, [title, classId, sections, mode, totalWeight, totalPoints, ns]);

  const save = async () => {
    setSaving(true);
    setServerErrors([]);
    const draft = {
      title, mode, classId, dueAt: dueAt || null,
      attemptsPerTest,
      sessionDurationMinutes: (mode === "mock_test" || mode === "checkup") && durationMin !== "" ? Number(durationMin) : null,
      notenSchluessel: mode === "mock_test" && (ns[1] !== AHS[1] || ns[2] !== AHS[2] || ns[3] !== AHS[3] || ns[4] !== AHS[4]) ? ns : null,
      // Checkups persist their verdict-visibility knob (default on-submit, §4b).
      displayConfig: mode === "checkup" ? { feedback, showScore: feedback === "on-release" ? ("on-release" as const) : ("on-submit" as const) } : null,
      sections: sections.map((s, position) => ({
        position,
        kind: s.kind,
        itemIds: s.itemIds,
        weightPct: mode === "mock_test" ? s.weightPct : 0,
        sectionConfig: mode === "checkup" && s.checkup
          ? {
              checkupKind: s.checkup.checkupKind,
              points: s.checkup.points,
              mask: s.checkup.mask ? ("first-letter" as const) : null,
              ...(s.checkup.checkupKind === "translations" ? { direction: s.checkup.direction } : {}),
            }
          : null,
      })),
    };
    try {
      const res = await fetch("/api/admin/assignments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { window.location.href = "/admin/assignments"; return; }
      setServerErrors(d.errors ?? [d.error ?? "Could not save."]);
    } catch {
      setServerErrors(["Network error — try again."]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 64px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>New assignment</h1>
        <Link href="/admin/assignments" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← All assignments</Link>
      </div>

      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={label}>Title</label>
            <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Schularbeit 1 – Units 1–3" />
          </div>
          <div>
            <label style={label}>Mode</label>
            <div style={{ display: "flex", gap: 6 }}>
              {(["mock_test", "practice", "checkup"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  style={{ ...input, width: "auto", flex: 1, cursor: "pointer", fontWeight: 700, background: mode === m ? "var(--accent)" : "var(--bg-sunken)", color: mode === m ? "#fff" : "var(--text-secondary)", border: mode === m ? "none" : "1px solid var(--card-border)" }}>
                  {m === "mock_test" ? "Mock test" : m === "practice" ? "Practice" : "Check-up"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Class</label>
            <select style={input} value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.length === 0 && <option value="">(no classes found)</option>}
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name} (G{c.grade})</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Due date</label>
            <input style={input} type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          </div>
          <div>
            <label style={label}>Attempts (1–3)</label>
            <input style={input} type="number" min={1} max={3} value={attemptsPerTest} onChange={(e) => setAttempts(Math.max(1, Math.min(3, Number(e.target.value) || 1)))} />
          </div>
          {(mode === "mock_test" || mode === "checkup") && (
            <div>
              <label style={label}>{mode === "checkup" ? "Timer (min, default 10)" : "Timer (min, optional)"}</label>
              <input style={input} type="number" min={1} value={durationMin} onChange={(e) => setDurationMin(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))} placeholder="untimed" />
            </div>
          )}
        </div>

        {/* C-1 checkup controls: auto-fill from one unit + verdict visibility.
            Points-only by decision (§8-③) — no Notenschlüssel block here. */}
        {mode === "checkup" && (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={label}>Automatisch füllen (unit)</label>
              <div style={{ display: "flex", gap: 6 }}>
                <select style={input} value={fillUnit} onChange={(e) => setFillUnit(e.target.value)}>
                  <option value="">Choose a unit…</option>
                  {catalog.map((u) => <option key={u.unitSlug} value={u.unitSlug}>{u.unitSlug}</option>)}
                </select>
                <button type="button" className="dg-btn-secondary" disabled={!fillUnit || filling} onClick={() => void autoFill()} style={{ whiteSpace: "nowrap" }}>
                  {filling ? "Composing…" : "Automatisch füllen"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 0" }}>
                Fills the /20 sections from this unit (reserved items excluded). Every pick stays editable.
              </p>
            </div>
            <div>
              <label style={label}>Feedback für Schüler:innen</label>
              <select style={input} value={feedback} onChange={(e) => setFeedback(e.target.value as FeedbackMode)}>
                <option value="on-submit">Nach Abgabe (Standard)</option>
                <option value="immediate">Sofort (nach jeder Aufgabe)</option>
                <option value="on-release">Erst bei Freigabe</option>
              </select>
            </div>
          </div>
        )}

        {mode === "mock_test" && (
          <div style={{ marginTop: 14 }}>
            <label style={label}>Notenschlüssel (min % per Note; Note 5 is the floor)</label>
            <div style={{ display: "flex", gap: 8 }}>
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Note {n}</span>
                  <input style={input} type="number" min={0} max={100} value={ns[n]} onChange={(e) => setNs({ ...ns, [n]: Number(e.target.value) })} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* sections */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <h2 style={{ fontSize: 18, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Sections</h2>
        {mode === "mock_test" && (
          <span style={{ fontSize: 13, fontWeight: 700, color: totalWeight === 100 ? "var(--correct)" : "var(--incorrect)" }}>
            Weights: {totalWeight}% / 100%
          </span>
        )}
        {mode === "checkup" && (
          <span style={{ fontSize: 13, fontWeight: 700, color: totalPoints === CHECKUP_TOTAL ? "var(--correct)" : "var(--incorrect)" }}>
            Punkte: {totalPoints} / {CHECKUP_TOTAL}
          </span>
        )}
      </div>

      {catError && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "10px 14px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, marginTop: 10 }}>
          ⚠ {catError}
        </p>
      )}

      {sections.map((s, i) => (
        <div key={i} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              {i + 1}. {s.checkup ? CHECKUP_KIND_LABEL[s.checkup.checkupKind] : s.kind === "vocab" ? "Vocabulary" : "Grammar"}{" "}
              <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 13 }}>
                · {s.itemIds.length} picked{s.checkup ? ` / ${s.checkup.points} Punkte` : ""}
              </span>
            </strong>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {mode === "mock_test" && (
                <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 6, alignItems: "center" }}>
                  weight
                  <input type="number" min={0} max={100} value={s.weightPct} onChange={(e) => setSection(i, { weightPct: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                    style={{ ...input, width: 68, padding: "5px 8px" }} />%
                </label>
              )}
              {mode === "checkup" && s.checkup && (
                <>
                  <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 6, alignItems: "center" }}>
                    Punkte
                    <input type="number" min={1} max={CHECKUP_TOTAL} value={s.checkup.points}
                      onChange={(e) => setCheckup(i, { points: Math.max(1, Math.min(CHECKUP_TOTAL, Number(e.target.value) || 1)) })}
                      style={{ ...input, width: 62, padding: "5px 8px" }} />
                  </label>
                  {s.kind === "vocab" && s.checkup.checkupKind !== "translations" && (
                    <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 5, alignItems: "center" }}>
                      <input type="checkbox" checked={s.checkup.mask} onChange={(e) => setCheckup(i, { mask: e.target.checked })} />
                      first-letter mask
                    </label>
                  )}
                  {s.checkup.checkupKind === "translations" && (
                    <select value={s.checkup.direction} onChange={(e) => setCheckup(i, { direction: e.target.value as CheckupConfig["direction"] })}
                      style={{ ...input, width: "auto", padding: "5px 8px", fontSize: 13 }}>
                      <option value="mixed">De↔En gemischt</option>
                      <option value="deToEn">nur De→En</option>
                      <option value="enToDe">nur En→De</option>
                    </select>
                  )}
                </>
              )}
              <button type="button" onClick={() => removeSection(i)} style={{ background: "none", border: "none", color: "var(--incorrect)", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Remove</button>
            </div>
          </div>
          <ItemPicker units={catalog} kind={s.kind} selected={s.itemIds} onToggle={(id) => toggleItem(i, id)} loading={loadingCat} />
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        {mode === "checkup" ? (
          (Object.keys(CHECKUP_KIND_LABEL) as CheckupKind[]).map((k) => (
            <button key={k} type="button" className="dg-btn-secondary" onClick={() => addCheckupSection(k)}>+ {CHECKUP_KIND_LABEL[k]}</button>
          ))
        ) : (
          <>
            <button type="button" className="dg-btn-secondary" onClick={() => addSection("vocab")}>+ Vocabulary section</button>
            <button type="button" className="dg-btn-secondary" onClick={() => addSection("grammar")}>+ Grammar section</button>
          </>
        )}
      </div>

      {/* preview + save */}
      <div style={{ ...card, marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button type="button" className="dg-chip" onClick={() => setPreview((p) => !p)} aria-expanded={preview}>
            {preview ? "Hide preview" : "👁 Preview as student"}
          </button>
          <button type="button" className="dg-btn" disabled={saving || issues.length > 0} onClick={save} style={{ opacity: issues.length > 0 ? 0.5 : 1 }}>
            {saving ? "Saving…" : "Save assignment"}
          </button>
        </div>

        {issues.length > 0 && (
          <ul style={{ marginTop: 12, paddingLeft: 18, color: "var(--incorrect)", fontSize: 13 }}>
            {issues.map((e, k) => <li key={k}>{e}</li>)}
          </ul>
        )}
        {serverErrors.length > 0 && (
          <ul style={{ marginTop: 12, paddingLeft: 18, color: "var(--incorrect)", fontSize: 13 }}>
            {serverErrors.map((e, k) => <li key={k}>{e}</li>)}
          </ul>
        )}

        {preview && (
          <div style={{ marginTop: 14, borderTop: "1px solid var(--card-border)", paddingTop: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{title || "Untitled"}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
              {mode === "mock_test" ? "Mock test" : mode === "checkup" ? `Check-up · ___/${CHECKUP_TOTAL}` : "Practice"}{durationMin ? ` · ${durationMin} min` : ""} · {sections.reduce((n, s) => n + s.itemIds.length, 0)} tasks
            </div>
            {sections.map((s, i) => (
              <div key={i} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>
                  {s.checkup ? CHECKUP_KIND_LABEL[s.checkup.checkupKind] : s.kind === "vocab" ? "Vokabel" : "Grammatik"}
                  {mode === "mock_test" ? ` · ${s.weightPct}%` : ""}
                  {mode === "checkup" && s.checkup ? ` · ___/${s.checkup.points}` : ""}
                </div>
                <ol style={{ margin: "4px 0 0", paddingLeft: 20, color: "var(--text)", fontSize: 14 }}>
                  {s.itemIds.map((id) => <li key={id}>{labelOf.get(id) ?? id}</li>)}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ItemPicker({ units, kind, selected, onToggle, loading }: {
  units: CatalogUnit[]; kind: Kind; selected: string[]; onToggle: (id: string) => void; loading: boolean;
}) {
  const [filter, setFilter] = useState("");
  const sel = new Set(selected);
  const f = filter.trim().toLowerCase();
  if (loading) return <p style={{ color: "var(--muted)", fontSize: 13 }}>Loading items…</p>;
  const withItems = units
    .map((u) => ({ unitSlug: u.unitSlug, items: (kind === "vocab" ? u.vocab : u.grammar).filter((it) => f === "" || it.label.toLowerCase().includes(f) || it.id.includes(f)) }))
    .filter((u) => u.items.length > 0);
  if (units.length === 0) return <p style={{ color: "var(--muted)", fontSize: 13 }}>Pick a class to load its items.</p>;

  return (
    <div>
      <input placeholder="Filter items…" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...input, marginBottom: 8 }} />
      <div style={{ maxHeight: 260, overflowY: "auto", border: "1px solid var(--card-border)", borderRadius: 10, padding: "4px 0" }}>
        {withItems.map((u) => (
          <div key={u.unitSlug}>
            <div style={{ position: "sticky", top: 0, background: "var(--bg-sunken)", padding: "5px 12px", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-label)", textTransform: "uppercase", color: "var(--muted)" }}>{u.unitSlug}</div>
            {u.items.map((it) => (
              <label key={it.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 12px", cursor: "pointer", fontSize: 14, background: sel.has(it.id) ? "var(--accent-soft)" : "transparent" }}>
                <input type="checkbox" checked={sel.has(it.id)} onChange={() => onToggle(it.id)} />
                <span style={{ flex: 1 }}>{it.label}</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>L{it.difficulty} · {it.format}</span>
              </label>
            ))}
          </div>
        ))}
        {withItems.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, padding: "8px 12px" }}>No items match “{filter}”.</p>}
      </div>
    </div>
  );
}
