# R7 · P2-WELLE — das Nacht-Klassenzimmer wird VOLLSTÄNDIG gemalt

**Maßstab: das abgenommene Exemplar** (`apps/web/public/art/g1/paint/ch01/body_p2_regal_turm_boden.png`
— Kokis Urteil: „much better!") **+ CHECKLISTE_R6_KANON.md, jetzt mit Punkt 13:**
EINE orthografische Bodenebene fürs ganze Kapitel — gerade, waagrechte Aufstands-
kanten, keine 3/4-Sockel, keine perspektivischen Seitenflächen an Kontaktkanten
(Kokis „tilted"-Befund; wird von `check-ground-plane` maschinell gemessen:
Reichweite ≥80 %, Kipp ≤3°).

Alle Blätter: RGBA, Alpha-Silhouette, **64 px/Zelle**, Overpaint oben 12 / unten 16 /
seitlich 0 (Blatthöhe = Zeilen×64+28, Breite = Spalten×64). Nacht-Palette des
Exemplars. Licht oben-links. Steh-Regel gilt maschinell: jede Masken-Zelle mit Luft
darüber ist Stehfläche — erste opake Zeile im Fenster [Zellkante−8 px, Zellkante+2 px],
Laufband ≥30 % Luminanz, keine Zelle unter Wert-SD 6, keine Kachel-Wiederholung.
Kern-Deckung ≥98 % je Zelle, Alpha außerhalb Maske+Gürtel ≤0,5 %.

## Posten A · `body_p2_ostwand_treppe_boden` — das zweite Held-Stück (17×25, Blatt 1088×1628)

c0=55, r0=1. EIN Gemälde für: die Ostwand (rechte Raumkante, Spalte ganz rechts,
volle Höhe) → die **Bücherstapel-Treppe**, die von ihr herabsteigt → den Ausgangs-Sims
→ den Ostboden. ⚠ Die Treppe ERSETZT die drei gekippten Säulen (`terrain_pillar_p2_8/5/2`)
— male die Stufen als gewachsene Bücherstapel MIT gerader Aufstandskante auf dem Boden
(Punkt 13!), wurzelnd wie der Turm des Exemplars. Wand innen: Bücherlagen im Verband,
Fensterlicht-Seite kühl. Maske (`#` = Körper; Zeile 1 = Grid-Zeile r1):

```
................#
................#
................#
................#
................#
................#
................#
................#
................#
................#
................#
##..............#
##..............#
##..............#
####............#
####............#
####............#
######........###
######..........#
#################
#################
#################
#################
#################
#################
```

## Posten B · Die Decken-Familie (VIER Blätter, EIN Wurf — gleiche Vokabel)

Nacht-Decke = hängende Bücherlagen/Deckenbalken der Bibliothek; hängende Elemente
wachsen mit gemaltem Kragen AUS der Decke (nie gestoßen), verjüngen zur Spitze
(Checkliste 2). Oberkante bündig (Weltrand).

**B1 `body_p2_deckenbahn_west`** — c0=0, r0=0, 24×5, Blatt 1536×348. Decke + der
kurze hängende Bücher-Pfeiler (rechts, ersetzt `terrain_hanging_pillar_p2_short`):
```
########################
......................##
......................##
......................##
......................##
```

**B2 `body_p2_deckenbahn_mitte`** — c0=24, r0=0, 31×1, Blatt 1984×92:
```
###############################
```

**B3 `body_p2_tafelgeruest`** — c0=24, r0=1, 31×5, Blatt 1984×348. Das hängende
Tafel-Gerüst: zwei Einzel-Hänger (Seile/Leisten), Querholm, unten die zwei
auseinanderlaufenden Seitenborde — EIN Ding mit eigener Silhouette, an B2
angewachsen gedacht (Kragen oben einmalen):
```
......#....#...................
......######...................
......#....#...................
......#....#...................
#######....####################
```

**B4 `body_p2_deckenbahn_ost`** — c0=55, r0=0, 17×8, Blatt 1088×540. Decke + der
lange hängende Bücher-Pfeiler (links, ersetzt `terrain_hanging_pillar_p2`):
```
#################
##...............
##...............
##...............
##...............
##...............
##...............
##...............
```

## Posten C · `body_p2_pultreihe_r9` — c0=34, r0=9, 20×1, Blatt 1280×92

Die lange freischwebende Pultreihe/Regalbahn über dem Raum — EIN Brett-Gemälde:
durchgehende gerade Ober- UND Unterkante (Punkt 13), Bücher/Hefte liegen AUF ihr
(ruhige Lauffläche, Detail an der Unterseite: Konsolen-Schatten, Buchschnitte).

## Posten D · Die Möbel-Familie p2 NEU (SECHS Blätter — Kokis Entscheid 01.09.)

Die sechs Sims-Möbel werden in der ORTHOGRAFISCHEN Bodenebene neu gemalt (heute
tragen sie 3/4-Seitenflächen bis 46°): `terrain_night_folio_p2` (1 Zelle) ·
`terrain_night_dictionary_p2` (1) · `terrain_night_bundle_p2` (2) ·
`terrain_night_lectern_p2` (2) · `terrain_night_shelf_p2` (3) ·
`terrain_night_lectern_shelf_p2` (4). Gleiche Motive/Namen, gleiche Zellbreite,
Höhe frei nach gemaltem Aspekt — aber: **gerade waagrechte Unterkante über ≥80 %
der Breite, Frontal-Ansicht, Seitenfläche ≤3°.** Blattbreite = Zellen×64 px,
Auflösung wie das Exemplar.

## Lieferung

1. Alle PNGs nach `docs/n6-auftrag/lieferung/` (Dateiname = Stem).
2. `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_R7P2.md`: je Blatt md5 + ehrliche
   Antworten auf die 13 Checklisten-Punkte + was du nicht prüfen konntest.
3. Kein Commit, kein Code. Kein lokales Flicken — jedes Blatt ein Wurf.
