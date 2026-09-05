Stand: 2026-09-03 · N7A2c · Runde 2 (Fix-Runde, EIN Posten)

# N7A2c · DIE KREIDE-RUTSCHE WIRD GEMALT — die Westterrasse, ein Wurf

**Status: DOCUMENT** — Lieferung im Wegwerf-Worktree; kein Commit, kein Push,
keine Änderung an Produktionsdateien.

## Lieferung

- [body_p3_westterrasse_rutsche.png](body_p3_westterrasse_rutsche.png)
- Dieses Dokument: `docs/n6-auftrag/lieferung/SELBSTAUSKUNFT_N7A2C.md`

Das Blatt wurde als zusammenhängende Malerei mit dem eingebauten Bildmodell
erzeugt. Die Nachbereitung war technische Bildbearbeitung am Modellbild:
Skalierung auf das Vertragsmaß, anschließende exakte Übernahme der bereits
geprüften Runde‑1‑Alpha-Silhouette als Schablone und gleichmäßige
Wertkorrektur. Es wurden keine Bücher, Rampen, Linien oder Muster per Code
gezeichnet.

## Runde 2

Der eine bestellte Fix betrifft ausschließlich die fünf Kreide-Spuren an den
diagonalen Rampen. Sie sind jetzt fünf verschiedene lokale Abrieb-Ereignisse:
unterschiedlich lang, breit, dicht, verlaufend und hell. Das Material ist
matter, körniger Kreidestaub, in das Buchleinen eingerieben und an den Rändern
weich ausgefranst. Scharfe weiße Keile, Glanzlichter, Funken und wiederholte
Dekal-Formen wurden aus diesem Motiv entfernt.

Unverändert blieben Silhouette, Rampengeometrie, Trittstufen mit heller Fase
und Schattenkeil, Bücherverband sowie die Alpha-Grenze oberhalb der fünf
Diagonalen. Die Alpha-Schablone wurde erst nach der Modellmalerei aufgelegt,
damit die Kollision pixelgenau bleibt.

## Datei- und Messdaten

| Merkmal | Ergebnis |
|---|---:|
| Blattmaß | 1408 × 732 px |
| PNG | RGBA, nicht-interlaced |
| Dateigröße | 2 072 604 Bytes |
| MD5 | `68d85934da20ac1ca4349a78cdf032bb` |
| Mittlere Luminanz | 31,5 % (Vertrag 30–38 %, Ziel 34) |
| Mittlere Sättigung | 74,3 % (Vertrag ≥45 %) |
| Mittelwert RGB | 124, 72, 34 (Anker 115, 88, 52) |
| Kanten-Median ganzes Blatt | 45,9 % (Vertrag ≤80 %) |
| Steh-Zellen | 22 Stück; Median 41,2 %; schwächste 27,8 % |

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
Wert-Vertrag : Luminanz 31.5 % (30-38, Ziel 34) · Saettigung 74.3 % (>=45) · rgb 124,72,34 (Anker 115,88,52)
Gesetz 5     : Kanten-Median ganzes Blatt 45.9 %  (Decke 80; 76-84 => Mensch)
★ Steh-Zellen: 22 Stueck · Median 41.2 % · schwaechste 27.8 %   OK
Kanten-Dichte je Zelle (Zehntel):
    0  43435433423...........
    1  33455334463236........
    2  654665656546343.......
    3  44444443444444125.....
    4  54676555746655633245..
    5  4444454554454544613364
    6  33633346444235544531..
    7  33345554434445545446..
    8  33445654555444644446..
    9  44444434454543334434..
   10  34565657366554345554..
```

## Selbsteinschätzung nach CHECKLISTE_R6_KANON.md

1. **Benennbarkeit / Geologie — Ja.** Der Körper liest als abgetreppte,
   schwere Bücherböschung; Bücher, Papier, Einbände und Seitenblöcke tragen
   die Terrain-Familie.
2. **Silhouette — Ja.** Die finale Alpha-Silhouette folgt der gelieferten
   Schablone; das Silhouetten-Tor meldet alle fünf Gesetze grün.
3. **Laufkante — Ja.** Die Trittflächen sind ruhig und durchgehend; die fünf
   diagonalen Laufkanten bleiben als matte, unterschiedlich abgeriebene
   Kreidespuren lesbar.
4. **Unterseite / Flanke gemalt — Ja.** Flanken und Unterseite zeigen einzelne
   Buchrücken, Seitenkanten, Bindungen und Gewicht.
5. **Innen-Modulation — Ja.** Längen, Dicken, Farben, Fugen und Verschleiß sind
   lokal verschieden; der Kanten-Median von 45,9 % bleibt im Malereifeld.
6. **Verbindungs-Logik — Ja.** Trittflächen und Rampen wachsen aus den
   Buchlagen heraus; die Rampen haben sichtbare Bindungs-/Seitenübergänge und
   keine angesetzten Lego-Verbindungsstücke.
7. **Material = Spielrolle — Ja.** Glatte, ruhig schattierte Tritte markieren
   die begehbare Fläche; die fünf verschiedenen matten Kreideabriebe markieren
   die Rutschbahnen.
8. **Tiefen-Palette — Ja.** Warme und kühle Einbände trennen die Lagen; die
   tragenden Kanten und Schattenkeile tragen den stärksten Kontrast.
9. **Raum schließt materialgerecht — Ja.** Außerhalb der Maske ist die Fläche
   transparent; sichtbares Schwarz in einer Vorschau ist kein gemaltes Schwarz.
10. **Detail an Flanke und Unterseite — Ja.** Die Oberseite bleibt funktional
    ruhig; Geschichte sitzt an den Vertikalen.
11. **Gefahren-Deckung — Ja.** Jede Gefahr wird nur durch ihre eigene sichtbare
    diagonale Kreideform angekündigt; keine Spur liegt oberhalb ihrer Diagonale.
12. **Raum-Kohärenz — Ja.** Farbtemperatur, Buchmaterial und Malstruktur lesen
    neben Ostmauer und Mittelpfeiler als derselbe Kapitelraum.
13. **Eine orthografische Bodenebene — Ja.** `check-ground-plane` meldet
    Reichweite 91 % und Kipp 0,0°.

## Was nicht geprüft werden konnte

- Der tatsächliche Einbau in die laufende Spielszene und die Sichtprüfung im
  echten Spiel-Compositor wurden nicht ausgeführt.
- Es gab in dieser Codex-Session keinen unabhängigen frischen Blindleser; die
  Punkte 1–12 sind daher dokumentierte Selbsteinschätzung anhand der gelieferten
  Referenzen, nicht unabhängige Geschmacksabnahme.
- Die drei vorgeschriebenen lokalen PNG-Prüfungen decken Geometrie, Alpha,
  Wertstruktur, Kanten-Dichte und Bodenebene ab; sie beweisen nicht allein die
  erzählerische Materiallesbarkeit oder die Einzigartigkeit jeder Spur.
