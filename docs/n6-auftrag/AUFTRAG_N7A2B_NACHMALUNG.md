# N7A2b · NACHMALUNG — das Möbelband des Nacht-Klassenzimmers und zwei Hof-Böden

**Stand: 2026-09-02 · N7A2b · Runde 1** — diese Zeile zitierst du in Zeile 1 deiner
Selbstauskunft. Kommt eine Order-Änderung, ändert sich diese Zeile; was du nicht
zitieren kannst, hast du nicht gelesen.

Diese Order hat **zwei Posten mit zwei verschiedenen Verträgen**:

- **Posten A** ist eine **Hintergrund-Bahn** (`l2_p2`). Keine Schablone, kein
  Zell-Vertrag — dafür ein harter **Wert-Vertrag** und eine **Kachel-Naht**.
- **Posten B** sind **zwei Welt-Körper** des Schulhofs. Schablone, Zell-Vertrag,
  fünf maschinelle Gesetze — und der Wert-Vertrag, den deine letzte Lieferung
  bereits erfüllt hat.

**Lies zuerst** `docs/n6-auftrag/CHECKLISTE_R6_KANON.md` — **alle 13 Punkte sind
bindend.** Punkt 13 ist der jüngste und darum eigens genannt: EINE orthografische
Bodenebene fürs ganze Kapitel — gerade, waagrechte Aufstandskanten, keine
3/4-Sockel, Seitenflächen ≤3°.

## Wie gemessen wird (damit deine Zahlen und meine dieselben sind)

Ohne diesen Absatz sind alle Prozentzahlen unten Auslegungssache — dieses Haus
benutzt an verschiedenen Stellen verschiedene Luminanz-Formeln.

- **Luminanz** = `(0,2126·R + 0,7152·G + 0,0722·B) / 255`, in Prozent.
- **Sättigung** = `(max(R,G,B) − min(R,G,B)) / max(R,G,B)`, in Prozent.
- **Beides gemittelt** über die Bildpunkte mit **Alpha ≥ 128**, im **3-Pixel-Schritt**
  in x und y über das ganze Blatt.
- **Kanten-Dichte** (Gesetz 5) = Anteil der Punkte, deren lokaler Sprung
  `hypot(L(x+1,y)−L(x,y), L(x,y+1)−L(x,y))` **> 12** ist, über die **inneren 80 %**
  jeder Pflicht-Zelle, nur dort wo der Punkt und seine zwei Nachbarn Alpha ≥ 128
  haben. **Achtung, andere Formel:** hier gilt `L = 0,299·R + 0,587·G + 0,114·B`
  (0–255, nicht normiert) — so rechnet das Tor.

**Prüfe deine Blätter selbst, bevor du lieferst.** Die Tore laufen bei dir:

```
node --experimental-strip-types scripts/check-body-silhouette.mjs --sheet docs/n6-auftrag/lieferung/<stem>.png --body <id>
node --experimental-strip-types scripts/check-ground-plane.mjs   --sheet docs/n6-auftrag/lieferung/<stem>.png
```

`<id>` ist `p3_westterrasse_rutsche` bzw. `p3_mittelpfeiler`. Das zweite Tor misst
Punkt 13 (Reichweite ≥80 %, Kipp ≤3°) — **aber nur in dieser `--sheet`-Form.** Sein
normaler Lauf sieht Körper-Blätter gar nicht an; verlass dich also nicht darauf, dass
„die Maschine das schon prüft". Für `l2_p2` gibt es kein solches Tor — dort zählen
allein die Zahlen aus Posten A.

---

## Warum es diese Order gibt — und warum Zahlen dich diesmal nicht retten

Deine drei p3-Runden endeten mit **allen fünf Gesetzen grün** und dem Wert-Vertrag
erfüllt. Danach hat eine unabhängige Leserin, die nur die Bilder sah, drei
Vorher/Nachher-Paare gegen die 13 Punkte befragt. Ergebnis **1 : 1 : 1**:

- **Ostmauer — deine neue Fassung gewinnt deutlich.** Wörtlich: „die überzeugendste
  Materialdarstellung im gesamten Test: individuelle Bücher unterschiedlicher Länge
  und Farbe, versetzte Fugen wie ein Mauerverband, keine erkennbare Wiederholung".
- **Hofmitte — gespalten.** Der Pfeiler ist „die beste Materiallösung der gesamten
  Prüfung". Die **kleine Plattform links** dagegen: „eine reine braune Fläche ohne
  jede Textur, Kante oder Objekt-Identität" — ihr schwerster Einzelbefund.
- **Westterrasse — die ALTE Fassung gewinnt.** An der neuen trage die Spielfläche
  „keinerlei Materialidentität — reiner brauner Verlauf".

**Das Maß über das GANZE Blatt sagt nichts.** Kanten-Dichte im Median, dieselbe
Formel, die Gesetz 5 fährt, über alle Pflicht-Zellen:

| Blatt | Kanten-Median (ganzes Blatt) | Urteil des Menschen |
|---|---|---|
| Exemplar `body_p2_regal_turm_boden` (abgenommen, „much better!") | 20,8 % | das Vorbild |
| `body_p3_westterrasse_rutsche` (deine Runde 3) | 26,0 % | **abgelehnt** |
| `body_p3_ostmauer_sims` (deine Runde 3) | 36,3 % | **gewonnen** |

Das abgelehnte Blatt misst **höher** als das abgenommene Vorbild. Wer auf diese Zahl
optimiert, läuft in den Irrweg, den drei Runden schon abgelaufen sind: Runde 1 kam
mit flacher Füllung, Runde 2 mit Rauschen, Runde 3 mit einem Wasch-Ton — jede erfüllte
das neue Maß und verfehlte die Sache.

**★ Es gibt aber eine Stelle, an der die Zahl sehr wohl spricht — und das ist die
Stelle, auf der das Kind steht.** Dieselbe Formel, aber nur über die **Steh-Zellen**
gerechnet (je Spalte die oberste Pflicht-Zelle — die Fläche, die das Kind betritt):

| Blatt | Steh-Zellen | Kanten-Median der Steh-Zellen | schwächste |
|---|---|---|---|
| Exemplar `body_p2_regal_turm_boden` | 32 | **27,4 %** | 4,0 % |
| `body_p3_ostmauer_sims` (gewonnen) | 24 | **32,1 %** | 17,9 % |
| `body_p3_mittelpfeiler` (gespalten) | 8 | **54,1 %** | 16,7 % |
| `body_p3_westterrasse_rutsche` (abgelehnt) | 22 | **1,9 %** | 1,9 % |

**1,9 gegen 27,4 und 32,1.** Die Lauffläche der Westterrasse ist über ihre ganze
Länge praktisch leer — und genau das hat die Leserin „reiner brauner Verlauf ohne
Materialidentität" genannt. Der Körper des Blattes ist gut gemalt; **die Fläche, auf
der gelaufen wird, ist es nicht.**

**Bindend für Posten B1: die Steh-Zellen erreichen den abgenommenen Bereich.** Ziel
ist der Median der Ostmauer (32 %), Untergrenze der Bereich des Exemplars — kein
Steh-Zellen-Median unter 20 %, keine einzelne Steh-Zelle unter 4 %.

⚠ **Und die ehrliche Grenze dieser Zahl:** beim Mittelpfeiler erklärt sie nichts. Seine
Steh-Zellen messen 54,1 % im Median und die kleine Plattform links liegt bei 17–29 % —
mitten im abgenommenen Bereich —, und die Leserin hat sie trotzdem als „reine braune
Fläche ohne Objekt-Identität" abgelehnt. **Eine Fläche kann Kanten haben und trotzdem
kein Ding sein.** Für Posten B2 gilt deshalb kein Zahlenziel, sondern die Ostmauer.

**Also nicht auf Zahlen zielen. Auf die Ostmauer zielen.** Sie liegt im Repo, sie ist
DEIN eigenes Blatt, und sie hat gewonnen:

> `apps/web/public/art/g1/paint/ch01/body_p3_ostmauer_sims.png` — **SIEH SIE DIR AN.**
> Was sie richtig macht: einzeln gemalte Bücher, unterschiedlich lang, unterschiedlich
> gefärbt, die Fugen versetzt wie ein Mauerverband. Kein Raster. Keine Wiederholung.
> **Jeder Band ist ein Ding, nicht eine Textur.**
>
> ⚠ **Ansehen, nicht weiterverwenden.** Auch für dieses Blatt gilt die Collage-Sperre:
> kein Ausschneiden, kein Kacheln, kein Übernehmen von Pixeln. Du malst neu, was sie
> richtig macht.
>
> ⚠ **Und übernimm ihre Lichtrichtung.** Kein Tor misst sie, und genau deshalb ist sie
> die wahrscheinlichste Art, den Raum auseinanderfallen zu lassen: drei Blätter mit
> drei Sonnenständen lesen als drei Räume. Sieh der Ostmauer an, woher ihr Licht kommt,
> und male die zwei Blätter aus derselben Richtung (Konvention des Kapitels:
> **oben-links**).

Das ist die ganze Aufgabe von Posten B: **dasselbe noch zweimal.**

---

# POSTEN A · Das Möbelband des Nacht-Klassenzimmers

**`l2_p2`** — Blatt **2048×382**, RGBA mit Alpha-Silhouette. **Keine Schablone.**
Vorlage zum Ansehen: `apps/web/public/art/g1/paint/ch01/l2_p2.png` (das Blatt, das
heute im Spiel liegt).

## Was das Blatt IST

Die vorderste Möbelreihe des **Nacht-Klassenzimmers**, in Aquarell gemalt: schwere
**Pulte mit hohen, geschwungenen Rückwänden**, darauf **Bücherstapel**, dazwischen
**kleine Laternen und Kerzen mit warmem Schein**, und rechts der Mitte eine große
**Topfpflanze auf einem Sockel**. Es ist **Hintergrund**, kein Boden: das Kind läuft
nicht darauf, es läuft davor. Das Band kachelt horizontal und scrollt mit halber
Geschwindigkeit mit.

**Motiv, Anordnung und Machart bleiben:** dieselben Möbel, an denselben
x-Positionen, in derselben Silhouette, in derselben Aquarell-Handschrift. Der Raum
soll sich nicht umstellen — er soll anders **beleuchtet** sein.

⚠ **Die Laternen bleiben warm.** Der Wert-Vertrag unten ist ein **MITTELWERT über
das ganze Blatt**. Kleine, kräftig warme Lichter sind ausdrücklich erlaubt und
erwünscht — sie sind die Seele dieses Bandes und der einzige warme Ton im Raum. Ein
Blatt, das die Laternen ausknipst oder ausgraut, um eine Zahl zu treffen, wird
zurückgewiesen. Der Weg zum Mittelwert führt über die großen Flächen (Holz, Leinen,
Papier, Laub), nicht über die Lichter.

## Der Wert-Vertrag — der eigentliche Grund dieser Bestellung

Das Spiel hat ein **Lesbarkeits-Gesetz**: die Möbelreihe (L2) und die Figuren und
Gegner davor (L3) müssen **≥12 Punkte Luminanz ODER ≥25 Punkte Sättigung**
auseinanderliegen, damit sich nie ein Gegner gegen die Möbel tarnen kann. Gemessen
am heutigen Bau:

| | Luminanz | Sättigung | Mittel-rgb |
|---|---|---|---|
| L3 — Figuren und Gegner davor | 27,2 % | **54,1 %** | — |
| L2 — dein Band, heute | 17,5 % | **64,1 %** | 42,40,101 |
| Abstand | 9,7 | 10,0 | *beides zu wenig* |

Über die Luminanz ist das nicht zu lösen: das Band müsste unter 15,2 % — und der
Boden seines eigenen erlaubten Bandes liegt bei 15,0 %. Das Fenster ist praktisch
zu. **Also über die Sättigung**, und das ist zugleich die Fiktion dieses Raumes:

> **Mondlicht entfärbt.** Ein Nacht-Klassenzimmer ist nicht bunt. Holz, Papier und
> Leinen verlieren im Mondlicht ihre Farbe und behalten ihre Form.

**Bindend:**

1. **Mittlere Sättigung ≤ 27 %** (heute 64,1). Das ist der tragende Wert; darunter
   greift das Gesetz mit 2 Punkten Reserve.
2. **Mittlere Luminanz 15,0 – 16,0 %** (heute 17,5). Muss in diesem Fenster liegen —
   unter 15,0 fällt das Blatt aus seinem eigenen Band.
3. **Mittel-rgb**: heute 42,40,101 — ein kräftiges Blauviolett. Ziel ist ein
   **entsättigtes, kühles Grau-Blau**. Als Anker: **rgb 40,38,52** — dieser Wert
   trifft beide Vorgaben zugleich (Luminanz 15,5 %, Sättigung 26,9 %). Anker, kein
   Rezept: einzelne Stellen dürfen deutlich wärmer und kälter sein, der MITTELWERT
   des Blattes zählt.

⚠ **Eine Filter-Entsättigung des alten Blattes wird zurückgewiesen.** Sie ist an der
Flachheit erkennbar: sie zieht Lichter und Tiefen gemeinsam zur Mitte und macht das
Band tot. Genau deshalb ist diese Bestellung eine **Neu-Malung** und kein Rechenlauf.
Male die Möbel *im Mondlicht* — mit eigenen Lichtern (eine Kante, die das Fenster
fängt), eigenen Tiefen und der ganzen Zeichnung, die eine Silhouette im Halbdunkel
trägt. Wenig Farbe heißt nicht wenig Malerei.

## Die Kachel-Naht

Das Band wird horizontal gekachelt: die **rechte Kante trifft die linke**.

**So wird der Sprung gerechnet** (ohne diese Vorschrift bekommt man je nach Rezept
andere Zahlen — mit 2-Pixel-Mittelung z. B. 6,73 statt 7,60):
für jede Bildzeile `y` die **eine** Pixelspalte `x = 0` gegen die **eine** Spalte
`x = Breite−1`; gezählt werden nur Zeilen, in denen **beide** Punkte Alpha ≥ 128
haben; Sprung = Betrag der Luminanz-Differenz (Formel oben) in Prozentpunkten;
gemeldet werden **Mittelwert und Maximum** über diese Zeilen.

Das heutige Blatt misst so **7,60 im Mittel / 11,26 im Maximum** über 245 Zeilen.
Das ist der Maßstab — **nicht schlechter als heute**: mittlerer Sprung ≤ 7,6.
Perfektion wird nicht verlangt, ein sichtbarer Bruch schon zurückgewiesen.

## Was gemessen wird

Blattmaß exakt 2048×382 · mittlere Luminanz · mittlere Sättigung · Mittel-rgb ·
Alpha-Deckung (heute 62,1 % des Blattes) · Naht-Sprung an der x-Kante ·
Deckungsgleichheit der Silhouette mit dem heutigen Blatt (Kontinuitäts-Zahl, kein Tor).

---

# POSTEN B · Zwei Böden des Schulhofs

**Die Ostmauer wird NICHT neu bestellt.** Sie ist das Vorbild, und sie bleibt im
Spiel liegen. Diese zwei Blätter sollen zu ihr passen.

## Der Zell-Vertrag (bindend — das Silhouetten-Tor misst maschinell)

Beide Blätter: RGBA, Alpha-Silhouette, **64 px/Zelle**, Overpaint oben 12 / unten 16 /
seitlich 0 (**Blatthöhe = Zeilen×64+28, Blattbreite = Spalten×64**). Licht oben-links.

**Die Schablone ist der Vertrag.** Zu jedem Blatt liegt eine gleich große Datei unter
`docs/n6-auftrag/lieferung/masken/<stem>.MASKE.png`. Lege sie über dein Bild:

- **Magenta** = Pflicht-Materie. Jede Magenta-Zelle muss zu ≥98 % gedeckt sein.
- **Grünes Band** (oberste 10 px einer Zelle) = **Steh-Kante**. Dort beginnt die
  Malerei: die erste opake Zeile liegt im Fenster [Zellkante−8 px, Zellkante+2 px].
  Die gemalte Kante IST die Kollision — das Kind landet genau auf dieser Linie.
- **Transparent** = verbotenes Gebiet. Außerhalb Maske + Overpaint ≤0,5 % Alpha:
  nichts darf begehbar AUSSEHEN, was es nicht ist.

## Die fünf Gesetze, mit den Zahlen, die heute im Code stehen

1. **Kern-Deckung** — innere 80 % jeder Pflicht-Zelle ≥98 % deckend.
2. **Alpha-Ehrlichkeit** — außerhalb Maske+Overpaint+16 px Franse ≤0,5 % sichtbares Alpha.
3. **Lauf-Linie** — erste opake Zeile jeder Steh-Zelle im Fenster [−8 px, +2 px].
4. **Füllung ist keine Malerei** — **keine Zelle unter Wert-SD 2**. (Die frühere
   Fassung nannte SD 6 und eine Luminanz-Grenze; beides ist überholt, im Code steht
   SD 2. Zur Einordnung: die **schwächste je abgenommene Zelle** misst SD 3,72 — die
   Maschinen-Grenze ist tief, der Anspruch ist es nicht.)
5. **Malerei, nicht Rauschen** — Kanten-Dichte im **Median ≤ 80 %**. Die Ostmauer
   misst 36,3 %, das abgenommene Exemplar 20,8 %. **Der Zielbereich ist unten, nicht
   knapp unter der Decke.** (Der Code kennt nur die harte Grenze 80. Dass ein Blatt
   zwischen 76 und 84 % zu einem Menschen geht, ist eine Haus-Regel der Abnahme
   — R254 —, kein Zweig im Skript.)

## Der Wert-Vertrag (unverändert — und du hast ihn bereits erfüllt)

Mittlere Luminanz **30–38 %, Ziel 34** · Sättigung **≥45 %**. Die Order-Vorlage nennt
als Zielmitte rgb 115,88,52 — **das trifft kein einziges abgenommenes Blatt**; die
tatsächlich angenommene Wolke liegt bei **rgb 120–128 · 78–81 · 45–52**, also wärmer
und roter. Halte dich an die Wolke, nicht an die alte Zahl. Gemessen an deiner
Runde 3:

| Blatt | Luminanz | Sättigung | Mittel-rgb |
|---|---|---|---|
| `body_p3_ostmauer_sims` (gewonnen) | 34,0 % | 67,5 % | 128,78,45 |
| `body_p3_westterrasse_rutsche` (abgelehnt) | 34,0 % | 64,2 % | 122,80,49 |
| `body_p3_mittelpfeiler` (gespalten) | 33,4 % | 57,8 % | 120,78,52 |

**Alle drei erfüllen den Vertrag.** Was sich ändern muss, ist nicht der Wert — es ist
die **Zeichnung**. Halte die Werte, wo sie sind.

**Farb-Referenz (ansehen, NICHT collagieren — kein Kacheln, kein Ausschneiden, kein
Weiterverwenden von Pixeln):** die Ostmauer ist der Ton dieses Hofes.
`plate_p3_yardwall` (rgb 179,142,76 · **Luminanz** 57 %) ist die gemalte Rückwand —
dein Raum steht DAVOR und muss sich von ihr absetzen. `l2_p3` (rgb 123,135,108 ·
**Luminanz** 51 %, grünlich) ist das Laubband: von diesem Wert musst du weg.

---

## Posten B1 · Die Westterrasse mit der Kreide-Rutsche

**`body_p3_westterrasse_rutsche`** — c0=0, r0=15, 22×11 Zellen, Blatt **1408×732**,
194 Pflicht-Zellen.
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_westterrasse_rutsche.MASKE.png`

Die abgetreppte **Bücherböschung** im Westen des Hofes: aufgeschichtete Bände, aus
denen der Hof seine Terrassen bildet.

**Das ist das Blatt, das verloren hat — und die Stelle ist gemessen.**
Die **Treppenkante**, also je Spalte die oberste Pflicht-Zelle, ist die Fläche, die
das Kind betritt. Sie misst über 22 Spalten im Median **1,9 %** Kanten-Dichte gegen
**32,1 %** bei der Ostmauer. In Zellen gesprochen (Zehntel-Skala, `0` = so gut wie
keine Kante):

```
Zeile 0 (r15)  1120100000............   <- Spalten 5-9 leer
Zeile 1 (r16)  3433400000000.........   <- Spalten 10-12 leer
Zeile 2 (r17)  32573210000000........
Zeile 3 (r18)  3220564100000000......
Zeile 4 (r19)  4542354323000000000...
Zeile 5 (r20)  6722344763100000000000   <- Spalten 11-21 leer, volle Breite
```

Die Bücher der Böschung sind gut gemalt. **Was fehlt, ist Material auf der Oberkante
jeder Stufe und auf der langen Lauffläche im Osten** — dort liegen heute glatte,
blasse Bretter ohne Zeichnung.

**Die Lauffläche ist keine Fläche. Sie ist ein Bücherpflaster.**
Male sie wie die Ostmauer: **einzelne Bände, unterschiedlich lang, unterschiedlich
gefärbt, mit versetzten Fugen** — von links nach rechts durchgehend, **lückenlos statt
nur stellenweise**. Kein Kachelraster, keine wiederkehrende Periode. Wer über diesen
Boden läuft, muss einzelne Buchrücken unter den Füßen zählen können: sichtbare
Buchschnitte mit Seitenlagen, Deckelkanten, Goldlinien, Abrieb an den Ecken.

Das gilt für die **ganze Länge** — die östlichen Spalten sind heute die schwächsten
und werden am ehesten wieder vergessen.

**Die Diagonale** (die Treppung nach rechts unten) ist die Schulter, an der die
**Kreidestaub-Rutsche** liegt. Der freie Bereich rechts der Treppung ist KEIN Fehler
und wird NICHT gefüllt — dort zeichnet der Motor die Rutsche als eigenes Blatt. Die
Kante der Schulter ist Material (Schnitte, Lagen, Bindung sichtbar), nie ein glatter
Schnitt, und sie trägt eine abgeriebene, kreideweiß abgeschliffene Bahnkante.

Unterseite und Flanken tragen die Geschichte (Punkt 4 und 10), die Lauffläche bleibt
ruhig — **ruhig heißt gleichmäßig belichtet, nicht texturlos.**

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

## Posten B2 · Der Pultsockel in der Hofmitte

**`body_p3_mittelpfeiler`** — c0=22, r0=17, 8×9 Zellen, Blatt **512×604**,
48 Pflicht-Zellen.
Schablone: `docs/n6-auftrag/lieferung/masken/body_p3_mittelpfeiler.MASKE.png`

Der Sockel in der Hofmitte, auf dem das Lesepult steht: ein schlanker Schaft aus zwei
Spalten (Maskenzeilen 1–3), der sich nach unten verbreitert (Zeile 4), einen seitlichen
Absatz ausbildet (Zeile 5, links) und im Hofboden fußt (Zeilen 6–9).

**Der Schaft ist gelobt worden — „die beste Materiallösung der gesamten Prüfung".**

⚠ **Und damit es keinen Widerspruch gibt:** „bleibt, wie er ist" heißt **nicht**
pixelgleich und heißt **nicht** zusammenkopieren. Das Blatt bleibt **EIN Wurf** —
du malst es ganz neu. Was bleibt, ist die **Machart**: dieselbe Form, dieselbe
Palette, dieselbe Materialsprache am Schaft. Wenn im Zweifel eines von beidem
weichen muss, gewinnt **der eine Wurf**: ein zusammengesetztes Blatt wird
zurückgewiesen, ein neu gemalter Schaft mit derselben Handschrift nicht.

Was durchgefallen ist, ist genau **eine** Stelle:

> **Die kleine Plattform links — Maskenzeile 5, Spalten 1–4 (`####.###`).**
> Befund: „eine reine braune Fläche ohne jede Textur, Kante oder Objekt-Identität".
> Vier Zellen, auf denen ein Kind steht. **Auch diese vier Zellen sind ein Ding:**
> ein vorspringender Bücherabsatz mit sichtbaren Schnitten, eigener Vorderkante und
> gemalter Unterseite. Keine Spielfläche dieses Kapitels ist zu klein für eine
> Objekt-Identität.

**Punkt 2 der Checkliste bleibt bindend:** was steht, verjüngt sich nach oben — der
Schaft trägt sichtbar. Der Absatz links ist ein **gewachsener** Auflagerkragen, kein
angesetzter Klotz; die Lücke zwischen Absatz und Schaft (Zeile 5, Spalte 5) bleibt
frei und ist Teil der Silhouette.

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

---

## Lieferung

1. Alle PNGs nach `docs/n6-auftrag/lieferung/` (Dateiname = Stem + `.png`) —
   **drei Blätter**: `l2_p2.png`, `body_p3_westterrasse_rutsche.png`,
   `body_p3_mittelpfeiler.png`.
2. `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7A2B.md`: in Zeile 1 die Stand-Zeile
   dieser Order; dann je Blatt md5 + Blattmaß + **gemessene mittlere Luminanz und
   Sättigung** (für `l2_p2` zusätzlich den Naht-Sprung an der x-Kante) + ehrliche
   Antworten auf die 13 Checklisten-Punkte + **was du nicht prüfen konntest**.
3. Kein Commit, kein Code, keine Datei außerhalb von `docs/n6-auftrag/lieferung/`.
4. Kein lokales Flicken — jedes Blatt ist EIN Wurf.
5. **Prüfe jedes Blatt selbst in zwei Größen**, bevor du lieferst: in Normalgröße UND
   auf ein Viertel verkleinert. Das Spiel zeigt eine 64-px-Zelle als 16 px. Was bei
   16 px zu einer gleichmäßigen Masse verschwimmt, ist im Spiel keine Malerei — egal,
   wie es aus der Nähe aussieht.
