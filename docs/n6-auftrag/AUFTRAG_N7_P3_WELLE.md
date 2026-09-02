# N7A2 · P3-WELLE — der Schulhof-Garten wird VOLLSTÄNDIG gemalt

**Stand: 2026-09-02 · N7A2 · Runde 1** — diese Zeile zitierst du in Zeile 1 deiner
Selbstauskunft. Kommt eine Order-Änderung, ändert sich diese Zeile; was du nicht
zitieren kannst, hast du nicht gelesen.

**Maßstab ist die MACHART des abgenommenen Exemplars**
(`apps/web/public/art/g1/paint/ch01/body_p2_regal_turm_boden.png` — Kokis Urteil:
„much better!"). **Nicht seine Farbe und nicht seine Helligkeit:** das Exemplar ist
das Nacht-Klassenzimmer (kühl, Mittel 22,5 % Luminanz). Der Schulhof ist der
TAG-Raum — aber Vorsicht, das ist die häufigste Falle dieses Raumes:

> **Der Hof ist hell. Sein BODEN ist es nicht.**
> Das Tageslicht steckt in der gemalten Wand dahinter (`plate_p3_yardwall`,
> `l1_p3_a` — 81 % Luminanz). Die Spielebene ist die dunkelste, gesättigtste
> Schicht des Bildes. So funktioniert dieses Buch in jedem Raum.

## Der Wert-Vertrag (maschinell gemessen — hier fällt eine Lieferung am ehesten durch)

Bei einer Ein-Block-Welt ist **der gemalte Wert der gezeichnete Wert** — der Motor
legt keine Abdunklung mehr darüber. Gemessen an den beiden bereits umgestellten
Räumen: p1s Körper sind mit 24,5–30,8 % gemalt, das Kompositions-Audit meldet für
die Spielebene 29,8 %.

- **Mittlere Luminanz je Blatt: 30–38 %, Ziel 34 %.** Über 39 % reißt das
  Lesbarkeits-Gesetz (das Möbel-/Laubband des Hofes liegt bei 51,1 %; verlangt sind
  ≥12 Punkte Abstand). Genau daran hängt heute eine Duldung im Nacht-Klassenzimmer.
- **Sättigung ≥45 %.** Der Hof ist warm: sonnengebranntes Buchleinen, Ocker,
  Sandstein-Papier.
- **Zielmitte je Blatt ≈ rgb 115, 88, 52.** Das ist ein Anker, kein Rezept: einzelne
  Zellen dürfen weit heller und dunkler sein — der MITTELWERT des Blattes zählt.

**Farb-Referenz (ansehen, NICHT collagieren — kein Kacheln, kein Ausschneiden, kein
Weiterverwenden von Pixeln):** `crust_p3_a/b` (rgb 157,129,103 · 52 %) und
`mass_body_a/b` (rgb 155,112,65 · 46 %) sagen dir den Farbton dieses Hofes;
`plate_p3_yardwall` (rgb 179,142,76 · 57 %) ist die gemalte Rückwand mit den vier
Rundbogenfenstern und der Laterne — dein Raum steht DAVOR und muss sich von ihr
absetzen. `l2_p3` (rgb 123,135,108 · 51 %, grünlich) ist das Laub-/Möbelband: von
diesem Wert musst du weg.

**Und lies zuerst** `docs/n6-auftrag/CHECKLISTE_R6_KANON.md` (13 Punkte; Punkt 13
bindend: EINE orthografische Bodenebene fürs ganze Kapitel — gerade, waagrechte
Aufstandskanten, keine 3/4-Sockel, Seitenflächen ≤3°; wird von
`check-ground-plane` maschinell gemessen).

## Der Zell-Vertrag (bindend — das Silhouetten-Tor misst maschinell)

Alle Blätter: RGBA, Alpha-Silhouette, **64 px/Zelle**, Overpaint oben 12 / unten 16 /
seitlich 0 (**Blatthöhe = Zeilen×64+28, Blattbreite = Spalten×64**). Licht oben-links.

**Die Schablone ist der Vertrag.** Zu jedem Blatt liegt eine gleich große Datei
unter `docs/n6-auftrag/lieferung/masken/<stem>.MASKE.png`. Lege sie über dein Bild:

- **Magenta** = Pflicht-Materie. Jede Magenta-Zelle muss zu ≥98 % gedeckt sein.
- **Grünes Band** (oberste 10 px einer Zelle) = **Steh-Kante**. Dort beginnt die
  Malerei: die erste opake Zeile liegt im Fenster [Zellkante−8 px, Zellkante+2 px].
  Die gemalte Kante IST die Kollision — das Kind landet genau auf dieser Linie.
- **Transparent** = verbotenes Gebiet. Außerhalb Maske+Overpaint ≤0,5 % Alpha:
  nichts darf begehbar AUSSEHEN, was es nicht ist.

**Viertes Gesetz — Deckung ist nicht Malerei.** Die erste p1-Lieferung bestand alle
Deckungs-Prüfungen mit 100 %, weil 32 Pflicht-Zellen **reines Schwarz** waren. Das
Tor misst jetzt zusätzlich Struktur: **keine Zelle unter Wert-SD 6, keine Zelle
unter 8 % Luminanz.** Schwarz ist in diesem Kapitel ein konkretes Material (Tinte)
und sonst nichts.

Dazu: **Laufkante hell, ruhig, durchgehend — Kruste:Körper ≥ 1:2** (Checkliste
Punkt 3; die frühere Formel „≥30 % Luminanz" war nie geeicht und wird nicht
gemessen), keine Kachel-Wiederholung, kein sichtbarer Rapport.

---

## Posten A · Die Westterrasse mit der Kreide-Rutsche — das Held-Stück

**`body_p3_westterrasse_rutsche`** — c0=0, r0=15, 22×11 Zellen, Blatt **1408×732**,
194 Pflicht-Zellen.
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_westterrasse_rutsche.MASKE.png`

Die abgetreppte **Bücherböschung** im Westen des Hofes: aufgeschichtete Bände, aus
denen der Hof seine Terrassen bildet. Sie ist **ein einziges Gemälde** für die
Lauffläche, die Treppung, die Flanken und die Unterseite.

**Die wichtigste Stelle des Blattes ist die Diagonale.** Was in der Maske als
Treppe nach rechts unten abfällt, ist die Schulter, an der die **Kreidestaub-Rutsche**
liegt. Der freie Bereich rechts der Treppung ist KEIN Fehler und wird von dir NICHT
gefüllt: dort zeichnet der Motor die Rutsche als eigenes Blatt. Male die Böschung
so, dass diese Schulter eine **saubere, erzählte Kante** ist — die Bücher enden dort
als Material (Schnitte, Lagen, Bindung sichtbar), nie als glatter Schnitt, und die
Kante lädt sichtbar zum Hinuntergleiten ein: eine abgeriebene, kreideweiß
abgeschliffene Bahnkante entlang der ganzen Diagonale.

Unten läuft die Böschung in den durchgehenden Hofboden aus (Maskenzeilen 6–11).
Rechts unten enden die letzten zwei Spalten frei — auch dort: Kante als Material.

Innen: Bücherlagen im Verband, große weiche Wertflächen, Ereignisse (Flecken,
Kreidestaub, Abrieb) lokal — nie als Muster. Unterseite und Flanken tragen die
Geschichte (Punkt 4 und 10), die Lauffläche bleibt ruhig.

```
##########............
#############.........
##############........
################......
###################...
######################
####################..
####################..
####################..
####################..
####################..
```

## Posten B · Die Ostmauer mit dem Ausgangssims

**`body_p3_ostmauer_sims`** — c0=40, r0=14, 24×12 Zellen, Blatt **1536×796**,
187 Pflicht-Zellen.
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_ostmauer_sims.MASKE.png`

Die Ostseite des Hofes: eine in drei Stufen ansteigende Mauer aus gestapelten
Bänden, oben der **Ausgangssims** — die einzelne Zelle ganz oben (Maskenzeile 1,
Spalte 21) ist die Schwelle, auf der die Tür zur Tafel-Bühne steht. Sie ist die
letzte Kante, die ein Kind in diesem Raum betritt: sie muss als **Schwelle** lesbar
sein (ein breiter, abgetretener Buchschnitt), nicht als abgebrochener Rest.

Die drei Stufen (Maskenzeilen 2–4 · 5–7 · 8–12) sind EINE Mauer, kein Stapel aus
drei Objekten: die Absätze wachsen als gemalter Kragen auseinander hervor (Punkt 6),
nie gestoßen. Links unten läuft die Mauer in den Hofboden über.

```
....................#...
................########
................########
................########
..........##############
..........##############
..........##############
########################
########################
########################
########################
########################
```

## Posten C · Der Mittelpfeiler — der freistehende Pultsockel

**`body_p3_mittelpfeiler`** — c0=22, r0=17, 8×9 Zellen, Blatt **512×604**,
48 Pflicht-Zellen.
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_mittelpfeiler.MASKE.png`

Der Sockel in der Hofmitte, auf dem das Lesepult steht: ein schlanker Schaft aus
zwei Spalten (Maskenzeilen 1–3), der sich nach unten verbreitert (Zeile 4), einen
seitlichen Absatz ausbildet (Zeile 5, links) und im Hofboden fußt (Zeilen 6–9).

**Punkt 2 der Checkliste ist hier bindend:** was steht, verjüngt sich nach oben —
der Schaft trägt sichtbar. Der Absatz links ist ein **gewachsener** Auflagerkragen,
kein angesetzter Klotz; die Lücke zwischen Absatz und Schaft (Zeile 5, Spalte 5)
bleibt frei und ist Teil der Silhouette.

```
......##
......##
......##
.....###
####.###
########
########
########
########
```

## Posten D · Die Decken-Familie (DREI Blätter, EIN Wurf — eine Vokabel)

Die Decke des Hofes ist im Raster **eine** durchgehende Reihe über die volle Breite.
Sie kommt nur deshalb als drei Blätter, weil ein Blatt sonst 4096 px breit wäre
(Grenze 3072). **Male sie als EIN Bild in drei Abschnitten:** dieselbe Vokabel,
derselbe Lichtverlauf, an den Blattgrenzen keine Zäsur — Blatt D1 endet mit Spalte
22, D2 setzt bei Spalte 23 an, ohne dass man die Naht sieht.

Motiv: der Hof liegt IM Buch, sein Himmel ist Malerei. Über ihm hängt ein
**Laubdach aus Papier** — aufgefächerte Seiten und Blätter, die wie Blattwerk über
den Hof reichen, an einem Rücken aufgereiht. Die Unterseite (das, was das Kind
sieht) trägt das Detail; die Steh-Kante oben ist die Weltkante.

**D1 `body_p3_deckenbahn_west`** — c0=0, r0=0, 22×1 Zellen, Blatt **1408×92** · über der Westterrasse
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_deckenbahn_west.MASKE.png`

```
######################
```

**D2 `body_p3_deckenbahn_mitte`** — c0=22, r0=0, 22×1 Zellen, Blatt **1408×92** · über dem Hofmittelstück
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_deckenbahn_mitte.MASKE.png`

```
######################
```

**D3 `body_p3_deckenbahn_ost`** — c0=44, r0=0, 20×1 Zellen, Blatt **1280×92** · über der Ostmauer bis zur Tür
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_deckenbahn_ost.MASKE.png`

```
####################
```

---

## Lieferung

1. Alle PNGs nach `docs/n6-auftrag/lieferung/` (Dateiname = Stem + `.png`).
2. `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7P3.md`: in Zeile 1 die Stand-Zeile
   dieser Order; dann je Blatt md5 + Blattmaß + **gemessene mittlere Luminanz und
   Sättigung** + ehrliche Antworten auf die 13 Checklisten-Punkte + **was du nicht
   prüfen konntest**.
3. Kein Commit, kein Code, keine Datei außerhalb von `docs/n6-auftrag/lieferung/`.
4. Kein lokales Flicken — jedes Blatt ist EIN Wurf.
