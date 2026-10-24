# Quellenwelle 2 · Prüfweg und Grenzen

CODEX DRAFT — NOT CANON. Entwurfsindex, keine Veröffentlichung oder Bedeutungsentscheidung.

Die Welle legt nachvollziehbare Verweise zwischen Originaltranskripten und aktuellen Aufgaben an. Gleich geschriebene Wörter bleiben getrennte Datensätze. Wort-Hilfe, Sammlung und Bildbibliothek dürfen diese Unterlagen als Belege lesen, aber daraus keine Unterrichtsfreigabe ableiten.

## Bestände und offene Fälle

| Klasse der verbleibenden Quellenstellen | Vorher | Mit neuem wörtlichem Verweis | Weiter ohne solchen Verweis |
|---|---:|---:|---:|
| Ein normalisierter Einzelkandidat | 903 | 819 | 84 |
| Kein Zitierform-Kandidat | 3953 | 0 | 3953 |
| Referenz nennt kein bestimmtes Chapter | 1636 | 0 | 1636 |
| Referenzkonflikt | 353 | 0 | 353 |
| Deutsche Bedeutung weicht ab | 316 | 0 | 316 |
| Mehrere Kandidaten | 195 | 0 | 195 |
| Außerhalb des aktuellen Kurses | 17 | 0 | 17 |
| Summe | 7373 | 819 | 6554 |

Der Gesamtbestand umfasst 7398 Quellenstellen. Die frühere 25er-Stichprobe ist über unveränderte Quellenobjekte identifiziert; Mitgliedschaft ist keine erneute Freigabe. Alle 7373 verbleibenden Stellen sind jetzt in belegten Klassen erfasst. Semantisch entschieden wurden 0.

Die 819 Verweise verteilen sich auf Jahr 1/2/3/4 mit 244/225/231/119. Der Filter verlangt genau einen Zitierform-Kandidaten insgesamt, denselben referenzierten Jahrgang und dasselbe Chapter sowie identische englische und deutsche Felder in Quelle, Wortbank und aktueller Aufgabe. Er ergänzt keine Synonyme. „Wörtlich“ bezeichnet die vom bestehenden Parser ausgelesenen Felder (NFC und äußerer Leerraum wie bisher); die vollständige ursprüngliche Zeile bzw. Absatzspanne bleibt zusätzlich erhalten.

Die früheren 1435 Textmatches und die 903 Einzelkandidaten stammen aus unterschiedlichen Auswertungen. Sie sind keine addierbaren Mengen. Die 84 übrigen normalisierten Einzelkandidaten werden nicht durch Lockerung der Regeln zu wörtlichen Verweisen erklärt.

`source-decisions-wave-2.md` und `.json` enthalten 1138 Entscheidungsblätter: 542 Bedeutungsfälle, 52 Mehrdeutigkeiten, 395 Referenzkonflikte und 149 Episodenverweise. Sechs dieser Blätter gehören auch zur früheren 25er-Stichprobe. Jedes Blatt enthält Originalzeile, Quellenort, Aufgaben-Kandidaten, drei Optionen und einen ausdrücklich vorläufigen nächsten Prüfschritt. Kein Blatt trifft den Entscheid.

## Korrektur am Nenner der ungeklärten Quellen

Die 3230 früher als „wortlautlos“ bezeichneten Fälle enthalten Wortlaut. Es sind Tabellenzeilen ohne ursprünglichen exakten Wortbank-Texttreffer: 838 aus Jahr 2, 1391 aus Jahr 3, 1001 aus Jahr 4. Alle 3230 besitzen einen vorhergehenden Seitenmarker im Transkript; eine Originalseitenprüfung kann dort ansetzen. Ein Marker beweist weder die gedruckte Seite noch die Ausgabe. Die Seitenprüfung selbst ist offen.

Die 1577 verlustfrei zerlegten Absatzeinträge aus Jahr 1 bilden einen getrennten Bestand, keinen Teil dieser 3230. Vor dem ersten ausdrücklichen Marker bleibt die Seite null. 0 dieser erfassten Quellenstellen werden als „fehlende Übung“ oder ohne vorhandenen Quellwortlaut erklärt.

## Entwurfsindex und Sprachprüfung

`vocabulary-index-wave-2.json` verweist auf 57 Chapter-Dateien mit allen 2446 aktuellen Wortaufgaben. Definition, Kontext, vier Abrufrichtungen samt Antworten, Aufgabenprüfwert, Quellenkandidaten und unveränderte Herkunft stehen je Aufgabe zusammen. `meaningId` und `firstTaught` bleiben null. Die 34 früheren Kalibrierungsdatensätze aus `vocabulary-calibration-g2-u03.json` bleiben erhalten; alle 34 Aufgabenprüfwerte stimmen noch. Der Verweis überträgt keine alte Activity-Zuordnung auf die neuen Lehrerentscheide.

Das R2-Modul `vocabulary-prerequisites.ts` sucht vollständige einzelne Quellstichwörter; ein sichtbares „to “ darf nur als ausdrücklich markierte Zitierform entfernt werden. Es erteilt keine Erlaubnis aus bloßen Bestandteilen einer Wendung, keine pauschale Freigabe häufiger Wörter und keine ungeprüfte Beugungsableitung. Einfügungen aus dem Antwortfeld sind als Lernziel markiert; dasselbe Wort außerhalb dieser Einfügung bleibt Stützsprache. Definition, Kontext, eingesetzte Antworten, englische Glossareinträge, Auswahlmöglichkeiten und englische Varianten werden erfasst. Die gemeinsame Nachschlagetabelle verweist zurück auf konkrete Quellenstellen.

Ein gezielt zu früh eingesetztes Wort wird vom negativen Prüfschritt abgewiesen. Trotzdem ist dies **kein vollständiges R2-Freigabetor**: Wortbedeutung, ganze Wendung, Grammatik, frühere Einführung im Buch-Fließtext und ausreichende deutsche Hilfe brauchen eigene Belege. 2428 Aufgaben enthalten mindestens eine offene lexikalische Stelle; nur bei 18 gibt es ausschließlich passende Vorkommenskandidaten. Auch diese 18 sind nicht freigegeben. Eine Wörterliste darf etwa „switch“ nicht als neu erklären, wenn eine frühere Buchseite es bereits verwendet.

Die diagnostischen Wortgruppen umfassen 41731 Vorkommenskandidaten bis zum jeweiligen Chapter, 9399 ohne vollständigen Stichwortbeleg, 3859 reine eingefügte Lernzielgruppen, 787 nur später referenzierte und 743 ohne bestimmte Chapter-Referenz. Das sind Gruppen je Aufgabe, keine Anzahlen unbekannter Wörter oder nachgewiesener Inhaltsfehler.

Die deutsche Hilfe aus Jahr 1 bleibt vollständig sichtbar; Angemessenheit und verräterische Antwortteile sind noch zu prüfen. Kontextqualität (gegebenenfalls zwei zusammenhängende Sätze), Grammatik und Bild-Disposition werden nicht mechanisch als bestanden eingetragen. Die frühere 34er-Kalibrierung enthält Bild- und Activity-Vorschläge; für den übrigen Bestand fehlen diese Einzelurteile noch. Der jetzige Index ersetzt sie nicht durch ausgedachte Bildideen. Bilderstellung und visuelle Kalibrierung gehören zur eigenen folgenden Karte.

Activity bleibt getrennt: ursprüngliche Klassifikation, Original-/Auditbelege und ausdrücklicher Lehrerentscheid stehen in eigenen Feldern. `activity-sources-wave-2.json` erhält die Originalbeobachtungen; eine Zeichenkategorie allein genehmigt weder eine Unterrichtsillustration noch weitere Spielmodi.

## Wiederholung und Prüfung

Die beiden Eingabemanifeste nennen ausschließlich explizite lokale Originaldateien. Der Befehl sucht keine persönlichen Verzeichnisse und liest keine Lernerdaten. Bericht und abgeleitete Review-Dateien werden außerhalb des Repos erzeugt, niemals überschrieben. `--verify` baut alles erneut auf und vergleicht jedes Byte.

```sh
pnpm content vocabulary-source-wave \
  --manifest /absolute/neutral-appendix/input.json \
  --activity-manifest /absolute/neutral-activity/input.json \
  --out /absolute/evidence/wave.json \
  --review-dir /absolute/evidence/review
# Derselbe Befehl mit --verify prüft Bericht und alle 63 Review-Dateien.
```

Die im PR eingecheckten Review-Dateien sind die ausdrücklich beauftragten Entwurfsunterlagen. Rohlogs, Originaldateien, Reader-Berichte und die vollständige Ausgabe bleiben im lokalen Belegpaket. Die 63 erzeugten Dateien lassen sich vollständig gegen dieses Paket vergleichen; dieses Dokument ist die redaktionelle Erläuterung.

Zwei unabhängige Leser prüften jeweils dieselben 50 eingefrorenen Verweise aus 50 Chapters direkt gegen die DOCX-Originale: jeweils 50 bestanden, 0 Abweichungen. Sie prüften Originalzitat, Ort, Jahr-1-Absatzgrenzen, englisches Wort, deutsche Bedeutung, Chapter und aktuelle Aufgabenprüfwerte. Master-Dateiprüfwerte wurden gegen Wortbank-Metadaten geprüft, nicht gegen sämtliche Original-Masterdateien. Gedruckte Buchseiten, Ausgabenidentität, Bedeutungen und Erstunterricht bleiben unbestätigt. Die Stichprobe genehmigt nicht alle 819 Links. Kein Nachzug aufgrund dieser Leserbefunde und kein Recheck waren nötig.

A0: Das historische Belegpaket der vorherigen Quellenkarte wurde mit sechs maskierten Skripten, Originalprüfwerten und neutralem 786er-Manifest wiederhergestellt. Der Prüflauf reproduziert 34 Datensätze und weist 17/17 absichtliche Änderungen zurück. Archivierte Builder werden als Archiv bezeichnet; ihre unveränderte Neuausgabe der später manuell korrigierten Endfassung wird nicht behauptet.

## Offene Abnahme beim GG

Der mechanische Quellen- und Diagnoseanteil ist prüfbar. Ein vollständiger pädagogischer Ausbau von R1/R2/R3 und Bild-Disposition über alle Chapters ist damit nicht behauptet. Insbesondere bleibt die Satzreparatur-Karte cgo-173 ohne ein beleggebundenes R2-Entscheidverfahren gesperrt. GG muss diesen Restumfang disponieren; weder eine Wortlisten-Ausnahme noch eine Pool-Erweiterung wird stillschweigend eingeführt.

Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.
