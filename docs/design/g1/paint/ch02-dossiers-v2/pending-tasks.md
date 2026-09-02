# ch02 · Karten, die noch nicht in die echte Datei dürfen (Daten-Entwurf)

_Geschrieben von L2-T1 am 2026-09-03. Jede Karte hier ist FERTIG AUTORISIERT und geerdet gegen
`docs/design/g1/grounding/u02-lexicon.json` — sie liegt nur deshalb hier und nicht in
`content/corpus/stories/g1.st.lost-pages/paint/ch02.tasks.v2.json`, weil ihr etwas fehlt, das
eine ANDERE Bahn baut. Die Bahn, die es baut, steht bei jeder Gruppe dabei. Alle Blöcke ausser
den beiden `match`-Karten bestehen `GameTaskV2.safeParse` (Beweis im L2-T1-Report)._

**Warum es diese Datei gibt.** Das Karten-Tor prüft jede Karte gegen das Level: eine Karte, die
an ein Wesen gebunden ist, das im Kapitel nicht steht, ist rot (Schicht 4 „binding"), und eine
Karte, die kein Wesen heben kann, ist ebenfalls rot (Gesetz 15b). Beides sind harte Gesetze —
die Entwurfs-Semantik aus L0 (N6) entschärft nur die ABDECKUNGS-Gesetze, nicht diese. Eine
fertige Boss-Karte in die echte Datei zu legen, bevor der Löwe im Level steht, würde also die
ganze Kartendatei rot färben. Sie wartet hier, im Wortlaut, statt neu erfunden zu werden.

---

## 1 · Die `match`-Karten — warten auf L2-M-a (die Maschine)

`match` ist im Schema `packages/content-schema/src/game-tasks.ts` **nicht vorhanden**
(`kind` ∈ choice · typed · spell · order · oddone · mistake · wheel · memory · restore).
Diese zwei Blöcke sind deshalb ein **Vorschlag für den Schema-Vertrag**, kein gültiges
GameTaskV2 — sie parsen absichtlich nicht.

⚠ **Zwei Befunde für die M-Bahn, gemessen am Stand `64248a75`:**
1. `TASK_FORMS` kennt **kein `match-it`**. R247 hat `fix-it` (mistake) und `pair-it` (memory)
   ergänzt, `match-it` nicht. L2-M-a muss es zu `TASK_FORMS` **und** zu `FORM_KINDS`
   hinzufügen (`"match-it": ["match"]`), sonst kann keine Feld-Karte dieser Art ihre Form
   deklarieren und Gesetz 13a wird rot — oder die Maschine übernimmt `pair-it`.
2. `ch02.policy.json` führt `match` bereits in `fieldKinds`. **Gemessen: das Tor toleriert das
   heute** (`fieldKindsOf` baut nur ein Set und fragt `palette.has(t.kind)`; ein Eintrag ohne
   Karte stört niemanden) — die Politik-Zeile muss also nicht nachgezogen werden, wenn die
   Maschine landet.

### g1.paint.ch02.qf.erdmaennchen.m1
```json
{
 "id": "g1.paint.ch02.qf.erdmaennchen.m1",
 "use": "quickfire",
 "kind": "match",
 "form": "match-it",
 "exercises": ["g1u02.s.prepositions-place", "g1u02.w.tree"],
 "stimulus": { "type": "entity", "showsDe": "Die Erdmännchen halten vier Schilder hoch." },
 "storyDe": "Bring die Schilder zu ihren Tieren zurück!",
 "pairs": [
  { "left": "The monkey", "right": "in the tree" },
  { "left": "The penguin", "right": "in the water" },
  { "left": "The lion", "right": "under the tree" },
  { "left": "The parrot", "right": "on the car" }
 ],
 "skins": ["erdmaennchen"],
 "phases": ["p2"]
}
```

### g1.paint.ch02.enc.affe.m1
```json
{
 "id": "g1.paint.ch02.enc.affe.m1",
 "use": "encounter",
 "kind": "match",
 "form": "match-it",
 "exercises": ["g1u02.s.subject-pronouns"],
 "stimulus": { "type": "entity", "showsDe": "Der Affe wirft Kokosnüsse mit Namen darauf." },
 "storyDe": "Ordne jedem Namen sein kurzes Wort zu!",
 "pairs": [
  { "left": "Maria", "right": "she" },
  { "left": "David", "right": "he" },
  { "left": "Maria and David", "right": "they" },
  { "left": "Maria and I", "right": "we" }
 ],
 "skins": ["affe"],
 "phases": ["p2"]
}
```

---

## 2 · Die Schnell-Schirm-Karten — warten auf L2-G2 (die Erdmännchen)

⚠ **Gemessener Befund (Gesetz 15b), der vom Blatt abweicht.** Das Blatt sieht diese zwei Karten
**ohne `skins`** vor, als Fallback-Pool. Gemessen am Tor ist das in ch02 dauerhaft rot, und zwar
aus zwei Gründen nacheinander: heute hebt in ch02 überhaupt kein Wesen `quickfire` (der Schwarm
kommt mit L2-G2), und sobald er kommt, hat er eigene Karten — dann gewinnt der gebundene Pool
(routing.ts Schritt 3 vor Schritt 4) und der Fallback ist beschattet. In beiden Zuständen sagt
15b „diese Karte kann nie serviert werden". Sie stehen deshalb hier **an den Schwarm gebunden**;
L2-G2 stellt das Wesen, dann können sie unverändert in die echte Datei.

### g1.paint.ch02.qf.erdmaennchen.1
```json
{
 "id": "g1.paint.ch02.qf.erdmaennchen.1",
 "use": "quickfire",
 "kind": "choice",
 "form": "name-it",
 "exercises": ["g1u02.w.behind"],
 "stimulus": { "type": "entity", "showsDe": "Ein Erdmännchen streckt sich und zeigt zum Baum." },
 "storyDe": "Der Hund sitzt HINTER dem Baum. Wie heißt das?",
 "options": ["under", "behind", "next to"],
 "answer": "behind",
 "skins": ["erdmaennchen"],
 "phases": ["p2"],
 "hints": {
  "deDesc": "Der Stamm steht zwischen dir und dem Hund.",
  "deWord": "Auf Deutsch: hinter."
 },
 "grounding": "u02 prepositions of place, g1u02.w.behind (WB p. 14–15 ex. 2)"
}
```
⚠ Deutsch-Zeile prüfen, bevor sie umzieht: Gesetz 18b vergleicht die deutsche Zeile mit der
Glosse der Antwort. „HINTER" IST die Glosse von `behind` — die Karte ist nur legal, wenn sie
`form:"command"` trägt (dann ist `storyDe` Gerüst) **oder** wenn L2-G2/L2-T2 die deutsche Zeile
umbaut, sodass sie das Ortswort nicht nennt. Beim Umzug messen, nicht annehmen.

### g1.paint.ch02.qf.erdmaennchen.2
```json
{
 "id": "g1.paint.ch02.qf.erdmaennchen.2",
 "use": "quickfire",
 "kind": "choice",
 "form": "name-it",
 "exercises": ["g1u02.w.under"],
 "stimulus": { "type": "entity", "showsDe": "Zwei Erdmännchen spähen unter den Zaun." },
 "storyDe": "Die Katze liegt UNTER dem Auto. Wie heißt das?",
 "options": ["next to", "under", "in front of"],
 "answer": "under",
 "skins": ["erdmaennchen"],
 "phases": ["p2"],
 "hints": {
  "deDesc": "Das Auto ist über ihr.",
  "deWord": "Auf Deutsch: unter."
 },
 "grounding": "u02 prepositions of place, g1u02.w.under (SB p. 19 ex. 10)"
}
```

---

## 3 · Die Arena — warten auf L2-G2 (der Löwe im Level) und L2-M-b (`GUARDIAN_BOARDS.loewe`)

Der Wächter heisst im L0-Gerüst noch `waechter`; R237 macht ihn zum **Käfig-König (Löwe)**.
Diese fünf Karten binden an den Skin `loewe` und die Phase `p4`. Vier Fenster = Tier M
(4 Knoten), dazu das Finale. R250: `choice`-Fenster tragen **kein** `evidence` (das Schema
verbietet es dort); die Beweis-Arten `mistake` und `order` tragen es.

⚠ Der Skin-Name `loewe` ist ein Vorschlag dieser Bahn — verbindlich wird er mit dem
`ch02.level.json`, das L2-G2 schreibt. Wer diese Karten umzieht, zählt die Skins zuerst am
Level aus.

### g1.paint.ch02.boss.loewe.w1
```json
{
 "id": "g1.paint.ch02.boss.loewe.w1",
 "use": "boss",
 "kind": "choice",
 "stimulus": { "type": "entity", "showsDe": "Der Löwe hält eine Stab-Platte wie ein Schild." },
 "storyDe": "Der Papagei will heim. Sag, wo sein Platz ist!",
 "promptEn": "Where's the parrot?",
 "options": ["It's under the tree.", "It's in the tree.", "It's behind the tree."],
 "answer": "It's in the tree.",
 "skins": ["loewe"],
 "phases": ["p4"],
 "hints": {
  "deDesc": "Papageien sitzen oben auf den Ästen.",
  "deWord": "Auf Deutsch: Er ist im Baum."
 },
 "grounding": "u02 Where's …? + prepositions of place (SB p. 16 Story)"
}
```

### g1.paint.ch02.boss.loewe.w2
```json
{
 "id": "g1.paint.ch02.boss.loewe.w2",
 "use": "boss",
 "kind": "mistake",
 "stimulus": { "type": "entity", "showsDe": "Auf der Platte steht ein Schild aus dem Zoo." },
 "storyDe": "Ein Wort auf dem Schild ist falsch. Finde es!",
 "sentence": ["There", "is", "a", "lion", "in", "the", "tree."],
 "errorIndex": 3,
 "fix": { "mode": "replace", "correction": "monkey" },
 "correctionOptions": ["monkey", "parrot", "penguin"],
 "evidence": ["There", "is", "a", "lion", "in", "the", "tree."],
 "skins": ["loewe"],
 "phases": ["p4"],
 "hints": {
  "deDesc": "Im Baum sitzt kein Löwe — Löwen liegen unten.",
  "deWord": "Auf Deutsch: der Affe."
 },
 "grounding": "u02 there is / there are + Tiere; die lügenden Schilder der Fiktion (BLAUPAUSE_L2 §1)"
}
```

### g1.paint.ch02.boss.loewe.w3
```json
{
 "id": "g1.paint.ch02.boss.loewe.w3",
 "use": "boss",
 "kind": "choice",
 "stimulus": { "type": "entity", "showsDe": "Die zweite Platte löst sich und wackelt." },
 "storyDe": "Der Pinguin will heim. Sag, wo sein Platz ist!",
 "promptEn": "Where's the penguin?",
 "options": ["It's in the water.", "It's on the tree.", "It's behind the car."],
 "answer": "It's in the water.",
 "skins": ["loewe"],
 "phases": ["p4"],
 "hints": {
  "deDesc": "Pinguine schwimmen und tauchen.",
  "deWord": "Auf Deutsch: Er ist im Wasser."
 },
 "grounding": "u02 prepositions of place · water: SB p. 17 Poster / WB p. 18–19 ex. 3 („It's in the water.\")"
}
```

### g1.paint.ch02.boss.loewe.w4
```json
{
 "id": "g1.paint.ch02.boss.loewe.w4",
 "use": "boss",
 "kind": "order",
 "stimulus": { "type": "entity", "showsDe": "Der Löwe kritzelt vier Wörter auf seine Platte." },
 "storyDe": "Bring die vier Wörter in die richtige Reihenfolge!",
 "orderedChips": ["There", "are", "three", "monkeys."],
 "evidence": ["three", "monkeys.", "There", "are"],
 "skins": ["loewe"],
 "phases": ["p4"],
 "hints": {
  "deDesc": "Der Satz beginnt mit dem Wort, das es gibt sagt.",
  "deWord": "Auf Deutsch: Da sind drei Affen."
 },
 "grounding": "u02 there is / there are (SB p. 16 Story: „there are three monkeys\")"
}
```
⚠ `evidence` ist **nicht frei wählbar**: Gesetz 18e verlangt genau `seededShuffle(orderedChips, id)`
— die Tafel zeigt die AUSTEILUNG, nicht die Lösung und auch keine zweite Mischung. Der Wert oben
ist mit der echten Funktion für genau diese Id gerechnet (2026-09-03). **Ändert sich die Id,
ändert sich die Kreide-Zeile** — dann neu rechnen, nicht abschreiben.

### g1.paint.ch02.fin.loewe.1
```json
{
 "id": "g1.paint.ch02.fin.loewe.1",
 "use": "finale",
 "kind": "typed",
 "stimulus": { "type": "entity", "showsDe": "Die letzte Stab-Platte fällt. Er steht ohne Panzer da." },
 "storyDe": "Sag ihm auf Englisch, wer er ist!",
 "answer": "lion",
 "accept": ["a lion", "the lion"],
 "skins": ["loewe"],
 "phases": ["p4"],
 "hints": {
  "deDesc": "Er hat eine Mähne und war der Erste, den es traf.",
  "deWord": "Auf Deutsch: der Löwe."
 },
 "grounding": "u02 wordbank g1u02.w.lion (WB p. 20–21 WORD FILE)"
}
```

---

## 3b · Was die Welle L2-T2 noch schuldet (Befund der blinden Prüfung, 2026-09-03)

Ein blinder Löser hat über den ganzen Stapel hinweg gezählt und einen echten Deckungs-Befund
gemeldet, den keine einzelne Karte zeigt: **in den 17 Karten von L2-T1 kommt als Personal-
pronomen ausschliesslich `he` vor.** `she`, `it` und `they` und die Kurzformen `she's`,
`we're`, `they're` stehen auf keiner Feld-Karte — obwohl die Unit sie ausdrücklich lehrt
(SB p. 18 Note: „I'm = I am · you're = you are · he's / she's = he is / she is · we're = we
are · they're = they are", und die Struktur `g1u02.s.subject-pronouns`).

Das ist kein Fehler dieser Karten: Fenn ist EIN Junge, seine sechs Runden können gar nichts
anderes sagen, und die Struktur-Id wird korrekt geübt. Es ist eine **Rechnung für die Welle**:
L2-T2 muss `she` (die Giraffe / die Führerin), `it` (die Dinge im Käfig — die Exemplare in
§4 dieser Datei tun das bereits) und `they` (die Erdmännchen, die drei Affen) auf Feld-Karten
bringen, sonst lehrt ch02 ein Viertel seiner eigenen Grammatik nur im Vorbeigehen.

Zweiter Befund derselben Zählung, kleiner: alle sechs Fenn-Runden fragen wortgleich
„Where is he?". Das ist die Zeremonie-Form (dieselbe wie Merles „What do you say?" in ch01,
darum die erklärte Familie `fenn-ceremony` mit ihrer 16c-Ausnahme) — beim Lesen des Stapels
am Stück fällt es aber auf. Wenn L2-T2 die Zeremonie anfasst, ist das die Stelle.

---

## 4 · Je ein Exemplar für die Wesen, die L2-G2 ins Level stellt

Diese fünf zeigen der Welle L2-T2, welche Form je Wesen gemeint ist. Die Skin-Namen sind
Vorschläge; das Level entscheidet.

⚠ **Formen-Gesetz beim Umzug (14b):** zwei feindliche Wesen im selben Raum dürfen nicht
dieselbe Form fragen. p2 bekommt mit L2-G2 den Affen (gunner) und die Erdmännchen (swarm),
p3 den Papagei (flyer) und den Elefanten-Rüssel (crusher) — beim Umzug die Formen des Raumes
zählen, nicht die Karte einzeln prüfen.

### g1.paint.ch02.enc.affe.k1
```json
{
 "id": "g1.paint.ch02.enc.affe.k1",
 "use": "encounter",
 "kind": "choice",
 "form": "pick-correct-form",
 "exercises": ["g1u02.s.there-is-are", "g1u02.w.monkey"],
 "stimulus": { "type": "entity", "showsDe": "Der Affe wirft eine Kokosnuss mit einem Zettel." },
 "storyDe": "Auf dem Zettel steht Unsinn. Welcher Satz stimmt?",
 "options": ["There is a monkey.", "There are a monkey.", "There a monkey."],
 "answer": "There is a monkey.",
 "skins": ["affe"],
 "phases": ["p2"],
 "hints": {
  "deDesc": "Einer nur, also Einzahl.",
  "deWord": "Auf Deutsch: Da ist ein Affe."
 },
 "grounding": "u02 there is / there are · monkey: g1u02.w.monkey"
}
```

### g1.paint.ch02.enc.papagei.a1
```json
{
 "id": "g1.paint.ch02.enc.papagei.a1",
 "use": "encounter",
 "kind": "choice",
 "form": "ask-it",
 "exercises": ["g1u02.w.parrot", "g1u02.s.prepositions-place"],
 "stimulus": { "type": "entity", "showsDe": "Der Papagei stürzt herab und ist gleich wieder weg." },
 "storyDe": "Er verschwindet im Geäst. Stell die Frage!",
 "options": ["What's the parrot?", "Where's the parrot?", "How old is the parrot?"],
 "answer": "Where's the parrot?",
 "skins": ["papagei"],
 "phases": ["p3"],
 "hints": {
  "deDesc": "Du willst den Platz wissen, nicht das Alter.",
  "deWord": "Auf Deutsch: Wo ist der Papagei?"
 },
 "grounding": "u02 Where's …? (SB p. 16 Story, wörtlich: „Where's the parrot?\")"
}
```

### g1.paint.ch02.rsc.zoozug.1
```json
{
 "id": "g1.paint.ch02.rsc.zoozug.1",
 "use": "rescue",
 "kind": "choice",
 "form": "state-it",
 "exercises": ["g1u02.w.train"],
 "stimulus": { "type": "entity", "showsDe": "Hinter den Gittern steht der Zug." },
 "storyDe": "Sag auf Englisch, was da drinsteckt!",
 "promptEn": "What is it?",
 "options": ["It's a car.", "It's a train.", "It's a stone."],
 "answer": "It's a train.",
 "skins": ["zoozug"],
 "phases": ["p2"],
 "hints": {
  "deDesc": "Er fährt die Gäste durch den ganzen Zoo.",
  "deWord": "Auf Deutsch: der Zug."
 },
 "grounding": "u02 wordbank g1u02.w.train · Insasse aus Kokis Entscheid (BLAUPAUSE_L2 §4)"
}
```
⚠ Beim Umzug `nounDe.captives["rsc.zoozug.1"] = "Zug"` in `ch02.policy.json` ergänzen — sonst
meldet 18d „obliges nounDe, but no German noun is declared".

### g1.paint.ch02.rsc.stein.1
```json
{
 "id": "g1.paint.ch02.rsc.stein.1",
 "use": "rescue",
 "kind": "choice",
 "form": "state-it",
 "exercises": ["g1u02.w.stone"],
 "stimulus": { "type": "entity", "showsDe": "Hinter den Gittern liegt der bunte Stein." },
 "storyDe": "Sag auf Englisch, was da drinsteckt!",
 "promptEn": "What is it?",
 "options": ["It's a stone.", "It's a tree.", "It's a car."],
 "answer": "It's a stone.",
 "skins": ["stein"],
 "phases": ["p3"],
 "hints": {
  "deDesc": "So einer wie am Ende von Unit 2 im Buch.",
  "deWord": "Auf Deutsch: der Stein."
 },
 "grounding": "u02 wordbank g1u02.w.stone (SB p. 21 THE STORY OF THE STONES) · Insasse aus Kokis Entscheid"
}
```
⚠ Zwei Dinge beim Umzug: `nounDe.captives["rsc.stein.1"] = "Stein"`, und die deutsche Zeile
sagt „bunte" — das **Entsättigungs-Gesetz** verbietet ein Farbwort im `showsDe` eines
entfärbten Wesens (`checkDesaturation`, Rollen chaser/gunner/flyer/bouncer/crusher/swarm/cage/
drained/classmate). Ein Käfig IST so eine Rolle: „bunte" muss vor dem Umzug fallen.

### g1.paint.ch02.enc.elefant.c1
```json
{
 "id": "g1.paint.ch02.enc.elefant.c1",
 "use": "encounter",
 "kind": "choice",
 "form": "command",
 "exercises": ["g1u02.w.us"],
 "stimulus": { "type": "entity", "showsDe": "Der Rüssel kommt herunter und versperrt den Gang." },
 "storyDe": "Sag dem Rüssel, er soll euch DURCHLASSEN!",
 "options": ["Let me see.", "Bring your dog.", "Let us out!"],
 "answer": "Let us out!",
 "skins": ["elefant"],
 "phases": ["p3"],
 "hints": {
  "deDesc": "Ihr wollt alle vorbei, nicht nur du.",
  "deWord": "Auf Deutsch: Lasst uns durch!"
 },
 "grounding": "u02 Chant (SB p. 18 ex. 9: „Let us out.\") · g1u02.w.us"
}
```
