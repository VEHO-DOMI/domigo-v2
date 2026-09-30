# DomiLingo: belegte Fehlergeschichte und Grenzen der Übernahme

**CODEX DRAFT — NOT CANON.** Ergänzung zu N11, keine DomiLingo-Änderung und kein
frischer DomiLingo-Prüflauf. Gelesen wurden feste Git-Dateifassungen des früheren
SRDP-practice-Projekts an `b61bcbb729f7a6ba447d91a1b213c77ef5eda496`; fremder
Arbeitsbaum und Datenbank blieben unverändert. Historische Berichte sind als solche
benannt. Implementierte Prüfungen belegen ihren Kontrollweg, nicht von selbst ihre
heutige Ausführung oder eine vollständige fachliche Abnahme.

## Fehler, blinder Fleck, wirksamer Prüfschritt und Übertragungsgrenze

| Historischer Befund / genauer Eingang | Warum die frühere Prüfung ihn nicht erfasste | Tatsächlich dokumentierter Prüfschritt oder implementierte Sicherung | DomiGo-Anwendung und Grenze |
|---|---|---|---|
| **Selbstprüfung statt unabhängiger Inhaltssicht.** `scripts/quality-audit/README.md`, „Why independent“; `docs/audit/AUDIT_REPORT.md`, §2: Juni-Selbstprüfung ließ 1.132 MANUAL-Zeilen offen. | Dieselbe Erzeugungsstrecke prüfte vorwiegend Länge/Formalia; offene menschliche Prüfung war kein positives Urteil. | Juli-Bericht trennt formale Prüfung, schlüsselfreies Lösen und fachliches Quellenurteil. Zwei während der Prüfung entdeckte Informationslecks wurden laut Bericht bereinigt und die betroffenen Lösungen neu erhoben. | W0 zählt alle Modi vor Arbeitsteilung und trennt Selbstprüfung von Koki-gestarteten Lesern. Offene Originalseiten/Zustände bleiben offen; keine Übernahme von Matura-Rubrikwerten. |
| **Richtige Freitextantworten abgewiesen.** `AUDIT_REPORT.md`, §1/§2/§4: 109 Abweichungen ergaben nach Fachurteil 84 echte Schlüsselprobleme, 20 Löserfehler, fünf mehrdeutige Items. | Einzelschlüssel und Zustimmungsmessung decken den Lösungsraum nicht ab. Eine Abweichung ist umgekehrt nicht automatisch ein Schlüsseldefekt. | Tatsächliche Antworten durch den wirklichen Bewerter, anschließend Einzelfallurteil; Varianten und Mehrdeutigkeit getrennt. F2 beschreibt den folgenden Reparatur-/Neulöseweg, keinen pauschalen Abschlussbeleg. | Alle 74 W0-Kandidaten erhalten. eraser/song lyrics/tapfer, performance/melody sowie played\|sang nach Bedeutung/Zeitrahmen unterscheiden. Nicht jeden Kandidaten blind in den Schlüssel kopieren. |
| **Lösungen in Nebenzuständen.** `AUDIT_REPORT.md`, §1/§4/§5: 85 Aufgaben mit ausgefülltem `sourceText` auf der Ergebnisseite; Metadaten in Hilfefeldern. `fix_f0_sourcetext.py` bearbeitet vier Open-Cloze-Fälle. | Erstansicht verwendete den Lückentext, Ergebnisseite ein anderes Feld. Nachträglicher Textfilter erfasste nicht alle Metadatenklassen. | Gelesener Fix erzeugt Ergebnistext aus Lückensegmenten: echte Lücken leer, bewusst gezeigte Beispiele erhalten. Vier Fälle sind nicht die 85 Gesamtfälle; §6 nennt weitere Wellen. | Öffentliches Paket: Namen, HTML-Attribute, Assets, Archive und private Zuordnung zusammen prüfen. Neuer Lernweg zusätzlich mit Ergebnis-/Hilfe-/Retry-Zuständen; Paketprüfung beweist nicht sämtliche Live-Oberflächen. |
| **Seltenes Fehlerfindeformat nicht gespielt.** `AUDIT_REPORT.md`, §1/§5; `fix_ed_tick_leak.py`: sechs konkrete Aufgaben mit sichtbaren Lösungshäkchen. | Daten strukturell gültig; Format nach Erzeugung nicht fachlich erneut gelesen. Seltene Formate versteckten systematische Fehler. | Fix entfernt Häkchen aus sichtbaren Aufgabenzeilen/Quelltext, erhält privaten Schlüssel. Schlüssel und Beispiele ausdrücklich getrennte fachliche Reparaturen. | Ganze betroffene Fehlerklasse erfassen. p019 verlangt Satzkorrektur; nicht mit Matura-„überflüssiges Wort“ gleichsetzen und nicht in Auswahl verwandeln. |
| **Wörtliches Wiederfinden statt Verstehen.** `scripts/review/stem-overlap.mjs`, Kopf: avocado_boom Item 8; `AUDIT_REPORT.md`, §2: offene Formate nur stichprobenartig. | Tore maßen dieses Kriterium nicht. Auch die spätere längste Wortfolge allein übersah laut Messkopf zusammengesetzte kurze Textbrocken. | `test-stem-paraphrase.ts` prüft sichtbare/gestempelte Aufgaben formatabhängig; Wächter W1–W3 setzen Verstöße und einen erlaubten Gegenfall ein. Quellenurteil bleibt nötig. | Lernhandlung zuerst bestimmen. Wiedererkennen darf bei Anfängern beabsichtigt sein (p008); keine Vier-/Sechs-Wort-Schwelle oder pauschale Paraphrasepflicht importieren. |
| **Falsche Quelle/Formatkanal erzeugt Scheinalarm oder Entwarnung.** Messkopf `stem-overlap.mjs`: Hörtranskript ≠ Arbeitsblatt; Zuordnungstexte teils in `bank[]`; Absatzgrenzen/kurze Texte. `test-stem-paraphrase.ts`: 164 falsche Treffer in 18 RC-MM-Aufgaben. | Einheitliches Textfeld oder Prozentmaß ignoriert die Handlung. | Quelle/Itemtext pro Format bestimmen; W3 lässt wörtliche Arbeitsblatt-Stems bei unabhängigem Transkript zu. Direkte Quellenantworten und bauartbedingt wörtliche Lückentexte haben begründete Ausnahmen. | SB/WB/Story/Bildfunktion trennen; Strukturkandidat ist kein Einzelbeleg. Ausgabe/Seiten/Sichtumfang prüfen. Eigene Formatbegründung statt derselben Ausnahme-Codes. |
| **Urteile können nach Änderungen falsche Dateien beschreiben.** `test-quality-sidecars.ts` erläutert Gefahr; `lib/revision-stempel.ts` sichert Freigaben. | Gespeichertes Urteil beweist nicht, dass sein Gegenstand unverändert blieb. Historische Gefahrenbeschreibung, kein hier neu behaupteter Fehlmerge. | Sidecar — separate historische Bewertungsdatei — zählt veränderte/verwaiste Gegenstände als unranked. Freigabestempel mit falscher Datei-Prüfsumme wird abgewiesen; geprüft/überarbeitet verlangt perfect plus Prüflauf. | Inhalt/Antwort/Darstellung/Quelle und Leserfassung binden. Alte 6941…-Nein nicht auf 8531…/Folgefassung übertragen; unveränderte Einzelbelege erhalten. Dateihash prüft keine Semantik. |
| **Indirekter Informationsweg fehlte im Schutztest.** `test-quality-sidecars.ts`, (c), F-1/Amendment 2. | Erst nur app/components durchsucht; lib-Hilfsdatei konnte interne Bewertungen laden. | Suchraum um lib erweitert, zusätzlich gebaute Aufgabenseiten geprüft, sofern Build vorhanden. Ohne Build ausdrücklich SKIPPED, nicht bestanden. | Indirekte Assets/Attribute/Zuordnung erfassen. Code-Suche allein beweist keine sichtbare Schlüsselfreiheit; GG-Manipulationsproben sind separate Belege. |
| **Live berechnete Paketgrenzen verschieben Arbeitsmengen.** `docs/revision/README.md`, „Die Pakete“ beschreibt den Mechanismus. | Archiviert ein Paket Aufgaben, verschieben sich später neu berechnete Grenzen. Keine abgeschlossene Schadensgeschichte behauptet. | Eingefrorene disjunkte Menge; `test-revision-stempel.ts` prüft Abdeckung einschließlich Nachfolger und erhält verworfene Gegenstände. | Gesamtbestand/Ansichten vor Verteilung fixieren, alle 20 Piloten führen, Folgeversionen zuordnen. DomiLingo-Zahlen 13/253 sind keine DomiGo-Sollzahlen. |

## Originaldateien und Fassung

Alle Links zeigen auf denselben festen Commit. MD5 dient der Wiedererkennbarkeit;
zusätzliche SHA-256 und unveränderte Lesekopien stehen im externen Beleg
`n11-source-pins-v2.json`. Keine fremden Berichte/Rohlogs ins Produktrepo kopiert.

| Originaldatei am festen Commit | MD5 |
|---|---|
| [Auditbericht](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/docs/audit/AUDIT_REPORT.md) | `f66c87ed0403d7d901b2092fe4cd1aba` |
| [Unabhängige Prüfung](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/scripts/quality-audit/README.md) | `c59094470f5f3c7b584276fd1fc7f554` |
| [Sichtbare Lösungshäkchen](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/scripts/quality-audit/fix_ed_tick_leak.py) | `e2792e8b0a35f5a8d959d65d5cdf01ea` |
| [Vier Ergebnistext-Lecks](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/scripts/quality-audit/fix_f0_sourcetext.py) | `cb98c1b2dc57a3b0f12a780431526553` |
| [Messfallen/Quellenwahl](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/scripts/review/stem-overlap.mjs) | `23587c03104fe7e927a5dc05c0b7d0c0` |
| [Paraphraseprüfung/Gegenfälle](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/scripts/test-stem-paraphrase.ts) | `61448eca928669dcc6ff6cdeb2e73952` |
| [Historische Bewertungen/Oberflächenschutz](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/scripts/test-quality-sidecars.ts) | `5237a85756b8ae364dd200eea0b34d9a` |
| [Freigabedatei-Prüfung](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/lib/revision-stempel.ts) | `ff676e632fdf48c4cac5ea1714411dec` |
| [Revisionsablauf/eingefrorene Menge](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/docs/revision/README.md) | `6b5aef54f26e5098b2f637faa07751c1` |
| [Mengen-/Stempelprüfung](https://github.com/VEHO-DOMI/srdp-practice/blob/b61bcbb729f7a6ba447d91a1b213c77ef5eda496/scripts/test-revision-stempel.ts) | `018635478fa38f8eb90d2fef8d319803` |

Die drei anfänglich freigegebenen Referenzdateien stimmen mit GG-Runde-7-Pins
überein. Weitere Originaldateien wurden für N11 **am selben Commit** gelesen.
Die Schlussfolgerungen hier sind Autorenselbstprüfung. Fehlende DomiGo-Belege
stehen in [ANFORDERUNGSLUECKEN.md](ANFORDERUNGSLUECKEN.md); dieses Quellenstudium
schließt die dortigen Lücken nicht automatisch.
