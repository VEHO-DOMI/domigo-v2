# REVIEW · N7A2b · RUNDE 1 → Auftrag für RUNDE 2 (die letzte)

**Stand: 2026-09-03 · N7A2b · Runde 2**

## Zuerst: was RICHTIG ist und nicht angefasst wird

**Die Westterrasse ist gemalt, und sie ist gut.** Einzeln gemalte Bände in
unterschiedlichen Längen und Farben, versetzte Fugen, sichtbare Buchschnitte mit
Seitenlagen auf den Laufflächen, keine erkennbare Wiederholung. Genau das war
bestellt. Gemessen: Kanten-Median **63,6 %** über das ganze Blatt gegen 26,0 % in
Runde 3 der Vorgängerbahn — der Körper trägt jetzt Material.

**Posten A (`l2_p2`) ist angenommen.** Beide bindenden Zahlen sitzen:
Luminanz **15,48 %** (Fenster 15,0–16,0) · Sättigung **23,05 %** (Decke 27) ·
Naht-Mittel **5,34** (heute 7,60). Die Laternen sind warm geblieben, die Möbel
stehen an ihren Plätzen, die Aquarell-Handschrift ist da. **Daran wird nichts
geändert** außer dem einen Punkt unten.

## Der EINE Befund: schwarze Zellen, wo die Malerei nicht hinreicht

Beide Körper-Blätter fallen an derselben Stelle durch Gesetz 4:

- `body_p3_westterrasse_rutsche`: **14 Zellen** — (9,15) (12,16) (12,17) (13,17)
  (14,18) (15,18) (16,19) (17,19) (18,19) (18,20) (19,20) (20,20) (21,20) (19,21)
- `body_p3_mittelpfeiler`: **22 von 48 Zellen** — (29,17) (28,18) (29,18) (28,19)
  (29,19) (28,20) (29,20) (28,21) (29,21) (22,22) (23,22) (24,22) (28,22) (29,22)
  (22,23) (23,23) (24,23) (29,23) (22,24) (23,24) (29,24) (22,25)

Alle melden dasselbe: **Wert-SD 0,00 bei Luminanz 0,0** — reines, deckendes
Schwarz. Bei der Westterrasse liegen sie exakt auf der **Treppenkante** oben
rechts (je Zeile die letzte Pflicht-Zelle); beim Mittelpfeiler auf der **rechten
Schaftspalte** und der **kleinen Plattform links** samt Fuß.

### Warum das passiert — die Ursache, nicht das Symptom

Die Kette ist Chroma-Key → Freistellen → Maske als Alphakanal. Beim Freistellen
werden die gekeyten Punkte auf **Alpha 0 mit schwarzem RGB** gesetzt. Wenn danach
die Schablone das Alpha auf 255 **zwingt**, kommt genau dieses Schwarz zum
Vorschein. Es ist kein Malfehler — es ist **Alpha, das über ungemalte Bildpunkte
gezwungen wurde.**

Das ist dieselbe Klasse, die im Haus schon einmal teuer war: die Vorschau eines
Blattes lügt über transparente Flächen, weil RGB unter Alpha 0 gerendert wird.
Hier lügt sie in die andere Richtung.

### Was Runde 2 tut

1. **Male über die Maskenkante hinaus.** Das erzeugte Bild muss die
   Umgebungsrechteck-Fläche der Maske **vollständig überdecken**, mit Rand — dann
   hat die Schablone überall echte Malerei zum Ausschneiden und muss nichts
   erfinden. Bei einer Treppe heißt das: die Bücher laufen über die Stufenkante
   hinaus weiter, und erst die Maske schneidet die Treppe hinein.
2. **Nie Alpha über gekeyte Bildpunkte zwingen.** Wo nach dem Freistellen kein
   gemaltes RGB liegt, darf die Maske das Alpha nicht auf 255 setzen — dort fehlt
   Malerei, und die muss nachgemalt werden, nicht überdeckt.
3. **Prüfe je Zelle, bevor du lieferst.** Gesetz 4 nennt dir die Koordinaten. Ein
   Blatt geht erst raus, wenn `check-body-silhouette` für BEIDE Blätter grün ist.

## Zweiter Befund (Folge des ersten): der Mittelpfeiler verfehlt den Wert-Vertrag

Gemessen: Luminanz **17,4 %** (verlangt 30–38) · Sättigung **20,6 %** (verlangt
≥45) · rgb 55,43,31. Das ist kein eigener Fehler — **22 schwarze Zellen von 48**
ziehen den Mittelwert nach unten. Wenn die Deckung sitzt, miss neu; erst dann ist
zu entscheiden, ob zusätzlich aufgehellt werden muss. Zielwolke: rgb 120–128 ·
78–81 · 45–52, so wie die Ostmauer (34,0 % / 67,5 %).

⚠ Der Schaft des Pfeilers war in der Vorgängerrunde ausdrücklich gelobt („die
beste Materiallösung der gesamten Prüfung"). Behalte seine Machart.

## Dritter Befund, klein: die Naht von `l2_p2`

Mittel **5,34** ist besser als heute (7,60) — angenommen. Der **größte** Sprung
liegt aber bei **24,50** gegen heute 11,26, also eine einzelne Zeile mit
sichtbarem Bruch. **Bring den Maximalsprung unter 12**, ohne die drei
angenommenen Zahlen zu bewegen.

## Was gemeldet wird

Je Blatt in `SELBSTAUSKUNFT_N7A2B.md`: md5 · Blattmaß · Luminanz · Sättigung ·
Mittel-rgb · Kanten-Median · **die Ausgabe beider Tore im Wortlaut** · für
`l2_p2` zusätzlich Naht-Mittel und Naht-Maximum · und was du nicht prüfen
konntest.
