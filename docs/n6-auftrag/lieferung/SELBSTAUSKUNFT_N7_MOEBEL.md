Stand: 2026-09-02 - N7A1 - Moebel - Runde 1

# CODEX DRAFT — NOT CANON

Status: DOCUMENT (`docs/n6-auftrag/lieferung/`). Runde 2: sechs vollständige Neuwürfe mit Malerei-Nachbesserung. Die Stand-Zeile bleibt absichtlich die der Order.

## Prüfumfang

- Alle sechs Blattmaße wurden auf die neuen Vorgaben geändert; die Breiten bleiben 64 px je Zelle.
- Alle sechs PNGs sind 8-Bit-RGBA-Dateien mit Alpha-Silhouette.
- Die drei abgenommenen p2-Möbel wurden erneut als Machart-Referenz geöffnet.
- Normalgröße und verkleinerte Gesamtansicht wurden visuell geprüft.
- Die neuen Bilder enthalten modellierte Wertverläufe, farbige Materialkörnung, Seitenlagen, Bänder/Falze und farbige Kontaktschatten; es wurden keine schwarzen Umrisslinien gezeichnet.
- `check-ground-plane --selftest` war grün: ein sauberes Blatt und drei absichtlich veränderte Fehlerfälle wurden korrekt erkannt.
- Der Einzelblatt-Check meldet für alle sechs neuen Lieferbilder: Reichweite 100 %, Kippung 0,0°.
- Die Dateidichte wurde als grober technischer Indikator mitgeprüft; sie ersetzt keine menschliche Malerei-Abnahme.

## 1. `terrain_reading_bench_p1.png`

- MD5: `848828e9f05fb4ed00ee6c9b76ca2df1`
- Blattmaß: 128 × 96 px; RGBA; 10 621 Byte; Alpha-Bounding-Box `(3, 8)–(125, 95)`.
- Texturdichte: 3 171 unterschiedliche opake RGB-Werte; häufigster Wert 0,2 % der opaken Pixel.
- Unterkante: Reichweite 100 %, Kippung 0,0°.

1. Benennbarkeit / Geologie — Lesebank aus warmem Buchleder, Sitzdeckel, Papierlagen und zwei geraden Buchwangen; als Bank sofort lesbar.
2. Silhouette — geschlossener gefertiger Umriss mit zwei geraden Wangen; keine schwarze Kontur, der Umriss entsteht aus farbigem Wertkontrast.
3. Laufkante — breite, ruhige, waagrechte Sitzfläche mit heller oberer Lederkante.
4. Unterseite / Flanke gemalt — Wangen und Sitzschürze tragen weiche Schatten, Körnung und sichtbare Buch-/Papierstruktur.
5. Innen-Modulation — diagonales Licht oben links, Abschattung unten rechts, feine Lederflecken und unregelmäßige Ereignisse ohne Wiederholungs-Tile.
6. Verbindungs-Logik — Sitzplatte, Schürze und Wangen sind über Auflager- und Falzschatten verbunden; die Wangen wirken tragend.
7. Material = Spielrolle — das feste Sitzbrett und die kompakten Buchwangen erklären die begehbare Bankfunktion.
8. Tiefen-Palette — warme Leder-, Ziegel-, Ocker-, Olive- und Papierwerte; die tragenden Kanten sind die kontraststärksten Flächen.
9. Raum schließt materialgerecht — transparenter Alpha-Rand ohne künstliche Bodenfläche; der farbige Kontaktschatten bleibt oberhalb der geraden Basis.
10. Detail an Flanke und Unterseite — Rückenbänder, Lederkörnung, Seitenlinien und Schürzenschatten sitzen an den Vertikalen; Oberseite bleibt funktional.
11. Gefahren-Deckung — keine Gefahrform und kein Dekor, das zusätzliche Begehbarkeit vortäuscht.
12. Raum-Kohärenz — warmes p1-Material, dieselbe frontal-orthografische Körpergrammatik und dieselbe Bodenebene wie im Möbel-Set.
13. Eine orthografische Bodenebene — erfüllt: gerade waagrechte Aufstandskante, 100 % Reichweite, 0,0° Kippung.

## 2. `terrain_book_bundle_p1.png`

- MD5: `c16bdb4a8b938e096e8d81bd36f0caf0`
- Blattmaß: 128 × 120 px; RGBA; 18 124 Byte; Alpha-Bounding-Box `(6, 7)–(122, 119)`.
- Texturdichte: 5 212 unterschiedliche opake RGB-Werte; häufigster Wert 0,3 % der opaken Pixel.
- Unterkante: Reichweite 100 %, Kippung 0,0°.

1. Benennbarkeit / Geologie — liegendes, verschnürtes Bündel aus vier dicken Büchern mit klar erkennbarem Lederband.
2. Silhouette — geschlossener liegender Bücherkörper; das oberste Buch bildet eine breite, waagrechte Lauffläche.
3. Laufkante — obere Buchdecke und die horizontalen Seitenkanten sind ruhig und durchgehend.
4. Unterseite / Flanke gemalt — jede Lage hat modellierte Deckel, Seitenblock, Schattenkante und lokale Papierfasern.
5. Innen-Modulation — Ocker, Ziegelrot, Olive und Braun tragen weiche Übergänge; Körnung und Flecken sind unregelmäßig verteilt.
6. Verbindungs-Logik — ein einzelnes breites Lederband umschließt das gesamte Bündel; Buckel/Knoten markiert die Umschließung.
7. Material = Spielrolle — der schwere Bücherstapel ist tragend, das Band hält ihn zusammen; beides ist aus der Malerei ablesbar.
8. Tiefen-Palette — warmes p1-Licht von oben links, farbige Schatten nach unten rechts, Papier- und Goldakzente für die Tiefentrennung.
9. Raum schließt materialgerecht — kein Außenboden und kein schwarzer Schattenauslauf; der Kontaktschatten sitzt oberhalb der geraden Basis.
10. Detail an Flanke und Unterseite — Seitenlagen, Lederkörnung, Bandüberlagerung und untere Deckelkante tragen die Geschichte.
11. Gefahren-Deckung — keine Gefahrform und keine dekorative Fläche, die Begehbarkeit vortäuscht.
12. Raum-Kohärenz — warmes p1-Buchmaterial und gleiche orthografische Grundebene wie bei Bench, Regalen und Folio.
13. Eine orthografische Bodenebene — erfüllt: gerade waagrechte Aufstandskante, 100 % Reichweite, 0,0° Kippung.

## 3. `terrain_book_shelf_p1.png`

- MD5: `f2f126d40ce87c47af65e49d03544233`
- Blattmaß: 192 × 96 px; RGBA; 19 550 Byte; Alpha-Bounding-Box `(6, 6)–(185, 95)`.
- Texturdichte: 5 098 unterschiedliche opake RGB-Werte; häufigster Wert 0,3 % der opaken Pixel.
- Unterkante: Reichweite 100 %, Kippung 0,0°.

1. Benennbarkeit / Geologie — niedriges Regalbrett aus einem Bücherstapel im Verband, mit langem tragendem oberen Brett.
2. Silhouette — offener, niedriger Regalumriss; der gerade obere Abschluss ist ein gemaltes Brett, keine nackte Kontur.
3. Laufkante — lange, helle und waagrechte Oberkante; Materialwechsel liegen innerhalb der Buchkörper.
4. Unterseite / Flanke gemalt — mehrere Reihen aus Leder, Papierkanten, Rücken und farbigen Fugen modellieren die Tiefe.
5. Innen-Modulation — weiche diagonale Lichtverläufe plus lokale Kratzer, Flecken und Seitenvariationen; keine erkennbare Wiederholungsperiode.
6. Verbindungs-Logik — das obere Brett liegt auf dem Bücherverband; die vertikalen Buchkörper und Fugen zeigen den Verband.
7. Material = Spielrolle — der breite Bücherverband trägt das Brett und liest sich als festes niedriges Terrain.
8. Tiefen-Palette — warme Ocker-, Rot-, Olive-, Blau- und Braunwerte; farbige Schatten statt schwarzer Konturen.
9. Raum schließt materialgerecht — Alpha-Rand ohne künstliche Plattform; der farbige Kontaktschatten bleibt vor der geraden Basis.
10. Detail an Flanke und Unterseite — Buchrücken, Seitenlagen, Falze und Auflagerfugen liegen an der Front; Oberseite bleibt ruhig.
11. Gefahren-Deckung — keine Gefahrform und kein irreführendes Zusatzdekor.
12. Raum-Kohärenz — p1-Wärme und gemeinsame Buch-/Papiergrammatik; die Anordnung bleibt eigenständig gegenüber der Alt-Schwester.
13. Eine orthografische Bodenebene — erfüllt: gerade waagrechte Aufstandskante, 100 % Reichweite, 0,0° Kippung.

## 4. `terrain_book_shelf_p1_alt.png`

- MD5: `89912af30c17bc79a0f03558c1122776`
- Blattmaß: 192 × 112 px; RGBA; 24 079 Byte; Alpha-Bounding-Box `(7, 6)–(185, 111)`.
- Texturdichte: 6 287 unterschiedliche opake RGB-Werte; häufigster Wert 0,3 % der opaken Pixel.
- Unterkante: Reichweite 100 %, Kippung 0,0°.

1. Benennbarkeit / Geologie — Schwesterregal mit zwei aufrechten Buchpfosten und einer tief gefassten, vierlagigen Mittelablage.
2. Silhouette — strukturell klar verschieden von Blatt 3: seitlich geschlossene Nische statt offenem Bücherverband.
3. Laufkante — langes oberes Folio und die Ablagekanten sind waagrecht; die Oberseite bleibt als Lauffläche ruhig.
4. Unterseite / Flanke gemalt — Pfosten, Nischenlagen, Seitenblöcke und Basis tragen sichtbare weiche Wertmodellierung.
5. Innen-Modulation — Ocker, Blau, Rot und Braun erhalten jeweils eigene Licht-/Schattenverläufe, Körnung und lokale Verschleißereignisse.
6. Verbindungs-Logik — die beiden Buchpfosten fassen die Mittelablage; seitliche Auflager- und Nischenschatten erklären die Konstruktion.
7. Material = Spielrolle — die Pfosten tragen, die Mittelbücher lagern; die unterschiedliche Rolle ist aus Form und Wert ablesbar.
8. Tiefen-Palette — warme p1-Familie mit Gold-/Papierlichtern und farbigen Nischenschatten; keine schwarze Konturlinie.
9. Raum schließt materialgerecht — die Nische schließt den Körper selbst; der Kontaktschatten verwischt die waagrechte Basis nicht.
10. Detail an Flanke und Unterseite — Buchbänder, geprägte Ereignisse, Papierlagen und Nischenfugen sitzen an den Seiten und unten.
11. Gefahren-Deckung — keine Gefahrform und keine dekorative Zusatzfläche.
12. Raum-Kohärenz — gleiches p1-Material und dieselbe Bodenebene, aber anderes Bücher-Motiv und andere Anordnung als Blatt 3.
13. Eine orthografische Bodenebene — erfüllt: gerade waagrechte Aufstandskante, 100 % Reichweite, 0,0° Kippung.

## 5. `terrain_book_folio_p1.png`

- MD5: `10dc3b2ad195275bf6433866e40d7de4`
- Blattmaß: 64 × 33 px; RGBA; 2 816 Byte; Alpha-Bounding-Box `(2, 2)–(62, 32)`.
- Texturdichte: 1 106 unterschiedliche opake RGB-Werte; häufigster Wert 0,6 % der opaken Pixel.
- Unterkante: Reichweite 100 %, Kippung 0,0°.

1. Benennbarkeit / Geologie — einzelnes flaches liegendes Folio mit warmem Deckel und klar erkennbarem Papierblock.
2. Silhouette — geschlossener flacher Fertigkörper ohne schwarze Umrisslinie; der Wertkontrast trägt die Kante.
3. Laufkante — obere Deckelkante und untere Buchkante verlaufen waagrecht und ruhig.
4. Unterseite / Flanke gemalt — Papierblock, Lederkante und farbiger Kontaktschatten geben dem dünnen Körper Gewicht.
5. Innen-Modulation — weicher Ocker-/Papierverlauf, feine Papierkörnung und wenige unregelmäßige Seitenereignisse.
6. Verbindungs-Logik — Deckel fasst den Papierblock oben und unten; Falz- und Schattenwechsel zeigen die Konstruktion.
7. Material = Spielrolle — das dünne, flache Papierobjekt ist rutschiger und weniger massiv, aber durch seine Kante begehbar.
8. Tiefen-Palette — warmes Ocker, Papiergold und gebranntes Braun mit weicher Abschattung nach unten rechts.
9. Raum schließt materialgerecht — transparenter Rand ohne künstliche Plattform oder Schattenauslauf außerhalb der Form.
10. Detail an Flanke und Unterseite — geschichtete Papierkante und unterer Deckel liegen dort, wo die Materialgeschichte gebraucht wird.
11. Gefahren-Deckung — keine Gefahrform und keine Begehbarkeitsvortäuschung.
12. Raum-Kohärenz — kleinste p1-Ausführung derselben Buch-/Papierwelt und derselben orthografischen Bodenebene.
13. Eine orthografische Bodenebene — erfüllt: gerade waagrechte Aufstandskante, 100 % Reichweite, 0,0° Kippung.

## 6. `terrain_night_lectern_p2.png`

- MD5: `fb288ff991e83fbb99b261cf7c4af5e9`
- Blattmaß: 128 × 110 px; RGBA; 8 802 Byte; Alpha-Bounding-Box `(8, 4)–(120, 109)`.
- Texturdichte: 2 547 unterschiedliche opake RGB-Werte; häufigster Wert 0,5 % der opaken Pixel.
- Unterkante: Reichweite 100 %, Kippung 0,0°.

1. Benennbarkeit / Geologie — kühles Nacht-Stehpult mit schräger Lesefläche, waagrechter Steh-Kante, einem gedrechselten Fuß und gerader Basis.
2. Silhouette — geschlossener zentral getragener Pultkörper; die schräge Lesefläche ist bewusstes Objektmotiv, keine Bodenperspektive.
3. Laufkante — die Vorderkante der Lesefläche ist waagrecht, hell modelliert und durchgehend.
4. Unterseite / Flanke gemalt — Pultschürze, Fußwülste, Buchbasis und Plinthe tragen weiche kühle Schatten und Materialkörnung.
5. Innen-Modulation — Blauviolett, Navy, Pflaume und Papier erhalten Licht von oben links und Abschattung unten rechts; Fußringe sind strukturelle Ereignisse.
6. Verbindungs-Logik — Lesefläche sitzt auf der Schürze; Schürze, ein Fuß, Buchbasis und Plinthe sind sichtbar aufgelagert.
7. Material = Spielrolle — die feste Pultplatte, der einzelne tragende Fuß und die schwere Buchbasis erklären die Stehfunktion.
8. Tiefen-Palette — kühle Blauviolett-Familie mit Gold-/Papierlichtern und farbigen Schatten; keine schwarze Kontur.
9. Raum schließt materialgerecht — transparenter Alpha-Rand; der farbige Kontaktschatten liegt oberhalb der geraden, breiten Basis.
10. Detail an Flanke und Unterseite — Schürzenwert, Fußringe, Buchseiten und Plinthenkante tragen die Geschichte; Lesefläche bleibt ruhig.
11. Gefahren-Deckung — keine Gefahrform und kein Dekor, das eine zusätzliche Bodenfläche vortäuscht.
12. Raum-Kohärenz — p2-Kühlpalette, aber dieselben Buch-/Papierkörper und dieselbe frontal-orthografische Bodenebene.
13. Eine orthografische Bodenebene — erfüllt: gerade waagrechte Aufstandskante, 100 % Reichweite, 0,0° Kippung.

## Nicht geprüft / offene Abnahme

- Nicht geprüft wurde die spätere Einbettung in den laufenden Spielaufbau: keine Montage-, Kollisions- oder tatsächliche Kind-Fußkontaktprüfung in der Welt.
- Nicht unabhängig blind bewertet wurde die ästhetische Abnahme durch eine zweite Person; die visuelle Prüfung hier ist eine eigene Normalgrößen- und verkleinerte Gesamtansicht.
- Nicht maschinell geprüft wurden die Kanonpunkte 1–12; die obigen Antworten sind Selbstbewertungen. Maschinell belegt ist Punkt 13 über den Boden-Check.
- Die endgültige Geschmacks- und Kanonfreigabe bleibt daher die menschliche Abnahme.
