# Quellenkalibrierung Oktober 2026

**CODEX DRAFT — NOT CANON · Karte cgo-153 · Basis 405b8c99f673c192d7444bb760315a6082bff252.**

Diese Quellenarbeit liefert einen erneuten Activity-Import, [14 Entscheidungsblätter](activity-decisions-2026-10.md) und [ein vollständiges Chapter als Entwurf](vocabulary-calibration-g2-u03.md). Keine Kategorie, Schüleraufgabe, Bedeutungsidentität oder Datenbank wurde geändert. Die Quellenentscheidung E1 ersetzt nur den privaten Importpfad für Jahr 1. Der Klassifikations-Map bleibt unverändert.

## Bestätigte Jahr-1-Quelle und erneuter Import

Die Originaldatei aus `VEHO-DOMI/1st-grade-vocab-trainer`, Commit `73a45b8c`, `activity/data/activity-words.js` wurde per GitHub gelesen, ohne Ausführung, und mit der vom GG bezeichneten lokalen Kopie bytegenau verglichen: **48.947 Bytes, 786 Datenzeilen, SHA-256 `1acc8dab7d81b319967fffa897e429dd2eaeade85ccfbc966f014fb9760241a2`**. Die frühere 759er-Datei bleibt als historischer Vergleich erhalten. Beide Läufe benutzen denselben aktuellen Korpus und dieselbe Importer-Version. Private Quellpfade und die ungekürzten Berichte bleiben außerhalb des Repos.

| Messung | Alte Jahr-1-Datei | Bestätigte Jahr-1-Datei |
|---|---:|---:|
| Datenzeilen Jahr 1 | 759 | 786 |
| Activity-Datenzeilen alle Jahre | 2406 | 2433 |
| Abweichende deklarierte Dateihashes | 1 | 0 |
| Jahr-1-Aufgaben ohne exakte Kapitel+Wort-Quellzeile | 87 | 0 |
| Alle Aufgaben ohne exakte Kapitel+Wort-Quellzeile | 100 | 13 |
| Alle Aufgaben ohne exakten Wortkandidaten irgendwo im Jahrgang | 84 | 10 |
| Vorhandene Aufgaben | 2446 | 2446 |
| Gespeicherte Klassifikationen | 2435 | 2435 |
| Fehlende Klassifikationen | 11 | 11 |
| Audit-Prüfzeilen | 1801 | 1801 |
| Freigegebene Bedeutungen / Unterrichtsentscheidungen | 0 | 0 |

Alter Bericht-Fingerprint: `6145d18a5ea8f73c1b9eb52cf1c1553a634f2a15ee43194676eaa327d25dd2b4`. Neuer Bericht-Fingerprint: `83859646bb927fd2ad26f102a615d6e0ec4aae1d0a529499c89c378d7dd891ed`. Diese eingebetteten Fingerprints binden den Inhalt; die SHA-256 der vollständigen Report-Datei sind separat: alt `146d548de07a048fd17d1bbe7facbf0150b47f0dcd14af5f8f8a061be5fab599`, neu `91bca242181887396ab9f45ca56c1a63f89416b012ee338d0c025b9e223159fd`.

Die **87** der früheren Karte waren Jahr-1-Aufgaben ohne exakte Zeile im gleichen Kapitel; sie sind jetzt **0**. Die frühere Importer-Zahl **84** zählte dagegen alle Jahrgänge ohne Wortkandidaten in irgendeinem Kapitel; sie sinkt auf **10**. Aktuell bleiben **13** ohne gleichen Kapitel+Wort-Beleg (Jahr 2: 7, Jahr 4: 6). Das sind verschiedene Messungen. Keine davon erklärt automatisch eine fehlende Übung.

midnight ist in der bestätigten Quelle sowohl U1 (Datensatz 20, Zeile 27) als auch U11 (Datensatz 537, Zeile 544) als draw belegt. U1 explain stammt aus der älteren Quelle. Die 759 Jahr-1-Auditzeilen bleiben erhalten, aber ihr Status ist different-pool und sämtliche Bindungen zur neuen Datenquelle sind leer. Für Jahr 2 gilt E2: Audit **nicht belegt**. Jahre 3/4 behalten ihre geordnete Quellbindung; 15 bzw. 10 abweichende deutsche Audittexte bleiben sichtbar.

Reproduktion mit einem privaten Manifest der Form `activity-evidence-input@1`: nur dessen Jahr-1-Datenpfad auf die bestätigte Datei ändern; Audit/Notizen als getrennte Originale belassen. Danach `pnpm content activity-evidence --manifest <privates-manifest> --out <bericht-außerhalb-repo>` und denselben Aufruf mit `--verify`. Die hier verwendete private Manifestkopie ist für die GG-Übergabe außerhalb Git erhalten.

## Restarbeit: gleiche Zähleinheit, klare Reihenfolge

Die sechs im Auftrag genannten Zahlen sind weiterhin exakt reproduzierbar: Sie betreffen **5.803 Tabellen-Vorkommen der Jahre 2–4**, nicht den später um Jahr-1-Absatzsegmente erweiterten Gesamtbestand. Keine dieser Klassen ist eine Liste fehlender Übungen.

| Empfohlene Welle | Klasse des ursprünglichen Tabellenbestands | Zahl | Nächste Prüfung |
|---|---|---:|---|
| 1 | Referenzkonflikte | 395 | Originalseite/Edition, Übungsplatz und Quellenkorrektur getrennt entscheiden. |
| 2 | Episodenkandidaten | 149 | T/OYW/S-Codes am Original auflösen, keinen Unit-Wert raten. |
| 3 | Mehrdeutigkeiten | 52 | Wiederholung versus unterschiedliche Bedeutung je Kandidat prüfen. |
| 4 | Bedeutungsfälle | 542 | Deutsche Lesart, Definition und Kontext gemeinsam beurteilen. |
| 5 | Textmatches | 1435 | Gleichlautende Felder unabhängig semantisch bestätigen; kein Automatismus. |
| 6 | Appendixfälle ohne Wortlautmatch | 3230 | Begrenzte Zitierformen und bewusster Aufgaben-/Funktionswortumfang prüfen. |

**Jahr 1 zuerst als Grundlage:** Die 60 ursprünglichen Absätze wurden bereits durch die Vorgängerkette in **1.577** vollständig erhaltene Einträge zerlegt. Der neue Lauf hat **0** ungeteilte/fehlerhafte Absätze; die Quelle muss nicht noch einmal mechanisch rekonstruiert werden. Die unabhängige XML-Prüfung kontrolliert trotzdem alle Felder und Zeichenbereiche. Ihre Bedeutungen, Erstunterrichtsorte und Editionsbezüge sind damit weiterhin nicht pauschal geklärt. Drei Jahr-1-Einträge besitzen nur einen Episodencode.

**Außerhalb des Kurses separat:** Alle **18** Jahr-4-Unit-14-Zeilen bleiben erhalten und außerhalb der 13 konfigurierten Units. Eine wurde in der früheren 25-Fall-Probe behandelt; **17** bleiben außerhalb der Probe. Keine Umnummerierung.

Die historische Zahl **601 Bankeinträge ohne Appendixkandidat** entstammte dem Stand vor der Jahr-1-Segmentierung. Aktuell sind es **473** beim engen Textvergleich und **457** mit den expliziten Zitierform-Kandidaten des Fallbuchs. Weder der alte noch der neue Nichttreffer ist ein Fehlensbeweis. Erste Aufgabe bleibt die Quellen-/Formprüfung, nicht das Erfinden zusätzlicher Übungen.

## Gesamtbestand nach der früheren 25-Fall-Probe

Der aktuelle Lauf enthält **7.398 Vorkommen** einschließlich der 18 ausgeschlossenen. Die frühere Probe umfasst **25 Quellfälle** (31 einzelne Vorschläge); die hier erstellten 34 Wortdatensätze sind **keine 34 zusätzlichen freigegebenen Quellfälle**. Deshalb bleiben **7.373 Vorkommen** außerhalb jener Probe. Nach erster zutreffender Regel partitioniert:

| Klasse | Offene Vorkommen |
|---|---:|
| Außerhalb Kurs | 17 |
| Kein Zitierform-Kandidat | 3953 |
| Quelle nennt keine Unit | 1636 |
| Kein Kandidat in referenzierter Unit | 353 |
| Mehrere Bankkandidaten insgesamt | 195 |
| Ein Kandidat, anderer deutscher Wortlaut | 316 |
| Ein Kandidat, gleicher deutscher Wortlaut | 903 |
| **Summe** | **7373** |

Die Kategorien prüfen erst Kursgrenze, dann fehlende Kandidaten, fehlenden Unit-Verweis, fehlenden Kandidaten in dieser Unit, mehrere Kandidaten **insgesamt**, danach den deutschen Wortlaut. Damit werden wiederholte Kapitelvorkommen nicht versehentlich zu einer bestätigten Identität reduziert.

## Übergabe und Umfangsgrenzen

Koki erhält über den GG die 14 Entscheidungen und das vollständige Chapter. Bis zu seiner Entscheidung: keine Ausweitung dieses Entwurfsmusters, keine Kategorieänderungen und kein Einfrieren eines Runtime-Index. Wort-Hilfe, persönliche Sammlung, Bildproduktion und Activity-Spielregeln bleiben spätere, ausdrücklich noch nicht freigegebene Stufen. Die aktuelle Karte erzeugt Bild- und Spielbarkeitsvorschläge als Felder, keine Bilder oder Spiele.

Für Codex folgt die bereits freigegebene Buchungsreparatur **cgo-154**, nach dem eigenen Vertrag K1–K9. Der ungemergte Stapel und Produktionsmigrationen bleiben Zuständigkeit des GG. **Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.** Paketprüfungen, unabhängige Leser und Exit-Codes stehen im PR und Kartenbericht, Rohbelege außerhalb Git.
