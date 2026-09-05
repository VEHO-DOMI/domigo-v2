# ch03 „Das Piratenschiff" — Dossier-Ordner (Kapitel-Kanon)

Unit `g1-u03` · Modalität **Takelage-Läufe** · Währung **Goldmünzen** (`collectSkin: "coin"`) ·
Klassenkind **Ilvy** (Brig, p2, on-path) · Wächterin **Die Galionsfigur** (Tier M) ·
Licht: Hafendämmerung, Laternengold auf Tiefsee-Navy — das erste dunklere Level.

## Stand

**L3-G1 (diese Bahn):** p1 „Der Hafen der Tintensee" ist komplett gebaut und maschinell geprüft;
p2, p3, das Achterdeck und der Segelraum stehen als gesetzestreue Gerüste. Alle Wesen rendern als
graue Boxen — Kunst ist nicht Teil dieses Programms. Kokis Walk durch p1 ist das Tor, hinter dem
die G2-Bahn die vier anderen Räume füllt.

## Kanon, der für alle fünf Räume gilt

- **26 Zeilen** für Feld-Räume (R243), TALL-Räume behalten ihre Höhe: p1 64×26 · p2 72×26 ·
  p3 56×30 · Achterdeck 36×20 · Segelraum 44×20.
- **Ein-Tempo 2,25 px/t** bleibt; Sprung-Steighöhe 4 Zeilen, waagrechte Weite abhängig vom freien
  Himmel über dem Absprung.
- **Der Ring ist die Gabe dieses Kapitels.** ch03 ist das erste Kapitel überhaupt, das den
  Ring-Glyph `o` und ein `powerup`-Wesen ausliefert — Kapitel 1 trägt von beidem null.
- **Anker sind still** (`checkpointStyle: "silent"`): sie banken und sagen nichts.
- **Genau ein Anker je gekreuztem Tinten-Band.** p1 kreuzt zwei und trägt deshalb zwei.
- **Ein-Stück-Gesetz (R236):** jede Baugruppe wird so geschnitten, dass sie später EIN gemaltes
  Element sein kann — keine Lego-Fugen einplanen.
- **Cloak:** der Verursacher heißt vor Kapitel 15 nur „der Tinten-Schatten"; keine Zettel-Signatur.

## Abdeckung

Die maschinenlesbare Zuordnung steht in `claims.json`. Gemessen: die Wortbank `g1-u03` trägt
**42 Einträge, davon 20 mit `kind: "wordfile"`** — und nur diese 20 prüft das Tor. Von ihnen
zeigt der gebaute Raum eines als Ding (`leg`, das graue Holzbein am Pier); die anderen 19
(Körperteile und Größen-Adjektive) sind ein Vertrag an die T-Bahn.

## Befunde

| D | Befund |
|---|---|
| D-830 | Kokis Riff-Vokabeln „cook", „sea", „treasure" und Ilvys „hat" sind KEINE u03-Vokabeln (gezählt an `vocab.json` und `wordbank.json`); das Lexikon entscheidet an der Quelle, die T-Bahn misst am Buch. |

Weitere Funde dieser Bahn stehen im PR-Report; D-Nummern vergibt der Level-Architekt.
