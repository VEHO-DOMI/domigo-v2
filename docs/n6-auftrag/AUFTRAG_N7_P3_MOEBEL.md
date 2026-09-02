# N7A2 · MÖBEL ORTHOGRAFISCH — die drei Blätter des Schulhofs

**Stand: 2026-09-02 · N7A2 · Möbel · Runde 1** — diese Zeile zitierst du in Zeile 1
deiner Selbstauskunft.

**Warum es diese Runde gibt.** Kokis Befund „tilted" an den alten Blättern hat eine
gemessene Ursache: 3/4-Perspektive mit V-förmiger Aufstandskante und je Blatt anderem
Fluchtwinkel. Daraus wurde **Punkt 13** des Kanons — EINE orthografische Bodenebene
fürs ganze Kapitel. Die Eingangshalle und das Nacht-Klassenzimmer sind repariert;
diese drei Blätter sind der Schulhof. Zwei von ihnen stehen heute mit Namen in der
Duldungsliste des Aufstands-Tors (`plat_plank_2`, `ledge_windowsill`) — diese
Lieferung ist das, was die Zeilen beendet.

**Lies zuerst** `docs/n6-auftrag/CHECKLISTE_R6_KANON.md` — alle 13 Punkte, Punkt 13
wörtlich. **Machart-Maßstab:** `apps/web/public/art/g1/paint/ch01/body_p2_regal_turm_boden.png`
(Kokis „much better!"). **Abgenommene Möbel derselben Reparatur als Formvorbild:**
`apps/web/public/art/g1/paint/ch01/terrain_reading_bench_p1.png`,
`…/terrain_book_shelf_p1.png`, `…/terrain_book_folio_p1.png` — sieh sie dir an: sie
zeigen die richtige Auflösungs-Stufe und die gerade Unterkante.

**Farbe:** der Schulhof ist der TAG-Raum, warm und sandig — `crust_p3_a/b`
(rgb 157,129,103), `mass_body_a/b` (rgb 155,112,65), Rückwand `plate_p3_yardwall`
(rgb 179,142,76). Ansehen, **nie collagieren**. Die Möbel dürfen heller sein als der
Boden (sie sind die Möbel-Ebene, gemessen 51 % Luminanz) — aber sie bleiben Buch-
Material, kein Gartenholz.

## Das Gesetz dieser Blätter

1. **Frontal-orthografisch.** Ein Kamerastandpunkt fürs ganze Kapitel: von vorn,
   keine Fluchtpunkte, kein perspektivischer Sockel.
2. **Gerade waagrechte Unterkante über ≥80 % der Blattbreite.** Kein V, keine
   Rundung, kein Schatten-Auslauf, der die Kante ersetzt. Seitenflächen an
   Kontaktkanten kippen **≤3°**. Das misst `check-ground-plane` maschinell.
3. **Die Oberseite ist die Lauffläche** — ruhig, durchgehend, waagrecht: das Kind
   steht darauf. Die Geschichte sitzt an Flanke und Unterseite (Punkt 10).
4. **Auflösungs-Stufe: exakt 64 px je Zelle.** Die Blattbreite ist deshalb exakt
   Zellen × 64 px — **keine andere Zahl**. (Die heutigen p3-Blätter sind 943, 420 und
   372 px breit: Altbestand einer älteren Konvention. Nicht ihre Größe kopieren, nur
   ihr Motiv.)
5. **Leinwand auf den Inhalt getrimmt:** Blatthöhe = Objekthöhe + ~8 px. Kein leerer
   Alt-Kanvas oben oder unten — er wandert sonst als Loch in die Welt.
6. **Unter der Lauffläche höchstens 128 px Blatt.** Was darüber aufragt (Lehne,
   Pflanztrog, Pult-Aufsatz), ist Motiv und zählt nicht mit; was darunter hängt, wird
   von der Maschine geschrumpft und lässt dann seine Zelle nackt.
7. RGBA, Alpha-Silhouette, Licht oben-links, keine Kachel-Wiederholung.

## Posten E · Die drei Möbel des Schulhofs

Gleiche Namen und gleiche Zellbreite wie heute — neu gemalt. **Die drei Breiten
müssen verschieden bleiben** (4 · 2 · 1): der Planer wählt bei gleicher Zellbreite
immer dasselbe Objekt, und zwei Blätter derselben Breite kosten eines davon sein
Dasein im Spiel.

| Stem | Zellen | Blatt (B×H, Höhe ±8 px) | Was es ist |
|---|---|---|---|
| `plat_plank_2` | 4 | **256×80** | die lange Hof-Bohle: ein breites, wettergegerbtes Brett aus gepressten Seiten, auf zwei niedrigen Bücherstapeln aufliegend — die Bohle IST die Lauffläche, die Stapel tragen sichtbar |
| `ledge_windowsill` | 2 | **128×72** | die Fensterbank unter den Rundbogenfenstern der Hofwand: eine kräftige waagrechte Sohlbank mit vorspringender Tropfkante an der Flanke, aus demselben Sandstein-Papier wie die Wand |
| `plat_column2_1` | 1 | **64×72** | der Hof-Poller: ein kurzer, gedrungener Pfosten aus aufgerolltem Papier mit gebundenem Kopf — schmal, standfest, gerade Basis |

**Das eine, was sie NICHT sein dürfen:** die Bank, das Bündel oder das Regal aus den
Innenräumen in anderer Farbe. Der Hof teilt mit Eingangshalle und Klassenzimmer
**kein** Motiv (Punkt 12 meint dieselbe Grammatik, nicht dieselben Möbel).

## Lieferung

1. Alle drei PNGs nach `docs/n6-auftrag/lieferung/` (Dateiname = Stem + `.png`).
2. `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7P3_MOEBEL.md`: in Zeile 1 die
   Stand-Zeile dieser Order; dann je Blatt md5 + Blattmaß + gemessene Reichweite der
   Unterkante + ehrliche Antworten auf die 13 Punkte + was du nicht prüfen konntest.
3. Kein Commit, kein Code, keine Datei außerhalb `docs/n6-auftrag/lieferung/`.
4. Jedes Blatt ein Wurf.
