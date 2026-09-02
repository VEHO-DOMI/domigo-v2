# N7A1 · MÖBEL ORTHOGRAFISCH — fünf Blätter p1, ein Blatt p2

**Stand: 2026-09-02 · N7A1 · Möbel · Runde 1** — diese Zeile zitierst du in Zeile 1
deiner Selbstauskunft.

**Warum es diese Runde gibt.** Kokis Befund „tilted" an den alten Blättern hat eine
gemessene Ursache: 3/4-Perspektive mit V-förmiger Aufstandskante und je Blatt anderem
Fluchtwinkel (11°–49°). Daraus wurde **Punkt 13** des Kanons — EINE orthografische
Bodenebene fürs ganze Kapitel. Diese sechs Blätter sind die p1-Hälfte dieser Reparatur
(die p2-Hälfte ist bis auf ein Blatt schon abgenommen).

**Lies zuerst** `docs/n6-auftrag/CHECKLISTE_R6_KANON.md` — alle 13 Punkte, Punkt 13
wörtlich. **Machart-Maßstab:** `apps/web/public/art/g1/paint/ch01/body_p2_regal_turm_boden.png`
(Kokis „much better!"). **Abgenommene Möbel derselben Welle als Formvorbild:**
`docs/n6-auftrag/lieferung/terrain_night_bundle_p2.png`, `…_shelf_p2.png`,
`…_folio_p2.png` — sieh sie dir an, sie zeigen die richtige Auflösungs-Stufe und die
gerade Unterkante. **Farbe:** p1 ist der WARME Raum (Leder, Ocker, gebranntes
Buchleinen — `mass_body_p1_a–d`, `crust_p1_a/b` im Kunst-Ordner ansehen), p2 ist
kühl blauviolett. Nie collagieren, nur ansehen.

## Das Gesetz dieser Blätter

1. **Frontal-orthografisch.** Ein Kamerastandpunkt fürs ganze Kapitel: von vorn,
   keine Fluchtpunkte, kein perspektivischer Sockel.
2. **Gerade waagrechte Unterkante über ≥80 % der Blattbreite.** Kein V, keine
   Rundung, kein Schatten-Auslauf, der die Kante ersetzt. Seitenflächen an
   Kontaktkanten kippen **≤3°**. Das misst `check-ground-plane` maschinell.
3. **Die Oberseite ist die Lauffläche** — ruhig, durchgehend, waagrecht: das Kind
   steht darauf. Die Geschichte sitzt an Flanke und Unterseite (Punkt 10).
4. **Auflösungs-Stufe: 64 px je Zelle.** Die Blattbreite ist deshalb exakt
   Zellen × 64 px. (Die alten 399-px-Blätter im Kunst-Ordner sind Altbestand —
   nicht ihre Größe kopieren, nur ihr Motiv.)
5. **Leinwand auf den Inhalt getrimmt:** Blatthöhe = Objekthöhe + ~8 px. Kein
   leerer Alt-Kanvas oben oder unten — er wandert sonst als Loch in die Welt.
6. **Unter der Lauffläche höchstens 2 Zellen Tiefe.** Was darüber aufragt (Lehne,
   Pult-Aufsatz), ist Motiv und zählt nicht mit; was darunter hängt, wird von der
   Maschine geschrumpft und lässt dann seine Zelle nackt.
7. RGBA, Alpha-Silhouette, Licht oben-links, keine Kachel-Wiederholung.

## Posten D · Die fünf Möbel der Eingangshalle (p1, warm)

Gleiche Motive, gleiche Namen, gleiche Zellbreite wie heute — neu gemalt.

| Stem | Zellen | Blatt (B×H, ±8 px) | Was es ist |
|---|---|---|---|
| `terrain_reading_bench_p1` | 2 | **128×62** | Lesebank: Sitzbrett aus Buchdeckeln, zwei gerade Wangen, gerade Standkante |
| `terrain_book_bundle_p1` | 2 | **128×60** | verschnürtes Bücherbündel, liegend, oberstes Buch ist die Lauffläche |
| `terrain_book_shelf_p1` | 3 | **192×68** | niedriges Regalbrett aus einem Bücherstapel im Verband |
| `terrain_book_shelf_p1_alt` | 3 | **192×74** | Schwester des Regals, anderes Bücher-Motiv — die beiden dürfen sich NICHT gleichen |
| `terrain_book_folio_p1` | 1 | **64×26** | einzelnes liegendes Folio, flach, mit sichtbarem Buchschnitt an der Flanke |

## Posten E · Das Nacht-Stehpult (p2, kühl) — Neuwurf

`terrain_night_lectern_p2` · 2 Zellen · Blatt **128×110 ±8 px**.

Das gelieferte Blatt der letzten Runde war 2,75 Zellen hoch (gemessen an
`docs/n6-auftrag/lieferung/terrain_night_lectern_p2.png`, Inhalt y38–213 bei 128 px
Breite) und hinge als Stalaktit unter der Schwebe-Linie. Neu, mit richtiger
Proportion: **2 Zellen breit, Objekt gesamt ≈1,6–1,8 Zellen hoch** — Stehpult mit
schräger Lesefläche oben (die **Steh-Kante** ist ihre waagrechte Vorderkante!),
**EIN** gedrechselter Fuß, **gerade Basis**. Nacht-Palette der p2-Familie.

## Lieferung

1. Alle sechs PNGs nach `docs/n6-auftrag/lieferung/` (Dateiname = Stem + `.png`).
2. `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7_MOEBEL.md`: in Zeile 1 die
   Stand-Zeile dieser Order; dann je Blatt md5 + Blattmaß + gemessene Reichweite
   der Unterkante + ehrliche Antworten auf die 13 Punkte + was du nicht prüfen
   konntest.
3. Kein Commit, kein Code, keine Datei außerhalb `docs/n6-auftrag/lieferung/`.
4. Jedes Blatt ein Wurf.
