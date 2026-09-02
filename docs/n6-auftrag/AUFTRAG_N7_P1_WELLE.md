# N7A1 · P1-WELLE — die Eingangshalle wird VOLLSTÄNDIG gemalt

**Stand: 2026-09-02 · N7A1 · Runde 1** — diese Zeile zitierst du in Zeile 1 deiner
Selbstauskunft. Kommt eine Order-Änderung, ändert sich diese Zeile; was du nicht
zitieren kannst, hast du nicht gelesen.

**Maßstab ist die MACHART des abgenommenen Exemplars**
(`apps/web/public/art/g1/paint/ch01/body_p2_regal_turm_boden.png` — Kokis Urteil:
„much better!"). **Nicht seine Farbe:** das Exemplar ist das Nacht-Klassenzimmer
(kühl blauviolett, Mittelwert 25 % Luminanz). Die Eingangshalle ist der WARME Raum
— Leder, Ocker, gebranntes Buchleinen: die angenommenen Halle-Blätter
`mass_body_p1_a–d` (Mittel rgb 168,112,45 · Wert 47 %), `crust_p1_a/b`
(rgb 143,96,51 · 41 %) und `band_p1_hallway` (das dunkle Sockelband, 18 %) sind
deine FARB-Referenz. Sieh sie dir an. **Collagiere sie nicht** — kein Kacheln, kein
Ausschneiden, kein Weiterverwenden von Pixeln: sie sagen dir nur, welche Farbe
dieser Raum hat.

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

Dazu: Laufband ≥30 % Luminanz, keine Zelle unter Wert-SD 6 (keine toten Flächen),
keine Kachel-Wiederholung, kein sichtbarer Rapport.

## Posten A · Der Hallenboden — das Held-Stück (EIN Guss)

**`body_p1_hallenboden`** — c0=0, r0=18, 44×8 Zellen, Blatt **2816×540**, 336 Pflicht-Zellen.
Schablone: `docs/n6-auftrag/lieferung/masken/body_p1_hallenboden.MASKE.png`

Der durchgehende Bücher-Hallenboden der Eingangshalle: **ein einziges Gemälde** für
die Lauffläche, ihre Flanken, die Unterseite und das Schachtmaul. Kokis Entscheid
vom 01.09.: „ein Guss" — kein Zusammensetzen aus Streifen, kein Flicken.

Was die Maske erzählt, von links nach rechts: die Halle läuft auf voller Höhe
(Zeile 1 der Maske = Grid-Reihe 18) bis Spalte 40. Dort **bricht die Oberkante ab** —
vier Spalten Luft, dann setzt der Boden vier Reihen tiefer wieder an (Maskenzeile 5).
Das ist das **Schachtmaul**: die Kante, an der der Boden über den Tinten-Schacht
ausläuft. Diese Abbruchkante ist die wichtigste Stelle des Blattes — sie muss als
MATERIAL enden (aufgerissene Lagen, Buchschnitte, Bindung sichtbar), nie als glatter
Schnitt. Rechts unten läuft der Boden dann wieder bis an den Schacht heran.

Innen: Bücherlagen im Verband, große weiche Wertflächen, Ereignisse (Flecken,
Abrieb) lokal — nie als Muster. Unterseite und Flanken tragen die Geschichte
(Punkt 4 und 10), die Lauffläche bleibt ruhig.

```
########################################....
########################################....
########################################....
########################################....
############################################
############################################
############################################
############################################
```

## Posten B · Das Ostpodest — die erhöhte Lesestufe vor dem Ausgang

**`body_p1_ostpodest`** — c0=46, r0=16, 18×10 Zellen, Blatt **1152×668**, 148 Pflicht-Zellen.
Schablone: `docs/n6-auftrag/lieferung/masken/body_p1_ostpodest.MASKE.png`

Die Stufe, auf der die Halle endet und die Tür steht. **Neu an diesem Blatt:** oben
in der Maske sitzt ein **2×2-Aufsatz** (Maskenzeilen 1–2, Spalten 6–7) — das
Atlas-Podest, das bisher ein eigenes Blatt war (`terrain_atlas_podest_p1`) und mit
einem 24,9°-V-Sockel gegen Punkt 13 verstieß. Es wird jetzt Teil dieses Körpers:
male es als **gewachsenen** Aufsatz auf der Stufe — ein aufgeschlagener Atlas auf
einem Lesepult, das aus derselben Materie wächst wie die Stufe darunter (Punkt 6:
Verbindungen wachsen als gemalter Kragen, nie gestoßen), mit **gerader waagrechter
Aufstandskante**.

Links endet das Podest über dem Tinten-Schacht — dieselbe Regel wie beim Boden:
die Kante endet als Material. Rechts stößt es an die Weltkante.

```
.....##...........
.....##...........
##################
##################
##################
##################
##################
##################
##################
##################
```

## Posten C · Die Decken-Familie (DREI Blätter, EIN Wurf — eine Vokabel)

Die Decke der Eingangshalle ist im Raster **eine** durchgehende Reihe über die volle
Breite. Sie kommt nur deshalb als drei Blätter, weil ein Blatt sonst 4096 px breit
wäre (Grenze 3072). **Male sie als EIN Bild in drei Abschnitten:** dieselbe
Buchrücken-Vokabel, derselbe Lichtverlauf, an den Blattgrenzen keine Zäsur — Blatt 1
endet mit Spalte 22, Blatt 2 setzt bei Spalte 23 an, ohne dass man die Naht sieht.

Motiv: die Halle ist ein Buch von innen — die Decke ist die Reihe der **Buchrücken**
über dem Leser, im Verband, mit Bünden und Kapitalbändern. Unterseite (das, was das
Kind sieht) trägt das Detail; die Steh-Kante oben ist die Weltkante.

**C1 `body_p1_deckenbahn_west`** — c0=0, r0=0, 22×1 Zellen, Blatt **1408×92** · Decke über der Westhalle
Schablone: `docs/n6-auftrag/lieferung/masken/body_p1_deckenbahn_west.MASKE.png`

```
######################
```

**C2 `body_p1_deckenbahn_mitte`** — c0=22, r0=0, 22×1 Zellen, Blatt **1408×92** · Decke über Kanzel und Schacht
Schablone: `docs/n6-auftrag/lieferung/masken/body_p1_deckenbahn_mitte.MASKE.png`

```
######################
```

**C3 `body_p1_deckenbahn_ost`** — c0=44, r0=0, 20×1 Zellen, Blatt **1280×92** · Decke über dem Ostpodest bis zur Tür
Schablone: `docs/n6-auftrag/lieferung/masken/body_p1_deckenbahn_ost.MASKE.png`

```
####################
```

## Lieferung

1. Alle PNGs nach `docs/n6-auftrag/lieferung/` (Dateiname = Stem + `.png`).
2. `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7P1.md`: in Zeile 1 die Stand-Zeile
   dieser Order; dann je Blatt md5 + Blattmaß + ehrliche Antworten auf die 13
   Checklisten-Punkte + **was du nicht prüfen konntest**.
3. Kein Commit, kein Code, keine Datei außerhalb von `docs/n6-auftrag/lieferung/`.
4. Kein lokales Flicken — jedes Blatt ist EIN Wurf.
