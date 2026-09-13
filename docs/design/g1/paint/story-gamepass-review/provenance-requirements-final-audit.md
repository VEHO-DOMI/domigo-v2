# CODEX DRAFT — NOT CANON

# Welle 36: Quellen- und Anforderungsabgleich

13.09.2026. Reine Dokumentationsbahn, keine Laufzeit- oder PNG-Änderung, kein Commit. Alle 54 Zeilen in PLAN.md besitzen jetzt einen aktuellen, getrennt formulierten Umsetzungs-/Prüfstatus und konkrete Quellen bzw. Belegnamen. Keine Zeile wurde allein wegen eines grünen Typchecks fertig genannt. Der Plan bleibt insgesamt IN ARBEIT.

## Bildquellen

`docs/art/ch01-story-gamepass/panels.manifest.json` war tatsächlich veraltet: alte Buch-/Soghashes und kein Verwandlungspanel. Die tatsächlichen sieben Originaldateien waren dagegen bereits korrekt. Das Manifest bildet jetzt exakt die sieben `CH01_COMIC`-Schritte und ihre unveränderten Quell-/Laufzeitbytes ab; alle sieben Promptdateien sind im Repo vorhanden. Die Schul-Promptdatei wurde unverändert aus der eigenen Kalibrierung ergänzt. `panels.previous.manifest.json` trägt ausdrücklich superseded und warnt, dass seine historischen Dateipfade inzwischen neuere Dateien enthalten. `school-transformation.manifest.json` ist ausdrücklich ein historischer Drei-Dateien-Austausch, kein alternatives Gesamtmanifest. Die historische Originalsammlung behält ihre verworfenen Generationen; installierte v3-Bilder und Verwandlung sind nicht mehr fälschlich candidate.

Die Tinte ist keine achte Comicseite. `ink-liquid.manifest.json` führt sie getrennt, `ink_liquid.prompt.txt` enthält exakt den Prompt aus dem tatsächlichen ImageGen-Aufruf 2026-09-13T10:28:56.895Z. Root stellte den wiedergefundenen Originalaufruf bereit; nur der erste echte Aufruf wurde gelesen, die zwei nachfolgenden Suchaufrufe sind keine Promptquelle. `ink-prompt.provenance.json` bindet Zeit, Quelle und Promptfingerabdruck. Keine nachträgliche Formulierung als Original ausgegeben.

`ending-door/import-report.json` war bei dieser Prüfung bereits richtig. Genau ein Asset, `plate_ch01_door`; Originalhash, installierter Ausgabehash, Manifesthash und Hash in import.log stimmen. Keine Rekonstruktion nötig. Ausgabehash `3a36ed1d2db5ad50a790839b75de20ca13491a3d6b5bafbd488065a6e4d6d5b6`. Der globale Report im public-Verzeichnis bleibt ausdrücklich ungeeignet als dauerhafter Einzelimportbeleg, weil spätere Importe ihn überschreiben.

Der neue Sourcepack-README benennt für jede Familie die maßgeblichen Quellen und historischen Zwischenstände. `objects/neutral-installed-variants.json` ergänzt die tatsächlich übernommenen 19 neutralen Varianten. Damit wird nicht länger das erste farbige Angriffsblatt als endgültige Quelle dieser Varianten ausgegeben. `installed-provenance.snapshot.json` bindet 132 aktuell passende Laufzeitstämme an ihren konkreten Quellenbericht und führt 19 überholte Importbericht-Zeilen separat auf. Dieser Wert betrifft die in diesem Sourcepack belegten neuen/ersetzten Stämme, nicht sämtliche Spielbilder. Die neutrale Farbe wurde inzwischen durch `neutral-review/IMPLEMENTATION.md` und `full-colour-gate.log` bestätigt; die roten Erstberichte bleiben historische Befunde.

Maschinenlesbarer Endabgleich: `provenance-final-check.json`. Alle sieben Comicquellen sind bytegleich zu ihrer Auslieferung, alle sieben Prompts vorhanden, Tintenquelle identisch, vier Türhashbindungen gültig. Keine neue Laufzeittestserie für diese reine Dokumentkorrektur erforderlich.

## Tatsächlich noch offene Anforderungen / Abnahme

- **Karten 029/030:** Beide frischen Blindlesungen nennen fehlende zählbare Punkte; ein Leser erklärt 029 deshalb unlösbar. Die zwei behaupteten Bücher auf 030 werden ebenfalls nicht im Bild gezeigt. Das sind echte Bild-/Aufgabenfehler, keine optionalen künftigen Schönheitswünsche. Korrigierte Karten müssen neu aus der Schüleransicht gelesen werden.
- **Kleidung-Wortbuch (40,39):** gebaut und aus den tatsächlich gesammelten Wörtern gespeist; letzter echter Klick-/Bild-/Rückkehrbeleg fehlt im abgeschlossenen UI-Lauf. Es darf keine bereits vollständige Browserabnahme behauptet werden.
- **Abschlusstür (52) und Bilanz (51):** neuestes Bild korrekt importiert. Die aktuelle montierte Schlussansicht muss Root noch ansehen; alte Türbilder belegen diese Fassung nicht.
- **Name im Folgekapitel (48):** echte Eingabe, Speicherung und spätere Instanz sind durch UI-/Profiltests belegt. Der neu ergänzte tatsächliche Folgekapitel-Gruß selbst fehlt noch als Browseransicht.
- **Dauerhafte Regelbuchsammlung im Spiel (53):** das interne Merkseitenarchiv liest die aktuelle Fundliste; nach Remount startet diese leer. Das Hub-Archiv liest gespeicherte Regeln. Die enge Migration korrigiert alte Texte beim Wiederfund, nicht beim bloßen Öffnen. Keine Behauptung von Datenverlust; aber das Ende-/Menüversprechen einer dauerhaft sichtbaren einheitlichen Sammlung ist so noch nicht vollständig belegt/eingelöst.
- **Merle (25,30,31) und Angreifer (32,38):** echte Simpfade, sichere Körper und Angriffe sind geprüft; Autorbilder und Montage sind vorhanden. Ein aktueller zusammenhängender Weltblick auf Rettungsdialog, Nebeneinandergröße und spätere Begleitung ist davon getrennt. Statische Aliasposen bleiben offen ausgewiesener Qualitätskompromiss.
- **Gesamtprüfung:** Sprachlesung auf dem letzten deutschen Quellstand, Antwort-/Schlüsselvergleich einschließlich Nachlesungen, finale lokale Batterie, Performancebeleg, PR-Prüfungen und unabhängiger Endleser sind Root-Aufgaben. Vorhandene einzelne Sprachlogs enthalten historische Stolperstellen und sind keine pauschale Schlussfreigabe.

Der Plan ist bewusst keine künstliche Zahl „54/54 fertig“. Seine Akzeptanzbedingungen bleiben erhalten; sieben Panels statt der ursprünglich sechs sind durch die ausdrücklich bestellte sichtbare Verwandlung begründet.

## Registerabgleich und Vorschlag an Root

Nach tatsächlicher Tabellenzählung ist D-1008 die höchste vergebene Nummer. **D-1009…1029 sind trotzdem nicht frei für Kapitel 1:** R295 reserviert D-1000…1029 ausdrücklich für ch02. D-991…999 gehören zum reservierten L0c-Block D-985…999 und werden ebenfalls nicht still übernommen. Dieser Bericht vergibt keine Nummer. Vorschlag: eigener eindeutig benannter Block **L1-W36**, neue Nummern erst nach Roots kontrollierter Festlegung eines zulässigen Blocks; außerhalb bestehender Reservierungen wäre D-1030 aufwärts ein möglicher Vorschlag, keine bereits vollzogene Vergabe.

Bestehende Schulden nicht unnötig duplizieren oder global schließen:

| Bestehender Posten | Ehrlicher W36-Abgleich |
| --- | --- |
| D-2, fehlende offene Käfigkunst | Kapitel 1 besitzt jetzt registrierte offene Penal-/Geräte-/Fotostücke. Teilnachtrag für genau diese Stämme möglich; fremde satchel-Verwendungen nicht pauschal schließen. |
| D-3, Verlust mittlerer Erwachensrunden beim Bonusausflug | Eigene Restore-Sequenztests betreffen die drei Gegenstände, nicht automatisch Merles sechs mittlere Runden. Ohne exakten vorhandenen Gegenbeleg nicht schließen. |
| D-4, verlorene Objektauflösung beim Remount | Neue drei Restore-Sequenzen belegen serialisierten Bonusausflug und einmaliges entityResolved. Nur diesen getesteten Teil nachtragen; keine allgemeine historische XP-/Wesenbehauptung als erledigt erklären. |
| D-78, Kind durch zu viele Fragen gelangweilt | Neun Kleidungsquiz entfernt. Das ist eine konkrete Verbesserung, aber kein wiederholter unabhängiger Spielspaßtest. |
| D-772, Danke-Blase am falschen Sprecher | Neue gewöhnliche Gegenstände benutzen sachliche Rückmeldungen. Das behebt nicht automatisch jeden alten Toastanker aller Kapitel. |
| D-990, rechteckige Formanschlüsse | Neue Ost-/Decken-/Podestkörper betreffen konkrete andere Übergänge. Historische Restkritik am Regal-Turm-Boden nicht still schließen. |
| D-1005, Standardaufnahme verbraucht Weltzeit | Diese Bahn nutzt den gesonderten echten Prüfzugang und benennt seine Grenzen. Das Standardwerkzeug ist dadurch nicht allgemein repariert. |
| D-1007, Bildbudget unterschlägt Dateien | W36 zählt zusätzlich verdiente Merle-Bilder ehrlich im Maximalzustand. Als ergänzender Beleg referenzieren; dieser ch02-Posten bekommt keine still neue Kapitel-1-Bedeutung. |

Konkrete neue W36-Zeilen, falls Root die Nummern freigibt:

1. **Gebaut/gezielt geprüft:** Referenzlesen zerstörte den Aufgabenfortschritt; echte Farbstufe, Texteingabe und Uhr bleiben über Comic/Merkseite erhalten. `ui-story-interaction-check.md`, identischer DOM-Knoten, 8110-ms-Pause.
2. **Gebaut/gezielt geprüft:** Finale war nach Später nicht wieder aufnehmbar und behauptete vorzeitig Erfolg; echter Wiederaufnahme-Knopf, kein Name/Erfolg vor tatsächlich akzeptiertem Gruß. Derselbe UI-Bericht.
3. **Gebaut/gezielt geprüft:** Drei feindliche Farben waren nicht verbindlich erreichbar; echte zweistufige Kartensequenzen, Bänder und sieben negative Quellproben. `implementation-restore-reachability.md`.
4. **Gebaut/gezielt geprüft:** Neue Neutralfarben und Angriffsvarianten drifteten in alte Farben zurück; gemeinsame aktuelle Materialbilder, geometrisch eingefrorene Polygonlesarten und wirkliche negative Bild-/Quellproben. `neutral-review/IMPLEMENTATION.md`.
5. **Offen, Qualitätskompromiss:** Füllfeder/Heft/Schere nutzen je eine statische Materialzeichnung über alle Posen; die Tafel 24 Zustandsnamen aus zwei Zeichnungen. Bewegung ist echt, eigenständig gemalte Aushol-/Angriffs-/Flugphasen fehlen in diesen finalen Aliasfamilien. Spätere Neuzeichnung muss alle Farb-/Geometriebelege erhalten.
6. **Offen, konkrete Funktion/Bedienung:** Dauerhaftes Regelarchiv ist vom internen aktuellen Merkseitenarchiv getrennt; nach Remount unterschiedliche Bestände. Eine einheitliche dauerhafte Ende-/Menüansicht mit Datenmigration und echter Wiederkehrprüfung bleibt zu liefern, sofern Root diese Anforderung nicht noch in W36 abschließt.
7. **Offen, Übertragbarkeit:** Begleiter folgt sicheren statischen Heldpfaden; bei weitem Respawn wartet sie am letzten sicheren Punkt, spätere bewegliche Räume besitzen noch keinen universellen sicheren Rückkehrvertrag. `implementation-companion.md`. Keine unbemerkte Teleportation als vermeintliche Lösung.
8. **Offen bis unmittelbarer Nachbesserung, kein vertagbarer Releaseersatz:** Die fehlenden Heftzählbilder aus den Blindlesungen. Nicht als akzeptierte Schuld wegregistrieren, wenn die aktuelle Karte ohne Bild unlösbar bleibt.

Prüf-Lücken wie der noch ausstehende Wortbuchklick und die neue Schlusskartenaufnahme sind zuerst Abschlussarbeit dieser Welle; sie sollten nicht automatisch als langfristige technische Schulden legitimiert werden.
