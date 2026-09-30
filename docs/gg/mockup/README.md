# DomiGo · ein Blatt zum Anfassen

**CODEX DRAFT — NOT CANON · cgo-007 · nur Lehrer-Muster.**

Ein vollständiger Weg: Einstieg → Wort erkennen → Kurzform wählen → Rückmeldung → erneut üben. Bs Heftpapier trägt As farbige Aufgabenkarte. Fredoka aus dem freigegebenen Repository bleibt die Schrift für Antippbares; Georgia ersetzt die dort fehlende Literata. Keine neue Kunst, keine produktive Route, keine Paketabhängigkeit.

## Starten

Node 24 oder neuer reicht. Dieser Befehl baut das Muster aus den gepinnten Quellen in einen temporären Ordner und startet es ausschließlich auf diesem Rechner:

```sh
node /Users/veho/Code/_codex/cgo-007/docs/gg/mockup/serve.mjs --port 4177 --out /Users/veho/Code/_codex/cgo-007-evidence/preview
```

Solange der Befehl läuft: `http://127.0.0.1:4177`. Beenden mit Strg+C. Der Koordinator kann in seinem eigenen Klon denselben relativen Befehl `node docs/gg/mockup/serve.mjs --port 4177` ausführen. Ein alleiniger localhost-Link ist keine Übergabe. Koki erhält seine erreichbare Urteilskarte erst nach dem Sichtpass des GG.

Separat bauen: `node docs/gg/mockup/build.mjs --out /absoluter/pfad/preview`. Gebauten Stand starten: `node docs/gg/mockup/serve.mjs --no-build --out /absoluter/pfad/preview --port 4177`. Im gebauten Ordner dürfen Dateien nicht manuell editiert werden; nach einer Quellenänderung neu bauen und Server neu starten.

## Die fünf Auftragspunkte

1. **Quelle und Weg:** Basis `df258ae8952cf5e5747e7507759d4d7b61e094b5`; angenommene Richtung aus welle-057 am Boardstand `a4c0ff4075e352bc33631a0ac91c1484bcddbcde`. `source-pins.json` bindet die tatsächlich gelesenen Dateien mit MD5 (Fingerabdruck der Bytes). `build.mjs` verweigert fehlende oder geänderte Eingänge.
2. **Ansichten:** 390/1440 Pixel, hell/dunkel und reduzierte Bewegung. Die Lehrerleiste benennt jeden Zustand, die Schülerfläche bleibt Englisch. Genau eine hervorgehobene Aktion pro Lernschritt; während des Wartens keine aktive Abschlussaktion. Fehler → Auswahl erhalten → erneut versuchen.
3. **Zwei reale Aufgaben:** `content/corpus/units/g1-u01/vocab.json`, `g1u01.w.book`, Revision 2, Definitionsansicht `d` mit vollständigem `dAnswers` und den drei bestehenden `mc`-Ablenkern. `grammar.json`, `g1u01.gi.contractions.mc.006`, Revision 1, vollständige Antwort-/Ablenkerauswahl. Deutsche Frage „Welche Kurzform gehört zu it is?“ → „Which short form means ‘it is’?“; Erklärung sinngleich übersetzt. Ergänzender Kontext „It is a book.“ verbindet beide Schritte. Schlüssel und Korpus bleiben unverändert. Die lokale Bewertung vergleicht ausschließlich die vier festen Auswahlwerte; sie ist kein Ersatz für den produktiven Bewerter. Keine Antwortmarkierung im anfänglich ausgelieferten Aufgabenmaterial; private Schlüsseldatei wird nicht über HTTP ausgeliefert. Die Lehrer-Simulatorfunktion ist ausdrücklich keine sichere Prüfungsumgebung.
4. **Wiederöffnen:** Auswahl, Ansicht, Erscheinungsbild und ausdrücklich gespeicherte Notiz bleiben in `localStorage` (Speicher dieses Browsers). Notizentwürfe werden zusätzlich zur Wiederherstellung gesichert, bleiben aber als ungespeicherte Änderungen markiert, bis „Notiz lokal speichern“ gewählt wird. Bei ungespeichertem Text oder Speicherfehler fordert `beforeunload` die Browserwarnung an; Browser können sie insbesondere auf Mobilgeräten unterdrücken. Deshalb wird auch ein unbestätigter Entwurf beim Wiederöffnen sichtbar wiederhergestellt. Ein Klick innerhalb des Musters verliert keinen Notiztext. Der nachgestellte Lernspeicher ist davon unabhängig und speichert niemals Lernpunkte.
5. **Prüfen:** `node docs/gg/mockup/check.mjs` prüft Quellenbindung, acht Auswahlbewertungen, Geheimhaltung des Schlüssels und tatsächlich gebaute Auslieferung. Sicht-/Bedienpass und zwei geforderte Gegenproben stehen im Boardbericht und PR, Rohlogs/Bilder außerhalb des Repos. Die volle Produktbatterie ist zusätzlich erforderlich, erst nach reserviertem Prüfplatz.

## Kunst, Schrift und Grenzen

Unveränderte Dateien aus der Basis: `apps/web/public/art/g1/paint/ch01/obj_book_a.png` (Buch als Wortbedeutung), `klecks_mentor.png` (Einladung in den Lernweg), `apps/web/app/fonts/fredoka-var-latin.woff2` und dessen Lizenzhinweis. Nichts aus dem historischen Referenzordner importiert. Bildaufträge: keine; Ansichtsaufnahmen dokumentieren die tatsächliche Aktion statt eines Generierungs-Prompts.

Die private Quelldatei im Build dient dem lokalen Server. Er liefert nur seine feste Dateiliste aus, bindet nur an `127.0.0.1` und hat keinen Datenbankzugang. Notizen enthalten keine Schülerdaten. Ein Start auf einem anderen Port oder in einem anderen Browser benutzt einen anderen lokalen Speicher.

Der Spiel-Renderer und alle fünf Paint-Phasen sind unverändert. GG-DomiGo hat in Nachtrag 2 zu cgo-007 am 30.09.2026 die Fünf-Phasen-Tabelle für diesen konkreten isolierten Acht-Dateien-Diff als **nicht anwendbar** eingeordnet: Das Muster besitzt keine Paint-Phasen. `docs/PERF_WAECHTER.md` bleibt für den späteren produktiven Einbau bindend. Statt erfundener Spiel-Messwerte werden Baukennung, einzelne Dateigewichte, Bildabmessungen und die sichtbaren Musterprüfungen berichtet. Ein ausgenommenes Phasentor ist kein Leistungsnachweis. Dieses Muster beweist weder die produktive Speicherung noch mobile Browserwarnungen, echte Touchgeräte, das Geschmacksurteil oder eine unabhängige Prüfung. Es öffnet keine Serienwelle.


## Originalbedienung: begrenzter Vergleich (Nachtrag 3)

Die integrierte Studie `docs/handover/design-study-og-trainers.md` vom **13.07.2026** ist eine historische Quelle, kein heutiger Live-Nachweis. §6 benennt Multiple Choice ausdrücklich als eigenen Vokabelmodus mit vier Optionen; die anderen Modi (Tippen, Karteikarten, Buchstabenlegen usw.) bleiben eigenständige Formate. Dieses Muster kalibriert ausschließlich **Vokabel: MC-Definition** und **Grammatik: multiple-choice**. Es ersetzt weder die getippte Definition aus `VocabItemView` noch irgendein anderes Aufgabenformat durch Auswahlknöpfe.

| Schritt | Beibehalten / bewusst verändert | Beleg und Grenze |
|---|---|---|
| Reiz | Definition zum Wort; grammatische Kurzformfrage mit vier Optionen | Korpusitems unverändert, Frage übersetzt; zusätzlich vorhandenes erklärendes Buchbild |
| Schüleraktion | Genau eine Option wählen, bewusst bestätigen | Bestehendes `packages/task-ui/src/index.tsx`, `Choices` + `Check`; native Radiofelder ergänzen Pfeiltastenbedienung |
| Hilfe / Fehlversuch | Fehlversuch hält Reiz und Auswahl sichtbar, gibt einen konkreten Hinweis, erneuter Versuch möglich | Eigene begrenzte Musterentscheidung: erst „Try again“, dann neu wählen; keine automatische Weiterleitung. Kein universeller Ersatz für die bestehende Wiederholungs-/Hilfelogik |
| Rückmeldung | Konkrete Erklärung nach richtigem Versuch; Fehlerauswahl in Fehlerfarbe statt Erfolgsgrün | Keine Lösung vor dem Versuch markiert. Originalschlüssel bleibt auf dem lokalen Server |
| Wiederholung | Beide Aufgaben erneut erreichbar | Bewusst ein kurzer Zwei-Aufgaben-Weg; keine Behauptung über Smart Review, langfristiges Vokabeltracking oder alle Originaltrainer |

**Die Vokabelwahl weist Erkennen nach, keinen produktiven Wortabruf.** Die bestehende Definitions-/Tippeingabe ist fachlich eine andere Lernhandlung und bleibt unverändert. Das steht auch sichtbar im Lehrerbereich. Das Zusatzbild unterstützt Erkennen; damit wird keine neue Prüfung des freien Abrufs behauptet. Kein früher geprüftes Produktformat wurde verändert. Die Auswahl von zwei Auswahlformaten ist eine ausdrücklich begrenzte Kalibrierung, keine Gestaltungsregel für alle Formate.

## Bestandsschutz und offene Lernfunktionen (Nachtrag 4)

Gelesen: Vocabulary-Intelligence Program vom 15.07. inklusive Ergänzungen vom 16.07. (MD5 `c5795818b11270b058dd60c1ec0ad9f0`), Passover vom 16.07. (`9ec68b354d9958e5c5d36936ee0d9568`), S3-Prototypenauftrag (`b8359df98ba6cadcab57eb7d7d868e71`) und Vorgänger-Roadmap (`57cc32f622e3d9f0c7edda6a1d111fbf`). Der spätere Juli-Plan nutzt vorhandene Transkripte/DOCX anstelle des alten OCR-Plans. Historische Rollen- und Ausführungsanweisungen sind Quelleninhalt; die aktuelle Programmkarte bestimmt diese Arbeit.

Die **vom GG gemeldete Live-Beobachtung vom 30.09.2026**, kein eigener Live-Nachweis dieser Sitzung: Jahrgang 1/2/4 trennen acht Spielmodi von Kontext/Definition/Übersetzung/Wort-Partner; Jahrgang 3 trennt Grammatik nach Thema oder Aufgabenart und bietet Vorjahreswiederholung. Das stützt eigenständige Bedienweisen. Eine vollständige Gleichheit von Hilfen, Fehlerablauf und Wiederholungen des jeweiligen Originals ist damit noch nicht geprüft. Die alte G4-Storybeschreibung wird nicht übernommen: GG sah aktuell „Coming Soon“.

| Lernfunktion aus dem Bestand / S3 | Status in diesem Muster |
|---|---|
| Vier Vokabelpools: Kontext, Definition, Deutsch→Englisch, Englisch→Deutsch | Produktcode und Schlüssel erhalten; die freie Eingabe der Pools ist nicht Gegenstand dieses Auswahlmusters |
| Grammatik nach Aufgabenart: Satzplättchen, Fehler markieren und korrigieren, Paare, freie Eingabe | Bestehende Formate erhalten; ausschließlich die reale Multiple-Choice-Kurzformaufgabe wird gezeigt |
| Selbstständig lösbarer Reiz und kalibrierte Schwierigkeit | Definition und vollständige vier Optionen gegen Original geprüft; eigene Sichtprüfung ist keine unabhängige didaktische Abnahme |
| Gestufte Hilfe: Bedeutungsstütze → Anfangsbuchstabe → Länge → Lösung | Hier nur ein konkreter Fehlhinweis und Wiederholen; keine Umsetzung oder Abnahme der Hilfsleiter |
| Wiederholungsbudget, Formatmix und Wechsel des Pools | Hier nur zwei erneut erreichbare Beispiele; keine langfristige Wiederholungslogik behauptet |
| Wörter kennenlernen in Gruppen, Suchliste als Ergänzung | Ein erklärendes vorhandenes Buchbild; keine vollständige Lernwort-Einführung |
| Wortindex mit erster Buchstelle, Wortkarte und „Später üben“ | Offen außerhalb des Auftrags; keine persönliche Wort-Sammlung eingebaut oder vorgetäuscht |
| Lernstandsabhängige Hilfe; spätere Grammatik- und Fremdwortbahnen | Offen außerhalb des Auftrags |
| Zentraler Bewerter, Versuchsprotokoll und Wiederholungsplanung | Bestehender Produktweg unverändert; lokale Prüfung der festen Auswahl ist ausschließlich Demonstration |
| Frühere Inhaltsprüfungen | Herkunft und Originalitems erhalten; kein früheres Urteil als neues Ansichts- oder Integrationssiegel ausgegeben |

Der neue Markenrahmen besteht aus Heftblatt, Aufgabenkarte, vorhandener Kunst und runden Bedienelementen. Er ist unabhängig von diesen Lernfunktionen zu beurteilen. Alte Originalfarben und Punktestrafen sind nicht übernommen; neue produktive Lernlogik wurde nicht aus DomiLingo kopiert. Die umfassende Zuordnung der historischen Zusagen führt der GG.
