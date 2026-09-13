# CODEX DRAFT — NOT CANON — ROOT ONLY

## Ergebnis und tatsächlicher Prüfstand

Die beiden Zählkarten haben jetzt passende, tatsächlich zählbare Bilder. Der Schreibtisch ist als breites Schulmöbel mit Buchfach erkennbar und wird auch deutsch präzise Schreibtisch genannt. Alle betroffenen englischen Lösungsschlüssel blieben unverändert. Alle Befunde der ursprünglichen Blindleser sind unten einzeln abgerechnet; es bleibt in dieser begrenzten Kartenbahn kein offener Befund.

Aktueller Aufgabenquellhash: `c2dce3cfd76a7188ce1f9cf2cb8512209e8a2bdc3a8b91aed59ee59f48f264eb`. Das aktuelle vollständige Schülerpaket enthält 61 Karten in 106 echten Ansichten (107 Dateien einschließlich Textliste), keine Schlüssel. Die ursprünglichen A/B- und späteren C/D-Pakete bleiben als historische Belege separat erhalten. Nach den letzten vier deutschen Zeilen wurden nur die vier Ansichten 042-01/02 und 055-01/02 erneut aufgenommen; die übrigen 102 PNGs sind bytegleich. `blind-solve/language-precision-packet-delta-proof.json` belegt dies. Der private Quellabgleich, die Textliste und der Gesamtmanifest sind auf dem aktuellen Stand.

## Vollständige Blindbefunde und Auflösung

A und B lasen jeweils alle 61 Karten. Der vollständige Abgleich aller 122 Antworten, einschließlich Rohantwort und tatsächlichem Schlüssel, steht in `blind-solve/readers/answer-audit-root.json` und `.md`. Kein Autorfehler wurde als Schülerfehler beschönigt.

| Karte | Ursprünglicher Befund | Umsetzung / Nachweis |
|---|---|---|
| 029 Punkte zählen | A antwortet zero; B meldet keine sichtbaren Punkte. Der alte Zielschlüssel three war aus dem Bild nicht lösbar. | Eigene Illustration mit drei tatsächlich getrennten Punkten. C und D lösen die neue echte Ansicht unabhängig richtig und eindeutig. |
| 030 Bücher zählen | Beide wählen die grammatisch passende Antwort; A weist darauf hin, dass die versprochenen zwei Bücher nicht gezeichnet waren. | Eigene Illustration mit zwei geschlossenen Büchern auf einer weißen Heftseite. Die Bildunterschrift nennt keine Anzahl mehr. C und D zählen sichtbar zwei und wählen two books. |
| 041 Fehler finden | Das erste Paket zeigte nur die erste Fehlerwahl. | Echten zweiten Auswahlschritt ergänzt; C und D wählen door → board und bilden This is a board. |
| 042 verneinter Befehl | Zweiter Schritt fehlte im Erstpaket. D beanstandet später die Rechtschreibformulierung für einen Grammatikfehler. | Beide Schritte erfasst; C und D wählen Not → Don't. Endgültig „In diesem Satz ist ein Fehler.“; frischer Sprachleser E bestätigt diese neue Zeile. Englische Auswahl bleibt unverändert. |
| 048 Mehrzahl | B nennt chair als richtigen ersten Klick; die Erklärung nennt chairs, aber der zweite Schritt war nicht gezeigt. | Keine fälschliche Behauptung einer vollständigen ursprünglichen Lösung. Echten zweiten Schritt ergänzt; C und D wählen chair → chairs und Here are two chairs. |
| 054 Finale Hallo | A nennt Hello richtig, merkt Hi als ebenfalls passenden Gruß an. | Keine unnötige Inhaltsänderung: tatsächliche typedMachine akzeptiert Hello/Hi, Groß-/Kleinschreibung und Ausrufezeichen bereits. Bonjour und Thanks bleiben falsch; `blind-solve/finale-acceptance.json`. |
| 055 desk | B erkennt die ältere Kunst nur als hockerähnlich. C löst neue Kunst richtig, beanstandet aber Tisch/table-Mehrdeutigkeit. | Root-generierter breiter Schreibtisch proportional importiert. Drei deutsche Zielzeilen und genau nounDe.obj_desk auf Schreibtisch abgestimmt. Frischer Sprachleser E: alle Zeilen passen. Frischer Schülerleser F, nur Karte055 beider Schritte: desk, green, eindeutig. |

Die übrigen Karten der A/B-Läufe stimmen semantisch mit ihren Schlüsseln überein. Die vollständigen C/D/F-Folgeantworten (13 Zeilen) und vier E-Sprachurteile stehen in `answer-followup-audit-root.json/.md`. Lange Antwortsätze der Leser werden semantisch ausgewertet, nicht als tatsächlich getestete freie Texteingabe ausgegeben; betroffen sind Auswahlkarten. C und D waren zwei getrennte frische read-only Codex-Starts, E ein weiterer isolierter deutscher Sprachleser, F ein weiterer isolierter Schülerleser. Jeder Start erhielt ausschließlich sein Schülersichtverzeichnis; Aufträge, Logs und Schlüssel blieben außerhalb. Kein Leser sah frühere Urteile oder einen Vergleichsschlüssel. Die sechs neuen Karten wurden von C und D gemeinsam geprüft; die anschließend allein präzisierte Schreibtischkarte wurde nochmals von F geprüft. Das ist kein behaupteter zweiter vollständiger 61-Karten-Durchlauf.

## Begrenzte Implementierung und Bilder

`CardShell.tsx` erkennt exakt die beiden Heftaufgaben und ihre zugehörigen registrierten Kunststems und setzt nur deren Bildhöhe auf 180. Die PNG-Auswahl ist unabhängig vom Lösungsschlüssel. Die Karte 030 beschreibt lediglich, dass Bücher abgebildet sind. Ihre vorhandenen optionalen Worthilfen bleiben Hilfen; der Hauptreiz verrät keine Anzahl als Text. Keine aus Schlüsseln gezeichneten Punkte oder Bücher, keine neue generische Zeichenkomponente.

Builtin ImageGen zeichnete beide Heftseiten. Die ersten Originale hatten die falsche äußere Heftidentität (blau/gold statt weißes Schulheft); je eine gezielte Korrektur behielt die Zählobjekte und stellte den weißen dünnen Umschlag her. Beide Generationen, Korrekturen und Prompts sind unverändert im Sourcepack erhalten. Nur die finales Originale wurden importiert. Standardimport mit vollständigen Figuren-Grenzen plus sechs Pixeln und proportionalen 512×384-Leinwänden. Keine Pixelmalerei, keine Farbumfärbung und keine Schwellenlockerung.

| PNG | Maße | SHA-256 |
|---|---|---|
| heft_count_dots_a.png | 512×384 | e48e4966ae89e26270093ca2309cc8f7336257a63796ceccfe1c24f3c88684e6 |
| heft_count_books_a.png | 512×384 | 390d7f1bb5b32e46a894cce952c69ed8cb3213a08d2f85c5d274ec7c1e022c0d |
| obj_desk_a.png | 560×400 | 4b79954f035891108844b80a4a6a10a898bce10c1b2c709af4d5ff416ac09931 |

Sourcepacks: `docs/art/ch01-story-gamepass/heft-tasks/` und `desk-final/`, jeweils README, unveränderte Originale, genaue Prompts, registrierter Import, Quell-/Ausgabediagnosen und abschließende Hashliste. Der Schreibtisch stammt aus Roots freigegebenem Original und wurde proportional 1,4:1 registriert, nicht ins Quadrat gequetscht. Der Kunstprovenienz-Audit muss diese drei endgültigen Dateien sowie beide Sourcepacks enthalten; Root wurde vorab darauf hingewiesen.

## Eigener Prüfungs-/Tamperabsatz für den PR

Neue Garantie `cards/heft-count-portrait.test.ts`: Sie misst direkt in den tatsächlich ausgelieferten PNGs drei separate große blaue Punktflächen (4210/3935/3874 Pixel) beziehungsweise zwei große blaue Buchflächen (11715/11471 Pixel), prüft die lesbare Kartenhöhe und belegt, dass veränderte Lösungsschlüssel kein anderes Bild erzeugen. Unbeteiligte Heftkarten werden nicht vergrößert. Alle fünf neuen Tests sind grün; zusammen mit Foto- und Fensterregistrierung 19/19. Die gezielte lab-externe Rotprobe vertauscht beim Drei-Punkte-Test das echte Bild mit der Zwei-Bücher-Datei: `expected ... length of 3 but got 2`, 1 rot/4 grün. Damit schützt die Prüfung gegen genau den beobachteten falschen Bildreiz. Die erste Lab-Testkopie traf wegen eines Kommentars nur die Flächengröße; sie bleibt als Diagnose erhalten. Die korrigierte abschließende Rotprobe trifft ausdrücklich die Anzahl. Keine Torlogik wurde dafür gelockert.

Zusätzlich: bestehende Importerselbstprüfung 17 Gruppen grün. Eine auf 20 Pixel verengte Sourcecrop-Rotprobe wird vor Ausgabe zurückgewiesen, weil sie die vollständig deklarierte Heftfigur abschneidet. Paket-Typecheck grün. Die vollständige Aufgabenprüfung zeigte nach der reinen Textpräzisierung zunächst genau zwei erwartete Namenspolitik-Abweichungen; nach Anpassung ausschließlich nounDe.obj_desk ist sie wieder grün (199 Aufgaben über sechs Dateien). Entwurfswarnungen anderer Kapitel bleiben sichtbar und sind nicht neue Kapitel-eins-Erfolge.

Belege: `art-heft-tasks/tests.log`, `typecheck.log`, `importer-selftest.log`, `wrong-art-tamper.log`, `cropped-page-tamper.log`, `game-tasks-final.log` (historisch rot), `game-tasks-final-policy-aligned.log` (abschließend grün).

## Farbregeländerung Schreibtisch — eigener PR-Nachweis

In `scripts/check-colour-truth.mjs` änderte sich ausschließlich beim Schreibtisch die Dateihashbindung und die beschreibende Messbegründung. Ziel green, Familie green, warmCentre-Einstellung sowie Schwellen, Masken- und Klassifikationsverfahren bleiben unverändert. Die echte neue PNG liefert über 97707 opake Pixel: green 0.6659731387396751, warm 0.33402328003984094, Quotient 1.9937925843379556, parchmentShare 0.04095355418543243, fieldRule=true, rescuedShare=0. `desk-final-measure.json` und `desk-final-colour-gate.log` belegen die Messung und das grüne Gesamtfarbtor. Es handelt sich um eine gemessene Quellenregistrierung, nicht um eine Ausnahmeregel für schlechtes Material. Root übernimmt diesen Absatz ausdrücklich in die Toränderungsbeschreibung.

Keine Commits, PRs oder Merges durch diese Unterbahn. Die abgegrenzten Dateien sind für Roots finalen Commit bereit. Der Bericht belegt Kartenansichten und ihre Antwortlösbarkeit, nicht einen vollständigen Welt-/Bossdurchlauf oder Leistungswerte der neuen Fassung. Die separate frisch gemessene Produktionsbasis ist in `implementation-perf-baseline.md` abgeschlossen.
