"use client";
/**
 * K1b · Die Hand des Großmeisters, eine Zeile weit.
 *
 * Ein Kind pro Zelle: Punkte gutschreiben und/oder eine Lernpfad-Einheit als
 * erledigt markieren. Die Seite rendert diese Zelle NUR für den Großmeister —
 * aber das ist Bequemlichkeit, nicht die Tür: /api/admin/progress-adjust prüft den
 * Rang selbst, server-seitig, vor jedem Datenbank-Zugriff, und löst Klasse und
 * Zugehörigkeit des Kindes selbst auf. Was hier im Formular steht, ist eine
 * Behauptung des Browsers und wird auch so behandelt.
 *
 * Muster wie RosterManager: fetch → router.refresh(), damit die Zahlen daneben aus
 * der Datenbank neu gelesen werden statt im Browser fortgeschrieben zu werden.
 */
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useRef, useState, type CSSProperties } from "react";

/** Maße der Tafel — einmal benannt, weil die Position sie mitrechnet. */
const PANEL_W = 250;
/** Grobe Höhe: reicht, um die Tafel am unteren Fensterrand nach oben zu schieben. */
const PANEL_H = 340;

const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 3 };
const input: CSSProperties = { fontFamily: "var(--font-body)", fontSize: 14, padding: "6px 9px", borderRadius: 9, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%" };
const linkBtn: CSSProperties = { background: "none", border: "none", padding: 0, color: "var(--accent)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" };

/**
 * Eine wählbare Einheit. `journey` heißt: diese Einheit hat einen AUTHORED
 * Lernweg (J-1), und der leitet seinen Stand aus dem Versuchs-Protokoll ab statt
 * aus den Lernpfad-Knoten — eine Handmarkierung wird dort beim Kind also NICHT
 * sichtbar (bei den übrigen Einheiten schon). Am laufenden System gemessen; im
 * Korpus trifft das derzeit genau eine Einheit. Das gehört ins Formular, nicht in
 * eine Fußnote: sonst sieht die Lehrkraft ihre Zahl steigen und das Kind nichts.
 */
export interface AdjustUnit {
  slug: string;
  journey: boolean;
}

export default function ProgressAdjustCell({
  classId,
  studentId,
  studentLabel,
  units,
}: {
  classId: string;
  studentId: string;
  studentLabel: string;
  units: AdjustUnit[];
}) {
  const router = useRouter();
  const knopf = useRef<HTMLButtonElement | null>(null);
  // Die Tafel steht FEST am Fenster und hängt am <body>, nicht in der Tabelle.
  // Zwei Beschneidungen sind ihr am laufenden Bild nacheinander begegnet (beide
  // gemessen, keine vermutet):
  //   1. die Tabelle scrollt waagrecht (`overflow-x: auto`) — und sobald EINE
  //      Achse scrollt, beschneidet der Kasten auch die andere: die Tafel war
  //      unten abgeschnitten;
  //   2. `position: fixed` allein half nicht, weil `.dg-card` ein
  //      `backdrop-filter` trägt und ein gefiltertes Element für alles darin zum
  //      Bezugsrahmen wird — »fixed« war dann am Kasten fest, nicht am Fenster.
  // Deshalb ein Portal an den <body>. Die Koordinaten liest der Knopf beim Öffnen ab.
  const [ort, setOrt] = useState<{ top: number; left: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [vocabXp, setVocabXp] = useState("");
  const [grammarXp, setGrammarXp] = useState("");
  const [unitSlug, setUnitSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const v = Number(vocabXp || 0);
  const g = Number(grammarXp || 0);
  const zahlenOk = Number.isInteger(v) && Number.isInteger(g) && v >= 0 && g >= 0;
  const etwasZuTun = zahlenOk && (v + g > 0 || unitSlug !== "");

  const speichern = async () => {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/admin/progress-adjust", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId,
          classId,
          vocabXp: v,
          grammarXp: g,
          ...(unitSlug ? { unitSlug } : {}),
        }),
      });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; nodesMarked?: number };
      if (res.ok && d.ok) {
        const teile: string[] = [];
        if (v > 0) teile.push(`+${v} Vokabel-XP`);
        if (g > 0) teile.push(`+${g} Grammatik-XP`);
        if (unitSlug) teile.push(`${unitSlug} erledigt (${d.nodesMarked} Stationen)`);
        setMsg(teile.join(" · "));
        setVocabXp("");
        setGrammarXp("");
        setUnitSlug("");
        router.refresh();
        return;
      }
      // Jede Fehler-Id bekommt ihren eigenen Satz: »hat nicht geklappt« schickt
      // eine Lehrkraft ins Raten, und genau das kostet später eine Rückfrage.
      setErr(
        d.error === "not_grandmaster" ? "Nur der Großmeister darf Fortschritt von Hand setzen."
        : d.error === "not_in_class" ? "Dieses Kind steht nicht auf der Liste dieser Klasse."
        : d.error === "class_not_found" ? "Diese Klasse gibt es nicht (mehr)."
        : d.error === "wrong_grade" ? "Diese Einheit gehört zu einem anderen Schuljahr."
        : d.error === "unit_not_published" ? "Diese Einheit ist noch nicht freigegeben."
        : d.error === "nothing_to_do" ? "Trag Punkte ein oder wähl eine Einheit."
        : "Konnte nicht gespeichert werden — bitte noch einmal.",
      );
    } catch {
      setErr("Netzwerk-Fehler — bitte noch einmal.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <>
        <button
          ref={knopf}
          type="button"
          style={linkBtn}
          onClick={() => {
            const r = knopf.current?.getBoundingClientRect();
            // Am unteren Fensterrand rutscht die Tafel nach oben statt hinauszuragen —
            // ein Formular, dessen Knopf man nicht sieht, ist kein Formular.
            if (r) {
              setOrt({
                top: Math.max(8, Math.min(r.bottom + 4, window.innerHeight - PANEL_H)),
                left: Math.max(8, Math.min(r.right - PANEL_W, window.innerWidth - PANEL_W - 8)),
              });
            }
            setOpen(true);
            setMsg(null);
            setErr(null);
          }}
        >
          anpassen
        </button>
        {msg && <div style={{ color: "var(--correct)", fontSize: 12, fontWeight: 700, marginTop: 3 }}>{msg}</div>}
      </>
    );
  }

  const tafel = (
    <div style={{ position: "fixed", top: ort?.top ?? 80, left: ort?.left ?? 8, zIndex: 50, width: PANEL_W, textAlign: "left", background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: 12, padding: 10, boxShadow: "var(--shadow-card)" }}>
      <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13, marginBottom: 6 }}>{studentLabel}</div>

      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ flex: 1 }}>
          <span style={label}>Vokabel-XP</span>
          <input style={input} inputMode="numeric" value={vocabXp} onChange={(e) => setVocabXp(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" />
        </span>
        <span style={{ flex: 1 }}>
          <span style={label}>Grammatik-XP</span>
          <input style={input} inputMode="numeric" value={grammarXp} onChange={(e) => setGrammarXp(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" />
        </span>
      </div>

      <div style={{ marginTop: 8 }}>
        <span style={label}>Einheit als erledigt markieren</span>
        <select style={input} value={unitSlug} onChange={(e) => setUnitSlug(e.target.value)}>
          <option value="">— keine —</option>
          {units.map((u) => (
            <option key={u.slug} value={u.slug}>
              {u.slug}{u.journey ? " — beim Kind noch nicht sichtbar" : ""}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "8px 0 0", lineHeight: 1.45 }}>
        Punkte werden nur <strong>dazugezählt</strong>, nie abgezogen, und sind für das Kind heute noch nicht zu
        sehen — sie werden es mit der Punkte-Anzeige. Eine markierte Einheit bekommt <strong>einen Stern</strong> je
        Station: freigeschaltet, nicht bewertet. Jede Anpassung wird mit deinem Namen protokolliert.
      </p>

      {err && <div style={{ color: "var(--incorrect)", fontSize: 12.5, fontWeight: 700, marginTop: 8 }}>{err}</div>}
      {msg && <div style={{ color: "var(--correct)", fontSize: 12.5, fontWeight: 700, marginTop: 8 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
        <button
          type="button"
          className="dg-btn"
          style={{ fontSize: 13, padding: "6px 12px", opacity: etwasZuTun && !busy ? 1 : 0.5 }}
          disabled={!etwasZuTun || busy}
          onClick={speichern}
        >
          {busy ? "…" : "Übernehmen"}
        </button>
        <button type="button" style={linkBtn} onClick={() => setOpen(false)}>schließen</button>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" style={{ ...linkBtn, opacity: 0.6 }} onClick={() => setOpen(false)}>anpassen</button>
      {createPortal(tafel, document.body)}
    </>
  );
}
