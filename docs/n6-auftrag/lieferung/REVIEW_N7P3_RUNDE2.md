# REVIEW · N7A2 p3-Welle · RUNDE 2 → Auftrag für RUNDE 3 (letzte)

**Stand: 2026-09-02 · N7A2 · Runde 3**

**Runde 2 hat die zwei Befunde behoben** — das ist gemessen und angenommen: 0 flache
Zellen von 493 (vorher 136), schwächste Struktur SD 19,3, Laufband/Körper 1,53 · 1,72 ·
1,44 (Ziel ≥1,3), Wert-Vertrag 33,0–33,7 %. Die **drei Deckenbahnen sind fertig** und
werden nicht mehr angefasst.

Es bleibt EIN Befund, und er betrifft nur die drei Boden-Blätter.

## Befund · Eine pixelweise Körnung liegt über der ganzen Fläche

Sichtbar wurde es erst im laufenden Spiel: der Hof liest sich dort über weite Strecken
als **dunkle, sprenkelige Masse**, in der kein Buch mehr zu erkennen ist — obwohl die
Blätter aus der Nähe gemalt aussehen.

Gemessen, über 1532 Zellen: **Kanten-Dichte** = Anteil der Pixel, deren lokaler
Helligkeits-Sprung größer als 12 Punkte ist (innere 80 % jeder Zelle, Median je Blatt).

| Blatt | Kanten-Dichte (Median) |
|---|---|
| **abgenommene p1/p2-Körper (12 Blätter, 1039 Zellen)** | **20 – 76 %** |
| deine drei Deckenbahnen | 34 · 55 · 61 % ✓ |
| `body_p3_westterrasse_rutsche` | **85 %** |
| `body_p3_mittelpfeiler` | **87 %** |
| `body_p3_ostmauer_sims` | **91 %** |

Bei 85–91 % ist **fast jedes Pixel eine Kante**. Ein gemalter Buchrücken hat wenige
lange Nähte und große ruhige Flächen dazwischen; eine Körnung hat überall eine Kante.
Im Spiel wird das Blatt auf ein Viertel verkleinert (64 px Zelle → 16 px Welt), und
dabei mittelt sich die Körnung zu genau der sprenkeligen Masse, die man sieht.

**Warum die bisherigen Maße das nicht gefunden haben** — und warum du nichts falsch
gemeldet hast: Rauschen HAT eine hohe Wert-SD (deine 19,3 sind echt) und es überlebt
sogar das Verkleinern auf 8×8 (deine Blätter messen dort 6,99 gegen 3,09 im
abgenommenen Bestand — sie sahen BESSER aus). Es gibt jetzt ein fünftes Gesetz im
Silhouetten-Tor, das genau diese Frage stellt; ein neuer Lauf zeigt dir die Zahl.

## Was Runde 3 tut

Dieselben drei Blätter, **dieselbe Komposition, dieselbe Palette, dieselben Werte** —
nur ohne die Körnung:

1. **Keine pixelweise Textur-/Grain-/Noise-Ebene über der Fläche.** Wenn dein Prozess
   am Ende ein Rausch- oder Papierkorn-Overlay addiert: weglassen.
2. **Die Struktur kommt aus der Zeichnung**, nicht aus der Streuung: Buchrücken als
   Formen mit Kanten, Bünden, Schnitten — dazwischen ruhige, große Wertflächen.
3. **Ziel: Kanten-Dichte im Median ≤ 80 %**, gern deutlich darunter (das abgenommene
   Feld liegt bei 20–76 %). Alles andere bleibt, wie Runde 2 es hatte.

Zur Orientierung, was „ruhig" heißt: `apps/web/public/art/g1/paint/ch01/body_p1_hallenboden.png`
misst 43 % im Median, das abgenommene Exemplar `body_p2_regal_turm_boden.png` 21 %.

## Lieferung

1. Drei PNGs nach `docs/n6-auftrag/lieferung/` (gleiche Namen, überschreiben).
2. `SELBSTAUSKUNFT_N7P3.md` überschreiben, Zeile 1 = die Stand-Zeile oben; je Blatt
   md5, Blattmaß, mittlere Luminanz/Sättigung, kleinste Wert-SD, Band/Körper **und die
   Kanten-Dichte im Median** — die eine Zahl, um die es in dieser Runde geht.
3. Kein Commit, keine Datei außerhalb `docs/n6-auftrag/lieferung/`.
