"use client";
/**
 * The teacher's class manager (P-1b). Pure client state over a server-fetched
 * list: create a class, rename it, or archive it, each calling /api/admin/classes
 * then router.refresh() so the server re-reads the authoritative list (the roster
 * counts + any minted invite code come back from the server, never guessed here).
 * The API re-validates authoritatively — the inline checks are only live feedback.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";

interface ClassSummary {
  id: string;
  name: string;
  inviteCode: string;
  grade: number;
  studentCount: number;
  createdAt: string | Date;
}

const card: CSSProperties = { border: "1px solid var(--card-border)", borderRadius: 16, padding: 16, background: "var(--card)", boxShadow: "var(--shadow-card)", marginTop: 14 };
const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 4 };
const input: CSSProperties = { fontFamily: "var(--font-body)", fontSize: 15, padding: "8px 11px", borderRadius: 10, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%" };
const codeStyle: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 22, fontWeight: 800, letterSpacing: "0.16em", color: "var(--ink)" };

const GRADES = [1, 2, 3, 4] as const;

export default function ClassesManager({ initialClasses }: { initialClasses: ClassSummary[] }) {
  const router = useRouter();

  // Create form
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number>(1);
  const [creating, setCreating] = useState(false);
  const [createErrors, setCreateErrors] = useState<string[]>([]);

  // Per-row rename + archive
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const create = async () => {
    setCreating(true);
    setCreateErrors([]);
    try {
      const res = await fetch("/api/admin/classes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, grade }) });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { setName(""); setGrade(1); router.refresh(); return; }
      setCreateErrors(d.errors ?? [d.error ?? "Could not create the class."]);
    } catch {
      setCreateErrors(["Network error — try again."]);
    } finally {
      setCreating(false);
    }
  };

  const startRename = (c: ClassSummary) => { setRowError(null); setEditingId(c.id); setEditName(c.name); };
  const cancelRename = () => { setEditingId(null); setEditName(""); };

  const saveRename = async (id: string) => {
    setSavingId(id);
    setRowError(null);
    try {
      const res = await fetch(`/api/admin/classes/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: editName }) });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { setEditingId(null); setEditName(""); router.refresh(); return; }
      setRowError((d.errors?.[0] as string | undefined) ?? d.error ?? "Could not rename the class.");
    } catch {
      setRowError("Network error — try again.");
    } finally {
      setSavingId(null);
    }
  };

  const archive = async (c: ClassSummary) => {
    if (!window.confirm(`Archive “${c.name}”? Students can no longer join with code ${c.inviteCode}. Existing work is kept.`)) return;
    setSavingId(c.id);
    setRowError(null);
    try {
      const res = await fetch(`/api/admin/classes/${c.id}`, { method: "DELETE" });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { router.refresh(); return; }
      setRowError("Could not archive the class — try again.");
    } catch {
      setRowError("Network error — try again.");
    } finally {
      setSavingId(null);
    }
  };

  const copyCode = async (c: ClassSummary) => {
    try {
      await navigator.clipboard?.writeText(c.inviteCode);
      setCopiedId(c.id);
      setTimeout(() => setCopiedId((id) => (id === c.id ? null : id)), 1500);
    } catch {
      /* clipboard blocked — the code is right there to read/type */
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Classes</h1>
        <Link href="/admin" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Teacher home</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Create a class, then share its invite code — students type it to join. Rename or archive a class any time.
      </p>

      {/* create */}
      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "end" }}>
          <div>
            <label style={label}>Class name</label>
            <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 2A Englisch" maxLength={80} />
          </div>
          <div>
            <label style={label}>Grade</label>
            <div style={{ display: "flex", gap: 6 }}>
              {GRADES.map((g) => (
                <button key={g} type="button" onClick={() => setGrade(g)}
                  style={{ ...input, width: 44, textAlign: "center", cursor: "pointer", fontWeight: 700, background: grade === g ? "var(--accent)" : "var(--bg-sunken)", color: grade === g ? "#fff" : "var(--text-secondary)", border: grade === g ? "none" : "1px solid var(--card-border)" }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <button type="button" className="dg-btn" disabled={creating || name.trim() === ""} onClick={create} style={{ opacity: name.trim() === "" ? 0.5 : 1 }}>
            {creating ? "Creating…" : "Create class"}
          </button>
        </div>
        {createErrors.length > 0 && (
          <ul style={{ marginTop: 12, paddingLeft: 18, color: "var(--incorrect)", fontSize: 13 }}>
            {createErrors.map((e, k) => <li key={k}>{e}</li>)}
          </ul>
        )}
      </div>

      {/* list */}
      {initialClasses.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>No classes yet. Create your first one above.</p>
      ) : (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {initialClasses.map((c) => (
            <div key={c.id} className="dg-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === c.id ? (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <input style={{ ...input, maxWidth: 300 }} value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={80} autoFocus />
                      <button type="button" className="dg-btn" disabled={savingId === c.id || editName.trim() === ""} onClick={() => saveRename(c.id)} style={{ padding: "0.5rem 1rem" }}>
                        {savingId === c.id ? "Saving…" : "Save"}
                      </button>
                      <button type="button" className="dg-btn-secondary" onClick={cancelRename} style={{ padding: "0.5rem 1rem" }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ fontWeight: 700, fontSize: 17, color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                      {c.name} <span style={{ fontWeight: 400, fontSize: 13, color: "var(--muted)" }}>· Grade {c.grade}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                    {c.studentCount === 0 ? "No students yet" : `${c.studentCount} ${c.studentCount === 1 ? "student" : "students"}`}
                    {" · created "}{new Date(c.createdAt).toLocaleDateString("de-AT")}
                  </div>
                </div>
                {editingId !== c.id && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                    <Link href={`/admin/classes/${c.id}/roster`} style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700 }}>Roster</Link>
                    <button type="button" onClick={() => startRename(c)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Rename</button>
                    <button type="button" disabled={savingId === c.id} onClick={() => archive(c)} style={{ background: "none", border: "none", color: "var(--incorrect)", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Archive</button>
                  </div>
                )}
              </div>

              {/* invite code — prominent; students type it to join */}
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, background: "var(--bg-sunken)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 14px" }}>
                <div>
                  <div style={label}>Invite code</div>
                  <div style={codeStyle}>{c.inviteCode}</div>
                </div>
                <button type="button" className="dg-chip" onClick={() => copyCode(c)} style={{ marginLeft: "auto" }}>
                  {copiedId === c.id ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rowError && (
        <p style={{ marginTop: 12, color: "var(--incorrect)", fontSize: 13 }}>{rowError}</p>
      )}
    </main>
  );
}
