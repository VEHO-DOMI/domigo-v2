# L2-M-a · Beweise (2026-09-05)

## Was hier NICHT liegt, und warum

Das Boot-Blatt bestellt Standbild-Paare vorher/nachher für Hangeln und Faust.
**Diese Bahn führt kein neues Bewegungs-Verb ein.** `hang` und `charge` kann die
Engine seit jeher (`player.ts#hangAt`, `fist.ts`); gebaut wurde, dass das
Erreichbarkeits-MODELL vom Hangeln erfährt. Es gibt also keine neue Haltung zu
fotografieren, und ein Vorher/Nachher derselben Räume wäre ein Bildpunkt-Vergleich
über zwei Läufe — die Klasse, vor der L0d ausdrücklich warnt (1,2–35 % Abweichung
an unverändertem ch01).

**Zwei Versuche, den Griff in ch02 p1 zu fotografieren, sind gescheitert** —
und zwar aus einem Grund, der selbst ein Befund ist: das Kind fällt an der Leiste
vorbei und LANDET auf ihr, statt sie zu greifen. ch02 p1 ist ein flacher
L0-Gerüstraum; die Hangel-Situation kommt darin gar nicht vor. Dieselbe Messung
sagt es unabhängig: die neue Kante bringt in allen sechs Kapiteln **null** neue
Knoten, weil die zweite Ebene erst L2-G2 schneidet. Nach zwei Anläufen an einem
Raum, der die Situation strukturell nicht enthält, ist der dritte kein Anlauf
mehr, sondern eine Behauptung.

## Was stattdessen hier liegt

**`l2ma_sonde.txt`** — der volle Lauf von `scripts/paint-probes/ch02.probe.mjs`
gegen die echte `Sim`. Er trägt die drei Zahlen der Bahn (Hangeln kauft 2 Zeilen ·
Griff hält 585 Takte ≈ 9,8 s · Absprung trägt 5,56 Spalten) UND die
Haltungs-Entscheidung, gemessen statt behauptet: **die Engine meldet am Griff die
Haltung `hang`**, und `rigSpec.ts#heroFullCell` gibt dafür `null` zurück — gezeichnet
wird der Teile-Baukasten, in dem der Griff sein eigenes Blatt hat (`hand_grip`).
Der Haar-Rotor ist dabei nicht sichtbar (`rig.ts` versteckt ihn per Vorgabe, nur
`case "hover"` schaltet ihn an); ein fehlender Rotor ist kein Befund.

**`l2ma_ch02p1_fall.png` / `l2ma_ch02p1_landung.png`** — zwei Bilder aus der
Reihe, die der Versuch erzeugt hat. Sie zeigen nicht das Hangeln, sondern etwas
anderes Nützliches: dass ch02 p1 nach dem Motor-Umbau unverändert rendert, mit
der richtigen Figur (Fall- und Landungs-Zelle der `hero2`-Reihe). Beipackzettel
je Bild daneben.

## Wer das Bild schuldet

Die A-Bahn oder L2-G2 — sobald ein Raum ein Gitter hat, das man hangeln MUSS.
Dann ist das Bild eine Aussage; heute wäre es eine Inszenierung.
