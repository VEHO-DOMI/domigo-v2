Stand: 2026-09-02 · N7A2 · Moebel · Runde 1

# CODEX DRAFT — NOT CANON

Status: DOCUMENT (`docs/n6-auftrag/lieferung/`). Runde 2: ausschließlich
`plat_column2_1.png` neu geworfen; `plat_plank_2.png` und
`ledge_windowsill.png` sind angenommen und unverändert. Kein Commit, kein
Code und keine Datei außerhalb des Lieferordners wurde von Codex angelegt oder
geändert.

## Prüfumfang und harte Messwerte

- Die drei abgenommenen Formvorbilder wurden vor dem Wurf geöffnet: `terrain_reading_bench_p1.png`, `terrain_book_shelf_p1.png` und `terrain_book_folio_p1.png`.
- Alle drei Lieferbilder sind 8-Bit-RGBA-PNGs mit Alpha-Silhouette.
- Die Breiten sind exakt die verlangte Zellbreite: 4 × 64 = 256 px, 2 × 64 = 128 px und 1 × 64 = 64 px.
- `check-ground-plane --selftest`: **bestanden** — 1 sauberes Blatt und 3 absichtlich manipulierte Fehlerfälle wurden erkannt; zusätzlich 1 saubere und 2 manipulierte Duldungszeilen.
- Der Einzelblatt-Check meldet: Bohle **100 % / 0,0°**, Fensterbank **87 % / 0,0°**, Poller **84 % / 0,0°**. Damit liegen alle drei über 80 % Reichweite und unter 3° Kippung.
- Die Wert-Streuung wurde in jeder belegten 64 × 64-Zelle gegen den Luminanzwert gemessen. Niedrigster Wert je Blatt: Bohle **11,52**, Fensterbank **15,09**, Poller **45,58**; alle liegen über dem geforderten Minimum 4.
- Die Bilder wurden mit dem eingebauten Bildgenerator als Raster-Entwürfe erzeugt und anschließend auf Alpha-Silhouette, Zielmaß und Zuschnitt normalisiert. Bei der Bohle wurde zusätzlich eine schmale, texturierte gepresste-Seiten-Unterseite ergänzt, damit die maschinell geforderte tragende Unterkante über die volle Breite durchläuft. Die Endprodukte liegen ausschließlich hier im Lieferordner.

## 1. `plat_plank_2.png`

- Blattmaß: **256 × 80 px**, RGBA.
- MD5: `49f9a1192a2284e54ff0bc1f96f96d20`
- Alpha-Bounding-Box: `(2, 4)–(253, 75)`; Objekt-Höhe 72 px bei rund 8 px Gesamtrand.
- Unterkante: **Reichweite 100 %, Kippung 0,0°**.
- Struktur: belegte 64er-Zellen mit Wert-SD **62,72 / 24,52 / 43,56 / 11,52 / 39,18 / 16,96 / 52,99 / 31,99**; keine belegte Zelle ist flach.

1. Benennbarkeit / Geologie — **Erfüllt.** Eine lange, wettergegerbte Bohle aus gepressten Seiten mit zwei deutlich sichtbaren, tragenden Bücherstapeln; kein Gartenholz.
2. Silhouette — **Erfüllt.** Geschlossener, breiter Bohlenkörper mit zwei kompakten Trägern und gerader tragender Unterseite; kein V-Sockel.
3. Laufkante — **Erfüllt.** Die obere Bohlenfläche ist ruhig, durchgehend und waagrecht.
4. Unterseite / Flanke gemalt — **Erfüllt.** Seitenlagen, Fasern, Witterungsspuren, dunkle Unterseite und die Buchstapel geben dem Körper Gewicht.
5. Innen-Modulation — **Erfüllt.** Weiche Licht-/Schattenmodellierung und unregelmäßige lokale Papierereignisse; keine erkennbare Kachelperiode.
6. Verbindungs-Logik — **Erfüllt.** Die Bohle liegt sichtbar auf den beiden Stapeln; Auflager und farbiger Kontaktschatten markieren die Lastübertragung.
7. Material = Spielrolle — **Erfüllt.** Die feste Bohle ist die Lauffläche, die schweren Stapel sind sichtbar tragend.
8. Tiefen-Palette — **Erfüllt.** Warme Sandstein-, Ocker-, Papier- und Lederwerte trennen Oberseite, Flanke und Tiefe; die tragende Unterkante ist kontraststark.
9. Raum schließt materialgerecht — **Erfüllt.** Alpha-Rand ohne Außenboden; die schmale Unterseite ist als gepresste Seitenlage gemalt, nicht als Schattenauslauf.
10. Detail an Flanke und Unterseite — **Erfüllt.** Geschichte sitzt in Seitenlagen, Abrieb, Fugen und Stapelrücken; die Lauffläche bleibt funktional ruhig.
11. Gefahren-Deckung — **Erfüllt.** Keine Gefahrform und kein zusätzliches Dekor, das eine zweite begehbare Fläche vortäuscht.
12. Raum-Kohärenz — **Erfüllt.** Warme Tagespalette und Buch-/Papiergrammatik passen zum Kapitel; die Hof-Bohle bleibt als eigenes Motiv von Bank, Bündel und Regal unterscheidbar.
13. Eine orthografische Bodenebene — **Maschinell erfüllt.** Gerade waagrechte Aufstandskante über 100 %, Kippung 0,0°.

## 2. `ledge_windowsill.png`

- Blattmaß: **128 × 72 px**, RGBA.
- MD5: `1b2004790b5147fe7b149a93bd1b4b48`
- Alpha-Bounding-Box: `(2, 4)–(125, 67)`; Objekt-Höhe 64 px bei rund 8 px Gesamtrand.
- Unterkante: **Reichweite 87 %, Kippung 0,0°**.
- Struktur: belegte 64er-Zellen mit Wert-SD **56,94 / 16,36 / 48,14 / 15,09**; keine belegte Zelle ist flach.

1. Benennbarkeit / Geologie — **Erfüllt.** Eine kräftige Fensterbank-Sohlbank aus Sandstein-Papier mit vorspringender Tropfkante; sie liest nicht als Bank oder Regal.
2. Silhouette — **Erfüllt.** Geschlossene, kompakte Architekturform mit eigenem Simsprofil und ohne Perspektiv-Sockel.
3. Laufkante — **Erfüllt.** Die obere Sohlbank ist glatt, ruhig und waagrecht; die Tropfkante ist eine echte Formänderung an der Flanke.
4. Unterseite / Flanke gemalt — **Erfüllt.** Vorsprung, Schattenfuge und geschichtete Sandstein-Papier-Flanke beweisen Dicke und Richtung.
5. Innen-Modulation — **Erfüllt.** Unregelmäßige Papierfasern, Abrieb und weiche Wertformen; keine periodische Kachelung.
6. Verbindungs-Logik — **Erfüllt.** Deckfläche, Flanke und Tropfkante sind als gefaltete bzw. aufgelagerte Papier-/Sohlbank-Schichten verbunden.
7. Material = Spielrolle — **Erfüllt.** Die massive Sohlbank wirkt tragend; die Tropfkante markiert den Schutz- und Zustandswechsel des Materials.
8. Tiefen-Palette — **Erfüllt.** Helle Sandstein-Papieroberseite gegen warme, dunklere Flanke und Kontaktfuge; keine schwarze Kontur.
9. Raum schließt materialgerecht — **Erfüllt.** Transparenter Rand, kein Wandhintergrund und kein künstlicher Außenboden.
10. Detail an Flanke und Unterseite — **Erfüllt.** Tropfkante, Fugen, Chips und Seitenlagen sitzen an der Flanke; die Oberseite bleibt begehbar lesbar.
11. Gefahren-Deckung — **Erfüllt.** Keine Gefahrform und kein Dekor, das zusätzliche Begehbarkeit vortäuscht.
12. Raum-Kohärenz — **Erfüllt.** Gleiche warme Hof-/Buchmaterialwelt und gleiche orthografische Bodenebene; das Simsprofil ist ein eigenes Hofmotiv.
13. Eine orthografische Bodenebene — **Maschinell erfüllt.** Gerade waagrechte Aufstandskante über 87 %, Kippung 0,0°; damit über dem 80-%-Tor.

## 3. `plat_column2_1.png` — Runde 2

- Blattmaß: **64 × 72 px**, RGBA.
- MD5: `d0f339a2ced080b323537d183262c3bd`
- Alpha-Bounding-Box: `(4, 4)–(59, 67)`; Objekt-Höhe 64 px bei rund 8 px Gesamtrand.
- Unterkante: **Reichweite 84 %, Kippung 0,0°**.
- Größte opake Spannweite: **56 px**; erste Zeile mit mindestens 90 % davon: **y=6, 54 px** — die obere Lauffläche wird damit früh erkannt, nicht am unteren Ende.
- Spannweiten-Profil je Zeilenbereich: **y4=36, y5=48, y6=54, y7–14=56, y15=53, y16=52, y17–23=51, y24–31=50, y32–40=49, y41–60=48, y61–67=47 px**. Nach dem Kapitell verjüngt sich der Körper bis zur geraden Unterkante; kein Fuß ist breiter als der Kopf.
- Struktur: belegte 64er-Zellen mit Wert-SD **56,07** (y0–63) und **47,23** (y64–71); keine belegte Zelle ist flach.

1. Benennbarkeit / Geologie — **Erfüllt.** Kurzer, gedrungener Hof-Poller aus aufgerolltem Papier mit gebundenem Kopf; nicht Baum, Holzpfosten oder generische Säule.
2. Silhouette — **Erfüllt.** Geschlossene schwebende Silhouette; das Kapitell oben ist die breiteste Stelle, der Schaft verjüngt sich bis zur Unterkante, ein breiter Fuß ist entfernt.
3. Laufkante — **Erfüllt.** Das breite obere Kapitell bildet die ruhige, waagrechte Lauffläche; die untere Kante ist ebenfalls gerade.
4. Unterseite / Flanke gemalt — **Erfüllt.** Rollschichten, Binderinge, Abrieb und die schmaler werdende Flanke geben dem schwebenden Körper Richtung und Materialgewicht.
5. Innen-Modulation — **Erfüllt.** Große weiche Papierwertformen plus lokale Fasern und Verschleißereignisse; keine erkennbare Periode.
6. Verbindungs-Logik — **Erfüllt.** Der gebundene Kopf umschließt den Rollkörper; die Papierlagen wachsen als Kragen in den verjüngten Schaft.
7. Material = Spielrolle — **Erfüllt.** Das breite Kapitell erklärt die begehbare obere Plattform; der nach unten enger werdende Rollkörper liest als schwebendes, befestigtes Hofobjekt.
8. Tiefen-Palette — **Erfüllt.** Warmes Papiergold, Sandstein und farbige Schatten trennen Kopf, Rollkörper und Fuß.
9. Raum schließt materialgerecht — **Erfüllt.** Alpha-Rand ohne Halo, Bodenfläche oder künstlichen Schatten außerhalb des Körpers.
10. Detail an Flanke und Unterseite — **Erfüllt.** Die Bindung, Rollfugen und Papierabrisse sitzen an der Flanke; der schmale gerade Abschluss bleibt als Unterkante lesbar.
11. Gefahren-Deckung — **Erfüllt.** Keine zusätzliche Fläche und keine falsche Begehbarkeitsmarkierung.
12. Raum-Kohärenz — **Erfüllt.** Gleiche warme Papier-/Buchgrammatik und gleiche orthografische Bodenebene; die vertikale Rollenform ist ein eigenständiges Hofobjekt.
13. Eine orthografische Bodenebene — **Maschinell erfüllt.** Gerade waagrechte Unterkante über 84 %, Kippung 0,0°; die Maschine erreicht die Kontaktlinie nun früh genug unter der Lauffläche.

## Nicht geprüft / offene Abnahme

- Nicht geprüft wurde die spätere Einbettung in den laufenden Spielaufbau: Montageposition, Kollisionsfläche, tatsächlicher Kinder-Fußkontakt und Verhalten in der Zielszene.
- Nicht unabhängig blind bewertet wurde die ästhetische Abnahme durch eine zweite Person. Die Bilder wurden von Codex in Normalgröße geprüft; zusätzlich wurden die Messwerte auf dem vollständigen PNG ausgeführt.
- Die Kanonpunkte 1–12 sind ehrliche Selbstbewertungen und keine unabhängige menschliche Geschmacksfreigabe.
- Nicht geprüft wurde eine vollständige Kapitel-Abnahme aller bereits vorhandenen Körper; geprüft wurden hier nur die drei bestellten Lieferbilder sowie der benannte Bodenprüfer-Selbsttest.
