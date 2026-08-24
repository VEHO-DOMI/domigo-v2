/**
 * /admin/classes/[id]/schreiben — WAS DIE KINDER GESCHRIEBEN HABEN (K6a).
 *
 * Seit B2 (Juli) tippen Kinder in den Schularbeits-Proben echte Kurztexte. Die
 * Tabelle `writing_submissions` hatte seither genau EINEN Schreiber und KEINEN
 * Leser — repo-weit nachgezählt. Jeder dieser Texte wurde erfasst und nie gesehen.
 * Für eine Lehrkraft ist das die Arbeit ihrer Kinder, verloren. Diese Seite ist der
 * Leser, den es nie gab.
 *
 * AUTORISIERUNG — wörtlich das Muster der Fortschritts-Seite (K1a, die es
 * ihrerseits von der Namenslisten-Seite hat): erst besitzer-skopiert (der Besitz IST
 * die WHERE-Klausel), und NUR wenn das leer bleibt und die Aufrufende
 * Großmeisterin ist, wird die Klasse ungeskopt aufgelöst, ihre EIGENTÜMER-Id davon
 * abgelesen und der gewöhnliche, besitzer-skopierte Dienst mit DEREN Id gefahren.
 * Der Rang wird geprüft, bevor irgendetwas gelesen wird — eine Prüfung nach dem
 * Lesen ist keine Tür, sondern eine Offenlegung mit einer Weiterleitung am Ende.
 *
 * Diese Id (`authorizingTeacherId`) wird auch WIRKLICH weitergereicht: der
 * Abgaben-Leser trägt dieselbe Eigentums-Unterabfrage wie das Benoten. Im ersten
 * Entwurf stand dieser Satz hier, während die Variable eine Zeile später
 * weggeworfen wurde — die Wand-Beschriftung stimmte, der Anschluss dahinter nicht
 * (im Zug-Review gefunden). Ein Kommentar, der eine Absicherung behauptet, ist
 * gefährlicher als gar keiner: die nächste Hand prüft sie dann nicht nach.
 *
 * DREI ZUSTÄNDE, DIE MAN NICHT VERWECHSELN DARF, und die Seite sagt jeden einzeln:
 *   1. »noch keine Abgabe« — normal, und die Seite sagt, WO es überhaupt welche
 *      geben kann (an dieser Stufe, zur Laufzeit aus dem Korpus gezählt);
 *   2. »ich konnte nicht nachsehen« — UNVOLLSTÄNDIG, nicht leer (die K1b-Doktrin:
 *      ein geschluckter Fehler, der »nichts da« rendert, ist die eine Lüge, die eine
 *      Beobachtungs-Fläche nie erzählen darf);
 *   3. »die Benotung ist hier noch nicht eingerichtet« — Migration 0018 ist noch
 *      nicht angewandt. Die Texte stehen trotzdem da; nur benoten geht nicht.
 *
 * ⚠ BEIM KIND ERSCHEINT VON ALLEDEM NICHTS. Kein Rückkanal, keine Anzeige, kein
 * »deine Lehrerin hat es gelesen« — bewusst, bis zum Datenschutz-Tor D-6 und einem
 * eigenen Design (W-2). Wer hier eine Schüler-Sicht anbaut, trifft eine neue
 * Entscheidung, nicht das Ende dieser.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  UNKNOWN_TEACHER_LABEL,
  getClassForGrandmaster,
  getClassForTeacher,
  getDb,
  listStudentsForClass,
  listSubmissionsForClass,
  resolveTeacherNames,
  type OwnedClass,
} from "@domigo/db";
import { listApprovedUnits, loadTest } from "@domigo/content-loader";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import { isSlugAllowed, visibleGradesFor } from "@/lib/grade-scope";
import AbgabeKarte from "./AbgabeKarte";

// Liest den Korpus zur Laufzeit über fs — nie statisch vorgerendert.
export const dynamic = "force-dynamic";

/** Wenn ein Name sich nicht auflösen lässt, sagt die Seite das — statt eine Lücke zu lassen. */
const UNBEKANNTES_KIND = "Name nicht auflösbar";

/** Zeitpunkt in österreichischer Schreibweise. Auf dem SERVER formatiert, damit der
 *  Browser nicht anders rechnet als die Seite (Muster: die Fortschritts-Seite). */
function wann(d: Date | null | undefined): string {
  if (!d) return "—";
  return `${d.toLocaleDateString("de-AT")}, ${d.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}`;
}

/**
 * Welche Einheiten DIESER Stufe überhaupt einen Schreib-Abschnitt tragen — zur
 * Laufzeit aus dem Korpus gezählt, nicht in den Satz getippt.
 *
 * ⚠ Das ist kein Zierrat. Der eingefrorene Brief nannte zwei Einheiten; beim Bau
 * waren es drei (g2-u02 hat seit der Kalibrier-Bahn K4a einen dazubekommen). Eine
 * abgetippte Liste veraltet beim nächsten Merge und erzählt der Lehrkraft dann
 * etwas Falsches über ihren eigenen Korpus.
 */
function einheitenMitSchreibteil(grade: number): string[] {
  const stufen = visibleGradesFor(grade);
  return listApprovedUnits()
    .filter((slug) => isSlugAllowed(slug, stufen))
    .filter((slug) => {
      try {
        return loadTest(slug)?.test.sections.some((s) => s.kind === "writing") ?? false;
      } catch {
        return false;
      }
    });
}

/** Eine Aufzählung, wie ein Mensch sie spricht: »a, b und c«. */
function undVerbunden(teile: string[]): string {
  if (teile.length === 0) return "";
  if (teile.length === 1) return teile[0]!;
  return `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}`;
}

export default async function SchreibAbgabenPage({ params }: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const { id } = await params;
  // Der Rang: eine reine Umgebungs-Lese, VOR jeder Abfrage.
  const grossmeister = isGrandmaster(teacher.userId);
  let cls: OwnedClass | null = await getClassForTeacher(getDb(), id, teacher.userId).catch(() => null);
  // Unter WESSEN Autorisierung die besitzer-skopierten Dienste laufen.
  let authorizingTeacherId = teacher.userId;
  let ueberschrift = cls?.name ?? "";
  let fremd = false;

  if (!cls && grossmeister) {
    const foreign = await getClassForGrandmaster(getDb(), id).catch(() => null);
    if (foreign) {
      cls = foreign;
      authorizingTeacherId = foreign.teacherId;
      const names = await resolveTeacherNames(getDb(), [foreign.teacherId]).catch(() => new Map<string, string>());
      const owner = names.get(foreign.teacherId) ?? UNKNOWN_TEACHER_LABEL;
      ueberschrift = `${foreign.name} · ${owner} · Großmeister-Zugriff`;
      fremd = true;
    }
  }

  if (!cls) redirect("/admin/classes"); // nicht die Klasse dieser Lehrkraft (oder es gibt sie nicht)

  // Der Leser mit ehrlichem dritten Zustand: »gescheitert« ist etwas anderes als »leer«.
  // Er läuft unter `authorizingTeacherId` — der Lehrkraft selbst, oder der EIGENTÜMERIN,
  // wenn der Großmeister hier arbeitet. Der Besitz-Check oben ist damit nicht die einzige
  // Tür: der Dienst trägt die Bedingung selbst.
  let abgaben: Awaited<ReturnType<typeof listSubmissionsForClass>> | null = null;
  try {
    abgaben = await listSubmissionsForClass(getDb(), id, authorizingTeacherId);
  } catch (err) {
    console.error(
      "[admin/classes/[id]/schreiben] Leser gescheitert:",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
  }

  // Namen getrennt, über die Id-Liste — der Abgaben-Leser fasst kein Namensregister an.
  const namen = await listStudentsForClass(getDb(), id)
    .then((rows) => new Map(rows.map((r) => [r.id, r.name])))
    .catch(() => new Map<string, string>());

  // Wessen Hand welche Note gesetzt hat — dieselbe Auflösung, die die Klassenliste nutzt.
  const benoterIds = [...new Set((abgaben?.rows ?? []).map((r) => r.gradedBy).filter((x): x is string => !!x))];
  const benoterNamen = benoterIds.length
    ? await resolveTeacherNames(getDb(), benoterIds).catch(() => new Map<string, string>())
    : new Map<string, string>();

  const schreibEinheiten = einheitenMitSchreibteil(cls.grade);
  const zeilen = abgaben?.rows ?? [];
  const offen = zeilen.filter((r) => r.score === null).length;

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {ueberschrift} <span style={{ fontWeight: 400, fontSize: 15, color: "var(--muted)" }}>· Schreib-Abgaben</span>
        </h1>
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          <Link href={`/admin/classes/${cls.id}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Fortschritt</Link>
          <Link href="/admin/classes" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Klassen</Link>
        </div>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Die Texte, die deine Kinder in den Schularbeits-Proben getippt haben — mit deiner Note darauf.{" "}
        <strong>Punkte und Kommentar bleiben bei dir</strong>: beim Kind erscheint davon nichts.
        {fremd ? " Du siehst diese Klasse als Großmeister — jede Note wird auf deinen Namen protokolliert." : ""}
      </p>

      {/* ── Zustand 2: ich konnte nicht nachsehen ───────────────────────── */}
      {abgaben === null ? (
        <p
          style={{
            background: "var(--bg-sunken)", border: "1px solid var(--incorrect)", color: "var(--incorrect)",
            padding: "9px 13px", borderRadius: 12, fontSize: 13, fontWeight: 700, margin: "16px 0 0",
          }}
        >
          Die Abgaben konnten gerade nicht geladen werden. Was hier steht, ist deshalb UNVOLLSTÄNDIG — nicht leer.
          Lad die Seite in einem Moment noch einmal.
        </p>
      ) : (
        <>
          {/* ── Zustand 3: die Benotung liegt hier noch nicht ────────────── */}
          {!abgaben.gradingAvailable && (
            <p
              style={{
                background: "var(--bg-sunken)", border: "1px solid var(--partial)", color: "var(--partial)",
                padding: "9px 13px", borderRadius: 12, fontSize: 13, fontWeight: 700, margin: "16px 0 0",
              }}
            >
              Benotung noch nicht eingerichtet. Die Texte kannst du lesen; Punkte und Kommentar lassen sich auf
              diesem Server noch nicht speichern (die Datenbank-Erweiterung 0018 fehlt hier). Nichts ist verloren —
              sobald sie liegt, ist das Formular da.
            </p>
          )}

          {/* ── Zustand 1: noch keine Abgabe ─────────────────────────────── */}
          {zeilen.length === 0 ? (
            <section className="dg-card" style={{ marginTop: 20 }}>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                Noch keine Abgabe.{" "}
                {schreibEinheiten.length === 0
                  ? "Auf dieser Stufe hat derzeit keine Probe einen Schreib-Teil."
                  : (
                    <>
                      Schreib-Aufgaben gibt es auf dieser Stufe in{" "}
                      {schreibEinheiten.length === 1 ? "der Probe von " : "den Proben von "}
                      <strong>{undVerbunden(schreibEinheiten)}</strong> — sobald ein Kind dort den Schreib-Teil
                      absendet, steht sein Text hier.
                    </>
                  )}
              </p>
            </section>
          ) : (
            <>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "18px 0 0" }}>
                {zeilen.length} {zeilen.length === 1 ? "Abgabe" : "Abgaben"}
                {abgaben.gradingAvailable ? ` · ${offen} noch nicht benotet` : ""} · neueste zuerst
              </p>
              <ol style={{ margin: 0, padding: 0 }}>
                {zeilen.map((r) => (
                  <AbgabeKarte
                    key={r.id}
                    submissionId={r.id}
                    classId={cls.id}
                    kind={namen.get(r.userId) ?? UNBEKANNTES_KIND}
                    unitSlug={r.unitSlug}
                    abgegebenAm={wann(r.submittedAt)}
                    wortzahl={r.wordCount}
                    text={r.text}
                    punkte={r.score}
                    kommentar={r.feedback}
                    benotetAm={r.gradedAt ? wann(r.gradedAt) : null}
                    benotetVon={r.gradedBy ? (benoterNamen.get(r.gradedBy) ?? UNKNOWN_TEACHER_LABEL) : null}
                    benotenMoeglich={abgaben.gradingAvailable}
                  />
                ))}
              </ol>
            </>
          )}
        </>
      )}

      <p style={{ color: "var(--muted)", fontSize: 12.5, margin: "18px 0 0", lineHeight: 1.5 }}>
        Erfasst werden Schreib-Teile aus den Proben unter <strong>/tests</strong>. Ein Schreib-Teil in einer selbst
        gestellten Aufgabe wird noch nicht mitgeschrieben — der Aufgaben-Läufer kann Schreiben bisher nicht.
      </p>
    </main>
  );
}
