# DomiGo · ein Blatt zum Anfassen

**CODEX DRAFT — NOT CANON · cgo-007 · nur Lehrer-Muster.**

Ein vollständiger Weg: Einstieg → Wort erkennen → Kurzform wählen → Rückmeldung → erneut üben. Bs Heftpapier trägt As farbige Aufgabenkarte. Fredoka aus dem freigegebenen Repository bleibt die Schrift für Antippbares; Georgia ersetzt die dort fehlende Literata. Keine neue Kunst, keine produktive Route, keine Paketabhängigkeit.

## Starten

Node 24 oder neuer reicht. Dieser Befehl baut das Muster aus den gepinnten Quellen in einen temporären Ordner und startet es ausschließlich auf diesem Rechner:

```sh
node /Users/veho/Code/_codex/cgo-007/docs/gg/mockup/serve.mjs --port 4177 --out /Users/veho/Code/_codex/cgo-007-evidence/preview
```

Solange der Befehl läuft: `http://127.0.0.1:4177`. Beenden mit Strg+C. Der Koordinator kann in seinem eigenen Klon denselben relativen Befehl `node docs/gg/mockup/serve.mjs --port 4177` ausführen. Ein alleiniger localhost-Link ist keine Übergabe. Koki erhält seine erreichbare Urteilskarte erst nach dem Sichtpass des GG.

Separat bauen: `node docs/gg/mockup/build.mjs --out /absoluter/pfad/preview`. Gebauten Stand starten: `node docs/gg/mockup/serve.mjs --no-build --out /absoluter/pfad/preview --port 4177`. Im gebauten Ordner dürfen Dateien nicht manuell editiert werden; nach einer Quellenänderung neu bauen und Server neu starten.

## Die fünf Auftragspunkte

1. **Quelle und Weg:** Basis `df258ae8952cf5e5747e7507759d4d7b61e094b5`; angenommene Richtung aus welle-057 am Boardstand `a4c0ff4075e352bc33631a0ac91c1484bcddbcde`. `source-pins.json` bindet die tatsächlich gelesenen Dateien mit MD5 (Fingerabdruck der Bytes). `build.mjs` verweigert fehlende oder geänderte Eingänge.
2. **Ansichten:** 390/1440 Pixel, hell/dunkel und reduzierte Bewegung. Die Lehrerleiste benennt jeden Zustand, die Schülerfläche bleibt Englisch. Genau eine hervorgehobene Aktion pro Lernschritt; während des Wartens keine aktive Abschlussaktion. Fehler → Auswahl erhalten → erneut versuchen.
3. **Zwei reale Aufgaben:** `content/corpus/units/g1-u01/vocab.json`, `g1u01.w.book`, Revision 2, Definitionsansicht `d` mit vollständigem `dAnswers` und den drei bestehenden `mc`-Ablenkern. `grammar.json`, `g1u01.gi.contractions.mc.006`, Revision 1, vollständige Antwort-/Ablenkerauswahl. Deutsche Frage „Welche Kurzform gehört zu it is?“ → „Which short form means ‘it is’?“; Erklärung sinngleich übersetzt. Ergänzender Kontext „It is a book.“ verbindet beide Schritte. Schlüssel und Korpus bleiben unverändert. Die lokale Bewertung vergleicht ausschließlich die vier festen Auswahlwerte; sie ist kein Ersatz für den produktiven Bewerter. Keine Antwortmarkierung im anfänglich ausgelieferten Aufgabenmaterial; private Schlüsseldatei wird nicht über HTTP ausgeliefert. Die Lehrer-Simulatorfunktion ist ausdrücklich keine sichere Prüfungsumgebung.
4. **Wiederöffnen:** Auswahl, Ansicht, Erscheinungsbild und ausdrücklich gespeicherte Notiz bleiben in `localStorage` (Speicher dieses Browsers). Notizentwurf bleibt ungespeichert, bis „Notiz lokal speichern“ gewählt wird. Bei ungespeichertem Text oder Speicherfehler fordert `beforeunload` die Browserwarnung an; Browser können sie insbesondere auf Mobilgeräten unterdrücken. Ein Klick innerhalb des Musters verliert keinen Notiztext. Der nachgestellte Lernspeicher ist davon unabhängig und speichert niemals Lernpunkte.
5. **Prüfen:** `node docs/gg/mockup/check.mjs` prüft Quellenbindung, acht Auswahlbewertungen, Geheimhaltung des Schlüssels und tatsächlich gebaute Auslieferung. Sicht-/Bedienpass und zwei geforderte Gegenproben stehen im Boardbericht und PR, Rohlogs/Bilder außerhalb des Repos. Die volle Produktbatterie ist zusätzlich erforderlich, erst nach reserviertem Prüfplatz.

## Kunst, Schrift und Grenzen

Unveränderte Dateien aus der Basis: `apps/web/public/art/g1/paint/ch01/obj_book_a.png` (Buch als Wortbedeutung), `klecks_mentor.png` (Einladung in den Lernweg), `apps/web/app/fonts/fredoka-var-latin.woff2` und dessen Lizenzhinweis. Nichts aus dem historischen Referenzordner importiert. Bildaufträge: keine; Ansichtsaufnahmen dokumentieren die tatsächliche Aktion statt eines Generierungs-Prompts.

Die private Quelldatei im Build dient dem lokalen Server. Er liefert nur seine feste Dateiliste aus, bindet nur an `127.0.0.1` und hat keinen Datenbankzugang. Notizen enthalten keine Schülerdaten. Ein Start auf einem anderen Port oder in einem anderen Browser benutzt einen anderen lokalen Speicher.

Der Spiel-Renderer und alle fünf Paint-Phasen sind unverändert. `docs/PERF_WAECHTER.md` ist gelesen; eine eventuell notwendige Phasenmessung wird mit dem GG geklärt, nicht durch erfundene Vorher-/Nachherwerte ersetzt. Dieses Muster beweist weder die produktive Speicherung noch mobile Browserwarnungen, echte Touchgeräte, das Geschmacksurteil oder eine unabhängige Prüfung. Es öffnet keine Serienwelle.
