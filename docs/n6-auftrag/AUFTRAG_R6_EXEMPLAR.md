# R6 · RUNDE 1 — DAS KALIBRIER-EXEMPLAR (ein Körper, EIN Gemälde)

**Maßstab: CHECKLISTE_R6_KANON.md (unsere konvergierten Kanons — lies sie zuerst).**
Dieses eine Bild eicht die ganze Ein-Block-Welt: erst wenn es den feindseligen
Architekten-Review UND Kokis Blick besteht, wird repliziert. Male es wie das
Held-Stück, das es ist.

## Der Körper: `p2_regal_turm_boden` (Kokis markierter Cluster)

EIN durchgehendes Gouache-Gemälde für vier verwachsene Dinge des Nacht-Klassenzimmers,
in einem Wurf: **die Wand-Regalbahn (oben rechts) → der gebundene Bücherturm, der sie
trägt → zwei Pult-Tische auf Bein → der Bücherboden links.** Benennbarkeit (Punkt 1):
jedes Teil bleibt SEIN Ding; die Verbindungen (Turm trägt Regalbahn; Tischbeine stehen
im Boden; Turm wurzelt im Boden) sind gemalte Material-Handlungen (Punkt 6).

## Zell-Vertrag (bindend — Silhouetten-Tor misst maschinell)

- Blattmaß: **2048 × 1116 px** (RGBA, Alpha-Silhouette, kein Magenta-Key).
- Raster: **64 px = 1 Zelle**; Zell-Box beginnt bei x=0, **y=12** (Overpaint oben 12 px,
  unten 16 px; links/rechts 0 — die Malerei bleibt seitlich in der Box).
- Die Maske (32×17 Zellen, `#` = Körper; Zeile 1 = Grid-Reihe r9, Spalte 1 = c0):

```
......................##########
......................##........
....................####........
......................##........
......................##........
......................##........
......................##........
......................##........
......................##........
....####....###.......##........
.......#......#.......##........
########################........
########################........
########################........
########################........
########################........
########################........
```

- **Deckung:** ≥98 % jeder `#`-Zelle opak; **außerhalb** von Maske+Overpaint ≤0,5 %
  Alpha (nichts darf begehbar AUSSEHEN, was es nicht ist — Punkt „Anti").
- **Lauf-Linien** (Stehflächen; erste opake Zeile dicht an der Zell-Oberkante, Malerei
  darf max. ~8 px Licht-Lippe darüber): Maskenzeile 1 Spalten 23–32 (Regalbahn) ·
  Zeile 3 Spalten 21–22 (Turm-Absatz) · Zeile 10 Spalten 5–8 und 13–15 (Tische) ·
  Zeile 12 Spalten 1–7, 9–14, 16–22 (Boden). Oberseiten RUHIG (Punkt 10).
- Die Ein-Zell-Beine der Tische (Zeile 11, Spalten 8 und 15) sind TRAGENDE Beine —
  male sie als das (gedrechseltes Pultbein / Bücherstapel-Bein), nicht als Streifen.

## Farb- und Licht-Vertrag

- Nacht-Klassenzimmer p2: Farb-Familie der angenommenen R5b1-Blätter
  (`mass_body_p2_a/b`, `crust_p2_a/b` im selben Ordner — als REFERENZ ansehen, nicht
  collagieren). Licht von OBEN-LINKS (Mondlicht-Kanon).
- **L2-Trennung als Zahl:** die Lauf-Bänder ≥ **29,5 %** mittlere Luminanz (L2 liegt
  bei 17,5 %; Gesetz = 12 Punkte Abstand — Audit 1 misst das).
- Tiefe im PIGMENT (kühler, nie grau — DEPTH_COOL-Prinzip); keine Multiply-Optik.
- Absturz-Lippen (Laufband-Enden über Luft): blank gewetzte, hellste Stelle AUF der
  Lippe — ersetzt das tote ledgeGrain.

## Kontext (ansehen!)

`docs/n6-auftrag/koki-sicht/m4/m7/m8.png` — was heute dort steht und was darauf lebt
(Krawatte, Hemd, Pult, Käfig, Falter). Dein Gemälde ersetzt NUR das Terrain; die
Objekte darauf bleiben eigene Sprites — lass ihnen die Bühne (Punkt 10).

## Lieferung

1. PNG nach `docs/n6-auftrag/lieferung/body_p2_regal_turm_boden.png` (NICHT nach
   public/art — der Architekt importiert nach Prüfung).
2. Selbstauskunft `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_R6E.md`: md5 · wie du
   jede der 12 Checklisten-Fragen am eigenen Bild beantwortest (ehrlich, mit
   Schwachstellen) · was du nicht prüfen konntest.
3. Kein Commit, kein Code — Runde 1 ist reine Malerei.
