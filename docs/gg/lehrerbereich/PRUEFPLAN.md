# Prüfplan · Lehrerbereich

CODEX DRAFT — NOT CANON · cgo-041. **Nicht ausgeführt.** Installation, Bau, Server, Browser und Pflichtbatterie benötigen eine neue eigene GG-Zuteilung.

Die Liste wurde aus allen 16 Paketdateien des eigenen Baums erzeugt; 29 unterschiedliche Pflichtaufrufe. Arbeitsordner für alle folgenden Zeilen: `/Users/veho/Code/_codex/cgo-041`. `pnpm` ist die Paketverwaltung dieses Projekts; `content` ist dessen tatsächlich vorhandener Inhaltsbefehl.

| Nr. | Exakter Befehl | Herkunft |
|---|---|---|
| 1 | `pnpm install --frozen-lockfile` | `package.json / Karte cgo-041` |
| 2 | `pnpm build` | `package.json / Karte cgo-041` |
| 3 | `pnpm typecheck` | `package.json / Karte cgo-041` |
| 4 | `pnpm lint` | `package.json / Karte cgo-041` |
| 5 | `pnpm test` | `package.json / Karte cgo-041` |
| 6 | `pnpm run check:bundle` | `package.json` |
| 7 | `pnpm run check:paint-art` | `package.json` |
| 8 | `pnpm run check:body-silhouette` | `package.json` |
| 9 | `pnpm run check:ground-plane` | `package.json` |
| 10 | `pnpm run check:ground-plane:selftest` | `package.json` |
| 11 | `pnpm run check:body-silhouette:selftest` | `package.json` |
| 12 | `pnpm run check:game-tasks` | `package.json` |
| 13 | `pnpm run check:paint-copy` | `package.json` |
| 14 | `pnpm run check:level-design` | `package.json` |
| 15 | `pnpm run check:roster-twins` | `package.json` |
| 16 | `pnpm run check:roster-twins:selftest` | `package.json` |
| 17 | `pnpm run check:journal-door` | `package.json` |
| 18 | `pnpm run check:journal-door:selftest` | `package.json` |
| 19 | `pnpm run check:level-design:selftest` | `package.json` |
| 20 | `pnpm run test:vercel-ignore-build` | `package.json` |
| 21 | `pnpm run test:umbrella-tokens` | `package.json` |
| 22 | `pnpm run test:claim-filter` | `package.json` |
| 23 | `pnpm run test:claim-filter:selftest` | `package.json` |
| 24 | `pnpm run test:no-local-login` | `package.json` |
| 25 | `pnpm run test:no-local-login:selftest` | `package.json` |
| 26 | `pnpm content validate` | `package.json content → packages/content-pipeline/src/content.ts` |
| 27 | `pnpm content validate-story` | `package.json content → packages/content-pipeline/src/content.ts` |
| 28 | `pnpm content validate-listening` | `package.json content → packages/content-pipeline/src/content.ts` |
| 29 | `pnpm content validate-test` | `package.json content → packages/content-pipeline/src/content.ts` |

`pnpm test` umfasst über `scripts/test-workspace.mjs` auch die drei neuen Testdateien in `apps/web/lib/`. Eine fehlgeschlagene Pflichtprüfung stoppt den Lauf sofort; keine stillen Wiederholungen, keine weiteren Befehle hinter einem Fehler. Rohlogs, Laufzeiten und Exit-Codes gehören in die externe Belegwurzel und den Board-/PR-Bericht.

**GG-N5 klärt die Stoppgrenze:** Das vorhandene `scripts/test-workspace.mjs:40–50` darf intern seine serielle Paketübersicht beenden und meldet danach den Fehlercode. Die Stoppregel gilt am äußeren Pflichtbefehl: Nach beispielsweise `pnpm test` mit Exit1 darf kein nächster Pflichtbefehl anlaufen. Alle Paket-Einzelergebnisse bleiben im Log erhalten. Kein Umbau des fremden Skripts und keine neue schwere Freigabe durch diese Klarstellung.

## Gezielte Kontrollen nach Installation

Noch nicht gelaufene Komponenten- und Originalleserprüfung, falls GG sie vor der Gesamtbatterie gesondert zuteilt:

```sh
# Arbeitsordner: /Users/veho/Code/_codex/cgo-041/apps/web
node --import ./scripts/lib/alias-register.mjs --test lib/lehrerbereich-readers.test.ts lib/lehrerbereich-render.test.ts
```

Die bereits gelaufene leichte Prüfung heißt `node --test apps/web/lib/lehrerbereich.test.ts` im Repo-Wurzelordner. Ihre Befunde ersetzen keine Render-, SQL- oder Anmeldungskontrolle. Die Originalleserprüfung benutzt ausdrücklich einen synthetischen Transport, der die real kompilierten Abfragebedingungen auswertet; sie ist keine echte SQL-Datenbank.

## Tatsächliche Browser- und SQL-Abnahme

Voraussetzung: angenommener, neu gepinnter cgo-009-Prüfstand plus ausdrücklich eigener GG-Platz. Ohne diese Eingänge wird kein Server gestartet und kein Anmeldebeweis behauptet. Der endgültige Startbefehl, seine isolierte Datenwurzel und lokale Ports müssen vor dem Lauf an diesen angenommenen Eingang gebunden werden; heute existiert dafür keine Freigabe.

- Vorher und Nachher am ursprünglichen und am neuen Produktstand: 390×844 und 1440×900, hell/dunkel; echte geladene DomiGo-Schriften; Bilder mit Zustand, Aktion, Dateipfad und MD5. Keine Namen außer synthetischen Kennungen.
- Lehrkraft anmelden → eigene vier Klassen → reale Klassendetailseite → vorhandene Verwaltungs-/Schreib-/Höraktion → zurück; Neuaufruf. Die vier Klassen sind synthetische Eingaben, kein Produkt-Fallback.
- 0/1/4 Klassen, Archiv, bestätigte synthetische Testklasse; aktiver und archivierter Teilausfall sowie Vollausfall. Echter absichtlich ausgelöster Datenbanklesefehler muss die konkrete Fehleranzeige erreichen.
- Fremde Klasse trotz bekanntem URL und breite Großmeisterrechte: normale Liste bleibt eigentümergebunden. Fehlender Zugriff darf keine Namen liefern.
- Tastaturweg, sichtbarer Fokus, Lesbarkeit/Kontrast, Umbruch/Überlauf, reduzierte Bewegung, Beitrittscode erfolgreich kopieren und Kopierfehler.
- Echte Gegenproben: Navigationsweg entfernen; Abfragefehler zu leer umdeuten; fremde Klasse einschleusen; unbekannte Fähigkeit aktiv anbieten. Nur eigene Testbytes sichern/verändern/wiederherstellen. Pure Gegenproben belegen jeweils nur ihre tatsächlich geprüfte Schicht.
- N2: fehlender Marker bleibt unbekannt; „Test“ im Namen ist kein Marker; Datum wird nie Schuljahr; unbereinigte Profilzahl erscheint nicht als Kinderzahl.
- N5: Tatsächlich geworfene Identitätsausnahme führt zum sichtbaren Zugangsfehler. Die intern verschluckte Großmeister-Scope-Abfrage ist separat009/GG zugeordnet; ihre Reparatur und echte Fehlerprobe müssen vor Gesamtannahme/Messzugang/Pilot angenommen sein. Keine Ersatzannahme aus den synthetischen Komponenten dieser Karte.

## Performance-Vertrag

Die vollständige Dateiliste wird bei eingefrorenem Kopf extern gespeichert. Vorgesehener Diff: zwei Lehrer-Einstiege, Klassenlisten-Darstellung, ausschließlich seitengebundene Komponenten/Stile/Helfer, direkte Tests und diese Dokumente. Kein Spielmotor, keine Spielroute, kein globaler Stil, kein Asset und kein Karten-DOM geändert. `scripts/check-perf-table.mjs` beobachtet `packages/game-paint/`, `game-2d/`, `game-core/`, `apps/web/public/art/` und `apps/web/app/(game)/`; diese Pfade bleiben unberührt. Daher keine erfundene Fünfphasen-Spielmessung. Die neue Lehrerfläche muss dennoch im echten Browser auf schnelle Bedienung und unnötige Datenaufrufe geprüft werden. Die tägliche Klassenansicht liest weder Korpusvorschauen noch globale Spielstatistiken; diese werden nur an ihrer ausdrücklich geöffneten Tür abgefragt.
