# W7 / V-1 · lokale Prüfwerkzeuge (cgo-129)

Stand: IN REVIEW · CODEX DRAFT — NOT CANON. Kein Abschluss von W7/V-1/GO-1.
Referenzablage und Abnahme sind auf cgo-133/128 noch offen.

## Lernflächen

```sh
node scripts/check-learning-display.mjs --out /tmp/learning-current
node scripts/check-learning-display.mjs --selftest --out /tmp/learning-mutants
node scripts/check-learning-display.mjs --before-ref <basis-sha> --out /tmp/learning-before
```

Die Prüfung montiert echte React-Komponenten und lädt echte freigegebene Aufgaben.
Nur externe Ein-/Ausgabe wird ersetzt. Jahrgänge 1–4, 375/1400 Pixel, hell/dunkel,
in Jahrgang 1 zusätzlich beide Sprachen: 160 Anfangsansichten plus 80 Rückmeldungen
(correct/partial/close/wrong) ergeben 240 Ansichten. Geprüft werden Überlauf,
44-Pixel-Bedienziele, sichtbare Textkontraste und Ränder von Eingabe/Sprachwahl.
40 Zusatzproben prüfen erhaltene Eingaben/Bewertung beim Sprachwechsel,
0 Vorschau-Antwortsendungen/0 Vorschau-XP im Practice-Pfad sowie 50 auswählbare Figuren.
Die Fehlerproben verändern Sprache, Zustandsidentität, Aufgabenrichtung,
Avatarbeschriftung, Vorschau-Senden und Vorschau-Klang. Jede muss scheitern.
Das ist kein Beweis für sämtliche Antworten, alle Dialogzustände oder die
Punktebuchung der anderen Lernwege. Die alten Review-/Path-XP-Pfade sind auf132 erfasst.

`--before-ref` zeichnet den früheren Stand mit dessen ursprünglichem Komponentenrahmen.
Die 128 Bilder dienen dem Vergleich; bekannte frühere Kontrastfehler machen diesen
Dokumentationslauf nicht rot. Die normale Nachher-Prüfung bleibt streng.

## Echte Next-Routen

```sh
# Referenzkandidat, ausschließlich in einen neuen externen Ordner:
node scripts/verify-design.mjs --capture --out /tmp/visual-candidate
# Unabhängiger Folgelauf: fehlt ein Bild oder weicht ein Pixel ab, ist er rot.
node scripts/verify-design.mjs --baseline /tmp/visual-candidate/reference --out /tmp/visual-repeat
node scripts/check-design-selftest.mjs --baseline /tmp/visual-candidate/reference --out /tmp/visual-mutants
node scripts/lib/visual/source-snapshot.mjs --selftest
```

23 Routenkombinationen × zwei Breiten (360×740/1280×800) × hell/dunkel = 92 Bilder:
Home, Practice, Learn, Review und Assignments je vier synthetische Jahrgänge;
Admin als synthetische Lehrkraft, Sign-in als Gast und die tatsächliche Novel-Spielhülle
`/play/3/ch01` als Lehrkraftvorschau. Admin/Sign-in/Spiel besitzen nicht alle die
Trainer-Themenschaltung; geprüft wird dort ihre bestehende Reaktion auf die
Browserdarstellung, kein erfundener Schalter.

Der temporäre Next-Server nutzt die echte Root-Layout-/Header-/Middleware-Kette,
Routen und Komponenten. Nur Authentifizierung und Datenzugriff werden durch
festgelegte synthetische Daten ersetzt; die direkte Arena-Datenabfrage erhält ebenfalls
einen expliziten Ersatz. Reine Scope-/Journey-/Zugriffshelfer bleiben Originalcode.
Die Kopie enthält keine `.env`, keine produktiven API-Routen und keine echte Datenbank.
Ein verweigernder Datenbankadapter und Netzwerkschutz protokollieren auch abgefangene
Zugriffsversuche. Der Browser erlaubt nur GET/HEAD an denselben lokalen Server.
Originalfonts und Originalbilder werden vollständig geladen, bevor ein Bild zählt.

Es gibt keine tolerierten Bildunterschiede (`threshold:0`, `maxDiffPixels:0`),
keine Testwiederholung und keine automatische Referenzerneuerung beim Vergleich.
Nur die zeitabhängigen Home-Wörter und die Datumsspalte werden maskiert, keine
Navigation, Aufgaben oder ganzen Karten. Die vier Akzentvariablen jeder
Jahrgangspalette werden gegen eine feste Tabelle geprüft.

Referenzen tragen SHA-256-Dateifingerabdrücke und Browser-/Betriebssystem-/Architektur-
und Prüfkonfigurationsangaben. Abweichende Umgebungen werden verweigert.
`source-manifest.json` hält die untersuchten Quellbytes fest; Änderungen während
des Laufs machen dessen Ergebnis ungültig. Deshalb keine Produktedits während
laufender Vergleiche. Die temporäre App bindet Workspace-Pakete gemeinsam ein.

Der Browser verwendet feste sRGB-/Rasteroptionen. Grundlage:
[Chrome-Team: Browserflags für Prüfwerkzeuge](https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md).
Die Optionen ersetzen keinen gelungenen Wiederholungsvergleich.

Sechs V-1-Fehlerproben: falscher Akzent, Verschiebung um 1 Pixel, abgefangener
Datenbankaufruf, abgefangener fremder Netzwerkzugriff, manipuliertes Referenzbild,
fehlendes Referenzbild. Die Quellstand-Gegenprobe verändert zusätzlich eine Datei.
`--grep`/`--project` wählen Teilmengen und melden ausdrücklich nur Teilprüfung.

Für einen freigegebenen externen Teststand gibt es `--url` plus `--accounts`:
JSON mit `synthetic:true` und `states` für `student-1` bis `student-4` und `teacher`
(jeweils Pfad zu einem Playwright-Anmeldestatus). Keine echten Kinderkonten verwenden,
keine Konten automatisch erzeugen, Dateien nicht ins Repo aufnehmen. Dieser Weg
wurde hier nicht mit einem ausgelieferten Stand ausgeführt und ersetzt keine
Anmelde-/Berechtigungsprüfung. Er bleibt Teil der GG-Abnahme128.

## Automatische Prüfung und offene Freigaben

`visual-design.yml` prüft Kandidaten-Reproduzierbarkeit: Aufnahme, frischer Vergleich,
Fehlerproben und Lernflächen; Belege bleiben 30 Tage als GitHub-Artefakt erhalten.
Ein neu aufgenommener Kandidat ist **kein** freigegebener Vergleich mit einem älteren
Commit. Eine dauerhaft verpflichtende, von Koki angenommene Referenz braucht die
Ablageentscheidung133 (Blueprint verlangt committete Baselines, AGENTS verbietet
Bildbelege im Repo) und die Abnahme128. Bis dahin darf diese CI nicht als vollständiges
V-1-Abnahmetor bezeichnet werden. Sie sagt auch nichts über Produktion oder reale
Punktebuchung aus. Der ältere isolierte Trainervergleich aus114 bleibt ein eigener
Nachweis mit seiner damals dokumentierten offenen 7/160-Abweichung.
