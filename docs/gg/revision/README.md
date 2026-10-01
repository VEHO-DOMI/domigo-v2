# Revision W0 · ausführbare Kalibriergrundlage

**CODEX DRAFT — NOT CANON · cgo-006.** Ausgang und PR-Ziel: `codex/main`,
Ursprungsbasis `df258ae8952cf5e5747e7507759d4d7b61e094b5`; nach Nachtrag 6
Integration von `269ee986ccdc1ae7c3b070cbed7014f20e532365`. Diese Grundlage zählt den
Dateikorpus, bindet Belege an konkrete Aufgabenfassungen und liefert zwei kleine
Muster. Sie ändert weder Aufgaben noch Bewertung, Schülerfreigaben oder Datenbank.
Eine bestandene Selbstprüfung ist kein fachliches Qualitätssiegel.

**Nachtrag 11:** Kokis Nein zum sprachlich/didaktischen Gestaltungsmuster bleibt
maßgeblich. Die [Anforderungslücken](ANFORDERUNGSLUECKEN.md) ordnen neue Regel,
ursprüngliche Zusagen und tatsächliche W0-Belege zu. Die
[DomiLingo-Fehlergeschichte](DOMILINGO-LEHREN.md) begründet Prüfschritte mit festen
Originaldateien. Das Löserpaket bleibt unverändert; PR 472 liefert eine
Quellen-/Prüfgrundlage, kein fachliches Serien-Ja.

**Nachtrag 12:** Die zweite [Leserzusammenführung](BEFUNDE-N12.md) bewahrt alle
77 Kandidaten aus cgo-030/031 am unveränderten neuen Paket. 030 sagt Nein, 031
ein begrenztes Ja; GG bestätigt p017 als Sperre vor unveränderter Musterübernahme.
Kein Gesamt-Ja und keine automatische Schlüsselergänzung. N9 ist ausdrücklich
ausgesetzt; ein schwerer Restversuch braucht eine neue GG-Zuteilung am fertigen Kopf.

**Historischer Nachtrag 6:** Beide damaligen Inhaltsleser sagen Nein zur unveränderten
Kalibrierung. Das vollständige [Befundregister](BEFUNDE.md) und der
[Entscheidungs-/Prüfweg](BEFUNDWEG.md) bewahren alle Antworten, Originalbefunde
und gezielten Korrekturvorschläge. Nur der eigene Transfer p010 wird erweitert.
Inhalts-/Serienfreigabe bleibt gesperrt; alte grüne Mechanik ist kein neues Ja.

## Bestand und Geltungsbereich

Neu durch `loadUnit` geladen, mit `applyItemFixes(readUnitItems(...))` nach Inhalt
und vollständiger Kennungsliste abgeglichen: **57/57 Units, 5.898 Unit-Aufgaben**.
Davon sind 2.446 Vokabeln und 3.452 Grammatikaufgaben. Die vier Vokabelpools –
getrennte Antwortvorräte für Kontextlücke, Definition, Deutsch→Englisch und
Englisch→Deutsch – ergeben zusammen mit Grammatik **13.236 Grundansichten**.
Das sind Ansichten, keine vervierfachte Aufgabenzahl. Hinzu kommen 341 alternative
Tippeingaben und 22 hinterlegte Präsentationsvarianten; Letztere sind kein Beweis
ihrer Verwendung in einer aktuellen Geschichte.

| Grammatikformat | Aufgaben | Vom bisherigen Blind-Solve-Pfad übersprungen? |
|---|---:|---|
| anagram | 109 | ja |
| context-picker | 194 | nein |
| error-correction | 443 | nein |
| free-form | 25 | nein |
| gap-fill | 983 | nein |
| group-sort | 144 | ja |
| matching | 121 | ja |
| matching-pairs | 55 | ja |
| multiple-choice | 429 | nein |
| question-formation | 110 | nein |
| sentence-building | 232 | ja |
| transformation | 320 | nein |
| translation | 287 | nein |

Damit fehlen dort 661 Grammatikaufgaben. Bei Vokabeln prüft der bisherige Pfad nur
`carrier`, also die Kontextlücke; 7.338 andere Richtungsansichten fehlen. Die
vorhandenen `g*.dry.json` sind Schlüssel-Selbstprüfungen, keine unabhängigen Urteile.

Paint bleibt ein eigener Bestand: **199 Karten in sechs v2-Kapiteldateien**;
`choice` 131, `match` 7, `memory` 3, `mistake` 8, `oddone` 9, `order` 13,
`restore` 16, `spell` 4, `typed` 3, `wheel` 5. Die ältere parallele Datei
`ch01.tasks.json` wird nicht nochmals gezählt. Zusätzlich erfasst das Register
365 Geschichts-Aufgabenplätze und 14 Hör-/Testdateien. Diese Mengen werden nicht
als zusätzliche, bereits vollständig geprüfte Unit-Aufgaben ausgegeben.

Das Rohregister enthält je Unit-Aufgabe Kennung, Unit, Lernziel, Quellpfad und
Quellstatus, Inhalts-/Antwort-/Ansichtsprüfsummen, alte Zustandsbelege und den
bisherigen Prüfpfad. Paint und Geschichten stehen getrennt darin. Alle Listen
entstehen mit `scripts/gg-revision/census.mjs`; keine kopierte Inventurliste.

## Reproduzieren

Node 24 und die vorhandenen Projektabhängigkeiten verwenden. Keine neue Bibliothek.
Installation, Produktbau und Pflichtbatterie benötigen den ausdrücklich zugeteilten
GG-Prüfplatz. Alle Ausgaben gehören außerhalb des Produktrepos, beispielsweise in
`/Users/veho/Code/_codex/cgo-006-evidence`. Befehle vom eigenen Repo-Wurzelordner aus:

```sh
REV_EVIDENCE=/Users/veho/Code/_codex/cgo-006-evidence
REV_SOURCES='/Users/veho/Library/Mobile Documents/com~apple~CloudDocs/Domi Gym/Domi Gym 2025:26'
python3 scripts/gg-revision/source-scan.py --source-root "$REV_SOURCES" --out "$REV_EVIDENCE/source-register.json"
node --test scripts/gg-revision/core.test.mjs scripts/gg-revision/solver-packet.test.mjs
node --import ./scripts/gg-revision/register.mjs scripts/gg-revision/census.mjs "$REV_EVIDENCE/source-register.json" "$REV_EVIDENCE/census.json"
node --import ./scripts/gg-revision/register.mjs scripts/gg-revision/prepare-views.mjs "$REV_EVIDENCE/views"
node scripts/gg-revision/serve.mjs "$REV_EVIDENCE/views"
```

Der letzte Befehl meldet eine freie lokale Adresse. In einem zweiten Terminal:

```sh
node scripts/gg-revision/capture.mjs http://127.0.0.1:PORT "$REV_EVIDENCE/screenshots" "$REV_EVIDENCE/views"
node --import ./scripts/gg-revision/register.mjs scripts/gg-revision/verify.mjs "$REV_EVIDENCE/source-register.json" "$REV_EVIDENCE/views" "$REV_EVIDENCE/verification.json" "$REV_SOURCES"
```

`PORT` durch den ausgegebenen Port ersetzen. Der eigene Aufnahmeprozess beendet
seinen Browser; den lokalen Server danach mit Ctrl-C beenden. Die Aufnahme friert
auch den zweiten Schritt der Restore-Karte ein. Erst danach ist das Löserpaket
vollständig. Änderungen an Werkzeugen, Komponenten, Quellen oder Ansichten
erfordern neue Prüfsummen und neue zugehörige Urteile.

Der Export verlangt einen frischen Ausgabeordner, damit kein alter sprechender
Dateiname liegen bleibt. `verify.mjs` prüft den gesamten öffentlichen Ordner und
`private-mapping.json`, die private Zuordnung zu den echten Aufgaben. Nach dem
Packen zusätzlich die Archiveinträge und ihre Bytes prüfen:

```sh
python3 scripts/gg-revision/check-archive.py "$REV_EVIDENCE/views/solver" "$REV_EVIDENCE/solver.zip"
```

**Seit Nachtrag 21 ist die Übernahme eines alten Folgezustands gesperrt.**
Der frühere Aufruf mit `--reuse-unchanged-state` wird abgewiesen. Die damalige
N8-Übernahme bleibt als historischer Beleg erhalten; sie ist kein neuer
Bediennachweis. Ein neuer Export benötigt eine neue beobachtete Namenswahl mit
Vorher-/Nachheransicht und den Vergleich gegen den tatsächlichen Zustandswechsel.
Siehe [PRUEFSCHUTZ.md](PRUEFSCHUTZ.md) für Vertrag, Grenzen und Restprüfungen.

`register.mjs` ist ein Adapter für das isolierte Lesen: Er löst vorhandene
Workspace-Pakete auf und übersetzt TSX, also Komponenten mit eingebauter
Ansichtsbeschreibung, nur im Speicher. `server-only` wird ausschließlich für
diesen lokalen Lauf überbrückt. Es entsteht kein neuer Produktendpunkt.

## Löserübergabe und Sperre

Je Pilot neun vorhandene Aufgaben plus eine Transferfrage, insgesamt 20. Nur den
Ordner `views/solver/` an die beiden getrennten Löserkarten geben. Öffentliche
Kennungen heißen `p001` usw.; auch Zustands- und Bildnamen sind neutral. Die Dateien
`private-mapping.json`, `private-asset-map.json`, `private-data.json`, `browser.js`, `private-view-manifest.json`, `pilots.json`, das
Rohregister und Selbstprüfberichte enthalten Autorwissen und bleiben beim GG.

Die schlüsselfreien HTML-Seiten verwenden die echten Aufgabenkomponenten samt
Stilen und benötigten Bildern, aber keine ausführbaren Skripte. Buttons sind dort
absichtlich ohne Funktion; Antworten werden separat notiert. Der lokale private
Prüflauf verwendet dieselben Komponenten interaktiv. Weder Ansicht simuliert
gespeicherten Lernfortschritt. Geprüft werden initiale Ansichten und ausdrücklich
festgelegte Folgezustände, nicht jeder mögliche Hilfe-/Fehlerzustand aller Formate.

GG beauftragt zwei unabhängige, von Koki gestartete Löser. Beide erhalten dasselbe
Paket, lösen ohne Schlüssel und nennen auch weitere plausible Antworten sowie
Verständnisprobleme. Das technische Antwortformat und die nachgelagerte Bewertung
stehen in [PILOTEN.md](PILOTEN.md). Anschließend folgen Quellengegenlesen,
Klärung von Abweichungen und Kokis Urteil zu Register und Beispielen. Keine Welle
oder Veröffentlichung aus einem Datum, einer Selbstprüfung oder bloßer Zustellung.

**Nachtrag 4: Der erste Export wurde vom GG zu Recht gesperrt.** Sechs englische
Zielwörter standen in Dateinamen, Links und öffentlichen Item-Kennungen. Die frühere
Behauptung „schlüsselfrei“ für Paket
`5c5217d07a86cfe884bbbbec721b42e6aa5dc86784848dff4b4974b75cc203cd`
ist zurückgenommen; dieser Stand darf nicht an Löser gehen. Niemand hatte ihn
unabhängig gelöst. Das korrigierte Schema `revision-solver-packet@2` prüft
Dateinamen, Manifest, HTML-Metadaten, Links, Assets und die private Zuordnung
gemeinsam; `check-archive.py` prüft das daraus erzeugte Archiv. Die unabhängige
Prüfung 037 fand später vier zusätzliche Lücken an Kopf `38f95000…` (S1–S4).
Deren ursprünglicher Neinbericht bleibt erhalten. Nachtrag 21 ergänzt deshalb
vollständige Feldtypen, einen geschlossenen Darstellungsvergleich, Verzeichnisse
und die echte Zustandslogik. Die Korrektur ist noch keine technische Abnahme;
[PRUEFSCHUTZ.md](PRUEFSCHUTZ.md) hält den vollständigen Rest fest.

## Grenzen

- Datenbank-Ergänzungen über `apps/web/lib/content-service.ts` wurden nicht gelesen:
  Der aktuelle Live-Gesamtbestand bleibt **UNVERIFIZIERT**.
- Hör-/Test-Gesamtansichten, Audio, vollständige Geschichten, Live-Szenenbilder,
  Lernspur, Wiederholungsplanung und gespeicherte Ergebnisse: **UNVERIFIZIERT**.
- Die 199 Paint-Startansichten sind isolierte echte Karten. Szenenabhängige Karten
  benötigen zusätzlich ihren echten Szenenzustand; ein leeres Szenenbild ist keine Abnahme.
- Alte fachliche Belege bleiben erhalten. Ein abweichender Gesamt-Korpusfingerabdruck
  entwertet nicht automatisch ein unverändertes, früher geprüftes Einzelitem.
- Es wurden keine produktiven Renderdateien oder Bilder verändert. Der
  PERF-Wächter wurde gelesen; aus isolierten Kartenbildern wird keine Aussage
  über Bildrate oder Performance der fünf Spielphasen abgeleitet.

Weitere Grundlagen: [QUELLENREGISTER.md](QUELLENREGISTER.md),
[ITEM-SIEGEL.md](ITEM-SIEGEL.md), [ORIGINALVERGLEICH.md](ORIGINALVERGLEICH.md),
[ERBE.md](ERBE.md). Der ergänzende Erbe-Abgleich verbindet jede vorhandene
Reviewzeile mit ihrer heutigen Fassung, ohne alte Belege zu überschreiben.
