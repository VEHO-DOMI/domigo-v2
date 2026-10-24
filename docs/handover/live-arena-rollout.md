# CODEX DRAFT — NOT CANON · Live-Duell und Klassenquiz (cgo-123)

Stand: lokaler Prüfungskandidat. Kein Merge, keine Migration gegen Neon, keine Änderung an Vercel-Einstellungen. Freigabe der ausgelieferten Funktion und der Kosten ist Aufgabe der GG-Kette.

## Was vorbereitet ist

Live-Duell: fünf getippte Fragen aus freigegebenen Chapters, Übersetzung/Definition/Lückensatz, Einladung innerhalb der berechtigten Klasse. Einladung maximal 30 Sekunden; das Annahmefenster des eingeladenen Kindes schließt zusätzlich 25 Sekunden nach dem ersten Anzeigen. Je Antwort 15 Sekunden, vier Sekunden gemeinsamer Vorlauf. Richtig schlägt falsch; bei zwei richtigen Antworten zählt die serverseitige Zeit, Gleichstand bleibt unentschieden. Ein uneinholbarer Vorsprung beendet das Duell vorzeitig.

Klassenquiz: zuständige Lehrkraft öffnet einen Raum mit sechs Zeichen, wählt Chapters, Aufgabentyp und 5/10/15 Fragen. Maximal 40 Kinder derselben Klasse treten bei. Die Lehrkraft startet und schaltet zwischen Fragen weiter. Richtige Antworten bringen `max(500, floor(1000 - verstricheneMillisekunden / 15000 * 500))` Spielpunkte, falsche Antworten null. Verspätete Antworten werden nicht angenommen. Spielpunkte und normale Antwort-XP werden getrennt angezeigt.

Alle Bewertungen erfolgen über `/api/attempts`. Aufgabe, Antwortpool, Jahrgang und Antwortdauer stammen vom Server. Raumbeleg und vorhandene XP-Buchung werden gemeinsam gespeichert oder gemeinsam verworfen. Keine zusätzlichen Live-Ergebnisboni, keine Umrechnung von Quiz-Spielpunkten in XP. Ein Inhaltsfingerabdruck verhindert, dass eine nach Raumerstellung überarbeitete Aufgabe mit einem alten Fragetext bewertet wird.

## Bewusste Grenzen gegenüber der alten Oberfläche

- Es gibt keine neue Online-Anwesenheitsliste. Die Einladung verwendet die bereits berechtigte Klassenliste; niemand wird als „online“ bezeichnet. Ein dauerhaftes Anwesenheitsmerkmal wäre eine zusätzliche personenbezogene Datenkategorie und braucht einen gesonderten GG-Entscheid.
- Live-Ergebnisse sind im eigenen Raum erreichbar. Der bestehende Word-Duel-Verlauf und dessen Statistik erhalten in dieser Karte keine Live-Historie oder zusätzlichen Zähler. Die alten Sonderboni und `giantKills` sind ebenfalls nicht übernommen.
- Die serverseitige Wertung benutzt keine vom Browser behauptete Zeit. Die zweisekündliche Abfrage kann die Anzeige zwischen Geräten um bis zu einen Abfragetakt versetzen; sie garantiert keine identische Bildschirm-Verzögerung. Vier Sekunden Vorlauf reduzieren diesen Nachteil, beseitigen Netzverzögerungen aber nicht.
- Die Speicherstrukturen und Antwortdauer sind im bestehenden Spaltenregister dokumentiert. Keine Namen, Rohantworten oder Anwesenheitsdaten werden zusätzlich gespeichert. Beim Löschen eines Kontos beziehungsweise einer Klasse entfernen Fremdschlüssel die betroffenen Räume/Teilnahmen. Die Kontoverwaltung und Datenschutzseiten bleiben unangetastet.

## Freischaltung und Rückfall

`DOMIGO_LIVE_ARENA` bleibt standardmäßig ohne Freischaltung. Nur der ausdrücklich gesetzte Wert `approved-under-20-usd` öffnet die neuen Wege. Das Entfernen dieses Schalters schließt sie wieder; Word Duel bleibt nutzbar. Dieser PR ändert keine Umgebungsvariable. Fehlende Tabellen und Datenbankfehler liefern eine anonyme 503-Antwort; der Browser stoppt weitere Abfragen und zeigt den Rückweg zur Arena.

Die GG-Kette prüft zunächst den gesamten gestapelten Stand. Dann:

1. Migration `packages/db/drizzle/0025_live_arena.sql` in der vorgesehenen Testumgebung prüfen und über den zuständigen Sitz anwenden. Die lokale Prüfung führt sie zweimal aus und vergleicht Spalten, Fremdschlüssel, Prüfbedingungen und Indizes mit `0025_snapshot.json`. Codex führt keine echte Neon-Migration aus.
2. In einer isolierten Testbereitstellung mit erfundenen Konten den Schalter ausschließlich für den begrenzten Messlauf setzen. Eine Klasse, 25 Kinder und eine Lehrkraft, keine echten Klassenlisten oder Schülerdaten exportieren. Den aktuellen Code-Kopf im Messbericht festhalten.
3. Die Weboberflächen und die tatsächlichen Vercel-Messwerte kontrollieren. Erst nach dokumentierter Kostenfreigabe unter 20 USD pro festgelegtem Zyklus die reguläre Freischaltung erwägen. Bei fehlenden Messwerten oder mindestens 20 USD bleibt der Rückfall Word Duel.

## Messlauf und ehrliche Kostenprüfung

Die Zahl von ungefähr 11.000 Aufrufen in Karte cgo-120 stammt rechnerisch aus **15 Minuten** (25 × 30 × 15 = 11.250), obwohl dort „je Quiz-Stunde“ steht. Für eine Stunde sind es 45.000 Kinder-Abfragen plus 1.800 der Lehrkraft.

Der ausgeführte lokale Test des tatsächlichen Abfrage-Controllers zählt bei 25 Kindern plus einer Lehrkraft über eine simulierte Stunde **46.800 regelmäßige Abfragen**: 26 × 1.800. Das ist eine Aufrufmessung des lokalen Controllers, keine Messung von Vercel-Abrechnung, echter Netzwerkgeschwindigkeit, CPU-Zeit oder Neon-Kosten. Versteckte Tabs pausieren, geschlossene Räume und terminale Fehler stoppen, langsame/fehlerhafte Verbindungen erzeugen keine überlappenden Abfragen. Zusätzlich fallen Seitenaufrufe, Beitritte, Start/Weiter-Aktionen und Antworten an.

Für die Kostenrechnung zählt der GG deshalb die **gesamten** Funktionsaufrufe des abgegrenzten Testlaufs in Vercel, einschließlich `/api/attempts` und Seitenaufrufen. Die anonymen Logmarkierungen `[live-arena] poll` und `[live-arena] action` helfen bei der Zuordnung; sie ersetzen die Abrechnungsmessung nicht. Keine Benutzerkennungen, Raumcodes oder Antwortinhalte in den Messbericht übernehmen.

Die offiziellen Vercel-Unterlagen nennen neben Aufrufen auch aktive CPU-Zeit, belegten Speicher und regionsabhängige Preise. Plan, Region, Fluid-Konfiguration und tatsächliche Freikontingente dieses Kontos wurden hier nicht ausgelesen. Daher werden weder ein Freikontingent noch ein Gesamtpreis behauptet. Quellen, geprüft am 24.10.2026: [Functions Usage and Pricing](https://vercel.com/docs/functions/usage-and-pricing), [Vercel Functions](https://vercel.com/docs/functions).

Eine anonymisierte JSON-Datei außerhalb des Repos enthält:

```json
{
  "measuredAt": "",
  "cycleDefinition": "",
  "plan": "",
  "region": "",
  "measurementEvidence": "",
  "rateEvidence": "",
  "quizHoursPerCycle": null,
  "invocationsPerQuizHour": null,
  "activeCpuHoursPerQuizHour": null,
  "memoryGbHoursPerQuizHour": null,
  "transferGbPerQuizHour": null,
  "otherCycleUsd": null,
  "headroomMultiplier": null,
  "rates": {
    "invocationsPerMillionUsd": null,
    "activeCpuHourUsd": null,
    "memoryGbHourUsd": null,
    "transferGbUsd": null
  }
}
```

`cycleDefinition` benennt den freigegebenen Zyklus und dessen Zeitraum beziehungsweise Nutzungsumfang. Das Programm bezeichnet damit ein abnehmbares Bündel; dieses Werkzeug unterstellt ausdrücklich keinen Kalendermonat. Der GG ordnet Bau- und Nutzungskosten demselben festgelegten Zyklus zu.

`otherCycleUsd` enthält sämtliche übrigen Kosten desselben Zyklus, auch Datenbank, Logging, sonstigen Plattformverkehr und gegebenenfalls Grundkosten. `headroomMultiplier` ist ein ausdrücklich gewählter Puffer von mindestens 1. Das Werkzeug berechnet Bruttokosten ohne unterstellte Freikontingente und rundet konservativ auf volle Cent auf. Die Zahlen sind keine Vorgabe; null bedeutet **unbekannt**, nicht kostenlos.

```sh
node scripts/check-live-cost.mjs --measurement /absoluter/pfad/messung.json
node scripts/check-live-cost.mjs --selftest
```

Exit 0 = unter der Grenze anhand der eingetragenen Belege; Exit 1 = Word-Duel-Rückfall; Exit 2 = UNVERIFIZIERT. Das Werkzeug ändert keine Einstellung. Der Messbericht muss die Herkunft der Zahlen und den Umfang des Zyklus prüfen; ein rechnerisch grüner Bericht verifiziert keine erfundenen Eingaben.

## Gezielte lokale Prüfungen

```sh
pnpm --filter @domigo/db exec vitest run src/live-rules.test.ts src/live-service.pglite.test.ts
pnpm --filter web exec node --import ./scripts/lib/alias-register.mjs --test lib/arena/live-poll.test.ts lib/arena/live-route.test.ts
node scripts/check-live-display.mjs --out /absoluter/pfad/bilder
node scripts/check-live-display.mjs --selftest --out /absoluter/pfad/gegenproben
node scripts/check-live-flow.mjs --out /absoluter/pfad/mehrfenster
node scripts/check-claim-filter.mjs
node scripts/check-claim-filter.mjs --selftest
```

Der Mehrfenster-Test verbindet die tatsächlichen React-Oberflächen, Routen, Bewertungsfunktionen und SQL-Abfragen mit einer ausschließlich lokalen PGlite-Datenbank. Er ersetzt keine Prüfung echter Anmeldungen, mehrerer unabhängiger PostgreSQL-Verbindungen, ausgelieferter Migrationen oder der Vercel-Abrechnung. Dafür bleibt eine GG-Folgeaufgabe erforderlich. Die lokalen Browseradressen benutzen HTTPS, damit die Browserfunktion für zufällige Versuchkennungen wie in der echten Bereitstellung verfügbar ist; alle Antworten kommen aus dem isolierten Test.

**Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.**
