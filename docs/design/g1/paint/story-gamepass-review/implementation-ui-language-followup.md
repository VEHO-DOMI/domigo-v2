# CODEX DRAFT — NOT CANON

## Ergebnis und begrenzte Änderungen

Alle sechs Stolperbefunde aus `blind-language/ui-reader.txt` wurden an den tatsächlichen Quellen korrigiert. Die vorhandene Datei des ersten Lesers bleibt vollständig erhalten. Keine Mechanik, Karte, Antwort oder Zählerberechnung wurde in dieser Lane geändert.

`packages/game-paint/src/PaintGame.tsx`, ursprüngliche Leserzeilen 121 und 122: „Stell dich davor und öffne die Aufgabe.“ ersetzt die symbolabhängige erste Anweisung; der zweite Satz über Schließfach bzw. Käfig bleibt erhalten. AGENTS §5 erlaubt die ausgeschriebene Pfeiltaste nur bei programmweiter Regelung; die offene Registerstelle D-884 belegt noch keine solche Freigabe. Daher keine lokale Behauptung einer neuen Tastenbenennung. Die tatsächliche Aufgabe wird weiterhin vor dem Gegenstand geöffnet; Bedienelemente und Eingabeverarbeitung bleiben unverändert.

Dieselbe Datei, Leserzeile 126: Der tatsächliche Bestand eins wird als „einen Buchstaben“ ausgegeben. Null und alle übrigen Bestände behalten die Ziffer mit Mehrzahl. Leserzeile 169: Eine Gegenstandsbezeichnung mit weiblichem Artikel erhält „ihrem Platz“, die vorhandenen Bezeichnungen „das Tablet“ und der Ausweichtext „Das Gerät“ behalten „seinem Platz“. Die tatsächliche Zeile lautet jetzt „Die Musikanlage steht wieder an ihrem Platz.“

`packages/game-paint/src/story/ClassPhoto.tsx`, Leserzeile 197: Genau ein noch fehlendes Klassenkind führt zu „Wir müssen noch ein Kind finden. Suchen wir im nächsten Kapitel weiter!“ Null und Mehrzahl bleiben unverändert.

`packages/game-paint/src/cards/run-variants.ts`, Leserzeile 243: Der Hinweis beim englischen Zahlenwort fragt jetzt „Welche Zahl ist mit dem englischen Wort gemeint?“ Er nennt keine Antwort, verändert keine Zufallszahlen und zählt nicht mehr sprachlich zu einem Wort. Die Gegenrichtung bleibt unverändert.

Der zuletzt vom Root korrigierte Tablet-Hinweis aus `ch01.tasks.v2.json` wurde exakt mitgelesen und nicht bearbeitet: „Du bedienst das Gerät über seinen Bildschirm.“ BuchClient benötigte in dieser Lane keine Änderung.

## Frischer unabhängiger Leser, wörtlich

Neuer separater `codex exec -m gpt-5.6-sol -s read-only`-Lauf nach AGENTS §4, ohne Gesprächskontext. Der Auftrag enthielt ausschließlich die Rolle der österreichischen Volksschullehrerin und sieben vollständige Schülerzeilen, keine Fundstellen, Antworten, ursprünglichen Befunde oder erwarteten Urteile. Keine Werkzeuge bzw. Repository-Recherche im Leserauftrag. `UI-FOLLOWUP-AUFTRAG.txt`, `ui-followup-student-lines.txt`, `ui-followup-reader.log` und `ui-followup-reader.txt` dokumentieren den vollständigen Lauf.

001 | geschrieben | Verständlich, aber „die Aufgabe öffnen“ klingt beim Vorlesen technisch und etwas steif.  
002 | geschrieben | Verständlich, aber „die Aufgabe öffnen“ klingt nicht wie natürlich gesprochene Sprache.  
003 | Mensch | Der Satz ist kurz, klar und klingt natürlich.  
004 | Mensch | Der Satz lässt sich flüssig vorlesen und ist sofort verständlich.  
005 | Mensch | Die Aufforderung klingt lebendig, freundlich und natürlich gesprochen.  
006 | Mensch | Die Frage ist klar formuliert und für Kinder gut verständlich.  
007 | geschrieben | „Über seinen Bildschirm“ ist verständlich, klingt aber technisch und etwas steif.

Mensch: 4  
geschrieben: 3  
stolpere: 0

Kein Stolperbefund bleibt offen. Die drei Bewertungen „geschrieben“ werden hier ausdrücklich erhalten und nicht zu „Mensch“ umgedeutet.

## Prüfungen und Auszug

Bestehende Zahlenvarianten-Tests: 8/8 grün, `ui-language-followup-variants.log`. Web-Typprüfung: Exit 0, `ui-language-followup-typecheck.log`. Keine Teständerung; keine neuen Tests, die lediglich die neue Formulierung wiederholen.

Der vollständige UI-Auszug wurde aus den aktuellen Quellen erneut erzeugt. Die Auswertung der Zahlen-Hinweise hängt jetzt an der tatsächlichen deDesc-Quellzeile statt an einem bestimmten Anfangswort. Dadurch werden beide Zweige auch nach einer sprachlichen Korrektur erfasst. `ui-followup-mapping.json` verbindet den Nachlauf mit den neuen Originalfundstellen; `ui-sourcehashes.json` und `pin-verification.json` dokumentierten bei diesem ersten Nachlauf 34 Quellen und 252 Leserzeilen; der unten dokumentierte abschließende Stand umfasst 34 Quellen und 255 Leserzeilen. Der Tablet-Hinweis bleibt als zusätzliche siebte Zeile in der Nachlaufdatei, weil Karten im vollständigen UI-Auszug absichtlich getrennt bleiben.

Keine Commits oder externen Datenänderungen. Keine Behauptung eines neuen Browser-Durchspiels; es handelt sich um den Quelltext-/Sprachnachlauf mit unveränderten bestehenden Mechaniktests.

## Zusätzliche Arena-Einzelzeile

Root ergänzte anschließend den konkreten sichtbaren Bezug „Die Tafel ist verhext und voller Kritzeleien.“ in cards/arena.ts. Ein weiterer neuer kontextfreier Codex-Leser erhielt ausschließlich diesen Satz. Wörtliches Ergebnis aus `blind-language/arena-followup-reader.txt`:

001 | Mensch | Klingt natürlich, lebendig und ist für Volksschulkinder sofort verständlich.

Mensch: 1 · geschrieben: 0 · stolpere: 0

## Letzte Zählerüberschrift

Root änderte die Kapitel-eins-HUDüberschrift zu „Schlösser“. Ein nochmals neuer Codex-Leser erhielt nur diesen Zählerkopf und den tatsächlichen Anzeigenstand 1/4. Wörtlich aus `blind-language/hud-followup-reader.txt`:

001 | Mensch | „Schlösser – eins von vier“ ist als Zähler klar, natürlich und kindgerecht verständlich.

Mensch: 1 · geschrieben: 0 · stolpere: 0

Der bereits gelesene Name Klecks in der neuen Sprecherkomponente wurde lediglich als weitere echte Quellfundstelle erfasst. Der endgültige vollständige UI-Auszug hat nun 255 Zeilen.
