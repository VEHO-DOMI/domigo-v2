# L2-P1v2 · Beweise (2026-09-05) — p1 v2 »Das Zoo-Tor« mit Signatur

## Was hier liegt

- **`l2p1v2_sonde.txt`** — das aufgenommene p1-Band (`ch02.proof.json`) gegen die echte `Sim` abgespielt, mit
  Takt-Protokoll: drei Griffe mit Haltung `hang` (Kanten (8,11) t 94 · (28,4) t 918 · (55,11) t 1743), Käfig befreit
  t 221 → Papagei-Bühne läuft t 222 (Kind bei c11) → fragt t 581 · Pinguin zurückgefärbt t 1201 → Buddy-Bühne läuft
  t 1202 → fragt t 1471 · Faust t 1813 · Tür t 1963 · Ausgang t 1964. Das ist der Beweis, dass die Bühnen NACH ihrem
  Auslöser laufen und das Kind daneben steht (Sonde: `REPORTS/L2P1V2-evidence-2026-09-05/stage-probe.mts`).
- **`l2p1v2_griff_aufstieg.png` / `l2p1v2_griff_dach.png`** (+ `.meta.json`) — zwei Frames aus dem abgespielten Band
  im Browser (`shoot-world.mjs --fight --band ch02.proof.json`, Dev-Server 3443): das Kind an der 7-Zeilen-Kassenmauer
  auf dem Weg zur Hangel-Feder (7,11), und die Landung auf dem Affenhaus-Dach.

## Was hier NICHT liegt, und warum

**Die Haltung `hang` selbst (Teile-Baukasten, `hand_grip`) ist in keinem Frame.** Vier Reihen wurden geschossen
(Warp neben die Mauer mit und ohne `--press right`; Band-Nachlauf ab Takt 88/148/170 in Kadenzen 6 und 2). Zwei
Gründe, beide gemessen: (1) der Band-Nachlauf im Browser hält an der Regelseite/dem Poster an (ZEREMONIEN-HALT:
`overlayOpen` ohne Karte) — deshalb wurde das Poster für die Aufnahme temporär aus dem Level genommen (danach
`git checkout`, md5 gleich); (2) selbst dann liegen die Browser-Takte gegen die Sim-Sonde verschoben und die
Verschiebung ist zwischen zwei Läufen nicht gleich — das Griff-Fenster (statisch gehalten, bis der zweite Sprung
kommt: 60 Takte im Pilot) wurde von keiner Reihe getroffen. Die Haltung ist deshalb an der **Sim** belegt
(`pose=hang`, dreimal), nicht am Bild. **Das Foto bleibt eine offene Schuld** — Kokis Walk sieht den Griff; ein
Werkzeug, das den Band-Nachlauf am Griff ANHÄLT (`hangAt !== null` als Halt-Bedingung), wäre der saubere Weg
(Antrag).

## Die Zahl, die dieses Exemplar trägt

Reach-Modell (an Mauern auf dem Boden gefahren, `reach-probe.mts`): ohne `hang` ≤ 4 Zeilen, mit `hang` ≤ 7 (8 rot).
Engine (Sonde #411): ohne 6, mit 8. **7 Zeilen = die einzige Höhe, die das Gesetz segnet UND den Griff erzwingt.**
Alle drei Griffe von p1 v2 sind 7 Zeilen hoch (vom Blindleser nachgezählt).
