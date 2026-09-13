# Drei Geländeformen für mehr Platz

**CODEX DRAFT — NOT CANON** · 2026-09-13

## Umsetzung

Im Trial-Repo wurden ausschließlich die drei beauftragten Gelände-PNGs und ihre drei `VisualBody`-Fenster in `packages/game-paint/src/visualBodies.ts` geändert. Eine VisualBody-Deklaration beschreibt, welche Rasterzellen zu einer gemeinsamen gemalten Fläche gehören.

- `body_p2_ostwand_treppe_boden`: Osten jetzt 37 statt 17 Spalten breit; drei Stufen mit 2/4/5 Spalten, breite zusammenhängende Bodenfläche, rechte Außenwand. 269 belegte Zellen, PNG 2368×1628.
- `body_p2_deckenbahn_ost`: ein neu gemalter durchgehender L-förmiger Deckenbalken, 37 Spalten breit, zweispaltiger linker Pfeiler. 51 Zellen, PNG 2368×540.
- `body_p3_ostmauer_sims`: allein die Zelle (60,14) entfällt; alle übrigen 186 Zellen bleiben. Die Mauer wurde gezielt ohne aufgesetztes Einzelbuch neu gemalt, damit ihre oberste Trittfläche durchläuft. PNG bleibt 1536×796; das leere erste Zeilenfenster bleibt zur unveränderten Verankerung erhalten.

Keine Level-JSON, keine Physik, kein PaintScene/PaintGame und kein Importer wurden in dieser Bahn geändert. Root hatte die fünf Bänder vor der Geländezeichnung grün geprüft. Der Sourcepack liegt unter `docs/art/ch01-story-gamepass/terrain/` mit Originalen, Prompts, Masken, Bodyplan, registrierten Kandidaten und Belegen. `provenance.json` dokumentiert bytegleiche Bildoriginale und SHA-256.

## Gemessene Registrierung

Verwendet wurde der vorhandene `docs/art/import-ch01-buecherwelt.mjs` unverändert: streng monotone Passpunkte bestimmen, welcher Originalpixel an welche Zielkoordinate gelangt; danach entfernt eine exakte Körpermaske ausschließlich Pixel außerhalb der erlaubten Geländeform. Sie ergänzt weder Farbe noch Deckkraft. `sourceCrop` ist nicht gesetzt: Die Passpunkte liegen ausdrücklich in Originalkoordinaten. Keine RGB-Nachmalerei und keine zusätzliche Schlüsselfarb-Heuristik.

Alle exakten Passpunkte stehen maschinenlesbar in `terrain/import-manifest.json`. Dabei bedeuten Paare `[Ziel, Quelle]` Pixelmittelpunkte, nicht Zellränder. Wesentliche Grenzpaare:

| Körper | X-Passpunkte | Y-Passpunkte |
|---|---|---|
| Ostboden | 0→20; 127→130; 128→141; 255→203; 256→215; 319→242; 320→260; 2303→1436; 2304→1446; 2367→1498 | 0→8; 12→22; 716→486; 907→559; 908→579; 1099→652; 1100→674; 1227→745; 1228→757; 1611→1016; 1627→1026 |
| Ostdecke | 0→18; 127→172; 128→208; 2367→1878 | 0→38; 12→54; 75→130; 76→184; 523→770; 539→790 |
| Hofmauer | 0→2; 639→721; 640→729; 1023→1156; 1024→1165; 1535→1739 | 0→0; 76→89; 267→300; 268→307; 459→518; 460→526; 779→900; 795→917 |

Der von Root freigegebene Dreistufen-Ostboden ist tatsächlich 1512×1040 und vollständig deckend; seine freie Luft enthält ein **eingebranntes Schachbrett**. Die Registrierung nimmt deshalb nur die gemessenen zusammenhängenden Buchflächen innerhalb der jeweiligen Stufen/Fußboden/Wand auf. Die exakte Maske schneidet sämtliche äußere Luft ab. Ein beliebiger transparenter Ausschnitt oder die ungemessenen ersten Vorschlagskoordinaten hätten den Schachbrettbereich in den Körper ziehen können.

Beim neuen Deckenoriginal (1907×825) ergab y=174 als Beginn des Pfeilers sieben teilweise deckende Pixel an einer kleinen gemalten Fuge. Der gemessene Beginn wurde auf y=184 innerhalb der vollen Buchfläche gesetzt. Danach sind alle Pflichtpixel vollständig deckend; keine Deckkraft wurde künstlich erhöht.

Ein reiner Maskenschnitt der alten Hofmauer hätte einen braunen Rest des Einzelbuchs direkt auf der obersten Trittfläche gelassen. Dieser registrierte Versuch wurde deshalb verworfen. Das neue ImageGen-Original (1742×903) führt die helle Buchoberkante wirklich über die entfernte Stelle hinweg fort.

## Prüfungen

Alle Shells verwendeten Node24 und `nice -n 15`. Die Ausgaben liegen in `terrain/evidence/`.

| Prüfung | Ergebnis |
|---|---|
| Vorhandenes Silhouettentor, alle deklarierten Kapitel-1-Körper | Exit0; alle fünf Gesetze halten, einschließlich der drei neuen Körper |
| p2/p3-Körperpartition am tatsächlichen aktuellen Levelraster | Exit0; p2: 627 Körperzellen, p3: 492 Körperzellen, jeweils keine Fehler |
| `visualBodies.test.ts`, `scene-cutout-sizing.test.ts`, `scene-cutout-bounds.test.ts` | Exit0; 3 Testdateien, 20 Tests grün |
| Vollständige Pixelmessung gegen jede Maskenzelle | Ostboden 1.101.824, Decke 208.896, Hofmauer 761.856 Pflichtpixel; überall Alpha255; 0 fehlende/teildeckende Pixel; 0 bemalte Pixel außerhalb der Maske |
| Tatsächliche Bildsichtung nach Registrierung | Alle drei angesehen; klare durchgehende Materie, keine Luftlöcher, keine sichtbaren Schachbrettfelder; Hofpodest vollständig verschwunden |

Der zusätzliche lesende RGB-Screen fand im Ostboden 84 annähernd neutrale Abriebpixel in 32 kleinen Gruppen (größte13Pixel), sämtliche maximalRGB173. Das sind dunkle Materiallichter an der rechten Buchwand, keine hellen wiederholten Schachbrettflächen. In der neuen Decke liegen ebenfalls kleine Materiallichter vor; die Hofmauer hat keine entsprechenden Pixel. Der RGB-Screen ist ein Prüfhinweis zusammen mit tatsächlicher Sichtung, kein allgemeiner automatischer Schachbrettbeweis. Er verändert keinerlei Pixel.

Bestehende Tests/Gesetze wurden verwendet, nicht geändert. Kein neues CI-Tor und keine Lockerung bestehender Regeln.

## Enddateien und Grenzen

| PNG | Bytes | SHA-256 |
|---|---:|---|
| `body_p2_ostwand_treppe_boden.png` | 1.874.433 | `f6d554fd6e0a3edfd0d8ee6670dd8d938e5265ba0ff3ab18d1f48c914b3d614d` |
| `body_p2_deckenbahn_ost.png` | 425.284 | `d121f4b515cb1ed51569df199fcd3f599e3a9e409d70ff5d4e5d82082fc93c73` |
| `body_p3_ostmauer_sims.png` | 1.379.488 | `fd00259664ec65051c2f2d285f73a0f0a2125cc6aca13a4838ef41b64ec859a6` |

Die Bilder wurden mit dem eingebauten ImageGen erzeugt; die Dreistufenquelle stammt aus Roots bereits freigegebener Generation. Prompts und Quellpfade stehen im Sourcepack. Der Import resampelt die gemalte Materie abschnittsweise auf die Rastergeometrie; dadurch unterscheiden sich horizontale/vertikale Skalierung lokal. Diese registrierte Zielansicht wurde angesehen, die tatsächliche Kamerafahrt und Figurenproportionen im laufenden Spiel prüft Root anschließend. Keine Behauptung einer bereits erfolgten Browser-Endabnahme oder grünen vollständigen PR-Batterie. Keine bekannten offenen Alpha-/Partitionsfehler in dieser Bahn.
