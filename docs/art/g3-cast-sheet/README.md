# FOURTEEN · Cast-Blatt Fassung 2

**CODEX DRAFT — NOT CANON · cgo-102 · 08.10.2026**

Fassung 2 setzt Kokis Urteil auf **steu-023** um: Ben, Leah, Leo und DU sind **13**, Sara ist **17**, die ältere Influencerin aus der 7B. Sara wirkt durch längere Silhouette und ruhigere, gesetztere Haltung deutlich älter; kein erwachsener Glamour-Look. Leah hat einen **leicht dunkleren Teint als die anderen, wie Erst-Edition; nie karikiert**: nur ein wenig wärmerer Olivton, kein starker Sprung gegenüber `leah_neutral.jpg`. Saras eigener hellbrauner Teint bleibt erhalten. DU ist **immer von hinten, nie das Gesicht** — auch kein Profil und keine Spiegelung.

## Hoodie-Farbe: dunkelgrün

Sichtzählung am Ausgangsstand `fc8201c2962c5fa54508a3832f0227abf0480fed`: alle **44 JPGs** in `apps/web/public/art/g3/` geprüft, nicht die Erst-Edition-Dateien in iCloud. Gezählt wird pro Bild, nicht pro Figur im Hintergrund:

| Befund | Bilder |
|---|---:|
| DU eindeutig erkennbar, Hoodie dunkelgrün | 17 |
| DU eindeutig erkennbar, Hoodie grau | 0 |
| Grüne Ärmel, durch Szene DU zugeordnet; keine vollständige Figur | 2 |
| Grauer Schulteranschnitt, DU-Zuordnung unsicher | 1 |
| Kein sicher zuordenbares DU-Kleidungsstück | 24 |
| **Geprüft** | **44** |

Die 17 eindeutigen grünen Bilder: `beat_ch01_s002`, `beat_ch01_s007`, `beat_ch01_s011`, `beat_ch02_s002`, `beat_ch03_s009`, `beat_ch06_s001`, `beat_ch07_s009`, `beat_ch09_s007`, `beat_ch09_s009`, `beat_ch10_s007`, `beat_ch10_s010`, `beat_ch11_s002`, `beat_ch12_s005`, `beat_ch13_s002`, `beat_ch13_s005`, `beat_ch14_s001`, `beat_ch14_s010` (jeweils `.jpg`). Grüne Ärmel: `beat_ch08_s008`, `beat_ch13_s010`. Grauer, unsicherer Anschnitt: `beat_ch10_s008`. Selbst mit diesem als grauem Gegenbeleg bleibt die Mehrheit eindeutig. Deshalb **dunkelgrün**, passend zur Erst-Edition-Bibliothek. Der bisher graue prozedurale Rückfall wird hier nicht geändert.

Einige Altbilder zeigen DU im Profil oder frontal. Sie belegen die Farbe, **keine Ausnahme** von Kokis neuer Rückenregel. Der Altbestand wird mit diesem Text-PR nicht ersetzt.

## Gültigkeit und Herkunft

- [matrix.md](matrix.md) ist die v2-Soll-Matrix für Cover, 14 Folgen-Karten und Endkarte. Saras Alter, Leahs Teint, DU-Ansicht und Hoodie-Farbe sind entschieden.
- `index.html`, die fünf PNGs, [prompts.md](prompts.md) und [cast.json](cast.json) **bleiben historische Fassung 1** (welle-047). Ihre alten Alters-/Farb-/Freigabetexte sind durch diese Fassung 2 überholt; sie dürfen nicht als aktuelle Generierungsaufträge verwendet werden. Keine Bilder werden in diesem PR hinzugefügt oder geändert.
- Aktuelles Kalibrierblatt und aktuelle Prompts: `~/Code/codex-lab/cgo-102/index.html` und `prompts.md`, ausschließlich im Labor. 15 Sprecherporträts in drei Stimmungen, Folgen-Karte 06, Kommentar-Abschnitt, Kanal-Dashboard sowie eine gemeinsame Cast-Ansicht (18 bestellte Einzelmotive + 1 Vergleich = 19 Bilder). Auswahl bei 390/1440 Pixeln, hell/dunkel. **Kokis Bildauswahl steht aus.**
- `cast@1` besitzt kein Altersfeld (`packages/content-schema/src/index.ts`, `Cast`). Saras Alter wird ausschließlich in `descriptionDe` ergänzt; kein neues Datenfeld.
- Stil: europäische Graphic Novel, Tintenkonturen und Aquarell auf sichtbarem Papier. Nur erfundene Figuren, keine reale Person. Lesbarer Bildschirmtext ist nach `g3-legacy-map.json` erlaubt; Zahlen folgen `economy.json`, wechselnde Kommentare bleiben beim späteren Einbau echter Oberflächentext.

## Einbaufertige Komposition, Einbau noch ausstehend

Die langen v1-Referenzporträts verlieren im mittigen runden **46 × 46-Pixel-Ausschnitt** Köpfe. Der v2-Zeichenauftrag verlangt deshalb **quadratische Sprecherporträts, mindestens 512 × 512 Pixel**, Kopf mittig, vollständige Haarsilhouette innerhalb des runden Ausschnitts. Im Labor stehen großes Quadrat und tatsächliche kleine Rundansicht nebeneinander. Bei DU tragen Hinterkopf, Kapuze und Schulterhaltung die Stimmung.

Die Stimmungen bündeln den Bogen der 14 Folgen: warm (01–05), angespannt einschließlich Erschütterung (06–11), ehrlich/Neuanfang (12–14). Sie sind Vergleichsproben, keine automatische Zuordnung jedes Porträts zu jeder Szene. Bei 12/13 heißt „ehrlich“ Reue, nicht schon versöhnte Freude.

**UNVERIFIZIERT:** Kokis Auswahl, Darstellung im angemeldeten Spiel und Produktion. Der Architekt legt den späteren Einbau über `art.json` und `public/art/g3/` an; die prozedurale Zeichnung bleibt Rückfall. Der Repo-PR enthält ausschließlich Text in den vier freigegebenen Dateien.
