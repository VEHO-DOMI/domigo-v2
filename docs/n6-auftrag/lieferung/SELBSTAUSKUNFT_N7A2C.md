# N7A2c · DIE KREIDE-RUTSCHE WIRD GEMALT — die Westterrasse, ein Wurf

**Status: DOCUMENT** — Lieferung im Wegwerf-Worktree; kein Commit, kein Push,
keine Änderung an Produktionsdateien.

## Lieferung

- [body_p3_westterrasse_rutsche.png](body_p3_westterrasse_rutsche.png)
- Dieses Dokument: `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7A2C.md`

Das Blatt wurde als zusammenhängende Malerei mit dem eingebauten Bildmodell
erzeugt. Die Nachbereitung war ausschließlich technische Bildbearbeitung am
Modellbild: expliziter Chroma-Key, Skalierung auf das Vertragsmaß, exakte
Alpha-Freistellung über die sichtbaren Farben der gelieferten Schablone,
unteres Übermalmaß von 16 px und eine gleichmäßige Wertkorrektur von 1,18.
Es wurden keine Bücher, Rampen, Linien oder Muster per Code gezeichnet.

Der finale Modellauftrag verlangte eine vollständig bemalte, orthografische
Bücherböschung mit individuellen Buchrücken und Seitenblöcken, sechs ruhigen
Trittflächen, fünf voneinander verschiedenen diagonalen Kreide-Rutschen,
keinen sichtbaren Wiederholungsrhythmus und vollständige Rechteckdeckung vor
der Maskierung. Die Ostmauer und der Mittelpfeiler dienten als
Materialreferenzen.

## Datei- und Messdaten

| Merkmal | Ergebnis |
|---|---:|
| Blattmaß | 1408 × 732 px |
| PNG | RGBA, nicht-interlaced |
| Dateigröße | 2 289 478 Bytes |
| MD5 | `3fb53716d4926d1aad627b986ecb3280` |
| Mittlere Luminanz | 33,5 % (Vertrag 30–38 %, Ziel 34 %) |
| Mittlere Sättigung | 66,2 % (Vertrag ≥45 %) |
| Mittelwert RGB | 125, 78, 44 (Anker 115, 88, 52) |
| Kanten-Median ganzes Blatt | 52,6 % (Vertrag ≤80 %) |
| Steh-Zellen | 22 Stück; Median 47,9 %; schwächste 38,3 % |

## Vorgeschriebene Prüfungen

Alle drei Befehle wurden am finalen PNG ausgeführt; alle drei endeten mit
Exit-Code 0.

### `check-body-silhouette`

```text
✓ p3_westterrasse_rutsche (194 Zellen): alle fuenf Gesetze halten
```

### `check-ground-plane`

```text
✓ docs/n6-auftrag/lieferung/body_p3_westterrasse_rutsche.png: Reichweite 91 % · Kipp 0.0°
```

### `mess-koerper.cjs`

```text
Blatt        : docs/n6-auftrag/lieferung/body_p3_westterrasse_rutsche.png
Koerper      : p3_westterrasse_rutsche  (Maske aus visualBodies.ts: 11 Zeilen x 22 Spalten, 199 Mess-Zellen, davon 5 Schraegen)
Mass         : 1408x732   OK
Wert-Vertrag : Luminanz 33.5 % (30-38, Ziel 34) · Saettigung 66.2 % (>=45) · rgb 125,78,44 (Anker 115,88,52)
Gesetz 5     : Kanten-Median ganzes Blatt 52.6 %  (Decke 80; 76-84 => Mensch)
★ Steh-Zellen: 22 Stueck · Median 47.9 % · schwaechste 38.3 %   OK
Kanten-Dichte je Zelle (Zehntel):
    0  44445443564...........
    1  44556554566554........
    2  664775656657764.......
    3  44554444444453645.....
    4  63786656755665774446..
    5  4444444444444445555446
    6  55744568666547766774..
    7  44445445544544554547..
    8  55555786657755775556..
    9  43334433444343334333..
   10  46776478668576566667..
```

## Selbsteinschätzung nach CHECKLISTE_R6_KANON.md

1. **Benennbarkeit / Geologie — Ja.** Der Körper liest als abgetreppte,
   schwere Bücherböschung; Bücher, Papier, Einbände und Seitenblöcke tragen
   die Terrain-Familie.
2. **Silhouette — Ja.** Die finale Alpha-Silhouette folgt der gelieferten
   Schablone; das Silhouetten-Tor meldet alle fünf Gesetze grün.
3. **Laufkante — Ja.** Die Trittflächen sind ruhig und durchgehend; die fünf
   diagonalen Laufkanten sind als helle Kreidespuren sichtbar.
4. **Unterseite / Flanke gemalt — Ja.** Flanken und Unterseite zeigen einzelne
   Buchrücken, Seitenkanten, Bindungen und Gewicht.
5. **Innen-Modulation — Ja.** Längen, Dicken, Farben, Fugen und Verschleiß sind
   lokal verschieden; der Kanten-Median von 52,6 % bleibt im Malereifeld.
6. **Verbindungs-Logik — Ja.** Trittflächen und Rampen wachsen aus den
   Buchlagen heraus; die Rampen haben sichtbare Bindungs-/Seitenübergänge und
   keine angesetzten Lego-Verbindungsstücke.
7. **Material = Spielrolle — Ja.** Glatte, ruhig schattierte Tritte markieren
   die begehbare Fläche; die kreideweißen Diagonalen markieren die Rutschbahn.
8. **Tiefen-Palette — Ja.** Warme und kühle Einbände trennen die Lagen; die
   hellen Tritt- und Kreidekanten tragen den stärksten Kontrast.
9. **Raum schließt materialgerecht — Ja.** Außerhalb der Maske ist die Fläche
   transparent; sichtbares Schwarz in einer Vorschau ist kein gemaltes Schwarz.
10. **Detail an Flanke und Unterseite — Ja.** Die Trittflächen bleiben
    funktional ruhig; Faserung, Abrieb, Risse und Bindungsdetails sitzen vor
    allem an Flanken und Unterseiten.
11. **Gefahren-Deckung — Ja.** Jede Gefahr wird nur durch ihre eigene, sichtbare
    diagonale Kreideform angekündigt; die fünf Rampen sind verschieden.
12. **Raum-Kohärenz — Ja.** Farbtemperatur, Buchmaterial und Malstruktur lesen
    neben Ostmauer und Mittelpfeiler als derselbe Kapitelraum.
13. **Eine orthografische Bodenebene — Ja.** `check-ground-plane` meldet
    Reichweite 91 % und Kipp 0,0°.

## Was nicht geprüft werden konnte

- Der tatsächliche Einbau in die laufende Spielszene und die Sichtprüfung im
  echten Spiel-Compositor wurden nicht ausgeführt.
- Es gab in dieser Codex-Session keinen unabhängigen frischen Blindleser; die
  Punkte 1–12 sind daher eine dokumentierte Selbsteinschätzung anhand der
  gelieferten Referenzen, nicht eine unabhängige Geschmacksabnahme.
- Die drei vorgeschriebenen lokalen PNG-Prüfungen decken Geometrie, Alpha,
  Wertstruktur, Kanten-Dichte und Bodenebene ab; sie beweisen nicht allein die
  erzählerische Materiallesbarkeit.

