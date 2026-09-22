"use client";
/**
 * The teacher's roster (P-2). Server-fetched list + pure client state: per row
 * correct the name or remove the student — each calling /api/admin/… then
 * router.refresh() so the server re-reads the authoritative roster.
 *
 * dach-108 · class lists are kept at Lauter Einser: where the import box stood,
 * one fixed sentence and the link to the Lehrer-Raum stand now, and the join link
 * points straight at the join page there. "Reset PIN" is gone with the PIN sign-in
 * (Koki 19.09.). Styling mirrors ClassesManager (same card/label/input tokens).
 *
 * dach-123 · K6-Go. The table is no longer DomiGo's own roster alone: the server
 * merges it with the school's class list, fetched from Lauter Einser AT DISPLAY
 * TIME and stored nowhere. Two data views of one class side by side would let the
 * two disagree, so there is exactly ONE prop of rows and every number is counted
 * out of it. The list name (`kontoName`) is display only: it never seeds the
 * rename field, never enters a request body, never touches browser storage — one
 * click on Save would otherwise write a school-list name into DomiGo for good.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState, type CSSProperties } from "react";

/** A row with an account in DomiGo — the two arts that carry a nickname and buttons. */
interface EigeneZeile {
  id: string;
  givenName: string | null;
  displayName: string;
  claimed: boolean;
}

/**
 * The merged row, repeated structurally (this file imports no app types, as it
 * always has — typecheck catches any drift at the prop boundary). `not-joined`
 * and `joined-elsewhere` carry no id, no nickname and no buttons BY TYPE — not
 * by an `if` in the markup that someone can forget.
 */
export type Listenzeile =
  | (EigeneZeile & { art: "joined"; kontoName: string; platz: number | null })
  | { art: "not-joined"; kontoName: string; platz: number | null; status: "offen" | "name_gewaehlt" }
  | { art: "joined-elsewhere"; kontoName: string; platz: number | null }
  | (EigeneZeile & { art: "local-only"; kontoName: null });

/** What the server could learn about the class list this time round. */
export type Zustand = "liste" | "gesperrt" | "unreachable" | "refused" | "keine-liste";

// Sentences as constants: a quotation mark inside a JSX attribute breaks the
// parser, and a sentence a gate quotes should live in exactly one place.
const S_UNREACHABLE =
  "The class list from Lauter Einser could not be loaded just now. Below are only the accounts that already exist in DomiGo. Reload the page to try again.";
const S_REFUSED =
  "Lauter Einser did not release this class list to your account. Below are only the accounts that already exist in DomiGo.";
const S_GESPERRT =
  " children are on the class list at Lauter Einser. The school has not released their names to teachers yet, so they are not shown here.";
const S_TRENNER = "Only in DomiGo — not linked to the Lauter Einser class list";
const S_TRENNER_KLEIN =
  "If a name appears both here and above, the entry here dates from before Lauter Einser and is not linked to the list.";
const S_LEER = "No students yet. Class lists are kept at Lauter Einser; share the join link below.";
const S_LEER_TABELLE = "No students on the roster yet.";
const S_NOCH_NICHT = "Not joined yet";
const S_DORT_ANGEMELDET = "Signed up at Lauter Einser — not in DomiGo yet";
const S_ANDERE_KLASSE = "In DomiGo, but not in this class";

const card: CSSProperties = { border: "1px solid var(--card-border)", borderRadius: 16, padding: 16, background: "var(--card)", boxShadow: "var(--shadow-card)", marginTop: 14 };
const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 4 };
const input: CSSProperties = { fontFamily: "var(--font-body)", fontSize: 15, padding: "8px 11px", borderRadius: 10, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%" };
const codeStyle: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 22, fontWeight: 800, letterSpacing: "0.16em", color: "var(--ink)" };
const th: CSSProperties = { padding: "7px 8px", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 12, color: "var(--muted)", textAlign: "left" };
const td: CSSProperties = { padding: "8px", borderTop: "1px solid var(--card-border)", fontSize: 14, verticalAlign: "middle" };

/** The quiet notice above the table — the house recipe (sunken, thin border, 13px). */
const hinweis: CSSProperties = { border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text-secondary)", fontSize: 13, padding: "9px 13px", borderRadius: 12, marginTop: 14 };

const grauFett: CSSProperties = { color: "var(--muted)", fontWeight: 700 };

function hatKonto(z: Listenzeile): z is Listenzeile & EigeneZeile {
  return z.art === "joined" || z.art === "local-only";
}

/** What the Name column shows. The list name wins where there is one — display only. */
function nameVon(z: Listenzeile): string {
  if (z.art === "joined") return z.kontoName || z.givenName || z.displayName;
  if (z.art === "local-only") return z.givenName ?? z.displayName;
  return z.kontoName;
}

export default function RosterManager({
  classId,
  className,
  grade,
  inviteCode,
  archived,
  joinUrl,
  lehrerraumUrl,
  satz,
  rows,
  joinedCount,
  listCount,
  lockedCount,
  zustand,
}: {
  classId: string;
  className: string;
  grade: number;
  inviteCode: string;
  archived: boolean;
  /** The join page at konto for this class code. Resolved on the server. */
  joinUrl: string;
  /** Where class lists are kept now. Resolved on the server. */
  lehrerraumUrl: string;
  /** The one sentence every class/roster writer answers with (GESCHLOSSEN_SATZ). */
  satz: string;
  /** DomiGo's own rows merged with the school's class list — the ONE view. */
  rows: Listenzeile[];
  joinedCount: number;
  listCount: number;
  /** How many children the list names while the school withholds the names. */
  lockedCount: number;
  zustand: Zustand;
}) {
  const router = useRouter();

  // Per-row edit + busy state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const eigene = rows.filter(hatKonto);
  const claimedCount = eigene.filter((s) => s.claimed).length;
  const nurDomiGo = rows.filter((z) => z.art === "local-only").length;
  // The divider goes above the FIRST local-only row, and only when there is a
  // list for it to be distinguished from.
  const trennerBei = listCount > 0 && nurDomiGo > 0 ? rows.findIndex((z) => z.art === "local-only") : -1;

  const startRename = (s: EigeneZeile) => { setRowError(null); setEditingId(s.id); setEditName(s.givenName ?? s.displayName); };
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

  const remove = async (s: EigeneZeile) => {
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
    try {
      await navigator.clipboard?.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the code + link are shown to read/type */
    }
  };

  // Exactly ONE header line. With a list it counts the list; in every other
  // state it is today's sentence with today's numbers, counted out of the rows.
  const kopfzeile =
    rows.length === 0
      ? S_LEER
      : zustand === "liste"
        ? `${joinedCount} of ${listCount} on the class list have joined.${nurDomiGo > 0 ? ` ${nurDomiGo} more only in DomiGo.` : ""}`
        : `${eigene.length} on the roster · ${claimedCount} claimed · ${eigene.length - claimedCount} still to join.`;

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
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>{kopfzeile}</p>
      {archived && (
        <p style={{ background: "var(--bg-sunken)", border: "1px solid var(--card-border)", color: "var(--muted)", padding: "9px 13px", borderRadius: 12, fontSize: 13 }}>
          This class is archived — students can no longer join or sign in. It is brought back in the Lehrerzimmer at Lauter Einser.
        </p>
      )}

      {/* share the join link */}
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={label}>Invite code</div>
          <div style={codeStyle}>{inviteCode}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={label}>Join link (at Lauter Einser)</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, color: "var(--text-secondary)", wordBreak: "break-all" }}>{joinUrl}</div>
        </div>
        <button type="button" className="dg-chip" onClick={copyJoinLink}>{copied ? "Copied ✓" : "Copy join link"}</button>
      </div>

      {/* dach-108 · class lists are kept at Lauter Einser — the sentence stands where the import box stood */}
      <div style={card}>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
          {satz}{" "}
          <a href={lehrerraumUrl} style={{ color: "var(--accent)", fontWeight: 600 }}>Zum Lehrerzimmer →</a>
        </p>
      </div>

      {/* dach-123 · why the list below may be incomplete. `keine-liste` says nothing:
          a class the roof does not know has no list that could be missing. */}
      {zustand === "unreachable" && <p style={hinweis}>{S_UNREACHABLE}</p>}
      {zustand === "refused" && <p style={hinweis}>{S_REFUSED}</p>}
      {zustand === "gesperrt" && <p style={hinweis}>{lockedCount}{S_GESPERRT}</p>}

      {/* roster table */}
      {rows.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>{S_LEER_TABELLE}</p>
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
              {rows.map((s, i) => (
                <Fragment key={hatKonto(s) ? s.id : `liste-${i}`}>
                  {i === trennerBei && (
                    <tr>
                      <td style={{ ...td, paddingTop: 18 }} colSpan={4}>
                        <div style={{ fontFamily: "var(--font-label)", fontWeight: 700, fontSize: 12, letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--muted)" }}>{S_TRENNER}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 400, marginTop: 3 }}>{S_TRENNER_KLEIN}</div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ ...td, fontWeight: 700, color: "var(--ink)" }}>
                      {hatKonto(s) && editingId === s.id ? (
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                          <input style={{ ...input, maxWidth: 200 }} value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={80} autoFocus />
                          <button type="button" className="dg-btn" disabled={busyId === s.id || editName.trim() === ""} onClick={() => saveRename(s.id)} style={{ padding: "0.4rem 0.8rem" }}>
                            {busyId === s.id ? "Saving…" : "Save"}
                          </button>
                          <button type="button" className="dg-btn-secondary" onClick={cancelRename} style={{ padding: "0.4rem 0.8rem" }}>Cancel</button>
                        </div>
                      ) : (
                        nameVon(s)
                      )}
                    </td>
                    <td style={{ ...td, color: hatKonto(s) && s.claimed ? "var(--text)" : "var(--muted)" }}>
                      {!hatKonto(s) ? (
                        <span style={{ color: "var(--muted)" }}>—</span>
                      ) : s.claimed ? (
                        s.displayName
                      ) : (
                        <span style={{ fontStyle: "italic" }}>— not yet claimed —</span>
                      )}
                    </td>
                    <td style={td}>
                      {s.art === "not-joined" ? (
                        <span style={grauFett}>{s.status === "name_gewaehlt" ? S_DORT_ANGEMELDET : S_NOCH_NICHT}</span>
                      ) : s.art === "joined-elsewhere" ? (
                        <span style={grauFett}>{S_ANDERE_KLASSE}</span>
                      ) : s.claimed ? (
                        <span style={{ color: "var(--correct)", fontWeight: 700 }}>Claimed ✓</span>
                      ) : (
                        <span style={grauFett}>Pending</span>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                      {hatKonto(s) && editingId !== s.id && (
                        <span style={{ display: "inline-flex", gap: 12 }}>
                          <button type="button" onClick={() => startRename(s)} style={actionBtn("var(--accent)")}>Rename</button>
                          <button type="button" disabled={busyId === s.id} onClick={() => remove(s)} style={actionBtn("var(--incorrect)")}>Remove</button>
                        </span>
                      )}
                    </td>
                  </tr>
                </Fragment>
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
