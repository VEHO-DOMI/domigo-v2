# CODEX DRAFT — NOT CANON

`ui-student-lines.txt` ist die Eingabe für den frischen Sprachleser. Sie enthält ausschließlich 255 nummerierte sichtbare deutsche Zeilen, keine Fundstellen, Codes, Kommentare, Lösungen oder Bewertungen. Identische Texte werden einmal vorgelegt; alle Fundstellen bleiben im getrennten Mapping. Bildbeschreibungen und zugängliche Beschriftungen sind enthalten, weil Kinder sie über Hilfstechnik ebenfalls wahrnehmen können. Die DRAFT-Kennzeichnung steht hier und im Mapping, damit sie nicht fälschlich als Spieltext vorgelesen wird.

## Quelle und Verfahren

Erst aktuelles `git diff HEAD` plus neue Dateien inventarisiert, dann den tatsächlichen TypeScript-Syntaxbaum gelesen. Letztes Inventar: 33 geänderte/neue inhaltlich relevante TS/TSX/JSON-Dateien; 1050 rohe Literal-/JSX-Kandidaten vor Ausschluss von Code, CSS, Attributkennungen und Messdaten. `source-inventory.json` hält Basis, Änderungsbereiche und Dateien fest. `source-candidates.json` enthält die ungekürzten Kandidaten mit Originalkontext und ist ausdrücklich NICHT Leserunterlage.

`extract-ui.mjs` liest die echten exportierten Comic-/Fähigkeitsdaten, die deutschen geänderten Levelwerte und sämtliche fünf betroffenen Regelseiten. Es wertet ganze JSX-Textblöcke aus, damit etwa „Du hast … Buchstaben gesammelt“ als tatsächlicher Satz statt drei Fragmente beim Leser ankommt. Wörtliche Sprache wird weder korrigiert noch bewertet. TypeScript übernimmt das tatsächliche JSX-Whitespace-Verhalten. Inline-Bedingungen werden berücksichtigt: leere Namen erzeugen keine erfundenen „Danke, !“-Zeilen und Merle wird nicht in den Geräte-Zweig gesteckt.

Für veränderliche Werte wurden reale Kapitelquellen benutzt: Bonuspreis 8 aus der Bonustür, zwölf Bonusbuchstaben aus ihrem Gitter, mögliche lokale p2-Bestände von 0 bis 9, alle fünfzehn Namen aus dem tatsächlich verwendeten Figurenregister. Foto-Zustände sind für 0 bis 15 noch fehlende Mitschüler abgebildet, Comicseiten für 1 bis 7. Als persönlicher Name dient „Probe Merle“, der unmittelbar vorher im echten UI-Prüflauf eingegeben und gespeichert wurde. Das ist ein Prüfname, kein entnommener Accountname. Figurennamen und der persönliche Name sind bewusst verschiedene Datenfelder.

Bilanzkontext zeigt die echten Nenner der neuen Zählverträge: drei normale Funde außerhalb der Personenrettung und zehn wiederherstellbare Gegenstände. Null und vollständig werden beide vorgelegt; die Werte wurden aus Entitäten/Kartenzuordnung errechnet. Die Kartenquelle ist dafür nur gehasht, ihre Antworten stehen NICHT im Auszug. Unveränderte Regeltitel und einzelne Bilanzbeschriftungen sind als unmittelbarer Lesekontext zusätzlich enthalten und im Mapping markiert.

`ui-line-mapping.json` ordnet jede Schülerzeilennummer allen Originalfundstellen zu, einschließlich tatsächlicher Vorlage und eingesetztem Zustand. `ui-sourcehashes.json` bindet den Auszug an SHA-256-Dateiprüfsummen. `inventory.mjs` und `extract-ui.mjs` sind nur Berichtswerkzeuge außerhalb des Repos; keine Produktdatei geändert.

## Vier ausdrücklich ausgeschlossene dynamische Ausdrücke

Die reine JSX-Textauswertung kann diese Variablen ohne ihren separaten Karten-/Benutzereingabe-Kontext nicht einsetzen; sie werden nicht durch erfundene Texte ersetzt. Sie sind vollständig in `unresolved-expressions.json` aufgeführt.

1. `CardShell.tsx`, `task.storyDe`: gehört zu den durch Root separat vollständig an den Kartenleser gegebenen Karten. Keine doppelte Kartenprüfung.
2. `ChalkGreeting.tsx`, `word`: frei eingegebener englischer Gruß auf der Tafel; kein deutscher Autorensatz und keine vorab zu verteilende Lösung. Die neue deutsche Bildbeschreibung der lächelnden Tafel ist enthalten.
3. `NumberSwarmPlate.tsx`, `glyph.text`: reine Zahlenzeichen aus der Zahlenwolke, kein deutscher Satz. Die deutschen Beschreibungs-/Hinweisformulierungen der Radvarianten sind enthalten.
4. `PaintGame.tsx`, `figcaption lang="en"` der neuen Kleider-Wortliste: tatsächliche englische Sammelwörter, keine neuen deutschen Autorenzeilen. Beide neuen deutschen Einleitungszeilen und der Weiterknopf sind enthalten.

Zusätzlich werden `schluesselDe`-Felder nicht als isolierte Wortreste wiederholt: sie markieren nur einen bereits im vollen Regelsatz enthaltenen Ausdruck. `belegDe`, englische Lösungslisten und Antwortschlüssel bleiben ausgeschlossen. Die neuen Daten `restorationDe.oneDative/manyDative/oneSubject` erzeugen im alten Auftrag-Auftakt zwar Formeln, dieser Auftakt wird im Kapitel-1-Comicweg jedoch nicht gezeigt. Ihr tatsächlich aktiver neuer Bilanztext ist enthalten. Es wurden daraus keine fiktiven zusätzlichen UI-Sätze erzeugt.

## Finaler Abgleich

Die letzten Änderungen „Weiter geht’s, Probe Merle!“, der Tafel-Abschlusssatz und die neue Kleider-Wortliste sind im Auszug enthalten. Der Lesetext enthält keine undefined/null-Fragmente oder leere Namensansprachen. Die Werte sind nach erneuter Quellinventur erzeugt; `pin-verification.json` dokumentiert den anschließenden Hashvergleich. Bei weiteren deutschen Produktänderungen bitte die beiden Skripte erneut ausführen und nur die neue vollständige Leserdatei verteilen.

Keine Sprachurteile, Lösungseinschätzungen oder Kandidatenkorrekturen durch den Extraktionsagenten. Der frische Leser erhält ausschließlich `ui-student-lines.txt`.

Nach der autorisierten Regelseiten-Speicherergänzung erneut aus den tatsächlichen Quellen erzeugt und gepinnt: alle 34 Quellprüfsummen stimmen. Die Leserdatei bleibt bytegleich (252 Zeilen, SHA-256 `75aabd4d2258307bcfab8b469e069122cf445831d17c2db0a757f18bd1f348d3`). Die zusätzlichen Rohkandidaten sind historische Titelaliase im Speichercode, keine neuen Spieltexte.

## Nachlauf nach dem vollständigen UI-Leser

Die sechs Stolperstellen des ursprünglichen vollständigen Lesers wurden in den tatsächlichen UI-Quellen korrigiert und erneut extrahiert. Die Zahlen-Hinweiserfassung liest jetzt beide String-Literale der tatsächlichen deDesc-Zeile unabhängig von ihrem Wortlaut. Ein frischer unabhängiger Leser erhielt ausschließlich diese sechs vollständigen geänderten Schülerzeilen plus den zuletzt korrigierten Tablet-Hinweis aus ch01.tasks.v2.json. Ergebnis in ui-followup-reader.txt: vier Mensch, drei geschrieben, kein stolpere. Der Tablet-Hinweis liegt zusätzlich in ui-followup-student-lines.txt, weil Karten ansonsten getrennt geprüft werden. Der vollständige UI-Auszug behält 252 Zeilen; der neue Hash steht in pin-verification.json. ui-reader.txt bleibt das unveränderte ursprüngliche Urteil und wird nicht überschrieben.

## Letzter Abschlussstand

Die nachträglich präzisierte Arena-Zeile und die neue Zählerüberschrift „Schlösser“ wurden jeweils von einem weiteren frischen Codex-Leser geprüft: beide Mensch, kein stolpere. Die vollständigen Originalausgaben bleiben in arena-followup-reader.txt und hud-followup-reader.txt. Der Schlösser-Leser sah auch den tatsächlichen Zählerstand 1/4. KlecksSpeaker.tsx enthält ausschließlich den bereits gelesenen Namen Klecks; seine neue Fundstelle ist nun ebenfalls im Mapping und sein Quellhash im Pin enthalten.

Die Extraktion berücksichtigt jetzt auch geänderte Chip-label-Attribute. So erscheinen zusätzlich die neue Überschrift Schlösser sowie die unverändert weiter verwendeten Kontextbeschriftungen Befreit und Regel-Seiten. Gesamtstand 255 Leserzeilen aus 33 inventarisierten Quelldateien; 34 Quellen einschließlich der nur für echte Nenner gelesenen Kartenquelle sind gehasht. Die Ermittlung von Restore-Zielzahlen liest das tatsächliche phases-Feld der Karten. Keine Wortlautänderung durch den Extraktor. Frühere Zahlen/Prüfsummen in den zeitlich bezeichneten Nachträgen oben dokumentieren historische Zwischenstände. Maßgeblich ist pin-verification.json.


## Nach dem Aufgaben-Ladeschnitt

Die Inventur vergleicht nach dem zwischenzeitlichen Root-Commit ausdrücklich weiter gegen dieselbe vollständige Arbeitsbasis 7161948936faabc5eab2fd51457e90616599424d. Dadurch bleiben zuvor gelesene neue Spieltexte im Auszug. Der CardHost-Ladeschnitt verwendet nur einen bereits enthaltenen Ladehinweis; Leserdatei weiterhin bytegleich mit 255 Zeilen und SHA-256 5e50db4cbe12636cd3d141758cef3fc0aa9540a49a5f0c9f0c4ab0a00f022ae2. Die zusätzliche aktuelle Quellenprüfsumme des Bildmanifests ist reine Artefaktprovenienz, kein neuer Schülertext. Aktuelle Anzahl und Abgleich siehe pin-verification.json.
