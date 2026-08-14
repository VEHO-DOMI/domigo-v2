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
| `--pb-ink-rgb` | `107, 63, 24` | **R5-W3 · J2.** Derselbe Stift als Kanäle, für die eine Fläche, die ihn in eigener Stärke braucht (die Bilanz-Linie). Ein zweiter Name für eine Farbe ist ein Drift-Risiko — bezahlt durch ein Gesetz, das die drei Zahlen aus `--pb-ink` neu ableitet und rot wird, wenn sie auseinandergehen. |
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

### Fünf Werte, die bewusst KEIN Knopf sind

Ein Knopf für eine Zahl, die niemand nachstellt, ist ein zweiter Name für dasselbe.
Literal bleiben: die 4 px Chip-Lippe · die 2,5 px Strichstärke der Innenlinie · die
6 px Höhe des Kreidestrichs · die 0,2 px Sperrung der Schlüsselzeile — und seit
R5-W3 · J2 **DIE HAND**: die vier Seitenfaktoren `1,25 · 0,80 · 0,75 · 1,20`, je
Fläche anders rotiert. Sie sind kein Knopf, weil niemand *eine Seite einer Fläche*
nachstellt, und weil ein gemeinsamer Knopf pro Fläche neu deklariert werden müsste —
genau das Leck, gegen das die Scope-Wand steht. Zwei Eigenschaften machen sie sicher
statt bloß anders: **gegenüberliegende Paare summieren sich auf exakt 2**, die Hand
verteilt Gewicht also um und fügt keins hinzu (die Karte zahlt schon 4,3 px ihrer
14 px Seitenluft an die Neigung); und **jede zyklische Rotation erhält diese
Eigenschaft**, weshalb vier Flächen vier verschiedene Hände aus einem Zahlensatz
bekommen. Eine Hand überall wäre eine systematische Schräge — der ursprüngliche
Befund, eine Ebene höher geschoben statt beantwortet. Ebenso bleiben
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

Damit ch02–ch15 sie erben, ohne zu raten. Ein Kapitel-Auftakt hat **bis zu fünf
Takte, in dieser Reihenfolge**, und jeder beantwortet genau eine Frage des Kindes.

**★ R5-W3 · J2 · R29 — aus vier wurden fünf.** Zwei blinde Didaktik-Kritiker,
Sessions auseinander und blind zueinander, nannten unabhängig fünf Aufgabenzeilen
auf EINER Karte zu viel für ein Sechsjähriges (75 % und 90 %) — und beide dieselbe
zweite Schwäche: bei gleichem Gewicht sagt nichts, welche Aufgabe die des Kapitels
ist und welche ein Bonus. Konvergenz macht das zur Tatsache; die stehende
Architekten-Regel war *teilen bei Konvergenz*. Die Naht ist **TUN gegen SAMMELN**.

| Takt | Die Frage | Was darauf steht | Woher es kommt |
|---|---|---|---|
| 1 · Das Buch schlägt auf | *Wo bin ich?* | Kapitelnummer · die gemalte Titeltafel mit dem Kapitelnamen · ein Fenster in den echten Raum mit dem Jungen darin · **der Warum-Satz** | `level.chapter` · `goalPlate` · `level.name` · `SceneCut(plates.far)` · `level.whyDe` |
| 2 · Was geschehen ist | *Was ist passiert?* | EIN Bild und EINE Zeile darunter | `auftakt_<ch>_b` → Schulhaus-Zelle → SceneCut · `level.goalDe` |
| 3 · Dein Auftrag | *Was soll ich tun?* | Die Aufgaben, die das Kapitel VERLANGT — Farbe zurückgeben (die Zeile, auf der der englische Mechanismus steht) und Käfige öffnen | `auftaktTasks(counts, "aufgaben")` |
| 4 · Was du sammelst | *Was nehme ich mit?* | Was unterwegs eingesammelt wird: Buchstaben, Regel-Seiten, Bonus-Bücher | `auftaktTasks(counts, "sammeln")` |
| 5 · Los geht's | *Wie fange ich an?* | Die Tür · der Name des ersten Raums · **»Los geht's!«** | `auftakt_<ch>_d` → `doorPlate` → SceneCut · `phases[0].nameDe` |

### Die sechs Gesetze der Grammatik

0. **Ein Takt ohne Inhalt ist kein Takt.** Die Kette wird aus den Zählungen
   BERECHNET (`auftaktChain`), nicht als feste Liste geführt: ein Kapitel ohne
   Sammelstücke zeigt vier Takte, eines ohne Handlungsaufgaben ebenfalls vier,
   eines ohne beides drei — nie fünf mit einer leeren Seite. Und weil der Fuß
   seine Zahl aus derselben Kette zieht, kann »4 von 5« nicht behaupten, was die
   Takte nicht tun. Ein Test läuft alle vier Kapitelformen ab.
1. **Der Warum-Satz steht in Takt 1, nicht am Ende.** Ein Kind, das nur die erste
   Seite liest, hat trotzdem den einen Satz gelesen, für den das Kapitel da ist.
   (Der Blind-Kritiker auf dem alten Exemplar: die Prämisse war »in die kleinste,
   zuletzt gelesene Zeile« gerutscht.)
2. **Takt 2 ist ein BILD mit einer Zeile, kein Absatz.** Es ist der Story-Takt; wenn
   er zu einem Absatz wird, ist er Takt 3 mit anderer Überschrift.
3. **Jede Zahl in Takt 3 wird gezählt, nie getippt** (doc 41 §7). Diese Seite ist der
   Vertrag des Kapitels mit dem Kind — eine getippte Zahl ist das Einzige, was ein
   Vertrag nicht enthalten darf.
4. **Die Welt bleibt über ALLE Takte eingefroren.** Nur der letzte gibt sie
   zurück. `auftaktExit()` sagt das für genau einen Takt, und seit dem Schnitt
   prüft der Test es auf JEDER Kette, die ein Kapitel erzeugen kann — der Schnitt
   hat die Zahl möglicher Ketten vervielfacht, und eine Kapitelform, die niemand
   getestet hat, ist genau die, die die Welt unter einer offenen Karte startet.
5. **Jeder Takt außer dem ersten kann zurückblättern**, und der Fuß mit
   Weiter · Zurück · Zähler sieht auf allen vier gleich aus. Ein Auftakt darf nicht
   schneller sein als das Lesen.
6. **Kein Bild ist Pflicht.** Jeder Takt hat eine Rückfallkette bis hinunter zu »gar
   kein Bild«. Kunst landet stapelweise; eine Karte darf an keiner fehlenden Datei
   zerbrechen.

### Was ein neues Kapitel liefern muss

`whyDe` · `goalDe` · `name` · `phases[0].nameDe` · `collectNounDe` — und optional
`auftakt_<ch>_b` und `auftakt_<ch>_d`. Mehr nicht: die Aufgabenzeilen baut
`auftaktTasks()` aus der gezählten Welt, und der Fuß zählt sich selbst.

⚠ **Die eine Falle beim Erben:** `collectNounDe` ist authoriert und PLURAL, und sein
Singular ist nicht ableitbar (Artikel und Endung hängen am Geschlecht, das die
Leveldatei nie nennt). Ein Kapitel, das wirklich EIN Sammelstück hat, braucht ein
eigenes Singularfeld — bis dahin lässt Takt 3 bei eins die Zahl weg, statt eine
falsche Form zu erfinden.

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
| ~~`.pb-portrait`~~ | der Bildrahmen im Kartenkopf | 🗑 **ENTFERNT (J2)** — war eine TOTE Regel: R5-W1 · D1 hat das Bild von einem Slot zur PLATTE befördert, und seither wendet kein TSX die Klasse an (repo-weit geprüft, inkl. der Frage, ob ein Klassenname je zur Laufzeit gebaut wird — wird er nicht). Eine tote Regel zu schminken hätte die Tabelle grün gemacht, ohne dass ein Kind oder ein Kritiker etwas sieht. |
| `.pb-rule-band` · `.pb-merk-slot` · `.pb-merk-topic` | die Regel-Seiten-Flächen aus I1 | ✅ **umgestellt (J2)** — Band und Stub lesen die Tinte, das Band trägt die Hand. ⚠ Erst mit `--pb-ink-line` gebaut und von einem blinden Kritiker zu Recht kassiert: »die goldene Linie leistet etwas — sie sagt, dieses Rechteck ist besonders«. Beitreten war richtig, im FLÜSTERTON beitreten nicht; jetzt volle Tintenstärke. |
| ~~`.pb-treasure-plate`~~ · `.pb-treasure-page` · `.pb-treasure-glow` | die Schatz-Darstellung aus I1 | 🗑 **`-plate` ENTFERNT (J2, tot, kein Konsument)** · die zwei lebenden ⛔ **bewusst nicht**: sie tragen keine gezogene Kante und keine Konturfarbe — es gibt nichts, dem sie beitreten könnten. Eine Farbe zu tokenisieren, die einmal gelesen wird, ist ein zweiter Name für eine Zahl. |
| `.pb-score-row` · `.pb-eyebrow` · `.pb-help*` | Typografie-Details der Ceremony-Karten | ✅ **umgestellt (J2)** — und bei `.pb-eyebrow`/`.pb-merk-topic` war es zugleich eine Lesbarkeits-REPARATUR: `#a8926a` auf `--pb-paper` misst **2,70 : 1** und fällt bei 12 px durch AA; `--pb-quiet-ink` misst **5,53 : 1**. Die Bilanz-Linie tauscht ihre Eigen-Tinte gegen `--pb-ink-rgb` bei 1/1,4 der alten Deckung — gleiche gefühlte Stärke, Farbe in der Familie. |
| `.pb-count` | die gezählten Zahlen | ⛔ **bewusst nicht (J2)** — steht in §2 auf der Liste »bleibt unnaiv«. Eine Zahl, die man zweimal lesen muss, ist eine falsche Zahl. |
| `.pb-ring-track` · `.pb-ring` | die Kreide-Uhr | ⛔ bewusst nicht — ein Countdown ist kein Rahmen; ein wackeliger 6-px-Balken liest als Darstellungsfehler. |
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

### D-52 · die Telefon-Messung (R5-W3 · J2)

Auf der ECHTEN Seite bei 375 × 812 gemessen, nie auf der Karten-Bank (die ist eine
feste 1056 × 672-Bühne und erfindet einen Beschnitt, den die Seite nicht hat).

⚠ **Zwei Messfallen, beide zuerst hineingetappt und dann gemessen statt geglaubt:**
der Automatisierungs-Tab ist **verborgen** (`document.hidden === true`), also läuft
die `pb-page-in`-Seitenwende nie an — die erste Messreihe maß eine Karte, die im
0-%-Keyframe einer 3D-Drehung feststeckte, und ihre Zahlen waren wertlos. Und die
Bühnenhöhe ist erst nach dem Layout-Settle stabil (954,9 px vorher, 555,5 px
danach): Phaser setzt dem Wirt `height: 100%`, das sich gegen eine Kette
prozentualer Höhen auflöst. **Beweis ist deshalb das BILD, nicht der Zahlenwert.**

| Takt | Karte hoch | Schnitt oben | Schnitt unten |
|---|---|---|---|
| 1 · Kapitel 1 | 507,2 | – (21,1 Luft) | – (27,2 Luft) |
| 2 · Was geschehen ist | 591,6 | **18,1** | **18,1** |
| 3 · Dein Auftrag (alt, fünf Zeilen) | **719,3** | **81,9** | **81,9** |
| 4 · Los geht's | 530,3 | – (12,6 Luft) | – (12,6 Luft) |

Der Schleier ist **555,5 px** hoch und zentriert, schneidet also symmetrisch.
Takt 3 verlor 163,8 px = 23 % der Karte, samt »Zurück blättern«.

**Nachher:** die Karte bekommt `max-height: calc(100% - 24px)` (24 px, weil die
Neigung die Bounding-Box um `Breite × sin(1,1°)` wachsen lässt und der harte
Schlagschatten 9 px darunter fällt), und das BLATT darin scrollt. Nach dem
Aufgaben-Schnitt braucht auf 375 × 812 **kein Takt mehr zu scrollen** — beide
neuen Aufgaben-Takte passen ganz, mit beiden Knöpfen sichtbar.

⚠ **Nebenwirkung, ehrlich:** Karten, die der Schleier VORHER schon beschnitten hat,
scrollen jetzt — auch auf dem Desktop. Die Punkte-Karte ist der sichtbarste Fall:
vorher fehlten ihr oben und unten die Kanten, jetzt ist sie ganz und drei ihrer
fünf Zeilen liegen unter der Falz. Erreichbar statt abgeschnitten ist die bessere
Hälfte des Tauschs, aber es IST ein Tausch, und er gehört vor Kokis Auge.

## §6 · DREI-STRIKES-STOPP — die Geometrie-Runde erreicht ihr Ziel NICHT (R5-W3 · J2)

**Gebaut ist alles, was R21 verlangt.** Gemessen im Browser, nicht behauptet: die
Kartenkante rendert **5 / 3 / 3 / 4,5 px** (oben/rechts/unten/links; der Browser
rundet 3,2 → 3 und 4,8 → 4,5 auf Gerätepixel). Die vier Seiten widersprechen sich
also wirklich, im Verhältnis 1,67 : 1 oben-zu-unten.

**Und trotzdem sieht es kein Kritiker.** Drei blinde, frische Kritiker:

| Runde | Was sie sahen | Urteil |
|---|---|---|
| 1 · ganze Bühne | vorher/nachher derselben Karte | »I cannot see a difference« (90 %) |
| 2 · ganze Bühne, Reihenfolge getauscht | dasselbe | »I cannot see a difference« (75 %) |
| 3 · Karte formatfüllend, ausdrücklich nach der KANTE gefragt | drei Fassungen | »the border is the same weight all the way round« (85 %) |

**Ihre Tatsachenbehauptung ist widerlegt** — nachgemessen unterscheiden sich
**6,3 %** aller Bildpunkte der Karte (max. Abweichung 658/765), und die
Rechnerwerte oben stehen im Browser. Das ist derselbe Fehlertyp, den J1 gebankt
hat (»ein Kritiker-Befund ist eine Spezifikation, keine Messung«), diesmal
dreifach. **Ihr Geschmacksurteil bleibt gültig, und es ist das Ergebnis dieser
Runde:**

> Eine Kante, die auf jeder Seite eine ANDERE gleichmäßige Stärke hat, ist immer
> noch eine gleichmäßige Kante. Was die Kritiker sehen wollen, ist Variation
> **ENTLANG** der Linie — Zittern, Auslaufen, Doppelstrich. Das kann ein
> CSS-`border` grundsätzlich nicht: er hat pro Seite genau eine Zahl.

**Drei Strikes am selben Kriterium ⇒ Stopp und Eskalation mit Beweisen, statt mit
Gewalt weiter** (AAA-Mandat). Die gebaute Arbeit bleibt: sie ist korrekt,
tokenisiert, per Tamper gesichert, und sie kostet nichts. Sie schließt die Lücke
nur nicht.

**Was die Lücke schließen würde — Architekten-Entscheidung, nicht meine:**
`border-image` mit einem gemalten Kantenstreifen (oder ein SVG-Rahmen). Das ist
eine KUNST-Bestellung, keine CSS-Runde, und beide Kritiker der ersten zwei Runden
haben unabhängig dasselbe als größten verbleibenden Abstand genannt: den gemalten
Blättern fehlt gerichtetes Licht, und die UI-Teile drumherum sind gleichförmig.
Das ist A5s Spur, nicht J2s.

## §7 · Offene Fragen an den Architekten

Nicht einseitig entschieden — das hier ist Fables Sitz.

1. **Die vier »offenen« Flächen in §4** (`pb-portrait`, die Regel-Seiten-Bänder, die
   Schatz-Flächen, die Ceremony-Typografie): der Familie beitreten lassen, oder ist
   der Kontrast zwischen Kartenrahmen und Karteninhalt gewollt?
2. **Die abgegebenen Blattschichten.** Die alte Karte trug vier versetzte Papierkanten
   (»die Karte ist die oberste Seite eines Buches, kein Rechteck in der Luft« — ein
   Blind-Kritiker auf dem Exemplar). Das beurteilte Muster hat sie gegen einen harten
   Schlagschatten getauscht. Zwei Zeilen, um sie zurückzuholen. Soll die neue Kante
   den Buchseiten-Eindruck allein tragen?
3. ~~Die Chip-Schriftgröße~~ — **ENTSCHIEDEN (Koki, 2026-08-14): 18 px**, gebaut als
   EINE Regel in `cardBtn`. Die zweite, abgedriftete Kopie in `PaintGame.tsx`
   (15 px, während drei Zeremonien-Knöpfe inline 16 erzwangen) speist sich jetzt
   daraus statt sie zu wiederholen.
4. ~~Der Telefon-Beschnitt~~ — **ERLEDIGT (J2, D-52)**: gemessen, Ursache benannt
   (der Schleier ist 555,5 px hoch und zentriert), Karte gedeckelt, Blatt scrollt,
   und nach dem Aufgaben-Schnitt scrollt auf dem Telefon gar kein Takt mehr. Die
   Nebenwirkung auf die Punkte-Karte steht in §5 und gehört vor Kokis Auge.
