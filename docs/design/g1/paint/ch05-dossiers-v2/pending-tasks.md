# ch05 · Karten, die WARTEN — Daten statt Karten (Bahn L5-T1, 2026-09-03)

_Diese Datei gehört der T-Bahn. Die G-Bahn legt ihre eigenen Dateien (`README.md`, `p1.md`,
`pending.md`, `claims.json`) daneben — sie werden hier nicht angefasst._

## §1 · Warum diese zwei Karten hier stehen und nicht in `ch05.tasks.v2.json`

doc 41 §1 gibt ch05 die Feld-Palette **choice · mistake · order · memory**; `mistake` ist das
Feld-**Debüt** des Kapitels (die Songblatt-Zeilen), `memory` debütiert in ch04.

Gemessen am Motor (`packages/game-paint/src/cards/variety.ts`, Gesetz 13a, und
`packages/content-schema/src/game-tasks.ts`, Tabelle `FORM_KINDS`): **jede Feld-Karte muss eine
`form` deklarieren, und für `mistake` und `memory` gibt es heute keine.** Die neun Formen
(`name-it · state-it · pick-correct-form · command · social-formula · ask-it · count-it ·
number-transcode · belongs-or-not`) tragen diese zwei Maschinen nicht. Eine Feld-Karte dieser
Arten ist damit heute **schema-blockiert** — Befund **D-902**, beantwortet durch **R247**:
`TASK_FORMS` bekommt `fix-it` (mistake) und `pair-it` (memory) im **L0-Nachtrag**.

Bis dahin gilt: **mistake/memory nur im `boss`-Pool** (dort ist `form` frei — `ch05.tasks.v2.json`
baut die Boss-`mistake`-Karte `g1.paint.ch05.boss.mi1` wirklich), und die zwei Feld-Exemplare
liegen HIER als Daten. **Die T2-/A-Bahn trägt sie ein**, sobald `fix-it`/`pair-it` in
`TASK_FORMS`/`FORM_KINDS` stehen — dann zusätzlich `form: "fix-it"` bzw. `form: "pair-it"`
und `fieldForms` in `ch05.policy.json` um dieselben zwei Namen erweitern.

## §2 · P1 — das Feld-Debüt von `mistake` (die falsche Note singt eine falsche Zeile)

Die schiefe Note singt „This is my guitar." — daneben steht die Gitarristin mit IHRER Gitarre.
Die falsche Zeile ist der **Weltzustand**, nie ein Fehler des Kindes (E8 des Boot-Blatts): die
Note behauptet etwas Falsches, das Kind stellt es richtig. Erst NACH Regel-Seite 2
(Possessivbegleiter) servieren — D-785.

```json
{
  "id": "g1.paint.ch05.enc.falschenote.mi1",
  "use": "encounter",
  "kind": "mistake",
  "form": "fix-it",
  "exercises": ["g1u05.s.possessives", "g1u05.w.guitar"],
  "stimulus": { "type": "entity", "showsDe": "Die Note singt neben der Gitarristin." },
  "storyDe": "Ein Wort stimmt nicht — tipp es an!",
  "sentence": ["This", "is", "my", "guitar", "."],
  "errorIndex": 2,
  "fix": { "mode": "replace", "correction": "her" },
  "correctionOptions": ["her", "his", "its"],
  "skins": ["falschenote"],
  "phases": ["p1"],
  "hints": { "deDesc": "Wem gehört die Gitarre? Schau hin." },
  "grounding": "u05 Possessivbegleiter — SB S. 42 (Tabelle »she – her«) und SB S. 38 (»this is her boyfriend«)."
}
```

Geprüft, soweit es heute geht: alle englischen Wörter stehen in `u05-lexicon.json`; `showsDe`
nennt die Gitarristin und NICHT das Lösungswort (Schicht 18a: das entscheidende Wort ist `her`);
`errorIndex 2` zeigt auf `my`; `correctionOptions` enthält die Korrektur. Was fehlt, ist einzig
die Form.

## §3 · P2 — das Feld-Debüt von `memory` (Musiker ↔ Instrument)

Die Trompete wirbelt acht Kärtchen durcheinander: vier Musiker, vier Instrumente.

```json
{
  "id": "g1.paint.ch05.enc.trompete.me1",
  "use": "encounter",
  "kind": "memory",
  "form": "pair-it",
  "exercises": ["g1u05.w.drums", "g1u05.w.guitar", "g1u05.w.keyboard", "g1u05.w.saxophone"],
  "stimulus": { "type": "entity", "showsDe": "Die Trompete wirbelt acht Kärtchen durch die Luft." },
  "storyDe": "Finde zu jedem Musiker sein Instrument!",
  "pairs": [
    { "a": "drummer", "b": "drums" },
    { "a": "guitarist", "b": "guitar" },
    { "a": "keyboard player", "b": "keyboard" },
    { "a": "saxophone player", "b": "saxophone" }
  ],
  "skins": ["trompete"],
  "phases": ["p1"],
  "hints": { "deDesc": "Wer spielt was? Zwei gehören zusammen." },
  "grounding": "u05 Musiker und Instrumente — SB S. 38 (»Musicians and instruments«: drummer · saxophone player · singer · guitarist · keyboard player)."
}
```

⚠ Zwei Dinge für die Bahn, die sie einträgt: (a) `memory` steht in `EVIDENCE_KINDS` — `evidence`
ist nur im `boss`-Pool Pflicht, im Feld darf sie NICHT dabeistehen (die Invariante verlangt sonst
eine Wächter-Fläche); (b) die Trompete trägt dann ZWEI Formen (`pick-correct-form` auf ihrer
choice-Karte, `pair-it` hier) — Gesetz **14a** erlaubt einem feindlichen Wesen genau EINE Stimme.
Entweder wandert die memory-Karte auf ein anderes Wesen, oder die choice-Karte der Trompete
bekommt dieselbe Form wie diese hier. **Das ist eine Entscheidung der T2-Bahn, keine Auslassung.**

## §4 · Was die Welle T2 aus den zehn Exemplaren erbt (gemessen, nicht geraten)

1. **Ein Wesen, eine Form** (Gesetz 14a, `variety.ts:371-378`): die Formen-Zählung läuft über
   feindliche Wesen (chaser/gunner/flyer/bouncer/crusher/swarm) und Restore-Wesen. Deshalb tragen
   BEIDE Triangel-Karten der Exemplare `ask-it` (die `order`-Karte kann gar nichts anderes
   tragen — `ask-it` ist die einzige Form, die `order` erlaubt). Türen und Käfige sind von 14a
   ausgenommen, ihre Serie darf mehrere Formen fahren.
2. **Veits sechs Wiedererweckungs-Runden brauchen eine erklärte Ausnahme.** Alle sechs sind
   `rescue`-Karten an einem Wesen mit `state-it` — und `state-it` ist eine
   `REFERENT_FIXED_FORM`. Gesetz **14c** verbietet zwei solche Karten in EINEM Pool. ch01 löst
   das mit der Familie `merle-ceremony` in `ch01.policy.json` (exempts 16c, obliges
   `distinctStoryDe` + `distinctAnswers`). ch05 braucht das Gegenstück in `ch05.policy.json`,
   sonst ist die zweite Veit-Karte rot.
3. **`stimulus.art` nur, wo das Blatt existiert** (Schicht 11, `check-game-tasks.mjs:796`): ein
   deklarierter Kunst-Name ohne PNG ist rot, ein FEHLENDER Name bei GEMALTEM Wesen ebenso. Heute
   gemalt: `door_a`, `klecksdoor_a` — sonst nichts aus ch05. Die A-Bahn trägt die Namen nach,
   wenn die Kunst kommt.
4. **Erdung ist kumulativ**: `docs/design/g1/grounding/u05-lexicon.json` (u01–u05 + die SB/WB-
   Abschrift der Unit). *whose* und *stage* stehen NICHT in der Unit (0 Treffer in beiden
   Abschriften) — eine Besitz-FRAGE muss deshalb auf Deutsch gestellt werden. *trumpet*,
   *instrument* und *drum* (Einzahl) stehen nur in den Bild-Beschreibungen der Abschrift, also
   im Apparat des Transkribenten, nicht im Buchtext: **keine Karte nennt sie.**
