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
//   · studio probe       → lib/studio-solve-sandbox.ts
//   · attempt context    → api/attempts (server-set `trap`), api/assignments/attempt (`sessionId`)
//   · processors' DPF    → U.S. register as read by S2 on 2026-09-13
//   · function region    → lib/datenschutz.ts, equal to vercel.json (test-enforced)
//   · database region,
//     restore window     → lib/datenschutz.ts, read in the Neon console 2026-09-15 (gomarke-005)
//   · contact address    → lib/datenschutz.ts, named by Koki 2026-09-17 (gomarke-007)
//   · sign-in, deletion  → dach-108 (Koki 19.09., E-3): ONE wording, no date. The
//                           account service alone signs in (auth.ts konto-handoff,
//                           no PIN provider left), and konto's deletion announcement
//                           removes everything (api/konto/account-deleted →
//                           packages/db konto-loeschung.ts). Old PIN-era rows stay in
//                           the database (no migration, no deletion) and are named
//                           as such; nothing checks them any more.
//
// gomarke-008 (2026-09-17). PR #437 listed four sentences here that NO machine
// held to the code; a new column or a new dependency would have made this page
// quietly untrue. What guards them now:
//   · the data list        → lib/datenschutz-spalten.ts classifies EVERY column
//                            of domigo_v2 (226 today) and lib/datenschutz-page.test.ts
//                            reads the schema at runtime: a new column that nobody
//                            classified turns the gate red, and so does a
//                            classification that points at nothing (no more
//                            one-directional positive list of ten)
//   · no ads/analytics,
//     fonts from our own
//     server               → scripts/check-datenschutz-claims.mjs, law 1 (every
//                            tracked file under apps/ and packages/, which is why
//                            it also sees next.config.ts and package.json —
//                            check-fonts.mjs guards only next/font/google, in a
//                            narrower set of roots)
//   · no e-mail addresses
//     of children          → scripts/check-datenschutz-claims.mjs, law 2: the
//                            column users.email has exactly ONE writer
//                            (packages/db/src/teacher-identity.ts). NOT a database
//                            CHECK constraint — that is proposed as a Neon sheet
//                            (Koki's decision on card gomarke-008), so this page
//                            says who can enter one, not that the database forbids it
//   · who may see all
//     classes              → lib/grandmaster.ts (an env-var allowlist, unset ⇒
//                            nobody). That it is Koki ALONE is HIS statement of
//                            2026-09-17, not a code measurement: the list lives in
//                            Vercel and no test can read it
//   · one-month answer     → a LEGAL deadline (Art. 12 (3) GDPR), not a measured
//     for a request          number, and nothing in the code enforces it
// Deliberately NOT said here: a legal basis (open, DSFA R-01 / gomarke-002), any
// data-processing agreement with Vercel or Neon (not evidenced, DSFA D-18), and
// "only in the EU" — the providers are US companies.

import Link from "next/link";
import { kontoBaseUrl } from "@/lib/konto/basis";
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
  // dach-108 · Ein Wortlaut, kein Datum: die Seite beschreibt, was LIVE ist (DATEN-7 §4).
  const kontoHost = new URL(kontoBaseUrl()).host;
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
        <li><strong>Konto:</strong> dein Spitzname und deine Klasse. Angemeldet wirst du bei {kontoHost}; DomiGo speichert kein Passwort und prüft auch keines. Aus der früheren DomiGo-Anmeldung liegen alte Konten weiter in derselben Datenbank — mit dem damaligen Spitznamen und der PIN von damals (eine 6-stellige PIN, nur verschlüsselt gespeichert, bcrypt). Mit dieser PIN kommt niemand mehr hinein; sie wird nicht mehr geprüft.</li>
        <li><strong>Echter Name:</strong> bei Konten aus der früheren DomiGo-Anmeldung steht er noch hier; bei allen anderen steht er bei {kontoHost} und nicht in DomiGo. Sehen kann ihn nur deine Lehrkraft.</li>
        <li><strong>Üben:</strong> jede beantwortete Aufgabe mit Zeitpunkt, richtig oder falsch und wie nah du dran warst, wie lange du gebraucht hast, ob du einen Hinweis genommen hast, bei falschen Antworten die Art des Fehlers und bei Tests, zu welchem Durchgang die Antwort gehört.</li>
        <li><strong>Fortschritt:</strong> Punkte (XP), Serie, Hinweis-Funken (die Funken, die du in einer Runde gesammelt hast; dein Stand wird auf der Weltkarte angezeigt und sonst nicht verwendet), Wiederholungskarten, erledigte Schritte im Lernpfad mit Sternen.</li>
        <li><strong>Schreiben:</strong> Texte, die du schreibst und abgibst, mit Wortzahl sowie Punkten und Rückmeldung deiner Lehrkraft.</li>
        <li><strong>Tests und Aufgaben:</strong> wann du begonnen und abgegeben hast, die Zeit je Abschnitt, dein Ergebnis in Prozent und eine Note von 1 bis 5.</li>
        <li><strong>Spiele:</strong> dein Spielstand.</li>
        <li><strong>Klassen-Protokoll:</strong> wann jemand der Klasse beigetreten ist, umbenannt oder entfernt wurde, und ähnliche Änderungen — ohne Namen.</li>
        <li><strong>Schutz vor Erraten:</strong> aus der früheren DomiGo-Anmeldung liegt noch die Zahl der Fehlversuche, gezählt je Klassencode und Spitzname. DomiGo zählt keine neuen mehr, weil es selbst niemanden mehr anmeldet.</li>
        <li><strong>Jahres-Stand:</strong> am Ende eines Schuljahres kann ein Stand gespeichert werden (Spitzname, echter Name, Klasse, Punkte und Fortschritt), damit es im nächsten Jahr weitergehen kann.</li>
      </ul>
      <p>
        Dein echter Name steht nur an zwei Stellen: im Punkt »Echter Name« und, falls am Ende eines
        Schuljahres ein Stand gespeichert wird, im »Jahres-Stand«. Alles andere ist deinem Konto
        zugeordnet, ohne deinen Namen: bei jeder Übung, jedem Text, jedem Test und jedem Spielstand
        steht in der Datenbank nur eine Kennung deines Kontos — eine lange Zufallszahl. Diese
        Kennung mit deinem Namen zusammenbringen kann nur, wer den Namen sehen darf: deine
        Lehrkraft und der Verwaltungszugang weiter unten. Wer deinen Namen sonst noch zu sehen
        bekommt, steht unter »Wer was sieht«.
      </p>
      <p>
        DomiGo speichert <strong>keine</strong> E-Mail-Adressen von Kindern und keine IP-Adressen in seiner
        Datenbank. Vercel, das die Anwendung betreibt, führt davon getrennt ein Zugriffsprotokoll —
        was darin steht, sagt der Abschnitt »Beteiligte Dienste«. Es gibt keine Werbung, keine Analyse- oder Tracking-Dienste, und die Schriften kommen
        vom eigenen Server.
      </p>

      <h2 style={h2}>Wie du dich anmeldest</h2>
      <p>
        Angemeldet wirst du nur bei {kontoHost} — einem Konto für alle Werkzeuge. Einen anderen Weg in
        DomiGo gibt es nicht. DomiGo speichert selbst kein Passwort und prüft auch keines. Nach der
        Anmeldung schickt {kontoHost} DomiGo nur, wer du bist, in welcher Klasse du bist und welche Rolle
        du hast; deinen echten Namen schickt es nicht mit.
      </p>
      <p>
        <strong>Aus der Klassenliste</strong> — Vor- und Nachname, Katalognummer und deine Lerngruppe
        trägt deine Lehrkraft aus der Klassenliste ein. Andere Angaben aus der Liste (etwa Geburtsdatum
        oder Adresse) werden gar nicht erst übernommen. Fragen dazu beantwortet deine Lehrkraft.
      </p>

      <h2 style={h2}>Daten von Lehrkräften</h2>
      <p>
        Kürzel und ein Protokoll der Änderungen am eigenen Konto. Aus der früheren DomiGo-Anmeldung
        liegen bei alten Konten noch Spitzname, gegebenenfalls der echte Name, PIN (verschlüsselt),
        freiwillig eine E-Mail-Adresse, damit eine vergessene PIN zurückgesetzt werden konnte, und die
        Zahl der Fehlversuche beim Anmelden und beim Zurücksetzen der PIN, gezählt je Spitzname.
        Angemeldet und das Passwort zurückgesetzt wird nur bei {kontoHost}; DomiGo verschickt keine
        E-Mails.
      </p>
      <p>
        Dazu hält DomiGo fest, wer etwas getan hat: bei einer Aufgabe, einer Änderung an der
        Klassenliste, einer Bewertung, einer Änderung am Übungsstoff und einer Probelösung wird
        die Kennung der Lehrkraft gespeichert — nicht ihr Name. Wird ein Verwaltungs-Link benutzt,
        mit dem sich ein Test-Konto ohne PIN anmelden kann, wird festgehalten, welches Konto damit
        angemeldet wurde und wann. Solche Links gelten nur für die eine Testklasse — für das Konto
        eines echten Kindes funktionieren sie nicht —, sie verfallen nach zehn Minuten und sind nach
        einer Benutzung verbraucht.
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
        <li><strong>Beim Beitreten:</strong> Die Beitrittsseite liegt bei {kontoHost}. Wer den Klassencode hat, landet dort; DomiGo leitet nur weiter und erfährt dabei nichts.</li>
        <li><strong>Ein eigens freigeschalteter Verwaltungszugang</strong> kann alle Klassen aller Lehrkräfte einsehen. Diesen Zugang hat allein {VERANTWORTLICHER}, um die Plattform zu betreuen. Er wird außerhalb der App freigeschaltet, hängt an keinem Lehrkraft-Konto, und ohne Freischaltung hat ihn niemand.</li>
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
        <li><strong>Anthropic PBC</strong> (USA) — Lehrkräfte können eine neue Aufgabe von einer KI probeweise lösen lassen, bevor Kinder sie bekommen. Dabei wird nur die Aufgabe übermittelt, <strong>keine Daten von Kindern</strong>. Die Übermittlung in die USA stützt sich laut Anthropic-Datenschutzerklärung auf Standardvertragsklauseln.</li>
      </ul>

      <h2 style={h2}>Wie lange die Daten bleiben</h2>
      <p>
        Es gibt <strong>keine feste Löschfrist</strong>, und DomiGo löscht nichts von selbst. Dein Konto
        wird gelöscht, wenn deine Schule es bei {kontoHost} veranlasst — dann löscht DomiGo seine Hälfte
        mit, und zwar vollständig: Übungsergebnisse, Texte, Noten, Spielstände und ein gespeicherter
        Jahres-Stand. Auf Wunsch wird es jederzeit gelöscht: schreib an {DATENSCHUTZ_KONTAKT}. Das gilt
        auch für ein Konto aus der früheren DomiGo-Anmeldung. Entfernt deine Lehrkraft dich in DomiGo nur
        aus der Klassenliste, wird allein dein Eintrag in der Klassenliste gelöscht; deine Übungsergebnisse,
        Texte und Noten bleiben, bis dein Konto gelöscht wird.
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
        {DATENSCHUTZ_KONTAKT}. Solche Anfragen — auch eine Löschanfrage — beantworten wir so
        schnell wie möglich, spätestens innerhalb eines Monats.
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
