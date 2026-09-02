# R6 · RUNDE 3 — SELBSTAUSKUNFT ZUM KALIBRIER-EXEMPLAR

**Status: DOCUMENT (Lieferung, CODEX DRAFT — NOT CANON).**
**Asset:** body_p2_regal_turm_boden.png
**Datum:** 2026-09-01
**Rolle:** Kunst-Implementierer; Runde 3, kompletter Neu-Wurf in einem Durchgang.
**Vorgabe:** kein Code, kein Commit.

## 1. Lieferdaten

- Datei: docs/n6-auftrag/lieferung/body_p2_regal_turm_boden.png
- Maß: 2048 × 1116 px
- Format: PNG, RGBA, Alpha-Silhouette
- MD5 nach Runde-4-Retusche M1+M2: 95357901b54017b58431a99df63f54d1
- Zellraster: 64 px; Zellbox ab y=12; die 185 erlaubten #-Zellen sind vollständig opak
- Alpha außerhalb der erlaubten Silhouette: 0 px mit Alpha > 0
- Selbstauskunft: diese Datei

Die zwei Lieferdateien sind die einzigen Dateien, die in docs/n6-auftrag/lieferung/
angelegt wurden.

## 2. Herstellung

Das Bild wurde zunächst als ein breites handgemaltes Gouache-Konzept erzeugt:
Nacht-Klassenzimmer, Bücher, Papier, Regalbahn und zwei Pult-Tische in einer
gemeinsamen kühlen Blau-/Violett-Palette mit warmem Mondlicht von oben links.
Danach wurde dieselbe Malvorlage in den vier Vertragsbereichen positioniert:
Regalbahn oben rechts, Bücherturm darunter, zwei Pulte in der Mitte und
Bücherboden unten links. Die Alpha-Silhouette wurde exakt aus dem Auftrag
übernommen; außerhalb ist kein Magenta-Key und kein sichtbarer Hintergrund
enthalten.

**Werkzeugweg:** eingebauter Bildgenerator, danach lokale Raster-/Alpha-
Zusammenstellung für Maß, Zellmaske und RGBA. Kein CLI-Fallback und keine
Transparenz-KI wurde verwendet.

**Prompt-Fassung:** hand-painted children's picture-book gouache; one coherent
wide horizontal night-classroom terrain painting; upper-right wall shelf
carried by a bound book tower; two school desks on visible legs; connected
book-floor mass; paper edges, book spines, bindings, folded corners, clips and
worn edges; cool indigo, blue-violet, plum and mauve with warm parchment
highlights; moonlight from upper left; clean walking tops, detailed flanks and
undersides; no characters, enemies, collectibles, HUD, words, logos, watermark,
forest, earth, grass, ice, modular tile seams or isolated caps.

## 3. Antwort auf die zwölf Kanon-Punkte

### 1 · Benennbarkeit / Geologie

**Urteil: bestanden, mit Vorbehalt.**

Die Körper sind als Regalbahn, gebundener Bücherturm, Pult-Tische und
Bücherboden benennbar. Die Form leitet sich aus Papier, Buchdeckel, Seitenblock,
Pultbein und Karton ab; generischer Erd-, Gras- oder Steinboden kommt nicht vor.

**Vorbehalt:** Das PNG ist ein transparentes Terrain-Asset, kein vollständiger
Raum. Die Buch-Welt als Kapitelumgebung muss in der nächsten Ansicht zusätzlich
mit der laufenden Szene geprüft werden.

### 2 · Silhouette

**Urteil: maschinell bestanden; visuell bestanden mit bekannter Kantenhärte.**

Die Alpha-Maske folgt exakt dem 32 × 17-Zell-Vertrag. Jede erlaubte Zelle ist
vollständig opak; außerhalb der Maske ist Alpha null. Der Bücherturm und der
Boden verbinden sich, die Regalbahn hängt rechts, und die Tische bleiben als
eigene Formen mit ihren Beinen lesbar.

**Schwachstelle:** Der Zellvertrag erzeugt an den äußeren Übergängen eine
bewusst grobe 64-px-Stufung. Das ist kein zufälliger Schnitt, aber die spätere
Spielansicht muss zeigen, dass diese Vertragssilhouette nicht wie eine
Kachelkante wirkt.

### 3 · Laufkante

**Urteil: visuell bestanden, nicht als Luminanz-Tor numerisch auditiert.**

Regalbahn, Tischplatten und Bücherboden haben helle, ruhige Oberseiten. Das
Kantenlicht liegt auf der Oberkante und wird nicht durch dekorative Seitenlinien
zerhackt. Die Pultbeine beginnen erst unterhalb der jeweiligen Tischplatte.

**Nicht gemessen:** Ein separater Audit der mittleren Laufband-Luminanz gegen
den geforderten Wert von 29,5 Prozent wurde nicht ausgeführt; geprüft wurden
Maß, Alpha und Sichtbild.

### 4 · Unterseite / Flanke gemalt

**Urteil: bestanden.**

Die Unterseiten zeigen Seitenlagen, Buchrücken, Falze, dunkle Schatten und bei
der Regalbahn eine tragende Papier-/Kartonflanke. Der Bücherboden hat sichtbare
Buchkörper statt einer flachen, schwebenden Platte. Die Tische besitzen
sichtbare, tragende Beine.

**Schwachstelle:** Die beiden ein-Zell-Beine sind wegen des 64-px-Vertrags
blockiger als ein freies Pultbein. Ihre Materialfarbe und die vertikale
Tragfunktion sind sichtbar; die elegante organische Kontur muss in der
nächsten Vollszene beurteilt werden.

### 5 · Innen-Modulation

**Urteil: visuell bestanden, mit Herstellungsgrenze.**

Die verbundenen Bücherkörper tragen weiche Pigmentverläufe, Seitenlinien,
Rücken und Gebrauchsspuren. Die Textur hat keine sichtbare regelmäßige
Kachelperiode. Materialwechsel sitzen an Buchkanten, Falzen, Rücken oder
Verschleißstellen.

**Schwachstelle:** Die Malvorlage wurde lokal in Vertragsbereiche eingepasst;
ich habe keinen unabhängigen Frequenz- oder Nahtdetektor ausgeführt. Die
sichtbare Prüfung findet keine harte Texturnaht mitten in einer erlaubten
Masse, aber die formale Messung ist noch offen.

### 6 · Verbindungslogik

**Urteil: bestanden.**

Die Regalbahn liegt sichtbar auf beziehungsweise über dem Bücherturm. Der Turm
wächst in den Bücherboden. Die Pultbeine reichen vom Tischkörper bis in den
Boden. Schatten und Überlagerung zeigen, was trägt und was aufliegt.

**Schwachstelle:** Der Auftrag verlangt die vier Körper in einer Zellmaske,
nicht die umgebende Szene. Verbindungen zu benachbarten, späteren Spielobjekten
wurden nicht geprüft.

### 7 · Material = Spielrolle

**Urteil: für das Terrain bestanden; Gefahrenzustände nicht im Exemplar enthalten.**

Dicke Bücher und Karton lesen als stabile Masse. Papierkanten und Regalbahn
lesen als gefertigte, tragende Flächen. Die sichtbare Materialsprache erklärt
die Rolle ohne zusätzliche technische Markierung.

**Nicht enthalten:** Tintenpool, Spitze, Rutschzustand oder bewegliches
Gefahrenobjekt. Diese Zustände dürfen erst in späteren Varianten ergänzt
werden, ohne die Grundkörper-Identität zu verlieren.

### 8 · Tiefen-Palette

**Urteil: innerhalb der Malerei bestanden; vollständige Raumtiefe offen.**

Die Laufkörper sind kontrastreicher als die tiefen indigo-/violetten Flächen.
Kühle Pigmente trennen die Buchlagen, warme Papierlichter setzen die tragenden
Kanten. Die Palette bleibt farbig und wird nicht grau oder schwarz multipliziert.

**Nicht vollständig geprüft:** Weil das Asset transparent geliefert wird, fehlt
die mehrbandige Seiten-/Zimmerkulisse. Die Trennung gegen Vordergrund,
Spielebene und Hintergrund gehört zur nächsten Kompositionsprüfung.

### 9 · Raum schließt materialgerecht

**Urteil: nicht anwendbar auf dieses reine Terrain-Asset.**

Das PNG enthält absichtlich keinen vollständigen Raumabschluss. Es zeigt nur
die freigestellte Terrain-Silhouette, damit der Architekt sie in die Nacht-
Klassenzimmerseite einsetzen kann. Ein schwarzer Rand wurde nicht als Ersatz
für Raum verwendet; dunkle Flächen innerhalb des Körpers sind Pigment und
Buchmaterial.

**Offen:** Seitenrand, Buchfalz, obere Zimmerbegrenzung und Haze müssen am
eingesetzten Exemplar geprüft werden.

### 10 · Detail an Flanke und Unterseite

**Urteil: bestanden.**

Die Seitenlagen, Buchrücken, Verschlüsse, Falze und Schatten sitzen an den
Vertikalen und Unterseiten. Die Tischplatten haben ruhige helle Flächen; die
stärksten Materialdetails liegen an den Kanten und den darunterliegenden
Strukturen.

**Schwachstelle:** Die Vertragszellen erlauben nur eine begrenzte Tischhöhe;
deshalb ist die Detailverteilung im Pultkörper kompakter als in einer freien
Illustration.

### 11 · Gefahren-Deckung

**Urteil: kein Gefahrenobjekt enthalten; Anti-Kriterium dennoch bestanden.**

Es gibt keine Spitze, Tintenpfütze oder Gegnerfläche, deren Hitbox zu prüfen
wäre. Die Transparenz außerhalb der Maske verhindert, dass ein nicht gemalter
Bereich als begehbarer Körper erscheint.

**Nicht geprüft:** eine spätere Tinten- oder Spitzenvariante. Dafür braucht es
ein eigenes Exemplar mit sichtbarer Gefahrenkontur.

### 12 · Raum-Kohärenz

**Urteil: innerhalb des einen Gemäldes bestanden; Kapitelweite offen.**

Regal, Turm, Pulte und Boden teilen dieselbe Nacht-Palette, Gouache-Textur,
Papier-/Buchfamilie und Lichtquelle. Der Materialbestand wechselt nicht
willkürlich zwischen Wald, Erde und Eis.

**Offen:** Es wurde nur dieses eine Kalibrierbild geprüft. Die Übertragung auf
weitere Räume ist erst nach Architekten-Review und Kokis Blick zulässig.

## 4. Direkte Zell-Vertragsprüfung

**Geprüft:**

- Bildgröße 2048 × 1116
- PNG mit RGBA-Alpha
- Zellbox ab y=12
- jede #-Zelle vollständig opak
- keine Alpha-Pixel außerhalb der Maske
- Ausgabe enthält keinen Magenta-Key
- normalgroße Ansicht auf hellem Hintergrund
- verkleinerte Ansicht auf Gesamt-Silhouette

**Nicht ausgeführt:**

- kein Laufspiel oder Dev-Server
- keine Gameplay-Kollision
- kein numerischer Luminanz-Audit des Laufbands
- kein separater automatischer Naht-/Perioden-Detektor
- kein Vergleich gegen m4, m7 und m8, weil diese Dateien im aktuellen Checkout
  nicht vorhanden sind
- keine Prüfung der späteren Einbettung in die Ein-Block-Welt

## 5. Öffnungs- und Kontextlücke

Der Auftrag nennt docs/n6-auftrag/koki-sicht/m4/m7/m8.png als Kontext. Im
aktuellen Arbeitsstand existiert docs/n6-auftrag/koki-sicht nicht; eine Suche
nach m4.png, m7.png und m8.png unter dem Worktree blieb leer. Daher konnte ich
die drei heutigen Gameplay-Kompositionen nicht ansehen. Die liefernden
Referenzblätter mass_body_p2_a.png, mass_body_p2_b.png, crust_p2_a.png und
crust_p2_b.png wurden dagegen geöffnet und als Nacht-/Buchmaterial-Referenz
verwendet.

## 6. Abschluss

Das Exemplar ist für den feindseligen Architekten-Review abgelegt. Es ist noch
kein Kanon und wurde nicht repliziert. Die größte offene Frage ist nicht Maß
oder Alpha, sondern ob die vertraglich grobe Silhouette in der echten
Klassenzimmer-Komposition weiterhin als ein gemaltes Ganzes und nicht als
Zellverband liest.

## 7. Runde 2 — genau eine F1–F4-Fixrunde

Das Architekten-Review wurde vollständig gelesen und das eigene PNG vor der
Bearbeitung geöffnet. Danach erfolgte genau eine zusammenhängende lokale
Rasterkorrektur auf dem bestehenden Exemplar; es wurde kein neues Motiv erzeugt
und keine weitere Bildrunde begonnen.

- **F1 — Tische:** Die beiden Pulte wurden über die Zellgrenzen als durchgehende
  Möbel gelesen: Tischplatte, dunkler Unterzug, gedrechseltes Bein, Buch-Keil und
  Fuß berühren sich optisch und reichen bis an den Bodenansatz. Die vorhandene
  Bodenlandschaft blieb außerhalb des ausdrücklich beanstandeten Anschlusses
  unangetastet.
- **F2 — Turmfuß:** Die flachen Fußzellen erhielten gestauchte, ausbeulende
  Buchlagen, einen weichen Schatten-Teich und einen herausgerutschten Band-/Keil-
  Ansatz. Dadurch endet der Turm nicht mehr als reine Füllung.
- **F3 — flache Zellen:** Die im Review genannten Bereiche erhielten kühle,
  dunklere Pigmentformen, Buchschnitt-Linien und breite Wertverläufe. Die zuvor
  flache unterste Prüfzeile wurde als eine durchgehende, zellübergreifende
  Schatten-/Buchform verstärkt; die gemessene Luminanz-Streuung liegt dort jetzt
  in allen 24 Zellen über 27.
- **F4 — Kanten und Fächer:** Die Turmflanke bekam versetzte innere Buchenden und
  unregelmäßige gemalte Schnittlinien. Unter der Regalbahn wächst nun ein
  zusammenhängender Papierfächer aus dem Buchblock. Die gelobte
  Regalbahn-Oberseite und die gelobte Bodenlandschaft wurden nicht neu
  positioniert oder ersetzt.

### Runde-2-Prüfung

- Maß erneut: 2048 × 1116 px; PNG/RGBA unverändert.
- Zellvertrag erneut geprüft: 185 erlaubte Zellen vollständig opak; außerhalb
  der Maske 0 Alpha-Pixel.
- Alle im Review als flach genannten Prüfbereiche liegen über der geforderten
  Standardabweichung 6; die unterste Prüfzeile liegt zwischen 27,8 und 31,3.
- Die obere Regalbahn-Oberfläche (y=12 bis y=41) blieb pixelgleich.
- Aktuelle MD5-Prüfsumme: `48f2458d6c1935a5899f69bfd69c8b03`.

**Ehrliche Grenze:** Die vier Fixes sind im Einzelbild bearbeitet und geprüft.
Die fehlenden Kontextbilder `m4.png`, `m7.png` und `m8.png` waren weiterhin nicht
vorhanden; deshalb ist keine Aussage über die spätere Einbettung in die
Ein-Block-Welt möglich.

## 8. Runde 3 — kompletter Neu-Wurf, ein Durchgang

Das Runde-2-Review wurde vollständig gelesen; das aktuelle Blatt wurde vor dem
Neu-Wurf geöffnet. Die Runde-2-Datei wurde nicht lokal übermalt oder repariert.
Stattdessen entstand eine neue vollständige Nacht-Klassenzimmer-Malvorlage als
ein zusammenhängendes Gouache-Bild. Erst danach wurde diese neue Malvorlage in
die bindende Alpha-Silhouette gesetzt. Alpha-Silhouette bedeutet hier die
Transparenzform, die festlegt, welche Pixel als Terrain existieren.

- **Boden-Laufband:** Die hellen, aufgeschlagenen Seiten bilden einen einzigen
  ruhigen Laufkörper. Die gemessene mittlere Luminanz — durchschnittliche
  Helligkeit der RGB-Pixel — beträgt auf den fünf Vertragsproben: Regalbahn
  34,74 %, Turmabsatz 31,28 %, linkes Pult 45,66 %, rechtes Pult 43,30 % und
  Boden 31,67 %. Damit liegt jede Probe über dem neuen Gesetz von 30 %.
- **Turm:** Der Turm besteht aus derselben neuen Buchmalerei, mit natürlichen
  Versätzen der Buchlagen, sichtbaren Schnittkanten und einer schweren,
  schattigen Basis. Die Laufkante des Turmabsatzes ist eine echte Buchlage des
  Verbandes, kein aufgesteckter Keil.
- **Tische:** Beide Tische sind jeweils ein durchgehendes klassisches Möbel mit
  ruhiger Holzplatte, verbundenem Unterbau und tragendem Bein. Links ist das
  Bein gedrechseltes Holz; rechts ein kompakter Bücherstapel. Kein Blumentopf.
- **Tiefe:** Die unteren Buchlagen bleiben kühl blau-violett und dunkler, aber
  ohne die vorherige volle Blattbreite an Zier-Schlangenlinien. Es wurden keine
  Laufband-Muster angelegt.
- **Verbote:** Im neuen Blatt gibt es keine außerhalb der Maske sichtbaren
  Ornamentlinien, keine frei schwebenden Terrain-Splitter, keine aufgesteckten
  Keile und keine Topf-Füße. Die kleinen Bücher unten liegen als geerdete Teile
  im zusammenhängenden Buchboden, nicht im Außenraum.

### Runde-3-Prüfung

- Maß: 2048 × 1116 px; PNG/RGBA.
- Zellvertrag: 185 erlaubte `#`-Zellen vollständig opak; außerhalb der Maske
  0 Alpha-Pixel.
- Laufband-Proben: alle fünf über 30 % mittlerer Luminanz.
- Herstellungsweg: eine neue Bildgenerator-Malvorlage, danach einmalige technische
  Größen-/Maskenfassung. Keine Pixel des Runde-2-Blatts als Malvorlage verwendet.
- Aktuelle MD5-Prüfsumme: `80a7f9cda6c72d3cfc56883bea2888e4`.

**Ehrliche Grenze:** Die fehlenden Kontextbilder `m4.png`, `m7.png` und `m8.png`
waren weiterhin nicht im aktuellen Checkout vorhanden. Gameplay-Kollision,
Einbettung in die Ein-Block-Welt und Kokis abschließender Sichttest sind daher
noch offen. Dieses Blatt ist die letzte Kunst-Implementierung vor der
Eskalation.

## 9. Runde 4 — M1+M2 chirurgische Retusche

- **M1:** Nur der 20-px-Mondlicht-Saum am oberen Rand des violetten Folianten
  wurde retuschiert; mittlere Luminanz jetzt 30,57 %.
- **M2:** Nur die 13 genannten Zellen erhielten kühle Schnittkanten-/Lagen-
  Modulation; jede liegt jetzt über Wert-SD 6 (Minimum 6,35). Alpha-Silhouette
  und alle übrigen Bildbereiche blieben unverändert. Neue MD5: `95357901b54017b58431a99df63f54d1`.
