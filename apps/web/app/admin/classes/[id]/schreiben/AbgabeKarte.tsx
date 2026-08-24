"use client";
/**
 * K6a · Eine Abgabe, mit ihrem Text und ihrer Note.
 *
 * INLINE STATT POPOVER, UND DAS IST EINE ENTSCHEIDUNG, KEIN ZUFALL. Die
 * Anpassungs-Zelle der Fortschritts-Seite (ProgressAdjustCell) muss ihre Tafel an
 * den <body> portieren, weil sie in einer Tabelle mit `overflow-x: auto` sitzt und
 * `.dg-card` ein `backdrop-filter` traegt — ein gefiltertes Element wird zum
 * Bezugsrahmen fuer alles darin, also klebt sogar `position: fixed` am Kasten statt
 * am Fenster. K1b hat das zweimal bezahlt. Dieses Formular steht deshalb INLINE in
 * der aufgeklappten Karte: kein Portal, keine Koordinaten, keine Beschneidung —
 * die Falle stellt sich gar nicht erst.
 *
 * Muster wie RosterManager/ProgressAdjustCell: fetch → router.refresh(), damit die
 * Note aus der Datenbank neu gelesen und nicht im Browser fortgeschrieben wird.
 *
 * ⚠ Der Text des Kindes wird hier ANGEZEIGT und sonst nirgends hingeschrieben —
 * nicht in eine Fehlermeldung, nicht in eine Konsolen-Zeile.
 */
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";

/** Ab wie vielen Zeichen der Text eingeklappt startet. Kurze Antworten stehen sofort da. */
const KURZ_GENUG = 320;

const label: CSSProperties = {
  fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
  textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 3,
};
const input: CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: 14, padding: "6px 9px", borderRadius: 9,
  border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%",
};
const linkBtn: CSSProperties = {
  background: "none", border: "none", padding: 0, color: "var(--accent)", fontWeight: 700,
  fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)",
};

export interface AbgabeKarteProps {
  submissionId: string;
  classId: string;
  /** Der Name des Kindes — oder ein ehrlicher Platzhalter, wenn er sich nicht aufloesen liess. */
  kind: string;
  unitSlug: string;
  /** Schon auf dem Server formatiert: sonst rechnet der Browser anders als die Seite. */
  abgegebenAm: string;
  wortzahl: number;
  text: string;
  punkte: number | null;
  kommentar: string | null;
  benotetAm: string | null;
  /** Wessen Hand die Note gesetzt hat, schon zu einem Namen aufgeloest. */
  benotetVon: string | null;
  /** false = Migration 0018 liegt hier noch nicht. Dann gibt es kein Formular. */
  benotenMoeglich: boolean;
}

export default function AbgabeKarte(p: AbgabeKarteProps) {
  const router = useRouter();
  const langerText = p.text.length > KURZ_GENUG;
  const [offen, setOffen] = useState(!langerText);
  const [formular, setFormular] = useState(false);
  const [punkte, setPunkte] = useState(p.punkte === null ? "" : String(p.punkte));
  const [kommentar, setKommentar] = useState(p.kommentar ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const n = Number(punkte);
  const punkteOk = punkte.trim() !== "" && Number.isInteger(n) && n >= 0 && n <= 100;

  const speichern = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/writing-review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId: p.submissionId,
          classId: p.classId,
          score: n,
          ...(kommentar.trim() ? { feedback: kommentar.trim() } : {}),
        }),
      });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && d.ok) {
        setFormular(false);
        router.refresh(); // die Note kommt aus der Datenbank zurueck, nicht aus diesem Zustand
        return;
      }
      // Jede Fehler-Id bekommt ihren eigenen Satz: »hat nicht geklappt« schickt eine
      // Lehrkraft ins Raten, und genau das kostet spaeter eine Rueckfrage.
      setErr(
        d.error === "forbidden" ? "Du bist nicht (mehr) angemeldet — lad die Seite neu."
        : d.error === "class_not_found" ? "Diese Klasse gibt es nicht (mehr), oder sie gehört dir nicht."
        : d.error === "submission_not_found" ? "Diese Abgabe gibt es nicht (mehr)."
        : d.error === "no_grading_columns" ? "Die Benotung ist auf diesem Server noch nicht eingerichtet."
        : d.error === "bad_request" ? "Punkte müssen eine ganze Zahl von 0 bis 100 sein."
        : "Konnte nicht gespeichert werden — bitte noch einmal.",
      );
    } catch {
      setErr("Netzwerk-Fehler — bitte noch einmal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="dg-card" style={{ marginTop: 12, listStyle: "none" }}>
      {/* ── Kopf: wer, was, wann, wie lang, und die Note ─────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ minWidth: 0 }}>
          <strong style={{ color: "var(--ink)", fontSize: 16 }}>{p.kind}</strong>
          <span style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>
            {" · "}<span style={{ fontFamily: "var(--font-label)", letterSpacing: "0.04em" }}>{p.unitSlug}</span>
            {" · "}{p.abgegebenAm}
            {" · "}{p.wortzahl} {p.wortzahl === 1 ? "Wort" : "Wörter"}
          </span>
        </div>
        <div style={{ flexShrink: 0, fontSize: 13, fontWeight: 700 }}>
          {p.punkte === null ? (
            <span style={{ color: "var(--partial)" }}>noch nicht benotet</span>
          ) : (
            <span style={{ color: "var(--correct)" }}>{p.punkte} / 100</span>
          )}
        </div>
      </div>

      {/* ── Der Text des Kindes ──────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 10, padding: "10px 13px", borderRadius: 12, background: "var(--bg-sunken)",
          border: "1px solid var(--card-border)", whiteSpace: "pre-wrap", lineHeight: 1.55,
          fontSize: 14.5, color: "var(--text)",
        }}
      >
        {offen ? p.text : `${p.text.slice(0, KURZ_GENUG).trimEnd()} …`}
      </div>
      {langerText && (
        <button type="button" style={{ ...linkBtn, marginTop: 6 }} onClick={() => setOffen((o) => !o)}>
          {offen ? "weniger zeigen" : "ganzen Text zeigen"}
        </button>
      )}

      {/* ── Die Note, falls es schon eine gibt ───────────────────────────── */}
      {p.punkte !== null && (
        <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--text-secondary)" }}>
          {p.kommentar ? <span style={{ color: "var(--text)" }}>{p.kommentar}<br /></span> : null}
          <span style={{ color: "var(--muted)", fontSize: 12.5 }}>
            Benotet{p.benotetAm ? ` am ${p.benotetAm}` : ""}{p.benotetVon ? ` von ${p.benotetVon}` : ""}.
          </span>
        </p>
      )}

      {/* ── Das Formular ─────────────────────────────────────────────────── */}
      {!p.benotenMoeglich ? null : !formular ? (
        <button type="button" style={{ ...linkBtn, marginTop: 10 }} onClick={() => { setFormular(true); setErr(null); }}>
          {p.punkte === null ? "benoten" : "Note ändern"}
        </button>
      ) : (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--card-border)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <span style={{ width: 110 }}>
              <span style={label}>Punkte (0–100)</span>
              <input
                style={input}
                inputMode="numeric"
                value={punkte}
                onChange={(e) => setPunkte(e.target.value)}
                aria-label={`Punkte für ${p.kind}`}
              />
            </span>
            <span style={{ flex: 1, minWidth: 220 }}>
              <span style={label}>Kommentar (bleibt bei dir)</span>
              <textarea
                style={{ ...input, minHeight: 62, resize: "vertical" }}
                maxLength={2000}
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
                aria-label={`Kommentar für ${p.kind}`}
              />
            </span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 10 }}>
            <button
              type="button"
              className="dg-btn"
              disabled={!punkteOk || busy}
              onClick={speichern}
              style={{ opacity: punkteOk && !busy ? 1 : 0.5, cursor: punkteOk && !busy ? "pointer" : "not-allowed" }}
            >
              {busy ? "speichert …" : "Note speichern"}
            </button>
            <button type="button" style={linkBtn} onClick={() => { setFormular(false); setErr(null); }}>
              abbrechen
            </button>
            {!punkteOk && punkte.trim() !== "" && (
              <span style={{ color: "var(--incorrect)", fontSize: 12.5, fontWeight: 700 }}>
                Ganze Zahl von 0 bis 100.
              </span>
            )}
          </div>
          {err && <div style={{ color: "var(--incorrect)", fontSize: 13, fontWeight: 700, marginTop: 8 }}>{err}</div>}
          <p style={{ color: "var(--muted)", fontSize: 12, margin: "8px 0 0", lineHeight: 1.5 }}>
            Punkte und Kommentar sieht <strong>nur die Lehrkraft</strong> — beim Kind erscheint davon nichts.
          </p>
        </div>
      )}
    </li>
  );
}
