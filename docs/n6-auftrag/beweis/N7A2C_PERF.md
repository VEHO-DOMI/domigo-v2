# N7A2c · Perf-Messband (2026-09-03/04)

Zwei Produktionsbauten, je ein eigener Port, jede Bau-Angabe **vom gemessenen Server
selbst bestätigt** (`/api/version`), nicht behauptet.

| Phase | fps vorher | fps nachher | laden vorher (ms) | laden nachher (ms) |
|---|---|---|---|---|
| p1 | 60.1 | 60.6 | 532.8 | 502.7 |
| p2 | 60.5 | 60.4 | 672.4 | 686.1 |
| p3 | 60.5 | 60.3 | 497.4 | 316.8 |
| p4 | 60.6 | 60.5 | 546.8 | 754.2 |
| p9 | 60.2 | 60.5 | 257.4 | 469.6 |

Bau: da915d35634e3a4bf0540ce8a221d9444564c3ab · Quelle: /api/version
Bau: 2a8e5af3a78ccaf32aeb853a791b8f3c15c51e5d · Quelle: /api/version

Kontrollseite **61.7** bzw. **61.0 fps** (Schwelle 58) — die fps-Spalte ist belastbar.
Der Nachher-Lauf steht auf dem ausgelieferten Commit, nicht auf einem früheren.

⚠ **Die ms-Spalten sind NICHT belastbar.** In beiden Läufen lagen zehn bis elf fremde
Server im Messband 3200–3399 (3313, 3321, 3322, 3324, 3341, 3352, 3362, 3372, 3382,
3391 und je der andere eigene). Das Werkzeug meldet den Makel selbst; er wird hier
zitiert statt weggelassen. Die strukturelle Aussage — **kein Einbruch an einer der
fünf Phasen** — hängt an der fps-Spalte, und die ist durch die Kontrollseite gedeckt.

## Phasen-Gewichte

Mit demselben Lineal wie `artScope.test.ts`
(`bytesOf(phaseArtScope(level, ph.id, present)) / 1048576`, über den ganzen
Kunst-Baum), an ZWEI Bäumen gemessen:

| | p1 | p2 | p3 | p4 | p9 |
|---|---|---|---|---|---|
| vorher (`da915d35`) | 19.4 | 25.2 | **21.9** | 17.8 | 15.1 |
| nachher | 19.4 | 25.2 | **20.9** | 17.8 | 15.1 |

Grenze 35 MB. Nur p3 bewegt sich, um **−1,0 MB**: vier Bausatz-Blätter fallen weg
(0,73 MB), das neu gemalte Blatt wiegt 2,07 statt 2,18 MB. Tote Kunst **57 → 61 → 57**;
Blätter auf der Platte 347 → 343.
