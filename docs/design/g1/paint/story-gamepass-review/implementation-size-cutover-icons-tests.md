# CODEX DRAFT — NOT CANON

# Drei überholte Testverträge nach Welle 36

13.09.2026. Ausschließlich `ent-size.test.ts`, `oneBlockCutover.test.ts`, `cards/PaintedIcons.test.ts` geändert. Keine Engine-, Level-, PNG- oder UI-Datei für den Fix verändert. Keine Tests gelöscht, keine beliebige Mindestzahl gesenkt. Die sechs vorherigen Fehler stehen in `preflight-all-tests.log`.

## Größenprüfung — eigener PR-Absatz

Die alte Kapitel-1-Erwartung von fünf gleich großen Käfigen passt nicht mehr zur ausdrücklich gewünschten Trennung zwischen Personen, normalen Dingen und Geräten. Der neue Test verlangt exakt Musikanlage und Tablet im jeweiligen Geräteschließfach, Merle im Penal und das Klassenfoto im eigenen Rahmen. Die Stuhl-Wiederherstellung darf keinen fünften Käfig einschleusen. Identität, Haut, Rahmenart und Insasse sind wörtlich gepinnt; die zentrale Größenfunktion muss für die beiden Geräte 48 Pixel und für Penal/Foto 54 Pixel liefern. Alle anderen Kapitel behalten die bisherige Erwartung `CAGE_DISPLAY_H`; der normale Käfig wird zusätzlich ausdrücklich auf 34 Pixel geprüft. Eine absichtlich auf 34 zurückgesetzte Gerätegröße wird in einer isolierten echten Quellenkopie rot erkannt.

## Körperpartition — eigener PR-Absatz

Die vom Nutzer geforderte Tür auf dem Boden entfernt genau eine alte Podestzelle. Deshalb lautet die tatsächliche Partition jetzt 492 feste Körperzellen plus 17 Möbelzellen gleich 509, weiterhin mit fünf gemalten Schrägzellen und exakt sechs Bildkörpern. Die Prüfung kontrolliert zusätzlich die konkrete Türzelle (Spalte 60, Zeile 14 ist X und nicht fest), die darunterliegende feste Laufzelle und den zugehörigen Besitz der Bildkörper. Eine vollständige unveränderte Partitionsprüfung bleibt erhalten; keine fehlende Fläche wird einfach ausgenommen. Das tatsächliche Wiedereinsetzen des alten Podests in einer isolierten Levelkopie macht die Prüfung rot.

## Gemalte Symbole — eigener PR-Absatz

Anstelle der veralteten Mindestforderung nach mehr als fünf statischen Symbolaufrufen prüft der Test jetzt die exakten fünf verbleibenden Identitäten brush, door, slate, spark und uniform. Die neuen echten Prolog-/Mentorzeichnungen erklären den geringeren Symbolbedarf. Fremde Namen, doppelte Ersatznamen und ein fehlender Aufruf bleiben damit Fehler. Sämtliche bisherigen Emoji-Verbote, Namensauflösung dynamischer Varianten und Gleichheit mit der Kunst-Stammliste bleiben bestehen. Die gezielte Gegenprobe ersetzt brush durch einen zweiten, an sich gültigen door-Aufruf: gleiche Anzahl, aber falsche Identität wird rot.

## Verifikation

`final-size-cutover-icons-tests.log`: 84/84 Tests, drei Dateien grün. `git diff --check` im eigenen Dateiumfang grün. Die Gegenproben verwenden vollständige frische Kopien der betroffenen Quellen und Leveldaten im Labor; externe unveränderte Paketabhängigkeiten sind nur verlinkt. Im echten Repository wurde dafür keine Produktionsdatei umgeschaltet. `final-size-cutover-icons-tampers.py` enthält das reproduzierbare Verfahren; Ausgänge in `size-cutover-icons-tampers/results.json`.

Zwei erste Versuche, die isolierte Kontrolle zu starten, scheiterten an fehlender Basiskonfiguration bzw. fehlender benachbarter Workspace-Abhängigkeit. Diese sind reine Labor-Harnessfehler und ausdrücklich keine erfolgreichen negativen Proben. Beide Protokolle bleiben als `baseline-first-missing-config.log` und `baseline-second-missing-workspace-dependency.log` erhalten. Erst ein vollständiger grüner Kontrolllauf und anschließend die erwarteten konkreten Assertions zählen.

Der Paket-Typecheck traf während der parallelen Testkorrekturen ausschließlich zwei mögliche undefined-Zugriffe in `entities.test.ts:797` und `f5-feel.test.ts:476`; Root wurde informiert. Die eigenen drei Testdateien erzeugten keine Typfehler. Ein eventuell späterer grüner gemeinsamer Wiederholungslauf wird getrennt berichtet; dieser Zwischenstand wird nicht verschwiegen.

**Abgeschlossene Gegenproben:** Unveränderte isolierte Kopie 84/84 grün, Exit 0. Gerät 48→34: konkret expected 34 to be 48, Exit 1. Altes Podest zurück: konkret # statt X und Verlust der vollständigen p3-Bildpartition, Exit 1. Brush durch zweiten Door ersetzt: gleiche Anzahl mit falscher Namensliste, Exit 1. Alle Fehlerausgaben tatsächlich gelesen; keine Startfehler als negative Belege gewertet.
