# L0d · R263 · Der Held gehört allen Kapiteln — die Bilder

**Die eine Zeile, die zählt:** ch02 zeigt jetzt dieselbe Figur wie ch01.
Das Paar dazu ist `l0d_held_vergleich.png` — vier Zeilen, oben ch01 (vorher /
nachher, unverändert), unten ch02 (vorher / nachher, die Figur wechselt).

## Wie die Bilder entstanden sind

Zwei Bauten auf zwei eigenen Servern, gleichzeitig, mit **demselben Werkzeug**
(`scripts/shoot-world.mjs` inkl. der neuen `--chapter`-Flagge, in beide Bäume
kopiert — eine Messreihe mit zwei verschiedenen Instrumenten vergleicht die
Instrumente mit):

| Stand | Baum | Commit | Port |
|---|---|---|---|
| `vorher` | `domigo-v2-l0dbase` | `075ff1c2` (origin/main) | 3402 |
| `nachher` | `domigo-v2-l0d` | diese Bahn | 3401 |

Zwei Reihen je Kapitel und Stand, beide `--pure` (der Schuss kostet keine Ticks)
und beide mit **bestandenem Kamera-Handschlag** — der Beweis, dass die Kamera
lebt und nicht dreimal denselben Puffer liefert (P-66):

```
--phase p1 --chapter chNN --warp 5,8 --press up --settle 2 --shots 14 --every 4 --pure
--phase p1 --chapter chNN --press right --settle 8 --shots 6 --every 5 --pure
```

`--warp 5,8` ist in **beiden** Kapiteln dieselbe leere Luft über demselben Boden
(Zeile 18 ist in ch01 und ch02 der Hallenboden, Zeile 8 ist frei) — gleiche
Fallhöhe, gleiche Physik, also dieselbe Haltung zur selben Zeit nach dem Warp.

## Die vier Haltungen

Ausgewählt wurde **nach der gemessenen Haltung im Beipackzettel** (`hero.pose`),
nicht nach dem Augenmaß:

| Datei | Haltung | woher |
|---|---|---|
| `l0d_ruhe_*` | `stand` | Flug-Reihe, Bild 12 |
| `l0d_lauf_*` | `run` | Lauf-Reihe, Bild 1 |
| `l0d_flug_*` | `fall` | Flug-Reihe, Bild 4 |
| `l0d_landung_*` | erstes Bild mit Boden unter den Füßen | Flug-Reihe, Bild 9 (ch02 nachher: 8) |

Jede `.png` hat ihre `.meta.json` daneben: Takt, Haltung, Lage des Kindes, Lage
der Kamera, Leinwandmaß.

## Ehrliche Grenzen

- **Der Aufstieg (`hero2_jump`) ist nicht dabei.** Beim Betreten einer Phase
  liegt die Ziel-Karte oben und hält die Welt an; `--press jump` wird davon
  geschluckt, und das Werkzeug kann nach dem Schließen der Karte nicht noch
  einmal drücken. Der Flug ist deshalb ein **Fall**, kein Sprung. Gefiled.
- **Die Takte der Paare sind nicht bitgleich** (z. B. Ruhe ch01 nachher Takt 59
  gegen ch02 nachher Takt 74): das Schließen der Ziel-Karte kostet je Lauf
  unterschiedlich viele Ticks. Ein Bildpunkt-Vergleich zweier Läufe misst
  deshalb diesen Versatz mit und **nicht** die Figur — gemessen: auch das
  unveränderte ch01 unterscheidet sich zwischen zwei Läufen um 1,2–35 % der
  Bildpunkte. Die Bilder sind der Beweis für das AUGE.
- Der maschinelle Beweis liegt woanders und ist exakt:
  `apps/web/lib/paint-art.test.ts` misst, dass jedes Kapitel dieselben
  Helden-Adressen bekommt — und die Adresse trägt den Inhalts-Fingerabdruck des
  Blattes (`art-fingerprint.ts`), zwei gleiche Adressen sind also dasselbe BILD.
