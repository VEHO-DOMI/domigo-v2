"use client";
/**
 * The teacher's roster manager (P-2). Server-fetched list + pure client state:
 * paste-import a class list, then per row correct the name, reset the PIN, or remove
 * the student — each calling /api/admin/… then router.refresh() so the server re-reads
 * the authoritative roster. The API re-validates + authorizes; the inline checks are
 * only live feedback. Styling mirrors ClassesManager (same card/label/input tokens).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type CSSProperties } from "react";

interface RosterEntry {
  id: string;
  givenName: string | null;
  displayName: string;
  claimed: boolean;
}

/**
 * Client-side preview of how many names a paste will import. Mirrors the server's
 * parseRoster (trim, strip a CSV trailing comma + surrounding quotes, drop blanks,
 * dedupe case-insensitively) so the button count matches what the server inserts —
 * duplicated on purpose because @domigo/db is server-only and must not enter the
 * client bundle. The server re-parses authoritatively; this is only live feedback.
 */
function previewRoster(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    let s = raw.trim();
    if (s.endsWith(",")) s = s.slice(0, -1).trim();
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).trim();
    if (s === "") continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

const card: CSSProperties = { border: "1px solid var(--card-border)", borderRadius: 16, padding: 16, background: "var(--card)", boxShadow: "var(--shadow-card)", marginTop: 14 };
const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 4 };
const input: CSSProperties = { fontFamily: "var(--font-body)", fontSize: 15, padding: "8px 11px", borderRadius: 10, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%" };
const codeStyle: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 22, fontWeight: 800, letterSpacing: "0.16em", color: "var(--ink)" };
const th: CSSProperties = { padding: "7px 8px", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 12, color: "var(--muted)", textAlign: "left" };
const td: CSSProperties = { padding: "8px", borderTop: "1px solid var(--card-border)", fontSize: 14, verticalAlign: "middle" };

export default function RosterManager({
  classId,
  className,
  grade,
  inviteCode,
  archived,
  joinPath,
  initialRoster,
}: {
  classId: string;
  className: string;
  grade: number;
  inviteCode: string;
  archived: boolean;
  joinPath: string;
  initialRoster: RosterEntry[];
}) {
  const router = useRouter();

  // Import box
  const [paste, setPaste] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [importErr, setImportErr] = useState<string | null>(null);
  const previewNames = useMemo(() => previewRoster(paste), [paste]);

  // Per-row edit + busy state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const claimedCount = initialRoster.filter((s) => s.claimed).length;

  const doImport = async () => {
    setImporting(true);
    setImportMsg(null);
    setImportErr(null);
    try {
      const res = await fetch(`/api/admin/classes/${classId}/roster`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: paste }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        const n = d.imported as number;
        setImportMsg(n === 0 ? "No new names to add (all were already on the roster)." : `Added ${n} ${n === 1 ? "student" : "students"}.`);
        setPaste("");
        router.refresh();
        return;
      }
      setImportErr(d.error === "no_names" ? "Paste at least one name." : "Could not import the roster. Try again.");
    } catch {
      setImportErr("Network error — try again.");
    } finally {
      setImporting(false);
    }
  };

  const startRename = (s: RosterEntry) => { setRowError(null); setEditingId(s.id); setEditName(s.givenName ?? s.displayName); };
  const cancelRename = () => { setEditingId(null); setEditName(""); };

  const saveRename = async (id: string) => {
    setBusyId(id);
    setRowError(null);
    try {
      const res = await fetch(`/api/admin/roster/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ givenName: editName }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { setEditingId(null); setEditName(""); router.refresh(); return; }
      setRowError((d.errors?.[0] as string | undefined) ?? "Could not rename the student.");
    } catch {
      setRowError("Network error — try again.");
    } finally {
      setBusyId(null);
    }
  };

  const resetPin = async (s: RosterEntry) => {
    const who = s.givenName ?? s.displayName;
    if (!window.confirm(`Reset the PIN for ${who}? They will pick a new nickname and PIN next time they open the join link.`)) return;
    setBusyId(s.id);
    setRowError(null);
    try {
      const res = await fetch(`/api/admin/roster/${s.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "reset_pin" }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { router.refresh(); return; }
      setRowError("Could not reset the PIN — try again.");
    } catch {
      setRowError("Network error — try again.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (s: RosterEntry) => {
    const who = s.givenName ?? s.displayName;
    if (!window.confirm(`Remove ${who} from the roster? This cannot be undone.`)) return;
    setBusyId(s.id);
    setRowError(null);
    try {
      const res = await fetch(`/api/admin/roster/${s.id}`, { method: "DELETE" });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { router.refresh(); return; }
      setRowError("Could not remove the student — try again.");
    } catch {
      setRowError("Network error — try again.");
    } finally {
      setBusyId(null);
    }
  };

  const copyJoinLink = async () => {
    const url = typeof window !== "undefined" ? window.location.origin + joinPath : joinPath;
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the code + link are shown to read/type */
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {className} <span style={{ fontWeight: 400, fontSize: 15, color: "var(--muted)" }}>· Grade {grade} · roster</span>
        </h1>
        <Link href="/admin/classes" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Classes</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {initialRoster.length === 0
          ? "Paste your class list below, then share the join link so students can claim their name."
          : `${initialRoster.length} on the roster · ${claimedCount} claimed · ${initialRoster.length - claimedCount} still to join.`}
      </p>
      {archived && (
        <p style={{ background: "var(--bg-sunken)", border: "1px solid var(--card-border)", color: "var(--muted)", padding: "9px 13px", borderRadius: 12, fontSize: 13 }}>
          This class is archived — students can no longer join. Un-archive it from Classes to reopen joining.
        </p>
      )}

      {/* share the join link */}
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={label}>Invite code</div>
          <div style={codeStyle}>{inviteCode}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={label}>Join link (students claim their name here)</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, color: "var(--text-secondary)", wordBreak: "break-all" }}>{joinPath}</div>
        </div>
        <button type="button" className="dg-chip" onClick={copyJoinLink}>{copied ? "Copied ✓" : "Copy join link"}</button>
      </div>

      {/* paste-import */}
      <div style={card}>
        <label style={label}>Add students — one name per line</label>
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={5}
          placeholder={"Anna Müller\nBen Ostrowski\nClara Nowak"}
          style={{ ...input, resize: "vertical", fontFamily: "var(--font-body)" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <button type="button" className="dg-btn" disabled={importing || previewNames.length === 0} onClick={doImport} style={{ opacity: previewNames.length === 0 ? 0.5 : 1 }}>
            {importing ? "Importing…" : previewNames.length > 0 ? `Import ${previewNames.length} ${previewNames.length === 1 ? "name" : "names"}` : "Import"}
          </button>
          {previewNames.length > 0 && <span style={{ fontSize: 13, color: "var(--muted)" }}>Duplicates and blank lines are skipped.</span>}
        </div>
        {importMsg && <p style={{ marginTop: 10, color: "var(--correct)", fontSize: 13, fontWeight: 600 }}>{importMsg}</p>}
        {importErr && <p style={{ marginTop: 10, color: "var(--incorrect)", fontSize: 13, fontWeight: 600 }}>{importErr}</p>}
      </div>

      {/* roster table */}
      {initialRoster.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>No students on the roster yet. Paste a list above to get started.</p>
      ) : (
        <div style={{ ...card, overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Nickname</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialRoster.map((s) => (
                <tr key={s.id}>
                  <td style={{ ...td, fontWeight: 700, color: "var(--ink)" }}>
                    {editingId === s.id ? (
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <input style={{ ...input, maxWidth: 200 }} value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={80} autoFocus />
                        <button type="button" className="dg-btn" disabled={busyId === s.id || editName.trim() === ""} onClick={() => saveRename(s.id)} style={{ padding: "0.4rem 0.8rem" }}>
                          {busyId === s.id ? "Saving…" : "Save"}
                        </button>
                        <button type="button" className="dg-btn-secondary" onClick={cancelRename} style={{ padding: "0.4rem 0.8rem" }}>Cancel</button>
                      </div>
                    ) : (
                      s.givenName ?? s.displayName
                    )}
                  </td>
                  <td style={{ ...td, color: s.claimed ? "var(--text)" : "var(--muted)" }}>
                    {s.claimed ? s.displayName : <span style={{ fontStyle: "italic" }}>— not yet claimed —</span>}
                  </td>
                  <td style={td}>
                    {s.claimed ? (
                      <span style={{ color: "var(--correct)", fontWeight: 700 }}>Claimed ✓</span>
                    ) : (
                      <span style={{ color: "var(--muted)", fontWeight: 700 }}>Pending</span>
                    )}
                  </td>
                  <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                    {editingId !== s.id && (
                      <span style={{ display: "inline-flex", gap: 12 }}>
                        <button type="button" onClick={() => startRename(s)} style={actionBtn("var(--accent)")}>Rename</button>
                        {s.claimed && (
                          <button type="button" disabled={busyId === s.id} onClick={() => resetPin(s)} style={actionBtn("var(--ink-soft)")}>Reset PIN</button>
                        )}
                        <button type="button" disabled={busyId === s.id} onClick={() => remove(s)} style={actionBtn("var(--incorrect)")}>Remove</button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rowError && <p style={{ marginTop: 12, color: "var(--incorrect)", fontSize: 13 }}>{rowError}</p>}
    </main>
  );
}

function actionBtn(color: string): CSSProperties {
  return { background: "none", border: "none", color, cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 };
}
