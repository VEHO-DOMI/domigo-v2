"use client";
/**
 * K1b · Die Übergangs-PIN für eine ausgesperrte Kollegin.
 *
 * Warum nicht das Schüler-Muster (Hash leeren, neu beitreten): eine Lehrkraft hat
 * keinen Beitritts-Weg zurück — der P2-Einladungs-Link listet nur LEERE Klassen,
 * und ihre hat Kinder darin. Ein geleerter Hash wäre kein Zurücksetzen, sondern
 * ein Aussperren. Also setzt der Großmeister eine PIN, sagt sie ihr, und sie
 * ändert sie danach selbst.
 *
 * Die Tür ist die Route (/api/admin/teacher-pin/reset): Rang server-seitig, Muster
 * server-seitig, und der Anmelde-Name wird dort aus der Datenbank gelesen, nie aus
 * dieser Liste übernommen — was hier steht, ist ein Anzeige-Name.
 */
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";

export interface TeacherRow {
  id: string;
  name: string;
  /** Der Großmeister selbst — für ihn gibt es den Selbstbedienungs-Weg. */
  self: boolean;
}

const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 3 };
const input: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, letterSpacing: "0.12em", padding: "7px 10px", borderRadius: 9, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: 150 };
const linkBtn: CSSProperties = { background: "none", border: "none", padding: 0, color: "var(--accent)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" };
const td: CSSProperties = { padding: "8px", borderTop: "1px solid var(--card-border)", fontSize: 14, verticalAlign: "top" };

export default function TeacherPinReset({ teachers }: { teachers: TeacherRow[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const gueltig = /^[0-9]{4,6}$/.test(pin);

  const setzen = async (t: TeacherRow) => {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/admin/teacher-pin/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ teacherId: t.id, newPin: pin }),
      });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; displayName?: string };
      if (res.ok && d.ok) {
        setMsg(`Neue PIN für ${d.displayName ?? t.name} gesetzt. Sag sie ihr — sie ändert sie danach selbst unter Einstellungen.`);
        setPin("");
        setOpenId(null);
        router.refresh();
        return;
      }
      setErr(
        d.error === "not_grandmaster" ? "Nur der Großmeister darf eine fremde PIN setzen."
        : d.error === "invalid_new_pin" ? "Eine Lehrkraft-PIN sind 4 bis 6 Ziffern."
        : d.error === "teacher_not_found" ? "Diese Lehrkraft steht in keinem der beiden Register — hier wird nichts geraten."
        : "Konnte nicht gesetzt werden — bitte noch einmal.",
      );
    } catch {
      setErr("Netzwerk-Fehler — bitte noch einmal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="dg-card" style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 17, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
        Ausgesperrt? Übergangs-PIN setzen
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
        Für eine Kollegin, die ihre PIN vergessen hat. Du tippst eine neue (4–6 Ziffern), sagst sie ihr, und sie
        ändert sie danach selbst unter Einstellungen. Ihr Konto bleibt dasselbe — Klassen, Namenslisten und
        Aufgaben hängen weiter daran. Aufgeführt ist, wer mindestens eine Klasse im neuen Register besitzt.
      </p>

      {msg && <p style={{ color: "var(--correct)", fontSize: 13.5, fontWeight: 700, margin: "0 0 10px" }}>{msg}</p>}
      {err && <p style={{ color: "var(--incorrect)", fontSize: 13.5, fontWeight: 700, margin: "0 0 10px" }}>{err}</p>}

      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              <td style={{ ...td, fontWeight: 700, color: "var(--ink)" }}>
                {t.name}
                {t.self && <span style={{ fontWeight: 400, color: "var(--muted)" }}> · das bist du</span>}
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                {openId === t.id ? (
                  <div style={{ display: "inline-flex", gap: 10, alignItems: "flex-end" }}>
                    <span>
                      <span style={label}>Neue PIN</span>
                      <input
                        style={input}
                        inputMode="numeric"
                        autoComplete="off"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                        placeholder="4–6 Ziffern"
                      />
                    </span>
                    <button
                      type="button"
                      className="dg-btn"
                      style={{ fontSize: 13, padding: "6px 12px", opacity: gueltig && !busy ? 1 : 0.5 }}
                      disabled={!gueltig || busy}
                      onClick={() => setzen(t)}
                    >
                      {busy ? "…" : "Setzen"}
                    </button>
                    <button type="button" style={{ ...linkBtn, paddingBottom: 6 }} onClick={() => { setOpenId(null); setPin(""); }}>
                      abbrechen
                    </button>
                  </div>
                ) : (
                  <button type="button" style={linkBtn} onClick={() => { setOpenId(t.id); setPin(""); setMsg(null); setErr(null); }}>
                    Übergangs-PIN setzen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
