Stand: 2026-09-02 · N7A2 · Runde 3

# SELBSTAUSKUNFT N7P3 · RUNDE 3 · LETZTE

Die drei Bodenblätter wurden je als ein neuer Ganzblatt-Bildwurf über die
gesamte jeweilige Maske erzeugt. Die Komposition, Silhouette, Palette und der
Wertvertrag von Runde 2 bleiben erhalten. Die Korn-/Noise-Ebene wurde nicht
verwendet; die Struktur kommt aus gezeichneten Buchrücken, Bindungen,
Seitenblöcken und wenigen langen Nähten mit ruhigen Flächen dazwischen.
Die drei Deckenbahnen wurden nicht angefasst.

## Gemessene Lieferung

Luminanz je sichtbarem Pixel: `0,2126R + 0,7152G + 0,0722B`, relativ zu 255.
Sättigung: HSV-Sättigung über sichtbare Pixel. Zell-SD und Kanten-Dichte werden
über die inneren 80 % jeder Pflichtzelle gemessen. Kanten-Dichte bedeutet hier:
Anteil der Pixel, deren lokaler zweidimensionaler Luminanzsprung größer als 12
Punkte ist; gemeldet wird der Median je Blatt. Band/Körper ist die mittlere
Luminanz der obersten 10 px aller Steh-Zellen geteilt durch die mittlere
Blattluminanz.

| Blatt | Maß | MD5 | mittlere Luminanz | Sättigung | kleinste Wert-SD | Band/Körper | Kanten-Dichte Median |
|---|---:|---|---:|---:|---:|---:|---:|
| `body_p3_westterrasse_rutsche.png` | 1408×732 | `f315e4de454c1de9507f78d215f0e750` | 34,91 % | 64,17 % | 3,76 | 1,44 | 26,0 % |
| `body_p3_mittelpfeiler.png` | 512×604 | `e1d533a0ee7197d34a5d5ee2324e6703` | 34,59 % | 57,69 % | 23,86 | 1,42 | 60,0 % |
| `body_p3_ostmauer_sims.png` | 1536×796 | `c6e3b7e04f2ddbd31f8fc8508e94cefe` | 34,92 % | 67,64 % | 9,94 | 1,41 | 36,3 % |

Alle drei Blätter liegen im Wertkorridor 30–38 %, nahe am Zielwert 34 %,
überschreiten 45 % Sättigung, haben strukturierte Pflichtzellen und liegen beim
Band/Körper-Vertrag über 1,3. Die Kanten-Dichte liegt bei allen drei Blättern
unter dem verbindlichen Grenzwert von 80 %.

## Kanoncheck · 13 Punkte

Für alle drei Bodenblätter: **1 Benennbarkeit — Ja**, Buchterrasse bzw.
Buchmauer klar lesbar; **2 Silhouette — Ja**, Pflichtzellen und freie Gebiete
maskengerecht; **3 Laufkante — Ja**, gerade und hell; **4 Unterseite/Flanke —
Ja**, Rücken, Schnitte und Seitenlagen tragen die Masse; **5 Innen-Modulation —
Ja**, keine flache Pflichtzelle; **6 Verbindungslogik — Ja**, die Buchlagen
wachsen im Verband; **7 Material = Spielrolle — Ja**, tragende Hofmaterie und
Laufflächen bleiben unterscheidbar; **8 Tiefen-Palette — Ja**, warme Papierkanten
gegen dunklere Rücken; **9 Raumabschluss — Ja**, Alpha nur in Körper und
zulässigem Übermalrand; **10 Flanke/Unterseite — Ja**, Detail sitzt an den
gezeichneten Formen, nicht als Overlay; **11 Gefahren-Deckung — Ja**, keine
Gefahrentinte; **12 Raum-Kohärenz — Ja**, gleiche Buch-/Papiergrammatik; **13
orthografische Bodenebene — Ja**, gerade Aufstandskanten, 91 % / 100 % / 100 %
Reichweite und jeweils 0,0° Kippung.

## Verifikation

- `check-body-silhouette.mjs`: alle drei p3-Bodenblätter bestanden, einschließlich
  Maskenkern, Alpha-Ehrlichkeit, Lauf-Linie, Kein-Loch-Gesetz und
  Kanten-Dichte-Gesetz.
- `check-ground-plane.mjs --sheet`: alle drei bestanden — 91 % / 100 % / 100 %
  Reichweite, jeweils 0,0° Kippung.
- Kanten-Dichte direkt am finalen PNG nach dem verbindlichen Verfahren gemessen:
  26,0 % / 60,0 % / 36,3 %.
- Alpha-Kontrolle: außerhalb der sichtbaren Körper `alpha=0` und RGB ebenfalls
  null; keine versteckte Farbe im verbotenen Gebiet.
- Deckenbahnen unverändert; angenommene MD5-Prüfsummen:
  `body_p3_deckenbahn_west.png` `760c4d4a0f4d0b9e6befa9d9b5fcc215`,
  `body_p3_deckenbahn_mitte.png` `1fef1c42a429448efe0d82a015903f0a`,
  `body_p3_deckenbahn_ost.png` `47b01bd83ffa282d037b853c596510a2`.
- Kein Commit und keine Codeänderung. Die automatische Bildwerkzeug-Ablage
  außerhalb des Worktrees blieb wegen verwalteter Dateisystemrechte bestehen;
  sie wurde nicht in die Lieferung übernommen. Ein Löschversuch endete mit
  `Operation not permitted`.

## Nicht geprüft

Die finale Nahtfreiheit in der laufenden Phaser-Szene, die tatsächliche
25-%-Montage im Spiel und Koki’s abschließende Geschmacksfreigabe in Normal- und
Gesamtansicht.

## How I verified

Die drei gelieferten Boden-PNGs wurden direkt aus `docs/n6-auftrag/lieferung/`
gelesen, visuell geprüft und mit den genannten Silhouetten-, Bodenebenen-,
Luminanz-, Sättigungs-, Zell-SD-, Band/Körper-, Alpha- und Kanten-Dichte-
Berechnungen verifiziert. Die drei Deckenbahnen wurden per MD5 gegen den
angenommenen Stand geprüft.
