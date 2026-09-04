# N7A2c · DIE KREIDE-RUTSCHE WIRD GEMALT — die Westterrasse, ein Wurf

**Stand: 2026-09-03 · N7A2c · Runde 2 (Fix-Runde, EIN Posten)** — diese Zeile zitierst du in Zeile 1 deiner
Selbstauskunft. Kommt eine Order-Änderung, ändert sich diese Zeile; was du nicht
zitieren kannst, hast du nicht gelesen.

**EIN Blatt:** `body_p3_westterrasse_rutsche` — die abgetreppte Bücherböschung im
Westen des Schulhofs, **mit** ihrer Kreide-Rutsche. Das Blattmaß ist unverändert
**1408 × 732**; neu ist, dass **fünf Zellen der Maske jetzt Schrägen sind**.

---

## ★ Das Medium: gemalt, nicht gezeichnet (gilt wörtlich weiter)

Ein früherer Anlauf hat Körper-Blätter **mit Python/PIL gezeichnet** —
`ImageDraw.rectangle`, `ImageDraw.line`, acht fest verdrahtete Farben, Bücher als
Rechtecke in strengen waagrechten Reihen. Ergebnis: **alle fünf Gesetze grün,
`check-ground-plane` grün** — und ein Bild wie das Schaubild eines Bücherregals, mit
genau der sichtbaren Wiederholungs-Periode, die in den Anti-Kriterien als
Sofort-Durchfaller steht. Das Blatt war 37 kB statt 1,3 MB; flache Füllungen
komprimieren sich eben gut.

Das ist die vierte Sprosse einer Ausweich-Leiter (Füllung → Rauschen → Wasch-Ton →
Vektor-Diagramm), und sie ist die gefährlichste: sie maximiert genau die Größen, die
die Tore messen, und zerstört dabei die Sache. Deshalb steht das Medium in der Order:

- **Das Blatt entsteht mit dem Bildmodell** (`image_gen` / die `imagegen`-Kette mit
  Chroma-Key und anschließendem lokalen Freistellen). Danach wird die Schablone als
  Alphakanal aufgelegt, damit die Silhouette pixelgenau sitzt.
- **Nicht erlaubt:** ein Blatt, das von Code gezeichnet wird — PIL/`ImageDraw`, SVG,
  Kachel-Generatoren, prozedurale Muster. Auch nicht teilweise, auch nicht
  „nur der Boden", auch nicht „nur die fünf Rampen".
- Bildbearbeitung **am gemalten Bild** (freistellen, maskieren, Wert korrigieren, Saum
  säubern, verlustfrei nachverdichten) ist selbstverständlich erlaubt.
- **Ein prozedural gezeichnetes Blatt wird zurückgewiesen, auch wenn es jedes Tor
  besteht.** Die Tore sind die Untergrenze, nicht das Ziel. Vergleichsgröße: das
  Blatt, das du ersetzt, wiegt **2 234 kB**.

**Und die Alpha-Regel, an einer Runde bezahlt (D-978):** das erzeugte Bild überdeckt
das Umgebungsrechteck der Maske **vollständig mit Rand**; die Maske schneidet erst
danach. Alpha wird **nie** über gekeyte (freigestellte) Bildpunkte gezwungen — dort
kommt reines Schwarz zum Vorschein (Wert-SD 0,00 bei Luminanz 0,0), und Gesetz 4
fängt genau das.

## Wie gemessen wird (damit deine Zahlen und meine dieselben sind)

- **Luminanz** = `(0,2126·R + 0,7152·G + 0,0722·B) / 255`, in Prozent.
- **Sättigung** = `(max(R,G,B) − min(R,G,B)) / max(R,G,B)`, in Prozent.
- **Beides gemittelt** über die Bildpunkte mit **Alpha ≥ 128**, im **3-Pixel-Schritt**
  in x und y über das ganze Blatt.
- **Kanten-Dichte** (Gesetz 5) = Anteil der Punkte, deren lokaler Sprung
  `hypot(L(x+1,y)−L(x,y), L(x,y+1)−L(x,y))` **> 12** ist, über die **inneren 80 %**
  jeder Mess-Zelle, nur dort wo der Punkt und seine zwei Nachbarn Alpha ≥ 128 haben.
  **Achtung, andere Formel:** hier gilt `L = 0,299·R + 0,587·G + 0,114·B` (0–255,
  nicht normiert) — so rechnet das Tor.

**Prüfe dein Blatt selbst, bevor du lieferst.** Die Werkzeuge laufen bei dir:

```
node --experimental-strip-types scripts/check-body-silhouette.mjs --sheet docs/n6-auftrag/lieferung/body_p3_westterrasse_rutsche.png --body p3_westterrasse_rutsche
node --experimental-strip-types scripts/check-ground-plane.mjs   --sheet docs/n6-auftrag/lieferung/body_p3_westterrasse_rutsche.png
node docs/n6-auftrag/lieferung/mess-koerper.cjs docs/n6-auftrag/lieferung/body_p3_westterrasse_rutsche.png p3_westterrasse_rutsche
```

---

## ★ DAS NEUE AN DIESER ORDER: FÜNF GEMALTE SCHRÄGEN

Bis gestern hörte dieses Blatt an der Außenkante jeder Bücherstufe auf, und **ein
generischer Vierteile-Bausatz** (`slide_top/mid/foot/under`) setzte dort fünfmal
dasselbe kleine Eckstück ein. Koki hat den Hof angesehen und genau das gesehen:
„hässliche übrige Lego-Blöcke, wo in Wahrheit eine GEMALTE Schräge stehen müsste".
Der Bausatz geht in Rente. **Du malst die Rutsche.**

**Die Geometrie ist nicht verhandelbar — sie IST die Kollision.** Fünf Zellen der
Maske tragen jetzt das Zeichen `z`:

| Zelle im Gitter | in der Schablone (Blatt-Pixel, x / y) |
|---|---|
| (10,15) | x 640–703 · y 12–75 |
| (13,16) | x 832–895 · y 76–139 |
| (14,17) | x 896–959 · y 140–203 |
| (16,18) | x 1024–1087 · y 204–267 |
| (19,19) | x 1216–1279 · y 268–331 |

In jeder dieser Zellen läuft die Oberfläche **von der oberen linken Ecke zur unteren
rechten Ecke**. Materie ist alles **unter** dieser Diagonale (das untere linke
Dreieck, 2 080 von 4 096 Bildpunkten). **Darüber ist Luft — und Luft heißt hier
verbotenes Gebiet:** malst du dort, meldet Gesetz 2 „Alpha außerhalb Maske" und das
Blatt fällt durch. Das ist kein Formalismus. Das Kind rutscht auf dieser Diagonale
hinunter; jeder Bildpunkt darüber wäre Material, durch das es sichtbar hindurchfährt.

**Die Schablone zeigt es dir.** In `docs/n6-auftrag/lieferung/masken/body_p3_westterrasse_rutsche.MASKE.png`
sind diese fünf Zellen zur Hälfte magenta (Pflicht-Materie) und **zur Hälfte
transparent** — anders als jede andere Zelle des Blattes. Das grüne Band folgt dort
der **Diagonale**, nicht der Zell-Oberkante: dort liegt die Steh-Kante.

**Wie die Rampe aussehen soll.** Nicht als angesetztes Dreieck, sondern als das, was
sie erzählerisch ist: **die abgegriffene, schräg abgenutzte Ecke des Bücherstapels**.
Die Bände der Stufe laufen in die Schräge hinein und werden dort angeschnitten —
Schnitte, Lagen, Bindung bleiben sichtbar. Über die ganze Diagonale zieht sich die
**kreideweiß abgeriebene Bahnkante**: die Spur, die das Rutschen selbst hinterlassen
hat, heller und glatter als das Buchleinen daneben, mit Kreidestaub, der sich am
unteren Ende der Bahn sammelt. Genau dieser Strich war bisher die einzige Aufgabe des
Bausatzes; er macht die Rutsche als Rutsche lesbar und **gehört jetzt ins Bild**.

**Fünf Stufen, fünf verschiedene Rampen.** Keine zwei gleich — andere Buchrücken,
andere Abnutzung, anderer Kreide-Auftrag. Der Grund steht in Kokis Befund: fünf
identische Kopien lesen schlimmer als eine Kachel-Periode, weil jede Instanz denselben
Anfang UND dasselbe Ende zeigt. **Und keine Naht:** die Rampe wächst als gemalter
Kragen aus der Stufe heraus (Kanon-Punkt 6), sie wird nie an sie gestoßen.

---

## ★ WAS DIESE FASSUNG BESSER MACHEN MUSS ALS DIE, DIE SIE ERSETZT

Zwei unabhängige blinde Leser haben dieses Blatt beurteilt, und sie widersprechen
sich — **das ist die eigentliche Aufgabe dieser Bestellung.** Beide Male ging es um
dieselbe Fläche:

- **Erster Leser, gegen die ERSTE Fassung:** die Spielfläche trage „keinerlei
  Materialidentität — reiner brauner Verlauf". Gemessen: die Kanten-Dichte ihrer
  Steh-Zellen (je Spalte die oberste Zelle, also die Fläche, auf der das Kind steht)
  lag bei **1,9 %** im Median. Die Lauffläche war über ihre ganze Länge leer.
- **Zweiter Leser, gegen die HEUTIGE Fassung** (die daraufhin auf 58,1 % gebaut
  wurde): sie lese sich als „durchgehende Wand aus waagerecht geschichteten Büchern",
  an der Standstelle fehle „eine ausgewiesene Trittkante"; die alte habe
  „eigenständige Tritt-Bretter" mit ruhiger, schattierter Oberseite.

Die alte Fassung erfüllte **Kanon-Punkt 3** (Laufkante hell, ruhig, durchgehend) und
verfehlte **Punkt 1/5** (Material-Identität). Die heutige erfüllt 1/5 und verfehlt 3.
**Koki hat entschieden: diese Fassung muss BEIDES tragen.**

Das heißt konkret, und daran wird sie gemessen:

1. **Material-Identität in jeder Fläche** — einzeln gemalte Bände unterschiedlicher
   Länge, Dicke und Farbe, versetzte Fugen wie ein Mauerverband, kein Kachelraster,
   keine erkennbare Wiederholungs-Periode. Vorbild ist die **Ostmauer** desselben
   Hofes (`body_p3_ostmauer_sims.png`, unangetastet): „individuelle Bücher
   unterschiedlicher Länge und Farbe, versetzte Fugen wie ein Mauerverband, keine
   erkennbare Wiederholung" — so hat der erste Leser sie gelobt.
2. **UND je Stufe eine ausgewiesene Trittkante.** Die oberste Lage jeder Stufe ist
   **ein anderes Ding als der Körper darunter**: ein durchgehendes, ruhig
   schattiertes Brett — ein flach liegender, aufgeschlagener Band, ein abgegriffener
   Buchdeckel —, das sich sichtbar vom Verband darunter **absetzt**. Nicht heller
   Kontrast um des Kontrasts willen, sondern eine Material-Handlung: die oberste Lage
   ist glatt gelaufen, ihre Kante ist rund, ihr Schatten liegt darunter.
   **Die Trittfläche selbst bleibt ruhig** — die Geschichte (Flecken, Abrieb, Risse)
   sitzt an den Flanken und der Unterseite, nicht dort, wo das Kind läuft.

⚠ **Eine Warnung, teuer bezahlt:** die heutige Fassung wurde auf ein reines
Dichte-Maß hin gebaut (Steh-Zellen von 1,9 auf 58,1 %) und ist genau daran
gescheitert — mehr Kanten auf der Lauffläche **arbeiten gegen Punkt 3**. Eine höhere
Zahl ist nicht das Ziel. Das Ziel ist, dass man die Stufe als Stufe sieht.

---

## ★ RUNDE 2 · DER EINE POSTEN AUS DER BLINDEN PRÜFUNG

Deine Runde-1-Lieferung hat **alle Tore bestanden** (Silhouette 5/5, Bodenebene
Reichweite 91 % / Kipp 0,0°, Luminanz 33,5 %, Sättigung 66,2 %, Kanten-Median 52,6 %)
und die blinde Prüferin hat sie **auf dem Blatt deutlich gewinnen lassen**: die
Trittstufe liest jetzt als eigenes benennbares Ding, die helle Fase zieht durch,
und unter jeder Bohle liegt der Schattenkeil, der sie als tragendes Objekt ausweist.
Der alte Stand fiel bei ihr am Anti-Kriterium »nackter Schnitt« durch. **Das bleibt.**

**In der SPIELSZENE hat sie die alte Fassung knapp vorgezogen — aus genau einem
Grund**, und der ist zu beheben, ohne das Gewonnene anzufassen. Wörtlich:

> „In A tragen die Stufenkanten mehrere helle, **gleich geformte** Glanz-/Funkenstriche"
> · „die Glanzstriche sitzen als klar abgegrenzte, **wiederkehrende** Einzelereignisse
> an jeder Stufenecke — das liest sich eher als **aufgesetzter Effekt** denn als lokales
> Ereignis am Material" · „wirkt wie **derselbe Dekal-Sticker mehrfach eingesetzt**
> statt einzeln gemalt".

Das ist bitter genau der Befund, für den diese ganze Bahn existiert: Koki hat fünf
**gleiche eingesetzte Teile** eingekreist. Wir haben den Bausatz entfernt und an
seiner Stelle fünf gleiche Glanz-Keile hinterlassen.

**Der Auftrag der Fix-Runde, und NUR dieser:**

1. **Die fünf Kreide-Spuren werden fünf VERSCHIEDENE Spuren.** Verschiedene Länge,
   verschiedene Dichte, verschiedener Verlauf, verschiedene Helligkeit; eine reicht
   fast bis zur Stufenkante, eine ist fast weggewischt, eine hat eine breite und eine
   dünne Zone. Keine zwei dürfen dieselbe Form haben.
2. **Kreidestaub statt Glanz-Funke.** Es ist abgeriebene Kreide auf Buchleinen —
   matt, körnig, in die Oberfläche gearbeitet, an den Rändern ausfransend. Kein
   scharf begrenzter weißer Keil, kein Glanzlicht, kein Funkeln, kein Blitz.
3. **Alles andere bleibt.** Silhouette, Rampengeometrie, Trittstufen mit ihrer hellen
   Fase und ihrem Schattenkeil, Bücherverband, Werte. Der Wert-Vertrag ist erfüllt und
   soll erfüllt bleiben (Luminanz 30–38 %, Sättigung ≥45).

Prüfe wieder mit denselben drei Befehlen und liefere dieselben zwei Dateien
(die Selbstauskunft ergänzt einen Abschnitt »Runde 2«).

---

## Was das Blatt IST

Die abgetreppte **Bücherböschung** im Westen des Hofes: aufgeschichtete Bände, aus
denen der Hof seine Terrassen bildet, mit der Kreide-Rutsche an der Außenkante jeder
Stufe. Sie ist **ein einziges Gemälde** für die Lauffläche, die Treppung, die
Rampen, die Flanken und die Unterseite.

Unten läuft die Böschung in den durchgehenden Hofboden aus (Maskenzeilen 6–11).
Rechts unten enden die letzten zwei Spalten frei — auch dort: Kante als Material,
nie als glatter Schnitt.

**Der Hof ist hell. Sein BODEN ist es nicht.** Das Tageslicht steckt in der gemalten
Wand dahinter (81 % Luminanz). Die Spielebene ist die dunkelste, gesättigtste Schicht
des Bildes. So funktioniert dieses Buch in jedem Raum.

Die Maske (11 Zeilen × 22 Spalten, `#` = solide Pflicht-Zelle, `z` = gemalte Schräge,
`.` = nicht dein Gebiet):

```
##########z...........
#############z........
##############z.......
################z.....
###################z..
######################
####################..
####################..
####################..
####################..
####################..
```

## Der Wert-Vertrag (bindend, unverändert)

- **Mittlere Luminanz: 30–38 %, Ziel 34.** Über 39 % reißt das Lesbarkeits-Gesetz.
- **Sättigung ≥ 45 %.** Der Hof ist warm: sonnengebranntes Buchleinen, Ocker,
  Sandstein-Papier.
- **Zielmitte ≈ rgb 115, 88, 52.** Ein Anker, kein Rezept — der MITTELWERT zählt.

**Dein Blatt steht neben zwei Blättern, die NICHT neu bestellt werden.** Sie sind in
dieser Sitzung gemessen, und die drei müssen als EIN Tageslicht lesen:

| Blatt | Luminanz | Sättigung | Mittel-rgb | Kanten-Median |
|---|---|---|---|---|
| Ostmauer (Vorbild, unangetastet) | 34,0 % | 67,5 % | 128, 78, 45 | 36,3 % |
| Mittelpfeiler (unangetastet) | 34,2 % | 65,7 % | 124, 80, 49 | 60,6 % |
| **Westterrasse (heute, wird ersetzt)** | 34,3 % | 63,7 % | 124, 80, 50 | 60,2 % |

## Der Zell-Vertrag (das Silhouetten-Tor misst maschinell)

RGBA, Alpha-Silhouette, **64 px/Zelle**, Overpaint oben 12 / unten 16 / seitlich 0.
**Blatt 1408 × 732.** Licht oben-links.

**Die Schablone ist der Vertrag.** `docs/n6-auftrag/lieferung/masken/body_p3_westterrasse_rutsche.MASKE.png`,
gleich groß wie dein Blatt:

- **Magenta** = Pflicht-Materie. Jede magentafarbene Fläche muss zu ≥ 98 % gedeckt sein.
- **Grünes Band** (10 px) = **Steh-Kante**. Dort beginnt die Malerei; bei den fünf
  Schrägen folgt es der Diagonale. Die gemalte Kante IST die Kollision.
- **Transparent** = verbotenes Gebiet — auch die obere Hälfte der fünf Schrägen-Zellen.

## Die fünf Gesetze, mit den Zahlen, die im Code stehen

1. **KERN-DECKUNG** — inneres 80 %-Fenster jeder Mess-Zelle ≥ 98 % opak; bei einer
   Schräge gemessen über der Materie-Seite (ab Sollkante + 4 px).
2. **ALPHA-EHRLICHKEIT** — außerhalb Maske + Overpaint + 16-px-Fransengürtel ≤ 0,50 %
   opak. **Die Luft über jeder Rutschbahn gehört zu diesem Außen.**
3. **LAUF-LINIE** — über jeder Steh-Zelle beginnt die Malerei im Fenster
   [Kante − 8 px, Kante + 2 px]; bei einer Schräge im Fenster [Sollkante − 8,
   Sollkante + 4], an drei Säulen gemessen.
4. **KEIN LOCH** — keine Mess-Zelle ohne Struktur (Wert-SD < 2). Deckende Füllung
   erfüllt Gesetz 1 und ist doch keine Malerei.
5. **MALEREI, NICHT RAUSCHEN** — Kanten-Dichte im **Median** je Blatt ≤ 80 %
   (angenommene Blätter: 20–76 %; Rauschen maß 85–91 %).

Dazu **Punkt 13 der Checkliste** (`check-ground-plane --sheet`): EINE orthografische
Bodenebene — gerade, waagrechte Aufstandskanten, keine 3/4-Sockel, Seitenflächen ≤ 3°.
Die fünf Schrägen sind davon ausgenommen: sie SIND die Ausnahme, die das Gitter
vorschreibt.

## Anti-Kriterien (sofortiges Durchfallen)

Plattform-Textur ohne Objekt-Identität · sichtbare Wiederholungs-Periode · nackter
Schnitt · **angesetztes Verbindungsstück** (auch und gerade an den fünf Rampen) ·
Dekor, das Begehbarkeit vortäuscht · **Malerei über der Rutschbahn**.

## Lieferung

1. Das PNG nach `docs/n6-auftrag/lieferung/body_p3_westterrasse_rutsche.png`.
2. `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7A2C.md`: in Zeile 1 die Stand-Zeile
   dieser Order; dann md5 + Blattmaß + Dateigröße + **gemessene** mittlere Luminanz,
   Sättigung, Mittel-rgb, Kanten-Median, Steh-Zellen-Median; die Ausgaben der drei
   Prüfbefehle oben; ehrliche Antworten auf die 13 Checklisten-Punkte
   (`docs/n6-auftrag/CHECKLISTE_R6_KANON.md`) + **was du nicht prüfen konntest**.
3. Kein Commit, kein Code, keine Datei außerhalb von `docs/n6-auftrag/lieferung/`.
4. Kein lokales Flicken — das Blatt ist EIN Wurf.
