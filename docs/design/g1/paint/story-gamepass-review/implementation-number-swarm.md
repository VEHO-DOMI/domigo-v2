# CODEX DRAFT — NOT CANON

## Echte Zahlenschwärme im ersten Kapitel

Stand: 2026-09-13. Begrenzter Motorzeichnungsauftrag abgeschlossen; Einbau-Sichtprüfung im Browser liegt beim Root-Agenten.

Der Weltzeichner zeigt an den Begegnungen `chapter=ch01`, `role=swarm`, `skin=moths` jetzt sechs lesbare Zahlen aus 1–25. Es sind echte Schriftzeichen in der vorhandenen Sammelbuchstaben-Malweise: Georgia, warmes Gold/Bernstein, der zum Raum passende Kreide-/Tintenrand, vorhandene Papierkörnung. Keine Flügel, Insektenkörper oder Plakettenumrandung. Andere Kapitel/Rollen behalten ihren vorhandenen Zeichner.

Die alte Insektenabbildung wird für diese Begegnungen überhaupt nicht angelegt. Deshalb entstehen auch keine Motten-Schatten, grauen Kopien oder Motten-Farbblüten im Hintergrund. Die Ziffern selbst tragen bereits den bestehenden warmen Buchstabenrand. Die bisherige einmalige Erfolgswolke und die Feier des Helden bleiben beim Lösen erhalten.

Die sechs Werte stammen aus dem Startschlüssel des Durchgangs und der Begegnungskennung. Sie bleiben bei wiederholten Kartenaufrufen, anderer Renderreihenfolge und fortschreitender Spielzeit gleich. Ein neuer Startschlüssel oder eine andere Begegnungskennung erzeugt eine andere Auswahl. Alle Zahlen haben dieselbe Schriftgröße; der Helfer bekommt weder Kartenantwort noch Aufgabenwort und kann deshalb keine Antwort hervorheben. Die Kartenmischung und Physik wurden nicht verändert.

## Kleine gemeinsame Zeichenanordnung

`story/number-swarm.ts` exportiert:

- `isNumberSwarm(chapter, { role, skin })`: die genaue Auswahl des neuen Zeichners.
- `numberSwarmLayout({ runSeed?, entityId, tick, reducedMotion })`: sechs Einträge mit `value`, `text`, `x`, `y`, `rotation` (Radiant), `height`.
- `NUMBER_SWARM_BOUNDS`: `{ x: -20, y: -35, width: 40, height: 36 }` in logischen Spielpixeln.

`x/y` sind Mittelpunkts-Verschiebungen relativ zum Fußanker der Begegnung. Die Phaser-Szene setzt sie auf die unveränderte Simulationsposition. Für eine React/SVG-Karte kann derselbe Kasten als viewBox dienen; Rotation von Radiant in Grad umrechnen und die vorhandene LETTER_STYLE-Familie verwenden. Root verbindet `PaintGame` mit dem neuen optionalen `PaintSceneCfg.runSeed` und übernimmt den Kartenzeichner; diese beiden Dateien wurden hier nicht bearbeitet.

Die kleine Papierdrift folgt ausschließlich `sim.tickCount`. Bei einer normalen Aufgabenpause frieren sowohl Körperanker als auch innere Ziffernbewegung ein. In reduzierter Bewegung gibt es überhaupt keine innere Drift; der Schwarm folgt weiterhin seiner regulären Begegnungsposition. Die bestehende Sonderanimation bereits erlöster Wesen während eines Wiederherstellungs-Haltemoments bleibt Simulationsverantwortung.

Zweistellige Zahlen verwenden im vorhandenen `letterTex` eine 192 × 128 statt 128 × 128 große Zeichenfläche. Dadurch haben beide Ziffern Platz samt Kreiderand; die Schriftgröße bleibt gleich. Einzelne Sammelbuchstaben benutzen weiterhin exakt ihre bisherige 128er Zeichenfläche. Die sechs Weltabbildungen sind je 12 Spielpixel hoch. Rotation und leichte Verschiebung eingeschlossen bleiben alle Bildflächen innerhalb des 40 × 36 großen Schwarms.

## Erhaltene parallele Root-Arbeit

`PaintScene.ts` enthielt beim Arbeitsbeginn bereits Merles Fensterdarstellung, Geräteschrank-Auswahl, Tintenfluch und Sichtbarkeitskorrekturen. Diese wurden erhalten. Die vorhandene Schattenpassage prüft bereits `!img || !img.visible` und schaltet den Schatten ab; hier war keine weitere generische Änderung nötig. Merles verborgenes Hauptbild kann daher nicht über den Schatten wieder auftauchen. Fremde Tests wurden nicht geändert. Keine Änderungen an Level-JSON, Simulation, Kartenanfragen, CardShell, PaintGame oder Importer.

## Nachweise

- Neue sechs Prüfungen: exakte Rollenwahl; sechs verschiedene Zahlen im Bereich 1–25 mit gleicher Größe; Start-/Begegnungsabhängigkeit und Wiederholbarkeit; reduzierte Bewegung; vollständiger gedrehter Bildkasten über 20 Starts und 43 Zeitschritte; Pause und Wiederaufnahme mit einer echten Sim und einem Schwarm aus dem aktuellen ausgelieferten Kapitel.
- Zusammen mit vorhandenen Buchstaben-, Merle-Darstellungs- und Bildfensterprüfungen: **4 Dateien, 41 Prüfungen grün**. Protokoll: `number-swarm-tests.log`.
- Paket-Typprüfung `pnpm --filter @domigo/game-paint typecheck`: **grün**. Protokoll: `number-swarm-typecheck.log`.
- Keine fremden Prüfungen abgeschwächt oder verändert. Keine PR-Vollbatterie durch diesen begrenzten Auftrag behauptet.
- Noch offen: reale Spielansicht bei Root ansehen (Lesbarkeit gegenüber dem jeweiligen Hintergrund, tatsächliche Schwarmwirkung, Kartenansicht). Die rechnerische Kastenprüfung ersetzt diese Sichtprüfung nicht.

## Dateistand (SHA-256 bei Übergabe)

- `packages/game-paint/src/PaintScene.ts`: `f5b3e78d41a1a15cae6b8a67924376cc1a843fe570b56b0135a8a6f29a4443cd`
- `packages/game-paint/src/story/number-swarm.ts`: `50a280709513b6fc1852502f2f4c787b3afc4d5834862b607e143ecd64666578`
- `packages/game-paint/src/story/number-swarm.test.ts`: `b3e07c4efbc34df67a2c5d16c256cebd7e766378858ec903ac11a5d8698a0fcd`
