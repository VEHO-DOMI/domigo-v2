# CODEX DRAFT — NOT CANON

# R6-RUNDE-0 · HANDWERKS-KANON
## Terrain aus einem Guss — unabhängiger Codex-Kanon

**Status: DOCUMENT (Entwurf, nicht Kanon).**
**Arbeitsrolle:** Kunst-Implementierer im Duo-Modell; unabhängig vom parallelen Architekten-Kanon.
**Datum:** 2026-09-01.
**Scope:** Terrain-Handwerk vor der Ein-Block-Welt; kein Code, kein Commit.

## 1. Worum es hier geht

„Aus einem Guss“ bedeutet hier: Eine Terrain-Einheit hat eine zusammenhängende
Silhouette, eine glaubhafte Trag- und Materiallogik, eine lesbare Vorderkante,
eine gemalte Unterseite, kontrollierte Innen-Modulation und einen klaren Platz
in der Tiefenstaffelung. Sie wirkt als ein gemaltes Ding — nicht als Reihe
zusammengesteckter Rechtecke.

Die Übertragung folgt zwei getrennten Fragen:

1. **Material:** Woraus ist dieses Ding in unserer Buch-Welt gemacht?
2. **Affordanz:** Was verrät dieses Material darüber, was man damit tun kann?

„Affordanz“ bedeutet hier schlicht: die sichtbare Einladung oder Warnung eines
Objekts — etwa „darauf stehen“, „daran hängen“ oder „nicht berühren“.

## 2. Quellen- und Sichtgrundlage

Gelesen wurden:

- docs/study/rayman/level-anatomy.md
- docs/study/rayman/visual-language-v2.md
- docs/study/rayman/rayman-grammar.md
- docs/study/rayman-ref-set/README.md
- docs/Rayman X DomiGo Screenshots/July 22nd Rayman Game /README.md
- die Dossiers 01-first-level/00_DESIGN.md, 03-swamp-level/00_DESIGN.md,
  08-picture-city/00_DESIGN.md und 13-getting-every-cage/00_DESIGN.md im
  Schwester-Checkout /Users/veho/Code/domigo-v2/.

Zwölf Terrain-Frames wurden tatsächlich geöffnet und unten einzeln befragt.
Die Referenztexte nennen 138 kuratierte Frames; der geprüfte Referenzsatz
enthält sieben auf 960 × 713 zugeschnittene Bilder. Der Referenzsatz ist ein
Prüfmittel, kein Zeichen- oder Kopiervorrat.

## 3. Prüfbare Kriterien

### K1 · Das Thema ist die Geologie

**Regel:** Jede Terrain-Familie muss aus dem Unterrichts- bzw. Kapitelmaterial
entstehen. Generischer Wald-, Erd-, Eis- oder Steinboden ist kein Ersatz für
ein Thema.

**Woran erkennbar:** Man kann jedes tragende Objekt mit einem konkreten
Themennomen benennen und seine Form daraus erklären. Entfernt man Farbe und
Dekor gedanklich, bleibt die Material-Identität durch Form, Dicke und
Verbindung erhalten.

**Rayman-Beleg (Datei):**

- docs/study/rayman/visual-language-v2.md, §1.2b und §1.3
- docs/study/rayman/level-anatomy.md, Picture-City-Abschnitt
- 08-picture-city/01_establishing-ink-blocks.png

**Übersetzung in unsere Buch-Welt:** Bücher, Karton, Papierblätter,
Buchdeckel, Lineale und Tinte sind die Geologie. Die cremefarbene Buchseite mit
Papierkorn und Linien bleibt der gemeinsame Hintergrund; sie darf nicht als
„Erde mit Gras“ verkleidet werden. Gouache macht Material sichtbar: matte
Papierflächen, pigmentierte Kanten, Wasserläufe der Farbe und trockene
Pinselspuren.

### K2 · Jede freistehende Form besitzt eine eigene Silhouette

**Regel:** Ein freistehender, hängender oder überhängender Terrain-Körper wird
als ein geschlossenes, eigenständiges Bild gedacht. Seine Kontur endet nicht
zufällig an einer Bildschirmkante und besteht nicht aus lose zusammengesetzten
Kappen, Pfosten und Rechtecken.

**Woran erkennbar:** Bei kleiner Darstellung ist sofort sichtbar, wo die Form
beginnt und endet. Jede Spitze, Rundung oder Aussparung gehört zur Kontur und
hat eine Ursache im Material oder in einer sichtbaren Verbindung.

**Rayman-Beleg (Datei):**

- 01-first-level/03_forest-parallax-floating-island.png
- 01-first-level/07_flower-as-platform-swamp.png
- 13-getting-every-cage/01_electoon-cages-on-islands.png
- docs/study/rayman/level-anatomy.md, „Thick-crust terrain“ und §D.2

**Übersetzung in unsere Buch-Welt:** Ein schwebender Buchstapel bekommt einen
gemeinsamen Umriss aus Deckel, Seitenblock, Rücken und sichtbarer Schattenkante.
Ein Papiersteg ist ein gefaltetes oder überlappendes Blatt mit eigener Kante,
nicht ein violettes Rechteck mit nachträglich angesetztem Pfosten.

### K3 · Die begehbare Oberkante ist ruhig, hell und durchgehend

**Regel:** Die Laufkante ist die stärkste Leselinie der Terrain-Einheit. Ihr
Kantenlicht folgt der echten Kontur und bleibt über die ganze tragende Form
kontinuierlich. Dekor darf die Standfläche nicht zerhacken.

**Woran erkennbar:** Eine Person kann die begehbare Linie im Standbild und in
der verkleinerten Ansicht ohne Erklärung verfolgen. Der helle Rand bricht nur
an einer echten Formänderung, nicht an einer Asset- oder Segmentgrenze.

**Rayman-Beleg (Datei):**

- 01-first-level/03_forest-parallax-floating-island.png
- 03-swamp-level/08_lagoon-water-crossing.png
- 03-swamp-level/06_red-spike-star-hazards.png
- docs/study/rayman/visual-language-v2.md, §1.2

**Übersetzung in unsere Buch-Welt:** Die tragende Buchkante erhält einen
hellen, leicht unregelmäßigen Gouache-Lichtsaum. Bei einem Buch ist das der
Deckelüberstand oder die Papierkante; bei einem Blatt der gefaltete Rand. Der
Saum darf nicht als wiederholte Leiste auf jedem Teilstück erscheinen.

### K4 · Die Unterseite beweist Gewicht und Richtung

**Regel:** Jede schwebende oder erhöhte Standfläche braucht eine gemalte
Unterseite beziehungsweise Flanke. Sie zeigt, warum die Form trägt, hängt oder
endet. „Dünn“ ist nur dann richtig, wenn Dünnsein zum Papiermaterial gehört und
die Kante trotzdem sichtbar bleibt.

**Woran erkennbar:** Unter der Laufkante ist eine dunklere, räumliche oder
materialtypische Zone vorhanden. Bei Inseln und Massen ist ein Körper sichtbar;
bei dünnem Papier ist mindestens Faltung, Überlappung, Schatten oder Klammerung
sichtbar. Nichts schwebt als randloser Aufkleber.

**Rayman-Beleg (Datei):**

- 01-first-level/03_forest-parallax-floating-island.png
- 03-swamp-level/02_flower-platform-rising-water.png
- 13-getting-every-cage/01_electoon-cages-on-islands.png
- 08-picture-city/02_thin-ink-platforms-spikes.png
- docs/study/rayman/level-anatomy.md, Korrektur „Platforms are not thin shelves“

**Übersetzung in unsere Buch-Welt:** Unter einem Buchdeckel liegen sichtbare
Seitenlagen, Falze und ein weicher Schlagschatten. Unter einem Stapel darf ein
anderes Buch oder eine Kartonstütze tragen. Ein einzelnes Papierblatt zeigt
eine eingerollte Ecke, eine Falzlinie, Klebeband, Büroklammer oder einen
Schattenwurf — nicht Erdreich.

### K5 · Innen-Modulation bleibt in einer Materialentscheidung

**Regel:** Textur, Gouache, Papierkorn, Verschleiß und Farbtiefe werden innerhalb
eines verbundenen Körpers gemalt. Ein Materialwechsel folgt einer echten Form,
einem Lichtverlauf oder einem sichtbaren Gebrauchsspuren-Ereignis — niemals
einer zufälligen Zeilen-, Kachel- oder Spaltenbreite.

**Woran erkennbar:** Eine gedachte Linie durch den Körper trifft keine harte
Textur- oder Farbnaht mitten in der Masse. Muster und Pinselspur fließen über
angrenzende Segmente hinweg oder enden an einer echten Kante. Die Variation ist
unregelmäßig, aber nicht beliebig.

**Rayman-Beleg (Datei):**

- 08-picture-city/01_establishing-ink-blocks.png
- 08-picture-city/07_green-glass-tubes-silver-bombs.png
- 08-picture-city/04_sharpened-pencils-wave.png
- docs/study/rayman/visual-language-v2.md, §1.3 „State flips over new assets“
- docs/study/rayman/level-anatomy.md, Korrektur der Kachelwechsel

**Übersetzung in unsere Buch-Welt:** Ein verbundener Buchkörper bekommt einen
gemeinsamen Gouache-Wash und eine gemeinsame Pinselrichtung. Seitenlinien dürfen
über einen Seitenblock laufen; sie wechseln nicht plötzlich an jeder
Implementierungszelle. Flecken, Radierstellen, rote Korrekturen und
Bleistiftspuren sind lokale Ereignisse mit weichen Übergängen, keine
rechteckigen Overlay-Flächen.

### K6 · Jede Verbindung zeigt eine Trage- oder Übergangslogik

**Regel:** Wenn zwei Terrain-Formen zusammentreffen, muss das Bild zeigen, wie
eine die andere trägt, durchdringt, umschließt oder auf ihr aufliegt. Ein Ende
stößt nicht kommentarlos in einen anderen Körper.

**Woran erkennbar:** Im Standbild sind Überlagerungsreihenfolge, Schatten und
Kontaktfläche nachvollziehbar. Die Frage „Was trägt was?“ hat eine visuelle
Antwort; bei einem Übergang von Material A zu B ist die Naht ein Falz, eine
Klammer, ein Einband, ein Klebesaum oder eine andere lesbare Materialhandlung.

**Rayman-Beleg (Datei):**

- 01-first-level/03_forest-parallax-floating-island.png
- 03-swamp-level/02_flower-platform-rising-water.png
- 08-picture-city/07_green-glass-tubes-silver-bombs.png
- docs/study/rayman/visual-language-v2.md, §1.7 „Interlock set-piece staging“

**Übersetzung in unsere Buch-Welt:** Ein Lineal liegt auf zwei Buchdeckeln und
zeigt an beiden Enden Auflager. Ein hängendes Blatt kommt aus einer sichtbaren
Buchfalz oder Klammer. Ein Papiersteg steckt in einem Rücken, ist gefaltet oder
mit Klebeband repariert. Kontaktflächen bekommen Gouache-Schatten und keine
zusätzliche technische Kappe, wenn die Malerei die Verbindung leisten kann.

### K7 · Materialeigenschaft und Spielrolle stimmen überein

**Regel:** Die sichtbare Eigenschaft eines Objekts erklärt seine Rolle. Ein
Objekt darf Zustände wechseln, aber der Wechsel braucht eine sichtbare
Material- oder Formmarkierung und nicht nur eine beliebige Farbänderung.

**Woran erkennbar:** Aus dem Bild allein lässt sich begründen, ob etwas fest,
gleitend, federnd, beweglich, tragend oder gefährlich ist. Derselbe Grundkörper
bleibt erkennbar, wenn nur sein Zustand wechselt.

**Rayman-Beleg (Datei):**

- 08-picture-city/01_establishing-ink-blocks.png
- 08-picture-city/02_thin-ink-platforms-spikes.png
- 08-picture-city/03_eye-stalk-enemies-starry-blocks.png
- docs/study/rayman/visual-language-v2.md, §1.3 und §1.5
- docs/study/rayman/rayman-grammar.md, §3

**Übersetzung in unsere Buch-Welt:** Ein dicker Buchblock ist stabil; ein
glattes, tintenbeschmiertes Blatt ist rutschig; ein gespitzter Bleistift oder
Füller ist eine Spitze; ein Lineal ist ein gerader Balken; eine glänzende
Tintenpfütze ist gefährlich. Das Grundobjekt bleibt sichtbar, während
Gouache-Finish, Glanz, Spitze oder Markierung den Zustand erklärt.

### K8 · Die Tiefenpalette trennt Ebenen, ohne den Hintergrund tot zu machen

**Regel:** Tiefe entsteht durch mehrere Farbebenen, Helligkeitsabstufung,
Farbtemperatur und weichere Kanten. Der Hintergrund darf farbig bleiben; nur
die tiefste Ebene darf zur fast-silhouettenhaften Form werden.

**Woran erkennbar:** Die begehbare Ebene hat die klarsten Kanten und den
stärksten lokalen Kontrast. Dahinter bleiben Formen erkennbar, sind aber
heller, kühler, weicher oder durch einen farbigen Schleier getrennt. Kein
Hintergrund konkurriert mit der Laufkante.

**Rayman-Beleg (Datei):**

- 01-first-level/03_forest-parallax-floating-island.png
- 03-swamp-level/08_lagoon-water-crossing.png
- 03-swamp-level/06_red-spike-star-hazards.png
- docs/study/rayman/visual-language-v2.md, §1.1
- docs/study/rayman/level-anatomy.md, Korrektur „colorful hue-shift backgrounds“

**Übersetzung in unsere Buch-Welt:** Die Papierseite liefert das helle
Grundregister. Im Vordergrund liegen dunkle Randnotizen oder angeschnittene
Seiten; die Spielebene erhält satte Gouache, tintenblaue Konturen und klare
Schatten; dahinter liegen weichere Waschungen in Blau, Violett und Rosé. Die
Buch-Welt darf atmosphärisch sein, aber die tragende Papierkante bleibt die
kontraststärkste Information.

### K9 · Der Raum schließt sich materialgerecht

**Regel:** Ein Level braucht eine lesbare Raumbegrenzung. Niedrige Wege werden
durch eine nahe Decke oder hängende Masse geschlossen; hohe oder offene Wege
lösen sich in farbige Tiefe und Haze — also einen weichen atmosphärischen
Farbnebel — auf. Ein schwarzer Rand ist kein Ersatz für Raum.

**Woran erkennbar:** Man versteht, ob über der Figur eine Decke, ein Bildrand,
eine Seite oder offener Raum liegt. Die Begrenzung gehört zur Weltlogik und
ändert sich nicht zufällig von Kachel zu Kachel.

**Rayman-Beleg (Datei):**

- 01-first-level/07_flower-as-platform-swamp.png — niedrige, geschlossene Walddecke
- 03-swamp-level/08_lagoon-water-crossing.png — offene, haze-getragene Tiefe
- 03-swamp-level/02_flower-platform-rising-water.png — seitliche Trunk-Wände
- docs/study/rayman/visual-language-v2.md, §1.1

**Übersetzung in unsere Buch-Welt:** Ein niedriger Abschnitt endet an einer
umgeschlagenen Seite, dem Buchrücken, einem Randornament oder hängenden
Papierfetzen. Ein hoher Abschnitt öffnet sich in eine farbige Gouache-Waschung
der Seite. Ein tintenschwarzer Bereich darf nur dann dunkel sein, wenn er als
Tintenpool eine konkrete Materialgefahr ist.

### K10 · Terrain, Gefahr und Belohnung werden als eine Szene komponiert

**Regel:** Ein gutes Set-Piece verbindet tragenden Körper, Übergang, Gefahr,
Bewegungsrichtung und Ziel in einem Bild. Nichts wirkt wie nachträglich
platziert, nur weil noch Platz frei war.

**Woran erkennbar:** Der Blick findet zuerst die begehbare Route, dann die
Gefahr und schließlich den Zweck der Bewegung. Der Untergrund erklärt die
Aktion: eine Lücke, eine hängende Last, ein enger Durchgang oder ein sichtbares
Ziel hat eine gemeinsame Bildursache.

**Rayman-Beleg (Datei):**

- 03-swamp-level/02_flower-platform-rising-water.png — Plattformen, Wasser und Flucht vertikal gekoppelt
- 08-picture-city/03_eye-stalk-enemies-starry-blocks.png — Block, Gegner und Schusslinie gekoppelt
- 13-getting-every-cage/01_electoon-cages-on-islands.png — Inseln, Käfig, Faust und Befreiung als Tableau
- docs/study/rayman/visual-language-v2.md, §1.7 und §1.8

**Übersetzung in unsere Buch-Welt:** Ein Aufgaben- oder Kapitelziel sitzt an
einer nachvollziehbaren Papierroute. Ein Buchstapel bildet die sichere Basis,
ein Lineal oder Blatt führt darüber, eine Tintensenke erklärt den Umweg, und
ein sichtbares Ziel rechtfertigt die Bewegung. Die Gouache-Komposition muss die
kleine Geschichte der Szene tragen, ohne zusätzliche UI-Schilder zu benötigen.

### K11 · Gefahrenkörper und Gefahrenfläche decken sich

**Regel:** Eine Gefahr darf nur dort treffen, wo ihre gezeichnete Form sie
ankündigt. Anatomie, Spitze, Glanz, Gesicht oder Bewegungsrichtung geben vor,
wann und wo sie gefährlich wird.

**Woran erkennbar:** Keine sichere Fläche wird von einer unsichtbaren oder zu
großen Gefahrenbox überschnitten. Spitze, Tintenrand oder bewegliches Teil ist
vollständig sichtbar; die Richtung des Angriffs ist aus der Form lesbar.

**Rayman-Beleg (Datei):**

- 03-swamp-level/06_red-spike-star-hazards.png
- 08-picture-city/02_thin-ink-platforms-spikes.png
- 08-picture-city/03_eye-stalk-enemies-starry-blocks.png
- docs/Rayman X DomiGo Screenshots/July 22nd Rayman Game /03-swamp-level/00_DESIGN.md, §6, explizite Hitbox-Kritik

**Übersetzung in unsere Buch-Welt:** Eine Feder- oder Bleistiftspitze zeigt
ihre gesamte gefährliche Spitze samt Schatten. Ein Tintensee hat eine eigene
organische, glänzende Silhouette und verletzt nicht außerhalb seines gemalten
Rands. Rote Korrekturzeichen sind nicht automatisch Gefahren; sie werden nur,
wenn Form und Szene das eindeutig sagen.

### K12 · Detail sitzt an Flanke und Unterseite, nicht auf der Laufspur

**Regel:** Die Oberseite bleibt funktional ruhig; Materialgeschichte,
Verzierung, Gebrauchsspuren und narrative Zeichen sitzen bevorzugt an
Vertikalseiten, Unterseiten und sichtbaren Trägern. Vordergrund-Elemente dürfen
Tiefe geben, aber nicht die Standfläche verschlucken.

**Woran erkennbar:** Die Figur und die Gefahr heben sich gegen eine einfache
Oberkante ab. Beim Heranzoomen entdeckt man Details; beim Herauszoomen bleibt
die Spielroute unverändert lesbar.

**Rayman-Beleg (Datei):**

- 08-picture-city/01_establishing-ink-blocks.png
- 08-picture-city/04_sharpened-pencils-wave.png
- 08-picture-city/07_green-glass-tubes-silver-bombs.png
- docs/study/rayman/visual-language-v2.md, §1.2 und §2.4

**Übersetzung in unsere Buch-Welt:** Buchrücken, Seitenzahlen, Klammern,
Klebeband, Gouache-Läufe und Bleistiftkritzeleien erscheinen an Seiten und
Unterseiten. Die Papieroberkante erhält nur so viel Korn und Pinselspur, wie
für Material nötig ist. Margin-Notizen liegen im Hintergrund oder unterhalb
der Route, nicht als unlesbare Wand auf der Fußfläche.

### K13 · Der Materialbestand bleibt über den Raum hinweg kohärent

**Regel:** Fortschritt darf Licht, Farbtemperatur, Wetter und Abnutzung ändern,
aber nicht ohne Grund die gesamte Terrain-Grammatik austauschen. Ein Kapitel
entwickelt seine vorhandenen Objekte, statt jede Schwierigkeit mit einem neuen
Objekt zu erklären.

**Woran erkennbar:** Zwei Szenen desselben Abschnitts teilen Grundformen,
Kantenlogik und Materialfamilien. Die spätere Szene ist dunkler, gespannter,
beschädigter oder dichter — aber sie bleibt als derselbe Ort erkennbar.

**Rayman-Beleg (Datei):**

- 03-swamp-level/08_lagoon-water-crossing.png und
  03-swamp-level/06_red-spike-star-hazards.png
- docs/study/rayman/level-anatomy.md, „weather/palette is the progress dial“
- docs/study/rayman/visual-language-v2.md, §1.1 und §2.1–§2.6

**Übersetzung in unsere Buch-Welt:** Bücher und Papier bleiben dieselben
Grundkörper. Der Kapitelverlauf darf von warmem Creme und sonnigem Gouache zu
kühlem Blau/Violett, roter Korrekturspannung oder dunkler Tintenstimmung
wechseln. Die Änderung liegt in Licht und Zustand — nicht darin, dass plötzlich
Wald-, Erd- oder Eisstücke in die Buchseite eingesetzt werden.

### K14 · Vor dem Ein-Block-Malen gibt es eine sichtbare Abnahme

**Regel:** Eine Terrain-Familie gilt erst als handwerklich fertig, wenn sie in
Normalgröße, verkleinerter Gesamtansicht und — soweit relevant — gegen einen
neutralen Hintergrund auf Silhouette, Kante, Unterseite, Innen-Modulation,
Verbindung und Tiefenpalette geprüft wurde.

**Woran erkennbar:** Die Prüfung kann mit konkreten Fragen beantwortet werden:

- Ist die gesamte Form als ein Körper lesbar?
- Wo wird sie getragen?
- Wo endet die begehbare Kante?
- Gibt es eine unbeabsichtigte Textur- oder Farbkachel?
- Ist die Gefahr vollständig dort, wo sie gezeichnet ist?
- Bleibt der Hintergrund farbig, aber untergeordnet?

**Rayman-Beleg (Datei):**

- docs/study/rayman-ref-set/README.md — Referenzen selbst ansehen, Herkunft und Format prüfen
- docs/study/rayman/visual-language-v2.md, §5 „Open gaps“ und §1.2
- docs/Rayman X DomiGo Screenshots/July 22nd Rayman Game /README.md — kuratierte Frames und Dossiers

**Übersetzung in unsere Buch-Welt:** Vor der Ein-Block-Welt wird je Formklasse
mindestens ein Gouache-Exemplar als Prüfstück angesehen: Buchmasse, Papiersteg,
Linealträger, hängendes Blatt, Tintenpool und Übergang. Erst wenn diese
Prüfstücke die K1–K13-Fragen bestehen, werden sie in mehrere Räume übertragen.
Die Übertragung darf keine neue Naht-, Kappen- oder Trägerklasse einschleusen.

## 4. Sichtprotokoll — zwölf geöffnete Terrain-Frames

Die folgende Frage wurde an jedes Bild gestellt: **Warum liest dieses Terrain
als gewachsenes Ganzes?** Die Antworten sind direkte Bildbeobachtungen; die
Dateien wurden am 2026-09-01 aus dem Schwester-Checkout geöffnet.

| Geöffnete Datei | Warum das Terrain als Ganzes liest |
|---|---|
| 01-first-level/03_forest-parallax-floating-island.png | Die Insel hat eine helle, ununterbrochene Mooskante, einen dunklen nach unten zulaufenden Körper und sichtbare Pflanzen-/Wurzelansätze. Branch, Insel und Wasser liegen in klar getrennten Tiefenebenen; die Tragfläche ist nicht vom Körper abgelöst. |
| 01-first-level/07_flower-as-platform-swamp.png | Die Blütenplattform hängt sichtbar an einem organischen Stiel mit Blatt-/Perlenrhythmus. Die große rechte Landmasse trägt ihre eigene helle Kante und tiefe Felsunterseite; Wasser, Vordergrund und Trunk-Wand erklären den Raum. |
| 03-swamp-level/02_flower-platform-rising-water.png | Jede Blume ist über Stiel und Knospen an die Szene gebunden; die steigende Wasserlinie bildet eine durchgehende untere Druckfläche. Trunk-Wände, Blüten und Plattformen teilen dieselbe Nachtpalette, aber unterschiedliche Kontraste. |
| 03-swamp-level/08_lagoon-water-crossing.png | Die offene Lagune bleibt durch Wasserband, Haze und wiederkehrende Pflanzenformen ein zusammenhängender Raum. Die schwimmende Blume hat ihre eigene Körperform, während Hintergrundberge und Gewächse weich und farbig zurücktreten. |
| 03-swamp-level/06_red-spike-star-hazards.png | Die schräge Moos-/Felsmasse besitzt eine kontinuierliche beleuchtete Laufkante und eine gegliederte, schwere Unterseite. Die violetten Ranken tragen die Gefahren sichtbar; Spitze, Ranke und Träger bilden ein einziges Deckenmotiv. |
| 08-picture-city/01_establishing-ink-blocks.png | Die Eraser-Blöcke sind als gemeinsame zweifarbige Körper mit Rundungen, Seiten und Beschlägen gemalt. Tinte sitzt als sichtbarer Zustand auf dem Block; die Holzmaserung bleibt Hintergrund und wird nicht zur Standkante. |
| 08-picture-city/02_thin-ink-platforms-spikes.png | Hier ist Dünnheit absichtlich das Papier-/Stationery-Thema: die Plattformen haben trotzdem eine klare Rundkante und sichtbare Tintenbedingung. Die Spikes sitzen als eigener, lesbarer Unterbau darunter; Block, Gefahr und Tiefe sind nicht vermischt. |
| 08-picture-city/12_crescent-moon-platforms.png | Die sichelförmigen Formen lesen als gezeichnete Schablonen, nicht als zufällige Plattform-Rechtecke. Goldene Innenmodulation, Rundung, umgebende Blockmasse und senkrechte Stifte halten die Bildwelt zusammen. |
| 08-picture-city/03_eye-stalk-enemies-starry-blocks.png | Starry-Bounce-Block, Augen-Türme und die kleine Flugfigur teilen eine eindeutige Material-/Aktionsgrammatik. Der Block bleibt als tragender Körper ruhig; Sterne und Augen erklären seine Funktion, ohne die Laufspur zu verwischen. |
| 08-picture-city/04_sharpened-pencils-wave.png | Die Bleistifte bilden eine zusammenhängende, anatomisch wiederholte Welle: Holz, Metallfassung und Spitze bleiben an jedem Exemplar erkennbar. Die farbige Wand steht über einer klaren, langen Blockkante; Sammelobjekte markieren die sichere Bewegungsbahn. |
| 08-picture-city/07_green-glass-tubes-silver-bombs.png | Rampen, goldene Rohrmanschetten, bombenartige Kugeln und der gemaserte Holzgrund sind räumlich verschachtelt. Die Kontakte und Höhenstaffelungen zeigen, was aufliegt und was bedroht; kein Objekt schwebt ohne thematische Einbindung. |
| 13-getting-every-cage/01_electoon-cages-on-islands.png | Drei Inseln teilen dieselbe helle Kante und die nach unten zulaufende Unterseite. Käfig, Faust und befreite Figuren sind auf diese Inselkette komponiert: Das Terrain ist zugleich Träger, Route und erzählerisches Tableau. |

## 5. Ehrliche Öffnungsbilanz

**Erfolgreich geöffnet:** alle zwölf im Sichtprotokoll genannten Frames. Es gab
bei diesen Dateien keinen Öffnungsfehler.

**Nicht geöffnet wurden — nicht „nicht öffenbar“ — die übrigen Dateien in den
vier geprüften Dossiers, weil der Auftrag mindestens zehn Terrain-Frames und
keine vollständige Einzelansicht aller 40 Frames verlangte:**

- 01-first-level/: 00_title-dream-forest.png, 01_hud-lives-orbs-hp-pips.png,
  02_magician-secret-level-orange.png, 04_cave-red-spike-plants.png,
  05_red-P-powerup-hud.png, 06_tentacle-flower-enemy.png,
  08_carnivorous-plant.png, 09_secret-level-timed-bonus.png
- 03-swamp-level/: 00_title-swamps-of-forgetfulness.png,
  01_tarzan-magic-seed.png, 03_giant-lip-plant-crumpled.png,
  04_lip-plant-beast-active.png, 05_mushroom-hat-enemies.png,
  07_secret-timed-bonus.png, 09_purple-flytrap-plant.png,
  10_mosquito-boss2-fight.png, 11_ring-swing-power-grant.png
- 08-picture-city/: 00_title-picture-city-eraser-plains.png,
  05_yin-yang-bouncy-balls.png, 06_thumbtack-icicle-hazards.png,
  08_pirate-ship-boss-leadin.png, 09_viking-enemy.png,
  10_paintbrush-enemies.png, 11_no-written-in-gems.png
- 13-getting-every-cage/: 00_cage-hunt-dream-forest.png,
  02_cage-hunt-blue-mountains.png, 03_cage-hunt-band-land.png,
  04_enter-password-screen.png

Damit ist kein ausgewähltes oder gefordertes Bild wegen fehlendem Zugriff
ausgefallen; die Liste trennt bewusst „nicht angesehen“ von „nicht öffenbar“.

## 6. Arbeitsentscheidung für die Konvergenz

Der stärkste gemeinsame Nenner der Quellen ist nicht „mehr Textur“, sondern
**eine Materialentscheidung pro zusammenhängender Form**. Für die Buch-Welt
heißt das: zuerst ein vollständiges Gouache-Prüfstück mit Silhouette, Kante,
Unterseite, Naht und Träger malen; erst danach Varianten für unterschiedliche
Höhen, Seitenränder und Kapitelzustände ableiten. K1–K14 sind die Abnahmefragen
für diese Konvergenz.

## 7. How I verified

**Verifiziert:** alle oben genannten Textdateien wurden vom Dateisystem gelesen;
zwölf konkrete Bilddateien wurden mit visueller Ansicht geöffnet; Dateinamen und
Nicht-öffnungsbilanz wurden maschinell gegen die vier Dossierordner abgeglichen.

**Nicht verifiziert:** die nicht geöffneten Bilddateien, die laufende
Implementierung und die spätere Ein-Block-Ausgabe — diese gehören zur nächsten
Arbeitsphase. Es wurde kein Code geändert und kein Commit erstellt.

