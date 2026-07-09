"use client";
/**
 * The mock-test / practice-set composer (M-2). Pure client state; the finished
 * draft POSTs to /api/admin/assignments, which RE-VALIDATES authoritatively
 * (reserved items, weights) — the inline checks here are only for live feedback.
 * Scope: vocab + grammar sections (the auto-graded core); listening/reading/
 * writing land in M-2b.
 */
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

interface ClassRow { id: string; name: string; grade: number }
interface CatalogItem { id: string; label: string; format: string; difficulty: number }
interface CatalogUnit { unitSlug: string; vocab: CatalogItem[]; grammar: CatalogItem[] }

type Kind = "vocab" | "grammar";
interface Section { kind: Kind; itemIds: string[]; weightPct: number }

const AHS = { 1: 90, 2: 80, 3: 65, 4: 50 };

const card: CSSProperties = { border: "1px solid var(--card-border)", borderRadius: 16, padding: 16, background: "var(--card)", boxShadow: "var(--shadow-card)", marginTop: 14 };
const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 4 };
const input: CSSProperties = { fontFamily: "var(--font-body)", fontSize: 15, padding: "8px 11px", borderRadius: 10, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%" };

export default function AssignmentBuilder({ classes }: { classes: ClassRow[] }) {
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"practice" | "mock_test">("mock_test");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [dueAt, setDueAt] = useState("");
  const [attemptsPerTest, setAttempts] = useState(1);
  const [durationMin, setDurationMin] = useState<number | "">("");
  const [ns, setNs] = useState<{ 1: number; 2: number; 3: number; 4: number }>(AHS);
  const [sections, setSections] = useState<Section[]>([]);
  const [catalog, setCatalog] = useState<CatalogUnit[]>([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const grade = classes.find((c) => c.id === classId)?.grade ?? 0;

  useEffect(() => {
    let alive = true;
    // All state writes live inside this async fn (never synchronously in the
    // effect body — that would cascade renders; see the react-hooks lint).
    const load = async () => {
      if (!classId || !grade) { if (alive) setCatalog([]); return; }
      if (alive) setLoadingCat(true);
      try {
        const d = await fetch(`/api/admin/catalog?grade=${grade}&classId=${classId}`).then((r) => r.json());
        if (alive && d.ok) setCatalog(d.units as CatalogUnit[]);
      } catch {
        /* leave catalog empty; the picker shows "pick a class" */
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
  const setSection = (i: number, patch: Partial<Section>) => setSections((prev) => prev.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const addSection = (kind: Kind) => setSections((prev) => [...prev, { kind, itemIds: [], weightPct: 0 }]);
  const removeSection = (i: number) => setSections((prev) => prev.filter((_, k) => k !== i));
  const toggleItem = (i: number, id: string) =>
    setSection(i, { itemIds: sections[i]!.itemIds.includes(id) ? sections[i]!.itemIds.filter((x) => x !== id) : [...sections[i]!.itemIds, id] });

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
    return e;
  }, [title, classId, sections, mode, totalWeight, ns]);

  const save = async () => {
    setSaving(true);
    setServerErrors([]);
    const draft = {
      title, mode, classId, dueAt: dueAt || null,
      attemptsPerTest,
      sessionDurationMinutes: mode === "mock_test" && durationMin !== "" ? Number(durationMin) : null,
      notenSchluessel: mode === "mock_test" && (ns[1] !== AHS[1] || ns[2] !== AHS[2] || ns[3] !== AHS[3] || ns[4] !== AHS[4]) ? ns : null,
      sections: sections.map((s, position) => ({ position, kind: s.kind, itemIds: s.itemIds, weightPct: mode === "mock_test" ? s.weightPct : 0 })),
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
              {(["mock_test", "practice"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  style={{ ...input, width: "auto", flex: 1, cursor: "pointer", fontWeight: 700, background: mode === m ? "var(--accent)" : "var(--bg-sunken)", color: mode === m ? "#fff" : "var(--text-secondary)", border: mode === m ? "none" : "1px solid var(--card-border)" }}>
                  {m === "mock_test" ? "Mock test" : "Practice"}
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
          {mode === "mock_test" && (
            <div>
              <label style={label}>Timer (min, optional)</label>
              <input style={input} type="number" min={1} value={durationMin} onChange={(e) => setDurationMin(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))} placeholder="untimed" />
            </div>
          )}
        </div>

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
      </div>

      {sections.map((s, i) => (
        <div key={i} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              {i + 1}. {s.kind === "vocab" ? "Vocabulary" : "Grammar"} <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 13 }}>· {s.itemIds.length} picked</span>
            </strong>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {mode === "mock_test" && (
                <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 6, alignItems: "center" }}>
                  weight
                  <input type="number" min={0} max={100} value={s.weightPct} onChange={(e) => setSection(i, { weightPct: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                    style={{ ...input, width: 68, padding: "5px 8px" }} />%
                </label>
              )}
              <button type="button" onClick={() => removeSection(i)} style={{ background: "none", border: "none", color: "var(--incorrect)", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Remove</button>
            </div>
          </div>
          <ItemPicker units={catalog} kind={s.kind} selected={s.itemIds} onToggle={(id) => toggleItem(i, id)} loading={loadingCat} />
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button type="button" className="dg-btn-secondary" onClick={() => addSection("vocab")}>+ Vocabulary section</button>
        <button type="button" className="dg-btn-secondary" onClick={() => addSection("grammar")}>+ Grammar section</button>
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
              {mode === "mock_test" ? "Mock test" : "Practice"}{durationMin ? ` · ${durationMin} min` : ""} · {sections.reduce((n, s) => n + s.itemIds.length, 0)} tasks
            </div>
            {sections.map((s, i) => (
              <div key={i} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>
                  {s.kind === "vocab" ? "Vokabel" : "Grammatik"}{mode === "mock_test" ? ` · ${s.weightPct}%` : ""}
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
