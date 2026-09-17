// app/datenschutz/page.tsx — Datenschutzerklärung (public: not in middleware.ts's matcher).
//
// gomarke-004 (2026-09-14). The DSFA of daten-008 found DomiGo live for children
// under 14 with no page at all (404). This page follows the srdp DS-0 rule: every
// sentence is a claim about production and is backed by a line of code or a
// measurement —
//   · data list          → packages/db/src/schema.ts (domigo_v2.*) + v1.ts mirrors
//   · join page labels   → roster-service.ts `claimLabel` (first name + last initial)
//   · sign-in cookie     → auth.ts `session: { strategy: "jwt", maxAge: 30 days }`
//   · on-device storage  → localStorage/sessionStorage writes in the game clients
//   · removal            → roster-service.ts `removeStudent` deletes the v2 identity row only
//   · teacher mail       → lib/mailer.ts (Brevo), studio probe → lib/studio-solve-sandbox.ts
//   · attempt context    → api/attempts (server-set `trap`), api/assignments/attempt (`sessionId`)
//   · processors' DPF    → U.S. register as read by S2 on 2026-09-13
//   · function region    → lib/datenschutz.ts, equal to vercel.json (test-enforced)
//   · database region,
//     restore window     → lib/datenschutz.ts, read in the Neon console 2026-09-15 (gomarke-005)
//   · contact address    → lib/datenschutz.ts, named by Koki 2026-09-17 (gomarke-007)
// Deliberately NOT said here: a legal basis (open, DSFA R-01 / gomarke-002), any
// data-processing agreement with Vercel or Neon (not evidenced, DSFA D-18), and
// "only in the EU" — the providers are US companies.

import Link from "next/link";
import {
  DATENBANK_REGION,
  DATENSCHUTZ_KONTAKT,
  DATENSCHUTZ_STAND,
  FUNKTIONS_REGION,
  RUECKHOLFENSTER,
  VERANTWORTLICHER,
} from "@/lib/datenschutz";

export const metadata = { title: "Datenschutz · DomiGo" };

const h2 = { fontFamily: "var(--font-display)", fontSize: 21, color: "var(--ink)", margin: "30px 0 8px" } as const;
const list = { paddingLeft: 22, margin: "8px 0", display: "flex", flexDirection: "column", gap: 7 } as const;
const code = { fontFamily: "ui-monospace, monospace", fontSize: 14 } as const;
const link = { color: "var(--accent-deep)" } as const;

export default function DatenschutzPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 56px", fontFamily: "var(--font-body)", color: "var(--text)", fontSize: 16, lineHeight: 1.6 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--ink)", margin: "0 0 12px" }}>Datenschutz</h1>
      <p style={{ marginTop: 0 }}>
        DomiGo ist eine Übungs-App für Englisch in der 1. bis 4. Klasse. Hier steht, welche Daten DomiGo
        speichert, wer sie sieht, wo sie liegen und wie lange sie bleiben. Für Kinder unter 14 Jahren
        richtet sich diese Seite auch an die Eltern.
      </p>

      <h2 style={h2}>Wer verantwortlich ist</h2>
      <p>
        DomiGo wird von {VERANTWORTLICHER}, als Privatperson betrieben. Fragen zum Datenschutz und alle
        Anfragen zu deinen Rechten gehen an{" "}
        <a href={`mailto:${DATENSCHUTZ_KONTAKT}`} style={link}>{DATENSCHUTZ_KONTAKT}</a>.
      </p>

      <h2 style={h2}>Welche Daten DomiGo über Schülerinnen und Schüler speichert</h2>
      <ul style={list}>
        <li><strong>Konto:</strong> dein selbst gewählter Spitzname, deine Klasse und deine 6-stellige PIN. Die PIN wird nur verschlüsselt gespeichert (bcrypt), niemand kann sie lesen. Konten aus der früheren DomiGo-Version liegen in derselben Datenbank und werden zum Anmelden weiter gelesen.</li>
        <li><strong>Echter Name:</strong> dein Name, wie ihn deine Lehrkraft in die Klassenliste einträgt. Er ist für deine Lehrkraft da, damit sie dich zuordnen kann.</li>
        <li><strong>Üben:</strong> jede beantwortete Aufgabe mit Zeitpunkt, richtig oder falsch, wie lange du gebraucht hast, ob du einen Hinweis genommen hast, bei falschen Antworten die Art des Fehlers und bei Tests, zu welchem Durchgang die Antwort gehört.</li>
        <li><strong>Fortschritt:</strong> Punkte (XP), Serie, Wiederholungskarten, erledigte Schritte im Lernpfad mit Sternen.</li>
        <li><strong>Schreiben:</strong> Texte, die du schreibst und abgibst, mit Wortzahl sowie Punkten und Rückmeldung deiner Lehrkraft.</li>
        <li><strong>Tests und Aufgaben:</strong> wann du begonnen und abgegeben hast, die Zeit je Abschnitt, dein Ergebnis in Prozent und eine Note von 1 bis 5.</li>
        <li><strong>Spiele:</strong> dein Spielstand.</li>
        <li><strong>Klassen-Protokoll:</strong> wann jemand der Klasse beigetreten ist, umbenannt oder entfernt wurde, und ähnliche Änderungen — ohne Namen.</li>
        <li><strong>Schutz vor Erraten:</strong> die Zahl der Fehlversuche beim Anmelden, gezählt je Klassencode und Spitzname.</li>
        <li><strong>Jahres-Stand:</strong> am Ende eines Schuljahres kann ein Stand gespeichert werden (Spitzname, echter Name, Klasse, Punkte und Fortschritt), damit es im nächsten Jahr weitergehen kann.</li>
      </ul>
      <p>
        DomiGo speichert <strong>keine</strong> E-Mail-Adressen von Kindern und keine IP-Adressen in seiner
        Datenbank. Es gibt keine Werbung, keine Analyse- oder Tracking-Dienste, und die Schriften kommen
        vom eigenen Server.
      </p>

      <h2 style={h2}>Daten von Lehrkräften</h2>
      <p>
        Spitzname, gegebenenfalls der echte Name, PIN (verschlüsselt), freiwillig eine E-Mail-Adresse, damit
        eine vergessene PIN zurückgesetzt werden kann, ein Protokoll der Änderungen am eigenen Konto und die Zahl der Fehlversuche beim Anmelden und beim Zurücksetzen der PIN, gezählt je Spitzname.
      </p>

      <h2 style={h2}>Was auf deinem Gerät bleibt</h2>
      <p>
        Nach dem Anmelden setzt DomiGo ein Anmelde-Cookie, das 30 Tage gilt. Spielstände, Einstellungen
        und dein Regelbuch werden zusätzlich im Speicher deines Browsers abgelegt. Das Cookie wird nur an
        DomiGo geschickt.
      </p>

      <h2 style={h2}>Wer was sieht</h2>
      <ul style={list}>
        <li><strong>Deine Lehrkraft</strong> sieht deinen echten Namen, deine Ergebnisse, deine Texte, deine Tests und deinen Fortschritt.</li>
        <li><strong>Deine Mitschülerinnen und Mitschüler</strong> sehen deine Ergebnisse nicht. Es gibt keine Rangliste.</li>
        <li><strong>Beim Beitreten:</strong> Wer den Klassencode kennt, sieht auf der Beitrittsseite die Kinder, die sich noch nicht angemeldet haben — mit Vornamen und dem ersten Buchstaben des Nachnamens, damit sich jedes Kind selbst finden kann.</li>
        <li><strong>Ein eigens freigeschalteter Verwaltungszugang</strong> kann alle Klassen aller Lehrkräfte einsehen.</li>
      </ul>

      <h2 style={h2}>Wo die Daten verarbeitet werden</h2>
      <ul style={list}>
        <li><strong>Anwendung:</strong> Vercel, Rechenzentrum Frankfurt (<code style={code}>{FUNKTIONS_REGION}</code>).</li>
        {DATENBANK_REGION && (
          <li><strong>Datenbank:</strong> Neon Postgres, {DATENBANK_REGION}.</li>
        )}
      </ul>
      <p>
        Beides gilt gleichzeitig: die Rechner stehen in Frankfurt, die Firmen, die sie betreiben, sitzen in
        den USA. Was das für deine Daten bedeutet, steht im nächsten Abschnitt.
      </p>

      <h2 style={h2}>Beteiligte Dienste</h2>
      <ul style={list}>
        <li><strong>Vercel Inc.</strong> (USA) — betreibt die Anwendung. Beim Aufruf einer Seite verarbeitet Vercel technisch deine IP-Adresse und protokolliert die Zugriffe. Vercel Inc. ist nach dem EU-US Data Privacy Framework zertifiziert (Stand 2026-09-13).</li>
        <li><strong>Neon</strong> (USA) — Datenbank. Neon, LLC ist als Teil von Databricks, Inc. nach dem EU-US Data Privacy Framework zertifiziert (Stand 2026-09-13).</li>
        <li><strong>Brevo</strong> — verschickt E-Mails, aber nur an Lehrkräfte, die eine vergessene PIN zurücksetzen.</li>
        <li><strong>Anthropic PBC</strong> (USA) — Lehrkräfte können eine neue Aufgabe von einer KI probeweise lösen lassen, bevor Kinder sie bekommen. Dabei wird nur die Aufgabe übermittelt, <strong>keine Daten von Kindern</strong>. Die Übermittlung in die USA stützt sich laut Anthropic-Datenschutzerklärung auf Standardvertragsklauseln.</li>
      </ul>

      <h2 style={h2}>Wie lange die Daten bleiben</h2>
      <p>
        Derzeit gibt es <strong>keine feste Löschfrist</strong> und keine automatische Löschung. Wenn eine
        Lehrkraft ein Kind aus der Klasse entfernt, wird heute nur sein Eintrag in der Klassenliste
        (Spitzname, Name, PIN) gelöscht; Übungsergebnisse, Texte, Noten, ein bereits gespeicherter
        Jahres-Stand und ein Konto aus der früheren DomiGo-Version bleiben gespeichert. Auf Anfrage an {DATENSCHUTZ_KONTAKT} werden auch diese Daten
        gelöscht.
      </p>
      {RUECKHOLFENSTER && (
        <p>
          Die Datenbank hält außerdem eine Sicherungskopie der letzten {RUECKHOLFENSTER} vor. Wird etwas gelöscht,
          steckt es in dieser Kopie noch so lange — nach {RUECKHOLFENSTER} ist es auch dort weg.
        </p>
      )}

      <h2 style={h2}>Deine Rechte</h2>
      <p>
        Du kannst Auskunft über deine Daten verlangen, falsche Daten berichtigen und Daten löschen lassen,
        die Verarbeitung einschränken lassen, ihr widersprechen und deine Daten in einem gängigen Format
        bekommen. Für Kinder unter 14 Jahren können das die Eltern tun. Schreib dafür an{" "}
        {DATENSCHUTZ_KONTAKT}.
      </p>
      <p>
        Du hast außerdem das Recht, dich bei der Österreichischen Datenschutzbehörde zu beschweren
        (Barichgasse 40–42, 1030 Wien, <a href="https://www.dsb.gv.at" style={link}>dsb.gv.at</a>).
      </p>

      <p style={{ marginTop: 34, fontSize: 14, color: "var(--text-secondary)" }}>
        Stand: {DATENSCHUTZ_STAND} · <Link href="/" style={link}>zur Startseite</Link>
      </p>
    </main>
  );
}
