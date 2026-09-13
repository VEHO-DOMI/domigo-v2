# CODEX DRAFT — NOT CANON

# Kapitel 1: endgültige Bildquellen des Story-Spielpasses

Dieses Verzeichnis bewahrt Originale, exakte Bildaufträge und registrierte Importe. Es ist keine pauschale Bild-/Releaseabnahme. `installed-provenance.snapshot.json` bindet die derzeitigen Spiel-PNGs an die jeweils tatsächlich passenden Quellenberichte; historische überschriebenen Ausgaben stehen ausdrücklich getrennt. Nach weiteren Bildänderungen ist dieser Snapshot erneut abzugleichen.

## Welches Dokument gilt?

| Familie | Maßgebliche endgültige Zuordnung | Bewahrte Vorgänger / Grenzen |
| --- | --- | --- |
| Sieben Comicbilder in Lesereihenfolge | `panels.manifest.json`; sieben Originale in `sources/`, sieben genaue Prompts neben dem Manifest | `panels.previous.manifest.json` ist ausdrücklich verworfen. `school-transformation.manifest.json` protokolliert nur den historischen Drei-Dateien-Austausch. `prologue-originals.manifest.json` enthält die gesamte Generierungsgeschichte mit verworfenen Klein-/Abenteuerklassen. |
| Tintenmaterial | `ink-liquid.manifest.json`, `ink_liquid.prompt.txt`, `ink-prompt.provenance.json` | Der Prompt wurde aus dem tatsächlichen ersten ImageGen-Aufruf vom 13.09.2026 10:28:56.895 UTC wiedergewonnen, nicht nachträglich rekonstruiert. Keine Comicseite. |
| Klecks | `klecks.manifest.json` + `klecks.import.report.json`; `klecks-key.prompt.txt` | Ursprüngliche weiße/Schachbrett-Kalibrierungen sind keine Transparenzfreigabe; verwendet wird die registrierte Schlüsselfarbenfigur. |
| Merle und Penal | `merle/import.manifest.json`, `merle/import-report.json`, `merle/state-aliases.json` | Statische Zustandsaliase ausdrücklich dokumentiert; leeres Penal wird mit der echten Merle kombiniert. |
| Geräte und Klassenfoto | `devices-photo/import.manifest.json` + `import-report.json`; `devices-clean/` für neue vollständige Geräte | Rohaufträge für das erste Schließfach und seine Scharnierkorrektur bleiben als Geschichte vorhanden. Die endgültige Fassung ist die im Importmanifest gebundene Quelle. |
| Foto-Käfigrahmen | `photo-cage/import.manifest.json`, `import-report.json`, `window-registration.json` | Neuer eigener Rahmen, keine frühere Schultasche als Maske. |
| Farbige Dinge und Rock | `objects/import-manifest.json`, `source-to-stem.json`, `import-report.json` | Diese erste Importserie ist **für die 19 Neutralvarianten überholt**, nicht pauschal die endgültige Quellenliste aller Figuren. |
| Schwarze Feder, weißes Heft, graue Schere | `objects/neutral-material-import-manifest.json`, `neutral-material-import-report.json`, **`neutral-installed-variants.json`**, `measurements/neutral-polygon-readings.json` | Alle 19 Bewegungsnamen verweisen auf je eine identische vollständige Zeichnung. Ältere farbige Zustandsbilder und Rechteck-Messentwürfe sind keine aktuelle Freigabe. |
| Tafel und Kritzelschichten | `blackboard/import.manifest.json`, `import-report.json`, `installed-stems.json` | `import-body-and-first-two.manifest.json` ist nur der historische Zwischenimport vor der kompletten dritten Schicht. Zwei Körperzeichnungen werden auf 24 Zustandsnamen gebunden; keine 24 einzeln gemalten Posen behauptet. |
| Drei angepasste Raumkörper | `terrain/import-manifest.json`, `provenance.json`, `registered/import-ch01-buecherwelt.report.json` | Verworfene Vierstufen-Bodenfassung nicht verwenden; aktuelle Dreistufenquelle und exakte Körpermasken gelten. |
| Abschlusstür | `ending-door/manifest.json`, `import-report.json`, `import.log`, `prompt.txt` | Bericht tatsächlich auf `plate_ch01_door` geprüft; Quelldatei, Ausgabe, Manifest und Log stimmen. Globale Importdateien im public-Ordner sind überschreibbar und deshalb kein Ersatz für diesen lokalen Quellenbericht. |

## Sichtbelege und noch offene Prüfung

Die tatsächlichen sieben Comicseiten, die durchgemalte Tinte, der geschlossene/geöffnete Fotokäfig und Hello im Spiel sind im Laborbericht `CH01_STORY_SPIELPASS/implementation-final-visual-cohesion.md` mit Screenshots dokumentiert. Der jüngste Kleidungswortbuch-Zugang und die jüngste Abschlusstür benötigen noch ihren eigenen abschließenden Browserbeleg. Gleiches gilt für den jüngsten Folgekapitel-Gruß. Ein Quellhash oder grüner Import ersetzt diese Sicht-/Bedienprüfung nicht.

Die frischen blinden Kartenleser meldeten fehlende zählbare Punkte bzw. behauptete Bücher auf Heftkarten. Diese Kritik ist ein tatsächlicher offener Bild-/Aufgabenkohärenzbefund, bis korrigierte Karten neu gelesen wurden. Nicht durch diesen Herkunftsabgleich geschlossen.
