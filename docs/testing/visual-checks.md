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
Alle 240 Zustände erhalten ein PNG; der fertige innere Inhalt wird vor der Aufnahme abgewartet. 40 Zusatzproben prüfen erhaltene Eingaben/Bewertung beim Sprachwechsel,
0 Vorschau-Antwortsendungen/0 Vorschau-XP im Practice-Pfad sowie 50 auswählbare Figuren.
Ein unmutierter Kontrolllauf muss zuerst bestehen. Jede Fehlerprobe muss ihren tatsächlich ausgeführten Mutationsanker und ihren zugeordneten Behauptungsfehler melden; Startabstürze zählen nicht als gefundener Fehler. Eine Gegenprobe mit fehlendem esbuild wird verweigert. Die Fehlerproben verändern Sprache, Zustandsidentität, Aufgabenrichtung,
Avatarbeschriftung, Vorschau-Senden und Vorschau-Klang. Jede muss scheitern.
Das ist kein Beweis für sämtliche Antworten, alle Dialogzustände oder die
Punktebuchung der anderen Lernwege. Die alten Review-/Path-XP-Pfade sind auf 132 erfasst.

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
Navigation, Aufgaben oder ganzen Karten. Die vier Akzentvariablen jeder Jahrgangspalette werden gegen eine feste Tabelle geprüft. Auf den tatsächlichen Lernrouten werden außerdem die 44-Pixel-Kopfziele geprüft; im Lernpfad vollständige Zeilenbreite und Aktionskontrast. Vier Aufgabenübersicht-Proben prüfen Sprache/Darstellung über Home und zurück sowie den Erhalt des Dokuments beim Öffnen eines Eintrags. Die echte Detailroute erhält dafür ausschließlich eine synthetische Aufgabe ohne laufenden Versuch; neue Versuche und alle Schreibzugriffe sind gesperrt. Eine vollständige fachliche Aufgabenabnahme ist das nicht.

Referenzen tragen SHA-256-Dateifingerabdrücke und Browser-/Betriebssystem-/Architektur-
und Prüfkonfigurationsangaben. Abweichende Umgebungen werden verweigert.
`source-manifest.json` hält App, gemeinsame Pakete, Inhaltskorpus, Bilder, Schriften, Prüfhilfen und Konfiguration fest. Abhängigkeitspakete und erzeugte Bau-/Cacheverzeichnisse sind ausgeschlossen; der Lockfile und die Browserumgebung sind erfasst. Änderungen und neue/gelöschte Quelldateien während
des Laufs machen dessen Ergebnis ungültig. Deshalb keine Produktedits während
laufender Vergleiche. Die temporäre App bindet Workspace-Pakete gemeinsam ein.

Der Browser verwendet feste sRGB-/Rasteroptionen. Grundlage:
[Chrome-Team: Browserflags für Prüfwerkzeuge](https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md).
Die Optionen ersetzen keinen gelungenen Wiederholungsvergleich.

Zehn V-1-Fehlerproben: falscher Akzent, Verschiebung um 1 Pixel, abgefangener
Datenbankaufruf, abgefangener fremder Netzwerkzugriff, manipuliertes Referenzbild,
fehlendes Referenzbild, verkleinerte Kopfknöpfe, verkürzte Lernpfadzeile, blasser Startverweis und ein vollständiges Neuladen bei interner Navigation. Die acht Quellstand-Gegenproben verändern App-/Spiel-/Engine-/Inhalts-/Bild-/Fontdateien sowie die Dateimenge.
`--grep`/`--project` wählen Teilmengen und melden ausdrücklich nur Teilprüfung.

Für einen freigegebenen externen Teststand gibt es `--url` plus `--accounts`:
JSON mit `synthetic:true` und `states` für `student-1` bis `student-4` und `teacher`
(jeweils Pfad zu einem Playwright-Anmeldestatus). Keine echten Kinderkonten verwenden,
keine Konten automatisch erzeugen, Dateien nicht ins Repo aufnehmen. Dieser Weg
wurde hier nicht mit einem ausgelieferten Stand ausgeführt und ersetzt keine
Anmelde-/Berechtigungsprüfung. Er bleibt Teil der GG-Abnahme128.

## Automatische Prüfung und offene Freigaben

Der Job `visual-reproducibility` in `ci.yml` prüft Kandidaten-Reproduzierbarkeit: Aufnahme, frischer Vergleich,
Fehlerproben und Lernflächen; Belege bleiben 30 Tage als GitHub-Artefakt erhalten.
Ein neu aufgenommener Kandidat ist **kein** freigegebener Vergleich mit einem älteren
Commit. Eine dauerhaft verpflichtende, von Koki angenommene Referenz braucht die
Ablageentscheidung133 (Blueprint verlangt committete Baselines, AGENTS verbietet
Bildbelege im Repo) und die Abnahme128. Bis dahin darf diese CI nicht als vollständiges
V-1-Abnahmetor bezeichnet werden. Sie sagt auch nichts über Produktion oder reale
Punktebuchung aus. Der ältere isolierte Trainervergleich aus114 bleibt ein eigener Nachweis: Mit den festen Browser-Rasteroptionen besteht nun auch dessen 160/160-Wiederholung bei unveränderter 3/255-Farbkanaltoleranz. Die damalige 7/160-Abweichung bleibt als Entwicklungsergebnis dokumentiert.

## Feste Referenz und externe Aufgaben · cgo-156

CODEX DRAFT — NOT CANON · IN REVIEW. Die SHA-256-Liste
`apps/web/e2e/visual-baselines.sha256` bindet genau 92 Bilder und deren Manifest
an eine ausdrücklich benannte externe Paketversion. `check-visual-reference.mjs`
verweigert fehlende Dateien, geänderte Bytes, geänderte Prüfsummen, fremde Pfade,
Symlinks und einen anderen Prüfvertrag. Der normale CI-Lauf übernimmt niemals
seine eigenen neuen Bilder als feste Referenz. Ein Paketwechsel braucht einen
sichtbaren Review der Liste und des Paketverweises; Kokis Bildurteil bleibt
separat bei cgo-128. Rohbilder und Prüfprotokolle werden nicht eingecheckt.

`verify-design.mjs --reference-index <sha256-list> --baseline <package/reference>`
prüft zuerst diese Pins. Browser, Betriebssystem und Architektur müssen weiter
passen. `capture-contract` bezeichnet den unveränderten Vertrag bei Aufnahme;
`compare-contract` bindet den ausdrücklich geprüften Vergleichscode. Damit lässt
sich die hier nötige Korrektur einer nichtvisuellen Navigationserwartung belegen,
ohne alte Bilder oder ihre Manifest-Prüfsumme umzuschreiben. Ohne expliziten Index
gilt weiterhin die bisherige strenge Gleichheit des gesamten Vertrags.

Der Testserver darf die Uhr des Next-/Webpack-Prozesses nicht einfrieren.
Nach einem festgehaltenen Zeitpunkt gespeicherte Quelldateien bleiben sonst für
den Compiler „aus der Zukunft“ und er beendet die Übersetzung nicht. Browserzeit
und synthetische Fixture-Daten bleiben festgelegt; ausschließlich die bereits
benannten datumabhängigen Home-Texte werden im Bildvergleich maskiert.

Für `--url` bleiben ausschließlich genehmigte synthetische Konten zulässig.
`VISUAL_ASSIGNMENT_URL` oder `assignmentUrls["student-1"]` im Kontenvertrag kann
das Ziel nennen; ohne Vorgabe wird die erste sichtbare Aufgabe der Testklasse
verwendet. Das Ziel muss ein auf der Übersichtsseite vorhandener Aufgabenlink
auf demselben Ursprung sein. Normale UUID-Kennungen sind erlaubt. Fremder
Ursprung, Zugangsdaten in der URL, Query/Fragment, falsche Route oder fehlende
Testaufgabe brechen mit `V1_ASSIGNMENT_INVALID` bzw. `V1_ASSIGNMENT_MISSING` ab.
Der lokale Fixture-Modus behält ausschließlich sein lokales synthetisches Ziel.

Die Abzeichen-Vorher-/Nachher-Bilder liegen separat im Koki-sieht-Paket:
vier Jahrgänge × 375/1400 px × hell/dunkel = 16 je Stand. Das Profil erweitert
nicht stillschweigend die bestehende 92er-Routenmatrix. Die Klassen-/Eigentümer-
und Abzeichengrenzen werden zusätzlich mit PGlite und den echten Renderfunktionen
geprüft; browserseitige Berechnung und dauerhafte Theme-Speicherung müssen bei
absichtlichen Gegenproben rot werden.

### Festgelegtes Linux-Paket (explizite Aufnahme, kein automatisches Nachziehen)

Version `cgo156-0df56205-linux-x64-chromium155`, GitHub-Actions-Artefakt `12565730940`
aus Lauf `40107298946` am Quellkopf `0df5620576deffd9c2b4b7f19598fe242cfd4037`.
ZIP-SHA-256: `1971dfcf4015ad30eb4546ae84a5934c43c7f2a239ac9c2b307aef82759ff6a8`. Der Abruf prüft zusätzlich
Quellkopf, Lauf, Ablaufstatus, API-Digest und alle 93 Einzeldateien.
Der getrennte CI-Job `visual-fixed-reference` vergleicht die aktuellen 92 Routen
mit genau diesem Paket. Die weiterhin vorhandene Kandidaten-Wiederholungsprüfung
ist ein eigener Test und kann diese Referenz nicht ersetzen.

**Aufbewahrungsgrenze: 2026-11-23T15:38:19Z.** GG muss dieses konkrete Paket vor
dem Ablauf dauerhaft archivieren und einen ausdrücklich geprüften Abrufort
festlegen. Fehlendes/abgelaufenes Paket führt zu Rot; es wird weder übersprungen
noch durch eine neuere Aufnahme ersetzt. Der PR benennt die dauerhaft lokal
gesicherte Kopie für diese Übergabe. Eine spätere Spiegelung muss die bestehenden
Bild-/Manifest-Prüfsummen erhalten. Kokis Bildfreigabe bleibt offen.
