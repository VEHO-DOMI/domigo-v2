# L3-M-a · Beweise (2026-09-05)

Bahn: die Ring-Kette (Tauwerk, ch03) + die steigende Bilge + die Sonde.
Blatt: `SESSION-PROMPTS/LEVELWELLE/OPUS_L3MA_TAUWERK_BILGE_2026-09-03_V1.md`.

## 1 · Die Bilge, fotografiert — und warum das überhaupt ging

Das Blatt (§2a (g)) verlangt Standbild-Paare vorher/nachher für jede neue
Mechanik. Für eine Motor-Bahn ist das normalerweise unmöglich: **diese Bahn fasst
kein Level an** (E8), also gibt es in keinem ausgelieferten Raum etwas Neues zu
sehen. L2-M-a hat an derselben Stelle zu Recht keine Bilder geliefert.

Hier ging es trotzdem, mit dem Griff, den der Rahmen ohnehin segnet: das Level
wurde **im Worktree** um einen `bilge`-Block und zwei Pumpengriffe ergänzt,
fotografiert und **zurückgestellt** — nichts davon ist committet
(`git status` war danach leer, und `ch03.level.json` steht unverändert auf main).

| Bild | was es zeigt |
|---|---|
| `l3ma_bilge_ch03p2_vorher.png` | ch03 p2, **ohne** `bilge`-Block: trockener Raum, kein Wasser, kein Griff |
| `l3ma_bilge_ch03p2_nachher.png` | derselbe Raum, **mit** `bilge`-Block, Tick 64: Wasserkörper, Wasserlinie, der graue Pumpengriff rechts — und das Kind meldet »Platsch!« |
| `l3ma_bilge_ch03p2_nachher_spaeter.png` | Tick 384: das Wasser steht sichtbar höher (fünf Aufnahmen, alle 80 Ticks) |

**Der Vergleich ist kontrolliert:** beide Bilder kommen aus DEMSELBEN Bau,
demselben Dev-Server (Port 3457, D-954), derselben Kameralage und demselben Raum.
Der einzige Unterschied ist die Deklaration im Level. Damit ist auch die
Paritäts-Zusage der Bahn ein Bild und kein Satz: ohne den Block sieht der Raum
aus wie immer.

⚠ **Zwei Ehrlichkeiten zu den Bildern.**
1. Das Vorher-Bild trägt `tick 0`, das Nachher-Bild `tick 64`. Das ist kein
   Vergleichsfehler, sondern eine Folge des Raums: ohne Bilge bewegt sich in
   diesem Gerüstraum **nichts**, Tick 0 und Tick 64 rendern identisch.
2. Genau das hat `shoot-world` selbst gemeldet: der Kamera-Handschlag
   (zwei Aufnahmen mit verschiedenen Prüfsummen, P-66) ist im trockenen Raum
   **gescheitert** — »TOTE KAMERA« —, weil sich kein Pixel ändert. Deshalb ist
   das Vorher-Bild als `--standbild` aufgenommen und trägt ausdrücklich KEINEN
   Kamerabeweis; das Nachher lief als Reihe und hat den Handschlag bestanden
   (`angenommen: 5 · abgewiesen: 0`).

## 2 · Die Zahlen: `l3ma_sonde.txt`

Der volle Lauf von `scripts/paint-probes/ch03.probe.mjs` gegen die echte `Sim`.
Jede Zahl im PR steht dort. Die vier tragenden Befunde:

- **Die Kette trägt.** Seil 48 px, Lift 4 px/Tick, Sperre 20 Ticks: fünf Ringe,
  fünf Griffe, vier echte Flüge (§5). Der ausgelieferte Motor schafft dieselbe
  Geometrie nicht (§1, Eich-Zeile).
- **Die Regrab-Sperre ist der Schalter, nicht die Feinabstimmung.** Ohne sie
  37 Griffe an EINEM Ring; ab 4 Ticks 3 Griffe an 3 Ringen (§4b).
- **Der Schnapper hängt an der Seillänge, nicht am Eintrittswinkel** — und die
  Fangpunkt-Regel kauft am Kettenseil trotzdem ein Drittel (§4c).
- **Die Bilge steigt in exakten Pulsen** (14 Pulse, Abstand 30 Ticks, Endstand
  wie deklariert), das autorierte Gitter bleibt unverändert, Pumpe friert ein,
  Ventil lässt ab, und das Wasser ertränkt das Kind (§8–§11).

## 3 · Was hier NICHT liegt

**Kein Bild der Ring-Kette.** ch03 p1 trägt genau EINEN Ring (gezählt am
ausgelieferten Level), und eine Kette braucht mindestens zwei in Kettenspanne.
Ein zweiter Ring im Worktree wäre nicht mehr „dasselbe Level mit einer
Deklaration mehr", sondern ein umgebauter Raum — also eine Behauptung über eine
Geometrie, die G2 erst noch schneidet. Die Kette ist stattdessen in der Sonde
gemessen (§2, §5, §7) und in `ring-chain.test.ts` gegen die echte `Sim` gesichert.

**Kein Perf-Bild.** Die Perf-Tabelle steht im PR, ihre Beipackzettel liegen unter
`REPORTS/L3MA-evidence-2026-09-05/`.
