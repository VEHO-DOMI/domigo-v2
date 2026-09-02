Stand: 2026-09-02 · N7A2 · Runde 1

# SELBSTAUSKUNFT N7P3

## Lieferung und Messwerte

Alle sechs PNGs sind je ein eigener Bildwurf. Es wurden keine Pixel aus dem
abgenommenen Exemplar oder aus einem anderen Blatt collagiert. Die technische
Exportpassage bestand aus dem bestellten Maßzuschnitt, der Anwendung der jeweils
zugehörigen Schablone als Alpha-Silhouette, einer globalen Wert-Normierung auf
den Wert-Vertrag und dem zulässigen unteren Übermalrand; es gab keine lokale
Bildretusche oder Flickarbeit.

Gemessen wurde an allen sichtbaren Pixeln mit Alpha ≥128: relative Luminanz
`0.2126R + 0.7152G + 0.0722B`, geteilt durch 255, sowie HSV-Sättigung
`(Maximum − Minimum) / Maximum`.

| Blatt | Maß | MD5 | mittlere Luminanz | mittlere Sättigung |
|---|---:|---|---:|---:|
| `body_p3_westterrasse_rutsche.png` | 1408×732 | `afef6f118fd9cf44f8865f844808d360` | 33,37 % | 58,32 % |
| `body_p3_ostmauer_sims.png` | 1536×796 | `fe77c74d12ea80f68e801dc4b09d7c18` | 33,00 % | 65,84 % |
| `body_p3_mittelpfeiler.png` | 512×604 | `5a66fac0dfa81ac8b3a0862fa8296d75` | 33,46 % | 69,09 % |
| `body_p3_deckenbahn_west.png` | 1408×92 | `760c4d4a0f4d0b9e6befa9d9b5fcc215` | 33,69 % | 64,11 % |
| `body_p3_deckenbahn_mitte.png` | 1408×92 | `1fef1c42a429448efe0d82a015903f0a` | 33,64 % | 78,52 % |
| `body_p3_deckenbahn_ost.png` | 1280×92 | `47b01bd83ffa282d037b853c596510a2` | 33,49 % | 85,96 % |

Alle sechs Werte liegen im bestellten Korridor 30–38 %; alle sechs
Sättigungswerte liegen über 45 %.

## Maschinenprüfung

- `check-body-silhouette.mjs`: 6/6 bestanden; Maß, Kern-Deckung ≥98 %,
  Alpha-Ehrlichkeit, Lauf-Linie und Kein-Loch-Gesetz sind grün.
- `check-ground-plane.mjs --selftest`: bestanden, einschließlich der drei
  absichtlich roten Tamper-Fälle.
- `check-ground-plane.mjs --sheet`: Westterrasse 91 % / 0,0°; Ostmauer
  100 % / 0,0°; Mittelpfeiler 100 % / 0,0°. Die drei Deckenbahnen sind
  hängende Körper und daher keine Boden-Aufstandskanten.

## Kanonantworten je Blatt

### A · `body_p3_westterrasse_rutsche.png`

1. **Benennbarkeit / Geologie:** Ja. Eine abgetreppte Böschung aus verbundenen
   alten Buchkörpern; Seiten und Bindungen machen das Kapitelmaterial lesbar.
2. **Silhouette:** Ja. Die Maske wird vollständig erfüllt; die Diagonale fällt
   als Buchschulter ab und der freie Rutschenbereich bleibt frei.
3. **Laufkante:** Ja. Die obere Diagonale ist hell, durchgehend und ruhig; die
   sichtbare Kruste bleibt materialisch stärker als der Körper.
4. **Unterseite / Flanke:** Ja. Seitenflächen, Rücken und Seitenblöcke tragen die
   Masse; die Lauffläche bleibt ruhiger.
5. **Innen-Modulation:** Ja. Große weiche Wertflächen, lokale Abriebstellen und
   keine erkennbare Kachelperiode.
6. **Verbindungs-Logik:** Ja. Buchlagen wachsen als Verband und Kragen aus der
   Böschung; es gibt keine angesetzten Klotz-Verbindungen.
7. **Material = Spielrolle:** Ja. Gebundene Bücher tragen; die hell abgeriebene
   Diagonale kündigt die rutschige Kreidestaub-Rutsche an.
8. **Tiefen-Palette:** Ja. Warme Papieroberseiten und dunkle, weichere Flanken
   trennen die Tiefe; die Kante ist der stärkste Kontrast.
9. **Raum schließt materialgerecht:** Ja. Kein Fremdhintergrund, kein schwarzer
   Dekorraum; die Silhouette schließt als Buchmasse.
10. **Detail an Flanke / Unterseite:** Ja. Die Detaildichte sitzt an Rücken,
    Seitenblöcken und Unterkante, nicht als Muster auf der Laufbahn.
11. **Gefahren-Deckung:** Ja. Keine Gefahrentinte ist in diesem Blatt enthalten;
    die freigehaltene Rutschenzone wird nicht fälschlich als Boden gemalt.
12. **Raum-Kohärenz:** Ja, visuell. Die warme, dunkle Buchgrammatik stimmt mit
    Ostmauer und Mittelpfeiler überein.
13. **Orthografische Bodenebene:** Ja. Die maschinelle Messung ergibt 91 %
    Reichweite und 0,0° Kippung; die Kontaktkante ist waagrecht.

### B · `body_p3_ostmauer_sims.png`

1. **Benennbarkeit / Geologie:** Ja. Eine dreistufige Mauer aus verbundenen
   Buchlagen mit klar lesbarem Ausgangssims.
2. **Silhouette:** Ja. Die Stufen und der einzelne obere Schwellenkörper folgen
   der Maske; die Schwelle bleibt als breite Buchkante lesbar.
3. **Laufkante:** Ja. Die Stufenkanten sind hell und durchgehend, ohne Bruch an
   einer Zellgrenze.
4. **Unterseite / Flanke:** Ja. Die sichtbaren Seitenblöcke, Rücken und unteren
   Lagen beweisen Gewicht.
5. **Innen-Modulation:** Ja. Unterschiedliche Buchrücken und Seitenblöcke bilden
   weiche Wertflächen ohne Rapport.
6. **Verbindungs-Logik:** Ja. Die drei Absätze wachsen als gemalte Kragen aus
   derselben Mauer und wirken nicht angestoßen.
7. **Material = Spielrolle:** Ja. Die gestapelten Bände tragen; der breite Sims
   markiert die betretbare Ausgangsschwelle.
8. **Tiefen-Palette:** Ja. Warme Oberseiten stehen gegen dunklere Flanken; die
   Kontaktkanten tragen den stärksten Kontrast.
9. **Raum schließt materialgerecht:** Ja. Die Mauer ist eine geschlossene
   Buchwelt-Masse ohne dekorative Luftkörper.
10. **Detail an Flanke / Unterseite:** Ja. Seitenlagen und Bindungen tragen die
    Geschichte; die Simsoberseite bleibt funktional ruhig.
11. **Gefahren-Deckung:** Ja. Keine Gefahrentinte ist Bestandteil dieses Blatts;
    es kündigt nur tragende Mauer und Schwelle an.
12. **Raum-Kohärenz:** Ja, visuell. Material, Licht und Wertvertrag gehören zur
    selben warmen Schulhof-Familie.
13. **Orthografische Bodenebene:** Ja. Die Messung ergibt 100 % Reichweite und
    0,0° Kippung; die untere Aufstandskante ist waagrecht.

### C · `body_p3_mittelpfeiler.png`

1. **Benennbarkeit / Geologie:** Ja. Ein freistehender, aus Büchern gebauter
   Pultsockel mit tragendem Schaft und Fuß.
2. **Silhouette:** Ja. Der Schaft verjüngt sich nach oben; der freie Ausschnitt
   im linken Auflagerkragen bleibt erhalten.
3. **Laufkante:** Ja. Die obere tragende Kante ist hell und ruhig; der Fuß steht
   auf einer geraden Linie.
4. **Unterseite / Flanke:** Ja. Die vertikalen Buchseiten und unteren Lagen
   machen das Gewicht des Pfeilers sichtbar.
5. **Innen-Modulation:** Ja. Verbundene Buchkörper haben breite Wertflächen,
   Seitenstreifen und lokale Abriebspuren statt Wiederholungsmuster.
6. **Verbindungs-Logik:** Ja. Der linke Absatz wächst als Auflagerkragen aus dem
   Schaft; er ist kein angesetzter Klotz.
7. **Material = Spielrolle:** Ja. Der Schaft trägt das Lesepult; der verbreiterte
   Fuß begründet die Standfestigkeit.
8. **Tiefen-Palette:** Ja. Warme Papierkanten und dunkle Rücken staffeln die
   Tiefe; die tragenden Kanten bleiben kontraststark.
9. **Raum schließt materialgerecht:** Ja. Keine Fremddekoration und kein
   schwarzer Leerraum innerhalb der Pflichtmaterie.
10. **Detail an Flanke / Unterseite:** Ja. Die Details liegen an den Seiten und
    am Fuß; die obere Trägerfläche bleibt lesbar.
11. **Gefahren-Deckung:** Ja. Keine Gefahrentinte ist hier vorgesehen oder
    sichtbar.
12. **Raum-Kohärenz:** Ja, visuell. Der Pfeiler nutzt dieselbe Buch-/Papier-
    Grammatik wie Terrasse und Ostmauer.
13. **Orthografische Bodenebene:** Ja. Die Messung ergibt 100 % Reichweite und
    0,0° Kippung; der Fuß steht waagrecht.

### D1 · `body_p3_deckenbahn_west.png`

1. **Benennbarkeit / Geologie:** Ja. Ein verbundenes Papier-Laubdach über dem
   Hof, nicht eine generische Plattform.
2. **Silhouette:** Ja. Die 22 Pflichtzellen sind gedeckt; die Unterkante hängt
   als verbundene Folge von Papier- und Blattformen.
3. **Laufkante:** Ja, für die hängende Weltkante. Das obere Stehband ist ruhig
   und durchgehend.
4. **Unterseite / Flanke:** Ja. Die sichtbare Unterseite trägt Falten, Blattadern
   und Papierlagen.
5. **Innen-Modulation:** Ja. Große zusammenhängende Wertfelder und lokale
   Faltungen; kein sichtbarer Rapport.
6. **Verbindungs-Logik:** Ja. Seiten und Blätter hängen aus einer gemeinsamen
   Rückenleiste; nichts wirkt schwebend angesetzt.
7. **Material = Spielrolle:** Ja. Papier und Blattwerk erklären die hängende,
   nicht begehbare Decke.
8. **Tiefen-Palette:** Ja. Dunkler Rücken, warme Papierflächen und olivfarbene
   Blätter trennen die Schichten.
9. **Raum schließt materialgerecht:** Ja. Die Decke schließt den Raum als
   Buch-/Papierwelt; außerhalb bleibt Alpha leer.
10. **Detail an Flanke / Unterseite:** Ja. Das Detail sitzt an der sichtbaren
    Unterseite, die obere Weltkante bleibt funktional ruhig.
11. **Gefahren-Deckung:** Ja. Keine Gefahrentinte; die Decke kündigt keine
    begehbare Fläche an.
12. **Raum-Kohärenz:** Ja, visuell. D1, D2 und D3 verwenden dieselbe Vokabel,
    aber keine sichtbare Pixelkopie.
13. **Orthografische Bodenebene:** Nicht anwendbar als Boden-Aufstandskante;
    D1 ist ein hängender Körper. Die orthografische, waagrechte obere Weltkante
    besteht die Laufkantenprüfung.

### D2 · `body_p3_deckenbahn_mitte.png`

1. **Benennbarkeit / Geologie:** Ja. Dasselbe verbundene Papier-Laubdach wie
   D1, mit eigener lokaler Faltung.
2. **Silhouette:** Ja. Die 22 Pflichtzellen sind gedeckt; die verbotenen Bereiche
   bleiben transparent.
3. **Laufkante:** Ja, für die hängende Weltkante. Das obere Stehband bleibt
   gerade und ruhig.
4. **Unterseite / Flanke:** Ja. Papierlagen, Falten und Blattadern geben der
   Unterseite Richtung und Gewicht.
5. **Innen-Modulation:** Ja. Verbundene weiche Wertflächen ohne Zellnaht oder
   erkennbare Wiederholungsperiode.
6. **Verbindungs-Logik:** Ja. Das Laubdach hängt aus einer gemeinsamen oberen
   Rückenstruktur und nicht aus Einzelklötzen.
7. **Material = Spielrolle:** Ja. Die Papier-/Blattunterseite ist sichtbar
   hängend und nicht als Boden missverständlich.
8. **Tiefen-Palette:** Ja. Warme Papierfarben, Oliv und dunkler Rücken staffeln
   die Tiefe und bleiben unter dem hellen Hofwert.
9. **Raum schließt materialgerecht:** Ja. D2 schließt den Mittelabschnitt des
   Buchraums materialgerecht; außerhalb der Silhouette ist Alpha leer.
10. **Detail an Flanke / Unterseite:** Ja. Die Unterseite trägt die sichtbare
    Geschichte; oben keine unnötige Dekorstruktur.
11. **Gefahren-Deckung:** Ja. Keine Gefahrentinte und keine vorgetäuschte
    Begehbarkeit.
12. **Raum-Kohärenz:** Ja, visuell. D2 setzt D1 ohne sichtbare Zäsur fort und
    bleibt eigenständig gemalt.
13. **Orthografische Bodenebene:** Nicht anwendbar als Boden-Aufstandskante;
    D2 hängt. Die obere Weltkante ist waagrecht und besteht die Laufkantenprüfung.

### D3 · `body_p3_deckenbahn_ost.png`

1. **Benennbarkeit / Geologie:** Ja. Der Ostabschnitt bleibt als Papier-Laubdach
   der Buchwelt benennbar.
2. **Silhouette:** Ja. Alle 20 Pflichtzellen sind gedeckt; der freie Außenraum
   bleibt transparent.
3. **Laufkante:** Ja, für die hängende Weltkante. Das obere Band ist durchgehend
   und waagrecht.
4. **Unterseite / Flanke:** Ja. Fächerseiten, Blattadern und Papierkanten hängen
   sichtbar in den Raum.
5. **Innen-Modulation:** Ja. Lokale Ereignisse und weiche Wertflächen statt
   Kachel- oder Spiegelrapport.
6. **Verbindungs-Logik:** Ja. Die Formen wachsen aus einer durchgehenden oberen
   Rückenleiste; keine angesetzten Fragmente.
7. **Material = Spielrolle:** Ja. Das Material erklärt die nicht begehbare,
   hängende Decke bis zur Ostmauer.
8. **Tiefen-Palette:** Ja. Dunkle Rücken und warme Papier-/Olivflächen trennen
   die Tiefe vom hellen Tagesraum.
9. **Raum schließt materialgerecht:** Ja. Der Ostabschluss gehört zur
   Papier-Buchwelt und zeigt außerhalb keine begehbare Farbe.
10. **Detail an Flanke / Unterseite:** Ja. Die Unterseite ist detailreich; die
    Weltkante oben bleibt ruhig.
11. **Gefahren-Deckung:** Ja. Keine Gefahrentinte und kein falscher Bodenhinweis.
12. **Raum-Kohärenz:** Ja, visuell. D3 führt die gemeinsame Deckenfamilie bis
    zur Ostmauer fort, ohne Pixel aus D1 oder D2 zu übernehmen.
13. **Orthografische Bodenebene:** Nicht anwendbar als Boden-Aufstandskante;
    D3 ist hängend. Die orthografische obere Weltkante besteht die
    Laufkantenprüfung.

## Nicht geprüft / offene menschliche Abnahme

- Die sechs Blätter wurden nicht in der laufenden Phaser-Szene montiert; eine
  End-to-End-Prüfung der tatsächlichen Nahtfreiheit von D1→D2→D3 im Spiel ist
  daher offen.
- Die Messungen prüfen Geometrie, Alpha, Wert und Sättigung, aber keine
  menschliche Geschmacksabnahme. Koki muss die Normalgröße und die verkleinerte
  Gesamtansicht noch visuell freigeben.
- Der Abstand zum konkreten `plate_p3_yardwall`-Wert und zum Möbel-/Laubband
  wurde nicht als Szenenkomposit gemessen; geprüft wurde nur der Blattvertrag.
- Es wurde kein Commit ausgeführt und keine weitere Repo-Datei außerhalb dieser
  Lieferungsmappe beschrieben. Die sechs automatisch erzeugten ImageGen-
  Quellbilder liegen noch unter `/Users/veho/.codex/generated_images/...`;
  ihr gezieltes Löschen wurde versucht, aber vom verwalteten Dateisystem mit
  `Operation not permitted` verweigert. Das ist die einzige offene
  Schreibgrenzen-Abweichung dieser Lieferung.

## How I verified

Geprüft wurden die sechs Dateien aus dieser Lieferungsmappe direkt: Maße und
MD5, sichtbare PNG-Ansicht, sechs Durchläufe von
`check-body-silhouette.mjs --sheet … --body …`, drei Durchläufe von
`check-ground-plane.mjs --sheet …` für die stehenden Körper sowie der
`check-ground-plane`-Selbsttest. Nicht geprüft wurden Szenenmontage,
Laufzeitdarstellung und Koki’s endgültige Geschmacksfreigabe.
