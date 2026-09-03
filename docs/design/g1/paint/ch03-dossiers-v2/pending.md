# ch03 · pending — die Kapitel-Neuheiten als DATEN-Entwurf (L3-G1)

_Was hier steht, gehört noch nicht ins Level: entweder weil der Motor es noch nicht liest
(zod streicht unbekannte Schlüssel still), oder weil es einer anderen Bahn gehört. Rolle,
Parameter und Zellen sind so notiert, dass die M-Bahn nur verdrahten und die G2-/A-Bahn nur
eintragen muss._

## Schon erledigt — NICHT mehr pending (L0 ist gemergt)

- **`collectSkin: "coin"` steht im Level.** Das Blatt sah vor, den Sammel-Skin hier zu parken,
  bis L0 das Feld baut. L0 (PR #391) ist gemergt, das Feld existiert und wird gelesen — der
  Trail rendert die Münzen bis zur Kunst-Zeit als graue Scheibe mit „COI". Kein Stand-in mehr,
  sondern der echte Zustand.
- **`bonus.budgetSec: 40` steht im Level.** Ebenfalls aus dem L0-Nachtrag; die Bonus-Uhr ist
  damit kein Motor-Posten des Kapitels mehr (40 s + 2 s Gnade aus der Motor-Konstante).
- `clothNounDe` entfällt: ch03 hat keine `cloth`-Klasse.

## Offen — Daten für die M-Bahn (L3-M)

### (a) Die steigende Bilge (p2, Set-Piece)
Phasen-Feld `bilge: { band: {c0, c1}, rStart, rTop, pulseTicks, riseRows, pumps: [ids], valve: id }`.
Vorschlag für das noch zu schneidende p2-Gitter: Band über die Laderaum-Breite, `rStart` an der
Bodenlinie, `rTop` drei Zeilen darunter, `pulseTicks` 240, `riseRows` 3. Pumpengriff = Trigger-Wesen,
Faust-Treffer friert den Puls; das Ablassventil ist der gelehrte Konter und senkt auf `rStart`.
Beide Stände müssen dem Erreichbarkeits-Modell bekannt sein, sonst ist der Raum nicht tape-fähig.

### (b) Das Kugel-Projektil der Bug-Kanone
Projektil-Art `ball` als Kind der bestehenden Klasse: halbieren und reflektieren, Hang-Kick ±2/±1.
Heute feuert die Kanone das Bestands-Bogen-Projektil, das am Boden stirbt — spielbar, aber ohne
die Hüpf-Mechanik, die der Boss später zitiert.

### (c) Die Galionsfigur (Tier M, Achterdeck)
Skript-Daten: Bahn auf Ring-Bögen über den Bug (spiegelt das neue Verb), Telegraf ≥ 500 ms,
jeder zweite Knoten ein tiefer Ladebaum-Sweep mit Sprungfenster, Deflect = Kugel zurückfausten
(Lack springt, Stagger), Konter-Fenster gegen ihr SICHTBARES Inventar. Im Level steht heute nur
der generische tier-M-Platzhalter, damit L3-T1 seine Boss-Karten binden kann.

### (d) Der Nacken-Käfig #4 in p3
GEOMETRIE UND DEKOR, **kein `cage`-Wesen**: eine wind-gehaltene Nische in der Takelage, die
ch04 mit dem Schweben öffnet. Ein unerreichbarer `cage` bricht `entity-reachable` — deshalb baut
G2 die Nische, und erst ch04 setzt das Wesen hinein.

### (e) Rückkehr-Takt aus ch02 — nur als Zeile, nicht als Posten
ch02 lässt seine Nacken-Käfige #4/#5 für den Ring-Schwung stehen. Sie zu öffnen braucht (i) ein
Erreichbarkeits-Modell, das Fähigkeiten über Kapitelgrenzen kennt, und (ii) eine Bahn, die
`ch02.level.json` anfasst. Beides gehört NICHT zu ch03; hier steht es, damit es niemand vergisst.

### (f) ⚠ RINGKETTEN SIND MIT DIESEM SEIL NICHT BAUBAR — Posten für p3
Am Band gemessen: das Schwungseil ist 96 px lang (sechs Kacheln), das Kind hängt also sechs
Zeilen UNTER dem Ring, den es greift, und ein Loslassen trägt rund acht Spalten weit und
höchstens eine Zeile hinauf. Zwei Ringe auf gleicher Höhe sind damit nie zu verketten: nach dem
ersten Schwung hängt das Kind sieben Zeilen unter dem zweiten. Ringe TIEFER zu hängen löst es
nicht — dann endet der Schwung im Wasser bzw. an der Bordwand des Zielufers.
p1 baut deshalb EINEN Ring, der die ganze Querung trägt (bewiesen im Band).
**Die Blaupause plant p3 „Die Takelage" als Ringketten von Mast zu Mast.** Das ist mit dem
heutigen Seil nicht baubar. Drei Wege, Entscheid des Architekten VOR G2:
(a) kürzeres Seil bzw. eine zweite Seillänge als Ring-Parameter (Motor-Posten, L3-M);
(b) Ketten mit Rastplätzen — jede Ring-Querung endet auf einer Rah, nicht am nächsten Ring;
(c) p3 baut Einzel-Schwünge statt Ketten, und die Fiktion „Kette" fällt.
Empfehlung: (b) — es braucht keinen Motor und liest sich als Takelage genauso.

## Offen — Kokis Entscheid

### (f) Der Insasse von Käfig #2
Arbeitsstand im Level: `captive: "polly"`, `captiveDe: "Polly mit den lila Haaren"` — eine
Korpus-Figur, mit „purple hair" aus der have-got-Zeile der Unit beschreibbar.
⚠ **Ein Argument GEGEN diesen Arbeitsstand, vom blinden Leser gefunden:** „Polly" ist der
Standardname für den Papagei eines Piraten — und in DIESEM Raum sitzt zwanzig Spalten weiter ein
echter Papagei (der Streit-Papagei). Ein Kind erwartet hinter dem Namen einen Vogel und findet
eine Person mit lila Haaren. Wenn Koki den Namen behalten will, gehört der Papagei umbenannt
oder der Käfig-Insasse; beides zugleich liest sich als Versehen. Die Insassen-Wahl
gehört Koki; bis sie fällt, ist das ein Arbeitsstand und kein Entwurf einer Entscheidung.
Der Schlüssel ist frei wählbar (nur Kleinbuchstaben und Ziffern), das Kunst-Blatt hieße
`captive_polly`.

## Absichten der Gerüst-Räume (was G2 vorfindet und ersetzt)

- **p2 „Unter Deck" 72×26** — leer bis auf Spawn und Ausgang. Ohne Klecks-Tür: die verlangt einen
  Preis UND genug erreichbare Münzen davor; beides setzt G2 zusammen mit dem Gitter. Eintritt in
  den Bonusraum: **10 Münzen** (Architekten-Entscheid).
- **p3 „Die Takelage" 56×30** — der erste hohe Raum des Spiels; Kamera und Perf misst G2.
- **Achterdeck 36×20** — trägt die Wächterin bereits als Platzhalter.
- **Segelraum 44×20** — zwölf ebenerdige Münzen, `budgetSec: 40`. Der Schwungkurs kommt mit G2.
- **Keine Münzen in p2 und p3.** Jede `*`-Zelle verlangt eine Anker-Zeile im Dossier ihres Raums;
  Trails ohne Gitter wären erfundene Koordinaten. G2 schneidet beides zusammen.

## ⚠ Reihenfolge-Konflikt, den diese Bahn gefunden hat: G1 und T1 brauchen einander

`check-paint-copy` (CI-Tor, in der Blatt-Batterie NICHT genannt) erdet **jede englische Zeile
einer Regel-Seite** gegen das kumulative Unit-Lexikon `docs/design/g1/grounding/uNN-lexicon.json`.
Es existiert bis heute nur `u01-lexicon.json`. Gemessen: **24 Verstöße, alle in den zwei
Regel-Seiten von ch03 p1**, und zwar genau an den Wörtern, die die Unit lehrt — `have`, `got`,
`has`, `he`, `she`, `they`, `ship`, `beard`, `hair`, `purple`, `foot`, `feet`, `tooth`, `teeth`,
`man`, `men`, `woman`, `women`. ch01 ist unberührt (0 Verstöße).

Das ist ein **Kreis in der Zug-Ordnung**, kein Fehler der Zeilen:
- **T1 braucht G1 zuerst** — die Karten binden an die Skins des gemergten Levels.
- **G1 braucht T1 zuerst** — die Regel-Seiten brauchen `u03-lexicon.json`, und das ist die
  ERSTE Lieferung von L3-T1 (und liegt in meiner Scope-Wand ausdrücklich bei der T-Bahn).

Die Zeilen selbst sind richtig: jedes beanstandete Wort steht in `content/corpus/units/g1-u03/
wordbank.json`. Es fehlt nur die Erdungs-Datei.

Drei Wege, Entscheid des Architekten:
(a) **L3-T1 liefert `u03-lexicon.json` als eigene, winzige PR ZUERST**, dann G1, dann T1s Karten —
    der Kreis bricht an der kleinsten Stelle. **Empfehlung.**
(b) G1 und T1 fahren als EIN Zug und werden zusammen gemergt.
(c) Die zwei Regel-Seiten wandern aus p1 nach G2 (nach T1). Kostet Kokis Kalibrier-Walk zwei
    Beats und `tipsTotal` fällt auf 0 — möglich seit L0b, aber es nimmt dem Exemplar die Lehre.
