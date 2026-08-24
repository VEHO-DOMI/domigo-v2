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
import { useMemo, useRef, useState, type CSSProperties } from "react";
import {
  MAX_ROSTER_FILE_BYTES,
  MAX_ROSTER_NAMES,
  MAX_STUDENT_NAME_LENGTH,
  isImportableName,
  previewRoster,
} from "@/lib/roster-parse";

interface RosterEntry {
  id: string;
  givenName: string | null;
  displayName: string;
  claimed: boolean;
}

/** One row of the review list: the name as it will be created, and whether to keep it. */
interface ReviewRow {
  name: string;
  keep: boolean;
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

  // Import box · TWO STAGES. Stage 1 collects raw text (typed, pasted, or read out of
  // a file); stage 2 is the REVIEW LIST — the teacher sees every name that is about to
  // become a child's account and can fix or drop it BEFORE anything is created. Both
  // entry paths land in the same stage 2 on purpose: one confirmation step, not two.
  const [paste, setPaste] = useState("");
  const [review, setReview] = useState<ReviewRow[] | null>(null);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [importErr, setImportErr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewNames = useMemo(() => previewRoster(paste), [paste]);

  /**
   * What the review list currently says, name by name. `dupeOf` marks a row whose name
   * repeats one ABOVE it (case-insensitively) among the kept rows — the same rule the
   * server dedupes by, shown before the fact instead of silently applied after it.
   */
  const reviewState = useMemo(() => {
    const rows = review ?? [];
    const seen = new Set<string>();
    const flags = rows.map((r) => {
      const name = r.name.trim();
      if (!r.keep) return { empty: false, dupe: false };
      if (name === "") return { empty: true, dupe: false };
      if (!isImportableName(name)) return { empty: false, dupe: false, tooLong: true };
      const key = name.toLowerCase();
      const dupe = seen.has(key);
      seen.add(key);
      return { empty: false, dupe, tooLong: false };
    });
    // A row the SERVER would refuse is a row the button must not count. The endpoint
    // answers 400 for an over-long name; showing it here instead means the teacher
    // shortens one line rather than meeting a bare error after pressing the button.
    const willCreate = rows.filter((r, i) => r.keep && !flags[i]!.empty && !flags[i]!.dupe && !flags[i]!.tooLong).length;
    return { flags, willCreate };
  }, [review]);

  /** Enter the review stage with one row per parsed name (all kept by default). */
  const startReview = (text: string, label: string | null) => {
    const names = previewRoster(text);
    setImportMsg(null);
    setImportErr(null);
    if (names.length === 0) {
      setImportErr(label ? `No names found in ${label}.` : "Paste at least one name.");
      return;
    }
    // The endpoint refuses more than MAX_ROSTER_NAMES in one go. Saying so HERE, with
    // the number actually found, beats a 400 after the press — and a list this long is
    // almost always the wrong file rather than a very large class.
    if (names.length > MAX_ROSTER_NAMES) {
      setImportErr(`That is ${names.length} names — more than one class list (limit ${MAX_ROSTER_NAMES}). Check whether this is the right file, or import it in parts.`);
      return;
    }
    setSourceLabel(label);
    setReview(names.map((name) => ({ name, keep: true })));
  };

  /**
   * Read a chosen .csv/.txt file IN THE BROWSER (File.text()) and go to the review
   * list. The file never leaves the machine and is never written to disk — it is read
   * into memory, parsed, and dropped. No upload endpoint, no parsing dependency.
   */
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setImportMsg(null);
    setImportErr(null);
    // The size gate comes BEFORE the read, on purpose: File.text() pulls the whole
    // file into memory, and a wrongly picked video would be read in full before
    // anyone noticed it holds no names.
    if (file.size > MAX_ROSTER_FILE_BYTES) {
      setImportErr(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — a class list is a few kilobytes. Pick the exported CSV, not the whole workbook.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    try {
      const text = await file.text();
      startReview(text, file.name);
    } catch {
      setImportErr("Could not read that file — try saving it again as CSV.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""; // allow re-picking the same file
    }
  };

  const cancelReview = () => { setReview(null); setSourceLabel(null); };

  // Per-row edit + busy state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const claimedCount = initialRoster.filter((s) => s.claimed).length;

  /**
   * Create the REVIEWED names. Sends the confirmed list through the endpoint's
   * existing `names[]` seam rather than the raw text, so what the teacher approved is
   * literally what is sent; the server still parses and dedupes authoritatively.
   */
  const doImport = async () => {
    const names = (review ?? []).filter((r) => r.keep).map((r) => r.name.trim()).filter((n) => n !== "");
    if (names.length === 0) return;
    setImporting(true);
    setImportMsg(null);
    setImportErr(null);
    try {
      const res = await fetch(`/api/admin/classes/${classId}/roster`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ names }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        const n = d.imported as number;
        setImportMsg(n === 0 ? "No new names to add (all were already on the roster)." : `Added ${n} ${n === 1 ? "student" : "students"}.`);
        setPaste("");
        setReview(null);
        setSourceLabel(null);
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
        <span style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          <Link href={`/admin/classes/${classId}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Fortschritt</Link>
          <Link href="/admin/classes" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Classes</Link>
        </span>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {initialRoster.length === 0
          ? "Paste your class list below, then share the join link so students can claim their name."
          : `${initialRoster.length} on the roster · ${claimedCount} claimed · ${initialRoster.length - claimedCount} still to join.`}
      </p>
      {archived && (
        <p style={{ background: "var(--bg-sunken)", border: "1px solid var(--card-border)", color: "var(--muted)", padding: "9px 13px", borderRadius: 12, fontSize: 13 }}>
          This class is archived — students can no longer join or sign in. You can bring it back: Classes → »Archivierte Klassen« → »Wieder aktivieren«.
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

      {/* import · stage 1 — choose a file or paste; stage 2 — check every name */}
      <div style={card}>
        {review === null ? (
          <>
            <label style={label}>Add students — from a file, or one name per line</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                onChange={(e) => void onFile(e.target.files?.[0])}
                style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: "100%" }}
              />
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
              CSV or plain text, one student per line — extra columns are ignored. Excel: File → Save As → CSV.
              Word: select the list, copy, and paste it below instead. Up to {MAX_ROSTER_NAMES} names per import.
            </p>
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              rows={5}
              placeholder={"Anna Müller\nBen Ostrowski\nClara Nowak"}
              style={{ ...input, resize: "vertical", fontFamily: "var(--font-body)" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
              <button type="button" className="dg-btn" disabled={previewNames.length === 0} onClick={() => startReview(paste, null)} style={{ opacity: previewNames.length === 0 ? 0.5 : 1 }}>
                {previewNames.length > 0 ? `Check ${previewNames.length} ${previewNames.length === 1 ? "name" : "names"}` : "Check names"}
              </button>
              {previewNames.length > 0 && <span style={{ fontSize: 13, color: "var(--muted)" }}>You confirm the list before anything is created.</span>}
            </div>
          </>
        ) : (
          <>
            <label style={label}>
              Check the list{sourceLabel ? ` — from ${sourceLabel}` : ""}
            </label>
            <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
              Each line becomes one student. Correct a name, or untick anyone who should not be added.
              Nothing is created until you press the button below.
            </p>
            <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid var(--card-border)", borderRadius: 12 }}>
              {review.map((row, i) => {
                const flag = reviewState.flags[i]!;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderTop: i === 0 ? "none" : "1px solid var(--card-border)" }}>
                    <input
                      type="checkbox"
                      checked={row.keep}
                      aria-label={`Add ${row.name || "this line"}`}
                      onChange={(e) => setReview((rs) => (rs ?? []).map((r, k) => (k === i ? { ...r, keep: e.target.checked } : r)))}
                    />
                    <input
                      value={row.name}
                      maxLength={MAX_STUDENT_NAME_LENGTH}
                      onChange={(e) => setReview((rs) => (rs ?? []).map((r, k) => (k === i ? { ...r, name: e.target.value } : r)))}
                      style={{ ...input, flex: 1, opacity: row.keep ? 1 : 0.45, textDecoration: row.keep ? "none" : "line-through" }}
                    />
                    {flag.dupe && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--partial)", whiteSpace: "nowrap" }}>duplicate</span>}
                    {flag.empty && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--incorrect)", whiteSpace: "nowrap" }}>empty</span>}
                    {flag.tooLong && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--incorrect)", whiteSpace: "nowrap" }}>too long</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              <button type="button" className="dg-btn" disabled={importing || reviewState.willCreate === 0} onClick={doImport} style={{ opacity: reviewState.willCreate === 0 ? 0.5 : 1 }}>
                {importing ? "Adding…" : `Add ${reviewState.willCreate} ${reviewState.willCreate === 1 ? "student" : "students"}`}
              </button>
              <button type="button" className="dg-btn-secondary" disabled={importing} onClick={cancelReview}>Back</button>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Duplicates, blanks and unticked lines are skipped.</span>
            </div>
          </>
        )}
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
