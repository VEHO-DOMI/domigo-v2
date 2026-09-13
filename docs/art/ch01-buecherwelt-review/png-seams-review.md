# CODEX DRAFT — NOT CANON

## PNG-Innennaht-Tor nach vollständigem Körper-Umstieg

Datei: `scripts/check-png-seams.mjs`. Nur diese Repo-Datei wurde durch diesen Teilauftrag geändert; kein Commit erstellt.

Der alte Fehler war ein überholter Prüfauftrag: Die fünf registrierten Räume benutzen keine deckenden Einzelkacheln mehr. Das Tor verlangte trotzdem eine positive Kachelzahl und hielt vier Duldungen für bereits entfernte Krusten. Die neue Funktion `inspectTileScope` erlaubt eine leere Kachelmenge ausschließlich, wenn mindestens eine Masse registriert ist, jede registrierte Masse ein echtes, nichtleeres rechteckiges Level-Gitter hat und `phaseIsOneBlock` für sämtliche Räume die vollständige Körper-Partition bestätigt. Die shipping Prüfung wird benutzt; keine Liste angeblich fertiger Räume.

Ein fehlendes Gitter erzeugt einen eigenen Fehler. Ein beschädigter Körper bringt die tatsächlichen Kacheln wieder in den Prüfbereich; fehlen diese Dateien, wird das jetzt ausdrücklich rot, statt sie wie früher still zu überspringen. Eine unbedeckte Masse ohne Ersatzpalette wird ebenfalls abgewiesen. Die vier überholten Duldungen wurden entfernt; Hygiene, Datumsprüfung und Höchstzahl-Regel für künftige Duldungen bleiben erhalten. Die Farbregel `seamHits`, Importer-Grenzen und M-Schwelle sind unverändert.

## Befehle und Resultate

Alle Shells starteten mit Node 24.20.0. Prüfprozesse unter `nice -n 15`.

- `nice -n 15 node --experimental-strip-types scripts/check-png-seams.mjs --selftest`: Exit 0, elf erfolgreiche Aussagen einschließlich echter Pixelveränderung, fehlender/leer Gitter, leerem Bauplan, Körperloch und fehlender Ersatzpalette.
- `nice -n 15 node --experimental-strip-types scripts/check-png-seams.mjs`: Exit 0, fünf von fünf Massen anhand des Level-Gitters als Ein-Block-Welt belegt; null tatsächlich benutzte deckende Kacheln.
- `git diff --check -- scripts/check-png-seams.mjs`: Exit 0.
- `nice -n 15 node /Users/veho/Code/codex-lab/trial-berichte/CH01_NEUFASSUNG/png-seams-counterprobes.mjs`: Exit 0. Führt echte mutierte Dateikopien mit denselben importierten Produktionsfunktionen aus. Die Quelldatei wird nicht verändert; jede Textersetzung muss vorher genau einmal vorkommen.

| Gegenprobe in temporärer Kopie | Erwarteter Exit | Tatsächlicher Exit |
|---|---:|---:|
| normal-selftest | 0 | 0 |
| normal-product | 0 | 0 |
| bypass-body-proof | 1 | 1 |
| disable-missing-grid-error | 1 | 1 |
| disable-empty-composition-error | 1 | 1 |
| missing-actual-grids | 1 | 1 |
| empty-actual-composition | 1 | 1 |
| remove-actual-bodies | 1 | 1 |
| restore-obsolete-allowance | 1 | 1 |
| disable-color-detection | 1 | 1 |

Das Entfernen aller tatsächlichen Körper erzeugte 40 konkrete Fehler für dadurch wieder benötigte, fehlende Kacheln. Eine wieder eingesetzte alte Duldung wurde als nicht mehr zum Bauplan gehörend zurückgewiesen. Das Abschalten der Farberkennung machte den Selbsttest rot. Das Überspringen der Körperprüfung sowie das Entfernen der Leer-Bauplan- oder Fehl-Gitter-Wache machte den Selbsttest ebenfalls rot.

## Grenzen

Dieses Tor prüft weiterhin nur tatsächlich benutzte deckende Einzelkacheln auf Importer-gefährliche Innenfarbe. Es erklärt Ganzkörper-Bilder nicht pauschal für farbfehlerfrei. Deren vorhandene Präsenz-, Silhouetten-, Schlüsselrand- und Körpergesetze bleiben eigenständig erforderlich. Ein legitimer historischer Raum darf weiterhin sein vorhandenes Kachel-Kit benutzen; eine unvollständige Körper-Partition bedeutet deshalb Wiedereinbeziehung dieser Kacheln, nicht automatisch das Verbot jedes gemischten Raums. Vollständige lokale Tor-Batterie und unabhängige Endprüfung liegen beim Hauptauftrag.

Geprüfte Datei SHA-256: `54a756be0e589c1fb4ff76e937998f22c9aafe0ab7a2216f5d8b1d54b4813ec9`.

Temporäre Kopien: `/var/folders/63/d9639_n52tb4h8t7psr_l4gc0000gn/T/codex-ch01-seam-counter-HEmYxl`. Vollständige Befehle, Exit-Codes und Logpfade: `png-seams-counterprobes.json`; ausführbares Gegenproben-Skript: `png-seams-counterprobes.mjs`.
