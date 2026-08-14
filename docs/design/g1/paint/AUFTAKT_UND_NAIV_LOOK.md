# DER NAIVE LOOK UND DIE TAKT-GRAMMATIK DES AUFTAKTS

**Status:** LEBEND — wächst mit der J1-Runde (R5-Welle 2).
**Für wen:** den Architekten. Wer hiermit einen zweiten Kapitel-Auftakt baut, soll
nicht raten müssen. Ein Screenshot beantwortet »sieht es so aus?«; dieses Dokument
beantwortet »warum diese Zahl und keine andere?«.

**Herkunft:** Koki hat die Richtung an Bildern entschieden, nicht an Adjektiven
(doc 45 §G2, 2026-08-13): drei Muster derselben Karte, Variante 2 »naiv« gewinnt —
»schief gesetzt, Wachsmalstift-Kanten, gestrichelte Innenlinie, dickere Knöpfe«.
Die Belege liegen lokal in `docs/Rayman X DomiGo Screenshots/I1b Naiv-Varianten
2026-08-13/` (CP-15: Ansichtsmaterial, nie Vorlage zum Abmalen).

---

## §1 · Der Look als REGELWERK

Alle Werte stehen als Custom Properties (benannte Zahlen, die CSS an einer Stelle
setzt und an vielen liest) **im Regelblock `.pb-card`** — Datei
`packages/game-paint/src/cards/overlay-css.ts`.

### Warum auf der Karte und nicht auf `:root`

Das ist keine Stilfrage, sondern **die Scope-Wand als Mechanik**. Alles, was diesen
Look trägt — Chip, Innenlinie, Bildtafel, Siegel, Schlüsselstrich — ist ein
Nachfahre von `.pb-card`. Was nicht in diesem Baum steht, **kann den Look nicht
erben**: die HUD-Leiste sitzt außerhalb des Schleiers, die Plattform außerhalb des
Spiels. Doc 45 §G2 vertagt die Plattform ausdrücklich auf eine eigene Runde — und
diese Vertagung kostet dank der Kaskade keine Disziplin. Ein `:root`-Block wäre ein
Leck, das auf die Hub-Runde wartet.

Ein Test hält beide Hälften: die Karte muss die Knöpfe deklarieren UND lesen, und
**kein Knopf darf ein zweites Mal außerhalb der Karte deklariert sein**.

### Die Knöpfe, mit Begründung

| Knopf | Wert | Warum dieser Wert |
|---|---|---|
| `--pb-paper` | `#fff2cd` | Das Blatt, aus dem die Karte gerissen ist. Wärmer und heller als der Bestand (`#ffeec4`): das gewählte Muster verschiebt das Papier Richtung Buttermilch, weil kräftigeres Papier gegen die dicke Tinte grau wirkt. Die sechs Verlaufsschichten darüber bleiben unangetastet — sie sind der Grund, warum die Fläche als Papier liest und nicht als Farbfeld, und sie waren im beurteilten Bild sichtbar. |
| `--pb-paper-lit` | `#fffaea` | Dasselbe Blatt, eine Stufe heller: ein Chip ist kein anderes Material, er ist dieselbe Seite, die höher liegt. |
| `--pb-seal` | `#ffd98a` | Das Wachssiegel in der Ecke. Als einzige Fläche satter als das Papier, sonst ist es kein Siegel, sondern ein Fleck. |
| `--pb-ink` | `#6b3f18` | Jede gezogene Kante der Familie. Deutlich dunkler als der Bestand (`#8a5a2b`) — Wachsmalstift drückt, Fineliner nicht. |
| `--pb-ink-cast` | `rgba(107,63,24,0.9)` | Derselbe Stift als **harter** Schlagschatten. Hart, nicht weich: ein weicher Schatten ist eine Lichtsimulation, ein harter ist ein zweiter Strich. |
| `--pb-ink-line` | `rgba(107,63,24,0.45)` | Derselbe Stift auf Flüsterstärke: die gestrichelte Innenlinie und die leise Kante des »Später«-Knopfes. |
| `--pb-ink-w` | `4px` | Kartenkante und Tafelkante. Bei 3 px liest die Kante als Rahmen, ab 4 px als Strich. Darüber frisst sie auf schmalen Fenstern Textbreite. |
| `--pb-ink-w-chip` | `3px` | Ein Chip ist kleiner, also ist sein Strich eine Stufe dünner — sonst ist der Chip nur noch Kante. |
| `--pb-text` | `#3a2410` | Die markierte Zeile. Fast schwarz-braun, weil sie das Einzige ist, was ein Kind entziffern MUSS. |
| `--pb-accent` / `--pb-accent-lit` | `#b0461a` / `#d66a2a` | Das englische Wort und die zwei Enden des Kreidestrichs. Warm und satt, damit die Lektion das Wärmste auf der Karte ist und nicht das Kleinste. |
| `--pb-quiet-ink` | `#7a5c33` | Die Ebene, die zurücktritt. Nicht versteckt (ein Erstleser braucht sein Deutsch), nur nicht mehr im Wettbewerb. |
| `--pb-card-r` | `26px 14px 30px 16px / 16px 30px 14px 26px` | Acht Werte statt einem: **jede Ecke anders**. Eine gerissene Buchseite hat keine vier gleichen Ecken. Die Spanne 14–30 px ist der Punkt, an dem der Unterschied bei Kartengröße sichtbar wird, ohne dass die Karte als Klecks liest. |
| `--pb-card-r-in` | `22px 12px 26px 14px / 14px 26px 12px 22px` | Die Innenlinie folgt der Außenkante um ~4 px versetzt — eine von Hand nachgezogene Linie läuft nicht parallel, aber sie läuft mit. |
| `--pb-chip-r` | `18px 9px 20px 11px / 11px 20px 9px 18px` | Dieselbe Regel eine Größe kleiner. |
| `--pb-card-tilt` | `-1.1deg` | **Die Neigung, und die einzige Zahl mit einem gemessenen Deckel.** Ein Buch wird schief hingelegt; ein Dialogfeld nicht. Darüber wird die Textzeile spürbar schief und ein Erstleser verliert die Zeilenführung. Und sie kostet Platz: der gedrehte Kasten wächst um Höhe × sin(α) in der Breite. Bei 375 px sind das 4,3 px von 14 px Luft — gemessen, siehe §4. |
| `--pb-plate-tilt` | `1deg` | Gegenläufig zur Karte, damit die Bildtafel nicht wie mitgedruckt wirkt, sondern wie aufgeklebt. |
| `--pb-stamp-tilt` | `-11deg` | Ein Siegel wird gestempelt, nicht gesetzt. Netto −10° gegen den Raum, weil der Rahmen darunter +1° trägt — ein Grad unter der Wahrnehmungsschwelle, und ausdrücklich NICHT mit einem fünften Knopf »korrigiert«. |
| `--pb-key-tilt` | `-1.6deg` | Der Kreidestrich unter der Schlüsselzeile. Schiefer als die Karte, weil er nachträglich per Hand gezogen wurde. |

### Vier Werte, die bewusst KEIN Knopf sind

Ein Knopf für eine Zahl, die niemand nachstellt, ist ein zweiter Name für dasselbe.
Literal bleiben: die 4 px Chip-Lippe · die 2,5 px Strichstärke der Innenlinie · die
6 px Höhe des Kreidestrichs · die 0,2 px Sperrung der Schlüsselzeile. Ebenso bleiben
die Schatten-**Listen** literal: ein Knopf, dessen Wert eine ganze Schattenliste ist,
ist nicht besser editierbar als die Regel selbst.

`--pb-tilt` (die vier Chip-Winkel, R5-W1 · D2) ist **schon** ein Knopf und wurde
nicht umbenannt — vier Fundstellen, null Gewinn.

### Was »eingearbeitet statt kopiert« konkret heißt

Das Wegwerf-Stylesheet lag per Dokumentreihenfolge über dem Bestand. Es hat vier
Nähte hinterlassen, die kein Standbild zeigt:

1. **Die Landung überschreibt `transform` vollständig.** Ohne die Neigung IN beiden
   Keyframes fliegt die Karte gerade herein und ruckt in den letzten Bildern schief.
   Ein Test liest die Keyframes und verlangt die Neigung in jedem.
2. **Die umgeschlagene Ecke trug eine feste 20-px-Rundung** gegen eine jetzt
   30-px-Kartenecke — ein 20-px-Blatt auf einer 30-px-Ecke löst sich sichtbar ab.
   Sie erbt jetzt (`inherit`) und kann nie wieder auseinanderlaufen.
3. **Der Chip-Druck war 2 px gegen eine 3-px-Lippe.** Die Lippe ist jetzt 4 px, also
   ist der Druck 4 px — sonst schwebt der gedrückte Chip auf halbem Schatten. Das
   Muster hat `:active` nie angefasst; niemand fotografiert einen gehaltenen Finger.
4. **Die Neigung sitzt auf `.pb-plate-wrap`, nicht auf `.pb-plate`.** Das Muster
   drehte die Tafel allein — und schob damit das Siegel von der Ecke, in die es
   gedrückt ist. Der Rahmen existiert genau dafür (sein eigener Kommentar sagt es).

### Eine bewusste Nicht-Übernahme

`font-size: 18px` auf Chips wurde **nicht** gebaut. Fast jeder Chip setzt seine
Größe inline, und Inline schlägt Stylesheet — die Regel hätte nur die drei Knöpfe
der Regel-Seite getroffen und ausgerechnet dort eine Ausnahme geschaffen. Wer die
Chips wirklich größer will, ändert `cardBtn` in `CardShell.tsx`; das ist eine
Lesbarkeits-Entscheidung und gehört nicht in einen Look-Knopf.

---

## §2 · Was ausdrücklich NICHT naiv wird

**Das Gesetz: Lesbarkeit schlägt Look.** Naiv ist, was ein Kind ANSIEHT. Was ein
Kind ENTZIFFERN muss, bleibt so klar wie irgend möglich.

| Bleibt unnaiv | Warum |
|---|---|
| **Das englische Beispiel** (`.pb-key-en`) | Es ist der Lerngegenstand. Es bekommt Farbe (wärmer, satter), aber keine Neigung, keine Verzerrung, keine handgemachte Grundlinie. Ein schief gesetztes englisches Wort ist für einen Erstleser ein neues Wort. |
| **Die gezählten Zahlen** | Sie tragen den Auftrag (»27 Buchstaben«). Eine Zahl, die man zweimal lesen muss, ist eine falsche Zahl. |
| **Die Antwort-Chips als TEXT** | Die Chips dürfen schief liegen — ihre Beschriftung nicht. Die Neigung sitzt auf dem Chip, der Text steht gerade darin. |
| **Kontrast von Text zu Papier** | Der markierte Text wurde DUNKLER (`#2a2114` → `#3a2410` ist wärmer, nicht heller) und das Papier heller. Der Look darf den Abstand nur vergrößern, nie verkleinern. |
| **Die Aktions-Hierarchie** | »Los geht's!« ist warm, »← Zurück« ist leise. Nur die KANTE ist der Familie beigetreten; das Papier beider trägt weiter die Hierarchie, denn eine Hierarchie allein aus Strichstärke liest ein Sechsjähriger nicht. Ein Test hält das. |
| **Reduced Motion** | Alle vier Neigungen sind STATISCH. Ein schief gelegtes Buch ist ein Bild, keine Bewegung — es gehört deshalb nicht in die Stilllege-Liste. Ein Eintrag dort würde das Buch für genau das Kind geradebiegen, das weniger Bewegung angefordert hat. |

---

## §3 · Die Takt-Grammatik des Auftakts

*(Wird in PR 3 dieser Runde geschrieben — der Auftakt in vier Takten. Bis dahin
absichtlich leer: ein Abschnitt, der beschreibt, was noch nicht gebaut ist, ist eine
Behauptung, keine Dokumentation.)*

---

## §4 · Konsistenztabelle — jede Fläche, die den Kartenlook trägt

**Umgestellt** heißt: liest mindestens einen Knopf. **Bewusst nicht** heißt: geprüft
und aus einem benannten Grund gelassen. **Offen** heißt: niemand hat entschieden.

| Fläche | Was sie ist | Zustand |
|---|---|---|
| `.pb-card` | die Karte selbst | ✅ umgestellt |
| `@keyframes pb-card-in` | ihre Landung | ✅ umgestellt (trägt die Neigung mit) |
| `.pb-card::before` | die Innenlinie | ✅ umgestellt (jetzt gestrichelt) |
| `.pb-card::after` | die umgeschlagene Ecke | ✅ umgestellt (erbt den Radius) |
| `.pb-card button` / `.pb-chip` | jeder Chip | ✅ umgestellt |
| `.pb-btn-primary` / `.pb-btn-ghost` | die Aktions-Hierarchie | ✅ nur die KANTE — Papier bleibt (§2) |
| `.pb-plate-wrap` / `.pb-plate` | die Bildtafel | ✅ umgestellt |
| `.pb-key` / `.pb-key::after` / `.pb-key-en` | die markierte Zeile + Kreidestrich | ✅ umgestellt |
| `.pb-quiet` | die leise Ebene | ✅ umgestellt |
| `.pb-stamp` | das Wachssiegel | ✅ umgestellt |
| `CardShell.tsx` »Später«-Kante | inline gesetzt, schlägt das Stylesheet | ✅ umgestellt (liest `--pb-ink-line`) |
| `.pb-hud-chip` / `.pb-hud-chip-btn` | die Zählerleiste am Seitenrand | ⛔ **bewusst nicht** — sitzt AUSSERHALB des Schleiers und kann die Knöpfe nicht erben. Das Muster hat sie nie gezeigt, Koki hat sie nie beurteilt. |
| `.pb-veil` · `.pb-defocus` · `.pb-wipe` · `.pb-tether` | die Bühne, nicht die Karte | ⛔ bewusst nicht — kein Papier, keine Kante |
| `.pb-portrait` | der Bildrahmen im Kartenkopf | ❔ **offen** — kartenintern, aber im Muster nicht enthalten. Trägt noch `#b78d51`. |
| `.pb-rule-band` · `.pb-merk-slot` · `.pb-merk-topic` | die Regel-Seiten-Flächen aus I1 | ❔ **offen** — dieselbe Lage |
| `.pb-treasure-plate` · `.pb-treasure-page` · `.pb-treasure-glow` | die Schatz-Darstellung aus I1 | ❔ **offen** — hängt an der Kontrast-Runde (J1-E), dort wird ohnehin gemessen |
| `.pb-score-row` · `.pb-count` · `.pb-eyebrow` · `.pb-help*` | Typografie-Details der Ceremony-Karten | ❔ offen |
| Plattform/Hub (`apps/web`) | außerhalb des Spiels | ⛔ bewusst nicht — doc 45 §G2 vertagt sie ausdrücklich |

Die »offenen« Flächen sind ein Wort (`var(--pb-ink)`) davon entfernt, der Familie
beizutreten. Sie bleiben offen, damit die **Blind-Kritiker darüber urteilen** statt
ich — sie sind genau die Stellen, an denen ein Kritiker eine Inkonsistenz sehen wird,
und dieser Befund ist mehr wert als meine Vermutung.

---

## §5 · Gemessen, nicht geschätzt

**Die Neigungs-Falle.** Frage: kippt die geneigte Karte auf schmalen Fenstern aus dem
Bild? Gemessen am ruhenden Zustand (die Landung stillgelegt — nach dem End-States-Gesetz
IST die Grundregel das fertige Bild):

| Breite | Luft rechts VORHER | Luft rechts NACHHER |
|---|---|---|
| 1056 px | 14,0 px | 9,4 px |
| 500 px | 14,0 px | 9,7 px |
| **375 px** | **14,0 px** | **9,7 px** |
| 320 px | 14,0 px | 9,7 px |

Die Neigung kostet **4,3 px**, es bleiben 9,7 px. Auf der echten Seite bei 375 × 812
sind es 14,0 px links und 14,1 px rechts — dort kostet sie messbar nichts, weil der
Schleier breiter ist als die Karte. **Die Karte kippt nicht aus dem Bild.**

Der gerechnete Wert und der gemessene stimmen überein: `sin(1,1°) = 0,019197`, und
die Transformationsmatrix im Browser liest `0.0191974`.

**Zwei Fallen im Messen selbst, für den nächsten, der misst:**
1. **Der Automatisierungs-Browser hält seinen Tab verborgen** — CSS-Animationen laufen
   dort nicht an. Die erste Messung erwischte die Karte eingefroren im 0-%-Keyframe
   (Maßstab 0,93) und war damit unvergleichbar. Lösung: `animation: none` setzen und
   die Grundregel messen.
2. **Die Kartenbank ist eine feste 1056 × 672-Bühne.** Sie auf 375 px zu verkleinern
   erzwingt ein Seitenverhältnis, das kein Telefon hat, und erzeugt einen senkrechten
   Beschnitt, den es auf der echten Seite nicht gibt. Wer Telefon-Geometrie messen
   will, misst die **echte Seite**, nicht die Bank.

---

## §6 · Offene Fragen an den Architekten

Nicht einseitig entschieden — das hier ist Fables Sitz.

1. **Die vier »offenen« Flächen in §4** (`pb-portrait`, die Regel-Seiten-Bänder, die
   Schatz-Flächen, die Ceremony-Typografie): der Familie beitreten lassen, oder ist
   der Kontrast zwischen Kartenrahmen und Karteninhalt gewollt?
2. **Die abgegebenen Blattschichten.** Die alte Karte trug vier versetzte Papierkanten
   (»die Karte ist die oberste Seite eines Buches, kein Rechteck in der Luft« — ein
   Blind-Kritiker auf dem Exemplar). Das beurteilte Muster hat sie gegen einen harten
   Schlagschatten getauscht. Zwei Zeilen, um sie zurückzuholen. Soll die neue Kante
   den Buchseiten-Eindruck allein tragen?
3. **Die Chip-Schriftgröße** (siehe §1, bewusste Nicht-Übernahme): eine
   Lesbarkeitsentscheidung, kein Look-Knopf — aber jemand sollte sie treffen.
4. **Der Telefon-Beschnitt.** Auf 375 × 812 wird die Auftakt-Karte oben und unten
   abgeschnitten (Bildtafel angeschnitten, Schlussabsatz unter der Falz). **Vorbestehend,
   nicht von dieser Runde verursacht** — belegt durch zwei Aufnahmen im selben Aufbau.
   Aber PR 3 legt MEHR auf diese Karte, also braucht es vorher eine Richtung: Karte
   scrollbar, Inhalt je Takt kleiner, oder Bühne höher?
